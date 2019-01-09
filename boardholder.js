// Board holder constructor - methods to create surrounding border for dashboards and buttons
// ------------------------------------------------------------------------------------------------------------
function BoardHolder (surroundSize, screenReduction, mapWidth) {
    this.surroundSize = surroundSize;
    this.screenReduction = screenReduction;
    this.mapWidth = mapWidth;

    // Document elements
    this.endTurn = document.querySelector('.endturnmark');
    this.scoreHeader = document.querySelector('.score_header');
    this.header = document.querySelector('.the_header');
    this.scrollPopup = document.querySelector('.scroll_popup');
}

// Method to set up board holder (square around the board holding dashboards, scoreboard and commentary)
// -----------------------------------------------------------------------------------------------------
BoardHolder.prototype.setupHolder = function() {
    this.setupSideBar();
    this.setupFooter();
    this.setupScoreHeader();
    this.setupNextTurnIcon();
    this.setupSettingsIcon();
    this.setupScroll();
}

// Method to set up sidebars
// -------------------------------
BoardHolder.prototype.setupSideBar = function() {
    let sideCollection = document.querySelectorAll('.left, .right');
    sideCollection.forEach((element) => {
        element.style.width = this.surroundSize + 'px';
        element.style.fontSize = (0.6 * this.screenReduction) + 'em';
    });
}

// Method to set up footer including commentary
// --------------------------------------------
BoardHolder.prototype.setupFooter = function() {
    let footerCollection = document.querySelectorAll('.the_footer, .commentaryBox, .building');
    footerCollection.forEach((element) => {
        element.style.width = (this.mapWidth - 2*this.surroundSize) + 'px';
        element.style.left = this.surroundSize + 'px';
        element.style.fontSize = (0.8 * game.screenReduction) + 'em';
    });
}

// Method to set up scoreboard header
// --------------------------------------------
BoardHolder.prototype.setupScoreHeader = function() {
    let headerCollection = [this.header, this.scoreHeader];
    headerCollection.forEach((element) => {
        element.style.width = (this.mapWidth - 2*this.surroundSize) + 'px';
        element.style.left = this.surroundSize + 'px';
    });

    this.scoreHeader.style.fontSize = (0.6 * this.screenReduction) + 'em';
    this.scoreHeader.style.top = '-15%';


    this.header.addEventListener('mouseenter', ()=> {
        this.scoreHeader.style.top = '0%';
    });

    this.header.addEventListener('mouseleave', ()=> {
        this.scoreHeader.style.top = '-15%';
    });
}

// Method to set up next turn icon
// --------------------------------------------
BoardHolder.prototype.setupNextTurnIcon = function() {
    this.createTurnCircle(0.6*this.surroundSize/100, 0, 0.18*this.surroundSize, 'icon_holder');
}

// Method to create end turn circle icon button
// --------------------------------------------
BoardHolder.prototype.createTurnCircle = function(scale, top, left, className) {
    let viewportSize = 100 * scale;
    let endTurnButton = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    endTurnButton.setAttribute('class', className);
    endTurnButton.setAttribute('width', 100 * scale);
    endTurnButton.setAttribute('height', 100 * scale);
    endTurnButton.style.top = top + 'px';
    endTurnButton.style.left = left + 'px';
    endTurnButton.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);

    let turnCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    turnCircle.setAttribute('cx', 50 * scale);
    turnCircle.setAttribute('cy', 50 * scale);
    turnCircle.setAttribute('r', 32 * scale);
    turnCircle.style.strokeWidth = 1*this.screenReduction + 'px';
    turnCircle.style.strokeLinecap = 'round';

    endTurnButton.appendChild(turnCircle);
    this.endTurn.appendChild(endTurnButton);
}


// Method to set up settings pop-up icon
// -------------------------------------
BoardHolder.prototype.setupSettingsIcon = function() {
    if(settings.workFlow === true) {console.log('Creating settings pop up icon and box: ' + (Date.now() - settings.launchTime)); }
    // Icon in bottom left corner
    settings.addSettingsCog(this.surroundSize, this.mapWidth, this.screenReduction);
    settings.addCogListeners();
}

// Method to set up scroll
// -------------------------------------
BoardHolder.prototype.setupScroll = function() {
    this.scrollPanel = this.createScroll(this.mapWidth*(12/2000), -50*this.screenReduction, this.mapWidth*4/20);
    this.scrollPopup.appendChild(this.scrollPanel);
    this.scrollPanel.appendChild(game.boardDisplay.drawMoon((this.mapWidth*4.2/20), 175*this.screenReduction, 50*this.screenReduction, 1));
    this.scrollPanel.appendChild(game.boardDisplay.drawMoon((this.mapWidth*7.8/20), 565*this.screenReduction, 50*this.screenReduction, 7));
}

// Scroll graphics
// -----------------------------------------
BoardHolder.prototype.createScroll = function(scale, top, left) {
    let viewportSize = 100 * scale;

    // SVG holder
    let scrollSheet = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    scrollSheet.setAttribute('width', 100 * scale);
    scrollSheet.setAttribute('height', 100 * scale);
    scrollSheet.style.top = top + 'px';
    scrollSheet.style.left = left + 'px';
    scrollSheet.setAttribute('viewBox', '0, 0, ' + viewportSize + ' ' + viewportSize);

    // Backing rectangle
    let scrollOutline = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    scrollOutline.setAttribute('width',  50 * scale);
    scrollOutline.setAttribute('height', 70 * scale);
    scrollOutline.setAttribute('x', 25 * scale);
    scrollOutline.setAttribute('y', 13 * scale);
    scrollOutline.setAttribute('rx', '2');
    scrollOutline.setAttribute('ry', '2');
    scrollOutline.setAttribute('fill', 'rgb(246, 232, 206)');
    scrollOutline.setAttribute('stroke','rgb(137, 113, 82)');
    scrollOutline.style.strokeWidth = scale + 'px';
    scrollOutline.style.strokeLinecap = 'round';

    // Text title
    let scrollTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    scrollTitle.textContent = ('');
    scrollTitle.setAttribute('font-size', 16 * this.screenReduction);
    scrollTitle.setAttribute('fill', 'rgb(179, 156, 128)');
    scrollTitle.setAttribute('x', 50 * scale);
    scrollTitle.setAttribute('y', 41 * scale);
    scrollTitle.setAttribute('text-anchor', 'middle');
    scrollTitle.setAttribute('font-weight', 'bold');

    // Text - first line
    let scrollText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    scrollText.textContent = ('');
    scrollText.setAttribute('font-size', 16 * this.screenReduction);
    scrollText.setAttribute('fill', 'rgb(179, 156, 128)');
    scrollText.setAttribute('x', 50 * scale);
    scrollText.setAttribute('y', 48 * scale);
    scrollText.setAttribute('text-anchor', 'middle');
    scrollText.setAttribute('font-style', 'italic');

    // Text - second line
    let scrollText2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    scrollText2.textContent = ('');
    scrollText2.setAttribute('font-size', 16 * this.screenReduction);
    scrollText2.setAttribute('fill', 'rgb(179, 156, 128)');
    scrollText2.setAttribute('x', 50 * scale);
    scrollText2.setAttribute('y', 53 * scale);
    scrollText2.setAttribute('text-anchor', 'middle');
    scrollText2.setAttribute('font-style', 'italic');

    // Text - third line
    let scrollText3 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    scrollText3.textContent = ('');
    scrollText3.setAttribute('font-size', 16 * this.screenReduction);
    scrollText3.setAttribute('fill', 'rgb(179, 156, 128)');
    scrollText3.setAttribute('x', 50 * scale);
    scrollText3.setAttribute('y', 58 * scale);
    scrollText3.setAttribute('text-anchor', 'middle');
    scrollText3.setAttribute('font-style', 'italic');

    // Components add to svg holder
    scrollSheet.appendChild(scrollOutline);
    scrollSheet.appendChild(scrollTitle);
    scrollSheet.appendChild(scrollText);
    scrollSheet.appendChild(scrollText2);
    scrollSheet.appendChild(scrollText3);

    return scrollSheet;
}
