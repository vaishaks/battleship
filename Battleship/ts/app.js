
var Global = (function () {
    function Global() {
        this.RegisterControllers();
        this.RegisterRoutes();
        this.LoadSprites();
        Global.Ripple = new RippleFloor();
        Global.Ripple.setDebugMode(false);
    }
    Global.prototype.RegisterRoutes = function () {
        var app = angular.module(Global.namespace, ['ngRoute', Global.namespace + ".Controllers"]);
        app.config([
            '$routeProvider', function (routes) {
                var url = '../partials/';

                routes.when("/start", {
                    templateUrl: url + "start.html",
                    controller: "GameController"
                });

                routes.when("/mode", {
                    templateUrl: url + "mode.html",
                    controller: "GameController"
                });

                routes.when("/randomize", {
                    templateUrl: url + "randomize.html",
                    controller: "GameController"
                });

                routes.when('/place', {
                    templateUrl: url + 'place.html',
                    controller: "PlacementContoller"
                });

                routes.otherwise({
                    redirectTo: '/start'
                });
            }]);
    };

    Global.prototype.RegisterControllers = function () {
        var app = angular.module(Global.namespace + ".Controllers", []);
        app.controller('PlacementContoller', ['$scope', '$rootScope', '$location', PlacementContoller]);
        app.controller('GameController', ['$scope', '$rootScope', '$location', GameController]);
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
    Global.namespace = "Battleship.Floor";
    return Global;
})();

var app = new Global();
