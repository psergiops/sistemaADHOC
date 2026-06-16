
import React, { useState } from 'react';
import { ShiftHandover, Shift, Staff } from '../types';
import { format } from 'date-fns';
import { 
  Clock, Play, Square, FileText, User, MapPin, 
  Menu, HelpCircle, CheckCircle2, AlertCircle, X
} from 'lucide-react';

interface ShiftHandoverViewProps {
  shifts: Shift[];
  handovers: ShiftHandover[];
  currentUser: Staff | any;
  staff: Staff[];
  onAddHandover: (handover: ShiftHandover) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const ShiftHandoverView: React.FC<ShiftHandoverViewProps> = ({
  shifts, handovers, currentUser, staff, onAddHandover, onToggleMenu, onShowHelp
}) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [handoverType, setHandoverType] = useState<'Inicio' | 'Fim'>('Inicio');
  const [reportText, setReportText] = useState('');

  const isManager = currentUser?.role === 'Diretoria' || currentUser?.role === 'Supervisor' || currentUser?.id === 'admin-master';

  const myShifts = shifts.filter(s => s.date === today && s.staffId === currentUser?.id);

  const myHandovers = handovers.filter(h => h.staffId === currentUser?.id);

  const hasStarted = (shiftId: string) => myHandovers.some(h => h.shiftId === shiftId && h.type === 'Inicio');
  const hasFinished = (shiftId: string) => myHandovers.some(h => h.shiftId === shiftId && h.type === 'Fim');

  const openHandover = (shift: Shift, type: 'Inicio' | 'Fim') => {
    setSelectedShift(shift);
    setHandoverType(type);
    setReportText('');
  };

  const submitHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShift || !reportText.trim()) return;
    onAddHandover({
      id: `ho-${Date.now()}`,
      staffId: currentUser.id,
      shiftId: selectedShift.id,
      date: today,
      type: handoverType,
      report: reportText.trim(),
      createdAt: new Date().toISOString()
    });
    setSelectedShift(null);
    setReportText('');
  };

  const allTodayShifts = shifts.filter(s => s.date === today);

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleMenu} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Troca de Turno</h1>
            <p className="text-sm text-slate-500">{format(new Date(), "dd 'de' MMMM 'de' yyyy")}</p>
          </div>
        </div>
        <button onClick={onShowHelp} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Ajuda">
          <HelpCircle size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* My Shifts Today */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Meus Turnos - Hoje
            </h2>

            {myShifts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Clock size={40} className="mx-auto mb-3 opacity-30" />
                <p>Nenhum turno agendado para hoje.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myShifts.map(shift => (
                  <div key={shift.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{shift.startTime} - {shift.endTime}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin size={12} />
                            {shift.station || 'Posto'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!hasStarted(shift.id) && (
                          <button onClick={() => openHandover(shift, 'Inicio')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <Play size={14} /> Iniciar
                          </button>
                        )}
                        {hasStarted(shift.id) && !hasFinished(shift.id) && (
                          <button onClick={() => openHandover(shift, 'Fim')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <Square size={14} /> Finalizar
                          </button>
                        )}
                        {hasStarted(shift.id) && (
                          <span className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
                            <CheckCircle2 size={14} /> Iniciado
                          </span>
                        )}
                        {hasFinished(shift.id) && (
                          <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg">
                            <CheckCircle2 size={14} /> Finalizado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Handovers Today (Manager) */}
          {isManager && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-purple-600" />
                Relatórios de Hoje
              </h2>

              {allTodayShifts.length === 0 ? (
                <p className="text-center text-slate-400 py-4">Nenhum turno agendado hoje.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="text-left py-2 px-3">Colaborador</th>
                        <th className="text-left py-2 px-3">Horário</th>
                        <th className="text-left py-2 px-3">Posto</th>
                        <th className="text-center py-2 px-3">Início</th>
                        <th className="text-center py-2 px-3">Fim</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTodayShifts.map(shift => {
                        const staffMember = staff.find(s => s.id === shift.staffId);
                        const inicio = handovers.find(h => h.shiftId === shift.id && h.type === 'Inicio');
                        const fim = handovers.find(h => h.shiftId === shift.id && h.type === 'Fim');
                        return (
                          <tr key={shift.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-2 px-3 font-medium text-slate-700">
                              {staffMember?.name || 'Desconhecido'}
                            </td>
                            <td className="py-2 px-3 text-slate-600">{shift.startTime} - {shift.endTime}</td>
                            <td className="py-2 px-3 text-slate-600">{shift.station || '-'}</td>
                            <td className="py-2 px-3 text-center">
                              {inicio ? (
                                <div className="group relative">
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded cursor-pointer">
                                    <CheckCircle2 size={12} /> Ok
                                  </span>
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                    <div className="bg-slate-800 text-white text-xs rounded-lg p-3 w-64 shadow-lg">
                                      <p className="font-medium mb-1">Relatório de Início:</p>
                                      <p className="text-slate-300">{inicio.report}</p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400">---</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {fim ? (
                                <div className="group relative">
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded cursor-pointer">
                                    <CheckCircle2 size={12} /> Ok
                                  </span>
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                    <div className="bg-slate-800 text-white text-xs rounded-lg p-3 w-64 shadow-lg">
                                      <p className="font-medium mb-1">Relatório de Fim:</p>
                                      <p className="text-slate-300">{fim.report}</p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400">---</span>
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

          {/* My Handover History */}
          {myHandovers.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-slate-500" />
                Meus Relatórios de Hoje
              </h2>
              <div className="space-y-2">
                {myHandovers.map(h => {
                  const shift = shifts.find(s => s.id === h.shiftId);
                  return (
                    <div key={h.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${h.type === 'Inicio' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {h.type === 'Inicio' ? 'INÍCIO' : 'FIM'}
                        </span>
                        <span>{shift?.startTime} - {shift?.endTime}</span>
                        <span>{shift?.station}</span>
                      </div>
                      <p className="text-sm text-slate-700">{h.report}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Handover Form Modal */}
      {selectedShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${handoverType === 'Inicio' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {handoverType === 'Inicio' ? <Play size={20} /> : <Square size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {handoverType === 'Inicio' ? 'Iniciar Turno' : 'Finalizar Turno'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedShift.startTime} - {selectedShift.endTime} | {selectedShift.station}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedShift(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitHandover} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Data</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900" value={today} disabled />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Tipo</label>
                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900" value={handoverType === 'Inicio' ? 'Iniciando Turno' : 'Finalizando Turno'} disabled />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  {handoverType === 'Inicio' ? 'Relatório de Início de Turno' : 'Relatório de Finalização de Turno'}
                </label>
                <textarea
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
                  rows={5}
                  placeholder={handoverType === 'Inicio'
                    ? 'Descreva como está encontrando o posto, ocorrências em andamento, materiais recebidos...'
                    : 'Descreva as ocorrências do turno, serviços realizados, pendências para o próximo turno...'}
                  value={reportText}
                  onChange={e => setReportText(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setSelectedShift(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm ${handoverType === 'Inicio' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                  {handoverType === 'Inicio' ? <Play size={16} /> : <Square size={16} />}
                  {handoverType === 'Inicio' ? 'Confirmar Início' : 'Confirmar Finalização'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftHandoverView;
