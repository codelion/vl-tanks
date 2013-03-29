function Soldiers(TANK, descrition_only){
	var n = 3;
	if(descrition_only != undefined)
		return 'Send '+n+' soldiers to help you in fight. ';
	
	add_soldiers('Soldier', n, TANK.team, TANK.level, TANK.x, TANK.y);
	
	//return reuse
	return 30000;
	}
function Nothing(TANK, descrition_only){
	if(descrition_only != undefined)
		return 'Do nothing, isn\'t it amazing?';
		
	//return reuse
	return 10000;
	}
function Suicide(TANK, descrition_only){
	if(descrition_only != undefined)
		return 'Your tank explodes and you die.';
	
	//action
	do_damage(MY_TANK, MY_TANK, 999999)
	TANK.kills = TANK.kills - 1;
	
	//return reuse
	return 1;
	}
