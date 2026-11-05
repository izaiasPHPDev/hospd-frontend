import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function ConsumoPage({ produtos }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Frigobar & Produtos</h2>
          <p className="text-slate-500 text-sm">Produtos disponíveis para lançamento em conta.</p>
        </div>
      </div>

      {!produtos || produtos.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">Nenhum produto cadastrado</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {produtos.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-bold text-slate-900">{p.nome}</h4>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase mt-2 inline-block font-semibold">
                  {p.categoria || 'Geral'}
                </span>
              </div>
              <span className="text-lg font-black text-emerald-600">R$ {p.preco}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
