interface IPlacementScope extends ng.IScope, IMessageScope, IHintScope {
    ships: Array<Ship>;
    Place: Function;
    Up: Function;
    Down: Function;
    Left: Function;
    Right: Function;
    Fire: Function;
}

class PlacementContoller {
    static $inject = ["$scope", "$rootScope", "$location"];
    static Location: ng.ILocationService;
    gameMode: boolean = true;
    isPlayerTurn: boolean = false;

    constructor(private scope: IPlacementScope, private header: ITitleScope, location: ng.ILocationService) {
        this.scope.ships = Global.ships;
        this.scope.message = "Ha ha ha. You're fleet isn't even organized. This is going to be so easy, puny human.";
        this.header.title = "Place your fleet";
        this.header.Exit = this.Quit;
        this.scope.Up = this.MoveUp;
        this.scope.Down = this.MoveDown;
        this.scope.Left = this.MoveLeft;
        this.scope.Right = this.MoveRight;
        this.scope.Fire = this.Fire;        
        document.addEventListener("switch", () => {
            this.isPlayerTurn = !this.isPlayerTurn;
            this.scope.ships = this.isPlayerTurn ? Global.ships : Global.aliens;
            this.scope.$apply();
        });
    }    

    MoveLeft() {      
        Global.Ripple.sendCommandToFrontScreen("left", "reticle-left");
    }

    MoveRight() {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("right", "reticle-right");
    }

    MoveUp() {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("up", "reticle-up");
    }

    MoveDown() {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("down", "reticle-down");
    }

    Fire() {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("fire", item);
    }

    Quit() {
        Global.Ripple.goToStart();
    }

    Damage() {
        // subscribe to a damage event from screen
    }    
}