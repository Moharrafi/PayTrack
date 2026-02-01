import React, { useState, useEffect } from 'react';
import { Employee, Loan, LoanStatus, Transaction, View } from './types';
import { MOCK_EMPLOYEES, MOCK_LOANS, MOCK_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import LoanForm from './components/LoanForm';
import AddEmployeeForm from './components/AddEmployeeForm';
import PaymentModal from './components/PaymentModal';
import HistoryModal from './components/HistoryModal';
import Notification from './components/Notification'; // Import Notification
import { formatRupiah, formatDate, StatusBadge } from './components/Formatters';
import {
  LayoutDashboard,
  Users,
  Banknote,
  Plus,
  Search,
  ChevronRight,
  UserCircle,
  History,
  UserPlus,
  Briefcase,
  Calendar,
  UserCheck,
  X,
  Clock,
  FileText,
  PieChart
} from 'lucide-react';



function App() {
  const [activeView, setActiveView] = useState<View>('DASHBOARD');

  // App State - Replaced Dexie with API State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [loanToPay, setLoanToPay] = useState<Loan | null>(null); // For Payment Modal
  const [historyLoan, setHistoryLoan] = useState<Loan | null>(null); // For History Modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // For Employees
  const [loanSearchTerm, setLoanSearchTerm] = useState(''); // For Loans

  // Notification State
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Filter State for Loans
  const [loanFilter, setLoanFilter] = useState<string>('Semua');



  // Helper function for Notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  // Fetch Data Effect
  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, loanRes, txRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/loans'),
        fetch('/api/transactions')
      ]);

      if (empRes.ok) setEmployees(await empRes.json());
      if (loanRes.ok) setLoans(await loanRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
    } catch (error) {
      console.error('Failed to fetch data', error);
      showNotification('Gagal memuat data dari server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleAddLoan = async (data: any) => {
    try {
      const newLoan: Loan = {
        id: `L${Date.now()}`,
        employeeId: data.employeeId,
        amount: data.amount,
        remainingAmount: data.amount,
        reason: data.reason,
        termMonths: data.termMonths,
        status: LoanStatus.ACTIVE,
        requestDate: new Date().toISOString(),
        startDate: new Date().toISOString(),
        aiAnalysis: data.aiAnalysis
      };

      const newTx: Transaction = {
        id: `T${Date.now()}`,
        loanId: newLoan.id,
        amount: data.amount,
        date: new Date().toISOString(),
        type: 'DISBURSEMENT'
      };

      await Promise.all([
        fetch('/api/loans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLoan)
        }),
        fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTx)
        })
      ]);

      await fetchData(); // Refresh data
      setShowLoanForm(false);
      showNotification('Pinjaman baru berhasil diajukan.', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Gagal menambahkan pinjaman.', 'error');
    }
  };

  const handleAddEmployee = async (data: any) => {
    try {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: data.name,
        position: data.position,
        salary: data.salary,
        joinDate: data.joinDate,
        phone: data.phone
      };

      await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });

      await fetchData();
      setShowEmployeeForm(false);
      showNotification('Data karyawan berhasil disimpan.', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Gagal menyimpan data karyawan.', 'error');
    }
  };

  const handlePayInstallment = async (amount: number, date: string) => {
    if (!loanToPay) return;

    try {
      const loan = loans.find(l => l.id === loanToPay.id);
      if (loan) {
        const newRemaining = Math.max(0, loan.remainingAmount - amount);

        // Update Loan
        await fetch(`/api/loans/${loan.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            remainingAmount: newRemaining,
            status: newRemaining === 0 ? LoanStatus.PAID : loan.status
          })
        });

        // Add Transaction
        const newTx: Transaction = {
          id: `T${Date.now()}`,
          loanId: loanToPay.id,
          amount,
          date: date,
          type: 'REPAYMENT'
        };

        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTx)
        });
      }

      await fetchData();
      setLoanToPay(null); // Close modal
      showNotification('Pembayaran cicilan berhasil dicatat.', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Gagal mencatat pembayaran.', 'error');
    }
  };



  // Views
  const renderEmployees = () => {
    const filteredEmployees = employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeBorrowersCount = new Set(loans.filter(l => l.status === LoanStatus.ACTIVE).map(l => l.employeeId)).size;

    return (
      <div className="pb-24 space-y-5 animate-fade-in">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Data Karyawan</h2>
            <p className="text-xs text-gray-500">Kelola data dan status pinjaman</p>
          </div>
          <button
            onClick={() => setShowEmployeeForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} />
            <span className="text-sm font-semibold">Baru</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Karyawan</p>
              <p className="text-lg font-bold text-gray-800">{employees.length}</p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <UserCheck size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Sedang Meminjam</p>
              <p className="text-lg font-bold text-gray-800">{activeBorrowersCount}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama atau jabatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm shadow-sm"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          )}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500 text-sm">Tidak ditemukan karyawan dengan kata kunci tersebut.</p>
            </div>
          ) : (
            filteredEmployees.map(emp => {
              const empLoans = loans.filter(l => l.employeeId === emp.id && l.status === LoanStatus.ACTIVE);
              const totalDebt = empLoans.reduce((sum, l) => sum + l.remainingAmount, 0);

              return (
                <div
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmployee(emp);
                  }}
                  className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-lg font-bold shadow-sm ring-2 ring-white">
                        {emp.name.charAt(0)}
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{emp.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                          <Briefcase size={12} />
                          <span className="text-xs">{emp.position}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-gray-400">
                          <Calendar size={12} />
                          <span className="text-[10px]">Bergabung {formatDate(emp.joinDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Chevron */}
                    <div className="flex flex-col items-end gap-2">
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                      {totalDebt > 0 ? (
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase font-medium">Sisa Hutang</p>
                          <p className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                            {formatRupiah(totalDebt)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                          <UserCheck size={10} /> Bebas Hutang
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderLoans = () => {
    // Filter logic
    const filteredLoans = loans.filter(loan => {
      const emp = employees.find(e => e.id === loan.employeeId);
      const searchLower = loanSearchTerm.toLowerCase();

      const matchesSearch =
        (emp?.name.toLowerCase().includes(searchLower) || false) ||
        loan.reason.toLowerCase().includes(searchLower) ||
        loan.id.toLowerCase().includes(searchLower);

      if (loanFilter === 'Semua') return matchesSearch;
      return matchesSearch && loan.status === loanFilter;
    });

    return (
      <div className="pb-24 space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Daftar Pinjaman</h2>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Banknote className="text-emerald-600" size={20} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari peminjam, ID, atau alasan..."
            value={loanSearchTerm}
            onChange={(e) => setLoanSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm shadow-sm"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          {loanSearchTerm && (
            <button onClick={() => setLoanSearchTerm('')} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Semua', 'Aktif', 'Lunas', 'Ditolak'].map((filter) => (
            <button
              key={filter}
              onClick={() => setLoanFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${loanFilter === filter
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredLoans.length === 0 ? (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} className="opacity-50" />
            </div>
            <p className="font-medium text-gray-600">Tidak ada pinjaman ditemukan</p>
            <p className="text-xs mt-1">Status: {loanFilter} {loanSearchTerm && `• Search: "${loanSearchTerm}"`}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLoans.map(loan => {
              const emp = employees.find(e => e.id === loan.employeeId);
              const isActive = loan.status === LoanStatus.ACTIVE;
              const progress = ((loan.amount - loan.remainingAmount) / loan.amount) * 100;

              // Side border color based on status
              let statusColor = 'bg-blue-500';
              if (loan.status === LoanStatus.PAID) statusColor = 'bg-emerald-500';
              if (loan.status === LoanStatus.REJECTED) statusColor = 'bg-red-500';
              if (loan.status === LoanStatus.PENDING) statusColor = 'bg-amber-500';

              return (
                <div key={loan.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group transition-all hover:shadow-md">
                  {/* Status Color Strip */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColor}`}></div>

                  <div className="p-4 pl-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{emp?.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(loan.requestDate)}</span>
                          <span>•</span>
                          <span className="font-mono bg-gray-100 px-1 rounded text-[10px]">#{loan.id}</span>
                        </div>
                      </div>
                      <StatusBadge status={loan.status} />
                    </div>

                    {/* Amount Section */}
                    <div className="mb-4">
                      <div className="flex justify-between items-end mb-1">
                        <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
                          {loan.status === LoanStatus.PAID ? 'Total Lunas' : 'Sisa Kewajiban'}
                        </p>
                        {isActive && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {Math.round(progress)}% Lunas
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${loan.status === LoanStatus.PAID ? 'text-emerald-600' : 'text-gray-900'}`}>
                          {formatRupiah(loan.remainingAmount)}
                        </span>
                        {isActive && (
                          <span className="text-xs text-gray-400">dari {formatRupiah(loan.amount)}</span>
                        )}
                      </div>

                      {/* Progress Bar for Active Loans */}
                      {isActive && (
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    {/* Reason */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-4 flex gap-2 items-start">
                      <div className="mt-0.5 text-gray-400"><FileText size={14} /></div>
                      <p className="text-xs text-gray-600 italic line-clamp-2">"{loan.reason}"</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setHistoryLoan(loan)}
                        className="flex-1 py-2.5 bg-white text-gray-600 font-semibold rounded-xl text-sm border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                      >
                        <History size={16} /> Riwayat
                      </button>

                      {isActive && (
                        <button
                          onClick={() => setLoanToPay(loan)}
                          className="flex-[1.5] py-2.5 bg-gray-900 text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          <Banknote size={16} /> Bayar Cicilan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderEmployeeDetail = () => {
    if (!selectedEmployee) return null;
    const empLoans = loans.filter(l => l.employeeId === selectedEmployee.id);

    return (
      <div className="fixed inset-0 z-40 bg-gray-50 flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm border-b sticky top-0">
          <button onClick={() => setSelectedEmployee(null)} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronRight className="rotate-180 text-gray-600" />
          </button>
          <h2 className="font-bold text-lg">Detail Karyawan</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
          <div className="flex flex-col items-center py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold mb-3">
              {selectedEmployee.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h3>
            <p className="text-gray-500">{selectedEmployee.position}</p>
            <div className="mt-4 flex gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400 uppercase">Gaji</p>
                <p className="font-semibold">{formatRupiah(selectedEmployee.salary)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Bergabung</p>
                <p className="font-semibold">{formatDate(selectedEmployee.joinDate)}</p>
              </div>
            </div>
          </div>

          {/* AI Advisor Card */}
          {/* AI Advisor Card Removed */}

          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <History size={18} /> Riwayat Pinjaman
            </h4>
            {empLoans.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Belum ada riwayat pinjaman.</p>
            ) : (
              <div className="space-y-3">
                {empLoans.map(l => (
                  <div key={l.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{formatRupiah(l.amount)}</span>
                      <StatusBadge status={l.status} />
                    </div>
                    <p className="text-gray-500 text-xs">{l.reason} • {formatDate(l.requestDate)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl relative">
      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main Content Area */}
      <main className="p-4 min-h-screen">
        {activeView === 'DASHBOARD' && <Dashboard loans={loans} employees={employees} />}
        {activeView === 'EMPLOYEES' && renderEmployees()}
        {activeView === 'LOANS' && renderLoans()}
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowLoanForm(true)}
        className="fixed bottom-24 right-4 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 active:scale-90 transition-all z-30"
        aria-label="Tambah Pinjaman"
      >
        <Plus size={24} />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-30">
        <button
          onClick={() => setActiveView('DASHBOARD')}
          className={`flex flex-col items-center gap-1 ${activeView === 'DASHBOARD' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={22} />
          <span className="text-[10px] font-medium">Beranda</span>
        </button>
        <button
          onClick={() => setActiveView('EMPLOYEES')}
          className={`flex flex-col items-center gap-1 ${activeView === 'EMPLOYEES' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <Users size={22} />
          <span className="text-[10px] font-medium">Karyawan</span>
        </button>
        <button
          onClick={() => setActiveView('LOANS')}
          className={`flex flex-col items-center gap-1 ${activeView === 'LOANS' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <Banknote size={22} />
          <span className="text-[10px] font-medium">Pinjaman</span>
        </button>
      </nav>

      {/* Modals */}
      {showLoanForm && (
        <LoanForm
          employees={employees}
          existingLoans={loans}
          onSubmit={handleAddLoan}
          onCancel={() => setShowLoanForm(false)}
        />
      )}

      {showEmployeeForm && (
        <AddEmployeeForm
          onSubmit={handleAddEmployee}
          onCancel={() => setShowEmployeeForm(false)}
        />
      )}

      {loanToPay && (
        <PaymentModal
          loan={loanToPay}
          onConfirm={handlePayInstallment}
          onCancel={() => setLoanToPay(null)}
        />
      )}

      {historyLoan && (
        <HistoryModal
          loan={historyLoan}
          employeeName={employees.find(e => e.id === historyLoan.employeeId)?.name || 'Karyawan'}
          transactions={transactions
            .filter(t => t.loanId === historyLoan.id && t.type === 'REPAYMENT')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          }
          onClose={() => setHistoryLoan(null)}
        />
      )}

      {renderEmployeeDetail()}

      {/* Tailwind Utility for Animations */}
      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px) translateX(-50%); } to { opacity: 1; transform: translateY(0) translateX(-50%); } }
        .animate-fade-in-down { animation: fade-in-down 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}

export default App;