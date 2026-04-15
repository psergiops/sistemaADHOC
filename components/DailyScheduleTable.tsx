
import React, { useState } from 'react';
import { Shift, Staff, Client } from '../types';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ChevronLeft, ChevronRight, Plus, MapPin, 
  Trash2, User, Clock, Building2, Save 
} from 'lucide-react';

interface DailyScheduleTableProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  shifts: Shift[];
  staff: Staff[];
  clients: Client[];
  onAddShift: (shift: Shift) => void;
  onUpdateShift: (shift: Shift) => void;
  onDeleteShift: (id: string) => void;
  selectedClientId: string;
}

const DailyScheduleTable: React.FC<DailyScheduleTableProps> = ({
  currentDate,
  onDateChange,
  shifts,
  staff,
  clients,
  onAddShift,
  onUpdateShift,
  onDeleteShift,
  selectedClientId
}) => {
  const dateKey = format(currentDate, 'yyyy-MM-dd');
  const [editingPostoId, setEditingPostoId] = useState<string | null>(null);

  // Filter shifts for the current day
  const dailyShifts = shifts.filter(s => s.date === dateKey);

  // Filter clients based on global selection
  const filteredClients = selectedClientId === 'all' 
    ? clients 
    : clients.filter(c => c.id === selectedClientId);

  const handlePrevDay = () => onDateChange(subDays(currentDate, 1));
  const handleNextDay = () => onDateChange(addDays(currentDate, 1));

  const handleAddPosto = (clientId: string) => {
    // Creates a new Shift with empty staff but with a default Station name
    const newShift: Shift = {
      id: `temp-sh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      staffId: '',
      locationId: clientId,
      station: 'Novo Posto',
      date: dateKey,
      startTime: '06:00',
      endTime: '18:00',
      type: 'Day'
    };
    onAddShift(newShift);
    setEditingPostoId(newShift.id); // Focus on name edit
  };

  const handleUpdatePostoName = (clientId: string, oldStationName: string, newStationName: string) => {
    // Update ALL shifts on this day/client/station to new name
    const shiftsToUpdate = shifts.filter(s => 
        s.locationId === clientId && s.date === dateKey && s.station === oldStationName
    );
    
    shiftsToUpdate.forEach(s => {
        onUpdateShift({ ...s, station: newStationName });
    });
    setEditingPostoId(null);
  };

  const handleAddStaffToPosto = (clientId: string, stationName: string) => {
    const newShift: Shift = {
      id: `sh-${Date.now()}`,
      staffId: '',
      locationId: clientId,
      station: stationName,
      date: dateKey,
      startTime: '06:00',
      endTime: '18:00',
      type: 'Day'
    };
    onAddShift(newShift);
  };

  const handleUpdateShiftStaff = (shiftId: string, val: string) => {
    // Check if val matches a staff ID or Name
    const foundStaff = staff.find(s => s.id === val || s.name === val);
    const existingShift = shifts.find(s => s.id === shiftId);
    
    if (existingShift) {
        let updatedShift = { ...existingShift };
        if (foundStaff) {
            updatedShift = { ...updatedShift, staffId: foundStaff.id, customStaffName: undefined };
        } else {
            // If empty string, clear both
            if (!val.trim()) {
                updatedShift = { ...updatedShift, staffId: '', customStaffName: undefined };
            } else {
                // Else treat as custom name
                updatedShift = { ...updatedShift, staffId: '', customStaffName: val };
            }
        }
        onUpdateShift(updatedShift);
    }
  };

  const handleRemoveShift = (shiftId: string) => {
    console.log('[DEBUG] Tentando remover turno ID:', shiftId);
    if(window.confirm('Deseja remover este colaborador deste posto?')) {
        onDeleteShift(shiftId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#EBEBEB] overflow-hidden">
      
      {/* Date Navigation Header - Sticky */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0 sticky top-0 z-20 transition-all">
        <button onClick={handlePrevDay} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors">
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
        </div>

        <button onClick={handleNextDay} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Main Items List - Now expands naturally */}
      <div className="p-4 md:p-6 flex flex-col gap-4">
        {filteredClients.length === 0 && (
           <div className="text-center text-slate-400 py-10">
              <Building2 size={48} className="mx-auto mb-2 opacity-20"/>
              <p>Nenhum condomínio cadastrado.</p>
           </div>
        )}

        {filteredClients.map(client => {
          // Get all shifts for this client today
          const clientShifts = dailyShifts.filter(s => s.locationId === client.id);
          
          // Group by Station
          // Use a Map to preserve insertion order or unique keys
          const stationsMap = new Map<string, Shift[]>();
          
          clientShifts.forEach(s => {
             const stName = s.station || 'Sem Posto Definido';
             if (!stationsMap.has(stName)) {
                stationsMap.set(stName, []);
             }
             stationsMap.get(stName)?.push(s);
          });
          
          const stations = Array.from(stationsMap.keys());

          return (
            <div key={client.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              
              {/* Condominium Header */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                 <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                       <Building2 size={16} />
                    </div>
                    <div className="overflow-hidden">
                       <h3 className="font-bold text-sm text-slate-800 truncate" title={client.name}>{client.name}</h3>
                       <p className="text-[10px] text-slate-400 truncate">
                          {client.address.city}
                       </p>
                    </div>
                 </div>
                 <button 
                    onClick={() => handleAddPosto(client.id)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                    title="Novo Posto"
                 >
                    <Plus size={18} />
                 </button>
              </div>

              {/* Stations Grid */}
              {/* Stations List */}
              <div className="divide-y divide-slate-100">
                {stations.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                       Nenhum posto/escala definido para hoje neste local.
                    </div>
                ) : (
                    stations.map(stationName => (
                        <div key={stationName} className="p-4 border-b border-slate-100 last:border-0">
                            <div className="flex flex-col gap-3">
                                
                                {/* Posto Name */}
                                <div>
                                   <div className="flex items-center justify-between group/title mb-2">
                                      <input 
                                        type="text" 
                                        className="font-bold text-xs text-slate-500 uppercase tracking-wider bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none transition-colors py-0.5 w-full"
                                        defaultValue={stationName}
                                        onBlur={(e) => {
                                           if (e.target.value !== stationName && e.target.value.trim() !== '') {
                                              handleUpdatePostoName(client.id, stationName, e.target.value);
                                           }
                                        }}
                                      />
                                   </div>

                                    {/* Team Members Vertical List */}
                                    <div className="space-y-2">
                                        {stationsMap.get(stationName)?.map((shift) => {
                                            const staffMember = staff.find(s => s.id === shift.staffId || s.name === shift.staffId);
                                            return (
                                                <div key={shift.id} className="bg-white rounded-lg border border-slate-200 px-3 py-2 group relative hover:border-blue-200 transition-all flex items-center gap-3">
                                                    
                                                    {/* Avatar / Icon */}
                                                    <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden">
                                                       {staffMember?.avatar ? <img src={staffMember.avatar} className="w-full h-full object-cover" /> : <User size={12} />}
                                                    </div>

                                                    {/* Info Row: [NAME] [ROLE] */}
                                                    <div className="flex-1 min-w-0 flex items-center gap-4">
                                                       <input 
                                                          list="staff-list-global"
                                                          type="text" 
                                                          placeholder="Nome do colaborador..."
                                                          className="bg-transparent text-sm font-bold text-slate-800 w-full outline-none placeholder:text-slate-300 truncate"
                                                          defaultValue={shift.staffId ? (staff.find(s => s.id === shift.staffId || s.name === shift.staffId)?.name || shift.staffId) : (shift.customStaffName || '')}
                                                          onBlur={(e) => handleUpdateShiftStaff(shift.id, e.target.value)}
                                                       />
                                                       <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase flex-shrink-0 
                                                          ${staffMember?.role === 'Segurança' ? 'bg-indigo-100 text-indigo-700 font-bold' : 
                                                            staffMember?.role === 'Portaria' ? 'bg-teal-100 text-teal-700 font-bold' : 
                                                            'bg-slate-100 text-slate-600'}`}>
                                                          {staffMember?.role || 'POSTO'}
                                                       </span>
                                                    </div>

                                                    {/* Times */}
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex-shrink-0">
                                                        <Clock size={10} className="text-slate-300" />
                                                        <input 
                                                           type="time" 
                                                           className="bg-transparent outline-none w-10 text-center"
                                                           defaultValue={shift.startTime}
                                                           onBlur={(e) => onUpdateShift({ ...shift, startTime: e.target.value })}
                                                        />
                                                        <span className="text-slate-300">-</span>
                                                        <input 
                                                           type="time" 
                                                           className="bg-transparent outline-none w-10 text-center"
                                                           defaultValue={shift.endTime}
                                                           onBlur={(e) => onUpdateShift({ ...shift, endTime: e.target.value })}
                                                        />
                                                    </div>

                                                    {/* Trash Action */}
                                                    <button 
                                                      type="button"
                                                      onClick={(e) => {
                                                         e.stopPropagation();
                                                         handleRemoveShift(shift.id);
                                                      }}
                                                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all z-30 flex-shrink-0"
                                                      title="Remover Colaborador"
                                                    >
                                                       <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* Add Member Button Inline */}
                                        <button 
                                           onClick={() => handleAddStaffToPosto(client.id, stationName)}
                                           className="w-full py-2 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all gap-2 text-xs font-bold"
                                        >
                                           <Plus size={14} /> Adicionar Colaborador
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
              </div>
            </div>
          );
        })}

        {/* Datalist for Staff Autocomplete */}
        <datalist id="staff-list-global">
            {staff.map(s => (
               <option key={s.id} value={s.name}>{s.role}</option> 
            ))}
        </datalist>
        {clients.map(c => (
             <datalist key={c.id} id={`staff-list-${c.id}`}>
                {staff.map(s => (
                   <option key={s.id} value={s.name}>{s.role}</option>
                ))}
             </datalist>
        ))}

      </div>
    </div>
  );
};

export default DailyScheduleTable;
