import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, BedDouble, Bath, Maximize2, ArrowUpRight } from 'lucide-react';
import { Property } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useFavorites } from '../../services/favoritesContext';
import { Badge } from './Badge';

export interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode = 'grid' }) => {
  const { t, formatPrice } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  const isList = viewMode === 'list';
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
  const statusLabels: Record<string, string> = {
    UNDER_OFFER: 'Offre en cours',
    RESERVED: 'Réservé',
    SOLD: 'Vendu',
    RENTED: 'Loué',
  };
  const statusLabel = statusLabels[property.status] || '';
  const isUnavailable = property.status === 'SOLD' || property.status === 'RENTED';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative bg-white rounded-luxury border border-beige/40 overflow-hidden transition-shadow duration-500 hover:shadow-luxury-hover hover:border-bronze/40 ${
        isList ? 'flex flex-col md:flex-row' : 'flex flex-col'
      }`}
    >
      {/* Image container */}
      <div
        className={`relative overflow-hidden bg-ivory-200 ${
          isList ? 'w-full md:w-2/5 aspect-[16/10] md:aspect-auto' : 'w-full aspect-[16/11]'
        }`}
      >
        <img
          src={property.coverImage}
          alt={property.title}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isUnavailable ? 'grayscale-[35%] opacity-90' : ''
          }`}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Badges Top Left */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2 z-10">
          <Badge variant="charcoal" size="sm">
            {property.transactionType === 'BUY' ? t('search.buy') : t('search.rent')}
          </Badge>
          {property.isFeatured && (
            <Badge variant="bronze" size="sm">
              {t('property.featured')}
            </Badge>
          )}
          {statusLabel && (
            <Badge variant={isUnavailable ? 'danger' : 'warning'} size="sm">
              {statusLabel}
            </Badge>
          )}
        </div>

        {/* Favorite Button Top Right */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property);
          }}
          className="absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-charcoal hover:bg-white hover:text-red-600 transition-colors shadow-sm cursor-pointer"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorite ? 'fill-red-600 text-red-600' : 'text-charcoal'
            }`}
          />
        </motion.button>

        {/* Price on Image Bottom Left */}
        <div className="absolute bottom-3.5 left-3.5 z-10 text-white">
          <div className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
            {formatPrice(property.price, property.currency)}
            {property.transactionType === 'RENT' && (
              <span className="text-xs font-sans font-normal opacity-85 ml-1">
                {t('property.perMonth')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-bronze-dark font-medium tracking-wide uppercase mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-bronze flex-shrink-0" />
            <span className="truncate">
              {property.neighborhood}, {property.city}
            </span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property.slug}`}>
            <h3 className="text-lg font-serif text-charcoal group-hover:text-bronze transition-colors line-clamp-1 mb-2">
              {property.title}
            </h3>
          </Link>

          {/* Description Snippet (list view only) */}
          {isList && (
            <p className="text-xs text-mutedgray line-clamp-2 mb-4 leading-relaxed">
              {property.description}
            </p>
          )}

          {/* Key Specs */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-ivory-200 text-xs text-charcoal/80 my-3">
            <div className="flex items-center gap-1.5" title="Chambres">
              <BedDouble className="w-4 h-4 text-mutedgray flex-shrink-0" />
              <span>
                {property.bedrooms} <span className="text-[11px] text-mutedgray">{t('property.bedrooms')}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5" title="Salles de bain">
              <Bath className="w-4 h-4 text-mutedgray flex-shrink-0" />
              <span>
                {property.bathrooms} <span className="text-[11px] text-mutedgray">{t('property.bathrooms')}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5" title="Surface couverte">
              <Maximize2 className="w-4 h-4 text-mutedgray flex-shrink-0" />
              <span>
                {property.surfaceArea} <span className="text-[11px] text-mutedgray">m²</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-mutedgray">
            {typeLabels[property.type] || property.type}
          </span>
          <Link
            to={`/properties/${property.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal group-hover:text-bronze transition-colors"
          >
            <span>{t('property.details')}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
