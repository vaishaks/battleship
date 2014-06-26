/// <reference path="scripts/typings/jquery/jquery.d.ts" />
/// <reference path="scripts/typings/createjs/createjs.d.ts" />
var floor;
(function (floor) {
    var canvas;
    var stage;
    var queue;
    var manifest = [
        { src: 'images/background.jpg', id: 'background' },
        { src: 'images/down.png', id: 'down' },
        { src: 'images/up.png', id: 'up' },
        { src: 'images/left.png', id: 'left' },
        { src: 'images/right.png', id: 'right' },
        { src: 'images/rotate.png', id: 'rotate' },
        { src: 'images/randomize.png', id: 'randomize' },
        { src: 'images/aircraftcarrier.png', id: 'aircraftcarrier' }];

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
        var aircraftcarrier = new createjs.Bitmap(queue.getResult('aircraftcarrier'));

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

        var ships = new createjs.Container();
        ships.x = 50;
        ships.y = 400;
        ships.addChild(aircraftcarrier);

        down.addEventListener('click', movementControlEventHandler, false);

        stage.addChild(bg);
        stage.addChild(movementControls);
        stage.addChild(ships);
        stage.update();
    }

    window.onload = function () {
        canvas = document.getElementById("floor");
        stage = new createjs.Stage(canvas);
        startPreload();
    };
})(floor || (floor = {}));
//# sourceMappingURL=floor.js.map
