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
	
	var direction = TANK.move_direction;
	
	if(TANK.move==1 && (direction == 'up' || direction == 'down')) return false;
	
	//try move down
	if(TANK.team=='B' && TANK.y<max_height && check_collisions(TANK.x+tank_size/2, TANK.y+tank_size+collision_gap, TANK)==false){
		do_ai_move(TANK, TANK.x, max_height, 'down');
		return true;
		}
	//try move up
	else if(TANK.team!='B' && TANK.y>0 && check_collisions(TANK.x+tank_size/2, TANK.y-collision_gap, TANK)==false){
		do_ai_move(TANK, TANK.x, 0, 'up');
		return true;
		}	
	else if(direction == 'down' || direction == 'up'){
		if(getRandomInt(1,2)==1) direction = 'left';		
		else 	direction = 'right';
		}
	
	//try move left				
	if(direction == 'left'){
		if(TANK.x-tank_size>0 && check_collisions(TANK.x-collision_gap, TANK.y+tank_size/2, TANK)==false)
			do_ai_move(TANK, 0, TANK.y, 'left');
		else
			do_ai_move(TANK, max_width, TANK.y, 'right');	//must turn right
		
		}
	else if(direction == 'right'){	//right
		if(TANK.x+tank_size<max_width && check_collisions(TANK.x+tank_size+collision_gap, TANK.y+tank_size/2, TANK)==false)
			do_ai_move(TANK, max_width, TANK.y, 'right');
		else
			do_ai_move(TANK, 0, TANK.y, 'left');	//must turn left
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
