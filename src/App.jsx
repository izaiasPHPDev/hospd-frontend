import React, { useState, useEffect } from 'react';
import api from './services/api';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ModalReserva from './components/ModalReserva';

import Login from './pages/Login';
import QuartosPage from './pages/QuartosPage';
import ReservasPage from './pages/ReservasPage';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('hospd_token'));
  const [activeTab, setActiveTab] = useState('quartos');
  const [loading, setLoading] = useState(false);
  const [showModalReserva, setShowModalReserva] = useState(false);

  const [quartos, setQuartos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const fetchDados = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [resQ, resR, resP, resU] = await Promise.all([
        api.get('/quarto').catch(() => ({ data: [] })),
        api.get('/reserva').catch(() => ({ data: [] })),
        api.get('/produto').catch(() => ({ data: [] })),
        api.get('/usuario').catch(() => ({ data: [] }))
      ]);
      setQuartos(resQ.data);
      setReservas(resR.data);
      setProdutos(resP.data);
      setUsuarios(resU.data);
    } catch (e) {
      if (e.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDados(); }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('hospd_token');
    setToken(null);
  };

  const handleMudarStatusQuarto = async (id, status) => {
    await api.put(`/quarto/${id}/status`, { status });
    fetchDados();
  };

  const handleCheckin = async (id) => {
    await api.post(`/reserva/${id}/checkin`);
    fetchDados();
  };

  const handleCheckout = async (id) => {
    await api.post(`/reserva/${id}/checkout`);
    fetchDados();
  };

  const handleCriarReserva = async (novaReserva) => {
    await api.post('/reserva', novaReserva);
    setShowModalReserva(false);
    fetchDados();
  };

  if (!token) return <Login onLoginSuccess={(t) => setToken(t)} />;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header onRefresh={fetchDados} onLogout={handleLogout} loading={loading} />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} counts={{ reservas: reservas.length, produtos: produtos.length, usuarios: usuarios.length }} />
        <main className="flex-1 p-8">
          {activeTab === 'quartos' && (
            <QuartosPage 
              quartos={quartos} 
              onMudarStatus={handleMudarStatusQuarto} 
              onAbrirModalReserva={() => setShowModalReserva(true)} 
            />
          )}
          {activeTab === 'reservas' && (
            <ReservasPage 
              reservas={reservas} 
              onCheckin={handleCheckin} 
              onCheckout={handleCheckout} 
              onAbrirModalReserva={() => setShowModalReserva(true)} 
            />
          )}
        </main>
      </div>

      {showModalReserva && (
        <ModalReserva 
          quartos={quartos} 
          onClose={() => setShowModalReserva(false)} 
          onSubmit={handleCriarReserva} 
        />
      )}
    </div>
  );
}
