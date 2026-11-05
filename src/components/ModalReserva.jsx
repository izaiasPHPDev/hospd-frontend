import React, { useState } from 'react';

export default function ModalReserva({ quartos, onClose, onSubmit }) {
  const [novaReserva, setNovaReserva] = useState({
    quarto_id: '',
    hospede_nome: '',
    hospede_documento: '',
    data_checkin: new Date().toISOString().split('T')[0],
    data_checkout: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(novaReserva);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Cadastrar Nova Reserva</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" className="w-full border p-2.5 rounded-xl text-sm" placeholder="Nome do Hóspede" value={novaReserva.hospede_nome} onChange={e => setNovaReserva({...novaReserva, hospede_nome: e.target.value})} />
          <input required type="text" className="w-full border p-2.5 rounded-xl text-sm" placeholder="CPF / Documento" value={novaReserva.hospede_documento} onChange={e => setNovaReserva({...novaReserva, hospede_documento: e.target.value})} />
          <select required className="w-full border p-2.5 rounded-xl text-sm" value={novaReserva.quarto_id} onChange={e => setNovaReserva({...novaReserva, quarto_id: e.target.value})}>
            <option value="">Selecione o quarto...</option>
            {quartos.map(q => <option key={q.id} value={q.id}>Quarto {q.numero} - {q.tipo} (R$ {q.preco_diaria})</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input type="date" className="w-full border p-2.5 rounded-xl text-sm" value={novaReserva.data_checkin} onChange={e => setNovaReserva({...novaReserva, data_checkin: e.target.value})} />
            <input type="date" className="w-full border p-2.5 rounded-xl text-sm" value={novaReserva.data_checkout} onChange={e => setNovaReserva({...novaReserva, data_checkout: e.target.value})} />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 font-medium">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-xl font-semibold">Salvar Reserva</button>
          </div>
        </form>
      </div>
    </div>
  );
}
