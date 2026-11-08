const CACHE = "detektif-v3";
const FILES = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png",
  "cases-a.js", "cases-b.js", "cases-c.js", "cases-story.js", "cases-backstory-long.js",
  "cases-ending.js", "cases-extra.js", "cases-hints.js", "cases-alt.js", "cases-training.js",
  "ancient-trials.mp3"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
