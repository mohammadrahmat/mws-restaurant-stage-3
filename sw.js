const staticCacheName = 'static-cache-v1',
	dynamicCacheName = 'dynamic-cache-v1',
	offlineContentCacheName = 'offline-content-cache-v1',
	pageSkeleton = 'index.html',
	expectedCaches = [staticCacheName, dynamicCacheName, offlineContentCacheName],
	thingsToCache = [
		'/',
		'index.html',
		'favicon.ico',
		'restaurant.html',
		'css/ugly/styles.css',
		'js/ugly/dbhelper.js',
		'js/ugly/main.js',
		'js/ugly/restaurant_info.js',
		'img/rest_images/1.webp',
		'img/rest_images/2.webp',
		'img/rest_images/3.webp',
		'img/rest_images/4.webp',
		'img/rest_images/5.webp',
		'img/rest_images/6.webp',
		'img/rest_images/7.webp',
		'img/rest_images/8.webp',
		'img/rest_images/9.webp',
		'img/rest_images/10.webp',
		'img/rest_images/no_image.webp',
		'img/staticmap.webp'
	];

self.addEventListener('install', event => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(staticCacheName)
			.then(cache => cache.addAll(thingsToCache))
			.catch(err => console.error(`ERROR_INSTALLING_SW: ${err}`))
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => Promise.all(
			keys.map(key => {
				if (!expectedCaches.includes(key)) return caches.delete(key);
			})
		))
	);
});

self.addEventListener('fetch', event => {
	if (event.request.url.indexOf('https://maps.googleapi.com/js') > -1) {
		console.log('bypass this for now :(');
	} else {
		event.respondWith(
			caches.match(event.request, { ignoreSearch: true })
				.then(response => {
					if (response) {
						return response;
					}
					let fetchRequest = event.request.clone();
					return fetch(fetchRequest)
						.then(response => {
							if (!response || response.status !== 200 || response.type !== 'basic') {
								return response;
							}
							let responseToCache = response.clone();
							caches.open(dynamicCacheName)
								.then(cache => {
									cache.put(event.request, responseToCache);
								});

							return response;
						});
				})
				.catch(err => console.warn(`ERR_FETCHING_SW_ITEM: ${event.request.url}`))
		);
	}
});