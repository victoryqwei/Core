class Ability {
	constructor(x, y) {

		this.exists = false;

		this.actualSize = 100;

		this.pos = new Vector(Infinity, Infinity);

		//Ability movement
		this.moveKey = 51;
		this.placeMode = false;
		this.placeToggle = false;
		this.placeKey = 32;

		//Ability UI
		this.interface = false;
		this.interfaceToggle = false;
		this.interfaceKey = 85;
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
			ctx.drawImage(abilityUpgrader, this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size * 2, player.size * 2);
			ctx.closePath();
		}
	}

	update() {
		if(!this.exists) {
			this.interface = false;
			if(eventInput[this.moveKey]) {
				if(this.placeToggle === false) {
					player.clearPlaceMode(tile, core, regen);
					this.placeToggle = true;
					this.placeMode = !this.placeMode;
				}
			} else {
				if (this.placeToggle) {
					this.placeToggle = false;
				}
			}
		} else {
			// Open interface
			if(eventInput[this.interfaceKey]) {
				if(this.interfaceToggle === false) {
					this.interfaceToggle = true;
					this.interface = !this.interface;
				}
			
			} else {
				if (this.interfaceToggle) {
					this.interfaceToggle = false;
				}
			}
		}

		if(this.placeMode) {
			previewUI = true;
			drawPreview(abilityUpgrader, 'Ability Upgrader', 'Allows player upgradability.', 200)
			// Reset data
			this.hp = 100;

			player.drawPlaceMode(abilityUpgrader, player.size*2, true);

			// When pressed move core position
			if(place === true && !player.drawPlaceMode(abilityUpgrader, player.size*2, false) && play === 1) {
				this.pos.x = (Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel-25+player.pos.x) / 50) * 50)-50;
				this.pos.y = (Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel-25+player.pos.y) / 50) * 50)-50;
				this.placeMode = false;
				this.exists = true;
			}
		}
	}

	drawUI(player) {
		if(this.interface) {
			//World pos
			var world = new Vector(this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel)

			//Define
			var abilityUIoffset = 10 * relativeHeight;
			var fullHP = 100;
			var fullWidth = 150 * relativeHeight;
			var pixelPerHP = fullWidth / fullHP;
			var healthWidth = pixelPerHP * this.hp;
			var abilityUISize = 220 * relativeHeight;
			var abilityImageSize = abilityUISize / 3 - abilityUIoffset * 2;

			//Container pos
			var containerX = this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel - abilityUISize + (core.actualSize / 2) * rectHeightRel;
			var containerY = this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel - abilityUISize - abilityUIoffset;

			//Define the center and bottom of the container
			var center = this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + (core.actualSize / 2) * rectHeightRel;
			var bottom = this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel - abilityUISize - abilityUIoffset + abilityUISize;

			//Draw rounded UI container
			ctx.beginPath();
			ctx.globalAlpha = 0.3;
			ctx.fillStyle = 'Black';
			fillRoundedRect(containerX, containerY, abilityUISize * 2, abilityUISize, 5);
			fillRoundedRect(containerX, containerY, abilityUISize * 2, abilityUISize / 3, 5);
			ctx.closePath();

			//Draw pointer triangle
			ctx.beginPath();
			ctx.moveTo(center - 7, bottom);
			ctx.lineTo(center + 7, bottom);
			ctx.lineTo(center, bottom + 5);
			ctx.fill();
			ctx.closePath();

			//Draw container core image
			ctx.beginPath();
			ctx.globalAlpha = 1;
			ctx.fillStyle = player.color;
			ctx.fillRect(containerX + abilityUIoffset + abilityUIoffset / 4, containerY + abilityUIoffset + abilityUIoffset / 4, abilityImageSize - abilityUIoffset / 2, abilityImageSize - abilityUIoffset / 2);
			ctx.drawImage(abilityUpgrader, containerX + abilityUIoffset, containerY + abilityUIoffset, abilityImageSize, abilityImageSize);
			ctx.closePath();

			//Draw container text
			ctx.beginPath();
			ctx.font = "bold " + 15*relativeHeight + "px Pier";
	    	ctx.fillStyle = "White";
	    	ctx.textAlign="left";
	    	ctx.textBaseline="middle";  
			ctx.fillText('Ability Upgrader', containerX + abilityUIoffset * 2 + abilityImageSize, containerY + abilityUIoffset * 2.2);
			ctx.fillText('Level 1', containerX + abilityUIoffset * 2 + abilityImageSize, containerY + abilityUIoffset * 4);
			ctx.closePath();

			//Draw upgrade bar
			ctx.beginPath();
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = player.color;
			ctx.fillRect(containerX + abilityUIoffset, containerY + abilityUISize - abilityUIoffset * 2 - abilityUIoffset * 2, abilityUISize * 2 - abilityUIoffset * 2, abilityUIoffset * 3);
			ctx.closePath();

			//Draw core upgrade text
			ctx.beginPath();
			ctx.globalAlpha = 1;
			ctx.font = "bold " + 15*relativeHeight + "px Pier";
	    	ctx.fillStyle = "White";
	    	ctx.textAlign="left"; 
	    	ctx.textBaseline="middle"; 
			ctx.fillText('Speed Ability: Level ' + player.speed, containerX + abilityUIoffset - abilityUIoffset * 1.5 + abilityUIoffset * 2, containerY + abilityUISize - abilityUIoffset * 2 - abilityUIoffset * 2 + abilityUIoffset * 1.5);
			ctx.textAlign="right"; 
			ctx.fillText('(Space) ' + '10C/P', containerX + abilityUIoffset - abilityUIoffset * 2 + abilityUISize * 2 - abilityUIoffset * 2, containerY + abilityUISize - abilityUIoffset * 2 - abilityUIoffset * 2 + abilityUIoffset * 1.5);
			ctx.closePath();

			//Draw health
			ctx.beginPath();
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = player.color;
			ctx.fillRect(containerX + abilityUISize * 2 - fullWidth - abilityUIoffset, containerY + abilityUIoffset * 2.1, healthWidth, abilityUIoffset * 2);
			ctx.globalAlpha = 1;
			ctx.fillStyle = "White";
			ctx.textAlign="left";
			ctx.fillText((this.hp).toFixed(0) + '/' + '100', containerX + abilityUISize * 2 - fullWidth, containerY + abilityUIoffset * 2.1 + abilityUIoffset);
			ctx.closePath();		
		}
	}
}