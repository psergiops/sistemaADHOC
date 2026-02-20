
import React from 'react';
import { X, ShieldAlert, CheckCircle2, Clock, MapPin, User, FileText, Hourglass, AlertCircle } from 'lucide-react';
import { ShiftCheckin, Shift, Staff, Client } from '../types';
import { format, parseISO, addMinutes, isAfter, isBefore } from 'date-fns';

interface ShiftCheckinReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkins: ShiftCheckin[];
  shifts: Shift[];
  staff: Staff[];
  clients: Client[];
}

const ShiftCheckinReportModal: React.FC<ShiftCheckinReportModalProps> = ({
  isOpen,
  onClose,
  checkins,
  shifts,
  staff,
  clients
}) => {
  if (!isOpen) return null;

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  // Filtrar apenas turnos de hoje relevantes para troca (06h - 18h aprox)
  const relevantShifts = shifts.filter(s => {
    if (s.date !== todayStr) return false;
    // Considera turnos começando perto das 06:00 ou 18:00
    return s.startTime.startsWith('06') || s.startTime.startsWith('18');
  }).sort((a,b) => a.startTime.localeCompare(b.startTime));

  const roleTranslations: Record<string, string> = {
    'Security': 'Segurança',
    'Concierge': 'Porteiro',
    'Supervisor': 'Supervisor',
    'RH': 'RH',
    'Diretoria': 'Diretoria',
    'Administração': 'Administração'
  };

  const reportData = relevantShifts.map(shift => {
    const staffMember = staff.find(s => s.id === shift.staffId);
    const client = clients.find(c => c.id === shift.locationId);
    
    // Identificar hora do turno para comparação
    const [hours, minutes] = shift.startTime.split(':').map(Number);
    const shiftTime = new Date();
    shiftTime.setHours(hours, minutes, 0, 0);
    
    // Tolerância de 15 minutos
    const toleranceTime = addMinutes(shiftTime, 15);

    // Encontrar checkin
    const shiftStartHour = shift.startTime.substring(0, 2); 
    const checkin = checkins.find(c => 
      c.staffId === shift.staffId && 
      c.date === shift.date &&
      c.shiftTimeReference.startsWith(shiftStartHour)
    );

    // Lógica de Status Corrigida
    let status: 'Ok' | 'Late' | 'Pending' | 'Waiting' = 'Pending';
    let statusLabel = 'Login Não Identificado';

    if (checkin) {
        status = 'Ok';
        statusLabel = 'Posto Logado';
    } else {
        if (isBefore(today, shiftTime)) {
            // Se agora é antes do início do turno
            status = 'Waiting';
            statusLabel = 'Aguardando Início';
        } else if (isBefore(today, toleranceTime)) {
            // Se está dentro da tolerância (entre 18:00 e 18:15 por exemplo)
            status = 'Waiting';
            statusLabel = 'Aguardando...';
        } else {
            // Passou do horário + tolerância e não logou
            status = 'Late';
            statusLabel = 'Login Não Identificado';
        }
    }

    return {
      shift,
      staffName: staffMember?.name || 'Desconhecido',
      staffRole: staffMember ? (roleTranslations[staffMember.role] || staffMember.role) : '',
      clientName: client?.name || 'Local Desconhecido',
      scheduledTime: shift.startTime,
      status,
      statusLabel,
      checkinTime: checkin ? format(parseISO(checkin.checkinTime), 'HH:mm:ss') : null
    };
  });

  const missingCount = reportData.filter(d => d.status === 'Late').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <FileText size={24} />
             </div>
             <div>
               <h3 className="text-xl font-bold text-slate-800">Relatório de Turno (06h / 18h)</h3>
               <p className="text-sm text-slate-500">Monitoramento em tempo real da troca de turno</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
            
            {/* Alert Summary */}
            {missingCount > 0 ? (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-bold text-red-800">Atenção: {missingCount} Login(s) Atrasado(s)</h4>
                        <p className="text-sm text-red-700 mt-1">
                            Colaboradores que já deveriam ter assumido o posto e não registraram entrada no sistema.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle2 className="text-green-600 shrink-0" size={20} />
                    <div>
                        <h4 className="font-bold text-green-800">Operação Normal</h4>
                        <p className="text-sm text-green-700">
                            Todos os postos estão cobertos ou aguardando o horário de início.
                        </p>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Horário</th>
                            <th className="px-4 py-3">Condomínio / Posto</th>
                            <th className="px-4 py-3">Colaborador</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Registro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reportData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                                    Nenhuma escala agendada para troca de turno (06h/18h) hoje.
                                </td>
                            </tr>
                        ) : (
                            reportData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-slate-400" />
                                            {row.scheduledTime}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-800">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-400" />
                                            {row.clientName}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                {row.staffName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-700">{row.staffName}</p>
                                                <p className="text-[10px] text-slate-400">{row.staffRole}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.status === 'Ok' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                <CheckCircle2 size={12} /> {row.statusLabel}
                                            </span>
                                        )}
                                        {row.status === 'Late' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                <X size={12} /> {row.statusLabel}
                                            </span>
                                        )}
                                        {row.status === 'Waiting' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                                <Hourglass size={12} /> {row.statusLabel}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-500">
                                        {row.checkinTime || '--:--'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                    Fechar Relatório
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftCheckinReportModal;
