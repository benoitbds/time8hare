import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import MobileMenuButton from './MobileMenuButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { totalCount, pendingCount } = useNotifications();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-primary shadow-md py-2' : 'bg-primary py-6'
    }`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between">
          <Logo isScrolled={isScrolled} />
          
          <DesktopNav 
            user={user} 
            logout={logout}
            totalCount={totalCount}
            pendingCount={pendingCount}
            isScrolled={isScrolled}
            profileMenuRef={profileMenuRef}
          />

          <MobileMenuButton 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>

        <MobileNav
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          user={user}
          logout={logout}
          pendingCount={pendingCount}
        />
      </nav>
    </header>
  );
}