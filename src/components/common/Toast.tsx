import React, { useEffect } from 'react';
import './Toast.css';

export interface ToastProps {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    info: '💡',
    warning: '⚠️',
    error: '🚫',
    success: '🎉',
  };

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      <div className={`toast toast-${type}`}>
        <span className="toast-icon">{icons[type]}</span>
        <span className="toast-text">{message}</span>
        <button className="toast-close" onClick={onClose} aria-label="Dismiss message">
          ✕
        </button>
      </div>
    </div>
  );
};
