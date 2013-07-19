var AI = new AI_CLASS();

function AI_CLASS(){
	var silo_n = 5;	//max silos around crystal
	var mechanic_m = 3;	//mechanic count
	var combat_unit = 'Apache';	//main comabar unit
	var crystal;	//active nearest crystal
	var enemy_base;	//nearest
	var base;	//our base
	var silos_around = 0;	//silos count around active crystal
	var min_attack_group = 4;
	
	this.check_path_AI = function(TANK){
		if((game_mode == 'multi_quick' || game_mode == 'multi_craft') && TANK.master.id != MY_TANK.id) return false;
		if(TANK.id == MY_TANK.id) return false;
		if(TANK.ai_reuse - Date.now() > 0) return false;	//wait for reuse
		if(game_mode == 'single_craft')
			return AI.advanced_ai_actions(TANK);
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
		if(TANK.last_bullet_time + 1200 - Date.now() > 0){
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
		};
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
		};
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
		};
	this.try_skills = function(TANK_AI){
		if(game_mode == 'single_craft' || game_mode == 'multi_craft'){
			var n_s = UNITS.get_selected_count(TANK_AI.team);
			if(n_s == 1 && TANK_AI.id == MY_TANK.id) return false;
			}
		for(i in TYPES[TANK_AI.type].abilities){
			var nr = 1+parseInt(i);
			var ability_function = TYPES[TANK_AI.type].abilities[i].name.replace(/ /g,'_');
			//if(TYPES[TANK_AI.type].abilities[i].broadcast == 2 && (game_mode == 'multi_quick' || game_mode == 'multi_craft')) continue;
			if(TYPES[TANK_AI.type].abilities[i].passive == true) continue;
			if(TANK_AI.abilities_reuse[nr-1] > Date.now() ) continue;
			var reuse = 0;
			try{
				//execute
				reuse = SKILLS[ability_function](TANK_AI, undefined, undefined, true);
				if(reuse !== false)
					break;
				}
			catch(err){
				console.log("AI error: "+err.message);
				}
			if(reuse != 0){
				TANK_AI.abilities_reuse[nr-1] = Date.now() + reuse;
				TANK_AI.abilities_reuse_max[nr-1] = reuse;
				}
			}
		//check if missle or bomb ready
		if(TANK_AI.dead == undefined){
			AI.do_auto_missile(TANK_AI.id);
			AI.do_auto_bomb(TANK_AI.id);
			}
		};
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
		};
	this.do_auto_missile = function(tank_id, enemy_id, skip_broadcast){
		TANK = UNITS.get_tank_by_id(tank_id);
		if(TANK.try_missile == undefined) return false;
		
		nr = TANK.try_missile.ability_nr;
		if(TANK.abilities_reuse[nr] > Date.now() ) return false; //reuse
		
		if(enemy_id == undefined){
			//find enemy with min hp
			var ENEMY_NEAR;
			for (i in TANKS){				
				if(TANKS[i].team == TANK.team) continue; //same team
				if(TANKS[i].dead == 1) continue; //target dead
				if(TANKS[i].invisibility==1) continue; //blur mode
				if(TYPES[TANKS[i].type].type == "human") continue; //dont waste specials on soldiers
				
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
			}
		else{
			enemy = UNITS.get_tank_by_id(enemy_id);
			if(enemy===false) return false;
			}
		
		//broadcast
		if((game_mode == 'multi_quick' || game_mode == 'multi_craft') && skip_broadcast !== true && TANK.nation == MY_TANK.nation){
			DATA = {
				function: 'do_auto_missile',
				ai: true,
				fparam: [tank_id, enemy.id, true],
				tank_params: [
					{key: 'try_missile', value: TANK.try_missile},
					],
				};
			MP.register_tank_action('skill_advanced', opened_room_id, tank_id, DATA);
			delete TANK.try_missile;
			return false;
			}
		
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
		TANK.abilities_reuse_max[nr] = TANK.try_missile.reuse;
		
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
		
		delete TANK.try_missile;
		};
	this.do_auto_bomb = function(tank_id, distance_ok, skip_broadcast){	
		TANK = UNITS.get_tank_by_id(tank_id);
		if(TANK.try_bomb == undefined) return false;
		
		nr = TANK.try_bomb.ability_nr;
		if(TANK.abilities_reuse[nr] > Date.now() ) return false; //reuse
		
		if(distance_ok !== true){
			//find enemy with min hp
			var ENEMY_NEAR;
			var total_range = TANK.try_bomb.range + TANK.try_bomb.aoe*8/10;
			for (i in TANKS){				
				if(TANKS[i].team == TANK.team) continue; //same team
				if(TANKS[i].dead == 1) continue; //target dead
				if(TANKS[i].invisibility==1) continue; //blur mode
				if(TYPES[TANKS[i].type].type == "human") continue; //dont waste specials on soldiers
				
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
			}
		else{
			mouseX = TANK.bomb_x;
			mouseY = TANK.bomb_y;
			}
		
		//broadcast
		if((game_mode == 'multi_quick' || game_mode == 'multi_craft') && skip_broadcast !== true && TANK.nation == MY_TANK.nation){
			DATA = {
				function: 'do_auto_bomb',
				ai: true,
				fparam: [tank_id, true, true],
				tank_params: [
					{key: 'try_bomb', value: TANK.try_bomb},
					{key: 'bomb_x', value: mouseX},
					{key: 'bomb_y', value: mouseY},
					],
				};
			MP.register_tank_action('skill_advanced', opened_room_id, TANK.id, DATA);
			delete TANK.try_bomb;
			return false;
			}
	
		//control
		nr = TANK.try_bomb.ability_nr;
		if(TANK.abilities_reuse[nr] > Date.now() ) return false; //last check
		TANK.abilities_reuse[nr] = Date.now() + TANK.try_bomb.reuse;
		TANK.abilities_reuse_max[nr] = TANK.try_bomb.reuse;
		
		//bullet	
		var tmp = new Array();
		tmp['x'] = TANK.cx();
		tmp['y'] = TANK.cy();
		tmp['bullet_to_area'] = [mouseX, mouseY];
		tmp['bullet_from_target'] = TANK;
		tmp['damage'] = TANK.try_bomb.power;
		if(TANK.try_bomb.pierce != undefined)	tmp['pierce_armor'] = 100;
		if(TANK.try_bomb.icon != undefined)	tmp['bullet_icon'] = TANK.try_bomb.icon;
		if(TANK.try_bomb.more != undefined)	tmp[TANK.try_bomb.more[0]] = TANK.try_bomb.more[1];
		if(TANK.try_bomb.aoe != undefined){
			tmp['aoe_effect'] = 1;
			tmp['aoe_splash_range'] = TANK.try_bomb.aoe;
			}
		BULLETS.push(tmp);

		delete TANK.try_bomb;
		};
	//more advanced combat system
	this.advanced_ai_actions = function(TANK){
		
		//find bases
		for(var i in TANKS){
			if(TANKS[i].data.name != 'Base') continue;
			if(TANKS[i].team == TANK.team)
				base = TANKS[i];
			}
		var range_min = 999999;
		for(var i in TANKS){
			if(TANKS[i].data.name != 'Base') continue;
			if(TANKS[i].team == TANK.team) continue;
			
			range = UNITS.get_distance_between_tanks(TANKS[i], base);
			if(range < range_min){
				enemy_base = TANKS[i];
				range_min = range;
				}
			}
				
		//find nearest active crystal
		var min_range = 999999;
		for(var c in MAP_CRYSTALS){
			var dist_x = MAP_CRYSTALS[c].cx - base.cx();
			var dist_y = MAP_CRYSTALS[c].cy - base.cy();
			var distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
			if(distance < min_range && MAP_CRYSTALS[c].power > 0){
				crystal = MAP_CRYSTALS[c];
				min_range = distance;
				}
			}
		if(crystal != undefined && HEIGHT_MAP - crystal.cy < 200)
			crystal = undefined;	//to close to enemy line
			
		//make sure we have mechanics
		var Mechanic_n = 0;
		for(var i in TANKS){
			if(TANKS[i].team != TANK.team) continue;
			if(TANKS[i].data.name != 'Mechanic') continue;
			Mechanic_n++;
			}
		if(base.training != undefined)
			Mechanic_n += base.training.length;
		if(Mechanic_n < mechanic_m)
			SKILLS.Mechanic(base);
			
		AI.create_attack_units(TANK);
		AI.attack(TANK);
		AI.defend(TANK);
		AI.kill_empty_silos(TANK);

		if(TANK.data.name == 'Base') return false;	//base is for basic AI check
		
		//send guards near crystal
		if(TANK.data.name == 'Soldier' && crystal != undefined){
			TANK.move = 1;
			TANK.move_to = [
				crystal.cx + 0 +HELPER.getRandomInt(-50, 50), 
				crystal.cy + 50 +HELPER.getRandomInt(-50, 50)
				];
			TANK.ai_reuse = 5000+Date.now();	//3s pause
			return false;
			}
		
		//calc our silos around crystal
		silos_around = 0;
		for(var i in TANKS){
			if(TANKS[i].team != TANK.team) continue;
			if(TANKS[i].data.name != 'Silo') continue;
			if(TANKS[i].crystal == undefined) continue;
			silos_around++;
			}
		
		//add silo to nearest crystal
		if(TANK.data.name == 'Mechanic'){
			//validate mechanic
			if(TANK.do_construct != undefined){
				building = UNITS.get_tank_by_id(TANK.do_construct);
				if(building == false)
					delete TANK.do_construct;
				}
			if(TANK.do_construct != undefined || TANK.move == 1) return false; //mechanich in use

			if(AI.create_factories(TANK) === false) return false;
			if(AI.create_towers(TANK) === false) return false;
			if(AI.repair(TANK) === false) return false;
			if(AI.create_silos(TANK) === false) return false;
			}
		};
	this.create_factories = function(TANK){
		//count factories
		var factory_n = 0;
		for(var i in TANKS){
			if(TANKS[i].team != TANK.team) continue;
			if(TANKS[i].data.name != 'Factory') continue;
			factory_n++;
			}
		//create
		if(factory_n == 0 || factory_n == 1 && silos_around >= 4 || factory_n == 2){
			var fac_i = UNITS.get_type_index('Factory');
			yy = base.cy();
			xx = base.cx() + 100;
			var dx = -500;
			for(i=0; i < 10; i++){
				xx = base.cx() - 500 + i*100;
				if(UNITS.check_collisions(xx+TYPES[fac_i].size[1]/2, yy+TYPES[fac_i].size[1]/2, {type:fac_i}, true)==false)
					break;
				}
			
			TANK.try_construct = {
				cost: TYPES[fac_i].cost,
				reuse: 0,
				tank_type: fac_i,
				ability_nr: 0,
				auto_x: xx + TYPES[fac_i].size[1]/2,
				auto_y: yy + TYPES[fac_i].size[2]/2,
				};
			SKILLS.do_construct(TANK.id);
			return false;
			}
		};
	this.create_towers = function(TANK){
		//create towers near our base
		var towers_n = 0;
		for(var i in TANKS){
			if(TANKS[i].team != TANK.team) continue;
			if(TANKS[i].data.name != 'Tower' && TANKS[i].data.name != 'SAM_Tower') continue;
			distance = UNITS.get_distance_between_tanks(TANKS[i], base);
			if(distance > 200) continue;	//target too far
			towers_n++;
			}
		if(towers_n == 0 || (towers_n < 3 && silos_around >= 4)){
			var tower_i = UNITS.get_type_index('Tower');
			if(towers_n == 1)
				var tower_i = UNITS.get_type_index('SAM_Tower');	
			xx = base.cx();
			yy = base.cy();
			//move a little to enemy base
			dist_x = enemy_base.cx() - base.cx();
			dist_y = enemy_base.cy() - base.cy();
			distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
			radiance = Math.atan2(dist_y, dist_x);
			xx += Math.cos(radiance) * 200;
			yy += Math.sin(radiance) * 200;
			if(towers_n == 0)
				xx -= 50;
			if(towers_n == 2)
				xx += 50;
				
			TANK.try_construct = {
				cost: TYPES[tower_i].cost,
				reuse: 0,
				tank_type: tower_i,
				ability_nr: 0,
				auto_x: xx + TYPES[tower_i].size[1]/2,
				auto_y: yy + TYPES[tower_i].size[1]/2,
				};
			SKILLS.do_construct(TANK.id);
			return false;
			}
		//create towers near active crystal for defence
		if(crystal != undefined){
			var towers_n = 0;
			for(var i in TANKS){
				if(TANKS[i].team != TANK.team) continue;
				if(TANKS[i].data.name != 'Tower' && TANKS[i].data.name != 'SAM_Tower') continue;
				distance = UNITS.get_distance_between_tanks(TANKS[i], false, crystal.cx, crystal.cy);
				if(distance > 150) continue;	//target too far
				towers_n++;
				}
		if(towers_n < 2 && silos_around >= 3){
			var tower_i = UNITS.get_type_index('Tower');
			if(towers_n == 1)
				var tower_i = UNITS.get_type_index('SAM_Tower');	
			xx = crystal.cx-30;
			yy = crystal.cy+100;
			if(towers_n == 1)
				xx += 30;
			TANK.try_construct = {
				cost: TYPES[tower_i].cost,
				reuse: 0,
				tank_type: tower_i,
				ability_nr: 0,
				auto_x: xx + TYPES[tower_i].size[1]/2,
				auto_y: yy + TYPES[tower_i].size[1]/2,
				};
			SKILLS.do_construct(TANK.id);
			return false;
			}
			}
		};
	this.create_silos = function(TANK){
		if(silos_around < silo_n && crystal != undefined){
			var silo_i = UNITS.get_type_index('Silo');
			var silo_size = TYPES[silo_i].size[1];
			for(var i=TYPES[silo_i].size[1]; i < WIDTH_MAP-silo_size; i=i+silo_size){
				for(var j=TYPES[silo_i].size[1]; j < HEIGHT_MAP-silo_size; j=j+silo_size){
					var dist_x = crystal.cx - (i + TYPES[silo_i].size[1]/2);
					var dist_y = crystal.cy - (j + TYPES[silo_i].size[2]/2);
					var distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
					if(distance > CRYSTAL_RANGE) continue;	
					
					if(UNITS.check_collisions(i, j, {type:silo_i}, true)==true) continue;
					if(UNITS.check_collisions(i + TYPES[silo_i].size[1], j, {type:silo_i}, true)==true) continue;
					if(UNITS.check_collisions(i + TYPES[silo_i].size[1], j + TYPES[silo_i].size[2], {type:silo_i}, true)==true) continue;
					if(UNITS.check_collisions(i, j + TYPES[silo_i].size[2], {type:silo_i}, true)==true) continue;
					if(UNITS.check_collisions(i + TYPES[silo_i].size[1]/2, j + TYPES[silo_i].size[2]/2, {type:silo_i}, true)==true) continue;
					
					TANK.try_construct = {
						cost: TYPES[silo_i].cost,
						reuse: 0,
						tank_type: silo_i,
						ability_nr: 0,
						auto_x: i + TYPES[silo_i].size[1]/2,
						auto_y: j + TYPES[silo_i].size[1]/2,
						};
					SKILLS.do_construct(TANK.id);
					return false;
					}
				}
			}
		};
	this.kill_empty_silos = function(TANK){
		for(var i in TANKS){
			if(TANKS[i].team != TANK.team) continue;
			if(TANKS[i].data.name != 'Silo') continue;
			if(TANKS[i].crystal == undefined){
				UNITS.player_data[TANK.nation].he3 += round(TANKS[i].data.cost/2);
				UNITS.do_damage(TANK, TANKS[i], {damage: UNITS.get_tank_max_hp(TANKS[i]), pierce_armor: 100});
				}
			}
		};
	this.repair = function(TANK){
		var repair_total = 0;
		for(var i in TANKS){
			if(TANKS[i].team != TANK.team) continue;
			if(TANKS[i].do_repair == undefined) continue;
			repair_total++;
			}
		if(repair_total > 0) return true;	//other on this
		//try repair base
		base_max_hp = UNITS.get_tank_max_hp(base);
		if(base.hp < base_max_hp * 0.7){
			SKILLS.register_repair(TANK.id, base.id);
			}
		};
	this.create_attack_units = function(TANK){
		var type_i = UNITS.get_type_index(combat_unit);
		var duration = 30*1000;
		if(TYPES[type_i].type == 'human')
			duration = 20*1000;
		if(DEBUG == true) duration = 1000;
		
		//for each fabric
		for(var i in TANKS){	
			if(TANKS[i].team != TANK.team) continue;
			if(TANKS[i].data.name != 'Factory') continue;	
			if(TANKS[i].constructing != undefined) continue;	
			
			//check he3
			var unit_cost = TYPES[type_i].cost;
			unit_cost = UNITS.apply_buff(TANK, 'cost', unit_cost);
			if(UNITS.player_data[TANK.nation].he3 < unit_cost)
				return false;
			
			//check units
			var team_units = 0;
			for(var ii in TANKS){
				if(TANKS[ii].team != TANK.team) continue;
				if(TANKS[ii].data.name != 'tank') continue;
				if(TANKS[ii].data.type == 'building'){
					if(TANKS[ii].data.name == "Factory" && TANKS[ii].training != undefined)
						team_units = team_units + TANKS[ii].training.length;
					continue;
					}
				team_units++;
				}
			if(TANKS[i].training != undefined && TANKS[i].training.length >= 5) return false;
			if(team_units >= MAX_TEAM_TANKS) return false;
			UNITS.player_data[TANK.nation].he3 -= unit_cost;
			
			//check respawn buff
			for(var b in COUNTRIES[TANK.nation].buffs){
				var buff = COUNTRIES[TANK.nation].buffs[b];
				if(buff.name == "respawn"){
					if(buff.type == 'static')	duration = duration + buff.power;
					else				duration = duration * buff.power;
					}
				}
			if(duration < 1000) duration = 1000;
			
			if(TANKS[i].training == undefined)
				TANKS[i].training = new Array();
			TANKS[i].training.push({
				duration: duration,
				type: type_i,
				cost: unit_cost,
				});
			}
		};
	this.attack = function(TANK){
		var units = 0;
		for(var i in TANKS){
			if(TANKS[i].team != TANK.team) continue;
			if(TANKS[i].data.type != 'tank') continue;
			if(TANKS[i].data.name == 'Mechanic') continue;
			if(TANKS[i].move == 1) continue;
			if(TANKS[i].last_bullet_time + 1200 - Date.now() > 0) continue;
			
			units++;
			}
		//attack on base
		if(units >= min_attack_group){
			for(var i in TANKS){
				if(TANKS[i].team != TANK.team) continue;
				if(TANKS[i].data.type != 'tank') continue;
				if(TANKS[i].data.name == 'Mechanic') continue;
				if(TANKS[i].move == 1) continue;
				if(TANKS[i].last_bullet_time + 1200 - Date.now() > 0) continue;
				
				TANKS[i].target_move_lock = enemy_base.id;
				//TANKS[i].target_shoot_lock = enemy_base.id;
				}
			}
		//attack on enemy crystals
		
		//attack on enemy Factory
		
		};
	this.defend = function(TANK){
		
		};
	}
