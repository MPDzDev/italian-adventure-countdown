# Italian Adventure Countdown

A fun treasure hunt app that counts down to your nieces' visit to Italy on July 20th. The app features a progress bar with a cute Vespa that shows how much time has passed since the beginning of the year, as well as daily Italian trivia facts.

## Features

- Visual progress tracker with an animated Vespa
- Countdown showing exact days until the visit
- Daily Italian trivia that changes each day
- Responsive design that works on all devices
- List of places to explore in Italy

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
- To add or modify trivia facts, edit the `italyTrivia.js` file
- To customize the design, modify the `App.css` file

## Notes

- The progress bar automatically calculates elapsed time
- Trivia facts rotate daily based on the current date
- The app is designed to be engaging for children while they wait for their trip

Enjoy your Italian adventure with your nieces!
