class Bullet {
	constructor(worldPos, target, id, ratio, playerClass) {
		// Size
		this.actualSize = 20;

		this.start = worldPos.copy();
		this.pos = worldPos.copy();
		this.positionBuffer = [];

		this.speed = 75;

		// Set the movement for the projectile
		// Move projectile to closest player
		this.mouse = mouse.copy();
		this.target = target.copy();
		/*var distance = Infinity;
		var closest = undefined;
		for (var i = 0; i < players.length; i++) {
			if (Math.sqrt(Math.pow(players[i].pos.x-player.pos.x, 2) + Math.pow(players[i].pos.y-player.pos.y, 2))<distance) {
				distance = Math.sqrt(Math.pow(players[i].pos.x-player.pos.x, 2) + Math.pow(players[i].pos.y-player.pos.y, 2));
				closest = players[i];
			}
		}
		this.target = new Vector(closest.pos.x-this.pos.x, closest.pos.y-this.pos.y);*/

		this.id = randomString(10);

		// Time
		this.timeAlive = 0;
		this.time = Date.now();
		this.timeLimit = 3000;

		// Explosion radius
		this.radius = 1;

		// Change bullet type based on class
		switch (playerClass.value) {
			case 0:

				break;
			case 1:
				this.actualSize = 10;
				this.speed = 200;
				break;
			case 2:
				this.actualSize = 15;
				this.speed = 40;
				break;
			case 3:
				this.actualSize = 40;
				this.speed = 50;
				this.radius = 2;
				this.timeLimit = 1500;
				break;
		}
	}
	move(deltaTime) {
		// AIMBOT
		/*var dead = true;
		for (var i = 0; i < players.length; i++) {
			if (!players[i].dead) {
				dead = false;
			}
		}
		if (!dead) {
			// Move projectile to closest player
			var distance = Infinity;
			var closest = undefined;
			for (var i = 0; i < players.length; i++) {
				if (Math.sqrt(Math.pow(players[i].pos.x-player.pos.x, 2) + Math.pow(players[i].pos.y-player.pos.y, 2))<distance) {
					distance = Math.sqrt(Math.pow(players[i].pos.x-player.pos.x, 2) + Math.pow(players[i].pos.y-player.pos.y, 2));
					closest = players[i];
				}
			}
			this.target = new Vector(closest.pos.x-this.pos.x, closest.pos.y-this.pos.y);
		}*/
		this.size = this.actualSize * rectHeightRel;

		this.target.normalize();
		this.target.mult(this.speed*deltaTime/100);
		this.pos.add(this.target)

		this.timeAlive += deltaTime;
	}
	draw() {
		if (player.class.value != 1) {
			ctx.beginPath();
			ctx.arc(this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, this.size/2, 0, 2 * Math.PI, false);
			ctx.fillStyle = "black";
			ctx.fill();
			ctx.closePath()
		} else {

			ctx.beginPath();
			ctx.lineWidth = rectHeightRel*this.actualSize
			var x = this.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel
			var y = this.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel
			ctx.moveTo(x, y)
			this.target.normalize();
			this.target.mult(rectHeightRel*30);
			ctx.lineTo(x+this.target.x, y+this.target.y)
			ctx.strokeStyle = "black";
			ctx.stroke();
			ctx.closePath()
			

		}
	}
}

function interpolateBullets(projectiles, deltaTime) {
	for (var i = 0; i < projectiles.length; i++) {
		projectiles[i].target = new Vector(projectiles[i].target.x, projectiles[i].target.y);
		projectiles[i].target.normalize();
		projectiles[i].target.mult(projectiles[i].speed*deltaTime/100);
		projectiles[i].pos = new Vector(projectiles[i].pos.x, projectiles[i].pos.y);
		projectiles[i].pos.add(projectiles[i].target);
	}
}

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}