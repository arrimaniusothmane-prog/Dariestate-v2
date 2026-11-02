import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Building,
  Home,
  Hammer,
  Palette,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { RevealOnScroll } from '../../components/animations';
import { api } from '../../services/api';

export const RequestQuotePage: React.FC = () => {
  const { t, formatPrice } = useLanguage();

  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('VILLA_CONSTRUCTION');
  const [city, setCity] = useState('Casablanca');
  const [plotSize, setPlotSize] = useState('1000');
  const [estimatedArea, setEstimatedArea] = useState('600');
  const [numberOfFloors, setNumberOfFloors] = useState('2');
  const [budgetRange, setBudgetRange] = useState('5 000 000 - 10 000 000 MAD');
  const [expectedStartDate, setExpectedStartDate] = useState('Dans les 3 à 6 mois');
  const [description, setDescription] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Approximate cost estimation in MAD for real-time engagement
  const approxCostPerSqm = projectType === 'VILLA_CONSTRUCTION' ? 14000 : projectType === 'INTERIOR_DESIGN' ? 6500 : 9500;
  const estimatedCost = (parseFloat(estimatedArea) || 0) * approxCostPerSqm;

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
        plotSize: parseFloat(plotSize) || undefined,
        estimatedArea: parseFloat(estimatedArea) || undefined,
        numberOfFloors: parseInt(numberOfFloors, 10) || undefined,
        budgetRange,
        expectedStartDate,
        description: description || `Projet de ${projectType} à ${city}. Surface prévue : ${estimatedArea} m².`,
      });
      setIsComplete(true);
    } catch (e) {
      alert('Une erreur est survenue lors de l’envoi de votre demande de devis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    { key: 'VILLA_CONSTRUCTION', label: 'Villa Neuve d’Architecte', icon: Home, desc: 'Gros œuvre, second œuvre & piscine' },
    { key: 'APARTMENT_BUILDING', label: 'Immeuble / Résidence', icon: Building, desc: 'Bâtiment R+3 à R+5, promotion' },
    { key: 'RENOVATION', label: 'Rénovation & Surélévation', icon: Hammer, desc: 'Restructuration lourde et extension' },
    { key: 'INTERIOR_DESIGN', label: 'Architecture d’Intérieur', icon: Palette, desc: 'Aménagement, marbres et boiseries' },
  ];

  return (
    <div className="bg-ivory-100 min-h-screen py-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <RevealOnScroll direction="up">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 text-bronze border border-bronze/20 text-xs font-semibold uppercase tracking-wider mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulateur &amp; Devis Chiffré</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-3">
              Estimez Votre Projet d'Exception
            </h1>
            <p className="text-xs sm:text-sm text-mutedgray leading-relaxed">
              Configurez vos paramètres de construction ou d'aménagement pour obtenir une première estimation indicative et une proposition technique confidentielle sous 48h.
            </p>
          </div>
        </RevealOnScroll>

        {isComplete ? (
          <div className="bg-white rounded-luxury p-10 sm:p-14 border border-beige/40 shadow-luxury text-center text-charcoal animate-fade-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="font-serif text-3xl font-bold mb-2">Demande Transmise avec Succès</h2>
            <p className="text-xs sm:text-sm text-mutedgray max-w-lg mx-auto leading-relaxed mb-6">
              Merci, M./Mme {fullName}. Votre dossier d'estimation a été attribué à un ingénieur principal de notre direction des travaux. Vous recevrez un appel de qualification et une estimation chiffrée détaillée sous 48h.
            </p>

            <div className="p-6 bg-ivory-50 rounded-lg border border-beige/40 max-w-md mx-auto mb-8 text-left text-xs space-y-2">
              <p><span className="text-mutedgray">Projet :</span> <strong className="text-charcoal">{projectType.replace('_', ' ')}</strong></p>
              <p><span className="text-mutedgray">Localisation :</span> <strong className="text-charcoal">{city}</strong></p>
              <p><span className="text-mutedgray">Surface couverte :</span> <strong className="text-charcoal">{estimatedArea} m²</strong></p>
              <p><span className="text-mutedgray">Estimation indicative gros &amp; second œuvre :</span> <strong className="text-bronze-dark font-serif text-sm">{formatPrice(estimatedCost)}</strong></p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Retour à l’accueil</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-luxury p-8 sm:p-12 border border-beige/40 shadow-luxury space-y-8">
            {/* Step 1: Type selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
                1. Nature de Votre Projet
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projectTypes.map((pt) => {
                  const Icon = pt.icon;
                  const isSelected = projectType === pt.key;
                  return (
                    <motion.div
                      key={pt.key}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setProjectType(pt.key)}
                      className={`p-5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-bronze bg-bronze/5 shadow-xs'
                          : 'border-black/10 hover:border-bronze/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded ${isSelected ? 'bg-bronze text-white' : 'bg-ivory-200 text-charcoal'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-serif text-sm font-bold text-charcoal">{pt.label}</h4>
                      </div>
                      <p className="text-[11px] text-mutedgray leading-relaxed">{pt.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Location and Dimensions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
                2. Localisation &amp; Dimensions Prévisionnelles
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-mutedgray font-semibold mb-1">Ville du projet</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  >
                    <option value="Casablanca">Casablanca (Anfa, CFC, Bouskoura)</option>
                    <option value="Marrakech">Marrakech (Palmeraie, Amelkis)</option>
                    <option value="Rabat">Rabat (Souissi, Agdal)</option>
                    <option value="Tanger">Tanger (Malabata, Montagne)</option>
                    <option value="Autre région">Autre ville / région</option>
                  </select>
                </div>

                <div>
                  <label className="block text-mutedgray font-semibold mb-1">Surface Couverte (m²)</label>
                  <input
                    type="number"
                    min="50"
                    max="5000"
                    value={estimatedArea}
                    onChange={(e) => setEstimatedArea(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-mutedgray font-semibold mb-1">Terrain / Assiette (m²)</label>
                  <input
                    type="number"
                    placeholder="Ex: 1200"
                    value={plotSize}
                    onChange={(e) => setPlotSize(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  />
                </div>
              </div>

              {/* Real-time estimation box */}
              {estimatedCost > 0 && (
                <div className="mt-4 p-4 rounded bg-ivory-50 border border-beige/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-mutedgray block">Fourchette indicative travaux haut standing :</span>
                    <span className="font-bold text-charcoal">Prestations soignées (Gros œuvre, étanchéité, marbres &amp; finitions)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-serif font-bold text-bronze-dark">
                      ~ {formatPrice(estimatedCost)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Contact & Submit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
                3. Vos Coordonnées pour l'Étude Confidentielle
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
                <div>
                  <label className="block text-mutedgray font-semibold mb-1">Nom Complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="M. ou Mme..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-mutedgray font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="votre.email@domaine.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-mutedgray font-semibold mb-1">Téléphone *</label>
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

              <div>
                <label className="block text-xs text-mutedgray font-semibold mb-1">
                  Précisions particulières (style, terrain viabilisé ou non, souhaits d'architecte)
                </label>
                <textarea
                  rows={3}
                  placeholder="Décrivez votre vision..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 text-xs rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-4 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? 'Traitement de votre dossier...' : 'Transmettre pour Chiffrage Détaillé'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
