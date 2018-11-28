function DNA(){ //class
	//Generates DNA, genes array(it's the force applied every frame)
	//0 - up
	//1 - right
	//2 - down
	//3 - left
	upper_bound = 4;
	lower_bound = 0;
	this.genes = [];
	this.geneMax = 120;
	var random_number;

	for(var i = 0; i < this.geneMax; i++){
		this.genes[i] = Math.floor(Math.random()*(upper_bound - lower_bound) + lower_bound);
	}
}

/************************************/

function Individual(HTMLelem){ //Representes a individual of the population
	this.HTMLelem = HTMLelem;
	this.puzzleInstance = new PuzzleInstance(this.HTMLelem);

	this.dna = new DNA();
	this.mdist = -1;
	this.running = true;
	this.completed = false;
	this.geneCount = 0;
	
	this.resetDNA = function() {
	    this.dna = new DNA();
    }

	this.reset = function(){ //reset the population to a new generation
		this.board = puzzleInstance.resetBoard();
		this.running = true;
		this.geneCount = 0;
	};

	this.mdistance = function(){
		var count = 1;
		var distance = 0;
		var diference;
		for (var i = 0; i < rows; i++){
			for (var j = 0; j < columns; j++){
		    	diference = puzzleInstance.board[i * boardSize + j] - count;

		    	if (diference < 0) diference *= (-1);

		    	distance += diference;
		      	count++;
			}
		}

		this.mdist = distance;
		return this.mdist;
	}

	this.move = function(move){ //dies in the border
		if (!this.running) return;

		if (!this.puzzleInstance.moveTile(move)){
			this.running = false;

			this.puzzleInstance.class = "fail";
			this.puzzleInstance.drawBoard();
		}

  		if (this.mdistance == 0) {
		    this.running = false;
		    this.completed = true;

		    this.puzzleInstance.class = "complete";
		    this.puzzleInstance.drawBoard();
		}
	}

	this.update = function(){
		if (this.running && this.geneCount < this.dna.geneMax){
			console.log("make movement [" + this.geneCount + "] = " + this.dna.genes[this.geneCount]);
			this.move(this.dna.genes[this.geneCount++]);
		}
	};

	this.haveFitnessHigherThat = function(other){ //calculte Individual fitness
		if (this.mdist == other.mdist)
			return this.puzzleInstance.moves <= other.puzzleInstance.moves ? true : false;
		else
			return this.mdist <= other.mdist ? true : false;
	};

	//generate genes crossover
	/*this.crossover = function(){
		for(var i = 0; i<frameLimit; i++){ //for every gene
			this.dna.genes[i].add(best_one.dna.genes[i]); //add with the bestOne's genes
			this.dna.genes[i].x += random(-0.1, 0.1); //mutation at x
			this.dna.genes[i].y += random(-0.1, 0.1); //mutation at y
			this.dna.genes[i].div(2); //dived the sum
		}
	};*/
}

/*******************************************************/

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
	this.class = "";

	this.resetBoard = function(){
		this.board = initialBoard.slice();
		this.moves = 0;
		this.emptyX = initialEmptyX;
		this.emptyY = initialEmptyY;
		this.class = "";
	}

	this.drawBoard = function(){
		var outputString = "";
		var classString = "tile" + this.class;

  		for (var i = 0; i < boardSize; i++){
   			outputString += "<tr>";
   			for (var j = 0; j < boardSize; j++){
      			if (this.board[boardSize * i + j] == 0){
					outputString += "<td class=\"blank\"> </td>";
				} else {
					outputString += "<td class=\"" + classString + "\">" + this.board[boardSize * i + j] + "</td>";
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

		return true;
	}

	this.resetBoard();
}

/******************************/

var HTMLboards;

var initialBoard;
var initialEmptyX, initialEmptyY;
var boardSize;

var population;

function makeBoardSolvable(){
	var count = 0;
	var Ix, Iy;

	for (var i = 0; i < initialBoard.length - 1; i++){
		for (var j = i + 1; j < initialBoard.length; j++){
			if (initialBoard[j] > initialBoard[i]){
				count++;

				if (Math.random() > 0.5) {
					Ix = j;
					Iy = i;
				}
			}
		}
	}

	if (count % 2 == 1){
		var temp = initialBoard[Ix];
        initialBoard[Ix] = initialBoard[Iy];
        initialBoard[Iy] = temp;
	}
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function generateInitialBoard(){
	// generate the initial board array
	initialBoard = new Array(boardSize*boardSize);
	for (var i = 0; i < initialBoard.length; i++)
		initialBoard[i] = i;

	var temp;

	shuffleArray(initialBoard);
	makeBoardSolvable();

	for (var i = 0; i < initialBoard.length; i++){
		if (initialBoard[i] == 0){
			initialEmptyY = i % boardSize;
			i -= initialEmptyY;
			initialEmptyX = i / boardSize;
			break;
		}
	}

	console.log(initialEmptyX);
	console.log(initialEmptyY);
}

function start(){
	boardSize = 4;

	HTMLboards = document.getElementsByClassName("table");
	population = new Array(HTMLboards.length);

	generateInitialBoard();

	for (var i = 0; i < HTMLboards.length; i++){
		population[i] = new Individual(HTMLboards[i]);
		population[i].puzzleInstance.drawBoard();
	}

	var button = document.getElementById("newGame");
  	button.addEventListener("click", simulate, false);
}

function simulate(){
	for (var n = 0; n < 120; n++)
		for (var i = 0; i < HTMLboards.length; i++) population[i].update();
}

window.addEventListener("load", start, false);