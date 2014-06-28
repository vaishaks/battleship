/// <reference path="scripts/typings/jquery/jquery.d.ts" />
/// <reference path="scripts/typings/createjs/createjs.d.ts" />
var floor;
(function (floor) {
    "use strict";

    var canvas;
    var stage;
    var queue;
    var screen;
    var manifest = [
        { src: "images/background.jpg", id: "background" },
        { src: "images/down.png", id: "down" },
        { src: "images/up.png", id: "up" },
        { src: "images/left.png", id: "left" },
        { src: "images/right.png", id: "right" },
        { src: "images/rotate.png", id: "rotate" },
        { src: "images/randomize.png", id: "randomize" },
        { src: "images/aircraftCarrier.png", id: "aircraftcarrier" },
        { src: "images/Destroyer.png", id: "destroyer" },
        { src: "images/Submarine.png", id: "submarine" },
        { src: "images/PatrolBoat.png", id: "patrolboat" },
        { src: "images/panelDown.png", id: "panelDown" },
        { src: "images/PanelUp.png", id: "panelUp" }];

    function startPreload() {
        queue = new createjs.LoadQueue(false);
        queue.addEventListener("complete", handleComplete, false);
        queue.loadManifest(manifest);
    }

    function movementControlEventHandler(direction, ship) {
        console.log(direction + " was clicked!");
        console.log(ship);
        screen.postMessage("Hello World", "*");
        switch (direction) {
            case "up":
                if (ship.y < 200) {
                    break;
                }
                ship.y -= 200;
                break;
            case "down":
                if (ship.y > 800) {
                    break;
                }
                ship.y += 200;
                break;
            case "left":
                if (ship.x < 200) {
                    break;
                }
                ship.x -= 200;
                break;
            case "right":
                if (ship.x > 1000) {
                    break;
                }
                ship.x += 200;
                break;
        }
    }

    function update() {
        stage.update();
    }

    function handleComplete(eventinfo) {
        var bg = new createjs.Bitmap(queue.getResult("background"));
        var down = new createjs.Bitmap(queue.getResult("down"));
        var up = new createjs.Bitmap(queue.getResult("up"));
        var left = new createjs.Bitmap(queue.getResult("left"));
        var right = new createjs.Bitmap(queue.getResult("right"));
        var rotate = new createjs.Bitmap(queue.getResult("rotate"));
        var randomize = new createjs.Bitmap(queue.getResult("randomize"));
        var panelDown = new createjs.Bitmap(queue.getResult("panelDown"));
        var aircraftCarrier = new createjs.Bitmap(queue.getResult("aircraftcarrier"));
        var destroyer1 = new createjs.Bitmap(queue.getResult("destroyer"));
        var destroyer2 = new createjs.Bitmap(queue.getResult("destroyer"));
        var patrolBoat = new createjs.Bitmap(queue.getResult("patrolboat"));
        var submarine = new createjs.Bitmap(queue.getResult("submarine"));
        var panelUp = new createjs.Bitmap(queue.getResult("panelUp"));

        up.scaleX = up.scaleY = left.scaleX = left.scaleY = right.scaleX = right.scaleY = down.scaleX = down.scaleY = 0.25;
        rotate.scaleY = rotate.scaleX = 0.5;
        randomize.scaleX = randomize.scaleY = 0.5;
        up.x = 150;
        left.y = 150;
        right.x = right.y = 150;
        rotate.x = 420;
        rotate.y = 20;
        randomize.x = 830;
        randomize.y = 20;
        panelDown.x = -50;
        panelDown.y = -40;

        var movementControls = new createjs.Container();
        movementControls.x = 50;
        movementControls.y = 1240;
        movementControls.addChild(panelDown);
        movementControls.addChild(down);
        movementControls.addChild(up);
        movementControls.addChild(left);
        movementControls.addChild(right);
        movementControls.addChild(rotate);
        movementControls.addChild(randomize);

        patrolBoat.x = 830;
        patrolBoat.y = 5;
        patrolBoat.scaleX = patrolBoat.scaleY = 0.8;
        aircraftCarrier.y = 270;
        aircraftCarrier.x = 80;
        destroyer1.scaleX = destroyer1.scaleY = destroyer2.scaleX = destroyer2.scaleY = 0.9;
        destroyer1.y = destroyer2.y = 550;
        destroyer1.x = 20;
        destroyer2.x = 630;

        var ships = new createjs.Container();
        ships.y = 350;
        ships.addChild(aircraftCarrier);
        ships.addChild(patrolBoat);
        ships.addChild(submarine);
        ships.addChild(destroyer1);
        ships.addChild(destroyer2);

        var panel = new createjs.Container();
        panel.addChild(panelUp);

        down.addEventListener("click", function (eventinfo) {
            movementControlEventHandler("down", aircraftCarrier);
        }, false);
        up.addEventListener("click", function (eventinfo) {
            movementControlEventHandler("up", aircraftCarrier);
        }, false);
        left.addEventListener("click", function (eventinfo) {
            movementControlEventHandler("left", aircraftCarrier);
        }, false);
        right.addEventListener("click", function (eventinfo) {
            movementControlEventHandler("right", aircraftCarrier);
        }, false);
        rotate.addEventListener("click", function (eventinfo) {
            movementControlEventHandler("rotate", aircraftCarrier);
        }, false);

        stage.addChild(bg);
        stage.addChild(movementControls);
        stage.addChild(ships);
        stage.addChild(panel);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", update, false);
    }

    window.onload = function () {
        canvas = document.getElementById("floor");
        stage = new createjs.Stage(canvas);
        screen = window.parent.frames[1];

        startPreload();
    };
})(floor || (floor = {}));
//# sourceMappingURL=floor.js.map
