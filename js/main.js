/*
Name: Moon wars
Author: Vilius
Email: www.viliusl@gmail.com

TODO:
	multiplayer	- game_mode = single_quick   single_craft   multi_quick   multi_craft
		multi controlls: move, target, skills, others
		move he3 to team, initial he3
		implement weapons_bonus and armor_bonus
		optimize network packets in mode3:
			tank_move
			bullet
			skill_do
			skill_advanced
	special score for mode3: he3 and army graph in time
	heavy - aoe skill? more aoe skills?
	classes? - http://www.webmonkey.com/2010/02/make_oop_classes_in_javascript/
*/

//init hello screen
function init_game(first_time){
	PLACE = 'init';
	dynamic_title();
	CHAT_LINES = [];
	
	if(socket_live == true)
		room_controller();
	
	//sound effects
	var cookie = getCookie("mute_fx");
	if(cookie == '0' || cookie == '')
		MUTE_FX = true;
	else{
		MUTE_FX = false;
		FX_VOLUME = cookie;
		}
	
	//music	
	var cookie = getCookie("mute_music");
	if(cookie == '0' || cookie == '')
		MUTE_MUSIC = true;
	else{
		MUTE_MUSIC = false;
		MUSIC_VOLUME = cookie;
		}		

	if(DEBUG==true){
		MAX_SENT_PACKETS = 1000;
		START_GAME_COUNT = 5;
		}
		
	if(getCookie("nointro") == '1')
		intro_enabled = 0;
	unique_id = 0;
	level = 1;
	//set width and height
	if(first_time==true)
		check_canvas_sizes();
	
	//detect sound extension, .ogg by default
	if(isIE()==true)
		SOUND_EXT = '.mp3';
	
	//logo backround color
	canvas_backround.fillStyle = "#676767";
	canvas_backround.fillRect(0, 0, WIDTH_APP, HEIGHT_APP-27);
	//text
	var text = "Moon wars".split("").join(String.fromCharCode(8201));
	canvas_backround.font = "Bold 70px Arial";
	canvas_backround.strokeStyle = '#ffffff';
	canvas_backround.strokeText(text, 160, 340);
	
	//button on logo
	register_button((WIDTH_APP-598)/2, 15, 600, 266, PLACE, function(){
		if(MUTE_FX==false){
			var audio_fire = document.createElement('audio');
			audio_fire.setAttribute('src', '../sounds/shoot'+SOUND_EXT);
			audio_fire.volume = FX_VOLUME;
			audio_fire.play();
			}
		});
			
	if(first_time==true){
		preload_all_files();
		if(chat_interval_id==undefined)
			chat_interval_id = setInterval(controll_chat, 500);
		}
	if(preloaded==true)
		add_first_screen_elements();
	}
//show intro
function intro(force){
	PLACE = 'intro';
	var intro_w = 800;
	var intro_h = 500;
	DATA = [
		{image: '1.jpg', text: ["No more oil left on Earth..."],},
		{image: '2.jpg', text: ["But but researchers found huge amount of non-radioactive isotope",  "helium on the moon..."],},
		{image: '3.jpg', text: ["Helium-3 gives a chance to build ZPM", "which means unlimited energy..."],},
		{image: '4.jpg', text: ["Protect your base, push enemies away and save your country.", "Moon needs you!"],},
		];
	var text_gap = 20;
	
	if(intro_page+1 > DATA.length || (intro_enabled == 0 && force == undefined)){
		PLACE = 'init';
		add_first_screen_elements();
		return false;
		}
	//draw
	IMAGES_INRO.onload = function(){
		canvas_backround.drawImage(IMAGES_INRO, 0, intro_h*intro_page, intro_w, intro_h, 0, 0, intro_w, intro_h);
		//draw text
		var text = DATA[intro_page].text[0];
		canvas_backround.font = "Bold 21px Arial";
		canvas_backround.fillStyle = '#ffffff';
		canvas_backround.fillText(text, 30, HEIGHT_APP-STATUS_HEIGHT-40);
		//more text
		if(DATA[intro_page].text[1] != undefined){
			var text = DATA[intro_page].text[1];
			canvas_backround.font = "Bold 21px Arial";
			canvas_backround.strokeStyle = '#ffffff';
			canvas_backround.fillText(text, 30, HEIGHT_APP-STATUS_HEIGHT-40+text_gap);
			}
		//draw skip
		canvas_backround.font = "Bold 22px Arial";
		canvas_backround.strokeStyle = '#ffffff';
		canvas_backround.fillText("Skip", WIDTH_APP-60, HEIGHT_APP-STATUS_HEIGHT-15);
		}
	IMAGES_INRO.src = '../img/intro.jpg?'+VERSION;
	
	if(intro_page==0){
		//register skip button
		register_button(WIDTH_APP-70, HEIGHT_APP-STATUS_HEIGHT-45, 70, 45, PLACE, function(){
			setCookie("nointro", 1, 30);
			intro_page=0;
			PLACE = 'init';
			add_first_screen_elements();
			});
		//register next slide
		register_button(0, 0, WIDTH_APP, HEIGHT_APP-STATUS_HEIGHT, PLACE, function(){
			intro_page++;
			intro(force);
			});
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
		parent.document.getElementById("main_iframe").style.paddingLeft = "0px";
		}
	else{
		//full screen
		var dimensions = get_dimensions();
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
	
	//fog
	document.getElementById("canvas_fog").width  = WIDTH_MAP;
	document.getElementById("canvas_fog").height = HEIGHT_MAP;
	
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
		//center screen
		if(WIDTH_MAP < dimensions[0]){
			var left_margin = round((dimensions[0] - WIDTH_APP)/2);
			parent.document.getElementById("main_iframe").style.paddingLeft = left_margin + "px";
			}
		}catch(error){}
	//chat elements
	document.getElementById("chat_write").style.top = (HEIGHT_APP-55)+"px";
	document.getElementById("chat_box").style.top = (HEIGHT_APP-175)+"px";
	}
//start game
function init_action(map_nr, my_team){
	if(PLACE=='game') return false; //already started
	PLACE = 'game';
	dynamic_title();
	room_controller();
	CHAT_LINES = [];
	level = map_nr;
	
	check_canvas_sizes();
	
	if(my_tank_nr == -1)
		my_tank_nr=0;
	if(game_mode == 'single_craft' || game_mode == 'multi_craft'){
		for(var i in TYPES)
			if(TYPES[i].name == 'Soldier')
				my_tank_nr = i;
		}
	
	if(my_team=='B')
		map_offset = [0, 0];
	else
		map_offset = [0, -1*(HEIGHT_MAP-HEIGHT_SCROLL)];
		
	//sound
	if(MUTE_MUSIC==false){
		audio_main = document.createElement('audio');
		audio_main.setAttribute('src', '../sounds/main'+SOUND_EXT);
		audio_main.setAttribute('loop', 'loop');
		audio_main.volume = MUSIC_VOLUME;
		try{
			audio_main.play();
			}
		catch(error){}
		}
	
	if(game_mode == 'multi_quick' || game_mode == 'multi_craft')
		my_nation = get_nation_by_team(my_team);
		
	//find enemy team
	enemy_team = 'B';
	if(enemy_team == my_team)
		enemy_team = 'R';
		
	//find enemy nation
	if(game_mode == 'single_quick' || game_mode == 'single_craft'){
		enemy_nation_tmp = [];
		for(var n in COUNTRIES){
			if(n != my_nation)
				enemy_nation_tmp.push(n);
			}
		var enemy_nation = enemy_nation_tmp[getRandomInt(0, enemy_nation_tmp.length-1)];
		}
	else
		var enemy_nation = get_nation_by_team(enemy_team);
	
	//add towers
	add_towers(my_team, my_nation);	
	if(my_team == 'R')
		add_towers("B", enemy_nation);	
	else
		add_towers("R", enemy_nation);	
	
	//create ... me
	if((game_mode == 'single_quick' || game_mode == 'single_craft') && MAPS[level-1].ground_only != undefined && TYPES[my_tank_nr].no_collisions==1)
		my_tank_nr = 0;
	add_tank(1, name, name, my_tank_nr, my_team, my_nation);
	MY_TANK = TANKS[(TANKS.length-1)];
	MY_TANK.selected = 1;
	
	if(game_mode == 'single_craft' || game_mode == 'multi_craft'){
		//add few more me
		add_tank(1, name+'-2', name, my_tank_nr, my_team, my_nation);
		add_tank(1, name+'-3', name, my_tank_nr, my_team, my_nation);
		}
	
	auto_scoll_map();
	
	//add bots if single player
	if(game_mode == 'single_quick' || game_mode == 'single_craft'){
		//get random type
		var possible_types = [];
		var random_type=0;
		for(var t in TYPES){
			if(TYPES[t].type=="tank")
				possible_types.push(t);
			}
			
		//friends
		var n = MAPS[level-1].team_allies;
		if(game_mode == 'single_craft' || game_mode == 'multi_craft')
			n = 7;
		for(var i=1; i<n; i++){
			random_type = possible_types[getRandomInt(0, possible_types.length-1)];
			if(MAPS[level-1].ground_only != undefined && TYPES[random_type].no_collisions==1)
				continue;
			if(DEBUG==false){
				if(game_mode == 'single_craft' || game_mode == 'multi_craft')
					add_tank(1, get_unique_id(), generatePassword(6), random_type, my_team, my_nation);
				else
					add_tank(1, get_unique_id(), generatePassword(6), random_type, my_team, my_nation, undefined, undefined, undefined, true);
				}
			}
		//enemies
		for(var i=0; i< MAPS[level-1].team_enemies; ){
			random_type = possible_types[getRandomInt(0, possible_types.length-1)];
				//random_type = 3;
			if(MAPS[level-1].ground_only != undefined && TYPES[random_type].no_collisions==1)
				continue;
			add_tank(1, get_unique_id(), generatePassword(6), random_type, enemy_team, enemy_nation, undefined, undefined, undefined, true);
			if(DEBUG==true) break;
			if(game_mode == 'single_craft' || game_mode == 'multi_craft') break;
			i++;
			}
		}
		
	sync_multiplayers();
	
	//handler for mini map
	register_button(MINI_MAP_PLACE[0], HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT+MINI_MAP_PLACE[1], MINI_MAP_PLACE[2], MINI_MAP_PLACE[3], 'game', function(xx, yy){ 
		MAP_SCROLL_CONTROLL=true; 
		move_to_place(xx, yy);
		});
	if(game_mode == 'single_craft' || game_mode == 'multi_craft')
		MAP_SCROLL_MODE = 2;
		
	draw_map(false);
	
	//register crystals
	if(game_mode == 'single_craft' || game_mode == 'multi_craft'){
		for(var e in MAPS[level-1].elements){
			if(MAPS[level-1].elements[e][0] != 'crystals') continue;
			var element = get_element_by_name(MAPS[level-1].elements[e][0]);
			MAP_CRYSTALS.push({
				id: getRandomInt(0, 999999),
				x: MAPS[level-1].elements[e][1],
				y: MAPS[level-1].elements[e][2],
				cx: MAPS[level-1].elements[e][1] + IMAGES_SETTINGS.elements[element.name].w/2,
				cy: MAPS[level-1].elements[e][2] + IMAGES_SETTINGS.elements[element.name].h/2,
				w: IMAGES_SETTINGS.elements[element.name].w,
				h: IMAGES_SETTINGS.elements[element.name].h,
				power: CRYSTAL_POWER,
				});
			}
		}
	
	var requestAnimationFrame = window.requestAnimationFrame 
				|| window.mozRequestAnimationFrame 
				|| window.webkitRequestAnimationFrame 
				|| window.msRequestAnimationFrame
				|| function(callback){ render_mode='setInterval'; setInterval(callback, 1000/25); };
	window.requestAnimationFrame = requestAnimationFrame;
	draw_interval_id = requestAnimationFrame(draw_main);

	if(game_mode == 'single_quick' || game_mode == 'multi_quick')	
		bots_interval_id = setInterval(add_bots, 1000*SOLDIERS_INTERVAl);
	level_hp_regen_id = setInterval(level_hp_regen_handler, 1000);
	level_interval_id = setInterval(tank_level_handler, 1000);
	timed_functions_id = setInterval(timed_functions_handler, 100);
	}
var images_src_n = 7;	//skip intro
var IMAGE_BACK = new Image();
var IMAGE_LOGO = new Image();
var IMAGE_MOON = new Image();
//image groups
var IMAGES_GENERAL = new Image();
var IMAGES_TANKS = new Image();
var IMAGES_BULLETS = new Image();
var IMAGES_ELEMENTS = new Image();
var IMAGES_INRO = new Image();
//images positions
var IMAGES_SETTINGS = {
	general: {
		target:	{ x:0,	y:0,	w:30,	h:30 },
		repair:	{ x:50,	y:0,	w:16,	h:16 },
		lock:		{ x:100,	y:0,	w:14,	h:20 },
		fire:		{ x:150,	y:0,	w:24,	h:32 },
		button:	{ x:200,	y:0,	w:48,	h:20 },
		explosion:	{ x:250,	y:0,	w:50,	h:50 },
		us:		{ x:300,	y:0,	w:15,	h:9 },
		ru:		{ x:350,	y:0,	w:15,	h:9 },
		ch:		{ x:400,	y:0,	w:15,	h:9 },
		level:	{ x:0,	y:50,	w:150, h:15 },
		logo_small:	{ x:0,	y:100, w:76,	h:25 },
		skill_off:	{ x:0,	y:150, w:65,	h:65 },
		skill_on:	{ x:0,	y:250, w:65,	h:65 },
		statusbar:	{ x:0,	y:350, w:800, h:128 },
		he3:	{ x:100,	y:150,w:18, h:20 },
		danger:	{ x:150,	y:50, w:16, h:16 },
		shield:	{ x:200,	y:50, w:16, h:16 },
		alert:	{ x:300,	y:50, w:16, h:16 },
		bonus:	{ x:350,	y:50, w:16, h:15 },
		bolt:	{ x:250,	y:50, w:14, h:20 },
		error:	{ x:400,	y:50, w:16, h:16 },	
		flag: 	{ x:100,	y:100, w:16, h:16 },
		},
	tanks: {
		Heavy:	{ x:0,	y:0,		w:90,	h:80 },
		Tiger:	{ x:0,	y:100,	w:90,	h:80 },
		Cruiser:	{ x:0,	y:200,	w:90,	h:80 },
		Launcher:	{ x:0,	y:300,	w:90,	h:80 },
		Stealth:	{ x:0,	y:400,	w:90,	h:80 },
		Miner:	{ x:0,	y:500,	w:90,	h:80 },
		Tech:		{ x:0,	y:600,	w:90,	h:80 },
		Truck:	{ x:0,	y:700,	w:90,	h:80 },
		Apache:	{ x:0,	y:800,	w:90,	h:80 },
		Bomber:	{ x:0,	y:900,	w:90,	h:80 },
		Soldier:	{ x:0,	y:1000,	w:20,	h:22 },
		TRex:		{ x:0,	y:1300,	w:90,	h:80 },
		Tower:		{ x:0,	y:1100,	w:90,	h:80 },
		Scout_Tower:	{ x:0,	y:1150,	w:22,	h:20 },
		SAM_Tower:	{ x:0,	y:1550,	w:90,	h:80 },
		Base:		{ x:0,	y:1200,	w:90,	h:80 },
		Factory:	{ x:0,	y:1400,	w:68,	h:56 },
		Research:	{ x:0,	y:1500,	w:50,	h:40 },
		Silo:		{ x:0,	y:1600,	w:46,	h:46 },
		},
	bullets: {
		bullet:	{ x:0,	y:0,		w:6,	h:6 }, 
		small_bullet:	{ x:0,	y:250,	w:4,	h:4 },
		missle:	{ x:0,	y:50,		w:8,	h:23 }, 
		airstrike:	{ x:0,	y:100,	w:38,	h:15 }, 
		bomb: 	{ x:0,	y:150,	w:12,	h:12 },
		plasma: { x:0,	y:200,	w:15,	h:15 },
		},
	elements: {
		fence:	{ x:0,	y:0,		w:100,h:26 }, 
		vfence:	{ x:0,	y:100,	w:26,	h:100 }, 
		mine:		{ x:0,	y:200,	w:15,	h:15 }, 
		block:	{ x:0,	y:300,	w:21,	h:21 },
		hill:	{ x:100,y:0,	w:136,	h:118 },
		rocks1:	{ x:250,y:0,	w:184,	h:108 },
		rocks2:	{ x:50,	y:150,	w:184,	h:108 },
		bones:	{ x:250,y:150,	w:136,	h:86 },
		crystals:{ x:0,y:50,	w:52,	h:44 },
		},
	}
	
function preload_all_files(){
	audio_to_preload = [
		'../sounds/click'+SOUND_EXT,
		'../sounds/main'+SOUND_EXT,
		'../sounds/shoot'+SOUND_EXT,
		'../sounds/metal'+SOUND_EXT,
		];
		
	//calculate files count
	preload_left = images_src_n + audio_to_preload.length;
	preload_total = preload_left;
	
	//preload images
	IMAGE_BACK.onload = function(){ update_preload(1); };		IMAGE_BACK.src = '../img/background.jpg?'+VERSION;	
	IMAGE_LOGO.onload = function(){ update_preload(1); };		IMAGE_LOGO.src = '../img/logo.png?'+VERSION;	
	IMAGE_MOON.onload = function(){ update_preload(1); };		IMAGE_MOON.src = '../img/moon.jpg?'+VERSION;	
	IMAGES_GENERAL.onload = function(){ update_preload(1); };	IMAGES_GENERAL.src = '../img/general.png?'+VERSION;	
	IMAGES_TANKS.onload = function(){ update_preload(1); };	IMAGES_TANKS.src = '../img/tanks.png?'+VERSION;	
	IMAGES_BULLETS.onload = function(){ update_preload(1); };	IMAGES_BULLETS.src = '../img/bullets.png?'+VERSION;	
	IMAGES_ELEMENTS.onload = function(){ update_preload(1); };	IMAGES_ELEMENTS.src = '../img/elements.png?'+VERSION;
	
	//preload sound
	for(var i in audio_to_preload){
		preload(audio_to_preload[i], 'audio');
		}
	}
//preloading files	
function preload(file, type){	
	if(type=='image' || type==undefined){
		var imageObj = new Image();
		imageObj.onload = function(){
			update_preload(10);	
			}
		imageObj.src=file;
		}
	else if(type=="audio"){	
		update_preload(1);	//preload is buggy
		try{
			var audio_object = new Audio();
			audio_object.addEventListener('canplaythrough', function(event){	/*update_preload(1);*/ }, false);
			audio_object.src = file;
			}
		catch(err){
			update_preload(1);
			}
		
		}	
	else
		alert('Error, i can not preload ['+file+'], ['+type+'] type is not suported.');
	}
//get unique id
function get_unique_id(){
	unique_id = unique_id + 1;
	return unique_id;
	}
//tank moving speed conversion
function speed2pixels(speed, time_diff){
	return speed * 1.4 * time_diff/1000;
	}
//repeat some functions in time
function timed_functions_handler(){
	//check map scrolling	//event.target.id
	if(PLACE == 'game' && MAP_SCROLL_MODE == 2 && Date.now() - mouse_last_move > 100 && mouse_inside == true){
		//move map if mouse in corners
		var gap = 50;
		var power = 50;
		if(mouse_pos[0] < gap)
			scoll_map(1, 0, power);	//left
		if(mouse_pos[0] > WIDTH_SCROLL - gap) 
			scoll_map(-1, 0, power);//right
		if(mouse_pos[1] < gap) 
			scoll_map(0, 1, power);	//up
		if(mouse_pos[1] > HEIGHT_SCROLL - gap) 
			scoll_map(0, -1, power);//down
		}
	
	//exec functions
	for(var i=0; i<timed_functions.length; i++){		
		timed_functions[i].duration = timed_functions[i].duration - 100;
		var duration = 	timed_functions[i].duration				
		if(timed_functions[i].type == 'REPEAT')
			window[timed_functions[i].function](timed_functions[i]);
		if(duration<0){
			if(timed_functions[i].type == 'ON_END')
				window[timed_functions[i].function](timed_functions[i]);
			//unregister f-tion
			timed_functions.splice(i, 1);	i--;
			}
		}
	}
//quit button - quits all possible actions
function quit_game(init_next_game){
	if(PLACE=='game' && (game_mode == 'multi_quick' || game_mode == 'multi_craft')){
		if(confirm("Do you really want to quit game?")==false)
			return false;
		}
	
	clearInterval(bots_interval_id);
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
				
		if(audio_main != undefined)
			audio_main.pause();
		
		if(game_mode == 'multi_quick' || game_mode == 'multi_craft'){
			register_tank_action('leave_game', opened_room_id, name);
			room_controller();
			}
	
		if(FS==true){
			fullscreen(false);
			PLACE = 'init';
			}
		}
	else if(PLACE == 'room'){
		if((game_mode == 'multi_quick' || game_mode == 'multi_craft') && opened_room_id != -1){
			register_tank_action('leave_room', opened_room_id, name);
			}
		opened_room_id = -1;
		}
	try{
		parent.document.getElementById("packets").innerHTML = "0/0";
		parent.document.getElementById("fps").innerHTML = "";	
		}catch(error){}
	canvas_main.clearRect(0, 0, WIDTH_APP, HEIGHT_APP);
	
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
	target_range = 0;
	ABILITIES_POS = [];
	game_mode = 'single_quick';
	last_selected = -1;
	my_tank_nr = -1;
	document.getElementById("chat_write").style.visibility = 'hidden';
	document.getElementById("chat_box").style.display = 'none';
	document.getElementById("popup").style.display="none";
	packets_used=0;
	packets_all=0;
	shift_pressed = false;
	chat_shifted=false;
	frame_time = undefined;
	intro_page = 0;
	my_team = undefined;
	map_offset = [0, 0];
	target_mode = '';
	weapons_bonus = 0;
	armor_bonus = 0;
	MAP_CRYSTALS = [];
	
	if(init_next_game != false){
		init_game(false);
		}
	}
//register some are for mouse clicks
function register_button(x, y, width, height, place, myfunction, extra, type){
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
		extra: extra,
		type: type,
		});
	}
function unregister_buttons(button_place){
	for(var i=0; i<BUTTONS.length; i++){
		if(BUTTONS[i].place == button_place){
			BUTTONS.splice(i, 1); i--;
			}
		}
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
		if(game_mode == 'single_quick' || game_mode == 'single_craft')
			init_action(level, 'R');
		else{
			ROOM = get_room_by_id(opened_room_id);
			if(ROOM.host == name){
				ROOM = get_room_by_id(opened_room_id);
				register_tank_action('start_game', opened_room_id, false, ROOM.players);
				}
			}
		}
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
		
		if(PLACE=='rooms' || PLACE=='room' || ( (game_mode == 'multi_quick' || game_mode == 'multi_craft') && (PLACE=='select' || PLACE=='game' || PLACE == 'score'))){
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
	
	var new_chat = {
		text: text,
		author: author,
		team: team,
		time: time,
		shift: shift,
		};
	CHAT_LINES.push(new_chat);
	if(CHAT_LINES.length > 17)
		CHAT_LINES.splice(0,1);	//remove first
	if(PLACE == 'room' || PLACE == 'rooms')
		update_scrolling_chat(new_chat);
	}
//controlls chat lines
function controll_chat(){
	if(CHAT_LINES.length==0) return false;
	
	//remove old
	var time = new Date();
	time = time.getTime();
	var max_time = 20000;	//20s
	if(PLACE != 'room'){
		for(var i=0; i < CHAT_LINES.length; i++){
			if(time - CHAT_LINES[i].time > max_time){
				CHAT_LINES.splice(i, 1); i--;
				}
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
			if(ROOMS.length==1)
				parent.document.title = page_title_copy + " ["+ROOMS.length+" room]";
			else if(ROOMS.length > 1)
				parent.document.title = page_title_copy + " ["+ROOMS.length+" rooms]";
			else
				parent.document.title = page_title_copy;
			}
		else if(PLACE == 'room'){
			ROOM = get_room_by_id(data);
			if(ROOM.players.length==1)
				parent.document.title = page_title_copy + " ["+ROOM.players.length+" player]";
			else
				parent.document.title = page_title_copy + " ["+ROOM.players.length+" players]";
			}
		else{
			parent.document.title = page_title_copy;
			}
		}
	catch(err){
		console.log("Error: "+err.message);
		}
	}
