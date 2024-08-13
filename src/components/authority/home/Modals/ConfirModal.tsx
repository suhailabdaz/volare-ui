import React from 'react';

interface ConfirmModalProps {
  message: string;
  confirmLabel?: string | "Confirm";
  cancelLabel?: string | "Cancel";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className=" bg-white px-8 py-6 shadow-lg w-[25%] border-5 border-black">
        <h2 className="text-xl font-bold m-4">{message}</h2>
        <div className="flex justify-end m-3 space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-black text-base font-semibold border-2 border-black    transition-all hover:scale-105 ease-in-out delay-50 duration-300"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-base text-white font-semibold bg-black border-2 border-black  hover:scale-105 transition-all ease-in-out delay-50 duration-300"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
