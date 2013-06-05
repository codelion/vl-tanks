COUNTRIES = {
	us: {
		name: 'United States', 
		file: 'us',
		description: 'Strong country. Units have 10% more dps, 10% more shields.',
		pros: 'More dps, more defence.',
		cons: 'No weak points.',
		buffs: [
			{ name: 'damage',	power: 1.1, },
			{ name: 'shield',	power: 10,	type: 'static' },
			],
		},
	ru: {
		name: 'Russia', 
		file: 'ru',
		description: 'Defensive country. Units can be rebuilt 50% faster.',
		pros: 'Fast unit rebuild gives good base defence.',
		cons: 'Weak units.',
		buffs: [
			{ name: 'respawn',	power: 0.5, },
			],
		},
	ch: {
		name: 'China', 
		file: 'ch',
		description: 'Country has fastest-growing economy. Units level-up faster by 20%.',
		pros: 'Strongest economy in late game.',
		cons: 'Weak in early game.',
		buffs: [
			{ name: 'level_up',	power: 0.8, },
			],
		},
	}

//====== TANKS =================================================================

//Heavy
TYPES.push({
	name: 'Heavy',
	type: 'tank',
	description: ["Heavy armor, high defence", "Low damage", "Weak only against Stealth and Tiger"],
	life: [230, 12],  				//[tank life in level 0, life increase in each level]
	damage: [15, 1],	//15 dps		//[tank damage in level 0, damage increase in each level]
	range: 80,					//tank shooting range
	scout: 90,					//tank scout range
	armor: [40, 0.5, 65],				//[tank armor in level 0, armor increase in each level, max armor]
	speed: 25,					//speed
	attack_delay: 1,				//pause between shoots in seconds
	turn_speed: 2.5,					//turn speed, higher - faster
	//no_repawn: 1,					//if tank dies - he will not respawn
	//no_collisions: 1,				//tank can go other walls and other tanks
	//bonus: 1,					//tank will be available only in single mode, random and mirror
	//flying: true,					//can fly
	//ignore_armor: 1,				//tank will ignore armor
	abilities: [					//name; skill icon; active or passive; broadcast activation in multiplayer? 0-no, 1-yes, 2-yes, but on later
		{name: 'Rest',		passive: false,		broadcast: 1}, 
		{name: 'Rage',		passive: false,		broadcast: 1}, 
		{name: 'Health',	passive: true,		broadcast: 1}, 
		],
	size: ['M', 50],				//[tank size: S/M/L, icon width and height(same)]
	icon_top: true,				//tank base images
	icon_base: true,			//tank top images
	preview: true,				//tank preview image
	bullet: 'small_bullet',				//bullet_image
	fire_sound: 'shoot',				//shooting sound
	accuracy: 90,					//chance to hit target, %
	});

//Tiger
TYPES.push({
	name: 'Tiger',
	type: 'tank',
	description: ["Extreme damage", "Strong against slow enemies", "Light armor"],
	life: [210, 12],
	damage: [30, 1.5],		//30 dps
	range: 80,
	scout: 90,
	armor: [25, 0.5, 50],
	speed: 28,
	attack_delay: 1,
	turn_speed: 2.5,
	abilities: [
		{name: 'Blitzkrieg',	passive: false,		broadcast: 1},
		{name: 'Frenzy',	passive: false,		broadcast: 1}, 
		{name: 'AA Bullets',	passive: true,		broadcast: 1},
		],
	size: ['M', 50],
	preview: true,
	icon_top: true,
	icon_base: true,
	bullet: 'bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});

//Cruiser
TYPES.push({
	name: 'Cruiser',
	type: 'tank',
	description: ["Fast scout", "Repair and damage boost for allies", "Light armor"],
	life: [180, 11],
	damage: [18, 1.3],	//18 dps
	range: 80,
	scout: 90,
	armor: [20, 0.5, 45],
	speed: 30,
	attack_delay: 1,
	turn_speed: 3,
	abilities: [
		{name: 'Turbo',		passive: false,		broadcast: 1}, 
		{name: 'Repair',	passive: false,		broadcast: 0}, 
		{name: 'Boost',		passive: false,		broadcast: 0}, 
		],
	size: ['M', 50],
	preview: true,
	icon_top: true,
	icon_base: true,
	bullet: 'small_bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});

//Launcher
TYPES.push({
	name: 'Launcher',
	type: 'tank',
	description: ["Long range attacks", "Slow"],
	life: [150, 10],
	damage: [15, 1.1],	//15 dps
	range: 100,
	scout: 100,
	armor: [10, 0, 10],
	speed: 25,
	attack_delay: 1,
	turn_speed: 2,
	abilities: [
		{name: 'Missile',	passive: false,		broadcast: 2}, 
		{name: 'Mortar',	passive: false,		broadcast: 2}, 
		{name: 'MM Missile',	passive: false,		broadcast: 2},
		],
	size: ['M', 50],
	preview: true,
	icon_top: true,
	icon_base: true,
	bullet: 'small_bullet',
	fire_sound: 'shoot',
	accuracy: 100,
	});

//Stealth
TYPES.push({
	name: 'Stealth',
	type: 'tank',
	description: ["Camouflage", "Long range and huge damage", "Penetrates armor", "Slow speed and attack"],
	life: [150, 10],
	damage: [40, 2],	//20 dps
	range: 100,
	scout: 100,
	armor: [10, 0.2, 20],
	speed: 28,
	attack_delay: 2,
	turn_speed: 2,
	abilities: [
		{name: 'Strike',	passive: false,		broadcast: 2}, 
		{name: 'Camouflage',	passive: false,		broadcast: 1}, 
		{name: 'Scout',		passive: false,		broadcast: 0},
		],
	size: ['M', 50],
	ignore_armor: 1,
	preview: true,
	icon_top: true,
	icon_base: true,
	bullet: 'bullet',
	fire_sound: 'shoot',
	accuracy: 80,
	});

//Miner
TYPES.push({
	name: 'Miner',
	type: 'tank',
	description: ["Lands poweful mines", "Light armor", "Low tank damage"],
	life: [180, 11],
	damage: [15, 1],	//15 dps
	range: 80,
	scout: 90,
	armor: [20, 0.5, 45],
	speed: 28,
	attack_delay: 1,
	turn_speed: 3,
	abilities: [
		{name: 'Mine',		passive: false,		broadcast: 1}, 
		{name: 'Explode',	passive: false,		broadcast: 1}, 
		{name: 'SAM',		passive: false,		broadcast: 1}, 
		],
	size: ['M', 50],
	preview: true,
	icon_top: true,
	icon_base: true,
	bullet: 'small_bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});

//Tech
TYPES.push({
	name: 'Tech',
	type: 'tank',
	description: ["Deactivates enemies", "Boosts team defence", "Light armor"],
	life: [150, 10],
	damage: [20, 1.4],	//20 dps
	range: 80,
	scout: 90,
	armor: [20, 0.5, 45],
	speed: 28,
	attack_delay: 1,
	turn_speed: 3,
	abilities: [
		{name: 'Virus',		passive: false,		broadcast: 2}, 
		{name: 'EMP Bomb',	passive: false,		broadcast: 2},
		{name: 'M7 Shield',	passive: false,		broadcast: 0},
		],
	size: ['M', 50],
	preview: true,
	icon_top: true,
	icon_base: true,
	bullet: 'bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});

//Truck
TYPES.push({
	name: 'Truck',
	type: 'tank',
	description: ["Uses elite soldiers for attack", "Low tank damage"],
	life: [150, 10],
	damage: [15, 1],	//15 dps
	range: 80,
	scout: 90,
	armor: [10, 0, 10],
	speed: 25,
	attack_delay: 1,
	turn_speed: 3,
	abilities: [
		{name: 'Fire bomb',	passive: false,		broadcast: 2}, 
		{name: 'Soldiers',	passive: false,		broadcast: 1}, 
		{name: 'Medicine',	passive: false,		broadcast: 0}, 
		],
	size: ['M', 50],
	preview: true,
	icon_top: false,
	icon_base: true,
	bullet: 'small_bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});

//TRex
TYPES.push({
	name: 'TRex',
	type: 'tank',
	description: ["Plasma shots", "Jumps", "Huge damage, low range", "Light armor"],
	life: [170, 11],
	damage: [20, 1.4],	//20 dps
	range: 40,
	scout: 80,
	armor: [30, 0.5, 55],
	speed: 28,
	attack_delay: 1,
	turn_speed: 3,
	abilities: [
		{name: 'Plasma',	passive: false,		broadcast: 2}, 
		{name: 'Jump',		passive: false,		broadcast: 2}, 
		{name: 'PL Shield',	passive: false,		broadcast: 1},
		],
	size: ['M', 50],
	preview: true,
	icon_top: true,
	icon_base: true,
	bullet: 'bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});

//Apache
TYPES.push({
	name: 'Apache',
	type: 'tank',
	description: ["Missiles", "Light armor", "Strong against all"],
	life: [180, 11],
	damage: [20, 1.3],	//20 dps
	range: 90,
	scout: 100,
	armor: [20, 0.5, 45],	
	speed: 32,
	attack_delay: 1,
	turn_speed: 3,
	//bonus: 1,
	no_collisions: 1,
	flying: true,
	abilities: [
		{name: 'Airstrike',	passive: false,		broadcast: 2}, 
		{name: 'Scout',		passive: false,		broadcast: 0}, 
		{name: 'AA Bullets',	passive: true,		broadcast: 1},
		],
	size: ['M', 50],
	preview: true,
	icon_top: false,
	icon_base: true,
	bullet: 'bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});

//Bomber
TYPES.push({
	name: 'Bomber',
	type: 'tank',
	description: ["Bombs", "Fast speed", "Low defence"],
	life: [150, 10],
	damage: [20, 1.3],	//20 dps
	range: 80,
	scout: 100,
	armor: [10, 0.2, 20],
	speed: 37,
	attack_delay: 1,
	turn_speed: 3,
	//bonus: 1,
	no_collisions: 1,
	flying: true,
	abilities: [
		{name: 'Bomb',		passive: false,		broadcast: 2}, 
		{name: 'AA bomb',	passive: false,		broadcast: 2}, 
		{name: 'Rest',		passive: false,		broadcast: 1},
		],
	size: ['M', 50],
	preview: true,
	icon_top: false,
	icon_base: true,
	bullet: 'bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});

//Soldier
TYPES.push({
	name: 'Soldier',
	type: 'human',
	description: ["Infantry", "No armor", "Low damage", "Supports tanks in battle"],
	life: [130, 6],
	damage: [11, 0.7],	//11 dps
	range: 70,
	scout: 80,
	armor: [0, 0, 0],
	speed: 25,
	attack_delay: 1,
	turn_speed: 4,
	no_repawn: 1,
	abilities: [],
	size: ['S', 30],
	preview: true,
	icon_top: false,
	icon_base: true,
	bullet: 'small_bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});

//Tower
TYPES.push({
	name: 'Tower',
	type: 'tower',
	description: ["Tower for defence"],
	life: [1200,0],
	damage: [30, 0],	//30 dps
	range: 110,
	scout: 110,
	armor: [20, 0, 20],
	speed: 0,
	attack_delay: 1.1,
	turn_speed: 2.5,
	no_repawn: 1,
	abilities: [],
	size: ['L', 50],
	preview: false,
	icon_top: true,
	icon_base: true,
	bullet: 'bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});

//Base
TYPES.push({
	name: 'Base',
	type: 'tower',
	description: ["Main base"],
	life: [2500, 0],
	damage: [45, 0],	//45 dps
	range: 110,
	scout: 110,
	armor: [50, 0, 50],
	speed: 0,
	attack_delay: 1.1,
	turn_speed: 2.5,
	no_repawn: 1,
	abilities: [],
	size: ['L', 90],
	preview: false,
	icon_top: false,
	icon_base: true,
	no_base_rotate: true,
	bullet: 'bullet',
	fire_sound: 'shoot',
	accuracy: 90,
	});
