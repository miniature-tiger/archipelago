// Compass movement object - methods to allow compass to be moved
// --------------------------------------------------------------

let compass = {
  
    // Method to obtain new wind direction
    directionArray: [ {wind: 'NW', windRow: -1, windCol: -1, needle: 45},
                      {wind: 'N', windRow: -1, windCol: 0, needle: 90},
                      {wind: 'NE', windRow: -1, windCol: 1, needle: 135},
                      {wind: 'E', windRow: 0, windCol: 1, needle: 180},
                      {wind: 'SE', windRow: 1, windCol: 1, needle: 225},
                      {wind: 'S', windRow: 1, windCol: 0, needle: 270},
                      {wind: 'SW', windRow: 1, windCol: -1, needle: 315},
                      {wind: 'W', windRow: 0, windCol: -1, needle: 0} ],

    // Method to obtain new wind direction
    // -----------------------------------
    // 90% of wind changes are small, 10% are large
    newWindDirection: function (windDirection) {
        if (Math.random() > 0.9) {
            return this.largeWindChange();
        } else {
            return Math.round(((this.smallWindChange() + windDirection) + 8) % 8);
        }
    },

    // Method for small wind change
    // ----------------------------
    // moves wind direction between by -1, 0, or +1 (i.e -45 degrees, static, or 45 degrees)
    smallWindChange: function () {
        return Math.floor(Math.random()*3)-1;
    },

    // Method for large wind change
    // ----------------------------
    // Completely random change in wind direction
    largeWindChange: function () {
        return Math.floor(Math.random()*8);
    },
}
