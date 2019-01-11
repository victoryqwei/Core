class Tile {
	constructor(x, y, type, id) {
		// Type
		this.type = type;

		// Size
		this.actualSize = 100;

		// Position
		this.pos = new Vector(x, y);

		// Hp
		this.hp = 20;

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

			if (wall.hp < 20) {
				wallImage = wallBroken;
			} else if (wall.hp < 30) {
				wallImage = wallTile;
			} else if (wall.hp < 40) {
				wallImage = wallTile2;
			} else if (wall.hp < 50) {
				wallImage = wallTile3;
			} else if (wall.hp < 60) {
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
				if (wall.hp < 20 && player.power >= 1) {
					drawPreview(wallTile, 'Level 1 Wall', 'Prevents 20 damage from bullets.', 1)
					exists = true;
					previewUI = true;
				} else if (wall.hp < 30 && player.power >= 3) {
					drawPreview(wallTile2, 'Level 2 Wall', 'Prevents 30 damage from bullets.', 3)
					exists = true;
					previewUI = true;
				} else if (wall.hp < 40 && player.power >= 5) {
					drawPreview(wallTile3, 'Level 3 Wall', 'Prevents 40 damage from bullets.', 5)
					exists = true;
					previewUI = true;
				} else if (wall.hp < 50 && player.power >= 10) {
					drawPreview(wallTile4, 'Level 4 Wall', 'Prevents 50 damage from bullets.', 10)
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
			drawPreview(wallTile, 'Level 1 Wall', 'Prevents 20 damage from bullets.', 1)
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

						if (wall.hp < 20 && player.power >= 1) {
							wall.hp = 20;
							player.walls[i].click = true;
						} else if (wall.hp < 30 && player.power >= 3) {
							wall.hp = 30;
							player.power -= 3;
							player.walls[i].click = true;
						} else if (wall.hp < 40 && player.power >= 5) {
							wall.hp = 40;
							player.power -= 5;
							player.walls[i].click = true;
						} else if (wall.hp < 50 && player.power >= 10) {
							wall.hp = 50;
							player.power -= 10;
							player.walls[i].click = true;
						}
						//player.newWalls.push(player.walls[i]);
					}
				}
			}
		} else if(place === true && player.drawPlaceMode(wallTile, player.size, false) == false && !exists && player.power >= 1) {
			// Place a new wall
			player.power -= 1;
			newWall = new Tile(world.x, world.y, "wall", randomString(10));

			// Send the new wall to the server
			player.walls.push(newWall)
			//player.newWalls.push(newWall);
			click = true;
			
		}
	}
}

function drawPlayersTiles(players) {
	//Render other player walls
	for(var i = 0; i < players.length; i++) {
		if (players[i].walls) {
			for(var j = 0; j < players[i].walls.length; j++) {
				if(inScreen(players[i].walls[j].pos.x, players[i].walls[j].pos.y, player)) {
					ctx.beginPath();
					ctx.fillStyle = players[i].color;
					ctx.fillRect(players[i].walls[j].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 10, players[i].walls[j].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 10, player.size - player.size / 5, player.size - player.size / 5);
					ctx.closePath();

					var wallImage = undefined;
					var wall = players[i].walls[j];

					if (wall.hp < 20) {
						wallImage = wallBroken;
					} else if (wall.hp < 30) {
						wallImage = wallTile;
					} else if (wall.hp < 40) {
						wallImage = wallTile2;
					} else if (wall.hp < 50) {
						wallImage = wallTile3;
					} else if (wall.hp < 60) {
						wallImage = wallTile4;
					}

					ctx.drawImage(wallImage, wall.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, wall.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size, player.size);
					
					
				}
			}
		}
	}
}

function inScreen(x, y, player) {
	if(play === 3) {
		return true;
	} else {
		if ((x - player.pos.x + player.actualSize) * rectHeightRel < canvas.width * rectHeightRel && (x - player.pos.x - player.actualSize) * rectHeightRel > -canvas.width * rectHeightRel && (y - player.pos.y + player.actualSize) * rectHeightRel < canvas.height * rectHeightRel && (y - player.pos.y - player.actualSize) * rectHeightRel > -canvas.height * rectHeightRel) {
			return true;
		}
	}
}