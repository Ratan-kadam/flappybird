document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  var gameCanvas = new canvas('flabberGame');
  var canvasContext = gameCanvas.canvas2dContext;
  var canvasElement = gameCanvas.canvasElement;
  var flabber = new bird(canvasContext, gameCanvas);
  var scoreBoard = new ScoreBoard('', canvasContext, gameCanvas);

  addEventListeners(flabber);
  init(gameCanvas, canvasContext, canvasElement);
  startGame(gameCanvas, canvasContext, canvasElement, flabber, scoreBoard);
})

function ScoreBoard (name, context, canvas) {
  'use strict'

  if (!!ScoreBoard.instance) {
    return ScoreBoard.instance; // making singleton
  }

  var scoreBoardName = name || 'scoreboard';
  var score = 0;

  var getName = function () {
    return scoreBoardName;
  }

  var getScore = function () {
    return score;
  }

  var updateScore = function (newScore) {
    score =  newScore ? newScore : score + 1;
  }

  var displayScore = function () {
    context.font = "40px Georgia";
    context.fillStyle="red";
    updateScore();
    context.fillText(`score: ${score}`, canvas.width()-250, 100);
  }

  var returnVar =  {
    name: getName,
    score: getScore,
    updateScore: updateScore,
    displayScore: displayScore,
  }

  ScoreBoard.instance = returnVar;
  return returnVar;
}

var addEventListeners = function(flabber) {
  var skipKeyPress = false;
  document.addEventListener('keydown', function(e) {
    if(skipKeyPress) {
      return;
    }
    flabber.setGravity(-0.05);
    flabber.setGravitySpeed(0);
    skipKeyPress = true;
  })
  document.addEventListener('keyup', function(e) {
    skipKeyPress = false;
    flabber.setGravity(0.05);
    flabber.setGravitySpeed(0);
  })
}

var checkCollision = function (flabber, piller) {
  var birdX = flabber.getX();
  var birdXLimit = birdX + 80; // 100 is bird size (height and width) buffer of 20px
  var birdY = flabber.getY() + 5 ;  // top buffer 5px
  var birdYLimit = birdY + 80;
  var pillerX = piller.x();
  var pillerXLimit = pillerX + 50; // 50 is piller width
  var pillerY = piller.y();
  var pillerYLimit = pillerY + piller.topPillerheight;
  var topPillerheight = piller.topPillerheight;
  var bottomPillerYCordinate = piller.bottomPillerY;

  if (pillerX > birdX) { // ignoring the pillers gone behind the bird;
      // comparing bird upper limit
    if (birdXLimit >= pillerX && birdY <= topPillerheight) {
      console.log("collision on top piller");
      return true;
    };

    // comparing bird lower limit with below piller
    if (birdXLimit >= pillerX && birdYLimit >= bottomPillerYCordinate) {
      console.log("collision on bottom piller");
      return true;
    };
  }

  return false;
}

var piller = function (context, canvas, custumLocation, flabber) {
  var x = custumLocation || canvas.width();
  var y = 0;
  var width = 50;
  var minWindowToEscape = canvas.height() * 0.20;
  var topPillerheight = getRandomValidHeight();
  var bottomX = custumLocation || canvas.width();
  var bottomPillerheight = (canvas.height() - (topPillerheight + minWindowToEscape));
  var variableHeight = bottomPillerheight * Math.random();
  minWindowToEscape = minWindowToEscape + variableHeight;
  bottomPillerheight = (canvas.height() - (topPillerheight + minWindowToEscape));
  var bottomPillerY = (topPillerheight + minWindowToEscape);



 function getRandomValidHeight() {
     var height = Math.random() * canvas.height();
     var maxHeight = canvas.height() * 0.80;
     height = height > maxHeight ? height - minWindowToEscape : height;
     return height;
  }

  var topPiller = new Image();
  topPiller.src = "./images/TopPipe.png";

  var bottomPiller = new Image();
  bottomPiller.src = "./images/bottomPipe.png";

  var draw = function () {
    update();
    context.fillStyle = "red";
    context.drawImage(topPiller, x, y, width, topPillerheight);
    context.fillStyle = "green";
    context.drawImage(bottomPiller, bottomX, (topPillerheight + minWindowToEscape), width, bottomPillerheight);
  }

  var getX = function () {
    return x;
  }

  var getY = function () {
    return y;
  }

  var update = function () {
    x = x-2;
    bottomX = bottomX - 2;
  }

  var setX = function (newX) {
    x = newX;
  }

  var setY = function (newY) {
    y = newY;
  }

  var getBottomY = function () {
    return bottomY;
  }

  return {
    x: getX,
    y: getY,
    setX: setX,
    setY: setY,
    draw: draw,
    width: width,
    topPillerheight: topPillerheight,
    bottomPillerY: bottomPillerY
  };
}

var bird = function (context, canvas) {
  var x = 0;
  var y = 0;
  var size = 100;
  var gravitySpeed = 0;
  var gravity = 0.05;

  var birdImage = new Image();
  birdImage.src = './images/bird.png';

  var getX = function () {
    return x;
  }

  var getY = function () {
    return y;
  }

  var setX = function (newX) {
    x = newX;
  }

  var setY = function (newY) {
    y = newY;
  }

  var setGravity = function (newGravity) {
    gravity = newGravity;
  }

  var setGravitySpeed = function (newGravitySpeed) {
    gravitySpeed = newGravitySpeed;
  }

  var dropDownBehaviour = function () {
    if (y >= canvas.height() - size && gravity > 0) {
      return;
    }

    if (y <= 0 && gravity < 0) {
      return;
    }

    gravitySpeed += gravity;
    y =  y + gravitySpeed + gravity;
  }

  var draw = function () {
    dropDownBehaviour();
    // for test reference
    // context.fillStyle = "rgb(50,205,50, 0.07)"
    // context.fillRect(x, y, 100, 100);
    context.drawImage(birdImage, x, y, 100, 100);
  }

  return {
    getX: getX,
    getY: getY,
    gravitySpeed: gravitySpeed,
    gravity: gravity,
    setX: setX,
    setY: setY,
    setGravity: setGravity,
    setGravitySpeed: setGravitySpeed,
    draw:draw,
  }
}

var canvas = function (name) {
  'use strict';
  var gameName = name;
  var canvas = document.getElementById('canvas');
  var canvasContext = canvas.getContext('2d');

  var windowWidth = function () {
    return window.innerWidth;
  }
  var windowHeight = function () {
    return window.innerHeight;
  }

  return {
    canvasElement: canvas,
    canvas2dContext: canvasContext,
    gameName: gameName,
    width: windowWidth,
    height: windowHeight,
  }
};

var init = function (canvas, context, canvasElement) {
  canvasElement.width = canvas.width();
  canvasElement.height = canvas.height();
  context.fillStyle = "red";
  context.fillRect(0,0, 100,100);
}

var startGame = function (canvas, context, canvasElement, flabber, scoreBoard) {
  let endGame = false;
  var pillers = [];
  var backgroundImage = new Image();
  backgroundImage.src = "./images/backgroung.svg";
  pillers.push(new piller(context, canvas));
  pillers.push(new piller(context, canvas, canvas.width() * 0.75));
  pillers.push(new piller(context, canvas, canvas.width() * 0.45));
  pillers.push(new piller(context, canvas, canvas.width() * 0.28));

  var GameInterval = setInterval(function() {
    context.clearRect(0,0, canvas.width(), canvas.height());
    context.drawImage(backgroundImage, 0,0, canvas.width(), canvas.height());

    for (var i=0; i < pillers.length; i++) {
      if(pillers[i].x() < -100) {
         pillers.splice(i,1);
         i = i - 1;
         pillers.push(new piller(context, canvas));
      } else {
      endGame = checkCollision(flabber, pillers[i]);
        pillers[i].draw();
        if (endGame) {
          clearInterval(GameInterval);
        }
      }
    }
    flabber.draw();
    scoreBoard.displayScore();
  }, 20);
}
