ELEMENTS.push({
	name: 'background',
	file: 'moon.jpg',	
	size: [1264, 632], 
	alt_color: '#8d8d8d',	
	collission: false,	
	});
ELEMENTS.push({
	name: 'fence',
	file: 'fence.png',
	size: [100, 26], 
	alt_color: '#4e4b44',	
	collission: true,	
	});
ELEMENTS.push({
	name: 'vfence',
	file: 'vfence.png',
	size: [26, 100], 
	alt_color: '#4e4b44',	
	collission: true,	
	});

//====== Main ==================================================================

MAPS.push({
	name: "Main",
	width: 800,
	height: 1000,
	team_size: 3,
	towers: [
			//team x,	 y, 	name
			['B',	400,	60,	'Base'],
			['B',	250,	150,	'Tower'],
			['B',	550,	150,	'Tower'],
			['B',	400,	270,	'Tower'],
			['R',	400,	730,	'Tower'],
			['R',	250,	850,	'Tower'],
			['R',	550,	850,	'Tower'],
			['R',	400,	940,	'Base'],
		],
	elements: [
			//name, 	x,	y,   max_width,	max_height
			['fence', 	50,	200,	0,	0],
			['fence', 	650,	200,	0,	0],
			['fence', 	150,	200,	0,	0],
			['fence', 	250,	200,	0,	0],
			['fence', 	450,	200,	0,	0],
			['fence', 	550,	200,	0,	0],
			['fence', 	0,	500,	0,	0],
			['fence', 	100,	500,	0,	0],
			['fence', 	600,	500,	0,	0],
			['fence', 	700,	500,	0,	0],
			['fence', 	150,	800,	0,	0],
			['fence', 	250,	800,	0,	0],
			['fence', 	450,	800,	0,	0],
			['fence', 	550,	800,	0,	0],
			['fence', 	50,	800,	0,	0],
			['fence', 	650,	800,	0,	0],
		],
	});

//====== Labyrinth =============================================================

MAPS.push({
	name: "Labyrinth",
	width: 800,
	height: 1000,
	team_size: 3,
	towers: [
			//team x,	 y, 	name
			['B',	400,	60,	'Base'],
			['B',	400,	150,	'Tower'],
			['B',	150,	250,	'Tower'],
			['B',	680,	250,	'Tower'],
			['R',	120,	750,	'Tower'],
			['R',	650,	750,	'Tower'],
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
		],
	});
	
//====== Decision ==================================================================

MAPS.push({
	name: "Decision",
	width: 800,
	height: 1000,
	team_size: 3,
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
		],
	});	

//====== Mini ==================================================================

MAPS.push({
	name: "Mini",
	width: 800,
	height: 370,
	team_size: 2,
	towers: [
			//team x,	 y, 	name
			['B',	50,	55,	'Base'],
			['B',	150,	50,	'Tower'],
			['B',	50,	160,	'Tower'],
			['R',	750,	210,	'Tower'],
			['R',	650,	320,	'Tower'],
			['R',	750,	320,	'Base'],
		],
	elements: [
			//name, 	x,	y,   max_width,	max_height
			['fence', 	0,	110,	0,	0],
			['fence', 	100,	110,	0,	0],
			['fence', 	600,	240,	0,	0],
			['fence', 	700,	240,	0,	0],
		],
	});

//====== Huge ==================================================================

MAPS.push({
	name: "Huge",
	width: 2000,
	height: 3000,
	team_size: 10,
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
			['fence', 	400,	1500,	0,	0],
			['fence', 	500,	1500,	0,	0],
			['fence', 	600,	1500,	0,	0],	
			['fence', 	1300,	1500,	0,	0],					
			['fence', 	1400,	1500,	0,	0],
			['fence', 	1500,	1500,	0,	0],
			['fence', 	1600,	1500,	0,	0],
			['fence', 	1700,	1500,	0,	0],
			['fence', 	1800,	1500,	0,	0],
			['fence', 	1900,	1500,	0,	0],
		],
	});
