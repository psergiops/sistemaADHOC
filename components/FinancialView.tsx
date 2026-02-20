
import React, { useState, useMemo } from 'react';
import { Transaction, Client, Supplier, Staff } from '../types';
import { 
    Plus, Search, TrendingUp, TrendingDown, DollarSign, 
    Trash2, ArrowUpRight, ArrowDownRight, Calendar, Filter, X, CheckCircle2, Clock, RotateCcw,
    LayoutList, FileSpreadsheet, Menu, HelpCircle
} from 'lucide-react';
import { format, addMonths, startOfMonth, subMonths, eachMonthOfInterval, isSameMonth, parseISO, endOfDay, isWithinInterval, setDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FinancialViewProps {
  transactions: Transaction[];
  clients: Client[];
  suppliers: Supplier[];
  staff: Staff[];
  onAddTransaction: (t: Transaction) => void;
  onUpdateTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

// Helper to unify transactions and projected contracts
interface UnifiedItem extends Transaction {
    isProjected?: boolean;
    sourceName?: string;
}

const FinancialView: React.FC<FinancialViewProps> = ({ 
    transactions, 
    clients, 
    suppliers,
    staff,
    onAddTransaction,
    onUpdateTransaction,
    onDeleteTransaction,
    onToggleMenu,
    onShowHelp
}) => {
  const today = new Date();
  
  // View Mode State
  const [viewMode, setViewMode] = useState<'list' | 'cashflow'>('list');
  
  // Filter States
  const [dateRange, setDateRange] = useState({
      start: format(startOfMonth(today), 'yyyy-MM-dd'),
      end: format(endOfDay(new Date(today.getFullYear(), today.getMonth() + 1, 0)), 'yyyy-MM-dd')
  });

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Merge Logic for Table View ---
  const unifiedList = useMemo(() => {
    const start = parseISO(dateRange.start);
    const end = parseISO(dateRange.end);
    const monthsInRange = eachMonthOfInterval({ start, end });

    // 1. Real Transactions within range
    const realItems: UnifiedItem[] = transactions.filter(t => 
        isWithinInterval(parseISO(t.date), { start, end })
    ).map(t => ({ ...t, isProjected: false }));

    // 2. Projected Income (Clients)
    const projectedIncome: UnifiedItem[] = [];
    monthsInRange.forEach(monthDate => {
        clients.filter(c => c.isActive).forEach(client => {
            // Check if transaction already exists for this client in this month
            const exists = realItems.find(t => 
                t.relatedClientId === client.id && 
                isSameMonth(parseISO(t.date), monthDate)
            );

            if (!exists) {
                const projectedDate = setDate(monthDate, client.paymentDay);
                if (isWithinInterval(projectedDate, { start, end })) {
                    projectedIncome.push({
                        id: `proj-cli-${client.id}-${format(monthDate, 'yyyy-MM')}`,
                        description: `Mensalidade - ${client.name}`,
                        amount: client.contractValue,
                        type: 'income',
                        date: format(projectedDate, 'yyyy-MM-dd'),
                        category: 'Contrato Mensal',
                        status: 'pending',
                        relatedClientId: client.id,
                        isProjected: true,
                        sourceName: client.name
                    });
                }
            }
        });
    });

    // 3. Projected Expense (Recurring Suppliers)
    const projectedExpense: UnifiedItem[] = [];
    monthsInRange.forEach(monthDate => {
        suppliers.filter(s => s.isRecurring).forEach(supplier => {
             const exists = realItems.find(t => 
                t.relatedSupplierId === supplier.id && 
                isSameMonth(parseISO(t.date), monthDate)
            );

            if (!exists && supplier.contractValue && supplier.paymentDay) {
                 const projectedDate = setDate(monthDate, supplier.paymentDay);
                 if (isWithinInterval(projectedDate, { start, end })) {
                    projectedExpense.push({
                        id: `proj-sup-${supplier.id}-${format(monthDate, 'yyyy-MM')}`,
                        description: `Contrato - ${supplier.name}`,
                        amount: supplier.contractValue,
                        type: 'expense',
                        date: format(projectedDate, 'yyyy-MM-dd'),
                        category: supplier.category,
                        status: 'pending',
                        relatedSupplierId: supplier.id,
                        isProjected: true,
                        sourceName: supplier.name
                    });
                 }
            }
        });
    });

    // 4. Projected Staff Expenses (Salary & Advances)
    const projectedStaff: UnifiedItem[] = [];
    monthsInRange.forEach(monthDate => {
        staff.forEach(employee => {
            // Logic for Advance
            if (employee.takesAdvance && employee.advanceValue && employee.advanceDay) {
                const advanceDate = setDate(monthDate, employee.advanceDay);
                if (isWithinInterval(advanceDate, { start, end })) {
                     // Check if already paid/exists
                    const exists = realItems.find(t => 
                        t.description.includes(`Adiantamento - ${employee.name}`) && 
                        isSameMonth(parseISO(t.date), monthDate)
                    );
                    
                    if (!exists) {
                        projectedStaff.push({
                            id: `proj-stf-adv-${employee.id}-${format(monthDate, 'yyyy-MM')}`,
                            description: `Adiantamento - ${employee.name}`,
                            amount: employee.advanceValue,
                            type: 'expense',
                            date: format(advanceDate, 'yyyy-MM-dd'),
                            category: 'Folha de Pagamento',
                            status: 'pending',
                            isProjected: true,
                            sourceName: employee.name
                        });
                    }
                }
            }

            // Logic for Main Salary
            // If they take an advance, the remaining salary is Total - Advance
            const salaryAmount = employee.takesAdvance && employee.advanceValue 
                ? (employee.salary - employee.advanceValue) 
                : employee.salary;
            
            if (salaryAmount > 0 && employee.paymentDay) {
                const salaryDate = setDate(monthDate, employee.paymentDay);
                // Usually salary is paid the NEXT month if day is early (e.g. 5th), but for simplicity let's keep it in the projected month logic or same month
                if (isWithinInterval(salaryDate, { start, end })) {
                    const exists = realItems.find(t => 
                        t.description.includes(`Salário - ${employee.name}`) && 
                        isSameMonth(parseISO(t.date), monthDate)
                    );

                    if (!exists) {
                        projectedStaff.push({
                            id: `proj-stf-sal-${employee.id}-${format(monthDate, 'yyyy-MM')}`,
                            description: `Salário - ${employee.name}`,
                            amount: salaryAmount,
                            type: 'expense',
                            date: format(salaryDate, 'yyyy-MM-dd'),
                            category: 'Folha de Pagamento',
                            status: 'pending',
                            isProjected: true,
                            sourceName: employee.name
                        });
                    }
                }
            }
        });
    });


    let combined = [...realItems, ...projectedIncome, ...projectedExpense, ...projectedStaff];

    // Apply Type Filter
    if (filterType !== 'all') {
        combined = combined.filter(t => t.type === filterType);
    }

    // Apply Search
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        combined = combined.filter(t => 
            t.description.toLowerCase().includes(lower) || 
            t.category.toLowerCase().includes(lower) ||
            (t.sourceName && t.sourceName.toLowerCase().includes(lower))
        );
    }

    // Sort Descending for List View, Ascending for Cash Flow logic
    return combined.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  }, [transactions, clients, suppliers, staff, dateRange, filterType, searchTerm]);

  // --- Cash Flow Logic (Chronological Order + Running Balance) ---
  const cashFlowList = useMemo(() => {
      // Clone and sort ASC for bank statement style
      const sortedAsc = [...unifiedList].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let runningBalance = 0;
      return sortedAsc.map(item => {
          const val = item.type === 'income' ? item.amount : -item.amount;
          runningBalance += val;
          return { ...item, runningBalance };
      });
  }, [unifiedList]);


  // --- Totals Calculation based on Filtered View ---
  const totals = useMemo(() => {
      const income = unifiedList.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expense = unifiedList.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      return { income, expense, balance: income - expense };
  }, [unifiedList]);


  // --- Chart Logic ---
  const startChartDate = startOfMonth(subMonths(today, 3));
  const endChartDate = startOfMonth(addMonths(today, 3));
  const monthsInterval = eachMonthOfInterval({ start: startChartDate, end: endChartDate });

  const chartData = useMemo(() => {
    return monthsInterval.map(date => {
        const monthKey = format(date, 'yyyy-MM');

        // Real Data
        const monthlyTransactions = transactions.filter(t => format(parseISO(t.date), 'yyyy-MM') === monthKey);
        let income = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        let expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

        // Add Recurring Income
        clients.filter(c => c.isActive).forEach(c => {
             const hasTx = monthlyTransactions.find(t => t.relatedClientId === c.id);
             if(!hasTx) income += c.contractValue;
        });

        // Add Recurring Expense (Suppliers)
        suppliers.filter(s => s.isRecurring && s.contractValue).forEach(s => {
             const hasTx = monthlyTransactions.find(t => t.relatedSupplierId === s.id);
             if(!hasTx) expense += (s.contractValue || 0);
        });

        // Add Recurring Expense (Staff Payroll) - Simple Projection for Chart
        staff.forEach(s => {
            // Since this is a simple chart projection, we just add the full salary to expense
            // We don't check for specific dates as strictly as the table, just month total
            expense += (s.salary || 0);
        });
        
        // Fallback estimate if zero (just for visualization niceness in mock)
        if (date > today && expense === 0) {
             expense += 0; 
        }

        return {
            date,
            label: format(date, 'MMM', { locale: ptBR }),
            income,
            expense
        };
    });
  }, [transactions, clients, suppliers, staff]);


  // Formatters
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Modal State
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    type: 'expense',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'paid',
    category: 'Geral',
    amount: 0,
    description: ''
  });

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if(newTx.description && newTx.amount) {
        onAddTransaction({
            id: `tx-${Date.now()}`,
            description: newTx.description!,
            amount: Number(newTx.amount),
            type: newTx.type as 'income' | 'expense',
            date: newTx.date!,
            category: newTx.category!,
            status: newTx.status as 'paid' | 'pending'
        });
        setIsModalOpen(false);
        setNewTx({ ...newTx, description: '', amount: 0 });
    }
  }

  const handleToggleStatus = (item: UnifiedItem) => {
      if (item.isProjected) {
          onAddTransaction({
              id: `tx-${Date.now()}`,
              description: item.description,
              amount: item.amount,
              type: item.type,
              date: item.date,
              category: item.category,
              status: 'paid',
              relatedClientId: item.relatedClientId,
              relatedSupplierId: item.relatedSupplierId
          });
      } else {
          const newStatus = item.status === 'paid' ? 'pending' : 'paid';
          onUpdateTransaction({ ...item, status: newStatus });
      }
  };

  // --- SVG Chart Logic ---
  const width = 800;
  const height = 200;
  const padding = 40;
  const maxVal = Math.max(...chartData.map(d => Math.max(d.income, d.expense))) * 1.2 || 1000;
  
  const getX = (index: number) => padding + (index * ((width - padding * 2) / (chartData.length - 1)));
  const getY = (val: number) => height - padding - ((val / maxVal) * (height - padding * 2));

  const pointsIncome = chartData.map((d, i) => `${getX(i)},${getY(d.income)}`).join(' ');
  const pointsExpense = chartData.map((d, i) => `${getX(i)},${getY(d.expense)}`).join(' ');

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Menu size={24} />
                </button>
                <div>
                <h2 className="text-xl font-bold text-slate-800">Financeiro</h2>
                <p className="text-sm text-slate-500">Fluxo de caixa e controle de contratos</p>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                 <button
                    onClick={onShowHelp}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium mr-2"
                    title="Ver Tutorial deste Módulo"
                 >
                    <HelpCircle size={18} />
                    <span className="hidden md:inline">Tutorial</span>
                 </button>

                 <button 
                    onClick={() => {
                        setNewTx({ ...newTx, type: 'income', category: 'Receita Extra', status: 'paid' });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Receita</span>
                </button>
                <button 
                    onClick={() => {
                        setNewTx({ ...newTx, type: 'expense', category: 'Despesa', status: 'paid' });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Despesa</span>
                </button>
            </div>
        </div>

        <div className="p-6 space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Receitas</p>
                        <h3 className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totals.income)}</h3>
                        <p className="text-xs text-slate-400 mt-1">No período selecionado</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <TrendingUp size={24} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Despesas</p>
                        <h3 className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totals.expense)}</h3>
                         <p className="text-xs text-slate-400 mt-1">No período selecionado</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <TrendingDown size={24} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Saldo Líquido</p>
                        <h3 className={`text-2xl font-bold mt-1 ${totals.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {formatCurrency(totals.balance)}
                        </h3>
                         <p className="text-xs text-slate-400 mt-1">No período selecionado</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <DollarSign size={24} />
                    </div>
                </div>
            </div>

            {/* Chart Section (Collapsible or always visible?) - Keeping visible for context */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp size={16} className="text-slate-500"/>
                    Evolução Semestral (Histórico + Projeção Contratual)
                </h3>
                <div className="w-full overflow-x-auto">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 min-w-[600px]">
                        {[0, 0.25, 0.5, 0.75, 1].map(t => (
                            <line key={t} x1={padding} y1={getY(maxVal * t)} x2={width - padding} y2={getY(maxVal * t)} stroke="#f1f5f9" strokeWidth="1" />
                        ))}
                        <polyline fill="none" stroke="#22c55e" strokeWidth="3" points={pointsIncome} strokeLinecap="round" strokeLinejoin="round" />
                        <polyline fill="none" stroke="#ef4444" strokeWidth="3" points={pointsExpense} strokeLinecap="round" strokeLinejoin="round" />
                        <line x1={getX(3)} y1={padding} x2={getX(3)} y2={height - padding} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                        {chartData.map((d, i) => (
                            <g key={i}>
                                <circle cx={getX(i)} cy={getY(d.income)} r="3" fill="#fff" stroke="#22c55e" strokeWidth="2" />
                                <circle cx={getX(i)} cy={getY(d.expense)} r="3" fill="#fff" stroke="#ef4444" strokeWidth="2" />
                                <text x={getX(i)} y={height - 5} textAnchor="middle" className="text-[10px] fill-slate-500 font-medium uppercase">{d.label}</text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                 <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter size={16} className="text-slate-400" />
                    <select 
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white text-slate-700 min-w-[120px]"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                    >
                        <option value="all">Todos os tipos</option>
                        <option value="income">Receitas</option>
                        <option value="expense">Despesas</option>
                    </select>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Calendar size={16} className="text-slate-400" />
                    <div className="flex items-center gap-2">
                        <input 
                            type="date" 
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white text-slate-700"
                        />
                        <span className="text-slate-400">-</span>
                        <input 
                            type="date" 
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white text-slate-700"
                        />
                    </div>
                </div>

                <div className="relative flex-1 w-full">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar transação..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 bg-white text-slate-700"
                    />
                </div>
            </div>

            {/* View Toggle Tabs */}
            <div className="flex gap-2">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'list' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <LayoutList size={16} />
                    Transações
                </button>
                <button 
                    onClick={() => setViewMode('cashflow')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'cashflow' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <FileSpreadsheet size={16} />
                    Fluxo de Caixa
                </button>
            </div>

            {/* Data Tables */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {viewMode === 'list' ? (
                    /* Existing List View */
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Descrição</th>
                                <th className="px-6 py-3">Categoria</th>
                                <th className="px-6 py-3">Data Vencimento</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Valor</th>
                                <th className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {unifiedList.map(tx => (
                                <tr key={tx.id} className={`hover:bg-slate-50 group ${tx.isProjected ? 'bg-slate-50/40' : ''}`}>
                                    <td className="px-6 py-3 font-medium text-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded ${tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {tx.type === 'income' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                                            </div>
                                            <div>
                                                <p>{tx.description}</p>
                                                {tx.isProjected && <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 rounded-sm">Contrato Automático</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-slate-500">{tx.category}</td>
                                    <td className="px-6 py-3 text-slate-500">{format(parseISO(tx.date), 'dd/MM/yyyy')}</td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                            tx.status === 'paid' 
                                                ? 'bg-green-50 text-green-700 border-green-200' 
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {tx.status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                            {tx.status === 'paid' ? 'Pago' : 'Pendente'}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-3 text-right font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'expense' ? '-' : '+'} {formatCurrency(tx.amount)}
                                    </td>
                                    <td className="px-6 py-3 text-center flex items-center justify-center gap-2">
                                        <button onClick={() => handleToggleStatus(tx)} className={`p-1.5 rounded transition-colors ${tx.status === 'paid' ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}>
                                            <RotateCcw size={16} />
                                        </button>
                                        {!tx.isProjected && (
                                            <button onClick={() => onDeleteTransaction(tx.id)} className="text-slate-300 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    /* New Cash Flow (Bank Statement) View */
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 w-32">Data</th>
                                <th className="px-6 py-3">Descrição</th>
                                <th className="px-6 py-3 text-right text-green-700">Entrada</th>
                                <th className="px-6 py-3 text-right text-red-700">Saída</th>
                                <th className="px-6 py-3 text-right font-bold text-slate-700 bg-slate-100/50">Saldo Acumulado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {cashFlowList.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 text-slate-600 font-medium">
                                        {format(parseISO(tx.date), 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-6 py-3 text-slate-800">
                                        {tx.description}
                                        {tx.isProjected && <span className="ml-2 text-[10px] text-slate-400 border border-slate-200 px-1 rounded">Previsto</span>}
                                    </td>
                                    <td className="px-6 py-3 text-right text-green-600 font-medium">
                                        {tx.type === 'income' ? formatCurrency(tx.amount) : '-'}
                                    </td>
                                    <td className="px-6 py-3 text-right text-red-600 font-medium">
                                        {tx.type === 'expense' ? formatCurrency(tx.amount) : '-'}
                                    </td>
                                    <td className={`px-6 py-3 text-right font-bold bg-slate-50/50 border-l border-slate-100 ${tx.runningBalance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                                        {formatCurrency(tx.runningBalance)}
                                    </td>
                                </tr>
                            ))}
                            {cashFlowList.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        Nenhum lançamento no período para exibir o extrato.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

        </div>

        {/* Modal for New Transaction */}
        {isModalOpen && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800">
                            Nova {newTx.type === 'income' ? 'Receita' : 'Despesa'} Manual
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                    <form onSubmit={handleSaveTransaction} className="p-5 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Descrição</label>
                            <input autoFocus required type="text" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} 
                                placeholder="Ex: Pagamento extra, Compra de material..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Valor (R$)</label>
                                <input required type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newTx.amount || ''} onChange={e => setNewTx({...newTx, amount: parseFloat(e.target.value)})} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Data</label>
                                <input required type="date" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Categoria</label>
                            <select className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})}
                            >
                                <option value="Geral">Geral</option>
                                <option value="Vendas">Vendas</option>
                                <option value="Serviços">Serviços</option>
                                <option value="Equipamentos">Equipamentos</option>
                                <option value="Folha de Pagamento">Folha de Pagamento</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Impostos">Impostos</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Status</label>
                            <select className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTx.status} onChange={e => setNewTx({...newTx, status: e.target.value as 'paid' | 'pending'})}
                            >
                                <option value="paid">Pago / Recebido</option>
                                <option value="pending">Pendente</option>
                            </select>
                        </div>

                         <div className="pt-2 flex justify-end gap-2">
                             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                             <button type="submit" className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm ${newTx.type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                Salvar
                             </button>
                         </div>
                    </form>
                </div>
             </div>
        )}

    </div>
  );
};

export default FinancialView;
