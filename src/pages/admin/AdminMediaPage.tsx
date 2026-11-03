import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import { MediaAsset } from '../../types';
import {
  Image as ImageIcon, Upload, Search, Trash2, Copy,
  Check, ExternalLink, Loader2,
} from 'lucide-react';

const CATEGORY_LABELS: Record<MediaAsset['category'], string> = {
  property: 'Bien immobilier',
  construction: 'Chantier',
  design: 'Design intérieur',
  general: 'Général',
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const AdminMediaPage: React.FC = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaAsset | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // New upload form
  const [newUrl, setNewUrl] = useState('');
  const [newFilename, setNewFilename] = useState('');
  const [newAltText, setNewAltText] = useState('');
  const [newCategory, setNewCategory] = useState<MediaAsset['category']>('property');

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const all = await api.media.getAll();
      setMediaList(all);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const filteredMedia = mediaList.filter((item) => {
    const query = search.toLowerCase();
    const matchesSearch =
      item.filename.toLowerCase().includes(query) ||
      item.altText.toLowerCase().includes(query);
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCopyUrl = (item: MediaAsset) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous supprimer cette ressource multimédia ?')) return;
    try {
      await api.media.delete(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (e) {
      console.error(e);
      window.alert('La suppression a échoué. Merci de réessayer.');
    }
  };

  const resetForm = () => {
    setNewUrl('');
    setNewFilename('');
    setNewAltText('');
    setNewCategory('property');
    setFormError(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url, filename } = await api.media.upload(file);
      setNewUrl(url);
      setNewFilename(filename);
      if (!newAltText) setNewAltText(filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
    } catch (err) {
      console.error(err);
      setFormError('Impossible de lire ce fichier image.');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) {
      setFormError('Ajoutez une URL ou choisissez un fichier image.');
      return;
    }
    setIsSaving(true);
    setFormError(null);
    try {
      const newItem = await api.media.add({
        url: newUrl,
        filename: newFilename || `image-${Date.now()}.jpg`,
        altText: newAltText || 'Photographie architecturale DAR & ATELIER',
        category: newCategory,
        dimensions: '1920 x 1080',
        sizeKb: Math.floor(Math.random() * 300 + 200),
      });
      setMediaList((prev) => [newItem, ...prev]);
      setIsUploadOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err?.message || "L'enregistrement a échoué.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            {t('nav.admin')} — Médiathèque & Ressources Visuelles
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Gestionnaire centralisé des photographies haute définition, plans 3D et visuels de réalisations
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Ajouter une Image
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder="Rechercher par nom ou description..."
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
            <option value="all">Toutes les catégories</option>
            <option value="property">Biens Immobiliers</option>
            <option value="construction">Chantiers & Gros Œuvre</option>
            <option value="design">Architecture d'Intérieur</option>
            <option value="general">Général / Branding</option>
          </select>
        </div>
      </div>

      {/* Media Gallery Grid */}
      {isLoading ? (
        <div className="bg-white p-12 text-center text-charcoal-light rounded-sm border border-stone-200">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-bronze" />
          Chargement de la médiathèque...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-sm border border-stone-200">
          <ImageIcon className="w-12 h-12 mx-auto text-stone-300 mb-3" />
          <p className="text-charcoal font-medium">Aucun visuel ne correspond à ces critères.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`group bg-white rounded-sm border overflow-hidden cursor-pointer transition-all ${
                selectedItem?.id === item.id
                  ? 'border-bronze ring-2 ring-bronze/20 shadow-md'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="relative aspect-video bg-stone-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.altText}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-charcoal/70 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm">
                  {item.category}
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-charcoal truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                  <span>{item.dimensions}</span>
                  <span>{item.sizeKb} KB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspector */}
      {selectedItem && (
        <div className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3 aspect-video bg-stone-100 rounded-sm overflow-hidden border border-stone-200">
            <img src={selectedItem.url} alt={selectedItem.altText} className="w-full h-full object-cover" />
          </div>
          <div className="w-full md:w-2/3 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif font-bold text-lg text-charcoal">{selectedItem.filename}</h3>
                <p className="text-xs text-charcoal-light mt-0.5">Ajouté le {formatDate(selectedItem.uploadedAt)}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-stone-600 text-sm"
              >
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-sm border border-stone-200 text-xs">
              <div>
                <span className="text-stone-400 block">Dimensions</span>
                <span className="font-semibold text-charcoal">{selectedItem.dimensions}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Taille</span>
                <span className="font-semibold text-charcoal">{selectedItem.sizeKb} KB</span>
              </div>
              <div>
                <span className="text-stone-400 block">Catégorie</span>
                <span className="font-semibold text-charcoal">{CATEGORY_LABELS[selectedItem.category]}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Format</span>
                <span className="font-semibold text-charcoal">JPEG / WebP</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-charcoal block mb-1">Texte Alternatif (SEO & Accessibilité)</span>
              <p className="text-xs text-charcoal-light italic bg-white p-2 border border-stone-200 rounded-sm">
                "{selectedItem.altText}"
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyUrl(selectedItem)}
                className="flex items-center gap-1.5"
              >
                {copiedId === selectedItem.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Lien Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copier l'URL CDN
                  </>
                )}
              </Button>
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-bronze px-3 py-1.5 border border-stone-200 rounded-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ouvrir en plein écran
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(selectedItem.id)}
                className="flex items-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50 ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          resetForm();
        }}
        title="Ajouter un Visuel à la Médiathèque"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded bg-red-50 text-red-800 border border-red-200 text-xs">{formError}</div>
          )}

          <div className="border-2 border-dashed border-stone-200 rounded-sm p-6 text-center bg-stone-50/60">
            <ImageIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs text-charcoal-light mb-3">
              Choisissez une image depuis votre ordinateur — elle sera enregistrée dans la médiathèque.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Choisir un fichier
            </Button>
            {newUrl && newUrl.startsWith('data:') && (
              <img src={newUrl} alt="Aperçu" className="mt-3 w-full max-h-32 object-cover rounded-sm border border-stone-200" />
            )}
          </div>

          <Input
            label="Ou URL de l'image (CDN ou hébergement externe)"
            value={newUrl.startsWith('data:') ? '' : newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
          />

          <Input
            label="Nom du fichier"
            value={newFilename}
            onChange={(e) => setNewFilename(e.target.value)}
            placeholder="villa-marrakech-piscine.jpg"
            required
          />

          <Input
            label="Texte Alternatif (Alt text pour référencement Google)"
            value={newAltText}
            onChange={(e) => setNewAltText(e.target.value)}
            placeholder="Piscine à débordement et vue sur l'Atlas..."
            required
          />

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1">
              Catégorie d'utilisation
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as MediaAsset['category'])}
              className="w-full border border-stone-200 rounded-sm text-sm py-2 px-3 text-charcoal focus:border-bronze focus:outline-none"
            >
              <option value="property">Biens Immobiliers</option>
              <option value="construction">Chantiers & Gros Œuvre</option>
              <option value="design">Architecture d'Intérieur</option>
              <option value="general">Général / Branding</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsUploadOpen(false);
                resetForm();
              }}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : "Enregistrer l'image"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
