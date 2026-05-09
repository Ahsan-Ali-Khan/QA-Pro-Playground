// =====================================
// LEVEL 2 BEHAVIOR ENGINE
// =====================================

(function () {

  /* -----------------------------
     TAB SWITCHING (DOM SWAP)
  ----------------------------- */
  function activateTabs() {

    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab => {

      tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // simulate SPA re-render
        document.querySelector(".settings-panel")
          ?.classList.toggle("hidden");

      });
    });
  }


  /* -----------------------------
     SKILL SELECTION REACTION
  ----------------------------- */
  function skillEffects() {

    const skills =
      document.getElementById("skillsSelect");

    if (!skills) return;

    skills.addEventListener("change", () => {

      const iframe =
        document.querySelector("iframe");

      if (!iframe) return;

      // Reload nested frame dynamically
      iframe.src =
        "level3.html?skill=" + Date.now();

    });
  }


  /* -----------------------------
     RANDOM FIELD ORDER CHANGE
     (REAL TOOL BREAKER)
  ----------------------------- */
  function shuffleFields() {

    setInterval(() => {

      const form =
        document.querySelector(".grid-2");

      if (!form) return;

      const children = [...form.children];

      children.sort(() => Math.random() - 0.5);

      children.forEach(el => form.appendChild(el));

    }, 14000);
  }


  /* -----------------------------
     ENABLE/DISABLE FIELDS
  ----------------------------- */
  function dynamicPermissions() {

    setInterval(() => {

      const fields =
        document.querySelectorAll("input,select");

      const random =
        fields[Math.floor(Math.random()*fields.length)];

      if (!random) return;

      random.disabled = !random.disabled;

    }, 9000);
  }


  /* -----------------------------
     SIMULATE API LOADING
  ----------------------------- */
  function fakeApiLoad(){

    const panel =
      document.querySelector(".settings-panel");

    if(!panel) return;

    setTimeout(()=>{

      panel.insertAdjacentHTML(
        "beforeend",
        `<p class="muted">
           Environment synced from server ✔
         </p>`
      );

    },3000);

  }


  /* -----------------------------
     SAVE BUTTON SIDE EFFECT
  ----------------------------- */
  function saveAction(){

    const btn =
      document.querySelector(".btn-primary");

    if(!btn) return;

    btn.addEventListener("click",(e)=>{

      e.preventDefault();

      btn.textContent="Saving...";

      setTimeout(()=>{
        btn.textContent="Saved ✔";
      },1200);

    });
  }


  /* -----------------------------
     INIT
  ----------------------------- */
  function init(){

    activateTabs();
    skillEffects();
    shuffleFields();
    dynamicPermissions();
    fakeApiLoad();
    saveAction();

    console.log("⚡ Level2 Behavior Active");

  }

  window.addEventListener("DOMContentLoaded", init);

})();