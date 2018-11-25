import 'Puzzle.js';
import 'DNA.js';

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

		if (!puzzleInstance.moveTile(move)){
			this.running = false;
		}

  		if (this.mdistance == 0) {
		    this.running = false;
		    this.completed = true;
		}
	}

	this.update = function(){
		if (this.running && this.geneCount < this.dna.geneMax){
			this.move(this.dna.genes[geneCount++]);
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