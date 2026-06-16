import React, { useMemo } from 'react';
import { GuestList } from '../types';
import { Users, CheckCircle2, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ConvidadosTabProps {
  guestLists: GuestList[];
  clientId: string;
}

const ConvidadosTab: React.FC<ConvidadosTabProps> = ({ guestLists, clientId }) => {
  const myGuestLists = useMemo(() => {
    return guestLists
      .filter(g => g.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [guestLists, clientId]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Users size={20} className="text-purple-600" />
        Lista de Convidados
      </h2>
      {myGuestLists.length === 0 ? (
        <div className="text-center py-6 text-slate-400">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhuma lista de convidados registrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myGuestLists.map(list => (
            <div key={list.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{list.eventName || 'Evento'}</p>
                    <p className="text-sm text-slate-500">{format(parseISO(list.date), 'dd/MM/yyyy')} — {list.residentName}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{list.guests?.length || 0} convidados</span>
                </div>
              </div>
              {list.guests && list.guests.length > 0 && (
                <div className="px-4 py-2 space-y-1">
                  {list.guests.map((guest: any) => (
                    <div key={guest.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{guest.name}</span>
                      <span className={`text-xs font-medium flex items-center gap-1 ${guest.arrived ? 'text-green-600' : 'text-slate-400'}`}>
                        {guest.arrived ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {guest.arrived ? 'Chegou' : 'Pendente'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConvidadosTab;
