function Suicide(TANK, descrition_only){
	if(descrition_only != undefined)
		return 'Your tank explodes and you die.';
	
	//action
	do_damage(MY_TANK, MY_TANK, 999999)
	TANK.kills = TANK.kills - 1;
	
	//return reuse
	return 1;
	}
function Nothing(TANK, descrition_only){
	if(descrition_only != undefined)
		return 'Do nothing, isn\'t it amazing?';
		
	//return reuse
	return 10000;
	}
function Soldiers(TANK, descrition_only){
	var n = 3;
	if(descrition_only != undefined)
		return 'Send 3 soldiers to help you in fight. ';
	
	//find type
	var type = '';
	for(var t in TYPES){
		if(TYPES[t].name == 'Soldier')
			type = t;
		}
	
	//add soldiers
	for(var i=0; i<n; i++){
		var tmp = new Array();
		tmp['move'] = 1;
		tmp['level'] = 1;	
		tmp['sublevel'] = 0;
		tmp['type'] = type;
		tmp['team'] = TANK.team;
		tmp['abilities_lvl'] = [1,1,1];
		tmp['sight'] = TYPES[tmp['type']].scout+TYPES[tmp['type']].size[1]/2;
		tmp['speed'] = TYPES[tmp['type']].speed;
		tmp['armor'] = TYPES[tmp['type']].armor[0];
		tmp['damage'] = TYPES[tmp['type']].damage[0];
		tmp['attack_delay'] = TYPES[tmp['type']].attack_delay;
		var width_tmp = WIDTH_MAP - TYPES[tmp['type']].size[1];
		var height_tmp = HEIGHT_MAP - TYPES[tmp['type']].size[1];
		tmp['x'] = TANK.x-30+i*30;
		tmp['y'] = TANK.y;
		tmp['id'] = 'bot'+tmp['team']+bots_row+"."+tmp['x']+"."+tmp['y'];
		if(tmp['team']=='B'){	//top
			tmp['angle'] = 180;
			tmp['fire_angle'] = 180;
			var move_path = [ [50,99] ];
			}
		else{	//bottom
			tmp['angle'] = 0; 
			tmp['fire_angle'] = 0;
			var move_path = [ [50,1] ];
			}
		tmp['hp'] = TYPES[tmp['type']].life[0];
		tmp['move_to'] = [];
		for (j in move_path){
			var move_to_tmp = new Array();
			move_to_tmp[0] = Math.floor(move_path[j][0]*width_tmp/100);
			move_to_tmp[1] = Math.floor(move_path[j][1]*height_tmp/100);
			tmp['move_to'].push(move_to_tmp);
			}
		TANKS.push(tmp);
		}
	
	//return reuse
	return 30000;
	}
