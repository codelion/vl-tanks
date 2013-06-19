ELEMENTS.push({	name: 'fence',	alt_color: '#4e4b44',	collission: true,	alpha: 1	});
ELEMENTS.push({	name: 'vfence',	alt_color: '#4e4b44',	collission: true,	alpha: 1	});
ELEMENTS.push({	name: 'hill',				collission: true,	alpha: 1	});
ELEMENTS.push({	name: 'rocks1',				collission: true,	alpha: 1	});
ELEMENTS.push({	name: 'rocks2',				collission: true,	alpha: 1	});
ELEMENTS.push({	name: 'bones',				collission: false,	alpha: 0.7	});
ELEMENTS.push({	name: 'crystals',			collission: true,	alpha: 0.8	});	

//====== Main ==================================================================

MAPS.push({
	name: "Main",
	width: 800,
	height: 1000,
	team_allies: 3,
	team_enemies: 3,
	description: "Default map balanced for all situations.",
	towers: [
			//team x,	 y, 	name
			['B',	400,	60,	'Base'],
			['B',	250,	150,	'Tower'],
			['B',	550,	150,	'Tower'],
			['B',	200,	350,	'Tower'],
			['B',	600,	350,	'Tower'],
			['R',	200,	650,	'Tower'],
			['R',	600,	650,	'Tower'],
			['R',	250,	850,	'Tower'],
			['R',	550,	850,	'Tower'],
			['R',	400,	940,	'Base'],
		],
	elements: [
			//name, 	x,	y,   max_width,	max_height
			['fence', 	100,	200,	50,	0],
			['fence', 	150,	200,	0,	0],
			['fence', 	250,	200,	0,	0],
			['fence', 	450,	200,	0,	0],
			['fence', 	550,	200,	0,	0],
			['fence', 	650,	200,	50,	0],
			['fence', 	100,	800,	50,	0],
			['fence', 	150,	800,	0,	0],
			['fence', 	250,	800,	0,	0],
			['fence', 	450,	800,	0,	0],
			['fence', 	550,	800,	0,	0],
			['fence', 	650,	800,	50,	0],
			['rocks1', 	-80,	350,	0,	0],
			['rocks2', 	700,	550,	0,	0],
			['bones', 	350,	450,	0,	0],
			['hill', 	340,	10,	0,	0],
			['hill', 	340,	900,	0,	0],
		],
	bots: [
			['B',	35,	1,	[[5, 18],[25,50],[25,70],[5,82], [45,99]] ],
			['B',	50,	8,	[[50,99]] ],
			['B',	65,	1,	[[95,18],[75,50],[75,70],[95,82],[55,99]] ],
			['R',	35,	99,	[[5, 82],[25,50],[25,30],[5,18],[45,1]] ],
			['R',	50,	92,	[[50,1]] ],
			['R',	65,	99,	[[95,82],[75,50],[75,30],[95,18],[55,1]] ],
		],
	});

//====== Labyrinth =============================================================

MAPS.push({
	name: "Labyrinth",
	width: 800,
	height: 1000,
	team_allies: 3,
	team_enemies: 3,
	description: "Difficult map with lots of collisions. Beware of air units here! ",
	towers: [
			//team x,	 y, 	name
			['B',	400,	60,	'Base'],
			['B',	400,	150,	'Tower'],
			['B',	150,	250,	'Tower'],
			['R',	150,	750,	'Tower'],
			['R',	400,	850,	'Tower'],
			['R',	400,	940,	'Base'],
		],
	elements: [
			//name, 	x,	y,   max_width,	max_height
			['fence', 	0,	300,	0,	0],
			['fence', 	100,	300,	0,	0],
			['fence', 	200,	300,	0,	0],
			['fence', 	300,	300,	0,	0],
			['fence', 	400,	300,	0,	0],
			['fence', 	500,	300,	0,	0],
			['fence', 	600,	300,	0,	0],
			['fence', 	100,	500,	0,	0],
			['fence', 	200,	500,	0,	0],
			['fence', 	300,	500,	0,	0],
			['fence', 	400,	500,	0,	0],
			['fence', 	500,	500,	0,	0],
			['fence', 	600,	500,	0,	0],
			['fence', 	700,	500,	0,	0],
			['fence', 	0,	700,	0,	0],
			['fence', 	100,	700,	0,	0],
			['fence', 	200,	700,	0,	0],
			['fence', 	300,	700,	0,	0],
			['fence', 	400,	700,	0,	0],
			['fence', 	500,	700,	0,	0],
			['fence', 	600,	700,	0,	0],
			['bones', 	600,	350,	0,	0],
		],
	bots: [
			['B',	65,	5,	[[95,18],[95,40],[5, 40],[5, 60],[95,60],[95, 82],[50, 95]] ],
			['R',	65,	95,	[[95,82],[95,60],[5, 60],[5, 40],[95,40],[95, 18],[50, 5 ]] ],
		],
	});
	
//====== Decision ==================================================================

MAPS.push({
	name: "Decision",
	width: 800,
	height: 1000,
	team_allies: 3,
	team_enemies: 3,
	description: "Make a decision - attack from left, center or right, be careful - enemies can strike from all directions.",
	towers: [
			//team x,	 y, 	name
			//team x,	 y, 	name
			['B',	400,	60,	'Base'],
			['B',	300,	150,	'Tower'],
			['B',	500,	150,	'Tower'],
			['R',	300,	850,	'Tower'],
			['R',	500,	850,	'Tower'],
			['R',	400,	940,	'Base'],
		],
	elements: [
			//name, 	x,	y,   max_width,	max_height
			['vfence', 	150,	100,	0,	0],
			['vfence', 	150,	200,	0,	0],
			['vfence', 	150,	300,	0,	0],
			['vfence', 	150,	400,	0,	0],
			['vfence', 	150,	500,	0,	0],
			['vfence', 	150,	600,	0,	0],
			['vfence', 	150,	700,	0,	0],
			['vfence', 	150,	800,	0,	0],
			['vfence', 	650,	100,	0,	0],
			['vfence', 	650,	200,	0,	0],
			['vfence', 	650,	300,	0,	0],
			['vfence', 	650,	400,	0,	0],
			['vfence', 	650,	500,	0,	0],
			['vfence', 	650,	600,	0,	0],
			['vfence', 	650,	700,	0,	0],
			['vfence', 	650,	800,	0,	0],	
			['rocks1', 	300,	300,	0,	0],
			['rocks2', 	300,	550,	0,	0],
			['bones', 	0,	0,	0,	0],
			['bones', 	650,	900,	0,	0],			
		],
	bots: [
			['B',	50,	10,	[[30,30],[30,95],[50,95]] ],
			['B',	50,	10,	[[70,30],[70,95],[50,95]] ],
			['R',	50,	90,	[[30,70],[30,5],[50,5]] ],
			['R',	50,	90,	[[70,70],[70,5],[50,5]] ],
		],
	});	

//====== Mini ==================================================================

MAPS.push({
	name: "Mini",
	width: 800,
	height: 370,
	team_allies: 2,
	team_enemies: 2,
	description: "You, enemy, 4 towers, 2 bases and no time and space. Victory or defeat will come fast!",
	towers: [
			//team x,	 y, 	name
			['B',	60,	55,	'Base'],
			['B',	150,	50,	'Tower'],
			['B',	50,	160,	'Tower'],
			['R',	750,	210,	'Tower'],
			['R',	650,	320,	'Tower'],
			['R',	750,	320,	'Base'],
		],
	elements: [
			//name, 	x,	y,   max_width,	max_height
			['fence', 	0,	110,	0,	0],
			['fence', 	700,	240,	0,	0],
			['bones', 	330,	100,	0,	0],
			['bones', 	300,	150,	0,	0],
			['crystals', 	100,	90,	0,	0],
			['crystals', 	650,	220,	0,	0],
		],
	bots: [
			['B',	25,	5,	[[95,20],[95,90]] ],
			['R',	75,	95,	[[5 ,80],[5 ,10]] ],
		],
	});
	
//====== Hell ==================================================================

MAPS.push({
	name: "Hell",
	width: 800,
	height: 600,
	team_allies: 1,
	team_enemies: 10,
	ground_only: true,
	singleplayer_only: true,
	description: "What the hell happened here? They are everywhere, help, arrr... (signal lost)",
	towers: [
			//team x,	 y, 	name
			['B',	400,	60,	'Base'],
			['B',	420,	300,	'Tower'],
			['R',	400,	540,	'Base'],
		],
	elements: [
			//name, 	x,	y,   max_width,	max_height
			['fence', 	0,	300,	0,	0],
			['fence', 	100,	300,	0,	0],
			['fence', 	200,	300,	0,	0],
			['fence', 	300,	300,	0,	0],
			['fence', 	440,	300,	0,	0],
			['fence', 	540,	300,	0,	0],
			['fence', 	640,	300,	0,	0],
			['fence', 	740,	300,	60,	0],
			['bones', 	50,	500,	0,	0],
			['bones', 	700,	320,	0,	0],
			['rocks2', 	600,	480,	0,	0],
			['hill', 	340,	10,	0,	0],
		],
	bots: [],
	});

//====== Huge ==================================================================

MAPS.push({
	name: "Huge",
	width: 2000,
	height: 3000,
	team_allies: 10,
	team_enemies: 10,
	description: "Huge area for epic battles only. Don't try to enter without big team - it will be too big for you.",
	towers: [
			//team x,	 y, 	name
			['B',	400,	60,	'Base'],
			['B',	1600,	60,	'Base'],
			['B',	600,	510,	'Tower'],
			['B',	1400,	510,	'Tower'],
			['B',	700,	720,	'Tower'],
			['B',	1300,	720,	'Tower'],
			['B',	800,	930,	'Tower'],
			['B',	1200,	930,	'Tower'],
			['B',	900,	1140,	'Tower'],
			['B',	1100,	1140,	'Tower'],
			['B',	1000,	1350,	'Tower'],
			['R',	1000,	1650,	'Tower'],
			['R',	900,	1860,	'Tower'],
			['R',	1100,	1860,	'Tower'],
			['R',	800,	2070,	'Tower'],
			['R',	1200,	2070,	'Tower'],
			['R',	700,	2280,	'Tower'],
			['R',	1300,	2280,	'Tower'],
			['R',	600,	2490,	'Tower'],
			['R',	1400,	2490,	'Tower'],
			['R',	400,	2940,	'Base'],
			['R',	1600,	2940,	'Base'],
		],
	elements: [
			//name, 	x,	y,   max_width,	max_height
			['fence', 	300,	175,	0,	0],
			['fence', 	400,	175,	0,	0],
			['fence', 	1500,	175,	0,	0],
			['fence', 	1600,	175,	0,	0],
			['fence', 	300,	2825,	0,	0],
			['fence', 	400,	2825,	0,	0],
			['fence', 	1500,	2825,	0,	0],
			['fence', 	1600,	2825,	0,	0],
			['fence', 	0,	1500,	0,	0],
			['fence', 	100,	1500,	0,	0],
			['fence', 	200,	1500,	0,	0],
			['fence', 	300,	1500,	0,	0],
			['fence', 	1600,	1500,	0,	0],
			['fence', 	1700,	1500,	0,	0],
			['fence', 	1800,	1500,	0,	0],
			['fence', 	1900,	1500,	0,	0],
			['hill', 	400,	1300,	0,	0],
			['rocks1', 	900,	700,	0,	0],
			['rocks2', 	200,	2000,	0,	0],
			['bones', 	1500,	200,	0,	0],
		],
	bots: [],
	});
