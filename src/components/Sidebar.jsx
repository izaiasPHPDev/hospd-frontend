import React from 'react';
import { Home, Calendar, ShoppingCart, Users } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts }) {
  const menuItems = [
    { id: 'quartos', label: 'Quartos', icon: Home },
    { id: 'reservas', label: `Reservas (${counts.reservas || 0})`, icon: Calendar },
    { id: 'consumo', label: `Frigobar (${counts.produtos || 0})`, icon: ShoppingCart },
    { id: 'usuarios', label: `Equipa (${counts.usuarios || 0})`, icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 space-y-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu Principal</p>
      {menuItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition ${
            activeTab === id ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </button>
      ))}
    </aside>
  );
}
