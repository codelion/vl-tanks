//draw single tank
function draw_tank(tank){
	if(PLACE != 'game' || tank == undefined) return false;
	var tank_size =  TYPES[tank.type].size[1];
	var visibility = 0;
	
	if(tank.y > -1*map_offset[1] + HEIGHT_SCROLL && FS==false){
		//skip - object below visible zone
		}
	else if(tank.y+tank_size < -1*map_offset[1] && FS==false){
		//skip - object above visible zone
		}
	else if(tank.x > -1*map_offset[0] + WIDTH_SCROLL && FS==false){
		//skip - object on right from visible zone
		}
	else if(tank.x+tank_size < -1*map_offset[0] && FS==false){
		//skip - object on left from above visible zone
		}
	else{
		visibility = 1;
		if(tank.dead == 1 && tank.death_respan != undefined){
			return false;
			}
		if(tank.dead == 1 && tank.death_respan == undefined){
			tank_size = tank_size/2;
			}
		//invisibility
		if(tank.invisibility == 1)
			tank_size = tank_size*0.8;
		
		if(check_enemy_visibility(tank)==false){
			//return false;	//out of sight
			}
		
		lighten_pixels(tank);
		
		var padding = 20;
		
		var cache_id = "";
		cache_id += "T:"+tank.type+',';
		cache_id += "TE:"+tank.team+',';
		cache_id += "A:"+tank.angle+',';
		cache_id += "SI:"+tank_size+',';
		for (i in tank.extra_icon)
			cache_id += "E:"+tank.extra_icon[i][0]+',';
		if(tank.id == MY_TANK.id)
			cache_id += 'SI,';	
		if(tank.stun != undefined)
			cache_id += 'ST,';
		if(tank.clicked_on != undefined){
			cache_id += 'EC,';
			
			tank.clicked_on = tank.clicked_on - 1;
			if(tank.clicked_on == 0)
				delete tank.clicked_on;
			}
		if(TYPES[tank.type].icon_top[0] != undefined)
			cache_id += "SA:"+tank.fire_angle+',';
		
		if(tank.cache_tank != undefined && tank.cache_tank.unique == cache_id){
			//read from cache
			canvas_main.drawImage(tank.cache_tank.object, round(tank.x+map_offset[0])-padding, round(tank.y+map_offset[1])-padding);
			}
		else{
			//create tmp
			var tmp_canvas = document.createElement('canvas');
			tmp_canvas.width = 100
			tmp_canvas.height = 100;
			var tmp_object = tmp_canvas.getContext("2d");
		
			//start adding data
			tmp_object.save();
		
			//if me - show yellow circle
			if(tank.id == MY_TANK.id){
				tmp_object.beginPath();
				var radius = tank_size/2;
				if(radius>35)
					radius=35;
				tmp_object.arc(tank_size/2+padding, tank_size/2+padding, radius, 0 , 2 * Math.PI, false);	
				tmp_object.lineWidth = 3;
				tmp_object.strokeStyle = "#e0da25";
				tmp_object.stroke();
				}
				
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
			if(tank.team == 'B')
				img_me.src = 'img/tanks/'+TYPES[tank.type].name+'/'+TYPES[tank.type].icon_base[0];
			else
				img_me.src = 'img/tanks/'+TYPES[tank.type].name+'/'+TYPES[tank.type].icon_base[1];
			if(TYPES[tank.type].icon_base[2] == "no-rotate"){
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
				tmp_object.save();
				
				img_me = new Image();
				if(tank.team == 'B')
					img_me.src = 'img/tanks/'+TYPES[tank.type].name+'/'+TYPES[tank.type].icon_top[0];
				else
					img_me.src = 'img/tanks/'+TYPES[tank.type].name+'/'+TYPES[tank.type].icon_top[1];
				tmp_object.translate(round(tank_size/2)+padding, round(tank_size/2)+padding);
				tmp_object.rotate(tank.fire_angle * TO_RADIANS);
				tmp_object.drawImage(img_me, -(tank_size/2), -(tank_size/2), tank_size, tank_size);
				
				tmp_object.restore();
				}

			
			//draw extra layer
			for (i in tank.extra_icon){
				if(tank.extra_icon[i][0]=='_SHIELD_'){
					//shield - already painted
					}
				else 	if(tank.extra_icon[i][0]=='_SLOW_'){
					//glue bomb - already painted
					}	
				else{	
					//default version
					img_me = new Image();
					img_me.src = 'img/'+tank.extra_icon[i][0];
					tmp_object.drawImage(img_me, padding+tank_size/2-tank.extra_icon[i][1]/2, padding+tank_size/2-tank.extra_icon[i][2]/2);
					}
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

	//draw tank in mini-map 20x17 - 70x116
	if(tank.respan_time == undefined && (visibility==1 || TYPES[tank.type].type=='tower')){
		//settings
		var button_width = 120;
		var button_height = 138;
		var pos1 = 5;
		var pos2 = HEIGHT_APP-150-25+5;
		//draw
		if(tank.team == 'B')
			canvas_backround.fillStyle = "#0000aa";
		else
			canvas_backround.fillStyle = "#b12525";
		msize = 3;
		if(TYPES[tank.type].type == 'human')
			msize = 2;
		var tank_x = tank.x;
		var tank_y = tank.y;	
		if(tank_x<0)	tank_x=0;
		if(tank_y<0)	tank_y=0;
		if(tank_x>MAPS[level-1].width)	tank_x=MAPS[level-1].width;
		if(tank_y>MAPS[level-1].height)	tank_y=MAPS[level-1].height;
		
		tank_x = pos1 + Math.round(tank_x * button_width / round(MAPS[level-1].width));
		tank_y = pos2 + round(tank_y * button_height /(MAPS[level-1].height));
		canvas_backround.fillRect(tank_x, tank_y, msize, msize);
		}
	}
//redrwar tanks stats in status bar	
function redraw_tank_stats(){
	status_y = HEIGHT_APP-150-25;
	var left_x = 150;
	var left_x_values = 200;
	var gap = 17;
	var top_y = HEIGHT_APP-150-25+30;
	var nr = 0;
	
	//clear
	canvas_backround.fillStyle = "#000000";
	canvas_backround.fillRect(left_x, top_y-20, 250, 130);
	
	//font
	canvas_backround.fillStyle = "#8fc74c";
	canvas_backround.font = "bold 9px Verdana";
	
	//level
	canvas_backround.fillText("Level:", left_x, top_y+nr*gap);
	var text = Math.floor(MY_TANK.armor);
	canvas_backround.fillText(MY_TANK.level, left_x_values, top_y+nr*gap);
	nr++;
	
	//life
	canvas_backround.fillText("Life:", left_x, top_y+nr*gap);
	var text = round(MY_TANK.hp)+"/"+(TYPES[MY_TANK.type].life[0]+TYPES[MY_TANK.type].life[1]*(MY_TANK.level-1));
	canvas_backround.fillText(text, left_x_values, top_y+nr*gap);
	nr++;
	
	//damage
	canvas_backround.fillText("Damage:", left_x, top_y+nr*gap);
	var dps_string = parseInt(MY_TANK.damage)/parseInt(MY_TANK.attack_delay);
	if(MY_TANK.debuffs != undefined){
		damage_first = dps_string;
		for(var dd in MY_TANK.debuffs){
			if(MY_TANK.debuffs[dd][0]=='weak'){
				var diff = damage_first * MY_TANK.debuffs[dd][1] / 100;
				dps_string = dps_string - diff;
				if(dps_string < 0)
					dps_string = 0;
				}
			}
		}
	dps_string = Math.floor(dps_string);
	canvas_backround.fillText(dps_string+" DPS", left_x_values, top_y+nr*gap);
	nr++;
	
	//armor
	canvas_backround.fillText("Armor:", left_x, top_y+nr*gap);
	var armor_text = Math.floor(MY_TANK.armor);
	canvas_backround.fillText(armor_text+"%", left_x_values, top_y+nr*gap);
	nr++;
	
	//accuracy
	canvas_backround.fillText("Acuracy:", left_x, top_y+nr*gap);
	var accuracy = TYPES[MY_TANK.type].accuracy;
	if(MY_TANK.move==1)
		accuracy = accuracy-10;
	canvas_backround.fillText(accuracy+"%", left_x_values, top_y+nr*gap);
	nr++;
	
	//range
	canvas_backround.fillText("Range:", left_x, top_y+nr*gap);
	canvas_backround.fillText(TYPES[MY_TANK.type].range+" meters", left_x_values, top_y+nr*gap);
	nr++;
	
	//speed
	canvas_backround.fillText("Speed:", left_x, top_y+nr*gap);
	var speed_text = MY_TANK.speed;
	if(MY_TANK.debuffs != undefined){
		speed_first = speed_text;
		for(var dd in MY_TANK.debuffs){
			if(MY_TANK.debuffs[dd][0]=='slow'){
				var diff = speed_first * MY_TANK.debuffs[dd][1] / 100;
				speed_text = speed_text - diff;
				if(speed_text < 0)
					speed_text = 0;
				}
			}
		}
	speed_text = Math.floor(speed_text)+" kph";
	canvas_backround.fillText(speed_text, left_x_values, top_y+nr*gap);
	nr++;
	
	nr=0;
	var left_x = 150+150;
	var left_x_values = 200+150;
	
	//kills
	canvas_backround.fillText("Kills:", left_x, top_y+nr*gap);
	var text;
	if(MY_TANK.kills != undefined)
		text = MY_TANK.kills;
	else
		text = 0;
	canvas_backround.fillText(text, left_x_values, top_y+nr*gap);
	nr++;
	
	//deaths
	canvas_backround.fillText("Deaths:", left_x, top_y+nr*gap);
	var text;
	if(MY_TANK.deaths != undefined)
		text = MY_TANK.deaths;
	else
		text = 0;
	canvas_backround.fillText(text, left_x_values, top_y+nr*gap);
	nr++;
	
	//show fps
	update_fps();
	}
var ABILITIES_POS = [];
//redraw tank skills
function draw_tank_abilities(){
	var gap = 10;
	var status_x_tmp = 569+gap;
	var status_y = HEIGHT_APP-150-25+4+gap;
	var letter_width = 5.5;
	
	for (i in TYPES[MY_TANK.type].abilities){
		//check if abilites not in use
		if(MY_TANK['ability_'+(1+parseInt(i))+'_in_use'] != undefined)
			continue;
		
		//button
		if(TYPES[MY_TANK.type].abilities[i].passive == false){
			//passive
			canvas_backround.strokeStyle = "#196144";
			canvas_backround.fillStyle = "#8fc74c";
			roundRect(canvas_backround, status_x_tmp+i*(SKILL_BUTTON+gap), status_y, SKILL_BUTTON, SKILL_BUTTON, 3, true);
			}
		else{
			canvas_backround.strokeStyle = "#196144";
			canvas_backround.fillStyle = "#69a126";
			roundRect(canvas_backround, status_x_tmp+i*(SKILL_BUTTON+gap), status_y, SKILL_BUTTON, SKILL_BUTTON, 3, true);
			}
			
		//text
		ability_text = TYPES[MY_TANK.type].abilities[i].name;
		canvas_backround.fillStyle = "#196119";
		canvas_backround.font = "bold 10px Verdana";
		if(ability_text.length>9)
			canvas_backround.font = "bold 8px Verdana";
		canvas_backround.fillText(ability_text, status_x_tmp+i*(SKILL_BUTTON+gap)+Math.floor((SKILL_BUTTON-ability_text.length*letter_width)/2), status_y+SKILL_BUTTON/2+3);
	
		//save position
		if(ABILITIES_POS.length < TYPES[MY_TANK.type].abilities.length){
			var tmp = new Array();
			tmp['x'] = status_x_tmp+i*70;
			tmp['y'] = status_y;
			tmp['width'] = SKILL_BUTTON;
			tmp['height'] = SKILL_BUTTON;
			tmp['nr'] = parseInt(i)+1;
			ABILITIES_POS.push(tmp);
			}
		}
	}
//draw tanks skills reuse animation
function draw_ability_reuse(object){
	var gap = 10;
	var status_x_tmp = 569+gap;
	var status_y = HEIGHT_APP-150-25+4+gap;
	var letter_width = 5.5;
	
	if(object != undefined){
		if(object['tank']['respan_time'] != undefined || object['tank']['ability_'+(object.nr+1)+'_in_use'] != 1){
			object.duration=0;	//tank dead
			}
		
		var i = object.nr;
		
		if(object.duration==0){
			delete object['tank']['ability_'+(i+1)+'_in_use'];
			}
		
		//button
		if(TYPES[MY_TANK.type].abilities[i].passive == false){
			//passive
			canvas_backround.strokeStyle = "#196144";
			canvas_backround.fillStyle = "#8fc74c";
			roundRect(canvas_backround, status_x_tmp+i*(SKILL_BUTTON+gap), status_y, SKILL_BUTTON, SKILL_BUTTON, 3, true);
			}
		else{
			canvas_backround.strokeStyle = "#196144";
			canvas_backround.fillStyle = "#69a126";
			roundRect(canvas_backround, status_x_tmp+i*(SKILL_BUTTON+gap), status_y, SKILL_BUTTON, SKILL_BUTTON, 3, true);
			}
		
		//if active
		if(TYPES[MY_TANK.type].abilities[i].passive == false){
			var img = new Image();
			var img_height = SKILL_BUTTON * object.duration / object.max;
			if(img_height<1){
				canvas_backround.fillStyle = "#8fc74c";
				img_height = SKILL_BUTTON;
				}
			else
				canvas_backround.fillStyle = "#69a126";
			//canvas_backround.fillStyle = "#ff0000";
			canvas_backround.fillRect(status_x_tmp+i*(SKILL_BUTTON+gap), status_y, SKILL_BUTTON, Math.floor(img_height));
			}
	
		//text
		canvas_backround.fillStyle = "#196119";
		canvas_backround.font = "bold 10px Verdana";
		var ability_text = TYPES[MY_TANK.type].abilities[i].name;
		if(ability_text.length>9)
			canvas_backround.font = "bold 8px Verdana";
		canvas_backround.fillText(ability_text, status_x_tmp+i*(SKILL_BUTTON+gap)+Math.floor((SKILL_BUTTON-ability_text.length*letter_width)/2), status_y+SKILL_BUTTON/2+3);
		}
	}
var ability_hover_id = '-1';
var ability_hover_text = '';
//show skills descriptino on mouse hover
function show_skill_description(){
	var gap = 10;
	var status_x_tmp = 569+gap;
	var status_y = HEIGHT_APP-150-25+4+gap;
	
	//clean description
	canvas_backround.fillStyle = "#000000";
	canvas_backround.fillRect(status_x_tmp, status_y+110-10, 210, 25);
	
	var limit = 35;
	var ability_hover_text_more = '';
	if(ability_hover_text.length > limit){
		var words = ability_hover_text.split(" ");
		ability_hover_text = '';
		for(var i in words){
			if(ability_hover_text.concat(' ').concat(words[i]).length < limit)
				ability_hover_text = ability_hover_text+" "+words[i];
			else 
				ability_hover_text_more = ability_hover_text_more+" "+words[i];
			}
		}
	
	//show description
	canvas_backround.fillStyle = "#196119";
	canvas_backround.font = "bold 10px Verdana";
	canvas_backround.fillText(ability_hover_text, status_x_tmp, status_y+110);
	
	canvas_backround.fillStyle = "#196119";
	canvas_backround.font = "bold 10px Verdana";
	canvas_backround.fillText(ability_hover_text_more, status_x_tmp, status_y+110+13);
	}
//tank hp bar above
function add_hp_bar(tank){
	xx = round(tank.x+map_offset[0]);
	yy = round(tank.y+map_offset[1]);
	life = tank.hp*100/(TYPES[tank.type].life[0]+TYPES[tank.type].life[1]*(tank.level-1));
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
		
		tmp_object.font = "normal 9px Verdana";
		tmp_object.fillText(player_name, 0+name_padding, 12);
		
		//save to cache
		tank.cache_name = [];
		tank.cache_name.object = tmp_canvas;
		tank.cache_name.level = tank.level;
		
		//show
		canvas_main.drawImage(tmp_canvas, xx, yy-2);
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
				
		//check clicks
		var found_something = false;
		target_lock_id=0;
		if(MY_TANK.target_move_lock != undefined)
			delete MY_TANK.target_move_lock;
		if(MY_TANK['respan_time'] == undefined){ 
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
	
		var tank_size = TYPES[my_tank_nr].size[1];
		mouseX = mouseX-tank_size/2;	
		mouseY = mouseY-tank_size/2;
		mouseX = Math.floor(mouseX);
		mouseY = Math.floor(mouseY);
		
		//register
		if(game_mode == 2){
			if(found_something==true)
				register_tank_action('move', opened_room_id, name, [round(MY_TANK.x), round(MY_TANK.y), round(mouseX), round(mouseY), target_lock_id]);
			else
				register_tank_action('move', opened_room_id, name, [round(MY_TANK.x), round(MY_TANK.y), round(mouseX), round(mouseY)]);
			TANK.move = 0;
			return false;
			}
		else{
			MY_TANK['move'] = 1;
			MY_TANK['move_to'] = [mouseX, mouseY];
			
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
function check_collisions(xx, yy, TANK, mode){
	if(TYPES[TANK.type].no_collisions != undefined) return false;
	xx = Math.round(xx);
	yy = Math.round(yy);
	var tank_size_half = round(TYPES[TANK.type].size[1]/2);
	if(TYPES[TANKS[i].type].type == 'human')
		tank_size_half = round(tank_size_half/2);	//soldiers small

	//elements
	if(mode == undefined || mode == 'elements'){	
		for(var e in MAPS[level-1].elements){
			var element = get_element_by_name(MAPS[level-1].elements[e][0]);
			if(element.collission == false) continue;
			
			var elem_width = element.size[0];
			var elem_height = element.size[1];
			var elem_x = MAPS[level-1].elements[e][1];
			var elem_y = MAPS[level-1].elements[e][2]-round(element.size[1]/2);
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
		}

	//other tanks
	if(mode == undefined || mode == 'tanks'){	
		if(TYPES[TANK.type].types != 'tower'){
			for (i in TANKS){
				if(TANKS[i].id == TANK.id) continue;			//same tank
				if(TYPES[TANK.type].type == 'tank' && TYPES[TANKS[i].type].type == 'human') continue;	//tanks can go over soldiers
				if(TYPES[TANK.type].type == 'human' && TYPES[TANKS[i].type].type == 'tank') continue;	//soldiers can go over tanks, why? see above
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
		}
	
	return false;
	}
//checks tanks levels
function tank_level_handler(){
	for (i in TANKS){
		if(TANKS[i].dead == 1 || TANKS[i].type == 'tower') 
			return false; //dead or tower
		if(TANKS[i].hit_reuse - Date.now() > 0)
			TANKS[i].sublevel = TANKS[i].sublevel + 15;	//shooting
		else
			TANKS[i].sublevel = TANKS[i].sublevel + 10;	//not shooting
		
		if(TANKS[i].sublevel > 100){					//lvl-up
			TANKS[i].level = TANKS[i].level + 1;
			TANKS[i].armor = TANKS[i].armor + TYPES[TANKS[i].type].armor[1];
			TANKS[i].damage = TANKS[i].damage + TYPES[TANKS[i].type].damage[1];
			
			if(TANKS[i].armor > TYPES[TANKS[i].type].armor[2])
				TANKS[i].armor = TYPES[TANKS[i].type].armor[2];
			TANKS[i].sublevel = 0;
			redraw_tank_stats();	
			if(TANKS[i].score == undefined)
				TANKS[i].score = 0;
			TANKS[i].score = TANKS[i].score + 23;	// +23 for 1 lvl
			if(TANKS[i].id == MY_TANK.id)
				draw_tank_abilities();
			}
		}
	}
//checks tanks hp regen
function level_hp_regen_handler(){		//once per 1 second - 1%/s
	for (i in TANKS){
		if(TANKS[i].dead == 1 || TANKS[i].type == 'tower') continue;
		if(TYPES[TANKS[i].type].no_repawn == undefined){
			var max_hp = TYPES[TANKS[i].type].life[0] + TYPES[TANKS[i].type].life[1] * (TANKS[i].level-1);
			//passive hp regain - 1%/s
			var extra_hp = max_hp * 1.0 / 100;
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
		}
	redraw_tank_stats();
	}
//actions on enemies
function check_enemies(TANK){
	if(TANK['dead'] == 1) return false;
	if(TANK['stun'] != undefined) return false;
	range = TYPES[TANK.type].range;
	if(TANK.hit_reuse == undefined) TANK.hit_reuse = TANK.attack_delay*1000+Date.now();
	
	//wait for reuse
	if(TANK.hit_reuse - Date.now() > 0)
		return false;
	//wait for reuse
	if(TANK.check_enemies_reuse - Date.now() > 0)
		return false;
	
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
		delete TANK.invisibility;
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
			
			var tmp = new Array();
			tmp['x'] = TANK.x+tank_size_from/2;
			tmp['y'] = TANK.y+tank_size_from/2;
			tmp['bullet_to_target'] = TANKS[i]; 
			tmp['bullet_from_target'] = TANK;
			tmp['angle'] = round(f_angle);
			BULLETS.push(tmp);
			TANK.hit_reuse = TANK.attack_delay*1000+Date.now();	
			TANK.fire_angle = round(f_angle);
			found = true;
			TANK.attacking = TANKS[i].id;
			TANK.check_enemies_reuse = 0;
			shoot_sound(TANK);
			draw_fire(TANK, TANKS[i]);
			}
		}
	if(TANK.invisibility==1) return false;
	
	//no target lock - closest enemy
	if(found==false){
		var ENEMY_NEAR;
		for (i in TANKS){				
			if(TANKS[i].team == TANK.team)
				continue;	//same team
			if(TANKS[i].dead == 1)
				continue;	//target dead
			if(TANK.target_shoot_lock != undefined && TANKS[i].id == TANK.target_shoot_lock){
				if(TYPES[TANK.type].aoe == undefined)
					continue;	//already checked above
				}
			if(TANKS[i].invisibility==1)
				continue;	//blur mode
			
			distance = get_distance_between_tanks(TANKS[i], TANK);
			
			if(distance > range){
				//target too far
				continue;	
				}
			//range ok
			if(ENEMY_NEAR==undefined){
				ENEMY_NEAR = [range, i];
				}
			else if(distance < ENEMY_NEAR[0]){
				ENEMY_NEAR = [range, i];
				}
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
		
		var tmp = new Array();
		tmp['x'] = TANK.x+tank_size_from/2;
		tmp['y'] = TANK.y+tank_size_from/2;
		tmp['bullet_to_target'] = TANKS[i]; 
		tmp['bullet_from_target'] = TANK;
		tmp['angle'] = round(f_angle);
		BULLETS.push(tmp);
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
			
			var tmp = new Array();
			tmp['x'] = TANK.x+tank_size_from/2;
			tmp['y'] = TANK.y+tank_size_from/2;
			tmp['bullet_to_target'] = TANKS[i]; 
			tmp['bullet_from_target'] = TANK;
			tmp['angle'] = round(f_angle);
			BULLETS.push(tmp);
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
	if(found == false && TANK.move == 0 && TYPES[TANK.type].type == 'human')
		TANK.move = 1;
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
	drawImage_rotated(canvas_main, 'img/explosion.png', explode_x+map_offset[0], explode_y+map_offset[1], 24, 32, TANK.fire_angle);
	}
//shooting
function shoot_sound(TANK){
	if(muted==true) return false;
	if(TANK.id != MY_TANK.id) return false;
	if(TYPES[TANK.type].fire_sound == undefined) return false;
	try{
		var audio_fire = document.createElement('audio');
		audio_fire.setAttribute('src', 'sounds/'+TYPES[TANK.type].fire_sound);
		audio_fire.play();
		}
	catch(error){}
	}
//damage to other tank function
function do_damage(TANK, TANK_TO, force_damage, armor_piercing_force){
	if(TANK_TO == undefined) return false;
	if(TANK_TO.dead == 1) return false;
	
	//accuracy
	var accuracy = TYPES[TANK.type].accuracy;
	if(TANK.move==1)
		accuracy = accuracy-10;
	if(TANK_TO.move==1)
		accuracy = accuracy-10;
	if(getRandomInt(1, 10) > accuracy/10) return false;
	
	//sound	fire_sound - i was hit
	if(TANK_TO.id == MY_TANK.id && muted==false){
		try{
			var audio_fire = document.createElement('audio');
			audio_fire.setAttribute('src', 'sounds/metal.ogg');
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
	
	if(force_damage != undefined)
		damage = force_damage;
	armor = TANK_TO.armor;
	if(armor > TYPES[TANK_TO.type].armor[2])
		armor = TYPES[TANK_TO.type].armor[2];
	
	//check armor_piercing
	if(TANK.armor_piercing != undefined && armor_piercing_force == undefined){
		armor = armor - TANK.armor_piercing;
		if(armor<0)
			armor=0;
		}
	else if(armor_piercing_force != undefined){
		if(TYPES[TANK_TO.type]!= 0)	//splodge armor too strong
			armor = 0;
		}
	
	if(TYPES[TANK.type].ignore_armor != undefined)
		armor = 0;	//pierce armor
	damage = round( damage*(100-armor)/100 );		//log(damage+", target armor="+armor+", type="+TYPES[TANK_TO.type].name);
	
	//stats
	if(TYPES[TANK_TO.type].name=="Tower" || TYPES[TANK_TO.type].name=="Base"){
		if(TANK.towers == undefined)
			TANK.towers = 0;
		var damage_at_tower = damage / TYPES[TANK_TO.type].life[0];
		if(TANK_TO.hp < damage)
			damage_at_tower = TANK_TO.hp / TYPES[TANK_TO.type].life[0];
		
		TANK.towers = TANK.towers + damage_at_tower;	
		
		if(TANK.score == undefined)
			TANK.score = 0;
		TANK.score = TANK.score + 50 * (damage / TYPES[TANK_TO.type].life[0]);	// 50 point for 1 tower
		}
	
	//check hp_vampiric_proc
	if(TANK.hp_vampiric_proc != undefined){
		var hp_to_regen = damage*TANK.hp_vampiric_proc/100;
		var max_hp = TYPES[TANK.type].life[0]+TYPES[TANK.type].life[1]*(TANK.level-1);
		if(TANK.hp+hp_to_regen < max_hp)
			TANK.hp = TANK.hp + hp_to_regen;
		else if(TANK.hp+hp_to_regen >= max_hp)
			TANK.hp = max_hp;		
		}		
	
	life_total = TANK_TO.hp;
	if(life_total-damage>0){
		TANK_TO.hp = TANK_TO.hp - damage;
		if(TANK_TO.id == TANK_TO.id)
			redraw_tank_stats();
		}
	//death	
	else{	
		//if me - redraw stats
		if(TANK_TO.id == MY_TANK.id)
			redraw_tank_stats();
		
		//updates deaths
		if(TANK_TO.deaths == undefined)
			TANK_TO.deaths = 1;
		else
			TANK_TO.deaths = TANK_TO.deaths + 1;
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
				if(check_if_broadcast_kill(TANK, TANK_TO)==true)
					register_tank_action('kill', opened_room_id, killer.name, TANK_TO.id);
				}
			else{
				//remove tank
				var del_index = false;
				for(var j in TANKS){
					if(TANKS[j].id == TANK_TO.id){
						TANKS.splice(j, 1);
						break;
						}
					}
				}
			}
		else{ //tank with respawn
			//if tank
			if(TYPES[TANK_TO.type].type == 'tank'){
				//update kills
				if(game_mode == 1){
					if(killer.kills == undefined)
						killer.kills = 1;
					else
						killer.kills = killer.kills + 1;
					//add score
					if(TANK.score == undefined)
						TANK.score = 0;
					TANK.score = TANK.score + 20;	// +20 for kill
					}
				if(game_mode==2){
					var killer = killer.name;
					if(killer != undefined)
						register_tank_action('chat', opened_room_id, false, "Player "+TANK_TO.name+" was killed by "+killer.name+"!");
					}	
				}
			if(game_mode == 2 && TYPES[TANK_TO.type].type != 'human' && check_if_broadcast_kill(TANK, TANK_TO)==true)
				register_tank_action('kill', opened_room_id, killer.name, TANK_TO.id);
		
			//player death			
			if(game_mode == 1)
				death(TANK_TO);	
			}
		}
	}
//check if broadcast other tank kill
function check_if_broadcast_kill(KILLER, VICTIM){
	var ROOM = get_room_by_id(opened_room_id);
	
	//me killer
	if(KILLER.name = name) return true;	
	
	//only host broadcast tower kills
	if(TYPES[KILLER.type].type == 'tower' && ROOM.host == name) return true; 
	
	//my soldier killer - me broadcast
	if(TANK.master != undefined && TANK.master.name == name) return true; 
	
	return false;
	}
//tank death
function death(tank){
	tank.hp = 0;
	tank.move = 0;

	//renew specials
	delete tank['ability_1_in_use'];
	delete tank['ability_2_in_use'];
	delete tank['ability_3_in_use'];
	delete tank['target_move_lock'];
	delete tank['target_shoot_lock'];
	
	tank['move'] = 0;
	tank['death_respan'] = 2*1000+Date.now();
	tank['dead'] = 1;
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
		if(type=='') alert('ERROR: wrong type "'+MAPS[level-1]['towers'][i][3]+'" in maps definition.');
		var team = MAPS[level-1]['towers'][i][0];	
		var width_tmp = WIDTH_MAP - TYPES[type].size[1];
		var height_tmp = HEIGHT_MAP - TYPES[type].size[1];
		var x = round(MAPS[level-1]['towers'][i][1]*width_tmp/100);
		var y = round(MAPS[level-1]['towers'][i][2]*height_tmp/100);
		var angle = 180;
		if(team != 'B')
			angle = 0;
		//add
		add_tank(1, 'tow'+team+x+"."+y, '', type, team, x, y, angle);
		}
	}
//tank special ability activated	
function do_ability(nr, TANK){
	if(TANK['ability_'+nr+'_in_use'] == 1) return false;
	if(TANK['dead'] == 1) return false;
	if(TYPES[TANK.type].abilities[nr-1] == undefined) return false;
	var ability_function = TYPES[TANK.type].abilities[nr-1].name.replace(/ /g,'_');
	var broadcast_mode = TYPES[TANK.type].abilities[nr-1].broadcast;
	if(ability_function != undefined){
		if(game_mode == 1){
			//execute
			var ability_reuse = window[ability_function](TANK);
			if(ability_reuse != undefined && ability_reuse != 0){
				TANK['ability_'+nr+'_in_use']=1;
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
					TANK['ability_'+nr+'_in_use']=1;
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
				register_tank_action('skill_do', opened_room_id, name,  nr);
				}
			else if(broadcast_mode==2){
				//broadcast later
				var ability_reuse = window[ability_function](TANK);
				if(ability_reuse != undefined && ability_reuse != 0){
					TANK['ability_'+nr+'_in_use']=1;
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
		
		var range = TANKS[i].sight;
		if(distance < range){
			tank.cache_scouted_reuse = 1000+Date.now();
			tank.cache_scouted = true;
			return true;	//found by enemy
			}				
		}
	tank.cache_scouted_reuse = 1000+Date.now();
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
		if(TYPES[t].hide_name==undefined)
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
			return {
				index: i,
				id: TANKS[i].id,
				range: distance,
				type: TANKS[i].type,
				};
			}
		}
	return false;
	}
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
function add_tank(level, id, name, type, team, x, y, angle, AI, master_tank){
	if(type==undefined) type = 0;
	//default coordinates
	if(x==undefined && y==undefined && angle==undefined){
		if(team=='B'){	//blue top
			x = round(WIDTH_SCROLL*2/3);
			y = 20;
			angle = 180;
			}
		else{		//red bottom 
			x = WIDTH_SCROLL/3;
			y = HEIGHT_MAP-20-TYPES[type].size[1];
			angle = 0;
			}
		}
	TANK = {
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
		sublevel: 0,			
		hp: TYPES[type].life[0]+TYPES[type].life[1]*(level-1),
		abilities_lvl: [1,1,1],
		sight: TYPES[type].scout + round(TYPES[type].size[1]/2),
		speed: TYPES[type].speed,
		armor: TYPES[type].armor[0] + TYPES[type].armor[1]*(level-1),
		damage: TYPES[type].damage[0] + TYPES[type].damage[1]*(level-1),
		attack_delay: TYPES[type].attack_delay,
		turn_speed: TYPES[type].turn_speed,
		master: master_tank,
		};
	if(AI != undefined)
		TANK.use_AI = AI;
	if(master_tank != true)
		TANK.master = master_tank;		
	TANKS.push(TANK);
	}
