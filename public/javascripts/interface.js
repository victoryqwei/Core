// UI elements
var slider = document.getElementById("UIscale");
var classSelect = document.getElementById("playerClass");
var lastPowerCycle = 0;
var thisPowerCycle = 0;

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

	if(lastPowerCycle != player.power) {
		thisPowerCycle += player.power - lastPowerCycle;
		increaseText = true;
		setTimeout(function() { 
			increaseText = false;
			thisPowerCycle = 0;
		}, 1000);
	}

	if(increaseText) {
		ctx.beginPath();
		ctx.font = 25*relativeHeight + "px Pier";
		ctx.fillStyle = "White";
		ctx.textAlign="right"; 
		ctx.textBaseline="middle"; 
		if(thisPowerCycle > 0) {
			ctx.fillText('+' + thisPowerCycle.toFixed(0), canvas.width - uiBottomOffset - 20*relativeHeight, canvas.height - reloadHeight * 2 - uiBottomOffset * 1.9 + reloadHeight / 2, reloadWidth - uiBottomOffset * 4);
		} else {
			ctx.fillText(thisPowerCycle.toFixed(0), canvas.width - uiBottomOffset - 20*relativeHeight, canvas.height - reloadHeight * 2 - uiBottomOffset * 1.9 + reloadHeight / 2, reloadWidth - uiBottomOffset * 4);
		}	
		ctx.closePath()
	}

	lastPowerCycle = player.power;

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
	ctx.fillText('POWER', canvas.width - leaderboardSize + 200 * relativeHeight, uiBottomOffset * 2);
	ctx.fillText('COLOR', canvas.width - leaderboardSize + 260 * relativeHeight, uiBottomOffset * 2);

	lobby = [];
	for (var i = 0; i < players.length; i++) {
		if (players[i].hp > 0 && players[i].power > 0 && !player.dead && player.pos.x != 0 && player.pos.y != 0) {
			lobby.push(players[i])
		}
	}
	lobby.push(player)

	// Sort the lobby
	lobby.sort((a,b) => (a.power < b.power) ? 1 : ((b.power < a.power) ? -1 : 0));
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
			ctx.fillText(lobby[i].power.toFixed(2), canvas.width - leaderboardSize + 200 * relativeHeight, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
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
			ctx.fillText(lobby[i].power.toFixed(2), canvas.width - leaderboardSize + 200 * relativeHeight, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
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
			ctx.fillText(player.power.toFixed(2), canvas.width - leaderboardSize + 200, uiBottomOffset * 2 + leaderboardSpace * (i + 1));
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
	ctx.fillText((player.power).toFixed(2), canvas.width - reloadWidth, canvas.height - reloadHeight * 2 - uiBottomOffset * 1.9 + reloadHeight / 2, reloadWidth - uiBottomOffset * 4);
	ctx.closePath()

}

function drawInventory(uiBottomOffset, inventorySize) {

	// Draw inventory slots
	ctx.beginPath()
	ctx.globalAlpha = 0.5;
	ctx.drawImage(slot1, (canvas.width / 2 - inventorySize / 2) - inventorySize * 1.5 - uiBottomOffset * 1.5, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot2, (canvas.width / 2 - inventorySize / 2) - inventorySize / 2 - uiBottomOffset / 2, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot3, (canvas.width / 2 - inventorySize / 2) + inventorySize / 2 + uiBottomOffset / 2, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.drawImage(slot4, (canvas.width / 2 - inventorySize / 2) + inventorySize * 1.5 + uiBottomOffset * 1.5, canvas.height - inventorySize - uiBottomOffset, inventorySize, inventorySize);
	ctx.globalAlpha = 0.7;
	ctx.closePath()

	// Draw inverntory items
	ctx.beginPath()
	ctx.fillStyle = player.color;
	ctx.fillRect((canvas.width / 2 - inventorySize / 2) - inventorySize * 1.5 - uiBottomOffset * 1.5 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	ctx.fillRect((canvas.width / 2 - inventorySize / 2) - inventorySize / 2 - uiBottomOffset / 2 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	ctx.fillRect((canvas.width / 2 - inventorySize / 2) + inventorySize * 1.5 + uiBottomOffset * 1.5 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	ctx.fillRect((canvas.width / 2 - inventorySize / 2) + inventorySize / 2 + uiBottomOffset / 2 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	ctx.globalAlpha = 1;
	ctx.closePath()

	// Draw inventory item color
	ctx.beginPath()
	ctx.drawImage(wallTile,  (canvas.width / 2 - inventorySize / 2) - inventorySize * 1.5 - uiBottomOffset * 1.5 + inventorySize / 4, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4, inventorySize / 2, inventorySize / 2);
	ctx.drawImage(regenTile1,  (canvas.width / 2 - inventorySize / 2) - inventorySize / 2 - uiBottomOffset / 2 + inventorySize / 4, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4, inventorySize / 2, inventorySize / 2);
	ctx.drawImage(coreTile1,  (canvas.width / 2 - inventorySize / 2) + inventorySize * 1.5 + uiBottomOffset * 1.5 + inventorySize / 4, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4, inventorySize / 2, inventorySize / 2);
	ctx.drawImage(abilityUpgrader,  (canvas.width / 2 - inventorySize / 2) + inventorySize / 2 + uiBottomOffset / 2 + inventorySize / 4, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4, inventorySize / 2, inventorySize / 2);
	ctx.globalAlpha = 0.5;
	ctx.closePath()

	// Make items red if used
	ctx.beginPath()
	if(core.exists === true || !ranCooldown) {
		ctx.fillStyle = "red";
		ctx.fillRect((canvas.width / 2 - inventorySize / 2) + inventorySize * 1.5 + uiBottomOffset * 1.5 + inventorySize / 4 + inventorySize / 27, canvas.height - inventorySize - uiBottomOffset + inventorySize / 4 + inventorySize / 27, inventorySize / 2 - inventorySize / 15, inventorySize / 2 - inventorySize / 15);
	}
	if(!ranCooldown && cooldownRemain != 0) {
		ctx.globalAlpha = 1;
		ctx.font = 20*relativeHeight + "px Pier";
		ctx.fillStyle = "Black";
		ctx.textAlign="center"; 
		ctx.textBaseline="middle";
		ctx.fillText(cooldownRemain, (canvas.width / 2 - inventorySize / 2) + inventorySize * 1.5 + uiBottomOffset * 1.5 + inventorySize / 2, canvas.height - inventorySize - uiBottomOffset + inventorySize / 2, inventorySize, inventorySize);
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