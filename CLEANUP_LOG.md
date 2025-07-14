# Portfolio Cleanup Log

Date: 2025-07-14
Purpose: Clean up portfolio repository by moving unnecessary files to backup folder

## Files/Folders Being Moved to `_backup/`

### WordPress Legacy Files (SAFE TO DELETE)
- `wp-content/` - WordPress plugins, themes, uploads directory
- `wp-includes/` - WordPress core includes directory
- `wp-json/` - WordPress JSON API endpoints
- `xmlrpc0db0.php` - WordPress XML-RPC file

### Duplicate/Legacy HTML Files (SAFE TO DELETE)
- `about/index.html` - Duplicate of `pages/about/index.html`
- `index193e.html` - Old WordPress export file
- `index2207.html` - Old WordPress export file
- `index2dc4.html` - Old WordPress export file
- `index4034.html` - Old WordPress export file
- `index7a41.html` - Old WordPress export file
- `index9d31.html` - Old WordPress export file
- `indexcaae.html` - Old WordPress export file
- `indexe5a2.html` - Old WordPress export file
- `indexf6a9.html` - Old WordPress export file
- `devhomepage.html` - Development file
- `transparent.html` - Unknown purpose file

### Legacy Pages (NO LONGER NEEDED)
- `comments/feed/` - WordPress comments feed
- `feed/` - RSS feed directory
- `cookie-declaration-2/` - GDPR compliance (no tracking anymore)
- `privacy-policy/` - Legal page (no longer needed)

### Development Boilerplate Files (SAFE TO DELETE)
- `src/` - Vite boilerplate files (counter.js, javascript.svg, main.js, style.css)
- `public/vite.svg` - Vite logo
- `static-site/` - Duplicate static version of site
- `vite.log` - Log file (should be in .gitignore)

### Various Project Folders (CONDITIONAL - REVIEW LATER)
- `hotel-booking/` - Legacy project page
- `linking-flows/` - Legacy project page
- `micro-interations/` - Legacy project page (typo in name)
- `saas-design-system/` - Legacy project page
- `simulate-v2/` - Legacy project page
- `simulate/` - Legacy project page (duplicate of pages/projects/simulate/)

## Revert Instructions

To restore any files if needed:
1. Copy files back from `_backup/` to project root
2. Update .gitignore if needed
3. Reinstall any dependencies if WordPress files are restored

## Files Being Kept

### Core Site Files
- `index.html` - Main homepage
- `components/` - Header, footer, html-head components
- `pages/` - Modern page structure
- `assets/` - CSS, JS, images, videos
- `manifest.json`, `robots.txt`, `sitemap.xml` - Site metadata
- `firebase.json` - Hosting configuration
- `package.json`, `package-lock.json` - Dependencies
- `README.md` - Documentation

### Empty Directories to Remove
- `assets/css/components/` - Empty
- `assets/css/themes/` - Empty
- `assets/fonts/` - Empty
- `assets/js/modules/` - Empty
- `pages/blog/` - Empty