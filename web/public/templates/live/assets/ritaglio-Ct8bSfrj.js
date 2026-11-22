import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=`/design/websites/ritaglio/`;function s(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)((n,r=.04)=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let i=navigator.userActivation;if(!(i&&!i.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let i=t.current??=new e;i.state===`suspended`&&i.resume();let a=i.currentTime,o=.045,s=i.createBuffer(1,Math.ceil(i.sampleRate*o),i.sampleRate),c=s.getChannelData(0);for(let e=0;e<c.length;e++)c[e]=Math.random()*2-1;let l=i.createBufferSource();l.buffer=s;let u=i.createBiquadFilter();u.type=`bandpass`,u.frequency.setValueAtTime(n,a),u.frequency.exponentialRampToValueAtTime(n*.55,a+o),u.Q.value=.9;let d=i.createGain();d.gain.setValueAtTime(1e-4,a),d.gain.exponentialRampToValueAtTime(Math.min(r,.06),a+.004),d.gain.exponentialRampToValueAtTime(1e-4,a+o),l.connect(u).connect(d).connect(i.destination),l.start(a),l.stop(a+o+.01)}catch{}},[e])}var c=[{id:`umbrella`,label:`the sun umbrella`,ratio:.95,tall:{x:21,y:10.5,w:37},wide:{x:14,y:22,w:24}},{id:`ring`,label:`the lifebuoy`,ratio:1,tall:{x:70,y:89,w:29},wide:{x:91,y:80,w:17}},{id:`floater`,label:`the girl floating`,ratio:.836,tall:{x:29,y:62,w:45},wide:{x:20,y:72,w:29}},{id:`ball`,label:`the beach ball`,ratio:1.015,tall:{x:77,y:60,w:25},wide:{x:73,y:77,w:15}},{id:`swimmer`,label:`the swimmer`,ratio:.385,tall:{x:50,y:38.5,w:47},wide:{x:50,y:49,w:31}},{id:`diver`,label:`the diver`,ratio:3.41,tall:{x:70,y:18.5,w:12.5},wide:{x:84,y:30,w:7.5}}],l=[0,-.5,-.8,-.5,0,.3],u=[0,1.5,3,1.5,0,-1.5,-3,-1.5],d=[-1.2,-2.6,-3.4,-3.6,-3,-1.8,-.6,0],f=[-2,-3,-2,0,2,3,1,0],p=14;function m(e,t,n,r){let i=Math.floor(t/2);if(e===`swimmer`){let e=t%144,n=r,a=!1,o=!0;e<60?n=r-Math.floor(e/2)*2*(2*r)/60:e<72?(n=-r,a=e>=66,o=!1):e<132?(n=-r+Math.floor((e-72)/2)*2*(2*r)/60,a=!0):(n=r,a=e<138,o=!1);let s=i%2==0?1:-1;return{dx:n,dy:o?s*.45:0,rot:o?s*3:0,lift:0,flip:a}}if(e===`floater`){let e=Math.floor(t/3);return{dx:Math.round(Math.sin(e/13)*6)/2,dy:Math.round(Math.cos(e/17)*4)/2,rot:e*2.5%360,lift:0,flip:!1}}if(e===`ring`)return{dx:0,dy:l[Math.floor(t/3)%6]*.6,rot:-(Math.floor(t/3)*4)%360,lift:0,flip:!1};if(e===`umbrella`)return{dx:0,dy:0,rot:u[Math.floor(t/4)%8],lift:0,flip:!1};if(e===`diver`){let e=t%48,n=Math.floor(e/1);return n<8?{dx:0,dy:d[n],rot:f[n],lift:.35,flip:!1}:{dx:0,dy:0,rot:0,lift:0,flip:!1}}let a=n%192,o=l[i%6],s=i*6%360,c=(e,t)=>{let n=Math.min(12,Math.floor((a-t)/2)+1);return e+(e===0?-14:p)*n/12};return a<80?{dx:0,dy:o,rot:s,lift:0,flip:!1}:a<84?{dx:0,dy:0,rot:s,lift:(a-79)/4,flip:!1}:a<108?{dx:c(0,84),dy:0,rot:s,lift:1,flip:!1}:a<112?{dx:-14,dy:0,rot:s,lift:1-(a-107)/4,flip:!1}:a<152?{dx:-14,dy:o,rot:s,lift:0,flip:!1}:a<156?{dx:-14,dy:0,rot:s,lift:(a-151)/4,flip:!1}:a<180?{dx:c(-14,156),dy:0,rot:s,lift:1,flip:!1}:a<184?{dx:0,dy:0,rot:s,lift:1-(a-179)/4,flip:!1}:{dx:0,dy:o,rot:s,lift:0,flip:!1}}var h=e=>Math.round(e*100)/100,g=e=>{let t=e.replace(`#`,``),n=t.length===3?t.split(``).map(e=>e+e).join(``):t.padEnd(6,`0`).slice(0,6),r=parseInt(n,16);return Number.isFinite(r)&&(.299*(r>>16&255)+.587*(r>>8&255)+.114*(r&255))/255>.62?`#0e0d0c`:`#f3ecdc`},_=[-9,7,-6,10,-8,6,-10,8],v=[{n:`01`,title:`Lido`,meta:`4 min · on the table now`,key:`lido`},{n:`02`,title:`Night market`,meta:`7 min · 2025`,key:`market`},{n:`03`,title:`The parade`,meta:`11 min · 2024`,key:`parade`}];function y({brand:e=`Ritaglio`,tag:t=`Paper-cut / animation studio`,line1:n=`paper`,line2:r=`Moves`,lede:l=`A stop-motion studio in Bologna. Every film is cut from paper and moved by hand, twelve frames a second.`,cta:u=`Watch the reel`,accent:p=`#e9462f`,fps:y=12,pool:x=`${o}pool.webp`,swimmer:S=`${o}swimmer.webp`,floater:C=`${o}floater.webp`,diver:w=`${o}diver.webp`,ball:ee=`${o}ball.webp`,ring:T=`${o}ring.webp`,umbrella:E=`${o}umbrella.webp`,lido:D=`${o}lido.webp`,market:O=`${o}market.webp`,parade:k=`${o}parade.webp`,sound:A=!0,onCta:j}){let M=s(A),N=(0,i.useRef)(null),P=(0,i.useRef)(null),F=(0,i.useRef)(null),I=(0,i.useRef)({}),L=(0,i.useRef)(Object.fromEntries(c.map(e=>[e.id,{ox:0,oy:0,tx:0,ty:0,lift:0,hover:!1,focus:!1,drag:!1,hop:0,home:!1}]))),R=(0,i.useRef)({f:30,fs:30,touched:-1e9}),z=(0,i.useRef)(null),B=(0,i.useRef)(()=>{}),V=Math.max(6,Math.min(14,y)),H={umbrella:E,diver:w,swimmer:S,floater:C,ball:ee,ring:T},U={lido:D,market:O,parade:k},W=(0,i.useCallback)(()=>{let e=P.current;if(!e)return;let t=e.offsetWidth||1,n=e.offsetHeight||1,r=t/100,i=t/n>.95,{f:a,fs:o}=R.current;for(let e of c){let s=I.current[e.id];if(!s)continue;let c=L.current[e.id],l=i?e.wide:e.tall,u=m(e.id,a,o,i?30:22),p=c.hop>0?d[8-c.hop]:0,g=Math.max(u.lift,c.lift),_=100*n/t,v=Math.max(3,Math.min(97,l.x+u.dx+c.ox)),y=Math.max(3,Math.min(_-3,l.y/100*_+u.dy+c.oy)),b=(v-l.x)*r,x=(y-l.y/100*_+p-g*1.1)*r,S=1+g*.06;s.style.transform=`translate(-50%, -50%) translate(${h(b)}px, ${h(x)}px)`,s.style.filter=`drop-shadow(${h(.9+g*5)}px ${h(1.4+g*9)}px ${h(.7+g*6)}px rgba(4, 38, 48, ${h(.42-g*.14)}))`,s.style.zIndex=String(g>.05?20:0);let C=s.firstElementChild;C&&(C.style.transform=`rotate(${h(u.rot+(c.hop>0?f[8-c.hop]:0))}deg) scale(${u.flip?-S:S}, ${S})`)}F.current&&(F.current.textContent=String(a%2880+1).padStart(4,`0`))},[]);B.current=W;let G=(0,i.useCallback)(e=>{let t=R.current;t.f+=1;let n=e-t.touched>6e3;n&&(t.fs+=1);for(let e of c){let t=L.current[e.id];if(t.drag)t.ox=t.tx,t.oy=t.ty;else if(n&&(t.ox!==0||t.oy!==0)){let e=Math.hypot(t.ox,t.oy),n=Math.min(e,2.2);t.ox=e<=2.2?0:t.ox-t.ox/e*n,t.oy=e<=2.2?0:t.oy-t.oy/e*n,t.home=e>2.2}else t.home=!1;t.lift=(t.drag||t.hover||t.focus||t.home?1:0)>t.lift?Math.min(1,t.lift+.5):Math.max(0,t.lift-.34),t.hop>0&&--t.hop}W()},[W]);(0,i.useEffect)(()=>{let e=N.current;if(!e)return;W();let t=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,n=new ResizeObserver(()=>B.current());if(P.current&&n.observe(P.current),t)return e.dataset.calm=`true`,()=>n.disconnect();let r=0,i=0,a=!0,o=e=>{r=requestAnimationFrame(o),!(e-i<1e3/V)&&(i=e-(e-i)%(1e3/V),G(performance.now()))},s=()=>{cancelAnimationFrame(r);let t=a&&!document.hidden;e.dataset.live=t?`true`:`false`,t&&(r=requestAnimationFrame(o))},c=new IntersectionObserver(([e])=>{a=e.isIntersecting,s()});return c.observe(e),document.addEventListener(`visibilitychange`,s),s(),()=>{cancelAnimationFrame(r),c.disconnect(),n.disconnect(),document.removeEventListener(`visibilitychange`,s)}},[W,G,V]);let K=()=>N.current?.dataset.calm===`true`,q=()=>{R.current.touched=performance.now()},J=e=>{if(!K())return;let t=L.current[e];t.ox=t.tx,t.oy=t.ty,t.lift=t.drag||t.hover||t.focus?1:0,W()},te=e=>t=>{let n=L.current[e];t.currentTarget.setPointerCapture(t.pointerId),z.current={id:e,px:t.clientX,py:t.clientY,ox:n.ox,oy:n.oy},n.drag=!0,n.tx=n.ox,n.ty=n.oy,q(),M(2600,.03),J(e)},ne=e=>t=>{let n=z.current;if(!n||n.id!==e)return;let r=P.current;if(!r)return;let i=r.getBoundingClientRect().width/100||1,a=L.current[e];a.tx=n.ox+(t.clientX-n.px)/i,a.ty=n.oy+(t.clientY-n.py)/i,q(),J(e)},Y=e=>()=>{let t=L.current[e];t.drag&&(t.drag=!1,t.ox=t.tx,t.oy=t.ty,z.current=null,q(),M(1700,.045),J(e))},re=e=>t=>{let n=L.current[e],r={ArrowLeft:[-3,0],ArrowRight:[3,0],ArrowUp:[0,-3],ArrowDown:[0,3]}[t.key];r?(t.preventDefault(),n.ox=n.tx=Math.max(-80,Math.min(80,n.ox+r[0])),n.oy=n.ty=Math.max(-140,Math.min(140,n.oy+r[1])),q(),M(2200,.03),J(e)):(t.key===`Enter`||t.key===` `)&&(t.preventDefault(),n.hop=8,q(),M(1700,.045),J(e))},X=(e,t)=>()=>{L.current[e].hover=t,J(e)},Z=(e,t)=>()=>{L.current[e].focus=t,J(e)},Q=e=>e.preventDefault(),ie=t.split(` / `),ae=0,$=(e,t)=>(0,a.jsx)(`span`,{className:`rtg-row`,children:Array.from(e).map((e,t)=>{let n=ae++;return(0,a.jsx)(`span`,{className:`rtg-ch`,style:{"--rtg-i":n,"--rtg-t":`${_[n%_.length]}deg`},children:e===` `?`\xA0`:e},t)})},t);return(0,a.jsxs)(`div`,{ref:N,className:`rtg-root`,"data-live":`false`,style:{"--rtg-accent":p,"--rtg-on":g(p)},children:[(0,a.jsx)(`style`,{children:b}),(0,a.jsxs)(`div`,{className:`rtg-field`,children:[(0,a.jsx)(`svg`,{className:`rtg-mark`,viewBox:`0 0 100 100`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M43 2h14l-2 33 28-18 7 12-30 15 30 15-7 12-28-18 2 33H43l2-33-28 18-7-12 30-15-30-15 7-12 28 18z`})}),(0,a.jsxs)(`header`,{className:`rtg-nav`,children:[(0,a.jsxs)(`a`,{className:`rtg-brand`,href:`#`,onClick:Q,children:[(0,a.jsx)(`i`,{"aria-hidden":!0}),e]}),(0,a.jsxs)(`nav`,{"aria-label":`Main`,children:[(0,a.jsx)(`a`,{href:`#`,onClick:Q,children:`Films`}),(0,a.jsx)(`a`,{href:`#`,onClick:Q,children:`Workshop`}),(0,a.jsx)(`a`,{href:`#`,onClick:Q,children:`Studio`})]}),(0,a.jsx)(`a`,{className:`rtg-ask`,href:`#`,onClick:Q,children:`Commission a film`})]}),(0,a.jsxs)(`main`,{className:`rtg-main`,children:[(0,a.jsx)(`p`,{className:`rtg-tag`,children:ie.map((e,t)=>(0,a.jsx)(`span`,{children:e},t))}),(0,a.jsxs)(`h1`,{className:`rtg-h`,"aria-label":`${n} ${r}`,children:[(0,a.jsxs)(`span`,{"aria-hidden":!0,className:`rtg-rows`,children:[$(n,0),$(r,1)]}),(0,a.jsx)(`svg`,{className:`rtg-star`,viewBox:`0 0 100 100`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M43 2h14l-2 33 28-18 7 12-30 15 30 15-7 12-28-18 2 33H43l2-33-28 18-7-12 30-15-30-15 7-12 28 18z`})})]}),(0,a.jsxs)(`div`,{className:`rtg-under`,children:[(0,a.jsx)(`p`,{className:`rtg-lede`,children:l}),(0,a.jsxs)(`button`,{type:`button`,className:`rtg-cta`,onClick:j,children:[(0,a.jsx)(`svg`,{viewBox:`0 0 12 12`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M2.5 1.2v9.6L10.6 6z`})}),u]})]})]}),(0,a.jsx)(`ul`,{className:`rtg-films`,"aria-label":`Films`,children:v.map(e=>(0,a.jsx)(`li`,{children:(0,a.jsxs)(`a`,{href:`#`,onClick:Q,children:[(0,a.jsx)(`img`,{src:U[e.key],alt:``,draggable:!1}),(0,a.jsxs)(`span`,{children:[(0,a.jsx)(`em`,{children:e.n}),(0,a.jsx)(`b`,{children:e.title}),(0,a.jsx)(`small`,{children:e.meta})]})]})},e.n))})]}),(0,a.jsx)(`div`,{className:`rtg-pic`,children:(0,a.jsxs)(`div`,{ref:P,className:`rtg-sheet`,children:[(0,a.jsx)(`img`,{className:`rtg-pool`,src:x,alt:``,draggable:!1}),c.map(e=>(0,a.jsx)(`button`,{ref:t=>{I.current[e.id]=t},type:`button`,className:`rtg-piece`,"aria-label":`Move ${e.label}`,style:{"--rtg-x":`${e.tall.x}%`,"--rtg-y":`${e.tall.y}%`,"--rtg-w":`${e.tall.w}%`,"--rtg-mx":`${e.wide.x}%`,"--rtg-my":`${e.wide.y}%`,"--rtg-mw":`${e.wide.w}%`,aspectRatio:`1 / ${e.ratio}`},onPointerDown:te(e.id),onPointerMove:ne(e.id),onPointerUp:Y(e.id),onPointerCancel:Y(e.id),onPointerEnter:X(e.id,!0),onPointerLeave:X(e.id,!1),onFocus:Z(e.id,!0),onBlur:Z(e.id,!1),onKeyDown:re(e.id),children:(0,a.jsx)(`img`,{className:`rtg-art`,src:H[e.id],alt:``,draggable:!1})},e.id)),(0,a.jsxs)(`p`,{className:`rtg-slate`,"aria-hidden":!0,children:[(0,a.jsx)(`b`,{children:`Lido`}),(0,a.jsxs)(`span`,{children:[`frame `,(0,a.jsx)(`span`,{ref:F,children:`0031`})]}),(0,a.jsxs)(`i`,{children:[V,` fps`]})]})]})})]})}var b=`
@import url("https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap");

.rtg-root {
  --rtg-black: #0e0d0c;
  --rtg-cream: #f3ecdc;
  --rtg-dim: rgba(243, 236, 220, .6);
  --rtg-line: rgba(243, 236, 220, .16);
  --rtg-butter: #f5c63c;
  container-type: inline-size;
  position: relative; isolation: isolate; overflow: hidden;
  width: 100%; height: var(--design-h, 100svh); min-height: 640px;
  background: var(--rtg-black); color: var(--rtg-cream);
  font-family: "Archivo", "Helvetica Neue", Arial, sans-serif; font-stretch: 100%;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
}
.rtg-root *, .rtg-root *::before, .rtg-root *::after { box-sizing: border-box; }
.rtg-root a { color: inherit; text-decoration: none; }
.rtg-root p, .rtg-root h1, .rtg-root ul { margin: 0; }
.rtg-root ul { padding: 0; }

/* ---- the sheet */
.rtg-pic { position: absolute; z-index: 1; top: 0; right: 0; bottom: 0; width: 40cqi; overflow: hidden; background: #1fa5ba; }
.rtg-sheet { position: absolute; inset: 0; }
.rtg-pool { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 0; user-select: none; -webkit-user-drag: none; }
.rtg-piece {
  position: absolute; left: var(--rtg-x); top: var(--rtg-y); width: var(--rtg-w);
  margin: 0; padding: 0; border: 0; background: none; color: inherit; font: inherit;
  transform: translate(-50%, -50%);
  filter: drop-shadow(.9px 1.4px .7px rgba(4, 38, 48, .42));
  cursor: grab; touch-action: none; -webkit-tap-highlight-color: transparent; outline: none;
}
.rtg-piece:active { cursor: grabbing; }
.rtg-piece:focus-visible::after { content: ""; position: absolute; inset: -6px; border: 2px dashed var(--rtg-black); border-radius: 10px; }
.rtg-art { display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none; user-select: none; -webkit-user-drag: none; }
.rtg-slate {
  position: absolute; left: 1.5cqi; bottom: 1.5cqi; z-index: 30;
  display: flex; align-items: baseline; gap: .8cqi; padding: .5cqi .9cqi .45cqi;
  background: var(--rtg-cream); color: var(--rtg-black);
  font-size: max(10px, .76cqi); font-weight: 600; letter-spacing: .08em; text-transform: uppercase; font-variant-numeric: tabular-nums;
  transform: rotate(-2deg); box-shadow: 1px 2px 1px rgba(4, 38, 48, .35); pointer-events: none;
}
.rtg-slate b { font-stretch: 125%; font-weight: 800; }
.rtg-slate i { font-style: normal; opacity: .55; }

/* ---- the black field */
.rtg-field { position: absolute; z-index: 2; overflow: hidden; top: 0; left: 0; bottom: 0; right: 40cqi; display: flex; flex-direction: column; padding: 0 3.3cqi; pointer-events: none; }
.rtg-nav, .rtg-tag, .rtg-h, .rtg-under, .rtg-films { pointer-events: auto; }
.rtg-mark { position: absolute; right: -7cqi; bottom: -9cqi; width: 34cqi; height: 34cqi; fill: #161513; pointer-events: none; z-index: -1; }

.rtg-nav { display: flex; align-items: center; gap: 2.4cqi; height: 6cqi; flex: none; }
.rtg-brand { display: inline-flex; align-items: center; gap: .7cqi; font-stretch: 125%; font-weight: 800; font-size: max(15px, 1.25cqi); letter-spacing: -.01em; margin-right: auto; }
.rtg-brand i { width: .85cqi; height: .85cqi; min-width: 10px; min-height: 10px; background: var(--rtg-accent); transform: rotate(-6deg); }
.rtg-nav nav { display: flex; gap: 2.2cqi; font-size: max(12px, .92cqi); font-weight: 500; color: var(--rtg-dim); }
.rtg-nav nav a { transition: color .15s; }
.rtg-nav nav a:hover { color: var(--rtg-cream); }
.rtg-ask { font-size: max(12px, .92cqi); font-weight: 600; padding: .62cqi 1.15cqi .58cqi; border: 1px solid rgba(243, 236, 220, .34); border-radius: 99px; transition: background .15s, color .15s; }
.rtg-ask:hover { background: var(--rtg-cream); color: var(--rtg-black); }
.rtg-root a:focus-visible, .rtg-cta:focus-visible { outline: 2px solid var(--rtg-butter); outline-offset: 3px; }

.rtg-main { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; justify-content: center; padding-bottom: 1cqi; }
.rtg-tag {
  align-self: flex-start; display: grid; place-items: center; margin-left: .4cqi !important;
  padding: 1.75cqi 3.3cqi 1.6cqi; border-radius: 50%;
  background: var(--rtg-accent); color: var(--rtg-on);
  font-stretch: 125%; font-weight: 600; font-size: max(10px, .86cqi); line-height: 1.2; letter-spacing: .05em; text-transform: uppercase; text-align: center;
  transform: rotate(-4deg);
}
.rtg-tag span { display: block; white-space: nowrap; }

.rtg-h {
  position: relative; align-self: flex-start; margin-top: 2.6cqi !important;
  font-stretch: 125%; font-weight: 900; line-height: .92; letter-spacing: -.035em;
  font-size: min(12.4cqi, calc(var(--design-h, 100svh) * .2));
}
.rtg-rows { display: block; }
.rtg-row { display: block; white-space: nowrap; }
.rtg-ch {
  /* cut from cream paper: the same grain as the pieces, clipped to the letter */
  padding: .16em 0 .24em; margin: -.16em 0 -.24em;
  color: transparent; -webkit-text-fill-color: transparent; background-color: var(--rtg-cream);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .3  0 0 0 0 .2  0 0 0 .5 -.17'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  -webkit-background-clip: text; background-clip: text;
}
.rtg-ch { display: inline-block; transform-origin: 50% 80%; animation: rtg-show .02s linear both, rtg-land .42s steps(5, jump-end) both; animation-delay: calc(.25s + var(--rtg-i) * .085s); }
@keyframes rtg-show { from { opacity: 0; } to { opacity: 1; } }
@keyframes rtg-land { from { transform: translate(.06em, -.5em) rotate(var(--rtg-t)); } to { transform: none; } }
.rtg-star { position: absolute; left: calc(100% + .9cqi); top: -.2em; width: .34em; height: .34em; fill: var(--rtg-butter); animation: rtg-spin 4.8s steps(12) infinite; }
@keyframes rtg-spin { to { transform: rotate(360deg); } }
.rtg-root[data-live="false"] .rtg-star { animation-play-state: paused; }

.rtg-under { display: flex; align-items: center; gap: 2.4cqi; margin-top: 2.9cqi; }
.rtg-lede { max-width: 30cqi; font-size: max(13px, 1.16cqi); line-height: 1.42; font-weight: 400; color: rgba(243, 236, 220, .78); text-wrap: pretty; }
.rtg-cta {
  flex: none; display: inline-flex; align-items: center; gap: .7cqi; margin: 0; cursor: pointer;
  padding: 1.05cqi 1.7cqi 1cqi 1.45cqi; border: 0; border-radius: 99px;
  background: var(--rtg-cream); color: var(--rtg-black);
  font: inherit; font-stretch: 125%; font-weight: 700; font-size: max(13px, 1.02cqi); letter-spacing: -.005em;
  transition: transform .16s steps(2), background .15s;
}
.rtg-cta svg { width: .85cqi; height: .85cqi; min-width: 10px; min-height: 10px; fill: currentColor; }
.rtg-cta:hover { transform: rotate(-2.5deg) translateY(-2px); background: #fff; }
.rtg-cta:active { transform: rotate(0deg) translateY(1px); }

.rtg-films { flex: none; list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--rtg-line); margin: 0 0 2.6cqi !important; }
.rtg-films li { padding: 1.5cqi 1.4cqi 0 0; }
.rtg-films li + li { padding-left: 1.4cqi; border-left: 1px solid var(--rtg-line); }
.rtg-films a { display: flex; align-items: center; gap: 1cqi; }
.rtg-films img { flex: none; width: 4.4cqi; height: 4.4cqi; object-fit: cover; transform: rotate(-2deg); transition: transform .16s steps(2); }
.rtg-films li:nth-child(2) img { transform: rotate(1.5deg); }
.rtg-films a:hover img { transform: rotate(3deg) scale(1.06); }
.rtg-films span { display: grid; gap: .22cqi; min-width: 0; }
.rtg-films em { font-style: normal; font-size: max(10px, .72cqi); font-weight: 700; letter-spacing: .08em; color: var(--rtg-butter); font-variant-numeric: tabular-nums; }
.rtg-films b { font-stretch: 125%; font-weight: 700; font-size: max(12px, 1cqi); letter-spacing: -.005em; white-space: nowrap; }
.rtg-films small { font-size: max(10px, .8cqi); color: var(--rtg-dim); white-space: nowrap; }

/* ---- tablet: the film list keeps its titles and drops the small print */
@container (max-width: 1040px) {
  .rtg-films small { display: none; }
  .rtg-films li { padding-right: .8cqi; }
  .rtg-films li + li { padding-left: 1cqi; }
  .rtg-nav nav { gap: 1.8cqi; }
  .rtg-under { flex-direction: column; align-items: flex-start; gap: 2cqi; }
  .rtg-lede { max-width: 44cqi; }
}

/* ---- phone: the sheet lies across the top, the words under it */
@container (max-width: 700px) {
  .rtg-pic { left: 0; right: 0; top: 15cqi; bottom: auto; width: auto; height: 85cqi; }
  .rtg-piece { left: var(--rtg-mx); top: var(--rtg-my); width: var(--rtg-mw); }
  .rtg-slate { left: auto; right: 3.5cqi; bottom: 3.5cqi; gap: 2cqi; padding: 1.4cqi 2.4cqi 1.2cqi; font-size: 2.6cqi; transform: rotate(1.5deg); }
  .rtg-field { right: 0; padding: 0 5.2cqi; }
  .rtg-mark { right: -22cqi; bottom: -20cqi; width: 80cqi; height: 80cqi; }
  .rtg-nav { height: 15cqi; gap: 3cqi; }
  .rtg-nav nav { display: none; }
  .rtg-brand { font-size: 4.6cqi; gap: 2cqi; }
  .rtg-brand i { width: 3cqi; height: 3cqi; }
  .rtg-ask { font-size: 3.3cqi; padding: 1.9cqi 3.4cqi 1.7cqi; }
  .rtg-main { justify-content: flex-start; padding-top: 79cqi; padding-bottom: 0; }
  .rtg-tag { font-size: 2.45cqi; padding: 4.3cqi 8cqi 3.9cqi; margin-left: 0 !important; position: relative; z-index: 40; }
  .rtg-h { margin-top: 4.2cqi !important; font-size: min(20.6cqi, calc(var(--design-h, 100svh) * .105)); }
  .rtg-star { left: auto; right: -.5cqi; top: .1em; width: .36em; height: .36em; }
  .rtg-under { flex-direction: column; align-items: flex-start; gap: 4.6cqi; margin-top: 5cqi; }
  .rtg-lede { max-width: none; font-size: 3.85cqi; line-height: 1.4; }
  .rtg-cta { font-size: 3.9cqi; gap: 2.2cqi; padding: 3.5cqi 5.6cqi 3.3cqi 4.8cqi; }
  .rtg-cta svg { width: 3cqi; height: 3cqi; }
  .rtg-films { grid-template-columns: 1fr; margin-bottom: 7cqi !important; }
  .rtg-films li { padding: 3.6cqi 0 0; }
  .rtg-films li + li { display: none; }
  .rtg-films a { gap: 3.4cqi; }
  .rtg-films img { width: 12cqi; height: 12cqi; }
  .rtg-films span { grid-template-columns: auto 1fr; column-gap: 2.4cqi; row-gap: .6cqi; align-items: baseline; }
  .rtg-films em { font-size: 2.8cqi; }
  .rtg-films b { font-size: 3.9cqi; }
  .rtg-films small { display: block; grid-column: 1 / -1; font-size: 3.1cqi; }
}

@media (prefers-reduced-motion: reduce) {
  .rtg-ch, .rtg-star { animation: none !important; }
  .rtg-cta, .rtg-films img { transition: none !important; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(y,{})}));