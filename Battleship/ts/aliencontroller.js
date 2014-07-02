var AlienController = (function () {
    function AlienController(scope, header) {
        this.scope = scope;
        this.header = header;
        this.scope.ships = Global.aliens;
        this.scope.message = "Get ready to face my wrath. Ready your fleet, scum of earth.";
        this.scope.hint = "Step on a ship to select it";
        this.header.title = "Attack Mode";
    }
    AlienController.$inject = ["$scope", "$rootScope"];
    return AlienController;
})();
//# sourceMappingURL=AlienController.js.map
