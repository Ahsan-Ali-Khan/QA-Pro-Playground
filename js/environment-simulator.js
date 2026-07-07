/*
 * Copyright © 2026 Ahsan Ali Khan
 * QA Pro Playground
 * All Rights Reserved.
 *
 * Unauthorized copying, modification, distribution, reverse engineering,
 * or commercial use of this software is prohibited without prior written
 * permission from the copyright owner.
 *
 * Contact: ahsan.ali@webomates.com
 */

/* ======================================================
   REAL ENVIRONMENT LOCATOR LAB
====================================================== */

(function(){

const hostId="env-host";
const sectionId="env";
let _inited=false;
let _pollTimer=null;

function host(){
  return document.getElementById(hostId);
}

/* ======================================================
   APPLICATION CONTEXT
====================================================== */

const AppContext={
  env:"QA",
  locale:"en",
  browser:"Chrome",
  device:"Desktop",
  feature:"Old Checkout",
  theme:"Light"
};

/* ======================================================
   LOCALE TRANSLATIONS (REAL i18n)
====================================================== */

const i18n={
  en:{login:"Login"},
  fr:{login:"Connexion"},
  de:{login:"Anmelden"},
  hi:{login:"लॉगिन"},
  ar:{login:"تسجيل الدخول"}
};

/* ======================================================
   RENDER ENGINE (LIKE REACT APP)
====================================================== */

function render(){

  const h=host();
  if(!h) return;

  const text=i18n[AppContext.locale].login;

  /* ENV DIFFERENCE */
  let loginButton="";

  if(AppContext.env==="QA"){
    loginButton=`<button id="loginBtn">${text}</button>`;
  }

  if(AppContext.env==="UAT"){
    loginButton=`<button data-test="login">${text}</button>`;
  }

  if(AppContext.env==="PROD"){
    loginButton=`<button class="btn-primary">${text}</button>`;
  }

  /* BROWSER DIFFERENCE */

  let input="";

  if(AppContext.browser==="Chrome")
    input=`<input placeholder="Email"/>`;

  if(AppContext.browser==="Firefox")
    input=`<input aria-label="Email Field"/>`;

  if(AppContext.browser==="Safari")
    input=`<input class="email-input"/>`;

  /* DATE FIELD — format changes per browser */
  const now=new Date();
  const pad=n=>String(n).padStart(2,'0');
  const Y=now.getFullYear(), M=pad(now.getMonth()+1), D=pad(now.getDate());
  const H=pad(now.getHours()), Min=pad(now.getMinutes()), S=pad(now.getSeconds());

  let dateField="";
  if(AppContext.browser==="Chrome"){
    // Chrome native date input renders as MM/DD/YYYY internally
    dateField=`<label style="display:block;margin-top:10px;font-size:12px;font-weight:600;">Date (Chrome — MM/DD/YYYY)</label>`+
      `<input id="env-date-field" type="date" value="${Y}-${M}-${D}" data-date-format="MM/DD/YYYY" style="margin-top:4px;padding:6px 10px;border:1px solid #ccc;border-radius:6px;font-size:13px;"/>`;
  }
  if(AppContext.browser==="Firefox"){
    // Firefox renders date as YYYY-MM-DD text
    dateField=`<label style="display:block;margin-top:10px;font-size:12px;font-weight:600;">Date (Firefox — YYYY-MM-DD)</label>`+
      `<input id="env-date-field" type="text" value="${Y}-${M}-${D}" data-date-format="YYYY-MM-DD" style="margin-top:4px;padding:6px 10px;border:1px solid #ccc;border-radius:6px;font-size:13px;"/>`;
  }
  if(AppContext.browser==="Safari"){
    // Safari uses DD/MM/YYYY locale format and renders as text fallback
    dateField=`<label style="display:block;margin-top:10px;font-size:12px;font-weight:600;">Date (Safari — DD/MM/YYYY)</label>`+
      `<input id="env-date-field" type="text" value="${D}/${M}/${Y}" data-date-format="DD/MM/YYYY" style="margin-top:4px;padding:6px 10px;border:1px solid #ccc;border-radius:6px;font-size:13px;"/>`;
  }

  /* DEVICE DIFFERENCE */

  if(AppContext.device==="Mobile"){
    loginButton=`<button class="mobile-login">☰ ${text}</button>`;
  }

  /* FEATURE FLAG */

  const checkout =
    AppContext.feature==="New Checkout"
      ? `<button id="newCheckout">New Checkout</button>`
      : `<button id="oldCheckout">Checkout</button>`;

  /* THEME */

  h.style.background=
    AppContext.theme==="Dark"?"#111":"#f4f4f4";

  h.style.color=
    AppContext.theme==="Dark"?"white":"black";

  /* FINAL DOM */

  h.innerHTML=`
    ${loginButton}
    <br><br>
    ${input}
    <br><br>
    ${dateField}
    <br>
    ${checkout}

    <hr>

    <b>Current Context</b>
    <pre>${JSON.stringify(AppContext,null,2)}</pre>
  `;
}

/* ======================================================
   EVENT BINDINGS
====================================================== */

function bindControls(){

  const mappings=[
    ["envSelect","env"],
    ["localeSelect","locale"],
    ["browserSelect","browser"],
    ["deviceSelect","device"],
    ["featureSelect","feature"],
    ["themeSelect","theme"]
  ];

  mappings.forEach(([id,key])=>{
    const el=document.getElementById(id);
    if(!el) return;
    el.onchange=e=>{
      AppContext[key]=e.target.value;
      render();
    };
  });

  // Wire manual Refresh button
  const refreshBtn=document.getElementById("env-refresh-btn");
  if(refreshBtn) refreshBtn.onclick=render;
}

/* ======================================================
   INIT — binds controls once, renders on every visit
====================================================== */

let _bound=false;

window.initEnvSimulator=function(){
  if(!_bound){
    _bound=true;
    bindControls();
    // Stop the poll timer — no longer needed after first bind
    if(_pollTimer){clearInterval(_pollTimer);_pollTimer=null;}
  }
  // Always render so env-host is populated on every section visit
  render();
};

/* ======================================================
   AUTO SECTION DETECTOR — polls until section is visible,
   then calls initEnvSimulator (which always re-renders).
====================================================== */

function tryInit(){
  const section=document.getElementById(sectionId);
  if(!section) return;
  if(section.offsetParent!==null){
    window.initEnvSimulator();
  }
}

document.addEventListener("click",()=>setTimeout(tryInit,80));
document.addEventListener("DOMContentLoaded",tryInit);
_pollTimer=setInterval(tryInit,800);

})();
