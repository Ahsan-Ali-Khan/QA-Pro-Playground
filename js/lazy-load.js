/*
 * Copyright © 2026 Ahsan Ali Khan
 * QA Pro Playground
 * All Rights Reserved.
 *
 * Unauthorized copying, modification, distribution, reverse engineering,
 * or commercial use of this software is prohibited without prior written
 * permission from the copyright owner.
 *
 * Contact: ahsan.ali.khan.tech@gmail.com
 */

/* ======================================================
   QA PRO — LAZY LOAD ENGINE  (#11 IntersectionObserver)
   Scenario: Images only load when scrolled into view.
   Simulated network delay makes lazy vs eager loading
   clearly visible to both humans and automation tools.
====================================================== */
'use strict';
const LazyLoad=(()=>{
  const PICS=[
    {id:'ll-img-1', title:'Mountain Vista',  tag:'landscape', color:'#4f46e5', emoji:'🏔️'},
    {id:'ll-img-2', title:'City Skyline',    tag:'urban',     color:'#0ea5e9', emoji:'🏙️'},
    {id:'ll-img-3', title:'Ocean Sunset',    tag:'nature',    color:'#f59e0b', emoji:'🌅'},
    {id:'ll-img-4', title:'Forest Path',     tag:'nature',    color:'#10b981', emoji:'🌲'},
    {id:'ll-img-5', title:'Desert Dunes',    tag:'landscape', color:'#d97706', emoji:'🏜️'},
    {id:'ll-img-6', title:'Snowy Peak',      tag:'landscape', color:'#6366f1', emoji:'❄️'},
    {id:'ll-img-7', title:'Coastal Cliff',   tag:'nature',    color:'#0284c7', emoji:'🌊'},
    {id:'ll-img-8', title:'Urban Garden',    tag:'urban',     color:'#16a34a', emoji:'🌿'},
    {id:'ll-img-9', title:'Autumn Valley',   tag:'nature',    color:'#b45309', emoji:'🍂'},
    {id:'ll-img-10',title:'Neon City',       tag:'urban',     color:'#7c3aed', emoji:'🌆'},
    {id:'ll-img-11',title:'Glacier Bay',     tag:'landscape', color:'#06b6d4', emoji:'🧊'},
    {id:'ll-img-12',title:'Bamboo Forest',   tag:'nature',    color:'#65a30c', emoji:'🎋'},
  ];

  // Generate SVG as base64 — avoids any quote/encoding issues in src attribute
  function makeSrc(p){
    const hex=p.color.replace('#','');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160">`+
      `<rect width="240" height="160" fill="#${hex}"/>`+
      `<text x="120" y="72" dominant-baseline="middle" text-anchor="middle" font-size="40">${p.emoji}</text>`+
      `<text x="120" y="122" dominant-baseline="middle" text-anchor="middle" font-size="13" fill="white" font-family="sans-serif">${p.title}</text>`+
      `</svg>`;
    return 'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg)));
  }

  // Simulate network delay (400–900 ms) so lazy loading is clearly visible
  function loadImage(card){
    const img=card.querySelector('img[data-ll-src]');
    if(!img)return;
    const src=img.getAttribute('data-ll-src');
    const skeleton=card.querySelector('.ll-skeleton');
    if(skeleton)skeleton.setAttribute('data-loading','true');

    const delay=window.STABLE_MODE ? 0 : 4000+Math.random()*1000;
    setTimeout(()=>{
      img.src=src;
      img.removeAttribute('data-ll-src');
      img.onload=()=>{
        img.style.opacity='1';
        card.setAttribute('data-loaded','true');
        if(skeleton)skeleton.setAttribute('data-loading','false');
      };
    }, delay);
  }

  return{init(){
    const grid=document.getElementById('ll-grid');
    if(!grid)return;

    // Fixed-height scrollable box — prevents all cards entering observer at once
    grid.style.cssText=[
      'display:grid',
      'grid-template-columns:repeat(auto-fill,minmax(220px,1fr))',
      'gap:16px',
      'margin-top:16px',
      'height:460px',
      'overflow-y:auto',
      'padding:4px 8px 4px 2px',
    ].join(';');
    grid.innerHTML='';

    PICS.forEach(p=>{
      const card=document.createElement('div');
      card.className='ll-card';
      card.id=p.id;
      card.setAttribute('data-tag',p.tag);
      card.setAttribute('data-loaded','false');

      // Skeleton shimmer placeholder shown while image is pending
      const skeleton=document.createElement('div');
      skeleton.className='ll-skeleton';
      skeleton.setAttribute('data-loading','false');  // 'true' when fetch starts
      skeleton.style.cssText=[
        'height:160px',
        'border-radius:8px',
        'margin-bottom:8px',
        'background:linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%)',
        'background-size:200% 100%',
        'animation:llShimmer 1.4s infinite',
        'position:relative',
        'overflow:hidden',
      ].join(';');

      // Spinner overlay inside skeleton
      const spinner=document.createElement('div');
      spinner.className='ll-spinner';
      spinner.style.cssText=[
        'display:none',
        'position:absolute',
        'inset:0',
        'align-items:center',
        'justify-content:center',
        'font-size:22px',
      ].join(';');
      spinner.textContent='⏳';
      skeleton.appendChild(spinner);

      const img=document.createElement('img');
      img.setAttribute('data-ll-src', makeSrc(p));
      img.alt=p.title;
      img.setAttribute('width','100%');
      img.setAttribute('height','160');
      img.style.cssText='display:none;width:100%;border-radius:8px;opacity:0;transition:opacity .5s;';

      const wrap=document.createElement('div');
      wrap.style.cssText='position:relative;margin-bottom:8px;';
      wrap.appendChild(skeleton);
      wrap.appendChild(img);

      // When fetch starts: show spinner in skeleton
      const obs2=new MutationObserver(()=>{
        const loading=skeleton.getAttribute('data-loading')==='true';
        spinner.style.display=loading?'flex':'none';
        if(!loading && card.getAttribute('data-loaded')==='true'){
          skeleton.style.display='none';
          img.style.display='block';
        }
      });
      obs2.observe(skeleton,{attributes:true,attributeFilter:['data-loading']});

      // When image fully loaded
      img.addEventListener('load',()=>{
        skeleton.style.display='none';
        img.style.display='block';
        obs2.disconnect();
      });

      const ttl=document.createElement('p');
      ttl.className='ll-title';
      ttl.style.cssText='margin:0;font-size:13px;font-weight:600;';
      ttl.textContent=p.title;

      const tg=document.createElement('span');
      tg.className='ll-tag';
      tg.style.cssText='font-size:11px;color:#6b7280;';
      tg.textContent='#'+p.tag;

      card.appendChild(wrap);
      card.appendChild(ttl);
      card.appendChild(tg);
      grid.appendChild(card);
    });

    // Inject shimmer keyframes once
    if(!document.getElementById('ll-shimmer-style')){
      const st=document.createElement('style');
      st.id='ll-shimmer-style';
      st.textContent=`@keyframes llShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`;
      document.head.appendChild(st);
    }

    if(window.STABLE_MODE){
      grid.querySelectorAll('.ll-card').forEach(c=>{
        loadImage(c);
      });
      return;
    }

    // Root = grid itself (bounded 460px scrollable box).
    // rootMargin:0 ensures cards only trigger when genuinely entering the grid viewport.
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        // Only trigger if image hasn't been loaded yet
        if(entry.target.getAttribute('data-loaded')==='false'
           && entry.target.querySelector('img[data-ll-src]')){
          loadImage(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },{root:grid, rootMargin:'0px', threshold:0.1});

    grid.querySelectorAll('.ll-card').forEach(c=>obs.observe(c));
  }};
})();
window.LazyLoad=LazyLoad;
// Initialized via new-scenarios.js MAP (show('lazyLoadSection') → LazyLoad.init())
