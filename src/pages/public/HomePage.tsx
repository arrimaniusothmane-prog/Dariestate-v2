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
  ChevronDown,
  HardHat,
  Home as HomeIcon,
  Palette,
  Quote as QuoteIcon,
  Star,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { LocalStore } from '../../services/storage';
import { STOCK } from '../../services/imageLibrary';
import { TEAM_MEMBERS, ATELIER_VALUES } from '../../services/team';
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
  const reviews = LocalStore.getReviews().filter((r) => r.isPublished).slice(0, 3);

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
    <div className="overflow-hidden">
      {/* 1. HERO — human, warm, named faces */}
      <section className="relative min-h-[92vh] flex items-center bg-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            src={STOCK.hero.villa}
            alt="Villa d’architecte contemporaine au Maroc"
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: luxuryEase }}
                className="font-hand text-2xl sm:text-3xl text-beige/90 mb-5"
              >
                Une maison de famille, pas une agence.
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
                className="text-4xl sm:text-6xl lg:text-6xl font-serif font-normal tracking-tight text-ivory max-w-3xl leading-[1.12] mb-6"
              >
                <span className="block">{t('hero.titleLine1')}</span>
                <span className="block italic text-beige font-light underline-hand">{t('hero.titleLine2')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.24, ease: luxuryEase }}
                className="text-base sm:text-lg text-ivory/80 max-w-xl leading-relaxed mb-9 font-sans"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.34, ease: luxuryEase }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10"
              >
                <Link
                  to="/properties"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-clay hover:bg-clay-dark text-white text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-luxury hover:shadow-luxury-hover cursor-pointer"
                >
                  <span>{t('hero.ctaProperties')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/request-quote"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-sm text-ivory text-sm font-semibold uppercase tracking-wider border border-white/30 transition-all duration-300 cursor-pointer"
                >
                  <span>{t('hero.ctaProject')}</span>
                </Link>
              </motion.div>

              {/* Named human trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex items-center gap-4 max-w-md"
              >
                <div className="flex -space-x-3">
                  {TEAM_MEMBERS.map((member) => (
                    <img
                      key={member.id}
                      src={member.photo}
                      alt={member.name}
                      title={`${member.name} — ${member.shortRole}`}
                      className="w-11 h-11 rounded-full object-cover border-2 border-charcoal bg-charcoal-700 warm-photo"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ivory">Youssef, Leila, Mehdi &amp; Karim</p>
                  <p className="text-[11px] sm:text-xs text-ivory/65 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-light animate-pulse" />
                    Vous répondent personnellement sous 24&nbsp;h ouvrées
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Handwritten note card */}
            <motion.div
              initial={{ opacity: 0, x: 24, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: -1.5 }}
              transition={{ duration: 0.9, delay: 0.4, ease: luxuryEase }}
              className="hidden lg:block lg:col-span-5 justify-self-end max-w-xs"
            >
              <div className="paper-card rounded-sm p-6 border border-beige/50 shadow-luxury">
                <p className="font-hand text-2xl text-clay-dark leading-snug mb-4">
                  « Venez avec vos idées. On s’occupe du reste. »
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={STOCK.team.youssef}
                    alt="Youssef El Amrani"
                    className="w-10 h-10 rounded-full object-cover border border-bronze/40"
                  />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Youssef El Amrani</p>
                    <p className="text-[10px] uppercase tracking-wider text-bronze">Associé fondateur</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* QUICK SEARCH BAR FLOATING */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.6, ease: luxuryEase }}
            className="w-full max-w-5xl bg-ivory-50 text-charcoal rounded-luxury p-4 sm:p-6 shadow-2xl border border-beige/50 mt-12"
          >
            <div className="flex items-center justify-between mb-4 border-b border-ivory-300 pb-3 gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionType('BUY')}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    transactionType === 'BUY' ? 'bg-clay text-white' : 'text-mutedgray hover:text-charcoal'
                  }`}
                >
                  {t('search.buy')}
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('RENT')}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    transactionType === 'RENT' ? 'bg-clay text-white' : 'text-mutedgray hover:text-charcoal'
                  }`}
                >
                  {t('search.rent')}
                </button>
              </div>
              <span className="font-hand text-lg text-bronze-dark">Dites-nous juste ce que vous cherchez…</span>
            </div>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  {t('search.propertyType')}
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-2.5 text-xs rounded border border-black/15 bg-white text-charcoal focus:outline-none focus:border-clay cursor-pointer"
                >
                  <option value="ALL">{t('search.allTypes')}</option>
                  <option value="VILLA">{t('search.villa')}</option>
                  <option value="APARTMENT">{t('search.apartment')}</option>
                  <option value="PENTHOUSE">{t('search.penthouse')}</option>
                  <option value="LAND">{t('search.land')}</option>
                </select>
              </div>

              <div className="text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  {t('search.city')}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 text-xs rounded border border-black/15 bg-white text-charcoal focus:outline-none focus:border-clay cursor-pointer"
                >
                  <option value="ALL">{t('search.allCities')}</option>
                  <option value="Casablanca">Casablanca (Anfa, CFC, Bouskoura)</option>
                  <option value="Marrakech">Marrakech (Palmeraie, Amelkis)</option>
                  <option value="Rabat">Rabat (Souissi, Agdal)</option>
                  <option value="Tanger">Tanger (Malabata, Montagne)</option>
                </select>
              </div>

              <div className="text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  {t('search.budgetMax')} (MAD)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 15 000 000"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full p-2.5 text-xs rounded border border-black/15 bg-white text-charcoal placeholder:text-mutedgray/60 focus:outline-none focus:border-clay"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 p-3 text-xs font-semibold uppercase tracking-wider bg-clay hover:bg-clay-dark text-white rounded transition-colors shadow-sm cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t('search.searchBtn')}</span>
                </button>
              </div>
            </form>
          </motion.div>

          <motion.button
            type="button"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="mt-8 hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-beige/80 hover:text-beige transition-colors cursor-pointer"
            onClick={() => window.scrollBy({ top: 600, behavior: 'smooth' })}
          >
            <span>Faire connaissance</span>
            <ChevronDown className="w-4 h-4 text-bronze-light" />
          </motion.button>
        </div>
      </section>

      {/* 2. HUMAN STORY */}
      <section className="py-20 sm:py-28 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 relative">
              <RevealOnScroll direction="left">
                <div className="relative rounded-luxury overflow-hidden shadow-luxury border border-beige/40">
                  <img
                    src={STOCK.hero.atelier}
                    alt="L’équipe DAR & ATELIER en réunion autour d’une table"
                    className="w-full aspect-[4/3] object-cover warm-photo"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delay={0.2}>
                <div className="absolute -bottom-8 -right-4 sm:right-6 w-44 sm:w-52 bg-ivory-50 p-3 rounded-sm shadow-luxury border border-beige/60 rotate-2">
                  <img
                    src={STOCK.atelier[1]}
                    alt="Un moment de travail à l’atelier"
                    className="w-full aspect-square object-cover rounded-sm"
                    loading="lazy"
                  />
                  <p className="font-hand text-lg text-charcoal text-center mt-2 leading-tight">Nos mardis d’atelier</p>
                </div>
              </RevealOnScroll>
            </div>

            <div className="lg:col-span-6">
              <RevealOnScroll direction="up">
                <span className="section-eyebrow mb-4">Derrière chaque plan, des visages</span>
                <h2 className="text-3xl sm:text-4xl font-serif text-charcoal leading-tight mb-5">
                  Nous ne vendons pas des mètres carrés.
                  <span className="block italic text-clay mt-1">Nous accompagnons des vies qui se dessinent.</span>
                </h2>
                <p className="text-sm text-charcoal/75 leading-relaxed mb-4">
                  DAR &amp; ATELIER est né d’une conviction simple : un projet de maison est d’abord une histoire
                  humaine. C’est pourquoi vous ne parlerez jamais à un standard. Dès le premier appel, vous
                  rencontrerez la personne qui suivra votre projet jusqu’à la remise des clés.
                </p>
                <p className="text-sm text-charcoal/75 leading-relaxed mb-8">
                  Leila dessine vos espaces, Mehdi veille sur le chantier, Karim vous fait visiter les lieux,
                  et Youssef garde le fil de vos envies. Une petite équipe, engagée, joignable, qui vous
                  connaît par votre prénom.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                  {ATELIER_VALUES.map((value) => (
                    <div key={value.title} className="border-l-2 border-clay/40 pl-3">
                      <p className="text-xs font-bold text-charcoal mb-1">{value.title}</p>
                      <p className="text-[11px] text-mutedgray leading-relaxed">{value.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <Link to="/about" className="human-link group">
                    <span>Rencontrer l’équipe</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="tel:+212522458090" className="human-link">
                    <Phone className="w-4 h-4 text-clay" />
                    <span>+212 5 22 45 80 90</span>
                  </a>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TEAM */}
      <section className="py-20 sm:py-24 bg-white border-y border-beige/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <RevealOnScroll direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div className="max-w-2xl">
                <span className="section-eyebrow mb-3">Les personnes que vous allez rencontrer</span>
                <h2 className="text-3xl sm:text-4xl font-serif text-charcoal">
                  Une équipe à taille humaine,
                  <span className="block italic text-bronze">pas un service client anonyme.</span>
                </h2>
              </div>
              <p className="font-hand text-xl sm:text-2xl text-charcoal/70 max-w-xs md:text-right leading-snug">
                « Vous avez une question ? Appelez. C’est souvent l’un de nous qui décroche. »
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <StaggerItem key={member.id}>
                <motion.article
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-ivory-50 rounded-luxury border border-beige/50 overflow-hidden shadow-human h-full flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover warm-photo group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-ivory-50/95 text-clay-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
                      {member.shortRole}
                    </span>
                    <p className="absolute bottom-3 left-3 right-3 text-[11px] text-ivory/90 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-beige" /> {member.city}
                    </p>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-serif text-lg text-charcoal font-bold">{member.name}</h3>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-bronze mt-0.5 mb-3">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-mutedgray leading-relaxed mb-4 flex-1">{member.bio}</p>

                    <div className="pt-3 border-t border-beige/50 space-y-1.5 text-[11px]">
                      <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-charcoal/80 hover:text-clay transition-colors">
                        <Phone className="w-3 h-3 text-clay" /> {member.phone}
                      </a>
                      <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 text-charcoal/80 hover:text-clay transition-colors">
                        <Mail className="w-3 h-3 text-clay" /> {member.email}
                      </a>
                      <p className="text-[10px] text-mutedgray pt-1">{member.languages}</p>
                    </div>
                  </div>
                </motion.article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. FEATURED PROPERTIES */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8">
        <RevealOnScroll direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="section-eyebrow mb-2">Des lieux qui ont déjà une histoire</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal">
                Biens signatures &amp; demeures rares
              </h2>
              <p className="text-xs sm:text-sm text-mutedgray mt-3 max-w-xl leading-relaxed">
                Chaque bien est visité par l’un de nous avant de vous être présenté. Si nous le mettons en ligne,
                c’est que nous y avons déjà passé un moment.
              </p>
            </div>
            <Link
              to="/properties"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-clay transition-colors group cursor-pointer"
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

      {/* 5. SERVICES */}
      <section className="py-20 bg-ivory-200 border-y border-beige/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <RevealOnScroll direction="up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="section-eyebrow mb-3 justify-center">Ce que nous faisons ensemble</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal mb-4">{t('services.title')}</h2>
              <p className="text-sm text-mutedgray leading-relaxed">{t('services.subtitle')}</p>
            </div>
          </RevealOnScroll>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: HomeIcon, title: t('services.realEstate'), text: t('services.realEstateDesc'), to: '/properties', label: 'Voir les biens' },
              { icon: HardHat, title: t('services.construction'), text: t('services.constructionDesc'), to: '/construction', label: 'Voir les chantiers' },
              { icon: Palette, title: t('services.interiorDesign'), text: t('services.interiorDesignDesc'), to: '/design', label: 'Entrer dans l’atelier' },
              { icon: Compass, title: t('services.architecture'), text: t('services.architectureDesc'), to: '/construction', label: 'Notre méthode' },
            ].map(({ icon: Icon, title, text, to, label }) => (
              <StaggerItem key={title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-7 rounded-luxury border border-beige/50 hover:shadow-luxury transition-all h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-full bg-clay/10 text-clay flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-serif text-charcoal mb-2">{title}</h3>
                    <p className="text-xs text-mutedgray leading-relaxed mb-5">{text}</p>
                  </div>
                  <Link to={to} className="human-link group">
                    <span>{label}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. CONSTRUCTION — weekly news */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <RevealOnScroll direction="left">
              <span className="section-eyebrow mb-3">Le chantier, sans mur entre nous</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal mb-5 leading-tight">
                Des nouvelles de votre maison,
                <span className="block italic text-sage-dark">chaque semaine.</span>
              </h2>
              <p className="text-sm text-mutedgray leading-relaxed mb-6">
                Mehdi passe sur chaque chantier au moins deux fois par semaine. Vous recevez des photos,
                l’avancement des jalons et un interlocuteur direct pour toutes vos questions.
              </p>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-charcoal/90">
                {[
                  'Un seul interlocuteur, du premier croquis à la remise des clés',
                  'Photos et compte-rendu de chantier chaque semaine',
                  'Budget clair et devis détaillé, sans surprise',
                  'Garantie décennale et assurance tout risque chantier',
                ].map((line) => (
                  <li key={line} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sage flex-shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-5">
                <Link
                  to="/construction"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-charcoal hover:bg-charcoal-900 text-ivory text-xs font-semibold uppercase tracking-wider transition-all hover:shadow-md group"
                >
                  <span>Suivre nos chantiers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="tel:+212663556677" className="human-link">
                  <Phone className="w-4 h-4 text-sage" />
                  <span>Parler à Mehdi</span>
                </a>
              </div>
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
                        src={proj.coverImage || STOCK.construction[0]}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 warm-photo"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-charcoal/80 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded backdrop-blur-xs">
                        {proj.status}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-charcoal text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                        {proj.progressPercentage}% achevé
                      </div>
                    </div>

                    <div className="p-5">
                      <span className="text-[10px] text-clay font-bold uppercase tracking-wider block mb-1">
                        {proj.category}
                      </span>
                      <h4 className="font-serif text-base text-charcoal mb-2 line-clamp-1">{proj.title}</h4>
                      <p className="text-xs text-mutedgray mb-4 flex items-center justify-between">
                        <span>{proj.location}</span>
                        <span className="font-semibold text-charcoal">{formatPrice(proj.contractAmount)}</span>
                      </p>

                      <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-sage h-full rounded-full"
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

      {/* 7. DESIGN SHOWCASE */}
      <section className="py-20 bg-charcoal text-ivory relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-clay/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <RevealOnScroll direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <span className="section-eyebrow mb-3">L’atelier design de Leila</span>
                <h2 className="text-3xl sm:text-4xl font-serif text-ivory">
                  Des matières qu’on aime toucher
                </h2>
                <p className="font-hand text-xl text-beige/80 mt-3 max-w-xl">
                  « Un intérieur réussi, c’est celui où l’on a envie de poser ses clés et de rester. »
                </p>
              </div>
              <Link
                to="/design"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-beige hover:text-white transition-colors group"
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
                  className="group relative bg-charcoal-800 rounded-luxury overflow-hidden border border-charcoal-700 hover:border-clay/50 transition-all"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-charcoal-900 relative">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100 warm-photo"
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

      {/* 8. TESTIMONIALS */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8">
        <RevealOnScroll direction="up">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-eyebrow mb-3 justify-center">Ils nous ont fait confiance</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal">
              Ce que nos clients racontent
            </h2>
            <p className="text-xs sm:text-sm text-mutedgray mt-3 leading-relaxed">
              Des mots de familles qui ont vécu le projet avec nous, pas des avis laissés au hasard.
            </p>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <StaggerItem key={rev.id}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-ivory-50 p-7 rounded-luxury border border-beige/50 shadow-human flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center gap-1 text-clay mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-clay" />
                    ))}
                  </div>
                  <QuoteIcon className="w-7 h-7 text-beige-dark/60 mb-3" />
                  <p className="text-sm text-charcoal/80 leading-relaxed italic mb-6">« {rev.comment} »</p>
                </div>

                <div className="pt-4 border-t border-beige/60 flex items-center gap-3">
                  <img
                    src={rev.avatarUrl || STOCK.people.client1}
                    alt={rev.clientName}
                    className="w-11 h-11 rounded-full object-cover border border-beige warm-photo"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-serif text-base font-bold text-charcoal">{rev.clientName}</p>
                    <p className="text-[11px] text-clay font-medium">{rev.clientRole}</p>
                    <p className="text-[10px] text-mutedgray mt-0.5">
                      {rev.projectType}
                      {index === 0 && ' · Témoignage vérifié'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 9. HUMAN CTA */}
      <section className="relative py-20 bg-ivory-300 border-t border-beige/60 overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/3 hidden lg:block">
          <img
            src={STOCK.atelier[3]}
            alt="L’équipe DAR & ATELIER au travail"
            className="w-full h-full object-cover warm-photo opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory-300 via-ivory-300/70 to-transparent" />
        </div>

        <RevealOnScroll direction="up">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="max-w-2xl">
              <span className="section-eyebrow mb-3">On commence par un café ?</span>
              <h2 className="text-3xl sm:text-5xl font-serif text-charcoal mb-5 leading-tight">
                Racontez-nous votre projet.
                <span className="block italic text-clay">On s’occupe du reste.</span>
              </h2>
              <p className="text-sm sm:text-base text-charcoal/70 max-w-xl leading-relaxed mb-8">
                Un appel, une visite, ou simplement une question. Vous aurez en face de vous une personne
                de l’atelier — jamais un formulaire perdu dans une boîte mail.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-clay hover:bg-clay-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Parler à l’équipe</span>
                </Link>
                <Link
                  to="/request-quote"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-ivory text-charcoal border border-charcoal/20 rounded text-xs font-semibold uppercase tracking-wider transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                >
                  <span>Demander une estimation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-charcoal/70">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-clay" /> Réponse sous 24 h ouvrées
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-clay" /> +212 5 22 45 80 90
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-clay" /> contact@dar-atelier.ma
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
};
