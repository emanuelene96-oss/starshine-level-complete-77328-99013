import { useEffect, useState } from 'react';
import { Star, Trophy, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CongratulationsPopupProps {
  isOpen: boolean;
  stars: number;
  moves: number;
  level: number;
  bottleCount: number;
  onNextLevel: () => void;
  onBackToMenu: () => void;
  onClose: () => void;
}

const CongratulationsPopup = ({ 
  isOpen, 
  stars, 
  moves, 
  level,
  bottleCount,
  onNextLevel,
  onBackToMenu,
  onClose 
}: CongratulationsPopupProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateStars, setAnimateStars] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setTimeout(() => setAnimateStars(true), 500);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setShowConfetti(false);
      setAnimateStars(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getPerformanceMessage = () => {
    switch (stars) {
      case 3:
        return "Perfect! You're a puzzle master! 🏆";
      case 2:
        return "Great job! Well solved! 🎉";
      default:
        return "Good work! Keep practicing! 💪";
    }
  };

  const getStarText = () => {
    const baseTarget = 6 + (bottleCount - 4) * 2;
    if (moves <= baseTarget * 0.6) return "Excellent efficiency!";
    if (moves <= baseTarget) return "Good strategy!";
    return "Room for improvement!";
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-bounce-in"
        onClick={onClose}
      />

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 20}%`,
                backgroundColor: [
                  'hsl(45, 100%, 60%)',
                  'hsl(260, 100%, 65%)',
                  'hsl(150, 85%, 45%)',
                  'hsl(0, 85%, 60%)',
                ][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Popup */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="bg-surface-elevated border border-border rounded-2xl shadow-popup p-8 max-w-md w-full animate-bounce-in">
          {/* Trophy Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-celebration rounded-full p-4 shadow-elevated">
              <Trophy className="w-8 h-8 text-accent-foreground" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">
            Level {level} Complete! 🎉
          </h2>

          {/* Performance Message */}
          <p className="text-center text-muted-foreground mb-6">
            {getPerformanceMessage()}
          </p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-8 h-8 transition-all duration-500",
                  i < stars
                    ? "text-star-gold fill-star-gold"
                    : "text-star-silver fill-star-silver",
                  animateStars && i < stars && "animate-star-twinkle",
                )}
                style={{
                  animationDelay: `${i * 200}ms`,
                }}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="bg-surface rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Level:</span>
              <span className="font-semibold text-foreground">{level}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Bottles:</span>
              <span className="font-semibold text-foreground">{bottleCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Moves:</span>
              <span className="font-semibold text-foreground">{moves}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rating:</span>
              <span className="font-semibold text-star-gold">
                {stars} Star{stars !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-center text-muted-foreground">{getStarText()}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBackToMenu}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Menu
            </Button>
            <Button
              onClick={onNextLevel}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow border-0 hover:shadow-elevated"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Next Level
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CongratulationsPopup;