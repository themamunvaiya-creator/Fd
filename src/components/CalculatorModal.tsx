import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator as CalcIcon, X, Delete } from 'lucide-react';

interface CalculatorModalProps {
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);

  const handleDigit = (digit: string) => {
    setDisplay((prevVal) => (prevVal === '0' ? digit : prevVal + digit));
  };

  const handleOp = (operator: string) => {
    setPrev(parseFloat(display));
    setOp(operator);
    setDisplay('0');
  };

  const handleEquals = () => {
    if (prev !== null && op) {
      const current = parseFloat(display);
      let result = 0;
      if (op === '+') result = prev + current;
      if (op === '-') result = prev - current;
      if (op === '×') result = prev * current;
      if (op === '÷') result = current !== 0 ? prev / current : 0;
      setDisplay(String(result));
      setPrev(null);
      setOp(null);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400">
            <CalcIcon size={20} />
            <span className="text-sm font-bold text-white">ক্যালকুলেটর</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Display */}
        <div className="my-4 p-4 bg-slate-950 rounded-2xl text-right">
          <div className="text-xs text-slate-500 h-4">
            {prev !== null ? `${prev} ${op}` : ''}
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-wider truncate">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={handleClear}
            className="col-span-2 p-3.5 rounded-xl bg-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/30 text-sm"
          >
            AC
          </button>
          <button
            onClick={() => setDisplay((p) => (p.length > 1 ? p.slice(0, -1) : '0'))}
            className="p-3.5 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
          >
            <Delete size={18} />
          </button>
          <button
            onClick={() => handleOp('÷')}
            className="p-3.5 rounded-xl bg-cyan-600/30 text-cyan-300 font-bold hover:bg-cyan-600/40"
          >
            ÷
          </button>

          {['7', '8', '9'].map((n) => (
            <button
              key={n}
              onClick={() => handleDigit(n)}
              className="p-3.5 rounded-xl bg-slate-800/80 text-white font-medium hover:bg-slate-700"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleOp('×')}
            className="p-3.5 rounded-xl bg-cyan-600/30 text-cyan-300 font-bold hover:bg-cyan-600/40"
          >
            ×
          </button>

          {['4', '5', '6'].map((n) => (
            <button
              key={n}
              onClick={() => handleDigit(n)}
              className="p-3.5 rounded-xl bg-slate-800/80 text-white font-medium hover:bg-slate-700"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleOp('-')}
            className="p-3.5 rounded-xl bg-cyan-600/30 text-cyan-300 font-bold hover:bg-cyan-600/40"
          >
            -
          </button>

          {['1', '2', '3'].map((n) => (
            <button
              key={n}
              onClick={() => handleDigit(n)}
              className="p-3.5 rounded-xl bg-slate-800/80 text-white font-medium hover:bg-slate-700"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleOp('+')}
            className="p-3.5 rounded-xl bg-cyan-600/30 text-cyan-300 font-bold hover:bg-cyan-600/40"
          >
            +
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="col-span-2 p-3.5 rounded-xl bg-slate-800/80 text-white font-medium hover:bg-slate-700"
          >
            0
          </button>
          <button
            onClick={() => handleDigit('.')}
            className="p-3.5 rounded-xl bg-slate-800/80 text-white font-bold hover:bg-slate-700"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="p-3.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow-md shadow-cyan-500/30"
          >
            =
          </button>
        </div>
      </div>
    </motion.div>
  );
};
