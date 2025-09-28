import { useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import MagicTricksPage from './components/MagicTricksPage';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import GalleryPage from './components/GalleryPage';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useAuth();

  // Redirect authenticated users away from auth page and landing page
  useEffect(() => {
    if (user && (location.pathname === '/auth' || location.pathname === '/')) {
      navigate('/magic-tricks');
    }
  }, [user, location.pathname, navigate]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/magic-tricks');
    } else {
      navigate('/auth');
    }
  };
  
  const handleMagicTricks = () => {
    if (user) {
      navigate('/magic-tricks');
    } else {
      navigate('/auth');
    }
  };

  const Landing = useMemo(() => function LandingPage() {
    return (
      <div className="min-h-screen bg-charcoal text-white font-manrope">
        <Header onGetStarted={handleGetStarted} onMagicTricks={handleMagicTricks} />
        <main>
          <HeroSection onGetStarted={handleGetStarted} />
          <BenefitsSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <FaqSection />
        </main>
        <Footer />
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal text-white font-manrope flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
          <p className="text-gray-500 text-sm mt-2">Initializing authentication...</p>
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-red-300 hover:text-red-200 underline text-sm"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route 
        path="/auth" 
        element={
          user ? (
            <MagicTricksPage onBackToLanding={() => navigate('/')} />
          ) : (
            <AuthPage onBackToLanding={() => navigate('/')} />
          )
        } 
      />
      <Route 
        path="/magic-tricks" 
        element={
          user ? (
            <MagicTricksPage onBackToLanding={() => navigate('/')} />
          ) : (
            <AuthPage onBackToLanding={() => navigate('/')} />
          )
        } 
      />
      <Route 
        path="/profile" 
        element={
          user ? (
            <ProfilePage onBackToLanding={() => navigate('/')} />
          ) : (
            <AuthPage onBackToLanding={() => navigate('/')} />
          )
        } 
      />
      <Route 
        path="/gallery" 
        element={
          user ? (
            <GalleryPage onBackToLanding={() => navigate('/')} />
          ) : (
            <AuthPage onBackToLanding={() => navigate('/')} />
          )
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;