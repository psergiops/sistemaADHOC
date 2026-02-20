import React, { useState } from 'react';
import { Database, Copy, Check, ShieldAlert, Key, Save, ExternalLink, X, Info, Wifi, ArrowRight, RefreshCw, Wrench, Trash2, LogOut, Power } from 'lucide-react';
import { configureSupabaseManually, clearSupabaseConfig, supabase } from '../lib/supabaseClient';

interface DatabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnectionError?: boolean;
  errorDetails?: string | null;
}

const DatabaseSetupModal: React.FC<DatabaseSetupModalProps> = ({ isOpen, onClose, errorDetails }) => {
  const [copied, setCopied] = useState(false);
  const [cacheCopied, setCacheCopied] = useState(false);
  const [staffFixCopied, setStaffFixCopied] = useState(false);
  const [staffRecreateCopied, setStaffRecreateCopied] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');
  const [testMessage, setTestMessage] = useState('');
  
  const defaultUrl = process.env.VITE_SUPABASE_URL || '';
  // Extract Project ID from URL for deep linking
  const projectId = defaultUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || '';
  const dashboardSqlUrl = projectId ? `https://supabase.com/dashboard/project/${projectId}/sql/new` : 'https://supabase.com/dashboard';

  if (!isOpen) return null;

  // Diagnóstico de Erros
  const isCacheError = errorDetails?.includes('schema cache') || errorDetails?.includes('PGRST204');
  const isStaffError = errorDetails?.includes('staff') && (errorDetails?.includes('admissiondate') || errorDetails?.includes('column'));

  // SQL Strings
  const cacheFixSql = `NOTIFY pgrst, 'reload schema';`;

  const staffFixSql = `-- OPÇÃO 1: CORREÇÃO RÁPIDA (Tenta preservar dados)
-- 1. Garante criação da coluna
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS admissiondate text;

-- 2. Altera comentário para forçar evento de mudança de esquema
COMMENT ON COLUMN public.staff.admissiondate IS 'Data de admissão';

-- 3. Solicita recarregamento da API
NOTIFY pgrst, 'reload schema';`;

  const staffRecreateSql = `-- OPÇÃO 2: RECRIAR TABELA STAFF (DRÁSTICO - SOLUÇÃO DEFINITIVA)
-- USE SE A OPÇÃO 1 NÃO FUNCIONOU.
-- ⚠️ ISSO APAGARÁ OS DADOS ATUAIS DA TABELA STAFF PARA CORRIGIR A ESTRUTURA.

DROP TABLE IF EXISTS public.staff CASCADE;

CREATE TABLE public.staff (
    id text PRIMARY KEY,
    code text,
    name text NOT NULL,
    email text,
    phone text,
    avatar text,
    birthdate text,
    birthplace text,
    maritalstatus text,
    race text,
    weight numeric,
    height numeric,
    bloodtype text,
    emergencyphone text,
    educationlevel text,
    role text NOT NULL,
    sector text,
    regime text,
    contracttype text,
    contractenddate text,
    admissiondate text,
    preferredshifts jsonb DEFAULT '[]'::jsonb,
    salary numeric DEFAULT 0,
    paymentday integer,
    takesadvance boolean DEFAULT false,
    advancevalue numeric DEFAULT 0,
    advanceday integer,
    zipcode text,
    street text,
    "number" text,
    complement text,
    district text,
    city text,
    state text,
    cpf text,
    rg text,
    rgissuedate text,
    cnv text,
    pis text,
    cnhnumber text,
    cnhtype text,
    voterid text,
    reservistcertificate text,
    reservistnotapplicable boolean DEFAULT false,
    fathername text,
    mothername text,
    dependents jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.staff TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';`;

  const sqlCode = `-- ⚠️ SCRIPT CORRETIVO (VERSÃO 2.0)
-- Execute para corrigir erros de colunas ausentes (targetname) e recarregar cache.

-- 1. LIMPEZA SEGURA (Remove tabelas antigas para recriar com estrutura certa)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS shift_checkins CASCADE;
DROP TABLE IF EXISTS inventory_movements CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS material_requests CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS guest_lists CASCADE;
DROP TABLE IF EXISTS entry_logs CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS patrols CASCADE;
DROP TABLE IF EXISTS vehicle_checklists CASCADE;
DROP TABLE IF EXISTS change_requests CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS paystubs CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS shifts CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS staff CASCADE;

-- 2. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. CRIAÇÃO DAS TABELAS

CREATE TABLE staff (
    id text PRIMARY KEY,
    code text,
    name text NOT NULL,
    email text,
    phone text,
    avatar text,
    birthdate text,
    birthplace text,
    maritalstatus text,
    race text,
    weight numeric,
    height numeric,
    bloodtype text,
    emergencyphone text,
    educationlevel text,
    role text NOT NULL,
    sector text,
    regime text,
    contracttype text,
    contractenddate text,
    admissiondate text,
    preferredshifts jsonb DEFAULT '[]'::jsonb,
    salary numeric DEFAULT 0,
    paymentday integer,
    takesadvance boolean DEFAULT false,
    advancevalue numeric DEFAULT 0,
    advanceday integer,
    zipcode text,
    street text,
    "number" text,
    complement text,
    district text,
    city text,
    state text,
    cpf text,
    rg text,
    rgissuedate text,
    cnv text,
    pis text,
    cnhnumber text,
    cnhtype text,
    voterid text,
    reservistcertificate text,
    reservistnotapplicable boolean DEFAULT false,
    fathername text,
    mothername text,
    dependents jsonb DEFAULT '[]'::jsonb
);
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;

CREATE TABLE clients (
    id text PRIMARY KEY,
    code text,
    name text NOT NULL,
    contactperson text,
    email text,
    phone text,
    avatar text,
    zipcode text,
    street text,
    "number" text,
    district text,
    city text,
    state text,
    servicetype text,
    contractvalue numeric DEFAULT 0,
    contractstartdate text,
    paymentday integer,
    isactive boolean DEFAULT true,
    notes text,
    requiredstaffcount integer DEFAULT 0,
    assignedstaffids jsonb DEFAULT '[]'::jsonb
);
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

CREATE TABLE shifts (
    id text PRIMARY KEY,
    staffid text,
    customstaffname text,
    locationid text,
    station text,
    date text NOT NULL,
    starttime text NOT NULL,
    endtime text NOT NULL,
    type text,
    notes text,
    recurrenceid text
);
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;

CREATE TABLE suppliers (
    id text PRIMARY KEY,
    code text,
    name text NOT NULL,
    category text,
    contactperson text,
    email text,
    phone text,
    zipcode text,
    street text,
    "number" text,
    district text,
    city text,
    state text,
    notes text,
    isrecurring boolean DEFAULT false,
    contractvalue numeric DEFAULT 0,
    paymentday integer
);
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;

CREATE TABLE transactions (
    id text PRIMARY KEY,
    description text NOT NULL,
    amount numeric NOT NULL,
    type text NOT NULL,
    date text NOT NULL,
    category text,
    status text,
    relatedclientid text,
    relatedsupplierid text
);
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

CREATE TABLE paystubs (
    id text PRIMARY KEY,
    staffid text NOT NULL,
    referencemonth text,
    uploaddate text,
    url text,
    filename text
);
ALTER TABLE paystubs DISABLE ROW LEVEL SECURITY;

CREATE TABLE announcements (
    id text PRIMARY KEY,
    title text NOT NULL,
    content text,
    date text,
    authorname text,
    priority text
);
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;

CREATE TABLE change_requests (
    id text PRIMARY KEY,
    staffid text NOT NULL,
    type text,
    status text,
    requestdate text,
    newdata jsonb DEFAULT '{}'::jsonb,
    description text,
    attachmenturl text,
    hrjustification text,
    resolvedat text
);
ALTER TABLE change_requests DISABLE ROW LEVEL SECURITY;

CREATE TABLE vehicle_checklists (
    id text PRIMARY KEY,
    date text NOT NULL,
    staffid text NOT NULL,
    clientid text NOT NULL,
    vehiclemodel text,
    vehicleplate text,
    odometer numeric DEFAULT 0,
    fuellevel numeric DEFAULT 0,
    items jsonb DEFAULT '[]'::jsonb,
    photos jsonb DEFAULT '[]'::jsonb,
    generalnotes text
);
ALTER TABLE vehicle_checklists DISABLE ROW LEVEL SECURITY;

CREATE TABLE patrols (
    id text PRIMARY KEY,
    date text NOT NULL,
    staffid text NOT NULL,
    clientid text NOT NULL,
    type text,
    report text,
    photos jsonb DEFAULT '[]'::jsonb
);
ALTER TABLE patrols DISABLE ROW LEVEL SECURITY;

CREATE TABLE posts (
    id text PRIMARY KEY,
    authorid text NOT NULL,
    locationid text,
    content text,
    imageurl text,
    timestamp text,
    likes jsonb DEFAULT '[]'::jsonb,
    comments jsonb DEFAULT '[]'::jsonb
);
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

CREATE TABLE entry_logs (
    id text PRIMARY KEY,
    clientid text NOT NULL,
    type text,
    name text NOT NULL,
    document text,
    vehiclemodel text,
    vehicleplate text,
    timestamp text,
    registeredby text,
    notes text
);
ALTER TABLE entry_logs DISABLE ROW LEVEL SECURITY;

CREATE TABLE guest_lists (
    id text PRIMARY KEY,
    clientid text NOT NULL,
    residentname text,
    eventname text,
    date text,
    linktoken text,
    guests jsonb DEFAULT '[]'::jsonb,
    createdby text
);
ALTER TABLE guest_lists DISABLE ROW LEVEL SECURITY;

CREATE TABLE reservations (
    id text PRIMARY KEY,
    clientid text NOT NULL,
    resourcename text,
    date text,
    starttime text,
    endtime text,
    reservedby text,
    status text
);
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;

CREATE TABLE material_requests (
    id text PRIMARY KEY,
    staffid text NOT NULL,
    clientid text NOT NULL,
    date text,
    items jsonb DEFAULT '[]'::jsonb,
    status text,
    notes text
);
ALTER TABLE material_requests DISABLE ROW LEVEL SECURITY;

CREATE TABLE inventory_items (
    id text PRIMARY KEY,
    code text NOT NULL,
    name text NOT NULL,
    quantity integer DEFAULT 0,
    minthreshold integer DEFAULT 0,
    category text
);
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;

CREATE TABLE inventory_movements (
    id text PRIMARY KEY,
    itemid text NOT NULL,
    itemname text,
    type text,
    quantity integer,
    date text,
    referenceid text,
    performedby text,
    notes text
);
ALTER TABLE inventory_movements DISABLE ROW LEVEL SECURITY;

CREATE TABLE shift_checkins (
    id text PRIMARY KEY,
    staffid text NOT NULL,
    locationid text,
    checkintime text,
    shifttimereference text,
    date text,
    status text
);
ALTER TABLE shift_checkins DISABLE ROW LEVEL SECURITY;

-- FIXED: Added targetname
CREATE TABLE audit_logs (
    id text PRIMARY KEY,
    timestamp text,
    actorid text,
    actorname text,
    actorrole text,
    action text,
    category text,
    targetname text,
    details text
);
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- GRANT PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;

-- 4. FORÇA RECARREGAMENTO DO SCHEMA API (Corrige erro de cache)
NOTIFY pgrst, 'reload schema';
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode); 
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCacheFix = () => {
    navigator.clipboard.writeText(cacheFixSql);
    setCacheCopied(true);
    setTimeout(() => setCacheCopied(false), 2000);
  }

  const copyStaffFix = () => {
    navigator.clipboard.writeText(staffFixSql);
    setStaffFixCopied(true);
    setTimeout(() => setStaffFixCopied(false), 2000);
  }

  const copyStaffRecreate = () => {
    navigator.clipboard.writeText(staffRecreateSql);
    setStaffRecreateCopied(true);
    setTimeout(() => setStaffRecreateCopied(false), 2000);
  }

  const handleSaveConfig = () => {
      configureSupabaseManually(apiUrl || defaultUrl, apiKey);
  };

  const handleReset = () => {
      if(confirm('Isso removerá a configuração salva e recarregará a página. Você precisará inserir a URL e a API KEY novamente. Continuar?')) {
          clearSupabaseConfig();
      }
  }

  const handleTestConnection = async () => {
      setTestStatus('testing');
      setTestMessage('');
      try {
          // If the specific error was about 'staff' table, verify that specific table/column
          if (isStaffError) {
             const { error } = await supabase.from('staff').select('admissiondate').limit(1);
             if (error) throw error;
             setTestMessage('Tabela Staff: SUCESSO! Coluna encontrada.');
          } else {
             // Standard test
             const { data, error } = await supabase.from('audit_logs').select('count').limit(1);
             if (error) throw error;
             
             // Try a write test
             const { error: writeError } = await supabase.from('audit_logs').upsert({
                 id: 'test-connection',
                 action: 'Test',
                 category: 'System',
                 timestamp: new Date().toISOString(),
                 targetname: 'Connection Check',
                 details: 'This is a test row to verify write permissions.'
             });
             
             if (writeError) throw writeError;
             setTestMessage('Conexão e Permissão de Escrita: OK!');
          }

          setTestStatus('success');
      } catch (err: any) {
          setTestStatus('fail');
          setTestMessage(`Falha: ${err.message || 'Erro desconhecido'}`);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg text-white">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Atenção: Banco de Dados Desatualizado</h2>
              <p className="text-sm text-slate-500">Siga os passos abaixo para corrigir os erros de salvamento.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {errorDetails && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 shadow-sm">
                  <ShieldAlert className="text-red-600 shrink-0 mt-1" size={24} />
                  <div>
                      <h3 className="font-bold text-red-800">Erro Detectado (Diagnóstico)</h3>
                      <p className="text-sm text-red-700 mt-1">{errorDetails}</p>
                      
                      {isStaffError ? (
                          <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded">
                             <strong>Problema:</strong> A tabela 'staff' existe, mas a coluna 'admissiondate' está invisível para a API.
                          </p>
                      ) : isCacheError ? (
                          <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded">
                             A API precisa atualizar o cache do esquema do banco.
                          </p>
                      ) : (
                          <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded">
                             O banco de dados não tem a tabela ou coluna necessária.
                          </p>
                      )}
                  </div>
              </div>
            )}

            {/* SPECIFIC STAFF FIX SECTION */}
            {isStaffError && (
                <div className="space-y-4">
                    {/* Option 1: Soft Fix */}
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Wrench className="text-blue-600 animate-pulse" size={20} />
                            <h3 className="font-bold text-blue-800">Opção 1: Tentar Reparar (Sem Perder Dados)</h3>
                        </div>
                        <p className="text-sm text-blue-700 mb-3">
                            Tenta forçar o reconhecimento da coluna sem apagar a tabela.
                        </p>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-white border border-blue-200 p-3 rounded-lg font-mono text-xs text-slate-700 whitespace-pre-line">
                                {staffFixSql}
                            </div>
                            <button 
                                onClick={copyStaffFix}
                                className="bg-blue-600 text-white px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                {staffFixCopied ? <Check size={16}/> : <Copy size={16}/>}
                                {staffFixCopied ? 'Copiado!' : 'Copiar'}
                            </button>
                        </div>
                    </div>

                    {/* Option 2: Hard Fix (Recreate) */}
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Trash2 className="text-red-600" size={20} />
                            <h3 className="font-bold text-red-800">Opção 2 (Avançado): Recriar Tabela Staff</h3>
                        </div>
                        <p className="text-sm text-red-700 mb-3 font-medium">
                            ⚠️ Use esta opção se a Opção 1 não funcionou. Ela irá APAGAR todos os colaboradores cadastrados para recriar a tabela do zero corretamente.
                        </p>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-white border border-red-200 p-3 rounded-lg font-mono text-xs text-slate-700 whitespace-pre-line">
                                {staffRecreateSql}
                            </div>
                            <button 
                                onClick={copyStaffRecreate}
                                className="bg-red-600 text-white px-4 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {staffRecreateCopied ? <Check size={16}/> : <Copy size={16}/>}
                                {staffRecreateCopied ? 'Copiado!' : 'Copiar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* GENERIC CACHE FIX SECTION (Only visible if generic cache error and not specific staff error) */}
            {isCacheError && !isStaffError && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-3">
                        <RefreshCw className="text-amber-600 animate-spin-slow" size={20} />
                        <h3 className="font-bold text-amber-800">Solução para Erro de Cache (Recomendado)</h3>
                    </div>
                    <p className="text-sm text-amber-700 mb-3">
                        Se você já rodou o script completo e a coluna existe, a API está "travada". Rode este comando simples para destravar:
                    </p>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-white border border-amber-200 p-3 rounded-lg font-mono text-xs text-slate-700">
                            {cacheFixSql}
                        </div>
                        <button 
                            onClick={copyCacheFix}
                            className="bg-amber-600 text-white px-4 rounded-lg font-bold hover:bg-amber-700 transition-colors flex items-center gap-2"
                        >
                            {cacheCopied ? <Check size={16}/> : <Copy size={16}/>}
                            {cacheCopied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <p className="text-xs text-amber-600 mt-2">
                        Após rodar isso no SQL Editor, clique em <strong>Verificar Correção</strong> abaixo.
                    </p>
                </div>
            )}

            {!isStaffError && (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg">Script Completo (Se ainda não rodou):</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Step 1 */}
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-blue-800 flex items-center gap-2">
                                    <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                    Copiar Script SQL
                                </span>
                                <button 
                                    onClick={copyToClipboard}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        copied ? 'bg-green-600 text-white' : 'bg-white text-slate-700 hover:bg-blue-100'
                                    }`}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                            <p className="text-xs text-blue-700 mb-2">
                                Recria todas as tabelas corretamente.
                            </p>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-slate-900 rounded-lg opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
                                <pre className="bg-slate-900 text-slate-300 p-3 rounded-lg text-[10px] font-mono overflow-hidden h-24 border border-slate-700">
                                    <code>{sqlCode}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl flex flex-col">
                            <span className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                                <span className="bg-slate-300 text-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                Executar no Supabase
                            </span>
                            <p className="text-sm text-slate-600 mb-4 flex-1">
                                Clique no botão abaixo para abrir o <strong>SQL Editor</strong> do seu projeto. Cole o código e clique em <strong>Run</strong>.
                            </p>
                            <a 
                                href={dashboardSqlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md group"
                            >
                                Abrir Editor SQL do Supabase
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800">Passo Final: Teste de Conexão</h3>
                        <p className="text-xs text-slate-500">Após rodar o script ou a correção, verifique aqui.</p>
                    </div>
                    <button 
                        onClick={handleTestConnection}
                        disabled={testStatus === 'testing'}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 disabled:opacity-50"
                    >
                        <Wifi size={14} />
                        {testStatus === 'testing' ? 'Verificando...' : 'Testar Agora'}
                    </button>
                </div>
                {testMessage && (
                    <div className={`mt-3 p-2 rounded text-xs font-mono flex items-center gap-2 ${testStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {testStatus === 'success' ? <Check size={14}/> : <ShieldAlert size={14}/>}
                        {testMessage}
                    </div>
                )}
            </div>

            {/* Advanced / Reset */}
            <div className="pt-6 border-t border-slate-200">
                 <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                    <Power size={16} className="text-red-600" />
                    Problemas Persistentes?
                 </h4>
                 <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-4">
                    <div className="flex items-start gap-3">
                        <Info className="text-red-500 mt-0.5 shrink-0" size={16} />
                        <p className="text-xs text-red-700">
                            Se o erro persistir mesmo após rodar os scripts, é provável que <strong>o app esteja conectado a um projeto Supabase diferente daquele onde você está rodando o SQL</strong>.
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={handleReset}
                            className="bg-white border border-red-300 text-red-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                            <LogOut size={14} />
                            Resetar Conexão / Trocar Chaves
                        </button>
                        <a 
                            href="https://supabase.com/dashboard/project/_/settings/general"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw size={14} />
                            Reiniciar Projeto (Dashboard)
                        </a>
                    </div>
                 </div>
            </div>

            {/* Manual Config */}
            <div className="pt-4">
                 <details className="group">
                    <summary className="font-bold text-slate-500 text-sm cursor-pointer flex items-center gap-2 hover:text-slate-700">
                        <SettingsIcon /> Inserir Chaves Manualmente
                    </summary>
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-slate-200">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Project URL</label>
                            <input 
                                type="text" 
                                placeholder="https://xyz.supabase.co" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Anon Public Key</label>
                            <input 
                                type="text" 
                                placeholder="eyJhbGci..." 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            disabled={!apiKey || !apiUrl}
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-900 disabled:opacity-50"
                        >
                            Salvar Chaves
                        </button>
                    </div>
                 </details>
            </div>

        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-colors"
            >
                Fechar e Tentar Novamente
            </button>
        </div>

      </div>
    </div>
  );
};

const SettingsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

export default DatabaseSetupModal;