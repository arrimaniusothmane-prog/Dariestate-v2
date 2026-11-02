import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { RevealOnScroll } from '../animations';

export const PublicFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal text-ivory pt-16 pb-12 border-t border-charcoal-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <RevealOnScroll direction="up">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-charcoal-700">
          {/* Col 1 & 2: Brand & Manifesto */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-charcoal-900 text-ivory flex items-center justify-center font-serif text-xl border border-bronze/50">
                <span className="text-bronze">D</span>&amp;<span className="text-white text-xs ml-0.5">A</span>
              </div>
              <div>
                <span className="block font-serif text-xl font-bold tracking-widest text-ivory uppercase">
                  DAR &amp; ATELIER
                </span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-bronze font-medium">
                  Architecture &bull; Immobilier &bull; Construction
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-ivory/70 leading-relaxed mb-6 max-w-sm">
              Maison d’ingénierie et d’architecture de prestige au Maroc. Nous concevons et bâtissons des résidences d’exception à Casablanca, Marrakech, Rabat et Tanger, en alliant la pureté du design contemporain à la richesse du patrimoine artisanal marocain.
            </p>

            {/* Direct WhatsApp link */}
            <a
              href="https://wa.me/212661234567?text=Bonjour,%20je%20souhaiterais%20des%20informations%20sur%20vos%20services%20immobiliers%20et%20de%20construction."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs px-4 py-2.5 rounded-md border border-emerald-600/40 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{t('contact.whatsappDirect')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-bronze mb-4 font-sans">
              Expertises &amp; Métiers
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/75">
              <li>
                <Link to="/properties" className="hover:text-bronze transition-colors">
                  Villas &amp; Demeures de Maîtres
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-bronze transition-colors">
                  Penthouses &amp; Vue Mer
                </Link>
              </li>
              <li>
                <Link to="/construction" className="hover:text-bronze transition-colors">
                  Construction de Villas Neuves
                </Link>
              </li>
              <li>
                <Link to="/construction" className="hover:text-bronze transition-colors">
                  Restauration &amp; Rénovation Lourde
                </Link>
              </li>
              <li>
                <Link to="/design" className="hover:text-bronze transition-colors">
                  Architecture d’Intérieur
                </Link>
              </li>
              <li>
                <Link to="/design" className="hover:text-bronze transition-colors">
                  Mobilier &amp; Boiseries Sur Mesure
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-bronze mb-4 font-sans">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/75">
              <li>
                <Link to="/" className="hover:text-bronze transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-bronze transition-colors">
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <Link to="/construction" className="hover:text-bronze transition-colors">
                  {t('nav.construction')}
                </Link>
              </li>
              <li>
                <Link to="/design" className="hover:text-bronze transition-colors">
                  {t('nav.design')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-bronze transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-bronze transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-bronze transition-colors">
                  {t('nav.favorites')}
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-bronze transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
                  <span>{t('nav.adminDashboard')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Addresses & Presence */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-bronze mb-4 font-sans">
              Bureaux au Maroc
            </h4>
            <div className="space-y-4 text-xs text-ivory/75">
              <div>
                <p className="font-semibold text-ivory flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-bronze" />
                  <span>Casablanca</span>
                </p>
                <p className="text-ivory/65 leading-relaxed">
                  Tour Casablanca Finance City, Boulevard d’Anfa
                </p>
              </div>

              <div>
                <p className="font-semibold text-ivory flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-bronze" />
                  <span>Marrakech</span>
                </p>
                <p className="text-ivory/65 leading-relaxed">
                  Boulevard Mohammed VI, Guéliz
                </p>
              </div>

              <div className="pt-2 border-t border-charcoal-700 space-y-1.5">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-bronze" />
                  <span>+212 5 22 45 80 90</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-bronze" />
                  <span>contact@dar-atelier.ma</span>
                </p>
              </div>
            </div>
          </div>
          </div>
        </RevealOnScroll>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/50">
          <p>
            &copy; {new Date().getFullYear()} DAR &amp; ATELIER. Tous droits réservés. Plateforme d'architecture &amp; immobilier de prestige au Maroc.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-ivory transition-colors">
              Politique de Confidentialité
            </Link>
            <Link to="/terms" className="hover:text-ivory transition-colors">
              Conditions Générales
            </Link>
            <Link to="/admin/dashboard" className="text-beige/80 hover:text-beige transition-colors">
              Accès Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
