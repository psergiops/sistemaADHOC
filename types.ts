
export interface StaffAddress {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

// Reusing the structure, but logically separated for clients
export type Address = StaffAddress;

export interface Dependent {
  id: string;
  name: string;
  type: 'Spouse' | 'Child';
  cpf: string;
  birthDate?: string; // Required for 'Child'
}

export interface StaffDocuments {
  cpf: string;
  rg: string;
  rgIssueDate?: string; // Data emissão RG
  cnv?: string; // Carteira Nacional de Vigilante
  pis?: string;
  cnhNumber?: string;
  cnhType?: string;
  voterId?: string; // Titulo Eleitor
  reservistCertificate?: string; // Reservista
  reservistNotApplicable?: boolean;
}

export interface Staff {
  id: string;
  code: string; // Sequential code (0001, 0002...)
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  
  // New Personal Info
  birthDate?: string;
  birthPlace?: string; // Natural de
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
  race?: string; // Cor
  weight?: number;
  height?: number;
  bloodType?: string;

  // New Contact Info
  emergencyPhone?: string; // Telefone Recado
  educationLevel?: string; // Escolaridade

  // Job Details
  role: 'Security' | 'Concierge' | 'Supervisor' | 'Diretoria' | 'RH' | 'Administração';
  sector?: string; // Setor/Departamento
  regime: 'CLT' | 'PJ' | 'Freelance';
  contractType: 'Determined' | 'Undetermined' | 'Temporary';
  contractEndDate?: string; // Data de término para contratos determinados/temporários
  admissionDate: string;
  preferredShifts: ('Day' | 'Night')[];
  
  // Financial Details
  salary: number; // Salário base
  paymentDay: number; // Dia do pagamento (ex: 5)
  takesAdvance: boolean; // Optou por adiantamento?
  advanceValue?: number; // Valor do adiantamento
  advanceDay?: number; // Dia do adiantamento (ex: 20)

  // Personal Details
  address: StaffAddress;
  documents: StaffDocuments;

  // New Family Info
  fatherName?: string;
  motherName?: string;
  dependents: Dependent[];
}

export type ServiceType = 'Portaria 24h' | 'Vigilância' | 'Ronda Motorizada' | 'Monitoramento' | 'Limpeza e Conservação';

export interface Client {
  id: string;
  code: string; // Sequential code
  name: string; // Nome da empresa ou condomínio
  contactPerson: string; // Responsável
  email: string;
  phone: string;
  avatar?: string;
  
  address: Address;
  
  // Contract Details
  serviceType: ServiceType;
  contractValue: number;
  contractStartDate: string;
  paymentDay: number; // Dia do vencimento (ex: 5, 10, 15)
  isActive: boolean;
  notes?: string;

  // Staffing Details
  requiredStaffCount?: number;
  assignedStaffIds?: string[];
}

export interface Supplier {
  id: string;
  code: string; // Sequential code
  name: string;
  category: string; // ex: Uniformes, Equipamentos, Limpeza
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  notes?: string;
  
  // Recurring Contract Details
  isRecurring?: boolean;
  contractValue?: number;
  paymentDay?: number;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // YYYY-MM-DD
  category: string;
  status: 'paid' | 'pending';
  relatedClientId?: string; // Se for pagamento de cliente
  relatedSupplierId?: string; // Se for pagamento a fornecedor
}

export interface Paystub {
  id: string;
  staffId: string;
  referenceMonth: string; // YYYY-MM
  uploadDate: string;
  url: string; // Mock URL for download
  fileName: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  authorName: string;
  priority: 'Normal' | 'High';
}

export type ChangeRequestType = 'Personal' | 'Address' | 'TransportVoucher';
export type ChangeRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface DataChangeRequest {
  id: string;
  staffId: string;
  type: ChangeRequestType;
  status: ChangeRequestStatus;
  requestDate: string;
  
  // The data being requested to change (partial staff object)
  newData: Partial<Staff> | Partial<StaffAddress>; 
  
  description: string;
  attachmentUrl?: string; // Proof of address for VT
  hrJustification?: string;
  resolvedAt?: string;
}

// Location removed, using Client instead

export type ShiftType = 'Day' | 'Night' | 'Custom';

export interface Shift {
  id: string;
  staffId: string; // Can be empty if customStaffName is used
  customStaffName?: string; // For freelance or temp without full record
  locationId: string; // This maps to Client.id
  station?: string; // e.g. "Portaria 1", "Ronda", "Guarita"
  date: string; // ISO Date string YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: ShiftType;
  notes?: string;
  recurrenceId?: string; // ID grouping shifts created in batch
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export enum CalendarView {
  MONTH = 'month',
  WEEK = 'week'
}

// --- Checklist Types ---

export interface ChecklistItem {
  id: string;
  label: string;
  status: 'ok' | 'issue' | 'na';
  notes?: string;
}

export interface VehicleChecklist {
  id: string;
  date: string; // ISO DateTime
  staffId: string; // Who performed the check
  clientId: string; // Where (Base/Posto)
  vehicleModel: string;
  vehiclePlate: string;
  odometer: number;
  fuelLevel: number; // 0 to 100%
  items: ChecklistItem[];
  photos?: string[]; // Array of base64 strings or URLs. Max 5.
  generalNotes?: string;
}

// --- Patrol Types ---

export type PatrolType = 'Vehicle' | 'Foot';

export interface Patrol {
  id: string;
  date: string; // ISO DateTime
  staffId: string;
  clientId: string;
  type: PatrolType;
  report: string; // Relatório escrito
  photos?: string[]; // Array of base64 strings or URLs. Max 5.
}

// --- Social Network Types ---

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  locationId?: string; // ID do Cliente/Condomínio onde foi postado
  content: string;
  imageUrl?: string;
  timestamp: string; // ISO String
  likes: string[]; // Array of User IDs who liked
  comments: Comment[];
}

// --- Concierge Portal Types ---

export type LogEntryType = 'Visitor' | 'Mail' | 'Service';

export interface EntryLog {
  id: string;
  clientId: string; // Linked Location
  type: LogEntryType;
  name: string; // Visitor name or Recipient Name (if mail)
  document?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  timestamp: string; // ISO DateTime when registered
  registeredBy: string; // Staff ID
  notes?: string;
}

export interface Guest {
  id: string;
  name: string;
  document: string;
  arrived?: boolean; // New: Check-in status
  arrivedAt?: string; // New: Timestamp
  isExtra?: boolean; // New: Added manually outside original list
}

export interface GuestList {
  id: string;
  clientId: string; // Linked Location
  residentName: string; // e.g., "Apto 101 - Sr. João"
  eventName: string; // e.g., "Aniversário Maria"
  date: string; // YYYY-MM-DD
  linkToken: string; // e.g. unique hash for sharing
  guests: Guest[];
  createdBy: string; // Staff ID
}

export interface Reservation {
  id: string;
  clientId: string; // Linked Location
  resourceName: string; // e.g., "Salão de Festas", "Churrasqueira"
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  reservedBy: string; // Resident name or Unit
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

// --- Material Request Types ---

export interface MaterialRequestItem {
  id: string;
  itemName: string;
  quantity: number;
  isDelivered: boolean;
}

export interface MaterialRequest {
  id: string;
  staffId: string; // Who requested
  clientId: string; // Where
  date: string; // YYYY-MM-DD
  items: MaterialRequestItem[];
  status: 'Pending' | 'Partial' | 'Completed';
  notes?: string;
}

// --- Inventory Types ---

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  quantity: number;
  minThreshold: number;
  category: string;
}

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string; // Snapshot
  type: MovementType;
  quantity: number;
  date: string; // ISO DateTime
  referenceId?: string; // Invoice # or MaterialRequest ID
  performedBy: string; // Staff ID
  notes?: string;
}

// --- Shift Check-in / Mandatory Logout Types ---

export interface ShiftCheckin {
  id: string;
  staffId: string;
  locationId: string; // Derived from the shift scheduled for this time
  checkinTime: string; // ISO DateTime
  shiftTimeReference: string; // "06:00" or "18:00"
  date: string; // YYYY-MM-DD
  status: 'Ok' | 'Late';
}

// --- Audit Log Types ---

export type AuditAction = 'Create' | 'Update' | 'Delete';
export type AuditCategory = 'Equipe' | 'Clientes' | 'Fornecedores' | 'Escala' | 'Financeiro' | 'Estoque';

export interface AuditLog {
  id: string;
  timestamp: string; // ISO DateTime
  actorId: string; // ID of the user who performed the action
  actorName: string; // Name snapshot
  actorRole: string; // Role snapshot
  action: AuditAction;
  category: AuditCategory;
  targetName: string; // e.g., "João Silva" or "Condomínio X"
  details?: string;
}

// --- Access Control / Permissions Types ---

export type AppModule = 'calendar' | 'team' | 'clients' | 'suppliers' | 'financial' | 'portal' | 'checklist' | 'patrol' | 'social' | 'concierge' | 'settings' | 'audit-log' | 'inventory';

export interface ModulePermissions {
  view: string[];
  edit: string[];
}

export interface PermissionConfig {
  [key: string]: ModulePermissions; 
}
