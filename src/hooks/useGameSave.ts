import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface LevelInProgress {
  visible: string[];
  target: string[];
  moveCount: number;
  matchCount: number;
  selected: number | null;
}

interface GameSave {
  id: string;
  player_name: string;
  current_level: number;
  total_stars: number;
  total_moves: number;
  levels_completed: number;
  level_in_progress: LevelInProgress | null;
  hints_remaining: number;
  created_at: string;
  updated_at: string;
}

interface LevelScore {
  id: string;
  player_name: string;
  level: number;
  moves: number;
  stars: number;
  bottle_count: number;
  completed_at: string;
}

export function useGameSave(playerName: string) {
  const [gameSave, setGameSave] = useState<GameSave | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load game save on mount
  useEffect(() => {
    if (playerName) {
      loadGameSave();
    }
  }, [playerName]);

  const loadGameSave = async () => {
    if (!playerName) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('player_name', playerName)
        .maybeSingle();

      if (error) {
        console.error('Error loading game save:', error);
        toast({
          title: "Failed to load game progress",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setGameSave({
          ...data,
          level_in_progress: (data.level_in_progress as unknown) as LevelInProgress | null,
        });
      }
    } catch (error) {
      console.error('Error loading game save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGameProgress = async (
    currentLevel: number,
    totalStars: number,
    totalMoves: number,
    levelsCompleted: number,
    levelInProgress: LevelInProgress | null = null,
    hintsRemaining: number = 3
  ) => {
    if (!playerName) return;

    try {
      const { data, error } = await supabase
        .from('game_saves')
        .upsert([{
          player_name: playerName,
          current_level: currentLevel,
          total_stars: totalStars,
          total_moves: totalMoves,
          levels_completed: levelsCompleted,
          level_in_progress: levelInProgress as any,
          hints_remaining: hintsRemaining,
        }], {
          onConflict: 'player_name'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving game progress:', error);
        toast({
          title: "Failed to save progress",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setGameSave({
          ...data,
          level_in_progress: (data.level_in_progress as unknown) as LevelInProgress | null,
        });
      }
    } catch (error) {
      console.error('Error saving game progress:', error);
    }
  };

  const saveLevelProgress = async (
    visible: string[],
    target: string[],
    moveCount: number,
    matchCount: number,
    selected: number | null,
    hintsRemaining: number
  ) => {
    if (!playerName || !gameSave) return;

    const levelInProgress: LevelInProgress = {
      visible,
      target,
      moveCount,
      matchCount,
      selected,
    };

    await saveGameProgress(
      gameSave.current_level,
      gameSave.total_stars,
      gameSave.total_moves,
      gameSave.levels_completed,
      levelInProgress,
      hintsRemaining
    );
  };

  const saveLevelScore = async (
    level: number,
    moves: number,
    stars: number,
    bottleCount: number
  ) => {
    if (!playerName) return;

    try {
      const { error } = await supabase
        .from('level_scores')
        .upsert({
          player_name: playerName,
          level,
          moves,
          stars,
          bottle_count: bottleCount,
        }, {
          onConflict: 'player_name,level'
        });

      if (error) {
        console.error('Error saving level score:', error);
        return;
      }
    } catch (error) {
      console.error('Error saving level score:', error);
    }
  };

  const getBestScore = async (level: number): Promise<LevelScore | null> => {
    if (!playerName) return null;

    try {
      const { data, error } = await supabase
        .from('level_scores')
        .select('*')
        .eq('player_name', playerName)
        .eq('level', level)
        .maybeSingle();

      if (error) {
        console.error('Error getting best score:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting best score:', error);
      return null;
    }
  };

  const getLeaderboard = async (level: number): Promise<LevelScore[]> => {
    try {
      const { data, error } = await supabase
        .from('level_scores')
        .select('*')
        .eq('level', level)
        .order('stars', { ascending: false })
        .order('moves', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error getting leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  };

  return {
    gameSave,
    isLoading,
    saveGameProgress,
    saveLevelProgress,
    saveLevelScore,
    getBestScore,
    getLeaderboard,
    loadGameSave,
  };
}
