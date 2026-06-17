
import React, { useState, useMemo, useEffect } from 'react';
import { PerformanceEvaluation, Staff } from '../types';
import { format, addDays, isPast, parseISO } from 'date-fns';
import {
  ClipboardCheck, Plus, Eye, Menu, HelpCircle, X, Search,
  Star, AlertCircle, CheckCircle2, Clock, ArrowRight, RotateCcw
} from 'lucide-react';

interface PerformanceEvaluationViewProps {
  evaluations: PerformanceEvaluation[];
  staff: Staff[];
  currentUser: Staff | any;
  onAddEvaluation: (evaluation: PerformanceEvaluation) => void;
  onUpdateEvaluation: (evaluation: PerformanceEvaluation) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 text-sm";
const labelClass = "text-sm font-medium text-slate-700";

const criteriaLabels: { key: keyof Pick<PerformanceEvaluation, 'assiduidade' | 'qualidadeTrabalho' | 'iniciativa' | 'trabalhoEquipe' | 'disciplina' | 'aparencia' | 'conhecimento'>; label: string }[] = [
  { key: 'assiduidade', label: 'Assiduidade / Pontualidade' },
  { key: 'qualidadeTrabalho', label: 'Qualidade do Trabalho' },
  { key: 'iniciativa', label: 'Iniciativa' },
  { key: 'trabalhoEquipe', label: 'Trabalho em Equipe' },
  { key: 'disciplina', label: 'Disciplina' },
  { key: 'aparencia', label: 'Apresentação Pessoal' },
  { key: 'conhecimento', label: 'Conhecimento Técnico' },
];

const PerformanceEvaluationView: React.FC<PerformanceEvaluationViewProps> = ({
  evaluations, staff, currentUser, onAddEvaluation, onUpdateEvaluation, onToggleMenu, onShowHelp
}) => {
  const [showForm, setShowForm] = useState(false);
  const [viewingEval, setViewingEval] = useState<PerformanceEvaluation | null>(null);
  const [editTratativa, setEditTratativa] = useState('');
  const [staffFilter, setStaffFilter] = useState('');

  const isRH = currentUser?.role === 'RH' || currentUser?.role === 'Diretoria' || currentUser?.id === 'admin-master';

  useEffect(() => {
    if (viewingEval) {
      setEditTratativa(viewingEval.rhTratativa || '');
    }
  }, [viewingEval]);

  const pendingReevaluations = useMemo(() => {
    return evaluations.filter(e =>
      e.requiresReevaluation &&
      e.nextEvaluationDate &&
      isPast(parseISO(e.nextEvaluationDate)) &&
      e.status === 'completed' &&
      !evaluations.some(ev => ev.previousEvaluationId === e.id && ev.status === 'completed')
    );
  }, [evaluations]);

  const [form, setForm] = useState({
    staffId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    assiduidade: 3,
    qualidadeTrabalho: 3,
    iniciativa: 3,
    trabalhoEquipe: 3,
    disciplina: 3,
    aparencia: 3,
    conhecimento: 3,
    strengths: '',
    improvements: '',
    generalNotes: '',
    requiresReevaluation: false,
    previousEvaluationId: '',
  });

  const overallScore = useMemo(() => {
    const scores = [form.assiduidade, form.qualidadeTrabalho, form.iniciativa, form.trabalhoEquipe, form.disciplina, form.aparencia, form.conhecimento];
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [form.assiduidade, form.qualidadeTrabalho, form.iniciativa, form.trabalhoEquipe, form.disciplina, form.aparencia, form.conhecimento]);

  const openForm = (previous?: PerformanceEvaluation) => {
    setForm({
      staffId: previous?.staffId || '',
      date: format(new Date(), 'yyyy-MM-dd'),
      assiduidade: 3,
      qualidadeTrabalho: 3,
      iniciativa: 3,
      trabalhoEquipe: 3,
      disciplina: 3,
      aparencia: 3,
      conhecimento: 3,
      strengths: '',
      improvements: '',
      generalNotes: '',
      requiresReevaluation: false,
      previousEvaluationId: previous?.id || '',
    });
    setShowForm(true);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.staffId) return;
    const nextEvalDate = form.requiresReevaluation ? addDays(parseISO(form.date), 30).toISOString().split('T')[0] : '';
    onAddEvaluation({
      id: `eval-${Date.now()}`,
      staffId: form.staffId,
      evaluatorId: currentUser.id,
      date: form.date,
      assiduidade: form.assiduidade,
      qualidadeTrabalho: form.qualidadeTrabalho,
      iniciativa: form.iniciativa,
      trabalhoEquipe: form.trabalhoEquipe,
      disciplina: form.disciplina,
      aparencia: form.aparencia,
      conhecimento: form.conhecimento,
      overallScore: Math.round(overallScore * 10) / 10,
      strengths: form.strengths,
      improvements: form.improvements,
      generalNotes: form.generalNotes,
      requiresReevaluation: form.requiresReevaluation,
      nextEvaluationDate: nextEvalDate,
      previousEvaluationId: form.previousEvaluationId || undefined,
      status: 'completed',
      sentToRH: true,
      rhTratativa: '',
      createdAt: new Date().toISOString()
    });
    setShowForm(false);
  };

  const StarInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className={`p-0.5 transition-colors ${s <= value ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-300'}`}>
          <Star size={18} fill={s <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );

  const ScoreBadge = ({ score }: { score: number }) => {
    if (score >= 4) return <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">{score.toFixed(1)}</span>;
    if (score >= 2.5) return <span className="text-xs font-bold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">{score.toFixed(1)}</span>;
    return <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">{score.toFixed(1)}</span>;
  };

  const filteredEvals = evaluations
    .filter(e => !staffFilter || e.staffId === staffFilter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] dark:bg-[#000000] transition-colors duration-200">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleMenu} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Avaliação de Desempenho</h1>
            <p className="text-sm text-slate-500">{evaluations.length} avaliações registradas</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => openForm()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            <Plus size={16} /> Nova Avaliação
          </button>
          <button onClick={onShowHelp} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Ajuda">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Pending Re-evaluations Alert (RH only) */}
          {isRH && pendingReevaluations.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <AlertCircle size={18} /> Reavaliações Pendentes ({pendingReevaluations.length})
              </h2>
              <div className="space-y-2">
                {pendingReevaluations.map(ev => {
                  const emp = staff.find(s => s.id === ev.staffId);
                  const evaluator = staff.find(s => s.id === ev.evaluatorId);
                  return (
                    <div key={ev.id} className="flex items-center justify-between bg-white rounded-lg border border-amber-200 px-4 py-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Clock size={16} className="text-amber-500" />
                        <span className="font-medium text-amber-900">{emp?.name || 'Desconhecido'}</span>
                        <span className="text-amber-600">Reavaliação venceu em {format(parseISO(ev.nextEvaluationDate), 'dd/MM/yyyy')}</span>
                        <span className="text-xs text-slate-400">Avaliador: {evaluator?.name || '-'}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setViewingEval(ev)}
                          className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded">Ver</button>
                        <button onClick={() => openForm(ev)}
                          className="flex items-center gap-1 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded">
                          <RotateCcw size={12} /> Reavaliar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Evaluation List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <ClipboardCheck size={20} className="text-blue-600" />
                Histórico de Avaliações
              </h2>
              <div className="flex items-center gap-3">
                <select className={inputClass + ' w-48'} value={staffFilter} onChange={e => setStaffFilter(e.target.value)}>
                  <option value="">Todos os funcionários</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredEvals.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <ClipboardCheck size={40} className="mx-auto mb-3 opacity-30" />
                <p>Nenhuma avaliação encontrada.</p>
                <button onClick={() => openForm()} className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Criar primeira avaliação
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="text-left py-2 px-3">Funcionário</th>
                      <th className="text-left py-2 px-3">Avaliador</th>
                      <th className="text-center py-2 px-3">Data</th>
                      <th className="text-center py-2 px-3">Nota</th>
                      <th className="text-center py-2 px-3">Reavaliação</th>
                      <th className="text-center py-2 px-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvals.map(ev => {
                      const emp = staff.find(s => s.id === ev.staffId);
                      const evaluator = staff.find(s => s.id === ev.evaluatorId);
                      const hasReeval = evaluations.some(e => e.previousEvaluationId === ev.id);
                      return (
                        <tr key={ev.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium text-slate-700">{emp?.name || 'Desconhecido'}</td>
                          <td className="py-2 px-3 text-slate-600">{evaluator?.name || '-'}</td>
                          <td className="py-2 px-3 text-center text-slate-600">{format(parseISO(ev.date), 'dd/MM/yyyy')}</td>
                          <td className="py-2 px-3 text-center"><ScoreBadge score={ev.overallScore} /></td>
                          <td className="py-2 px-3 text-center">
                            {ev.requiresReevaluation ? (
                              <span className="flex items-center justify-center gap-1 text-xs text-amber-700">
                                <Clock size={12} />
                                {format(parseISO(ev.nextEvaluationDate), 'dd/MM/yyyy')}
                                {hasReeval && <CheckCircle2 size={12} className="text-green-500" />}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">---</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => setViewingEval(ev)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Ver detalhes">
                                <Eye size={16} />
                              </button>
                              {ev.requiresReevaluation && !hasReeval && (
                                <button onClick={() => openForm(ev)}
                                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded" title="Reavaliar">
                                  <RotateCcw size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evaluation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {form.previousEvaluationId ? 'Reavaliação de Desempenho' : 'Nova Avaliação de Desempenho'}
                  </h3>
                  <p className="text-sm text-slate-500">Avaliação será enviada ao RH automaticamente</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitForm} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>Funcionário</label>
                    <select className={inputClass} value={form.staffId} onChange={e => setForm({...form, staffId: e.target.value})} required>
                      <option value="">Selecione...</option>
                      {staff.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Data</label>
                    <input type="date" className={inputClass} value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                  </div>
                </div>

                {form.previousEvaluationId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-sm text-blue-700">
                    <ArrowRight size={16} />
                    Reavaliação baseada na avaliação anterior
                  </div>
                )}

                <div className="border border-slate-200 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-slate-700 text-sm">Critérios de Avaliação</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {criteriaLabels.map(c => (
                      <div key={c.key} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{c.label}</span>
                        <StarInput value={form[c.key]} onChange={v => setForm({...form, [c.key]: v})} />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-semibold text-slate-700">Média Geral</span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${overallScore >= 4 ? 'bg-green-100 text-green-700' : overallScore >= 2.5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {overallScore.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Pontos Fortes</label>
                  <textarea className={inputClass} rows={2} placeholder="Destaques positivos do colaborador..."
                    value={form.strengths} onChange={e => setForm({...form, strengths: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Pontos a Melhorar</label>
                  <textarea className={inputClass} rows={2} placeholder="Aspectos que precisam de desenvolvimento..."
                    value={form.improvements} onChange={e => setForm({...form, improvements: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Observações Gerais</label>
                  <textarea className={inputClass} rows={2} placeholder="Informações adicionais relevantes..."
                    value={form.generalNotes} onChange={e => setForm({...form, generalNotes: e.target.value})} />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.requiresReevaluation} onChange={e => setForm({...form, requiresReevaluation: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Solicitar reavaliação após 30 dias</span>
                </label>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-between items-center shrink-0">
                <p className="text-xs text-slate-400">A avaliação será enviada ao RH automaticamente</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                    Cancelar
                  </button>
                  <button type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">
                    <ClipboardCheck size={16} /> Salvar Avaliação
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Evaluation Detail Modal */}
      {viewingEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Avaliação de {staff.find(s => s.id === viewingEval.staffId)?.name || 'Desconhecido'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {format(parseISO(viewingEval.date), 'dd/MM/yyyy')} — {staff.find(s => s.id === viewingEval.evaluatorId)?.name || '-'}
                  </p>
                </div>
              </div>
              <button onClick={() => setViewingEval(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {viewingEval.previousEvaluationId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  <ArrowRight size={14} className="inline mr-1" />
                  Esta é uma reavaliação baseada em avaliação anterior
                </div>
              )}

              <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-700 text-sm">Notas por Critério</h4>
                  <ScoreBadge score={viewingEval.overallScore} />
                </div>
                <div className="space-y-2">
                  {criteriaLabels.map(c => (
                    <div key={c.key} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{c.label}</span>
                      <span className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={14} className={s <= viewingEval[c.key] ? 'text-yellow-400' : 'text-slate-200'} fill={s <= viewingEval[c.key] ? 'currentColor' : 'none'} />
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-semibold text-slate-700">Média Geral</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${viewingEval.overallScore >= 4 ? 'bg-green-100 text-green-700' : viewingEval.overallScore >= 2.5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {viewingEval.overallScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {viewingEval.strengths && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Pontos Fortes</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">{viewingEval.strengths}</p>
                </div>
              )}

              {viewingEval.improvements && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Pontos a Melhorar</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">{viewingEval.improvements}</p>
                </div>
              )}

              {viewingEval.generalNotes && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Observações Gerais</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">{viewingEval.generalNotes}</p>
                </div>
              )}

              {viewingEval.requiresReevaluation && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700 flex items-center gap-2">
                  <Clock size={14} />
                  Reavaliação solicitada para {format(parseISO(viewingEval.nextEvaluationDate), 'dd/MM/yyyy')}
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-1">Tratativa do RH</h4>
                {isRH ? (
                  <>
                    <textarea className={inputClass} rows={3}
                      placeholder="Registre aqui as ações do RH em relação a esta avaliação..."
                      value={editTratativa} onChange={e => setEditTratativa(e.target.value)} />
                    <div className="mt-2 flex justify-end">
                      <button onClick={() => {
                        onUpdateEvaluation({ ...viewingEval, rhTratativa: editTratativa });
                        setViewingEval({ ...viewingEval, rhTratativa: editTratativa });
                      }}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                        Salvar Tratativa
                      </button>
                    </div>
                  </>
                ) : (
                  <p className={`text-sm bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap ${!viewingEval.rhTratativa ? 'text-slate-400 italic' : 'text-slate-600'}`}>
                    {viewingEval.rhTratativa || 'Nenhuma tratativa registrada pelo RH.'}
                  </p>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end shrink-0">
              <button onClick={() => setViewingEval(null)}
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

export default PerformanceEvaluationView;
