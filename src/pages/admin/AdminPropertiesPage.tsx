import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LocalStore } from '../../services/storage';
import { Property, PropertyStatus } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const AdminPropertiesPage: React.FC = () => {
  const { t, formatPrice } = useLanguage();

  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  const loadProperties = () => {
    setProperties(LocalStore.getProperties());
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleStatusChange = (propertyId: string, nextStatus: PropertyStatus) => {
    LocalStore.updateProperty(propertyId, { status: nextStatus });
    loadProperties();
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      LocalStore.deleteProperty(deleteTarget.id);
      setDeleteTarget(null);
      loadProperties();
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-charcoal">Gestion des Biens Immobiliers</h1>
          <p className="text-xs text-mutedgray mt-0.5">
            {properties.length} propriétés répertoriées au catalogue
          </p>
        </div>

        <Link
          to="/admin/properties/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Bien</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-luxury border border-beige/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedgray" />
          <input
            type="text"
            placeholder="Rechercher par titre, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-mutedgray font-medium">Statut :</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 text-xs rounded border border-black/15 bg-white focus:border-bronze focus:outline-none"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="AVAILABLE">Disponible</option>
            <option value="UNDER_OFFER">Offre en cours</option>
            <option value="RESERVED">Réservé</option>
            <option value="SOLD">Vendu</option>
            <option value="RENTED">Loué</option>
            <option value="DRAFT">Brouillon</option>
          </select>
        </div>
      </div>

      {/* Properties Data Table */}
      <div className="bg-white rounded-luxury border border-beige/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ivory-100 border-b border-beige/40 text-mutedgray font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Bien &amp; Visuel</th>
                <th className="py-3.5 px-4">Typologie</th>
                <th className="py-3.5 px-4">Emplacement</th>
                <th className="py-3.5 px-4">Prix</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-ivory-50 transition-colors">
                  {/* Photo & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.coverImage}
                        alt={prop.title}
                        className="w-14 h-11 object-cover rounded border border-beige/40 flex-shrink-0"
                      />
                      <div className="max-w-xs truncate">
                        <Link
                          to={`/properties/${prop.slug}`}
                          target="_blank"
                          className="font-serif font-bold text-charcoal hover:text-bronze text-sm truncate block"
                        >
                          {prop.title}
                        </Link>
                        <span className="text-[10px] text-mutedgray">
                          {prop.bedrooms} ch. &bull; {prop.bathrooms} sdb &bull; {prop.surfaceArea} m²
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Typology */}
                  <td className="py-3 px-4">
                    <Badge variant="beige" size="sm">
                      {prop.type}
                    </Badge>
                    <span className="block text-[10px] text-mutedgray mt-0.5">
                      {prop.transactionType === 'BUY' ? 'Vente' : 'Location'}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-charcoal">{prop.city}</span>
                    <span className="block text-mutedgray text-[11px]">{prop.neighborhood}</span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-serif font-bold text-bronze-dark text-sm">
                    {formatPrice(prop.price, prop.currency)}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={prop.status}
                      onChange={(e) => handleStatusChange(prop.id, e.target.value as PropertyStatus)}
                      className={`text-[11px] font-bold py-1 px-2 rounded border focus:outline-none cursor-pointer ${
                        prop.status === 'AVAILABLE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : prop.status === 'UNDER_OFFER'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : prop.status === 'SOLD' || prop.status === 'RENTED'
                          ? 'bg-gray-100 text-gray-700 border-gray-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}
                    >
                      <option value="AVAILABLE">Disponible</option>
                      <option value="UNDER_OFFER">Offre en cours</option>
                      <option value="RESERVED">Réservé</option>
                      <option value="SOLD">Vendu</option>
                      <option value="RENTED">Loué</option>
                      <option value="DRAFT">Brouillon</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/properties/${prop.slug}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-ivory-200 text-mutedgray hover:text-charcoal"
                        title="Voir la page publique"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/admin/properties/${prop.id}/edit`}
                        className="p-1.5 rounded hover:bg-ivory-200 text-mutedgray hover:text-charcoal"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => setDeleteTarget(prop)}
                        className="p-1.5 rounded hover:bg-red-50 text-mutedgray hover:text-status-red cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
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
              <span>Cette action supprimera définitivement le bien du catalogue.</span>
            </div>
            <p>
              Êtes-vous sûr de vouloir supprimer <strong>"{deleteTarget.title}"</strong> ?
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-mutedgray hover:text-charcoal font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-status-red hover:bg-red-700 text-white rounded font-semibold cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
