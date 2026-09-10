# Implementation Plan — Phase 2: Actual Classic Imposter Game

Turn the existing Classic Imposter mode into a fully playable local/pass-the-phone party game on imposter.website while preserving the approved Phase 1 / Phase 1.5 homepage design, architecture, and styling.

---

## 1. Core Principles & Privacy Guarantees

- **Zero Network Dependency / Local Pass-the-Phone**:
  Classic mode runs entirely on the shared device. Role reveals and voting use an intentional **two-step pass-and-confirm privacy pattern** (*"Pass phone to [Player]"* $\rightarrow$ *[I'm Ready]* $\rightarrow$ *View/Vote* $\rightarrow$ *[Hide & Pass]*), ensuring no player's role or vote is ever accidentally exposed to others.

- **Immediate Role Clearance**:
  When a player taps **"Hide & Pass Phone"**, the active visible role and secret word are immediately scrubbed from the active view state before displaying the next player's pass screen. No sensitive game information remains rendered in visible DOM elements between turns.

- **Accidental Refresh / Safe Recovery Screen**:
  If the page is refreshed or reloaded during an active round (`ROLE_REVEAL`, `CLUE_ROUND`, or `VOTING`), the game does **NOT** expose assigned roles or secret words. Instead, it displays a clean, secure recovery state:
  > **Game Interrupted**  
  > *"An active game was interrupted by a page refresh. Roles and secret words are kept hidden for fairness."*  
  > `[ Return to Lobby ]`  
  This provides safe, non-leaking recovery back to `PLAYER_SETUP`.

- **Preserving Phase 1 / 1.5 Architecture**:
  - The homepage layout, desktop 2-column composition, mobile compactness, tokens, and below-the-game sections remain intact.
  - When `phase === 'PLAYER_SETUP'`, the homepage displays the approved setup card.
  - When `START GAME` is triggered, the central stage transitions into the active game experience (`ROLE_REVEAL` $\rightarrow$ `CLUE_ROUND` $\rightarrow$ `VOTING` $\rightarrow$ `RESULTS`) with an in-app "Quit to Lobby" safety confirmation.

---

## 2. Core Game Loop & State Transitions

```
LOBBY / PLAYER_SETUP (Homepage)
  ↓ START GAME (Validate & Assign Roles, Pick Word)
ROLE_REVEAL (Pass phone 1..N: Tap to Reveal → View → Hide & Scrub State)
  ↓ All roles viewed
CLUE_ROUND (Speaker order, countdown timer, verbal clues, advance speaker)
  ↓ Timer zero / Skip to Voting
VOTING (Secret pass-phone ballot 1..N: Tap to vote → Select suspect → Confirm → Scrub)
  ↓ All votes cast
RESULTS (Reveal Imposter, Secret Word, Vote counts, Winner calculation)
  ↓
PLAY AGAIN (Fresh word & roles, same players) OR CHANGE SETTINGS (Back to Lobby)
```

---

## 3. Detailed Phase Specifications

### A. Role Assignment & Validation (`START_GAME`)
- Validate minimum 3 players, valid imposter count ($1 \le \text{imposters} \le \lfloor\text{players}/2\rfloor$).
- Draw secret word from `WordEngine.getRandomWord(category)` using selected category.
- Uniformly shuffle player indices to select imposter(s).
- Assign `secretWord` to civilians; assign `undefined` to imposters.
- Initialize `currentRevealIndex = 0`, `isRoleCardRevealed = false`.
- Set session flag `active_game_in_progress = true` in memory / sessionStorage for recovery protection.

### B. Role Reveal (`ROLE_REVEAL`) — Critical Privacy & Scrubbing
1. **Pass Screen**:
   - Prominently displays: *"Pass the phone to [Player Name]"*.
   - Privacy instruction: *"Make sure only you can see the screen."*
   - Button: `[ 👁️ I'm Ready — Tap to Reveal ]`.
   - **Privacy Rule**: During this screen, the role and secret word are completely hidden.
2. **Revealed Role Card**:
   - **Civilian**:
     - Badge: `CIVILIAN` (Cyan/Violet accent)
     - Secret Word: `[SECRET WORD]` (Large, bold, high-contrast)
     - Instruction: *"Give subtle clues without saying the secret word directly."*
   - **Imposter**:
     - Badge: `IMPOSTER` (Reserved Crimson/Pink accent)
     - Secret Word: **Hidden** (*"You did not receive the secret word."*)
     - Instruction: *"Listen carefully to everyone's clues, blend in, and figure out the word."*
   - Button: `[ 🔒 Hide & Pass Phone ]`.
3. **Scrubbing on Hide**:
   - Tapping *"Hide & Pass Phone"* immediately sets `isRoleCardRevealed = false` and advances `currentRevealIndex`.
   - Progression continues for all players $1 \dots N$. After player $N$, automatically transitions to `CLUE_ROUND`.

### C. Clue Round (`CLUE_ROUND`)
- Header: *"CLUE ROUND — Give one-word clues"*
- Visual speaker order list with current speaker highlighted (e.g. `1. Alex` $\rightarrow$ `2. Sofia` $\rightarrow$ `3. Liam` $\rightarrow$ `4. Yuki`).
- Active Speaker Controls: `[ Next Speaker → ]` to advance the speaking turn indicator.
- Countdown Timer:
  - Formats remaining time `MM:SS` from configured round time (1, 2, 3, 5 mins, or "Unlimited").
  - Clean interval timer with automatic cleanup on unmount/phase change.
  - Pause / Resume button.
  - When timer reaches `00:00`, automatically transitions to voting.
- Immediate action: `[ 🗳️ Proceed to Voting ]`.

### D. Secret Voting (`VOTING`) — Vote Privacy
- Pass-the-phone secret ballot so no player sees previous votes:
  1. *"Pass the phone to [Player Name] to vote"* $\rightarrow$ `[ I'm Ready ]`.
  2. Radio list of all other players as suspects.
  3. Single selection enforcement.
  4. `[ Confirm Vote ]`.
  5. Upon confirmation, the selected vote is stored in state, the active selection is cleared from the view, and the screen prompts to hand off to the next player.
- Votes stored in `votes: Record<string, string>` (voterId $\rightarrow$ suspectId).
- After player $N$ confirms vote, transitions to `RESULTS`.

### E. Results & Exact Win Conditions (`RESULTS`)
- **Tallying Logic**:
  - Calculate total votes received by each player.
  - Find the highest vote count: $V_{\max} = \max(\text{votes})$.
  - Find all players receiving $V_{\max}$: `topSuspects`.
- **Exact Win Conditions**:
  1. **Tie Rule**: If `topSuspects.length > 1` (a tie for highest votes), there is no single eliminated player $\rightarrow$ **IMPOSTER WINS** (do not randomly break ties).
  2. **Single Suspect Eliminated**: If `topSuspects.length === 1`:
     - If the eliminated player is an Imposter $\rightarrow$ **GROUP WINS** (Emerald green victory banner).
     - If the eliminated player is a Civilian $\rightarrow$ **IMPOSTER WINS** (Crimson red victory banner).
- **Multiple Imposters Support**:
  - Regardless of imposter count (1, 2, or more), the same rule applies: the group must successfully identify and eliminate an Imposter with a clear majority/plurality to achieve **GROUP WINS**. A tie or voting out a civilian results in **IMPOSTER WINS**.
- **Dramatic Reveal Screen**:
  - Imposter Reveal: `🎭 The Imposter was [Player Name]` (or lists all actual imposters if multiple).
  - Secret Word: `🔐 Secret Word: [Word]`.
  - Vote Breakdown: Graphic card displaying votes cast for each player.
  - Clear Winner Banner (**GROUP WINS** or **IMPOSTER WINS**).
- **Post-Game Actions**:
  - `[ 🔄 Play Again ]`: Keeps player roster and settings, draws fresh secret word from WordEngine, re-randomizes imposter assignment, resets votes/timers, and navigates directly to `ROLE_REVEAL`.
  - `[ ⚙️ Change Settings ]`: Returns to `PLAYER_SETUP` with existing players and settings preserved so players can adjust categories or counts.

---

## 4. Architecture & File Plan

### Game State & Types
#### [MODIFY] [src/game/types/gameState.ts](file:///c:/Users/hinal/OneDrive/Documents/imposter-website/src/game/types/gameState.ts)
- Add state models:
  ```ts
  export interface RevealState {
    currentRevealIndex: number;
    isRevealed: boolean;
  }

  export interface ClueState {
    activeSpeakerIndex: number;
    remainingSeconds: number;
    isPaused: boolean;
  }

  export interface VotingState {
    currentVoterIndex: number;
    isReadyToVote: boolean;
    selectedSuspectId: string | null;
    votes: Record<string, string>; // voterId -> suspectId
  }

  export interface ResultsState {
    winner: 'group' | 'imposter';
    voteCounts: Record<string, number>;
    mostVotedPlayerIds: string[];
    isTie: boolean;
    actualImposterIds: string[];
  }
  ```
- Add action types:
  `TOGGLE_REVEAL_ROLE`, `NEXT_REVEAL_PLAYER`, `NEXT_SPEAKER`, `TICK_CLUE_TIMER`, `TOGGLE_TIMER_PAUSE`, `SKIP_TO_VOTING`, `SET_VOTER_READY`, `SET_SELECTED_SUSPECT`, `CONFIRM_VOTE`, `CALCULATE_RESULTS`, `PLAY_AGAIN`, `QUIT_TO_LOBBY`, `RESET_INTERRUPTED_GAME`.

#### [MODIFY] [src/game/state/gameContext.tsx](file:///c:/Users/hinal/OneDrive/Documents/imposter-website/src/game/state/gameContext.tsx)
- Reducer updates for all Phase 2 transitions.
- Win condition calculator strictly implementing:
  - If tie $\rightarrow$ Imposter wins.
  - If single top suspect is Imposter $\rightarrow$ Group wins.
  - Else $\rightarrow$ Imposter wins.
- Accidental refresh handling: check sessionStorage on mount; if active game was interrupted, set `isInterrupted = true` and show safe recovery screen without disclosing roles.

---

### UI Components for Active Game Phases
#### [NEW] [src/components/game-active/ActiveGameContainer.tsx](file:///c:/Users/hinal/OneDrive/Documents/imposter-website/src/components/game-active/ActiveGameContainer.tsx) & `.css`
- Top bar with round indicator, current phase badge, and a safe `[ ✕ Quit ]` button with confirmation modal.
- Switches between `RoleRevealPhase`, `ClueRoundPhase`, `VotingPhase`, and `ResultsPhase`.
- Renders `InterruptedRecoveryScreen` if refreshed during play.

#### [NEW] [src/components/game-active/RoleRevealPhase.tsx](file:///c:/Users/hinal/OneDrive/Documents/imposter-website/src/components/game-active/RoleRevealPhase.tsx) & `.css`
- Two-step pass-and-confirm screen.
- Distinct Civilian vs Imposter role cards.
- Immediate state scrubbing upon tapping *"Hide & Pass Phone"*.

#### [NEW] [src/components/game-active/ClueRoundPhase.tsx](file:///c:/Users/hinal/OneDrive/Documents/imposter-website/src/components/game-active/ClueRoundPhase.tsx) & `.css`
- Speaker order highlighting active speaker.
- Digital countdown timer (`MM:SS`), pause/resume toggle.
- `[ Next Speaker → ]` and `[ 🗳️ Proceed to Voting ]` actions.

#### [NEW] [src/components/game-active/VotingPhase.tsx](file:///c:/Users/hinal/OneDrive/Documents/imposter-website/src/components/game-active/VotingPhase.tsx) & `.css`
- Secret pass-phone ballot per player.
- Radio suspect selection.
- Confirmation and immediate screen scrubbing.

#### [NEW] [src/components/game-active/ResultsPhase.tsx](file:///c:/Users/hinal/OneDrive/Documents/imposter-website/src/components/game-active/ResultsPhase.tsx) & `.css`
- Dramatic Imposter reveal and secret word card.
- Vote distribution table/bars.
- Clear outcome banner (**GROUP WINS** or **IMPOSTER WINS**).
- Actions: `[ 🔄 Play Again ]` and `[ ⚙️ Change Settings ]`.

#### [NEW] [src/components/game-active/QuitConfirmModal.tsx](file:///c:/Users/hinal/OneDrive/Documents/imposter-website/src/components/game-active/QuitConfirmModal.tsx)
- Accessible confirmation dialog to prevent accidental quitting.

#### [MODIFY] [src/components/game-setup/GameSetupCard.tsx](file:///c:/Users/hinal/OneDrive/Documents/imposter-website/src/components/game-setup/GameSetupCard.tsx)
- Render `ActiveGameContainer` when `phase !== 'PLAYER_SETUP'`, keeping homepage intact when in lobby.

---

## 5. Comprehensive Automated Test Plan (`tests/phase2.test.ts`)

Add a dedicated test suite with 30+ assertions:
1. **Validation & Role Assignment**:
   - Exactly configured number of Imposters assigned.
   - All Civilians receive identical word from WordEngine.
   - Imposter receives no word (`undefined`).
   - Fair random distribution across players.
   - Multiple Imposters correctly assigned and validated.
2. **Role Reveal Privacy & Scrubbing**:
   - Role and word are hidden before tap.
   - Revealing shows correct role.
   - Tapping hide immediately clears role/word state before next player.
   - Final player advances to `CLUE_ROUND`.
3. **Clue Round & Timer**:
   - Initialized with configured round time in seconds.
   - Timer ticks down accurately and stops at zero without negative values.
   - Speaker order cycles correctly.
4. **Secret Voting**:
   - Each player votes in private isolation.
   - Disallows voting without selection.
   - Accurately tallies votes in state.
5. **Exact Win Conditions**:
   - Single top vote on Imposter $\rightarrow$ **GROUP WINS**.
   - Single top vote on Civilian $\rightarrow$ **IMPOSTER WINS**.
   - **Tie Rule**: Highest vote tie $\rightarrow$ **IMPOSTER WINS** (explicit tie check).
   - Multiple imposters: single top vote on an Imposter $\rightarrow$ **GROUP WINS**; tie or civilian $\rightarrow$ **IMPOSTER WINS**.
6. **Play Again & Change Settings**:
   - Play Again resets votes, timers, speakers, assigns a new secret word, and freshly randomizes imposters.
   - Change Settings returns to lobby with roster preserved.
7. **Refresh Recovery**:
   - Interrupted game sets recovery state without leaking assigned roles or secret words.

---

## 6. Verification Steps
- `npm test` runs all tests in `tests/phase1.test.ts` and `tests/phase2.test.ts`.
- `npm run build` verifies clean TypeScript compilation and asset bundling.
- Verify that Phase 1 / 1.5 homepage design and styling remain untouched.
