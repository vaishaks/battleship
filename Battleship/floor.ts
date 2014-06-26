/// <reference path="scripts/typings/jquery/jquery.d.ts" />
/// <reference path="scripts/typings/createjs/createjs.d.ts" />

module floor {
    var canvas;
    var stage;
    var queue;
    var manifest = [{ src: 'images/background.jpg', id: 'background' },
        { src: 'images/down.png', id: 'down' },
        { src: 'images/up.png', id: 'up' },
        { src: 'images/left.png', id: 'left' },
        { src: 'images/right.png', id: 'right' },
        { src: 'images/rotate.png', id: 'rotate' },
        { src: 'images/randomize.png', id: 'randomize' },
        { src: 'images/aircraftCarrier.png', id: 'aircraftcarrier' },
        { src: 'images/Destroyer.png', id: 'destroyer' },
        { src: 'images/Submarine.png', id: 'submarine' },
        { src: 'images/PatrolBoat.png', id: 'patrolboat' }];

    function startPreload() {
        queue = new createjs.LoadQueue(false);
        queue.addEventListener('complete', handleComplete, false);
        queue.loadManifest(manifest);
    }

    function movementControlEventHandler(eventinfo) {
        console.log("Down was clicked!");
    }

    function handleComplete(eventinfo) {
        var bg = new createjs.Bitmap(queue.getResult('background'));
        var down = new createjs.Bitmap(queue.getResult('down'));
        var up = new createjs.Bitmap(queue.getResult('up'));
        var left = new createjs.Bitmap(queue.getResult('left'));
        var right = new createjs.Bitmap(queue.getResult('right'));
        var rotate = new createjs.Bitmap(queue.getResult('rotate'));
        var randomize = new createjs.Bitmap(queue.getResult('randomize'));
        var aircraftCarrier = new createjs.Bitmap(queue.getResult('aircraftcarrier'));
        var destroyer1 = new createjs.Bitmap(queue.getResult('destroyer'));
        var destroyer2 = new createjs.Bitmap(queue.getResult('destroyer'));
        var patrolBoat = new createjs.Bitmap(queue.getResult('patrolboat'));
        var submarine = new createjs.Bitmap(queue.getResult('submarine'));

        up.scaleX = up.scaleY = left.scaleX = left.scaleY = right.scaleX = right.scaleY = down.scaleX = down.scaleY = 0.25;
        rotate.scaleY = rotate.scaleX = 0.9;
        randomize.scaleX = randomize.scaleY = 0.5;
        up.x = 150;
        left.y = 150;
        right.x = right.y = 150;
        rotate.x = 420;
        rotate.y = 0;
        randomize.x = 830;
        randomize.y = 20;

        var movementControls = new createjs.Container();
        movementControls.x = 50;
        movementControls.y = 1200;
        movementControls.addChild(down);
        movementControls.addChild(up);
        movementControls.addChild(left);
        movementControls.addChild(right);
        movementControls.addChild(rotate);
        movementControls.addChild(randomize);

        patrolBoat.x = 830;
        patrolBoat.y = 5;
        patrolBoat.scaleX = patrolBoat.scaleY = 0.8;
        aircraftCarrier.y = 250;
        aircraftCarrier.x = 80;
        destroyer1.scaleX = destroyer1.scaleY = destroyer2.scaleX = destroyer2.scaleY = 0.9;
        destroyer1.y = destroyer2.y = 500;
        destroyer1.x = 20;
        destroyer2.x = 630;

        var ships = new createjs.Container();
        ships.y = 300;
        ships.addChild(aircraftCarrier);
        ships.addChild(patrolBoat);
        ships.addChild(submarine);
        ships.addChild(destroyer1);
        ships.addChild(destroyer2);

        down.addEventListener('click', movementControlEventHandler, false);

        stage.addChild(bg);
        stage.addChild(movementControls);
        stage.addChild(ships);
        stage.update();
    }

    window.onload = () => {
        canvas = document.getElementById("floor");
        stage = new createjs.Stage(canvas);
        startPreload();
    };
}
