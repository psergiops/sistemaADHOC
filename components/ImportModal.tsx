
import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import { Staff, Client, Supplier } from '../types';

type ImportType = 'staff' | 'client' | 'supplier';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
  type: ImportType;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, type }) => {
  const [step, setStep] = useState<'prompt' | 'upload'>('prompt');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Configuration for each type
  const config = {
    staff: {
      title: 'Importar Colaboradores',
      headers: [
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
      ],
      sample: 'João Silva;joao@email.com;(11)99999-9999;(11)5555-5555;1990-01-01;São Paulo/SP;Solteiro;Branca;80;1.80;O+;José Silva;Maria Silva;Segurança;Operacional;CLT;Undetermined;;2023-01-01;Day,Night;2500;5;Não;0;0;Médio Completo;123.456.789-00;12.345.678-9;2010-05-20;12345678900;CNV-123456;11223344;AB;123456789012;123456;01000-000;Rua das Flores;123;Apto 101;Centro;São Paulo;SP'
    },
    client: {
      title: 'Importar Clientes',
      headers: ['Nome Empresa', 'Responsavel', 'Email', 'Telefone', 'CEP', 'Endereco', 'Valor Contrato'],
      keys: ['name', 'contactPerson', 'email', 'phone', 'zipCode', 'street', 'contractValue'],
      sample: 'Condominio Solar;Maria Souza;síndico@solar.com;(11)3333-3333;01000-000;Rua das Flores, 123;5000'
    },
    supplier: {
      title: 'Importar Fornecedores',
      headers: ['Nome Empresa', 'Categoria', 'Responsavel', 'Email', 'Telefone'],
      keys: ['name', 'category', 'contactPerson', 'email', 'phone'],
      sample: 'Limpeza Total;Limpeza;Carlos;contato@limpeza.com;(11)5555-5555'
    }
  };

  const currentConfig = config[type];

  const handleDownloadTemplate = () => {
    const headerString = currentConfig.headers.join(';');
    // Add BOM for Excel to recognize UTF-8
    const csvContent = '\uFEFF' + headerString + '\n' + currentConfig.sample;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `modelo_importacao_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Move to upload step after downloading
    setStep('upload');
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const data: any[] = [];
        
        // Skip header row (index 0)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Split by semicolon, handling quotes if necessary (basic implementation)
          const values = line.split(';').map(val => val.replace(/"/g, '').trim());
          
          // Basic validation based on expected columns for Staff (which is large)
          if (type === 'staff' && values.length < 5) continue; 
          if (type !== 'staff' && values.length < 4) continue;

          const obj: any = {};
          
          // Generate ID
          obj.id = `${type.substring(0,3)}-imp-${Date.now()}-${i}`;

          // Map basic fields
          if (type === 'staff') {
             // 0-10: Pessoal
             obj.name = values[0];
             obj.email = values[1];
             obj.phone = values[2];
             obj.emergencyPhone = values[3] || '';
             obj.birthDate = values[4] || '';
             obj.birthPlace = values[5] || '';
             obj.maritalStatus = values[6] || 'Single';
             obj.race = values[7] || '';
             obj.weight = parseFloat(values[8]) || 0;
             obj.height = parseFloat(values[9]) || 0;
             obj.bloodType = values[10] || '';

             // 11-12: Parentesco
             obj.fatherName = values[11] || '';
             obj.motherName = values[12] || '';
             
             // 13-19: Cargo & Contrato
             const rawRole = values[13]?.trim().toLowerCase();
             const roleMap: Record<string, string> = {
                'segurança': 'Security', 'vigilante': 'Security',
                'porteiro': 'Concierge', 'controlador': 'Concierge',
                'supervisor': 'Supervisor',
                'rh': 'RH', 'recursos humanos': 'RH',
                'diretoria': 'Diretoria',
                'administração': 'Administração'
             };
             obj.role = roleMap[rawRole] || 'Security';
             obj.sector = values[14] || '';
             obj.regime = values[15] || 'CLT';
             obj.contractType = values[16] || 'Undetermined';
             obj.contractEndDate = values[17] || '';
             obj.admissionDate = values[18] || new Date().toISOString().split('T')[0];
             obj.preferredShifts = values[19] ? values[19].split(',') : ['Day'];

             // 20-24: Financeiro
             obj.salary = parseFloat(values[20]) || 0;
             obj.paymentDay = parseInt(values[21]) || 5;
             obj.takesAdvance = ['sim', 'yes', 'true', 's', 'y'].includes(values[22]?.toLowerCase());
             obj.advanceValue = parseFloat(values[23]) || 0;
             obj.advanceDay = parseInt(values[24]) || 20;

             // 25-34: Docs
             obj.educationLevel = values[25] || '';
             obj.documents = {
                cpf: values[26] || '',
                rg: values[27] || '',
                rgIssueDate: values[28] || '',
                pis: values[29] || '',
                cnv: values[30] || '',
                cnhNumber: values[31] || '',
                cnhType: values[32] || '',
                voterId: values[33] || '',
                reservistCertificate: values[34] || ''
             };

             // 35-41: Endereço
             obj.address = {
                zipCode: values[35] || '',
                street: values[36] || '',
                number: values[37] || '',
                complement: values[38] || '',
                district: values[39] || '',
                city: values[40] || '',
                state: values[41] || ''
             };

          } else if (type === 'client') {
             obj.name = values[0];
             obj.contactPerson = values[1];
             obj.email = values[2];
             obj.phone = values[3];
             obj.address = { 
               zipCode: values[4] || '',
               street: values[5] || '', 
               number: 'S/N', district: '', city: '', state: '' 
             };
             obj.contractValue = parseFloat(values[6]) || 0;
             // Defaults
             obj.serviceType = 'Portaria 24h';
             obj.contractStartDate = new Date().toISOString().split('T')[0];
             obj.paymentDay = 5;
             obj.isActive = true;
             obj.assignedStaffIds = [];
          } else if (type === 'supplier') {
             obj.name = values[0];
             obj.category = values[1];
             obj.contactPerson = values[2];
             obj.email = values[3];
             obj.phone = values[4];
             // Defaults
             obj.address = { street: '', number: '', district: '', city: '', state: '', zipCode: '' };
             obj.isRecurring = false;
          }

          data.push(obj);
        }

        if (data.length === 0) {
          setError('Nenhum dado válido encontrado no arquivo.');
        } else {
          onImport(data);
          onClose();
          // Reset
          setStep('prompt');
          setFileName(null);
          setError(null);
        }

      } catch (err) {
        setError('Erro ao processar arquivo. Verifique se é um CSV separado por ponto e vírgula.');
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="text-green-600" size={20} />
            {currentConfig.title}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'prompt' ? (
            <div className="space-y-6 text-center">
               <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-blue-600">
                  <Download size={32} />
               </div>
               <div>
                 <h4 className="text-lg font-bold text-slate-800 mb-2">Precisa do modelo da planilha?</h4>
                 <p className="text-sm text-slate-500">
                   Para importar dados corretamente, recomendamos baixar o modelo padrão, preencher no Excel e depois fazer o upload.
                 </p>
               </div>
               <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleDownloadTemplate}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Sim, baixar modelo (CSV)
                  </button>
                  <button 
                    onClick={() => setStep('upload')}
                    className="w-full bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Não, já tenho a planilha
                  </button>
               </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
               <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
               >
                  <Upload size={40} className="text-slate-400 mb-3" />
                  <p className="text-sm font-medium text-slate-700">Clique para selecionar o arquivo CSV</p>
                  <p className="text-xs text-slate-400 mt-1">Separado por ponto e vírgula (;)</p>
                  <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
               </div>
               
               {fileName && (
                 <div className="flex items-center gap-2 justify-center text-sm text-green-600 font-medium bg-green-50 py-2 rounded-lg">
                    <Check size={16} />
                    {fileName}
                 </div>
               )}

               {error && (
                 <div className="flex items-center gap-2 justify-center text-sm text-red-600 font-medium bg-red-50 py-2 rounded-lg">
                    <AlertCircle size={16} />
                    {error}
                 </div>
               )}

               <button 
                 onClick={() => setStep('prompt')}
                 className="text-sm text-slate-500 hover:text-slate-700 underline"
               >
                 Voltar
               </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ImportModal;
