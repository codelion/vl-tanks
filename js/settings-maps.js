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

//====== Main ==================================================================

MAPS.push({
	name: "Main",
	width: 800,
	height: 1000,
	towers: [
			//team x%,	 y%, 	name
			['B',	50,	2,	'Base'],
			['B',	30,	11,	'Tower'],
			['B',	70,	11,	'Tower'],
			['B',	50,	25,	'Tower'],
			['R',	50,	75,	'Tower'],
			['R',	30,	89,	'Tower'],
			['R',	70,	89,	'Tower'],
			['R',	50,	100,	'Base'],
		],
	elements: [
			//name, 	x,	y,   max_width,	max_height
			['fence', 	150,	200,	0,	0],
			['fence', 	250,	200,	0,	0],
			['fence', 	350,	200,	0,	0],
			['fence', 	450,	200,	0,	0],
			['fence', 	550,	200,	0,	0],
			['fence', 	0,	500,	50,	0],
			['fence', 	750,	500,	50,	0],
			['fence', 	150,	800,	0,	0],
			['fence', 	250,	800,	0,	0],
			['fence', 	350,	800,	0,	0],
			['fence', 	450,	800,	0,	0],
			['fence', 	550,	800,	0,	0],
		],
	});

//====== Labyrinth =============================================================

MAPS.push({
	name: "Labyrinth",
	width: 800,
	height: 1000,
	towers: [
			//team x%,	 y%, 	name
			['B',	50,	2,	'Base'],
			['B',	60,	3,	'Tower'],
			['B',	15,	21,	'Tower'],
			['B',	85,	21,	'Tower'],
			['R',	15,	79,	'Tower'],
			['R',	85,	79,	'Tower'],
			['R',	60,	99,	'Tower'],
			['R',	50,	100,	'Base'],
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

//====== Mini ==================================================================

MAPS.push({
	name: "Mini",
	width: 800,
	height: 350,
	towers: [
			//team x%,	 y%, 	name
			['B',	1,	4,	'Base'],
			['B',	15,	5,	'Tower'],
			['R',	85,	97,	'Tower'],
			['R',	100,	100,	'Base'],
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
	towers: [
			//team x%,	 y%, 	name
			['B',	33,	1,	'Base'],
			['B',	66,	1,	'Base'],
			['B',	30,	17,	'Tower'],
			['B',	70,	17,	'Tower'],
			['B',	30,	31,	'Tower'],
			['B',	70,	31,	'Tower'],
			['B',	30,	44,	'Tower'],
			['R',	70,	56,	'Tower'],
			['R',	30,	69,	'Tower'],
			['R',	70,	69,	'Tower'],
			['R',	30,	83,	'Tower'],
			['R',	70,	83,	'Tower'],
			['R',	33,	100,	'Base'],
			['R',	66,	100,	'Base'],
		],
	elements: [
			//name, 	x,	y,   max_width,	max_height
			['fence', 	566,	175,	0,	0],
			['fence', 	666,	175,	0,	0],
			['fence', 	1233,	175,	0,	0],
			['fence', 	1333,	175,	0,	0],
			['fence', 	566,	2825,	0,	0],
			['fence', 	666,	2825,	0,	0],
			['fence', 	1233,	2825,	0,	0],
			['fence', 	1333,	2825,	0,	0],
		],
	});
