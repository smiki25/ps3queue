# 🎮 Extremen Gaming - PlayStation Discovery Queue

This is a React application that mimics the Steam Discovery Queue for PlayStation games (PS1, PS2, PS3, and Vita), using **100% live data** from the RAWG Video Games Database API.

## Setup Instructions (for Windows with PowerShell)

1.  **Clone the repository:**
    ```powershell
    git clone <repository-url>
    cd ps3queue
    ```

2.  **Install dependencies:**
    ```powershell
    npm install
    ```

3.  **Set up your RAWG API Key:**
    -   Visit [RAWG API Documentation](https://rawg.io/apidocs) and click "Get API Key"
    -   Sign up for a free account (no credit card required)
    -   Copy your API key from the dashboard
    -   Create a new file named `.env` in the root of the project
    -   Add the following line to the `.env` file, replacing `YOUR_API_KEY_HERE` with your actual API key:
        ```
        REACT_APP_RAWG_KEY=YOUR_API_KEY_HERE
        ```

4.  **Run the application:**
    ```powershell
    npm start
    ```
    This will start the development server and open the application in your default browser at `http://localhost:3000`.

## Features
-   **Pure API Experience**: 100% live data from RAWG's 500,000+ game database (no JSON fallbacks)
-   **Multi-Platform Support**: PlayStation 1, PlayStation 2, PlayStation 3, and PlayStation Vita
-   **Smart Recommendations**: Advanced AI-powered recommendation engine that learns from your preferences
-   **Mobile-First Design**: Fully responsive interface optimized for phones, tablets, and desktop
-   **Touch-Friendly Interface**: Large buttons, smooth gestures, and mobile-optimized interactions
-   **Comprehensive Game Info**: Real-time game data with screenshots, genres, platform, release date, developer, and descriptions
-   **Wishlist System**: Save games you're interested in with persistent storage
-   **Behavioral Learning**: The system learns from your "Hell nah", "Add to wishlist", and "Next game" interactions
-   **Intelligent Caching**: 24-hour cache system with localStorage persistence to optimize API usage
-   **Enhanced Error Handling**: Clear setup instructions when API key is missing
-   **Production Ready**: Optimized for Vercel deployment with automatic scaling

## How It Works
1. **Choose Your Platforms**: Select from PlayStation 1, PlayStation 2, PlayStation 3, and PlayStation Vita
2. **Start the Queue**: Begin discovering games tailored to your preferences from RAWG's live database
3. **Rate Games**: Use the three action buttons:
   - **"Hell nah"**: Reject games you don't like (teaches the system your dislikes)
   - **"Add to wishlist"**: Save games you're interested in (teaches the system your likes)
   - **"Next game"**: Skip without rating (neutral action)
4. **Get Better Recommendations**: The AI learns from your behavior and improves suggestions over time

## Tech Stack
-   **Frontend**: React with Hooks and Context API
-   **Styling**: Tailwind CSS with custom color scheme
-   **Animations**: Framer Motion for smooth transitions
-   **API**: RAWG Video Games Database API
-   **HTTP Client**: Axios
-   **State Management**: React Context with localStorage persistence
-   **Recommendation Engine**: Custom content-based filtering with behavioral modeling

## API Information
This app uses the [RAWG Video Games Database API](https://rawg.io/apidocs), which provides:
- 500,000+ games database
- High-quality screenshots and artwork
- Comprehensive game metadata
- Free tier with 20,000 requests per month
- No credit card required for signup

## 🚀 Deployment

This app is optimized for easy deployment on Vercel:

1. **Push to GitHub**: Commit your code to a GitHub repository
2. **Deploy to Vercel**: 
   - Go to [vercel.com](https://vercel.com) and import your repository
   - Add environment variable: `REACT_APP_RAWG_KEY=your_api_key`
   - Click Deploy!
3. **Live in minutes**: Your app will be available worldwide with automatic scaling

See `DEPLOYMENT.md` for detailed deployment instructions.

## Troubleshooting
- **"RAWG API key missing" error**: Make sure you've created a `.env` file with your API key
- **Games not loading**: Check your internet connection and API key validity
- **Slow loading**: The app fetches real data from RAWG API, initial load may take a few seconds
- **No games showing**: Try resetting your data using the "Reset Data" button

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
