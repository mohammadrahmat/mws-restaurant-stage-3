/**
 * Common database helper functions.
 */
class DBHelper {

    /**
     * SERVER PORT NUMBER
     */
    static get PORT() {
        return 1337;
    }

    /**
     * URL for RESTAURANT API
     */
    static get RESTAURANT_API() {
        return `http://localhost:${DBHelper.PORT}/restaurants`;
    }

    /**
     * URL for REVIEWS BY RESTAURANT API
     */
    static get RESTAURANT_REVIEWS_API() {
        return `http://localhost:${DBHelper.PORT}/reviews/?restaurant_id=${DBHelper.getParameterByName('id')}`;
    }

    /**
     * URL for REVIEWS API
     */
    static get REVIEWS_API() {
        return `http://localhost:${DBHelper.PORT}/reviews/`;
    }

    /**
     * Restaurant DB Name
     */
    static get RESTAURANT_IDB_NAME() {
        return `RestaurantDB`;
    }

    /**
     * Restaurant DB Store Name
     */
    static get RESTAURANT_IDB_STORE_NAME() {
        return `RestaurantStore`;
    }

    /**
     * Reviews DB Name
     */
    static get REVIEWS_IDB_NAME() {
        return `ReviewsDB`;
    }

    /**
     * Reviews DB Store Name
     */
    static get REVIEWS_IDB_STORE_NAME() {
        return `ReviewsStore`;
    }

    /**
     * GET Query String From URL
     * @param {*} name 
     * @param {*} url 
     */
    static getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    /**
     * Fetch All Restaurants
     */
    static fetchRestaurants() {
        if (navigator.onLine) {
            return fetch(DBHelper.RESTAURANT_API)
                .then(resp => resp.json())
                .then(restaurants => {
                    DBHelper.createIDBStore(restaurants, DBHelper.RESTAURANT_IDB_NAME, DBHelper.RESTAURANT_IDB_STORE_NAME);
                    return restaurants;
                })
                .catch(err => console.error(`ERR_FETCHING_RESTAURANTS: ${err}`));
        } else {
            return DBHelper.getCachedData(DBHelper.RESTAURANT_IDB_NAME, DBHelper.RESTAURANT_IDB_STORE_NAME)
                .then(resp => resp.json())
                .catch(err => console.error(`ERR_FETCHING_RESTAURANTS_FROM_IDB: ${err}`));
        }
    }

    /**
     * Fetch Restaurant by Id
     * @param {*} id 
     */
    static fetchRestaurantById(id) {
        return DBHelper.fetchRestaurants()
            .then(restaurants => restaurants.find(r => r.id == id))
            .then(restaurant => {
                return restaurant;
            })
            .catch(err => console.error(`ERR_FETCHING_RESTAURANT_BY_ID: ${err}`));
    }

    /**
     * Fetch Restaurants By Cuisine
     * @param {*} cuisine 
     */
    static fetchRestaurantByCuisine(cuisine) {
        return DBHelper.fetchRestaurants()
            .then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine))
            .then(result => {
                return result;
            })
            .catch(err => console.error(`ERR_FETCHING_RESTAURANT_BY_CUISINE: ${err}`));
    }

    /**
     * Fetch Restaurants By Cuisine
     * @param {*} neighborhood 
     */
    static fetchRestaurantByNeighborhood(neighborhood) {
        return DBHelper.fetchRestaurants()
            .then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood))
            .then(result => {
                return result;
            })
            .catch(err => console.error(`ERR_FETCHING_RESTAURANT_BY_NEIGHBOURHOOD: ${err}`));
    }

    /**
     * Fetch Restaurants By Cuisine & Neighborhood
     * @param {*} neighborhood 
     * @param {*} cuisine 
     */
    static fetchRestaurantByCuisineAndNeighborhood(neighborhood, cuisine) {
        return DBHelper.fetchRestaurants()
            .then(restaurants => {
                let results = restaurants;
                if (cuisine != 'all') {
                    results = restaurants.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') {
                    results = restaurants.filter(r => r.neighborhood == neighborhood);
                }
                return results;
            })
            .catch(err => console.error(`ERR_FETCHING_RESTAURANT_BY_CUISINE_NEIGHBOURHOOD: ${err}`));
    }

    /**
     * Fetch All Reviews
     */
    static fetchReviews() {
        if (navigator.onLine) {
            return fetch(DBHelper.REVIEWS_API)
                .then(resp => resp.json())
                .then(reviews => {
                    DBHelper.createIDBStore(reviews, DBHelper.REVIEWS_IDB_NAME, DBHelper.REVIEWS_IDB_STORE_NAME);
                    return reviews;
                })
                .catch(err => console.error(`ERR_FETCHING_ALL_REVIEWS: ${err}`));
        } else {
            return DBHelper.getCachedData(DBHelper.REVIEWS_IDB_NAME, DBHelper.REVIEWS_IDB_STORE_NAME)
                .then(resp => resp.json)
                .catch(err => console.error(`ERR_FETCHING_REVIEWS_FROM_IDB: ${err}`));
        }
    }

    /**
     * Fetch Restaurant Reviews By Id
     * @param {*} restaurant_id 
     */
    static fetchReviewsByRestaurantId(restaurant_id) {
        return DBHelper.fetchReviews()
            .then(reviews => reviews.filter(r => r.restaurant_id == restaurant_id))
            .then(result => {
                return result;
            })
            .catch(err => console.error(`ERR_FETCH_REVIEWS_BY_RESTAURANT_ID: ${err}`));
    }

    /**
     * FETCH NEIGHBORHOODS
     */
    static fetchNeighborhoods() {
        return DBHelper.fetchRestaurants()
            .then(restaurants => {
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);

                return uniqueNeighborhoods;
            })
            .catch(err => console.error(`ERR_FETCHING_NEIGHBORHOODS: ${err}`));
    }

    /**
     * FETCH CUISINES
     */
    static fetchCuisines() {
        return DBHelper.fetchRestaurants()
            .then(restaurants => {
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);

                return uniqueCuisines;
            })
            .catch(err => console.error(`ERR_FETCHING_CUISINES: ${err}`));
    }

    /**
     * IDB integration
     * @param {*} restaurants 
     */
    static createIDBStore(objects, dbName, storeName) {
        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkiteIndexedDB || window.msIndexedDB || window.shimIndexedDB;

        let idb = indexedDB.open(dbName, 1);

        idb.onupgradeneeded = function () {
            let db = idb.result;
            let store = db.createObjectStore(storeName, { keyPath: "id" });
            let index = store.createIndex("by-id", "id");
        };

        idb.onerror = function (err) {
            console.error(`IndexedDB error: ${err.target.errorCode}`);
        };

        idb.onsuccess = function () {
            let db = idb.result;
            let tx = db.transaction(storeName, "readwrite");
            let store = tx.objectStore(storeName);
            let index = store.index("by-id");

            objects.forEach(object => store.put(object));

            tx.oncomplete = function () {
                db.close();
            };
        };
    }

    /**
     * Fetch cached data from IndexDB
     */
    static getCachedData(dbName, storeName) {
        return new Promise((resolve, reject) => {
            const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkiteIndexedDB || window.msIndexedDB || window.shimIndexedDB;
            let idb = indexedDB.open(dbName, 1);

            idb.onsuccess = () => {
                let db = idb.result;
                let tx = db.transaction(storeName, "readwrite");
                let store = tx.objectStore(storeName);
                let getData = store.getAll();

                getData.onsuccess = () => {
                    resolve(getData.result);
                };

                tx.oncomplete = () => {
                    db.close();
                };
            }
        });
    }

    /**
     * Place marker on map
     * @param {*} restaurant 
     * @param {*} map 
     */
    static mapMarkerForRestaurant(restaurant, map) {
        const marker = new google.maps.Marker({
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map: map,
            animation: google.maps.Animation.DROP
        }
        );
        return marker;
    }

    /**
     * Url For Restaurant
     * @param {*} restaurant 
     */
    static urlForRestaurant(restaurant) {
        return `./restaurant.html?id==${restaurant.id}`;
    }

    static imageUrlForRestaurant(restaurant) {
        if (typeof (restaurant) == 'undefined') {
            return (`/img/rest_images/no_image.webp`);
        }
        return (`/img/rest_images/${restaurant.photograph}.webp`);
    }

    static lazyLoad() {
        if (typeof LazyLoad !== 'undefined') {
            new LazyLoad({
                elements_selector: '.restaurant-img'
            });
        }
    }
}