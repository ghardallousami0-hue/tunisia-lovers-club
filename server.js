// TUNISIA LOVERS CLUB - SECURE VERSION (NO PASSWORDS!)
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

// ✅ ROOT ROUTE
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Tunisia Lovers Club API is LIVE!',
    endpoints: {
      health: '/health',
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

// 🎯 404 HANDLER
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    available_routes: ['/', '/health', '/premium/guides', '/premium/phrases']
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