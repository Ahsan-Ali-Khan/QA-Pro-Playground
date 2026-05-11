/* ======================================================
   QA PRO — DYNAMIC ELEMENTS LAB
   Independent Scenario Engine
====================================================== */

const DynamicLab = (() => {

  let timers = [];

  const rand = (n=9999)=>Math.floor(Math.random()*n);

  function interval(fn,time){
    timers.push(setInterval(fn,time));
  }

  function timeout(fn,time){
    timers.push(setTimeout(fn,time));
  }

  function clearAll(){
    timers.forEach(t=>{
      clearInterval(t);
      clearTimeout(t);
    });
    timers=[];
  }

  /* ===============================
     1. Dynamic Attributes
  ===============================*/
  function dynamicAttributes(){

    // Dynamic ID/Class
    interval(() => {
      const btn = document.querySelector('#lab-attributes button');
      if (btn) {
        btn.id = 'btn-' + Math.floor(Math.random() * 9999);
        btn.className = 'dyn-' + Math.floor(Math.random() * 999);
        btn.setAttribute("data-testid",'dyn-' + Math.floor(Math.random() * 999) + "-btn");
        // RANDOM TEXT
        const messages = [
          "Click me 😄",
          "click me ⚡",
          "clickme 🔧",
          "clickMe 👀",
          "Click here 🔁",
          "Click ME -_-",
          "Click\nMe"
        ];
      
        btn.innerText = messages[Math.floor(Math.random() * messages.length)];
      
        // RANDOM COLORS
        const colors = ["red", "blue", "green", "purple", "orange"];
        const color = colors[Math.floor(Math.random() * colors.length)];
      
        btn.style.setProperty("background", color, "important");
        btn.style.setProperty("background-image", "none", "important");
        btn.style.setProperty("color", "white", "important");
      
        // RANDOM EFFECTS
        const scale = (1 + Math.random() * 0.4).toFixed(2);
      
        btn.style.setProperty("font-weight", "bold", "important");
        btn.style.setProperty("transform", `scale(${scale})`, "important");
      }
    }, 10000);
  }
  

  


  /* ===============================
     2. Delayed Rendering
  ===============================*/
  function delayed(){

    timeout(()=>{
      // Element was removed from DOM by initDomRemoval — use stored reference
      const btn = window._delayedBtn;
      if (btn) domShow(btn);
    },5000);
  }


  /* ===============================
     3. Flaky Visibility
  ===============================*/
  function visibility() {
    // Capture reference once — querySelector returns null once element is removed from DOM
    const el = document.querySelector('#toggle-btn');
    if (!el) return;

    const delay = window.STABLE_MODE ? 4000 : 40000;
    timeout(() => {
    domHide(el);
    }, 5000);
    interval(() => {
      if (Math.random() > 0.5) {
        domShow(el);
      } else {
        domHide(el);
      }
    }, delay);
  }


  /* ===============================
     4. REAL Catch Me Button
  ===============================*/
  function catchMe(){

    interval(()=>{

      const btn=document.querySelector('#catch-me');
      if(!btn) return;

      const x=Math.random()*750;
      const y=Math.random()*80;

      btn.style.position="relative";
      btn.style.left=x+"px";
      btn.style.top=y+"px";

      // sometimes replace element
      if(Math.random()>0.6){
        const clone=btn.cloneNode(true);
        btn.replaceWith(clone);
      }

    },600);
  }


  /* ===============================
     5. DOM Re-render (Stale)
  ===============================*/
  function stale(){

    interval(()=>{

      const btn=document.querySelector('#rerender-btn');
      if(!btn) return;

      const clone=btn.cloneNode(true);
      btn.replaceWith(clone);

    },100);
  }


  /* ===============================
     6. Duplicate Trap
  ===============================*/
  /* ===============================
   6. Duplicate Locator Trap
   LIMITED + SAME TEXT
================================*/
function duplicate() {

  const MAX_DUPLICATES = 6;
  const LABEL = "Duplicate";

  setInterval(() => {

    const box = document.querySelector('#duplicate-box');
    if (!box) return;

    const buttons = box.querySelectorAll('button');

    /* ---- RESET WHEN LIMIT REACHED ---- */
    if (buttons.length >= MAX_DUPLICATES) {
      box.innerHTML = "";     // remove all buttons
      createBaseButton(box);  // start again from one
      return;
    }

    /* ---- CLONE EXISTING BUTTON ---- */
    const clone = buttons[0].cloneNode(true);

    // locator trap
    clone.innerText = LABEL;
    clone.id = "";
    clone.className = "dup-btn";
    clone.setAttribute("data-testid", "action-btn");

    box.appendChild(clone);

  }, 4000);
}


/* ---------- Base Button Creator ---------- */
function createBaseButton(container) {

  const btn = document.createElement("button");

  btn.innerText = "Duplicate";
  btn.className = "dup-btn";
  btn.setAttribute("data-testid", "action-btn");

  container.appendChild(btn);
}


  /* ===============================
     7. Async Enable
  ===============================*/
  function asyncEnable(){

    timeout(()=>{
      document
        .querySelector('#async-btn')
        ?.removeAttribute('disabled');
    },6000);
  }


  /* ===============================
     RESET PLAYGROUND
  ===============================*/
  function reset(){

    clearAll();

    location.reload(); // clean reset
  }


  /* ===============================
     INIT
  ===============================*/
  function init(){

    dynamicAttributes();
    delayed();
    visibility();
    catchMe();
    stale();
    duplicate();
    asyncEnable();

    console.log("✅ Dynamic Lab Started");
  }

  return { init, reset };

})();


document.addEventListener("DOMContentLoaded", () => {
  if (!window.STABLE_MODE) DynamicLab.init();
});
