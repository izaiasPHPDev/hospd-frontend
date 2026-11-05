import React from 'react';
import { RefreshCw, LogOut } from 'lucide-react';

export default function Header({ onRefresh, onLogout, loading }) {
  return (
    <header className="bg-slate-900 text-white px-6 py-4 shadow-lg flex justify-between items-center border-b border-slate-800">
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xl tracking-wider">HosPd</div>
        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">Painel Operacional</span>
      </div>
      <div className="flex items-center space-x-3">
        <button onClick={onRefresh} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <button onClick={onLogout} className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg text-sm flex items-center space-x-2 font-medium transition">
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}
