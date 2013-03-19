//rooms list window
function draw_rooms_list(){
	PLACE = 'rooms';
	img = new Image();
	img.src = 'img/background.jpg';
	canvas_backround.drawImage(img, 0, 0, 700, 500, 0, 0, WIDTH_APP, HEIGHT_APP-27);
	
	//left block
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#ffffff";
	roundRect(canvas_backround, 10, 10, 155, 205, 5, true);
	
	x = 20;
	y = 20;
	width = 135;
	height = 35;
	gap = 10;
	letter_padding_left = 15;
	
	//back button
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#c60000";
	height = 35;
	roundRect(canvas_backround, x, y, width, height, 5, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		init_game(false);
		});
	//text
	text = "Back to menu";
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 14px Arial";
	canvas_backround.fillText(text, x+letter_padding_left, y+(height+font_pixel_to_height(14))/2);
	y = y + height+gap;
	
	//create button
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#aaddfe";
	height = 60;
	roundRect(canvas_backround, x, y, width, height, 5, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		draw_create_room();
		});
	//text
	text = "Create your game";
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 13px Helvetica";
	canvas_backround.fillText(text, x+letter_padding_left, y+(height+font_pixel_to_height(13))/2);
	gap = 20;
	y = y + height+gap;
	
	//players
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#ffffff";
	height = 60;
	roundRect(canvas_backround, x, y, width, height, 5, true);
	
	
	//text
	text = "Online Players: "+PLAYERS.length;
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 12px Helvetica";
	canvas_backround.fillText(text, x+letter_padding_left, y+25);
	//text
	text = "Online Rooms: "+ROOMS.length;
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 12px Helvetica";
	canvas_backround.fillText(text, x+letter_padding_left, y+45);
		
	//main list
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#ffffff";
	roundRect(canvas_backround, 175, 10, WIDTH_APP-175-10, HEIGHT_APP-45, 5, true);
	
	//show rooms
	padding_top = 20;
	height = 37;
	
	x = 185;
	y = 20;
	width = WIDTH_APP-185-20;
	height = 37;
	gap = 10;
	letter_padding_left = 15;
	for (var i=0; i<10; i++){
		if(ROOMS[i] != undefined){
			canvas_backround.strokeStyle = "#000000";
			canvas_backround.fillStyle = "#ffffff";
			roundRect(canvas_backround, x, y, width, height, 0, true);
			
			//num block
			canvas_backround.strokeStyle = "#000000";
			canvas_backround.fillStyle = "#ffffff";
			roundRect(canvas_backround, x, y, 70, height, 0, true);

			canvas_backround.strokeStyle = "#ffae00";
			canvas_backround.fillStyle = "#ffae00";
			roundRect(canvas_backround, x+1, y+1, round((70-2)*ROOMS[i].players/ROOMS[i].max), height-2, 0, true);

			//num text
			canvas_backround.fillStyle = "#3f3b30";
			canvas_backround.font = "Bold 14px Helvetica";
			text = ROOMS[i].players.length+"/"+ROOMS[i].max;
			canvas_backround.fillText(text, x+letter_padding_left, y+(height+font_pixel_to_height(14))/2);
			
			//join block
			canvas_backround.strokeStyle = "#000000";
			canvas_backround.fillStyle = "#a8dcfe";
			roundRect(canvas_backround, x+width-70, y, 70, height, 0, true);
			
			//on click event
			register_button(x+width-70, y, 70, height, PLACE, function(xx, yy, extra){
				var ROOM = get_room_by_id(extra); 
				if(ROOM != false && ROOM.players.length < ROOM.max){
					register_tank_action('join_room', extra, name);
					draw_room(extra);
					}
				}, ROOMS[i].id);
	
			//join text
			canvas_backround.fillStyle = "#0b4266";
			canvas_backround.font = "Bold 14px Helvetica";
			canvas_backround.fillText("Join", x+width+letter_padding_left-70, y+(height+font_pixel_to_height(14))/2);
			
			//title text
			canvas_backround.fillStyle = "#3f3b30";
			canvas_backround.font = "Bold 13px Helvetica";
			text = ROOMS[i].name;
			canvas_backround.fillText(text, x+70+letter_padding_left,y+18);
			
			//more info text
			canvas_backround.fillStyle = "#b3b3e8";
			canvas_backround.font = "Normal 11px Helvetica";
			text = ucfirst(ROOMS[i].settings[0])+", "+ucfirst(ROOMS[i].settings[1]+", "+ROOMS[i].settings[2]);
			canvas_backround.fillText(text, x+70+letter_padding_left, y+20+10);
			}
		else{
			//empty
			canvas_backround.strokeStyle = "#aaaaaa";
			canvas_backround.fillStyle = "#ffffff";
			roundRect(canvas_backround, x, y, width, height, 0, true);
			}
		y = y + height+gap;
		}
	}
//create new room window
function draw_create_room(game_players, game_mode, game_type, game_map){
	if(game_players==undefined)
		game_players='14';
	if(game_mode==undefined)
		game_mode='normal';	
	if(game_type==undefined)
		game_type='quick';
	if(game_map==undefined)
		game_map='Classic';
		
	PLACE = 'create_room';
	img = new Image();
	img.src = 'img/background.jpg';
	canvas_backround.drawImage(img, 0, 0, 700, 500, 0, 0, WIDTH_APP, HEIGHT_APP-27);
	
	game_name = name+"'s Minions";
	button_width = 80;
	button_height = 20;
	button_gap = 10;
	button_active_color = '#b7e2fe';
	button_inactive_color = '#d6d6d6';	
	
	//name block	
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#f4f7fb";
	roundRect(canvas_backround, 10, 10, WIDTH_APP-10-10, 40, 5, true);
	
	//name text
	canvas_backround.fillStyle = "#3f3b30";
	canvas_backround.font = "Bold 13px Arial";
	text = "Name:";
	canvas_backround.fillText(text, 10+15, 10+25);
	
	//name text value border
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#ffffff";
	roundRect(canvas_backround, 75, 20, 300, 20, 0, true);
	register_button(75, 20, 300, 20, PLACE, function(){
		var name_tmp = prompt("Please enter game name", game_name);
		if(name_tmp != null){
			game_name = name_tmp;
			
			//clean old name
			canvas_backround.strokeStyle = "#000000";
			canvas_backround.fillStyle = "#ffffff";
			roundRect(canvas_backround, 75, 20, 300, 20, 0, true);
			
			//redraw name text value
			canvas_backround.fillStyle = "#000000";
			canvas_backround.font = "Normal 12px Arial";
			text = game_name;
			canvas_backround.fillText(text, 80, 10+25);
			}
		});
	
	//name text value
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Normal 12px Arial";
	text = game_name;
	canvas_backround.fillText(text, 80, 10+25);
	
	//setting block
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#eeeeed";
	roundRect(canvas_backround, 10, 60, WIDTH_APP-10-10, HEIGHT_APP-95, 5, true);
	
	//players text - 2/4...20
	var offset_top = 0;
	var offset_left = 120;
	canvas_backround.fillStyle = "#3f3b30";
	canvas_backround.font = "Bold 13px Arial";
	text = "Max players:";
	canvas_backround.fillText(text, 10+15, 60+25+offset_top);
	
	values = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
	button_width = button_width - 40;
	for(var i in values){
		//block
		canvas_backround.strokeStyle = "#000000";
		if(values[i] == game_players)
			canvas_backround.fillStyle = button_active_color;
		else
			canvas_backround.fillStyle = button_inactive_color;
		roundRect(canvas_backround, 10+offset_left+i*(button_width+button_gap), 60+offset_top+10, button_width, button_height, 2, true);
		
		//action
		register_button(10+offset_left+i*(button_width+button_gap), 60+offset_top+10, button_width, button_height, PLACE, function(xx, yy, extra){
			game_players = extra;
			draw_create_room(game_players, game_mode, game_type, game_map);
			}, values[i]);
		
		//text
		canvas_backround.fillStyle = "#3f3b30";
		canvas_backround.font = "Normal 12px Arial";
		text = values[i];
		canvas_backround.fillText(text, 10+offset_left+10+i*(button_width+button_gap), 60+offset_top+25);
		}
	button_width = button_width + 40;
	offset_top = offset_top + 40;
	
	//mode text - normal/random/mirror
	canvas_backround.fillStyle = "#3f3b30";
	canvas_backround.font = "Bold 13px Arial";
	text = "Game Mode:";
	canvas_backround.fillText(text, 10+15, 60+25+offset_top);
	
	values = ['normal', 'random', 'mirror'];
	for(var i in values){
		//block
		canvas_backround.strokeStyle = "#000000";
		if(values[i] == game_mode)
			canvas_backround.fillStyle = button_active_color;
		else
			canvas_backround.fillStyle = button_inactive_color;
		roundRect(canvas_backround, 10+offset_left+i*(button_width+button_gap), 60+offset_top+10, button_width, button_height, 2, true);
		
		//action
		register_button(10+offset_left+i*(button_width+button_gap), 60+offset_top+10, button_width, button_height, PLACE, function(xx, yy, extra){
			game_mode = extra;
			draw_create_room(game_players, game_mode, game_type, game_map);
			}, values[i]);
		
		//text
		canvas_backround.fillStyle = "#3f3b30";
		canvas_backround.font = "Normal 12px Arial";
		text = ucfirst(values[i]);
		canvas_backround.fillText(text, 10+offset_left+10+i*(button_width+button_gap), 60+offset_top+25);
		}
	offset_top = offset_top + 40;
	
	//type text - normal/quick
	canvas_backround.fillStyle = "#3f3b30";
	canvas_backround.font = "Bold 13px Arial";
	text = "Game Type:";
	canvas_backround.fillText(text, 10+15, 60+25+offset_top);
	
	values = ['Default'];
	for(var i in values){
		//block
		canvas_backround.strokeStyle = "#000000";
		if(values[i] == game_type)
			canvas_backround.fillStyle = button_active_color;
		else
			canvas_backround.fillStyle = button_inactive_color;
		roundRect(canvas_backround, 10+offset_left+i*(button_width+button_gap), 60+offset_top+10, button_width, button_height, 2, true);
		
		//action
		register_button(10+offset_left+i*(button_width+button_gap), 60+offset_top+10, button_width, button_height, PLACE, function(xx, yy, extra){
			game_type = extra;
			draw_create_room(game_players, game_mode, game_type, game_map);
			}, values[i]);
		
		//text
		canvas_backround.fillStyle = "#3f3b30";
		canvas_backround.font = "Normal 12px Arial";
		text = ucfirst(values[i]);
		canvas_backround.fillText(text, 10+offset_left+10+i*(button_width+button_gap), 60+offset_top+25);
		}
	offset_top = offset_top + 40;
	
	//map
	canvas_backround.fillStyle = "#3f3b30";
	canvas_backround.font = "Bold 13px Arial";
	text = "Map:";
	canvas_backround.fillText(text, 10+15, 60+25+offset_top);
	
	for(var i in MAPS){
		//block
		canvas_backround.strokeStyle = "#000000";
		if(MAPS[i].name == game_map)
			canvas_backround.fillStyle = button_active_color;
		else
			canvas_backround.fillStyle = button_inactive_color;
		roundRect(canvas_backround, 10+offset_left+i*(button_width+button_gap), 60+offset_top+10, button_width, button_height, 2, true);
		
		//action
		register_button(10+offset_left+i*(button_width+button_gap), 60+offset_top+10, button_width, button_height, PLACE, function(xx, yy, extra){
			game_map = extra;
			draw_create_room(game_players, game_mode, game_type, game_map);
			}, MAPS[i].name);
		
		//text
		canvas_backround.fillStyle = "#3f3b30";
		canvas_backround.font = "Normal 12px Arial";
		text = ucfirst(MAPS[i].name);
		canvas_backround.fillText(text, 10+offset_left+10+i*(button_width+button_gap), 60+offset_top+25);
		}
	offset_top = offset_top + 40;
	
	offset_top = offset_top + 20;
	//create button block
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#69a126";
	roundRect(canvas_backround, 10+offset_left, 60+offset_top, 105, 30, 2, true);
	
	//create button text
	canvas_backround.fillStyle = "#3f3b30";
	canvas_backround.font = "Bold 13px Arial";
	text = "Create Game";
	canvas_backround.fillText(text, 10+offset_left+10, 60+offset_top+20);
	
	//register button
	register_button(10+offset_left, 60+offset_top, 105, 30, PLACE, function(){
		new_id = register_new_room(game_name, game_mode, game_type, game_players, game_map);
		draw_room(new_id);
		});	
	}
//room waiting for players
function draw_room(room_id){
	PLACE = 'room';
	img = new Image();
	img.src = 'img/background.jpg';
	canvas_backround.drawImage(img, 0, 0, 700, 500, 0, 0, WIDTH_APP, HEIGHT_APP-27);
	
	ROOM = get_room_by_id(room_id);
	opened_room_id = ROOM.id;
	players = ROOM.players;
	
	//left block
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#ffffff";
	roundRect(canvas_backround, 10, 10, 155, 125, 5, true);
	
	x = 20;
	y = 20;
	width = 135;
	height = 35;
	gap = 10;
	letter_padding_left = 15;
	
	//back button
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#c60000";
	height = 35;
	roundRect(canvas_backround, x, y, width, height, 5, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		register_tank_action('leave_room', ROOM.id, name);
		draw_rooms_list();
		});
	//text
	text = "Back to lobby";
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 14px Arial";
	canvas_backround.fillText(text, x+letter_padding_left, y+(height+font_pixel_to_height(14))/2);
	y = y + height+gap;
	
	//start button
	if(ROOM.host==name){
		canvas_backround.strokeStyle = "#000000";
		if(ROOM.players.length%2==0)
			canvas_backround.fillStyle = "#aaddfe";	//active
		else
			canvas_backround.fillStyle = "#e2e2e2";	//inactive
		height = 60;
		roundRect(canvas_backround, x, y, width, height, 5, true);
		register_button(x, y, width, height, PLACE, function(xx, yy){
			//check if room has correct player number
			var room_tmp = get_room_by_id(opened_room_id);
			if(room_tmp == false /*|| room_tmp.players.length%2==1*/){
				return false;	//error or wrong count
				}
			//show select tanks room
			game_mode = 2;
			register_tank_action('prepare_game', opened_room_id);
			});
		
		//text
		text = "Start the game";
		canvas_backround.fillStyle = "#000000";
		canvas_backround.font = "Bold 13px Helvetica";
		canvas_backround.fillText(text, x+letter_padding_left, y+(height+font_pixel_to_height(13))/2);
		gap = 20;
		y = y + height+gap;
		}
	
	//main list
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#ffffff";
	roundRect(canvas_backround, 175, 10, WIDTH_APP-175-10, HEIGHT_APP-45, 5, true);
	
	//show players
	height = 25;
	gap = 10;
	width = (WIDTH_APP-185-20)/2-gap;
	letter_padding_left = 10;
	x1 = 185;
	x2 = 185+gap+width;
	y = 20;
	
	//team 1 text
	/*text = "Team 1";
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 14px Helvetica";
	canvas_backround.fillText(text, x1, y+15);
	
	//switch1 block
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#afdefe";
	roundRect(canvas_backround, x1+70, y, 90, 20, 2, true);
	register_button(x1+70, y, 90, 20, PLACE, function(xx, yy, team){
		alert('Stay in team '+team);
		}, 'B');
	
	//switch1 text
	text = "Switch team";
	canvas_backround.fillStyle = "#02395d";
	canvas_backround.font = "Bold 12px Helvetica";
	canvas_backround.fillText(text, x1+70+5, y+15);
	
	//team 2 text
	text = "Team 2";
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 14px Helvetica";
	canvas_backround.fillText(text, x2, y+15);
	
	//switch2 block
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#e2e2e2";
	roundRect(canvas_backround, x2+70, y, 90, 20, 2, true);
	register_button(x2+70, y, 90, 20, PLACE, function(xx, yy, team){
		alert('Stay in team '+team);
		}, 'R');
	
	//switch2 text
	text = "Switch team";
	canvas_backround.fillStyle = "#9a9a9a";
	canvas_backround.font = "Bold 12px Helvetica";
	canvas_backround.fillText(text, x2+70+5, y+15);
	
	y = y + 20+gap;*/
	
	y_begin = y;
	icon_width = height;
	
	//LEFT
	left_n = 0;
	for(var i in players){
		if(players[i].team=="B"){
			left_n++;
			//man block
			canvas_backround.strokeStyle = "#000000";
			canvas_backround.fillStyle = "#c4cfff";
			roundRect(canvas_backround, x1, y, width, height, 0, true);
			
			//icon block
			canvas_backround.strokeStyle = "#000000";
			canvas_backround.fillStyle = "#edcbb7";
			roundRect(canvas_backround, x1, y, icon_width, height, 0, true);
			
			//icon
			text = "B";
			canvas_backround.fillStyle = "#000000";
			canvas_backround.font = "Bold 15px Arial";
			canvas_backround.fillText(text, x1+letter_padding_left, y+(height+font_pixel_to_height(15))/2);
			
			//name
			text = players[i].name;
			canvas_backround.fillStyle = "#000000";
			canvas_backround.font = "Bold 13px Helvetica";
			canvas_backround.fillText(text, x1+icon_width+letter_padding_left, y+(height+font_pixel_to_height(13))/2);
	
			if(ROOM.host==name && players[i].name != name){
				//kick block
				canvas_backround.strokeStyle = "#000000";
				canvas_backround.fillStyle = "#9fd9fe";
				roundRect(canvas_backround, x1+width-50, y, 50, height, 0, true);
				
				//kick text
				text = "Kick";
				canvas_backround.fillStyle = "#000000";
				canvas_backround.font = "Bold 12px Helvetica";
				canvas_backround.fillText(text, x1+width-50+letter_padding_left, y+(height+font_pixel_to_height(12))/2);
				
				//onkick event
				register_button(x1+width-50, y, 50, height, PLACE, function(xx, yy, extra){
					on_kick_player('left', extra, opened_room_id);
					}, left_n-1);
				}			
			}
		else
			continue;
		y = y + height+gap;
		}
	for (var i=left_n; i<10; i++){
		//empty
		canvas_backround.strokeStyle = "#aaaaaa";
		canvas_backround.fillStyle = "#ffffff";
		roundRect(canvas_backround, x1, y, width, height, 0, true);
		
		y = y + height+gap;
		}
	
	//RIGHT
	y = y_begin;
	right_n = 0;
	for(var i in players){
		if(players[i].team=="R"){
			right_n++;
			//man block
			canvas_backround.strokeStyle = "#000000";
			canvas_backround.fillStyle = "#ffc4c4";
			roundRect(canvas_backround, x2, y, width, height, 0, true);
			
			//icon block
			canvas_backround.strokeStyle = "#000000";
			canvas_backround.fillStyle = "#edcbb7";
			roundRect(canvas_backround, x2, y, icon_width, height, 0, true);
			
			//icon
			text = "R";
			canvas_backround.fillStyle = "#000000";
			canvas_backround.font = "Bold 15px Arial";
			canvas_backround.fillText(text, x2+letter_padding_left, y+(height+font_pixel_to_height(15))/2);

			
			//name
			text = players[i].name;
			canvas_backround.fillStyle = "#000000";
			canvas_backround.font = "Bold 13px Helvetica";
			canvas_backround.fillText(text, x2+icon_width+letter_padding_left, y+(height+font_pixel_to_height(13))/2);
			
			if(ROOM.host==name){
				//kick block
				canvas_backround.strokeStyle = "#000000";
				canvas_backround.fillStyle = "#9fd9fe";
				roundRect(canvas_backround, x2+width-50, y, 50, height, 0, true);
				
				//kick text
				text = "Kick";
				canvas_backround.fillStyle = "#000000";
				canvas_backround.font = "Bold 12px Helvetica";
				canvas_backround.fillText(text, x2+width-50+letter_padding_left, y+(height+font_pixel_to_height(12))/2);
				
				//onkick event
				register_button(x2+width-50, y, 50, height, PLACE, function(xx, yy, extra){
					on_kick_player('right', extra, opened_room_id);
					}, right_n-1);
				}	
			}
		else
			continue;
		y = y + height+gap;
		}
	for (var i=right_n; i<10; i++){
		//empty
		canvas_backround.strokeStyle = "#aaaaaa";
		canvas_backround.fillStyle = "#ffffff";
		roundRect(canvas_backround, x2, y, width, height, 0, true);
		
		y = y + height+gap;
		}
	
	//game name
	text = "Game Name:";
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 12px Helvetica";
	canvas_backround.fillText(text, x1, y+15);
	
	text = ROOM.name;
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Normal 12px Helvetica";
	canvas_backround.fillText(text, x1+80, y+15);
	
	y = y + 18;
	
	//game settings
	text = "Settings:";
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 12px Helvetica";
	canvas_backround.fillText(text, x1, y+15);
	
	text = ucfirst(ROOM.settings[0])+", "+ucfirst(ROOM.settings[1]+", "+ROOM.settings[2]);
	canvas_backround.fillStyle = "#b5b5e7";
	canvas_backround.font = "Normal 12px Helvetica";
	canvas_backround.fillText(text, x1+80, y+15);
	
	y = y + 18;
	
	//max players
	text = "Max Players:";
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 12px Helvetica";
	canvas_backround.fillText(text, x1, y+15);
	
	text = ROOM.max;
	canvas_backround.fillStyle = "#b5b5e7";
	canvas_backround.font = "Normal 12px Helvetica";
	canvas_backround.fillText(text, x1+80, y+15);
	
	y = y + 18;
	
	//host
	text = "Room leader:";
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 12px Helvetica";
	canvas_backround.fillText(text, x1, y+15);
	
	text = ROOM.host;
	canvas_backround.fillStyle = "#b5b5e7";
	canvas_backround.font = "Normal 12px Helvetica";
	canvas_backround.fillText(text, x1+80, y+15);
	}
//kick button was pressed - find player
function on_kick_player(side, index, room_id){
	left_n = 0;
	right_n = 0;
	for(var i in players){
		if(side=='left' && players[i].team=="B"){
			if(index==left_n)
				register_tank_action('kick_player', room_id, players[i].name);
			left_n++;
			}
		if(side=='right' && players[i].team=="R"){
			if(index==right_n)
				register_tank_action('kick_player', room_id, players[i].name);
			left_n++;
			}
		}
	}
//returns room by id
function get_room_by_id(room_id){
	for(var i in ROOMS){
		if(ROOMS[i].id == room_id){
			return ROOMS[i];
			}
		}
	return false;
	}
