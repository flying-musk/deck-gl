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
      pointRadiusMinPixels: 2.5,
      pointRadiusScale: 2000,
      getPointRadius: (f) => 2.5,
      getFillColor: (data) => (data.properties.searched ? [255, 165, 0, 250] : [86, 144, 58, 250]),
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
      <div className="absolute z-[100] top-[0] left-[0] right-[0] bg-[white] border-b p-[16px] flex flex-col gap-[12px]">
        <h1 className="!m-0 text-2xl font-bold mb-4">Explore National Parks</h1>
        <p className="!m-0 text-gray-600 mb-4">
          <div>Discover and learn about national parks across the country.</div>
          <ul className="list-disc pl-4 text-sm text-gray-500">
            <li>Green dots represent national parks.</li>
            <li>Zoom out to see all the parks across the US.</li>
            <li>Hover over a dot to see its name.</li>
            <li>Search for keywords to highlight specific parks.</li>
          </ul>
        </p>
        <input className="!m-0 outline-none grow self-stretch mb-4 p-2 border rounded" type="text" onChange={handleInputChange} placeholder="Search for keywords like 'Park', etc." />
      </div>
      <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers} getTooltip={({ object }) => object && (object.properties.Name ? `${object.properties.Name} (${object.properties.Code})` : object.properties.name || object.properties.station)}>
        <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    </>
  );
}

export default App;
