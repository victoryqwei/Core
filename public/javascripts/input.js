// Keyboard input (advanced)
var rawInput = [];
var eventInput = {};
$("body").keydown(function (e) {
	// Raw input
	var flag = true;
	for (var i in rawInput) {
		if (e.keyCode === rawInput[i]) {
			flag = false;
		}
	}
	if (flag) {
		rawInput.push(e.keyCode);
	}

	// Event input
	if (!eventInput[e.keyCode]) {
		eventInput[e.keyCode] = true;
	}
	if (e.keyCode === 9) {
		e.preventDefault();
	}
})
$("body").keyup(function (e) {
	// Raw input
	for (var i = 0; i < rawInput.length; i++) {
		if (e.keyCode === rawInput[i]) {
			rawInput.splice(i,1);
		}
	}
	// Event input
	eventInput[e.keyCode] = false;
	core.upgradeReset = false;
})

var mouse = new Vector();
var click = true;
// Mousemove event
$("#canvas").mousemove(function (e) {
	mouse.x = e.offsetX;
	mouse.y = e.offsetY;
})

// Click event

var mouseDown = false;
var middleDown = false;
var rightDown = false;
$("#canvas").mousedown(function (e) {
	if (e.button === 0) {
		mouseDown = true;
	} else if (e.button === 1) {
		middleDown = true;
	} else if (e.button === 2) {
		rightDown = true;
	}
	
	e.preventDefault();
}).mouseup(function (e) {
	if (e.button === 0) {
		mouseDown = false;
	} else if (e.button === 1) {
		middleDown = false;
	} else if (e.button === 2) {
		rightDown = false;
	}
	// Reset click events
	click = false;

	for (var i = 0; i < player.walls.length; i++) {
		player.walls[i].click = false;
	}
})

// Prevent right click
$("body").on('contextmenu', function(e) {
	e.preventDefault();
})

// Scroll event
var scrollSpeed = 0.05;
$(window).bind('mousewheel', function(event) {
	if (play != 0 && play != 3) {
		if (event.originalEvent.wheelDelta >= 0 && rectHeightRel < 5) {
	        rectHeightRel += scrollSpeed;
	    } else if (event.originalEvent.wheelDelta >= 0) {
	    	rectHeightRel = 5;
	    } else if (rectHeightRel > player.maxView) {
	        rectHeightRel -= scrollSpeed;
	    }
	    player.updateRatio(rectHeightRel);
	}  
});

// Resize event
$(window).resize(function () {
	canvas.width = $(window).innerWidth()
	canvas.height = $(window).innerHeight();
	rectHeightRel = canvas.height / baseScreenHeight;
	relativeHeight = rectHeightRel;
})

// Name input box

function hideOnClickOutside(selector) {
  const outsideClickListener = (event) => {
    if (!$(event.target).closest(selector).length) {
      if ($(selector).is(':visible')) {
        $(selector).blur();
        removeClickListener()
      }
    }
  }

  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener)
  }

  document.addEventListener('click', outsideClickListener)
}
$("#name").click(function() {$("#name").focus()})
hideOnClickOutside($("#name"))

$("#name").keypress(function(e) {
    if(e.which == 13) {
        chosenClass = false;
        classSelect.style.display = 'block'
        var title = document.getElementById("title");
		title.style.display = 'none'
    }
});

$("#begin").click(function () {
	chosenClass = false;
	classSelect.style.display = 'block'
	var title = document.getElementById("title");
	title.style.display = 'none'
})

$("#spec").click(function () {
	chosenClass = true;
	classSelect.style.display = 'none'
	var title = document.getElementById("title");
	title.style.display = 'none'
	play = 3;
})

function spawnPlayer() {
	// Stop displaying the class menu
	classSelect.style.display = 'none'
	// Get cookies
	cookieGetter();
	//Play
	if (play == 0/* && ($("#name").val() == "Bob" || $("#name").val() == "Evan")*/) {
		play = 1;
        player.name = $("#name").val() || "Player"

        var c = hexToRgb($("#color").val());
        player.color = 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')';
        player.power = 50;
        player.pos = new Vector(Math.floor(Math.random() * arenaSize*2) - arenaSize, Math.floor(Math.random() * arenaSize*2) - arenaSize)
        player.dead = false;
        core.level = 1;
        player.killStreak = 0;

        socket.emit('join', player)

        $("#name").hide();
        $("#title").hide();
	}
}

function cookieGetter() {
	//Color cookie
	var hexColor = $("#color").val();
	if(getCookie('userColor') == "") {
		console.log('Created color cookie with value: ' + JSON.stringify(hexColor))
		cname = 'userColor';
		cvalue = JSON.stringify(hexColor);
		exdays = 365;
		setCookie(cname,cvalue,exdays);
	}
	console.log(JSON.stringify(hexColor) + ' / ' + getCookie('userColor'));
	if(JSON.stringify(hexColor) != getCookie('userColor')) {
		console.log('Deleted color cookie with value: ' + getCookie('userColor'));
		deleteCookie('userColor');
		console.log('Created color cookie with value: ' + JSON.stringify(hexColor));
		cname = 'userColor';
		cvalue = JSON.stringify(hexColor);
		exdays = 365;
		setCookie(cname,cvalue,exdays);
	}

	//Name cookie

	var letterNumber = /^[0-9a-zA-Z]+$/;
	if(($("#name").val()).match(letterNumber)) {
	 	if(getCookie('userName') == "") {
			console.log('Created name cookie with value: ' + JSON.stringify($("#name").val()))
			cname = 'userName';
			cvalue = JSON.stringify($("#name").val());
			exdays = 365;
			setCookie(cname,cvalue,exdays);
		}
		console.log($("#name").val() + ' / ' + getCookie('userName'));
		if(JSON.stringify($("#name").val()) != getCookie('userName')) {
			console.log('Deleated name cookie with value: ' + getCookie('userColor'));
			deleteCookie('userName');
			console.log('Created name cookie with value: ' + JSON.stringify(hexColor));
			cname = 'userName';
			cvalue = JSON.stringify($("#name").val());
			exdays = 365;
			setCookie(cname,cvalue,exdays);
		}
	} else {
	   //alert("Please only use alphanumeric characters without spaces!"); 
	}
}
