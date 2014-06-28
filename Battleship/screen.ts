/// <reference path="scripts/typings/jquery/jquery.d.ts" />
/// <reference path="scripts/typings/createjs/createjs.d.ts" />

module scrren {
    "use strict";

    var canvas: HTMLElement;
    var stage: createjs.Stage;
    var queue: createjs.LoadQueue;
    var manifest: Object = [{ src: "images/backgroundscreen.jpg", id: "backgroundScreen" },
                            { src: "images/aircraftCarrier.png", id: "aircraftcarrier" },
                            { src: "images/Destroyer.png", id: "destroyer" },
                            { src: "images/Submarine.png", id: "submarine" },
                            { src: "images/PatrolBoat.png", id: "patrolboat" },
                            { src: "images/grid2.png", id: "grid" }];

    function startPreload(): void {
        queue = new createjs.LoadQueue(false);
        queue.addEventListener("complete", handleComplete, false);
        queue.loadManifest(manifest);
    }

    function update(): void {
        stage.update();
    }

    function handleComplete(eventinfo: CustomEvent): void {
        var bg: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("backgroundScreen"));
        var aircraftCarrier: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("aircraftcarrier"));
        var destroyer1: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("destroyer"));
        var destroyer2: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("destroyer"));
        var patrolBoat: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("patrolboat"));
        var submarine: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("submarine"));
        var grid: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("grid"));


        grid.x = 200;
        grid.y = 100;
        aircraftCarrier.x = Math.random() * 800;
        aircraftCarrier.y = 100;
        destroyer1.x = Math.random() * 1000;
        destroyer1.y = 300;
        submarine.x = Math.random() * 800;
        submarine.y = 500;
        destroyer2.x = Math.random() * 1000;
        destroyer2.y = 700;
        patrolBoat.x = Math.random() * 1200;
        patrolBoat.y = 900;

        var ships: createjs.Container = new createjs.Container();
        ships.addChild(aircraftCarrier);
        ships.addChild(patrolBoat);
        ships.addChild(submarine);
        ships.addChild(destroyer1);
        ships.addChild(destroyer2);

        stage.addChild(bg);
        stage.addChild(grid);
        stage.addChild(ships);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", update, false);
    }

    function messageEventHandler(eventinfo: any): void {
        console.log(eventinfo.data);
    }

    window.addEventListener("message", messageEventHandler, false);

    window.onload = (): void => {
        canvas = document.getElementById("screen");
        stage = new createjs.Stage(canvas);
        startPreload();
    };
} 