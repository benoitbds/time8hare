import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock8, AlertCircle } from 'lucide-react';
import { Category, Location } from '../types';
import { servicesService } from '../services/firebase/services';
import Toggle from '../components/common/Toggle';
import LocationInput from '../components/location/LocationInput';

export default function GiveService() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('personal-assistance');
  const [timeBlocks, setTimeBlocks] = useState(1);
  const [isLocal, setIsLocal] = useState(false);
  const [location, setLocation] = useState<Location>();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { value: 'personal-assistance', label: 'Aide à la personne' },
    { value: 'culture-leisure', label: 'Culture et loisirs' },
    { value: 'domestic', label: 'Services domestiques' },
    { value: 'tech', label: 'Services numériques' },
    { value: 'education', label: 'Éducation' },
    { value: 'administrative', label: 'Administratif' },
    { value: 'wellness', label: 'Bien-être' },
    { value: 'repair', label: 'Artisanat' },
    { value: 'mobility', label: 'Mobilité' },
    { value: 'solidarity', label: 'Solidarité' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isLocal && !location) {
      setError('Veuillez renseigner une adresse pour un service local');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await servicesService.create({
        title,
        description,
        category,
        timeBlocks,
        isLocal,
        location,
        provider: {
          id: user.id,
          username: user.username
        }
      });

      navigate('/services');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la création du service');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-primary-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm px-6 py-8">
          <div className="flex items-center space-x-3 mb-6">
            <Clock8 className="h-8 w-8 text-teal" />
            <h1 className="text-2xl font-bold text-primary">Proposer mon temps</h1>
          </div>

          {error && (
            <div className="mb-6 whitespace-pre-wrap flex items-start space-x-2 text-red-600 bg-red-50 p-4 rounded-md">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titre du service
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                id="category"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="timeBlocks" className="block text-sm font-medium text-gray-700">
                Blocs de temps (8 minutes chacun)
              </label>
              <input
                type="number"
                id="timeBlocks"
                min="1"
                max="12"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                value={timeBlocks}
                onChange={(e) => setTimeBlocks(parseInt(e.target.value))}
              />
              <p className="mt-1 text-sm text-gray-500">
                Durée totale : {timeBlocks * 8} minutes
              </p>
            </div>

            <div>
              <Toggle
                label="Service local"
                checked={isLocal}
                onChange={setIsLocal}
                description="Activez cette option si votre service nécessite une présence physique"
              />
            </div>

            {isLocal && (
              <LocationInput
                value={location}
                onChange={setLocation}
                className="mt-4"
              />
            )}

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Création...
                  </>
                ) : (
                  'Créer le service'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}