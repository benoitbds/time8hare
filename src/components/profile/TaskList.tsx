import { Star } from 'lucide-react';
import type { Task } from '../../types';
import TaskActions from './TaskActions';

interface TaskListProps {
  tasks: Task[];
  getTaskStatusLabel: (status: string) => string;
  getActionButton?: (task: Task) => {
    task: Task;
    userId: string;
    onAccept: (task: Task) => Promise<void>;
    onStart: (task: Task) => Promise<void>;
    onComplete: (task: Task) => Promise<void>;
  };
}

export default function TaskList({ tasks, getTaskStatusLabel, getActionButton }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <div key={task.id} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                {task.service?.title || 'Service indisponible'}
              </h3>
              <div className="mt-1 text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {getTaskStatusLabel(task.status)}
                </span>
                <span className="ml-2">
                  {task.timeBlocks * 8} minutes • {new Date(task.scheduledDate).toLocaleDateString()} à{' '}
                  {task.scheduledTime}
                </span>
              </div>
              {task.message && (
                <p className="mt-2 text-sm text-gray-600">
                  Message : {task.message}
                </p>
              )}
              {task.rating && (
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {task.rating.rating}
                  </span>
                  {task.rating.comment && (
                    <span className="ml-2 text-sm text-gray-600">
                      "{task.rating.comment}"
                    </span>
                  )}
                </div>
              )}
            </div>
            {getActionButton && (
              <div className="flex items-center space-x-2">
                <TaskActions {...getActionButton(task)} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}