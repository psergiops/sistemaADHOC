
import React, { useState } from 'react';
import { VehicleChecklist, Staff, Client } from '../types';
import { Plus, Search, Car, Calendar, User, Fuel, Gauge, AlertTriangle, CheckCircle2, Menu, Image as ImageIcon, HelpCircle } from 'lucide-react';
import ChecklistFormModal from './ChecklistFormModal';
import { format, parseISO } from 'date-fns';

interface ChecklistViewProps {
  checklists: VehicleChecklist[];
  staff: Staff[];
  clients: Client[];
  onAddChecklist: (checklist: VehicleChecklist) => void;
  currentUser?: Staff;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const ChecklistView: React.FC<ChecklistViewProps> = ({ checklists, staff, clients, onAddChecklist, currentUser, onToggleMenu, onShowHelp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredChecklists = checklists.filter(c => 
    c.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || 'Desconhecido';
  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Local desconhecido';

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      
      {/* Header Toolbar */}
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
            <div>
            <h2 className="text-xl font-bold text-slate-800">Vistoria de Frota</h2>
            <p className="text-sm text-slate-500">Controle de checklist de veículos e equipamentos</p>
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
              placeholder="Buscar placa ou modelo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-900"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nova Vistoria</span>
          </button>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredChecklists.map(chk => {
             const issuesCount = chk.items.filter(i => i.status === 'issue').length;
             const hasIssues = issuesCount > 0;
             const hasPhotos = chk.photos && chk.photos.length > 0;

             return (
              <div key={chk.id} className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col ${hasIssues ? 'border-red-200' : 'border-slate-200'}`}>
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasIssues ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        <Car size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 line-clamp-1">{chk.vehiclePlate}</h3>
                        <p className="text-xs text-slate-500">{chk.vehicleModel}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-1">
                        <Calendar size={12} /> {format(parseISO(chk.date), 'dd/MM/yy HH:mm')}
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-2 mb-4">
                     <div className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold border ${hasIssues ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        {hasIssues ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                        {hasIssues ? `${issuesCount} Problema(s)` : 'Aprovado'}
                     </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-lg">
                     <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-500"><Gauge size={14}/> KM</span>
                        <span className="font-medium">{chk.odometer} km</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-500"><Fuel size={14}/> Combustível</span>
                        <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${chk.fuelLevel}%` }}></div>
                           </div>
                           <span className="font-medium text-xs">{chk.fuelLevel}%</span>
                        </div>
                     </div>
                     <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-2 text-slate-500"><User size={14}/> Agente</span>
                        <span className="font-medium truncate max-w-[120px]" title={getStaffName(chk.staffId)}>{getStaffName(chk.staffId)}</span>
                     </div>
                  </div>

                  {/* Issues List (if any) */}
                  {hasIssues && (
                     <div className="mt-3 space-y-1">
                        {chk.items.filter(i => i.status === 'issue').slice(0, 3).map((item, i) => (
                           <div key={i} className="text-xs text-red-600 flex items-start gap-1.5 bg-red-50/50 p-1.5 rounded">
                              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                              <span>
                                 <strong>{item.label}:</strong> {item.notes}
                              </span>
                           </div>
                        ))}
                        {issuesCount > 3 && <p className="text-[10px] text-red-500 text-center">+ mais {issuesCount - 3} itens</p>}
                     </div>
                  )}

                  {/* Photos Preview */}
                  {hasPhotos && (
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <ImageIcon size={10} /> Fotos Anexadas ({chk.photos?.length})
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                         {chk.photos?.map((photo, i) => (
                           <img key={i} src={photo} alt={`Evidência ${i}`} className="w-14 h-14 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                         ))}
                      </div>
                    </div>
                  )}
                  
                  {chk.generalNotes && !hasIssues && (
                     <div className="mt-3 text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                        "{chk.generalNotes}"
                     </div>
                  )}
                </div>

                <div className="bg-slate-50 px-5 py-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium uppercase tracking-wide truncate">
                   {getClientName(chk.clientId)}
                </div>
              </div>
             );
          })}
        </div>
        
        {filteredChecklists.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-blue-100">
            <Car size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhuma vistoria encontrada</p>
            <p className="text-sm text-blue-200">Realize um novo checklist para começar.</p>
          </div>
        )}
      </div>

      <ChecklistFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddChecklist}
        staffList={staff}
        clientList={clients}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ChecklistView;
