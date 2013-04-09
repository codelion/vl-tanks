//draw infobar
function draw_infobar(){
	//background background
	canvas_backround.fillStyle = "#233012";
	canvas_backround.fillRect(0, status_y, WIDTH_APP, INFO_HEIGHT);
	
	//image
	var img = new Image();
	img.src = '../img/statusbar.png';
	canvas_backround.drawImage(img, status_x, status_y);
	
	//tank icon
	var icon_x = status_x+140;
	if(TYPES[MY_TANK.type].preview != undefined){
		var img = new Image();
		img.src = "../img/tanks/"+TYPES[MY_TANK.type].name+'/'+TYPES[MY_TANK.type].preview;
		canvas_backround.drawImage(img, icon_x, status_y+37);
		}
		
	//tank name
	canvas_backround.fillStyle = "#a3ad16";
	canvas_backround.font = "bold 10px Verdana";	
	canvas_backround.fillText(TYPES[MY_TANK.type].name, icon_x-5, status_y+25);
		
	draw_status_bar();
	
	redraw_tank_stats();
	
	//abilities
	draw_tank_abilities();
	for(var i=0; i<ABILITIES_POS.length; i++){
		//register skill button
		register_button(ABILITIES_POS[i].x, ABILITIES_POS[i].y, ABILITIES_POS[i].width, ABILITIES_POS[i].height, PLACE, function(xx, yy, i){
			do_ability(ABILITIES_POS[i].nr, MY_TANK);
			}, i);
		}
	}
//redrwar tanks stats in status bar
function redraw_tank_stats(){
	status_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT;
	var left_x = status_x+255;
	var left_x_values = status_x+305;
	var gap = 19;
	var top_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+40;
	
	//clear
	var img = new Image();	
	img.src = '../img/statusbar.png';
	canvas_backround.drawImage(img, 300, 20, 260, 60, status_x+300, top_y-20, 260, 60);
	
	//level
	canvas_backround.fillStyle = "#182605";
	canvas_backround.fillRect(status_x+195, status_y+15, 23, 15);
	//draw
	canvas_backround.fillStyle = "#939b84";
	canvas_backround.font = "normal 18px Verdana";
	var text = Math.floor(MY_TANK.level);
	canvas_backround.fillText(text, status_x+195, status_y+28);
	
	//font
	canvas_backround.fillStyle = "#a3ad16";
	canvas_backround.font = "bold 10px Verdana";
	
	//damage
	var damage_string = MY_TANK.damage;
	if(MY_TANK.debuffs != undefined){
		damage_first = damage_string;
		for(var dd in MY_TANK.debuffs){
			if(MY_TANK.debuffs[dd][0]=='weak'){
				var diff = damage_first * MY_TANK.debuffs[dd][1] / 100;
				damage_string = damage_string - diff;
				if(damage_string < 0)
					damage_string = 0;
				}
			}
		}
	damage_string = Math.floor(damage_string);
	canvas_backround.fillText(damage_string, left_x_values, top_y);
	
	//armor
	var armor_text = Math.floor(MY_TANK.armor);
	canvas_backround.fillText(armor_text+"%", left_x_values, top_y+28);
	
	left_x = status_x+374;
	left_x_values = status_x+414;
	
	//range
	canvas_backround.fillText(TYPES[MY_TANK.type].range+" m.", left_x_values, top_y);
	
	//speed
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
	speed_text = Math.floor(speed_text)+" km/h";
	canvas_backround.fillText(speed_text, left_x_values, top_y+28);
	
	left_x = status_x+492;
	left_x_values = status_x+535;
	
	//kills
	var text;
	text = MY_TANK.kills;
	canvas_backround.fillText(text, left_x_values, top_y);
	
	//deaths
	var text = MY_TANK.deaths;
	canvas_backround.fillText(text, left_x_values, top_y+28);
	
	//life
	life_x = status_x+315;
	life_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+100;
	life_width = 150;
	life_height = 15;
	//reset
	canvas_backround.fillStyle = "#770f10";
	canvas_backround.fillRect(life_x, life_y, life_width, life_height);
	//fill
	var hp = round(MY_TANK.hp);
	var hp_max = TYPES[MY_TANK.type].life[0]+TYPES[MY_TANK.type].life[1]*(MY_TANK.level-1);
	//canvas_backround.fillStyle = "#47780d";
	//canvas_backround.fillRect(life_x, life_y, round(life_width*hp/hp_max), life_height);
	var img = new Image();
	img.src = '../img/level.png';
	canvas_backround.drawImage(img, life_x, life_y, round(life_width*hp/hp_max), life_height);
	
	//text
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "normal 9px Verdana";
	canvas_backround.fillText(hp+"/"+hp_max, life_x+life_width-54, life_y+life_height-5);
	
	//players
	if(game_mode == 2){
		canvas_backround.fillStyle = "#294111";
		canvas_backround.font = "normal 10px Verdana";
		ROOM = get_room_by_id(opened_room_id);
		var text = ROOM.players_on+"/"+ROOM.players_max;
		canvas_backround.fillText(text, status_x+225, HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+110);
		}
	
	//show fps
	update_fps();
	}
var ABILITIES_POS = [];
//redraw tank skills
function draw_tank_abilities(){
	var gap = 15;
	var status_x_tmp = status_x+586;
	var status_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+gap+1;
	var letter_width = 5.5;
	
	for (i in TYPES[MY_TANK.type].abilities){
		//check if abilites not in use
		if(MY_TANK['ability_'+(1+parseInt(i))+'_in_use'] != undefined)
			continue;
		
		//borders
		var img = new Image();
		img.src = '../img/skill.png';
		canvas_backround.drawImage(img, status_x_tmp+i*(SKILL_BUTTON+gap)-5, status_y-5, SKILL_BUTTON+10, SKILL_BUTTON+10);
		
		//button
		if(TYPES[MY_TANK.type].abilities[i].passive == false){
			//active
			canvas_backround.fillStyle = "#6cba40";
			canvas_backround.fillRect(status_x_tmp+i*(SKILL_BUTTON+gap), status_y, SKILL_BUTTON, SKILL_BUTTON);
			}
		else{
			//passive
			canvas_backround.fillStyle = "#485c2b";
			canvas_backround.fillRect(status_x_tmp+i*(SKILL_BUTTON+gap), status_y, SKILL_BUTTON, SKILL_BUTTON);
			}
			
		//text
		ability_text = TYPES[MY_TANK.type].abilities[i].name;
		canvas_backround.fillStyle = "#1d2411";
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
	var gap = 15;
	var status_x_tmp = status_x+586;
	var status_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+gap+1;
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
			//active
			canvas_backround.fillStyle = "#6cba40";
			canvas_backround.fillRect(status_x_tmp+i*(SKILL_BUTTON+gap), status_y, SKILL_BUTTON, SKILL_BUTTON);
			}
		else{
			//pasive
			canvas_backround.fillStyle = "#485c2b";
			canvas_backround.fillRect(status_x_tmp+i*(SKILL_BUTTON+gap), status_y, SKILL_BUTTON, SKILL_BUTTON);
			}
		
		//if active
		if(TYPES[MY_TANK.type].abilities[i].passive == false){
			var img = new Image();
			var img_height = SKILL_BUTTON * object.duration / object.max;
			if(img_height<1){
				canvas_backround.fillStyle = "#6cba40";
				img_height = SKILL_BUTTON;
				}
			else
				canvas_backround.fillStyle = "#485c2b";
			canvas_backround.fillRect(status_x_tmp+i*(SKILL_BUTTON+gap), status_y, SKILL_BUTTON, Math.floor(img_height));
			}
	
		//text
		canvas_backround.fillStyle = "#1d2411";
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
	var status_x_tmp = status_x+575+gap;
	var status_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+5+78;
	
	//clean description
	canvas_backround.fillStyle = "#17200b";
	canvas_backround.fillRect(status_x_tmp, status_y, 205, 35);
	
	var limit = 35;
	var ability_hover_text_more = '';
	if(ability_hover_text.length > limit){
		var words = ability_hover_text.split(" ");
		ability_hover_text = '';
		active_line = 1;
		for(var i in words){
			if(ability_hover_text.concat(' ').concat(words[i]).length < limit && active_line==1)
				ability_hover_text = ability_hover_text+" "+words[i];
			else{ 
				ability_hover_text_more = ability_hover_text_more+" "+words[i];
				active_line=2;
				}
			}
		}
	
	//show description
	canvas_backround.fillStyle = "#8f947d";
	canvas_backround.font = "bold 10px Verdana";
	canvas_backround.fillText(ability_hover_text, status_x_tmp+5, status_y+13);
	
	canvas_backround.fillStyle = "#8f947d";
	canvas_backround.font = "bold 10px Verdana";
	canvas_backround.fillText(ability_hover_text_more, status_x_tmp+5, status_y+13+13);
	}
//move map by user mouse coordinates on mini map
function move_to_place(mouse_x, mouse_y){
	//settings
	area_width = MINI_MAP_PLACE[2];
	area_height = MINI_MAP_PLACE[3];
	mouse_x = mouse_x - MINI_MAP_PLACE[0];
	mouse_y = mouse_y - (APP_SIZE_CACHE[1]-INFO_HEIGHT-STATUS_HEIGHT+MINI_MAP_PLACE[1]);
	
	visible_block_x_half = WIDTH_SCROLL*area_width/WIDTH_MAP/2;
	visible_block_y_half = HEIGHT_SCROLL*area_height/HEIGHT_MAP/2;
	
	//check
	if(mouse_x-visible_block_x_half<0)	mouse_x=visible_block_x_half;
	if(mouse_y-visible_block_y_half<0)	mouse_y=visible_block_y_half;
	if(mouse_x+visible_block_x_half>area_width)	mouse_x=area_width-visible_block_x_half;
	if(mouse_y+visible_block_y_half>area_height)	mouse_y=area_height-visible_block_y_half;
	
	//calc	
	mouse_x = mouse_x - visible_block_x_half;
	mouse_y = mouse_y - visible_block_y_half;
	pos_x_pecentage = round(mouse_x*100/area_width);
	pos_y_pecentage = round(mouse_y*100/area_height);
	tmp_x = round(WIDTH_MAP*pos_x_pecentage/100);
	tmp_y = round(HEIGHT_MAP*pos_y_pecentage/100);

	//scroll map here
	map_offset[0] = -tmp_x;
	map_offset[1] = -tmp_y;
	document.getElementById("canvas_map").style.marginLeft = map_offset[0]+"px";
	document.getElementById("canvas_map").style.marginTop = map_offset[1]+"px";
	}
//mini map in status bar
function redraw_mini_map(){
	//settings
	var button_width = MINI_MAP_PLACE[2];
	var button_height = MINI_MAP_PLACE[3];
	var pos1 = status_x+MINI_MAP_PLACE[0];
	var pos2 = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+MINI_MAP_PLACE[1];
	var border = MINI_MAP_PLACE[4];
	
	//clear mini map - borders
	canvas_backround.fillStyle = "#162508";
	canvas_backround.fillRect(pos1-border, pos2-border, button_width+border*2, button_height+border*2);
	
	//white color
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.fillRect(pos1, pos2, button_width, button_height);
	
	//active zone
	canvas_backround.fillStyle = "#97998c";
	canvas_backround.fillRect(
		pos1-map_offset[0]*button_width/WIDTH_MAP, 
		pos2-map_offset[1]*button_height/HEIGHT_MAP, 
		WIDTH_SCROLL*button_width/WIDTH_MAP, 
		HEIGHT_SCROLL*button_height/HEIGHT_MAP
		);
		
	//elements
	var mini_w = (button_width-2)/MAPS[level-1].width;
	var mini_h = (button_height-2)/MAPS[level-1].height;
	for(var e in MAPS[level-1].elements){
		var element = get_element_by_name(MAPS[level-1].elements[e][0]);
		x = MAPS[level-1].elements[e][1];
		y = MAPS[level-1].elements[e][2] - round(element.size[1]/2);
		max_w = element.size[0];
		if(MAPS[level-1].elements[e][3]!=0)
			max_w = MAPS[level-1].elements[e][3];
		max_h = element.size[1];
		if(MAPS[level-1].elements[e][4]!=0)
			max_h = MAPS[level-1].elements[e][4];
		//minimize
		max_w = Math.ceil(max_w*button_width/MAPS[level-1].width);
		max_h = Math.ceil(max_h*button_height/MAPS[level-1].height);
		x = pos1 + Math.ceil(x*button_width/MAPS[level-1].width);
		y = pos2 + Math.ceil(y*button_height/MAPS[level-1].height);
		//draw
		canvas_backround.fillStyle = element.alt_color;
		canvas_backround.fillRect(x, y, max_w, max_h);
		}
	}
//draw tank in mini-map
function update_radar(tank){
	if(TYPES[tank.type].type=='tower' ||( tank.dead != 1 && check_enemy_visibility(tank)==true)){
		//settings
		var button_width = MINI_MAP_PLACE[2];
		var button_height = MINI_MAP_PLACE[3];
		var pos1 = status_x+MINI_MAP_PLACE[0];
		var pos2 = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+MINI_MAP_PLACE[1];
		
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
