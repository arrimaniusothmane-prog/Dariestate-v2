import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Image, Sparkles } from 'lucide-react';
import { LocalStore } from '../../services/storage';
import { Property, PropertyType, TransactionType, PropertyStatus } from '../../types';

export const AdminPropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PropertyType>('VILLA');
  const [transactionType, setTransactionType] = useState<TransactionType>('BUY');
  const [price, setPrice] = useState<number>(10000000);
  const [currency, setCurrency] = useState('MAD');
  const [city, setCity] = useState('Casablanca');
  const [neighborhood, setNeighborhood] = useState('Anfa Supérieur');
  const [address, setAddress] = useState('');
  const [surfaceArea, setSurfaceArea] = useState<number>(500);
  const [bedrooms, setBedrooms] = useState<number>(4);
  const [bathrooms, setBathrooms] = useState<number>(4);
  const [status, setStatus] = useState<PropertyStatus>('AVAILABLE');
  const [isFeatured, setIsFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85');
  const [energyRating, setEnergyRating] = useState('A+');
  const [yearBuilt, setYearBuilt] = useState(2024);

  // Features list
  const [features, setFeatures] = useState<string[]>([
    'Piscine à débordement',
    'Domotique intégrale',
    'Vue dégagée',
    'Garage sécurisé',
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Image list
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (id) {
      const prop = LocalStore.getPropertyById(id);
      if (prop) {
        setTitle(prop.title);
        setDescription(prop.description);
        setType(prop.type);
        setTransactionType(prop.transactionType);
        setPrice(prop.price);
        setCurrency(prop.currency);
        setCity(prop.city);
        setNeighborhood(prop.neighborhood);
        setAddress(prop.address);
        setSurfaceArea(prop.surfaceArea);
        setBedrooms(prop.bedrooms);
        setBathrooms(prop.bathrooms);
        setStatus(prop.status);
        setIsFeatured(prop.isFeatured);
        setCoverImage(prop.coverImage);
        setEnergyRating(prop.energyRating || 'A');
        setYearBuilt(prop.yearBuilt || 2024);
        setFeatures(prop.features.map((f) => f.name));
        setImages(prop.images.map((img) => img.url));
      }
    }
  }, [id]);

  const addFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedFeatures = features.map((f, i) => ({ id: `feat-${i}`, name: f }));
    const formattedImages = images.map((url, i) => ({
      id: `img-${i}`,
      url,
      order: i,
      isCover: i === 0,
    }));

    if (isEditing && id) {
      LocalStore.updateProperty(id, {
        title,
        description,
        type,
        transactionType,
        price,
        currency,
        city,
        neighborhood,
        address,
        surfaceArea,
        bedrooms,
        bathrooms,
        status,
        isFeatured,
        coverImage,
        energyRating,
        yearBuilt,
        features: formattedFeatures,
        images: formattedImages,
      });
    } else {
      LocalStore.createProperty({
        title,
        description,
        type,
        transactionType,
        price,
        currency,
        city,
        neighborhood,
        address,
        surfaceArea,
        bedrooms,
        bathrooms,
        status,
        isFeatured,
        coverImage,
        energyRating,
        yearBuilt,
        features: formattedFeatures,
        images: formattedImages,
      });
    }

    navigate('/admin/properties');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/properties"
          className="inline-flex items-center gap-1.5 text-mutedgray hover:text-charcoal font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste des biens</span>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-luxury border border-beige/40 shadow-sm">
        <h1 className="text-2xl font-serif text-charcoal mb-6">
          {isEditing ? 'Modifier la Propriété' : 'Créer une Nouvelle Propriété'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-bold text-charcoal border-b border-ivory-200 pb-2 uppercase tracking-wider">
              1. Informations Générales
            </h3>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                Titre du bien *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Villa Al Manara — Vue Océan & Architecture Minimaliste"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Typologie *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                >
                  <option value="VILLA">Villa</option>
                  <option value="APARTMENT">Appartement</option>
                  <option value="PENTHOUSE">Penthouse</option>
                  <option value="LAND">Terrain</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="DUPLEX">Duplex</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Type de Transaction *
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                >
                  <option value="BUY">Vente</option>
                  <option value="RENT">Location</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Statut de Publication *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                >
                  <option value="AVAILABLE">Disponible</option>
                  <option value="UNDER_OFFER">Offre en cours</option>
                  <option value="RESERVED">Réservé</option>
                  <option value="SOLD">Vendu</option>
                  <option value="RENTED">Loué</option>
                  <option value="DRAFT">Brouillon</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Prix ({currency}) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-5">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-bronze rounded cursor-pointer"
                />
                <label htmlFor="featured-check" className="font-semibold text-charcoal cursor-pointer">
                  Mettre en avant sur la page d'accueil (Signature Exclusive)
                </label>
              </div>
            </div>
          </div>

          {/* Location & Specs */}
          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-sm font-bold text-charcoal border-b border-ivory-200 pb-2 uppercase tracking-wider">
              2. Localisation &amp; Dimensions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Quartier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Anfa Supérieur, Palmeraie, Souissi..."
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                Adresse exacte
              </label>
              <input
                type="text"
                placeholder="Ex: Avenue des Crêtes"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Surface (m²) *
                </label>
                <input
                  type="number"
                  required
                  value={surfaceArea}
                  onChange={(e) => setSurfaceArea(Number(e.target.value))}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Chambres
                </label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Salles de bain
                </label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                  Année de construction
                </label>
                <input
                  type="number"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(Number(e.target.value))}
                  className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-sm font-bold text-charcoal border-b border-ivory-200 pb-2 uppercase tracking-wider">
              3. Descriptif &amp; Prestations
            </h3>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                Description Architecturale Complète *
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>

            {/* Features Tags */}
            <div>
              <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                Équipements &amp; Atouts
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Ajouter un équipement (ex: Hammam, Ascenseur...)"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  className="flex-grow p-2 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-charcoal text-white rounded font-semibold cursor-pointer"
                >
                  Ajouter
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {features.map((feat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-ivory-200 text-charcoal font-medium"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-sm font-bold text-charcoal border-b border-ivory-200 pb-2 uppercase tracking-wider">
              4. Visuels &amp; Galerie Photo
            </h3>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                Image Principale (URL) *
              </label>
              <input
                type="url"
                required
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
              <div className="mt-2 w-32 aspect-[16/10] rounded overflow-hidden border border-beige/40">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                Ajouter une photo à la galerie (URL)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-grow p-2 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2 bg-charcoal text-white rounded font-semibold cursor-pointer"
                >
                  Ajouter à la galerie
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative aspect-[16/10] rounded overflow-hidden border border-beige/40 group">
                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-ivory-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/properties')}
              className="px-5 py-2.5 text-mutedgray hover:text-charcoal font-semibold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-bronze hover:bg-bronze-dark text-white rounded font-semibold uppercase tracking-wider shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Enregistrer les modifications' : 'Créer et publier le bien'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
