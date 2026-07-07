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
   Dynamic Text Simulator Engine
   QA Automation Playground
====================================================== */

(function () {

  let dynamicInterval;

  const outputId = "dynamicOutput";
  const modeId = "dynamicMode";

  /* -------------------------
     Helpers
  ------------------------- */

  function el() {
    return document.getElementById(outputId);
  }

  function clearDynamic() {
    clearInterval(dynamicInterval);
    const out = el();
    if (out) {
      out.style.display = "block";
      out.textContent = "";
    }
  }

  /* -------------------------
     Dynamic Modes
  ------------------------- */

  function autoCounter() {
    let count = 0;
    const tick = () => { el().textContent = `Counter: ${++count}`; };
    tick();
    dynamicInterval = setInterval(tick, 2000);
  }

  function increasingPopulation() {
    let pop = 8000000000;
    const tick = () => {
      pop += Math.floor(Math.random() * 5);
      el().textContent = `World Population: ${pop.toLocaleString()}`;
    };
    tick();
    dynamicInterval = setInterval(tick, 1500);
  }

  function randomValue() {
    const tick = () => {
      el().textContent = `Temperature: ${Math.floor(Math.random() * 40)}°C`;
    };
    tick();
    dynamicInterval = setInterval(tick, 2000);
  }

  function apiDelay() {
    el().textContent = "Loading...";
    setTimeout(() => {
      el().textContent = "User: John Doe";
    }, Math.random() * 5000 + 2000);
  }

  function typingAnimation() {
    const text = "Generating AI Report...";
    let i = 0;
    el().textContent = "";

    dynamicInterval = setInterval(() => {
      el().textContent += text[i++];
      if (i >= text.length) clearInterval(dynamicInterval);
    }, 120);
  }

  function statusFlow() {
    const states = [
      "Pending",
      "Processing",
      "Validating",
      "Completed"
    ];

    let i = 0;

    el().textContent = `Status: ${states[i++]}`;

    dynamicInterval = setInterval(() => {
      el().textContent = `Status: ${states[i++]}`;
      if (i >= states.length)
        clearInterval(dynamicInterval);
    }, 45000);
  }

  function flickerMessage() {
    el().textContent = "Saved Successfully ✅";
    setTimeout(() => {
      el().textContent = "";
    }, 2000);
  }

  function delayedVisibility() {
    el().style.display = "none";

    setTimeout(() => {
      el().style.display = "block";
      el().textContent = "Now Visible!";
    }, 4000);
  }

  function partialDynamic() {
    const tick = () => {
      const id = Math.floor(Math.random() * 90000 + 10000);
      el().textContent = `Order #${id} created`;
    };
    tick();
    dynamicInterval = setInterval(tick, 2500);
  }

  function retryLoop() {
    const msgs = [
      "Connecting...",
      "Retrying...",
      "Retrying...",
      "Connected"
    ];

    let i = 0;

    el().textContent = msgs[i++];

    dynamicInterval = setInterval(() => {
      el().textContent = msgs[i++];
      if (i >= msgs.length)
        clearInterval(dynamicInterval);
    }, 2000);
  }

  function aiProcessing() {
    const flow = [
      "Initializing AI...",
      "Analyzing data...",
      "Generating output...",
      "Finalizing...",
      "Done ✅"
    ];

    let i = 0;

    el().textContent = flow[i++];

    dynamicInterval = setInterval(() => {
      el().textContent = flow[i++];
      if (i >= flow.length)
        clearInterval(dynamicInterval);
    }, 2200);
  }

  function randomResult() {
    setTimeout(() => {
      el().textContent =
        Math.random() > 0.5
          ? "Payment Successful ✅"
          : "Payment Failed ❌";
    }, 3000);
  }

  function liveDateTime() {
    const tick = () => {
      const now = new Date();
      el().innerHTML = `
        ISO: ${now.toISOString()} <br>
        Local: ${now.toLocaleString()} <br>
        India Format: ${now.toLocaleString("en-IN")} <br>
        Date Only: ${now.toLocaleDateString()} <br>
        Time Only: ${now.toLocaleTimeString()}
      `;
    };
    tick();
    dynamicInterval = setInterval(tick, 1000);
  }

  /* -------------------------
     Mode Controller
  ------------------------- */

  function startDynamicMode() {

    clearDynamic();

    const mode =
      document.getElementById(modeId)?.value;

    if (!mode) return;

    const modes = {
      counter: autoCounter,
      population: increasingPopulation,
      randomValue,
      apiDelay,
      typing: typingAnimation,
      statusFlow,
      flicker: flickerMessage,
      visibilityDelay: delayedVisibility,
      partial: partialDynamic,
      retry: retryLoop,
      aiFlow: aiProcessing,
      randomResult,
      dateTime: liveDateTime
    };

    modes[mode]?.();
  }

  /* -------------------------
     Auto Init
  ------------------------- */

  /* -------------------------
     Static text map for stable mode
  ------------------------- */
  const stableTexts = {
    counter:         "Counter: 1",
    population:      "World Population: 8,000,000,000",
    randomValue:     "Temperature: 22°C",
    apiDelay:        "User: John Doe",
    typing:          "Generating AI Report...",
    statusFlow:      "Status: Completed",
    flicker:         "Saved Successfully ✅",
    visibilityDelay: "Now Visible!",
    partial:         "Order #12345 created",
    retry:           "Connected",
    aiFlow:          "Done ✅",
    randomResult:    "Payment Successful ✅",
    dateTime:        "ISO: 2024-01-01T00:00:00.000Z | Local: 1/1/2024, 12:00:00 AM",
  };

  let _initialized = false;

  function init() {
    if (_initialized) return;

    const dropdown = document.getElementById(modeId);
    if (!dropdown) return;   // section still removed from DOM — will retry when shown

    _initialized = true;

    if (window.STABLE_MODE) {
      // Show fixed text for whichever option is selected — no timers
      const showStatic = () => {
        const out = el();
        if (out) out.textContent = stableTexts[dropdown.value] || "Stable Output";
      };
      dropdown.addEventListener("change", showStatic);
      showStatic();
      return;
    }

    dropdown.addEventListener("change", startDynamicMode);
    startDynamicMode();
  }

  // Expose globally so show() in index.html can trigger init when the section is opened
  window.initDynamicText   = init;
  // Also expose startDynamicMode for the onchange attribute on the <select>
  window.startDynamicMode  = startDynamicMode;

  // Try on DOMContentLoaded too (works when section is not DOM-removed, e.g. first nav click timing)
  document.addEventListener("DOMContentLoaded", init);

})();