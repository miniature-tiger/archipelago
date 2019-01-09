// PieceSet constructor - methods to translate boardArray piece elements onto webpage
// ----------------------------------------------------------------------------------------------
function IconSet (boardArray, row, col, gridSize, tileBorder, boardSurround, node)  {
    // PieceSet takes the boardArray to be translated an input
    this.boardArray = boardArray;
    this.row = row; // number of rows
    this.col = col; // number of columns
    this.gridSize = gridSize;
    this.tileBorder = tileBorder;
    this.boardSurround = boardSurround;
    this.node = node;
}

// Method to create a single goods icon
// -------------------------------------
IconSet.prototype.createIcon = function(goods, iconID, top, left, scale) {
    let viewportSize = 25 * scale;
    // Create SVG icon of designated height and width
    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('width', this.gridSize + this.tileBorder);
    icon.setAttribute('height', this.gridSize + this.tileBorder);
    icon.style.left = left + 'px';
    icon.style.top = top + 'px';

    // Set view size, class and id
    icon.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);
    icon.setAttribute('id', iconID);
    icon.setAttribute('class', 'goodsGroup');

    // icon method is selected
    if (goods == 'coffee') {
        this.createCoffeeIcon(icon);
    } else if (goods == 'stone') {
          this.createStoneIcon(icon);
    } else if (goods == 'iron') {
        this.createIronIcon(icon);
    } else if (goods == 'wood') {
        this.createWoodIcon(icon);
    } else if (goods == 'cloth') {
        this.createClothIcon(icon);
    } else if (goods == 'pottery') {
        this.createPotteryIcon(icon);
    }
    return icon;
}

// Method to create coffee bean goods icon
// ----------------------------------------
IconSet.prototype.createCoffeeIcon = function(icon) {
    //Coffee bean
    let coffeeBean = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    coffeeBean.setAttribute('d','M 17.5 6 A 11.5 9 1 0 1 10.5 20 Q 10.5 14.5    14 13.25    T 17.5 6 ' +
                                'M 15 5   A 11.5 9 0 0 0 8 19   Q 8 13  11.5 11.75  T 15 5');
    coffeeBean.setAttribute('stroke','rgb(89, 53, 20)');
    coffeeBean.setAttribute('stroke-linecap', 'round');
    coffeeBean.setAttribute('stroke-linejoin', 'round');
    coffeeBean.style.strokeWidth = '1px';
    icon.appendChild(coffeeBean);
    return(icon);
}

// Method to create stone goods icon
// ----------------------------------------
IconSet.prototype.createStoneIcon = function(icon) {
    // Stone square
    let stoneSquare = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    stoneSquare.setAttribute('x', '6');
    stoneSquare.setAttribute('y', '6');
    stoneSquare.setAttribute('width', '14');
    stoneSquare.setAttribute('height', '14');
    stoneSquare.setAttribute('rx', '2');
    stoneSquare.setAttribute('ry', '2');
    stoneSquare.setAttribute('stroke','rgb(89, 53, 20)');
    stoneSquare.setAttribute('fill', 'white');
    stoneSquare.style.strokeWidth = '1px';
    stoneSquare.setAttribute('stroke-linecap', 'round');
    stoneSquare.setAttribute('stroke-linejoin', 'round');

    icon.appendChild(stoneSquare);
    return(icon);
}

// Method to create wood goods icon
// ----------------------------------------
IconSet.prototype.createWoodIcon = function(icon) {

    // Log end
    let farCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    farCircle.setAttribute('cx', '17');
    farCircle.setAttribute('cy', '8');
    farCircle.setAttribute('r', '3');
    farCircle.setAttribute('fill', 'none');
    farCircle.setAttribute('stroke','rgb(89, 53, 20)');
    farCircle.setAttribute('fill', 'rgb(213, 191, 163)');
    farCircle.style.strokeWidth = '1px';
    farCircle.style.strokeLinecap = 'round';

    // Log length
    let logBeam = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    logBeam.setAttribute('d','M 15 5.75 L 6.5 13 L 12 18.75 L 19.25 10');
    logBeam.setAttribute('stroke','rgb(89, 53, 20)');
    logBeam.setAttribute('fill', 'rgb(213, 191, 163)');
    logBeam.setAttribute('stroke-linecap', 'round');
    logBeam.setAttribute('stroke-linejoin', 'round');
    logBeam.style.strokeWidth = '1px';

    // Log end
    let nearCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    nearCircle.setAttribute('cx', '9');
    nearCircle.setAttribute('cy', '16');
    nearCircle.setAttribute('r', '4');
    nearCircle.setAttribute('fill', 'none');
    nearCircle.setAttribute('stroke','rgb(89, 53, 20)');
    nearCircle.setAttribute('fill', 'rgb(213, 191, 163)');
    nearCircle.style.strokeWidth = '1px';
    nearCircle.style.strokeLinecap = 'round';

    // Inner circle
    let innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', '9');
    innerCircle.setAttribute('cy', '16');
    innerCircle.setAttribute('r', '2.5');
    innerCircle.setAttribute('fill', 'none');
    innerCircle.setAttribute('stroke','rgb(89, 53, 20)');
    innerCircle.setAttribute('fill', 'none');
    innerCircle.style.strokeWidth = '0.5px';
    innerCircle.style.strokeLinecap = 'round';

    // Inner circle
    let innerCircle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle2.setAttribute('cx', '9');
    innerCircle2.setAttribute('cy', '16');
    innerCircle2.setAttribute('r', '1');
    innerCircle2.setAttribute('fill', 'none');
    innerCircle2.setAttribute('stroke','rgb(89, 53, 20)');
    innerCircle2.setAttribute('fill', 'none');
    innerCircle2.style.strokeWidth = '0.5px';
    innerCircle2.style.strokeLinecap = 'round';

    icon.appendChild(farCircle);
    icon.appendChild(logBeam);
    icon.appendChild(nearCircle);
    icon.appendChild(innerCircle);
    icon.appendChild(innerCircle2);
    return(icon);
}

// Method to create iron goods icon
// ----------------------------------------
IconSet.prototype.createIronIcon = function(icon) {
    // Front end of joist
    let frontEnd = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    frontEnd.setAttribute('d','M 5 5 L 20 5 L 20 8 L 14 8 L 14 17 L 20 17 L 20 20 L 5 20 L 5 17 L 11 17 L 11 8 L 5 8 Z');
    frontEnd.setAttribute('stroke','rgb(89, 53, 20)');
    frontEnd.setAttribute('stroke','black');
    frontEnd.setAttribute('fill', 'silver');
    frontEnd.setAttribute('stroke-linecap', 'round');
    frontEnd.setAttribute('stroke-linejoin', 'round');
    frontEnd.style.strokeWidth = '1px';

    icon.appendChild(frontEnd);
    return(icon);
}

// Method to create cloth goods icon
// ----------------------------------------
IconSet.prototype.createClothIcon = function(icon) {
    // Front end of joist
    let sailCloth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sailCloth.setAttribute('d','M 5 20 A 15 15 1 0 0 12 3 A 15 15 1 0 1 18 20 Z');
    sailCloth.setAttribute('stroke','rgb(89, 53, 20)');
    sailCloth.setAttribute('stroke','rgb(89, 53, 20)');
    sailCloth.setAttribute('fill', 'white');
    sailCloth.setAttribute('stroke-linecap', 'round');
    sailCloth.setAttribute('stroke-linejoin', 'round');
    sailCloth.style.strokeWidth = '1px';

    icon.appendChild(sailCloth);
    return(icon);
}

// Method to create pottery goods icon
// ----------------------------------------
IconSet.prototype.createPotteryIcon = function(icon) {
    // Pot icon
    let potteryPot = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    potteryPot.setAttribute('d','M 15 4 L 10 4 A 2 3 1 0 1 10 8 A 2 5 0 0 0 11 20 L 14 20 A 2 5 0 0 0 15 8 A 2 3 1 0 1 15 4');
    potteryPot.setAttribute('stroke','rgb(89, 53, 20)');
    potteryPot.setAttribute('stroke','rgb(89, 53, 20)');
    potteryPot.setAttribute('fill', 'rgb(213, 191, 163)');
    potteryPot.setAttribute('stroke-linecap', 'round');
    potteryPot.setAttribute('stroke-linejoin', 'round');
    potteryPot.style.strokeWidth = '1px';

    icon.appendChild(potteryPot);
    return(icon);
}
