import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  onClose(): void;
  widthClass?: string;
};

export default function Modal({
  title,
  children,
  onClose,
  widthClass = 'max-w-md',
}: Props) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${widthClass} rounded-xl bg-white shadow-lg overflow-hidden`}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </header>

        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
