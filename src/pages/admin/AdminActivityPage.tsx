import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { ActivityLog } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  Activity, Clock, User, Shield, Search, 
  Filter, FileText, CheckCircle, AlertTriangle 
} from 'lucide-react';

export const AdminActivityPage: React.FC = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await api.activity.getAll();
      setLogs(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getActionCategory = (action: string): string => {
    const normalized = action.toUpperCase();
    if (normalized.includes('DELETE') || normalized.includes('REMOVE')) return 'DELETE';
    if (normalized.includes('CREATE') || normalized.includes('ADD') || normalized.includes('PUBLISH')) return 'CREATE';
    if (normalized.includes('STATUS') || normalized.includes('TOGGLE') || normalized.includes('COMPLETE')) return 'STATUS_CHANGE';
    if (normalized.includes('LOGIN') || normalized.includes('AUTH')) return 'LOGIN';
    if (normalized.includes('UPDATE') || normalized.includes('EDIT')) return 'UPDATE';
    return 'OTHER';
  };

  const filteredLogs = logs.filter(log => {
    const actionMatch = log.action.toLowerCase().includes(search.toLowerCase());
    const entityMatch = log.entityType.toLowerCase().includes(search.toLowerCase());
    const detailsMatch = log.details ? log.details.toLowerCase().includes(search.toLowerCase()) : false;
    const userMatch = log.userName ? log.userName.toLowerCase().includes(search.toLowerCase()) : false;
    const matchesSearch = actionMatch || entityMatch || detailsMatch || userMatch;
    const matchesAction = actionFilter === 'all' || getActionCategory(log.action) === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    switch (getActionCategory(action)) {
      case 'CREATE':
        return <Badge variant="success">Création</Badge>;
      case 'UPDATE':
        return <Badge variant="warning">Modification</Badge>;
      case 'DELETE':
        return <Badge variant="danger">Suppression</Badge>;
      case 'STATUS_CHANGE':
        return <Badge variant="bronze">Changement Statut</Badge>;
      case 'LOGIN':
        return <Badge variant="outline">Connexion Sécurisée</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            {t('nav.activity')} — Journal d'Audit & Sécurité
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Traçabilité immuable des opérations administratives, connexions et modifications de statut
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder="Rechercher par utilisateur, action ou bien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-sm text-sm focus:border-bronze focus:outline-none rtl:pr-9 rtl:pl-4"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="border border-stone-200 rounded-sm text-sm py-2 px-3 text-charcoal focus:border-bronze focus:outline-none"
          >
            <option value="all">Toutes les actions</option>
            <option value="CREATE">Créations</option>
            <option value="UPDATE">Modifications</option>
            <option value="STATUS_CHANGE">Changements de statut</option>
            <option value="DELETE">Suppressions</option>
          </select>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-charcoal-light">Chargement de l'historique...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-charcoal-light">Aucune activité enregistrée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-charcoal rtl:text-right">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-charcoal-light uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Heure</th>
                  <th className="py-3 px-4">Utilisateur</th>
                  <th className="py-3 px-4">Type d'Action</th>
                  <th className="py-3 px-4">Module / Entité</th>
                  <th className="py-3 px-4">Détails de l'Opération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-charcoal-light whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {new Date(log.createdAt).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-bronze">
                          {(log.userName || 'S').charAt(0)}
                        </div>
                        <span className="font-semibold text-xs text-charcoal">{log.userName || 'Système'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{getActionBadge(log.action)}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono font-semibold text-stone-600">
                      {log.entityType}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-charcoal-light">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
