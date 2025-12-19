import { Menu, Music, Zap, Plus } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  onCreateEvent?: () => void;
  onSignIn?: () => void;
  onJoinClick?: () => void;
}

export function Navigation({ onCreateEvent, onSignIn, onJoinClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-75 blur group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-black px-2 py-1 rounded-lg flex items-center space-x-1">
                <Zap size={20} className="text-purple-500" />
                <Music size={20} className="text-pink-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              SpotLive
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#events" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
              Events
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onCreateEvent}
              className="px-4 py-2 text-white border border-green-600/50 hover:border-green-400 rounded-lg transition-all duration-300 hover:bg-green-950/30 flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Create Event</span>
            </button>
            <button
              onClick={onSignIn}
              className="px-6 py-2 text-purple-400 border border-purple-600/50 hover:border-purple-400 rounded-lg transition-all duration-300 hover:bg-purple-950/30"
            >
              Sign In
            </button>
            <button
              onClick={onJoinClick}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            >
              Join Now
            </button>
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-purple-900/30 pt-4">
            <a href="#home" className="block text-gray-300 hover:text-purple-400 transition-colors">
              Home
            </a>
            <a href="#events" className="block text-gray-300 hover:text-purple-400 transition-colors">
              Events
            </a>
            <a href="#about" className="block text-gray-300 hover:text-purple-400 transition-colors">
              About
            </a>
            <button
              onClick={() => {
                onCreateEvent?.();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-white border border-green-600/50 rounded-lg transition-all hover:bg-green-950/30"
            >
              Create Event
            </button>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  onSignIn?.();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 px-4 py-2 text-purple-400 border border-purple-600/50 rounded-lg transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onJoinClick?.();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg transition-all"
              >
                Join Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
