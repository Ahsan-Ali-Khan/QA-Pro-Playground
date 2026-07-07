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

// ======================================
// iframe-loader.js
// Locator Stress Playground
// ======================================

(function () {

  /* ----------------------------------
     RANDOMIZE FRAME IDS
  ---------------------------------- */
  function randomizeFrameIds() {

    document.querySelectorAll("iframe")
      .forEach(frame => {

        frame.dataset.originalId = frame.id;

        frame.id =
          "frame-" + crypto.randomUUID().slice(0,6);

      });
  }


  /* ----------------------------------
     SIMULATE ASYNC LOADING
  ---------------------------------- */
  function simulateSlowFrames() {

    document.querySelectorAll("iframe")
      .forEach(frame => {

        frame.style.opacity = ".3";

        setTimeout(() => {
          frame.style.transition = "opacity .4s";
          frame.style.opacity = "1";
        }, 800 + Math.random()*2000);

      });
  }


  /* ----------------------------------
     DYNAMIC TEXT (REALISTIC)
  ---------------------------------- */
  function dynamicButtons() {

    const texts = [
      "Save",
      "Submit",
      "Continue",
      "Verify",
      "Next Step"
    ];

    setInterval(() => {

      document.querySelectorAll("#iframeSec .btn-primary")
        .forEach(btn => {

          btn.textContent =
            texts[Math.floor(Math.random()*texts.length)];

        });

    }, 6000);
  }


  /* ----------------------------------
     RANDOM ATTRIBUTE CHANGES
     (REAL LOCATOR BREAKER)
  ---------------------------------- */
  function mutateAttributes() {

    setInterval(() => {

      document
        .querySelectorAll("#iframeSec input, #iframeSec textarea, #iframeSec button")
        .forEach(el => {

          el.setAttribute(
            "data-dynamic",
            Math.random().toString(36).slice(2,7)
          );

        });

    }, 7000);
  }


  /* ----------------------------------
     CONDITIONAL ADDRESS
  ---------------------------------- */
  function conditionalAddress() {

    const toggle =
      document.getElementById("toggleAddress");

    const box =
      document.getElementById("addressBox");

    if (!toggle || !box) return;

    toggle.addEventListener("change", function () {
      window.domToggle(box, this.checked);
    });
  }


  /* ----------------------------------
     SOFT DOM RERENDER (REACT-LIKE)
  ---------------------------------- */
  function rerenderInputs() {

    setInterval(() => {

      const inputs =
        document.querySelectorAll("#iframeSec input[type=text],#iframeSec input[type=password]");

      if (!inputs.length) return;

      const random =
        inputs[Math.floor(Math.random()*inputs.length)];

      const value = random.value;

      const clone = random.cloneNode(true);
      clone.value = value;

      random.replaceWith(clone);

    }, 12000);
  }


  /* ----------------------------------
     VISUAL LOADING OVERLAY
  ---------------------------------- */
  function fakeLoadingOverlay(){

    const overlay = document.createElement("div #iframeSec");

    overlay.style.cssText = `
      position:fixed;
      inset:0;
      background:rgba(255,255,255,.6);
      backdrop-filter:blur(4px);
      display:none;
      z-index:9999;
    `;

    document.body.appendChild(overlay);

    setInterval(()=>{
      overlay.style.display="block";

      setTimeout(()=>{
        overlay.style.display="none";
      },800);

    },30000);
  }


  /* ----------------------------------
     INIT
  ---------------------------------- */
  function init() {

    // In stable mode skip all chaos — IDs, attributes, and buttons stay fixed
    if (window.STABLE_MODE) return;

    randomizeFrameIds();
    simulateSlowFrames();
    dynamicButtons();
    conditionalAddress();
    mutateAttributes();
    rerenderInputs();
    fakeLoadingOverlay();

    console.log("⚡ Locator Chaos Engine Active");
  }

  window.addEventListener("DOMContentLoaded", init);

})();