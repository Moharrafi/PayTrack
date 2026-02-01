import React from 'react';
import { Loan, Transaction } from '../types';
import { formatRupiah, formatDate, StatusBadge } from './Formatters';
import { History, X } from 'lucide-react';

interface HistoryModalProps {
  loan: Loan;
  employeeName: string;
  transactions: Transaction[];
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ loan, employeeName, transactions, onClose }) => {
  const totalPaid = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
               <History size={20} className="text-emerald-600" /> Riwayat Cicilan
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{employeeName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm border border-gray-200">
            <X size={18} />
          </button>
        </div>

        {/* Summary Card */}
        <div className="p-4 bg-white border-b border-gray-100">
           <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100">
             <div>
                <p className="text-xs text-emerald-700 font-medium">Total Dibayar</p>
                <p className="text-lg font-bold text-emerald-800">{formatRupiah(totalPaid)}</p>
             </div>
             <div className="text-right">
                <p className="text-xs text-gray-500">Sisa Hutang</p>
                <p className="text-sm font-semibold text-gray-700">{formatRupiah(loan.remainingAmount)}</p>
             </div>
           </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
           {transactions.length === 0 ? (
             <div className="text-center py-8 text-gray-400 text-sm">
               <p>Belum ada riwayat pembayaran.</p>
             </div>
           ) : (
             transactions.map((t, index) => (
               <div key={t.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                     #{transactions.length - index}
                   </div>
                   <div>
                     <p className="font-semibold text-gray-800 text-sm">{formatRupiah(t.amount)}</p>
                     <p className="text-xs text-gray-500">{formatDate(t.date)}</p>
                   </div>
                 </div>
                 <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                   Sukses
                 </span>
               </div>
             ))
           )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;