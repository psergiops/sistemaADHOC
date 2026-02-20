
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Staff, Paystub, Announcement, DataChangeRequest, Shift, Client, MaterialRequest } from '../types';
import { 
  FileText, Megaphone, Upload, Download, User, 
  Bell, CheckCircle2, AlertCircle, FilePlus, Lock, Shield,
  FileSignature, Bus, Plus, Trash2, CalendarClock, MapPin, Clock, Eye, XCircle, Check, Menu, Package, CheckSquare, Square, HelpCircle
} from 'lucide-react';
import { format, parseISO, isBefore, startOfToday, isToday, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HRPortalViewProps {
  staff: Staff[];
  shifts: Shift[];
  clients: Client[];
  paystubs: Paystub[];
  announcements: Announcement[];
  changeRequests: DataChangeRequest[];
  materialRequests?: MaterialRequest[]; // Optional prop for backward compatibility if needed, but App.tsx passes it
  onAddPaystub: (paystub: Paystub) => void;
  onAddAnnouncement: (announcement: Announcement) => void;
  onRequestChange: (req: DataChangeRequest) => void;
  onManageRequest: (reqId: string, status: 'Approved' | 'Rejected', justification: string) => void;
  onUpdateStaff: (updatedStaff: Staff) => void;
  onUpdateMaterialRequest?: (req: MaterialRequest) => void;
  currentUser: Staff | any;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

interface VtLine {
  id: string;
  name: string;
  value: number;
}

const HRPortalView: React.FC<HRPortalViewProps> = ({ 
  staff, 
  shifts,
  clients,
  paystubs, 
  announcements,
  changeRequests,
  materialRequests = [],
  onAddPaystub, 
  onAddAnnouncement,
  onRequestChange,
  onManageRequest,
  onUpdateStaff,
  onUpdateMaterialRequest,
  currentUser,
  onToggleMenu,
  onShowHelp
}) => {
  
  // --- Simulation Logic ---
  // Real admin check
  const isRealAdmin = currentUser?.role === 'Diretoria' || currentUser?.id === 'admin-master';
  
  const [simulatedUserId, setSimulatedUserId] = useState<string>('');

  // The user effectively being displayed (either the real logged user or the simulated one)
  const effectiveUser = useMemo(() => {
    if (isRealAdmin && simulatedUserId) {
      return staff.find(s => s.id === simulatedUserId) || currentUser;
    }
    return currentUser;
  }, [currentUser, simulatedUserId, staff, isRealAdmin]);

  // Permissions based on the EFFECTIVE user
  const canManage = effectiveUser?.role === 'Diretoria' || effectiveUser?.role === 'Supervisor' || effectiveUser?.id === 'admin-master';
  
  // Default tab based on role
  const [activeTab, setActiveTab] = useState<'documents' | 'announcements' | 'requests' | 'management' | 'schedule'>('announcements');

  const roleTranslations: Record<string, string> = {
    'Security': 'Segurança',
    'Concierge': 'Porteiro',
    'Supervisor': 'Supervisor',
    'RH': 'RH',
    'Diretoria': 'Diretoria',
    'Administração': 'Administração'
  };

  // Reset tab when switching simulation
  useEffect(() => {
    // If simulating, default to schedule to see the user's view immediately
    if (simulatedUserId) {
        setActiveTab('schedule');
    } else if (canManage) {
        // If real manager/admin, default to dashboard/management
        setActiveTab('management');
    } else {
        // Regular staff
        setActiveTab('schedule');
    }
  }, [effectiveUser, canManage, simulatedUserId]);

  // --- HR Form States ---
  const [newPaystub, setNewPaystub] = useState<{staffId: string, month: string}>({ staffId: '', month: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newAnnouncement, setNewAnnouncement] = useState<{title: string, content: string, priority: 'Normal' | 'High'}>({ 
    title: '', content: '', priority: 'Normal' 
  });
  
  // --- Employee Change Request Form State ---
  const [reqType, setReqType] = useState<'Personal' | 'Address' | 'TransportVoucher'>('Personal');
  const [reqDescription, setReqDescription] = useState('');
  const [reqFormData, setReqFormData] = useState<any>({});
  const [reqAttachment, setReqAttachment] = useState<string | null>(null);

  // --- VT Specific State ---
  const [vtOutbound, setVtOutbound] = useState<VtLine[]>([{ id: '1', name: '', value: 0 }]);
  const [vtReturn, setVtReturn] = useState<VtLine[]>([{ id: '1', name: '', value: 0 }]);

  // --- HR Approval Modal State ---
  const [managingReqId, setManagingReqId] = useState<string | null>(null);
  const [justification, setJustification] = useState('');

  // --- Expiration Alert Logic ---
  const expiringContracts = useMemo(() => {
      if (!canManage) return [];
      const today = new Date();
      return staff.filter(s => {
          if ((s.contractType === 'Determined' || s.contractType === 'Temporary') && s.contractEndDate) {
              const days = differenceInDays(parseISO(s.contractEndDate), today);
              // Notify if expiring in next 10 days or already expired recently
              return days >= 0 && days <= 10;
          }
          return false;
      });
  }, [staff, canManage]);

  // Handlers for HR Actions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPaystub = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPaystub.staffId && newPaystub.month && selectedFile) {
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileUrl = event.target?.result as string;

        onAddPaystub({
          id: `pay-${Date.now()}`,
          staffId: newPaystub.staffId,
          referenceMonth: newPaystub.month,
          uploadDate: format(new Date(), 'yyyy-MM-dd'),
          url: fileUrl,
          fileName: selectedFile.name
        });
        
        alert('Holerite disponibilizado com sucesso!');
        setNewPaystub({ staffId: '', month: '' });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      
      reader.readAsDataURL(selectedFile);

    } else if (!selectedFile) {
      alert("Por favor, selecione um arquivo PDF.");
    }
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncement.title && newAnnouncement.content) {
      onAddAnnouncement({
        id: `ann-${Date.now()}`,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        priority: newAnnouncement.priority,
        date: format(new Date(), 'yyyy-MM-dd'),
        authorName: 'RH Diretoria'
      });
      alert('Comunicado publicado com sucesso!');
      setNewAnnouncement({ title: '', content: '', priority: 'Normal' });
    }
  };

  // --- VT Handlers ---
  const addLine = (type: 'outbound' | 'return') => {
    const newLine = { id: Date.now().toString(), name: '', value: 0 };
    if (type === 'outbound') setVtOutbound([...vtOutbound, newLine]);
    else setVtReturn([...vtReturn, newLine]);
  };

  const removeLine = (type: 'outbound' | 'return', id: string) => {
    if (type === 'outbound') setVtOutbound(vtOutbound.filter(l => l.id !== id));
    else setVtReturn(vtReturn.filter(l => l.id !== id));
  };

  const updateLine = (type: 'outbound' | 'return', id: string, field: 'name' | 'value', val: any) => {
    const updater = (prev: VtLine[]) => prev.map(l => l.id === id ? { ...l, [field]: val } : l);
    if (type === 'outbound') setVtOutbound(updater);
    else setVtReturn(updater);
  };

  const calculateTotalVT = () => {
    const totalOut = vtOutbound.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const totalRet = vtReturn.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    return totalOut + totalRet;
  };

  // Handler for Employee Request
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (canManage && !simulatedUserId) return; // Admins don't submit requests for themselves usually

    if ((reqType === 'Address' || reqType === 'TransportVoucher') && !reqAttachment) {
      alert("É obrigatório anexar comprovante de endereço para esta solicitação.");
      return;
    }

    let requestData = { ...reqFormData };

    // Pack VT data if applicable
    if (reqType === 'TransportVoucher') {
      requestData = {
        transportVoucher: {
          outbound: vtOutbound,
          return: vtReturn,
          totalDailyValue: calculateTotalVT()
        }
      };
    }

    const newRequest: DataChangeRequest = {
      id: `req-${Date.now()}`,
      staffId: effectiveUser.id,
      type: reqType,
      status: 'Pending',
      requestDate: format(new Date(), 'yyyy-MM-dd'),
      newData: requestData,
      description: reqDescription,
      attachmentUrl: reqAttachment || undefined
    };

    onRequestChange(newRequest);
    alert('Solicitação enviada com sucesso! Aguarde aprovação do RH.');
    setReqDescription('');
    setReqFormData({});
    setReqAttachment(null);
    // Reset VT
    setVtOutbound([{ id: '1', name: '', value: 0 }]);
    setVtReturn([{ id: '1', name: '', value: 0 }]);
  };

  const handleApproveReject = (status: 'Approved' | 'Rejected') => {
    if (!managingReqId) return;
    
    // If approved, update actual staff data locally (simulating backend)
    if (status === 'Approved') {
       const req = changeRequests.find(r => r.id === managingReqId);
       const targetStaff = staff.find(s => s.id === req?.staffId);
       
       if (req && targetStaff) {
         let updatedStaff = { ...targetStaff };
         
         if (req.type === 'Address') {
             updatedStaff.address = { ...updatedStaff.address, ...req.newData };
         } else if (req.type === 'Personal') {
             updatedStaff = { ...updatedStaff, ...req.newData };
         }
         
         onUpdateStaff(updatedStaff);
       }
    }

    onManageRequest(managingReqId, status, justification);
    setManagingReqId(null);
    setJustification('');
  };

  const handleToggleMaterialItem = (req: MaterialRequest, itemId: string) => {
      if (!onUpdateMaterialRequest) return;

      const updatedItems = req.items.map(item => 
          item.id === itemId ? { ...item, isDelivered: !item.isDelivered } : item
      );

      const allDelivered = updatedItems.every(i => i.isDelivered);
      const newStatus = allDelivered ? 'Completed' : 'Partial';

      onUpdateMaterialRequest({
          ...req,
          items: updatedItems,
          status: newStatus
      });
  };

  // Filters using EFFECTIVE user
  const myPaystubs = canManage && !simulatedUserId
    ? paystubs 
    : paystubs.filter(p => p.staffId === effectiveUser.id);

  const myRequests = canManage && !simulatedUserId
    ? [] 
    : changeRequests.filter(r => r.staffId === effectiveUser.id);
  
  const pendingRequests = changeRequests.filter(r => r.status === 'Pending');

  // Pending Material Requests for Management
  const pendingMaterials = materialRequests.filter(r => r.status !== 'Completed').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Logic for My Schedule (Uses Effective User)
  const myShifts = useMemo(() => {
    let userShifts = shifts.filter(s => s.staffId === effectiveUser?.id);
    
    // Sort Ascending (nearest future date first)
    userShifts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter: Only Today and Future
    userShifts = userShifts.filter(s => !isBefore(parseISO(s.date), startOfToday()));

    return userShifts;
  }, [shifts, effectiveUser]);

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] relative">
      
      {/* SIMULATION BAR (Admin Only) */}
      {isRealAdmin && (
        <div className="bg-amber-50 text-amber-900 px-6 py-2 flex items-center justify-between border-b border-amber-200">
           <div className="flex items-center gap-3">
              <Eye size={18} className="text-amber-600" />
              <span className="text-sm font-medium">Modo Desenvolvedor / Simulação:</span>
              <select 
                value={simulatedUserId} 
                onChange={(e) => setSimulatedUserId(e.target.value)}
                className="bg-white border border-amber-200 text-slate-700 text-sm rounded px-3 py-1 outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
              >
                 <option value="">Visualizar como Admin (Eu)</option>
                 {staff.map(s => (
                   <option key={s.id} value={s.id}>{s.name} - {roleTranslations[s.role] || s.role}</option>
                 ))}
              </select>
           </div>
           {simulatedUserId && (
             <button 
                onClick={() => setSimulatedUserId('')}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
             >
                <XCircle size={14} /> Encerrar Simulação
             </button>
           )}
        </div>
      )}

      {/* Header */}
      <div className={`px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 ${simulatedUserId ? 'bg-amber-50/50 border-amber-200' : 'bg-white'}`}>
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
            <div>
            <h2 className="text-xl font-bold text-slate-800">
                {simulatedUserId ? `Portal (Simulando: ${effectiveUser.name})` : 'Portal de Comunicação'}
            </h2>
            <p className="text-sm text-slate-500">Holerites, documentos e solicitações</p>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button
              onClick={onShowHelp}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium mr-4"
              title="Ver Tutorial deste Módulo"
           >
              <HelpCircle size={18} />
              <span className="hidden md:inline">Tutorial</span>
           </button>

           <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Shield size={14} className="text-slate-500"/>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Perfil: <span className="text-blue-600">{effectiveUser.name}</span>
              </span>
           </div>
        </div>
      </div>

      {/* Alerts Section (Contract Expiration) */}
      {canManage && expiringContracts.length > 0 && !simulatedUserId && (
        <div className="mx-6 mt-6 mb-0 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2">
            <div className="bg-red-100 p-2 rounded-full text-red-600">
               <AlertCircle size={20} />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-bold text-red-800">Atenção: Contratos Vencendo</h3>
                <p className="text-xs text-red-600 mb-2">Os seguintes colaboradores possuem contratos com término nos próximos 10 dias:</p>
                <div className="space-y-1">
                    {expiringContracts.map(s => (
                        <div key={s.id} className="text-sm text-red-700 flex justify-between items-center bg-white/60 p-2 rounded border border-red-100">
                            <span className="flex items-center gap-2">
                                <User size={14} />
                                <strong>{s.name}</strong> 
                                <span className="opacity-75">({roleTranslations[s.role] || s.role})</span>
                            </span>
                            <span className="text-xs font-bold bg-red-100 px-2 py-0.5 rounded text-red-700">
                                Vence em: {new Date(s.contractEndDate!).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 border-b border-slate-200 bg-white mt-4">
        <div className="flex gap-6 overflow-x-auto">
          {/* Schedule is now available for everyone (Staff, Supervisor, etc) */}
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'schedule' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <CalendarClock size={18} />
            Minha Escala
          </button>

          <button 
            onClick={() => setActiveTab('documents')}
            className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'documents' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={18} />
            {canManage ? 'Todos os Holerites' : 'Meus Holerites'}
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === 'documents' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                {myPaystubs.length}
            </span>
          </button>
          
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'announcements' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Megaphone size={18} />
            Comunicados
             <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === 'announcements' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                {announcements.length}
            </span>
          </button>
            
          <button 
             onClick={() => setActiveTab('requests')}
             className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
               activeTab === 'requests' 
                 ? 'border-blue-600 text-blue-600' 
                 : 'border-transparent text-slate-500 hover:text-slate-700'
             }`}
           >
             <FileSignature size={18} />
             {canManage ? 'Solicitações Pendentes' : 'Solicitar Alteração'}
             {canManage && pendingRequests.length > 0 && (
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold">
                    {pendingRequests.length}
                </span>
             )}
           </button>

          {canManage && (
            <button 
              onClick={() => setActiveTab('management')}
              className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'management' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Upload size={18} />
              Gestão RH & Materiais
              {pendingMaterials.length > 0 && (
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                    {pendingMaterials.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">

        {/* MY SCHEDULE VIEW */}
        {activeTab === 'schedule' && (
          // ... (Schedule content same as before)
          <div className="max-w-4xl mx-auto space-y-6">
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3 flex-1 w-full">
                 <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                   <CalendarClock size={16} />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-blue-900">Resumo da Escala</h3>
                   <p className="text-sm text-blue-700 mt-1">
                     Acompanhe abaixo os seus próximos turnos agendados.
                   </p>
                 </div>
             </div>

              {myShifts.length === 0 ? (
                 <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
                    <CalendarClock size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">Nenhuma escala encontrada</p>
                    <p className="text-sm">
                        Você não possui turnos futuros agendados.
                    </p>
                 </div>
              ) : (
                <div className="grid gap-4">
                  {myShifts.map((shift, idx) => {
                     const clientName = clients.find(c => c.id === shift.locationId)?.name || 'Local não identificado';
                     const shiftDate = parseISO(shift.date);
                     const isTodayDate = isToday(shiftDate);
                     const isPast = isBefore(shiftDate, startOfToday());
                     
                     return (
                        <div key={shift.id} className={`
                          bg-white p-5 rounded-xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all
                          ${isTodayDate ? 'border-blue-400 ring-1 ring-blue-100' : isPast ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200'}
                        `}>
                            <div className="flex items-center gap-4">
                                <div className={`
                                  flex flex-col items-center justify-center w-16 h-16 rounded-xl border
                                  ${isTodayDate ? 'bg-blue-600 text-white border-blue-600' : isPast ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-slate-50 text-slate-600 border-slate-200'}
                                `}>
                                    <span className="text-xs font-medium uppercase">{format(shiftDate, 'MMM', { locale: ptBR })}</span>
                                    <span className="text-2xl font-bold">{format(shiftDate, 'dd')}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                       <h4 className={`font-bold text-lg ${isPast ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{clientName}</h4>
                                       {isTodayDate && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">HOJE</span>}
                                       {isPast && <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={8}/> CONCLUÍDO</span>}
                                       {!isPast && !isTodayDate && <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">AGENDADO</span>}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                       <div className="flex items-center gap-1.5">
                                          <MapPin size={14} />
                                          <span>Local de Trabalho</span>
                                       </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 w-full md:w-auto pl-20 md:pl-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                                <div className="flex flex-col md:items-end">
                                   <div className={`flex items-center gap-2 font-semibold text-lg ${isPast ? 'text-slate-400' : 'text-slate-800'}`}>
                                      <Clock size={18} className={isPast ? 'text-slate-300' : 'text-slate-400'} />
                                      {shift.startTime} - {shift.endTime}
                                   </div>
                                   <span className={`text-xs font-medium px-2 py-0.5 rounded mt-1 w-fit
                                     ${shift.type === 'Night' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}
                                     ${isPast ? 'opacity-50 grayscale' : ''}
                                   `}>
                                      {shift.type === 'Night' ? 'Plantão Noturno' : 'Plantão Diurno'}
                                   </span>
                                </div>
                            </div>
                        </div>
                     );
                  })}
                </div>
              )}
          </div>
        )}
        
        {/* DOCUMENTS VIEW */}
        {activeTab === 'documents' && (
          // ... (Documents content same as before)
          <div className="space-y-6">
            {!canManage && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                 <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                   <User size={16} />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-blue-900">Olá, {effectiveUser.name}</h3>
                   <p className="text-sm text-blue-700 mt-1">
                     Abaixo você encontra seus demonstrativos de pagamento. Estes documentos são confidenciais e visíveis apenas para você.
                   </p>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {myPaystubs.length === 0 ? (
                 <div className="col-span-full text-center py-10 text-slate-400">
                    <FileText size={48} className="mx-auto mb-3 opacity-20" />
                    <p>Nenhum documento encontrado para este perfil.</p>
                 </div>
               ) : (
                 myPaystubs.map(stub => {
                   const owner = staff.find(s => s.id === stub.staffId);
                   return (
                    <div key={stub.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{stub.fileName}</p>
                          <p className="text-xs text-slate-500">
                            Ref: {stub.referenceMonth} • {new Date(stub.uploadDate).toLocaleDateString()}
                          </p>
                          {owner && (canManage || simulatedUserId) && (
                            <p className="text-xs font-bold text-blue-600 mt-1 flex items-center gap-1">
                                <User size={10} />
                                {owner.name}
                            </p>
                          )}
                          {!canManage && (
                             <div className="flex items-center gap-1 mt-1 text-[10px] text-green-700 font-medium bg-green-50 w-fit px-1.5 py-0.5 rounded border border-green-100">
                                <Lock size={10} />
                                <span>Privado & Seguro</span>
                             </div>
                          )}
                        </div>
                      </div>
                      <a 
                        href={stub.url} 
                        download={stub.fileName}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" 
                        title="Baixar"
                      >
                        <Download size={20} />
                      </a>
                    </div>
                   );
                 })
               )}
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS VIEW */}
        {activeTab === 'announcements' && (
          // ... (Announcements content same as before)
          <div className="max-w-4xl mx-auto space-y-6">
            {announcements.map(ann => (
              <div key={ann.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${ann.priority === 'High' ? 'border-orange-200' : 'border-slate-200'}`}>
                {ann.priority === 'High' && (
                   <div className="bg-orange-50 px-4 py-1.5 border-b border-orange-100 flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-wide">
                      <AlertCircle size={14} /> Importante
                   </div>
                )}
                <div className="p-6">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{ann.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Publicado em {new Date(ann.date).toLocaleDateString()} por <span className="font-medium text-slate-700">{ann.authorName}</span>
                        </p>
                      </div>
                      <div className="bg-slate-100 p-2 rounded-full text-slate-500">
                        <Megaphone size={20} />
                      </div>
                   </div>
                   <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                     {ann.content}
                   </p>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
               <div className="text-center py-10 text-slate-400">
                  <Bell size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Nenhum comunicado recente.</p>
               </div>
            )}
          </div>
        )}

        {/* REQUESTS VIEW (Employee: Create / HR: Manage) */}
        {activeTab === 'requests' && (
           <div className="max-w-5xl mx-auto">
             
             {/* Employee View: Form & History */}
             {!canManage && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/* Create Request Form (Same as before) */}
                   <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                       <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                           <FileSignature size={20} className="text-blue-600"/>
                           Nova Solicitação de Alteração
                       </h3>
                       <form onSubmit={handleSubmitRequest} className="space-y-4">
                          <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-700">Tipo de Solicitação</label>
                              <div className="flex gap-2">
                                  {['Personal', 'Address', 'TransportVoucher'].map(t => (
                                      <button 
                                        key={t} type="button" 
                                        onClick={() => { setReqType(t as any); setReqFormData({}); }}
                                        className={`px-3 py-2 text-sm rounded border ${reqType === t ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-slate-200 text-slate-600'}`}
                                      >
                                          {t === 'Personal' ? 'Dados Pessoais' : t === 'Address' ? 'Endereço' : 'Vale Transporte'}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          {/* Dynamic Fields based on Type */}
                          {reqType === 'Personal' && (
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                      <label className="text-xs text-slate-500">Novo Telefone</label>
                                      <input type="text" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" placeholder="(00) 00000-0000"
                                         onChange={e => setReqFormData({...reqFormData, phone: e.target.value})}
                                      />
                                  </div>
                                   <div className="space-y-1">
                                      <label className="text-xs text-slate-500">Novo Email</label>
                                      <input type="email" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" placeholder="email@exemplo.com"
                                         onChange={e => setReqFormData({...reqFormData, email: e.target.value})}
                                      />
                                  </div>
                              </div>
                          )}

                          {reqType === 'Address' && (
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="col-span-2 space-y-1">
                                      <label className="text-xs text-slate-500">CEP</label>
                                      <input type="text" className="w-32 border p-2 rounded text-sm outline-none focus:border-blue-500" placeholder="00000-000"
                                          onChange={e => setReqFormData({...reqFormData, zipCode: e.target.value})}
                                      />
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                      <label className="text-xs text-slate-500">Rua / Logradouro</label>
                                      <input type="text" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500"
                                         onChange={e => setReqFormData({...reqFormData, street: e.target.value})}
                                      />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-xs text-slate-500">Número</label>
                                      <input type="text" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500"
                                          onChange={e => setReqFormData({...reqFormData, number: e.target.value})}
                                      />
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-xs text-slate-500">Bairro</label>
                                      <input type="text" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500"
                                          onChange={e => setReqFormData({...reqFormData, district: e.target.value})}
                                      />
                                  </div>
                              </div>
                          )}

                          {/* Transport Voucher Special Logic */}
                          {reqType === 'TransportVoucher' && (
                              <div className="space-y-6">
                                  
                                  {/* Outbound Lines */}
                                  <div className="space-y-2">
                                     <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Linhas de Ida</label>
                                        <button type="button" onClick={() => addLine('outbound')} className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline">
                                           <Plus size={12}/> Adicionar Linha
                                        </button>
                                     </div>
                                     <div className="space-y-2">
                                        {vtOutbound.map((line, idx) => (
                                          <div key={line.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
                                             <div className="flex-1 relative">
                                                <Bus size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                                                <input 
                                                  type="text" 
                                                  placeholder="Ex: Metrô, Linha 123..."
                                                  className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                                                  value={line.name}
                                                  onChange={(e) => updateLine('outbound', line.id, 'name', e.target.value)}
                                                />
                                             </div>
                                             <div className="w-24 relative">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">R$</span>
                                                <input 
                                                  type="number" step="0.01"
                                                  placeholder="0,00"
                                                  className="w-full pl-7 pr-2 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                                                  value={line.value}
                                                  onChange={(e) => updateLine('outbound', line.id, 'value', e.target.value)}
                                                />
                                             </div>
                                             {vtOutbound.length > 1 && (
                                               <button type="button" onClick={() => removeLine('outbound', line.id)} className="p-2 text-slate-400 hover:text-red-500">
                                                  <Trash2 size={16}/>
                                               </button>
                                             )}
                                          </div>
                                        ))}
                                     </div>
                                  </div>

                                  {/* Return Lines */}
                                  <div className="space-y-2">
                                     <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Linhas de Volta</label>
                                        <button type="button" onClick={() => addLine('return')} className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline">
                                           <Plus size={12}/> Adicionar Linha
                                        </button>
                                     </div>
                                     <div className="space-y-2">
                                        {vtReturn.map((line, idx) => (
                                          <div key={line.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
                                             <div className="flex-1 relative">
                                                <Bus size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                                                <input 
                                                  type="text" 
                                                  placeholder="Ex: Metrô, Linha 321..."
                                                  className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                                                  value={line.name}
                                                  onChange={(e) => updateLine('return', line.id, 'name', e.target.value)}
                                                />
                                             </div>
                                             <div className="w-24 relative">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">R$</span>
                                                <input 
                                                  type="number" step="0.01"
                                                  placeholder="0,00"
                                                  className="w-full pl-7 pr-2 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                                                  value={line.value}
                                                  onChange={(e) => updateLine('return', line.id, 'value', e.target.value)}
                                                />
                                             </div>
                                             {vtReturn.length > 1 && (
                                               <button type="button" onClick={() => removeLine('return', line.id)} className="p-2 text-slate-400 hover:text-red-500">
                                                  <Trash2 size={16}/>
                                               </button>
                                             )}
                                          </div>
                                        ))}
                                     </div>
                                  </div>

                                  {/* Total Summary */}
                                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                                     <span className="text-sm font-medium text-slate-700">Total Diário (Ida + Volta)</span>
                                     <span className="text-lg font-bold text-blue-600">
                                       {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotalVT())}
                                     </span>
                                  </div>

                              </div>
                          )}

                          {/* Common Attachment for Address or VT */}
                          {(reqType === 'Address' || reqType === 'TransportVoucher') && (
                              <div className="col-span-2 bg-orange-50 border border-orange-100 p-3 rounded-lg flex items-start gap-3 mt-4">
                                  <Upload size={16} className="text-orange-500 mt-1"/>
                                  <div className="flex-1">
                                      <p className="text-sm font-medium text-slate-800">Comprovante de Endereço Obrigatório</p>
                                      <p className="text-xs text-slate-500 mb-2">Para alterações de endereço ou VT, anexe uma conta de luz ou água recente.</p>
                                      <div className="flex items-center gap-2">
                                          <button type="button" onClick={() => setReqAttachment('#mock-file')} className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium hover:bg-slate-50">
                                              Escolher Arquivo...
                                          </button>
                                          {reqAttachment && <span className="text-xs text-green-600 font-medium">Arquivo anexado!</span>}
                                      </div>
                                  </div>
                              </div>
                          )}

                          <div className="space-y-1">
                              <label className="text-sm font-medium text-slate-700">Justificativa / Observações</label>
                              <textarea className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" rows={3}
                                  placeholder="Explique o motivo da alteração..."
                                  value={reqDescription} onChange={e => setReqDescription(e.target.value)}
                              ></textarea>
                          </div>

                          <div className="pt-2">
                              <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">
                                  Enviar Solicitação
                              </button>
                          </div>
                       </form>
                   </div>

                   {/* Request History */}
                   <div className="space-y-4">
                       <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Histórico</h3>
                       {myRequests.length === 0 ? (
                           <p className="text-sm text-slate-400 italic">Nenhuma solicitação anterior.</p>
                       ) : (
                           myRequests.map(req => (
                               <div key={req.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                   <div className="flex justify-between items-start mb-2">
                                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                                           ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                             req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}
                                       `}>{req.status === 'Pending' ? 'Pendente' : req.status === 'Approved' ? 'Aprovado' : 'Reprovado'}</span>
                                       <span className="text-xs text-slate-400">{new Date(req.requestDate).toLocaleDateString()}</span>
                                   </div>
                                   <p className="font-semibold text-slate-800 text-sm">
                                       {req.type === 'Personal' ? 'Dados Pessoais' : req.type === 'Address' ? 'Endereço' : 'Vale Transporte'}
                                   </p>
                                   <p className="text-xs text-slate-500 mt-1 line-clamp-2">{req.description}</p>
                                   {req.hrJustification && (
                                       <div className="mt-2 pt-2 border-t border-slate-100">
                                           <p className="text-[10px] text-slate-400 font-bold uppercase">Resposta RH:</p>
                                           <p className="text-xs text-slate-600 italic">{req.hrJustification}</p>
                                       </div>
                                   )}
                               </div>
                           ))
                       )}
                   </div>
                </div>
             )}

             {/* HR View: Approval Queue */}
             {canManage && (
                 <div className="space-y-6">
                     <div className="flex items-center justify-between">
                         <h3 className="text-lg font-bold text-slate-800">Fila de Aprovação (Dados Cadastrais)</h3>
                         <span className="text-xs font-medium text-slate-500">Mostrando pendentes e histórico recente</span>
                     </div>

                     {changeRequests.length === 0 ? (
                         <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
                             <CheckCircle2 size={40} className="mx-auto mb-3 opacity-20"/>
                             <p>Tudo certo! Nenhuma solicitação pendente.</p>
                         </div>
                     ) : (
                         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                             <table className="w-full text-sm text-left">
                                 <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                     <tr>
                                         <th className="px-6 py-3">Data</th>
                                         <th className="px-6 py-3">Colaborador</th>
                                         <th className="px-6 py-3">Tipo</th>
                                         <th className="px-6 py-3">Detalhes</th>
                                         <th className="px-6 py-3 text-center">Anexo</th>
                                         <th className="px-6 py-3 text-center">Status/Ação</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                     {changeRequests.map(req => {
                                         const requester = staff.find(s => s.id === req.staffId);
                                         
                                         // Custom formatter for details column
                                         let detailsContent = null;
                                         if (req.type === 'TransportVoucher' && (req.newData as any).transportVoucher) {
                                            const tv = (req.newData as any).transportVoucher;
                                            detailsContent = (
                                                <div className="text-xs text-slate-600">
                                                    <div className="flex gap-2">
                                                        <span className="font-semibold">Ida:</span> {tv.outbound?.length} linhas
                                                        <span className="font-semibold ml-2">Volta:</span> {tv.return?.length} linhas
                                                    </div>
                                                    <div className="font-bold text-blue-600 mt-0.5">
                                                        Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tv.totalDailyValue)}/dia
                                                    </div>
                                                </div>
                                            );
                                         } else {
                                            detailsContent = (
                                                <>
                                                    <p className="text-xs text-slate-600 truncate" title={req.description}>{req.description}</p>
                                                    <div className="text-[10px] text-slate-400 mt-1">
                                                        {Object.keys(req.newData).map(k => k).join(', ')}
                                                    </div>
                                                </>
                                            );
                                         }

                                         return (
                                             <tr key={req.id} className="hover:bg-slate-50">
                                                 <td className="px-6 py-3 text-slate-500">{new Date(req.requestDate).toLocaleDateString()}</td>
                                                 <td className="px-6 py-3 font-medium text-slate-800">
                                                     {requester?.name || 'Unknown'}
                                                     <div className="text-xs text-slate-400 font-normal">{requester ? (roleTranslations[requester.role] || requester.role) : ''}</div>
                                                 </td>
                                                 <td className="px-6 py-3">
                                                     <span className={`px-2 py-0.5 rounded text-xs border
                                                        ${req.type === 'Address' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                                                          req.type === 'TransportVoucher' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                                                          'bg-blue-50 border-blue-100 text-blue-700'}
                                                     `}>
                                                         {req.type === 'Personal' ? 'Pessoal' : req.type === 'Address' ? 'Endereço' : 'VT'}
                                                     </span>
                                                 </td>
                                                 <td className="px-6 py-3 max-w-xs">
                                                     {detailsContent}
                                                 </td>
                                                 <td className="px-6 py-3 text-center">
                                                     {req.attachmentUrl ? (
                                                         <button className="text-blue-600 hover:text-blue-800" title="Ver Comprovante"><FileText size={16} /></button>
                                                     ) : (
                                                         <span className="text-slate-300">-</span>
                                                     )}
                                                 </td>
                                                 <td className="px-6 py-3 text-center">
                                                     {req.status === 'Pending' ? (
                                                         <button 
                                                            onClick={() => setManagingReqId(req.id)}
                                                            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                                         >
                                                             Avaliar
                                                         </button>
                                                     ) : (
                                                         <span className={`text-xs font-bold ${req.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                                                             {req.status === 'Approved' ? 'Aprovado' : 'Reprovado'}
                                                         </span>
                                                     )}
                                                 </td>
                                             </tr>
                                         );
                                     })}
                                 </tbody>
                             </table>
                         </div>
                     )}
                 </div>
             )}
           </div>
        )}

        {/* MANAGEMENT VIEW (HR ONLY - Other Actions) */}
        {activeTab === 'management' && canManage && (
          <div className="space-y-8">
            
            {/* Material Requests Fulfillment (New Section) */}
            <div>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" /> Controle de Materiais Pendentes
               </h3>
               {pendingMaterials.length === 0 ? (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-400">
                      <CheckCircle2 size={32} className="mx-auto mb-2 opacity-20"/>
                      <p className="text-sm">Nenhuma solicitação de material pendente.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {pendingMaterials.map(req => {
                          const requester = staff.find(s => s.id === req.staffId);
                          const client = clients.find(c => c.id === req.clientId);
                          
                          return (
                              <div key={req.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-start">
                                      <div>
                                          <h4 className="font-bold text-slate-800 text-sm">{client?.name}</h4>
                                          <p className="text-xs text-slate-500">Solicitado por {requester?.name} em {format(parseISO(req.date), 'dd/MM/yyyy')}</p>
                                      </div>
                                      <div className="text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-700">
                                          Pendente
                                      </div>
                                  </div>
                                  <div className="p-4 space-y-2">
                                      {req.items.map(item => (
                                          <div key={item.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                                              <span className={`text-sm ${item.isDelivered ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                                                  {item.quantity}x {item.itemName}
                                              </span>
                                              <button 
                                                  onClick={() => handleToggleMaterialItem(req, item.id)}
                                                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold transition-all
                                                      ${item.isDelivered 
                                                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                          : 'bg-white border border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600'}
                                                  `}
                                              >
                                                  {item.isDelivered ? <CheckSquare size={14}/> : <Square size={14}/>}
                                                  {item.isDelivered ? 'Entregue' : 'Marcar'}
                                              </button>
                                          </div>
                                      ))}
                                      {req.notes && (
                                          <div className="mt-3 text-xs text-slate-500 italic border-t border-slate-100 pt-2">
                                              Obs: "{req.notes}"
                                          </div>
                                      )}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
               )}
            </div>

            <div className="border-t border-slate-200"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Paystub Upload Form (Existing) */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <FilePlus size={20} className="text-blue-600" />
                  Disponibilizar Holerite
                </h3>
                <form onSubmit={handleUploadPaystub} className="space-y-4">
                  <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Colaborador</label>
                      <div className="relative">
                        <select 
                          required
                          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          value={newPaystub.staffId}
                          onChange={e => setNewPaystub({...newPaystub, staffId: e.target.value})}
                        >
                          <option value="">Selecione...</option>
                          {staff.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({roleTranslations[s.role] || s.role})</option>
                          ))}
                        </select>
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                  </div>
                  
                  <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Mês de Referência</label>
                      <input 
                        required
                        type="month" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                        value={newPaystub.month}
                        onChange={e => setNewPaystub({...newPaystub, month: e.target.value})}
                      />
                  </div>

                  <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Arquivo (PDF)</label>
                      <div 
                        className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={24} className="mb-2" />
                        <span className="text-xs">{selectedFile ? selectedFile.name : 'Clique para selecionar o arquivo'}</span>
                        <input 
                          type="file" 
                          accept="application/pdf"
                          className="hidden" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                      </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors shadow-sm">
                    Enviar Holerite
                  </button>
                </form>
              </div>

              {/* Announcement Form (Existing) */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <Megaphone size={20} className="text-orange-600" />
                  Novo Comunicado
                </h3>
                <form onSubmit={handlePostAnnouncement} className="space-y-4">
                  <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Título</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                        placeholder="Ex: Novo Benefício..."
                        value={newAnnouncement.title}
                        onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      />
                  </div>
                  
                  <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Prioridade</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="priority" 
                            checked={newAnnouncement.priority === 'Normal'}
                            onChange={() => setNewAnnouncement({...newAnnouncement, priority: 'Normal'})}
                          />
                          <span className="text-sm">Normal</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="priority"
                            checked={newAnnouncement.priority === 'High'}
                            onChange={() => setNewAnnouncement({...newAnnouncement, priority: 'High'})}
                          />
                          <span className="text-sm font-medium text-orange-600">Alta Importância</span>
                        </label>
                      </div>
                  </div>

                  <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Conteúdo</label>
                      <textarea 
                        required
                        rows={5}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-slate-700"
                        placeholder="Digite a mensagem para todos os colaboradores..."
                        value={newAnnouncement.content}
                        onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      />
                  </div>

                  <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-lg transition-colors shadow-sm">
                    Publicar Comunicado
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HR Justification Modal */}
      {managingReqId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in fade-in duration-200">
               <h3 className="text-lg font-bold text-slate-800 mb-2">Avaliar Solicitação</h3>
               <p className="text-sm text-slate-500 mb-4">Insira uma justificativa para aprovar ou reprovar.</p>
               
               <textarea 
                  autoFocus
                  className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-white text-slate-700" 
                  rows={3}
                  placeholder="Justificativa (obrigatória para reprovação)..."
                  value={justification}
                  onChange={e => setJustification(e.target.value)}
               />
               
               <div className="flex justify-end gap-2">
                   <button 
                      onClick={() => { setManagingReqId(null); setJustification(''); }}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                   >
                       Cancelar
                   </button>
                   <button 
                      onClick={() => handleApproveReject('Rejected')}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100"
                   >
                       Reprovar
                   </button>
                   <button 
                      onClick={() => handleApproveReject('Approved')}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm"
                   >
                       Aprovar
                   </button>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HRPortalView;
