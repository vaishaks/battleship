/// <reference path="_references.ts" />
module RequestManager {
    var baseUrl: string = "http://battleshipapi.azurewebsites.net/api/game/";
    var modesUrl: string = baseUrl + "/modes";
    var gameUrl: string = baseUrl + "/@mode/play";

    export interface IBoard {
        boatlength: number;
        x: number;
        y: number;
        isVertical: number;
    }

    export interface IMoves {
        x: number;
        y: number;
    }

    export function getMoves(mode: string, data: Array<IBoard>): JQueryDeferred<Array<IMoves>> {
        var deferred = $.Deferred<Array<IMoves>>();
        $.support.cors = true;
        $.ajax({
            url: gameUrl.replace("@mode", mode),
            type: 'POST',
            data: JSON.stringify(data),
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
            },
            dataType: 'json',
            success: (data: Array<IMoves>) => {
                deferred.resolve(data);
            },
            error: () => { deferred.reject(); }
        }).fail("request failed");
        return deferred;
    }
} 