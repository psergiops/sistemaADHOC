
import React, { useState } from 'react';
import { InventoryItem, InventoryMovement, Staff } from '../types';
import { 
  Menu, Package, History, ClipboardList, Truck, Search, Plus, Filter, 
  ArrowUpRight, ArrowDownRight, RotateCcw, AlertTriangle, FileText, HelpCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import InventoryItemFormModal from './InventoryItemFormModal';

interface InventoryViewProps {
  items: InventoryItem[];
  movements: InventoryMovement[];
  onStockEntry: (code: string, quantity: number, reference: string, staffId: string) => void;
  onStockAdjustment: (itemId: string, quantity: number, type: 'ADJUSTMENT', notes: string, staffId: string) => void;
  onAddItem: (item: InventoryItem) => void;
  onToggleMenu: () => void;
  currentUser: Staff;
  onShowHelp: () => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ 
  items, movements, onStockEntry, onStockAdjustment, onAddItem, onToggleMenu, currentUser, onShowHelp 
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'entry' | 'adjustment' | 'history'>('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Entry Form State
  const [entryCode, setEntryCode] = useState('');
  const [entryQty, setEntryQty] = useState('');
  const [entryRef, setEntryRef] = useState('');
  const [foundItem, setFoundItem] = useState<InventoryItem | null>(null);

  // Adjustment Form State
  const [adjItemId, setAdjItemId] = useState('');
  const [adjQty, setAdjQty] = useState('');
  const [adjNotes, setAdjNotes] = useState('');

  // Filter Items - Ensure case insensitive matching and safe access
  const filteredItems = items.filter(i => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = i.name?.toLowerCase().includes(term);
    const codeMatch = i.code?.toLowerCase().includes(term);
    const categoryMatch = i.category?.toLowerCase().includes(term);
    return nameMatch || codeMatch || categoryMatch;
  });

  // Filter Movements
  const sortedMovements = [...movements].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Handlers
  const handleCodeBlur = () => {
    const item = items.find(i => i.code.toLowerCase() === entryCode.toLowerCase());
    setFoundItem(item || null);
  };

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundItem || !entryQty || !entryRef) return;
    
    onStockEntry(foundItem.code, parseInt(entryQty), entryRef, currentUser.id);
    
    // Reset
    setEntryCode('');
    setEntryQty('');
    setEntryRef('');
    setFoundItem(null);
    alert('Entrada registrada com sucesso!');
  };

  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjItemId || !adjQty || !adjNotes) return;

    onStockAdjustment(adjItemId, parseInt(adjQty), 'ADJUSTMENT', adjNotes, currentUser.id);
    
    // Reset
    setAdjItemId('');
    setAdjQty('');
    setAdjNotes('');
    alert('Ajuste realizado com sucesso!');
  };

  const handleAddItem = (newItem: InventoryItem) => {
      onAddItem(newItem);
      alert('Item cadastrado com sucesso!');
  };

  const darkInputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 transition-colors";

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Gestão de Estoque</h2>
                <p className="text-sm text-slate-500">Controle de materiais, entradas e saídas</p>
            </div>
        </div>
        <button
          onClick={onShowHelp}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium"
          title="Ver Tutorial deste Módulo"
        >
          <HelpCircle size={18} />
          <span className="hidden md:inline">Tutorial</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-6 overflow-x-auto">
            <button onClick={() => setActiveTab('current')} className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'current' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <Package size={18} /> Estoque Atual
            </button>
            <button onClick={() => setActiveTab('entry')} className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'entry' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <Truck size={18} /> Entrada de Nota
            </button>
            <button onClick={() => setActiveTab('adjustment')} className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'adjustment' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <ClipboardList size={18} /> Inventário / Ajuste
            </button>
            <button onClick={() => setActiveTab('history')} className={`py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <History size={18} /> Histórico
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
        
        {/* Tab 1: Current Stock */}
        {activeTab === 'current' && (
            <div className="space-y-4 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-[#333] p-2 rounded-xl border border-slate-700 flex items-center gap-3 px-4 shadow-sm">
                        <Search className="text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome, código ou categoria..." 
                            className="flex-1 outline-none bg-transparent text-white placeholder-slate-500 text-sm py-2"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-300">
                                <AlertTriangle size={14} className="rotate-180" /> {/* Just a clear icon placeholder logic if needed, using standard input logic is fine */}
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={() => setIsItemModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                        <Plus size={18} />
                        Novo Item
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Código</th>
                                <th className="px-6 py-3">Item</th>
                                <th className="px-6 py-3">Categoria</th>
                                <th className="px-6 py-3 text-right">Saldo Atual</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredItems.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-mono text-slate-500 font-medium">{item.code}</td>
                                    <td className="px-6 py-3 font-bold text-slate-800">{item.name}</td>
                                    <td className="px-6 py-3 text-slate-500">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-3 text-right font-bold text-slate-700 text-base">{item.quantity}</td>
                                    <td className="px-6 py-3 text-center">
                                        {item.quantity <= item.minThreshold ? (
                                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-100">
                                                <AlertTriangle size={12} /> Baixo
                                            </span>
                                        ) : (
                                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-100">OK</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-slate-400 flex flex-col items-center justify-center">
                                        <Package size={40} className="mb-2 opacity-20"/>
                                        <p>Nenhum item encontrado.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Tab 2: Entry */}
        {activeTab === 'entry' && (
            <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Truck size={20} className="text-blue-600" /> Registrar Entrada de Nota Fiscal
                </h3>
                <form onSubmit={handleEntrySubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Código do Item</label>
                        <div className="flex gap-2">
                            <input 
                                required type="text" 
                                placeholder="Digite o código (ex: LIM-001)" 
                                className={darkInputClass}
                                value={entryCode}
                                onChange={e => setEntryCode(e.target.value)}
                                onBlur={handleCodeBlur}
                            />
                            <button type="button" onClick={handleCodeBlur} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg border border-slate-200">
                                <Search size={20} className="text-slate-600" />
                            </button>
                        </div>
                        {foundItem ? (
                            <p className="text-sm text-green-600 font-medium mt-1 flex items-center gap-1">
                                <Package size={14} /> {foundItem.name} (Atual: {foundItem.quantity})
                            </p>
                        ) : entryCode && (
                            <p className="text-sm text-red-500 mt-1">Item não encontrado. Verifique o código.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Quantidade</label>
                            <input 
                                required type="number" min="1"
                                className={darkInputClass}
                                value={entryQty}
                                onChange={e => setEntryQty(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Nº Nota Fiscal / Referência</label>
                            <input 
                                required type="text" 
                                className={darkInputClass}
                                value={entryRef}
                                onChange={e => setEntryRef(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={!foundItem}
                        className={`w-full font-bold py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2
                            ${!foundItem ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-700'}
                        `}
                    >
                        <ArrowDownRight size={18} /> Confirmar Entrada
                    </button>
                </form>
            </div>
        )}

        {/* Tab 3: Adjustment */}
        {activeTab === 'adjustment' && (
            <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <RotateCcw size={20} className="text-orange-600" /> Ajuste de Inventário (Manual)
                </h3>
                <form onSubmit={handleAdjustmentSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Selecione o Item</label>
                        <select 
                            required className={darkInputClass}
                            value={adjItemId}
                            onChange={e => setAdjItemId(e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            {items.map(i => (
                                <option key={i.id} value={i.id}>{i.code} - {i.name} (Qtd: {i.quantity})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Novo Saldo (Quantidade Total Real)</label>
                        <input 
                            required type="number" min="0"
                            className={darkInputClass}
                            placeholder="Digite a quantidade contada no físico"
                            value={adjQty}
                            onChange={e => setAdjQty(e.target.value)}
                        />
                        <p className="text-xs text-slate-500">O sistema calculará a diferença automaticamente.</p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Motivo / Justificativa</label>
                        <textarea 
                            required rows={3}
                            className={darkInputClass}
                            placeholder="Ex: Contagem de auditoria, perda, quebra..."
                            value={adjNotes}
                            onChange={e => setAdjNotes(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={18} /> Salvar Ajuste
                    </button>
                </form>
            </div>
        )}

        {/* Tab 4: History */}
        {activeTab === 'history' && (
            <div className="max-w-6xl mx-auto space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Item</th>
                                <th className="px-6 py-3 text-center">Tipo</th>
                                <th className="px-6 py-3 text-right">Qtd</th>
                                <th className="px-6 py-3">Referência / Motivo</th>
                                <th className="px-6 py-3">Responsável</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedMovements.map(mov => (
                                <tr key={mov.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 text-slate-500">{format(parseISO(mov.date), 'dd/MM/yyyy')}</td>
                                    <td className="px-6 py-3 font-medium text-slate-800">{mov.itemName}</td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${mov.type === 'IN' ? 'bg-green-100 text-green-700' : 
                                              mov.type === 'OUT' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}
                                        `}>
                                            {mov.type === 'IN' ? 'Entrada' : mov.type === 'OUT' ? 'Saída' : 'Ajuste'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right font-mono font-bold">
                                        {mov.type === 'OUT' ? '-' : '+'}{Math.abs(mov.quantity)}
                                    </td>
                                    <td className="px-6 py-3 text-slate-600 truncate max-w-xs">
                                        {mov.referenceId || mov.notes || '-'}
                                    </td>
                                    <td className="px-6 py-3 text-slate-500 text-xs">
                                        ID: {mov.performedBy}
                                    </td>
                                </tr>
                            ))}
                            {sortedMovements.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-400">Nenhuma movimentação registrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        <InventoryItemFormModal 
            isOpen={isItemModalOpen}
            onClose={() => setIsItemModalOpen(false)}
            onSave={handleAddItem}
        />

      </div>
    </div>
  );
};

export default InventoryView;
