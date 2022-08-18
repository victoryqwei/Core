var wallLevels = [
	{ // Broken Wall
		hp: 25,
		cost: 4
	}, 
	{ // Level 1
		hp: 50,
		cost: 10
	}, 
	{ // 2
		hp: 80,
		cost: 12
	}, 
	{ // 3
		hp: 120,
		cost: 15
	}, 
	{ // 4
		hp: 180,
		cost: 20
	}
]

class Tile {
	constructor(x, y, type, id) {
		// Type
		this.type = type;

		// Size
		this.actualSize = 100;

		// Position
		this.pos = new Vector(x, y);

		// Hp
		this.hp = 0;

		// Id
		this.id = id;

		// Level
		this.level = 1;

		// Click
		this.click = true;
		this.placeMode = false;
		this.placeToggle = false;
	}

	static draw(wall) {
		if (inScreen(wall.pos.x, wall.pos.y, player)) {
			ctx.beginPath();
			ctx.fillStyle = player.color;
			ctx.fillRect(wall.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 10, wall.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 10, player.size - player.size / 5, player.size - player.size / 5);
			ctx.closePath()

			var wallImage = undefined;

			if (wall.hp <= wallLevels[0].hp) {
				wallImage = wallBroken;
			} else if (wall.hp <= wallLevels[1].hp) {
				wallImage = wallTile;
			} else if (wall.hp <= wallLevels[2].hp) {
				wallImage = wallTile2;
			} else if (wall.hp <= wallLevels[3].hp) {
				wallImage = wallTile3;
			} else {
				wallImage = wallTile4;
			}

			ctx.drawImage(wallImage, wall.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, wall.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size, player.size);
		}	
	}
}


var placeMode = false;
var placeToggle = false;
var placeCooldown = 0;
var place = false;
var upgrade = false;
var highlightSize = 0;
var coreExists = true;

function placeTile(player, players) {
	place = false;

	if (eventInput[49]) { // 1
		if(placeToggle === false) {
			player.clearPlaceMode(core, ability, regen);
			placeToggle = true;
			placeMode = !placeMode;
		}
	} else {
		if (placeToggle) {
			placeToggle = false;
		}
	}
	
	for (var a in rawInput) {
		switch (rawInput[a]) {
			case 32: // space
				place = true;
				break;
		}
	}

	if (mouseDown) {
		place = true;
	}

	//Place mode
	if(placeMode) {
		var x = ((Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel+player.pos.x) / 50) * 50)-50)*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel;
		var y = ((Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel+player.pos.y) / 50) * 50)-50)*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel;

		var accessDistance = new Vector((mouse.x-canvas.width/2), (mouse.y-canvas.height/2));
		var world = new Vector(((Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel+player.pos.x) / 50) * 50)-50), ((Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel+player.pos.y) / 50) * 50)-50))
		var withinArena = world.x >= -arenaSize && world.x+50 <= arenaSize && world.y >= -arenaSize && world.y+50 <= arenaSize

		// Draw placing preview
		var exists = false;

		player.drawPlaceMode(wallTile, player.size, true);

		for(var i = 0; i < player.walls.length; i++) {
			if(player.walls[i].pos.x === world.x && player.walls[i].pos.y === world.y) {
				var wall = player.walls[i];
				if (wall.hp < wallLevels[1].hp && player.power >= wallLevels[0].cost) {
					drawPreview(wallTile, 'Repair Wall', 'Blocks '+wallLevels[1].hp+' damage from bullets.', wallLevels[0].cost)
					exists = true;
					previewUI = true;
				} else if (wall.hp < wallLevels[2].hp && player.power >= wallLevels[2].cost) {
					drawPreview(wallTile2, 'Level 2 Wall', 'Blocks '+wallLevels[2].hp+' damage from bullets.', wallLevels[2].cost)
					exists = true;
					previewUI = true;
				} else if (wall.hp < wallLevels[3].hp && player.power >= wallLevels[3].cost) {
					drawPreview(wallTile3, 'Level 3 Wall', 'Blocks '+wallLevels[3].hp+' damage from bullets.', wallLevels[3].cost)
					exists = true;
					previewUI = true;
				} else if (wall.hp < wallLevels[4].hp && player.power >= wallLevels[4].cost) {
					drawPreview(wallTile4, 'Level 4 Wall', 'Blocks '+wallLevels[4].hp+' damage from bullets.', wallLevels[4].cost)
					exists = true;
					previewUI = true;
				} else {
					drawPreview(wallTile4, 'Maxed Wall', 'You have fully upgraded this wall.', 'N/A')
					exists = true;
					previewUI = true;
				}
			}
		}

		if (!exists) {
			drawPreview(wallTile, 'Level 1 Wall', 'Prevents '+wallLevels[1].hp+' damage from bullets.', wallLevels[1].cost)
			previewUI = true;
		}

		if(place === true && player.drawPlaceMode(wallTile, player.size, false) == false && exists) {
			// Make sure wall is in a placeable position

			//Make sure not an existing wall on client / WALL UPGRADES
			for(var i = 0; i < player.walls.length; i++) {
				if(player.walls[i].pos.x === world.x && player.walls[i].pos.y === world.y) {
					wallExists = true;
					if (!player.walls[i].click) {
						var wall = player.walls[i];

						if (wall.hp < wallLevels[1].hp && player.power >= wallLevels[0].cost) {
							wall.hp = wallLevels[1].hp;
							player.walls[i].click = true;
						} else if (wall.hp < wallLevels[2].hp && player.power >= wallLevels[2].cost) {
							wall.hp = wallLevels[2].hp;
							player.power -= wallLevels[2].cost;
							player.walls[i].click = true;
						} else if (wall.hp < wallLevels[3].hp && player.power >= wallLevels[3].cost) {
							wall.hp = wallLevels[3].hp;
							player.power -= wallLevels[3].cost;
							player.walls[i].click = true;
						} else if (wall.hp < wallLevels[4].hp && player.power >= wallLevels[4].cost) {
							wall.hp = wallLevels[4].hp;
							player.power -= wallLevels[4].cost;
							player.walls[i].click = true;
						}
						//player.newWalls.push(player.walls[i]);
					}
				}
			}
		} else if(place === true && player.drawPlaceMode(wallTile, player.size, false) == false && !exists && player.power >= wallLevels[1].cost) {
			// Place a new wall
			player.power -= wallLevels[1].cost;
			newWall = new Tile(world.x, world.y, "wall", randomString(10));
			newWall.hp = wallLevels[1].hp;

			// Send the new wall to the server
			player.walls.push(newWall)
			//player.newWalls.push(newWall);
			click = true;
			
		}
	}
}

