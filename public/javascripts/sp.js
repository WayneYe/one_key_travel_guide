$(function() {
    var evtSrc = new EventSource("io");

    evtSrc.addEventListener("message", function (e) {
        console.log("Retrieving search result from SSE server...");
        console.log(e.data);
    },false);

    evtSrc.addEventListener("open", function (e) {
        console.log("Server Side Event subscribed! URL: " + e.target.URL);
    },false);

    evtSrc.addEventListener("error", function (e) {
        var statusStr = "";
        switch (e.eventPhase) {
            case 0:
                statusStr = "CONNECTING";
            case 1:
                statusStr = "OPEN";
            case 2:
                statusStr = "CLOSED";
        }

        console.log("Error occured! Status: " + statusStr);
        console.log(e);
    },false);
});
