var Vector = require('./vector.js')
module.exports = class Player {
	constructor(canvas, color) {

		// Initialize variables
		this.name = "Player";
		this.color = color;

		// Size
		var baseScreenHeight = 939;
		this.actualSize = 50;
		
		// World and Client position
		this.pos = new Vector(0, 0);
		this.positionBuffer = [];
		this.tick = 0;

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
		this.then = +new Date();

	}
	move(input, deltaTime, players) {
		this.size = this.actualSize * rectHeightRel;

		// Draw the projectiles and move the projetiles
		for (var i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].move(deltaTime);

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

			if (Math.pow(direction.x, 2) > 0 || Math.pow(direction.y, 2) > 0) {
				this.positionBuffer = [];
				player.moved = true;
			} else {
				player.moved = false;
			}

			this.pos.x += direction.x
			if (this.checkCollision(players)) {
				this.pos.x -= direction.x;
			}
			this.pos.y -= direction.y;
			if (this.checkCollision(players)) {
				this.pos.y += direction.y;
			}
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
	}

	static checkCollision(players, player) {
		for (var j = 0; j < players.length; j++) {
			for (var i = 0; i < players[j].walls.length; i++) {
				var wall = players[j].walls[i].pos
				if (player.pos.x+player.actualSize/2*5/6 > wall.x && player.pos.x-player.actualSize/2*5/6 < wall.x+player.actualSize && player.pos.y+player.actualSize/2*5/6 > wall.y && player.pos.y-player.actualSize/2*5/6 < wall.y+player.actualSize) {
					console.log("yes")
					return true;
				}
			}

			if (players[j].core && players[j].core.exists && player.pos.x+player.actualSize/2*5/6 > players[j].core.pos.x && player.pos.x-player.actualSize/2*5/6 < players[j].core.pos.x + players[j].core.actualSize && player.pos.y+player.actualSize/2*5/6 > players[j].core.pos.y && player.pos.y-player.actualSize/2*5/6 < players[j].core.pos.y + players[j].core.actualSize) {
				return true;
			}
		}
	}
	hitDetection(players, socket, radius) {
		for (var i = 0; i < this.projectiles.length; i++) {

			// PLayer hit detection
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

								console.log('HIT')

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

		// UPDATE SCORE - TO BE PUT ON THE SERVER
		//Time increse
		this.score += 0.05*delta/1000*3/5*2;
		//Increse for walls
		for (var i = 0; i < this.walls.lengthQ; i++) {
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
		this.score += 0.001*(this.power)*delta/1000*3/5*2;
	}
}