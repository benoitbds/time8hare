import { Clock, Users, Star, Shield } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      title: "Partagez votre temps",
      description: "Offrez vos compétences en blocs de 8 minutes. Que ce soit pour enseigner, aider ou créer, votre temps est précieux.",
      icon: <Clock className="h-8 w-8" />
    },
    {
      title: "Connectez-vous",
      description: "Trouvez des personnes qui ont besoin de vos compétences ou découvrez ceux qui peuvent vous aider.",
      icon: <Users className="h-8 w-8" />
    },
    {
      title: "Échangez des services",
      description: "Utilisez des blocs de temps pour échanger des services. Chaque bloc dure 8 minutes.",
      icon: <Star className="h-8 w-8" />
    },
    {
      title: "Créez la confiance",
      description: "Évaluez vos expériences et construisez votre réputation. Notre plateforme assure des échanges sûrs.",
      icon: <Shield className="h-8 w-8" />
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-primary-50">
      {/* Hero Section */}
      <div className="relative bg-primary py-16">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000"
            alt="Personnes qui collaborent"
          />
          <div className="absolute inset-0 bg-primary mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Comment ça marche ?
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-primary-100">
              Échangez des services en utilisant des blocs de 8 minutes. C'est simple, équitable et cela crée du lien social.
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="text-teal mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Questions fréquentes
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-2">
                Qu'est-ce qu'un bloc de temps ?
              </h3>
              <p className="text-gray-600">
                Un bloc de temps est notre unité d'échange - 8 minutes de service. Vous pouvez proposer ou demander plusieurs blocs pour des services plus longs.
              </p>
            </div>
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-2">
                Comment commencer ?
              </h3>
              <p className="text-gray-600">
                Inscrivez-vous, parcourez les services disponibles ou proposez les vôtres. Chaque nouvel utilisateur commence avec des blocs de temps pour débuter les échanges.
              </p>
            </div>
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-2">
                Est-ce sécurisé ?
              </h3>
              <p className="text-gray-600">
                Nous vérifions tous les utilisateurs et maintenons un système d'évaluation. Notre plateforme inclut des fonctionnalités de sécurité et des règles pour tous les échanges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}