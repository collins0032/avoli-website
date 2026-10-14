// AVOLI shared JS: nav, footer year, data injection, forms (mailto fallback), gallery filter
(function(){
  const toggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('.main-nav');
  if(toggle&&nav){toggle.addEventListener('click',()=>nav.classList.toggle('open'));}
  document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
  async function loadJSON(path){try{const r=await fetch(path);if(!r.ok)throw 0;return await r.json();}catch{return null;}}
  async function hydrate(){
    const site=await loadJSON('data/site.json');
    if(site&&site.org){
      document.querySelectorAll('[data-org-email]').forEach(e=>{e.textContent=site.org.email;if(e.tagName==='A')e.href='mailto:'+site.org.email;});
      document.querySelectorAll('[data-org-phone]').forEach(e=>{e.textContent=site.org.phone;if(e.tagName==='A')e.href='tel:'+site.org.phone.replace(/[^+\d]/g,'');});
      document.querySelectorAll('[data-org-address]').forEach(e=>e.textContent=site.org.address);
      const bank=document.querySelector('[data-bank-details]');
      if(bank&&site.org.bank){bank.innerHTML=`<strong>${site.org.bank.account_name}</strong><br>Bank: ${site.org.bank.bank_name}<br>Account no: <code>${site.org.bank.account_number}</code><br><span class="small">${site.org.bank.note}</span>`;}
      ['instagram','facebook','linkedin','x','youtube'].forEach(k=>{
        document.querySelectorAll(`[data-social-${k}]`).forEach(a=>{if(site.org.social&&site.org.social[k])a.href=site.org.social[k];});
      });
      // GA
      if(site.analytics&&site.analytics.ga_id&&site.analytics.ga_id.indexOf('G-')===0){
        const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+site.analytics.ga_id;document.head.appendChild(s);
        window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config',site.analytics.ga_id);
      }
    }
    // Programmes
    const progWrap=document.querySelector('[data-programmes]');
    if(progWrap){const data=await loadJSON('data/programmes.json');if(data){progWrap.innerHTML=data.map(p=>`<article class="card programme-card"><span class="tag">${p.tag}</span><h3>${p.title}</h3><p>${p.summary}</p><a class="btn btn-outline btn-small" href="what-we-do.html#${p.id}">Learn more</a></article>`).join('');}}
    // Projects preview
    const projWrap=document.querySelector('[data-projects]');
    if(projWrap){const data=await loadJSON('data/projects.json');if(data){const lim=projWrap.getAttribute('data-projects')||data.length;projWrap.innerHTML=data.slice(0,parseInt(lim)).map(p=>`<article class="card project-card"><img loading="lazy" src="${p.image}" alt="${p.name}"><div><span class="tag">${p.location} • ${p.date}</span><h3>${p.name}</h3><p>${p.description}</p><div class="meta"><span><b>${p.beneficiaries}</b> beneficiaries</span><span>Partners: <b>${p.partners}</b></span></div><p class="small"><b>Results:</b> ${p.results}</p></div></article>`).join('');}}
    // News preview
    const newsWrap=document.querySelector('[data-news]');
    if(newsWrap){const data=await loadJSON('data/news.json');if(data){const lim=newsWrap.getAttribute('data-news')||data.length;newsWrap.innerHTML=data.slice(0,parseInt(lim)).map(n=>`<article class="card news-card"><span class="tag">${n.category} • ${n.date}</span><h3>${n.title}</h3><p>${n.excerpt}</p><a href="news.html#${n.id}">Read update →</a></article>`).join('');}}
    // Gallery
    const gWrap=document.querySelector('[data-gallery]');
    if(gWrap){const data=await loadJSON('data/gallery.json');if(data){
      const cats=['All',...new Set(data.map(g=>g.programme))];
      const fRow=document.querySelector('[data-gallery-filters]');
      if(fRow){fRow.innerHTML=cats.map((c,i)=>`<button class="chip ${i===0?'on':''}" data-f="${c}">${c}</button>`).join('');
        fRow.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;fRow.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');const f=b.dataset.f;gWrap.querySelectorAll('.g-item').forEach(it=>{it.style.display=(f==='All'||it.dataset.prog===f)?'':'none';});});}
      gWrap.innerHTML=data.map(g=>`<figure class="g-item" data-prog="${g.programme}"><img loading="lazy" src="${g.src}" alt="${g.caption}"><figcaption><b>${g.programme}</b><br>${g.caption}</figcaption></figure>`).join('');}}
  }
  // Generic form → mailto fallback + confirmation message (works without backend; wire to Formspree later)
  document.addEventListener('submit',e=>{
    const f=e.target;if(!f.hasAttribute('data-avoli-form'))return;e.preventDefault();
    const fd=new FormData(f);const subject=f.getAttribute('data-subject')||'Website enquiry — AVOLI';
    const lines=[...fd.entries()].map(([k,v])=>`${k}: ${v}`).join('\n');
    const siteEmail=(document.querySelector('[data-org-email]')||{}).textContent||'hello@avoli.org.ng';
    window.location.href=`mailto:${siteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
    const ok=f.parentElement.querySelector('[data-form-ok]');if(ok)ok.hidden=false;f.reset();
  });
  document.addEventListener('DOMContentLoaded',hydrate);
})();
