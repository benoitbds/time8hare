import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle } from 'lucide-react';
import RatingModal from '../components/RatingModal';
import UserStats from '../components/profile/UserStats';
import TaskList from '../components/profile/TaskList';
import ProfileTabs from '../components/profile/ProfileTabs';
import LocationSettings from '../components/profile/LocationSettings';
import useProfileTasks from '../hooks/useProfileTasks';
import ProfileHeader from '../components/profile/ProfileHeader';
import ErrorMessage from '../components/common/ErrorMessage';
import { userService } from '../services/firebase/user';
import type { Location } from '../types';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'pending' ? 'pending' : 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'pending'>(defaultTab);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { user } = useAuth();
  
  const {
    tasks,
    error,
    handleAcceptTask,
    handleStartTask,
    handleCompleteTask,
    handleRatingSubmit,
    getPendingTasks,
    getCompletedTasks,
    getTaskStatusLabel,
    getActionButton
  } = useProfileTasks(user, setSelectedTask, setIsRatingModalOpen);

  const handleLocationUpdate = async (location: Location | undefined) => {
    if (!user) return;
    await userService.updateLocation(user.id, location);
  };

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-primary-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProfileHeader user={user} />

        <div className="bg-white rounded-b-lg shadow-sm">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="p-4">
            {error && <ErrorMessage message={error} />}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <LocationSettings
                  location={user.location}
                  onSave={handleLocationUpdate}
                />
              </div>
            )}

            {activeTab === 'pending' && (
              <TaskList
                tasks={getPendingTasks(tasks)}
                getTaskStatusLabel={getTaskStatusLabel}
                getActionButton={getActionButton}
              />
            )}

            {activeTab === 'history' && (
              <TaskList
                tasks={getCompletedTasks(tasks)}
                getTaskStatusLabel={getTaskStatusLabel}
              />
            )}
          </div>
        </div>
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}