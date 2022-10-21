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