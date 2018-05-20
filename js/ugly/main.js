let restaurants,neighborhoods,cuisines;var map,markers=[];document.addEventListener("DOMContentLoaded",e=>{navigator.serviceWorker&&(navigator.serviceWorker.register("sw.js"),console.log("sw registered")),DBHelper.fetchNeighborhoods().then(e=>fillNeighborhoodsHTML(e)),DBHelper.fetchCuisines().then(e=>fillCuisinesHTML(e))}),fillNeighborhoodsHTML=(e=>{self.neighborhoods=e;const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),fillCuisinesHTML=(e=>{self.cuisines=e;const t=document.getElementById("cuisines-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),window.initMap=(()=>{const e=document.getElementById("map");self.map=new google.maps.Map(e,{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1,title:"Google Maps"}),updateRestaurants()}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,s=t.selectedIndex,r=e[n].value,a=t[s].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(a,r).then(e=>resetRestaurants(e)).then(()=>fillRestaurantsHTML())}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e))}),DBHelper.lazyLoad(),addMarkersToMap()}),createRestaurantHTML=(e=>{const t=document.createElement("li"),n=document.createElement("img");n.className="restaurant-img",n.alt=`${e.name} - ${e.cuisine_type} cuisine in the ${e.neighborhood} Neighbourhood`,n.src=DBHelper.imageUrlForRestaurant(e),t.append(n);const s=document.createElement("h2");s.innerHTML=e.name,t.append(s);const r=document.createElement("p");r.innerHTML=e.neighborhood,t.append(r);const a=document.createElement("p");a.innerHTML=e.address,t.append(a);const o=document.createElement("a");return o.innerHTML="View Details",o.href=DBHelper.urlForRestaurant(e),t.append(o),t}),addMarkersToMap=((e=self.restaurants)=>{e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",()=>{window.location.href=t.url}),self.markers.push(t)})});