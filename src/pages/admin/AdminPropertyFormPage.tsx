import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Trash2,
  UploadCloud,
  Star,
  ArrowUp,
  ArrowDown,
  Plus,
  Image as ImageIcon,
  Video,
  MapPin,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api';
import { Property, PropertyType, TransactionType, PropertyStatus, PropertyCondition } from '../../types';

interface DraftImage {
  id: string;
  url: string;
  alt: string;
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_VIDEOS = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const MEDIA_REF = /^(\/uploads\/|https?:\/\/)/i;

const PROPERTY_TYPES: Array<{ value: PropertyType; label: string }> = [
  { value: 'VILLA', label: 'Villa' },
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'LAND', label: 'Terrain' },
  { value: 'DUPLEX', label: 'Duplex' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
  { value: 'COMMERCIAL', label: 'Local commercial' },
];

const STATUS_OPTIONS: Array<{ value: PropertyStatus; label: string }> = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'AVAILABLE', label: 'Disponible' },
  { value: 'UNDER_OFFER', label: 'Offre en cours' },
  { value: 'RESERVED', label: 'Réservé' },
  { value: 'SOLD', label: 'Vendu' },
  { value: 'RENTED', label: 'Loué' },
];

const CONDITION_OPTIONS: Array<{ value: PropertyCondition; label: string }> = [
  { value: 'NEW', label: 'Neuf' },
  { value: 'EXCELLENT', label: 'Excellent état' },
  { value: 'GOOD', label: 'Bon état' },
  { value: 'TO_RENOVATE', label: 'À rénover' },
];

export const AdminPropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PropertyType>('VILLA');
  const [transactionType, setTransactionType] = useState<TransactionType>('BUY');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState('MAD');
  const [city, setCity] = useState('Casablanca');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [surfaceArea, setSurfaceArea] = useState<number>(0);
  const [landArea, setLandArea] = useState('');
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [floors, setFloors] = useState<number>(0);
  const [garage, setGarage] = useState(false);
  const [garden, setGarden] = useState(false);
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [terrace, setTerrace] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [condition, setCondition] = useState<PropertyCondition>('NEW');
  const [constructionYear, setConstructionYear] = useState<string>(String(new Date().getFullYear()));
  const [status, setStatus] = useState<PropertyStatus>('DRAFT');
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [energyRating, setEnergyRating] = useState('A');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [images, setImages] = useState<DraftImage[]>([]);
  const [coverId, setCoverId] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [reference, setReference] = useState('');

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const coverImage = useMemo(
    () => images.find((image) => image.id === coverId)?.url || images[0]?.url || '',
    [images, coverId]
  );

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const property = await api.properties.getById(id);
        if (!property) {
          setError('Ce bien est introuvable.');
          return;
        }
        hydrate(property);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Impossible de charger le bien.');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [id]);

  const hydrate = (property: Property) => {
    setTitle(property.title);
    setDescription(property.description);
    setType(property.type);
    setTransactionType(property.transactionType);
    setPrice(property.price);
    setCurrency(property.currency || 'MAD');
    setCity(property.city);
    setNeighborhood(property.neighborhood || '');
    setAddress(property.address || '');
    setLatitude(property.latitude != null ? String(property.latitude) : '');
    setLongitude(property.longitude != null ? String(property.longitude) : '');
    setSurfaceArea(property.surfaceArea);
    setLandArea(property.landArea != null ? String(property.landArea) : '');
    setBedrooms(property.bedrooms);
    setBathrooms(property.bathrooms);
    setFloors(property.floors || 0);
    setGarage(!!property.garage);
    setGarden(!!property.garden);
    setSwimmingPool(!!property.swimmingPool);
    setTerrace(!!property.terrace);
    setFurnished(!!property.furnished);
    setCondition(property.condition || 'NEW');
    setConstructionYear(String(property.constructionYear || property.yearBuilt || new Date().getFullYear()));
    setStatus(property.status);
    setIsPublished(!!property.isPublished);
    setIsFeatured(!!property.isFeatured);
    setEnergyRating(property.energyRating || 'A');
    setMetaTitle(property.metaTitle || '');
    setMetaDescription(property.metaDescription || '');
    setFeatures(property.features.map((feature) => feature.name));
    setVideoUrl(property.videoUrl || '');
    setReference(property.reference || '');

    const draftImages = (property.images || []).map((image, index) => ({
      id: image.id || `img-${index}`,
      url: image.url,
      alt: image.alt || property.title,
    }));
    if (property.coverImage && !draftImages.some((image) => image.url === property.coverImage)) {
      draftImages.unshift({ id: `cover-${Date.now()}`, url: property.coverImage, alt: property.title });
    }
    setImages(draftImages);
    const cover = property.images?.find((image) => image.isCover);
    setCoverId(
      draftImages.find((image) => image.url === (cover?.url || property.coverImage))?.id ||
        draftImages[0]?.id ||
        ''
    );
  };

  const addFeature = () => {
    const value = newFeatureText.trim();
    if (value && !features.includes(value)) {
      setFeatures([...features, value]);
      setNewFeatureText('');
    }
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setError('');
    setNotice('');
    const selected = Array.from(files);

    const invalidType = selected.find((file) => !ALLOWED_IMAGES.includes(file.type));
    if (invalidType) {
      setError(`Format non supporté : ${invalidType.name}. Utilisez JPEG, PNG, WEBP ou AVIF.`);
      return;
    }
    const tooLarge = selected.find((file) => file.size > MAX_IMAGE_SIZE);
    if (tooLarge) {
      setError(`L'image ${tooLarge.name} dépasse 10 Mo.`);
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await api.media.uploadMany(selected);
      const drafts = uploaded.map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        url: file.url,
        alt: title || 'Photo du bien',
      }));
      setImages((current) => {
        const next = [...current, ...drafts];
        if (!coverId && next[0]) setCoverId(next[0].id);
        return next;
      });
      setNotice(`${uploaded.length} photo(s) ajoutée(s).`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'upload des photos.");
    } finally {
      setIsUploading(false);
    }
  };

  const addImageUrl = () => {
    const value = newImageUrl.trim();
    if (!MEDIA_REF.test(value)) {
      setError('Saisissez une URL valide (https://...) ou un fichier téléversé.');
      return;
    }
    const draft = { id: `url-${Date.now()}`, url: value, alt: title || 'Photo du bien' };
    setImages((current) => [...current, draft]);
    if (!coverId) setCoverId(draft.id);
    setNewImageUrl('');
    setError('');
  };

  const removeImage = (imageId: string) => {
    setImages((current) => {
      const next = current.filter((image) => image.id !== imageId);
      if (coverId === imageId) setCoverId(next[0]?.id || '');
      return next;
    });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const uploadVideo = async (file: File | undefined) => {
    if (!file) return;
    if (!ALLOWED_VIDEOS.includes(file.type)) {
      setError('Format vidéo non supporté. Utilisez MP4, WEBM, OGG ou MOV.');
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setError('La vidéo doit peser moins de 50 Mo.');
      return;
    }
    setIsUploading(true);
    setError('');
    try {
      const uploaded = await api.media.upload(file);
      setVideoUrl(uploaded.url);
      setNotice('Vidéo ajoutée.');
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'upload vidéo.");
    } finally {
      setIsUploading(false);
    }
  };

  const buildPayload = (publish: boolean): Partial<Property> | null => {
    if (title.trim().length < 5) {
      setError('Le titre doit comporter au moins 5 caractères.');
      return null;
    }
    if (description.trim().length < 20) {
      setError('La description doit comporter au moins 20 caractères.');
      return null;
    }
    if (!city.trim() || !neighborhood.trim() || address.trim().length < 5) {
      setError('Renseignez la ville, le quartier et une adresse complète.');
      return null;
    }
    if (!price || price <= 0) {
      setError('Saisissez un prix valide.');
      return null;
    }
    if (!surfaceArea || surfaceArea <= 0) {
      setError('Saisissez une surface valide.');
      return null;
    }
    if (images.length === 0) {
      setError('Ajoutez au moins une photo pour ce bien.');
      return null;
    }

    const nextStatus: PropertyStatus = publish
      ? status === 'DRAFT'
        ? 'AVAILABLE'
        : status
      : 'DRAFT';

    return {
      title: title.trim(),
      description: description.trim(),
      type,
      transactionType,
      price,
      currency,
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      address: address.trim(),
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      surfaceArea,
      landArea: landArea ? Number(landArea) : null,
      bedrooms,
      bathrooms,
      floors,
      garage,
      garden,
      swimmingPool,
      terrace,
      furnished,
      condition,
      constructionYear: constructionYear ? Number(constructionYear) : null,
      yearBuilt: constructionYear ? Number(constructionYear) : null,
      status: nextStatus,
      availability: nextStatus === 'DRAFT' ? 'AVAILABLE' : nextStatus,
      isPublished: publish,
      isFeatured,
      coverImage,
      videoUrl: videoUrl || null,
      energyRating: energyRating || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      features: features.map((name, index) => ({ id: `feature-${index}`, name })),
      images: images.map((image, index) => ({
        id: image.id,
        url: image.url,
        alt: image.alt || title,
        order: index,
        isCover: image.id === coverId || (index === 0 && !coverId),
      })),
    };
  };

  const save = async (publish: boolean) => {
    setError('');
    setNotice('');
    const payload = buildPayload(publish);
    if (!payload) return;

    setIsSaving(true);
    try {
      if (isEditing && id) {
        await api.properties.update(id, payload);
      } else {
        await api.properties.create(payload);
      }
      navigate('/admin/properties');
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible d'enregistrer le bien.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-mutedgray text-xs">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-bronze" />
        Chargement du bien...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16 text-xs">
      <div className="flex items-center justify-between">
        <Link to="/admin/properties" className="inline-flex items-center gap-1.5 text-mutedgray hover:text-charcoal font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la gestion des biens</span>
        </Link>
        {reference && (
          <span className="px-2.5 py-1 rounded bg-ivory-200 text-charcoal font-mono text-[11px]">
            Réf. {reference}
          </span>
        )}
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-luxury border border-beige/40 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-serif text-charcoal">
              {isEditing ? 'Modifier le bien immobilier' : 'Ajouter un bien immobilier'}
            </h1>
            <p className="text-mutedgray mt-1">
              Enregistrez un brouillon ou publiez immédiatement sur le site public.
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${
            isPublished ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {isPublished ? 'Publié sur le site' : 'Non publié'}
          </span>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded border border-red-200 bg-red-50 text-red-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {notice && (
          <div className="mb-5 p-3 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <form onSubmit={(event) => { event.preventDefault(); void save(true); }} className="space-y-8">
          {/* 1. General information */}
          <section className="space-y-4">
            <SectionTitle index="1" title="Informations Générales" />
            <Field label="Titre du bien *">
              <input
                type="text"
                required
                placeholder="Ex: Villa Al Manara — Vue Océan & Architecture Minimaliste"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Typologie *">
                <select value={type} onChange={(e) => setType(e.target.value as PropertyType)} className={inputClass}>
                  {PROPERTY_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Transaction *">
                <select value={transactionType} onChange={(e) => setTransactionType(e.target.value as TransactionType)} className={inputClass}>
                  <option value="BUY">Vente</option>
                  <option value="RENT">Location</option>
                </select>
              </Field>
              <Field label="Référence">
                <input value={reference || 'Générée automatiquement'} readOnly className={`${inputClass} bg-ivory-100 text-mutedgray`} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Prix (MAD) *">
                <input type="number" min="0" required value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Devise">
                <input value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Mise en avant">
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-charcoal">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-bronze" />
                  <span>Signature Exclusive</span>
                </label>
              </Field>
            </div>

            <Field label="Description complète *">
              <textarea rows={5} required value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
            </Field>
          </section>

          {/* 2. Location */}
          <section className="space-y-4 pt-2">
            <SectionTitle index="2" title="Localisation" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ville *">
                <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} required />
              </Field>
              <Field label="Quartier *">
                <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Anfa Supérieur, Palmeraie..." className={inputClass} required />
              </Field>
            </div>
            <Field label="Adresse complète *">
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Avenue des Crêtes, Anfa" className={inputClass} required />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Latitude (optionnelle)">
                <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="33.5731" className={inputClass} />
              </Field>
              <Field label="Longitude (optionnelle)">
                <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="-7.5898" className={inputClass} />
              </Field>
            </div>
          </section>

          {/* 3. Specs */}
          <section className="space-y-4 pt-2">
            <SectionTitle index="3" title="Caractéristiques du Bien" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Surface habitable (m²) *">
                <input type="number" min="1" required value={surfaceArea || ''} onChange={(e) => setSurfaceArea(Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Surface terrain (m²)">
                <input type="number" min="0" value={landArea} onChange={(e) => setLandArea(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Chambres">
                <input type="number" min="0" value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Salles de bain">
                <input type="number" min="0" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Nombre d'étages">
                <input type="number" min="0" value={floors} onChange={(e) => setFloors(Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Année de construction">
                <input type="number" min="1800" max="2100" value={constructionYear} onChange={(e) => setConstructionYear(e.target.value)} className={inputClass} />
              </Field>
              <Field label="État du bien">
                <select value={condition} onChange={(e) => setCondition(e.target.value as PropertyCondition)} className={inputClass}>
                  {CONDITION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Classe énergétique">
                <input value={energyRating} onChange={(e) => setEnergyRating(e.target.value)} className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              <Toggle label="Garage / Parking" checked={garage} onChange={setGarage} />
              <Toggle label="Jardin" checked={garden} onChange={setGarden} />
              <Toggle label="Piscine" checked={swimmingPool} onChange={setSwimmingPool} />
              <Toggle label="Terrasse" checked={terrace} onChange={setTerrace} />
              <Toggle label="Meublé" checked={furnished} onChange={setFurnished} />
            </div>
          </section>

          {/* 4. Media */}
          <section className="space-y-4 pt-2">
            <SectionTitle index="4" title="Photos & Vidéo" />
            <div className="rounded-lg border-2 border-dashed border-beige bg-ivory-50 p-6 text-center">
              <UploadCloud className="w-9 h-9 text-bronze mx-auto mb-2" />
              <p className="font-semibold text-charcoal mb-1">Téléverser des photos du bien</p>
              <p className="text-mutedgray mb-3">JPEG, PNG, WEBP ou AVIF — 10 Mo maximum par image.</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal hover:bg-charcoal-900 text-white rounded font-semibold cursor-pointer">
                <ImageIcon className="w-4 h-4" />
                Choisir des photos
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  className="hidden"
                  onChange={(e) => { void uploadImages(e.target.files); e.target.value = ''; }}
                />
              </label>
              {isUploading && <p className="mt-2 text-bronze font-semibold">Téléversement en cours...</p>}
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Ou ajouter une URL d'image https://..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className={inputClass}
              />
              <button type="button" onClick={addImageUrl} className="px-4 py-2 bg-charcoal text-white rounded font-semibold whitespace-nowrap cursor-pointer">
                Ajouter
              </button>
            </div>

            {images.length > 0 ? (
              <div>
                <p className="text-mutedgray mb-2">
                  {images.length} photo(s). Cliquez sur l'étoile pour choisir l'image principale, puis réordonnez avec les flèches.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {images.map((image, index) => {
                    const isCover = image.id === coverId || (index === 0 && !coverId);
                    return (
                      <div key={image.id} className={`relative rounded-lg overflow-hidden border-2 bg-ivory-100 ${isCover ? 'border-bronze' : 'border-beige/60'}`}>
                        <img src={image.url} alt={image.alt} className="w-full aspect-[4/3] object-cover" />
                        {isCover && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-bronze text-white text-[10px] font-bold uppercase tracking-wide">
                            Principale
                          </span>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/55 flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setCoverId(image.id)} title="Définir comme image principale" className="p-1 rounded bg-white/15 text-white hover:bg-bronze cursor-pointer">
                              <Star className={`w-3.5 h-3.5 ${isCover ? 'fill-current' : ''}`} />
                            </button>
                            <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} title="Monter" className="p-1 rounded bg-white/15 text-white hover:bg-white/30 disabled:opacity-30 cursor-pointer">
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1} title="Descendre" className="p-1 rounded bg-white/15 text-white hover:bg-white/30 disabled:opacity-30 cursor-pointer">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button type="button" onClick={() => removeImage(image.id)} title="Supprimer" className="p-1 rounded bg-red-600/90 text-white hover:bg-red-700 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-mutedgray italic">Aucune photo pour le moment.</p>
            )}

            <div className="pt-2 border-t border-ivory-200">
              <Field label="Vidéo du bien (optionnelle)">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://... ou téléverser une vidéo"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className={inputClass}
                  />
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-charcoal text-white rounded font-semibold whitespace-nowrap cursor-pointer">
                    <Video className="w-4 h-4" />
                    Téléverser
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      className="hidden"
                      onChange={(e) => { void uploadVideo(e.target.files?.[0]); e.target.value = ''; }}
                    />
                  </label>
                </div>
              </Field>
              {videoUrl && (
                <div className="mt-3 flex justify-between items-center gap-3 p-2 rounded bg-ivory-100 border border-beige/60">
                  <video src={videoUrl} controls className="h-20 rounded" />
                  <button type="button" onClick={() => setVideoUrl('')} className="text-red-600 font-semibold">
                    Retirer la vidéo
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* 5. Amenities */}
          <section className="space-y-4 pt-2">
            <SectionTitle index="5" title="Équipements & Prestations" />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ajouter un équipement (Hammam, Ascenseur, Domotique...)"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                className={inputClass}
              />
              <button type="button" onClick={addFeature} className="px-4 py-2 bg-charcoal text-white rounded font-semibold flex items-center gap-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <span key={`${feature}-${index}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-ivory-200 text-charcoal font-medium">
                  {feature}
                  <button type="button" onClick={() => setFeatures(features.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700 cursor-pointer">
                    &times;
                  </button>
                </span>
              ))}
              {features.length === 0 && <span className="text-mutedgray italic">Aucun équipement renseigné.</span>}
            </div>
          </section>

          {/* 6. Publication */}
          <section className="space-y-4 pt-2">
            <SectionTitle index="6" title="Publication & Référencement" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Statut du bien">
                <select value={status} onChange={(e) => setStatus(e.target.value as PropertyStatus)} className={inputClass}>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Visibilité">
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-charcoal">
                  <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 accent-bronze" />
                  <span>Afficher ce bien sur le site public</span>
                </label>
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Titre SEO">
                <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Description SEO">
                <input value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className={inputClass} />
              </Field>
            </div>
            <div className="rounded border border-beige/60 bg-ivory-50 p-3 text-mutedgray flex items-start gap-2">
              <MapPin className="w-4 h-4 text-bronze mt-0.5 flex-shrink-0" />
              <span>
                Les coordonnées GPS sont optionnelles. Si elles sont renseignées, une carte interactive apparaîtra sur la page publique du bien.
              </span>
            </div>
          </section>

          <div className="pt-6 border-t border-ivory-200 flex flex-col sm:flex-row justify-end gap-3">
            <button type="button" onClick={() => navigate('/admin/properties')} className="px-5 py-2.5 text-mutedgray hover:text-charcoal font-semibold cursor-pointer">
              Annuler
            </button>
            <button
              type="button"
              onClick={() => { void save(false); }}
              disabled={isSaving || isUploading}
              className="px-5 py-2.5 border border-charcoal text-charcoal hover:bg-ivory-100 rounded font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Enregistrer en brouillon
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-7 py-2.5 bg-bronze hover:bg-bronze-dark text-white rounded font-semibold uppercase tracking-wider shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isPublished ? 'Enregistrer et publier' : 'Publier le bien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputClass =
  'w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none';

const SectionTitle: React.FC<{ index: string; title: string }> = ({ index, title }) => (
  <div className="flex items-center gap-3 border-b border-ivory-200 pb-2">
    <span className="w-6 h-6 rounded-full bg-bronze/10 text-bronze text-[11px] font-bold flex items-center justify-center">
      {index}
    </span>
    <h3 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wider">{title}</h3>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">{label}</label>
    {children}
  </div>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (value: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className={`flex items-center gap-2 p-2.5 rounded border cursor-pointer transition-colors ${checked ? 'border-bronze bg-bronze/5 text-charcoal' : 'border-black/15 bg-ivory-50 text-mutedgray'}`}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-bronze" />
    <span className="font-semibold">{label}</span>
  </label>
);
