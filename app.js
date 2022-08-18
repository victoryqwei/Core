var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var options = {
	key: fs.readFileSync('./ia.key'),
	cert: fs.readFileSync('./server.crt'),
	ca: fs.readFileSync('./ca.crt')
}
var server = https.createServer(options, app);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var readline = require('readline');
var fs = require('fs');
var Player = require('./player.js');
var Vector = require('./vector.js');
var io = require('socket.io')(server);
var tools = require('./tools.js');
var util = require('util');

// Set app title
var setTitle = require('console-title');
setTitle('Core.io Server');

//Create port
let port = 3003;
server.listen(port, function () {
	console.log('Started an https server on port', port);
	console.log('Access the website at core.victorwei.com');
})
var public = __dirname + '/public/';

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/*', function (req, res, next) {
	res.redirect('/')
	next()
})

// Server input commands

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Commmand line input
rl.on('line', (input) => {
  	if (input === 'refresh') {
  		io.emit('refresh');
  	} else if (input.split(" ")[0] === "ban") {
  		console.log(input.split(" ")[1])
  	}
});
// Server lobby - Add options to have different rooms when scaling

var lobby = [];

// Dynamic arena size
var arenaSize = 1500;
var powerSpawnRate = 0;

// Gamemode
var gamemode = 0;

var powerBalls = [];

// Server-client connection architecture

io.on('connect', function(socket) { 
	console.log('IP: ' + socket.request.connection.remoteAddress.replace('::ffff:', '') + ' | ID: ' + socket.id + ' connected to on ' + Date())
	// Update ip
	tools.updateIP(fs, socket);
	var banned = false;

	// Check if player is banned
	fs.readFile('./ip.json', function (err, data) {
		var ips = JSON.parse(data);
		var ip = socket.request.connection.remoteAddress.replace('::ffff:', '')

		for (var i = 0; i < ips.black.length; i++) {
			if (ip === ips.black[i]) {
				banned = true;
				socket.emit('banned')
			}
		}
	});

	// Client player
	var player = undefined;
	var rawInput = [];

	socket.on('join', function (data) {
		if (!banned) {
			// Check if the player already exists
			var exists = false;
			for (var i = 0; i < lobby.length; i++) {
				if (socket.id === lobby[i].id) {
					exists = true;
				}
			}

			if (!exists) {
				// Join the lobby
				data.id = socket.id;
				player = data;
				player.pos = new Vector(data.pos.x,data.pos.y);

				if (gamemode === 1) {
					var teams = {
						red: 0,
						blue: 0
					}
					for (var i = 0; i < lobby.length; i++) {
						if (lobby[i].team == "red") {
							teams.red++
						} else {
							teams.blue++
						}
					}

					if (teams.red > teams.blue) {
						player.team = "red"
					} else if (teams.red <= teams.blue) {
						player.team = "blue"
					}
				}
					
				lobby.push(player);
			}

			console.log(data.name + " with id " + socket.id.slice(0, 5) + "... at " + Date() + " spawned.")
		}
	})

	// Receive player input and update the client
	var delta = 16;
	var then = Date.now();
	var now = Date.now();
	var prev = Date.now();
	socket.on('input', function (data) {
		//delta = Date.now() - then;
		//console.log(Date.now() - then);

		then = Date.now();

		if (player && !banned) {
			rawInput.push(data);
		}
	})
	// Process raw input and move the player position on the server side
	setInterval(function () {
		if (player && !banned) {
			
			if (!player.dead) {
				for (var i = 0; i < rawInput.length; i++) {
					// Calculate the time stamps
					now = rawInput[i].time;
					delta = now-prev;
					prev = rawInput[i].time;

					if (delta > 50) {
						continue;
					}

					// Calculate the direction based on input
					var input = rawInput[i].input;
					var direction = new Vector(0, 0);
					for (var a in input) {
						switch (input[a]) {
							case 65: // left
								if(player.pos.x > -arenaSize) {
									direction.x -= 1;
								} else {
									player.pos.x = -arenaSize;
								}
								break;
							case 87: // up
								if(player.pos.y > -arenaSize) { 
									direction.y += 1;
								} else {
									player.pos.y = -arenaSize;
								}
								break;
							case 68: // right
								if(player.pos.x < arenaSize) { 
									direction.x += 1;
								} else {
									player.pos.x = arenaSize;
								}
								break;
							case 83: // down
								if(player.pos.y < arenaSize) { 
									direction.y -= 1;
								} else {
									player.pos.y = arenaSize;
								}
								break;
						}
					}

					direction.normalize();
					direction.mult(player.speed * rawInput[i].delta/100);

					if (Math.pow(direction.x, 2) > 0 || Math.pow(direction.y, 2) > 0) {
						player.moved = true;
					} else {
						player.moved = false;
					}

					// Check collision with players
					player.pos.x += direction.x;
					if (Player.checkCollision(lobby, player)) {
						player.pos.x -= direction.x;
					}
					player.pos.y -= direction.y;
					if (Player.checkCollision(lobby, player)) {
						player.pos.y += direction.y;
					}

					// Check off the time stamp as done
					player.lastTick = rawInput[i].time;
				}
			}
			rawInput = [];
		}
	}, 100)

	// Updating the player
	socket.on('update', function (playerData) {
		if (player && !banned) {
			// Send back data
			socket.emit('latency', playerData.time);

			// Save data
			var hp = player.hp;
			var moved = player.moved;
			var lastTick = player.lastTick;
			var powerSpawnRate = player.core.powerSpawnRate;
			var powerCooldown = player.core.powerCooldown;
			var banned = player.banned;
			var team = player.team;

			// Update data
			player = playerData;

			player.hp = hp;
			player.moved = moved;
			player.lastTick = lastTick;

			player.core.powerSpawnRate = powerSpawnRate;
			player.core.powerCooldown = powerCooldown;

			player.banned = banned;

			player.team = team;
			
			// Update the player

			player.arenaSize = arenaSize;

			for (var i = 0; i < lobby.length; i++) {
				if (lobby[i].id === player.id) {
					lobby[i] = player;
				}
			}
		}
	})

	// Hit event
	socket.on('detectHit', function (data) {
		if (!banned) {
			if (data.type === "player") {
				for (var i = 0; i < lobby.length; i++) {
					if (lobby[i].id == data.id && !lobby[i].core.exists) {
						// FINAL KILL - NO CORE
						lobby[i].hp -= data.damage;
						if (lobby[i].hp <= 0) {
							lobby[i].modules = [];
							// Release player's power in the form of ball
							for (var j = 0; j < Math.floor(lobby[i].power); j++) {
								var newBall = new Power(lobby[i].pos.x + 25, lobby[i].pos.y + 25, 1);
								powerBalls.push(newBall);	
							}

							lobby[i].hp = lobby[i].maxHP;
							lobby[i].pos = new Vector(Math.floor(Math.random() * arenaSize*2) - arenaSize, Math.floor(Math.random() * arenaSize*2) - arenaSize);
							lobby[i].core.exists = false;
							lobby[i].walls = [];
							lobby[i].power = 0;
							lobby[i].dead = true;
							lobby[i].killerId = data.killerId;
							lobby[i].killerName = data.name

							data.killType = "kill";
							io.to(socket.id).emit('kill', data);
							io.emit('killText', data);
						}
					} else if (lobby[i].id === data.id) {
						// KILL WITH CORE
						lobby[i].hp -= data.damage;
						if (lobby[i].hp <= 0) {
							for (var j = 0; j < 25; j++) {
								var newBall = new Power(lobby[i].pos.x + 25, lobby[i].pos.y + 25, 1);
								powerBalls.push(newBall);	
							}

							// Reset player to core position
							lobby[i].dead = true;
							lobby[i].hp = lobby[i].maxHP;
							lobby[i].pos = { // Move the player so it won't collect the dead power
								x: lobby[i].core.pos.x + lobby[i].core.actualSize/2,
								y: lobby[i].core.pos.y + lobby[i].core.actualSize/2
							}

							data.killType = "core";
							io.to(socket.id).emit('kill', data);
							io.emit('killText', data);
						}
					}
				}
			} else if (data.type === "core") {
				for (var i = 0; i < lobby.length; i++) {
					if (lobby[i].id == data.id) {
						lobby[i].core.hp -= data.damage * 1/lobby[i].core.level;
						if (lobby[i].core.hp <= 0) {
							for (var j = 0; j < 25; j++) {
								var newBall = new Power(lobby[i].core.pos.x + 50, lobby[i].core.pos.y + 50, 1);
								powerBalls.push(newBall);	
							}
							lobby[i].core.exists = false;
							io.emit('coreDeath', lobby[i].id);
						}
					}
				}
			} else if (data.type === "module") {
				for (var i = 0; i < lobby.length; i++) {
					if (lobby[i].id == data.id) {
						for (var j = 0; j < lobby[i].modules.length; j++) {
							if (data.moduleId === lobby[i].modules[j].id) {

								lobby[i].modules[j].hp -= data.damage;

								if (lobby[i].modules[j].hp <= 0) {
									lobby[i].modules[j] = undefined;
								}
							}
						}

						lobby[i].modules = lobby[i].modules.filter(function (el) {
						  	return el != undefined;
						});
					}
				}
			} else if (data.type === "wall") {
				for (var i = 0; i < lobby.length; i++) {
					if (lobby[i].id == data.id) {
						for (var j = 0; j < lobby[i].walls.length; j++) {
							if (data.wallId === lobby[i].walls[j].id) {

								lobby[i].walls[j].hp -= data.damage;

								if (lobby[i].walls[j].hp <= 0) {
									lobby[i].walls[j] = undefined;
								}
							}
						}

						lobby[i].walls = lobby[i].walls.filter(function (el) {
						  	return el != undefined;
						});
					}
				}
			}
			
			io.to(data.id).emit('hit', data)
		}
	});

	// Disconnect

	socket.on('disconnect', function () {
		for (var i = 0; i < lobby.length; i++) {
			if (lobby[i].id === socket.id) {
				lobby.splice(i, 1);
			}
		}
		io.emit('disconnection', socket.id);
		console.log(socket.id + " left at "  + Date())
	});
});

class Power {
	constructor(x, y, power) {
		this.id = randomString(5);

		this.pos = new Vector(x, y)
		this.positionBuffer = [];

		this.velocity = new Vector(0,0);
		this.acceleration = new Vector(0,0);
	    
	    this.power = power;
	    this.mass = 1+(power-1)/3;
	}
}

function constrain(value, a, b) {
	if (value < a) {
		return a;
	} else if (value > b) {
		return b;
	} else {
		return value
	}
}

function random(max, min) {
	return Math.random() * (max - min) + min;
}

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function powerUpdate() {
	//Player sucking
	for (var i = 0; i < powerBalls.length; i++) {
		for (var j = 0; j < lobby.length; j++) {
			var distance = Math.sqrt(Math.pow(powerBalls[i].pos.x - lobby[j].pos.x, 2) + Math.pow(powerBalls[i].pos.y - lobby[j].pos.y, 2))
			if (distance < 150+powerBalls[i].mass) {
				var target = new Vector(lobby[j].pos.x, lobby[j].pos.y);
				target.sub(powerBalls[i].pos);
				target.normalize();
				target.mult(1000/distance);
				powerBalls[i].pos.add(target);
			}
			if (distance < 20) {
				if (lobby[j].addPower) {
					lobby[j].addPower += powerBalls[i].power;
				} else {
					lobby[j].addPower = powerBalls[i].power;
				}
				powerBalls[i].dead = true;
			}
		}
		if (powerBalls[i].dead) {
			powerBalls[i] = undefined;
		}
	}
	powerBalls = powerBalls.filter(function (el) {
	  return el != undefined;
	});

	// Power balls repelling and merging force away from each other
	for (var i = 0; i < powerBalls.length; i++) {
		for (var j = 0; j < powerBalls.length; j++) {
			if (i != j) {
				var distance = Math.sqrt(Math.pow(powerBalls[i].pos.x - powerBalls[j].pos.x, 2) + Math.pow(powerBalls[i].pos.y - powerBalls[j].pos.y, 2))
				if (distance < powerBalls[i].mass*5+powerBalls[j].mass*5 && !powerBalls[i].dead&&!powerBalls[j].dead) {
					var randomMerge = Math.random()*30;
					if (randomMerge < 1/* && (powerBalls[i].mass + powerBalls[j].mass/5 < 20)*/) { // Merge into larger one
						powerBalls[i].mass += powerBalls[j].mass/5;
						powerBalls[i].power += powerBalls[j].power;
						powerBalls[j].dead = true;
					} else { // Repel power balls
						var target = new Vector(powerBalls[j].pos.x, powerBalls[j].pos.y);
						target.sub(powerBalls[i].pos);
						target.normalize();
						target.mult(-1);
						powerBalls[i].pos.add(target);
					}
				}
			}
		}
	}
	// Remove used power balls
	for (var i = 0; i < powerBalls.length; i++) {
		if (powerBalls[i].dead) {
			powerBalls[i] = undefined;
		}
	}
	powerBalls = powerBalls.filter(function (el) {
	  return el != undefined;
	});

	//Spawn power balls at players cores
	for (var i = 0; i < lobby.length; i++) {
		if(lobby[i].core.exists && lobby[i].core.pos.x) {
			lobby[i].core.powerSpawnRate = 500/lobby[i].core.level;
			if(lobby[i].core.level == 1 && lobby[i].core.powerCooldown >= lobby[i].core.powerSpawnRate) {
				corePowerBall = new Power(lobby[i].core.pos.x + 50, lobby[i].core.pos.y + 50, 1);
				powerBalls.push(corePowerBall);
				lobby[i].core.powerCooldown = 0;
			} else if(lobby[i].core.level == 2 && lobby[i].core.powerCooldown >= lobby[i].core.powerSpawnRate) {
				corePowerBall = new Power(lobby[i].core.pos.x + 50, lobby[i].core.pos.y + 50, 1);
				powerBalls.push(corePowerBall);
				lobby[i].core.powerCooldown = 0;
			} else if(lobby[i].core.level == 3 && lobby[i].core.powerCooldown >= lobby[i].core.powerSpawnRate) {
				corePowerBall = new Power(lobby[i].core.pos.x + 50, lobby[i].core.pos.y + 50, 1);
				powerBalls.push(corePowerBall);
				lobby[i].core.powerCooldown = 0;
			}
			lobby[i].core.powerCooldown += 100;
		}
	}

	//Move power balls in random direction
	for (var i = 0; i < powerBalls.length; i++) {
		powerBalls[i].pos.x += Math.random()*4-2;
		powerBalls[i].pos.y += Math.random()*4-2;
		if(powerBalls[i].pos.x > arenaSize || powerBalls[i].pos.x < -arenaSize || powerBalls[i].pos.y > arenaSize || powerBalls[i].pos.y < -arenaSize) {
			powerBalls.splice(i, 1)
		}
	}

	//Randomly generate power balls around the map
	if(Math.floor(Math.random() * 50) < (arenaSize / 500)) {
		if(powerBalls.length < 300) {
			var newBall = new Power(Math.floor(Math.random() * arenaSize * 2)-arenaSize, Math.floor(Math.random() * arenaSize * 2)-arenaSize, 2);
			powerBalls.push(newBall);	
		}
	}
	io.emit('powerBall', powerBalls)
}

function moduleUpdate() {
	for (var i = 0; i < lobby.length; i++) {
		for (var j = 0; j < lobby[i].modules.length; j++) {
			if(lobby[i].modules.length > 0) {
				var lobbyDistance = new Vector(lobby[i].pos.x, lobby[i].pos.y)
				lobbyDistance.sub(new Vector(lobby[i].modules[j].pos.x, lobby[i].modules[j].pos.y));
				if (lobbyDistance.getMag() < 300) {
					if(lobby[i].hp <= lobby[i].maxHP && lobby[i].power >= 0.008) {
						lobby[i].hp += 0.8;
						lobby[i].power -= 0.08;
					}
				}
			}
		}
	}
}

setInterval(function () {
	// Update power physics
	powerUpdate();
	// Update module regen
	moduleUpdate();
	// Send all player data to everyone
	io.emit('playerData', lobby)
}, 100);

module.exports = app;