let auth = null;
let db = null;

// Load Firebase configuration from Hosting runtime so we avoid committing secrets
async function initializeFirebase() {
    if (firebase.apps && firebase.apps.length > 0) {
        return {
            auth: firebase.auth(),
            db: firebase.firestore()
        };
    }

    const response = await fetch('/__/firebase/init.json');
    if (!response.ok) {
        throw new Error(`Failed to load Firebase configuration (${response.status})`);
    }

    const firebaseConfig = await response.json();
    firebase.initializeApp(firebaseConfig);
    return {
        auth: firebase.auth(),
        db: firebase.firestore()
    };
}

async function initializeDashboard() {
    try {
        const instances = await initializeFirebase();
        auth = instances.auth;
        db = instances.db;
        console.log('Firebase initialized successfully');
        setupAuthListener();
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        const errorDiv = document.getElementById('auth-error');
        if (errorDiv) {
            errorDiv.textContent = 'Failed to initialize Firebase. Please try again later.';
            errorDiv.style.display = 'block';
        }
    }
}

function setupAuthListener() {
    if (!auth) {
        return;
    }

    auth.onAuthStateChanged((user) => {
        const authScreen = document.getElementById('auth-screen');
        const dashboard = document.getElementById('dashboard');
        
        if (user) {
            // User is signed in
            authScreen.style.display = 'none';
            dashboard.classList.add('visible');
            document.getElementById('user-info').textContent = `Welcome, ${user.displayName || user.email}`;
            
            // Load dashboard data
            loadDashboardData();
        } else {
            // User is signed out
            authScreen.style.display = 'block';
            dashboard.classList.remove('visible');
        }
    });
}

// Chart instances
let viewsChart = null;
let pagesChart = null;

// Handle window resize
window.addEventListener('resize', () => {
    if (viewsChart) {
        viewsChart.resize();
    }
    if (pagesChart) {
        pagesChart.resize();
    }
});

// Authentication Functions
document.getElementById('login-btn').addEventListener('click', async () => {
    console.log('Login button clicked');
    if (!auth) {
        console.warn('Firebase not yet initialized. Please wait and try again.');
        return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        console.log('Attempting sign in...');
        const result = await auth.signInWithPopup(provider);
        console.log('Sign in successful:', result.user.email);
    } catch (error) {
        console.error('Sign in error:', error);
        const errorDiv = document.getElementById('auth-error');
        errorDiv.textContent = `Error: ${error.message}`;
        errorDiv.style.display = 'block';
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    if (auth) {
        auth.signOut();
    }
});

// Time range filter
document.getElementById('time-range').addEventListener('change', () => {
    loadDashboardData();
});

// Dashboard Data Loading
async function loadDashboardData() {
    if (!db) {
        console.warn('Firebase not yet initialized. Skipping dashboard data load.');
        return;
    }

    const timeRange = parseInt(document.getElementById('time-range').value);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);
    
    try {
        // Load all data in parallel
        await Promise.all([
            loadStats(cutoffDate),
            loadRecentVisits(cutoffDate),
            loadPageCounters(),
            loadChartsData(cutoffDate)
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load basic stats
async function loadStats(cutoffDate) {
    try {
        // Get visits in time range
        const visitsSnapshot = await db.collection('visits')
            .where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(cutoffDate))
            .get();
        
        const visits = visitsSnapshot.docs.map(doc => doc.data());
        
        // Calculate comprehensive stats
        const pageViews = visits.filter(v => v.type !== 'engagement');
        const engagementData = visits.filter(v => v.type === 'engagement');
        
        
        const totalViews = pageViews.length;
        
        // Session duration (from engagement data)
        const sessionDurations = engagementData
            .map(v => v.sessionDuration)
            .filter(d => d && d > 0);
        const avgSession = sessionDurations.length > 0 ? 
            Math.round(sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length / 1000) : 0;
        
        // Scroll depth
        const scrollDepths = engagementData
            .map(v => v.maxScrollDepth)
            .filter(d => d && d > 0);
        const avgScroll = scrollDepths.length > 0 ?
            Math.round(scrollDepths.reduce((a, b) => a + b, 0) / scrollDepths.length) : 0;
        
        // Top region
        const regions = {};
        pageViews.forEach(visit => {
            const region = visit.region || visit.country || 'Unknown';
            regions[region] = (regions[region] || 0) + 1;
        });
        const topRegion = Object.keys(regions).length > 0 ? 
            Object.keys(regions).reduce((a, b) => regions[a] > regions[b] ? a : b) : 'Unknown';
        
        // Mobile percentage
        const mobileVisits = pageViews.filter(v => v.touchScreen === true).length;
        const mobilePercent = totalViews > 0 ? Math.round((mobileVisits / totalViews) * 100) : 0;
        
        // Average load time
        const loadTimes = pageViews
            .map(v => v.loadTime)
            .filter(t => t && t > 0);
        const avgLoadTime = loadTimes.length > 0 ?
            Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length) : 0;
        
        // Top browser
        const browsers = {};
        pageViews.forEach(visit => {
            const browser = parseBrowser(visit.userAgent);
            browsers[browser] = (browsers[browser] || 0) + 1;
        });
        const topBrowser = Object.keys(browsers).length > 0 ? 
            Object.keys(browsers).reduce((a, b) => browsers[a] > browsers[b] ? a : b) : 'Unknown';
        
        // Top platform
        const platforms = {};
        pageViews.forEach(visit => {
            const platform = formatPlatform(visit.platform);
            platforms[platform] = (platforms[platform] || 0) + 1;
        });
        const topPlatform = Object.keys(platforms).length > 0 ? 
            Object.keys(platforms).reduce((a, b) => platforms[a] > platforms[b] ? a : b) : 'Unknown';
        
        // Update UI
        document.getElementById('total-views').textContent = totalViews.toLocaleString();
        document.getElementById('avg-session').textContent = avgSession > 0 ? `${avgSession}s` : '-';
        document.getElementById('avg-scroll').textContent = avgScroll > 0 ? `${avgScroll}%` : '-';
        document.getElementById('top-region').textContent = topRegion;
        document.getElementById('mobile-percent').textContent = `${mobilePercent}%`;
        document.getElementById('avg-load-time').textContent = avgLoadTime > 0 ? `${avgLoadTime}ms` : '-';
        document.getElementById('top-browser').textContent = topBrowser;
        document.getElementById('top-platform').textContent = topPlatform;
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load recent visits table
async function loadRecentVisits(cutoffDate) {
    try {
        console.log('Loading recent visits since:', cutoffDate);
        document.getElementById('recent-visits-loading').style.display = 'block';
        document.getElementById('recent-visits-container').style.display = 'none';
        
        // First try to get any visits without date filter to test basic connectivity
        console.log('Testing basic Firestore connectivity...');
        const testSnapshot = await db.collection('visits').limit(1).get();
        console.log('Basic query successful, documents found:', testSnapshot.size);
        
        // Try the query with date filter (including engagement data)
        let snapshot;
        try {
            snapshot = await db.collection('visits')
                .where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(cutoffDate))
                .orderBy('timestamp', 'desc')
                .limit(100)  // Increased limit to get more engagement data
                .get();
            console.log('Filtered query successful, documents found:', snapshot.size);
        } catch (indexError) {
            console.warn('Filtered query failed, trying simple query:', indexError.message);
            // Fallback to simple query without date filter
            snapshot = await db.collection('visits')
                .orderBy('timestamp', 'desc')
                .limit(100)
                .get();
            console.log('Simple query successful, documents found:', snapshot.size);
        }
        
        const tbody = document.getElementById('recent-visits-body');
        tbody.innerHTML = '';
        
        snapshot.docs.forEach(doc => {
            const visit = doc.data();
            
            // Skip engagement records in recent visits table - only show pageviews
            if (visit.type === 'engagement') {
                return;
            }
            
            const row = document.createElement('tr');
            const time = visit.timestamp.toDate();
            
            // Safely handle referrer URL extraction
            let referrer = 'Direct';
            if (visit.referrer && visit.referrer.trim() !== '') {
                try {
                    const url = new URL(visit.referrer);
                    referrer = url.hostname;
                } catch (urlError) {
                    // If URL parsing fails, use the referrer as-is or show as 'Invalid'
                    referrer = visit.referrer.length > 30 ? 
                        visit.referrer.substring(0, 30) + '...' : 
                        visit.referrer;
                }
            }
            
            // Format screen resolution
            const screen = visit.screenWidth && visit.screenHeight ? 
                `${visit.screenWidth}×${visit.screenHeight}` : '-';
            
            // Format source/campaign
            const source = visit.source || (referrer !== 'Direct' ? referrer : '-');
            
            // Format device info
            const deviceInfo = [];
            if (visit.touchScreen) deviceInfo.push('📱');
            if (visit.viewportWidth < 768) deviceInfo.push('Mobile');
            else if (visit.viewportWidth < 1024) deviceInfo.push('Tablet');
            else deviceInfo.push('Desktop');
            if (visit.pixelRatio > 1.5) deviceInfo.push('Retina');
            
            // Format platform/OS
            const platform = formatPlatform(visit.platform);
            
            // Format browser from user agent
            const browser = parseBrowser(visit.userAgent);
            
            // Format engagement - check for both initial and max values
            const engagement = [];
            const scrollDepth = visit.initialScrollDepth || visit.maxScrollDepth;
            const clickCount = visit.initialClickCount || visit.clickCount;
            
            if (scrollDepth && scrollDepth > 0) engagement.push(`${scrollDepth}% scroll`);
            if (clickCount && clickCount > 0) engagement.push(`${clickCount} clicks`);
            
            
            row.innerHTML = `
                <td>${time.toLocaleString()}</td>
                <td>${visit.path}</td>
                <td>${visit.region || visit.country || 'Unknown'}</td>
                <td>${deviceInfo.join(' ')}</td>
                <td>${platform}</td>
                <td>${browser}</td>
                <td>${visit.loadTime ? `${visit.loadTime}ms` : '-'}</td>
                <td>${engagement.join(', ') || '-'}</td>
            `;
            
            tbody.appendChild(row);
        });
        
        
        document.getElementById('recent-visits-loading').style.display = 'none';
        document.getElementById('recent-visits-container').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading recent visits:', error);
        document.getElementById('recent-visits-loading').textContent = 'Error loading data';
    }
}

// Load page counters
async function loadPageCounters() {
    try {
        document.getElementById('counters-loading').style.display = 'block';
        document.getElementById('counters-container').style.display = 'none';
        
        const snapshot = await db.collection('counters')
            .orderBy('count', 'desc')
            .get();
        
        const tbody = document.getElementById('counters-body');
        tbody.innerHTML = '';
        
        snapshot.docs.forEach(doc => {
            const counter = doc.data();
            const row = document.createElement('tr');
            
            const lastVisit = counter.lastVisit ? 
                counter.lastVisit.toDate().toLocaleString() : 'Never';
            
            row.innerHTML = `
                <td>${counter.path || doc.id}</td>
                <td>${(counter.count || 0).toLocaleString()}</td>
                <td>${lastVisit}</td>
            `;
            
            tbody.appendChild(row);
        });
        
        document.getElementById('counters-loading').style.display = 'none';
        document.getElementById('counters-container').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading counters:', error);
        document.getElementById('counters-loading').textContent = 'Error loading data';
    }
}

// Load chart data
async function loadChartsData(cutoffDate) {
    try {
        const visitsSnapshot = await db.collection('visits')
            .where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(cutoffDate))
            .orderBy('timestamp', 'asc')
            .get();
        
        const visits = visitsSnapshot.docs.map(doc => doc.data());
        
        // Create views over time chart
        createViewsChart(visits, cutoffDate);
        
        // Create top pages chart
        createPagesChart(visits);
        
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

// Create views over time chart
function createViewsChart(visits, cutoffDate) {
    const canvas = document.getElementById('views-chart');
    const ctx = canvas.getContext('2d');
    
    // Ensure canvas respects container size
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    
    // Group visits by day
    const dayGroups = {};
    const today = new Date();
    const days = Math.ceil((today - cutoffDate) / (1000 * 60 * 60 * 24));
    
    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
        const date = new Date(cutoffDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        dayGroups[dateStr] = 0;
    }
    
    // Count visits per day
    visits.forEach(visit => {
        const dateStr = visit.timestamp.toDate().toISOString().split('T')[0];
        if (dayGroups.hasOwnProperty(dateStr)) {
            dayGroups[dateStr]++;
        }
    });
    
    const labels = Object.keys(dayGroups).map(date => {
        return new Date(date).toLocaleDateString();
    });
    const data = Object.values(dayGroups);
    
    if (viewsChart) {
        viewsChart.destroy();
    }
    
    viewsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Page Views',
                data: data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 0,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Create top pages chart
function createPagesChart(visits) {
    const canvas = document.getElementById('pages-chart');
    const ctx = canvas.getContext('2d');
    
    // Ensure canvas respects container size
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    
    // Count visits per page
    const pageGroups = {};
    visits.forEach(visit => {
        pageGroups[visit.path] = (pageGroups[visit.path] || 0) + 1;
    });
    
    // Get top 10 pages
    const sortedPages = Object.entries(pageGroups)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    const labels = sortedPages.map(([path]) => path === '/' ? 'Home' : path);
    const data = sortedPages.map(([,count]) => count);
    
    const colors = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
        '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400'
    ];
    
    if (pagesChart) {
        pagesChart.destroy();
    }
    
    pagesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 0,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Helper functions for formatting display data
function formatPlatform(platform) {
    if (!platform) return 'Unknown';
    
    const platformMap = {
        'Win32': '🪟 Windows',
        'MacIntel': '🍎 macOS', 
        'Linux x86_64': '🐧 Linux',
        'Linux i686': '🐧 Linux',
        'iPhone': '📱 iOS',
        'iPad': '📱 iPadOS',
        'Android': '🤖 Android'
    };
    
    return platformMap[platform] || platform;
}

function parseBrowser(userAgent) {
    if (!userAgent) return 'Unknown';
    
    // Simple browser detection from user agent
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        const match = userAgent.match(/Chrome\/(\d+)/);
        return match ? `Chrome ${match[1]}` : 'Chrome';
    }
    
    if (userAgent.includes('Firefox')) {
        const match = userAgent.match(/Firefox\/(\d+)/);
        return match ? `Firefox ${match[1]}` : 'Firefox';
    }
    
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        const match = userAgent.match(/Safari\/(\d+)/);
        return match ? `Safari ${match[1]}` : 'Safari';
    }
    
    if (userAgent.includes('Edg')) {
        const match = userAgent.match(/Edg\/(\d+)/);
        return match ? `Edge ${match[1]}` : 'Edge';
    }
    
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
        const match = userAgent.match(/(?:Opera|OPR)\/(\d+)/);
        return match ? `Opera ${match[1]}` : 'Opera';
    }
    
    // Mobile browsers
    if (userAgent.includes('Mobile') && userAgent.includes('Safari')) {
        return 'Mobile Safari';
    }
    
    return 'Other';
}

initializeDashboard();
