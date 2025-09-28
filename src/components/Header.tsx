import React, { useState } from 'react';
import { Menu, X, Zap, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onGetStarted?: () => void;
  onMagicTricks?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStarted, onMagicTricks }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-medium-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-electric-blue to-magenta p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bebas text-white">
              ContentGen Pro
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-gray-300 hover:text-electric-blue transition-colors">
              Benefits
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-electric-blue transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-electric-blue transition-colors">
              Reviews
            </a>
            <a href="#faq" className="text-gray-300 hover:text-electric-blue transition-colors">
              FAQ
            </a>
            {onMagicTricks && (
              <button 
                onClick={onMagicTricks}
                className="text-gray-300 hover:text-electric-blue transition-colors"
              >
                Magic Tricks
              </button>
            )}
            {user && (
              <button 
                onClick={() => navigate('/gallery')}
                className="text-gray-300 hover:text-electric-blue transition-colors"
              >
                Gallery
              </button>
            )}
            {user ? (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-3 hover:bg-gray-800 rounded-full p-2 transition-colors"
                title="View Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-electric-blue to-magenta p-0.5">
                  <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center overflow-hidden">
                    {userProfile?.profile ? (
                      <img
                        src={userProfile.profile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-sm font-bold text-white">${getInitials(userProfile?.name || user?.email || 'U')}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {getInitials(userProfile?.name || user?.email || 'U')}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-gray-300 hover:text-white transition-colors">
                  {userProfile?.name || user?.email?.split('@')[0] || 'Profile'}
                </span>
              </button>
            ) : (
              <button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
              >
                Get Started
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-medium-gray">
            <nav className="flex flex-col space-y-4">
              <a href="#benefits" className="text-gray-300 hover:text-electric-blue transition-colors">
                Benefits
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-electric-blue transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-electric-blue transition-colors">
                Reviews
              </a>
              <a href="#faq" className="text-gray-300 hover:text-electric-blue transition-colors">
                FAQ
              </a>
              {onMagicTricks && (
                <button 
                  onClick={onMagicTricks}
                  className="text-gray-300 hover:text-electric-blue transition-colors text-left"
                >
                  Magic Tricks
                </button>
              )}
              {user && (
                <button 
                  onClick={() => navigate('/gallery')}
                  className="text-gray-300 hover:text-electric-blue transition-colors text-left"
                >
                  Gallery
                </button>
              )}
              {user ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors text-left w-full p-3 rounded-lg hover:bg-gray-800"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-electric-blue to-magenta p-0.5">
                    <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center overflow-hidden">
                      {userProfile?.profile ? (
                        <img
                          src={userProfile.profile}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-sm font-bold text-white">${getInitials(userProfile?.name || user?.email || 'U')}</span>`;
                            }
                          }}
                        />
                      ) : (
                        <span className="text-sm font-bold text-white">
                          {getInitials(userProfile?.name || user?.email || 'U')}
                        </span>
                      )}
                    </div>
                  </div>
                  <span>Profile</span>
                </button>
              ) : (
                <button 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-2 rounded-full font-semibold w-full"
                >
                  Get Started
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;