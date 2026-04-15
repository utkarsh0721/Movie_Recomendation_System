import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({
  value = 0,
  onChange,
  readOnly = false,
  size = 20,
  className = "",
}) => {
  const [hovered, setHovered] = useState(0);
  const activeRating = hovered || value;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: 5 }, (_, index) => {
        const rating = index + 1;
        const filled = rating <= activeRating;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => !readOnly && onChange?.(rating)}
            onMouseEnter={() => !readOnly && setHovered(rating)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            className={`focus:outline-none transition-colors ${!readOnly ? "cursor-pointer" : "cursor-default"}`}
            aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
            style={{ width: size, height: size }}
          >
            <Star
              style={{ width: size, height: size }}
              className={
                filled ? "text-yellow-400 fill-yellow-400" : "text-dark-500"
              }
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
