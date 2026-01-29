# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER BROWSER                                 │
│                    (React Frontend)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────┐    ┌──────────────────┐                   │
│   │ AUTH PAGE       │    │ DASHBOARD PAGE   │                   │
│   │ (Page 1)        │    │ (Page 2)         │                   │
│   │                 │    │                  │                   │
│   │ • Sign Up       │    │ • Profile Card   │                   │
│   │ • Login         │    │ • Daily Input    │                   │
│   │ • Validation    │    │ • Emissions      │                   │
│   │ • JWT Token     │    │ • Points         │                   │
│   │                 │    │ • Leaderboards   │                   │
│   │                 │    │ • Charts         │                   │
│   └─────────────────┘    └──────────────────┘                   │
│                                                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │        AXIOS HTTP CLIENT (API Calls)                     │  │
│   │  Authorization: Bearer JWT Token                         │  │
│   └──────────────────────────────────────────────────────────┘  │
│                         │                                         │
└─────────────────────────┼─────────────────────────────────────────┘
                          │ HTTP/REST
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND SERVER (Node.js + Express)                  │
│                  Port: 5000                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    ROUTES / API ENDPOINTS                │   │
│  │                                                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ AUTH ROUTES  │  │ DASHBOARD    │  │ LEADERBOARD  │   │   │
│  │  │              │  │ ROUTES       │  │ ROUTES       │   │   │
│  │  │ POST /signup │  │              │  │              │   │   │
│  │  │ POST /login  │  │ POST /daily  │  │ GET /dept    │   │   │
│  │  │ GET /profile │  │ GET /dash    │  │ GET /campus  │   │   │
│  │  └──────────────┘  │ GET /history │  │ GET /rank    │   │   │
│  │                    └──────────────┘  └──────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────┐                                        │   │
│  │  │ TRANSPORT    │                                        │   │
│  │  │ ROUTES       │                                        │   │
│  │  │              │                                        │   │
│  │  │ POST /update │                                        │   │
│  │  │ GET /:userId │                                        │   │
│  │  └──────────────┘                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────▼──────────────────────────────────┐   │
│  │              UTILITY FUNCTIONS                           │   │
│  │                                                           │   │
│  │  ┌──────────────────┐      ┌────────────────────────┐  │   │
│  │  │ EMISSIONS        │      │ AUTH MIDDLEWARE        │  │   │
│  │  │                  │      │                        │  │   │
│  │  │ • Calculate CO₂  │      │ • JWT Verification    │  │   │
│  │  │ • Apply Factors  │      │ • Token Validation    │  │   │
│  │  │ • Factor: Car    │      │ • Session Management  │  │   │
│  │  │ • Factor: Bus    │      │ • Secure Endpoints    │  │   │
│  │  │ • Calculate Pts  │      │                        │  │   │
│  │  │ • Streaks/Bonus  │      │ • bcryptjs Password   │  │   │
│  │  │                  │      │   Hashing             │  │   │
│  │  └──────────────────┘      └────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         │                                        │
└─────────────────────────┼────────────────────────────────────────┘
                          │ Firestore/Database API
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│            FIREBASE FIRESTORE DATABASE                           │
│                    (Data Layer)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ USERS            │  │ DAILY_RECORDS    │  │ TRANSPORT    │  │
│  │ COLLECTION       │  │ COLLECTION       │  │ COLLECTION   │  │
│  │                  │  │                  │  │              │  │
│  │ Document:        │  │ Document:        │  │ Document:    │  │
│  │ ├─ userId        │  │ ├─ userId        │  │ ├─ userId    │  │
│  │ ├─ name          │  │ ├─ records: [    │  │ ├─ mode      │  │
│  │ ├─ email         │  │ │  ├─ date       │  │ ├─ distance  │  │
│  │ ├─ department    │  │ │  ├─ mode       │  │ ├─ frequency │  │
│  │ ├─ campus        │  │ │  ├─ distance   │  │ ├─ updated   │  │
│  │ ├─ password      │  │ │  ├─ emissions  │  │ └─ At        │  │
│  │ ├─ totalPoints   │  │ │  ├─ points     │  │              │  │
│  │ ├─ totalEmissions│  │ │  └─ trips      │  │ (User's      │  │
│  │ ├─ totalDistance │  │ │  ]             │  │  current     │  │
│  │ └─ createdAt     │  │ └─ At            │  │  transport   │  │
│  │                  │  │                  │  │  preferences)│  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Sign Up Flow
```
┌─────────┐      Fill Form        ┌─────────────┐
│  User   │─────────────────────→ │ Auth Page   │
└─────────┘                       │ (Frontend)  │
   ▲                              └──────┬──────┘
   │                                     │
   │                               Validate Input
   │                                     │
   │                                     ▼
   │                            ┌─────────────────┐
   │  Success Login             │ POST /signup    │
   │  Redirect to               │ (Backend API)   │
   │  Dashboard ◄───────────────│                 │
   │                            └─────┬───────────┘
   │                                  │
   │                        Hash Password
   │                        Create User Record
   │                        Initialize Collections
   │                        Generate JWT Token
   │                                  │
   │                                  ▼
   │                          ┌──────────────────┐
   │  Store Token              │ Firestore       │
   │  in localStorage           │ Database        │
   └─────────────────────────│                  │
                             └──────────────────┘
```

### Daily Record Input Flow
```
┌──────────┐    User Logs       ┌─────────────────┐
│ User     │    Transport      │ Daily Input     │
│ Dashboard├─────────────────→ │ Card            │
└──────────┘                    │ (Frontend)      │
   ▲                            └────────┬────────┘
   │                                    │
   │                            Form Validation
   │                                    │
   │                                    ▼
   │                         ┌──────────────────┐
   │                         │ POST /dashboard/ │
   │                         │ daily            │
   │                         │ + JWT Token      │
   │                         └────────┬─────────┘
   │                                  │
   │                    Calculate Emissions
   │                    Calculate Points
   │                    Update User Totals
   │                    Save Daily Record
   │                                  │
   │                                  ▼
   │                         ┌──────────────────┐
   │  Fetch Updated           │ Firestore       │
   │  Dashboard Data          │ Database        │
   │  Refresh Charts ◄────────│                 │
   │  Update Leaderboard      └──────────────────┘
   │                                  │
   │                          Return Updated Stats
   │                                  │
   └──────────────────────────────────┘
```

### Emissions & Points Calculation
```
INPUT: Transport Mode + Distance
  │
  ├─→ EMISSIONS CALCULATION
  │    │
  │    ├─ Get Emission Factor (by mode)
  │    │   Car: 0.23
  │    │   Bus: 0.05
  │    │   EV: 0.05
  │    │   Bike: 0.11
  │    │   Walk/Bicycle: 0
  │    │
  │    └─ emissions = distance × factor
  │       Result: kg CO₂
  │
  ├─→ POINTS CALCULATION
  │    │
  │    ├─ base_points = distance × 0.1
  │    │
  │    ├─ Check Mode
  │    │   ├─ Eco-friendly → multiplier = 1.5
  │    │   └─ Other → multiplier = 1.0
  │    │
  │    ├─ points = base_points × multiplier
  │    │
  │    └─ Add Streak Bonus (if applicable)
  │       Result: Total Points
  │
  └─→ UPDATE TOTALS
       ├─ User.totalEmissions += emissions
       ├─ User.totalPoints += points
       ├─ User.totalDistance += distance
       └─ Save to Database
```

---

## Leaderboard Generation

```
GET /leaderboard/department/CS
  │
  ├─ Query Firestore: users where department == 'CS'
  │
  ├─ Sort by totalPoints DESC
  │
  ├─ Add Rank Numbers
  │   ├─ Rank 1 → Medal 🥇
  │   ├─ Rank 2 → Medal 🥈
  │   ├─ Rank 3 → Medal 🥉
  │   └─ Rank 4+ → Number
  │
  ├─ Format Response
  │   {
  │     rank: 1,
  │     name: "Alice Smith",
  │     totalPoints: 1250,
  │     totalEmissions: 45.3,
  │     totalDistance: 456
  │   }
  │
  └─ Return Top 10 to Frontend
```

---

## Authentication Flow

```
USER LOGIN
  │
  ├─ Enter Email & Password (Frontend)
  │
  ├─ POST /login {email, password}
  │  │
  │  ├─ Find user by email in Firestore
  │  │
  │  ├─ Compare password (bcryptjs.compare)
  │  │  ├─ Match → Continue
  │  │  └─ No Match → Return 401 Error
  │  │
  │  ├─ Generate JWT Token
  │  │  └─ jwt.sign({userId}, SECRET, {expiresIn: '7d'})
  │  │
  │  └─ Return {token, userId, user}
  │
  ├─ Frontend: Store token in localStorage
  │
  ├─ Subsequent API Requests
  │  └─ Header: Authorization: Bearer TOKEN
  │
  └─ Backend: Verify Token
     ├─ Extract token from header
     ├─ Verify with jwt.verify(token, SECRET)
     ├─ Valid → Continue
     └─ Invalid → Return 403 Error
```

---

## Responsive Design Breakpoints

```
┌────────────────────────────────────────────────────────────────┐
│                    SCREEN SIZE MAPPING                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Desktop (1024px+)          Tablet (768-1023px)  Mobile (<768)│
│  ├─ 3 Column Layout         ├─ 2 Column Layout   ├─ 1 Column  │
│  ├─ Full Features           ├─ Stacked Charts    ├─ Full Stack│
│  ├─ Large Text              ├─ Touch Buttons     ├─ Optimized │
│  ├─ Side-by-side Charts     ├─ Responsive Forms  ├─ Touch UI  │
│  └─ Mouse Optimized         └─ Balanced Layout   └─ Readable  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## File Dependencies

```
Frontend Components:
├─ App.jsx
│  ├─ AuthPage.jsx
│  │  └─ utils/api.js (signup, login)
│  └─ DashboardPage.jsx
│     ├─ ProfileCard.jsx
│     ├─ DailyInputCard.jsx
│     │  └─ utils/api.js (addDailyRecord)
│     ├─ EmissionsCard.jsx
│     ├─ PointsCard.jsx
│     ├─ ChartsCard.jsx
│     │  └─ utils/api.js (getEmissionsHistory)
│     └─ LeaderboardCard.jsx
│        └─ utils/api.js (getLeaderboard, getUserRank)

Backend Routes:
├─ routes/auth.js
│  └─ utils/auth.js (JWT functions)
├─ routes/dashboard.js
│  ├─ utils/auth.js (middleware)
│  └─ utils/emissions.js (calculations)
├─ routes/leaderboard.js
│  └─ firebase.js (Firestore queries)
└─ routes/transport.js
   ├─ utils/auth.js (middleware)
   └─ firebase.js (Firestore)
```

---

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────┐
│                    CDN / STATIC HOSTING                      │
│              (Frontend: React Build - dist/)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLOUD PLATFORM                            │
│         (Azure App Service, AWS EC2, Heroku, etc.)          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Backend Container/App Service             │   │
│  │  (Node.js Server on Port 5000)                      │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ API Calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  FIRESTORE DATABASE                          │
│             (Firebase Cloud Firestore)                       │
│                                                              │
│  Backup & Replication Enabled                              │
│  Automatic Scaling                                          │
│  Multi-region Support                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  LAYER 1: TRANSPORT SECURITY
│  ├─ HTTPS/TLS Encryption
│  ├─ CORS Policy
│  └─ Rate Limiting (recommended for production)
│
│  LAYER 2: AUTHENTICATION
│  ├─ bcryptjs Password Hashing
│  ├─ JWT Tokens (7-day expiry)
│  ├─ Secure Token Storage
│  └─ Token Validation Middleware
│
│  LAYER 3: INPUT VALIDATION
│  ├─ Client-side Validation
│  ├─ Server-side Validation
│  ├─ XSS Prevention
│  └─ SQL Injection Prevention
│
│  LAYER 4: DATABASE SECURITY
│  ├─ Firestore Security Rules
│  ├─ User-level Access Control
│  ├─ Data Encryption at Rest
│  └─ Backup & Recovery
│
└──────────────────────────────────────────────────────────────┘
```

---

This architecture provides a scalable, secure, and responsive application for tracking campus carbon emissions with gamified engagement! 🌱♻️
