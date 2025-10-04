import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled: boolean;
}

const GameCard = ({ id, symbol, isFlipped, isMatched, onClick, disabled }: GameCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled || isFlipped || isMatched || isAnimating) return;
    
    setIsAnimating(true);
    onClick();
    
    // Reset animation state after flip completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div
      className={cn(
        "relative w-20 h-20 cursor-pointer perspective-1000",
        disabled && "cursor-not-allowed"
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-600 transform-style-preserve-3d",
          (isFlipped || isMatched) && "rotate-y-180",
          isAnimating && "animate-flip"
        )}
      >
        {/* Card Back */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-xl backface-hidden",
            "bg-gradient-primary border border-primary shadow-card",
            "flex items-center justify-center",
            "hover:shadow-glow hover:scale-105 transition-all duration-300",
            "before:absolute before:inset-0 before:rounded-xl",
            "before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0",
            "hover:before:opacity-100 before:transition-opacity before:duration-300"
          )}
        >
          <div className="text-2xl font-bold text-primary-foreground">?</div>
        </div>

        {/* Card Front */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-xl backface-hidden rotate-y-180",
            "border shadow-card flex items-center justify-center",
            "text-3xl font-bold transition-all duration-300",
            isMatched
              ? "bg-gradient-success border-game-success text-white animate-pulse-glow"
              : "bg-gradient-card border-border text-card-foreground"
          )}
        >
          {symbol}
        </div>
      </div>
    </div>
  );
};

export default GameCard;