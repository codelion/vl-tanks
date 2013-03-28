function Suicide(TANK, descrition_only){
	if(descrition_only != undefined)
		return 'Your tank explodes and you die.';
	
	//action
	do_damage(MY_TANK, MY_TANK, 999999)
	TANK.kills = TANK.kills - 1;
	
	//return reuse
	return 1;
	}
