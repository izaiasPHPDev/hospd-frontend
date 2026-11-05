import React from 'react';
import { Users, UserCheck } from 'lucide-react';

export default function EquipePage({ usuarios }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão da Equipe</h2>
          <p className="text-slate-500 text-sm">Operadores e permissões de acesso ao sistema.</p>
        </div>
      </div>

      {!usuarios || usuarios.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">Nenhum operador encontrado</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {usuarios.map((u) => (
            <div key={u.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900">{u.nome}</h3>
                  <UserCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500">@{u.usuario}</p>
              </div>

              <div className="mt-6 flex justify-between items-center border-t pt-3 text-xs">
                <span className="bg-slate-100 px-2.5 py-1 rounded-md font-semibold text-slate-600 uppercase">
                  {u.funcao || 'recepcao'}
                </span>
                <span className={`font-bold ${u.ativo !== 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {u.ativo !== 0 ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
