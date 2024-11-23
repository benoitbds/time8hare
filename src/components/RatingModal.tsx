import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export default function RatingModal({ isOpen, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Veuillez donner une note');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(rating, comment);
      setRating(0);
      setComment('');
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de l\'envoi de l\'évaluation');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-primary mb-4">Évaluer le service</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              id="comment"
              rows={4}
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal focus:ring-teal sm:text-sm p-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}