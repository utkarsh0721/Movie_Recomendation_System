import { Star } from "lucide-react";
import { timeAgo } from "../utils/helpers";

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-dark-900 rounded-3xl border border-dark-800 p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <p className="text-white font-semibold">
            {review.user?.name || "Anonymous"}
          </p>
          <p className="text-sm text-dark-400">{timeAgo(review.createdAt)}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={
                index < review.rating
                  ? "w-4 h-4 text-yellow-400 fill-yellow-400"
                  : "w-4 h-4 text-dark-500"
              }
            />
          ))}
        </div>
      </div>
      <p className="text-dark-300 leading-relaxed">
        {review.reviewText || "This reviewer did not add additional comments."}
      </p>
    </div>
  );
};

export default ReviewCard;
