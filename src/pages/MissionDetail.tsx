import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mission, MissionRegistration } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const MissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mission, setMission] = useState<Mission | null>(null);
  const [registration, setRegistration] = useState<MissionRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadMissionData();
  }, [id]);

  const loadMissionData = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // Charger les détails de la mission
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select(`
          *,
          association:associations (
            id,
            name,
            logo_url,
            description
          )
        `)
        .eq('id', id)
        .single();

      if (missionError) throw missionError;

      // Vérifier si l'utilisateur est déjà inscrit
      if (user) {
        const { data: registrationData, error: registrationError } = await supabase
          .from('mission_registrations')
          .select('*')
          .eq('mission_id', id)
          .eq('user_id', user.id)
          .single();

        if (registrationError && registrationError.code !== 'PGRST116') {
          throw registrationError;
        }

        setRegistration(registrationData);
      }

      setMission(missionData);
    } catch (error: any) {
      setError(error.message);
      toast.error('Erreur lors du chargement de la mission: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!user || !mission) return;

    setIsSubmitting(true);
    try {
      // Vérifier si des places sont encore disponibles
      if (mission.spots_taken >= mission.spots_available) {
        toast.error('Désolé, il n\'y a plus de places disponibles pour cette mission.');
        return;
      }

      // Vérifier si l'utilisateur n'est pas déjà inscrit
      if (registration) {
        toast.error('Vous êtes déjà inscrit à cette mission.');
        return;
      }

      // Créer l'inscription
      const { data, error } = await supabase
        .from('mission_registrations')
        .insert([
          {
            mission_id: mission.id,
            user_id: user.id,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le nombre de places prises
      const { error: updateError } = await supabase
        .from('missions')
        .update({ spots_taken: mission.spots_taken + 1 })
        .eq('id', mission.id);

      if (updateError) throw updateError;

      setRegistration(data);
      toast.success('Inscription réussie !');
    } catch (error: any) {
      toast.error('Erreur lors de l\'inscription: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!user || !mission || !registration) return;

    setIsSubmitting(true);
    try {
      // Supprimer l'inscription
      const { error } = await supabase
        .from('mission_registrations')
        .delete()
        .eq('id', registration.id);

      if (error) throw error;

      // Mettre à jour le nombre de places prises
      const { error: updateError } = await supabase
        .from('missions')
        .update({ spots_taken: mission.spots_taken - 1 })
        .eq('id', mission.id);

      if (updateError) throw updateError;

      setRegistration(null);
      toast.success('Inscription annulée avec succès.');
    } catch (error: any) {
      toast.error('Erreur lors de l\'annulation: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!user || !mission || !registration) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('mission_feedback')
        .insert([
          {
            mission_id: mission.id,
            user_id: user.id,
            rating: feedback.rating,
            comment: feedback.comment
          }
        ]);

      if (error) throw error;

      setShowFeedbackForm(false);
      toast.success('Merci pour votre retour !');
    } catch (error: any) {
      toast.error('Erreur lors de l\'envoi du feedback: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vs-blue-primary"></div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-vs-red-error">
          <p>Une erreur est survenue: {error}</p>
          <button
            onClick={loadMissionData}
            className="mt-4 px-4 py-2 bg-vs-blue-primary text-white rounded-md hover:bg-vs-blue-dark"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* En-tête de la mission */}
        <div className="relative h-48 sm:h-64">
          {mission.image_url ? (
            <img
              src={mission.image_url}
              alt={mission.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-vs-gray-200 flex items-center justify-center">
              <span className="text-vs-gray-400">Aucune image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {mission.title}
            </h1>
            <div className="flex items-center text-white/80">
              <span className="mr-4">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                {new Date(mission.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </span>
              <span>
                <ClockIcon className="w-4 h-4 inline mr-1" />
                {mission.start_time} - {mission.end_time}
              </span>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-vs-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-vs-gray-600">{mission.description}</p>

                {mission.requirements && mission.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-vs-gray-900 mb-2">
                      Prérequis
                    </h3>
                    <ul className="list-disc list-inside text-vs-gray-600">
                      {mission.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {mission.materials_to_bring && mission.materials_to_bring.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-vs-gray-900 mb-2">
                      À apporter
                    </h3>
                    <ul className="list-disc list-inside text-vs-gray-600">
                      {mission.materials_to_bring.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {mission.materials_provided && mission.materials_provided.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-vs-gray-900 mb-2">
                      Fourni par l'association
                    </h3>
                    <ul className="list-disc list-inside text-vs-gray-600">
                      {mission.materials_provided.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Colonne latérale */}
            <div className="lg:col-span-1">
              <div className="bg-vs-gray-50 rounded-lg p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-vs-gray-900 mb-2">
                    Association
                  </h3>
                  <div className="flex items-center">
                    {mission.association?.logo_url ? (
                      <img
                        src={mission.association.logo_url}
                        alt={mission.association.name}
                        className="h-12 w-12 rounded-full mr-3"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-vs-gray-200 flex items-center justify-center mr-3">
                        <span className="text-vs-gray-400">
                          {mission.association?.name?.[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-vs-gray-900">
                        {mission.association?.name}
                      </p>
                      <p className="text-sm text-vs-gray-500">
                        {mission.association?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-vs-gray-900 mb-2">
                    Informations pratiques
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <i className="fas fa-map-marker-alt text-vs-gray-400 mt-1 mr-3"></i>
                      <div>
                        <p className="text-vs-gray-900">{mission.address}</p>
                        <p className="text-vs-gray-500">
                          {mission.postal_code} {mission.city}
                          {mission.distance && (
                            <span className="ml-2 text-primary-600">
                              ({mission.distance} km)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-clock text-vs-gray-400 mr-3"></i>
                      <span className="text-vs-gray-900">
                        {mission.duration} minutes
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-users text-vs-gray-400 mr-3"></i>
                      <span className="text-vs-gray-900">
                        {mission.spots_available - mission.spots_taken} places disponibles
                      </span>
                    </div>
                  </div>
                </div>

                {user ? (
                  <div>
                    {registration ? (
                      <div className="space-y-4">
                        <div className="bg-vs-blue-50 text-vs-blue-700 p-4 rounded-md">
                          <p className="font-medium">Vous êtes inscrit à cette mission</p>
                          <p className="text-sm mt-1">
                            Statut: {registration.status}
                          </p>
                        </div>
                        {registration.status === 'completed' && !showFeedbackForm && (
                          <button
                            onClick={() => setShowFeedbackForm(true)}
                            className="w-full px-4 py-2 text-sm font-medium text-vs-blue-primary border border-vs-blue-primary rounded-md hover:bg-vs-blue-50"
                          >
                            Donner mon avis
                          </button>
                        )}
                        {registration.status === 'pending' && (
                          <button
                            onClick={handleCancelRegistration}
                            disabled={isSubmitting}
                            className="w-full px-4 py-2 text-sm font-medium text-vs-red-error border border-vs-red-error rounded-md hover:bg-vs-red-50"
                          >
                            {isSubmitting ? 'Annulation...' : 'Annuler mon inscription'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={handleRegistration}
                        disabled={isSubmitting || mission.spots_taken >= mission.spots_available}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-vs-blue-primary rounded-md hover:bg-vs-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting
                          ? 'Inscription en cours...'
                          : mission.spots_taken >= mission.spots_available
                          ? 'Complet'
                          : 'S\'inscrire'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-vs-gray-500">
                      Connectez-vous pour vous inscrire à cette mission
                    </p>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-vs-blue-primary rounded-md hover:bg-vs-blue-dark"
                    >
                      Se connecter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de feedback */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-vs-gray-900 mb-4">
              Donnez votre avis
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-vs-gray-700 mb-1">
                  Note
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFeedback({ ...feedback, rating })}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        feedback.rating === rating
                          ? 'bg-vs-blue-primary text-white'
                          : 'bg-vs-gray-100 text-vs-gray-400 hover:bg-vs-gray-200'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-vs-gray-700 mb-1"
                >
                  Commentaire
                </label>
                <textarea
                  id="comment"
                  value={feedback.comment}
                  onChange={(e) =>
                    setFeedback({ ...feedback, comment: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-md border-vs-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className="px-4 py-2 text-sm font-medium text-vs-gray-700 bg-white border border-vs-gray-300 rounded-md hover:bg-vs-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-vs-blue-primary rounded-md hover:bg-vs-blue-dark"
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionDetail; 