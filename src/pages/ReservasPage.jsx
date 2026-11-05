import React from 'react';
import { Plus, CheckCircle, ArrowRightCircle } from 'lucide-react';

export default function ReservasPage({ reservas, onCheckin, onCheckout, onAbrirModalReserva }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gerenciamento de Reservas</h2>
          <p className="text-slate-500 text-sm">Histórico e ações de check-in / check-out.</p>
        </div>
        <button onClick={onAbrirModalReserva} className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 font-medium">
          <Plus className="w-4 h-4" /> <span>Nova Reserva</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b">
            <tr><th className="p-4">Hóspede</th><th className="p-4">Quarto</th><th className="p-4">Datas</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Ações</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {reservas.map(r => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">{r.hospede_nome}</td>
                <td className="p-4">Quarto {r.quarto_numero} ({r.quarto_tipo})</td>
                <td className="p-4">{new Date(r.data_checkin).toLocaleDateString('pt-BR')} até {new Date(r.data_checkout).toLocaleDateString('pt-BR')}</td>
                <td className="p-4 font-bold text-emerald-600">R$ {r.valor_diarias}</td>
                <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">{r.status}</span></td>
                <td className="p-4">
                  {r.status === 'confirmada' && (
                    <button onClick={() => onCheckin(r.id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" /> <span>Check-in</span>
                    </button>
                  )}
                  {r.status === 'checkin' && (
                    <button onClick={() => onCheckout(r.id)} className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1">
                      <ArrowRightCircle className="w-3.5 h-3.5" /> <span>Check-out</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
