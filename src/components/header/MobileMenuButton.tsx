import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function MobileMenuButton({ isMenuOpen, setIsMenuOpen }: MobileMenuButtonProps) {
  return (
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
  );
}