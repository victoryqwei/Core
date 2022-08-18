// Game loop draw function
function draw() {

	// Refresh the screen
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// Draw background
	drawBackground();

	// Draw the grid
	drawGrid();

	// Draw players tiles
	drawPlayersTiles(players);
	drawPlayersProjectiles(players);
	player.drawWalls();

	if(play === 1 || play === 2) {
		// Draw client core
		core.draw(player, delta);

		// Draw ability tile
		ability.draw();
		ability.update();
		regen.draw();
		regen.update();
	}

	drawPlayersTile(players);

	// Draw the power balls
	drawPowerBalls();
	animatePowerSurge();

	if(play === 1) {
		// Draw tiles
		placeTile(player, players);	
	}

	// Draw players
	drawPlayers(players)

	// Draw core lightning
	if(Math.floor(Math.random() * 50) === 1) {
		core.drawCoreLightning(player,players)
	}	

	// Draw UI
	if(play === 1) {
		//Draw client player
		player.draw(delta);
		player.hitDetection(players, socket, 1);
	}

	if(play === 1) {
		//Draw core UI
		core.drawUI(player);

		//Draw ability UI
		ability.drawUI(player);

		//Draw client UI
		drawUI(player, players);
	}

	// Draw player spectating
	if(play === 0 && player.killerName) {
		drawMenuSpectatingText();
	}	

	//Draw player respawn
	if(play === 2) {
		drawDeathSpectatingText();
	}	
}

function drawBackground() {
	// Draw the off-white background
	ctx.beginPath();
	ctx.globalAlpha = 1;
	ctx.fillStyle = '#e6e6e6';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.closePath()

	if (gamemode === 1) {
		ctx.fillStyle = "red";
		ctx.globalAlpha = 0.3;
		ctx.fillRect(-arenaSize*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, -arenaSize*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, 400*rectHeightRel, arenaSize*2*rectHeightRel)
		ctx.fillStyle = "blue";
		ctx.fillRect(arenaSize*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, -arenaSize*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, -400*rectHeightRel, arenaSize*2*rectHeightRel)
		ctx.globalAlpha = 1;
	}
}

function drawDeathSpectatingText() {
	// Draw the coundown timer for spectating
	ctx.beginPath();
	ctx.font = "30px Pier";
	ctx.fillStyle = "Black";
	ctx.textAlign="left"; 
	ctx.fillText('Respawning in', 40, canvas.height - 40);
	ctx.font = "20px Pier";
	ctx.fillText((player.resetTime).toFixed(1) + 'Seconds', 40, canvas.height - 20);
	ctx.closePath();
}

function drawMenuSpectatingText() {
	// Draw the spectating player name for menu spectating
	ctx.beginPath();
	ctx.font = "30px Pier";
	ctx.fillStyle = "Black";
	ctx.textAlign="left"; 
	ctx.fillText('Spectating', 40, canvas.height - 40);
	ctx.font = "20px Pier";
	ctx.fillText(player.killerName, 40, canvas.height - 20);
	ctx.closePath();
}

function drawPlayers(players) {

	// Reset global alpha
	ctx.globalAlpha = 1;

	// For all the players present on the server 
	for(var i = 0; i < players.length; i++) {

		// Make sure the you don't render your own player twice
		if (players[i].id != socket.id) {

			// Make sure player is not dead and in screen
			if (players[i] && !players[i].dead && inScreen(players[i].pos.x, players[i].pos.y, player)) {

				// Draw players hp
				ctx.globalAlpha = 1;
				ctx.beginPath();
				ctx.strokeStyle = "black";
				ctx.lineCap = "round";
				ctx.lineWidth = 12 * rectHeightRel;
				ctx.moveTo(players[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel-player.size*3/4, players[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size*3/4)
				ctx.lineTo(players[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel-player.size*3/4+(players[i].hp/players[i].maxHP*75)*rectHeightRel, players[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size*3/4)
				ctx.stroke();
				ctx.strokeStyle = players[i].color;
				ctx.lineWidth = 10 * rectHeightRel;
				ctx.stroke();
				ctx.lineCap = "butt";

				// Draw players cannon
				ctx.beginPath();
				ctx.strokeStyle = "grey";
				ctx.lineWidth = players[i].barrelSize/2*rectHeightRel
				ctx.moveTo(players[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel);
				players[i].angle = new Vector(players[i].angle.x, players[i].angle.y)
				players[i].angle.normalize();
				players[i].angle.mult((players[i].barrelLength));
				ctx.lineTo(players[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel+players[i].angle.x*rectHeightRel, players[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel+players[i].angle.y*rectHeightRel);
				ctx.stroke();
				ctx.closePath();

				// Draw players body
				ctx.beginPath();
				ctx.fillStyle = 'black';
				ctx.arc(players[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size/2, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath()
				ctx.fillStyle = players[i].color;
				ctx.beginPath();
				ctx.arc(players[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size/2.3, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();

				// Draw players name
				if(play != 3) {
					ctx.beginPath();
		    		ctx.font = "13px Pier";
		    		ctx.fillStyle = "Black";
		    		ctx.textAlign="center"; 
		    		ctx.textBaseline="bottom";
					ctx.fillText(players[i].name, players[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel - player.size / 2);
				

					// Draw the players kill count
					var playerPos = new Vector(players[i].pos.x, players[i].pos.y);
					playerPos.sub(player.pos)
					var distance = playerPos.getMag();
					if (distance < 400 && players[i].killCount > 0) {
						ctx.fillText(' (' + players[i].killCount + ' Kills)', players[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel - player.size /1.1,);
					}
					ctx.closePath()
				}

				// Draw player kill streak
				if(players[i].killStreak > 1) {
					ctx.beginPath();
					ctx.font = 25*rectHeightRel + "px Pier";
					ctx.fillStyle = "Black";
					ctx.textAlign="center"; 
					ctx.textBaseline="middle"; 
					ctx.fillText(players[i].killStreak + 'X', players[i].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size/1.2, player.size / 1.2);
					ctx.closePath()
				}
			}
		}
	}
}

function drawPlayersTile(players) {

	// Reset global alpha
	ctx.globalAlpha = 1;

	// For all the players present on the server 
	for(var i = 0; i < players.length; i++) {

		// Make sure the you don't render your own player twice
		if (players[i].id != socket.id) {

			// Draw player's cores
			if(players[i].core && players[i].core.exists == true && inScreen(players[i].core.pos.x, players[i].core.pos.y, player)) {

				// Draw extra halo if level 3
				if(players[i].core.level === 3) {
					ctx.beginPath();
					ctx.fillStyle = 'Black';
					ctx.globalAlpha = 0.08;
					ctx.filter = "blur(25px)";
					ctx.arc(players[i].core.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size, players[i].core.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size, player.size * 4, 0, 2 * Math.PI);
					ctx.fill();
					ctx.filter = "none";
					ctx.globalAlpha = 1;
					ctx.closePath()
				}

				// Draw player halo
				ctx.beginPath();
				ctx.fillStyle = players[i].color;
				ctx.globalAlpha = 0.3;
				ctx.filter = "blur(40px)";
				ctx.arc(players[i].core.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size, players[i].core.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size, player.size * 2, 0, 2 * Math.PI);
				ctx.fill();
				ctx.globalAlpha = 1;
				ctx.filter = "none";

				// Draw core background
				ctx.fillRect(players[i].core.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 10, players[i].core.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 10, player.size * 2 - player.size / 5, player.size * 2 - player.size / 5);

				// Draw core levels
				if(players[i].core.level === 1) {
					ctx.drawImage(coreTile1, players[i].core.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].core.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size * 2, player.size * 2);
				} else if(players[i].core.level === 2) {
					ctx.drawImage(coreTile2, players[i].core.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].core.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size * 2, player.size * 2);
				} else if(players[i].core.level === 3) {
					ctx.drawImage(coreTile3, players[i].core.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].core.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size * 2, player.size * 2);
				}

				// Draw core health
				if (players[i].core.hp < 100) {
					ctx.fillStyle = players[i].color;
					ctx.fillRect(players[i].core.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].core.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size * 2.2, players[i].core.hp*rectHeightRel, player.size / 4);
					ctx.closePath()
				}
			}

			// Draw player ability upgrader
			if(players[i].ability && players[i].ability.exists == true && inScreen(players[i].ability.pos.x, players[i].ability.pos.y, player)) {
				ctx.beginPath();
				ctx.fillStyle = players[i].color;
				ctx.fillRect(players[i].ability.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 10, players[i].ability.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 10, player.size * 2 - player.size / 5, player.size * 2 - player.size / 5);
				ctx.drawImage(abilityUpgrader, players[i].ability.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].ability.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size * 2, player.size * 2);
				ctx.closePath();

			}

			// For all the modules
			if(players[i].modules.length > 0) {
				for (var k = 0; k < players[i].modules.length; k++) {

					// Draw the circle around the module
					ctx.beginPath();
					ctx.globalAlpha = 0.5;
					ctx.strokeStyle = players[i].color;
					ctx.lineWidth=10*rectHeightRel;
					ctx.arc(players[i].modules[k].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 2, players[i].modules[k].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 2, 300*rectHeightRel, 0, 2 * Math.PI, false);
					ctx.stroke();
					ctx.closePath();

					// Draw the background color of the module
					ctx.beginPath();
					ctx.globalAlpha = 1;
					ctx.fillStyle = players[i].color;
					ctx.fillRect(players[i].modules[k].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 10, players[i].modules[k].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 10, player.size - player.size / 5, player.size - player.size / 5);
					ctx.closePath();

					// Draw the module image
					ctx.beginPath();
					ctx.globalAlpha = 1;
					ctx.drawImage(regenTile1, players[i].modules[k].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].modules[k].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size, player.size);
					ctx.closePath();


					// Draw the module health bar
					if (players[i].modules[k].hp < 50) {
						ctx.beginPath();
						ctx.fillStyle = players[i].color;
						ctx.fillRect(players[i].modules[k].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].modules[k].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size * 1.2, players[i].modules[k].hp*rectHeightRel, player.size / 4);
						ctx.closePath()
					}
				}
			}
		}
	}
}

function drawPlayersProjectiles(players) {
	// For all the players on the sever
	for (var i = 0; i < players.length; i++) {
		if (players[i].id != socket.id) {
			//For all the players projectiles
			for (var j = 0; j < players[i].projectiles.length; j++) {

				//Make sure the bullets are within the screen 
				if (inScreen(players[i].projectiles[j].pos.x, players[i].projectiles[j].pos.y, player)) {

					//Determine the class of the player
					if (players[i].class.value != 1) {

						//Draw a circle bullet
						ctx.beginPath();
						ctx.arc(players[i].projectiles[j].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].projectiles[j].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, players[i].projectiles[j].actualSize*rectHeightRel/2, 0, 2 * Math.PI, false);
						ctx.fillStyle = "black";
						ctx.fill();
						ctx.closePath()
					} else {

						//Draw a square bullet
						ctx.beginPath();
						ctx.lineWidth = rectHeightRel*players[i].projectiles[j].actualSize;
						var x = players[i].projectiles[j].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel
						var y =  players[i].projectiles[j].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel
						ctx.moveTo(x, y)
						var target = new Vector(players[i].projectiles[j].target.x, players[i].projectiles[j].target.y)
						target.normalize();
						target.mult(rectHeightRel*30);
						ctx.lineTo(x+target.x, y+target.y)
						ctx.strokeStyle = "black";
						ctx.stroke();
					}
				}
			}
		}
	}
}

function drawPlayersTiles(players) {
	// For all the players
	for(var i = 0; i < players.length; i++) {

		// Make sure walls have been placed
		if (players[i].walls) {

			// For all the players walls
			for(var j = 0; j < players[i].walls.length; j++) {

				// Make sure the walls are within the screen
				if(inScreen(players[i].walls[j].pos.x, players[i].walls[j].pos.y, player)) {

					// Draw the background color of the walls
					ctx.beginPath();
					ctx.fillStyle = players[i].color;
					ctx.fillRect(players[i].walls[j].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 10, players[i].walls[j].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 10, player.size - player.size / 5, player.size - player.size / 5);
					ctx.closePath();

					// Variable
					var wallImage = undefined;
					var wall = players[i].walls[j];

					// Draw the correct wall image for the health
					if (wall.hp <= wallLevels[0].hp) {
						wallImage = wallBroken;
					} else if (wall.hp <= wallLevels[1].hp) {
						wallImage = wallTile;
					} else if (wall.hp <= wallLevels[2].hp) {
						wallImage = wallTile2;
					} else if (wall.hp <= wallLevels[3].hp) {
						wallImage = wallTile3;
					} else {
						wallImage = wallTile4;
					}

					// Draw that image
					ctx.drawImage(wallImage, wall.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, wall.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size, player.size);	
				}
			}
		}
	}
}

function drawGrid() {

	// Draw grid
	ctx.strokeStyle = "black";
	if(play === 3) {
		ctx.lineWidth = 0.2;
		ctx.globalAlpha = 1;
	} else {
		ctx.lineWidth = 0.5;
		ctx.globalAlpha = 0.5;
	}

	// Create grid offset from drawing when zooming
	ctx.beginPath();
	var rightOffset = -player.pos.x*rectHeightRel%player.size/player.size
	for (var x = rightOffset+1; x < canvas.width/player.size; x++) {
		ctx.moveTo(x*player.size+canvas.width/2, 0);
		ctx.lineTo(x*player.size+canvas.width/2, canvas.height);
	}
	var leftOffset = player.pos.x*rectHeightRel%player.size/player.size
	for (var x = leftOffset; x < canvas.width/player.size; x++) {
		ctx.moveTo(x*-player.size+canvas.width/2, 0);
		ctx.lineTo(x*-player.size+canvas.width/2, canvas.height);
	}
	var bottomOffset = -player.pos.y*rectHeightRel%player.size/player.size;
	for (var y = bottomOffset+1; y < canvas.height/player.size; y++) {
		ctx.moveTo(0, y*player.size+canvas.height/2);
		ctx.lineTo(canvas.width, y*player.size+canvas.height/2);
	}
	var topOffset = player.pos.y*rectHeightRel%player.size/player.size;
	for (var y = topOffset; y < canvas.height/player.size; y++) {
		ctx.moveTo(0, y*-player.size+canvas.height/2);
		ctx.lineTo(canvas.width, y*-player.size+canvas.height/2);
	}
	ctx.stroke();
	ctx.closePath();

	// Reset Alpha
	ctx.globalAlpha = 1;

	// Draw map boundaries
	ctx.beginPath();
	ctx.strokeStyle = "black"
	ctx.lineWidth = 2;
	ctx.moveTo(-arenaSize*rectHeightRel-player.pos.x*rectHeightRel+canvas.width/2, -arenaSize*rectHeightRel-player.pos.y*rectHeightRel+canvas.height/2);
	ctx.lineTo(-arenaSize*rectHeightRel-player.pos.x*rectHeightRel+canvas.width/2, arenaSize*rectHeightRel-player.pos.y*rectHeightRel+canvas.height/2);
	ctx.lineTo(arenaSize*rectHeightRel-player.pos.x*rectHeightRel+canvas.width/2, arenaSize*rectHeightRel-player.pos.y*rectHeightRel+canvas.height/2);
	ctx.lineTo(arenaSize*rectHeightRel-player.pos.x*rectHeightRel+canvas.width/2, -arenaSize*rectHeightRel-player.pos.y*rectHeightRel+canvas.height/2);
	ctx.lineTo(-arenaSize*rectHeightRel-player.pos.x*rectHeightRel+canvas.width/2, -arenaSize*rectHeightRel-player.pos.y*rectHeightRel+canvas.height/2);
	ctx.stroke();
	ctx.closePath();

}

function animatePowerSurge(target, origin, color, totalTime, splitTime) {

	// If the surge occurs
	if(animateSurge) {

		// Create a new vector at the center of a core
		var coreDeathLightning = {
			pos: new Vector(coreDeathPos.x + 50, coreDeathPos.y + 50)
		}

		// Select random points around the core up to 150px away
		var randomCoreDeath = {
			pos: new Vector(coreDeathPos.x + (Math.floor(Math.random() * 200)-100), coreDeathPos.y + (Math.floor(Math.random() * 200)-100))
		}

		// Issue the draw lightning fuction to continue
		drawLightning(randomCoreDeath, coreDeathLightning, "#4286f4")

		// Reset animate surge variable
		animateSurge = false;
	}
}

function drawPowerBalls() {

	// Make sure there are at least one powerball
	if(powerBalls.length > 0) {

		//For all the powerballs in the lobby
		for (var i = 0; i < powerBalls.length; i++) {

			//Make sure the powerballs are within the screen
			if(inScreen(powerBalls[i].pos.x, powerBalls[i].pos.y, player)) {

				//Draw the powerball with glowing effect
				ctx.beginPath();
				ctx.shadowBlur = 15;
				ctx.globalCompositeOperation = "lighter";
				ctx.shadowColor = "#4286f4";
				ctx.fillStyle = '#4286f4';
				ctx.globalAlpha = 0.7;
				ctx.arc((powerBalls[i].pos.x+Math.random() * 1)*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, (powerBalls[i].pos.y+Math.random() * 1)*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, powerBalls[i].mass*7*rectHeightRel, 0, 2 * Math.PI);
				ctx.fill();

				// Reset 
				ctx.globalAlpha = 0.1;
				ctx.globalCompositeOperation = "source-over";
				ctx.shadowColor = "transparent";
				ctx.shadowBlur = 0;
				ctx.closePath();
			}
		}

		// If the random chance occurs
		if(Math.floor(Math.random() * 200) == 1) {

			// For all the powerballs in the lobby
			for (var i = 0; i < powerBalls.length; i++) {

				// For all the powerballs in the lobby
				for(var j = 0; j < powerBalls.length; j++) {

					//Make sure the lightning does not cast to itself
					if(j != i) {

						//Determines whether the powerballs are within 150px of eachother
						var distance = Math.sqrt(Math.pow(powerBalls[j].pos.x - powerBalls[i].pos.x, 2) + Math.pow(powerBalls[j].pos.y - powerBalls[i].pos.y, 2))
						if(distance < 150) {

							//Draw the lightning 
							//drawLightning(powerBalls[j], powerBalls[i], '#4286f4');	
						}	
					}
				}
			}		
		}		
	}
}

function drawLightning(currentTarget, currentOrigin, color) {

	//Variables
	var size = canvas.width;
	var minSegmentHeight = 5;
	var groundHeight = canvas.height;
	var roughness = 2;
	var maxDifference = size / 10;
	var segmentHeight = groundHeight - currentOrigin.pos.y;
	var lightning = [];

	//Add the target and the origin to the array
	lightning.push({x: currentOrigin.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, y: currentOrigin.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel});
  	lightning.push({x: currentTarget.pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, y: currentTarget.pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel});

  	//Split the line into smaller more speadout lines to appear at lightning
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

	//Draw the lightning with a glow effect
	ctx.beginPath();
	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = "lighter";
	ctx.shadowColor = "#4286f4";
	ctx.fillStyle = "#4286f4";
	ctx.shadowBlur = 15;
	ctx.lineWidth = 2 * rectHeightRel;
	for (var i = 0; i < lightning.length; i++) {
	  ctx.lineTo(lightning[i].x, lightning[i].y);
	}
  	ctx.stroke();

 	//Reset
	ctx.shadowColor = "transparent";
	ctx.globalCompositeOperation = "source-over";
	ctx.shadowBlur = 0;
	ctx.restore();
	ctx.closePath();

}

function inScreen(x, y, player) {

	//If player in spectator mode return true
	if(play === 3) {
		return true;
	} else {

		//Make sure the coordintes of the player and the factor are within the screen size
		if ((x - player.pos.x + player.actualSize) * rectHeightRel < canvas.width * rectHeightRel && (x - player.pos.x - player.actualSize) * rectHeightRel > -canvas.width * rectHeightRel && (y - player.pos.y + player.actualSize) * rectHeightRel < canvas.height * rectHeightRel && (y - player.pos.y - player.actualSize) * rectHeightRel > -canvas.height * rectHeightRel) {
			return true;
		}
	}
}

function coreDeathAnimation() {
	explosionRadius = 0;
	animateSurgeProgress = true;
	
	var powerSurgeInterval = setInterval(function(){ 
	animateSurge = true;
	}, 200);
	var powerSurgeTimeout = setTimeout(function(){ 
	clearTimeout();
	clearInterval(powerSurgeInterval)
	animateSurgeProgress = false;
	animateSurgeFinish = true;
	}, 3000);
}