
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, createStaffAuthClient } from './lib/supabaseClient';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import TeamView from './components/TeamView';
import ClientView from './components/ClientView';
import SupplierView from './components/SupplierView';
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
  Staff, Client, Shift, Supplier, Transaction, Paystub, Announcement,
  DataChangeRequest, VehicleChecklist, Patrol, Post, EntryLog, GuestList,
  Reservation, MaterialRequest, InventoryItem, InventoryMovement, AuditLog,
  PermissionConfig
} from './types';

import {
  MOCK_STAFF, MOCK_CLIENTS, INITIAL_SHIFTS, MOCK_SUPPLIERS, MOCK_TRANSACTIONS,
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
  const [currentView, setCurrentView] = useState('calendar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- App Data State ---
  // If Supabase is configured, we start empty and wait for fetch. If not, we use Mocks.
  const [staff, setStaff] = useState<Staff[]>(isSupabaseConfigured ? [] : MOCK_STAFF);
  const [clients, setClients] = useState<Client[]>(isSupabaseConfigured ? [] : MOCK_CLIENTS);
  const [shifts, setShifts] = useState<Shift[]>(isSupabaseConfigured ? [] : INITIAL_SHIFTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(isSupabaseConfigured ? [] : MOCK_SUPPLIERS);
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
    if (table === 'staff' && flat.documents) {
      flat.cpf = flat.documents.cpf;
      flat.rg = flat.documents.rg;
      flat.rgissuedate = flat.documents.rgIssueDate;
      flat.cnv = flat.documents.cnv;
      flat.pis = flat.documents.pis;
      flat.cnhnumber = flat.documents.cnhNumber;
      flat.cnhtype = flat.documents.cnhType;
      flat.voterid = flat.documents.voterId;
      flat.reservistcertificate = flat.documents.reservistCertificate;
      flat.reservistnotapplicable = flat.documents.reservistNotApplicable;
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

    const result: any = {};
    Object.keys(flat).forEach(key => {
      const newKey = replacements[key] || key.toLowerCase();
      // Convert undefined to null for SQL
      result[newKey] = flat[key] === undefined ? null : flat[key];
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
        emergencyPhone: d('emergencyphone'), educationLevel: d('educationlevel'),
        role: d('role'), sector: d('sector'), regime: d('regime'), contractType: d('contracttype'),
        contractEndDate: d('contractenddate'), admissionDate: d('admissiondate'),
        preferredShifts: d('preferredshifts') || [], salary: d('salary'), paymentDay: d('paymentday'),
        takesAdvance: d('takesadvance'), advanceValue: d('advancevalue'), advanceDay: d('advanceday'),
        fatherName: d('fathername'), motherName: d('mothername'), dependents: d('dependents') || []
      } as Staff;
    }

    if (table === 'clients') {
      return {
        id: d('id'),
        code: d('code'),
        name: d('name'),
        contactPerson: d('contactperson'),
        email: d('email'),
        phone: d('phone'),
        avatar: d('avatar'),
        address,
        serviceType: d('servicetype'),
        contractValue: d('contractvalue'),
        contractStartDate: d('contractstartdate'),
        paymentDay: d('paymentday'),
        isActive: d('isactive'),
        notes: d('notes'),
        requiredStaffCount: d('requiredstaffcount'),
        assignedStaffIds: d('assignedstaffids') || []
      } as Client;
    }

    if (table === 'suppliers') {
      return {
        id: d('id'),
        code: d('code'),
        name: d('name'),
        category: d('category'),
        contactPerson: d('contactperson'),
        email: d('email'),
        phone: d('phone'),
        address,
        notes: d('notes'),
        isRecurring: d('isrecurring'),
        contractValue: d('contractvalue'),
        paymentDay: d('paymentday')
      } as Supplier;
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
          const { data: staffData } = await supabase.from('staff').select('*');
          if (staffData) setStaff(staffData.map(d => unflattenData('staff', d)));

          const { data: clientData } = await supabase.from('clients').select('*');
          if (clientData) setClients(clientData.map(d => unflattenData('clients', d)));

          const { data: supplierData } = await supabase.from('suppliers').select('*');
          if (supplierData) setSuppliers(supplierData.map(d => unflattenData('suppliers', d)));

          const { data: shiftData } = await supabase.from('shifts').select('*');
          if (shiftData) setShifts(shiftData.map(mapShiftFromDB));

        } catch (error: any) {
          console.error("Error loading data:", error);
        }
      };
      fetchData();
    }
  }, []);

  // --- Handlers for CRUD Operations with Supabase ---
  const saveToSupabase = async (table: string, data: any) => {
    if (!isSupabaseConfigured) {
      console.warn("Supabase not configured, skipping save.");
      return;
    }

    // Apply Flattening
    const payload = flattenData(table, data);
    console.log(`[DEBUG] Saving to ${table}:`, payload);

    const { error } = await supabase.from(table).upsert(payload);

    if (error) {
      console.error(`Erro ao salvar em ${table}:`, error);
    } else {
      console.log(`[DEBUG] Saved successfully to ${table}`);
    }
  };

  // --- Auth Handlers ---
  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
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
          password: password
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

  // --- Render ---

  if (!isAuthenticated) {
    return <LoginView staffList={staff} onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'calendar':
        return (
          <div className="flex flex-col h-full">
            {calendarViewMode === 'month' ? (
              <div className="h-full flex flex-col">
                <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800">Escala Mensal</h2>
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
        return <TeamView staff={staff} onAddStaff={handleAddStaff} onBulkAddStaff={(list) => { setStaff([...staff, ...list]); list.forEach(s => saveToSupabase('staff', s)); }} onUpdateStaff={(s) => { setStaff(staff.map(ex => ex.id === s.id ? s : ex)); saveToSupabase('staff', s); }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'clients':
        return <ClientView clients={clients} staff={staff} onAddClient={(c) => { setClients([...clients, c]); saveToSupabase('clients', c); }} onBulkAddClients={(list) => { setClients([...clients, ...list]); list.forEach(c => saveToSupabase('clients', c)); }} onUpdateClient={(c) => { setClients(clients.map(ex => ex.id === c.id ? c : ex)); saveToSupabase('clients', c); }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'suppliers':
        return <SupplierView suppliers={suppliers} onAddSupplier={(s) => { setSuppliers([...suppliers, s]); saveToSupabase('suppliers', s); }} onBulkAddSuppliers={(list) => { setSuppliers([...suppliers, ...list]); list.forEach(s => saveToSupabase('suppliers', s)); }} onUpdateSupplier={(s) => { setSuppliers(suppliers.map(ex => ex.id === s.id ? s : ex)); saveToSupabase('suppliers', s); }} onDeleteSupplier={(id) => { setSuppliers(suppliers.filter(s => s.id !== id)); if (isSupabaseConfigured) supabase.from('suppliers').delete().eq('id', id); }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
      case 'financial':
        return <FinancialView transactions={transactions} clients={clients} suppliers={suppliers} staff={staff} onAddTransaction={(t) => { setTransactions([...transactions, t]); saveToSupabase('transactions', t); }} onUpdateTransaction={(t) => { setTransactions(transactions.map(ex => ex.id === t.id ? t : ex)); saveToSupabase('transactions', t); }} onDeleteTransaction={(id) => { setTransactions(transactions.filter(t => t.id !== id)); if (isSupabaseConfigured) supabase.from('transactions').delete().eq('id', id); }} onToggleMenu={() => setIsSidebarOpen(true)} onShowHelp={() => setIsHelpOpen(true)} />;
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
