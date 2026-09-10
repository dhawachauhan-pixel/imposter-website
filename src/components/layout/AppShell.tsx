import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toast } from '../common/Toast';
import { useGame } from '../../game/state/gameContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dismissAlert } = useGame();

  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
      {state.alertMessage && (
        <Toast
          message={state.alertMessage.text}
          type={state.alertMessage.type}
          onClose={dismissAlert}
        />
      )}
    </div>
  );
};
