import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Award,
  Shield,
  CheckCircle2,
  Users,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-ivory-100 min-h-screen animate-fade-in pb-20">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-charcoal text-ivory overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-3 block">
            Maison d’Architecture &amp; Immobilier
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-ivory mb-6 leading-tight">
            L'Excellence du Bâti, la Noblesse des Espaces
          </h1>
          <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-2xl mx-auto">
            Fondée par une alliance d'architectes et d'ingénieurs en génie civil au Maroc, DAR &amp; ATELIER réinvente l’art d’habiter et de construire entre tradition millénaire et avant-garde internationale.
          </p>
        </div>
      </section>

      {/* Philosophy & Mission */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze block">
              Notre Philosophie
            </span>
            <h2 className="text-3xl font-serif text-charcoal leading-tight">
              Unir la Rigueur de l'Ingénierie à l'Émotion Architecturale
            </h2>
            <p className="text-xs sm:text-sm text-mutedgray leading-relaxed">
              Nous récusons la séparation artificielle entre la recherche immobilière, la conception des plans et la conduite du chantier. Pour qu'une propriété soit véritablement remarquable, elle doit être pensée dans sa globalité : de l’orientation du terrain sous le soleil marocain à la coupe du marbre et à la fluidité de ses espaces de vie.
            </p>
            <p className="text-xs sm:text-sm text-mutedgray leading-relaxed">
              Nos bureaux implantés à Casablanca Finance City et à Marrakech Guéliz accompagnent une clientèle privée marocaine et internationale en quête de transparence, de discrétion absolue et d'exigence sans compromis.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-ivory-200">
              <div>
                <span className="text-2xl font-serif font-bold text-bronze block">100%</span>
                <span className="text-xs text-mutedgray">Interlocuteur unique &amp; engagement clé en main</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-bronze block">RPS 2011</span>
                <span className="text-xs text-mutedgray">Conformité parasismique et décennale</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-luxury overflow-hidden shadow-luxury border border-beige/40">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85"
                alt="Architecture contemporaine marocaine"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of the Atelier */}
      <section className="py-20 bg-white border-y border-beige/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
              Nos 4 Piliers
            </span>
            <h2 className="text-3xl font-serif text-charcoal">
              La Méthodologie DAR &amp; ATELIER
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-luxury bg-ivory-50 border border-beige/40">
              <Compass className="w-8 h-8 text-bronze mb-4" />
              <h3 className="font-serif text-lg text-charcoal mb-2">1. Conception Sur-Mesure</h3>
              <p className="text-xs text-mutedgray leading-relaxed">
                Pas de modèles préfabriqués ni de plans génériques. Chaque villa est une œuvre singulière née de son terrain et des désirs de ses propriétaires.
              </p>
            </div>

            <div className="p-6 rounded-luxury bg-ivory-50 border border-beige/40">
              <Shield className="w-8 h-8 text-bronze mb-4" />
              <h3 className="font-serif text-lg text-charcoal mb-2">2. Transparence Budgétaire</h3>
              <p className="text-xs text-mutedgray leading-relaxed">
                Des devis précis au mètre linéaire et mètre carré. Les situations de travaux sont auditées par un bureau de contrôle indépendant.
              </p>
            </div>

            <div className="p-6 rounded-luxury bg-ivory-50 border border-beige/40">
              <Award className="w-8 h-8 text-bronze mb-4" />
              <h3 className="font-serif text-lg text-charcoal mb-2">3. Matières Nobles</h3>
              <p className="text-xs text-mutedgray leading-relaxed">
                Marbres d'Oued Ykem, zellige traditionnel de Fès façonné à la main, noyer d'Amérique massif et profilés aluminium à rupture thermique.
              </p>
            </div>

            <div className="p-6 rounded-luxury bg-ivory-50 border border-beige/40">
              <Users className="w-8 h-8 text-bronze mb-4" />
              <h3 className="font-serif text-lg text-charcoal mb-2">4. Discrétion &amp; Suivi</h3>
              <p className="text-xs text-mutedgray leading-relaxed">
                Une confidentialité totale garantie à chaque étape, de la négociation foncière jusqu'à la remise des clés et au-delà.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Direction */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
            Direction Pluridisciplinaire
          </span>
          <h2 className="text-3xl font-serif text-charcoal">
            Les Visages de l'Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-luxury border border-beige/40 shadow-sm text-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="Youssef El Amrani"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-bronze/40"
            />
            <h4 className="font-serif text-lg text-charcoal font-bold">Youssef El Amrani</h4>
            <p className="text-xs text-bronze font-semibold mb-3">Associé Fondateur &amp; Directeur Général</p>
            <p className="text-xs text-mutedgray leading-relaxed">
              Plus de 15 années d'expertise dans le développement d'actifs immobiliers d'exception au Maroc et à l'international.
            </p>
          </div>

          <div className="bg-white p-6 rounded-luxury border border-beige/40 shadow-sm text-center">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
              alt="Ing. Mehdi Bennani"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-bronze/40"
            />
            <h4 className="font-serif text-lg text-charcoal font-bold">Ing. Mehdi Bennani</h4>
            <p className="text-xs text-bronze font-semibold mb-3">Directeur des Chantiers &amp; Maîtrise d'Œuvre</p>
            <p className="text-xs text-mutedgray leading-relaxed">
              Ingénieur en génie civil spécialisé en structures parasismiques et conduite de grands travaux résidentiels de luxe.
            </p>
          </div>

          <div className="bg-white p-6 rounded-luxury border border-beige/40 shadow-sm text-center">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
              alt="Leila Tazi"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-bronze/40"
            />
            <h4 className="font-serif text-lg text-charcoal font-bold">Architecte Leila Tazi</h4>
            <p className="text-xs text-bronze font-semibold mb-3">Directrice de l'Atelier Design &amp; Architecture</p>
            <p className="text-xs text-mutedgray leading-relaxed">
              Diplômée de l'École Spéciale d'Architecture de Paris, experte des finitions minérales et du mobilier sculptural.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="text-center py-12">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
        >
          <span>Rencontrer notre direction</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
