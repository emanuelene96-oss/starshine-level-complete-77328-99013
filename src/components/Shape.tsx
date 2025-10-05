import { cn } from "@/lib/utils";

export type ShapeType = "square" | "circle" | "triangle" | "hexagon" | "diamond" | "star" | "heart" | "pentagon";
export type ShapeColor = "red" | "green" | "blue" | "orange" | "purple" | "pink" | "teal" | "yellow";

interface ShapeProps {
  type: ShapeType;
  color: ShapeColor;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const shapeColorClasses = {
  red: "from-bottle-red to-bottle-red-glow shadow-[0_8px_25px_hsl(var(--bottle-red)_/_0.4)]",
  green: "from-bottle-green to-bottle-green-glow shadow-[0_8px_25px_hsl(var(--bottle-green)_/_0.4)]",
  blue: "from-bottle-blue to-bottle-blue-glow shadow-[0_8px_25px_hsl(var(--bottle-blue)_/_0.4)]",
  orange: "from-bottle-orange to-bottle-orange-glow shadow-[0_8px_25px_hsl(var(--bottle-orange)_/_0.4)]",
  purple: "from-bottle-purple to-bottle-purple-glow shadow-[0_8px_25px_hsl(var(--bottle-purple)_/_0.4)]",
  pink: "from-bottle-pink to-bottle-pink-glow shadow-[0_8px_25px_hsl(var(--bottle-pink)_/_0.4)]",
  teal: "from-bottle-teal to-bottle-teal-glow shadow-[0_8px_25px_hsl(var(--bottle-teal)_/_0.4)]",
  yellow: "from-bottle-yellow to-bottle-yellow-glow shadow-[0_8px_25px_hsl(var(--bottle-yellow)_/_0.4)]",
};

const renderShape = (type: ShapeType, color: ShapeColor) => {
  const colorClass = shapeColorClasses[color];
  
  switch (type) {
    case "square":
      return (
        <div className={cn(
          "w-20 h-20 bg-gradient-to-br rounded-lg border-2 border-white/30",
          colorClass
        )}>
          <div className="absolute inset-2 bg-white/20 rounded-md" />
        </div>
      );
    
    case "circle":
      return (
        <div className={cn(
          "w-20 h-20 bg-gradient-to-br rounded-full border-2 border-white/30",
          colorClass
        )}>
          <div className="absolute inset-2 bg-white/20 rounded-full" />
        </div>
      );
    
    case "triangle":
      return (
        <div className="relative w-20 h-20">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br border-2 border-white/30",
            colorClass
          )}
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"
            }}
          >
            <div className="absolute inset-2 bg-white/20" 
              style={{
                clipPath: "polygon(50% 10%, 10% 90%, 90% 90%)"
              }}
            />
          </div>
        </div>
      );
    
    case "hexagon":
      return (
        <div className="relative w-20 h-20">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br border-2 border-white/30",
            colorClass
          )}
            style={{
              clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
            }}
          >
            <div className="absolute inset-2 bg-white/20"
              style={{
                clipPath: "polygon(25% 5%, 75% 5%, 95% 50%, 75% 95%, 25% 95%, 5% 50%)"
              }}
            />
          </div>
        </div>
      );
    
    case "diamond":
      return (
        <div className="relative w-20 h-20">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br border-2 border-white/30",
            colorClass
          )}
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
            }}
          >
            <div className="absolute inset-2 bg-white/20"
              style={{
                clipPath: "polygon(50% 10%, 90% 50%, 50% 90%, 10% 50%)"
              }}
            />
          </div>
        </div>
      );
    
    case "star":
      return (
        <div className="relative w-20 h-20">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br border-2 border-white/30",
            colorClass
          )}
            style={{
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
            }}
          >
            <div className="absolute inset-3 bg-white/20"
              style={{
                clipPath: "polygon(50% 15%, 58% 38%, 80% 38%, 63% 52%, 70% 75%, 50% 63%, 30% 75%, 37% 52%, 20% 38%, 42% 38%)"
              }}
            />
          </div>
        </div>
      );
    
    case "heart":
      return (
        <div className="relative w-20 h-20">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br border-2 border-white/30",
            colorClass
          )}
            style={{
              clipPath: "polygon(50% 25%, 60% 10%, 75% 10%, 90% 25%, 90% 40%, 50% 90%, 10% 40%, 10% 25%, 25% 10%, 40% 10%)"
            }}
          >
            <div className="absolute inset-2 bg-white/20"
              style={{
                clipPath: "polygon(50% 30%, 58% 18%, 70% 18%, 82% 30%, 82% 42%, 50% 82%, 18% 42%, 18% 30%, 30% 18%, 42% 18%)"
              }}
            />
          </div>
        </div>
      );
    
    case "pentagon":
      return (
        <div className="relative w-20 h-20">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br border-2 border-white/30",
            colorClass
          )}
            style={{
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"
            }}
          >
            <div className="absolute inset-2 bg-white/20"
              style={{
                clipPath: "polygon(50% 10%, 90% 40%, 78% 90%, 22% 90%, 10% 40%)"
              }}
            />
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

export const Shape = ({ type, color, isSelected, onClick, disabled }: ShapeProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative transition-all duration-300 ease-out",
        "hover:scale-105 active:scale-95",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        isSelected && [
          "scale-110 ring-4 ring-accent",
          "shadow-[0_0_30px_hsl(var(--accent)_/_0.6)]"
        ]
      )}
    >
      <div className="relative w-20 h-20">
        {renderShape(type, color)}
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full border-2 border-white animate-pulse z-10">
            <div className="w-full h-full bg-accent rounded-full animate-ping" />
          </div>
        )}
        
        {/* Shadow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-2 bg-black/20 rounded-full blur-sm" />
      </div>
    </button>
  );
};
