import React, { useMemo } from 'react';
import { Reservation } from '../types';
import { CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ReservasTabProps {
  reservations: Reservation[];
  clientId: string;
}

const ReservasTab: React.FC<ReservasTabProps> = ({ reservations, clientId }) => {
  const clientReservations = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservations
      .filter(r => r.clientId === clientId && new Date(r.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [reservations, clientId]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <CalendarDays size={20} className="text-blue-600" />
        Disponibilidade de Reservas
      </h2>
      {clientReservations.length === 0 ? (
        <div className="text-center py-6 text-slate-400">
          <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhuma reserva agendada.</p>
          <p className="text-xs mt-1">Todos os horários estão disponíveis!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="text-left py-2 px-3">Data</th>
                <th className="text-left py-2 px-3">Horário</th>
                <th className="text-left py-2 px-3">Espaço</th>
                <th className="text-left py-2 px-3">Responsável</th>
                <th className="text-center py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {clientReservations.map(r => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="py-2 px-3 text-slate-700">{format(parseISO(r.date), 'dd/MM/yyyy')}</td>
                  <td className="py-2 px-3 text-slate-600">{r.startTime} - {r.endTime}</td>
                  <td className="py-2 px-3 text-slate-600">{r.resourceName}</td>
                  <td className="py-2 px-3 text-slate-600">{r.reservedBy}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${r.status === 'Confirmed' ? 'bg-green-100 text-green-700' : r.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {r.status === 'Confirmed' ? 'Confirmado' : r.status === 'Pending' ? 'Pendente' : 'Cancelado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-slate-400 mt-4">
        Para reservar o salão de festas ou outros espaços, entre em contato com a portaria.
      </p>
    </div>
  );
};

export default ReservasTab;
