//game settings
var VERSION = "1.5";			//app version
var DEBUG = false;			//show debug info
var SOCKET = ['tryunion.com', '80'];	//socket server //unionplatform.com - amazing service
var FPS = 25;				//frames per second
var settings_font = "bold 18px Helvetica";	//default font for settings buttons
var START_GAME_COUNT_SINGLE=15;		//second how much to count in singleplayer
var START_GAME_COUNT_MULTI=20;		//second how much to count in multiplayer
var WIDTH_APP = 800;			//application width
var HEIGHT_APP = 525;			//application height
var HEIGHT_STATUS_AREA = 171;		//status are height
var SOCKET_ROOM_PREFIX = 'mv_';		//unique prefix for sockets library
var MAX_SENT_PACKETS = 6000;		//max packets, that we can send to server per game
var INFO_HEIGHT = 130;			//height of information block
var STATUS_HEIGHT = 25;			//height of statusbar
var MINI_MAP_PLACE = [13, 13, 104, 104, 3];	//x, y, width, height, border width
var SKILL_BUTTON = 55;			//skill button width and height
var SCORES_INFO = [10, 40, -20, 50, 100];	//level up, kill, death, per tower, win bonus
var SOUND_EXT = '.ogg';			//default sound files extension
var LEVEL_UP_TIME = 30;			//how much seconds must pass till level up
var TOWER_HP_DAMAGE_IN_1VS1 = [0.7, 0.9];	//towers modifiers in multiplayer 1vs1
var flag_width = 15;			//flag icon width
var flag_height = 9;			//flag icon height
var SOLDIERS_INTERVAl = 30;		//pause between soldiers spawn, seconds
var MAX_ABILITY_LEVEL=20;		//max ability level
var INVISIBILITY_SPOT_RANGE=50;		//% of enemy range, if enemy comes close, invisibility wanishes.
var ABILITIES_MODE = 0;			//0=all, 1=first, 2=second, 3 = third
var APP_URL = 'http://viliusle.github.io/vl-tanks/';
var APP_EMAIL = 'www.viliusl@gmail.com';

//other global variables
var TANKS = new Array();		//tanks array
var TYPES = new Array();		//tanks types config
var BULLETS_TYPES = new Array();	//bullets types config
var BULLETS = new Array();		//tanks bullets
var MAPS = new Array();			//maps config
var ELEMENTS = new Array();		//maps elements
var COUNTRIES = new Array();		//countries
var MINES = [];				//mines
var BUTTONS = new Array();		//buttons array
var ROOMS = new Array();		//rooms array
var PLAYERS = new Array();		//players list
var opened_room_id = -1;		//active room id
var WIDTH_MAP;				//map width, if big, offset start to work (works as scroll)
var HEIGHT_MAP;				//map height, if big, offset start to work (works as scroll)
var WIDTH_SCROLL;				//visible map part width, similar to WIDTH_APP
var HEIGHT_SCROLL;			//visible map part height, = HEIGHT_APP - status bar height
var APP_SIZE_CACHE = [WIDTH_APP, HEIGHT_APP]; //original app dimensions cache
var MUTE_FX=false;			//if effects muted
var MUTE_MUSIC=false;			//if backgrond music muted
var level = 1;				//map index
var name="user-"+Math.floor(Math.random()*9999);	//user name
var my_tank_nr = -1;			//my tank type: [0,1...n]
var audio_main;				//main audio track controller
var map_offset = [0, 0];		//map offest [x ,y], < 0, this is for map scrolling, if map bigger then canvas size
var unique_id = 0;			//number for id generation
var timed_functions = [];		//timed functions array, for repeative exec.
var mouse_move_controll = false;	//if external funtion takes mouse control
var mouse_click_controll = false;	//if external funtion takes mouse clicks controll
var target_range = 0;			//targer circle range for aoe skills
var lastLoop = new Date;		//tmp var for fps
var mouse_pos = [0,0];			//current mouse position for external functions
var mouse_click_pos = [0,0];		//last mouse click position for external functions
var pre_draw_functions = [];		//extra functions executed before main draw loop
var on_click_functions = [];		//on click custom actions functions, only if mouse_click_controll=true
var game_mode = 0;			//1=single player, 2=multi player
var QUALITY = 3;			//1=low, 2=mid, 3=high
var PLACE = '';				//init, intro, settings, library, select, game, score, rooms, room, create_room
var preloaded=false;			//if all images preloaded
var preload_total=0;			//total images for preload
var preload_left=0;			//total images left for preload
var FS=false;				//fullscreen off/on
var tab_scores=false;			//show live scroes on TAB
var status_x=0;				//info bar x coordinates
var status_y=0;				//info bar y coordinates
var chat_mode=0;			//if 1, show textbox for writing
var CHAT_LINES=new Array();		//chat array lines
var MY_TANK;				//my tank
var TO_RADIANS = Math.PI/180; 		//for rotating
var MAP_SCROLL_CONTROLL = false;	//active if user scrolling map with mouse on mini map
var MAP_SCROLL_MODE = 1;		//if 1, auto scroll, if 2, no auto scroll
var room_id_to_join=-1;			//id of room, requested to join
var render_mode = 'requestAnimationFrame';	//render mode
var page_title_copy = 'Moon wars';		//copy of original title
var packets_used = 0;			//sent packets count in 1 game, there is limit...
var packets_all = 0;			//received packets count in 1 game
var shift_pressed = false;		//if shift is pressed
var chat_shifted = false;		//if chat was activated with shift
var intro_page = 0;			//intro page
var intro_enabled = 1;			//if show intro
var time_gap;				//time difference between frames

//repeative functions handlers
var draw_interval_id;			//controller for main draw loop
var level_interval_id;			//controller for level handling function
var level_hp_regen_id;			//controller for hp regen handling function
var timed_functions_id;			//controller for timed functions
var start_game_timer_id;		//controller for timer in select window
var chat_interval_id;			//controller for chat
var bots_interval_id;			//controller for adding new bots function

//canvas layers
var canvas_map = document.getElementById("canvas_map").getContext("2d");		//map
var canvas_map_sight = document.getElementById("canvas_map_sight").getContext("2d");	//sight
var canvas_backround = document.getElementById("canvas_backround").getContext("2d");	//backgrounds
var canvas_base = document.getElementById("canvas_main");
var canvas_main = canvas_base.getContext("2d");						//objects

//on exit
window.onbeforeunload = disconnect_game;

//mouse move handlers
canvas_base.addEventListener('mousemove', on_mousemove, false);
document.getElementById("canvas_backround").addEventListener('mousemove', on_mousemove_background, false);
canvas_base.addEventListener("mousewheel", MouseWheelHandler, false);
canvas_base.addEventListener("DOMMouseScroll", MouseWheelHandler, false);

//mouse click handlers
document.getElementById("canvas_backround").addEventListener('mousedown', on_mousedown_back, false);
document.getElementById("canvas_backround").addEventListener('mouseup', on_mouseup_back, false);
canvas_base.addEventListener('mousedown', on_mousedown, false);
canvas_base.addEventListener('mouseup', on_mouse_up, false);
document.oncontextmenu = function(e) {return on_mouse_right_click(e); }

//keyboard handlers
document.onkeydown = function(e) {return on_keyboard_action(e); }
document.onkeyup = function(e) {return on_keyboardup_action(e); }

//full screen handlers
document.addEventListener("fullscreenchange", full_screenchange_handler, false);
document.addEventListener("mozfullscreenchange", full_screenchange_handler, false);
document.addEventListener("webkitfullscreenchange", full_screenchange_handler, false);
