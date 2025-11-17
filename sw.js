const CACHE_NAME = "breath-pwa-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// ---------- INSTALL 단계 (파일 캐싱) ----------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // 새 버전 즉시 적용
});

// ---------- ACTIVATE 단계 (오래된 캐시 제거) ----------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // 즉시 새 서비스워커 사용
});

// ---------- FETCH 단계 (오프라인 대응) ----------
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      // 캐시된 파일 우선 제공, 없으면 네트워크 요청
      return (
        cached ||
        fetch(event.request).catch(() => {
          // 완전히 오프라인 + 파일 없음 → index.html 대체 제공
          return caches.match("./index.html");
        })
      );
    })
  );
});