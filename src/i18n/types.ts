/**
 * i18n Localization Schema Types
 */

export type SupportedLanguage = 'en' | 'es' | 'de' | 'fr' | 'pt' | 'ja';

export interface LanguageInfo {
  code: SupportedLanguage;
  label: string;
  flag: string;
}

export interface TranslationSchema {
  nav: {
    howToPlay: string;
    gameModes: string;
    wordGenerator: string;
    blog: string;
    language: string;
  };
  hero: {
    brand: string;
    title: string;
    subtitle: string;
    tagline: string;
  };
  gameSetup: {
    playersTitle: string;
    playersSubtitle: string;
    addPlayer: string;
    playerPlaceholder: string;
    minPlayersWarning: string;
    maxPlayersWarning: string;
    settingsTitle: string;
    gameMode: string;
    category: string;
    imposters: string;
    impostersSingle: string;
    impostersPlural: string;
    roundTime: string;
    roundMinutes: string;
    roundUnlimited: string;
    startGame: string;
    readyNotice: string;
    comingSoon: string;
  };
  categories: {
    random: string;
    randomDesc: string;
    everyday: string;
    everydayDesc: string;
    food: string;
    foodDesc: string;
    animals: string;
    animalsDesc: string;
    movies: string;
    moviesDesc: string;
    places: string;
    placesDesc: string;
  };
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  modes: {
    badge: string;
    title: string;
    subtitle: string;
    classicTitle: string;
    classicDesc: string;
    undercoverTitle: string;
    undercoverDesc: string;
    mrWhiteTitle: string;
    mrWhiteDesc: string;
    chaosTitle: string;
    chaosDesc: string;
  };
  wordGeneratorTeaser: {
    badge: string;
    title: string;
    subtitle: string;
    previewPrompt: string;
    generateButton: string;
    ctaButton: string;
  };
  blogTeaser: {
    badge: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Category: string;
    card1ReadTime: string;
    card2Title: string;
    card2Category: string;
    card2ReadTime: string;
    card3Title: string;
    card3Category: string;
    card3ReadTime: string;
    viewAll: string;
  };
  footer: {
    disclaimer: string;
    rights: string;
    instantPlay: string;
    privacy: string;
    terms: string;
  };
  inGame: {
    passDevice: string;
    tapToReveal: string;
    hideAndPass: string;
    clueRound: string;
    secretVoting: string;
    confirmVote: string;
    mrWhiteGuess: string;
    submitGuess: string;
    groupWins: string;
    imposterWins: string;
    mrWhiteWins: string;
    undercoverWins: string;
    playAgain: string;
    changeSettings: string;
  };
}
