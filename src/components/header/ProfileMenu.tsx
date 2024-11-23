import { Link } from 'react-router-dom';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pendingCount: number;
  onLogout: () => void;
}

export default function ProfileMenu({ isOpen, onClose, pendingCount, onLogout }: ProfileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-10">
      <Link 
        to="/profile" 
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={onClose}
      >
        Profil
      </Link>
      <Link 
        to="/profile?tab=pending" 
        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={onClose}
      >
        <span>En cours</span>
        {pendingCount > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-teal rounded-full">
            {pendingCount}
          </span>
        )}
      </Link>
      <button
        onClick={onLogout}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Déconnexion
      </button>
    </div>
  );
}