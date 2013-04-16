//====== GENERAL ===============================================================

function Soldiers(TANK, descrition_only, settings_only, ai){	
	var reuse = 30000;
	var n = 3;
	
	//description
	if(descrition_only != undefined)
		return 'Send '+n+' soldiers to the fight once per '+round(reuse/1000)+'s.';
	//settings
	if(settings_only != undefined)
		return {reuse: reuse};
		
	//prepare
	TANK.abilities_reuse[1] = Date.now() + reuse;
	var type = '0';
	for(var t in TYPES){
		if(TYPES[t].name == 'Soldier')
			type = t;
		}
	var angle = 180;
	if(TANK.team != 'B')
		angle = 0;	
	
	//add
	for(var i=0; i<n; i++){
		x = round(TANK.x)-30+i*30;
		y = round(TANK.y);
		rand = TANK.rand;
		if(rand==undefined)
			rand = getRandomInt(1, 999999);
		id = 'bot'+TANK.team+(i+1)+":"+rand+":"+TANK.id;
		add_tank(TANK.level, id, '', type, TANK.team, x, y, angle, true, TANK, TANK.begin_time);
		added_tank = get_tank_by_id(id);
		added_tank.lifetime = Date.now() + reuse;	//will die
		}
	
	return reuse;
	}
function Range(TANK, descrition_only, settings_only, ai){
	if(descrition_only != undefined)
		return 'Tank range is increased. Passive ability.';
	}

//====== Heavy =================================================================

function Rest(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 5000;
	var power = 15 + 1 * (TANK.level-1);
	
	if(descrition_only != undefined)
		return 'Rest and try to repair yourself with '+(power*duration/1000)+' power.';
	if(settings_only != undefined)
		return {reuse: reuse};
	if(ai != undefined){
		var max_hp = TYPES[TANK.type].life[0]+TYPES[TANK.type].life[1]*(TANK.level-1);
		if(TANK.hp > max_hp/2) return false;
		}
	
	TANK.abilities_reuse[0] = Date.now() + reuse;
	if(TANK.extra_icon==undefined)
		TANK.extra_icon = [];
	TANK.extra_icon.push(['repair.png', 16, 16, TANK.id]);
	if(TANK.extra_hp==undefined)
		TANK.extra_hp = [];
	TANK.extra_hp.push([power,TANK.id]);
	TANK.speed = 0;
	
	//register stop function	
	var tmp = new Array();
	tmp['function'] = "Rest_stop";
	tmp['duration'] = duration;
	tmp['type'] = 'ON_END';
	tmp['tank'] = TANK;
	timed_functions.push(tmp);
	
	return reuse;
	}
function Shield(TANK, descrition_only, settings_only, ai){
	if(descrition_only != undefined)
		return 'Tank use heavy armor. Passive ability.';
	}
function Rest_stop(object){
	var TANK = object.tank;
	for (ii in TANK.extra_icon){
		if(TANK.extra_icon[ii][0] == 'repair.png')
			TANK.extra_icon.splice(ii, 1);	
		}
	for (jj in TANK.extra_hp){
		if(TANK.extra_hp[jj][1] == TANK.id)
			TANK.extra_hp.splice(jj, 1);	
		}
	TANK.speed = TYPES[TANK.type].speed;
	}

//====== Tiger =================================================================

function Berserk(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 5000;
	var power_speed = 5;
	var power_damage = 30;
	var power_armor = -40;
	
	if(descrition_only != undefined)
		return 'Increase damage by '+power_damage+'%, speed by '+power_speed+', but disable armor.';
	if(settings_only != undefined)
		return {reuse: reuse};
	if(ai != undefined){
		var max_hp = TYPES[TANK.type].life[0]+TYPES[TANK.type].life[1]*(TANK.level-1);
		if(TANK.hp < max_hp/2) return false;
		}
	
	TANK.abilities_reuse[0] = Date.now() + reuse;
	TANK.speed = TANK.speed + power_speed;
	TANK.damage = round(TANK.damage * (100+power_damage)/100);
	TANK.armor = TANK.armor + power_armor;
	if(TANK.armor<0) 	TANK.armor = 0;
	TANK.berserker = 1;
	
	//register stop function	
	var tmp = new Array();
	tmp['function'] = "Berserk_stop";
	tmp['duration'] = duration;
	tmp['type'] = 'ON_END';
	tmp['tank'] = TANK;
	timed_functions.push(tmp);
	
	return reuse;
	}
function Damage(TANK, descrition_only, settings_only, ai){
	if(descrition_only != undefined)
		return 'Tank do huge damage. Passive ability.';
	}
function Berserk_stop(object){
	var TANK = object.tank;
	TANK.speed = TYPES[TANK.type].speed;
	TANK.damage = TYPES[TANK.type].damage[0] + round(TYPES[TANK.type].damage[1]*(TANK.level-1));
	TANK.armor = TYPES[TANK.type].armor[0] + round(TYPES[TANK.type].armor[1]*(TANK.level-1));
	if(TANK.armor > TYPES[TANK.type].armor[2])
		TANK.armor = TYPES[TANK.type].armor[2];
	delete TANK.berserker;
	}

//====== Cruiser ===============================================================

function Turbo(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 4000;
	var power = 8;

	if(descrition_only != undefined)
		return 'Increase speed by '+power+' for 5s.';
	if(settings_only != undefined)
		return {reuse: reuse};
	
	TANK.abilities_reuse[0] = Date.now() + reuse;
	TANK.speed = TANK.speed + power;
	//register stop function	
	var tmp = new Array();
	tmp['function'] = "Turbo_stop";
	tmp['duration'] = duration;
	tmp['type'] = 'ON_END';
	tmp['tank'] = TANK;
	timed_functions.push(tmp);
	
	return reuse;
	}
function Repair(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 5000;
	var power = 12 + 1 * (TANK.level-1);
	var range = 80;
	
	if(descrition_only != undefined)
		return 'Slowly repair yourself and allies with '+(power*duration/1000)+' power.';
	if(settings_only != undefined)
		return {reuse: reuse};
	if(ai != undefined){
		var max_hp = TYPES[TANK.type].life[0]+TYPES[TANK.type].life[1]*(TANK.level-1);
		if(TANK.hp > max_hp/2) return false;
		}

	TANK.abilities_reuse[2] = Date.now() + reuse;
	var tank_size_from = TYPES[TANK.type].size[1]/2;
	for (ii in TANKS){
		if(TYPES[TANKS[ii].type].type == 'tower')		continue; //tower
		if(TANKS[ii].team != TANK.team)			continue; //enemy
		distance = get_distance_between_tanks(TANK, TANKS[ii]);
		if(distance > range)		continue;	//too far
		//add effect
		if(TANKS[ii].extra_icon==undefined)
			TANKS[ii].extra_icon = [];
		TANKS[ii].extra_icon.push(['repair.png', 16, 16, TANK.id]);
		if(TANKS[ii].extra_hp==undefined)
			TANKS[ii].extra_hp = [];
		TANKS[ii].extra_hp.push([power,TANK.id]);
		}
	//register stop function	
	var tmp = new Array();
	tmp['function'] = "Repair_stop";
	tmp['duration'] = duration;
	tmp['type'] = 'ON_END';
	tmp['tank'] = TANK;
	timed_functions.push(tmp);
	
	return reuse;
	}	
function Turbo_stop(object){
	var TANK = object.tank;
	TANK.speed = TYPES[TANK.type].speed;
	}
function Repair_stop(object){
	var TANK = object.tank;
	for (ii in TANKS){
		for (jj in TANKS[ii].extra_icon){
			if(TANKS[ii].extra_icon[jj][0] == 'repair.png' && TANK.id == TANKS[ii].extra_icon[jj][3]){
				TANKS[ii].extra_icon.splice(jj, 1);
				}
			}
		for (jj in TANKS[ii].extra_hp){
			if(TANKS[ii].extra_hp[jj][1] == TANK.id)
				TANKS[ii].extra_hp.splice(jj, 1);	
			}
		}
	}

//====== Launcher ==============================================================

function Mortar(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var power = 80 + 5 * (TANK.level-1);
	var range = 130;
	var splash_range = 70;
	
	if(descrition_only != undefined)
		return 'Launch missile with area damage of '+power+'.';
	if(settings_only != undefined)
		return {reuse: reuse};
		
	if(TANK.try_mortar != undefined){
		delete TANK.try_mortar;
 		mouse_click_controll = false;
		return 0;
		}
	
	mouse_click_controll = true;
	TANK['try_mortar'] = [range, splash_range, power, reuse];
		
	//return reuse - later, on use
	return 0;
	}
function Mortar_once(TANK){
	if(TANK.Mortar_loaded == 1) return false;
	if(TANK.abilities_lvl[0]==1)
		pre_draw_functions.push(['draw_mortar_marker', TANK.id]);
	if(TANK.abilities_lvl[0]==1)
		on_click_functions.push(['do_mortar', TANK.id]);
	TANK.Mortar_loaded = 1;
	}
function draw_mortar_marker(tank_id){
	TANK = get_tank_by_id(tank_id);
	//some drawings
	if(TANK.try_mortar != undefined && TANK.name == name){
		//TARGET
		img = new Image();
		img.src = '../img/target.png';
		canvas_main.drawImage(img, mouse_pos[0]-15, mouse_pos[1]-15);
		
		//circle
		canvas_main.beginPath();
		canvas_main.arc(mouse_pos[0], mouse_pos[1], TANK.try_mortar[1], 0 ,2*Math.PI, false);	
		canvas_main.lineWidth = 1;
		canvas_main.strokeStyle = "#c10000";
		canvas_main.stroke();
		}
	}
function do_mortar(tank_id, distance_ok, skip_broadcast){
	TANK = get_tank_by_id(tank_id);
	if(TANK.try_mortar == undefined) return false;
	if(TANK.name == name){
		mouseX = mouse_click_pos[0];
		mouseY = mouse_click_pos[1];
		}
	else{
		mouseX = TANK.mortyr_x;
		mouseY = TANK.mortyr_y;
		}
	var tank_size = TYPES[TANK.type].size[1]/2;
	
	if(distance_ok !== true){
		//get explosion position
		dist_x = mouseX - (TANK.x+tank_size);
		dist_y = mouseY - (TANK.y+tank_size);
		distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
		distance = distance - tank_size;
		if(distance > TANK.try_mortar[0]){
			//too far - move to target
			mouse_click_controll = false;
			if(game_mode == 2 && skip_broadcast !== true){
				//broadcast
				DATA = {
					function: '',
					fparam: [tank_id, true, true],
					tank_params: [
						{key: 'move', value: 1},
						{key: 'move_to', value: [mouseX-tank_size, mouseY-tank_size]},
						{key: 'reach_pos_and_execute', value: [TANK.try_mortar[0], 'do_mortar', mouseX, mouseY, tank_id]},
						{key: 'try_mortar', value: TANK['try_mortar']},
						{key: 'mortyr_x', value: mouse_click_pos[0]},
						{key: 'mortyr_y', value: mouse_click_pos[1]},
						],
					};
				register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
				delete TANK.try_mortar;
				}
			else{
				delete TANK.target_move_lock;
				TANK.move = 1;
				TANK.move_to = [mouseX-tank_size, mouseY-tank_size];
				TANK.reach_pos_and_execute = [TANK.try_mortar[0], 'do_mortar', mouseX, mouseY, tank_id];
				}
			return false;
			}
		}								
	//broadcast
	if(game_mode == 2 && skip_broadcast !== true){
		TANK.abilities_reuse[0] = Date.now() + TANK.try_mortar[3];
		DATA = {
			function: 'do_mortar',
			fparam: [tank_id, true, true],
			tank_params: [
				{key: 'try_mortar', value: TANK['try_mortar']},
				{key: 'mortyr_x', value: mouse_click_pos[0]},
				{key: 'mortyr_y', value: mouse_click_pos[1]},
				],
			};
		register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
		delete TANK.try_mortar;
		mouse_click_controll = false;
		return false;
		}
	
	//bullet	
	var tmp = new Array();
	tmp['x'] = TANK.x+tank_size;
	tmp['y'] = TANK.y+tank_size;
	tmp['bullet_to_area'] = [mouseX, mouseY];
	tmp['bullet_from_target'] = TANK;
	tmp['bullet_icon'] = 'bomb.png';
	tmp['aoe_effect'] = 1;
	tmp['aoe_splash_range'] = TANK.try_mortar[1];
	tmp['damage'] = TANK.try_mortar[2];
	tmp['pierce_armor'] = 1;
	BULLETS.push(tmp);

	//init reuse
	if(game_mode == 1 || TANK.name == name){
		TANK.abilities_reuse[0] = Date.now() + TANK.try_mortar[3];
		var tmp = new Array();
		tmp['function'] = "draw_ability_reuse";
		tmp['duration'] = TANK.try_mortar[3];
		tmp['type'] = 'REPEAT';
		tmp['nr'] = 0;	
		tmp['max'] = TANK.try_mortar[3];
		tmp['tank'] = TANK;
		timed_functions.push(tmp);
		}
	
	delete TANK.try_mortar;
	mouse_click_controll = false;	
	}

//====== Sniper ================================================================

function Camouflage(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 5000;
	var power_speed = 0.8;
	
	if(descrition_only != undefined)
		return 'Become invisible for '+(duration/1000)+'s. Speed is reduced by '+(100-power_speed*100)+'%';
	if(settings_only != undefined)
		return {reuse: reuse};
	if(ai != undefined){
		TANK.move = 0;
		}
	
	TANK.abilities_reuse[0] = Date.now() + reuse;
	TANK.invisibility = 1;
	TANK.speed = round(TANK.speed * power_speed);
	TANK.move = 0;
	delete TANK.target_shoot_lock;
	
	//register stop function	
	var tmp = new Array();
	tmp['function'] = "Camouflage_stop";
	tmp['duration'] = duration;
	tmp['type'] = 'ON_END';
	tmp['tank'] = TANK;
	timed_functions.push(tmp);
	
	return reuse;
	}
function Camouflage_stop(object){
	var TANK = object.tank;
	TANK.speed = TYPES[TANK.type].speed;
	delete TANK.invisibility;
	}

//====== Miner =================================================================

function Mine(TANK, descrition_only, settings_only, ai){
	var reuse = 10000;
	var power = 150 + 9 * (TANK.level-1);	
	var splash_range = 70;
	
	if(descrition_only != undefined)
		return 'Put mine with '+power+' power on the ground.';
	if(settings_only != undefined)
		return {reuse: reuse};
	
	//add
	TANK.abilities_reuse[0] = Date.now() + reuse;
	var tank_size_half = TYPES[TANK.type].size[1]/2;
	MINES.push({
		x: round(TANK.x+tank_size_half),
		y: round(TANK.y+tank_size_half),
		damage: power,
		splash_range: splash_range,
		team: TANK.team,
		tank_id: TANK.id,
		});
		
	return reuse;
	}
function SAM(TANK, descrition_only, settings_only, ai){
	var reuse = 10000;
	var power = 80 + 5 * (TANK.level-1);
	var range = 120;
	
	if(descrition_only != undefined)
		return 'Sends SAM missile with '+power+' power to nearest enemy.';
	if(settings_only != undefined)
		return {reuse: reuse};
	
	TANK.abilities_reuse[2] = Date.now() + reuse;
	//find nearest enemy
	var ENEMY_NEAR;
	for (i in TANKS){				
		if(TANKS[i].team == TANK.team)	continue;	//same team
		if(TANKS[i].dead == 1)			continue;	//target dead
		if(TANKS[i].invisibility==1)		continue;	//blur mode
		if(TYPES[TANKS[i].type].no_collisions == undefined)	continue;	//not flying unit
		
		//check
		distance = get_distance_between_tanks(TANKS[i], TANK);
		if(distance > range)			continue;	//target too far
		
		//range ok
		if(ENEMY_NEAR==undefined)
			ENEMY_NEAR = [range, i];
		else if(distance < ENEMY_NEAR[0])
			ENEMY_NEAR = [range, i];
		}
	
	//start missile
	if(ENEMY_NEAR != undefined){
		var enemy = TANKS[ENEMY_NEAR[1]];
		//find angle
		dist_x = enemy.x - TANK.x;
		dist_y = enemy.y - TANK.y;
		var radiance = Math.atan2(dist_y, dist_x);
		var angle = (radiance*180.0)/Math.PI+90;
		angle = round(angle);
			
		//bullet	
		var tmp = new Array();
		tmp['x'] = TANK.x+TYPES[TANK.type].size[1]/2;
		tmp['y'] = TANK.y+TYPES[TANK.type].size[1]/2;
		tmp['bullet_to_target'] = enemy;
		tmp['bullet_from_target'] = TANK;
		tmp['damage'] = power;
		tmp['pierce_armor'] = 1;
		tmp['angle'] = angle;
		tmp['bullet_icon'] = 'missle.png';
		BULLETS.push(tmp);
		}

	return reuse;
	}
function Mine_once(TANK){
	if(TANK.Mine_loaded == 1) return false;
	if(TANK.abilities_lvl[0]==1)
		pre_draw_functions.push(['draw_mines', TANK.id]);
	if(TANK.abilities_lvl[0]==1)
		pre_draw_functions.push(['check_mines', TANK.id]);
	TANK.Mine_loaded = 1;
	}
function draw_mines(tank_id){
	var tank = get_tank_by_id(tank_id);
	for(var i in MINES){
		if(MINES[i].team != MY_TANK.team) continue;	//enemy dont see it
		img = new Image();
		img.src = '../img/map/mine.png';
		canvas_main.drawImage(img, MINES[i].x-7+map_offset[0], MINES[i].y-7+map_offset[1]);
		}
	}
function check_mines(tank_id){
	var mine_size_half = 8;
	for(var m in MINES){
		for(var i in TANKS){
			if(TYPES[TANKS[i].type].name=='Miner') continue;	//they ignore it
			if(TYPES[TANKS[i].type].type=='human') continue;	//they don't weight enough
			if(TYPES[TANKS[i].type].no_collisions==1) continue;	//flying units dont care mines
			if(TANKS[i].dead == 1) continue;			//ghost
			var size = TYPES[TANKS[i].type].size[1];
			if(TANKS[i].x+size > MINES[m].x-mine_size_half && TANKS[i].x < MINES[m].x+mine_size_half){
				if(TANKS[i].y+size > MINES[m].y-mine_size_half && TANKS[i].y < MINES[m].y+mine_size_half){
					//explode
					var tank = get_tank_by_id(MINES[m].tank_id);
					var tmp = new Array();
					tmp['x'] = MINES[m].x;
					tmp['y'] = MINES[m].y;
					tmp['bullet_to_area'] = [MINES[m].x, MINES[m].y];
					tmp['bullet_from_target'] = tank;
					tmp['aoe_effect'] = 1;
					tmp['damage_all_teams'] = 1;
					tmp['aoe_splash_range'] = MINES[m].splash_range;
					tmp['damage'] =  MINES[m].damage;
					BULLETS.push(tmp);
		
					//delete mine
					MINES.splice(m, 1); m--;
					break;
					}
				}
			}
		}
	}

//====== Tech ==================================================================

function Virus(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var power = 70 + 4 * (TANK.level-1);	
	var duration = 5000;
	var range = 70;

	if(descrition_only != undefined)
		return 'Send virus to deactivate enemy and damage it with '+power+' power.';
	if(settings_only != undefined)
		return {reuse: reuse};
	
	if(TANK.try_stun != undefined){
		delete TANK.try_stun;
		mouse_click_controll = false;
		return 0;
		}
		
	mouse_click_controll = true;
	TANK['try_stun'] = [range, duration, reuse, power];
	
	//return reuse - later, on use
	return 0;
	}
function Mass_virus(TANK, descrition_only, settings_only, ai){
	var reuse = 40000;
	var power = 35 + 2 * (TANK.level-1);	
	var duration = 2000;
	var range = 40;

	if(descrition_only != undefined)
		return 'Send virus to all near enemies and damage it with '+power+' power.';
	if(settings_only != undefined)
		return {reuse: reuse};
	
	TANK.abilities_reuse[2] = Date.now() + reuse;
	var tank_size = TYPES[TANK.type].size[1]/2;	
	for (i in TANKS){				
		if(TANKS[i].team == TANK.team)	continue;	//same team
		if(TANKS[i].dead == 1)			continue;	//target dead
		
		//check
		distance = get_distance_between_tanks(TANKS[i], TANK);
		if(distance > range)			continue;	//target too far
		
		//bullet	
		var tmp = new Array();
		tmp['x'] = TANK.x+tank_size;
		tmp['y'] = TANK.y+tank_size;
		tmp['bullet_to_target'] = TANKS[i];
		tmp['bullet_from_target'] = TANK;
		tmp['damage'] = power;
		tmp['stun_effect'] = duration;
		BULLETS.push(tmp);
		}
		
	return reuse;
	}	
	
function Virus_once(TANK){
	if(TANK.Virus_loaded == 1) return false;
	if(TANK.abilities_lvl[0]==1)
		pre_draw_functions.push(['draw_virus_marker', TANK.id]);
	if(TANK.abilities_lvl[0]==1)
		on_click_functions.push(['do_stun', TANK.id]);
	TANK.Virus_loaded = 1;
	}
function draw_virus_marker(tank_id){
	TANK = get_tank_by_id(tank_id);
	//some drawings
	if(TANK['try_stun'] != undefined && TANK.name == name){
		img = new Image();
		img.src = '../img/target.png';
		canvas_main.drawImage(img, mouse_pos[0]-15, mouse_pos[1]-15);
		}
	}
function do_stun(tank_id, enemy_id, skip_broadcast){
	TANK = get_tank_by_id(tank_id);
	if(TANK.try_stun == undefined) return false;
	if(TANK.name == name){
		var mouseX = mouse_click_pos[0];
		var mouseY = mouse_click_pos[1];
		}
	else{
		mouseX = TANK.stun_x;
		mouseY = TANK.stun_y;
		}
	var tank_size = TYPES[TANK.type].size[1]/2;
		
	//find target
	if(enemy_id==undefined){
		if(TANK.team=='R')
			enemy = get_tank_by_coords(mouseX, mouseY, 'B', TANK);
		else
			enemy = get_tank_by_coords(mouseX, mouseY, 'R', TANK);
		if(enemy==false) return false;
		if(enemy.dead == 1) return false;
		if(enemy.invisibility == 1) return false;
		
		if(enemy.tmp_range > TANK.try_stun[0]){
			//too far - move to target
			mouse_click_controll = false;
			if(game_mode == 2 && skip_broadcast !== true){
				//broadcast
				DATA = {
					function: '',
					fparam: [tank_id, enemy_id, true],
					tank_params: [
						{key: 'target_move_lock', value: enemy.id},
						{key: 'move', value: 1},
						{key: 'move_to', value: [mouseX-tank_size, mouseY-tank_size]},
						{key: 'reach_tank_and_execute', value: [TANK.try_stun[0], 'do_stun', tank_id]},
						{key: 'try_stun', value: TANK['try_stun']},
						{key: 'stun_x', value: mouse_click_pos[0]},
						{key: 'stun_y', value: mouse_click_pos[1]},
						],
					};
				register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
				delete TANK.try_stun;
				}
			else{
				delete TANK.target_move_lock;
				TANK.target_move_lock = enemy.id;
				TANK.move = 1;
				TANK.move_to = [mouseX-tank_size, mouseY-tank_size];
				TANK.reach_tank_and_execute = [TANK.try_stun[0], 'do_stun', tank_id];
				}
			return false;
			}
		}
	else{
		enemy = get_tank_by_id(enemy_id);
		if(enemy===false) return false;
		}
		
	//broadcast
	if(game_mode == 2 && skip_broadcast !== true){
		TANK.abilities_reuse[0] = Date.now() + TANK.try_stun[2];
		DATA = {
			function: 'do_stun',
			fparam: [tank_id, enemy_id, true],
			tank_params: [
				{key: 'try_stun', value: TANK['try_stun']},
				{key: 'stun_x', value: mouse_click_pos[0]},
				{key: 'stun_y', value: mouse_click_pos[1]},
				],
			};
		register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
		delete TANK.try_stun;
		mouse_click_controll = false;
		return false;
		}
	
	//bullet	
	var tmp = new Array();
	tmp['x'] = TANK.x+tank_size;
	tmp['y'] = TANK.y+tank_size;
	tmp['bullet_to_target'] = enemy;
	tmp['bullet_from_target'] = TANK;
	tmp['damage'] = TANK.try_stun[3];
	tmp['stun_effect'] = TANK.try_stun[1];
	BULLETS.push(tmp);
	
	//init reuse
	if(game_mode == 1 || TANK.name == name){
		TANK.abilities_reuse[0] = Date.now() + TANK.try_stun[2];
		var tmp = new Array();
		tmp['function'] = "draw_ability_reuse";
		tmp['duration'] = TANK.try_stun[2];
		tmp['type'] = 'REPEAT';
		tmp['nr'] = 0;	
		tmp['max'] = TANK.try_stun[2];
		tmp['tank'] = TANK;
		timed_functions.push(tmp);
		}
	
	delete TANK.try_stun;
	mouse_click_controll = false;	
	}

//====== Truck =================================================================

function Soldiers_(TANK, descrition_only, settings_only, ai){
	var reuse = 30000;
	var n = 3;
	
	if(descrition_only != undefined)
		return 'Send '+n+' soldiers to the fight once per '+round(reuse/1000)+'s';
	if(settings_only != undefined)
		return {reuse: reuse};
		
	//prepare
	TANK.abilities_reuse[0] = Date.now() + reuse;
	var type = '0';
	for(var t in TYPES){
		if(TYPES[t].name == 'Soldier')
			type = t;
		}
	var angle = 180;
	if(TANK.team != 'B')
		angle = 0;
	
	//add
	for(var i=0; i<n; i++){
		x = round(TANK.x)-30+i*30;
		y = round(TANK.y);
		rand = TANK.rand;
		if(rand==undefined)
			rand = getRandomInt(1, 999999);
		id = 'bot'+TANK.team+(i+1)+":"+rand+":"+TANK.id;
		add_tank(TANK.level, id, '', type, TANK.team, x, y, angle, true, TANK);
		}
	
	return reuse;
	}

//====== Helicopter ============================================================

function Airstrike(TANK, descrition_only, settings_only, ai){
	var reuse = 10000;
	var power = 70 + 4 * (TANK.level-1);
	var range = 120;
	
	if(descrition_only != undefined)
		return 'Send 3 missiles with '+power+' power to the target.';
	if(settings_only != undefined)
		return {reuse: reuse};
	
	if(TANK.try_airstrike != undefined){
		delete TANK.try_airstrike;
		mouse_click_controll = false;
		return 0;
		}
	
	mouse_click_controll = true;
	TANK['try_airstrike'] = [range, power, reuse, reuse, 'airstrike.png'];
	
	//return reuse - later, on use
	return 0;
	}
function Sight(TANK, descrition_only, settings_only, ai){
	var reuse = 15000;
	var duration = 3000;
	var power = 50;
	
	if(descrition_only != undefined)
		return 'Increase sight by '+power+' for '+(duration/1000)+'s.';
	if(settings_only != undefined)
		return {reuse: reuse};
	
	TANK.sight = TYPES[TANK.type].scout + round(TYPES[TANK.type].size[1]/2) + power;
	
	//register stop function	
	var tmp = new Array();
	tmp['function'] = "Sight_stop";
	tmp['duration'] = duration;
	tmp['type'] = 'ON_END';
	tmp['tank'] = TANK;
	timed_functions.push(tmp);
	
	return reuse;
	}
function Sight_stop(object){
	var TANK = object.tank;
	TANK.sight = TYPES[TANK.type].scout + round(TYPES[TANK.type].size[1]/2);
	}
function Airstrike_once(TANK){
	if(TANK.Airstrike_loaded == 1) return false;
	if(TANK.abilities_lvl[0]==1)
		pre_draw_functions.push(['draw_airstrike_marker', TANK.id]);
	if(TANK.abilities_lvl[0]==1)
		on_click_functions.push(['do_airstrike', TANK.id]);
	TANK.Airstrike_loaded = 1;
	}
function draw_airstrike_marker(tank_id){
	TANK = get_tank_by_id(tank_id);
	//some drawings
	if(TANK['try_airstrike'] != undefined && TANK.name == name){
		img = new Image();
		img.src = '../img/target.png';
		canvas_main.drawImage(img, mouse_pos[0]-15, mouse_pos[1]-15);
		}
	}
function do_airstrike(tank_id, enemy_id, skip_broadcast){
	TANK = get_tank_by_id(tank_id);
	if(TANK.try_airstrike == undefined) return false;
	if(TANK.name == name){
		var mouseX = mouse_click_pos[0];
		var mouseY = mouse_click_pos[1];
		}
	else{
		mouseX = TANK.strike_x;
		mouseY = TANK.strike_y;
		}
	var tank_size = TYPES[TANK.type].size[1]/2;		

	//find target
	if(enemy_id==undefined){
		if(TANK.team=='R')
			enemy = get_tank_by_coords(mouseX, mouseY, 'B', TANK);
		else
			enemy = get_tank_by_coords(mouseX, mouseY, 'R', TANK);
		if(enemy==false) return false;
		if(enemy.dead == 1) return false;
		if(enemy.invisibility == 1) return false;
		
		if(enemy.tmp_range > TANK.try_airstrike[0]){
			//too far - move to target
			mouse_click_controll = false;
			if(game_mode == 2 && skip_broadcast !== true){
				//broadcast
				DATA = {
					function: '',
					fparam: [tank_id, enemy_id, true],
					tank_params: [
						{key: 'target_move_lock', value: enemy.id},
						{key: 'move', value: 1},
						{key: 'move_to', value: [mouseX-tank_size, mouseY-tank_size]},
						{key: 'reach_tank_and_execute', value: [TANK.try_airstrike[0], 'do_airstrike', tank_id]},
						{key: 'try_airstrike', value: TANK['try_airstrike']},
						{key: 'strike_x', value: mouse_click_pos[0]},
						{key: 'strike_y', value: mouse_click_pos[1]},
						],
					};
				register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
				delete TANK.try_airstrike;
				}
			else{
				delete TANK.target_move_lock;
				TANK.target_move_lock = enemy.id;
				TANK.move = 1;
				TANK.move_to = [mouseX-tank_size, mouseY-tank_size];
				TANK.reach_tank_and_execute = [TANK.try_airstrike[0], 'do_airstrike', tank_id];
				}
			return false;
			}
		}
	else{
		enemy = get_tank_by_id(enemy_id);
		if(enemy===false) return false;
		}	
	
	//find angle
	dist_x = enemy.x - TANK.x;
	dist_y = enemy.y - TANK.y;
	var radiance = Math.atan2(dist_y, dist_x);
	var angle = (radiance*180.0)/Math.PI+90;
	angle = round(angle);
		
	//broadcast
	if(game_mode == 2 && skip_broadcast !== true){
		TANK.abilities_reuse[0] = Date.now() + TANK.try_airstrike[2];
		DATA = {
			function: 'do_airstrike',
			fparam: [tank_id, enemy_id, true],
			tank_params: [
				{key: 'try_airstrike', value: TANK['try_airstrike']},
				{key: 'strike_x', value: mouse_click_pos[0]},
				{key: 'strike_y', value: mouse_click_pos[1]},
				],
			};
		register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
		delete TANK.try_airstrike;
		mouse_click_controll = false;
		return false;
		}
		
	//bullet	
	var tmp = new Array();
	tmp['x'] = TANK.x+tank_size;
	tmp['y'] = TANK.y+tank_size;
	tmp['bullet_to_target'] = enemy;
	tmp['bullet_from_target'] = TANK;
	tmp['damage'] = TANK.try_airstrike[1];
	tmp['pierce_armor'] = 1;
	tmp['angle'] = angle;
	tmp['bullet_icon'] = TANK.try_airstrike[4];
	BULLETS.push(tmp);
	
	//init reuse
	if(game_mode == 1 || TANK.name == name){
		TANK.abilities_reuse[0] = Date.now() + TANK.try_airstrike[2];
		var tmp = new Array();
		tmp['function'] = "draw_ability_reuse";
		tmp['duration'] = TANK.try_airstrike[2];
		tmp['type'] = 'REPEAT';
		tmp['nr'] = 0;	
		tmp['max'] = TANK.try_airstrike[2];
		tmp['tank'] = TANK;
		timed_functions.push(tmp);
		}
	
	delete TANK.try_airstrike;
	mouse_click_controll = false;	
	}

//====== Bomber ================================================================

function Bomb(TANK, descrition_only, settings_only, ai){
	var reuse = 15000;
	var power = 110 + 7 * (TANK.level-1);
	var range = 60;
	var splash_range = 70;

	if(descrition_only != undefined)
		return 'Drop powerfull bomb with area damage of '+power+'.';
	if(settings_only != undefined)
		return {reuse: reuse};
	
	if(TANK.try_bomb != undefined){
		delete TANK.try_bomb;
		mouse_click_controll = false;
		return 0;
		}
	
	mouse_click_controll = true;
	TANK['try_bomb'] = [range, splash_range, power, reuse];
		
	//return reuse - later, on use
	return 0;
	}
function Autopilot(TANK, descrition_only, settings_only, ai){
	var reuse = 500;
		
	if(descrition_only != undefined)
		return 'Turn autopilot on/off.';
	if(settings_only != undefined)
		return {reuse: reuse};
	if(ai != undefined)
		return false;
		
	TANK.abilities_reuse[3] = Date.now() + reuse;
	//auto
	if(ai != undefined)
		return false;
	
	if(TANK.use_AI == true){
		TANK.use_AI = false;
		TANK.move = 0;
		}
	else
		TANK.use_AI = true;
	
	return reuse;
	}
function Bomb_once(TANK){
	if(TANK.Bomb_loaded == 1) return false;
	if(TANK.abilities_lvl[0]==1)
		pre_draw_functions.push(['draw_bomb_marker', TANK.id]);
	if(TANK.abilities_lvl[0]==1)
		on_click_functions.push(['do_bomb', TANK.id]);
	TANK.Bomb_loaded = 1;
	}
function draw_bomb_marker(tank_id){
	TANK = get_tank_by_id(tank_id);
	//some drawings
	if(TANK.try_bomb != undefined && TANK.name == name){
		//target
		img = new Image();
		img.src = '../img/target.png';
		canvas_main.drawImage(img, mouse_pos[0]-15, mouse_pos[1]-15);
		
		//circle
		canvas_main.beginPath();
		canvas_main.arc(mouse_pos[0], mouse_pos[1], TANK.try_bomb[1], 0 ,2*Math.PI, false);	
		canvas_main.lineWidth = 1;
		canvas_main.strokeStyle = "#c10000";
		canvas_main.stroke();
		}
	}
function do_bomb(tank_id, distance_ok, skip_broadcast){
	TANK = get_tank_by_id(tank_id);
	if(TANK.try_bomb == undefined) return false;
	if(TANK.name == name){
		mouseX = mouse_click_pos[0];
		mouseY = mouse_click_pos[1];
		}
	else{
		mouseX = TANK.bomb_x;
		mouseY = TANK.bomb_y;
		}
	var tank_size = TYPES[TANK.type].size[1]/2;

	if(distance_ok !== true){
		//get explosion position
		dist_x = mouseX - (TANK.x+tank_size);
		dist_y = mouseY - (TANK.y+tank_size);
		distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
		distance = distance - tank_size;
		if(distance > TANK.try_bomb[0]){
			//too far - move to target
			mouse_click_controll = false;
			if(game_mode == 2 && skip_broadcast !== true){
				//broadcast
				DATA = {
					function: '',
					fparam: [tank_id, true, true],
					tank_params: [
						{key: 'move', value: 1},
						{key: 'move_to', value: [mouseX-tank_size, mouseY-tank_size]},
						{key: 'reach_pos_and_execute', value: [TANK.try_bomb[0], 'do_bomb', mouseX, mouseY, tank_id]},
						{key: 'try_bomb', value: TANK['try_bomb']},
						{key: 'bomb_x', value: mouse_click_pos[0]},
						{key: 'bomb_y', value: mouse_click_pos[1]},
						],
					};
				register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
				delete TANK.try_bomb;
				}
			else{
				delete TANK.target_move_lock;
				TANK.move = 1;
				TANK['move_to'] = [mouseX-tank_size, mouseY-tank_size];
				TANK.reach_pos_and_execute = [TANK.try_bomb[0], 'do_bomb', mouseX, mouseY, tank_id];
				}
			return false;
			}
		}
	//broadcast
	if(game_mode == 2 && skip_broadcast !== true){
		TANK.abilities_reuse[0] = Date.now() + TANK.try_bomb[3];
		DATA = {
			function: 'do_bomb',
			fparam: [tank_id, true, true],
			tank_params: [
				{key: 'try_bomb', value: TANK['try_bomb']},
				{key: 'bomb_x', value: mouse_click_pos[0]},
				{key: 'bomb_y', value: mouse_click_pos[1]},
				],
			};
		register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
		delete TANK.try_bomb;
		mouse_click_controll = false;
		return false;
		}
	
	//bullet	
	var tmp = new Array();
	tmp['x'] = TANK.x+tank_size;
	tmp['y'] = TANK.y+tank_size;
	tmp['bullet_to_area'] = [mouseX, mouseY];
	tmp['bullet_from_target'] = TANK;
	tmp['bullet_icon'] = 'bomb.png';
	tmp['aoe_effect'] = 1;
	tmp['aoe_splash_range'] = TANK.try_bomb[1];
	tmp['damage'] = TANK.try_bomb[2];
	tmp['pierce_armor'] = 1;
	BULLETS.push(tmp);
	
	//init reuse
	if(game_mode == 1 || TANK.name == name){
		TANK.abilities_reuse[0] = Date.now() + TANK.try_bomb[3];
		var tmp = new Array();
		tmp['function'] = "draw_ability_reuse";
		tmp['duration'] = TANK.try_bomb[3];
		tmp['type'] = 'REPEAT';
		tmp['nr'] = 0;	
		tmp['max'] = TANK.try_bomb[3];
		tmp['tank'] = TANK;
		timed_functions.push(tmp);
		}
	
	delete TANK.try_bomb;
	mouse_click_controll = false;	
	}

//==============================================================================
