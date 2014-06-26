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
                    { src: 'images/randomize.png', id: 'randomize'},
                    { src: 'images/aircraftcarrier.png', id: 'aircraftcarrier'}];

    function startPreload() {
        queue = new createjs.LoadQueue(false);
        queue.addEventListener('complete', handleComplete, false);
        queue.loadManifest(manifest);
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
        randomize.scaleX = randomize.scaleY = 0.6;
        up.x = 150;
        left.y = 150;
        right.x = right.y = 150;
        rotate.x = 400;
        rotate.y = 0;
        randomize.x = 800;
        randomize.y = -20;

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

//window.onload = () => {
//    var sources = {
//        down: 'down.png',
//        left: 'left.png',
//        right: 'right.png',
//        up: 'up.png',
//        randomize: 'randomize.png',
//        refresh: 'refresh.png'
//    };

//    loadImages(sources, initStage);

//    function loadImages(sources, callback) {
//        var assetDir = 'images/';
//        var images = {};
//        var loadedImages = 0;
//        var numImages = 0;

//        // Load all images from folder in loop
//        for (var src in sources) {
//            numImages++;
//        }
//        for (var src in sources) {
//            images[src] = new Image();
//            images[src].onload = function () {
//                if (++loadedImages >= numImages) {
//                    callback(images);
//                }
//            };
//            images[src].src = assetDir + sources[src];
//        }
//    }  

//    function initStage(images) {
//        var stage = new Kinetic.Stage({
//            container: 'floor',
//            width: 1200,
//            height: 1600
//        });

//        var button_x = 50;
//        var button_y = 1200;
//        var buttonSize = 150;

//        var down = new Kinetic.Image({
//            image: images.down,
//            x: button_x,
//            y: button_y,
//            height: buttonSize,
//            width: buttonSize             
//        });

//        var up = new Kinetic.Image({
//            image: images.up,
//            x: button_x + 150,
//            y:button_y,
//            height: buttonSize,
//            width: buttonSize    
//        });

//        var left = new Kinetic.Image({
//            image: images.left,
//            x: button_x,
//            y: button_y + 150,
//            height: buttonSize,
//            width: buttonSize
//        });

//        var right = new Kinetic.Image({
//            image: images.right,
//            x: button_x + 150,
//            y: button_y + 150,
//            height: buttonSize,
//            width: buttonSize
//        });

//        var refresh = new Kinetic.Image({
//            image: images.refresh,
//            x: button_x + 320,
//            y: button_y - 90,
//            height: 450,
//            width: 450
//        });

//        var randomize = new Kinetic.Image({
//            image: images.randomize,
//            x: button_x + 800,
//            y: button_y - 20,
//            height: 300,
//            width: 300
//        });
         
//        var layer = new Kinetic.Layer();

//        layer.add(down);
//        layer.add(up);
//        layer.add(left);
//        layer.add(right);
//        layer.add(refresh);
//        layer.add(randomize);
//        stage.add(layer);
//    }
//}; 