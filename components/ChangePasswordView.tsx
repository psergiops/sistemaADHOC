
import React, { useState } from 'react';
import { Lock, ShieldCheck, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ChangePasswordViewProps {
  initialPasswordHint: string;
  onSuccess: () => void;
  onLogout: () => void;
}

const ChangePasswordView: React.FC<ChangePasswordViewProps> = ({ initialPasswordHint, onSuccess, onLogout }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    // Regra de segurança solicitada: Não pode repetir a senha inicial (4 dígitos do CPF)
    if (newPassword === initialPasswordHint) {
      setError('Por segurança, sua nova senha não pode ser igual à senha inicial (4 dígitos do CPF).');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Atualiza a senha no Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
        data: { must_change_password: false } // Remove o flag após sucesso
      });

      if (updateError) throw updateError;

      alert('Senha atualizada com sucesso! Bem-vindo ao AD-HOC.');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar senha.');
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
                  <mask id="target-mask-change">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <rect x="43" y="0" width="14" height="100" fill="black" />
                    <rect x="0" y="43" width="100" height="14" fill="black" />
                  </mask>
                </defs>
                <g mask="url(#target-mask-change)">
                  <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="12" />
                  <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="12" />
                </g>
              </svg>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">AD-HOC</h1>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Segurança do Primeiro Acesso</p>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-800 flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              Sua nova senha deve ser diferente dos 4 dígitos iniciais do seu CPF e conter no mínimo 6 caracteres.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">Nova Senha</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 pl-11 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium text-slate-800"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Lock size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">Confirmar Nova Senha</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Repita a nova senha"
                  className="w-full px-4 py-3 pl-11 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium text-slate-800"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <ShieldCheck size={18} className="absolute left-4 top-3.5 text-slate-400" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <div className="pt-2 gap-3 flex flex-col">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#EA2D01] hover:bg-[#C92701] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                  <>
                    Atualizar e Entrar
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={onLogout}
                className="text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors"
              >
                Cancelar e sair
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordView;
