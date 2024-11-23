import { Search, Filter, MapPin } from 'lucide-react';
import type { Category, Location } from '../../types';

interface ServiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  categories: Array<{ value: string; label: string; }>;
  location?: Location;
  onLocationChange: (location: Location | undefined) => void;
}

export default function ServiceFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  location,
  onLocationChange
}: ServiceFiltersProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un service..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Filtrer par ville..."
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal focus:border-teal rounded-md"
            value={location?.city || ''}
            onChange={(e) => {
              if (e.target.value) {
                onLocationChange({
                  address: '',
                  city: e.target.value,
                  postalCode: ''
                });
              } else {
                onLocationChange(undefined);
              }
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal focus:border-teal rounded-md"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as Category | 'all')}
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}