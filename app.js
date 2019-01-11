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
var Player = require('./player.js')
var Vector = require('./vector.js')
var io = require('socket.io')(server);
var tools = require('./tools.js')

//Create port
server.listen(3001, function () {
	console.log('Started an https server on port 3001.');
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
var arenaSize = 2000;

var deadArea = [];

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
	// Process raw input and move the player on the server side
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
			var pos = player.pos;
			var hp = player.hp;
			var moved = player.moved;

			// Update data
			player = playerData;

			player.pos = pos;
			player.hp = hp;
			player.moved = moved;
			
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
							lobby[i].dead = true;
							lobby[i].hp = lobby[i].maxHP;
							lobby[i].pos = {
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
							lobby[i].core.exists = false;
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

setInterval(function () {
	io.emit('playerData', lobby)

	for (var i = 0; i < deadArea.length; i++) {
		var deadMove = Math.floor(Math.random() * 6);
		if(deadMove === 0) {
			deadArea[i].x += Math.random() * 8;
		} else if(deadMove === 1) {
			deadArea[i].y += Math.random() * 8;
		} else if(deadMove === 2) {
			deadArea[i].x -= Math.random() * 8;
		} else if(deadMove === 3) {
			deadArea[i].y -= Math.random() * 8;
		} else if(deadMove === 4) {
			deadArea[i].x -= Math.random() * 8;
			deadArea[i].Y -= Math.random() * 8;
		} else if(deadMove === 5) {
			deadArea[i].X += Math.random() * 8;
			deadArea[i].y += Math.random() * 8;
		}
	}

	
	if(1 == 2) {
		var deadSelect = Math.floor(Math.random() * 4);
		if(deadSelect === 0) {
			var deadpos = new Vector(-Math.floor(Math.random() * arenaSize/50) * 50, Math.floor(Math.random() * arenaSize/50) * 50);
		} else if(deadSelect === 1) {
			var deadpos = new Vector(Math.floor(Math.random() * arenaSize/50) * 50, -Math.floor(Math.random() * arenaSize/50) * 50);
		} else if(deadSelect === 2) {
			var deadpos = new Vector(-Math.floor(Math.random() * arenaSize/50) * 50, -Math.floor(Math.random() * arenaSize/50) * 50);
		} else if(deadSelect === 3) {
			var deadpos = new Vector(Math.floor(Math.random() * arenaSize/50) * 50, Math.floor(Math.random() * arenaSize/50) * 50);
		}
		
		deadArea.push(deadpos);
		while((Math.random() * 100 < 70)) {
			var deadSelect = Math.floor(Math.random() * 6);
			if(deadSelect === 0) {
				deadpos = new Vector(deadpos.x + 50, deadpos.y)
			} else if(deadSelect === 1) {
				deadpos = new Vector(deadpos.x, deadpos.y + 50)
			} else if(deadSelect === 2) {
				deadpos = new Vector(deadpos.x - 50, deadpos.y)
			} else if(deadSelect === 3) {
				deadpos = new Vector(deadpos.x, deadpos.y - 50)
			} else if(deadSelect === 4) {
				deadpos = new Vector(deadpos.x + 50, deadpos.y + 50)
			} else if(deadSelect === 5) {
				deadpos = new Vector(deadpos.x - 50, deadpos.y - 50)
			} 
			deadArea.push(deadpos);
		}
			
	}
	io.emit('arenaSpot', deadArea)
}, 100);

module.exports = app;