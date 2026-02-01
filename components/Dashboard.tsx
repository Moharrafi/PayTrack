import React from 'react';
import { Loan, Employee, LoanStatus } from '../types';
import { formatRupiah, formatDate, StatusBadge } from './Formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Activity, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  loans: Loan[];
  employees: Employee[];
}

const Dashboard: React.FC<DashboardProps> = ({ loans, employees }) => {
  const activeLoans = loans.filter(l => l.status === LoanStatus.ACTIVE);
  
  // Financial Calculations
  const totalLent = loans.reduce((sum, l) => sum + l.amount, 0); // Total plafond yang pernah dikeluarkan
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.remainingAmount, 0); // Uang yang masih di luar
  const totalRepaid = totalLent - totalOutstanding; // Asumsi sederhana: Total - Sisa (Realitanya harus dari transaksi, tapi ini cukup untuk overview)
  const repaymentPercentage = totalLent > 0 ? (totalRepaid / totalLent) * 100 : 0;

  // Chart Data
  const dataStatus = [
    { name: 'Lunas', value: loans.filter(l => l.status === LoanStatus.PAID).length, color: '#10B981' }, // Emerald-500
    { name: 'Aktif', value: activeLoans.length, color: '#3B82F6' }, // Blue-500
    { name: 'Ditolak', value: loans.filter(l => l.status === LoanStatus.REJECTED).length, color: '#EF4444' }, // Red-500
    { name: 'Pending', value: loans.filter(l => l.status === LoanStatus.PENDING).length, color: '#F59E0B' }, // Amber-500
  ].filter(d => d.value > 0);

  const recentLoans = [...loans]
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
    .slice(0, 5);

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">{today}</p>
          <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Berikut ringkasan performa keuangan kasbon.</p>
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
           <Activity className="text-gray-600" size={20} />
        </div>
      </div>

      {/* Hero Portfolio Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-90">
            <Wallet size={18} />
            <span className="text-sm font-medium tracking-wide">PORTFOLIO KASBON</span>
          </div>

          <div className="mb-6">
            <p className="text-sm opacity-80 mb-1">Total Dana Dipinjamkan</p>
            <p className="text-3xl font-bold tracking-tight">{formatRupiah(totalLent)}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium opacity-90">
              <span>Pengembalian ({Math.round(repaymentPercentage)}%)</span>
              <span>{formatRupiah(totalRepaid)}</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className="bg-emerald-300 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${repaymentPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Sub Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
            <div>
               <p className="text-xs opacity-70 mb-1">Sisa Piutang (Outstanding)</p>
               <p className="text-lg font-bold text-emerald-100">{formatRupiah(totalOutstanding)}</p>
            </div>
            <div>
               <p className="text-xs opacity-70 mb-1">Total Transaksi</p>
               <p className="text-lg font-bold text-emerald-100">{loans.length} Pinjaman</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
            <Users size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
            <p className="text-xs text-gray-500 font-medium">Total Karyawan</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{activeLoans.length}</p>
            <p className="text-xs text-gray-500 font-medium">Pinjaman Aktif</p>
          </div>
        </div>
      </div>

      {/* Chart & Analysis Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-gray-400" /> Distribusi Status
          </h3>
        </div>
        
        <div className="flex flex-col items-center">
          <div style={{ width: '100%', height: 220, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {dataStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
               <p className="text-3xl font-bold text-gray-800">{loans.length}</p>
               <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total</p>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2 w-full">
            {dataStatus.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-xs text-gray-600 font-medium">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
           <h3 className="font-bold text-gray-800 text-lg">Pinjaman Terbaru</h3>
        </div>
        
        <div className="space-y-3">
          {recentLoans.map(loan => {
             const emp = employees.find(e => e.id === loan.employeeId);
             return (
               <div key={loan.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex justify-between items-center group">
                 <div className="flex items-center gap-3">
                   {/* Avatar Initials */}
                   <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">
                     {emp?.name.charAt(0)}
                   </div>
                   
                   <div>
                     <p className="font-bold text-gray-900 text-sm leading-tight">{emp?.name}</p>
                     <div className="flex items-center gap-1.5 mt-1">
                       <Calendar size={10} className="text-gray-400"/>
                       <p className="text-xs text-gray-500">{formatDate(loan.requestDate)}</p>
                     </div>
                   </div>
                 </div>

                 <div className="flex flex-col items-end gap-1">
                   <p className="font-bold text-gray-800 text-sm">{formatRupiah(loan.amount)}</p>
                   <StatusBadge status={loan.status} />
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;