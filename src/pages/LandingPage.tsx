import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#F3F4F6] flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-[#1F2937]">Voisin Solidaire</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-[#3B82F6] font-medium">
              Connexion
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 pb-20">
        {/* Hero Section */}
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-3">
            Le bénévolat accessible à tous
          </h2>
          <p className="text-[#6B7280] mb-6">
            Aidez près de chez vous, même pour seulement 15 minutes.
          </p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
            <Link
              to="/signup"
              className="bg-[#3B82F6] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#1E40AF] transition duration-200"
            >
              Je deviens bénévole
            </Link>
            <Link
              to="/signup"
              className="bg-white border border-[#3B82F6] text-[#3B82F6] font-medium py-3 px-6 rounded-lg hover:bg-[#EFF6FF] transition duration-200"
            >
              Je suis une association
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Missions courtes
              </h3>
              <p className="text-[#6B7280]">
                Des missions de 15 à 30 minutes pour s'engager facilement.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Proche de chez vous
              </h3>
              <p className="text-[#6B7280]">
                Trouvez des missions dans votre quartier.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                Impact immédiat
              </h3>
              <p className="text-[#6B7280]">
                Aidez des associations locales et des personnes dans le besoin.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#3B82F6] rounded-xl p-6 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Prêt à aider ?</h2>
          <p className="text-white opacity-90 mb-6">
            Rejoignez notre communauté de bénévoles et commencez à aider près de chez vous dès aujourd'hui.
          </p>
          <Link
            to="/signup"
            className="bg-white text-[#3B82F6] font-medium py-3 px-6 rounded-lg hover:bg-[#F3F4F6] transition duration-200 inline-block"
          >
            Je m'inscris
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white p-6 border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-bold text-[#1F2937] mb-3">
                Voisin Solidaire
              </h3>
              <p className="text-sm text-[#6B7280]">
                Le bénévolat accessible à tous
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 