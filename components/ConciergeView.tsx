
import React, { useState, useMemo, useEffect } from 'react';
import { Staff, EntryLog, GuestList, Reservation, LogEntryType, Client, Guest, MaterialRequest, MaterialRequestItem } from '../types';
import { 
  Menu, ClipboardList, Users, Calendar, Plus, Search, 
  Car, User, Box, Clock, Link, Check, ExternalLink, Trash2, MapPin, Building2,
  XCircle, CheckCircle2, UserPlus, Package, HelpCircle
} from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConciergeViewProps {
  logs: EntryLog[];
  guestLists: GuestList[];
  reservations: Reservation[];
  materialRequests: MaterialRequest[];
  staff: Staff[];
  clients: Client[];
  currentUser: Staff;
  onAddLog: (log: EntryLog) => void;
  onAddGuestList: (list: GuestList) => void;
  onAddReservation: (res: Reservation) => void;
  onAddMaterialRequest: (req: MaterialRequest) => void;
  onUpdateGuestList?: (list: GuestList) => void;
  onDeleteGuestList?: (id: string) => void;
  onDeleteReservation?: (id: string) => void;
  onDeleteMaterialRequest?: (id: string) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const ConciergeView: React.FC<ConciergeViewProps> = ({ 
  logs, guestLists, reservations, materialRequests = [], staff, clients = [], currentUser, 
  onAddLog, onAddGuestList, onAddReservation, onAddMaterialRequest, onUpdateGuestList, onDeleteGuestList, onDeleteReservation, onDeleteMaterialRequest, onToggleMenu, onShowHelp
}) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'guests' | 'reservations' | 'materials'>('logs');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Define standardized dark input style
  const darkInputClass = "w-full px-3 py-2 border border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-white placeholder-slate-400 transition-colors";

  // Determine accessible clients for the current user
  const availableClients = useMemo(() => {
    // Admin, Director, Supervisor can see all
    if (['Diretoria', 'Supervisor', 'Administração'].includes(currentUser.role) || currentUser.id === 'admin-master') {
        return clients;
    }
    // Regular staff can only see assigned clients
    return clients.filter(c => c.assignedStaffIds?.includes(currentUser.id));
  }, [clients, currentUser]);

  // Set default client selection
  useEffect(() => {
    if (availableClients.length === 1 && !selectedClientId) {
        setSelectedClientId(availableClients[0].id);
    } else if (availableClients.length > 0 && !selectedClientId) {
        setSelectedClientId(availableClients[0].id);
    }
  }, [availableClients, selectedClientId]);

  // Filter Data based on selected Client and Date
  const filteredLogs = useMemo(() => {
    return logs.filter(l => 
        l.clientId === selectedClientId && 
        format(parseISO(l.timestamp), 'yyyy-MM-dd') === selectedDate
    );
  }, [logs, selectedClientId, selectedDate]);

  const filteredGuestLists = useMemo(() => guestLists.filter(l => l.clientId === selectedClientId), [guestLists, selectedClientId]);
  const filteredReservations = useMemo(() => reservations.filter(r => r.clientId === selectedClientId), [reservations, selectedClientId]);
  const filteredMaterialRequests = useMemo(() => materialRequests.filter(r => r.clientId === selectedClientId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [materialRequests, selectedClientId]);

  // --- LOGS STATE ---
  const [newLog, setNewLog] = useState<Partial<EntryLog>>({
    type: 'Visitor',
    name: '',
    document: '',
    vehicleModel: '',
    vehiclePlate: '',
    notes: ''
  });

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.name || !selectedClientId) return;

    onAddLog({
        id: `log-${Date.now()}`,
        clientId: selectedClientId,
        type: newLog.type as LogEntryType,
        name: newLog.name,
        document: newLog.document,
        vehicleModel: newLog.vehicleModel,
        vehiclePlate: newLog.vehiclePlate,
        notes: newLog.notes,
        timestamp: new Date().toISOString(), // Adds as "now"
        registeredBy: currentUser.id
    });

    setNewLog({
        type: 'Visitor',
        name: '',
        document: '',
        vehicleModel: '',
        vehiclePlate: '',
        notes: ''
    });
    // Reset date view to today to see the new log
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  };

  // --- GUEST LIST STATE ---
  const [newGuestList, setNewGuestList] = useState<Partial<GuestList>>({
      residentName: '',
      eventName: '',
      date: format(new Date(), 'yyyy-MM-dd')
  });
  const [lastGeneratedLink, setLastGeneratedLink] = useState<string | null>(null);
  
  // State for adding extra guest to a specific list
  const [addingGuestToListId, setAddingGuestToListId] = useState<string | null>(null);
  const [extraGuestName, setExtraGuestName] = useState('');
  const [extraGuestDoc, setExtraGuestDoc] = useState('');

  const handleCreateGuestList = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newGuestList.residentName || !newGuestList.eventName || !selectedClientId) return;

      const token = Math.random().toString(36).substring(7);
      const newList: GuestList = {
          id: `lst-${Date.now()}`,
          clientId: selectedClientId,
          residentName: newGuestList.residentName,
          eventName: newGuestList.eventName,
          date: newGuestList.date!,
          linkToken: token,
          guests: [],
          createdBy: currentUser.id
      };

      onAddGuestList(newList);
      setLastGeneratedLink(`${window.location.origin}?token=${token}`);
      setNewGuestList({ residentName: '', eventName: '', date: format(new Date(), 'yyyy-MM-dd') });
  };

  const handleToggleGuestArrival = (list: GuestList, guestId: string) => {
      if (!onUpdateGuestList) return;

      const updatedGuests = list.guests.map(g => {
          if (g.id === guestId) {
              return {
                  ...g,
                  arrived: !g.arrived,
                  arrivedAt: !g.arrived ? new Date().toISOString() : undefined
              };
          }
          return g;
      });

      onUpdateGuestList({ ...list, guests: updatedGuests });
  };

  const handleAddExtraGuest = (list: GuestList) => {
      if (!onUpdateGuestList || !extraGuestName) return;

      const newGuest: Guest = {
          id: `gst-ext-${Date.now()}`,
          name: extraGuestName,
          document: extraGuestDoc || 'Não inf.',
          isExtra: true,
          arrived: true,
          arrivedAt: new Date().toISOString()
      };

      const updatedGuests = [newGuest, ...list.guests];
      onUpdateGuestList({ ...list, guests: updatedGuests });
      
      setAddingGuestToListId(null);
      setExtraGuestName('');
      setExtraGuestDoc('');
  };

  // --- RESERVATION STATE ---
  const [newRes, setNewRes] = useState<Partial<Reservation>>({
      resourceName: 'Salão de Festas',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '12:00',
      endTime: '18:00',
      reservedBy: ''
  });

  const handleCreateReservation = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newRes.resourceName || !newRes.reservedBy || !selectedClientId) return;

      onAddReservation({
          id: `res-${Date.now()}`,
          clientId: selectedClientId,
          resourceName: newRes.resourceName,
          date: newRes.date!,
          startTime: newRes.startTime!,
          endTime: newRes.endTime!,
          reservedBy: newRes.reservedBy,
          status: 'Confirmed'
      });

      setNewRes({
        resourceName: 'Salão de Festas',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '12:00',
        endTime: '18:00',
        reservedBy: ''
      });
  };

  // --- MATERIAL REQUEST STATE ---
  const [newMaterialItem, setNewMaterialItem] = useState<{name: string, qty: number}>({ name: '', qty: 1 });
  const [pendingItems, setPendingItems] = useState<MaterialRequestItem[]>([]);
  const [materialNotes, setMaterialNotes] = useState('');

  const handleAddMaterialItem = () => {
      if (!newMaterialItem.name) return;
      setPendingItems([...pendingItems, {
          id: `mi-${Date.now()}`,
          itemName: newMaterialItem.name,
          quantity: newMaterialItem.qty,
          isDelivered: false
      }]);
      setNewMaterialItem({ name: '', qty: 1 });
  };

  const handleRemovePendingItem = (id: string) => {
      setPendingItems(prev => prev.filter(i => i.id !== id));
  };

  const handleSubmitMaterialRequest = () => {
      if (pendingItems.length === 0 || !selectedClientId) return;

      const newRequest: MaterialRequest = {
          id: `mat-${Date.now()}`,
          staffId: currentUser.id,
          clientId: selectedClientId,
          date: format(new Date(), 'yyyy-MM-dd'),
          items: pendingItems,
          status: 'Pending',
          notes: materialNotes
      };

      onAddMaterialRequest(newRequest);
      setPendingItems([]);
      setMaterialNotes('');
      alert('Solicitação enviada ao RH/Gestão!');
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Portal do Porteiro</h2>
                <p className="text-sm text-slate-500">Gestão de acesso e rotinas da portaria</p>
            </div>
        </div>

        {/* Location Selector & Help */}
        <div className="flex items-center gap-3 w-full md:w-auto">
            <button
                onClick={onShowHelp}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium mr-2"
                title="Ver Tutorial deste Módulo"
            >
                <HelpCircle size={18} />
                <span className="hidden md:inline">Tutorial</span>
            </button>

            <div className="w-full md:w-auto">
                {availableClients.length > 0 ? (
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 z-10" />
                        <select 
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            className="w-full md:w-64 pl-9 pr-8 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm font-bold text-blue-800 outline-none focus:ring-2 focus:ring-blue-300 appearance-none cursor-pointer hover:bg-blue-100 transition-colors"
                        >
                            {availableClients.length > 1 && <option value="">Selecione o local de trabalho...</option>}
                            {availableClients.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm border border-red-200">
                        <Trash2 size={16} /> Sem local atribuído
                    </div>
                )}
            </div>
        </div>
      </div>

      {!selectedClientId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F1F5F9]">
              <Building2 size={64} className="text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">Selecione um Local de Trabalho</h3>
              <p className="text-slate-500 max-w-md mt-2">
                  Para acessar o diário de bordo e outras funções, por favor selecione o condomínio ou posto onde você está atuando no momento.
              </p>
          </div>
      ) : (
        <>
            {/* Tabs */}
            <div className="bg-white border-b border-slate-200 px-6">
                <div className="flex gap-6 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('logs')}
                        className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
                            activeTab === 'logs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <ClipboardList size={18} /> Diário de Bordo
                    </button>
                    <button 
                        onClick={() => setActiveTab('guests')}
                        className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
                            activeTab === 'guests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Users size={18} /> Lista de Convidados
                    </button>
                    <button 
                        onClick={() => setActiveTab('reservations')}
                        className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
                            activeTab === 'reservations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Calendar size={18} /> Reservas
                    </button>
                    <button 
                        onClick={() => setActiveTab('materials')}
                        className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
                            activeTab === 'materials' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Package size={18} /> Materiais
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
                
                {/* TAB 1: LOGS */}
                {activeTab === 'logs' && (
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Register Form */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Plus size={18} className="text-blue-600"/> Novo Registro
                            </h3>
                            <form onSubmit={handleSaveLog} className="space-y-4">
                                {/* Form content same as before */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Tipo de Registro</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button type="button" 
                                            onClick={() => setNewLog({...newLog, type: 'Visitor'})}
                                            className={`py-2 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${newLog.type === 'Visitor' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                                        >
                                            <User size={16} /> Visita / Serviço
                                        </button>
                                        <button type="button" 
                                            onClick={() => setNewLog({...newLog, type: 'Mail'})}
                                            className={`py-2 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${newLog.type === 'Mail' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-600'}`}
                                        >
                                            <Box size={16} /> Correspondência
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">
                                        {newLog.type === 'Mail' ? 'Destinatário (Morador/Apto)' : 'Nome do Visitante/Prestador'}
                                    </label>
                                    <input 
                                        required type="text" className={darkInputClass}
                                        value={newLog.name} onChange={e => setNewLog({...newLog, name: e.target.value})}
                                        placeholder={newLog.type === 'Mail' ? 'Ex: Apto 101 - Maria' : 'Ex: José Silva (Técnico)'}
                                    />
                                </div>

                                {newLog.type === 'Visitor' && (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-700">Documento (RG/CPF)</label>
                                            <input 
                                                type="text" className={darkInputClass}
                                                value={newLog.document} onChange={e => setNewLog({...newLog, document: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-slate-700">Carro / Modelo</label>
                                                <input 
                                                    type="text" className={darkInputClass}
                                                    value={newLog.vehicleModel} onChange={e => setNewLog({...newLog, vehicleModel: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-slate-700">Placa</label>
                                                <input 
                                                    type="text" className={`${darkInputClass} uppercase`}
                                                    value={newLog.vehiclePlate} onChange={e => setNewLog({...newLog, vehiclePlate: e.target.value.toUpperCase()})}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Observações / Detalhes</label>
                                    <textarea 
                                        rows={2} className={darkInputClass}
                                        value={newLog.notes} onChange={e => setNewLog({...newLog, notes: e.target.value})}
                                        placeholder={newLog.type === 'Mail' ? 'Ex: Pacote Amazon' : 'Ex: Instalação Internet'}
                                    />
                                </div>

                                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                                    Registrar Entrada
                                </button>
                            </form>
                        </div>

                        {/* Logs List */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h3 className="font-bold text-slate-800">Registros Recentes - {availableClients.find(c => c.id === selectedClientId)?.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Filtrar dia:</span>
                                    <input 
                                        type="date" 
                                        className="text-sm border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100 text-slate-600 bg-white"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {filteredLogs.map(log => (
                                    <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
                                        <div className={`p-3 rounded-xl flex flex-col items-center justify-center w-16 text-xs font-bold
                                            ${log.type === 'Mail' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}
                                        `}>
                                            {format(parseISO(log.timestamp), 'HH:mm')}
                                            {log.type === 'Mail' ? <Box size={18} className="mt-1"/> : <User size={18} className="mt-1"/>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-800">{log.name}</h4>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{log.type === 'Mail' ? 'Correio' : 'Visita'}</span>
                                            </div>
                                            
                                            {log.type === 'Visitor' && (
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-600">
                                                    {log.document && <span>Doc: {log.document}</span>}
                                                    {log.vehicleModel && (
                                                        <span className="flex items-center gap-1">
                                                            <Car size={12} className="text-slate-400"/> {log.vehicleModel} 
                                                            {log.vehiclePlate && <span className="bg-slate-100 px-1.5 rounded text-xs border border-slate-200 font-mono ml-1">{log.vehiclePlate}</span>}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {log.notes && (
                                                <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded border border-slate-100 italic">
                                                    "{log.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {filteredLogs.length === 0 && (
                                    <div className="text-center py-10 text-slate-400">
                                        <ClipboardList size={40} className="mx-auto mb-2 opacity-20"/>
                                        <p>Nenhum registro encontrado para {format(parseISO(selectedDate), 'dd/MM/yyyy')}.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: GUEST LIST */}
                {activeTab === 'guests' && (
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Create Guest Link Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-blue-600 p-6 text-white">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Link size={24} /> Gerador de Lista de Convidados
                                </h3>
                                <p className="text-blue-100 mt-1">Crie um link para o morador cadastrar seus convidados diretamente.</p>
                            </div>
                            <div className="p-6">
                                {lastGeneratedLink ? (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-4 animate-in zoom-in duration-300">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                            <Check size={24} />
                                        </div>
                                        <h4 className="text-lg font-bold text-green-800">Link Gerado com Sucesso!</h4>
                                        <p className="text-sm text-green-700">Copie o link abaixo e envie para o morador:</p>
                                        
                                        <div className="flex items-center gap-2 bg-white p-2 rounded border border-green-200 max-w-md mx-auto">
                                            <input 
                                                readOnly 
                                                value={lastGeneratedLink} 
                                                className="flex-1 text-sm text-slate-600 outline-none bg-white"
                                            />
                                            <button 
                                                onClick={() => {navigator.clipboard.writeText(lastGeneratedLink); alert('Link copiado!')}}
                                                className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
                                            >
                                                Copiar
                                            </button>
                                        </div>

                                        <button 
                                            onClick={() => setLastGeneratedLink(null)}
                                            className="text-sm text-green-600 hover:underline mt-2"
                                        >
                                            Gerar outro link
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleCreateGuestList} className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="flex-1 w-full space-y-1.5">
                                            <label className="text-sm font-medium text-slate-700">Unidade / Morador</label>
                                            <input 
                                                required type="text" 
                                                placeholder="Ex: Apto 304 - Sra. Helena"
                                                className={darkInputClass}
                                                value={newGuestList.residentName} onChange={e => setNewGuestList({...newGuestList, residentName: e.target.value})}
                                            />
                                        </div>
                                        <div className="flex-1 w-full space-y-1.5">
                                            <label className="text-sm font-medium text-slate-700">Nome do Evento</label>
                                            <input 
                                                required type="text" 
                                                placeholder="Ex: Festa de Aniversário"
                                                className={darkInputClass}
                                                value={newGuestList.eventName} onChange={e => setNewGuestList({...newGuestList, eventName: e.target.value})}
                                            />
                                        </div>
                                        <div className="w-full md:w-40 space-y-1.5">
                                            <label className="text-sm font-medium text-slate-700">Data do Evento</label>
                                            <input 
                                                required type="date" 
                                                className={darkInputClass}
                                                value={newGuestList.date} onChange={e => setNewGuestList({...newGuestList, date: e.target.value})}
                                            />
                                        </div>
                                        <button type="submit" className="w-full md:w-auto bg-slate-900 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                                            Gerar Link
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Active Lists */}
                        <div>
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <ClipboardList size={20} /> Listas Ativas - {availableClients.find(c => c.id === selectedClientId)?.name}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredGuestLists.map(list => (
                                    <div key={list.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-lg text-slate-800">{list.eventName}</h4>
                                                <p className="text-sm text-blue-600 font-medium">{list.residentName}</p>
                                            </div>
                                            <div className="text-center bg-slate-50 px-3 py-1 rounded border border-slate-100">
                                                <span className="block text-xs text-slate-400 uppercase">Data</span>
                                                <span className="font-bold text-slate-700">{format(parseISO(list.date), 'dd/MM')}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-3 flex-1 flex flex-col">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center justify-between">
                                                Convidados Confirmados
                                                <span className="bg-white px-2 py-0.5 rounded border text-slate-700">{list.guests.length}</span>
                                            </p>
                                            <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 max-h-60">
                                                {list.guests.length === 0 ? (
                                                    <p className="text-xs text-slate-400 italic">Ainda sem convidados cadastrados.</p>
                                                ) : (
                                                    list.guests.map(g => (
                                                        <div 
                                                            key={g.id} 
                                                            onClick={() => handleToggleGuestArrival(list, g.id)}
                                                            className={`text-sm flex justify-between items-center bg-white px-3 py-2 rounded border transition-all cursor-pointer select-none group
                                                                ${g.arrived ? 'border-green-200 bg-green-50/50' : 'border-slate-200 hover:border-blue-300'}
                                                            `}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${g.arrived ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}>
                                                                    {g.arrived && <Check size={10} className="text-white" strokeWidth={4} />}
                                                                </div>
                                                                <div className={`flex flex-col ${g.arrived ? 'opacity-50' : ''}`}>
                                                                    <span className={`font-medium text-slate-700 leading-none ${g.arrived ? 'line-through text-slate-500' : ''}`}>
                                                                        {g.name}
                                                                        {g.isExtra && (
                                                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider no-underline">
                                                                                Extra
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">{g.document}</span>
                                                                </div>
                                                            </div>
                                                            {g.arrived && <span className="text-[10px] font-bold text-green-600">CHEGOU</span>}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        {/* Add Extra Guest Section */}
                                        {addingGuestToListId === list.id ? (
                                            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 animate-in slide-in-from-top-2">
                                                <p className="text-xs font-bold text-slate-600 mb-2">Adicionar Convidado Extra</p>
                                                <div className="space-y-2">
                                                    <input 
                                                        autoFocus
                                                        type="text" 
                                                        placeholder="Nome Completo"
                                                        className="w-full text-xs px-2 py-1.5 rounded border border-slate-300 outline-none focus:border-blue-500"
                                                        value={extraGuestName}
                                                        onChange={e => setExtraGuestName(e.target.value)}
                                                    />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Documento (RG/CPF)"
                                                        className="w-full text-xs px-2 py-1.5 rounded border border-slate-300 outline-none focus:border-blue-500"
                                                        value={extraGuestDoc}
                                                        onChange={e => setExtraGuestDoc(e.target.value)}
                                                    />
                                                    <div className="flex gap-2 pt-1">
                                                        <button 
                                                            onClick={() => { setAddingGuestToListId(null); setExtraGuestName(''); setExtraGuestDoc(''); }}
                                                            className="flex-1 text-xs bg-white border border-slate-300 text-slate-600 py-1.5 rounded hover:bg-slate-50"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAddExtraGuest(list)}
                                                            className="flex-1 text-xs bg-blue-600 text-white py-1.5 rounded font-medium hover:bg-blue-700"
                                                        >
                                                            Salvar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setAddingGuestToListId(list.id)}
                                                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-dashed border-slate-300 hover:border-slate-400 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                                            >
                                                <UserPlus size={14} /> Adicionar Convidado Extra
                                            </button>
                                        )}

                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                                            <button 
                                                onClick={() => {
                                                    const link = `${window.location.origin}?token=${list.linkToken}`;
                                                    navigator.clipboard.writeText(link);
                                                    alert('Link copiado!');
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            >
                                                <Link size={14} /> Copiar Link
                                            </button>
                                            
                                            {onDeleteGuestList && (
                                                <button 
                                                    onClick={() => {
                                                        if (window.confirm('Tem certeza que deseja excluir esta lista de convidados?')) {
                                                            onDeleteGuestList(list.id);
                                                        }
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir Lista"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {filteredGuestLists.length === 0 && (
                                    <div className="col-span-full text-center py-8 text-slate-400">
                                        <Users size={40} className="mx-auto mb-2 opacity-20"/>
                                        <p>Nenhum evento futuro cadastrado para este local.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: RESERVATIONS */}
                {activeTab === 'reservations' && (
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
                        
                        {/* Reservation Form */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-6">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Plus size={18} className="text-blue-600"/> Nova Reserva
                                </h3>
                                <form onSubmit={handleCreateReservation} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Área Comum</label>
                                        <select 
                                            className={darkInputClass}
                                            value={newRes.resourceName} onChange={e => setNewRes({...newRes, resourceName: e.target.value})}
                                        >
                                            <option value="Salão de Festas">Salão de Festas</option>
                                            <option value="Churrasqueira">Churrasqueira</option>
                                            <option value="Quadra Poliesportiva">Quadra Poliesportiva</option>
                                            <option value="Espaço Gourmet">Espaço Gourmet</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Morador / Unidade</label>
                                        <input 
                                            required type="text" 
                                            placeholder="Ex: Apto 101 - Sr. João"
                                            className={darkInputClass}
                                            value={newRes.reservedBy} onChange={e => setNewRes({...newRes, reservedBy: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Data</label>
                                        <input 
                                            required type="date" 
                                            className={darkInputClass}
                                            value={newRes.date} onChange={e => setNewRes({...newRes, date: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-700">Início</label>
                                            <input 
                                                required type="time" 
                                                className={darkInputClass}
                                                value={newRes.startTime} onChange={e => setNewRes({...newRes, startTime: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-700">Fim</label>
                                            <input 
                                                required type="time" 
                                                className={darkInputClass}
                                                value={newRes.endTime} onChange={e => setNewRes({...newRes, endTime: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                                        Confirmar Reserva
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Reservations List */}
                        <div className="flex-1 space-y-4">
                            <h3 className="font-bold text-slate-800 mb-2">Agenda de Reservas - {availableClients.find(c => c.id === selectedClientId)?.name}</h3>
                            {filteredReservations.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
                                    <Calendar size={48} className="mx-auto mb-2 opacity-20"/>
                                    <p>Nenhuma reserva encontrada para este local.</p>
                                </div>
                            ) : (
                                filteredReservations.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(res => (
                                    <div key={res.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
                                                <span className="text-xs uppercase font-bold">{format(parseISO(res.date), 'MMM', { locale: ptBR })}</span>
                                                <span className="text-xl font-bold">{format(parseISO(res.date), 'dd')}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{res.resourceName}</h4>
                                                <p className="text-sm text-blue-600 font-medium">{res.reservedBy}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <Clock size={12} /> {res.startTime} - {res.endTime}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border
                                                ${res.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                    res.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'}
                                            `}>
                                                {res.status === 'Confirmed' ? 'Confirmado' : res.status === 'Pending' ? 'Pendente' : 'Cancelado'}
                                            </span>
                                            {onDeleteReservation && (
                                                <button 
                                                    onClick={() => {
                                                        if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
                                                            onDeleteReservation(res.id);
                                                        }
                                                    }}
                                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    title="Excluir Reserva"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 4: MATERIALS */}
                {activeTab === 'materials' && (
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Request Form */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Package size={18} className="text-blue-600"/> Solicitar Material
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Adicionar Item</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Nome do Item" 
                                            className="flex-1 px-3 py-2 border border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-white placeholder-slate-400"
                                            value={newMaterialItem.name}
                                            onChange={e => setNewMaterialItem({...newMaterialItem, name: e.target.value})}
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Qtd" 
                                            className="w-20 px-3 py-2 border border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-white placeholder-slate-400"
                                            value={newMaterialItem.qty}
                                            onChange={e => setNewMaterialItem({...newMaterialItem, qty: parseInt(e.target.value) || 1})}
                                        />
                                        <button 
                                            onClick={handleAddMaterialItem}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                {pendingItems.length > 0 && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Itens da Solicitação</p>
                                        {pendingItems.map(item => (
                                            <div key={item.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-slate-100">
                                                <span>{item.quantity}x {item.itemName}</span>
                                                <button onClick={() => handleRemovePendingItem(item.id)} className="text-slate-400 hover:text-red-500">
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Observações</label>
                                    <textarea 
                                        rows={2} 
                                        className={darkInputClass}
                                        placeholder="Ex: Urgente para limpeza do hall"
                                        value={materialNotes}
                                        onChange={e => setMaterialNotes(e.target.value)}
                                    />
                                </div>

                                <button 
                                    onClick={handleSubmitMaterialRequest}
                                    disabled={pendingItems.length === 0}
                                    className={`w-full font-bold py-2.5 rounded-lg transition-colors shadow-sm
                                        ${pendingItems.length === 0 ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-slate-900 text-white hover:bg-slate-800'}
                                    `}
                                >
                                    Enviar Solicitação
                                </button>
                            </div>
                        </div>

                        {/* Request History */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-bold text-slate-800">Histórico de Solicitações</h3>
                            {filteredMaterialRequests.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">
                                    <Package size={40} className="mx-auto mb-2 opacity-20"/>
                                    <p>Nenhuma solicitação de material registrada.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredMaterialRequests.map(req => {
                                        const deliveredCount = req.items.filter(i => i.isDelivered).length;
                                        const totalCount = req.items.length;
                                        const isCompleted = req.status === 'Completed' || deliveredCount === totalCount;

                                        return (
                                            <div key={req.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border
                                                            ${isCompleted ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}
                                                        `}>
                                                            {isCompleted ? 'Concluído' : 'Pendente / Parcial'}
                                                        </span>
                                                        <p className="text-xs text-slate-400 mt-1">Solicitado em {format(parseISO(req.date), 'dd/MM/yyyy')}</p>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <div className="text-right">
                                                            <p className="text-xs font-bold text-slate-600">{deliveredCount}/{totalCount} Itens Entregues</p>
                                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                                <div className="h-full bg-blue-500 transition-all" style={{ width: `${(deliveredCount / totalCount) * 100}%` }}></div>
                                                            </div>
                                                        </div>
                                                        {onDeleteMaterialRequest && (
                                                            <button 
                                                                onClick={() => {
                                                                    if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
                                                                        onDeleteMaterialRequest(req.id);
                                                                    }
                                                                }}
                                                                className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                                title="Excluir Solicitação"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-1">
                                                    {req.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm">
                                                            <span className={item.isDelivered ? 'text-slate-400 line-through' : 'text-slate-700'}>
                                                                {item.quantity}x {item.itemName}
                                                            </span>
                                                            {item.isDelivered && <CheckCircle2 size={14} className="text-green-500" />}
                                                        </div>
                                                    ))}
                                                </div>
                                                {req.notes && <p className="text-xs text-slate-500 mt-2 italic">Note: {req.notes}</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
      )}
    </div>
  );
};

export default ConciergeView;
