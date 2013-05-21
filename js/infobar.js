var ABILITIES_POS = [];
//draw infobar
function draw_infobar(){
	//background background
	canvas_backround.fillStyle = "#233012";
	canvas_backround.fillRect(0, status_y, WIDTH_APP, INFO_HEIGHT);
	
	//image
	draw_image(canvas_backround, 'statusbar', status_x, status_y);
	
	//tank icon
	var icon_x = status_x+140;
	if(TYPES[MY_TANK.type].preview != false)
		draw_image(canvas_backround, TYPES[MY_TANK.type].name, icon_x, status_y+40, 100, 100);
		
	//tank name
	canvas_backround.fillStyle = "#a3ad16";
	canvas_backround.font = "bold 10px Verdana";	
	canvas_backround.fillText(TYPES[MY_TANK.type].name, icon_x-5, status_y+25);
		
	redraw_tank_stats();
	
	//abilities skills
	draw_tank_abilities();
	
	for(var i=0; i<ABILITIES_POS.length; i++){
		//register skill button
		register_button(ABILITIES_POS[i].x, ABILITIES_POS[i].y, ABILITIES_POS[i].width, ABILITIES_POS[i].height, PLACE, function(xx, yy, i){
			do_ability(ABILITIES_POS[i].nr, MY_TANK);
			}, i);
		}	
	draw_status_bar();
	}
//redrwar tanks stats in status bar
function redraw_tank_stats(){
	status_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT;
	var left_x = status_x+255;
	var left_x_values = status_x+305;
	var gap = 19;
	var top_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+40;
	
	if(game_mode == 2 && MY_TANK.dead == 1){
		ROOM = get_room_by_id(opened_room_id);
		if(ROOM.settings[0] == 'counter'){
			draw_counter_tank_selection();
			return false;
			}
		}
	
	//clear
	draw_image(canvas_backround, 'statusbar', status_x+245, top_y-40+10, 330, 83,
		245, 10, 330, 83);
		
	//sublevel clear
	var max_width = 85;
	canvas_backround.lineWidth = 2;
	canvas_backround.beginPath();
	canvas_backround.moveTo(status_x+130, status_y+36);
	canvas_backround.lineTo(status_x+130+max_width, status_y+36);
	canvas_backround.strokeStyle = '#2a4214';
	canvas_backround.stroke();
	//sublevel draw
	canvas_backround.beginPath();
	canvas_backround.moveTo(status_x+130, status_y+36);
	canvas_backround.lineTo(status_x+130+round(MY_TANK.sublevel*max_width/100), status_y+36);
	canvas_backround.strokeStyle = '#4a7c0d';
	canvas_backround.stroke();
	//level
	canvas_backround.fillStyle = "#182605";
	canvas_backround.fillRect(status_x+195, status_y+15, 23, 15);
	//draw
	var text = Math.floor(MY_TANK.level);
	canvas_backround.fillStyle = "#c10000";
	canvas_backround.font = "normal 18px Verdana";
	if(text>99)
		canvas_backround.font = "normal 11px Verdana";
	if(text>999)
		canvas_backround.font = "normal 8px Verdana";
	var text_length = canvas_backround.measureText(text).width;
	canvas_backround.fillText(text, status_x+218-text_length, status_y+28);
	
	//damage
	canvas_backround.fillStyle = "#7b8a69";
	canvas_backround.font = "normal 10px Verdana";
	canvas_backround.fillText("Damage", left_x, top_y);
	//value
	canvas_backround.fillStyle = "#a3ad16";
	canvas_backround.font = "bold 10px Verdana";
	var damage_string = MY_TANK.damage;
	damage_string = apply_buff(MY_TANK, 'damage', damage_string);
	damage_string = Math.floor(damage_string);
	canvas_backround.fillText(damage_string, left_x_values, top_y);
	
	//armor
	canvas_backround.fillStyle = "#7b8a69";
	canvas_backround.font = "normal 10px Verdana";
	canvas_backround.fillText("Armor", left_x, top_y+28);
	//value
	canvas_backround.fillStyle = "#a3ad16";
	canvas_backround.font = "bold 10px Verdana";
	var armor_text = MY_TANK.armor;
	armor_text = apply_buff(MY_TANK, 'shield', armor_text);
	if(armor_text > 100) armor_text = 100;
	if(armor_text < 0) armor_text = 0;
	armor_text = Math.floor(armor_text);
	canvas_backround.fillText(armor_text+"%", left_x_values, top_y+28);
	
	left_x = status_x+370;
	left_x_values = status_x+414;
	
	//range
	canvas_backround.fillStyle = "#7b8a69";
	canvas_backround.font = "normal 10px Verdana";
	canvas_backround.fillText("Range", left_x, top_y);
	//value
	canvas_backround.fillStyle = "#a3ad16";
	canvas_backround.font = "bold 10px Verdana";
	canvas_backround.fillText(TYPES[MY_TANK.type].range+" m.", left_x_values, top_y);
	
	//speed
	canvas_backround.fillStyle = "#7b8a69";
	canvas_backround.font = "normal 10px Verdana";
	canvas_backround.fillText("Speed", left_x, top_y+28);
	//value
	canvas_backround.fillStyle = "#a3ad16";
	canvas_backround.font = "bold 10px Verdana";
	var speed_text = MY_TANK.speed;
	speed_text = apply_buff(MY_TANK, 'speed', speed_text);
	speed_text = Math.floor(speed_text)+" km/h";
	canvas_backround.fillText(speed_text, left_x_values, top_y+28);
	
	left_x = status_x+492;
	left_x_values = status_x+535;
	
	//kills
	canvas_backround.fillStyle = "#7b8a69";
	canvas_backround.font = "normal 10px Verdana";
	canvas_backround.fillText("Kills", left_x, top_y);
	//value
	canvas_backround.fillStyle = "#a3ad16";
	canvas_backround.font = "bold 10px Verdana";
	var text;
	text = MY_TANK.kills;
	canvas_backround.fillText(text, left_x_values, top_y);
	
	if(game_mode == 1)
		death_padding = 28;
	else
		death_padding = 20;
	
	//deaths
	canvas_backround.fillStyle = "#7b8a69";
	canvas_backround.font = "normal 10px Verdana";
	canvas_backround.fillText("Deaths", left_x, top_y+death_padding);
	//value
	canvas_backround.fillStyle = "#a3ad16";
	canvas_backround.font = "bold 10px Verdana";
	var text = MY_TANK.deaths;
	canvas_backround.fillText(text, left_x_values, top_y+death_padding);
	
	//players
	if(game_mode == 2){
		canvas_backround.fillStyle = "#7b8a69";
		canvas_backround.font = "normal 10px Verdana";
		canvas_backround.fillText("Players", left_x, top_y+40);
		//value
		canvas_backround.font = "bold 10px Verdana";
		ROOM = get_room_by_id(opened_room_id);
		p_n = 0;
		timeout_interval = 20;	//in seconds
		for(var p in ROOM.players){
			if(ROOM.players[p].ping + timeout_interval*1000 > Date.now())
				p_n++;	
			}
		var text = p_n+"/"+ROOM.players_max;
		canvas_backround.fillText(text, left_x_values, top_y+40);
		}
	
	//logo
	draw_image(canvas_backround, 'logo_small', status_x+490, HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+95);
	
	//life
	life_x = status_x+315;
	life_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+100;
	life_width = 150;
	life_height = 15;
	//reset hp bar
	canvas_backround.fillStyle = "#770f10";
	canvas_backround.fillRect(life_x, life_y, life_width, life_height);
	//fill
	var hp = round(MY_TANK.hp);
	var hp_max = get_tank_max_hp(MY_TANK);
	if(round(life_width*hp/hp_max) > 0)
		draw_image(canvas_backround, 'level', life_x, life_y, round(life_width*hp/hp_max), life_height);
		
	//text
	var text = hp+"/"+hp_max;
	var text_width = canvas_backround.measureText(text).width;
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "normal 9px Verdana";
	canvas_backround.fillText(text, life_x+life_width-text_width-5, life_y+life_height-5);

	//show fps
	update_fps();
	}
//redraw tank skills
function draw_tank_abilities(){
	var gap = 15;
	var status_x_tmp = status_x+590;
	var status_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+gap;
	
	for (var i=0; i<TYPES[MY_TANK.type].abilities.length; i++){
		//check if abilites not in use
		if(MY_TANK.abilities_reuse[i] > Date.now() ) continue;
		
		//button
		if(TYPES[MY_TANK.type].abilities[i].passive == false)	
			draw_image(canvas_backround, 'skill_on', status_x_tmp+i*(SKILL_BUTTON+gap)-5, status_y-5);
		else
			draw_image(canvas_backround, 'skill_off', status_x_tmp+i*(SKILL_BUTTON+gap)-5, status_y-5);
			
		//text
		ability_text = TYPES[MY_TANK.type].abilities[i].name;
		canvas_backround.fillStyle = "#1d2411";
		canvas_backround.font = "bold 10px Verdana";
		if(ability_text.length>6)
			canvas_backround.font = "bold 9px Verdana";	
		letter_padding = Math.floor((SKILL_BUTTON-canvas_backround.measureText(ability_text).width )/2);
		if(letter_padding<0) letter_padding = 0;
		canvas_backround.fillText(ability_text, status_x_tmp+i*(SKILL_BUTTON+gap)+letter_padding, status_y+SKILL_BUTTON/2+3);
		
		//level
		var value = MY_TANK.abilities_lvl[i];
		canvas_backround.font = "normal 8px Verdana";
		canvas_backround.fillStyle = "#2f391c";
		canvas_backround.fillText(value, status_x_tmp+i*(SKILL_BUTTON+gap)+5, status_y+11);
		
		//ability to upgrade
		if(i==ABILITIES_MODE-1){
			canvas_backround.beginPath();
			canvas_backround.arc(status_x_tmp+i*(SKILL_BUTTON+gap)+SKILL_BUTTON-5, status_y+5, 3, 0, 2*Math.PI);	
			canvas_backround.fillStyle = "#1d2e0b";
			canvas_backround.fill();
			}
		if(ABILITIES_MODE == 0){
			canvas_backround.beginPath();
			canvas_backround.arc(status_x_tmp+i*(SKILL_BUTTON+gap)+SKILL_BUTTON-5, status_y+5, 2, 0, 2*Math.PI);	
			canvas_backround.fillStyle = "#1d2e0b";
			canvas_backround.fill();
			}
		
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
	//clear areas if less then 3 skills
	for(j=i; j<3; j++){
		draw_image(canvas_backround, 'skill_off', status_x_tmp+j*(SKILL_BUTTON+gap)-5, status_y-5);
		}
	}
//draw tanks skill reuse animation
function draw_ability_reuse(object){
	var gap = 15;
	var status_x_tmp = status_x+590;
	var status_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+gap;
	
	if(object != undefined){
		var i = object.nr;
		var ability_reuse = object.tank.abilities_reuse[i] - Date.now();
		if(TYPES[MY_TANK.type].abilities[i] == undefined) return false;
		//button
		if(TYPES[MY_TANK.type].abilities[i].passive == false)	
			draw_image(canvas_backround, 'skill_on', status_x_tmp+i*(SKILL_BUTTON+gap)-5, status_y-5);
		else
			draw_image(canvas_backround, 'skill_off', status_x_tmp+i*(SKILL_BUTTON+gap)-5, status_y-5);
		canvas_backround.fillStyle = "#1d2411";
		
		//if active
		var img_height=0;
		if(TYPES[MY_TANK.type].abilities[i].passive == false){
			img_height = (SKILL_BUTTON) * ability_reuse / object.max + 5;
			if(img_height > 65)
				img_height = 65;	//error here
			if(img_height < 6){
				//available again
				draw_image(canvas_backround, 'skill_on', status_x_tmp+i*(SKILL_BUTTON+gap)-5, status_y-5);
				}
			else{
				//reuse on
				draw_image(canvas_backround, 'skill_off', 
					status_x_tmp+i*(SKILL_BUTTON+gap)-5, 
					status_y-5, 
					SKILL_BUTTON+10, 
					img_height,
					undefined, undefined, undefined, img_height);
				canvas_backround.fillStyle = "#4b6125";
				}
			}
	
		//text
		canvas_backround.font = "bold 10px Verdana";
		var ability_text = TYPES[MY_TANK.type].abilities[i].name;
		if(ability_text.length>6)
			canvas_backround.font = "bold 9px Verdana";
		letter_padding = Math.floor((SKILL_BUTTON-canvas_backround.measureText(ability_text).width )/2);
		if(letter_padding<0) letter_padding = 0;
		canvas_backround.fillText(ability_text, status_x_tmp+i*(SKILL_BUTTON+gap)+letter_padding, status_y+SKILL_BUTTON/2+3);
		
		//level
		var value = MY_TANK.abilities_lvl[i];
		canvas_backround.font = "normal 8px Verdana";
		canvas_backround.fillStyle = "#2f391c";
		canvas_backround.fillText(value, status_x_tmp+i*(SKILL_BUTTON+gap)+5, status_y+11);
		
		//ability to upgrade
		if(i==ABILITIES_MODE-1){
			canvas_backround.beginPath();
			canvas_backround.arc(status_x_tmp+i*(SKILL_BUTTON+gap)+SKILL_BUTTON-5, status_y+5, 3, 0, 2*Math.PI);	
			canvas_backround.fillStyle = "#1d2e0b";
			canvas_backround.fill();
			}
		if(ABILITIES_MODE == 0){
			canvas_backround.beginPath();
			canvas_backround.arc(status_x_tmp+i*(SKILL_BUTTON+gap)+SKILL_BUTTON-5, status_y+5, 2, 0, 2*Math.PI);	
			canvas_backround.fillStyle = "#1d2e0b";
			canvas_backround.fill();
			}
		
		//reuse left
		reuse = Math.ceil(ability_reuse / 1000);
		if(reuse>0){
			canvas_backround.font = "normal 10px Verdana";
			canvas_backround.fillStyle = "#1d2411";
			var value_width = canvas_backround.measureText(reuse).width;
			canvas_backround.fillText(reuse, status_x_tmp+i*(SKILL_BUTTON+gap)+SKILL_BUTTON-5-value_width, status_y+round(SKILL_BUTTON*9/10));
			}
		}
	else
		log('Error: undefined object in draw_ability_reuse().');
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
	
	//prepare
	canvas_backround.font = "normal 10px Verdana";
	
	var limit = 193;
	var ability_hover_text_more = '';
	var words = ability_hover_text.split(" ");
	ability_hover_text = '';
	active_line = 1;
	for(var i in words){
		var tmp = ability_hover_text.concat(' ').concat(words[i]);
		if(active_line == 1 && canvas_backround.measureText(tmp).width < limit)
			ability_hover_text = ability_hover_text+" "+words[i];
		else{ 
			ability_hover_text_more = ability_hover_text_more+" "+words[i];
			active_line=2;
			}
		}
	
	//show description
	canvas_backround.fillStyle = "#8f947d";
	canvas_backround.font = "normal 10px Verdana";
	canvas_backround.fillText(ability_hover_text, status_x_tmp+5, status_y+13);
	
	canvas_backround.fillStyle = "#8f947d";
	canvas_backround.font = "normal 10px Verdana";
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
	var zheight = HEIGHT_SCROLL*button_height/HEIGHT_MAP;
	if(pos2-map_offset[1]*button_height/HEIGHT_MAP + zheight < HEIGHT_SCROLL+INFO_HEIGHT){
		canvas_backround.fillStyle = "#97998c";
		canvas_backround.fillRect(
			pos1-map_offset[0]*button_width/WIDTH_MAP, 
			pos2-map_offset[1]*button_height/HEIGHT_MAP, 
			WIDTH_SCROLL*button_width/WIDTH_MAP, 
			zheight
			);
		}
		
	//elements
	var mini_w = (button_width-2)/MAPS[level-1].width;
	var mini_h = (button_height-2)/MAPS[level-1].height;
	for(var e in MAPS[level-1].elements){
		var element = get_element_by_name(MAPS[level-1].elements[e][0]);
		x = MAPS[level-1].elements[e][1];
		y = MAPS[level-1].elements[e][2];
		if(element.size[0]<30)	x = x - round(element.size[0]/2);
		if(element.size[1]<30)	y = y - round(element.size[1]/2);
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
		size_half = TYPES[tank.type].size[1]/2;
		var tank_x = tank.x+size_half;
		var tank_y = tank.y+size_half;	
		if(tank_x<0)	tank_x=0;
		if(tank_y<0)	tank_y=0;
		if(tank_x>MAPS[level-1].width)	tank_x=MAPS[level-1].width;
		if(tank_y>MAPS[level-1].height)	tank_y=MAPS[level-1].height;
		
		tank_x = pos1 + Math.round(tank_x * button_width / round(MAPS[level-1].width));
		tank_y = pos2 + round(tank_y * button_height /(MAPS[level-1].height));
		canvas_backround.fillRect(tank_x, tank_y, msize, msize);
		}
	}
var last_selected_counter = -1;
//lets select new tank on counter mode
function draw_counter_tank_selection(selected_tank){
	var padding_left = 250;
	var padding_top = 10;
	var pos1 = status_x+padding_left;
	var pos2 = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+padding_top;
	var top_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+40;
	var max_width = 325;
	var max_height = 80;
	var gap = 3;
	var msize;
	var first_time = false;
	var n = 0;
	for(var i in TYPES){
		if(TYPES[i].type != 'tank') continue;
		n++;
		}
	n1 = Math.ceil(n/2);
	msize = round((430-gap*(n1-1))/n1);
	if(msize*2+gap > max_height)
		msize = round((max_height-gap)/2);
	
	if(selected_tank == undefined){
		selected_tank = MY_TANK.type;
		first_time = true;
		}
	
	if(selected_tank==last_selected_counter)
		return false;
		
	//tank icon
	if(TYPES[MY_TANK.type].preview != false){
		//clear
		draw_image(canvas_backround, 'statusbar', status_x+140, status_y+40, 90, 80, status_x+140, status_y+40, 90, 80);
		//draw
		draw_image(canvas_backround, TYPES[MY_TANK.type].name, status_x+140, status_y+40, undefined, undefined);
		}
	
	//tanks
	var j=0;
	var row = 0;
	for(var i in TYPES){
		if(TYPES[i].type != 'tank') continue;
		if(i == selected_tank || i == last_selected_counter || last_selected_counter==-1){
			//reset background
			var back_color = '';
			if(selected_tank != undefined && selected_tank == i || i == MY_TANK.type)
				back_color = "#8fc74c"; //selected
			else
				back_color = "#dbd9da";
			canvas_backround.fillStyle = back_color;
			canvas_backround.strokeStyle = "#196119";
			roundRect(canvas_backround, pos1+j*(msize+gap), pos2+row*(msize+gap), msize, msize, 3, true);
			
			//logo
			draw_image(canvas_backround, TYPES[i].name, 
				pos1+j*(msize+gap)+2, pos2+2+row*(msize+gap), msize, msize,
				undefined, undefined, 90, 90);
			
			//register button
			register_button(pos1+j*(msize+gap)+1, pos2+row*(msize+gap), msize, msize, PLACE, function(mouseX, mouseY, index){
				if(game_mode == 2 && MY_TANK.dead == 1){
					ROOM = get_room_by_id(opened_room_id);
					if(ROOM.settings[0]=='counter'){
						register_tank_action('change_tank', opened_room_id, name, index, true);
						return true;
						}
					else
						return false;
					}
				}, i);
			}
		j++;
		if(j==n1){
			row++; 
			j=0;
			}
		}
	last_selected_counter = selected_tank;
	}
