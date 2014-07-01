/// <reference path="_references.ts" />

module RequestManager {
    var serverUrl: string = "http://battleshipapi.azurewebsites.net/api/game/hard/play";

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

    export function getMoves(data: Array<IBoard>): JQueryDeferred<Array<IMoves>> {
        var deferred = $.Deferred<Array<IMoves>>();
        $.support.cors = true;
        $.ajax({
            url: serverUrl,
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