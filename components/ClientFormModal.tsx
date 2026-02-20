import React, { useState, useEffect } from 'react';
import { X, User, FileText, MapPin, CreditCard, Save, Building2, Users, Search, Plus, Trash2 } from 'lucide-react';
import { Client, ServiceType, Staff } from '../types';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  clientToEdit?: Client | null;
  staffList: Staff[];
}

const INITIAL_FORM_STATE: Partial<Client> = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: {
    street: '', number: '', district: '', city: '', state: '', zipCode: ''
  },
  serviceType: 'Portaria 24h',
  contractValue: 0,
  contractStartDate: '',
  paymentDay: 5,
  isActive: true,
  notes: '',
  requiredStaffCount: 0,
  assignedStaffIds: []
};

const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSave, clientToEdit, staffList }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'address' | 'contract'>('info');
  const [formData, setFormData] = useState<Partial<Client>>(INITIAL_FORM_STATE);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (clientToEdit) {
        setFormData(JSON.parse(JSON.stringify(clientToEdit)));
      } else {
        setFormData(JSON.parse(JSON.stringify(INITIAL_FORM_STATE)));
      }
      setActiveTab('info');
      setStaffSearchTerm('');
    }
  }, [isOpen, clientToEdit]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address!, [field]: value }
    }));
  };

  const handleAddStaff = (staffId: string) => {
    const currentIds = formData.assignedStaffIds || [];
    if (!currentIds.includes(staffId)) {
      handleChange('assignedStaffIds', [...currentIds, staffId]);
    }
  };

  const handleRemoveStaff = (staffId: string) => {
    const currentIds = formData.assignedStaffIds || [];
    handleChange('assignedStaffIds', currentIds.filter(id => id !== staffId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = {
      ...formData,
      id: clientToEdit ? clientToEdit.id : `cli-${Date.now()}`,
    } as Client;
    
    onSave(newClient);
    onClose();
  };

  // Logic for Staff Assignment lists
  const assignedIds = formData.assignedStaffIds || [];
  
  const assignedStaffList = staffList.filter(s => assignedIds.includes(s.id));
  
  const availableStaffList = staffList
    .filter(s => !assignedIds.includes(s.id)) // Remove already assigned
    .filter(s => 
      s.name.toLowerCase().includes(staffSearchTerm.toLowerCase()) || 
      s.role.toLowerCase().includes(staffSearchTerm.toLowerCase())
    );

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === id 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  const roleTranslations: Record<string, string> = {
    'Security': 'Segurança',
    'Concierge': 'Porteiro',
    'Supervisor': 'Supervisor',
    'RH': 'RH',
    'Diretoria': 'Diretoria',
    'Administração': 'Administração'
  };

  const inputClassName = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {clientToEdit ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            <p className="text-sm text-slate-500">
              {clientToEdit ? 'Atualize os dados do contrato' : 'Cadastro de empresa ou condomínio'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-100 overflow-x-auto">
          <TabButton id="info" label="Dados Gerais" icon={Building2} />
          <TabButton id="address" label="Endereço" icon={MapPin} />
          <TabButton id="contract" label="Contrato & Equipe" icon={CreditCard} />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* General Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nome da Empresa/Condomínio</label>
                <input required type="text" className={inputClassName}
                  value={formData.name} onChange={e => handleChange('name', e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nome do Responsável</label>
                <input required type="text" className={inputClassName}
                  value={formData.contactPerson} onChange={e => handleChange('contactPerson', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email de Contato</label>
                <input required type="email" className={inputClassName}
                  value={formData.email} onChange={e => handleChange('email', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Telefone</label>
                <input required type="tel" className={inputClassName}
                  value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
              </div>
               <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={formData.isActive === true} 
                      onChange={() => handleChange('isActive', true)} 
                    />
                    <span className="text-sm">Ativo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={formData.isActive === false} 
                       onChange={() => handleChange('isActive', false)} 
                    />
                    <span className="text-sm">Inativo</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="md:col-span-1 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">CEP</label>
                <input type="text" className={inputClassName}
                   value={formData.address?.zipCode} onChange={e => handleAddressChange('zipCode', e.target.value)} />
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Rua/Logradouro</label>
                <input type="text" className={inputClassName}
                   value={formData.address?.street} onChange={e => handleAddressChange('street', e.target.value)} />
              </div>
              <div className="md:col-span-1 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Número</label>
                <input type="text" className={inputClassName}
                   value={formData.address?.number} onChange={e => handleAddressChange('number', e.target.value)} />
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Bairro</label>
                <input type="text" className={inputClassName}
                   value={formData.address?.district} onChange={e => handleAddressChange('district', e.target.value)} />
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Cidade</label>
                <input type="text" className={inputClassName}
                   value={formData.address?.city} onChange={e => handleAddressChange('city', e.target.value)} />
              </div>
              <div className="md:col-span-1 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Estado</label>
                <input type="text" className={inputClassName}
                   value={formData.address?.state} onChange={e => handleAddressChange('state', e.target.value)} />
              </div>
            </div>
          )}

          {/* Contract & Team Info Tab */}
          {activeTab === 'contract' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Tipo de Serviço</label>
                  <select className={inputClassName}
                    value={formData.serviceType} onChange={e => handleChange('serviceType', e.target.value)}>
                    <option value="Portaria 24h">Portaria 24h</option>
                    <option value="Vigilância">Vigilância</option>
                    <option value="Ronda Motorizada">Ronda Motorizada</option>
                    <option value="Monitoramento">Monitoramento</option>
                    <option value="Limpeza e Conservação">Limpeza e Conservação</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Valor do Contrato (R$)</label>
                  <input required type="number" step="0.01" className={inputClassName}
                    value={formData.contractValue} onChange={e => handleChange('contractValue', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Início do Contrato</label>
                  <input required type="date" className={inputClassName}
                    value={formData.contractStartDate} onChange={e => handleChange('contractStartDate', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Dia do Vencimento</label>
                  <select className={inputClassName}
                    value={formData.paymentDay} onChange={e => handleChange('paymentDay', parseInt(e.target.value))}>
                    {[1, 5, 10, 15, 20, 25, 30].map(d => (
                      <option key={d} value={d}>Dia {d}</option>
                    ))}
                  </select>
                </div>
                 <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Quantidade de Profissionais</label>
                  <input type="number" className={inputClassName}
                    value={formData.requiredStaffCount} onChange={e => handleChange('requiredStaffCount', parseInt(e.target.value))} />
                </div>
              </div>

              <div className="border-t border-slate-200 my-2"></div>

              {/* Staff Assignment Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Assigned Staff */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-600"/>
                      Profissionais Vinculados
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {assignedStaffList.length}
                    </span>
                  </label>
                  
                  <div className="border border-slate-200 rounded-lg bg-slate-50 h-64 overflow-y-auto p-2 space-y-2">
                    {assignedStaffList.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
                        <Users size={24} className="mb-2 opacity-30" />
                        <p className="text-sm">Nenhum profissional vinculado.</p>
                        <p className="text-xs">Utilize a busca ao lado para adicionar.</p>
                      </div>
                    ) : (
                      assignedStaffList.map(staff => (
                        <div key={staff.id} className="bg-white p-2 rounded border border-slate-200 shadow-sm flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                              {staff.avatar ? <img src={staff.avatar} className="w-full h-full rounded-full" /> : staff.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800 line-clamp-1">{staff.name}</p>
                              <p className="text-[10px] text-slate-500 uppercase">{roleTranslations[staff.role] || staff.role}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveStaff(staff.id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                            title="Remover vínculo"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Column: Search & Add */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Search size={16} />
                    Adicionar Profissional
                  </label>
                  
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Buscar por nome ou cargo..." 
                      className={`${inputClassName} pl-9`}
                      value={staffSearchTerm}
                      onChange={(e) => setStaffSearchTerm(e.target.value)}
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>

                  <div className="border border-slate-200 rounded-lg bg-white h-52 overflow-y-auto p-1">
                    {availableStaffList.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-sm">
                        {staffSearchTerm ? 'Nenhum profissional encontrado.' : 'Todos os profissionais visíveis já estão vinculados.'}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {availableStaffList.map(staff => (
                          <button
                            key={staff.id}
                            type="button"
                            onClick={() => handleAddStaff(staff.id)}
                            className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-100 transition-all text-left group"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {staff.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm text-slate-700 font-medium">{staff.name}</p>
                                <p className="text-[10px] text-slate-400">{roleTranslations[staff.role] || staff.role}</p>
                              </div>
                            </div>
                            <Plus size={16} className="text-slate-300 group-hover:text-blue-600" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <div className="space-y-1.5 mt-4">
                <label className="text-sm font-medium text-slate-700">Observações</label>
                <textarea rows={2} className={inputClassName}
                   value={formData.notes} onChange={e => handleChange('notes', e.target.value)} />
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
             <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all"
            >
              <Save size={16} />
              {clientToEdit ? 'Atualizar Cliente' : 'Salvar Cliente'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;