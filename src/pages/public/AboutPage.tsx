import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Award,
  Shield,
  Users,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Quote as QuoteIcon,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { TEAM_MEMBERS, ATELIER_VALUES } from '../../services/team';
import { STOCK } from '../../services/imageLibrary';
import { RevealOnScroll, StaggerContainer, StaggerItem } from '../../components/animations';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-ivory-100 min-h-screen animate-fade-in pb-20">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-charcoal text-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={STOCK.hero.atelier}
            alt="L’équipe DAR & ATELIER réunie à l’atelier"
            className="w-full h-full object-cover opacity-30 warm-photo"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/50" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10">
          <p className="font-hand text-2xl sm:text-3xl text-beige/90 mb-4">Une maison de famille, pas une agence.</p>
          <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-3 block">
            Maison d’Architecture &amp; Immobilier
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-ivory mb-6 leading-tight">
            L’Excellence du Bâti,
            <span className="block italic text-beige">la Noblesse des Espaces</span>
          </h1>
          <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-2xl mx-auto">
            Fondée par une alliance d’architectes et d’ingénieurs en génie civil au Maroc, DAR &amp; ATELIER
            réinvente l’art d’habiter et de construire entre tradition millénaire et avant-garde internationale.
            Mais avant tout, c’est une équipe de quatre personnes qui vous connaît par votre prénom.
          </p>
        </div>
      </section>

      {/* Philosophy & Mission */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="section-eyebrow">Notre philosophie</span>
            <h2 className="text-3xl font-serif text-charcoal leading-tight">
              Unir la rigueur de l’ingénierie
              <span className="block italic text-clay">à l’émotion architecturale</span>
            </h2>
            <p className="text-xs sm:text-sm text-mutedgray leading-relaxed">
              Nous récusons la séparation artificielle entre la recherche immobilière, la conception des plans
              et la conduite du chantier. Pour qu’une propriété soit véritablement remarquable, elle doit être
              pensée dans sa globalité : de l’orientation du terrain sous le soleil marocain à la coupe du marbre
              et à la fluidité de ses espaces de vie.
            </p>
            <p className="text-xs sm:text-sm text-mutedgray leading-relaxed">
              Nos bureaux implantés à Casablanca Finance City et à Marrakech Guéliz accompagnent une clientèle
              privée marocaine et internationale en quête de transparence, de discrétion absolue et d’exigence
              sans compromis.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-ivory-300">
              <div>
                <span className="text-2xl font-serif font-bold text-clay block">1 seul</span>
                <span className="text-xs text-mutedgray">Interlocuteur, de la visite à la remise des clés</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-clay block">24 h</span>
                <span className="text-xs text-mutedgray">Délai moyen de réponse de l’équipe</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="rounded-luxury overflow-hidden shadow-luxury border border-beige/40">
                <img
                  src={STOCK.hero.villa}
                  alt="Architecture contemporaine marocaine"
                  className="w-full aspect-[4/3] object-cover warm-photo"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-3 sm:left-6 w-40 sm:w-48 bg-ivory-50 p-3 rounded-sm shadow-luxury border border-beige/60 -rotate-2">
                <img
                  src={STOCK.atelier[0]}
                  alt="Un moment de travail à l’atelier"
                  className="w-full aspect-square object-cover rounded-sm"
                  loading="lazy"
                />
                <p className="font-hand text-lg text-charcoal text-center mt-2">L’atelier, le vrai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white border-y border-beige/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <RevealOnScroll direction="up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-eyebrow justify-center mb-2">Ce qui compte pour nous</span>
              <h2 className="text-3xl font-serif text-charcoal">Trois promesses simples</h2>
            </div>
          </RevealOnScroll>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ATELIER_VALUES.map((value, index) => (
              <StaggerItem key={value.title}>
                <div className="p-7 rounded-luxury bg-ivory-50 border border-beige/40 h-full">
                  <span className="font-serif text-3xl text-clay/50 block mb-3">0{index + 1}</span>
                  <h3 className="font-serif text-lg text-charcoal mb-2">{value.title}</h3>
                  <p className="text-xs text-mutedgray leading-relaxed">{value.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Method */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-eyebrow justify-center mb-2">Notre méthode</span>
          <h2 className="text-3xl font-serif text-charcoal">La méthodologie DAR &amp; ATELIER</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 rounded-luxury bg-ivory-50 border border-beige/40">
            <Compass className="w-8 h-8 text-clay mb-4" />
            <h3 className="font-serif text-lg text-charcoal mb-2">1. Conception sur-mesure</h3>
            <p className="text-xs text-mutedgray leading-relaxed">
              Pas de modèles préfabriqués ni de plans génériques. Chaque villa est une œuvre singulière née de
              son terrain et des désirs de ses propriétaires.
            </p>
          </div>

          <div className="p-6 rounded-luxury bg-ivory-50 border border-beige/40">
            <Shield className="w-8 h-8 text-clay mb-4" />
            <h3 className="font-serif text-lg text-charcoal mb-2">2. Transparence budgétaire</h3>
            <p className="text-xs text-mutedgray leading-relaxed">
              Des devis précis au mètre linéaire et mètre carré. Les situations de travaux sont auditées par un
              bureau de contrôle indépendant.
            </p>
          </div>

          <div className="p-6 rounded-luxury bg-ivory-50 border border-beige/40">
            <Award className="w-8 h-8 text-clay mb-4" />
            <h3 className="font-serif text-lg text-charcoal mb-2">3. Matières nobles</h3>
            <p className="text-xs text-mutedgray leading-relaxed">
              Marbres d’Oued Ykem, zellige traditionnel de Fès façonné à la main, noyer d’Amérique massif et
              profilés aluminium à rupture thermique.
            </p>
          </div>

          <div className="p-6 rounded-luxury bg-ivory-50 border border-beige/40">
            <Users className="w-8 h-8 text-clay mb-4" />
            <h3 className="font-serif text-lg text-charcoal mb-2">4. Discrétion &amp; suivi</h3>
            <p className="text-xs text-mutedgray leading-relaxed">
              Une confidentialité totale garantie à chaque étape, de la négociation foncière jusqu’à la remise
              des clés et au-delà.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white border-y border-beige/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <RevealOnScroll direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <span className="section-eyebrow mb-3">Les visages derrière les plans</span>
                <h2 className="text-3xl sm:text-4xl font-serif text-charcoal">
                  Une équipe que vous pouvez appeler
                </h2>
              </div>
              <p className="font-hand text-xl sm:text-2xl text-charcoal/70 max-w-sm md:text-right leading-snug">
                « Le projet avance mieux quand on se parle vraiment. »
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <StaggerItem key={member.id}>
                <article className="bg-ivory-50 rounded-luxury border border-beige/50 overflow-hidden shadow-human flex flex-col sm:flex-row h-full">
                  <div className="sm:w-2/5 aspect-[4/5] sm:aspect-auto overflow-hidden bg-sand">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover warm-photo"
                      loading="lazy"
                    />
                  </div>
                  <div className="sm:w-3/5 p-6 flex flex-col">
                    <h3 className="font-serif text-xl text-charcoal font-bold">{member.name}</h3>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-clay mt-1 mb-3">
                      {member.role}
                    </p>
                    <p className="text-xs text-mutedgray leading-relaxed mb-4 flex-1">{member.bio}</p>
                    <div className="pt-3 border-t border-beige/50 space-y-1.5 text-[11px]">
                      <p className="flex items-center gap-1.5 text-charcoal/80">
                        <MapPin className="w-3 h-3 text-clay" /> {member.city}
                      </p>
                      <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-charcoal/80 hover:text-clay transition-colors">
                        <Phone className="w-3 h-3 text-clay" /> {member.phone}
                      </a>
                      <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 text-charcoal/80 hover:text-clay transition-colors">
                        <Mail className="w-3 h-3 text-clay" /> {member.email}
                      </a>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <QuoteIcon className="w-10 h-10 text-clay/40 mx-auto mb-4" />
        <p className="font-serif text-2xl sm:text-3xl text-charcoal italic leading-relaxed mb-5">
          « Une maison n’est jamais un objet. C’est un endroit où des gens vont se réveiller, se disputer,
          rire et vieillir. Nous ne l’oublions jamais. »
        </p>
        <p className="font-hand text-2xl text-clay-dark">Youssef El Amrani, fondateur</p>
      </section>

      {/* CTA Bottom */}
      <section className="text-center py-12">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-clay hover:bg-clay-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
        >
          <span>Rencontrer notre équipe</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
