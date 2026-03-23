import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md p-10 relative z-10 shadow-2xl border border-white/20 dark:border-white/5 text-center transition-colors duration-500"
        >
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertCircle size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">Terminate Data?</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 text-sm">
            Are you sure you want to delete <span className="text-slate-900 dark:text-white font-black">"{itemName}"</span>? This action is irreversible on the Pi node.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-red-900/20 transition-all active:scale-95"
            >
              Delete Mode
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteModal;
