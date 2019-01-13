// Piece constructor - methods to create pieces and add them to the game board
// ----------------------------------------------------------------------------------------------
function Piece (category, type, direction, team, goods, stock, production, ref, row, col) {
    this.populatedSquare = true;
    this.category = category;
    this.type = type;
    this.direction = direction;
    this.used = 'unused';
    this.team = team;
    this.goods = goods;
    this.stock = stock;
    this.production = production;
    this.ref = ref;
    this.row = row;
    this.col = col;
    this.name = game.pieceTypes[this.type].name;
}

// Mark piece as used after movement
// ------------------------------------
Piece.prototype.markUsed = function() {
    this.used = 'used';
}

// Mark piece unused
// ------------------------------------
Piece.prototype.markUnused = function() {
    this.used = 'unused';
}

// Mark piece unused
// ------------------------------------
Piece.prototype.changeCoordinates = function(row, col) {
    this.row = row;
    this.col = col;
}

// Change stock (loading or unloading or looting)
// ----------------------------------------------
Piece.prototype.changeStock = function(quantity) {
    this.stock += quantity;
}

// Change goods (loading or unloading or looting)
// ----------------------------------------------
Piece.prototype.changeGoods = function(goods) {
    this.goods = goods;
}

// Change team (typically resource island discovery)
// ----------------------------------------------
Piece.prototype.changeTeam = function(team) {
    this.team = team;
}

// Change team (typically resource island discovery)
// ----------------------------------------------
Piece.prototype.changeDirection = function(direction) {
    this.direction = direction;
}

// Transport constructor - for ship pieces
// ----------------------------------------------------------------------------
function Transport (category, type, direction, damageStatus, team, goods, stock, production, ref, row, col) {
    Piece.call(this, category, type, direction, team, goods, stock, production, ref, row, col);

    this.damageStatus = damageStatus;
    this.maxMove = gameData.pieceTypes[this.type].maxMove;
    this.maxHold = gameData.pieceTypes[this.type].maxHold;
    this.battlePerc = gameData.pieceTypes[this.type].battlePerc;
}
Transport.prototype = Object.create(Piece.prototype);
Transport.prototype.constructor = Transport;

// Damage ship (battle)
// ----------------------------------------------
Transport.prototype.changeDamage = function(damageStatus) {
    this.damageStatus = damageStatus;
}

// Settlement constructor - for fort pieces
// ----------------------------------------------------------------------------
function Settlement (category, type, direction, team, goods, stock, production, ref, row, col) {
    Piece.call(this, category, type, direction, team, goods, stock, production, ref, row, col);

}
Settlement.prototype = Object.create(Piece.prototype);
Settlement.prototype.constructor = Settlement;

// Resources constructor - for resource pieces
// ----------------------------------------------------------------------------
function Resources (category, type, direction, team, goods, stock, production, ref, row, col) {
    Piece.call(this, category, type, direction, team, goods, stock, production, ref, row, col);

}
Resources.prototype = Object.create(Piece.prototype);
Resources.prototype.constructor = Resources;

// Hazards constructor - for hazard pieces
// ----------------------------------------------------------------------------
function Hazard (category, type, direction, team, goods, stock, production, ref, row, col) {
    Piece.call(this, category, type, direction, team, goods, stock, production, ref, row, col);

}
Hazard.prototype = Object.create(Piece.prototype);
Hazard.prototype.constructor = Hazard;
