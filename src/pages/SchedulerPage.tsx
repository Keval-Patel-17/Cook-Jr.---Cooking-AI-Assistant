import React from 'react';
import { SmartScheduler } from '../components/SmartScheduler';
import { useAuth } from '@/lib/AuthContext';

export function SchedulerPage() {
  const { language } = useAuth();
  return <SmartScheduler language={language} />;
}
