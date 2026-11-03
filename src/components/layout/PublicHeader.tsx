import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Heart,
  Menu,
  X,
  Phone,
  ShieldCheck,
  ChevronDown,
  Globe,
  User as UserIcon,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useFavorites } from '../../services/favoritesContext';
import { useAuth, isStaffRole } from '../../services/authContext';
import { Language } from '../../types';
import { luxuryEase } from '../animations/motionVariants';

export const PublicHeader: React.FC = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isStaff = isAuthenticated && isStaffRole(user?.role);
  const accountHref = isStaff ? '/admin/dashboard' : '/favorites';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/properties', label: t('nav.properties') },
    { href: '/construction', label: t('nav.construction') },
    { href: '/design', label: t('nav.design') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-all duration-300 ${
      isScrolled ? 'bg-white/98 shadow-luxury border-ivory-300' : 'bg-white/95 border-ivory-200'
    }`}>
      {/* Top micro bar */}
      <div className="bg-charcoal text-ivory text-[11px] py-1.5 px-4 sm:px-8 border-b border-charcoal-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-beige">
              <Compass className="w-3.5 h-3.5 text-bronze" />
              <span className="hidden sm:inline">Casablanca CFC • Marrakech Guéliz • Rabat Souissi</span>
              <span className="sm:hidden">Casablanca • Marrakech</span>
            </span>
            <a href="tel:+212522458090" className="hidden md:inline-flex items-center gap-1 text-ivory/80 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-bronze" />
              <span>+212 5 22 45 80 90</span>
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden xl:inline-flex items-center gap-1.5 text-ivory/70 font-hand text-base">
              — L’équipe vous répond sous 24 h
            </span>
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 py-0.5 px-2 rounded hover:bg-charcoal-700 text-ivory transition-colors cursor-pointer"
                aria-label="Sélectionner la langue"
              >
                <Globe className="w-3.5 h-3.5 text-bronze" />
                <span className="uppercase font-semibold tracking-wider">
                  {language === 'fr' ? 'Français' : language === 'ar' ? 'العربية' : 'English'}
                </span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: luxuryEase }}
                    className={`absolute top-full mt-1.5 ${
                      isRTL ? 'left-0' : 'right-0'
                    } w-32 bg-charcoal-800 border border-charcoal-600 rounded-md shadow-xl py-1 z-50 text-xs`}
                  >
                    <button
                      onClick={() => handleLangChange('fr')}
                      className={`w-full text-left px-3 py-1.5 hover:bg-charcoal-700 transition-colors ${
                        language === 'fr' ? 'text-bronze font-bold' : 'text-ivory'
                      }`}
                    >
                      Français (FR)
                    </button>
                    <button
                      onClick={() => handleLangChange('ar')}
                      className={`w-full text-left px-3 py-1.5 hover:bg-charcoal-700 transition-colors font-arabic ${
                        language === 'ar' ? 'text-bronze font-bold' : 'text-ivory'
                      }`}
                    >
                      العربية (AR)
                    </button>
                    <button
                      onClick={() => handleLangChange('en')}
                      className={`w-full text-left px-3 py-1.5 hover:bg-charcoal-700 transition-colors ${
                        language === 'en' ? 'text-bronze font-bold' : 'text-ivory'
                      }`}
                    >
                      English (EN)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Staff access */}
            <Link
              to={isStaff ? '/admin/dashboard' : '/login'}
              className="hidden sm:flex items-center gap-1 text-beige hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-bronze" />
              <span>{isStaff ? t('nav.adminDashboard') : t('nav.login')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-charcoal text-ivory flex items-center justify-center font-serif text-xl border border-bronze/40 group-hover:border-bronze transition-colors shadow-sm">
            <span className="text-bronze">D</span>&amp;<span className="text-white text-xs ml-0.5">A</span>
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-xl font-bold tracking-widest text-charcoal uppercase leading-none">
              DAR &amp; ATELIER
            </span>
            <span className="block text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-bronze font-medium mt-1">
              Immobilier &bull; Architecture &bull; Construction
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm tracking-wide transition-colors py-1 relative font-medium ${
                isActive(link.href)
                  ? 'text-bronze font-semibold'
                  : 'text-charcoal/80 hover:text-bronze'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-bronze rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions Right */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-4">
          {/* Favorites */}
          <Link
            to="/favorites"
            className="relative p-2 text-charcoal hover:text-bronze transition-colors"
            aria-label="Voir les favoris"
            title={t('nav.favorites')}
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-bronze text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* User Account / Admin */}
          {isAuthenticated ? (
            <Link
              to={accountHref}
              title={isStaff ? t('nav.adminDashboard') : t('nav.favorites')}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-ivory hover:bg-beige/30 border border-beige/60 text-charcoal text-xs transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <span className="w-6 h-6 rounded-full bg-clay/15 text-clay-dark flex items-center justify-center font-serif font-bold text-xs">
                  {user?.name?.charAt(0) || 'D'}
                </span>
              )}
              <span className="font-medium truncate max-w-[100px]">{user?.name?.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="p-2 text-charcoal hover:text-bronze transition-colors"
              title={t('nav.login')}
            >
              <UserIcon className="w-5 h-5" />
            </Link>
          )}

          {/* Primary CTA */}
          <Link
            to="/request-quote"
            className="inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wider bg-bronze hover:bg-bronze-dark text-white px-4 py-2.5 rounded-md shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
          >
            {t('nav.requestQuote')}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-charcoal hover:text-bronze focus:outline-none cursor-pointer"
          aria-label="Basculer le menu mobile"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: luxuryEase }}
            className="lg:hidden bg-white border-b border-beige/40 overflow-hidden shadow-xl"
          >
            <div className="px-6 py-6">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-serif py-1 transition-colors ${
                      isActive(link.href) ? 'text-bronze font-bold' : 'text-charcoal hover:text-bronze'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-ivory-200 flex flex-col gap-3">
                  <Link
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-sm text-charcoal py-1"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-bronze" />
                      <span>{t('nav.favorites')}</span>
                    </span>
                    <span className="bg-bronze/20 text-bronze-dark px-2 py-0.5 rounded-full text-xs font-bold">
                      {favoritesCount}
                    </span>
                  </Link>
                  <Link
                    to={isStaff ? '/admin/dashboard' : '/login'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-charcoal py-1"
                  >
                    <ShieldCheck className="w-4 h-4 text-bronze" />
                    <span>{isStaff ? t('nav.adminDashboard') : t('nav.login')}</span>
                  </Link>
                  <a
                    href="tel:+212522458090"
                    className="flex items-center gap-2 text-sm text-charcoal py-1"
                  >
                    <Phone className="w-4 h-4 text-bronze" />
                    <span>Parler à l’équipe — +212 5 22 45 80 90</span>
                  </a>
                  <Link
                    to="/request-quote"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2 text-center text-xs font-semibold uppercase tracking-wider bg-bronze text-white py-3 rounded-md shadow-sm"
                  >
                    {t('nav.requestQuote')}
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
