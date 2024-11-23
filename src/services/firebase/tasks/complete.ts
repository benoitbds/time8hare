import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config';
import { handleFirestoreError } from '../error';
import type { Task } from '../../../types';

export const completeTask = async (taskId: string, isProvider: boolean): Promise<void> => {
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
};