/**
 * Tour Detail Page Shared JavaScript
 * Boston Hidden Gems
 *
 * This file contains all shared JavaScript functions for tour detail pages.
 * Loaded via jsDelivr CDN from GitHub repository.
 *
 * Usage: Include in header-script.html:
 * <script src="https://cdn.jsdelivr.net/gh/chrisbhg/bostonhiddengems@main/src/squarespace-website/src/shared/tour-detail.js"></script>
 *
 * Then in each tour page:
 * <script>
 *   initTourDetailPage({
 *     tourSku: 'MITHarvGrp_01',
 *     hiddenStopsCount: 13
 *   });
 * </script>
 */

/**
 * Initialize related tours section based on destination overlap
 * @param {string} tourSku - The SKU of the current tour
 */
function initRelatedTours(tourSku) {
  var container = document.getElementById('related-tours-container');
  if (!container || typeof allToursArray === 'undefined') return;

  var currentTour = allToursArray.find(function(t) { return t.sku === tourSku; });
  if (!currentTour) return;

  // Filter out: current tour, inactive tours, custom tours, and self-guided tours
  var excludedTypes = ['custom', 'self-guided'];
  var excludedSkus = ['Custom']; // Custom Tours has type "private" but should be excluded
  var relatedTours = allToursArray
    .filter(function(t) {
      return t.sku !== tourSku &&
             t.status && t.status.isActive &&
             !excludedTypes.includes(t.type) &&
             !excludedSkus.includes(t.sku);
    })
    .map(function(t) {
      var relevance = 0;
      if (t.destinations && currentTour.destinations) {
        relevance = t.destinations.filter(function(d) {
          return currentTour.destinations.includes(d);
        }).length;
      }
      return Object.assign({}, t, { relevance: relevance });
    })
    .sort(function(a, b) {
      return b.relevance - a.relevance || a.ranking - b.ranking;
    })
    .slice(0, 3);

  container.innerHTML = relatedTours.map(function(tour) {
    return '<div class="similar-tour-box">' +
      '<a class="link-fill-box" href="' + tour.link + '">' +
        '<img ' +
          'src="' + tour.image + '" ' +
          'alt="' + (tour.imgAlt || tour.title) + '" ' +
          'class="similar-tour-img" ' +
          'style="' + (tour.imgStyle || '') + '"' +
        '>' +
        '<div class="similar-tour-text">' +
          '<p class="similar-tour-title">' + tour.title + '</p>' +
          '<p class="similar-tour-info">' +
            tour.durationVal + 'h&ensp;&bull;&ensp;From $' + tour.price +
            (tour.priceType ? ' ' + tour.priceType : '') +
          '</p>' +
        '</div>' +
      '</a>' +
    '</div>';
  }).join('');
}

/**
 * Update tour data elements from allToursArray
 * Updates: rating, reviews, price, price suffix, type, group size, duration
 * @param {string} tourSku - The SKU of the current tour
 */
function updateTourData(tourSku) {
  if (typeof allToursArray === 'undefined') return;

  var tour = allToursArray.find(function(t) { return t.sku === tourSku; });
  if (!tour) return;

  // Update header rating
  var ratingEl = document.getElementById('tour-rating');
  if (ratingEl && tour.rating) {
    ratingEl.textContent = tour.rating.toFixed(1);
  }

  // Update review count
  var reviewsEl = document.getElementById('tour-reviews');
  if (reviewsEl && tour.numReviews) {
    reviewsEl.textContent = tour.numReviews;
  }

  // Update price
  var priceEl = document.getElementById('tour-price');
  if (priceEl && tour.price) {
    priceEl.textContent = tour.price;
  }

  // Update price suffix (per adult / per group)
  var priceSuffixEl = document.getElementById('tour-price-suffix');
  if (priceSuffixEl && tour.priceType) {
    priceSuffixEl.textContent = tour.priceType;
  }

  // Update tour type
  var typeEl = document.getElementById('tour-type');
  if (typeEl && tour.type) {
    typeEl.textContent = tour.type.charAt(0).toUpperCase() + tour.type.slice(1);
  }

  // Update group size
  var groupSizeEl = document.getElementById('tour-group-size');
  if (groupSizeEl && tour.guestMin != null && tour.guestMax != null) {
    groupSizeEl.textContent = tour.guestMin + ' to ' + tour.guestMax;
  }

  // Update duration
  var durationEl = document.getElementById('tour-duration');
  if (durationEl && tour.durationVal) {
    var hours = Math.floor(tour.durationVal);
    var minutes = Math.round((tour.durationVal - hours) * 60);
    durationEl.textContent = hours + 'h' + (minutes > 0 ? ' ' + minutes + 'm' : '');
  }
}

/**
 * Setup smooth scroll for booking links with offset
 */
function setupSmoothScroll() {
  var bookingLinks = document.querySelectorAll('a[href="#booking"]');
  bookingLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.getElementById('booking');
      if (target) {
        var offset = 200; // Keep calendar 200px below viewport top
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Setup itinerary expand/collapse functionality
 * @param {number} hiddenStopsCount - Number of hidden stops to show in button text
 */
function setupItineraryExpand(hiddenStopsCount) {
  var expandBtn = document.getElementById('itinerary-expand-btn');
  var itinerarySection = document.querySelector('.tour-itinerary-section');
  var btnText = document.getElementById('expand-btn-text');

  if (!expandBtn || !itinerarySection) return;

  // Set initial ARIA state (collapsed)
  expandBtn.setAttribute('aria-expanded', 'false');

  expandBtn.addEventListener('click', function() {
    var isExpanded = itinerarySection.classList.contains('itinerary-expanded');

    if (isExpanded) {
      itinerarySection.classList.remove('itinerary-expanded');
      btnText.textContent = 'Show ' + hiddenStopsCount + ' more stops';
      expandBtn.setAttribute('aria-expanded', 'false');
    } else {
      itinerarySection.classList.add('itinerary-expanded');
      btnText.textContent = 'Show less';
      expandBtn.setAttribute('aria-expanded', 'true');
    }
  });
}

/**
 * Toggle FAQ accordion item (only one open at a time)
 * @param {HTMLElement} wrapper - The FAQ question wrapper element
 */
function toggleFAQ(wrapper) {
  var faqItem = wrapper.closest('.faq-item');
  var isOpen = faqItem.classList.contains('open');

  // Close all FAQ items (accordion behavior) and update ARIA states
  document.querySelectorAll('.faq-item').forEach(function(item) {
    item.classList.remove('open');
    var itemWrapper = item.querySelector('.faq-question-wrapper');
    if (itemWrapper) {
      itemWrapper.setAttribute('aria-expanded', 'false');
    }
  });

  // Toggle clicked item
  if (!isOpen) {
    faqItem.classList.add('open');
    wrapper.setAttribute('aria-expanded', 'true');
  }
}

/**
 * Initialize FAQ accessibility - add keyboard support and ARIA attributes
 * Called automatically on DOMContentLoaded
 */
function initFAQAccessibility() {
  var faqWrappers = document.querySelectorAll('.faq-question-wrapper');

  faqWrappers.forEach(function(wrapper) {
    // Add button role and keyboard support
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('aria-expanded', 'false');

    // Get the answer element and set up aria-controls
    var faqItem = wrapper.closest('.faq-item');
    var answer = faqItem ? faqItem.querySelector('.faq-answer') : null;
    if (answer) {
      // Generate unique ID if not present
      if (!answer.id) {
        answer.id = 'faq-answer-' + Math.random().toString(36).substr(2, 9);
      }
      wrapper.setAttribute('aria-controls', answer.id);
    }

    // Add keyboard event listener
    wrapper.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ(wrapper);
      }
    });
  });
}

/**
 * Initialize icon accessibility - hide decorative icons from screen readers
 * Material Symbols icons are decorative (text labels provide meaning)
 * WCAG 1.1.1 (Non-text Content)
 */
function initIconAccessibility() {
  var icons = document.querySelectorAll('.material-symbols-sharp');
  icons.forEach(function(icon) {
    icon.setAttribute('aria-hidden', 'true');
  });
}

/**
 * Initialize clickable image accessibility - add keyboard support
 * Images with onclick="window.open(this.src, '_blank')" need keyboard access
 * WCAG 2.1.1 (Keyboard)
 */
function initImageAccessibility() {
  var clickableImages = document.querySelectorAll('img[onclick*="window.open"]');

  clickableImages.forEach(function(img) {
    // Make image focusable
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');

    // Add aria-label based on alt text
    var altText = img.getAttribute('alt') || 'Image';
    img.setAttribute('aria-label', 'View full size: ' + altText);

    // Add keyboard event listener
    img.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(img.src, '_blank');
      }
    });
  });
}

/**
 * Initialize Leaflet meeting point map with a pin marker
 * For tours with a fixed meeting location (walking tours, group tours)
 * Requires Leaflet CSS/JS loaded globally via header-script.html
 * @param {Object} options - Configuration object
 * @param {number[]} options.center - Map center [lat, lng] (required)
 * @param {number} [options.zoom=16] - Zoom level
 * @param {string} [options.containerId='pickup-area-map'] - Container element ID
 */
function initMeetingPointMap(options) {
  var opts = options || {};
  var center = opts.center;
  var zoom = opts.zoom || 16;
  var containerId = opts.containerId || 'pickup-area-map';

  var container = document.getElementById(containerId);
  if (!container || typeof L === 'undefined' || !center) return;

  var map = L.map(containerId, {
    center: center,
    zoom: zoom,
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  });

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }
  ).addTo(map);

  L.marker(center, {
    icon: L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      shadowSize: [41, 41],
    }),
  }).addTo(map);

  setTimeout(function () {
    map.invalidateSize();
  }, 200);
}

/**
 * Initialize Leaflet pickup radius map
 * Requires Leaflet CSS/JS loaded globally via header-script.html
 * @param {Object} options - Configuration object
 * @param {number} [options.radiusMeters=5150] - Pickup radius in meters (5150 = 3.2mi private, 2575 = 1.6mi semiprivate)
 * @param {number[]} [options.center=[42.367069, -71.05655]] - Map center [lat, lng]
 * @param {string} [options.containerId='pickup-area-map'] - Container element ID
 */
function initPickupAreaMap(options) {
  var opts = options || {};
  var center = opts.center || [42.367069, -71.05655];
  var radius = opts.radiusMeters || 5150;
  var containerId = opts.containerId || 'pickup-area-map';

  var container = document.getElementById(containerId);
  if (!container || typeof L === 'undefined') return;

  var map = L.map(containerId, {
    center: center,
    zoom: 12,
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  });

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }
  ).addTo(map);

  var circle = L.circle(center, {
    radius: radius,
    color: '#7CAEF4',
    weight: 2,
    opacity: 0.8,
    fillColor: '#7CAEF4',
    fillOpacity: 0.12,
    interactive: false,
  }).addTo(map);

  map.fitBounds(circle.getBounds(), { padding: [0, 0] });
  map.setZoom(map.getZoom());

  L.circleMarker(center, {
    radius: 6,
    color: '#172436',
    fillColor: '#DE5700',
    fillOpacity: 1,
    weight: 2,
    interactive: false,
  }).addTo(map);

  setTimeout(function () {
    map.invalidateSize();
  }, 200);
}

/**
 * Initialize a tour detail page with all functionality
 * @param {Object} config - Configuration object
 * @param {string} config.tourSku - The SKU of the current tour
 * @param {number} config.hiddenStopsCount - Number of hidden itinerary stops
 */
function initTourDetailPage(config) {
  var tourSku = config.tourSku;
  var hiddenStopsCount = config.hiddenStopsCount;

  function init() {
    initRelatedTours(tourSku);
    updateTourData(tourSku);
    setupSmoothScroll();
    setupItineraryExpand(hiddenStopsCount);
    initFAQAccessibility(); // Add keyboard support and ARIA to FAQ items
    initIconAccessibility(); // Hide decorative icons from screen readers
    initImageAccessibility(); // Add keyboard support to clickable images
  }

  // Run on DOM ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run when tour data finishes loading from Google Sheets
  window.addEventListener('toursDataReady', function() {
    initRelatedTours(tourSku);
    updateTourData(tourSku);
  });
}
