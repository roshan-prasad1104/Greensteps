# Testing Guide

## Manual Testing Checklist

### Authentication Flow

#### Sign Up
- [ ] Fill all required fields
- [ ] Verify email validation
- [ ] Verify password strength
- [ ] Select transport mode
- [ ] Enter distance and frequency
- [ ] Submit form
- [ ] Check success message
- [ ] Verify redirect to dashboard

#### Login
- [ ] Enter valid email/password
- [ ] Check redirect to dashboard
- [ ] Try invalid password
- [ ] Verify error message
- [ ] Try non-existent email
- [ ] Verify error message

#### Session
- [ ] Refresh page
- [ ] Verify user still logged in
- [ ] Check token in localStorage
- [ ] Click logout
- [ ] Verify redirect to auth page
- [ ] Verify localStorage cleared

### Dashboard Features

#### Daily Transport Logging
- [ ] Select different transport modes
- [ ] Enter valid distance
- [ ] Submit form
- [ ] Verify success message
- [ ] Check form cleared
- [ ] Verify data in daily records
- [ ] Try submitting without distance
- [ ] Verify error message

#### Profile Card
- [ ] Verify all user info displayed
- [ ] Check data matches sign-up
- [ ] Verify responsive on mobile

#### Emissions Card
- [ ] Log different transport modes
- [ ] Verify emissions calculated correctly
  - Car 10 km: 2.3 kg CO₂
  - Bus 10 km: 0.5 kg CO₂
  - Walking/Bicycle 10 km: 0 kg CO₂
- [ ] Check daily emissions updated
- [ ] Check weekly/monthly totals

#### Points Card
- [ ] Log different transport modes
- [ ] Verify points calculated
  - Walking 10 km: (10 × 0.1) × 1.5 = 1.5 points
  - Car 10 km: (10 × 0.1) × 1.0 = 1.0 point
- [ ] Log daily for 5+ days
- [ ] Verify streak increases
- [ ] Check streak bonus on day 5

#### Charts
- [ ] Log data for multiple days
- [ ] Switch to week view
- [ ] Verify emissions chart shows data
- [ ] Verify points chart shows data
- [ ] Switch to month view
- [ ] Check data aggregates correctly
- [ ] Verify responsive on mobile

#### Leaderboards
- [ ] Create multiple test accounts
- [ ] Add records to each account
- [ ] Check department leaderboard
- [ ] Verify correct ranking
- [ ] Check campus leaderboard
- [ ] Verify user rank display
- [ ] Check medals on top 3

### Responsive Design Testing

#### Desktop (1920x1080)
- [ ] All cards display properly
- [ ] Charts render correctly
- [ ] No horizontal scroll
- [ ] Proper spacing

#### Tablet (768x1024)
- [ ] 2-column layout
- [ ] Cards responsive
- [ ] Charts stack properly
- [ ] Touch buttons accessible

#### Mobile (375x667)
- [ ] 1-column layout
- [ ] All content readable
- [ ] Forms easy to use
- [ ] No overflow
- [ ] Touch targets large enough

### Performance Testing

#### Loading Times
- [ ] Dashboard loads in < 2s
- [ ] Charts render smoothly
- [ ] No UI lag
- [ ] Transitions smooth

#### Data Updates
- [ ] Dashboard refreshes every 30s
- [ ] New record appears immediately
- [ ] Points update instantly
- [ ] Leaderboard updates correctly

### Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Chrome Mobile

### Edge Cases

#### Data Validation
- [ ] Very large distance (99999 km)
- [ ] Decimal distance (10.5 km)
- [ ] Zero distance (rejected)
- [ ] Negative distance (rejected)
- [ ] Special characters in inputs

#### Error Handling
- [ ] Network timeout during signup
- [ ] Network error during login
- [ ] API error on daily record
- [ ] Missing API response
- [ ] Invalid token handling

#### Boundary Testing
- [ ] Minimum distance (0.1 km)
- [ ] Maximum reasonable distance
- [ ] Maximum reasonable points
- [ ] Maximum leaderboard size

## API Testing with Curl

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "department": "CS",
    "campus": "Main",
    "password": "testpass123",
    "transport": {
      "mode": "car",
      "averageDistance": "10",
      "frequency": "5"
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "testpass123"
  }'
```

### Add Daily Record
```bash
curl -X POST http://localhost:5000/api/dashboard/daily \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "mode": "car",
    "distance": "10",
    "trips": "1"
  }'
```

### Get Dashboard
```bash
curl -X GET "http://localhost:5000/api/dashboard/dashboard/USER_ID"
```

### Get Leaderboard
```bash
curl -X GET "http://localhost:5000/api/leaderboard/department/CS"
```

## Test Data

### Sample Users
```javascript
User 1:
- Name: Alice Smith
- Email: alice@example.com
- Department: CS
- Campus: Main
- Password: Test123!

User 2:
- Name: Bob Johnson
- Email: bob@example.com
- Department: Engineering
- Campus: Main
- Password: Test123!

User 3:
- Name: Carol White
- Email: carol@example.com
- Department: CS
- Campus: Main
- Password: Test123!
```

### Sample Records
```javascript
Day 1: Car, 20 km → 4.6 kg CO₂, 2 points
Day 2: Bus, 15 km → 0.75 kg CO₂, 2.25 points
Day 3: Bicycle, 10 km → 0 kg CO₂, 1.5 points
Day 4: Walking, 5 km → 0 kg CO₂, 0.75 points
Day 5: EV, 25 km → 1.25 kg CO₂, 3.75 points + 1 streak bonus
```

## Debugging Tips

### Frontend (React)
```javascript
// Check user in localStorage
console.log(JSON.parse(localStorage.getItem('user')));

// Check API calls
// Open Network tab in DevTools
// Click on XHR/Fetch requests
// Review request/response data

// Check component state
// Use React DevTools extension
// Inspect component props and state
```

### Backend (Node.js)
```bash
# Check server logs
# Look for error messages
# Verify API is responding
curl http://localhost:5000/api/health

# Check database data (if using Firestore)
# View in Firebase Console
# Collections > users, dailyRecords, etc.
```

### Common Issues

**"Token not provided" error**
- Solution: Re-login to get new token
- Check localStorage for token
- Verify Authorization header format

**"User not found" error**
- Solution: Check if user exists in database
- Verify email case sensitivity
- Create new test account

**CORS error**
- Solution: Check CORS configuration in server.js
- Verify frontend URL is whitelisted
- Restart server

**Data not updating**
- Solution: Refresh dashboard (F5)
- Check browser console for errors
- Verify API response in Network tab

## Performance Testing

### Load Testing
- [ ] Test with 100 records
- [ ] Test with 1000 records
- [ ] Check response times
- [ ] Monitor memory usage

### Stress Testing
- [ ] Rapid form submissions
- [ ] Multiple tabs open
- [ ] Simultaneous users
- [ ] Large data exports

## Security Testing

### Authentication
- [ ] Try SQL injection in login
- [ ] Try XSS payloads in inputs
- [ ] Verify password is hashed
- [ ] Check token expiry works

### Authorization
- [ ] Access other user's data
- [ ] Modify leaderboard scores
- [ ] Delete other user's records
- [ ] Verify proper error responses

### Data Protection
- [ ] Check localStorage not exposing sensitive data
- [ ] Verify HTTPS in production
- [ ] Check for hardcoded credentials
- [ ] Test data encryption
