/// <reference path="scripts/typings/jquery/jquery.d.ts" />
/// <reference path="scripts/typings/createjs/createjs.d.ts" />

module scrren {
    "use strict";

    var canvas: HTMLElement;
    var stage: createjs.Stage;
    var queue: createjs.LoadQueue;
    var shouldUpdate: boolean = true;
    var cells: any[] = [];
    var manifest: Object = [{ src: "images/backgroundscreen.jpg", id: "backgroundScreen" },
                            { src: "images/aircraftCarrier.png", id: "aircraftcarrier" },
                            { src: "images/Destroyer.png", id: "destroyer" },
                            { src: "images/Submarine.png", id: "submarine" },
                            { src: "images/PatrolBoat.png", id: "patrolboat" },
                            { src: "images/grid.png", id: "grid" }];

    function startPreload(): void {
        queue = new createjs.LoadQueue(false);
        queue.addEventListener("complete", handleComplete, false);
        queue.loadManifest(manifest);
    }

    function update(): void {
        if (shouldUpdate) {
            shouldUpdate = false;
            stage.update();
        }
    }

    function handleComplete(eventinfo: CustomEvent): void {
        var bg: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("backgroundScreen"));
        var ships: Array<createjs.Bitmap> = new Array(5);
        var aircraftCarrier: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("aircraftcarrier"));
        ships[0] = aircraftCarrier;
        var destroyer1: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("destroyer"));
        ships[1] = destroyer1;
        var destroyer2: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("destroyer"));
        ships[2] = destroyer2;
        var patrolBoat: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("patrolboat"));
        ships[3] = patrolBoat;
        var submarine: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("submarine"));
        ships[4] = submarine;
        var grid: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("grid"));

        // NOTE: Draggable aircraft carrier. Remove later.
        aircraftCarrier.on("pressmove", function (evt: any) {
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;
            // indicate that the stage should be updated on the next tick:
            shouldUpdate = true;
        });

        var gridContainer: createjs.Container = new createjs.Container();
        gridContainer.x = 200;
        gridContainer.y = 150;

        cells = createGridCells();

        for (var i = 0; i < 5; i++) {
            cells[i][0].addChild(ships[i]);
        }

        rotate(ships[0], false);
        rotate(ships[0], true);

        gridContainer.addChild(grid);
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 6; j++) {
                gridContainer.addChild(cells[i][j]);
            }
        }        
        stage.addChild(bg);
        stage.addChild(gridContainer);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", update, false);
    }

    function messageEventHandler(eventinfo: any): void {
        console.log(eventinfo.data);
    }

    function createGridCells(): any[] {
        var cells: any[] = new Array(5);
        var x, y = 0;
        for (var i = 0; i < 5; i++) {
            cells[i] = new Array(6);
            x = 0;
            for (var j = 0; j < 6; j++) {
                var cell: createjs.Container = new createjs.Container();
                cell.x = x;
                cell.y = y;
                x += 200;
                cells[i][j] = cell;
            }
            y += 200;
        }
        return cells;
    }

    function rotate(ship: createjs.Bitmap, isVertical: boolean): void {
        if (!isVertical) {
            ship.x = 200;
            ship.rotation = 90;
        }
        else {
            ship.y = 200;
            ship.rotation = 0;
        }
    }

    window.addEventListener("message", messageEventHandler, false);

    window.onload = (): void => {
        canvas = document.getElementById("screen");
        stage = new createjs.Stage(canvas);
        startPreload();
    };
} 