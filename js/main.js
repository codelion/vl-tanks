/*
Name: VL Tanks
Author: VL
*/

//start
init_game(true);

//init hello screen
function init_game(first_time){
	PLACE = 'init';
	
	//check if muted
	if(getCookie("muted") != '')
		muted=true;
		
	unique_id = 0;
	level = 1;
	
	//set width and height
	if(first_time==true){
		prepare_maps();
		check_canvas_sizes();
		}
	
	//logo
	canvas_backround.fillStyle = "#676767";
	canvas_backround.fillRect(0, 0, WIDTH_APP, HEIGHT_APP-27);
	var img = new Image();
	img.src = 'img/logo.png';
	img.onload = function(){	//wait till background is loaded
		var img = new Image();	
		img.src = 'img/logo.png';
		var left = (WIDTH_APP-598)/2;	
		canvas_backround.drawImage(img, left, 50);
		if(first_time==true){
			preload_all_files();
			if(chat_interval_id==undefined)
				chat_interval_id = setInterval(controll_chat, 1000);
			}	
		if(preloaded==true)
			add_first_screen_elements();
		}
	}
//checks and resizes all canvas layers
function check_canvas_sizes(){
	if(FS==false){
		WIDTH_MAP = MAPS[level-1]['map'][0].length*block_width;
		HEIGHT_MAP = MAPS[level-1]['map'].length*block_height;
		WIDTH_APP = APP_SIZE_CACHE[0];
		HEIGHT_APP = APP_SIZE_CACHE[1];
		WIDTH_SCROLL = block_width*12;
		HEIGHT_SCROLL = HEIGHT_APP-150-25;
		}
	else{
		//full screen
		var dimensions = get_fimensions();
		//map
		WIDTH_MAP = MAPS[level-1]['map'][0].length*block_width;
		HEIGHT_MAP = MAPS[level-1]['map'].length*block_height;
		//app
		WIDTH_APP = dimensions[0];
		HEIGHT_APP = dimensions[1];
		if(WIDTH_APP > WIDTH_MAP)
			WIDTH_APP = WIDTH_MAP;
		if(WIDTH_APP < APP_SIZE_CACHE[0])
			WIDTH_APP = APP_SIZE_CACHE[0];	
		if(HEIGHT_APP > HEIGHT_MAP)
			HEIGHT_APP = HEIGHT_MAP;
		if(HEIGHT_APP < APP_SIZE_CACHE[1])
			HEIGHT_APP = APP_SIZE_CACHE[1];	
		//scroll
		WIDTH_SCROLL = dimensions[0];
		HEIGHT_SCROLL = dimensions[1]-HEIGHT_STATUS_AREA;
		if(WIDTH_SCROLL > WIDTH_MAP)
			WIDTH_SCROLL = WIDTH_MAP;
		if(WIDTH_SCROLL < block_width*11)
			WIDTH_SCROLL = block_width*11;	
		if(HEIGHT_SCROLL+HEIGHT_STATUS_AREA > HEIGHT_MAP)
			HEIGHT_SCROLL = HEIGHT_MAP-HEIGHT_STATUS_AREA;
		if(HEIGHT_SCROLL < block_height*6)
			HEIGHT_SCROLL = block_height*6;	
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
function add_first_screen_elements(){
	add_settings_buttons(canvas_backround, ["Single player","Multiplayer","Settings"]);
	
	name_tmp = getCookie("player_name");
	if(name_tmp != ''){
		name = name_tmp+Math.floor(Math.random()*99);
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
			if(extra==0){
				// single player
				game_mode = 1;
				start_game_timer_id = setInterval(starting_game_timer_handler, 1000);
				draw_tank_select_screen();
				}
			else if(extra==1){
				//multi player
				if(socket_live==false)
					connect_server();
				draw_rooms_list();
				}
			else if(extra==2){
				//settings
				PLACE = 'settings';
				add_settings_buttons(canvas_backround, ["Player name: "+name,"Back"]);
				}
			}, i);
		register_button(settings_positions[i].x, settings_positions[i].y, settings_positions[i].width, settings_positions[i].height, 'settings', function(xx, yy, extra){
			if(extra==0){
				//edit name
				var name_tmp = prompt("Please enter your name", name);
				if(name_tmp != null){
					name = name_tmp;
					add_settings_buttons(canvas_backround, ["Player name: "+name,"Back"]);
					setCookie("player_name", name, 30);
					}
				}
			else if(extra==1){
				//back to first screen
				PLACE = 'init';
				add_settings_buttons(canvas_backround, ["Single player","Multiplayer","Settings"]);
				}
			}, i);
		}
	}
function preload_all_files(){
	images_to_preload = [
		//general
		'img/background.jpg',
		'img/favicon.png',
		'img/lock.png',
		'img/logo.png',
		'img/mute.png',
		'img/repair.png',
		'img/statusbar.png',
		'img/target.png',
		'img/unmute.png',
		'img/button.png',
		//map elements
		'img/map/0.png',
		'img/map/1.png',
		'img/map/2.png',
		'img/map/grass-all.jpg',
		];
	audio_to_preload = [
		'sounds/click.ogg',
		'sounds/main.ogg',
		'sounds/shoot.ogg',
		];
		
	//calculate files count
	preload_left = images_to_preload.length + audio_to_preload.length + BULLETS.length;
	for(i in TYPES){
		preload_left = preload_left + 5;	
		}
	preload_total = preload_left;
	
	//start preloading
	for(var i in images_to_preload){
		preload(images_to_preload[i]);
		}
	for(var i in BULLETS){
		preload('img/bullets/'+BULLETS[i].file);
		}
	for(var i in audio_to_preload){
		preload(audio_to_preload[i], 'audio');
		}
	for(i in TYPES){
		//preview
		if(TYPES[i].preview != '')
			preload('img/tanks/'+TYPES[i].name+'/'+TYPES[i].preview);
		else
			update_preload(1);
		//icon_top
		if(TYPES[i].icon_top[0] != undefined)
			preload('img/tanks/'+TYPES[i].name+'/'+TYPES[i].icon_top[0]);
		else
			update_preload(1);
		if(TYPES[i].icon_top[1] != undefined)
			preload('img/tanks/'+TYPES[i].name+'/'+TYPES[i].icon_top[1]);
		else
			update_preload(1);
		//icon_base
		if(TYPES[i].icon_base[0] != undefined)
			preload('img/tanks/'+TYPES[i].name+'/'+TYPES[i].icon_base[0]);
		else
			update_preload(1);
		if(TYPES[i].icon_base[1] != undefined)
			preload('img/tanks/'+TYPES[i].name+'/'+TYPES[i].icon_base[1]);
		else
			update_preload(1);
		}
	}
//start game
function init_action(map_nr, my_team){
	PLACE = 'game';
	level = map_nr;
	
	check_canvas_sizes();
	
	if(my_tank_nr == -1)
		my_tank_nr=0;
	
	if(my_team=='B')
		map_offset = [0, 0]
	else
		map_offset = [0, -1*(HEIGHT_MAP-HEIGHT_SCROLL)];
	document.getElementById("canvas_map").style.marginTop =  map_offset[1]+"px";
	document.getElementById("canvas_map").style.marginLeft =  map_offset[0]+"px";
	var currentTime = new Date();
	start_time = currentTime.getTime()-1338210799152;
	
	draw_interval_id = setInterval(draw_main, Math.floor(1000/FPS));

	//sound
	if(muted==false){
		audio_main = document.createElement('audio');
		audio_main.setAttribute('src', 'sounds/main.ogg');
		audio_main.setAttribute('loop', 'loop');
		try{
			audio_main.play();
			}
		catch(error){}
		}
	
	//create ... me
	var tmp = new Array();
	tmp['id'] = name;
	tmp['name'] = name;
	tmp['type'] = my_tank_nr;
	if(my_team=='B'){
		//blue top
		tmp['x'] = WIDTH_SCROLL/2+Math.floor(block_width*0.6);
		tmp['y'] = 20;
		tmp['angle'] = 180;
		}
	else{
		//red bottom 
		tmp['x'] = WIDTH_SCROLL/2-Math.floor(block_width*0.6)-TYPES[tmp['type']].size[1];
		tmp['y'] = HEIGHT_MAP-20-TYPES[tmp['type']].size[1];
		tmp['angle'] = 0;
		}
	tmp['fire_angle'] = 180;
	tmp['move'] = 0;
	tmp['hp'] = TYPES[my_tank_nr].life[0];	
	tmp['level'] = 1;	
	tmp['sublevel'] = 0;
	tmp['team'] = my_team;
	tmp['abilities_lvl'] = [1,1,1];
	tmp['sight'] = TYPES[tmp['type']].scout+TYPES[tmp['type']].size[1]/2;
	tmp['speed'] = TYPES[tmp['type']].speed;
	tmp['upgrade_points'] = 0;
	tmp['armor'] = TYPES[tmp['type']].armor[0];
	tmp['damage'] = TYPES[tmp['type']].damage[0];
	tmp['attack_delay'] = TYPES[tmp['type']].attack_delay;
	tmp['bullets'] = new Array();
	TANKS.push(tmp);
	my_tank_id = tmp['id'];
	MY_TANK = TANKS[(TANKS.length-1)];

	//add enemy if single player
	if(game_mode==1){
		//get possible types
		var possible_types = [];
		for(var t in TYPES){
			if(TYPES[t].type=="tank")
				possible_types.push(t);
			}
		//get random type
		var enemy_tank_type = possible_types[randomToN(possible_types.length-1)];//randomize
				
		var tmp = new Array();
		tmp['id'] = get_unique_id();
		tmp['name'] = "Bot";
		tmp['type'] = enemy_tank_type;
		tmp['x'] = WIDTH_MAP/2-Math.floor(block_width*0.6)-TYPES[tmp['type']].size[1];
		tmp['y'] = HEIGHT_MAP-20-TYPES[tmp['type']].size[1];
		tmp['angle'] = 0;
		tmp['angle'] = 0;
		tmp['move'] = 0;
		tmp['hp'] = TYPES[tmp['type']].life[0];
		tmp['level'] = 1;
		tmp['sublevel'] = 0;
		tmp['team'] = 'R';
		tmp['abilities_lvl'] = [1,1,1];
		tmp['sight'] = TYPES[tmp['type']].scout+TYPES[tmp['type']].size[1]/2;
		tmp['speed'] = TYPES[tmp['type']].speed;
		tmp['upgrade_points'] = 0;
		tmp['armor'] = TYPES[tmp['type']].armor[0];
		tmp['damage'] = TYPES[tmp['type']].damage[0];
		tmp['attack_delay'] = TYPES[tmp['type']].attack_delay;
		tmp['bullets'] = new Array();
		TANKS.push(tmp);
		}
	
	sync_multiplayers();
	
	add_towers();
	
	//auto add 1 lvl upgrade
	/*for(ii in TANKS){
		if(TYPES[TANKS[ii].type].abilities.length != 0 ){
			for(jj in TYPES[TANKS[ii].type].abilities){ 
				var nr = 1+parseInt(jj);
				var ability_function = TYPES[TANKS[ii].type].abilities[jj].name.replace(/ /g,'_')+"_once";
				if(ability_function != undefined)
					window[ability_function](TANKS[ii]);
				}
			}
		}*/
		
	draw_map(false);
		
	level_hp_regen_id = setInterval(level_hp_regen_handler, 250);
	level_interval_id = setInterval(tank_level_handler, 2000);
	bots_interval_id = setInterval(add_bots, 1000*5);
	timed_functions_id = setInterval(timed_functions_handler, 100);
	
	//show fps
	var tmp = new Array();
	tmp['function'] = "update_fps";
	//tmp['duration'] = ability_reuse;
	tmp['type'] = 'REPEAT';
	timed_functions.push(tmp);
	}
//get unique id
function get_unique_id(){
	unique_id = unique_id + 1;
	return unique_id;
	}
//tank moving speed conversion
function speed2pixels(speed){
	return speed/14*25/FPS;
	}
//ability to change global range
function range2real_range(range){
	return range*1;
	}
//repeat some functions in time
function timed_functions_handler(){
	for (i in timed_functions){
		timed_functions[i].duration = timed_functions[i].duration - 100;
		if(timed_functions[i].type == 'REPEAT')
			window[timed_functions[i].function](timed_functions[i]);
		if(timed_functions[i].duration<0){
			if(timed_functions[i].type == 'ON_END')
				window[timed_functions[i].function](timed_functions[i]);
			timed_functions.splice(i, 1);
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
	clearInterval(bots_interval_id);
	clearInterval(timed_functions_id);	
	clearInterval(start_game_timer_id);
	
	starting_timer = -1;
	
	if(PLACE=='game'){
		TANKS = [];
		timed_functions = [];
		pre_draw_functions = [];
		on_click_functions = [];
		
		canvas_main.clearRect(0, 0, WIDTH_APP, HEIGHT_APP);
		canvas_main.clearRect(0, 0, WIDTH_APP, HEIGHT_APP);
				
		if(audio_main != undefined)
			audio_main.pause();
		
		//leave_game(name, opened_room_id);
		if(game_mode == 2)
			register_tank_action('leave_game', opened_room_id, name);
		opened_room_id = -1;
		
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
function chat(text, author, team){
	if(text==undefined){
		var text = document.getElementById("chat_text").value;
		document.getElementById("chat_text").value = '';
		if(text=='') return false;
		author = name;
		if(PLACE=='game'){
			team = MY_TANK.team;
			}
		else
			team = '';
		
		if(PLACE=='room' || (game_mode==2 && (PLACE=='select' || PLACE=='game')))
			register_tank_action('chat', opened_room_id, name, text);
		}
	if(text=='') return false;
	
	//save
	var time = 	new Date();
	time = time.getTime();
	CHAT_LINES.push({
		text: text,
		author: author,
		team: team,
		time: time,
		})
	}
//controlls chat lines
function controll_chat(){	
	if(CHAT_LINES.length==0) return false;
	
	//remove old
	var time = 	new Date();
	time = time.getTime();
	var max_time = 10000;
	for(var i in CHAT_LINES){
		if(time - CHAT_LINES[i].time > max_time)
			CHAT_LINES.splice(i, 1);
		}
	//show?
	if(PLACE == 'room' || PLACE == 'select'){
		canvas_main.clearRect(0, 0, WIDTH_SCROLL, HEIGHT_SCROLL);
		show_chat();
		}
	}
