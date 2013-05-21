var socket;
var socket_live = false;
var orbiter;
var Rooms_obj;
var Room_id_obj;
var waiting_users = 0;
var SOCKET_ROOMS = '';
var SOCKET_ROOM_ID = '';

//===== LIBRARY ================================================================

//connecto to sockets server
function connect_server(){
	orbiter = new net.user1.orbiter.Orbiter();
	orbiter.getConnectionMonitor().setAutoReconnectFrequency(15000);
	orbiter.getLog().setLevel(net.user1.logger.Logger.FATAL);
	if (!orbiter.getSystem().isJavaScriptCompatible())
		return alert("Error: your browser do not support JavaScript.");
	orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, readyListener, this);
	orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.CLOSE, disconnect_server, this);
	orbiter.connect(SOCKET[0], SOCKET[1]);
	}
//on connection ready
function readyListener(e){
	SOCKET_ROOMS = SOCKET_ROOM_PREFIX+"rooms";
	Rooms_obj = orbiter.getRoomManager().createRoom(SOCKET_ROOMS);
	Rooms_obj.addEventListener(net.user1.orbiter.RoomEvent.JOIN, joinRoomsListener);
	Rooms_obj.addEventListener(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, addOccupantListener);
	Rooms_obj.addEventListener(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT, removeOccupantListener);  
	Rooms_obj.addMessageListener("CHAT_MESSAGE", get_packet_inner);
	Rooms_obj.join();
	//status
	socket_live = true;
	try{parent.document.getElementById("connected").innerHTML = 'single';}catch(error){}
	}
//controlls which rooms to join and leave
function room_controller(new_room){
	if(socket_live == false) return false;
	if((PLACE == 'rooms' || PLACE == 'room' || PLACE == 'create_room') && SOCKET_ROOMS==''){
		//connect to rooms list
		SOCKET_ROOMS = SOCKET_ROOM_PREFIX+"rooms";
		Rooms_obj = orbiter.getRoomManager().createRoom(SOCKET_ROOMS);
		Rooms_obj.addEventListener(net.user1.orbiter.RoomEvent.JOIN, joinRoomsListener);
		Rooms_obj.addEventListener(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, addOccupantListener);
		Rooms_obj.addEventListener(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT, removeOccupantListener);  
		Rooms_obj.addMessageListener("CHAT_MESSAGE", get_packet_inner);
		Rooms_obj.join();
		}
	else if(PLACE == 'select' && SOCKET_ROOMS != ''){
		ROOM = get_room_by_id(opened_room_id);
		if(ROOM.host != name){	//let host be connected to all and broadcast game status
			//disconnect from all rooms
			SOCKET_ROOMS = '';
			Rooms_obj.removeEventListener(net.user1.orbiter.RoomEvent.JOIN, joinRoomsListener);
			Rooms_obj.removeEventListener(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, addOccupantListener);
			Rooms_obj.removeEventListener(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT, removeOccupantListener);
			Rooms_obj.removeMessageListener("CHAT_MESSAGE", get_packet_inner);
			Rooms_obj.leave();
			}
		}
	else if((PLACE == 'rooms' || PLACE == 'init') && SOCKET_ROOM_ID != ''){
		//disconnect from last room
		SOCKET_ROOM_ID = '';
		Room_id_obj.removeEventListener(net.user1.orbiter.RoomEvent.JOIN, joinRoomListener_id);
		Room_id_obj.removeEventListener(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, addOccupantListener_id);
		Room_id_obj.removeEventListener(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT, removeOccupantListener_id);
		Room_id_obj.removeMessageListener("CHAT_MESSAGE", get_packet_inner_id);
		Room_id_obj.leave();
		}
	else if((PLACE == 'room' || PLACE == 'select' || PLACE == 'game') && SOCKET_ROOM_ID==''){
		//connect to room
		SOCKET_ROOM_ID = SOCKET_ROOM_PREFIX+new_room;
		Room_id_obj = orbiter.getRoomManager().createRoom(SOCKET_ROOM_ID);
		Room_id_obj.addEventListener(net.user1.orbiter.RoomEvent.JOIN, joinRoomListener_id);
		Room_id_obj.addEventListener(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, addOccupantListener_id);
		Room_id_obj.addEventListener(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT, removeOccupantListener_id);  
		Room_id_obj.addMessageListener("CHAT_MESSAGE", get_packet_inner_id);
		Room_id_obj.join();
		if(SOCKET_ROOMS != '' && PLACE != 'room'){
			ROOM = get_room_by_id(opened_room_id);
			if(ROOM.host != name){
				//disconnect from all rooms
				SOCKET_ROOMS = '';
				Rooms_obj.removeEventListener(net.user1.orbiter.RoomEvent.JOIN, joinRoomsListener);
				Rooms_obj.removeEventListener(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, addOccupantListener);
				Rooms_obj.removeEventListener(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT, removeOccupantListener);
				Rooms_obj.removeMessageListener("CHAT_MESSAGE", get_packet_inner);
				Rooms_obj.leave();
				}
			}
		}
	try{
		if(SOCKET_ROOM_ID != '' && SOCKET_ROOMS != '')
			parent.document.getElementById("connected").innerHTML = 'dual';
		else if(SOCKET_ROOMS != '')
			parent.document.getElementById("connected").innerHTML = 'single';
		else if(SOCKET_ROOM_ID != '')
			parent.document.getElementById("connected").innerHTML = 'single-id';
		else
			parent.document.getElementById("connected").innerHTML = 'none';
		}
	catch(error){}
	}
//we joined the room
function joinRoomsListener(e){
	//redraw list
	register_tank_action('ask_rooms', false, name);
	waiting_users = Rooms_obj.getNumOccupants();
	if(PLACE=='rooms')
		draw_rooms_list();
	else if(PLACE=='room')
		draw_room(opened_room_id);
	}
function joinRoomListener_id(e){
	if(room_id_to_join != -1){
		register_tank_action('join_room', room_id_to_join, name);
		draw_room(room_id_to_join);
		room_id_to_join = -1;
		}	
	}
//client joins room
function addOccupantListener (e) {
	if (Rooms_obj.getSyncState() != net.user1.orbiter.SynchronizationState.SYNCHRONIZING) { 
		waiting_users = Rooms_obj.getNumOccupants();
		if(PLACE=='rooms')
			draw_rooms_list();
		else if(PLACE=='room')
			draw_room(opened_room_id);
		}
	}
function addOccupantListener_id (e) {}
//client leaves room
function removeOccupantListener (e) {
	waiting_users = Rooms_obj.getNumOccupants();
	if(PLACE=='rooms')
		draw_rooms_list();
	else if(PLACE=='room')
		draw_room(opened_room_id);
	}
function removeOccupantListener_id (e) {}
//do clean disconnect from server
function disconnect_server(e){
	//disconnect
	if(socket_live == true){
		if(SOCKET_ROOMS != '')
			Rooms_obj.leave();
		if(SOCKET_ROOM_ID != '')	
			Room_id_obj.leave();
		orbiter.disconnect();
		}
	//update status
	socket_live = false;
	try{parent.document.getElementById("connected").innerHTML = 'none';}catch(error){}
	}
function get_packet_inner(fromClient, message){
	get_packet(fromClient, message);
	}
function get_packet_inner_id(fromClient, message){
	get_packet(fromClient, message);
	}

//===== COMMUNICATION ==========================================================

//send packet to server
function send_packet(type, message, force_list_connection){
	if(message.length == 0){
		console.log('Error: empty message, type: '+type);
		return false;
		}
	if(socket_live==false){
		console.log('Error: trying to send without connection: '+type);
		return false;
		}
	/*if(DEBUG==true){
		if(type=="tank_update")
			console.log("["+type+"]------->"+message[0]);
		else
			console.log("["+type+"]------->");
		}*/
	
	//log packets count
	packets_used++;
	if(packets_used > MAX_SENT_PACKETS){
		console.log('Error: '+MAX_SENT_PACKETS+' packets reached.');
		return false;
		}
	try{	
		var string;
		if(packets_used>999)
			string = round(packets_used/1000)+"k/";
		else
			string = packets_used+"/";
		if(packets_all>999)
			string = string+round(packets_all/1000)+"k";
		else
			string = string+packets_all;
		parent.document.getElementById("packets").innerHTML = string;
		}catch(error){}
	
	//make and send message
	message = {
		type: type,
		message: message,
		};
	message = JSON.stringify(message);
	
	if(force_list_connection != undefined && SOCKET_ROOMS != '')
		Rooms_obj.sendMessage("CHAT_MESSAGE", "true", null, message);		//forced to use all rooms
	else if((PLACE == 'select' || PLACE == 'game' || PLACE == 'score') && SOCKET_ROOM_ID != '')
		Room_id_obj.sendMessage("CHAT_MESSAGE", "true", null, message);		//use our room
	else if(SOCKET_ROOMS != '')
		Rooms_obj.sendMessage("CHAT_MESSAGE", "true", null, message);		//use all rooms
	else
		console.log('Error: we are not joined any room, place: '+PLACE);	//error
	}
//get packets from server
function get_packet(fromClient, message){
	packets_all++;	
	try{
		var string;
		if(packets_used>999)
			string = round(packets_used/1000)+"k/";
		else
			string = packets_used+"/";
		if(packets_all>999)
			string = string+round(packets_all/1000)+"k";
		else
			string = string+packets_all;
		parent.document.getElementById("packets").innerHTML = string;
		}catch(error){}
	DATA = JSON.parse(message);
	var type = DATA.type;
	DATA = DATA.message;
	//if(DEBUG==true) 	console.log("<-------["+type+"]");
	
	if(type == 'new_room'){		//new room was created
		var n = ROOMS.length;
		if(get_room_by_id(DATA.id) != false) return false;
		ROOMS.push(DATA);
		if(PLACE=='rooms')
			draw_rooms_list();
		}
	else if(type == 'delete_room'){	//room was deleted
		for(var i=0; i < ROOMS.length; i++){	
			if(ROOMS[i].id == DATA){
				ROOMS.splice(i, 1); i--;
				if(PLACE=='rooms')
					draw_rooms_list();
				if(PLACE=='room' && opened_room_id == DATA){
					//room was deleted, go to list
					draw_rooms_list();
					}
				}
			}
		}
	else if(type == 'ask_rooms'){	//somebody is asking rooms list
		if(PLACE == 'room'){
			ROOM = get_room_by_id(opened_room_id);
			if(ROOM.host==name)
				send_packet('new_room', ROOM);	//broadcast it
			}
		else if(PLACE == 'select'){ //i am host and i can broadcast started game status...
			ROOM = get_room_by_id(opened_room_id);
			ROOM.progress = 0;
			send_packet('new_room', ROOM, true);	//broadcast it
			}
		else if(PLACE == 'game'){ //i am host and i can broadcast started game status...
			ROOM = get_room_by_id(opened_room_id);
			ROOM.progress = get_active_room_progress();
			send_packet('new_room', ROOM, true);	//broadcast it
			}
		}
	else if(type == 'leave_room'){	//player leaving room
		//DATA = [room_id, player_name]
		var ROOM = get_room_by_id(DATA[0]);
		if(ROOM != false){
			for(var j=0; j < ROOM.players.length; j++){
				if(ROOM.players[j].name == DATA[1]){
					ROOM.players.splice(j, 1); j--;
					if(PLACE=='room')
						draw_room(ROOM.id);
					return false;
					}
				}
			}
		else
			log('Error: can not find room for leaving.');
		}
	else if(type == 'kick_player'){	//player was kicked
		//DATA = [room_id, player_name]
		var ROOM = get_room_by_id(DATA[0]);
		if(ROOM.host==DATA[1]){
			console.log('Error: attempt to kick host from room...');
			return false; // host was kicked, this is probably hack from outside
			}
		if(ROOM != false){
			for(var j=0; j < ROOM.players.length; j++){
				if(ROOM.players[j].name == DATA[1]){
					ROOM.players.splice(j, 1);  j--;
					if(DATA[1]==name){
						if(PLACE=='room'){
							//i was kicked ... go back
							draw_rooms_list();
							}
						}
					else{
						//other player was kicked - repaint room
						if(PLACE=='room')
							draw_room(ROOM.id);
						return false;
						}
					}
				}
			}
		}
	else if(type == 'join_room'){	//player joining room
		//DATA = [room_id, player_name]
		if(PLACE != 'room'){ //game started
			if(DATA[1] == MY_TANK.name){	//if me
				room_id_to_join = -1;
				draw_rooms_list();
				}
			return false;
			}	
		var ROOM = get_room_by_id(DATA[0]);
		if(ROOM != false){
			//find team
			player_team = 'R';
			team_r_n=0;
			team_b_n=0;
			for(var j in ROOM.players){
				if(ROOM.players[j].team=='R') team_r_n++;
				else 	if(ROOM.players[j].team=='B') team_b_n++;
				}
			if(team_b_n<team_r_n)
				player_team = 'B';	
			//join
			ROOM.players.push({name: DATA[1], team: player_team});
			
			//repaint
			if(PLACE=='room')
				draw_room(ROOM.id);
			}
		}
	else if(type == 'switch_side'){	//player switch sides
		//DATA = [room_id, player_name]
		if(PLACE != 'room') return false;
		if(DATA[0] != opened_room_id) return false;
		if(PLACE != 'room') return false; //game started
		var ROOM = get_room_by_id(DATA[0]);
		if(ROOM != false){
			//find team
			player_team = 'R';
			team_r_n=0;
			team_b_n=0;
			for(var j in ROOM.players){
				if(ROOM.players[j].team=='R') team_r_n++;
				else 	if(ROOM.players[j].team=='B') team_b_n++;
				}
			if(team_b_n<team_r_n)
				player_team = 'B';
			
			//try to switch
			for(var j in ROOM.players){
				if(ROOM.players[j].name==DATA[1]){
					if(ROOM.players[j].team == 'R' && ROOM.max/2 > team_b_n)
						ROOM.players[j].team = 'B';
					else if(ROOM.players[j].team == 'B' && ROOM.max/2 > team_r_n)
						ROOM.players[j].team = 'R';
					}
				}
						
			//repaint
			if(PLACE=='room')
				draw_room(ROOM.id);
			}
		}
	else if(type == 'prepare_game'){	//prepare game - select tanks/maps screen
		//DATA = [room_id, host_enemy_name]
		if(PLACE=="room" && opened_room_id==DATA[0]){
			game_mode = 2;
			start_game_timer_id = setInterval(starting_game_timer_handler, 1000);
			draw_tank_select_screen();
			ROOM = get_room_by_id(DATA[0]);
			ROOM.host_enemy_name = DATA[1];
			ROOM.players_max = ROOM.players.length;
			if(ROOM.host==name && ROOM.settings[0] != 'normal'){
				choose_and_register_tanks(ROOM);
				}
			}
		else if(PLACE=="rooms"){
			for(var i=0; i < ROOMS.length; i++){	
				if(ROOMS[i].id == DATA[0]){
					ROOMS.splice(i, 1); i--;
					}
				}
			draw_rooms_list();
			}
		}
	else if(type == 'change_tank'){		//change map in selecting screen
		//DATA = room_id, tank_index, player_name, in_game]
		if(PLACE=="select"){
			var ROOM = get_room_by_id(DATA[0]);
			if(ROOM != false){
				//find and update player
				for(var p in ROOM.players){
					if(ROOM.players[p].name == DATA[2]){
						ROOM.players[p].tank = DATA[1];
						}
					}
				if(DATA[2]==name)
					my_tank_nr = DATA[1];
				//redraw
				draw_tank_select_screen();
				}
			}
		else if(PLACE=="game" && DATA[3] == true){
			var ROOM = get_room_by_id(DATA[0]);
			if(ROOM != false){
				//update players
				for(var p in ROOM.players){
					if(ROOM.players[p].name == DATA[2]){
						ROOM.players[p].tank = DATA[1];
						}
					}
				for(var i in TANKS){
					if(TANKS[i].name == DATA[2]){
						var type = DATA[1];
						var level = TANKS[i].level;
						//change stats
						TANKS[i].type = type;
						TANKS[i].hp = get_tank_max_hp(TANKS[i]);
						TANKS[i].sight = TYPES[type].scout + round(TYPES[type].size[1]/2);
						TANKS[i].speed = TYPES[type].speed;
						TANKS[i].armor = TYPES[type].armor[0] + TYPES[type].armor[1]*(level-1);
						TANKS[i].damage = TYPES[type].damage[0] + TYPES[type].damage[1]*(level-1);
						TANKS[i].attack_delay = TYPES[type].attack_delay;
						TANKS[i].turn_speed = TYPES[type].turn_speed;
						}
					}
				//if me
				if(DATA[2]==name){
					my_tank_nr = DATA[1];
					draw_counter_tank_selection(my_tank_nr);
					draw_tank_abilities();
					
					//auto add 1 lvl upgrade
					for(jj in TYPES[MY_TANK.type].abilities){ 
						var nr = 1+parseInt(jj);
						var ability_function = TYPES[MY_TANK.type].abilities[jj].name.replace(/ /g,'_')+"_once";
						if(ability_function != undefined){
							try{
								window[ability_function](MY_TANK);
								}
							catch(err){}
							}
						}
					}
				}
			}
		}
	else if(type == 'start_game'){	//start game
		//DATA = game_id, players_data
		if(PLACE=="select" && opened_room_id==DATA[0]){
			ROOM = get_room_by_id(DATA[0]);
			var players_data = DATA[1];
			//sync players
			for(var p in players_data){
				for(var i in ROOM.players){
					if(ROOM.players[i].name == players_data[p].name){
						ROOM.players[i].team = players_data[p].team;
						ROOM.players[i].tank = players_data[p].tank; 
						break;
						}
					}
				}
			
			//find level
			current_level = 1;
			for(var m in MAPS){
				if(MAPS[m].name == ROOM.settings[2])
					current_level = parseInt(m)+1;
				}
			//find my team
			var my_team='B';
			for(var p in ROOM.players){
				if(ROOM.players[p].name==name)
					my_team = ROOM.players[p].team;
				}
			//start	
			clearInterval(start_game_timer_id, my_team);
			init_action(current_level, my_team);
			}
		}
	else if(type == 'end_game'){		//game ends
		//DATA = [game_id, lost_team]
		//if me host, broadcast game end
		ROOM = get_room_by_id(opened_room_id);
		if(ROOM.host == name){
			send_packet('delete_room', ROOM.id, true);
			}
		//draw scores
		if(PLACE=="game" && opened_room_id==DATA[0])
			draw_final_score(false, DATA[1]);
		}
	else if(type == 'leave_game'){		//player leaving game
		//DATA = [room_id, player_name]
		chat(DATA[1]+" left the game.", false, false);
		ROOM = get_room_by_id(DATA[0]);
		if(ROOM.host == DATA[1]){	//host left game ... we are in trouble, unless we switch host to other person
			if(ROOM.host == ROOM.host_enemy_name){	//we lost second host - we are in trouble now
				register_tank_action('end_game', opened_room_id, false, false);
				return false;
				}
			ROOM.host = ROOM.host_enemy_name;	//fixed
			}
		for(var p in ROOM.players){
			if(ROOM.players[p].name == DATA[1])
				ROOM.players[p].ping = Date.now()-60*1000;
			}
		}
	else if(type == 'tank_move'){		//tank move
		//DATA = room_id, tank_id, [from_x, from_y, to_x, to_y, lock, direction] 
		if(DATA[1] == name && MUTE_FX==false){
			try{
				audio_finish = document.createElement('audio');
				audio_finish.setAttribute('src', '../sounds/click'+SOUND_EXT);
				audio_finish.play();
				}
			catch(error){}
			}
		if(PLACE=="game" && opened_room_id==DATA[0]){
			TANK = get_tank_by_id(DATA[1]);
			if(TANK===false) console.log('Error: tank "'+DATA[1]+'" was not found on tank_move.');
			update_players_ping(TANK.name);
			sync_movement(TANK, DATA[2][0], DATA[2][1]);
			TANK.move = 1;
			TANK.move_to = [DATA[2][2], DATA[2][3]];
			delete TANK.target_move_lock;
			if(DATA[2][4] != undefined){
				//target lock
				TANK.target_move_lock = DATA[2][4];
				TANK.target_shoot_lock = DATA[2][4];
				}
			if(DATA[2][5] != undefined)
				TANK.move_direction = DATA[2][5];
			}
		}
	else if(type == 'skill_do'){	//tank skill start
		//DATA = room_id, player_name, nr=[1,2,3], random
		if(PLACE != "game" || opened_room_id!=DATA[0]) return false;
		TANK_FROM = get_tank_by_name(DATA[1]);
		if(TANK_FROM===false) console.log('Error: tank "'+DATA[1]+'" was not found on skill_do.');
		var nr = DATA[2];	
		var ability_function = TYPES[TANK_FROM.type].abilities[nr-1].name.replace(/ /g,'_');
		//execute
		TANK_FROM.rand = DATA[3];
		var ability_reuse = window[ability_function](TANK_FROM);
		//reuse	
		if(ability_reuse != undefined && ability_reuse != 0){		
			TANK_FROM.abilities_reuse[nr-1] = Date.now() + ability_reuse;
			if(DATA[1] == name){
				var tmp = new Array();
				tmp['function'] = "draw_ability_reuse";
				tmp['duration'] = ability_reuse;
				tmp['type'] = 'REPEAT';
				tmp['nr'] = nr-1;	
				tmp['max'] = ability_reuse;
				tmp['tank'] = TANK_FROM;
				timed_functions.push(tmp);
				}
			}
		}
	else if(type == 'chat'){		//chat
		//DATA = room_id, data, player, team, place, shift
		if(DATA[5] != 1){				
			if(PLACE != DATA[4]) return false;
			if(PLACE=='game' && DATA[0] != opened_room_id) return false;
			if(PLACE=='room' && DATA[0] != opened_room_id) return false;
			if(PLACE=='select' && DATA[0] != opened_room_id) return false;
			if(PLACE=='score' && DATA[0] != opened_room_id) return false;
			}
		else{		
			if((PLACE == 'game' || PLACE == 'score') && (DATA[4] != 'game' && DATA[4] != 'score') ) return false;
			if(DATA[4]=='game' && PLACE != 'game') return false;
			if(DATA[4]=='score' && PLACE != 'score') return false;
			if((PLACE == 'game' || PLACE == 'score') && DATA[3] != MY_TANK.team) return false;
			}
		chat(DATA[1], DATA[2], DATA[3], DATA[5]);
		update_players_ping(DATA[2]);
		}
	else if(type == 'skill_advanced'){	//advanced skill, with delayed execution
		/*DATA = room_id, player, {
				function: 'function_name',
				fparam: [param1, param2, param3],
				tank_params: [	{key: 'xxxx', value: 'xxxx'},	]
				}*/
		if(PLACE != "game" || opened_room_id != DATA[0]) return false;
		TANK = get_tank_by_name(DATA[1]);
		if(TANK===false) console.log('Error: tank "'+DATA[1]+'" was not found on skill_advanced.');
		var skill_data = DATA[2];
		delete TANK.target_move_lock;
		//adding extra info to tank
		for(var i in skill_data.tank_params){
			var key = skill_data.tank_params[i].key;
			TANK[key] = skill_data.tank_params[i].value
			}
		//executing function
		var function_name = skill_data.function;
		if(function_name != '')	
			window[function_name](skill_data.fparam[0], skill_data.fparam[1], skill_data.fparam[2]);
		}
	else if(type == 'tank_update'){		//tank updates 
		//DATA = [tank_id, params]
		if(PLACE != "game") return false;
		TANK = get_tank_by_id(DATA[0]);
		if(TANK===false) console.log('Error: tank "'+DATA[0]+'" was not found on tank_update.');
		//adding extra info to tank
		for(var i in DATA[1]){
			var key = DATA[1][i].key;
			var value = DATA[1][i].value;
			if(key == 'buffs')
				TANK.buffs.push(value);
			else if(value == 'delete')
				delete TANK[key];
			else if(key == 'attacking'){
				var enemy = get_tank_by_id(value);
				TANK[key] = enemy;
				delete TANK.attacking_sig_wait;
				}
			else{
				//default
				TANK[key] = value;
				}
			}
		}
	else if(type == 'tank_kill'){	//tank was killed
		//DATA = room_id, player, killed_tank_id
		TANK_TO = get_tank_by_id(DATA[2]);
		if(TANK_TO===false){	
			console.log('Error: tank_to "'+DATA[2]+'" was not found on tank_kill.');
			return false;
			}
		TANK_FROM = get_tank_by_id(DATA[1]);
		if(TANK_FROM===false){
			console.log('Error: tank_from "'+DATA[1]+'" was not found on tank_kill.');
			return false;
			}
		
		TANK_TO.deaths = TANK_TO.deaths + 1;
		TANK_TO.score = TANK_TO.score + SCORES_INFO[2];
		
		if(TYPES[TANK_TO.type].name == "Tower"){
			//change base stats
			for(var b in TANKS){
				if(TYPES[TANKS[b].type].name == "Base" && TANKS[b].team == TANK_TO.team){
					TANKS[b].armor = TANKS[b].armor - 10;
					if(TANKS[b].armor<0) 
						TANKS[b].armor = 0;	
					}
				}
			}
		if(TYPES[TANK_TO.type].no_repawn != undefined){	
			//removing
			for(var b=0; b < TANKS.length; b++){
				if(TANKS[b].id==TANK_TO.id){	
					TANKS.splice(b, 1);  b--;
					break;
					}
				}
			}
		//adding kill stats
		if(TYPES[TANK_TO.type].no_repawn == undefined){
			//player
			if(TANK_TO.dead != 1)
				TANK_FROM.kills = TANK_FROM.kills + 1;	
			//score
			TANK_FROM.score = TANK_FROM.score + SCORES_INFO[1];
			death(TANK_TO);
			}
		//show kill message
		if(TANK_FROM.name != '')
			chat(TANK_TO.name+" was killed by "+TANK_FROM.name+"!", false, false);
		}
	else if(type == 'level_up'){	//tank leveled up
		//DATA = room_id, player_id, level, xxxxxxxxxxxxx
		TANK_TO = get_tank_by_id(DATA[1]);
		if(TANK_TO===false){	
			console.log('Error: tank_to "'+DATA[1]+'" was not found on level_up.');
			return false;
			}
		TANK_TO.level = DATA[2];
		TANK_TO.armor = TANK_TO.armor + TYPES[TANK_TO.type].armor[1];
		TANK_TO.damage = TANK_TO.damage + TYPES[TANK_TO.type].damage[1];
		if(TANK_TO.armor > TYPES[TANK_TO.type].armor[2])
			TANK_TO.armor = TYPES[TANK_TO.type].armor[2];
		TANK_TO.score = TANK_TO.score + SCORES_INFO[0];
		
		TANK_TO.abilities_lvl[DATA[3]]++;
		if(TANK_TO.id == MY_TANK.id)
			draw_tank_abilities();
		
		//update passive abilites
		for(a in TYPES[TANK_TO.type].abilities){ 
			if(TYPES[TANK_TO.type].abilities[a].passive == false) continue;
			var nr = 1+parseInt(a);
			var ability_function = TYPES[TANK_TO.type].abilities[a].name.replace(/ /g,'_');
			if(ability_function != undefined){
				try{
					window[ability_function](TANK_TO);
					}
				catch(err){console.log("Error: "+err.message);}
				}
			}
		}
	else if(type == 'del_invisible'){	//remove invisibility
		//DATA = [player_id]
		TANK = get_tank_by_id(DATA[0]);
		if(TANK===false){	
			console.log('Error: tank "'+DATA[0]+'" was not found on del_invisible.');
			return false;
			}
		stop_camouflage(TANK);
		}
	else if(type == 'summon_bots'){	//send bots
		//DATA = [room_id, random_id]
		add_bots(DATA[1]);
		}	
	else if(type == 'bullet'){	//tank hit
		//DATA = [target_id, source_id, angle, damage, instant_bullet, pierce_armor]
		TANK_TO = get_tank_by_id(DATA[0]);
		TANK = get_tank_by_id(DATA[1]);
		if(TANK_TO===false){	
			console.log('Error: tank_to "'+DATA[0]+'" was not found on tank_hit.');
			return false;
			}
		if(TANK===false){	
			console.log('Error: tank "'+DATA[1]+'" was not found on tank_hit.');
			return false;
			}
		update_players_ping(TANK.name);
		
		//create bullet
		var tmp = new Array();
		tmp.x = TANK.x + TYPES[TANK.type].size[1]/2;
		tmp.y = TANK.y + TYPES[TANK.type].size[1]/2;
		tmp.bullet_to_target = TANK_TO; 
		tmp.bullet_from_target = TANK;
		tmp.angle = DATA[2];
		tmp.skill = 1;
		if(DATA[3] != undefined && DATA[3] != false)
			tmp.damage = DATA[3];
		if(DATA[4] != undefined && DATA[4] != false)
			tmp.instant_bullet = 1;
		if(DATA[5] != undefined && DATA[5] != false)
			tmp.pierce_armor = DATA[5];
		BULLETS.push(tmp);
		if(TYPES[TANK_TO.type].type != 'human') TANK.bullets++;
		
		//extra updates
		TANK.attacking = TANK_TO;
		if(DATA[2] != 0){
			draw_fire(TANK, TANK_TO);
			if(TANK.id == MY_TANK.id)
				shoot_sound(TANK);
			}
		}	
	}
//sending action to other players
function register_tank_action(action, room_id, player, data, data2, data3){	//lots of broadcasting
	if(action=='move')
		send_packet('tank_move', [room_id, player, data]);
	else if(action=='skill_up')
		send_packet('skill_up', [room_id, player, data]);
	else if(action=='skill_do')
		send_packet('skill_do', [room_id, player, data, data2]);
	else if(action=='leave_game')
		send_packet('leave_game', [room_id, player]);
	else if(action=='kick_player')
		send_packet('kick_player', [room_id, player]);
	else if(action=='kick_player')
		send_packet('leave_room', [room_id, player]);
	else if(action=='join_room')
		send_packet('join_room', [room_id, player]);
	else if(action=='end_game')
		send_packet('end_game', [room_id, data]);
	else if(action=='ask_rooms')
		send_packet('ask_rooms', player);
	else if(action=='prepare_game')
		send_packet('prepare_game', [room_id, player]);
	else if(action=='start_game')
		send_packet('start_game', [room_id, data]);
	else if(action=='kill')
		send_packet('tank_kill', [room_id, player, data]);
	else if(action=='skill_advanced')
		send_packet('skill_advanced', [room_id, player, data]);
	else if(action=='level_up')
		send_packet('level_up', [room_id, player, data, data2]);
	else if(action=='change_tank')
		send_packet('change_tank', [room_id, data, player, data2]);
	else if(action=='leave_room'){
		for(var i=0; i < ROOMS.length; i++){
			if(ROOMS[i].id == room_id){
				if(ROOM.host == player){
					//host leaving room
					send_packet('delete_room', room_id);
					ROOMS.splice(i, 1);  i--;
					}
				else{
					//player leaving room
					send_packet('leave_room', [room_id, player]);
					}
				}
			}
		}
	else if(action=='chat'){
		var text_limit = 100;
		if(PLACE == 'room')
			text_limit = 500;
		if(data.length > text_limit)
			data = data.substring(0, text_limit);
		var team = '';
		if(PLACE=='game')
			team = MY_TANK.team;
		if(data2 == false)
			send_packet('chat', [room_id, data, player, team, PLACE]);
		else
			//with shift
			send_packet('chat', [room_id, data, player, team, PLACE, 1]);
		}
	
	//error
	else
		alert('Error, unknown action ['+action+'] in register_tank_action();');	
	}
//new room was created
function register_new_room(room_name, mode, type, max_players, map){
	var players = [];
	players.push({
		name: name, 
		team: 'B',
		ping: Date.now(),
		});
	
	ROOM = {
		id: Math.floor(Math.random()*9999999),
		name: room_name,
		settings: [mode, type, map],
		max: max_players,
		host: name,
		players: players,
		version: VERSION,
		};
	ROOMS.push(ROOM);
	send_packet('new_room', ROOM);						//broadcast it
	return ROOM.id;
	}
//sync multiplayer data to local room data
function sync_multiplayers(){
	var ROOM = get_room_by_id(opened_room_id);
	for(var i in ROOM.players){
		if(ROOM.players[i].name != name){	//if not me
			add_tank(1, ROOM.players[i].name, ROOM.players[i].name, ROOM.players[i].tank, ROOM.players[i].team);
			}
		}
	}
function get_waiting_players_count(){
	return waiting_users;
	}
function update_players_ping(name){
	if(PLACE != 'game') return false;
	ROOM = get_room_by_id(opened_room_id);
	for(var p in ROOM.players){
		if(ROOM.players[p].name == name)
			ROOM.players[p].ping = Date.now();
		}
	}
function disconnect_game(e){
	if(PLACE=='room' && game_mode == 2){
		if(confirm("Do you really want to leave this room?")==false){
			return false;
			}
		register_tank_action('leave_room', opened_room_id, name);
		}
	if(PLACE=='game' && game_mode == 2){
		if(confirm("Do you really want to quit game???")==false){
			return false;
			}
		register_tank_action('leave_game', opened_room_id, name);
		}
	}
