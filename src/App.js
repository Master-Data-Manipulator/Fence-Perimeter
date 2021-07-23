import React from "react";
import ReactMapboxGl from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { lineString, length } from "@turf/turf";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import * as MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "./styles.css";

const Map = ReactMapboxGl({
  maxZoom: 30,
  accessToken:
    "pk.eyJ1IjoiZGFpbWsiLCJhIjoiY2ttbmt2dzc2MXZ1bjJwcGZsZndoaGdkbiJ9.KzEXKpaGb0yYkV8Npdg65g",
});

const Geo = new MapboxGeocoder({
  accessToken:
    "pk.eyJ1IjoidXNlcjIxMjEiLCJhIjoiY2tyMnpvNXBqMmgwYjJ2cWgxajRpeGxueCJ9.CSlMn8_Gjg-iuBQBEo0zrg",
  zoom: 19,
  countries: "US",
});

export default function App() {
  const [perimeter, setPerimeter] = React.useState(0);
  const [zoom, setZoom] = React.useState(10);
  const [drawControlRef, setDrawControlRef] = React.useState(null);

  const onDrawCreate = ({ features }) => {
    setPerimeter(getDistance(features));
    setZoom(19);
    console.log(perimeter);
  };

  const getDistance = (features) => {
    var line = lineString(features[0].geometry.coordinates);
    let turfLength = length(line, { units: "miles" });
    return turfLength * 5280.0;
  };

  const onDrawUpdate = ({ features }) => {
    setPerimeter(getDistance(features));
    console.log(features);
  };

  const onMapLoad = (map) => {
    map.addControl(Geo);
  };

  return (
    <div className="container">
      <h2 className="perimeter">Perimeter in Feet: {perimeter}</h2>
      <Map
        zoom={[zoom]}
        center={[-90.079252, 30.376989]}
        onStyleLoad={onMapLoad}
        style="mapbox://styles/mapbox/satellite-v9" // eslint-disable-line
        containerStyle={{
          position: "absolute",
          top: 100,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <DrawControl
          ref={(drawControl) => {
            setDrawControlRef(drawControl);
          }}
          displayControlsDefault={false}
          controls={{ line_string: true, trash: true }}
          onDrawCreate={onDrawCreate}
          onDrawUpdate={onDrawUpdate}
          mode={"direct_select"}
          position={"bottom-left"}
        >
          {console.log(drawControlRef?.draw)}
        </DrawControl>
      </Map>
    </div>
  );
}
