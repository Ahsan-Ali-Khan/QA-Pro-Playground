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

/* ======================================================
   QA PRO — CANVAS BAR CHART  (#31)
====================================================== */
'use strict';
const CanvasChart=(()=>{
  const DATASETS={
    monthly:{
      labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      data:[42,58,35,72,85,63,90,78,55,68,88,95],
      color:'#6366f1',label:'Monthly Revenue ($K)'
    },
    weekly:{
      labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      data:[120,145,98,167,203,88,65],
      color:'#10b981',label:'Daily Orders'
    },
    quarterly:{
      labels:['Q1','Q2','Q3','Q4'],
      data:[310,420,385,510],
      color:'#f59e0b',label:'Quarterly Sales ($K)'
    }
  };

  let animId=null;

  function draw(canvasId,set,animated){
    const canvas=document.getElementById(canvasId);
    if(!canvas)return;
    const ctx=canvas.getContext('2d');
    const W=canvas.width=canvas.offsetWidth||600;
    const H=canvas.height=280;
    const pad={t:40,r:20,b:60,l:60};
    const cW=W-pad.l-pad.r,cH=H-pad.t-pad.b;
    const {labels,data,color,label:title}=set;
    const maxV=Math.max(...data)*1.15;
    const barW=(cW/labels.length)*0.6;
    const gap=(cW/labels.length)*0.4;

    function frame(progress=1){
      ctx.clearRect(0,0,W,H);
      // bg
      ctx.fillStyle='#f9fafb';ctx.fillRect(0,0,W,H);
      // title
      ctx.fillStyle='#111827';ctx.font='bold 14px system-ui';ctx.textAlign='center';
      ctx.fillText(title,W/2,22);
      // grid lines
      ctx.strokeStyle='#e5e7eb';ctx.lineWidth=1;
      for(let i=0;i<=5;i++){
        const y=pad.t+cH-(cH*i/5);
        ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cW,y);ctx.stroke();
        ctx.fillStyle='#6b7280';ctx.font='11px system-ui';ctx.textAlign='right';
        ctx.fillText(Math.round(maxV*i/5),pad.l-8,y+4);
      }
      // axis
      ctx.strokeStyle='#d1d5db';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,pad.t+cH);ctx.lineTo(pad.l+cW,pad.t+cH);ctx.stroke();
      // bars
      labels.forEach((lbl,i)=>{
        const x=pad.l+(cW/labels.length)*i+(gap/2);
        const fullH=(data[i]/maxV)*cH;
        const h=fullH*progress;
        const y=pad.t+cH-h;
        // shadow
        ctx.fillStyle='rgba(0,0,0,.06)';ctx.fillRect(x+3,y+3,barW,h);
        // bar gradient
        const grad=ctx.createLinearGradient(0,y,0,y+h);
        grad.addColorStop(0,color);grad.addColorStop(1,color+'88');
        ctx.fillStyle=grad;ctx.fillRect(x,y,barW,h);
        // tooltip on hover handled via mouse coords
        // value label
        if(progress===1){
          ctx.fillStyle='#111827';ctx.font='bold 11px system-ui';ctx.textAlign='center';
          ctx.fillText(data[i],x+barW/2,y-6);
        }
        // x label
        ctx.fillStyle='#374151';ctx.font='12px system-ui';ctx.textAlign='center';
        ctx.fillText(lbl,x+barW/2,pad.t+cH+18);
      });
      // hover data attr for Selenium
      canvas.setAttribute('data-max-val',Math.max(...data));
      canvas.setAttribute('data-bars',labels.length);
    }

    if(animated&&!window.STABLE_MODE){
      if(animId)cancelAnimationFrame(animId);
      const start=performance.now();const dur=800;
      function step(now){
        const p=Math.min((now-start)/dur,1);
        const ease=1-Math.pow(1-p,3);
        frame(ease);
        if(p<1)animId=requestAnimationFrame(step);
      }
      animId=requestAnimationFrame(step);
    }else{frame(1);}
  }

  return{
    init(){
      const sel=document.getElementById('chart-dataset-sel');
      const cv=document.getElementById('bar-chart-canvas');
      if(!cv)return;
      const key=(sel&&sel.value)||'monthly';
      draw('bar-chart-canvas',DATASETS[key],true);
      sel?.addEventListener('change',()=>draw('bar-chart-canvas',DATASETS[sel.value],true));
      // tooltip on mousemove — positioned above the hovered bar
      cv.addEventListener('mousemove',e=>{
        const r=cv.getBoundingClientRect();
        // scale mouse coords to canvas pixel space
        const scaleX=cv.width/r.width;
        const scaleY=cv.height/r.height;
        const mx=(e.clientX-r.left)*scaleX;
        const sel2=document.getElementById('chart-dataset-sel');
        const dkey=(sel2&&sel2.value)||'monthly';
        const set=DATASETS[dkey];
        const pad={t:40,r:20,b:60,l:60};
        const cW=cv.width-pad.l-pad.r;
        const cH=cv.height-pad.t-pad.b;
        const maxV=Math.max(...set.data)*1.15;
        const colW=cW/set.labels.length;
        const idx=Math.floor((mx-pad.l)/colW);
        const tip=document.getElementById('chart-tooltip');
        if(!tip)return;
        if(idx>=0&&idx<set.data.length){
          // bar top-center in canvas pixel coords
          const barX=pad.l+colW*idx+(colW*0.4/2)+(colW*0.6/2); // center of bar
          const barTopY=pad.t+cH-(set.data[idx]/maxV)*cH;

          // convert back to CSS pixels relative to the container (canvas parent)
          const container=cv.parentElement;
          const cr=container.getBoundingClientRect();
          // canvas offset within container (accounts for container padding)
          const cvOffsetX=r.left-cr.left;
          const cvOffsetY=r.top-cr.top;

          const tipX=cvOffsetX+barX/scaleX;
          const tipY=cvOffsetY+barTopY/scaleY;

          tip.textContent=`${set.labels[idx]}: ${set.data[idx]}`;
          tip.style.display='block';
          // centre horizontally over bar, sit above it
          tip.style.left=`${tipX}px`;
          tip.style.top=`${tipY-8}px`;
          tip.style.transform='translate(-50%,-100%)';

          cv.setAttribute('data-hover-label',set.labels[idx]);
          cv.setAttribute('data-hover-val',set.data[idx]);
        }else{
          tip.style.display='none';
        }
      });
      cv.addEventListener('mouseleave',()=>{
        const tip=document.getElementById('chart-tooltip');
        if(tip)tip.style.display='none';
      });
    }
  };
})();
window.CanvasChart=CanvasChart;
// Initialized via new-scenarios.js MAP (show('canvasChart') → CanvasChart.init())
