// UI elements
var slider = document.getElementById("UIscale");
var classSelect = document.getElementById("playerClass");

// Define
var lobby;
var optionKey = 27;
var optionToggle = false;
var optionMode = false;

function drawUI(player, players) {

	// Define
	var leaderboardSize = 320 * relativeHeight;
	var uiBottomOffset = 15 * relativeHeight;
	var inventorySize = 64 * relativeHeight;
	var averageArray = fpsArray.reduce((a, b) => a + b, 0)/fpsArray.length;
	var leaderboardSpace = 20 * relativeHeight;
	var fontSize = 15 * relativeHeight;
	var mapSize = 200 * relativeHeight;

	if(eventInput[9]) {
		drawPlayerInfo(uiBottomOffset, inventorySize);
	} else {
		// Draw UI minimap
		drawMap(uiBottomOffset, mapSize);

		// Draw UI inventory
		drawInventory(uiBottomOffset, inventorySize);

		// Draw UI leaderboard
		drawLeaderboard(uiBottomOffset, leaderboardSize, fontSize, leaderboardSpace);

		// Draw cooldown time
		drawCooldown(uiBottomOffset, averageArray);

		// Draw UI kill message
		drawKill();

		// Draw UI power increse message
		drawPowerIncrease();

		// Draw UI refresh alert
		drawAlert();

		// Draw options
		drawOptions();

		// Draw advanced setting
		drawAdvanced(averageArray, uiBottomOffset);

		// Draw server kills
		drawServerKills(uiBottomOffset);
		
	}	
}

function drawDeadSpot() {
	if(arenaDeadSpots.length > 0) {
		for (var i = 0; i < arenaDeadSpots.length; i++) {
			if(inScreen(arenaDeadSpots[i].x, arenaDeadSpots[i].y, player)) {
				ctx.beginPath();
				ctx.fillStyle = '#4286f4';
				ctx.globalAlpha = 1;
				ctx.arc((arenaDeadSpots[i].x+Math.random() * 1)*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, (arenaDeadSpots[i].y+Math.random() * 1)*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size / 4, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawPlayerInfo(uiBottomOffset, inventorySize) {

	var playerInfoHeight = (canvas.height - uiBottomOffset * 5) / 4
	var playerInfoWidth = (canvas.width - uiBottomOffset * 7) / 6


	for (var j = 0; j < Math.ceil(players.length/4); j++) {
		if(j == Math.ceil(players.length/4) - 1) {
			colNumber = players.length%4;
		} else {
			colNumber = 4;
		}
		for (var i = 0; i < colNumber; i++) {

			ctx.beginPath();
			ctx.globalAlpha = 0.3;
			ctx.fillStyle = 'black';
			fillRoundedRect(0+uiBottomOffset*(j+1)+playerInfoWidth*j, playerInfoHeight*i+uiBottomOffset*(i+1), playerInfoWidth, playerInfoHeight, 5);
			ctx.closePath();

			ctx.beginPath();
			ctx.globalAlpha = 0.9;
			ctx.strokeStyle = "Black";
			ctx.lineWidth = players[i+(4*j)].barrelSize/2
			ctx.moveTo(playerInfoWidth/2+uiBottomOffset*(j+1)+playerInfoWidth*j-10, playerInfoHeight*i+uiBottomOffset*(i+1)+40);
			ctx.lineTo(playerInfoWidth/2+50+uiBottomOffset*(j+1)+playerInfoWidth*j-10, playerInfoHeight*i+uiBottomOffset*(i+1)+40);
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.globalAlpha = 0.9;
			ctx.fillStyle = 'black';
			ctx.arc(playerInfoWidth/2+uiBottomOffset*(j)+uiBottomOffset+playerInfoWidth*j-10, playerInfoHeight*i+uiBottomOffset*(i+1)+40, player.size/2/rectHeightRel, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath()
			ctx.fillStyle = players[i+(4*j)].color;
			ctx.beginPath();
			ctx.arc(playerInfoWidth/2+uiBottomOffset*(j)+uiBottomOffset+playerInfoWidth*j-10, playerInfoHeight*i+uiBottomOffset*(i+1)+40, player.size/2.3/rectHeightRel, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.font = 16 + "px Pier";
			ctx.textAlign="center";
			ctx.textBaseline="top";  
			ctx.fillStyle = "White";
			ctx.fillText(players[i+(4*j)].name, playerInfoWidth/2+uiBottomOffset*(j)+uiBottomOffset+playerInfoWidth*j, playerInfoHeight*i+uiBottomOffset*(i+1)+70);
			ctx.fillText('Score: ' + (players[i+(4*j)].score).toFixed(2), playerInfoWidth/2+uiBottomOffset*(j)+uiBottomOffset+playerInfoWidth*j, playerInfoHeight*i+uiBottomOffset*(i+1)+90);
			ctx.fillText('Kill Count: ' + players[i+(4*j)].killCount, playerInfoWidth/2+uiBottomOffset*(j)+uiBottomOffset+playerInfoWidth*j, playerInfoHeight*i+uiBottomOffset*(i+1)+110);
			ctx.closePath();

			
		}
	}
}

function drawPreview(imageName, title, desc, cost) {

	// Define
	var uiBottomOffset = 15 * relativeHeight;

	// Draw backgound rect
	ctx.beginPath();
	ctx.fillStyle = "Black";
	ctx.globalAlpha = 0.5;
	fillRoundedRect(uiBottomOffset, uiBottomOffset, 300*relativeHeight, 160*relativeHeight, 5);
	ctx.closePath();

	// Draw top image
	ctx.beginPath();
	ctx.globalAlpha = 1;
	ctx.fillStyle = player.color;
	ctx.fillRect(uiBottomOffset - 25*relativeHeight + 150*relativeHeight + uiBottomOffset / 6, uiBottomOffset * 2 + uiBottomOffset / 6, 50*relativeHeight - uiBottomOffset / 3, 50*relativeHeight - uiBottomOffset / 3);
	ctx.drawImage(imageName, uiBottomOffset - 25*relativeHeight + 150*relativeHeight, uiBottomOffset * 2, 50*relativeHeight, 50*relativeHeight);
	ctx.closePath();

	// Draw preview text
	ctx.beginPath();
	ctx.font = 20*relativeHeight + "px Pier";
	ctx.textAlign="center";
	ctx.textBaseline="top";  
	ctx.fillStyle = "White";
	ctx.fillText(title, uiBottomOffset + 150*relativeHeight, uiBottomOffset * 2.5 + 50*relativeHeight);
	ctx.font = 15*relativeHeight + "px Pier";
	ctx.fillText(desc, uiBottomOffset + 150*relativeHeight, uiBottomOffset * 5.0 + 50*relativeHeight);
	ctx.fillText('Cost: ' + cost + 'C/P', uiBottomOffset + 150*relativeHeight, uiBottomOffset * 6.2 + 50*relativeHeight);
	ctx.closePath();

}

	
function drawAdvanced(averageArray, uiBottomOffset) {
	
	// Draw advanced options
	if(advancedOptions) {
		ctx.beginPath();
		ctx.textAlign = "left"
		ctx.font = 20*relativeHeight + "px Pier";
		ctx.fillStyle = "Black";
		ctx.fillText('FPS: ' + Math.floor(averageArray), uiBottomOffset, uiBottomOffset * 2);
		ctx.fillText("DELTA: " + Math.floor(delta), uiBottomOffset, uiBottomOffset * 4);
		ctx.fillText('LATENCY: ' + Math.floor(latency) + ' MS', uiBottomOffset, uiBottomOffset * 6);
		ctx.closePath();
	}
}

function drawOptions() {

	// Get UI scale slider
	var UIslider = document.getElementById("uiSlider");

	// Options
	if(eventInput[optionKey]) {
		if(optionToggle === false) {
			optionToggle = true;
			optionMode = !optionMode;
		}
	} else {
		if (optionToggle) {
			optionToggle = false;
		}
	}

	// When option mode is enabled
	if(optionMode) {

		// Enable UI slider
		UIslider.style.display = 'block';

		// Define
		var optionWidth = 300 * relativeHeight;
		ctx.beginPath();
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = 'Black';
		ctx.fillRect(canvas.width / 2 - optionWidth / 2, canvas.height / 2 - optionWidth / 4, optionWidth, optionWidth / 2);
		ctx.globalAlpha = 1;
		ctx.closePath();

	} else {
		// Disable UI slider
		UIslider.style.display = 'none';
	}
}

function drawAlert() {

	// Draw server refesh alert
	if(alertText) {
		var uiBottomOffset = 15 * relativeHeight;
		var fontSize = 40 * relativeHeight;

		ctx.fillStyle = "Black";
		ctx.textAlign="center"; 
		ctx.font = fontSize + 20 * relativeHeight + "px Pier";
		ctx.fillText('SERVER REFRESH IN ' + refreshTime + ' SECONDS', canvas.width / 2, canvas.height / 5);
	}
}

function drawServerKills(uiBottomOffset) {

	// Draw server kill chat
	if(chatList.length > 0) {	

		// Draw server kill box
		ctx.beginPath();
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = "Black";
		if(previewUI) {
			fillRoundedRect(uiBottomOffset, uiBottomOffset + 160*relativeHeight + uiBottomOffset, 300*relativeHeight, (chatList.length + 1) * (15*relativeHeight) - uiBottomOffset + 10, 5);
		} else {
			fillRoundedRect(uiBottomOffset, uiBottomOffset, 300*relativeHeight, (chatList.length + 1) * (15*relativeHeight) - uiBottomOffset + 10, 5);
		}
		ctx.globalAlpha = 1;
		ctx.closePath();	

		// Draw names
		var j = 0;
		for (var i = chatList.length - 1; i > -1; i--) {
			ctx.beginPath();
			ctx.globalAlpha = 1;
			ctx.textAlign="left"; 
			ctx.textBaseline="bottom"; 
			ctx.font = 13 * relativeHeight + "px Pier";
			ctx.fillStyle = "Black";
			if(previewUI) {
				ctx.fillText(chatList[i], uiBottomOffset * 2, uiBottomOffset * 2 + j * (15 * relativeHeight) + 5 + uiBottomOffset + 160*relativeHeight, 300*relativeHeight - uiBottomOffset * 2);
			} else {
				ctx.fillText(chatList[i], uiBottomOffset * 2, uiBottomOffset * 2 + j * (15 * relativeHeight) + 5, 300*relativeHeight - uiBottomOffset * 2);
			}
			ctx.closePath();
			j++;
		}		
	}
	previewUI = false;
}

function drawKill() {
	var killStreakName;
	if(killText) {
		var uiBottomOffset = 15 * relativeHeight;
		var fontSize = 40 * relativeHeight;
		ctx.fillStyle = "Black";
		ctx.textAlign="center"; 

		// Draw tupe of steak
		if(player.killStreak > 1) {
			if(player.killStreak === 2) {
				killStreakName = 'Double';
			} else if(player.killStreak === 3) {
				killStreakName = 'Triple';
			} else if(player.killStreak === 4) {
				killStreakName = 'Quadruple';
			} else if(player.killStreak === 5) {
				killStreakName = 'Quintuple';
			} else if(player.killStreak === 6) {
				killStreakName = 'Sextuple';
			} else {
				killStreakName = player.killStreak + 'X';
			}
			// Draw killsreak kill
			ctx.font = fontSize + "px Pier";
			ctx.fillText(killStreakName + ' KILL', canvas.width / 2, canvas.height / 4 - 40*relativeHeight - uiBottomOffset);
			ctx.font = fontSize + 20 * relativeHeight + "px Pier";
			if(finalKill) {
				ctx.fillText('FINAL ELIMINATION ' + killName.toUpperCase(), canvas.width / 2, canvas.height / 4);
			} else {
				ctx.fillText('ELIMINATED ' + killName.toUpperCase(), canvas.width / 2, canvas.height / 4);
			}
		} else {
			// Draw killsreak kill
			ctx.font = fontSize + "px Pier";
			if(finalKill) {
				ctx.fillText('FINAL ELIMINATION ' + killName.toUpperCase(), canvas.width / 2, canvas.height / 4);
			} else {
				ctx.fillText('ELIMINATED ' + killName.toUpperCase(), canvas.width / 2, canvas.height / 4);
			}
		}	
	}
}

function drawPowerIncrease() {

	// Define
	var reloadWidth = canvas.width / 8;
	var reloadHeight = 60 * relativeHeight;
	var uiBottomOffset = 15 * relativeHeight;

	// Draw increse text
	if(increaseText) {
		ctx.beginPath();
		ctx.font = 25*relativeHeight + "px Pier";
		ctx.fillStyle = "White";
		ctx.textAlign="right"; 
		ctx.fillText('+' + increase, canvas.width - reloadWidth + reloadWidth - uiBottomOffset * 2, canvas.height - reloadHeight * 1.5 - uiBottomOffset * 2 + 25*relativeHeight / 2 - 2*relativeHeight, reloadWidth / 6);
		ctx.closePath()
	}

}

function drawLeaderboard(uiBottomOffset, leaderboardSize, fontSize, leaderboardSpace) {

	// Draw leaderboard top
	ctx.globalAlpha = 1;
	ctx.beginPath();
	ctx.font = fontSize + "px Pier";
	ctx.fillStyle = "Black";
	ctx.textAlign="left"; 
	ctx.fillText('RANK', canvas.width - leaderboardSize, uiBottomOffset * 2);
	ctx.fillText('NAME', canvas.width - leaderboardSize + 60 * relativeHeight, uiBottomOffset * 2);
	ctx.fillText('SCORE', canvas.width - leaderboardSize + 200 * relativeHeight, uiBottomOffset * 2);
	ctx.fillText('COLOR', canvas.width - leaderboardSize + 260 * relativeHeight, uiBottomOffset * 2);

	lobby = [];
	for (var i = 0; i < players.length; i++) {
		if (players[i].hp > 0 && players[i].score > 0 && !player.dead && player.pos.x != 0 && player.pos.y != 0) {
			lobby.push(players[i])
		}
	}
	lobby.push(player)

	// Sort the lobby
	lobby.sort((a,b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));
	onLeader = false;

	// Draw top 10 leaders
	for(var i = 0; i < lobby.length; i++) {

		if (i < 9) {
			if(lobby[i].name.length > 17) {
				leaderName = (lobby[i].name).slice(0,14) + '...' 
			} else {
				leaderName = lobby[i].name;
			}
			ctx.fillText('#' + (i + 1), canvas.width - leaderboardSize, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
			ctx.fillText(leaderName, canvas.width - leaderboardSize + 60 * relativeHeight, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
			ctx.fillText(lobby[i].score.toFixed(2), canvas.width - leaderboardSize + 200 * relativeHeight, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
			ctx.beginPath();
			ctx.fillStyle = lobby[i].color;
			ctx.arc(canvas.width - leaderboardSize + 260 * relativeHeight + 27 * relativeHeight, uiBottomOffset * 2 + (leaderboardSpace * (i + 1)) - fontSize / 2 - 2*relativeHeight,fontSize / 2,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
			ctx.fillStyle = "Black";
			if (lobby[i].id === undefined) {
				onLeader = true;
			}
		} else if (i == 9 && onLeader) {
			if(lobby[i].name.length > 17) {
				leaderName = (lobby[i].name).slice(0,14) + '...' 
			} else {
				leaderName = lobby[i].name;
			}
			ctx.fillText('#' + (i + 1), canvas.width - leaderboardSize, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
			ctx.fillText(leaderName, canvas.width - leaderboardSize + 60 * relativeHeight, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
			ctx.fillText(lobby[i].score.toFixed(2), canvas.width - leaderboardSize + 200 * relativeHeight, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
			ctx.beginPath();
			ctx.fillStyle = lobby[i].color;
			ctx.arc(canvas.width - leaderboardSize + 260 * relativeHeight + 25 * relativeHeight, uiBottomOffset * 2 + leaderboardSpace * (i + 1) - fontSize / 2 - 2 * relativeHeight,fontSize / 2,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
			ctx.fillStyle = "Black";
		} else if (i == 9) {
			if(lobby[i].name.length > 17) {
				playerName = (player.name).slice(0,14) + '...' 
			} else {
				playerName = player.name;
			}
			ctx.fillText('#' + (lobby.indexOf(player.power) + 1), canvas.width - leaderboardSize, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
			ctx.fillText(player.name, canvas.width - leaderboardSize + 60 * relativeHeight, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
			ctx.fillText(player.score.toFixed(2), canvas.width - leaderboardSize + 200, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
			ctx.beginPath();
			ctx.fillStyle = player.color;
			ctx.arc(canvas.width - leaderboardSize + 260 * relativeHeight + 25 * relativeHeight, uiBottomOffset * 2 + leaderboardSpace * (i + 1) - fontSize / 2 - 2 * relativeHeight,fontSize / 2,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
			ctx.fillStyle = "Black";
		}
	}
	ctx.closePath()

}

function drawCooldown(uiBottomOffset, averageArray) {

	// Draw cooldown
	var reloadWidth = 200 * relativeHeight;
	var reloadHeight = 60 * relativeHeight;

	ctx.beginPath();
	ctx.fillStyle = 'Black';
	ctx.globalAlpha = 0.5;
	fillRoundedRect(canvas.width - reloadWidth - uiBottomOffset, canvas.height - reloadHeight - uiBottomOffset, reloadWidth, reloadHeight, 5);
	ctx.globalAlpha = 0.5;
	fillRoundedRect(canvas.width - reloadWidth - uiBottomOffset, canvas.height - reloadHeight * 2 - uiBottomOffset * 2, reloadWidth, reloadHeight, 5);
	ctx.closePath();

	ctx.beginPath();

	// Draw reload bar
	ctx.globalAlpha = 0.7;
	ctx.fillStyle = player.color;
	var milliFrames = 1000 / Math.floor(averageArray);
	var cooldownFrameTime = player.cooldownDelay / milliFrames;
	var pixelsPerFrame = (reloadWidth - uiBottomOffset * 2) / cooldownFrameTime;
	var maxReload = reloadWidth - uiBottomOffset * 2;
	if(player.cooldown === player.cooldownDelay) {
		currentReload = 0;
	}
	if(player.cooldown > 0) {
		if(currentReload + pixelsPerFrame > reloadWidth - uiBottomOffset * 2) {
			currentReload = reloadWidth - uiBottomOffset * 2;
		} else {
			currentReload = currentReload + pixelsPerFrame;
		}
	} else {
		currentReload = reloadWidth - uiBottomOffset * 2;
	}
	if(currentReload < 0) {
		currentReload = 0;
	}
	ctx.fillRect(canvas.width - reloadWidth - uiBottomOffset - (reloadWidth - uiBottomOffset * 2 - reloadWidth) /2, canvas.height - uiBottomOffset - ((canvas.height / 40 / 2) + reloadHeight / 2), currentReload, canvas.height / 40);
	ctx.closePath()

	// Draw power
	ctx.beginPath();
	ctx.font = 25*relativeHeight + "px Pier";
	ctx.fillStyle = "White";
	ctx.textAlign="left"; 
	ctx.textBaseline="middle"; 
	ctx.fillText((player.power).toFixed(2), canvas.width - reloadWidth, canvas.height - reloadHeight * 2 - uiBottomOffset * 2 + reloadHeight / 2, reloadWidth - uiBottomOffset * 4);
	ctx.closePath()

}

function drawInventory(uiBottomOffset, inventorySize) {

	// Draw inventory slots
	ctx.beginPath()
	ctx.globalAlpha = 0.5;
	ctx.drawImage(slot1, (canvas.width / 2 - inventorySize / 2) - inventorySize * 4 - uiBottomOffset * 4, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot2, (canvas.width / 2 - inventorySize / 2) - inventorySize * 3 - uiBottomOffset * 3, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot3, (canvas.width / 2 - inventorySize / 2) - inventorySize * 2 - uiBottomOffset * 2, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot4, (canvas.width / 2 - inventorySize / 2) - inventorySize - uiBottomOffset, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot5, canvas.width / 2 - inventorySize / 2, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot6, (canvas.width / 2 - inventorySize / 2) + inventorySize + uiBottomOffset, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot7, (canvas.width / 2 - inventorySize / 2) + inventorySize * 2 + uiBottomOffset * 2, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot8, (canvas.width / 2 - inventorySize / 2) + inventorySize * 3 + uiBottomOffset * 3, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot9, (canvas.width / 2 - inventorySize / 2) + inventorySize * 4 + uiBottomOffset * 4, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.globalAlpha = 0.7;
	ctx.closePath()

	// Draw inverntory items
	ctx.beginPath()
	ctx.fillStyle = player.color;
	ctx.fillRect((canvas.width / 2 - inventorySize / 2) - inventorySize * 4 - uiBottomOffset * 4 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	ctx.fillRect((canvas.width / 2 - inventorySize / 2) - inventorySize * 3 - uiBottomOffset * 3 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	ctx.fillRect((canvas.width / 2 - inventorySize / 2) - inventorySize * 2 - uiBottomOffset * 2 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	ctx.fillRect((canvas.width / 2 - inventorySize / 2) + inventorySize * 4 + uiBottomOffset * 4 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	ctx.fillRect((canvas.width / 2 - inventorySize / 2) + inventorySize * 3 + uiBottomOffset * 3 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	// ctx.fillRect((canvas.width / 2 - inventorySize / 2) + inventorySize * 2 + uiBottomOffset * 2 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	ctx.globalAlpha = 1;
	ctx.closePath()

	// Draw inventory item color
	ctx.beginPath()
	ctx.drawImage(wallTile,  (canvas.width / 2 - inventorySize / 2) - inventorySize * 4 - uiBottomOffset * 4 + inventorySize / 4, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4, inventorySize / 2, inventorySize / 2);
	ctx.drawImage(regenTile1,  (canvas.width / 2 - inventorySize / 2) - inventorySize * 3 - uiBottomOffset * 3 + inventorySize / 4, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4, inventorySize / 2, inventorySize / 2);
	ctx.drawImage(shieldTile1,  (canvas.width / 2 - inventorySize / 2) - inventorySize * 2 - uiBottomOffset * 2 + inventorySize / 4, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4, inventorySize / 2, inventorySize / 2);
	ctx.drawImage(coreTile1,  (canvas.width / 2 - inventorySize / 2) + inventorySize * 4 + uiBottomOffset * 4 + inventorySize / 4, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4, inventorySize / 2, inventorySize / 2);
	ctx.drawImage(abilityUpgrader,  (canvas.width / 2 - inventorySize / 2) + inventorySize * 3 + uiBottomOffset * 3 + inventorySize / 4, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4, inventorySize / 2, inventorySize / 2);
	// ctx.drawImage(towerTile1,  (canvas.width / 2 - inventorySize / 2) + inventorySize * 2 + uiBottomOffset * 2 + inventorySize / 4, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4, inventorySize / 2, inventorySize / 2);
	ctx.globalAlpha = 0.5;
	ctx.closePath()

	// Make items red if used
	ctx.beginPath()
	if(core.exists === true || !ranCooldown) {
		ctx.fillStyle = "red";
		ctx.fillRect((canvas.width / 2 - inventorySize / 2) + inventorySize * 4 + uiBottomOffset * 4 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	}
	if(!ranCooldown && cooldownRemain != 0) {
		ctx.globalAlpha = 1;
		ctx.font = 20*relativeHeight + "px Pier";
		ctx.fillStyle = "Black";
		ctx.textAlign="center"; 
		ctx.textBaseline="middle";
		ctx.fillText(cooldownRemain, (canvas.width / 2 - inventorySize / 2) + inventorySize * 4 + uiBottomOffset * 4 + inventorySize / 2, canvas.height - inventorySize - uiBottomOffset + inventorySize / 2, inventorySize, inventorySize);
	}
	ctx.closePath()
}

function drawMessage(message) {

	// Define
	var inventorySize = 64 * relativeHeight;
	var uiBottomOffset = 15 * relativeHeight;

	// Draw message
	ctx.beginPath()
	ctx.globalAlpha = 0.3;
	ctx.fillStyle = 'Black';
	ctx.fillRect(canvas.width / 2, uiBottomOffset, inventorySize * 4 + uiBottomOffset * 3, inventorySize / 2);
	ctx.fillRect(canvas.width / 2, uiBottomOffset, -(inventorySize * 4 + uiBottomOffset * 3), inventorySize / 2);
	ctx.globalAlpha = 0.7;
	ctx.font = 13*relativeHeight + "px Pier";
	ctx.fillStyle = "Black";
	ctx.textAlign="center"; 
	ctx.textBaseline="middle"; 
	ctx.globalAlpha = 1.0;
	ctx.fillText(message, canvas.width / 2, uiBottomOffset + inventorySize /4, canvas.width / 3 * relativeHeight - uiBottomOffset, inventorySize / 2);
	ctx.fill();
	
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

function drawMap(uiBottomOffset, mapSize) {

	// Draw map
	ctx.beginPath();
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = 'Black';
	fillRoundedRect(0 + uiBottomOffset, canvas.height - mapSize - uiBottomOffset, mapSize, mapSize, 5);
	ctx.closePath();
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.arc(0 + uiBottomOffset + mapSize / 2,canvas.height - mapSize - uiBottomOffset + mapSize / 2,1,0,2*Math.PI);
	ctx.fill();
	ctx.closePath();

	// Draw player on map
	ctx.beginPath();
	ctx.globalAlpha = 1;
	var mapCordHeight = arenaSize;
	var mapCordWidth = arenaSize;
	var mapHeigtRel = mapCordHeight / mapSize;
	ctx.fillStyle = player.color;
	if(player.pos.x <= mapCordWidth && player.pos.y <= mapCordHeight && player.pos.x >= (mapCordWidth * -1) && player.pos.y >= (mapCordHeight * -1)) {
	ctx.arc(0 + uiBottomOffset + mapSize / 2 + ((player.pos.x / mapHeigtRel) / 2), canvas.height - mapSize - uiBottomOffset + mapSize / 2 + ((player.pos.y / mapHeigtRel) / 2),3 * relativeHeight,0,2*Math.PI);
	ctx.fill();
	}
	if(core.exists === true) {
	ctx.fillRect(0 + uiBottomOffset + mapSize / 2 + (((core.pos.x + 50)/ mapHeigtRel) / 2) - 3 / 2,canvas.height - mapSize - uiBottomOffset + mapSize / 2 + (((core.pos.y + 50)/ mapHeigtRel) / 2) - 3 / 2, 6 * relativeHeight, 6 * relativeHeight);
	}
	ctx.closePath();
	
	// Draw other players on map
	for(var i = 0; i < players.length; i++) {
		if(players[i].pos.x <= mapCordWidth && players[i].pos.y <= mapCordHeight && players[i].pos.x >= (mapCordWidth * -1) && players[i].pos.y >= (mapCordHeight * -1) && !players[i].dead) {
			ctx.beginPath();
			ctx.fillStyle = players[i].color;
			ctx.arc(0 + uiBottomOffset + mapSize / 2 + ((players[i].pos.x / mapHeigtRel) / 2),canvas.height - mapSize - uiBottomOffset + mapSize / 2 + ((players[i].pos.y / mapHeigtRel) / 2),3 * relativeHeight,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}

	// Reset Alpha
	ctx.globalAlpha = 1;

	// Draw the coordinates
	if(advancedOptions) {
		ctx.beginPath();
		ctx.font = 20*relativeHeight + "px Pier";
		ctx.fillStyle = "Black";
		ctx.fillText('(' + (player.pos.x).toFixed(0) + ',' + (player.pos.y).toFixed(0) + ')', uiBottomOffset * 2 + mapSize, canvas.height - uiBottomOffset, mapSize);
		ctx.closePath()
	}

}

function drawPlayers(players) {
	ctx.globalAlpha = 1;

	for(var i = 0; i < players.length; i++) {
		if (players[i].id != socket.id) {
			// Draw player's cores
			if(players[i].core && players[i].core.exists == true && inScreen(players[i].core.pos.x, players[i].core.pos.y, player)) {
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

			if (players[i] && !players[i].dead && inScreen(players[i].pos.x, players[i].pos.y, player)) {

				ctx.globalAlpha = 1;
				// Draw players hp
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

			if(players[i].modules.length > 0) {
				for (var k = 0; k < players[i].modules.length; k++) {
					ctx.beginPath();
					ctx.globalAlpha = 0.5;
					ctx.strokeStyle = players[i].color;
					ctx.lineWidth=10*rectHeightRel;
					ctx.arc(players[i].modules[k].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 2, players[i].modules[k].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 2, 300*rectHeightRel, 0, 2 * Math.PI, false);
					ctx.stroke();
					ctx.closePath();

					ctx.beginPath();
					ctx.globalAlpha = 1;
					ctx.fillStyle = players[i].color;
					ctx.fillRect(players[i].modules[k].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel + player.size / 10, players[i].modules[k].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size / 10, player.size - player.size / 5, player.size - player.size / 5);
					ctx.closePath();

					ctx.beginPath();
					ctx.globalAlpha = 1;
					ctx.drawImage(regenTile1, players[i].modules[k].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].modules[k].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, player.size, player.size);
					ctx.closePath();

					if (players[i].modules[k].hp < 50) {
						ctx.beginPath();
						ctx.fillStyle = players[i].color;
						ctx.fillRect(players[i].modules[k].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].modules[k].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel + player.size * 1.2, players[i].modules[k].hp*rectHeightRel, player.size / 4);
						ctx.closePath()
					}

					/*for (var j = 0; j < players[i].walls.length; j++) {
						var playerDistance = new Vector(players[i].walls[j].pos.x, players[i].walls[j].pos.y)
						playerDistance.sub(new Vector(players[i].modules[k].x, players[i].modules[k].y));
						if (playerDistance.getMag() < 300*rectHeightRel) {
							if(players[i].walls[j].hp < 59) {
								players[i].walls[j].hp += 0.05;
								ctx.beginPath();
								ctx.globalAlpha = 0.8;
								ctx.drawImage(regenCover1, players[i].walls[j].pos.x*rectHeightRel+canvas.width/2-players[i].pos.x*rectHeightRel, players[i].walls[j].pos.y*rectHeightRel+canvas.height/2-players[i].pos.y*rectHeightRel, player.size, player.size);
								ctx.closePath();
							}
						}	
					}*/
				}
			}
		}
	}
}

function drawPlayersProjectiles(players) {
	// Draw projectiles
	for (var i = 0; i < players.length; i++) {
		for (var j = 0; j < players[i].projectiles.length; j++) {
			if (inScreen(players[i].projectiles[j].pos.x, players[i].projectiles[j].pos.y, player)) {
				if (players[i].class.value != 1) {
					ctx.beginPath();
					ctx.arc(players[i].projectiles[j].pos.x*rectHeightRel+canvas.width/2-player.pos.x*rectHeightRel, players[i].projectiles[j].pos.y*rectHeightRel+canvas.height/2-player.pos.y*rectHeightRel, players[i].projectiles[j].actualSize*rectHeightRel/2, 0, 2 * Math.PI, false);
					ctx.fillStyle = "black";
					ctx.fill();
					ctx.closePath()
				} else {
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


function fillRoundedRect(x, y, w, h, r){
	// Draw rounded rectangle
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.fill();   
}