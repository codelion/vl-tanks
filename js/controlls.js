//keyboard actions
function on_keyboard_action(event){
	k = event.keyCode;
	
	//add shortcuts
	if(PLACE == 'game'){
		if(MY_TANK['dead'] != 1){
			if(k == 49){	
				//special 1
				do_ability(1, MY_TANK);
				}	
			else if(k == 50){
				//sepcial 2
				do_ability(2, MY_TANK);
				}
			else if(k == 51){
				//special 3
				do_ability(3, MY_TANK);
				}
			}
		if(k==9){				
			//TAB
			if(tab_scores==false)
				tab_scores=true;	
			else
				tab_scores=false;
			}
		}
	if(k==13){
		//enter
		if(PLACE=='room' || PLACE=='game' || PLACE=='select'){
			if(chat_mode==0){
				//begin write
				chat_mode=1;
				document.getElementById("chat_write").style.visibility = 'visible';
				document.getElementById("chat_text").focus();
				}
			else{
				//end write
				chat_mode=0;
				document.getElementById("chat_write").style.visibility = 'hidden';
				chat();
				}
			}
		}
	
	//disable some keys
	//if(k >= 37 && k <= 40)
	//	return false;	//scroll
	if(k==9)
		return false;	//TAB
		
	return true;
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
//mouse click 
function on_mousedown(event){
	//mouse position
	if(event.offsetX) {
		mouseX = event.offsetX-map_offset[0];
		mouseY = event.offsetY-map_offset[1];
		}
	else if(event.layerX) {
		mouseX = event.layerX-map_offset[0];
		mouseY = event.layerY-map_offset[1];
		}
	mouse_click_pos = [mouseX,mouseY];
	if(PLACE != 'game'){
		for(var i in BUTTONS){
			if(BUTTONS[i].place != '' && BUTTONS[i].place != PLACE) continue;
			if(mouseX < BUTTONS[i].x || mouseX > BUTTONS[i].x+BUTTONS[i].width)  continue;
			if(mouseY < BUTTONS[i].y || mouseY > BUTTONS[i].y+BUTTONS[i].height)  continue;
			if(typeof BUTTONS[i].function == 'string')
				window[BUTTONS[i].function](mouseX, mouseY, BUTTONS[i].extra);
			else
				BUTTONS[i].function(mouseX, mouseY, BUTTONS[i].extra);
			}
		}
	//move tank
	if(PLACE == 'game')
		draw_tank_move(mouseX, mouseY);
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
	for(var i in BUTTONS){
		if(BUTTONS[i].place != '' && BUTTONS[i].place != PLACE) continue;
		if(mouseX < BUTTONS[i].x || mouseX > BUTTONS[i].x+BUTTONS[i].width)  continue;
		if(mouseY < BUTTONS[i].y || mouseY > BUTTONS[i].y+BUTTONS[i].height)  continue;
		if(typeof BUTTONS[i].function == 'string')
			window[BUTTONS[i].function](mouseX, mouseY, BUTTONS[i].extra);
		else
			BUTTONS[i].function(mouseX, mouseY, BUTTONS[i].extra);
		}
	if(PLACE=='game' && FS==true){
		//alternative #1 - y coord changes couse of FS screen size change
		mouseY = mouseY + 175 - HEIGHT_APP + 350;
		for(var i in BUTTONS){
			if(BUTTONS[i].place != '' && BUTTONS[i].place != PLACE) continue;
			if(mouseX < BUTTONS[i].x || mouseX > BUTTONS[i].x+BUTTONS[i].width)  continue;
			if(mouseY < BUTTONS[i].y || mouseY > BUTTONS[i].y+BUTTONS[i].height)  continue;
			if(typeof BUTTONS[i].function == 'string')
				window[BUTTONS[i].function](mouseX, mouseY, BUTTONS[i].extra);
			else
				BUTTONS[i].function(mouseX, mouseY, BUTTONS[i].extra);
			}
		//alternative #2 - x coord changes couse of statsu bar can be centered
		mouseX = mouseX - round((WIDTH_APP-700)/2);
		for(var i in BUTTONS){
			if(BUTTONS[i].place != '' && BUTTONS[i].place != PLACE) continue;
			if(mouseX < BUTTONS[i].x || mouseX > BUTTONS[i].x+BUTTONS[i].width)  continue;
			if(mouseY < BUTTONS[i].y || mouseY > BUTTONS[i].y+BUTTONS[i].height)  continue;
			if(typeof BUTTONS[i].function == 'string')
				window[BUTTONS[i].function](mouseX, mouseY, BUTTONS[i].extra);
			else
				BUTTONS[i].function(mouseX, mouseY, BUTTONS[i].extra);
			}
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
