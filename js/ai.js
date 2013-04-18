function check_path_AI(TANK){
	if(game_mode == 2 && TANK.master.id != MY_TANK.id) return false;
	if(TANK.invisibility != undefined) return false;	//invisibility
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
		if(game_mode == 1){
			TANK.move = 0;
			try_skills(TANK);
			}
		else{
			if(TANK.move == 1){
				var params = [
					{key: 'move', value: 0},
					];
				send_packet('tank_update', [TANK.id, params]);
				}
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
	if(TANK.team=='B' && TANK.y+tank_size/2<max_height && check_collisions(TANK.x+tank_size/2, TANK.y+tank_size+collision_gap, TANK)==false){
		do_ai_move(TANK, TANK.x, max_height, 'down');
		return true;
		}
	//try move up
	else if(TANK.team!='B' && TANK.y-tank_size/2>0 && check_collisions(TANK.x+tank_size/2, TANK.y-collision_gap, TANK)==false){
		do_ai_move(TANK, TANK.x, 0, 'up');
		return true;
		}
	//no more vertical move	
	if(direction == 'down' || direction == 'up'){
		if(TANK.move == 0){
			if(getRandomInt(1,2)==1) direction = 'left';		
			else 	direction = 'right';
			}
		//map up/bottom borders
		else if(TANK.team=='B' && TANK.y+tank_size/2>max_height || TANK.team!='B' && TANK.y-tank_size/2<0){
			if(getRandomInt(1,2)==1) direction = 'left';		
			else 	direction = 'right';
			TANK.move = 0;
			}
		}
	
	//try move left				
	if(direction == 'left'){
		if(TANK.x-tank_size>0 && check_collisions(TANK.x-collision_gap, TANK.y+tank_size/2, TANK)==false){
			if(TANK.move_direction != 'left')
				do_ai_move(TANK, 0, TANK.y, 'left');
			}
		else
			do_ai_move(TANK, max_width, TANK.y, 'right');	//must turn right
		
		}
	//right
	else if(direction == 'right'){
		if(TANK.x+tank_size<max_width && check_collisions(TANK.x+tank_size+collision_gap, TANK.y+tank_size/2, TANK)==false){
			if(TANK.move_direction != 'right')
				do_ai_move(TANK, max_width, TANK.y, 'right');
			}
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
function try_skills(TANK_AI){
	for(i in TYPES[TANK_AI.type].abilities){ 
		var nr = 1+parseInt(i);
		var ability_function = TYPES[TANK_AI.type].abilities[i].name.replace(/ /g,'_');
		if(TYPES[TANK_AI.type].abilities[i].broadcast == 2) continue;
		if(TYPES[TANK_AI.type].abilities[i].passive == true) continue;
		if(TANK_AI.abilities_reuse[nr-1] > Date.now() ) continue;
		var reuse = 0;
		try{
			//execute
			reuse = window[ability_function](TANK_AI, undefined, undefined, true);
			if(reuse !== false)
				return false;
			}
		catch(err){
			console.log("AI error: "+err.message);
			}
		if(reuse != 0)
			TANK_AI.abilities_reuse[nr-1] = Date.now() + reuse;
		}
	}
//ai move rgistration and graphics
function soldiers_move(mouseX, mouseY){
	if(MY_TANK.death_respan != undefined || MY_TANK.dead == 1) return false;
	var gap_rand = 10;
	mouseX_copy = mouseX;
	mouseY_copy = mouseY;
	
	for(var i in TANKS){
		if(TANKS[i].master == undefined) continue;	//not under controll
		if(TANKS[i].master != undefined && TANKS[i].master.id != MY_TANK.id) continue;	//not under MY controll
		
		if(MY_TANK.invisibility != undefined){
			if(game_mode == 2)
				send_packet('del_invisible', [MY_TANK.id]);
			else
				delete MY_TANK.invisibility;
			}
		
		//randomize
		mouseX = mouseX_copy + getRandomInt(-gap_rand, gap_rand);
		mouseY = mouseY_copy + getRandomInt(-gap_rand, gap_rand);
			
		//check clicks
		var found_something = false;
		target_lock_id=0;
		if(TANKS[i].target_move_lock != undefined)
			delete TANKS[i].target_move_lock;

		for(var j in TANKS){
			var tank_size =  0.9*TYPES[TANKS[j].type].size[1];
			if(Math.abs(TANKS[j].x+tank_size/2 - mouseX) < tank_size/2 && Math.abs(TANKS[j].y+tank_size/2 - mouseY) < tank_size/2){
				if(TANKS[j].team == TANKS[i].team){
					if(TANKS[j].name != name)
						return false; //clicked on allies, but not youself
					}
				else{
					//clicked on enemy
					TANKS[j].clicked_on = 10;	// will draw circle on enemies
					TANKS[i].target_move_lock = TANKS[j].id;
					TANKS[i].target_shoot_lock = TANKS[j].id;
					target_lock_id = TANKS[j].id;
					found_something = true;
					break;
					}
				}
			}

		//ok, lets show where was clicked
		if(found_something == false)
			TANKS[i].clicked = [mouseX,mouseY,8];
	
		var tank_size = TYPES[TANKS[i].type].size[1];
		mouseX_tmp = mouseX-tank_size/2;	
		mouseY_tmp = mouseY-tank_size/2;
		mouseX_tmp = Math.floor(mouseX_tmp);
		mouseY_tmp = Math.floor(mouseY_tmp);
		
		//register
		if(game_mode == 2){
			if(found_something==true)
				register_tank_action('move', opened_room_id, TANKS[i].id, [round(TANKS[i].x), round(TANKS[i].y), round(mouseX_tmp), round(mouseY_tmp), target_lock_id]);
			else
				register_tank_action('move', opened_room_id, TANKS[i].id, [round(TANKS[i].x), round(TANKS[i].y), round(mouseX_tmp), round(mouseY_tmp)]);
			}
		else{
			TANKS[i].move = 1;
			TANKS[i].move_to = [mouseX_tmp, mouseY_tmp];
			if(MUTE_FX==false){
				try{
					audio_finish = document.createElement('audio');
					audio_finish.setAttribute('src', 'sounds/click.ogg');
					audio_finish.play();
					}
				catch(error){}
				}
			}
		}
	}
