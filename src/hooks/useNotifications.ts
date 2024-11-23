import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksService } from '../services/firebase/tasks';
import type { Task } from '../types';

export function useNotifications() {
  const { user } = useAuth();
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use a simple query first to avoid index issues
        const tasks = await tasksService.getByUser(user.id);
        
        setPendingTasks(tasks.filter(t => t.status === 'pending'));
        setActiveTasks(tasks.filter(t => ['accepted', 'in_progress'].includes(t.status)));
      } catch (err) {
        console.error('Error loading notifications:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erreur lors du chargement des notifications');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);

    return () => clearInterval(interval);
  }, [user]);

  return {
    pendingCount: pendingTasks.length,
    activeCount: activeTasks.length,
    totalCount: pendingTasks.length + activeTasks.length,
    pendingTasks,
    activeTasks,
    error,
    isLoading
  };
}