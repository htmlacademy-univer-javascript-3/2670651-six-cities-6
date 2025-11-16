import { useEffect } from 'react';
import type { MouseEvent } from 'react';

type ErrorModalProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
          aria-label="Close"
        >
          x
        </button>
        <h2 className="text-lg font-semibold mb-3 text-red-600">Submission Error</h2>
        <p className="text-sm text-gray-700 mb-5">{message}</p>
        <button
          onClick={onClose}
          onBlur={onClose}
          className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
