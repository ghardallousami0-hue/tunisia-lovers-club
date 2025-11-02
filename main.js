// Tunisia Lovers Club - FIXED Main JavaScript File

// Global variables
let currentUser = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupNavigation();
    setupAnimations();
    checkUserSession();
});

// Initialize application
function initializeApp() {
    console.log('Tunisia Lovers Club initialized');
    
    // Setup event listeners
    setupLoginForm();
    setupSignupForm();
    setupContactForm();
    setupFavorites();
    
    // Initialize page-specific features
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'index':
            initializeHomepage();
            break;
        case 'dashboard':
            initializeDashboard();
            break;
        case 'map':
            initializeMap();
            break;
        case 'guides':
            initializeGuides();
            break;
        case 'gallery':
            initializeGallery();
            break;
        case 'excursions':
            initializeExcursions();
            break;
        case 'tunisian-words':
            // Handled in the page itself
            break;
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('login')) return 'login';
    if (path.includes('signup')) return 'signup';
    if (path.includes('map')) return 'map';
    if (path.includes('guides')) return 'guides';
    if (path.includes('gallery')) return 'gallery';
    if (path.includes('excursions')) return 'excursions';
    if (path.includes('tunisian-words')) return 'tunisian-words';
    return 'index';
}

// Setup navigation
function setupNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup animations
function setupAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// User session management
function checkUserSession() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateNavigationForLoggedInUser();
    }
}

// Login form setup
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleLogin();
        });
    }
}

// Handle login
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submit-btn');
    
    try {
        // Show loading
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;
        
        // Call backend API
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }
        
        const result = await response.json();
        
        // Login successful!
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        currentUser = result.user;
        
        showNotification(`Welcome back, ${result.user.name}! Redirecting...`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Login failed. Please try again.', 'error');
        
        // Reset button
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Sign In to Your Account';
            submitBtn.disabled = false;
        }
    }
}

// Signup form setup
function setupSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleSignup();
        });
    }
}

// Handle signup
async function handleSignup() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submit-btn');
    
    try {
        // Show loading
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        // Call backend API
        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `${firstName} ${lastName}`,
                email: email,
                password: password
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Signup failed');
        }
        
        const result = await response.json();
        
        // Signup successful!
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        currentUser = result.user;
        
        showNotification(`Welcome to Tunisia Lovers Club, ${firstName}! Redirecting...`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        console.error('Signup error:', error);
        showNotification(error.message || 'Signup failed. Please try again.', 'error');
        
        // Reset button
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Join the Club';
            submitBtn.disabled = false;
        }
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNavigationForLoggedOutUser();
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Update navigation for logged in user
function updateNavigationForLoggedInUser() {
    const authLinks = document.querySelectorAll('.auth-link');
    const memberLinks = document.querySelectorAll('.member-link');
    
    authLinks.forEach(link => link.style.display = 'none');
    memberLinks.forEach(link => link.style.display = 'block');
    
    // Update welcome message
    const welcomeElements = document.querySelectorAll('.welcome-message');
    welcomeElements.forEach(el => {
        el.textContent = `Welcome, ${currentUser.name}`;
    });
}

// Update navigation for logged out user
function updateNavigationForLoggedOutUser() {
    const authLinks = document.querySelectorAll('.auth-link');
    const memberLinks = document.querySelectorAll('.member-link');
    
    authLinks.forEach(link => link.style.display = 'block');
    memberLinks.forEach(link => link.style.display = 'none');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 4000);
}

// Favorites management
function setupFavorites() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('favorite-btn')) {
            e.preventDefault();
            const itemId = e.target.dataset.id;
            const itemType = e.target.dataset.type;
            toggleFavorite(itemId, itemType);
        }
    });
}

function toggleFavorite(itemId, itemType) {
    const favoriteKey = `${itemType}-${itemId}`;
    const favoriteBtn = document.querySelector(`[data-id="${itemId}"][data-type="${itemType}"]`);
    
    if (favorites.includes(favoriteKey)) {
        favorites = favorites.filter(f => f !== favoriteKey);
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.innerHTML = '♡';
        showNotification('Removed from favorites', 'info');
    } else {
        favorites.push(favoriteKey);
        favoriteBtn.classList.add('favorited');
        favoriteBtn.innerHTML = '♥';
        showNotification('Added to favorites', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Check if item is favorited
function isFavorited(itemId, itemType) {
    return favorites.includes(`${itemType}-${itemId}`);
}

// Recently viewed management
function addToRecentlyViewed(itemId, itemType, title, image) {
    const item = {
        id: itemId,
        type: itemType,
        title: title,
        image: image,
        viewedAt: new Date().toISOString()
    };
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(r => !(r.id === itemId && r.type === itemType));
    
    // Add to beginning
    recentlyViewed.unshift(item);
    
    // Keep only last 10 items
    recentlyViewed = recentlyViewed.slice(0, 10);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Premium lock function
function showPremiumLock(message, title = "Premium Content Locked") {
    return `
        <div class="premium-lock text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-300">
            <div class="text-4xl mb-4">🔒</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">${title}</h3>
            <p class="text-gray-600 mb-4">${message}</p>
            <a href="signup.html" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                👑 Upgrade to Unlock
            </a>
        </div>
    `;
}

// Check if user has premium access
function hasPremiumAccess() {
    return currentUser && currentUser.membershipType !== 'Explorer';
}

// Initialize homepage
function initializeHomepage() {
    // Featured content
    loadFeaturedContent();
    
    // Testimonials carousel
    if (document.querySelector('.testimonials-carousel')) {
        initializeTestimonialsCarousel();
    }
}

// Initialize testimonials carousel
function initializeTestimonialsCarousel() {
    const testimonials = [
        {
            name: "Sarah Chen",
            location: "Travel Blogger",
            text: "Tunisia Lovers Club revealed hidden gems I never would have discovered on my own. The exclusive access to local guides made my trip unforgettable.",
            image: "resources/tunisia-1.jpg"
        },
        {
            name: "Marcus Weber",
            location: "Photographer",
            text: "The photography opportunities in the secret spots recommended by the club were incredible. Worth every penny of the membership.",
            image: "resources/tunisia-3.jpg"
        },
        {
            name: "Elena Rodriguez",
            location: "Cultural Explorer",
            text: "The authentic cultural experiences and connections with local artisans made my Tunisia journey truly special. This club is a game-changer.",
            image: "resources/tunisia-7.jpg"
        }
    ];
    
    let currentTestimonial = 0;
    const testimonialContainer = document.querySelector('.testimonial-content');
    
    function showTestimonial(index) {
        const testimonial = testimonials[index];
        testimonialContainer.innerHTML = `
            <div class="text-center max-w-4xl mx-auto">
                <img src="${testimonial.image}" alt="${testimonial.name}" class="w-20 h-20 rounded-full mx-auto mb-6 object-cover">
                <blockquote class="text-xl md:text-2xl text-gray-700 mb-6 italic">
                    "${testimonial.text}"
                </blockquote>
                <div class="text-lg font-semibold text-blue-600">${testimonial.name}</div>
                <div class="text-gray-500">${testimonial.location}</div>
            </div>
        `;
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    showTestimonial(0);
    setInterval(nextTestimonial, 6000);
}

// Load featured content
function loadFeaturedContent() {
    const featuredGuides = [
        {
            id: 1,
            title: "Secret Oasis of Chebika",
            description: "Discover the hidden mountain oasis where Star Wars was filmed",
            image: "resources/tunisia-4.jpg",
            duration: "Full Day",
            difficulty: "Moderate"
        },
        {
            id: 2,
            title: "Sidi Bou Said Blue Village",
            description: "Explore the enchanting blue and white village overlooking the Mediterranean",
            image: "resources/tunisia-9.jpg",
            duration: "Half Day",
            difficulty: "Easy"
        },
        {
            id: 3,
            title: "Dougga Roman Ruins",
            description: "Walk through the best-preserved Roman ruins in North Africa",
            image: "resources/tunisia-14.jpg",
            duration: "Full Day",
            difficulty: "Easy"
        }
    ];
    
    const container = document.querySelector('.featured-guides');
    if (container) {
        container.innerHTML = featuredGuides.map(guide => `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img src="${guide.image}" alt="${guide.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2 text-gray-800">${guide.title}</h3>
                    <p class="text-gray-600 mb-4">${guide.description}</p>
                    <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>⏱️ ${guide.duration}</span>
                        <span>📊 ${guide.difficulty}</span>
                    </div>
                    <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        View Guide
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize dashboard
function initializeDashboard() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update welcome message
    const welcomeElement = document.querySelector('.dashboard-welcome');
    if (welcomeElement) {
        welcomeElement.innerHTML = `
            <div class="text-center">
                <h1 class="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
                    Welcome back, <span class="text-gradient">${currentUser.name}</span>
                </h1>
                <p class="text-xl text-gray-600 mb-6 font-accent">
                    Ready to continue your Tunisian adventure? Here's what's new since your last visit.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div class="bg-blue-100 text-blue-800 px-6 py-3 rounded-full font-semibold">
                        ${currentUser.membershipType} Member
                    </div>
                    <div class="text-gray-600">
                        Member since ${new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Load recently viewed
    loadRecentlyViewed();
    
    // Load user favorites
    loadUserFavorites();
    
    // Initialize dashboard widgets
    initializeDashboardWidgets();
}

// Load recently viewed items
function loadRecentlyViewed() {
    const container = document.querySelector('.recently-viewed');
    if (container && recentlyViewed.length > 0) {
        container.innerHTML = recentlyViewed.slice(0, 4).map(item => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onclick="viewItem('${item.type}', ${item.id})">
                <img src="${item.image}" alt="${item.title}" class="w-full h-32 object-cover">
                <div class="p-4">
                    <h4 class="font-semibold text-sm mb-1">${item.title}</h4>
                    <p class="text-xs text-gray-500 capitalize">${item.type}</p>
                </div>
            </div>
        `).join('');
    }
}

// Load user favorites
function loadUserFavorites() {
    const container = document.querySelector('.user-favorites');
    if (container) {
        if (favorites.length > 0) {
            container.innerHTML = `
                <div class="text-center">
                    <p class="text-gray-600 mb-4">You have ${favorites.length} favorite items</p>
                    <div class="grid grid-cols-2 gap-4">
                        ${favorites.slice(0, 4).map(fav => `
                            <div class="bg-white p-4 rounded-lg shadow-sm">
                                <div class="text-2xl mb-2">⭐</div>
                                <p class="text-sm text-gray-600">${fav.split('-')[1]}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="text-center text-gray-500">
                    <p>You haven't favorited any items yet.</p>
                    <p class="text-sm mt-2">Explore our guides and locations to save your favorites!</p>
                </div>
            `;
        }
    }
}

// Initialize dashboard widgets
function initializeDashboardWidgets() {
    // Membership level widget
    const membershipWidget = document.querySelector('.membership-widget');
    if (membershipWidget) {
        membershipWidget.innerHTML = `
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <h3 class="text-lg font-semibold mb-2">Membership Status</h3>
                <p class="text-2xl font-bold mb-1">${currentUser.membershipType || 'Explorer'}</p>
                <p class="text-blue-100 text-sm">Member since ${new Date(currentUser.joinDate).toLocaleDateString()}</p>
                ${currentUser.membershipType === 'Explorer' ? `
                    <button class="mt-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors w-full">
                        👑 Upgrade to Premium
                    </button>
                ` : ''}
            </div>
        `;
    }
}

// View item function
function viewItem(type, id) {
    showNotification(`Opening ${type} ${id}...`, 'info');
}

// Initialize map
function initializeMap() {
    // Map initialization is handled in map.html
}

// Initialize guides
function initializeGuides() {
    // Guides initialization is handled in guides.html
}

// Initialize gallery
function initializeGallery() {
    // Gallery initialization is handled in gallery.html
}

// Initialize excursions
function initializeExcursions() {
    // Excursions initialization is handled in excursions.html
}

// Contact form setup
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            this.reset();
        });
    }
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }
    
    .animate-slide-up {
        animation: slideUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .favorite-btn.favorited {
        color: #ef4444;
    }
`;
document.head.appendChild(style);