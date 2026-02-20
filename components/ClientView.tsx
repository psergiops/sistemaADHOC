
import React, { useState } from 'react';
import { Client, Staff } from '../types';
import { Plus, Search, MoreHorizontal, Building2, MapPin, User, Phone, Users, Menu, Upload, Download, HelpCircle } from 'lucide-react';
import ClientFormModal from './ClientFormModal';
import ImportModal from './ImportModal';

interface ClientViewProps {
  clients: Client[];
  staff: Staff[];
  onAddClient: (newClient: Client) => void;
  onBulkAddClients: (clientList: Client[]) => void;
  onUpdateClient: (updatedClient: Client) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const ClientView: React.FC<ClientViewProps> = ({ clients, staff, onAddClient, onBulkAddClients, onUpdateClient, onToggleMenu, onShowHelp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewClick = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSaveClient = (clientData: Client) => {
    if (editingClient) {
      onUpdateClient(clientData);
    } else {
      onAddClient(clientData);
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

  const handleImportClients = (data: any[]) => {
    let currentMax = getNextCode(clients);
    const clientsToImport: Client[] = [];

    data.forEach(item => {
      currentMax++;
      const nextCode = currentMax.toString().padStart(4, '0');
      clientsToImport.push({ ...item, code: nextCode } as Client);
    });
    
    onBulkAddClients(clientsToImport);
    alert(`${clientsToImport.length} clientes importados com sucesso!`);
  };

  const handleExport = () => {
    const csvHeaders = ['Codigo', 'Nome Empresa', 'Responsavel', 'Email', 'Telefone', 'CEP', 'Endereco', 'Valor Contrato'];
    const csvRows = filteredClients.map(c => {
        return [
            c.code || '',
            c.name,
            c.contactPerson,
            c.email,
            c.phone,
            c.address.zipCode,
            `${c.address.street}, ${c.address.number}`,
            c.contractValue.toString()
        ].join(';');
    });

    const csvContent = '\uFEFF' + csvHeaders.join(';') + '\n' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'clientes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      
      {/* Header Toolbar */}
      <div className="bg-[#EBEBEB] px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
            <div>
            <h2 className="text-xl font-bold text-slate-800">Gestão de Clientes</h2>
            <p className="text-sm text-slate-500">Administre contratos, endereços e contatos</p>
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
              placeholder="Buscar cliente..." 
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
                className="flex items-center justify-center p-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                title="Importar (CSV)"
            >
                <Upload size={18} />
            </button>
            <button 
                onClick={handleAddNewClick}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
                <Plus size={16} />
                <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map(client => {
             const assignedStaffCount = client.assignedStaffIds?.length || 0;
             const completionRate = client.requiredStaffCount ? (assignedStaffCount / client.requiredStaffCount) * 100 : 0;
             const isFullyStaffed = completionRate >= 100;

             return (
              <div key={client.id} className="bg-[#EBEBEB] rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        {client.avatar ? <img src={client.avatar} className="w-full h-full rounded-lg object-cover" alt={client.name} /> : <Building2 size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-500">
                                #{client.code || '----'}
                            </span>
                            <h3 className="font-semibold text-slate-800 line-clamp-1">{client.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${client.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {client.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500">{client.serviceType}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleEditClick(client)} className="text-slate-300 hover:text-slate-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{client.address.street}, {client.address.number} - {client.address.city}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2 rounded border border-slate-200 flex items-center gap-2">
                           <User size={12} className="text-slate-400" />
                           <span className="truncate" title={client.contactPerson}>{client.contactPerson}</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200 flex items-center gap-2">
                           <Phone size={12} className="text-slate-400" />
                           <span className="truncate">{client.phone}</span>
                        </div>
                    </div>

                    {/* Staffing Status */}
                    <div className="mt-4">
                       <div className="flex justify-between items-end mb-1">
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                             <Users size={12} /> Equipe ({assignedStaffCount}/{client.requiredStaffCount || '-'})
                          </span>
                          <span className={`text-xs font-bold ${isFullyStaffed ? 'text-green-600' : 'text-orange-500'}`}>
                             {Math.round(completionRate)}%
                          </span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isFullyStaffed ? 'bg-green-500' : 'bg-orange-400'}`} 
                            style={{ width: `${Math.min(completionRate, 100)}%` }}
                          ></div>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                   <div className="text-xs text-slate-500">
                      Valor Mensal: <span className="font-bold text-slate-700">{formatCurrency(client.contractValue)}</span>
                   </div>
                   <button 
                    onClick={() => handleEditClick(client)}
                    className="text-blue-600 text-xs font-semibold hover:underline"
                   >
                     Gerenciar
                   </button>
                </div>
              </div>
             );
          })}
        </div>
        
        {filteredClients.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-blue-100">
            <Building2 size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhum cliente encontrado</p>
            <p className="text-sm text-blue-200">Tente buscar por outro termo ou adicione um novo.</p>
          </div>
        )}
      </div>

      <ClientFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient}
        clientToEdit={editingClient}
        staffList={staff}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportClients}
        type="client"
      />
    </div>
  );
};

export default ClientView;
