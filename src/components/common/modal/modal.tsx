import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  closeOnEscape?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  title,
  open,
  setOpen,
  children,
  closeOnEscape = true,
}) => {
  useEffect(() => {
    if (!closeOnEscape) return;

    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" ? setOpen(false) : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [setOpen, closeOnEscape]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-3 relative min-w-[200px] max-w-[85vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="heading flex items-center justify-between">
          <h1 className="text-lg font-semibold font-poppins">{title}</h1>
          <button
            className=" text-xl hover:bg-gray-200 duration-150 rounded-full w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.getElementById("root") as HTMLElement
  );
};

export default Modal;
