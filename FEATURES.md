# Feature Documentation

## 🎯 Core Features

### 1. User Authentication (Page 1)

#### Sign Up Flow
- **Input Fields**:
  - Full Name
  - Email (unique identifier)
  - Department (CS, Engineering, etc.)
  - Campus (Main, North, South, etc.)
  - Password (hashed with bcryptjs)
  - Transport Mode (dropdown)
  - Average Distance per Day (km)
  - Frequency (trips per week)

- **Validation**:
  - Email uniqueness check
  - Password strength requirements
  - All fields required
  - Distance must be positive number

- **On Success**:
  - User created in database
  - Initial transport preferences saved
  - Empty daily records initialized
  - JWT token generated
  - Automatic login and redirect to dashboard

#### Login Flow
- **Input Fields**:
  - Email
  - Password

- **Validation**:
  - User exists check
  - Password verification (bcryptjs)
  - Case-sensitive email

- **On Success**:
  - JWT token issued
  - User data loaded to dashboard
  - Session maintained for 7 days

### 2. Dashboard (Page 2)

#### Profile Card
```
Shows:
- Name
- Email
- Department
- Campus
- Link to edit transport preferences
```

#### Daily Transport Input Card
```
Form Fields:
- Transport Mode (dropdown: Car, Bike, Bus, Bicycle, Walking, EV)
- Distance (km) - must be > 0
- Number of Trips (default 1)

On Submit:
- Validates input
- Calculates emissions
- Calculates points
- Updates user totals
- Shows success message
- Clears form
```

#### Emissions Card
```
Displays:
- Total Emissions (all time) - kg CO₂
- Today's Emissions - kg CO₂
- Weekly Emissions (last 7 days) - kg CO₂
- Monthly Emissions (last 30 days) - kg CO₂

Emission Factors:
- Car: 0.23 kg CO₂/km
- Bike: 0.11 kg CO₂/km
- Bus: 0.05 kg CO₂/km
- EV: 0.05 kg CO₂/km
- Bicycle: 0 kg CO₂/km
- Walking: 0 kg CO₂/km

Calculations:
emissions = distance × factor
```

#### Points & Rewards Card
```
Displays:
- Total Points (all time)
- Today's Points
- Current Streak (days)
- Streak Bonus Points

Point Calculations:
base_points = distance × 0.1
if eco_friendly_mode:
    points = base_points × 1.5
else:
    points = base_points

Streak Bonuses:
- 5+ days: +1 point
- 7+ days: +2 points
- 15+ days: +3 points
- 30+ days: +5 points

Personalized Suggestions:
- Analyzes today's transport mode
- Suggests eco-friendly alternatives
- Shows potential bonus points
- Examples:
  - "Switch to EV → +0.5 bonus points"
  - "Use Bicycle → +0.5 bonus points"
  - "Try Public Transport → +0.5 bonus points"
```

#### Charts & Analytics Card
```
Features:
- Line Chart: Emissions over time
- Bar Chart: Points earned per day
- Time Period Selector: Week / Month / Year

Data Points:
- X-axis: Dates
- Y-axis: Emissions (kg CO₂) / Points
- Color coded for easy reading
- Responsive design for mobile

Calculated Data:
- Only days with records shown
- Zero values for days without records
- Cumulative trends visible
```

#### Leaderboard Card
```
Two Tabs: Department | Campus

Department Leaderboard:
- Rank #1-10
- User Name
- Total Points
- Shows user's position

Campus Leaderboard:
- Rank #1-10
- Department Name
- Total Points
- Shows campus distribution

User Stats Display:
- Your Rank: X of Y
- Your Points: Z
- Medal indicators for top 3

Medals:
- 🥇 Rank 1
- 🥈 Rank 2
- 🥉 Rank 3
```

## 🎮 Gamification System

### Points Calculation Logic
```
FORMULA:
points = (distance × 0.1) × multiplier + streak_bonus

MULTIPLIER:
- Eco-friendly (Walking, Bicycle, EV, Bus): 1.5x
- Other (Car, Bike): 1.0x

STREAK BONUS:
- Track consecutive days with records
- Bonus applies on day 5, 7, 15, 30
- Resets if day is missed

EXAMPLES:
- Walk 5 km: (5 × 0.1) × 1.5 = 0.75 points
- Drive 10 km: (10 × 0.1) × 1.0 = 1.0 point
- Bus 8 km: (8 × 0.1) × 1.5 = 1.2 points
- With 7-day streak: +2 bonus points
```

### Milestone System
```
Milestones (by distance):
- 10 km: "First Steps" → +5 points
- 50 km: "Getting Serious" → +10 points
- 100 km: "Century" → +25 points
- 500 km: "Marathon" → +50 points
- 1000 km: "Legend" → +100 points

Display:
- Pop-up notification when unlocked
- Added to user's total points
- Visible in achievement section
```

## 📊 Data Analytics

### Emissions History
```
Tracks per day:
- Date
- Transport Mode
- Distance
- Emissions (calculated)
- Points (calculated)
- Trips count

Retrievable periods:
- Last 7 days (week view)
- Last 30 days (month view)
- Last 365 days (year view)
```

### User Statistics
```
Profile-level:
- Total emissions (all time)
- Total points (all time)
- Total distance (all time)
- Streak information
- Department ranking
- Campus ranking
```

## 🔄 Real-time Updates

### Auto-refresh
- Dashboard refreshes every 30 seconds
- User can manually trigger refresh
- Charts update with new data
- Leaderboard updates reflect new points

### Immediate Feedback
- Adding record shows success message
- Points update in real-time
- Streak counter updates
- New milestones appear immediately

## 📱 Responsive Design

### Desktop (1024px+)
- 3-column grid layout
- Full-size charts side by side
- Optimal readability

### Tablet (768px - 1023px)
- 2-column grid layout
- Charts stack vertically
- Touch-friendly buttons

### Mobile (< 768px)
- 1-column stack layout
- Full-width cards
- Optimized spacing
- Touch-friendly inputs
- Readable font sizes

## 🔒 Security Features

### Authentication
- Password hashing (bcryptjs)
- JWT token validation
- 7-day token expiry
- Secure token storage in localStorage

### Data Protection
- CORS enabled
- Input validation on backend
- SQL injection prevention
- XSS protection

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/signup
- Body: {name, email, department, campus, password, transport}
- Returns: {token, userId, user}

POST /api/auth/login
- Body: {email, password}
- Returns: {token, userId, user}

GET /api/auth/profile/:userId
- Returns: {name, email, department, campus, totalPoints, totalEmissions}
```

### Dashboard
```
POST /api/dashboard/daily
- Headers: Authorization: Bearer TOKEN
- Body: {mode, distance, trips}
- Returns: {record, userStats}

GET /api/dashboard/dashboard/:userId
- Returns: {profile, todayStats, weeklyEmissions, monthlyEmissions, streak, records}

GET /api/dashboard/emissions-history/:userId?period=week|month|year
- Returns: {date: {emissions, points, distance}}
```

### Leaderboard
```
GET /api/leaderboard/department/:department
- Returns: [{rank, name, totalPoints, totalEmissions, totalDistance}]

GET /api/leaderboard/campus/:campus
- Returns: [{rank, name, totalPoints}]

GET /api/leaderboard/rank/:userId/:department/:campus
- Returns: {userPoints, departmentRank, departmentTotal, campusRank, campusTotal}
```

### Transport
```
POST /api/transport/update
- Headers: Authorization: Bearer TOKEN
- Body: {mode, averageDistance, frequency}
- Returns: {message, transport}

GET /api/transport/:userId
- Returns: {userId, mode, averageDistance, frequency, updatedAt}
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  userId: string,
  name: string,
  email: string,
  department: string,
  campus: string,
  password: string (hashed),
  totalPoints: number,
  totalEmissions: number,
  totalDistance: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Daily Records Collection
```javascript
{
  userId: string,
  records: [
    {
      date: string (YYYY-MM-DD),
      mode: string,
      distance: number,
      trips: number,
      emissions: number,
      points: number,
      createdAt: timestamp
    }
  ]
}
```

### Transport Collection
```javascript
{
  userId: string,
  mode: string,
  averageDistance: number,
  frequency: number,
  updatedAt: timestamp
}
```

## 🎨 UI/UX Features

### Color Scheme
- Primary: #667eea (Purple)
- Secondary: #764ba2 (Dark Purple)
- Accent: #e74c3c (Red for alerts)
- Success: #27ae60 (Green)
- Background: Gradient light blue

### Interactive Elements
- Hover effects on cards
- Smooth transitions
- Loading states
- Success/error messages
- Form validation feedback

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Readable contrast ratios
- Mobile-optimized touch targets

## 📈 Future Enhancement Ideas

1. **Notifications**
   - Daily reminder to log transport
   - Streak milestone notifications
   - New leaderboard rank notifications

2. **Social Features**
   - Share achievements
   - Challenge friends
   - Team competitions

3. **Advanced Analytics**
   - CO₂ offset calculator
   - Carbon credit system
   - Environmental impact reports

4. **Integration**
   - Google Maps integration
   - Waze integration
   - Fitbit/Apple Health data

5. **Mobile App**
   - React Native implementation
   - Push notifications
   - Offline support

6. **Gamification**
   - Badges and achievements
   - Mini-games
   - Rewards marketplace

7. **Reporting**
   - PDF export
   - Excel export
   - Shareable reports
   - Department analytics

8. **Admin Features**
   - User management
   - Leaderboard management
   - Report generation
   - System analytics
