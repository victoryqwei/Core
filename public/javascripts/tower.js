class Tower {
	constructor(x, y) {

		this.exists = false;

		this.actualSize = 100;

		this.pos = new Vector(Infinity, Infinity);

		// Ability movement
		this.moveKey = 55;
		this.placeMode = false;
		this.placeToggle = false;
		this.placeKey = 32;
	}

	draw() {

		if(this.exists) {
			ctx.beginPath();
			ctx.globalAlpha = 1;
			ctx.fillStyle = player.color;
			ctx.fillRect(this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 10, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 10, player.size * 2 - player.size / 5, player.size * 2 - player.size / 5);
			ctx.closePath()

			ctx.beginPath();
			ctx.globalAlpha = 1;
			ctx.drawImage(towerTile1, this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size * 2, player.size * 2);
			ctx.closePath();
		}
	}

	update() {
		if(eventInput[this.moveKey]) {
			if(this.placeToggle === false) {
				this.placeToggle = true;
				this.placeMode = !this.placeMode;
			}
		} else {
			if (this.placeToggle) {
				this.placeToggle = false;
			}
		}

		if(this.placeMode) {
			core.placeMode = false;
			core.placeToggle = false;
			// Stop other placing modes
			if(placeMode) {
				placeMode = false;
			}

			// Reset data
			this.hp = 100;

			// Draw player access range
			ctx.globalAlpha = 0.1;
			ctx.beginPath();
			ctx.fillStyle = 'Black';
			ctx.arc(canvas.width/2, canvas.height/2, player.size*player.accessRange, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
			ctx.globalAlpha = 1;

			// Calculate ability highlight
			var x = ((Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel-25+player.pos.x) / 50) * 50)-50)*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel;
			var y = ((Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel-25+player.pos.y) / 50) * 50)-50)*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel;
			ctx.beginPath();
			ctx.globalAlpha = 0.5;

			// Make sure highlight is within distance
			var distance = new Vector((mouse.x-canvas.width/2), (mouse.y-canvas.height/2))

			var world = new Vector((Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel-25+player.pos.x) / 50) * 50)-50, (Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel-25+player.pos.y) / 50) * 50)-50)
			var withinArena = world.x > -arenaSize && world.x+this.actualSize < arenaSize && world.y > -arenaSize && world.y+this.actualSize < arenaSize
			if (distance.getMag() < player.size*player.accessRange && withinArena) {
				ctx.fillStyle = "lime";
			} else {
				ctx.fillStyle = "red";
			}

			// Draw ability highlight
			ctx.fillRect(x, y, player.size*2, player.size*2);
			ctx.globalAlpha = 0.7;
			ctx.drawImage(towerTile1, x, y, player.size*2, player.size*2);
			ctx.globalAlpha = 1;
			ctx.closePath();
			ctx.fillStyle = player.color;

			// When pressed move ability position
			if(place === true && distance.getMag() < player.size*player.accessRange && withinArena) {
				this.pos.x = (Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel-25+player.pos.x) / 50) * 50)-50;
				this.pos.y = (Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel-25+player.pos.y) / 50) * 50)-50;
				this.placeMode = false;
				this.exists = true;
			}
		}
	}
}