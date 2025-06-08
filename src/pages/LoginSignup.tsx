import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

type AuthMode = 'login' | 'signup' | 'reset';

interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export default function LoginSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>(
    location.pathname === '/signup' ? 'signup' : 'login'
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'benevole',
  });

  // Mettre à jour le mode lorsque l'URL change
  useEffect(() => {
    console.log('URL changed to:', location.pathname);
    setMode(location.pathname === '/signup' ? 'signup' : 'login');
  }, [location.pathname]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (mode === 'login' || mode === 'signup') {
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
    }

    if (mode === 'signup') {
      if (!formData.firstName) {
        newErrors.firstName = 'Le prénom est requis';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Le nom est requis';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              role: formData.role,
            },
          },
        });

        if (error) throw error;
        toast.success('Inscription réussie ! Vérifiez votre email.');
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        toast.success('Connexion réussie !');
        navigate('/');
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
        toast.success('Instructions de réinitialisation envoyées par email.');
        setMode('login');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {mode === 'login' ? 'Connexion' : mode === 'signup' ? 'Inscription' : 'Réinitialisation du mot de passe'}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {mode === 'login' ? (
                  <>
                    Pas encore de compte ?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Créer un compte
                    </button>
                  </>
                ) : mode === 'signup' ? (
                  <>
                    Déjà un compte ?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Se connecter
                    </button>
                  </>
                ) : (
                  <>
                    Retour à la{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      connexion
                    </button>
                  </>
                )}
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                {mode === 'signup' && (
                  <>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      label="Prénom"
                      required
                      icon={<UserIcon className="h-5 w-5 text-gray-400" />}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      error={errors.firstName}
                      fullWidth
                    />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      label="Nom"
                      required
                      icon={<UserIcon className="h-5 w-5 text-gray-400" />}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={errors.lastName}
                      fullWidth
                    />
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Rôle
                      </label>
                      <select
                        id="role"
                        name="role"
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="benevole">Bénévole</option>
                        <option value="association">Association</option>
                      </select>
                    </div>
                  </>
                )}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  required
                  icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  fullWidth
                />
                {mode !== 'reset' && (
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Mot de passe"
                    required
                    icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    helperText={mode === 'signup' ? 'Minimum 6 caractères' : undefined}
                    fullWidth
                  />
                )}
              </div>

              {mode === 'login' && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 
                    mode === 'login' ? 'Se connecter' : 
                    mode === 'signup' ? "S'inscrire" : 
                    'Réinitialiser le mot de passe'}
                </Button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}