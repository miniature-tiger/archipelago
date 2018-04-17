// Game management object
// A very basic starting point just allowing simple rotation of turns

let gameManagement = {

    // List of teams
    // -------------
    // Future update: set up based on user inputs for number of players and player names
    teamArray: ['Green Team', 'Blue Team', 'Red Team', 'Orange Team', 'Pirate'],

    // Current turn
    // ------------
    // Future update: initialise first go randomly
    turn: 'Green Team',

    // Method to activate next turn
    // ----------------------------
    nextTurn: function() {
        this.turn = this.teamArray[(this.teamArray.indexOf(this.turn)+1) % (this.teamArray.length)];
    }

}
