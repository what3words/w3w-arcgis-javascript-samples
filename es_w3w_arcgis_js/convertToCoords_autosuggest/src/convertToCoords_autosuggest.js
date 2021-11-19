import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import * as locator from "@arcgis/core/rest/locator"
import Graphic from "@arcgis/core/Graphic";
import esriRequest from "@arcgis/core/request";


// Set up a locator task using the what3words Locator
const w3wLocator = esriRequest(
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
  // create url for using the what3words Locator to reverse geocode
  const locatorUrl =
    "https://arcgis.what3words.com/v2/arcgis/rest/services/what3words_EN_English/GeocodeServer?token=" +
    response.data.token;

  const c2cButton = document.getElementById(
    "convertToCoordinateButton"
  );
  const searchInput = document.getElementById("search");
  const btnGroup = document.getElementById("aBtnGroup");

  function clearSuggestBtnGroupPopup() {
    btnGroup.innerHTML = "";
  }

  function suggestBtnGroupPopup(suggestions, btnGroup) {
    for (const i in suggestions) {
      let suggestItem = document.createElement("button");
      suggestItem.setAttribute("id", "suggestButton" + i);
      let suggestText = document.createTextNode("///" + suggestions[i]);
      suggestItem.appendChild(suggestText);
      btnGroup.appendChild(suggestItem);
    }
  }

  function suggestBtnGroupErrorPopup(error) {
    let suggestItemError = document.createElement("button");
    if (error.name == "request:server") {
      suggestItemError.innerHTML =
        "Please make sure you enter correctly<br/>your what3words credentials";
    } else {
      suggestItemError.innerHTML =
        "Please enter a valid w3w address<br/>or make sure you enter correctly<br/>your what3words credentials";
    }
    suggestItemError.style.background = "blue";
    suggestItemError.style.color = "white";
    btnGroup.appendChild(suggestItemError);
  }

  function suggestLocations() {
    // Execute a suggest locations using the what3words Locator
    const params = {
      text: searchInput.value
    };
    locator
      .suggestLocations(locatorUrl, params)
      .then((response) => {
        // console.log("locatorTask suggest: " + JSON.stringify(response));
        // If an address is successfully found, show it in the popup's content
        // const responseJSON = JSON.stringify(response);
        const suggestions = [
          response[0].text,
          response[1].text,
          response[2].text
        ];
        suggestBtnGroupPopup(suggestions, btnGroup);
      })
      .catch((error) => {
        // If the promise fails and no result is found, show a generic message
        clearSuggestBtnGroupPopup();
        suggestBtnGroupErrorPopup(error);
      });
  }

  searchInput.addEventListener("keyup", (event) => {
    clearSuggestBtnGroupPopup();
    suggestLocations();
    // Number 13 is the "Enter" key on the keyboard
    if (event.key === 13) {
      event.preventDefault();
      // Trigger the covert To Coordinate button element with a click
      c2cButton.click();
    }
  });

  function updateSearchInputText(target) {
    searchInput.value = target.innerHTML;
  }

  function convertToCoordinates() {
    view.graphics.removeAll();
    // Execute a foward geocode using the what3words Locator
    const address = {
      what3words: searchInput.value
    };
    const params = {
      address: address
    };
    locator
      .addressToLocations(locatorUrl, params)
      .then((response) => {
        console.log("locatorTask c2c: " + JSON.stringify(response));
        // If an address is successfully found, show it in the popup's content
        const responseaddress = response[0].address; // address
        const lat = response[0].location.y; // Y COORDINATE
        const lon = response[0].location.x; // X COORDINATE
        const point = {
          type: "point",
          longitude: lon,
          latitude: lat
        };
        // create a point marker
        let graphic = new Graphic({
          geometry: point,
          symbol: {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: "blue",
            size: 8
          }
        });
        view.graphics.add(graphic);
        view.center = point;
        view.zoom = 17;
        view.popup.autoOpenEnabled = false;
        view.popup.open({
          // Set the popup's title to the coordinates of the location
          title: "W3W CovertToCoordinates",
          location: point, // Set the location of the popup to the clicked location
          content: "what3words address: " +
            responseaddress +
            "</br>Coordinates: " +
            lat +
            ", " +
            lon
        });
      })
      .catch((error) => {
        // If the promise fails and no result is found, show a generic message
        clearSuggestBtnGroupPopup();
        suggestBtnGroupErrorPopup(error);
        view.popup.close();
        view.graphics.removeAll();
      });
  }

  btnGroup.addEventListener("click", (event) => {
    let target = event.target;
    switch (target.id) {
      case target.id:
        updateSearchInputText(target);
        convertToCoordinates();
        clearSuggestBtnGroupPopup();
        break;
    }
  });

  c2cButton.addEventListener("click", (event) => {
    convertToCoordinates();
  });
});