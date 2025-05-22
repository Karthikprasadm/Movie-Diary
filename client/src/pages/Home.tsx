import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Movie, MovieFilter, MovieSort } from "@shared/schema";
import MovieCard from "@/components/MovieCard";
import MovieForm from "@/components/MovieForm";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import FilterControls from "@/components/FilterControls";
import EmptyState from "@/components/EmptyState";
import { useMovieWebSocket } from "@/hooks/useMovieWebSocket";

export default function Home() {
  const { toast } = useToast();
  
  // State for filter and sort
  const [filter, setFilter] = useState<MovieFilter>({ 
    genre: undefined,
    watched: "all"
  });
  const [sort, setSort] = useState<MovieSort>("default");
  
  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  // Fetch movies
  const { data: movies = [], isLoading } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  // Real-time updates: refetch movies on WebSocket change
  useMovieWebSocket(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
  });

  // Add movie mutation
  const addMovieMutation = useMutation({
    mutationFn: (newMovie: Omit<Movie, "id">) => {
      return apiRequest("POST", "/api/movies", newMovie);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      toast({
        title: "Success",
        description: "Movie added successfully",
      });
      setIsAddModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add movie: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update movie mutation
  const updateMovieMutation = useMutation({
    mutationFn: (movie: Movie) => {
      return apiRequest("PUT", `/api/movies/${movie.id}`, movie);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      toast({
        title: "Success",
        description: "Movie updated successfully",
      });
      setEditingMovie(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update movie: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete movie mutation
  const deleteMovieMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/movies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      toast({
        title: "Success",
        description: "Movie deleted successfully",
      });
      setMovieToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete movie: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const handleAddMovie = (movie: Omit<Movie, "id">) => {
    addMovieMutation.mutate(movie);
  };

  const handleUpdateMovie = (movie: Movie) => {
    updateMovieMutation.mutate(movie);
  };

  const handleDeleteMovie = (id: number) => {
    deleteMovieMutation.mutate(id);
  };

  // Filter and sort movies
  const filteredAndSortedMovies = movies
    .filter((movie: Movie) => {
      if (filter.genre && movie.genre.toLowerCase() !== filter.genre.toLowerCase()) {
        return false;
      }
      if (filter.watched === "watched" && !movie.watched) {
        return false;
      }
      if (filter.watched === "unwatched" && movie.watched) {
        return false;
      }
      return true;
    })
    .sort((a: Movie, b: Movie) => {
      switch (sort) {
        case "rating-desc":
          return b.rating - a.rating;
        case "rating-asc":
          return a.rating - b.rating;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-medium text-primary mb-4 md:mb-0">Favorite Movies List</h1>
          <FilterControls 
            filter={filter} 
            sort={sort} 
            onFilterChange={setFilter} 
            onSortChange={setSort} 
          />
        </div>
      </header>

      {/* Movie List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden shadow-md animate-pulse">
              <div className="relative pb-[150%] bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredAndSortedMovies.map((movie: Movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onEdit={() => setEditingMovie(movie)}
              onDelete={() => setMovieToDelete(movie)}
            />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <span className="text-4xl mb-2">🔍</span>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Movies Match Your Filters</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or add new movies</p>
          <button 
            className="text-primary hover:underline" 
            onClick={() => setFilter({ genre: undefined, watched: "all" })}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <EmptyState onAddMovie={() => setIsAddModalOpen(true)} />
      )}

      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-6">
        <button
          className="bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
          onClick={() => setIsAddModalOpen(true)}
          aria-label="Add Movie"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>

      {/* Movie Form Modal */}
      {(isAddModalOpen || editingMovie) && (
        <MovieForm
          isOpen={true}
          movie={editingMovie}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingMovie(null);
          }}
          onSubmit={editingMovie ? handleUpdateMovie : handleAddMovie}
          isPending={addMovieMutation.isPending || updateMovieMutation.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      {movieToDelete && (
        <DeleteConfirmation
          movie={movieToDelete}
          isOpen={true}
          onClose={() => setMovieToDelete(null)}
          onConfirm={() => handleDeleteMovie(movieToDelete.id)}
          isPending={deleteMovieMutation.isPending}
        />
      )}
    </div>
  );
}
