
import React, { useState } from 'react';
import { X, Save, Package, Tag, Layers, Hash, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

const INITIAL_FORM_STATE = {
  code: '',
  name: '',
  category: 'Limpeza',
  quantity: 0,
  minThreshold: 5
};

const InventoryItemFormModal: React.FC<InventoryItemFormModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
        alert("Código e Descrição são obrigatórios.");
        return;
    }

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      code: formData.code.toUpperCase(),
      name: formData.name,
      category: formData.category,
      quantity: Number(formData.quantity),
      minThreshold: Number(formData.minThreshold)
    };
    
    onSave(newItem);
    setFormData(INITIAL_FORM_STATE); // Reset form
    onClose();
  };

  const inputClassName = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
             <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Package size={20} />
             </div>
             <h3 className="text-lg font-bold text-slate-800">Novo Item de Estoque</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Hash size={14} /> Código do Item
            </label>
            <input 
                required 
                type="text" 
                placeholder="Ex: LIM-001"
                className={`${inputClassName} uppercase`}
                value={formData.code} 
                onChange={e => handleChange('code', e.target.value)} 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Tag size={14} /> Descrição / Nome
            </label>
            <input 
                required 
                type="text" 
                placeholder="Ex: Detergente Neutro 5L"
                className={inputClassName}
                value={formData.name} 
                onChange={e => handleChange('name', e.target.value)} 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Layers size={14} /> Categoria
            </label>
            <input 
                list="categories-list"
                className={inputClassName}
                value={formData.category} 
                onChange={e => handleChange('category', e.target.value)} 
                placeholder="Selecione ou digite..."
            />
            <datalist id="categories-list">
                <option value="Limpeza" />
                <option value="Escritório" />
                <option value="EPI" />
                <option value="Uniformes" />
                <option value="Manutenção" />
                <option value="Copa" />
                <option value="Eletrônicos" />
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Qtd Inicial</label>
                <input 
                    type="number" 
                    min="0"
                    className={inputClassName}
                    value={formData.quantity} 
                    onChange={e => handleChange('quantity', e.target.value)} 
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    Mínimo <AlertTriangle size={10} className="text-orange-500" />
                </label>
                <input 
                    type="number" 
                    min="0"
                    className={inputClassName}
                    value={formData.minThreshold} 
                    onChange={e => handleChange('minThreshold', e.target.value)} 
                />
             </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
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
              Cadastrar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default InventoryItemFormModal;
