import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import type { Category, Service, Location } from '../types';
import { servicesService } from '../services/firebase/services';
import { SERVICE_CATEGORIES } from '../constants/categories';
import ServiceHeader from '../components/services/ServiceHeader';
import ServiceFilters from '../components/services/ServiceFilters';
import ServiceCard from '../components/services/ServiceCard';

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const loadServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let servicesList: Service[];
      if (selectedCategory !== 'all') {
        servicesList = await servicesService.getByCategory(selectedCategory);
      } else {
        servicesList = await servicesService.getAll();
      }
      
      // Filtrer les services de l'utilisateur connecté
      const filteredList = user 
        ? servicesList.filter(service => service.provider.id !== user.id)
        : servicesList;
        
      setServices(filteredList);
      setFilteredServices(filteredList);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors du chargement des services.');
      }
      setServices([]);
      setFilteredServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [selectedCategory, user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam as Category);
    }
  }, [location]);

  useEffect(() => {
    if (!services.length) {
      setFilteredServices([]);
      return;
    }

    let filtered = services;

    // Filtre par recherche
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        service =>
          service.title.toLowerCase().includes(lowercaseSearch) ||
          service.description.toLowerCase().includes(lowercaseSearch)
      );
    }

    // Filtre par localisation
    if (selectedLocation?.city) {
      filtered = filtered.filter(service => 
        !service.isLocal || 
        (service.location?.city.toLowerCase() === selectedLocation.city.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedLocation]);

  const handleServiceClick = (service: Service) => {
    if (!user) {
      navigate('/login', { state: { from: `/book/${service.id}` } });
      return;
    }
    navigate(`/book/${service.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-primary-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ServiceHeader user={user} />

        {error && (
          <div className="mb-6 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-md">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <ServiceFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={SERVICE_CATEGORIES}
            location={selectedLocation}
            onLocationChange={setSelectedLocation}
          />

          <div className="divide-y divide-gray-200">
            {filteredServices.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {error ? 'Une erreur est survenue lors du chargement des services.' : 
                  'Aucun service disponible pour le moment.'}
              </div>
            ) : (
              filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  categoryLabel={SERVICE_CATEGORIES.find(c => c.value === service.category)?.label || ''}
                  onClick={() => handleServiceClick(service)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}