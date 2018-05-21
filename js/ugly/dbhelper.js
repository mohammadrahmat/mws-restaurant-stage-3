class DBHelper{static get PORT(){return 1337}static get RESTAURANT_API(){return`http://localhost:${DBHelper.PORT}/restaurants`}static get RESTAURANT_REVIEWS_API(){return`http://localhost:${DBHelper.PORT}/reviews/?restaurant_id=${DBHelper.getParameterByName("id")}`}static get REVIEWS_API(){return`http://localhost:${DBHelper.PORT}/reviews/`}static get RESTAURANT_IDB_NAME(){return"RestaurantDB"}static get RESTAURANT_IDB_STORE_NAME(){return"RestaurantStore"}static get REVIEWS_IDB_NAME(){return"ReviewsDB"}static get REVIEWS_IDB_STORE_NAME(){return"ReviewsStore"}static getParameterByName(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const r=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null}static fetchRestaurants(){return navigator.onLine?fetch(DBHelper.RESTAURANT_API).then(e=>e.json()).then(e=>(DBHelper.createIDBStore(e,DBHelper.RESTAURANT_IDB_NAME,DBHelper.RESTAURANT_IDB_STORE_NAME),e)).catch(e=>console.error(`ERR_FETCHING_RESTAURANTS: ${e}`)):DBHelper.getCachedData(DBHelper.RESTAURANT_IDB_NAME,DBHelper.RESTAURANT_IDB_STORE_NAME).then(e=>e.json()).catch(e=>console.error(`ERR_FETCHING_RESTAURANTS_FROM_IDB: ${e}`))}static fetchRestaurantById(e){return DBHelper.fetchRestaurants().then(t=>t.find(t=>t.id==e)).then(e=>e).catch(e=>console.error(`ERR_FETCHING_RESTAURANT_BY_ID: ${e}`))}static fetchRestaurantByCuisine(e){return DBHelper.fetchRestaurants().then(t=>t.filter(t=>t.cuisine_type==e)).then(e=>e).catch(e=>console.error(`ERR_FETCHING_RESTAURANT_BY_CUISINE: ${e}`))}static fetchRestaurantByNeighborhood(e){return DBHelper.fetchRestaurants().then(t=>t.filter(t=>t.neighborhood==e)).then(e=>e).catch(e=>console.error(`ERR_FETCHING_RESTAURANT_BY_NEIGHBOURHOOD: ${e}`))}static fetchRestaurantByCuisineAndNeighborhood(e,t){return DBHelper.fetchRestaurants().then(r=>{let n=r;return"all"!=t&&(n=r.filter(e=>e.cuisine_type==t)),"all"!=e&&(n=r.filter(t=>t.neighborhood==e)),n}).catch(e=>console.error(`ERR_FETCHING_RESTAURANT_BY_CUISINE_NEIGHBOURHOOD: ${e}`))}static fetchReviews(){return navigator.onLine?fetch(DBHelper.REVIEWS_API).then(e=>e.json()).then(e=>(DBHelper.createIDBStore(e,DBHelper.REVIEWS_IDB_NAME,DBHelper.REVIEWS_IDB_STORE_NAME),e)).catch(e=>console.error(`ERR_FETCHING_ALL_REVIEWS: ${e}`)):DBHelper.getCachedData(DBHelper.REVIEWS_IDB_NAME,DBHelper.REVIEWS_IDB_STORE_NAME).then(e=>e.json).catch(e=>console.error(`ERR_FETCHING_REVIEWS_FROM_IDB: ${e}`))}static fetchReviewsByRestaurantId(e){return DBHelper.fetchReviews().then(t=>t.filter(t=>t.restaurant_id==e)).then(e=>e).catch(e=>console.error(`ERR_FETCH_REVIEWS_BY_RESTAURANT_ID: ${e}`))}static fetchNeighborhoods(){return DBHelper.fetchRestaurants().then(e=>{const t=e.map((t,r)=>e[r].neighborhood);return t.filter((e,r)=>t.indexOf(e)==r)}).catch(e=>console.error(`ERR_FETCHING_NEIGHBORHOODS: ${e}`))}static fetchCuisines(){return DBHelper.fetchRestaurants().then(e=>{const t=e.map((t,r)=>e[r].cuisine_type);return t.filter((e,r)=>t.indexOf(e)==r)}).catch(e=>console.error(`ERR_FETCHING_CUISINES: ${e}`))}static createIDBStore(e,t,r){let n=(window.indexedDB||window.mozIndexedDB||window.webkiteIndexedDB||window.msIndexedDB||window.shimIndexedDB).open(t,1);n.onupgradeneeded=function(){n.result.createObjectStore(r,{keyPath:"id"}).createIndex("by-id","id")},n.onerror=function(e){console.error(`IndexedDB error: ${e.target.errorCode}`)},n.onsuccess=function(){let t=n.result,o=t.transaction(r,"readwrite"),a=o.objectStore(r);a.index("by-id");e.forEach(e=>a.put(e)),o.oncomplete=function(){t.close()}}}static cacheObject(e,t,r){let n=(window.indexedDB||window.mozIndexedDB||window.webkiteIndexedDB||window.msIndexedDB||window.shimIndexedDB).open(t,1);n.onupgradeneeded=function(){n.result.createObjectStore(r,{keyPath:"id"}).createIndex("by-id","id")},n.onerror=function(e){console.error(`IndexedDB error: ${e.target.errorCode}`)},n.onsuccess=function(){let t=n.result,o=t.transaction(r,"readwrite"),a=o.objectStore(r);a.index("by-id");a.put(e),o.oncomplete=function(){t.close()}}}static getCachedData(e,t){return new Promise((r,n)=>{let o=(window.indexedDB||window.mozIndexedDB||window.webkiteIndexedDB||window.msIndexedDB||window.shimIndexedDB).open(e,1);o.onsuccess=(()=>{let e=o.result,n=e.transaction(t,"readwrite"),a=n.objectStore(t).getAll();a.onsuccess=(()=>{r(a.result)}),n.oncomplete=(()=>{e.close()})})})}static mapMarkerForRestaurant(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:DBHelper.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return void 0===e?"/img/rest_images/no_image.webp":`/img/rest_images/${e.photograph}.webp`}static lazyLoad(){"undefined"!=typeof LazyLoad&&new LazyLoad({elements_selector:".restaurant-img"})}static getRestaurantByIdApiUrl(e){return`http://localhost:${DBHelper.PORT}/restaurants/${e}`}static favoriteRestaurant(e,t){t||(t=!1),fetch(this.getRestaurantByIdApiUrl(e),{method:"put",body:JSON.stringify({is_favorite:!t})}).then(e=>e.json()).then(e=>{let t=document.getElementById(`${e.id}`);t.href=`javascript:DBHelper.favoriteRestaurant(${e.id}, ${e.is_favorite})`,t.innerHTML=e.is_favorite?"Remove Favorite":"Set Favorite",DBHelper.cacheObject(e,DBHelper.RESTAURANT_IDB_NAME,DBHelper.RESTAURANT_IDB_STORE_NAME)}).catch(e=>console.error(`ERROR_UPDATING_FAVOURITE_RESTAURANT: ${e}`))}static postReview(e,t){fetch(DBHelper.REVIEWS_API,{method:"post",body:JSON.stringify({name:e.name,rating:e.rating,comments:e.comments,restaurant_id:t})}).then(e=>e.json()).then(e=>DBHelper.cacheObject(e.review,DBHelper.REVIEWS_IDB_NAME,DBHelper.REVIEWS_IDB_STORE_NAME)).catch(e=>console.error(`ERROR_POSTING_REVIEW: ${e}`))}}