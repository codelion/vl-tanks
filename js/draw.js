//main drawing
var frame_time;
var frame_last_time;
function draw_main(){
	if(PLACE != 'game') return false;
	frame_last_time = frame_time;
	if(frame_last_time==undefined)
		frame_last_time = Date.now();
	frame_time = Date.now();
	var time_gap = Date.now() - frame_last_time;
	
	//clear
	canvas_main.clearRect(0, 0, WIDTH_SCROLL, HEIGHT_SCROLL);
	canvas_map_sight.clearRect(0, 0, WIDTH_MAP, HEIGHT_MAP);
	if(QUALITY>1){
		canvas_map_sight.fillStyle = "rgba(0, 0, 0, 0.34)";
		canvas_map_sight.fillRect(0, 0, WIDTH_MAP, HEIGHT_MAP);
		}
	
	//external drawings functions
	for (i in pre_draw_functions){
		window[pre_draw_functions[i][0]](pre_draw_functions[i][1]);
		}
	
	redraw_mini_map();	// mini map actions

	//tanks actions
	for(var i=0; i < TANKS.length; i++){
		if(PLACE != 'game') return false;
		var tank_size =  TYPES[TANKS[i].type].size[1];
		try{
			//speed multiplier
			var speed_multiplier = 1;
			speed_first = speed_multiplier;
			for(var dd in TANKS[i].buffs){
				if(TANKS[i].buffs[dd].name == 'slow'){
					var diff = speed_first * TANKS[i].buffs[dd].power / 100;
					speed_multiplier = speed_multiplier - diff;
					if(speed_multiplier < 0) 
						speed_multiplier = 0;
					}
				}
				
			//check buffs
			for(var x=0; x < TANKS[i].buffs.length; x++){
				if(TANKS[i].buffs[x].lifetime != undefined && TANKS[i].buffs[x].lifetime < Date.now()){
					TANKS[i].buffs.splice(x, 1); x--;
					}
				}	
			
			//lifetime
			if(TANKS[i].lifetime != undefined && TANKS[i].lifetime < Date.now()){
				TANKS.splice(i, 1); i--;
				continue;
				}
			
			//respawn
			if(TANKS[i].death_respan != undefined){
				if(TANKS[i].death_respan - Date.now() < 0){
					delete TANKS[i].death_respan;
					if(TANKS[i].team == 'B'){	//top
						TANKS[i].x = round(WIDTH_SCROLL*2/3);
						TANKS[i].y = 20;
						TANKS[i].hp = TYPES[TANKS[i].type].life[0]+TYPES[TANKS[i].type].life[1]*(TANKS[i].level-1);
						}
					else{	//bottom
						TANKS[i].x = round(WIDTH_SCROLL/3);
						TANKS[i].y = HEIGHT_MAP-20-TYPES[TANKS[i].type].size[1];
						TANKS[i].hp = TYPES[TANKS[i].type].life[0]+TYPES[TANKS[i].type].life[1]*(TANKS[i].level-1);
						}
					if(TANKS[i].id==MY_TANK.id)
						auto_scoll_map();
					}
				}
			
			//ghost mode
			if(TANKS[i].respan_time != undefined){
				speed_multiplier = 0.5;
				if(TANKS[i].respan_time - Date.now() < 0){	
					delete TANKS[i].respan_time;
					delete TANKS[i].dead;
					last_selected_counter = -1;
					TANKS[i].x -= TYPES[TANKS[i].type].size[1]/4;
					TANKS[i].y -= TYPES[TANKS[i].type].size[1]/4;
					}
				}
			
			//check stun
			if(TANKS[i].stun - Date.now() < 0)
				delete TANKS[i].stun;
				
			if(mouse_click_controll==true && TANKS[i].name == name){
				//target
				img = new Image();
				img.src = '../img/target.png';
				canvas_main.drawImage(img, mouse_pos[0]-15, mouse_pos[1]-15);
				
				if(target_range != 0){
					//circle
					canvas_main.beginPath();
					canvas_main.arc(mouse_pos[0], mouse_pos[1], target_range, 0 ,2*Math.PI, false);	
					canvas_main.lineWidth = 1;
					canvas_main.strokeStyle = "#c10000";
					canvas_main.stroke();
					}
				}
			
			//move lock
			if(TANKS[i].target_move_lock != undefined){
				var i_locked = false;
				for(var t in TANKS){
					if(TANKS[t].id == TANKS[i].target_move_lock)
						i_locked = t;
					}
				if(TANKS[i_locked] == undefined){	//maybe target is already dead
					TANKS[i].move = 0;
					delete TANKS[i].target_move;
					}
				else{
					tmp_distance = get_distance_between_tanks(TANKS[i_locked], TANKS[i]);
					//executing custom function
					if(TANKS[i].reach_tank_and_execute != undefined && tmp_distance < TANKS[i].reach_tank_and_execute[0]){
						//executing custom function
						TANKS[i].move = 0;
						delete TANKS[i].target_move_lock;
						delete TANKS[i].move_to;
						window[TANKS[i].reach_tank_and_execute[1]](TANKS[i].reach_tank_and_execute[2], TANKS[i_locked].id, true);
						delete TANKS[i].reach_tank_and_execute;
						}
					//reached targeted enemy for general attack
					if(TANKS[i].reach_tank_and_execute == undefined && tmp_distance < TYPES[TANKS[i].type].range){ 	
						TANKS[i].move = 0;
						delete TANKS[i].target_move;
						}
					}
				}
				
			//defined range trigger
			if(TANKS[i].reach_pos_and_execute != undefined){
				var xx = TANKS[i].reach_pos_and_execute[2];
				var yy = TANKS[i].reach_pos_and_execute[3];
				//get distance
				tmp_dist_x = xx-(TANKS[i].x+TYPES[TANKS[i].type].size[1]/2)
				tmp_dist_y = yy-(TANKS[i].y+TYPES[TANKS[i].type].size[1]/2)
				tmp_distance = Math.sqrt((tmp_dist_x*tmp_dist_x)+(tmp_dist_y*tmp_dist_y));
				tmp_distance =  tmp_distance - TYPES[TANKS[i].type].size[1]/2;
				
				//executing custom function
				if(tmp_distance < TANKS[i].reach_pos_and_execute[0]){
					//executing custom function
					TANKS[i].move = 0;
					delete TANKS[i].target_move_lock;
					delete TANKS[i].move_to;
					window[TANKS[i].reach_pos_and_execute[1]](TANKS[i].reach_pos_and_execute[4], true, true);
					delete TANKS[i].reach_pos_and_execute;
					}
				}
			//autopilot
			if(TANKS[i].use_AI == true)
				check_path_AI(TANKS[i]);
			
			//move tank
			if(TANKS[i].move == 1 && TANKS[i].stun == undefined && TANKS[i].move_to != undefined){
				if(TANKS[i].move_to[0].length == undefined){
					dist_x = TANKS[i].move_to[0] - TANKS[i].x;
					dist_y = TANKS[i].move_to[1] - TANKS[i].y;
					}
				else{
					dist_x = TANKS[i].move_to[0][0] - TANKS[i].x;
					dist_y = TANKS[i].move_to[0][1] - TANKS[i].y;
					}
				distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
				radiance = Math.atan2(dist_y, dist_x);
				var angle = (radiance*180.0)/Math.PI+90;
				angle = round(angle);
				if(body_rotation(TANKS[i], "angle", TANKS[i].turn_speed, angle, time_gap)){
					if(TANKS[i].hit_reuse - Date.now() < 0)
						body_rotation(TANKS[i], "fire_angle", TANKS[i].turn_speed, angle, time_gap);
					if(distance < speed2pixels(TANKS[i].speed*speed_multiplier, time_gap)){
						if(TANKS[i].move_to[0].length == undefined){
							TANKS[i].move = 0;
							}
						else{
							//we have second way defined
							if(TANKS[i].move_to[1] != undefined)
								TANKS[i].move_to.splice(0, 1);
							else{
								TANKS[i].move = 0;
								}	
							}
						}
					if(check_collisions(TANKS[i].x+tank_size/2+Math.cos(radiance)*tank_size/2, TANKS[i].y+tank_size/2+Math.sin(radiance)*tank_size/2, TANKS[i])==true){
						TANKS[i].move = 0;
						}
					else{
						var last_x = TANKS[i].x;
						var last_y = TANKS[i].y;
						TANKS[i].x += Math.cos(radiance)*speed2pixels(TANKS[i].speed*speed_multiplier, time_gap);
						TANKS[i].y += Math.sin(radiance)*speed2pixels(TANKS[i].speed*speed_multiplier, time_gap);
						
						//border controll
						var border_error = false;
						if(TANKS[i].x+tank_size/2 < 0) border_error = true;
						if(TANKS[i].y+tank_size/2 < 0) border_error = true;
						if(TANKS[i].x+tank_size/2 > WIDTH_MAP) border_error = true;
						if(TANKS[i].y+tank_size/2 > HEIGHT_MAP) border_error = true;
						
						if(border_error == true){
							TANKS[i].x = last_x;
							TANKS[i].y = last_y;
							}
						}	
					}
				else if(TANKS[i].hit_reuse - Date.now() < 0)
						body_rotation(TANKS[i], "fire_angle", TANKS[i].turn_speed, angle, time_gap);
				}
			//map scrolling
			if(TANKS[i].id==MY_TANK.id && TANKS[i].move == 1 && MAP_SCROLL_CONTROLL==false && MAP_SCROLL_MODE==1){
				auto_scoll_map();
				}
			
			//bullets controll
			draw_bullets(TANKS[i], time_gap);
			
			//draw tank
			if(TANKS[i] != undefined){
				check_enemies(TANKS[i]);
				draw_tank(TANKS[i]);
				}
			}
		catch(err){
			console.log("Error: "+err.message);
			}
		}
	lighten_pixels_all();
	if(MY_TANK.dead == 1)	
		draw_message(canvas_main, "You will respawn in  "+Math.ceil((MY_TANK.respan_time-Date.now())/1000)+" seconds.");
	
	//show live scroes?
	if(tab_scores==true)
		draw_final_score(true);
	
	show_chat();
	
	//fps
	var thisLoop = new Date;
	FPS = 1000 / (thisLoop - lastLoop);
	lastLoop = thisLoop;
	
	//request next draw
	if(render_mode == 'requestAnimationFrame')
		requestAnimationFrame(draw_main);
	}
var settings_positions = [];
var last_active_tab = -1;
var logo_visible = 1;
//draws main buttons on logo screen
function add_settings_buttons(canvas_this, text_array, active_i){
	var button_width = 300;
	var button_height = 35;
	var buttons_gap = 3;
	var top_margin = 370;
	var button_i=0;
	var letter_height = 9;
	var letter_width = 9;
	
	if(active_i==undefined)
		active_i = -1;
	if(last_active_tab == active_i && last_active_tab > -1)
		return false;
		
	last_active_tab = active_i;
	settings_positions = [];
	
	//logo backround color
	canvas_backround.fillStyle = "#676767";
	canvas_backround.fillRect(0, 0, WIDTH_APP, HEIGHT_APP-27);
		
	//back image
	var background_elem = get_element_by_name('background');
	if(background_elem==false)
		alert("ERROR: missing element 'background' config in draw_map().");
	backround_width = background_elem.size[0];
	backround_height = background_elem.size[1];
	var img_texture = new Image();
	img_texture.src = '../img/map/'+background_elem.file;	
	
	for(var i=0; i<Math.ceil((HEIGHT_APP-27)/backround_height); i++){ 
		for(var j=0; j<Math.ceil(WIDTH_APP/backround_width); j++){
			var xx = j*backround_width;
			var yy = i*backround_height;
			var bwidth = backround_width;
			var bheight = backround_height;
			if(xx+bwidth > WIDTH_APP)
				bwidth = WIDTH_APP-xx;
			if(yy+bheight > HEIGHT_APP-27)
				bheight = HEIGHT_APP-27-yy;
			canvas_backround.drawImage(img_texture, 0, 0, backround_width, backround_height, xx, yy, bwidth, bheight);
			}
		}
	
	//text
	if(logo_visible==1){
		var text = "Moon wars".split("").join(String.fromCharCode(8201))
		canvas_backround.font = "Bold 70px Arial";
		canvas_backround.strokeStyle = '#ffffff';
		canvas_backround.strokeText(text, 160, 340);
		}
	else{
		draw_logo_tanks(160, 340-52, false);
		}
	//on click event
	register_button(160, 340-48, 477, 52, 'init', function(){ draw_logo_tanks(160, 340-52); });
	
	//logo
	var img = new Image();
	img.src = '../img/logo.png';
	var left = (WIDTH_APP-598)/2;	
	canvas_backround.drawImage(img, left, 15);
	
	for (i in text_array){
		//background
		canvas_this.strokeStyle = "#000000";
		if(i != active_i)
			canvas_this.fillStyle = "rgba(32, 123, 32, 0.7)";
		else
			canvas_this.fillStyle = "rgba(25, 97, 25, 1)";
		roundRect(canvas_this, Math.round((WIDTH_APP-button_width)/2), top_margin+(button_height+buttons_gap)*button_i, button_width, button_height, 5, true);
	
		//text
		canvas_backround.fillStyle = "#ffffff";
		canvas_backround.font = settings_font;
		canvas_backround.fillText(text_array[i], Math.round((WIDTH_APP-button_width)/2+(button_width-letter_width*text_array[i].length)/2), top_margin+(button_height+buttons_gap)*button_i+Math.round((button_height+letter_height)/2));
		
		//save position
		var tmp = new Array();
		tmp['x'] = Math.round((WIDTH_APP-button_width)/2);
		tmp['y'] = top_margin+(button_height+buttons_gap)*button_i;
		tmp['width'] = button_width;
		tmp['height'] = button_height;
		tmp['title'] = text_array[i];
		settings_positions.push(tmp);
		
		button_i++;
		}
	}
function draw_logo_tanks(left, top, change_logo){
	var max_size = 60;
	var block_width = 600;
	var block_height = 62;
	//clear
	var background_elem = get_element_by_name('background');
	var backround_width = background_elem.size[0];
	var backround_height = background_elem.size[1];
	var img = new Image();	 
	img.src = '../img/map/'+background_elem.file;
	var btop = top-7;
	canvas_backround.drawImage(img, 0, btop, backround_width, block_height, 0, btop, backround_width, block_height);
	if(left+block_width>backround_width)
		canvas_backround.drawImage(img, 0, btop, backround_width, block_height, backround_width, btop, backround_width, block_height);

	if(change_logo==undefined){
		if(logo_visible==0){
			logo_visible=1;
			var text = "Moon wars".split("").join(String.fromCharCode(8201))
			canvas_backround.font = "Bold 70px Arial";
			canvas_backround.strokeStyle = '#ffffff';
			canvas_backround.strokeText(text, left, top+52);
			return false;
			}
		else{
			logo_visible=0;
			}
		}
	var n = 0;
	for(var t in TYPES)
		if(TYPES[t].type == 'tank') n++;
	for(var t in TYPES){
		if(TYPES[t].type != 'tank') continue;
		var tank_size = TYPES[t].size[1];
		//base
		var img = new Image();
		img.src = '../img/tanks/'+TYPES[t].name+'/'+TYPES[t].icon_base[0];
		if(TYPES[t].size[1] < max_size)	//normal
			canvas_backround.drawImage(img, left+t*round(477/n)+(50-tank_size)/2, top+52-tank_size);
		else	//resized
			canvas_backround.drawImage(img, 0, 0, tank_size, tank_size, left+t*(477/n)+(50-max_size)/2, top+52-max_size, max_size, max_size);
		//turret
		var img = new Image();
		img.src = '../img/tanks/'+TYPES[t].name+'/'+TYPES[t].icon_top[0];
		canvas_backround.drawImage(img, left+t*round(477/n)+(50-tank_size)/2, top+52-tank_size);
		}
	}
var score_button_pos = new Array();
//final scores after game ended
function draw_final_score(live, lost_team){
	var button_width = WIDTH_SCROLL-40;
	var button_height = 15;
	var buttons_gap = 5;
	var top_margin = 60;
	var letter_height = 9;
	var letter_width = 9;
	var text_y = 70;
	
	//find canvas
	if(live==true)
		canvas = canvas_main;
	else
		canvas = canvas_backround;
		
	//find tanks count
	var tanks_n = 0;
	for (var i in TANKS){
		if(TYPES[TANKS[i].type].type == 'tank')
			tanks_n++;
		}
	if(live==true && tanks_n > 13 && tanks_n < 17 ){
		button_height = 12;
		buttons_gap = 4;
		}
	else if(live==true && tanks_n > 16){
		button_height = 10;
		buttons_gap = 3;
		}
	if(live==false){					//final scores
		//add some score to winning team
		for (var i in TANKS){
			if(TANKS[i].team == lost_team)
				continue;
			TANKS[i].score = TANKS[i].score + SCORES_INFO[4];
			}
	
		PLACE = 'score';
		map_offset = [0, 0];
		clearInterval(draw_interval_id);
		clearInterval(level_interval_id);
		clearInterval(level_hp_regen_id);
		clearInterval(timed_functions_id);
		
		if(audio_main != undefined)
			audio_main.pause();
		canvas_main.clearRect(0, 0, WIDTH_SCROLL, HEIGHT_SCROLL);
		canvas_map.clearRect(0, 0, WIDTH_SCROLL, HEIGHT_SCROLL);
		
		//background
		var img = new Image();
		img.src = '../img/background.jpg';
		canvas_backround.drawImage(img, 0, 0, 700, 500, 0, 0, WIDTH_APP, HEIGHT_APP-27);
		
		canvas_backround.strokeStyle = "#000000";	
		canvas_backround.fillStyle = "rgba(255, 255, 255, 0.7)";
		roundRect(canvas_backround, 10, 10, WIDTH_SCROLL-20, HEIGHT_APP-20*2-10, 0, true);
		
		canvas_backround.strokeStyle = "#000000";
		canvas_backround.fillStyle = "#382da3";
		roundRect(canvas_backround, Math.round((WIDTH_APP-button_width)/2), 25, 70, 30, 3, true);
		register_button(Math.round((WIDTH_APP-button_width)/2), 25, 70, 30, PLACE, function(){
			if(FS==true)
				fullscreen('canvas_area');
			quit_game();
			});
		
		//save button position
		score_button_pos['x'] = Math.round((WIDTH_APP-button_width)/2);
		score_button_pos['y'] = 25;
		score_button_pos['width'] = 70;
		score_button_pos['height'] = 30;
		
		//title
		if(lost_team=='R'){
			canvas_backround.fillStyle = "#3c81ff";
			var tex = "Team Blue won the game";
			}
		else{
			canvas_backround.fillStyle = "#9c0309";
			var tex = "Team Red won the game";
			}
		canvas_backround.font = "bold 20px Helvetica";
		canvas_backround.fillText(tex, 110, 45);
		
		canvas_backround.fillStyle = "#ffffff";
		canvas_backround.font = "bold 16px Helvetica";
		canvas_backround.fillText("Quit", Math.round((WIDTH_APP-button_width)/2)+20, 45);
		}
	else{							//scores in game
		//background in live stats
		canvas_main.strokeStyle = "#000000";
		canvas_main.fillStyle = "rgba(255, 255, 255, 0.7)";
		roundRect(canvas_main, 10, 10, WIDTH_SCROLL-20, HEIGHT_SCROLL-20, 0, true);
		}
	
	canvas.font = "bold 12px Helvetica";
	
	canvas.fillStyle = "#0669ff";
	canvas.fillText("Type", Math.round((WIDTH_APP-button_width)/2)+200, text_y);
	
	canvas.fillStyle = "#0669ff";
	canvas.fillText("Kills", Math.round((WIDTH_APP-button_width)/2)+300, text_y);
	
	canvas.fillStyle = "#9c0309";
	canvas.fillText("Deaths", Math.round((WIDTH_APP-button_width)/2)+350, text_y);
	
	canvas.fillStyle = "#056705";
	canvas.fillText("Towers", Math.round((WIDTH_APP-button_width)/2)+400, text_y);
	
	canvas.fillStyle = "#d06a07";
	canvas.fillText("Level", Math.round((WIDTH_APP-button_width)/2)+450, text_y);
	
	canvas.fillStyle = "#ff3405";
	canvas.fillText("Score", Math.round((WIDTH_APP-button_width)/2)+500, text_y);
	
	//sort
	if(live==false)
		TANKS.sort(function(a,b) { return parseFloat(b.score) - parseFloat(a.score) } );
	
	var j=1;
	for (var i in TANKS){
		if(TYPES[TANKS[i].type].type == 'tank'){
			//background
			canvas.strokeStyle = "#000000";
			if(TANKS[i].team == 'R')
				canvas.fillStyle = "#ffaaaa";
			else
				canvas.fillStyle = "#b9b9ff";
			roundRect(canvas, Math.round((WIDTH_SCROLL-button_width)/2), top_margin+(button_height+buttons_gap)*j, button_width, button_height, 0, true);
			
			var text_y = top_margin+(button_height+buttons_gap)*j+Math.round((button_height+letter_height)/2);
			if(TANKS[i].name == name)
				canvas.font = "bold 12px Helvetica";
			else
				canvas.font = "normal 12px Helvetica";
			
			//#
			canvas.fillStyle = "#6b6b6e";
			canvas.fillText(j, Math.round((WIDTH_APP-button_width)/2)+10, text_y);
	
			//name
			canvas.fillStyle = "#000000";
			var name_tmp = TANKS[i].name;
			if(name_tmp != undefined && name_tmp.length>33)
				name_tmp = name_tmp.substr(0,33) 
			canvas.fillText(name_tmp, Math.round((WIDTH_APP-button_width)/2)+40, text_y);
			
			//type
			canvas.fillStyle = "#000000";
			canvas.fillText(TYPES[TANKS[i].type].name, Math.round((WIDTH_APP-button_width)/2)+200, text_y);
			
			//kills
			canvas.font = "bold 12px Helvetica";
			canvas.fillStyle = "#0669ff";
			var kills = TANKS[i].kills;
			canvas.fillText(kills, Math.round((WIDTH_APP-button_width)/2)+300, text_y);
			
			//deaths
			canvas.fillStyle = "#9c0309";
			var deaths = TANKS[i].deaths;
			canvas.fillText(deaths, Math.round((WIDTH_APP-button_width)/2)+350, text_y);
			
			//towers
			canvas.fillStyle = "#056705";
			var towers = 0;
			if(TANKS[i].towers != undefined)
				towers = TANKS[i].towers;
			else
				towers = 0;
			towers = Math.round(towers*10)/10;
			canvas.fillText(towers, Math.round((WIDTH_APP-button_width)/2)+400, text_y);
			
			//level
			canvas.fillStyle = "#d06a07";
			canvas.fillText(TANKS[i].level, Math.round((WIDTH_APP-button_width)/2)+450, text_y);
			
			//score
			canvas.fillStyle = "#ff3405";
			var score = TANKS[i].score;
			canvas.fillText(Math.round(score), Math.round((WIDTH_APP-button_width)/2)+500, text_y);
			
			j++;
			}
		}
	
	if(live==false){
		TANKS = [];
		timed_functions = [];
		pre_draw_functions = [];
		on_click_functions = [];
		}
	}
//message on screen in game
function draw_message(this_convas, message){
	this_convas.fillStyle = "#b12525";
	this_convas.font = "bold 18px Helvetica";
	this_convas.fillText(message, Math.round(WIDTH_APP/2)+50, HEIGHT_SCROLL-20);
	}
//show FPS
function update_fps(){
	try{
		var fps_string = Math.round(FPS*10)/10;
		parent.document.getElementById("fps").innerHTML = fps_string;	
		}catch(error){}
	}
var red_line_y=0;
//selecting tank window
var last_selected = -1;
function draw_tank_select_screen(selected_tank){
	PLACE = 'select';
	dynamic_title();
	canvas_map.clearRect(0, 0, WIDTH_MAP, HEIGHT_MAP); 
	canvas_map_sight.clearRect(0, 0, WIDTH_MAP, HEIGHT_MAP);
	room_controller();
	
	var y = 10;
	var gap = 5;
	if(selected_tank == undefined){
		if(game_mode == 1)
			selected_tank = 0; 
		else{
			//find me
			ROOM = get_room_by_id(opened_room_id);
			selected_tank = 0;
			for(var p in ROOM.players){
				if(ROOM.players[p].name == name && ROOM.players[p].tank != undefined){
					selected_tank = ROOM.players[p].tank;
					break;
					}
				}
			}
		}
	
	//background
	if(last_selected == -1){
		canvas_backround.fillStyle = "#f0f9e4";
		canvas_backround.fillRect(0, 0, WIDTH_APP, HEIGHT_APP-27);
		img = new Image();
		img.src = '../img/background.jpg';
		canvas_backround.drawImage(img, 0, 0, 700, 500, 0, 0, WIDTH_APP, HEIGHT_APP-27);
		}
	
	//show all possible tanks
	j = 0;
	preview_xy = 90;
	for(var i in TYPES){
		if(TYPES[i].type != 'tank') continue;
		if(15+j*(preview_xy+gap)+ preview_xy > WIDTH_APP){
			y = y + preview_xy+gap;
			j = 0;
			}
		if(i == selected_tank || i == last_selected || last_selected==-1){
			//reset background
			var back_color = '';
			if(selected_tank != undefined && selected_tank == i)
				back_color = "#8fc74c"; //selected
			else
				back_color = "#dbd9da";
			canvas_backround.fillStyle = back_color;
			canvas_backround.strokeStyle = "#196119";
			roundRect(canvas_backround, 15+j*(preview_xy+gap), y, 90, 90, 5, true);
			
			//logo
			var pos1 = 15+j*(preview_xy+gap);
			var pos2 = y;
			drawImage_preloaded(canvas_backround, '../img/tanks/'+TYPES[i].name+'/'+TYPES[i].preview, pos1, pos2, PLACE, 90, 90, back_color, pos1+2, pos2+2, 90-4, 90-4);
			
			//if bonus
			ROOM = get_room_by_id(opened_room_id);
			if(game_mode == 2 && ROOM.settings[0]=='normal' && TYPES[i].bonus != undefined){
				var img_lock = new Image();
				img_lock.src = '../img/lock.png';
				canvas_backround.drawImage(img_lock, pos1+90-14-5, pos2+90-20-5);
				}
			
			//register button
			register_button(15+j*(preview_xy+gap)+1, y+1, preview_xy, preview_xy, PLACE, function(mouseX, mouseY, index){
				if(game_mode == 2){
					ROOM = get_room_by_id(opened_room_id);
					if(ROOM.settings[0]=='normal' || ROOM.settings[0]=='counter'){
						if(TYPES[index].bonus != undefined && DEBUG == false){
							return false;
							}
						else{
							register_tank_action('change_tank', opened_room_id, name, index);
							return false;
							}
						}
					else
						return false;
					}
				my_tank_nr = index;
				draw_tank_select_screen(index);
				}, i);
			}
		j++;
		}
	last_selected = selected_tank;
	y = y + preview_xy+10;
	
	//tank info block
	var info_left = 15;
	var info_block_height = 100;
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.strokeStyle = "#196119";
	roundRect(canvas_backround, info_left, y, 585, info_block_height, 5, true);

	//tank stats
	if(selected_tank != undefined){
		var src = '../img/tanks/'+TYPES[selected_tank].name+'/'+TYPES[selected_tank].preview;
		var pos1 = info_left+10;
		var pos2 = y+((info_block_height-preview_xy)/2);
		drawImage_preloaded(canvas_backround, src, pos1, pos2, PLACE, 90, 90, '#ffffff', pos1, pos2, 90, 90);
		
		canvas_backround.font = "bold 18px Verdana";
		canvas_backround.fillStyle = "#196119";
		canvas_backround.fillText(TYPES[selected_tank].name, info_left+preview_xy+40, y+25);
		
		//description
		var height_space = 13;
		for(var d in TYPES[selected_tank].description){
			canvas_backround.font = "bold 11px Verdana";
			canvas_backround.fillStyle = "#69a126";
			canvas_backround.fillText(TYPES[selected_tank].description[d], info_left+preview_xy+40, y+50+d*height_space);
			}
		}
	y = y + info_block_height+10;
	
	//mini maps
	if(game_mode == 1){	
		show_maps_selection(canvas_backround, y, true);
		y = y + 81+30;
		}
		
	//teams
	if(game_mode == 2){
		ROOM = get_room_by_id(opened_room_id);
		players_n = ROOM.players.length;	
		var ICON_WIDTH = 55;
		//find my team
		var my_team;
		for(var t in ROOM.players){
			if(ROOM.players[t].name == name)
				my_team=ROOM.players[t].team;
			}
		//list
		var teams = ['B', 'R'];
		for(var t in teams){
			j = 0;
			canvas_backround.strokeStyle = "#000000";
			if(teams[t]==my_team)
				canvas_backround.fillStyle = "#8fc74c";
			else
				canvas_backround.fillStyle = "#ffffff";
			roundRect(canvas_backround, 15+1, y+1, 120, ICON_WIDTH, 2, true);
			//text
			if(teams[t]==my_team)
				text = "You and your team";	
			else
				text = "The enemy team";
			canvas_backround.fillStyle = "#000000";
			canvas_backround.font = "Bold 12px Arial";
			canvas_backround.fillText(text, 15+10, y+1+round(ICON_WIDTH/2));
			
			//players
			for(var p in ROOM.players){
				if(ROOM.players[p].team == teams[t]){
					//background
					canvas_backround.strokeStyle = "#000000";
					var back_color;
					if(ROOM.players[p].name==name)
						back_color = "#8fc74c";	//me
					else
						back_color = "#bebebe";
					canvas_backround.fillStyle = back_color;
					roundRect(canvas_backround, 122+gap+15+j*(ICON_WIDTH+2+gap)+1, y+1, ICON_WIDTH, ICON_WIDTH, 2, true);
					
					if(ROOM.players[p].tank == undefined){
						//ROOM.settings[0] = normal, mirror, random
						ROOM.players[p].tank = 0;
						}
					if(ROOM.players[p].name==name && selected_tank != undefined)
						ROOM.players[p].tank = selected_tank;
					
					//icon	
					tank_i = ROOM.players[p].tank;
					src = '../img/tanks/'+TYPES[tank_i].name+'/'+TYPES[tank_i].preview;
					var pos1 = 122+gap+15+j*(ICON_WIDTH+2+gap);
					var pos2 = y;
					drawImage_preloaded(canvas_backround, src, pos1, pos2, PLACE, ICON_WIDTH, ICON_WIDTH, back_color, pos1+2, pos2+2, ICON_WIDTH-4, ICON_WIDTH-4);
					
					j++;
					}
				}
			y = y + ICON_WIDTH+2+5;
			}
		}
		
	//time left line
	red_line_y = y+10;
	if(starting_timer==-1){
		if(game_mode == 1)	
			starting_timer = START_GAME_COUNT_SINGLE;
		else	
			starting_timer = START_GAME_COUNT_MULTI;
		}
	draw_timer_graph();
	}
function draw_timer_graph(){
	graph_width=WIDTH_APP-30;
	graph_height=40;
	
	//background
	img = new Image();
	img.src = '../img/background.jpg';
	canvas_backround.drawImage(img, 15-2, red_line_y-2, graph_width+4, graph_height+4, 15-2, red_line_y-2, graph_width+4, graph_height+4);
	
	//red block
	canvas_backround.strokeStyle = "#c10000";
	canvas_backround.fillStyle = "#c10000";
	var max_s = START_GAME_COUNT_MULTI;
	if(game_mode == 1)	
		max_s = START_GAME_COUNT_SINGLE;
	top_x = 15+graph_width*(max_s-starting_timer)/max_s;
	width = graph_width-graph_width*(max_s-starting_timer)/max_s;
	roundRect(canvas_backround, 15, red_line_y, width, graph_height, 0, true);
	
	//text
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 40px Arial";
	text = starting_timer;
	if(text>9)
		canvas_backround.fillText(text, 25, red_line_y+graph_height-5);
	else
		canvas_backround.fillText(text, 25, red_line_y+graph_height-5);
	}
//shwo preload progress line
function update_preload(images_loaded){
	if(preloaded==true) return false;
	preload_left = preload_left - images_loaded;
	
	//reset
	canvas_backround.strokeStyle = "#dbd9da";
	canvas_backround.fillStyle = "#dbd9da";
	roundRect(canvas_backround, 0, HEIGHT_APP-24, WIDTH_APP, 23, 0, true);
	
	if(preload_left==0 || preload_left < 3){
		preloaded=true;
		//add_first_screen_elements();
		intro();
		return false;
		}
	
	//fill
	canvas_backround.strokeStyle = "#0c6934";
	canvas_backround.fillStyle = "#ff0000";
	var line_width = round((WIDTH_APP-2)*(preload_total-preload_left)/preload_total);
	roundRect(canvas_backround, 1, HEIGHT_APP-24, line_width, 23, 0, true);
	
	//add text
	text = "Loading: "+Math.floor((preload_total-preload_left)*100/preload_total)+"%";
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Normal 12px Arial";
	canvas_backround.fillText(text, 10, HEIGHT_APP-8);
	}
//shows chat lines
function show_chat(){
	var gap = 20;
	var bottom = HEIGHT_APP - 190;

	canvas = canvas_main;
	
	canvas.font = "bold 13px Helvetica";
	for(var i = CHAT_LINES.length - 1; i >= 0; i--){
		var text;
		if(CHAT_LINES[i].author===false)
			text = CHAT_LINES[i].text;
		else
			text = CHAT_LINES[i].author+": "+CHAT_LINES[i].text;
		if(text.length > 100)
			text = text.substring(0, 100);
		
		//background
		canvas.font = "normal 13px Helvetica";
		canvas.fillStyle = "#dbd9da";
		roundRect(canvas, 5, bottom-i*gap-13, text.length*7+10, 17, 3, true);
		
		//text color
		if(CHAT_LINES[i].author===false)
			canvas.fillStyle = "#6f155f";	//system chat
		else if(CHAT_LINES[i].team == 'R')
			canvas.fillStyle = "#ff0000";	//team red
		else if(CHAT_LINES[i].team == 'B')
			canvas.fillStyle = "#0000ff";	//team blue
		else
			canvas.fillStyle = "#444444";	//default color
		
		//shift
		if(CHAT_LINES[i].shift==1 && PLACE != 'game'){
			canvas.font = "bold 13px Helvetica";
			canvas.fillStyle = "#ff0000";	//default color
			}
		
		//show it
		canvas.fillText(text, 10, bottom-i*gap);
		}
	}
//calculate body and turret rotation
function body_rotation(obj, str, speed, rot, time_diff){
	if(obj.stun != undefined)	return false; //stun
	if(obj.speed == 0)	return false; //0 speed
	speed = speed * 100 * time_diff/1000;
	var flag = false;
	if (obj[str] - 180 > rot){
		rot += 360;
	}
	if (obj[str] + 180 < rot){
		rot -= 360;
	}
	if (obj[str] - rot > speed){
		obj[str] -= speed;
	} else if (obj[str] - rot < -speed){
		obj[str] += speed;
	} else {
		obj[str] = rot;
		flag = true;
	}
	return flag;
	}
