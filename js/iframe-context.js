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

(function(){

let reloadCount = 0;

/* ------------------------
   Update status UI
-------------------------*/
function updateStatus(frame){

  document.getElementById("frameStatus")
    .textContent = frame.id;

  document.getElementById("frameReload")
    .textContent = reloadCount;
}


/* ------------------------
   Randomize iframe id
-------------------------*/
function randomizeId(frame){

  const newId =
    "frame-" + Math.floor(Math.random()*9999);

  frame.id = newId;

  updateStatus(frame);
}


/* ------------------------
   Reload iframe
-------------------------*/
function reloadFrame(){

  const frame =
    document.querySelector("#iframeSec iframe");

  if(!frame) return;

  reloadCount++;

  frame.src =
    "frames/level1.html?reload=" + Date.now();

  randomizeId(frame);
}


/* ------------------------
   Auto reload simulation
-------------------------*/
function autoReload(){

  setInterval(reloadFrame, 40000);
}


/* ------------------------
   Spawn additional iframe
   (REAL TOOL BREAKER)
-------------------------*/
function spawnFrame(){

  const container =
    document.getElementById("iframeSec");

  const newFrame =
    document.createElement("iframe");

  newFrame.src = "frames/level1.html";
  newFrame.className = "playground-frame";

  container.appendChild(newFrame);
}


/* ------------------------
   Buttons
-------------------------*/
function controls(){

  document
    .getElementById("reloadFrameBtn")
    ?.addEventListener("click", reloadFrame);

  document
    .getElementById("spawnFrameBtn")
    ?.addEventListener("click", spawnFrame);
}


/* ------------------------
   INIT
-------------------------*/
function init(){

  // In stable mode the real iframe is hidden — nothing to wire up
  if (window.STABLE_MODE) return;

  const frame =
    document.querySelector("#iframeSec iframe");

  if(!frame) return;

  updateStatus(frame);

  controls();
  autoReload();

  console.log("🧪 iFrame Context Scenario Active");

}

window.addEventListener("DOMContentLoaded", init);

})();