import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { colors, components, utils } from '../styles/theme';

function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      button: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
    },
    warning: {
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 backdrop-blur-sm transition-all"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="relative w-full max-w-md p-6 bg-white shadow-xl rounded-2xl z-10">
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-10 h-10 mx-auto ${currentStyle.iconBg} rounded-full flex items-center justify-center`}>
              <ExclamationTriangleIcon className={`w-6 h-6 ${currentStyle.icon}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className={components.button.secondary}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={currentStyle.button}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;