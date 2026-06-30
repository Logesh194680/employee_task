import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, employeeName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 transition-all transform scale-100">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Delete Employee Profile?</h3>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Are you sure you want to remove <span className="font-semibold text-slate-200">{employeeName}</span>? This process cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
