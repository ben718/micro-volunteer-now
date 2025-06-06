import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Heart, Search, Award } from 'lucide-react';
import MissionCard from './MissionCard';
import { useHomePage } from '@/hooks/useHomePage';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage = ({ onGetStarted }: HomePageProps) => {
  const navigate = useNavigate();
  const { data, loading, error } = useHomePage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-destructive mb-2">Une erreur est survenue</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-success/5 to-accent/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Aider en <span className="text-primary">15 minutes</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Missions de micro-bénévolat près de chez vous. Simple, rapide, impactant.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button onClick={onGetStarted} className="btn-primary text-lg px-8 py-4">
                <Heart className="h-5 w-5 mr-2" />
                Rejoindre maintenant
              </Button>
              <Button variant="outline" className="text-lg px-8 py-4" onClick={() => navigate('/explore')}>
                Découvrir
              </Button>
              <Button variant="link" className="text-lg px-8 py-4" onClick={() => navigate('/login')}>
                Se connecter
              </Button>
            </div>

            {/* Promesses clés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Clock className="h-5 w-5 text-success" />
                <span>15 min minimum</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-success" />
                <span>&lt; 15 min de trajet</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Users className="h-5 w-5 text-success" />
                <span>2 clics pour participer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comment ça marche
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trois étapes simples pour transformer votre temps libre en impact social
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center animate-slide-up">
              <div className="bg-gradient-to-br from-primary to-success p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">1. Trouve</h3>
              <p className="text-muted-foreground">
                Découvrez des missions de bénévolat près de chez vous, adaptées à votre temps libre
              </p>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-gradient-to-br from-accent to-warning p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">2. Aide</h3>
              <p className="text-muted-foreground">
                Participez à une mission de 15 minutes minimum et faites la différence dans votre communauté
              </p>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-impact to-primary p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">3. Mesure</h3>
              <p className="text-muted-foreground">
                Visualisez votre impact, gagnez des badges et progressez dans votre parcours solidaire
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missions populaires */}
      <section className="py-20 bg-gradient-to-br from-secondary/20 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Missions populaires
            </h2>
            <p className="text-xl text-muted-foreground">
              Rejoignez d'autres bénévoles dans ces missions près de chez vous
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {data.featuredMissions.map((mission, index) => (
              <div key={mission.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <MissionCard
                  mission={mission}
                  onParticipate={() => console.log(`Participer à: ${mission.title}`)}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={onGetStarted} className="btn-primary text-lg px-8 py-4">
              Voir toutes les missions
            </Button>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ils ont déjà aidé
            </h2>
            <p className="text-xl text-muted-foreground">
              Découvrez les témoignages de notre communauté solidaire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {data.testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="bg-card border border-border rounded-xl p-6 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar || testimonial.name[0]}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-foreground">{testimonial.name}, {testimonial.age} ans</p>
                    <p className="text-sm text-muted-foreground">{testimonial.missions_count} missions • Niveau {testimonial.level}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-action final */}
      <section className="py-20 bg-gradient-to-r from-primary to-success text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à faire la différence ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez une communauté de voisins solidaires et commencez à aider dès aujourd'hui
          </p>
          <Button onClick={onGetStarted} className="bg-white text-primary hover:bg-gray-50 text-lg px-8 py-4">
            <Heart className="h-5 w-5 mr-2" />
            Commencer maintenant
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
