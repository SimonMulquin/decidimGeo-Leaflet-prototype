function createMarker({ description, location, href }) {
  return L.marker(location).bindPopup(
    `<h1>${description}</h1> <a href="${href}">View</a>`
  );
}

function getParticipatoryProcessesNodes(participatoryProcess) {
  var components = participatoryProcess.components;
  if (components && components.length > 0) {
    var meetingsComponent = components.find(
      ({ meetings }) => meetings && meetings.nodes.length > 0
    );

    if (meetingsComponent) {
      return meetingsComponent.meetings.nodes;
    }
  }
  return [];
}

async function createLayerGroup(collection, createEntityMarkers) {
  var layerGroup = [];
  await Promise.all(
    collection.map(async entity => {
      var markers = await createEntityMarkers(entity);
      if (markers.length > 0) {
        markers.forEach(marker => layerGroup.push(marker));
      }
      return;
    })
  );
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

async function getDecidimData(query, url) {
  var collection = await window
    .fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
    .then(response => response.json())
    .catch(alert);

    console.log({collection})

  if (collection) {
    return collection;
  }
  return [];
}

function createParentControlInputelement({ label, changeEventHandler }) {
  var item = L.DomUtil.create("label");

  var input = L.DomUtil.create("input");
  input.type = "checkbox";
  input.checked = false;
  item.appendChild(input);

  var labelElement = L.DomUtil.create("span");
  labelElement.textContent += " " + label;
  item.appendChild(labelElement);

  var container = L.DomUtil.create("div", "decidimGeo__customControl__parent");
  container.appendChild(item);

  L.DomEvent.disableClickPropagation(input);
  input.addEventListener("change", changeEventHandler);
  return container;
}
