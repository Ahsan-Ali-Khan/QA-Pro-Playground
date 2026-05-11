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
    if (el()) el().style.display = "block";
  }

  /* -------------------------
     Dynamic Modes
  ------------------------- */

  function autoCounter() {
    let count = 0;
    dynamicInterval = setInterval(() => {
      el().textContent = `Counter: ${++count}`;
    }, 2000);
  }

  function increasingPopulation() {
    let pop = 8000000000;
    dynamicInterval = setInterval(() => {
      pop += Math.floor(Math.random() * 5);
      el().textContent =
        `World Population: ${pop.toLocaleString()}`;
    }, 1500);
  }

  function randomValue() {
    dynamicInterval = setInterval(() => {
      el().textContent =
        `Temperature: ${Math.floor(Math.random() * 40)}°C`;
    }, 2000);
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
    dynamicInterval = setInterval(() => {
      const id = Math.floor(
        Math.random() * 90000 + 10000
      );
      el().textContent = `Order #${id} created`;
    }, 2500);
  }

  function retryLoop() {
    const msgs = [
      "Connecting...",
      "Retrying...",
      "Retrying...",
      "Connected"
    ];

    let i = 0;

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
    dynamicInterval = setInterval(() => {

      const now = new Date();

      el().innerHTML = `
        ISO: ${now.toISOString()} <br>
        Local: ${now.toLocaleString()} <br>
        India Format: ${now.toLocaleString("en-IN")} <br>
        Date Only: ${now.toLocaleDateString()} <br>
        Time Only: ${now.toLocaleTimeString()}
      `;

    }, 1000);
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

  function init() {

    const dropdown =
      document.getElementById(modeId);

    if (!dropdown) return;

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

    dropdown.addEventListener(
      "change",
      startDynamicMode
    );

    startDynamicMode();
  }

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

})();