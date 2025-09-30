# Portfolio Website - Implementation Guide
**AI Crawler Optimization + Technical Fixes**
**Date: September 30, 2025**

---

## Quick Overview

This guide provides technical fixes and AI optimization for edmondmiu.com. All content rewrites are in **`HUMAN_VOICE_REWRITES.md`** to match your actual writing style.

**Priority Levels:**
- 🔴 **CRITICAL** - Do first (20 minutes)
- 🟡 **HIGH** - Do within 1 week
- 🟢 **MEDIUM** - Do within 2-3 weeks

---

## 🔴 CRITICAL FIXES (20 Minutes)

### 1. Fix Broken Link in Simulate Page

**File**: `pages/projects/simulate/index.html`
**Line**: 200

```html
<!-- BEFORE: -->
<a href="/saas-design-system/">here</a>

<!-- AFTER: -->
<a href="/pages/projects/novahub/">here</a>
```

### 2. Update Sitemap.xml

**File**: `sitemap.xml`

Replace entire file with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.edmondmiu.com/</loc>
    <lastmod>2025-09-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.edmondmiu.com/pages/about/</loc>
    <lastmod>2025-09-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.edmondmiu.com/pages/projects/simulate/</loc>
    <lastmod>2025-09-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.edmondmiu.com/pages/projects/novahub/</loc>
    <lastmod>2025-09-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.edmondmiu.com/pages/projects/linking-products/</loc>
    <lastmod>2025-09-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.edmondmiu.com/pages/gallery/</loc>
    <lastmod>2025-09-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.edmondmiu.com/pages/projects/</loc>
    <lastmod>2025-09-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 3. Add Schema.org to Homepage

**File**: `index.html`
**Location**: Add before `</head>` tag (after line 43)

```html
<!-- Structured Data for AI Crawlers -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Edmond Miu",
  "jobTitle": "Head of Design",
  "worksFor": {
    "@type": "Organization",
    "name": "Logifuture"
  },
  "description": "Head of Design with 15+ years experience building design systems and leading teams. Built design systems serving 50+ users for 7 years. Launched products to 300k+ daily active users.",
  "url": "https://www.edmondmiu.com",
  "knowsAbout": [
    "Design Systems",
    "Product Design",
    "UX Strategy",
    "Team Leadership",
    "0-1 Product Development",
    "User Research",
    "Design Ops",
    "Atomic Design",
    "Multi-Brand Strategy",
    "Figma",
    "Material UI"
  ],
  "yearsOfExperience": "15+"
}
</script>
```

### 4. Add Schema.org to Case Studies

**Simulate** (`pages/projects/simulate/index.html` - add before `</head>` after line 19):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Simulate Sports Betting App Case Study",
  "author": {
    "@type": "Person",
    "name": "Edmond Miu",
    "jobTitle": "Lead Product Designer"
  },
  "datePublished": "2020",
  "description": "Led design of sports betting app from 5k to 300k daily bets in 14 months. Individual design contributor for branding, user flows, and developer support.",
  "keywords": "Product Design, User Research, Mobile App Design, Prototyping, Animation Design, Sports Betting, MVP",
  "outcome": [
    "300,000 daily bets (from 5,000 in 2 weeks)",
    "320,000 bets peak day",
    "30,000 daily bets in retail",
    "14 month growth"
  ]
}
</script>
```

**NovaHub** (`pages/projects/novahub/index.html` - add before `</head>` after line 13):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "NovaHub SaaS Design System Case Study",
  "author": {
    "@type": "Person",
    "name": "Edmond Miu",
    "jobTitle": "Design System Architect"
  },
  "datePublished": "2017",
  "description": "Built SaaS design system with 5,000+ components serving 50+ users for 7+ years. Led initiative as sole designer supporting 6 developers.",
  "keywords": "Design Systems, Atomic Design, Component Libraries, Material UI, Figma, SaaS",
  "outcome": [
    "5,000+ components built",
    "50+ users served",
    "7+ years active use",
    "1 designer supporting 6 developers"
  ]
}
</script>
```

**Linking Products** (`pages/projects/linking-products/index.html` - add before `</head>` after line 13):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Linking Products Integration Case Study",
  "author": {
    "@type": "Person",
    "name": "Edmond Miu",
    "jobTitle": "Lead UX Designer"
  },
  "datePublished": "2021",
  "description": "Eliminated manual CSV workflows by designing integration flows between SaaS products. Reduced errors through workshop facilitation and MVP scoping.",
  "keywords": "User Flow Design, Workshop Facilitation, MVP Scoping, Integration Design, SaaS",
  "outcome": [
    "Eliminated manual CSV workflows",
    "Reduced user errors",
    "Seamless product integration"
  ]
}
</script>
```

### 5. Update Meta Descriptions

Use versions from **`HUMAN_VOICE_REWRITES.md`** - they match your voice while still being AI-friendly.

---

## 🟡 HIGH PRIORITY (1 Week)

### 1. Update About Page

**File**: `pages/about/index.html`

Replace lines 47-55 with the version in **`HUMAN_VOICE_REWRITES.md`**

Key changes:
- H1: "Yo New fone Who dis?" → "About Me"
- Add professional intro that still sounds like you
- Keep Q&A section (it's good)

### 2. Update Homepage Hero

**File**: `index.html`
**Lines**: 61-64

Use the version in **`HUMAN_VOICE_REWRITES.md`** that adds metrics naturally.

### 3. Update Project Card Descriptions

**File**: `index.html`
**Lines**: 80-143

Use versions in **`HUMAN_VOICE_REWRITES.md`** that mention outcomes while keeping your voice.

### 4. Add Canonical URLs

Add to each page's `<head>`:

```html
<!-- Homepage -->
<link rel="canonical" href="https://www.edmondmiu.com/">

<!-- About -->
<link rel="canonical" href="https://www.edmondmiu.com/pages/about/">

<!-- Simulate -->
<link rel="canonical" href="https://www.edmondmiu.com/pages/projects/simulate/">

<!-- NovaHub -->
<link rel="canonical" href="https://www.edmondmiu.com/pages/projects/novahub/">

<!-- Linking Products -->
<link rel="canonical" href="https://www.edmondmiu.com/pages/projects/linking-products/">

<!-- Gallery -->
<link rel="canonical" href="https://www.edmondmiu.com/pages/gallery/">
```

### 5. Fix Contact Link

**File**: `components/header.html`
**Line**: 14

**Options:**
A) Remove the Contact link entirely
B) Create a simple contact page
C) Link to LinkedIn/email

Recommendation: Remove it or change to external link like LinkedIn.

### 6. Fix Projects Index Page

**File**: `pages/projects/index.html`
**Lines**: 72-79

Replace placeholder content with actual project grid (copy from homepage lines 78-144).

---

## 🟢 MEDIUM PRIORITY (2-3 Weeks)

### 1. Add Skip-to-Content Link

**File**: All HTML files
**Location**: Right after `<body>` tag

```html
<a href="#main" class="skip-to-content">Skip to main content</a>
```

Add CSS to `main.css`:

```css
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background: #1eb7ff;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-to-content:focus {
  top: 0;
}
```

### 2. Add ARIA Labels to Mobile Menu

**File**: `assets/js/main.js`
**Lines**: 133-136

```javascript
// Update mobile menu button creation
const mobileMenuButton = document.createElement('button');
mobileMenuButton.className = 'mobile-menu-button';
mobileMenuButton.setAttribute('aria-label', 'Toggle navigation menu');
mobileMenuButton.setAttribute('aria-expanded', 'false');
mobileMenuButton.innerHTML = '<span></span><span></span><span></span>';

// Update toggle event
mobileMenuButton.addEventListener('click', () => {
    const menu = document.querySelector('.nav-menu');
    const isExpanded = menu.classList.toggle('active');
    mobileMenuButton.classList.toggle('active');
    mobileMenuButton.setAttribute('aria-expanded', isExpanded);
});
```

### 3. Add Gallery Meta Description

**File**: `pages/gallery/index.html`
**Line**: Add after line 6

```html
<meta name="description" content="Photography portfolio by Edmond Miu. Street photography, landscapes, and artistic photography.">
```

### 4. Test & Fix Color Contrast

Use browser DevTools to check WCAG contrast ratios:
- Text should be at least 4.5:1
- Large text (18pt+) should be at least 3:1

---

## 📋 Implementation Checklist

```
CRITICAL (20 minutes) 🔴
☐ Fix broken link in Simulate page
☐ Update sitemap.xml with all pages
☐ Add Schema.org to homepage
☐ Add Schema.org to Simulate case study
☐ Add Schema.org to NovaHub case study
☐ Add Schema.org to Linking Products case study
☐ Update meta descriptions (use HUMAN_VOICE_REWRITES.md)

HIGH (1 week) 🟡
☐ Rewrite About page intro (use HUMAN_VOICE_REWRITES.md)
☐ Update homepage hero (use HUMAN_VOICE_REWRITES.md)
☐ Update project cards (use HUMAN_VOICE_REWRITES.md)
☐ Add canonical URLs to all pages
☐ Fix or remove Contact link
☐ Fix Projects index placeholder content

MEDIUM (2-3 weeks) 🟢
☐ Add skip-to-content links
☐ Add ARIA labels to mobile menu
☐ Add gallery meta description
☐ Test color contrast
☐ Test keyboard navigation
```

---

## What This Achieves

After implementing Critical + High priority items:

### AI Crawlers Will Find:
- "Edmond Miu led Simulate from 5k to 300k daily bets"
- "Built design system with 5,000+ components used for 7+ years"
- "Head of Design with 15+ years experience"
- "Sole designer supporting 6 developers and 50+ users"

### Content Still Sounds Like You:
- Your natural voice in all visible text
- British English spellings
- Casual, storytelling tone
- Emoji usage preserved

### Technical SEO Fixed:
- No broken links
- Complete sitemap
- Proper heading hierarchy
- Good accessibility foundation

---

## Files Reference

- **`HUMAN_VOICE_REWRITES.md`** - All content rewrites in your voice
- **`IMPLEMENTATION_GUIDE.md`** - This file - technical fixes
- **`CLAUDE.md`** - Development instructions (already exists)

---

## Quick Start

1. Do all Critical items (20 minutes)
2. Use content from HUMAN_VOICE_REWRITES.md for About/Homepage
3. Test on mobile
4. Deploy

**Total time for Critical + High**: ~2-3 hours
**Impact**: AI crawlers immediately understand your portfolio
