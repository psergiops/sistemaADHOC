
import React, { useState } from 'react';
import { Staff } from '../types';
import StaffFormModal from './StaffFormModal';
import ImportModal from './ImportModal';
import SearchPicker from './SearchPicker';
import { 
  Shield, Users, UserCog, Briefcase, Search, Plus, 
  Menu, HelpCircle, Download, Upload, User, 
  Mail, Phone, MoreHorizontal 
} from 'lucide-react';

interface TeamViewProps {
  staff: Staff[];
  onAddStaff: (newStaff: Staff) => void;
  onBulkAddStaff: (staffList: Staff[]) => void;
  onUpdateStaff: (updatedStaff: Staff) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const TeamView: React.FC<TeamViewProps> = ({ staff, onAddStaff, onBulkAddStaff, onUpdateStaff, onToggleMenu, onShowHelp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const filteredStaff = staff.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || s.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const handleAddNewClick = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (member: Staff) => {
    setEditingStaff(member);
    setIsModalOpen(true);
  };

  const handleSaveStaff = (staffData: Staff) => {
    if (editingStaff) {
      onUpdateStaff(staffData);
    } else {
      onAddStaff(staffData);
    }
  };

  // Helper to generate next code
  const getNextCode = (list: { code?: string }[]) => {
    let max = 0;
    list.forEach(item => {
      if (item.code) {
        const val = parseInt(item.code, 10);
        if (!isNaN(val) && val > max) max = val;
      }
    });
    return max;
  };

  const handleImportStaff = (data: any[]) => {
    alert(`Iniciando processamento de planilha com ${data.length} linhas...`);
    let currentMax = getNextCode(staff);
    const staffToImport: Staff[] = [];

    data.forEach((item) => {
      currentMax++;
      const nextCode = currentMax.toString().padStart(4, '0');
      staffToImport.push({ ...item, code: nextCode } as Staff);
    });
    
    onBulkAddStaff(staffToImport);
  };

  const handleExport = () => {
    // Definir cabeçalhos completos abrangendo TODAS as abas
    const csvHeaders = [
      'Codigo', 
      // Pessoal
      'Nome', 'Email', 'Telefone', 'Telefone Recado', 
      'Data Nascimento', 'Naturalidade', 'Estado Civil', 'Raca/Cor', 'Peso', 'Altura', 'Tipo Sanguineo',
      // Parentesco
      'Nome do Pai', 'Nome da Mae',
      // Cargo & Contrato
      'Cargo', 'Setor', 'Regime', 'Tipo Contrato', 'Fim Contrato', 'Data Admissao', 'Turnos', 
      // Financeiro
      'Salario', 'Dia Pagamento', 'Adiantamento(Sim/Nao)', 'Valor Vale', 'Dia Vale', 
      // Docs / Escolaridade
      'Escolaridade', 'CPF', 'RG', 'Data Emissao RG', 'PIS', 'CNV', 'CNH Numero', 'CNH Tipo', 'Titulo Eleitor', 'Reservista',
      // Endereço
      'CEP', 'Rua', 'Numero', 'Complemento', 'Bairro', 'Cidade', 'Estado'
    ];

    const roleMapReverse: Record<string, string> = {
        'Security': 'Segurança',
        'Concierge': 'Porteiro',
        'Supervisor': 'Supervisor',
        'RH': 'RH',
        'Diretoria': 'Diretoria',
        'Administração': 'Administração'
    };

    const csvRows = filteredStaff.map(s => {
        return [
            // Codigo
            s.code || '',
            // Pessoal
            s.name,
            s.email,
            s.phone,
            s.emergencyPhone || '',
            s.birthDate || '',
            s.birthPlace || '',
            s.maritalStatus || '',
            s.race || '',
            s.weight?.toString() || '',
            s.height?.toString() || '',
            s.bloodType || '',
            // Parentesco
            s.fatherName || '',
            s.motherName || '',
            // Cargo
            roleMapReverse[s.role] || s.role,
            s.sector || '',
            s.regime,
            s.contractType,
            s.contractEndDate || '',
            s.admissionDate,
            s.preferredShifts.join(','), 
            // Financeiro
            s.salary.toString(),
            s.paymentDay.toString(),
            s.takesAdvance ? 'Sim' : 'Não',
            s.advanceValue?.toString() || '0',
            s.advanceDay?.toString() || '',
            // Docs
            s.educationLevel || '',
            s.documents.cpf,
            s.documents.rg,
            s.documents.rgIssueDate || '',
            s.documents.pis || '',
            s.documents.cnv || '',
            s.documents.cnhNumber || '',
            s.documents.cnhType || '',
            s.documents.voterId || '',
            s.documents.reservistCertificate || '',
            // Endereço
            s.address.zipCode,
            s.address.street,
            s.address.number,
            s.address.complement || '',
            s.address.district,
            s.address.city,
            s.address.state
        ].map(field => `"${field}"`).join(';'); // Envolve em aspas para segurança
    });

    const csvContent = '\uFEFF' + csvHeaders.join(';') + '\n' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'colaboradores_completo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const roleTranslations: Record<string, string> = {
    'Security': 'Segurança',
    'Concierge': 'Porteiro',
    'Supervisor': 'Supervisor',
    'RH': 'Recursos Humanos',
    'Diretoria': 'Diretoria',
    'Administração': 'Administração'
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      
      {/* Header Toolbar */}
      <div className="bg-[#EBEBEB] px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
             <Menu size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Gestão de Equipe</h2>
            <p className="text-sm text-slate-500">Gerencie colaboradores, contratos e documentos</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onShowHelp}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium mr-2"
            title="Ver Tutorial deste Módulo"
          >
            <HelpCircle size={18} />
            <span className="hidden md:inline">Tutorial</span>
          </button>
          
          <div className="flex-1 md:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome ou código..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-900 transition-all hover:border-slate-300"
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <SearchPicker 
              title="Filtrar por Cargo"
              allLabel="Todos os Cargos"
              items={[
                { id: 'Segurança', label: 'Segurança', icon: Shield },
                { id: 'Portaria', label: 'Portaria', icon: Users },
                { id: 'Supervisor', label: 'Supervisor', icon: UserCog },
                { id: 'RH', label: 'Recursos Humanos', icon: Briefcase },
                { id: 'Diretoria', label: 'Diretoria', icon: Shield },
                { id: 'Administração', label: 'Administração', icon: Briefcase }
              ]}
              selectedId={selectedRole}
              onSelect={setSelectedRole}
            />
          </div>
          <div className="flex gap-2">
            <button 
                onClick={handleExport}
                className="flex items-center justify-center p-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                title="Exportar dados completos (CSV)"
            >
                <Download size={18} />
            </button>
            <button 
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center justify-center p-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                title="Importar (CSV)"
            >
                <Upload size={18} />
            </button>
            <button 
                onClick={handleAddNewClick}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
                <Plus size={16} />
                <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* Table Header - Fixed */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:grid">
            <div className="col-span-1">Cod</div>
            <div className="col-span-3">Nome</div>
            <div className="col-span-2 text-center">Cargo</div>
            <div className="col-span-1 text-center">Regime</div>
            <div className="col-span-3">Contato</div>
            <div className="col-span-1 text-center">Admissão</div>
            <div className="col-span-1 text-right">Ações</div>
          </div>

          {/* Table Body - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredStaff.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <User size={48} className="mb-4 opacity-10" />
                <p className="text-lg font-medium">Nenhum colaborador encontrado</p>
                <p className="text-sm opacity-60">Tente buscar por outro termo ou adicione um novo.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredStaff.map((member, idx) => (
                  <div 
                    key={member.id} 
                    className={`grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-blue-50/40 transition-colors group cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                    onClick={() => handleEditClick(member)}
                  >
                    {/* Code & Avatar */}
                    <div className="col-span-12 md:col-span-1 flex items-center gap-3">
                      <span className="md:hidden text-xs font-bold text-slate-400">#{member.code || '---'}</span>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden shadow-sm">
                        {member.avatar ? <img src={member.avatar} className="w-full h-full object-cover" /> : member.name.charAt(0)}
                      </div>
                      <span className="hidden md:inline text-xs font-semibold text-slate-500 font-mono">
                        {member.code || '----'}
                      </span>
                    </div>

                    {/* Name */}
                    <div className="col-span-12 md:col-span-3">
                      <h3 className="text-sm font-bold text-slate-800 truncate">{member.name}</h3>
                      <div className="md:hidden flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold uppercase">{roleTranslations[member.role] || member.role}</span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[10px] text-slate-400 font-medium">{member.phone}</span>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="hidden md:flex md:col-span-2 justify-center">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-tight
                        ${member.role === 'Supervisor' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                          member.role === 'RH' ? 'bg-pink-50 text-pink-700 border border-pink-100' : 
                          member.role === 'Segurança' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          member.role === 'Portaria' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                          'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>
                        {roleTranslations[member.role] || member.role}
                      </span>
                    </div>

                    {/* Regime */}
                    <div className="hidden md:block md:col-span-1 text-center">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                        {member.regime}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="hidden md:flex md:col-span-3 flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                        <Mail size={12} className="text-slate-300" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={12} className="text-slate-300" />
                        <span>{member.phone}</span>
                      </div>
                    </div>

                    {/* Admission */}
                    <div className="hidden md:block md:col-span-1 text-center text-[11px] font-medium text-slate-500">
                      {new Date(member.admissionDate).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div className="col-span-12 md:col-span-1 flex justify-end">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditClick(member); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Ver Perfil Completo"
                      >
                         <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {filteredStaff.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-blue-100">
            <User size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhum colaborador encontrado</p>
            <p className="text-sm text-blue-200">Tente buscar por outro termo ou adicione um novo.</p>
          </div>
        )}
      </div>

      <StaffFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStaff}
        staffToEdit={editingStaff}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportStaff}
        type="staff"
      />
    </div>
  );
};

export default TeamView;
