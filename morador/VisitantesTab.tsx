import React, { useMemo } from 'react';
import { EntryLog } from '../types';
import { UserCheck, Clock, Car, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface VisitantesTabProps {
  entryLogs: EntryLog[];
  clientId: string;
  unit: string;
}

const normalizeUnit = (u: string) => u.replace(/\D/g, '');

const VisitantesTab: React.FC<VisitantesTabProps> = ({ entryLogs, clientId, unit }) => {
  const myVisitors = useMemo(() => {
    const unitNumbers = normalizeUnit(unit);
    return entryLogs
      .filter(l => {
        if (l.clientId !== clientId || l.type !== 'Visitor') return false;
        if (!l.unit) return false;
        const logUnitNumbers = normalizeUnit(l.unit);
        return logUnitNumbers === unitNumbers || l.unit.toLowerCase().includes(unit.toLowerCase()) || unit.toLowerCase().includes(l.unit.toLowerCase());
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [entryLogs, clientId, unit]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <UserCheck size={20} className="text-teal-600" />
        Visitantes da Unidade {unit}
      </h2>
      {myVisitors.length === 0 ? (
        <div className="text-center py-6 text-slate-400">
          <UserCheck size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhum visitante registrado para sua unidade.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myVisitors.map(visitor => (
            <div key={visitor.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-800">{visitor.name}</p>
                  {visitor.document && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <FileText size={12} />
                      Documento: {visitor.document}
                    </p>
                  )}
                  {visitor.vehicleModel && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Car size={12} />
                      {visitor.vehicleModel} {visitor.vehiclePlate && `— ${visitor.vehiclePlate}`}
                    </p>
                  )}
                  {visitor.notes && (
                    <p className="text-sm text-slate-500 mt-1">Obs: {visitor.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    {format(parseISO(visitor.timestamp), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitantesTab;
