interface IGameScope extends ng.IScope, IMessageScope, IHintScope {
    modes: Array<string>;
    Start: Function;
    Help: Function;
    Quit: Function;
    Mode: Function;
}

class GameController {
    static $inject = ["$scope", "$rootScope", "$location"];
    static location: ng.ILocationService;
    isStart: boolean = true;

    constructor(private scope: IGameScope, private header: ITitleScope, location: ng.ILocationService) {
        this.isStart = location.path() !== "/mode";
        if (this.isStart) {
            this.scope.message = "Get ready to face my wrath. Ready your fleet, scum of earth.";
            this.header.title = "Battleship";
            this.scope.Start = this.Start;
            this.scope.Help = this.Help;
            this.scope.Quit = this.Quit;
        }
        else {
            this.scope.message = "Hmmph. Want me to go easy on you?";
            this.header.title = "Mode Selection";
            this.scope.hint = "Step on a mode to select it";
            this.scope.Mode = this.Mode;
            RequestManager.getModes().then((modes) => {
                this.scope.modes = modes;
                this.scope.$apply();
            });
        }
        GameController.location = location;
    }

    Start() {
        GameController.location.path("mode");
    }

    Help() {
        GameController.location.path("help");
    }

    Quit() {
        Global.Ripple.goToStart();
    }

    Mode(mode: string) {
        Global.Ripple.sendCommandToFrontScreen("modeSelection", mode);
        GameController.location.path("place");
    }
}