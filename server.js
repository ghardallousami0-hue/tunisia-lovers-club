// TUNISIA LOVERS CLUB - WORKING VERSION
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Supabase connection
const supabaseUrl = 'https://hgovltzetqoeiswynmle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnb3ZsdHpldHFvZWlzd3lubWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwOTE2NTksImV4cCI6MjA3NzY2NzY1OX0.0Va7J_VCcDUatwaq_RaNP3XTgxRObLeqBrGzgMZiB-U';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔗 Supabase connected');

// Simple in-memory storage for testing
let users = [];

// 🎯 HEALTH CHECK (ALWAYS WORKS)
app.get('/health', (req, res) => {
  res.json({ 
    message: '✅ Tunisia Lovers Club API is WORKING!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// 🎯 SIGNUP (SIMPLIFIED)
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password,
      membershipType: 'Explorer',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    
    console.log('✅ New user:', newUser.name);
    
    res.json({
      message: 'Welcome to Tunisia Lovers Club! 🎉',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        membershipType: newUser.membershipType
      }
    });

  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// 🎯 LOGIN (SIMPLIFIED)
app.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful:', user.name);
    
    res.json({
      message: 'Welcome back! 👋',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        membershipType: user.membershipType
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// 🎯 PREMIUM CONTENT
app.get('/premium/guides', (req, res) => {
  res.json({
    guides: [
      {
        id: 1,
        title: "Secret Oasis Guide",
        description: "Premium content for members"
      }
    ]
  });
});

app.get('/premium/phrases', (req, res) => {
  res.json({
    phrases: [
      {
        id: 1,
        phrase: "Where is the best restaurant?",
        tunisian: "وين أحسن ماكبة؟"
      }
    ]
  });
});

// 🎯 404 HANDLER
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 🎯 ERROR HANDLER
app.use((error, req, res, next) => {
  console.error('🚨 Server error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Tunisia Lovers Club Server Started!');
  console.log('📍 Port:', PORT);
  console.log('🌐 Health URL: http://localhost:' + PORT + '/health');
});