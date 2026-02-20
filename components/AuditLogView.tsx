
import React, { useState } from 'react';
import { AuditLog } from '../types';
import { Search, Filter, History, User, Calendar, FileText, Menu, HelpCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditLogViewProps {
  logs: AuditLog[];
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, onToggleMenu, onShowHelp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;

    return matchesSearch && matchesCategory;
  }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'Create':
        return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-200 uppercase">Criação</span>;
      case 'Update':
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-200 uppercase">Edição</span>;
      case 'Delete':
        return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold border border-red-200 uppercase">Exclusão</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold border border-gray-200 uppercase">{action}</span>;
    }
  };

  const roleTranslations: Record<string, string> = {
    'Security': 'Segurança',
    'Concierge': 'Porteiro',
    'Supervisor': 'Supervisor',
    'RH': 'RH',
    'Diretoria': 'Diretoria',
    'Administração': 'Administração'
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
                    <History size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Histórico de Alterações</h2>
                    <p className="text-sm text-slate-500">Log de auditoria de cadastros e modificações</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
           {/* Help Button */}
           <button
              onClick={onShowHelp}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium mr-2"
              title="Ver Tutorial deste Módulo"
           >
              <HelpCircle size={18} />
              <span className="hidden md:inline">Tutorial</span>
           </button>

           <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100"
              >
                 <option value="all">Todas Categorias</option>
                 <option value="Equipe">Equipe</option>
                 <option value="Clientes">Clientes</option>
                 <option value="Fornecedores">Fornecedores</option>
                 <option value="Escala">Escala</option>
                 <option value="Financeiro">Financeiro</option>
              </select>
           </div>
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por nome, usuário..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-900"
              />
           </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
         <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-4">Data/Hora</th>
                        <th className="px-6 py-4">Usuário (Autor)</th>
                        <th className="px-6 py-4">Ação</th>
                        <th className="px-6 py-4">Categoria</th>
                        <th className="px-6 py-4">Alvo</th>
                        <th className="px-6 py-4">Detalhes</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredLogs.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                              <History size={48} className="mx-auto mb-2 opacity-20" />
                              <p>Nenhum registro encontrado.</p>
                           </td>
                        </tr>
                     ) : (
                        filteredLogs.map(log => (
                           <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                                 {format(parseISO(log.timestamp), "dd/MM/yyyy HH:mm")}
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                                       {log.actorName.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="font-medium text-slate-800">{log.actorName}</p>
                                       <p className="text-[10px] text-slate-400">{roleTranslations[log.actorRole] || log.actorRole}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 {getActionBadge(log.action)}
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                 {log.category}
                              </td>
                              <td className="px-6 py-4 font-medium text-slate-800">
                                 {log.targetName}
                              </td>
                              <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={log.details}>
                                 {log.details || '-'}
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AuditLogView;
