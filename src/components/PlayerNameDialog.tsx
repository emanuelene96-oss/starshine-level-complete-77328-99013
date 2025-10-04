import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface PlayerNameDialogProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

export function PlayerNameDialog({ isOpen, onSubmit }: PlayerNameDialogProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="p-6 w-full max-w-sm bg-surface-elevated shadow-elevated">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-celebration rounded-full p-3 shadow-elevated">
              <User className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Welcome, Puzzle Master!</h2>
          <p className="text-sm text-muted-foreground">Enter your name to save your progress</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="text-center"
            autoFocus
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary-glow"
            disabled={!name.trim()}
          >
            Start Playing
          </Button>
        </form>
      </Card>
    </div>
  );
}
