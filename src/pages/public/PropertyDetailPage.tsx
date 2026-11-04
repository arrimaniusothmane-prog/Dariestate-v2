import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  Share2,
  Heart,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  Layers,
  Car,
  Trees,
  Waves,
  Sofa,
  PlayCircle,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useFavorites } from '../../services/favoritesContext';
import { api } from '../../services/api';
import { Property } from '../../types';
import { buildPropertyGallery } from '../../services/imageLibrary';
import { TEAM_MEMBERS } from '../../services/team';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { RevealOnScroll, StaggerContainer, StaggerItem, ImageReveal } from '../../components/animations';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, formatPrice } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gallery modal
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Inquiries / Viewing modals
  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [viewingDate, setViewingDate] = useState('');
  const [viewingTime, setViewingTime] = useState('15:00');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Share link toast
  const [toastCopied, setToastCopied] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const prop = await api.properties.getBySlug(slug);
        if (prop) {
          setProperty(prop);
          const allProps = await api.properties.getAll();
          setSimilarProperties(
            allProps
              .filter(
                (p) =>
                  p.id !== prop.id &&
                  p.status !== 'SOLD' &&
                  p.status !== 'RENTED' &&
                  (p.city === prop.city || p.type === prop.type)
              )
              .slice(0, 3)
          );
        }
      } catch (e) {
        console.error('Error fetching property detail:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center">
        <div className="w-12 h-12 border-4 border-bronze border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs uppercase tracking-wider text-mutedgray">{t('common.loading')}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center">
        <h2 className="text-2xl font-serif text-charcoal mb-4">Propriété introuvable</h2>
        <Link to="/properties" className="text-xs font-bold uppercase tracking-wider text-bronze hover:underline">
          &larr; Retourner au catalogue
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(property.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastCopied(true);
    setTimeout(() => setToastCopied(false), 3000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.inquiries.submit({
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        propertyId: property.id,
        propertyTitle: property.title,
        propertySlug: property.slug,
        propertyCoverImage: property.coverImage,
        subject: `Demande pour ${property.title}`,
        message: clientMessage || 'Bonjour, je souhaiterais des informations complémentaires sur cette propriété.',
        preferredContactMethod: 'PHONE',
      });
      setSubmitSuccess(true);
      setClientMessage('');
    } catch (e) {
      alert('Une erreur est survenue lors de l’envoi de votre demande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.inquiries.submit({
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        propertyId: property.id,
        propertyTitle: property.title,
        propertySlug: property.slug,
        propertyCoverImage: property.coverImage,
        subject: `Visite privée planifiée : ${viewingDate} à ${viewingTime}`,
        message: `Souhait de visite pour le ${viewingDate} vers ${viewingTime}. Note: ${clientMessage}`,
        preferredContactMethod: 'PHONE',
      });
      setViewingModalOpen(false);
      setSubmitSuccess(true);
    } catch (e) {
      alert('Une erreur est survenue lors de l’envoi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const galleryImages = buildPropertyGallery(property.images || [], property.title);
  const advisor = TEAM_MEMBERS.find((member) => member.shortRole === 'Immobilier') || TEAM_MEMBERS[0];
  const phoneHref = `tel:${advisor.phone.replace(/\s/g, '')}`;

  const statusLabels: Record<string, string> = {
    DRAFT: 'Brouillon',
    AVAILABLE: 'Disponible',
    UNDER_OFFER: 'Offre en cours',
    RESERVED: 'Réservé',
    SOLD: 'Vendu',
    RENTED: 'Loué',
  };
  const conditionLabels: Record<string, string> = {
    NEW: 'Neuf',
    EXCELLENT: 'Excellent état',
    GOOD: 'Bon état',
    TO_RENOVATE: 'À rénover',
  };
  const typeLabels: Record<string, string> = {
    VILLA: 'Villa',
    APARTMENT: 'Appartement',
    HOUSE: 'Maison',
    LAND: 'Terrain',
    DUPLEX: 'Duplex',
    PENTHOUSE: 'Penthouse',
    COMMERCIAL: 'Local commercial',
    OFFICE: 'Bureau',
  };
  const statusLabel = statusLabels[property.status] || property.status;
  const isUnavailable = property.status === 'SOLD' || property.status === 'RENTED';
  const isUnderOffer = property.status === 'UNDER_OFFER' || property.status === 'RESERVED';

  const amenityNames = [
    ...property.features.map((feature) => feature.name),
    ...(property.garage ? ['Garage / Parking'] : []),
    ...(property.garden ? ['Jardin privatif'] : []),
    ...(property.swimmingPool ? ['Piscine'] : []),
    ...(property.terrace ? ['Terrasse'] : []),
    ...(property.furnished ? ['Meublé'] : []),
    ...((property.floors || 0) > 0 ? [`${property.floors} niveau(x)`] : []),
  ].filter((name, index, list) => list.indexOf(name) === index);

  const hasCoordinates =
    typeof property.latitude === 'number' &&
    typeof property.longitude === 'number' &&
    Number.isFinite(property.latitude) &&
    Number.isFinite(property.longitude);
  const mapDelta = 0.008;
  const mapSrc = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude! - mapDelta}%2C${
        property.latitude! - mapDelta
      }%2C${property.longitude! + mapDelta}%2C${property.latitude! + mapDelta}&layer=mapnik&marker=${
        property.latitude
      }%2C${property.longitude}`
    : null;

  return (
    <div className="bg-ivory-100 min-h-screen py-10 sm:py-14 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-6 text-xs text-mutedgray">
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 hover:text-charcoal transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux propriétés</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-beige/60 hover:bg-beige/20 text-charcoal text-xs transition-colors cursor-pointer"
              title="Copier le lien"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('property.shareProperty')}</span>
            </button>

            <button
              onClick={() => toggleFavorite(property)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
                favorite
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-white text-charcoal border-beige/60 hover:bg-beige/20'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-red-600' : ''}`} />
              <span>{favorite ? 'Favori' : 'Sauvegarder'}</span>
            </button>
          </div>
        </div>

        {/* Title and Top Location */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="charcoal">
              {property.transactionType === 'BUY' ? t('search.buy') : t('search.rent')}
            </Badge>
            <Badge variant="bronze">{typeLabels[property.type] || property.type}</Badge>
            {property.isFeatured && <Badge variant="outline">Signature Exclusive</Badge>}
            <Badge variant={isUnavailable ? 'danger' : isUnderOffer ? 'warning' : 'success'}>
              {statusLabel}
            </Badge>
            {property.reference && (
              <span className="text-[10px] font-mono text-mutedgray px-2 py-1 rounded bg-white border border-beige/50">
                Réf. {property.reference}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif text-charcoal mb-2">
            {property.title}
          </h1>
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-bronze-dark font-medium uppercase tracking-wide">
            <MapPin className="w-4 h-4 text-bronze" />
            <span>
              {property.address}, {property.neighborhood}, {property.city}
            </span>
          </p>
        </div>

        {/* IMAGE GALLERY MOSAIC */}
        <StaggerContainer className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-3 rounded-luxury overflow-hidden border border-beige/40 bg-white p-2 shadow-luxury">
          {/* Main Cover (Span 2 cols, 2 rows) */}
          <StaggerItem className="md:col-span-2 md:row-span-2">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
              onClick={() => {
                setActiveImageIndex(0);
                setLightboxOpen(true);
              }}
              className="relative aspect-[16/11] md:aspect-auto md:h-full overflow-hidden rounded-md cursor-pointer group bg-ivory-200"
            >
              <img
                src={galleryImages[0]?.url || property.coverImage}
                alt={property.title}
                className={`w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ${
                  isUnavailable ? 'grayscale-[30%]' : ''
                }`}
              />
              {isUnavailable && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="danger" size="sm">{statusLabel}</Badge>
                </div>
              )}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
                Agrandir la photo
              </div>
            </motion.div>
          </StaggerItem>

          {/* Secondary images */}
          {galleryImages.slice(1, 5).map((img, idx) => (
            <StaggerItem key={img.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setActiveImageIndex(idx + 1);
                  setLightboxOpen(true);
                }}
                className="relative aspect-[4/3] overflow-hidden rounded-md cursor-pointer group bg-ivory-200"
              >
                <img
                  src={img.url}
                  alt={img.alt || property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
                  Photo {idx + 2}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Main Content & Sticky Inquiry Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details, Specifications, Description, Amenities */}
          <div className="lg:col-span-8 space-y-10">
            {/* Key Specifications Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-luxury border border-beige/40 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div className="border-r border-ivory-200 last:border-r-0">
                <span className="text-[11px] uppercase tracking-wider text-mutedgray block mb-1">
                  Prix
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-bronze-dark block">
                  {formatPrice(property.price, property.currency)}
                </span>
                {property.transactionType === 'RENT' && (
                  <span className="text-[10px] text-mutedgray">{t('property.perMonth')}</span>
                )}
              </div>

              <div className="border-r border-ivory-200 last:border-r-0">
                <span className="text-[11px] uppercase tracking-wider text-mutedgray block mb-1">
                  Chambres
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-charcoal block">
                  {property.bedrooms}
                </span>
                <span className="text-[10px] text-mutedgray">Suites de maître</span>
              </div>

              <div className="border-r border-ivory-200 last:border-r-0">
                <span className="text-[11px] uppercase tracking-wider text-mutedgray block mb-1">
                  Salles de bain
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-charcoal block">
                  {property.bathrooms}
                </span>
                <span className="text-[10px] text-mutedgray">Spas &amp; Douches</span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-mutedgray block mb-1">
                  Surface couverte
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-charcoal block">
                  {property.surfaceArea} m²
                </span>
                <span className="text-[10px] text-mutedgray">Superficie nette</span>
              </div>
            </div>

            {(property.landArea || property.floors || property.constructionYear || property.condition) && (
              <div className="bg-white p-4 sm:p-5 rounded-luxury border border-beige/40 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                {property.landArea ? (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-mutedgray block">Terrain</span>
                    <span className="font-serif font-bold text-charcoal text-base">{property.landArea} m²</span>
                  </div>
                ) : null}
                {property.floors ? (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-mutedgray block">Niveaux</span>
                    <span className="font-serif font-bold text-charcoal text-base">{property.floors}</span>
                  </div>
                ) : null}
                {property.constructionYear ? (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-mutedgray block">Construction</span>
                    <span className="font-serif font-bold text-charcoal text-base">{property.constructionYear}</span>
                  </div>
                ) : null}
                {property.condition ? (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-mutedgray block">État</span>
                    <span className="font-serif font-bold text-charcoal text-base">
                      {conditionLabels[property.condition] || property.condition}
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Architectural Description */}
            <div className="bg-white p-6 sm:p-8 rounded-luxury border border-beige/40 shadow-sm">
              <h2 className="text-xl font-serif text-charcoal mb-4">
                {t('property.description')}
              </h2>
              <div className="text-xs sm:text-sm text-charcoal/80 leading-relaxed space-y-4">
                <p className="whitespace-pre-line">{property.description}</p>
              </div>
            </div>

            {/* Features & Amenities Checklist */}
            <div className="bg-white p-6 sm:p-8 rounded-luxury border border-beige/40 shadow-sm">
              <h2 className="text-xl font-serif text-charcoal mb-6">
                {t('property.amenities')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenityNames.map((name) => (
                  <div key={name} className="flex items-center gap-3 text-xs sm:text-sm text-charcoal/90">
                    <CheckCircle2 className="w-4 h-4 text-bronze flex-shrink-0" />
                    <span>{name}</span>
                  </div>
                ))}
                {amenityNames.length === 0 && (
                  <p className="text-mutedgray italic">Les équipements détaillés seront communiqués lors de votre visite.</p>
                )}
              </div>
            </div>

            {/* Energy & Technical Ratings */}
            <div className="bg-white p-6 sm:p-8 rounded-luxury border border-beige/40 shadow-sm">
              <h2 className="text-xl font-serif text-charcoal mb-4">
                Caractéristiques &amp; Diagnostic Technique
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div className="p-4 bg-ivory-50 rounded border border-ivory-200">
                  <span className="text-mutedgray block mb-1">Classe Énergétique</span>
                  <span className="text-lg font-bold text-emerald-800">
                    {property.energyRating || 'Non communiquée'}
                  </span>
                </div>
                <div className="p-4 bg-ivory-50 rounded border border-ivory-200">
                  <span className="text-mutedgray block mb-1">Année de construction</span>
                  <span className="text-lg font-bold text-charcoal">
                    {property.constructionYear || property.yearBuilt || 'Non communiquée'}
                  </span>
                </div>
                <div className="p-4 bg-ivory-50 rounded border border-ivory-200">
                  <span className="text-mutedgray block mb-1">État du bien</span>
                  <span className="text-lg font-bold text-charcoal">
                    {conditionLabels[property.condition || 'NEW'] || property.condition || 'Non communiqué'}
                  </span>
                </div>
                <div className="p-4 bg-ivory-50 rounded border border-ivory-200">
                  <span className="text-mutedgray block mb-1">Disponibilité</span>
                  <span className={`text-lg font-bold ${
                    isUnavailable ? 'text-gray-700' : isUnderOffer ? 'text-amber-700' : 'text-emerald-800'
                  }`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Video tour */}
            {property.videoUrl && (
              <div className="bg-white p-6 sm:p-8 rounded-luxury border border-beige/40 shadow-sm">
                <h2 className="text-xl font-serif text-charcoal mb-4 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-bronze" />
                  Visite en vidéo
                </h2>
                <video
                  src={property.videoUrl}
                  poster={property.coverImage}
                  controls
                  className="w-full max-h-[520px] rounded-lg bg-charcoal"
                />
              </div>
            )}

            {/* Location map */}
            {mapSrc && (
              <div className="bg-white p-6 sm:p-8 rounded-luxury border border-beige/40 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-serif text-charcoal">Emplacement</h2>
                    <p className="text-xs text-mutedgray mt-1">
                      {property.address}, {property.neighborhood}, {property.city}
                    </p>
                  </div>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${property.latitude}&mlon=${property.longitude}#map=16/${property.latitude}/${property.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-bronze hover:underline whitespace-nowrap"
                  >
                    Ouvrir la carte
                  </a>
                </div>
                <div className="rounded-lg overflow-hidden border border-beige/50 bg-ivory-100">
                  <iframe
                    title={`Carte de ${property.title}`}
                    src={mapSrc}
                    className="w-full h-72 sm:h-80"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Contact & Private Viewing Request */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-luxury border border-beige/40 shadow-luxury space-y-6">
              {/* Human advisor */}
              <div className="flex items-center gap-3 pb-5 border-b border-ivory-200">
                <img
                  src={advisor.photo}
                  alt={advisor.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-beige warm-photo"
                  loading="lazy"
                />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-clay mb-0.5">
                    Votre interlocuteur
                  </p>
                  <p className="font-serif text-base font-bold text-charcoal leading-tight">{advisor.name}</p>
                  <a href={phoneHref} className="text-xs text-charcoal/70 hover:text-clay transition-colors flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-clay" /> {advisor.phone}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-bronze block mb-1">
                  Conseil Privé &amp; Visite
                </span>
                <h3 className="text-xl font-serif text-charcoal">
                  Intéressé par ce bien ?
                </h3>
                <p className="text-xs text-mutedgray mt-1 leading-relaxed">
                  Nos directeurs associés sont à votre entière disposition pour une visite confidentielle ou une étude de financement.
                </p>
              </div>

              {isUnderOffer && (
                <div className="p-3 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs leading-relaxed">
                  Ce bien fait actuellement l’objet d’une offre ou d’une réservation. Vous pouvez
                  néanmoins nous contacter pour être informé en priorité en cas de désistement.
                </div>
              )}

              {isUnavailable ? (
                <div className="p-4 rounded bg-gray-50 text-gray-800 border border-gray-200 text-xs space-y-3">
                  <p className="font-bold">Ce bien n’est plus disponible.</p>
                  <p>
                    Il a été marqué comme <strong>{statusLabel.toLowerCase()}</strong>. Découvrez
                    nos biens similaires toujours disponibles ou confiez-nous votre recherche.
                  </p>
                  <Link
                    to="/properties"
                    className="inline-flex w-full items-center justify-center py-2.5 bg-charcoal hover:bg-charcoal-900 text-ivory rounded font-semibold uppercase tracking-wider"
                  >
                    Voir les biens disponibles
                  </Link>
                </div>
              ) : submitSuccess ? (
                <div className="p-4 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs">
                  <p className="font-bold mb-1">Demande transmise avec succès !</p>
                  <p>Un conseiller privé prendra contact avec vous dans les 2 heures ouvrées.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-mutedgray font-semibold mb-1">Votre Nom Complet *</label>
                    <input
                      type="text"
                      required
                      placeholder="M. ou Mme..."
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-mutedgray font-semibold mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="votre.email@domaine.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-mutedgray font-semibold mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+212 6 ..."
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-mutedgray font-semibold mb-1">Message ou questions</label>
                    <textarea
                      rows={3}
                      placeholder="Vos disponibilités ou précisions..."
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-bronze hover:bg-bronze-dark text-white rounded font-semibold uppercase tracking-wider text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'Transmission...' : t('property.contactAgent')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingModalOpen(true)}
                    className="w-full py-3 bg-charcoal hover:bg-charcoal-900 text-ivory rounded font-semibold uppercase tracking-wider text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-bronze" />
                    <span>{t('property.requestViewing')}</span>
                  </button>
                </form>
              )}

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-ivory-200 text-center">
                <a
                  href={`https://wa.me/${advisor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${advisor.name.split(' ')[0]}, je souhaite des informations sur « ${property.title} ».`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-sage-dark hover:text-sage"
                >
                  <MessageCircle className="w-4 h-4 text-sage" />
                  <span>WhatsApp avec {advisor.name.split(' ')[0]}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-20 pt-16 border-t border-beige/40">
            <RevealOnScroll direction="up">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-1 block">
                  Recommandations
                </span>
                <h3 className="text-2xl font-serif text-charcoal">
                  {t('property.similarProperties')}
                </h3>
              </div>
            </RevealOnScroll>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map((p) => (
                <StaggerItem key={p.id}>
                  <PropertyCard property={p} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL WITH ANIMATEPRESENCE */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/80 hover:text-white rounded-full bg-white/10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <div className="relative max-w-5xl max-h-[80vh] flex items-center justify-center overflow-hidden">
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                src={galleryImages[activeImageIndex]?.url}
                alt={galleryImages[activeImageIndex]?.alt || property.title}
                className="max-w-full max-h-[75vh] object-contain rounded shadow-2xl"
              />
            </div>

            <div className="mt-6 flex items-center gap-4 text-white text-xs">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setActiveImageIndex((i) => (i === 0 ? galleryImages.length - 1 : i - 1))
                }
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <span className="font-mono tracking-wider">
                {activeImageIndex + 1} / {galleryImages.length}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setActiveImageIndex((i) => (i === galleryImages.length - 1 ? 0 : i + 1))
                }
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REQUEST VIEWING MODAL */}
      <Modal
        isOpen={viewingModalOpen}
        onClose={() => setViewingModalOpen(false)}
        title="Planifier une Visite Confidentielle"
        subtitle={`Propriété : ${property.title}`}
      >
        <form onSubmit={handleViewingSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-mutedgray mb-1">Date souhaitée *</label>
              <input
                type="date"
                required
                value={viewingDate}
                onChange={(e) => setViewingDate(e.target.value)}
                className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 text-charcoal focus:border-bronze focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-mutedgray mb-1">Heure approximative</label>
              <select
                value={viewingTime}
                onChange={(e) => setViewingTime(e.target.value)}
                className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 text-charcoal focus:border-bronze focus:outline-none"
              >
                <option value="10:00">10:00 - Matin</option>
                <option value="12:00">12:00 - Midi</option>
                <option value="15:00">15:00 - Après-midi</option>
                <option value="17:30">17:30 - Fin d'après-midi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-mutedgray mb-1">Votre Nom Complet *</label>
            <input
              type="text"
              required
              placeholder="M. ou Mme..."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-mutedgray mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="votre.email@domaine.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-mutedgray mb-1">Téléphone *</label>
              <input
                type="tel"
                required
                placeholder="+212 6 ..."
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-mutedgray mb-1">Commentaires spécifiques</label>
            <textarea
              rows={3}
              placeholder="Accompagné d'un architecte, questions d'accès..."
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
              className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setViewingModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold uppercase text-mutedgray hover:text-charcoal cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Confirmer la demande de visite
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast notification copied with AnimatePresence */}
      <AnimatePresence>
        {toastCopied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 bg-charcoal text-ivory px-5 py-3 rounded-luxury shadow-luxury border border-beige/40 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t('property.copiedLink')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
