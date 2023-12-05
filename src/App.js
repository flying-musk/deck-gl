import logo from "./logo.svg";
import "./App.css";
import NATIONAL_PARKS_DATA from "./data.json";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZmx5aW5nLW11c2siLCJhIjoiY2xwczdjemVuMDA5MzJpczB2MWI3cW9zbCJ9.z-ryCkd6XhC1602B554LYg";
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
