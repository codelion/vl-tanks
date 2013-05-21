//check support
if(document.getElementById("canvas_map").getContex==false) alert('Error, your browser does not support canvas.');

//keyboard actions
function on_keyboard_action(event){
	k = event.keyCode;	//log(k);
	
	//add shortcuts
	if(PLACE == 'game'){
		if(MY_TANK.dead != 1 && chat_mode==0){
			if(k == 49 || k == 97 )	
				do_ability(1, MY_TANK);	//special 1
			else if(k == 50 || k == 98)
				do_ability(2, MY_TANK);	//sepcial 2
			else if(k == 51 || k == 99)
				do_ability(3, MY_TANK);	//special 3
			else if(k == 38)
				scoll_map(0, 1);	//up
			else if(k == 40)
				scoll_map(0, -1); 	//down
			else if(k == 39)
				scoll_map(-1, 0);	//left
			else if(k == 37)
				scoll_map(1, 0); 	//right
			else if(k == 27){		//esc
				if(PLACE == 'game'){
					//stop move
					if(game_mode == 2){
						if(MY_TANK.move == 1)
							register_tank_action('move', opened_room_id, MY_TANK.id, [round(MY_TANK.x), round(MY_TANK.y), round(MY_TANK.x), round(MY_TANK.y)]);
						}
					else
						MY_TANK.move = 0;
					//reset scroll
					if(MAP_SCROLL_MODE==2){
						MAP_SCROLL_MODE = 1;
						auto_scoll_map();
						}
					}	
				}
			}
		if(k==9){				
			//TAB
			if(tab_scores==false)
				tab_scores=true;	
			else
				tab_scores=false;
			}
		if(k==85){
			//u
			ABILITIES_MODE++;
			if(ABILITIES_MODE>3) ABILITIES_MODE = 0;
			if(MY_TANK.abilities_lvl[ABILITIES_MODE-1]==MAX_ABILITY_LEVEL){
				ABILITIES_MODE++;
				if(MY_TANK.abilities_lvl[ABILITIES_MODE-1]==MAX_ABILITY_LEVEL){
					ABILITIES_MODE++;
					if(MY_TANK.abilities_lvl[ABILITIES_MODE-1]==MAX_ABILITY_LEVEL)
						ABILITIES_MODE++;
					}	
				}
			if(ABILITIES_MODE>3) ABILITIES_MODE = 0;
			draw_tank_abilities();
			}
		}
	if(k==16)
		shift_pressed = true; //shift
	if(k==13){
		//enter
		if(PLACE=='rooms' || PLACE=='room' || PLACE=='game' || PLACE=='select' || PLACE=='score'){
			if(chat_mode==0){
				//begin write
				chat_mode=1;
				document.getElementById("chat_write").style.visibility = 'visible';
				document.getElementById("chat_text").focus();
				if(shift_pressed==true)
					chat_shifted = true;
				else
					chat_shifted = false;
				}
			else{
				//end write
				chat_mode=0;
				document.getElementById("chat_write").style.visibility = 'hidden';
				chat();
				}
			}
		}
	if(k==83 && chat_mode==0){
		//s
		if(MAP_SCROLL_MODE==1) MAP_SCROLL_MODE = 2;
		else{
			MAP_SCROLL_MODE = 1;
			auto_scoll_map();
			}
		}
	if(k == 27){	//esc
		if(PLACE == 'library' || PLACE == 'intro')
			quit_game();
		}
	
	//disable some keys
	if(k >= 37 && k <= 40 && chat_mode != 1) return false;	//scroll with left, rigth, up and down
	if(k==9)	return false;	//TAB
		
	return true;
	}
//keyboard release
function on_keyboardup_action(event){
	k = event.keyCode;
	if(k==16)
		shift_pressed = false; //shift
	}
//mouse scroll
function MouseWheelHandler(e){
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	if(PLACE != 'game') return true;
	
	//enable manual scroll
	if(MAP_SCROLL_MODE == 1)
		MAP_SCROLL_MODE = 2;
	
	//scroll	
	if(delta == 1)
		scoll_map(0, 1);
	else if(delta == -1)
		scoll_map(0, -1);
	
	//disable page scroll - dont worry, only on started game area
	e.preventDefault()
	return false;
	}
//mouse move on background
function on_mousemove_background(event){
	if(event.offsetX) {
		mouseX = event.offsetX;
		mouseY = event.offsetY;
		}
	else if(event.layerX) {
		mouseX = event.layerX;
		mouseY = event.layerY;
		}
	mouse_pos = [mouseX, mouseY];
	//full screen fix
	if(FS==true){
		mouseX = mouseX - status_x;	
		mouseY = mouseY + APP_SIZE_CACHE[1] - HEIGHT_APP;
		}
	//settings actions
	if(PLACE == 'init'){
		if(preloaded==false)
			return false;
		var found = false;
		for (i in settings_positions){
			if(mouseX > settings_positions[i].x && mouseX < settings_positions[i].x+settings_positions[i].width){
				if(mouseY > settings_positions[i].y && mouseY < settings_positions[i].y+settings_positions[i].height){
					//we have mouse over button
					add_settings_buttons(canvas_backround, ["Single player","Multiplayer","Settings"], i);
					found = true;
					}
				}
			}
		if(found == false)
			add_settings_buttons(canvas_backround, ["Single player","Multiplayer","Settings"], 99);		
		}
	if(PLACE=='game'){
		//mouse hover on abilities
		var new_i;
		for(var i=0; i<ABILITIES_POS.length; i++){
			if(mouseX>ABILITIES_POS[i].x && mouseX<ABILITIES_POS[i].x+ABILITIES_POS[i].width){
				if(mouseY>ABILITIES_POS[i].y && mouseY<ABILITIES_POS[i].y+ABILITIES_POS[i].height){
					new_i = i;
					}
				}
			}
		if(new_i != ability_hover_id){
			ability_hover_id = new_i;
			if(new_i != undefined && TYPES[MY_TANK.type].abilities[new_i] != undefined){
				function_name = TYPES[MY_TANK.type].abilities[new_i].name.replace(/ /g,'_');
				ability_hover_text = window[function_name](MY_TANK, true);
				}
			else
				ability_hover_text = '';
			//renew
			show_skill_description();	
			}
		//mini map scrolling
		if(MAP_SCROLL_CONTROLL==true){
			move_to_place(mouseX, mouseY);
			}
		}		
	}
//mouse move on map
function on_mousemove(event){
	if(event.offsetX) {
		mouseX = event.offsetX;
		mouseY = event.offsetY;
		}
	else if(event.layerX) {
		mouseX = event.layerX;
		mouseY = event.layerY;
		}
	mouse_pos = [mouseX, mouseY];
	}	
//mouse right click
function on_mouse_right_click(event){
	//mouse position
	if(event.offsetX) {
		mouseX = event.offsetX-map_offset[0];
		mouseY = event.offsetY-map_offset[1];
		}
	else if(event.layerX) {
		mouseX = event.layerX-map_offset[0];
		mouseY = event.layerY-map_offset[1];
		}
	if(PLACE == 'game')
		soldiers_move(mouseX, mouseY);	
	
	return false;
	}
//mouse click 
function on_mousedown(event){
	if(event.which == 3) return false;
	//mouse position
	if(event.offsetX) {
		mouseX = event.offsetX;
		mouseY = event.offsetY;
		}
	else if(event.layerX) {
		mouseX = event.layerX;
		mouseY = event.layerY;
		}
	if(PLACE != 'game'){
		menu_pressed = false;	
		for(var i in BUTTONS){
			if(BUTTONS[i].place != '' && BUTTONS[i].place != PLACE) continue;
			if(mouseX < BUTTONS[i].x || mouseX > BUTTONS[i].x+BUTTONS[i].width)  continue;
			if(mouseY < BUTTONS[i].y || mouseY > BUTTONS[i].y+BUTTONS[i].height)  continue;
			if(typeof BUTTONS[i].function == 'string')
				window[BUTTONS[i].function](mouseX, mouseY, BUTTONS[i].extra);
			else
				BUTTONS[i].function(mouseX, mouseY, BUTTONS[i].extra);
			break;
			}
		}
	//move tank
	if(PLACE == 'game'){
		mouseX = mouseX-map_offset[0];
		mouseY = mouseY-map_offset[1];
		mouse_click_pos = [mouseX, mouseY];
		draw_tank_move(mouseX, mouseY);
		}
	}
function on_mouse_up(event){
	
	}
//mouse click on background
function on_mousedown_back(event){
	if(event.offsetX) {
		mouseX = event.offsetX;
		mouseY = event.offsetY;
		}
	else if(event.layerX) {
		mouseX = event.layerX;
		mouseY = event.layerY;
		}
	menu_pressed = false;
	//full screen fix
	if(FS==true){
		mouseX = mouseX - status_x;	
		mouseY = mouseY + APP_SIZE_CACHE[1] - HEIGHT_APP;
		}
	for(var i in BUTTONS){
		if(BUTTONS[i]==undefined) continue;
		if(BUTTONS[i].place != '' && BUTTONS[i].place != PLACE) continue;
		if(mouseX < BUTTONS[i].x || mouseX > BUTTONS[i].x+BUTTONS[i].width)  continue;
		if(mouseY < BUTTONS[i].y || mouseY > BUTTONS[i].y+BUTTONS[i].height)  continue;
		if(typeof BUTTONS[i].function == 'string')
			window[BUTTONS[i].function](mouseX, mouseY, BUTTONS[i].extra);
		else
			BUTTONS[i].function(mouseX, mouseY, BUTTONS[i].extra);
		break;
		}
	}
//mouse click release on background
function on_mouseup_back(event){
	if(PLACE=='game' && MAP_SCROLL_CONTROLL==true){
		MAP_SCROLL_CONTROLL=false;
		if(MAP_SCROLL_MODE==1)
			move_to_place_reset();
		}
	}
//fullscreen on modern browsers
function fullscreen(object){
	if(FS==false){
		//turn on
		var elem = document.getElementById(object);
		if (elem.requestFullscreen)
			elem.requestFullscreen();		//support in future
		else if(elem.mozRequestFullScreen)
			elem.mozRequestFullScreen();		//Firefox
		else if(elem.webkitRequestFullscreen)
			elem.webkitRequestFullscreen();	//chrome, safari
		}
	else{	
		//turn off							
		if (document.cancelFullscreen)
			document.cancelFullscreen();		//support in future
		else if(document.mozCancelFullScreen)
			document.mozCancelFullScreen();	//Firefox
		else if(document.webkitCancelFullScreen)
			document.webkitCancelFullScreen();	//chrome, safari*/
		}
	}
//on exit full screen
function full_screenchange_handler(event){
	if(document.fullscreen==true || document.mozFullScreen==true || document.webkitIsFullScreen==true){
		//turn on
		FS = true;
		if(PLACE == 'game'){
			check_canvas_sizes();
			draw_map(false);
			}
		}
	if(document.fullscreen==false || document.mozFullScreen==false || document.webkitIsFullScreen==false){
		//turn off
		FS = false;
		if(PLACE == 'game'){
			check_canvas_sizes();
			draw_map(false);
			}
		else if(PLACE == 'init'){
			check_canvas_sizes();
			init_game(false);
			}	
		}
	}
