import React from 'react';

interface ConfirmModalProps {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed z-50 font-Durk_bold_italic_1000 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-md bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex justify-center p-[0.15rem]  shadow-lg w-[25%]">
        <div className='bg-black w-[99%] h-[90%] p-4 rounded-md'>
          <h2 className="text-xl font-bold text-white">{message}</h2>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-white font-semibold border-2 border-black transition-transform hover:scale-105 ease-in-out duration-300"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white font-semibold bg-black border-2 border-black hover:scale-105 transition-transform ease-in-out duration-300"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
