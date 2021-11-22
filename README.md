[![what3words](https://what3words.com/assets/images/w3w_square_red.png)](https://developer.what3words.com)
# what3words Locator for ArcGIS JavaScript API

A collection of resources for developers using the ArcGIS API for JavaScript to integrate what3words ArcGIS Locator.

There are multiple options for bringing the ArcGIS API for JavaScript into your app. The most common way is to use the AMD modules via ArcGIS CDN, however you can also use ES modules for local builds. The examples here will show how to integrate what3words ArcGIS locator to both the AMD modules via ArcGIS CDN and ES modules via npm. The advantage to use ES modules is that you can install the API locally for use with JavaScript frameworks such as React and Angular, and with module bundlers such as webpack.

## Table of Contents

* [Overview](#overview)
* [Prerequisites](#prerequisites)
* [Documentation](#documentation)
* [Usage](#usage)
* [Resources](#resources)
* [Contributing](#contributing)
* [Licensing](#licensing)


## Overview
In ArcGIS API for JavaScript the what3words ArcGIS Locator gives you programmatic accesss to:

* Convert a 3 word address to coordinates
* Convert coordinates to a 3 word address
* Autosuggest functionality which takes a slightly incorrect 3 word address, and suggests a list of valid 3 word addresses
* Batch geocode of a list of 3 word addresses 
* What3words locator can be added to the search bar widget
* Determine the currently support 3 word address languages

## Prerequisites

* If you are new to ArcGIS start [with the mapping APIs and location services guide](https://developers.arcgis.com/documentation/mapping-apis-and-services/);
* Get the what3words API key [HERE](https://developer.what3words.com/public-api).

## Documentation
Please check out our tutorial page [HERE](https://developer.what3words.com/tutorial/list).

## Usage
Both [AMD](./amd_w3w_arcgis_js) and [ES](./es_w3w_arcgis_js) modules have 4 JavaScript examples with instructions on how to get started.

## Resources
* [what3words API Key](https://developer.what3words.com/public-api)
* [What3words ArcGIS Locator](https://developer.what3words.com/tools/gis-extensions/arcgis) 
* [what3words Developer Tutorials](https://developer.what3words.com/tutorial/list)
* [ArcGIS API for JavaScript](https://developers.arcgis.com/documentation/mapping-apis-and-services/)
* [AMD modules via ArcGIS CDN](https://developers.arcgis.com/javascript/latest/install-and-set-up/)
* [Build with ES modules](https://developers.arcgis.com/javascript/latest/es-modules/)

## Issues
Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing
Anyone and everyone is welcome to contribute.

## Licensing
The MIT License (MIT)

A copy of the license is available in the repository's [license](LICENSE) file.