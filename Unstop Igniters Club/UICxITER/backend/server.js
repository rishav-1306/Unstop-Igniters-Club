const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection String - ADD YOUR MONGODB CONNECTION STRING HERE
const MONGODB_URI = "ADD_YOUR_MONGODB_CONNECTION_STRING_HERE";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Quiz Score Schema
const quizScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizType: { type: String, enum: ['weekly', 'monthly-dsa'], required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

const QuizScore = mongoose.model('QuizScore', quizScoreSchema);

// Admin Configuration Schema
const adminConfigSchema = new mongoose.Schema({
  type: { type: String, enum: ['form-link', 'sheet-config'], required: true },
  category: { type: String, enum: ['weekly', 'monthly-dsa', 'hackathon'], required: true },
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AdminConfig = mongoose.model('AdminConfig', adminConfigSchema);

// Leaderboard Data Schema
const leaderboardSchema = new mongoose.Schema({
  type: { type: String, enum: ['weekly', 'monthly-dsa', 'hackathon'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  score: { type: Number, required: true },
  rank: { type: Number, required: true },
  syncedAt: { type: Date, default: Date.now }
});

const LeaderboardData = mongoose.model('LeaderboardData', leaderboardSchema);

// JWT Secret - ADD YOUR SECURE JWT SECRET HERE
const JWT_SECRET = "ADD_YOUR_SECURE_JWT_SECRET_HERE";

// Routes

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, dob, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      dob,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User Profile
app.get('/api/user/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Submit Quiz Score
app.post('/api/quiz/score', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { quizType, score, totalQuestions } = req.body;

    const quizScore = new QuizScore({
      userId: decoded.userId,
      quizType,
      score,
      totalQuestions
    });

    await quizScore.save();
    res.status(201).json({ message: 'Quiz score submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Middleware for admin authentication
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    // For demo purposes, make the first registered user admin
    // In production, you would have a proper admin role system
    if (!user || user.email !== 'admin@unstopigniters.com') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin Routes

// Save Form Links
app.post('/api/admin/form-links', requireAdmin, async (req, res) => {
  try {
    const { type, link } = req.body;
    
    await AdminConfig.findOneAndUpdate(
      { type: 'form-link', category: type },
      { value: link, updatedAt: new Date() },
      { upsert: true }
    );

    res.json({ message: 'Form link saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save Google Sheets Configuration
app.post('/api/admin/sheets-config', requireAdmin, async (req, res) => {
  try {
    const { type, sheetId } = req.body;
    
    await AdminConfig.findOneAndUpdate(
      { type: 'sheet-config', category: type },
      { value: sheetId, updatedAt: new Date() },
      { upsert: true }
    );

    res.json({ message: 'Sheets configuration saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Sync Leaderboard Data from Google Sheets
app.post('/api/admin/sync-leaderboard/:type', requireAdmin, async (req, res) => {
  try {
    const { type } = req.params;
    
    // Get sheet configuration
    const sheetConfig = await AdminConfig.findOne({
      type: 'sheet-config',
      category: type
    });

    if (!sheetConfig) {
      return res.status(400).json({ message: 'Sheet configuration not found' });
    }

    // Configure Google Sheets API
    const auth = new google.auth.GoogleAuth({
      // Add your Google service account credentials here
      keyFile: 'path/to/service-account-key.json', // Replace with actual path
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Read data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetConfig.value,
      range: 'A1:C1000', // Assuming Name, Email, Score columns
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: 'No data found in sheet' });
    }

    // Clear existing leaderboard data for this type
    await LeaderboardData.deleteMany({ type });

    // Process and save new data
    const leaderboardData = [];
    for (let i = 1; i < rows.length; i++) { // Skip header row
      const [name, email, score] = rows[i];
      if (name && email && score) {
        leaderboardData.push({
          type,
          name: name.trim(),
          email: email.trim(),
          score: parseInt(score) || 0,
          rank: i
        });
      }
    }

    // Sort by score and assign ranks
    leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardData.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Save to database
    await LeaderboardData.insertMany(leaderboardData);

    res.json({ 
      message: 'Leaderboard synced successfully',
      entriesCount: leaderboardData.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Dynamic Leaderboard Data
app.get('/api/leaderboard/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    // First try to get synced data from Google Sheets
    const syncedData = await LeaderboardData.find({ type })
      .sort({ rank: 1 })
      .limit(50);

    if (syncedData.length > 0) {
      const leaderboard = syncedData.map(entry => ({
        rank: entry.rank,
        name: entry.name,
        email: entry.email,
        points: entry.score,
        avatar: entry.name.split(' ').map(n => n[0]).join('').toUpperCase()
      }));
      
      return res.json({ leaderboard });
    }

    // Fallback to quiz scores if no synced data available
    const leaderboard = await QuizScore.aggregate([
      { $match: { quizType: type } },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          totalQuestions: { $sum: '$totalQuestions' },
          quizCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          totalScore: 1,
          totalQuestions: 1,
          quizCount: 1,
          percentage: {
            $multiply: [
              { $divide: ['$totalScore', '$totalQuestions'] },
              100
            ]
          }
        }
      },
      { $sort: { percentage: -1, totalScore: -1 } },
      { $limit: 50 }
    ]);

    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      email: entry.email,
      points: entry.totalScore,
      avatar: entry.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }));

    res.json({ leaderboard: formattedLeaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});