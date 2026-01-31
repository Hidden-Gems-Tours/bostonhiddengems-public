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

  var relatedTours = allToursArray
    .filter(function(t) {
      return t.sku !== tourSku && t.status && t.status.isActive;
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
 * Update tour data elements from allToursArray (rating, reviews, price, type)
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

  // Update tour type
  var typeEl = document.getElementById('tour-type');
  if (typeEl && tour.type) {
    typeEl.textContent = tour.type.charAt(0).toUpperCase() + tour.type.slice(1);
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

  expandBtn.addEventListener('click', function() {
    var isExpanded = itinerarySection.classList.contains('itinerary-expanded');

    if (isExpanded) {
      itinerarySection.classList.remove('itinerary-expanded');
      btnText.textContent = 'Show ' + hiddenStopsCount + ' more stops';
    } else {
      itinerarySection.classList.add('itinerary-expanded');
      btnText.textContent = 'Show less';
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

  // Close all FAQ items (accordion behavior)
  document.querySelectorAll('.faq-item').forEach(function(item) {
    item.classList.remove('open');
  });

  // Toggle clicked item
  if (!isOpen) {
    faqItem.classList.add('open');
  }
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
    // toggleFAQ is already global via onclick handlers in HTML
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
