function createMarker(entity) {
 return L.marker(entity.location).bindPopup(
    `<h1>${entity.name}</h1> <a href="${entity.href}">View</a>`
  );
}

function createPolygon(entity) {
  return L.polygon(entity.polygon);
}

function createLayerGroup(collection, toLeafletElement) {
  var layerGroup = [];
  collection.forEach(entity => {
    layerGroup.push(toLeafletElement(entity));
  });
  return L.layerGroup(layerGroup);
}

async function getCollection(url) {
  var collection = await window
    .fetch(url)
    .then(response => response.json())
    .catch(alert);

  if (collection) {
    return collection;
  }
  return [];
}

async function createMap() {
  var map = L.map("map").setView([46.521297, 6.632541], 13);

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
        meetings: meetingsLayerGroup,
        proposals: proposalsLayerGroup,
        areas: areasLayerGroup,
      }
    )
    .addTo(map);
}

createMap();
