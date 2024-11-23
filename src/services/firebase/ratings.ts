import { 
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { handleFirestoreError } from './error';
import type { Rating, Task } from '../../types';

export const ratingsService = {
  create: async (taskId: string, rating: Rating): Promise<void> => {
    try {
      const docRef = doc(db, 'tasks', taskId);
      await updateDoc(docRef, {
        rating: {
          ...rating,
          createdAt: serverTimestamp()
        }
      });

      const task = (await getDoc(docRef)).data() as Task;
      const userRef = collection(db, 'users');
      const q = query(userRef, where('uid', '==', task.providerId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const currentRating = userData.rating || 0;
        const totalRatings = userData.totalRatings || 0;
        
        const newTotalRatings = totalRatings + 1;
        const newRating = ((currentRating * totalRatings) + rating.rating) / newTotalRatings;
        
        await updateDoc(userDoc.ref, {
          rating: newRating,
          totalRatings: newTotalRatings
        });
      }
    } catch (error) {
      throw handleFirestoreError(error);
    }
  }
};