/**
 * Boston Hub Neighborhood Map
 * Boston Hidden Gems
 *
 * Interactive Leaflet map showing Boston neighborhoods as clickable polygons.
 * Active neighborhoods (with guide pages) are blue; others are dimmed gray.
 * Sidebar legend syncs with map hover/focus.
 *
 * Loaded via jsDelivr CDN from GitHub repository.
 */
(function () {
  "use strict";

  /* ======================================================================
     CONFIGURATION
     ====================================================================== */
  var CONFIG = {
    mapCenter: [42.3645, -71.085],
    zoom: 12,
    minZoom: 11,
    maxZoom: 16,
    tileUrl:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    tileAttribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  };

  /* ======================================================================
     NEIGHBORHOOD LOOKUP
     Maps GeoJSON "name" → display config.
     status: "active" | "comingSoon" | "greenSpace" | "unavailable"
     All neighborhoods listed here appear in the sidebar.
     ====================================================================== */
  var NEIGHBORHOODS = {
    /* --- Boston — Active guides --- */
    "North End": {
      city: "Boston",
      status: "active",
      slug: "north-end",
      link: "/neighborhood-guides/north-end",
    },
    /* --- Boston — Coming soon --- */
    "Back Bay": {
      city: "Boston",
      status: "comingSoon",
      slug: "back-bay",
      link: "/neighborhood-guides/back-bay",
    },
    "Beacon Hill": {
      city: "Boston",
      status: "comingSoon",
      slug: "beacon-hill",
      link: "/neighborhood-guides/beacon-hill",
    },
    "Boston Common/Public Garden": { city: "Boston", status: "greenSpace" },
    Charlestown: {
      city: "Boston",
      status: "comingSoon",
      slug: "charlestown",
      link: "/neighborhood-guides/charlestown",
    },
    Chinatown: {
      city: "Boston",
      status: "comingSoon",
      slug: "chinatown",
      link: "/neighborhood-guides/chinatown",
    },
    Dorchester: {
      city: "Boston",
      status: "comingSoon",
      slug: "dorchester",
      link: "/neighborhood-guides/dorchester",
    },
    "Downtown (Theater District)": {
      city: "Boston",
      status: "comingSoon",
      slug: "downtown",
      link: "/neighborhood-guides/downtown",
    },
    "Downtown Crossing": {
      city: "Boston",
      status: "comingSoon",
      slug: "downtown",
      link: "/neighborhood-guides/downtown",
    },
    "Downtown (Financial District)": {
      city: "Boston",
      status: "comingSoon",
      slug: "downtown",
      link: "/neighborhood-guides/downtown",
    },
    "Downtown (Government Center)": {
      city: "Boston",
      status: "comingSoon",
      slug: "downtown",
      link: "/neighborhood-guides/downtown",
    },
    "East Boston": {
      city: "Boston",
      status: "comingSoon",
      slug: "east-boston",
      link: "/neighborhood-guides/east-boston",
    },
    Fenway: {
      city: "Boston",
      status: "comingSoon",
      slug: "fenway-kenmore",
      link: "/neighborhood-guides/fenway-kenmore",
      displayName: "Fenway-Kenmore",
    },
    "Jamaica Plain": {
      city: "Boston",
      status: "comingSoon",
      slug: "jamaica-plain",
      link: "/neighborhood-guides/jamaica-plain",
    },
    "South Boston Waterfront": {
      city: "Boston",
      status: "comingSoon",
      slug: "seaport",
      link: "/neighborhood-guides/seaport",
      displayName: "Seaport",
    },
    "South Boston": {
      city: "Boston",
      status: "comingSoon",
      slug: "south-boston",
      link: "/neighborhood-guides/south-boston",
    },
    "South End": {
      city: "Boston",
      status: "comingSoon",
      slug: "south-end",
      link: "/neighborhood-guides/south-end",
    },
    "West End": {
      city: "Boston",
      status: "comingSoon",
      slug: "west-end",
      link: "/neighborhood-guides/west-end",
    },
    /* --- Boston — Not available --- */
    Allston: { city: "Boston", status: "unavailable" },
    Brighton: { city: "Boston", status: "unavailable" },
    "Hyde Park": { city: "Boston", status: "unavailable" },
    Longwood: { city: "Boston", status: "unavailable" },
    Mattapan: { city: "Boston", status: "unavailable" },
    "Mission Hill": { city: "Boston", status: "unavailable" },
    Roslindale: { city: "Boston", status: "unavailable" },
    Riverway: { city: "Boston", status: "greenSpace" },
    Roxbury: { city: "Boston", status: "unavailable" },
    "Leather District": { city: "Boston", status: "unavailable" },
    "Symphony/Northeastern": { city: "Boston", status: "unavailable" },
    "The Esplanade/Charles River": { city: "Boston", status: "greenSpace" },
    "The Fens": { city: "Boston", status: "greenSpace" },
    "West Roxbury": { city: "Boston", status: "unavailable" },
    /* --- Cambridge --- */
    "Area 2/MIT": { city: "Cambridge", status: "unavailable" },
    Baldwin: { city: "Cambridge", status: "unavailable" },
    "Cambridge Highlands": { city: "Cambridge", status: "unavailable" },
    Cambridgeport: { city: "Cambridge", status: "unavailable" },
    "East Cambridge": { city: "Cambridge", status: "unavailable" },
    "Mid-Cambridge": { city: "Cambridge", status: "unavailable" },
    "Neighborhood Nine": { city: "Cambridge", status: "unavailable" },
    "North Cambridge": { city: "Cambridge", status: "unavailable" },
    Riverside: { city: "Cambridge", status: "unavailable" },
    "Strawberry Hill": { city: "Cambridge", status: "unavailable" },
    "The Port": { city: "Cambridge", status: "unavailable" },
    "Wellington-Harrington": { city: "Cambridge", status: "unavailable" },
    "West Cambridge": { city: "Cambridge", status: "unavailable" },
    /* --- Somerville --- */
    "Assembly Square": {
      city: "Somerville",
      status: "comingSoon",
      slug: "assembly-square",
      link: "/neighborhood-guides/assembly-square",
    },
    "Ball Square": {
      city: "Somerville",
      status: "comingSoon",
      slug: "ball-square",
      link: "/neighborhood-guides/ball-square",
    },
    "Boynton Yards": { city: "Somerville", status: "unavailable" },
    Brickbottom: { city: "Somerville", status: "unavailable" },
    "Davis Square": {
      city: "Somerville",
      status: "comingSoon",
      slug: "davis-square",
      link: "/neighborhood-guides/davis-square",
    },
    "Duck Village": { city: "Somerville", status: "unavailable" },
    "East Somerville": { city: "Somerville", status: "unavailable" },
    Hillside: { city: "Somerville", status: "unavailable" },
    "Inner Belt": { city: "Somerville", status: "unavailable" },
    "Magoun Square": { city: "Somerville", status: "unavailable" },
    "North Point": { city: "Somerville", status: "unavailable" },
    "Porter Square": {
      city: "Somerville",
      status: "comingSoon",
      slug: "porter-square",
      link: "/neighborhood-guides/porter-square",
    },
    "Powder House Square": {
      city: "Somerville",
      status: "comingSoon",
      slug: "powder-house-square",
      link: "/neighborhood-guides/powder-house-square",
    },
    "Spring Hill": { city: "Somerville", status: "unavailable" },
    "Teele Square": { city: "Somerville", status: "unavailable" },
    "Ten Hills": { city: "Somerville", status: "unavailable" },
    "Twin City": { city: "Somerville", status: "unavailable" },
    "Union Square": { city: "Somerville", status: "unavailable" },
    "Winter Hill": { city: "Somerville", status: "unavailable" },
  };

  /* ======================================================================
     POLYGON STYLES
     ====================================================================== */
  var STYLES = {
    active: {
      color: "#172436",
      weight: 1.5,
      opacity: 0.6,
      fillColor: "#7CAEF4",
      fillOpacity: 0.7,
    },
    comingSoon: {
      color: "#172436",
      weight: 1.5,
      opacity: 0.4,
      fillColor: "#b8c2cc",
      fillOpacity: 0.55,
    },
    background: {
      color: "#172436",
      weight: 1.5,
      opacity: 0.3,
      fillColor: "#cdd3da",
      fillOpacity: 0.5,
    },
    activeHover: {
      color: "#172436",
      weight: 1.5,
      opacity: 0.5,
      fillColor: "#7CAEF4",
      fillOpacity: 0.8,
    },
    comingSoonHover: {
      color: "#8891a0",
      weight: 1,
      opacity: 0.4,
      fillColor: "#b8c2cc",
      fillOpacity: 0.65,
    },
    backgroundHover: {
      color: "#8891a0",
      weight: 1,
      opacity: 0.3,
      fillColor: "#cdd3da",
      fillOpacity: 0.6,
    },
    greenSpace: {
      color: "#172436",
      weight: 1.5,
      opacity: 0.2,
      fillColor: "#8ccf96",
      fillOpacity: 0.35,
    },
    greenSpaceHover: {
      color: "#3d7a47",
      weight: 1,
      opacity: 0.3,
      fillColor: "#8ccf96",
      fillOpacity: 0.45,
    },
  };

  /* ======================================================================
     GEOJSON DATA (simplified Boston neighborhood boundaries)
     Source: Analyze Boston — Census 2020 Block Group Neighborhoods
     Simplified to ~10% with mapshaper, reprojected to WGS84
     ====================================================================== */
  var BOSTON_GEOJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.11094,
              42.35045
            ],
            [
              -71.11073,
              42.35182
            ],
            [
              -71.11446,
              42.35255
            ],
            [
              -71.11821,
              42.35527
            ],
            [
              -71.11836,
              42.35693
            ],
            [
              -71.11752,
              42.36003
            ],
            [
              -71.11835,
              42.36691
            ],
            [
              -71.12531,
              42.36886
            ],
            [
              -71.12682,
              42.37027
            ],
            [
              -71.1279,
              42.3726
            ],
            [
              -71.12995,
              42.37268
            ],
            [
              -71.13065,
              42.36854
            ],
            [
              -71.1328,
              42.36613
            ],
            [
              -71.13545,
              42.36485
            ],
            [
              -71.13539,
              42.36296
            ],
            [
              -71.13808,
              42.35742
            ],
            [
              -71.13907,
              42.35379
            ],
            [
              -71.14418,
              42.35489
            ],
            [
              -71.14708,
              42.35017
            ],
            [
              -71.14165,
              42.34927
            ],
            [
              -71.14037,
              42.34869
            ],
            [
              -71.1417,
              42.34602
            ],
            [
              -71.1398,
              42.34509
            ],
            [
              -71.13823,
              42.34759
            ],
            [
              -71.1356,
              42.34623
            ],
            [
              -71.13425,
              42.34658
            ],
            [
              -71.12928,
              42.34907
            ],
            [
              -71.12286,
              42.35186
            ],
            [
              -71.11094,
              42.35045
            ]
          ]
        ]
      },
      "properties": {
        "name": "Allston"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.07066,
              42.35185
            ],
            [
              -71.07246,
              42.35546
            ],
            [
              -71.07346,
              42.35612
            ],
            [
              -71.07998,
              42.35412
            ],
            [
              -71.08986,
              42.35158
            ],
            [
              -71.09288,
              42.34916
            ],
            [
              -71.09287,
              42.34764
            ],
            [
              -71.08792,
              42.34746
            ],
            [
              -71.0858,
              42.34333
            ],
            [
              -71.08315,
              42.34162
            ],
            [
              -71.0751,
              42.34816
            ],
            [
              -71.072,
              42.34902
            ],
            [
              -71.07282,
              42.35076
            ],
            [
              -71.07046,
              42.35142
            ],
            [
              -71.07066,
              42.35185
            ]
          ]
        ]
      },
      "properties": {
        "name": "Back Bay"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Beacon Hill"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.06317,
              42.35775
            ],
            [
              -71.06291,
              42.36123
            ],
            [
              -71.06291,
              42.36123
            ],
            [
              -71.07236,
              42.36121
            ],
            [
              -71.07201,
              42.35994
            ],
            [
              -71.07346,
              42.35612
            ],
            [
              -71.07246,
              42.35546
            ],
            [
              -71.06466,
              42.35725
            ],
            [
              -71.06317,
              42.35775
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Boston Common/Public Garden"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.07246,
              42.35546
            ],
            [
              -71.07066,
              42.35185
            ],
            [
              -71.06753,
              42.35251
            ],
            [
              -71.06456,
              42.35238
            ],
            [
              -71.06342,
              42.35506
            ],
            [
              -71.06196,
              42.35653
            ],
            [
              -71.06317,
              42.35775
            ],
            [
              -71.06466,
              42.35725
            ],
            [
              -71.07246,
              42.35546
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.13425,
              42.34658
            ],
            [
              -71.1356,
              42.34623
            ],
            [
              -71.13823,
              42.34759
            ],
            [
              -71.1398,
              42.34509
            ],
            [
              -71.1417,
              42.34602
            ],
            [
              -71.14037,
              42.34869
            ],
            [
              -71.14165,
              42.34927
            ],
            [
              -71.14708,
              42.35017
            ],
            [
              -71.14418,
              42.35489
            ],
            [
              -71.13907,
              42.35379
            ],
            [
              -71.13808,
              42.35742
            ],
            [
              -71.13539,
              42.36296
            ],
            [
              -71.13545,
              42.36485
            ],
            [
              -71.13955,
              42.3637
            ],
            [
              -71.14342,
              42.36318
            ],
            [
              -71.14793,
              42.36065
            ],
            [
              -71.15399,
              42.35932
            ],
            [
              -71.16213,
              42.35806
            ],
            [
              -71.16947,
              42.35805
            ],
            [
              -71.17392,
              42.35347
            ],
            [
              -71.17485,
              42.35034
            ],
            [
              -71.16668,
              42.3401
            ],
            [
              -71.16922,
              42.33807
            ],
            [
              -71.16889,
              42.33583
            ],
            [
              -71.16757,
              42.33344
            ],
            [
              -71.16297,
              42.33395
            ],
            [
              -71.15933,
              42.33277
            ],
            [
              -71.15704,
              42.33039
            ],
            [
              -71.14985,
              42.33464
            ],
            [
              -71.14874,
              42.33687
            ],
            [
              -71.14616,
              42.33744
            ],
            [
              -71.14661,
              42.33854
            ],
            [
              -71.14421,
              42.34002
            ],
            [
              -71.14133,
              42.34105
            ],
            [
              -71.13425,
              42.34658
            ]
          ]
        ]
      },
      "properties": {
        "name": "Brighton"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.0443,
              42.38321
            ],
            [
              -71.04819,
              42.38569
            ],
            [
              -71.0574,
              42.3873
            ],
            [
              -71.0657,
              42.3866
            ],
            [
              -71.0709,
              42.389
            ],
            [
              -71.06695,
              42.39407
            ],
            [
              -71.06932,
              42.39402
            ],
            [
              -71.0727,
              42.3908
            ],
            [
              -71.0735,
              42.3918
            ],
            [
              -71.07434,
              42.39062
            ],
            [
              -71.07745,
              42.38623
            ],
            [
              -71.07979,
              42.38293
            ],
            [
              -71.08081,
              42.38242
            ],
            [
              -71.08093,
              42.38213
            ],
            [
              -71.0807,
              42.38104
            ],
            [
              -71.07566,
              42.3802
            ],
            [
              -71.07247,
              42.37266
            ],
            [
              -71.06712,
              42.37182
            ],
            [
              -71.06406,
              42.369
            ],
            [
              -71.06299,
              42.36839
            ],
            [
              -71.0598,
              42.36877
            ],
            [
              -71.055,
              42.3707
            ],
            [
              -71.0509,
              42.3707
            ],
            [
              -71.0491,
              42.3712
            ],
            [
              -71.047,
              42.3726
            ],
            [
              -71.0452,
              42.3771
            ],
            [
              -71.0443,
              42.38321
            ]
          ]
        ]
      },
      "properties": {
        "name": "Charlestown"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.06071,
              42.34625
            ],
            [
              -71.05879,
              42.34616
            ],
            [
              -71.05749,
              42.34766
            ],
            [
              -71.0594,
              42.3489
            ],
            [
              -71.05951,
              42.35115
            ],
            [
              -71.05877,
              42.35202
            ],
            [
              -71.058,
              42.3524
            ],
            [
              -71.05937,
              42.35251
            ],
            [
              -71.06015,
              42.35257
            ],
            [
              -71.06067,
              42.35255
            ],
            [
              -71.06456,
              42.35238
            ],
            [
              -71.06276,
              42.35151
            ],
            [
              -71.06415,
              42.34841
            ],
            [
              -71.06661,
              42.34876
            ],
            [
              -71.06576,
              42.34751
            ],
            [
              -71.06071,
              42.34625
            ]
          ]
        ]
      },
      "properties": {
        "name": "Chinatown"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.04541,
              42.3238
            ],
            [
              -71.04784,
              42.32259
            ],
            [
              -71.05246,
              42.32147
            ],
            [
              -71.0543,
              42.32443
            ],
            [
              -71.05685,
              42.32629
            ],
            [
              -71.05692,
              42.32804
            ],
            [
              -71.05824,
              42.32973
            ],
            [
              -71.06355,
              42.33079
            ],
            [
              -71.06643,
              42.32626
            ],
            [
              -71.06806,
              42.32128
            ],
            [
              -71.0722,
              42.32136
            ],
            [
              -71.0697,
              42.31895
            ],
            [
              -71.07039,
              42.31744
            ],
            [
              -71.07283,
              42.31666
            ],
            [
              -71.07317,
              42.31222
            ],
            [
              -71.07882,
              42.31461
            ],
            [
              -71.08419,
              42.30719
            ],
            [
              -71.08699,
              42.29814
            ],
            [
              -71.09157,
              42.29675
            ],
            [
              -71.09576,
              42.29197
            ],
            [
              -71.09286,
              42.28495
            ],
            [
              -71.08979,
              42.28394
            ],
            [
              -71.0863,
              42.28117
            ],
            [
              -71.08281,
              42.28043
            ],
            [
              -71.07889,
              42.27857
            ],
            [
              -71.07317,
              42.27805
            ],
            [
              -71.07102,
              42.27831
            ],
            [
              -71.06592,
              42.27993
            ],
            [
              -71.06814,
              42.271
            ],
            [
              -71.0651,
              42.27066
            ],
            [
              -71.0647,
              42.26861
            ],
            [
              -71.06351,
              42.26756
            ],
            [
              -71.06098,
              42.26745
            ],
            [
              -71.05384,
              42.2717
            ],
            [
              -71.05349,
              42.27246
            ],
            [
              -71.05558,
              42.27505
            ],
            [
              -71.05525,
              42.27634
            ],
            [
              -71.05328,
              42.2775
            ],
            [
              -71.0498,
              42.2781
            ],
            [
              -71.04488,
              42.27627
            ],
            [
              -71.04159,
              42.2781
            ],
            [
              -71.04049,
              42.2819
            ],
            [
              -71.03789,
              42.2849
            ],
            [
              -71.03529,
              42.2888
            ],
            [
              -71.03846,
              42.29347
            ],
            [
              -71.04337,
              42.29482
            ],
            [
              -71.04279,
              42.29588
            ],
            [
              -71.04366,
              42.29834
            ],
            [
              -71.0422,
              42.29936
            ],
            [
              -71.04169,
              42.30215
            ],
            [
              -71.04221,
              42.30328
            ],
            [
              -71.04539,
              42.30389
            ],
            [
              -71.04335,
              42.30794
            ],
            [
              -71.04015,
              42.30976
            ],
            [
              -71.03728,
              42.3092
            ],
            [
              -71.03179,
              42.31262
            ],
            [
              -71.03157,
              42.31658
            ],
            [
              -71.03617,
              42.31796
            ],
            [
              -71.0353,
              42.31874
            ],
            [
              -71.04223,
              42.32202
            ],
            [
              -71.04541,
              42.3238
            ]
          ]
        ]
      },
      "properties": {
        "name": "Dorchester"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.06456,
              42.35238
            ],
            [
              -71.06753,
              42.35251
            ],
            [
              -71.07066,
              42.35185
            ],
            [
              -71.07046,
              42.35142
            ],
            [
              -71.0699,
              42.35015
            ],
            [
              -71.06687,
              42.35096
            ],
            [
              -71.06661,
              42.34876
            ],
            [
              -71.06415,
              42.34841
            ],
            [
              -71.06276,
              42.35151
            ],
            [
              -71.06456,
              42.35238
            ]
          ]
        ]
      },
      "properties": {
        "name": "Downtown (Theater District)"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Downtown Crossing"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.06317,
              42.35775
            ],
            [
              -71.06196,
              42.35653
            ],
            [
              -71.06342,
              42.35506
            ],
            [
              -71.06456,
              42.35238
            ],
            [
              -71.06067,
              42.35255
            ],
            [
              -71.06015,
              42.35257
            ],
            [
              -71.05937,
              42.35251
            ],
            [
              -71.05952,
              42.35315
            ],
            [
              -71.05941,
              42.35335
            ],
            [
              -71.05861,
              42.35409
            ],
            [
              -71.05857,
              42.35418
            ],
            [
              -71.05771,
              42.35501
            ],
            [
              -71.0575,
              42.35513
            ],
            [
              -71.0573,
              42.35547
            ],
            [
              -71.05736,
              42.35619
            ],
            [
              -71.05729,
              42.35678
            ],
            [
              -71.05732,
              42.35756
            ],
            [
              -71.0579,
              42.35763
            ],
            [
              -71.0581,
              42.35767
            ],
            [
              -71.05833,
              42.35744
            ],
            [
              -71.06047,
              42.35797
            ],
            [
              -71.06317,
              42.35775
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Downtown (Government Center)"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.05732,
              42.35756
            ],
            [
              -71.0579,
              42.35763
            ],
            [
              -71.0581,
              42.35767
            ],
            [
              -71.05833,
              42.35744
            ],
            [
              -71.06047,
              42.35797
            ],
            [
              -71.06317,
              42.35775
            ],
            [
              -71.06291,
              42.36123
            ],
            [
              -71.06186,
              42.36243
            ],
            [
              -71.05839,
              42.36369
            ],
            [
              -71.05843,
              42.36464
            ],
            [
              -71.05697,
              42.36321
            ],
            [
              -71.05281,
              42.36092
            ],
            [
              -71.05227,
              42.36041
            ],
            [
              -71.05186,
              42.35963
            ],
            [
              -71.05686,
              42.35886
            ],
            [
              -71.05729,
              42.35855
            ],
            [
              -71.05732,
              42.35756
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Downtown (Financial District)"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.05732,
              42.35756
            ],
            [
              -71.05729,
              42.35678
            ],
            [
              -71.05736,
              42.35619
            ],
            [
              -71.0573,
              42.35547
            ],
            [
              -71.0575,
              42.35513
            ],
            [
              -71.05771,
              42.35501
            ],
            [
              -71.05857,
              42.35418
            ],
            [
              -71.05861,
              42.35409
            ],
            [
              -71.05941,
              42.35335
            ],
            [
              -71.05952,
              42.35315
            ],
            [
              -71.05937,
              42.35251
            ],
            [
              -71.058,
              42.3524
            ],
            [
              -71.05624,
              42.35292
            ],
            [
              -71.05612,
              42.35288
            ],
            [
              -71.05612,
              42.35288
            ],
            [
              -71.05534,
              42.3526
            ],
            [
              -71.05496,
              42.35247
            ],
            [
              -71.05219,
              42.35112
            ],
            [
              -71.04557,
              42.35973
            ],
            [
              -71.05186,
              42.35963
            ],
            [
              -71.05686,
              42.35886
            ],
            [
              -71.05729,
              42.35855
            ],
            [
              -71.05732,
              42.35756
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.05647,
              42.34611
            ],
            [
              -71.05463,
              42.34742
            ],
            [
              -71.05219,
              42.35112
            ],
            [
              -71.05496,
              42.35247
            ],
            [
              -71.05534,
              42.3526
            ],
            [
              -71.05624,
              42.35292
            ],
            [
              -71.058,
              42.3524
            ],
            [
              -71.05877,
              42.35202
            ],
            [
              -71.05951,
              42.35115
            ],
            [
              -71.05951,
              42.35115
            ],
            [
              -71.0594,
              42.3489
            ],
            [
              -71.05749,
              42.34766
            ],
            [
              -71.0584,
              42.34661
            ],
            [
              -71.05647,
              42.34611
            ]
          ]
        ]
      },
      "properties": {
        "name": "Leather District"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.047,
              42.3726
            ],
            [
              -71.04738,
              42.37121
            ],
            [
              -71.04445,
              42.36579
            ],
            [
              -71.0426,
              42.3638
            ],
            [
              -71.03963,
              42.36178
            ],
            [
              -71.03776,
              42.36128
            ],
            [
              -71.03425,
              42.35928
            ],
            [
              -71.0328,
              42.35926
            ],
            [
              -71.03161,
              42.36122
            ],
            [
              -71.02841,
              42.3622
            ],
            [
              -71.0303,
              42.35941
            ],
            [
              -71.02986,
              42.35766
            ],
            [
              -71.02347,
              42.354
            ],
            [
              -71.01825,
              42.35184
            ],
            [
              -71.01658,
              42.35039
            ],
            [
              -71.00854,
              42.3452
            ],
            [
              -71.00378,
              42.34546
            ],
            [
              -71.00273,
              42.34602
            ],
            [
              -71.0027,
              42.3504
            ],
            [
              -71.00161,
              42.35541
            ],
            [
              -71.00003,
              42.35572
            ],
            [
              -70.9978,
              42.35346
            ],
            [
              -70.99483,
              42.35293
            ],
            [
              -70.99043,
              42.35282
            ],
            [
              -70.98851,
              42.35388
            ],
            [
              -70.98559,
              42.3568
            ],
            [
              -70.98629,
              42.3622
            ],
            [
              -70.99367,
              42.36253
            ],
            [
              -70.99664,
              42.36156
            ],
            [
              -70.99965,
              42.36381
            ],
            [
              -70.9988,
              42.36528
            ],
            [
              -70.9985,
              42.36822
            ],
            [
              -70.99698,
              42.37048
            ],
            [
              -70.99833,
              42.37169
            ],
            [
              -70.99615,
              42.37626
            ],
            [
              -70.99381,
              42.37712
            ],
            [
              -70.99669,
              42.37874
            ],
            [
              -70.99465,
              42.38115
            ],
            [
              -70.99424,
              42.38465
            ],
            [
              -70.98828,
              42.38711
            ],
            [
              -70.98729,
              42.38873
            ],
            [
              -70.98744,
              42.39274
            ],
            [
              -70.98977,
              42.39324
            ],
            [
              -70.99382,
              42.39292
            ],
            [
              -70.99505,
              42.39357
            ],
            [
              -70.99274,
              42.39793
            ],
            [
              -70.99681,
              42.40046
            ],
            [
              -71.0008,
              42.40146
            ],
            [
              -71.00188,
              42.40081
            ],
            [
              -71.00483,
              42.40173
            ],
            [
              -71.00273,
              42.40441
            ],
            [
              -71.00428,
              42.40493
            ],
            [
              -71.01103,
              42.39648
            ],
            [
              -71.0134,
              42.3974
            ],
            [
              -71.01609,
              42.3959
            ],
            [
              -71.01779,
              42.3907
            ],
            [
              -71.02051,
              42.38764
            ],
            [
              -71.02243,
              42.38637
            ],
            [
              -71.02771,
              42.38404
            ],
            [
              -71.032,
              42.3846
            ],
            [
              -71.03498,
              42.38588
            ],
            [
              -71.03951,
              42.38685
            ],
            [
              -71.04326,
              42.38359
            ],
            [
              -71.0443,
              42.38321
            ],
            [
              -71.0452,
              42.3771
            ],
            [
              -71.047,
              42.3726
            ]
          ]
        ]
      },
      "properties": {
        "name": "East Boston"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.08986,
              42.35158
            ],
            [
              -71.07998,
              42.35412
            ],
            [
              -71.07346,
              42.35612
            ],
            [
              -71.07201,
              42.35994
            ],
            [
              -71.07236,
              42.36121
            ],
            [
              -71.07038,
              42.3637
            ],
            [
              -71.06928,
              42.36719
            ],
            [
              -71.07154,
              42.36711
            ],
            [
              -71.0751,
              42.3632
            ],
            [
              -71.07609,
              42.36038
            ],
            [
              -71.07795,
              42.35874
            ],
            [
              -71.091,
              42.3544
            ],
            [
              -71.09724,
              42.35319
            ],
            [
              -71.10432,
              42.3524
            ],
            [
              -71.11008,
              42.35255
            ],
            [
              -71.1132,
              42.35311
            ],
            [
              -71.11653,
              42.35503
            ],
            [
              -71.11717,
              42.357
            ],
            [
              -71.11658,
              42.35957
            ],
            [
              -71.11679,
              42.36121
            ],
            [
              -71.11697,
              42.36665
            ],
            [
              -71.11769,
              42.36815
            ],
            [
              -71.11955,
              42.36884
            ],
            [
              -71.12323,
              42.36892
            ],
            [
              -71.12445,
              42.36951
            ],
            [
              -71.12602,
              42.37195
            ],
            [
              -71.1282,
              42.37357
            ],
            [
              -71.13153,
              42.3738
            ],
            [
              -71.1331,
              42.3727
            ],
            [
              -71.13176,
              42.36986
            ],
            [
              -71.13294,
              42.36849
            ],
            [
              -71.13581,
              42.36723
            ],
            [
              -71.13856,
              42.3651
            ],
            [
              -71.14041,
              42.3644
            ],
            [
              -71.14449,
              42.36482
            ],
            [
              -71.14593,
              42.36294
            ],
            [
              -71.14833,
              42.36112
            ],
            [
              -71.15448,
              42.36004
            ],
            [
              -71.15975,
              42.35978
            ],
            [
              -71.16389,
              42.35852
            ],
            [
              -71.16761,
              42.3601
            ],
            [
              -71.16947,
              42.35805
            ],
            [
              -71.16213,
              42.35806
            ],
            [
              -71.15399,
              42.35932
            ],
            [
              -71.14793,
              42.36065
            ],
            [
              -71.14342,
              42.36318
            ],
            [
              -71.13955,
              42.3637
            ],
            [
              -71.13545,
              42.36485
            ],
            [
              -71.1328,
              42.36613
            ],
            [
              -71.13065,
              42.36854
            ],
            [
              -71.12995,
              42.37268
            ],
            [
              -71.1279,
              42.3726
            ],
            [
              -71.12682,
              42.37027
            ],
            [
              -71.12531,
              42.36886
            ],
            [
              -71.11835,
              42.36691
            ],
            [
              -71.11752,
              42.36003
            ],
            [
              -71.11836,
              42.35693
            ],
            [
              -71.11821,
              42.35527
            ],
            [
              -71.11446,
              42.35255
            ],
            [
              -71.11073,
              42.35182
            ],
            [
              -71.08986,
              42.35158
            ]
          ]
        ]
      },
      "properties": {
        "name": "The Esplanade/Charles River"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.09287,
              42.34764
            ],
            [
              -71.09288,
              42.34916
            ],
            [
              -71.08986,
              42.35158
            ],
            [
              -71.11073,
              42.35182
            ],
            [
              -71.11094,
              42.35045
            ],
            [
              -71.10657,
              42.34991
            ],
            [
              -71.10721,
              42.34705
            ],
            [
              -71.10552,
              42.34381
            ],
            [
              -71.10282,
              42.34352
            ],
            [
              -71.10031,
              42.34105
            ],
            [
              -71.09836,
              42.34081
            ],
            [
              -71.09507,
              42.34235
            ],
            [
              -71.0943,
              42.34558
            ],
            [
              -71.0923,
              42.34704
            ],
            [
              -71.09287,
              42.34764
            ]
          ]
        ]
      },
      "properties": {
        "name": "Fenway"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.0923,
              42.34704
            ],
            [
              -71.0909,
              42.34654
            ],
            [
              -71.09084,
              42.34408
            ],
            [
              -71.09221,
              42.34134
            ],
            [
              -71.09899,
              42.3391
            ],
            [
              -71.10031,
              42.33594
            ],
            [
              -71.09575,
              42.33773
            ],
            [
              -71.09052,
              42.33567
            ],
            [
              -71.08315,
              42.34162
            ],
            [
              -71.0858,
              42.34333
            ],
            [
              -71.08792,
              42.34746
            ],
            [
              -71.09287,
              42.34764
            ],
            [
              -71.0923,
              42.34704
            ]
          ]
        ]
      },
      "properties": {
        "name": "Symphony/Northeastern"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.10919,
              42.27436
            ],
            [
              -71.11419,
              42.2771
            ],
            [
              -71.11732,
              42.27663
            ],
            [
              -71.11798,
              42.27322
            ],
            [
              -71.11917,
              42.27074
            ],
            [
              -71.12061,
              42.27028
            ],
            [
              -71.12371,
              42.27152
            ],
            [
              -71.12566,
              42.2734
            ],
            [
              -71.12825,
              42.27425
            ],
            [
              -71.13086,
              42.27287
            ],
            [
              -71.13351,
              42.27454
            ],
            [
              -71.13659,
              42.27151
            ],
            [
              -71.14075,
              42.27434
            ],
            [
              -71.14093,
              42.27692
            ],
            [
              -71.14396,
              42.2805
            ],
            [
              -71.14261,
              42.27845
            ],
            [
              -71.14288,
              42.27709
            ],
            [
              -71.14565,
              42.27573
            ],
            [
              -71.14366,
              42.27285
            ],
            [
              -71.15009,
              42.26758
            ],
            [
              -71.14621,
              42.26385
            ],
            [
              -71.14669,
              42.26064
            ],
            [
              -71.14412,
              42.25932
            ],
            [
              -71.14329,
              42.25623
            ],
            [
              -71.14356,
              42.25469
            ],
            [
              -71.14613,
              42.25296
            ],
            [
              -71.14268,
              42.236
            ],
            [
              -71.13075,
              42.22791
            ],
            [
              -71.12742,
              42.23118
            ],
            [
              -71.12548,
              42.23188
            ],
            [
              -71.12446,
              42.23416
            ],
            [
              -71.12252,
              42.2352
            ],
            [
              -71.12568,
              42.2379
            ],
            [
              -71.12638,
              42.23916
            ],
            [
              -71.10935,
              42.24799
            ],
            [
              -71.10954,
              42.25541
            ],
            [
              -71.11333,
              42.25899
            ],
            [
              -71.11146,
              42.26077
            ],
            [
              -71.10895,
              42.2613
            ],
            [
              -71.105,
              42.2608
            ],
            [
              -71.10269,
              42.25988
            ],
            [
              -71.0979,
              42.26288
            ],
            [
              -71.10014,
              42.26583
            ],
            [
              -71.10437,
              42.26953
            ],
            [
              -71.10336,
              42.271
            ],
            [
              -71.10656,
              42.27177
            ],
            [
              -71.10919,
              42.27436
            ]
          ]
        ]
      },
      "properties": {
        "name": "Hyde Park"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.11321,
              42.33246
            ],
            [
              -71.11358,
              42.33047
            ],
            [
              -71.11677,
              42.32377
            ],
            [
              -71.12011,
              42.32284
            ],
            [
              -71.12153,
              42.32388
            ],
            [
              -71.12427,
              42.32186
            ],
            [
              -71.13186,
              42.31318
            ],
            [
              -71.1365,
              42.3062
            ],
            [
              -71.14014,
              42.30215
            ],
            [
              -71.13692,
              42.30119
            ],
            [
              -71.13487,
              42.30172
            ],
            [
              -71.1309,
              42.30128
            ],
            [
              -71.12793,
              42.30016
            ],
            [
              -71.13007,
              42.29818
            ],
            [
              -71.12935,
              42.29664
            ],
            [
              -71.13046,
              42.29316
            ],
            [
              -71.12618,
              42.29009
            ],
            [
              -71.12217,
              42.29456
            ],
            [
              -71.11544,
              42.29821
            ],
            [
              -71.11786,
              42.29447
            ],
            [
              -71.11908,
              42.29172
            ],
            [
              -71.11939,
              42.28943
            ],
            [
              -71.11869,
              42.28641
            ],
            [
              -71.11258,
              42.2865
            ],
            [
              -71.11064,
              42.2869
            ],
            [
              -71.10795,
              42.28862
            ],
            [
              -71.10567,
              42.28975
            ],
            [
              -71.10195,
              42.29298
            ],
            [
              -71.09618,
              42.29289
            ],
            [
              -71.10329,
              42.29981
            ],
            [
              -71.10606,
              42.30045
            ],
            [
              -71.1057,
              42.30167
            ],
            [
              -71.10325,
              42.30397
            ],
            [
              -71.10269,
              42.30597
            ],
            [
              -71.10072,
              42.30657
            ],
            [
              -71.09938,
              42.30908
            ],
            [
              -71.09793,
              42.31004
            ],
            [
              -71.09749,
              42.31186
            ],
            [
              -71.09515,
              42.31328
            ],
            [
              -71.09819,
              42.31546
            ],
            [
              -71.09847,
              42.32178
            ],
            [
              -71.09892,
              42.32503
            ],
            [
              -71.09928,
              42.32636
            ],
            [
              -71.10565,
              42.32616
            ],
            [
              -71.10878,
              42.32758
            ],
            [
              -71.11228,
              42.32981
            ],
            [
              -71.11274,
              42.3327
            ],
            [
              -71.11321,
              42.33246
            ]
          ]
        ]
      },
      "properties": {
        "name": "Jamaica Plain"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.10328,
              42.34274
            ],
            [
              -71.09899,
              42.3391
            ],
            [
              -71.09221,
              42.34134
            ],
            [
              -71.09084,
              42.34408
            ],
            [
              -71.0909,
              42.34654
            ],
            [
              -71.0923,
              42.34704
            ],
            [
              -71.0943,
              42.34558
            ],
            [
              -71.09507,
              42.34235
            ],
            [
              -71.09836,
              42.34081
            ],
            [
              -71.10031,
              42.34105
            ],
            [
              -71.10282,
              42.34352
            ],
            [
              -71.10328,
              42.34274
            ]
          ]
        ]
      },
      "properties": {
        "name": "The Fens"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.10282,
              42.34352
            ],
            [
              -71.10552,
              42.34381
            ],
            [
              -71.10955,
              42.34149
            ],
            [
              -71.11058,
              42.34044
            ],
            [
              -71.11155,
              42.3373
            ],
            [
              -71.11052,
              42.3354
            ],
            [
              -71.11321,
              42.33246
            ],
            [
              -71.11274,
              42.3327
            ],
            [
              -71.10989,
              42.33538
            ],
            [
              -71.11006,
              42.33631
            ],
            [
              -71.11076,
              42.33751
            ],
            [
              -71.11,
              42.34032
            ],
            [
              -71.10691,
              42.34177
            ],
            [
              -71.10553,
              42.34324
            ],
            [
              -71.10328,
              42.34274
            ],
            [
              -71.10282,
              42.34352
            ]
          ]
        ]
      },
      "properties": {
        "name": "Riverway"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.10031,
              42.33594
            ],
            [
              -71.09899,
              42.3391
            ],
            [
              -71.10328,
              42.34274
            ],
            [
              -71.10553,
              42.34324
            ],
            [
              -71.10691,
              42.34177
            ],
            [
              -71.11,
              42.34032
            ],
            [
              -71.11076,
              42.33751
            ],
            [
              -71.11006,
              42.33631
            ],
            [
              -71.10558,
              42.33378
            ],
            [
              -71.10031,
              42.33594
            ]
          ]
        ]
      },
      "properties": {
        "name": "Longwood"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.09618,
              42.29289
            ],
            [
              -71.10195,
              42.29298
            ],
            [
              -71.10567,
              42.28975
            ],
            [
              -71.10795,
              42.28862
            ],
            [
              -71.0999,
              42.28249
            ],
            [
              -71.10411,
              42.28117
            ],
            [
              -71.10744,
              42.27874
            ],
            [
              -71.10919,
              42.27436
            ],
            [
              -71.10656,
              42.27177
            ],
            [
              -71.10336,
              42.271
            ],
            [
              -71.10437,
              42.26953
            ],
            [
              -71.10014,
              42.26583
            ],
            [
              -71.0979,
              42.26288
            ],
            [
              -71.09413,
              42.26713
            ],
            [
              -71.09082,
              42.26648
            ],
            [
              -71.08915,
              42.26974
            ],
            [
              -71.08338,
              42.26869
            ],
            [
              -71.07877,
              42.26957
            ],
            [
              -71.07711,
              42.27038
            ],
            [
              -71.07299,
              42.27034
            ],
            [
              -71.06814,
              42.271
            ],
            [
              -71.06592,
              42.27993
            ],
            [
              -71.07102,
              42.27831
            ],
            [
              -71.07317,
              42.27805
            ],
            [
              -71.07889,
              42.27857
            ],
            [
              -71.08281,
              42.28043
            ],
            [
              -71.0863,
              42.28117
            ],
            [
              -71.08979,
              42.28394
            ],
            [
              -71.09286,
              42.28495
            ],
            [
              -71.09576,
              42.29197
            ],
            [
              -71.09618,
              42.29289
            ]
          ]
        ]
      },
      "properties": {
        "name": "Mattapan"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.09892,
              42.32503
            ],
            [
              -71.09651,
              42.33021
            ],
            [
              -71.09052,
              42.33567
            ],
            [
              -71.09575,
              42.33773
            ],
            [
              -71.10031,
              42.33594
            ],
            [
              -71.10558,
              42.33378
            ],
            [
              -71.11006,
              42.33631
            ],
            [
              -71.10989,
              42.33538
            ],
            [
              -71.11274,
              42.3327
            ],
            [
              -71.11228,
              42.32981
            ],
            [
              -71.10878,
              42.32758
            ],
            [
              -71.10565,
              42.32616
            ],
            [
              -71.09928,
              42.32636
            ],
            [
              -71.09892,
              42.32503
            ]
          ]
        ]
      },
      "properties": {
        "name": "Mission Hill"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.04639,
              42.36394
            ],
            [
              -71.04667,
              42.3675
            ],
            [
              -71.04958,
              42.37019
            ],
            [
              -71.0491,
              42.3712
            ],
            [
              -71.0509,
              42.3707
            ],
            [
              -71.055,
              42.3707
            ],
            [
              -71.0598,
              42.36877
            ],
            [
              -71.05848,
              42.36674
            ],
            [
              -71.05843,
              42.36464
            ],
            [
              -71.05697,
              42.36321
            ],
            [
              -71.05281,
              42.36092
            ],
            [
              -71.05227,
              42.36041
            ],
            [
              -71.05186,
              42.35963
            ],
            [
              -71.04557,
              42.35973
            ],
            [
              -71.04639,
              42.36394
            ]
          ]
        ]
      },
      "properties": {
        "name": "North End"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.10795,
              42.28862
            ],
            [
              -71.11064,
              42.2869
            ],
            [
              -71.11258,
              42.2865
            ],
            [
              -71.11869,
              42.28641
            ],
            [
              -71.11939,
              42.28943
            ],
            [
              -71.11908,
              42.29172
            ],
            [
              -71.11786,
              42.29447
            ],
            [
              -71.11544,
              42.29821
            ],
            [
              -71.12217,
              42.29456
            ],
            [
              -71.12618,
              42.29009
            ],
            [
              -71.13046,
              42.29316
            ],
            [
              -71.12935,
              42.29664
            ],
            [
              -71.13007,
              42.29818
            ],
            [
              -71.13429,
              42.2959
            ],
            [
              -71.14273,
              42.28878
            ],
            [
              -71.14732,
              42.28741
            ],
            [
              -71.1475,
              42.28418
            ],
            [
              -71.14396,
              42.2805
            ],
            [
              -71.14093,
              42.27692
            ],
            [
              -71.14075,
              42.27434
            ],
            [
              -71.13659,
              42.27151
            ],
            [
              -71.13351,
              42.27454
            ],
            [
              -71.13086,
              42.27287
            ],
            [
              -71.12825,
              42.27425
            ],
            [
              -71.12566,
              42.2734
            ],
            [
              -71.12371,
              42.27152
            ],
            [
              -71.12061,
              42.27028
            ],
            [
              -71.11917,
              42.27074
            ],
            [
              -71.11798,
              42.27322
            ],
            [
              -71.11732,
              42.27663
            ],
            [
              -71.11419,
              42.2771
            ],
            [
              -71.10919,
              42.27436
            ],
            [
              -71.10744,
              42.27874
            ],
            [
              -71.10411,
              42.28117
            ],
            [
              -71.0999,
              42.28249
            ],
            [
              -71.10795,
              42.28862
            ]
          ]
        ]
      },
      "properties": {
        "name": "Roslindale"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.06541,
              42.33544
            ],
            [
              -71.06923,
              42.33473
            ],
            [
              -71.07215,
              42.33273
            ],
            [
              -71.08315,
              42.34162
            ],
            [
              -71.09052,
              42.33567
            ],
            [
              -71.09651,
              42.33021
            ],
            [
              -71.09892,
              42.32503
            ],
            [
              -71.09847,
              42.32178
            ],
            [
              -71.09819,
              42.31546
            ],
            [
              -71.09515,
              42.31328
            ],
            [
              -71.09749,
              42.31186
            ],
            [
              -71.09793,
              42.31004
            ],
            [
              -71.09938,
              42.30908
            ],
            [
              -71.10072,
              42.30657
            ],
            [
              -71.10269,
              42.30597
            ],
            [
              -71.10325,
              42.30397
            ],
            [
              -71.1057,
              42.30167
            ],
            [
              -71.10606,
              42.30045
            ],
            [
              -71.10329,
              42.29981
            ],
            [
              -71.09618,
              42.29289
            ],
            [
              -71.09576,
              42.29197
            ],
            [
              -71.09157,
              42.29675
            ],
            [
              -71.08699,
              42.29814
            ],
            [
              -71.08419,
              42.30719
            ],
            [
              -71.07882,
              42.31461
            ],
            [
              -71.07317,
              42.31222
            ],
            [
              -71.07283,
              42.31666
            ],
            [
              -71.07039,
              42.31744
            ],
            [
              -71.0697,
              42.31895
            ],
            [
              -71.0722,
              42.32136
            ],
            [
              -71.06806,
              42.32128
            ],
            [
              -71.06643,
              42.32626
            ],
            [
              -71.06355,
              42.33079
            ],
            [
              -71.0628,
              42.33197
            ],
            [
              -71.06541,
              42.33544
            ]
          ]
        ]
      },
      "properties": {
        "name": "Roxbury"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.00925,
              42.34052
            ],
            [
              -71.01337,
              42.33889
            ],
            [
              -71.01801,
              42.33882
            ],
            [
              -71.02195,
              42.33785
            ],
            [
              -71.02519,
              42.33844
            ],
            [
              -71.02513,
              42.34151
            ],
            [
              -71.02929,
              42.34176
            ],
            [
              -71.0338,
              42.34149
            ],
            [
              -71.03907,
              42.3416
            ],
            [
              -71.0399,
              42.33934
            ],
            [
              -71.04219,
              42.33958
            ],
            [
              -71.04438,
              42.33798
            ],
            [
              -71.05172,
              42.34268
            ],
            [
              -71.05723,
              42.34354
            ],
            [
              -71.05647,
              42.34611
            ],
            [
              -71.0584,
              42.34661
            ],
            [
              -71.05879,
              42.34616
            ],
            [
              -71.06071,
              42.34625
            ],
            [
              -71.06172,
              42.34396
            ],
            [
              -71.06514,
              42.33744
            ],
            [
              -71.06541,
              42.33544
            ],
            [
              -71.0628,
              42.33197
            ],
            [
              -71.06355,
              42.33079
            ],
            [
              -71.05824,
              42.32973
            ],
            [
              -71.05692,
              42.32804
            ],
            [
              -71.05685,
              42.32629
            ],
            [
              -71.0543,
              42.32443
            ],
            [
              -71.05246,
              42.32147
            ],
            [
              -71.04784,
              42.32259
            ],
            [
              -71.04541,
              42.3238
            ],
            [
              -71.04567,
              42.32682
            ],
            [
              -71.04381,
              42.32821
            ],
            [
              -71.03898,
              42.32824
            ],
            [
              -71.0372,
              42.32762
            ],
            [
              -71.03252,
              42.32773
            ],
            [
              -71.02778,
              42.33025
            ],
            [
              -71.02282,
              42.33133
            ],
            [
              -71.01848,
              42.32955
            ],
            [
              -71.01471,
              42.32905
            ],
            [
              -71.01271,
              42.32969
            ],
            [
              -71.00956,
              42.33502
            ],
            [
              -71.00697,
              42.33703
            ],
            [
              -71.00925,
              42.34052
            ]
          ]
        ]
      },
      "properties": {
        "name": "South Boston"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.00925,
              42.34052
            ],
            [
              -71.01243,
              42.34267
            ],
            [
              -71.015,
              42.34338
            ],
            [
              -71.01892,
              42.34374
            ],
            [
              -71.01904,
              42.34528
            ],
            [
              -71.02204,
              42.34868
            ],
            [
              -71.02429,
              42.35004
            ],
            [
              -71.02737,
              42.35037
            ],
            [
              -71.03242,
              42.35309
            ],
            [
              -71.04583,
              42.35723
            ],
            [
              -71.04557,
              42.35973
            ],
            [
              -71.05219,
              42.35112
            ],
            [
              -71.05463,
              42.34742
            ],
            [
              -71.05647,
              42.34611
            ],
            [
              -71.05723,
              42.34354
            ],
            [
              -71.05172,
              42.34268
            ],
            [
              -71.04438,
              42.33798
            ],
            [
              -71.04219,
              42.33958
            ],
            [
              -71.0399,
              42.33934
            ],
            [
              -71.03907,
              42.3416
            ],
            [
              -71.0338,
              42.34149
            ],
            [
              -71.02929,
              42.34176
            ],
            [
              -71.02513,
              42.34151
            ],
            [
              -71.02519,
              42.33844
            ],
            [
              -71.02195,
              42.33785
            ],
            [
              -71.01801,
              42.33882
            ],
            [
              -71.01337,
              42.33889
            ],
            [
              -71.00925,
              42.34052
            ]
          ]
        ]
      },
      "properties": {
        "name": "South Boston Waterfront"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.06661,
              42.34876
            ],
            [
              -71.06687,
              42.35096
            ],
            [
              -71.0699,
              42.35015
            ],
            [
              -71.07046,
              42.35142
            ],
            [
              -71.07282,
              42.35076
            ],
            [
              -71.072,
              42.34902
            ],
            [
              -71.0751,
              42.34816
            ],
            [
              -71.08315,
              42.34162
            ],
            [
              -71.07215,
              42.33273
            ],
            [
              -71.06923,
              42.33473
            ],
            [
              -71.06541,
              42.33544
            ],
            [
              -71.06514,
              42.33744
            ],
            [
              -71.06172,
              42.34396
            ],
            [
              -71.06071,
              42.34625
            ],
            [
              -71.06576,
              42.34751
            ],
            [
              -71.06661,
              42.34876
            ]
          ]
        ]
      },
      "properties": {
        "name": "South End"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.06406,
              42.369
            ],
            [
              -71.06948,
              42.36905
            ],
            [
              -71.07154,
              42.36711
            ],
            [
              -71.06928,
              42.36719
            ],
            [
              -71.07038,
              42.3637
            ],
            [
              -71.07236,
              42.36121
            ],
            [
              -71.06291,
              42.36123
            ],
            [
              -71.06186,
              42.36243
            ],
            [
              -71.05839,
              42.36369
            ],
            [
              -71.05843,
              42.36464
            ],
            [
              -71.05848,
              42.36674
            ],
            [
              -71.0598,
              42.36877
            ],
            [
              -71.06299,
              42.36839
            ],
            [
              -71.06406,
              42.369
            ]
          ]
        ]
      },
      "properties": {
        "name": "West End"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.14014,
              42.30215
            ],
            [
              -71.14688,
              42.29728
            ],
            [
              -71.15215,
              42.29461
            ],
            [
              -71.1647,
              42.30383
            ],
            [
              -71.17864,
              42.2946
            ],
            [
              -71.1909,
              42.28325
            ],
            [
              -71.19075,
              42.28184
            ],
            [
              -71.18777,
              42.28023
            ],
            [
              -71.18551,
              42.27968
            ],
            [
              -71.18305,
              42.27585
            ],
            [
              -71.17678,
              42.2768
            ],
            [
              -71.17442,
              42.27504
            ],
            [
              -71.17461,
              42.27301
            ],
            [
              -71.17296,
              42.27013
            ],
            [
              -71.17444,
              42.26734
            ],
            [
              -71.17183,
              42.26635
            ],
            [
              -71.17132,
              42.26535
            ],
            [
              -71.15858,
              42.25516
            ],
            [
              -71.15231,
              42.25834
            ],
            [
              -71.14664,
              42.25576
            ],
            [
              -71.14613,
              42.25296
            ],
            [
              -71.14356,
              42.25469
            ],
            [
              -71.14329,
              42.25623
            ],
            [
              -71.14412,
              42.25932
            ],
            [
              -71.14669,
              42.26064
            ],
            [
              -71.14621,
              42.26385
            ],
            [
              -71.15009,
              42.26758
            ],
            [
              -71.14366,
              42.27285
            ],
            [
              -71.14565,
              42.27573
            ],
            [
              -71.14288,
              42.27709
            ],
            [
              -71.14261,
              42.27845
            ],
            [
              -71.14396,
              42.2805
            ],
            [
              -71.1475,
              42.28418
            ],
            [
              -71.14732,
              42.28741
            ],
            [
              -71.14273,
              42.28878
            ],
            [
              -71.13429,
              42.2959
            ],
            [
              -71.13007,
              42.29818
            ],
            [
              -71.12793,
              42.30016
            ],
            [
              -71.1309,
              42.30128
            ],
            [
              -71.13487,
              42.30172
            ],
            [
              -71.13692,
              42.30119
            ],
            [
              -71.14014,
              42.30215
            ]
          ]
        ]
      },
      "properties": {
        "name": "West Roxbury"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "The Port"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.09853,
              42.37184
            ],
            [
              -71.09089,
              42.36534
            ],
            [
              -71.08973,
              42.3649
            ],
            [
              -71.09065,
              42.36288
            ],
            [
              -71.09535,
              42.36043
            ],
            [
              -71.10399,
              42.36557
            ],
            [
              -71.09898,
              42.3722
            ],
            [
              -71.09853,
              42.37184
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Neighborhood Nine"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.13044,
              42.39027
            ],
            [
              -71.12046,
              42.38858
            ],
            [
              -71.11942,
              42.38818
            ],
            [
              -71.11916,
              42.38707
            ],
            [
              -71.12017,
              42.37771
            ],
            [
              -71.1198,
              42.37679
            ],
            [
              -71.11821,
              42.37606
            ],
            [
              -71.11811,
              42.37587
            ],
            [
              -71.11859,
              42.37497
            ],
            [
              -71.12205,
              42.37645
            ],
            [
              -71.12371,
              42.37832
            ],
            [
              -71.13102,
              42.38242
            ],
            [
              -71.14168,
              42.38714
            ],
            [
              -71.14045,
              42.38938
            ],
            [
              -71.14012,
              42.38973
            ],
            [
              -71.13876,
              42.39062
            ],
            [
              -71.13825,
              42.39079
            ],
            [
              -71.13669,
              42.39111
            ],
            [
              -71.13587,
              42.3912
            ],
            [
              -71.13044,
              42.39027
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Wellington-Harrington"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.08746,
              42.37339
            ],
            [
              -71.08973,
              42.3649
            ],
            [
              -71.09089,
              42.36534
            ],
            [
              -71.09853,
              42.37184
            ],
            [
              -71.10162,
              42.37437
            ],
            [
              -71.08979,
              42.37396
            ],
            [
              -71.08746,
              42.37339
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Mid-Cambridge"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.10727,
              42.37809
            ],
            [
              -71.10323,
              42.37435
            ],
            [
              -71.10162,
              42.37437
            ],
            [
              -71.09853,
              42.37184
            ],
            [
              -71.09898,
              42.3722
            ],
            [
              -71.10399,
              42.36557
            ],
            [
              -71.10837,
              42.36818
            ],
            [
              -71.11271,
              42.36988
            ],
            [
              -71.116,
              42.37256
            ],
            [
              -71.11855,
              42.37332
            ],
            [
              -71.11939,
              42.37347
            ],
            [
              -71.11916,
              42.3736
            ],
            [
              -71.11859,
              42.37497
            ],
            [
              -71.11811,
              42.37587
            ],
            [
              -71.11564,
              42.37631
            ],
            [
              -71.10727,
              42.37809
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "North Cambridge"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.15641,
              42.39586
            ],
            [
              -71.1521,
              42.40106
            ],
            [
              -71.14332,
              42.39727
            ],
            [
              -71.14064,
              42.39965
            ],
            [
              -71.13676,
              42.40078
            ],
            [
              -71.13481,
              42.40286
            ],
            [
              -71.13463,
              42.40426
            ],
            [
              -71.13383,
              42.40364
            ],
            [
              -71.1313,
              42.40159
            ],
            [
              -71.12878,
              42.39871
            ],
            [
              -71.12431,
              42.39358
            ],
            [
              -71.12285,
              42.39224
            ],
            [
              -71.12095,
              42.39371
            ],
            [
              -71.11706,
              42.38956
            ],
            [
              -71.11798,
              42.38907
            ],
            [
              -71.11744,
              42.38837
            ],
            [
              -71.11817,
              42.38801
            ],
            [
              -71.11767,
              42.3875
            ],
            [
              -71.12046,
              42.38858
            ],
            [
              -71.13044,
              42.39027
            ],
            [
              -71.13587,
              42.3912
            ],
            [
              -71.1443,
              42.39263
            ],
            [
              -71.14488,
              42.39277
            ],
            [
              -71.1503,
              42.39497
            ],
            [
              -71.15277,
              42.39556
            ],
            [
              -71.15641,
              42.39586
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Cambridge Highlands"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.15641,
              42.39586
            ],
            [
              -71.15277,
              42.39556
            ],
            [
              -71.1503,
              42.39497
            ],
            [
              -71.14488,
              42.39277
            ],
            [
              -71.1443,
              42.39263
            ],
            [
              -71.13587,
              42.3912
            ],
            [
              -71.13669,
              42.39111
            ],
            [
              -71.13825,
              42.39079
            ],
            [
              -71.13876,
              42.39062
            ],
            [
              -71.14012,
              42.38973
            ],
            [
              -71.14045,
              42.38938
            ],
            [
              -71.14168,
              42.38714
            ],
            [
              -71.14722,
              42.38536
            ],
            [
              -71.15128,
              42.38406
            ],
            [
              -71.15644,
              42.38571
            ],
            [
              -71.15814,
              42.38691
            ],
            [
              -71.15701,
              42.39015
            ],
            [
              -71.15843,
              42.39459
            ],
            [
              -71.15641,
              42.39586
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Strawberry Hill"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.15626,
              42.38064
            ],
            [
              -71.15507,
              42.38022
            ],
            [
              -71.15519,
              42.38119
            ],
            [
              -71.15758,
              42.38207
            ],
            [
              -71.1604,
              42.38646
            ],
            [
              -71.15814,
              42.38691
            ],
            [
              -71.15644,
              42.38571
            ],
            [
              -71.15128,
              42.38406
            ],
            [
              -71.14545,
              42.38082
            ],
            [
              -71.14771,
              42.37884
            ],
            [
              -71.15005,
              42.3746
            ],
            [
              -71.15438,
              42.37506
            ],
            [
              -71.15626,
              42.38064
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "West Cambridge"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.13856,
              42.3651
            ],
            [
              -71.14041,
              42.3644
            ],
            [
              -71.14449,
              42.36482
            ],
            [
              -71.14433,
              42.36639
            ],
            [
              -71.14248,
              42.36688
            ],
            [
              -71.14097,
              42.36923
            ],
            [
              -71.14004,
              42.37357
            ],
            [
              -71.14395,
              42.37405
            ],
            [
              -71.14366,
              42.37525
            ],
            [
              -71.15005,
              42.3746
            ],
            [
              -71.14771,
              42.37884
            ],
            [
              -71.14545,
              42.38082
            ],
            [
              -71.15128,
              42.38406
            ],
            [
              -71.14168,
              42.38714
            ],
            [
              -71.13102,
              42.38242
            ],
            [
              -71.12371,
              42.37832
            ],
            [
              -71.12205,
              42.37645
            ],
            [
              -71.11859,
              42.37497
            ],
            [
              -71.11916,
              42.3736
            ],
            [
              -71.11939,
              42.37347
            ],
            [
              -71.12323,
              42.36892
            ],
            [
              -71.12445,
              42.36951
            ],
            [
              -71.12602,
              42.37195
            ],
            [
              -71.1282,
              42.37357
            ],
            [
              -71.13153,
              42.3738
            ],
            [
              -71.1331,
              42.3727
            ],
            [
              -71.13176,
              42.36986
            ],
            [
              -71.13294,
              42.36849
            ],
            [
              -71.13581,
              42.36723
            ],
            [
              -71.13856,
              42.3651
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Riverside"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.12323,
              42.36892
            ],
            [
              -71.11939,
              42.37347
            ],
            [
              -71.11855,
              42.37332
            ],
            [
              -71.116,
              42.37256
            ],
            [
              -71.11271,
              42.36988
            ],
            [
              -71.10837,
              42.36818
            ],
            [
              -71.10399,
              42.36557
            ],
            [
              -71.11679,
              42.36121
            ],
            [
              -71.11697,
              42.36665
            ],
            [
              -71.11769,
              42.36815
            ],
            [
              -71.11955,
              42.36884
            ],
            [
              -71.12323,
              42.36892
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Cambridgeport"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.11679,
              42.36121
            ],
            [
              -71.10399,
              42.36557
            ],
            [
              -71.09535,
              42.36043
            ],
            [
              -71.10843,
              42.35394
            ],
            [
              -71.11008,
              42.35255
            ],
            [
              -71.1132,
              42.35311
            ],
            [
              -71.11653,
              42.35503
            ],
            [
              -71.11717,
              42.357
            ],
            [
              -71.11658,
              42.35957
            ],
            [
              -71.11679,
              42.36121
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Area 2/MIT"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.07795,
              42.35874
            ],
            [
              -71.091,
              42.3544
            ],
            [
              -71.09724,
              42.35319
            ],
            [
              -71.10432,
              42.3524
            ],
            [
              -71.11008,
              42.35255
            ],
            [
              -71.10843,
              42.35394
            ],
            [
              -71.09535,
              42.36043
            ],
            [
              -71.09065,
              42.36288
            ],
            [
              -71.08973,
              42.3649
            ],
            [
              -71.08312,
              42.3621
            ],
            [
              -71.07609,
              42.36038
            ],
            [
              -71.07795,
              42.35874
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "East Cambridge"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.07247,
              42.37266
            ],
            [
              -71.06712,
              42.37182
            ],
            [
              -71.06406,
              42.369
            ],
            [
              -71.06948,
              42.36905
            ],
            [
              -71.07154,
              42.36711
            ],
            [
              -71.0751,
              42.3632
            ],
            [
              -71.07609,
              42.36038
            ],
            [
              -71.08312,
              42.3621
            ],
            [
              -71.08973,
              42.3649
            ],
            [
              -71.08746,
              42.37339
            ],
            [
              -71.08609,
              42.37306
            ],
            [
              -71.08544,
              42.37404
            ],
            [
              -71.08482,
              42.37335
            ],
            [
              -71.08439,
              42.37326
            ],
            [
              -71.08372,
              42.37335
            ],
            [
              -71.0828,
              42.3733
            ],
            [
              -71.08199,
              42.37354
            ],
            [
              -71.08174,
              42.37376
            ],
            [
              -71.0809,
              42.37397
            ],
            [
              -71.0804,
              42.37412
            ],
            [
              -71.07984,
              42.37396
            ],
            [
              -71.07931,
              42.3741
            ],
            [
              -71.07875,
              42.37411
            ],
            [
              -71.07781,
              42.37349
            ],
            [
              -71.07729,
              42.37345
            ],
            [
              -71.07626,
              42.37375
            ],
            [
              -71.07584,
              42.3738
            ],
            [
              -71.07545,
              42.37359
            ],
            [
              -71.07487,
              42.37271
            ],
            [
              -71.07442,
              42.37256
            ],
            [
              -71.07384,
              42.3726
            ],
            [
              -71.07247,
              42.37266
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Baldwin"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.10842,
              42.3791
            ],
            [
              -71.10727,
              42.37809
            ],
            [
              -71.11564,
              42.37631
            ],
            [
              -71.11811,
              42.37587
            ],
            [
              -71.11821,
              42.37606
            ],
            [
              -71.1198,
              42.37679
            ],
            [
              -71.12017,
              42.37771
            ],
            [
              -71.11916,
              42.38707
            ],
            [
              -71.11942,
              42.38818
            ],
            [
              -71.11767,
              42.3875
            ],
            [
              -71.11168,
              42.38177
            ],
            [
              -71.11069,
              42.38169
            ],
            [
              -71.10965,
              42.38085
            ],
            [
              -71.10784,
              42.37938
            ],
            [
              -71.10842,
              42.3791
            ]
          ]
        ]
      }
    },
    /* --- Somerville --- */
    {
      "type": "Feature",
      "properties": {
        "name": "North Point"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.07296,
              42.37383
            ],
            [
              -71.08257,
              42.37506
            ],
            [
              -71.0809,
              42.37397
            ],
            [
              -71.0804,
              42.37412
            ],
            [
              -71.07984,
              42.37396
            ],
            [
              -71.07931,
              42.3741
            ],
            [
              -71.07875,
              42.37411
            ],
            [
              -71.07781,
              42.37349
            ],
            [
              -71.07729,
              42.37345
            ],
            [
              -71.07626,
              42.37375
            ],
            [
              -71.07584,
              42.3738
            ],
            [
              -71.07545,
              42.37359
            ],
            [
              -71.07487,
              42.37271
            ],
            [
              -71.07442,
              42.37256
            ],
            [
              -71.07384,
              42.3726
            ],
            [
              -71.07247,
              42.37266
            ],
            [
              -71.07296,
              42.37383
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Boynton Yards"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.08876,
              42.37577
            ],
            [
              -71.09153,
              42.3761
            ],
            [
              -71.09237,
              42.3763
            ],
            [
              -71.09357,
              42.3767
            ],
            [
              -71.09523,
              42.37747
            ],
            [
              -71.09558,
              42.37698
            ],
            [
              -71.09469,
              42.37413
            ],
            [
              -71.08979,
              42.37396
            ],
            [
              -71.08746,
              42.37339
            ],
            [
              -71.08745,
              42.37363
            ],
            [
              -71.08805,
              42.37416
            ],
            [
              -71.08876,
              42.37577
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Twin City"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.08257,
              42.37506
            ],
            [
              -71.08573,
              42.37543
            ],
            [
              -71.08626,
              42.37575
            ],
            [
              -71.087,
              42.37634
            ],
            [
              -71.08874,
              42.37722
            ],
            [
              -71.08906,
              42.37758
            ],
            [
              -71.08912,
              42.37671
            ],
            [
              -71.08876,
              42.37577
            ],
            [
              -71.08805,
              42.37416
            ],
            [
              -71.08745,
              42.37363
            ],
            [
              -71.08746,
              42.37339
            ],
            [
              -71.08609,
              42.37306
            ],
            [
              -71.08544,
              42.37404
            ],
            [
              -71.08482,
              42.37335
            ],
            [
              -71.08439,
              42.37326
            ],
            [
              -71.08372,
              42.37335
            ],
            [
              -71.0828,
              42.3733
            ],
            [
              -71.08199,
              42.37354
            ],
            [
              -71.08174,
              42.37376
            ],
            [
              -71.0809,
              42.37397
            ],
            [
              -71.08257,
              42.37506
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Brickbottom"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.08257,
              42.37506
            ],
            [
              -71.08417,
              42.37669
            ],
            [
              -71.08553,
              42.37812
            ],
            [
              -71.08792,
              42.38088
            ],
            [
              -71.08941,
              42.38043
            ],
            [
              -71.08967,
              42.38029
            ],
            [
              -71.08974,
              42.38009
            ],
            [
              -71.08906,
              42.37758
            ],
            [
              -71.08874,
              42.37722
            ],
            [
              -71.087,
              42.37634
            ],
            [
              -71.08626,
              42.37575
            ],
            [
              -71.08573,
              42.37543
            ],
            [
              -71.08257,
              42.37506
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Duck Village"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.10431,
              42.38095
            ],
            [
              -71.10576,
              42.3813
            ],
            [
              -71.10704,
              42.38166
            ],
            [
              -71.10733,
              42.38124
            ],
            [
              -71.1083,
              42.38165
            ],
            [
              -71.10965,
              42.38085
            ],
            [
              -71.10785,
              42.37937
            ],
            [
              -71.10846,
              42.37911
            ],
            [
              -71.10727,
              42.37809
            ],
            [
              -71.10526,
              42.37853
            ],
            [
              -71.10281,
              42.37916
            ],
            [
              -71.10244,
              42.38017
            ],
            [
              -71.10453,
              42.38039
            ],
            [
              -71.10431,
              42.38095
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Inner Belt"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.07296,
              42.37383
            ],
            [
              -71.07566,
              42.38019
            ],
            [
              -71.0807,
              42.38104
            ],
            [
              -71.08093,
              42.38213
            ],
            [
              -71.08362,
              42.38169
            ],
            [
              -71.08629,
              42.38131
            ],
            [
              -71.08792,
              42.38088
            ],
            [
              -71.08553,
              42.37812
            ],
            [
              -71.08417,
              42.37669
            ],
            [
              -71.08257,
              42.37506
            ],
            [
              -71.07296,
              42.37383
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Union Square"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.09123,
              42.38421
            ],
            [
              -71.09246,
              42.38546
            ],
            [
              -71.09366,
              42.38651
            ],
            [
              -71.09469,
              42.3871
            ],
            [
              -71.09536,
              42.38737
            ],
            [
              -71.09763,
              42.38844
            ],
            [
              -71.10121,
              42.38319
            ],
            [
              -71.10272,
              42.38362
            ],
            [
              -71.10431,
              42.38095
            ],
            [
              -71.10453,
              42.38039
            ],
            [
              -71.10244,
              42.38017
            ],
            [
              -71.10281,
              42.37916
            ],
            [
              -71.10526,
              42.37853
            ],
            [
              -71.10727,
              42.37809
            ],
            [
              -71.10323,
              42.37435
            ],
            [
              -71.10162,
              42.37437
            ],
            [
              -71.09469,
              42.37413
            ],
            [
              -71.09558,
              42.37698
            ],
            [
              -71.09523,
              42.37747
            ],
            [
              -71.09357,
              42.3767
            ],
            [
              -71.09237,
              42.3763
            ],
            [
              -71.09153,
              42.3761
            ],
            [
              -71.08876,
              42.37577
            ],
            [
              -71.08912,
              42.37671
            ],
            [
              -71.08906,
              42.37758
            ],
            [
              -71.08974,
              42.38009
            ],
            [
              -71.08967,
              42.38029
            ],
            [
              -71.09007,
              42.38155
            ],
            [
              -71.09029,
              42.38193
            ],
            [
              -71.0912,
              42.3832
            ],
            [
              -71.09134,
              42.38369
            ],
            [
              -71.09123,
              42.38421
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "East Somerville"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.07745,
              42.38623
            ],
            [
              -71.07839,
              42.38728
            ],
            [
              -71.07924,
              42.388
            ],
            [
              -71.08204,
              42.39012
            ],
            [
              -71.08311,
              42.39107
            ],
            [
              -71.08432,
              42.39246
            ],
            [
              -71.08504,
              42.39318
            ],
            [
              -71.0856,
              42.39364
            ],
            [
              -71.08579,
              42.39272
            ],
            [
              -71.08607,
              42.39195
            ],
            [
              -71.0864,
              42.39141
            ],
            [
              -71.08898,
              42.38887
            ],
            [
              -71.08945,
              42.38831
            ],
            [
              -71.09027,
              42.38694
            ],
            [
              -71.09086,
              42.38551
            ],
            [
              -71.09123,
              42.38421
            ],
            [
              -71.09134,
              42.38369
            ],
            [
              -71.0912,
              42.3832
            ],
            [
              -71.09029,
              42.38193
            ],
            [
              -71.09007,
              42.38155
            ],
            [
              -71.08967,
              42.38029
            ],
            [
              -71.08941,
              42.38043
            ],
            [
              -71.08792,
              42.38088
            ],
            [
              -71.08629,
              42.38131
            ],
            [
              -71.08362,
              42.38169
            ],
            [
              -71.08093,
              42.38213
            ],
            [
              -71.08081,
              42.38242
            ],
            [
              -71.07979,
              42.38293
            ],
            [
              -71.07745,
              42.38623
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Porter Square"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.11515,
              42.39279
            ],
            [
              -71.11719,
              42.39357
            ],
            [
              -71.11995,
              42.39471
            ],
            [
              -71.12095,
              42.39371
            ],
            [
              -71.11706,
              42.38956
            ],
            [
              -71.11798,
              42.38907
            ],
            [
              -71.11744,
              42.38837
            ],
            [
              -71.11817,
              42.38801
            ],
            [
              -71.11767,
              42.3875
            ],
            [
              -71.11168,
              42.38177
            ],
            [
              -71.11069,
              42.38169
            ],
            [
              -71.11264,
              42.38337
            ],
            [
              -71.11177,
              42.38454
            ],
            [
              -71.11291,
              42.38519
            ],
            [
              -71.11381,
              42.3861
            ],
            [
              -71.11228,
              42.38828
            ],
            [
              -71.11346,
              42.38872
            ],
            [
              -71.11219,
              42.39056
            ],
            [
              -71.11326,
              42.39098
            ],
            [
              -71.11362,
              42.39048
            ],
            [
              -71.11498,
              42.39141
            ],
            [
              -71.11574,
              42.39183
            ],
            [
              -71.11515,
              42.39279
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Spring Hill"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.11107,
              42.39402
            ],
            [
              -71.11379,
              42.3947
            ],
            [
              -71.1149,
              42.39328
            ],
            [
              -71.11515,
              42.39279
            ],
            [
              -71.11574,
              42.39183
            ],
            [
              -71.11498,
              42.39141
            ],
            [
              -71.11362,
              42.39048
            ],
            [
              -71.11326,
              42.39098
            ],
            [
              -71.11219,
              42.39056
            ],
            [
              -71.11346,
              42.38872
            ],
            [
              -71.11228,
              42.38828
            ],
            [
              -71.11381,
              42.3861
            ],
            [
              -71.11291,
              42.38519
            ],
            [
              -71.11177,
              42.38454
            ],
            [
              -71.11264,
              42.38337
            ],
            [
              -71.11069,
              42.38169
            ],
            [
              -71.10965,
              42.38085
            ],
            [
              -71.1083,
              42.38165
            ],
            [
              -71.10733,
              42.38124
            ],
            [
              -71.10704,
              42.38166
            ],
            [
              -71.10576,
              42.3813
            ],
            [
              -71.10431,
              42.38095
            ],
            [
              -71.10272,
              42.38362
            ],
            [
              -71.10121,
              42.38319
            ],
            [
              -71.09763,
              42.38844
            ],
            [
              -71.10202,
              42.39042
            ],
            [
              -71.1034,
              42.3911
            ],
            [
              -71.10438,
              42.39175
            ],
            [
              -71.10531,
              42.39252
            ],
            [
              -71.10588,
              42.39321
            ],
            [
              -71.10667,
              42.39207
            ],
            [
              -71.10856,
              42.3928
            ],
            [
              -71.1086,
              42.39291
            ],
            [
              -71.11124,
              42.39377
            ],
            [
              -71.11107,
              42.39402
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Assembly Square"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.07745,
              42.38623
            ],
            [
              -71.07434,
              42.39062
            ],
            [
              -71.07501,
              42.39189
            ],
            [
              -71.07494,
              42.39206
            ],
            [
              -71.07526,
              42.39289
            ],
            [
              -71.0756,
              42.39339
            ],
            [
              -71.0757,
              42.39377
            ],
            [
              -71.076,
              42.39403
            ],
            [
              -71.07614,
              42.3944
            ],
            [
              -71.07544,
              42.39447
            ],
            [
              -71.07564,
              42.39498
            ],
            [
              -71.07639,
              42.39477
            ],
            [
              -71.07689,
              42.39573
            ],
            [
              -71.07779,
              42.396
            ],
            [
              -71.07795,
              42.39589
            ],
            [
              -71.07911,
              42.39632
            ],
            [
              -71.07991,
              42.39642
            ],
            [
              -71.08091,
              42.39671
            ],
            [
              -71.08258,
              42.39727
            ],
            [
              -71.08337,
              42.39771
            ],
            [
              -71.08366,
              42.39871
            ],
            [
              -71.08383,
              42.39887
            ],
            [
              -71.08507,
              42.39537
            ],
            [
              -71.0854,
              42.39461
            ],
            [
              -71.0856,
              42.39364
            ],
            [
              -71.08504,
              42.39318
            ],
            [
              -71.08432,
              42.39246
            ],
            [
              -71.08311,
              42.39107
            ],
            [
              -71.08204,
              42.39012
            ],
            [
              -71.07924,
              42.388
            ],
            [
              -71.07839,
              42.38728
            ],
            [
              -71.07745,
              42.38623
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ten Hills"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.08383,
              42.39887
            ],
            [
              -71.08405,
              42.39893
            ],
            [
              -71.08468,
              42.39867
            ],
            [
              -71.08622,
              42.39939
            ],
            [
              -71.08682,
              42.39947
            ],
            [
              -71.08787,
              42.39924
            ],
            [
              -71.08851,
              42.3989
            ],
            [
              -71.08973,
              42.3987
            ],
            [
              -71.09058,
              42.39839
            ],
            [
              -71.09114,
              42.39839
            ],
            [
              -71.09149,
              42.39865
            ],
            [
              -71.09292,
              42.39916
            ],
            [
              -71.09161,
              42.39813
            ],
            [
              -71.0856,
              42.39364
            ],
            [
              -71.0854,
              42.39461
            ],
            [
              -71.08507,
              42.39537
            ],
            [
              -71.08383,
              42.39887
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Magoun Square"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.10039,
              42.39622
            ],
            [
              -71.11062,
              42.39964
            ],
            [
              -71.10884,
              42.39722
            ],
            [
              -71.11107,
              42.39402
            ],
            [
              -71.11124,
              42.39377
            ],
            [
              -71.1086,
              42.39291
            ],
            [
              -71.10856,
              42.3928
            ],
            [
              -71.10667,
              42.39207
            ],
            [
              -71.10588,
              42.39321
            ],
            [
              -71.10531,
              42.39252
            ],
            [
              -71.10438,
              42.39175
            ],
            [
              -71.1034,
              42.3911
            ],
            [
              -71.10202,
              42.39042
            ],
            [
              -71.09863,
              42.39525
            ],
            [
              -71.10053,
              42.39607
            ],
            [
              -71.10039,
              42.39622
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Winter Hill"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.09292,
              42.39916
            ],
            [
              -71.09458,
              42.39984
            ],
            [
              -71.09669,
              42.40045
            ],
            [
              -71.10039,
              42.39622
            ],
            [
              -71.10053,
              42.39607
            ],
            [
              -71.09863,
              42.39525
            ],
            [
              -71.10202,
              42.39042
            ],
            [
              -71.09763,
              42.38844
            ],
            [
              -71.09536,
              42.38737
            ],
            [
              -71.09469,
              42.3871
            ],
            [
              -71.09366,
              42.38651
            ],
            [
              -71.09246,
              42.38546
            ],
            [
              -71.09123,
              42.38421
            ],
            [
              -71.09086,
              42.38551
            ],
            [
              -71.09027,
              42.38694
            ],
            [
              -71.08945,
              42.38831
            ],
            [
              -71.08898,
              42.38887
            ],
            [
              -71.0864,
              42.39141
            ],
            [
              -71.08607,
              42.39195
            ],
            [
              -71.08579,
              42.39272
            ],
            [
              -71.0856,
              42.39364
            ],
            [
              -71.09161,
              42.39813
            ],
            [
              -71.09292,
              42.39916
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ball Square"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.11062,
              42.39964
            ],
            [
              -71.11237,
              42.40023
            ],
            [
              -71.11394,
              42.40102
            ],
            [
              -71.11491,
              42.40216
            ],
            [
              -71.11557,
              42.40178
            ],
            [
              -71.11665,
              42.40097
            ],
            [
              -71.11692,
              42.40082
            ],
            [
              -71.11835,
              42.39977
            ],
            [
              -71.11893,
              42.39942
            ],
            [
              -71.11766,
              42.39893
            ],
            [
              -71.11435,
              42.39771
            ],
            [
              -71.11605,
              42.39523
            ],
            [
              -71.11379,
              42.3947
            ],
            [
              -71.11107,
              42.39402
            ],
            [
              -71.10884,
              42.39722
            ],
            [
              -71.11062,
              42.39964
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Davis Square"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.11715,
              42.4011
            ],
            [
              -71.11722,
              42.40122
            ],
            [
              -71.11814,
              42.40181
            ],
            [
              -71.11936,
              42.40215
            ],
            [
              -71.12054,
              42.40274
            ],
            [
              -71.12149,
              42.40349
            ],
            [
              -71.12347,
              42.40446
            ],
            [
              -71.12495,
              42.40229
            ],
            [
              -71.12713,
              42.40322
            ],
            [
              -71.12617,
              42.40106
            ],
            [
              -71.12878,
              42.39871
            ],
            [
              -71.12431,
              42.39358
            ],
            [
              -71.12285,
              42.39224
            ],
            [
              -71.12095,
              42.39371
            ],
            [
              -71.11995,
              42.39471
            ],
            [
              -71.11719,
              42.39357
            ],
            [
              -71.11515,
              42.39279
            ],
            [
              -71.1149,
              42.39328
            ],
            [
              -71.11379,
              42.3947
            ],
            [
              -71.11605,
              42.39523
            ],
            [
              -71.11435,
              42.39771
            ],
            [
              -71.11766,
              42.39893
            ],
            [
              -71.11893,
              42.39942
            ],
            [
              -71.11835,
              42.39977
            ],
            [
              -71.11692,
              42.40082
            ],
            [
              -71.11665,
              42.40097
            ],
            [
              -71.11715,
              42.4011
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Powder House Square"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.11491,
              42.40216
            ],
            [
              -71.11549,
              42.4029
            ],
            [
              -71.11546,
              42.40512
            ],
            [
              -71.11933,
              42.40652
            ],
            [
              -71.11946,
              42.40633
            ],
            [
              -71.12168,
              42.40709
            ],
            [
              -71.12347,
              42.40446
            ],
            [
              -71.12149,
              42.40349
            ],
            [
              -71.12054,
              42.40274
            ],
            [
              -71.11936,
              42.40215
            ],
            [
              -71.11814,
              42.40181
            ],
            [
              -71.11722,
              42.40122
            ],
            [
              -71.11715,
              42.4011
            ],
            [
              -71.11665,
              42.40097
            ],
            [
              -71.11557,
              42.40178
            ],
            [
              -71.11491,
              42.40216
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Teele Square"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.12713,
              42.40322
            ],
            [
              -71.12727,
              42.40329
            ],
            [
              -71.12585,
              42.40544
            ],
            [
              -71.12665,
              42.40595
            ],
            [
              -71.13029,
              42.40736
            ],
            [
              -71.13134,
              42.40581
            ],
            [
              -71.13387,
              42.40704
            ],
            [
              -71.13409,
              42.40678
            ],
            [
              -71.13453,
              42.40581
            ],
            [
              -71.13463,
              42.40426
            ],
            [
              -71.13383,
              42.40364
            ],
            [
              -71.1313,
              42.40159
            ],
            [
              -71.12878,
              42.39871
            ],
            [
              -71.12617,
              42.40106
            ],
            [
              -71.12713,
              42.40322
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Hillside"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -71.12168,
              42.40709
            ],
            [
              -71.12156,
              42.40744
            ],
            [
              -71.12388,
              42.40823
            ],
            [
              -71.12329,
              42.40917
            ],
            [
              -71.1257,
              42.40999
            ],
            [
              -71.12617,
              42.40929
            ],
            [
              -71.12804,
              42.41071
            ],
            [
              -71.12698,
              42.41231
            ],
            [
              -71.12992,
              42.41333
            ],
            [
              -71.12746,
              42.41609
            ],
            [
              -71.12677,
              42.41689
            ],
            [
              -71.12694,
              42.41775
            ],
            [
              -71.12738,
              42.41811
            ],
            [
              -71.12826,
              42.41799
            ],
            [
              -71.12999,
              42.41757
            ],
            [
              -71.13141,
              42.41698
            ],
            [
              -71.13163,
              42.41662
            ],
            [
              -71.13158,
              42.41567
            ],
            [
              -71.13173,
              42.41537
            ],
            [
              -71.13244,
              42.41522
            ],
            [
              -71.13264,
              42.41352
            ],
            [
              -71.13277,
              42.41302
            ],
            [
              -71.13289,
              42.41197
            ],
            [
              -71.13266,
              42.41121
            ],
            [
              -71.13225,
              42.41018
            ],
            [
              -71.13222,
              42.40952
            ],
            [
              -71.1324,
              42.40897
            ],
            [
              -71.13387,
              42.40704
            ],
            [
              -71.13134,
              42.40581
            ],
            [
              -71.13029,
              42.40736
            ],
            [
              -71.12665,
              42.40595
            ],
            [
              -71.12585,
              42.40544
            ],
            [
              -71.12727,
              42.40329
            ],
            [
              -71.12713,
              42.40322
            ],
            [
              -71.12495,
              42.40229
            ],
            [
              -71.12347,
              42.40446
            ],
            [
              -71.12168,
              42.40709
            ]
          ]
        ]
      }
    }

  ]
};

  /* ======================================================================
     UTILITY — get display name for a neighborhood
     ====================================================================== */
  function displayName(geoName) {
    var cfg = NEIGHBORHOODS[geoName];
    if (cfg && cfg.displayName) return cfg.displayName;
    return geoName;
  }

  /* ======================================================================
     BostonHubMap CLASS
     ====================================================================== */
  function BostonHubMap(mapId, sidebarId, announceId) {
    this.mapId = mapId;
    this.sidebarId = sidebarId;
    this.announceId = announceId;
    this.map = null;
    this.layers = {}; // geoName → Leaflet layer
    this.sidebarItems = {}; // geoName → DOM element
    this._highlighted = null; // currently highlighted geoName (prevents stuck tooltips)
  }

  /* ------------------------------------------------------------------
     Create Leaflet map
     ------------------------------------------------------------------ */
  BostonHubMap.prototype.createMap = function () {
    this.map = L.map(this.mapId, {
      center: CONFIG.mapCenter,
      zoom: CONFIG.zoom,
      minZoom: CONFIG.minZoom,
      maxZoom: CONFIG.maxZoom,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(CONFIG.tileUrl, {
      attribution: CONFIG.tileAttribution,
      maxZoom: 19,
    }).addTo(this.map);

    /* Disable dragging on mobile to prevent scroll-trapping */
    if (L.Browser.mobile) {
      this.map.dragging.disable();
    }
  };

  /* ------------------------------------------------------------------
     Add GeoJSON neighborhood layers
     ------------------------------------------------------------------ */
  BostonHubMap.prototype.addNeighborhoodLayers = function () {
    var self = this;

    L.geoJSON(BOSTON_GEOJSON, {
      style: function (feature) {
        var name = feature.properties.name;
        var cfg = NEIGHBORHOODS[name];
        if (!cfg) return STYLES.background;
        if (cfg.status === "active") return STYLES.active;
        if (cfg.status === "comingSoon") return STYLES.comingSoon;
        if (cfg.status === "greenSpace") return STYLES.greenSpace;
        return STYLES.background;
      },
      onEachFeature: function (feature, layer) {
        var name = feature.properties.name;
        var cfg = NEIGHBORHOODS[name];

        self.layers[name] = layer;

        /* Tooltip */
        var label = displayName(name);
        if (cfg && cfg.status === "comingSoon") label += " (Coming Soon)";
        if (cfg && cfg.status === "greenSpace") label += " (Green Space/Park)";
        if (cfg && cfg.status === "unavailable") label += " (Not Available)";
        layer.bindTooltip(label, {
          sticky: true,
          direction: "top",
          className: "hub-map-tooltip",
        });

        /* Events */
        layer.on("mouseover", function () {
          self.highlightNeighborhood(name);
        });
        layer.on("mouseout", function () {
          self.unhighlightNeighborhood(name);
        });
        layer.on("click", function () {
          if (cfg && cfg.status === "active") {
            self.navigateToGuide(name);
          }
        });

        /* Cursor */
        if (cfg && cfg.status === "active") {
          layer.on("mouseover", function () {
            var el = self.map.getContainer();
            el.style.cursor = "pointer";
          });
          layer.on("mouseout", function () {
            var el = self.map.getContainer();
            el.style.cursor = "";
          });
        }
      },
    }).addTo(this.map);
  };

  /* ------------------------------------------------------------------
     Build sidebar
     ------------------------------------------------------------------ */
  BostonHubMap.prototype.buildSidebar = function () {
    var sidebar = document.getElementById(this.sidebarId);
    if (!sidebar) return;

    /* Clear any static HTML skeleton */
    sidebar.innerHTML = "";

    var self = this;
    var cities = ["Boston", "Cambridge", "Somerville"];
    var statusOrder = ["active", "comingSoon", "unavailable"];
    var statusLabels = {
      active: "Our Neighborhood Guides",
      comingSoon: "Coming Soon",
      unavailable: "Not Available",
    };

    /* Group neighborhoods by city */
    var byCity = {};
    cities.forEach(function (c) { byCity[c] = []; });
    Object.keys(NEIGHBORHOODS).forEach(function (geoName) {
      var cfg = NEIGHBORHOODS[geoName];
      if (cfg.city && byCity[cfg.city]) {
        byCity[cfg.city].push(geoName);
      }
    });

    cities.forEach(function (city) {
      var names = byCity[city];
      names.sort(function (a, b) {
        return displayName(a).localeCompare(displayName(b));
      });

      /* Group by status */
      var byStatus = {};
      statusOrder.forEach(function (s) { byStatus[s] = []; });
      names.forEach(function (geoName) {
        var s = NEIGHBORHOODS[geoName].status;
        /* greenSpace goes into unavailable bucket */
        var bucket = (s === "greenSpace") ? "unavailable" : s;
        if (byStatus[bucket]) byStatus[bucket].push(geoName);
      });

      /* Skip city entirely if empty */
      var hasAny = statusOrder.some(function (s) { return byStatus[s].length > 0; });
      if (!hasAny) return;

      /* City heading */
      var cityHeading = document.createElement("h3");
      cityHeading.className = "hub-sidebar-heading hub-sidebar-heading--city";
      cityHeading.textContent = city;
      sidebar.appendChild(cityHeading);

      statusOrder.forEach(function (status) {
        var items = byStatus[status];
        if (items.length === 0) return;

        /* Status sub-heading */
        var subHeading = document.createElement("h4");
        subHeading.className = "hub-sidebar-subheading";
        subHeading.textContent = statusLabels[status];
        sidebar.appendChild(subHeading);

        /* List */
        var ul = document.createElement("ul");
        ul.className = "hub-sidebar-list hub-sidebar-list--" +
          (status === "active" ? "active" : status === "comingSoon" ? "coming" : "unavailable");
        ul.setAttribute("role", "listbox");
        ul.setAttribute("aria-label", statusLabels[status] + " in " + city);
        sidebar.appendChild(ul);

        items.forEach(function (geoName) {
          var cfg = NEIGHBORHOODS[geoName];
          var li = self._createSidebarItem(geoName, cfg);
          ul.appendChild(li);
        });
      });
    });
  };

  /* ------------------------------------------------------------------
     Create a single sidebar list item
     ------------------------------------------------------------------ */
  BostonHubMap.prototype._createSidebarItem = function (geoName, cfg) {
    var self = this;
    var li = document.createElement("li");
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", "false");
    li.setAttribute("data-neighborhood", geoName);
    li.setAttribute("tabindex", "0");

    if (cfg.status === "active") {
      li.className = "hub-neighborhood-item";
    } else if (cfg.status === "comingSoon") {
      li.className = "hub-neighborhood-item hub-neighborhood-item--dimmed";
      li.setAttribute("aria-disabled", "true");
    } else if (cfg.status === "greenSpace") {
      li.className = "hub-neighborhood-item hub-neighborhood-item--green";
      li.setAttribute("aria-disabled", "true");
    } else {
      li.className =
        "hub-neighborhood-item hub-neighborhood-item--unavailable";
      li.setAttribute("aria-disabled", "true");
    }

    /* Swatch + name */
    var swatch = document.createElement("span");
    swatch.className = "hub-neighborhood-swatch";
    swatch.setAttribute("aria-hidden", "true");

    var nameSpan = document.createElement("span");
    nameSpan.className = "hub-neighborhood-name";
    nameSpan.textContent = displayName(geoName);

    li.appendChild(swatch);
    li.appendChild(nameSpan);

    /* Events */
    li.addEventListener("mouseenter", function () {
      self.highlightNeighborhood(geoName);
    });
    li.addEventListener("mouseleave", function () {
      self.unhighlightNeighborhood(geoName);
    });
    li.addEventListener("focus", function () {
      self.highlightNeighborhood(geoName);
    });
    li.addEventListener("blur", function () {
      self.unhighlightNeighborhood(geoName);
    });
    li.addEventListener("click", function () {
      if (cfg.status === "active") self.navigateToGuide(geoName);
    });
    li.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (cfg.status === "active") self.navigateToGuide(geoName);
      }
      self._handleArrowKeys(e, li);
    });

    self.sidebarItems[geoName] = li;
    return li;
  };

  /* ------------------------------------------------------------------
     Arrow key navigation in sidebar
     ------------------------------------------------------------------ */
  BostonHubMap.prototype._handleArrowKeys = function (e, currentLi) {
    var next;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      next = currentLi.nextElementSibling;
      if (!next) {
        /* Walk forward through siblings of the UL to find the next UL */
        var el = currentLi.parentElement.nextElementSibling;
        while (el) {
          if (el.tagName === "UL" && el.firstElementChild) {
            next = el.firstElementChild;
            break;
          }
          el = el.nextElementSibling;
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      next = currentLi.previousElementSibling;
      if (!next) {
        /* Walk backward through siblings of the UL to find the previous UL */
        var el = currentLi.parentElement.previousElementSibling;
        while (el) {
          if (el.tagName === "UL" && el.lastElementChild) {
            next = el.lastElementChild;
            break;
          }
          el = el.previousElementSibling;
        }
      }
    }
    if (next && next.getAttribute("role") === "option") {
      next.focus();
    }
  };

  /* ------------------------------------------------------------------
     Highlight / unhighlight
     ------------------------------------------------------------------ */
  BostonHubMap.prototype.highlightNeighborhood = function (geoName) {
    /* Clear any stale highlight (guards against missed mouseout events) */
    if (this._highlighted && this._highlighted !== geoName) {
      this.unhighlightNeighborhood(this._highlighted);
    }
    this._highlighted = geoName;

    var cfg = NEIGHBORHOODS[geoName];
    var layer = this.layers[geoName];
    var item = this.sidebarItems[geoName];

    if (layer && cfg) {
      var style =
        cfg.status === "active"
          ? STYLES.activeHover
          : cfg.status === "comingSoon"
          ? STYLES.comingSoonHover
          : cfg.status === "greenSpace"
          ? STYLES.greenSpaceHover
          : STYLES.backgroundHover;
      layer.setStyle(style);
      layer.bringToFront();
    }

    if (item) {
      item.setAttribute("aria-selected", "true");
      item.classList.add("hub-neighborhood-item--highlighted");
    }

    /* Screen reader announcement */
    var announcer = document.getElementById(this.announceId);
    if (announcer) {
      var label = displayName(geoName);
      if (cfg && cfg.status === "active") {
        announcer.textContent = label + " — click to view guide";
      } else if (cfg && cfg.status === "comingSoon") {
        announcer.textContent = label + " — coming soon";
      } else if (cfg && cfg.status === "greenSpace") {
        announcer.textContent = label + " — green space/park";
      } else if (cfg) {
        announcer.textContent = label + " — not available";
      } else {
        announcer.textContent = label;
      }
    }
  };

  BostonHubMap.prototype.unhighlightNeighborhood = function (geoName) {
    if (this._highlighted === geoName) this._highlighted = null;

    var cfg = NEIGHBORHOODS[geoName];
    var layer = this.layers[geoName];
    var item = this.sidebarItems[geoName];

    if (layer) {
      if (!cfg || cfg.status === "unavailable") {
        layer.setStyle(STYLES.background);
      } else if (cfg.status === "active") {
        layer.setStyle(STYLES.active);
      } else if (cfg.status === "greenSpace") {
        layer.setStyle(STYLES.greenSpace);
      } else {
        layer.setStyle(STYLES.comingSoon);
      }
      layer.closeTooltip();
    }

    if (item) {
      item.setAttribute("aria-selected", "false");
      item.classList.remove("hub-neighborhood-item--highlighted");
    }
  };

  /* ------------------------------------------------------------------
     Navigate to guide page
     ------------------------------------------------------------------ */
  BostonHubMap.prototype.navigateToGuide = function (geoName) {
    var cfg = NEIGHBORHOODS[geoName];
    if (cfg && cfg.status === "active" && cfg.link) {
      window.location.href = cfg.link;
    }
  };

  /* ======================================================================
     INITIALIZATION
     ====================================================================== */
  function init() {
    var mapEl = document.getElementById("boston-hub-map");
    if (!mapEl) return;
    if (typeof L === "undefined") return;

    var hubMap = new BostonHubMap(
      "boston-hub-map",
      "boston-hub-sidebar",
      "boston-hub-announce"
    );
    hubMap.createMap();
    hubMap.addNeighborhoodLayers();
    hubMap.buildSidebar();
  }

  /* Support both standard page load and Squarespace mercury:load */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("mercury:load", init);
})();
