import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, Info, Send } from 'lucide-react';
import { servicesService } from '../services/firebase/services';
import { tasksService } from '../services/firebase/tasks';
import type { Service } from '../types';

export default function BookService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      if (!id) return;

      try {
        const serviceData = await servicesService.getById(id);
        if (serviceData) {
          setService(serviceData);
          // Vérifier si l'utilisateur a assez de temps
          if (user && user.timeBalance < serviceData.timeBlocks * 8) {
            setShowPaymentPrompt(true);
          }
        } else {
          navigate('/services');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Une erreur est survenue lors du chargement du service');
        }
        console.error('Error loading service:', err);
      }
    };

    loadService();
  }, [id, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !user) return;

    // Vérifier à nouveau le solde de temps
    if (user.timeBalance < service.timeBlocks * 8) {
      setShowPaymentPrompt(true);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      await tasksService.create({
        serviceId: service.id,
        providerId: service.provider.id,
        beneficiaryId: user.id,
        timeBlocks: service.timeBlocks,
        message,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
      });

      navigate('/profile?tab=pending', { 
        state: { 
          message: 'Votre demande a été envoyée avec succès au prestataire' 
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la création de la demande');
      }
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = () => {
    // Rediriger vers la page de paiement
    navigate('/payment', { 
      state: { 
        requiredTime: service?.timeBlocks ? service.timeBlocks * 8 : 0,
        returnUrl: `/book/${id}`
      }
    });
  };

  const availableTimeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (!service) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-primary-50 flex items-center justify-center">
        {error ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
        )}
      </div>
    );
  }

  if (showPaymentPrompt) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-primary-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Solde insuffisant</h2>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas assez de temps disponible pour réserver ce service.
              Il vous faut {service.timeBlocks * 8} minutes, mais vous n'avez que {user?.timeBalance} minutes.
            </p>
            <p className="text-gray-600 mb-6">
              Vous pouvez acheter du temps supplémentaire (1€ = 8 minutes).
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate('/services')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Retour aux services
              </button>
              <button
                onClick={handlePayment}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal"
              >
                Acheter du temps
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-primary-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-primary px-6 py-8">
            <h1 className="text-2xl font-bold text-white">{service.title}</h1>
            <p className="mt-2 text-primary-100">Proposé par {service.provider.username}</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-teal mt-0.5" />
              <div>
                <h2 className="text-lg font-medium text-primary">Détails du service</h2>
                <p className="mt-2 text-gray-600">{service.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Durée: {service.timeBlocks * 8} minutes
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date souhaitée
              </label>
              <div className="mt-1 relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  min={today}
                  max={maxDateStr}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal focus:border-teal"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Horaire souhaité
              </label>
              <div className="mt-1 relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="time"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal focus:border-teal"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="">Choisir un horaire</option>
                  {availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message pour {service.provider.username}
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  rows={4}
                  required
                  placeholder="Présentez-vous et expliquez pourquoi vous souhaitez bénéficier de ce service..."
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal focus:ring-teal sm:text-sm p-3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer la demande
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}