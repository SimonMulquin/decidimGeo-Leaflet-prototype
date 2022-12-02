async function createMap() {
  var map = L.map("map", { center: [46.521297, 6.632541], zoom: 14 });
  map.zoomControl.setPosition("topright");

  var osm = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
  ).addTo(map);

  var {
    data: { participatoryProcesses },
  } = await getDecidimData(participatoryProcessesQuery);
  await createNestedControls(map, {
    label: "processes",
    data: participatoryProcesses,
    getSubGroupName: ({ title: { translation } }) => translation,
    getNodes: getParticipatoryProcessesNodes,
    formatMarkerDataReducers: {
      description: ({ description: { translation } }) => translation,
      location: ({ coordinates: { latitude, longitude } }) => {
        if (latitude && longitude) return [latitude, longitude];
      },
      href: () => "/test",
    },
  });

  var meetings = await getCollection("http://localhost:3000/meetings");
  await createCollectionNestedControls(map, {
    label: "meetings",
    collection: meetings,
    subGroupsMatchers: { related: meeting => true },
  });

  var proposals = await getCollection("http://localhost:3000/proposals");
  var proposalsLayerGroup = await createLayerGroup(proposals, e => [
    createMarker(e),
  ]);
  createCollectionControl(map, {
    label: "proposals",
    layerGroup: proposalsLayerGroup,
  });

  var areas = await getCollection("http://localhost:3000/areas");
  var areasLayerGroup = await createLayerGroup(areas, async e => {
    const geojsonFeature = await getShapefile(e);
    return [L.geoJSON(geojsonFeature)];
  });
  createCollectionControl(map, {
    label: "areas",
    layerGroup: areasLayerGroup,
  });
}

createMap();
