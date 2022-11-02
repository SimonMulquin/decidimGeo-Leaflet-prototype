async function createMap() {
  var map = L.map("map", { center: [46.521297, 6.632541], zoom: 14 });
  map.zoomControl.setPosition("topright");

  var osm = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  var processes = await getCollection("http://localhost:3000/processes");
  createCollectionNestedControls(map, {
    label: "processes",
    collection: processes,
    subGroupsMatchers: {
      "Process group 1": process => process.processesGroupId == 1,
      "Process group 2": process => process.processesGroupId == 2,
    },
  });

  var meetings = await getCollection("http://localhost:3000/meetings");
  createCollectionNestedControls(map, {
    label: "meetings",
    collection: meetings,
    subGroupsMatchers: { related: meeting => true },
  });

  var proposals = await getCollection("http://localhost:3000/proposals");
  var proposalsLayerGroup = createLayerGroup(proposals, createMarker);
  createCollectionControl(map, {
    label: "proposals",
    layerGroup: proposalsLayerGroup,
  });

  var areas = await getCollection("http://localhost:3000/areas");
  var areasLayerGroup = createLayerGroup(areas, createPolygon);
  createCollectionControl(map, {
    label: "areas",
    layerGroup: areasLayerGroup,
  });
}

createMap();
