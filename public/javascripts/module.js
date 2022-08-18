class Module {
	constructor() {

		this.type = "Regen"

		//Pos and Size
		this.pos = new Vector(0, 0);
		this.actualSize = 50;

		//Ability movement
		this.moveKey = 50;
		this.placeMode = false;
		this.placeToggle = false;
		this.placeKey = 32;

		//Ability UI
		this.interface = false;
		this.interfaceToggle = false;
		this.interfaceKey = 80;

		//Health
		this.hp = 50;

		//Regen
		this.regenRadius = 300;
	}

	draw() {
		// Update regen modules
		if(player.modules.length > 0) {
			for (var i = 0; i < player.modules.length; i++) {
				if(inScreen(player.modules[i].pos.x, player.modules[i].pos.y, player)) {
					// Draw regen radius
					ctx.beginPath();
					ctx.globalAlpha = 0.5;
					ctx.strokeStyle = player.color;
					ctx.lineWidth=10*rectHeightRel;
					ctx.arc(player.modules[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 2, player.modules[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 2, this.regenRadius*rectHeightRel, 0, 2 * Math.PI, false);
					ctx.stroke();
					ctx.closePath();

					// Draw regen background
					ctx.beginPath();
					ctx.globalAlpha = 1;
					ctx.fillStyle = player.color;
					ctx.fillRect(player.modules[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 10, player.modules[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 10, player.size - player.size / 5, player.size - player.size / 5);
					ctx.closePath();

					// Draw regen image
					ctx.beginPath();
					ctx.globalAlpha = 1;
					ctx.drawImage(regenTile1, player.modules[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, player.modules[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size, player.size);
					ctx.closePath();

					// Draw core health
					if (player.modules[i].hp < 50) {
						ctx.fillStyle = player.color;
						ctx.fillRect(player.modules[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, player.modules[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size * 1.2, player.modules[i].hp*rectHeightRel, player.size / 4);
						ctx.closePath()
					}
				}
			}
		}
	}

	regeneration() {
		// Update regen radius health
		if(player.modules.length > 0) {
			for (var i = 0; i < player.modules.length; i++) {
				//Increase player health
				var playerDistance = new Vector(player.pos.x, player.pos.y)
				playerDistance.sub(new Vector(player.modules[i].pos.x, player.modules[i].pos.y));
				if (playerDistance.getMag() < this.regenRadius) {
					if(player.hp <= player.maxHP && player.power >= 0.08) {
						player.hp += 0.8;
						player.power -= 0.08;
						ctx.beginPath();
						ctx.globalAlpha = 0.8;
						ctx.drawImage(regenCover1, player.pos.x*rectHeightRel-player.actualSize/2*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, player.pos.y*rectHeightRel-player.actualSize/2*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size, player.size);
						ctx.closePath();
					}
				}

				//Increase wall health
				for (var j = 0; j < player.walls.length; j++) {
					var wallDistance = new Vector(player.walls[j].pos.x, player.walls[j].pos.y)
					wallDistance.sub(new Vector(player.modules[i].pos.x, player.modules[i].pos.y));
					if (wallDistance.getMag() < this.regenRadius) {
						if(player.walls[j].hp <= wallLevels[4].hp && player.power >= 0.08) {
							player.walls[j].hp += 0.3;
							player.power -= 0.08;
							ctx.beginPath();
							ctx.globalAlpha = 0.8;
							ctx.drawImage(regenCover1, player.walls[j].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, player.walls[j].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size, player.size);
							ctx.closePath();
						}
					}	
				}
			}
		}
	}

	update() {
		// If pressed place key (default 2)
		if(eventInput[this.moveKey]) {
			if(this.placeToggle === false) {
				player.clearPlaceMode(tile, core, ability);
				this.placeToggle = true;
				this.placeMode = !this.placeMode;
			}
		} else {
			if (this.placeToggle) {
				this.placeToggle = false;
			}
		}
		
		//If placemode is active
		if(this.placeMode) {
			//Stop other place modes

			//Draw preview UI
			previewUI = true;
			drawPreview(regenTile1, 'Regeneration Module', 'Provides a radius to heal players and walls.', 200)
			
			// Reset data
			this.hp = 50;

			// Draw player access range
			player.drawPlaceMode(regenTile1, player.size, true);

			// When pressed move core position
			if(place === true && !player.drawPlaceMode(regenTile1, player.size, false) && play === 1 && player.power >= 200) {
				player.power -= 200;
				var newRegen = {
					pos: new Vector((Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel+player.pos.x) / 50) * 50)-50, (Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel+player.pos.y) / 50) * 50)-50),
					hp: this.hp,
					type: this.type,
					id: randomString(10)
				}

				// Send the new wall to the server
				player.modules.push(newRegen)
				this.placeMode = false;
			}
		}
	}
}