import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardView } from '../components/DashboardView';
import { useAuth } from '@/lib/AuthContext';
import { AppTab } from '../types';

export function DashboardPage() {
  const { user, language } = useAuth();
  const navigate = useNavigate();

  const handleSelectTab = (tab: AppTab) => {
    switch (tab) {
      case 'custom-recipe':
      case 'ingredient-recipe':
        navigate('/recipes');
        break;
      case 'gym':
        navigate('/gym');
        break;
      case 'scheduler':
        navigate('/scheduler');
        break;
      case 'kitchen-safety':
        navigate('/kitchen');
        break;
      case 'games':
        navigate('/games');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return <DashboardView onSelectTab={handleSelectTab} user={user} language={language} />;
}
