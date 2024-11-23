import { useState, useEffect } from 'react';
import { tasksService } from '../services/firebase/tasks';
import type { Task, User } from '../types';

export default function useProfileTasks(
  user: User | null,
  setSelectedTask: (task: Task | null) => void,
  setIsRatingModalOpen: (isOpen: boolean) => void
) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      try {
        setError(null);
        const data = await tasksService.getByUser(user.id);
        setTasks(data);
      } catch (err) {
        console.error('Error loading tasks:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erreur lors du chargement des tâches');
        }
      }
    };

    loadTasks();
  }, [user]);

  const getPendingTasks = (tasks: Task[]) => {
    return tasks.filter(t => [
      'pending',
      'accepted',
      'in_progress',
      'completed_provider'
    ].includes(t.status));
  };

  const getCompletedTasks = (tasks: Task[]) => {
    return tasks.filter(t => t.status === 'completed')
      .sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());
  };

  const handleAcceptTask = async (task: Task) => {
    try {
      await tasksService.accept(task.id);
      const updatedTasks = await tasksService.getByUser(user!.id);
      setTasks(updatedTasks);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors de l\'acceptation de la tâche');
      }
    }
  };

  const handleStartTask = async (task: Task) => {
    try {
      await tasksService.start(task.id);
      const updatedTasks = await tasksService.getByUser(user!.id);
      setTasks(updatedTasks);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors du démarrage de la tâche');
      }
    }
  };

  const handleCompleteTask = async (task: Task) => {
    try {
      const isProvider = task.providerId === user!.id;
      await tasksService.complete(task.id, isProvider);
      
      if (!isProvider && task.status === 'completed_provider') {
        setSelectedTask(task);
        setIsRatingModalOpen(true);
      }

      const updatedTasks = await tasksService.getByUser(user!.id);
      setTasks(updatedTasks);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors de la finalisation de la tâche');
      }
    }
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!user) return;

    try {
      await tasksService.submitRating(selectedTask!.id, {
        rating,
        comment,
        createdAt: new Date(),
        fromUser: {
          id: user.id,
          username: user.username
        }
      });

      const updatedTasks = await tasksService.getByUser(user.id);
      setTasks(updatedTasks);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors de l\'envoi de l\'évaluation');
      }
    }
  };

  const getTaskStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Accepté';
      case 'in_progress': return 'En cours';
      case 'completed_provider': return 'Terminé (prestataire)';
      case 'completed_beneficiary': return 'Terminé (bénéficiaire)';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getActionButton = (task: Task) => {
    const props = {
      task,
      userId: user!.id,
      onAccept: handleAcceptTask,
      onStart: handleStartTask,
      onComplete: handleCompleteTask
    };
    return props;
  };

  return {
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
  };
}