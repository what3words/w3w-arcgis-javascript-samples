import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Search from "@arcgis/core/widgets/Search";

import esriRequest from "@arcgis/core/request";

// Set up a locator task using the what3words locator
esriRequest(
  // First get the token for the what3words locator
  "https://arcgis.what3words.com/v2/arcgis/tokens", {
    method: "get",
    query: {
      f: "json",
      username: process.env.YOUR_W3W_EMAIL_ADDRESS, // YOUR-W3W-EMAIL-ADDRESS
      password: process.env.YOUR_W3W_API_KEY, // YOUR-W3W-API-KEY
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
    sources: [{
      name: "what3words",
      placeholder: "Please enter a what3words address",
      singleLineFieldName: "SingleLine",
      locator: locatorUrl
    }]
  });
  view.ui.add(searchWidget, {
    position: "top-right"
  });
});