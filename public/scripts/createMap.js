async function createMap() {
  var map = L.map("map").setView([46.521297, 6.632541], 13);
  map.zoomControl.setPosition("topright");

  var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  var processes = await getCollection("http://localhost:3000/processes");
  var meetings = await getCollection("http://localhost:3000/meetings");
  var proposals = await getCollection("http://localhost:3000/proposals");

  var processesLayerGroup = createLayerGroup(processes, createMarker);
  var meetingsLayerGroup = createLayerGroup(meetings, createMarker);
  var proposalsLayerGroup = createLayerGroup(proposals, createMarker);

  var areas = await getCollection("http://localhost:3000/areas");

  var areasLayerGroup = createLayerGroup(areas, createPolygon);

  var layerControl = L.control
    .layers(
      {},
      {
        processes: processesLayerGroup,
      },
      {
        position: "topleft",
      }
    )
    .addTo(map);

  var layerControl = L.control
    .layers(
      {},
      {
        meetings: meetingsLayerGroup,
      },
      {
        position: "topleft",
      }
    )
    .addTo(map);
  var layerControl = L.control
    .layers(
      {},
      {
        proposals: proposalsLayerGroup,
        areas: areasLayerGroup,
      },
      {
        collapsed: false,
        position: "topleft",
      }
    )
    .addTo(map);
}

createMap();
