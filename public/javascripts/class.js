//Player class
var playerSoldier = document.getElementById('Soldier');
var playerSniper = document.getElementById('Sniper');
var playerHeavy = document.getElementById('Heavy');
var playerCannoneer = document.getElementById('Cannoneer');
playerSoldier.onclick = function() {
	chosenClass = true;
	player.class = {
		name: "soldier",
		value: 0
	}
	player.cooldownDelay = 300;
	player.damage = 10;
	player.hp = 50;
	player.maxHP = 50;
	player.maxView = 0.6;
	rectHeightRel = 0.6;
	spawnPlayer();
}
playerSniper.onclick = function() {
	chosenClass = true;
	player.class = {
		name: "sniper",
		value: 1
	}
	player.cooldownDelay = 1000;
	player.damage = 25;
	player.barrelSize = 20;
	player.speed = 20;
	player.hp = 50;
	player.maxHP = 50;
	player.maxView = 0.6;
	rectHeightRel = 0.6;
	spawnPlayer();
}
playerHeavy.onclick = function() {
	chosenClass = true;
	player.class = {
		name: "heavy",
		value: 2
	}
	player.cooldownDelay = 30;
	player.damage = 2;
	player.barrelSize = 30;
	player.speed = 20;
	player.hp = 50;
	player.maxHP = 50;
	player.maxView = 0.6;
	rectHeightRel = 0.6;
	spawnPlayer();
}
playerCannoneer.onclick = function() {
	chosenClass = true;
	player.class = {
		name: "cannoneer",
		value: 3
	}
	player.cooldownDelay = 200;
	player.damage = 10;
	player.barrelSize = 60;
	player.speed = 20;
	player.hp = 80;
	player.maxHP = 80;
	player.maxView = 0.6;
	rectHeightRel = 0.6;
	spawnPlayer();
}