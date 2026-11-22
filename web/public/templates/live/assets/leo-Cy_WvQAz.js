import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=25,s=5,c={x:.1953,y:0,w:.6152,h:.4167},l=.48,u=[-1,-.5,0,.5,1],d=[[0,1],[1,1.5],[0,.9],[-1,1.5]],f=.95,p=[`Procida harbour at sunset`,`A night train on a viaduct in the Alps`,`A woman among peonies`,`A portrait on mint green`],m=[{x:172,y:26,r:5},{x:0,y:64,r:-6},{x:96,y:8,r:-1.5},{x:130,y:0,r:2.5}],h=3.2,g=1.15,ee=e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2,_=(e,t,n)=>Math.min(n,Math.max(t,e));function v({ink:e=`#e8321e`,ground:t=`#f2f1ee`,name:n=`Leo`,fullName:r=`Leo Marchetti`,line:v=`I shoot people and places on 35 mm film. Ten years, forty countries, one camera.`,cta:b=`Commission`,body:x=`/design/websites/leo/body.webp`,heads:S=`/design/websites/leo/heads.webp`,prints:C=`/design/websites/leo/prints.webp`,roll:w=214,sound:T=!0,onCta:E}){let D=(0,i.useRef)(null),O=(0,i.useRef)(null),k=(0,i.useRef)(null),A=(0,i.useRef)(null),j=(0,i.useRef)(null),M=(0,i.useRef)(null),N=(0,i.useRef)(null),P=(0,i.useRef)([]),F=(0,i.useRef)(null),[I,L]=(0,i.useState)(17),[R,z]=(0,i.useState)(!1),[B,V]=(0,i.useState)(!1),H=(0,i.useRef)({order:[0,1,2,3],shuffleAt:0,from:[0,1,2,3],flyer:-1,hover:-1,lift:[0,0,0,0],nextShuffle:h,px:0,py:0,pActive:0,keyTurn:0,keyAt:-99,angle:0,key:2,vel:0,cam:0,camY:0,reduced:!1}),U=(0,i.useCallback)(()=>{if(!T||document.documentElement.dataset.cdMute===`1`)return null;try{if(!F.current){let e=window.AudioContext||window.webkitAudioContext;if(!e)return null;F.current=new e}return F.current.state===`suspended`&&F.current.resume(),F.current}catch{return null}},[T]),W=(0,i.useCallback)(()=>{let e=U();if(e)try{let t=e.currentTime,n=Math.floor(e.sampleRate*.035),r=e.createBuffer(1,n,e.sampleRate),i=r.getChannelData(0);for(let e=0;e<n;e++)i[e]=(Math.random()*2-1)*(1-e/n)**2;let a=e.createBufferSource();a.buffer=r;let o=e.createBiquadFilter();o.type=`bandpass`,o.frequency.value=3200,o.Q.value=.8;let s=e.createGain();s.gain.value=.05,a.connect(o).connect(s).connect(e.destination),a.start(t),[0,.045].forEach((n,r)=>{let i=e.createOscillator(),a=e.createGain();i.type=`square`,i.frequency.setValueAtTime(r?900:2100,t+n),a.gain.setValueAtTime(1e-4,t+n),a.gain.exponentialRampToValueAtTime(r?.03:.04,t+n+.002),a.gain.exponentialRampToValueAtTime(1e-4,t+n+.018),i.connect(a).connect(e.destination),i.start(t+n),i.stop(t+n+.03)})}catch{}},[U]),G=(0,i.useCallback)(()=>{let e=U();if(e)try{let t=e.currentTime,n=e.createOscillator(),r=e.createGain();n.type=`sine`,n.frequency.setValueAtTime(1250,t),n.frequency.exponentialRampToValueAtTime(700,t+.04),r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(.05,t+.004),r.gain.exponentialRampToValueAtTime(1e-4,t+.05),n.connect(r).connect(e.destination),n.start(t),n.stop(t+.06)}catch{}},[U]),K=(0,i.useRef)(0),q=(0,i.useCallback)(e=>{let t=H.current;if(t.shuffleAt>=0)return!1;let n=t.order.slice(),r,i;if(e===null)i=n[0],r=[n[1],n[2],n[3],n[0]];else{if(n[0]===e)return!1;i=e,r=[e,...n.filter(t=>t!==e)]}return t.from=[0,1,2,3].map(e=>n.indexOf(e)),t.order=r,t.flyer=i,t.shuffleAt=t.reduced?-1:K.current,L(e=>e>=36?1:e+1),!0},[]);(0,i.useEffect)(()=>{let e=D.current;if(!e)return;let t=H.current,n=window.matchMedia(`(prefers-reduced-motion: reduce)`);t.reduced=n.matches;let r=()=>t.reduced=n.matches;n.addEventListener?.(`change`,r);let i=0,a=!0,o=performance.now(),c=0,p=-1,v=-1,y=-1,b=typeof CSS<`u`&&CSS.supports(`mix-blend-mode`,`plus-lighter`),x=(e,t)=>{if(!e)return;let n=t%s,r=Math.floor(t/s);e.style.backgroundPosition=`${n/4*100}% ${r/4*100}%`},S=n=>{let r=Math.min(.05,(n-o)/1e3);o=n,c+=r,K.current=c;let s=e.clientWidth||1440,C=s/1440,w=s<640,T=w?C*2.3:C,E=0,D=c-t.pActive<2.6&&t.pActive>0;if(c-t.keyAt<4)E=t.keyTurn;else if(D){let n=k.current,r=n?n.getBoundingClientRect():null,i=e.getBoundingClientRect(),a=r?r.left-i.left+r.width*l:s/2,o=_((t.px-a)/(s*(w?.36:.26)),-1,1),c=u[t.key];if(Math.abs(o-c)>.31){let e=0;for(let t=1;t<u.length;t++)Math.abs(u[t]-o)<Math.abs(u[e]-o)&&(e=t);t.key=e}E=u[t.key]}else if(!t.reduced){let e=0;for(let t of d)e+=t[1]+f;let t=(c+.4)%e,n=0;for(;t>d[n][1]+f;)t-=d[n][1]+f,n++;E=d[n][0]}D||(t.key=u.indexOf(E)>=0?u.indexOf(E):2);let F=D||c-t.keyAt<4?30:17,I=(E-t.angle)*F-2*Math.sqrt(F)*t.vel;t.vel+=I*r,t.angle+=t.vel*r;let L=(_(t.angle,-1,1)+1)/2*24,R=Math.floor(L),z=Math.min(24,R+1),B=L-R;R!==p&&(x(M.current,R),p=R),z!==v&&(x(N.current,z),v=z);let V=Math.round(B*100)/100;V!==y&&N.current&&(N.current.style.opacity=String(V),b&&M.current&&(M.current.style.opacity=String(1-V)),y=V);let H=t.reduced?0:Math.sin(c/15*Math.PI*2),U=t.reduced?0:Math.sin(c/11*Math.PI*2+1.1),W=D?_(t.px/s*2-1,-1,1):0,G=D?_(t.py/(e.clientHeight||810)*2-1,-1,1):0,J=1-Math.exp(-r*3);t.cam+=(H*.75+W*.9-t.cam)*J,t.camY+=(U*.5+G*.7-t.camY)*J;let Y=t.cam*C,X=t.camY*C;O.current&&(O.current.style.transform=`translate3d(${(Y*9).toFixed(2)}px, ${(X*4).toFixed(2)}px, 0)`),k.current&&(k.current.style.transform=`translate3d(${(-Y*10).toFixed(2)}px, ${(-X*5).toFixed(2)}px, 0)`),A.current&&(A.current.style.transform=`translate3d(${(-Y*3+34*C).toFixed(2)}px, ${(-X*1+16*C).toFixed(2)}px, 0)`),j.current&&(j.current.style.transform=`translate3d(${(-Y*26).toFixed(2)}px, ${(-X*12).toFixed(2)}px, 0)`),!t.reduced&&t.hover<0&&t.shuffleAt<0&&c>=t.nextShuffle&&q(null);let Z=1;t.shuffleAt>=0&&(Z=_((c-t.shuffleAt)/g,0,1),Z>=1&&(t.shuffleAt=-1,t.flyer=-1,t.nextShuffle=c+h-g));let Q=ee(Z);for(let e=0;e<4;e++){let n=P.current[e];if(!n)continue;let i=t.order.indexOf(e),a=t.shuffleAt>=0?t.from[e]:i,o=m[a],s=m[i],c=o.x+(s.x-o.x)*Q,l=o.y+(s.y-o.y)*Q,u=o.r+(s.r-o.r)*Q,d=10-i;if(t.shuffleAt>=0){let n=Math.sin(Math.PI*Q);e===t.flyer&&i>a?(l-=n*168,c+=n*70,u+=n*7,d=Q<.5?20:1):e===t.flyer?(l-=n*168,c-=n*40,u-=n*5,d=Q<.5?1:20):d=10-(Q<.5?a:i)}let f=+(t.hover===e&&t.shuffleAt<0);t.lift[e]+=(f-t.lift[e])*(1-Math.exp(-r*14));let p=t.lift[e];l-=p*16,u*=1-p*.5;let h=1+p*.06;n.style.transform=`translate3d(${(c*T).toFixed(2)}px, ${(l*T).toFixed(2)}px, 0) rotate(${u.toFixed(2)}deg) scale(${h.toFixed(3)})`,n.style.zIndex=String(p>.05?30:d),n.style.setProperty(`--leo-lift`,p.toFixed(3))}i=a&&!document.hidden?requestAnimationFrame(S):0},C=()=>{!i&&a&&!document.hidden&&(o=performance.now(),i=requestAnimationFrame(S))},w=new IntersectionObserver(([e])=>{a=e.isIntersecting,a?C():i&&=(cancelAnimationFrame(i),0)});w.observe(e);let T=()=>{document.hidden||C()};document.addEventListener(`visibilitychange`,T);let E=n=>{let r=e.getBoundingClientRect();t.px=n.clientX-r.left,t.py=n.clientY-r.top,t.pActive=K.current||.001},F=()=>{t.pActive=0};e.addEventListener(`pointermove`,E),e.addEventListener(`pointerleave`,F),C();let I=window.setTimeout(()=>z(!0),30);return()=>{cancelAnimationFrame(i),w.disconnect(),document.removeEventListener(`visibilitychange`,T),e.removeEventListener(`pointermove`,E),e.removeEventListener(`pointerleave`,F),n.removeEventListener?.(`change`,r),window.clearTimeout(I)}},[q]),(0,i.useEffect)(()=>()=>{F.current?.close().catch(()=>{})},[]);let J=e=>{(q(e)||H.current.order[0]===e)&&W()},Y=e=>{let t=H.current;e.key===`ArrowLeft`||e.key===`ArrowRight`?(e.preventDefault(),t.keyTurn=_(t.keyTurn+(e.key===`ArrowLeft`?-.5:.5),-1,1),t.keyAt=K.current,G()):e.key===`Home`&&(t.keyTurn=0,t.keyAt=K.current)},X=()=>{G(),V(!0),E?.(),window.setTimeout(()=>V(!1),1800)},Z={"--leo-ink":e,"--leo-ground":t},Q=e=>({backgroundImage:`url("${e}")`,backgroundSize:`500% 500%`}),te=Math.floor(o/2),$=`${te%s/4*100}% ${Math.floor(te/s)/4*100}%`,ne={left:`${c.x*100}%`,top:`${c.y*100}%`,width:`${c.w*100}%`,height:`${c.h*100}%`};return(0,a.jsxs)(`section`,{ref:D,className:`leo-root${R?` leo-in`:``}`,style:Z,"aria-label":`${r}, film photographer`,children:[(0,a.jsx)(`style`,{children:y}),(0,a.jsx)(`div`,{className:`leo-wall`,"aria-hidden":`true`}),(0,a.jsxs)(`nav`,{className:`leo-nav`,children:[(0,a.jsx)(`span`,{className:`leo-logo`,children:r}),(0,a.jsxs)(`div`,{className:`leo-links`,children:[(0,a.jsx)(`a`,{href:`#work`,children:`Work`}),(0,a.jsx)(`a`,{href:`#prints`,children:`Prints`}),(0,a.jsx)(`a`,{href:`#workshops`,children:`Workshops`})]}),(0,a.jsx)(`button`,{type:`button`,className:`leo-cta`,onClick:X,"aria-live":`polite`,children:B?`Thanks, I'll write back`:b})]}),(0,a.jsx)(`div`,{className:`leo-type`,ref:O,children:(0,a.jsxs)(`h1`,{className:`leo-h1`,children:[(0,a.jsx)(`span`,{className:`leo-w leo-w1`,children:(0,a.jsx)(`span`,{children:`HI,`})}),` `,(0,a.jsx)(`span`,{className:`leo-w leo-w2`,children:(0,a.jsx)(`span`,{children:`I’M`})}),` `,(0,a.jsx)(`span`,{className:`leo-w leo-w3`,children:(0,a.jsx)(`span`,{children:n.toUpperCase()})})]})}),(0,a.jsxs)(`div`,{className:`leo-figure leo-shadowbox`,ref:A,"aria-hidden":`true`,children:[(0,a.jsx)(`img`,{className:`leo-body`,src:x,alt:``,draggable:!1}),(0,a.jsx)(`div`,{className:`leo-head`,style:{...ne,...Q(S),backgroundPosition:$}})]}),(0,a.jsxs)(`div`,{className:`leo-figure leo-man`,ref:k,tabIndex:0,role:`img`,"aria-label":`${r} holding a 35 mm camera. He turns his head toward the pointer; use the left and right arrow keys to turn it.`,onKeyDown:Y,children:[(0,a.jsx)(`img`,{className:`leo-body`,src:x,alt:``,draggable:!1}),(0,a.jsxs)(`div`,{className:`leo-heads`,style:ne,children:[(0,a.jsx)(`div`,{className:`leo-head leo-head-a`,ref:M,style:{...Q(S),backgroundPosition:$}}),(0,a.jsx)(`div`,{className:`leo-head leo-head-b`,ref:N,style:{...Q(S),backgroundPosition:$,opacity:0}})]})]}),(0,a.jsx)(`p`,{className:`leo-line`,children:v}),(0,a.jsx)(`div`,{className:`leo-deck`,ref:j,id:`prints`,"aria-label":`Prints`,children:[0,1,2,3].map(e=>(0,a.jsx)(`button`,{type:`button`,className:`leo-print`,ref:t=>{P.current[e]=t},style:{backgroundImage:`url("${C}")`,backgroundPosition:`${e%2*100}% ${Math.floor(e/2)*100}%`},"aria-label":`Print: ${p[e]}. Bring to the top.`,onPointerEnter:()=>H.current.hover=e,onPointerLeave:()=>H.current.hover=H.current.hover===e?-1:H.current.hover,onFocus:()=>H.current.hover=e,onBlur:()=>H.current.hover=-1,onClick:()=>J(e)},e))}),(0,a.jsxs)(`span`,{className:`leo-roll`,"aria-live":`off`,children:[`ROLL `,w,` · FRAME `,String(I).padStart(2,`0`)]})]})}var y=`
@import url("https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap");

.leo-root {
  container-type: inline-size;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  background: var(--leo-ground);
  color: #111;
  font-family: "Inter Tight", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.leo-wall {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(60% 70% at 30% 20%, rgba(255, 255, 255, 0.7), transparent 70%),
    radial-gradient(80% 60% at 80% 110%, rgba(0, 0, 0, 0.06), transparent 70%);
}
.leo-wall::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.1;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
}

/* nav */
.leo-nav {
  position: absolute;
  z-index: 40;
  left: 3.05cqi;
  right: 3.05cqi;
  top: 30px;
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 14px;
  font-weight: 500;
}
.leo-logo { font-weight: 600; font-size: 18px; letter-spacing: -0.01em; margin-right: auto; }
.leo-links { display: flex; gap: 28px; }
.leo-links a { color: inherit; text-decoration: none; opacity: 0.8; border-radius: 4px; }
.leo-links a:hover { opacity: 1; }
.leo-cta {
  font: inherit;
  font-size: 13.5px;
  padding: 10px 18px;
  border: 0;
  border-radius: 999px;
  background: #111;
  color: #fff;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.3, 1.4, 0.5, 1), background 0.2s;
}
.leo-cta:hover { background: #2a2a2a; }
.leo-cta:active { transform: scale(0.97); }
.leo-root :focus-visible { outline: 2px solid var(--leo-ink); outline-offset: 3px; }

/* plane 1: the name */
.leo-type {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  top: 14.8%;
  will-change: transform;
  pointer-events: none;
}
.leo-h1 {
  margin: 0;
  text-align: center;
  font-family: "Archivo", "Arial Narrow", sans-serif;
  font-weight: 900;
  font-stretch: 62%;
  font-variation-settings: "wdth" 62;
  font-size: 20.83cqi;
  line-height: 0.82;
  letter-spacing: -0.01em;
  color: var(--leo-ink);
  white-space: nowrap;
}
.leo-w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.04em; }
.leo-w > span { display: inline-block; transform: translateY(105%); }
.leo-in .leo-w > span { transform: none; transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
.leo-in .leo-w2 > span { transition-delay: 0.08s; }
.leo-in .leo-w3 > span { transition-delay: 0.16s; }

/* plane 2: Leo (and his shadow on the wall) */
.leo-figure {
  position: absolute;
  bottom: -4.94%;
  left: 46.08cqi;
  height: 86.42%;
  aspect-ratio: 2 / 3;
  translate: -50% 0;
  will-change: transform;
}
.leo-man { z-index: 5; outline: none; opacity: 0; scale: 1.025; transition: opacity 0.9s ease-out, scale 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
.leo-in .leo-man { opacity: 1; scale: 1; }
.leo-man:focus-visible::after {
  content: "";
  position: absolute;
  left: 22%;
  right: 22%;
  bottom: 12%;
  height: 2px;
  background: var(--leo-ink);
}
.leo-shadowbox {
  z-index: 3;
  filter: brightness(0) blur(12px);
  opacity: 0;
  transition: opacity 1.2s ease-out 0.2s;
  pointer-events: none;
}
.leo-in .leo-shadowbox { opacity: 0.22; }
.leo-body { position: absolute; inset: 0; width: 100%; height: 100%; display: block; user-select: none; -webkit-user-drag: none; }
.leo-head { position: absolute; background-repeat: no-repeat; pointer-events: none; }
/* the turning head: two neighbouring frames, added together inside their own group */
.leo-heads { position: absolute; isolation: isolate; pointer-events: none; }
.leo-heads .leo-head { inset: 0; }
@supports (mix-blend-mode: plus-lighter) { .leo-head-b { mix-blend-mode: plus-lighter; } }

/* the line */
.leo-line {
  position: absolute;
  z-index: 8;
  left: 3.9cqi;
  bottom: 56px;
  max-width: 330px;
  margin: 0;
  font-size: 16px;
  line-height: 1.45;
  letter-spacing: -0.005em;
  opacity: 0;
  transition: opacity 0.8s ease-out 0.5s;
}
.leo-in .leo-line { opacity: 1; }

/* plane 3: the prints */
.leo-deck {
  position: absolute;
  z-index: 10;
  right: 4.86cqi;
  bottom: 9.9%;
  width: calc(var(--leo-pw) + 172 / 1440 * 100cqi);
  height: calc(var(--leo-ph) + 64 / 1440 * 100cqi);
  --leo-pw: 13.2cqi;
  --leo-ph: 9.03cqi;
  will-change: transform;
  opacity: 0;
  transition: opacity 0.7s ease-out 0.7s;
}
.leo-in .leo-deck { opacity: 1; }
.leo-print {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--leo-pw);
  height: var(--leo-ph);
  padding: 0;
  border: 0.42cqi solid #fff;
  border-radius: 1px;
  background-color: #ddd;
  background-size: 200% 200%;
  background-repeat: no-repeat;
  background-origin: content-box;
  background-clip: content-box;
  cursor: pointer;
  --leo-lift: 0;
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.08),
    0 calc(10px + 14px * var(--leo-lift)) calc(22px + 18px * var(--leo-lift)) rgba(0, 0, 0, calc(0.16 + 0.08 * var(--leo-lift)));
  transform-origin: 50% 60%;
}

.leo-roll {
  position: absolute;
  z-index: 12;
  right: 4.17cqi;
  bottom: 40px;
  font-family: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
}

/* 1440×900 and taller: a touch more air under the name */
@container (min-width: 641px) and (max-width: 1100px) {
  .leo-links { gap: 20px; }
  .leo-line { max-width: 280px; font-size: 15px; }
}

/* phone: the name stacks, Leo stands centred in front of it */
@container (max-width: 640px) {
  .leo-nav { top: 18px; left: 20px; right: 20px; gap: 12px; }
  .leo-logo { font-size: 16px; }
  .leo-links { display: none; }
  .leo-cta { padding: 9px 15px; font-size: 13px; }
  .leo-type { top: 108px; }
  .leo-h1 { white-space: normal; line-height: 0.8; }
  .leo-w1, .leo-w2 { font-size: 34cqi; }
  .leo-w3 { display: block; font-size: 66cqi; line-height: 0.8; margin-top: 0.02em; }
  .leo-figure { left: 44cqi; height: 66%; bottom: -4%; }
  .leo-line { left: 20px; right: 20px; top: 66px; bottom: auto; max-width: none; font-size: 13.5px; line-height: 1.4; }
  .leo-deck { right: -6px; bottom: 2.4%; --leo-pw: 27cqi; --leo-ph: 18.5cqi; width: calc(var(--leo-pw) + 172 / 1440 * 230cqi); height: calc(var(--leo-ph) + 64 / 1440 * 230cqi); }
  .leo-print { border-width: 1.1cqi; }
  .leo-roll { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .leo-w > span, .leo-man, .leo-shadowbox, .leo-line, .leo-deck { transition: none !important; }
  .leo-w > span { transform: none; }
  .leo-man, .leo-line, .leo-deck { opacity: 1; scale: 1; }
  .leo-shadowbox { opacity: 0.22; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(v,{})}));