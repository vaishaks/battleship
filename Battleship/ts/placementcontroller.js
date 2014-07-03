var PlacementContoller = (function () {
    function PlacementContoller(scope, header, location) {
        this.scope = scope;
        this.header = header;
        this.gameMode = false;
        this.scope.ships = Global.ships;
        this.scope.message = "Ha ha ha. You're fleet isn't even organized. This is going to be so easy, puny human.";
        this.header.title = "Place your fleet";
        this.SubscribeEvents();
    }
    PlacementContoller.prototype.SubscribeEvents = function () {
        // subscribe to ripple gestures here;
    };

    PlacementContoller.prototype.MoveLeft = function () {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("moveLeft", item);
    };

    PlacementContoller.prototype.MoveRight = function () {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("moveLeft", item);
    };

    PlacementContoller.prototype.MoveUp = function () {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("moveLeft", item);
    };

    PlacementContoller.prototype.MoveDown = function () {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("moveLeft", item);
    };

    PlacementContoller.prototype.Damage = function () {
        // subscribe to a damage event from screen
    };

    PlacementContoller.prototype.Switch = function () {
        // subscribe to a switch event from screen
    };
    PlacementContoller.$inject = ["$scope", "$rootScope", "$location"];
    return PlacementContoller;
})();
//# sourceMappingURL=PlacementController.js.map
