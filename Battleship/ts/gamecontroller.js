var GameController = (function () {
    function GameController(scope, header, location) {
        var _this = this;
        this.scope = scope;
        this.header = header;
        this.isStart = true;
        switch (location.path()) {
            case "/start":
                this.scope.message = "Get ready to face my wrath. Ready your fleet, scum of earth.";
                this.header.title = "Battleship";
                this.scope.Start = this.Start;
                this.scope.Credits = this.Credits;
                this.scope.Quit = this.Quit;
                break;

            case "/mode":
                this.scope.message = "Hmmph. Want me to go easy on you?";
                this.header.title = "Mode Selection";
                this.scope.hint = "Step on a mode to select it";
                this.scope.Mode = this.Mode;
                RequestManager.getModes().then(function (modes) {
                    _this.scope.modes = modes;
                    _this.scope.$apply();
                });
                break;

            case "/randomize":
                this.scope.message = "Muhahahaha.. Ready or not here I come";
                this.header.title = "Preparing game";
                this.scope.hint = "Randomize if required. Else stand on begin when ready";
                this.scope.Begin = this.Begin;
                break;
        }
        GameController.location = location;
    }
    GameController.prototype.Start = function () {
        GameController.location.path("mode");
    };

    GameController.prototype.Credits = function () {
        Global.Ripple.sendCommandToFrontScreen("credits", "");
    };

    GameController.prototype.Quit = function () {
        Global.Ripple.goToStart();
    };

    GameController.prototype.Begin = function () {
        Global.Ripple.sendCommandToFrontScreen("start", "");
        GameController.location.path("place");
    };

    GameController.prototype.Mode = function (mode) {
        Global.Ripple.sendCommandToFrontScreen("mode", mode);
        GameController.location.path("randomize");
    };
    GameController.$inject = ["$scope", "$rootScope", "$location"];
    return GameController;
})();
//# sourceMappingURL=GameController.js.map
