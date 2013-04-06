/*	future comparison
DPS		10		30		15	25		20+aa
VS		Heavy		Tiger		Cruis	Launcher	Snip		win	loss
-------------------------------------------------------------------------------------------------
Heavy		n/a		--		++	--		--	|	1	3	but survive long, need more abilities?
Tiger		++		n/a		++	--		--	|	2	2
Cruis		--		--		n/a	0		0	|	0	2	but fast, need more abilities to be usefull
Launch		++		++		0	n/a		0	|	2	0
Sniper		++		++		0	0		n/a	|	2	0
-------------------------------------------------------------------------------------------------

more ideas:
	1 or 2 skill for each tank
	heavy - some skills for save team?
	tiger - less defence?
*/

//Heavy
TYPES.push({
	name: 'Heavy',
	type: 'tank',
	description: ["Heavy armor, high defence", "Low damage", "Weak only against Sniper and Tiger"],
	life: [250, 15],				//[tank life in level 0, life increase in each level]
	damage: [10, 1],	//5 dps			//[tank damage in level 0, damage increase in each level]
	range: 80,					//tank shooting range
	scout: 100,					//tank scout range
	armor: [50, 0.5, 70],				//[tank armor in level 0, armor increase in each level, max armor]
	speed: 30,
	attack_delay: 1,
	turn_speed: 4,
	//no_repawn: 1,
	//no_collisions: 1,
	//bonus: 1,					//tank will be available only in single mode, random and mirror
	//ignore_armor: 1,				//tank will ignore armor
	abilities: [					//name; skill icon; active or passive; broadcast activation in multiplayer? 0-no, 1-yes, 2-yes, but on later
		{name: 'Rest',		passive: false,		broadcast: 1}, 
		{name: 'Soldiers',	passive: false,		broadcast: 1}, 
		],
	size: ['M', 50],				//[tank size: S/M/L, icon width and height(same)]
	icon_top: ['top1.png', 'top2.png'],		//tank base images
	icon_base: ['base1.png', 'base2.png'],		//tank top images
	preview: 'preview.png',				//tank preview image
	bullet: 'bullet.png',				//bullet_image
	fire_sound: 'shoot.ogg',			//shooting sound
	accuracy: 90,					//chance to hit target, %
	});

//Tiger
TYPES.push({
	name: 'Tiger',
	type: 'tank',
	description: ["Light armor", "Huge damage", "Strong against slow enemies"],
	life: [180, 12],
	damage: [30, 1],	//30 dps
	range: 80,
	scout: 100,
	armor: [30, 0.3, 40],
	speed: 25,
	attack_delay: 1,
	turn_speed: 3,
	abilities: [
		{name: 'Berserk',	passive: false,		broadcast: 1},
		{name: 'Soldiers',	passive: false,		broadcast: 1}, 
		],
	size: ['M', 50],
	preview: 'preview.png',
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 90,
	});

//Cruiser
TYPES.push({
	name: 'Cruiser',
	type: 'tank',
	description: ["Fast scout", "Repair for allies", "Light armor"],
	life: [200, 12],
	damage: [10, 1],	//10 dps
	range: 90,
	scout: 110,
	armor: [20, 0.3, 30],
	speed: 32,
	attack_delay: 1,
	turn_speed: 5,
	abilities: [
		{name: 'Fleet',	passive: false,		broadcast: 1}, 
		{name: 'Soldiers',	passive: false,		broadcast: 1}, 
		{name: 'Repair',	passive: false,		broadcast: 1}, 
		],
	size: ['M', 50],
	preview: 'preview.png',
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 90,
	});

//Launcher
TYPES.push({
	name: 'Launcher',
	type: 'tank',
	description: ["Long range attacks", "Slow", "High accuracy"],
	life: [120, 10],
	damage: [40, 5],	//20 dps
	range: 150,
	scout: 110,
	armor: [10, 0, 10],
	speed: 25,
	attack_delay: 2,
	turn_speed: 2,
	abilities: [
		{name: 'Mortar',	passive: false,		broadcast: 2}, 
		{name: 'Soldiers',	passive: false,		broadcast: 1}, 
		],
	size: ['M', 50],
	preview: 'preview.png',
	icon_top: ['top1.png', 'top2.png'],	
	icon_base: ['base1.png', 'base2.png'],
	bullet: 'missle.png',
	fire_sound: 'shoot.ogg',
	accuracy: 100,
	});

//Sniper
TYPES.push({
	name: 'Sniper',
	type: 'tank',
	description: ["Camouflage", "Long range and huge damage", "Penetrates armor", "Slow speed and attack"],
	life: [150, 10],
	damage: [50, 2],	//25 dps
	range: 150,
	scout: 110,
	armor: [10, 0, 10],
	speed: 23,
	attack_delay: 2,
	turn_speed: 2,
	abilities: [
		{name: 'Camouflage',	passive: false,		broadcast: 1}, 
		{name: 'Soldiers',	passive: false,		broadcast: 1}, 
		],
	size: ['M', 50],
	ignore_armor: 1,
	preview: 'preview.png',
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 80,
	});

//Miner
TYPES.push({
	name: 'Miner',
	type: 'tank',
	description: ["Lands mines", "Light armor", "Low damage", "Very weak agains air units"],
	life: [150, 10],
	damage: [10, 1],	//10 dps
	range: 80,
	scout: 90,
	armor: [20, 0.3, 30],
	speed: 30,
	attack_delay: 1,
	turn_speed: 4,
	abilities: [
		{name: 'Mine',	passive: false,		broadcast: 1}, 
		{name: 'Soldiers',	passive: false,		broadcast: 1}, 
		],
	size: ['M', 50],
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	preview: 'preview.png',
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 90,
	});

//Tech
TYPES.push({
	name: 'Tech',
	type: 'tank',
	description: ["Can send virus to deactivate enemy", "Light armor", "Low damage"],
	life: [160, 10],
	damage: [10, 1],	//10 dps
	range: 80,
	scout: 100,
	armor: [30, 0.3, 40],	
	speed: 30,
	attack_delay: 1,
	turn_speed: 4,
	abilities: [
		{name: 'Virus',	passive: false,		broadcast: 2}, 
		{name: 'Soldiers',	passive: false,		broadcast: 1}, 
		],
	size: ['M', 50],
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	preview: 'preview.png',
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 90,
	});

//Truck
/*TYPES.push({
	name: 'Truck',
	type: 'tank',
	description: ["Uses many soldiers for attack", "Very low damage"],
	life: [150, 10],
	damage: [5, 1],	//5 dps
	range: 80,
	scout: 90,
	armor: [10, 0, 10],
	speed: 30,
	attack_delay: 1,
	turn_speed: 4,
	abilities: [
		{name: 'Soldiers',	passive: false,		broadcast: 1}, 
		{name: 'Soldiers',	passive: false,		broadcast: 1}, 
		],
	size: ['M', 50],
	icon_top: [],
	icon_base: ['base1.png', 'base2.png'],
	preview: 'preview.png',
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 90,
	});*/

//Helicopter
TYPES.push({
	name: 'Helicopter',
	type: 'tank',
	description: ["Missiles", "Medium armor", "Strong against all"],
	life: [150, 10],
	damage: [20, 1],	//20 dps
	range: 80,
	scout: 110,
	armor: [40, 0.5, 50],	
	speed: 30,
	attack_delay: 1,
	turn_speed: 6,
	//bonus: 1,
	no_collisions: 1,
	abilities: [
		{name: 'Airstrike',	passive: false,		broadcast: 2}, 
		],
	size: ['M', 50],
	icon_top: [	],
	icon_base: ['base1.png', 'base2.png'],
	preview: 'preview.png',
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 90,
	});

//Bomber
TYPES.push({
	name: 'Bomber',
	type: 'tank',
	description: ["Bombs", "Fast speed", "Low defence"],
	life: [130, 10],
	damage: [15, 1],	//15 dps
	range: 60,
	scout: 110,
	armor: [10, 0, 10],
	speed: 35,
	attack_delay: 1,
	turn_speed: 4,
	//bonus: 1,
	no_collisions: 1,
	abilities: [
		{name: 'Bomb',	passive: false,		broadcast: 2}, 
		],
	size: ['M', 50],
	icon_top: [	],
	icon_base: ['base1.png', 'base2.png'],
	preview: 'preview.png',
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 90,
	});

//Soldier
TYPES.push({
	name: 'Soldier',
	type: 'human',
	description: ["Infantry", "No armor", "Low damage", "Supports tanks in battle"],
	life: [50, 5],			//life: [5000, 5],
	damage: [7, 1],	//7 dps
	range: 60,
	scout: 60,
	armor: [0, 0, 0],
	speed: 25,			//speed: 100,
	attack_delay: 1,
	turn_speed: 4,
	no_repawn: 1,
	abilities: [],
	size: ['S', 30],
	preview: 'preview.png',
	icon_top: [],
	icon_base: ['top1.png', 'top2.png'],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 90,
	});

//TOWER
TYPES.push({
	name: 'Tower',
	type: 'tower',
	description: ["Tower for defence"],
	life: [700,0],
	damage: [30, 0],	//30 dps
	range: 110,
	scout: 120,
	armor: [20,0,20],
	speed: 0,
	attack_delay: 1,
	turn_speed: 4,
	no_repawn: 1,
	abilities: [],
	size: ['L', 50],
	preview: '',
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 90,
	});

//BASE
TYPES.push({
	name: 'Base',
	type: 'tower',
	description: ["Main base"],
	life: [1000,0],
	damage: [30, 0],	//30 dps
	range: 110,
	scout: 120,
	armor: [50,0,50],
	speed: 0,
	attack_delay: 1,
	turn_speed: 4,
	no_repawn: 1,
	abilities: [],
	size: ['L', 90],
	preview: '',
	icon_top: [],
	icon_base: ['base1.png', 'base2.png'],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	accuracy: 90,
	});
