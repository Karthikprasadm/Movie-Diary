import { MovieFilter, MovieSort } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterControlsProps {
  filter: MovieFilter;
  sort: MovieSort;
  onFilterChange: (filter: MovieFilter) => void;
  onSortChange: (sort: MovieSort) => void;
}

export default function FilterControls({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}: FilterControlsProps) {
  // List of genres
  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Thriller",
    "Crime",
    "Fantasy",
    "Animation",
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
      <Select
        value={sort}
        onValueChange={(value) => onSortChange(value as MovieSort)}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Sort By</SelectItem>
          <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
          <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
          <SelectItem value="title-asc">Title (A-Z)</SelectItem>
          <SelectItem value="title-desc">Title (Z-A)</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filter.genre || ""}
        onValueChange={(value) =>
          onFilterChange({ ...filter, genre: value === "" ? undefined : value })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Genres" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre.toLowerCase()} value={genre.toLowerCase()}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filter.watched || "all"}
        onValueChange={(value) =>
          onFilterChange({
            ...filter,
            watched: value as "all" | "watched" | "unwatched",
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Movies" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Movies</SelectItem>
          <SelectItem value="watched">Watched</SelectItem>
          <SelectItem value="unwatched">Unwatched</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
