# Campus Carbon Footprint Tracker

A gamified web application for tracking and reducing campus carbon emissions through an engaging points and reward system.

## Features

### 🌍 Core Features
- **User Authentication**: Sign up with name, email, department, campus, and password
- **Daily Transport Logging**: Record daily transport mode, distance, and trips
- **Real-time Dashboard**: View emissions and points with live updates
- **Carbon Emissions Tracking**: Calculate emissions based on transport mode
  - Car: 0.23 kg CO₂/km
  - Bike: 0.11 kg CO₂/km
  - Bus: 0.05 kg CO₂/km
  - EV: 0.05 kg CO₂/km
  - Bicycle/Walking: 0 kg CO₂/km

### ⭐ Gamification
- **Points System**: Eco-friendly transport earns 1.5x bonus points
- **Streaks & Milestones**: Daily streaks unlock bonus points
- **Leaderboards**: Department and campus level rankings
- **Personalized Suggestions**: Smart recommendations for earning more points

### 📊 Analytics
- **Emissions Charts**: Daily, weekly, monthly views
- **Points Tracking**: Visual representation of progress
- **Personal Stats**: Total emissions, distance, and points
- **Comparison Views**: See your performance vs department/campus

## Project Structure

```
.
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/          # Auth and Dashboard pages
│   │   ├── components/     # Reusable components
│   │   ├── utils/          # API calls and helpers
│   │   └── App.jsx         # Main component
│   └── package.json
│
└── server/                  # Node.js backend
    ├── routes/             # API endpoints
    ├── utils/              # Emissions calculation, auth
    ├── firebase.js         # Mock Database Implementation
    ├── server.js           # Express server
    └── package.json
```

## Tech Stack

- **Frontend**: React 18, Chart.js, Axios
- **Backend**: Node.js, Express
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: In-Memory Mock Database (Great for local development/prototyping)
- **Styling**: CSS3 with responsive design

## Installation & Setup

### Quick Setup (Windows)

Simply run the setup script to install all dependencies for both client and server:

```bash
setup.bat
```

### Manual Setup

1.  **Install Application Dependencies**:
    ```bash
    npm run install-all
    ```
    Or install individually:
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```

2.  **Environment Variables**:
    The application comes with default configuration. You can inspect `.env` files in client/server directories if needed.

## Running the Application

You can run both client and server with a single command from the root directory:

```bash
npm run dev
```

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile/:userId` - Get user profile

### Dashboard
- `POST /api/dashboard/daily` - Add daily transport record
- `GET /api/dashboard/dashboard/:userId` - Get dashboard data
- `GET /api/dashboard/emissions-history/:userId` - Get historical data

### Leaderboard
- `GET /api/leaderboard/department/:department` - Department ranking
- `GET /api/leaderboard/campus/:campus` - Campus ranking
- `GET /api/leaderboard/rank/:userId/:department/:campus` - User's rank

## Future Enhancements/Roadmap

- [ ] PDF/Excel export for reports
- [ ] Push notifications for daily reminders
- [ ] Social sharing of achievements
- [ ] Carpooling coordination
- [ ] CO₂ offset carbon credits
- [ ] Mobile app (React Native)
- [ ] Integration with transport apps (Google Maps, Uber, etc.)

## Support

For issues and questions, please open an issue on the GitHub repository.

## License
MIT License
