
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Check, LucideIcon, Filter } from 'lucide-react';

export interface PickerItem {
  id: string;
  label: string;
  sublabel?: string;
  icon?: LucideIcon | React.ComponentType<{ size?: number; className?: string }> | React.ReactNode;
}

interface SearchPickerProps {
  items: PickerItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  placeholder?: string;
  title?: string;
  searchPlaceholder?: string;
  allLabel?: string;
  className?: string;
}

const SearchPicker: React.FC<SearchPickerProps> = ({
  items = [],
  selectedId,
  onSelect,
  placeholder = "Selecionar...",
  title = "Filtrar",
  searchPlaceholder = "Pesquisar...",
  allLabel = "Todos",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = (items || []).find(item => item.id === selectedId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = (items || []).filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sublabel && item.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderIcon = (icon: any, size: number = 16) => {
    if (!icon) return <Filter size={size} />;
    if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in icon)) {
      const IconComponent = icon;
      return <IconComponent size={size} />;
    }
    return icon;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all cursor-pointer select-none
          ${isOpen 
            ? 'bg-white border-blue-500 shadow-lg shadow-blue-100 ring-2 ring-blue-50' 
            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
          }`}
      >
        <div className={`p-1.5 rounded-lg ${selectedId === 'all' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
          {renderIcon(selectedItem?.icon, 16)}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">{title}</p>
          <p className="text-sm font-bold text-slate-700 truncate">
            {selectedId === 'all' ? allLabel : (selectedItem?.label || placeholder)}
          </p>
        </div>

        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-[100] overflow-hidden animate-slide-down min-w-[280px]">
          
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                autoFocus
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setSearchTerm(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[300px] overflow-y-auto py-2 custom-scrollbar">
            {/* "All" Option */}
            <div 
              onClick={() => { onSelect('all'); setIsOpen(false); setSearchTerm(''); }}
              className={`flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors
                ${selectedId === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${selectedId === 'all' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                <span className="text-sm font-bold">{allLabel}</span>
              </div>
              {selectedId === 'all' && <Check size={16} />}
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Items */}
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => { onSelect(item.id); setIsOpen(false); setSearchTerm(''); }}
                  className={`flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors mb-0.5
                    ${selectedId === item.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${selectedId === item.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                      {renderIcon(item.icon, 14)}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-bold truncate">{item.label}</span>
                      {item.sublabel && <span className="text-[10px] opacity-60 uppercase font-black tracking-tight truncate">{item.sublabel}</span>}
                    </div>
                  </div>
                  {selectedId === item.id && <Check size={16} />}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-slate-400 text-sm">Nenhum resultado encontrado.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPicker;
