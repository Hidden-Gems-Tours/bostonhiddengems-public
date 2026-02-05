/**
 * Neighborhood Guide Interactive Map
 * Boston Hidden Gems
 *
 * Purpose: Initialize Leaflet maps for neighborhood guides with
 *          interactive markers synced to restaurant/attraction lists
 *
 * Dependencies: Leaflet 1.9.4 (loaded via CDN in header-script.html)
 *
 * Usage: Include this script on neighborhood guide pages.
 *        The map container must have class "leaflet-map-container"
 *        and data-map-id attribute matching the guide's neighborhood.
 *
 * Data attributes on list items:
 *   data-map-id: Unique identifier for the location
 *   data-lat: Latitude coordinate
 *   data-lng: Longitude coordinate
 *   data-category: "attraction" | "restaurant"
 */

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    defaultCenter: [42.3647, -71.0542], // North End center
    defaultZoom: 16,
    maxZoom: 19,
    minZoom: 14,
    tileLayer:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    tileAttribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  };

  // Marker icons using BHG color palette
  const ICONS = {
    attraction: createIcon("#172436", "explore"), // Navy - attractions
    restaurant: createIcon("#7CAEF4", "restaurant"), // Blue - restaurants
    ourPick: createIcon("#DE5700", "star"), // Orange - our picks
    attractionHighlight: createIcon("#172436", "explore", true),
    restaurantHighlight: createIcon("#7CAEF4", "restaurant", true),
    ourPickHighlight: createIcon("#DE5700", "star", true),
  };

  /**
   * Create a custom Leaflet divIcon with Material symbol
   * @param {string} color - Hex color for the marker
   * @param {string} symbol - Material Symbol name
   * @param {boolean} highlighted - Whether marker is in highlighted state
   * @returns {L.DivIcon}
   */
  function createIcon(color, symbol, highlighted = false) {
    const size = highlighted ? 44 : 36;
    const iconSize = highlighted ? 24 : 20;
    const shadowClass = highlighted ? "marker-shadow-highlighted" : "";

    const html = `
      <div class="guide-map-marker ${shadowClass}" style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: ${highlighted ? "0 4px 12px rgba(0,0,0,0.4)" : "0 2px 6px rgba(0,0,0,0.3)"};
        border: ${highlighted ? "3px solid #fff" : "2px solid #fff"};
        transition: transform 0.2s ease;
      ">
        <span class="material-symbols-sharp" style="
          transform: rotate(45deg);
          color: #fff;
          font-size: ${iconSize}px;
        ">${symbol}</span>
      </div>
    `;

    return L.divIcon({
      html: html,
      className: "guide-map-marker-container",
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size + 8],
    });
  }

  /**
   * Main map initialization class
   */
  class GuideMap {
    constructor(container) {
      this.container = container;
      this.mapId = container.dataset.mapId;
      this.map = null;
      this.markers = new Map(); // mapId -> marker
      this.locations = [];
      this.highlightedId = null;

      this.init();
    }

    init() {
      // Check if Leaflet is available
      if (typeof L === "undefined") {
        console.warn("Leaflet not loaded. Map initialization skipped.");
        return;
      }

      this.collectLocations();
      if (this.locations.length === 0) {
        console.warn("No locations found for map. Map initialization skipped.");
        return;
      }

      this.createMap();
      this.addMarkers();
      this.bindListEvents();
      this.fitBounds();
    }

    /**
     * Collect location data from DOM elements with data attributes
     */
    collectLocations() {
      const guide = document.querySelector(".neighborhood-guide");
      if (!guide) return;

      // Find all items with map data
      const items = guide.querySelectorAll("[data-lat][data-lng][data-map-id]");

      items.forEach((item) => {
        const lat = parseFloat(item.dataset.lat);
        const lng = parseFloat(item.dataset.lng);
        const mapId = item.dataset.mapId;
        const category = item.dataset.category || "restaurant";
        const isOurPick = item.classList.contains("our-pick");

        // Get name from the item
        const nameEl =
          item.querySelector(".restaurant-name") ||
          item.querySelector(".attraction-name");
        const name = nameEl ? nameEl.textContent.trim() : mapId;

        // Get description preview
        const descEl =
          item.querySelector(".restaurant-description") ||
          item.querySelector(".attraction-description");
        const description = descEl
          ? descEl.textContent.trim().substring(0, 100) + "..."
          : "";

        if (!isNaN(lat) && !isNaN(lng)) {
          this.locations.push({
            id: mapId,
            lat,
            lng,
            name,
            description,
            category,
            isOurPick,
            element: item,
          });
        }
      });
    }

    /**
     * Create the Leaflet map instance
     */
    createMap() {
      // Calculate center from locations
      const center = this.calculateCenter();

      this.map = L.map(this.container, {
        center: center,
        zoom: CONFIG.defaultZoom,
        maxZoom: CONFIG.maxZoom,
        minZoom: CONFIG.minZoom,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // Add tile layer (CARTO Voyager - clean, modern style)
      L.tileLayer(CONFIG.tileLayer, {
        attribution: CONFIG.tileAttribution,
        maxZoom: CONFIG.maxZoom,
      }).addTo(this.map);

      // Move zoom control to bottom right
      this.map.zoomControl.setPosition("bottomright");
    }

    /**
     * Calculate center point from all locations
     * @returns {[number, number]} [lat, lng]
     */
    calculateCenter() {
      if (this.locations.length === 0) return CONFIG.defaultCenter;

      const sumLat = this.locations.reduce((sum, loc) => sum + loc.lat, 0);
      const sumLng = this.locations.reduce((sum, loc) => sum + loc.lng, 0);

      return [sumLat / this.locations.length, sumLng / this.locations.length];
    }

    /**
     * Add markers for all locations
     */
    addMarkers() {
      this.locations.forEach((location) => {
        const icon = this.getIconForLocation(location);

        const marker = L.marker([location.lat, location.lng], {
          icon: icon,
          title: location.name,
          alt: location.name,
          riseOnHover: true,
        });

        // Create popup content
        const popupContent = this.createPopupContent(location);
        marker.bindPopup(popupContent, {
          maxWidth: 280,
          className: "guide-map-popup",
        });

        // Handle marker click
        marker.on("click", () => this.handleMarkerClick(location.id));

        marker.addTo(this.map);
        this.markers.set(location.id, { marker, location });
      });
    }

    /**
     * Get appropriate icon for a location
     * @param {Object} location
     * @param {boolean} highlighted
     * @returns {L.DivIcon}
     */
    getIconForLocation(location, highlighted = false) {
      if (location.isOurPick) {
        return highlighted ? ICONS.ourPickHighlight : ICONS.ourPick;
      }
      if (location.category === "attraction") {
        return highlighted ? ICONS.attractionHighlight : ICONS.attraction;
      }
      return highlighted ? ICONS.restaurantHighlight : ICONS.restaurant;
    }

    /**
     * Create popup HTML content
     * @param {Object} location
     * @returns {string}
     */
    createPopupContent(location) {
      const ourPickBadge = location.isOurPick
        ? '<span class="popup-our-pick">Our Pick</span>'
        : "";

      const categoryIcon =
        location.category === "attraction" ? "explore" : "restaurant";

      return `
        <div class="guide-popup-content">
          <div class="popup-header">
            <span class="material-symbols-sharp popup-icon">${categoryIcon}</span>
            <strong class="popup-name">${location.name}</strong>
            ${ourPickBadge}
          </div>
          <p class="popup-description">${location.description}</p>
          <button class="popup-scroll-btn" data-map-id="${location.id}">
            View in list <span class="material-symbols-sharp">arrow_downward</span>
          </button>
        </div>
      `;
    }

    /**
     * Handle marker click - highlight and scroll to list item
     * @param {string} mapId
     */
    handleMarkerClick(mapId) {
      this.highlightLocation(mapId);

      // Add click handler for popup button (after popup opens)
      setTimeout(() => {
        const btn = document.querySelector(
          `.popup-scroll-btn[data-map-id="${mapId}"]`
        );
        if (btn) {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.scrollToListItem(mapId);
          });
        }
      }, 100);
    }

    /**
     * Scroll to and highlight a list item
     * @param {string} mapId
     */
    scrollToListItem(mapId) {
      const markerData = this.markers.get(mapId);
      if (!markerData) return;

      const element = markerData.location.element;
      if (!element) return;

      // Scroll element into view with offset for sticky nav
      const navHeight =
        document.querySelector(".guide-nav")?.offsetHeight || 60;
      const elementTop =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementTop - navHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Flash highlight on the element
      element.classList.add("map-highlight");
      setTimeout(() => {
        element.classList.remove("map-highlight");
      }, 2000);
    }

    /**
     * Highlight a location on the map
     * @param {string} mapId
     */
    highlightLocation(mapId) {
      // Remove previous highlight
      if (this.highlightedId && this.highlightedId !== mapId) {
        const prevData = this.markers.get(this.highlightedId);
        if (prevData) {
          const prevIcon = this.getIconForLocation(prevData.location, false);
          prevData.marker.setIcon(prevIcon);
        }
      }

      // Add new highlight
      const markerData = this.markers.get(mapId);
      if (markerData) {
        const icon = this.getIconForLocation(markerData.location, true);
        markerData.marker.setIcon(icon);
        this.highlightedId = mapId;
      }
    }

    /**
     * Bind click events to list items
     */
    bindListEvents() {
      this.locations.forEach((location) => {
        location.element.addEventListener("click", (e) => {
          // Don't trigger if clicking a link inside the item
          if (e.target.tagName === "A") return;

          this.panToLocation(location.id);
        });

        // Make items keyboard accessible
        location.element.setAttribute("tabindex", "0");
        location.element.setAttribute("role", "button");
        location.element.setAttribute(
          "aria-label",
          `Show ${location.name} on map`
        );

        location.element.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.panToLocation(location.id);
          }
        });
      });
    }

    /**
     * Pan to a location and open its popup
     * @param {string} mapId
     */
    panToLocation(mapId) {
      const markerData = this.markers.get(mapId);
      if (!markerData) return;

      this.highlightLocation(mapId);

      // Pan to marker
      this.map.setView([markerData.location.lat, markerData.location.lng], 17, {
        animate: true,
        duration: 0.5,
      });

      // Open popup
      markerData.marker.openPopup();

      // Scroll map into view if needed
      const mapRect = this.container.getBoundingClientRect();
      if (mapRect.top < 0 || mapRect.bottom > window.innerHeight) {
        this.container.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    /**
     * Fit map bounds to show all markers
     */
    fitBounds() {
      if (this.locations.length === 0) return;

      const bounds = L.latLngBounds(
        this.locations.map((loc) => [loc.lat, loc.lng])
      );

      this.map.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 16,
      });
    }
  }

  /**
   * Initialize all guide maps on the page
   */
  function initGuideMaps() {
    const mapContainers = document.querySelectorAll(".leaflet-map-container");

    mapContainers.forEach((container) => {
      // Check if already initialized
      if (container.dataset.initialized === "true") return;

      new GuideMap(container);
      container.dataset.initialized = "true";
    });
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGuideMaps);
  } else {
    // DOM already loaded
    initGuideMaps();
  }

  // Also reinitialize on Squarespace AJAX navigation (if applicable)
  window.addEventListener("mercury:load", initGuideMaps);
})();
