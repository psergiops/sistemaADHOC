
import React from 'react';
import { PermissionConfig, AppModule } from '../types';
import { Lock, Shield, Menu, HelpCircle, Eye, Pencil } from 'lucide-react';

interface AccessControlViewProps {
  permissions: PermissionConfig;
  onUpdatePermissions: (newPermissions: PermissionConfig) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const AccessControlView: React.FC<AccessControlViewProps> = ({ 
  permissions, 
  onUpdatePermissions,
  onToggleMenu,
  onShowHelp
}) => {

  const modules: { key: AppModule; label: string }[] = [
    { key: 'calendar', label: 'Escala' },
    { key: 'team', label: 'Equipe' },
    { key: 'clients', label: 'Clientes' },
    { key: 'concierge', label: 'Portaria' },
    { key: 'patrol', label: 'Rondas' },
    { key: 'checklist', label: 'Vistoria' },
    { key: 'inventory', label: 'Estoque' },
    { key: 'social', label: 'Social' },
    { key: 'suppliers', label: 'Fornecedores' },
    { key: 'financial', label: 'Financeiro' },
    { key: 'portal', label: 'Portal RH' },
    { key: 'settings', label: 'Configurações' },
  ];

  const roles = [
    { key: 'Administração', label: 'Administração' },
    { key: 'Supervisor', label: 'Supervisor' },
    { key: 'RH', label: 'RH' },
    { key: 'Security', label: 'Segurança' },
    { key: 'Concierge', label: 'Porteiro' },
  ];

  const toggleViewPermission = (moduleKey: AppModule, roleKey: string) => {
    const currentModule = permissions[moduleKey] || { view: [], edit: [] };
    const isViewAllowed = currentModule.view.includes(roleKey);
    
    let newView = [...currentModule.view];
    let newEdit = [...currentModule.edit];

    if (isViewAllowed) {
        // If removing View, we must also remove Edit
        newView = newView.filter(r => r !== roleKey);
        newEdit = newEdit.filter(r => r !== roleKey);
    } else {
        // Adding View
        newView.push(roleKey);
    }

    onUpdatePermissions({
        ...permissions,
        [moduleKey]: { view: newView, edit: newEdit }
    });
  };

  const toggleEditPermission = (moduleKey: AppModule, roleKey: string) => {
    const currentModule = permissions[moduleKey] || { view: [], edit: [] };
    const isEditAllowed = currentModule.edit.includes(roleKey);
    
    let newView = [...currentModule.view];
    let newEdit = [...currentModule.edit];

    if (isEditAllowed) {
        // Just remove Edit
        newEdit = newEdit.filter(r => r !== roleKey);
    } else {
        // Adding Edit implies Adding View
        newEdit.push(roleKey);
        if (!newView.includes(roleKey)) {
            newView.push(roleKey);
        }
    }

    onUpdatePermissions({
        ...permissions,
        [moduleKey]: { view: newView, edit: newEdit }
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-700">
                    <Shield size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Controle de Acesso</h2>
                    <p className="text-sm text-slate-500">Gerencie a visibilidade e permissões por cargo</p>
                </div>
            </div>
        </div>

        {/* Help Button */}
        <button
            onClick={onShowHelp}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium"
            title="Ver Tutorial deste Módulo"
        >
            <HelpCircle size={18} />
            <span className="hidden md:inline">Tutorial</span>
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
               <div className="flex items-start gap-3">
                  <Lock size={20} className="text-blue-600 mt-1" />
                  <div>
                      <h3 className="font-bold text-slate-800">Matriz de Permissões</h3>
                      <p className="text-sm text-slate-500">
                          Configure quem pode <b>Visualizar</b> (acessar o menu) e quem pode <b>Alterar</b> (criar, editar, excluir) em cada módulo.
                          <br/><span className="text-xs text-blue-600 font-medium">Nota: Habilitar "Alterar" ativa automaticamente "Visualizar".</span>
                      </p>
                  </div>
               </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 sticky left-0 bg-slate-100 z-10">Módulo</th>
                            {roles.map(role => (
                                <th key={role.key} className="px-6 py-4 text-center w-40">{role.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {modules.map((mod) => (
                            <tr key={mod.key} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-100">
                                    {mod.label}
                                </td>
                                {roles.map(role => {
                                    const modulePerms = permissions[mod.key] || { view: [], edit: [] };
                                    const canView = modulePerms.view.includes(role.key);
                                    const canEdit = modulePerms.edit.includes(role.key);

                                    return (
                                        <td key={role.key} className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                
                                                {/* View Toggle */}
                                                <button
                                                    onClick={() => toggleViewPermission(mod.key, role.key)}
                                                    className={`p-2 rounded-lg transition-all border ${
                                                        canView 
                                                            ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                                            : 'bg-slate-50 text-slate-300 border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                    title={canView ? "Acesso Permitido" : "Sem Acesso"}
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                {/* Edit Toggle */}
                                                <button
                                                    onClick={() => toggleEditPermission(mod.key, role.key)}
                                                    disabled={!canView && false} // Logic handled inside function, visually distinct
                                                    className={`p-2 rounded-lg transition-all border ${
                                                        canEdit 
                                                            ? 'bg-orange-50 text-orange-600 border-orange-200' 
                                                            : 'bg-slate-50 text-slate-300 border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                    title={canEdit ? "Edição Permitida" : "Apenas Leitura"}
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControlView;
