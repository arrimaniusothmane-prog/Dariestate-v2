import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../services/authContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  Users, UserPlus, Shield, Mail, Phone, CheckCircle, 
  XCircle, Edit2, Lock, Trash2, Search 
} from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'agent' | 'construction_manager' | 'designer' | 'sales';
  phone: string;
  isActive: boolean;
  assignedCity: string;
  lastLogin: string;
}

const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'u1',
    name: 'Youssef El Alami',
    email: 'admin@daratelier.ma',
    role: 'super_admin',
    phone: '+212 5 22 98 45 10',
    isActive: true,
    assignedCity: 'Casablanca (Siège)',
    lastLogin: 'Aujourd\'hui à 11:42',
  },
  {
    id: 'u2',
    name: 'Karim Tazi',
    email: 'agent@daratelier.ma',
    role: 'agent',
    phone: '+212 6 61 23 45 67',
    isActive: true,
    assignedCity: 'Casablanca & Rabat',
    lastLogin: 'Hier à 16:15',
  },
  {
    id: 'u3',
    name: 'Mehdi Benkiran',
    email: 'construction@daratelier.ma',
    role: 'construction_manager',
    phone: '+212 6 62 88 99 00',
    isActive: true,
    assignedCity: 'Marrakech & Tanger',
    lastLogin: 'Il y a 3 jours',
  },
  {
    id: 'u4',
    name: 'Sofia Mansouri',
    email: 'design@daratelier.ma',
    role: 'designer',
    phone: '+212 6 63 11 22 33',
    isActive: true,
    assignedCity: 'Casablanca & Marrakech',
    lastLogin: 'Aujourd\'hui à 09:30',
  },
  {
    id: 'u5',
    name: 'Nadia Berrada',
    email: 'sales@daratelier.ma',
    role: 'sales',
    phone: '+212 6 64 55 66 77',
    isActive: true,
    assignedCity: 'Casablanca',
    lastLogin: 'Hier à 18:00',
  },
];

export const AdminUsersPage: React.FC = () => {
  const { t } = useLanguage();
  const { user: currentLoggedUser } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>(INITIAL_STAFF);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'agent' as StaffUser['role'],
    assignedCity: 'Casablanca',
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.assignedCity.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: StaffUser = {
      id: 'u_' + Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+212 6 00 00 00 00',
      role: formData.role,
      assignedCity: formData.assignedCity,
      isActive: true,
      lastLogin: 'Jamais',
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '', role: 'agent', assignedCity: 'Casablanca' });
  };

  const handleToggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous révoquer l\'accès de ce collaborateur ?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const getRoleBadge = (role: StaffUser['role']) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="bronze">Super Admin</Badge>;
      case 'admin':
        return <Badge variant="charcoal">Administrateur</Badge>;
      case 'agent':
        return <Badge variant="beige">Agent Immobilier</Badge>;
      case 'construction_manager':
        return <Badge variant="warning">Dir. Travaux</Badge>;
      case 'designer':
        return <Badge variant="bronze">Arch. d'Intérieur</Badge>;
      case 'sales':
        return <Badge variant="outline">Conseiller Ventes</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
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
            placeholder="Rechercher par nom, email ou ville..."
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
            <option value="super_admin">Super Admin</option>
            <option value="agent">Agent Immobilier</option>
            <option value="construction_manager">Chef de Chantier</option>
            <option value="designer">Architecte d'Intérieur</option>
            <option value="sales">Commercial</option>
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
                <th className="py-3 px-4">Secteur / Ville</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Dernière Connexion</th>
                <th className="py-3 px-4 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-serif font-bold text-bronze">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal">{u.name}</div>
                        <div className="text-xs text-charcoal-light flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-stone-400" /> {u.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                  <td className="py-3.5 px-4 text-xs font-medium text-stone-600">{u.assignedCity}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(u.id)}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                        u.isActive 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {u.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {u.isActive ? 'Actif' : 'Suspendu'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-charcoal-light">{u.lastLogin}</td>
                  <td className="py-3.5 px-4 text-right rtl:text-left">
                    {u.role !== 'super_admin' && (
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
              ))}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Rôle Attribué"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              options={[
                { value: 'agent', label: 'Agent Immobilier' },
                { value: 'construction_manager', label: 'Chef de Chantier / Travaux' },
                { value: 'designer', label: 'Architecte d\'Intérieur' },
                { value: 'sales', label: 'Conseiller Commercial' },
                { value: 'admin', label: 'Administrateur' },
              ]}
            />
            <Input
              label="Agence / Ville"
              value={formData.assignedCity}
              onChange={(e) => setFormData({ ...formData, assignedCity: e.target.value })}
              placeholder="Casablanca, Marrakech, Tanger..."
              required
            />
          </div>

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
