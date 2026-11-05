import React, { useState, useEffect } from 'react';
import api from './services/api';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ModalReserva from './components/ModalReserva';
import ModalConsumo from './components/ModalConsumo';

import Login from './pages/Login';
import QuartosPage from './pages/QuartosPage';
import ReservasPage from './pages/ReservasPage';
import ConsumoPage from './pages/ConsumoPage';
import EquipePage from './pages/EquipePage';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('hospd_token'));
  const [activeTab, setActiveTab] = useState('quartos');
  const [loading, setLoading] = useState(false);
  
  // Modais
  const [showModalReserva, setShowModalReserva] = useState(false);
  const [reservaParaConsumo, setReservaParaConsumo] = useState(null);

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
      if (e.response?.status === 401 || e.response?.status === 403) handleLogout();
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

  // Abrir modal de consumo localizando a reserva ativa do quarto
  const handleAbrirConsumoQuarto = (quarto) => {
    const reservaAtiva = reservas.find(
      r => (r.quarto_id === quarto.id || r.quarto_numero === quarto.numero) && r.status === 'checkin'
    );

    if (reservaAtiva) {
      setReservaParaConsumo(reservaAtiva);
    } else {
      // Se não houver reserva ativa vinculada, cria objeto temporário com os dados do quarto
      setReservaParaConsumo({
        id: quarto.id,
        quarto_numero: quarto.numero,
        hospede_nome: 'Hóspede Atual'
      });
    }
  };

  const handleLancarConsumoSubmit = async (reservaId, dadosConsumo) => {
    try {
      await api.post(`/reserva/${reservaId}/consumo`, dadosConsumo);
      setReservaParaConsumo(null);
      alert('Consumo lançado com sucesso!');
      fetchDados();
    } catch (err) {
      alert('Erro ao lançar consumo.');
    }
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
              onAbrirModalConsumo={handleAbrirConsumoQuarto}
            />
          )}

          {activeTab === 'reservas' && (
            <ReservasPage 
              reservas={reservas} 
              onCheckin={handleCheckin} 
              onCheckout={handleCheckout} 
              onAbrirModalReserva={() => setShowModalReserva(true)}
              onAbrirModalConsumo={(reserva) => setReservaParaConsumo(reserva)}
            />
          )}

          {activeTab === 'consumo' && <ConsumoPage produtos={produtos} />}
          {(activeTab === 'usuarios' || activeTab === 'equipe') && <EquipePage usuarios={usuarios} />}
        </main>
      </div>

      {showModalReserva && (
        <ModalReserva 
          quartos={quartos} 
          onClose={() => setShowModalReserva(false)} 
          onSubmit={handleCriarReserva} 
        />
      )}

      {reservaParaConsumo && (
        <ModalConsumo
          reserva={reservaParaConsumo}
          produtos={produtos}
          onClose={() => setReservaParaConsumo(null)}
          onSubmit={handleLancarConsumoSubmit}
        />
      )}
    </div>
  );
}
