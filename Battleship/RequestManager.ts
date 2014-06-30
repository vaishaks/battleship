/// <reference path="scripts/typings/jquery/jquery.d.ts" />

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
                "Accept": 'application/json',   //If your header name has spaces or any other char not appropriate
                "Content-Type": 'application/json',  //for object property name, use quoted notation shown in second
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