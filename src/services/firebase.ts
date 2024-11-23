// ... rest of the imports remain the same

const handleFirestoreError = (error: unknown) => {
  console.error('Firestore Error:', error);
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        throw new Error('Vous n\'avez pas les permissions nécessaires pour effectuer cette action.');
      case 'not-found':
        throw new Error('La ressource demandée n\'existe pas.');
      case 'failed-precondition':
        throw new Error('Les index de la base de données sont en cours de création. Veuillez réessayer dans quelques minutes.');
      default:
        throw new Error('Une erreur est survenue. Veuillez réessayer.');
    }
  }
  throw new Error('Une erreur inattendue est survenue.');
};

// ... rest of the auth handlers remain the same

export const firebaseService = {
  // ... auth methods remain the same

  services: {
    getAll: async (): Promise<Service[]> => {
      try {
        const servicesRef = collection(db, 'services');
        // Simplified query without complex conditions
        const querySnapshot = await getDocs(servicesRef);
        
        return querySnapshot.docs
          .map(doc => ({
            ...doc.data(),
            id: doc.id,
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
          }))
          .filter(service => service.status === 'active')
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Service[];
      } catch (error) {
        throw handleFirestoreError(error);
      }
    },

    getByCategory: async (category: string): Promise<Service[]> => {
      try {
        const servicesRef = collection(db, 'services');
        // Simplified query without complex conditions
        const querySnapshot = await getDocs(servicesRef);
        
        return querySnapshot.docs
          .map(doc => ({
            ...doc.data(),
            id: doc.id,
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
          }))
          .filter(service => 
            service.status === 'active' && 
            service.category === category
          )
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Service[];
      } catch (error) {
        throw handleFirestoreError(error);
      }
    },

    // ... rest of the service methods remain the same
  },

  // ... rest of the firebase service methods remain the same
};