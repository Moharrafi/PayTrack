import { GoogleGenAI } from "@google/genai";
import { Employee, Loan } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeLoanRequest = async (
  employee: Employee,
  amount: number,
  termMonths: number,
  reason: string,
  existingLoans: Loan[]
): Promise<string> => {
  if (!apiKey) return "API Key tidak ditemukan. Analisis AI tidak tersedia.";

  const activeLoans = existingLoans.filter(l => l.employeeId === employee.id && l.remainingAmount > 0);
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.remainingAmount, 0);

  const prompt = `
    Anda adalah seorang analis resiko kredit keuangan profesional untuk sebuah perusahaan di Indonesia.
    Lakukan analisis singkat (maksimal 3 kalimat) mengenai kelayakan pengajuan kasbon/pinjaman berikut:

    Data Karyawan:
    - Nama: ${employee.name}
    - Gaji Bulanan: Rp ${employee.salary.toLocaleString('id-ID')}
    - Lama Bekerja: Sejak ${employee.joinDate}
    - Jabatan: ${employee.position}

    Status Hutang Saat Ini:
    - Total Sisa Hutang: Rp ${totalOutstanding.toLocaleString('id-ID')}
    - Jumlah Pinjaman Aktif: ${activeLoans.length}

    Pengajuan Baru:
    - Jumlah Diminta: Rp ${amount.toLocaleString('id-ID')}
    - Tenor: ${termMonths} bulan
    - Alasan: ${reason}

    Berikan rekomendasi: DISETUJUI, DIPERTIMBANGKAN, atau DITOLAK, beserta alasannya. Fokus pada kemampuan bayar (Debt Service Ratio).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Gagal menghasilkan analisis.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Terjadi kesalahan saat menghubungi AI. Silakan coba lagi nanti.";
  }
};

export const getFinancialAdvice = async (employee: Employee, loans: Loan[]): Promise<string> => {
    if (!apiKey) return "API Key tidak tersedia.";
    
    const activeLoans = loans.filter(l => l.employeeId === employee.id && l.remainingAmount > 0);
    const totalDebt = activeLoans.reduce((acc, l) => acc + l.remainingAmount, 0);

    const prompt = `
      Berikan saran keuangan singkat dan memotivasi untuk karyawan ini dalam 2-3 kalimat.
      Nama: ${employee.name}
      Gaji: Rp ${employee.salary}
      Total Hutang: Rp ${totalDebt}
      Gunakan bahasa Indonesia yang sopan dan profesional.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        return response.text || "Tidak ada saran.";
    } catch (e) {
        return "Gagal memuat saran.";
    }
}