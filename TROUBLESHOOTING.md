# Support Agent Troubleshooting Guide

## Issue: Support Agent Not Working

### Quick Fixes

#### 1. Check if Backend Server is Running
```bash
# In backend directory
cd backend
npm run dev
```

The backend should be running on `http://localhost:3001`

#### 2. Check if Frontend is Running
```bash
# In frontend directory
cd frontend
npm run dev
```

The frontend should be running on `http://localhost:3000`

#### 3. Verify API Connection
Open browser console (F12) and check for errors:
- Network tab: Look for `/api/support/chat` requests
- Console tab: Check for error messages

### Common Issues

#### Issue 1: "Network Error" or "Connection Refused"
**Solution:**
1. Make sure backend server is running on port 3001
2. Check `frontend/vite.config.js` has proxy configuration:
   ```js
   proxy: {
     '/api': {
       target: 'http://localhost:3001',
       changeOrigin: true
     }
   }
   ```

#### Issue 2: "CORS Error"
**Solution:**
- Backend already has CORS enabled
- If still seeing CORS errors, check `backend/local-server.js` has:
  ```js
  app.use(cors())
  ```

#### Issue 3: "500 Internal Server Error"
**Solution:**
1. Check backend console for error messages
2. Verify `.env` file exists in backend directory
3. Check if `DEMO_MODE=true` is set (should work in demo mode)

#### Issue 4: "Message is required" Error
**Solution:**
- This means the request body is not being parsed correctly
- Check browser Network tab to see what's being sent
- Verify frontend is sending `{ message: "...", demoMode: true/false }`

### Testing Steps

#### Step 1: Test Backend Directly
```bash
cd backend
node -e "const chat = require('./src/support/chat'); const testEvent = { body: JSON.stringify({ message: 'hello', demoMode: true }) }; chat.handler(testEvent).then(r => console.log('✅ Success:', JSON.parse(r.body).response.substring(0, 50))).catch(e => console.error('❌ Error:', e.message))"
```

#### Step 2: Test Backend API Endpoint
```bash
# With backend running, test with curl:
curl -X POST http://localhost:3001/api/support/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello","demoMode":true}'
```

#### Step 3: Check Frontend Console
1. Open browser DevTools (F12)
2. Go to Network tab
3. Send a message in Support Agent
4. Look for `/api/support/chat` request
5. Check:
   - Status code (should be 200)
   - Response body (should have `response` field)
   - Request payload (should have `message` and `demoMode`)

### Debug Mode

Enable detailed logging:

#### Backend:
```bash
# In backend/.env
NODE_ENV=development
```

#### Frontend:
- Open browser console
- All errors will be logged there

### Expected Behavior

#### Demo Mode (DEMO_MODE=true):
- ✅ Always returns pre-saved responses
- ✅ No API calls to Google AI
- ✅ Works without internet connection
- ✅ Fast responses (< 100ms)

#### AI Mode (DEMO_MODE=false):
- ✅ Calls Google AI Studio API
- ✅ Requires valid API key
- ✅ Slower responses (1-3 seconds)
- ✅ Falls back to demo if API fails

### Still Not Working?

1. **Check Backend Logs:**
   ```bash
   cd backend
   npm run dev
   # Look for error messages in console
   ```

2. **Check Frontend Console:**
   - Open browser DevTools (F12)
   - Check Console and Network tabs

3. **Verify Environment:**
   ```bash
   # Backend .env should have:
   DEMO_MODE=true  # For demo mode
   # OR
   GOOGLE_AI_API_KEY=your-key  # For AI mode
   ```

4. **Restart Both Servers:**
   ```bash
   # Stop both servers (Ctrl+C)
   # Then restart:
   # Terminal 1:
   cd backend && npm run dev
   
   # Terminal 2:
   cd frontend && npm run dev
   ```

### Contact
If issues persist, check:
- Backend console output
- Browser console errors
- Network tab in DevTools
- Backend is running on port 3001
- Frontend is running on port 3000

