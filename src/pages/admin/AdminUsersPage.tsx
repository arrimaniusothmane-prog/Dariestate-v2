import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../services/authContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import { User, UserRole } from '../../types';
import {
  Users, UserPlus, Shield, Mail, CheckCircle, XCircle, Trash2, Search, Loader2,
} from 'lucide-react';

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Administrateur',
  AGENT: 'Agent Immobilier',
  CONSTRUCTION_MANAGER: 'Directeur des Travaux',
  INTERIOR_DESIGNER: 'Architecte d’Intérieur',
  SALES_REP: 'Conseiller Ventes',
  CLIENT: 'Client',
};

export const AdminUsersPage: React.FC = () => {
  const { t } = useLanguage();
  const { user: currentLoggedUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'AGENT' as UserRole,
  });

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const all = await api.users.getAll();
      setUsers(all);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const created = await api.users.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        isActive: true,
      });
      setUsers((prev) => [...prev, created]);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', role: 'AGENT' });
    } catch (err: any) {
      setFormError(err.message || 'Impossible de créer ce compte.');
    }
  };

  const handleToggleActive = async (target: User) => {
    const updated = await api.users.update(target.id, { isActive: !target.isActive });
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous révoquer l\'accès de ce collaborateur ?')) return;
    try {
      await api.users.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      window.alert(err.message || 'Suppression impossible.');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="bronze">Super Admin</Badge>;
      case 'ADMIN':
        return <Badge variant="charcoal">Administrateur</Badge>;
      case 'AGENT':
        return <Badge variant="beige">Agent Immobilier</Badge>;
      case 'CONSTRUCTION_MANAGER':
        return <Badge variant="warning">Dir. Travaux</Badge>;
      case 'INTERIOR_DESIGNER':
        return <Badge variant="bronze">Arch. d'Intérieur</Badge>;
      case 'SALES_REP':
        return <Badge variant="outline">Conseiller Ventes</Badge>;
      default:
        return <Badge variant="outline">Client</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            {t('nav.admin')} — Équipe & Gestion des Rôles (RBAC)
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Contrôle des accès collaborateurs, attributions de portefeuilles et autorisations d'administration
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Nouveau Collaborateur
        </Button>
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-sm border border-stone-200">
          <div className="flex items-center gap-2 text-bronze font-semibold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" /> Administration Centrale
          </div>
          <p className="text-xs text-charcoal-light mt-1.5 leading-relaxed">
            Super Admin & Administrateur : accès global aux paramètres, suppression de biens, audit d'activité et gestion de l'équipe.
          </p>
        </div>
        <div className="bg-white p-4 rounded-sm border border-stone-200">
          <div className="flex items-center gap-2 text-stone-700 font-semibold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" /> Pôles Métiers
          </div>
          <p className="text-xs text-charcoal-light mt-1.5 leading-relaxed">
            Agents : gestion du catalogue et des visites. Dir. Travaux : suivi des jalons de chantiers. Designers : portfolio intérieur.
          </p>
        </div>
        <div className="bg-white p-4 rounded-sm border border-stone-200">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" /> Sécurité des Données
          </div>
          <p className="text-xs text-charcoal-light mt-1.5 leading-relaxed">
            Les notes confidentielles et devis en négociation ne sont jamais exposés aux clients. Authentification sécurisée par jeton.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-sm text-sm focus:border-bronze focus:outline-none rtl:pr-9 rtl:pl-4"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-stone-200 rounded-sm text-sm py-2 px-3 text-charcoal focus:border-bronze focus:outline-none"
          >
            <option value="all">Tous les rôles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="AGENT">Agent Immobilier</option>
            <option value="CONSTRUCTION_MANAGER">Chef de Chantier</option>
            <option value="INTERIOR_DESIGNER">Architecte d'Intérieur</option>
            <option value="SALES_REP">Commercial</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-charcoal rtl:text-right">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-charcoal-light uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Collaborateur</th>
                <th className="py-3 px-4">Rôle & Permissions</th>
                <th className="py-3 px-4">Téléphone</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Compte créé le</th>
                <th className="py-3 px-4 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-charcoal-light">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-bronze" />
                    Chargement de l'équipe...
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover border border-stone-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-serif font-bold text-bronze">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-charcoal flex items-center gap-2">
                            {u.name}
                            {u.id === currentLoggedUser?.id && (
                              <span className="text-[10px] uppercase tracking-wider text-bronze">Vous</span>
                            )}
                          </div>
                          <div className="text-xs text-charcoal-light flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-stone-400" /> {u.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                    <td className="py-3.5 px-4 text-xs font-medium text-stone-600">{u.phone || '—'}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(u)}
                        disabled={u.role === 'SUPER_ADMIN'}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors disabled:opacity-70 ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {u.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.isActive ? 'Actif' : 'Suspendu'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-charcoal-light">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3.5 px-4 text-right rtl:text-left">
                      {u.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-sm transition-colors"
                          title="Révoquer l'accès"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Créer un Compte Collaborateur"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="p-3 rounded bg-red-50 text-red-800 border border-red-200 text-xs">{formError}</div>
          )}
          <Input
            label="Nom & Prénom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="ex. Leila Benjelloun"
            required
          />

          <Input
            label="Adresse Email Professionnelle"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="leila@daratelier.ma"
            required
          />

          <Input
            label="Numéro de Téléphone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+212 6 00 00 00 00"
          />

          <Select
            label="Rôle Attribué"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            options={[
              { value: 'AGENT', label: 'Agent Immobilier' },
              { value: 'CONSTRUCTION_MANAGER', label: 'Chef de Chantier / Travaux' },
              { value: 'INTERIOR_DESIGNER', label: "Architecte d'Intérieur" },
              { value: 'SALES_REP', label: 'Conseiller Commercial' },
              { value: 'ADMIN', label: 'Administrateur' },
              { value: 'CLIENT', label: 'Client' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'Accès
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
