const staticCacheName = 'mw-v3', 
pageSkeleton = 'index.html',
expectedCaches = [staticCacheName];
const thingsToCache = [
	'/',
	'./index.html',
	'./favicon.ico',
	'./restaurant.html',
	'./css/ugly/styles.css',
	'./js/ugly/dbhelper.js',
	'./js/ugly/main.js',
	'./js/ugly/restaurant_info.js',
	'./data/restaurants.json',
	'./img/rest_images/1.webp',
	'./img/rest_images/2.webp',
	'./img/rest_images/3.webp',
	'./img/rest_images/4.webp',
	'./img/rest_images/5.webp',
	'./img/rest_images/6.webp',
	'./img/rest_images/7.webp',
	'./img/rest_images/8.webp',
	'./img/rest_images/9.webp',
	'./img/rest_images/10.webp',
	'./img/rest_images/no_image.webp',
	'.img/staticmap.webp'
];

self.addEventListener('install', event => {
	self.skipWaiting();
	event.waitUntil(caches.open(staticCacheName).then(cache => cache.addAll(thingsToCache)));
});
	
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => Promise.all(
			keys.map(key => {
				if(!expectedCaches.includes(key)) return caches.delete(key);
			})
		))
	);
});

self.addEventListener('fetch', event => {
	if (event.request.url.indexOf('https://maps.googleapi.com/js') > -1) {
		console.log('bypass this for now :(');
	} else {
		event.respondWith(
			caches.match(event.request, {ignoreSearch:true}).then(response => {
				return response || fetch(event.request);
			}).catch(err => console.log(err, event.request))
		);
	}
	
});