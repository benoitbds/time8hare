import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import type { Location } from '../../types';

interface LocationInputProps {
  value: Location | undefined;
  onChange: (location: Location | undefined) => void;
  className?: string;
}

export default function LocationInput({ value, onChange, className = '' }: LocationInputProps) {
  const [address, setAddress] = useState(value?.address || '');
  const [city, setCity] = useState(value?.city || '');
  const [postalCode, setPostalCode] = useState(value?.postalCode || '');
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(false);

  useEffect(() => {
    setIsGeolocationAvailable('geolocation' in navigator);
  }, []);

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://api-adresse.data.gouv.fr/reverse/?lon=${position.coords.longitude}&lat=${position.coords.latitude}`
          );
          const data = await response.json();
          
          if (data.features && data.features[0]) {
            const feature = data.features[0].properties;
            setAddress(feature.name);
            setCity(feature.city);
            setPostalCode(feature.postcode);
            
            onChange({
              address: feature.name,
              city: feature.city,
              postalCode: feature.postcode,
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            });
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  };

  const handleChange = () => {
    if (!address || !city || !postalCode) {
      onChange(undefined);
      return;
    }

    onChange({
      address,
      city,
      postalCode
    });
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                handleChange();
              }}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal"
            />
            {isGeolocationAvailable && (
              <button
                type="button"
                onClick={handleGeolocation}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <MapPin className="h-5 w-5 text-gray-400 hover:text-teal" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Ville
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                handleChange();
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Code postal
            </label>
            <input
              type="text"
              id="postalCode"
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value);
                handleChange();
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}