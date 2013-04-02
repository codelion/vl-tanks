var socket;
var socket_live = false;
//connecto to sockets server
function connect_server(){
	// Create the Orbiter instance, used to connect to and communicate
	orbiter = new net.user1.orbiter.Orbiter();
	orbiter.getConnectionMonitor().setAutoReconnectFrequency(15000);
	orbiter.getLog().setLevel(net.user1.logger.Logger.DEBUG);
	
	// If required JavaScript capabilities are missing, abort
	if (!orbiter.getSystem().isJavaScriptCompatible())
		return log("Your browser is not supported.");
	
	// Register for Orbiter's connection events
	orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, readyListener, this);
	orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.CLOSE, disconnect_server, this);
	log("Connecting to Union...");
	
	// Connect to Union Server
	orbiter.connect(SOCKET[0], SOCKET[1]);
	}
// Triggered when the connection is ready
function readyListener(e) {
	log("Connected.");
	log("Joining room");
	
	// Create room on the server
	SOCKET_ROOM = SOCKET_ROOM_PREFIX+"rooms";
	Room = orbiter.getRoomManager().createRoom(SOCKET_ROOM);
	Room.addEventListener(net.user1.orbiter.RoomEvent.JOIN, joinRoomListener);
	Room.addEventListener(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, addOccupantListener);
	Room.addEventListener(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT, removeOccupantListener);  
	
	// Listen for messages
	Room.addMessageListener("CHAT_MESSAGE", get_packet);
	
	// Join the room
	Room.join();
	}
//we joined the room
function joinRoomListener (e) {
	log("Ready!");
	log("Number of people: " + Room.getNumOccupants());
	socket_live=true;
	try{
		parent.document.getElementById("connected").innerHTML = 'yes';
		}catch(error){}
	register_tank_action('ask_rooms', false, name);
	add_player_to_stats(name);
	}
//client joins room
function addOccupantListener (e) {
	if (Room.getSyncState() != net.user1.orbiter.SynchronizationState.SYNCHRONIZING) { 
		log("User" + e.getClientID() + " joined." + " People: " + Room.getNumOccupants());
		}
	}
//client leaves room
function removeOccupantListener (e) {
	log("User" + e.getClientID() + " left." + " People: " + Room.getNumOccupants());
	}
//disconnect from server
function disconnect_server(e){
	quit_game(false);
	socket_live = false;
	socket_live=false;  
	try{
		parent.document.getElementById("connected").innerHTML = 'no';
		}catch(error){}
	}
//send packet to server
function send_packet(type, message){
	if(message.length == 0){
		console.log('Error: empty message, type: '+type);
		return false;
		}
	if(socket_live==false){
		console.log('Error: trying to send without connection: '+type);
		return false;
		}
	console.log("send message: "+type);
	try{
		parent.document.getElementById("messages_out").innerHTML = parseInt(parent.document.getElementById("messages_out").innerHTML)+1;
		}catch(error){}
	message = {
		type: type,
		message: message,
		};
	message = JSON.stringify(message);
	Room.sendMessage("CHAT_MESSAGE", "true", null, message);
	}
//get packets from server
function get_packet(fromClient, message){	
	try{
		parent.document.getElementById("messages_in").innerHTML = parseInt(parent.document.getElementById("messages_in").innerHTML)+1;
		}catch(error){}
	DATA = JSON.parse(message);
	var type = DATA.type;
	DATA = DATA.message;
	console.log("reveived message: "+type);
	
	if(type == 'new_room'){		//new room was created
		var n = ROOMS.length;
		if(get_room_by_id(DATA.id)!= false) return false;
		ROOMS.push(DATA);
		add_player_to_stats(DATA.host);
		if(PLACE=='rooms')
			draw_rooms_list();
		}
	else if(type == 'delete_room'){	//room was deleted
		for(var i in ROOMS){
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
		add_player_to_stats(DATA);
		}
	else if(type == 'leave_room'){	//player leaving room
		//DATA = [room_id, player_name]
		var ROOM = get_room_by_id(DATA[0]);
		if(ROOM != false){
			for(var j in ROOM.players){
				if(ROOM.players[j].name == DATA[1]){
					ROOM.players.splice(j, 1); j--;
					if(PLACE=='room')
						draw_room(ROOM.id);
					return false;
					}
				}
			}
		}
	else if(type == 'kick_player'){	//player was kicked
		//DATA = [room_id, player_name]
		var ROOM = get_room_by_id(DATA[0]);
		if(ROOM.host==DATA[1]){
			console.log('ERROR: attempt to kick host from room...');
			return false; // host was kicked, this is probably hack from outside
			}
		if(ROOM != false){
			for(var j in ROOM.players){
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
		add_player_to_stats(DATA[1]);
		}
	else if(type == 'prepare_game'){	//prepare game - select tanks/maps screen
		if(PLACE=="room" && opened_room_id==DATA){
			game_mode = 2;
			start_game_timer_id = setInterval(starting_game_timer_handler, 1000);
			draw_tank_select_screen();
			ROOM = get_room_by_id(DATA);
			if(ROOM.host==name && ROOM.settings[0] != 'normal'){
				choose_and_register_tanks(ROOM);
				}
			}
		}
	else if(type == 'change_tank'){		//change map in selecting screen
		//DATA = room_id, tank_index, player_name]
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
		}
	else if(type == 'start_game'){	//start game
		//DATA = game_id
		if(PLACE=="select" && opened_room_id==DATA){
			ROOM = get_room_by_id(DATA);
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
		if(PLACE=="game" && opened_room_id==DATA[0]){
			draw_final_score(false, DATA[1]);
			}
		}
	else if(type == 'leave_game'){		//player leaving game
		//DATA = [room_id, player_name]
		chat(DATA[1]+" left the game.", false, false);
		}	
	else if(type == 'tank_move'){		//tank move
		//DATA = room_id, player, [from_x, from_y, to_x, to_y, lock] 
		if(DATA[1] == name && muted==false){
			try{
				audio_finish = document.createElement('audio');
				if(Math.floor(Math.random()*10) < 5)
					audio_finish.setAttribute('src', 'sounds/click1.ogg');
				else
					audio_finish.setAttribute('src', 'sounds/click2.ogg');
				audio_finish.play();
				}
			catch(error){}
		}
		if(PLACE=="game" && opened_room_id==DATA[0]){
			TANK = get_tank_by_name(DATA[1]);
			if(TANK===false) log('ERROR: tank "'+DATA[1]+'" was not found on tank_move.');
			TANK.x = DATA[2][0];
			TANK.y = DATA[2][1];
			TANK.move = 1;
			TANK.move_to = [DATA[2][2], DATA[2][3]];
			delete TANK.target_move_lock;
			if(DATA[2][4] != undefined){
				//target lock
				TANK.target_move_lock = DATA[2][4];
				TANK.target_shoot_lock = DATA[2][4];
				}
			}
		}
	else if(type == 'skill_do'){	//tank skill start
		//DATA = room_id, player, nr=[1,2,3]
		if(PLACE=="game" && opened_room_id==DATA[0]){
			TANK = get_tank_by_name(DATA[1]);
			if(TANK===false) log('ERROR: tank "'+DATA[1]+'" was not found on skill_do.');
			var nr = DATA[2];	
			var ability_function = TYPES[TANK.type].abilities[nr-1].name.replace(/ /g,'_');
			//execute
			var ability_reuse = window[ability_function](TANK);
			if(ability_reuse != undefined && ability_reuse != 0){
				TANK['ability_'+nr+'_in_use']=1;
				if(DATA[1] == name){
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
	else if(type == 'leave_game'){	//player leaving game
		//DATA = room_id, player
		}	
	else if(type == 'chat'){		//chat
		//DATA = room_id, data, player, team, place
		if(PLACE != DATA[4]) return false;
		if(PLACE=='game' && DATA[0] != opened_room_id) return false;
		if(PLACE=='room' && DATA[0] != opened_room_id) return false;
		if(PLACE=='select' && DATA[0] != opened_room_id) return false;
		if(DATA[2] != name)
			chat(DATA[1], DATA[2], DATA[3]);
		}
	else if(type == 'tank_kill'){	//tank was killed
		//DATA = room_id, player, killed_tank_id
		if(DATA[1]==name) return false; 	//already done
		TANK_TO = get_tank_by_id(DATA[2]);
		if(TANK_TO===false) log('ERROR: tank_to "'+DATA[2]+'" was not found on tank_kill.');
		TANK_FROM = get_tank_by_name(DATA[1]);
		if(TANK_FROM===false) log('ERROR: tank_to "'+DATA[1]+'" was not found on tank_kill.');
		
		//actions
		if(TANK_TO.deaths == undefined)	TANK_TO.deaths = 1;
		else				TANK_TO.deaths = TANK_TO.deaths + 1;
		
		//tower dead - decreasing base armor
		if(TYPES[TANK_TO.type].name == "Tower"){
			for(var b in TANKS){
				if(TYPES[TANKS[b].type].name == "Base" && TANKS[b].team == TANK_TO.team){
					TANKS[b].armor = TANKS[b].armor - 10;
					if(TANKS[b].armor<0) 
						TANKS[b].armor = 0;	
					}
				}
			for(var b in TANKS){
				if(TANKS[b].id==TANK_TO.id){	
					TANKS.splice(b, 1);  b--;
					break;
					}
				}
			}
		if(TYPES[TANK_TO.type].no_repawn == undefined){
			//player
			if(TANK_FROM.kills == undefined)	TANK_FROM.kills = 1;
			else					TANK_FROM.kills = TANK_FROM.kills + 1;
			//score
			if(TANK_FROM.score == undefined)
				TANK_FROM.score = 0;
			TANK_FROM.score = TANK_FROM.score + 20;	// +20 for kill
			
			death(TANK_TO);
			}
		}
	}
//sending action to other players
function register_tank_action(action, room_id, player, data){			//lots of broadcasting
	if(action=='move')
		send_packet('tank_move', [room_id, player, data]);
	else if(action=='skill_up')
		send_packet('skill_up', [room_id, player, data]);
	else if(action=='skill_do')
		send_packet('skill_do', [room_id, player, data]);
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
		send_packet('prepare_game', room_id);
	else if(action=='start_game')
		send_packet('start_game', room_id);
	else if(action=='change_tank')
		send_packet('change_tank', [room_id, data, player]);
	else if(action=='kill')
		send_packet('tank_kill', [room_id, player, data]);
	else if(action=='leave_room'){
		for(var i in ROOMS){
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
		if(data.length > 100)
			data = data.substring(0, 100);
		var team = '';
		if(PLACE=='game')
			team = MY_TANK.team;
		send_packet('chat', [room_id, data, player, team, PLACE]);
		}
	
	//error
	else
		alert('Error, unknown action ['+action+'] in register_tank_action();');	
	}
//new room was created
function register_new_room(room_name, mode, type, max_players, map){
	//find max id
	var max_id=0;
	for(var t in ROOMS){
		if(ROOMS[t].id>max_id)
			max_id = ROOMS[t].id;
		}
	max_id=max_id+1;
	
	var players = [];
	players.push({name: name, team: 'B'});
	
	ROOM = {
		id: max_id,
		name: room_name,
		settings: [mode, type, map],
		max: max_players,
		host: name,
		players: players,
		};
	ROOMS.push(ROOM);
	send_packet('new_room', ROOM);						//broadcast it
	return ROOM.id;
	}
//register new player for total count
function add_player_to_stats(new_name){
	for(var i in PLAYERS){
		if(PLAYERS[i] == new_name)
			return false;
		}
	//unique name
	PLAYERS.push(new_name);
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

