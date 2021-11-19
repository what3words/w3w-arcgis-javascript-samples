import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import * as locator from "@arcgis/core/rest/locator";
import Graphic from "@arcgis/core/Graphic";
import esriRequest from "@arcgis/core/request";

// Set up a locator task using the what3words Locator
esriRequest(
  // First get the token for the what3words Locator
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
    center: [-0.12463, 51.50074],
    zoom: 18,
    constraints: {
      snapToZoom: false
    }
  });
  view.popup.actions = [];
  view.popup.dockOptions = {
    breakpoint: false,
    buttonEnabled: false
  }

  const records =
    `1. ///clean.wider.both<br/>2. ///slam.pilots.castle<br/>3. ///fence.gross.bats<br/>4. ///slips.duke.flown<br/>5. ///native.crew.spoon<br/>6. ///grab.bucket.over<br/>7. ///tennis.rental.globe<br/>8. ///bend.mouse.assume<br/>9. ///trips.sleepy.forgot<br/>10. ///over.poems.shell`;

  // Display points of interest in top-right
  const div = document.createElement("div");
  div.setAttribute("class", "esri-widget panel");
  const code = document.createElement("pre");
  code.setAttribute("class", "addresses");
  code.innerHTML = records;
  div.appendChild(code);
  const button = document.createElement("button");
  button.setAttribute("class", "esri-button");
  button.innerHTML = "Geocode addresses";
  div.appendChild(button);
  const buttonClear = document.createElement("button");
  buttonClear.setAttribute("class", "esri-button");
  buttonClear.innerHTML = "Clear";
  div.appendChild(buttonClear);

  view.ui.add(div, "top-right");

  view.when(() => {
    geocodeAddresses();
  });

  // create url for using the what3words Locator to reverse geocode
  const locatorUrl =
    "https://arcgis.what3words.com/v2/arcgis/rest/services/what3words_EN_English/GeocodeServer?token=" +
    response.data.token;

  // const params = {
  //   "records": [{
  //     "attributes": {
  //       "OBJECTID": 1,
  //       "what3words": "filled.count.soap"
  //     }
  //   }, {
  //     "attributes": {
  //       "OBJECTID": 2,
  //       "what3words": "digits.return.object"
  //     }
  //   }, {
  //     "attributes": {
  //       "OBJECTID": 3,
  //       "what3words": "nature.undulation.busy"
  //     }
  //   }]
  // }
  
  const params = {
    addresses: [{
        OBJECTID: 1,
        what3words: "clean.wider.both",
      },
      {
        OBJECTID: 2,
        what3words: "slam.pilots.castle"
      },
      {
        OBJECTID: 3,
        what3words: "fence.gross.bats"
      },
      {
        OBJECTID: 4,
        what3words: "slips.duke.flown"
      },
      {
        OBJECTID: 5,
        what3words: "native.crew.spoon"
      },
      {
        OBJECTID: 6,
        what3words: "grab.bucket.over"
      },
      {
        OBJECTID: 7,
        what3words: "tennis.rental.globe"
      },
      {
        OBJECTID: 8,
        what3words: "bend.mouse.assume"
      },
      {
        OBJECTID: 9,
        what3words: "trips.sleepy.forgot"
      },
      {
        OBJECTID: 10,
        what3words: "over.poems.shell"
      },
    ],
  };

  button.addEventListener("click", geocodeAddresses);
  buttonClear.addEventListener("click", clearGraphics);

  // Convert incomplete address to complete address
  function geocodeAddresses() {
    view.graphics.removeAll();
    locator.addressesToLocations(locatorUrl, params).then(
      (result) => {
        if (result.length === 0) {
          return;
        }
        result.forEach((g) => {
          addGraphic(g);
        });
        // Sort
        const graphics = view.graphics.sort((a, b) => {
          return a.attributes.ResultID - b.attributes.ResultID;
        });
        // Zoom to addresses
        view
          .goTo({
            target: graphics,
            zoom: 11,
          })
          .then(() => {
            // Add graphics to popup and show first one
            view.popup.open({
              features: graphics.toArray(),
              updateLocationEnabled: true,
            });
          });
      },
      function (error) {
        console.log(error);
      }
    );
  }

  // Clear all Graphics on the maps canvas
  function clearGraphics() {
    view.graphics.removeAll();
    view.popup.close();
  }

  //Show results
  function addGraphic(result) {
    const markerSymbol = {
      type: "simple-marker",
      outline: {
        color: "white",
        width: 1.5
      },
      color: "red",
      size: "10px"
    };
    const graphic = new Graphic({
      geometry: result.location,
      symbol: markerSymbol,
      attributes: result.attributes,
      popupTemplate: {
        title: "W3W Address #" + result.attributes.ResultID,
        content: "///" + result.attributes.what3words +
          "<br><br>" +
          result.attributes.Addr_type +
          "<br>" +
          result.location.x.toFixed(5) +
          ", " +
          result.location.y.toFixed(5),
      },
    });
    view.graphics.add(graphic);
  }
});