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
  pitch: 30,
};

function App() {
  const handleInputChange = (e) => {
    const searchedKeyword = e.target.value;

    setNationalParksData({
      ...NATIONAL_PARKS_DATA,
      features: NATIONAL_PARKS_DATA.features.map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          searched: searchedKeyword !== "" && feature.properties.Name.toLowerCase().includes(searchedKeyword.toLowerCase()),
        },
      })),
    });
  };

  const [nationalParksData, setNationalParksData] = useState(NATIONAL_PARKS_DATA);

  const layers = [
    new GeoJsonLayer({
      id: "nationalParks",
      data: nationalParksData,
      filled: true,
      pointRadiusMinPixels: 3,
      pointRadiusScale: 2000,
      getPointRadius: (f) => 3,
      getFillColor: (data) => (data.properties.searched ? [100, 105, 155] : [86, 144, 58, 250]),
      autoHighlight: true,
      pickable: true,
    }),
    new GeoJsonLayer({
      id: "GeoJsonLayer",
      data: LINE_DATA,
      extruded: true,
      filled: true,
      getElevation: 30,
      getFillColor: [160, 160, 180, 200],
      getLineColor: (f) => {
        const hex = f.properties.color;
        return hex ? hex.match(/[0-9a-f]{2}/g).map((x) => parseInt(x, 16)) : [0, 0, 0];
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
    }),
  ];

  return (
    <>
      <div className="absolute z-[100] top-[0] left-[0] right-[0] bg-[white] border-b p-[16px] flex">
        <input className="grow" type="text" onChange={handleInputChange} placeholder="Search for keywords like 'Park', etc." />
      </div>
      <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers} getTooltip={({ object }) => object && (object.properties.Name ? `${object.properties.Name} (${object.properties.Code})` : object.properties.name || object.properties.station)}>
        <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    </>
  );
}

export default App;
