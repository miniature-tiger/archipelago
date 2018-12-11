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
        if(workFlow == 1) {console.log('Clearing commentary: ' + (Date.now() - launchTime)); }
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


    // Method for goods quantity selection
    // ------------------------------------
    clickGoods: function(e) {
        if(workFlow == 1) {console.log('Goods quantity selection: ' + (Date.now() - launchTime)); }
        let xClickCommentary = e.clientX - commentary.commentaryBox.offsetLeft;
        let element = e.target;

        // Finds icon selected based on id at icon parent level
        if(element != commentary.commentaryBox) {
            while (element.id == '') {
                element = element.parentNode;
            }

            let iconFound = false;
            // Loops through all goods icons shown
            for (var k = 0; k < pieceMovement.movementArray.start.pieces.stock; k++) {
                stockID = '#stock' + k;
                let currentIcon = document.querySelector(stockID);
                // Until chosen icon is reached goods are changed colour using CSS classes
                if (iconFound == false) {
                    for (var h = 0; h < currentIcon.children.length; h++) {
                        let nextChild = currentIcon.children[h];
                        nextChild.setAttribute('class', currentIcon.className.baseVal + ' ' + gameManagement.turn + ' team_stroke team_fill');
                    }
                    // Actions when icon is reached
                    if (element.id == 'stock' + k) {
                        iconFound = true;
                        commentary.loadingStock = k + 1;
                        if (pieceMovement.movementArray.start.pieces.category == 'Transport') {
                            commentary.secondLineComment.innerText = 'Click settlement or resource tile to unload - ' + pieceMovement.movementArray.start.pieces.goods + ': ' + (k + 1);
                        } else if (pieceMovement.movementArray.start.pieces.category == 'Resources') {
                            commentary.secondLineComment.innerText = 'Click ship to load - ' + pieceMovement.movementArray.start.pieces.goods + ': ' + (k + 1);
                        }
                    }

                    // CSS classes are removed to reset colours if necessary
                } else {
                    for (var h = 0; h < currentIcon.children.length; h++) {
                        let nextChild = currentIcon.children[h];
                        if (nextChild.classList.contains(gameManagement.turn)) {
                            nextChild.classList.remove(gameManagement.turn);
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
        /* if (xClickCommentary > (screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 - (0.5 * (gridSize + tileBorder) / 1.5) && xClickCommentary < (screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 + ((10 - 0.5) * (gridSize + tileBorder) / 1.5) ) {
            //if (yClickCommentary > 10 && yClickCommentary < 10 + (Math.floor((pieceMovement.movementArray.start.pieces.stock-1)/10)+1) * ((gridSize + tileBorder) / 1.5)) {
                //let xClickGoods = Math.floor(((screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 - (0.5 * (gridSize + tileBorder) / 1.5), xClickCommentary - ((screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 - (0.5 * (gridSize + tileBorder) / 1.5))) / ((gridSize + tileBorder) / 1.5)) + 1;
                //let yClickGoods = Math.floor((yClickCommentary - 10) / ((gridSize + tileBorder) / 1.5)) + 1;
                let icons = document.querySelector('.iconColourChange');
                icons.setAttribute('class', 'iconColourChange ' + gameManagement.turn +  ' team_stroke team_fill');
                //(screenWidth - 2*surroundSize) * 0.7 - tileBorder/2 + (((i % 10) - 0.5) * (gridSize + tileBorder) / 1.5)
          //  }
        } */
    },

// LAST BRACKET OF OBJECT
}
