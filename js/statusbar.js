//draw statusbar
function draw_status_bar(){	
	//background
	canvas_backround.fillStyle = "#dbd9da";
	canvas_backround.fillRect (0, HEIGHT_APP-27, WIDTH_APP, 27);
	
	//top border
	canvas_backround.beginPath();
	canvas_backround.strokeStyle='#999069';
	canvas_backround.moveTo(0, HEIGHT_APP-26.5);
	canvas_backround.lineTo(WIDTH_APP, HEIGHT_APP-26.5);
	canvas_backround.lineWidth = 1;
	canvas_backround.stroke();
	
	//bottom border
	canvas_backround.beginPath();
	canvas_backround.strokeStyle='#96b4a3';
	canvas_backround.moveTo(0, HEIGHT_APP);
	canvas_backround.lineTo(WIDTH_APP, HEIGHT_APP);
	canvas_backround.stroke();
	
	//buttons
	draw_mute_music_button();
	draw_mute_fx_button();
	draw_quality_button(true);
	draw_quit_button();
	draw_fs_button();
	draw_version();
	}
//show mute music button in statusbar
function draw_mute_music_button(){
	PADDING = 55;
	
	q_img = new Image();
	q_img.src = '../img/button.png';
	canvas_backround.drawImage(q_img, WIDTH_APP-PADDING, HEIGHT_APP-23);
	
	fs_text = "Music";
	if(MUTE_MUSIC == true)
		canvas_backround.fillStyle = "#8A8A8A";
	else
		canvas_backround.fillStyle = "#196119";
	canvas_backround.font = "Bold 11px Arial";
	canvas_backround.fillText(fs_text, WIDTH_APP-PADDING+9, HEIGHT_APP-18-5+14);
	
	register_button(WIDTH_APP-PADDING, HEIGHT_APP-23, 48, 20, '', 'mute_unmute_music');
	}
//draw mute effects button in statusbar
function draw_mute_fx_button(){
	PADDING = 108;
	
	q_img = new Image();
	q_img.src = '../img/button.png';
	canvas_backround.drawImage(q_img, WIDTH_APP-PADDING, HEIGHT_APP-23);
	
	fs_text = "Sound";
	if(MUTE_FX == true)
		canvas_backround.fillStyle = "#8A8A8A";
	else
		canvas_backround.fillStyle = "#196119";
	canvas_backround.font = "Bold 11px Arial";
	canvas_backround.fillText(fs_text, WIDTH_APP-PADDING+5, HEIGHT_APP-18-5+14);
	
	register_button(WIDTH_APP-PADDING, HEIGHT_APP-23, 48, 20, '', 'mute_unmute_fx');
	}
//show quality button in statusbar
function draw_quality_button(first_run){
	PADDING = 161;
	q_img = new Image();
	q_img.src = '../img/button.png';
	canvas_backround.drawImage(q_img, WIDTH_APP-PADDING, HEIGHT_APP-23);
	
	quality_cookie = getCookie("quality");
	if(quality_cookie != '')
		QUALITY = quality_cookie;
	
	var q_text = 'E';
	if(QUALITY==1)
		q_text = "Low";
	else if(QUALITY==2)
		q_text = "Mid";
	else if(QUALITY==3)
		q_text = "High";
	
	if(PLACE=='game' && first_run==false)
		draw_map(true);
	
	canvas_backround.fillStyle = "#8A8A8A";
	canvas_backround.font = "Bold 11px Arial";
	canvas_backround.fillText(q_text, WIDTH_APP-PADDING+12, HEIGHT_APP-18-5+14);
	
	register_button(WIDTH_APP-PADDING, HEIGHT_APP-23, 48, 20, '', function(){
		QUALITY++;
		if(QUALITY==4)
			QUALITY = 1;
		setCookie("quality", QUALITY, 30);
		draw_quality_button(false);
		
		//reset tanks image cache 
		for(var i in TANKS){
			TANKS[i].cache_tank_verified = 0;
			}
		});
	}
//quit button in statusbar
function draw_quit_button(){
	PADDING = 214;
	quit_img = new Image();
	quit_img.src = '../img/button.png';
	canvas_backround.drawImage(quit_img, WIDTH_APP-PADDING, HEIGHT_APP-23);
	q_text = "Quit";
	canvas_backround.fillStyle = "#8A8A8A";
	canvas_backround.font = "Bold 11px Helvetica";
	canvas_backround.fillText(q_text, WIDTH_APP-PADDING+12, HEIGHT_APP-18-5+14);
	
	register_button(WIDTH_APP-PADDING, HEIGHT_APP-23, 48, 20, '', 'quit_game');
	}
//show fullscreen button in statusbar
function draw_fs_button(){
	if(PLACE != 'game' ) return false;
	PADDING = 267;
	
	q_img = new Image();
	q_img.src = '../img/button.png';
	canvas_backround.drawImage(q_img, WIDTH_APP-PADDING, HEIGHT_APP-23);
	
	fs_text = "Full Scr.";
	canvas_backround.fillStyle = "#8A8A8A";
	canvas_backround.font = "Normal 11px Arial";
	canvas_backround.fillText(fs_text, WIDTH_APP-PADDING+5, HEIGHT_APP-18-5+14);
	
	register_button(WIDTH_APP-PADDING, HEIGHT_APP-23, 48, 20, PLACE, function(){
		fullscreen('canvas_area');
		});
	}
//show version instatus bar
function draw_version(){
	PADDING = 10;
	canvas_backround.fillStyle = "#8A8A8A";
	canvas_backround.font = "Normal 11px Helvetica";
	canvas_backround.fillText("v"+VERSION, PADDING, HEIGHT_APP-18-5+14);
	}
//do mute or unmute music
function mute_unmute_music(){
	if(MUTE_MUSIC==false){	
		//disable sound
		MUTE_MUSIC = true;
		setCookie("mute_music", "1", 30);
		if(audio_main != undefined) audio_main.pause();
		}
	else{
		//enable sound
		MUTE_MUSIC = false;
		setCookie("mute_music", "0", 30);
		try{
			if(PLACE == 'game'){
				audio_main = document.createElement('audio');
				audio_main.setAttribute('src', '../sounds/main'+SOUND_EXP);
				audio_main.setAttribute('loop', 'loop');
				audio_main.play();
				}
			}
		catch(error){}
		}
	draw_mute_music_button();
	}
//do mute or unmute effects
function mute_unmute_fx(){
	if(MUTE_FX==false){		
		//disable sound
		MUTE_FX = true;
		setCookie("mute_fx", "1", 30);
		}
	else{			
		//enable sound
		MUTE_FX = false;
		setCookie("mute_fx", "0", 30);
		}
	draw_mute_fx_button();
	}
