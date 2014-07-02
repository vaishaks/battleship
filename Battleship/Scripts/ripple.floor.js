var _DefaultDebugMode = false;
var ripple = null;
var rippleHelper = new RippleFloor();

function RippleFloor(debugMode) {
    if (ripple == null) {
        rippleHelper = new Object();
        rippleHelper.timer = initializeTimer;
        rippleHelper.debugMode = debugMode || _DefaultDebugMode;
        rippleHelper.setDebugMode = function (debugMode) {
            rippleHelper.debugMode = debugMode;
        }
        rippleHelper.goToStart = function () {
            executeExternalCommand("exitGame", "");
        }
        rippleHelper.textToSpeech = function (text) {
            executeExternalCommand("playAudio", text);
        }
        rippleHelper.sendCommandToFrontScreen = sendMessageToFrontScreen;

        rippleHelper.unlockSystem = function () {
            executeExternalCommand("unlockSystem", "");
        }
        rippleHelper.processRippleXMLCommand = function (data) {
            executeExternalCommand("sendCommandForScreenProcessing", data);
        }
        ripple = rippleHelper;
    }
        return ripple;
    
}

function gestureReceived(gestureName) {
    var evt = document.createEvent("Event");
    evt.initEvent(gestureName, true, false);
    document.dispatchEvent(evt);
}

function executeCommandFromScreen(commandParameters) {
    var parameters = commandParameters.split(",");
    var commandName = parameters[0];
    var evt = document.createEvent("Event");
    evt.initEvent(commandName, true, false);
    parameters.shift();
    evt.commandParameters = parameters;
    document.dispatchEvent(evt);
  
}

function executeExternalCommand(commandName, commandParametersCSV) {
    if (ripple.debugMode) {
        console.log("DEBUG MODE IS ON, Command "+commandName+" with Parameters " + commandParametersCSV + " will be executed");
    }
    else {
        window.external.executeCommand(commandName, commandParametersCSV);
    }
}

function sendMessageToFrontScreen(commandName, commandParameters) {

    var commandParametersCSV = "";
    for (i = 0; i < commandParameters.length; ++i) {
        commandParametersCSV = commandParametersCSV.concat(",", commandParameters[i]);
    }

    commandParametersCSV = commandName.concat(commandParametersCSV);
    executeExternalCommand("sendCommandToFrontScreen", commandParametersCSV);
}

function initializeTimer() {
    var timer = new Object();
    timer.actualObject = null;
    timer.value = 1;
    timer.running = false;
    timer.startTimer = function () {
        timer.running = true;
        timer.value = 1;
        timer.actualObject = setInterval(function () { timer.value += 1 }, 1000)
    }
    timer.stopTimer = function () {
        clearInterval(timer.actualObject);
        timer.actualObject = null;
        timer.running = false;
    }
    timer.getTime = function () {
        return timer.value;
    }
    return timer;
}