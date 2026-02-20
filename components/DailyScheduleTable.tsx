
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
}

const DailyScheduleTable: React.FC<DailyScheduleTableProps> = ({
  currentDate,
  onDateChange,
  shifts,
  staff,
  clients,
  onAddShift,
  onUpdateShift,
  onDeleteShift
}) => {
  const dateKey = format(currentDate, 'yyyy-MM-dd');
  const [editingPostoId, setEditingPostoId] = useState<string | null>(null);

  // Filter shifts for the current day
  const dailyShifts = shifts.filter(s => s.date === dateKey);

  const handlePrevDay = () => onDateChange(subDays(currentDate, 1));
  const handleNextDay = () => onDateChange(addDays(currentDate, 1));

  const handleAddPosto = (clientId: string) => {
    // Creates a new Shift with empty staff but with a default Station name
    const newShift: Shift = {
      id: `sh-${Date.now()}`,
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
    // Check if val matches a staff ID
    const foundStaff = staff.find(s => s.id === val);
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
    if(window.confirm('Remover este turno?')) {
        onDeleteShift(shiftId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#EBEBEB] overflow-hidden">
      
      {/* Date Navigation Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
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

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
        {clients.length === 0 && (
           <div className="text-center text-slate-400 py-10">
              <Building2 size={48} className="mx-auto mb-2 opacity-20"/>
              <p>Nenhum condomínio cadastrado.</p>
           </div>
        )}

        {clients.map(client => {
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
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                       <Building2 size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800">{client.name}</h3>
                       <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin size={10} /> {client.address.city} - {client.address.district}
                       </p>
                    </div>
                 </div>
                 <button 
                    onClick={() => handleAddPosto(client.id)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                 >
                    <Plus size={14} /> Novo Posto
                 </button>
              </div>

              {/* Stations Grid */}
              <div className="divide-y divide-slate-100">
                {stations.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                       Nenhum posto/escala definido para hoje neste local.
                    </div>
                ) : (
                    stations.map(stationName => (
                        <div key={stationName} className="p-4 md:p-5">
                            <div className="flex flex-col md:flex-row gap-4">
                                
                                {/* Posto Name Column */}
                                <div className="md:w-1/4 min-w-[200px] flex-shrink-0">
                                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Posto</label>
                                   <div className="flex items-center gap-2">
                                      <input 
                                        type="text" 
                                        className="font-bold text-slate-700 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none transition-colors py-1"
                                        defaultValue={stationName}
                                        onBlur={(e) => {
                                           if (e.target.value !== stationName && e.target.value.trim() !== '') {
                                              handleUpdatePostoName(client.id, stationName, e.target.value);
                                           }
                                        }}
                                      />
                                   </div>
                                </div>

                                {/* Team Members Column */}
                                <div className="flex-1 overflow-x-auto">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Equipe</label>
                                    <div className="flex items-start gap-3 flex-wrap">
                                        {stationsMap.get(stationName)?.map((shift) => (
                                            <div key={shift.id} className="bg-slate-50 rounded-lg border border-slate-200 p-2 min-w-[200px] group relative hover:border-blue-200 transition-colors">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                                       <User size={16} />
                                                    </div>
                                                    <input 
                                                        list={`staff-list-${client.id}`}
                                                        type="text" 
                                                        placeholder="Buscar ou digitar nome..."
                                                        className="bg-transparent text-sm font-medium text-slate-800 w-full outline-none placeholder:text-slate-400"
                                                        defaultValue={shift.staffId ? staff.find(s => s.id === shift.staffId)?.name : shift.customStaffName || ''}
                                                        onBlur={(e) => handleUpdateShiftStaff(shift.id, e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 pl-1">
                                                    <Clock size={12} />
                                                    <input 
                                                       type="time" 
                                                       className="bg-transparent outline-none w-16"
                                                       defaultValue={shift.startTime}
                                                       onBlur={(e) => {
                                                          const updated = { ...shift, startTime: e.target.value };
                                                          onUpdateShift(updated);
                                                       }}
                                                    />
                                                    <span>-</span>
                                                    <input 
                                                       type="time" 
                                                       className="bg-transparent outline-none w-16"
                                                       defaultValue={shift.endTime}
                                                       onBlur={(e) => {
                                                          const updated = { ...shift, endTime: e.target.value };
                                                          onUpdateShift(updated);
                                                       }}
                                                    />
                                                </div>
                                                <button 
                                                  onClick={() => handleRemoveShift(shift.id)}
                                                  className="absolute top-1 right-1 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                   <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        
                                        {/* Add Member Button */}
                                        <button 
                                           onClick={() => handleAddStaffToPosto(client.id, stationName)}
                                           className="h-[74px] w-[60px] rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all gap-1"
                                        >
                                           <Plus size={20} />
                                           <span className="text-[9px] font-bold">ADD</span>
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
              <option key={s.id} value={s.id}>{s.name}</option> 
           ))}
        </datalist>
        {clients.map(c => (
             <datalist key={c.id} id={`staff-list-${c.id}`}>
                {staff.map(s => (
                   <option key={s.id} value={s.id}>{s.name}</option>
                ))}
             </datalist>
        ))}

      </div>
    </div>
  );
};

export default DailyScheduleTable;
