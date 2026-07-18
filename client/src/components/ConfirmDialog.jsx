import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl border border-ink/10 shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start gap-3">
          {danger && (
            <span className="w-10 h-10 shrink-0 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </span>
          )}
          <div>
            <h2 className="font-serif text-lg text-ink">{title}</h2>
            {message && <p className="text-sm text-gray-500 mt-1.5">{message}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="text-sm font-medium px-4 py-2 rounded-full border border-ink/15 text-ink hover:bg-gray-50 transition-colors cursor-pointer">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`text-sm font-medium px-4 py-2 rounded-full text-white transition-colors cursor-pointer ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:opacity-90"
            }`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
