interface IPlacementScope extends ng.IScope, IMessageScope, IHintScope {
    ships: Array<Ship>;
    Place: Function;
}

class PlacementContoller {
    static $inject = ["$scope", "$rootScope", "$location"];
    static Location: ng.ILocationService;
    static shipsPlaced: number = 0;
    gameMode: boolean = false;

    constructor(private scope: IPlacementScope, private header: ITitleScope, location: ng.ILocationService) {
        this.scope.ships = Global.ships;
        this.scope.message = "Ha ha ha. You're fleet isn't even organized. This is going to be so easy, puny human.";
        this.header.title = "Place your fleet";
        this.scope.Place = this.Place;
        PlacementContoller.Location = location;
        this.SubscribeEvents();                    
    }

    Place() {
        var selectedShip = Global.ships[PlacementContoller.shipsPlaced];
        if (this.gameMode !== true) {
            if (selectedShip.inventory != 0) {
                selectedShip.Destroy();
                PlacementContoller.shipsPlaced += 1;
            }
        }
        if (PlacementContoller.shipsPlaced === 6) {
            this.gameMode = true;
        }
    }

    SubscribeEvents() {
        // subscribe to ripple gestures here;
    }

    MoveLeft() {      
        var item = this.gameMode === true ? "reticle" : "ship";  
        Global.Ripple.sendCommandToFrontScreen("moveLeft", item);
    }

    MoveRight() {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("moveLeft", item);
    }

    MoveUp() {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("moveLeft", item);
    }

    MoveDown() {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("moveLeft", item);
    }

    Damage() {
        // subscribe to a damage event from screen
    }

    Switch() {
        // subscribe to a switch event from screen
    }
}