import {
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config';
import { handleFirestoreError } from '../error';
import type { Task } from '../../../types';

export const getTasksByUser = async (userId: string): Promise<Task[]> => {
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
};