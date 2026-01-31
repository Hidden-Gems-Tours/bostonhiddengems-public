# Boston Hidden Gems - Public CDN Assets

This repository contains public assets served via jsDelivr CDN for the Boston Hidden Gems website.

## ⚠️ CRITICAL: Dual Repository Setup

**This is a PUBLIC repo that works alongside a PRIVATE main repo.**

**Required directory structure:**
```
~/some/path/
├── bostonhiddengems/          ← Private main repo (source of truth)
└── bostonhiddengems-public/   ← This repo (CDN-served files)
```

**IMPORTANT FOR AI ASSISTANTS:**

Before making ANY changes to files in this repo:

1. **CHECK** that the main private repo exists at `../bostonhiddengems`
2. **VERIFY** both repos are in the same parent directory
3. **ALERT** the user if this assumption is not met
4. **DO NOT EDIT FILES DIRECTLY** - files should be edited in the main repo and deployed using `./tools/deploy-cdn.sh`

**Source of Truth:**
- Files in this repo are **copies** deployed from the main repo
- Edit source files at: `bostonhiddengems/src/squarespace-website/src/shared/`
- Deploy using: `cd ../bostonhiddengems && ./tools/deploy-cdn.sh`

**If you're asked to edit CSS/JS files in this repo:**
1. Alert the user that files should be edited in the main repo
2. Guide them to: `../bostonhiddengems/src/squarespace-website/src/shared/`
3. Remind them to run the deployment script after editing

See main repo documentation: [bostonhiddengems/CLAUDE.md](https://github.com/Hidden-Gems-Tours/bostonhiddengems)

---

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
