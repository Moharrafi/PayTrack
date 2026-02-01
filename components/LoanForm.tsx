import React, { useState } from 'react';
import { Employee, Loan } from '../types';

interface LoanFormProps {
  employees: Employee[];
  existingLoans: Loan[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ employees, existingLoans, onSubmit, onCancel }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [term, setTerm] = useState<number>(1);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      employeeId,
      amount,
      termMonths: term,
      reason
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-emerald-600 text-white">
          <h2 className="text-lg font-bold">Ajukan Kasbon Baru</h2>
          <button onClick={onCancel} className="text-white/80 hover:text-white">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto no-scrollbar">
          <form id="loanForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Karyawan</label>
              <select 
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              >
                <option value="">-- Pilih --</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} - {e.position}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
                <input 
                  type="number" 
                  required
                  min="10000"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenor (Bulan)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  max="24"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900"
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Peminjaman</label>
              <textarea 
                required
                rows={2}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: Biaya Rumah Sakit..."
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Batal
          </button>
          <button 
            type="submit" 
            form="loanForm"
            className="flex-1 py-2 px-4 bg-emerald-600 rounded-lg text-white font-medium hover:bg-emerald-700 shadow-sm"
          >
            Simpan Pinjaman
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanForm;