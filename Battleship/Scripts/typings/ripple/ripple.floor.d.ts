declare class RippleFloor {
    timer: Function;
    debugMode: boolean;
    setDebugMode(debugMode: boolean): Function;
    goToStart: Function;
    textToSpeech(text: string): Function;
    sendCommandToFrontScreen(commandName: string, commandParameters: string): Function;
    unlockSystem: Function;
    processRippleXMLCommand(data: any): Function;

    constructor(debugMode?: boolean);
}