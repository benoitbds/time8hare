// ... existing types
export interface Location {
  address: string;
  city: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: Category;
  timeBlocks: number;
  status: ServiceStatus;
  createdAt: Date;
  isLocal: boolean;
  location?: Location;
  provider: {
    id: string;
    username: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  timeBalance: number;
  servicesGiven: number;
  servicesReceived: number;
  rating?: number;
  totalRatings?: number;
  createdAt: Date;
  completedTasks: number;
  location?: Location;
}