import { FirebaseError } from 'firebase/app';

export const handleFirestoreError = (error: unknown) => {
  console.error('Firestore Error:', error);
  
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('Cette adresse email est déjà utilisée.');
      case 'auth/invalid-email':
        throw new Error('Adresse email invalide.');
      case 'auth/operation-not-allowed':
        throw new Error('Opération non autorisée.');
      case 'auth/weak-password':
        throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
      case 'auth/user-disabled':
        throw new Error('Ce compte a été désactivé.');
      case 'auth/user-not-found':
        throw new Error('Aucun compte ne correspond à cette adresse email.');
      case 'auth/wrong-password':
        throw new Error('Mot de passe incorrect.');
      case 'auth/popup-closed-by-user':
        throw new Error('La fenêtre de connexion a été fermée avant la fin du processus.');
      case 'permission-denied':
        throw new Error('Vous n\'avez pas les permissions nécessaires pour effectuer cette action.');
      case 'not-found':
        throw new Error('La ressource demandée n\'existe pas.');
      case 'failed-precondition':
        throw new Error('Les index de la base de données sont en cours de création. Veuillez réessayer dans quelques minutes.');
      case 'resource-exhausted':
        throw new Error('Trop de requêtes simultanées. Veuillez réessayer dans quelques instants.');
      case 'unavailable':
        throw new Error('Le service est temporairement indisponible. Veuillez réessayer plus tard.');
      case 'deadline-exceeded':
        throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
      default:
        console.warn(`Unhandled Firebase error code: ${error.code}`);
        throw new Error('Une erreur inattendue est survenue. Veuillez réessayer.');
    }
  }
  
  if (error instanceof Error) {
    console.warn('Non-Firebase error:', error);
    throw error;
  }
  
  console.warn('Unknown error type:', error);
  throw new Error('Une erreur inattendue est survenue.');
};