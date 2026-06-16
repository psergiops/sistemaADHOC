
import React, { useState, useMemo } from 'react';
import { Resident, Reservation, Package, GuestList, Client } from '../types';
import { format, parseISO, isPast } from 'date-fns';
import {
  CalendarDays, Package as PackageIcon, Users, Menu, HelpCircle, Clock,
  CheckCircle2, AlertCircle, X, Search, Building2, MapPin
} from 'lucide-react';

interface ResidentPortalViewProps {
  resident: Resident;
  reservations: Reservation[];
  packages: Package[];
  guestLists: GuestList[];
  clients: Client[];
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 text-sm";

type Tab = 'reservas' | 'encomendas' | 'visitantes';

const ResidentPortalView: React.FC<ResidentPortalViewProps> = ({
  resident, reservations, packages, guestLists, clients, onToggleMenu, onShowHelp
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('reservas');

  const client = clients.find(c => c.id === resident.clientId);

  const clientReservations = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservations
      .filter(r => r.clientId === resident.clientId && new Date(r.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [reservations, resident.clientId]);

  const myPackages = useMemo(() => {
    return packages
      .filter(p => p.clientId === resident.clientId && p.recipientUnit?.toLowerCase() === resident.unit.toLowerCase() && p.status !== 'Picked Up')
      .sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime());
  }, [packages, resident.clientId, resident.unit]);

  const myGuestLists = useMemo(() => {
    return guestLists
      .filter(g => g.clientId === resident.clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [guestLists, resident.clientId]);

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggleMenu} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Portal do Morador</h1>
            <p className="text-sm text-slate-500">Bem-vindo, {resident.name} — {client?.name || resident.origin}</p>
          </div>
        </div>
        <button onClick={onShowHelp} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Ajuda">
          <HelpCircle size={20} />
        </button>
      </div>

      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-1">
          {(['reservas', 'encomendas', 'visitantes'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {tab === 'reservas' && <CalendarDays size={16} />}
              {tab === 'encomendas' && <PackageIcon size={16} />}
              {tab === 'visitantes' && <Users size={16} />}
              {tab === 'reservas' ? 'Reservas' : tab === 'encomendas' ? 'Encomendas' : 'Visitantes'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">

          {/* Reservas */}
          {activeTab === 'reservas' && (
            <div className="space-y-4">
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
            </div>
          )}

          {/* Encomendas */}
          {activeTab === 'encomendas' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <PackageIcon size={20} className="text-orange-600" />
                  Minhas Encomendas
                </h2>
                {myPackages.length === 0 ? (
                  <div className="text-center py-6 text-slate-400">
                    <PackageIcon size={40} className="mx-auto mb-3 opacity-30" />
                    <p>Nenhuma encomenda registrada para {resident.unit}.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myPackages.map(pkg => (
                      <div key={pkg.id} className="border border-slate-200 rounded-lg p-4 flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-800">{pkg.description}</p>
                          <p className="text-sm text-slate-500 mt-1">Remetente: {pkg.senderName}</p>
                          <p className="text-sm text-slate-500">Recebido em: {format(parseISO(pkg.receivedDate), 'dd/MM/yyyy HH:mm')}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-orange-100 text-orange-700 whitespace-nowrap">
                          Aguardando Retirada
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-4">
                  Para retirar suas encomendas, dirija-se à portaria do condomínio.
                </p>
              </div>
            </div>
          )}

          {/* Visitantes */}
          {activeTab === 'visitantes' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Users size={20} className="text-purple-600" />
                  Lista de Visitantes
                </h2>
                {myGuestLists.length === 0 ? (
                  <div className="text-center py-6 text-slate-400">
                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                    <p>Nenhuma lista de visitantes registrada.</p>
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
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResidentPortalView;
