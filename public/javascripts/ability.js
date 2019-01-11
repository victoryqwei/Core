class Ability {
	constructor(x, y) {

		this.exists = false;

		this.actualSize = 100;

		this.pos = new Vector(Infinity, Infinity);

		//Ability movement
		this.moveKey = 56;
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

	drawUI() {
		if(this.interface) {
			var world = new Vector(this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel)

			var coreUIoffset = 10 * relativeHeight;
			var fullHP = 100;
			var fullWidth = 350 * relativeHeight;
			var pixelPerHP = fullWidth / fullHP;
			var healthWidth = pixelPerHP * this.hp;
			var coreUISize = 600 * relativeHeight;
			var coreImageSize = coreUISize / 7 - coreUIoffset * 2;
			var coreBackgroundSize = coreImageSize / 1.2;
			var bottomHeight = 40 * relativeHeight;
			var middleAjust = 1.5 * relativeHeight;
	
			ctx.beginPath();
			ctx.globalAlpha = 0.3;
			ctx.fillStyle = 'Black';
			ctx.fillRect(canvas.width / 2 - coreUISize /2, canvas.height - coreUISize, coreUISize, coreUISize /2);
			ctx.globalAlpha = 0.5;
			ctx.fillRect(canvas.width / 2 - coreUISize /2, canvas.height - coreUISize, coreUISize, coreUISize /7);
			ctx.fillStyle = player.color;
			ctx.fillRect(canvas.width / 2 - coreUISize /2 + coreUISize - fullWidth - coreUIoffset, canvas.height - coreUISize + coreUISize / 7 / 2 - bottomHeight / 2.6, healthWidth, bottomHeight /1.3);
			ctx.fillRect(canvas.width / 2 - coreUISize / 2 + coreUIoffset, canvas.height - coreUISize + coreUISize / 2 - coreUIoffset - bottomHeight, coreUISize - coreUIoffset * 2, bottomHeight);
			ctx.globalAlpha = 1;
			ctx.font = "bold 15px Pier";
	    	ctx.fillStyle = "White";
	    	ctx.textAlign="left"; 
	    	ctx.textBaseline="middle"; 
			ctx.fillText('Upgrade', canvas.width / 2 - coreUISize /2 + coreUIoffset * 2, canvas.height - coreUISize + coreUISize / 2 - coreUIoffset - bottomHeight + bottomHeight /2);
			ctx.textAlign="right"; 
			ctx.fillText('Max Level', canvas.width / 2 - coreUISize /2 + coreUIoffset * 2 + coreUISize - coreUIoffset * 4, canvas.height - coreUISize + coreUISize / 2 - coreUIoffset - bottomHeight + bottomHeight /2);
			ctx.textAlign="left"; 
			ctx.fillText('Health', canvas.width / 2 - coreUISize /2 + coreUISize - fullWidth, canvas.height - coreUISize + coreUISize / 7 / 2);
			
			ctx.globalAlpha = 1;
			
			ctx.fillStyle = player.color;
			ctx.fillRect(canvas.width / 2 - coreUISize / 2 + coreUIoffset + coreUIoffset / 4, canvas.height - coreUISize + coreUIoffset + coreUIoffset / 4, coreImageSize - coreUIoffset / 2, coreImageSize - coreUIoffset / 2);
			ctx.drawImage(abilityUpgrader, canvas.width / 2 - coreUISize /2 + coreUIoffset, canvas.height - coreUISize + coreUIoffset, coreImageSize, coreImageSize);
	    	ctx.font = "bold 15px Pier";
	    	ctx.fillStyle = "White";
	    	ctx.textAlign="left";
	    	ctx.textBaseline="middle";  
			ctx.fillText('Ability Upgrader', canvas.width / 2 - coreUISize /2 + coreUIoffset * 2 + coreImageSize, canvas.height - coreUISize + coreUIoffset + coreImageSize /3, coreImageSize * 2, coreImageSize * 2);
			ctx.fillText('Level 1', canvas.width / 2 - coreUISize /2 + coreUIoffset * 2 + coreImageSize, canvas.height - coreUISize + coreUIoffset + coreImageSize /1.45, coreImageSize * 2, coreImageSize * 2);
			ctx.closePath();
		}
	}
}