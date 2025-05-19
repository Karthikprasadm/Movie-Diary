import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";

interface EmptyStateProps {
  onAddMovie: () => void;
}

export default function EmptyState({ onAddMovie }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Film className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-medium text-gray-600 mb-2">No Movies Found</h3>
      <p className="text-muted-foreground mb-6">
        Start adding your favorite movies to create your collection
      </p>
      <Button onClick={onAddMovie} className="rounded-full px-6">
        Add Your First Movie
      </Button>
    </div>
  );
}
