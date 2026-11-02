import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Palette,
  Maximize2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Layers,
  X,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { DesignProject, DesignCategory } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { RevealOnScroll, StaggerContainer, StaggerItem } from '../../components/animations';

export const DesignPage: React.FC = () => {
  const { t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const data = await api.design.getAll(activeCategory);
        setProjects(data);
      } catch (e) {
        console.error('Error fetching design projects:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [activeCategory]);

  const categories: { key: string; label: string }[] = [
    { key: 'ALL', label: t('design.categoryAll') },
    { key: 'LIVING_ROOM', label: t('design.categoryLiving') },
    { key: 'KITCHEN', label: t('design.categoryKitchen') },
    { key: 'BEDROOM', label: t('design.categoryBedroom') },
    { key: 'BATHROOM', label: t('design.categoryBathroom') },
    { key: 'OUTDOOR', label: t('design.categoryOutdoor') },
  ];

  return (
    <div className="bg-ivory-100 min-h-screen py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <RevealOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 text-bronze border border-bronze/20 text-xs font-semibold uppercase tracking-wider mb-4">
              <Palette className="w-3.5 h-3.5" />
              <span>{t('design.heroBadge')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif text-charcoal mb-4">
              {t('design.heroTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-mutedgray leading-relaxed">
              {t('design.heroDesc')}
            </p>
          </div>
        </RevealOnScroll>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-charcoal text-ivory shadow-xs'
                  : 'bg-white text-mutedgray hover:text-charcoal border border-beige/60 hover:bg-ivory'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-luxury h-80 animate-pulse border border-beige/40" />
            ))}
          </div>
        ) : (
          <StaggerContainer
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((proj) => (
              <StaggerItem key={proj.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedProject(proj)}
                  className="group relative bg-white rounded-luxury overflow-hidden border border-beige/40 shadow-sm hover:shadow-luxury transition-all duration-500 cursor-pointer h-full flex flex-col justify-between"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-ivory-200">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    <div className="absolute top-3.5 left-3.5">
                      <Badge variant="charcoal" size="sm">
                        {proj.category.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <h3 className="font-serif text-lg font-bold group-hover:text-beige transition-colors line-clamp-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-ivory/80 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-bronze" />
                        <span>{proj.location} &bull; {proj.year}</span>
                      </p>
                    </div>
                  </div>

                  {/* Details Footer */}
                  <div className="p-5 flex items-center justify-between text-xs text-mutedgray">
                    <span>{proj.surfaceArea ? `${proj.surfaceArea} m²` : 'Sur mesure'}</span>
                    <span className="font-semibold text-charcoal group-hover:text-bronze transition-colors inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Découvrir l'approche</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* PROJECT DETAIL MODAL */}
        {selectedProject && (
          <Modal
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
            title={selectedProject.title}
            subtitle={`${selectedProject.location || 'Maroc'} • Réalisation ${selectedProject.year}`}
            maxWidth="4xl"
          >
            <div className="space-y-6 text-xs sm:text-sm text-charcoal/90">
              {/* Main Image */}
              <div className="aspect-[16/9] rounded-lg overflow-hidden bg-ivory-200 shadow-md">
                <img
                  src={selectedProject.coverImage}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description & Approach */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-serif text-base text-charcoal mb-2 font-bold">
                    {t('design.approach')}
                  </h4>
                  <p className="text-mutedgray leading-relaxed">
                    {selectedProject.designApproach}
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-base text-charcoal mb-2 font-bold">
                    Description Spatiale
                  </h4>
                  <p className="text-mutedgray leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {/* Materials */}
              {selectedProject.materials && selectedProject.materials.length > 0 && (
                <div className="p-4 bg-ivory-50 rounded-lg border border-beige/40">
                  <h4 className="font-serif text-sm font-bold text-charcoal mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-bronze" />
                    <span>{t('design.materialsUsed')}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.materials.map((mat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-white border border-beige/60 text-xs font-medium text-charcoal"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA in modal */}
              <div className="pt-4 border-t border-ivory-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-mutedgray">
                  Inspiré par ce projet ? Nos architectes vous conseillent.
                </span>
                <Link
                  to="/request-quote"
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2.5 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  {t('design.requestSimilar')}
                </Link>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
