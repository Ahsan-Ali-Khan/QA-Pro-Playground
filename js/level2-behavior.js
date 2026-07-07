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

// =====================================
// LEVEL 2 BEHAVIOR ENGINE
// =====================================

(function () {

  // Local dom utilities (level2 runs in its own iframe window)
  function domHide(el) {
    if (!el || el._domRemoved) return;
    el._domParent = el.parentNode;
    el._domNext   = el.nextSibling;
    if (el.parentNode) el.parentNode.removeChild(el);
    el._domRemoved = true;
  }
  function domShow(el) {
    if (!el || !el._domRemoved) return;
    if (el._domNext && el._domNext.parentNode === el._domParent)
      el._domParent.insertBefore(el, el._domNext);
    else if (el._domParent)
      el._domParent.appendChild(el);
    el._domRemoved = false;
  }

  /* -----------------------------
     TAB SWITCHING (DOM SWAP)
  ----------------------------- */
  function activateTabs() {

    const tabs        = document.querySelectorAll(".tab");
    const settingsPanel = document.querySelector(".settings-panel");

    tabs.forEach(tab => {

      tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // simulate SPA re-render — toggle settings-panel in/out of DOM
        if (settingsPanel) {
          settingsPanel._domRemoved ? domShow(settingsPanel) : domHide(settingsPanel);
        }

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