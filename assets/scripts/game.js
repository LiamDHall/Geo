//Variables
var fullWidth = $(window).width();
var fullHeight = $(window).height();

//Start Game
$(document).ready(function() {
    gameCanvas.create();
    gameCanvas.loop();
});

//Game Canvas
var gameCanvas = {
    //Counter
    loopCounter : 0,
    canvas : document.createElement('canvas'),
    create : function() {  //Initial Creation
        
        //Full size of browser
        this.canvas.width  = fullWidth;
        this.canvas.height = fullHeight;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.ctx = this.canvas.getContext("2d");

        //Removes vertical side scroller
        $('body').css('height', this.canvas.height);
    },

    loop: function() {
        gameCanvas.clear(); //Calls Clear Canvas
        
        //Hero
        heroTri.draw();
        heroTri.gravity();
        heroTri.onFloorCheck();
        
        //Laser 
        //Laser Collisions
        for (var i = 0; i < gameLaser.length; i++) {
            for (var j = 0; j < gameObstacles.length; j++) {
                if (
                gameObstacles[j].type == 'rect' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].x && 
                gameLaser[i].x < gameObstacles[j].x + gameObstacles[j].width && 
                gameLaser[i].y + gameLaser[i].height > gameObstacles[j].y || 
                gameLaser[i].x > fullWidth) {
                    gameLaser.shift();
                    console.log('rect collision');
                } 
                
               else if (
                gameObstacles[j].type == 'tri' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].triCenterX && 
                gameLaser[i].x < gameObstacles[j].triCenterX + gameObstacles[j].size) {
                    gameLaser[i].speed = -gameLaser[i].speed;
                    gameLaser[i].color = 'red';
                    console.log('tri collision');
                }

                else if (
                gameObstacles[j].type == 'circle' && 
                gameLaser[i].x + gameLaser[i].width > gameObstacles[j].circleCenterX && 
                gameLaser[i].x < gameObstacles[j].circleCenterX + gameObstacles[j].radius) {
                    gameLaser[i].color = 'red';
                    console.log('circle collision');
                    //Laser Movement again as the laser wouldn't be drawn after if the circle was the only obstacle in the array
                    gameLaser[i].draw();
                    gameLaser[i].x += gameLaser[i].speed;
                }
                
                //Laser Movement
                else {
                    gameLaser[i].draw();
                    gameLaser[i].x += gameLaser[i].speed;
                }
            }
        }

        //Creates Initial Floor Pushing them into the array
        if(gameFloor.length == 0) {
            for(var i = 0; i < 10; i++) {
                gameFloor.push(new Floor())
            };

            if(i = 1) {
                gameFloor[i].x += gameFloor[i].width * i;
            };

            if(i = 2) {
                gameFloor[i].x += gameFloor[i].width * i;
            };

            if(i = 3) {
                gameFloor[i].x += gameFloor[i].width * i;
            };

            if(i = 4) {
                gameFloor[i].x += gameFloor[i].width * i;
            };

            if(i = 5) {
                gameFloor[i].x += gameFloor[i].width * i;
            };

            if(i = 6) {
                gameFloor[i].x += gameFloor[i].width * i ;
            };

            if(i = 7) {
                gameFloor[i].x += gameFloor[i].width * i;
            };

            if(i = 8) {
                gameFloor[i].x += gameFloor[i].width * i;
            };

            if(i = 9) {
                gameFloor[i].x += gameFloor[i].width * i;
            };
        };
        
        // Adds new floor tile to create continuous infinity floor 
        if(gameFloor[gameFloor.length - 1].x + gameFloor[gameFloor.length - 1].width <= fullWidth && gameFloor.length >= 10) {
            gameFloor.push(new Floor());
            gameFloor[gameFloor.length - 1].x = fullWidth - 2;
        };

        //Draws Floor
        for(i = 0; i < gameFloor.length; i++) {
            gameFloor[i].draw();
            gameFloor[i].x -= 2; //Floor Speed
        };

        for(i = 0; i < gameFloor.length; i++) {
            gameFloor[i].draw();
            gameFloor[i].x -= 2;
        };

        //Obstacles draw and type
        if(gameCanvas.loopCounter == 0) {
            gameObstacles.push(new Obstacle('tri'));
            gameObstacles.push(new Obstacle('circle'));
            gameObstacles.push(new Obstacle('rect'));
        };

        for(i = 0; i < gameObstacles.length; i++) {
            gameObstacles[i].draw();
        };
        
        //Calls loop again and counts how many time
        gameCanvas.loopCounter += 1;
        requestAnimationFrame(gameCanvas.loop); //Re calls the this fuction to complete the loop
    },

    clear: function() {
        gameCanvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Clears Canvas
    },
};

// Hero Character - Source https://stackoverflow.com/questions/38238282/how-to-rotate-a-triangle-without-rotating-the-entire-canvas ADAPTED TO MY NEEDS (Not all my own code)
var heroTri = {
    sides: 3,
    size: 40,
    centerX: fullWidth * 0.15,
    centerY: fullHeight - fullHeight * 0.1 - 5 - 40/2,
    //strokeWidth: 0,
    //strokeColor: 'purple',
    fillColor: 'limegreen',
    rotationDegrees: 270,
    velocityY: 0,
    airBorn: true,
    shooting: false,
    shootMax: false,
    rotationSpeed: 0,
    
    draw: function() {
        var radians = this.rotationDegrees*Math.PI/180;
        gameCanvas.ctx.translate(this.centerX, this.centerY);
        gameCanvas.ctx.rotate(radians);
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.moveTo (this.size * Math.cos(0), this.size * Math.sin(0));          
        for (var i = 1; i <= this.sides; i += 1) {
            gameCanvas.ctx.lineTo (this.size * Math.cos(i * 2 * Math.PI / this.sides), this.size * Math.sin(i * 2 * Math.PI / this.sides));
        };
        gameCanvas.ctx.closePath();
        gameCanvas.ctx.fillStyle = this.fillColor;
        //gameCanvas.ctx.strokeStyle = this.strokeColor;
        //gameCanvas.ctx.lineWidth = this.strokeWidth;
        //gameCanvas.ctx.stroke();
        gameCanvas.ctx.fill();
        gameCanvas.ctx.rotate(-radians);
        gameCanvas.ctx.translate(-this.centerX,-this.centerY);
    },
//(End of Not all my own code)

    gravity() {
        //Check shoot functions (Shoot defies gravity)
        if(heroTri.shooting == true) {
            heroTri.shoot();

        //Gravity
        } else {
            heroTri.centerY += heroTri.velocityY;
            heroTri.velocityY += 4;
            heroTri.velocityY *= 0.9;

            heroTri.rotateSpeed = 3.41; //Close to correct rotation (Add formula later for precise rotation)
            heroTri.rotationDegrees += heroTri.rotateSpeed;
        };
    },

    onFloorCheck: function() {
       if(heroTri.centerY > fullHeight - fullHeight * 0.1 - 5 - 40/2) { //
            heroTri.centerY = fullHeight - fullHeight * 0.1 - 5 - 40/2;
            heroTri.airBorn = false;
            heroTri.shooting = false;
            heroTri.shootMax = false;
            heroTri.velocityY = 17.99;
            //Rotation
            heroTri.rotationDegrees = 270; //Resets rotation to be flush with floor (Delete once rotation formula is added)
        };
    },

    jump: function() {
        heroTri.velocityY -= 65;
        console.log('jump');
        heroTri.airBorn = true;
    },

    shoot: function() {
        heroTri.shooting = true;
        console.log('shoot');

        heroTri.rotateSpeed = 6; // 2:1 rotate to velocity for 40 height triangle
        heroTri.velocityY = 3;

        if(heroTri.rotationDegrees <= 220) {
            heroTri.shootMax = true;
            gameLaser.push(new Laser());
        };

        if(heroTri.shootMax == true) {
            heroTri.rotationDegrees += heroTri.rotateSpeed;
            heroTri.centerY += heroTri.velocityY;

        } else {
            heroTri.rotationDegrees -= heroTri.rotateSpeed;
            heroTri.centerY -= heroTri.velocityY;
        };
    }
};

//Laser

var gameLaser = [];

function Laser() {
    this.y = fullHeight - fullHeight * 0.1 - 5 - 40/2 - 10;
    this.x = fullWidth * 0.15 + 40;
    this.width = 40;
    this.height = 5;
    this.speed = 10;
    this.color = 'skyblue';

    this.draw = function() {
        gameCanvas.ctx.fillStyle = this.color;
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
};

//Floor

var gameFloor = [];

function Floor() {
    this.height = fullHeight * 0.1;
    this.width = fullWidth / 10;
    this.x = 0;
    this.y = fullHeight - this.height;
    this.strokeWidth = 10;

    this.draw = function() {
        gameCanvas.ctx.fillStyle = '#161616';
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);

        gameCanvas.ctx.strokeStyle = 'white';
        gameCanvas.ctx.lineWidth = this.strokeWidth;
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.moveTo(this.x, this.y);
        gameCanvas.ctx.lineTo(this.x + this.width, this.y);
        gameCanvas.ctx.stroke();
    };
};

//Obstacles
var gameObstacles = [];

function Obstacle(type) {

    this.type = type;

    //Triangle
    this.sides = 3;
    this.size = 40;
    this.triCenterX = 600;
    this.triCenterY = fullHeight - fullHeight * 0.1 - 5 - 40/2;
    //this.strokeWidth = 0;
    //this.strokeColor = 'purple';
    this.rotationDegrees = 270;

    //Rectangle
    this.x = 1000;
    this.y = fullHeight - fullHeight * 0.1 - 5 - 60;
    this.width = 60;
    this.height = 60;

    //Circle
    this.radius = 30;
    this.circleCenterX = 800;
    this.circleCenterY = fullHeight - fullHeight * 0.1 - 5 - this.radius;

    this.draw = function() {
        if(this.type == 'tri') {
            this.drawObsTri()
        } else if(this.type == 'circle') {
            this.drawObsCircle()
        } else if(this.type == 'rect'){
            this.drawObsRect()
        }
    };

    this.drawObsRect = function() {
        gameCanvas.ctx.fillStyle = 'yellow';
        gameCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);
        
    };

    this.drawObsCircle = function() {
        gameCanvas.ctx.fillStyle = 'purple';
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.arc(this.circleCenterX, this.circleCenterY, this.radius, 0, 2 * Math.PI, true);
        gameCanvas.ctx.fill();
    };

    this.drawObsTri = function() {
        var radiansObs = this.rotationDegrees * Math.PI/180;
        gameCanvas.ctx.translate(this.triCenterX, this.triCenterY);
        gameCanvas.ctx.rotate(radiansObs);
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.moveTo (this.size * Math.cos(0), this.size * Math.sin(0));          
        for (var i = 1; i <= this.sides; i += 1) {
            gameCanvas.ctx.lineTo (this.size * Math.cos(i * 2 * Math.PI / this.sides), this.size * Math.sin(i * 2 * Math.PI / this.sides));
        };
        gameCanvas.ctx.closePath();
        gameCanvas.ctx.fillStyle = 'pink';
        //gameCanvas.ctx.strokeStyle = this.strokeColor;
        //gameCanvas.ctx.lineWidth = this.strokeWidth;
        //gameCanvas.ctx.stroke();
        gameCanvas.ctx.rotate(-radiansObs);
        gameCanvas.ctx.translate(-this.triCenterX,-this.triCenterY);
        gameCanvas.ctx.fill();
    };
};

//Controller
document.addEventListener('keydown', function (event) {
    if (event.key === ' ' && heroTri.airBorn == false && heroTri.shooting == false) {
        heroTri.jump();
    };

    if (event.key === 's' && heroTri.airBorn == false) {
        heroTri.shoot();
    };
});
