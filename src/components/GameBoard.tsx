import { useState, useEffect } from "react";
import { Shape, type ShapeType, type ShapeColor } from "./Shape";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Lightbulb } from "lucide-react";
import CongratulationsPopup from "./CongratulationsPopup";

interface GameBoardProps {
  onBackToMenu: () => void;
  playerName: string;
}

const AVAILABLE_COLORS: ShapeColor[] = ["red", "green", "blue", "orange", "purple", "pink", "teal", "yellow"];
const AVAILABLE_SHAPES: ShapeType[] = ["square", "circle", "triangle", "hexagon", "diamond", "star", "heart", "pentagon"];

interface GameShape {
  type: ShapeType;
  color: ShapeColor;
}

const getShapeCountForLevel = (level: number): number => {
  // Start with 4 shapes, increase by 1 every 10 levels, cap at 8
  return Math.min(8, 4 + Math.floor((level - 1) / 10));
};

export const GameBoard = ({ onBackToMenu, playerName }: GameBoardProps) => {
  const [level, setLevel] = useState(1);
  const shapeCount = getShapeCountForLevel(level);
  const [visible, setVisible] = useState<GameShape[]>([]);
  const [target, setTarget] = useState<GameShape[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showHintPrompt, setShowHintPrompt] = useState(false);
  const [totalStars, setTotalStars] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [levelsCompleted, setLevelsCompleted] = useState(0);
  const [completedLevel, setCompletedLevel] = useState(1);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [level]);


  const shuffle = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = (resetLevel = false) => {
    if (resetLevel) {
      setLevel(1);
    }

    // Randomly select 4 different shapes for this level
    const selectedShapes = shuffle(AVAILABLE_SHAPES).slice(0, shapeCount);
    const colors = AVAILABLE_COLORS.slice(0, shapeCount);
    
    // Create shape-color pairs
    const shapes: GameShape[] = selectedShapes.map((type, index) => ({
      type,
      color: colors[index]
    }));

    const targetArrangement = shuffle(shapes);
    let visibleArrangement;

    // Ensure the initial arrangement has 0 matches for proper challenge
    do {
      visibleArrangement = shuffle([...shapes]);
    } while (countMatches(visibleArrangement, targetArrangement) > 0);

    setTarget(targetArrangement);
    setVisible(visibleArrangement);
    setSelected(null);
    setMoveCount(0);
    setMatchCount(0);
    setIsComplete(false);
    setShowCongratulations(false);
  };

  const countMatches = (arr1: GameShape[], arr2: GameShape[]): number => {
    return arr1.reduce((count, shape, index) => {
      return count + (shape.type === arr2[index].type && shape.color === arr2[index].color ? 1 : 0);
    }, 0);
  };

  const calculateStars = () => {
    // Base target moves: 6 for 4 shapes, +2 for each additional shape
    const baseTarget = 6 + (shapeCount - 4) * 2;
    
    if (moveCount <= baseTarget * 0.6) return 3;
    if (moveCount <= baseTarget) return 2;
    return 1;
  };

  const handleShapeTap = (index: number) => {
    if (isComplete) return;

    if (selected === null) {
      setSelected(index);
      return;
    }

    if (selected === index) {
      setSelected(null);
      return;
    }

    // Perform swap
    const newVisible = [...visible];
    [newVisible[selected], newVisible[index]] = [newVisible[index], newVisible[selected]];

    setVisible(newVisible);
    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);
    setSelected(null);

    const newMatchCount = countMatches(newVisible, target);
    setMatchCount(newMatchCount);

    // Check for completion
    if (newMatchCount === shapeCount) {
      setIsComplete(true);
      setCompletedLevel(level); // Store the completed level for display

      // Calculate and save level completion
      const stars = calculateStars();
      const newTotalStars = totalStars + stars;
      const newTotalMoves = totalMoves + moveCount + 1; // +1 for the current move
      const newLevelsCompleted = levelsCompleted + 1;

      setTotalStars(newTotalStars);
      setTotalMoves(newTotalMoves);
      setLevelsCompleted(newLevelsCompleted);

      // Show congratulations popup after a short delay
      setTimeout(() => {
        setShowCongratulations(true);
      }, 500);
    } else {
      const message = newMatchCount === 0
        ? "No shapes match"
        : `${newMatchCount} shape${newMatchCount > 1 ? 's' : ''} match`;

      toast({
        title: message,
        variant: newMatchCount > matchCount ? "default" : "destructive",
      });
    }
  };

  const handleNextLevel = () => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    setShowCongratulations(false);
    initializeGame();
  };

  const handleCloseCongratulations = () => {
    setShowCongratulations(false);
  };

  const handleHint = () => {
    if (isComplete) return;

    if (hintsLeft > 0) {
      // Use a hint - find first shape that's not in correct position and place it correctly
      const incorrectIndices = visible
        .map((shape, index) => ({ 
          shape, 
          index, 
          isCorrect: shape.type === target[index].type && shape.color === target[index].color 
        }))
        .filter(item => !item.isCorrect)
        .map(item => item.index);

      if (incorrectIndices.length > 0) {
        // Find the correct position for the first incorrect shape
        const shapeToFix = incorrectIndices[0];
        const correctShape = target[shapeToFix];
        
        // Find where this correct shape currently is
        const currentCorrectIndex = visible.findIndex(
          shape => shape.type === correctShape.type && shape.color === correctShape.color
        );
        
        if (currentCorrectIndex !== -1 && currentCorrectIndex !== shapeToFix) {
          // Swap the shapes
          const newVisible = [...visible];
          [newVisible[shapeToFix], newVisible[currentCorrectIndex]] = [newVisible[currentCorrectIndex], newVisible[shapeToFix]];
          
          setVisible(newVisible);
          const newMoveCount = moveCount + 1;
          setMoveCount(newMoveCount);
          setSelected(null);
          
          const newMatchCount = countMatches(newVisible, target);
          setMatchCount(newMatchCount);
          
          // Check for completion
          if (newMatchCount === shapeCount) {
            setIsComplete(true);
            setCompletedLevel(level); // Store the completed level for display

            // Calculate and save level completion (for hint-assisted completion)
            const stars = calculateStars();
            const newTotalStars = totalStars + stars;
            const newTotalMoves = totalMoves + moveCount + 1;
            const newLevelsCompleted = levelsCompleted + 1;

            setTotalStars(newTotalStars);
            setTotalMoves(newTotalMoves);
            setLevelsCompleted(newLevelsCompleted);

            setTimeout(() => {
              setShowCongratulations(true);
            }, 500);
          }
          
          toast({
            title: "Hint used! One shape placed correctly",
            variant: "default",
          });
        }
      }
      
      setHintsLeft(prev => prev - 1);
    } else {
      // Show hint prompt (no ads, just for future work)
      setShowHintPrompt(true);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface p-4 flex flex-col items-center justify-center">
      <Card className="p-8 max-w-2xl w-full bg-surface-elevated shadow-elevated">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            onClick={onBackToMenu}
            className="px-6"
          >
            ← Back
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Level {level}
            </h2>
            <p className="text-muted-foreground">{shapeCount} shapes • Moves: {moveCount}</p>
          </div>
          <Button
            variant="secondary"
            onClick={handleHint}
            className="px-6 relative"
            disabled={isComplete}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Hint
            {hintsLeft > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {hintsLeft}
              </span>
            )}
          </Button>
        </div>

        {/* Match Counter */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-primary mb-2">
            {matchCount}/{shapeCount}
          </div>
          <p className="text-muted-foreground">
            {isComplete ? "🎉 All shapes match!" : "Shapes in correct position"}
          </p>
        </div>

        {/* Game Board */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {visible.map((shape, index) => (
            <Shape
              key={index}
              type={shape.type}
              color={shape.color}
              isSelected={selected === index}
              onClick={() => handleShapeTap(index)}
              disabled={isComplete}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Tap one shape, then tap another to swap their positions.</p>
          <p>Match the hidden arrangement - only the count is revealed!</p>
        </div>
      </Card>

      {/* Congratulations Popup */}
      <CongratulationsPopup
        isOpen={showCongratulations}
        stars={calculateStars()}
        moves={moveCount}
        level={completedLevel}
        bottleCount={shapeCount}
        onNextLevel={handleNextLevel}
        onBackToMenu={onBackToMenu}
        onClose={handleCloseCongratulations}
      />

      {/* Hint Prompt Dialog */}
      {showHintPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm mx-4 bg-surface-elevated shadow-elevated">
            <div className="text-center">
              <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Hints Left!</h3>
              <p className="text-muted-foreground mb-4">You've used all your hints for this session.</p>
              <Button 
                variant="outline" 
                onClick={() => setShowHintPrompt(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};