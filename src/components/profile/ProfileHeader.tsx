import { UserCircle } from 'lucide-react';
import type { User } from '../../types';
import UserStats from './UserStats';

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-primary rounded-t-lg p-4">
      <div className="flex items-center space-x-4">
        <UserCircle className="h-12 w-12 text-white" />
        <div>
          <h1 className="text-xl font-bold text-white">{user.username}</h1>
          <p className="text-primary-100 text-sm">{user.email}</p>
        </div>
      </div>

      <UserStats user={user} />
    </div>
  );
}