import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, Calendar, ShoppingCart, CreditCard, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quartos, setQuartos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDados = async () => {
    setLoading(true);
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
      console.error("Erro ao carregar dados da API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const getStatusBadge = (status) => {
    const map = {
      disponivel: 'bg-green-100 text-green-800 border-green-300',
      ocupado: 'bg-red-100 text-red-800 border-red-300',
      limpeza: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      manutencao: 'bg-gray-100 text-gray-800 border-gray-300',
      reservado: 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Topbar */}
      <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-black tracking-wider text-emerald-400">HosPd</span>
          <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700">v1.0 Pro</span>
        </div>
        <button 
          onClick={fetchDados} 
          className="flex items-center space-x-1 text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition border border-slate-700"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Atualizar</span>
        </button>
      </header>

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Home className="w-5 h-5" />
            <span>Quartos & Painel</span>
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg font-medium transition ${activeTab === 'reservas' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Calendar className="w-5 h-5" />
            <span>Reservas</span>
          </button>
          <button
            onClick={() => setActiveTab('consumo')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg font-medium transition ${activeTab === 'consumo' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Consumo / Frigobar</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500">
              Carregando dados da Pousada...
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Mapa de Quartos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quartos.map((quarto) => (
                      <div key={quarto.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800">Quarto {quarto.numero}</h3>
                            <p className="text-sm text-slate-500">{quarto.tipo}</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getStatusBadge(quarto.status)}`}>
                            {quarto.status}
                          </span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-slate-700">
                          <span className="text-sm">Capacidade: <strong>{quarto.capacidade} pessoas</strong></span>
                          <span className="text-lg font-bold text-emerald-600">R$ {quarto.preco_diaria}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reservas' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Reservas Cadastradas</h2>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                          <th className="p-4">Hóspede</th>
                          <th className="p-4">Quarto</th>
                          <th className="p-4">Check-in</th>
                          <th className="p-4">Check-out</th>
                          <th className="p-4">Valor Total</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {reservas.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-50">
                            <td className="p-4 font-medium text-slate-900">{res.hospede_nome}</td>
                            <td className="p-4">Quarto {res.quarto_numero} ({res.quarto_tipo})</td>
                            <td className="p-4">{new Date(res.data_checkin).toLocaleDateString('pt-BR')}</td>
                            <td className="p-4">{new Date(res.data_checkout).toLocaleDateString('pt-BR')}</td>
                            <td className="p-4 font-bold text-slate-900">R$ {res.valor_diarias}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
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

              {activeTab === 'consumo' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Tabela de Produtos & Frigobar</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {produtos.map((prod) => (
                      <div key={prod.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-800">{prod.nome}</p>
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase">{prod.categoria}</span>
                        </div>
                        <span className="font-bold text-emerald-600">R$ {prod.preco}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
