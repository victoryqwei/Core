class Player {
	constructor(canvas, color) {

		// Initialize variables
		this.name = "Player";
		this.color = color;

		// Size
		var baseScreenHeight = 939;
		this.actualSize = 50;
		this.mass = 50;
		
		// World and Client position
		this.pos = new Vector(0, 0);
		this.positionBuffer = [];
		this.tick = 0;
		this.inputStamps = [];

		// Angle (Direction of the player)
		this.angle = 0;
		this.angleBuffer = [];

		// Speed
		this.speed = 30;

		// Shooting
		this.cooldownDelay = 300;
		this.cooldown = 0;
		this.projectiles = [];

		// Class Type
		this.class = {
			name: "soldier",
			value: 0
		}
		this.barrelSize = 50;
		this.barrelLength = 50;

		// Arena size
		this.arenaSize = 0;

		// Tiles
		this.walls = [];
		this.modules = [];

		// Access range
		this.accessRange = 8;
		this.maxView = 0.7;

		// Power
		this.power = 0;
		this.core = undefined;

		// Hitpoint
		this.maxHP = 50;
		this.hp = 50;
		this.dead = false;
		this.killerId = undefined;
		this.killerName = undefined;
		this.resetTime = 0;
		this.resetDelay = 3000;
		this.invulnerable = false;
		this.damage = 10;

		// Messages
		this.messages = []

		//Score
		this.score = 0;

		//Kills
		this.killCount = 0;
		this.killStreak = 0;

		// Actual delta?
		this.actual = +new Date();

		// Player team
		this.team = undefined;
	}
	move(input, deltaTime, players) {
		if(this.hp > (this.maxHP + 1)) {
			location.reload(true);
		}
		this.size = this.actualSize * rectHeightRel;

		// Draw the projectiles and move the projetiles
		for (var i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].move(deltaTime, this.class);

			if (this.projectiles[i].timeAlive > this.projectiles[i].timeLimit) {
				this.projectiles[i] = undefined;
			}
		}

		this.projectiles = this.projectiles.filter(function (el) {
		  	return el != undefined;
		});

		if (play === 1) {
			var direction = new Vector(0, 0);
			for (var a in input) {
				switch (input[a]) {
					case 65: // left
						if(this.pos.x > -this.arenaSize) {
							direction.x -= 1;
						} else {
							this.pos.x = -this.arenaSize;
						}
						break;
					case 87: // up
						if(this.pos.y > -this.arenaSize) { 
							direction.y += 1;
						} else {
							this.pos.y = -this.arenaSize;
						}
						break;
					case 68: // right
						if(this.pos.x < this.arenaSize) { 
							direction.x += 1;
						} else {
							this.pos.x = this.arenaSize;
						}
						break;
					case 83: // down
						if(this.pos.y < this.arenaSize) { 
							direction.y -= 1;
						} else {
							this.pos.y = this.arenaSize;
						}
						break;
				}
			}

			direction.normalize();
			direction.mult(this.speed / (averageFps) * 10);

			var noMovement = true;
			for (var i = 0; i < this.inputStamps.length; i++) {
				if (this.inputStamps[i].input.length > 0) {
					noMovement = false;
				}
			}

			if ((Math.pow(direction.x, 2) > 0 || Math.pow(direction.y, 2) > 0)) { // If input is moving
				this.positionBuffer.shift();
				player.moved = true;
			} else { // If input is not moving
				player.moved = false;
			}

			this.pos.x += direction.x;
			if (this.checkCollision(players)) {
				this.pos.x -= direction.x;
			}
			this.pos.y -= direction.y;
			if (this.checkCollision(players)) {
				this.pos.y += direction.y;
			}

			for (var j = 0; j < powerBalls.length; j++) {
				var distance = Math.sqrt(Math.pow(powerBalls[j].pos.x - this.pos.x, 2) + Math.pow(powerBalls[j].pos.y - this.pos.y, 2))
				if (distance < 20) {
					powerBalls[j] = undefined;
				}
			}
			powerBalls = powerBalls.filter(function (el) {
			  	return el != undefined;
			});
			
		}

		// Spectator movement
			
		if (play === 0 && players.length > 0) {
			var killerExists = false;
			// Show the killer / Spectate the killer
			for (var i = 0; i < players.length; i++) {
				if (!players[i].dead && players[i].id === this.killerId && this.dead) {
					killerExists = true;
					this.pos = new Vector(players[i].pos.x, players[i].pos.y);
				}
			}
			// Show the highest person on leaderboard
			if (!killerExists) {
				var highestPower = {
					power: 0,
					pos: new Vector(0, 0)
				}
				for (var i = 0; i < players.length; i++) {
					if (players[i].power > highestPower.power) {
						highestPower = players[i];
					}
				}
				this.pos = new Vector(highestPower.pos.x, highestPower.pos.y);
			}
		} else if (play === 3) {
			this.pos = new Vector(0, 0);
			rectHeightRel = canvas.height / (arenaSize * 2.1)
		}
	}
	checkCollision(players) {
		for (var j = 0; j < players.length; j++) {
			for (var i = 0; i < players[j].walls.length; i++) {
				var wall = players[j].walls[i].pos
				if (this.pos.x+this.actualSize/2*5/6 > wall.x && this.pos.x-this.actualSize/2*5/6 < wall.x+this.actualSize && this.pos.y+this.actualSize/2*5/6 > wall.y && this.pos.y-this.actualSize/2*5/6 < wall.y+this.actualSize) {
					return true;
				}
			}
			if (players[j].core && players[j].core.exists && this.pos.x+this.actualSize/2*5/6 > players[j].core.pos.x && this.pos.x-this.actualSize/2*5/6 < players[j].core.pos.x + players[j].core.actualSize && this.pos.y+this.actualSize/2*5/6 > players[j].core.pos.y && this.pos.y-this.actualSize/2*5/6 < players[j].core.pos.y + players[j].core.actualSize) {
				return true;
			}
		}
		/*for (var k = 0; i < arenaDeadSpots.length; k++) {
			if (this.pos.x+this.actualSize/2*5/6 > arenaDeadSpots[k].x && this.pos.x-this.actualSize/2*5/6 < arenaDeadSpots[k].x+this.actualSize && this.pos.y+this.actualSize/2*5/6 > arenaDeadSpots[k].y && this.pos.y-this.actualSize/2*5/6 < arenaDeadSpots[k].y+this.actualSize) {
				return true;
			}
		}*/
	}
	hitDetection(players, socket, radius) {
		for (var i = 0; i < this.projectiles.length; i++) {

			// Player hit detection
			for (var j = 0; j < players.length; j++) {
				if (this.projectiles[i] && !players[j].dead) {
					var playerPos = new Vector(players[j].pos.x, players[j].pos.y);
					playerPos.sub(this.projectiles[i].pos)
					var distance = playerPos.getMag();
					if (distance <= (this.projectiles[i].actualSize/2 + this.actualSize/2)) {
						// Explosion detection
						if (this.class.value === 3 && radius === 1) {
							this.hitDetection(players, socket, this.projectiles[i].radius)
						}

						socket.emit('detectHit', {
							type: 'player',
							id: players[j].id,
							playerName: players[j].name,
							player: players[j],
							killerId: socket.id,
							name: this.name,
							damage: this.damage,
						});
						// Remove the bullet
						if (this.projectiles[i]) {
							this.projectiles[i].delete = true;
						}
					}
				}
			}

			// Hit detection with arena borders
			if (this.projectiles[i] && (this.projectiles[i].pos.x < -arenaSize || this.projectiles[i].pos.x > arenaSize || this.projectiles[i].pos.y < -arenaSize || this.projectiles[i].pos.y > arenaSize)) {
				this.projectiles[i].delete = true;
			}

			this.walls = this.walls.filter(function (el) {
			  return el != undefined;
			});

			// Hit detection related with players
			for (var j = 0; j < players.length; j++) {
				// Hit detection with cores
				if (this.projectiles[i] && this.projectiles[i].pos && players[j].core && players[j].core.exists) {
					var corePos = new Vector(players[j].core.pos.x+players[j].core.actualSize/2, players[j].core.pos.y+players[j].core.actualSize/2);
					corePos.sub(this.projectiles[i].pos);
					var distance = corePos.getMag();
					if (distance <= (core.actualSize/2 + this.projectiles[i].actualSize/2)*radius) {
						// Explosion radius
						if (this.class.value === 3 && radius === 1) {
							this.hitDetection(players, socket, this.projectiles[i].radius)
						}

						// Remove the bullet
						if (this.projectiles[i]) {
							this.projectiles[i].delete = true;
						}

						// Damage the core
						socket.emit('detectHit', {
							type: 'core',
							id: players[j].id,
							damage: this.damage
						})
					}
				}

				// Hit detection with players walls
				if (players[j].walls) {
					for (var k = 0; k < players[j].walls.length; k++) {
						if (this.projectiles[i] && this.projectiles[i].pos) {
							var wallPos = new Vector(players[j].walls[k].pos.x+25, players[j].walls[k].pos.y+25);
							wallPos.sub(this.projectiles[i].pos);
							var distance = wallPos.getMag();
							if (distance <= (25 + this.projectiles[i].actualSize/2)*radius) {

								if (this.class.value === 3 && radius === 1) {
									this.hitDetection(players, socket, this.projectiles[i].radius)
								}

								// Remove the bullet
								if (this.projectiles[i]) {
									this.projectiles[i].delete = true;
								}

								// Damage the players wall
								socket.emit('detectHit', {
									wallId: players[j].walls[k].id,
									id: players[j].id,
									type: "wall",
									damage: this.damage
								});
							}
						}
					}
				}



				if (players[j].modules) {
					for (var k = 0; k < players[j].modules.length; k++) {
						if (this.projectiles[i] && this.projectiles[i].pos) {
							var modulePos = new Vector(players[j].modules[k].pos.x+25, players[j].modules[k].pos.y+25);
							modulePos.sub(this.projectiles[i].pos);
							var moddistance = modulePos.getMag();
							if (moddistance <= (25 + this.projectiles[i].actualSize/2)*radius) {

								if (this.class.value === 3 && radius === 1) {
									this.hitDetection(players, socket, this.projectiles[i].radius)
								}

								// Remove the bullet
								if (this.projectiles[i]) {
									this.projectiles[i].delete = true;
								}

								// Damage the players wall
								socket.emit('detectHit', {
									moduleId: players[j].modules[k].id,
									id: players[j].id,
									type: "module",
									damage: this.damage
								});
							}
						}
					}
				}
			}

			if (this.projectiles[i] && this.projectiles[i].delete) {
				this.projectiles[i] = undefined;
			}
		}

		this.projectiles = this.projectiles.filter(function (el) {
		  return el != undefined;
		});
	}
	updateRatio(ratio) {
		this.size = 50 * ratio;

		for (var i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].size = 20 * ratio;
			this.projectiles[i].rectHeightRel = ratio;
		}
	}
	update(mouse, deltaTime) {
		if (mouseDown && this.cooldown <= 0 && !placeMode && !core.placeMode) {
			var bulletPos = this.pos.copy();
			var currentAngle = this.angle.copy();
			currentAngle.div(rectHeightRel)
			bulletPos.add(currentAngle);

			var mousePos = new Vector(mouse.x, mouse.y);
			var target = new Vector(canvas.width/2, canvas.height/2);
			target.sub(mousePos);
			target.mult(-1);
			target.normalize();
			target.mult(100);

			var randomTarget = target.copy();

			if (this.class.value == 2) {
				randomTarget.x += Math.random()*40-20;
				randomTarget.y += Math.random()*40-20;
			}

			this.projectiles.push(new Bullet(bulletPos, randomTarget, socket.id, rectHeightRel, player.class))
				
			this.cooldown = this.cooldownDelay;
		} else {
			this.cooldown -= deltaTime
		}
/*
		// UPDATE SCORE - TO BE PUT ON THE SERVER
		//Time increse
		this.score += 0.05*delta/1000*3/5*2;
		//Increse for walls
		for (var i = 0; i < this.walls.length; i++) {
			if(this.walls[i].level === 1) {
				this.score += 0.001*(this.walls[i].level)*delta/1000*3/5*2;
			}
		}
		//Increse for core level
		if(this.core.exists) {
			this.score += 0.05*(this.core.level * 5)*delta/1000*3/5*2;
		}
		//Increse score based on kills
		this.score += 0.005*(this.killCount)*delta/1000*3/5*2;

		//Increase score based on power
		this.score += 0.001*(this.power)*delta/1000*3/5*2;*/
	}

	// CLIENT NOT ON SERVER --------------------------------------------------------
	send(socket, core, rawInput, deltaTime) {
		var playerData = {
			id: socket.id,
			pos: this.pos,
			positionBuffer: this.positionBuffer,
			size: this.size,
			actualSize: this.actualSize,
			speed: this.speed,
			name: this.name,
			color: this.color,
			angle: this.angle,
			angleBuffer: this.angleBuffer,
			projectiles: this.projectiles,
			core: core,
			ability: ability,
			walls: this.walls,
			power: this.power,
			dead: this.dead,
			time: Date.now(),
			hp: this.hp,
			maxHP: this.maxHP,
			score: this.score,
			killCount: this.killCount,
			killStreak: this.killStreak,
			barrelSize: this.barrelSize,
			barrelLength: this.barrelLength,
			modules: this.modules,
			moved: true,
			class: this.class,
			mass: this.mass
		}
		socket.emit('update', playerData);

		var data = {
			input: rawInput,
			mouse: [],
			delta: deltaTime,
			time: Date.now()
		}

		this.inputStamps.push(data);

		socket.emit('input', data);
	}
	updatePlayer(data) {
		// Update
		arenaSize = data.arenaSize;
		this.arenaSize = data.arenaSize;

		//this.pos = new Vector(data.pos.x, data.pos.y);
		// Draw the body
		this.server = data;

		// Determine distance of server and client
		var distance = this.pos.dist(this.pos, new Vector(data.pos.x, data.pos.y));
		//console.log("Distance: " + this.pos.dist(this.pos, new Vector(data.pos.x, data.pos.y)))

		// Interpolate the current player
		player.positionBuffer.push([+new Date(), new Vector(data.pos.x, data.pos.y)])

		// Remove authoritated input stamps from the player
		for (var i = 0; i < this.inputStamps.length; i++) {
			if (data.lastTick > this.inputStamps[i].time) {
				this.inputStamps[i] = undefined;
			}
		}
		this.inputStamps = this.inputStamps.filter(function (el) {
		  return el != undefined;
		});
		
		// Add player power according to balls
		if (Number.isInteger(data.addPower)) {
			player.power += data.addPower;
		}

		// Update player data based on the authorative server
		if (data.class.name == "soldier") {
			player.cooldownDelay = 300;
			player.damage = 10;
			player.speed = 22;
			player.maxHP = 50;
		} else if (data.class.name == "sniper") {
			player.cooldownDelay = 1000;
			player.damage = 25;
			player.barrelSize = 20;
			player.speed = 16;
			player.maxHP = 50;
		} else if (data.class.name == "heavy") {
			player.cooldownDelay = 30;
			player.damage = 2;
			player.barrelSize = 30;
			player.speed = 20;
			player.maxHP = 50;
		} else if (data.class.name == "cannoneer") {
			player.cooldownDelay = 800;
			player.damage = 10;
			player.barrelSize = 60;
			player.speed = 15;
			player.maxHP = 80;
		}
		if (data.team) {
			this.team = data.team;
		}
	}
	clearPlaceMode(tileSelect0, tileSelect1, tileSelect2) {
		tileSelect0.placeMode = tileSelect1.placeMode = tileSelect2.placeMode = false;
		tileSelect0.placeToggle = tileSelect1.placeToggle = tileSelect2.placeToggle = false;
		if(tileSelect0 == tile || tileSelect1 == tile || tileSelect2 == tile) {
			placeMode = placeToggle = false;
		}
	}
	drawWalls() {
		//Render walls for self
		for(var i = 0; i < this.walls.length; i++) {
			Tile.draw(this.walls[i]);
		}
	}
	draw(deltaTime) {
		// Clear undefined
		this.projectiles = this.projectiles.filter(function (el) {
		  return el != undefined;
		});
		// Draw projectiles
		for (var i = 0; i < this.projectiles.length; i++) {
			if (inScreen(this.projectiles[i].pos.x, this.projectiles[i].pos.y, this)) {
				this.projectiles[i].draw();
			}
		}

		if (this.server) {
			var clientX = canvas.width/2/*+(this.pos.x-this.server.pos.x)*rectHeightRel/5*/;
			var clientY = canvas.height/2/*+(this.pos.y-this.server.pos.y)*rectHeightRel/5*/;
			
			// Draw hp
			ctx.beginPath();
			ctx.strokeStyle = "black";
			ctx.lineWidth = 12 * rectHeightRel;
			ctx.lineCap = "round";
			ctx.moveTo(this.pos.x+clientX-this.pos.x-this.size*3/4, this.pos.y+clientY-this.pos.y + this.size*3/4)
			ctx.lineTo(this.pos.x+clientX-this.pos.x-this.size*3/4+(this.hp/this.maxHP*75)*rectHeightRel, this.pos.y+clientY-this.pos.y + this.size*3/4)
			ctx.stroke();
			if (this.team) {
				ctx.strokeStyle = this.team;
			} else {
				ctx.strokeStyle = this.color;
			}
			
			ctx.lineWidth = 10 * rectHeightRel;
			ctx.stroke();
			ctx.lineCap = "butt";

			// Draw the cannon
			var vector = new Vector(clientX, clientY);
			ctx.beginPath();
			ctx.strokeStyle = "grey";
			ctx.lineWidth = this.barrelSize/2*rectHeightRel
			ctx.moveTo(vector.x, vector.y);
			vector.sub(mouse);
			vector.normalize();
			vector.mult(-this.barrelLength*rectHeightRel);
			this.angle = vector.copy();
			ctx.lineTo(vector.x+clientX, vector.y+clientY);
			ctx.stroke();
			ctx.closePath();

			// Draw the body
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.arc(clientX, clientY, this.size/2, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath()
			ctx.beginPath();
			if (this.team) {
				ctx.fillStyle = this.team;
			} else {
				ctx.fillStyle = this.color;
			}
			
			ctx.arc(clientX, clientY, this.size/2.3, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath()

			//Draw the text
			ctx.beginPath();
	    	ctx.font = "13px Pier";
	    	ctx.fillStyle = "Black";
	    	ctx.textAlign="center";
	    	ctx.textBaseline = "bottom";
			ctx.fillText(this.name, this.pos.x+clientX-this.pos.x, this.pos.y+clientY-this.pos.y - this.size/2);
			ctx.closePath()
			//Reset text align
			ctx.textAlign="start"; 

			// Draw messages
			this.drawMessages();

			// Draw server
			if (advancedOptions) {
				ctx.beginPath();
				ctx.lineWidth = 2*rectHeightRel;
				ctx.strokeStyle = player.color;
				ctx.arc(this.server.pos.x*rectHeightRel+clientX-player.pos.x*rectHeightRel, this.server.pos.y*rectHeightRel+clientY-player.pos.y*rectHeightRel, player.size/2, 0, 2 * Math.PI, false);
				ctx.stroke();
				ctx.closePath()
			}
		}
	}
	drawMessages() {
		if (this.messages[0]) {
			ctx.beginPath();
			ctx.textAlign = "center"
			ctx.fillText(this.messages[0], canvas.width/2, 20);
		}	
	}
	drawPlaceMode(imageName, highlightSize, draw) {
		if(draw) {
			// Draw player access range
			ctx.beginPath();
			ctx.globalAlpha = 0.1;
			ctx.fillStyle = 'Black';
			ctx.arc(canvas.width/2, canvas.height/2, player.size*player.accessRange, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();

			// Draw player denial range
			for (var i = 0; i < players.length; i++) {
				if (!players[i].dead) {
					ctx.beginPath();
					ctx.fillStyle = 'red';
					ctx.arc((players[i].pos.x)*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, (players[i].pos.y)*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.actualSize*2*rectHeightRel, 0, 2 * Math.PI, false);
					ctx.fill();
				}
			}

			// Draw core denial range
			for (var i = 0; i < players.length; i++) {
				if (players[i].core.exists) {
					ctx.beginPath();
					ctx.fillStyle = 'red';
					ctx.arc((players[i].core.pos.x+player.core.actualSize/2)*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, (players[i].core.pos.y+player.core.actualSize/2)*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.core.actualSize*3*rectHeightRel, 0, 2 * Math.PI, false);
					ctx.fill();
				}
			}
		}

		// Get the positions of the mouse
		if(imageName == coreTile1 || imageName == abilityUpgrader) {
		var x = ((Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel-25+player.pos.x) / 50) * 50)-50)*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel;
		var y = ((Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel-25+player.pos.y) / 50) * 50)-50)*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel;
		var world = new Vector((Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel-25+player.pos.x) / 50) * 50)-50, (Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel-25+player.pos.y) / 50) * 50)-50)
		} else {
		var x = ((Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel+player.pos.x) / 50) * 50)-50)*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel;
		var y = ((Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel+player.pos.y) / 50) * 50)-50)*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel;
		var world = new Vector(((Math.ceil(((mouse.x-canvas.width/2)/rectHeightRel+player.pos.x) / 50) * 50)-50), ((Math.ceil(((mouse.y-canvas.height/2)/rectHeightRel+player.pos.y) / 50) * 50)-50))
		}

		// World postions and access area
		var obstruction = false;
		var distance = new Vector((mouse.x-canvas.width/2), (mouse.y-canvas.height/2))
		if(imageName == coreTile1) {
			var withinArena = world.x > (-arenaSize-50) && world.x < (arenaSize-50) && world.y > (-arenaSize-50) && world.y < (arenaSize-50);
		} else {
			var withinArena = world.x > (-arenaSize-50) && world.x < arenaSize && world.y > (-arenaSize-50) && world.y < arenaSize;
		}

		if(imageName == wallTile || imageName == wallTile2 || imageName == wallTile3 || imageName == wallTile4) {
			obstruction = false;
		} else {
			if(imageName == coreTile1 || imageName == abilityUpgrader) {
				for (var i = 0; i < player.walls.length; i++) {
					if (player.walls[i].pos.x === world.x && player.walls[i].pos.y === world.y || player.walls[i].pos.x-50 === world.x && player.walls[i].pos.y-50 === world.y || player.walls[i].pos.x === world.x && player.walls[i].pos.y-50 === world.y || player.walls[i].pos.x-50 === world.x && player.walls[i].pos.y === world.y) {
						obstruction = true;
					}
				}
			} else {
				for (var i = 0; i < player.walls.length; i++) {
					if (player.walls[i].pos.x === world.x && player.walls[i].pos.y === world.y) {
						obstruction = true;
					}
				}
			}
		}

		// Make sure it's far enough from other people's walls
		for (var i = 0; i < players.length; i++) {
			for (var j = 0; j < players[i].walls.length; j++) {
				var wallDistance = new Vector(players[i].walls[j].pos.x, players[i].walls[j].pos.y)
				wallDistance.sub(new Vector(world.x+25, world.y+25));
				if (wallDistance.getMag() < player.actualSize) {
					obstruction = true;
				}
			}	
		}

		// Make sure it's far enough from other people's modules
		for (var i = 0; i < players.length; i++) {
			for (var j = 0; j < players[i].modules.length; j++) {
				var wallDistance = new Vector(players[i].modules[j].pos.x, players[i].modules[j].pos.y)
				wallDistance.sub(new Vector(world.x+25, world.y+25));
				if (wallDistance.getMag() < player.actualSize) {
					obstruction = true;
				}
			}	
		}

		// Make sure it's far enough from other people
		for (var i = 0; i < players.length; i++) {
			if (!players[i].dead) {
				var playerDistance = new Vector(players[i].pos.x, players[i].pos.y)
				playerDistance.sub(new Vector(world.x+50, world.y+50));
				if (playerDistance.getMag() < player.actualSize * 2) {
					obstruction = true;
				}	
			}
		}

		// Make sure it's far enough from other peoples core
		for (var i = 0; i < players.length; i++) {
			if (players[i].core.exists) {
				var coreDistance = new Vector(players[i].core.pos.x + players[i].core.actualSize/2, players[i].core.pos.y + players[i].core.actualSize/2)
				coreDistance.sub(new Vector(world.x+25, world.y+25));
				if (coreDistance.getMag() < players[i].core.actualSize*3) {
					obstruction = true;
				}
			}
		}

		//Make sure it's far enough from own core
		if (player.core.exists) {
			var coreDistance = new Vector(player.core.pos.x + player.core.actualSize/2, player.core.pos.y + player.core.actualSize/2)
			coreDistance.sub(new Vector(world.x+25, world.y+25));
			if (coreDistance.getMag() < player.core.actualSize /2) {
				obstruction = true;
			}
		}

		//Make sure it's far enough from your own modules
		if(imageName == coreTile1 || imageName == abilityUpgrader) {
			for (var i = 0; i < player.modules.length; i++) {
				if (player.modules[i].pos.x === world.x && player.modules[i].pos.y === world.y || player.modules[i].pos.x-50 === world.x && player.modules[i].pos.y-50 === world.y || player.modules[i].pos.x === world.x && player.modules[i].pos.y-50 === world.y || player.modules[i].pos.x-50 === world.x && player.modules[i].pos.y === world.y) {
					obstruction = true;
				}
			}
		} else {
			for (var i = 0; i < player.modules.length; i++) {
				if (player.modules[i].pos.x === world.x && player.modules[i].pos.y === world.y) {
					obstruction = true;
				}
			}
		}

		if(!withinArena) {
			obstruction = true;
		}

		if(distance.getMag() > player.size*player.accessRange) {
			obstruction = true;
		}

		if(draw) {
			// Draw correct highlight color
			ctx.beginPath();
			if (distance.getMag() < player.size*player.accessRange && withinArena && !obstruction && play === 1) {
				ctx.fillStyle = "lime";
			} else {
				ctx.fillStyle = "red";
			}

			ctx.globalAlpha = 0.5;
			ctx.fillRect(x, y, highlightSize, highlightSize);
			ctx.globalAlpha = 0.7;
			ctx.drawImage(imageName, x, y, highlightSize, highlightSize);
			ctx.globalAlpha = 1;
			ctx.closePath();
		}

		return obstruction;
	}
}

// Interpolation function

function interpolateEntities(entities, isProjectiles) {
	var now = +new Date(); 
	var serverUpdateRate = 100;
	var render_timestamp = now - (1000.0 / serverUpdateRate);

	for (var i in entities) { 
    	var entity = entities[i];

    	/*if (entity.timeAlive < 200 && isProjectiles) {
    		continue;
    	}*/

    	// Find the two authoritative positions surrounding the rendering timestamp.
    	var buffer = entity.positionBuffer;
  
    	// Drop older positions.
    	while (buffer.length >= 2 && buffer[1][0] <= render_timestamp) {
      		buffer.shift();
   		}

    	// Interpolate between the two surrounding authoritative positions.
    	if (buffer.length >= 2 && buffer[0][0] <= render_timestamp && render_timestamp <= buffer[1][0]) {
	      	var x0 = buffer[0][1].x;
	      	var x1 = buffer[1][1].x;
	      	var y0 = buffer[0][1].y;
	      	var y1 = buffer[1][1].y;
	      	var t0 = buffer[0][0];
	      	var t1 = buffer[1][0];

	      	entity.x = x0 + (x1 - x0) * (render_timestamp - t0) / (t1 - t0);
	      	entity.y = y0 + (y1 - y0) * (render_timestamp - t0) / (t1 - t0);
	    }
	}
}

function interpolateAngle(entity) {
	var now = +new Date(); 
	var serverUpdateRate = 10;
	var render_timestamp = now - (1000.0 / serverUpdateRate);
	var buffer = entity.angleBuffer;

	// Drop older positions.
	while (buffer.length >= 2 && buffer[1][0] <= render_timestamp) {
  		buffer.shift();
		}

	// Interpolate between the two surrounding authoritative positions.
	if (buffer.length >= 2 && buffer[0][0] <= render_timestamp && render_timestamp <= buffer[1][0]) {
      	var x0 = buffer[0][1].x;
      	var x1 = buffer[1][1].x;
      	var y0 = buffer[0][1].y;
      	var y1 = buffer[1][1].y;
      	var t0 = buffer[0][0];
      	var t1 = buffer[1][0];

      	entity.angle.x = x0 + (x1 - x0) * (render_timestamp - t0) / (t1 - t0);
      	entity.angle.y = y0 + (y1 - y0) * (render_timestamp - t0) / (t1 - t0);
    }
}