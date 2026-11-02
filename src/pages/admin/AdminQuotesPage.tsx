import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  Building,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LocalStore } from '../../services/storage';
import { QuoteRequest, QuoteStatus } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const AdminQuotesPage: React.FC = () => {
  const { t, formatPrice } = useLanguage();

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [proposedPrice, setProposedPrice] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [assignedStaff, setAssignedStaff] = useState<string>('');

  const staffMembers = LocalStore.getUsers().filter((u) => u.role !== 'CLIENT');

  const loadQuotes = () => {
    setQuotes(LocalStore.getQuotes());
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const openQuoteModal = (q: QuoteRequest) => {
    setSelectedQuote(q);
    setProposedPrice(q.proposedPrice ? q.proposedPrice.toString() : '');
    setInternalNotes(q.internalNotes || '');
    setAssignedStaff(q.assignedToId || '');
  };

  const handleStatusChange = (id: string, status: QuoteStatus) => {
    const updated = LocalStore.updateQuote(id, { status });
    if (selectedQuote?.id === id) setSelectedQuote(updated);
    loadQuotes();
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;
    const staff = staffMembers.find((s) => s.id === assignedStaff);
    const updated = LocalStore.updateQuote(selectedQuote.id, {
      proposedPrice: proposedPrice ? parseFloat(proposedPrice) : undefined,
      internalNotes,
      assignedToId: assignedStaff || undefined,
      assignedToName: staff ? staff.name : undefined,
    });
    setSelectedQuote(null);
    loadQuotes();
  };

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.fullName.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase()) ||
      q.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-2xl font-serif text-charcoal">Demandes de Devis &amp; Études Chiffrées</h1>
        <p className="text-mutedgray mt-0.5">
          {quotes.length} dossiers d'estimation technique pour construction et aménagement
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-luxury border border-beige/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedgray" />
          <input
            type="text"
            placeholder="Rechercher par demandeur, email, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-mutedgray font-medium">Statut :</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded border border-black/15 bg-white focus:border-bronze focus:outline-none"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente (Pending)</option>
            <option value="UNDER_REVIEW">En cours d'étude</option>
            <option value="SITE_VISIT_REQUIRED">Visite terrain requise</option>
            <option value="QUOTE_PREPARED">Devis préparé</option>
            <option value="SENT_TO_CLIENT">Envoyé au client</option>
            <option value="ACCEPTED">Accepté</option>
            <option value="REJECTED">Refusé</option>
          </select>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-luxury border border-beige/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-100 border-b border-beige/40 text-mutedgray font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Demandeur</th>
                <th className="py-3.5 px-4">Type de Projet &amp; Ville</th>
                <th className="py-3.5 px-4">Surface / Niveaux</th>
                <th className="py-3.5 px-4">Budget Estimé</th>
                <th className="py-3.5 px-4">Offre Proposée</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-ivory-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-charcoal">{q.fullName}</p>
                    <p className="text-mutedgray text-[11px]">{q.email}</p>
                    <p className="text-mutedgray text-[11px] font-mono">{q.phone}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="charcoal" size="sm">
                      {q.projectType.replace('_', ' ')}
                    </Badge>
                    <span className="block text-mutedgray text-[11px] mt-1">{q.city}</span>
                  </td>

                  <td className="py-3.5 px-4 text-mutedgray">
                    <span>{q.estimatedArea ? `${q.estimatedArea} m² couverts` : 'Non précisé'}</span>
                    {q.plotSize && <span className="block text-[10px]">Terrain : {q.plotSize} m²</span>}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-charcoal">
                    {q.budgetRange || 'Non spécifié'}
                  </td>

                  <td className="py-3.5 px-4 font-serif font-bold text-bronze-dark">
                    {q.proposedPrice ? formatPrice(q.proposedPrice) : 'À chiffrer'}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={q.status}
                      onChange={(e) => handleStatusChange(q.id, e.target.value as QuoteStatus)}
                      className="text-[11px] font-bold py-1 px-2 rounded border border-black/15 bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="PENDING">En attente</option>
                      <option value="UNDER_REVIEW">À l'étude</option>
                      <option value="SITE_VISIT_REQUIRED">Visite terrain</option>
                      <option value="QUOTE_PREPARED">Devis prêt</option>
                      <option value="SENT_TO_CLIENT">Envoyé</option>
                      <option value="ACCEPTED">Accepté</option>
                      <option value="REJECTED">Refusé</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openQuoteModal(q)}
                      className="px-3 py-1 bg-ivory-200 hover:bg-beige/40 text-charcoal font-semibold rounded cursor-pointer"
                    >
                      Examiner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUOTE REVIEW & EDIT MODAL */}
      {selectedQuote && (
        <Modal
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={`Dossier de Devis : ${selectedQuote.fullName}`}
          subtitle={`Projet ${selectedQuote.projectType} à ${selectedQuote.city}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveModal} className="space-y-5 text-xs text-charcoal/90">
            {/* Specs banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-ivory-50 rounded border border-beige/40 text-center">
              <div>
                <span className="text-[10px] text-mutedgray uppercase block">Surface couverte</span>
                <strong className="text-charcoal text-sm">{selectedQuote.estimatedArea || '-'} m²</strong>
              </div>
              <div>
                <span className="text-[10px] text-mutedgray uppercase block">Terrain</span>
                <strong className="text-charcoal text-sm">{selectedQuote.plotSize || '-'} m²</strong>
              </div>
              <div>
                <span className="text-[10px] text-mutedgray uppercase block">Niveaux</span>
                <strong className="text-charcoal text-sm">{selectedQuote.numberOfFloors || '-'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-mutedgray uppercase block">Démarrage</span>
                <strong className="text-charcoal text-sm">{selectedQuote.expectedStartDate || '-'}</strong>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="text-[10px] uppercase font-bold text-mutedgray tracking-wider block mb-1">
                Description du demandeur :
              </span>
              <div className="p-3 bg-white border border-black/10 rounded leading-relaxed italic">
                "{selectedQuote.description}"
              </div>
            </div>

            {/* Inputs for Proposed Price & Staff Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Montant Chiffré Proposé (MAD)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 12500000"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Responsable du Chiffrage
                </label>
                <select
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value)}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                >
                  <option value="">Sélectionner un ingénieur/directeur</option>
                  {staffMembers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                Notes Internes &amp; Spécifications de Chantier
              </label>
              <textarea
                rows={3}
                placeholder="Rapports géotechniques, contraintes urbanistiques, dates de rendez-vous..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-ivory-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 font-semibold text-mutedgray hover:text-charcoal cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-bronze hover:bg-bronze-dark text-white rounded font-semibold uppercase tracking-wider cursor-pointer"
              >
                Enregistrer le Devis
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
