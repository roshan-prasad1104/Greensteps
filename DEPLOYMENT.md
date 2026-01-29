# Deployment & Configuration Guide

## Local Development

### Install Dependencies
```bash
npm run install-all
```

### Start Development Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:3000`

## Firebase Setup (Optional)

If using Firebase:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Create a service account and download the JSON key
4. Add credentials to `server/.env`

For local testing without Firebase:
- The app includes fallback support for mock data
- Database structure is ready to swap to SQLite or MongoDB

## Database Schema

### Collections/Tables

**users**
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
  createdAt: timestamp
}
```

**dailyRecords**
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

**transport**
```javascript
{
  userId: string,
  mode: string,
  averageDistance: number,
  frequency: number,
  updatedAt: timestamp
}
```

## Deployment

### Docker Deployment (Optional)

```bash
docker build -t carbon-tracker .
docker run -p 5000:5000 -p 3000:3000 carbon-tracker
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
JWT_SECRET=strong_secret_key
NODE_ENV=production
```

**Frontend (.env)**
```
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
```

## Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## Troubleshooting

### Firebase Connection Issues
- Verify credentials in `.env`
- Check Firestore security rules
- Enable required APIs in Google Cloud Console

### CORS Issues
- Ensure backend CORS is configured correctly
- Check frontend API base URL

### Port Already in Use
```bash
# Kill process on port 5000 (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## Performance Optimization

- **Caching**: Implement Redis for leaderboard queries
- **Pagination**: Limit records returned from API
- **Image Optimization**: Compress assets
- **Code Splitting**: React lazy loading for routes

## Security Considerations

- ✅ Password hashing with bcryptjs
- ✅ JWT token validation
- ✅ CORS protection
- ✅ Environment variable handling
- 🔄 Add rate limiting
- 🔄 Add input validation middleware
- 🔄 Implement HTTPS in production
