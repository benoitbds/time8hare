import { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { Location } from '../../types';
import LocationInput from '../location/LocationInput';
import toast from 'react-hot-toast';

interface LocationSettingsProps {
  location?: Location;
  onSave: (location: Location | undefined) => Promise<void>;
}

export default function LocationSettings({ location, onSave }: LocationSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(location);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(currentLocation);
      setIsEditing(false);
      toast.success('Adresse mise à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'adresse');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-teal" />
            <h3 className="text-lg font-medium text-primary">Adresse</h3>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-teal hover:text-teal-700"
          >
            Modifier
          </button>
        </div>
        {location ? (
          <div className="mt-4 text-gray-600">
            <p>{location.address}</p>
            <p>{location.postalCode} {location.city}</p>
          </div>
        ) : (
          <p className="mt-4 text-gray-500 italic">
            Aucune adresse renseignée
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-teal" />
          <h3 className="text-lg font-medium text-primary">Modifier l'adresse</h3>
        </div>
      </div>

      <LocationInput
        value={currentLocation}
        onChange={setCurrentLocation}
      />

      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setCurrentLocation(location);
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          disabled={isSaving}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>
    </div>
  );
}