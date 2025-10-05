import { useState, useEffect } from "react";
import { GameBoard } from "@/components/GameBoard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Trophy, Target, Zap, RotateCcw } from "lucide-react";
import { Shape } from "@/components/Shape";
import { PlayerNameDialog } from "@/components/PlayerNameDialog";
// import { useGameSave } from "@/hooks/useGameSave"; // Temporarily disabled

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerName, setPlayerName] = useState<string>('');
  const [showNameDialog, setShowNameDialog] = useState(false);

  const gameSave = null; // Temporarily disabled

  // Load saved player name on component mount
  useEffect(() => {
    const savedPlayerName = localStorage.getItem('hiddenMatchPlayerName');
    if (savedPlayerName) {
      setPlayerName(savedPlayerName);
    }
  }, []);

  const handleStartGame = () => {
    if (!playerName) {
      setShowNameDialog(true);
    } else {
      setIsPlaying(true);
    }
  };

  const handleNewGame = () => {
    setShowNameDialog(true);
  };

  const handlePlayerNameSubmit = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('hiddenMatchPlayerName', name);
    setShowNameDialog(false);
    setIsPlaying(true);
  };

  const handleBackToMenu = () => {
    setIsPlaying(false);
  };

  if (isPlaying && playerName) {
    return <GameBoard onBackToMenu={handleBackToMenu} playerName={playerName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-primary-glow rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent rounded-full blur-2xl animate-pulse" style={{animationDelay: "2s"}} />
      </div>

      <Card className="p-8 max-w-lg w-full bg-surface-elevated/90 backdrop-blur-sm shadow-elevated border border-border/50 text-center relative overflow-hidden">
        {/* Header with icon */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-celebration rounded-full p-4 shadow-elevated">
              <Trophy className="w-8 h-8 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Hidden Match Solver
          </h1>
          <p className="text-muted-foreground text-lg">
            The Ultimate Shape Puzzle Challenge
          </p>
        </div>

        {/* Game preview with shapes */}
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <Shape type="square" color="red" isSelected={false} onClick={() => {}} disabled />
            <Shape type="circle" color="green" isSelected={false} onClick={() => {}} disabled />
            <Shape type="triangle" color="blue" isSelected={false} onClick={() => {}} disabled />
            <Shape type="hexagon" color="orange" isSelected={false} onClick={() => {}} disabled />
          </div>
          <p className="text-sm text-muted-foreground">Match the hidden arrangement to progress!</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <Target className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Progressive Difficulty</p>
          </div>
          <div className="text-center">
            <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Endless Levels</p>
          </div>
          <div className="text-center">
            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Star Ratings</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 p-4 bg-surface rounded-lg border border-border/30">
          <p className="text-muted-foreground text-sm mb-3">
            Start with 4 shapes and progress through endless levels. Every 10 levels, the difficulty increases with one more shape!
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Level 1-10:</span>
            <span className="text-primary font-semibold">4 shapes</span>
            <span>→</span>
            <span>Level 11-20:</span>
            <span className="text-primary font-semibold">5 shapes</span>
            <span>→ ...</span>
          </div>
        </div>

        {/* Player info and stats */}
        {playerName && gameSave && (
          <div className="mb-6 p-4 bg-surface rounded-lg border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Player:</span>
              <span className="font-semibold text-foreground">{playerName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <p className="text-muted-foreground">Level</p>
                <p className="font-bold text-primary">{gameSave.current_level}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Stars</p>
                <p className="font-bold text-primary">{gameSave.total_stars}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Levels</p>
                <p className="font-bold text-primary">{gameSave.levels_completed}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleStartGame}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-primary-glow border-0 hover:shadow-elevated transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            {playerName ? 'Continue Journey' : 'Start Your Journey'}
          </Button>
          
          {playerName && (
            <Button 
              onClick={handleNewGame}
              size="lg"
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              New Player
            </Button>
          )}
        </div>
      </Card>

      {/* Player Name Dialog */}
      <PlayerNameDialog 
        isOpen={showNameDialog}
        onSubmit={handlePlayerNameSubmit}
      />
    </div>
  );
};

export default Index;