const URBAN_HACK_RADIUS = 720 / 49152;

module.exports = {
  getHints,
  pad
};

const HINTS = [
  [36.8381, -84.85],
  [37.9643, -86.7453],
  [58.3168, -134.4397],
  [36.9147, -111.4558],
  [44.928, -87.1853],
  [50.7029, -57.3511],
  [29.9414, -85.4064],
  [49.7261, -1.9104],
  [65.528, 23.557],
  [35.8722, -84.525],
  [60.0961, 18.797],
  [59.9942, 18.7794],
  [59.05, 15.0412],
  [60.027, 18.7594],
  [60.0779, 18.8102],
  [60.0239, 18.7625],
  [59.9983, 18.8548],
  [37.3458, -85.3456],
  [46.4547, -90.1711],
  [46.4814, -90.0531],
  [46.4753, -89.94],
  [46.3661, -89.5969],
  [46.2678, -89.1781],
  [39.6217, -87.4522],
  [39.6631, -87.4307],
  [61.7132, 29.3968],
  [41.6724, -86.5082],
  [27.9881, 86.9253],
  [47.3525, -102.6214],
  [19.75, -88.7],
  [21.1, -87.4833],
  [-31.675, 128.8831],
  [54.39447, -6.978715],
  [54.5916, -7.733996],
  [54.54842, -7.834725],
  [54.15168, -7.357061],
  [54.75062, -7.560825],
  [54.20568, -6.738351],
  [54.54842, -7.834724],
  [45.6504, -67.579],
  [46.4392, -67.745],
  [45.3238, -116.5487],
  [-37.3786, 140.8362],
  [44.6972, -67.3955],
  [67.9333, 23.4333],
  [67.8167, 23.1667],
  [68.1375, 23.1447],
  [67.8, 23.1133],
  [67.9458, 23.6242],
  [68.0168, 23.4515],
  [68.1133, 23.3214],
  [41.1426, -86.89009],
  [40.7608, -87.12402],
  [41.1938, -86.48956],

  [47.9637, -89.6848],
  [-34.1762, 140.7845],
  [-14.304965, -170.806497], // American Samoa
];


function getHints() {
  return HINTS.map(pad);
}

function pad([lat, lon]) {
  return {
    geometry: false,
    properties: {
      min_lat: lat - URBAN_HACK_RADIUS,
      min_lon: lon - URBAN_HACK_RADIUS,
      max_lat: lat + URBAN_HACK_RADIUS,
      max_lon: lon + URBAN_HACK_RADIUS,
    }
  };
}
