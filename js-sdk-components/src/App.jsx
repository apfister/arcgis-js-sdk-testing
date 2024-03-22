/* eslint-disable no-unused-vars */
import {
  ArcgisMap,
  ArcgisSearch,
  ArcgisLegend,
  ArcgisSketch,
} from "@arcgis/map-components-react";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Sketch from "@arcgis/core/widgets/Sketch";
import * as geometryEngineAsync from "@arcgis/core/geometry/geometryEngineAsync.js";
import Graphic from "@arcgis/core/Graphic";
import { useRef, useState } from "react";

function App() {
  const sketchRef = useRef(null);
  const [featureLayer, setFeatureLayer] = useState(null);
  const [graphicsLayer, setGraphicsLayer] = useState(null);

  return (
    <>
      <ArcgisMap
        basemap="gray-vector"
        zoom={11}
        center={[-122.083, 37.3069]}
        onArcgisViewReadyChange={(event) => {
          // event.target is a MapView type
          console.log("MapView ready", event);

          const featureLayer = new FeatureLayer({
            portalItem: {
              id: "83c37666a059480bb8a7cb73f449ff52",
            },
            outFields: ["*"],
          });

          setFeatureLayer(featureLayer);

          event.target.map.add(featureLayer);

          const graphicsLayer = new GraphicsLayer({
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-fill",
                color: [227, 139, 79, 0.8],
                outline: {
                  color: [255, 255, 255],
                  width: 1,
                },
              },
            },
          });
          setGraphicsLayer(graphicsLayer);
          event.target.map.add(graphicsLayer);
        }}
      >
        <ArcgisLegend position="bottom-left"></ArcgisLegend>
        <ArcgisSketch
          creationMode="update"
          position="top-right"
          onSketchCreate={async (event) => {
            if (event.detail.state === "complete") {
              const query = featureLayer.createQuery();

              query.geometry = event.detail.graphic.geometry;

              const results = await featureLayer.queryFeatures(query);

              let geoms = [];
              for (let i = 0; i < results.features.length; i++) {
                const feature = results.features[i];
                geoms.push(feature.geometry);
              }

              const intResult = await geometryEngineAsync.intersect(
                geoms,
                event.detail.graphic.geometry
              );

              for (let i = 0; i < intResult.length; i++) {
                graphicsLayer.add(
                  new Graphic({
                    geometry: intResult[i],
                    symbol: {
                      type: "simple-fill",
                      color: [255, 0, 0, 0.8],
                      outline: {
                        color: [255, 255, 255],
                        width: 1,
                      },
                    },
                  })
                );
              }
            }
          }}
          onSketchUpdate={(event) => {
            console.log("update");
          }}
          onArcgisSketchReady={(event) => {
            console.log("sketch is ready");
          }}
        ></ArcgisSketch>
      </ArcgisMap>
    </>
  );
}

export default App;
