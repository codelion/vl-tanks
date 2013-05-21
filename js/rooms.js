//rooms list window
function draw_rooms_list(message){
	PLACE = 'rooms';
	dynamic_title();
	unregister_buttons('rooms');
	
	room_controller();

	x = 10;
	y = 10;
	gap = 10;
	letter_padding_left = 15;
	document.getElementById("chat_box").style.display = 'block';
	document.getElementById("chat_box").innerHTML = "";
	
	//background
	canvas_backround.drawImage(IMAGE_BACK, 0, 0, 700, 500, 0, 0, WIDTH_APP, HEIGHT_APP-27);
	
	if(socket_live == false){
		//cconnecting block
		width = 300;
		height = 50;
		canvas_backround.strokeStyle = "#000000";
		canvas_backround.fillStyle = "#8fc74c";
		roundRect(canvas_backround, (WIDTH_APP-width)/2, (HEIGHT_APP-27-150-height)/2, width, height, 5, true);
		
		//text
		canvas_backround.fillStyle = "#000000";
		canvas_backround.font = "Bold 13px Helvetica";
		text = "Connecting...";
		text_width = canvas_backround.measureText(text).width;
		canvas_backround.fillText(text, (WIDTH_APP-text_width)/2, (HEIGHT_APP-27-150-height)/2+30);
		
		//abort, not connected
		return false;
		}
	
	//create button
	width = 100;
	height = 30;
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#69a126";
	roundRect(canvas_backround, x, y, width, height, 5, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		draw_create_room();
		});
	//text
	text = "Create";
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 13px Helvetica";
	canvas_backround.fillText(text, x+letter_padding_left+12, y+(height+font_pixel_to_height(13))/2);
	x = x + 100+10;
	
	//refresh button
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#69a126";
	roundRect(canvas_backround, x, y, width, height, 5, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		ROOMS = [];
		register_tank_action('ask_rooms', false, name);
		draw_rooms_list();
		});
	//text
	text = "Refresh";
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 13px Helvetica";
	canvas_backround.fillText(text, x+letter_padding_left+12, y+(height+font_pixel_to_height(13))/2);
	x = x + 100+10;
	
	//back button
	width = 80;
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#c50000";
	roundRect(canvas_backround, x, y, width, height, 5, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		document.getElementById("chat_box").style.display = 'none';
		init_game(false);
		});
	//text
	text = "Menu";
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 14px Arial";
	canvas_backround.fillText(text, x+letter_padding_left+5, y+(height+font_pixel_to_height(14))/2);

	//waiting players text
	text = "Waiting Soldiers: "+get_waiting_players_count();
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 12px Helvetica";
	canvas_backround.fillText(text, x+width+gap*2, y+(height+font_pixel_to_height(14))/2);
	
	//error
	if(message != undefined){
		canvas_backround.fillStyle = "#c50000";
		canvas_backround.font = "Bold 14px Helvetica";
		canvas_backround.fillText(message, 500, y+(height+font_pixel_to_height(14))/2);
		}
	
	y = y + height+10;
	x = x - 100-10;
		
	//show rooms
	padding_top = 20;
	height = 37;
	
	x = 10;
	y = 50;
	width = WIDTH_APP-20;
	height = 22.5;
	gap = 7;
	letter_padding_left = 15;
	for (var i=0; i<10; i++){
		if(ROOMS[i] != undefined){
			canvas_backround.strokeStyle = "#196119";
			canvas_backround.fillStyle = "#ffffff";
			roundRect(canvas_backround, x, y, width, height, 0, true);
			
			//num block
			canvas_backround.strokeStyle = "#000000";
			canvas_backround.fillStyle = "#ffffff";
			roundRect(canvas_backround, x, y, 70, height, 0, true);

			canvas_backround.strokeStyle = "#8fc74c";
			canvas_backround.fillStyle = "#8fc74c";
			if(ROOMS[i].progress == undefined)
				roundRect(canvas_backround, x+1, y+1, round((70-2)*ROOMS[i].players.length/ROOMS[i].max), height-2, 0, true);
			else
				roundRect(canvas_backround, x+1, y+1, 70-2, height-2, 0, true);

			//num text
			canvas_backround.fillStyle = "#3f3b30";
			canvas_backround.font = "Bold 14px Helvetica";
			if(ROOMS[i].progress == undefined)
				text = ROOMS[i].players.length+"/"+ROOMS[i].max;
			else
				text = ROOMS[i].players.length+"/"+ROOMS[i].players.length;	
			canvas_backround.fillText(text, x+letter_padding_left, y+(height+font_pixel_to_height(14))/2);
			
			//join block
			canvas_backround.strokeStyle = "#000000";
			if(ROOMS[i].progress == undefined)
				canvas_backround.fillStyle = "#8fc74c";
			else
				canvas_backround.fillStyle = "#e2f4cd";
			roundRect(canvas_backround, x+width-70, y, 70, height, 0, true);
			
			//on click event
			register_button(x+width-70, y, 70, height, PLACE, function(xx, yy, extra){
				var ROOM = get_room_by_id(extra); 
				if(ROOM.progress != undefined) return false;
				if(ROOM != false && ROOM.players.length < ROOM.max){
					if(ROOM.version == VERSION){
						draw_room(extra);
						room_id_to_join = extra;
						room_controller("room"+room_id_to_join);
						}
					else
						draw_rooms_list("Error, version mismatch.");
					}
				else
					draw_rooms_list("Error, room does not exists.");
				}, ROOMS[i].id);
	
			//join text
			canvas_backround.fillStyle = "#196119";
			canvas_backround.font = "Bold 14px Helvetica";
			if(ROOMS[i].progress == undefined)
				var text = "Join";
			else
				var text = ROOMS[i].progress+"%";
			canvas_backround.fillText(text, x+width+letter_padding_left-70, y+(height+font_pixel_to_height(14))/2);
			
			//title text
			canvas_backround.fillStyle = "#3f3b30";
			canvas_backround.font = "Bold 12px Helvetica";
			text = ROOMS[i].name;
			canvas_backround.fillText(text, x+70+letter_padding_left,y+15);
			
			//more info text
			canvas_backround.fillStyle = "#69a126";
			canvas_backround.font = "Normal 12px Helvetica";
			text = ucfirst(ROOMS[i].settings[0])+", "+ROOMS[i].settings[2];
			canvas_backround.fillText(text, x-70+10+width-130, y+15);
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
		game_type='';
	if(game_map==undefined)
		game_map='Main';
		
	PLACE = 'create_room';
	dynamic_title();
	
	//dynamic title
	try{
		if(page_title_copy=='') page_title_copy = parent.document.title;
		parent.document.title = page_title_copy;
		}catch(err){}
	document.getElementById("chat_box").style.display = 'none';
	//background
	canvas_backround.drawImage(IMAGE_BACK, 0, 0, 700, 500, 0, 0, WIDTH_APP, HEIGHT_APP-27);
	
	game_name = name+"'s room";
	button_width = 80;
	button_height = 20;
	button_gap = 10;
	button_active_color = '#69a126';
	button_inactive_color = '#d6d6d6';	
	
	//name text
	canvas_backround.fillStyle = "#3f3b30";
	canvas_backround.font = "Bold 13px Arial";
	text = "Name:";
	canvas_backround.fillText(text, 10+15, 10+25);
	
	//name text value border
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#ffffff";
	roundRect(canvas_backround, 130, 20, 300, 20, 0, true);
	register_button(130, 20, 300, 20, PLACE, function(){
		var name_tmp = prompt("Please enter game name", game_name);
		if(name_tmp != null){
			game_name = name_tmp;
			
			//clean old name
			canvas_backround.strokeStyle = "#000000";
			canvas_backround.fillStyle = "#ffffff";
			roundRect(canvas_backround, 130, 20, 300, 20, 0, true);
			
			//redraw name text value
			canvas_backround.fillStyle = "#000000";
			canvas_backround.font = "Normal 12px Arial";
			text = game_name;
			canvas_backround.fillText(text, 135, 10+25);
			}
		});
	
	//name text value
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Normal 12px Arial";
	text = game_name;
	canvas_backround.fillText(text, 135, 10+25);
	
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
		if(values[i] == game_players)
			canvas_backround.fillStyle = "#ffffff";
		else
			canvas_backround.fillStyle = "#3f3b30";
		canvas_backround.font = "Normal 12px Arial";
		text = values[i];
		canvas_backround.fillText(text, 10+offset_left+10+i*(button_width+button_gap), 60+offset_top+25);
		}
	button_width = button_width + 40;
	offset_top = offset_top + 40;
	
	//mode text - normal/random/mirror/counter
	canvas_backround.fillStyle = "#3f3b30";
	canvas_backround.font = "Bold 13px Arial";
	text = "Game Mode:";
	canvas_backround.fillText(text, 10+15, 60+25+offset_top);
	
	values = ['normal', 'random', 'mirror', 'counter'];
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
		if(values[i] == game_mode)
			canvas_backround.fillStyle = "#ffffff";
		else
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
	
	j=0;
	for(var i in MAPS){
		if(MAPS[i].singleplayer_only != undefined) continue;
		//block
		canvas_backround.strokeStyle = "#000000";
		if(MAPS[i].name == game_map)
			canvas_backround.fillStyle = button_active_color;
		else
			canvas_backround.fillStyle = button_inactive_color;
		roundRect(canvas_backround, 10+offset_left+j*(button_width+button_gap), 60+offset_top+10, button_width, button_height, 2, true);
		
		//action
		register_button(10+offset_left+j*(button_width+button_gap), 60+offset_top+10, button_width, button_height, PLACE, function(xx, yy, extra){
			game_map = extra;
			draw_create_room(game_players, game_mode, game_type, game_map);
			}, MAPS[i].name);
		
		//text
		if(MAPS[i].name == game_map)
			canvas_backround.fillStyle = "#ffffff";
		else
			canvas_backround.fillStyle = "#3f3b30";
		canvas_backround.font = "Normal 12px Arial";
		text = ucfirst(MAPS[i].name);
		canvas_backround.fillText(text, 10+offset_left+10+j*(button_width+button_gap), 60+offset_top+25);
		j++;
		}
	offset_top = offset_top + 40;
	
	offset_top = offset_top + 20;
	//create button block
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#69a126";
	roundRect(canvas_backround, 10+offset_left, 60+offset_top, 105, 30, 2, true);
	
	//create button text
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 13px Arial";
	text = "Create Game";
	canvas_backround.fillText(text, 10+offset_left+10, 60+offset_top+20);
	
	//register button
	register_button(10+offset_left, 60+offset_top, 105, 30, PLACE, function(){
		new_id = register_new_room(game_name, game_mode, game_type, game_players, game_map);
		draw_room(new_id);
		room_controller("room"+new_id);
		});	
	
	//back button block
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#c50000";
	roundRect(canvas_backround, 10+offset_left+120, 60+offset_top, 105, 30, 2, true);
	
	//back button texts
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 13px Arial";
	text = "Back";
	canvas_backround.fillText(text, 40+offset_left+120, 60+offset_top+20);
	
	//register back button
	register_button(10+offset_left+120, 60+offset_top, 105, 30, PLACE, function(){
		room_id_to_join = -1;
		draw_rooms_list();
		});
	
	//notice
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Normal 12px Arial";
	text = "Notice: While you hosting game, please do not switch this tab or minimize browser while game is active.";
	canvas_backround.fillText(text, 10+offset_left, 120+offset_top);
	}
//room waiting for players
function draw_room(room_id){
	PLACE = 'room';
	dynamic_title(room_id);
	unregister_buttons('room');
	
	ROOM = get_room_by_id(room_id);
	game_mode = 2;
	opened_room_id = ROOM.id;
	players = ROOM.players;
	
	x = 10;
	y = 10;
	width = 135;
	height = 35;
	gap = 10;
	letter_padding_left = 15;
	document.getElementById("chat_box").style.display = 'block';
	document.getElementById("chat_box").innerHTML = "";
	
	//count players
	var team_r_n=0;
	var team_b_n=0;
	for(var j in ROOM.players){
		if(ROOM.players[j].team=='R') team_r_n++;
		else 	if(ROOM.players[j].team=='B') team_b_n++;
		}
	
	//background
	canvas_backround.drawImage(IMAGE_BACK, 0, 0, 700, 500, 0, 0, WIDTH_APP, HEIGHT_APP-27);
	
	//back button
	width = 80;
	height = 30;
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#c50000";
	height = 35;
	roundRect(canvas_backround, x, y, width, height, 5, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		register_tank_action('leave_room', ROOM.id, name);
		room_id_to_join = -1;
		draw_rooms_list();
		});
	//text
	text = "Back";
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 14px Arial";
	canvas_backround.fillText(text, x+letter_padding_left+5, y+(height+font_pixel_to_height(14))/2);
	
	x = x + 80+10;
	
	//start button
	width = 130;
	if(ROOM.host==name){
		canvas_backround.strokeStyle = "#000000";
		if(ROOM.players.length%2==0 && team_r_n == team_b_n)
			canvas_backround.fillStyle = "#69a126";	//active
		else
			canvas_backround.fillStyle = "#e2e2e2";	//inactive
		roundRect(canvas_backround, x, y, width, height, 5, true);
		if(ROOM.players.length%2==0 && team_r_n == team_b_n || DEBUG==true){
			register_button(x, y, width, height, PLACE, function(xx, yy){
				//check if room has correct player number
				var room_tmp = get_room_by_id(opened_room_id);
				if(room_tmp == false || room_tmp.players.length%2==1){
					if(DEBUG==false) 
						return false;	//error or wrong count
					}
				//count teams
				//show select tanks room
				game_mode = 2;
				host_enemy_name = '';
				host_team = '';
				ROOM = get_room_by_id(room_id);
				for(var i in ROOM.players){
					if(ROOM.players[i].name == ROOM.host){
						host_team = ROOM.players[i].team;
						break;
						}	
					}
				for(var i in ROOM.players){
					if(ROOM.players[i].team != host_team){
						host_enemy_name = ROOM.players[i].name;
						break;
						}	
					}
				register_tank_action('prepare_game', opened_room_id, host_enemy_name);
				});
			}
	
		//text
		text = "Start this game";
		if(ROOM.players.length%2==0 && team_r_n == team_b_n)
			canvas_backround.fillStyle = "#ffffff";	//enabled
		else
			canvas_backround.fillStyle = "#000000";	//disabled
		canvas_backround.font = "Bold 13px Helvetica";
		canvas_backround.fillText(text, x+letter_padding_left, y+(height+font_pixel_to_height(13))/2);
		}
	x = x + width+10;
		
	//switch block	
	width = 60;
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#8fc74c";
	roundRect(canvas_backround, x, y, width, height, 3, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		send_packet('switch_side', [opened_room_id, name]);
		});
	//text
	text = "Switch";
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 12px Arial";
	canvas_backround.fillText(text, x+letter_padding_left-5, y+(height+font_pixel_to_height(14))/2);
	x = x + width+10;	
	
	//Waiting players text
	text = "Waiting Soldiers: "+get_waiting_players_count();
	canvas_backround.fillStyle = "#000000";
	canvas_backround.font = "Bold 11px Helvetica";
	canvas_backround.fillText(text, x, y+(height+font_pixel_to_height(14))/2);	
	
	x = WIDTH_APP - 350;

	//game name
	text = ROOM.name;
	canvas_backround.fillStyle = "#196119";
	canvas_backround.font = "Bold 12px Helvetica";
	canvas_backround.fillText(text, x+60, y+15);
	y = y + 20;
	
	//game settings
	text = ucfirst(ROOM.settings[0])+", "+ucfirst(ROOM.settings[2])+", max "+ROOM.max+" players, by "+ROOM.host;
	canvas_backround.fillStyle = "#69a126";
	canvas_backround.font = "Normal 12px Helvetica";
	canvas_backround.fillText(text, x+60, y+15);
	y = y - 20;	

	y = y + height+20;	
	x = x - 80-10;
	
	//show players
	height = 21;
	gap = 7;
	width = (WIDTH_APP-20-gap)/2;
	letter_padding_left = 10;
	x1 = 10;
	x2 = 10+gap+width;
	flag_space = (height-flag_height)/2;
	y_begin = y;
	icon_width = height;
	
	//LEFT
	left_n = 0;
	for(var i in players){
		if(players[i].team=="B"){
			left_n++;
			//man block
			canvas_backround.strokeStyle = "#196119";
			canvas_backround.fillStyle = "#8fc74c";
			roundRect(canvas_backround, x1, y, width, height, 0, true);
			
			//flag
			draw_image(canvas_backround, COUNTRIES.B.file, x1+flag_space, y+flag_space);
			
			//name
			text = players[i].name;
			canvas_backround.fillStyle = "#000000";
			canvas_backround.font = "Bold 13px Helvetica";
			canvas_backround.fillText(text, x1+icon_width+letter_padding_left, y+(height+font_pixel_to_height(13))/2);
	
			if(ROOM.host==name && players[i].name != name){
				//kick block
				canvas_backround.strokeStyle = "#000000";
				canvas_backround.fillStyle = "#c50000";
				roundRect(canvas_backround, x1+width-50, y, 50, height, 0, true);
				
				//kick text
				text = "Kick";
				canvas_backround.fillStyle = "#ffffff";
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
			canvas_backround.strokeStyle = "#196119";
			canvas_backround.fillStyle = "#8fc74c";
			roundRect(canvas_backround, x2, y, width, height, 0, true);
			
			//flag
			draw_image(canvas_backround, COUNTRIES.R.file, x2+flag_space, y+flag_space);
			
			//name
			text = players[i].name;
			canvas_backround.fillStyle = "#000000";
			canvas_backround.font = "Bold 13px Helvetica";
			canvas_backround.fillText(text, x2+icon_width+letter_padding_left, y+(height+font_pixel_to_height(13))/2);
			
			if(ROOM.host==name && players[i].name != name){
				//kick block
				canvas_backround.strokeStyle = "#000000";
				canvas_backround.fillStyle = "#c50000";
				roundRect(canvas_backround, x2+width-50, y, 50, height, 0, true);
				
				//kick text
				text = "Kick";
				canvas_backround.fillStyle = "#ffffff";
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
	}
//kick button was pressed - find player
function on_kick_player(side, index, room_id){
	left_n = 0;
	right_n = 0;
	ROOM = get_room_by_id(room_id);
	for(var i in ROOM.players){
		if(side=='left' &&  ROOM.players[i].team=="B"){
			if(index==left_n)
				register_tank_action('kick_player', room_id,  ROOM.players[i].name);
			left_n++;
			}
		if(side=='right' &&  ROOM.players[i].team=="R"){
			if(index==right_n)
				register_tank_action('kick_player', room_id,  ROOM.players[i].name);
			right_n++;
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
function get_active_room_progress(){
	ROOM = get_room_by_id(opened_room_id);
	var progress = 0;
	var towers_hp = 0;
	var towers_total_hp = 0;
	var base_hp = 0;
	var base_total_hp = 0;
	var towers_n = 0;
	var bases_n = 0;
	var teams = ['B', 'R'];	
	for(var t in teams){
		var team = teams[t];
		var progress_tmp = 0;
		towers_n = 0;
		bases_n = 0;
		towers_hp = 0;
		towers_total_hp = 0;
		base_hp = 0;
		base_total_hp = 0;
		
		//find data
		for(var i in MAPS){
			if(MAPS[i].name == ROOM.settings[2]){
				for(var t in MAPS[i].towers){
					if(MAPS[i].towers[t][0]==team){
						if(MAPS[i].towers[t][3]=='Tower')
							towers_n++;
						else if(MAPS[i].towers[t][3]=='Base')
							bases_n++;
						}
					}
				}
			}
		for(var i in TYPES){
			if(TYPES[i].name == 'Tower'){
				if(ROOM.players.length > 2)
					towers_total_hp = towers_n * TYPES[i].life[0];
				else
					towers_total_hp = towers_n * TYPES[i].life[0] * TOWER_HP_DAMAGE_IN_1VS1[0];
				}
			else if(TYPES[i].name == 'Base'){
				if(ROOM.players.length > 2)
					base_total_hp = bases_n * TYPES[i].life[0];
				else
					base_total_hp = bases_n * TYPES[i].life[0] * TOWER_HP_DAMAGE_IN_1VS1[0];
				}
			}
		for(var i in TANKS){
			if(TANKS[i].team == team){
				if(TYPES[TANKS[i].type].name == 'Tower')
					towers_hp +=  TANKS[i].hp;
				else if(TYPES[TANKS[i].type].name == 'Base')
					base_hp +=  TANKS[i].hp;
				}
			}
		//calc
		if(towers_total_hp == 0)
			progress_tmp += 30;
		else
			progress_tmp += 0.3*((towers_total_hp-towers_hp)*100/towers_total_hp);
		if(base_total_hp == 0)
			progress_tmp += 70;
		else
			progress_tmp += 0.7*((base_total_hp-base_hp)*100/base_total_hp);
		if(progress_tmp > progress)
			progress = progress_tmp;
		}
	return round(progress);
	}
