import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Copy,
  Send,
  EyeOff,
  BadgeCheck,
  KeyRound,
  AlertTriangle,
  Loader2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { Property, PropertyStatus } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

const PAGE_SIZE = 8;

const TYPE_LABELS: Record<string, string> = {
  VILLA: 'Villa',
  APARTMENT: 'Appartement',
  HOUSE: 'Maison',
  LAND: 'Terrain',
  DUPLEX: 'Duplex',
  PENTHOUSE: 'Penthouse',
  COMMERCIAL: 'Local commercial',
  OFFICE: 'Bureau',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  AVAILABLE: 'Disponible',
  UNDER_OFFER: 'Offre en cours',
  RESERVED: 'Réservé',
  SOLD: 'Vendu',
  RENTED: 'Loué',
};

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

export const AdminPropertiesPage: React.FC = () => {
  const { formatPrice } = useLanguage();

  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [transactionFilter, setTransactionFilter] = useState('ALL');
  const [publicationFilter, setPublicationFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadProperties = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.properties.getAllAdmin({ limit: 500 });
      setProperties(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les biens.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProperties();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter, transactionFilter, publicationFilter, cityFilter, sort]);

  const cities = useMemo(
    () => Array.from(new Set(properties.map((property) => property.city))).sort((a, b) => a.localeCompare(b)),
    [properties]
  );

  const filteredProperties = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = properties.filter((property) => {
      const matchesSearch =
        !term ||
        property.title.toLowerCase().includes(term) ||
        (property.reference || '').toLowerCase().includes(term) ||
        property.city.toLowerCase().includes(term) ||
        property.neighborhood.toLowerCase().includes(term) ||
        property.address.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'ALL' || property.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || property.type === typeFilter;
      const matchesTransaction = transactionFilter === 'ALL' || property.transactionType === transactionFilter;
      const matchesPublication =
        publicationFilter === 'ALL' ||
        (publicationFilter === 'PUBLISHED' && property.isPublished) ||
        (publicationFilter === 'UNPUBLISHED' && !property.isPublished);
      const matchesCity = cityFilter === 'ALL' || property.city === cityFilter;
      return matchesSearch && matchesStatus && matchesType && matchesTransaction && matchesPublication && matchesCity;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'titleAsc':
          return a.title.localeCompare(b.title);
        case 'referenceAsc':
          return (a.reference || '').localeCompare(b.reference || '');
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [properties, search, statusFilter, typeFilter, transactionFilter, publicationFilter, cityFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / PAGE_SIZE));
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const runAction = async (id: string, action: () => Promise<unknown>, success: string) => {
    setBusyId(id);
    setError('');
    try {
      await action();
      await loadProperties();
      flash(success);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action impossible.');
    } finally {
      setBusyId(null);
    }
  };

  const handleStatusChange = (property: Property, nextStatus: PropertyStatus) => {
    void runAction(
      property.id,
      () => api.properties.setStatus(property.id, nextStatus),
      `Le bien est maintenant « ${STATUS_LABELS[nextStatus]} ».`
    );
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    await runAction(target.id, () => api.properties.delete(target.id), `Le bien « ${target.title} » a été supprimé.`);
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setTransactionFilter('ALL');
    setPublicationFilter('ALL');
    setCityFilter('ALL');
    setSort('newest');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-charcoal">Gestion des Biens Immobiliers</h1>
          <p className="text-xs text-mutedgray mt-0.5">
            {properties.length} biens au catalogue · {properties.filter((property) => property.isPublished).length} publiés
          </p>
        </div>

        <Link
          to="/admin/properties/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un bien</span>
        </Link>
      </div>

      {error && (
        <div className="p-3 rounded border border-red-200 bg-red-50 text-red-800 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div className="p-3 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-start gap-2">
          <BadgeCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="bg-white p-4 rounded-luxury border border-beige/40 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedgray" />
            <input
              type="text"
              placeholder="Rechercher par titre, référence, ville, quartier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 flex-1">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
              <option value="ALL">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="AVAILABLE">Disponible</option>
              <option value="UNDER_OFFER">Offre en cours</option>
              <option value="RESERVED">Réservé</option>
              <option value="SOLD">Vendu</option>
              <option value="RENTED">Loué</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
              <option value="ALL">Toutes typologies</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)} className={selectClass}>
              <option value="ALL">Vente & location</option>
              <option value="BUY">Vente</option>
              <option value="RENT">Location</option>
            </select>
            <select value={publicationFilter} onChange={(e) => setPublicationFilter(e.target.value)} className={selectClass}>
              <option value="ALL">Toutes publications</option>
              <option value="PUBLISHED">Publiés</option>
              <option value="UNPUBLISHED">Non publiés</option>
            </select>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={selectClass}>
              <option value="ALL">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
              <option value="newest">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="priceAsc">Prix croissant</option>
              <option value="priceDesc">Prix décroissant</option>
              <option value="titleAsc">Titre A-Z</option>
              <option value="referenceAsc">Référence A-Z</option>
            </select>
          </div>

          <button type="button" onClick={resetFilters} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-mutedgray hover:text-bronze border border-black/10 rounded cursor-pointer whitespace-nowrap">
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="bg-white rounded-luxury border border-beige/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[1120px]">
            <thead>
              <tr className="bg-ivory-100 border-b border-beige/40 text-mutedgray font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Bien</th>
                <th className="py-3.5 px-4">Référence</th>
                <th className="py-3.5 px-4">Typologie</th>
                <th className="py-3.5 px-4">Ville</th>
                <th className="py-3.5 px-4">Prix</th>
                <th className="py-3.5 px-4">Transaction</th>
                <th className="py-3.5 px-4">Publication</th>
                <th className="py-3.5 px-4">Créé le</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-mutedgray">
                    <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2 text-bronze" />
                    Chargement des biens...
                  </td>
                </tr>
              ) : paginatedProperties.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-mutedgray">
                    <Building2 className="w-9 h-9 mx-auto mb-2 text-beige" />
                    Aucun bien ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                paginatedProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-ivory-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.coverImage}
                          alt={property.title}
                          className="w-14 h-11 object-cover rounded border border-beige/40 flex-shrink-0"
                        />
                        <div className="max-w-[250px]">
                          <Link
                            to={`/properties/${property.slug}?preview=1`}
                            target="_blank"
                            className="font-serif font-bold text-charcoal hover:text-bronze text-sm line-clamp-2"
                          >
                            {property.title}
                          </Link>
                          <span className="text-[10px] text-mutedgray">
                            {property.bedrooms} ch. · {property.bathrooms} sdb · {property.surfaceArea} m²
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-charcoal">{property.reference || '—'}</td>

                    <td className="py-3 px-4">
                      <Badge variant="beige" size="sm">{TYPE_LABELS[property.type] || property.type}</Badge>
                      <span className={`block text-[10px] mt-1 font-semibold ${
                        property.isFeatured ? 'text-bronze' : 'text-mutedgray'
                      }`}>
                        {property.isFeatured ? 'Signature' : 'Standard'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-charcoal">{property.city}</span>
                      <span className="block text-mutedgray text-[11px]">{property.neighborhood}</span>
                    </td>

                    <td className="py-3 px-4 font-serif font-bold text-bronze-dark text-sm whitespace-nowrap">
                      {formatPrice(property.price, property.currency)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-charcoal">
                        {property.transactionType === 'BUY' ? 'Vente' : 'Location'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                          property.isPublished
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {property.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {property.isPublished ? 'Publié' : 'Non publié'}
                        </span>
                        <span className={`text-[10px] font-semibold ${
                          property.status === 'AVAILABLE' ? 'text-emerald-700'
                            : property.status === 'SOLD' || property.status === 'RENTED' ? 'text-gray-600'
                            : property.status === 'UNDER_OFFER' || property.status === 'RESERVED' ? 'text-amber-700'
                            : 'text-red-700'
                        }`}>
                          {STATUS_LABELS[property.status] || property.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-mutedgray whitespace-nowrap">{formatDate(property.createdAt)}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/properties/${property.slug}?preview=1`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-ivory-200 text-mutedgray hover:text-charcoal"
                          title="Voir la page publique"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/properties/${property.id}/edit`}
                          className="p-1.5 rounded hover:bg-ivory-200 text-mutedgray hover:text-charcoal"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={busyId === property.id}
                          onClick={() => void runAction(property.id, () => api.properties.duplicate(property.id), 'Le bien a été dupliqué en brouillon.')}
                          className="p-1.5 rounded hover:bg-ivory-200 text-mutedgray hover:text-charcoal disabled:opacity-40 cursor-pointer"
                          title="Dupliquer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {property.isPublished ? (
                          <button
                            type="button"
                            disabled={busyId === property.id}
                            onClick={() => void runAction(property.id, () => api.properties.unpublish(property.id), 'Le bien a été retiré du site public.')}
                            className="p-1.5 rounded hover:bg-amber-50 text-mutedgray hover:text-amber-700 disabled:opacity-40 cursor-pointer"
                            title="Dépublier"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busyId === property.id}
                            onClick={() => void runAction(property.id, () => api.properties.publish(property.id), 'Le bien est maintenant publié.')}
                            className="p-1.5 rounded hover:bg-emerald-50 text-mutedgray hover:text-emerald-700 disabled:opacity-40 cursor-pointer"
                            title="Publier"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busyId === property.id}
                          onClick={() => handleStatusChange(property, 'SOLD')}
                          className="p-1.5 rounded hover:bg-gray-100 text-mutedgray hover:text-charcoal disabled:opacity-40 cursor-pointer"
                          title="Marquer comme vendu"
                        >
                          <BadgeCheck className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={busyId === property.id}
                          onClick={() => handleStatusChange(property, 'RENTED')}
                          className="p-1.5 rounded hover:bg-blue-50 text-mutedgray hover:text-blue-700 disabled:opacity-40 cursor-pointer"
                          title="Marquer comme loué"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(property)}
                          className="p-1.5 rounded hover:bg-red-50 text-mutedgray hover:text-status-red cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-ivory-200 px-4 py-3 text-[11px] text-mutedgray">
          <span>
            {filteredProperties.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredProperties.length)} sur {filteredProperties.length} bien(s)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-beige bg-white hover:bg-ivory disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {currentPage} / {totalPages}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-beige bg-white hover:bg-ivory disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Confirmation de suppression"
          maxWidth="sm"
        >
          <div className="text-xs text-charcoal/90 space-y-4">
            <div className="p-3 bg-red-50 text-red-800 rounded border border-red-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>Cette action supprimera définitivement le bien, ses photos et ses équipements.</span>
            </div>
            <p>
              Êtes-vous sûr de vouloir supprimer <strong>"{deleteTarget.title}"</strong> ?
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-mutedgray hover:text-charcoal font-semibold cursor-pointer">
                Annuler
              </button>
              <button type="button" onClick={() => { void confirmDelete(); }} className="px-4 py-2 bg-status-red hover:bg-red-700 text-white rounded font-semibold cursor-pointer">
                Confirmer la suppression
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const selectClass =
  'p-2 text-[11px] rounded border border-black/15 bg-white focus:border-bronze focus:outline-none';
