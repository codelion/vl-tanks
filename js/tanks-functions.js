//====== Tiger =================================================================

function Blitzkrieg(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 5000;
	var power_speed = 1.2;
	var power_damage = 1.2 + 0.02* (TANK.abilities_lvl[0]-1);
	var power_armor = -100;
	
	if(descrition_only != undefined)
		return 'Attack with '+round(power_damage*100)+'% damage and '+round(power_speed*100)+'% speed, but no armor.';
	if(settings_only != undefined) return {reuse: reuse};
	if(ai != undefined){
		var max_hp = get_tank_max_hp(TANK);
		if(TANK.hp < max_hp/2) return false;
		}
	
	TANK.abilities_reuse[0] = Date.now() + reuse;
	//speed buff
	TANK.buffs.push({
		name: 'speed',
		power: power_speed,
		lifetime: Date.now()+duration,
		});
	//damage buff
	TANK.buffs.push({
		name: 'damage',
		power: power_damage,
		lifetime: Date.now()+duration,
		icon: 'alert',
		});
	//armor debuff
	TANK.buffs.push({
		name: 'shield',
		type: 'static',
		power: power_armor,
		lifetime: Date.now()+duration,
		});
	
	return reuse;
	}
function Frenzy(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 5000;
	var power = 2.05 + 0.05* (TANK.abilities_lvl[1]-1);
	var hp_level = 30;	//%
	
	if(descrition_only != undefined)
		return 'Increase damage by '+round((power-1)*100)+'% if hp lower then '+hp_level+'%.';
	if(settings_only != undefined) return {reuse: reuse};
	
	//check
	var max_hp = get_tank_max_hp(TANK);
	if(TANK.hp > max_hp*hp_level/100){ 
		TANK.abilities_reuse[1] = Date.now();
		return false;
		}						

	//do
	TANK.abilities_reuse[1] = Date.now() + reuse;
	//damage buff
	TANK.buffs.push({
		name: 'damage',
		power: power,
		lifetime: Date.now()+duration,
		icon: 'danger',
		});
	
	return reuse;
	}
function AA_Bullets(TANK, descrition_only, settings_only, ai){
	var power = 6 + (TANK.abilities_lvl[2]-1);
	
	if(descrition_only != undefined)
		return 'Use armor piercing bullets that decrease enemy armor by '+power+'%.';
	
	TANK.pierce_armor = power;
	
	//passive
	return 0;
	}
function AA_Bullets_once(TANK, descrition_only, settings_only, ai){
	var power = 6 + (TANK.abilities_lvl[2]-1);
	
	TANK.pierce_armor = power;
	}

//====== Heavy =================================================================

function Rest(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 5000;
	var power = 10 + 1 * (TANK.abilities_lvl[0]-1);
	var power_slow = 0;
	var power_weak = 0.5;
	
	if(descrition_only != undefined)
		return 'Rest and repair yourself with '+(power*duration/1000)+' power. Damage is decreased.';
	if(settings_only != undefined) return {reuse: reuse};
	if(ai != undefined){
		var max_hp = get_tank_max_hp(TANK);
		if(TANK.hp > max_hp/2) return false;
		}
	
	if(TYPES[TANK.type].name == "Heavy")
		TANK.abilities_reuse[0] = Date.now() + reuse;
	else if(TYPES[TANK.type].name == "Bomber")
		TANK.abilities_reuse[2] = Date.now() + reuse;
	
	//repair buff
	TANK.buffs.push({
		name: 'repair',
		power: power,
		lifetime: Date.now()+duration,
		icon: 'repair',
		});
	//speed debuff
	TANK.buffs.push({
		name: 'speed',
		power: power_slow,
		lifetime: Date.now()+duration,
		});
	//weak debuff
	TANK.buffs.push({
		name: 'damage',
		power: power_weak,
		lifetime: Date.now()+duration,
		});	
	return reuse;
	}
function Rage(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 7000;
	var power_damage = 1.30 + 0.02* (TANK.abilities_lvl[1]-1);
	var power_armor = -100;
	
	if(descrition_only != undefined)
		return 'Attack with increased damage by '+round((power_damage-1)*100)+'%, but disabled armor.';
	if(settings_only != undefined) return {reuse: reuse};
	if(ai != undefined) return false;
	
	TANK.abilities_reuse[1] = Date.now() + reuse;
	
	//armor debuff
	TANK.buffs.push({
		name: 'shield',
		type: 'static',
		power: power_armor,
		lifetime: Date.now()+duration,
		});
	//damage buff
	TANK.buffs.push({
		name: 'damage',
		power: power_damage,
		lifetime: Date.now()+duration,
		icon: 'alert',
		});
	
	return reuse;
	}	
function Health(TANK, descrition_only, settings_only, ai){
	var power = 1.1 + 0.01 * (TANK.abilities_lvl[2]-1);
	
	if(descrition_only != undefined)
		return 'Increase total health by '+round((power-1)*100)+'%.';
	
	//update health buff
	for(var b in TANK.buffs){
		if(TANK.buffs[b].name == 'health' && TANK.buffs[b].id == 'health_once')
			TANK.buffs[b].power = power;
		}
		
	//passive
	return 0;
	}
function Health_once(TANK, descrition_only, settings_only, ai){
	var power = 1.1 + 0.01 *(TANK.abilities_lvl[2]-1);
	if(power > 130) power = 130;		power = 1.2;
	
	//health buff
	TANK.buffs.push({
		name: 'health',
		power: power,
		id: 'health_once',
		});
	}

//====== Cruiser ===============================================================

function Turbo(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 3000 + 100 * (TANK.abilities_lvl[0]-1);
	var power = 1.17;

	if(descrition_only != undefined)
		return 'Increase speed by '+round((power-1)*100)+'% for '+round(duration/100)/10+'s.';
	if(settings_only != undefined) return {reuse: reuse};
	
	TANK.abilities_reuse[0] = Date.now() + reuse;
	//speed buff
	TANK.buffs.push({
		name: 'speed',
		power: power,
		icon: 'bolt',
		lifetime: Date.now()+duration,
		});
	
	return reuse;
	}
function Repair(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 5000;
	var power = 12 + 1 * (TANK.abilities_lvl[1]-1);
	var range = 80;
	
	if(descrition_only != undefined)
		return 'Slowly repair yourself and allies with '+(power*duration/1000)+' power.';
	if(settings_only != undefined) return {reuse: reuse};
	if(ai != undefined){
		//check allies
		var found = false;
		for (ii in TANKS){
			if(TYPES[TANKS[ii].type].type == 'building') continue; //building
			if(TANKS[ii].team != TANK.team) continue; //enemy
			if(TANKS[ii].dead == 1) continue; //dead
			distance = get_distance_between_tanks(TANK, TANKS[ii]);
			if(distance > range) continue; //too far
			var max_hp = get_tank_max_hp(TANKS[ii]);
			if(TANKS[ii].hp > max_hp*2/3) continue; //still has hp
			
			//check for unit already with heals
			var valid = true;
			for (b in TANKS[ii].buffs){
				if(TANKS[ii].buffs[b].name == 'repair'){
					if(TANKS[ii].hp > max_hp/3){
						valid = false;
						break;
						}
					}
				}
			if(valid==false) continue; //already have heal
			found = true;
			}
		if(found == false) return false;
		}

	TANK.abilities_reuse[1] = Date.now() + reuse;
	for (ii in TANKS){
		if(TYPES[TANKS[ii].type].type == 'building')	continue; //building
		if(TANKS[ii].team != TANK.team)			continue; //enemy
		distance = get_distance_between_tanks(TANK, TANKS[ii]);
		if(distance > range)		continue;	//too far
		
		var valid = true;
		if(TYPES[TANKS[i].type].name == 'Cruiser'){
			for (b in TANKS[i].buffs){
				if(TANKS[i].buffs[b].name == 'repair'){
					valid = false;
					break;
					}
				}
			}
		if(valid==false) continue;	//lets avoid exploits/immortality here		
		
		//add effect
		if(game_mode == 'single_quick' || game_mode == 'single_craft'){
			//repair buff
			TANKS[ii].buffs.push({
				name: 'repair',
				power: power,
				lifetime: Date.now()+duration,
				icon: 'repair',
				id: TANK.id,
				});
			}
		else{
			var params = [
				{key: 'buffs', 
					value: {
						name: 'repair',
						power: power,
						lifetime: Date.now()+duration,
						icon: 'repair',
						id: TANK.id,
						}
					},
				];
			send_packet('tank_update', [TANKS[ii].id, params]);
			}			
		}
	
	return reuse;
	}
function Boost(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 6000;
	var power = 1.1 + 0.01* (TANK.abilities_lvl[2]-1);
	var range = 80;
	
	if(descrition_only != undefined)
		return 'Inrease nearby allies damage by '+round(power*100-100)+'%.';
	if(settings_only != undefined) return {reuse: reuse};
	
	TANK.abilities_reuse[2] = Date.now() + reuse; 
	for (ii in TANKS){
		if(TYPES[TANKS[ii].type].type == 'building')	continue; //building
		if(TANKS[ii].team != TANK.team)			continue; //enemy
		distance = get_distance_between_tanks(TANK, TANKS[ii]);
		if(distance > range)		continue;	//too far
		//add effect
		if(game_mode == 'single_quick' || game_mode == 'single_craft'){
			//damage buff
			TANKS[ii].buffs.push({
				name: 'damage',
				power: power,
				lifetime: Date.now()+duration,
				icon: 'bonus',
				});
			}
		else{
			var params = [
				{key: 'buffs', 
					value: {
						name: 'damage',
						power: power,
						lifetime: Date.now()+duration,
						icon: 'bonus',
						}
					},
				];
			send_packet('tank_update', [TANKS[ii].id, params]);
			}			
		}
	
	return reuse;
	}		

//====== Launcher ==============================================================

function Missile(TANK, descrition_only, settings_only, ai){
	var reuse = 6000;
	var power = 50 + 4 * (TANK.abilities_lvl[0]-1);
	var range = 100;
	
	if(descrition_only != undefined)
		return 'Launch missile with damage of '+power+'.';
	if(settings_only != undefined) return {reuse: reuse};
	
	if(TANK.try_missile != undefined){
		delete TANK.try_missile;
		if(TANK.id == MY_TANK.id && ai == undefined){
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){	
		mouse_click_controll = true;
		target_range = 0;
		target_mode = ['target'];
		}
	//init
	TANK.try_missile = {
		range: range,
		power: power,
		reuse: reuse,
		icon: 'missle',
		angle: true,
		ability_nr: 0,
		};
	
	//return reuse - later, on use
	return 0;
	}
function Mortar(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var power = 50 + 6 * (TANK.abilities_lvl[1]-1);
	var range = 130;
	var splash_range = 45 + 1.8 * (TANK.abilities_lvl[1]-1);
	
	if(descrition_only != undefined)
		return 'Launch missile with area damage of '+power+'.';
	if(settings_only != undefined) return {reuse: reuse};
		
	if(TANK.try_bomb != undefined){
		delete TANK.try_bomb;
		if(TANK.id == MY_TANK.id && ai == undefined){
	 		mouse_click_controll = false;
	 		target_range=0;
			target_mode='';
	 		}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){
		mouse_click_controll = true;
		target_range = splash_range;
		target_mode = ['target'];
		}
	//init
	TANK.try_bomb = {
		range: range,
		aoe: splash_range,
		power: power,
		reuse: reuse,
		pierce: 1,
		icon: 'bomb',
		ability_nr: 1,
		};
		
	//return reuse - later, on use
	return 0;
	}
function MM_Missile(TANK, descrition_only, settings_only, ai){
	var reuse = 25000;
	var power = 42 + 8 * (TANK.abilities_lvl[2]-1);
	var range = 100;
	
	if(descrition_only != undefined)
		return 'Launch plasma shot with damage of '+power+'.';
	if(settings_only != undefined) return {reuse: reuse};
	
	if(TANK.try_missile != undefined){
		delete TANK.try_missile;
		if(TANK.id == MY_TANK.id && ai == undefined){
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){	
		mouse_click_controll = true;
		target_range = 0;
		target_mode = ['target'];
		}
	//init
	TANK.try_missile = {
		range: range,
		power: power,
		reuse: reuse,
		icon: 'plasma',
		angle: false,
		ability_nr: 2,
		};
	
	//return reuse - later, on use
	return 0;
	}
function Range(TANK, descrition_only, settings_only, ai){
	if(descrition_only != undefined)
		return 'Tank range is increased. Passive ability.';
	}

//====== Sniper ================================================================

function Strike(TANK, descrition_only, settings_only, ai){
	var reuse = 10000;
	var power = 50 + 7 * (TANK.abilities_lvl[0]-1);
	var range = 100;
	
	if(descrition_only != undefined)
		return 'Powerful shoot with damage of '+power+'. Ignore armor.';
	if(settings_only != undefined) return {reuse: reuse};
	
	if(TANK.try_missile != undefined){
		delete TANK.try_missile;
		if(TANK.id == MY_TANK.id && ai == undefined){
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){
		mouse_click_controll = true;
		target_range = 0;
		target_mode = ['target'];
		}
	//init
	TANK.try_missile = {
		range: range,
		power: power,
		reuse: reuse,
		ability_nr: 0,
		};
	
	//return reuse - later, on use
	return 0;
	}
function Camouflage(TANK, descrition_only, settings_only, ai){
	var reuse = 4000;
	var duration = 5000;
	var power_speed = 0.5 + 0.01 * (TANK.abilities_lvl[1]-1);
	var power_weak = 0.5
	if(power_speed > 1) power_speed = 1;
	var power_armor = -100;
	
	if(descrition_only != undefined){ 
		if(TANK.invisibility == undefined)
			return 'Camouflage youself. Damage reduced, speed reduced by '+round(100-power_speed*100)+'%.';
		else
			return 'Disable camouflage and restore full speed and damage.';	
		}
	if(settings_only != undefined) return {reuse: reuse};
	if(ai != undefined){
		if(TANK.invisibility == 1) return false;
		}
		
	TANK.abilities_reuse[1] = Date.now() + reuse;
	
	//check ranges
	if(TANK.id == MY_TANK.id || ai != undefined){
		for(var i in TANKS){
			if(TANKS[i].team == TANK.team) continue; //same team
			var distance = get_distance_between_tanks(TANKS[i], TANK);
			distance = distance + TANKS[i].width()/2;
			var min_range = TANKS[i].sight;
			//min_range = min_range - TANK.width()/2;
			if(TYPES[TANKS[i].type].flying == undefined && TYPES[TANKS[i].type].name != "Tower" && TYPES[TANKS[i].type].name != "Scout_Tower")
				min_range = INVISIBILITY_SPOT_RANGE * min_range / 100;
			if(distance < min_range){	
				return false;	//too close to somebody
				}
			}
		}
	
	//remove invisibility
	if(TANK.invisibility == 1){
		stop_camouflage(TANK);
		return reuse;
		}
	
	TANK.invisibility = 1;
	TANK.speed = round(TANK.speed * power_speed);
	//weak debuff
	TANK.buffs.push({
		name: 'damage',
		source: 'camouflage',
		power: power_weak,
		});
	//armor debuff
	TANK.buffs.push({
		name: 'shield',
		type: 'static',
		source: 'camouflage',
		power: power_armor,
		});
		
	return reuse;
	}
function stop_camouflage(TANK){
	TANK.speed = TYPES[TANK.type].speed;
	delete TANK.invisibility;
	
	//update buffs
	for(var b in TANK.buffs){
		if(TANK.buffs[b].name == 'damage' && TANK.buffs[b].source == 'camouflage'){
			TANK.buffs.splice(b, 1); b--;
			}
		}
	for(var b in TANK.buffs){
		if(TANK.buffs[b].name == 'shield' && TANK.buffs[b].source == 'camouflage'){
			TANK.buffs.splice(b, 1); b--;
			}
		}
	}

//====== Miner =================================================================

function Mine(TANK, descrition_only, settings_only, ai){
	var reuse = 10000;
	var power = 130 + 10 * (TANK.abilities_lvl[1]-1);	
	var splash_range = 45 + 0.8 * (TANK.abilities_lvl[1]-1);
	if(splash_range > 70) splash_range = 70; 
	
	if(descrition_only != undefined)
		return 'Put mine with '+power+' power on the ground.';
	if(settings_only != undefined) return {reuse: reuse};
	
	//add
	TANK.abilities_reuse[0] = Date.now() + reuse;
	MINES.push({
		x: round(TANK.cx()),
		y: round(TANK.cy()),
		damage: power,
		splash_range: splash_range,
		team: TANK.team,
		tank_id: TANK.id,
		});
		
	return reuse;
	}
function Explode(TANK, descrition_only, settings_only, ai){
	var reuse = 5000;
	var range = 45 + 0.8 * (TANK.abilities_lvl[1]-1);
	
	if(descrition_only != undefined)
		return 'Detonate nearby mines in '+range+' range. Are you ready?';
	if(settings_only != undefined) return {reuse: reuse};
	if(ai != undefined) return false;
	
	TANK.abilities_reuse[1] = Date.now() + reuse;
	var mine_size_half = 8;
	
	for(var m=0; m < MINES.length; m++){
		//get range
		dist_x = MINES[m].x + mine_size_half - TANK.cx();
		dist_y = MINES[m].y + mine_size_half - TANK.cy();
		distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
		distance = distance - TANK.width();
		if(distance > range) continue; // mine too far
		
		//explode
		var tank = get_tank_by_id(MINES[m].tank_id);
		var tmp = new Array();
		tmp['x'] = MINES[m].x;
		tmp['y'] = MINES[m].y;
		tmp['bullet_to_area'] = [MINES[m].x, MINES[m].y];
		tmp['bullet_from_target'] = tank;
		tmp['aoe_effect'] = 1;
		tmp['damage_all_teams'] = 1;
		tmp['ignore_planes'] = 1;
		tmp['aoe_splash_range'] = MINES[m].splash_range;
		tmp['damage'] =  MINES[m].damage;
		BULLETS.push(tmp);

		//delete mine
		MINES.splice(m, 1); m--;
		break;
		}
	
	return reuse;
	}
function SAM(TANK, descrition_only, settings_only, ai){
	var reuse = 10000;
	var power = 50 + 6 * (TANK.abilities_lvl[2]-1);
	var range = 120;
	
	if(descrition_only != undefined)
		return 'Send SAM missile with '+power+' power to nearest flying enemy.';
	if(settings_only != undefined) return {reuse: reuse};
	
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
		tmp['x'] = TANK.cx();
		tmp['y'] = TANK.cy();
		tmp['bullet_to_target'] = enemy;
		tmp['bullet_from_target'] = TANK;
		tmp['damage'] = power;
		tmp['pierce_armor'] = 100;
		tmp['angle'] = angle;
		tmp['bullet_icon'] = 'missle';
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
		draw_image(canvas_main, 'mine', MINES[i].x-7+map_offset[0], MINES[i].y-7+map_offset[1]);
		}
	}
var mines_check_reuse;
function check_mines(tank_id){	
	var mine_size_half = 8;
	
	if(mines_check_reuse - Date.now() > 0) return false;	//wait for reuse
	mines_check_reuse = Date.now() + 500;	
	
	for(var m=0; m < MINES.length; m++){
		for(var i in TANKS){
			if(TYPES[TANKS[i].type].name=='Miner') continue;	//they ignore it
			if(TYPES[TANKS[i].type].type != 'tank') continue;	//must be tank
			if(TYPES[TANKS[i].type].no_collisions==1) continue;	//flying units dont care mines
			if(TANKS[i].dead == 1) continue;			//ghost
			if((game_mode == 'single_quick' || game_mode == 'single_craft') && MINES[m].team == TANKS[i].team) continue;	//fix for all team suicide
			var sizew = TANKS[i].width();
			var sizeh = TANKS[i].height();
			if(TANKS[i].x+sizew > MINES[m].x-mine_size_half && TANKS[i].x < MINES[m].x+mine_size_half){
				if(TANKS[i].y+sizeh > MINES[m].y-mine_size_half && TANKS[i].y < MINES[m].y+mine_size_half){
					//explode
					var tank = get_tank_by_id(MINES[m].tank_id);
					var tmp = new Array();
					tmp['x'] = MINES[m].x;
					tmp['y'] = MINES[m].y;
					tmp['bullet_to_area'] = [MINES[m].x, MINES[m].y];
					tmp['bullet_from_target'] = tank;
					tmp['aoe_effect'] = 1;
					tmp['damage_all_teams'] = 1;
					tmp['ignore_planes'] = 1;
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
	var power = 50 + 6 * (TANK.abilities_lvl[0]-1);	
	var duration = 2000 + 105 * (TANK.abilities_lvl[0]-1);	
	if(duration > 4000) duration = 4000;
	var range = 70;

	if(descrition_only != undefined)
		return 'Send virus to deactivate enemy and damage it with '+power+' power.';
	if(settings_only != undefined) return {reuse: reuse};
	
	if(TANK.try_missile != undefined){
		delete TANK.try_missile;
		if(TANK.id == MY_TANK.id && ai == undefined){
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){
		mouse_click_controll = true;
		target_range = 0;
		target_mode = ['target'];
		}
	//init
	TANK.try_missile = {
		range: range,
		power: power,
		reuse: reuse,
		ability_nr: 0,
		more: ['stun_effect', duration],
		};
	
	//return reuse - later, on use
	return 0;
	}
function EMP_Bomb(TANK, descrition_only, settings_only, ai){
	var reuse = 25000;		
	var power = 0;	
	var duration = 2000 + 53 * (TANK.abilities_lvl[1]-1);	
	var range = 120;
	var splash_range = 45 + 1.8 * (TANK.abilities_lvl[1]-1);

	if(descrition_only != undefined)
		return 'An electromagnetic pulse that corrupts electronic equipments.';
	if(settings_only != undefined) return {reuse: reuse};
	
	if(TANK.try_bomb != undefined){
		delete TANK.try_bomb;
		if(TANK.id == MY_TANK.id && ai == undefined){
	 		mouse_click_controll = false;
	 		target_range=0;
			target_mode='';
	 		}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){
		mouse_click_controll = true;
		target_range = splash_range;
		target_mode = ['target'];
		}
	//init
	TANK.try_bomb = {
		range: range,
		aoe: splash_range,
		power: power,
		reuse: reuse,
		icon: 'plasma',
		ability_nr: 1,
		more: ['stun_effect', duration],
		};
		
	//return reuse - later, on use
	return 0;
	}	
function M7_Shield(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 2000 + 105*(TANK.abilities_lvl[2]-1);
	if(game_mode == 'single_craft' || game_mode == 'multi_craft')
		duration = 3000;
	var power = 5 + 0.5*(TANK.abilities_lvl[2]-1);
	var range = 80;
	
	if(descrition_only != undefined)
		return 'Increase shield by '+power+'% for allies for '+round(duration/100)/10+'s.';
	if(settings_only != undefined) return {reuse: reuse};
	
	TANK.abilities_reuse[2] = Date.now() + reuse;
	for (ii in TANKS){
		if(TYPES[TANKS[ii].type].type == 'building')	continue; //building
		if(TANKS[ii].team != TANK.team)			continue; //enemy
		distance = get_distance_between_tanks(TANK, TANKS[ii]);
		if(distance > range)		continue;	//too far
		//add effect
		if(game_mode == 'single_quick' || game_mode == 'single_craft'){
			//shield buff
			TANKS[ii].buffs.push({
				name: 'shield',
				type: 'static',
				power: power,
				lifetime: Date.now()+duration,
				icon: 'shield',
				});
			}
		else{
			var params = [
				{key: 'buffs', 
					value: {
						name: 'shield',
						type: 'static',
						power: power,
						lifetime: Date.now()+duration,
						icon: 'shield',
						}
					},
				];
			send_packet('tank_update', [TANKS[ii].id, params]);
			}			
		}
	
	return reuse;
	}

//====== Truck =================================================================

function Fire_bomb(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var power = 50 + 7 * (TANK.abilities_lvl[0]-1);
	var range = 80;
	var splash_range = 45 + 1.8 * (TANK.abilities_lvl[1]-1);
	
	if(descrition_only != undefined)
		return 'Drop Fire bomb with damage of '+power+'.';
	if(settings_only != undefined) return {reuse: reuse};
		
	if(TANK.try_bomb != undefined){
		delete TANK.try_bomb;
		if(TANK.id == MY_TANK.id && ai == undefined){
	 		mouse_click_controll = false;
	 		target_range=0;
			target_mode='';
	 		}
		return 0;
		}
	
	if(TANK.id == MY_TANK.id && ai == undefined){
		mouse_click_controll = true;
		target_range = splash_range;
		target_mode = ['target'];
		}
	//init
	TANK.try_bomb = {
		range: range,
		aoe: splash_range,
		power: power,
		reuse: reuse,
		icon: 'bomb',
		ability_nr: 0,
		};
		
	//return reuse - later, on use
	return 0;
	}
function Soldiers(TANK, descrition_only, settings_only, ai){
	var reuse = 35000 - 500 * (TANK.abilities_lvl[2]-1);
	var n = 2;
	
	if(descrition_only != undefined)
		return 'Send '+n+' elite soldiers to the battle once in '+round(reuse/1000)+'s.';
	if(settings_only != undefined) return {reuse: reuse};
	if(ai != undefined) return false;
		
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
		add_tank(TANK.level, id, '', type, TANK.team, TANK.nation, x, y, angle, false, TANK);
		added_tank = get_tank_by_id(id);
		added_tank.lifetime = Date.now() + reuse;	//will disappear later
		}
	
	return reuse;
	}
function Medicine(TANK, descrition_only, settings_only, ai){
	var reuse = 20000;
	var duration = 5000;
	var power = 10 + 1 * (TANK.abilities_lvl[2]-1);
	var range = 80;
	
	if(descrition_only != undefined)
		return 'Heal elite soldiers with '+(power*duration/1000)+' power.';
	if(settings_only != undefined) return {reuse: reuse};
	if(ai != undefined) return false;
	
	TANK.abilities_reuse[2] = Date.now() + reuse;
	for (ii in TANKS){
		if(TANKS[ii].master == undefined) continue; //not selite soldier
		if(TANKS[ii].master.id != TANK.id) continue; //not mine
		
		distance = get_distance_between_tanks(TANK, TANKS[ii]);
		if(distance > range)		continue;	//too far
		//add effect
		if(game_mode == 'single_quick' || game_mode == 'single_craft'){
			//repair buff
			TANKS[ii].buffs.push({
				name: 'repair',
				power: power,
				lifetime: Date.now()+duration,
				icon: 'repair',
				id: TANK.id,
				});
			}
		else{
			var params = [
				{key: 'buffs', 
					value: {
						name: 'repair',
						power: power,
						lifetime: Date.now()+duration,
						icon: 'repair',
						id: TANK.id,
						}
					},
				];
			send_packet('tank_update', [TANKS[ii].id, params]);
			}			
		}
	
	return reuse;
	}

//====== TRex ==================================================================

function Plasma(TANK, descrition_only, settings_only, ai){
	var reuse = 7000;
	var power = 60 + 7 * (TANK.abilities_lvl[0]-1);
	var duration_slow = 3000;
	var power_slow = 0.7 - 0.01 * (TANK.abilities_lvl[0]-1);
	var range = 40;
	
	if(descrition_only != undefined)
		return 'Powerful plasma shot with '+power+' power and '+round(100-power_slow*100)+'% slow effect.';
	if(settings_only != undefined) return {reuse: reuse};
	
	if(TANK.try_missile != undefined){
		delete TANK.try_missile;
		if(TANK.id == MY_TANK.id && ai == undefined){
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){
		mouse_click_controll = true;
		target_range = 0;
		target_mode = ['target'];
		}
	//init
	TANK.try_missile = {
		range: range,
		power: power,
		reuse: reuse,
		//pierce: 1,
		icon: 'plasma',
		angle: false,
		ability_nr: 0,
		more: ['slow_debuff', {name: 'speed', power: power_slow, duration: duration_slow}],
		};
	
	//return reuse - later, on use
	return 0;
	}
function Jump(TANK, descrition_only, settings_only, ai){
	var reuse = 10000;
	var range = 100 + 2.7 * (TANK.abilities_lvl[1]-1);
	if(game_mode == 'single_craft' || game_mode == 'multi_craft')
		range = 120;
	
	if(descrition_only != undefined)
		return 'Quick jump to free location with '+range+' range.';
	if(settings_only != undefined) return {reuse: reuse};
	if(ai != undefined) return false;
	
	if(TANK.try_jump != undefined){
		delete TANK.try_jump;
		if(TANK.id == MY_TANK.id && ai == undefined){
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){
		mouse_click_controll = true;
		target_range = 0;
		target_mode = ['target'];
		}
	//init
	TANK.try_jump = {
		range: range,
		reuse: reuse,
		ability_nr: 1,
		};
	
	//remove all bullets from it
	try{
		for (b = 0; b < BULLETS.length; b++){
			if(BULLETS[b].bullet_to_target != undefined && BULLETS[b].bullet_to_target.id == TANK.id){
				BULLETS.splice(b, 1); b--;
				}
			}
		}
	catch(err){console.log("Error: "+err.message);}
	
	//return reuse - later, on use
	return 0;
	}
function PL_Shield(TANK, descrition_only, settings_only, ai){
	var reuse = 15000;
	var duration = 3000 + 105*(TANK.abilities_lvl[2]-1);
	var power = 5 + 1*(TANK.abilities_lvl[2]-1);
	
	if(descrition_only != undefined)
		return 'Plasma shield that rises your armor by '+power+'% for '+round(duration/100)/10+'s.';
	if(settings_only != undefined) return {reuse: reuse};
	
	TANK.abilities_reuse[2] = Date.now() + reuse;
	//shield buff
	TANK.buffs.push({
		name: 'shield',
		type: 'static',
		power: power,
		lifetime: Date.now()+duration,
		icon: 'shield',
		});
		
	return reuse;
	}
function do_jump(tank_id, skip_broadcast){
	TANK = get_tank_by_id(tank_id);
	if(TANK.try_jump == undefined) return false;
	if((game_mode == 'single_quick' || game_mode == 'single_craft') && MAPS[level-1].ground_only != undefined) return false;
	if(TANK.id == MY_TANK.id){
		var mouseX = mouse_click_pos[0];
		var mouseY = mouse_click_pos[1];
		}
	else{
		var mouseX = TANK.jump_x;
		var mouseY = TANK.jump_y;
		}
	var tank_size_w = TANK.width()/2;		
	var tank_size_h = TANK.height()/2;
	
	dist_x = mouseX - TANK.cx();
	dist_y = mouseY - TANK.cy();
	distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
	var radiance = Math.atan2(dist_y, dist_x);
	if(distance < TANK.try_jump.range){
		var move_x = mouseX;
		var move_y = mouseY;
		}
	else{
		move_x = TANK.cx() + Math.floor(Math.cos(radiance)*TANK.try_jump.range);
		move_y = TANK.cy() + Math.floor(Math.sin(radiance)*TANK.try_jump.range);
		}
	dist_x = move_x - (TANK.cx());
	dist_y = move_y - (TANK.cy());
	radiance = Math.atan2(dist_y, dist_x);
	var angle = (radiance*180.0)/Math.PI+90;
		
	if(check_collisions(move_x, move_y, TANK)==true)
		return false;	//wrong place
	
	//broadcast
	if((game_mode == 'multi_quick' || game_mode == 'multi_craft') && skip_broadcast !== true){
		DATA = {
			function: 'do_jump',
			fparam: [tank_id, true],
			tank_params: [
				{key: 'try_jump', value: TANK.try_jump},
				{key: 'jump_x', value: mouse_click_pos[0]},
				{key: 'jump_y', value: mouse_click_pos[1]},
				],
			};
		register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
		delete TANK.try_jump;
		mouse_click_controll = false;
		target_range=0;
		target_mode='';
		return false;
		}
	
	//control
	nr = TANK.try_jump.ability_nr;
	if(TANK.abilities_reuse[nr] > Date.now() ) return false; //last check
	TANK.abilities_reuse[nr] = Date.now() + TANK.try_jump.reuse;
	
	//animation
	TANK.animations.push({
		name: 'jump',
		to_x: move_x - tank_size_w,
		to_y: move_y - tank_size_h,
		from_x: TANK.x,
		from_y: TANK.y,
		angle: angle,
		lifetime: Date.now() + 1000,
		duration: 1000,	
		});
	
	TANK.x = move_x - tank_size_w;
	TANK.y = move_y - tank_size_h;
	TANK.move = 0;
	TANK.angle = angle;
	TANK.fire_angle = angle;
	auto_scoll_map();
		
	//init reuse
	if((game_mode == 'single_quick' || game_mode == 'single_craft') || TANK.id == MY_TANK.id){
		var tmp = new Array();
		tmp['function'] = "draw_ability_reuse";
		tmp['duration'] = TANK.try_jump.reuse;
		tmp['type'] = 'REPEAT';
		tmp['nr'] = TANK.try_jump.ability_nr;	
		tmp['max'] = TANK.try_jump.reuse;
		tmp['tank'] = TANK;
		timed_functions.push(tmp);
		}
	
	delete TANK.try_jump;
	mouse_click_controll = false;
	target_range=0;
	target_mode='';
	}

//====== Apache ================================================================

function Airstrike(TANK, descrition_only, settings_only, ai){
	var reuse = 10000;
	var power = 60 + 7 * (TANK.abilities_lvl[0]-1);
	var range = 120;
	
	if(descrition_only != undefined)
		return 'Send 3 missiles with '+power+' power to the target.';
	if(settings_only != undefined) return {reuse: reuse};
	
	if(TANK.try_missile != undefined){
		delete TANK.try_missile;
		if(TANK.id == MY_TANK.id && ai == undefined){
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){
		mouse_click_controll = true;
		target_range = 0;
		target_mode = ['target'];
		}
	//init
	TANK.try_missile = {
		range: range,
		power: power,
		reuse: reuse,
		pierce: 1,
		icon: 'airstrike',
		angle: true,
		ability_nr: 0,
		};
	
	//return reuse - later, on use
	return 0;
	}
function Scout(TANK, descrition_only, settings_only, ai){	//multi
	var ability_nr = 1;
	if(TYPES[TANK.type].name == 'Stealth') ability_nr = 2;
	var reuse = 15000;
	var duration = 3000;
	var power = 50 + 2.7 * (TANK.abilities_lvl[ability_nr]-1);
	
	if(descrition_only != undefined)
		return 'Increase sight by '+power+' for '+(duration/1000)+'s.';
	if(settings_only != undefined) return {reuse: reuse};
	
	TANK.sight = TYPES[TANK.type].scout + round(TANK.width()/2) + power;
	
	TANK.abilities_reuse[ability_nr] = Date.now() + reuse;
		
	//check invisible enemies
	for(var i in TANKS){
		if(TANKS[i].invisibility != undefined && TANKS[i].team != TANK.team)
			check_invisibility(TANKS[i], true);
		}
	
	//register stop function
	setTimeout(function(){
		TANK.sight = TYPES[TANK.type].scout + round(TANK.width()/2);
		}, duration);
	
	return reuse;
	}

//====== Bomber ================================================================

function Bomb(TANK, descrition_only, settings_only, ai){
	var reuse = 15000;
	var power = 60 + 7 * (TANK.abilities_lvl[0]-1);
	var range = 60;
	var splash_range = 45 + 1.8 * (TANK.abilities_lvl[0]-1);

	if(descrition_only != undefined)
		return 'Drop powerful bomb with area damage of '+power+'.';
	if(settings_only != undefined) return {reuse: reuse};
	
	if(TANK.try_bomb != undefined){
		delete TANK.try_bomb;
		if(TANK.id == MY_TANK.id && ai == undefined){
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){
		mouse_click_controll = true;
		target_range = splash_range;
		target_mode = ['target'];
		}
	//init
	TANK.try_bomb = {
		range: range,
		aoe: splash_range,
		power: power,
		reuse: reuse,
		icon: 'bomb',
		ability_nr: 0,
		};
		
	//return reuse - later, on use
	return 0;
	}
function AA_bomb(TANK, descrition_only, settings_only, ai){
	var reuse = 10000;
	var power = 50 + 6 * (TANK.abilities_lvl[1]-1);
	var range = 90;

	if(descrition_only != undefined)
		return 'Drop single target anti-armor bomb with damage of '+power+'.';
	if(settings_only != undefined) return {reuse: reuse};
	
	if(TANK.try_missile != undefined){
		delete TANK.try_missile;
		if(TANK.id == MY_TANK.id && ai == undefined){
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			}
		return 0;
		}
	if(TANK.id == MY_TANK.id && ai == undefined){	
		mouse_click_controll = true;
		target_range = 0;
		target_mode = ['target'];
		}
	//init
	TANK.try_missile = {
		range: range,
		power: power,
		reuse: reuse,
		pierce: 1,
		icon: 'bomb',
		ability_nr: 1,
		};
	
	//return reuse - later, on use
	return 0;
	}

//====== Tower =================================================================

function Freak_out(TANK, descrition_only, settings_only, ai){
	var cost = 50;	cost = apply_buff(TANK, 'cost', cost);
	var power = 0.5;
	var reuse = 30000;
	var duration = 5000;
	
	if(descrition_only != undefined)
		return 'Increase tower attack speed by '+((1-power)*100)+'% for '+(duration/1000)+'s. Costs '+cost+' HE-3.';
	if(ai != undefined) return false;
	if(game_mode == 'single_quick' || game_mode == 'multi_quick') return false;
	if(settings_only != undefined) return {reuse: reuse};
	
	if(TANK.constructing != undefined) return false;
	if(HE3 < cost) return false;
	HE3 = HE3 - cost;
	
	TANK.abilities_reuse[0] = Date.now() + reuse;	
	//damage buff
	TANK.buffs.push({
		name: 'hit_reuse',
		power: power,
		lifetime: Date.now()+duration,
		icon: 'danger',
		});
		
	return reuse;
	}

//====== Base ==================================================================

function Factory(TANK, descrition_only, settings_only, ai){
	var reuse = 0;
	var tank_type = 'Factory';
	
	for(var i in TYPES){
		if(TYPES[i].name == tank_type) var tank_info = TYPES[i];
		}
	
	if(descrition_only != undefined){
		var cost = tank_info.cost;
		cost = apply_buff(TANK, 'cost', cost);
		return 'Construct factory to create land, air, defence units. Costs '+cost+' HE-3.';
		}
	if(ai != undefined) return false;
	if(game_mode == 'single_quick' || game_mode == 'multi_quick') return false;
	if(settings_only != undefined) return {reuse: reuse};
	
	construct_prepare(TANK, reuse, tank_type, 0);
	
	//return reuse - later, on use
	return 0;
	}
function Research(TANK, descrition_only, settings_only, ai){
	var reuse = 0;
	var tank_type = 'Research';
	
	for(var i in TYPES){
		if(TYPES[i].name == tank_type) var tank_info = TYPES[i];
		}
	
	if(descrition_only != undefined){
		var cost = tank_info.cost;
		cost = apply_buff(TANK, 'cost', cost);
		return 'Construct research station. Costs '+cost+' HE-3.';
		}
	if(ai != undefined) return false;
	if(game_mode == 'single_quick' || game_mode == 'multi_quick') return false;
	if(settings_only != undefined) return {reuse: reuse};
	
	construct_prepare(TANK, reuse, tank_type, 1);
		
	//return reuse - later, on use
	return 0;
	}
function Silo(TANK, descrition_only, settings_only, ai){
	var reuse = 100;
	var tank_type = 'Silo';
	
	for(var i in TYPES){
		if(TYPES[i].name == tank_type) var tank_info = TYPES[i];
		}
	
	if(descrition_only != undefined){
		var cost = tank_info.cost;
		cost = apply_buff(TANK, 'cost', cost);
		return 'Construct structure for storing Helium-3. Costs '+cost+' HE-3.';
		}
	if(ai != undefined) return false;
	if(game_mode == 'single_quick' || game_mode == 'multi_quick') return false;
	if(settings_only != undefined) return {reuse: reuse};
	
	construct_prepare(TANK, reuse, tank_type, 2);
		
	//return reuse - later, on use
	return 0;
	}
function construct_prepare(TANK, reuse, tank_type, ability_nr){
	for(var i in TYPES){
		if(TYPES[i].name == tank_type) var tank_info = TYPES[i];
		}
	var cost = tank_info.cost;
	cost = apply_buff(TANK, 'cost', cost);
	if(TANK.try_construct != undefined){
		delete TANK.try_construct;
		if(TANK.id == MY_TANK.id){
	 		mouse_click_controll = false;
	 		}
		return 0;
		}
	
	if(HE3 < cost){
		//message
		screen_message.text = "Not enough HE-3.";
		screen_message.time = Date.now() + 1000;
		return false;
		}
	
	//get type
	var type = 0;
	for(var t in TYPES){
		if(TYPES[t].name == tank_type){
			type = t;
			break;
			}
		}
	if(TANK.id == MY_TANK.id){
		mouse_click_controll = true;
		target_range = 0;
		target_mode = '';
		//hover f-tion
		var found = false;
		for(var f in pre_draw_functions)
			if(pre_draw_functions[0]=='construct_hover')
				found = true;
		if(found == false)
			pre_draw_functions.push(['construct_hover']);
		}
	//init
	TANK.try_construct = {
		cost: cost,
		reuse: reuse,
		tank_type: type,
		ability_nr: ability_nr,
		};
	}
	
function construct_hover(){
	if(MY_TANK.try_construct == undefined) return false;
	var type = MY_TANK.try_construct.tank_type;
	
	if(validate_construction(mouse_pos[0]-map_offset[0], mouse_pos[1]-map_offset[1])==true)
		canvas_main.fillStyle = "#576b35";
	else
		canvas_main.fillStyle = "#b12525";
	canvas_main.fillRect(mouse_pos[0]-round(TYPES[type].size[1]/2), mouse_pos[1]-round(TYPES[type].size[2]/2), 
		TYPES[type].size[1], TYPES[type].size[2]);
	var x = mouse_pos[0] - round(TYPES[type].size[1]/2) - map_offset[0];
	var y = mouse_pos[1] - round(TYPES[type].size[2]/2) - map_offset[1];
	draw_tank_clone(type, x, y, 0, 0.5, canvas_main);
	}
function validate_construction(xx, yy, show_errors){
	var type = MY_TANK.try_construct.tank_type;

	//check range
	var valid = false;
	for (i in TANKS){
		if(TYPES[TANKS[i].type].type == 'tank') continue;
		if(TANKS[i].team != MY_TANK.team) continue;
		if(TANKS[i].constructing != undefined) continue;

		dist_x = TANKS[i].cx() - (mouse_pos[0] - map_offset[0]);
		dist_y = TANKS[i].cy() - (mouse_pos[1] - map_offset[1]);
		var distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
		if(distance < TYPES[TANKS[i].type].scout + TYPES[type].scout + TANKS[i].width()/2 + TYPES[type].size[1]/2)
			valid = true;
		}
	if(valid == false){
		if(show_errors == true){
			screen_message.text = "Too far from your territory.";
			screen_message.time = Date.now() + 1000;
			}
		return false;
		}
	
	if(TYPES[type].name == 'Silo'){
		//find nearest resourse
		var min_distance = 999;
		var cc;
		for(var c in MAP_CRYSTALS){
			var dist_x = MAP_CRYSTALS[c].cx - (mouse_pos[0] - map_offset[0]);
			var dist_y = MAP_CRYSTALS[c].cy - (mouse_pos[1] - map_offset[1]);
			var distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
			if(distance < min_distance && MAP_CRYSTALS[c].power > 0){
				min_distance = distance;
				cc = c;
				}
			}
		//dashed line
		canvas_main.lineWidth = 2;
		canvas_main.strokeStyle = "#363737";
		canvas_main.dashedLine(mouse_pos[0] , mouse_pos[1] , MAP_CRYSTALS[cc].cx+map_offset[0], MAP_CRYSTALS[cc].cy+map_offset[1]);
		
		//check range
		if(min_distance > CRYSTAL_RANGE){
			if(show_errors == true){
				screen_message.text = "No He-3 in this territory.";
				screen_message.time = Date.now() + 1000;
				}
			return false;
			}
		//check CRYSTAL_THREADS
		var n = 0;
		for (i in TANKS){
			if(TYPES[TANKS[i].type].name != 'Silo') continue;
			var dist_x = MAP_CRYSTALS[cc].cx - TANKS[i].cx();
			var dist_y = MAP_CRYSTALS[cc].cy - TANKS[i].cy();
			var distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
			if(distance < CRYSTAL_RANGE)
				n++;
			}
		if(n >= CRYSTAL_THREADS){
			if(show_errors == true){
				screen_message.text = "Too many silos near this crystal.";
				screen_message.time = Date.now() + 1000;
				}
			return false;
			}
		}
		
	//check collisions
	var valid = true;
	if(check_collisions(xx, yy, {type:type}, true)==true) valid = false;
	if(check_collisions(xx - TYPES[type].size[1]/2, yy - TYPES[type].size[2]/2, {type:type}, true)==true) valid = false;
	if(check_collisions(xx - TYPES[type].size[1]/2, yy + TYPES[type].size[2]/2, {type:type}, true)==true) valid = false;
	if(check_collisions(xx + TYPES[type].size[1]/2, yy - TYPES[type].size[2]/2, {type:type}, true)==true) valid = false;
	if(check_collisions(xx + TYPES[type].size[1]/2, yy + TYPES[type].size[2]/2, {type:type}, true)==true) valid = false;
	if(valid == false){
		if(show_errors == true){
			screen_message.text = "This territory already used.";
			screen_message.time = Date.now() + 1000;
			}
		return false;
		}
	
	return true;
	}

//====== Factory ===============================================================	

function War_units(TANK, descrition_only, settings_only, ai){
	if(descrition_only != undefined)
		return 'Construct land or air unit.';
	if(settings_only != undefined) return {};
	
	//passive
	return 0;
	}
function Towers(TANK, descrition_only, settings_only, ai){
	if(descrition_only != undefined)
		return 'Construct various towers.';
	if(settings_only != undefined) return {};
	
	//passive
	return 0;
	}

//====== Research ==============================================================

function Weapons(TANK, descrition_only, settings_only, ai){
	var power = 10; //%
	var level = weapons_bonus/power;
	var cost = 100*(level+1);
	var reuse = 180*1000;							reuse = 5000;
	var levels = 3;
	var active = true;
	if(weapons_bonus >= power * levels) active = false;
	cost = apply_buff(TANK, 'cost', cost);
	
	if(descrition_only != undefined){
		if(level < levels)
			return 'Upgrade units weapons. Costs '+cost+' HE-3.';
		else
			return 'Upgrade units weapons. Max level.';
		}
	if(ai != undefined) return false;
	if(game_mode == 'single_quick' || game_mode == 'multi_quick') return false;
	if(settings_only != undefined) 
		return {
			reuse: reuse, 
			power: power, 
			active: active,
			level: level,
			};
	
	if(TANK.constructing != undefined) return false;
	if(weapons_bonus >= power * levels) return false;
	if(HE3 < cost){ 
		screen_message.text = "Not enough HE-3.";
		screen_message.time = Date.now() + 1000;
		return false;
		}
	HE3 = HE3 - cost;
	
	//register effect
	setTimeout(function(){
		weapons_bonus = weapons_bonus + power;
		}, reuse);
	
	return reuse;
	}
function Armor(TANK, descrition_only, settings_only, ai){
	var power = 5; //static
	var level = armor_bonus/power;
	var cost = 100*(level+1);
	var reuse = 180*1000;							reuse = 1000;
	var levels = 3;
	var active = true;
	if(armor_bonus >= power * levels) active = false;
	cost = apply_buff(TANK, 'cost', cost);
	
	if(descrition_only != undefined){
		if(level < levels)
			return 'Upgrade units armor. Costs '+cost+' HE-3.';
		else
			return 'Upgrade units weapons. Max level.';
		}
	if(ai != undefined) return false;
	if(game_mode == 'single_quick' || game_mode == 'multi_quick') return false;
	if(settings_only != undefined)
		return {
			reuse: reuse, 
			power: power, 
			active: active,
			level: level,
			};
	
	if(TANK.constructing != undefined) return false;
	if(armor_bonus >= power * levels) return false;
	if(HE3 < cost){ 
		screen_message.text = "Not enough HE-3.";
		screen_message.time = Date.now() + 1000;
		return false;
		}
	HE3 = HE3 - cost;
	
	//register effect
	setTimeout(function(){
		armor_bonus = armor_bonus + power;
		}, reuse);
	
	return reuse;
	}

//====== General ===============================================================

function do_missile(tank_id, enemy_id, skip_broadcast){
	TANK = get_tank_by_id(tank_id);
	if(TANK.try_missile == undefined) return false;
	if(TANK.name == name || ((game_mode == 'single_craft' || game_mode == 'multi_craft') && TANK.team == MY_TANK.team)){
		var mouseX = mouse_click_pos[0];
		var mouseY = mouse_click_pos[1];
		}
	else{
		mouseX = TANK.missile_x;
		mouseY = TANK.missile_y;
		}
	var tank_size_w = TANK.width()/2;		
	var tank_size_h = TANK.height()/2;		

	//find target
	if(enemy_id==undefined){
		if(TANK.team=='R')
			enemy = get_tank_by_coords(mouseX, mouseY, 'B', TANK);
		else
			enemy = get_tank_by_coords(mouseX, mouseY, 'R', TANK);
		if(enemy==false) return false;
		if(enemy.dead == 1) return false;
		//if(enemy.invisibility == 1) return false;
		
		if(enemy.tmp_range > TANK.try_missile.range){
			//too far - move to target
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			if((game_mode == 'multi_quick' || game_mode == 'multi_craft') && skip_broadcast !== true){
				//broadcast
				DATA = {
					function: '',
					fparam: [tank_id, enemy_id, true],
					tank_params: [
						{key: 'target_move_lock', value: enemy.id},
						{key: 'move', value: 1},
						{key: 'move_to', value: [mouseX-tank_size_w, mouseY-tank_size_h]},
						{key: 'reach_tank_and_execute', value: [TANK.try_missile.range, 'do_missile', tank_id]},
						{key: 'try_missile', value: TANK.try_missile},
						{key: 'missile_x', value: mouse_click_pos[0]},
						{key: 'missile_y', value: mouse_click_pos[1]},
						],
					};
				register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
				delete TANK.try_missile;
				}
			else{
				delete TANK.target_move_lock;
				TANK.target_move_lock = enemy.id;
				TANK.move = 1;
				TANK.move_to = [mouseX-tank_size_w, mouseY-tank_size_h];
				TANK.reach_tank_and_execute = [TANK.try_missile.range, 'do_missile', tank_id];
				}
			return false;
			}
		}
	else{
		enemy = get_tank_by_id(enemy_id);
		if(enemy===false) return false;
		}	
	
	if(TANK.try_missile.angle == true){
		//find angle
		dist_x = enemy.x - TANK.x;
		dist_y = enemy.y - TANK.y;
		var radiance = Math.atan2(dist_y, dist_x);
		var angle = (radiance*180.0)/Math.PI+90;
		angle = round(angle);
		}
		
	//broadcast
	if((game_mode == 'multi_quick' || game_mode == 'multi_craft') && skip_broadcast !== true){
		DATA = {
			function: 'do_missile',
			fparam: [tank_id, enemy_id, true],
			tank_params: [
				{key: 'try_missile', value: TANK.try_missile},
				{key: 'missile_x', value: mouse_click_pos[0]},
				{key: 'missile_y', value: mouse_click_pos[1]},
				],
			};
		register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
		delete TANK.try_missile;
		mouse_click_controll = false;
		target_range=0;
		target_mode='';
		return false;
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
	if( (game_mode == 'single_quick' || game_mode == 'single_craft') || TANK.id == MY_TANK.id){
		var tmp = new Array();
		tmp['function'] = "draw_ability_reuse";
		tmp['duration'] = TANK.try_missile.reuse;
		tmp['type'] = 'REPEAT';
		tmp['nr'] = TANK.try_missile.ability_nr;	
		tmp['max'] = TANK.try_missile.reuse;
		tmp['tank'] = TANK;
		timed_functions.push(tmp);
		}
	
	delete TANK.try_missile;
	mouse_click_controll = false;
	target_range=0;
	target_mode='';
	}
function do_bomb(tank_id, distance_ok, skip_broadcast){	
	TANK = get_tank_by_id(tank_id);
	if(TANK.try_bomb == undefined) return false;
	if(TANK.name == name || ( (game_mode == 'single_craft' || game_mode == 'multi_craft') && TANK.team == MY_TANK.team)){
		mouseX = mouse_click_pos[0];
		mouseY = mouse_click_pos[1];
		}
	else{
		mouseX = TANK.bomb_x;
		mouseY = TANK.bomb_y;
		}
	var tank_size_w = TANK.width()/2;		
	var tank_size_h = TANK.height()/2;

	if(distance_ok !== true){
		//get explosion position
		dist_x = mouseX - TANK.cx();
		dist_y = mouseY - TANK.cy();
		distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
		distance = distance - tank_size_w;
		if(distance > TANK.try_bomb.range){
			//too far - move to target
			mouse_click_controll = false;
			target_range=0;
			target_mode='';
			if((game_mode == 'multi_quick' || game_mode == 'multi_craft') && skip_broadcast !== true){
				//broadcast
				DATA = {
					function: '',
					fparam: [tank_id, true, true],
					tank_params: [
						{key: 'move', value: 1},
						{key: 'move_to', value: [mouseX-tank_size_w, mouseY-tank_size_h]},
						{key: 'reach_pos_and_execute', value: [TANK.try_bomb.range, 'do_bomb', mouseX, mouseY, tank_id]},
						{key: 'try_bomb', value: TANK.try_bomb},
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
				TANK['move_to'] = [mouseX-tank_size_w, mouseY-tank_size_h];
				TANK.reach_pos_and_execute = [TANK.try_bomb.range, 'do_bomb', mouseX, mouseY, tank_id];
				}
			return false;
			}
		}
	//broadcast
	if((game_mode == 'multi_quick' || game_mode == 'multi_craft') && skip_broadcast !== true){
		DATA = {
			function: 'do_bomb',
			fparam: [tank_id, true, true],
			tank_params: [
				{key: 'try_bomb', value: TANK.try_bomb},
				{key: 'bomb_x', value: mouse_click_pos[0]},
				{key: 'bomb_y', value: mouse_click_pos[1]},
				],
			};
		register_tank_action('skill_advanced', opened_room_id, TANK.name, DATA);
		delete TANK.try_bomb;
		mouse_click_controll = false;
		target_range=0;
		target_mode='';
		return false;
		}
		
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
	if(game_mode == 'single_quick' || game_mode == 'single_craft' || TANK.id == MY_TANK.id){
		var tmp = new Array();
		tmp['function'] = "draw_ability_reuse";
		tmp['duration'] = TANK.try_bomb.reuse;
		tmp['type'] = 'REPEAT';
		tmp['nr'] = TANK.try_bomb.ability_nr;	
		tmp['max'] = TANK.try_bomb.reuse;
		tmp['tank'] = TANK;
		timed_functions.push(tmp);
		}
	
	delete TANK.try_bomb;
	mouse_click_controll = false;
	target_range=0;
	target_mode='';
	}
function do_construct(tank_id){
	TANK = get_tank_by_id(tank_id);
	if(TANK.try_construct == undefined)  return false;
	mouseX = mouse_click_pos[0];
	mouseY = mouse_click_pos[1];
	var type = TANK.try_construct.tank_type;
	
	var tank_size_w = TANK.width()/2;		
	var tank_size_h = TANK.height()/2;
	
	//check
	if(validate_construction(mouseX, mouseY, true)==false) return false;
	
	TANK.try_construct.cost = apply_buff(TANK, 'cost', TANK.try_construct.cost);
	if(HE3 < TANK.try_construct.cost) return false;
	HE3 = HE3 - TANK.try_construct.cost;
	
	//control
	if(TANK.try_construct == undefined)  return false;
	nr = TANK.try_construct.ability_nr;
	if(TANK.abilities_reuse[nr] > Date.now() ) return false; //last check
	TANK.abilities_reuse[nr] = Date.now() + TANK.try_construct.reuse;
	
	var x = mouseX - round(TYPES[type].size[1]/2);
	var y = mouseY - round(TYPES[type].size[2]/2);
	var angle = 180;
	if(TANK.team != 'B')
		angle = 0;
	var nation = get_nation_by_team(TANK.team);
	var unit_id = 'builing-'+TANK.team+mouseX+"."+mouseY;
	//create tank
	var new_tank = add_tank(1, unit_id, '', type, TANK.team, nation, x, y, angle);
	
	var duration = 30*1000;
	if(DEBUG == true) duration = 1000;
	new_tank.constructing = {
		duration: duration,
		start: Date.now(),
		}
	//register crystal
	if(new_tank.data.name == 'Silo'){
		var min_distance = 999;
		for(var c in MAP_CRYSTALS){
			var dist_x = MAP_CRYSTALS[c].cx - new_tank.cx();
			var dist_y = MAP_CRYSTALS[c].cy - new_tank.cy();
			var distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
			if(distance < CRYSTAL_RANGE && MAP_CRYSTALS[c].power > 0){
				new_tank.crystal = MAP_CRYSTALS[c];
				break;
				}
			}
		}
	//adding flag
	if(new_tank.data.name == 'Factory'){
		if(new_tank.team == 'B') //top
			new_tank.flag = { x: new_tank.x, y: new_tank.y+60}
		else //bottom
			new_tank.flag = { x: new_tank.x, y: new_tank.y-60}
		}
	
	if(shift_pressed == false){
		delete TANK.try_construct;
		mouse_click_controll = false;
		}
	}
