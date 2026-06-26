"use client";

import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,

  size = "md",

  closeOnBackdrop = true,
  closeOnEsc = true,

  showCloseButton = true,
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw]",
  };

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose?.();
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e) => {
    if (closeOnEsc && e.key === "Escape") {
      onClose?.();
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={handleContentClick}
        className={`
          w-full
          ${sizes[size]}
          rounded-xl
          bg-white
          shadow-2xl
          animate-in
          fade-in
          zoom-in-95
        `}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="rounded-md p-2 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          )}

        </div>

        {/* Body */}

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}

        {footer && (
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
}