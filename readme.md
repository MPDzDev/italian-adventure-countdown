# The Mysterious Journey

A mysterious journey countdown app for your nieces' visit to Italy on July 20th. The app features a progress bar with a Vespa that shows how much time has passed since the beginning of the year, all in a mystical theme that builds anticipation for a future treasure hunt.

## Features

- Visual progress tracker with an animated Vespa
- Countdown showing exact days until the mysterious adventure begins
- Mystical design with animations and glowing elements
- Responsive design that works on all devices
- Prepared for future treasure hunt implementation

## Deployment Instructions

### Prerequisites

- Node.js and npm installed on your computer
- A GitHub account
- A Netlify account (free tier works great)

### Local Development

1. Clone this repository to your local machine
2. Navigate to the project directory and run `npm install`
3. Start the development server with `npm start`
4. Access the app at http://localhost:3000

### Deploying to Netlify

#### Option 1: Deploy directly from GitHub

1. Push your code to a GitHub repository
2. Log in to your Netlify account
3. Click "New site from Git"
4. Select GitHub and authorize Netlify
5. Select your repository
6. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
7. Click "Deploy site"

#### Option 2: Deploy from your local machine

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Build your project: `npm run build`
3. Deploy to Netlify: `netlify deploy --prod`

## Customization

- To change the target date, edit the `targetDate` variable in `App.js`
- To modify the theme, customize the colors in `App.css`
- To implement the treasure hunt feature, you'll need to expand the existing placeholder

## Future Treasure Hunt Implementation

The app is designed with a placeholder for a future treasure hunt feature. Here are some ideas for implementation:

- Add clues that are revealed as the date approaches
- Create interactive puzzles that unlock parts of a map
- Include a series of riddles that lead to a final treasure
- Implement a virtual "passport" that gets stamped for completing challenges
- Add an interactive map of Italy with hidden clickable areas

## Notes

- The progress bar automatically calculates elapsed time
- The mystical theme sets the stage for an exciting adventure
- The app is designed to build anticipation for your nieces

Enjoy your mysterious Italian adventure!