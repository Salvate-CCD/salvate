// Sálvate 서비스 워커 — 한 번 받은 아이콘·이미지·폰트·JS 를 폰에 저장해 두고 다음부터 바로 씀.
// 홈 화면 앱을 다시 켤 때 네트워크가 늦게 붙어도 아이콘이 비지 않게 하기 위함.
//
// 저장하는 것: 파일 이름에 내용 해시가 붙은 정적 파일만
//   /assets/...  (예: message-icon.7a90be4d….svg)   /_expo/static/...  (예: entry-f09ddb10….js)
// 내용이 바뀌면 이름(해시)도 바뀌므로 저장본이 낡을 일이 없음.
// 페이지(HTML)·manifest·아이콘 PNG 등 이름이 그대로인 파일은 저장하지 않고 항상 서버에서 받음
// → 새 버전을 배포하면 다음 실행 때 바로 반영됨.
const CACHE = 'salvate-static-v1';

const isHashedStatic = (url) =>
  url.origin === self.location.origin && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/_expo/static/'));

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  // 이전 버전 저장소 정리
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('salvate-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (!isHashedStatic(url)) return; // 나머지는 브라우저 기본 동작(네트워크)

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request, { ignoreSearch: false });
      if (cached) return cached;
      // 처음 받는 파일: 네트워크에서 받아 저장. 순간적으로 실패하면 한 번 더 시도
      const fetchAndStore = async () => {
        const response = await fetch(request);
        if (response.ok && response.type === 'basic') cache.put(request, response.clone());
        return response;
      };
      try {
        return await fetchAndStore();
      } catch {
        await new Promise((r) => setTimeout(r, 500));
        return fetchAndStore();
      }
    }),
  );
});
