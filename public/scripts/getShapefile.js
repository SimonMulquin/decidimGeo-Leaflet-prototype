async function getShapefile(area) {
  return await window
    .fetch(`/shapefiles/${area.shapefile}`)
    .then(response => response.blob())
    .then(JSZip.loadAsync)
    .then(console.log)
    .catch(alert);
}
