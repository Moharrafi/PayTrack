import React from 'react';

export const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const StatusBadge = ({ status }: { status: string }) => {
  let color = 'bg-gray-100 text-gray-800';
  if (status === 'Aktif') color = 'bg-blue-100 text-blue-800';
  if (status === 'Lunas') color = 'bg-green-100 text-green-800';
  if (status === 'Ditolak') color = 'bg-red-100 text-red-800';
  if (status === 'Menunggu') color = 'bg-yellow-100 text-yellow-800';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
};