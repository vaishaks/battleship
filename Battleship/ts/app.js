/// <reference path="_references.ts" />

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

                routes.when('/place', {
                    templateUrl: url + 'place.html',
                    controller: "PlacementContoller"
                });

                routes.otherwise({
                    redirectTo: '/place'
                });
            }]);
    };

    Global.prototype.RegisterControllers = function () {
        var app = angular.module(Global.namespace + ".Controllers", []);
        app.controller('PlacementContoller', ['$scope', '$rootScope', PlacementContoller]);
    };

    Global.prototype.LoadSprites = function () {
        Global.ships = new Array();
        Global.ships.push(new Ship("Carrier", "images/aircraftcarrier.png", 1, 4, "carrier"));
        Global.ships.push(new Ship("Submarine", "images/submarine.png", 1, 3, "submarine"));
        Global.ships.push(new Ship("Destroyer", "images/destroyer.png", 2, 2, "destroyer"));

        //Global.ships.push(new Ship("Destroyer", "images/destroyer.png", 1, 2, "destroyer2"));
        Global.ships.push(new Ship("Boat", "images/patrol boat.png", 2, 1, "boat"));
        //Global.ships.push(new Ship("Boat 2", "images/patrol boat.png", 1, 1, "boat2"));
    };
    Global.namespace = "Battleship.Floor";
    return Global;
})();

window.onload = function () {
    var exit = document.getElementById("exit");
    var rotate = document.getElementById("rotate");
    var randomize = document.getElementById("randomize");
    var fire = document.getElementById("fire");
    exit.addEventListener("click", function () {
        console.log("exit");
    }, false);
    rotate.addEventListener("click", function () {
        console.log("something");
    }, false);
    randomize.addEventListener("click", function () {
        console.log("something");
    }, false);
    fire.addEventListener("click", function () {
        console.log("done/fire");

        document.getElementById('acarrier').innerHTML = '<div class="count" id="inventory">INVENTORY: {{ ship.inventory-1}}</div>';
    }, false);
};

var app = new Global();
var debugMode = true;
//# sourceMappingURL=app.js.map
