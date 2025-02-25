# Treasure Hunt Challenge System

This document outlines how the treasure hunt challenge system works and how to extend it with new challenges.

## Overview

The challenge system consists of:

1. A pirate-themed riddle challenge
2. A treasure chest that unlocks when the pirate challenge is completed
3. An email notification system that alerts you when challenges are completed

## Components

### 1. Challenge Manager

The `ChallengeManager` component coordinates all challenges and manages the overall flow.

### 2. Pirate Battle

The `PirateBattle` component presents users with 10 riddles themed around Billie Eilish songs and Italian culture.

- **Key Features:**
  - Saves progress in localStorage
  - Tracks battle percentage completion
  - Sends notification when all riddles are solved

### 3. Treasure Chest

The `TreasureChest` component visualizes a chest that:
  - Initially appears locked
  - Unlocks when the pirate challenge is completed
  - Can be opened and closed
  - Initially appears empty, but can be filled with items as challenges are completed

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
- `treasureChestItems`: Items discovered in the treasure chest
- `completionEmailSent_PirateRiddles`: Flag to prevent duplicate emails
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

Enjoy expanding the treasure hunt with more challenges!