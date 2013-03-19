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
	canvas_backround.stroke();
	
	//bottom border
	canvas_backround.beginPath();
	canvas_backround.strokeStyle='#96b4a3';
	canvas_backround.moveTo(0, HEIGHT_APP);
	canvas_backround.lineTo(WIDTH_APP, HEIGHT_APP);
	canvas_backround.stroke();
	
	//buttons
	draw_mute_button();
	draw_quality_button(true);
	draw_fs_button();
	draw_quit_button();
	draw_version();
	}
//show mute button in statusbar
function draw_mute_button(){
	//clean
	canvas_backround.fillStyle = "#dbd9da";
	canvas_backround.fillRect(WIDTH_APP-21-5, HEIGHT_APP-23, 20, 17);
	
	//paint
	sound_img = new Image();
	if(muted==true)
		sound_img.src = 'img/mute.png';
	else
		sound_img.src = 'img/unmute.png';
	canvas_backround.drawImage(sound_img, WIDTH_APP-21-5, HEIGHT_APP-23);
	
	register_button(WIDTH_APP-21-5, HEIGHT_APP-23, 21, 18, '', 'mute_unmute');
	}
//show quality button in statusbar
function draw_quality_button(first_run){
	PADDING = 145;
	q_img = new Image();
	q_img.src = 'img/button.png';
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
		});
	}
//show fullscreen button in statusbar
function draw_fs_button(){
	if(PLACE != 'game' ) return false;
	PADDING = 200;
	q_img = new Image();
	q_img.src = 'img/button.png';
	canvas_backround.drawImage(q_img, WIDTH_APP-PADDING, HEIGHT_APP-23);
	
	fs_text = "Full Scr.";
	canvas_backround.fillStyle = "#8A8A8A";
	canvas_backround.font = "Normal 11px Arial";
	canvas_backround.fillText(fs_text, WIDTH_APP-PADDING+5, HEIGHT_APP-18-5+14);
	
	register_button(WIDTH_APP-PADDING, HEIGHT_APP-23, 48, 20, PLACE, function(){
		fullscreen('canvas_area');
		});
	}
//quit button in statusbar
function draw_quit_button(){
	PADDING = 90;
	quit_img = new Image();
	quit_img.src = 'img/button.png';
	canvas_backround.drawImage(quit_img, WIDTH_APP-PADDING, HEIGHT_APP-23);
	q_text = "Quit";
	canvas_backround.fillStyle = "#8A8A8A";
	canvas_backround.font = "Bold 11px Helvetica";
	canvas_backround.fillText(q_text, WIDTH_APP-PADDING+12, HEIGHT_APP-18-5+14);
	
	register_button(WIDTH_APP-PADDING, HEIGHT_APP-23, 48, 20, '', 'quit_game');
	}
//show version instatus bar
function draw_version(){
	PADDING = 10;
	canvas_backround.fillStyle = "#8A8A8A";
	canvas_backround.font = "Normal 11px Helvetica";
	canvas_backround.fillText("v"+VERSION, PADDING, HEIGHT_APP-18-5+14);
	}
//do mute or unmute on user request
function mute_unmute(){
	if(muted==false){
		muted=true;
		setCookie("muted", "1", 30);
		if(audio_main != undefined)	audio_main.pause();
		}
	else{
		muted = false;
		if(getCookie("muted") != '')	
			delCookie("muted");
		try{
			if(PLACE == 'game'){
				audio_main = document.createElement('audio');
				audio_main.setAttribute('src', 'sounds/main.ogg');
				audio_main.setAttribute('loop', 'loop');
				audio_main.play();
				}
			else if(PLACE == 'select'){
				audio_prepare = document.createElement('audio');
				audio_prepare.setAttribute('src', 'sounds/prepare.ogg');
				audio_prepare.setAttribute('loop', 'loop');
				audio_prepare.play();
				}
			else {
				audio_begin = document.createElement('audio');
				audio_begin.setAttribute('src', 'sounds/begin.ogg');
				audio_begin.setAttribute('loop', 'loop');
				audio_begin.play();
				}
			}
		catch(error){}
		}
	draw_mute_button();
	}
