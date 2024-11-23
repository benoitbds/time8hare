import { Menu, X, Clock8, UserCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { totalCount, pendingCount } = useNotifications();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsProfileMenuOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-primary shadow-md py-2' : 'bg-primary py-6'
    }`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Clock8 className={`transition-all duration-300 ${
                isScrolled ? 'h-6 w-6' : 'h-8 w-8'
              } text-white`} />
              <span className={`font-bold text-white transition-all duration-300 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              }`}>
                Time8hare
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/how-it-works" className="text-base font-medium text-white hover:text-primary-100">
              Comment ça marche ?
            </Link>
            <Link to="/services" className="text-base font-medium text-white hover:text-primary-100">
              Services
            </Link>
            {user ? (
              <>
                <Link to="/give" 
                  className="inline-block rounded-md border border-transparent bg-teal py-2 px-4 text-base font-medium text-white hover:bg-teal-700 transition-colors">
                  Donner
                </Link>
                <div className="relative" ref={profileMenuRef}>
                  <button 
                    className="flex items-center space-x-1 text-white relative"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <UserCircle className={`transition-all duration-300 ${
                      isScrolled ? 'h-4 w-4' : 'h-5 w-5'
                    }`} />
                    {totalCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white bg-teal rounded-full">
                        {totalCount}
                      </span>
                    )}
                    <span className={`transition-all duration-300 ${
                      isScrolled ? 'sr-only' : undefined
                    }`}>
                      {user.username}
                    </span>
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-10">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profil
                      </Link>
                      <Link 
                        to="/profile?tab=pending" 
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <span>En cours</span>
                        {pendingCount > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-teal rounded-full">
                            {pendingCount}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" 
                className="inline-block rounded-md border border-transparent bg-teal py-2 px-4 text-base font-medium text-white hover:bg-teal-700 transition-colors">
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-primary-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                to="/how-it-works"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Comment ça marche ?
              </Link>
              <Link
                to="/services"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              {user ? (
                <>
                  <Link
                    to="/give"
                    className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Donner
                  </Link>
                  <Link
                    to="/profile"
                    className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <Link
                    to="/profile?tab=pending"
                    className="flex items-center justify-between rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>En cours</span>
                    {pendingCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-teal rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-700"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}