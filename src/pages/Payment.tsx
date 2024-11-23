import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Clock } from 'lucide-react';
import { userService } from '../services/firebase/user';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blocks, setBlocks] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { requiredTime = 0, returnUrl = '/profile' } = location.state || {};
  const requiredBlocks = Math.ceil(requiredTime / 8);

  const handlePayment = async () => {
    if (!user) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Simuler un paiement (à remplacer par une vraie intégration Stripe)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mettre à jour le solde de l'utilisateur
      await userService.addTimeBalance(user.id, blocks * 8);

      // Rediriger vers la page précédente ou le profil
      navigate(returnUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors du paiement');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-primary-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-primary px-6 py-8">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Acheter du temps</h1>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="blocks" className="block text-sm font-medium text-gray-700">
                  Nombre de blocs de 8 minutes
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min={requiredBlocks || 1}
                    value={blocks}
                    onChange={(e) => setBlocks(Math.max(requiredBlocks || 1, parseInt(e.target.value)))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal focus:ring-teal sm:text-sm"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  1 bloc = 8 minutes = 1€
                </p>
                {requiredTime > 0 && (
                  <p className="mt-2 text-sm text-teal">
                    Minimum {requiredBlocks} bloc{requiredBlocks > 1 ? 's' : ''} requis pour le service sélectionné
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-teal" />
                    <span className="text-sm font-medium text-gray-900">
                      Temps total
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {blocks * 8} minutes
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">{blocks}€</span>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Traitement en cours...
                    </>
                  ) : (
                    'Payer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}