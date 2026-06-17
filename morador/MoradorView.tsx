import React, { useState } from 'react';
import { Resident, Reservation, Package, GuestList, EntryLog, Correspondencia, Client } from '../types';
import { Menu, HelpCircle, CalendarDays, Package as PackageIcon, Users, UserCheck } from 'lucide-react';
import ReservasTab from './ReservasTab';
import ConvidadosTab from './ConvidadosTab';
import VisitantesTab from './VisitantesTab';
import EncomendasTab from './EncomendasTab';

interface MoradorViewProps {
  resident: Resident;
  reservations: Reservation[];
  packages: Package[];
  guestLists: GuestList[];
  entryLogs: EntryLog[];
  correspondencias: Correspondencia[];
  clients: Client[];
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

type Tab = 'reservas' | 'convidados' | 'visitantes' | 'encomendas';

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'reservas', label: 'Reservas', icon: <CalendarDays size={16} /> },
  { key: 'convidados', label: 'Convidados', icon: <Users size={16} /> },
  { key: 'visitantes', label: 'Visitantes', icon: <UserCheck size={16} /> },
  { key: 'encomendas', label: 'Encomendas', icon: <PackageIcon size={16} /> },
];

const MoradorView: React.FC<MoradorViewProps> = ({
  resident, reservations, packages, guestLists, entryLogs, correspondencias, clients,
  onToggleMenu, onShowHelp
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('reservas');
  const client = clients.find(c => c.id === resident.clientId);

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] dark:bg-[#091D2E] transition-colors duration-200">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleMenu} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Módulo do Morador</h1>
            <p className="text-sm text-slate-500">Bem-vindo, {resident.name} — {client?.name || resident.origin}</p>
          </div>
        </div>
        <button onClick={onShowHelp} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Ajuda">
          <HelpCircle size={20} />
        </button>
      </div>

      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'reservas' && <ReservasTab reservations={reservations} clientId={resident.clientId} />}
          {activeTab === 'convidados' && <ConvidadosTab guestLists={guestLists} clientId={resident.clientId} />}
          {activeTab === 'visitantes' && <VisitantesTab entryLogs={entryLogs} clientId={resident.clientId} unit={resident.unit} />}
          {activeTab === 'encomendas' && <EncomendasTab packages={packages} correspondencias={correspondencias} clientId={resident.clientId} unit={resident.unit} />}
        </div>
      </div>
    </div>
  );
};

export default MoradorView;
