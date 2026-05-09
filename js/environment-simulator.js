/* ======================================================
   REAL ENVIRONMENT LOCATOR LAB
====================================================== */

(function(){

const hostId="env-host";
const sectionId="env";

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
}

/* ======================================================
   INIT
====================================================== */

window.initEnvSimulator=function(){
  bindControls();
  render();
};

/* ======================================================
   AUTO SECTION DETECTOR
====================================================== */

function tryInit(){

  const section=document.getElementById(sectionId);
  if(!section) return;

  if(section.offsetParent!==null){
    window.initEnvSimulator();
  }
}

document.addEventListener("click",()=>setTimeout(tryInit,50));
document.addEventListener("DOMContentLoaded",tryInit);
setInterval(tryInit,700);

})();