import { Clock, Star } from 'lucide-react';
import type { User } from '../../types';

interface UserStatsProps {
  user: User;
}

export default function UserStats({ user }: UserStatsProps) {
  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white/90 rounded-md p-3 flex items-center space-x-3">
        <Clock className="h-5 w-5 text-teal flex-shrink-0" />
        <div>
          <p className="text-xl font-semibold text-primary">{user.timeBalance}</p>
          <p className="text-xs text-gray-500">Minutes</p>
        </div>
      </div>

      <div className="bg-white/90 rounded-md p-3 flex items-center space-x-3">
        <Star className="h-5 w-5 text-teal flex-shrink-0" />
        <div>
          <p className="text-xl font-semibold text-primary">
            {user.rating ? user.rating.toFixed(1) : '-'}
          </p>
          <p className="text-xs text-gray-500">Note moyenne</p>
        </div>
      </div>

      <div className="bg-white/90 rounded-md p-3 flex items-center space-x-3">
        <Clock className="h-5 w-5 text-teal flex-shrink-0" />
        <div>
          <p className="text-xl font-semibold text-primary">{user.servicesGiven}</p>
          <p className="text-xs text-gray-500">Services donnés</p>
        </div>
      </div>

      <div className="bg-white/90 rounded-md p-3 flex items-center space-x-3">
        <Clock className="h-5 w-5 text-teal flex-shrink-0" />
        <div>
          <p className="text-xl font-semibold text-primary">{user.servicesReceived}</p>
          <p className="text-xs text-gray-500">Services reçus</p>
        </div>
      </div>
    </div>
  );
}