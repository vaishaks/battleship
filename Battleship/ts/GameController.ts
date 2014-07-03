interface IGameScope extends ng.IScope, IMessageScope, IHintScope {
    modes: Array<string>;
    Start: Function;
    Credits: Function;
    Quit: Function;
    Mode: Function;
    Begin: Function;
}

class GameController {
    static $inject = ["$scope", "$rootScope", "$location"];
    static location: ng.ILocationService;
    isStart: boolean = true;

    constructor(private scope: IGameScope, private header: ITitleScope, location: ng.ILocationService) {
        switch (location.path()) {
            case "/start": this.scope.message = "Get ready to face my wrath. Ready your fleet, scum of earth.";
                this.header.title = "Battleship";
                this.scope.Start = this.Start;
                this.scope.Credits = this.Credits;
                this.scope.Quit = this.Quit;
                break;

            case "/mode": this.scope.message = "Hmmph. Want me to go easy on you?";
                this.header.title = "Mode Selection";
                this.scope.hint = "Step on a mode to select it";
                this.scope.Mode = this.Mode;
                RequestManager.getModes().then((modes) => {
                    this.scope.modes = modes;
                    this.scope.$apply();
                });
                break;

            case "/randomize": this.scope.message = "Muhahahaha.. Ready or not here I come";
                this.header.title = "Preparing game";
                this.scope.hint = "Randomize if required. Else stand on begin when ready";
                this.scope.Begin = this.Begin;                                
                break;
        }
        GameController.location = location;
    }

    Start() {
        GameController.location.path("mode");
    }

    Credits() {
        Global.Ripple.sendCommandToFrontScreen("credits", "");
    }

    Quit() {
        Global.Ripple.goToStart();
    }

    Begin() {
        Global.Ripple.sendCommandToFrontScreen("start", "");
        GameController.location.path("place");
    }

    Mode(mode: string) {
        Global.Ripple.sendCommandToFrontScreen("mode", mode);
        GameController.location.path("randomize");
    }
}