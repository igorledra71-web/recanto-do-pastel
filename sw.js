/* =========================
SERVICE WORKER
Recanto do Pastel
========================= */

const CACHE_NAME = "recanto-do-pastel-v1"

const urlsToCache = [
  "./",
  "./index.html",
  "./logo-recanto.png",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap"
]

/* =========================
INSTALAÇÃO
========================= */

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
  )

  self.skipWaiting()

})

/* =========================
ATIVAÇÃO
========================= */

self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name)
          }
        })
      )
    })
  )

  self.clients.claim()

})

/* =========================
INTERCEPTAR REQUISIÇÕES
========================= */

self.addEventListener("fetch", event => {

  event.respondWith(
    caches.match(event.request)
      .then(response => {

        if (response) {
          return response
        }

        return fetch(event.request)
          .then(networkResponse => {

            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, networkResponse.clone())
                return networkResponse
              })

          })
          .catch(() => {
            return caches.match("./index.html")
          })

      })
  )

})
