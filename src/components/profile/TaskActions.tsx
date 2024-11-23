import type { Task } from '../../types';

interface TaskActionsProps {
  task: Task;
  userId: string;
  onAccept: (task: Task) => Promise<void>;
  onStart: (task: Task) => Promise<void>;
  onComplete: (task: Task) => Promise<void>;
}

export default function TaskActions({ task, userId, onAccept, onStart, onComplete }: TaskActionsProps) {
  if (task.providerId === userId) {
    // Actions pour le prestataire
    switch (task.status) {
      case 'pending':
        return (
          <button
            onClick={() => onAccept(task)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal"
          >
            Accepter
          </button>
        );
      case 'accepted':
        return (
          <button
            onClick={() => onStart(task)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal"
          >
            Démarrer
          </button>
        );
      case 'in_progress':
        return (
          <button
            onClick={() => onComplete(task)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal"
          >
            Marquer comme terminé
          </button>
        );
      case 'completed_provider':
        return (
          <span className="text-sm text-gray-500 italic">
            En attente de confirmation du bénéficiaire
          </span>
        );
      default:
        return null;
    }
  } else {
    // Actions pour le bénéficiaire
    switch (task.status) {
      case 'completed_provider':
        return (
          <button
            onClick={() => onComplete(task)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal"
          >
            Confirmer et noter
          </button>
        );
      default:
        return (
          <span className="text-sm text-gray-500">
            {task.status === 'in_progress' ? 'En cours' : 'En attente'}
          </span>
        );
    }
  }
}