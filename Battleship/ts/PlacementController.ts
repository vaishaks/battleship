interface IPlacementScope extends ng.IScope, IMessageScope, IHintScope {
    ships: Array<Ship>;    
}

class PlacementContoller {
    static $inject = ["scope"];

    constructor(private scope: IPlacementScope, private header: ITitleScope) {
        this.scope.ships = Global.ships;
        this.scope.message = "Get ready to face my wrath. Ready your fleet, scum of earth."; 
        this.scope.hint = "Step on a ship to select it";
        this.header.title = "Place your fleet";
    }
}