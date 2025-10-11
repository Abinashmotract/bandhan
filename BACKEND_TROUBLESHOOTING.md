# Backend Troubleshooting Guide

## 🚨 Error: "Cannot GET /api/matches"

This error indicates that the backend server is not running or not accessible.

### 🔧 Quick Fix Steps:

#### 1. Start the Backend Server
```bash
# Navigate to backend directory
cd /home/motract/Documents/abinash/bandhnam-backend

# Option 1: Use the start script
./start-server.sh

# Option 2: Manual start
npm start

# Option 3: Development mode
npm run dev
```

#### 2. Verify Backend is Running
Open these URLs in your browser:
- **Health Check**: http://localhost:3000/health
- **Test Matches**: http://localhost:3000/api/matches/test

You should see JSON responses like:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

#### 3. Check Backend Logs
Look for these messages in the terminal:
```
✅ Server running on port 3000
✅ Database connected successfully
✅ Routes registered successfully
```

### 🔍 Common Issues & Solutions:

#### Issue 1: Port 3000 Already in Use
```bash
# Kill process using port 3000
sudo lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

#### Issue 2: MongoDB Not Running
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or start MongoDB manually
mongod --dbpath /var/lib/mongodb
```

#### Issue 3: Missing Dependencies
```bash
# Install dependencies
cd /home/motract/Documents/abinash/bandhnam-backend
npm install
```

#### Issue 4: Environment Variables Missing
```bash
# Check if .env file exists
ls -la .env

# If missing, create it
cp .env.example .env
# Then edit with your values
```

### 🧪 Test Backend Endpoints:

#### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

#### Test 2: Matches Test Endpoint
```bash
curl http://localhost:3000/api/matches/test
```

#### Test 3: Matches with Auth (requires token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/matches
```

### 🚀 Complete Startup Sequence:

1. **Start MongoDB** (if not running):
   ```bash
   sudo systemctl start mongod
   ```

2. **Start Backend Server**:
   ```bash
   cd /home/motract/Documents/abinash/bandhnam-backend
   ./start-server.sh
   ```

3. **Start Frontend** (in new terminal):
   ```bash
   cd /home/motract/Documents/abinash/bandhnam-frontend
   npm run dev
   ```

4. **Test the Application**:
   - Open: http://localhost:5173
   - Login with your credentials
   - Go to: http://localhost:5173/matches

### 🔧 Backend Configuration:

#### Required Environment Variables (.env):
```env
MONGODB_URI=mongodb://localhost:27017/bandhnam
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
PORT=3000
NODE_ENV=development
```

#### Backend Routes Available:
- `GET /health` - Health check
- `GET /api/matches/test` - Test matches endpoint (no auth)
- `GET /api/matches` - Get matches (requires auth)
- `GET /api/matches/limits` - Get interest limits (requires auth)
- `POST /api/matches/interest` - Show interest (requires auth)
- `POST /api/matches/super-interest` - Show super interest (requires auth)

### 🐛 Debug Mode:

#### Enable Debug Logging:
```bash
DEBUG=* npm start
```

#### Check Network Connectivity:
```bash
# Check if port 3000 is listening
netstat -tlnp | grep :3000

# Check if MongoDB is running
netstat -tlnp | grep :27017
```

### 📞 Still Having Issues?

1. **Check Backend Logs** for error messages
2. **Verify Database Connection** in backend logs
3. **Check Firewall Settings** if using cloud/VPS
4. **Ensure All Dependencies** are installed
5. **Verify Environment Variables** are set correctly

### ✅ Success Indicators:

When everything is working correctly, you should see:
- ✅ Backend server running on port 3000
- ✅ Database connected successfully
- ✅ Frontend can access `/api/matches` endpoint
- ✅ Matches page loads with real data
- ✅ All filters and search work properly
