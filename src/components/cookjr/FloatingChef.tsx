import React from 'react';
import { FloatingChefAssistant } from '../FloatingChefAssistant';
import { useAuth } from '@/lib/AuthContext';

export default function FloatingChef() {
  const { language } = useAuth();
  return <FloatingChefAssistant language={language || 'en'} />;
}
