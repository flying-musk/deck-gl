import React, { useState } from "react";
import "./App.css";
import NATIONAL_PARKS_DATA from "./park-data.json";
import LINE_DATA from "./line-data.json";
import Map from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZmx5aW5nLW11c2siLCJhIjoiY2xwczdjemVuMDA5MzJpczB2MWI3cW9zbCJ9.z-ryCkd6XhC1602B554LYg";
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  longitude: -122.191311,
  latitude: 37.862619,
  zoom: 9.68,
  maxZoom: 20,
  bearing: 0,
  pitch: 0,
};
const MIN_DISPLAY_BART_ZOOM = 8;
function App() {
  const [nationalParksData, setNationalParksData] = useState(NATIONAL_PARKS_DATA);
  const parkLayer = new GeoJsonLayer({
    id: "nationalParks",
    data: nationalParksData,
    filled: true,
    pointRadiusMinPixels: 2.5,
    pointRadiusScale: 2000,
    getPointRadius: (f) => 2.5,
    getFillColor: (data) => (data.properties.searched ? [255, 165, 0, 250] : [86, 144, 58, 250]),
    autoHighlight: true,
    pickable: true,
  });
  const bartLayer = new GeoJsonLayer({
    id: "GeoJsonLayer",
    data: LINE_DATA,
    extruded: true,
    filled: true,
    getElevation: 30,
    getFillColor: [160, 160, 180, 200],
    getLineColor: (f) => {
      const hex = f.properties.color;
      return hex
        ? hex.match(/[0-9a-f]{2}/g).map((x) => parseInt(x, 16))
        : [0, 0, 0];
    },
    getLineWidth: 20,
    getPointRadius: 4,
    getText: (f) => f.properties.name,
    getTextSize: 12,
    lineWidthMinPixels: 2,
    pointRadiusUnits: "pixels",
    pointType: "circle+text",
    stroked: false,
    textLineHeight: 2,
    pickable: true,
  });
  const [layers, setLayers] = React.useState([]);
  
  const handleInputChange = (e) => {
    const searchedKeyword = e.target.value;

    const individualKeywords = searchedKeyword.toLowerCase().split(" ").filter(Boolean);

    setNationalParksData({
      ...NATIONAL_PARKS_DATA,
      features: NATIONAL_PARKS_DATA.features.map((feature) => {
        const parkName = feature.properties.Name.toLowerCase();
        const searched = individualKeywords.some((keyword) => parkName.includes(keyword));
        return {
          ...feature,
          properties: {
            ...feature.properties,
            searched: searched,
          },
        };
      }),
    });
  };

  const handleViewStateChange = (e) => {
    if (e.interactionState.isZooming) {
      if (e.viewState.zoom > MIN_DISPLAY_BART_ZOOM) {
        setLayers([parkLayer, bartLayer]);
      } else {
        setLayers([parkLayer]);
      }
    }
  };
  return (
    <>
      <div className="absolute z-[100] top-[0] left-[0] right-[0] bg-[white] border-b p-[16px] pb-[12px] flex flex-col gap-[12px]">
        <h1 className="font-bold text-[20px] leading-[110%]">Explore National Parks</h1>
        <p className="text-[#4B5563] text-[16px] leading-[110%] flex items-center gap-[4px]">
          <div>Zoom out to discover and learn about national parks across the country.</div>
          <div tabIndex="0" className="w-[16px] h-[16px] flex relative group/info cursor-pointer">
            <svg className="grow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
              <path
                d="M7.97 11.6C8.18 11.6 8.3576 11.5274 8.5028 11.3822C8.6476 11.2374 8.72 11.06 8.72 10.85C8.72 10.64 8.6476 10.4626 8.5028 10.3178C8.3576 10.1726 8.18 10.1 7.97 10.1C7.76 10.1 7.5824 10.1726 7.4372 10.3178C7.2924 10.4626 7.22 10.64 7.22 10.85C7.22 11.06 7.2924 11.2374 7.4372 11.3822C7.5824 11.5274 7.76 11.6 7.97 11.6ZM7.43 9.29H8.54C8.54 8.96 8.5776 8.7 8.6528 8.51C8.7276 8.32 8.94 8.06 9.29 7.73C9.55 7.47 9.755 7.2224 9.905 6.9872C10.055 6.7524 10.13 6.47 10.13 6.14C10.13 5.58 9.925 5.15 9.515 4.85C9.105 4.55 8.62 4.4 8.06 4.4C7.49 4.4 7.0276 4.55 6.6728 4.85C6.3176 5.15 6.07 5.51 5.93 5.93L6.92 6.32C6.97 6.14 7.0826 5.945 7.2578 5.735C7.4326 5.525 7.7 5.42 8.06 5.42C8.38 5.42 8.62 5.5074 8.78 5.6822C8.94 5.8574 9.02 6.05 9.02 6.26C9.02 6.46 8.96 6.6474 8.84 6.8222C8.72 6.9974 8.57 7.16 8.39 7.31C7.95 7.7 7.68 7.995 7.58 8.195C7.48 8.395 7.43 8.76 7.43 9.29V9.29ZM8 14C7.17 14 6.39 13.8424 5.66 13.5272C4.93 13.2124 4.295 12.785 3.755 12.245C3.215 11.705 2.7876 11.07 2.4728 10.34C2.1576 9.61 2 8.83 2 8C2 7.17 2.1576 6.39 2.4728 5.66C2.7876 4.93 3.215 4.295 3.755 3.755C4.295 3.215 4.93 2.7874 5.66 2.4722C6.39 2.1574 7.17 2 8 2C8.83 2 9.61 2.1574 10.34 2.4722C11.07 2.7874 11.705 3.215 12.245 3.755C12.785 4.295 13.2124 4.93 13.5272 5.66C13.8424 6.39 14 7.17 14 8C14 8.83 13.8424 9.61 13.5272 10.34C13.2124 11.07 12.785 11.705 12.245 12.245C11.705 12.785 11.07 13.2124 10.34 13.5272C9.61 13.8424 8.83 14 8 14ZM8 12.8C9.34 12.8 10.475 12.335 11.405 11.405C12.335 10.475 12.8 9.34 12.8 8C12.8 6.66 12.335 5.525 11.405 4.595C10.475 3.665 9.34 3.2 8 3.2C6.66 3.2 5.525 3.665 4.595 4.595C3.665 5.525 3.2 6.66 3.2 8C3.2 9.34 3.665 10.475 4.595 11.405C5.525 12.335 6.66 12.8 8 12.8Z"
                fill="#4B5563"
              ></path>
            </svg>
            <div className="invisible group-focus-within/info:visible absolute top-[100%] bg-[#ffffff] translate-x-[-47%] translate-y-[8px] rounded-[8px] p-[12px] shadow-[0px_0px_24px_0px_rgba(0,0,0,0.1)]">
              <ul className="list-disc pl-4 min-w-[286px] text-[12px]">
                <li>Green dots represent national parks.</li>
                <li>Zoom out to see all the parks across the US.</li>
                <li>Hover over a dot to see its name.</li>
                <li>Search for keywords to highlight specific parks.</li>
              </ul>
            </div>
          </div>
        </p>
        <input
          className="outline-none grow self-stretch border rounded p-[6px] text-[14px]"
          type="text"
          onChange={handleInputChange}
          placeholder="Search for keywords like 'Park', etc."
        />
      </div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        onViewStateChange={handleViewStateChange}
        onWebGLInitialized={() => {
          setLayers([parkLayer, bartLayer]);
        }}
        layers={[layers]}
        getTooltip={({ object }) =>
          object &&
          (object.properties.Name
            ? `${object.properties.Name} (${object.properties.Code})`
            : object.properties.name || object.properties.station)
        }
      >
        <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    </>
  );
}

export default App;
