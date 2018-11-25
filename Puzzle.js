var HTMLboards;
var instances;

var initialBoard;
var initialEmptyX, initialEmptyY;
var boardSize;

var PuzzleInstance = function(HTMLelem){
	this.HTMLboard = HTMLelem;
	this.board = null;
	this.moves = 0;
	this.emptyX = -1;
	this.emptyY = -1;

	this.resetBoard = function(){
		this.board = initialBoard;
		this.moves = 0;
		this.emptyX = initialEmptyX;
		this.emptyY = initialEmptyY;
	}

	this.drawBoard = function(){
		var outputString = "";

  		for (var i = 0; i < boardSize; i++){
   			outputString += "<tr>";
   			for (var j = 0; j < boardSize; j++){
      			if (this.board[boardSize * i + j] == 0){
					outputString += "<td class=\"blank\"> </td>";
				} else {
					outputString += "<td class=\"tile\">" + this.board[boardSize * i + j] + "</td>";
      			}
    		} 
    		outputString += "</tr>";
  		} 

  		this.HTMLboard.innerHTML = outputString;
	}

	this.moveTile = function(movement){
		switch (movement) {
			case 0: // UP
				if (this.emptyX >= boardSize - 1) return false;

				this.board[this.emptyX * boardSize + this.emptyY] = this.board[(this.emptyX + 1) * boardSize + this.emptyY];
				this.board[(this.emptyX + 1) * boardSize + this.emptyY] = 0;
				this.emptyX += 1;
			break;

			case 1: // LEFT
				if (this.emptyY >= boardSize - 1) return false;

				this.board[this.emptyX * boardSize + this.emptyY] = this.board[this.emptyX * boardSize + (this.emptyY + 1)];
				this.board[this.emptyX * boardSize + (this.emptyY + 1)] = 0;
				this.emptyY += 1;
			break;

			case 2: // DOWN
				if (this.emptyX <= 0) return false;

				this.board[this.emptyX * boardSize + this.emptyY] = this.board[(this.emptyX - 1) * boardSize + this.emptyY];
				this.board[(this.emptyX - 1) * boardSize + this.emptyY] = 0;
				this.emptyX -= 1;
			break;

			case 3: // RIGHT
				if (this.emptyY <= 0) return false;

				this.board[this.emptyX * boardSize + this.emptyY] = this.board[this.emptyX * boardSize + (this.emptyY - 1)];
				this.board[this.emptyX * boardSize + (this.emptyY - 1)] = 0;
				this.emptyY -= 1;
			break;
		}

		this.moves++;
		this.drawBoard();
	}

	this.resetBoard();
}