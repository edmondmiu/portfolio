# Edmond Miu Website

A clean, modern static website built for maintainability and manual editing.

## Project Structure

```
/
├── assets/
│   ├── css/
│   │   ├── main.css              # Main stylesheet with CSS custom properties
│   │   ├── components/           # Component-specific styles (future)
│   │   └── themes/               # Theme variants (future)
│   ├── js/
│   │   ├── main.js               # Main JavaScript
│   │   └── modules/              # Feature-specific JS (future)
│   ├── images/
│   │   ├── projects/             # Project thumbnails
│   │   ├── graphics/             # Graphic design portfolio
│   │   └── ui/                   # Icons, logos, favicons
│   └── fonts/                    # Local fonts (if needed)
├── pages/
│   ├── about/                    # About page
│   ├── projects/                 # Project portfolio
│   │   ├── index.html           # Projects overview
│   │   ├── novahub/             # Individual project pages
│   │   ├── simulate/
│   │   └── linking-products/
│   └── blog/                     # Future blog posts
├── components/                   # Reusable HTML components
│   ├── header.html              # Site header
│   ├── footer.html              # Site footer
│   └── html-head.html           # HTML head template
├── index.html                    # Homepage
├── manifest.json                 # Web app manifest
├── robots.txt                    # Search engine instructions
├── sitemap.xml                   # Site structure for SEO
├── firebase.json                 # Firebase hosting config
└── README.md                     # This file
```

## Key Features

### Modern Architecture
- **Semantic HTML5** structure
- **CSS Custom Properties** for easy theming
- **Clean URLs** via Firebase hosting
- **Component-based** approach for reusability
- **Future-ready** for blog content and theming

### Performance & SEO
- Optimized images with proper alt text
- Lazy loading for non-critical images
- Preconnect to external fonts
- Proper Open Graph and Twitter meta tags
- Sitemap and robots.txt for search engines

### Developer Experience
- Clean, readable code structure
- Consistent naming conventions
- Reusable components for copy-paste editing
- CSS custom properties for easy customization
- Firebase hosting with caching and redirects

## Making Changes

### Adding New Pages
1. Create a new directory in `pages/`
2. Add an `index.html` file
3. Copy the HTML structure from existing pages
4. Update the `<title>`, meta tags, and navigation
5. Update `sitemap.xml` with the new page

### Adding New Projects
1. Create a new directory in `pages/projects/`
2. Add project images to `assets/images/projects/`
3. Create an `index.html` for the project details
4. Update the project grid on homepage to link to it

### Customizing Styles
All main colors and spacing are defined as CSS custom properties in `assets/css/main.css`:

```css
:root {
    --primary-color: #00a0ff;        /* Main brand color */
    --text-color: #d2d2d2;           /* Body text */
    --background-color: #0a1020;     /* Page background */
    --container-width: 1200px;       /* Max content width */
    /* ... more variables */
}
```

### Using Components
The `components/` folder contains reusable HTML snippets:

- `header.html` - Site navigation
- `footer.html` - Site footer  
- `html-head.html` - Complete HTML head with placeholders

Copy and paste these into new pages, replacing placeholders like `{{TITLE}}` with actual content.

### Future Enhancements

#### Adding Dark Mode
The CSS is already structured with custom properties. Add a toggle and alternate color scheme:

```css
[data-theme="dark"] {
    --background-color: #000;
    --text-color: #fff;
}
```

#### Adding a Blog
1. Create blog post directories in `pages/blog/`
2. Add a blog index page listing all posts
3. Update navigation to include blog link
4. Consider using a simple static site generator later if needed

#### Adding Contact Form
Firebase hosting can handle form submissions via Firebase Functions.

## Deployment

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Deploy: `firebase deploy`

The `firebase.json` config includes:
- Clean URLs (no `.html` extensions)
- Asset caching for performance
- Redirects from old WordPress URLs
- Proper headers for static assets

### Custom Domain
Once deployed, add your custom domain in the Firebase console under Hosting settings.

## Migration Notes

This structure is built from the cleaned `static-site/` version rather than the WordPress export. Key improvements:

- Removed WordPress/Elementor classes and structure
- Semantic HTML5 elements
- Modern CSS with custom properties
- Optimized asset organization
- Firebase-ready configuration

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox required
- CSS Custom Properties required
- ES6+ JavaScript features used

For broader support, consider adding autoprefixer and Babel transpilation. 