import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=[{name:`The roof`,line:`One plane of slate, pitched four degrees to shed the wind.`,fx:.456,fy:.43,mx:.66,my:.379,cx:352,cy:496,join:`top`},{name:`The glass corner`,line:`It faces south-west, the one side the storm rarely comes from.`,fx:.749,fy:.547,mx:.749,my:.547,cx:690,cy:566,join:46},{name:`The stilts`,line:`Nine steel legs. No rock was blasted to stand it here.`,fx:.702,fy:.722,mx:.702,my:.692,cx:628,cy:470,join:152}],s=[[`Studio`,`Nordhus architects`],[`Architects`,`Ingrid Vaa, Tomás Reyes`],[`Place`,`Lofoten, Norway`],[`Area`,`164 m²`],[`Year`,`2024`],[`Type`,`Private house`]],c=[`Home`,`Studio`,`Houses`,`Journal`,`Fees`],l=352,u={x:-57.6,y:-28.8,w:1555.2,h:1036.8},d=e=>Math.round(e*10)/10;function f(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(n=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let r=navigator.userActivation;if(!(r&&!r.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let r=t.current??=new e;r.state===`suspended`&&r.resume();let i=r.currentTime+(n.at??0),a=Math.min(n.d??.035,.16),o=r.createGain();o.gain.setValueAtTime(1e-4,i),o.gain.exponentialRampToValueAtTime(Math.min(n.g??.03,.06),i+.004),o.gain.exponentialRampToValueAtTime(1e-4,i+a),o.connect(r.destination);let s=r.createOscillator();s.type=n.type??`sine`,s.frequency.setValueAtTime(n.f,i),n.to&&s.frequency.exponentialRampToValueAtTime(n.to,i+a),s.connect(o),s.start(i),s.stop(i+a+.01)}catch{}},[e])}function p({brand:e=`Nordhus`,word:t=`SLATE`,script:n=`house`,cta:r=`Start a house`,house:p=`/design/websites/slate/house.webp`,sky:h=`/design/websites/slate/sky.webp`,clouds:g=`/design/websites/slate/clouds.webp`,tone:_=`#efe6d6`,weather:v=1,rain:y=!0,autoplay:b=!0,sound:x=!0,onCta:S}){let C=(0,i.useRef)(null),w=(0,i.useRef)(null),T=(0,i.useRef)(null),[E,D]=(0,i.useState)(0),[O,k]=(0,i.useState)(!0),[A,j]=(0,i.useState)(!1),[M,N]=(0,i.useState)(!1),P=(0,i.useRef)(0),F=(0,i.useRef)(!1),I=f(x),L=Math.min(3,Math.max(.3,v));(0,i.useEffect)(()=>{let e=C.current;if(!e)return;let t=window.matchMedia(`(prefers-reduced-motion: reduce)`),n=()=>j(t.matches);n(),t.addEventListener(`change`,n);let r=!0,i=()=>k(r&&!document.hidden),a=new IntersectionObserver(([e])=>{r=e.isIntersecting,i()});return a.observe(e),document.addEventListener(`visibilitychange`,i),()=>{t.removeEventListener(`change`,n),a.disconnect(),document.removeEventListener(`visibilitychange`,i)}},[]),(0,i.useEffect)(()=>{let e=T.current,t=w.current;if(!e||!t)return;let n=()=>{let n=parseFloat(getComputedStyle(e).fontSize);!n||!e.offsetWidth||t.style.setProperty(`--slt-wem`,String(Math.round(e.offsetWidth/n*1e3)/1e3))};n();let r=document.fonts;return r?.ready.then(n),r?.addEventListener?.(`loadingdone`,n),()=>r?.removeEventListener?.(`loadingdone`,n)},[t]),(0,i.useEffect)(()=>{let e=w.current,t=C.current;if(!e||!t)return;if(A||!O){A&&(e.style.setProperty(`--slt-px`,`0`),e.style.setProperty(`--slt-py`,`0`));return}let n=0,r=performance.now(),i=Number(e.dataset.t??0),a={x:0,y:0},o={x:0,y:0},s=e=>{if(e.pointerType===`touch`)return;let n=t.getBoundingClientRect();a.x=((e.clientX-n.left)/n.width-.5)*2,a.y=((e.clientY-n.top)/n.height-.5)*2},c=()=>{a.x=0,a.y=0};t.addEventListener(`pointermove`,s),t.addEventListener(`pointerleave`,c);let l=t=>{let s=Math.min(.05,(t-r)/1e3);r=t,i+=s*(.6+.4*L);let c=1-Math.exp(-3.2*s);o.x+=(a.x-o.x)*c,o.y+=(a.y-o.y)*c;let u=25*Math.sin(i*.34)+8*Math.sin(i*.13+1.3)+o.x*15,d=4.5*Math.sin(i*.23+.6)+o.y*7;e.style.setProperty(`--slt-px`,u.toFixed(2)),e.style.setProperty(`--slt-py`,d.toFixed(2)),e.dataset.t=i.toFixed(3),n=requestAnimationFrame(l)};return n=requestAnimationFrame(l),()=>{cancelAnimationFrame(n),t.removeEventListener(`pointermove`,s),t.removeEventListener(`pointerleave`,c)}},[A,O,L]),(0,i.useEffect)(()=>{if(!b||A||!O)return;let e=window.setInterval(()=>{F.current||performance.now()<P.current||D(e=>(e+1)%o.length)},3400);return()=>window.clearInterval(e)},[b,A,O]);let R=(e,t)=>{t!==`hover`&&(P.current=performance.now()+6e3,I({f:880+e*120,to:620+e*90,d:.045,g:.028,type:`triangle`})),D(e)},z=(e,t)=>{let n=e.key===`ArrowRight`||e.key===`ArrowDown`?1:e.key===`ArrowLeft`||e.key===`ArrowUp`?-1:0;if(!n)return;e.preventDefault();let r=(t+n+o.length)%o.length;R(r,`key`),C.current?.querySelectorAll(`.slt-hot`)[r]?.focus()},B=()=>{I({f:520,d:.06,g:.03}),I({f:780,d:.09,g:.03,at:.07}),S?.(),N(!0),window.setTimeout(()=>N(!1),1900)},V=o[E],H={x:u.x+V.fx*u.w,y:u.y+V.fy*u.h},U=V.join===`top`?`M${d(H.x)} ${d(H.y)}V${V.cy}`:`M${d(H.x)} ${d(H.y)}V${V.cy+V.join}H${V.cx+l}`,W={"--slt-tone":_,"--slt-speed":String(Math.round(1/L*1e3)/1e3)};return(0,a.jsxs)(`section`,{ref:C,className:`slt-root`,style:W,"data-live":O,"data-calm":A,"aria-label":`${e} architects: ${t} ${n}`,children:[(0,a.jsx)(`style`,{children:m}),(0,a.jsxs)(`div`,{className:`slt-stage`,children:[(0,a.jsxs)(`div`,{ref:w,className:`slt-scene`,children:[(0,a.jsxs)(`div`,{className:`slt-far slt-par`,"aria-hidden":!0,children:[(0,a.jsx)(`div`,{className:`slt-sky`,style:{backgroundImage:`url(${h})`}}),(0,a.jsx)(`div`,{className:`slt-clouds`,style:{backgroundImage:`url(${g})`}}),(0,a.jsx)(`div`,{className:`slt-break`}),(0,a.jsxs)(`div`,{className:`slt-mist`,children:[(0,a.jsx)(`i`,{}),(0,a.jsx)(`i`,{}),(0,a.jsx)(`i`,{})]})]}),(0,a.jsx)(`div`,{className:`slt-word slt-par`,"aria-hidden":!0,children:(0,a.jsx)(`span`,{ref:T,children:t})}),(0,a.jsxs)(`div`,{className:`slt-fg slt-par`,"aria-hidden":!0,children:[(0,a.jsx)(`img`,{src:p,alt:``,draggable:!1}),(0,a.jsx)(`div`,{className:`slt-band`,style:{WebkitMaskImage:`url(${p})`,maskImage:`url(${p})`},children:(0,a.jsx)(`i`,{})}),(0,a.jsx)(`div`,{className:`slt-glow`})]}),(0,a.jsx)(`div`,{className:`slt-script slt-par`,"aria-hidden":!0,children:(0,a.jsx)(`span`,{children:n})}),y?(0,a.jsxs)(`div`,{className:`slt-rain`,"aria-hidden":!0,children:[(0,a.jsx)(`i`,{}),(0,a.jsx)(`i`,{})]}):null,(0,a.jsx)(`div`,{className:`slt-shade`,"aria-hidden":!0}),(0,a.jsxs)(`div`,{className:`slt-pins slt-par`,children:[(0,a.jsx)(`svg`,{className:`slt-line`,viewBox:`0 0 1440 900`,preserveAspectRatio:`none`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:U,pathLength:1},E)}),o.map((e,t)=>(0,a.jsx)(`button`,{type:`button`,className:`slt-hot`,"data-on":t===E,style:{"--fx":e.fx,"--fy":e.fy,"--mx":e.mx,"--my":e.my,"--i":t},"aria-label":`${e.name}. ${e.line}`,"aria-pressed":t===E,onPointerEnter:e=>{e.pointerType===`mouse`&&(F.current=!0,R(t,`hover`))},onPointerLeave:()=>{F.current=!1,P.current=performance.now()+2500},onFocus:()=>{F.current=!0,D(t)},onBlur:()=>{F.current=!1,P.current=performance.now()+2500},onClick:()=>R(t,`press`),onKeyDown:e=>z(e,t),children:(0,a.jsx)(`i`,{})},e.name)),(0,a.jsxs)(`div`,{className:`slt-card`,style:{"--kx":V.cx,"--ky":V.cy},"aria-live":`polite`,children:[(0,a.jsxs)(`div`,{className:`slt-card-top`,children:[(0,a.jsxs)(`p`,{className:`slt-kick`,children:[(0,a.jsxs)(`b`,{children:[`0`,E+1]}),(0,a.jsxs)(`span`,{children:[`/ 0`,o.length]}),(0,a.jsx)(`em`,{children:V.name})]}),(0,a.jsx)(`p`,{className:`slt-say`,children:V.line})]},E),(0,a.jsx)(`dl`,{className:`slt-facts`,children:s.map(([e,t])=>(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`dt`,{children:e}),(0,a.jsx)(`dd`,{children:t})]},e))}),(0,a.jsx)(`div`,{className:`slt-steps`,"aria-hidden":!0,children:o.map((e,t)=>(0,a.jsx)(`i`,{"data-on":t===E},e.name))})]})]})]}),(0,a.jsxs)(`header`,{className:`slt-nav`,children:[(0,a.jsx)(`nav`,{className:`slt-pills`,"aria-label":`Sections`,children:c.map((e,t)=>(0,a.jsx)(`a`,{href:`#`,"data-on":t===0,onClick:e=>e.preventDefault(),children:e},e))}),(0,a.jsxs)(`a`,{className:`slt-logo`,href:`#`,onClick:e=>e.preventDefault(),"aria-label":`${e} architects`,children:[(0,a.jsx)(`span`,{className:`slt-mark`,"aria-hidden":!0,children:Array.from({length:9},(e,t)=>(0,a.jsx)(`i`,{"data-off":t===2},t))}),(0,a.jsxs)(`span`,{className:`slt-name`,children:[(0,a.jsx)(`b`,{children:e}),(0,a.jsx)(`em`,{children:`architects`})]})]}),(0,a.jsxs)(`div`,{className:`slt-right`,children:[(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Contact`}),(0,a.jsxs)(`button`,{type:`button`,className:`slt-cta`,"data-sent":M,onClick:B,children:[(0,a.jsx)(`span`,{children:M?`We'll write to you`:r}),(0,a.jsx)(`svg`,{viewBox:`0 0 46 12`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M0 6h44M38 1l6 5-6 5`})})]})]})]}),(0,a.jsxs)(`h1`,{className:`slt-h1`,children:[t,` `,n,`, a private house in Lofoten by `,e,` architects`]}),(0,a.jsxs)(`p`,{className:`slt-by`,children:[e,` architects`]}),(0,a.jsxs)(`p`,{className:`slt-year`,children:[(0,a.jsx)(`span`,{children:`2026`}),`A house that keeps the weather outside`]}),(0,a.jsxs)(`ul`,{className:`slt-traits`,children:[(0,a.jsx)(`li`,{children:`— Low`}),(0,a.jsx)(`li`,{children:`— Sheltered`}),(0,a.jsx)(`li`,{children:`— Quiet`})]}),(0,a.jsxs)(`div`,{className:`slt-copy`,children:[(0,a.jsx)(`p`,{children:`A long, low house on the outer side of Lofoten. Dark timber under one roof of slate, standing on steel legs above the rock, so the weather passes over it and under it.`}),(0,a.jsx)(`p`,{children:`Inside, a single room runs the length of the house and ends in a corner of glass. Sliding walls close it down to one warm room when the storm comes in.`})]}),(0,a.jsxs)(`div`,{className:`slt-links`,children:[(0,a.jsx)(`button`,{type:`button`,"aria-label":`Share this house`,children:(0,a.jsx)(`svg`,{viewBox:`0 0 20 20`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M6 14 14 6M7.5 6H14v6.5`})})}),(0,a.jsx)(`button`,{type:`button`,"aria-label":`Write to the studio`,children:(0,a.jsx)(`svg`,{viewBox:`0 0 20 20`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M3.5 6h13v8.5h-13zM3.5 6.5l6.5 5 6.5-5`})})}),(0,a.jsx)(`button`,{type:`button`,"aria-label":`All houses`,children:(0,a.jsx)(`svg`,{viewBox:`0 0 20 20`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z`})})})]})]})]})}var m=`
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Pinyon+Script&display=swap");

.slt-root { container: slt / inline-size; position: relative; isolation: isolate; overflow: hidden; width: 100%; height: var(--design-h, 100svh); min-height: 640px;
  background: #08090b; color: var(--slt-tone, #efe6d6); font-family: "Montserrat", "Avenir Next", "Segoe UI", system-ui, sans-serif; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
.slt-root *, .slt-root *::before, .slt-root *::after { box-sizing: border-box; }
.slt-root p, .slt-root ul, .slt-root dl, .slt-root dd, .slt-root h1 { margin: 0; padding: 0; }
.slt-root ul { list-style: none; }
.slt-root a { color: inherit; text-decoration: none; }
.slt-root button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
.slt-root :focus-visible { outline: 2px solid var(--slt-tone, #efe6d6); outline-offset: 3px; }

/* the framed picture: everything is measured against it. --u is one pixel of the 1440 design */
.slt-stage { position: absolute; inset: 0.55cqi; border-radius: 1.5cqi; overflow: hidden; container-type: size; background: #1b222b; --u: calc(100cqw / 1440); }
/* the scene always keeps 16:10 and covers the frame, so the roof stays where the name expects it */
.slt-scene { position: absolute; left: 50%; top: 50%; width: max(100cqw, 160cqh); aspect-ratio: 16 / 10; transform: translate(-50%, -50%); container-type: size; --u: calc(100cqw / 1440);
  --slt-px: 0; --slt-py: 0; --slt-wem: 2.96; --slt-span: 82; }
.slt-par { position: absolute; inset: 0; will-change: transform; transform: translate3d(calc(var(--slt-px) * var(--k) * var(--u)), calc(var(--slt-py) * var(--k) * var(--u)), 0); }

/* 1. far */
.slt-far { --k: -0.2; }
.slt-sky { position: absolute; inset: -5%; background-size: cover; background-position: 50% 28%; animation: slt-sky calc(46s * var(--slt-speed)) ease-in-out infinite alternate; }
.slt-clouds { position: absolute; left: 0; top: -2%; width: 340cqw; height: 54cqh; background-repeat: repeat-x; background-size: 170cqw 100%; opacity: .5; mix-blend-mode: soft-light;
  -webkit-mask-image: linear-gradient(#000 40%, transparent); mask-image: linear-gradient(#000 40%, transparent); animation: slt-clouds calc(64s * var(--slt-speed)) linear infinite; will-change: transform; }
.slt-break { position: absolute; left: -6cqw; top: 14cqh; width: 60cqw; height: 78cqh; mix-blend-mode: screen; opacity: .5;
  background: radial-gradient(closest-side at 42% 30%, rgba(255,226,170,.5), rgba(255,214,150,.16) 46%, transparent 72%), linear-gradient(168deg, transparent 30%, rgba(255,224,170,.14) 46%, transparent 62%);
  animation: slt-break calc(7s * var(--slt-speed)) ease-in-out infinite alternate; }
.slt-mist { position: absolute; inset: 0; }
.slt-mist i { position: absolute; left: -46cqw; width: 46cqw; height: 13cqh; border-radius: 50%; background: radial-gradient(closest-side, rgba(226,232,238,.3), rgba(226,232,238,.1) 55%, transparent); will-change: transform; animation: slt-mist calc(30s * var(--slt-speed)) linear infinite; }
.slt-mist i:nth-child(1) { top: 47cqh; }
.slt-mist i:nth-child(2) { top: 56cqh; width: 62cqw; height: 10cqh; animation-duration: calc(43s * var(--slt-speed)); animation-delay: calc(-17s * var(--slt-speed)); opacity: .8; }
.slt-mist i:nth-child(3) { top: 40cqh; width: 36cqw; height: 9cqh; animation-duration: calc(37s * var(--slt-speed)); animation-delay: calc(-29s * var(--slt-speed)); opacity: .7; }

/* 2. the name */
.slt-word { --k: -0.5; }
.slt-word span { position: absolute; left: 6.2cqw; top: 14.2cqh; white-space: nowrap; font-weight: 500; font-size: calc(var(--slt-span) / var(--slt-wem) * 1cqw); line-height: 1; letter-spacing: -0.02em; color: var(--slt-tone, #efe6d6); }

/* 3. the house */
.slt-fg { --k: -1; }
.slt-fg img, .slt-band, .slt-glow { position: absolute; left: -4cqw; bottom: -12cqh; width: 108cqw; height: 72cqw; }
.slt-fg img { display: block; max-width: none; user-select: none; -webkit-user-drag: none; }
.slt-band { -webkit-mask-size: 100% 100%; mask-size: 100% 100%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; mix-blend-mode: soft-light; overflow: hidden; }
.slt-band i { position: absolute; left: -52%; top: 0; width: 46%; height: 100%; transform: translate3d(0,0,0) skewX(-16deg); will-change: transform;
  background: linear-gradient(90deg, transparent, rgba(255,226,172,.5) 30%, rgba(255,240,208,.95) 50%, rgba(255,226,172,.5) 70%, transparent); animation: slt-band calc(9s * var(--slt-speed)) linear infinite; }
.slt-glow { left: calc(-4cqw + 108cqw * .64); bottom: auto; top: calc(112cqh - 72cqw + 72cqw * .36); width: calc(108cqw * .3); height: calc(72cqw * .38); mix-blend-mode: screen; pointer-events: none;
  background: radial-gradient(closest-side at 46% 52%, rgba(255,186,96,.62), rgba(255,160,70,.22) 52%, transparent 78%); animation: slt-glow calc(9s * var(--slt-speed)) linear infinite; }

/* 4. the script word */
.slt-script { --k: -1.3; }
.slt-script span { position: absolute; right: 1.6cqw; top: 28.6cqh; font-family: "Pinyon Script", "Snell Roundhand", cursive; font-weight: 400; font-size: 13cqw; line-height: 1; color: var(--slt-tone, #efe6d6); white-space: nowrap; padding: 0 1.2cqw 0 2cqw;
  text-shadow: 0 .2cqw 1.6cqw rgba(8,9,11,.35); animation: slt-write 1.5s cubic-bezier(.6,.1,.2,1) .15s both; }

/* 5. the points and the card */
.slt-pins { --k: -1; }
.slt-line { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.slt-line path { fill: none; stroke: rgba(255,255,255,.82); stroke-width: 1.1; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 0; animation: slt-draw .55s cubic-bezier(.3,.7,.2,1) .34s both; }
.slt-hot { position: absolute; left: calc(-4cqw + var(--fx) * 108cqw); top: calc(112cqh - 72cqw + var(--fy) * 72cqw); width: calc(44 * var(--u)); height: calc(44 * var(--u)); margin: calc(-22 * var(--u)) 0 0 calc(-22 * var(--u)); border-radius: 50%; display: grid; place-items: center; z-index: 2; }
.slt-hot i { position: relative; width: calc(13 * var(--u)); height: calc(13 * var(--u)); border-radius: 50%; background: #fff; box-shadow: 0 0 0 calc(4 * var(--u)) rgba(255,255,255,.22), 0 calc(2 * var(--u)) calc(10 * var(--u)) rgba(0,0,0,.45); transition: scale .35s cubic-bezier(.3,1.5,.5,1); }
.slt-hot i::after { content: ""; position: absolute; inset: calc(-5 * var(--u)); border-radius: 50%; border: 1px solid rgba(255,255,255,.75); opacity: 0; animation: slt-ping 2.7s cubic-bezier(.2,.6,.3,1) infinite; animation-delay: calc(var(--i) * .9s); }
.slt-hot[data-on="true"] i { scale: 1.25; }
.slt-hot[data-on="true"] i::after { animation-duration: 1.5s; border-color: #fff; }
.slt-hot:active i { scale: .9; }

.slt-card { position: absolute; left: 0; top: 0; width: calc(352 * var(--u)); padding: calc(16 * var(--u)) calc(18 * var(--u)) calc(15 * var(--u)); border-radius: calc(18 * var(--u)); z-index: 1;
  transform: translate3d(calc(var(--kx) * var(--u)), calc(var(--ky) * var(--u)), 0); transition: transform .78s cubic-bezier(.3,1.32,.46,1);
  background: linear-gradient(160deg, rgba(34,38,44,.5), rgba(14,16,19,.42)); border: 1px solid rgba(255,255,255,.3); box-shadow: inset 0 1px 0 rgba(255,255,255,.16), 0 calc(18 * var(--u)) calc(44 * var(--u)) calc(-18 * var(--u)) rgba(0,0,0,.6);
  -webkit-backdrop-filter: blur(calc(14 * var(--u))) saturate(1.25); backdrop-filter: blur(calc(14 * var(--u))) saturate(1.25); color: #fff; }
.slt-card-top { animation: slt-in .5s cubic-bezier(.2,.7,.2,1) .16s both; }
.slt-kick { display: flex; align-items: baseline; gap: calc(6 * var(--u)); font-size: calc(11 * var(--u)); letter-spacing: .08em; text-transform: uppercase; font-weight: 600; font-variant-numeric: tabular-nums; }
.slt-kick span { opacity: .5; }
.slt-kick em { font-style: normal; margin-left: auto; letter-spacing: .06em; }
.slt-say { margin-top: calc(8 * var(--u)) !important; font-size: calc(14.5 * var(--u)); line-height: 1.34; font-weight: 500; letter-spacing: -.005em; text-wrap: balance; min-height: calc(39 * var(--u)); }
.slt-facts { margin-top: calc(12 * var(--u)) !important; padding-top: calc(11 * var(--u)) !important; border-top: 1px solid rgba(255,255,255,.2); display: grid; grid-template-columns: 1fr 1.2fr; gap: calc(8 * var(--u)) calc(14 * var(--u)); }
.slt-facts dt { font-size: calc(10 * var(--u)); letter-spacing: .06em; text-transform: uppercase; opacity: .58; font-weight: 500; }
.slt-facts dd { margin-top: calc(2 * var(--u)); font-size: calc(12.5 * var(--u)); font-weight: 600; line-height: 1.25; white-space: nowrap; }
.slt-steps { display: none; }

/* weather in front, and the shade that keeps the words readable */
.slt-rain { position: absolute; inset: 0; overflow: hidden; pointer-events: none; opacity: .15; }
.slt-rain i { position: absolute; left: 0; top: -800px; width: calc(100% + 200px); height: calc(100% + 800px); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg stroke='%23fff' stroke-width='.7' stroke-linecap='round' fill='none'%3E%3Cpath d='M23 8l-7 28M71 52l-9 36M118 12l-6 24M163 70l-8 32M41 118l-9 36M97 140l-7 28M150 150l-8 32M188 20l-6 24M12 170l-5 20M130 92l-5 20'/%3E%3C/g%3E%3C/svg%3E"); background-size: 200px 200px; will-change: transform; animation: slt-rain calc(.86s * var(--slt-speed)) linear infinite; }
.slt-rain i + i { background-size: 400px 400px; left: 0; top: -1600px; width: calc(100% + 400px); height: calc(100% + 1600px); opacity: .7; animation-name: slt-rain2; animation-duration: calc(1.22s * var(--slt-speed)); }
.slt-shade { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, rgba(6,7,9,.78), rgba(6,7,9,.34) 20%, transparent 40%), linear-gradient(to bottom, rgba(6,7,9,.42), transparent 20%), radial-gradient(120% 90% at 50% 45%, transparent 62%, rgba(6,7,9,.4)); }

/* the page */
.slt-nav { position: absolute; left: calc(40 * var(--u)); right: calc(40 * var(--u)); top: calc(34 * var(--u)); display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; z-index: 3; }
.slt-pills { display: flex; gap: calc(8 * var(--u)); }
.slt-pills a { height: calc(40 * var(--u)); padding: 0 calc(25 * var(--u)); display: grid; place-items: center; border-radius: 999px; border: 1px solid rgba(255,255,255,.6); font-size: calc(10.5 * var(--u)); font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: #fff; transition: background .25s, color .25s; }
.slt-pills a[data-on="true"] { background: #fff; color: #14161a; border-color: #fff; }
.slt-pills a:not([data-on="true"]):hover { background: rgba(255,255,255,.16); }
.slt-logo { display: flex; align-items: center; gap: calc(11 * var(--u)); color: #fff; }
.slt-mark { display: grid; grid-template-columns: repeat(3, calc(7 * var(--u))); gap: calc(3 * var(--u)); }
.slt-mark i { width: calc(7 * var(--u)); height: calc(7 * var(--u)); background: #fff; border-radius: calc(1.5 * var(--u)); }
.slt-mark i[data-off="true"] { background: none; }
.slt-name { display: grid; line-height: 1.02; }
.slt-name b { font-size: calc(14 * var(--u)); font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.slt-name em { font-size: calc(13.5 * var(--u)); font-weight: 500; }
.slt-right { justify-self: end; display: flex; align-items: center; gap: calc(30 * var(--u)); font-size: calc(10.5 * var(--u)); font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: #fff; }
.slt-cta { display: flex; align-items: center; gap: calc(12 * var(--u)); text-transform: uppercase; letter-spacing: .07em; font-weight: 600 !important; }
.slt-cta svg { width: calc(46 * var(--u)); height: calc(12 * var(--u)); fill: none; stroke: currentColor; stroke-width: 1.3; transition: translate .35s cubic-bezier(.3,1.4,.5,1); }
.slt-cta:hover svg { translate: calc(6 * var(--u)) 0; }
.slt-cta:active { scale: .97; }
.slt-cta[data-sent="true"] svg { translate: calc(10 * var(--u)) 0; }

.slt-h1 { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.slt-by, .slt-year, .slt-traits { position: absolute; z-index: 3; font-size: calc(12.5 * var(--u)); line-height: 1.42; font-weight: 500; color: color-mix(in srgb, var(--slt-tone, #efe6d6) 86%, transparent); }
.slt-by { left: calc(104 * var(--u)); top: calc(112 * var(--u)); }
.slt-year { left: calc(712 * var(--u)); top: calc(96 * var(--u)); }
.slt-year span { display: block; }
.slt-traits { right: calc(40 * var(--u)); top: calc(146 * var(--u)); text-align: right; color: var(--slt-tone, #efe6d6); }
.slt-copy { position: absolute; right: calc(40 * var(--u)); bottom: calc(38 * var(--u)); z-index: 3; display: grid; grid-template-columns: repeat(2, calc(246 * var(--u))); gap: calc(28 * var(--u)); font-size: calc(13 * var(--u)); line-height: 1.48; font-weight: 400; color: color-mix(in srgb, var(--slt-tone, #efe6d6) 94%, transparent); }
.slt-links { position: absolute; left: calc(40 * var(--u)); bottom: calc(38 * var(--u)); z-index: 3; display: flex; gap: calc(12 * var(--u)); }
.slt-links button { width: calc(36 * var(--u)); height: calc(36 * var(--u)); border-radius: calc(9 * var(--u)); border: 1.5px solid var(--slt-tone, #efe6d6); display: grid; place-items: center; transition: background .25s, color .25s, scale .2s; }
.slt-links button:hover { background: var(--slt-tone, #efe6d6); color: #14161a; }
.slt-links button:active { scale: .94; }
.slt-links svg { width: calc(20 * var(--u)); height: calc(20 * var(--u)); fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linejoin: round; stroke-linecap: round; }

@keyframes slt-sky { from { transform: translate3d(-1.6%, 0, 0) scale(1.03); } to { transform: translate3d(1.6%, -0.8%, 0) scale(1.07); } }
@keyframes slt-clouds { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-170cqw, 0, 0); } }
@keyframes slt-break { from { opacity: .26; } to { opacity: .7; } }
@keyframes slt-mist { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(170cqw, -3cqh, 0); } }
@keyframes slt-band { from { transform: translate3d(0, 0, 0) skewX(-16deg); } to { transform: translate3d(440%, 0, 0) skewX(-16deg); } }
@keyframes slt-glow { 0%, 28% { opacity: .42; } 52% { opacity: 1; } 78%, 100% { opacity: .42; } }
@keyframes slt-ping { 0% { opacity: .9; transform: scale(.7); } 70%, 100% { opacity: 0; transform: scale(2.5); } }
@keyframes slt-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes slt-in { from { opacity: 0; transform: translate3d(0, calc(7 * var(--u)), 0); filter: blur(4px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes slt-write { from { clip-path: inset(-20% 100% -20% 0); } to { clip-path: inset(-20% -5% -20% 0); } }
@keyframes slt-rain { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-200px, 800px, 0); } }
@keyframes slt-rain2 { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-400px, 1600px, 0); } }

/* off screen: everything waits */
.slt-root[data-live="false"] *, .slt-root[data-live="false"] *::after { animation-play-state: paused !important; }

/* a narrower frame: drop the second paragraph and the far links */
@container slt (max-width: 1000px) {
  .slt-pills a:nth-child(n + 4) { display: none; }
}

/* phone: the house fills the lower two thirds, the card is a sheet */
@container slt (max-width: 640px) {
  .slt-stage { inset: 6px; border-radius: 26px; --u: calc(100cqw / 390); }
  .slt-scene { left: 0; top: 0; width: 100%; height: 100%; aspect-ratio: auto; transform: none; --u: calc(100cqw / 390); --slt-span: 91; }
  .slt-par { transform: translate3d(calc(var(--slt-px) * var(--k) * var(--u) * .4), calc(var(--slt-py) * var(--k) * var(--u) * .4), 0); }
  .slt-sky { background-position: 24% 30%; inset: -6%; }
  .slt-clouds { width: 520cqw; background-size: 260cqw 100%; height: 44cqh; }
  .slt-break { left: -30cqw; width: 130cqw; top: 8cqh; height: 60cqh; }
  .slt-mist i { top: 38cqh !important; height: 8cqh; }
  .slt-fg img, .slt-band { left: -147cqw; width: 250cqw; height: 166.67cqw; bottom: 1cqh; }
  .slt-glow { left: calc(-147cqw + 250cqw * .64); top: calc(99cqh - 166.67cqw + 166.67cqw * .36); width: calc(250cqw * .3); height: calc(166.67cqw * .38); }
  .slt-word span { left: 4.2cqw; top: auto; bottom: calc(1cqh + 96.5cqw); }
  .slt-script span { right: 0; top: auto; bottom: calc(1cqh + 86.6cqw); font-size: 26cqw; }
  .slt-line { display: none; }
  .slt-hot { left: calc(-147cqw + var(--mx) * 250cqw); top: calc(99cqh - 166.67cqw + var(--my) * 166.67cqw); }
  .slt-card { left: 3.2cqw; right: 3.2cqw; top: auto; bottom: 3.4cqw; width: auto; transform: translate3d(calc(var(--slt-px) * var(--u) * .4), calc(var(--slt-py) * var(--u) * .4), 0); transition: none; padding: 15px 16px 14px; border-radius: 22px; }
  .slt-say { font-size: 14.5px; min-height: 0; }
  .slt-facts { grid-template-columns: 1.2fr 1fr 1fr; gap: 8px 10px; }
  .slt-facts div:nth-child(2), .slt-facts div:nth-child(6), .slt-facts div:nth-child(1) { display: none; }
  .slt-steps { position: absolute; right: 16px; bottom: 17px; display: flex; gap: 5px; }
  .slt-steps i { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.35); transition: width .4s cubic-bezier(.3,1.4,.5,1), background .3s; }
  .slt-steps i[data-on="true"] { width: 16px; border-radius: 3px; background: #fff; }
  .slt-shade { background: linear-gradient(to top, rgba(6,7,9,.7), transparent 30%), linear-gradient(to bottom, rgba(6,7,9,.5), transparent 24%); }
  .slt-nav { left: 18px; right: 18px; top: 20px; grid-template-columns: 1fr auto; }
  .slt-pills { display: none; }
  .slt-right > a { display: none; }
  .slt-root .slt-cta { height: 38px; padding: 0 16px; border-radius: 999px; background: #fff; color: #14161a; font-size: 10.5px; }
  .slt-cta svg { width: 22px; }
  .slt-by { display: none; }
  .slt-year { left: 20px; top: 86px; font-size: 12.5px; max-width: 190px; }
  .slt-rain { opacity: .1; }
  .slt-traits { right: 20px; top: 86px; font-size: 12.5px; }
  .slt-copy, .slt-links { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .slt-root *, .slt-root *::after { animation: none !important; }
  .slt-card { transition: none; }
  .slt-band i { transform: translate3d(250%, 0, 0) skewX(-16deg); }
  .slt-glow { opacity: .85; }
  .slt-break { opacity: .55; }
  .slt-mist i:nth-child(1) { transform: translate3d(96cqw, 0, 0); }
  .slt-mist i:nth-child(2) { transform: translate3d(60cqw, 0, 0); }
  .slt-rain { display: none; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(p,{})}));