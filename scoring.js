// Scoring object - tracking of the score and creation of the scoring dashboard
// ----------------------------------------------------------------------------

let gameScore = {


    // Array to hold a complete breakdown of the scores
    // -------------------------------------------------
    scoreArray: [
          {team: 'Green Team', Exploring: {forest: 0, ironworks: 0, quarry: 0, plantation: 0, flax: 0, clay: 0, half: 0, all: 0, total: 0}, Building: {warship: 0, cargo: 0, total: 0}, Trading: {Narwhal: 0, Needlefish: 0, Seahorse: 0, Swordfish: 0, total: 0}, Gifts: {total: 0}, Total: {total: 0}, },
          {team: 'Blue Team', Exploring: {forest: 0, ironworks: 0, quarry: 0, plantation: 0, flax: 0, clay: 0, half: 0, all: 0, total: 0}, Building: {warship: 0, cargo: 0, total: 0}, Trading: {Narwhal: 0, Needlefish: 0, Seahorse: 0, Swordfish: 0, total: 0}, Gifts: {total: 0}, Total: {total: 0}, },
          {team: 'Red Team', Exploring: {forest: 0, ironworks: 0, quarry: 0, plantation: 0, flax: 0, clay: 0, half: 0, all: 0, total: 0}, Building: {warship: 0, cargo: 0, total: 0}, Trading: {Narwhal: 0, Needlefish: 0, Seahorse: 0, Swordfish: 0, total: 0}, Gifts: {total: 0}, Total: {total: 0}, },
          {team: 'Orange Team', Exploring: {forest: 0, ironworks: 0, quarry: 0, plantation: 0, flax: 0, clay: 0, half: 0, all: 0, total: 0}, Building: {warship: 0, cargo: 0, total: 0}, Trading: {Narwhal: 0, Needlefish: 0, Seahorse: 0, Swordfish: 0, total: 0}, Gifts: {total: 0}, Total: {total: 0}, }, ],

    scoreSummary: {Exploring: [], Building: [], Trading: [], Gifts: [], Total: [],},

    // Method to organise scoe updates
    // ------------------------------------------------
    workScores: function(contest, localTeam, subContest, scoreDetail) {
        let scoreComments = this.addScore(contest, localTeam, subContest, scoreDetail);
        this.summariseScores();
        this.drawScores(scoreComments);
    },


    // Method to check if score is to be added for move
    // ------------------------------------------------
    addScore: function(contest, localTeam, subContest, scoreDetail) {
        console.log(contest, localTeam, subContest, scoreDetail);

        // Finds array position in score array of current team
        let teamPosition = this.scoreArray.findIndex(fI => fI.team == localTeam);

        // Comment to go with scoring
        let buildComment = ['',''];

        if (contest == 'Exploring') {
            // Scoring for Exploring - first to discover a new resource
            let alreadyExplored = false;
            for (var j = 0; j < this.scoreArray.length; j++) {
                if (this.scoreArray[j].Exploring[subContest] > 0) {
                    alreadyExplored = true;
                }
            }
            if (alreadyExplored == true) {
                this.scoreArray[teamPosition].Exploring[subContest] = 1;
                this.scoreArray[teamPosition].Exploring.total += 1;
                this.scoreArray[teamPosition].Total.total += 1;
                buildComment[0] = gameManagement.turn + ': 1 point for claiming ' + subContest + ' resource.';
            } else {
                this.scoreArray[teamPosition].Exploring[subContest] = 5;
                this.scoreArray[teamPosition].Exploring.total += 5;
                this.scoreArray[teamPosition].Total.total += 5;
                buildComment[0] = gameManagement.turn + ': 5 point reward for first player to discover ' + subContest + ' resource.';
            }

            // Scoring for Exploring - bonuses for being first to reach 3 resource tiles and completing all 6 tiles
            let countExplored = [0, 0, 0, 0];
            let scoreSubCategories = Object.keys(this.scoreArray[0].Exploring);
            scoreSubCategories.splice(6, 3);
            console.log(scoreSubCategories);
            for (var i = 0; i < scoreSubCategories.length; i++) {
                // Loop of each team to count number of previously found resources
                for (var j = 0; j < this.scoreArray.length; j++) {
                    if(this.scoreArray[j].Exploring[scoreSubCategories[i]] > 0 ) {
                        countExplored[j] += 1;
                    }
                }
            }
            let teamExploreCount = countExplored[teamPosition];
            countExplored.splice(teamPosition, 1);
            let maxOtherCount = Math.max.apply(null, countExplored);
            // 10 point bonus for being first to all resource tiles, 5 points for being first to half-way
            if (teamExploreCount == 6 && teamExploreCount > maxOtherCount) {
                this.scoreArray[teamPosition].Exploring.all = 10;
                this.scoreArray[teamPosition].Exploring.total += 10;
                this.scoreArray[teamPosition].Total.total += 10;
                buildComment[1] = 'Bonus 10 points for first to discover all resources.';
            } else if (teamExploreCount == 3 && teamExploreCount > maxOtherCount) {
                this.scoreArray[teamPosition].Exploring.half = 5;
                this.scoreArray[teamPosition].Exploring.total += 5;
                this.scoreArray[teamPosition].Total.total += 5;
                buildComment[1] = 'Bonus 5 points for first player to discover 3 resources.';
            }
        } else if (contest == 'Building') {
            // Scoring for Building - first to build a new ship
            if (subContest == 'cargo ship') {
                subContest = 'cargo';
            }
            let alreadyBuilt = false;
            for (var j = 0; j < this.scoreArray.length; j++) {
                if (this.scoreArray[j].Building[subContest] > 0) {
                    alreadyBuilt = true;
                }
            }
            if (alreadyBuilt == true) {
                this.scoreArray[teamPosition].Building[subContest] = 2;
                this.scoreArray[teamPosition].Building.total += 2;
                this.scoreArray[teamPosition].Total.total += 2;
                if (subContest == 'cargo') {
                    buildComment[0] = gameManagement.turn + ': 2 points for building ' + subContest + ' ship.';
                } else {
                    buildComment[0] = gameManagement.turn + ': 2 points for building ' + subContest + '.';
                }
            } else {
                this.scoreArray[teamPosition].Building[subContest] = 10;
                this.scoreArray[teamPosition].Building.total += 10;
                this.scoreArray[teamPosition].Total.total += 10;
                if (subContest == 'cargo') {
                    buildComment[0] = gameManagement.turn + ': 10 point reward for first player to build ' + subContest + ' ship.';
                } else {
                    buildComment[0] = gameManagement.turn + ': 10 point reward for first player to build ' + subContest + '.';
                }
            }

        } else if (contest == 'Trading') {
            let alreadyContracted = false;
            for (var j = 0; j < this.scoreArray.length; j++) {
                if (this.scoreArray[j].Trading[subContest] > 0) {
                    alreadyContracted = true;
                }
            }
            if (alreadyContracted == true) {
                this.scoreArray[teamPosition].Trading[subContest] += scoreDetail;
                this.scoreArray[teamPosition].Trading.total += scoreDetail;
                this.scoreArray[teamPosition].Total.total += scoreDetail;
                buildComment[0] = gameManagement.turn + ':' + scoreDetail + ' points for trade route to ' + subContest + ' island.';
            } else {
                this.scoreArray[teamPosition].Trading[subContest] += (5 + scoreDetail);
                this.scoreArray[teamPosition].Trading.total += (5 + scoreDetail);
                this.scoreArray[teamPosition].Total.total += (5 + scoreDetail);
                buildComment[0] = gameManagement.turn + ':' + scoreDetail + ' points for trade route.';
                buildComment[1] = 'Bonus 5 points for first trade route to ' + subContest + ' island.';
            }
        }
        return buildComment;
    },

    // Method to populate score summary to use in score board from details of scoreArray
    // ---------------------------------------------------------------------------------
    summariseScores: function() {

        this.scoreSummary = {Exploring: [], Building: [], Trading: [], Gifts: [], Total: [],};

        // Extract contest names from scoreArray and remove 'team' as first contest
        let scoreCategories = Object.keys(this.scoreArray[0]);
        scoreCategories.splice(0,1);

        // Loop of each contest in score board
        for (var i = 0; i < scoreCategories.length; i++) {
            // Loop of each team in each contest
            for (var j = 0; j < this.scoreArray.length; j++) {
                // Push team entry for array of objects --> contest: [{team: score}, {team: score} ...]
                this.scoreSummary[scoreCategories[i]].push({team: this.scoreArray[j].team, score: this.scoreArray[j][scoreCategories[i]].total});
            }
            // Sort each contest array into descending order of score
            this.scoreSummary[scoreCategories[i]].sort(function(a,b) {
                return b.score - a.score;
            });
        }
    },

    // Method to draw scoreboard on the header slider
    // ----------------------------------------------
    drawScores: function(scoreComments) {
        // Any existing scoreboard is deleted
        while (scoreBoardNode.firstChild) {
            scoreBoardNode.removeChild(scoreBoardNode.firstChild);
        }

        // Slide down scorebaord
        scoreHeader.style.top = '0%';

        // Adds the score commentator
        let divCommentator = document.createElement('div');
        divCommentator.setAttribute('class', 'commentator_holder');
        scoreBoardNode.appendChild(divCommentator);

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
        for (var contestName in this.scoreSummary) {
            // Adds a container for each contest
            let divCont = document.createElement('div');
            divCont.setAttribute('class', 'contest_holder');
            scoreBoardNode.appendChild(divCont);
            // Adds inner cross container
            let divContInner = document.createElement('div');
            divContInner.setAttribute('class', 'contest_inner');
            divCont.appendChild(divContInner);
            divCont.style.fontWeight = 'bold';
            var divContTitle = document.createTextNode(contestName);
            divContInner.appendChild(divContTitle);

            // Loops through each team
            for (var i = 0; i < this.scoreSummary[contestName].length; i++) {
                // Adds inner cross container for each team
                let divContInner = document.createElement('div');
                divContInner.setAttribute('class', 'contest_inner');
                divCont.appendChild(divContInner);
                // Adds team name holder and text within cross container
                let divTeam = document.createElement('div');
                divTeam.setAttribute('class', 'team_name ' + this.scoreSummary[contestName][i].team + ' team_stroke');
                divContInner.appendChild(divTeam);
                let teamNameText = document.createTextNode(this.scoreSummary[contestName][i].team);
                divTeam.appendChild(teamNameText);
                // Adds team score holder and figure within cross container
                let divScore = document.createElement('div');
                divScore.setAttribute('class', 'team_score ' + this.scoreSummary[contestName][i].team + ' team_stroke');
                divContInner.appendChild(divScore);
                let scoreFigureText = document.createTextNode(this.scoreSummary[contestName][i].score);
                divScore.appendChild(scoreFigureText);
            }
        }
    },

    // LAST BRACKET OF OBJECT

}
