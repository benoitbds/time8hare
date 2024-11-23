import {
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config';
import { handleFirestoreError } from '../error';

export const updateTaskStatus = {
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
  }
};