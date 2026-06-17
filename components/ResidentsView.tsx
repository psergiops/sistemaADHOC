
import React, { useState } from 'react';
import { Resident, Client, Staff } from '../types';
import { Users, Plus, Pencil, Trash2, Menu, HelpCircle, X, Search } from 'lucide-react';

interface ResidentsViewProps {
  residents: Resident[];
  clients: Client[];
  currentUser: Staff | any;
  onAddResident: (resident: Resident) => void;
  onUpdateResident: (resident: Resident) => void;
  onDeleteResident: (id: string) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 text-sm";
const labelClass = "text-sm font-medium text-slate-700";

const ResidentsView: React.FC<ResidentsViewProps> = ({
  residents, clients, currentUser, onAddResident, onUpdateResident, onDeleteResident, onToggleMenu, onShowHelp
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [search, setSearch] = useState('');
  const [filterClient, setFilterClient] = useState('');

  const [form, setForm] = useState({
    name: '', unit: '', origin: '', clientId: '', email: '', password: '', phone: ''
  });

  const openForm = (resident?: Resident) => {
    if (resident) {
      setEditingResident(resident);
      setForm({
        name: resident.name, unit: resident.unit, origin: resident.origin,
        clientId: resident.clientId, email: resident.email, password: resident.password, phone: resident.phone
      });
    } else {
      setEditingResident(null);
      setForm({ name: '', unit: '', origin: '', clientId: '', email: '', password: '', phone: '' });
    }
    setShowForm(true);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.unit || !form.email) return;
    const data: Resident = {
      ...(editingResident ? editingResident : { id: `res-${Date.now()}`, createdAt: new Date().toISOString() }),
      ...form,
      isActive: true
    };

    if (editingResident) onUpdateResident(data);
    else onAddResident(data);
    setShowForm(false);
    setEditingResident(null);
  };

  const filtered = residents
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.unit.toLowerCase().includes(search.toLowerCase()))
    .filter(r => !filterClient || r.clientId === filterClient);

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] dark:bg-[#0F0F0F] transition-colors duration-200">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleMenu} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Moradores</h1>
            <p className="text-sm text-slate-500">{residents.length} moradores cadastrados</p>
          </div>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          <Plus size={16} /> Novo Morador
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" className={inputClass + ' pl-9'} placeholder="Buscar por nome ou unidade..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className={inputClass + ' w-48'} value={filterClient} onChange={e => setFilterClient(e.target.value)}>
                <option value="">Todos os condomínios</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p>Nenhum morador encontrado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="text-left py-2 px-3">Nome</th>
                      <th className="text-left py-2 px-3">Unidade</th>
                      <th className="text-left py-2 px-3">Condomínio</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-center py-2 px-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => {
                      const client = clients.find(c => c.id === r.clientId);
                      return (
                        <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium text-slate-700">{r.name}</td>
                          <td className="py-2 px-3 text-slate-600">{r.unit}</td>
                          <td className="py-2 px-3 text-slate-600">{client?.name || r.origin || '-'}</td>
                          <td className="py-2 px-3 text-slate-500">{r.email}</td>
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => openForm(r)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Editar">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => { if (confirm('Excluir morador?')) onDeleteResident(r.id); }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Excluir">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{editingResident ? 'Editar Morador' : 'Novo Morador'}</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitForm} className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className={labelClass}>Nome *</label>
                <input type="text" className={inputClass} placeholder="Nome completo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Unidade *</label>
                  <input type="text" className={inputClass} placeholder="Ex: Apt 101, Casa 5" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} required />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Origem</label>
                  <input type="text" className={inputClass} placeholder="Ex: São Paulo - SP" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Condomínio</label>
                <select className={inputClass} value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}>
                  <option value="">Selecione...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Email *</label>
                  <input type="email" className={inputClass} placeholder="email@exemplo.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Telefone</label>
                  <input type="text" className={inputClass} placeholder="(11) 99999-9999" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Senha</label>
                <input type="text" className={inputClass} placeholder={editingResident ? 'Deixe em branco para manter' : 'Senha de acesso'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editingResident} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">
                  {editingResident ? 'Salvar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentsView;
