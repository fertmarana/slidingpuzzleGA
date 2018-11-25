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