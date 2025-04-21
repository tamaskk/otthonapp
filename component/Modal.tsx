import React from "react";

type ModalProps = {
  handlerFunction: () => void;
  state: boolean;
  children: React.ReactNode;
};

const Modal = ({ handlerFunction, state, children }: ModalProps) => {
  return (
    <div
      className={`fixed inset-0 ${
        state ? "translate-y-0" : "-translate-y-[200vh]"
      } transition-all duration-300 bg-black bg-opacity-20 flex items-center justify-center z-[99999999999]`}
      onClick={handlerFunction}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="bg-white p-6 max-h-[80vh] overflow-auto max-w-[90vw] rounded-xl shadow-lg relative z-[999999999999]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={handlerFunction}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
