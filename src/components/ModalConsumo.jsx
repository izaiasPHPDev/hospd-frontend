import React, { useState } from 'react';

export default function ModalConsumo({ reserva, produtos, onClose, onSubmit }) {
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!produtoId) return alert('Selecione um produto.');
    onSubmit(reserva.id, { produto_id: produtoId, quantidade: Number(quantidade) });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 mb-1">Lançar Consumo</h3>
        <p className="text-xs text-slate-500 mb-4">
          Quarto {reserva.quarto_numero} - Hóspede: <strong>{reserva.hospede_nome}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Produto / Item do Frigobar</label>
            <select
              required
              className="w-full border p-2.5 rounded-xl text-sm text-slate-900"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
            >
              <option value="">Selecione o produto...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} - R$ {p.preco}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Quantidade</label>
            <input
              type="number"
              min="1"
              required
              className="w-full border p-2.5 rounded-xl text-sm text-slate-900"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 font-medium">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-xl font-semibold">
              Confirmar Lançamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
