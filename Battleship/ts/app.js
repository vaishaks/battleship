﻿/// <reference path="_references.ts" />

var Global = (function () {
    function Global() {
        this.RegisterControllers();
        this.RegisterRoutes();
        this.LoadSprites();
    }
    Global.prototype.RegisterRoutes = function () {
        var app = angular.module(Global.namespace, ['ngRoute', Global.namespace + ".Controllers"]);
        app.config([
            '$routeProvider', function (routes) {
                var url = '../partials/';

                routes.when("/start", {
                    templateUrl: url + "start.html"
                });

                routes.when("/mode", {
                    templateUrl: url + "mode.html"
                });

                routes.when('/place', {
                    templateUrl: url + 'place.html',
                    controller: "PlacementContoller"
                });

                routes.when('/alien', {
                    templateUrl: url + 'alien.html',
                    controller: "AlienController"
                });

                routes.otherwise({
                    redirectTo: '/start'
                });
            }]);
    };

    Global.prototype.RegisterControllers = function () {
        var app = angular.module(Global.namespace + ".Controllers", []);
        app.controller('PlacementContoller', ['$scope', '$rootScope', PlacementContoller]);
        app.controller('PlacementContoller', ['$scope', '$rootScope', '$location', MenuController]);
        app.controller('PlacementContoller', ['$scope', '$rootScope', AlienController]);
    };

    Global.prototype.LoadSprites = function () {
        Global.ships = new Array();
        Global.ships.push(new Ship("Carrier", "images/aircraftcarrier.png", 1, 4, "carrier"));
        Global.ships.push(new Ship("Submarine", "images/submarine.png", 1, 3, "submarine"));
        Global.ships.push(new Ship("Destroyer", "images/destroyer.png", 2, 2, "destroyer"));
        Global.ships.push(new Ship("Boat", "images/patrol boat.png", 2, 1, "boat"));
    };

    Global.prototype.LoadSpritesAlien = function () {
        Global.aliens = new Array();
        Global.aliens.push(new Ship("alienShip4", "images/AlienShip4.png", 1, 4, "alienShip4"));
        Global.aliens.push(new Ship("alienShip3", "images/AlienShip3.png", 1, 3, "alienShip3"));
        Global.aliens.push(new Ship("alienShip2", "images/AlienShip2.png", 2, 2, "alienShip2"));
        Global.aliens.push(new Ship("alienShip1", "images/AlienShip1.png", 2, 1, "alienShip1"));
    };

    Global.prototype.BindHandlers = function () {
        var exit = document.getElementById("exit");
        var rotate = document.getElementById("rotate");
        var randomize = document.getElementById("randomize");
        var fire = document.getElementById("fire");
        exit.addEventListener("click", function () {
            console.log("exit");
        }, false);
        rotate.addEventListener("click", function () {
            console.log("rotate");
        }, false);
        randomize.addEventListener("click", function () {
            console.log("randomize");
        }, false);
        fire.addEventListener("click", function () {
            console.log("done/fire");
        }, false);
    };
    Global.namespace = "Battleship.Floor";
    return Global;
})();

var app = new Global();
//# sourceMappingURL=app.js.map
