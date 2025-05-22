import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { WebSocketServer } from "ws";
import { MovieModel } from "./mongodb";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // WebSocket server setup
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
  });

  // MongoDB change stream for movies collection
  try {
    if (mongoose.connection && mongoose.connection.db) {
      const admin = mongoose.connection.db.admin();
      admin.replSetGetStatus().then((status: any) => {
        if (status && status.setName) {
          const movieStream = MovieModel.watch([], { fullDocument: "updateLookup" });
          movieStream.on("change", async (change) => {
            wss.clients.forEach((client) => {
              if (client.readyState === 1) {
                client.send(JSON.stringify({ type: "movie-change", data: change }));
              }
            });
          });
          console.log("WebSocket: MongoDB change stream set up for movies collection");
        } else {
          console.warn("MongoDB is not running as a replica set. Change streams are disabled.");
        }
      }).catch(() => {
        console.warn("MongoDB is not running as a replica set. Change streams are disabled.");
      });
    } else {
      console.warn("MongoDB connection.db is undefined. Skipping change streams.");
    }
  } catch (err) {
    console.error("WebSocket: Error setting up MongoDB change stream", err);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
