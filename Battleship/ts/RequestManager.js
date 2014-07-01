/// <reference path="_references.ts" />
var RequestManager;
(function (RequestManager) {
    var serverUrl = "http://battleshipapi.azurewebsites.net/api/game/hard/play";

    function getMoves(data) {
        var deferred = $.Deferred();
        $.support.cors = true;
        $.ajax({
            url: serverUrl,
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
