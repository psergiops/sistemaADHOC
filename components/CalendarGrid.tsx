
import React, { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth, 
  isSameMonth, 
  isSameDay, 
  isToday,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Shift, Staff } from '../types';
import { Clock, User as UserIcon, Moon, Sun } from 'lucide-react';

interface CalendarGridProps {
  currentDate: Date;
  shifts: Shift[];
  staff: Staff[];
  onShiftClick: (shift: Shift) => void;
  onDayClick: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  currentDate, 
  shifts, 
  staff,
  onShiftClick,
  onDayClick
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getShiftsForDay = (date: Date) => {
    return shifts.filter(shift => isSameDay(parseISO(shift.date), date));
  };

  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || 'Unknown';

  return (
    <div className="flex flex-col h-full bg-[#EBEBEB] rounded-lg shadow border border-slate-200 overflow-hidden relative">
      {/* Wrapper for horizontal scroll on mobile */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px] h-full flex flex-col">
          
          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-[#EBEBEB] sticky top-0 z-10">
            {weekDays.map(day => (
              <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr">
            {calendarDays.map((day, dayIdx) => {
              const dayShifts = getShiftsForDay(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              
              return (
                <div 
                  key={day.toString()}
                  onClick={() => onDayClick(day)}
                  className={`
                    min-h-[120px] p-2 border-b border-r border-slate-200 relative group transition-colors hover:bg-slate-100 cursor-pointer
                    ${!isCurrentMonth ? 'bg-slate-100/50 text-slate-400' : 'bg-[#EBEBEB]'}
                    ${dayIdx % 7 === 0 || dayIdx % 7 === 6 ? 'bg-slate-100/30' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`
                      text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                      ${isToday(day) ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700'}
                    `}>
                      {format(day, 'd')}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded transition-opacity">
                      +
                    </span>
                  </div>

                  <div className="space-y-1.5 overflow-y-auto max-h-[100px] scrollbar-hide">
                    {dayShifts.map(shift => {
                      const staffName = getStaffName(shift.staffId);
                      const isNight = shift.type === 'Night';
                      
                      return (
                        <div 
                          key={shift.id}
                          onClick={(e) => { e.stopPropagation(); onShiftClick(shift); }}
                          className={`
                            text-xs p-1.5 rounded border shadow-sm transition-all hover:shadow-md cursor-pointer flex items-center gap-2
                            ${isNight 
                              ? 'bg-indigo-50 border-indigo-100 text-indigo-900 hover:bg-indigo-100' 
                              : 'bg-amber-50 border-amber-100 text-amber-900 hover:bg-amber-100'}
                          `}
                        >
                          {isNight ? <Moon size={10} className="text-indigo-500 shrink-0" /> : <Sun size={10} className="text-amber-500 shrink-0" />}
                          <div className="flex-1 truncate">
                            <span className="font-semibold">{format(parseISO(`${shift.date}T${shift.startTime}`), 'HH:mm')}</span>
                            <span className="mx-1 opacity-50">|</span>
                            <span className="truncate">{staffName}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
