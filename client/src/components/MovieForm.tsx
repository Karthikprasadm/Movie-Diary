import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertMovieSchema, Movie } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface MovieFormProps {
  isOpen: boolean;
  movie: Movie | null;
  onClose: () => void;
  onSubmit: (movie: any) => void;
  isPending: boolean;
}

// Extend the schema with stricter validation
const formSchema = insertMovieSchema.extend({
  title: z.string().min(1, "Title is required"),
  genre: z.string().min(1, "Genre is required"),
  rating: z.preprocess((val) => {
    return typeof val === "string" ? parseFloat(val) : val;
  }, z.number().min(1).max(10)),
  posterUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const GENRES = [
  "Action", "Comedy", "Drama", "Horror", "Sci-Fi", 
  "Thriller", "Crime", "Fantasy", "Animation", "Adventure"
];

export default function MovieForm({ isOpen, movie, onClose, onSubmit, isPending }: MovieFormProps) {
  const [ratingValue, setRatingValue] = useState(movie?.rating || 5);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      genre: "",
      rating: 5,
      watched: false,
      review: "",
      posterUrl: "",
    },
  });
  
  // Reset form when movie changes
  useEffect(() => {
    if (movie) {
      form.reset({
        title: movie.title,
        genre: movie.genre,
        rating: movie.rating,
        watched: movie.watched,
        review: movie.review || "",
        posterUrl: movie.posterUrl || "",
      });
      setRatingValue(movie.rating);
    } else {
      form.reset({
        title: "",
        genre: "",
        rating: 5,
        watched: false,
        review: "",
        posterUrl: "",
      });
      setRatingValue(5);
    }
  }, [movie, form]);
  
  const handleSubmit = (values: FormValues) => {
    if (movie) {
      onSubmit({ ...values, id: movie.id });
    } else {
      onSubmit(values);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="movie-form-dialog-desc">
        <div id="movie-form-dialog-desc" style={{ display: 'none' }}>
          This dialog allows you to add or edit a movie.
        </div>
        <DialogHeader>
          <DialogTitle>{movie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Movie title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENRES.map((genre) => (
                        <SelectItem key={genre.toLowerCase()} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating ({ratingValue.toFixed(1)})</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={0.1}
                      value={[ratingValue]}
                      onValueChange={(values) => {
                        const value = values[0];
                        setRatingValue(value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="watched"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I've watched this movie</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your thoughts on this movie"
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="posterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poster URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/poster.jpg" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Link to a movie poster image
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Processing..." : movie ? "Save Changes" : "Add Movie"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
