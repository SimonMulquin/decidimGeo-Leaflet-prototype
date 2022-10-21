function createCustomControl(
  map,
  { label, collection, subGroupsMatchers = {} }
) {
  var subGroups = Object.keys(subGroupsMatchers);

  var subGroupsMarkers = {};
  var allLayerGroup = createLayerGroup(collection, entity => {
    var marker = createMarker(entity);

    function matchSublayer(i = 0) {
      if (i >= subGroups.length) {
        return marker;
      }

      var subGroup = subGroups[i];
      console.log(subGroup);
      if (subGroupsMatchers[subGroup](entity)) {
        console.log(entity);
        if (subGroupsMarkers[subGroup]) {
          console.log("push");
          subGroupsMarkers[subGroup].push(marker);
        } else {
          console.log("init");
          subGroupsMarkers[subGroup] = [marker];
        }
        return marker;
      }

      return matchSublayer(++i);
    }

    return matchSublayer();
  });

  var subLayerGroups = {};
  subGroups.forEach(group => {
    subLayerGroups[group] = L.layerGroup(subGroupsMarkers[group]);
  });

  var CustomControl = L.Control.extend({
    options: {
      collapsed: false,
      position: "topleft",
    },

    onAdd: function (map) {
      var item = L.DomUtil.create("label");

      var input = L.DomUtil.create("input");
      input.type = "checkbox";
      input.checked = false;
      // Insert the input as child of container.
      item.appendChild(input);

      var labelElement = L.DomUtil.create("span");
      labelElement.textContent += " " + label;
      item.appendChild(labelElement);

      var container = L.DomUtil.create(
        "div",
        "leaflet-control-layers-overlays"
      );

      container.appendChild(item);

      return container;
    },
  });

  map.addControl(new CustomControl());
  L.control
    .layers({}, subLayerGroups, {
      collapsed: false,
      position: "topleft",
    })
    .addTo(map);
}
