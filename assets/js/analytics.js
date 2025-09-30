// Comprehensive Analytics - GDPR-safe behavioral tracking
class MinimalAnalytics {
    constructor(functionUrl) {
        this.functionUrl = functionUrl;
        this.isEnabled = this.checkEnabled();
        this.startTime = Date.now();
        this.scrollDepths = [];
        this.maxScrollDepth = 0;
        this.clickCount = 0;
        this.interactions = [];
        
        if (this.isEnabled) {
            this.trackPageView();
            // Set up engagement tracking after a small delay to ensure DOM is ready
            setTimeout(() => {
                this.setupEventListeners();
                console.log('Analytics: Event listeners set up, starting engagement tracking');
            }, 1000);
        }
    }
    
    checkEnabled() {
        // Don't track in development
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
            return false;
        }
        
        // Don't track bots/crawlers
        const userAgent = navigator.userAgent.toLowerCase();
        const bots = ['bot', 'crawl', 'spider', 'scraper', 'facebookexternalhit'];
        if (bots.some(bot => userAgent.includes(bot))) {
            return false;
        }
        
        return true;
    }
    
    async trackPageView() {
        try {
            const data = this.collectAllData();
            
            // Send tracking data (non-blocking)
            fetch(this.functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                keepalive: true
            }).catch(() => {
                // Silently fail - analytics shouldn't break the site
            });
            
        } catch (error) {
            // Silently fail - analytics shouldn't break the site
        }
    }
    
    collectAllData() {
        const screen = window.screen || {};
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
        const performance = window.performance || {};
        const battery = navigator.getBattery ? null : navigator.battery;
        
        return {
            // Basic page info
            path: window.location.pathname,
            referrer: document.referrer || null,
            pageTitle: document.title || null,
            source: this.getSource(),
            
            // Timing data
            timestamp: new Date().toISOString(),
            visitStart: this.startTime,
            loadTime: performance.now ? Math.round(performance.now()) : null,
            dayOfWeek: new Date().getDay(), // 0-6 (Sunday-Saturday)
            hourOfDay: new Date().getHours(), // 0-23
            
            // Browser & Platform
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language || null,
            languages: navigator.languages ? navigator.languages.slice(0, 3).join(',') : null,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
            
            // Screen & Display
            screenWidth: screen.width || null,
            screenHeight: screen.height || null,
            screenDepth: screen.colorDepth || null,
            pixelRatio: window.devicePixelRatio || null,
            viewportWidth: window.innerWidth || null,
            viewportHeight: window.innerHeight || null,
            
            // Device capabilities
            touchScreen: 'ontouchstart' in window,
            cookieEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine,
            
            // Connection info
            connectionType: connection.effectiveType || null,
            connectionSpeed: connection.downlink || null,
            
            // Hardware info (if available)
            hardwareConcurrency: navigator.hardwareConcurrency || null,
            memorySize: navigator.deviceMemory || null,
            
            // Browser features
            webGLSupport: this.detectWebGL(),
            localStorageEnabled: this.detectLocalStorage(),
            webRTCSupport: this.detectWebRTC(),
            
            // Initial engagement
            clickCount: this.clickCount,
            maxScrollDepth: this.maxScrollDepth,
            
            // Performance metrics
            domContentLoaded: this.getDOMLoadTime(),
            resourcesLoaded: this.getResourceLoadTime()
        };
    }
    
    getDOMLoadTime() {
        if (!window.performance || !window.performance.timing) return null;
        const timing = window.performance.timing;
        return timing.domContentLoadedEventEnd - timing.navigationStart;
    }
    
    getResourceLoadTime() {
        if (!window.performance || !window.performance.timing) return null;
        const timing = window.performance.timing;
        return timing.loadEventEnd - timing.navigationStart;
    }
    
    detectWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }
    
    detectLocalStorage() {
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    detectWebRTC() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
               !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
    }
    
    setupEventListeners() {
        // Scroll depth tracking
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.trackScrollDepth();
            }, 100);
        });
        
        // Click tracking
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        });
        
        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.trackEngagement();
            }
        });
        
        // Before page unload
        window.addEventListener('beforeunload', () => {
            this.trackEngagement();
        });
        
        // Periodic engagement tracking
        setInterval(() => {
            this.trackEngagement();
        }, 30000); // Every 30 seconds
    }
    
    trackScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        const windowHeight = window.innerHeight;
        const scrollPercent = Math.round((scrollTop + windowHeight) / docHeight * 100);
        
        if (scrollPercent > this.maxScrollDepth) {
            this.maxScrollDepth = Math.min(100, scrollPercent);
            console.log('Analytics: Scroll depth updated to', this.maxScrollDepth + '%');
        }
        
        // Track milestone depths
        const milestones = [25, 50, 75, 100];
        milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !this.scrollDepths.includes(milestone)) {
                this.scrollDepths.push(milestone);
                console.log('Analytics: Scroll milestone reached:', milestone + '%');
            }
        });
    }
    
    trackClick(event) {
        this.clickCount++;
        console.log('Analytics: Click tracked, total clicks:', this.clickCount);
        
        const element = event.target;
        const interaction = {
            type: 'click',
            timestamp: Date.now() - this.startTime,
            element: element.tagName.toLowerCase(),
            elementText: element.textContent ? element.textContent.substring(0, 50) : null,
            elementId: element.id || null,
            elementClass: element.className || null,
            isExternalLink: this.isExternalLink(element)
        };
        
        this.interactions.push(interaction);
        
        // Keep only last 20 interactions to avoid data bloat
        if (this.interactions.length > 20) {
            this.interactions = this.interactions.slice(-20);
        }
    }
    
    isExternalLink(element) {
        if (element.tagName.toLowerCase() === 'a' && element.href) {
            return !element.href.startsWith(window.location.origin);
        }
        return false;
    }
    
    trackEngagement() {
        if (!this.isEnabled) return;
        
        const sessionData = {
            path: window.location.pathname,
            sessionDuration: Date.now() - this.startTime,
            maxScrollDepth: this.maxScrollDepth,
            scrollMilestones: this.scrollDepths.join(','),
            clickCount: this.clickCount,
            interactions: this.interactions.length,
            type: 'engagement'
        };
        
        // Debug logging
        console.log('Tracking engagement:', {
            sessionDuration: sessionData.sessionDuration,
            maxScrollDepth: sessionData.maxScrollDepth,
            clickCount: sessionData.clickCount
        });
        
        // Send engagement data
        fetch(this.functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
            keepalive: true
        }).catch(() => {
            // Silently fail
        });
    }
    
    getSource() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const ref = urlParams.get('ref');
        
        if (utmSource || utmMedium || utmCampaign) {
            return `${utmSource || 'unknown'}/${utmMedium || 'unknown'}/${utmCampaign || 'unknown'}`;
        }
        
        if (ref) {
            return `ref/${ref}`;
        }
        
        return null;
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Replace with your actual function URL after deployment
    const ANALYTICS_FUNCTION_URL = 'https://us-central1-edmondmiuportfolio.cloudfunctions.net/trackVisit';
    
    // Initialize analytics
    window.analytics = new MinimalAnalytics(ANALYTICS_FUNCTION_URL);
});