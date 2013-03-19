//Heavy
TYPES.push({
	name: 'Heavy',					//name
	type: 'tank',					//tank type
	description: ["Heavy armor", "Low damage"],	//tank description
	life: [230, 0],					//[tank life in level 0, life increase in each level]
	damage: [10, 0],				//[tank damage in level 0, damage increase in each level]
	range: 80,					//tank shooting range
	scout: 100,					//tank scout range
	armor: [60, 0, 60],				//[tank armor in level 0, armor increase in each level, max armor]
	speed: 26,					//tank moving speed
	attack_delay: 1,				//attack delay in seconds
	turn_speed: 2,					//tank turn speed
	//no_repawn: 1,					//tank will not respan after death
	//no_collisions: 1,				//tank will be able to move ower walls, and other tanks
	//bonus: 1,					//tank will be able only in single mode,  random and mirror
	//ignore_armor: 1,				//tank will ignore armor
	size: ['M', 50],				//[tank size: S/M/L, icon width and height(same)]
	icon_top: ['top1.png', 'top2.png'],		//tank base images for all teams
	icon_base: ['base1.png', 'base2.png'],		//tank top images for all teams
	preview: 'preview.png',				//tank preview image
	abilities: [					//name; skill icon; active or passive; broadcast activation in multiplayer? 0-no, 1-yes, 2-yes, but on later
		{name: 'Shield',	passive: false,		broadcast: 1},
		{name: 'Repair',	passive: false,		broadcast: 1}, 
		],
	bullet: 'bullet.png',				//bullet_image
	fire_sound: 'shoot.ogg',			//shooting sound
	});

//Tiger
TYPES.push({
	name: 'Tiger',
	type: 'tank',
	description: ["Medium armor", "Huge damage"],
	life: [200, 0],
	damage: [30, 0],
	range: 85,
	scout: 100,
	armor: [40, 0, 40],
	speed: 30,
	attack_delay: 1,
	turn_speed: 2,
	size: ['M', 50],
	preview: 'preview.png',
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	abilities: [],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	});

//Cruiser
TYPES.push({
	name: 'Cruiser',
	type: 'tank',
	description: ["Light armor", "Fast", "Aaverage damage"],
	life: [150, 0],
	damage: [15, 0],
	range: 90,
	scout: 110,
	armor: [20, 0, 20],
	speed: 35,
	attack_delay: 1,
	turn_speed: 1,
	size: ['M', 50],
	preview: 'preview.png',
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	abilities: [],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	});

//Launcher
TYPES.push({
	name: 'Launcher',
	type: 'tank',
	description: ["Missiles", "Long range", "Slow"],
	life: [100, 0],
	damage: [100, 0],
	range: 150,
	scout: 110,
	armor: [10, 0, 10],
	speed: 23,
	attack_delay: 5,
	turn_speed: 5,
	size: ['M', 50],
	preview: 'preview.png',
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	abilities: [],
	bullet: 'missle.png',
	fire_sound: 'shoot.ogg',
	});

//Sniper
TYPES.push({
	name: 'Sniper',
	type: 'tank',
	description: ["Long range", "Huge damage", "Penetrates armor", "Slow", "Inacurate"],
	life: [100, 0],
	damage: [40, 0],
	range: 150,
	scout: 110,
	armor: [10, 0, 10],
	speed: 23,
	attack_delay: 2,
	turn_speed: 6,
	size: ['M', 50],
	ignore_armor: 1,
	preview: 'preview.png',
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	abilities: [],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	});

//Soldier
TYPES.push({
	name: 'Soldier',
	type: 'human',
	description: ["Infantry", "No armor", "Low damage"],
	life: [50, 0],
	damage: [10, 0],
	range: 50,
	scout: 60,
	armor: [0, 0, 0],
	speed: 25,
	attack_delay: 1,
	turn_speed: 6,
	no_repawn: 1,
	size: ['M', 30],
	preview: 'preview.png',
	icon_top: [],
	icon_base: ['top1.png', 'top2.png'],
	abilities: [],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	});

//TOWER
TYPES.push({
	name: 'Tower',
	type: 'tower',
	description: ["Tower for defence"],
	life: [700,0],
	damage: [30, 0],
	range: 110,
	scout: 120,
	armor: [0,0,0],
	speed: 0,
	attack_delay: 1,
	turn_speed: 3,
	no_repawn: 1,
	size: ['L', 50],
	preview: '',
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	abilities: [],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	});

//BASE
TYPES.push({
	name: 'Base',
	type: 'tower',
	description: ["Main base"],
	life: [2000,0],
	damage: [30, 0],
	range: 110,
	scout: 120,
	armor: [50,0,50],
	speed: 0,
	attack_delay: 1,
	turn_speed: 3,
	no_repawn: 1,
	size: ['L', 50],
	preview: '',
	icon_top: ['top1.png', 'top2.png'],
	icon_base: ['base1.png', 'base2.png'],
	abilities: [],
	bullet: 'bullet.png',
	fire_sound: 'shoot.ogg',
	});
