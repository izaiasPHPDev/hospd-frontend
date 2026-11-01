import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, Calendar, ShoppingCart, RefreshCw, 
  Plus, LogOut, AlertTriangle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://sistemahospd-app.t4kpnp.easypanel.host/api';

// Interceptador para anexar o Token JWT em todas as requisições
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hospd_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('hospd_token') || null);
  const [credenciais, setCredenciais] = useState({ usuario: '', senha: '' });
  const [erroLogin, setErroLogin] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [quartos, setQuartos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState(false);

  const [showModalReserva, setShowModalReserva] = useState(false);
  const [novaReserva, setNovaReserva] = useState({
    quarto_id: '',
    hospede_nome: '',
    hospede_documento: '',
    data_checkin: new Date().toISOString().split('T')[0],
    data_checkout: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErroLogin('');
    try {
      const res = await axios.post(`${API_URL}/login`, credenciais);
      localStorage.setItem('hospd_token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setErroLogin('Utilizador ou palavra-passe incorretos.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hospd_token');
    setToken(null);
  };

  const fetchDados = async () => {
    if (!token) return;
    setLoading(true);
    setErrorApi(false);
    try {
      const resQuartos = await axios.get(`${API_URL}/quarto`);
      setQuartos(resQuartos.data);

      try {
        const resReservas = await axios.get(`${API_URL}/reserva`);
        setReservas(resReservas.data);
      } catch (e) { setReservas([]); }

      try {
        const resProdutos = await axios.get(`${API_URL}/produto`);
        setProdutos(resProdutos.data);
      } catch (e) { setProdutos([]); }

    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleLogout();
      } else {
        setErrorApi(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDados();
    }
  }, [token]);

  const handleCriarReserva = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/reserva`, novaReserva);
      setShowModalReserva(false);
      fetchDados();
      alert("Reserva criada com sucesso!");
    } catch (err) {
      alert("Erro ao criar reserva.");
    }
  };

  const handleMudarStatusQuarto = async (quartoId, novoStatus) => {
    try {
      await axios.put(`${API_URL}/quarto/${quartoId}/status`, { status: novoStatus });
      fetchDados();
    } catch (err) {
      alert("Erro ao atualizar status do quarto.");
    }
  };

  // ECRÃ DE LOGIN
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-800">
          <div className="text-center mb-6">
            <span className="bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-xl text-2xl tracking-wider inline-block mb-3">HosPd</span>
            <h2 className="text-xl font-bold text-slate-900">Acesso ao Sistema</h2>
            <p className="text-xs text-slate-400 mt-1">Insira as suas credenciais para entrar</p>
          </div>

          {erroLogin && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl mb-4 text-center font-medium">
              {erroLogin}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Utilizador</label>
              <input 
                type="text" 
                required 
                className="w-full border p-3 rounded-xl text-sm outline-emerald-500 text-slate-900" 
                placeholder="Ex: admin" 
                value={credenciais.usuario} 
                onChange={e => setCredenciais({...credenciais, usuario: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Palavra-passe</label>
              <input 
                type="password" 
                required 
                className="w-full border p-3 rounded-xl text-sm outline-emerald-500 text-slate-900" 
                placeholder="••••••••" 
                value={credenciais.senha} 
                onChange={e => setCredenciais({...credenciais, senha: e.target.value})} 
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-sm">
              Entrar no Sistema
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-6">Credenciais padrão: admin / admin123</p>
        </div>
      </div>
    );
  }

  // PAINEL AUTENTICADO
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 text-white px-6 py-4 shadow-lg flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xl tracking-wider">HosPd</div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">Painel Protegido</span>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={fetchDados} className="flex items-center space-x-2 text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition border border-slate-700 font-medium">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-sm bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg transition font-medium">
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Navegação Principal</p>
            <button onClick={() => setActiveTab('dashboard')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Home className="w-5 h-5" /> <span>Mapa de Quartos</span>
            </button>
            <button onClick={() => setActiveTab('reservas')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition ${activeTab === 'reservas' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Calendar className="w-5 h-5" /> <span>Reservas ({reservas.length})</span>
            </button>
            <button onClick={() => setActiveTab('consumo')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition ${activeTab === 'consumo' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <ShoppingCart className="w-5 h-5" /> <span>Frigobar & Consumo</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {errorApi && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl mb-6 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Não foi possível carregar os dados</h4>
                <p className="text-xs text-rose-600 mt-1">Verifique se o backend está online e se o token é válido.</p>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Mapa de Quartos</h2>
                  <p className="text-slate-500 text-sm">Gerencie o status e ocupação.</p>
                </div>
                <button onClick={() => setShowModalReserva(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-sm">
                  <Plus className="w-5 h-5" /> <span>Nova Reserva</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quartos.map(q => (
                  <div key={q.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Acomodação</span>
                          <h3 className="text-2xl font-black text-slate-900">Quarto {q.numero}</h3>
                          <p className="text-sm font-medium text-slate-500">{q.tipo}</p>
                        </div>
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 uppercase">
                          {q.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 my-4 border-t pt-3">
                        <div className="flex justify-between">
                          <span>Capacidade:</span>
                          <strong className="text-slate-800">{q.capacidade} pessoas</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Diária:</span>
                          <strong className="text-emerald-600 font-bold">R$ {q.preco_diaria}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Status:</span>
                      <div className="flex space-x-1">
                        {q.status !== 'disponivel' && (
                          <button onClick={() => handleMudarStatusQuarto(q.id, 'disponivel')} className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Livre</button>
                        )}
                        {q.status !== 'ocupado' && (
                          <button onClick={() => handleMudarStatusQuarto(q.id, 'ocupado')} className="px-2.5 py-1 text-xs font-medium rounded bg-rose-100 text-rose-800 hover:bg-rose-200">Ocupar</button>
                        )}
                        {q.status !== 'limpeza' && (
                          <button onClick={() => handleMudarStatusQuarto(q.id, 'limpeza')} className="px-2.5 py-1 text-xs font-medium rounded bg-amber-100 text-amber-800 hover:bg-amber-200">Limpeza</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reservas' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Gerenciamento de Reservas</h2>
                  <p className="text-slate-500 text-sm">Histórico e reservas ativas na hospedagem.</p>
                </div>
                <button onClick={() => setShowModalReserva(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-sm">
                  <Plus className="w-5 h-5" /> <span>Nova Reserva</span>
                </button>
              </div>

              {reservas.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-700">Nenhuma reserva encontrada</h3>
                  <button onClick={() => setShowModalReserva(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold mt-4">Criar Reserva Agora</button>
                </div>
              ) : (
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
                        <tr key={res.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-900">{res.hospede_nome}</td>
                          <td className="p-4">Quarto {res.quarto_numero} ({res.quarto_tipo})</td>
                          <td className="p-4">{new Date(res.data_checkin).toLocaleDateString('pt-BR')}</td>
                          <td className="p-4">{new Date(res.data_checkout).toLocaleDateString('pt-BR')}</td>
                          <td className="p-4 font-bold text-emerald-600">R$ {res.valor_diarias}</td>
                          <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">{res.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'consumo' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Frigobar & Produtos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {produtos.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                    <div>
                      <h4 className="font-bold text-slate-900">{p.nome}</h4>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase mt-2 inline-block font-semibold">{p.categoria}</span>
                    </div>
                    <span className="text-lg font-black text-emerald-600">R$ {p.preco}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {showModalReserva && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Cadastrar Nova Reserva</h3>
            <form onSubmit={handleCriarReserva} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nome do Hóspede</label>
                <input required type="text" className="w-full border p-2.5 rounded-xl text-sm text-slate-900" placeholder="Ex: João da Silva" value={novaReserva.hospede_nome} onChange={e => setNovaReserva({...novaReserva, hospede_nome: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">CPF / Documento</label>
                <input required type="text" className="w-full border p-2.5 rounded-xl text-sm text-slate-900" placeholder="000.000.000-00" value={novaReserva.hospede_documento} onChange={e => setNovaReserva({...novaReserva, hospede_documento: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Quarto</label>
                <select required className="w-full border p-2.5 rounded-xl text-sm text-slate-900" value={novaReserva.quarto_id} onChange={e => setNovaReserva({...novaReserva, quarto_id: e.target.value})}>
                  <option value="">Selecione um quarto...</option>
                  {quartos.map(q => <option key={q.id} value={q.id}>Quarto {q.numero} - {q.tipo} (R$ {q.preco_diaria})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Check-in</label>
                  <input type="date" className="w-full border p-2.5 rounded-xl text-sm text-slate-900" value={novaReserva.data_checkin} onChange={e => setNovaReserva({...novaReserva, data_checkin: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Check-out</label>
                  <input type="date" className="w-full border p-2.5 rounded-xl text-sm text-slate-900" value={novaReserva.data_checkout} onChange={e => setNovaReserva({...novaReserva, data_checkout: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModalReserva(false)} className="px-4 py-2 text-sm text-slate-600 font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-xl font-semibold">Salvar Reserva</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
