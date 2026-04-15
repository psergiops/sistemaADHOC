import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { supabase, isSupabaseConfigured, createStaffAuthClient } from './lib/supabaseClient';
import LoginView from './components/LoginView';
import ChangePasswordView from './components/ChangePasswordView';
import Sidebar from './components/Sidebar';
import TeamView from './components/TeamView';
import FinancialView from './components/FinancialView';
import HRPortalView from './components/HRPortalView';
import ChecklistView from './components/ChecklistView';
import PatrolView from './components/PatrolView';
import SocialView from './components/SocialView';
import ConciergeView from './components/ConciergeView';
import SettingsView from './components/SettingsView';
import AccessControlView from './components/AccessControlView';
import AuditLogView from './components/AuditLogView';
import InventoryView from './components/InventoryView';
import CalendarGrid from './components/CalendarGrid';
import DailyScheduleTable from './components/DailyScheduleTable';
import CreateShiftModal from './components/CreateShiftModal';
import ShiftCheckinReportModal from './components/ShiftCheckinReportModal';
import HelpCenterModal from './components/HelpCenterModal';

import {
  Staff, Client, Shift, Transaction, Paystub, Announcement,
  DataChangeRequest, VehicleChecklist, Patrol, Post, EntryLog, GuestList,
  Reservation, MaterialRequest, InventoryItem, InventoryMovement, AuditLog,
  PermissionConfig
} from './types';

import {
  MOCK_STAFF, MOCK_CLIENTS, INITIAL_SHIFTS, MOCK_TRANSACTIONS,
  MOCK_PAYSTUBS, MOCK_ANNOUNCEMENTS, MOCK_CHANGE_REQUESTS, MOCK_CHECKLISTS,
  MOCK_PATROLS, MOCK_POSTS, MOCK_ENTRY_LOGS, MOCK_GUEST_LISTS, MOCK_RESERVATIONS,
  MOCK_MATERIAL_REQUESTS, MOCK_INVENTORY_ITEMS, MOCK_INVENTORY_MOVEMENTS,
  MOCK_AUDIT_LOGS, DEFAULT_PERMISSIONS
} from './constants';

const App: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Staff | any>(null);

  // --- Navigation State ---
  const [currentView, setCurrentView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [initialPasswordHint, setInitialPasswordHint] = useState('');

  // --- App Data State ---
  // If Supabase is configured, we start empty and wait for fetch. If not, we use Mocks.
  const [staff, setStaff] = useState<Staff[]>(isSupabaseConfigured ? [] : MOCK_STAFF);
  const [clients, setClients] = useState<Client[]>(isSupabaseConfigured ? [] : MOCK_CLIENTS);
  const [shifts, setShifts] = useState<Shift[]>(isSupabaseConfigured ? [] : INITIAL_SHIFTS);
  const [transactions, setTransactions] = useState<Transaction[]>(isSupabaseConfigured ? [] : MOCK_TRANSACTIONS);
  const [paystubs, setPaystubs] = useState<Paystub[]>(isSupabaseConfigured ? [] : MOCK_PAYSTUBS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(isSupabaseConfigured ? [] : MOCK_ANNOUNCEMENTS);
  const [changeRequests, setChangeRequests] = useState<DataChangeRequest[]>(isSupabaseConfigured ? [] : MOCK_CHANGE_REQUESTS);
  const [checklists, setChecklists] = useState<VehicleChecklist[]>(isSupabaseConfigured ? [] : MOCK_CHECKLISTS);
  const [patrols, setPatrols] = useState<Patrol[]>(isSupabaseConfigured ? [] : MOCK_PATROLS);
  const [posts, setPosts] = useState<Post[]>(isSupabaseConfigured ? [] : MOCK_POSTS);
  const [entryLogs, setEntryLogs] = useState<EntryLog[]>(isSupabaseConfigured ? [] : MOCK_ENTRY_LOGS);
  const [guestLists, setGuestLists] = useState<GuestList[]>(isSupabaseConfigured ? [] : MOCK_GUEST_LISTS);
  const [reservations, setReservations] = useState<Reservation[]>(isSupabaseConfigured ? [] : MOCK_RESERVATIONS);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>(isSupabaseConfigured ? [] : MOCK_MATERIAL_REQUESTS);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(isSupabaseConfigured ? [] : MOCK_INVENTORY_ITEMS);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(isSupabaseConfigured ? [] : MOCK_INVENTORY_MOVEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(isSupabaseConfigured ? [] : MOCK_AUDIT_LOGS);
  const [permissions, setPermissions] = useState<PermissionConfig>(DEFAULT_PERMISSIONS);

  // --- Calendar Specific State ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'day'>('month');
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // --- System Modals State ---
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // --- MAPPERS: DB (Lowercase) <-> APP (CamelCase) ---

  // Converts App Object -> DB Object (Flattened & Lowercase Keys)
  const flattenData = (table: string, data: any) => {
    const flat: any = { ...data };

    // Flatten Address
    if (flat.address) {
      flat.zipcode = flat.address.zipCode;
      flat.street = flat.address.street;
      flat.number = flat.address.number;
      flat.complement = flat.address.complement;
      flat.district = flat.address.district;
      flat.city = flat.address.city;
      flat.state = flat.address.state;
      delete flat.address;
    }

    // Flatten Documents (Staff)
    // Handle nested objects by moving them to top-level for SQL columns
    // This handles 'address' and 'documents' for all tables (staff, clients, etc.)
    if (flat.address) {
      Object.keys(flat.address).forEach(k => {
        flat[k.toLowerCase()] = flat.address[k];
      });
      delete flat.address;
    }

    if (flat.documents) {
      Object.keys(flat.documents).forEach(k => {
        flat[k.toLowerCase()] = flat.documents[k];
      });
      delete flat.documents;
    }

    // Handle CamelCase -> Lowercase for specific fields
    const replacements: Record<string, string> = {
      'birthDate': 'birthdate', 'birthPlace': 'birthplace', 'maritalStatus': 'maritalstatus',
      'bloodType': 'bloodtype', 'emergencyPhone': 'emergencyphone', 'educationLevel': 'educationlevel',
      'contractType': 'contracttype', 'contractEndDate': 'contractenddate', 'admissionDate': 'admissiondate',
      'preferredShifts': 'preferredshifts', 'paymentDay': 'paymentday', 'takesAdvance': 'takesadvance',
      'advanceValue': 'advancevalue', 'advanceDay': 'advanceday', 'fatherName': 'fathername', 'motherName': 'mothername',
      'contactPerson': 'contactperson', 'serviceType': 'servicetype', 'contractValue': 'contractvalue',
      'contractStartDate': 'contractstartdate', 'isActive': 'isactive', 'requiredStaffCount': 'requiredstaffcount',
      'assignedStaffIds': 'assignedstaffids', 'isRecurring': 'isrecurring', 'staffId': 'staffid',
      'locationId': 'locationid', 'customStaffName': 'customstaffname', 'startTime': 'starttime',
      'endTime': 'endtime', 'recurrenceId': 'recurrenceid', 'vehicleModel': 'vehiclemodel', 'vehiclePlate': 'vehicleplate',
      'fuelLevel': 'fuellevel', 'generalNotes': 'generalnotes', 'residentName': 'residentname', 'eventName': 'eventname',
      'linkToken': 'linktoken', 'createdBy': 'createdby', 'resourceName': 'resourcename', 'reservedBy': 'reservedby',
      'minThreshold': 'minthreshold', 'itemId': 'itemid', 'itemName': 'itemname', 'referenceId': 'referenceid',
      'performedBy': 'performedby', 'actorId': 'actorid', 'actorName': 'actorname', 'actorRole': 'actorrole',
      'targetName': 'targetname', 'checkinTime': 'checkintime', 'shiftTimeReference': 'shifttimereference',
      'relatedClientId': 'relatedclientid', 'relatedSupplierId': 'relatedsupplierid'
    };


    Object.keys(replacements).forEach(key => {
      if (flat[key] !== undefined) {
        flat[replacements[key]] = flat[key];
        delete flat[key];
      }
    });

    const result: any = {};
    Object.keys(flat).forEach(key => {
      const newKey = key.toLowerCase();
      // Only include valid keys and convert undefined to null
      if (flat[key] !== undefined) {
        result[newKey] = flat[key];
      }
    });

    return result;
  };

  // Converts DB Object (Lowercase) -> App Object (CamelCase)
  const unflattenData = (table: string, data: any): any => {
    // Helper to access data safely (DB keys are lowercase)
    const d = (k: string) => data[k] || data[k.toLowerCase()];

    const address = {
      zipCode: d('zipcode') || '',
      street: d('street') || '',
      number: d('number') || '',
      complement: d('complement'),
      district: d('district') || '',
      city: d('city') || '',
      state: d('state') || ''
    };

    let result: any = { id: d('id') };

    if (table === 'staff') {
      return {
        id: d('id'),
        code: d('code'),
        name: d('name'),
        email: d('email'),
        phone: d('phone'),
        avatar: d('avatar'),
        address,
        documents: {
          cpf: d('cpf'), rg: d('rg'), rgIssueDate: d('rgissuedate'), cnv: d('cnv'),
          pis: d('pis'), cnhNumber: d('cnhnumber'), cnhType: d('cnhtype'),
          voterId: d('voterid'), reservistCertificate: d('reservistcertificate'),
          reservistNotApplicable: d('reservistnotapplicable')
        },
        birthDate: d('birthdate'), birthPlace: d('birthplace'), maritalStatus: d('maritalstatus'),
        race: d('race'), weight: d('weight'), height: d('height'), bloodType: d('bloodtype'),
        emergencyPhone: d('emergencyphone') || '', 
        educationLevel: d('educationlevel') || '',
        role: d('role') || 'Setor', 
        sector: d('sector') || '', 
        regime: d('regime') || 'CLT', 
        contractType: d('contracttype') || 'Indeterminado',
        contractEndDate: d('contractenddate') || '', 
        admissionDate: d('admissiondate') || '',
        preferredShifts: d('preferredshifts') || [], 
        salary: Number(d('salary')) || 0, 
        paymentDay: Number(d('paymentday')) || 5,
        takesAdvance: d('takesadvance') || false, 
        advanceValue: Number(d('advancevalue')) || 0, 
        advanceDay: Number(d('advanceday')) || 20,
        fatherName: d('fathername') || '', 
        motherName: d('mothername') || '', 
        dependents: d('dependents') || []
      } as Staff;
    }

    if (table === 'clients') {
      return {
        id: d('id') || `cli-${Date.now()}`,
        code: d('code') || '',
        name: d('name') || 'Empresa sem nome',
        contactPerson: d('contactperson') || '',
        email: d('email') || '',
        phone: d('phone') || '',
        avatar: d('avatar') || '',
        address,
        serviceType: d('servicetype') || 'Geral',
        contractValue: Number(d('contractvalue')) || 0,
        contractStartDate: d('contractstartdate') || '',
        paymentDay: d('paymentday') || 5,
        isActive: d('isactive') !== false, // Default to true if not explicitly false
        notes: d('notes') || '',
        requiredStaffCount: Number(d('requiredstaffcount')) || 0,
        assignedStaffIds: d('assignedstaffids') || []
      } as Client;
    }


    return data;
  };

  const mapShiftFromDB = (d: any): Shift => ({
    id: d.id,
    staffId: d.staffid || '',
    customStaffName: d.customstaffname,
    locationId: d.locationid || '',
    station: d.station,
    date: d.date,
    startTime: d.starttime || '',
    endTime: d.endtime || '',
    type: d.type,
    notes: d.notes,
    recurrenceId: d.recurrenceid
  });

  // --- Auth & Session Effect ---
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email;
        if (email === 'admin@ad-hoc.com') {
          setCurrentUser({
            id: session.user.id,
            name: 'Administrador do Sistema',
            role: 'Diretoria',
            avatar: 'https://ui-avatars.com/api/?name=Admin+System&background=0D8ABC&color=fff'
          });
          setIsAuthenticated(true);
        } else if (email) {
          supabase.from('staff').select('*').eq('email', email).single().then(({ data }) => {
            if (data) {
              const staffProfile = unflattenData('staff', data);
              setCurrentUser({
                ...staffProfile,
                avatar: staffProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staffProfile.name)}&background=0D8ABC&color=fff`
              });
              setIsAuthenticated(true);
            }
          });
        }
      }
    });

    // Listen to token expirations and logouts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Data Loading Effect ---
  useEffect(() => {
    if (isSupabaseConfigured) {
      const fetchData = async () => {
        try {
          console.log("🔄 Buscando todos os dados do Supabase...");
          
          const { data: staffData } = await supabase.from('staff').select('*');
          if (staffData) setStaff(staffData.map(d => unflattenData('staff', d)));

          const { data: clientData } = await supabase.from('clients').select('*');
          if (clientData) setClients(clientData.map(d => unflattenData('clients', d)));

          const { data: shiftData } = await supabase.from('shifts').select('*');
          if (shiftData) setShifts(shiftData.map(mapShiftFromDB));

          const { data: transData } = await supabase.from('transactions').select('*');
          if (transData) setTransactions(transData);

          const { data: payData } = await supabase.from('paystubs').select('*');
          if (payData) setPaystubs(payData);

          const { data: annData } = await supabase.from('announcements').select('*').order('date', { ascending: false });
          if (annData) setAnnouncements(annData);

          const { data: reqData } = await supabase.from('change_requests').select('*');
          if (reqData) setChangeRequests(reqData);

          const { data: chkData } = await supabase.from('vehicle_checklists').select('*');
          if (chkData) setChecklists(chkData);

          const { data: patData } = await supabase.from('patrols').select('*');
          if (patData) setPatrols(patData);

          const { data: postData } = await supabase.from('posts').select('*');
          if (postData) setPosts(postData);

          const { data: logData } = await supabase.from('entry_logs').select('*');
          if (logData) setEntryLogs(logData);

          const { data: guestData } = await supabase.from('guest_lists').select('*');
          if (guestData) setGuestLists(guestData);

          const { data: resData } = await supabase.from('reservations').select('*');
          if (resData) setReservations(resData);

          const { data: matData } = await supabase.from('material_requests').select('*');
          if (matData) setMaterialRequests(matData);

          const { data: invData } = await supabase.from('inventory_items').select('*');
          if (invData) setInventoryItems(invData);

          const { data: movData } = await supabase.from('inventory_movements').select('*');
          if (movData) setInventoryMovements(movData);

          const { data: auditData } = await supabase.from('audit_logs').select('*');
          if (auditData) setAuditLogs(auditData);

          console.log("✅ Dados carregados com sucesso!");
        } catch (error: any) {
          console.error("Erro geral no carregamento:", error);
        }
      };
      fetchData();
    }
  }, []);

  // --- Handlers for CRUD Operations with Supabase ---
  const saveToSupabase = async (table: string, data: any | any[]) => {
    if (!isSupabaseConfigured) {
      console.warn(`Supabase not configured, skipping save to ${table}.`);
      return;
    }

    try {
      // Apply Flattening for bulk or single item
      const payload = Array.isArray(data) 
        ? data.map(item => flattenData(table, item))
        : flattenData(table, data);
      
      console.log(`[DEBUG] Saving to ${table}:`, payload);

      const { error } = await supabase.from(table).upsert(payload);

      if (error) {
        console.error(`Erro ao salvar em ${table}:`, error.message, error.details);
        alert(`Erro ao salvar no banco (${table}): ${error.message}\n\nVerifique o console para mais detalhes.`);
      } else {
        console.log(`[DEBUG] Saved successfully to ${table}`);
      }
    } catch (err) {
      console.error(`Erro inesperado ao salvar em ${table}:`, err);
    }
  };

  // --- Auth Handlers ---
  const handleLogin = (user: any, authData?: any) => {
    // Se o usuário logou via Supabase Auth real, verificamos se ele deve trocar a senha
    if (authData?.user?.user_metadata?.must_change_password) {
      setInitialPasswordHint(authData.user.user_metadata.initial_password || '');
      setCurrentUser(user);
      setIsChangingPassword(true);
      return;
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsChangingPassword(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // --- Data Handlers (Update Local State & Save DB) ---

  const handleAddShift = (newShifts: Shift[]) => {
    setShifts(prev => [...prev, ...newShifts]);
    newShifts.forEach(s => saveToSupabase('shifts', s));
  };

  const handleUpdateShift = (updatedShift: Shift) => {
    setShifts(prev => prev.map(s => s.id === updatedShift.id ? updatedShift : s));
    saveToSupabase('shifts', updatedShift);
  };

  const handleDeleteShift = (id: string) => {
    setShifts(prev => prev.filter(s => s.id !== id));
    if (isSupabaseConfigured) supabase.from('shifts').delete().eq('id', id);
  };

  const handleAddStaff = async (staffData: Staff) => {
    if (isSupabaseConfigured) {
      try {
        const adminAuthClient = createStaffAuthClient();
        const cleanCpf = staffData.documents.cpf.replace(/\D/g, '');
        // Default to a fallback if for some reason the cpf is empty or too short.
        let password = cleanCpf.substring(0, 4);
        if (password.length < 4) password = password.padEnd(4, '0');

        const { data: authData, error: authError } = await adminAuthClient.auth.signUp({
          email: staffData.email,
          password: password,
          options: {
            data: { 
              name: staffData.name, 
              role: staffData.role,
              must_change_password: true,
              initial_password: password // Mantemos para validação na troca
            }
          }
        });

        if (authError) {
          console.error("Erro ao criar login (Auth) do funcionário:", authError.message);
          alert("O perfil do funcionário será criado, mas houve um erro ao criar a credencial de login dele no banco: " + authError.message);
        } else if (authData.user) {
          staffData.id = authData.user.id;
        }
      } catch (err) {
        console.error("Falha ao usar cliente Auth secundário:", err);
      }
    }

    setStaff(prev => [...prev, staffData]);
    saveToSupabase('staff', staffData);
  };

  const handleBulkAddStaff = async (list: Staff[]) => {
    try {
      const createLogins = confirm(`Deseja criar automaticamente os logins de acesso para estes ${list.length} colaboradores?\n\nA senha inicial será os 4 primeiros dígitos do CPF.`);
      
      let finalStaffList = [...list];

      if (createLogins && isSupabaseConfigured) {
        // Prepara os dados para a função de servidor
        const usersToCreate = list.map(s => {
          const cleanCpf = s.documents.cpf.replace(/\D/g, '');
          let password = cleanCpf.substring(0, 4);
          if (password.length < 4) password = password.padEnd(4, '0');
          return { email: s.email, password, name: s.name, role: s.role };
        });

        // Chama a Edge Function no Supabase
        const { data, error: funcError } = await supabase.functions.invoke('bulk-create-users', {
          body: { users: usersToCreate }
        });

        if (funcError) {
          throw new Error(`Erro ao criar logins no servidor: ${funcError.message}`);
        }

        // Mapeia os IDs retornados para os registros locais
        if (data?.results) {
          finalStaffList = list.map(s => {
            const result = data.results.find((r: any) => r.email === s.email);
            return result && result.status === 'success' ? { ...s, id: result.id } : s;
          });
        }
      }

      // IMPORTANTE: Remove duplicatas da lista (evita o erro "ON CONFLICT")
      const uniqueStaff = finalStaffList.filter((v, i, a) => 
        a.findIndex(t => t.email === v.email) === i
      );

      // Salva na tabela staff
      setStaff(prev => {
        const existingEmails = new Set(prev.map(s => s.email));
        const newItems = uniqueStaff.filter(s => !existingEmails.has(s.email));
        return [...prev, ...newItems];
      });

      await saveToSupabase('staff', uniqueStaff);
      alert(`${uniqueStaff.length} colaboradores importados com sucesso!`);

    } catch (error: any) {
      console.error("Erro na importação:", error);
      alert(`Erro na importação: ${error.message}`);
    }
  };

  // --- Render ---

  if (!isAuthenticated && !isChangingPassword) {
    return <LoginView staffList={staff} onLogin={handleLogin} />;
  }

  if (isChangingPassword) {
    return (
      <ChangePasswordView 
        initialPasswordHint={initialPasswordHint} 
        onSuccess={() => { setIsChangingPassword(false); setIsAuthenticated(true); }}
        onLogout={handleLogout}
      />
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#EBEBEB] p-8 text-center animate-in fade-in zoom-in duration-500 relative">
             {/* Botão de Menu para Mobile na Home */}
             <div className="absolute top-4 left-4 md:hidden">
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="p-2 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
               >
                 <Menu size={24} />
               </button>
             </div>

             <div className="w-20 h-20 bg-white border border-slate-200 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-300">
                <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
                  <defs>
                    <mask id="target-mask-home">
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      <rect x="43" y="0" width="14" height="100" fill="black" />
                      <rect x="0" y="43" width="100" height="14" fill="black" />
                    </mask>
                  </defs>
                  <g mask="url(#target-mask-home)">
                    <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="12" />
                    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="12" />
                  </g>
                </svg>
             </div>
             <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">AD-HOC</h1>
             <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em] mb-6">Developed by Underdog AID</p>
             <p className="text-xl text-slate-600 font-medium mt-4">
               Olá, <span className="text-red-600 font-bold">{currentUser?.name || 'Usuário'}</span>
             </p>
             <div className="mt-12 max-w-md text-slate-400 text-sm">
               Selecione um módulo no menu lateral para começar as operações.
             </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="flex flex-col h-full">
            {calendarViewMode === 'month' ? (
              <div className="h-full flex flex-col">
                <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsSidebarOpen(true)}
                      className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      <Menu size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">Escala Mensal</h2>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setCalendarViewMode('day')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
                      Ver Diário (Postos)
                    </button>
                    <button onClick={() => { setEditingShift(null); setIsShiftModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      + Nova Escala
                    </button>
                    <button onClick={() => setIsReportModalOpen(true)} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900">
                      Relatório de Turno
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden p-4 bg-[#EBEBEB]">
                  <CalendarGrid
                    currentDate={currentDate}
                    shifts={shifts}
                    staff={staff}
                    onShiftClick={(shift) => { setEditingShift(shift); setIsShiftModalOpen(true); }}
                    onDayClick={(date) => { setCurrentDate(date); setCalendarViewMode('day'); }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setCalendarViewMode('month')} className="text-slate-500 hover:text-slate-800">
                      &larr; Voltar ao Mês
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">Escala Diária</h2>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingShift(null); setIsShiftModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      + Nova Escala
                    </button>
                  </div>
                </div>
                <DailyScheduleTable
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  shifts={shifts}
                  staff={staff}
                  clients={clients}
                  onAddShift={(s) => handleAddShift([s])}
                  onUpdateShift={handleUpdateShift}
                  onDeleteShift={handleDeleteShift}
                />
              </div>
            )}
          </div>
        );
      case 'team':
        return <TeamView staff={staff} onAddStaff={handleAddStaff} onBulkAddStaff={handleBulkAddStaff} onUpdateStaff={(s) => { setStaff(staff.map(ex => ex.id === s.id ? s : ex)); saveToSupabase('staff', s); }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'clients':
        return <ClientView clients={clients} staff={staff} onAddClient={(c) => { setClients([...clients, c]); saveToSupabase('clients', c); }} onBulkAddClients={(list) => { setClients([...clients, ...list]); saveToSupabase('clients', list); }} onUpdateClient={(c) => { setClients(clients.map(ex => ex.id === c.id ? c : ex)); saveToSupabase('clients', c); }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'financial':
        return <FinancialView transactions={transactions} clients={clients} staff={staff} onAddTransaction={(t) => { setTransactions([...transactions, t]); saveToSupabase('transactions', t); }} onUpdateTransaction={(t) => { setTransactions(transactions.map(ex => ex.id === t.id ? t : ex)); saveToSupabase('transactions', t); }} onDeleteTransaction={(id) => { setTransactions(transactions.filter(t => t.id !== id)); if (isSupabaseConfigured) supabase.from('transactions').delete().eq('id', id); }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'portal':
        return <HRPortalView staff={staff} shifts={shifts} clients={clients} paystubs={paystubs} announcements={announcements} changeRequests={changeRequests} materialRequests={materialRequests} onAddPaystub={(p) => { setPaystubs([...paystubs, p]); saveToSupabase('paystubs', p); }} onAddAnnouncement={(a) => { setAnnouncements([a, ...announcements]); saveToSupabase('announcements', a); }} onRequestChange={(req) => { setChangeRequests([...changeRequests, req]); saveToSupabase('change_requests', req); }} onManageRequest={(id, status, just) => { const updated = changeRequests.map(r => r.id === id ? { ...r, status, hrJustification: just, resolvedAt: new Date().toISOString() } : r); setChangeRequests(updated); const req = updated.find(r => r.id === id); if (req) saveToSupabase('change_requests', req); }} onUpdateStaff={(s) => { setStaff(staff.map(ex => ex.id === s.id ? s : ex)); saveToSupabase('staff', s); }} onUpdateMaterialRequest={(req) => { setMaterialRequests(materialRequests.map(m => m.id === req.id ? req : m)); saveToSupabase('material_requests', req); }} currentUser={currentUser} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'checklist':
        return <ChecklistView checklists={checklists} staff={staff} clients={clients} onAddChecklist={(c) => { setChecklists([c, ...checklists]); saveToSupabase('vehicle_checklists', c); }} currentUser={currentUser} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'patrol':
        return <PatrolView patrols={patrols} staff={staff} clients={clients} onAddPatrol={(p) => { setPatrols([p, ...patrols]); saveToSupabase('patrols', p); }} currentUser={currentUser} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'social':
        return <SocialView posts={posts} staff={staff} currentUser={currentUser} clients={clients} onAddPost={(p) => { setPosts([p, ...posts]); saveToSupabase('posts', p); }} onUpdatePost={(p) => { setPosts(posts.map(ex => ex.id === p.id ? p : ex)); saveToSupabase('posts', p); }} onDeletePost={(id) => { setPosts(posts.filter(p => p.id !== id)); if (isSupabaseConfigured) supabase.from('posts').delete().eq('id', id); }} onLikePost={(pid, uid) => { const updated = posts.map(p => p.id === pid ? { ...p, likes: p.likes.includes(uid) ? p.likes.filter(id => id !== uid) : [...p.likes, uid] } : p); setPosts(updated); const p = updated.find(x => x.id === pid); if (p) saveToSupabase('posts', p); }} onCommentPost={(pid, comment) => { const updated = posts.map(p => p.id === pid ? { ...p, comments: [...p.comments, comment] } : p); setPosts(updated); const p = updated.find(x => x.id === pid); if (p) saveToSupabase('posts', p); }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'concierge':
        return <ConciergeView logs={entryLogs} guestLists={guestLists} reservations={reservations} materialRequests={materialRequests} staff={staff} clients={clients} currentUser={currentUser} onAddLog={(l) => { setEntryLogs([l, ...entryLogs]); saveToSupabase('entry_logs', l); }} onAddGuestList={(l) => { setGuestLists([l, ...guestLists]); saveToSupabase('guest_lists', l); }} onAddReservation={(r) => { setReservations([...reservations, r]); saveToSupabase('reservations', r); }} onAddMaterialRequest={(m) => { setMaterialRequests([...materialRequests, m]); saveToSupabase('material_requests', m); }} onUpdateGuestList={(l) => { setGuestLists(guestLists.map(gl => gl.id === l.id ? l : gl)); saveToSupabase('guest_lists', l); }} onDeleteGuestList={(id) => { setGuestLists(guestLists.filter(gl => gl.id !== id)); if (isSupabaseConfigured) supabase.from('guest_lists').delete().eq('id', id); }} onDeleteReservation={(id) => { setReservations(reservations.filter(r => r.id !== id)); if (isSupabaseConfigured) supabase.from('reservations').delete().eq('id', id); }} onDeleteMaterialRequest={(id) => { setMaterialRequests(materialRequests.filter(m => m.id !== id)); if (isSupabaseConfigured) supabase.from('material_requests').delete().eq('id', id); }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'inventory':
        return <InventoryView items={inventoryItems} movements={inventoryMovements} currentUser={currentUser} onAddItem={(i) => { setInventoryItems([...inventoryItems, i]); saveToSupabase('inventory_items', i); }} onStockEntry={(code, qty, ref, staffId) => { const item = inventoryItems.find(i => i.code === code); if (item) { const updatedItem = { ...item, quantity: item.quantity + qty }; setInventoryItems(inventoryItems.map(i => i.id === item.id ? updatedItem : i)); saveToSupabase('inventory_items', updatedItem); const movement: InventoryMovement = { id: `mov-${Date.now()}`, itemId: item.id, itemName: item.name, type: 'IN', quantity: qty, date: new Date().toISOString(), referenceId: ref, performedBy: staffId }; setInventoryMovements([movement, ...inventoryMovements]); saveToSupabase('inventory_movements', movement); } }} onStockAdjustment={(itemId, qty, type, notes, staffId) => { const item = inventoryItems.find(i => i.id === itemId); if (item) { const diff = qty - item.quantity; const updatedItem = { ...item, quantity: qty }; setInventoryItems(inventoryItems.map(i => i.id === item.id ? updatedItem : i)); saveToSupabase('inventory_items', updatedItem); const movement: InventoryMovement = { id: `mov-${Date.now()}`, itemId: item.id, itemName: item.name, type: diff >= 0 ? 'IN' : 'OUT', quantity: diff, date: new Date().toISOString(), notes, performedBy: staffId }; setInventoryMovements([movement, ...inventoryMovements]); saveToSupabase('inventory_movements', movement); } }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'access-control':
        return <AccessControlView permissions={permissions} onUpdatePermissions={(p) => { setPermissions(p); /* Save to settings/config table if needed */ }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'audit-log':
        return <AuditLogView logs={auditLogs} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'settings':
        return <SettingsView currentTheme="light" onThemeChange={() => { }} currentFontSize="medium" onFontSizeChange={() => { }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      default:
        return <div>View Not Found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden font-sans text-slate-900">
      <Sidebar
        currentView={currentView as any}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        onOpenHelp={() => setIsHelpOpen(true)}
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        permissions={permissions}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Global Modals */}
      <CreateShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        onSave={handleAddShift}
        onDelete={handleDeleteShift}
        staffList={staff}
        clientList={clients}
        initialDate={currentDate}
        shiftToEdit={editingShift}
      />

      <ShiftCheckinReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        checkins={[]} // Would be populated from DB/State in real scenario
        shifts={shifts}
        staff={staff}
        clients={clients}
      />

      <HelpCenterModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        initialTopicId={currentView}
      />
    </div>
  );
};

export default App;
