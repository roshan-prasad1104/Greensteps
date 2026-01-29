# Quick Start Guide

## 🚀 Getting Started (5 minutes)

### Step 1: Prerequisites
Make sure you have Node.js installed (v14+)
[Download Node.js](https://nodejs.org/)

### Step 2: Setup
Run the setup script:

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

Or manually:
```bash
npm run install-all
```

### Step 3: Start Development Servers

**Option A: Run both simultaneously (requires `concurrently`)**
```bash
npm run dev
```

**Option B: Run separately**
```bash
# Terminal 1
cd server
npm start

# Terminal 2 (in new terminal)
cd client
npm start
```

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📝 First Time Setup

1. **Sign Up** with:
   - Name: Your Name
   - Email: your@email.com
   - Department: Engineering (or your department)
   - Campus: Main (or your campus)
   - Password: securepassword
   - Transport Mode: Car (or your preference)
   - Average Distance: 10 km/day
   - Frequency: 5 trips/week

2. **Log Transport Data**:
   - Click "Log Today's Transport"
   - Select transport mode
   - Enter distance traveled
   - Click "Add Record"

3. **View Dashboard**:
   - See your emissions and points in real-time
   - Check your rank on leaderboards
   - View charts and analytics

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps
```

### Firebase Connection Issues
- If you're not using Firebase, the app will work with mock data
- Configure `.env` files with your credentials

### Changes Not Reflecting
```bash
# Clear browser cache
Ctrl + Shift + Delete (or Cmd + Shift + Delete on Mac)

# Restart both servers
npm run dev
```

## 📁 Project Structure

```
Hackathon/
├── server/              # Backend (Node.js + Express)
│   ├── routes/         # API endpoints
│   ├── utils/          # Utilities (emissions, auth)
│   ├── firebase.js     # Firebase config
│   ├── server.js       # Express app
│   └── .env            # Configuration
│
├── client/              # Frontend (React)
│   ├── src/
│   │   ├── pages/      # Auth & Dashboard pages
│   │   ├── components/ # Reusable components
│   │   └── utils/      # API client
│   └── .env            # Frontend config
│
├── setup.bat           # Windows setup script
├── setup.sh           # Mac/Linux setup script
├── README.md          # Full documentation
└── DEPLOYMENT.md      # Deployment guide
```

## 🎮 Features to Try

1. **Daily Transport Logging**
   - Log different transport modes
   - Watch emissions and points update instantly

2. **Leaderboards**
   - See your rank in your department
   - Compare with campus-wide rankings

3. **Charts & Analytics**
   - View weekly/monthly emissions
   - Track points earned over time

4. **Streak System**
   - Log transport daily to build streaks
   - Earn bonus points at milestones

## 💡 Tips for Development

- **Hot Reload**: Both servers support auto-reload on file changes
- **Console Logs**: Check browser console (F12) for frontend logs
- **API Debugging**: Use Postman to test backend endpoints
- **Responsive Design**: Test on mobile by pressing F12 → Toggle device toolbar

## 📚 API Testing

Test endpoints using curl or Postman:

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","department":"CS","campus":"Main","password":"pass123","transport":{"mode":"car","averageDistance":"10","frequency":"5"}}'

# Add daily record
curl -X POST http://localhost:5000/api/dashboard/daily \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"mode":"car","distance":"10","trips":"1"}'
```

## 🚢 Next Steps

1. **Customize**: Edit colors, text, and settings
2. **Deploy**: Follow DEPLOYMENT.md for cloud deployment
3. **Database**: Set up Firebase or your preferred database
4. **Add Features**: Implement notifications, PDF exports, etc.

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Review DEPLOYMENT.md for advanced setup
3. Check browser console for error messages
4. Verify all dependencies are installed

Happy tracking! 🌱🌍
