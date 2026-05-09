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
   HELPER — attach shadow or use plain div in stable mode
====================================================== */

function makeRoot(host){
  if(window.STABLE_MODE){
    // Return a plain div so all elements are in regular DOM
    const div=document.createElement("div");
    host.appendChild(div);
    return div;
  }
  return host.attachShadow({mode:"open"});
}

/* ======================================================
   SCENARIOS
====================================================== */

function basicShadow(){
  const h=document.createElement("div");
  const root=makeRoot(h);
  root.innerHTML=`<button>Shadow Button</button>`;
  host()?.appendChild(h);
}

function nestedShadow(){
  const h=document.createElement("div");

  if(window.STABLE_MODE){
    // Flat regular DOM — same content, no shadow nesting
    h.innerHTML=`<div><p>Deep Shadow Text</p></div>`;
    host()?.appendChild(h);
    return;
  }

  const s1=h.attachShadow({mode:"open"});
  const inner=document.createElement("div");
  const s2=inner.attachShadow({mode:"open"});
  s2.innerHTML=`<p>Deep Shadow Text</p>`;
  s1.appendChild(inner);
  host()?.appendChild(h);
}

function dynamicShadow(){
  if(window.STABLE_MODE){
    // Show immediately — no delay in stable mode
    const h=document.createElement("div");
    h.innerHTML=`<p>Loaded after delay</p>`;
    host()?.appendChild(h);
    return;
  }
  setTimeout(()=>{
    const h=document.createElement("div");
    const shadow=h.attachShadow({mode:"open"});
    shadow.innerHTML=`<p>Loaded after delay</p>`;
    host()?.appendChild(h);
  },3000);
}

function closedShadow(){
  const h=document.createElement("div");
  if(window.STABLE_MODE){
    h.innerHTML=`<p>Closed Shadow Root</p>`;
  } else {
    h.attachShadow({mode:"closed"})
     .innerHTML=`<p>Closed Shadow Root</p>`;
  }
  host()?.appendChild(h);
}

function shadowInput(){
  const h=document.createElement("div");
  const root=makeRoot(h);
  root.innerHTML=`<input placeholder="Type inside shadow"/>`;
  host()?.appendChild(h);
}

function shadowButton(){
  const h=document.createElement("div");
  const root=makeRoot(h);

  root.innerHTML=`
    <button id="actionBtn">Click Me</button>
    <p id="result"></p>
  `;

  // querySelector works on both shadow root and plain div
  root.querySelector("#actionBtn").onclick=()=>{
    root.querySelector("#result").textContent="Clicked!";
  };

  host()?.appendChild(h);
}

function shadowTextUpdate(){
  const h=document.createElement("div");
  const root=makeRoot(h);
  root.innerHTML=`<p id="status">Pending</p>`;
  host()?.appendChild(h);

  if(window.STABLE_MODE){
    // Show final state immediately — no timer
    root.querySelector("#status").textContent="Completed";
    return;
  }

  const states=["Pending","Processing","Completed"];
  let i=0;

  const interval=setInterval(()=>{
    const el=root.querySelector("#status");
    if(!el) return clearInterval(interval);
    el.textContent=states[i++];
    if(i>=states.length) clearInterval(interval);
  },2000);
}

function disappearingShadow(){
  const h=document.createElement("div");
  const root=makeRoot(h);
  root.innerHTML=`<p>Temporary Shadow Element</p>`;
  host()?.appendChild(h);

  // Only disappear in dynamic mode
  if(!window.STABLE_MODE){
    setTimeout(()=>h.remove(),5000);
  }
}

function multipleShadow(){
  for(let i=1;i<=3;i++){
    const h=document.createElement("div");
    const root=makeRoot(h);
    root.innerHTML=`<button>Shadow Button ${i}</button>`;
    host()?.appendChild(h);
  }
}

function replaceShadow(){
  const h=document.createElement("div");
  host()?.appendChild(h);

  if(window.STABLE_MODE){
    // Fixed instance — no random replacement timer
    h.innerHTML=`<p>Instance 42</p>`;
    return;
  }

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