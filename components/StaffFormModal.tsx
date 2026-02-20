
import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, MapPin, FileText, Save, DollarSign, Calendar, Users, Plus, Trash2 } from 'lucide-react';
import { Staff, Dependent } from '../types';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Staff) => void;
  staffToEdit?: Staff | null;
}

const INITIAL_FORM_STATE: Partial<Staff> = {
  name: '',
  email: '',
  phone: '',
  emergencyPhone: '',
  role: 'Security',
  sector: '',
  regime: 'CLT',
  contractType: 'Undetermined',
  contractEndDate: '',
  admissionDate: '',
  preferredShifts: ['Day'],
  salary: 0,
  paymentDay: 5,
  takesAdvance: false,
  advanceValue: 0,
  advanceDay: 20,
  address: {
    street: '', number: '', complement: '', district: '', city: '', state: '', zipCode: ''
  },
  documents: {
    cpf: '', rg: '', cnv: '', pis: '', cnhNumber: '', cnhType: '', voterId: '', reservistCertificate: ''
  },
  birthDate: '',
  birthPlace: '',
  maritalStatus: 'Single',
  race: '',
  weight: 0,
  height: 0,
  bloodType: '',
  educationLevel: '',
  fatherName: '',
  motherName: '',
  dependents: []
};

const StaffFormModal: React.FC<StaffFormModalProps> = ({ isOpen, onClose, onSave, staffToEdit }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'docs' | 'family' | 'address' | 'contract'>('personal');
  const [formData, setFormData] = useState<Partial<Staff>>(INITIAL_FORM_STATE);
  
  // State for new dependent inputs
  const [newDepName, setNewDepName] = useState('');
  const [newDepType, setNewDepType] = useState<'Spouse'|'Child'>('Child');
  const [newDepCpf, setNewDepCpf] = useState('');
  const [newDepBirth, setNewDepBirth] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (staffToEdit) {
        setFormData(JSON.parse(JSON.stringify(staffToEdit)));
      } else {
        setFormData(JSON.parse(JSON.stringify(INITIAL_FORM_STATE)));
      }
      setActiveTab('personal');
    }
  }, [isOpen, staffToEdit]);

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

  const handleDocsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      documents: { ...prev.documents!, [field]: value }
    }));
  };

  const handleAddDependent = () => {
      if(!newDepName) return;
      const newDep: Dependent = {
          id: `dep-${Date.now()}`,
          name: newDepName,
          type: newDepType,
          cpf: newDepCpf,
          birthDate: newDepType === 'Child' ? newDepBirth : undefined
      };
      
      setFormData(prev => ({
          ...prev,
          dependents: [...(prev.dependents || []), newDep]
      }));

      // Reset fields
      setNewDepName('');
      setNewDepType('Child');
      setNewDepCpf('');
      setNewDepBirth('');
  };

  const handleRemoveDependent = (id: string) => {
      setFormData(prev => ({
          ...prev,
          dependents: prev.dependents?.filter(d => d.id !== id)
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff = {
      ...formData,
      id: staffToEdit ? staffToEdit.id : `stf-${Date.now()}`,
    } as Staff;
    
    onSave(newStaff);
    onClose();
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        activeTab === id 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  const inputClassName = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {staffToEdit ? 'Editar Colaborador' : 'Novo Colaborador'}
            </h3>
            <p className="text-sm text-slate-500">
              {staffToEdit ? 'Atualize os dados cadastrais' : 'Preencha as informações do funcionário'}
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
        <div className="flex px-6 border-b border-slate-100 overflow-x-auto shrink-0">
          <TabButton id="personal" label="Pessoal" icon={User} />
          <TabButton id="docs" label="Docs & Contatos" icon={FileText} />
          <TabButton id="family" label="Parentesco" icon={Users} />
          <TabButton id="address" label="Endereço" icon={MapPin} />
          <TabButton id="contract" label="Contrato & Cargo" icon={Briefcase} />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* TAB 1: PERSONAL INFO (TOPIC 1) */}
            {activeTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                  <input required type="text" className={inputClassName}
                    value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Data de Nascimento</label>
                  <input type="date" className={inputClassName}
                    value={formData.birthDate} onChange={e => handleChange('birthDate', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Natural de (Cidade/UF)</label>
                  <input type="text" className={inputClassName}
                    value={formData.birthPlace} onChange={e => handleChange('birthPlace', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Estado Civil</label>
                  <select className={inputClassName}
                    value={formData.maritalStatus} onChange={e => handleChange('maritalStatus', e.target.value)}
                  >
                      <option value="Single">Solteiro(a)</option>
                      <option value="Married">Casado(a)</option>
                      <option value="Divorced">Divorciado(a)</option>
                      <option value="Widowed">Viúvo(a)</option>
                      <option value="Separated">Separado(a)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Cor / Raça</label>
                  <input type="text" className={inputClassName}
                    value={formData.race} onChange={e => handleChange('race', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Peso (kg)</label>
                  <input type="number" step="0.1" className={inputClassName}
                    value={formData.weight} onChange={e => handleChange('weight', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Altura (m)</label>
                  <input type="number" step="0.01" className={inputClassName}
                    value={formData.height} onChange={e => handleChange('height', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Tipo Sanguíneo</label>
                  <input type="text" className={inputClassName}
                    placeholder="Ex: O+"
                    value={formData.bloodType} onChange={e => handleChange('bloodType', e.target.value)} />
                </div>
              </div>
            )}

            {/* TAB 2: DOCS & CONTACTS (TOPIC 2) */}
            {activeTab === 'docs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="md:col-span-2 font-bold text-slate-800 border-b pb-2">Contatos</h4>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Telefone Celular</label>
                  <input required type="tel" className={inputClassName}
                    value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Telefone Recado</label>
                  <input type="tel" className={inputClassName}
                    value={formData.emergencyPhone} onChange={e => handleChange('emergencyPhone', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input required type="email" className={inputClassName}
                    value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                </div>
                
                <h4 className="md:col-span-2 font-bold text-slate-800 border-b pb-2 mt-4">Documentação</h4>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Escolaridade</label>
                  <select className={inputClassName}
                     value={formData.educationLevel} onChange={e => handleChange('educationLevel', e.target.value)}
                  >
                      <option value="">Selecione...</option>
                      <option value="Fundamental Incompleto">Fundamental Incompleto</option>
                      <option value="Fundamental Completo">Fundamental Completo</option>
                      <option value="Médio Incompleto">Médio Incompleto</option>
                      <option value="Médio Completo">Médio Completo</option>
                      <option value="Superior Incompleto">Superior Incompleto</option>
                      <option value="Superior Completo">Superior Completo</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">RG</label>
                  <input type="text" className={inputClassName}
                     value={formData.documents?.rg} onChange={e => handleDocsChange('rg', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Data Emissão RG</label>
                  <input type="date" className={inputClassName}
                     value={formData.documents?.rgIssueDate} onChange={e => handleDocsChange('rgIssueDate', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">CPF</label>
                  <input type="text" className={inputClassName}
                     value={formData.documents?.cpf} onChange={e => handleDocsChange('cpf', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Título de Eleitor</label>
                  <input type="text" className={inputClassName}
                     value={formData.documents?.voterId} onChange={e => handleDocsChange('voterId', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">CNH Número</label>
                  <input type="text" className={inputClassName}
                     value={formData.documents?.cnhNumber} onChange={e => handleDocsChange('cnhNumber', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">CNH Tipo</label>
                  <input type="text" className={inputClassName} placeholder="Ex: AB"
                     value={formData.documents?.cnhType} onChange={e => handleDocsChange('cnhType', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-700">Certificado Reservista</label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input type="checkbox" 
                              checked={formData.documents?.reservistNotApplicable} 
                              onChange={e => handleDocsChange('reservistNotApplicable', e.target.checked)}
                          />
                          Não Aplicável
                      </label>
                  </div>
                  <input type="text" className={`${inputClassName} ${formData.documents?.reservistNotApplicable ? 'bg-slate-100 text-slate-400' : ''}`}
                     disabled={formData.documents?.reservistNotApplicable}
                     value={formData.documents?.reservistCertificate} onChange={e => handleDocsChange('reservistCertificate', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">PIS/PASEP</label>
                  <input type="text" className={inputClassName}
                     value={formData.documents?.pis} onChange={e => handleDocsChange('pis', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">CNV (Vigilante)</label>
                  <input type="text" className={inputClassName}
                     value={formData.documents?.cnv} onChange={e => handleDocsChange('cnv', e.target.value)} />
                </div>
              </div>
            )}

            {/* TAB 3: FAMILY (TOPIC 3) */}
            {activeTab === 'family' && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Nome do Pai</label>
                          <input type="text" className={inputClassName}
                          value={formData.fatherName} onChange={e => handleChange('fatherName', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Nome da Mãe</label>
                          <input type="text" className={inputClassName}
                          value={formData.motherName} onChange={e => handleChange('motherName', e.target.value)} />
                      </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                          <Users size={18} className="text-blue-600"/> Dependentes
                      </h4>
                      
                      {/* Add Dependent Form */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                              <div className="md:col-span-4 space-y-1">
                                  <label className="text-xs font-bold text-slate-500">Nome</label>
                                  <input type="text" className={inputClassName} placeholder="Nome do Dependente"
                                      value={newDepName} onChange={e => setNewDepName(e.target.value)} />
                              </div>
                              <div className="md:col-span-2 space-y-1">
                                  <label className="text-xs font-bold text-slate-500">Parentesco</label>
                                  <select className={inputClassName} value={newDepType} onChange={e => setNewDepType(e.target.value as any)}>
                                      <option value="Child">Filho(a)</option>
                                      <option value="Spouse">Esposa/Marido</option>
                                  </select>
                              </div>
                              <div className="md:col-span-3 space-y-1">
                                  <label className="text-xs font-bold text-slate-500">CPF</label>
                                  <input type="text" className={inputClassName} placeholder="000.000.000-00"
                                      value={newDepCpf} onChange={e => setNewDepCpf(e.target.value)} />
                              </div>
                              <div className="md:col-span-3 space-y-1">
                                  <label className="text-xs font-bold text-slate-500">Data Nasc.</label>
                                  <input type="date" className={inputClassName} 
                                      disabled={newDepType === 'Spouse'}
                                      value={newDepBirth} onChange={e => setNewDepBirth(e.target.value)} />
                              </div>
                          </div>
                          <button type="button" onClick={handleAddDependent} className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                              <Plus size={16} /> Adicionar Dependente
                          </button>
                      </div>

                      {/* Dependents List */}
                      <div className="space-y-2">
                          {formData.dependents?.length === 0 && <p className="text-center text-sm text-slate-400 py-2">Nenhum dependente cadastrado.</p>}
                          {formData.dependents?.map(dep => (
                              <div key={dep.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                                      <span className="font-bold text-slate-700">{dep.name}</span>
                                      <span className="text-slate-500">{dep.type === 'Spouse' ? 'Cônjuge' : 'Filho(a)'}</span>
                                      <span className="text-slate-500 font-mono text-xs pt-0.5">CPF: {dep.cpf || '-'}</span>
                                      <span className="text-slate-500 text-xs pt-0.5">{dep.birthDate ? `Nasc: ${new Date(dep.birthDate).toLocaleDateString()}` : ''}</span>
                                  </div>
                                  <button onClick={() => handleRemoveDependent(dep.id)} className="text-slate-400 hover:text-red-500 p-1">
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
            )}

            {/* TAB 4: ADDRESS (FIXED ALIGNMENT) */}
            {activeTab === 'address' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Complemento</label>
                  <input type="text" className={inputClassName}
                     value={formData.address?.complement} onChange={e => handleAddressChange('complement', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-1.5">
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

            {/* TAB 5: CONTRACT (EXISTING JOB TAB) */}
            {activeTab === 'contract' && (
              <div className="space-y-6">
                  {/* Contract Basics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Setor / Departamento</label>
                          <input type="text" className={inputClassName}
                              value={formData.sector || ''} onChange={e => handleChange('sector', e.target.value)} 
                              placeholder="Ex: Operacional" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Cargo</label>
                          <select className={inputClassName}
                          value={formData.role} onChange={e => handleChange('role', e.target.value)}>
                          <option value="Security">Segurança/Vigilante</option>
                          <option value="Concierge">Porteiro/Controlador</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="RH">Recursos Humanos</option>
                          <option value="Administração">Administração</option>
                          </select>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Data de Admissão</label>
                          <input required type="date" className={inputClassName}
                          value={formData.admissionDate} onChange={e => handleChange('admissionDate', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Regime</label>
                          <select className={inputClassName}
                          value={formData.regime} onChange={e => handleChange('regime', e.target.value)}>
                          <option value="CLT">CLT</option>
                          <option value="PJ">PJ</option>
                          <option value="Freelance">Freelance</option>
                          </select>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Tipo de Contrato</label>
                          <select className={inputClassName}
                          value={formData.contractType} onChange={e => handleChange('contractType', e.target.value)}>
                          <option value="Undetermined">Prazo Indeterminado</option>
                          <option value="Determined">Prazo Determinado</option>
                          <option value="Temporary">Temporário</option>
                          </select>
                      </div>

                      {/* Conditional Contract End Date Field */}
                      {(formData.contractType === 'Determined' || formData.contractType === 'Temporary') && (
                          <div className="md:col-span-2 bg-orange-50 border border-orange-100 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                               <label className="text-sm font-bold text-orange-800 flex items-center gap-2 mb-1">
                                  <Calendar size={14} />
                                  Data de Término do Contrato
                              </label>
                              <input required type="date" className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-slate-900"
                              value={formData.contractEndDate || ''} onChange={e => handleChange('contractEndDate', e.target.value)} />
                              <p className="text-xs text-orange-600 mt-1 font-medium">
                                  Nota: O sistema enviará uma notificação ao RH 10 dias antes do vencimento.
                              </p>
                          </div>
                      )}
                  </div>
                  
                  {/* Financial Details */}
                  <div className="border-t border-slate-100 pt-4">
                      <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <DollarSign size={16} className="text-green-600" />
                          Financeiro e Pagamentos
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-700">Salário / Remuneração (R$)</label>
                              <input required type="number" step="0.01" className={inputClassName}
                              value={formData.salary} onChange={e => handleChange('salary', parseFloat(e.target.value))} />
                          </div>
                           <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-700">Dia do Pagamento</label>
                              <select className={inputClassName}
                                  value={formData.paymentDay} onChange={e => handleChange('paymentDay', parseInt(e.target.value))}
                              >
                                  {[1, 5, 10, 15, 20, 25, 30].map(d => (
                                      <option key={d} value={d}>Dia {d}</option>
                                  ))}
                              </select>
                          </div>
                      </div>

                      <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <label className="flex items-center gap-3 cursor-pointer mb-4">
                              <input 
                                  type="checkbox" 
                                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                  checked={formData.takesAdvance}
                                  onChange={e => handleChange('takesAdvance', e.target.checked)}
                              />
                              <div>
                                  <span className="text-sm font-medium text-slate-800">Permitir Adiantamento Salarial (Vale)</span>
                                  <p className="text-xs text-slate-500">Gera uma previsão de pagamento separada</p>
                              </div>
                          </label>

                          {formData.takesAdvance && (
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                  <div className="space-y-1.5">
                                      <label className="text-sm font-medium text-slate-700">Valor do Adiantamento (R$)</label>
                                      <input required type="number" step="0.01" className={inputClassName}
                                      value={formData.advanceValue} onChange={e => handleChange('advanceValue', parseFloat(e.target.value))} />
                                  </div>
                                  <div className="space-y-1.5">
                                      <label className="text-sm font-medium text-slate-700">Dia do Adiantamento</label>
                                      <select className={inputClassName}
                                          value={formData.advanceDay} onChange={e => handleChange('advanceDay', parseInt(e.target.value))}
                                      >
                                          {[10, 15, 20, 25].map(d => (
                                              <option key={d} value={d}>Dia {d}</option>
                                          ))}
                                      </select>
                                  </div>
                                </div>
                          )}
                      </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5 pt-2">
                      <label className="text-sm font-medium text-slate-700">Turno Preferencial</label>
                      <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-2">
                          <input type="checkbox" checked={formData.preferredShifts?.includes('Day')} 
                          onChange={e => {
                              const newShifts = e.target.checked 
                              ? [...(formData.preferredShifts || []), 'Day']
                              : (formData.preferredShifts || []).filter(s => s !== 'Day');
                              handleChange('preferredShifts', newShifts);
                          }} 
                          />
                          <span className="text-sm">Diurno</span>
                      </label>
                      <label className="flex items-center gap-2">
                          <input type="checkbox" checked={formData.preferredShifts?.includes('Night')}
                          onChange={e => {
                              const newShifts = e.target.checked 
                              ? [...(formData.preferredShifts || []), 'Night']
                              : (formData.preferredShifts || []).filter(s => s !== 'Night');
                              handleChange('preferredShifts', newShifts);
                          }} 
                          />
                          <span className="text-sm">Noturno</span>
                      </label>
                      </div>
                  </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-white rounded-b-xl">
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
              {staffToEdit ? 'Atualizar' : 'Salvar Cadastro'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default StaffFormModal;
