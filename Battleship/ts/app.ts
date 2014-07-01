/// <reference path="_references.ts" />

interface ITitleScope extends ng.IRootScopeService {
    title: string;
    moves: number;
}

interface IMessageScope {
    message: string;
}

interface IHintScope {
    hint: string;
}


class Global {
    static namespace: string = "Battleship.Floor";
    static ships: Array<Ship>;

    constructor() {  
        this.RegisterControllers();
        this.RegisterRoutes();        
        this.LoadSprites();
    }

    RegisterRoutes() {
        var app = angular.module(Global.namespace, ['ngRoute', Global.namespace + ".Controllers"]);
        app.config(['$routeProvider', function (routes: ng.route.IRouteProvider) {
            var url = '../partials/';

            routes.when('/place', {
                templateUrl: url + 'place.html',
                controller: "PlacementContoller"
            });

            routes.when('/alien', {
                templateUrl: url + 'place.html',
                controller: "alienController"
            });

            routes.otherwise({
                redirectTo: '/place'
            });
        }]);
    }

    RegisterControllers() {
        var app = angular.module(Global.namespace + ".Controllers", []);
        app.controller('PlacementContoller', ['$scope', '$rootScope', PlacementContoller]);
    }   

    LoadSprites() {
        Global.ships = new Array<Ship>();
        Global.ships.push(new Ship("Carrier", "images/aircraftcarrier.png", 1, 4, "carrier"));
        Global.ships.push(new Ship("Submarine", "images/submarine.png", 1, 3, "submarine"));
        Global.ships.push(new Ship("Destroyer", "images/destroyer.png", 2, 2, "destroyer"));
		//Global.ships.push(new Ship("Destroyer", "images/destroyer.png", 1, 2, "destroyer2"));
		Global.ships.push(new Ship("Boat", "images/patrol boat.png", 2, 1, "boat"));
        //Global.ships.push(new Ship("Boat 2", "images/patrol boat.png", 1, 1, "boat2"));
    }

    LoadSpritesAlien() {
        Global.ships = new Array<Ship>();
        Global.ships.push(new Ship("alienShip4", "images/AlienShip4.png", 1, 4, "alienShip4"));
        Global.ships.push(new Ship("alienShip3", "images/AlienShip3.png", 1, 3, "alienShip3"));
        Global.ships.push(new Ship("alienShip2", "images/AlienShip2.png", 2, 2, "alienShip2"));
        Global.ships.push(new Ship("alienShip1", "images/AlienShip1.png", 2, 1, "alienShip1"));
    }
}

window.onload = () => {
    var exit = document.getElementById("exit");
    var rotate = document.getElementById("rotate");
    var randomize = document.getElementById("randomize");
    var fire = document.getElementById("fire");
    exit.addEventListener("click", function () { console.log("exit"); }, false);
    rotate.addEventListener("click", function () { console.log("rotate"); }, false);
    randomize.addEventListener("click", function () { console.log("randomize"); }, false);
    fire.addEventListener("click", function () {
        console.log("done/fire");

        //document.getElementById('acarrier').innerHTML = '<div class="count" id="inventory">INVENTORY: {{ ship.inventory-1}}</div>';
    }, false);
 }

var app = new Global();
var debugMode = true;

