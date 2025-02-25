import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores';

interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Modal = ({ id, title, children, onClose }: ModalProps) => {
  const closeModal = useUIStore(state => state.closeModal);
  const modals = useUIStore(state => state.modals);
  const isOpen = modals.some(modal => modal.id === id && modal.isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    closeModal(id);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full"
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 