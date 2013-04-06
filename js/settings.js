//check support
if(document.getElementById("canvas_map").getContex==false) alert('Error, your browser does not support canvas.');

//canvas = map, sight, backgrounds, moving objects
var canvas_map = document.getElementById("canvas_map").getContext("2d");		//map layer
var canvas_map_sight = document.getElementById("canvas_map_sight").getContext("2d");	//map sight layer
var canvas_backround = document.getElementById("canvas_backround").getContext("2d");	//main layer for backgrounds
var canvas_base = document.getElementById("canvas_main");
var canvas_main = canvas_base.getContext("2d");						//moving objects layer

//game settings
var SOCKET = ['tryunion.com', '80'];	//socket server //unionplatform.com - amazing service
var FPS = 25;				//frames per second
var settings_font = "bold 18px Helvetica";	//default font for settings buttons
var START_GAME_COUNT_SINGLE=10;		//second how much to count in singleplayer
var START_GAME_COUNT_MULTI=10;		//second how much to count in multiplayer
var WIDTH_APP = 800;			//application width
var HEIGHT_APP = 525;			//application height
var HEIGHT_STATUS_AREA = 171;		//status are height
var SOCKET_ROOM_PREFIX = 'mv_';		//unique prefix for sockets library
var MAX_SENT_PACKETS = 5000;		//max packets, that we can send to server per game
var NETWORK_PACKETS_LOG = false;	//if show sent and received packets log
var VERSION = "1.1.10";			//app version

//other global variables
var TANKS = new Array();		//tanks array
var TYPES = new Array();		//tanks types config
var BULLETS_TYPES = new Array();	//bullets types config
var BULLETS = new Array();		//tanks bullets
var MAPS = new Array();			//maps config
var ELEMENTS = new Array();		//maps elements
var BUTTONS = new Array();		//buttons array
var ROOMS = new Array();		//rooms array
var PLAYERS = new Array();		//players list
var opened_room_id = -1;		//active room id
var WIDTH_MAP;				//map width, if big, offset start to work (works as scroll)
var HEIGHT_MAP;				//map height, if big, offset start to work (works as scroll)
var WIDTH_SCROLL;			//visible map part width, similar to WIDTH_APP
var HEIGHT_SCROLL;			//visible map part height, = HEIGHT_APP - status bar height
var APP_SIZE_CACHE = [WIDTH_APP, HEIGHT_APP]; //original app dimensions cache
var muted=false;			//if sound muted
var level = 1;				//map index
var name="user-"+Math.floor(Math.random()*9999);	//user name
var me_server = true;			//if me is server
var my_tank_nr = -1;			//my tank type: [0,1...n]
var audio_main;				//main audio track controller
var map_offset = [0, 0];		//map offest [x ,y], < 0, this is for map scrolling, if map bigger then canvas size
var unique_id = 0;			//number for id generation
var preview_id = [];			//tmp array for on_mousemove f-tion
var timed_functions = [];		//timed functions array, for repeative exec.
var mouse_move_controll = false;	//if external funtion takes mouse control
var mouse_click_controll = false;	//if external funtion takes mouse clicks controll
var lastLoop = new Date;		//tmp var for fps
var mouse_pos = [0,0];			//current mouse position for external functions
var mouse_click_pos = [0,0];		//last mouse click position for external functions
var pre_draw_functions = [];		//extra functions executed before main draw loop
var on_click_functions = [];		//on click custom actions functions, only if mouse_click_controll=true
var game_mode = 0;			//1=single player, 2=multi player
var QUALITY = 3;			//1=low, 2=mid, 3=high
var PLACE = '';				//init, settings, select, game, score, rooms, room, create_room
var preloaded=false;			//if all images preloaded
var preload_total=0;			//total images for preload
var preload_left=0;			//total images left for preload
var FS=false;				//fullscreen off/on
var tab_scores=false;			//show live scroes on TAB
var status_x=0				//status bar x coordinates
var chat_mode=0;				//if 1, show textbox for writing
var CHAT_LINES=new Array();		//chat array lines
var MY_TANK;				//my tank
var TO_RADIANS = Math.PI/180; 		//for rotating
var SKILL_BUTTON = 55;			//skill button width and height
var MAP_SCROLL_CONTROLL = false;	//active if user scrolling map with mouse on mini map
var room_id_to_join=-1;			//id of room, requested to join
var render_mode = 'requestAnimationFrame';

//repeative functions handlers
var draw_interval_id;			//controller for main draw loop
var level_interval_id;			//controller for level handling function
var level_hp_regen_id;			//controller for hp regen handling function
var bots_interval_id;			//controller for adding new bots function
var timed_functions_id;			//controller for timed functions
var start_game_timer_id;		//controller for timer in select window
var chat_interval_id;			//controller for chat

//keyboard and mouse capture handlers
window.onbeforeunload = disconnect_game;
canvas_base.addEventListener('mousedown', on_mousedown, false);
document.getElementById("canvas_backround").addEventListener('mousedown', on_mousedown_back, false);
document.getElementById("canvas_backround").addEventListener('mouseup', on_mouseup_back, false);
document.getElementById("canvas_backround").addEventListener('mousemove', on_mousemove_background, false);
canvas_base.addEventListener('mousemove', on_mousemove, false);
document.onkeydown = function(e) {return on_keyboard_action(e); }

//full screen handlers
document.addEventListener("fullscreenchange", full_screenchange_handler, false);
document.addEventListener("mozfullscreenchange", full_screenchange_handler, false);
document.addEventListener("webkitfullscreenchange", full_screenchange_handler, false);
