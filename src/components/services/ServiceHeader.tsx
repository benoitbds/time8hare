import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

interface ServiceHeaderProps {
  user: User | null;
}

export default function ServiceHeader({ user }: ServiceHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Services disponibles</h1>
        <p className="mt-1 text-sm text-gray-500">
          Trouvez les services qui correspondent à vos besoins
        </p>
      </div>
    </div>
  );
}