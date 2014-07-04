var screen_window;
(function (screen_window) {
    "use strict";

    var canvas;
    var stage;
    var queue;
    var shouldUpdate = true;
    var isAnimating = false;
    var isCpuTurn = true;
    var bg;
    var playerGrid;
    var cpuGrid;
    var playerCells = [];
    var cpuCells = [];
    var playerGridContainer;
    var cpuGridContainer;
    var playerShips = new Array(6);
    var cpuShips = new Array(6);
    var playerSunkCount = 0;
    var cpuSunkCount = 0;
    var playerMap;
    var cpuMap;
    var selectedShip;
    var reticle;
    var intervalId;
    var moves = new Array();
    ;
    var move = 0;
    var themeMusic;
    var discoThemeMusic;
    var manifest = [
        { src: "images/backgroundscreen.jpg", id: "backgroundScreen" },
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

    var Ship = (function () {
        function Ship(shipObject, length, id) {
            this.shipObject = shipObject;
            this.length = length;
            this.row = 0;
            this.column = 0;
            this.isVertical = false;
            this.id = id;
        }
        return Ship;
    })();

    var Reticle = (function () {
        function Reticle(reticleElement) {
            this.reticleElement = reticleElement;
            this.x = 0;
            this.y = 0;
        }
        Reticle.prototype.move = function (x, y) {
            $(this.reticleElement).css("margin-top", (x * 200 + 90).toString() + "px");
            $(this.reticleElement).css("margin-left", (y * 200 + 90).toString() + "px");
            this.x = x;
            this.y = y;
        };
        return Reticle;
    })();

    function startPreload() {
        queue = new createjs.LoadQueue(false);
        createjs.Sound.alternateExtensions = ["mp3"];
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("complete", handleComplete, false);
        queue.loadManifest(manifest);
    }

    function update() {
        if (shouldUpdate) {
            shouldUpdate = false;
            stage.update();
        }
        if (isAnimating) {
            stage.update();
        }
    }

    function getBoard() {
        var data = $.map(playerShips, function (ship, index) {
            return { boatlength: ship.length, x: ship.row, y: ship.column, isVertical: ship.isVertical ? 1 : 0 };
        });
        return data;
    }

    function init() {
        themeMusic = createjs.Sound.play("theme_music", createjs.Sound.INTERRUPT_ANY, 0, 0, -1, 1, 0);
        bg = new createjs.Bitmap(queue.getResult("backgroundScreen"));
        var aircraftCarrier = new createjs.Bitmap(queue.getResult("aircraftcarrier"));
        playerShips[0] = new Ship(aircraftCarrier, 4, 0);
        playerShips[0].shipObject.addEventListener("click", function (eventinfo) {
            shipClickEventHandler(0);
        }, false);
        var submarine = new createjs.Bitmap(queue.getResult("submarine"));
        playerShips[1] = new Ship(submarine, 3, 1);
        playerShips[1].shipObject.addEventListener("click", function (eventinfo) {
            shipClickEventHandler(1);
        }, false);
        var destroyer1 = new createjs.Bitmap(queue.getResult("destroyer"));
        playerShips[2] = new Ship(destroyer1, 2, 2);
        playerShips[2].shipObject.addEventListener("click", function (eventinfo) {
            shipClickEventHandler(2);
        }, false);
        var destroyer2 = new createjs.Bitmap(queue.getResult("destroyer"));
        playerShips[3] = new Ship(destroyer2, 2, 3);
        playerShips[3].shipObject.addEventListener("click", function (eventinfo) {
            shipClickEventHandler(3);
        }, false);
        var patrolBoat1 = new createjs.Bitmap(queue.getResult("patrolboat"));
        playerShips[4] = new Ship(patrolBoat1, 1, 4);
        playerShips[4].shipObject.addEventListener("click", function (eventinfo) {
            shipClickEventHandler(4);
        }, false);
        var patrolBoat2 = new createjs.Bitmap(queue.getResult("patrolboat"));
        playerShips[5] = new Ship(patrolBoat2, 1, 5);
        playerShips[5].shipObject.addEventListener("click", function (eventinfo) {
            shipClickEventHandler(5);
        }, false);

        cpuShips[0] = new Ship(new createjs.Bitmap(queue.getResult("spaceship")), 4, 0);
        cpuShips[1] = new Ship(new createjs.Bitmap(queue.getResult("spaceship")), 3, 1);
        cpuShips[2] = new Ship(new createjs.Bitmap(queue.getResult("spaceship")), 2, 2);
        cpuShips[3] = new Ship(new createjs.Bitmap(queue.getResult("spaceship")), 2, 3);
        cpuShips[4] = new Ship(new createjs.Bitmap(queue.getResult("spaceship")), 1, 4);
        cpuShips[5] = new Ship(new createjs.Bitmap(queue.getResult("spaceship")), 1, 5);

        playerGrid = new createjs.Bitmap(queue.getResult("grid"));
        cpuGrid = new createjs.Bitmap(queue.getResult("grid"));

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

    function startGame() {
        $("#splash-screen").hide();
        $("#game-over").hide();
        $("#screen").show();
        $("#container").css("display", "block");

        stage.addChild(bg);
        stage.addChild(playerGridContainer);
        playerMap = randomlyPlaceShips(playerShips, playerCells);

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
    }

    function newGame() {
        discoThemeMusic.pause();
        themeMusic.play();
        move = 0;
        isCpuTurn = true;
        playerSunkCount = 0;
        cpuSunkCount = 0;
        init();
        startGame();
    }

    function playGame() {
        themeMusic.setVolume(0.3);
        nextMove();
    }

    function nextMove() {
        if (moves.length > move) {
            reticle.move(moves[move].x, moves[move].y);
            $("#shoot").trigger("click");
            move++;
            return true;
        } else {
            console.log("No more moves");
            return false;
        }
    }

    function switchTurn() {
        if (playerSunkCount == 6) {
            endGame(false);
        } else if (cpuSunkCount == 6) {
            endGame(true);
        }
        if (isCpuTurn) {
            stage.removeChild(playerGridContainer);
            stage.addChild(cpuGridContainer);
            isCpuTurn = false;
            shouldUpdate = true;
        } else {
            stage.removeChild(cpuGridContainer);
            stage.addChild(playerGridContainer);
            isCpuTurn = true;
            shouldUpdate = true;
            window.setTimeout(function () {
                nextMove();
            }, 800);
        }
    }

    function endGame(cpuWon) {
        themeMusic.pause();
        discoThemeMusic = createjs.Sound.play("disco_theme");
        $("#screen").hide();
        $("#container").css("display", "none");
        $("#game-over").show();
        if (cpuWon) {
            $("#player-lost").css("display", "block");
            $("#player-won").css("display", "none");
        } else {
            $("#player-lost").css("display", "none");
            $("#player-won").css("display", "block");
        }
    }

    function handleComplete(eventinfo) {
        document.addEventListener("mode", startGameButtonClickEventHandler, false);
        document.addEventListener("start", doneButtonClickEventHandler, false);
        $(".windows8").hide();
        init();
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", update, false);
    }

    function messageEventHandler(eventinfo) {
        console.log(eventinfo.data);
    }

    function gridClickEventHandler(eventinfo) {
        var x = Math.floor((eventinfo.rawY - 100) / 200);
        var y = Math.floor((eventinfo.rawX - 100) / 200);

        shouldUpdate = true;
    }

    function shipClickEventHandler(shipId) {
        console.log(playerShips[shipId]);
        selectedShip = playerShips[shipId];
    }

    function setMap(ship, flag) {
        if (ship.isVertical) {
            for (var j = ship.row; (j < 5) && (j < ship.row + ship.length); j++) {
                playerMap[j][ship.column] = flag;
            }
        } else {
            for (var j = ship.column; (j < 7) && (j < ship.column + ship.length); j++) {
                playerMap[ship.row][j] = flag;
            }
        }
    }

    function movementButtonClickEventHandler(eventinfo) {
        if (selectedShip == null) {
            return;
        }
        setMap(selectedShip, -1);
        switch (eventinfo.target.id) {
            case "up":
                if (selectedShip.row - 1 >= 0 && canShipBePlaced(playerMap, selectedShip.row - 1, selectedShip.column, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.row--;
                }
                break;
            case "down":
                if (!selectedShip.isVertical && (selectedShip.row + 1) < 5 && canShipBePlaced(playerMap, selectedShip.row + 1, selectedShip.column, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.row++;
                } else if (selectedShip.row + selectedShip.length < 5 && canShipBePlaced(playerMap, selectedShip.row + 1, selectedShip.column, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.row++;
                }
                break;
            case "left":
                if (selectedShip.column - 1 >= 0 && canShipBePlaced(playerMap, selectedShip.row, selectedShip.column - 1, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.column--;
                }
                break;
            case "right":
                if (selectedShip.isVertical && (selectedShip.column + 1) < 7 && canShipBePlaced(playerMap, selectedShip.row, selectedShip.column + 1, selectedShip.isVertical, selectedShip.length)) {
                    selectedShip.column++;
                } else if (selectedShip.column + selectedShip.length < 7 && canShipBePlaced(playerMap, selectedShip.row, selectedShip.column + 1, selectedShip.isVertical, selectedShip.length)) {
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

    function randomizeButtonClickEventHandler(eventinfo) {
        playerMap = randomlyPlaceShips(playerShips, playerCells);
    }

    function reticleButtonClickEventHandler(eventinfo) {
        var dir = eventinfo.commandParameters.join("");
        switch (dir) {
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

    function shootButtonClickEventHandler(eventinfo) {
        if (isCpuTurn) {
            if (playerMap[reticle.x][reticle.y] == -1) {
                playerCells[reticle.x][reticle.y].addChild(new createjs.Bitmap(queue.getResult("miss")));
                setTimeout(function () {
                    createjs.Sound.play("miss_sound");
                }, 800);
            } else {
                playerCells[reticle.x][reticle.y].addChild(new createjs.Bitmap(queue.getResult("hit_us")));
                playerShips[playerMap[reticle.x][reticle.y]].length--;
                setTimeout(function () {
                    createjs.Sound.play("hit_us_sound");
                }, 1000);
                if (playerShips[playerMap[reticle.x][reticle.y]].length === 0) {
                    console.log("Ship with id " + playerMap[reticle.x][reticle.y] + " sunk!");
                    var boom = new createjs.Bitmap(queue.getResult("explosion"));
                    boom.x = 650;
                    boom.y = 450;
                    boom.scaleX = boom.scaleY = 0.01;
                    isAnimating = true;
                    createjs.Tween.get(boom).wait(1000).to({ scaleX: 1, scaleY: 1, x: 450, y: 250 }, 1200, createjs.Ease.bounceOut).to({ scaleX: 0.2, scaleY: 0.2, x: 650, y: 450 }, 100, createjs.Ease.bounceIn);
                    playerGridContainer.addChild(boom);
                    setTimeout(function () {
                        isAnimating = false;
                        playerGridContainer.removeChild(boom);
                        shouldUpdate = true;
                    }, 1800);
                    playerSunkCount++;
                }
            }
        } else {
            if (cpuMap[reticle.x][reticle.y] == -1) {
                cpuCells[reticle.x][reticle.y].addChild(new createjs.Bitmap(queue.getResult("miss")));
                setTimeout(function () {
                    createjs.Sound.play("miss_sound");
                }, 800);
            } else {
                cpuCells[reticle.x][reticle.y].addChild(new createjs.Bitmap(queue.getResult("hit")));
                cpuShips[cpuMap[reticle.x][reticle.y]].length--;
                setTimeout(function () {
                    createjs.Sound.play("hit_sound");
                }, 1000);
                if (cpuShips[cpuMap[reticle.x][reticle.y]].length === 0) {
                    console.log("Ship with id " + cpuMap[reticle.x][reticle.y] + " sunk!");
                    var boom = new createjs.Bitmap(queue.getResult("explosion"));
                    boom.x = 650;
                    boom.y = 450;
                    boom.scaleX = boom.scaleY = 0.01;
                    isAnimating = true;
                    createjs.Tween.get(boom).wait(1000).to({ scaleX: 1, scaleY: 1, x: 450, y: 250 }, 1200, createjs.Ease.bounceOut).wait(1000).to({ scaleX: 0.2, scaleY: 0.2, x: 650, y: 450 }, 100, createjs.Ease.bounceIn);
                    cpuGridContainer.addChild(boom);
                    setTimeout(function () {
                        isAnimating = false;
                        cpuGridContainer.removeChild(boom);
                        shouldUpdate = true;
                    }, 1800);
                    cpuSunkCount++;
                }
            }
        }
        window.setTimeout(function () {
            shouldUpdate = true;
        }, 700);
        window.setTimeout(function () {
            switchTurn();
        }, 3000);
    }

    function nextMoveClickEventHandler(eventinfo) {
        nextMove();
    }

    function switchTurnClickEventHandler(eventinfo) {
        switchTurn();
        var ripple = new RippleScreen();
        ripple.sendCommandToFloor("switch", "");
    }

    function newGameButtonClickEventHandler(eventinfo) {
        newGame();
    }

    function startGameButtonClickEventHandler(eventinfo) {
        Global.mode = eventinfo.commandParameters.join("");
        startGame();
    }

    function endGameButtonClickEventHandler(eventinfo) {
        endGame(true);
    }

    function creditsButtonClickEventHandler(eventinfo) {
        $("#screen").hide();
        $("#splash-screen").hide();
        $("#credits").show();
    }

    function doneButtonClickEventHandler(eventinfo) {
        var data = getBoard();
        RequestManager.getMoves(Global.mode, data).done(function (data) {
            moves = data;
            playGame();
        });
    }

    function createGridCells() {
        var cells = new Array(5);
        var x, y = 0;
        for (var i = 0; i < 5; i++) {
            cells[i] = new Array(6);
            x = 0;
            for (var j = 0; j < 7; j++) {
                var cell = new createjs.Container();
                cell.x = x;
                cell.y = y;
                x += 200;
                cells[i][j] = cell;
            }
            y += 200;
        }
        return cells;
    }

    function rotate(ship) {
        if (!ship.isVertical) {
            ship.shipObject.x = 200;
            ship.shipObject.rotation = 90;
            ship.isVertical = true;
        } else {
            ship.shipObject.x = 0;
            ship.shipObject.rotation = 0;
            ship.isVertical = false;
        }
    }

    function randomlyPlaceShips(ships, cells) {
        var map = new Array(5);

        for (var i = 0; i < 5; i++) {
            map[i] = new Array(7);
            for (var j = 0; j < 7; j++) {
                map[i][j] = -1;
            }
        }
        for (var i = 0; i < 6; i++) {
            if (Math.random() > 0.5) {
                ships[i].isVertical = false;
            } else {
                ships[i].isVertical = true;
            }
            rotate(ships[i]);
            var limitX = 7;
            var limitY = 5;
            if (ships[i].isVertical) {
                limitY -= ships[i].length;
            } else {
                limitX -= ships[i].length;
            }
            var x;
            var y;
            var count = 0;
            do {
                if (count > 10) {
                    ships[i].isVertical = !ships[i].isVertical;
                }
                x = Math.floor(Math.random() * limitY);
                y = Math.floor(Math.random() * limitX);
            } while(!canShipBePlaced(map, x, y, ships[i].isVertical, ships[i].length));
            count = 0;
            if (ships[i].isVertical) {
                for (var j = x; (j < 5) && (j < x + ships[i].length); j++) {
                    map[j][y] = i;
                }
            } else {
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

    function canShipBePlaced(map, x, y, isVertical, len) {
        if (isVertical) {
            for (var i = x; (i < 5) && (i < x + len); i++) {
                if (map[i][y] !== -1) {
                    return false;
                }
            }
            if (i === 5 && x > 5 - len) {
                return false;
            }
        } else {
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

    var Global = (function () {
        function Global() {
        }
        Global.mode = "Hard";
        return Global;
    })();

    window.addEventListener("message", messageEventHandler, false);

    window.onload = function () {
        $("#screen").hide();
        $("#game-over").hide();
        $("#credits").hide();
        canvas = document.getElementById("screen");
        reticle = new Reticle(document.getElementById("holder"));

        document.addEventListener("randomize", randomizeButtonClickEventHandler, false);
        document.addEventListener("up", reticleButtonClickEventHandler, false);
        document.addEventListener("down", reticleButtonClickEventHandler, false);
        document.addEventListener("left", reticleButtonClickEventHandler, false);
        document.addEventListener("right", reticleButtonClickEventHandler, false);
        document.addEventListener("fire", shootButtonClickEventHandler, false);
        document.addEventListener("credits", creditsButtonClickEventHandler, false);

        document.getElementById("reticle-up").addEventListener("click", reticleButtonClickEventHandler, false);
        document.getElementById("reticle-down").addEventListener("click", reticleButtonClickEventHandler, false);
        document.getElementById("reticle-left").addEventListener("click", reticleButtonClickEventHandler, false);
        document.getElementById("reticle-right").addEventListener("click", reticleButtonClickEventHandler, false);
        document.getElementById("shoot").addEventListener("click", shootButtonClickEventHandler, false);

        document.getElementById("new-game").addEventListener("click", newGameButtonClickEventHandler, false);
        document.getElementById("end-game").addEventListener("click", endGameButtonClickEventHandler, false);
        document.getElementById("up").addEventListener("click", movementButtonClickEventHandler, false);
        document.getElementById("down").addEventListener("click", movementButtonClickEventHandler, false);
        document.getElementById("left").addEventListener("click", movementButtonClickEventHandler, false);
        document.getElementById("right").addEventListener("click", movementButtonClickEventHandler, false);
        document.getElementById("rotate").addEventListener("click", movementButtonClickEventHandler, false);
        document.getElementById("next-move").addEventListener("click", nextMoveClickEventHandler, false);
        document.getElementById("switch-turn").addEventListener("click", switchTurnClickEventHandler, false);
        document.getElementById("credits-button").addEventListener("click", creditsButtonClickEventHandler, false);
        stage = new createjs.Stage(canvas);
        startPreload();
    };

    window.onunload = function () {
        createjs.Ticker.removeAllEventListeners();
        stage.removeAllChildren();
        stage.enableDOMEvents(false);
        stage = null;
        window.clearInterval(intervalId);
    };
})(screen_window || (screen_window = {}));
