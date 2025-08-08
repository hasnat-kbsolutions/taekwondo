import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
}

const RatingStars: React.FC<RatingStarsProps> = ({
    rating,
    onRatingChange,
    readonly = false,
    size = "md",
}) => {
    const stars = [1, 2, 3, 4, 5];

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    const handleStarClick = (starRating: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(starRating);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    disabled={readonly}
                    className={`${
                        readonly
                            ? "cursor-default"
                            : "cursor-pointer hover:scale-110 transition-transform"
                    }`}
                >
                    <Star
                        className={`${sizeClasses[size]} ${
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};

export default RatingStars;
