const CACHE='stock-scan-v2.01';
const ASSETS=['styles.css?v=2.01','app.js?v=2.01','manifest.webmanifest?v=2.01'];

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
 e.waitUntil(
  caches.keys()
   .then(keys=>Promise.all(keys.filter(k=>k.startsWith('stock-scan-')&&k!==CACHE).map(k=>caches.delete(k))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener('message',e=>{
 if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);

 // Published version must always come from network.
 if(u.pathname.endsWith('/version.json'))return;

 // HTML/navigation is network-only. Never put index.html in a service-worker cache,
 // preventing an old worker from resurrecting an old application shell.
 if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/stock-scan/')){
  e.respondWith(fetch(e.request,{cache:'no-store'}));
  return;
 }

 // Versioned static assets may be cached safely.
 e.respondWith(
  caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
   if(r.ok&&u.origin===self.location.origin){
    const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));
   }
   return r;
  }))
 );
});
