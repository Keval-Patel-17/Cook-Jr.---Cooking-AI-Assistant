import React from 'react';
import { GymSection } from '../components/GymSection';
import { useAuth } from '@/lib/AuthContext';

export function GymPage() {
  const { language } = useAuth();
  return <GymSection language={language} />;
}
