import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

// Fungsi untuk membuat suara sintetis
const playNotificationSound = (type: 'success' | 'error') => {
  try {
    // Support untuk berbagai browser
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    if (type === 'success') {
      // Suara "Cha-Ching" / Koin (Money Sound)
      // Kita menggunakan 2 oscillator untuk mensimulasikan bunyi koin beradu
      
      // Nada 1 (Base Ping)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1200, now); // Nada tinggi B5/C6
      
      gain1.gain.setValueAtTime(0.1, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6); // Decay cepat (logam)

      osc1.start(now);
      osc1.stop(now + 0.6);

      // Nada 2 (Sparkle/Harmonic Ping) - Sedikit delay
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2000, now + 0.08); // Nada lebih tinggi
      
      gain2.gain.setValueAtTime(0.1, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc2.start(now + 0.08);
      osc2.stop(now + 0.7);

    } else {
      // Suara "Thud/Buzz" (Error)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle'; 
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2); // Nada turun
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    // Mainkan suara saat komponen muncul (mount)
    playNotificationSound(type);

    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Hilang otomatis setelah 3 detik

    return () => clearTimeout(timer);
  }, [onClose, type]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-down w-full max-w-sm px-4">
      <div className={`flex items-center gap-3 p-4 rounded-xl shadow-xl border bg-white ${
        isSuccess ? 'border-emerald-500' : 'border-red-500'
      }`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
        }`}>
          {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        </div>
        
        <div className="flex-1">
          <h4 className={`text-sm font-bold ${isSuccess ? 'text-emerald-800' : 'text-red-800'}`}>
            {isSuccess ? 'Berhasil' : 'Gagal'}
          </h4>
          <p className="text-sm text-gray-600 leading-tight mt-0.5">{message}</p>
        </div>

        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Notification;