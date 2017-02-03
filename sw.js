const CACHE_NAME = 'alexstepcom_v14';

self.addEventListener('install', function(event) {
  event.waitUntil(
	caches.open(CACHE_NAME).then(function(cache) {
	  return cache.addAll([
		'/',
		'/index.html',
	  ]).then(function(){
		// cached
	  });
	})
  );
});


// период обновления кэша
var MAX_AGE = 6*60*60*1000;

self.addEventListener('fetch', function(event) {

	event.respondWith(
		// ищем запрошенный ресурс среди закэшированных
		caches.match(event.request).then(function(cachedResponse) {
			var lastModified, fetchRequest;

			// если ресурс есть в кэше
			if (cachedResponse) {
				// получаем дату последнего обновления
				lastModified = new Date(cachedResponse.headers.get('last-modified'));
				// и если мы считаем ресурс устаревшим
				if (lastModified && (Date.now() - lastModified.getTime()) > MAX_AGE) {
					
					fetchRequest = event.request.clone();
					// создаём новый запрос
					return fetch(fetchRequest).then(function(response) {
						// при неудаче всегда можно выдать ресурс из кэша
						if (!response || response.status !== 200) {
							return cachedResponse;
						}
						// обновляем кэш
						caches.open(CACHE_NAME).then(function(cache) {
							try	{
								cache.put(event.request, response.clone());
							}catch(e){}

						});
						// возвращаем свежий ресурс
						return response;
					}).catch(function() {
						return cachedResponse;
					});
				}
				return cachedResponse;
			}

			// запрашиваем из сети как обычно
			return fetch(event.request);
		})
	);
});
