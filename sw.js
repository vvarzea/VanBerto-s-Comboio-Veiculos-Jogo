// Jogo dos Veículos — funciona offline depois da primeira visita
// Sobe o número da versão sempre que mudares algum ficheiro do jogo.
const CACHE='jogo-veiculos-v7';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-192.png','./icon-maskable-512.png',
  './img/carro.webp','./img/autocarro.webp','./img/comboio.webp','./img/aviao.webp','./img/barco.webp','./img/bicicleta.webp','./img/helicoptero.webp','./img/foguetao.webp','./img/trator.webp','./img/ambulancia.webp','./img/camiao.webp','./img/trotinete.webp','./img/skate.webp','./img/patins.webp','./img/mota.webp','./img/manha.webp','./img/tarde.webp','./img/inverno.webp','./img/anoitecer.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    // vai à rede em segundo plano para atualizar a cache; falhas (offline) são ignoradas
    const net=fetch(e.request).then(r=>{
      if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}
      return r;
    }).catch(()=>null);
    if(hit){e.waitUntil(net);return hit;}          // cache primeiro
    return net.then(r=>r||(e.request.mode==='navigate'
      ?caches.match('./index.html')                // offline e sem cache: abre o jogo na mesma
      :Response.error()));
  }));
});
