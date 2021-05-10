import "ol/ol.css";
import { useEffect, useRef, useState } from "react";

function RouteMap(props) {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [feature, setFeature] = useState(null);

  useEffect(() => {
    (async () => {
      const ol = await import("ol");
      const layer = await import("ol/layer");
      const source = await import("ol/source");
      const style = await import("ol/style");

      const raster = new layer.Tile({
        source: new source.OSM(),
      });

      const feature = new ol.Feature();
      const vector = new layer.Vector({
        source: new source.Vector({
          features: [feature],
        }),
        style: new style.Style({
          fill: new style.Fill({ color: "#FF0000", weight: 4 }),
          stroke: new style.Stroke({ color: "#FF0000", width: 2 }),
        }),
      });

      const map = new ol.Map({
        layers: [raster, vector],
        view: new ol.View({
          center: [-11000000, 6400000],
          zoom: 3.6,
        }),
      });
      map.setTarget(mapRef.current);
      setMap(map);
      setFeature(feature);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!feature) return;
      const geom = await import("ol/geom");
      const proj = await import("ol/proj");
      const locs = props.locations.map((c) => proj.fromLonLat(c));
      feature.setGeometry(new geom.LineString(locs));
    })();
  }, [feature, props.locations]);

  return <div ref={mapRef} style={{ height: 512 }}></div>;
}

export default RouteMap;
