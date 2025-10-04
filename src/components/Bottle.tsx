import { cn } from "@/lib/utils";

export type BottleColor = "red" | "green" | "blue" | "orange" | "purple" | "pink" | "teal" | "yellow";

interface BottleProps {
  color: BottleColor;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const bottleColorClasses = {
  red: "from-bottle-red to-bottle-red-glow shadow-[0_8px_25px_hsl(var(--bottle-red)_/_0.4)]",
  green: "from-bottle-green to-bottle-green-glow shadow-[0_8px_25px_hsl(var(--bottle-green)_/_0.4)]",
  blue: "from-bottle-blue to-bottle-blue-glow shadow-[0_8px_25px_hsl(var(--bottle-blue)_/_0.4)]",
  orange: "from-bottle-orange to-bottle-orange-glow shadow-[0_8px_25px_hsl(var(--bottle-orange)_/_0.4)]",
  purple: "from-bottle-purple to-bottle-purple-glow shadow-[0_8px_25px_hsl(var(--bottle-purple)_/_0.4)]",
  pink: "from-bottle-pink to-bottle-pink-glow shadow-[0_8px_25px_hsl(var(--bottle-pink)_/_0.4)]",
  teal: "from-bottle-teal to-bottle-teal-glow shadow-[0_8px_25px_hsl(var(--bottle-teal)_/_0.4)]",
  yellow: "from-bottle-yellow to-bottle-yellow-glow shadow-[0_8px_25px_hsl(var(--bottle-yellow)_/_0.4)]",
};

export const Bottle = ({ color, isSelected, onClick, disabled }: BottleProps) => {
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
      {/* Bottle shape container */}
      <div className="relative w-20 h-32">
        {/* Bottle neck */}
        <div className={cn(
          "absolute top-0 left-1/2 transform -translate-x-1/2",
          "w-6 h-8 bg-gradient-to-b rounded-t-lg border-2 border-white/30",
          bottleColorClasses[color]
        )} />

        {/* Bottle body */}
        <div className={cn(
          "absolute top-6 left-1/2 transform -translate-x-1/2",
          "w-16 h-24 bg-gradient-to-b rounded-3xl border-2 border-white/20",
          bottleColorClasses[color]
        )}>
          {/* Bottle highlight effect */}
          <div className="absolute inset-x-2 top-2 h-6 bg-white/40 rounded-full blur-sm" />

          {/* Bottle liquid effect */}
          <div className={cn(
            "absolute bottom-2 left-1/2 transform -translate-x-1/2",
            "w-12 h-16 rounded-2xl opacity-80",
            `bg-gradient-to-t ${bottleColorClasses[color].split(' ')[0]} ${bottleColorClasses[color].split(' ')[1]}`
          )} />
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full border-2 border-white animate-pulse z-10">
            <div className="w-full h-full bg-accent rounded-full animate-ping" />
          </div>
        )}

        {/* Bottle base shadow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-2 bg-black/20 rounded-full blur-sm" />
      </div>
    </button>
  );
};