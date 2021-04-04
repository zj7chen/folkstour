import Login from "components/Login";
import { useState } from "react";
import Button from "react-bootstrap/Button";
// import Map from "ol/Map";
// import View from "ol/View";
// import Draw from "ol/interaction/Draw.js";

// import { Map, View } from "ol";
// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
// const { Map, View } = dynamic(() => import("ol"), { ssr: false });
// const TileLayer = dynamic(() => import("ol/layer/Tile"), { ssr: false });
// const OSM = dynamic(() => import("ol/source/OSM"), { ssr: false });
import "ol/ol.css";

function RouteMap(props) {
  const mapRef = useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    (async () => {
      const { Map, View } = await import("ol");
      const { Tile: TileLayer } = await import("ol/layer");
      const { OSM } = await import("ol/source");

      const raster = new TileLayer({
        source: new OSM(),
      });

      const map = new Map({
        layers: [raster],
        view: new View({
          center: [-11000000, 4600000],
          zoom: 4,
        }),
      });
      map.setTarget(mapRef.current);
      setMap(map);
    })();
  }, []);
  return <div ref={mapRef} style={{ height: 512 }}></div>;
}

export default RouteMap;
