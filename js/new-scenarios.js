/* ======================================================
   QA PRO — NEW SCENARIOS ENGINE
   Category B & C Implementations
   Covers scenarios: 6,12,16,17,34,35,42,49,59,60,61,
                     66,85,86,87,88,89,90,93,95,96,101,
                     102,119
====================================================== */
'use strict';

/* ================================================================
   UTILITY — local aliases (in case called before main page inits)
================================================================ */
function _hide(el){
  if(!el||el._domRemoved)return;
  el._domParent=el.parentNode; el._domNext=el.nextSibling;
  if(el.parentNode)el.parentNode.removeChild(el);
  el._domRemoved=true;
}
function _show(el){
  if(!el||!el._domRemoved)return;
  if(el._domNext&&el._domNext.parentNode===el._domParent)
    el._domParent.insertBefore(el,el._domNext);
  else if(el._domParent)el._domParent.appendChild(el);
  el._domRemoved=false;
}
const dH = typeof domHide==='function' ? domHide : _hide;
const dS = typeof domShow==='function' ? domShow : _show;

/* ================================================================
   #6 — FRAMEWORK-STYLE AUTO-GENERATED ATTRIBUTES
================================================================ */
function initFrameworkAttrs(){
  const btn=document.getElementById('fw-target-btn');
  const disp=document.getElementById('fw-attrs-display');
  if(!btn)return;
  function hex(n){return Math.random().toString(16).slice(2,2+n);}
  function stamp(){
    // remove old framework attrs
    [...btn.attributes].filter(a=>a.name.startsWith('data-v-')||a.name.startsWith('__react'))
      .forEach(a=>btn.removeAttribute(a.name));
    const vue=`data-v-${hex(6)}`;
    const rid=`0.${Math.floor(Math.random()*9)}.${Math.floor(Math.random()*99)}`;
    const fid=`__reactFiber$${hex(8)}`;
    btn.setAttribute(vue,'');
    btn.setAttribute('data-reactid',rid);
    btn.setAttribute(fid,'1');
    btn.setAttribute('data-component-id',hex(8));
    if(disp)disp.textContent=`Vue: ${vue}  |  React: data-reactid="${rid}"  |  Fiber: ${fid}`;
  }
  if(window.STABLE_MODE){
    btn.setAttribute('data-v-abc123','');
    btn.setAttribute('data-reactid','0.1.2');
    if(disp)disp.textContent='data-v-abc123 | data-reactid="0.1.2" (stable)';
    return;
  }
  stamp();
  setInterval(stamp,8000);
}

/* ================================================================
   #34 — TOAST NOTIFICATIONS
================================================================ */
window.showToast=function(type,msg,ms){
  type=type||'success'; ms=ms||3000;
  const c=document.getElementById('toast-container');
  if(!c)return;
  const labels={success:'✅ Action completed successfully!',
                error:'❌ An error occurred. Please retry.',
                info:'ℹ️ Your changes have been saved.',
                warning:'⚠️ Session will expire in 5 minutes.'};
  const colors={success:'#10b981',error:'#ef4444',info:'#6366f1',warning:'#f59e0b'};
  const t=document.createElement('div');
  t.className='qa-toast'; t.id='toast-'+Date.now();
  t.setAttribute('data-toast-type',type);
  t.style.cssText=`background:${colors[type]};color:#fff;padding:12px 20px;border-radius:10px;
    font-size:14px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.25);
    cursor:pointer;max-width:320px;animation:slideInToast .3s ease;`;
  t.textContent=msg||labels[type];
  t.onclick=()=>dismissToast(t);
  c.appendChild(t);
  // update status panel if visible
  _toastUpdateStatus(type);
  if(ms>0)setTimeout(()=>dismissToast(t),ms);
  return t;
};
function dismissToast(t){
  if(!t||!t.parentNode)return;
  t.style.cssText+=';opacity:0;transform:translateX(120%);transition:all .3s ease;';
  setTimeout(()=>{
    if(t.parentNode)t.parentNode.removeChild(t);
    _toastRefreshCount();
  },300);
}
function _toastUpdateStatus(type){
  const total=document.getElementById('toast-total-count');
  const last=document.getElementById('toast-last-type');
  if(total){const n=(+total.getAttribute('data-count')||0)+1;total.textContent=n;total.setAttribute('data-count',n);}
  if(last){last.textContent=type;last.setAttribute('data-type',type);}
  _toastRefreshCount();
}
function _toastRefreshCount(){
  const active=document.getElementById('toast-active-count');
  if(!active)return;
  const c=document.getElementById('toast-container');
  const n=c?c.children.length:0;
  active.textContent=n;active.setAttribute('data-count',n);
}

/* ================================================================
   #34b — TOAST SECTION INIT
================================================================ */
function initToastSection(){
  // Custom message button
  document.getElementById('toast-btn-custom')?.addEventListener('click',()=>{
    const msg=document.getElementById('toast-custom-msg')?.value.trim();
    const type=document.getElementById('toast-custom-type')?.value||'success';
    showToast(type, msg||undefined);
  });
  // Rapid fire — 3 toasts 300 ms apart
  document.getElementById('toast-btn-rapid')?.addEventListener('click',()=>{
    const types=['success','info','warning'];
    types.forEach((tp,i)=>setTimeout(()=>showToast(tp),i*300));
  });
  // Delayed toast — fires after 2 s
  document.getElementById('toast-btn-delayed')?.addEventListener('click',()=>{
    showToast('info','⏳ This toast was triggered 2 seconds ago…');
    // show placeholder status immediately, actual toast delayed
    const btn=document.getElementById('toast-btn-delayed');
    if(btn){btn.disabled=true;btn.textContent='Waiting…';}
    setTimeout(()=>{
      showToast('success','✅ Delayed toast arrived after 2 s!',3000);
      if(btn){btn.disabled=false;btn.textContent='⏳ Delayed Toast (2 s)';}
    },2000);
  });
  // Long-lived toast — 8 s timeout
  document.getElementById('toast-btn-long')?.addEventListener('click',()=>{
    showToast('warning','⚠️ This toast lives for 8 seconds — try to catch it!',8000);
  });
  // Persistent toast — ms=0 means no auto-dismiss
  document.getElementById('toast-btn-persistent')?.addEventListener('click',()=>{
    showToast('error','📌 Persistent toast — click to dismiss manually.',0);
  });
}

/* ================================================================
   #35 — DOM-INJECTED TOOLTIP
================================================================ */
function initTooltips(){
  document.querySelectorAll('[data-tooltip]').forEach(el=>{
    el.addEventListener('mouseenter',function(){
      if(document.getElementById('active-tooltip'))return;
      const tip=document.createElement('div');
      tip.id='active-tooltip'; tip.className='qa-tooltip-box';
      tip.textContent=this.getAttribute('data-tooltip');
      const r=this.getBoundingClientRect();
      tip.style.cssText=`position:fixed;top:${r.top-46}px;left:${r.left}px;
        background:#1f2937;color:#fff;padding:7px 13px;border-radius:8px;font-size:12px;
        font-weight:500;z-index:9999;max-width:260px;line-height:1.4;pointer-events:none;
        box-shadow:0 4px 14px rgba(0,0,0,.3);`;
      document.body.appendChild(tip);
    });
    el.addEventListener('mouseleave',()=>{
      const tip=document.getElementById('active-tooltip');
      if(tip)tip.parentNode.removeChild(tip);
    });
  });
}

/* ================================================================
   #42 — SPA HASH ROUTING
================================================================ */
function initHashRouting(){
  const _orig=window.show;
  if(!_orig)return;
  window.show=function(section){
    history.replaceState(null,'','#'+section);
    _orig(section);
  };
  window.addEventListener('hashchange',()=>{
    const t=window.location.hash.replace('#','');
    if(t&&_orig)_orig(t);
  });
  const h=window.location.hash.replace('#','');
  if(h&&document.getElementById(h))setTimeout(()=>_orig&&_orig(h),150);
}

/* ================================================================
   #49 — RESPONSIVE MOBILE NAV
================================================================ */
function initMobileNav(){
  const toggle=document.getElementById('mob-nav-toggle');
  const drawer=document.getElementById('mob-nav-drawer');
  if(!toggle||!drawer)return;
  dH(drawer);
  toggle.addEventListener('click',()=>{
    if(drawer._domRemoved){dS(drawer);toggle.textContent='✕ Close';}
    else{dH(drawer);toggle.textContent='☰ Menu';}
  });
  drawer.querySelectorAll('[data-nav]').forEach(item=>{
    item.addEventListener('click',()=>{
      dH(drawer);toggle.textContent='☰ Menu';
      if(window.show)window.show(item.getAttribute('data-nav'));
    });
  });
}

/* ================================================================
   #61 — FOCUS-DEPENDENT VALIDATION
================================================================ */
function initFocusValidation(){
  document.querySelectorAll('.fv-field').forEach(input=>{
    const eid=input.getAttribute('data-err');
    const rule=input.getAttribute('data-rule')||'required';
    const errEl=document.getElementById(eid);
    if(!errEl)return;
    dH(errEl);
    input.addEventListener('focusin',()=>dH(errEl));
    input.addEventListener('focusout',()=>{
      const v=input.value.trim();
      let msg='';
      if(!v){msg='This field is required.';}
      else if(rule==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){msg='Enter a valid email.';}
      else if(rule==='min6'&&v.length<6){msg='Minimum 6 characters required.';}
      else if(rule==='numeric'&&!/^\d+$/.test(v)){msg='Numbers only.';}
      if(msg){errEl.textContent=msg;dS(errEl);}else{dH(errEl);}
    });
  });
}

/* ================================================================
   #66 — COOKIE BANNER
================================================================ */
function initCookieBanner(){
  const b=document.getElementById('cookie-banner');
  if(!b)return;
  if(sessionStorage.getItem('qa_cookies_ok')){dH(b);return;}
  dH(b);
  setTimeout(()=>dS(b),600);
  document.getElementById('cookie-accept')
    ?.addEventListener('click',()=>{sessionStorage.setItem('qa_cookies_ok','1');dH(b);});
  document.getElementById('cookie-reject')
    ?.addEventListener('click',()=>{sessionStorage.setItem('qa_cookies_ok','0');dH(b);});
}

/* ================================================================
   #85 — LIVE KPI DASHBOARD
================================================================ */
function initDashboard(){
  const KPIs=[
    {id:'kpi-revenue',  u:'$',  base:84200,  d:()=>Math.floor(Math.random()*600-200), iv:3000},
    {id:'kpi-users',    u:'',   base:1247,   d:()=>Math.floor(Math.random()*20-5),    iv:2000},
    {id:'kpi-orders',   u:'',   base:342,    d:()=>Math.floor(Math.random()*10-2),    iv:4000},
    {id:'kpi-errors',   u:'',   base:7,      d:()=>Math.floor(Math.random()*3-1),     iv:5000},
    {id:'kpi-latency',  u:'ms', base:142,    d:()=>Math.floor(Math.random()*30-15),   iv:1500},
    {id:'kpi-uptime',   u:'%',  base:99.91,  d:()=>+(Math.random()*.02-.01).toFixed(2),iv:7000},
  ];
  KPIs.forEach(k=>{
    const el=document.getElementById(k.id+'-val');
    if(!el)return;
    el.textContent=k.u+k.base;
    if(window.STABLE_MODE)return;
    let cur=k.base;
    setInterval(()=>{
      const prev=cur; cur=Math.max(0,+(+cur+ +k.d()).toFixed(2));
      el.textContent=k.u+cur;
      el.style.color=cur>prev?'#10b981':cur<prev?'#ef4444':'#111827';
      setTimeout(()=>el.style.color='#111827',900);
    },k.iv);
  });
}

/* ================================================================
   #86 — ASYNC NOTIFICATION SYSTEM
================================================================ */
let _notifCount=0;
function initNotifications(){
  const bell=document.getElementById('notif-bell');
  const badge=document.getElementById('notif-badge');
  const panel=document.getElementById('notif-panel');
  const list=document.getElementById('notif-list');
  if(!bell||!panel)return;
  // Use CSS hide (not DOM removal) — notif-list must stay in DOM so _pushNotif can append items
  panel.style.display='none';
  if(badge)badge.style.display='none';
  bell.addEventListener('click',()=>{
    const opening=panel.style.display==='none';
    panel.style.display=opening?'block':'none';
    // Only reset the unread counter when OPENING — not on close
    if(opening){
      _notifCount=0;
      if(badge){badge.textContent='0';badge.style.display='none';}
    }
  });
  const msgs=[
    ['New order #4821 received','success'],['CPU at 87% — check load','warning'],
    ['Deployment pipeline completed','success'],['Payment gateway timeout','error'],
    ['3 new users registered','info'],['Database backup done','success'],
    ['SSL cert expires in 7 days','warning'],['Test suite passed (94%)','success'],
  ];
  if(window.STABLE_MODE){_pushNotif('System stable mode active','info');return;}
  let idx=0;
  const fire=()=>{const[m,t]=msgs[idx++%msgs.length];_pushNotif(m,t);};
  setTimeout(()=>{fire();setInterval(fire,9000+Math.random()*5000);},4000);
}
window._pushNotif=function _pushNotif(msg,type){
  _notifCount++;
  const badge=document.getElementById('notif-badge');
  const list=document.getElementById('notif-list');
  if(badge){badge.textContent=_notifCount>9?'9+':_notifCount;badge.style.display='flex';}
  if(!list)return;
  const c={success:'#10b981',error:'#ef4444',info:'#6366f1',warning:'#f59e0b'};
  const ic={success:'✅',error:'❌',info:'ℹ️',warning:'⚠️'};
  const d=document.createElement('div');
  d.className='notif-item';
  d.setAttribute('data-notif-type',type||'info');
  d.style.cssText=`display:flex;align-items:flex-start;gap:10px;padding:10px 14px;
    border-bottom:1px solid #f1f5f9;border-left:3px solid ${c[type]||'#6366f1'};`;
  d.innerHTML=`<span style="font-size:16px;flex-shrink:0;">${ic[type]||'ℹ️'}</span>
    <div style="flex:1;">
      <p style="margin:0;font-size:13px;font-weight:600;color:#111827;">${msg}</p>
      <p style="margin:0;font-size:11px;color:#6b7280;">${new Date().toLocaleTimeString()}</p>
    </div>`;
  list.prepend(d);
  while(list.children.length>10)list.removeChild(list.lastChild);
};

/* ================================================================
   #88 — CUSTOM CALENDAR WIDGET
================================================================ */
const CalWidget=(()=>{
  const MO=['January','February','March','April','May','June',
            'July','August','September','October','November','December'];
  const DY=['Su','Mo','Tu','We','Th','Fr','Sa'];
  let cy,cm,sel=null;
  function render(y,m){
    cy=y;cm=m;
    const grid=document.getElementById('cal-grid');
    const hdr=document.getElementById('cal-month-year');
    if(!grid||!hdr)return;
    hdr.textContent=`${MO[m]} ${y}`;
    grid.innerHTML='';
    DY.forEach(d=>{const h=document.createElement('div');h.className='cal-hdr';h.textContent=d;grid.appendChild(h);});
    const first=new Date(y,m,1).getDay();
    const dim=new Date(y,m+1,0).getDate();
    for(let i=0;i<first;i++){const e=document.createElement('div');e.className='cal-cell cal-empty';grid.appendChild(e);}
    for(let d=1;d<=dim;d++){
      const c=document.createElement('div');
      c.className='cal-cell';c.id=`cal-d-${y}-${m+1}-${d}`;c.textContent=d;
      const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      c.setAttribute('data-date',iso);
      if(sel===iso)c.classList.add('cal-sel');
      c.addEventListener('click',()=>{
        grid.querySelectorAll('.cal-sel').forEach(x=>x.classList.remove('cal-sel'));
        c.classList.add('cal-sel');sel=iso;
        const r=document.getElementById('cal-result');
        if(r)r.textContent='Selected: '+iso;
      });
      grid.appendChild(c);
    }
  }
  return{
    init(){
      const n=new Date();render(n.getFullYear(),n.getMonth());
      document.getElementById('cal-prev')?.addEventListener('click',()=>cm===0?render(cy-1,11):render(cy,cm-1));
      document.getElementById('cal-next')?.addEventListener('click',()=>cm===11?render(cy+1,0):render(cy,cm+1));
    }
  };
})();
window.CalWidget=CalWidget;

/* ================================================================
   #89 — HIDDEN FILE UPLOAD
================================================================ */
function initHiddenUpload(){
  const btn=document.getElementById('custom-upload-btn');
  const inp=document.getElementById('hidden-file-input');
  const name=document.getElementById('hidden-file-name');
  const prev=document.getElementById('hidden-file-preview');
  if(!btn||!inp)return;
  btn.addEventListener('click',()=>inp.click());
  inp.addEventListener('change',()=>{
    const f=inp.files[0];if(!f)return;
    if(name)name.textContent='File: '+f.name;
    if(prev&&f.type.startsWith('image/')){
      const r=new FileReader();
      r.onload=e=>{prev.src=e.target.result;prev.style.display='block';};
      r.readAsDataURL(f);
    }
  });
}

/* ================================================================
   #93 — UI FREEZE SIMULATION
================================================================ */
window.triggerUIFreeze=function(ms){
  ms=ms||3000;
  const btn=document.getElementById('freeze-btn');
  const res=document.getElementById('freeze-result');
  const st=document.getElementById('freeze-status');
  if(!btn)return;
  btn.disabled=true;
  if(st)st.textContent=`Freezing main thread for ${ms}ms...`;
  if(res)dH(res);
  setTimeout(()=>{
    const end=Date.now()+ms;
    while(Date.now()<end){/* intentional synchronous freeze */}
    btn.disabled=false;
    if(st)st.textContent='Thread unfrozen — result element now visible.';
    if(res)dS(res);
  },50);
};

/* ================================================================
   #96 — DATE FORMAT PER LOCALE
================================================================ */
window.updateLocaleDate=function(locale){
  const el=document.getElementById('locale-date-display');
  if(!el)return;
  const now=new Date();
  const d=String(now.getDate()).padStart(2,'0');
  const mo=String(now.getMonth()+1).padStart(2,'0');
  const y=now.getFullYear();
  const ddmm=['en','ar','hi'];
  const formatted=ddmm.includes(locale)?`${d}/${mo}/${y}`:`${mo}/${d}/${y}`;
  const fmt=ddmm.includes(locale)?'DD/MM/YYYY':'MM/DD/YYYY';
  el.textContent=formatted;
  el.setAttribute('data-format',fmt);
  el.setAttribute('data-locale',locale);
  const lbl=document.getElementById('date-format-label');
  if(lbl)lbl.textContent='Format: '+fmt;
};

/* ================================================================
   #119 — MULTI-PREDICATE XPATH LAB
================================================================ */
function initMultiPredicate(){
  document.querySelectorAll('.mp-btn').forEach(btn=>{
    btn.addEventListener('click',function(){
      const r=document.getElementById('mp-click-result');
      if(r){
        r.textContent='✅ Clicked: '+this.getAttribute('data-desc');
        r.style.color='#10b981';
      }
    });
  });
}

/* ================================================================
   #12 — INFINITE SCROLL
================================================================ */
const InfiniteScroll=(()=>{
  let page=0,loading=false;
  const NAMES=['Alice','Bob','Charlie','Diana','Eve','Frank','Grace','Henry'];
  const STATS=['Active','Pending','Inactive','Review'];
  function rows(p){
    const out=[];const s=p*15+1;
    for(let i=s;i<s+15;i++){
      out.push({id:i,name:NAMES[i%NAMES.length]+' #'+i,
        email:`user${i}@qa.test`,status:STATS[i%STATS.length],
        date:new Date(2024,0,(i%28)+1).toISOString().split('T')[0]});
    }
    return out;
  }
  function append(data){
    const tb=document.getElementById('inf-tbody');if(!tb)return;
    data.forEach(r=>{
      const tr=document.createElement('tr');
      tr.setAttribute('data-row-id',r.id);
      tr.innerHTML=`<td>${r.id}</td><td>${r.name}</td><td>${r.email}</td>
        <td><span class="sbadge sbadge-${r.status.toLowerCase()}">${r.status}</span></td>
        <td>${r.date}</td>`;
      tb.appendChild(tr);
    });
    const cnt=document.getElementById('inf-count');
    if(cnt)cnt.textContent=`Showing ${tb.children.length} records`;
  }
  function load(){
    if(loading)return;loading=true;
    const ldr=document.getElementById('inf-loader');if(ldr)ldr.style.display='flex';
    const delay=window.STABLE_MODE?0:700+Math.random()*600;
    setTimeout(()=>{append(rows(page++));loading=false;if(ldr)ldr.style.display='none';},delay);
  }
  return{init(){
    const c=document.getElementById('inf-container');if(!c)return;
    load();
    if(!window.STABLE_MODE)
      c.addEventListener('scroll',()=>{if(c.scrollTop+c.clientHeight>=c.scrollHeight-100)load();});
    else load();
  }};
})();
window.InfiniteScroll=InfiniteScroll;

/* ================================================================
   #16 — ACCORDION
================================================================ */
function initAccordion(){
  // Cache everything BEFORE any DOM removal — querySelector fails on detached nodes
  const rows=[...document.querySelectorAll('.acc-item')].map(item=>({
    body: item.querySelector('.acc-body'),
    icon: item.querySelector('.acc-icon'),
    header: item.querySelector('.acc-header'),
  }));

  // Close all except first
  rows.forEach((r,i)=>{ if(i!==0 && r.body) dH(r.body); });

  rows.forEach(r=>{
    if(!r.header||!r.body)return;
    r.header.addEventListener('click',()=>{
      const wasOpen=!r.body._domRemoved;
      // Close all and reset icons — use cached refs, not querySelector
      rows.forEach(x=>{
        if(x.body && !x.body._domRemoved) dH(x.body);
        if(x.icon) x.icon.textContent='+';
      });
      // Open clicked item if it was closed
      if(!wasOpen){
        dS(r.body);
        if(r.icon) r.icon.textContent='−';
      }
    });
  });
}

/* ================================================================
   #17 — EXPAND / COLLAPSE TREE MENU
================================================================ */
function initTreeMenu(){
  // Cache toggle→submenu pairs BEFORE any dH() call —
  // querySelector on a detached node always returns null.
  const pairs=[];
  document.querySelectorAll('.tree-toggle').forEach(toggle=>{
    const li=toggle.closest('li');
    if(!li)return;
    const sub=li.querySelector(':scope > ul');
    if(sub) pairs.push({toggle,sub});
  });

  // Hide all submenus and reset icons using cached refs
  pairs.forEach(p=>{dH(p.sub);p.toggle.textContent='▶';});

  // Click handlers use cached refs — no querySelector after removal
  pairs.forEach(p=>{
    p.toggle.addEventListener('click',e=>{
      e.stopPropagation();
      if(p.sub._domRemoved){dS(p.sub);p.toggle.textContent='▼';}
      else{dH(p.sub);p.toggle.textContent='▶';}
    });
  });

  // Leaf selection
  document.querySelectorAll('.tree-leaf').forEach(l=>{
    l.addEventListener('click',function(){
      document.querySelectorAll('.tree-leaf').forEach(x=>x.classList.remove('tree-active'));
      this.classList.add('tree-active');
      const r=document.getElementById('tree-result');
      if(r)r.textContent='Selected: '+this.textContent.trim();
    });
  });
}

/* ================================================================
   #59 — ANIMATION TIMING GATE
================================================================ */
window.triggerAnimPanel=function(){
  const panel=document.getElementById('anim-panel');
  const btn=document.getElementById('anim-action-btn');
  const st=document.getElementById('anim-status');
  if(!panel||!btn)return;
  btn.disabled=true;btn.style.pointerEvents='none';
  if(st)st.textContent='Panel animating... button is DISABLED';
  panel.style.display='block';
  panel.classList.remove('anim-in');
  void panel.offsetWidth;
  panel.classList.add('anim-in');
  panel.addEventListener('animationend',function once(){
    panel.removeEventListener('animationend',once);
    if(window.STABLE_MODE||true){/* always re-enable */}
    btn.disabled=false;btn.style.pointerEvents='';
    if(st)st.textContent='Animation done — button is now clickable ✅';
  },{once:true});
};
function initAnimTiming(){
  const btn=document.getElementById('anim-action-btn');
  if(!btn)return;
  btn.disabled=true;
  btn.addEventListener('click',()=>{
    const r=document.getElementById('anim-click-result');
    if(r){r.textContent='✅ Button clicked successfully after animation.';r.style.color='#10b981';}
  });
}

/* ================================================================
   #60 — HOVER-DEPENDENT SUBMENU
================================================================ */
function initHoverMenu(){
  // Wire hover show/hide with optional delay.
  // Delay prevents instant DOM-removal when cursor moves from parent → child submenu.
  function wireHover(trigger, sub, delayMs){
    if(!sub)return;
    dH(sub);
    let timer=null;
    function cancelHide(){if(timer){clearTimeout(timer);timer=null;}}
    function show(){cancelHide();dS(sub);}
    function hide(){
      cancelHide();
      if(delayMs>0){timer=setTimeout(()=>{dH(sub);timer=null;},delayMs);}
      else{dH(sub);}
    }
    trigger.addEventListener('mouseenter',show);
    trigger.addEventListener('mouseleave',hide);
    // Cursor entering the sub itself cancels the hide timer
    sub.addEventListener('mouseenter',cancelHide);
    sub.addEventListener('mouseleave',hide);
  }

  // L1 → L2
  document.querySelectorAll('#hoverMenu .hm-parent').forEach(parent=>{
    const delay=parseInt(parent.getAttribute('data-hm-delay'))||0;
    const sub=parent.querySelector(':scope > .hm-sub');
    wireHover(parent, sub, delay);

    // L2 → L3 (wired on detached sub — querySelector works on detached nodes)
    if(sub){
      sub.querySelectorAll('.hm-sub-parent').forEach(sub2parent=>{
        const delay2=parseInt(sub2parent.getAttribute('data-hm-delay'))||0;
        const sub2=sub2parent.querySelector(':scope > .hm-sub2');
        wireHover(sub2parent, sub2, delay2);
      });
    }
  });

  // Leaf click → show selected item name
  document.querySelectorAll('#hoverMenu .hm-sub li:not(.hm-sub-parent), #hoverMenu .hm-sub2 li').forEach(li=>{
    li.addEventListener('click',()=>{
      const r=document.getElementById('hm-result');
      if(r)r.textContent='✅ Selected: '+li.textContent.trim();
    });
  });
}

/* ================================================================
   #87 — CHAT STREAM
================================================================ */
const ChatStream=(()=>{
  const BOTS=['Hello! How can I assist you today?',
    'I understand your concern. Let me look into that.',
    'That\'s a great question — let me check the docs.',
    'Your issue has been escalated to the engineering team.',
    'Can you provide more details about the error?',
    'The system is processing your request. Please wait.',
    'I\'ve found 3 relevant articles that might help.',
    'Your ticket #'+Math.floor(Math.random()*90000+10000)+' has been created.'];
  let msgId=0;
  function appendMsg(text,role){
    const thread=document.getElementById('chat-thread');if(!thread)return;
    const wrap=document.createElement('div');
    wrap.className='cmsg cmsg-'+role;
    wrap.setAttribute('data-msg-id',++msgId);
    wrap.setAttribute('data-role',role);
    const bub=document.createElement('div');bub.className='cbubble';
    if(role==='bot'){
      let i=0;bub.textContent='';wrap.appendChild(bub);thread.appendChild(wrap);
      thread.scrollTop=thread.scrollHeight;
      const t=setInterval(()=>{bub.textContent+=text[i++];thread.scrollTop=thread.scrollHeight;if(i>=text.length)clearInterval(t);},28);
    }else{bub.textContent=text;wrap.appendChild(bub);thread.appendChild(wrap);thread.scrollTop=thread.scrollHeight;}
  }
  function send(){
    const inp=document.getElementById('chat-input');if(!inp||!inp.value.trim())return;
    const txt=inp.value.trim();inp.value='';
    appendMsg(txt,'user');
    const thread=document.getElementById('chat-thread');
    const ty=document.createElement('div');ty.id='chat-typing';ty.className='cmsg cmsg-bot';
    ty.innerHTML='<div class="cbubble ctyping"><span></span><span></span><span></span></div>';
    thread.appendChild(ty);thread.scrollTop=thread.scrollHeight;
    const delay=window.STABLE_MODE?400:1200+Math.random()*2000;
    setTimeout(()=>{
      if(ty.parentNode)ty.parentNode.removeChild(ty);
      appendMsg(BOTS[Math.floor(Math.random()*BOTS.length)],'bot');
    },delay);
  }
  return{init(){
    document.getElementById('chat-send')?.addEventListener('click',send);
    document.getElementById('chat-input')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
    setTimeout(()=>appendMsg('👋 Welcome to QA Chat Playground. Type a message!','bot'),500);
  }};
})();
window.ChatStream=ChatStream;

/* ================================================================
   #90 — DRAG & DROP
================================================================ */
const DragDrop=(()=>{
  let src=null;
  return{init(){
    const itemsContainer=document.querySelector('.dd-items');
    const zone=document.getElementById('dd-zone');
    const res=document.getElementById('dd-result');

    // Draggable items — listeners stay on the element itself so they work
    // whether the item is in dd-items or dd-zone
    document.querySelectorAll('.dd-item').forEach(el=>{
      el.setAttribute('draggable','true');
      el.addEventListener('dragstart',e=>{
        src=el;
        e.dataTransfer.setData('text/plain',el.getAttribute('data-id'));
        el.classList.add('dd-dragging');
      });
      el.addEventListener('dragend',()=>{el.classList.remove('dd-dragging');src=null;});
    });

    // Helper: wire a container as a drop target
    function makeDropTarget(target, onDrop){
      target.addEventListener('dragover',e=>{
        e.preventDefault();target.classList.add('dd-hover');
      });
      target.addEventListener('dragleave',e=>{
        // Only remove highlight when cursor leaves the target itself, not a child
        if(!target.contains(e.relatedTarget))target.classList.remove('dd-hover');
      });
      target.addEventListener('drop',e=>{
        e.preventDefault();target.classList.remove('dd-hover');
        const id=e.dataTransfer.getData('text/plain');
        const item=document.querySelector(`[data-id="${id}"]`);
        if(!item||!src)return;
        onDrop(item,target);
      });
    }

    // Forward drop: dd-items → dd-zone
    if(zone){
      makeDropTarget(zone,(item)=>{
        zone.appendChild(item);
        item.classList.add('dd-dropped');
        if(res){res.textContent=`✅ "${item.textContent.trim()}" dropped into zone!`;res.style.color='#10b981';}
      });
    }

    // Return drop: dd-zone → dd-items (drag back to restore original position)
    if(itemsContainer){
      makeDropTarget(itemsContainer,(item)=>{
        // Only accept items that came FROM the zone
        if(!item.classList.contains('dd-dropped'))return;
        itemsContainer.appendChild(item);
        item.classList.remove('dd-dropped');
        if(res){res.textContent=`↩️ "${item.textContent.trim()}" returned to tray.`;res.style.color='#6366f1';}
      });
    }
    // Sortable list
    let sortSrc=null;
    document.querySelectorAll('.sort-item').forEach(el=>{
      el.setAttribute('draggable','true');
      el.addEventListener('dragstart',()=>{sortSrc=el;el.classList.add('dd-dragging');});
      el.addEventListener('dragend',()=>{el.classList.remove('dd-dragging');document.querySelectorAll('.sort-item').forEach(x=>x.classList.remove('dd-over'));});
      el.addEventListener('dragover',e=>{e.preventDefault();if(el!==sortSrc)el.classList.add('dd-over');});
      el.addEventListener('dragleave',()=>el.classList.remove('dd-over'));
      el.addEventListener('drop',e=>{
        e.preventDefault();el.classList.remove('dd-over');
        if(sortSrc&&sortSrc!==el){
          const n=sortSrc.nextSibling;
          el.parentNode.insertBefore(sortSrc,el);
          if(n)el.parentNode.insertBefore(el,n);else el.parentNode.appendChild(el);
        }
      });
    });
  }};
})();
window.DragDrop=DragDrop;

/* ================================================================
   #95 — CAPTCHA SIMULATION
================================================================ */
const CaptchaSim=(()=>{
  const CATS=[{l:'traffic lights',e:'🚦'},{l:'cars',e:'🚗'},{l:'bicycles',e:'🚲'},
              {l:'buses',e:'🚌'},{l:'fire hydrants',e:'🔴'},{l:'crosswalks',e:'🚶'}];
  const ALL=[{e:'🚦',c:'traffic lights'},{e:'🚗',c:'cars'},{e:'🏠',c:'buildings'},
             {e:'🚲',c:'bicycles'},{e:'🌳',c:'trees'},{e:'🚌',c:'buses'},
             {e:'🔴',c:'fire hydrants'},{e:'🚶',c:'crosswalks'},{e:'🏔️',c:'mountains'}];
  let target=null,tiles=[],sel=new Set();
  function generate(){
    target=CATS[Math.floor(Math.random()*CATS.length)];sel.clear();
    const grid=document.getElementById('cap-grid');
    const lbl=document.getElementById('cap-label');
    const msg=document.getElementById('cap-msg');
    if(!grid||!lbl)return;
    lbl.textContent=`Select all images containing ${target.l}`;
    msg.textContent='';
    // Re-enable verify button in case it was disabled by a previous successful verify
    const verifyBtn=document.getElementById('cap-verify');
    if(verifyBtn)verifyBtn.disabled=false;
    const correct=[{e:target.e,c:target.l},{e:target.e,c:target.l},{e:target.e,c:target.l}];
    const dist=ALL.filter(t=>t.c!==target.l);
    const sh=a=>[...a].sort(()=>Math.random()-.5);
    tiles=sh([...correct,...sh(dist).slice(0,6)]);
    grid.innerHTML='';
    tiles.forEach((t,i)=>{
      const d=document.createElement('div');
      d.className='cap-tile';d.id=`cap-tile-${i}`;d.textContent=t.e;
      d.setAttribute('data-cat',t.c);
      d.addEventListener('click',()=>{
        sel.has(i)?sel.delete(i):sel.add(i);
        d.classList.toggle('cap-sel');
      });
      grid.appendChild(d);
    });
  }
  function verify(){
    const msg=document.getElementById('cap-msg');
    const correct=new Set(tiles.map((t,i)=>t.c===target.l?i:-1).filter(i=>i>=0));
    const ok=[...sel].every(i=>correct.has(i))&&[...correct].every(i=>sel.has(i))&&sel.size>0;
    if(ok){
      msg.textContent='✅ CAPTCHA verified! Proceeding...';msg.style.color='#10b981';
      document.getElementById('cap-verify')&&(document.getElementById('cap-verify').disabled=true);
    }else{
      msg.textContent='❌ Incorrect. Please try again.';msg.style.color='#ef4444';
      setTimeout(generate,1200);
    }
  }
  return{init(){
    generate();
    document.getElementById('cap-verify')?.addEventListener('click',verify);
    document.getElementById('cap-refresh')?.addEventListener('click',generate);
  }};
})();
window.CaptchaSim=CaptchaSim;

/* ================================================================
   #101 — SLIDER CONTROLS
================================================================ */
const SliderControls=(()=>{
  function nativeSlider(){
    const s=document.getElementById('native-slider');
    const d=document.getElementById('native-slider-val');
    if(!s||!d)return;
    d.textContent=s.value;
    s.addEventListener('input',()=>d.textContent=s.value);
  }
  function priceRange(){
    const mn=document.getElementById('pr-min'),mx=document.getElementById('pr-max');
    const md=document.getElementById('pr-min-d'),xd=document.getElementById('pr-max-d');
    if(!mn||!mx)return;
    function upd(){const a=+mn.value,b=+mx.value;if(md)md.textContent='$'+Math.min(a,b);if(xd)xd.textContent='$'+Math.max(a,b);}
    mn.addEventListener('input',upd);mx.addEventListener('input',upd);upd();
  }
  function customSlider(){
    const track=document.getElementById('cs-track');
    const thumb=document.getElementById('cs-thumb');
    const fill=document.getElementById('cs-fill');
    const disp=document.getElementById('cs-val');
    if(!track||!thumb)return;
    let drag=false;
    function calc(cx){
      const r=track.getBoundingClientRect();
      const ratio=Math.max(0,Math.min(1,(cx-r.left)/r.width));
      const v=Math.round(ratio*100);
      thumb.style.left=(ratio*100)+'%';
      if(fill)fill.style.width=(ratio*100)+'%';
      if(disp)disp.textContent=v;
      thumb.setAttribute('aria-valuenow',v);
    }
    thumb.addEventListener('mousedown',e=>{drag=true;e.preventDefault();});
    document.addEventListener('mousemove',e=>{if(drag)calc(e.clientX);});
    document.addEventListener('mouseup',()=>drag=false);
    thumb.addEventListener('touchstart',e=>{drag=true;e.preventDefault();},{passive:false});
    document.addEventListener('touchmove',e=>{if(drag)calc(e.touches[0].clientX);},{passive:false});
    document.addEventListener('touchend',()=>drag=false);
  }
  return{init(){nativeSlider();priceRange();customSlider();}};
})();
window.SliderControls=SliderControls;

/* ================================================================
   #102 — KEYBOARD-ONLY NAVIGATION
================================================================ */
function initKeyboardNav(){
  const secret=document.getElementById('kb-secret-menu');
  const trap=document.getElementById('kb-focus-trap');
  if(secret)dH(secret);
  if(trap){
    trap.addEventListener('focusin',()=>{if(secret)dS(secret);});
    trap.addEventListener('focusout',e=>{if(!trap.contains(e.relatedTarget)&&secret)dH(secret);});
  }
  const card=document.getElementById('kb-enter-card');
  const modal=document.getElementById('kb-modal');
  const closeBtn=document.getElementById('kb-modal-close'); // cache BEFORE dH removes modal from DOM
  if(card&&modal){
    dH(modal);
    card.addEventListener('keydown',e=>{if(e.key==='Enter'){dS(modal);modal.style.display='flex';}});
  }
  closeBtn?.addEventListener('click',()=>{if(modal){modal.style.display='none';dH(modal);}});
  document.querySelectorAll('[data-tab-label]').forEach(el=>{
    el.addEventListener('focus',()=>{
      const ind=document.getElementById('tab-ind');
      if(ind)ind.textContent='Focused: '+el.getAttribute('data-tab-label');
    });
  });
}

/* ================================================================
   SECTION VISIBILITY TRACKER — auto-init on show()
================================================================ */
(function(){
  const inited=new Set();
  const MAP={
    dynamicElements:()=>{initFrameworkAttrs();initTooltips();initMultiPredicate();},
    forms:()=>{initFocusValidation();CalWidget.init();initHiddenUpload();},
    env:()=>initMobileNav(),
    infiniteScroll:()=>InfiniteScroll.init(),
    accordion:()=>initAccordion(),
    expandMenu:()=>initTreeMenu(),
    animationTiming:()=>initAnimTiming(),
    hoverMenu:()=>initHoverMenu(),
    chatStream:()=>ChatStream.init(),
    dragDrop:()=>DragDrop.init(),
    captchaSection:()=>CaptchaSim.init(),
    sliderControls:()=>SliderControls.init(),
    keyboardNav:()=>initKeyboardNav(),
    dashboardSection:()=>{initDashboard();initNotifications();},
    toastMessages:()=>initToastSection(),
    calendarPicker:()=>initCalendarPicker(),
    lazyLoadSection:()=>LazyLoad.init(),
    canvasChart:()=>CanvasChart.init(),
    svgGraph:()=>SvgGraph.init(),
  };

  function tryInit(id){
    if(inited.has(id))return;
    const el=document.getElementById(id);
    if(!el||el._domRemoved)return;
    inited.add(id);
    MAP[id]&&MAP[id]();
  }

  document.addEventListener('DOMContentLoaded',()=>{
    // Page-level inits
    initCookieBanner();
    initHashRouting();
    initNotifications();

    // Hook show() to fire section init
    const _orig=window.show;
    if(_orig){
      window.show=function(section){
        _orig(section);
        setTimeout(()=>tryInit(section),120);
      };
    }

    // Locale change → update date display
    document.addEventListener('change',e=>{
      if(e.target.id==='localeSelect')
        setTimeout(()=>window.updateLocaleDate&&window.updateLocaleDate(e.target.value),60);
    });

    // Try default section
    setTimeout(()=>tryInit('dynamicElements'),200);
  });
})();

/* ================================================================
   CALENDAR / DATE PICKER — nsdateformatter-style pattern playground
================================================================ */
function initCalendarPicker(){
  const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const pad=n=>String(n).padStart(2,'0');

  const TOKENS=[
    {token:'yyyy', desc:'4-digit year',          fn:d=>String(d.getFullYear())},
    {token:'yy',   desc:'2-digit year',          fn:d=>String(d.getFullYear()).slice(-2)},
    {token:'MMMM', desc:'Full month name',        fn:d=>MONTHS[d.getMonth()]},
    {token:'MMM',  desc:'Short month name',       fn:d=>MONTHS[d.getMonth()].slice(0,3)},
    {token:'MM',   desc:'Month number (padded)',  fn:d=>pad(d.getMonth()+1)},
    {token:'M',    desc:'Month number',           fn:d=>String(d.getMonth()+1)},
    {token:'dd',   desc:'Day of month (padded)',  fn:d=>pad(d.getDate())},
    {token:'d',    desc:'Day of month',           fn:d=>String(d.getDate())},
    {token:'EEEE', desc:'Full weekday name',      fn:d=>DAYS[d.getDay()]},
    {token:'EEE',  desc:'Short weekday name',     fn:d=>DAYS[d.getDay()].slice(0,3)},
    {token:'E',    desc:'Min weekday letter',     fn:d=>DAYS[d.getDay()][0]},
    {token:'HH',   desc:'Hour 0-23 (padded)',     fn:d=>pad(d.getHours())},
    {token:'H',    desc:'Hour 0-23',              fn:d=>String(d.getHours())},
    {token:'hh',   desc:'Hour 1-12 (padded)',     fn:d=>pad(d.getHours()%12||12)},
    {token:'h',    desc:'Hour 1-12',              fn:d=>String(d.getHours()%12||12)},
    {token:'mm',   desc:'Minutes (padded)',        fn:d=>pad(d.getMinutes())},
    {token:'ss',   desc:'Seconds (padded)',        fn:d=>pad(d.getSeconds())},
    {token:'SSS',  desc:'Milliseconds',           fn:d=>String(d.getMilliseconds()).padStart(3,'0')},
    {token:'a',    desc:'AM / PM',                fn:d=>d.getHours()<12?'AM':'PM'},
    {token:'z',    desc:'Timezone name',          fn:d=>{const o=d.getTimezoneOffset(),s=o<=0?'+':'-',ah=pad(Math.floor(Math.abs(o)/60)),am=pad(Math.abs(o)%60);return'GMT'+s+ah+am;}},
    {token:'Z',    desc:'Timezone offset',        fn:d=>{const o=d.getTimezoneOffset(),s=o<=0?'+':'-',ah=pad(Math.floor(Math.abs(o)/60)),am=pad(Math.abs(o)%60);return s+ah+am;}},
    {token:'X',    desc:'ISO 8601 timezone',      fn:d=>{const o=d.getTimezoneOffset();if(o===0)return'Z';const s=o<0?'+':'-',ah=pad(Math.floor(Math.abs(o)/60)),am=pad(Math.abs(o)%60);return s+ah+':'+am;}},
    {token:'Q',    desc:'Quarter of year',        fn:d=>'Q'+Math.ceil((d.getMonth()+1)/3)},
    {token:'WW',   desc:'Week of year (padded)',  fn:d=>{const s=new Date(d.getFullYear(),0,1);return pad(Math.ceil(((d-s)/86400000+s.getDay()+1)/7));}},
    {token:'W',    desc:'Week of year',           fn:d=>{const s=new Date(d.getFullYear(),0,1);return String(Math.ceil(((d-s)/86400000+s.getDay()+1)/7));}},
    {token:'DDD',  desc:'Day of year (3-digit)',  fn:d=>{const s=new Date(d.getFullYear(),0,0);return String(Math.floor((d-s)/86400000)).padStart(3,'0');}},
    {token:'D',    desc:'Day of year',            fn:d=>{const s=new Date(d.getFullYear(),0,0);return String(Math.floor((d-s)/86400000));}},
  ];

  const SORTED=[...TOKENS].sort((a,b)=>b.token.length-a.token.length);

  function applyPattern(date,pattern){
    let result='',i=0;
    while(i<pattern.length){
      if(pattern[i]==="'"){
        let j=i+1;
        while(j<pattern.length&&pattern[j]!=="'")j++;
        result+=pattern.slice(i+1,j);
        i=j+1;continue;
      }
      let matched=false;
      for(const tok of SORTED){
        if(pattern.startsWith(tok.token,i)){result+=tok.fn(date);i+=tok.token.length;matched=true;break;}
      }
      if(!matched){result+=pattern[i];i++;}
    }
    return result;
  }

  const QUICK=[
    {label:'ISO 8601',        pattern:'yyyy-MM-dd'},
    {label:'US Date',         pattern:'MM/dd/yyyy'},
    {label:'EU Date',         pattern:'dd/MM/yyyy'},
    {label:'Full Date',       pattern:'EEEE, MMMM d, yyyy'},
    {label:'Short Date',      pattern:'MMM d, yyyy'},
    {label:'Date + Time',     pattern:'yyyy-MM-dd HH:mm:ss'},
    {label:'12h Time',        pattern:'h:mm:ss a'},
    {label:'24h Time',        pattern:'HH:mm:ss'},
    {label:'Dotted EU',       pattern:'dd.MM.yyyy'},
    {label:'Compact',         pattern:'yyyyMMdd'},
    {label:'With TZ',         pattern:'yyyy-MM-dd HH:mm:ss Z'},
    {label:'ISO Full',        pattern:"yyyy-MM-dd'T'HH:mm:ssX"},
    {label:'Month Year',      pattern:'MMMM yyyy'},
    {label:'Weekday+Time',    pattern:'EEE, MMM d HH:mm'},
    {label:'Verbose',         pattern:"EEEE 'the' d 'of' MMMM yyyy 'at' h:mm a"},
    {label:'Quarter',         pattern:"'Q'Q yyyy"},
    {label:'Log Timestamp',   pattern:'yyyy-MM-dd HH:mm:ss.SSS'},
    {label:'Week of Year',    pattern:"'Week' WW 'of' yyyy"},
  ];

  const ALL_PATTERNS=[
    {name:'ISO 8601 Date',        pattern:'yyyy-MM-dd'},
    {name:'US Date',              pattern:'MM/dd/yyyy'},
    {name:'EU Date',              pattern:'dd/MM/yyyy'},
    {name:'Dotted (DD.MM.YYYY)',  pattern:'dd.MM.yyyy'},
    {name:'Compact (YYYYMMDD)',   pattern:'yyyyMMdd'},
    {name:'Short Month',          pattern:'MMM d, yyyy'},
    {name:'Full Month',           pattern:'MMMM d, yyyy'},
    {name:'Full Weekday',         pattern:'EEEE, MMMM d, yyyy'},
    {name:'Month + Year',         pattern:'MMMM yyyy'},
    {name:'Short Month + Year',   pattern:'MMM yyyy'},
    {name:'24h Time',             pattern:'HH:mm:ss'},
    {name:'12h Time',             pattern:'h:mm:ss a'},
    {name:'Time (no seconds)',    pattern:'HH:mm'},
    {name:'12h (no seconds)',     pattern:'h:mm a'},
    {name:'Date + 24h Time',      pattern:'yyyy-MM-dd HH:mm:ss'},
    {name:'Date + 12h Time',      pattern:'MM/dd/yyyy h:mm a'},
    {name:'ISO with Timezone',    pattern:'yyyy-MM-dd HH:mm:ss Z'},
    {name:'ISO 8601 Full',        pattern:"yyyy-MM-dd'T'HH:mm:ssX"},
    {name:'RFC 2822 Style',       pattern:'EEE, dd MMM yyyy HH:mm:ss Z'},
    {name:'Log Timestamp',        pattern:'yyyy-MM-dd HH:mm:ss.SSS'},
    {name:'Verbose Date',         pattern:"EEEE 'the' d 'of' MMMM yyyy"},
    {name:'Verbose + Time',       pattern:"EEEE 'the' d 'of' MMMM yyyy 'at' h:mm a"},
    {name:'Quarter',              pattern:"'Q'Q yyyy"},
    {name:'Week of Year',         pattern:"'Week' WW 'of' yyyy"},
    {name:'Day of Year',          pattern:'DDD'},
    {name:'Weekday + Short Date', pattern:'EEE, MMM d'},
    {name:'Timezone Offset',      pattern:'Z'},
    {name:'ISO Timezone',         pattern:'X'},
    {name:'With Milliseconds',    pattern:'HH:mm:ss.SSS'},
    {name:'Day + Short Month',    pattern:'d MMM'},
    {name:'Day Name Only',        pattern:'EEEE'},
    {name:'Month Name Only',      pattern:'MMMM'},
    {name:'4-Digit Year',         pattern:'yyyy'},
    {name:'2-Digit Year',         pattern:'yy'},
  ];

  const TODAY=new Date();
  const toLocalISO=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes());

  const refInput=document.getElementById('cal-ref-datetime');
  const patInput=document.getElementById('cal-pattern');
  const resultEl=document.getElementById('cal-result');
  if(refInput) refInput.value=toLocalISO(TODAY);

  function getRef(){return refInput&&refInput.value?new Date(refInput.value):TODAY;}
  function update(){
    const d=getRef(),pat=patInput?patInput.value:'yyyy-MM-dd',out=applyPattern(d,pat);
    if(resultEl){resultEl.textContent=out;resultEl.setAttribute('data-formatted',out);}
  }
  if(refInput) refInput.addEventListener('input',update);
  if(patInput) patInput.addEventListener('input',update);

  // Chips
  const chipsEl=document.getElementById('cal-chips');
  if(chipsEl) QUICK.forEach(qp=>{
    const btn=document.createElement('button');
    btn.textContent=qp.label;
    btn.setAttribute('data-pattern',qp.pattern);
    btn.style.cssText='padding:4px 10px;border:1px solid var(--border);border-radius:20px;background:#fff;font-size:12px;cursor:pointer;transition:all .15s;color:#374151;';
    btn.onmouseover=()=>{btn.style.background='#6366f1';btn.style.color='#fff';btn.style.borderColor='#6366f1';};
    btn.onmouseout=()=>{btn.style.background='#fff';btn.style.color='#374151';btn.style.borderColor='var(--border)';};
    btn.onclick=()=>{if(patInput){patInput.value=qp.pattern;update();}};
    chipsEl.appendChild(btn);
  });

  // All patterns grid
  const allEl=document.getElementById('cal-all-patterns');
  if(allEl){
    ALL_PATTERNS.forEach(ap=>{
      const preview=applyPattern(TODAY,ap.pattern);
      const row=document.createElement('div');
      row.setAttribute('data-pattern-name',ap.name);
      row.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 12px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:#fff;transition:background .15s;overflow:hidden;';
      row.innerHTML='<span style="font-size:12px;font-weight:600;color:var(--muted);width:150px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+ap.name+'</span>'+
        '<span style="font-size:12px;color:#6366f1;font-family:monospace;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+ap.pattern+'</span>'+
        '<span style="font-size:13px;font-weight:700;color:#111827;font-family:monospace;white-space:nowrap;flex-shrink:0;max-width:200px;overflow:hidden;text-overflow:ellipsis;" data-preview="'+ap.name+'">'+preview+'</span>';
      row.onmouseover=()=>row.style.background='#f5f3ff';
      row.onmouseout=()=>row.style.background='#fff';
      row.onclick=()=>{if(patInput){patInput.value=ap.pattern;update();}};
      allEl.appendChild(row);
    });
    if(refInput) refInput.addEventListener('input',()=>{
      const d=getRef();
      ALL_PATTERNS.forEach(ap=>{
        const el=allEl.querySelector('[data-preview="'+ap.name+'"]');
        if(el) el.textContent=applyPattern(d,ap.pattern);
      });
    });
  }

  // Native input constraints
  const todayStr=String(TODAY.getFullYear())+'-'+pad(TODAY.getMonth()+1)+'-'+pad(TODAY.getDate());
  const elMin=document.getElementById('cal-min'),elMax=document.getElementById('cal-max');
  const elRO=document.getElementById('cal-readonly'),elDis=document.getElementById('cal-disabled');
  const elDate=document.getElementById('cal-date');
  if(elMin){elMin.min=todayStr;elMin.value=todayStr;}
  if(elMax){elMax.max=todayStr;elMax.value=todayStr;}
  if(elRO)  elRO.value=todayStr;
  if(elDis) elDis.value=todayStr;
  if(elDate)elDate.value=todayStr;

  update();
}
