/**
 * Curated Word Pairs Database for Undercover Mode
 * Meets strict requirements:
 * 1. Same category
 * 2. Distinct words (A != B)
 * 3. Similar difficulty & clueability
 * 4. Nuanced contextual overlap (no pure synonyms like couch/sofa)
 * 5. Universal, family-friendly concepts
 */

import type { WordPair } from '../types/word';

export const SEED_WORD_PAIRS: WordPair[] = [
  // --- Food & Drink (16 pairs) ---
  { id: 'p_coffee_tea', wordA: 'Coffee', wordB: 'Tea', category: 'food', difficulty: 'easy', language: 'en', context: 'Hot morning drinks' },
  { id: 'p_burger_sandwich', wordA: 'Hamburger', wordB: 'Sandwich', category: 'food', difficulty: 'easy', language: 'en', context: 'Breads with fillings' },
  { id: 'p_pancake_waffle', wordA: 'Pancake', wordB: 'Waffle', category: 'food', difficulty: 'easy', language: 'en', context: 'Batter breakfast foods' },
  { id: 'p_butter_margarine', wordA: 'Butter', wordB: 'Margarine', category: 'food', difficulty: 'medium', language: 'en', context: 'Yellow spreads' },
  { id: 'p_cookie_brownie', wordA: 'Cookie', wordB: 'Brownie', category: 'food', difficulty: 'easy', language: 'en', context: 'Sweet baked treats' },
  { id: 'p_orange_lemon', wordA: 'Orange', wordB: 'Lemon', category: 'food', difficulty: 'easy', language: 'en', context: 'Citrus fruits' },
  { id: 'p_sushi_sashimi', wordA: 'Sushi', wordB: 'Sashimi', category: 'food', difficulty: 'medium', language: 'en', context: 'Japanese raw fish dishes' },
  { id: 'p_pizza_flatbread', wordA: 'Pizza', wordB: 'Flatbread', category: 'food', difficulty: 'easy', language: 'en', context: 'Baked dough with toppings' },
  { id: 'p_apple_pear', wordA: 'Apple', wordB: 'Pear', category: 'food', difficulty: 'easy', language: 'en', context: 'Crisp tree fruits' },
  { id: 'p_soup_stew', wordA: 'Soup', wordB: 'Stew', category: 'food', difficulty: 'easy', language: 'en', context: 'Broth and boiled vegetables' },
  { id: 'p_icecream_gelato', wordA: 'Ice Cream', wordB: 'Gelato', category: 'food', difficulty: 'medium', language: 'en', context: 'Cold dairy desserts' },
  { id: 'p_ketchup_mustard', wordA: 'Ketchup', wordB: 'Mustard', category: 'food', difficulty: 'easy', language: 'en', context: 'Condiment bottles' },
  { id: 'p_spaghetti_ramen', wordA: 'Spaghetti', wordB: 'Ramen', category: 'food', difficulty: 'easy', language: 'en', context: 'Long noodle dishes' },
  { id: 'p_coke_pepsi', wordA: 'Cola', wordB: 'Root Beer', category: 'food', difficulty: 'easy', language: 'en', context: 'Fizzy dark sodas' },
  { id: 'p_muffin_cupcake', wordA: 'Muffin', wordB: 'Cupcake', category: 'food', difficulty: 'easy', language: 'en', context: 'Small baked cup treats' },
  { id: 'p_cheese_yogurt', wordA: 'Cheese', wordB: 'Yogurt', category: 'food', difficulty: 'easy', language: 'en', context: 'Fermented dairy products' },

  // --- Everyday Objects (15 pairs) ---
  { id: 'p_backpack_handbag', wordA: 'Backpack', wordB: 'Handbag', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Carrying bags' },
  { id: 'p_sunglasses_glasses', wordA: 'Sunglasses', wordB: 'Eyeglasses', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Frames on face' },
  { id: 'p_pillow_cushion', wordA: 'Pillow', wordB: 'Cushion', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Soft resting padding' },
  { id: 'p_blanket_duvet', wordA: 'Blanket', wordB: 'Duvet', category: 'everyday', difficulty: 'medium', language: 'en', context: 'Bed coverings' },
  { id: 'p_umbrella_raincoat', wordA: 'Umbrella', wordB: 'Raincoat', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Rain gear' },
  { id: 'p_watch_clock', wordA: 'Wristwatch', wordB: 'Wall Clock', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Timekeepers' },
  { id: 'p_candle_flashlight', wordA: 'Candle', wordB: 'Flashlight', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Portable light sources' },
  { id: 'p_boots_sneakers', wordA: 'Boots', wordB: 'Sneakers', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Footwear styles' },
  { id: 'p_pen_pencil', wordA: 'Pen', wordB: 'Pencil', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Writing instruments' },
  { id: 'p_fork_spoon', wordA: 'Fork', wordB: 'Spoon', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Eating utensils' },
  { id: 'p_comb_hairbrush', wordA: 'Comb', wordB: 'Hairbrush', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Hair styling tools' },
  { id: 'p_wallet_purse', wordA: 'Wallet', wordB: 'Coin Purse', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Money holders' },
  { id: 'p_towel_bathrobe', wordA: 'Bath Towel', wordB: 'Bathrobe', category: 'everyday', difficulty: 'easy', language: 'en', context: 'Bathroom dry wear' },
  { id: 'p_mirror_window', wordA: 'Mirror', wordB: 'Window', category: 'everyday', difficulty: 'medium', language: 'en', context: 'Glass panes' },
  { id: 'p_bucket_vase', wordA: 'Bucket', wordB: 'Vase', category: 'everyday', difficulty: 'medium', language: 'en', context: 'Water containers' },

  // --- Animals & Nature (14 pairs) ---
  { id: 'p_butterfly_moth', wordA: 'Butterfly', wordB: 'Moth', category: 'animals', difficulty: 'easy', language: 'en', context: 'Winged insects' },
  { id: 'p_leopard_cheetah', wordA: 'Leopard', wordB: 'Cheetah', category: 'animals', difficulty: 'medium', language: 'en', context: 'Spotted big cats' },
  { id: 'p_dolphin_whale', wordA: 'Dolphin', wordB: 'Whale', category: 'animals', difficulty: 'easy', language: 'en', context: 'Marine mammals' },
  { id: 'p_frog_toad', wordA: 'Frog', wordB: 'Toad', category: 'animals', difficulty: 'easy', language: 'en', context: 'Hopping amphibians' },
  { id: 'p_crocodile_alligator', wordA: 'Crocodile', wordB: 'Alligator', category: 'animals', difficulty: 'medium', language: 'en', context: 'Armored reptiles' },
  { id: 'p_raven_crow', wordA: 'Raven', wordB: 'Crow', category: 'animals', difficulty: 'medium', language: 'en', context: 'Black corvids' },
  { id: 'p_horse_donkey', wordA: 'Horse', wordB: 'Donkey', category: 'animals', difficulty: 'easy', language: 'en', context: 'Equine working animals' },
  { id: 'p_rabbit_hare', wordA: 'Rabbit', wordB: 'Hare', category: 'animals', difficulty: 'medium', language: 'en', context: 'Long-eared mammals' },
  { id: 'p_wasp_bee', wordA: 'Wasp', wordB: 'Bee', category: 'animals', difficulty: 'easy', language: 'en', context: 'Stinging flying insects' },
  { id: 'p_duck_goose', wordA: 'Duck', wordB: 'Goose', category: 'animals', difficulty: 'easy', language: 'en', context: 'Web-footed waterfowl' },
  { id: 'p_turtle_tortoise', wordA: 'Turtle', wordB: 'Tortoise', category: 'animals', difficulty: 'medium', language: 'en', context: 'Shelled reptiles' },
  { id: 'p_seal_sea_lion', wordA: 'Seal', wordB: 'Sea Lion', category: 'animals', difficulty: 'medium', language: 'en', context: 'Coastal pinnipeds' },
  { id: 'p_monkey_ape', wordA: 'Monkey', wordB: 'Chimpanzee', category: 'animals', difficulty: 'easy', language: 'en', context: 'Tree-climbing primates' },
  { id: 'p_penguin_puffin', wordA: 'Penguin', wordB: 'Puffin', category: 'animals', difficulty: 'medium', language: 'en', context: 'Cold-climate seabirds' },

  // --- Places & Travel (12 pairs) ---
  { id: 'p_island_peninsula', wordA: 'Island', wordB: 'Peninsula', category: 'places', difficulty: 'medium', language: 'en', context: 'Land surrounded by water' },
  { id: 'p_airport_trainstation', wordA: 'Airport', wordB: 'Train Station', category: 'places', difficulty: 'easy', language: 'en', context: 'Transit passenger terminals' },
  { id: 'p_hotel_motel', wordA: 'Hotel', wordB: 'Motel', category: 'places', difficulty: 'easy', language: 'en', context: 'Traveler lodging' },
  { id: 'p_desert_beach', wordA: 'Desert', wordB: 'Beach', category: 'places', difficulty: 'easy', language: 'en', context: 'Sandy landscapes' },
  { id: 'p_castle_palace', wordA: 'Castle', wordB: 'Palace', category: 'places', difficulty: 'easy', language: 'en', context: 'Royal grand fortresses' },
  { id: 'p_library_bookstore', wordA: 'Library', wordB: 'Bookstore', category: 'places', difficulty: 'easy', language: 'en', context: 'Rooms of book shelves' },
  { id: 'p_cinema_theater', wordA: 'Movie Theater', wordB: 'Broadway Stage', category: 'places', difficulty: 'easy', language: 'en', context: 'Performance halls with audience' },
  { id: 'p_river_canal', wordA: 'River', wordB: 'Canal', category: 'places', difficulty: 'medium', language: 'en', context: 'Flowing water paths' },
  { id: 'p_zoo_aquarium', wordA: 'Zoo', wordB: 'Aquarium', category: 'places', difficulty: 'easy', language: 'en', context: 'Animal exhibition parks' },
  { id: 'p_bridge_tunnel', wordA: 'Bridge', wordB: 'Tunnel', category: 'places', difficulty: 'easy', language: 'en', context: 'Crossings over or through' },
  { id: 'p_lighthouse_windmill', wordA: 'Lighthouse', wordB: 'Windmill', category: 'places', difficulty: 'medium', language: 'en', context: 'Tall coastal/country towers' },
  { id: 'p_cabin_tent', wordA: 'Log Cabin', wordB: 'Camping Tent', category: 'places', difficulty: 'easy', language: 'en', context: 'Wilderness shelters' },

  // --- Movies & Pop Culture (10 pairs) ---
  { id: 'p_superhero_vigilante', wordA: 'Superhero', wordB: 'Vigilante', category: 'movies', difficulty: 'easy', language: 'en', context: 'Masked crime fighters' },
  { id: 'p_vampire_zombie', wordA: 'Vampire', wordB: 'Zombie', category: 'movies', difficulty: 'easy', language: 'en', context: 'Undead horror monsters' },
  { id: 'p_spaceship_submarine', wordA: 'Spaceship', wordB: 'Submarine', category: 'movies', difficulty: 'easy', language: 'en', context: 'Enclosed vessel explorers' },
  { id: 'p_wizard_magician', wordA: 'Wizard', wordB: 'Stage Magician', category: 'movies', difficulty: 'easy', language: 'en', context: 'Spellcasters with wands' },
  { id: 'p_detective_spy', wordA: 'Detective', wordB: 'Secret Agent', category: 'movies', difficulty: 'easy', language: 'en', context: 'Investigators in trenchcoats' },
  { id: 'p_alien_robot', wordA: 'Alien', wordB: 'Cyborg', category: 'movies', difficulty: 'easy', language: 'en', context: 'Sci-fi non-humans' },
  { id: 'p_pirate_cowboy', wordA: 'Pirate', wordB: 'Cowboy', category: 'movies', difficulty: 'easy', language: 'en', context: 'Outlaws with hats' },
  { id: 'p_knight_samurai', wordA: 'Medieval Knight', wordB: 'Japanese Samurai', category: 'movies', difficulty: 'medium', language: 'en', context: 'Armored honor warriors' },
  { id: 'p_ghost_demon', wordA: 'Haunted Ghost', wordB: 'Underworld Demon', category: 'movies', difficulty: 'medium', language: 'en', context: 'Spiritual entities' },
  { id: 'p_ninja_assassin', wordA: 'Ninja', wordB: 'Hitman', category: 'movies', difficulty: 'easy', language: 'en', context: 'Stealth infiltrators' },

  // --- Tech & Gadgets (9 pairs) ---
  { id: 'p_laptop_tablet', wordA: 'Laptop', wordB: 'Tablet', category: 'tech', difficulty: 'easy', language: 'en', context: 'Portable computers' },
  { id: 'p_headphones_earbuds', wordA: 'Over-Ear Headphones', wordB: 'Wireless Earbuds', category: 'tech', difficulty: 'easy', language: 'en', context: 'Audio ear gear' },
  { id: 'p_keyboard_keypad', wordA: 'Keyboard', wordB: 'Calculator', category: 'tech', difficulty: 'easy', language: 'en', context: 'Button typing boards' },
  { id: 'p_tv_monitor', wordA: 'Smart TV', wordB: 'Computer Monitor', category: 'tech', difficulty: 'easy', language: 'en', context: 'Display screens' },
  { id: 'p_mouse_trackpad', wordA: 'Computer Mouse', wordB: 'Laptop Trackpad', category: 'tech', difficulty: 'easy', language: 'en', context: 'Cursor pointer inputs' },
  { id: 'p_drone_helicopter', wordA: 'Camera Drone', wordB: 'RC Helicopter', category: 'tech', difficulty: 'easy', language: 'en', context: 'Flying rotor toys' },
  { id: 'p_battery_charger', wordA: 'Power Bank', wordB: 'Wall Charger', category: 'tech', difficulty: 'easy', language: 'en', context: 'Phone power accessories' },
  { id: 'p_camera_smartphone', wordA: 'DSLR Camera', wordB: 'Smartphone', category: 'tech', difficulty: 'easy', language: 'en', context: 'Photo shooting devices' },
  { id: 'p_printer_scanner', wordA: 'Paper Printer', wordB: 'Document Scanner', category: 'tech', difficulty: 'easy', language: 'en', context: 'Office paper machines' },

  // --- Challenging & Hard Pairs (Nuanced deduction) ---
  { id: 'p_cilantro_parsley', wordA: 'Cilantro', wordB: 'Parsley', category: 'food', difficulty: 'hard', language: 'en', context: 'Green garnish herbs' },
  { id: 'p_porcelain_ceramic', wordA: 'Porcelain', wordB: 'Ceramic', category: 'everyday', difficulty: 'hard', language: 'en', context: 'Fired clay dishwares' },
  { id: 'p_hare_rabbit', wordA: 'Wild Hare', wordB: 'Pet Rabbit', category: 'animals', difficulty: 'hard', language: 'en', context: 'Long-eared hopping mammals' },
  { id: 'p_fjord_canyon', wordA: 'Fjord', wordB: 'Canyon', category: 'places', difficulty: 'hard', language: 'en', context: 'Steep carved geological valleys' },
  { id: 'p_augmented_virtual', wordA: 'Augmented Reality', wordB: 'Virtual Reality', category: 'tech', difficulty: 'hard', language: 'en', context: 'Immersive digital perception headsets' },
];
