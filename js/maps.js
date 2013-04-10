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
	var backround_height;
	var background_elem = get_element_by_name('background');
	if(background_elem==false)
		alert("ERROR: missing element 'background' config in draw_map().");
	backround_width = background_elem.size[0];
	backround_height = background_elem.size[1];
	var img_texture = new Image();
	img_texture.src = '../img/map/moon.jpg';
	img_texture.onload = function(){	//on background load
		for(var i=0; i<Math.ceil(MAPS[level-1].height/backround_height); i++){
			for(var j=0; j<Math.ceil(MAPS[level-1].width/backround_width); j++){
				var img_texture = new Image();
				img_texture.src = '../img/map/moon.jpg';
				canvas_map.drawImage(img_texture, 0+j*backround_width, 0+i*backround_height);
				}
			}
		
		//elements
		var img_wall = new Image();
		img_wall.src = '../img/map/fence.png';
		img_wall.onload = function(){	//on wall load
			for(var e in MAPS[level-1].elements){
				var element = get_element_by_name(MAPS[level-1].elements[e][0]);
				x = MAPS[level-1].elements[e][1];
				y = MAPS[level-1].elements[e][2];
				if(element.size[0]<30)	x = x - round(element.size[0]/2);
				if(element.size[1]<30)	y = y - round(element.size[1]/2);
				max_w = element.size[0];
				if(MAPS[level-1].elements[e][3]!=0)
					max_w = MAPS[level-1].elements[e][3];
				max_h = element.size[1];
				if(MAPS[level-1].elements[e][4]!=0)
					max_h = MAPS[level-1].elements[e][4];
					
				var img_element = new Image();
				img_element.src = '../img/map/'+element.file;
				canvas_map.drawImage(img_element, 0, 0, max_w, max_h, x, y, max_w, max_h);
				}
			}
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
//there is some ugly bug for some firefox browsers - so they can use lighten_pixels_all insted by increasing app quality.
function lighten_pixels(tank){
	if(QUALITY !=3) return false;
	if(tank.team != MY_TANK.team) return false;
			
	var half_size = round(TYPES[tank.type].size[1]/2);
	var xx = round(tank.x+map_offset[0]+half_size);
	var yy = round(tank.y+map_offset[1]+half_size);
	
	canvas_map_sight.beginPath();
	canvas_map_sight.save();
	
	canvas_map_sight.arc(xx, yy, tank.sight, 0 , 2 * Math.PI, true);
	canvas_map_sight.clip(); 
	canvas_map_sight.clearRect(xx-tank.sight, yy-tank.sight, tank.sight*2, tank.sight*2);
	
	canvas_map_sight.restore();
	}
//visible all tanks areas are light
function lighten_pixels_all(tank){
	if(QUALITY != 2) return false;
	
	canvas_map_sight.save();
	canvas_map_sight.globalCompositeOperation = 'destination-out';	// this does the trick
	for(var i in TANKS){
		if(TANKS[i].team != MY_TANK.team) continue;
		
		var half_size = round(TYPES[TANKS[i].type].size[1]/2);
		var xx = round(TANKS[i].x+map_offset[0]+half_size);
		var yy = round(TANKS[i].y+map_offset[1]+half_size);
		canvas_map_sight.beginPath();
		canvas_map_sight.arc(xx, yy, TANKS[i].sight, 0 , 2 * Math.PI, true);
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
	var tank_size_half = round(TYPES[MY_TANK.type].size[1]/2);
		
	//calc
	map_offset[0] = -1 * (MY_TANK.x+tank_size_half) + WIDTH_SCROLL/2;
	map_offset[1] = -1 * (MY_TANK.y+tank_size_half) + HEIGHT_SCROLL/2;
	
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
	var button_width = 81;
	var button_height = 81;
	var gap = 10;
	var letter_height = 8;
	var letter_width = 9;
	var selected_block_padding=0;
	
	maps_positions = [];
	
	//clear name ara
	img = new Image();
	img.src = '../img/background.jpg';
	canvas_backround.drawImage(img, 0, top_height-5, WIDTH_APP, 110, 0, top_height-5, WIDTH_APP, 110);
	
	for (i in MAPS){
		//background
		canvas_this.fillStyle = "#cccccc";
		canvas_this.fillRect(15+i*(button_width+gap)+1, top_height+1, (button_width-2), (button_width-2));
		
		//calcuate mini-size
		mini_w = (button_width-2)/MAPS[i].width;
		mini_h = (button_height-2)/MAPS[i].height;
		var pos1 = 15+i*(button_width+gap)+Math.floor((button_width-70)/2)-5;
		var pos2 = top_height;
		
		//paint towers
		msize = 3;
		for (ii in MAPS[i].towers){
			if(MAPS[i].towers[ii][0]=="B")
				canvas_this.fillStyle = "#0000aa";
			else
				canvas_this.fillStyle = "#b12525";
			canvas_this.fillRect(pos1+1+Math.ceil(MAPS[i].towers[ii][1]*(button_width-2-msize)/100), pos2+1+Math.ceil(MAPS[i].towers[ii][2]*(button_height-2-msize)/100), msize, msize);
			}
		
		//elements
		for(var e in MAPS[i].elements){
			var element = get_element_by_name(MAPS[i].elements[e][0]);
			x = MAPS[i].elements[e][1];
			y = MAPS[i].elements[e][2];
			if(element.size[0]<30)	x = x - round(element.size[0]/2);
			if(element.size[1]<30)	y = y - round(element.size[1]/2);
			max_w = element.size[0];
			if(MAPS[i].elements[e][3]!=0)
				max_w = MAPS[i].elements[e][3];
			max_h = element.size[1];
			if(MAPS[i].elements[e][4]!=0)
				max_h = MAPS[i].elements[e][4];
			//minimize
			max_w = Math.ceil(max_w*button_width/MAPS[i].width);
			max_h = Math.ceil(max_h*button_height/MAPS[i].height);
			x = pos1 + Math.ceil(x*button_width/MAPS[i].width);
			y = pos2 + Math.ceil(y*button_height/MAPS[i].height);
			//draw
			canvas_this.fillStyle = element.alt_color;
			canvas_this.fillRect(x, y, max_w, max_h);
			}
			
		//name
		var padding_left = Math.round((button_width-letter_width*MAPS[i].name.length)/2);
		if(level - 1==i)
			canvas_this.fillStyle = "#c10000";
		else
			canvas_this.fillStyle = "#196119";
		canvas_this.font = "bold 14px Helvetica";
		canvas_this.fillText(MAPS[i].name, 15+i*(button_width+gap)+padding_left, top_height+1+button_height+gap+10);
		
		if(can_select_map==true){
			//save position
			var tmp = new Array();
			tmp['x'] = 15+i*(81+gap)+1;
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
							}
					
						}
					}
				});
			}
		if(level - 1==i)	//selected - show border
			canvas_this.strokeStyle = "#ff0000";
		else			//not selected
			canvas_this.strokeStyle = "#196119";
		roundRect(canvas_this, 15+i*(81+gap)-selected_block_padding, top_height-selected_block_padding, button_width+selected_block_padding*2, button_width+selected_block_padding*2, 4, false, true);
		}
	}
function get_element_by_name(name){
	for(var i in ELEMENTS){
		if(ELEMENTS[i].name == name){
			return ELEMENTS[i];
			}
		}
	return false;
	}
function prepare_maps(){
	//for(var m in MAPS){
	//	}
	}
