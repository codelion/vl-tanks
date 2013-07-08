var AI = new AI_CLASS();

function AI_CLASS(){
	this.check_path_AI = function(TANK){
		if((game_mode == 'multi_quick' || game_mode == 'multi_craft') && TANK.master.id != MY_TANK.id) return false;
		if(TANK.id == MY_TANK.id) return false;
		if(TANK.ai_reuse - Date.now() > 0) return false;	//wait for reuse
		if(game_mode == 'multi_quick' || game_mode == 'multi_craft')
			TANK.ai_reuse = 1000+Date.now();	//second pause
		else
			TANK.ai_reuse = 1000/2+Date.now();	//half second pause
		if(TANK.dead==1) return false;	//dead
		
		var max_width = WIDTH_MAP - TANK.width();
		var max_height = HEIGHT_MAP - TANK.height();
		var y_direction = 0;
		if(TANK.team=='B') //top
			y_direction = max_height;
		
		//if in battle - stop
		if(TANK.last_bullet_time + 1000 - Date.now() > 0){
			if(game_mode == 'single_quick' || game_mode == 'single_craft'){
				TANK.move = 0;
				AI.try_skills(TANK);
				}
			else{
				if(TANK.move == 1){
					var params = [
						{key: 'move', value: 0},
						];
					MP.send_packet('tank_update', [TANK.id, params]);
					}
				}
			return false; 
			}
			
		AI.set_random_path_AI(TANK);
		}
	this.set_random_path_AI = function(TANK){
		var max_width = WIDTH_MAP - TANK.width();
		var max_height = HEIGHT_MAP - TANK.height();
		collision_gap = 5;
		
		var direction = TANK.move_direction;
		
		if(TANK.move==1 && (direction == 'up' || direction == 'down')) return false;
		
		//try move down
		if(TANK.team=='B' && TANK.cy() < max_height && UNITS.check_collisions(TANK.cx(), TANK.y+TANK.height()+collision_gap, TANK)==false){
			AI.do_ai_move(TANK, TANK.x, max_height, 'down');
			return true;
			}
		//try move up
		else if(TANK.team!='B' && TANK.y-TANK.height()/2>0 && UNITS.check_collisions(TANK.cx(), TANK.y-collision_gap, TANK)==false){
			AI.do_ai_move(TANK, TANK.x, 0, 'up');
			return true;
			}
		//no more vertical move	
		if(direction == 'down' || direction == 'up'){
			if(TANK.move == 0){
				if(HELPER.getRandomInt(1,2)==1) direction = 'left';		
				else 	direction = 'right';
				}
			//map up/bottom borders
			else if(TANK.team=='B' && TANK.cy() > max_height || TANK.team!='B' && TANK.y-TANK.height()/2<0){
				if(HELPER.getRandomInt(1,2)==1) direction = 'left';		
				else 	direction = 'right';
				TANK.move = 0;
				}
			}
		
		//try move left				
		if(direction == 'left'){
			if(TANK.x-TANK.width() > 0 && UNITS.check_collisions(TANK.x-collision_gap, TANK.cy(), TANK)==false){
				if(TANK.move_direction != 'left')
					AI.do_ai_move(TANK, 0, TANK.y, 'left');
				}
			else
				AI.do_ai_move(TANK, max_width, TANK.y, 'right');	//must turn right
			
			}
		//right
		else if(direction == 'right'){
			if(TANK.cx() < max_width && UNITS.check_collisions(TANK.cx()+collision_gap, TANK.cy(), TANK)==false){
				if(TANK.move_direction != 'right')
					AI.do_ai_move(TANK, max_width, TANK.y, 'right');
				}
			else
				AI.do_ai_move(TANK, 0, TANK.y, 'left');	//must turn left
			}
		if(game_mode == 'single_quick' || game_mode == 'single_craft')
			TANK.move=1;
		}
	this.do_ai_move = function(TANK, xx, yy, direction){
		if(game_mode == 'multi_quick' || game_mode == 'multi_craft'){
			MP.register_tank_action('move', opened_room_id, TANK.id, [round(TANK.x), round(TANK.y), round(xx), round(yy), undefined, direction]);
			}
		else{
			TANK.move_to = [xx, yy];
			TANK.move = 1;
			if(direction != undefined)
				TANK.move_direction = direction;
			}
		}
	this.try_skills = function(TANK_AI){
		if(game_mode == 'single_craft' || game_mode == 'multi_craft'){
			var selected_n = UNITS.get_selected_count(TANK_AI.team);
			if(selected_n == 1 && TANK_AI.id == MY_TANK.id) return false;
			}
		for(i in TYPES[TANK_AI.type].abilities){
			var nr = 1+parseInt(i);
			var ability_function = TYPES[TANK_AI.type].abilities[i].name.replace(/ /g,'_');
			if(TYPES[TANK_AI.type].abilities[i].broadcast == 2 && (game_mode == 'multi_quick' || game_mode == 'multi_craft')) continue;
			if(TYPES[TANK_AI.type].abilities[i].passive == true) continue;
			if(TANK_AI.abilities_reuse[nr-1] > Date.now() ) continue;
			var reuse = 0;
			try{
				//execute
				reuse = window[ability_function](TANK_AI, undefined, undefined, true);
				if(reuse != undefined && reuse != 0 && (game_mode == 'single_craft' || game_mode == 'multi_craft') && TANK_AI.team == MY_TANK.team){
					var tmp = new Array();
					tmp['function'] = INFOBAR.draw_ability_reuse;
					tmp['duration'] = reuse;
					tmp['type'] = 'REPEAT';
					tmp['nr'] = nr-1;	
					tmp['max'] = reuse;
					tmp['tank'] = TANK_AI;
					timed_functions.push(tmp);
					}
				if(reuse !== false)
					break;
				}
			catch(err){
				console.log("AI error: "+err.message);
				}
			if(reuse != 0)
				TANK_AI.abilities_reuse[nr-1] = Date.now() + reuse;
			}
		//check if missle or bomb ready
		if((game_mode == 'single_quick' || game_mode == 'single_craft') && TANK_AI.dead == undefined){	
			AI.do_auto_missile(TANK_AI.id);
			AI.do_auto_bomb(TANK_AI.id);
			}
		}
	//ai move registration and graphics
	this.soldiers_move = function(mouseX, mouseY){
		if(MY_TANK.death_respan != undefined || MY_TANK.dead == 1) return false;
		var gap_rand = 10;
		mouseX_copy = mouseX;
		mouseY_copy = mouseY;
		
		for(var i in TANKS){
			if(TANKS[i].master == undefined) continue;	//not under controll
			if(TANKS[i].master != undefined && TANKS[i].master.id != MY_TANK.id) continue;	//not under MY controll
			
			//randomize
			mouseX = mouseX_copy + HELPER.getRandomInt(-gap_rand, gap_rand);
			mouseY = mouseY_copy + HELPER.getRandomInt(-gap_rand, gap_rand);
				
			//check clicks
			var found_something = false;
			target_lock_id=0;
			if(TANKS[i].target_move_lock != undefined)
				delete TANKS[i].target_move_lock;
	
			for(var j in TANKS){
				if(Math.abs(TANKS[j].cx() - mouseX) < TANKS[j].width()/2 && Math.abs(TANKS[j].cy()- mouseY) < TANKS[j].height()/2){
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
		
			mouseX_tmp = mouseX-TANKS[i].width()/2;	
			mouseY_tmp = mouseY-TANKS[i].height()/2;	
			mouseX_tmp = Math.floor(mouseX_tmp);
			mouseY_tmp = Math.floor(mouseY_tmp);
			
			//register
			if(game_mode == 'multi_quick' || game_mode == 'multi_craft'){
				if(found_something==true)
					MP.register_tank_action('move', opened_room_id, TANKS[i].id, [round(TANKS[i].x), round(TANKS[i].y), round(mouseX_tmp), round(mouseY_tmp), target_lock_id]);
				else
					MP.register_tank_action('move', opened_room_id, TANKS[i].id, [round(TANKS[i].x), round(TANKS[i].y), round(mouseX_tmp), round(mouseY_tmp)]);
				}
			else{
				TANKS[i].move = 1;
				TANKS[i].move_to = [mouseX_tmp, mouseY_tmp];
				if(MUTE_FX==false){
					try{
						audio_finish = document.createElement('audio');
						audio_finish.setAttribute('src', '../sounds/click.ogg');
						audio_finish.volume = FX_VOLUME;
						audio_finish.play();
						}
					catch(error){}
					}
				}
			}
		}
	this.do_auto_missile = function(tank_id){	
		TANK = UNITS.get_tank_by_id(tank_id);
		if(TANK.try_missile == undefined) return false;
		
		//find enemy with min hp
		var ENEMY_NEAR;
		for (i in TANKS){				
			if(TANKS[i].team == TANK.team)	continue;	//same team
			if(TANKS[i].dead == 1)			continue;	//target dead
			if(TANKS[i].invisibility==1)		continue;	//blur mode
			if(TYPES[TANKS[i].type].type == "human")	continue;	//dont waste specials on soldiers
			
			//check
			distance = UNITS.get_distance_between_tanks(TANKS[i], TANK);
			if(distance > TANK.try_missile.range) continue;	//target too far
			
			//range ok
			if(ENEMY_NEAR==undefined)
				ENEMY_NEAR = [TANKS[i].hp, i];
			else if(TANKS[i].hp < ENEMY_NEAR[0])
				ENEMY_NEAR = [TANKS[i].hp, i];
			}
		if(ENEMY_NEAR == undefined) return false;
		var enemy = TANKS[ENEMY_NEAR[1]];
		
		if(TANK.try_missile.angle == true){
			//find angle
			dist_x = enemy.x - TANK.x;
			dist_y = enemy.y - TANK.y;
			var radiance = Math.atan2(dist_y, dist_x);
			var angle = (radiance*180.0)/Math.PI+90;
			angle = round(angle);
			}
			
		//control
		nr = TANK.try_missile.ability_nr;
		if(TANK.abilities_reuse[nr] > Date.now() ) return false; //last check
		TANK.abilities_reuse[nr] = Date.now() + TANK.try_missile.reuse;
			
		//bullet	
		var tmp = new Array();
		tmp['x'] = TANK.cx();
		tmp['y'] = TANK.cy();
		tmp['bullet_to_target'] = enemy;
		tmp['bullet_from_target'] = TANK;
		tmp['damage'] = TANK.try_missile.power;
		if(TANK.try_missile.pierce != undefined)	tmp['pierce_armor'] = 100;
		if(TANK.try_missile.angle == true)		tmp['angle'] = angle;
		if(TANK.try_missile.icon != undefined)	tmp['bullet_icon'] = TANK.try_missile.icon;
		if(TANK.try_missile.more != undefined)	tmp[TANK.try_missile.more[0]] = TANK.try_missile.more[1];
		BULLETS.push(tmp);
		
		//init reuse
		if(game_mode == 'single_craft' || game_mode == 'multi_craft'){
			var tmp = new Array();
			tmp['function'] = INFOBAR.draw_ability_reuse;
			tmp['duration'] = TANK.try_missile.reuse;
			tmp['type'] = 'REPEAT';
			tmp['nr'] = TANK.try_missile.ability_nr;	
			tmp['max'] = TANK.try_missile.reuse;
			tmp['tank'] = TANK;
			timed_functions.push(tmp);
			}
		
		delete TANK.try_missile;
		}
	this.do_auto_bomb = function(tank_id){	
		TANK = UNITS.get_tank_by_id(tank_id);
		if(TANK.try_bomb == undefined) return false;
		
		//find enemy with min hp
		var ENEMY_NEAR;
		var total_range = TANK.try_bomb.range + TANK.try_bomb.aoe*8/10;
		for (i in TANKS){				
			if(TANKS[i].team == TANK.team)	continue;	//same team
			if(TANKS[i].dead == 1)			continue;	//target dead
			if(TANKS[i].invisibility==1)		continue;	//blur mode
			if(TYPES[TANKS[i].type].type == "human")	continue;	//dont waste specials on soldiers
			
			//check
			distance = UNITS.get_distance_between_tanks(TANKS[i], TANK);
			if(distance > total_range) continue;	//target too far
			
			//range ok
			if(ENEMY_NEAR==undefined)
				ENEMY_NEAR = [TANKS[i].hp, i];
			else if(TANKS[i].hp < ENEMY_NEAR[0])
				ENEMY_NEAR = [TANKS[i].hp, i];
			}
		if(ENEMY_NEAR == undefined) return false;
		var enemy = TANKS[ENEMY_NEAR[1]];
		var mouseX = enemy.cx();
		var mouseY = enemy.cy();
	
		//control
		nr = TANK.try_bomb.ability_nr;
		if(TANK.abilities_reuse[nr] > Date.now() ) return false; //last check
		TANK.abilities_reuse[nr] = Date.now() + TANK.try_bomb.reuse;
		
		//bullet	
		var tmp = new Array();
		tmp['x'] = TANK.cx();
		tmp['y'] = TANK.cy();
		tmp['bullet_to_area'] = [mouseX, mouseY];
		tmp['bullet_from_target'] = TANK;
		tmp['damage'] = TANK.try_bomb.power;
		if(TANK.try_bomb.pierce != undefined)	tmp['pierce_armor'] = 100;
		if(TANK.try_bomb.icon != undefined)		tmp['bullet_icon'] = TANK.try_bomb.icon;
		if(TANK.try_bomb.more != undefined)		tmp[TANK.try_bomb.more[0]] = TANK.try_bomb.more[1];
		if(TANK.try_bomb.aoe != undefined){
			tmp['aoe_effect'] = 1;
			tmp['aoe_splash_range'] = TANK.try_bomb.aoe;
			}
		BULLETS.push(tmp);
		
		//init reuse
		if(game_mode == 'single_craft' || game_mode == 'multi_craft'){
			var tmp = new Array();
			tmp['function'] = INFOBAR.draw_ability_reuse;
			tmp['duration'] = TANK.try_bomb.reuse;
			tmp['type'] = 'REPEAT';
			tmp['nr'] = TANK.try_bomb.ability_nr;	
			tmp['max'] = TANK.try_bomb.reuse;
			tmp['tank'] = TANK;
			timed_functions.push(tmp);
			}
		
		delete TANK.try_bomb;
		}
	}
