import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, Calendar, ShoppingCart, CreditCard, RefreshCw, 
  Plus, LogIn, LogOut, Coffee, CheckCircle, AlertTriangle, 
  Wrench, Printer, User, DollarSign, Search
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quartos, setQuartos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorApi, setErrorApi] = useState(false);

  // Modais
  const [modalReserva, setModalReserva] = useState(false);
  const [modalConsumo, setModalConsumo] = useState(false);
  const [modalCheckout, setModalCheckout] = useState(false);
  const [quartoSelecionado, setQuartoSelecionado] = useState(null);

  // Forms
  const [novaReserva, setNovaReserva] = useState({
    quarto_id: '',
    hospede_nome: '',
    hospede_documento: '',
    data_checkin: new Date().toISOString().split('T')[0],
    data_checkout: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  const [novoConsumo, setNovoConsumo] = useState({
    reserva_id: '',
    produto_id: '',
    quantidade: 1
  });

  const fetchDados = async () => {
    setLoading(true);
    setErrorApi(false);
    try {
      const [resQuartos, resReservas, resProdutos] = await Promise.all([
        axios.get(`${API_URL}/quarto`),
        axios.get(`${API_URL}/reserva`),
        axios.get(`${API_URL}/produto`)
      ]);
      setQuartos(resQuartos.data);
      setReservas(resReservas.data);
      setProdutos(resProdutos.data);
    } catch (error) {
      console.error("Erro ao carregar API:", error);
      setErrorApi(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleMudarStatusQuarto = async (quartoId, novoStatus) => {
    try {
      await axios.put(`${API_URL}/quarto/${quartoId}/status`, { status: novoStatus });
      fetchDados();
    } catch (err) {
      alert("Erro ao atualizar status do quarto");
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      disponivel: { bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', icon: CheckCircle, label: 'Disponível' },
      ocupado: { bg: 'bg-rose-500/10 text-rose-600 border-rose-200', icon: LogIn, label: 'Ocupado' },
      limpeza: { bg: 'bg-amber-500/10 text-amber-600 border-amber-200', icon: Coffee, label: 'Limpeza' },
      manutencao: { bg: 'bg-slate-500/10 text-slate-600 border-slate-200', icon: Wrench, label: 'Manutenção' },
      reservado: { bg: 'bg-sky-500/10 text-sky-600 border-sky-200', icon: Calendar, label: 'Reservado' }
    };
    return map[status] || { bg: 'bg-slate-100 text-slate-600', icon: CheckCircle, label: status };
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Topbar */}
      <header className="bg-slate-900 text-white px-6 py-4 shadow-lg flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-lg tracking-wider text-xl">
            HosPd
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
            Painel Executivo
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {errorApi && (
            <span className="flex items-center text-xs text-rose-400 bg-rose-950/50 px-3 py-1.5 rounded border border-rose-800">
              <AlertTriangle className="w-4 h-4 mr-1.5" /> Erro de Conexão com API
            </span>
          )}
          <button 
            onClick={fetchDados} 
            className="flex items-center space-x-2 text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition border border-slate-700 font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar Dados</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Navegação Principal</p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Home className="w-5 h-5" />
              <span>Mapa de Quartos</span>
            </button>
            <button
              onClick={() => setActiveTab('reservas')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition ${activeTab === 'reservas' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Calendar className="w-5 h-5" />
              <span>Reservas</span>
            </button>
            <button
              onClick={() => setActiveTab('consumo')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition ${activeTab === 'consumo' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Frigobar & Consumo</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs space-y-2">
            <p className="font-semibold text-white">Resumo Operacional</p>
            <div className="flex justify-between"><span>Disponíveis:</span> <strong className="text-emerald-400">{quartos.filter(q => q.status === 'disponivel').length}</strong></div>
            <div className="flex justify-between"><span>Ocupados:</span> <strong className="text-rose-400">{quartos.filter(q => q.status === 'ocupado').length}</strong></div>
            <div className="flex justify-between"><span>Em Limpeza:</span> <strong className="text-amber-400">{quartos.filter(q => q.status === 'limpeza').length}</strong></div>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-8">
          {errorApi && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl mb-6 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Não foi possível carregar os dados da pousada</h4>
                <p className="text-xs text-rose-600 mt-1">Verifique se o backend Node.js está rodando e se a variável `VITE_API_URL` aponta para a URL correta no Easypanel.</p>
              </div>
            </div>
          )}

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Mapa de Quartos</h2>
                  <p className="text-slate-500 text-sm">Gerencie o status, check-in e consumo das acomodações.</p>
                </div>
                <button 
                  onClick={() => setModalReserva(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nova Reserva</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quartos.map((quarto) => {
                  const statusInfo = getStatusBadge(quarto.status);
                  const Icon = statusInfo.icon;

                  return (
                    <div key={quarto.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Acomodação</span>
                            <h3 className="text-2xl font-black text-slate-900">Quarto {quarto.numero}</h3>
                            <p className="text-sm font-medium text-slate-500">{quarto.tipo}</p>
                          </div>
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
                            <Icon className="w-3.5 h-3.5" />
                            <span>{statusInfo.label}</span>
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 my-4">
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Capacidade:</span>
                            <strong className="text-slate-800">{quarto.capacidade} pessoas</strong>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Valor Diária:</span>
                            <strong className="text-emerald-600 text-base font-bold">R$ {quarto.preco_diaria}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action Footer */}
                      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">Alterar Status:</span>
                        <div className="flex space-x-1">
                          {quarto.status !== 'disponivel' && (
                            <button 
                              onClick={() => handleMudarStatusQuarto(quarto.id, 'disponivel')} 
                              className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            >
                              Livre
                            </button>
                          )}
                          {quarto.status !== 'ocupado' && (
                            <button 
                              onClick={() => handleMudarStatusQuarto(quarto.id, 'ocupado')} 
                              className="px-2.5 py-1 text-xs font-medium rounded bg-rose-100 text-rose-800 hover:bg-rose-200"
                            >
                              Ocupar
                            </button>
                          )}
                          {quarto.status !== 'limpeza' && (
                            <button 
                              onClick={() => handleMudarStatusQuarto(quarto.id, 'limpeza')} 
                              className="px-2.5 py-1 text-xs font-medium rounded bg-amber-100 text-amber-800 hover:bg-amber-200"
                            >
                              Limpeza
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RESERVAS TAB */}
          {activeTab === 'reservas' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Gerenciamento de Reservas</h2>
                  <p className="text-slate-500 text-sm">Histórico e reservas ativas na hospedagem.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                      <th className="p-4">Hóspede</th>
                      <th className="p-4">Quarto</th>
                      <th className="p-4">Check-in</th>
                      <th className="p-4">Check-out</th>
                      <th className="p-4">Total Diárias</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {reservas.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-bold text-slate-900">{res.hospede_nome}</td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-800">Quarto {res.quarto_numero}</span>
                          <span className="text-xs text-slate-400 block">{res.quarto_tipo}</span>
                        </td>
                        <td className="p-4">{new Date(res.data_checkin).toLocaleDateString('pt-BR')}</td>
                        <td className="p-4">{new Date(res.data_checkout).toLocaleDateString('pt-BR')}</td>
                        <td className="p-4 font-bold text-emerald-600">R$ {res.valor_diarias}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONSUMO TAB */}
          {activeTab === 'consumo' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Tabela de Produtos & Frigobar</h2>
                  <p className="text-slate-500 text-sm">Itens disponíveis para consumo e serviços adicionais.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {produtos.map((prod) => (
                  <div key={prod.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900">{prod.nome}</h4>
                      <span className="text-xs bg-slate-100 font-semibold px-2.5 py-1 rounded text-slate-500 uppercase mt-2 inline-block">
                        {prod.categoria}
                      </span>
                    </div>
                    <span className="text-xl font-black text-emerald-600">R$ {prod.preco}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
