import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Shield,
  Compass,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  ChevronDown,
  HardHat,
  Home as HomeIcon,
  Palette,
  Maximize2,
  Quote as QuoteIcon,
  Star,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { LocalStore } from '../../services/storage';
import { RevealOnScroll, StaggerContainer, StaggerItem, luxuryEase } from '../../components/animations';

export const HomePage: React.FC = () => {
  const { t, formatPrice } = useLanguage();
  const navigate = useNavigate();

  // Search state
  const [transactionType, setTransactionType] = useState<'BUY' | 'RENT'>('BUY');
  const [propertyType, setPropertyType] = useState<string>('ALL');
  const [city, setCity] = useState<string>('ALL');
  const [budgetMax, setBudgetMax] = useState<string>('');

  const properties = LocalStore.getProperties().filter((p) => p.isFeatured || p.status === 'AVAILABLE').slice(0, 6);
  const constructionProjects = LocalStore.getConstructionProjects().slice(0, 3);
  const designProjects = LocalStore.getDesignProjects().slice(0, 4);
  const reviews = LocalStore.getReviews();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('transactionType', transactionType);
    if (propertyType !== 'ALL') params.set('type', propertyType);
    if (city !== 'ALL') params.set('city', city);
    if (budgetMax) params.set('maxPrice', budgetMax);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-charcoal text-white overflow-hidden">
        {/* Architectural Background Visual with Ken Burns reveal */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Villa d’architecte contemporaine au Maroc"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.45 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: luxuryEase }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-beige mb-6"
          >
            <Sparkles className="w-4 h-4 text-bronze" />
            <span>{t('hero.badge')}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: luxuryEase }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-ivory max-w-4xl leading-[1.15] mb-6"
          >
            <span className="block">{t('hero.titleLine1')}</span>
            <span className="block italic text-beige font-light">{t('hero.titleLine2')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease: luxuryEase }}
            className="text-base sm:text-lg text-ivory/80 max-w-2xl leading-relaxed mb-10 font-sans"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.52, ease: luxuryEase }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16"
          >
            <Link
              to="/properties"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-bronze hover:bg-bronze-dark text-white text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-luxury hover:shadow-luxury-hover cursor-pointer"
            >
              <span>{t('hero.ctaProperties')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/request-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-white/15 hover:bg-white/25 backdrop-blur-sm text-ivory text-sm font-semibold uppercase tracking-wider border border-white/30 transition-all duration-300 cursor-pointer"
            >
              <span>{t('hero.ctaProject')}</span>
            </Link>
          </motion.div>

          {/* QUICK SEARCH BAR FLOATING */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.66, ease: luxuryEase }}
            className="w-full max-w-5xl bg-white text-charcoal rounded-luxury p-4 sm:p-6 shadow-2xl border border-beige/40"
          >
            {/* Transaction Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-ivory-200 pb-3">
              <button
                type="button"
                onClick={() => setTransactionType('BUY')}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  transactionType === 'BUY'
                    ? 'bg-charcoal text-ivory'
                    : 'text-mutedgray hover:text-charcoal'
                }`}
              >
                {t('search.buy')}
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('RENT')}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  transactionType === 'RENT'
                    ? 'bg-charcoal text-ivory'
                    : 'text-mutedgray hover:text-charcoal'
                }`}
              >
                {t('search.rent')}
              </button>
            </div>

            {/* Search Controls Form */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Type */}
              <div className="text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  {t('search.propertyType')}
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-2.5 text-xs rounded border border-black/15 bg-ivory-50 text-charcoal focus:outline-none focus:border-bronze cursor-pointer"
                >
                  <option value="ALL">{t('search.allTypes')}</option>
                  <option value="VILLA">{t('search.villa')}</option>
                  <option value="APARTMENT">{t('search.apartment')}</option>
                  <option value="PENTHOUSE">{t('search.penthouse')}</option>
                  <option value="LAND">{t('search.land')}</option>
                </select>
              </div>

              {/* City */}
              <div className="text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  {t('search.city')}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 text-xs rounded border border-black/15 bg-ivory-50 text-charcoal focus:outline-none focus:border-bronze cursor-pointer"
                >
                  <option value="ALL">{t('search.allCities')}</option>
                  <option value="Casablanca">Casablanca (Anfa, CFC, Bouskoura)</option>
                  <option value="Marrakech">Marrakech (Palmeraie, Amelkis)</option>
                  <option value="Rabat">Rabat (Souissi, Agdal)</option>
                  <option value="Tanger">Tanger (Malabata, Montagne)</option>
                </select>
              </div>

              {/* Budget Max */}
              <div className="text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  {t('search.budgetMax')} (MAD)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 15 000 000"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full p-2.5 text-xs rounded border border-black/15 bg-ivory-50 text-charcoal placeholder:text-mutedgray/60 focus:outline-none focus:border-bronze"
                />
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 p-3 text-xs font-semibold uppercase tracking-wider bg-bronze hover:bg-bronze-dark text-white rounded transition-colors shadow-sm cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t('search.searchBtn')}</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Floating subtle scroll indicator */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="mt-10 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => window.scrollBy({ top: 400, behavior: 'smooth' })}
          >
            <span className="text-[10px] uppercase tracking-widest text-beige font-medium">Découvrir</span>
            <ChevronDown className="w-4 h-4 text-bronze" />
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED PROPERTIES */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8">
        <RevealOnScroll direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                Portfolio Immobilier d'Excellence
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal">
                Biens Signatures &amp; Demeures Rares
              </h2>
            </div>
            <Link
              to="/properties"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-bronze transition-colors group cursor-pointer"
            >
              <span>Explorer tout le catalogue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <StaggerItem key={prop.id}>
              <PropertyCard property={prop} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 3. COMPREHENSIVE SERVICES OVERVIEW */}
      <section className="py-20 bg-ivory-200 border-y border-beige/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <RevealOnScroll direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                {t('services.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal mb-4">
                {t('services.title')}
              </h2>
              <p className="text-sm text-mutedgray leading-relaxed">
                {t('services.subtitle')}
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <StaggerItem>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-luxury border border-beige/50 hover:shadow-luxury transition-all h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center mb-6">
                    <HomeIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif text-charcoal mb-3">{t('services.realEstate')}</h3>
                  <p className="text-xs text-mutedgray leading-relaxed mb-6">
                    {t('services.realEstateDesc')}
                  </p>
                </div>
                <Link to="/properties" className="text-xs font-bold uppercase tracking-wider text-bronze hover:underline inline-flex items-center gap-1 group">
                  <span>Consulter les biens</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </motion.div>
            </StaggerItem>

            {/* Service 2 */}
            <StaggerItem>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-luxury border border-beige/50 hover:shadow-luxury transition-all h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center mb-6">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif text-charcoal mb-3">{t('services.construction')}</h3>
                  <p className="text-xs text-mutedgray leading-relaxed mb-6">
                    {t('services.constructionDesc')}
                  </p>
                </div>
                <Link to="/construction" className="text-xs font-bold uppercase tracking-wider text-bronze hover:underline inline-flex items-center gap-1 group">
                  <span>Découvrir nos chantiers</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </motion.div>
            </StaggerItem>

            {/* Service 3 */}
            <StaggerItem>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-luxury border border-beige/50 hover:shadow-luxury transition-all h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center mb-6">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif text-charcoal mb-3">{t('services.architecture')}</h3>
                  <p className="text-xs text-mutedgray leading-relaxed mb-6">
                    {t('services.architectureDesc')}
                  </p>
                </div>
                <Link to="/construction" className="text-xs font-bold uppercase tracking-wider text-bronze hover:underline inline-flex items-center gap-1 group">
                  <span>Méthodologie d’ingénierie</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </motion.div>
            </StaggerItem>

            {/* Service 4 */}
            <StaggerItem>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-luxury border border-beige/50 hover:shadow-luxury transition-all h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center mb-6">
                    <Palette className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif text-charcoal mb-3">{t('services.interiorDesign')}</h3>
                  <p className="text-xs text-mutedgray leading-relaxed mb-6">
                    {t('services.interiorDesignDesc')}
                  </p>
                </div>
                <Link to="/design" className="text-xs font-bold uppercase tracking-wider text-bronze hover:underline inline-flex items-center gap-1 group">
                  <span>Visiter l’Atelier Design</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </motion.div>
            </StaggerItem>

            {/* Service 5 */}
            <StaggerItem>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-luxury border border-beige/50 hover:shadow-luxury transition-all h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center mb-6">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif text-charcoal mb-3">{t('services.renovation')}</h3>
                  <p className="text-xs text-mutedgray leading-relaxed mb-6">
                    {t('services.renovationDesc')}
                  </p>
                </div>
                <Link to="/construction" className="text-xs font-bold uppercase tracking-wider text-bronze hover:underline inline-flex items-center gap-1 group">
                  <span>Réhabilitations de prestige</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </motion.div>
            </StaggerItem>

            {/* Service 6 */}
            <StaggerItem>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-luxury border border-beige/50 hover:shadow-luxury transition-all h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center mb-6">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif text-charcoal mb-3">{t('services.landscaping')}</h3>
                  <p className="text-xs text-mutedgray leading-relaxed mb-6">
                    {t('services.landscapingDesc')}
                  </p>
                </div>
                <Link to="/design" className="text-xs font-bold uppercase tracking-wider text-bronze hover:underline inline-flex items-center gap-1 group">
                  <span>Espaces extérieurs &amp; piscines</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 4. CONSTRUCTION & ENGINEERING SHOWCASE */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <RevealOnScroll direction="left">
              <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                Maîtrise d’Œuvre Générale
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal mb-6 leading-tight">
                De l’Étude Structurelle aux Clés en Main
              </h2>
              <p className="text-sm text-mutedgray leading-relaxed mb-6">
                Nous opérons comme contractant général pour des clients privés et investisseurs exigeants. Nos équipes d'ingénieurs en béton armé, géotechniciens et maîtres de chantier garantissent une réalisation sans compromis sur les normes parasismiques et les finitions de grand luxe.
              </p>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-charcoal/90">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0" />
                  <span>Interlocuteur unique et engagement contractuel sur les délais</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0" />
                  <span>Béton armé post-contraint et normes parasismiques RPS 2011</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0" />
                  <span>Contrôles techniques rigoureux (bureau de contrôle agréé)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0" />
                  <span>Garantie décennale et assurance tout risque chantier</span>
                </li>
              </ul>

              <Link
                to="/construction"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-charcoal hover:bg-charcoal-900 text-ivory text-xs font-semibold uppercase tracking-wider transition-all hover:shadow-md group"
              >
                <span>Découvrir nos engagements de construction</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-7">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {constructionProjects.map((proj) => (
                <StaggerItem key={proj.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-luxury overflow-hidden border border-beige/40 shadow-sm hover:shadow-luxury transition-all group"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-ivory-200">
                      <img
                        src={proj.coverImage}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-charcoal/80 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded backdrop-blur-xs">
                        {proj.status}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-charcoal text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                        {proj.progressPercentage}% Achevé
                      </div>
                    </div>

                    <div className="p-5">
                      <span className="text-[10px] text-bronze font-bold uppercase tracking-wider block mb-1">
                        {proj.category}
                      </span>
                      <h4 className="font-serif text-base text-charcoal mb-2 line-clamp-1">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-mutedgray mb-4 flex items-center justify-between">
                        <span>{proj.location}</span>
                        <span className="font-semibold text-charcoal">
                          {formatPrice(proj.contractAmount)}
                        </span>
                      </p>

                      {/* Smooth animated progress bar */}
                      <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-bronze h-full rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${proj.progressPercentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* 5. INTERIOR DESIGN & ARCHITECTURE SHOWCASE */}
      <section className="py-20 bg-charcoal text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <RevealOnScroll direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                  Atelier d'Architecture d'Intérieur
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-ivory">
                  Sensibilité Minérale &amp; Matières Signatures
                </h2>
              </div>
              <Link
                to="/design"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-beige hover:text-white transition-colors group"
              >
                <span>Voir la galerie des réalisations</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </RevealOnScroll>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {designProjects.map((item) => (
              <StaggerItem key={item.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-charcoal-800 rounded-luxury overflow-hidden border border-charcoal-700 hover:border-bronze/50 transition-all"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-charcoal-900 relative">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/30 to-transparent" />
                    <div className="absolute top-3 left-3 bg-charcoal/70 backdrop-blur-xs text-beige text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-white/10">
                      {item.category.replace('_', ' ')}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif text-lg text-white mb-1 group-hover:text-beige transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-ivory/70 line-clamp-1">{item.location}</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. VERIFIED TESTIMONIALS */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8">
        <RevealOnScroll direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
              Confiance &amp; Témoignages
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal">
              La Reconnaissance de Nos Commanditaires
            </h2>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <StaggerItem key={rev.id}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-luxury border border-beige/40 shadow-luxury flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center gap-1 text-bronze mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-bronze" />
                    ))}
                  </div>
                  <QuoteIcon className="w-8 h-8 text-beige/50 mb-3" />
                  <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed italic mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-ivory-200">
                  <p className="font-serif text-base font-bold text-charcoal">{rev.clientName}</p>
                  <p className="text-xs text-bronze font-medium">{rev.clientRole}</p>
                  <p className="text-[11px] text-mutedgray mt-0.5">{rev.projectType}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 7. CONTACT & CONSULTATION BANNER CTA */}
      <section className="relative py-20 bg-ivory-300 border-t border-beige/60 overflow-hidden">
        <RevealOnScroll direction="up">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-3 block">
              Prenez Rendez-vous
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal mb-6">
              Prêt à Concrétiser Votre Propriété d'Exception ?
            </h2>
            <p className="text-sm sm:text-base text-mutedgray max-w-2xl mx-auto leading-relaxed mb-8">
              Rencontrez nos architectes et directeurs de projets à Casablanca Finance City ou Marrakech Guéliz pour une consultation privée et confidentielle.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/request-quote"
                className="w-full sm:w-auto px-8 py-4 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Demander une estimation personnalisée
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-ivory text-charcoal border border-charcoal/20 rounded text-xs font-semibold uppercase tracking-wider transition-all hover:-translate-y-0.5"
              >
                Contacter nos bureaux
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
};
