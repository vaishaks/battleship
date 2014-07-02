/// <reference path="_references.ts" />

interface ITitleScope extends ng.IRootScopeService {
    title: string;
    moves: number;
    Exit: Function;
    Randomize: Function;
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
    static aliens: Array<Ship>;     
    static Ripple: RippleFloor;   

    constructor() {
        this.RegisterControllers();
        this.RegisterRoutes();
        this.LoadSprites();
        Global.Ripple = new RippleFloor(true);        
    }

    RegisterRoutes() {
        var app = angular.module(Global.namespace, ['ngRoute', Global.namespace + ".Controllers"]);
        app.config(['$routeProvider', function (routes: ng.route.IRouteProvider) {
            var url = '../partials/';

            routes.when("/start", {
                templateUrl: url + "start.html",
                controller: "GameController"
            });

            routes.when("/mode", {
                templateUrl: url + "mode.html",
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
    }

    RegisterControllers() {
        var app = angular.module(Global.namespace + ".Controllers", []);
        app.controller('PlacementContoller', ['$scope', '$rootScope', '$location', PlacementContoller]);
        app.controller('GameController', ['$scope', '$rootScope', '$location', GameController]);
    }

    LoadSprites() {
        Global.ships = new Array<Ship>();
        Global.ships.push(new Ship("Carrier", "images/aircraftcarrier.png", 1, 4, "carrier"));
        Global.ships.push(new Ship("Submarine", "images/submarine.png", 1, 3, "submarine"));
        Global.ships.push(new Ship("Destroyer", "images/destroyer.png", 2, 2, "destroyer"));
        Global.ships.push(new Ship("Boat", "images/patrol boat.png", 2, 1, "boat"));
    }

    LoadSpritesAlien() {
        Global.aliens = new Array<Ship>();
        Global.aliens.push(new Ship("alienShip4", "images/AlienShip4.png", 1, 4, "alienShip4"));
        Global.aliens.push(new Ship("alienShip3", "images/AlienShip3.png", 1, 3, "alienShip3"));
        Global.aliens.push(new Ship("alienShip2", "images/AlienShip2.png", 2, 2, "alienShip2"));
        Global.aliens.push(new Ship("alienShip1", "images/AlienShip1.png", 2, 1, "alienShip1"));
    }

    BindHandlers() {
        var exit = document.getElementById("exit");
        var rotate = document.getElementById("rotate");
        var randomize = document.getElementById("randomize");
        var fire = document.getElementById("fire");
        exit.addEventListener("click", () => { console.log("exit"); }, false);
        rotate.addEventListener("click", () => { console.log("rotate"); }, false);
        randomize.addEventListener("click", () => { console.log("randomize"); }, false);
        fire.addEventListener("click", () => { console.log("done/fire"); }, false);
    }
}

var app = new Global();