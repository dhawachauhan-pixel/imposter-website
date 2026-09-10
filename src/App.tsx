import React from 'react';
import { I18nProvider } from './i18n/I18nContext';
import { GameProvider } from './game/state/gameContext';
import { AppShell } from './components/layout/AppShell';
import { GameSetupCard } from './components/game-setup/GameSetupCard';
import { FeatureTrioSection } from './components/sections/FeatureTrioSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { GameModesSection } from './components/sections/GameModesSection';
import { WordGeneratorTeaser } from './components/sections/WordGeneratorTeaser';
import { BlogTeaser } from './components/sections/BlogTeaser';
import { FaqSection } from './components/sections/FaqSection';

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <GameProvider>
        <AppShell>
          <div className="page-container">
            {/* 1. The Game is the Hero - Immediate first viewport */}
            <GameSetupCard />

            {/* 2. Three simple feature blocks */}
            <FeatureTrioSection />

            {/* 3. How It Works */}
            <HowItWorksSection />

            {/* 4. Game Modes */}
            <GameModesSection />

            {/* 5. Word Generator Teaser */}
            <WordGeneratorTeaser />

            {/* 6. Blog Guides */}
            <BlogTeaser />

            {/* 7. FAQ Section */}
            <FaqSection />
          </div>
        </AppShell>
      </GameProvider>
    </I18nProvider>
  );
};

export default App;
