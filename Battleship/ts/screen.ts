/// <reference path="_references.ts" />
/// <reference path="requestmanager.ts" />

module screen_window {
    "use strict";

    var canvas: HTMLCanvasElement;
    var stage: createjs.Stage;
    var queue: createjs.LoadQueue;
    var shouldUpdate: boolean = true;
    var isAnimating: boolean = false;
    var isCpuTurn: boolean = true;
    var bg: createjs.Bitmap;
    var playerGrid: createjs.Bitmap;
    var cpuGrid: createjs.Bitmap;
    var playerCells: Array<Array<createjs.Container>> = [];
    var cpuCells: Array<Array<createjs.Container>> = [];
    var playerGridContainer: createjs.Container;
    var cpuGridContainer: createjs.Container
    var playerShips: Array<Ship> = new Array<Ship>(6);
    var cpuShips: Ship[] = new Array<Ship>(6);
    var playerSunkCount: number = 0;
    var cpuSunkCount: number = 0;
    var playerMap: number[][];
    var cpuMap: number[][];
    var selectedShip: Ship;
    var reticle: Reticle;
    var intervalId: any;
    var moves: Array<RequestManager.IMoves> = new Array<RequestManager.IMoves>();;
    var move: number = 0;
    var themeMusic: createjs.SoundInstance;
    var discoThemeMusic: createjs.SoundInstance;
    var manifest: Object = [{ src: "images/backgroundscreen.jpg", id: "backgroundScreen" },
        { src: "images/aircraftCarrier.png", id: "aircraftcarrier" },
        { src: "images/Destroyer.png", id: "destroyer" },
        { src: "images/Submarine.png", id: "submarine" },
        { src: "images/PatrolBoat.png", id: "patrolboat" },
        { src: "images/grid.png", id: "grid" },
        { src: "images/explosion.png", id: "explosion" },
        { src: "images/hit.png", id: "hit" },
        { src: "images/miss.png", id: "miss" },
        { src: "images/hit_us.png", id: "hit_us" },
        { src: "images/spaceship.png", id: "spaceship" },
        { src: "images/explosion.png", id: "explosion" },
        { src: "sounds/theme_music.mp3", id: "theme_music" },
        { src: "sounds/hit.mp3", id: "hit_sound" },
        { src: "sounds/miss.mp3", id: "miss_sound" },
        { src: "sounds/disco_theme.mp3", id: "disco_theme" },
        { src: "sounds/hit_us.mp3", id: "hit_us_sound" }];

    class Ship {
        public shipObject: createjs.Bitmap;
        public length: number;
        public row: number;
        public column: number;
        public isVertical: boolean;
        public id: number;

        constructor(shipObject: createjs.Bitmap, length: number, id: number) {
            this.shipObject = shipObject;
            this.length = length;
            this.row = 0;
            this.column = 0;
            this.isVertical = false;
            this.id = id;
        }
    }

    class Reticle {
        public reticleElement: HTMLDivElement;
        public x: number;
        public y: number;

        constructor(reticleElement: HTMLDivElement) {
            this.reticleElement = reticleElement;
            this.x = 0;
            this.y = 0;
        }

        public move(x: number, y: number): void {
            $(this.reticleElement).css("margin-top", (x * 200 + 90).toString() + "px");
            $(this.reticleElement).css("margin-left", (y * 200 + 90).toString() + "px");
            this.x = x;
            this.y = y;
        }
    }

    function startPreload(): void {
        queue = new createjs.LoadQueue(false);
        createjs.Sound.alternateExtensions = ["mp3"];
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("complete", handleComplete, false);
        queue.loadManifest(manifest);
    }

    function update(): void {
        if (shouldUpdate) {
            shouldUpdate = false;
            stage.update();
        }
        if (isAnimating) {
            stage.update();
        }
    }

    function getBoard(): Array<RequestManager.IBoard> {
        var data: Array<RequestManager.IBoard> = $.map(playerShips, (ship, index) => {
            return { boatlength: ship.length, x: ship.row, y: ship.column, isVertical: ship.isVertical ? 1 : 0 };
        });
        return data;
    }

    function init(): void {
        themeMusic = createjs.Sound.play("theme_music", createjs.Sound.INTERRUPT_ANY, 0, 0, -1, 1, 0);
        bg = new createjs.Bitmap(<HTMLImageElement>queue.getResult("backgroundScreen"));
        var aircraftCarrier: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("aircraftcarrier"));
        playerShips[0] = new Ship(aircraftCarrier, 4, 0);
        playerShips[0].shipObject.addEventListener("click", (eventinfo: any) => { shipClickEventHandler(0); }, false);
        var submarine: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("submarine"));
        playerShips[1] = new Ship(submarine, 3, 1);
        playerShips[1].shipObject.addEventListener("click", (eventinfo: any) => { shipClickEventHandler(1); }, false);
        var destroyer1: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("destroyer"));
        playerShips[2] = new Ship(destroyer1, 2, 2);
        playerShips[2].shipObject.addEventListener("click", (eventinfo: any) => { shipClickEventHandler(2); }, false);
        var destroyer2: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("destroyer"));
        playerShips[3] = new Ship(destroyer2, 2, 3);
        playerShips[3].shipObject.addEventListener("click", (eventinfo: any) => { shipClickEventHandler(3); }, false);
        var patrolBoat1: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("patrolboat"));
        playerShips[4] = new Ship(patrolBoat1, 1, 4);
        playerShips[4].shipObject.addEventListener("click", (eventinfo: any) => { shipClickEventHandler(4); }, false);
        var patrolBoat2: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("patrolboat"));
        playerShips[5] = new Ship(patrolBoat2, 1, 5);
        playerShips[5].shipObject.addEventListener("click", (eventinfo: any) => { shipClickEventHandler(5); }, false);

        cpuShips[0] = new Ship(new createjs.Bitmap(<HTMLImageElement>queue.getResult("spaceship")), 4, 0);
        cpuShips[1] = new Ship(new createjs.Bitmap(<HTMLImageElement>queue.getResult("spaceship")), 3, 1);
        cpuShips[2] = new Ship(new createjs.Bitmap(<HTMLImageElement>queue.getResult("spaceship")), 2, 2);
        cpuShips[3] = new Ship(new createjs.Bitmap(<HTMLImageElement>queue.getResult("spaceship")), 2, 3);
        cpuShips[4] = new Ship(new createjs.Bitmap(<HTMLImageElement>queue.getResult("spaceship")), 1, 4);
        cpuShips[5] = new Ship(new createjs.Bitmap(<HTMLImageElement>queue.getResult("spaceship")), 1, 5);

        playerGrid = new createjs.Bitmap(<HTMLImageElement>queue.getResult("grid"));
        cpuGrid = new createjs.Bitmap(<HTMLImageElement>queue.getResult("grid"));

        playerGridContainer = new createjs.Container();
        playerGridContainer.x = 100;
        playerGridContainer.y = 100;
        playerGridContainer.addEventListener("click", gridClickEventHandler, false);

        cpuGridContainer = new createjs.Container();
        cpuGridContainer.x = 100;
        cpuGridContainer.y = 100;
        cpuGridContainer.addEventListener("click", gridClickEventHandler, false);

        playerCells = createGridCells();
        cpuCells = createGridCells();
    }

    function startGame(): void {
        // intervalId = window.setInterval(randomlyPlaceShips, 1000);
        $("#splash-screen").hide();
        $("#game-over").hide();
        $("#screen").show();
        $("#container").css("display", "block");
        playerMap = randomlyPlaceShips(playerShips, playerCells);
        var data: Array<RequestManager.IBoard> = getBoard();
        RequestManager.getMoves("hard", data).done((data) => {
            moves = data;
            playGame();
        });

        cpuMap = randomlyPlaceShips(cpuShips, cpuCells);

        reticle.move(Math.floor(Math.random() * 5), Math.floor(Math.random() * 7));

        playerGridContainer.addChild(playerGrid);
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 7; j++) {
                playerGridContainer.addChild(playerCells[i][j]);
            }
        }

        cpuGridContainer.addChild(cpuGrid);
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 7; j++) {
                cpuGridContainer.addChild(cpuCells[i][j]);
            }
        }

        stage.addChild(bg);
        stage.addChild(playerGridContainer);
    }

    function newGame(): void {
        discoThemeMusic.pause();
        themeMusic.play();
        move = 0;
        isCpuTurn = true;
        playerSunkCount = 0;
        cpuSunkCount = 0;
        init();
        startGame();
    }

    function playGame(): void {
        themeMusic.setVolume(0.3);
        nextMove();
    }

    function nextMove(): boolean {
        if (moves.length > move) {
            reticle.move(moves[move].x, moves[move].y);
            $("#shoot").trigger("click");
            move++;
            return true;
        }
        else {
            console.log("No more moves");
            return false;
        }
    }

    function switchTurn(): void {
        if (playerSunkCount == 6) {
            endGame(false);
        }
        else if (cpuSunkCount == 6) {
            endGame(true);
        }
        if (isCpuTurn) {
            stage.removeChild(playerGridContainer);
            stage.addChild(cpuGridContainer);            
            isCpuTurn = false;
            shouldUpdate = true;
        }
        else {
            stage.removeChild(cpuGridContainer);
            stage.addChild(playerGridContainer);
            isCpuTurn = true;
            shouldUpdate = true;
            window.setTimeout(() => { nextMove(); }, 800);
        }        
    }

    function endGame(cpuWon: boolean): void {
        themeMusic.pause();
        discoThemeMusic = createjs.Sound.play("disco_theme");
        $("#screen").hide();
        $("#container").css("display", "none");
        $("#game-over").show();
    }

    function handleComplete(eventinfo: CustomEvent): void {
        $(".windows8").hide();
        init();
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", update, false);
    }

    function messageEventHandler(eventinfo: any): void {
        console.log(eventinfo.data);
    }

    function gridClickEventHandler(eventinfo: any): void {
        var x: number = Math.floor((eventinfo.rawY - 100) / 200);
        var y: number = Math.floor((eventinfo.rawX - 100) / 200);
        //cells[x][y].addChild(new createjs.Bitmap(<HTMLImageElement>queue.getResult("miss")));
        shouldUpdate = true;
    }

    function shipClickEventHandler(shipId: number): void {
        console.log(playerShips[shipId]);
        selectedShip = playerShips[shipId];
    }

    function setMap(ship: Ship, flag: number): void {
        if (ship.isVertical) {
            for (var j = ship.row; (j < 5) && (j < ship.row + ship.length); j++) {
                playerMap[j][ship.column] = flag;
            }
        }
        else {
            for (var j = ship.column; (j < 7) && (j < ship.column + ship.length); j++) {
                playerMap[ship.row][j] = flag;
            }
        }
    }

    function movementButtonClickEventHandler(eventinfo: any) {
        if (selectedShip == null) {
            return;
        }
        setMap(selectedShip, -1);
        switch (eventinfo.target.id) {
            case "up":
                if (selectedShip.row - 1 >= 0 &&
                    canShipBePlaced(playerMap, selectedShip.row - 1, selectedShip.column, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.row--;
                }
                break;
            case "down":
                if (!selectedShip.isVertical && (selectedShip.row + 1) < 5 &&
                    canShipBePlaced(playerMap, selectedShip.row + 1, selectedShip.column, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.row++;
                }
                else if (selectedShip.row + selectedShip.length < 5 &&
                    canShipBePlaced(playerMap, selectedShip.row + 1, selectedShip.column, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.row++;
                }
                break;
            case "left":
                if (selectedShip.column - 1 >= 0 &&
                    canShipBePlaced(playerMap, selectedShip.row, selectedShip.column - 1, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.column--;
                }
                break;
            case "right":
                if (selectedShip.isVertical && (selectedShip.column + 1) < 7 &&
                    canShipBePlaced(playerMap, selectedShip.row, selectedShip.column + 1, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.column++;
                }
                else if (selectedShip.column + selectedShip.length < 7 &&
                    canShipBePlaced(playerMap, selectedShip.row, selectedShip.column + 1, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.column++;
                }
                break;
            case "rotate":
                if (canShipBePlaced(playerMap, selectedShip.row, selectedShip.column, !selectedShip.isVertical, selectedShip.length)) {
                    rotate(selectedShip);
                }
                break;
        }
        setMap(selectedShip, selectedShip.id);
        playerCells[selectedShip.row][selectedShip.column].addChild(selectedShip.shipObject);
        shouldUpdate = true;
    }

    function randomizeButtonClickEventHandler(eventinfo: any) {
        playerMap = randomlyPlaceShips(playerShips, playerCells);
    }

    function reticleButtonClickEventHandler(eventinfo: any) {
        switch (eventinfo.target.id) {
            case "reticle-up":
                if (reticle.x - 1 >= 0) {
                    reticle.move(reticle.x - 1, reticle.y);
                }
                break;
            case "reticle-down":
                if (reticle.x + 1 < 5) {
                    reticle.move(reticle.x + 1, reticle.y);
                }
                break;
            case "reticle-left":
                if (reticle.y - 1 >= 0) {
                    reticle.move(reticle.x, reticle.y - 1);
                }
                break;
            case "reticle-right":
                if (reticle.y + 1 < 7) {
                    reticle.move(reticle.x, reticle.y + 1);
                }
                break;
        }
    }

    function shootButtonClickEventHandler(eventinfo: any) {
        if (isCpuTurn) {
            if (playerMap[reticle.x][reticle.y] == -1) {
                playerCells[reticle.x][reticle.y].addChild(new createjs.Bitmap(<HTMLImageElement>queue.getResult("miss")));
                setTimeout(() => { createjs.Sound.play("miss_sound"); }, 800);
            }
            else {
                playerCells[reticle.x][reticle.y].addChild(new createjs.Bitmap(<HTMLImageElement>queue.getResult("hit_us")));
                playerShips[playerMap[reticle.x][reticle.y]].length--;
                setTimeout(() => { createjs.Sound.play("hit_us_sound"); }, 1000);
                if (playerShips[playerMap[reticle.x][reticle.y]].length === 0) {
                    console.log("Ship with id " + playerMap[reticle.x][reticle.y] + " sunk!");
                    var boom: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("explosion"));
                    boom.x = 650;
                    boom.y = 450;
                    boom.scaleX = boom.scaleY = 0.01;
                    isAnimating = true;
                    createjs.Tween.get(boom)
                        .wait(1000)
                        .to({ scaleX: 1, scaleY: 1, x: 450, y: 250 }, 1200, createjs.Ease.bounceOut)
                        .to({ scaleX: 0.2, scaleY: 0.2, x: 650, y: 450 }, 100, createjs.Ease.bounceIn);
                    playerGridContainer.addChild(boom);
                    setTimeout(() => {
                        isAnimating = false;
                        playerGridContainer.removeChild(boom);
                        shouldUpdate = true;
                    }, 1800);
                    playerSunkCount++;
                }
            }
        }
        else {
            if (cpuMap[reticle.x][reticle.y] == -1) {
                cpuCells[reticle.x][reticle.y].addChild(new createjs.Bitmap(<HTMLImageElement>queue.getResult("miss")));
                setTimeout(() => { createjs.Sound.play("miss_sound"); }, 800);
            }
            else {
                cpuCells[reticle.x][reticle.y].addChild(new createjs.Bitmap(<HTMLImageElement>queue.getResult("hit")));
                cpuShips[cpuMap[reticle.x][reticle.y]].length--;
                setTimeout(() => { createjs.Sound.play("hit_sound"); }, 1000);
                if (cpuShips[cpuMap[reticle.x][reticle.y]].length === 0) {
                    console.log("Ship with id " + cpuMap[reticle.x][reticle.y] + " sunk!");
                    var boom: createjs.Bitmap = new createjs.Bitmap(<HTMLImageElement>queue.getResult("explosion"));
                    boom.x = 650;
                    boom.y = 450;
                    boom.scaleX = boom.scaleY = 0.01;
                    isAnimating = true;
                    createjs.Tween.get(boom)
                        .wait(1000)
                        .to({ scaleX: 1, scaleY: 1, x: 450, y: 250 }, 1200, createjs.Ease.bounceOut)
                        .wait(1000)
                        .to({ scaleX: 0.2, scaleY: 0.2, x: 650, y: 450 }, 100, createjs.Ease.bounceIn);
                    cpuGridContainer.addChild(boom);
                    setTimeout(() => {
                        isAnimating = false;
                        cpuGridContainer.removeChild(boom);
                        shouldUpdate = true;
                    }, 1800);
                    cpuSunkCount++;
                }
            }
        }
        window.setTimeout(() => { shouldUpdate = true; }, 700);
        window.setTimeout(() => { switchTurn(); }, 3000);
    }

    function nextMoveClickEventHandler(eventinfo: any) {
        nextMove();
    }

    function switchTurnClickEventHandler(eventinfo: any) {
        switchTurn();
    }

    function newGameButtonClickEventHandler(eventinfo: any): void {
        newGame();
    }

    function startGameButtonClickEventHandler(eventinfo: any): void {
        startGame();
    }

    function endGameButtonClickEventHandler(eventinfo: any): void {
        endGame(true);
    }

    function createGridCells(): any[] {
        var cells: any[] = new Array(5);
        var x, y = 0;
        for (var i = 0; i < 5; i++) {
            cells[i] = new Array<createjs.Container>(6);
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

    function randomlyPlaceShips(ships: Ship[], cells: createjs.Container[][]): number[][] {
        var map: number[][] = new Array(5);

        for (var i = 0; i < 5; i++) {
            map[i] = new Array(7);
            for (var j = 0; j < 7; j++) {
                map[i][j] = -1;
            }
        }
        for (var i = 0; i < 6; i++) {
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
                if (count > 10) {
                    ships[i].isVertical = !ships[i].isVertical;
                }
                x = Math.floor(Math.random() * limitY);
                y = Math.floor(Math.random() * limitX);
            } while (!canShipBePlaced(map, x, y, ships[i].isVertical, ships[i].length));
            count = 0;
            if (ships[i].isVertical) {
                for (var j = x; (j < 5) && (j < x + ships[i].length); j++) {
                    map[j][y] = i;
                }
            }
            else {
                for (var j = y; (j < 7) && (j < y + ships[i].length); j++) {
                    map[x][j] = i;
                }
            }
            cells[x][y].addChild(ships[i].shipObject);
            ships[i].row = x;
            ships[i].column = y;
        }
        shouldUpdate = true;
        return map;
    }

    function canShipBePlaced(map: number[][], x: number, y: number, isVertical: boolean, len: number): boolean {
        if (isVertical) {
            for (var i = x; (i < 5) && (i < x + len); i++) {
                if (map[i][y] !== -1) {
                    return false;
                }
            }
            if (i === 5 && x > 5 - len) {
                return false;
            }
        }
        else {
            for (var i = y; (i < 7) && (i < y + len); i++) {
                if (map[x][i] !== -1) {
                    return false;
                }
            }
            if (i === 7 && y > 7 - len) {
                return false;
            }
        }
        return true;
    }

    window.addEventListener("message", messageEventHandler, false);

    window.onload = (): void => {
        $("#screen").hide();
        $("#game-over").hide();
        canvas = <HTMLCanvasElement>document.getElementById("screen");
        reticle = new Reticle(<HTMLDivElement>document.getElementById("holder"));
        document.getElementById("start-game").addEventListener("click", startGameButtonClickEventHandler, false);
        document.getElementById("new-game").addEventListener("click", newGameButtonClickEventHandler, false);
        document.getElementById("end-game").addEventListener("click", endGameButtonClickEventHandler, false);
        document.getElementById("up").addEventListener("click", movementButtonClickEventHandler, false);
        document.getElementById("down").addEventListener("click", movementButtonClickEventHandler, false);
        document.getElementById("left").addEventListener("click", movementButtonClickEventHandler, false);
        document.getElementById("right").addEventListener("click", movementButtonClickEventHandler, false);
        document.getElementById("rotate").addEventListener("click", movementButtonClickEventHandler, false);
        document.getElementById("randomize").addEventListener("click", randomizeButtonClickEventHandler, false);
        document.getElementById("reticle-up").addEventListener("click", reticleButtonClickEventHandler, false);
        document.getElementById("reticle-down").addEventListener("click", reticleButtonClickEventHandler, false);
        document.getElementById("reticle-left").addEventListener("click", reticleButtonClickEventHandler, false);
        document.getElementById("reticle-right").addEventListener("click", reticleButtonClickEventHandler, false);
        document.getElementById("shoot").addEventListener("click", shootButtonClickEventHandler, false);
        document.getElementById("next-move").addEventListener("click", nextMoveClickEventHandler, false);
        document.getElementById("switch-turn").addEventListener("click", switchTurnClickEventHandler, false);
        stage = new createjs.Stage(canvas);
        startPreload();
    };

    window.onunload = (): void => {
        createjs.Ticker.removeAllEventListeners();
        stage.removeAllChildren();
        stage.enableDOMEvents(false);
        stage = null;
        window.clearInterval(intervalId);
    }
} 