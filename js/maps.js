var MAP;
//draw main map
function draw_map(map_only){
	if(map_only==false){
		//clear backround
		canvas_backround.clearRect(0, 0, WIDTH_APP, HEIGHT_APP);
		
		//fill gap
		if(WIDTH_MAP < WIDTH_APP){
			canvas_backround.fillStyle = "#bab7ae";
			canvas_backround.fillRect(WIDTH_MAP, 0, WIDTH_APP-WIDTH_MAP, HEIGHT_MAP);
			}
		
		//fill map with grey
		canvas_map.fillStyle = "#bab7ae";
		canvas_map.fillRect(0, 0, WIDTH_MAP, HEIGHT_MAP);
		status_x = 0;
		if(FS==true){
			status_x = round((WIDTH_APP-800)/2);
			if(status_x<0) status_x=0;
			}
		status_y = HEIGHT_APP-INFO_HEIGHT-STATUS_HEIGHT;
		}
	
	//background
	backround_width = 400;
	backround_height = 400;
	for(var i=0; i<Math.ceil(MAPS[level-1].height/backround_height); i++){
		for(var j=0; j<Math.ceil(MAPS[level-1].width/backround_width); j++)
			canvas_map.drawImage(IMAGE_MOON, 0+j*backround_width, 0+i*backround_height);
		}
	
	//elements
	for(var e in MAPS[level-1].elements){
		var element = get_element_by_name(MAPS[level-1].elements[e][0]);
		element.w = IMAGES_SETTINGS.elements[element.name].w;
		element.h = IMAGES_SETTINGS.elements[element.name].h;
		x = MAPS[level-1].elements[e][1];
		y = MAPS[level-1].elements[e][2];
		if(element.w<30)	x = x - round(element.w/2);
		if(element.h<30)	y = y - round(element.h/2);
		max_w = element.w;
		if(MAPS[level-1].elements[e][3]!=0)
			max_w = MAPS[level-1].elements[e][3];
		max_h = element.h;
		if(MAPS[level-1].elements[e][4]!=0)
			max_h = MAPS[level-1].elements[e][4];
		draw_image(canvas_map, element.name, x, y, max_w, max_h, undefined);
		}
	
	if(map_only==false)
		draw_infobar();
	
	//darken all
	darken_map();
	}
//darken map - using shadows
function darken_map(){
	try{
		imgData = canvas_map.getImageData(0, 0, WIDTH_MAP, HEIGHT_MAP);
		pix = imgData.data;
		dark_weight = 15;
		for (var i = 0, n = pix.length; i < n; i += 4) {
			if(pix[i+0]>dark_weight)	pix[i+0] = pix[i+0] - dark_weight;
			if(pix[i+1]>dark_weight)	pix[i+1] = pix[i+1] - dark_weight;
			if(pix[i+2]>dark_weight)	pix[i+2] = pix[i+2] - dark_weight;
		}
		canvas_map.putImageData(imgData, 0, 0);
		}
	catch(err){
		console.log("ERROR: "+err.message);
		}
	}
//visible tank area in map are light
//there is some ugly bug for some firefox browsers - so they can use lighten_pixels_all instead by increasing game quality.
function lighten_pixels(tank){
	if(QUALITY !=3) return false;
	if(PLACE != 'game') return false;
	if(tank.team != MY_TANK.team) return false;
	if(tank.constructing != undefined) return false;	
	
	var xx = round(tank.cx() + map_offset[0]);
	var yy = round(tank.cy() + map_offset[1]);
	
	canvas_map_sight.beginPath();
	canvas_map_sight.save();
	
	var sight_range = tank.sight + tank.width()/2;
	canvas_map_sight.arc(xx, yy, sight_range, 0 , 2 * Math.PI, true);
	canvas_map_sight.clip(); 
	canvas_map_sight.clearRect(xx-sight_range, yy-sight_range, sight_range*2, sight_range*2);
	
	canvas_map_sight.restore();
	}
//visible all tanks areas are light
function lighten_pixels_all(tank){
	if(QUALITY != 2) return false;
	if(PLACE != 'game') return false;
	
	canvas_map_sight.save();
	canvas_map_sight.globalCompositeOperation = 'destination-out';	// this does the trick
	for(var i in TANKS){
		if(TANKS[i].team != MY_TANK.team) continue;
		if(TANKS[i].constructing != undefined) continue;
		
		var xx = round(TANKS[i].cx() + map_offset[0]);
		var yy = round(TANKS[i].cy() + map_offset[1]);
		canvas_map_sight.beginPath();
		canvas_map_sight.arc(xx, yy, TANKS[i].sight + TANKS[i].width()/2, 0 , 2 * Math.PI, true);
		canvas_map_sight.fill();
		}
	canvas_map_sight.restore();	
	}
//cancel manuel map move controlls
function move_to_place_reset(){
	MAP_SCROLL_CONTROLL=false;
	auto_scoll_map();
	}
//move map by tank position
function auto_scoll_map(){
	
	//calc
	map_offset[0] = -1 * MY_TANK.cx() + WIDTH_SCROLL/2;
	map_offset[1] = -1 * MY_TANK.cy() + HEIGHT_SCROLL/2;
	
	//check
	if(map_offset[0]>0)	map_offset[0]=0;
	if(map_offset[1]>0)	map_offset[1]=0;
	if(map_offset[0] < -1*(WIDTH_MAP - WIDTH_SCROLL))
		map_offset[0] = -1*(WIDTH_MAP - WIDTH_SCROLL);
	if(map_offset[1] < -1*(HEIGHT_MAP - HEIGHT_SCROLL))
		map_offset[1] = -1*(HEIGHT_MAP - HEIGHT_SCROLL);
			
	//scroll
	document.getElementById("canvas_map").style.marginTop =  map_offset[1]+"px";
	document.getElementById("canvas_map").style.marginLeft = map_offset[0]+"px";
	}
var maps_positions = [];
//redraw actions in selecting tank/map window
function show_maps_selection(canvas_this, top_height, can_select_map){
	if(game_mode == 2) return false;
	var gap = 8;
	var button_width = 90;
	var button_height = 80;
	maps_positions = [];
	
	//clear name area
	canvas_backround.drawImage(IMAGE_BACK, 0, top_height-5, WIDTH_APP, 110, 0, top_height-5, WIDTH_APP, 110);
	
	for (i in MAPS){
		var padding_left = 15;
		if(PLACE == 'library')
			padding_left = 10;	
		//background
		if(level - 1==i)
			canvas_this.fillStyle = "#8fc74c";	//selected
		else
			canvas_this.fillStyle = "#cccccc";
		canvas_this.strokeStyle = "#196119";
		roundRect(canvas_this, padding_left+i*(button_width+gap), top_height, button_width, button_height, 5, true);
		
		//calcuate mini-size
		mini_w = (button_width-2)/MAPS[i].width;
		mini_h = (button_height-2)/MAPS[i].height;
		var pos1 = padding_left+i*(button_width+gap);
		var pos2 = top_height;
		
		//paint towers
		msize = 3;
		for (ii in MAPS[i].towers){
			if(game_mode == 3 && MAPS[i].towers[ii][3] != 'Base') continue;
			if(MAPS[i].towers[ii][0]=="B")
				canvas_this.fillStyle = "#0000aa";
			else
				canvas_this.fillStyle = "#b12525";
			tank_x = pos1 + round((MAPS[i].towers[ii][1]) * button_width / round(MAPS[i].width));
			tank_y = pos2 + round((MAPS[i].towers[ii][2]) * button_height /(MAPS[i].height));
			canvas_this.fillRect(tank_x, tank_y, msize, msize);
			}
		
		//elements
		for(var e in MAPS[i].elements){
			var element = get_element_by_name(MAPS[i].elements[e][0]);
			element.w = IMAGES_SETTINGS.elements[element.name].w;
			element.h = IMAGES_SETTINGS.elements[element.name].h;
			x = MAPS[i].elements[e][1];
			y = MAPS[i].elements[e][2];
			if(element.w<30)	x = x - round(element.w/2);
			if(element.h<30)	y = y - round(element.h/2);
			max_w = element.w;
			if(MAPS[i].elements[e][3]!=0)
				max_w = MAPS[i].elements[e][3];
			max_h = element.h;
			if(MAPS[i].elements[e][4]!=0)
				max_h = MAPS[i].elements[e][4];
			//minimize
			max_w = Math.ceil(max_w*button_width/MAPS[i].width);
			max_h = Math.ceil(max_h*button_height/MAPS[i].height);
			x = pos1 + Math.ceil(x*button_width/MAPS[i].width);
			y = pos2 + Math.ceil(y*button_height/MAPS[i].height);
			//draw
			if(element.alt_color != undefined){
				canvas_this.fillStyle = element.alt_color;
				canvas_this.fillRect(x, y, max_w, max_h);
				}
			}
			
		//name
		if(level - 1==i)
			canvas_this.fillStyle = "#c10000";
		else
			canvas_this.fillStyle = "#196119";
		canvas_this.font = "bold 14px Helvetica";
		var letters_width = canvas_this.measureText(MAPS[i].name).width;
		var text_padding_left = Math.round((button_width-letters_width)/2);
		if(text_padding_left<0) text_padding_left=0;
		canvas_this.fillText(MAPS[i].name, padding_left+i*(button_width+gap)+text_padding_left, top_height+1+button_height+gap+10);
		
		if(can_select_map==true){
			//save position
			var tmp = new Array();
			tmp['x'] = padding_left+i*(button_width+gap)+1;
			tmp['y'] = top_height+1;
			tmp['width'] = button_width;
			tmp['height'] = button_height;
			tmp['title'] = MAPS[i].name;
			tmp['index'] = i;
			tmp['top_height'] = top_height-18*2;
			maps_positions.push(tmp);
			
			register_button(tmp['x'], tmp['y'], tmp['width'], tmp['height'], PLACE, function(mouseX, mouseY){
				for (i in maps_positions){
					if(mouseX > maps_positions[i].x && mouseX < maps_positions[i].x+maps_positions[i].width){
						if(mouseY > maps_positions[i].y && mouseY < maps_positions[i].y+maps_positions[i].height){
							//we have click on map
							level = 1+parseInt(maps_positions[i].index); 
							show_maps_selection(canvas_backround, top_height, true);
							if(PLACE == 'library')
								draw_library_maps();
							}
					
						}
					}
				});
			}
		}
	}
//return map element info by name
function get_element_by_name(name){
	for(var i in ELEMENTS){
		if(ELEMENTS[i].name == name){
			return ELEMENTS[i];
			}
		}
	return false;
	}
//scroll map in manual scroll mode
function scoll_map(xx, yy){
	if(MAP_SCROLL_MODE==1) return false;
	
	var step = 50;
	
	//calc
	map_offset[0] = map_offset[0] + xx * step;
	map_offset[1] = map_offset[1] + yy * step;
	
	//check limits
	if(map_offset[0]>0)	map_offset[0]=0;
	if(map_offset[1]>0)	map_offset[1]=0;
	if(map_offset[0] < -1*(WIDTH_MAP - WIDTH_SCROLL))
		map_offset[0] = -1*(WIDTH_MAP - WIDTH_SCROLL);
	if(map_offset[1] < -1*(HEIGHT_MAP - HEIGHT_SCROLL))
		map_offset[1] = -1*(HEIGHT_MAP - HEIGHT_SCROLL);
			
	//scroll
	document.getElementById("canvas_map").style.marginTop =  map_offset[1]+"px";
	document.getElementById("canvas_map").style.marginLeft = map_offset[0]+"px";
	}
