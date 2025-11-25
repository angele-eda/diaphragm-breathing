// 캐시 이름(버전 바꾸고 싶으면 뒤 숫자만 올리면 됨)
const CACHE_NAME = "breathing-app-v1";

// 오프라인에서도 쓸 기본 파일들
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",

  // icons
  "./icons/icon-192.png",
  "./icons/icon-512.png",

  // images
  "./img/426.png",
  "./img/478.png",
  "./img/box.png",
  "./img/banner_sleep.png",
  "./img/hero_main.png",

  // sounds
  "./sound/bells_sound1_custom.wav",
  "./sound/soft_click_0.2s.wav",
  "./sound/soft_sleep_chime.wav"
];

// 설치 단계: 캐시에 파일 미리 담기
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 오래된 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 네트워크 요청 가로채서 캐시 우선 사용
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에 있으면 그거 쓰고, 없으면 네트워크로 가져오기
      return response || fetch(event.request);
    })
  );
});