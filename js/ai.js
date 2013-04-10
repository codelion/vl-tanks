function check_path_AI(TANK){
	//wait for reuse
	if(TANK.ai_reuse - Date.now() > 0)	return false;
	TANK.ai_reuse = 1000/2+Date.now();	//half second pause
	if(TANK.dead==1)	return false;	//dead
	
	var tank_size = TYPES[TANK.type].size[1];
	var max_width = WIDTH_MAP - tank_size;
	var max_height = HEIGHT_MAP - tank_size;
	var y_direction = 0;
	if(TANK.team=='B') //top
		y_direction = max_height;
	
	//if first move on respawn - go up/down
	if(TANK.move == 0 && TANK.move_to == undefined){
		TANK.move_to = [TANK.x, y_direction];
		TANK.move = 1; 
		if(TANK.team=='B')
			TANK.move_direction = 'down';
		else
			TANK.move_direction = 'up';	
		}
	
	//if in battle
	/*if(TANK.attacking != undefined && TANK.attacking != 0){
		TANK.move = 0; 
		return false; 
		}*/
	
	set_random_path_AI(TANK);
	}
function set_random_path_AI(TANK){
	var tank_size = TYPES[TANK.type].size[1];
	var max_width = WIDTH_MAP - tank_size;
	var max_height = HEIGHT_MAP - tank_size;
	collision_gap = 5;
	
	var direction;
	if(TANK.master != undefined)
		direction = TANK.master.soldiers_direction;
	if(direction == undefined)
		direction = TANK.soldiers_direction;
	if(direction == undefined){
		if(getRandomInt(1,2)==1) direction = 'left';
		else 	direction = 'right';
		if(TANK.master != undefined)
			TANK.master.soldiers_direction = direction;
		else
			TANK.soldiers_direction = direction;
		}
	
	//try move down
	if(TANK.team=='B' && TANK.y<max_height && check_collisions(TANK.x+tank_size/2, TANK.y+tank_size+collision_gap, TANK)==false){
		TANK.move_to = [TANK.x, max_height];
		TANK.move=1;
		TANK.move_direction = 'down';
		return true;
		}
		
	//try move up
	if(TANK.team!='B' && TANK.y>0 && check_collisions(TANK.x+tank_size/2, TANK.y-collision_gap, TANK)==false){
		TANK.move_to = [TANK.x, 0];
		TANK.move=1;
		TANK.move_direction = 'up';
		return true;
		}
	
	//try move left				
	if(direction == 'left'){
		if(TANK.x-tank_size>0 && check_collisions(TANK.x-collision_gap, TANK.y+tank_size/2, TANK)==false){
			TANK.move_to = [0, TANK.y];
			TANK.move_direction = 'left';
			}
		else{
			//must turn right
			TANK.move_to = [max_width, TANK.y];	
			TANK.move_direction = 'right';
			direction = 'right';
			if(TANK.master != undefined)
				TANK.master.soldiers_direction = direction;
			else
				TANK.soldiers_direction = direction;
			}			
		}
	else{	//right
		if(TANK.x+tank_size<max_width && check_collisions(TANK.x+tank_size+collision_gap, TANK.y+tank_size/2, TANK)==false){
			TANK.move_to = [max_width, TANK.y];
			TANK.move_direction = 'right';
			}
		else{
			//must turn left
			TANK.move_to = [0, TANK.y];
			TANK.move_direction = 'left';
			direction = 'left';
			if(TANK.master != undefined)
				TANK.master.soldiers_direction = direction;
			else
				TANK.soldiers_direction = direction;
			}
		}
	TANK.move=1;
	}
