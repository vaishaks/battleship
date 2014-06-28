/// <reference path="scripts/typings/jquery/jquery.d.ts" />
/// <reference path="scripts/typings/createjs/createjs.d.ts" />

module floor {
    "use strict";

    var canvas: HTMLElement;
    var stage: createjs.Stage;
    var queue: createjs.LoadQueue;
    var scrren: Window;
    var manifest: Object = [{ src: "images/background.jpg", id: "background" },
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

    function startPreload(): void {
        queue = new createjs.LoadQueue(false);
        queue.addEventListener("complete", handleComplete, false);
        queue.loadManifest(manifest);
    }

    function movementControlEventHandler(direction: string, ship: any): void {
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

    function update(): void {
        stage.update();
    }

    function handleComplete(eventinfo: CustomEvent): void {
        var bg: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("background"));
        var down: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("down"));
        var up: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("up"));
        var left: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("left"));
        var right: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("right"));
        var rotate: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("rotate"));
        var randomize: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("randomize"));
        var panelDown: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("panelDown"));
        var aircraftCarrier: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("aircraftcarrier"));
        var destroyer1: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("destroyer"));
        var destroyer2: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("destroyer"));
        var patrolBoat: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("patrolboat"));
        var submarine: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("submarine"));
        var panelUp: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("panelUp"));

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

        var movementControls: createjs.Container = new createjs.Container();
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

        var ships: createjs.Container = new createjs.Container();
        ships.y = 350;
        ships.addChild(aircraftCarrier);
        ships.addChild(patrolBoat);
        ships.addChild(submarine);
        ships.addChild(destroyer1);
        ships.addChild(destroyer2);

        var panel: createjs.Container = new createjs.Container();
        panel.addChild(panelUp);

        down.addEventListener("click", (eventinfo: MSEventObj): void => { movementControlEventHandler("down", aircraftCarrier); }, false);
        up.addEventListener("click", (eventinfo: MSEventObj): void => { movementControlEventHandler("up", aircraftCarrier); }, false);
        left.addEventListener("click", (eventinfo: MSEventObj): void => { movementControlEventHandler("left", aircraftCarrier); }, false);
        right.addEventListener("click", (eventinfo: MSEventObj): void => { movementControlEventHandler("right", aircraftCarrier); }, false);
        rotate.addEventListener("click", (eventinfo: MSEventObj): void =>
            { movementControlEventHandler("rotate", aircraftCarrier); }, false);

        stage.addChild(bg);
        stage.addChild(movementControls);
        stage.addChild(ships);
        stage.addChild(panel);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", update, false);
    }

    window.onload = (): void => {
        canvas = document.getElementById("floor");
        stage = new createjs.Stage(canvas);
        screen = window.parent.frames[1];
       
        startPreload();
    };
}
