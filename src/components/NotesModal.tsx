import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Plus, Trash2, X, BrainCircuit, Sparkles } from 'lucide-react';
import { AppMode } from '../types';

interface NotesModalProps {
  notes: string[];
  mode: AppMode;
  onClose: () => void;
  onAddNote: (note: string) => void;
  onDeleteNote: (index: number) => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({
  notes,
  mode,
  onClose,
  onAddNote,
  onDeleteNote,
}) => {
  const [newNote, setNewNote] = useState('');
  const isGirlfriend = mode === 'girlfriend';

  const handleAdd = () => {
    if (!newNote.trim()) return;
    onAddNote(newNote.trim());
    setNewNote('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isGirlfriend ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <BrainCircuit size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">মিতার ব্যক্তিগত মেমোরি</h3>
              <p className="text-xs text-slate-400">এআই আপনার এই তথ্যের ভিত্তিতে পরামর্শ দেয়</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Input box */}
        <div className="my-3 flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="নতুন তথ্য যোগ করুন (যেমন: আমার চায়ে চিনি না খাওয়া অভ্যাস)..."
            className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-pink-500"
          />
          <button
            onClick={handleAdd}
            className={`p-2.5 rounded-xl text-white font-bold flex items-center justify-center ${
              isGirlfriend ? 'bg-pink-600 hover:bg-pink-500' : 'bg-cyan-600 hover:bg-cyan-500'
            }`}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {notes.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              এখনো কোনো মেমোরি যোগ করা হয়নি।
            </div>
          ) : (
            notes.map((note, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-2">
                  <Sparkles size={14} className="text-pink-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-200 leading-relaxed">{note}</p>
                </div>
                <button
                  onClick={() => onDeleteNote(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="মুছে ফেলুন"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
          💡 আপনি মুখে বললে মিতা নিজে থেকেও গুরুত্বপূর্ণ তথ্য মনে রাখে।
        </div>
      </div>
    </motion.div>
  );
};
