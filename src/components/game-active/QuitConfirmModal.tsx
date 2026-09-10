import React, { useEffect } from 'react';
import { Button } from '../common/Button';
import './QuitConfirmModal.css';

interface QuitConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const QuitConfirmModal: React.FC<QuitConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quit-modal-title"
      onClick={onCancel}
    >
      <div className="quit-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quit-icon-badge" aria-hidden="true">
          ⚠️
        </div>
        <h3 id="quit-modal-title" className="quit-modal-title">
          Quit Current Game?
        </h3>
        <p className="quit-modal-desc">
          Are you sure you want to return to the lobby? Your current round progress and votes will be cleared.
        </p>
        <div className="quit-modal-actions">
          <Button variant="secondary" size="md" onClick={onCancel}>
            Keep Playing
          </Button>
          <Button variant="accent" size="md" onClick={onConfirm}>
            Quit to Lobby
          </Button>
        </div>
      </div>
    </div>
  );
};
