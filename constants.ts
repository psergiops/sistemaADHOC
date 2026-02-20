
import { Staff, Shift, Client, Supplier, Transaction, Paystub, Announcement, DataChangeRequest, VehicleChecklist, Patrol, PermissionConfig, Post, EntryLog, GuestList, Reservation, AuditLog, MaterialRequest, InventoryItem, InventoryMovement } from './types';
import { subDays, format, subHours, addDays } from 'date-fns';

export const MOCK_STAFF: Staff[] = [
  { 
    id: 'stf-1', 
    code: '0001',
    name: 'Carlos Silva', 
    email: 'carlos.silva@guardplan.com',
    phone: '(11) 99999-1111',
    role: 'Supervisor', 
    regime: 'CLT',
    contractType: 'Undetermined',
    admissionDate: '2022-03-15',
    preferredShifts: ['Day'],
    salary: 3500.00,
    paymentDay: 5,
    takesAdvance: true,
    advanceValue: 1400.00,
    advanceDay: 20,
    address: {
      street: 'Rua A', number: '10', district: 'Centro', city: 'São Paulo', state: 'SP', zipCode: '01000-000'
    },
    documents: { 
        cpf: '123.456.789-00', rg: '12.345.678-9', cnv: 'CNV-123456', 
        cnhNumber: '11223344', cnhType: 'AB'
    },
    birthDate: '1985-05-20',
    birthPlace: 'São Paulo/SP',
    maritalStatus: 'Married',
    dependents: []
  },
  { 
    id: 'stf-2', 
    code: '0002',
    name: 'Ana Oliveira', 
    email: 'ana.oliveira@guardplan.com',
    phone: '(11) 99999-2222',
    role: 'Concierge', 
    regime: 'CLT',
    contractType: 'Undetermined',
    admissionDate: '2023-01-10',
    preferredShifts: ['Day', 'Night'],
    salary: 2100.00,
    paymentDay: 5,
    takesAdvance: false,
    address: {
      street: 'Rua B', number: '20', district: 'Bela Vista', city: 'São Paulo', state: 'SP', zipCode: '01300-000'
    },
    documents: { cpf: '234.567.890-11', rg: '23.456.789-0' },
    birthDate: '1990-10-12',
    dependents: []
  },
  { 
    id: 'stf-3', 
    code: '0003',
    name: 'Roberto Santos', 
    email: 'roberto.santos@guardplan.com',
    phone: '(11) 99999-3333',
    role: 'Security', 
    regime: 'PJ',
    contractType: 'Determined',
    admissionDate: '2023-06-01',
    preferredShifts: ['Night'],
    salary: 2800.00,
    paymentDay: 10, // PJ recebe dia 10
    takesAdvance: false,
    address: {
      street: 'Rua C', number: '30', district: 'Pinheiros', city: 'São Paulo', state: 'SP', zipCode: '05400-000'
    },
    documents: { cpf: '345.678.901-22', rg: '34.567.890-1', cnv: 'CNV-987654' },
    dependents: []
  },
  { 
    id: 'stf-4', 
    code: '0004',
    name: 'Fernanda Lima', 
    email: 'fernanda.lima@guardplan.com',
    phone: '(11) 99999-4444',
    role: 'Security', 
    regime: 'Freelance',
    contractType: 'Temporary',
    admissionDate: '2024-01-15',
    preferredShifts: ['Day'],
    salary: 180.00, // Diária
    paymentDay: 1, // Pagamento imediato ou semanal (exemplo simplificado)
    takesAdvance: false,
    address: {
      street: 'Rua D', number: '40', district: 'Lapa', city: 'São Paulo', state: 'SP', zipCode: '05000-000'
    },
    documents: { cpf: '456.789.012-33', rg: '45.678.901-2', cnv: 'CNV-112233' },
    dependents: []
  },
  { 
    id: 'stf-5', 
    code: '0005',
    name: 'Marcos Souza', 
    email: 'marcos.souza@guardplan.com',
    phone: '(11) 99999-5555',
    role: 'Concierge', 
    regime: 'CLT',
    contractType: 'Undetermined',
    admissionDate: '2022-11-20',
    preferredShifts: ['Night'],
    salary: 2100.00,
    paymentDay: 5,
    takesAdvance: true,
    advanceValue: 840.00, // 40%
    advanceDay: 20,
    address: {
      street: 'Rua E', number: '50', district: 'Mooca', city: 'São Paulo', state: 'SP', zipCode: '03100-000'
    },
    documents: { cpf: '567.890.123-44', rg: '56.789.01-3' },
    dependents: []
  },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    code: '0001',
    name: 'Condomínio Residencial Vila Verde',
    contactPerson: 'Síndico João',
    email: 'adm@vilaverde.com',
    phone: '(11) 3333-4444',
    address: { street: 'Rua das Flores', number: '123', district: 'Jardins', city: 'São Paulo', state: 'SP', zipCode: '01400-000' },
    serviceType: 'Portaria 24h',
    contractValue: 15000.00,
    contractStartDate: '2023-01-01',
    paymentDay: 5,
    isActive: true,
    requiredStaffCount: 4,
    assignedStaffIds: ['stf-2', 'stf-5']
  },
  {
    id: 'cli-2',
    code: '0002',
    name: 'Empresarial Tower Center',
    contactPerson: 'Gerente Mariana',
    email: 'financeiro@towercenter.com.br',
    phone: '(11) 3333-5555',
    address: { street: 'Av. Paulista', number: '1000', district: 'Bela Vista', city: 'São Paulo', state: 'SP', zipCode: '01310-100' },
    serviceType: 'Vigilância',
    contractValue: 28500.00,
    contractStartDate: '2022-06-15',
    paymentDay: 10,
    isActive: true,
    requiredStaffCount: 6,
    assignedStaffIds: ['stf-1', 'stf-3']
  },
  {
    id: 'cli-3',
    code: '0003',
    name: 'Galpões Logísticos GLP',
    contactPerson: 'Ricardo Oliveira',
    email: 'ops@glp.com',
    phone: '(11) 3333-6666',
    address: { street: 'Rodovia Anhanguera', number: 'KM 25', district: 'Industrial', city: 'Cajamar', state: 'SP', zipCode: '07750-000' },
    serviceType: 'Ronda Motorizada',
    contractValue: 42000.00,
    contractStartDate: '2023-11-01',
    paymentDay: 15,
    isActive: true,
    requiredStaffCount: 8,
    assignedStaffIds: ['stf-4']
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    code: '0001',
    name: 'SegurEquip LTDA',
    category: 'Equipamentos',
    contactPerson: 'Marcos Vendas',
    email: 'vendas@segurequip.com',
    phone: '(11) 5555-0000',
    address: { street: 'Av. Industrial', number: '500', district: 'Barra Funda', city: 'São Paulo', state: 'SP', zipCode: '01100-000' },
    isRecurring: false
  },
  {
    id: 'sup-2',
    code: '0002',
    name: 'Uniforme & Cia',
    category: 'Uniformes',
    contactPerson: 'Julia Silva',
    email: 'contato@uniformecia.com',
    phone: '(11) 5555-1111',
    address: { street: 'Rua da Moda', number: '20', district: 'Bom Retiro', city: 'São Paulo', state: 'SP', zipCode: '01120-000' },
    isRecurring: true,
    contractValue: 1200.00,
    paymentDay: 10
  }
];

// Mock transactions for current month excluding automatic client revenue
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Compra de Radios HT',
    amount: 2500.00,
    type: 'expense',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    category: 'Equipamentos',
    status: 'paid',
    relatedSupplierId: 'sup-1'
  },
  {
    id: 'tx-2',
    description: 'Manutenção de Sistema',
    amount: 800.00,
    type: 'expense',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    category: 'Tecnologia',
    status: 'pending'
  }
];

// Generate some initial shifts for the current month
const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');

export const INITIAL_SHIFTS: Shift[] = [
  {
    id: 'sh-1',
    staffId: 'stf-1',
    locationId: 'cli-1',
    station: 'Portaria Principal',
    date: todayStr, // Ensure it shows up today
    startTime: '08:00',
    endTime: '18:00',
    type: 'Day'
  },
  {
    id: 'sh-2',
    staffId: 'stf-3',
    locationId: 'cli-1',
    station: 'Ronda Interna',
    date: todayStr,
    startTime: '18:00',
    endTime: '06:00',
    type: 'Night'
  },
  {
    id: 'sh-3',
    staffId: 'stf-2',
    locationId: 'cli-2',
    station: 'Recepção',
    date: todayStr,
    startTime: '08:00',
    endTime: '16:00',
    type: 'Day'
  },
  {
    id: 'sh-4',
    staffId: '',
    customStaffName: 'José (Freelancer)',
    locationId: 'cli-2',
    station: 'Garagem',
    date: todayStr,
    startTime: '08:00',
    endTime: '16:00',
    type: 'Day'
  }
];

export const MOCK_PAYSTUBS: Paystub[] = [
  {
    id: 'pay-1',
    staffId: 'stf-1',
    referenceMonth: '2025-01',
    uploadDate: '2025-02-05',
    url: '#',
    fileName: 'Holerite_01_2025.pdf'
  },
  {
    id: 'pay-2',
    staffId: 'stf-2',
    referenceMonth: '2025-01',
    uploadDate: '2025-02-05',
    url: '#',
    fileName: 'Holerite_01_2025.pdf'
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Nova Política de Uniformes',
    content: 'Atenção a todos os colaboradores, a partir do dia 01/03 teremos novos uniformes disponíveis para retirada na base. O uso é obrigatório a partir do dia 15/03.',
    date: '2025-02-10',
    authorName: 'RH Diretoria',
    priority: 'High'
  },
  {
    id: 'ann-2',
    title: 'Manutenção no Sistema de Ponto',
    content: 'O sistema de ponto eletrônico passará por manutenção neste domingo entre 02h e 04h da manhã. O registro deverá ser feito manualmente no livro de ocorrências.',
    date: '2025-02-12',
    authorName: 'TI Suporte',
    priority: 'Normal'
  }
];

export const MOCK_CHANGE_REQUESTS: DataChangeRequest[] = [
  {
    id: 'req-1',
    staffId: 'stf-2',
    type: 'Address',
    status: 'Pending',
    requestDate: '2025-02-15',
    newData: {
      city: 'São Bernardo do Campo',
      street: 'Rua Jurubatuba',
      number: '900',
      zipCode: '09725-000',
      district: 'Centro'
    },
    description: 'Mudança de residência. Solicito atualização para fins de VT.',
    attachmentUrl: '#comprovante'
  },
  {
    id: 'req-2',
    staffId: 'stf-1',
    type: 'Personal',
    status: 'Approved',
    requestDate: '2025-01-20',
    newData: {
      phone: '(11) 98888-7777'
    },
    description: 'Troca de número de celular.',
    resolvedAt: '2025-01-21',
    hrJustification: 'Atualizado no sistema.'
  }
];

export const MOCK_MATERIAL_REQUESTS: MaterialRequest[] = [
  {
    id: 'mat-1',
    staffId: 'stf-2',
    clientId: 'cli-1',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    status: 'Partial',
    notes: 'Produtos de limpeza acabando',
    items: [
      { id: 'mi-1', itemName: 'Detergente', quantity: 5, isDelivered: true },
      { id: 'mi-2', itemName: 'Saco de Lixo 100L', quantity: 2, isDelivered: false },
      { id: 'mi-3', itemName: 'Caneta Azul', quantity: 3, isDelivered: false }
    ]
  }
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'inv-1', code: 'LIM-001', name: 'Detergente', quantity: 20, minThreshold: 10, category: 'Limpeza' },
  { id: 'inv-2', code: 'LIM-002', name: 'Saco de Lixo 100L', quantity: 50, minThreshold: 20, category: 'Limpeza' },
  { id: 'inv-3', code: 'MAT-001', name: 'Caneta Azul', quantity: 15, minThreshold: 5, category: 'Escritório' },
  { id: 'inv-4', code: 'EPI-001', name: 'Luva de Latex M', quantity: 100, minThreshold: 30, category: 'EPI' },
  { id: 'inv-5', code: 'UNI-001', name: 'Camisa Polo G', quantity: 5, minThreshold: 8, category: 'Uniformes' }
];

export const MOCK_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  { 
    id: 'mov-1', itemId: 'inv-1', itemName: 'Detergente', type: 'IN', quantity: 30, 
    date: format(subDays(new Date(), 10), 'yyyy-MM-dd'), referenceId: 'NF-1234', performedBy: 'admin-master' 
  },
  { 
    id: 'mov-2', itemId: 'inv-1', itemName: 'Detergente', type: 'OUT', quantity: 5, 
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), referenceId: 'mat-1', performedBy: 'admin-master', notes: 'Entrega para Portaria' 
  }
];

export const MOCK_CHECKLISTS: VehicleChecklist[] = [
  {
    id: 'chk-1',
    date: format(subDays(new Date(), 1), "yyyy-MM-dd'T'10:00:00"),
    staffId: 'stf-3', // Roberto Santos (Security)
    clientId: 'cli-3', // Galpões Logísticos GLP (Ronda Motorizada)
    vehicleModel: 'Gol G6 1.6 - Branco',
    vehiclePlate: 'ABC-1234',
    odometer: 154200,
    fuelLevel: 75,
    photos: [],
    items: [
      { id: '1', label: 'Pneus', status: 'ok' },
      { id: '2', label: 'Faróis', status: 'ok' },
      { id: '3', label: 'Lataria', status: 'issue', notes: 'Risco porta motorista' },
      { id: '4', label: 'Estepe', status: 'ok' },
      { id: '5', label: 'Documentos', status: 'ok' },
      { id: '6', label: 'Rádio HT', status: 'ok' },
      { id: '7', label: 'Lanterna', status: 'issue', notes: 'Sem bateria' }
    ],
    generalNotes: 'Viatura entregue no horário, com pequeno risco na lateral.'
  },
  {
    id: 'chk-2',
    date: format(subDays(new Date(), 0), "yyyy-MM-dd'T'06:00:00"),
    staffId: 'stf-4', // Fernanda Lima
    clientId: 'cli-3', // Galpões Logísticos GLP
    vehicleModel: 'Uno Way - Prata',
    vehiclePlate: 'XYZ-9876',
    odometer: 89500,
    fuelLevel: 40,
    photos: [],
    items: [
      { id: '1', label: 'Pneus', status: 'ok' },
      { id: '2', label: 'Faróis', status: 'issue', notes: 'Farol esquerdo queimado' },
      { id: '3', label: 'Lataria', status: 'ok' },
      { id: '4', label: 'Estepe', status: 'ok' },
      { id: '5', label: 'Documentos', status: 'ok' },
      { id: '6', label: 'Rádio HT', status: 'ok' },
      { id: '7', label: 'Lanterna', status: 'ok' }
    ]
  }
];

export const MOCK_PATROLS: Patrol[] = [
  {
    id: 'pat-1',
    date: format(subDays(new Date(), 0), "yyyy-MM-dd'T'23:15:00"),
    staffId: 'stf-3',
    clientId: 'cli-3',
    type: 'Vehicle',
    report: 'Ronda perimetral realizada sem alterações. Portão 3 verificado e trancado. Luzes do pátio B funcionando corretamente.',
    photos: []
  },
  {
    id: 'pat-2',
    date: format(subDays(new Date(), 0), "yyyy-MM-dd'T'14:30:00"),
    staffId: 'stf-1',
    clientId: 'cli-2',
    type: 'Foot',
    report: 'Ronda interna pelos andares 1 ao 5. Porta de incêndio do 3º andar estava entreaberta, foi fechada. Extintores verificados visualmente.',
    photos: []
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'stf-1', // Carlos Silva
    locationId: 'cli-2', // Empresarial Tower Center
    content: 'Parabéns à equipe do plantão noturno pela excelente conduta durante a ocorrência de ontem. Profissionalismo exemplar!',
    timestamp: new Date().toISOString(), // Agora
    likes: ['stf-2', 'stf-3'],
    comments: [
      { id: 'c1', authorId: 'stf-3', content: 'Obrigado supervisor! Estamos juntos.', timestamp: new Date().toISOString() }
    ]
  },
  {
    id: 'post-2',
    authorId: 'stf-2', // Ana Oliveira
    locationId: 'cli-1', // Vila Verde
    content: 'Almoço de confraternização da equipe da portaria. Ótimo momento!',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop',
    timestamp: subHours(new Date(), 5).toISOString(),
    likes: ['stf-1', 'stf-4', 'stf-5'],
    comments: []
  }
];

// --- Concierge Mocks ---

export const MOCK_ENTRY_LOGS: EntryLog[] = [
  {
    id: 'log-1',
    clientId: 'cli-1',
    type: 'Visitor',
    name: 'José Pedro (Técnico Net)',
    document: '123456789',
    vehicleModel: 'Fiat Uno',
    vehiclePlate: 'ABC-1234',
    timestamp: subHours(new Date(), 2).toISOString(),
    registeredBy: 'stf-2',
    notes: 'Manutenção Internet Apto 102'
  },
  {
    id: 'log-2',
    clientId: 'cli-1',
    type: 'Mail',
    name: 'Maria Souza (Apto 505)',
    timestamp: subHours(new Date(), 4).toISOString(),
    registeredBy: 'stf-2',
    notes: 'Pacote Mercado Livre'
  }
];

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    clientId: 'cli-1',
    resourceName: 'Salão de Festas',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    startTime: '18:00',
    endTime: '23:00',
    reservedBy: 'Apto 101 - Sr. João',
    status: 'Confirmed'
  },
  {
    id: 'res-2',
    clientId: 'cli-1',
    resourceName: 'Churrasqueira',
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    startTime: '12:00',
    endTime: '18:00',
    reservedBy: 'Apto 304 - Sra. Helena',
    status: 'Pending'
  }
];

export const MOCK_GUEST_LISTS: GuestList[] = [
  {
    id: 'lst-1',
    clientId: 'cli-1',
    residentName: 'Apto 101 - Sr. João',
    eventName: 'Aniversário Joãozinho',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    linkToken: 'abc-123-xyz',
    guests: [
      { id: 'gst-1', name: 'Paulo Silva', document: '111.222.333-44' },
      { id: 'gst-2', name: 'Mariana Costa', document: '555.666.777-88' }
    ],
    createdBy: 'stf-2'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: subDays(new Date(), 1).toISOString(),
    actorId: 'admin-master',
    actorName: 'Administrador do Sistema',
    actorRole: 'Diretoria',
    action: 'Create',
    category: 'Clientes',
    targetName: 'Condomínio Residencial Vila Verde',
    details: 'Cadastro inicial do cliente'
  },
  {
    id: 'log-2',
    timestamp: subDays(new Date(), 0).toISOString(),
    actorId: 'stf-1',
    actorName: 'Carlos Silva',
    actorRole: 'Supervisor',
    action: 'Update',
    category: 'Equipe',
    targetName: 'Ana Oliveira',
    details: 'Atualização de endereço e turno preferencial'
  }
];

// Initial Permissions Configuration (Updated for Granular View/Edit)
export const DEFAULT_PERMISSIONS: PermissionConfig = {
  calendar: {
    view: ['Diretoria', 'Administração', 'Supervisor', 'RH', 'Security', 'Concierge'],
    edit: ['Diretoria', 'Administração', 'Supervisor']
  },
  team: {
    view: ['Diretoria', 'Administração', 'Supervisor', 'RH'],
    edit: ['Diretoria', 'Administração', 'RH']
  },
  clients: {
    view: ['Diretoria', 'Administração', 'Supervisor'],
    edit: ['Diretoria', 'Administração']
  },
  suppliers: {
    view: ['Diretoria', 'Administração', 'Supervisor'],
    edit: ['Diretoria', 'Administração']
  },
  financial: {
    view: ['Diretoria', 'Administração'],
    edit: ['Diretoria']
  },
  portal: {
    view: ['Diretoria', 'Administração', 'Supervisor', 'RH', 'Security', 'Concierge'],
    edit: ['Diretoria', 'RH']
  },
  checklist: {
    view: ['Diretoria', 'Administração', 'Supervisor', 'Security', 'Concierge'],
    edit: ['Diretoria', 'Supervisor', 'Security', 'Concierge']
  },
  patrol: {
    view: ['Diretoria', 'Administração', 'Supervisor', 'Security'],
    edit: ['Diretoria', 'Supervisor', 'Security']
  },
  social: {
    view: ['Diretoria', 'Administração', 'Supervisor', 'RH', 'Security', 'Concierge'],
    edit: ['Diretoria', 'Supervisor', 'RH', 'Security', 'Concierge']
  },
  concierge: {
    view: ['Diretoria', 'Administração', 'Supervisor', 'Security', 'Concierge'],
    edit: ['Diretoria', 'Concierge']
  },
  settings: {
    view: ['Diretoria', 'Administração', 'Supervisor', 'RH', 'Security', 'Concierge'],
    edit: ['Diretoria']
  },
  inventory: {
    view: ['Diretoria', 'Administração', 'Supervisor', 'RH'],
    edit: ['Diretoria', 'Administração', 'Supervisor']
  },
  'audit-log': {
    view: ['Diretoria'],
    edit: []
  }
};
