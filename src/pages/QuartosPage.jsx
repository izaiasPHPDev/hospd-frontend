import React from 'react';
import { Plus, BedDouble } from 'lucide-react';

export default function QuartosPage({ quartos, onMudarStatus, onAbrirModalReserva }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mapa de Quartos</h2>
          <p className="text-slate-500 text-sm">Gerencie o estado de ocupação e higienização.</p>
        </div>
        <button onClick={onAbrirModalReserva} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl transition flex items-center space-x-2">
          <Plus className="w-5 h-5" /> <span>Nova Reserva</span>
        </button>
      </div>

      {quartos.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">Nenhum quarto encontrado</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quartos.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-400">Acomodação</span>
                    <h3 className="text-2xl font-black text-slate-900">Quarto {q.numero}</h3>
                    <p className="text-sm font-medium text-slate-500">{q.tipo}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    q.status === 'disponivel' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {q.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 my-4 border-t pt-3">
                  <div className="flex justify-between"><span>Capacidade:</span><strong>{q.capacidade} pessoas</strong></div>
                  <div className="flex justify-between"><span>Diária:</span><strong className="text-emerald-600">R$ {q.preco_diaria}</strong></div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4 border-t flex items-center justify-between">
                <span className="text-xs text-slate-400">Alterar estado:</span>
                <div className="flex space-x-1">
                  <button onClick={() => onMudarStatus(q.id, 'disponivel')} className="px-2.5 py-1 text-xs rounded bg-emerald-100 text-emerald-800 font-medium">Livre</button>
                  <button onClick={() => onMudarStatus(q.id, 'ocupado')} className="px-2.5 py-1 text-xs rounded bg-rose-100 text-rose-800 font-medium">Ocupar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
