import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { ConstructionProject, ConstructionStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  HardHat, Plus, Search, Calendar, MapPin, CheckCircle2, 
  Clock, DollarSign, Edit3, Trash2, ChevronRight, Layers
} from 'lucide-react';

export const AdminConstructionPage: React.FC = () => {
  const { t, formatPrice } = useLanguage();
  const [projects, setProjects] = useState<ConstructionProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<ConstructionProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New project form state
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    category: 'VILLA CONTEMPORAINE',
    location: '',
    contractAmount: 4500000,
    startDate: new Date().toISOString().split('T')[0],
    expectedCompletionDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
    status: 'STRUCTURE' as ConstructionStatus,
    progressPercentage: 35,
    projectManagerName: 'Mehdi Benkiran',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80',
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.construction.getAll();
      setProjects(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.clientName.toLowerCase().includes(search.toLowerCase()) ||
                          p.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProj = await api.construction.update('new_' + Date.now(), {
        ...formData,
        currency: 'MAD',
        milestones: [
          { id: 'm1', projectId: 'temp', title: 'Terrassement & Fondations Spéciales', targetDate: '2025-04-15', isCompleted: true, order: 1 },
          { id: 'm2', projectId: 'temp', title: 'Gros Œuvre & Béton Armé', targetDate: '2025-08-30', isCompleted: false, order: 2 },
          { id: 'm3', projectId: 'temp', title: 'Étanchéité & Menuiserie Aluminium', targetDate: '2025-11-15', isCompleted: false, order: 3 },
          { id: 'm4', projectId: 'temp', title: 'Revêtements Marbre & Finitions', targetDate: '2026-02-28', isCompleted: false, order: 4 },
        ]
      });
      setIsModalOpen(false);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMilestone = async (project: ConstructionProject, milestoneId: string) => {
    try {
      const updated = await api.construction.toggleMilestone(project.id, milestoneId);
      setProjects(prev => prev.map(p => p.id === project.id ? updated : p));
      if (selectedProject?.id === project.id) {
        setSelectedProject(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: ConstructionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Livré / Réceptionné</Badge>;
      case 'FINISHING':
        return <Badge variant="bronze">Second Œuvre & Finitions</Badge>;
      case 'STRUCTURE':
        return <Badge variant="warning">Gros Œuvre en Cours</Badge>;
      case 'FOUNDATION':
        return <Badge variant="beige">Fondations</Badge>;
      default:
        return <Badge variant="outline">Étude & Permis</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            {t('nav.construction')} — Chantiers & Suivi Technique
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Supervision de la construction des villas contemporaines, immeubles résidentiels et rénovations clés en main
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Chantier
        </Button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-sm border border-stone-200">
          <p className="text-xs uppercase tracking-wider text-charcoal-light">Total Chantiers</p>
          <p className="text-2xl font-bold font-serif text-charcoal mt-1">{projects.length}</p>
        </div>
        <div className="bg-white p-5 rounded-sm border border-stone-200">
          <p className="text-xs uppercase tracking-wider text-charcoal-light">En Gros Œuvre</p>
          <p className="text-2xl font-bold font-serif text-bronze mt-1">
            {projects.filter(p => p.status === 'STRUCTURE').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-sm border border-stone-200">
          <p className="text-xs uppercase tracking-wider text-charcoal-light">En Finitions</p>
          <p className="text-2xl font-bold font-serif text-amber-700 mt-1">
            {projects.filter(p => p.status === 'FINISHING').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-sm border border-stone-200">
          <p className="text-xs uppercase tracking-wider text-charcoal-light">Livrés avec Succès</p>
          <p className="text-2xl font-bold font-serif text-emerald-700 mt-1">
            {projects.filter(p => p.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder="Rechercher par projet, client ou ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-sm text-sm focus:border-bronze focus:outline-none rtl:pr-9 rtl:pl-4"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-stone-200 rounded-sm text-sm py-2 px-3 text-charcoal focus:border-bronze focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="PLANNING">Planification / Permis</option>
            <option value="FOUNDATION">Fondations</option>
            <option value="STRUCTURE">Gros Œuvre</option>
            <option value="FINISHING">Finitions & Second Œuvre</option>
            <option value="COMPLETED">Livré</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="bg-white p-12 text-center text-charcoal-light rounded-sm border border-stone-200">
          Chargement des chantiers...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-sm border border-stone-200">
          <HardHat className="w-12 h-12 mx-auto text-stone-300 mb-3" />
          <p className="text-charcoal font-medium">Aucun chantier ne correspond aux critères.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm hover:border-bronze/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img 
                    src={project.coverImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80'} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {getStatusBadge(project.status)}
                    <span className="bg-charcoal/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-sm uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-charcoal rounded-sm shadow-sm">
                    {formatPrice(project.contractAmount)}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-charcoal">{project.title}</h3>
                      <p className="text-xs text-charcoal-light flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-bronze" /> {project.location}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-stone-500 bg-stone-50 px-2 py-1 border border-stone-200 rounded-sm">
                      Client: {project.clientName}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-charcoal-light font-medium">Avancement global</span>
                      <span className="font-bold text-charcoal">{project.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          project.progressPercentage === 100 ? 'bg-emerald-600' : 'bg-bronze'
                        }`} 
                        style={{ width: `${project.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Manager & Dates */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-charcoal-light border-t border-b border-stone-100 py-3">
                    <div>
                      <span className="block text-stone-400">Chef de Projet:</span>
                      <span className="font-semibold text-charcoal">{project.projectManagerName || 'Mehdi Benkiran'}</span>
                    </div>
                    <div>
                      <span className="block text-stone-400">Livraison Prévue:</span>
                      <span className="font-semibold text-charcoal">{project.expectedCompletionDate}</span>
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-charcoal">Jalons & Livrables (Cliquer pour valider) :</p>
                    {project.milestones?.map((m) => (
                      <div 
                        key={m.id}
                        onClick={() => handleToggleMilestone(project, m.id)}
                        className={`flex items-center justify-between p-2 rounded-sm text-xs cursor-pointer transition-colors border ${
                          m.isCompleted 
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                            : 'bg-stone-50 border-stone-200 text-charcoal hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`w-4 h-4 ${m.isCompleted ? 'text-emerald-600' : 'text-stone-300'}`} />
                          <span className={m.isCompleted ? 'line-through text-emerald-800' : 'font-medium'}>
                            {m.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400">{m.targetDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs">
                <span className="text-stone-400">Réf Chantier: {project.id}</span>
                <span className="text-stone-500 font-medium">DAR & ATELIER Construction</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un Chantier de Construction"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nom du Projet"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="ex. Villa Horizon Palmeraie"
              required
            />
            <Input
              label="Nom du Client"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="ex. Famille Tazi"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Localisation"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Marrakech, Palmeraie"
              required
            />
            <Input
              label="Montant du Contrat (MAD)"
              type="number"
              value={formData.contractAmount.toString()}
              onChange={(e) => setFormData({ ...formData, contractAmount: Number(e.target.value) })}
              required
            />
            <Input
              label="Chef de Projet"
              value={formData.projectManagerName}
              onChange={(e) => setFormData({ ...formData, projectManagerName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date de Démarrage"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="Livraison Estimée"
              type="date"
              value={formData.expectedCompletionDate}
              onChange={(e) => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
              required
            />
          </div>

          <Input
            label="URL de l'image de couverture"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            placeholder="https://..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer le Chantier
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
