const C='vf-202611261514';
const A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.open(C).then(async c=>{
    const hit=(await c.match(r,{ignoreSearch:true}))||(r.mode==='navigate'?await c.match('./index.html'):undefined);
    const net=fetch(r).then(res=>{if(res&&res.ok&&r.mode!=='navigate')c.put(r,res.clone());else if(res&&res.ok)c.put('./index.html',res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return (await net)||new Response('Sin conexión',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}))});
