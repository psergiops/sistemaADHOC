import React, { useMemo } from 'react';
import { Package, Correspondencia } from '../types';
import { Package as PackageIcon, Mail } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EncomendasTabProps {
  packages: Package[];
  correspondencias: Correspondencia[];
  clientId: string;
  unit: string;
}

const statusColor: Record<string, string> = {
  'Received': 'bg-blue-100 text-blue-700',
  'Awaiting Pickup': 'bg-orange-100 text-orange-700',
  'Picked Up': 'bg-green-100 text-green-700',
  'Recebido': 'bg-blue-100 text-blue-700',
  'Entregue': 'bg-green-100 text-green-700',
  'Retirado': 'bg-slate-100 text-slate-600',
};

const normalizeUnit = (u: string) => u.replace(/\D/g, '');

const EncomendasTab: React.FC<EncomendasTabProps> = ({ packages, correspondencias, clientId, unit }) => {
  const myPackages = useMemo(() => {
    const unitNumbers = normalizeUnit(unit);
    return packages
      .filter(p => {
        if (p.clientId !== clientId || !p.recipientUnit) return false;
        const pkgUnitNumbers = normalizeUnit(p.recipientUnit);
        return pkgUnitNumbers === unitNumbers || p.recipientUnit.toLowerCase().includes(unit.toLowerCase()) || unit.toLowerCase().includes(p.recipientUnit.toLowerCase());
      })
      .sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime());
  }, [packages, clientId, unit]);

  const myCorrespondencias = useMemo(() => {
    const unitNumbers = normalizeUnit(unit);
    return correspondencias
      .filter(c => {
        if (c.clientId !== clientId) return false;
        const destNumbers = normalizeUnit(c.destinatario);
        return destNumbers === unitNumbers || c.destinatario.toLowerCase().includes(unit.toLowerCase()) || unit.toLowerCase().includes(c.destinatario.toLowerCase());
      })
      .sort((a, b) => new Date(b.dataRecebimento).getTime() - new Date(a.dataRecebimento).getTime());
  }, [correspondencias, clientId, unit]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <PackageIcon size={20} className="text-orange-600" />
          Encomendas
        </h2>
        {myPackages.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <PackageIcon size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma encomenda registrada para {unit}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPackages.map(pkg => (
              <div key={pkg.id} className="border border-slate-200 rounded-lg p-4 flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-800">{pkg.description}</p>
                  <p className="text-sm text-slate-500 mt-1">Remetente: {pkg.senderName}</p>
                  <p className="text-sm text-slate-500">Recebido em: {format(parseISO(pkg.receivedDate), 'dd/MM/yyyy HH:mm')}</p>
                  {pkg.pickedUpBy && (
                    <p className="text-sm text-slate-500">Retirado por: {pkg.pickedUpBy} em {pkg.pickedUpDate && format(parseISO(pkg.pickedUpDate), 'dd/MM/yyyy')}</p>
                  )}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${statusColor[pkg.status] || 'bg-slate-100 text-slate-600'}`}>
                  {pkg.status === 'Received' ? 'Recebido' : pkg.status === 'Awaiting Pickup' ? 'Aguardando Retirada' : pkg.status === 'Picked Up' ? 'Retirado' : pkg.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Mail size={20} className="text-blue-600" />
          Correspondências
        </h2>
        {myCorrespondencias.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <Mail size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma correspondência registrada para {unit}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myCorrespondencias.map(corr => (
              <div key={corr.id} className="border border-slate-200 rounded-lg p-4 flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-800">{corr.remetente}</p>
                  <p className="text-sm text-slate-500 mt-1">Tipo: {corr.tipo}</p>
                  <p className="text-sm text-slate-500">Recebido em: {format(parseISO(corr.dataRecebimento), 'dd/MM/yyyy HH:mm')}</p>
                  {corr.observacao && <p className="text-sm text-slate-500">Obs: {corr.observacao}</p>}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${statusColor[corr.status] || 'bg-slate-100 text-slate-600'}`}>
                  {corr.status}
                </span>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-400 mt-4">
          Para retirar suas encomendas/correspondências, dirija-se à portaria do condomínio.
        </p>
      </div>
    </div>
  );
};

export default EncomendasTab;
