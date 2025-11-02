// TUNISIA LOVERS CLUB - SUPABASE BACKEND
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// SUPABASE CONNECTION WITH YOUR CREDENTIALS
const supabaseUrl = 'https://hgovltzetqoeiswynmle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnb3ZsdHpldHFvZWlzd3lubWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwOTE2NTksImV4cCI6MjA3NzY2NzY1OX0.0Va7J_VCcDUatwaq_RaNP3XTgxRObLeqBrGzgMZiB-U';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔗 Connected to Supabase database');

// PREMIUM CONTENT
const premiumContent = {
  guides: [
    {
      id: 1,
      title: "Secret Oasis of Chebika - Premium Guide",
      description: "EXCLUSIVE: Hidden routes and local contacts for the Chebika oasis",
      content: "This premium guide includes secret paths, local guide contacts, and hidden spots that regular tourists never find...",
      image: "resources/tunisia-4.jpg",
      category: "premium"
    },
    {
      id: 2, 
      title: "Underground Homes of Matmata - Insider Access",
      description: "PRIVATE: Access to family-owned underground homes and authentic experiences",
      content: "Get exclusive access to private underground homes and traditional Berber hospitality...",
      image: "resources/tunisia-5.jpg",
      category: "premium"
    }
  ],
  locations: [
    {
      id: 1,
      name: "Secret Beach Cove - Mediterranean Paradise",
      description: "HIDDEN: Private beach accessible only through local knowledge",
      coordinates: { lat: 36.8, lng: 10.9 },
      image: "resources/tunisia-10.jpg",
      category: "premium"
    }
  ],
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
    },
    {
      id: 4,
      phrase: "Can you give me a better price?",
      tunisian: "تعطيني أحسن؟ (Ta3tini ahsen?)",
      meaning: "Politely asking for discount"
    },
    {
      id: 5,
      phrase: "I'm lost, can you help me?",
      tunisian: "نحبط، تعاونني؟ (Ne7bet, ta3awenni?)",
      meaning: "Asking for directions help"
    }
  ]
};

// 🎯 SIGNUP
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('📝 Signup attempt:', email);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        name: name, 
        email: email, 
        password: password, 
        membership_type: 'Explorer' 
      }])
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Email already exists!' });
      }
      throw error;
    }

    console.log('✅ New user created:', data[0].name);
    res.json({
      message: 'Welcome to Tunisia Lovers Club! 🎉',
      user: {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        membershipType: data[0].membership_type
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Signup failed!' });
  }
});

// 🎯 LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) {
      console.log('❌ Login failed for:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful:', data.name);
    res.json({
      message: 'Welcome back! 👋',
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        membershipType: data.membership_type
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Login failed!' });
  }
});

// 🎯 GET PREMIUM GUIDES
app.get('/premium/guides', async (req, res) => {
  try {
    console.log('👑 Premium guides accessed');
    res.json({
      message: 'Premium guides loaded successfully!',
      guides: premiumContent.guides
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load premium guides' });
  }
});

// 🎯 GET PREMIUM LOCATIONS
app.get('/premium/locations', async (req, res) => {
  try {
    console.log('👑 Premium locations accessed');
    res.json({
      message: 'Premium locations loaded successfully!',
      locations: premiumContent.locations
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load premium locations' });
  }
});

// 🎯 GET PREMIUM PHRASES
app.get('/premium/phrases', async (req, res) => {
  try {
    console.log('👑 Premium phrases accessed');
    res.json({
      message: 'Premium phrases loaded successfully!',
      phrases: premiumContent.phrases
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load premium phrases' });
  }
});

// 🎯 UPGRADE MEMBERSHIP
app.post('/upgrade', async (req, res) => {
  try {
    const { userId, membershipType } = req.body;
    console.log('⬆️ Upgrade request:', userId, membershipType);
    
    const { data, error } = await supabase
      .from('users')
      .update({ membership_type: membershipType })
      .eq('id', userId)
      .select();

    if (error) throw error;

    res.json({ 
      message: `Upgraded to ${membershipType} successfully! 🎉`,
      user: {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        membershipType: data[0].membership_type
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Upgrade failed!' });
  }
});

// 🎯 HEALTH CHECK
app.get('/health', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    res.json({ 
      message: 'Tunisia Lovers Club API is working! 🧠',
      database: 'Supabase',
      totalUsers: count || 0,
      status: 'healthy'
    });
  } catch (error) {
    res.status(500).json({ message: 'Health check failed' });
  }
});

// 🎯 GET ALL USERS (ADMIN)
app.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ users: data });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Tunisia Lovers Club Server Started!');
  console.log('📍 Port:', PORT);
  console.log('📊 Database: Supabase');
  console.log('🔗 Health Check: http://localhost:' + PORT + '/health');
  console.log('👤 Demo Login: demo@tunisialovers.com / demo123');
});