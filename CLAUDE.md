# Claude Development Instructions

This file contains project-specific instructions and workflows for Claude Code development.

## Project Overview

This is Edmond Miu's portfolio website built with:
- **Framework**: Vite (vanilla HTML/CSS/JS)
- **Architecture**: Component-based (header/footer loaded dynamically)
- **Styling**: CSS with custom properties
- **Hosting**: Firebase (configuration in `firebase.json`)

## Development Workflow

### Starting Development
```bash
npm run dev
# Site runs at http://localhost:5173/
```

### Building for Production
```bash
npm run build
npm run preview  # Preview build at http://localhost:4173/
```

## Git Workflows & Branching

Since Claude Code doesn't have built-in branching/checkpointing, use these git workarounds:

### Create Experimental Branch
```bash
# Create and switch to new experimental branch
git checkout -b experiment-<feature-name>

# Example: testing new layout
git checkout -b experiment-new-homepage-layout
```

### Create Checkpoints
```bash
# Save current work as a checkpoint
git add .
git commit -m "Checkpoint: <description of current state>"

# Example
git commit -m "Checkpoint: added new navigation, testing responsiveness"
```

### Restore/Rollback
```bash
# Rollback to previous commit (lose current changes)
git reset --hard HEAD~1

# Rollback to specific commit
git reset --hard <commit-hash>

# Soft rollback (keep changes in working directory)
git reset --soft HEAD~1
```

### Switch Between Branches
```bash
# Switch back to main
git checkout main

# Switch to experimental branch
git checkout experiment-new-homepage-layout

# List all branches
git branch -a
```

### Safe Experimentation Pattern
```bash
# 1. Create checkpoint on main
git add . && git commit -m "Checkpoint: stable state before experiment"

# 2. Create experimental branch
git checkout -b experiment-footer-redesign

# 3. Make changes and test
# ... make changes ...
git add . && git commit -m "Test: new footer design"

# 4a. If successful - merge back to main
git checkout main
git merge experiment-footer-redesign
git branch -d experiment-footer-redesign

# 4b. If unsuccessful - abandon and return to main
git checkout main
git branch -D experiment-footer-redesign  # Force delete
```

## Component System

### Adding New Components
1. Create HTML file in `components/` directory
2. Add to JavaScript loading in `assets/js/main.js`
3. Test component loads correctly

### Component Requirements
- Must be valid HTML elements (not just text)
- Avoid script tags (Vite injects its own)
- Use semantic HTML5 elements

### Troubleshooting Component Loading
- Check browser console for errors
- Verify component paths are correct
- Ensure components don't have conflicting IDs

## Testing Commands

### Lint & Type Check
Currently no linting configured. Consider adding:
```bash
# Add to package.json scripts if needed
npm run lint
npm run typecheck
```

### Manual Testing Checklist
- [ ] Header loads and navigation works
- [ ] Footer loads with correct copyright year
- [ ] All project links work
- [ ] Gallery loads properly
- [ ] Lottie animation plays
- [ ] Mobile responsiveness
- [ ] All images load correctly

## Deployment

### Firebase Hosting
```bash
# Build and deploy
npm run build
firebase deploy

# Deploy specific directory
firebase deploy --only hosting
```

### GitHub Pages (Alternative)
If switching to GitHub Pages, update build output and configure properly.

## File Structure

### Core Files (Don't Delete)
- `index.html` - Homepage
- `components/` - Header, footer, shared components
- `pages/` - Individual pages (about, projects, gallery)
- `assets/` - CSS, JS, images, videos
- `package.json` - Dependencies and scripts
- `firebase.json` - Hosting configuration

### Backup Files
- `_backup/` - Contains all moved legacy files
- `CLEANUP_LOG.md` - Details of what was moved where
- Can be restored if needed (see cleanup log)

## Common Issues

### Footer Not Loading
- Usually caused by Vite script injection interfering with component selection
- Fixed in current codebase with script tag filtering

### Images Not Loading
- Check paths are correct (relative to site root)
- Verify images exist in `assets/images/`

### JavaScript Errors
- Check browser console
- Verify all external scripts load correctly
- Test component loading in isolation

## Performance Tips

- Components are cached after first load
- Preloading is configured for header/footer
- Images use lazy loading where appropriate
- Consider optimizing large images in `assets/images/`

## Future Enhancements

- Add TypeScript for better development experience
- Add automated testing framework
- Add linting (ESLint, Prettier)
- Consider moving to a framework (Vue, React) if complexity grows
- Add CI/CD pipeline for automated deployment