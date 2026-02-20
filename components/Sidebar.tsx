
import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Users, 
  Settings, 
  LogOut,
  Building2,
  Truck,
  DollarSign,
  Megaphone,
  ClipboardCheck,
  X,
  Route,
  ShieldAlert,
  MessageCircleHeart,
  KeyRound,
  History,
  Download,
  PackageSearch,
  HelpCircle
} from 'lucide-react';
import { Staff, PermissionConfig, AppModule } from '../types';

interface SidebarProps {
  currentView: 'calendar' | 'team' | 'clients' | 'suppliers' | 'financial' | 'portal' | 'checklist' | 'patrol' | 'social' | 'settings' | 'access-control' | 'concierge' | 'audit-log' | 'inventory';
  onNavigate: (view: any) => void;
  onLogout: () => void;
  onOpenHelp: () => void; // New Prop
  currentUser: Staff | any;
  isOpen: boolean; // Mobile state
  onClose: () => void; // Close handler
  permissions?: PermissionConfig; // Optional to not break existing tests if any, but we will pass it
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, onOpenHelp, currentUser, isOpen, onClose, permissions }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS or if already installed/not supported
      alert("Para instalar o AD-HOC:\n\n📱 iOS (iPhone/iPad): Toque no botão 'Compartilhar' e selecione 'Adicionar à Tela de Início'.\n\n💻 PC/Android: Procure o ícone de instalação na barra de endereço ou no menu do navegador.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };
  
  const handleNavClick = (view: any) => {
    onNavigate(view);
    onClose(); // Auto close on mobile selection
  };

  // Helper to check access
  const canAccess = (module: AppModule): boolean => {
    // Admin Master and Diretoria always have access
    if (currentUser?.id === 'admin-master' || currentUser?.role === 'Diretoria') return true;
    
    // Check permissions config
    if (!permissions) return true; // Default to true if no permissions passed (safety)
    
    const allowedRoles = permissions[module]?.view || [];
    return allowedRoles.includes(currentUser?.role);
  };

  const isAdmin = currentUser?.id === 'admin-master' || currentUser?.role === 'Diretoria';

  const roleTranslations: Record<string, string> = {
    'Security': 'Segurança',
    'Concierge': 'Porteiro',
    'Supervisor': 'Supervisor',
    'RH': 'RH',
    'Diretoria': 'Diretoria',
    'Administração': 'Administração'
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#EBEBEB] dark:bg-slate-800 text-slate-600 dark:text-slate-300 h-screen shadow-xl border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
      `}>
        {/* Header - Fixed at top */}
        <div className="shrink-0 p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-[#EBEBEB] dark:bg-slate-800 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="bg-[#EBEBEB] dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
                <defs>
                  <mask id="target-mask-sidebar">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <rect x="43" y="0" width="14" height="100" fill="black" />
                    <rect x="0" y="43" width="100" height="14" fill="black" />
                  </mask>
                </defs>
                <g mask="url(#target-mask-sidebar)">
                  <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="12" />
                  <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="12" />
                </g>
              </svg>
            </div>
            <div>
              <h1 className="text-slate-800 dark:text-white font-serif font-bold text-lg tracking-tight">AD-HOC</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Developed by Underdog AID</p>
            </div>
          </div>
          {/* Close Button Mobile Only */}
          <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Wrapper (Nav + Footer) */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <nav className="flex-1 px-4 py-6 space-y-1">
              
              {/* 1. Social */}
              {canAccess('social') && (
                <NavItem 
                  icon={<MessageCircleHeart size={20}/>} 
                  label="Social" 
                  active={currentView === 'social'} 
                  onClick={() => handleNavClick('social')}
                />
              )}

              {/* 2. Portaria */}
              {canAccess('concierge') && (
                <NavItem 
                  icon={<KeyRound size={20}/>} 
                  label="Portaria" 
                  active={currentView === 'concierge'} 
                  onClick={() => handleNavClick('concierge')}
                />
              )}

              {/* 3. Escala */}
              {canAccess('calendar') && (
                <NavItem 
                  icon={<CalendarDays size={20}/>} 
                  label="Escala" 
                  active={currentView === 'calendar'} 
                  onClick={() => handleNavClick('calendar')}
                />
              )}

              {/* 4. Portal RH */}
              {canAccess('portal') && (
                <NavItem 
                  icon={<Megaphone size={20}/>} 
                  label="Portal RH" 
                  active={currentView === 'portal'} 
                  onClick={() => handleNavClick('portal')}
                />
              )}

              {/* 5. Equipe */}
              {canAccess('team') && (
                <NavItem 
                  icon={<Users size={20}/>} 
                  label="Equipe" 
                  active={currentView === 'team'} 
                  onClick={() => handleNavClick('team')}
                />
              )}

              {/* 6. Rondas */}
              {canAccess('patrol') && (
                <NavItem 
                  icon={<Route size={20}/>} 
                  label="Rondas" 
                  active={currentView === 'patrol'} 
                  onClick={() => handleNavClick('patrol')}
                />
              )}

              {/* 7. Vistoria */}
              {canAccess('checklist') && (
                <NavItem 
                  icon={<ClipboardCheck size={20}/>} 
                  label="Vistoria" 
                  active={currentView === 'checklist'} 
                  onClick={() => handleNavClick('checklist')}
                />
              )}

              {/* 8. Estoque - NOVO */}
              {canAccess('inventory') && (
                <NavItem 
                  icon={<PackageSearch size={20}/>} 
                  label="Estoque" 
                  active={currentView === 'inventory'} 
                  onClick={() => handleNavClick('inventory')}
                />
              )}

              {/* 9. Financeiro */}
              {canAccess('financial') && (
                <NavItem 
                  icon={<DollarSign size={20}/>} 
                  label="Financeiro" 
                  active={currentView === 'financial'} 
                  onClick={() => handleNavClick('financial')}
                />
              )}

              {/* 10. Clientes */}
              {canAccess('clients') && (
                <NavItem 
                  icon={<Building2 size={20}/>} 
                  label="Clientes" 
                  active={currentView === 'clients'} 
                  onClick={() => handleNavClick('clients')}
                />
              )}

              {/* 11. Fornecedores */}
              {canAccess('suppliers') && (
                <NavItem 
                  icon={<Truck size={20}/>} 
                  label="Fornecedores" 
                  active={currentView === 'suppliers'} 
                  onClick={() => handleNavClick('suppliers')}
                />
              )}
              
              <div className="pt-6 pb-2">
                <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sistema</p>
              </div>
              
              {canAccess('settings') && (
                <NavItem 
                  icon={<Settings size={20}/>} 
                  label="Configurações" 
                  active={currentView === 'settings'}
                  onClick={() => handleNavClick('settings')}
                />
              )}

              {/* Install App Button */}
              {!isInstalled && (
                <NavItem 
                  icon={<Download size={20}/>} 
                  label="Instalar App" 
                  active={false}
                  onClick={handleInstallClick}
                />
              )}

              {isAdmin && (
                <NavItem 
                  icon={<ShieldAlert size={20}/>} 
                  label="Controle de Acesso" 
                  active={currentView === 'access-control'}
                  onClick={() => handleNavClick('access-control')}
                />
              )}

              {canAccess('audit-log') && (
                <NavItem 
                  icon={<History size={20}/>} 
                  label="Histórico" 
                  active={currentView === 'audit-log'} 
                  onClick={() => handleNavClick('audit-log')}
                />
              )}

            </nav>

            {/* Footer - Part of scroll flow now */}
            <div className="shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-[#EBEBEB] dark:bg-slate-800/50 transition-colors duration-200 space-y-3">
              
              {/* Help Button */}
              <button 
                onClick={onOpenHelp}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
              >
                <HelpCircle size={18} className="group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                <span>Ajuda & Tutoriais</span>
              </button>

              <div className="border-t border-slate-300 dark:border-slate-700 pt-3">
                <div className="flex items-center gap-3 px-2 mb-4">
                    {currentUser?.avatar ? (
                        <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                          {currentUser?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser?.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {roleTranslations[currentUser?.role] || currentUser?.role}
                        </p>
                    </div>
                </div>

                <button 
                  onClick={onLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                >
                  <LogOut size={18} className="group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`
    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left
    ${active 
      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-100 dark:border-blue-800' 
      : 'hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 text-slate-600 dark:text-slate-400'}
  `}>
    <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
      {icon}
    </span>
    {label}
  </button>
);

export default Sidebar;
