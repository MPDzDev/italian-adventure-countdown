# Treasure Hunt Challenge System

This document outlines how the treasure hunt challenge system works and how to extend it with new challenges.

## Overview

The challenge system consists of:

1. A pirate-themed riddle challenge
2. Antonio's Pizzeria challenge (unlocks 4 months before the journey)
3. A treasure chest that unlocks progressively as challenges are completed
4. An email notification system that alerts you when challenges are completed
5. Alpine Splash Waterpark Word Challenge (Wordle-style game)
6. Coastal Connections (coming soon)

## Components

### 1. Challenge Manager

The `ChallengeManager` component coordinates all challenges and manages the overall flow.

### 2. Pirate Battle

The `PirateBattle` component presents users with 10 riddles themed around Billie Eilish songs and Italian culture.

- **Key Features:**
  - Saves progress in localStorage
  - Tracks battle percentage completion
  - Sends notification when all riddles are solved

### 3. Antonio's Pizzeria Challenge

The `PizzaioloChallenge` component is a multi-step adventure to help Antonio recover his stolen recipes from the pirates.

- **Unlock Timing:**
  - Becomes available 4 months before the July 20th journey
  - Only unlocks after the Pirate Challenge is completed
  - A countdown timer appears on the lock after completing the first challenge

- **Challenge Structure:**
  - **Deciphering the Ransom Note:** Players decode a cryptic message from the pirates
  - **Ingredient Scavenger Hunt:** Find authentic Italian ingredients from a mix of real and fake options
  - **Recipe Reconstruction:** Arrange cooking steps in the correct order using drag-and-drop interface
  - **Secret Ingredient Discovery:** Solve a puzzle to discover the secret family ingredient
  - **Final Challenge:** Complete a series of tasks to recover the full recipe

- **Story Connection to Real Chest:**
  - After recovering Antonio's magical recipes, the digital chest transforms into a real physical chest
  - When the challenge is completed, the CSS-drawn chest is replaced with images of a real treasure chest
  - The chest contains special stickers and items related to the Italian adventure
  - This creates a connection between the digital adventure and physical rewards

### 4. Alpine Splash Waterpark Word Challenge

The `DailyWordlePuzzle` component presents a Wordle-style word guessing game set at the Alpine Splash Waterpark.

- **Key Features:**
  - Daily word puzzles with Italian and adventure-themed words
  - Integrated into the storyline with Antonio and Sofia at the waterpark
  - Rewards for successful completions

### 5. Coastal Connections (Coming Soon)

The `CoastalConnections` component will be a NYT-style Connections game with an Italian coastal theme.

- **Gameplay:**
  - Players sort 16 words into 4 groups of 4, with each group sharing a common theme
  - Categories follow a color-coded difficulty system
  - Italian coastal topics: ships, navigation, fishing, coastal culture, and maritime history
  
- **Ship Building Mechanic:**
  - Each correctly identified connection helps untangle lines or materials needed for ship construction
  - Successfully completed puzzles build different parts of traditional Italian fishing vessels
  - Visual progress as ships take form with each solved puzzle

### 6. Treasure Chest

The `TreasureChest` component visualizes a chest that:
  - Initially appears locked
  - Unlocks when the pirate challenge is completed
  - Can be opened and closed
  - Initially appears empty, but can be filled with items as challenges are completed
  - Will be replaced with photos of a real chest once all challenges are completed

## Email Notifications

The system uses a service like Formspree to send email notifications. To set it up:

1. Create an account at [Formspree](https://formspree.io/)
2. Create a form and get the endpoint URL
3. Update the `FORMSPREE_ENDPOINT` constant in `EmailService.js`

## Adding New Challenges

To add a new challenge:

1. Create a new challenge component following the pattern of `PirateBattle.js`
2. Add it to the `ChallengeManager` component
3. Import the `addTreasureItem` function from `TreasureChest.js`
4. Call this function when the challenge is completed:

```javascript
import { addTreasureItem } from './TreasureChest';

// When challenge is completed
addTreasureItem({
  icon: "🔍", // Emoji or text icon
  name: "Challenge Name Reward",
  description: "Description of the reward and what it means"
});
```

## Future Challenge Ideas

1. **Map Assembly Challenge**
   - Pieces of a map that need to be arranged correctly
   - Could reveal the location of the real-world treasure

2. **Hidden Message Decoder**
   - Encrypted messages that need to be deciphered
   - Each decoded message reveals a clue about the treasure

3. **Beach Exploration Game**
   - Virtual exploration of the beach where the treasure is buried
   - Finding landmarks that will help locate the real treasure

## Data Storage

All challenge state is stored in localStorage with the following keys:

- `pirateRiddleAnswers`: User's answers to pirate riddles
- `pirateRiddleStates`: State of each riddle (correct/incorrect/attempts)
- `pizzaioloChallengeActive`: Whether the pizzaiolo challenge is activated
- `pizzaioloChallengeProgress`: Progress through the pizzaiolo challenge steps
- `treasureChestItems`: Items discovered in the treasure chest
- `completionEmailSent_PirateRiddles`: Flag to prevent duplicate emails
- `completionEmailSent_PizzaioloChallenge`: Flag for pizzaiolo completion notification
- `wordleChallengeActive`: Whether the Wordle challenge is activated
- `wordleDailyProgress`: Daily Wordle game progress
- `showChallenges`: Whether the challenges section is expanded

## Treasure Items Format

When adding items to the treasure chest, use this format:

```javascript
{
  icon: "🔍", // Emoji representation
  name: "Item Name",
  description: "Description of the item and its significance"
}
```

## Real Chest Implementation

The real chest implementation will involve:

1. Taking high-quality photos of the physical chest (both closed and open)
2. Replacing the CSS chest with these photos when all challenges are complete
3. Showing real stickers inside the open chest as the ultimate reward
4. Creating a narrative connection between the digital challenges and the physical items

Enjoy expanding the treasure hunt with more challenges!