var RequestManager;
(function (RequestManager) {
    var baseUrl = "http://battleshipapi.azurewebsites.net/api/game/";
    var modesUrl = baseUrl + "/modes";
    var gameUrl = baseUrl + "/@mode/play";

    function getModes() {
        $.support.cors = true;
        var xhr = $.getJSON(modesUrl);
        return xhr;
    }
    RequestManager.getModes = getModes;

    function getMoves(mode, data) {
        $.support.cors = true;
        var xhr = $.ajax({
            url: gameUrl.replace("@mode", mode),
            type: 'POST',
            data: JSON.stringify(data),
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            dataType: 'json'
        });
        return xhr;
    }
    RequestManager.getMoves = getMoves;
})(RequestManager || (RequestManager = {}));
