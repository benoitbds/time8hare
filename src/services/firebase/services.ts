import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError } from './error';
import { moderationService } from '../moderation';
import type { Service } from '../../types';

export const servicesService = {
  getAll: async (): Promise<Service[]> => {
    try {
      const servicesRef = collection(db, 'services');
      const querySnapshot = await getDocs(servicesRef);
      
      return querySnapshot.docs
        .map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
        }))
        .filter(service => service.status === 'available')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Service[];
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  getByCategory: async (category: string): Promise<Service[]> => {
    try {
      const services = await servicesService.getAll();
      return services.filter(service => service.category === category);
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  create: async (service: Omit<Service, 'id' | 'createdAt' | 'status' | 'completedTasks'>): Promise<Service> => {
    try {
      // Valider le service avec l'API de modération
      const moderationResult = await moderationService.validateService({
        title: service.title,
        description: service.description,
        category: service.category,
        timeBlocks: service.timeBlocks
      });

      if (moderationResult.status === 'Rejeté') {
        throw new Error(
          moderationResult.reason + 
          (moderationResult.suggestions ? `\n\nSuggestions : ${moderationResult.suggestions}` : '')
        );
      }

      const docRef = await addDoc(collection(db, 'services'), {
        ...service,
        status: 'available',
        completedTasks: 0,
        createdAt: serverTimestamp()
      });

      const newDoc = await getDoc(docRef);
      const data = newDoc.data()!;
      
      return {
        ...data,
        id: docRef.id,
        createdAt: new Date()
      } as Service;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw handleFirestoreError(error);
    }
  },

  getById: async (id: string): Promise<Service | null> => {
    try {
      const docRef = doc(db, 'services', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date()
      } as Service;
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  update: async (id: string, updates: Partial<Service>): Promise<Service> => {
    try {
      const docRef = doc(db, 'services', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data()!;
      
      return {
        ...data,
        id: updatedDoc.id,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date()
      } as Service;
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  incrementCompletedTasks: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'services', id);
      await updateDoc(docRef, {
        completedTasks: increment(1)
      });
    } catch (error) {
      throw handleFirestoreError(error);
    }
  }
};