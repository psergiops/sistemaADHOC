
import React, { useState } from 'react';
import { Staff } from '../types';
import { Plus, Search, MoreHorizontal, User, Phone, Mail, Shield, MapPin, Menu, Upload, Download, HelpCircle } from 'lucide-react';
import StaffFormModal from './StaffFormModal';
import ImportModal from './ImportModal';

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

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    let currentMax = getNextCode(staff);
    const staffToImport: Staff[] = [];

    data.forEach((item) => {
      currentMax++;
      const nextCode = currentMax.toString().padStart(4, '0');
      staffToImport.push({ ...item, code: nextCode } as Staff);
    });
    
    onBulkAddStaff(staffToImport);
    alert(`${staffToImport.length} colaboradores importados com sucesso!`);
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
          
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou cargo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-900"
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

      {/* Staff Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStaff.map(member => (
            <div key={member.id} className="bg-[#EBEBEB] rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg overflow-hidden border border-slate-200">
                      {member.avatar ? <img src={member.avatar} className="w-full h-full object-cover" /> : member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-500">
                            #{member.code || '----'}
                        </span>
                        <h3 className="font-semibold text-slate-800 line-clamp-1">{member.name}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          member.role === 'Supervisor' ? 'bg-purple-100 text-purple-700' :
                          member.role === 'RH' ? 'bg-pink-100 text-pink-700' : 
                          member.role === 'Security' ? 'bg-blue-100 text-blue-700' :
                          member.role === 'Administração' ? 'bg-gray-100 text-gray-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {roleTranslations[member.role] || member.role}
                        </span>
                        <span>•</span>
                        <span>{member.regime}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleEditClick(member)} className="text-slate-300 hover:text-slate-600">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Shield size={14} className="text-slate-400" />
                    <span>CNV: {member.documents.cnv || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{member.address.street}, {member.address.number} - {member.address.city}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                 <div className="text-xs text-slate-500">
                    Admissão: <span className="font-medium">{new Date(member.admissionDate).toLocaleDateString()}</span>
                 </div>
                 <button 
                  onClick={() => handleEditClick(member)}
                  className="text-blue-600 text-xs font-semibold hover:underline"
                 >
                   Ver Detalhes
                 </button>
              </div>
            </div>
          ))}
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
