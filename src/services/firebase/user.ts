import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError } from './error';
import type { Location } from '../../types';

export const userService = {
  addTimeBalance: async (userId: string, minutes: number): Promise<void> => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        timeBalance: increment(minutes)
      });
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  updateLocation: async (userId: string, location: Location | undefined): Promise<void> => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { location });
    } catch (error) {
      throw handleFirestoreError(error);
    }
  }
};