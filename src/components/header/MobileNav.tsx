import { Link } from 'react-router-dom';
import type { User } from '../../types';

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  user: User | null;
  logout: () => Promise<void>;
  pendingCount: number;
}

export default function MobileNav({ 
  isMenuOpen, 
  setIsMenuOpen, 
  user, 
  logout,
  pendingCount 
}: MobileNavProps) {
  if (!isMenuOpen) return null;

  return (
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
              onClick={logout}
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
  );
}