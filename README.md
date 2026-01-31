# Boston Hidden Gems - Public CDN Assets

This repository contains public assets served via jsDelivr CDN for the Boston Hidden Gems website.

## Contents

- **tour-detail.css** (~15KB) - Shared styles for all tour detail pages
- **tour-detail.js** (~6KB) - Shared JavaScript functions for tour detail pages
- **tour-listing.js** (~16KB) - Tour card rendering and filtering functions

## Usage

These files are loaded via CDN in the main website:

```html
<!-- In header-script.html -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Hidden-Gems-Tours/bostonhiddengems-public@main/tour-detail.css">
<script src="https://cdn.jsdelivr.net/gh/Hidden-Gems-Tours/bostonhiddengems-public@main/tour-detail.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Hidden-Gems-Tours/bostonhiddengems-public@main/tour-listing.js"></script>
```

## Why a Separate Public Repo?

- Main business repository remains private
- jsDelivr CDN requires public repositories
- Separates public-facing code from business logic and sensitive data

## CDN Benefits

- Browser caching across pages
- Gzip/Brotli compression (65% size reduction)
- Global CDN distribution
- Reduces code duplication across tour pages

---

**Main Repository**: [bostonhiddengems](https://github.com/Hidden-Gems-Tours/bostonhiddengems) (private)
