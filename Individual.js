//Object-oriented class
function Individual(board){ //Representes a individual of the population
	this.myboard = board; //receives the same board as other individuals
	this.dna = new DNA(); //DNA object
	this.moved = 0; //how much it moved since born
	this.life = 1; //1 = it's alive, 0 = it's dead
	this.fit = 0; //individual fitness

	this.resetDNA = function() {
	    this.dna = new DNA();
    }

	this.reset = function(){ //reset the population to a new generation
		this.board = board;
		this.moved = 0;
		this.life = 1;
	};

	this.moveThisTile = function(tableRow, tableColumn){ //dies in the border
		if (myboard.checkIfMoveable(tableRow, tableColumn, "up") ||
	      myboard.checkIfMoveable(tableRow, tableColumn, "down") ||
	      myboard.checkIfMoveable(tableRow, tableColumn, "left") ||
	      myboard.checkIfMoveable(tableRow, tableColumn, "right") )
	  	
   		{
    	myboard.incrementMoves();
  		}
  		else
  		{
    	this.death();
  		}

  		if (myboard.checkIfWinner())
		  {
		    alert("Congratulations! You solved the puzzle in " + this.moved + " moves.");
		    //startNewGame();
		  }
	}

    
    //change the individual positon and speed
	this.update = function(){
        this.myboard;
		if(this.life){ //just move if it is alive
			this.moveThisTile(this.dna.genes[count]); //try movement(gene)
			this.vel.add(this.acc); //add the acceleration to the speed
			this.lastPos = this.pos; //save the current position
			this.pos.add(this.vel); //update the position
			this.moved += dist(this.pos.x, this.pos.y, this.lastPos.x, this.lastPos.y); //calculte how much it moved
			this.acc.mult(0); //acceleration = 0
			this.borderCrash();
		}
	};

	this.Mdistance = function(){
		var count = 1;
		var distance = 0;
		var diference;
		  for (var i = 0; i < rows; i++)
		  {
		    for (var j = 0; j < columns; j++)
		    {
		    	diference = myboard.arrayForBoard[i][j] - count;
		    		if(diference<0) diference *= (-1);

		    	distance += diference;
		      
		      	count++;
		    }
		  }
		  


	}



	this.display = function(isBest){ //shows the individuals
		if(!this.life){ //if the invidivual is dead it recives another color
            if (isBest) { //color of the best individual
                fill(200, 250, 200);
                ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
            }
            else{
                fill(210);
                imageMode(CENTER);
                //in Firefox
                image(img, this.pos.x, this.pos.y, img.width/8, img.height/8);

                //in Google Chrome
                //ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
			}
		}

		else {
            if (isBest) { //color of the best individual
                fill(60, 255, 60);
                rectMode(CENTER);
                rect(this.pos.x, this.pos.y, this.diameter, this.diameter);
            }
            else { //color the other individuals
                fill(60, 60, 200);
                ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
            }
        }
	};

	this.fitness = function(){ //calculte Individual fitness
		//distance from objective + how much it moved when lifespan ends
		this.fit = 100/(dist(this.pos.x, this.pos.y, goalx, goaly) + ((this.moved)*4) + (!this.life * 1000));
		return this.fit;
	};

	//generate genes crossover
	this.crossover = function(){
		for(var i = 0; i<frameLimit; i++){ //for every gene
			this.dna.genes[i].add(best_one.dna.genes[i]); //add with the bestOne's genes
			this.dna.genes[i].x += random(-0.1, 0.1); //mutation at x
			this.dna.genes[i].y += random(-0.1, 0.1); //mutation at y
			this.dna.genes[i].div(2); //dived the sum
		}
	};

	this.death = function(){ //Individual now is dead, can't move
		this.life = 0;
	};
}