
import React, { useState } from 'react';
import { Patrol, Staff, Client } from '../types';
import { 
  Plus, Search, Car, Footprints, Calendar, User, MapPin, 
  Image as ImageIcon, Menu, HelpCircle, Maximize2, X, ChevronLeft, ChevronRight 
} from 'lucide-react';
import PatrolFormModal from './PatrolFormModal';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PatrolViewProps {
  patrols: Patrol[];
  staff: Staff[];
  clients: Client[];
  onAddPatrol: (patrol: Patrol) => void;
  currentUser?: Staff;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const PatrolView: React.FC<PatrolViewProps> = ({ patrols, staff, clients, onAddPatrol, currentUser, onToggleMenu, onShowHelp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for Detail View & Lightbox
  const [selectedPatrol, setSelectedPatrol] = useState<Patrol | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPatrols = patrols.filter(p => {
      const staffName = staff.find(s => s.id === p.staffId)?.name || '';
      const clientName = clients.find(c => c.id === p.clientId)?.name || '';
      const search = searchTerm.toLowerCase();
      
      return staffName.toLowerCase().includes(search) || 
             clientName.toLowerCase().includes(search) ||
             p.report.toLowerCase().includes(search);
  }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || 'Desconhecido';
  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Local desconhecido';

  // Lightbox Navigation Handlers
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPatrol && lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPatrol && lightboxIndex !== null && selectedPatrol.photos && lightboxIndex < selectedPatrol.photos.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const openLightbox = (patrol: Patrol, index: number) => {
    setSelectedPatrol(patrol);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    // Note: We don't nullify selectedPatrol here if we want to return to the Detail Modal
    // If the user opened from the card, we might want to keep selectedPatrol null unless we opened the Detail Modal first.
    // However, keeping selectedPatrol is fine as long as Lightbox is conditionally rendered on lightboxIndex !== null
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
            <h2 className="text-xl font-bold text-slate-800">Rondas</h2>
            <p className="text-sm text-slate-500">Controle e relatórios de rondas</p>
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
              placeholder="Buscar por agente, local..." 
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
            <span className="hidden sm:inline">Nova Ronda</span>
          </button>
        </div>
      </div>

      {/* Patrol Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatrols.map(patrol => {
             const hasPhotos = patrol.photos && patrol.photos.length > 0;

             return (
              <div key={patrol.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${patrol.type === 'Vehicle' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                        {patrol.type === 'Vehicle' ? <Car size={20} /> : <Footprints size={20} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 line-clamp-1">{getClientName(patrol.clientId)}</h3>
                        <p className="text-xs text-slate-500">{patrol.type === 'Vehicle' ? 'Ronda Veicular' : 'Ronda A Pé'}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-1">
                        <Calendar size={12} /> {format(parseISO(patrol.date), 'dd/MM/yy HH:mm')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <User size={12} />
                      <span className="font-medium">{getStaffName(patrol.staffId)}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-600 leading-relaxed mb-3 max-h-32 overflow-hidden relative">
                     {patrol.report}
                     <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-slate-50 to-transparent"></div>
                  </div>

                  {/* Photos Preview */}
                  {hasPhotos && (
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <ImageIcon size={10} /> Evidências ({patrol.photos?.length})
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                         {patrol.photos?.slice(0, 4).map((photo, i) => (
                           <div 
                              key={i} 
                              onClick={() => openLightbox(patrol, i)}
                              className="relative cursor-pointer hover:opacity-90 transition-opacity"
                           >
                              <img src={photo} alt={`Evidência ${i}`} className="w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                           </div>
                         ))}
                         {(patrol.photos?.length || 0) > 4 && (
                            <div 
                              onClick={() => setSelectedPatrol(patrol)} 
                              className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-200"
                            >
                               +{(patrol.photos?.length || 0) - 4}
                            </div>
                         )}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-2 border-t border-slate-100">
                      <button 
                        onClick={() => setSelectedPatrol(patrol)}
                        className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                          <Maximize2 size={16} />
                          Ver Detalhes Completo
                      </button>
                  </div>
                </div>
              </div>
             );
          })}
        </div>
        
        {filteredPatrols.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-blue-100">
            <MapPin size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhuma ronda registrada</p>
            <p className="text-sm text-blue-200">Realize um novo registro para começar.</p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedPatrol && lightboxIndex === null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in duration-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${selectedPatrol.type === 'Vehicle' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                            {selectedPatrol.type === 'Vehicle' ? <Car size={24} /> : <Footprints size={24} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{getClientName(selectedPatrol.clientId)}</h3>
                            <p className="text-sm text-slate-500">
                                {format(parseISO(selectedPatrol.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedPatrol(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100 w-fit">
                        <User size={16} className="text-slate-500"/>
                        <span className="text-sm text-slate-600">Realizada por: <span className="font-bold text-slate-800">{getStaffName(selectedPatrol.staffId)}</span></span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Relatório da Ocorrência</h4>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-base text-slate-700 leading-relaxed whitespace-pre-wrap shadow-inner mb-8">
                        {selectedPatrol.report}
                    </div>

                    {selectedPatrol.photos && selectedPatrol.photos.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <ImageIcon size={16}/> Evidências Fotográficas
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {selectedPatrol.photos.map((photo, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => setLightboxIndex(i)}
                                        className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-slate-200 hover:ring-2 hover:ring-blue-500 transition-all group relative"
                                    >
                                        <img src={photo} alt={`Full ${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" size={24} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button 
                        onClick={() => setSelectedPatrol(null)}
                        className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* FULL SCREEN LIGHTBOX */}
      {selectedPatrol && lightboxIndex !== null && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
              {/* Close Button */}
              <button 
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 backdrop-blur-sm"
              >
                  <X size={24} />
              </button>

              {/* Main Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={selectedPatrol.photos![lightboxIndex]} 
                    alt="Full View" 
                    className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
                  />
                  
                  {/* Prev Button */}
                  {lightboxIndex > 0 && (
                      <button 
                        onClick={handlePrevImage}
                        className="absolute left-2 md:left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110"
                      >
                          <ChevronLeft size={32} />
                      </button>
                  )}

                  {/* Next Button */}
                  {selectedPatrol.photos && lightboxIndex < selectedPatrol.photos.length - 1 && (
                      <button 
                        onClick={handleNextImage}
                        className="absolute right-2 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110"
                      >
                          <ChevronRight size={32} />
                      </button>
                  )}
              </div>

              {/* Footer Info */}
              <div className="absolute bottom-6 text-white text-center bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
                  <p className="text-sm font-medium">
                      Imagem {lightboxIndex + 1} de {selectedPatrol.photos?.length}
                  </p>
                  <p className="text-xs text-white/70 mt-0.5">
                      {format(parseISO(selectedPatrol.date), "dd/MM/yyyy HH:mm")}
                  </p>
              </div>
          </div>
      )}

      <PatrolFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddPatrol}
        staffList={staff}
        clientList={clients}
        currentUser={currentUser}
      />
    </div>
  );
};

export default PatrolView;
