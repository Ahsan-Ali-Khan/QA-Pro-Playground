/* ======================================================
   QA PRO — SVG INTERACTIVE NETWORK GRAPH  (#32)
====================================================== */
'use strict';
const SvgGraph=(()=>{
  const NODES=[
    {id:'n1',label:'Auth Service',  x:300,y:80, type:'service'},
    {id:'n2',label:'API Gateway',   x:150,y:200,type:'gateway'},
    {id:'n3',label:'User DB',       x:450,y:200,type:'database'},
    {id:'n4',label:'Cache Layer',   x:80, y:340,type:'cache'},
    {id:'n5',label:'Payment API',   x:240,y:340,type:'service'},
    {id:'n6',label:'Email Service', x:400,y:340,type:'service'},
    {id:'n7',label:'Log Store',     x:540,y:340,type:'database'},
  ];
  const EDGES=[
    {from:'n1',to:'n2'},{from:'n1',to:'n3'},{from:'n2',to:'n4'},
    {from:'n2',to:'n5'},{from:'n3',to:'n6'},{from:'n3',to:'n7'},
    {from:'n5',to:'n6'},
  ];
  const COLORS={service:'#6366f1',gateway:'#0ea5e9',database:'#f59e0b',cache:'#10b981'};
  const INFO={
    n1:'Auth Service — handles OAuth 2.0 and JWT token validation',
    n2:'API Gateway — routes all incoming REST/GraphQL requests',
    n3:'User DB — PostgreSQL cluster (primary + 2 replicas)',
    n4:'Cache Layer — Redis with 5-min TTL on session tokens',
    n5:'Payment API — PCI-DSS compliant Stripe integration',
    n6:'Email Service — SendGrid SMTP with open-tracking pixel',
    n7:'Log Store — Elasticsearch 8.x with 90-day retention',
  };

  let svg=null,sel=null;

  function buildSVG(){
    const container=document.getElementById('svg-graph-container');
    if(!container)return;
    container.innerHTML='';
    const ns='http://www.w3.org/2000/svg';
    svg=document.createElementNS(ns,'svg');
    svg.setAttribute('id','network-svg');
    svg.setAttribute('viewBox','0 0 640 440');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','440');
    svg.setAttribute('data-scenario','32');

    // defs — arrowhead
    const defs=document.createElementNS(ns,'defs');
    const marker=document.createElementNS(ns,'marker');
    marker.setAttribute('id','arr');marker.setAttribute('markerWidth','8');
    marker.setAttribute('markerHeight','8');marker.setAttribute('refX','6');
    marker.setAttribute('refY','3');marker.setAttribute('orient','auto');
    const arr=document.createElementNS(ns,'path');
    arr.setAttribute('d','M0,0 L0,6 L8,3 z');arr.setAttribute('fill','#94a3b8');
    marker.appendChild(arr);defs.appendChild(marker);svg.appendChild(defs);

    // edges
    const edgeG=document.createElementNS(ns,'g');edgeG.setAttribute('id','svg-edges');
    EDGES.forEach(e=>{
      const from=NODES.find(n=>n.id===e.from);
      const to=NODES.find(n=>n.id===e.to);
      const line=document.createElementNS(ns,'line');
      line.setAttribute('x1',from.x);line.setAttribute('y1',from.y);
      line.setAttribute('x2',to.x);line.setAttribute('y2',to.y);
      line.setAttribute('stroke','#94a3b8');line.setAttribute('stroke-width','1.5');
      line.setAttribute('marker-end','url(#arr)');
      line.setAttribute('data-edge',`${e.from}-${e.to}`);
      edgeG.appendChild(line);
    });
    svg.appendChild(edgeG);

    // nodes
    const nodeG=document.createElementNS(ns,'g');nodeG.setAttribute('id','svg-nodes');
    NODES.forEach(n=>{
      const g=document.createElementNS(ns,'g');
      g.setAttribute('id',n.id);
      g.setAttribute('data-node-id',n.id);
      g.setAttribute('data-node-type',n.type);
      g.setAttribute('transform',`translate(${n.x},${n.y})`);
      g.style.cursor='pointer';

      const circle=document.createElementNS(ns,'circle');
      circle.setAttribute('r','32');circle.setAttribute('fill',COLORS[n.type]||'#6366f1');
      circle.setAttribute('stroke','#fff');circle.setAttribute('stroke-width','3');
      circle.setAttribute('filter','drop-shadow(0 3px 6px rgba(0,0,0,.2))');

      const text=document.createElementNS(ns,'text');
      text.setAttribute('text-anchor','middle');text.setAttribute('dy','30px');
      text.setAttribute('font-size','11');text.setAttribute('font-weight','600');
      text.setAttribute('fill','#374151');
      const words=n.label.split(' ');
      if(words.length>1){
        text.innerHTML=`<tspan x="0" dy="30">${words[0]}</tspan><tspan x="0" dy="14">${words.slice(1).join(' ')}</tspan>`;
      }else{text.textContent=n.label;}

      const ico=document.createElementNS(ns,'text');
      ico.setAttribute('text-anchor','middle');ico.setAttribute('dominant-baseline','middle');
      ico.setAttribute('font-size','18');ico.setAttribute('pointer-events','none');
      const icons={service:'⚙️',gateway:'🌐',database:'🗄️',cache:'⚡'};
      ico.textContent=icons[n.type]||'●';

      g.appendChild(circle);g.appendChild(ico);g.appendChild(text);
      g.addEventListener('click',()=>selectNode(n.id));
      g.addEventListener('mouseenter',()=>{circle.setAttribute('stroke','#fbbf24');circle.setAttribute('stroke-width','4');});
      g.addEventListener('mouseleave',()=>{
        circle.setAttribute('stroke',sel===n.id?'#fbbf24':'#fff');
        circle.setAttribute('stroke-width',sel===n.id?'4':'3');
      });
      nodeG.appendChild(g);
    });
    svg.appendChild(nodeG);
    container.appendChild(svg);
  }

  function selectNode(id){
    sel=id;
    const n=NODES.find(x=>x.id===id);
    // reset all strokes
    NODES.forEach(nd=>{
      const c=svg.querySelector(`#${nd.id} circle`);
      if(c){c.setAttribute('stroke','#fff');c.setAttribute('stroke-width','3');}
    });
    // highlight selected
    const selC=svg.querySelector(`#${id} circle`);
    if(selC){selC.setAttribute('stroke','#fbbf24');selC.setAttribute('stroke-width','5');}
    // highlight edges
    svg.querySelectorAll('[data-edge]').forEach(e=>{
      const edge=e.getAttribute('data-edge');
      if(edge.startsWith(id)||edge.endsWith(id)){
        e.setAttribute('stroke','#f59e0b');e.setAttribute('stroke-width','2.5');
      }else{
        e.setAttribute('stroke','#94a3b8');e.setAttribute('stroke-width','1.5');
      }
    });
    // update info panel
    const panel=document.getElementById('svg-node-info');
    const name=document.getElementById('svg-node-name');
    const desc=document.getElementById('svg-node-desc');
    const badge=document.getElementById('svg-node-badge');
    if(panel){
      if(name)name.textContent=n.label;
      if(desc)desc.textContent=INFO[id]||'No description.';
      if(badge){badge.textContent=n.type;badge.setAttribute('data-type',n.type);}
      panel.setAttribute('data-selected',id);
      panel.style.display='block';
    }
  }

  return{init(){
    buildSVG();
    // Default select first node
    setTimeout(()=>selectNode('n1'),200);
  }};
})();
window.SvgGraph=SvgGraph;
// Initialized via new-scenarios.js MAP (show('svgGraph') → SvgGraph.init())
