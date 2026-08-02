import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Background3DFood } from './components/Background3DFood';
import Layout from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { RecipesPage } from './pages/RecipesPage';
import { GymPage } from './pages/GymPage';
import { SchedulerPage } from './pages/SchedulerPage';
import { KitchenPage } from './pages/KitchenPage';
import { GamesPage } from './pages/GamesPage';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { ThemeProvider } from './lib/ThemeContext';
import { AuthModal } from './components/AuthModal';
import { SavedRecipesModal } from './components/SavedRecipesModal';

function AppContent() {
  const { authModalOpen, setAuthModalOpen, handleLoginSuccess, savedModalOpen, setSavedModalOpen } = useAuth();

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 relative transition-colors duration-300 font-sans selection:bg-orange-500 selection:text-white">
      {/* 3D Floating Food Parallax Background */}
      <Background3DFood />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="gym" element={<GymPage />} />
          <Route path="scheduler" element={<SchedulerPage />} />
          <Route path="kitchen" element={<KitchenPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Saved Recipes Modal */}
      <SavedRecipesModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
