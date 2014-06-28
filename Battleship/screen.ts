/// <reference path="scripts/typings/jquery/jquery.d.ts" />
/// <reference path="scripts/typings/createjs/createjs.d.ts" />

module scrren {
    "use strict";

    var canvas: HTMLElement;
    var stage: createjs.Stage;
    var queue: createjs.LoadQueue;
    var shouldUpdate: boolean = true;
    var cells: any[] = [];
    var ships: Array<Ship> = new Array<Ship>(5);
    var manifest: Object = [{ src: "images/backgroundscreen.jpg", id: "backgroundScreen" },
                            { src: "images/aircraftCarrier.png", id: "aircraftcarrier" },
                            { src: "images/Destroyer.png", id: "destroyer" },
                            { src: "images/Submarine.png", id: "submarine" },
                            { src: "images/PatrolBoat.png", id: "patrolboat" },
                            { src: "images/grid.png", id: "grid" }];

    class Ship {
        public shipObject: createjs.Bitmap;
        public length: number;
        public row: number;
        public column: number;
        public isVertical: boolean;

        constructor(shipObject: createjs.Bitmap, length: number) {
            this.shipObject = shipObject;
            this.length = length;
            this.row = 0;
            this.column = 0;
            this.isVertical = false;
        }
    }

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
        var aircraftCarrier: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("aircraftcarrier"));
        ships[0] = new Ship(aircraftCarrier, 4);
        var submarine: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("submarine"));
        ships[1] = new Ship(submarine, 3);
        var destroyer1: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("destroyer"));
        ships[2] = new Ship(destroyer1, 2);
        var destroyer2: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("destroyer"));
        ships[3] = new Ship(destroyer2, 2);
        var patrolBoat: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("patrolboat"));
        ships[4] = new Ship(patrolBoat, 1);

        var grid: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("grid"));

        var gridContainer: createjs.Container = new createjs.Container();
        gridContainer.x = 100;
        gridContainer.y = 100;

        cells = createGridCells();

        randomlyPlaceShips();

        rotate(ships[0]);
        rotate(ships[0]);

        gridContainer.addChild(grid);
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 7; j++) {
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
            for (var j = 0; j < 7; j++) {
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

    function rotate(ship: Ship): void {
        if (!ship.isVertical) {
            ship.shipObject.x = 200;
            ship.shipObject.rotation = 90;
            ship.isVertical = true;
        }
        else {
            ship.shipObject.x = 0;            
            ship.shipObject.rotation = 0;
            ship.isVertical = false;
        }
    }

    function randomlyPlaceShips(): void {
        var map: Array<Array<boolean>> = new Array(5);
        for (var i = 0; i < 5; i++) {
            map[i] = new Array(7);
            for (var j = 0; j < 7; j++) {
                map[i][j] = true;
            }
        }
        for (var i = 0; i < 5; i++) {
            if (Math.random() > 0.5) {
                ships[i].isVertical = false;
            }
            else {
                ships[i].isVertical = true;
            }
            rotate(ships[i]);
            var limitX: number = 7;
            var limitY: number = 5;
            if (ships[i].isVertical) {
                limitY -= ships[i].length;
            }
            else {
                limitX -= ships[i].length;
            }
            var x: number;
            var y: number;
            var count: number = 0;
            do {
                count++;
                if (count > 10) {
                    ships[i].isVertical = !ships[i].isVertical;
                }
                x = Math.floor(Math.random() * limitY);
                y = Math.floor(Math.random() * limitX);
            }while (!canShipBePlaced(map, x, y, ships[i].isVertical, ships[i].length));
            count = 0;
            if (ships[i].isVertical) {
                for (var j = x; (j < 5) && (j <= x + ships[i].length); j++) {
                    map[j][y] = false
                }
            }
            else {
                for (var j = y; (j < 7) && (j <= y + ships[i].length); j++) {
                    map[x][j] = false;
                }
            }
            cells[x][y].addChild(ships[i].shipObject);
        }
    } 

    function canShipBePlaced(map: Array<Array<boolean>>, x: number, y: number, isVertical: boolean, len: number): boolean {
        if (isVertical) {
            for (var i = x; (i < 5) && (i <= x + len); i++) {
                if (map[i][y] == false) {
                    return false
                }
            }
        }
        else {
            for (var i = y; (i < 7) && (i <= y + len); i++) {
                if (map[x][i] == false) {
                    return false
                }
            }
        }
        return true;
    }

    window.addEventListener("message", messageEventHandler, false);

    window.onload = (): void => {
        canvas = document.getElementById("screen");
        stage = new createjs.Stage(canvas);
        startPreload();
    };

    window.onunload = (): void => {
        createjs.Ticker.removeAllEventListeners();
        stage.removeAllChildren();
        stage.enableDOMEvents(false);
        stage = null;
    }
} 