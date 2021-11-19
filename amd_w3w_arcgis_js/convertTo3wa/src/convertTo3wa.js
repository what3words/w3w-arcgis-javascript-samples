require([
    "esri/rest/locator",
    "esri/Map",
    "esri/views/MapView",
    "esri/request",
    "esri/Graphic"
], function (locator, Map, MapView, esriRequest, Graphic) {
    // Set up a locator task using the world geocoding service
    const w3wLocator = esriRequest(
        // First get the token for the what3words Locator
        "https://arcgis.what3words.com/v2/arcgis/tokens", {
            method: "get",
            query: {
                f: "json",
                username: "YOUR-W3W-EMAIL-ADDRESS", // YOUR-W3W-EMAIL-ADDRESS
                password: "YOUR-W3W-API-KEY", // YOUR-W3W-API-KEY
                expiration: 10
            }
        }
    ).then((response) => {
        // create url for using the what3words Locator to reverse geocode
        const locatorUrl =
            "https://arcgis.what3words.com/v2/arcgis/rest/services/what3words_EN_English/GeocodeServer?token=" +
            response.data.token;

        // Create the Map
        const map = new Map({
            basemap: "streets-navigation-vector"
        });

        // Create the MapView
        const view = new MapView({
            container: "viewDiv",
            map: map,
            center: [-0.195521, 51.520847],
            zoom: 18
        });

        /*******************************************************************
         * This click event sets generic content on the popup not tied to
         * a layer, graphic, or popupTemplate. The location of the point is
         * used as input to a reverse geocode method and the resulting
         * address is printed to the popup content.
         *******************************************************************/
        view.popup.autoOpenEnabled = false;

        function convertTo3WordAddress(params, graphic) {
            locator
                .locationToAddress(locatorUrl, params)
                .then((response) => {
                    // If an address is successfully found, show it in the popup's content
                    view.popup.content =
                        "what3words address: ///" + response.address;
                    view.graphics.add(graphic)
                })
                .catch((error) => {
                    // console.log("error: " + error)
                    // If the promise fails and no result is found, show a generic message
                    view.popup.content = "No address was found for this location";
                    view.graphics.removeAll()
                });
        }
        // Now we set up handler
        view.on("click", (event) => {
            view.graphics.removeAll()
            // Get the coordinates of the click on the view
            const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
            const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
            view.popup.open({
                // Set the popup's title to the coordinates of the location
                title: "Reverse geocode: [" + lon + ", " + lat + "]",
                location: event
                    .mapPoint // Set the location of the popup to the clicked location
            });
            // create a point for the location to send off to Locator
            let point = {
                type: "point",
                longitude: lon,
                latitude: lat
            };
            let params = {
                location: point
            };
            // create point marker on the mapEvent
            let graphic = new Graphic({
                geometry: event.mapPoint,
                symbol: {
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    color: "blue",
                    size: 8,
                }
            });
            convertTo3WordAddress(params, graphic)
        });
    });
});