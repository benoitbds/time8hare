import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la création du compte.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-primary-50">
      <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-teal" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-primary">
              Créer un compte
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Déjà inscrit ?{' '}
              <Link to="/login" className="font-medium text-teal hover:text-teal-700">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow-sm sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Nom d'utilisateur
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-teal focus:outline-none focus:ring-teal sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Minimum 6 caractères
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-teal px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    'Créer mon compte'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}