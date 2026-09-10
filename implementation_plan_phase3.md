# Implementation Plan — Phase 3: Competitive Polish, Game Variety & Global Expansion (Final Approved Specification)

This document establishes the definitive gameplay rules, architecture, and verification requirements for **Phase 3** of [imposter.website](https://imposter.website).

> [!IMPORTANT]
> **Planning Mode Guarantee**:
> - No application source code is modified or deleted during this planning phase.
> - The working Phase 1 / 1.5 homepage design and Phase 2 Classic local game flow remain 100% intact and untouched.
> - Phase 3 implementation will only begin after explicit user approval.

---

## 1. Core Rule Specifications for Phase 3A

---

### A. Mr. White Game Mode — Exact Outcome Logic

- **Role & Word Distribution**:
  - Minimum 3 players.
  - Exactly 1 player is assigned role `mr_white`.
  - Civilians receive the secret word (e.g., *"Airport"*).
  - Mr. White receives **NO secret word** (`secretWord === undefined`).
  - Mr. White's private reveal card:
    - Badge: `MR. WHITE` (Silver/Pearl mystery theme).
    - Secret Word area: *"You have NO secret word!"*.
    - Instruction: *"Listen carefully to everyone's clues, blend in, and deduce the secret word."*
- **Clue Round**:
  - Mr. White participates in the clue round in normal speaker order, giving vague clues to avoid suspicion without knowing the secret word.
- **Exact Voting Outcome Table**:

| Scenario | Voting Result | Next Phase | Winning Outcome | Description |
| :--- | :--- | :--- | :--- | :--- |
| **1. Civilian Eliminated** | Top votes on a Civilian | `RESULTS` | 🎭 **IMPOSTER WINS** | Mr. White survives; Civilians voted out an innocent. |
| **2. Imposter Eliminated** | Top votes on an Imposter (if present) | `RESULTS` | 🏆 **GROUP WINS** | Group successfully voted out an infiltrator. |
| **3. Voting Tie** | Top votes tied between 2+ players | `RESULTS` | 🎭 **IMPOSTER WINS** | No single player eliminated; ties favor infiltrators. |
| **4. Mr. White Eliminated (Correct Guess)** | Mr. White is single top-voted player | `MR_WHITE_GUESS` $\rightarrow$ `RESULTS` | 🕵️‍♂️ **MR. WHITE WINS** | Mr. White was voted out, but correctly guessed the secret word! |
| **5. Mr. White Eliminated (Wrong Guess)** | Mr. White is single top-voted player | `MR_WHITE_GUESS` $\rightarrow$ `RESULTS` | 🏆 **GROUP WINS** | Mr. White was voted out and failed to guess the secret word. |

- **Strict Guess Phase (`MR_WHITE_GUESS`) & Privacy Rules**:
  - **Secret Word Concealment**: The secret word is **never** shown on the voting screen or in the DOM before Mr. White submits the guess.
  - **Device Hand-Off**: Prominently prompts:
    > *"Pass the device to [Mr. White's Name] for the final guess"* $\rightarrow$ `[ 👁️ I'm Ready to Guess ]`
  - **Private Guess Input**:
    - Header: *"You were voted out! Can you guess the secret word?"*
    - Single clean text input with submit button: `[ 🔒 Submit Final Guess ]`.
  - **Safe Normalized Guess Matching**:
    - **No arbitrary fuzzy matching**.
    - Uses safe normalized string comparison:
      `guess.trim().toLowerCase().replace(/[\s\-_.,'"]/g, '') === target.trim().toLowerCase().replace(/[\s\-_.,'"]/g, '')`
      (e.g., *"Ice Cream"* matches *"icecream"*, *"ice cream"*, *"Ice-Cream"*).
    - Empty or whitespace-only guesses are rejected with an inline validation alert.

---

### B. Undercover Agent Game Mode — Single-Vote Round Model

- **Round Model Consistency**:
  - Phase 3A operates on a consistent **single-vote round model** matching Classic mode.
  - *(Multi-round elimination where all infiltrators must be rooted out across consecutive eliminations is designated as FUTURE functionality).*
- **Role & Word Distribution**:
  - Minimum 4 players. Safe limits: $1 \le \text{undercover} \le \lfloor\text{players}/2\rfloor$.
  - Draw a validated word pair: **Word A** (Civilian) and **Word B** (Undercover) from the same category.
  - Civilians receive Word A (e.g., *"Coffee"*).
  - Undercover player(s) receive Word B (e.g., *"Tea"*).
- **True Stealth Assignment (CRITICAL PRIVACY RULE)**:
  - Undercover players are **NOT** told they are Undercover.
  - Their private reveal card displays:
    - Title: *"YOUR SECRET WORD"*
    - Word: `[Word B]` (e.g., *"Tea"*)
    - Instruction: *"Give subtle clues without saying the secret word directly."*
    - The card displays standard civilian styling. The string `"UNDERCOVER"` is **never** rendered during role reveal.
- **Voting & Exact Win Logic**:
  1. **Highest-voted player is an Undercover** $\rightarrow$ **CIVILIANS WIN** (Civilians successfully identified an infiltrator with a clear majority/plurality).
  2. **Highest-voted player is a Civilian** $\rightarrow$ **UNDERCOVER WINS** (Civilians eliminated one of their own).
  3. **Voting Tie** $\rightarrow$ **UNDERCOVER WINS** (Infiltrators evade consensus).
  4. Multiple Undercover players supported: a single majority/plurality vote against any Undercover counts as a Civilian win for that round.

---

### C. Word Pair Validation System & Word Decks

- **Curated Single Words (250+ entries)**:
  - 6 balanced categories: *Everyday Objects* (50), *Food & Drink* (50), *Animals & Nature* (40), *Movies & Pop Culture* (40), *Places & Travel* (40), *Tech & Gadgets* (30).
  - Clueability $\ge 8$. Zero offensive, trademarked, or culturally confusing words.
  - Difficulty tags: `easy`, `medium`, `hard`.
- **60+ Validated Word Pairs (`wordPairsDatabase.ts`)**:
  - **Pair Validation Requirements**:
    1. **Same category**: Both words must belong to the exact same category.
    2. **Distinct words**: $A \neq B$.
    3. **Similar difficulty**: Both words in a pair have equivalent familiarity.
    4. **Comparable clueability**: Both words share parallel clue avenues.
    5. **No accidental synonyms**: Pairs like *"Couch / Sofa"* are prohibited because clues are 100% identical. Pairs must have nuanced differences (e.g. *"Coffee / Tea"*, *"Pancake / Waffle"*, *"Dolphin / Whale"*, *"Airport / Train Station"*).
    6. **No culturally confusing pairs**: Universal concepts only.
- **Automated Validation Tests**:
  - Automated test iterates through all 60+ pairs: verifies same category, distinct strings, non-empty, and valid difficulty.
  - Duplicate prevention buffer maintains 20+ round uniqueness.

---

### D. Standalone Interactive Word Generator Tool (Phase 3A)

- Standalone utility accessible via navigation (`#word-generator`), teaser link, or direct route.
- **Features**:
  - Category selector (All, Food, Everyday, Animals, Movies, Places, Tech).
  - Difficulty filter (Easy, Medium, Hard).
  - Mode toggle: **Single Word** vs **Paired Words** (for hosts playing physical games).
  - **`📋 Copy Word`** button with visual feedback.
  - **Secret Mode Toggle**: Word blurred by default; tap to peek (prevents nearby players from peeking).
  - **`🎮 Play With This Word`** action: Smoothly scrolls to the top setup card and pre-fills category/word without page reload or layout shift.
  - Zero state pollution: Operates independently of active game session.
  - Semantic SEO headings and descriptive metadata.

---

### E. Mobile-First Ergonomics (375px, 390px, 430px)

- **Screen Wake Lock API (`navigator.wakeLock`)**:
  - Automatically requests screen lock on game start (`ROLE_REVEAL`, `CLUE_ROUND`, `VOTING`, `MR_WHITE_GUESS`).
  - Automatically releases lock on quit to lobby or results.
  - **Graceful Fallback**: If wake lock is denied or unsupported, game continues seamlessly with zero errors.
- **Haptics Fallback (`navigator.vibrate`)**:
  - Subtle vibration on reveal taps and vote confirmations. Gracefully ignored when unsupported.
- **Viewport Layout**:
  - Tested across 375px (iPhone SE), 390px (iPhone 12/13/14), and 430px (Max).
  - Touch targets $\ge 48\text{px} \times 48\text{px}$.

---

### F. Multilingual In-Game Localization & Local Persistence

- **6 Supported Languages**: `en`, `es`, `de`, `fr`, `pt`, `ja`.
- All active game screens, badges, prompts, and Mr. White guess controls consume `useI18n()`.
- Secret words served in native language when language is switched.
- **Local Roster Persistence**: Player names saved in `localStorage` (`imposter_saved_roster`) with 1-tap reset to defaults.

---

## 2. Phase Breakdown

| Priority | Tier | Features Included |
| :--- | :--- | :--- |
| 🔴 **MUST HAVE** | **Phase 3A** | 1. **Mr. White Mode** (Strict outcome logic, single-elimination guess screen, normalized matching, secret word concealed)<br>2. **Undercover Mode** (Single-vote round model, stealth reveal without "UNDERCOVER", configurable count)<br>3. **Word System Expansion** (250+ curated words, 60+ validated word pairs, strict quality rules)<br>4. **Word Generator Tool** (Standalone tool with copy, secret blur, paired mode, direct game link)<br>5. **Mobile Ergonomics & Wake Lock** (Screen awake, haptics, 375/390/430px UX)<br>6. **6-Language Localization** (All active UI + words in `en`, `es`, `de`, `fr`, `pt`, `ja`)<br>7. **Local Party Roster Persistence** (`localStorage` saving with reset defaults)<br>8. **Strict Privacy & State Scrubbing Across All Modes**<br>9. **Phase 3 Automated Test Suite (50+ assertions)** |
| 🟡 **SHOULD HAVE** | **Phase 3B** | 10. **Multi-Round Match Scorekeeper** (Session leaderboard tracking points across rounds)<br>11. **Caught Imposter Word Guess Option** (Classic mode toggle)<br>12. **Synthesized Web Audio Sound Effects** (Zero-network chimes, timer ticks, mute toggle)<br>13. **Custom Word Pack Creator** (Local custom deck input)<br>14. **Enhanced Structured Game Metadata** (Schema.org JSON-LD & OpenGraph) |
| ⚪ **FUTURE** | **Phase 3C / 4** | 15. **Multi-Round Undercover Elimination** (Consecutive rounds until all infiltrators are found)<br>16. **Chaos Mode** (Round modifiers & random party events)<br>17. **Online Multiplayer Architecture Specification** (Spec only, no code) |

---

## 3. Comprehensive Automated Test Plan (50+ Assertions)

The new test suite [`tests/phase3.test.ts`](file:///c:/Users/hinal/OneDrive/Documents/imposter-website/tests/phase3.test.ts) will verify:

1. **Mr. White Mode (10 assertions)**:
   - Exactly 1 Mr. White assigned with `secretWord === undefined`.
   - Civilians receive secret word.
   - Mr. White survives + Civilian eliminated $\rightarrow$ `winner === 'imposter'`.
   - Mr. White survives + Imposter eliminated $\rightarrow$ `winner === 'group'`.
   - Voting tie $\rightarrow$ no player eliminated $\rightarrow$ `winner === 'imposter'`.
   - Mr. White is single eliminated player $\rightarrow$ transitions strictly to `MR_WHITE_GUESS` without revealing secret word.
   - Secret word strictly absent from `MR_WHITE_GUESS` DOM/view state.
   - Correct normalized guess (trim, casing, punctuation) $\rightarrow$ `winner === 'mr_white'`.
   - Wrong normalized guess $\rightarrow$ `winner === 'group'`.
   - Empty/whitespace guess rejected.

2. **Undercover Mode (8 assertions)**:
   - Configurable Undercover count validation ($1 \le k \le \lfloor N/2 \rfloor$).
   - Civilians receive Word A; Undercover receives Word B.
   - Stealth check: Undercover role card DOM does not render `"UNDERCOVER"`.
   - Highest-voted player is Undercover $\rightarrow$ `winner === 'group'`.
   - Highest-voted player is Civilian $\rightarrow$ `winner === 'undercover'`.
   - Voting tie $\rightarrow$ `winner === 'undercover'`.
   - Multi-undercover setup: voting out any Undercover awards `winner === 'group'`.
   - Results screen displays Word A and Word B side-by-side.

3. **Word Pair Validation & Decks (8 assertions)**:
   - 250+ valid words loaded across all 6 categories.
   - 60+ tuned word pairs loaded.
   - All pairs have distinct words ($A \neq B$).
   - All pairs share the exact same category.
   - Difficulty filtering returns valid subsets.
   - Duplicate prevention buffer ensures uniqueness across 20+ rounds.
   - Language-aware word selection works for selected language.
   - Fallback word selection works under restrictive filters.

4. **Privacy & State Scrubbing (6 assertions)**:
   - Classic Mode: word scrubbed on Hide & Pass.
   - Mr. White Mode: word scrubbed on Hide & Pass.
   - Undercover Mode: word scrubbed on Hide & Pass.
   - Voting screen: suspect choice scrubbed before next voter.
   - Game interrupted on refresh: roles/words hidden in memory and DOM.
   - Return to lobby clears active session.

5. **Mobile Ergonomics & Wake Lock Fallback (4 assertions)**:
   - Wake lock requested on game start.
   - Wake lock released on quit to lobby and results.
   - Graceful fallback when `navigator.wakeLock` is undefined.
   - Graceful fallback when `navigator.vibrate` is undefined.

6. **Word Generator Tool (6 assertions)**:
   - Generates valid word matching category.
   - Generates valid word pair in Paired mode.
   - Difficulty filtering works properly.
   - Copy action copies word text.
   - Secret blur toggle obscures word until clicked.
   - Generator operates without mutating game state.

7. **Multilingual Localization (4 assertions)**:
   - Complete dictionary keys in `en`, `es`, `de`, `fr`, `pt`, `ja`.
   - 0 missing or undefined translation keys.
   - Language change updates active game prompts.
   - Mode descriptions translated accurately.

8. **Roster Persistence & Classic Regression (4 assertions)**:
   - Custom player names save to `localStorage`.
   - Saved player names load on fresh app start.
   - Reset roster action restores defaults.
   - Classic mode passes all existing Phase 1 & 2 tests without regression.

**Total Project Assertions**: **30 (Phase 1) + 53 (Phase 2) + 50+ (Phase 3) $\ge 133$ tests**.
