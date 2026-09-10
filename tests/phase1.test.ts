/**
 * Automated Verification Suite for Phase 1
 */

import {
  createDefaultPlayers,
  createNewPlayer,
  resolveDuplicateName,
  validatePlayerName,
  sanitizePlayerName,
} from '../src/game/state/playerUtils';
import { wordEngine } from '../src/game/words/wordEngine';
import { enTranslations, translations } from '../src/i18n/translations';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

console.log('=== RUNNING PHASE 1 AUTOMATED VERIFICATION ===\n');

// 1. Default Players
const defaults = createDefaultPlayers();
assert(defaults.length === 3, 'Default player count is exactly 3');
assert(defaults[0].name === 'Player 1', 'Player 1 initialized correctly');
assert(defaults[1].name === 'Player 2', 'Player 2 initialized correctly');
assert(defaults[2].name === 'Player 3', 'Player 3 initialized correctly');

// 2. Add Player
const fourPlayers = [...defaults, createNewPlayer(defaults)];
assert(fourPlayers.length === 4, 'Successfully added 4th player');
assert(fourPlayers[3].name === 'Player 4', '4th player auto-named Player 4');

// 3. Name Sanitization & Validation
assert(sanitizePlayerName('   Alex   ') === 'Alex', 'Trim whitespace from name');
assert(sanitizePlayerName('Alex    Smith') === 'Alex Smith', 'Collapse multi-space to single space');
assert(validatePlayerName('A').isValid === false, 'Reject 1-character name');
assert(validatePlayerName('Alex').isValid === true, 'Accept 4-character name');
assert(validatePlayerName('A'.repeat(21)).isValid === false, 'Reject > 20 characters name');
assert(validatePlayerName('A'.repeat(20)).isValid === true, 'Accept 20 characters name');

// 4. International Characters
const intlNames = ['Zoë', 'René', 'Søren', '太郎', '김민수', 'Иван', '🎉 Player'];
for (const name of intlNames) {
  assert(validatePlayerName(name).isValid === true, `Validates international name "${name}"`);
}

// 5. Duplicate Name Handling
const playersWithAlex = [
  { id: '1', name: 'Alex', isCustomName: true, avatarColor: '#8B5CF6' },
  { id: '2', name: 'Sofia', isCustomName: true, avatarColor: '#EC4899' },
];
const dupe1 = resolveDuplicateName('Alex', playersWithAlex);
assert(dupe1 === 'Alex 2', 'Resolves first duplicate "Alex" to "Alex 2"');

const playersWithTwoAlexes = [
  ...playersWithAlex,
  { id: '3', name: 'Alex 2', isCustomName: true, avatarColor: '#06B6D4' },
];
const dupe2 = resolveDuplicateName('Alex', playersWithTwoAlexes);
assert(dupe2 === 'Alex 3', 'Resolves second duplicate "Alex" to "Alex 3"');

// 6. Word Engine
const foodWords = wordEngine.filterWords('food');
assert(foodWords.length >= 8, 'Word engine filters food category correctly');
assert(foodWords.every((w) => w.category === 'food'), 'All filtered words belong to food category');

const randomWord1 = wordEngine.getRandomWord('food');
assert(Boolean(randomWord1 && randomWord1.word), 'Generates valid random word');
assert(randomWord1.category === 'food', 'Generated word matches category');

// 7. i18n Translations
assert(enTranslations.gameSetup.startGame === 'START GAME', 'English translation for START GAME exists');
assert(translations.es.gameSetup.startGame === 'INICIAR PARTIDA', 'Spanish translation exists');
assert(translations.fr.gameSetup.startGame === 'LANCER LA PARTIE', 'French translation exists');
assert(translations.de.gameSetup.startGame === 'SPIEL STARTEN', 'German translation exists');
assert(translations.ja.gameSetup.startGame === 'ゲームを始める', 'Japanese translation exists');

console.log(`\n========================================`);
console.log(`SUMMARY: ${passedTests} / ${totalTests} tests passed.`);
console.log(`========================================\n`);
