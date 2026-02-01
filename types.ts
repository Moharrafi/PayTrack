export enum LoanStatus {
  ACTIVE = 'Aktif',
  PAID = 'Lunas',
  REJECTED = 'Ditolak',
  PENDING = 'Menunggu'
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  joinDate: string;
  phone: string;
}

export interface Loan {
  id: string;
  employeeId: string;
  amount: number;
  remainingAmount: number;
  reason: string;
  requestDate: string;
  startDate?: string;
  termMonths: number;
  status: LoanStatus;
  aiAnalysis?: string; // Analysis from Gemini
}

export interface Transaction {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  type: 'DISBURSEMENT' | 'REPAYMENT';
}

// Helper types for UI
export type View = 'DASHBOARD' | 'EMPLOYEES' | 'LOANS' | 'PROFILE';