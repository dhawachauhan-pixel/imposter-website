import React, { useState } from 'react';
import { wordEngine } from '../../game/words/wordEngine';
import { CATEGORIES_META } from '../../game/words/wordDatabase';
import type { WordItem, WordPair, WordDifficulty } from '../../game/types/word';
import { triggerHaptic } from '../../game/utils/haptics';
import './WordGeneratorTool.css';

type GeneratorMode = 'single' | 'pair';
type DifficultyFilter = 'all' | WordDifficulty;

export const WordGeneratorTool: React.FC = () => {
  const [mode, setMode] = useState<GeneratorMode>('single');
  const [category, setCategory] = useState<string>('random');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [isConcealed, setIsConcealed] = useState<boolean>(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Initial generated states
  const [singleWord, setSingleWord] = useState<WordItem>(() =>
    wordEngine.getRandomWord('food')
  );
  const [wordPair, setWordPair] = useState<WordPair>(() =>
    wordEngine.getRandomWordPair('food')
  );

  const handleGenerate = () => {
    triggerHaptic('light');
    const diff = difficulty === 'all' ? undefined : difficulty;
    if (mode === 'single') {
      const generated = wordEngine.getRandomWord(category, diff);
      setSingleWord(generated);
    } else {
      const generated = wordEngine.getRandomWordPair(category, diff);
      setWordPair(generated);
    }
  };

  const handleCopy = async () => {
    triggerHaptic('light');
    const textToCopy =
      mode === 'single'
        ? singleWord.word
        : `Civilians: ${wordPair.wordA} | Undercover: ${wordPair.wordB}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopyToast('Copied to clipboard!');
      setTimeout(() => setCopyToast(null), 2200);
    } catch {
      setCopyToast('Unable to copy');
      setTimeout(() => setCopyToast(null), 2000);
    }
  };

  const scrollToGameCard = () => {
    triggerHaptic('medium');
    const target = document.getElementById('play-game') || document.querySelector('.hero-game-column');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="word-generator-tool" data-testid="word-generator-tool">
      {/* Mode Switcher Tabs */}
      <div className="tool-mode-tabs" role="tablist" aria-label="Word Generator Mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'single'}
          className={`tool-mode-tab ${mode === 'single' ? 'is-active' : ''}`}
          onClick={() => {
            triggerHaptic('selection');
            setMode('single');
          }}
          data-testid="mode-single-btn"
        >
          <span aria-hidden="true">🃏</span> Single Word (Classic / Mr. White)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'pair'}
          className={`tool-mode-tab ${mode === 'pair' ? 'is-active' : ''}`}
          onClick={() => {
            triggerHaptic('selection');
            setMode('pair');
          }}
          data-testid="mode-pair-btn"
        >
          <span aria-hidden="true">🕵️</span> Word Pair (Undercover)
        </button>
      </div>

      {/* Filter Controls Grid */}
      <div className="tool-filters-grid">
        {/* Category Dropdown */}
        <div className="tool-filter-group">
          <label htmlFor="gen-category" className="tool-filter-label">
            Category
          </label>
          <div className="tool-select-wrapper">
            <select
              id="gen-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="tool-select-input"
              data-testid="gen-category-select"
            >
              <option value="random">🎲 All Categories</option>
              {CATEGORIES_META.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.id.charAt(0).toUpperCase() + c.id.slice(1)}
                </option>
              ))}
            </select>
            <span className="tool-arrow" aria-hidden="true">▾</span>
          </div>
        </div>

        {/* Difficulty Dropdown */}
        <div className="tool-filter-group">
          <label htmlFor="gen-difficulty" className="tool-filter-label">
            Difficulty
          </label>
          <div className="tool-select-wrapper">
            <select
              id="gen-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyFilter)}
              className="tool-select-input"
              data-testid="gen-difficulty-select"
            >
              <option value="all">⚡ Any Difficulty</option>
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
            <span className="tool-arrow" aria-hidden="true">▾</span>
          </div>
        </div>

        {/* Peek / Conceal Secret Mode Toggle */}
        <div className="tool-filter-group">
          <label className="tool-filter-label">Privacy Shield</label>
          <button
            type="button"
            className={`conceal-toggle-btn ${isConcealed ? 'is-concealed' : ''}`}
            onClick={() => {
              triggerHaptic('selection');
              setIsConcealed(!isConcealed);
            }}
            aria-label={isConcealed ? 'Reveal Word' : 'Conceal Word'}
            title={isConcealed ? 'Click to reveal word' : 'Click to hide word from players'}
            data-testid="conceal-toggle-btn"
          >
            <span aria-hidden="true">{isConcealed ? '🙈' : '👁️'}</span>
            <span>{isConcealed ? 'Hidden (Peek)' : 'Visible to Host'}</span>
          </button>
        </div>
      </div>

      {/* Main Display Box */}
      <div className="tool-display-card">
        {mode === 'single' ? (
          <div className="single-word-card">
            <span className="word-card-subhead">Secret Word</span>
            <div
              className={`word-main-display ${isConcealed ? 'is-blurred' : ''}`}
              onClick={() => isConcealed && setIsConcealed(false)}
              role={isConcealed ? 'button' : undefined}
              tabIndex={isConcealed ? 0 : undefined}
              data-testid="generator-single-word"
            >
              {singleWord.word}
              {isConcealed && <span className="blur-overlay-hint">Tap to Reveal</span>}
            </div>

            <div className="word-meta-badges">
              <span className="meta-badge meta-category">
                🏷️ {singleWord.category.toUpperCase()}
              </span>
              <span className={`meta-badge meta-difficulty diff-${singleWord.difficulty}`}>
                {singleWord.difficulty.toUpperCase()}
              </span>
              <span className="meta-badge meta-clue">
                🎯 Clueability {singleWord.clueability}/10
              </span>
            </div>
          </div>
        ) : (
          <div className="paired-word-card">
            <span className="word-card-subhead">Undercover Word Pair</span>
            <div className="paired-grid">
              <div className="pair-box civilian-side">
                <span className="pair-role-label">Word A • Civilians</span>
                <div
                  className={`word-pair-display ${isConcealed ? 'is-blurred' : ''}`}
                  onClick={() => isConcealed && setIsConcealed(false)}
                  data-testid="generator-pair-word-a"
                >
                  {wordPair.wordA}
                  {isConcealed && <span className="blur-overlay-hint">Tap to Reveal</span>}
                </div>
              </div>

              <div className="pair-divider" aria-hidden="true">
                <span>VS</span>
              </div>

              <div className="pair-box undercover-side">
                <span className="pair-role-label">Word B • Undercover</span>
                <div
                  className={`word-pair-display ${isConcealed ? 'is-blurred' : ''}`}
                  onClick={() => isConcealed && setIsConcealed(false)}
                  data-testid="generator-pair-word-b"
                >
                  {wordPair.wordB}
                  {isConcealed && <span className="blur-overlay-hint">Tap to Reveal</span>}
                </div>
              </div>
            </div>

            <div className="word-meta-badges">
              <span className="meta-badge meta-category">
                🏷️ {wordPair.category.toUpperCase()}
              </span>
              <span className={`meta-badge meta-difficulty diff-${wordPair.difficulty}`}>
                {wordPair.difficulty.toUpperCase()}
              </span>
              {wordPair.context && (
                <span className="meta-badge meta-similarity">
                  💡 Connection: {wordPair.context}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="tool-actions-row">
          <button
            type="button"
            className="tool-action-btn primary-gen-btn"
            onClick={handleGenerate}
            data-testid="generator-dice-btn"
          >
            <span aria-hidden="true">🎲</span>
            <span>{mode === 'single' ? 'Generate Word' : 'Generate Pair'}</span>
          </button>

          <button
            type="button"
            className="tool-action-btn copy-btn"
            onClick={handleCopy}
            aria-label="Copy to Clipboard"
            data-testid="generator-copy-btn"
          >
            <span aria-hidden="true">📋</span>
            <span>Copy</span>
          </button>

          <button
            type="button"
            className="tool-action-btn play-now-btn"
            onClick={scrollToGameCard}
            data-testid="generator-play-now-btn"
          >
            <span aria-hidden="true">🎮</span>
            <span>{mode === 'single' ? 'Play With This Word' : 'Play With This Pair'}</span>
          </button>
        </div>

        {/* Toast Notification */}
        {copyToast && (
          <div className="copy-toast-banner" role="status" aria-live="polite">
            {copyToast}
          </div>
        )}
      </div>
    </div>
  );
};
