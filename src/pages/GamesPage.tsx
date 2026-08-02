import React from 'react';
import { GameSection } from '../components/GameSection';
import { useAuth } from '@/lib/AuthContext';

export function GamesPage() {
  const { user, setUser, language } = useAuth();

  const handleUpdateGameStats = async (addXp: number, addCoins: number, newBadge?: string) => {
    if (!user) return;
    const token = localStorage.getItem('cookjr_token');

    try {
      const res = await fetch('/api/user/game-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ addXp, addCoins, newBadge }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to update game stats:', err);
    }
  };

  return (
    <GameSection
      user={user}
      onUpdateGameStats={handleUpdateGameStats}
      language={language}
    />
  );
}
