var GameController = (function () {
    function GameController(scope, header, location) {
        var _this = this;
        this.scope = scope;
        this.header = header;
        this.isStart = true;
        this.isStart = location.path() !== "/mode";
        if (this.isStart) {
            this.scope.message = "Get ready to face my wrath. Ready your fleet, scum of earth.";
            this.header.title = "Battleship";
            this.scope.Start = this.Start;
            this.scope.Help = this.Help;
            this.scope.Quit = this.Quit;
        } else {
            this.scope.message = "Hmmph. Want me to go easy on you?";
            this.header.title = "Mode Selection";
            this.scope.hint = "Step on a mode to select it";
            this.scope.Mode = this.Mode;
            RequestManager.getModes().then(function (modes) {
                _this.scope.modes = modes;
                _this.scope.$apply();
            });
        }
        GameController.location = location;
    }
    GameController.prototype.Start = function () {
        GameController.location.path("mode");
    };

    GameController.prototype.Help = function () {
        GameController.location.path("help");
    };

    GameController.prototype.Quit = function () {
        Global.Ripple.goToStart();
    };

    GameController.prototype.Mode = function (mode) {
        Global.Ripple.sendCommandToFrontScreen("modeSelection", mode);
        GameController.location.path("place");
    };
    GameController.$inject = ["$scope", "$rootScope", "$location"];
    return GameController;
})();
//# sourceMappingURL=GameController.js.map
