//draw single tank
function draw_tank(tank){
	if(PLACE != 'game' || tank == undefined) return false;
	if(tank.invisibility != undefined && tank.team != MY_TANK.team) return false; //enemy in hide mode
	var tank_size =  TYPES[tank.type].size[1];
	var visibility = 0;
	
	if(tank.y > -1*map_offset[1] + HEIGHT_SCROLL && FS==false){}	//skip - object below visible zone
	else if(tank.y+tank_size < -1*map_offset[1] && FS==false){}		//skip - object above visible zone
	else if(tank.x > -1*map_offset[0] + WIDTH_SCROLL && FS==false){}		//skip - object on right from visible zone
	else if(tank.x+tank_size < -1*map_offset[0] && FS==false){}		//skip - object on left from above visible zone
	else{
		visibility = 1;
		
		if(tank.dead == 1)		tank_size = tank_size/2; //dead
		if(tank.invisibility == 1)	tank_size = tank_size*0.8; //invisibility
		if(check_enemy_visibility(tank)==false)	return false; //out of sight
		
		lighten_pixels(tank);
		
		var padding = 20;
		
		var cache_id = "";
		cache_id += "T:"+tank.type+',';
		cache_id += "A:"+tank.angle+',';
		cache_id += "Si:"+tank_size+',';
		for (i in tank.extra_icon)
			cache_id += "E:"+tank.extra_icon[i][0]+',';
		if(tank.stun != undefined)	
			cache_id += 'ST,';
		if(tank.berserker != undefined)	
			cache_id += 'B,';
		if(tank.clicked_on != undefined){
			cache_id += 'EC,';
			tank.clicked_on = tank.clicked_on - 1;
			if(tank.clicked_on == 0)
				delete tank.clicked_on;
			}
		if(TYPES[tank.type].icon_top[0] != undefined)
			cache_id += "SA:"+tank.fire_angle+',';
		
		if(tank.cache_tank != undefined && tank.cache_tank.unique == cache_id && tank.cache_tank.time - Date.now() > 0){
			//read from cache
			canvas_main.drawImage(tank.cache_tank.object, round(tank.x+map_offset[0])-padding, round(tank.y+map_offset[1])-padding);
			}
		else{
			//create tmp
			var tmp_canvas = document.createElement('canvas');
			tmp_canvas.width = 105
			tmp_canvas.height = 105;
			var tmp_object = tmp_canvas.getContext("2d");
		
			//start adding data
			tmp_object.save();
		
			//draw extra layer
			for (i in tank.extra_icon){
				if(tank.extra_icon[i][0]=='_SHIELD_'){
					//shield
					tmp_object.beginPath();
					tmp_object.arc(tank_size/2+padding, tank_size/2+padding, tank_size/2, 0 , 2 * Math.PI, false);	
					tmp_object.lineWidth = 5;
					tmp_object.strokeStyle = "#575757";
					tmp_object.stroke();
					}
				else if(tank.extra_icon[i][0]=='_SLOW_'){
					//glue bomb
					tmp_object.beginPath();
					tmp_object.arc(tank_size/2+padding, tank_size/2+padding, tank_size/2, 0 , 2 * Math.PI, false);	
					tmp_object.lineWidth = 5;
					tmp_object.strokeStyle = "#C0C0C0";
					tmp_object.stroke();
					}
				}
				
			//draw berserker
			if(tank.berserker != undefined){
				tmp_object.beginPath();
				var radius = tank_size/2;
				if(radius>35)
				radius=35;
				tmp_object.arc(tank_size/2+padding, tank_size/2+padding, radius, 0 , 2 * Math.PI, false);	
				tmp_object.lineWidth = 3;
				tmp_object.strokeStyle = "#c10000";
				tmp_object.stroke();
				}
			
			//draw stun
			if(tank.stun != undefined){
				tmp_object.beginPath();
				tmp_object.arc(tank_size/2+padding, tank_size/2+padding, tank_size/2+4, 0 , 2 * Math.PI, false);	
				tmp_object.lineWidth = 1;
				tmp_object.fillStyle = "#545454";
				tmp_object.fill();
				}
			
			//draw tank base
			img_me = new Image();
			img_me.src = '../img/tanks/'+TYPES[tank.type].name+'/'+TYPES[tank.type].icon_base[0];
			if(TYPES[tank.type].icon_base[1] == "no-rotate"){
				//draw without rotation
				tmp_object.restore();
				tmp_object.drawImage(img_me, padding, padding, tank_size, tank_size);
				tmp_object.save();
				tmp_object.translate(round(tank_size/2)+padding, round(tank_size/2)+padding);
				tmp_object.rotate(tank.angle * TO_RADIANS);
				}
			else{
				tmp_object.translate(round(tank_size/2)+padding, round(tank_size/2)+padding);
				tmp_object.rotate(tank.angle * TO_RADIANS);
				tmp_object.drawImage(img_me, -1*round(tank_size/2), -1*round(tank_size/2), tank_size, tank_size);
				}
			tmp_object.restore();
			
			//draw top
			if(TYPES[tank.type].icon_top[0] != undefined){
				if(tank.dead != 1){
					tmp_object.save();
					img_me = new Image();
					img_me.src = '../img/tanks/'+TYPES[tank.type].name+'/'+TYPES[tank.type].icon_top[0];
					tmp_object.translate(round(tank_size/2)+padding, round(tank_size/2)+padding);
					tmp_object.rotate(tank.fire_angle * TO_RADIANS);
					tmp_object.drawImage(img_me, -(tank_size/2), -(tank_size/2), tank_size, tank_size);
					tmp_object.restore();
					}
				}

			//draw extra layer
			for (i in tank.extra_icon){
				img_me = new Image();
				img_me.src = '../img/'+tank.extra_icon[i][0];
				tmp_object.drawImage(img_me, padding+tank_size/2-tank.extra_icon[i][1]/2, padding+tank_size/2-tank.extra_icon[i][2]/2);
				}

			//enemy checked
			if(tank.clicked_on != undefined){
				tmp_object.beginPath();
				tmp_object.arc(tank_size/2+padding, tank_size/2+padding, tank_size/2, 0 , 2 * Math.PI, false);	
				tmp_object.lineWidth = 3;
				tmp_object.strokeStyle = "#d9d900";
				tmp_object.stroke();
				}
			
			//save to cache
			tank.cache_tank = [];
			tank.cache_tank.object = tmp_canvas;
			tank.cache_tank.unique = cache_id;
			tank.cache_tank.time = Date.now()+2000;
			
			//show
			canvas_main.drawImage(tmp_canvas, round(tank.x+map_offset[0])-padding, round(tank.y+map_offset[1])-padding);
			}
		//draw clicked position
		if(tank.clicked != undefined){
			canvas_main.beginPath();
			canvas_main.arc(round(map_offset[0]+tank.clicked[0]), round(map_offset[1]+tank.clicked[1]), round(tank.clicked[2]), 0 , 2 * Math.PI, false);	
			canvas_main.lineWidth = 2;
			canvas_main.strokeStyle = "#196119";
			canvas_main.stroke();
			tank.clicked[2] = tank.clicked[2]-1;
			if(tank.clicked[2] == 1)
				delete tank.clicked;
			}
		if(tank.dead != 1 && tank.death_respan == undefined){
			add_player_name(tank);
			add_hp_bar(tank);
			}
		}	
	update_radar(tank);
	}
//tank hp bar above
function add_hp_bar(tank){
	xx = round(tank.x+map_offset[0]);
	yy = round(tank.y+map_offset[1]);
	life = tank.hp * 100 / (TYPES[tank.type].life[0] + TYPES[tank.type].life[1] * (parseInt(tank.level)-1));
	canvas_main.fillStyle = "#c10000";
	hp_width = round(TYPES[tank.type].size[1]*80/100);	//%80
	padding_left = round((TYPES[tank.type].size[1] - hp_width)/2);
	padding_top = round(TYPES[tank.type].size[1]*7/100);
	yy = yy - 13;
	hp_height = 5;
	if(TYPES[tank.type].type == 'human')
		hp_height = '3';
	
	canvas_main.fillStyle = "#196119";	//green
	canvas_main.fillRect(xx+padding_left, yy+padding_top, hp_width, hp_height);
	canvas_main.fillStyle = "#c10000";	//red
	red_bar_length = Math.floor((100-life)*hp_width/100);	
	red_bar_x = xx + hp_width - red_bar_length;
	canvas_main.fillRect(red_bar_x+padding_left, yy+padding_top, red_bar_length, hp_height);
	}
//tank name above
function add_player_name(tank){
	if(TYPES[tank.type].type != 'tank') return false;
	var xx = round(tank.x+map_offset[0]);
	var yy = round(tank.y+map_offset[1]);
	var player_name = ""+tank.name+" "+tank.level+"";
	player_name = player_name.substring(0, 15);
	var name_padding = round((TYPES[tank.type].size[1] - 5*player_name.length)/2);	//in pixels 5px per letter
	if(name_padding<0) name_padding = 0;
	
	if(tank.cache_name != undefined && tank.cache_name.level == tank.level){
		//read from cache
		canvas_main.drawImage(tank.cache_name.object, xx, yy-25);	
		}
	else{
		//create tmp
		var tmp_canvas = document.createElement('canvas');
		tmp_canvas.width = 100
		tmp_canvas.height = 100;
		var tmp_object = tmp_canvas.getContext("2d");
	
		//add data
		if(tank.team=='B')		tmp_object.fillStyle = "#0000ff";
		else if(tank.team=='R')		tmp_object.fillStyle = "#b12525";
		else if(tank.team=='G')		tmp_object.fillStyle = "#196119";
		else if(tank.team=='Y')		tmp_object.fillStyle = "#ffff00";
		else 				tmp_object.fillStyle = "#ffffff";
		
		if(tank.id == MY_TANK.id)
			tmp_object.fillStyle = "#ffff00";
		
		tmp_object.font = "normal 9px Verdana";
		tmp_object.fillText(player_name, 0+name_padding, 12);
		
		//save to cache
		tank.cache_name = [];
		tank.cache_name.object = tmp_canvas;
		tank.cache_name.level = tank.level;
		
		//show
		canvas_main.drawImage(tmp_canvas, xx, yy-25);
		}
	}
//tank move rgistration and graphics
function draw_tank_move(mouseX, mouseY){
	if(mouse_click_controll==true){
		//external click functions
		for (i in on_click_functions)
			window[on_click_functions[i][0]](on_click_functions[i][1]);
		}
	else{
		//delete other handlers
		delete MY_TANK.try_missle;
		delete MY_TANK.try_stun;
		delete MY_TANK.try_mortar;
		delete MY_TANK.try_bomb;
		delete MY_TANK.try_airstrike;
		if(MY_TANK.invisibility != undefined){
			if(game_mode == 2)
				send_packet('del_invisible', [MY_TANK.id]);
			else
				delete MY_TANK.invisibility;
			}
		
		if(MY_TANK.death_respan != undefined) return false;
			
		//check clicks
		var found_something = false;
		target_lock_id=0;
		if(MY_TANK.target_move_lock != undefined)
			delete MY_TANK.target_move_lock;
		if(MY_TANK.respan_time == undefined){
			for(var i in TANKS){
				var tank_size =  0.9*TYPES[TANKS[i].type].size[1];
				if(TANKS[i].team == MY_TANK.team){
					if(Math.abs(TANKS[i].x+tank_size/2 - mouseX) < tank_size/2 && Math.abs(TANKS[i].y+tank_size/2 - mouseY) < tank_size/2){
						if(TANKS[i].name != name)
							return false; //clicked on allies, but not youself
						}
					}
				if(TANKS[i].team != MY_TANK.team){
					if(Math.abs(TANKS[i].x+tank_size/2 - mouseX) < tank_size/2 && Math.abs(TANKS[i].y+tank_size/2 - mouseY) < tank_size/2){
						//clicked on enemy
						TANKS[i].clicked_on = 10;	// will draw circle on enemies
						MY_TANK.target_move_lock = TANKS[i].id;
						MY_TANK.target_shoot_lock = TANKS[i].id;
						target_lock_id = TANKS[i].id;
						found_something = true;
						break;
						}
					}
				}
			}
		//ok, lets show where was clicked
		if(found_something==false)
			MY_TANK.clicked = [mouseX,mouseY,8];
	
		var tank_size = TYPES[MY_TANK.type].size[1];
		mouseX = mouseX-tank_size/2;	
		mouseY = mouseY-tank_size/2;
		mouseX = Math.floor(mouseX);
		mouseY = Math.floor(mouseY);
		
		//register
		if(game_mode == 2){
			if(found_something==true)
				register_tank_action('move', opened_room_id, MY_TANK.id, [round(MY_TANK.x), round(MY_TANK.y), round(mouseX), round(mouseY), target_lock_id]);
			else
				register_tank_action('move', opened_room_id, MY_TANK.id, [round(MY_TANK.x), round(MY_TANK.y), round(mouseX), round(mouseY)]);
			//MY_TANK.move = 0;
			return false;
			}
		else{
			MY_TANK.move = 1;
			MY_TANK.move_to = [mouseX, mouseY];
			
			if(muted==false){
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
//check collisions
function check_collisions(xx, yy, TANK){
	if(TYPES[TANK.type].no_collisions != undefined) return false;
	xx = Math.round(xx);
	yy = Math.round(yy);
	var tank_size_half = round(TYPES[TANK.type].size[1]/2);

	//borders
	if(xx < 0 || yy < 0) return true;
	if(xx > WIDTH_MAP || yy > HEIGHT_MAP) return true;
	
	//elements
	for(var e in MAPS[level-1].elements){
		var element = get_element_by_name(MAPS[level-1].elements[e][0]);
		if(element.collission == false) continue;	
		
		var elem_width = element.size[0];
		var elem_height = element.size[1];
		var elem_x = MAPS[level-1].elements[e][1];
		var elem_y = MAPS[level-1].elements[e][2];
		if(element.size[0]<30)	elem_x = elem_x - round(element.size[0]/2);
		if(element.size[1]<30)	elem_y = elem_y - round(element.size[1]/2);
		if(MAPS[level-1].elements[e][3]!=0 && MAPS[level-1].elements[e][3] < elem_width)
			elem_width = MAPS[level-1].elements[e][3];
		if(MAPS[level-1].elements[e][4]!=0 && MAPS[level-1].elements[e][4] < elem_height)
			elem_height = MAPS[level-1].elements[e][4];
		//check
		if(yy > elem_y && yy < elem_y+elem_height){
			if(xx > elem_x && xx < elem_x+elem_width){
				return true;
				}
			}
		}

	//other tanks
	if(TYPES[TANK.type].types != 'tower'){
		if(TANK.use_AI == true) return false;
		for (i in TANKS){
			if(TANKS[i].id == TANK.id) continue;			//same tank
			if(TYPES[TANKS[i].type].no_collisions != undefined) continue;	//flying units
			if(TYPES[TANK.type].type == 'tank' && TYPES[TANKS[i].type].type == 'human') continue;	//tanks can go over soldiers
			if(TYPES[TANK.type].type == 'human' && TYPES[TANKS[i].type].type == 'tank') continue;	//soldiers can go over tanks, why? see above
			if(TYPES[TANK.type].type == 'human' && TYPES[TANKS[i].type].type == 'human') continue;	//soldier can go over soldiers ...
			if(TANKS[i].dead == 1) continue;		//tank dead
			var size2 = TYPES[TANKS[i].type].size[1];
			if(TYPES[TANKS[i].type].type == 'human')	
				size2 = round(size2/2);	//soldiers small
			if(xx > TANKS[i].x && xx < TANKS[i].x+size2){
				if(yy > TANKS[i].y && yy < TANKS[i].y+size2){
					return true;
					}
				}
			}
		}
	
	return false;
	}
//checks tanks levels
function tank_level_handler(){	//once per second
	for (i in TANKS){
		if(TYPES[TANKS[i].type].type == 'tower') 	return false;
		//if(TYPES[TANKS[i].type].type == 'human') 	return false;
		if(game_mode == 2 && TANKS[i].id != MY_TANK.id)	continue;	//not our business
		if(TANKS[i].dead == 1) {
			TANKS[i].death_time++;
			return false; //dead
			}
		if(TANKS[i].hit_reuse - Date.now() > 0)
			TANKS[i].bullets++;	//shooting
		last_level = TANKS[i].level;
		
		//calc level
		time_diff = (Date.now() - TANKS[i].begin_time)/1000 - TANKS[i].death_time + TANKS[i].bullets;
		time_diff = Math.ceil(time_diff/LEVEl_UP_TIME);		
		
		TANKS[i].level = time_diff;
		
		//do level changes	
		if(TANKS[i].level != last_level){				//lvl changed
			if(game_mode == 1){
				TANKS[i].armor = TANKS[i].armor + TYPES[TANKS[i].type].armor[1];
				TANKS[i].damage = TANKS[i].damage + TYPES[TANKS[i].type].damage[1];
				if(TANKS[i].armor > TYPES[TANKS[i].type].armor[2])
					TANKS[i].armor = TYPES[TANKS[i].type].armor[2];
				TANKS[i].score = TANKS[i].score + SCORES_INFO[0]*(TANKS[i].level-last_level);	// +25 for 1 lvl
				}
			redraw_tank_stats();
			if(TANKS[i].id == MY_TANK.id){
				if(game_mode == 2)
					register_tank_action('level_up', opened_room_id, TANKS[i].id, TANKS[i].level);
				draw_tank_abilities();
				}
			}
		}
	}
//checks tanks hp regen
function level_hp_regen_handler(){		//once per 1 second - 1.5%/s
	for (i in TANKS){
		if(TANKS[i].dead == 1 || TYPES[TANKS[i].type].type == 'tower') continue;
		var max_hp = TYPES[TANKS[i].type].life[0] + TYPES[TANKS[i].type].life[1] * (TANKS[i].level-1);
		//passive hp regain - 1.5%/s
		var extra_hp = round(max_hp * 1.5 / 100);
		if(TANKS[i].hp < max_hp){
			TANKS[i].hp = TANKS[i].hp + extra_hp;
			if(TANKS[i].hp > max_hp)
				TANKS[i].hp = max_hp;
			}
		//healing
		for (j in TANKS[i].extra_hp){
			if(TANKS[i].hp+TANKS[i].extra_hp[j][0] < max_hp)
				TANKS[i].hp = TANKS[i].hp + TANKS[i].extra_hp[j][0];
			else if(TANKS[i].hp+TANKS[i].extra_hp[j][0] >= max_hp)
				TANKS[i].hp = max_hp;
			}
		//check nano_hp_regen
		if(TANKS[i].nano_hp_regen != undefined){
			if(TANKS[i].hp+TANKS[i].nano_hp_regen < max_hp)
				TANKS[i].hp = TANKS[i].hp + TANKS[i].nano_hp_regen;
			else if(TANKS[i].hp+TANKS[i].nano_hp_regen >= max_hp)
				TANKS[i].hp = max_hp;
			}
		}
	redraw_tank_stats();
	}
//actions on enemies
function check_enemies(TANK){
	if(TANK.invisibility==1) return false;
	if(TANK.dead == 1) return false;	//dead
	if(TANK.stun != undefined) return false;	//stuned
	if(TANK.hit_reuse == undefined) TANK.hit_reuse = TANK.attack_delay*1000+Date.now();
	if(TANK.hit_reuse - Date.now() > 0)
		return false;	//hit reuse
	if(TANK.check_enemies_reuse - Date.now() > 0)
		return false;	//check reuse
	if(game_mode==2 && check_if_broadcast(TANK)==false) return false; //not our business
		
	range = TYPES[TANK.type].range;
	var found = false;
	var tank_size_from = TYPES[TANK.type].size[1]/2;
	
	//check if target_lock
	var i_locked = false;
	if(TANK.target_shoot_lock != undefined){
		for(var t in TANKS){
			if(TANKS[t].id == TANK.target_shoot_lock)
				i_locked = t;
			} 
		if(i_locked===false)
			delete TANK.target_shoot_lock;
		}
	//target lock
	if(TYPES[TANK.type].aoe == undefined 
			&& i_locked !== false 
			&& TANKS[i_locked] != undefined
			&& TANKS[i_locked].dead != 1 
			&& TANKS[i_locked].invisibility != 1
			){
		i = i_locked;
		//exact range
		dist_x = TANKS[i].x+TYPES[TANKS[i].type].size[1]/2 - (TANK.x+tank_size_from);
		dist_y = TANKS[i].y+TYPES[TANKS[i].type].size[1]/2 - (TANK.y+tank_size_from);
		
		distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
		distance = distance - TYPES[TANKS[i].type].size[1]/2 - tank_size_from;
		
		if(distance < range){
			//start shooting
			var tank_size_from = TYPES[TANK.type].size[1];
			var tank_size_to = TYPES[TANKS[i].type].size[1];
			var radiance = Math.atan2(dist_y, dist_x);
			f_angle = (radiance*180.0)/Math.PI+90;
			
			
			if(game_mode == 1){
				var tmp = new Array();
				tmp['x'] = TANK.x+tank_size_from/2;
				tmp['y'] = TANK.y+tank_size_from/2;
				tmp['bullet_to_target'] = TANKS[i]; 
				tmp['bullet_from_target'] = TANK;
				tmp['angle'] = round(f_angle);
				BULLETS.push(tmp);
				}
			else
				send_packet('bullet', [TANKS[i].id, TANK.id, round(f_angle)]);
			
			TANK.hit_reuse = TANK.attack_delay*1000+Date.now();	
			TANK.fire_angle = round(f_angle);
			found = true;
			TANK.attacking = TANKS[i].id;
			TANK.check_enemies_reuse = 0;
			shoot_sound(TANK);
			draw_fire(TANK, TANKS[i]);
			}
		}
	
	//no target lock - closest enemy
	if(found==false){
		var ENEMY_NEAR;
		for (i in TANKS){				
			if(TANKS[i].team == TANK.team)	continue;	//same team
			if(TANKS[i].dead == 1)			continue;	//target dead
			if(TANK.target_shoot_lock != undefined && TANKS[i].id == TANK.target_shoot_lock){
				if(TYPES[TANK.type].aoe == undefined)
					continue;	//already checked above
				}
			if(TANKS[i].invisibility==1)		continue;	//blur mode
			
			//check
			distance = get_distance_between_tanks(TANKS[i], TANK);
			if(distance > range)			continue;	//target too far
			
			//range ok
			if(ENEMY_NEAR==undefined)
				ENEMY_NEAR = [range, i];
			else if(distance < ENEMY_NEAR[0])
				ENEMY_NEAR = [range, i];
			}	
		}
	
	//single attack on closest enemy
	if(found==false && TYPES[TANK.type].aoe == undefined && ENEMY_NEAR != undefined){
		i = ENEMY_NEAR[1];
		
		//exact range
		dist_x = TANKS[i].x+TYPES[TANKS[i].type].size[1]/2 - (TANK.x+tank_size_from);
		dist_y = TANKS[i].y+TYPES[TANKS[i].type].size[1]/2 - (TANK.y+tank_size_from);
		
		//start shooting
		var tank_size_from = TYPES[TANK.type].size[1];
		var tank_size_to = TYPES[TANKS[i].type].size[1];
		var radiance = Math.atan2(dist_y, dist_x);
		f_angle = (radiance*180.0)/Math.PI+90;
		
		if(game_mode == 1){
			var tmp = new Array();
			tmp['x'] = TANK.x+tank_size_from/2;
			tmp['y'] = TANK.y+tank_size_from/2;
			tmp['bullet_to_target'] = TANKS[i]; 
			tmp['bullet_from_target'] = TANK;
			tmp['angle'] = round(f_angle);
			BULLETS.push(tmp);
			}
		else
			send_packet('bullet', [TANKS[i].id, TANK.id, round(f_angle)]);
		
		TANK.hit_reuse = TANK.attack_delay*1000+Date.now();	
		TANK.fire_angle = round(f_angle);
		found = true;
		TANK.attacking = TANKS[i].id;
		TANK.check_enemies_reuse = 0;
		shoot_sound(TANK);
		draw_fire(TANK, TANKS[i]);
		}
	
	//aoe hits
	if(found==false && TYPES[TANK.type].aoe != undefined){	 
		var found_aoe_target = false;
		for (i in TANKS){	
			if(TANKS[i].team == TANK.team)
				continue;	//same team
			if(TANKS[i].dead == 1)
				continue;	//target dead
			if(TANK.target_shoot_lock != undefined && TANKS[i].id == TANK.target_shoot_lock){
				if(TYPES[TANK.type].aoe == undefined)
					continue;	//already checked above
				}
			
			//exact range
			dist_x = TANKS[i].x+TYPES[TANKS[i].type].size[1]/2 - (TANK.x+tank_size_from);
			dist_y = TANKS[i].y+TYPES[TANKS[i].type].size[1]/2 - (TANK.y+tank_size_from);
			
			distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
			distance = distance - TYPES[TANKS[i].type].size[1]/2 - tank_size_from;
			
			if(range < distance){	
				continue;	//target too far
				}
			
			//start shooting
			var tank_size_from = TYPES[TANK.type].size[1];
			var tank_size_to = TYPES[TANKS[i].type].size[1];
			var radiance = Math.atan2(dist_y, dist_x);
			f_angle = (radiance*180.0)/Math.PI+90;
			
			
			if(game_mode == 1){
				var tmp = new Array();
				tmp['x'] = TANK.x+tank_size_from/2;
				tmp['y'] = TANK.y+tank_size_from/2;
				tmp['bullet_to_target'] = TANKS[i]; 
				tmp['bullet_from_target'] = TANK;
				tmp['angle'] = round(f_angle);
				BULLETS.push(tmp);
				}
			else
				send_packet('bullet', [TANKS[i].id, TANK.id, round(f_angle)]);
			
			TANK.hit_reuse = TANK.attack_delay*1000+Date.now();	
			TANK.fire_angle = round(f_angle);
			found = true;
			TANK.attacking = TANKS[i].id;
			TANK.check_enemies_reuse = 0;
			found_aoe_target = true;
			}
		if(found_aoe_target == true)
			shoot_sound(TANK);
		}
	//soldiers continue to move if no enemies - was stop for shooting
	//if(found == false && TANK.move == 0 && TYPES[TANK.type].type == 'human')
	//	TANK.move = 1;
	//if not found, do short pause till next search for enemies
	if(found == false){
		TANK.check_enemies_reuse = 1000/2+Date.now();	//half second pause
		TANK.attacking = 0;
		}
	}
//draw tank shooting fire
function draw_fire(TANK, TANK_TO){
	explode_x = TANK.x+TYPES[TANK.type].size[1]/2;
	explode_y = TANK.y+TYPES[TANK.type].size[1]/2;
	dist_x = TANK_TO.x+TYPES[TANK_TO.type].size[1]/2 - explode_x;
	dist_y = TANK_TO.y+TYPES[TANK_TO.type].size[1]/2 - explode_y;
	radiance = Math.atan2(dist_y, dist_x);
	explode_x = explode_x + Math.cos(radiance)*(TYPES[TANK.type].size[1]/2+10);
	explode_y = explode_y + Math.sin(radiance)*(TYPES[TANK.type].size[1]/2+10);			
	drawImage_rotated(canvas_main, '../img/explosion.png', explode_x+map_offset[0], explode_y+map_offset[1], 24, 32, TANK.fire_angle);
	}
//shooting
function shoot_sound(TANK){
	if(muted==true) return false;
	if(TANK.id != MY_TANK.id) return false;
	if(TYPES[TANK.type].fire_sound == undefined) return false;
	try{
		var audio_fire = document.createElement('audio');
		audio_fire.setAttribute('src', '../sounds/'+TYPES[TANK.type].fire_sound+SOUND_EXP);
		audio_fire.play();
		}
	catch(error){}
	}
//damage to other tank function
function do_damage(TANK, TANK_TO, BULLET){
	if(TANK_TO == undefined) return false;
	if(TANK_TO.dead == 1) return false;
	
	//accuracy
	/*var accuracy = TYPES[TANK.type].accuracy;
	if(TANK.move==1)
		accuracy = accuracy-10;
	if(TANK_TO.move==1)
		accuracy = accuracy-10;
	if(getRandomInt(1, 10) > accuracy/10) return false;*/
	
	//sound	fire_sound - i was hit
	if(TANK_TO.id == MY_TANK.id && muted==false){
		try{
			var audio_fire = document.createElement('audio');
			audio_fire.setAttribute('src', '../sounds/metal'+SOUND_EXP);
			audio_fire.play();
			}
		catch(error){}
		}	
	
	damage = TANK.damage;
	if(TANK.debuffs != undefined){
		damage_first = damage;
		for(var dd in TANK.debuffs){
			if(TANK.debuffs[dd][0]=='weak'){
				var diff = damage_first * TANK.debuffs[dd][1] / 100;
				damage = damage - diff;
				if(damage < 0)
					damage = 0;
				}
			}
		}
	
	if(BULLET.damage != undefined)
		damage = BULLET.damage;
	armor = TANK_TO.armor;
	if(armor > TYPES[TANK_TO.type].armor[2])
		armor = TYPES[TANK_TO.type].armor[2];
	
	//check armor_piercing
	if(TANK.armor_piercing != undefined && BULLET.pierce_armor == undefined){
		armor = armor - TANK.armor_piercing;
		if(armor<0)
			armor=0;
		}
	else if(BULLET.pierce_armor != undefined)
		armor = 0;
	
	if(TYPES[TANK.type].ignore_armor != undefined)
		armor = 0;	//pierce armor
	damage = round( damage*(100-armor)/100 );		//log(damage+", target armor="+armor+", type="+TYPES[TANK_TO.type].name);
	
	if(TANK_TO.invisibility != undefined){
		if(BULLET.aoe_effect != undefined)
			delete TANK_TO.invisibility;
		else
			return false;
		}
	
	//stats
	if(TYPES[TANK_TO.type].name=="Tower" || TYPES[TANK_TO.type].name=="Base"){
		if(TANK.towers == undefined)
			TANK.towers = 0;
		var damage_at_tower = damage / TYPES[TANK_TO.type].life[0];
		if(TANK_TO.hp < damage)
			damage_at_tower = TANK_TO.hp / TYPES[TANK_TO.type].life[0];
		
		TANK.towers = TANK.towers + damage_at_tower;	
		TANK.score = TANK.score + SCORES_INFO[3] * (damage / TYPES[TANK_TO.type].life[0]);
		}
	
	life_total = TANK_TO.hp;
	if(life_total-damage>0){
		TANK_TO.hp = TANK_TO.hp - damage;
		if(TANK_TO.id == TANK_TO.id)
			redraw_tank_stats();
		}
	//death	
	else{	
		//updates deaths
		if(game_mode == 1){
			TANK_TO.deaths = TANK_TO.deaths + 1;
			TANK_TO.score = TANK_TO.score + SCORES_INFO[2];
			}
		
		//find killer
		var killer = TANK;
		if(TANK.master != undefined){
			killer = TANK.master;
			}
		if(TYPES[TANK_TO.type].no_repawn != undefined){	//tanks without repawn
			//base dead
			if(TYPES[TANK_TO.type].name == "Base"){
				if(game_mode == 1){
					draw_final_score(false, TANK_TO.team);
					}
				else
					register_tank_action('end_game', opened_room_id, false, TANK_TO.team);
				}
			else if(TYPES[TANK_TO.type].name == "Tower" && game_mode == 1){
				//tower dead - decreasing base armor
				for(var b in TANKS){
					if(TYPES[TANKS[b].type].name == "Base" && TANKS[b].team == TANK_TO.team){
						TANKS[b].armor = TANKS[b].armor - 10;
						if(TANKS[b].armor<0) 
							TANKS[b].armor = 0;	
						}
					}
				}
			if(game_mode == 2){
				if(check_if_broadcast(TANK)==true)
					register_tank_action('kill', opened_room_id, killer.id, TANK_TO.id);
				}
			else{
				//remove tank
				var del_index = false;
				for(var j in TANKS){
					if(TANKS[j].id == TANK_TO.id){
						TANKS.splice(j, 1);
						return true;
						}
					}
				}
			}
		else{ //tank with respawn
			//if tank
			if(TYPES[TANK_TO.type].type == 'tank'){
				//update kills
				if(game_mode == 1){
					killer.kills = killer.kills + 1;
					//add score
					TANK.score = TANK.score + SCORES_INFO[1];
					}
				if(game_mode==2){
					if(killer.name != '' && check_if_broadcast(TANK)==true)
						register_tank_action('chat', opened_room_id, false, "Player "+TANK_TO.name+" was killed by "+killer.name+"!");
					}	
				}
			if(game_mode == 2 && TYPES[TANK_TO.type].type != 'human'){
				if(check_if_broadcast(TANK)==true)
					register_tank_action('kill', opened_room_id, killer.id, TANK_TO.id);
				}
		
			//player death			
			if(game_mode == 1)
				death(TANK_TO);	
			}
		}
	return false;
	}
//check if broadcast other tank shooting, kill
function check_if_broadcast(KILLER){
	var ROOM = get_room_by_id(opened_room_id);
	
	//me
	if(KILLER.name == name) return true;	
	
	//only host broadcast tower actions
	if(TYPES[KILLER.type].type == 'tower' && ROOM.host == name) return true; 
	
	//my soldier - me broadcast
	if(KILLER.master != undefined && KILLER.master.id == MY_TANK.id) return true; 
	
	return false;
	}
//tank death
function death(tank){
	tank.hp = 0;
	tank.move = 0;
	tank.death_respan = 2*1000+Date.now();
	tank.dead = 1;
	tank.x += TYPES[tank.type].size[1]/4;
	tank.y += TYPES[tank.type].size[1]/4;
	
	tank.abilities_reuse = [0, 0, 0];
	delete tank.target_move_lock;
	delete tank.target_shoot_lock;
	
	//removing buffs/debuffs
	tank.extra_icon = [];
	tank.extra_hp = [];

	if(tank.level < 3)
		tank.respan_time = 5*1000+Date.now();
	else
		tank.respan_time = (tank.level*1+2)*1000+Date.now();
	}
//add towers to map
function add_towers(){
	for (var i in MAPS[level-1]['towers']){
		//get type
		var type = '';
		for(var t in TYPES){
			if(TYPES[t].name == MAPS[level-1]['towers'][i][3]){ 
				type = t;
				break;
				}
			}
		if(type=='') alert('Error: wrong type "'+MAPS[level-1]['towers'][i][3]+'" in maps definition.');
		var team = MAPS[level-1]['towers'][i][0];	
		var width_tmp = WIDTH_MAP - TYPES[type].size[1];
		var height_tmp = HEIGHT_MAP - TYPES[type].size[1];
		var x = MAPS[level-1]['towers'][i][1] - round(TYPES[type].size[1]/2);
		var y = MAPS[level-1]['towers'][i][2] - round(TYPES[type].size[1]/2);
		var angle = 180;
		if(team != 'B')
			angle = 0;
		//add
		add_tank(1, 'tow'+team+x+"."+y, '', type, team, x, y, angle);
		}
	}
//tank special ability activated	
function do_ability(nr, TANK){
	if(TANK.abilities_reuse[nr-1] > Date.now() ) return false;
	if(TANK.dead == 1) return false;
	if(TYPES[TANK.type].abilities[nr-1] == undefined) return false;
	if(TYPES[TANK.type].abilities[nr-1].passive == true) return false;
	
	var ability_function = TYPES[TANK.type].abilities[nr-1].name.replace(/ /g,'_');
	var broadcast_mode = TYPES[TANK.type].abilities[nr-1].broadcast;
	if(ability_function != undefined){
		if(game_mode == 1){
			//execute
			var ability_reuse = window[ability_function](TANK);
			if(ability_reuse != undefined && ability_reuse != 0){
				TANK.abilities_reuse[nr-1] = Date.now() + ability_reuse;
				var tmp = new Array();
				tmp['function'] = "draw_ability_reuse";
				tmp['duration'] = ability_reuse;
				tmp['type'] = 'REPEAT';
				tmp['nr'] = nr-1;	
				tmp['max'] = ability_reuse;
				tmp['tank'] = TANK;
				timed_functions.push(tmp);
				}
			}
		else if(game_mode == 2){ //broadcasting
			if(broadcast_mode==0){
				//execute
				var ability_reuse = window[ability_function](TANK);
				if(ability_reuse != undefined && ability_reuse != 0){
					TANK.abilities_reuse[nr-1] = Date.now() + ability_reuse;
					var tmp = new Array();
					tmp['function'] = "draw_ability_reuse";
					tmp['duration'] = ability_reuse;
					tmp['type'] = 'REPEAT';
					tmp['nr'] = nr-1;	
					tmp['max'] = ability_reuse;
					tmp['tank'] = TANK;
					timed_functions.push(tmp);
					}
				}
			else if(broadcast_mode==1){
				var ability_reuse = window[ability_function](TANK, undefined, true);
				if(TANK.abilities_reuse[nr-1] > Date.now() ) return false; //last check
				TANK.abilities_reuse[nr-1] = Date.now() + ability_reuse;
				register_tank_action('skill_do', opened_room_id, name,  nr, getRandomInt(1, 999999));
				}
			else if(broadcast_mode==2){
				//broadcast later
				var ability_reuse = window[ability_function](TANK);
				if(ability_reuse != undefined && ability_reuse != 0){
					if(TANK.abilities_reuse[nr-1] > Date.now() ) return false; //last check
					TANK.abilities_reuse[nr-1] = Date.now() + ability_reuse;
					var tmp = new Array();
					tmp['function'] = "draw_ability_reuse";
					tmp['duration'] = ability_reuse;
					tmp['type'] = 'REPEAT';
					tmp['nr'] = nr-1;	
					tmp['max'] = ability_reuse;
					tmp['tank'] = TANK;
					timed_functions.push(tmp);
					}
				}
			}
		}
	}
//check if enemy visible
function check_enemy_visibility(tank){		
	if(TYPES[tank.type].no_repawn != undefined)
		return true;	//tower
	if(tank.team==MY_TANK.team)
		return true;	//friend
	//wait for reuse
	if(tank.cache_scouted_reuse - Date.now() > 0)
		return tank.cache_scouted;	
	
	var tank_size_from = TYPES[tank.type].size[1]/2;
	for (i in TANKS){
		if(TANKS[i].team == tank.team)
			continue;	//same team
		if(TANKS[i].dead == 1)
			continue;	//target dead
		
		//exact range
		distance = get_distance_between_tanks(TANKS[i], tank);
		var range = TANKS[i].sight - TYPES[TANKS[i].type].size[1]/2;
		if(distance < range){
			tank.cache_scouted_reuse = 500+Date.now();
			tank.cache_scouted = true;
			return true;	//found by enemy
			}				
		}
	tank.cache_scouted_reuse = 500+Date.now();
	tank.cache_scouted = false;
	return false;
	}
//returns tank by name
function get_tank_by_name(tank_name){
	for(var i in TANKS){
		if(TANKS[i].name == tank_name) return TANKS[i];
		}
	return false;
	}
//returns tank by id
function get_tank_by_id(tank_id){
	for(var i in TANKS){
		if(TANKS[i].id == tank_id)	return TANKS[i];
		}
	return false;
	}
//choose tanks on mirror/random
function choose_and_register_tanks(ROOM){
	//get possible types
	var possible_types = [];
	for(var t in TYPES){
		if(TYPES[t].type=='tank')
			possible_types.push(t);
		}
	//choose
	if(ROOM.settings[0]=='random'){
		for(var p in ROOM.players){
			random_type = possible_types[getRandomInt(0, possible_types.length-1)];//randomize
			//register
			register_tank_action('change_tank', ROOM.id, ROOM.players[p].name, random_type);
			}
		}
	else if(ROOM.settings[0]=='mirror'){
		first_team = ROOM.players[0].team;	
		selected_types = [];
		//first team
		for(var p in ROOM.players){
			if(ROOM.players[p].team != first_team) continue;
			random_type = possible_types[getRandomInt(0, possible_types.length-1)];//randomize
			selected_types.push(random_type);
			//register
			register_tank_action('change_tank', ROOM.id, ROOM.players[p].name, random_type);
			}
		//second team
		for(var p in ROOM.players){
			if(ROOM.players[p].team == first_team) continue;
			//get index
			random_type_i = getRandomInt(0, selected_types.length-1);
			//register
			register_tank_action('change_tank', ROOM.id, ROOM.players[p].name, selected_types[random_type_i]);

			//remove selected type
			selected_types.splice(i, 1);  i--;
			}
		}
	}
//returns bullet by filename
function get_bullet(filename){
	for(var i in BULLETS_TYPES){
		if(BULLETS_TYPES[i].file == filename){
			return BULLETS_TYPES[i];
			}
		}
	return false;
	}
//returns tank by coordinates
function get_tank_by_coords(mouseX, mouseY, team, tank_from){
	var size_from_half = round(TYPES[tank_from.type].size[1]/2);
	for(var i in TANKS){
		var size_to_half = round(TYPES[TANKS[i].type].size[1]/2);
		if(team != undefined && TANKS[i].team != team) continue;
		if(Math.abs(TANKS[i].x+size_to_half - mouseX) < size_to_half && Math.abs(TANKS[i].y+size_to_half - mouseY) < size_to_half){
			distance = get_distance_between_tanks(TANKS[i], tank_from);
			TANKS[i].tmp_range = distance;
			return TANKS[i];
			}
		}
	return false;
	}
//returns distance bewteen 2 tanks
function get_distance_between_tanks(id1, id2){	
	if(typeof id1 == 'object')
		tank1 = id1;
	else
		tank1 = get_tank_by_id(id1);
	if(typeof id2 == 'object')
		tank2 = id2;
	else
		tank2 = get_tank_by_id(id2);
	if(tank1===false || tank2===false) return 100000;
	if(tank1.id==tank2.id) return 0;
	
	dist_x = tank1.x+TYPES[tank1.type].size[1]/2 - (tank2.x+TYPES[tank2.type].size[1]/2);
	dist_y = tank1.y+TYPES[tank1.type].size[1]/2 - (tank2.y+TYPES[tank2.type].size[1]/2);
	
	distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
	distance = distance - TYPES[tank1.type].size[1]/2 - TYPES[tank2.type].size[1]/2;
	distance = round(distance);
	if(distance<0) distance = 0;
	return distance;
	}
//team tanks count
function get_team_tanks_count(team){
	var n = 0;
	for(var i in TANKS){
		if(TANKS[i].team == team && TYPES[TANKS[i].type].type == 'tank')
			n++;
		}
	return n;
	}
//sync movement in network, if distance too far - fix it, else, ignore
function sync_movement(TANK, xx, yy){
	var MAX_ALLOED_DIFFERENCE = 100;
	if(TANK===false) return false;
	if(TYPES[TANK.type].type == 'tower') return false;
	if(TANK.id != MY_TANK.id){
		//get distance
		dist_x = TANK.x+TYPES[TANK.type].size[1]/2 - (xx+TYPES[TANK.type].size[1]/2);
		dist_y = TANK.y+TYPES[TANK.type].size[1]/2 - (yy+TYPES[TANK.type].size[1]/2);
		distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
		if(distance > MAX_ALLOED_DIFFERENCE){
			TANK.x = xx;
			TANK.y = yy;
			}
		}
	}
//controlls bullet
function draw_bullets(TANK, time_gap){
	for (b = 0; b < BULLETS.length; b++){
		if(BULLETS[b].bullet_from_target.id != TANK.id) continue; // bullet from another tank
		if(TANK.stun != undefined && BULLETS[b].skill==undefined) continue; //stun
		
		TANK.last_bullet_time = Date.now();
		//follows tank
		if(BULLETS[b].bullet_to_target != undefined){
			var bullet_to_target_tank_size_to = TYPES[BULLETS[b].bullet_to_target.type].size[1];
			b_dist_x = (BULLETS[b].bullet_to_target.x+(bullet_to_target_tank_size_to/2)) - BULLETS[b].x;
  			b_dist_y = (BULLETS[b].bullet_to_target.y+(bullet_to_target_tank_size_to/2)) - BULLETS[b].y; 
  			}
  		else if(BULLETS[b].bullet_to_area != undefined){
  			//bullet with coordinates instead of target
			b_dist_x = BULLETS[b].bullet_to_area[0] - BULLETS[b].x;
  			b_dist_y = BULLETS[b].bullet_to_area[1] - BULLETS[b].y; 
  			}
  		else{
  			console.log('Error: bullet without target');
  			continue;
  			}										
		//bullet details
		b_distance = Math.sqrt((b_dist_x*b_dist_x)+(b_dist_y*b_dist_y));
		b_radiance = Math.atan2(b_dist_y, b_dist_x); 
		var bullet = get_bullet(TYPES[TANK.type].bullet);
		if(BULLETS[b].bullet_icon != undefined)
			var bullet = get_bullet(BULLETS[b].bullet_icon);
		if(bullet !== false)
			bullet_speed_tmp = speed2pixels(bullet.speed, time_gap);
		else{
			if(TYPES[TANK.type].aoe != undefined)
				bullet_speed_tmp = 1000;
			else{
				console.log("Error: missing bullet stats for "+TANK.id+" in draw_main()");
				}
			}
		BULLETS[b].x += Math.cos(b_radiance)*bullet_speed_tmp;
		BULLETS[b].y += Math.sin(b_radiance)*bullet_speed_tmp;	
		if(b_distance < bullet_speed_tmp || bullet_speed_tmp=='0'){
			//do damage
			if(BULLETS[b].bullet_to_target != undefined){
				//find target
				var bullet_target = get_tank_by_id(BULLETS[b].bullet_to_target.id);
				//calc damage
				if(bullet_target !== false){
					do_damage(TANK, bullet_target, BULLETS[b]);
							
					//extra effects for non tower
					if(bullet_target.team != TANK.team && TYPES[bullet_target.type].type!='tower'){
						if(BULLETS[b].stun_effect != undefined)
							bullet_target.stun = Date.now() + BULLETS[b].stun_effect;
						}
					}
				}								
			//aoe hit
			if(BULLETS[b].aoe_effect != undefined){
				for (var ii=0; ii < TANKS.length; ii++){
					if(TANKS[ii].team == TANK.team)
						continue; //friend
					
					//check range
					var enemy_x = BULLETS[b].bullet_to_area[0];
					var enemy_y = BULLETS[b].bullet_to_area[1];
					dist_x_b = TANKS[ii].x+TYPES[TANKS[ii].type].size[1]/2 - enemy_x;
					dist_y_b = TANKS[ii].y+TYPES[TANKS[ii].type].size[1]/2 - enemy_y;
					var distance_b = Math.sqrt((dist_x_b*dist_x_b)+(dist_y_b*dist_y_b));
					distance_b = distance_b - TYPES[TANKS[ii].type].size[1]/2;
							
					if(distance_b > BULLETS[b].aoe_splash_range)
						continue;	//too far}
					
					//do damage
					var response = do_damage(TANK, TANKS[ii], BULLETS[b]);	
					if(response === true)
						ii--;	//tank dead and removed from array, must repeat	
					}
				//draw aoe explosion
				img = new Image();
				img.src = '../img/explosion_big.png';
				canvas_main.drawImage(img, BULLETS[b].x-25+map_offset[0], BULLETS[b].y-25+map_offset[1]);
				}
			
			//remove bullet
			BULLETS.splice(b, 1); b--;	//must be done after splice
			}
		else{											
			//draw bullet
			img_bullet = new Image();
			if(BULLETS[b].bullet_icon != undefined){	
				//custom bullet
				img_bullet.src = '../img/bullets/'+BULLETS[b].bullet_icon;
				bullet_stats = get_bullet(BULLETS[b].bullet_icon);
				}
			else{	
				//default bullet
				img_bullet.src = '../img/bullets/'+TYPES[TANK.type].bullet;
				bullet_stats = get_bullet(TYPES[TANK.type].bullet);
				}
			if(TYPES[TANK.type].bullet==undefined) continue;
			bullet_x = BULLETS[b].x - round(bullet_stats.size[0]/2) + Math.round(map_offset[0]);
			bullet_y = BULLETS[b].y - round(bullet_stats.size[1]/2) + Math.round(map_offset[1]);
			//draw bullet
			if(bullet_stats.rotate == true){
				//advanced - rotate
				var padding = 20;
				if(BULLETS[b].bullet_cache != undefined){
					//read from cache
					canvas_main.drawImage(BULLETS[b].bullet_cache, bullet_x-padding, bullet_y-padding);
					}
				else{
					//create tmp
					var tmp_canvas = document.createElement('canvas');
					tmp_canvas.width = bullet_stats.size[0]*2+padding;
					tmp_canvas.height = bullet_stats.size[1]*2+padding;
					var tmp_object = tmp_canvas.getContext("2d");
					tmp_object.save();
					
					//add data
					tmp_object.translate(round(bullet_stats.size[0]/2)+padding, round(bullet_stats.size[1]/2)+padding);
					tmp_object.rotate((BULLETS[b].angle) * TO_RADIANS);
					tmp_object.drawImage(img_bullet, -(bullet_stats.size[0]/2), -(bullet_stats.size[1]/2), bullet_stats.size[0], bullet_stats.size[1]);
					
					//save to cache
					BULLETS[b].bullet_cache = tmp_canvas;
					
					//show
					canvas_main.drawImage(tmp_canvas, bullet_x, bullet_y);
					}
				}
			else{
				//simple - no rotate
				canvas_main.drawImage(img_bullet, bullet_x, bullet_y);
				}
			}
		}
	}
//adds new tank
function add_tank(level, id, name, type, team, x, y, angle, AI, master_tank, begin_time){
	if(type==undefined) type = 0;
	var space = 35;
	//default coordinates
	if(x==undefined && y==undefined && angle==undefined){
		if(team=='B'){	//blue top
			x = round(WIDTH_SCROLL*5.5/10);
			x = x + get_team_tanks_count(team)*space;
			y = 20;
			angle = 180;
			}
		else{		//red bottom 
			x = WIDTH_SCROLL*4/10;
			x = x - get_team_tanks_count(team)*space;
			y = HEIGHT_MAP-20-TYPES[type].size[1];
			angle = 0;
			}
		}
	TANK_tmp = {
		id: id,
		name: name,
		type: type,
		team: team,
		x: x,
		y: y,
		angle: angle,
		fire_angle: angle,
		move: 0,
		level: level,		
		hp: TYPES[type].life[0]+TYPES[type].life[1]*(level-1),
		abilities_lvl: [1, 1, 1],
		abilities_reuse: [0, 0, 0],
		sight: TYPES[type].scout + round(TYPES[type].size[1]/2),
		speed: TYPES[type].speed,
		armor: TYPES[type].armor[0] + TYPES[type].armor[1]*(level-1),
		damage: TYPES[type].damage[0] + TYPES[type].damage[1]*(level-1),
		attack_delay: TYPES[type].attack_delay,
		turn_speed: TYPES[type].turn_speed,
		master: master_tank,
		begin_time: Date.now(),
		death_time: 0,	//how much second tank was dead
		bullets: 0,		//how much second tank was in battle
		score: 0,
		kills: 0,
		deaths: 0,
		cache_tank: [],
		last_bullet_time: Date.now()-5000,
		};
	if(AI != undefined)
		TANK_tmp.use_AI = AI;
	if(begin_time != undefined)
		TANK_tmp.begin_time = begin_time;
	TANKS.push(TANK_tmp);
	}
