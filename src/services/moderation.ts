import toast from 'react-hot-toast';
import type { Category } from '../types';

interface ModerationRequest {
  title: string;
  description: string;
  category: Category;
  timeBlocks: number;
}

interface ModerationResponse {
  status: 'Validé' | 'Rejeté';
  reason: string | null;
  suggestions: string | null;
}

const MISTRAL_API_KEY = '002gI3qqRuGKJAWiuazKd1m7EoIaGp02';
const MISTRAL_AGENT_ID = 'ag:83a53362:20241121:time8hare-moderateur-service:125be750';

// Validation locale avant d'appeler l'API
const validateLocally = (service: ModerationRequest): void => {
  if (service.title.length < 5) {
    throw new Error('Le titre doit contenir au moins 5 caractères');
  }
  if (service.description.length < 20) {
    throw new Error('La description doit contenir au moins 20 caractères');
  }
  if (service.timeBlocks < 1 || service.timeBlocks > 12) {
    throw new Error('Le nombre de blocs doit être compris entre 1 et 12');
  }
};

const handleModerationResult = (result: ModerationResponse): void => {
  if (result.status === 'Validé') {
    toast.success('Proposition de service validée');
  }
};

export const moderationService = {
  validateService: async (service: ModerationRequest): Promise<ModerationResponse> => {
    try {
      // Validation locale d'abord
      validateLocally(service);

      const response = await fetch('https://api.mistral.ai/v1/agents/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          agent_id: `${MISTRAL_AGENT_ID}`,
          messages: [{
            role: "user",
            content: JSON.stringify({
              action: "moderate_service",
              service
            })
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API Mistral:', errorData);
        throw new Error('Le service de modération est temporairement indisponible');
      }

      const data = await response.json();
      
      try {
        const moderationResult = JSON.parse(data.choices[0].message.content) as ModerationResponse;
        handleModerationResult(moderationResult);
        return moderationResult;
      } catch (parseError) {
        console.error('Erreur de parsing de la réponse:', parseError);
        throw new Error('Erreur lors de l\'analyse de la réponse de modération');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error('Erreur de modération:', error);
      throw new Error('Le service de modération est temporairement indisponible');
    }
  }
};