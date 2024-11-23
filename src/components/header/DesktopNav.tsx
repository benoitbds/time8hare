import { Link, useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { useState, RefObject } from 'react';
import type { User } from '../../types';
import ProfileMenu from './ProfileMenu';

interface DesktopNavProps {
  user: User | null;
  logout: () => Promise<void>;
  totalCount: number;
  pendingCount: number;
  isScrolled: boolean;
  profileMenuRef: RefObject<HTMLDivElement>;
}

export default function DesktopNav({ 
  user, 
  logout, 
  totalCount, 
  pendingCount,
  isScrolled,
  profileMenuRef
}: DesktopNavProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsProfileMenuOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
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
            
            <ProfileMenu
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
              pendingCount={pendingCount}
              onLogout={handleLogout}
            />
          </div>
        </>
      ) : (
        <Link to="/login" 
          className="inline-block rounded-md border border-transparent bg-teal py-2 px-4 text-base font-medium text-white hover:bg-teal-700 transition-colors">
          Connexion
        </Link>
      )}
    </div>
  );
}