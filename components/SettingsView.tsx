
import React from 'react';
import { Moon, Sun, Monitor, Type, Menu, HelpCircle } from 'lucide-react';

interface SettingsViewProps {
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  currentFontSize: 'small' | 'medium' | 'large';
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  currentTheme, 
  onThemeChange, 
  currentFontSize, 
  onFontSizeChange,
  onToggleMenu,
  onShowHelp
}) => {
  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] dark:bg-slate-900 transition-colors duration-200">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-200">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Configurações</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Personalize sua experiência no AD-HOC</p>
            </div>
        </div>
        
        {/* Help Button */}
        <button
            onClick={onShowHelp}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            title="Ver Tutorial deste Módulo"
        >
            <HelpCircle size={18} />
            <span className="hidden md:inline">Tutorial</span>
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Theme Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Monitor size={20} className="text-blue-600 dark:text-blue-400" />
                Aparência
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Escolha entre o modo claro e escuro para melhor visualização.
              </p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onThemeChange('light')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  currentTheme === 'light'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-500'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentTheme === 'light' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'
                }`}>
                  <Sun size={20} />
                </div>
                <div className="text-left">
                  <p className={`font-bold ${currentTheme === 'light' ? 'text-blue-900 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>Modo Claro</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">Visual padrão</p>
                </div>
              </button>

              <button
                onClick={() => onThemeChange('dark')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  currentTheme === 'dark'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-500'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentTheme === 'dark' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'
                }`}>
                  <Moon size={20} />
                </div>
                <div className="text-left">
                  <p className={`font-bold ${currentTheme === 'dark' ? 'text-blue-900 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>Modo Escuro</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">Menor brilho</p>
                </div>
              </button>
            </div>
          </div>

          {/* Font Size Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Type size={20} className="text-blue-600 dark:text-blue-400" />
                Tamanho da Fonte
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Ajuste o tamanho do texto para melhor legibilidade.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pequeno (12px)</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Médio (16px)</span>
                <span className="text-lg font-medium text-slate-500 dark:text-slate-400">Grande (20px)</span>
              </div>
              
              <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg flex gap-1">
                <button
                  onClick={() => onFontSizeChange('small')}
                  className={`flex-1 py-3 rounded-md text-sm font-medium transition-all ${
                    currentFontSize === 'small'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <span className="text-xs">Aa</span> Pequeno
                </button>
                <button
                  onClick={() => onFontSizeChange('medium')}
                  className={`flex-1 py-3 rounded-md text-sm font-medium transition-all ${
                    currentFontSize === 'medium'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <span className="text-base">Aa</span> Médio
                </button>
                <button
                  onClick={() => onFontSizeChange('large')}
                  className={`flex-1 py-3 rounded-md text-sm font-medium transition-all ${
                    currentFontSize === 'large'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <span className="text-xl">Aa</span> Grande
                </button>
              </div>

              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Este é um exemplo de como o texto ficará na aplicação. O tamanho da fonte afeta menus, cartões e textos gerais para facilitar a leitura.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsView;
