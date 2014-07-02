declare class RippleScreen {
    timer: Function;
    debugMode: boolean;
    setDebugMode(debugMode: boolean): Function;
    sendCommandToFloor(commandName: string, commandParameters: string): Function;
    listenKeyBoardInput: boolean;
    keyboardListener: any;
    enableKeyboardInput(bool: boolean): Function;
    constructor(debugMode?: boolean);
}