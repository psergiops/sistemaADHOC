
import React, { useState } from 'react';
import { Supplier } from '../types';
import { Plus, Search, Truck, MapPin, User, Mail, Phone, Edit, Trash, Menu, Upload, Download, HelpCircle } from 'lucide-react';
import SupplierFormModal from './SupplierFormModal';
import ImportModal from './ImportModal';

interface SupplierViewProps {
  suppliers: Supplier[];
  onAddSupplier: (newSupplier: Supplier) => void;
  onBulkAddSuppliers: (supplierList: Supplier[]) => void;
  onUpdateSupplier: (updatedSupplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const SupplierView: React.FC<SupplierViewProps> = ({ suppliers, onAddSupplier, onBulkAddSuppliers, onUpdateSupplier, onDeleteSupplier, onToggleMenu, onShowHelp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewClick = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
        onDeleteSupplier(id);
    }
  }

  const handleSaveSupplier = (supplierData: Supplier) => {
    if (editingSupplier) {
      onUpdateSupplier(supplierData);
    } else {
      onAddSupplier(supplierData);
    }
  };

  // Helper to generate next code
  const getNextCode = (list: { code?: string }[]) => {
    let max = 0;
    list.forEach(item => {
      if (item.code) {
        const val = parseInt(item.code, 10);
        if (!isNaN(val) && val > max) max = val;
      }
    });
    return max;
  };

  const handleImportSuppliers = (data: any[]) => {
    let currentMax = getNextCode(suppliers);
    const suppliersToImport: Supplier[] = [];

    data.forEach(item => {
      currentMax++;
      const nextCode = currentMax.toString().padStart(4, '0');
      suppliersToImport.push({ ...item, code: nextCode } as Supplier);
    });
    
    onBulkAddSuppliers(suppliersToImport);
    alert(`${suppliersToImport.length} fornecedores importados com sucesso!`);
  };

  const handleExport = () => {
    const csvHeaders = ['Codigo', 'Nome Empresa', 'Categoria', 'Responsavel', 'Email', 'Telefone'];
    const csvRows = filteredSuppliers.map(s => {
        return [
            s.code || '',
            s.name,
            s.category,
            s.contactPerson,
            s.email,
            s.phone
        ].join(';');
    });

    const csvContent = '\uFEFF' + csvHeaders.join(';') + '\n' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fornecedores.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      
      {/* Header Toolbar */}
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
            <div>
            <h2 className="text-xl font-bold text-slate-800">Fornecedores</h2>
            <p className="text-sm text-slate-500">Gestão de parceiros e compras</p>
            </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onShowHelp}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium mr-2"
            title="Ver Tutorial deste Módulo"
          >
            <HelpCircle size={18} />
            <span className="hidden md:inline">Tutorial</span>
          </button>

          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar fornecedor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-900"
            />
          </div>
          <div className="flex gap-2">
            <button 
                onClick={handleExport}
                className="flex items-center justify-center p-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                title="Exportar dados (CSV)"
            >
                <Download size={18} />
            </button>
            <button 
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                title="Importar CSV/Excel"
            >
                <Upload size={16} />
                <span className="hidden sm:inline">Importar</span>
            </button>
            <button 
                onClick={handleAddNewClick}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
                <Plus size={16} />
                <span className="hidden sm:inline">Novo Fornecedor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supplier List */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSuppliers.map(supplier => (
            <div key={supplier.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                      <Truck size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-500">
                            #{supplier.code || '----'}
                        </span>
                        <h3 className="font-semibold text-slate-800 line-clamp-1">{supplier.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                           {supplier.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditClick(supplier)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-all">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(supplier.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition-all">
                        <Trash size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{supplier.address.street}, {supplier.address.number} - {supplier.address.city}</span>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                     <div className="flex items-center gap-2 text-sm">
                        <User size={14} className="text-slate-400"/>
                        <span className="font-medium text-slate-700">{supplier.contactPerson}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-slate-500 ml-6">
                        <Mail size={12} /> {supplier.email}
                     </div>
                     <div className="flex items-center gap-2 text-xs text-slate-500 ml-6">
                        <Phone size={12} /> {supplier.phone}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredSuppliers.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-blue-100">
            <Truck size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhum fornecedor encontrado</p>
            <p className="text-sm text-blue-200">Tente buscar por outro termo ou adicione um novo.</p>
          </div>
        )}
      </div>

      <SupplierFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSupplier}
        supplierToEdit={editingSupplier}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportSuppliers}
        type="supplier"
      />
    </div>
  );
};

export default SupplierView;
