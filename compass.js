// Compass movement object - methods to allow compass to be moved
// --------------------------------------------------------------

let compass = {

    windDirection: 0,

    needleDirection: 0,

    // Array to hold wind direction
    directionArray: [ {wind: 'NW', windRow: -1, windCol: -1, needle: -45},
                      {wind: 'N', windRow: -1, windCol: 0, needle: 0},
                      {wind: 'NE', windRow: -1, windCol: 1, needle: 45},
                      {wind: 'E', windRow: 0, windCol: 1, needle: 90},
                      {wind: 'SE', windRow: 1, windCol: 1, needle: 135},
                      {wind: 'S', windRow: 1, windCol: 0, needle: 180},
                      {wind: 'SW', windRow: 1, windCol: -1, needle: -135},
                      {wind: 'W', windRow: 0, windCol: -1, needle: -90} ],

    // Method to obtain new wind direction
    // -----------------------------------
    // x% of wind changes are small, (1-x)% are large
    newWindDirection: function () {
        if (Math.random() > 0) {
            this.windDirection = this.largeWindChange();
        } else {
            this.windDirection = Math.round(((this.smallWindChange() + this.windDirection) + 8) % 8);
        }
        //compass.windDirection = compass.newWindDirection(compass.windDirection);
        this.needleDirection = this.directionArray[this.windDirection].needle;
        compass.needle.style.transform = 'rotate(' + compass.needleDirection + 'deg)';
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

    // Setup
    // ----------------------------
    setup: function () {
        this.needle = document.getElementById('needle2');
        this.windDirection = this.largeWindChange();
        this.needle.style.transform = 'rotate(' + this.needleDirection + 'deg)';
    },

}
