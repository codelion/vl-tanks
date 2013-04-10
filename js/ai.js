function check_path_AI(TANK){
	if(TANK.ai_reuse - Date.now() > 0) return false;	//wait for reuse
	if(game_mode == 1)
		TANK.ai_reuse = 1000/2+Date.now();	//half second pause
	else
		TANK.ai_reuse = 1000+Date.now();	//second pause
	if(TANK.dead==1) return false;	//dead
	
	var tank_size = TYPES[TANK.type].size[1];
	var max_width = WIDTH_MAP - tank_size;
	var max_height = HEIGHT_MAP - tank_size;
	var y_direction = 0;
	if(TANK.team=='B') //top
		y_direction = max_height;
	
	//if in battle - stop
	if(TANK.last_bullet_time + 1000 - Date.now() > 0){
		if(game_mode == 1)
			TANK.move = 0;
		else{
			var params = [
				{key: 'move', value: 0},
				];
			send_packet('tank_update', [TANK.id, params]);
			}
		return false; 
		}
		
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
	
	if(TANK.move==1 && (direction == 'up' || direction == 'down' || direction == undefined)) return false; 
	
	//try move down
	if(TANK.team=='B' && TANK.y<max_height && check_collisions(TANK.x+tank_size/2, TANK.y+tank_size+collision_gap, TANK)==false){
		do_ai_move(TANK, TANK.x, max_height, 'down');
		return true;
		}
		
	//try move up
	if(TANK.team!='B' && TANK.y>0 && check_collisions(TANK.x+tank_size/2, TANK.y-collision_gap, TANK)==false){
		do_ai_move(TANK, TANK.x, 0, 'up');
		return true;
		}	
		
	if(direction == undefined){
		if(getRandomInt(1,2)==1) direction = 'left';
		else 	direction = 'right';
		if(TANK.master != undefined)
			tank_link = TANK.master;
		else
			tank_link = TANK;
		if(game_mode == 1)	
			tank_link.soldiers_direction = direction;
		else{
			var params = [
				{key: 'soldiers_direction', value: direction},
				];
			send_packet('tank_update', [tank_link.id, params]);
			return false;
			}
		}
	
	//try move left				
	if(direction == 'left'){
		if(TANK.x-tank_size>0 && check_collisions(TANK.x-collision_gap, TANK.y+tank_size/2, TANK)==false){
			do_ai_move(TANK, 0, TANK.y, 'left');
			}
		else{
			//must turn right
			do_ai_move(TANK, max_width, TANK.y, 'right');
			direction = 'right';
			if(TANK.master != undefined)
				tank_link = TANK.master;
			else
				tank_link = TANK;
			if(game_mode == 2){
				var params = [
					{key: 'soldiers_direction', value: direction},
					];
				send_packet('tank_update', [tank_link.id, params]);
				}
			else
				tank_link.soldiers_direction = direction;
			}			
		}
	else if(direction == 'right'){	//right
		if(TANK.x+tank_size<max_width && check_collisions(TANK.x+tank_size+collision_gap, TANK.y+tank_size/2, TANK)==false){
			do_ai_move(TANK, max_width, TANK.y, 'right');
			}
		else{
			//must turn left
			do_ai_move(TANK, 0, TANK.y, 'left');
			direction = 'left';
			if(TANK.master != undefined)
				tank_link = TANK.master;
			else
				tank_link = TANK;
			if(game_mode == 2){
				var params = [
					{key: 'soldiers_direction', value: direction},
					];
				send_packet('tank_update', [tank_link.id, params]);
				}
			else
				tank_link.soldiers_direction = direction;
			}
		}
	if(game_mode == 1){
		TANK.move=1;
		}
	}
function do_ai_move(TANK, xx, yy, direction){	
	if(game_mode == 2){
		register_tank_action('move', opened_room_id, TANK.id, [round(TANK.x), round(TANK.y), round(xx), round(yy), undefined, direction]);
		}
	else{
		TANK.move_to = [xx, yy];
		TANK.move = 1;
		if(direction != undefined)
			TANK.move_direction = direction;
		}
	}
