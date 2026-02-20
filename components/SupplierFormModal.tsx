import React, { useState, useEffect } from 'react';
import { X, Save, Building2, MapPin, Phone, Mail, Truck, FileCheck } from 'lucide-react';
import { Supplier } from '../types';

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  supplierToEdit?: Supplier | null;
}

const INITIAL_FORM_STATE: Partial<Supplier> = {
  name: '',
  category: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: {
    street: '', number: '', district: '', city: '', state: '', zipCode: ''
  },
  notes: '',
  isRecurring: false,
  contractValue: 0,
  paymentDay: 10
};

const SupplierFormModal: React.FC<SupplierFormModalProps> = ({ isOpen, onClose, onSave, supplierToEdit }) => {
  const [formData, setFormData] = useState<Partial<Supplier>>(INITIAL_FORM_STATE);

  useEffect(() => {
    if (isOpen) {
      if (supplierToEdit) {
        setFormData(JSON.parse(JSON.stringify(supplierToEdit)));
      } else {
        setFormData(JSON.parse(JSON.stringify(INITIAL_FORM_STATE)));
      }
    }
  }, [isOpen, supplierToEdit]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier = {
      ...formData,
      id: supplierToEdit ? supplierToEdit.id : `sup-${Date.now()}`,
    } as Supplier;
    
    onSave(newSupplier);
    onClose();
  };

  const inputClassName = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
                <Truck className="text-orange-600" size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-800">
                {supplierToEdit ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                </h3>
                <p className="text-sm text-slate-500">
                Cadastro de parceiros e fornecedores de serviços
                </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          
          <div className="space-y-6">
            
            {/* Basic Info */}
            <div className="space-y-4">
               <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                 <Building2 size={16} /> Dados Gerais
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Razão Social / Nome</label>
                        <input required type="text" className={inputClassName}
                        value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Categoria</label>
                        <input list="categories" className={inputClassName}
                            placeholder="Ex: Uniformes"
                            value={formData.category} onChange={e => handleChange('category', e.target.value)} />
                        <datalist id="categories">
                            <option value="Uniformes" />
                            <option value="Equipamentos" />
                            <option value="Limpeza" />
                            <option value="Tecnologia" />
                            <option value="Manutenção" />
                        </datalist>
                    </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Contato Responsável</label>
                        <input required type="text" className={inputClassName}
                        value={formData.contactPerson} onChange={e => handleChange('contactPerson', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                         <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <input required type="email" className={`${inputClassName} pl-9`}
                            value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Telefone</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <input required type="tel" className={`${inputClassName} pl-9`}
                            value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                        </div>
                    </div>
               </div>
            </div>

            {/* Contract Info */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                 <FileCheck size={16} /> Dados Contratuais
               </h4>
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                      checked={formData.isRecurring}
                      onChange={e => handleChange('isRecurring', e.target.checked)}
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-800">Contrato Recorrente</span>
                      <p className="text-xs text-slate-500">Este fornecedor gera uma despesa mensal fixa</p>
                    </div>
                  </label>

                  {formData.isRecurring && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Valor Mensal (R$)</label>
                        <input type="number" step="0.01" className={inputClassName}
                          value={formData.contractValue} onChange={e => handleChange('contractValue', parseFloat(e.target.value))} />
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
                    </div>
                  )}
               </div>
            </div>

            {/* Address Info */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                 <MapPin size={16} /> Endereço
               </h4>
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
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Observações</label>
                <textarea rows={2} className={inputClassName}
                    value={formData.notes} onChange={e => handleChange('notes', e.target.value)} />
            </div>

          </div>

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
              {supplierToEdit ? 'Atualizar Fornecedor' : 'Salvar Fornecedor'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SupplierFormModal;