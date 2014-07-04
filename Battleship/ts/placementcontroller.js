var PlacementContoller = (function () {
    function PlacementContoller(scope, header, location) {
        var _this = this;
        this.scope = scope;
        this.header = header;
        this.gameMode = true;
        this.isPlayerTurn = false;
        this.scope.ships = Global.ships;
        this.scope.message = "Ha ha ha. You're fleet isn't even organized. This is going to be so easy, puny human.";
        this.header.title = "Place your fleet";
        this.header.Exit = this.Quit;
        this.scope.Up = this.MoveUp;
        this.scope.Down = this.MoveDown;
        this.scope.Left = this.MoveLeft;
        this.scope.Right = this.MoveRight;
        this.scope.Fire = this.Fire;
        document.addEventListener("switch", function () {
            _this.isPlayerTurn = !_this.isPlayerTurn;
            _this.scope.ships = _this.isPlayerTurn ? Global.ships : Global.aliens;
            _this.scope.$apply();
        });
    }
    PlacementContoller.prototype.MoveLeft = function () {
        Global.Ripple.sendCommandToFrontScreen("left", "reticle-left");
    };

    PlacementContoller.prototype.MoveRight = function () {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("right", "reticle-right");
    };

    PlacementContoller.prototype.MoveUp = function () {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("up", "reticle-up");
    };

    PlacementContoller.prototype.MoveDown = function () {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("down", "reticle-down");
    };

    PlacementContoller.prototype.Fire = function () {
        var item = this.gameMode === true ? "reticle" : "ship";
        Global.Ripple.sendCommandToFrontScreen("fire", item);
    };

    PlacementContoller.prototype.Quit = function () {
        Global.Ripple.goToStart();
    };

    PlacementContoller.prototype.Damage = function () {
        // subscribe to a damage event from screen
    };
    PlacementContoller.$inject = ["$scope", "$rootScope", "$location"];
    return PlacementContoller;
})();
//# sourceMappingURL=PlacementController.js.map
