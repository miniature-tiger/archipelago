// Scoring object - tracking of the score and creation of the scoring dashboard
// ----------------------------------------------------------------------------

let gameScore = {

    // Finds the stockDashboard holder in the left hand panel
    node: document.querySelector('div.scoreBoard'),

    // Array to hold a complete breakdown of the scores
    // -------------------------------------------------
    scoreArray: {
        Green: {Exploring: {forest: 0, ironworks: 0, quarry: 0, plantation: 0, flax: 0, clay: 0, half: 0, all: 0, Total: 0}, Building: {warship: 0, cargo: 0, Total: 0}, Trading: {Narwhal: 0, Needlefish: 0, Seahorse: 0, Swordfish: 0, Total: 0}, Gifts: {Total: 0}, Total: {Total: 0}},
        Blue: {Exploring: {forest: 0, ironworks: 0, quarry: 0, plantation: 0, flax: 0, clay: 0, half: 0, all: 0, Total: 0}, Building: {warship: 0, cargo: 0, Total: 0}, Trading: {Narwhal: 0, Needlefish: 0, Seahorse: 0, Swordfish: 0, Total: 0}, Gifts: {Total: 0}, Total: {Total: 0}},
        Red: {Exploring: {forest: 0, ironworks: 0, quarry: 0, plantation: 0, flax: 0, clay: 0, half: 0, all: 0, Total: 0}, Building: {warship: 0, cargo: 0, Total: 0}, Trading: {Narwhal: 0, Needlefish: 0, Seahorse: 0, Swordfish: 0, Total: 0}, Gifts: {Total: 0}, Total: {Total: 0}},
        Orange: {Exploring: {forest: 0, ironworks: 0, quarry: 0, plantation: 0, flax: 0, clay: 0, half: 0, all: 0, Total: 0}, Building: {warship: 0, cargo: 0, Total: 0}, Trading: {Narwhal: 0, Needlefish: 0, Seahorse: 0, Swordfish: 0, Total: 0}, Gifts: {Total: 0}, Total: {Total: 0}},
        Total: {Exploring: {forest: 0, ironworks: 0, quarry: 0, plantation: 0, flax: 0, clay: 0, half: 0, all: 0, Total: 0}, Building: {warship: 0, cargo: 0, Total: 0}, Trading: {Narwhal: 0, Needlefish: 0, Seahorse: 0, Swordfish: 0, Total: 0}, Gifts: {Total: 0}, Total: {Total: 0}}
    },

    scoreSummary: {Exploring: [], Building: [], Trading: [], Gifts: [], Total: []},

    // Array to define points awarded for each game activity
    // -----------------------------------------------------
    pointsArray: {
        // Exploring
        discoveryFirst: 3,
        discoveryLater: 1,
        discoveryHalf: 5,
        discoveryComplete: 5,
        // Building
        buildFirst: 5,
        buildSecond: 3,
        buildLater: 1,
        // Trading
        tradeFirst: 5,
    },

    // Method to organise score updates
    // ------------------------------------------------
    workScores: function(contest, team, subContest, scoreDetail) {
        let scoreComments = this.addScore(contest, team, subContest, scoreDetail);
        this.summariseScores();
        this.drawScores(scoreComments);
    },

    // Method to increase scores
    // -------------------------
    increaseScore: function(team, contest, subContest, points) {
        // increase team row scores (including totals for team)
        this.scoreArray[team][contest][subContest] = points;
        this.scoreArray[team][contest].Total += points;
        this.scoreArray[team].Total.Total += points;
        // increase total row scores
        this.scoreArray.Total[contest][subContest] += points;
        this.scoreArray.Total[contest].Total += points;
        this.scoreArray.Total.Total.Total += points;
    },

    // Method to check if score is to be added for move
    // ------------------------------------------------
    addScore: function(contest, scoringTeam, subContest, scoreDetail) {
        // Comment to go with scoring
        let buildComment = ['',''];

        // Scoring for Exploring - first to discover a new resource
        if (contest === 'Exploring') {
            let alreadyExplored = false;
            for (let team in this.scoreArray) {
                if (this.scoreArray[team].Exploring[subContest] > 0) {
                    alreadyExplored = true;
                }
            }
            if (alreadyExplored === true) {
                this.increaseScore(scoringTeam, 'Exploring', subContest, this.pointsArray.discoveryLater);
                buildComment[0] = game.turn + ': ' + this.pointsArray.discoveryLater + ' point for claiming ' + subContest + ' resource.';
            } else {
                this.increaseScore(scoringTeam, 'Exploring', subContest, this.pointsArray.discoveryFirst);
                buildComment[0] = game.turn + ': ' + this.pointsArray.discoveryFirst + ' point reward for first player to discover ' + subContest + ' resource.';
            }

            // Scoring for Exploring - bonuses for being first to reach 3 resource tiles and completing all 6 tiles
            let countExplored = {Green: 0, Blue: 0, Red: 0, Orange: 0};
            let scoreSubCategories = Object.keys(this.scoreArray.Total.Exploring).splice(0, 6);
            // Loop of each team and resource to count number of previously found resources
            for (let team in countExplored) {
                for (let resource of scoreSubCategories) {
                    if (this.scoreArray[team].Exploring[resource] > 0 ) {
                        countExplored[team] += 1;
                    }
                }
            }
            // X point bonus for being first to all resource tiles, Y points for being first to half-way
            if (countExplored[scoringTeam] === 6 && this.scoreArray.Total.all === 0) {
                this.increaseScore(team, 'Exploring', 'all', this.pointsArray.discoveryComplete);
                buildComment[1] = 'Bonus ' + this.pointsArray.discoveryComplete + ' points for first to discover all resources.';
            } else if (countExplored[scoringTeam] === 3 && this.scoreArray.Total.half === 0) {
                this.increaseScore(team, 'Exploring', 'half', this.pointsArray.discoveryHalf);
                buildComment[1] = 'Bonus ' + this.pointsArray.discoveryHalf + ' points for first player to discover 3 resources.';
            }

        // Scoring for Building - first to build a new ship
        } else if (contest === 'Building') {
            let name = gameData.pieceTypes[subContest].name;
            let alreadyBuilt = 0;
            for (let team in this.scoreArray) {
                if (this.scoreArray[team].Building[subContest] > 0 && team !== 'Total') {
                    alreadyBuilt += 1;
                }
            }
            if (alreadyBuilt === 0) {
                this.increaseScore(scoringTeam, 'Building', subContest, this.pointsArray.buildFirst);
                buildComment[0] = game.turn + ': ' + this.pointsArray.buildFirst + ' point reward for first player to build ' + name + '.';

            } else if (alreadyBuilt == 1) {
                this.increaseScore(scoringTeam, 'Building', subContest, this.pointsArray.buildSecond);
                buildComment[0] = game.turn + ': ' + this.pointsArray.buildSecond + ' point reward for second player to build ' + name + '.';
            } else {
                this.increaseScore(scoringTeam, 'Building', subContest, this.pointsArray.buildLater);
                buildComment[0] = game.turn + ': ' + this.pointsArray.buildLater + ' point reward for building ' + name + '.';
            }

        // Scoring for Trading
        } else if (contest === 'Trading') {
            let alreadyContracted = false;
            for (let team in this.scoreArray) {
                if (this.scoreArray[team].Trading[subContest] > 0 && team !== 'Total') {
                    alreadyContracted = true;
                }
            }
            if (alreadyContracted === true) {
                this.increaseScore(scoringTeam, 'Trading', subContest, scoreDetail);
                buildComment[0] = game.turn + ': ' + scoreDetail + ' points for trade route to ' + subContest + ' island.';
            } else {
                this.increaseScore(scoringTeam, 'Trading', subContest, (this.pointsArray.tradeFirst + scoreDetail));
                buildComment[0] = game.turn + ': ' + scoreDetail + ' points for trade route.';
                buildComment[1] = 'Bonus ' + this.pointsArray.tradeFirst + ' points for first trade route to ' + subContest + ' island.';
            }
        }
        return buildComment;
    },

    // Method to populate score summary to use in score board from details of scoreArray
    // ---------------------------------------------------------------------------------
    summariseScores: function() {
        this.scoreSummary = {Exploring: [], Building: [], Trading: [], Gifts: [], Total: []};
        // Loop of each contest in score board
        for (let contest in this.scoreSummary) {
            // Loop of each team in each contest
            for (let team in this.scoreArray) {
                // Push team entry for array of objects --> contest: [{team: score}, {team: score} ...]
                let teamScore = {};
                teamScore[team] = this.scoreArray[team][contest].Total;
                this.scoreSummary[contest].push(teamScore);
            }
            // Sort each contest array into descending order of score
            this.scoreSummary[contest].sort(function(a,b) {
                return Object.values(b) - Object.values(a);
            });
        }
    },

    // Method to draw scoreboard on the header slider
    // ----------------------------------------------
    drawScores: function(scoreComments) {
        // Any existing scoreboard is deleted
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }

        // Slide down scorebaord
        game.boardHolder.scoreHeader.style.top = '0%';

        // Adds the score commentator
        let divCommentator = document.createElement('div');
        divCommentator.setAttribute('class', 'commentator_holder');
        this.node.appendChild(divCommentator);

        let divContInner1 = document.createElement('div');
        divContInner1.setAttribute('class', 'contest_inner');
        divContInner1.style.fontWeight = 'bold';
        divCommentator.appendChild(divContInner1);
        let commentatorFirstLine = document.createTextNode('Scoreboard');
        divContInner1.appendChild(commentatorFirstLine);

        let divContInner2 = document.createElement('div');
        divContInner2.setAttribute('class', 'contest_inner');
        divCommentator.appendChild(divContInner2);
        let commentatorSecondLine = document.createTextNode(scoreComments[0]);
        divContInner2.appendChild(commentatorSecondLine);

        let divContInner3 = document.createElement('div');
        divContInner3.setAttribute('class', 'contest_inner');
        divCommentator.appendChild(divContInner3);
        let commentatorThirdLine = document.createTextNode(scoreComments[1]);
        divContInner3.appendChild(commentatorThirdLine);

        // Loops through each contest in the score summary
        for (let contest in this.scoreSummary) {
            // Adds a container for each contest
            let divCont = document.createElement('div');
            divCont.setAttribute('class', 'contest_holder');
            this.node.appendChild(divCont);
            // Adds inner cross container
            let divContInner = document.createElement('div');
            divContInner.setAttribute('class', 'contest_inner');
            divCont.appendChild(divContInner);
            divCont.style.fontWeight = 'bold';
            var divContTitle = document.createTextNode(contest);
            divContInner.appendChild(divContTitle);

            // Loops through each team
            for (let scorePair of this.scoreSummary[contest]) {
                let team = Object.keys(scorePair)[0];
                if (team !== 'Total') {
                    // Adds inner cross container for each team
                    let divContInner = document.createElement('div');
                    divContInner.setAttribute('class', 'contest_inner');
                    divCont.appendChild(divContInner);
                    // Adds team name holder and text within cross container
                    let divTeam = document.createElement('div');
                    divTeam.setAttribute('class', 'team_name ' + team + ' team_stroke');
                    divContInner.appendChild(divTeam);
                    let teamNameText = document.createTextNode(team);
                    divTeam.appendChild(teamNameText);
                    // Adds team score holder and figure within cross container
                    let divScore = document.createElement('div');
                    divScore.setAttribute('class', 'team_score ' + team + ' team_stroke');
                    divContInner.appendChild(divScore);
                    let scoreFigureText = document.createTextNode(Object.values(scorePair));
                    divScore.appendChild(scoreFigureText);
                }
            }
        }
    },

    // Method to determine first and last players
    // ------------------------------------------
    firstLastPlayer: function() {
        let competingArray = [];
        let scoreArray = [];

        for (teamInfo of game.teamArray) {
            if (teamInfo.status === 'competing') {
                let score = this.scoreArray[teamInfo.team].Total.Total
                competingArray.push({team: teamInfo.team, score: score});
                scoreArray.push(score);
            }
        }
        let minScore = Math.min.apply(null, scoreArray);
        let maxScore = Math.max.apply(null, scoreArray);

        let lastPlayerArray = competingArray.filter(competitor => competitor.score === minScore);
        let firstPlayerArray = competingArray.filter(competitor => competitor.score === maxScore);

        // Picks a player at random if more than one player have the lowest score
        let lastPlayer = lastPlayerArray.splice(Math.floor(Math.random() * lastPlayerArray.length), 1)[0];
        let firstPlayer = firstPlayerArray.splice(Math.floor(Math.random() * firstPlayerArray.length), 1)[0];

        return [firstPlayer, lastPlayer];
    },

    // LAST BRACKET OF OBJECT
}
