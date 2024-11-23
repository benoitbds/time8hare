import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { handleFirestoreError } from './error';
import type { User } from '../../types';

const googleProvider = new GoogleAuthProvider();
const INITIAL_TIME_BALANCE = 40; // 5 blocs de 8 minutes

export const authService = {
  register: async (email: string, password: string, username: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore with initial time balance
      const userDoc = doc(db, 'users', user.uid);
      const userData: Omit<User, 'id'> = {
        username,
        email,
        timeBalance: INITIAL_TIME_BALANCE,
        servicesGiven: 0,
        servicesReceived: 0,
        createdAt: new Date(),
        completedTasks: 0,
        rating: 0,
        totalRatings: 0
      };

      await setDoc(userDoc, userData);

      return {
        id: user.uid,
        ...userData
      };
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  login: async (email: string, password: string): Promise<UserCredential> => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  loginWithGoogle: async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user: firebaseUser } = result;

      // Check if user document exists
      const userDoc = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        // Create new user document if it doesn't exist
        const userData: Omit<User, 'id'> = {
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email!,
          timeBalance: INITIAL_TIME_BALANCE,
          servicesGiven: 0,
          servicesReceived: 0,
          createdAt: new Date(),
          completedTasks: 0,
          rating: 0,
          totalRatings: 0
        };

        await setDoc(userDoc, userData);

        return {
          id: firebaseUser.uid,
          ...userData
        };
      }

      const userData = userSnap.data() as Omit<User, 'id'>;
      return {
        id: firebaseUser.uid,
        ...userData
      };
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      throw handleFirestoreError(error);
    }
  },

  getCurrentUser: async (uid: string): Promise<User> => {
    try {
      const userDoc = doc(db, 'users', uid);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data() as Omit<User, 'id'>;
      return {
        id: uid,
        ...userData
      };
    } catch (error) {
      throw handleFirestoreError(error);
    }
  }
};