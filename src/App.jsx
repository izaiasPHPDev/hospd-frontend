import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, Calendar, ShoppingCart, Users, RefreshCw, 
  Plus, LogOut, CheckCircle, ArrowRightCircle, UserPlus
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://sistemahospd-app.t4kpnp.easypanel.host/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('hospd_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('hospd_token') || null);
  const [credenciais, setCredenciais] = useState({ usuario: '', senha: '' });
  const [activeTab, setActiveTab] = useState('dashboard');

  const [quartos, setQuartos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modais
  const [showModalReserva, setShowModalReserva] = useState(false);
  const [showModalUsuario, setShowModalUsuario] = useState(false);

  const [novaReserva, setNovaReserva] = useState({
    quarto_id: '', hospede_nome: '', hospede_documento: '',
    data_checkin: new Date().toISOString().split('T')[0],
    data_checkout: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  const [novoUsuario, setNovoUsuario] = useState({ nome: '', usuario: '', senha: '', funcao: 'recepcao' });

  const fetchDados = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [resQ, resR, resP, resU] = await Promise.all([
        axios.get(`${API_URL}/quarto`),
        axios.get(`${API_URL}/reserva`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/produto`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/usuario`).catch(() => ({ data: [] }))
      ]);
      setQuartos(resQ.data);
      setReservas(resR.data);
      setProdutos(resP.data);
      setUsuarios(resU.data);
    } catch (e) {
      if (e.response && (e.response.status === 401 || e.response.status === 403)) handleLogout();
    } finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchDados(); }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, credenciais);
      localStorage.setItem('hospd_token', res.data.token);
      setToken(res.data.token);
    } catch (err) { alert("Credenciais inválidas."); }
  };

  const handleLogout = () => {
    localStorage.removeItem('hospd_token');
    setToken(null);
  };

  const handleCheckin = async (reservaId) => {
    try {
      await axios.post(`${API_URL}/reserva/${reservaId}/checkin`);
      fetchDados();
    } catch (err) { alert("Erro ao realizar check-in."); }
  };

  const handleCheckout = async (reservaId) => {
    try {
      await axios.post(`${API_URL}/reserva/${reservaId}/checkout`);
      fetchDados();
    } catch (err) { alert("Erro ao realizar check-out."); }
  };

  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/usuario`, novoUsuario);
      setShowModalUsuario(false);
      setNovoUsuario({ nome: '', usuario: '', senha: '', funcao: 'recepcao' });
      fetchDados();
      alert("Usuário criado com sucesso!");
    } catch (err) { alert("Erro ao criar usuário."); }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <span className="bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-xl text-2xl">HosPd</span>
            <h2 className="text-xl font-bold text-slate-900 mt-4">Acesso Restrito</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" required className="w-full border p-3 rounded-xl text-sm" placeholder="Usuário" value={credenciais.usuario} onChange={e => setCredenciais({...credenciais, usuario: e.target.value})} />
            <input type="password" required className="w-full border p-3 rounded-xl text-sm" placeholder="Senha" value={credenciais.senha} onChange={e => setCredenciais({...credenciais, senha: e.target.value})} />
            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 text-white px-6 py-4 shadow-lg flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xl">HosPd</div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">Painel Operacional</span>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={fetchDados} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={handleLogout} className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg text-sm flex items-center space-x-2"><LogOut className="w-4 h-4" /><span>Sair</span></button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-slate-200 p-6 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}><Home className="w-5 h-5" /> <span>Quartos</span></button>
          <button onClick={() => setActiveTab('reservas')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium ${activeTab === 'reservas' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}><Calendar className="w-5 h-5" /> <span>Reservas</span></button>
          <button onClick={() => setActiveTab('usuarios')} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium ${activeTab === 'usuarios' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}><Users className="w-5 h-5" /> <span>Equipe ({usuarios.length})</span></button>
        </aside>

        <main className="flex-1 p-8">
          {activeTab === 'reservas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Reservas & Estadias</h2>
                <button onClick={() => setShowModalReserva(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2"><Plus className="w-4 h-4" /> <span>Nova Reserva</span></button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr><th className="p-4">Hóspede</th><th className="p-4">Quarto</th><th className="p-4">Datas</th><th className="p-4">Status</th><th className="p-4">Ações</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {reservas.map(r => (
                      <tr key={r.id}>
                        <td className="p-4 font-bold">{r.hospede_nome}</td>
                        <td className="p-4">Quarto {r.quarto_numero}</td>
                        <td className="p-4">{new Date(r.data_checkin).toLocaleDateString('pt-BR')} até {new Date(r.data_checkout).toLocaleDateString('pt-BR')}</td>
                        <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">{r.status}</span></td>
                        <td className="p-4 flex space-x-2">
                          {r.status === 'confirmada' && (
                            <button onClick={() => handleCheckin(r.id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"><CheckCircle className="w-3.5 h-3.5" /> <span>Check-in</span></button>
                          )}
                          {r.status === 'checkin' && (
                            <button onClick={() => handleCheckout(r.id)} className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"><ArrowRightCircle className="w-3.5 h-3.5" /> <span>Check-out</span></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'usuarios' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Gestão da Equipe</h2>
                <button onClick={() => setShowModalUsuario(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2"><UserPlus className="w-4 h-4" /> <span>Novo Operador</span></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {usuarios.map(u => (
                  <div key={u.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900">{u.nome}</h3>
                    <p className="text-sm text-slate-500">@{u.usuario}</p>
                    <div className="mt-4 flex justify-between items-center border-t pt-3">
                      <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-md font-semibold text-slate-600 uppercase">{u.funcao}</span>
                      <span className={`text-xs font-bold ${u.ativo ? 'text-emerald-600' : 'text-rose-600'}`}>{u.ativo ? 'Ativo' : 'Inativo'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL NOVO USUÁRIO */}
      {showModalUsuario && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Cadastrar Novo Usuário</h3>
            <form onSubmit={handleCriarUsuario} className="space-y-4">
              <input required type="text" className="w-full border p-2.5 rounded-xl text-sm" placeholder="Nome Completo" value={novoUsuario.nome} onChange={e => setNovoUsuario({...novoUsuario, nome: e.target.value})} />
              <input required type="text" className="w-full border p-2.5 rounded-xl text-sm" placeholder="Nome de Usuário (login)" value={novoUsuario.usuario} onChange={e => setNovoUsuario({...novoUsuario, usuario: e.target.value})} />
              <input required type="password" className="w-full border p-2.5 rounded-xl text-sm" placeholder="Senha" value={novoUsuario.senha} onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})} />
              <select className="w-full border p-2.5 rounded-xl text-sm" value={novoUsuario.funcao} onChange={e => setNovoUsuario({...novoUsuario, funcao: e.target.value})}>
                <option value="recepcao">Recepção</option>
                <option value="gerente">Gerente</option>
                <option value="admin">Administrador</option>
              </select>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModalUsuario(false)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-xl font-semibold">Salvar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
