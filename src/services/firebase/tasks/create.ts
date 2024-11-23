import {
  collection,
  doc,
  addDoc,
  getDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config';
import { handleFirestoreError } from '../error';
import type { Task } from '../../../types';

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'status'>): Promise<Task> => {
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
};