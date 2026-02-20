
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, Clock } from 'lucide-react';
import { Staff } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface LoginViewProps {
  staffList: Staff[];
  onLogin: (user: Staff | { name: string; role: string; avatar?: string; id: string }) => void;
  logoutMessage?: string | null;
}

const LoginView: React.FC<LoginViewProps> = ({ staffList, onLogin, logoutMessage }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isSupabaseConfigured) {
      // Fallback for Demo Mode
      setTimeout(() => {
        const cleanIdentifier = identifier.trim().toLowerCase();
        if (cleanIdentifier === 'admin@ad-hoc.com' && password === 'admin') {
          onLogin({
            id: 'admin-master',
            name: 'Administrador do Sistema',
            role: 'Diretoria',
            avatar: 'https://ui-avatars.com/api/?name=Admin+System&background=0D8ABC&color=fff'
          });
          setIsLoading(false);
          return;
        }

        const foundUser = staffList.find(staff => staff.email.toLowerCase() === cleanIdentifier);
        if (foundUser) {
          // Mock password check: first 4 digits of CPF for staff login
          const cleanUserCpf = foundUser.documents?.cpf?.replace(/\D/g, '') || '1234';
          const expectedPassword = cleanUserCpf.substring(0, 4);

          if (password === expectedPassword || password === 'admin') {
            onLogin(foundUser);
          } else {
            setError('Senha incorreta.');
          }
        } else {
          setError('E-mail não encontrado no sistema.');
        }
        setIsLoading(false);
      }, 800);
      return;
    }

    // Real Supabase Auth Flow
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: identifier.trim(),
        password: password
      });

      if (authError) throw authError;

      if (data.user) {
        // Find corresponding staff profile by email
        const { data: staffProfile, error: profileError } = await supabase
          .from('staff')
          .select('*')
          .eq('email', data.user.email)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching staff profile:", profileError);
        }

        if (staffProfile) {
          // We'll let App.tsx handle the unflattening via onAuthStateChange, 
          // but we can also trigger onLogin here as a fallback or immediate UI update
          onLogin({
            id: staffProfile.id,
            name: staffProfile.name,
            role: staffProfile.role,
            avatar: staffProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staffProfile.name)}&background=0D8ABC&color=fff`,
            ...staffProfile // Keep other raw fields if needed temporarily
          });
        } else if (data.user.email === 'admin@ad-hoc.com') {
          onLogin({
            id: data.user.id,
            name: 'Administrador do Sistema',
            role: 'Diretoria',
            avatar: 'https://ui-avatars.com/api/?name=Admin+System&background=0D8ABC&color=fff'
          });
        } else {
          setError('Usuário autenticado, mas nenhum perfil de Staff encontrado para este e-mail.');
          await supabase.auth.signOut();
        }
      }
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('E-mail ou senha incorretos.');
      } else {
        setError(err.message || 'Erro ao fazer login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#1F1F1F]">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-white/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10 relative border border-white/20">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-200">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
                <defs>
                  <mask id="target-mask-login">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <rect x="43" y="0" width="14" height="100" fill="black" />
                    <rect x="0" y="43" width="100" height="14" fill="black" />
                  </mask>
                </defs>
                <g mask="url(#target-mask-login)">
                  <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="12" />
                  <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="12" />
                </g>
              </svg>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">AD-HOC</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Developed by Underdog AID</p>
          </div>

          {logoutMessage && (
            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <Clock size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">Sessão Encerrada</p>
                <p className="text-xs mt-1">{logoutMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">
                E-mail
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400 group-focus-within:text-[#6FADFF] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#6FADFF] transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">
                Senha
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-[#6FADFF] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#6FADFF] transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-right pr-1">
                Use a senha definida com a supervisão
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#EA2D01] hover:bg-[#C92701] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Acessar Sistema
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>Versão 3.5.1</span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} /> Ambiente Seguro
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
