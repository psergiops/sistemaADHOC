
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Search, BookOpen, ChevronRight, 
  CalendarDays, Users, Building2, Truck, DollarSign, 
  Megaphone, ClipboardCheck, Route, MessageCircleHeart, 
  KeyRound, Package, ShieldAlert, History, Settings
} from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopicId?: string;
}

const TUTORIAL_DATA = [
  {
    id: 'calendar',
    title: 'Gestão de Escala',
    icon: CalendarDays,
    description: 'Gerencie turnos, folgas e alocação de equipe.',
    steps: [
      {
        title: 'Criar uma Nova Escala',
        content: 'Clique em um dia vazio no calendário ou no botão "+". Selecione o Cliente (Local), o Colaborador e defina os horários de entrada e saída. Você pode criar escalas recorrentes marcando a opção "Repetir Escala".'
      },
      {
        title: 'Editar ou Remover',
        content: 'Clique sobre um turno existente no calendário para abrir os detalhes. Você pode alterar horários, trocar o colaborador ou excluir o turno.'
      },
      {
        title: 'Criar Postos',
        content: 'Na visualização diária, clique em "Novo Posto" dentro do cartão do cliente para criar uma nova linha de alocação.'
      },
      {
        title: 'Relatório de Check-in',
        content: 'Clique no botão "Relatório de Turno" no topo para ver quem realizou o login obrigatório nos horários de troca de turno (06h e 18h).'
      }
    ]
  },
  {
    id: 'team',
    title: 'Gestão de Equipe',
    icon: Users,
    description: 'Cadastro de colaboradores e controle de documentos.',
    steps: [
      {
        title: 'Adicionar Colaborador',
        content: 'Clique em "Adicionar" no topo direito. Preencha os dados pessoais, endereço e dados contratuais. O CPF será usado como login inicial.'
      },
      {
        title: 'Dados Contratuais',
        content: 'Defina se o regime é CLT, PJ ou Freelance. Para contratos com prazo determinado, o sistema avisará 10 dias antes do vencimento.'
      },
      {
        title: 'Exportar Dados',
        content: 'Utilize os botões de Download/Upload para baixar a lista de funcionários em CSV ou importar novos cadastros em massa.'
      }
    ]
  },
  {
    id: 'inventory',
    title: 'Gestão de Estoque',
    icon: Package,
    description: 'Controle de materiais, entradas e baixas.',
    steps: [
      {
        title: 'Cadastrar Novo Item',
        content: 'Na aba "Estoque Atual", clique em "Novo Item". Insira o código, nome, categoria e quantidade mínima para alertas.'
      },
      {
        title: 'Registrar Entrada (Compras)',
        content: 'Vá na aba "Entrada de Nota". Digite o código do item, a quantidade recebida e o número da Nota Fiscal para referência.'
      },
      {
        title: 'Baixa Automática vs Manual',
        content: 'O sistema dá baixa automática quando o RH marca uma solicitação de material como "Entregue". Para ajustes manuais (perdas/quebras), use a aba "Inventário / Ajuste".'
      },
      {
        title: 'Histórico',
        content: 'A aba "Histórico" mostra todas as movimentações, permitindo rastrear quem retirou ou incluiu itens.'
      }
    ]
  },
  {
    id: 'concierge',
    title: 'Portaria',
    icon: KeyRound,
    description: 'Controle de acesso, visitantes e encomendas.',
    steps: [
      {
        title: 'Diário de Bordo',
        content: 'Registre a entrada de Visitantes, Prestadores de Serviço ou Correspondências. Selecione o tipo, preencha os dados e salve. O registro é imediato.'
      },
      {
        title: 'Lista de Convidados',
        content: 'Crie um link para o morador cadastrar seus próprios convidados. Ou, adicione convidados manualmente a um evento existente.'
      },
      {
        title: 'Reservas de Áreas',
        content: 'Consulte e registre reservas de áreas comuns (Salão de Festas, Churrasqueira) para evitar conflitos de agenda.'
      },
      {
        title: 'Solicitar Material',
        content: 'O porteiro pode solicitar itens de limpeza ou escritório diretamente pela aba "Materiais", enviando o pedido para o RH.'
      }
    ]
  },
  {
    id: 'portal',
    title: 'Portal RH',
    icon: Megaphone,
    description: 'Comunicação interna, holerites e solicitações.',
    steps: [
      {
        title: 'Enviar Holerites',
        content: 'Administradores podem fazer upload de PDFs de holerites. Cada funcionário vê apenas o seu próprio documento.'
      },
      {
        title: 'Comunicados',
        content: 'Publique avisos gerais ou de alta prioridade. Todos os usuários verão na aba de Comunicados.'
      },
      {
        title: 'Solicitações de Funcionários',
        content: 'Funcionários podem pedir alteração de endereço, VT ou dados pessoais. O RH aprova ou reprova essas solicitações na aba "Gestão".'
      },
      {
        title: 'Minha Escala',
        content: 'Funcionários podem visualizar seus próximos plantões e histórico de turnos passados.'
      }
    ]
  },
  {
    id: 'financial',
    title: 'Financeiro',
    icon: DollarSign,
    description: 'Fluxo de caixa, contas a pagar e receber.',
    steps: [
      {
        title: 'Lançamentos',
        content: 'Adicione receitas ou despesas manuais. O sistema também projeta automaticamente os valores de contratos de Clientes (Receita) e Fornecedores/Folha (Despesa).'
      },
      {
        title: 'Fluxo de Caixa',
        content: 'Alterne para a visão "Fluxo de Caixa" para ver um extrato cronológico com saldo acumulado dia a dia.'
      },
      {
        title: 'Baixar Lançamentos',
        content: 'Clique no ícone de "Retorno" (seta circular) para marcar uma conta pendente como Paga/Recebida.'
      }
    ]
  },
  {
    id: 'clients',
    title: 'Clientes',
    icon: Building2,
    description: 'Gestão de contratos e locais de trabalho.',
    steps: [
      {
        title: 'Cadastro de Local',
        content: 'Cadastre condomínios ou empresas. Defina o valor do contrato e o dia de vencimento para integração financeira.'
      },
      {
        title: 'Vincular Equipe',
        content: 'Dentro do cadastro do cliente, na aba "Contrato & Equipe", adicione os funcionários fixos daquele posto.'
      }
    ]
  },
  {
    id: 'suppliers',
    title: 'Fornecedores',
    icon: Truck,
    description: 'Gestão de parceiros e compras.',
    steps: [
      {
        title: 'Contratos Recorrentes',
        content: 'Ao cadastrar um fornecedor, marque "Contrato Recorrente" se houver um pagamento mensal fixo. Isso gerará uma previsão no módulo Financeiro.'
      }
    ]
  },
  {
    id: 'checklist',
    title: 'Vistoria (Checklist)',
    icon: ClipboardCheck,
    description: 'Inspeção de veículos e equipamentos.',
    steps: [
      {
        title: 'Nova Vistoria',
        content: 'Selecione o veículo, informe KM e nível de combustível. Marque o status de cada item (Pneus, Faróis, etc.).'
      },
      {
        title: 'Reportar Problemas',
        content: 'Se um item estiver com defeito, marque como "Defeito" e adicione uma observação. Você pode anexar até 5 fotos.'
      }
    ]
  },
  {
    id: 'patrol',
    title: 'Rondas',
    icon: Route,
    description: 'Registro de atividades de segurança.',
    steps: [
      {
        title: 'Registrar Ronda',
        content: 'Informe se a ronda é a pé ou veicular. Escreva o relatório do que foi verificado e anexe fotos se houver ocorrências.'
      }
    ]
  },
  {
    id: 'social',
    title: 'Social',
    icon: MessageCircleHeart,
    description: 'Rede social corporativa interna.',
    steps: [
      {
        title: 'Postagens',
        content: 'Compartilhe avisos, elogios ou ocorrências com a equipe. É possível anexar fotos.'
      },
      {
        title: 'Interação',
        content: 'Os usuários podem curtir e comentar nas postagens.'
      }
    ]
  },
  {
    id: 'access-control',
    title: 'Controle de Acesso',
    icon: ShieldAlert,
    description: 'Permissões do sistema.',
    steps: [
      {
        title: 'Matriz de Permissões',
        content: 'Apenas a Diretoria/Admin pode acessar. Marque ou desmarque as caixas para definir qual cargo (Porteiro, Vigilante, RH) pode ver qual módulo no menu.'
      }
    ]
  },
  {
    id: 'audit-log',
    title: 'Histórico (Logs)',
    icon: History,
    description: 'Auditoria de ações no sistema.',
    steps: [
      {
        title: 'Rastreabilidade',
        content: 'Visualize quem criou, editou ou excluiu registros no sistema. Use os filtros para buscar por categoria (ex: quem alterou o Estoque).'
      }
    ]
  },
  {
    id: 'settings',
    title: 'Configurações',
    icon: Settings,
    description: 'Personalização do sistema.',
    steps: [
      {
        title: 'Aparência',
        content: 'Alterne entre Modo Claro e Escuro ou ajuste o tamanho da fonte para melhor leitura.'
      }
    ]
  }
];

const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose, initialTopicId }) => {
  const [activeTopicId, setActiveTopicId] = useState<string>('calendar');
  const [searchTerm, setSearchTerm] = useState('');

  // Update active topic when prop changes or modal opens
  useEffect(() => {
    if (isOpen && initialTopicId) {
        setActiveTopicId(initialTopicId);
    }
  }, [isOpen, initialTopicId]);

  const activeTopic = useMemo(() => 
    TUTORIAL_DATA.find(t => t.id === activeTopicId) || TUTORIAL_DATA[0]
  , [activeTopicId]);

  const filteredTopics = useMemo(() => {
    if (!searchTerm) return TUTORIAL_DATA;
    return TUTORIAL_DATA.filter(t => 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.steps.some(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Centro de Ajuda & Tutoriais</h2>
              <p className="text-sm text-slate-500">Aprenda a utilizar todas as funções do AD-HOC</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar / Navigation */}
          <div className="w-1/3 min-w-[280px] bg-slate-50 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar tópico..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredTopics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTopicId === topic.id 
                      ? 'bg-blue-100 text-blue-700 font-medium shadow-sm' 
                      : 'text-slate-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <topic.icon size={18} className={activeTopicId === topic.id ? 'text-blue-600' : 'text-slate-400'} />
                  <div className="flex-1">
                    <p className="text-sm">{topic.title}</p>
                  </div>
                  {activeTopicId === topic.id && <ChevronRight size={16} />}
                </button>
              ))}
              {filteredTopics.length === 0 && (
                <div className="p-4 text-center text-slate-400 text-sm">
                  Nenhum tópico encontrado.
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
            <div className="max-w-3xl mx-auto">
              
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <activeTopic.icon size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{activeTopic.title}</h3>
                  <p className="text-slate-500">{activeTopic.description}</p>
                </div>
              </div>

              <div className="space-y-8">
                {activeTopic.steps.map((step, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-8 last:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                      {step.content}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpCenterModal;
