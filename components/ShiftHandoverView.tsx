
import React, { useState } from 'react';
import { ShiftHandover, Shift, Staff, Client } from '../types';
import { format, parseISO } from 'date-fns';
import { 
  Clock, Play, Square, FileText, User, MapPin, 
  Menu, HelpCircle, CheckCircle2, AlertCircle, X, Search, Eye
} from 'lucide-react';

interface ShiftHandoverViewProps {
  shifts: Shift[];
  handovers: ShiftHandover[];
  currentUser: Staff | any;
  staff: Staff[];
  clients: Client[];
  onAddHandover: (handover: ShiftHandover) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 text-sm";

const ShiftHandoverView: React.FC<ShiftHandoverViewProps> = ({
  shifts, handovers, currentUser, staff, clients, onAddHandover, onToggleMenu, onShowHelp
}) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [handoverType, setHandoverType] = useState<'Inicio' | 'Fim'>('Inicio');
  const [report, setReport] = useState({ equipamentos: '', ocorrencias: '', pendencias: '', observacoes: '' });
  const [showAdHocForm, setShowAdHocForm] = useState(false);
  const [adHocDate, setAdHocDate] = useState(today);
  const [adHocClientId, setAdHocClientId] = useState('');
  const [viewingHandover, setViewingHandover] = useState<ShiftHandover | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'Inicio' | 'Fim'>('all');
  const [historyDate, setHistoryDate] = useState(today);

  const isManager = currentUser?.role === 'Diretoria' || currentUser?.role === 'Supervisor' || currentUser?.id === 'admin-master';

  const userClients = clients.filter(c => c.assignedStaffIds?.includes(currentUser?.id));

  const myShifts = shifts.filter(s => s.date === today && s.staffId === currentUser?.id);

  const hasStarted = (shiftId: string) => handovers.some(h => h.shiftId === shiftId && h.type === 'Inicio' && h.staffId === currentUser?.id);
  const hasFinished = (shiftId: string) => handovers.some(h => h.shiftId === shiftId && h.type === 'Fim' && h.staffId === currentUser?.id);

  const openHandover = (shift: Shift, type: 'Inicio' | 'Fim') => {
    setSelectedShift(shift);
    setHandoverType(type);
    setReport({ equipamentos: '', ocorrencias: '', pendencias: '', observacoes: '' });
  };

  const submitHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShift) return;
    const fullReport = Object.values(report).filter(v => v.trim()).join('\n---\n');
    onAddHandover({
      id: `ho-${Date.now()}`,
      staffId: currentUser.id,
      shiftId: selectedShift.id,
      clientId: selectedShift.locationId,
      date: today,
      type: handoverType,
      report: fullReport || 'Sem ocorrências',
      equipamentos: report.equipamentos,
      ocorrencias: report.ocorrencias,
      pendencias: report.pendencias,
      observacoes: report.observacoes,
      createdAt: new Date().toISOString()
    });
    setSelectedShift(null);
  };

  const submitAdHoc = (e: React.FormEvent) => {
    e.preventDefault();
    const fullReport = Object.values(report).filter(v => v.trim()).join('\n---\n');
    onAddHandover({
      id: `ho-${Date.now()}`,
      staffId: currentUser.id,
      shiftId: 'adhoc',
      clientId: adHocClientId || undefined,
      date: adHocDate,
      type: handoverType,
      report: fullReport || 'Sem ocorrências',
      equipamentos: report.equipamentos,
      ocorrencias: report.ocorrencias,
      pendencias: report.pendencias,
      observacoes: report.observacoes,
      createdAt: new Date().toISOString()
    });
    setShowAdHocForm(false);
    setReport({ equipamentos: '', ocorrencias: '', pendencias: '', observacoes: '' });
  };

  const allTodayShifts = shifts.filter(s => s.date === today);

  const filteredHistory = handovers
    .filter(h => h.staffId === currentUser?.id && h.date === historyDate)
    .filter(h => historyFilter === 'all' || h.type === historyFilter)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

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
        <div className="max-w-5xl mx-auto space-y-6">

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
                            <MapPin size={12} /> {shift.station || 'Posto'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!hasStarted(shift.id) && (
                          <button onClick={() => openHandover(shift, 'Inicio')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                            <Play size={14} /> Iniciar
                          </button>
                        )}
                        {hasStarted(shift.id) && !hasFinished(shift.id) && (
                          <button onClick={() => openHandover(shift, 'Fim')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors">
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
            <div className="mt-3 text-center">
              <button onClick={() => setShowAdHocForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                <FileText size={16} /> Criar Relatório Avulso
              </button>
            </div>
          </div>

          {/* Manager View: All reports today */}
          {isManager && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-purple-600" />
                Relatórios do Dia
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
                        <th className="text-left py-2 px-3">Cliente</th>
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
                            <td className="py-2 px-3 font-medium text-slate-700">{staffMember?.name || 'Desconhecido'}</td>
                            <td className="py-2 px-3 text-slate-600">{shift.startTime} - {shift.endTime}</td>
                            <td className="py-2 px-3 text-slate-600">{shift.station || '-'}</td>
                            <td className="py-2 px-3 text-slate-600">{clients.find(c => c.id === shift.locationId)?.name || '-'}</td>
                            <td className="py-2 px-3 text-center">
                              {inicio ? (
                                <button onClick={() => setViewingHandover(inicio)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-2 py-0.5 rounded transition-colors">
                                  <CheckCircle2 size={12} /> Ver
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400">---</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {fim ? (
                                <button onClick={() => setViewingHandover(fim)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 px-2 py-0.5 rounded transition-colors">
                                  <CheckCircle2 size={12} /> Ver
                                </button>
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

          {/* History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-slate-500" />
              Histórico de Relatórios
            </h2>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500">Data</label>
                <input type="date" className={inputClass} value={historyDate} onChange={e => setHistoryDate(e.target.value)} />
              </div>
              <div className="flex items-center gap-1">
                {(['all', 'Inicio', 'Fim'] as const).map(f => (
                  <button key={f} onClick={() => setHistoryFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${historyFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {f === 'all' ? 'Todos' : f === 'Inicio' ? 'Início' : 'Fim'}
                  </button>
                ))}
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <p className="text-center text-slate-400 py-4">Nenhum relatório encontrado para esta data.</p>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map(h => {
                  const shift = shifts.find(s => s.id === h.shiftId);
                  const isAdHoc = h.shiftId === 'adhoc';
                  const client = clients.find(c => c.id === (h.clientId || shift?.locationId));
                  return (
                    <div key={h.id} className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-100/50">
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${h.type === 'Inicio' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {h.type === 'Inicio' ? 'INÍCIO' : 'FIM'}
                          </span>
                          {isAdHoc ? (
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">AVULSO</span>
                          ) : (
                            <>
                              <span className="text-slate-600">{shift?.startTime} - {shift?.endTime}</span>
                              <span className="text-slate-400">|</span>
                              <span className="text-slate-500">{shift?.station}</span>
                            </>
                          )}
                          {client && (
                            <>
                              <span className="text-slate-300">|</span>
                              <span className="text-slate-500">{client.name}</span>
                            </>
                          )}
                        </div>
                        <button onClick={() => setViewingHandover(h)}
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800">
                          <Eye size={14} /> Detalhes
                        </button>
                      </div>
                      <div className="px-4 py-3">
                        {h.ocorrencias && <p className="text-sm text-slate-700"><span className="font-medium">Ocorrências:</span> {h.ocorrencias}</p>}
                        {!h.ocorrencias && h.report && <p className="text-sm text-slate-700 line-clamp-2">{h.report}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Handover Form Modal */}
      {selectedShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${handoverType === 'Inicio' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {handoverType === 'Inicio' ? <Play size={20} /> : <Square size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {handoverType === 'Inicio' ? 'Relatório de Início de Turno' : 'Relatório de Finalização de Turno'}
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
            <form onSubmit={submitHandover} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Data</label>
                    <input type="date" className={inputClass} value={today} disabled />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Tipo</label>
                    <input className={inputClass} value={handoverType === 'Inicio' ? 'Iniciando Turno' : 'Finalizando Turno'} disabled />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Situação dos Equipamentos / Posto</label>
                  <textarea className={inputClass} rows={3}
                    placeholder="Ex: Rádio funcionando, câmeras OK, mesa e cadeira em bom estado, material de limpeza completo..."
                    value={report.equipamentos} onChange={e => setReport({...report, equipamentos: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Ocorrências</label>
                  <textarea className={inputClass} rows={3}
                    placeholder={handoverType === 'Inicio'
                      ? 'Ocorrências em andamento deixadas pelo turno anterior...'
                      : 'Relate as ocorrências ocorridas durante o turno (visitas, entregas, emergências, etc.)'}
                    value={report.ocorrencias} onChange={e => setReport({...report, ocorrencias: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Pendências</label>
                  <textarea className={inputClass} rows={3}
                    placeholder={handoverType === 'Inicio'
                      ? 'Pendências que precisa resolver durante o turno...'
                      : 'Pendências a serem passadas para o próximo turno...'}
                    value={report.pendencias} onChange={e => setReport({...report, pendencias: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Observações Gerais</label>
                  <textarea className={inputClass} rows={2}
                    placeholder="Informações adicionais relevantes..."
                    value={report.observacoes} onChange={e => setReport({...report, observacoes: e.target.value})} />
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setSelectedShift(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm ${handoverType === 'Inicio' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                  {handoverType === 'Inicio' ? <Play size={16} /> : <Square size={16} />}
                  Salvar Relatório
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ad-Hoc Form Modal */}
      {showAdHocForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Relatório Avulso</h3>
                  <p className="text-sm text-slate-500">Relatório sem vínculo com turno agendado</p>
                </div>
              </div>
              <button onClick={() => setShowAdHocForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitAdHoc} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Data</label>
                    <input type="date" className={inputClass} value={adHocDate} onChange={e => setAdHocDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Tipo</label>
                    <select className={inputClass} value={handoverType} onChange={e => setHandoverType(e.target.value as 'Inicio' | 'Fim')}>
                      <option value="Inicio">Início de Turno</option>
                      <option value="Fim">Finalização de Turno</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Cliente</label>
                    <select className={inputClass} value={adHocClientId} onChange={e => setAdHocClientId(e.target.value)}>
                      <option value="">Selecione...</option>
                      {(userClients.length > 0 ? userClients : clients).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Situação dos Equipamentos / Posto</label>
                  <textarea className={inputClass} rows={3}
                    placeholder="Ex: Rádio funcionando, câmeras OK, mesa e cadeira em bom estado..."
                    value={report.equipamentos} onChange={e => setReport({...report, equipamentos: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Ocorrências</label>
                  <textarea className={inputClass} rows={3}
                    placeholder={handoverType === 'Inicio'
                      ? 'Ocorrências em andamento...'
                      : 'Relate as ocorrências do turno...'}
                    value={report.ocorrencias} onChange={e => setReport({...report, ocorrencias: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Pendências</label>
                  <textarea className={inputClass} rows={3}
                    placeholder={handoverType === 'Inicio'
                      ? 'Pendências a resolver durante o turno...'
                      : 'Pendências para o próximo turno...'}
                    value={report.pendencias} onChange={e => setReport({...report, pendencias: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Observações Gerais</label>
                  <textarea className={inputClass} rows={2}
                    placeholder="Informações adicionais..."
                    value={report.observacoes} onChange={e => setReport({...report, observacoes: e.target.value})} />
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setShowAdHocForm(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">
                  <FileText size={16} /> Salvar Relatório
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Handover Detail Modal */}
      {viewingHandover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${viewingHandover.type === 'Inicio' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {viewingHandover.type === 'Inicio' ? <Play size={20} /> : <Square size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Relatório de {viewingHandover.type === 'Inicio' ? 'Início' : 'Finalização'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {(() => {
                      const s = shifts.find(s => s.id === viewingHandover.shiftId);
                      const c = clients.find(c => c.id === (viewingHandover.clientId || s?.locationId));
                      if (viewingHandover.shiftId === 'adhoc') {
                        return c ? c.name : 'Relatório Avulso';
                      }
                      return `${s?.startTime} - ${s?.endTime} | ${s?.station}${c ? ' | ' + c.name : ''}`;
                    })()}
                  </p>
                </div>
              </div>
              <button onClick={() => setViewingHandover(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="text-sm text-slate-500 mb-2">
                {new Date(viewingHandover.createdAt).toLocaleString()} — {staff.find(s => s.id === viewingHandover.staffId)?.name}
              </div>

              {viewingHandover.equipamentos && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Equipamentos / Posto</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">{viewingHandover.equipamentos}</p>
                </div>
              )}

              {viewingHandover.ocorrencias && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Ocorrências</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">{viewingHandover.ocorrencias}</p>
                </div>
              )}

              {viewingHandover.pendencias && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Pendências</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">{viewingHandover.pendencias}</p>
                </div>
              )}

              {viewingHandover.observacoes && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Observações Gerais</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">{viewingHandover.observacoes}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end shrink-0">
              <button onClick={() => setViewingHandover(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftHandoverView;
