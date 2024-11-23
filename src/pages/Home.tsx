import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const serviceCategories = [
  {
    title: "Aide à la personne",
    description: "5 services disponibles",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800",
    category: "personal-assistance"
  },
  {
    title: "Culture et loisirs",
    description: "5 services disponibles",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=800",
    category: "culture-leisure"
  },
  {
    title: "Services domestiques",
    description: "6 services disponibles",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
    category: "domestic"
  },
  {
    title: "Services numériques et techniques",
    description: "5 services disponibles",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800",
    category: "tech"
  },
  {
    title: "Éducation et apprentissage",
    description: "5 services disponibles",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    category: "education"
  },
  {
    title: "Administratif et juridique",
    description: "4 services disponibles",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    category: "administrative"
  },
  {
    title: "Bien-être et santé",
    description: "4 services disponibles",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    category: "wellness"
  },
  {
    title: "Artisanat et réparation",
    description: "4 services disponibles",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800",
    category: "repair"
  },
  {
    title: "Mobilité et transport",
    description: "4 services disponibles",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
    category: "mobility"
  },
  {
    title: "Solidarité et écologie",
    description: "4 services disponibles",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    category: "solidarity"
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <div className="relative pt-24 pb-32 flex content-center items-center justify-center">
        <div className="absolute top-0 w-full h-full bg-center bg-cover" 
             style={{
               backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2000')"
             }}>
          <span className="w-full h-full absolute opacity-50 bg-primary"></span>
        </div>
        <div className="container relative mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <h1 className="text-white font-bold text-5xl mb-6">
                Le seul remède,<br />c'est le temps
              </h1>
              <p className="mt-4 text-lg text-gray-200">
                Échangez des services en blocs de 8 minutes. Donnez votre temps pour aider les autres et recevez de l'aide quand vous en avez besoin.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                {user ? (
                  <>
                    <button
                      onClick={() => navigate('/give')}
                      className="px-8 py-3 bg-teal text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Je donne
                    </button>
                    <button
                      onClick={() => navigate('/services')}
                      className="px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors"
                    >
                      Je reçois
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-8 py-3 bg-teal text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Je m'inscris
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors"
                    >
                      Je me connecte
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Nos services d'entraide
            </h2>
            <p className="text-xl text-gray-600">
              Du temps pour les autres comme seule monnaie d'échange
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {serviceCategories.map((category, index) => (
              <div
                key={index}
                className="service-card cursor-pointer"
                onClick={() => navigate(`/services?category=${category.category}`)}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="transition-transform duration-300 hover:scale-105"
                />
                <div className="service-card-content">
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                  <p className="text-sm">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Quelques étapes simples pour commencer à partager
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-teal rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Je m'inscris</h3>
              <p className="text-gray-600">
                Créez votre compte et rejoignez notre communauté d'entraide
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-teal rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Je choisis</h3>
              <p className="text-gray-600">
                Décidez si vous souhaitez donner ou recevoir de l'aide
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-teal rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Je partage</h3>
              <p className="text-gray-600">
                Échangez du temps avec d'autres membres en blocs de 8 minutes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}