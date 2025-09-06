## Quick Setup Guide for Unstop Igniters Club

### 🚀 Ready-to-Deploy Instructions

1. **Clone & Install:**
   ```bash
   git clone <your-repo-url>
   cd unstopxiter
   npm install
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **MongoDB Configuration:**
   - Open `backend/server.js`
   - Find line 15: `const MONGODB_URI = "ADD_YOUR_MONGODB_CONNECTION_STRING_HERE";`
   - Replace with your MongoDB connection string

4. **JWT Secret:**
   - Find line 69: `const JWT_SECRET = "ADD_YOUR_SECURE_JWT_SECRET_HERE";`
   - Replace with a secure random string

5. **Start Development:**
   ```bash
   # Terminal 1 - Frontend
   npm run dev

   # Terminal 2 - Backend  
   cd backend && npm run dev
   ```

### 🔧 Production Deployment

1. **Frontend:** Deploy to Vercel/Netlify using `npm run build`
2. **Backend:** Deploy to Railway/Heroku with environment variables
3. **Database:** Use MongoDB Atlas for production
