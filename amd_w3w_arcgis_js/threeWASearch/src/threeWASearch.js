require([
    "esri/Map",
    "esri/views/MapView",
    "esri/request",
    "esri/widgets/Search"
  ], (Map, MapView, esriRequest, Search) => {
    // Set up a locator task using the what3words locator
    const w3wLocator = esriRequest(
      // First get the token for the what3words locator
      "https://arcgis.what3words.com/v2/arcgis/tokens",
      {
        method: "get",
        query: {
          f: "json",
          username: "YOUR-W3W-EMAIL-ADDRESS",
          password: "YOUR-W3W-API-KEY",
          expiration: 10
        }
      }
    ).then((response) => {
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
      // create url for using the what3words locator to reverse geocode
      const locatorUrl =
        "https://arcgis.what3words.com/v2/arcgis/rest/services/what3words_EN_English/GeocodeServer?token=" +
        response.data.token;
      // Add what3words geocoder to the search bar
      // N.B. The ArcGIS locator needs to be shared among the organisation
      const searchWidget = new Search({
        view: view,
        sources: [
          {
            name: "what3words",
            placeholder: "Please enter a what3words address",
            singleLineFieldName: "SingleLine",
            locator: locatorUrl
          }
        ]
      });
      view.ui.add(searchWidget, {
        position: "top-right"
      });
    });
  });