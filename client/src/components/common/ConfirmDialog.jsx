import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertCircle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện thao tác này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-12 h-12 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-pink mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-sm text-pastel-text mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
