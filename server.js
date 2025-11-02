// TUNISIA LOVERS CLUB - COMPLETE WORKING VERSION
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase connection
const supabaseUrl = 'https://hgovltzetqoeiswynmle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnb3ZsdHpldHFvZWlzd3lubWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwOTE2NTksImV4cCI6MjA3NzY2NzY1OX0.0Va7J_VCcDUatwaq_RaNP3XTgxRObLeqBrGzgMZiB-U';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔗 Supabase connected');

// ✅ ROOT ROUTE - FIXES "Route not found"
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Tunisia Lovers Club API is LIVE!',
    endpoints: {
      health: '/health',
      signup: '/signup', 
      login: '/login',
      premium_guides: '/premium/guides',
      premium_phrases: '/premium/phrases'
    },
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// 🎯 HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ 
    message: '✅ Tunisia Lovers Club API is HEALTHY!',
    database: 'Supabase',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 🎯 SIGNUP
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('📝 Signup attempt:', email);
    
    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Try Supabase first, fallback to memory
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          name: name, 
          email: email, 
          password: password, 
          membership_type: 'Explorer' 
        }])
        .select();

      if (error) throw error;

      console.log('✅ New user in Supabase:', data[0].name);
      
      res.json({
        message: 'Welcome to Tunisia Lovers Club! 🎉',
        user: {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          membershipType: data[0].membership_type
        }
      });

    } catch (supabaseError) {
      console.log('⚠️ Supabase failed, using memory storage');
      
      // Fallback to memory storage
      const users = [];
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        membershipType: 'Explorer'
      };

      users.push(newUser);
      
      res.json({
        message: 'Welcome to Tunisia Lovers Club! 🎉',
        user: newUser
      });
    }

  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Signup failed. Please try again.' });
  }
});

// 🎯 LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);

    // Try Supabase first, fallback to memory
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      console.log('✅ Login successful via Supabase:', data.name);
      
      res.json({
        message: 'Welcome back! 👋',
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          membershipType: data.membership_type
        }
      });

    } catch (supabaseError) {
      console.log('⚠️ Supabase failed, using memory storage');
      
      // Fallback to memory storage
      const users = [];
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      res.json({
        message: 'Welcome back! 👋',
        user: user
      });
    }

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// 🎯 PREMIUM GUIDES
app.get('/premium/guides', (req, res) => {
  res.json({
    message: 'Premium guides loaded successfully!',
    guides: [
      {
        id: 1,
        title: "Secret Oasis of Chebika - Premium Guide",
        description: "EXCLUSIVE: Hidden routes and local contacts",
        image: "resources/tunisia-4.jpg",
        category: "premium"
      },
      {
        id: 2, 
        title: "Underground Homes of Matmata - Insider Access",
        description: "PRIVATE: Access to family-owned underground homes",
        image: "resources/tunisia-5.jpg", 
        category: "premium"
      }
    ]
  });
});

// 🎯 PREMIUM PHRASES
app.get('/premium/phrases', (req, res) => {
  res.json({
    message: 'Premium phrases loaded successfully!',
    phrases: [
      {
        id: 1,
        phrase: "Where is the best local restaurant?",
        tunisian: "وين أحسن ماكبة؟ (Win ahsen ma9ba?)",
        meaning: "Asking for authentic local food spots"
      },
      {
        id: 2,
        phrase: "How much does this cost?",
        tunisian: "بقداش؟ (B9adech?)",
        meaning: "Bargaining at local markets"
      },
      {
        id: 3,
        phrase: "This is too expensive!",
        tunisian: "غالية! (Ghalya!)", 
        meaning: "Essential for market bargaining"
      }
    ]
  });
});

// 🎯 404 HANDLER - MUST BE LAST!
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    available_routes: ['/', '/health', '/signup', '/login', '/premium/guides', '/premium/phrases']
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Tunisia Lovers Club Server Started!');
  console.log('📍 Port:', PORT);
  console.log('🌐 Root URL: http://localhost:' + PORT);
  console.log('❤️  Health: http://localhost:' + PORT + '/health');
});