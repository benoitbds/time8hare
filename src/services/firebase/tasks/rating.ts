import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config';
import { handleFirestoreError } from '../error';
import type { Task, Rating } from '../../../types';

export const submitTaskRating = async (taskId: string, rating: Rating): Promise<void> => {
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
};