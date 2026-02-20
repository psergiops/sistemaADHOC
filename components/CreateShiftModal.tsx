import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, User, Repeat, Trash2, Building2 } from 'lucide-react';
import { Staff, Client, Shift } from '../types';
import { format, addMonths, eachDayOfInterval, getDay, parseISO } from 'date-fns';

interface CreateShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shifts: Shift[]) => void;
  onDelete?: (shiftId: string) => void;
  staffList: Staff[];
  clientList: Client[];
  initialDate: Date;
  initialClientId?: string;
  shiftToEdit?: Shift | null; // If provided, we are in Edit mode
}

const CreateShiftModal: React.FC<CreateShiftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  staffList,
  clientList,
  initialDate,
  initialClientId,
  shiftToEdit
}) => {
  // Common Fields
  const [clientId, setClientId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');

  // Recurrence & Date Fields
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  
  // 0 = Sun, 1 = Mon, ... 6 = Sat
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (shiftToEdit) {
        // Edit Mode: Single shift edit typically
        setClientId(shiftToEdit.locationId);
        setStaffId(shiftToEdit.staffId);
        setStartDate(shiftToEdit.date);
        setEndDate(shiftToEdit.date);
        setStartTime(shiftToEdit.startTime);
        setEndTime(shiftToEdit.endTime);
        setIsRecurring(false);
        setIsIndeterminate(false);
        setSelectedDays([]);
      } else {
        // Create Mode
        const dateStr = format(initialDate, 'yyyy-MM-dd');
        setClientId(initialClientId || (clientList.length > 0 ? clientList[0].id : ''));
        setStaffId(staffList.length > 0 ? staffList[0].id : '');
        setStartDate(dateStr);
        setEndDate(dateStr);
        setStartTime('08:00');
        setEndTime('18:00');
        setIsRecurring(false);
        setIsIndeterminate(false);
        // Default select the day of the week of initialDate
        setSelectedDays([getDay(initialDate)]);
      }
    }
  }, [isOpen, initialDate, initialClientId, staffList, clientList, shiftToEdit]);

  if (!isOpen) return null;

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(prev => prev.filter(d => d !== dayIndex));
    } else {
      setSelectedDays(prev => [...prev, dayIndex]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId || !clientId || !startDate || !startTime || !endTime) return;

    // Determine Shifts to Create
    const newShifts: Shift[] = [];
    const recurrenceGroupId = isRecurring ? `group-${Date.now()}` : undefined;

    // Logic:
    // 1. If Editing, we just return one shift with the ID of the edited shift
    // 2. If Creating (Recurring), we generate multiple
    // 3. If Creating (Single), we generate one

    if (shiftToEdit) {
      const type = (parseInt(startTime.split(':')[0]) >= 18 || parseInt(startTime.split(':')[0]) < 5) ? 'Night' : 'Day';
      newShifts.push({
        id: shiftToEdit.id,
        staffId,
        locationId: clientId,
        date: startDate,
        startTime,
        endTime,
        type,
        notes: 'Edited manually'
      });
    } else {
      // Creation Mode
      const start = parseISO(startDate);
      // If indeterminate, let's generate for 12 months for now
      const end = isIndeterminate ? addMonths(start, 12) : parseISO(endDate || startDate);

      // Guard against infinite loop or massive generation if endDate is missing in non-indeterminate
      if (!isIndeterminate && !endDate && isRecurring) {
        alert("Selecione uma data final ou marque como indeterminado.");
        return;
      }

      if (isRecurring) {
         const interval = eachDayOfInterval({ start, end });
         interval.forEach(date => {
            const dayOfWeek = getDay(date);
            if (selectedDays.includes(dayOfWeek)) {
               const type = (parseInt(startTime.split(':')[0]) >= 18 || parseInt(startTime.split(':')[0]) < 5) ? 'Night' : 'Day';
               newShifts.push({
                 id: `sh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                 staffId,
                 locationId: clientId,
                 date: format(date, 'yyyy-MM-dd'),
                 startTime,
                 endTime,
                 type,
                 recurrenceId: recurrenceGroupId
               });
            }
         });
      } else {
         // Single Day (Non-recurring)
         const type = (parseInt(startTime.split(':')[0]) >= 18 || parseInt(startTime.split(':')[0]) < 5) ? 'Night' : 'Day';
         newShifts.push({
            id: `sh-${Date.now()}`,
            staffId,
            locationId: clientId,
            date: startDate,
            startTime,
            endTime,
            type
         });
      }
    }
    
    onSave(newShifts);
    onClose();
  };

  const handleDelete = () => {
    if (shiftToEdit && onDelete) {
       if (window.confirm("Tem certeza que deseja remover esta escala?")) {
         onDelete(shiftToEdit.id);
         onClose();
       }
    }
  }

  const inputClassName = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900";
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const roleTranslations: Record<string, string> = {
    'Security': 'Segurança',
    'Concierge': 'Porteiro',
    'Supervisor': 'Supervisor',
    'RH': 'RH',
    'Diretoria': 'Diretoria',
    'Administração': 'Administração'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-8 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {shiftToEdit ? 'Editar Escala' : 'Nova Escala'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Client/Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Building2 size={16} />
              Local / Cliente
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className={inputClassName}
              disabled={!!shiftToEdit} // Lock location on edit for simplicity
            >
              <option value="">Selecione um local...</option>
              {clientList.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Staff Selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <User size={16} />
              Colaborador
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className={inputClassName}
            >
              <option value="">Selecione...</option>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({roleTranslations[s.role] || s.role})
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-100 pt-4"></div>

          {/* Recurrence Toggle (Create Mode Only) */}
          {!shiftToEdit && (
            <div className="flex items-center justify-between">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 rounded"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Repeat size={16} />
                    Repetir Escala
                  </span>
               </label>
            </div>
          )}

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Calendar size={16} />
                  Data Início
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClassName}
                />
             </div>

             {/* End Date - Only if Recurring or Edit (Create Single hides end date usually implies same day, but let's keep logic simple) */}
             {(isRecurring) && (
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Calendar size={16} />
                      Data Fim
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={isIndeterminate}
                      className={`${inputClassName} ${isIndeterminate ? 'bg-slate-100 text-slate-400' : ''}`}
                    />
                    <label className="flex items-center gap-2 mt-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-3 h-3 text-blue-600 rounded"
                        checked={isIndeterminate}
                        onChange={(e) => setIsIndeterminate(e.target.checked)}
                      />
                      <span className="text-xs text-slate-500">Indeterminado (1 ano)</span>
                    </label>
                </div>
             )}
          </div>

          {/* Weekday Selector (Recurring Only) */}
          {isRecurring && !shiftToEdit && (
             <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="text-xs font-bold text-slate-500 uppercase">Dias da Semana</label>
                <div className="flex justify-between gap-1">
                   {weekDays.map((day, idx) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(idx)}
                        className={`
                          w-8 h-8 rounded-full text-xs font-bold transition-all
                          ${selectedDays.includes(idx) ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'}
                        `}
                      >
                        {day.charAt(0)}
                      </button>
                   ))}
                </div>
             </div>
          )}

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Clock size={16} />
                Entrada
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Clock size={16} />
                Saída
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             {shiftToEdit && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-2 text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                  title="Excluir Escala"
                >
                  <Trash2 size={20} />
                </button>
             )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all"
            >
              {shiftToEdit ? 'Salvar Alterações' : 'Criar Escala'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShiftModal;