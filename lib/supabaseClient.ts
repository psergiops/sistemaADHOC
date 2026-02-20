
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO ZERO ---
// Nenhuma chave fixa. O sistema rodará em modo DEMO (Mock Data)
// até que o usuário insira chaves manualmente ou via variáveis de ambiente.
const HARDCODED_URL = '';
const HARDCODED_KEY = '';

// Tenta pegar do ambiente (Vite)
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Tenta pegar do localStorage (caso o usuário configure via UI)
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('ad_hoc_supabase_url') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('ad_hoc_supabase_key') : null;

// Prioridade: LocalStorage > Env > Hardcoded (vazio)
const supabaseUrl = storedUrl || envUrl || HARDCODED_URL;
const supabaseKey = storedKey || envKey || HARDCODED_KEY;

// Verifica se temos uma configuração mínima válida
const hasUrl = supabaseUrl && supabaseUrl.length > 0 && supabaseUrl !== 'undefined';
const hasKey = supabaseKey && supabaseKey.length > 0 && supabaseKey !== 'undefined';

export const isSupabaseConfigured = hasUrl && hasKey;

let clientUrl = supabaseUrl;
let clientKey = supabaseKey;

if (!isSupabaseConfigured) {
  console.log('ℹ️ Modo Demo: Nenhuma conexão de banco de dados ativa. Usando dados locais (Mocks).');
  // Valores placeholder apenas para não quebrar a inicialização do client, 
  // mas as chamadas não serão feitas se isSupabaseConfigured for false no App.tsx
  clientUrl = 'https://placeholder.supabase.co';
  clientKey = 'placeholder';
} else {
  console.log('✅ Supabase Client configurado.');
}

export const supabase = createClient(clientUrl as string, clientKey as string);

// Função auxiliar para salvar credenciais manualmente via UI
export const configureSupabaseManually = (url: string, key: string) => {
  localStorage.setItem('ad_hoc_supabase_url', url);
  localStorage.setItem('ad_hoc_supabase_key', key);
  window.location.reload();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('ad_hoc_supabase_url');
  localStorage.removeItem('ad_hoc_supabase_key');
  window.location.reload();
};

// Instância isolada para criar novos usuários em background
// Isso garante que a sessão atual do Administrador não seja sobrescrita ('deslogada')
export const createStaffAuthClient = () => {
  return createClient(clientUrl as string, clientKey as string, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
};
