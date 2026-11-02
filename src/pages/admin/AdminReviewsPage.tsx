import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { 
  Star, CheckCircle, Trash2, ShieldCheck, 
  AlertCircle, MessageSquare, Plus, Search 
} from 'lucide-react';

interface ReviewItem {
  id: string;
  authorName: string;
  authorRole: string;
  rating: number;
  comment: string;
  projectType: string;
  isVerified: boolean;
  isPublished: boolean;
  isDemoNotice: boolean;
  createdAt: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    authorName: 'M. et Mme Benjelloun',
    authorRole: 'Propriétaires Villa Anfa Supérieur',
    rating: 5,
    comment: 'Une rigueur d\'exécution remarquable pour la construction de notre villa contemporaine. Le respect des délais et le niveau de finition du marbre et de l\'aluminium sont exceptionnels.',
    projectType: 'Construction Villa Clés en Main',
    isVerified: true,
    isPublished: true,
    isDemoNotice: true,
    createdAt: '2025-01-18',
  },
  {
    id: 'r2',
    authorName: 'Dr. Tariq B.',
    authorRole: 'Acquéreur Penthouse Marina',
    rating: 5,
    comment: 'Accompagnement très professionnel dans la recherche et l\'acquisition confidentielle de mon appartement de prestige. DAR & ATELIER a ensuite pris en charge l\'architecture d\'intérieur avec un goût très sûr.',
    projectType: 'Achat Immobilier & Design',
    isVerified: true,
    isPublished: true,
    isDemoNotice: true,
    createdAt: '2025-01-25',
  },
  {
    id: 'r3',
    authorName: 'Kenza Alaoui',
    authorRole: 'Rénovation Riad Médina Marrakech',
    rating: 5,
    comment: 'L\'équipe a su préserver l\'âme historique du lieu tout en intégrant une domotique moderne et un confort thermique de premier plan.',
    projectType: 'Rénovation & Restauration',
    isVerified: true,
    isPublished: true,
    isDemoNotice: true,
    createdAt: '2025-02-02',
  },
];

export const AdminReviewsPage: React.FC = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [search, setSearch] = useState('');
  const [filterPublished, setFilterPublished] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form
  const [formData, setFormData] = useState({
    authorName: '',
    authorRole: '',
    rating: 5,
    comment: '',
    projectType: 'Construction Villa',
    isVerified: true,
  });

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.authorName.toLowerCase().includes(search.toLowerCase()) ||
                          r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterPublished === 'all' || 
                          (filterPublished === 'published' && r.isPublished) ||
                          (filterPublished === 'unpublished' && !r.isPublished);
    return matchesSearch && matchesFilter;
  });

  const handleTogglePublish = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isPublished: !r.isPublished } : r));
  };

  const handleToggleVerified = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isVerified: !r.isVerified } : r));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous supprimer ce témoignage ?')) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev: ReviewItem = {
      id: 'r_' + Date.now(),
      authorName: formData.authorName,
      authorRole: formData.authorRole,
      rating: formData.rating,
      comment: formData.comment,
      projectType: formData.projectType,
      isVerified: formData.isVerified,
      isPublished: true,
      isDemoNotice: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews([newRev, ...reviews]);
    setIsModalOpen(false);
    setFormData({ authorName: '', authorRole: '', rating: 5, comment: '', projectType: 'Construction Villa', isVerified: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            {t('nav.admin')} — Modération des Avis & Témoignages
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Gestion de la preuve sociale et validation des retours d'expérience clients certifiés
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un Avis Client
        </Button>
      </div>

      {/* Compliance banner */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Règle Déontologique & Conformité :</strong> Les avis ci-dessous sont clairement étiquetés comme démonstrations de projets récents. 
          Ne jamais publier d'avis anonyme non certifié sans accord préalable du maître d'ouvrage.
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder="Rechercher par client ou mot-clé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-sm text-sm focus:border-bronze focus:outline-none rtl:pr-9 rtl:pl-4"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterPublished}
            onChange={(e) => setFilterPublished(e.target.value)}
            className="border border-stone-200 rounded-sm text-sm py-2 px-3 text-charcoal focus:border-bronze focus:outline-none"
          >
            <option value="all">Tous les avis</option>
            <option value="published">Publiés sur le site</option>
            <option value="unpublished">En attente / Masqués</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div 
            key={rev.id}
            className="bg-white p-5 rounded-sm border border-stone-200 shadow-sm flex flex-col justify-between hover:border-bronze/40 transition-all"
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">{rev.authorName}</h3>
                  <p className="text-xs text-charcoal-light">{rev.authorRole}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-bronze text-bronze' : 'text-stone-300'}`} 
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-stone-600 italic mt-3 bg-stone-50 p-3 rounded-sm border border-stone-100 leading-relaxed">
                "{rev.comment}"
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span className="bg-stone-100 text-charcoal px-2 py-0.5 rounded-sm">
                  {rev.projectType}
                </span>
                {rev.isVerified ? (
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3" /> Maître d'Ouvrage Vérifié
                  </span>
                ) : (
                  <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded-sm">
                    Non Vérifié
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
              <button
                onClick={() => handleTogglePublish(rev.id)}
                className={`font-medium transition-colors ${
                  rev.isPublished ? 'text-emerald-700 hover:text-emerald-800' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {rev.isPublished ? '● En Ligne (Visible)' : '○ Masqué'}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleVerified(rev.id)}
                  className="text-stone-400 hover:text-bronze p-1"
                  title="Basculer vérification"
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="text-stone-400 hover:text-red-600 p-1"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Review */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un Retour d'Expérience Client"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nom du Client ou Famille"
            value={formData.authorName}
            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
            placeholder="ex. M. Othman Chraibi"
            required
          />

          <Input
            label="Titre / Contexte du Projet"
            value={formData.authorRole}
            onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
            placeholder="ex. Propriétaire Villa Contemporaine Bouskoura"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Type de Prestation"
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              placeholder="Construction Villa Clés en Main"
              required
            />
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1">
                Note (sur 5 étoiles)
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full border border-stone-200 rounded-sm text-sm py-2 px-3 text-charcoal focus:border-bronze focus:outline-none"
              >
                <option value={5}>5 étoiles (Excellent)</option>
                <option value={4}>4 étoiles (Très Bon)</option>
                <option value={3}>3 étoiles</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1">
              Témoignage Détaillé
            </label>
            <textarea
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full p-3 border border-stone-200 rounded-sm text-sm focus:border-bronze focus:outline-none"
              placeholder="Commentaire sur la qualité des finitions, le respect du budget..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer l'Avis
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
