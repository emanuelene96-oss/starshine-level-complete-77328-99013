import { useState, useEffect } from "react";
import { Bottle, type BottleColor } from "./Bottle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Lightbulb } from "lucide-react";
import CongratulationsPopup from "./CongratulationsPopup";
import { useGameSave } from "@/hooks/useGameSave";
import { useUnityAds } from "@/hooks/useUnityAds";

interface GameBoardProps {
  onBackToMenu: () => void;
  playerName: string;
}

const AVAILABLE_COLORS: BottleColor[] = ["red", "green", "blue", "orange", "purple", "pink", "teal", "yellow"];

const getBottleCountForLevel = (level: number): number => {
  // Start with 4 bottles, increase by 1 every 10 levels, cap at 8
  return Math.min(8, 4 + Math.floor((level - 1) / 10));
};

export const GameBoard = ({ onBackToMenu, playerName }: GameBoardProps) => {
  const [level, setLevel] = useState(1);
  const bottleCount = getBottleCountForLevel(level);
  const [visible, setVisible] = useState<BottleColor[]>([]);
  const [target, setTarget] = useState<BottleColor[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showAdPrompt, setShowAdPrompt] = useState(false);
  const [totalStars, setTotalStars] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [levelsCompleted, setLevelsCompleted] = useState(0);
  const [completedLevel, setCompletedLevel] = useState(1);

  // Game save hook
  const { gameSave, saveGameProgress, saveLevelProgress, saveLevelScore } = useGameSave(playerName);
  
  // Unity Ads hook
  const { isInitialized, isAdReady, isAdShowing, showRewardedAd } = useUnityAds();

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [level]);

  // Load saved progress
  useEffect(() => {
    if (gameSave) {
      setLevel(gameSave.current_level);
      setTotalStars(gameSave.total_stars);
      setTotalMoves(gameSave.total_moves);
      setLevelsCompleted(gameSave.levels_completed);
      setHintsLeft(gameSave.hints_remaining ?? 3);
      
      // Restore in-progress level if it exists
      if (gameSave.level_in_progress) {
        const progress = gameSave.level_in_progress;
        setVisible(progress.visible as BottleColor[]);
        setTarget(progress.target as BottleColor[]);
        setMoveCount(progress.moveCount);
        setMatchCount(progress.matchCount);
        setSelected(progress.selected);
      }
    }
  }, [gameSave]);

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

    const colors = AVAILABLE_COLORS.slice(0, bottleCount);
    const targetArrangement = shuffle(colors);
    let visibleArrangement;

    // Ensure the initial arrangement has 0 matches for proper challenge
    do {
      visibleArrangement = shuffle(colors);
    } while (countMatches(visibleArrangement, targetArrangement) > 0);

    setTarget(targetArrangement);
    setVisible(visibleArrangement);
    setSelected(null);
    setMoveCount(0);
    setMatchCount(0);
    setIsComplete(false);
    setShowCongratulations(false);
  };

  const countMatches = (arr1: BottleColor[], arr2: BottleColor[]): number => {
    return arr1.reduce((count, color, index) => {
      return count + (color === arr2[index] ? 1 : 0);
    }, 0);
  };

  const calculateStars = () => {
    // Base target moves: 6 for 4 bottles, +2 for each additional bottle
    const baseTarget = 6 + (bottleCount - 4) * 2;
    
    if (moveCount <= baseTarget * 0.6) return 3;
    if (moveCount <= baseTarget) return 2;
    return 1;
  };

  const handleBottleTap = (index: number) => {
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
    
    // Save level progress after each move
    saveLevelProgress(newVisible, target, newMoveCount, newMatchCount, null, hintsLeft);

    // Check for completion
    if (newMatchCount === bottleCount) {
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

      // Save level score only (don't advance current_level yet) and clear progress
      saveLevelScore(level, moveCount + 1, stars, bottleCount);
      saveGameProgress(level, newTotalStars, newTotalMoves, newLevelsCompleted, null, hintsLeft);

      // Show congratulations popup after a short delay
      setTimeout(() => {
        setShowCongratulations(true);
      }, 500);
    } else {
      const message = newMatchCount === 0
        ? "No bottles match"
        : `${newMatchCount} bottle${newMatchCount > 1 ? 's' : ''} match`;

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
    // Save the new current level when advancing (with no in-progress state)
    saveGameProgress(nextLevel, totalStars, totalMoves, levelsCompleted, null, hintsLeft);
    initializeGame();
  };

  const handleCloseCongratulations = () => {
    setShowCongratulations(false);
  };

  const handleHint = () => {
    if (isComplete) return;

    if (hintsLeft > 0) {
      // Use a hint - find first bottle that's not in correct position and place it correctly
      const incorrectIndices = visible
        .map((color, index) => ({ color, index, isCorrect: color === target[index] }))
        .filter(bottle => !bottle.isCorrect)
        .map(bottle => bottle.index);

      if (incorrectIndices.length > 0) {
        // Find the correct position for the first incorrect bottle
        const bottleToFix = incorrectIndices[0];
        const correctColor = target[bottleToFix];
        
        // Find where this correct color currently is
        const currentCorrectIndex = visible.findIndex(color => color === correctColor);
        
        if (currentCorrectIndex !== -1 && currentCorrectIndex !== bottleToFix) {
          // Swap the bottles
          const newVisible = [...visible];
          [newVisible[bottleToFix], newVisible[currentCorrectIndex]] = [newVisible[currentCorrectIndex], newVisible[bottleToFix]];
          
          setVisible(newVisible);
          const newMoveCount = moveCount + 1;
          setMoveCount(newMoveCount);
          setSelected(null);
          
          const newMatchCount = countMatches(newVisible, target);
          setMatchCount(newMatchCount);
          
          // Save level progress after hint
          saveLevelProgress(newVisible, target, newMoveCount, newMatchCount, null, hintsLeft - 1);
          
          // Check for completion
          if (newMatchCount === bottleCount) {
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

            // Save level score only (don't advance current_level yet) and clear progress
            saveLevelScore(level, moveCount + 1, stars, bottleCount);
            saveGameProgress(level, newTotalStars, newTotalMoves, newLevelsCompleted, null, hintsLeft - 1);

            setTimeout(() => {
              setShowCongratulations(true);
            }, 500);
          }
          
          toast({
            title: "Hint used! One bottle placed correctly",
            variant: "default",
          });
        }
      }
      
      setHintsLeft(prev => prev - 1);
    } else {
      // Show ad prompt
      setShowAdPrompt(true);
    }
  };

  const handleWatchAd = () => {
    setShowAdPrompt(false);
    
    showRewardedAd(() => {
      // This callback is called when the ad is completed successfully
      setHintsLeft(3);
      toast({
        title: "Reward Earned!",
        description: "3 hints have been restored",
        variant: "default",
      });
    });
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
            <p className="text-muted-foreground">{bottleCount} bottles • Moves: {moveCount}</p>
          </div>
          <Button
            variant="secondary"
            onClick={handleHint}
            className="px-6 relative"
            disabled={isComplete || isAdShowing}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {isAdShowing ? "Loading..." : "Hint"}
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
            {matchCount}/{bottleCount}
          </div>
          <p className="text-muted-foreground">
            {isComplete ? "🎉 All bottles match!" : "Bottles in correct position"}
          </p>
        </div>

        {/* Game Board */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {visible.map((color, index) => (
            <Bottle
              key={index}
              color={color}
              isSelected={selected === index}
              onClick={() => handleBottleTap(index)}
              disabled={isComplete}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Tap one bottle, then tap another to swap their positions.</p>
          <p>Match the hidden arrangement - only the count is revealed!</p>
        </div>
      </Card>

      {/* Congratulations Popup */}
      <CongratulationsPopup
        isOpen={showCongratulations}
        stars={calculateStars()}
        moves={moveCount}
        level={completedLevel}
        bottleCount={bottleCount}
        onNextLevel={handleNextLevel}
        onBackToMenu={onBackToMenu}
        onClose={handleCloseCongratulations}
      />

      {/* Ad Prompt Dialog */}
      {showAdPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm mx-4 bg-surface-elevated shadow-elevated">
            <div className="text-center">
              <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Hints Left!</h3>
              <p className="text-muted-foreground mb-4">Watch an ad to get 3 more hints?</p>
              {!isAdReady && isInitialized && (
                <p className="text-sm text-muted-foreground mb-4">Loading ad...</p>
              )}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdPrompt(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleWatchAd}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
                  disabled={!isAdReady && isInitialized}
                >
                  {isAdReady || !isInitialized ? "Watch Ad" : "Loading..."}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};