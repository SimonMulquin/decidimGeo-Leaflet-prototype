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
      if (subGroupsMatchers[subGroup](entity)) {
        if (subGroupsMarkers[subGroup]) {
          subGroupsMarkers[subGroup].push(marker);
        } else {
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
  var subControls = L.control.layers({}, subLayerGroups, {
    collapsed: false,
    position: "topleft",
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
      item.appendChild(input);

      var labelElement = L.DomUtil.create("span");
      labelElement.textContent += " " + label;
      item.appendChild(labelElement);

      var container = L.DomUtil.create(
        "div",
        "leaflet-control-layers-overlays"
      );
      container.appendChild(item);

      L.DomEvent.disableClickPropagation(input);
      input.addEventListener("change", event => {
        var layers = Object.values(allLayerGroup._layers);
        subControls._layerControlInputs.forEach(subInput => {
          subInput.dispatchEvent(
            new MouseEvent("click", {
              view: window,
              bubbles: false,
              cancelable: false,
            })
          );
        });
        for (var i = 0; i < layers.length; i++) {
          var layer = layers[i];
          if (event.target.checked) {
            map.addLayer(layer);
          } else if (map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        }
      });

      return container;
    },
  });

  map.addControl(new CustomControl());
  subControls.addTo(map);
}
