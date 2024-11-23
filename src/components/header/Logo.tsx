import { Clock8 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  isScrolled: boolean;
}

export default function Logo({ isScrolled }: LogoProps) {
  return (
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
  );
}