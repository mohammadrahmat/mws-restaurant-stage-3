"use-strict";let restaurant;var map;window.addEventListener("DOMContentLoaded",e=>{navigator.serviceWorker&&navigator.serviceWorker.register("sw.js").then(e=>console.log(`sw registered, scope: ${e.scope}`)).catch(e=>console.error(`ERROR_REGISTERING_SW: ${e}`)),navigator.onLine||DBHelper.fetchRestaurantById(DBHelper.getParameterByName("id")).then(e=>initMap(e))}),window.addEventListener("load",e=>{connectionStatusHandler=(e=>{const t=document.getElementById("offline-status-box");navigator.onLine?(t.style.display="none",document.getElementById("offline-status").innerHTML="Online :)",DBHelper.postCachedReviews()):(t.style.display="block",document.getElementById("offline-status").innerHTML="Seems like you are offline. Some data might not be latest.")}),window.addEventListener("online",connectionStatusHandler),window.addEventListener("offline",connectionStatusHandler)}),initMap=(e=>{self.restaurant=e,navigator.onLine&&(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:self.restaurant.latlng,scrollwheel:!1}),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map)),fillBreadcrumb(),fillRestaurantHTML()}),window.renderPage=(()=>{self.restaurant||DBHelper.fetchRestaurantById(DBHelper.getParameterByName("id")).then(e=>initMap(e))}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.className="restaurant-img",t.alt=`${e.name} - ${e.cuisine_type} cuisine in the ${e.neighborhood} Neighbourhood`,t.src=DBHelper.imageUrlForRestaurant(e),document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),DBHelper.fetchReviewsByRestaurantId(self.restaurant.id).then(e=>setReviews(e))}),setReviews=(e=>{self.restaurant.reviews=e,fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),a=document.createElement("td");a.innerHTML=n,r.appendChild(a);const s=document.createElement("td");s.innerHTML=e[n],r.appendChild(s),t.appendChild(r)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container");if(!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const n=document.getElementById("reviews-list");e.forEach(e=>{n.appendChild(createReviewHTML(e))}),t.appendChild(n)}),addReviewHTML=((e,t=self.restaurant.reviews)=>{const n=document.getElementById("reviews-container"),r=document.getElementById("reviews-list");r.prepend(createReviewHTML(e)),n.append(r)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("h4");n.innerHTML=e.name,t.appendChild(n);const r=document.createElement("p");r.innerHTML=new Date(e.createdAt),t.appendChild(r);const a=document.createElement("p");a.innerHTML=`Rating: ${e.rating}`,t.appendChild(a);const s=document.createElement("p");return s.innerHTML=e.comments,t.appendChild(s),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,t.appendChild(n)}),reviewFormHandler=((e=self.restaurant)=>{const t={name:document.getElementById("username").value,rating:parseInt(document.getElementById("rating").value),comments:document.getElementById("comment").value,createdAt:+new Date,updatedAt:+new Date,restaurant_id:e.id};addReviewHTML(t),navigator.onLine?DBHelper.postReview(t).then(e=>{e?(document.getElementById("form-legend").innerHTML="Your Review Has Been Saved, Thank You For Sharing Your Thoughts.",document.getElementById("reviews-form").reset()):document.getElementById("form-legend").innerHTML="An Unexpected Error Occured, Please Try Again Later."}).catch(e=>console.error(`ERROR_SAVING_REVIEW: ${e}`)):DBHelper.cacheObject(t,DBHelper.REVIEWS_OFFLINE_IDB_NAME,DBHelper.REVIEWS_OFFLINE_STORE_NAME)});