import { Employee, Loan, LoanStatus, Transaction } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Budi Santoso', position: 'Sales Manager', salary: 8500000, joinDate: '2022-01-15', phone: '081234567890' },
  { id: '2', name: 'Siti Aminah', position: 'Admin Staff', salary: 4500000, joinDate: '2023-03-10', phone: '081298765432' },
  { id: '3', name: 'Rizky Pratama', position: 'Driver', salary: 3800000, joinDate: '2021-11-05', phone: '081345678901' },
  { id: '4', name: 'Dewi Lestari', position: 'HR Specialist', salary: 6200000, joinDate: '2020-08-20', phone: '081987654321' },
];

export const MOCK_LOANS: Loan[] = [
  {
    id: 'L1',
    employeeId: '1',
    amount: 5000000,
    remainingAmount: 2000000,
    reason: 'Renovasi Rumah',
    requestDate: '2023-10-01',
    startDate: '2023-10-05',
    termMonths: 5,
    status: LoanStatus.ACTIVE
  },
  {
    id: 'L2',
    employeeId: '3',
    amount: 1500000,
    remainingAmount: 1500000,
    reason: 'Biaya Sekolah Anak',
    requestDate: '2024-01-10',
    startDate: '2024-01-12',
    termMonths: 3,
    status: LoanStatus.ACTIVE
  },
  {
    id: 'L3',
    employeeId: '2',
    amount: 2000000,
    remainingAmount: 0,
    reason: 'Servis Motor',
    requestDate: '2023-06-01',
    startDate: '2023-06-02',
    termMonths: 2,
    status: LoanStatus.PAID
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T1', loanId: 'L1', amount: 5000000, date: '2023-10-05', type: 'DISBURSEMENT' },
  { id: 'T2', loanId: 'L1', amount: 1000000, date: '2023-11-05', type: 'REPAYMENT' },
  { id: 'T3', loanId: 'L1', amount: 1000000, date: '2023-12-05', type: 'REPAYMENT' },
  { id: 'T4', loanId: 'L1', amount: 1000000, date: '2024-01-05', type: 'REPAYMENT' },
  { id: 'T5', loanId: 'L3', amount: 2000000, date: '2023-06-02', type: 'DISBURSEMENT' },
  { id: 'T6', loanId: 'L3', amount: 1000000, date: '2023-07-02', type: 'REPAYMENT' },
  { id: 'T7', loanId: 'L3', amount: 1000000, date: '2023-08-02', type: 'REPAYMENT' },
  { id: 'T8', loanId: 'L2', amount: 1500000, date: '2024-01-12', type: 'DISBURSEMENT' },
];