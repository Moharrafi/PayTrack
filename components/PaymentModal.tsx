import React, { useState } from 'react';
import { Loan } from '../types';
import { formatRupiah } from './Formatters';
import { Banknote, Calendar } from 'lucide-react';

interface PaymentModalProps {
  loan: Loan;
  onConfirm: (amount: number, date: string) => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ loan, onConfirm, onCancel }) => {
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0 && amount <= loan.remainingAmount) {
      onConfirm(amount, date);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-emerald-600 text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
             <Banknote size={20} /> Bayar Cicilan
          </h2>
          <button onClick={onCancel} className="text-white/80 hover:text-white">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
             <p className="text-xs text-gray-500">Sisa Tagihan</p>
             <p className="text-lg font-bold text-red-600">{formatRupiah(loan.remainingAmount)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pembayaran</label>
            <div className="relative">
              <input
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg p-2 pl-9 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-800 bg-white"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Calendar className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pembayaran</label>
            <input
              type="number"
              required
              min="1"
              max={loan.remainingAmount}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-gray-800 bg-white"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Masukan nominal..."
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">Maksimal: {formatRupiah(loan.remainingAmount)}</p>
          </div>

          <div className="flex gap-3 pt-2">
             <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={amount <= 0 || amount > loan.remainingAmount}
                className="flex-1 py-2 px-4 bg-emerald-600 rounded-lg text-white font-medium hover:bg-emerald-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bayar
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;