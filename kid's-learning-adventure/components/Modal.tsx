
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onClose, buttonText = "Continue" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md text-center transform transition-all scale-100 opacity-100">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6 text-lg md:text-xl">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md text-lg transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;
