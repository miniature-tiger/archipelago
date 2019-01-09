// Game commentary object - pop-up footer holds in-game commentary
let commentary = {

    // commentary box set up
    commentaryBox: document.querySelector('.commentaryBox'),
    firstLineComment: document.querySelector('#firstLine'),
    secondLineComment: document.querySelector('#secondLine'),

    // Amount of stock to be loaded / unloaded
    loadingStock: 0,

    // Resets commentary
    // ------------------
    clearCommentary: function() {
        if(settings.workFlow === true) {console.log('Clearing commentary: ' + (Date.now() - settings.launchTime)); }
        for (var i = this.commentaryBox.children.length - 1; i > -1; i--) {
            if (this.commentaryBox.children[i].id == 'firstLine' || this.commentaryBox.children[i].id == 'secondLine') {
                this.commentaryBox.children[i].innerText = '';
            } else if (this.commentaryBox.children[i].nodeName == 'BR') {
                // no action
            } else {
                this.commentaryBox.children[i].remove();
            }
        }
    },

    // Show commentary
    // ---------------
    showCommentary: function() {
        buildItem.building.style.bottom = '-15%';
        this.commentaryBox.style.bottom = 0;
    },

    // Show commentary
    // ---------------
    hideCommentary: function() {
        commentary.commentaryBox.style.bottom = '-10%';
        buildItem.building.style.bottom = '-15%';
    },

    // Adds commentary on piece clicked on
    // -----------------------------------
    clickCommentary: function(click) {
        // Resets commentary
        this.clearCommentary(click);
        // Adds piece icon
        this.commentaryBox.appendChild(new PieceSVG(click.piece.type, click.piece.team, 'startPiece', 10, (game.mapWidth - 2*game.surroundSize) * 0.3 - (game.gridSize + 2*game.tileBorder)/2, 1.5, 0, 5, game.gridSize, game.tileBorder, game.boardSurround).svg);
        // Adds stock icons icon
        for (let i = 0; i < click.piece.stock; i+=1) {
            this.commentaryBox.appendChild(game.icons.createIcon(click.piece.goods, 'stock' + i, 10 + Math.floor(i/10) * ((game.gridSize + game.tileBorder) / 1.5), (game.mapWidth - 2*game.surroundSize) * 0.7 - game.tileBorder/2 + (((i % 10) - 0.5) * (game.gridSize + game.tileBorder) / 1.5), 1.5));
        }
        // First line of commentary
        if (click.piece.type === 'desert') {
            this.firstLineComment.innerText = 'Desert';
        } else if (click.piece.category === 'Resources') {
            this.firstLineComment.innerText = click.piece.team + ' ' + click.piece.type + ': produces ' + click.piece.production + ' ' + click.piece.goods + ' per phase';
        } else { // Settlements and Transport
            this.firstLineComment.innerText = click.piece.team + ' ' + click.piece.type;
        }
        if (click.piece.stock > 0) {
            this.firstLineComment.insertAdjacentText('beforeend', ' - ' + click.piece.goods + ": " + click.piece.stock);
        }
        this.showCommentary();
        // Commentary event handler for goods
        if(click.piece.team === game.turn && click.piece.stock > 0) {
            this.secondLineComment.innerText = 'Select quantity of goods to load';
            this.commentaryBox.addEventListener('click', this.clickGoods);
        }
    },


    // Method for goods quantity selection
    // ------------------------------------
    clickGoods: function(e) {
        if(settings.workFlow === true) {console.log('Goods quantity selection: ' + (Date.now() - settings.launchTime)); }
        let xClickCommentary = e.clientX - commentary.commentaryBox.offsetLeft;
        let element = e.target;

        // Finds icon selected based on id at icon parent level
        if(element != commentary.commentaryBox) {
            while (element.id == '') {
                element = element.parentNode;
            }

            let iconFound = false;
            // Loops through all goods icons shown
            for (var k = 0; k < human.movementArray.start.piece.stock; k++) {
                stockID = '#stock' + k;
                let currentIcon = document.querySelector(stockID);
                // Until chosen icon is reached goods are changed colour using CSS classes
                if (iconFound == false) {
                    for (var h = 0; h < currentIcon.children.length; h++) {
                        let nextChild = currentIcon.children[h];
                        nextChild.setAttribute('class', currentIcon.className.baseVal + ' ' + game.turn + ' team_stroke team_fill');
                    }
                    // Actions when icon is reached
                    if (element.id == 'stock' + k) {
                        iconFound = true;
                        commentary.loadingStock = k + 1;
                        if (human.movementArray.start.piece.category == 'Transport') {
                            commentary.secondLineComment.innerText = 'Click settlement or resource tile to unload - ' + human.movementArray.start.piece.goods + ': ' + (k + 1);
                        } else if (human.movementArray.start.piece.category == 'Resources') {
                            commentary.secondLineComment.innerText = 'Click ship to load - ' + human.movementArray.start.piece.goods + ': ' + (k + 1);
                        }
                    }

                    // CSS classes are removed to reset colours if necessary
                } else {
                    for (var h = 0; h < currentIcon.children.length; h++) {
                        let nextChild = currentIcon.children[h];
                        if (nextChild.classList.contains(game.turn)) {
                            nextChild.classList.remove(game.turn);
                        }
                        if (nextChild.classList.contains('team_stroke')) {
                            nextChild.classList.remove('team_stroke');
                        }
                        if (nextChild.classList.contains('team_fill')) {
                            nextChild.classList.remove('team_fill');
                        }
                    }
                }
            }
        }

        // Alternative approach based on positioning - keep code
        /* if (xClickCommentary > (game.mapWidth - 2*surroundSize) * 0.7 - tileBorder/2 - (0.5 * (gridSize + tileBorder) / 1.5) && xClickCommentary < (game.mapWidth - 2*surroundSize) * 0.7 - tileBorder/2 + ((10 - 0.5) * (gridSize + tileBorder) / 1.5) ) {
            //if (yClickCommentary > 10 && yClickCommentary < 10 + (Math.floor((pieceMovement.movementArray.start.pieces.stock-1)/10)+1) * ((gridSize + tileBorder) / 1.5)) {
                //let xClickGoods = Math.floor(((game.mapWidth - 2*surroundSize) * 0.7 - tileBorder/2 - (0.5 * (gridSize + tileBorder) / 1.5), xClickCommentary - ((game.mapWidth - 2*surroundSize) * 0.7 - tileBorder/2 - (0.5 * (gridSize + tileBorder) / 1.5))) / ((gridSize + tileBorder) / 1.5)) + 1;
                //let yClickGoods = Math.floor((yClickCommentary - 10) / ((gridSize + tileBorder) / 1.5)) + 1;
                let icons = document.querySelector('.iconColourChange');
                icons.setAttribute('class', 'iconColourChange ' + game.turn +  ' team_stroke team_fill');
                //(game.mapWidth - 2*surroundSize) * 0.7 - tileBorder/2 + (((i % 10) - 0.5) * (gridSize + tileBorder) / 1.5)
          //  }
        } */
    },

// LAST BRACKET OF OBJECT
}
