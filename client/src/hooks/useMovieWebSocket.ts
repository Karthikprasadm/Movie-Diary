import { useEffect, useRef } from "react";

export function useMovieWebSocket(onMovieChange: () => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to the backend WebSocket server
    const ws = new WebSocket("ws://127.0.0.1:5000");
    wsRef.current = ws;

    ws.onopen = () => {
      // Connection established
      // console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "movie-change") {
          onMovieChange();
        }
      } catch (err) {
        // Ignore invalid messages
      }
    };

    ws.onerror = () => {
      // console.error("WebSocket error");
    };

    ws.onclose = () => {
      // console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [onMovieChange]);
} 