// PieceSVG constructor - methods to draw pieces using SVG
// ----------------------------------------------------------------------------------------------
function PieceSVG (type, team, pieceID, top, left, scale, rotation, damage, gridSize, tileBorder, boardSurround) {
    // PieceDisplay takes the boardArray to be translated an input
    this.type = type;
    this.team = team;
    this.pieceID = pieceID;
    this.top = top;
    this.left = left;
    this.scale = scale;
    this.rotation = rotation;
    this.damage = damage;
    this.gridSize = gridSize;
    this.tileBorder = tileBorder;
    this.boardSurround = boardSurround;
    this.svg = this.createPiece(type, team, pieceID, top, left, scale, rotation, damage);
}

// Method to change team colour of a piece
// ---------------------------------------
PieceSVG.prototype.changeTeam = function(newTeam) {
    // Have to loop through childNodes - will not update dynamically based on changing this.team
    for (let child of this.svg.childNodes) {
        child.classList.remove(this.team);
        child.classList.add(newTeam);
    }
    this.team = newTeam;
}

// Method to change position of a piece
// ---------------------------------------
PieceSVG.prototype.changePosition = function(top, left) {
    this.top = top;
    this.left = left;
    this.svg.style.top = this.top + 'px';
    this.svg.style.left = this.left + 'px';
}

// Method to change direction of a piece
// ---------------------------------------
PieceSVG.prototype.changeRotation = function(rotation) {
    this.rotation = rotation;
    this.svg.style.transform = 'rotate(' + this.rotation + 'deg) scale(' + this.scale + ')';
}

// Method to change scale of a piece
// ---------------------------------------
PieceSVG.prototype.changeScale = function(scale) {
    this.scale = scale;
    this.svg.style.transform = 'rotate(' + this.rotation + 'deg) scale(' + this.scale + ')';
}

// Method for spinning transition with decrease in size
// ----------------------------------------------------
PieceSVG.prototype.spinTransitionDown = async function(speed) {
    const whirlpool = this.svg;
    const finishedDown = () => new Promise (resolve => {
        whirlpool.addEventListener('transitionend', function whirlpoolDownHandler() {
            whirlpool.removeEventListener('transitionend', whirlpoolDownHandler);
            resolve();
        });
    });

    this.svg.style.transition = 'transform ' + speed + 's 0s ease-in-out';
    this.rotation = this.rotation - 180;
    this.scale = 0.1;
    this.svg.style.transform = 'rotate(' + this.rotation + 'deg) scale(' + this.scale + ')';

    await finishedDown();
    return;
}

// Method for spinning transition with increase in size
// ----------------------------------------------------
PieceSVG.prototype.spinTransitionUp = async function(speed) {
    const whirlpool = this.svg;
    const finishedUp = () => new Promise (resolve => {
        whirlpool.addEventListener('transitionend', function whirlpoolUpHandler() {
            whirlpool.removeEventListener('transitionend', whirlpoolUpHandler);
            resolve();
        });
    });

    this.svg.style.transition = 'transform ' + speed + 's 0s ease-in-out';
    this.rotation = this.rotation - 180;
    this.scale = 1;
    this.svg.style.transform = 'rotate(' + this.rotation + 'deg) scale(' + this.scale + ')';

    await finishedUp();
    return;
}


// Method to create a single piece (for addition to board or as icon in dashboards)
// --------------------------------------------------------------------------------
PieceSVG.prototype.createPiece = function() {
    const viewportSize = 25;
    // Create SVG tile of designated height and width
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', this.gridSize + this.tileBorder);
    this.svg.setAttribute('height', this.gridSize + this.tileBorder);

    // Position tile based on coordinates passed from boardArray
    this.svg.style.top = this.top + 'px';
    this.svg.style.left = this.left + 'px';
    this.svg.style.transform = 'rotate(' + this.rotation + 'deg) scale(' + this.scale + ')';

    // Set view size, class and id
    this.svg.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);
    this.svg.setAttribute('id', this.pieceID);
    this.svg.setAttribute('class', this.type);

    if (this.type === 'cargoship') {
        this.createCargoTile();
    } else if (this.type === 'warship') {
        this.createWarshipTile();
    } else if (this.type === 'catamaran') {
        this.createCatamaranTile();
    } else if (this.type === 'fort') {
        this.createFortTile();
    } else if (this.type === 'forest') {
        this.createForestTile();
    } else if (this.type === 'ironworks') {
        this.createIronworksTile();
    } else if (this.type === 'quarry') {
        this.createQuarryTile();
    } else if (this.type === 'desert') {
        this.createDesertTile();
    } else if (this.type === 'plantation') {
        this.createPlantationTile();
    } else if (this.type === 'flax') {
        this.createFlaxTile();
    } else if (this.type === 'clay') {
        this.createClayTile();
    } else if (this.type === 'whirlpool') {
        this.createWhirlpoolTile();
    }

    return this.svg;
}

// Method to damage cargo ship after conflict
// ------------------------------------------
PieceSVG.prototype.damageShip = function(damage) {
    if(settings.workFlow === true) {console.log('Ship damage displayed: ' + (Date.now() - settings.launchTime)); }

    this.damage = damage;

    if (this.type === 'cargoship') {
        this.createCargoTile();
    } else if (this.type === 'warship') {
        this.createWarshipTile();
    } else if (this.type === 'catamaran') {
        this.createCatamaranTile();
    }

    let shipOars = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shipOars.setAttribute('d', 'M 7.5 10 L 1.5 13.5 M 17.5 10 L 23.5 13.5 M 7 13 L 1.5 16.5 M 18 13 L 23.5 16.5 M 7.5 15.5 L 1.5 19.5 M 17.5 15.5 L 23.5 19.5 M 7.5 18 L 1.5 22.5 M 17.5 18 L 23.5 22.5');
    shipOars.classList.add(this.team, 'team_stroke');
    shipOars.style.strokeLinejoin = 'round';
    shipOars.style.strokeLinecap = 'round';
    shipOars.style.strokeWidth = '1px';
    this.svg.appendChild(shipOars);
}

// Method to repair cargo ship docked in harbour
// ---------------------------------------------
PieceSVG.prototype.repairShip = function(damage) {
    if(settings.workFlow === true) {console.log('Ship repair displayed: ' + (Date.now() - settings.launchTime)); }

    this.damage = damage;
    if (this.type == 'cargoship') {
        this.createCargoTile();
    } else if (this.type == 'warship') {
        this.createWarshipTile();
    } else if (this.type == 'catamaran') {
        this.createCatamaranTile();
    }

    // Puts up scaffolding
    if (damage < 5) {
        let shipScaffold = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shipScaffold.setAttribute('d', 'M 3 4 L 3 23 M 22 4 L 22 23 M 3 8 L 6.5 8 M 22 8 L 18.5 8 M 3 19 L 6 19 M 22 19 L 19 19');
        shipScaffold.classList.add(this.team, 'team_stroke');
        shipScaffold.style.strokeLinejoin = 'round';
        shipScaffold.style.strokeLinecap = 'round';
        shipScaffold.style.strokeWidth = '1px';
        this.svg.appendChild(shipScaffold);
    }
}

// Method to create cargo tile
// ---------------------------
PieceSVG.prototype.createCargoTile = function() {
    // Removes all elements of SVG for damage / repair building
    while (this.svg.lastChild) {
        this.svg.removeChild(this.svg.lastChild);
    }

    // Cargo ship deck SVG design
    let cargoDeck = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    cargoDeck.classList.add(this.team, 'team_fill', 'team_stroke');
    cargoDeck.setAttribute('d', 'M 12.5 1 C 8 6.2 7 11.1 7.3 15.6 Q 7.7 20.2 9.25 24 L 15.75 24 Q 17 20.2 17.5 15.6 C 17.8 11.1 16.6 6.2 12.5 1 Z');
    cargoDeck.style.strokeWidth = '1px';
    this.svg.appendChild(cargoDeck);

    if (this.damage >= 2) {
        // Cargo ship mast SVG design
        let cargoMast = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        cargoMast.classList.add(this.team, 'team_stroke');
        cargoMast.setAttribute('cx', '12.5');
        cargoMast.setAttribute('cy', '12');
        cargoMast.setAttribute('r', '1');
        cargoMast.style.strokeWidth = '1px';
        cargoMast.style.strokeLinecap = 'round';
        this.svg.appendChild(cargoMast);
    }

    if (this.damage >= 3) {
        // Cargo ship mast SVG design
        let cargoMast2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        cargoMast2.classList.add(this.team, 'team_stroke');
        cargoMast2.setAttribute('cx', '12.5');
        cargoMast2.setAttribute('cy', '20');
        cargoMast2.setAttribute('r', '1');
        cargoMast2.style.strokeWidth = '1px';
        cargoMast2.style.strokeLinecap = 'round';
        this.svg.appendChild(cargoMast2);
    }

    if (this.damage >= 4) {
        // Cargo ship sail SVG design
        let cargoSail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cargoSail.setAttribute('d', 'M 2 11 L 23 11 C 20.5 8.5 16.5 7 12.5 7 C 7.5 7 3.5 8.5 2 11 Z');
        cargoSail.classList.add(this.team, 'team_stroke');
        cargoSail.setAttribute('fill', 'white');
        cargoSail.style.strokeWidth = '1px';
        this.svg.appendChild(cargoSail);
    }

    if (this.damage >= 5) {
        // Cargo ship sail SVG design
        let cargoSail2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cargoSail2.setAttribute('d', 'M 2 19 L 23 19 C 20.5 16.5 16.5 15 12.5 15 C 7.5 15 3.5 16.5 2 19 Z');
        cargoSail2.classList.add(this.team, 'team_stroke');
        cargoSail2.setAttribute('fill', 'white');
        cargoSail2.style.strokeWidth = '1px';
        this.svg.appendChild(cargoSail2);
    }
}

// Method to create warship tile
// ---------------------------
PieceSVG.prototype.createWarshipTile = function() {
    // Removes all elements of SVG for damage / repair building
    while (this.svg.lastChild) {
        this.svg.removeChild(this.svg.lastChild);
    }

    // Warship deck SVG design
    let warshipDeck = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    warshipDeck.classList.add(this.team, 'team_fill', 'team_stroke');
    warshipDeck.setAttribute('d', 'M 12.5 1 C 8 6.2 7 11.1 7.3 15.6 Q 7.7 20.2 9.25 24 L 15.75 24 Q 17 20.2 17.5 15.6 C 17.8 11.1 16.6 6.2 12.5 1 Z');
    warshipDeck.style.strokeWidth = '1px';

    // Warship line SVG design (just so has 5 children)
    let warshipLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    warshipLine1.classList.add(this.team, 'team_fill', 'team_stroke');
    warshipLine1.setAttribute('d', 'M 15.5 24 L 15.75 24');
    warshipLine1.style.strokeWidth = '1px';

    // Warship line SVG design (just so has 5 children)
    let warshipLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    warshipLine2.classList.add(this.team, 'team_fill', 'team_stroke');
    warshipLine2.setAttribute('d', 'M 9.25 24 L 9.5 24');
    warshipLine2.style.strokeWidth = '1px';

    // Building the tile
    this.svg.appendChild(warshipDeck);
    this.svg.appendChild(warshipLine1);
    this.svg.appendChild(warshipLine2);

    if (this.damage >= 4) {
        // Warship mast SVG design
        let warshipMast = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        warshipMast.classList.add(this.team, 'team_stroke');
        warshipMast.setAttribute('cx', '12.5');
        warshipMast.setAttribute('cy', '17');
        warshipMast.setAttribute('r', '1');
        warshipMast.style.strokeWidth = '1px';
        warshipMast.style.strokeLinecap = 'round';
        this.svg.appendChild(warshipMast);
    }

    if (this.damage >= 5) {
        // Warship sail SVG design
        let warshipSail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        warshipSail.setAttribute('d', 'M 2 16 L 23 16 C 20.5 13.5 16.5 12 12.5 12 C 7.5 12 3.5 13.5 2 16 Z');
        warshipSail.classList.add(this.team, 'team_stroke');
        warshipSail.setAttribute('fill', 'white');
        warshipSail.style.strokeWidth = '1px';
        this.svg.appendChild(warshipSail);
    }
}

// Method to create warship tile
// ----------------------------
PieceSVG.prototype.createCatamaranTile = function() {
    // Removes all elements of SVG for damage / repair building
    while (this.svg.lastChild) {
        this.svg.removeChild(this.svg.lastChild);
    }

    // Cat left deck SVG design
    let catDeck1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    catDeck1.classList.add(this.team, 'team_fill', 'team_stroke');
    catDeck1.setAttribute('d', 'M 7.5 3 A 3.5 10.5 1 0 0 7.5 22 A 3.5 10.5 1 0 0 7.5 3 Z');
    catDeck1.style.strokeWidth = '1px';

    // Cat right deck SVG design
    let catDeck2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    catDeck2.classList.add(this.team, 'team_fill', 'team_stroke');
    catDeck2.setAttribute('d', 'M 17.5 3 A 3.5 10.5 1 0 0 17.5 22 A 3.5 10.5 1 0 0 17.5 3 Z');
    catDeck2.style.strokeWidth = '1px';

    // Cat centre deck SVG design
    let catCentreDeck = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    catCentreDeck.setAttribute('x', '7');
    catCentreDeck.setAttribute('y', '8.5');
    catCentreDeck.setAttribute('width', '11');
    catCentreDeck.setAttribute('height', '10.5');
    catCentreDeck.setAttribute('rx', '1');
    catCentreDeck.setAttribute('ry', '1');
    catCentreDeck.style.strokeWidth = '1px';
    catCentreDeck.classList.add(this.team, 'team_fill', 'team_stroke');

    // Building the tile
    this.svg.appendChild(catDeck1);
    this.svg.appendChild(catDeck2);
    this.svg.appendChild(catCentreDeck);

    if (this.damage >= 4) {
        // Catamaran mast SVG design
        let warshipMast = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        warshipMast.classList.add(this.team, 'team_stroke');
        warshipMast.setAttribute('cx', '12.5');
        warshipMast.setAttribute('cy', '16.5');
        warshipMast.setAttribute('r', '1');
        warshipMast.style.strokeWidth = '1px';
        warshipMast.style.strokeLinecap = 'round';
        this.svg.appendChild(warshipMast);
    }

    if (this.damage >= 5) {
        // Catamaran sail SVG design
        let warshipSail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        warshipSail.setAttribute('d', 'M 2 15.5 L 23 15.5 C 20.5 12.5 16.5 11.5 12.5 11.5 C 7.5 11.5 3.5 13 2 15.5 Z');
        warshipSail.classList.add(this.team, 'team_stroke');
        warshipSail.setAttribute('fill', 'white');
        warshipSail.style.strokeWidth = '1px';
        this.svg.appendChild(warshipSail);
    }
}

// Method to create fort tile
// ---------------------------
PieceSVG.prototype.createFortTile = function() {
    // Fort turret design
    let fortTurret1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fortTurret1.classList.add(this.team, 'team_stroke');
    fortTurret1.setAttribute('cx', '7');
    fortTurret1.setAttribute('cy', '7');
    fortTurret1.setAttribute('r', '2.5');
    fortTurret1.style.strokeWidth = '1px';
    fortTurret1.style.strokeLinecap = 'round';

    let fortTurret2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fortTurret2.classList.add(this.team, 'team_stroke');
    fortTurret2.setAttribute('cx', '7');
    fortTurret2.setAttribute('cy', '18');
    fortTurret2.setAttribute('r', '2.5');
    fortTurret2.style.strokeWidth = '1px';
    fortTurret2.style.strokeLinecap = 'round';

    let fortTurret3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fortTurret3.classList.add(this.team, 'team_stroke');
    fortTurret3.setAttribute('cx', '18');
    fortTurret3.setAttribute('cy', '7');
    fortTurret3.setAttribute('r', '2.5');
    fortTurret3.style.strokeWidth = '1px';
    fortTurret3.style.strokeLinecap = 'round';

    let fortTurret4 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fortTurret4.classList.add(this.team, 'team_stroke');
    fortTurret4.setAttribute('cx', '18');
    fortTurret4.setAttribute('cy', '18');
    fortTurret4.setAttribute('r', '2.5');
    fortTurret4.style.strokeWidth = '1px';
    fortTurret4.style.strokeLinecap = 'round';

    // Fort wall rectangle design
    let fortWall = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fortWall.setAttribute('x', '6');
    fortWall.setAttribute('y', '6');
    fortWall.setAttribute('width', '13');
    fortWall.setAttribute('height', '13');
    fortWall.setAttribute('rx', '1');
    fortWall.setAttribute('ry', '1');
    fortWall.style.strokeWidth = '1px';
    fortWall.classList.add(this.team, 'team_fill', 'team_stroke');

    // Fort cannon design
    let fortCannon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fortCannon.setAttribute('d', 'M 15 12.5 Q 12.5 16 10 12.5 L 11.5 2 L 13.5 2 L 15 12.5');
    fortCannon.classList.add(this.team, 'team_stroke');
    fortCannon.style.strokeLinejoin = 'round';
    fortCannon.style.strokeLinecap = 'round';
    fortCannon.style.strokeWidth = '1px';

    // Building the tile
    this.svg.appendChild(fortWall);
    this.svg.appendChild(fortTurret1);
    this.svg.appendChild(fortTurret2);
    this.svg.appendChild(fortTurret3);
    this.svg.appendChild(fortTurret4);
    this.svg.appendChild(fortCannon);
}

// Method to create forest tile
// ---------------------------
PieceSVG.prototype.createForestTile = function() {

    // Canopy circle design
    let treeCanopy1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    treeCanopy1.classList.add(this.team, 'team_fill', 'team_stroke');
    treeCanopy1.setAttribute('cx', '15');
    treeCanopy1.setAttribute('cy', '9');
    treeCanopy1.setAttribute('r', '5.5');
    treeCanopy1.style.strokeWidth = '1px';
    treeCanopy1.style.strokeLinecap = 'round';

    let treeCanopy2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    treeCanopy2.classList.add(this.team, 'team_stroke');
    treeCanopy2.setAttribute('cx', '8');
    treeCanopy2.setAttribute('cy', '10.5');
    treeCanopy2.setAttribute('r', '4.5');
    treeCanopy2.setAttribute('fill', 'rgb(213, 191, 163)');
    treeCanopy2.style.strokeWidth = '1px';
    treeCanopy2.style.strokeLinecap = 'round';

    // Trunk rectangle design
    let treeTrunk1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    treeTrunk1.classList.add(this.team, 'team_stroke');
    treeTrunk1.setAttribute('x', '14.5');
    treeTrunk1.setAttribute('y', '15');
    treeTrunk1.setAttribute('width', '1.5');
    treeTrunk1.setAttribute('height', '5');
    treeTrunk1.setAttribute('fill', 'rgb(89, 53, 20)');
    treeTrunk1.style.strokeWidth = '1px';

    let treeTrunk2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    treeTrunk2.classList.add(this.team, 'team_stroke');
    treeTrunk2.setAttribute('x', '7.5');
    treeTrunk2.setAttribute('y', '15');
    treeTrunk2.setAttribute('width', '1');
    treeTrunk2.setAttribute('height', '5');
    treeTrunk2.setAttribute('fill', 'rgb(89, 53, 20)');
    treeTrunk2.style.strokeWidth = '1px';

    // Building the tile
    this.svg.appendChild(treeTrunk1);
    this.svg.appendChild(treeTrunk2);
    this.svg.appendChild(treeCanopy1);
    this.svg.appendChild(treeCanopy2);
}

// Method to create ironworks tile
// ---------------------------
PieceSVG.prototype.createIronworksTile = function() {

    // Mountain background design
    let mountainBackground = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mountainBackground.setAttribute('d', 'M 21.5 18 L 12.5 2.5 L 3.5 18');
    mountainBackground.classList.add(this.team, 'team_fill', 'team_stroke');
    mountainBackground.style.strokeLinejoin = 'round';
    mountainBackground.style.strokeLinecap = 'round';
    mountainBackground.style.strokeWidth = '1px';

    // Mountain snow design
    let mountainSnow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mountainSnow.setAttribute('d', 'M 9.3 8 A 5 5 0 0 0 15.7 8 L 12.5 2.5 Z');
    mountainSnow.classList.add(this.team, 'team_stroke');
    mountainSnow.style.strokeLinejoin = 'round';
    mountainSnow.style.strokeLinecap = 'round';
    mountainSnow.setAttribute('fill', 'white');
    mountainSnow.style.strokeWidth = '1px';

    // Iron square design
    let ironSquare = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    ironSquare.classList.add(this.team, 'team_stroke');
    ironSquare.setAttribute('x', '9');
    ironSquare.setAttribute('y', '14');
    ironSquare.setAttribute('width', '7');
    ironSquare.setAttribute('height', '7');
    ironSquare.setAttribute('fill', 'silver');
    ironSquare.style.strokeWidth = '1px';
    ironSquare.setAttribute('rx', '1');
    ironSquare.setAttribute('ry', '1');
    ironSquare.style.strokeLinecap = 'round';

    // Building the tile
    this.svg.appendChild(mountainBackground);
    this.svg.appendChild(mountainSnow);
    this.svg.appendChild(ironSquare);
}

// Method to create desert tile
// ---------------------------
PieceSVG.prototype.createDesertTile = function() {
    // rear dune
    let rearSandDune = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rearSandDune.classList.add(this.team);
    rearSandDune.setAttribute('d', 'M 2 13 C 3 9 6 7 9 6 L 16 13');
    rearSandDune.style.strokeWidth = '1px';
    rearSandDune.setAttribute('stroke','rgb(138, 87, 50)');
    rearSandDune.setAttribute('fill', 'rgb(235, 215, 195)');

    // front dune
    let frontSandDune = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    frontSandDune.setAttribute('d', 'M 9 18 C 10 14 13 12 16 11 L 23 18');
    frontSandDune.classList.add(this.team);
    frontSandDune.setAttribute('stroke','rgb(138, 87, 50)');
    frontSandDune.setAttribute('fill', 'rgb(235, 215, 195)');

    // Building the tile
    this.svg.appendChild(rearSandDune);
    this.svg.appendChild(frontSandDune);

}

// Method to create quarry tile
// ---------------------------
PieceSVG.prototype.createQuarryTile = function() {
    // Pick handle rectangle
    let pickHandle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pickHandle.classList.add(this.team, 'team_fill', 'team_stroke');
    pickHandle.setAttribute('d', 'M 7.5 5.7 Q 7.4 4 9.2 4 L 21.2 16 L 19.5 17.7 L 8.2 6.7 Z');
    pickHandle.style.strokeLinejoin = 'round';
    pickHandle.style.strokeWidth = '1px';

    // Pick metal left
    let pickLeft = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pickLeft.setAttribute('d', 'M 8.2 7.8 Q 5.4 10.1 5.5 14.5 Q 6.8 10.9 9.5 9.1 Z');
    pickLeft.classList.add(this.team, 'team_stroke');
    pickLeft.setAttribute('fill', 'silver');
    pickLeft.style.strokeLinejoin = 'round';
    pickLeft.style.strokeWidth = '1px';

    // Pick metal right
    let pickRight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pickRight.setAttribute('d', 'M 11.3 4.7 Q 13.6 1.9 18 2 Q 14.4 3.3 12.6 6 Z');
    pickRight.classList.add(this.team, 'team_stroke');
    pickRight.setAttribute('fill', 'silver');
    pickRight.style.strokeLinejoin = 'round';
    pickRight.style.strokeWidth = '1px';

    // Pick square
    let pickSquare = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pickSquare.setAttribute('d', 'M 7.5 7 L 10.3 4.2 L 13.1 7 L 10.3 9.8 Z');
    pickSquare.classList.add(this.team, 'team_stroke');
    pickSquare.setAttribute('fill', 'silver');
    pickSquare.style.strokeLinejoin = 'round';
    pickSquare.style.strokeWidth = '1px';

    // Stone square in quarry
    let stoneSquare = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    stoneSquare.classList.add(this.team, 'team_stroke');
    stoneSquare.setAttribute('x', '5.5');
    stoneSquare.setAttribute('y', '15.5');
    stoneSquare.setAttribute('width', '6');
    stoneSquare.setAttribute('height', '6');
    stoneSquare.setAttribute('rx', '1');
    stoneSquare.setAttribute('ry', '1');
    stoneSquare.setAttribute('fill', 'white');
    stoneSquare.style.strokeWidth = '1px';

    // Building the tile
    this.svg.appendChild(pickHandle);
    this.svg.appendChild(pickLeft);
    this.svg.appendChild(pickRight);
    this.svg.appendChild(pickSquare);
    this.svg.appendChild(stoneSquare);

}

// Method to create plantation tile
// --------------------------------
PieceSVG.prototype.createPlantationTile = function() {
    // lower berry
    let berry1 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    berry1.classList.add(this.team, 'team_stroke');
    berry1.setAttribute('cx', '11.2');
    berry1.setAttribute('cy', '17.8');
    berry1.setAttribute('rx', '2.2');
    berry1.setAttribute('ry', '2.7');
    berry1.setAttribute('stroke','rgb(138, 87, 50)');
    berry1.setAttribute('fill', 'rgb(235, 215, 195)');

    // right hand berry
    let berry3 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    berry3.classList.add(this.team, 'team_stroke');
    berry3.setAttribute('cx', '17.6');
    berry3.setAttribute('cy', '10.2');
    berry3.setAttribute('rx', '2.7');
    berry3.setAttribute('ry', '2.2');
    berry3.setAttribute('stroke','rgb(138, 87, 50)');
    berry3.setAttribute('fill', 'rgb(235, 215, 195)');

    // diagonal berry
    let berry2 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    berry2.classList.add(this.team, 'team_fill', 'team_stroke');
    berry2.setAttribute('cx', '0');
    berry2.setAttribute('cy', '0');
    berry2.setAttribute('rx', '2.7');
    berry2.setAttribute('ry', '2.2');
    berry2.setAttribute('stroke','rgb(138, 87, 50)');
    berry2.setAttribute('fill', 'rgb(213, 191, 163)');
    berry2.setAttribute('transform', 'translate(17.4, 17) rotate(55)');

    // twig
    let coffeeTwig = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    coffeeTwig.classList.add(this.team, 'team_stroke');
    coffeeTwig.setAttribute('d', 'M 4.2 7 C 5.1 7.4 7.7 8 11.2 10.4 C 12.6 11.4 13.8 12.6 15.5 14.6');
    coffeeTwig.setAttribute('stroke','rgb(138, 87, 50)');
    coffeeTwig.setAttribute('fill', 'none');
    coffeeTwig.setAttribute('stroke-linecap', 'round');

    // lower coffee leaf
    let coffeeLeaf1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    coffeeLeaf1.setAttribute('d', 'M 5.5 19.2 C 6.5 17.8 7.2 16.0 7.5 15.0 C 7.7 14.2 7.5 13.5 7 12.7 C 6.6 11.6 5.6 10.5 4.8 9.6 C 3.0 12.9 2.7 14.5 3.9 16.6 C 4.2 17.1 5.0 18.5 5.5 19.2 ');
    coffeeLeaf1.classList.add(this.team, 'team_fill', 'team_stroke');
    coffeeLeaf1.setAttribute('stroke','rgb(138, 87, 50)');
    coffeeLeaf1.setAttribute('fill', 'rgb(213, 191, 163)');
    coffeeLeaf1.setAttribute('stroke-linecap', 'round');
    coffeeLeaf1.setAttribute('stroke-linejoin', 'round');
    coffeeLeaf1.style.strokeWidth = '1px';

    // upper coffee leaf
    let coffeeLeaf2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    coffeeLeaf2.setAttribute('d', 'M 17.5 4.5 C 15.74 3.83 13.97 3.29 12.91 3.13 C 11.02 2.85 9.2 4.69 7.72 6.28 C 11.3 7.81 12.85 8.01 14.83 6.61 C 15.34 6.25 16.66 5.35 17.5 4.5 ');
    coffeeLeaf2.classList.add(this.team, 'team_fill', 'team_stroke');
    coffeeLeaf2.setAttribute('stroke','rgb(138, 87, 50)');
    coffeeLeaf2.setAttribute('fill', 'rgb(213, 191, 163)');
    coffeeLeaf2.setAttribute('stroke-linecap', 'round');
    coffeeLeaf2.setAttribute('stroke-linejoin', 'round');
    coffeeLeaf2.style.strokeWidth = '1px';

    // Building the tile
    this.svg.appendChild(berry1);
    this.svg.appendChild(berry2);
    this.svg.appendChild(berry3);
    this.svg.appendChild(coffeeTwig);
    this.svg.appendChild(coffeeLeaf1);
    this.svg.appendChild(coffeeLeaf2);

}

// Method to create flax tile
// --------------------------------
PieceSVG.prototype.createFlaxTile = function() {

    function createPetal(centerX, centerY, rotatePetal, size, teamColour, team) {
    // petal
        let petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        if (teamColour === true) {
            petal.classList.add(team, 'team_fill', 'team_stroke');
            petal.setAttribute('fill', 'rgb(213, 191, 163)');
        } else {
            petal.classList.add(team);
            petal.setAttribute('fill', 'white');
        }
        petal.setAttribute('d', 'M ' + (centerX - 1.5) + ' ' + (centerY - 1.5) + ' A ' + size + ' ' + size + ' 0 1 0 '+ (centerX - 1.5) + ' ' +  (centerY + 1.5) + ' L ' + centerX + ' ' + centerY + ' Z');
        petal.setAttribute('stroke','rgb(138, 87, 50)');

        petal.setAttribute('stroke-linecap', 'round');
        petal.setAttribute('transform', 'scale(0.9, 0.9), translate(1.38, 1.38), rotate(' + rotatePetal + ', ' + centerX + ', ' + centerY + ')');
        petal.style.strokeWidth = '1.1px';
        return petal
    }

    let petal1 = createPetal(11.65, 6.65, 45, 2.75, true, this.team);
    let petal2 = createPetal(13.35, 8.35, 225, 2.75, true, this.team);
    let petal3 = createPetal(11.65, 8.35, 315, 2.75, true, this.team);
    let petal4 = createPetal(13.35, 6.65, 135, 2.75, true, this.team);
    let bud1 = createPetal(3.5, 13.5, 250, 2, false, this.team);
    let bud2 = createPetal(21.5, 13.5, 290, 2, false, this.team);

    // branch
    let flaxBranch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    flaxBranch.classList.add(this.team);
    flaxBranch.setAttribute('d', 'M 6 18.75 A 6 2 0 1 0 19 18.75');
    flaxBranch.setAttribute('stroke','rgb(138, 87, 50)');
    flaxBranch.setAttribute('fill', 'none');
    flaxBranch.setAttribute('stroke-linecap', 'round');
    flaxBranch.style.strokeWidth = '1px';

    // stalk
    let flaxStalk = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    flaxStalk.classList.add(this.team, 'team_stroke');
    flaxStalk.setAttribute('d', 'M 12.5 13.5 L 12.5 22');
    flaxStalk.setAttribute('stroke','rgb(138, 87, 50)');
    flaxStalk.setAttribute('fill', 'none');
    flaxStalk.setAttribute('stroke-linecap', 'round');
    flaxStalk.style.strokeWidth = '1px';

    // Building the tile
    this.svg.appendChild(petal1);
    this.svg.appendChild(petal2);
    this.svg.appendChild(petal3);
    this.svg.appendChild(petal4);
    this.svg.appendChild(bud1);
    this.svg.appendChild(bud2);
    this.svg.appendChild(flaxBranch);
    this.svg.appendChild(flaxStalk);

}

// Method to create clay (kiln) tile
// --------------------------------
PieceSVG.prototype.createClayTile = function() {

    let kilnOuter = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    kilnOuter.setAttribute('d', 'M 5 11.5 L 5 18.5 L 20 18.5 L 20 11.5 A 4.5 5 1 0 0 5 11.5');
    kilnOuter.setAttribute('stroke-linecap', 'round');
    kilnOuter.classList.add(this.team, 'team_fill', 'team_stroke');
    kilnOuter.style.strokeWidth = '1px';

    let kilnDoor = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    kilnDoor.classList.add(this.team, 'team_stroke');
    kilnDoor.setAttribute('d', 'M 7.5 10 L 7.5 12.5 L 17.5 12.5 L 17.5 10 A 2.5 2.5 1 0 0 7.5 10');
    kilnDoor.setAttribute('stroke-linecap', 'round');
    kilnDoor.setAttribute('stroke','rgb(138, 87, 50)');
    kilnDoor.setAttribute('fill', 'white');
    kilnDoor.style.strokeWidth = '1px';

    let kilnFlame1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    kilnFlame1.classList.add(this.team, 'team_stroke');
    kilnFlame1.setAttribute('d', 'M 10 11.5 A 1 2.5 2.5 0 0 10 7.5 A 1 2.5 2.5 0 0 10 11.5');
    kilnFlame1.setAttribute('stroke-linecap', 'round');
    kilnFlame1.setAttribute('stroke','silver');
    kilnFlame1.setAttribute('fill', 'silver');
    kilnFlame1.style.strokeWidth = '0.5px';

    let kilnFlame2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    kilnFlame2.classList.add(this.team, 'team_stroke');
    kilnFlame2.setAttribute('d', 'M 12.5 11.5 A 1 2.5 2.5 0 0 12.5 7.5 A 1 2.5 2.5 0 0 12.5 11.5');
    kilnFlame2.setAttribute('stroke-linecap', 'round');
    kilnFlame2.setAttribute('stroke','silver');
    kilnFlame2.setAttribute('fill', 'silver');
    kilnFlame2.style.strokeWidth = '0.5px';

    let kilnFlame3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    kilnFlame3.classList.add(this.team, 'team_stroke');
    kilnFlame3.setAttribute('d', 'M 15 11.5 A 1 2.5 2.5 0 0 15 7.5 A 1 2.5 2.5 0 0 15 11.5');
    kilnFlame3.setAttribute('stroke-linecap', 'round');
    kilnFlame3.setAttribute('stroke','silver');
    kilnFlame3.setAttribute('fill', 'silver');
    kilnFlame3.style.strokeWidth = '0.5px';

    // Building the tile
    this.svg.appendChild(kilnOuter);
    this.svg.appendChild(kilnDoor);
    this.svg.appendChild(kilnFlame1);
    this.svg.appendChild(kilnFlame2);
    this.svg.appendChild(kilnFlame3);

}

// Method to create whirlpool tile
// --------------------------------
PieceSVG.prototype.createWhirlpoolTile = function() {
    let totalDegrees = 360*3.125;
    let startOffset = 1;
    let width = 11;
    let step = (width - startOffset) / totalDegrees
    let lineDefine = '';

    for (let i=0; i < totalDegrees; i+=1) {
        let radius = i * width / totalDegrees + startOffset;
        let angle = i * (2 * totalDegrees / 360) * Math.PI / totalDegrees;
        if (i === 0) {
            lineDefine = 'M ' + (12.5 + radius * Math.cos(angle)) + ' ' + (12.5 + radius * Math.sin(angle));
        } else {
            lineDefine += ' L ' + (12.5 + radius * Math.cos(angle)) + ' ' + (12.5 + radius * Math.sin(angle));
        }
    }

    let spiral = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spiral.setAttribute('d', lineDefine);
    spiral.setAttribute('stroke-linecap', 'round');
    spiral.setAttribute('stroke','rgb(138, 87, 50)');
    spiral.setAttribute('fill', 'none');
    spiral.setAttribute('fill', 'rgb(235, 215, 195)');
    spiral.style.strokeWidth = '1.25px';

    // Building the tile
    this.svg.appendChild(spiral);
}
