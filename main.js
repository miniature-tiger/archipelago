let gameBoard = {

    boardArray: [],
    //boardArray: [[{pos: 1, type: 1},{pos: 2, type: 2},{pos: 3, type: 3}],[{pos: 1, type: 4},{pos: 2, type: 5},{pos: 3, type: 6}]],

    populateBoardArray: function(row, col) {
        for (var y = 0; y < col; y++) {


        let rowArray = [];
        for (var x = 0; x < row; x++) {
          //console.log('row ' + x);
          if(Math.random() > 0.98) {

              rowArray.push({pos: + x, type: 'land'});
          } else {
              rowArray.push({pos: + x, type: 'sea'});
          }
        }
        console.log(rowArray);
        this.boardArray.push(rowArray);
      }
    },

    overlayBoardArray: function(row, col) {
        this.overlayTiles(0, 6, 0, 6, 'sea');
        this.overlayTiles(0, 6, col-6, col, 'sea');
        this.overlayTiles(row-6, row, 0, 6, 'sea');
        this.overlayTiles(row-6, row, col-6, col, 'sea');


        this.boardArray[0][0].type = 'base';
        this.boardArray[0][1].type = 'base';
        this.boardArray[1][0].type = 'base';

        this.boardArray[row-1][0].type = 'base';
        this.boardArray[row-2][0].type = 'base';
        this.boardArray[row-1][1].type = 'base';

        this.boardArray[0][col-1].type = 'base';
        this.boardArray[0][col-2].type = 'base';
        this.boardArray[1][col-1].type = 'base';

        this.boardArray[row-1][col-1].type = 'base';
        this.boardArray[row-1][col-2].type = 'base';
        this.boardArray[row-2][col-1].type = 'base';

        //this.overlayTiles(15, 25, 15, 25, 'sea');
        //this.overlayTiles(17, 23, 17, 23, 'land');




    },

    overlayTiles: function(startRow, endRow, startCol, endCol, overlayType) {
      for (i = startRow; i < endRow; i++) {
        for (j = startCol; j < endCol; j++) {
          this.boardArray[i][j].type = overlayType;
        }
      }

    },

    createTile: function(squareType, i, j, gridSize) {

        // Creating the item in form of a div
        let newTile = document.createElement('div');
        let innerTile = document.createElement('div');
        let rotatedTile = document.createElement('div');

        newTile.id = i + '-' + j;
        //console.log(newTile.id);

        newTile.setAttribute('class', 'square ' + 'square_' + this.boardArray[i][j].type);
        newTile.style.height = (gridSize - 2) + 'px';
        newTile.style.width = (gridSize - 2) + 'px';

        rotatedTile.setAttribute('class', 'rotated_square ' + this.boardArray[i][j].type);
        rotatedTile.style.height = (gridSize - 4) + 'px';
        rotatedTile.style.width = (gridSize - 4) + 'px';

        innerTile.setAttribute('class', 'inner_square ' + this.boardArray[i][j].type);
        innerTile.style.height = (gridSize - 4) + 'px';
        innerTile.style.width = (gridSize - 4) + 'px';


        newTile.appendChild(rotatedTile);
        rotatedTile.appendChild(innerTile);


        /*
        newTile.appendChild(document.createTextNode('squareType ' + squareType));
        newTile.appendChild(document.createElement('br'));
        newTile.appendChild(document.createTextNode('Class ' + newTile.className));
        newTile.appendChild(document.createElement('br'));
        newTile.appendChild(document.createTextNode('Id ' + newTile.id));
        */
        return newTile;

    },

    drawBoard: function(row, col, gridSize) {
        // Delete existing board
        document.querySelector('div.boardMark').innerHTML = '';
        console.log(this.boardArray.length);

        // Loop through each board square
        for (var i = 0; i < this.boardArray.length; i++) {
          //console.log(this.boardArray[i].length);
          let newRow = document.createElement('div');
          newRow.setAttribute('class', 'board_row');
          newRow.style.width = col*gridSize + 'px';
          newRow.style.height = gridSize + 'px';
          newRow.id = 'rowID' + i + '-' + j;
          //console.log(newRow.id);
            for (var j = 0; j < this.boardArray[i].length; j++) {
              //console.log(i, j);
                let squareType = this.boardArray[i][j].type;
                newRow.appendChild(this.createTile(squareType, i, j, gridSize));
            }
            // Add row
            document.querySelector('div.boardMark').appendChild(newRow);
        }
    }
}


let row = 7, col = 7, gridSize = 35;

gameBoard.populateBoardArray(row, col);
gameBoard.overlayBoardArray(row, col);

gameBoard.drawBoard(row, col, gridSize);
