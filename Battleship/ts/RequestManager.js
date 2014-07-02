/// <reference path="_references.ts" />
var RequestManager;
(function (RequestManager) {
    var baseUrl = "http://battleshipapi.azurewebsites.net/api/game/";
    var modesUrl = baseUrl + "/modes";
    var gameUrl = baseUrl + "/@mode/play";

    function getMoves(mode, data) {
        var deferred = $.Deferred();
        $.support.cors = true;
        $.ajax({
            url: gameUrl.replace("@mode", mode),
            type: 'POST',
            data: JSON.stringify(data),
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            dataType: 'json',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function () {
                deferred.reject();
            }
        }).fail("request failed");
        return deferred;
    }
    RequestManager.getMoves = getMoves;
})(RequestManager || (RequestManager = {}));
//# sourceMappingURL=RequestManager.js.map
