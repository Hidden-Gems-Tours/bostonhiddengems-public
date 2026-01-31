# CLAUDE.md - Boston Hidden Gems Public CDN Repository

## Overview

This is a **public repository** containing client-side assets served via jsDelivr CDN for the Boston Hidden Gems website (www.bostonhiddengems.com). The repository provides shared JavaScript and CSS files that are loaded across multiple pages of the main website.

Boston Hidden Gems is a family-owned receptive tour operator providing private, shared, and custom tours in Boston, Massachusetts.

## Security Requirements

**This is a public repository. All code here is visible to anyone on the internet.**

### Never Commit

The following must **NEVER** be committed to this repository:

- API keys, tokens, or credentials of any kind
- Passwords or secrets
- OAuth tokens or client secrets
- Environment variables containing sensitive data
- Database connection strings
- Internal business logic or pricing algorithms
- Customer data or PII (personally identifiable information)
- Private configuration files
- `.env` files or any environment configuration
- GCP, AWS, or cloud provider credentials
- Internal API endpoints or URLs
- Email addresses (except public contact info)
- Internal documentation or business processes

### Before Every Commit

1. Review all changes with `git diff --staged`
2. Ensure no sensitive data is included
3. Verify no hardcoded credentials exist in the code
4. Check that no internal URLs or endpoints are exposed
5. Confirm no business-sensitive logic is revealed

## Repository Contents

### Current Files

| File | Purpose | Size |
|------|---------|------|
| `tour-listing.js` | Tour card rendering, filtering, and sorting functions | ~16KB |
| `tour-detail.js` | Shared JavaScript utilities for tour detail pages | ~6KB |
| `tour-detail.css` | Shared CSS styles for tour detail pages | ~15KB |

### What Belongs Here

- Reusable JavaScript functions for the website frontend
- CSS stylesheets for shared components
- Static assets that need CDN distribution
- Code that is safe for public visibility

### What Does NOT Belong Here

- Tour data arrays or business information
- Pricing logic or calculations
- API integration code with endpoints
- Authentication or authorization code
- Internal tooling or scripts
- Sensitive business logic

## CDN Usage

Files are served via jsDelivr CDN. Reference files using:

```html
<!-- Latest from main branch -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Hidden-Gems-Tours/bostonhiddengems-public@main/tour-detail.css">
<script src="https://cdn.jsdelivr.net/gh/Hidden-Gems-Tours/bostonhiddengems-public@main/tour-detail.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Hidden-Gems-Tours/bostonhiddengems-public@main/tour-listing.js"></script>

<!-- Versioned (recommended for production) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Hidden-Gems-Tours/bostonhiddengems-public@v1.0.0/tour-detail.css">
```

### Versioning Best Practices

- Use `@main` for development and testing
- Use versioned tags (e.g., `@v1.0.0`) for production
- Create releases for stable versions to ensure cache consistency
- The CDN caches files, so versioned URLs are recommended for production deployments

### Cache Purging

If you need to purge the CDN cache after updates to `main`:

```
https://purge.jsdelivr.net/gh/Hidden-Gems-Tours/bostonhiddengems-public@main/[filename]
```

## Technology Stack

- **JavaScript**: Vanilla ES6+ (no framework dependencies)
- **CSS**: Standard CSS3 with CSS custom properties
- **Target Browsers**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **No Build Process**: Files are served as-is

## Code Style Guidelines

### JavaScript

- Use vanilla JavaScript (no jQuery or framework dependencies)
- ES6+ features are acceptable (const, let, arrow functions, template literals)
- Functions should be self-contained and reusable
- Include JSDoc comments for public functions
- Avoid global namespace pollution - use namespaces or IIFE patterns

### CSS

- Use CSS custom properties (variables) for theming
- Mobile-first responsive design (breakpoint: 767px)
- Use semantic class names
- Avoid `!important` unless absolutely necessary
- Keep specificity low for easier overrides

### Design System Reference

**Colors** (CSS custom properties):
- Primary Blue: `#7CAEF4`
- Secondary Navy: `#172436`
- Accent Orange: `#DE5700`
- Gold (ratings): `#FFD700`
- Silver: `#AAA9AD`
- Bronze: `#CD7F32`

**Typography**:
- Primary Font: Aktiv Grotesk
- Accent Font: Charm

**Responsive Breakpoint**: 767px (mobile <= 767px, desktop >= 768px)

## Development Workflow

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hidden-Gems-Tours/bostonhiddengems-public.git
   ```

2. **Make changes locally**
   - Edit files directly (no build process required)
   - Test by loading files in a browser or local server

3. **Review changes carefully**
   ```bash
   git diff
   git diff --staged
   ```

4. **Commit with descriptive messages**
   ```bash
   git add [specific-files]
   git commit -m "Brief description of changes"
   ```

5. **Push to main**
   ```bash
   git push origin main
   ```

6. **For production releases, create a version tag**
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

## Testing

Since these files are loaded in the Squarespace website:

1. Test locally by including files via `file://` or local server
2. Push to main branch for CDN testing
3. Verify in browser developer console (no errors)
4. Check responsive behavior at various screen sizes
5. Validate cross-browser compatibility

## File Descriptions

### tour-listing.js

Provides the `renderTourCards()` function for displaying filterable tour cards:

- Renders tour cards into specified containers
- Supports filtering by type, destination, transport, duration
- Supports sorting by price, rating, reviews, duration
- Handles responsive display and mobile optimization

### tour-detail.js

Shared utilities for individual tour detail pages:

- Common UI interactions
- Responsive behavior helpers
- Shared component functionality

### tour-detail.css

Shared styles for tour detail pages:

- Tour header styling
- Content layout
- Responsive breakpoints
- Component styles (buttons, cards, etc.)

## Contact

For questions about this repository, contact the Boston Hidden Gems development team.

Website: www.bostonhiddengems.com
