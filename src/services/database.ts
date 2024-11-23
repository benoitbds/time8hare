// Simule une couche de persistance avec localStorage
export interface DatabaseService {
  id: string;
  title: string;
  description: string;
  category: string;
  timeBlocks: number;
  createdBy: string;
  createdAt: string;
  status: 'available' | 'pending' | 'completed';
  provider: {
    id: string;
    username: string;
  };
}

const SERVICES_KEY = 'time8share_services';

// Initialize localStorage with empty array if not exists
if (!localStorage.getItem(SERVICES_KEY)) {
  localStorage.setItem(SERVICES_KEY, JSON.stringify([]));
}

export const db = {
  services: {
    getAll: (): DatabaseService[] => {
      const services = localStorage.getItem(SERVICES_KEY);
      return services ? JSON.parse(services) : [];
    },

    create: (service: Omit<DatabaseService, 'id' | 'createdAt'>): DatabaseService => {
      const services = db.services.getAll();
      const newService = {
        ...service,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      
      services.push(newService);
      localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
      return newService;
    },

    update: (id: string, updates: Partial<DatabaseService>): DatabaseService | null => {
      const services = db.services.getAll();
      const index = services.findIndex(s => s.id === id);
      
      if (index === -1) return null;
      
      const updatedService = { ...services[index], ...updates };
      services[index] = updatedService;
      localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
      return updatedService;
    },

    getById: (id: string): DatabaseService | null => {
      const services = db.services.getAll();
      return services.find(s => s.id === id) || null;
    },

    getByCategory: (category: string): DatabaseService[] => {
      const services = db.services.getAll();
      return services.filter(s => s.category === category);
    },

    getAvailableServices: (userId: string): DatabaseService[] => {
      const services = db.services.getAll();
      return services.filter(s => s.status === 'available');
    },

    // Nouvelle méthode pour nettoyer la base de données (utile pour les tests)
    clear: () => {
      localStorage.setItem(SERVICES_KEY, JSON.stringify([]));
    }
  }
};