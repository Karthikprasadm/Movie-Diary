import { Movie } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Edit, Trash } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  const { title, genre, rating, watched, review, posterUrl } = movie;
  
  // Use a fallback image if posterUrl is not provided
  const poster = posterUrl || "https://images.unsplash.com/photo-1509281373149-e957c6296406?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200";

  return (
    <Card className="movie-card overflow-hidden shadow-md">
      <div className="relative pb-[150%]">
        <img 
          src={poster} 
          alt={`${title} Poster`} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-sm m-2 rounded-md">
          <span className="rating-star">★</span> {rating.toFixed(1)}
        </div>
        <div className="absolute top-0 left-0 bg-secondary text-white px-2 py-1 text-sm m-2 rounded-md">
          {genre}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white text-xl font-medium mb-1">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-3">
          {watched ? (
            <>
              <Eye className="text-secondary mr-2 h-5 w-5" />
              <span className="text-muted-foreground">Watched</span>
            </>
          ) : (
            <>
              <EyeOff className="text-secondary mr-2 h-5 w-5" />
              <span className="text-muted-foreground">Not Watched</span>
            </>
          )}
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {review || 'No review yet.'}
        </p>
        <div className="flex justify-between items-center">
          <button 
            className="text-primary hover:bg-primary/10 rounded-full p-2 transition-colors"
            onClick={onEdit}
            aria-label="Edit Movie"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button 
            className="text-destructive hover:bg-destructive/10 rounded-full p-2 transition-colors"
            onClick={onDelete}
            aria-label="Delete Movie"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
