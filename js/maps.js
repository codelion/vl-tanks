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
			status_x = round((WIDTH_APP-700)/2);
			if(status_x<0) status_x=0;
			}
		status_y = HEIGHT_APP-150-25;
		}
	
	try{
		MAP = eval(MAPS[level-1]['map'].toSource());
		}
	catch(err){
		MAP = MAPS[level-1]['map'];
		}
	var grass_begun = false;	
	for(var i=0; i<MAP.length; i++){
		for(var j=0; j<MAP[i].length; j++){
			img = '';
			img = MAP[i][j]+'.png';
			
			if(img != ''){
				if(MAP[i][j] == '0'){	//smart grass
					if(grass_begun == true && MAPS[level-1]['map_grass']=='big')
						continue;
					grass_begun = true;
					if(MAPS[level-1]['map_grass']=='big')
						img = 'grass-all.jpg';
					}
				var img_texture = new Image();
				img_texture.src = 'img/map/'+img;
				canvas_map.drawImage(img_texture, j*block_width, i*block_height);
				}
			}
		}
	//status bar
	if(map_only==false){
		//grey background
		canvas_backround.fillRect(0, status_y, WIDTH_APP, 150);
		
		//status bar
		canvas_backround.fillStyle = "#dadada";
		canvas_backround.fillRect(0, status_y+150, WIDTH_APP, 21+5);
		
		//backgrond image
		var img = new Image();
		img.src = 'img/statusbar.png';
		canvas_backround.drawImage(img, status_x, status_y);
		
		//tank icon area in status bar
		if(TYPES[MY_TANK.type].preview != undefined){
			img2 = new Image();
			img2.src = "img/tanks/"+TYPES[MY_TANK.type].name+'/'+TYPES[MY_TANK.type].preview;
			canvas_backround.drawImage(img2, status_x+135-5, status_y+45-5, 81, 81);
			}
		
		canvas_backround.fillStyle = "#333333";
		canvas_backround.font = "bold 12px Verdana";	
		canvas_backround.fillText(TYPES[MY_TANK.type].name, status_x+140, status_y+30);
		canvas_backround.fillStyle = "#555555";
		canvas_backround.fillText(name, status_x+140, status_y+130);
		
		canvas_backround.fillStyle = "#dadada";
		canvas_backround.fillRect(0, HEIGHT_APP-25, 700, 25);
		
		canvas_backround.fillStyle = "#9a9377";
		canvas_backround.fillRect(0, HEIGHT_APP-25, 700, 1);
		
		draw_status_bar();
		
		redraw_tank_stats();
		redraw_tank_abilities();
		
		//ability buttons
		/*i=0;
		register_button(ABILITIES_POS[i].x, ABILITIES_POS[i].y, ABILITIES_POS[i].width, ABILITIES_POS[i].height, PLACE, function(qqq){
			do_ability(ABILITIES_POS[0].nr, MY_TANK);
			});
		i++;
		register_button(ABILITIES_POS[i].x, ABILITIES_POS[i].y, ABILITIES_POS[i].width, ABILITIES_POS[i].height, PLACE, function(qqq){
			do_ability(ABILITIES_POS[1].nr, MY_TANK);
			});
		i++;
		register_button(ABILITIES_POS[i].x, ABILITIES_POS[i].y, ABILITIES_POS[i].width, ABILITIES_POS[i].height, PLACE, function(qqq){
			do_ability(ABILITIES_POS[2].nr, MY_TANK);
			});
		
		//ability upgrade buttons
		i=0;
		register_button(ABILITIES_UPGRADE_POS[i].x, ABILITIES_UPGRADE_POS[i].y, ABILITIES_UPGRADE_POS[i].width, ABILITIES_UPGRADE_POS[i].height, PLACE, function(qqq){
			upgrade_ability(ABILITIES_UPGRADE_POS[0].nr, MY_TANK);
			});
		i++;
		register_button(ABILITIES_UPGRADE_POS[i].x, ABILITIES_UPGRADE_POS[i].y, ABILITIES_UPGRADE_POS[i].width, ABILITIES_UPGRADE_POS[i].height, PLACE, function(qqq){
			upgrade_ability(ABILITIES_UPGRADE_POS[1].nr, MY_TANK);
			});
		i++;
		register_button(ABILITIES_UPGRADE_POS[i].x, ABILITIES_UPGRADE_POS[i].y, ABILITIES_UPGRADE_POS[i].width, ABILITIES_UPGRADE_POS[i].height, PLACE, function(qqq){
			upgrade_ability(ABILITIES_UPGRADE_POS[2].nr, MY_TANK);
			});*/
		}
	//darken all
	darken_map();
	}
//mini map in status bar
function redraw_mini_map(){
	//clear mini map
	status_y = HEIGHT_APP-150-25;
	
	canvas_backround.fillStyle = "#d5d5d5";
	canvas_backround.fillRect(status_x+20-8, status_y+17-5, 70+17, 116+10+2);
	
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.fillRect(status_x+20, status_y+17, 70, 116);
	
	//repaint mini map blocks
	mini_w = 70/MAPS[level-1]['map'][0].length;	//Math.round(70/11);
	mini_h = 116/MAPS[level-1]['map'].length;
	
	canvas_backround.fillStyle = "#8c8c8c";
	canvas_backround.fillRect(
		status_x+20-map_offset[0]*70/WIDTH_MAP, 
		status_y+17-map_offset[1]*116/HEIGHT_MAP, 
		WIDTH_SCROLL*70/WIDTH_MAP, 
		HEIGHT_SCROLL*116/HEIGHT_MAP
		);
	
	//repaint mini map
	for(var i=0; i<MAP.length; i++){
		for(var j=0; j<MAP[i].length; j++){
			img = '';
			if(MAP[i][j] == '8') img = '';
			else img = MAP[i][j]+'.png';
			if(img != ''){
				//mini map - wall
				if(MAP[i][j] == 2){
					canvas_backround.fillStyle = "#666666";
					canvas_backround.fillRect(status_x+20+j*mini_w, status_y+17+Math.round(i*mini_h), mini_w, mini_h);
					}
				//mini map - base or cannon
				if(MAP[i][j] == 9 || MAP[i][j] == 3){
					canvas_backround.fillStyle = "#0000aa";
					canvas_backround.fillRect(status_x+20+j*mini_w, status_y+17+Math.round(i*mini_h), mini_w, mini_h);
					}
				}
			}
		}
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
//visible area in map are light
function lighten_pixels(tank){
	if(QUALITY==1) return false;
	if(tank.team != MY_TANK.team) return false;
			
	var half_size = round(TYPES[tank.type].size[1]/2);
	var xx = round(tank.x+map_offset[0]+half_size);
	var yy = round(tank.y+map_offset[1]+half_size);
	
	canvas_map_sight.beginPath();
	canvas_map_sight.save();
	
	canvas_map_sight.arc(xx,yy, tank.sight, 0 , 2 * Math.PI, true);
	canvas_map_sight.clip(); 
	canvas_map_sight.clearRect(xx-tank.sight, yy-tank.sight, tank.sight*2, tank.sight*2);
	
	canvas_map_sight.restore();  
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
	var selected_block_padding=2;
	
	maps_positions = [];
	
	//clear name ara
	img = new Image();
	img.src = 'img/cc2.jpg';
	canvas_backround.drawImage(img, 0, top_height+button_height, WIDTH_APP, 30, 0, top_height+button_height, WIDTH_APP, 30);
	
	for (i in MAPS){
		if(level - 1==i){
			//selected - show border
			canvas_this.fillStyle = "#ca0000";
			canvas_this.fillRect(15+i*(81+gap)-selected_block_padding, top_height-selected_block_padding, button_width+selected_block_padding*2, button_width+selected_block_padding*2);
			}
		else{
			//nto selected
			canvas_this.fillStyle = "#cccccc";
			canvas_this.fillRect(15+i*(81+gap)-selected_block_padding, top_height-selected_block_padding, button_width+selected_block_padding*2, button_width+selected_block_padding*2);
			}
	
		//background
		canvas_this.fillStyle = "#cccccc";
		canvas_this.fillRect(15+i*(81+gap)+1, top_height+1, 79, 79);
		
		//calcuate mini-size
		mini_w = (button_width-2)/MAPS[i]['map'][0].length;
		mini_h = (button_height-2)/MAPS[i]['map'].length;
		
		//paint mini map
		var pos1 = 15+i*(81+gap)+Math.floor((81-70)/2)-5;
		var pos2 = top_height+Math.floor((81-70)/2)-5;
		for(var ii=0; ii<MAPS[i]['map'].length; ii++){
			for(var jj=0; jj<MAPS[i]['map'][i].length; jj++){
				img = '';
				img = MAPS[i]['map'][ii][jj]+'.png';	
				//mini map - grass
				if(MAPS[i]['map'][ii][jj] == 0){
					canvas_this.fillStyle = "#ffffff";
					canvas_this.fillRect(pos1+1+Math.ceil(jj*mini_w), pos2+1+Math.ceil(ii*mini_h), Math.ceil(mini_w), Math.ceil(mini_h));
					}
				//mini map - rock
				if(MAPS[i]['map'][ii][jj] == 1){
					canvas_this.fillStyle = "#b2aea2";
					//do nothing...
					}
				//mini map - wall
				if(MAPS[i]['map'][ii][jj] == 2){
					canvas_this.fillStyle = "#666666";
					canvas_this.fillRect(pos1+1+Math.ceil(jj*mini_w), pos2+1+Math.ceil(ii*mini_h), Math.ceil(mini_w), Math.ceil(mini_h));
					}
				}
			}
		
		//paint towers
		msize = 3;
		for (ii in MAPS[i].towers){
			img = '';
			//mini map - grass
			if(MAPS[i].towers[ii][0]=="B")
				canvas_this.fillStyle = "#0000aa";
			else
				canvas_this.fillStyle = "#b12525";
			canvas_this.fillRect(pos1+1+Math.ceil(MAPS[i].towers[ii][1]*(button_width-2-msize)/100), pos2+1+Math.ceil(MAPS[i].towers[ii][2]*(button_height-2-msize)/100), msize, msize);
			}
			
		//corners
		/*var img_tmp = new Image();
		img_tmp.src = 'img/general.png';
		canvas_this.drawImage(img_tmp, 15+i*(81+gap), top_height);*/
		
		//name
		var padding_left = Math.round((button_width-letter_width*MAPS[i].name.length)/2);
		canvas_this.fillStyle = "#000000";
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
		}
	}
function prepare_maps(){
	for(var m in MAPS){
		for(var j in MAPS[m].map){
			var strings = MAPS[m].map[j].toString();
			MAPS[m].map[j] = [];
			for (var i=0; i<strings.length; i++){
				MAPS[m].map[j].push(strings[i]);
				}
			}
		}
	}
