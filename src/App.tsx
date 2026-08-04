import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Background3DFood } from './components/Background3DFood';
import Layout from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loadingSession } = useAuth();

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-stone-500">Loading Cook Junior...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { authModalOpen, setAuthModalOpen, handleLoginSuccess, savedModalOpen, setSavedModalOpen } = useAuth();

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 relative transition-colors duration-300 font-sans selection:bg-orange-500 selection:text-white">
      {/* 3D Floating Food Parallax Background */}
      <Background3DFood />

      <Routes>
        {/* Landing Page as main entry point */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Application Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/gym" element={<GymPage />} />
          <Route path="/scheduler" element={<SchedulerPage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
          <Route path="/games" element={<GamesPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
