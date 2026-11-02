import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HardHat,
  CheckCircle2,
  Shield,
  Layers,
  Award,
  ChevronDown,
  Building,
  Home,
  Hammer,
  Clock,
  Sparkles,
  Phone,
  FileCheck,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { RevealOnScroll, StaggerContainer, StaggerItem } from '../../components/animations';
import { api } from '../../services/api';

export const ConstructionPage: React.FC = () => {
  const { t, formatPrice } = useLanguage();

  // Quote form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [projectType, setProjectType] = useState('VILLA_CONSTRUCTION');
  const [plotSize, setPlotSize] = useState('');
  const [estimatedArea, setEstimatedArea] = useState('');
  const [numberOfFloors, setNumberOfFloors] = useState('2');
  const [budgetRange, setBudgetRange] = useState('5 000 000 - 10 000 000 MAD');
  const [expectedStartDate, setExpectedStartDate] = useState('Dans les 3 à 6 mois');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // FAQs open state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.quotes.submit({
        fullName,
        email,
        phone,
        city,
        projectType,
        plotSize: plotSize ? parseFloat(plotSize) : undefined,
        estimatedArea: estimatedArea ? parseFloat(estimatedArea) : undefined,
        numberOfFloors: numberOfFloors ? parseInt(numberOfFloors, 10) : undefined,
        budgetRange,
        expectedStartDate,
        description,
      });
      setQuoteSubmitted(true);
    } catch (e) {
      alert('Une erreur est survenue lors de la soumission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const constructionSteps = [
    { title: t('construction.step1'), desc: t('construction.step1Desc') },
    { title: t('construction.step2'), desc: t('construction.step2Desc') },
    { title: t('construction.step3'), desc: t('construction.step3Desc') },
    { title: t('construction.step4'), desc: t('construction.step4Desc') },
    { title: t('construction.step5'), desc: t('construction.step5Desc') },
    { title: t('construction.step6'), desc: t('construction.step6Desc') },
  ];

  const faqs = [
    {
      q: 'Quels sont les délais moyens pour construire une villa de 600 m² au Maroc ?',
      a: 'Pour une villa contemporaine de haut standing d’environ 600 m² couverts avec piscine et finitions soignées, le délai moyen de gros œuvre et second œuvre est de 12 à 15 mois à compter de l’obtention du permis de construire.',
    },
    {
      q: 'Quelles garanties offrez-vous sur vos chantiers ?',
      a: 'Toutes nos constructions sont couvertes par une garantie décennale légale (assurance dommages-ouvrage), une garantie de parfait achèvement d’un an, et bénéficient de la validation systématique d’un bureau de contrôle agréé (Socotec, Veritas ou LPEE).',
    },
    {
      q: 'Pouvez-vous intervenir si j’ai déjà un terrain et un architecte ?',
      a: 'Absolument. Nous intervenons en qualité d’entreprise générale ou de contractant général, en étroite collaboration avec votre architecte concepteur, pour chiffrer et exécuter fidèlement son projet.',
    },
    {
      q: 'Comment s’organise le suivi financier et l’échelonnement des paiements ?',
      a: 'Les règlements sont strictement adossés à des situations de travaux certifiées par l’ingénieur conseil (fondations, élévation, étanchéité, finitions), sans avance non couverte, avec un compte séquestre transparent.',
    },
  ];

  return (
    <div className="bg-ivory-100 pb-20">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 bg-charcoal text-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            src="https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=2000&q=85"
            alt="Chantier de villa contemporaine au Maroc"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/20 text-bronze border border-bronze/30 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>{t('construction.heroBadge')}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif text-ivory mb-6 leading-tight"
          >
            {t('construction.heroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base text-ivory/80 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            {t('construction.heroDesc')}
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="#devis-section"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-luxury cursor-pointer"
          >
            <span>Estimer mon projet de construction</span>
          </motion.a>
        </div>
      </section>

      {/* Services Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <RevealOnScroll direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
              Nos Métiers de Construction
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal">
              Solutions Bâtiment Haut de Gamme
            </h2>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-luxury border border-beige/40 shadow-sm h-full"
            >
              <div className="w-12 h-12 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center mb-6">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-charcoal mb-3">Villas Contemporaines Neuves</h3>
              <p className="text-xs text-mutedgray leading-relaxed mb-4">
                Réalisation intégrale de villas de maîtres. Gestion des terrassements spéciaux, voiles en béton blanc, structures métalliques et baies vitrées de 4 mètres sans poteaux.
              </p>
              <ul className="space-y-2 text-xs text-charcoal/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-bronze" /> Piscines à débordement suspendues</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-bronze" /> Domotique et climatisation gainée</li>
              </ul>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-luxury border border-beige/40 shadow-sm h-full"
            >
              <div className="w-12 h-12 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center mb-6">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-charcoal mb-3">Immeubles &amp; Résidences</h3>
              <p className="text-xs text-mutedgray leading-relaxed mb-4">
                Construction d’immeubles résidentiels R+4 ou R+5 et ensembles hôteliers de caractère. Respect intransigeant des cahiers des charges promoteurs et des ratios budgétaires.
              </p>
              <ul className="space-y-2 text-xs text-charcoal/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-bronze" /> Parkings souterrains et cuvelages étanches</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-bronze" /> Façades ventilées en pierre et travertin</li>
              </ul>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-luxury border border-beige/40 shadow-sm h-full"
            >
              <div className="w-12 h-12 rounded-lg bg-bronze/10 text-bronze flex items-center justify-center mb-6">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-charcoal mb-3">Rénovation Lourde &amp; Riads</h3>
              <p className="text-xs text-mutedgray leading-relaxed mb-4">
                Réhabilitation structurelle et modernisation de propriétés d’époque, riads historiques de la médina de Marrakech ou demeures art déco à Casablanca.
              </p>
              <ul className="space-y-2 text-xs text-charcoal/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-bronze" /> Confortement parasismique en sous-œuvre</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-bronze" /> Restauration des zelliges et plâtres sculptés</li>
              </ul>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 6-Step Process */}
      <section className="py-20 bg-charcoal text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <RevealOnScroll direction="up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                Notre Démarche Méthodique
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-ivory">
                Les 6 Jalons d'une Réalisation Sans Faille
              </h2>
            </div>
          </RevealOnScroll>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {constructionSteps.map((step, idx) => (
              <StaggerItem key={idx}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-luxury bg-charcoal-800 border border-charcoal-700 hover:border-bronze/50 transition-colors h-full"
                >
                  <div className="w-10 h-10 rounded-full bg-bronze/20 text-bronze flex items-center justify-center font-serif text-base font-bold mb-4">
                    0{idx + 1}
                  </div>
                  <h4 className="font-serif text-lg text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-ivory/70 leading-relaxed">{step.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Standards & Technical Certifications */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <RevealOnScroll direction="up">
          <div className="bg-white rounded-luxury p-8 sm:p-12 border border-beige/40 shadow-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
                  Excellence &amp; Sécurité
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-charcoal mb-4">
                  Normes Européennes &amp; Réglementation Marocaine
                </h3>
                <p className="text-xs sm:text-sm text-mutedgray leading-relaxed mb-6">
                  Chaque étape d’élévation est rigoureusement auditée. Nous nous appuyons sur les normes marocaines (NM) et européennes (Eurocodes) pour garantir une durabilité séculaire à votre patrimoine.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-ivory-50 rounded border border-beige/40">
                    <FileCheck className="w-4 h-4 text-bronze mb-1" />
                    <span className="font-bold text-charcoal block">RPS 2011</span>
                    <span className="text-mutedgray">Règlement Parasismique</span>
                  </div>
                  <div className="p-3 bg-ivory-50 rounded border border-beige/40">
                    <Shield className="w-4 h-4 text-bronze mb-1" />
                    <span className="font-bold text-charcoal block">Garantie 10 Ans</span>
                    <span className="text-mutedgray">Assurance Décennale</span>
                  </div>
                  <div className="p-3 bg-ivory-50 rounded border border-beige/40">
                    <Layers className="w-4 h-4 text-bronze mb-1" />
                    <span className="font-bold text-charcoal block">Béton B25 / B30</span>
                    <span className="text-mutedgray">Contrôlé en laboratoire</span>
                  </div>
                  <div className="p-3 bg-ivory-50 rounded border border-beige/40">
                    <Award className="w-4 h-4 text-bronze mb-1" />
                    <span className="font-bold text-charcoal block">RTCM 2020</span>
                    <span className="text-mutedgray">Thermique du Bâtiment</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="aspect-[16/10] rounded-lg overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
                    alt="Supervision chantier et ingénierie"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* FAQ Accordions with AnimatePresence */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-8">
        <RevealOnScroll direction="up">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
              Questions Fréquentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal">
              Tout Ce Que Vous Devez Savoir Avant de Bâtir
            </h2>
          </div>
        </RevealOnScroll>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-md border border-beige/50 overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-charcoal cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-bronze transition-transform duration-300 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 text-xs text-mutedgray leading-relaxed border-t border-ivory-200">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED QUOTATION REQUEST FORM */}
      <section id="devis-section" className="py-20 max-w-4xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-luxury p-8 sm:p-12 border border-beige/40 shadow-luxury">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
              {t('quote.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal mb-3">
              {t('quote.title')}
            </h2>
            <p className="text-xs text-mutedgray leading-relaxed">
              {t('quote.subtitle')}
            </p>
          </div>

          {quoteSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center text-emerald-900">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold mb-2">{t('quote.successTitle')}</h3>
              <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6">
                {t('quote.successMessage')}
              </p>
              <button
                onClick={() => setQuoteSubmitted(false)}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold uppercase tracking-wider"
              >
                Nouvelle demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Row 1: Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('quote.fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="M. Yassine..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('quote.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@exemple.ma"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('quote.phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+212 6 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Project type & city */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('quote.projectType')} *
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  >
                    <option value="VILLA_CONSTRUCTION">{t('quote.villaConst')}</option>
                    <option value="APARTMENT_BUILDING">{t('quote.buildingConst')}</option>
                    <option value="RENOVATION">{t('quote.renovation')}</option>
                    <option value="INTERIOR_DESIGN">{t('quote.interiorDesign')}</option>
                    <option value="LANDSCAPING">{t('quote.landscaping')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('quote.city')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Casablanca (Bouskoura, Anfa), Marrakech..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('quote.plotSize')}
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 1000"
                    value={plotSize}
                    onChange={(e) => setPlotSize(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('quote.estimatedArea')}
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 550"
                    value={estimatedArea}
                    onChange={(e) => setEstimatedArea(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('quote.floors')}
                  </label>
                  <select
                    value={numberOfFloors}
                    onChange={(e) => setNumberOfFloors(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  >
                    <option value="1">Plain-pied (Rez-de-chaussée)</option>
                    <option value="2">R+1 (Rez-de-chaussée + 1 étage)</option>
                    <option value="3">Sous-sol + R+1</option>
                    <option value="4">Sous-sol + R+2 ou plus</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Budget & Start Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('quote.budgetRange')}
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  >
                    <option value="Moins de 5 000 000 MAD">{t('quote.budget1')}</option>
                    <option value="5 000 000 - 10 000 000 MAD">{t('quote.budget2')}</option>
                    <option value="10 000 000 - 20 000 000 MAD">{t('quote.budget3')}</option>
                    <option value="Plus de 20 000 000 MAD">{t('quote.budget4')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('quote.startDate')}
                  </label>
                  <select
                    value={expectedStartDate}
                    onChange={(e) => setExpectedStartDate(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  >
                    <option value="Immédiat">{t('quote.immediate')}</option>
                    <option value="Dans les 3 à 6 mois">{t('quote.within6Months')}</option>
                    <option value="Projet pour l’année prochaine">{t('quote.nextYear')}</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Description */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  {t('quote.description')} *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Décrivez votre vision, style souhaité (minimaliste, contemporain, néo-marocain), présence d'une piscine, exigences techniques..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-bronze hover:bg-bronze-dark text-white rounded font-semibold uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? t('quote.submitting') : t('quote.submitBtn')}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
