async function getShapefile(area) {
  return await window
    .fetch(`/shapefiles/${area.shapefile}`)
    .then(response => response.arrayBuffer())
    .then(shp)
    .catch(alert);
}
