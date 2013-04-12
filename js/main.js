/*
Name: Moon wars
Author: Vilius
Email: www.viliusl@gmail.com
*/

//init hello screen
function init_game(first_time){
	PLACE = 'init';
	dynamic_title();
	if(socket_live == true)
		room_controller();
	if(getCookie("muted") != '0')
		muted=true;
	if(DEBUG==true){
		MAX_SENT_PACKETS = 1000;
		START_GAME_COUNT_MULTI = 5;
		}
	unique_id = 0;
	level = 1;
	//set width and height
	if(first_time==true)
		check_canvas_sizes();
	
	//logo backround color
	canvas_backround.fillStyle = "#676767";
	canvas_backround.fillRect(0, 0, WIDTH_APP, HEIGHT_APP-27);
	//text
	var text = "Moon wars".split("").join(String.fromCharCode(8201))
	canvas_backround.font = "Bold 70px Arial";
	canvas_backround.strokeStyle = '#ffffff';
	canvas_backround.strokeText(text, 160, 340);
	var img = new Image();
	img.src = '../img/logo.png';
	register_button((WIDTH_APP-598)/2, 15, 600, 266, PLACE, function(){
		if(muted==false){
			var audio_fire = document.createElement('audio');
			audio_fire.setAttribute('src', '../sounds/shoot.ogg');
			audio_fire.play();
			}
		});
	img.onload = function(){	//wait till background is loaded
		var left = (WIDTH_APP-598)/2;	
		canvas_backround.drawImage(img, left, 15);
		if(first_time==true){
			preload_all_files();
			if(chat_interval_id==undefined)
				chat_interval_id = setInterval(controll_chat, 500);
			}
		if(preloaded==true)
			add_first_screen_elements();
		}
	}
//checks and resizes all canvas layers
function check_canvas_sizes(){
	if(FS==false){
		WIDTH_MAP = MAPS[level-1].width;
		HEIGHT_MAP = MAPS[level-1].height;
		WIDTH_APP = APP_SIZE_CACHE[0];
		HEIGHT_APP = APP_SIZE_CACHE[1];
		WIDTH_SCROLL = 800;
		if(WIDTH_MAP<800)
			WIDTH_SCROLL = WIDTH_MAP;
		HEIGHT_SCROLL = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT;
		}
	else{
		//full screen
		var dimensions = get_fimensions();
		//map
		WIDTH_MAP = MAPS[level-1].width;
		HEIGHT_MAP = MAPS[level-1].height;
		//app
		WIDTH_APP = dimensions[0];
		HEIGHT_APP = dimensions[1];
		if(WIDTH_APP > WIDTH_MAP)
			WIDTH_APP = WIDTH_MAP;
		if(WIDTH_APP < APP_SIZE_CACHE[0])
			WIDTH_APP = APP_SIZE_CACHE[0];	
		if(HEIGHT_APP > HEIGHT_MAP+INFO_HEIGHT+STATUS_HEIGHT)
			HEIGHT_APP = HEIGHT_MAP+INFO_HEIGHT+STATUS_HEIGHT;
		if(HEIGHT_APP < APP_SIZE_CACHE[1])
			HEIGHT_APP = APP_SIZE_CACHE[1];	
		//scroll
		WIDTH_SCROLL = dimensions[0];
		HEIGHT_SCROLL = HEIGHT_MAP;
		if(WIDTH_SCROLL > WIDTH_MAP)
			WIDTH_SCROLL = WIDTH_MAP;
		if(HEIGHT_SCROLL+INFO_HEIGHT+STATUS_HEIGHT > HEIGHT_APP)
			HEIGHT_SCROLL = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT;
		}
	//background
	document.getElementById("canvas_backround").width  = WIDTH_APP;
	document.getElementById("canvas_backround").height = HEIGHT_APP;
	//map
	document.getElementById("canvas_map").width  = WIDTH_MAP;
	document.getElementById("canvas_map").height = HEIGHT_MAP;
	//map sight
	document.getElementById("canvas_map_sight").width  = WIDTH_SCROLL;
	document.getElementById("canvas_map_sight").height = HEIGHT_SCROLL;
	//objects
	canvas_base.width  = WIDTH_SCROLL;
	canvas_base.height = HEIGHT_SCROLL;
	//canvas_area
	document.getElementById("canvas_area").style.height = HEIGHT_APP+"px";
	document.getElementById("canvas_area").style.width = WIDTH_APP+"px";
	try{
		parent.document.getElementById("main_iframe").style.height = HEIGHT_APP+"px";
		parent.document.getElementById("main_iframe").style.width = WIDTH_APP+"px";
		}catch(error){}
	//chat elements
	document.getElementById("chat_write").style.top = (HEIGHT_APP-55)+"px";
	}
var menu_pressed = false;
function add_first_screen_elements(){
	add_settings_buttons(canvas_backround, ["Single player","Multiplayer","Settings"]);
	
	name_tmp = getCookie("player_name");
	if(name_tmp != ''){
		name = name_tmp;
		if(DEBUG==true)
			name = name_tmp+Math.floor(Math.random()*99);
		}
	counter_tmp = getCookie("start_count");
	if(counter_tmp != ''){
		START_GAME_COUNT_SINGLE = counter_tmp;
		}
	if(muted==false){
		if(audio_main != undefined)
			audio_main.pause();
		}
	
	draw_status_bar();
	PLACE == 'init';
	
	for (i in settings_positions){
		//register menu buttons
		register_button(settings_positions[i].x, settings_positions[i].y, settings_positions[i].width, settings_positions[i].height, 'init', function(xx, yy, extra){
			if(menu_pressed == true) return false;
			menu_pressed = true;
			if(extra==0){
				// single player
				game_mode = 1;
				start_game_timer_id = setInterval(starting_game_timer_handler, 1000);
				draw_tank_select_screen();
				}
			else if(extra==1){
				room_id_to_join = -1;
				//multi player
				if(socket_live==false)
					connect_server();
				draw_rooms_list();
				}
			else if(extra==2){
				//settings
				add_settings_buttons(canvas_backround, ["Player name: "+name, "Start game counter: "+START_GAME_COUNT_SINGLE, "Back"]);
				PLACE = 'settings';
				}
			}, i);
		register_button(settings_positions[i].x, settings_positions[i].y, settings_positions[i].width, settings_positions[i].height, 'settings', function(xx, yy, extra){
			if(menu_pressed == true) return false;
			menu_pressed = true;
			if(extra==0){
				//edit name
				var name_tmp = prompt("Please enter your name", name);
				if(name_tmp != null){
					name = name_tmp;
					add_settings_buttons(canvas_backround, ["Player name: "+name, "Start game counter: "+START_GAME_COUNT_SINGLE, "Back"]);
					setCookie("player_name", name, 30);
					}
				}
			else if(extra==1){
				//edit start game couter
				var value_tmp = prompt("Please enter number 1-30", START_GAME_COUNT_SINGLE);
				if(value_tmp != null){
					START_GAME_COUNT_SINGLE = parseInt(value_tmp);
					if(START_GAME_COUNT_SINGLE < 1 || isNaN(START_GAME_COUNT_SINGLE)==true)		START_GAME_COUNT_SINGLE = 1;
					if(START_GAME_COUNT_SINGLE > 30)		START_GAME_COUNT_SINGLE = 30;
					add_settings_buttons(canvas_backround, ["Player name: "+name, "Start game counter: "+START_GAME_COUNT_SINGLE, "Back"]);
					setCookie("start_count", START_GAME_COUNT_SINGLE, 30);
					}
				}
			else if(extra==2){
				//back to first screen
				add_settings_buttons(canvas_backround, ["Single player","Multiplayer","Settings"]);
				PLACE = 'init';
				}
			}, i);
		}
	}
function preload_all_files(){
	images_to_preload = [
		//general
		'../img/background.jpg',
		'../img/map/moon.jpg',
		'../img/favicon.png',
		'../img/lock.png',
		'../img/logo.png',
		'../img/mute.png',
		'../img/repair.png',
		'../img/target.png',
		'../img/unmute.png',
		'../img/button.png',
		'../img/explosion.png',
		'../img/explosion_big.png',
		'../img/statusbar.png',
		'../img/level.png',
		'../img/logo-small.png',
		'../img/map/mine.png',
		];
	audio_to_preload = [
		'../sounds/click.ogg',
		'../sounds/main.ogg',
		'../sounds/shoot.ogg',
		'../sounds/metal.ogg',
		];
		
	//calculate files count
	preload_left = images_to_preload.length + audio_to_preload.length + BULLETS_TYPES.length + ELEMENTS.length;
	for(i in TYPES){
		preload_left = preload_left + 3;	
		}
	preload_total = preload_left;
	
	//start preloading
	for(var i in images_to_preload){
		preload(images_to_preload[i]);
		}
	for(var i in BULLETS_TYPES){
		preload('../img/bullets/'+BULLETS_TYPES[i].file);
		}
	for(var i in ELEMENTS){
		preload('../img/map/'+ELEMENTS[i].file);
		}
	for(var i in audio_to_preload){
		preload(audio_to_preload[i], 'audio');
		}
	for(i in TYPES){
		//preview
		if(TYPES[i].preview != '')
			preload('../img/tanks/'+TYPES[i].name+'/'+TYPES[i].preview);
		else
			update_preload(1);
		//icon_top
		if(TYPES[i].icon_top[0] != undefined)
			preload('../img/tanks/'+TYPES[i].name+'/'+TYPES[i].icon_top[0]);
		else
			update_preload(1);
		//icon_base
		if(TYPES[i].icon_base[0] != undefined)
			preload('../img/tanks/'+TYPES[i].name+'/'+TYPES[i].icon_base[0]);
		else
			update_preload(1);
		}
	}
//start game
function init_action(map_nr, my_team){
	if(PLACE=='game') return false; //already started
	PLACE = 'game';
	dynamic_title();
	room_controller();
	
	level = map_nr;
	
	check_canvas_sizes();
	
	if(my_tank_nr == -1)
		my_tank_nr=0;
	
	if(my_team=='B')
		map_offset = [0, 0];
	else
		map_offset = [0, -1*(HEIGHT_MAP-HEIGHT_SCROLL)];
		
	var requestAnimationFrame = window.requestAnimationFrame 
				|| window.mozRequestAnimationFrame 
				|| window.webkitRequestAnimationFrame 
				|| window.msRequestAnimationFrame
				|| function(callback){ render_mode='setInterval'; setInterval(callback, 1000/25); };
	window.requestAnimationFrame = requestAnimationFrame;
	draw_interval_id = requestAnimationFrame(draw_main);

	//sound
	if(muted==false){
		audio_main = document.createElement('audio');
		audio_main.setAttribute('src', '../sounds/main.ogg');
		audio_main.setAttribute('loop', 'loop');
		try{
			audio_main.play();
			}
		catch(error){}
		}

	//create ... me
	add_tank(1, name, name, my_tank_nr, my_team);
	MY_TANK = TANKS[(TANKS.length-1)];
	
	auto_scoll_map();

	//add enemy if single player
	if(game_mode==1){
		//get random type
		var possible_types = [];
		var random_type=0;
		for(var t in TYPES){
			if(TYPES[t].type=="tank")
				possible_types.push(t);
			}
			
		//friends
		for(var i=1; i< MAPS[level-1].team_size; i++){
			random_type = possible_types[getRandomInt(0, possible_types.length-1)];
			if(DEBUG==false)
				add_tank(1, get_unique_id(), "Bot", random_type, 'B', undefined, undefined, undefined, true);
			}
		
		//enemies
		random_type = possible_types[getRandomInt(0, possible_types.length-1)];
		add_tank(1, get_unique_id(), "Bot", random_type, 'R', undefined, undefined, undefined, true);
		for(var i=1; i< MAPS[level-1].team_size; i++){
			random_type = possible_types[getRandomInt(0, possible_types.length-1)];
			if(DEBUG==false)
				add_tank(1, get_unique_id(), "Bot", random_type, 'R', undefined, undefined, undefined, true);
			}
		}

	sync_multiplayers();
	
	add_towers();
	
	//auto add 1 lvl upgrade
	for(ii in TANKS){
		for(jj in TYPES[TANKS[ii].type].abilities){ 
			var nr = 1+parseInt(jj);
			var ability_function = TYPES[TANKS[ii].type].abilities[jj].name.replace(/ /g,'_')+"_once";
			if(ability_function != undefined){
				try{
					window[ability_function](TANKS[ii]);
					}
				catch(err){	}
				}
			}
		}
	
	//handler for mini map
	register_button(MINI_MAP_PLACE[0], HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+MINI_MAP_PLACE[1], MINI_MAP_PLACE[2], MINI_MAP_PLACE[3], 'game', function(xx, yy){ 
		MAP_SCROLL_CONTROLL=true; 
		move_to_place(xx, yy);
		});
		
	draw_map(false);
		
	level_hp_regen_id = setInterval(level_hp_regen_handler, 1000);
	level_interval_id = setInterval(tank_level_handler, 1000);
	timed_functions_id = setInterval(timed_functions_handler, 100);
	}
//get unique id
function get_unique_id(){
	unique_id = unique_id + 1;
	return unique_id;
	}
//tank moving speed conversion
function speed2pixels(speed, time_diff){
	return speed * 1.7 * time_diff/1000;
	}
//repeat some functions in time
function timed_functions_handler(){
	for (i in timed_functions){			
		timed_functions[i].duration = timed_functions[i].duration - 100;
		var duration = 	timed_functions[i].duration				
		if(timed_functions[i].type == 'REPEAT')
			window[timed_functions[i].function](timed_functions[i]);
		if(duration<0){
			if(timed_functions[i].type == 'ON_END')
				window[timed_functions[i].function](timed_functions[i]);
			//unregister f-tion
			timed_functions.splice(i, 1);	i++;
			}
		}
	}
//quit button - quits all possible actions
function quit_game(init_next_game){
	if(PLACE=='game' && game_mode == 2){
		if(confirm("Do you really want to quit game?")==false)
			return false;
		}
	
	clearInterval(draw_interval_id);
	clearInterval(level_interval_id);
	clearInterval(level_hp_regen_id);
	clearInterval(timed_functions_id);	
	clearInterval(start_game_timer_id);
	//chrome bugfix
	clearInterval(chat_interval_id);	
	chat_interval_id = setInterval(controll_chat, 500);
	
	room_id_to_join = -1;
	starting_timer = -1;
	MINES = [];
	TANKS = [];
	
	if(PLACE=='game'){
		timed_functions = [];
		pre_draw_functions = [];
		on_click_functions = [];
		
		canvas_main.clearRect(0, 0, WIDTH_APP, HEIGHT_APP);
		canvas_main.clearRect(0, 0, WIDTH_APP, HEIGHT_APP);
				
		if(audio_main != undefined)
			audio_main.pause();
		
		if(game_mode == 2){
			register_tank_action('leave_game', opened_room_id, name);
			room_controller();
			}
	
		if(FS==true){
			fullscreen(false);
			PLACE = 'init';
			}
		}
	else if(PLACE == 'room'){
		if(game_mode == 2 && opened_room_id != -1){
			register_tank_action('leave_room', opened_room_id, name);
			}
		opened_room_id = -1;
		}
	try{
		parent.document.getElementById("packets").innerHTML = "0/0";
		parent.document.getElementById("fps").innerHTML = "";	

		}catch(error){}
	
	//reset other variables
	ROOMS = [];
	PLAYERS = [];
	opened_room_id = -1;
	BULLETS = [];
	BUTTONS = [];
	opened_room_id = -1;
	CHAT_LINES = [];
	timed_functions = [];
	pre_draw_functions = [];
	on_click_functions = [];
	mouse_move_controll = false;
	mouse_click_controll = false;
	ABILITIES_POS = [];
	game_mode = 1;
	last_selected = -1;
	last_selected_counter = -1;
	my_tank_nr = -1;
	document.getElementById("chat_write").style.visibility = 'hidden';
	packets_used=0;
	packets_all=0;
	shift_pressed = false;
	chat_shifted=false;
	
	if(init_next_game!=false){
		init_game(false);
		}
	}
//register some are for mouse clicks
function register_button(x, y, width, height, place, myfunction, extra){
	for(var i in BUTTONS){
		if(BUTTONS[i].x == x && BUTTONS[i].y == y && BUTTONS[i].width == width && BUTTONS[i].height == height && BUTTONS[i].place == place){
			return false;
			}
		}
	BUTTONS.push({
		x: x,
		y: y,
		width: width,
		height: height,
		place: place,
		function: myfunction,
		extra: extra
		});
	}
var starting_timer=-1;
//timer in select screen
function starting_game_timer_handler(){
	starting_timer--;
	draw_timer_graph();
	
	//start game?
	if(starting_timer==0){
		starting_timer = -1;
		clearInterval(start_game_timer_id);
		if(game_mode == 1)
			init_action(level, 'B');
		else
			register_tank_action('start_game', opened_room_id);
		}
	}
//preloading files	
function preload(file, type){
	if(type==undefined)
		type = 'image';
	if(file==undefined){
		update_preload(1);
		return false;
		}
	if(type=='image'){
		var imageObj = new Image();
		imageObj.src=file;
		imageObj.onload = function(){
			update_preload(1);
			}
		}
	else if(type=="audio"){
		try{
			var audio_object = new Audio();
			audio_object.addEventListener('canplaythrough', function(){update_preload(1);}, false);
			audio_object.src = file;
			}
		catch(error){
			update_preload(1);
			}
		}	
	else
		alert('Error, i can not preload ['+file+'], ['+type+'] type is not suported.');
	}
//save chat data
function chat(text, author, team, shift){
	if(text==undefined){
		//create
		var text = document.getElementById("chat_text").value;
		document.getElementById("chat_text").value = '';
		if(text=='') return false;
		author = name;
		if(PLACE=='game'){
			team = MY_TANK.team;
			}
		else
			team = '';	//shift
		
		if(PLACE=='rooms' || PLACE=='room' || (game_mode==2 && (PLACE=='select' || PLACE=='game' || PLACE == 'score'))){
			if(chat_shifted == false)
				register_tank_action('chat', opened_room_id, name, text, 0);
			else
				register_tank_action('chat', opened_room_id, name, text, 1);
			return false;
			}
		}
	if(text=='') return false;
	
	//save
	var time = new Date();
	time = time.getTime();
	CHAT_LINES.push({
		text: text,
		author: author,
		team: team,
		time: time,
		shift: shift,
		});
	if(CHAT_LINES.length > 16)
		CHAT_LINES.splice(0,1);	//remove first
	}
//controlls chat lines
function controll_chat(){
	if(CHAT_LINES.length==0) return false;
	
	//remove old
	var time = new Date();
	time = time.getTime();
	var max_time = 20000;	//20s
	for(var i in CHAT_LINES){
		if(time - CHAT_LINES[i].time > max_time){
			CHAT_LINES.splice(i, 1); i--;
			}
		}
	//show?
	if(PLACE == 'rooms' || PLACE == 'room' || PLACE == 'select' || PLACE == 'score'){
		canvas_main.clearRect(0, 0, WIDTH_SCROLL, HEIGHT_SCROLL);
		show_chat();
		}
	}
//dynamic title
function dynamic_title(data){
	try{
		if(page_title_copy=='') page_title_copy = parent.document.title;
		if(PLACE == 'rooms'){
			if(ROOMS.length>0)
				parent.document.title = page_title_copy + " ["+ROOMS.length+"]";
			else
				parent.document.title = page_title_copy;
			}
		else if(PLACE == 'room'){
			ROOM = get_room_by_id(data);
			parent.document.title = page_title_copy + " ["+ROOM.players.length+"]";
			}
		else{
			parent.document.title = page_title_copy;
			}
		}
	catch(err){
		console.log("Error: "+err.message);
		}
	}
