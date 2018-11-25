function DNA(){ //class
	//Generates DNA, genes array(it's the force applied every frame)
	//0 - up
	//1 - right
	//2 - down
	//3 - left
	upper_bound = 3;
	lower_bound = 0;
	this.genes = [];
	var random_number;

	for(var i = 0; i < 120; i++){
		this.genes[i] = Math.floor(Math.random()*(upper_bound - lower_bound) + lower_bound);
	}
}