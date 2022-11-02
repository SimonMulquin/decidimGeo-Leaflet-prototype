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

function createParentControlInputelement({label, changeEventHandler}) {
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
