function DNA(){ //class
	//Generates DNA, genes array(it's the force applied every frame)
	//0 - up
	//1 - right
	//2 - down
	//3 - left
	upper_bound = 4;
	lower_bound = 0;
	this.genes = [];
	this.geneMax = 300;
	var random_number;

	for(var i = 0; i < this.geneMax; i++){
		this.genes[i] = Math.floor(Math.random()*(upper_bound - lower_bound) + lower_bound);
	}
}

/************************************/
var finalState = [
	[1, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[1, 2, -1, -1, -1, -1, -1, 3, -1, -1, -1, 4, -1, -1, -1, -1],
	[1, 2, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[1, 2, 3, 4, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[1, 2, 3, 4, 5, 6, -1, 7, -1, -1, -1, 8, -1, -1, -1, -1],
	[1, 2, 3, 4, 5, 6, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1],
	[1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -1, -1, 13, -1, -1, -1],
	[1, 2, 3, 4, 5, 6, 7, 8, 9, 14, 10, -1, 13, -1, -1, -1],
	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -1, 13, 14, -1, -1],
	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],
];

//             0  1  2  3  4  5  6  7  8  9
var frozen = [-1, 0, 0, 2, 3, 3, 5, 6, 6, 8];

var progression = 0;

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
		this.board = this.puzzleInstance.resetBoard();
		this.running = true;
		this.geneCount = 0;
	};

	this.mdistance = function(){
		var distance = 0;
		var diference;
		for (var i = 0; i < boardSize; i++){
			for (var j = 0; j < boardSize; j++){
				if (finalState[progression][i * boardSize + j] != -1){
					diference = this.puzzleInstance.board[i * boardSize + j] - finalState[progression][i * boardSize + j];
					console.log("dif " + i + " " + j + " = " + diference);
					distance += Math.abs(diference);
				}
			}
		}

		this.mdist = distance;
		return distance;
	}

	this.move = function(move){ //dies in the border
		if (!this.running) return;

		this.puzzleInstance.moveTile(move);

		/*if (!this.puzzleInstance.moveTile(move)){
			this.running = false;
			simulationCounter--;

			this.puzzleInstance.class = "fail";
			this.puzzleInstance.drawBoard();
		}*/

		if (this.geneCount >= this.dna.genes.length){
			this.running = false;
			simulationCounter--;

			this.puzzleInstance.class = "fail";
			this.puzzleInstance.drawBoard();
		}

  		if (this.mdistance() == 0) {
		    this.running = false;
		    this.completed = true;
		    simulationCounter--;

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
	this.crossover = function(){
		for(var i = 0; i < this.dna.genes.length; i++){ //for every gene
			this.dna.genes[i] += best_one.dna.genes[i]; //add with the bestOne's genes
			this.dna.genes[i] = this.dna.genes[i] % 4;
		}
	};

	this.mutation = function(){
		var position = Math.floor(Math.random()*(Math.floor(this.dna.genes.length / 3) + 1));
		var offset = Math.floor(Math.random()*3 + 1);

		this.puzzleInstance.board[position] = (this.puzzleInstance.board[position] + offset) % 4;
	};
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
				if (this.emptyX >= boardSize - 1) return true;
				if (frozen[progression] != -1 && this.board[(this.emptyX + 1) * boardSize + this.emptyY] == finalState[frozen[progression]][(this.emptyX + 1) * boardSize + this.emptyY]) return true;

				this.board[this.emptyX * boardSize + this.emptyY] = this.board[(this.emptyX + 1) * boardSize + this.emptyY];
				this.board[(this.emptyX + 1) * boardSize + this.emptyY] = 0;
				this.emptyX += 1;
			break;

			case 1: // LEFT
				if (this.emptyY >= boardSize - 1) return true;
				if (frozen[progression] != -1 && this.board[this.emptyX * boardSize + (this.emptyY + 1)] == finalState[frozen[progression]][this.emptyX * boardSize + (this.emptyY + 1)]) return true;

				this.board[this.emptyX * boardSize + this.emptyY] = this.board[this.emptyX * boardSize + (this.emptyY + 1)];
				this.board[this.emptyX * boardSize + (this.emptyY + 1)] = 0;
				this.emptyY += 1;
			break;

			case 2: // DOWN
				if (this.emptyX <= 0) return true;
				if (frozen[progression] != -1 && this.board[(this.emptyX - 1) * boardSize + this.emptyY] == finalState[frozen[progression]][(this.emptyX - 1) * boardSize + this.emptyY]) return true;

				this.board[this.emptyX * boardSize + this.emptyY] = this.board[(this.emptyX - 1) * boardSize + this.emptyY];
				this.board[(this.emptyX - 1) * boardSize + this.emptyY] = 0;
				this.emptyX -= 1;
			break;

			case 3: // RIGHT
				if (this.emptyY <= 0) return true;
				if (frozen[progression] != -1 && this.board[this.emptyX * boardSize + (this.emptyY - 1)] == finalState[frozen[progression]][this.emptyX * boardSize + (this.emptyY - 1)]) return true;

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
var bestFitObj;

var initialBoard;
var initialEmptyX, initialEmptyY;
var boardSize;

var population;

var simulationIntervalID;
var simulationCounter;
var simulationTime = 3;

var currentGeneration;
var maxGeneration = 5;

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

	console.log("pop size: " + population.length);
	console.log("mdist: " + population[0].mdistance());

	bestFitObj = document.getElementById("bestfit");

	var button = document.getElementById("newGame");
  	button.addEventListener("click", startSimulation, false);
}

function startSimulation(){
	simulationCounter = population.length;
	simulationIntervalID = setInterval(simulate, simulationTime);
}

function simulate(){
	for (var i = 0; i < population.length; i++) population[i].update();

	if (simulationCounter <= 0) endSimulation();
}

function endSimulation(){
	clearInterval(simulationIntervalID);

	// chamar crossover aqui
	var localFit;
	min = 100000;
	best_one = population[0];
	population[0].mdistance();
	//averageFitness = 0;

		//find the best individual
		for(i=1; i<population.length; i++){
			population[i].mdistance();

			if(!best_one.haveFitnessHigherThat(population[i])){
				best_one = population[i];
			}
		}

		if (best_one.completed){
			// progression increased
			progression++;

			if (progression >= finalState.length) return;

			initialBoard = best_one.puzzleInstance.board.slice();
			initialEmptyX = best_one.puzzleInstance.emptyX;
			initialEmptyY = best_one.puzzleInstance.emptyY;

			for(i = 0; i < population.length; i++) {
	            if (population[i] !== best_one){
	            	population[i].resetDNA();
	            } 
	            population[i].reset();
        	}
		} else {
			for (i = 0; i < population.length; i++) {
				console.log("crossover to ind " + i);
	            if (population[i] !== best_one){
	            	population[i].resetDNA();
					population[i].crossover();
	            } 
	            population[i].mutation();
	            population[i].reset();
	        }
		}		

        best_one.puzzleInstance.class = "best";
        bestFitObj.innerHTML = "Best of Past Gen: MDist = " + best_one.mdist + ", Moves = " + best_one.puzzleInstance.moves;

	startSimulation();
}

window.addEventListener("load", start, false);