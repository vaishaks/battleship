var PlacementContoller = (function () {
    function PlacementContoller(scope, header) {
        this.scope = scope;
        this.header = header;
        this.scope.ships = Global.ships;
        this.scope.message = "Get ready to face my wrath. Ready your fleet, scum of earth.";
        this.scope.hint = "Step on a ship to select it";
        this.header.title = "Place your fleet";
    }
    PlacementContoller.$inject = ["scope"];
    return PlacementContoller;
})();
//# sourceMappingURL=PlacementController.js.map
