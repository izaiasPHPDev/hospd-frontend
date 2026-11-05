import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [credenciais, setCredenciais] = useState({ usuario: '', senha: '' });
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const res = await api.post('/login', credenciais);
      localStorage.setItem('hospd_token', res.data.token);
      onLoginSuccess(res.data.token);
    } catch (err) {
      setErro('Utilizador ou palavra-passe incorretos.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <span className="bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-xl text-2xl tracking-wider inline-block mb-3">HosPd</span>
          <h2 className="text-xl font-bold text-slate-900">Acesso ao Sistema</h2>
        </div>
        {erro && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl mb-4 text-center">{erro}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" required className="w-full border p-3 rounded-xl text-sm" placeholder="Utilizador" value={credenciais.usuario} onChange={e => setCredenciais({...credenciais, usuario: e.target.value})} />
          <input type="password" required className="w-full border p-3 rounded-xl text-sm" placeholder="Palavra-passe" value={credenciais.senha} onChange={e => setCredenciais({...credenciais, senha: e.target.value})} />
          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition">Entrar</button>
        </form>
      </div>
    </div>
  );
}
