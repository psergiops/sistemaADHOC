
import React, { useState, useMemo, useEffect } from 'react';
import { Staff, Client, Correspondencia, CorrespondenciaStatus } from '../types';
import {
  Menu, Search, Plus, Mail, Package, FileText, Bell, HelpCircle,
  MapPin, CheckCircle2, Clock, Building2, X, Filter
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CorrespondenciaViewProps {
  correspondencias: Correspondencia[];
  staff: Staff[];
  clients: Client[];
  currentUser: Staff;
  onAddCorrespondencia: (corr: Correspondencia) => void;
  onUpdateCorrespondencia: (corr: Correspondencia) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const CorrespondenciaView: React.FC<CorrespondenciaViewProps> = ({
  correspondencias, staff, clients, currentUser,
  onAddCorrespondencia, onUpdateCorrespondencia, onToggleMenu, onShowHelp
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<CorrespondenciaStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [newCorr, setNewCorr] = useState<Partial<Correspondencia>>({
    remetente: '',
    destinatario: '',
    tipo: 'Carta',
    status: 'Recebido',
    observacao: ''
  });

  const availableClients = useMemo(() => {
    if (['Diretoria', 'Supervisor', 'Administração'].includes(currentUser.role) || currentUser.id === 'admin-master') {
      return clients;
    }
    return clients.filter(c => c.assignedStaffIds?.includes(currentUser.id));
  }, [clients, currentUser]);

  useEffect(() => {
    if (availableClients.length === 1 && !selectedClientId) {
      setSelectedClientId(availableClients[0].id);
    } else if (availableClients.length > 0 && !selectedClientId) {
      setSelectedClientId(availableClients[0].id);
    }
  }, [availableClients, selectedClientId]);

  const filteredCorr = useMemo(() => {
    return correspondencias
      .filter(c => c.clientId === selectedClientId)
      .filter(c => !filterStatus || c.status === filterStatus)
      .filter(c => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return c.remetente.toLowerCase().includes(q) ||
               c.destinatario.toLowerCase().includes(q) ||
               c.observacao?.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.dataRecebimento).getTime() - new Date(a.dataRecebimento).getTime());
  }, [correspondencias, selectedClientId, filterStatus, searchTerm]);

  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || 'Desconhecido';

  const tipoIcon: Record<string, React.ReactNode> = {
    Carta: <Mail size={16} />,
    Pacote: <Package size={16} />,
    Documento: <FileText size={16} />,
    Notificação: <Bell size={16} />
  };

  const statusColor: Record<string, string> = {
    Recebido: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Entregue: 'bg-green-100 text-green-800 border-green-200',
    Retirado: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCorr.remetente || !newCorr.destinatario || !selectedClientId) return;

    const corr: Correspondencia = {
      id: `corr-${Date.now()}`,
      clientId: selectedClientId,
      remetente: newCorr.remetente,
      destinatario: newCorr.destinatario,
      tipo: (newCorr.tipo as Correspondencia['tipo']) || 'Carta',
      status: 'Recebido',
      dataRecebimento: new Date().toISOString(),
      registradoPor: currentUser.id,
      observacao: newCorr.observacao
    };

    onAddCorrespondencia(corr);
    setNewCorr({ remetente: '', destinatario: '', tipo: 'Carta', status: 'Recebido', observacao: '' });
    setShowForm(false);
  };

  const handleMarkDelivered = (corr: Correspondencia) => {
    onUpdateCorrespondencia({
      ...corr,
      status: corr.status === 'Recebido' ? 'Entregue' : 'Retirado',
      dataEntrega: new Date().toISOString(),
      entreguePor: currentUser.id
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Correspondências</h2>
            <p className="text-sm text-slate-500">Gestão de cartas, pacotes e notificações</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={onShowHelp} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium mr-2" title="Ver Tutorial">
            <HelpCircle size={18} />
          </button>

          <div className="relative w-full md:w-64">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 z-10" />
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm font-bold text-blue-800 outline-none focus:ring-2 focus:ring-blue-300 appearance-none cursor-pointer"
            >
              {availableClients.length > 1 && <option value="">Selecione o local...</option>}
              {availableClients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> {showForm ? 'Cancelar' : 'Nova'}
          </button>
        </div>
      </div>

      {!selectedClientId ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F1F5F9]">
          <Building2 size={64} className="text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">Selecione um Local</h3>
          <p className="text-slate-500 max-w-md mt-2">Selecione o condomínio para gerenciar as correspondências.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto bg-[#F1F5F9]">
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Form */}
            {showForm && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-in fade-in slide-in-from-top-2">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Plus size={18} className="text-blue-600" /> Registrar Correspondência
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Tipo</label>
                    <select
                      value={newCorr.tipo}
                      onChange={(e) => setNewCorr({...newCorr, tipo: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Carta">Carta</option>
                      <option value="Pacote">Pacote</option>
                      <option value="Documento">Documento</option>
                      <option value="Notificação">Notificação</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Remetente</label>
                    <input required type="text" placeholder="Ex: Banco Itaú"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      value={newCorr.remetente} onChange={(e) => setNewCorr({...newCorr, remetente: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Destinatário</label>
                    <input required type="text" placeholder="Ex: Apto 101 - João"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      value={newCorr.destinatario} onChange={(e) => setNewCorr({...newCorr, destinatario: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                    <label className="text-sm font-medium text-slate-700">Observação</label>
                    <input type="text" placeholder="Observações (opcional)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      value={newCorr.observacao || ''} onChange={(e) => setNewCorr({...newCorr, observacao: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">
                      Registrar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Buscar por remetente ou destinatário..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-700"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as CorrespondenciaStatus | '')}
                  className="pl-9 pr-8 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="">Todos os status</option>
                  <option value="Recebido">Recebido</option>
                  <option value="Entregue">Entregue</option>
                  <option value="Retirado">Retirado</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredCorr.map(corr => {
                const isPending = corr.status === 'Recebido';
                return (
                  <div key={corr.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className={`p-3 rounded-xl flex items-center justify-center w-12 h-12 text-sm font-bold ${
                      corr.tipo === 'Carta' ? 'bg-blue-50 text-blue-700' :
                      corr.tipo === 'Pacote' ? 'bg-orange-50 text-orange-700' :
                      corr.tipo === 'Documento' ? 'bg-purple-50 text-purple-700' :
                      'bg-slate-50 text-slate-700'
                    }`}>
                      {tipoIcon[corr.tipo] || <Mail size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="font-bold text-slate-800 truncate">{corr.remetente}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColor[corr.status]}`}>
                          {corr.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-medium">Para:</span> {corr.destinatario}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {format(parseISO(corr.dataRecebimento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <span>Por: {getStaffName(corr.registradoPor)}</span>
                        {corr.entreguePor && <span>Entregue por: {getStaffName(corr.entreguePor)}</span>}
                      </div>
                      {corr.observacao && (
                        <p className="text-xs text-slate-400 mt-1 italic">"{corr.observacao}"</p>
                      )}
                    </div>
                    {isPending && (
                      <button
                        onClick={() => handleMarkDelivered(corr)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors shrink-0"
                        title="Marcar como Entregue"
                      >
                        <CheckCircle2 size={14} /> Entregar
                      </button>
                    )}
                    {corr.status === 'Entregue' && (
                      <button
                        onClick={() => handleMarkDelivered(corr)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors shrink-0"
                        title="Marcar como Retirado"
                      >
                        <CheckCircle2 size={14} /> Retirado
                      </button>
                    )}
                  </div>
                );
              })}
              {filteredCorr.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Mail size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-lg font-medium">Nenhuma correspondência encontrada</p>
                  <p className="text-sm">Nenhum registro para este local.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrespondenciaView;
