/* ======================================================
   Shadow DOM Simulator
====================================================== */

(function(){

const hostId="shadow-host";
const sectionId="shadow";

function host(){
  return document.getElementById(hostId);
}

function clearHost(){
  const h=host();
  if(h) h.innerHTML="";
}

/* ======================================================
   SCENARIOS
====================================================== */

function basicShadow(){
  const h=document.createElement("div");
  const shadow=h.attachShadow({mode:"open"});
  shadow.innerHTML=`<button>Shadow Button</button>`;
  host()?.appendChild(h);
}

function nestedShadow(){
  const h=document.createElement("div");
  const s1=h.attachShadow({mode:"open"});

  const inner=document.createElement("div");
  const s2=inner.attachShadow({mode:"open"});
  s2.innerHTML=`<p>Deep Shadow Text</p>`;

  s1.appendChild(inner);
  host()?.appendChild(h);
}

function dynamicShadow(){
  setTimeout(()=>{
    const h=document.createElement("div");
    const shadow=h.attachShadow({mode:"open"});
    shadow.innerHTML=`<p>Loaded after delay</p>`;
    host()?.appendChild(h);
  },3000);
}

function closedShadow(){
  const h=document.createElement("div");
  h.attachShadow({mode:"closed"})
   .innerHTML=`<p>Closed Shadow Root</p>`;
  host()?.appendChild(h);
}

function shadowInput(){
  const h=document.createElement("div");
  const shadow=h.attachShadow({mode:"open"});
  shadow.innerHTML=`<input placeholder="Type inside shadow"/>`;
  host()?.appendChild(h);
}

function shadowButton(){
  const h=document.createElement("div");
  const shadow=h.attachShadow({mode:"open"});

  shadow.innerHTML=`
    <button id="actionBtn">Click Me</button>
    <p id="result"></p>
  `;

  shadow.getElementById("actionBtn").onclick=()=>{
    shadow.getElementById("result").textContent="Clicked!";
  };

  host()?.appendChild(h);
}

function shadowTextUpdate(){
  const h=document.createElement("div");
  const shadow=h.attachShadow({mode:"open"});
  shadow.innerHTML=`<p id="status">Pending</p>`;
  host()?.appendChild(h);

  const states=["Pending","Processing","Completed"];
  let i=0;

  const interval=setInterval(()=>{
    const el=shadow.getElementById("status");
    if(!el) return clearInterval(interval);
    el.textContent=states[i++];
    if(i>=states.length) clearInterval(interval);
  },2000);
}

function disappearingShadow(){
  const h=document.createElement("div");
  const shadow=h.attachShadow({mode:"open"});
  shadow.innerHTML=`<p>Temporary Shadow Element</p>`;
  host()?.appendChild(h);

  setTimeout(()=>h.remove(),5000);
}

function multipleShadow(){
  for(let i=1;i<=3;i++){
    const h=document.createElement("div");
    const shadow=h.attachShadow({mode:"open"});
    shadow.innerHTML=`<button>Shadow Button ${i}</button>`;
    host()?.appendChild(h);
  }
}

function replaceShadow(){
  const h=document.createElement("div");
  host()?.appendChild(h);

  function render(){
    if(!h.shadowRoot){
      h.attachShadow({mode:"open"});
    }
    h.shadowRoot.innerHTML=
      `<p>Instance ${Math.floor(Math.random()*100)}</p>`;
    setTimeout(render,4000);
  }

  render();
}

/* ======================================================
   CONTROLLER
====================================================== */

function startShadowMode(){

  const dropdown=document.getElementById("shadowMode");
  if(!dropdown) return;

  clearHost();

  const modes={
    basic:basicShadow,
    nested:nestedShadow,
    dynamic:dynamicShadow,
    closed:closedShadow,
    input:shadowInput,
    button:shadowButton,
    textUpdate:shadowTextUpdate,
    disappear:disappearingShadow,
    multiple:multipleShadow,
    replace:replaceShadow
  };

  modes[dropdown.value]?.();
}

window.initShadowSimulator=function(){

  const dropdown=document.getElementById("shadowMode");
  if(!dropdown) return;

  dropdown.onchange=startShadowMode;

  startShadowMode();
};

/* ======================================================
   ⭐ REAL FIX — VISIBILITY WATCHER
====================================================== */

let initialized=false;

function tryInit(){

  const section=document.getElementById(sectionId);
  if(!section) return;

  const visible=section.offsetParent!==null;

  if(visible && !initialized){
    initialized=true;
    window.initShadowSimulator();
  }

  if(!visible){
    initialized=false;
  }
}

/* Detect ANY navigation */
document.addEventListener("click",()=>setTimeout(tryInit,50));
document.addEventListener("keyup",()=>setTimeout(tryInit,50));

/* safety loop (SPA friendly) */
setInterval(tryInit,500);

/* first load */
document.addEventListener("DOMContentLoaded",tryInit);

})();