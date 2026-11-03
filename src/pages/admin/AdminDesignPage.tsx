import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { DesignProject, DesignCategory } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  Palette, Plus, Search, Star, Eye, Trash2, Edit3, 
  Layers, CheckCircle, Image as ImageIcon 
} from 'lucide-react';

export const AdminDesignPage: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DesignProject | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'LIVING_ROOM' as DesignCategory,
    location: 'Casablanca',
    surfaceArea: 120,
    description: '',
    materials: 'Noyer d\'Amérique, Marbre Noir Saint-Laurent, Laiton brossé, Lin naturel',
    designApproach: 'Équilibre minimaliste et chaleur organique marocaine',
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    galleryImages: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    year: new Date().getFullYear(),
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.design.getAll();
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
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'LIVING_ROOM',
      location: 'Casablanca',
      surfaceArea: 120,
      description: '',
      materials: 'Noyer massif, Marbre Calacatta, Laiton brossé, Tadelakt ivoire',
      designApproach: 'Approche contemporaine alliant pureté géométrique et savoir-faire artisanal',
      isFeatured: false,
      coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      galleryImages: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      year: new Date().getFullYear(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: DesignProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      location: project.location || 'Casablanca',
      surfaceArea: project.surfaceArea || 100,
      description: project.description,
      materials: project.materials.join(', '),
      designApproach: project.designApproach,
      isFeatured: project.isFeatured,
      coverImage: project.coverImage,
      galleryImages: project.galleryImages.join(', '),
      year: project.year,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      category: formData.category,
      location: formData.location,
      surfaceArea: Number(formData.surfaceArea) || undefined,
      description: formData.description,
      materials: formData.materials.split(',').map(m => m.trim()).filter(Boolean),
      designApproach: formData.designApproach,
      isFeatured: formData.isFeatured,
      coverImage: formData.coverImage,
      galleryImages: formData.galleryImages.split(',').map(url => url.trim()).filter(Boolean),
      year: formData.year,
      isPublished: true,
    };

    try {
      if (editingProject) {
        await api.design.update(editingProject.id, payload);
      } else {
        await api.design.create(payload);
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (project: DesignProject) => {
    await api.design.update(project.id, { isFeatured: !project.isFeatured });
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, isFeatured: !p.isFeatured } : p));
  };

  const handleDelete = async (project: DesignProject) => {
    if (!window.confirm(`Supprimer définitivement le projet « ${project.title} » ?`)) return;
    try {
      await api.design.delete(project.id);
      setProjects(prev => prev.filter(p => p.id !== project.id));
    } catch (err) {
      console.error(err);
      window.alert('La suppression du projet a échoué.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            {t('nav.design')} — Portfolio & Projets d'Intérieur
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Gestion des réalisations en architecture d'intérieur, aménagement sur mesure, décoration et 3D
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Projet Design
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-sm border border-stone-200">
          <p className="text-xs uppercase tracking-wider text-charcoal-light">Total Réalisations</p>
          <p className="text-2xl font-bold font-serif text-charcoal mt-1">{projects.length}</p>
        </div>
        <div className="bg-white p-5 rounded-sm border border-stone-200">
          <p className="text-xs uppercase tracking-wider text-charcoal-light">Projets Vedettes (Homepage)</p>
          <p className="text-2xl font-bold font-serif text-bronze mt-1">
            {projects.filter(p => p.isFeatured).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-sm border border-stone-200">
          <p className="text-xs uppercase tracking-wider text-charcoal-light">Année en Cours</p>
          <p className="text-2xl font-bold font-serif text-emerald-700 mt-1">
            {projects.filter(p => p.year === new Date().getFullYear()).length}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder="Rechercher un concept ou matériau..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-sm text-sm focus:border-bronze focus:outline-none rtl:pr-9 rtl:pl-4"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-stone-200 rounded-sm text-sm py-2 px-3 text-charcoal focus:border-bronze focus:outline-none"
          >
            <option value="all">Toutes les pièces & espaces</option>
            <option value="LIVING_ROOM">Salons & Réception</option>
            <option value="KITCHEN">Cuisines d'Auteur</option>
            <option value="BEDROOM">Suites Parentales</option>
            <option value="BATHROOM">Salles de Bains & Spas</option>
            <option value="OUTDOOR">Terrasses & Rooftops</option>
            <option value="OFFICE">Bureaux & Showrooms</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="bg-white p-12 text-center text-charcoal-light rounded-sm border border-stone-200">
          Chargement des projets...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-sm border border-stone-200">
          <Palette className="w-12 h-12 mx-auto text-stone-300 mb-3" />
          <p className="text-charcoal font-medium">Aucun projet d'intérieur ne correspond.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm hover:border-bronze/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 bg-stone-100 overflow-hidden group">
                  <img 
                    src={project.coverImage || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-charcoal/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm">
                      {project.category.replace('_', ' ')}
                    </span>
                    {project.isFeatured && (
                      <span className="bg-bronze text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm flex items-center gap-1 font-semibold">
                        <Star className="w-3 h-3 fill-white" /> Vedette
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-charcoal text-[11px] font-mono px-2 py-0.5 rounded-sm">
                    {project.galleryImages?.length || 1} photo(s)
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-serif font-bold text-lg text-charcoal line-clamp-1">{project.title}</h3>
                  <p className="text-xs text-charcoal-light mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Materials */}
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Matériaux nobles :</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {project.materials.map((mat, i) => (
                        <span key={i} className="text-[11px] bg-stone-50 border border-stone-200 text-charcoal px-2 py-0.5 rounded-sm">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs">
                <button
                  onClick={() => handleToggleFeatured(project)}
                  className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                    project.isFeatured ? 'text-bronze' : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${project.isFeatured ? 'fill-bronze' : ''}`} />
                  {project.isFeatured ? 'En Vedette' : 'Mettre en avant'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="p-1.5 text-stone-500 hover:text-bronze hover:bg-white rounded-sm transition-colors"
                    title="Modifier"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-white rounded-sm transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Modifier le Projet Design' : 'Ajouter un Projet d\'Architecture d\'Intérieur'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Titre de la Réalisation"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="ex. Penthouse Marina Casablanca — Salon & Bibliothèque"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Catégorie d'Espace"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as DesignCategory })}
              options={[
                { value: 'LIVING_ROOM', label: 'Salon & Réception' },
                { value: 'KITCHEN', label: 'Cuisine d\'Auteur' },
                { value: 'BEDROOM', label: 'Suite Parentale' },
                { value: 'BATHROOM', label: 'Salle de Bain / Spa' },
                { value: 'OUTDOOR', label: 'Terrasse & Extérieur' },
                { value: 'OFFICE', label: 'Bureau & Cabinet' },
              ]}
            />
            <Input
              label="Localisation"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="ex. Casablanca, Anfa"
            />
            <Input
              label="Surface (m²)"
              type="number"
              value={formData.surfaceArea.toString()}
              onChange={(e) => setFormData({ ...formData, surfaceArea: Number(e.target.value) })}
            />
            <Input
              label="Année de Réalisation"
              type="number"
              value={formData.year.toString()}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1">
              Description Architecturale
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-stone-200 rounded-sm text-sm focus:border-bronze focus:outline-none"
              placeholder="Décrivez les volumes, la lumière naturelle, les choix d'agencement..."
              required
            />
          </div>

          <Input
            label="Matériaux Nobles (séparés par des virgules)"
            value={formData.materials}
            onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
            placeholder="Marbre de Carrare, Noyer, Laiton brossé, Zellige artisanal"
            required
          />

          <Input
            label="Démarche & Signature du Design"
            value={formData.designApproach}
            onChange={(e) => setFormData({ ...formData, designApproach: e.target.value })}
            placeholder="Minimalisme chaleureux, valorisation des perspectives océaniques..."
            required
          />

          <Input
            label="URL Photo Principale"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            required
          />

          <Input
            label="Galerie Photos (URLs séparées par des virgules)"
            value={formData.galleryImages}
            onChange={(e) => setFormData({ ...formData, galleryImages: e.target.value })}
            placeholder="https://images.unsplash.com/..., https://..."
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured_check"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="rounded text-bronze focus:ring-bronze"
            />
            <label htmlFor="featured_check" className="text-sm text-charcoal cursor-pointer">
              Afficher ce projet en vedette sur la page d'accueil
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {editingProject ? 'Enregistrer les Modifications' : 'Créer le Projet'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
