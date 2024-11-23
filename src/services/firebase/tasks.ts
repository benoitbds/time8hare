import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError } from './error';
import type { Task, TaskStatus, Rating } from '../../types';

export const tasksService = {
  create: async (task: Omit<Task, 'id' | 'createdAt' | 'status'>): Promise<Task> => {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...task,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const newDoc = await getDoc(docRef);
      const data = newDoc.data()!;
      
      return {
        ...data,
        id: docRef.id,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate()
      } as Task;
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  getByUser: async (userId: string): Promise<Task[]> => {
    try {
      const tasksRef = collection(db, 'tasks');
      const querySnapshot = await getDocs(tasksRef);
      
      const tasks = querySnapshot.docs
        .map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: (doc.data().createdAt as Timestamp).toDate(),
          updatedAt: (doc.data().updatedAt as Timestamp)?.toDate()
        }))
        .filter(task => 
          task.providerId === userId || 
          task.beneficiaryId === userId
        ) as Task[];

      // Load service details for each task
      const tasksWithServices = await Promise.all(tasks.map(async task => {
        if (!task.serviceId) return task;

        const serviceDoc = await getDoc(doc(db, 'services', task.serviceId));
        if (!serviceDoc.exists()) return task;

        const serviceData = serviceDoc.data();
        return {
          ...task,
          service: {
            id: serviceDoc.id,
            title: serviceData.title,
            category: serviceData.category
          }
        };
      }));

      return tasksWithServices.sort((a, b) => 
        b.updatedAt?.getTime() ?? b.createdAt.getTime() - 
        (a.updatedAt?.getTime() ?? a.createdAt.getTime())
      );
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  accept: async (taskId: string): Promise<void> => {
    try {
      const docRef = doc(db, 'tasks', taskId);
      await updateDoc(docRef, {
        status: 'accepted',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  start: async (taskId: string): Promise<void> => {
    try {
      const docRef = doc(db, 'tasks', taskId);
      await updateDoc(docRef, {
        status: 'in_progress',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  complete: async (taskId: string, isProvider: boolean): Promise<void> => {
    try {
      const docRef = doc(db, 'tasks', taskId);
      const taskDoc = await getDoc(docRef);
      
      if (!taskDoc.exists()) {
        throw new Error('Tâche introuvable');
      }

      const task = taskDoc.data() as Task;
      const newStatus = isProvider ? 'completed_provider' : 'completed_beneficiary';

      // Vérifier que le prestataire a bien marqué comme terminé avant le bénéficiaire
      if (!isProvider && task.status !== 'completed_provider') {
        throw new Error('Le prestataire doit d\'abord marquer la tâche comme terminée');
      }

      // Si le bénéficiaire confirme après le prestataire, la tâche est complétée
      const finalStatus = (!isProvider && task.status === 'completed_provider') 
        ? 'completed' 
        : newStatus;

      await updateDoc(docRef, {
        status: finalStatus,
        updatedAt: serverTimestamp()
      });

      // Si la tâche est maintenant complétée, mettre à jour les statistiques
      if (finalStatus === 'completed') {
        // Mettre à jour les stats du prestataire
        const providerRef = doc(db, 'users', task.providerId);
        await updateDoc(providerRef, {
          servicesGiven: increment(1),
          timeBalance: increment(task.timeBlocks * 8)
        });

        // Mettre à jour les stats du bénéficiaire
        const beneficiaryRef = doc(db, 'users', task.beneficiaryId);
        await updateDoc(beneficiaryRef, {
          servicesReceived: increment(1),
          timeBalance: increment(-(task.timeBlocks * 8))
        });
      }
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  submitRating: async (taskId: string, rating: Rating): Promise<void> => {
    try {
      const docRef = doc(db, 'tasks', taskId);
      const taskDoc = await getDoc(docRef);
      
      if (!taskDoc.exists()) {
        throw new Error('Tâche introuvable');
      }

      const task = taskDoc.data() as Task;

      // Vérifier que la tâche est bien terminée
      if (task.status !== 'completed') {
        throw new Error('La tâche doit être terminée avant de pouvoir être notée');
      }

      // Vérifier que seul le bénéficiaire peut noter
      if (rating.fromUser.id !== task.beneficiaryId) {
        throw new Error('Seul le bénéficiaire peut noter le service');
      }

      await updateDoc(docRef, {
        rating,
        updatedAt: serverTimestamp()
      });

      // Mettre à jour la note moyenne du prestataire
      const providerRef = doc(db, 'users', task.providerId);
      const providerDoc = await getDoc(providerRef);

      if (!providerDoc.exists()) {
        throw new Error('Prestataire introuvable');
      }

      const providerData = providerDoc.data();
      const currentRating = providerData.rating || 0;
      const totalRatings = providerData.totalRatings || 0;
      const newTotalRatings = totalRatings + 1;
      const newRating = ((currentRating * totalRatings) + rating.rating) / newTotalRatings;

      await updateDoc(providerRef, {
        rating: newRating,
        totalRatings: newTotalRatings
      });
    } catch (error) {
      throw handleFirestoreError(error);
    }
  }
};