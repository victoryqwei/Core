// Initialize the socket
var socket = io();

// Socket events
var refreshTime = 3;

socket.on('refresh', function () {
	refreshTime = 3;
	alertText = true;
	setTimeout(function(){ 
		console.log('Reloading');
		location.reload(true);
		alertText = false;
		clearTimeout();
	}, 3000);
	setInterval(function(){ 
		refreshTime -= 1; 
	}, 1000);
})

socket.on('newPlayerBullet', function (data) {
})

var players = [];
var playerBuffers = [];
var powerBalls = [];

socket.on('powerBall', function (data) {
	if (powerBalls) {
		// Update new balls and existing balls
		for (var i = 0; i < data.length; i++) {
			var exists = false;
			if (powerBalls) {
				for (var j = 0; j < powerBalls.length; j++) {
					if (powerBalls[j].id == data[i].id) {
						powerBalls[j].pos = data[i].pos;
						powerBalls[j].mass = data[i].mass;

						powerBalls[j].positionBuffer.push([+new Date(), new Vector(data[i].pos.x, data[i].pos.y)])

						exists = true;
					}
				}
				if (!exists) {
					powerBalls.push(data[i]);
				}
			}
		}
		// Remove used balls
		for (var i = 0; i < powerBalls.length; i++) {
			var exists = false;
			for (var j = 0; j < data.length; j++) {
				if (powerBalls[i].id == data[j].id) {
					exists = true;
				}
			}
			if (!exists) {
				powerBalls[i] = undefined;
			}
		}

		powerBalls = powerBalls.filter(function (el) {
		  	return el != undefined;
		});
	}
})

// Update data on 'playerData'
socket.on('playerData', function (sockets) {
	// Update existing players projectiles
	for (var i = 0; i < sockets.length; i++) {
		var exists = false;
		if (!players) {
			continue;
		}
		for (var j = 0; j < players.length; j++) {
			if (players[j].id == sockets[i].id) {
				// Save previous player state
				var oldPlayer = jQuery.extend(true, {}, players[j]);
				// Update the players
				players[j] = sockets[i];

				// Update other players projectiles
				// Event based prediction
				for (var k = 0; k < players[j].projectiles.length; k++) {
					var exists = false;

					for (var l = 0; l < oldPlayer.projectiles.length; l++) {
						if (oldPlayer.projectiles[l].id === players[j].projectiles[k].id) {
							players[j].projectiles[k] = oldPlayer.projectiles[l];
							exists = players[j].projectiles[k];
						}
					}
				}

				// Update other players angle
				players[j].angleBuffer = oldPlayer.angleBuffer;
				players[j].angleBuffer.push([+new Date(), new Vector(players[j].angle.x, players[j].angle.y)])
				exists = true;
			}
		}
		if (!exists) {
			players.push(sockets[i]);
		}
	}
	// Update other player positions
	if(players && playerBuffers) {
		for (var i = 0; i < players.length; i++) {
			// Add player position to the buffer
			var exists = false;
			for (var j = 0; j < playerBuffers.length; j++) {
				if (players[i].id === playerBuffers[j].id) {
					exists = true;
					// Update the players information
					playerBuffers[j].buffer.push([+new Date(), new Vector(players[i].pos.x, players[i].pos.y)])
					players[i].positionBuffer = playerBuffers[j].buffer;
				}
			}

			// Add to buffer if player doesn't exist
			if (!exists) {
				playerBuffers.push({
					id: players[i].id,
					buffer: [[+new Date(), new Vector(players[i].pos.x, players[i].pos.y)]]
				})
			}
		}
	}

	// Update client player
	if(players) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].id === socket.id && isonfocus) {
				player.updatePlayer(players[i]);
			}
		}
		for (var i = 0; i < players.length; i++) {
			if (players[i].id === socket.id) {
				players.splice(i, 1);
			}
		}
	}
})

var latencyArray = [];
var latency = 0;
socket.on('latency', function (data) {
	latencyArray.push(Date.now() - data);
	if (latencyArray.length > 1000) {
		latencyArray.shift();
	}
	latency = latencyArray.reduce((a, b) => a + b, 0)/latencyArray.length;
})

socket.on('disconnection', function (data) {
	for (var i = 0; i < players.length; i++) {
		if (players[i].id == data) {
			players.splice(i, 1);
			break;
		}
	}
})

socket.on('banned', function (data) {
	console.log("banned")
	alert('You are banned from the server');
})

var killTextTime;
var increaseTextTime;
var killStreakTime;

socket.on('killText', function (killedPlayer) {

	//Set death message
	var deathName;
	var finalMessages = [" was blown out of existence", " is finally gone", " forgot to place their core", " should have placed more walls", " will be shown the main menu", " cannot deal with the lag", " will be forgotten", " rage quit", " commit environmental sudoku", " should maybe try another class", " failed to execute 'alive'", " may rest in peace", " is dead as a doornail", " forgot about server interpolation", " became one with the menu screen", " blamed the game", " should go back to diep.io", " should have changed the variables", " never shall return"];
	var coreMessages = [" was killed, but had a backup", " will respawn in 3 seconds", " will power their way back", " can never die", " will syphon core energy", " will be inanimately revived", " remembered to press start", " will return", " remembered the name of the game", " will make Thor proud", " will return to their body", " will fall back down", " is smarter than you think", " can take a three second break", "hopes their walls will hold up"];
	finalSentence = finalMessages[Math.floor(Math.random() * finalMessages.length)];
	coreSentence = coreMessages[Math.floor(Math.random() * coreMessages.length)];

	//Find kill type
	if (killedPlayer.killType === 'core') {
		if(killedPlayer.playerName.length > 15) {
			deathName = (killedPlayer.playerName).slice(0,12) + '...' 
		} else {
			deathName = killedPlayer.playerName;
		}
		chatList.push(deathName + coreSentence);
		setTimeout(function(){ 
			chatList.shift();
			clearTimeout();
		}, 5000);
	} else if (killedPlayer.killType === 'kill') {
		if(killedPlayer.playerName.length > 15) {
			deathName = (killedPlayer.playerName).slice(0,12) + '...' 
		} else {
			deathName = killedPlayer.playerName;
		}
		chatList.push(deathName + finalSentence);
		setTimeout(function(){ 
			chatList.shift();
			clearTimeout();
		}, 5000);
	}

})

socket.on('coreDeath', function (playerCore) {
	for (var j = 0; j < players.length; j++) {
		if(players[j].id == playerCore) {
			coreDeathPos = new Vector(players[j].core.pos.x, players[j].core.pos.y)
			coreDeathAnimation();
		}
	}
})

socket.on('kill', function (killedPlayer) {

	//New kill clears timouts
	clearTimeout(killTextTime);
	clearTimeout(increaseTextTime);
	clearTimeout(killStreakTime);

	//Increase player score
	player.score += 10;
	//Increase kill count
	player.killCount += 1;

	//Display kill text
	killText = true;
	killName = killedPlayer.playerName;
	//After three seconds stop, unless cleared by new kill
	killTextTime = setTimeout(function(){ 
		killText = false;
		clearTimeout();
	}, 3000);

	if (killedPlayer.killType === 'core') {
		finalKill = false;
		// Not final kill - CAN RESPAWN WITH CORE
		increase = parseInt((killedPlayer.player.power/8).toFixed(0));
		player.power += parseInt((killedPlayer.player.power/8).toFixed(0));
	} else if (killedPlayer.killType === 'kill') {
		finalKill = true;
		// FINAL KILL - NO CORE
		increase = parseInt((killedPlayer.player.power/2).toFixed(0));
		player.power += parseInt((killedPlayer.player.power/2).toFixed(0));
	}

	//Display increased score text
	increaseText = true;
	
	//After three seconds stop, unless cleared by new kill
	increseTextTime = setTimeout(function(){ 
		increaseText = false;
		clearTimeout();
	}, 1000);
	
	//Increase kill streak
	player.killStreak += 1;
	//After three seconds clear kill streak, unless stopped by new kill
	killStreakTime = setTimeout(function(){ 
		player.killStreak = 0;
		clearTimeout();
	}, 5000);
})

socket.on('hit', function (data) {
	if (data.type === 'player') {
		if (!core.exists) {
			player.hp -= data.damage;
			if (player.hp <= 0) {
				play = 0;

				// Core doesn't exist
				resetPlayer(player, data)
			}
		} else {
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = "red"
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;
			player.hp -= data.damage;
			if (player.hp <= 0) {
				play = 2;
				player.dead = true;
				player.resetTime = player.resetDelay/1000;
				var resetInterval = setInterval(function(){ 
					player.resetTime -= 0.1;
					if(player.resetTime <= 0) {
						clearInterval(resetInterval);
						player.resetTime = player.resetDelay/1000;
					}
				}, 100);
				player.pos = new Vector(core.pos.x + core.actualSize/2, core.pos.y + core.actualSize/2);
				player.hp = player.maxHP;
				setTimeout(function () {
					if (core.exists) {
						play = 1;
						player.dead = false;
					} else {
						// Core doesn't exist
						resetPlayer(player, data);
					}
					
				}, player.resetDelay)
			}
		}
	} else if (data.type === 'core') {
		core.hp -= data.damage * 1/core.level;
		if (core.hp <= 0) {
			core.exists = false;
		}
	} else if (data.type === 'wall') {
		for (var i = 0; i < player.walls.length; i++) {
			if (data.wallId === player.walls[i].id) {
				player.walls[i].hp -= data.damage;

				if (player.walls[i].hp <= 0) {
					player.walls[i] = undefined;
				}
			}
		}

		player.walls = player.walls.filter(function (el) {
		  return el != undefined;
		});
	} else if (data.type === 'module') {
		for (var i = 0; i < player.modules.length; i++) {
			if (data.moduleId === player.modules[i].id) {
				player.modules[i].hp -= data.damage;

				if (player.modules[i].hp <= 0) {
					player.modules[i] = undefined;
				}
			}
		}

		player.modules = player.modules.filter(function (el) {
		  return el != undefined;
		});
	}
})

function resetPlayer(player, data) {
	player.core.exists = false;
	player.walls = [];
	player.regenModules = [];
	player.power = 0;
	player.dead = true;
	player.killerId = data.killerId;
	player.killerName = data.name
	player.score = 0;
	player.killCount = 0;
	killStreak = 0;
	killText = false;
	killName = 'Player';
	increaseText = false;
	increase = undefined;
	player.killStreak = 0;
	finalKill = false; 
	player.killCount = 0;

	player.pos = new Vector(Math.floor(Math.random() * arenaSize*2) - arenaSize, Math.floor(Math.random() * arenaSize*2) - arenaSize)
	player.hp = player.maxHP;
	$("#name").show();
	$("#title").show();
}