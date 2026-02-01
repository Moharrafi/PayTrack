import React, { useState } from 'react';
import { Users } from 'lucide-react';

interface AddEmployeeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [phone, setPhone] = useState('');
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      position,
      salary: Number(salary),
      phone,
      joinDate
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-emerald-600 text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
             <Users size={20} /> Tambah Karyawan
          </h2>
          <button onClick={onCancel} className="text-white/80 hover:text-white">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar">
          <form id="employeeForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Ahmad Dahlan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Contoh: Staff Gudang"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gaji Pokok (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Bergabung</label>
                   <input
                    type="date"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                  />
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <input
                type="tel"
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08..."
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
            form="employeeForm"
            className="flex-1 py-2 px-4 bg-emerald-600 rounded-lg text-white font-medium hover:bg-emerald-700 shadow-sm"
          >
            Simpan Karyawan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;