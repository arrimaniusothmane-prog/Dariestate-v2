import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  UserCheck,
  Send,
  Building,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LocalStore } from '../../services/storage';
import { Inquiry, InquiryStatus, Priority } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const AdminLeadsPage: React.FC = () => {
  const { t } = useLanguage();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Selected lead for detail drawer/modal
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null);
  const [newNote, setNewNote] = useState('');

  const staffMembers = LocalStore.getUsers().filter((u) => u.role !== 'CLIENT');

  const loadInquiries = () => {
    setInquiries(LocalStore.getInquiries());
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = (id: string, status: InquiryStatus) => {
    const updated = LocalStore.updateInquiry(id, { status });
    if (selectedLead?.id === id) setSelectedLead(updated);
    loadInquiries();
  };

  const handlePriorityChange = (id: string, priority: Priority) => {
    const updated = LocalStore.updateInquiry(id, { priority });
    if (selectedLead?.id === id) setSelectedLead(updated);
    loadInquiries();
  };

  const handleAssignChange = (id: string, staffId: string) => {
    const staff = staffMembers.find((s) => s.id === staffId);
    const updated = LocalStore.updateInquiry(id, {
      assignedToId: staffId,
      assignedToName: staff ? staff.name : null,
    });
    if (selectedLead?.id === id) setSelectedLead(updated);
    loadInquiries();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;
    const updated = LocalStore.updateInquiry(selectedLead.id, {}, newNote.trim());
    setSelectedLead(updated);
    setNewNote('');
    loadInquiries();
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.phone.includes(search) ||
      inq.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || inq.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-charcoal">CRM &amp; Suivi des Prospects</h1>
          <p className="text-mutedgray mt-0.5">
            {inquiries.length} demandes de contact et visites acquéreurs
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-luxury border border-beige/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedgray" />
          <input
            type="text"
            placeholder="Rechercher par prospect, email, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-mutedgray font-medium">Statut :</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded border border-black/15 bg-white focus:border-bronze focus:outline-none"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="NEW">Nouveau (New)</option>
              <option value="CONTACTED">Contacté</option>
              <option value="QUALIFIED">Qualifié</option>
              <option value="VISIT_SCHEDULED">Visite planifiée</option>
              <option value="NEGOTIATION">Négociation</option>
              <option value="CONVERTED">Converti</option>
              <option value="LOST">Perdu</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-mutedgray font-medium">Priorité :</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="p-2 rounded border border-black/15 bg-white focus:border-bronze focus:outline-none"
            >
              <option value="ALL">Toutes</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">Élevée</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="LOW">Faible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-luxury border border-beige/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-100 border-b border-beige/40 text-mutedgray font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Objet &amp; Bien Associé</th>
                <th className="py-3.5 px-4">Priorité</th>
                <th className="py-3.5 px-4">Statut Pipeline</th>
                <th className="py-3.5 px-4">Assigné à</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-ivory-50 transition-colors">
                  {/* Contact info */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-charcoal">{inq.name}</p>
                    <p className="text-mutedgray text-[11px]">{inq.email}</p>
                    <p className="text-mutedgray text-[11px] font-mono">{inq.phone}</p>
                  </td>

                  {/* Subject & Property */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-medium text-charcoal truncate">{inq.subject}</p>
                    {inq.propertyTitle ? (
                      <span className="text-[11px] text-bronze-dark flex items-center gap-1 mt-0.5 truncate">
                        <Building className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{inq.propertyTitle}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-mutedgray">Contact direct site</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        inq.priority === 'URGENT'
                          ? 'danger'
                          : inq.priority === 'HIGH'
                          ? 'warning'
                          : 'beige'
                      }
                      size="sm"
                    >
                      {inq.priority}
                    </Badge>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                      className="text-[11px] font-bold py-1 px-2 rounded border border-black/15 bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="NEW">Nouveau</option>
                      <option value="CONTACTED">Contacté</option>
                      <option value="QUALIFIED">Qualifié</option>
                      <option value="VISIT_SCHEDULED">Visite planifiée</option>
                      <option value="NEGOTIATION">Négociation</option>
                      <option value="CONVERTED">Converti</option>
                      <option value="LOST">Perdu</option>
                    </select>
                  </td>

                  {/* Assigned to */}
                  <td className="py-3.5 px-4 text-mutedgray">
                    <select
                      value={inq.assignedToId || ''}
                      onChange={(e) => handleAssignChange(inq.id, e.target.value)}
                      className="text-[11px] py-1 px-2 rounded border border-black/15 bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="">Non assigné</option>
                      {staffMembers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-mutedgray text-[11px]">
                    {new Date(inq.createdAt).toLocaleDateString('fr-FR')}
                  </td>

                  {/* Details Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedLead(inq)}
                      className="px-3 py-1 bg-ivory-200 hover:bg-beige/40 text-charcoal font-semibold rounded transition-colors cursor-pointer"
                    >
                      Consulter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAD DETAIL MODAL */}
      {selectedLead && (
        <Modal
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          title={`Fiche Prospect : ${selectedLead.name}`}
          subtitle={`Demande enregistrée le ${new Date(selectedLead.createdAt).toLocaleString('fr-FR')}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs text-charcoal/90">
            {/* Contact info banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-ivory-50 rounded-lg border border-beige/40">
              <div>
                <span className="text-[10px] text-mutedgray uppercase font-semibold block">Téléphone</span>
                <span className="font-bold text-charcoal">{selectedLead.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-mutedgray uppercase font-semibold block">Email</span>
                <span className="font-bold text-charcoal">{selectedLead.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-mutedgray uppercase font-semibold block">Canal préféré</span>
                <span className="font-bold text-bronze">{selectedLead.preferredContactMethod}</span>
              </div>
            </div>

            {/* Message */}
            <div>
              <span className="text-[10px] text-mutedgray uppercase font-bold tracking-wider block mb-1">
                Message d'origine du prospect :
              </span>
              <div className="p-3 bg-white border border-black/10 rounded text-charcoal/80 leading-relaxed italic">
                "{selectedLead.message}"
              </div>
            </div>

            {/* Internal CRM Notes */}
            <div className="space-y-3 pt-2 border-t border-ivory-200">
              <span className="text-xs font-serif font-bold text-charcoal block">
                Notes Internes &amp; Historique des Échanges ({selectedLead.notes?.length || 0})
              </span>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ajouter une note interne confidentielle..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-grow p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-bronze hover:bg-bronze-dark text-white rounded font-semibold cursor-pointer"
                >
                  Ajouter
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map((n) => (
                    <div key={n.id} className="p-2.5 bg-ivory-50 rounded border border-beige/40 text-[11px]">
                      <div className="flex items-center justify-between text-mutedgray mb-1">
                        <strong className="text-charcoal">{n.authorName || 'Conseiller'}</strong>
                        <span>{new Date(n.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <p className="text-charcoal/90">{n.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-mutedgray italic text-[11px]">Aucune note interne pour le moment.</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
