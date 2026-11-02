import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { StaggerContainer, StaggerItem, RevealOnScroll } from '../../components/animations';
import { Property, FilterState } from '../../types';
import { api } from '../../services/api';

export const PropertiesPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);

  // State initialized from URL query params
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    transactionType: (searchParams.get('transactionType') as any) || 'ALL',
    type: searchParams.get('type') || 'ALL',
    city: searchParams.get('city') || 'ALL',
    neighborhood: searchParams.get('neighborhood') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 50000000,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : '',
    bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : '',
    minSurface: searchParams.get('minSurface') ? Number(searchParams.get('minSurface')) : '',
    sort: (searchParams.get('sort') as any) || 'newest',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load properties based on filters
  useEffect(() => {
    const fetchProps = async () => {
      setIsLoading(true);
      try {
        const data = await api.properties.getAll(filters);
        setProperties(data);
      } catch (e) {
        console.error('Failed to load properties:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProps();
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);

    // Sync to URL
    const nextParams = new URLSearchParams(searchParams);
    if (value && value !== 'ALL' && value !== 0) {
      nextParams.set(key, value.toString());
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    const resetState: FilterState = {
      search: '',
      transactionType: 'ALL',
      type: 'ALL',
      city: 'ALL',
      neighborhood: '',
      minPrice: 0,
      maxPrice: 50000000,
      bedrooms: '',
      bathrooms: '',
      minSurface: '',
      sort: 'newest',
    };
    setFilters(resetState);
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalItems = properties.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProps = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Editorial Header */}
      <RevealOnScroll direction="up">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-bronze mb-2 block">
            Catalogue Immobilier
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-charcoal mb-4">
            Demeures de Prestige &amp; Investissements d'Exception
          </h1>
          <p className="text-xs sm:text-sm text-mutedgray leading-relaxed">
            Explorez notre sélection exclusive de villas contemporaines, penthouses et propriétés d'architecte au Maroc. Chaque bien répond aux plus hauts critères d'excellence.
          </p>
        </div>
      </RevealOnScroll>

      {/* Main Filter & Search Bar */}
      <div className="bg-white rounded-luxury p-5 border border-beige/40 shadow-sm mb-8 space-y-4">
        {/* Top bar: Search input + View modes + Advanced toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search text */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedgray" />
            <input
              type="text"
              placeholder={t('nav.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-ivory-50 border border-black/15 rounded-md text-xs sm:text-sm text-charcoal placeholder:text-mutedgray/60 focus:outline-none focus:border-bronze transition-colors"
            />
          </div>

          {/* Quick Transaction buttons */}
          <div className="flex items-center gap-1 bg-ivory-100 p-1 rounded-md border border-beige/40 text-xs">
            <button
              onClick={() => handleFilterChange('transactionType', 'ALL')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-medium ${
                filters.transactionType === 'ALL'
                  ? 'bg-charcoal text-ivory font-bold shadow-xs'
                  : 'text-mutedgray hover:text-charcoal'
              }`}
            >
              {t('search.transactionAll')}
            </button>
            <button
              onClick={() => handleFilterChange('transactionType', 'BUY')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-medium ${
                filters.transactionType === 'BUY'
                  ? 'bg-charcoal text-ivory font-bold shadow-xs'
                  : 'text-mutedgray hover:text-charcoal'
              }`}
            >
              {t('search.buy')}
            </button>
            <button
              onClick={() => handleFilterChange('transactionType', 'RENT')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-medium ${
                filters.transactionType === 'RENT'
                  ? 'bg-charcoal text-ivory font-bold shadow-xs'
                  : 'text-mutedgray hover:text-charcoal'
              }`}
            >
              {t('search.rent')}
            </button>
          </div>

          {/* Filter toggle & View mode switch */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                filterDrawerOpen
                  ? 'bg-bronze text-white border-bronze'
                  : 'bg-white text-charcoal border-black/15 hover:border-bronze'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{filterDrawerOpen ? t('search.hideFilters') : t('search.advancedFilters')}</span>
            </motion.button>

            <div className="flex items-center border border-black/15 rounded bg-ivory-50 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-charcoal shadow-xs' : 'text-mutedgray'
                }`}
                title="Vue Grille"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white text-charcoal shadow-xs' : 'text-mutedgray'
                }`}
                title="Vue Liste"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Expandable Drawer with AnimatePresence */}
        <AnimatePresence>
          {filterDrawerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-ivory-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Property Type */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('search.propertyType')}
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full p-2 rounded border border-black/15 bg-white text-charcoal focus:border-bronze outline-none"
                  >
                    <option value="ALL">{t('search.allTypes')}</option>
                    <option value="VILLA">{t('search.villa')}</option>
                    <option value="APARTMENT">{t('search.apartment')}</option>
                    <option value="PENTHOUSE">{t('search.penthouse')}</option>
                    <option value="LAND">{t('search.land')}</option>
                    <option value="COMMERCIAL">{t('search.commercial')}</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('search.city')}
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full p-2 rounded border border-black/15 bg-white text-charcoal focus:border-bronze outline-none"
                  >
                    <option value="ALL">{t('search.allCities')}</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Tanger">Tanger</option>
                  </select>
                </div>

                {/* Min Bedrooms */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('search.bedrooms')} (Min)
                  </label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full p-2 rounded border border-black/15 bg-white text-charcoal focus:border-bronze outline-none"
                  >
                    <option value="">{t('search.anyBedrooms')}</option>
                    <option value="2">2+ chambres</option>
                    <option value="3">3+ chambres</option>
                    <option value="4">4+ chambres</option>
                    <option value="5">5+ chambres</option>
                  </select>
                </div>

                {/* Sort order */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    {t('search.sortBy')}
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full p-2 rounded border border-black/15 bg-white text-charcoal focus:border-bronze outline-none"
                  >
                    <option value="newest">{t('search.sortNewest')}</option>
                    <option value="priceAsc">{t('search.sortPriceAsc')}</option>
                    <option value="priceDesc">{t('search.sortPriceDesc')}</option>
                    <option value="surfaceDesc">{t('search.sortSurfaceDesc')}</option>
                  </select>
                </div>

                {/* Price budget input */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                    Budget maximum (MAD)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1000000"
                      max="50000000"
                      step="1000000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                      className="w-full accent-bronze cursor-pointer"
                    />
                    <span className="font-semibold text-charcoal whitespace-nowrap min-w-[120px] text-right">
                      {filters.maxPrice >= 50000000 ? 'Illimité' : `${(filters.maxPrice / 1000000).toFixed(0)} M MAD`}
                    </span>
                  </div>
                </div>

                {/* Clear filters button */}
                <div className="sm:col-span-2 flex items-end justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-xs text-mutedgray hover:text-bronze transition-colors py-2 cursor-pointer font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('search.clearFilters')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 text-xs text-mutedgray">
        <div>
          <span className="font-bold text-charcoal">{totalItems}</span> {t('search.resultsFound')}
        </div>
        <div className="flex items-center gap-2">
          <span>Page {currentPage} sur {totalPages}</span>
        </div>
      </div>

      {/* Property Cards Grid / List with Staggered Entrance */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-luxury h-80 animate-pulse border border-beige/40" />
          ))}
        </div>
      ) : paginatedProps.length > 0 ? (
        <StaggerContainer
          key={`${currentPage}-${viewMode}`}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'flex flex-col gap-6'
          }
        >
          {paginatedProps.map((prop) => (
            <StaggerItem key={prop.id}>
              <PropertyCard property={prop} viewMode={viewMode} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        /* Empty State */
        <RevealOnScroll direction="scale">
          <div className="bg-white rounded-luxury p-12 text-center border border-beige/40 my-8">
            <Building2 className="w-12 h-12 text-beige mx-auto mb-4" />
            <h3 className="font-serif text-xl text-charcoal mb-2">{t('search.noResults')}</h3>
            <p className="text-xs text-mutedgray max-w-md mx-auto mb-6">
              {t('search.noResultsDesc')}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
            >
              {t('search.clearFilters')}
            </button>
          </div>
        </RevealOnScroll>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded border border-beige bg-white text-charcoal hover:bg-ivory disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Page précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          {[...Array(totalPages)].map((_, i) => (
            <motion.button
              key={i + 1}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded text-xs font-bold transition-colors cursor-pointer ${
                currentPage === i + 1
                  ? 'bg-bronze text-white shadow-xs'
                  : 'bg-white text-charcoal border border-beige/60 hover:bg-ivory'
              }`}
            >
              {i + 1}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded border border-beige bg-white text-charcoal hover:bg-ivory disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Page suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}
    </div>
  );
};
