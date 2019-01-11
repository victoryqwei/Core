var lightningAlpha = 1;
var lightningDraw = 0;

class Core {
	constructor(x, y) {
		// Size
		this.actualSize = 100;

		// Position
		this.pos = new Vector(Infinity, Infinity);
		this.level = 1;
		this.exists = false;

		// Health
		this.hp = 100;

		// Core movement
		this.moveKey = 57;
		this.placeMode = false;
		this.placeToggle = false;
		this.placeKey = 32;

		//Core UI
		this.interface = false;
		this.interfaceToggle = false;
		this.interfaceKey = 69;

		// Generation cooldown
		this.generationDelay = 1200;
		this.cooldown = 0;

		// Lightning effects
		this.lightning = undefined;

		// Upgrade
		this.upgradeCost = 100;
		this.upgradeReset = false;

		this.coreCooldown = 10000;
		this.cooldownRemain = 0;
	}

	update(player, deltaTime) {
		// Power generation
		if(core.exists) {
			if(core.level === 1) {
				player.power += this.level*deltaTime/this.generationDelay;

				if (core.hp < 100) {
					core.hp += this.level*delta/1000*3/5*2
				} else {
					core.hp = 100;
				}
			} else if(core.level === 2) {
				player.power += this.level*deltaTime/this.generationDelay;

				if (core.hp < 100) {
					core.hp += this.level*delta/1000*3/5*2
				} else {
					core.hp = 100;
				}
			} else if(core.level === 3) {
				player.power += this.level*deltaTime/this.generationDelay;

				if (core.hp < 100) {
					core.hp += this.level*delta/1000*3/5*2
				} else {
					core.hp = 100;
				}
			}
		}

		// Move the core upon pressing the moveKey (default is 9)
		if(!core.exists) {
			if(!ranCooldown && cooldownRemain === 0) {
				cooldownRemain = 10;
				setTimeout(function(){ 
					clearInterval(remainingCooldown);
					ranCooldown = true;
					clearTimeout();
				}, this.coreCooldown);
				var remainingCooldown = setInterval(function(){ 
					cooldownRemain = cooldownRemain - 1; 
				}, 1000);
			}
			this.interface = false;

			if(ranCooldown) {
				//drawMessage('PLACE YOUR CORE BY PRESSING (9) TO HOVER, AND PRESSING (SPACE) TO PLACE.');
				if(eventInput[this.moveKey]) {
					if(this.placeToggle === false) {
						player.clearPlaceMode(tile, ability, regen);
						this.placeToggle = true;
						this.placeMode = !this.placeMode;
					}
				} else {
					if (this.placeToggle) {
						this.placeToggle = false;
					}
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

		//Place the core when pressing 'placeKey' (default is space (32))
		if (eventInput[32] && !this.upgradeReset) {
			eventInput[32] = false;
			this.upgradeReset = true;
			if(this.placeMode) {
				place = true;
			} 
			if(this.interface) {
				upgrade = true;
			}
		}

		if(this.interface && upgrade) {
			switch (this.level) {
				case 1:
					if(player.power >= 100) {
						player.power -= 100;
						this.upgradeCost = 250;
						this.level += 1;
						upgrade = false;
					}
					break;
				case 2:
					if(player.power >= 250) {
						player.power -= 250;
						this.upgradeCost = 500;
						this.level += 1;
						upgrade = false;
					}
					break;
			}
		}
		

		// Place mode
		if(this.placeMode) {
			previewUI = true;
			drawPreview(coreTile1, 'Core Reactor', 'Produces power and revives dead players.', 0)

			// Reset data
			this.hp = 100;

			player.drawPlaceMode(coreTile1, player.size*2, true);

			// When pressed move core position
			if(place === true && !player.drawPlaceMode(coreTile1, player.size*2, false) && play === 1) {
				this.pos.x = (Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel-25+player.pos.x) / 50) * 50)-50;
				this.pos.y = (Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel-25+player.pos.y) / 50) * 50)-50;
				this.placeMode = false;
				this.exists = true;
				ranCooldown = false;
				cooldownRemain = 0;
			}	
		}
	}

	drawUI(player) {
		if(this.interface) {
			//World pos
			var world = new Vector(this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel)

			//Define
			var coreUIoffset = 10 * relativeHeight;
			var fullHP = 100;
			var fullWidth = 150 * relativeHeight;
			var pixelPerHP = fullWidth / fullHP;
			var healthWidth = pixelPerHP * this.hp;
			var coreUISize = 220 * relativeHeight;
			var coreImageSize = coreUISize / 3 - coreUIoffset * 2;

			//Container pos
			var containerX = this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel - coreUISize + (core.actualSize / 2) * rectHeightRel;
			var containerY = this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel - coreUISize - coreUIoffset;

			//Define the center and bottom of the container
			var center = this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + (core.actualSize / 2) * rectHeightRel;
			var bottom = this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel - coreUISize - coreUIoffset + coreUISize;

			//Draw rounded UI container
			ctx.beginPath();
			ctx.globalAlpha = 0.3;
			ctx.fillStyle = 'Black';
			fillRoundedRect(containerX, containerY, coreUISize * 2, coreUISize, 5);
			fillRoundedRect(containerX, containerY, coreUISize * 2, coreUISize / 3, 5);
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
			ctx.fillRect(containerX + coreUIoffset + coreUIoffset / 4, containerY + coreUIoffset + coreUIoffset / 4, coreImageSize - coreUIoffset / 2, coreImageSize - coreUIoffset / 2);
			if(this.level === 1) {
				ctx.drawImage(coreTile1, containerX + coreUIoffset, containerY + coreUIoffset, coreImageSize, coreImageSize);
			} else if(this.level === 2) {
				ctx.drawImage(coreTile2, containerX + coreUIoffset, containerY + coreUIoffset, coreImageSize, coreImageSize);
			} else if(this.level === 3) {
				ctx.drawImage(coreTile3, containerX + coreUIoffset, containerY + coreUIoffset, coreImageSize, coreImageSize);
			}
			ctx.closePath();

			//Draw container text
			ctx.beginPath();
			ctx.font = "bold " + 15*relativeHeight + "px Pier";
	    	ctx.fillStyle = "White";
	    	ctx.textAlign="left";
	    	ctx.textBaseline="middle";  
			ctx.fillText('Core Reactor', containerX + coreUIoffset * 2 + coreImageSize, containerY + coreUIoffset * 2.2);
			ctx.fillText('Level ' + this.level, containerX + coreUIoffset * 2 + coreImageSize, containerY + coreUIoffset * 4);
			ctx.closePath();

			//Draw upgrade bar
			ctx.beginPath();
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = player.color;
			ctx.fillRect(containerX + coreUIoffset, containerY + coreUISize - coreUIoffset * 2 - coreUIoffset * 2, coreUISize * 2 - coreUIoffset * 2, coreUIoffset * 3);
			ctx.closePath();

			//Draw core upgrade text
			ctx.beginPath();
			ctx.globalAlpha = 1;
			ctx.font = "bold " + 15*relativeHeight + "px Pier";
	    	ctx.fillStyle = "White";
	    	ctx.textAlign="left"; 
	    	ctx.textBaseline="middle"; 
			ctx.fillText('Upgrade', containerX + coreUIoffset - coreUIoffset * 1.5 + coreUIoffset * 2, containerY + coreUISize - coreUIoffset * 2 - coreUIoffset * 2 + coreUIoffset * 1.5);
			ctx.textAlign="right"; 
			ctx.fillText('(Space) ' + this.upgradeCost + 'C/P', containerX + coreUIoffset - coreUIoffset * 2 + coreUISize * 2 - coreUIoffset * 2, containerY + coreUISize - coreUIoffset * 2 - coreUIoffset * 2 + coreUIoffset * 1.5);
			ctx.closePath();

			//Draw health
			ctx.beginPath();
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = player.color;
			ctx.fillRect(containerX + coreUISize * 2 - fullWidth - coreUIoffset, containerY + coreUIoffset * 2.1, healthWidth, coreUIoffset * 2);
			ctx.globalAlpha = 1;
			ctx.fillStyle = "White";
			ctx.textAlign="left";
			ctx.fillText((this.hp).toFixed(0) + '/' + '100', containerX + coreUISize * 2 - fullWidth, containerY + coreUIoffset * 2.1 + coreUIoffset);
			ctx.closePath();		
		}
	}

	drawLightning(player, players, deltaTime) {
		if(player.walls.length > 0 && this.exists && this.level === 3) {
			var size = canvas.width;
			var minSegmentHeight = 5;
			var groundHeight = canvas.height;
			var color = player.color;
			var roughness = 2;
			var maxDifference = size / 10;
			var randomwall = Math.floor(Math.random() * (player.walls.length));
			var currentOrigin = new Vector(this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + (Math.floor(Math.random() * player.actualSize * 2)), this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + (Math.floor(Math.random() * player.actualSize * 2)))
			var currentTarget = new Vector(player.walls[randomwall].pos.x, player.walls[randomwall].pos.y)
			var currentWall = randomwall;
		
			ctx.globalCompositeOperation = "lighter";

			function render(core) {
				ctx.shadowBlur = 15;
				ctx.shadowColor = color;
				ctx.strokeStyle = color;
				core.lightning = createLightning(currentTarget, currentOrigin);
				ctx.lineWidth = 5 * rectHeightRel;
				for (var i = 0; i < core.lightning.length; i++) {
				  ctx.lineTo(core.lightning[i].x, core.lightning[i].y);
				}
			  	ctx.stroke();
			  	//requestAnimationFrame(render);
			}

			if(player.walls.length > 1) {
				while(Math.floor(Math.random() * 5) === 1) {
					currentOrigin.x = currentTarget.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + (Math.floor(Math.random() * player.actualSize)) * rectHeightRel;
					currentOrigin.y = currentTarget.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + (Math.floor(Math.random() * player.actualSize)) * rectHeightRel;
					var randomwall = Math.floor(Math.random() * (player.walls.length));
					currentWall = randomwall;
					for (var i = 0; i < player.walls.length; i++) {
						if(currentOrigin.x - player.walls[randomwall].pos.x > 400 - currentOrigin.x  || currentOrigin.x - player.walls[randomwall].pos.x < -400 || currentOrigin.y - player.walls[randomwall].pos.y > 400 - currentOrigin.y || currentOrigin.y - player.walls[randomwall].pos.y < -400) {
							randomwall = Math.floor(Math.random() * (player.walls.length));
						}
					}
					currentWall = randomwall;
					currentTarget.x = player.walls[randomwall].pos.x;
					currentTarget.y = player.walls[randomwall].pos.y;
					
					ctx.shadowBlur = 30;
					ctx.shadowColor = 'black';
					core.lightning = createLightning(currentTarget, currentOrigin);
					ctx.beginPath();
					ctx.lineWidth = 5;
					for (var i = 0; i < core.lightning.length; i++) {
					  ctx.lineTo(core.lightning[i].x, core.lightning[i].y);
					}
				  	ctx.stroke();
				  	ctx.shadowColor = "transparent";
				}
			}

			function createLightning(cTarget, cOrigin) {
				var segmentHeight = groundHeight - cOrigin.y;
				var lightning = [];
				lightning.push({x: cOrigin.x, y: cOrigin.y});
				
			  	lightning.push({x: cTarget.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + (Math.floor(Math.random() * player.actualSize)) * rectHeightRel, y: cTarget.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + (Math.floor(Math.random() * player.actualSize)) * rectHeightRel});

			  	var currDiff = maxDifference;
				while (segmentHeight > minSegmentHeight) {
			    var newSegments = [];
			   		for (var i = 0; i < lightning.length - 1; i++) {
				      var start = lightning[i];
				      var end = lightning[i + 1];
				      var midX = (start.x + end.x) / 2;
				      var newX = midX + (Math.random() * 2 - 1) * currDiff;
				      newSegments.push(start, {x: newX, y: (start.y + end.y) / 2});
				    }
				    newSegments.push(lightning.pop());
				    lightning = newSegments;
				    
				    currDiff /= roughness;
				    segmentHeight /= 2;
				}
				return lightning;
			}

			render(this);
			ctx.shadowColor = "transparent";
			ctx.globalCompositeOperation = "source-over";
			ctx.restore();
		}
	}

	draw(player, deltaTime) {
		this.update(player, deltaTime);

		// Draw the Core
		if(this.exists && inScreen(this.pos.x, this.pos.y, player)) {
			
			if(this.level === 3) {
				// Draw extra halo
				ctx.beginPath();
				ctx.fillStyle = 'Black';
				ctx.globalAlpha = 0.08;
				ctx.filter = "blur(25px)";
				ctx.arc(this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size, player.size * 4, 0, 2 * Math.PI);
				ctx.fill();
				ctx.filter = "none";
				ctx.globalAlpha = 1;
				ctx.closePath()
			}

			
			// Draw core halo
			ctx.beginPath();
			ctx.fillStyle = player.color;
			ctx.globalAlpha = 0.2;
			ctx.filter = "blur(25px)";
			ctx.arc(this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size, player.size * 2, 0, 2 * Math.PI);
			ctx.fill();
			ctx.filter = "none";
			ctx.closePath()
			ctx.globalAlpha = 1;
			

			// Draw core background
			ctx.beginPath();
			ctx.fillStyle = player.color;
			ctx.fillRect(this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 10, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 10, player.size * 2 - player.size / 5, player.size * 2 - player.size / 5);
			ctx.closePath()
				
			// Draw core image
			if(this.level === 1) {
				ctx.drawImage(coreTile1, this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size * 2, player.size * 2);
			} else if(this.level === 2) {
				ctx.drawImage(coreTile2, this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size * 2, player.size * 2);
			} else if(this.level === 3) {
				ctx.drawImage(coreTile3, this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size * 2, player.size * 2);
			}

			// Draw core health
			if (this.hp < 100) {
				ctx.fillStyle = player.color;
				ctx.fillRect(this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size * 2.2, this.hp*rectHeightRel, player.size / 4);
				ctx.closePath()
			}
		}
	}
}