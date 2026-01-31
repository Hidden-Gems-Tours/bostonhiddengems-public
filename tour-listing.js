/**
 * Tour Listing Shared Functionality
 *
 * This file contains shared tour listing functions loaded via CDN (jsDelivr).
 * These functions are used across multiple tour listing pages to render and filter tours.
 *
 * Functions included:
 * - fetchReviewData() - Fetches review data from Google Sheets
 * - updateTourRatings() - Merges review data with tour objects
 * - renderTourCards() - Renders tour cards with flexible filtering
 * - onToursReady() - Callback system for tour data initialization
 * - initializeTours() - IIFE that initializes tours on page load
 *
 * Dependencies:
 * - Requires global allToursArray variable (defined in header-script.html)
 * - Uses Material Symbols icons (loaded in header-script.html)
 *
 * CDN Usage:
 * <script src="https://cdn.jsdelivr.net/gh/cwylie93/bostonhiddengems-public@main/tour-listing.js"></script>
 *
 * For production, change @main to versioned tag like @v1.0.0
 */

// Function to fetch review data from Google Sheets
async function fetchReviewData() {
  try {
    // Reviews to Website Google Apps Script
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyuzPh4TJN_VUIZDVYUgU1FeLYmRoJazh7LHo6tjzN3S-TGsut75CjL0XeMGYB12pDr/exec",
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Failed to fetch review data from Google Sheets:", error);
    return null;
  }
}

// Function to update tour ratings from Google Sheets data
function updateTourRatings(toursArray, reviewData) {
  if (!reviewData || !Array.isArray(reviewData)) {
    // console.log('No valid review data received:', reviewData);
    return toursArray;
  }

  // console.log('Processing review data:', reviewData);

  return toursArray.map((tour) => {
    // Store original values if not already stored
    if (tour.originalRating === undefined) {
      tour.originalRating = tour.rating;
      tour.originalNumReviews = tour.numReviews;
    }

    // Extract base SKU from tour SKU (remove _\d+ suffix)
    const tourBaseSku = tour.sku.replace(/_\d+$/, "");

    // Find matching review data by full SKU, base SKU, or constructed SKU
    const reviewMatch = reviewData.find((review) => {
      return (
        review.sku === tour.sku || // Exact match
        review.baseSku === tourBaseSku || // Base SKU match
        review.sku === tourBaseSku
      ); // Sheet SKU matches tour base SKU
    });

    if (
      reviewMatch &&
      reviewMatch.rating !== undefined &&
      reviewMatch.numReviews !== undefined
    ) {
      // console.log(`Updating ${tour.sku}: rating ${tour.rating} -> ${reviewMatch.rating}, reviews ${tour.numReviews} -> ${reviewMatch.numReviews}`);
      return {
        ...tour,
        rating: parseFloat(reviewMatch.rating) || tour.rating,
        numReviews: parseInt(reviewMatch.numReviews) || tour.numReviews,
      };
    }

    return tour;
  });
}

// Global function to render tour cards with filtering
function renderTourCards(containerId, options = {}) {
  const {
    specialEvent = "all", // 'all', '250th', 'worldcup', etc.
    tourType = "all", // 'all', 'private', 'shared', 'self-guided'
    sortBy = "featured", // 'featured', 'price-asc', 'price-desc', 'rating-asc', 'rating-desc', 'reviews-asc', 'reviews-desc', 'dur-asc', 'dur-desc'
    lengthFilter = "all", // 'all', 'short', 'half', 'full'
    destinations = [], // Array of destination strings to filter by
    transport = [], // Array of transport modes to filter by
    minGuests = 0, // Minimum guests (0 = no filter)
    maxGuests = 0, // Maximum guests (0 = no filter)
    skus = [], // Array of SKUs to filter by (empty = show all)
    isActive = "all", // 'all', true, false - filter by isCurrentlyRunning status
    topN = 0, // Show only top N tours by ranking (0 = no limit, 3 = featured tours)
    showResultsCount = false, // Whether to show "X tours found" message
  } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID '${containerId}' not found`);
    return;
  }

  if (typeof allToursArray === "undefined") {
    console.error(
      "allToursArray not found. Make sure header script is loaded.",
    );
    return;
  }

  // Apply filters
  let filteredTours = allToursArray.filter((tour) => {
    // Length filter
    let matchLength = true;
    if (lengthFilter === "short") {
      matchLength = tour.durationVal <= 4;
    } else if (lengthFilter === "half") {
      matchLength = tour.durationVal >= 4 && tour.durationVal <= 6;
    } else if (lengthFilter === "full") {
      matchLength = tour.durationVal >= 6 && tour.durationVal <= 9;
    }

    // Guest count filter
    const matchGuests =
      (minGuests === 0 && maxGuests === 0) ||
      ((minGuests === 0 || tour.guestMax >= minGuests) &&
        (maxGuests === 0 || tour.guestMin <= maxGuests));

    // Destination filter
    const matchDestinations =
      destinations.length === 0 ||
      tour.destinations.some((dest) => destinations.includes(dest));

    // Transport filter
    const matchTransport =
      transport.length === 0 ||
      tour.transport.some((trans) => transport.includes(trans));

    // Tour type filter
    const matchTourType = tourType === "all" || tour.type === tourType;

    // Special events filter
    let matchSpecialEvent = true;
    if (specialEvent !== "all") {
      matchSpecialEvent = tour.specialEvents?.[specialEvent] || false;
    }

    // SKU filter
    const matchSku = skus.length === 0 || skus.includes(tour.sku);

    // Live status filter
    let matchActive = true;
    if (isActive !== "all") {
      matchActive = tour.status.isActive === isActive;
    }

    return (
      matchLength &&
      matchGuests &&
      matchDestinations &&
      matchTransport &&
      matchTourType &&
      matchSpecialEvent &&
      matchSku &&
      matchActive
    );
  });

  // Apply sorting
  switch (sortBy) {
    case "price-asc":
      filteredTours.sort((a, b) => {
        // Primary sort: active tours first
        const aActive = a.status?.isActive !== false ? 0 : 1;
        const bActive = b.status?.isActive !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        // Secondary sort: by price ascending
        if (a.price !== b.price) return a.price - b.price;
        // Tertiary sort: by rating descending (higher rating first for tied prices)
        if (a.rating !== b.rating) return b.rating - a.rating;
        // Quaternary sort: by review count descending
        return b.numReviews - a.numReviews;
      });
      break;
    case "price-desc":
      filteredTours.sort((a, b) => {
        // Primary sort: active tours first
        const aActive = a.status?.isActive !== false ? 0 : 1;
        const bActive = b.status?.isActive !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        // Secondary sort: by price descending
        if (a.price !== b.price) return b.price - a.price;
        // Tertiary sort: by rating descending (higher rating first for tied prices)
        if (a.rating !== b.rating) return b.rating - a.rating;
        // Quaternary sort: by review count descending
        return b.numReviews - a.numReviews;
      });
      break;
    case "rating-desc":
      filteredTours.sort((a, b) => {
        // Primary sort: active tours first
        const aActive = a.status?.isActive !== false ? 0 : 1;
        const bActive = b.status?.isActive !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        // Secondary sort: by rating descending (high to low)
        if (a.rating !== b.rating) return b.rating - a.rating;
        // Tertiary sort: by review count descending (more reviews first for tied ratings)
        return b.numReviews - a.numReviews;
      });
      break;
    case "rating-asc":
      filteredTours.sort((a, b) => {
        // Primary sort: active tours first
        const aActive = a.status?.isActive !== false ? 0 : 1;
        const bActive = b.status?.isActive !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        // Secondary sort: by rating ascending (low to high)
        if (a.rating !== b.rating) return a.rating - b.rating;
        // Tertiary sort: by review count ascending (fewer reviews first for tied ratings)
        return a.numReviews - b.numReviews;
      });
      break;
    case "reviews-desc":
      filteredTours.sort((a, b) => {
        // Primary sort: active tours first
        const aActive = a.status?.isActive !== false ? 0 : 1;
        const bActive = b.status?.isActive !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        // Secondary sort: by number of reviews descending (most to least)
        if (a.numReviews !== b.numReviews) return b.numReviews - a.numReviews;
        // Tertiary sort: by rating descending (higher rating first for tied review counts)
        return b.rating - a.rating;
      });
      break;
    case "reviews-asc":
      filteredTours.sort((a, b) => {
        // Primary sort: active tours first
        const aActive = a.status?.isActive !== false ? 0 : 1;
        const bActive = b.status?.isActive !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        // Secondary sort: by number of reviews ascending (least to most)
        if (a.numReviews !== b.numReviews) return a.numReviews - b.numReviews;
        // Tertiary sort: by rating ascending (lower rating first for tied review counts)
        return a.rating - b.rating;
      });
      break;
    case "dur-asc":
      filteredTours.sort((a, b) => {
        // Primary sort: active tours first
        const aActive = a.status?.isActive !== false ? 0 : 1;
        const bActive = b.status?.isActive !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        // Secondary sort: by duration ascending
        if (a.durationVal !== b.durationVal)
          return a.durationVal - b.durationVal;
        // Tertiary sort: by rating descending (higher rating first for tied durations)
        if (a.rating !== b.rating) return b.rating - a.rating;
        // Quaternary sort: by review count descending
        return b.numReviews - a.numReviews;
      });
      break;
    case "dur-desc":
      filteredTours.sort((a, b) => {
        // Primary sort: active tours first
        const aActive = a.status?.isActive !== false ? 0 : 1;
        const bActive = b.status?.isActive !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        // Secondary sort: by duration descending
        if (a.durationVal !== b.durationVal)
          return b.durationVal - a.durationVal;
        // Tertiary sort: by rating descending (higher rating first for tied durations)
        if (a.rating !== b.rating) return b.rating - a.rating;
        // Quaternary sort: by review count descending
        return b.numReviews - a.numReviews;
      });
      break;
    case "featured":
    default:
      filteredTours.sort((a, b) => {
        // Primary sort: active tours first
        const aActive = a.status?.isActive !== false ? 0 : 1;
        const bActive = b.status?.isActive !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        // Secondary sort: by ranking (featured)
        return a.ranking - b.ranking;
      });
      break;
  }

  // Apply topN filter after sorting (for featured tours)
  if (topN > 0) {
    filteredTours = filteredTours.slice(0, topN);
  }

  // Clear container and render cards
  container.innerHTML = "";

  filteredTours.forEach((tour) => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = tour.link;

    // Check if tour is active to determine what details to show
    const isActive = tour.status?.isActive !== false;

    let detailsHTML;
    if (isActive) {
      const durationDisplay =
        tour.durationVal % 1 === 0
          ? `${tour.durationVal}h`
          : `${Math.floor(tour.durationVal)}h${Math.round((tour.durationVal % 1) * 60)}m`;
      const tourPrice =
        tour.title === "Custom Tours"
          ? `$ ${tour.price}`
          : `$${tour.price}+ ${tour.priceType}`;

      if (tour.type === "self-guided") {
        // Self-guided tours don't show reviews
        detailsHTML = `
          <div class="card-details">
            <span class="material-symbols-sharp">timer</span> ${durationDisplay}&ensp;•&thinsp;
            <span class="material-symbols-sharp">person</span> ${tour.guestMin}-${tour.guestMax}
            <br>
            <span style="font-weight:bold;">${tourPrice}</span>
          </div>`;
      } else {
        // Regular tours show reviews
        const rating =
          tour.rating === 0 && tour.numReviews === 0
            ? "-"
            : tour.rating.toFixed(1);
        const reviewCount =
          tour.numReviews === 0
            ? "-"
            : toursDataReady
              ? `${tour.numReviews}`
              : `${tour.numReviews}+`;
        const starPercent = (tour.rating / 5) * 100;
        const starsHTML = `
          <div class="stars-container" role="img" aria-label="${tour.rating} out of 5 stars" title="${tour.rating} stars">
            <div class="stars" aria-hidden="true">&#9734;&#9734;&#9734;&#9734;&#9734;</div>
            <div class="stars-active" style="width: ${starPercent}%" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          </div>`;

        detailsHTML = `
          <div class="card-details">
            ${rating}&thinsp;${starsHTML}&thinsp;(${reviewCount})&ensp;•&thinsp;
            <span class="material-symbols-sharp">timer</span> ${durationDisplay}&ensp;•&thinsp;
            <span class="material-symbols-sharp">person</span> ${tour.guestMin}-${tour.guestMax}
            <br>
            <span style="font-weight:bold;">${tourPrice}</span>
          </div>`;
      }
    } else {
      detailsHTML = `
        <div class="card-details">
          <span style="font-style: italic; color: #666;">Full Details Coming Soon</span>
        </div>`;
    }

    card.innerHTML = `
      <div class="card-image-cont">
        <img src="${tour.image}" alt="${tour.imgAlt}" style="${tour.imgStyle}" loading="lazy">
      </div>
      <div class="card-content">
        <h2>${tour.title}</h2>
        <div class="description-container">
          <p class="card-details">${tour.description}</p>
        </div>
        ${detailsHTML}
      </div>`;
    container.appendChild(card);
  });

  // Show results count if requested
  if (showResultsCount) {
    const countElement = document.getElementById(containerId + "-count");
    if (countElement) {
      countElement.textContent = `Showing ${filteredTours.length} tour(s)`;
    }
  }

  return filteredTours.length;
}

// Initialize tours with Google Sheets review data
let toursDataReady = false;
const toursReadyCallbacks = [];

// Function to notify when tours are ready
function onToursReady(callback) {
  if (toursDataReady) {
    callback();
  } else {
    toursReadyCallbacks.push(callback);
  }
}

(async function initializeTours() {
  try {
    console.log("Fetching review data from Google Sheets...");
    const reviewData = await fetchReviewData();
    console.log("Raw review data received:", reviewData);

    if (reviewData) {
      // Update allToursArray with fresh review data
      const updatedTours = updateTourRatings(allToursArray, reviewData);
      // Replace the existing array elements
      allToursArray.splice(0, allToursArray.length, ...updatedTours);
      console.log("Tour ratings updated from Google Sheets");
      console.log("Updated tours array:", allToursArray);
    } else {
      console.log("No review data received, using default values");
    }
  } catch (error) {
    console.warn("Error initializing tours with Google Sheets data:", error);
  } finally {
    // Mark tours as ready and run any waiting callbacks
    toursDataReady = true;
    toursReadyCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in tours ready callback:", error);
      }
    });
    toursReadyCallbacks.length = 0; // Clear callbacks

    // Dispatch a custom event for any components listening
    window.dispatchEvent(
      new CustomEvent("toursDataReady", { detail: allToursArray }),
    );
  }
})();
