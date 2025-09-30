const {onRequest} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Helper function to get region from timezone (GDPR-safe)
function getRegionFromTimezone(timezone) {
  if (!timezone) return "Unknown";
  
  const regionMap = {
    "Europe/": "Europe",
    "America/": "Americas", 
    "Asia/": "Asia",
    "Africa/": "Africa",
    "Australia/": "Oceania",
    "Pacific/": "Oceania",
    "Atlantic/": "Atlantic",
    "Indian/": "Indian Ocean",
    "Antarctica/": "Antarctica"
  };
  
  for (const [prefix, region] of Object.entries(regionMap)) {
    if (timezone.startsWith(prefix)) {
      return region;
    }
  }
  
  return "Unknown";
}

const db = admin.firestore();

exports.trackVisit = onRequest({
  cors: true,
  region: "us-central1",
}, async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({error: "Method not allowed"});
    }

    const {
      // Basic info
      path, 
      referrer, 
      userAgent, 
      platform,
      pageTitle,
      source,
      type,
      
      // Timing data
      timestamp,
      visitStart,
      loadTime,
      dayOfWeek,
      hourOfDay,
      domContentLoaded,
      resourcesLoaded,
      
      // Screen & Display
      screenWidth,
      screenHeight,
      screenDepth,
      pixelRatio,
      viewportWidth,
      viewportHeight,
      
      // Browser & Language
      language,
      languages,
      timezone,
      
      // Device capabilities
      touchScreen,
      cookieEnabled,
      onlineStatus,
      
      // Connection
      connectionType,
      connectionSpeed,
      
      // Hardware
      hardwareConcurrency,
      memorySize,
      
      // Browser features
      webGLSupport,
      localStorageEnabled,
      webRTCSupport,
      
      // Engagement (for engagement tracking)
      sessionDuration,
      maxScrollDepth,
      scrollMilestones,
      clickCount,
      interactions
    } = req.body;
    
    if (!path) {
      return res.status(400).json({error: "Path is required"});
    }

    const serverTimestamp = admin.firestore.Timestamp.now();
    
    // Country detection via IP is GDPR personal data, so we skip it
    // Instead we'll use timezone and language for geographic insights
    const region = getRegionFromTimezone(timezone);
    
    const sanitizedUserAgent = userAgent ? 
      userAgent.substring(0, 200) : "Unknown";

    // Handle different types of tracking data
    const isEngagement = type === 'engagement';
    
    const visitData = {
      // Basic fields
      path: path.substring(0, 500),
      timestamp: serverTimestamp,
      type: type || 'pageview',
      
      // Only include full data for pageviews
      ...(isEngagement ? {
        // Engagement-specific data
        sessionDuration: sessionDuration ? Math.min(sessionDuration, 7200000) : null, // Cap at 2 hours
        maxScrollDepth: maxScrollDepth ? Math.min(Math.max(maxScrollDepth, 0), 100) : null,
        scrollMilestones: scrollMilestones ? scrollMilestones.substring(0, 50) : null,
        clickCount: clickCount ? Math.min(clickCount, 10000) : null,
        interactions: interactions ? Math.min(interactions, 1000) : null
      } : {
        // Full pageview data
        referrer: referrer ? referrer.substring(0, 500) : null,
        userAgent: sanitizedUserAgent,
        platform: platform ? platform.substring(0, 100) : null,
        region,
        pageTitle: pageTitle ? pageTitle.substring(0, 200) : null,
        source: source ? source.substring(0, 100) : null,
        
        // Timing data
        visitStart: visitStart ? new Date(visitStart) : null,
        loadTime: loadTime ? Math.min(Math.max(loadTime, 0), 60000) : null,
        dayOfWeek: dayOfWeek !== undefined ? Math.min(Math.max(dayOfWeek, 0), 6) : null,
        hourOfDay: hourOfDay !== undefined ? Math.min(Math.max(hourOfDay, 0), 23) : null,
        domContentLoaded: domContentLoaded ? Math.min(Math.max(domContentLoaded, 0), 60000) : null,
        resourcesLoaded: resourcesLoaded ? Math.min(Math.max(resourcesLoaded, 0), 60000) : null,
        
        // Screen & Display
        screenWidth: screenWidth ? Math.floor(screenWidth) : null,
        screenHeight: screenHeight ? Math.floor(screenHeight) : null,
        screenDepth: screenDepth ? Math.floor(screenDepth) : null,
        pixelRatio: pixelRatio ? Math.round(pixelRatio * 10) / 10 : null,
        viewportWidth: viewportWidth ? Math.floor(viewportWidth) : null,
        viewportHeight: viewportHeight ? Math.floor(viewportHeight) : null,
        
        // Browser & Language
        language: language ? language.substring(0, 20) : null,
        languages: languages ? languages.substring(0, 100) : null,
        timezone: timezone ? timezone.substring(0, 50) : null,
        
        // Device capabilities
        touchScreen: touchScreen === true,
        cookieEnabled: cookieEnabled === true,
        onlineStatus: onlineStatus === true,
        
        // Connection
        connectionType: connectionType ? connectionType.substring(0, 20) : null,
        connectionSpeed: connectionSpeed ? Math.round(connectionSpeed * 100) / 100 : null,
        
        // Hardware
        hardwareConcurrency: hardwareConcurrency ? Math.min(Math.max(hardwareConcurrency, 1), 32) : null,
        memorySize: memorySize ? Math.min(Math.max(memorySize, 0.5), 32) : null,
        
        // Browser features
        webGLSupport: webGLSupport === true,
        localStorageEnabled: localStorageEnabled === true,
        webRTCSupport: webRTCSupport === true,
        
        // Initial engagement
        initialClickCount: clickCount ? Math.min(clickCount, 1000) : null,
        initialScrollDepth: maxScrollDepth ? Math.min(Math.max(maxScrollDepth, 0), 100) : null
      })
    };

    const batch = db.batch();

    const visitRef = db.collection("visits").doc();
    batch.set(visitRef, visitData);

    const pathKey = path.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 100);
    const counterRef = db.collection("counters").doc(pathKey);
    batch.set(counterRef, {
      path,
      count: admin.firestore.FieldValue.increment(1),
      lastVisit: serverTimestamp,
    }, {merge: true});

    await batch.commit();

    logger.info("Visit tracked", {path, region, timezone, type: type || 'pageview', sessionDuration});
    
    res.status(200).json({success: true});
  } catch (error) {
    logger.error("Error tracking visit:", error);
    res.status(500).json({error: "Internal server error"});
  }
});