import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  genre: text("genre").notNull(),
  rating: real("rating").notNull().default(5),
  watched: boolean("watched").notNull().default(false),
  review: text("review"),
  posterUrl: text("poster_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
});

export const movieFilterSchema = z.object({
  genre: z.string().optional(),
  watched: z.enum(["all", "watched", "unwatched"]).optional(),
});

export const movieSortSchema = z.enum([
  "default",
  "rating-desc",
  "rating-asc",
  "title-asc",
  "title-desc",
]);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;
export type MovieFilter = z.infer<typeof movieFilterSchema>;
export type MovieSort = z.infer<typeof movieSortSchema>;
