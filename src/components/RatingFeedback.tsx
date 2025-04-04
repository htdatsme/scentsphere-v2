
import React from 'react';
import { useRecommendationStore } from '@/lib/store';
import { enhancedRecommendationEngine } from '@/lib/ml/enhancedRecommendationEngine';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

interface RatingFeedbackProps {
  fragranceId: number;
  initialRating?: number;
  showThumbControls?: boolean;
  className?: string;
}

const RatingFeedback: React.FC<RatingFeedbackProps> = ({
  fragranceId,
  initialRating = 0,
  showThumbControls = true,
  className = '',
}) => {
  const [rating, setRating] = React.useState<number>(initialRating);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [hasRated, setHasRated] = React.useState<boolean>(false);
  
  const { 
    scentProfile,
    likedNotes,
    dislikedNotes,
    addLikedNote,
    addDislikedNote
  } = useRecommendationStore();

  // Handle rating click
  const handleRating = (selectedRating: number) => {
    setRating(selectedRating);
    setHasRated(true);
    
    // Send rating feedback
    if (scentProfile) {
      // Process feedback through recommendation engine
      const isLiked = selectedRating >= 4;
      const isDisliked = selectedRating <= 2;
      
      if (isLiked) {
        enhancedRecommendationEngine.processUserFeedback(
          [fragranceId], // liked
          [], // disliked
          scentProfile
        );
        toast.success("Thanks for your feedback! We'll improve your recommendations.");
      } else if (isDisliked) {
        enhancedRecommendationEngine.processUserFeedback(
          [], // liked
          [fragranceId], // disliked
          scentProfile
        );
        toast.success("Thanks for your feedback! We'll adjust your recommendations.");
      }
    }
  };

  // Thumb up/down handlers
  const handleThumbUp = () => {
    handleRating(5);
  };

  const handleThumbDown = () => {
    handleRating(1);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {showThumbControls ? (
        <div className="flex items-center gap-2 mb-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 rounded-full ${rating === 1 ? 'bg-destructive/20 text-destructive' : ''}`}
            onClick={handleThumbDown}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`star-${star}`}
                type="button"
                className="p-0 bg-transparent border-none cursor-pointer"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRating(star)}
              >
                <Star
                  className={`h-5 w-5 ${
                    (hoverRating || rating) >= star
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 rounded-full ${rating === 5 ? 'bg-primary/20 text-primary' : ''}`}
            onClick={handleThumbUp}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={`star-${star}`}
              type="button"
              className="p-0 bg-transparent border-none cursor-pointer"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRating(star)}
            >
              <Star
                className={`h-5 w-5 ${
                  (hoverRating || rating) >= star
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {hasRated && (
        <div className="text-xs text-muted-foreground mt-1">
          {rating >= 4 
            ? "Thank you! We'll recommend more like this." 
            : rating <= 2 
              ? "We'll show fewer like this in the future."
              : "Thanks for your feedback!"}
        </div>
      )}
    </div>
  );
};

export default RatingFeedback;
