import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o={landX:.228,landY:.676,shore:[[0,.662],[.027,.651],[.6,.648],[.72,.668],[1,.704]]},s=.64,c=.36,l=`polygon(${o.shore.map(([e,t])=>`${Math.round(e*1e3)/10}% ${Math.round((t-s)/c*1e3)/10}%`).join(`, `)}, 100% 100%, 0% 100%)`,u=e=>{let t=o.shore;for(let n=1;n<t.length;n++)if(e<=t[n][0])return t[n-1][1]+(t[n][1]-t[n-1][1])*(e-t[n-1][0])/(t[n][0]-t[n-1][0]||1);return t[t.length-1][1]},d=61,f=2,p=Array.from({length:15},(e,t)=>t===0?{top:0,bottom:39}:{top:d+f*(t-1),bottom:t===14?-20:39-f*t}),m=(e=>{let t=e;return()=>(t=t*16807%2147483647,(t-1)/2147483646)})(20261120),ee=Array.from({length:84},()=>({v0:m(),off:m()*2-1,sp:.045+m()*.11,len:3+m()*10,a:.14+m()*.4,tw:.6+m()*1.8,ph:m()*6.28})),te=Array.from({length:9},()=>({v0:m(),off:m()*1.5-.75,sp:.018+m()*.03,r:.2+m()*.22,a:.1+m()*.13,f:.2+m()*.4,ph:m()*6.28})),h=[[.52,.8],[.36,.9],[.66,.86],[.12,.84],[.45,.74],[.82,.93]];function g(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)((n,r,i=.035)=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let a=navigator.userActivation;if(!(a&&!a.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let a=t.current??=new e;a.state===`suspended`&&a.resume();let o=a.currentTime,s=a.createGain();s.gain.setValueAtTime(1e-4,o),s.gain.exponentialRampToValueAtTime(Math.min(i,.06),o+.005),s.gain.exponentialRampToValueAtTime(1e-4,o+.07),s.connect(a.destination);let c=a.createOscillator();c.type=`sine`,c.frequency.setValueAtTime(n,o),c.frequency.exponentialRampToValueAtTime(r,o+.06),c.connect(s),c.start(o),c.stop(o+.08)}catch{}},[e])}function _({mark:e=`SØ`,word:t=`solène`,statement:n=`Warm water, slow light,
and nowhere to be.
Three hours that give you
the week back.`,cta:r=`Book a bath`,nav:d=[`Baths`,`Rituals`,`The house`,`Visit`],water:f=`36°`,hours:m=[`Open daily, 7 to 23`,`Rue des Sources 14`],photo:_=`/design/websites/solene/bath.webp`,light:y=`#ffe7b8`,pace:b=1.6,autoplay:x=!0,sound:S=!0,onCta:C}){let w=(0,i.useRef)(null),T=(0,i.useRef)(null),E=(0,i.useRef)(null),D=(0,i.useRef)(null),O=(0,i.useRef)(null),ne=(0,i.useRef)(null),k=(0,i.useRef)(null),A=(0,i.useRef)(()=>{}),j=g(S),M=Array.from(t);return(0,i.useEffect)(()=>{let e=w.current,t=T.current,n=E.current,r=D.current,i=O.current,a=k.current;if(!e||!t||!n||!r||!i||!a)return;let l=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,d=r.getContext(`2d`),f=i.getContext(`2d`);if(!d||!f)return;let p=document.createElement(`canvas`);p.width=176,p.height=44;let m=p.getContext(`2d`),g=m?.createImageData(176,44)??null,_=y.replace(`#`,``),v=parseInt(_.slice(0,2),16)||255,S=parseInt(_.slice(2,4),16)||231,C=parseInt(_.slice(4,6),16)||184,j=new Float32Array(7744),M=new Float32Array(7744);for(let e=0;e<44;e++)for(let t=0;t<176;t++){let n=e*176+t,r=t/176,i=(e+2)/46;j[n]=24*Math.log(1+e*.24);let a=Math.exp(-(((r-o.landX)/.1)**2));M[n]=(.1+.2*i)*(1+2.4*a*(1-i*.5))}let N=Array.from(a.querySelectorAll(`[data-sln-l]`)),re=N.map(e=>Array.from(e.querySelectorAll(`[data-sln-s]`))),P=N.map((e,t)=>.15+.7*t/Math.max(1,N.length-1)),F=()=>{let e=n.getBoundingClientRect();e.width&&(P=N.map(t=>{let n=t.getBoundingClientRect();return(n.left+n.width/2-e.left)/e.width}))},I=[],L=!0,R=0,z=0,B=0,V=.15,H=3.4,ie=0,U=-100,W=-100,G=0,K=0,q=0,J=0,Y=5.6,X=e=>.012+.43*e**.86,Z=(e,t,n)=>{I.push({x:e,y:t,t0:B,power:n}),I.length>9&&I.shift()},Q=()=>{let e=r.width,t=r.height;d.clearRect(0,0,e,t);let n=Math.sin(B*.23)*.035+Math.sin(B*.11+1)*.02,i=e=>.44+(.07+n)*e,a=e=>.25+.05*e;d.globalCompositeOperation=`lighter`;for(let n of te){let r=((n.v0-B*n.sp)%1+1)%1,o=(i(r)+n.off*a(r)+Math.sin(B*n.f+n.ph)*.07)*e,s=r*t,c=n.r*e,l=n.a*Math.sin(Math.PI*r),u=d.createRadialGradient(o,s,0,o,s,c);u.addColorStop(0,`rgba(${v},${S},${C},${l.toFixed(3)})`),u.addColorStop(1,`rgba(${v},${S},${C},0)`),d.fillStyle=u,d.fillRect(o-c,s-c,c*2,c*2)}d.lineCap=`round`;for(let r of ee){let o=(r.v0+B*r.sp)%1,s=i(o)+r.off*a(o)*.92,c=1-Math.abs(r.off)**3,l=r.a*c*Math.min(1,o*7)*Math.min(1,(1-o)*9)*(.55+.45*Math.sin(B*r.tw+r.ph));if(l<=.01)continue;let u=s*e,f=o*t;d.strokeStyle=`rgba(255,${Math.min(255,S+14)},${Math.min(255,C+30)},${l.toFixed(3)})`,d.lineWidth=.9,d.beginPath(),d.moveTo(u,f),d.lineTo(u+(.07+n)*(r.len/t)*e,f+r.len),d.stroke()}d.globalCompositeOperation=`source-over`},$=()=>{let e=i.width,t=i.height;if(f.clearRect(0,0,e,t),m&&g){let n=g.data;for(let e=0;e<44;e++){let t=e*176,r=e*.3;for(let e=0;e<176;e++){let i=t+e,a=Math.sin(j[i]+1.5*Math.sin(e*.047+B*.52)+B*.85)*(.62+.38*Math.sin(e*.093-B*.37+r)),o=a>0?a*a*a*M[i]:0,s=i*4;n[s]=v,n[s+1]=S,n[s+2]=C,n[s+3]=o*255}}m.putImageData(g,0,0),f.imageSmoothingEnabled=!0,f.drawImage(p,0,0,e,t)}for(let n of I){let r=(B-n.t0)/Y;if(r<=0||r>=1)continue;let i=X(r)*e,a=(n.y-s)/c*t,o=.1+(n.y-s)/c*.2,l=(1-r)**1.5*Math.min(1,r*14)*n.power;if(f.lineWidth=1.5-r*.7,f.strokeStyle=`rgba(255,${Math.min(255,S+12)},${Math.min(255,C+24)},${(.62*l).toFixed(3)})`,f.beginPath(),f.ellipse(n.x*e,a,i,i*o,0,0,Math.PI*2),f.stroke(),f.lineWidth=2.2-r,f.strokeStyle=`rgba(14,34,26,${(.34*l).toFixed(3)})`,f.beginPath(),f.ellipse(n.x*e,a+1.2,i+2.4,(i+2.4)*o,0,0,Math.PI*2),f.stroke(),r<.5){let t=X(r*.55)*e;f.lineWidth=1,f.strokeStyle=`rgba(255,${Math.min(255,S+12)},${Math.min(255,C+24)},${(.4*l*(1-r*2)).toFixed(3)})`,f.beginPath(),f.ellipse(n.x*e,a,t,t*o,0,0,Math.PI*2),f.stroke()}}},ae=()=>{for(let e=0;e<N.length;e++){let t=0,n=.3;for(let r of I){let i=(B-r.t0)/Y;if(i<=0||i>=1)continue;let a=X(i)-Math.abs(P[e]-r.x);if(a<=0)continue;let o=Math.exp(-a*8)*(1-i)**1.1*r.power;t+=o*Math.sin(a*44),n+=o}n>1.5&&(n=1.5);let r=-.03*t,i=re[e];for(let t=0;t<i.length;t++){let a=.013*(t===0?0:(t/(i.length-1))**1.25)*n*Math.sin(B*2.3-t*.52+e*.7);i[t].style.transform=`translate3d(${a.toFixed(4)}em, ${r.toFixed(4)}em, 0)`}}},oe=t=>{if(R=requestAnimationFrame(oe),!L||document.hidden){z=t;return}let n=Math.min(.05,(t-z)/1e3||.016);if(z=t,B+=n,B>=V&&(Z(o.landX,o.landY,1),V=B+Math.max(.6,b),ne.current?.animate([{opacity:.95,transform:`translate(-50%, -50%) scale(1.14)`},{opacity:.5,transform:`translate(-50%, -50%) scale(1)`}],{duration:900,easing:`cubic-bezier(.2,.7,.2,1)`})),x&&B>=H&&B-U>6){let[e,t]=h[ie++%h.length];Z(e,Math.max(t,u(e)+.03),1.25),H=B+3.1}I=I.filter(e=>B-e.t0<Y),(Math.abs(G-q)>.002||Math.abs(K-J)>.002)&&(q+=(G-q)*Math.min(1,n*3),J+=(K-J)*Math.min(1,n*3),e.style.setProperty(`--sln-px`,q.toFixed(3)),e.style.setProperty(`--sln-py`,J.toFixed(3))),Q(),$(),ae()},se=()=>{B=4,I=[{x:o.landX,y:o.landY,t0:B-.5,power:1},{x:o.landX,y:o.landY,t0:B-1.9,power:1},{x:o.landX,y:o.landY,t0:B-3.4,power:1}],Q(),$()};A.current=(e,r,i)=>{let a=n.getBoundingClientRect();if(!a.width)return;let o=(e-a.left)/a.width,s=(r-a.top)/a.height,c=t.getBoundingClientRect();if(G=Math.max(-1,Math.min(1,(e-c.left)/c.width*2-1)),K=Math.max(-1,Math.min(1,(r-c.top)/c.height*2-1)),!(s<u(o)+.012||s>1||o<0||o>1)){if(l){if(!i)return;I=I.slice(0,3).concat([{x:o,y:s,t0:B-.7,power:1.2}]),$();return}!i&&B-W<.34||(W=B,U=B,Z(o,s,i?1.5:.8))}};let ce=()=>{G=0,K=0};F();let le=new ResizeObserver(F);le.observe(t);let ue=new IntersectionObserver(([e])=>{L=e.isIntersecting});return ue.observe(e),t.addEventListener(`pointerleave`,ce),document.fonts?.ready.then(F).catch(()=>{}),l?se():R=requestAnimationFrame(oe),()=>{cancelAnimationFrame(R),le.disconnect(),ue.disconnect(),t.removeEventListener(`pointerleave`,ce),A.current=()=>{}}},[y,b,x,t]),(0,a.jsxs)(`section`,{ref:w,className:`sln-root`,style:{"--sln-light":y,"--sln-n":Math.max(4,M.length)},"aria-label":`${t}, thermal baths`,children:[(0,a.jsx)(`style`,{children:v}),(0,a.jsxs)(`p`,{className:`sln-meta sln-meta-l`,children:[(0,a.jsx)(`span`,{children:`Thermal baths`}),`Lyon, since 1896`]}),(0,a.jsxs)(`p`,{className:`sln-meta sln-meta-r`,children:[(0,a.jsx)(`span`,{children:m[0]}),m[1]]}),(0,a.jsxs)(`div`,{ref:T,className:`sln-frame`,onPointerMove:e=>A.current(e.clientX,e.clientY,!1),onPointerDown:e=>{e.target.closest(`button`)||(A.current(e.clientX,e.clientY,!0),j(620,250))},children:[(0,a.jsxs)(`div`,{ref:E,className:`sln-scene`,children:[(0,a.jsx)(`img`,{className:`sln-photo`,src:_,alt:`A vaulted stone bath hall: one shaft of sunlight falls from a round opening onto green water`,draggable:!1}),(0,a.jsx)(`span`,{className:`sln-beam`,"aria-hidden":!0}),(0,a.jsx)(`canvas`,{ref:D,className:`sln-shaft`,width:176,height:340,"aria-hidden":!0}),(0,a.jsx)(`span`,{ref:ne,className:`sln-land`,"aria-hidden":!0}),(0,a.jsx)(`canvas`,{ref:O,className:`sln-pool`,width:704,height:170,style:{clipPath:l},"aria-hidden":!0})]}),(0,a.jsx)(`span`,{className:`sln-veil`,"aria-hidden":!0}),(0,a.jsxs)(`div`,{className:`sln-orb`,"aria-hidden":!0,children:[(0,a.jsx)(`span`,{className:`sln-ring sln-ring-0`}),(0,a.jsxs)(`span`,{className:`sln-arm sln-arm-l`,children:[(0,a.jsx)(`span`,{className:`sln-ring sln-ring-s`}),(0,a.jsx)(`i`,{className:`sln-spark`})]}),(0,a.jsxs)(`span`,{className:`sln-arm sln-arm-r`,children:[(0,a.jsx)(`span`,{className:`sln-ring sln-ring-s`}),(0,a.jsx)(`i`,{className:`sln-spark`})]}),(0,a.jsx)(`span`,{className:`sln-arm sln-arm-m`,children:(0,a.jsx)(`i`,{className:`sln-moon`})})]}),(0,a.jsxs)(`header`,{className:`sln-nav`,children:[(0,a.jsx)(`span`,{className:`sln-mark`,children:e}),(0,a.jsx)(`nav`,{className:`sln-pill`,"aria-label":`Sections`,children:d.map(e=>(0,a.jsx)(`button`,{type:`button`,children:e},e))}),(0,a.jsx)(`button`,{type:`button`,className:`sln-menu`,children:`Menu`}),(0,a.jsx)(`button`,{type:`button`,className:`sln-temp`,"aria-label":`The great pool is at ${f} today`,children:f})]}),(0,a.jsx)(`h1`,{className:`sln-say`,children:n.split(`
`).map((e,t)=>(0,a.jsxs)(`span`,{children:[e,` `]},t))}),(0,a.jsx)(`button`,{type:`button`,className:`sln-cta`,onClick:()=>{j(520,780,.03),C?.()},children:r}),(0,a.jsx)(`div`,{ref:k,className:`sln-word`,"aria-hidden":!0,children:M.map((e,t)=>(0,a.jsxs)(`span`,{className:`sln-l`,"data-sln-l":!0,children:[(0,a.jsx)(`span`,{className:`sln-ghost`,children:e}),p.map((t,n)=>(0,a.jsx)(`span`,{className:`sln-s`,"data-sln-s":!0,style:{clipPath:n===0?`inset(-40% -20% ${t.bottom}% -20%)`:`inset(${t.top}% -20% calc(${t.bottom}% - 0.5px) -20%)`},children:e},n))]},t))})]})]})}var v=`
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..500&display=swap");
@property --sln-a { syntax: "<angle>"; inherits: false; initial-value: 360deg; }

.sln-root {
  --sln-ground: #bfc2b2; --sln-ink: #2c3028; --sln-px: 0; --sln-py: 0;
  container: sln / inline-size; position: relative; isolation: isolate; overflow: hidden;
  width: 100%; height: var(--design-h, 100svh); min-height: 640px;
  background: var(--sln-ground); color: #fff;
  font-family: "Outfit", "Avenir Next", "Segoe UI", system-ui, sans-serif; -webkit-font-smoothing: antialiased;
}
.sln-root *, .sln-root *::before, .sln-root *::after { box-sizing: border-box; }
.sln-root button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.sln-root button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

/* the two small lines over the picture */
.sln-meta { position: absolute; top: 1.25cqi; margin: 0; font-size: max(11px, 0.86cqi); line-height: 1.38; font-weight: 400; color: var(--sln-ink); letter-spacing: .005em; }
.sln-meta span { display: block; opacity: .58; }
.sln-meta-l { left: 2.7cqi; }
.sln-meta-r { right: 2.7cqi; text-align: right; }

/* the picture */
.sln-frame {
  container: slnf / size; position: absolute; left: 2cqi; right: 2cqi; top: 4.6cqi; bottom: 2cqi;
  border-radius: 2cqi; overflow: hidden; background: #8c7850; touch-action: manipulation;
  clip-path: inset(0 round 2cqi); transform: translateZ(0);
}
.sln-scene {
  --sw: max(100cqw, 150cqh); --sh: max(66.667cqw, 100cqh); --fx: .5;
  position: absolute; width: var(--sw); height: var(--sh);
  left: clamp(100cqw - var(--sw), 50cqw - var(--fx) * var(--sw), 0px);
  top: calc((100cqh - var(--sh)) * .1);
  transform: translate3d(calc(var(--sln-px) * -.5cqw), calc(var(--sln-py) * -.35cqw), 0) scale(1.03);
  transform-origin: 30% 60%; will-change: transform;
}
.sln-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; user-select: none; -webkit-user-drag: none; }

/* the shaft of light: a soft body that breathes, and the dust inside it */
.sln-beam {
  position: absolute; left: 9%; top: 6%; width: 27%; height: 64%;
  filter: blur(1.5cqw); mix-blend-mode: screen; opacity: .42; transform-origin: 46% 0; pointer-events: none;
  animation: sln-breathe 5.6s ease-in-out infinite alternate;
}
.sln-beam::before {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, color-mix(in srgb, var(--sln-light) 70%, transparent), color-mix(in srgb, var(--sln-light) 34%, transparent) 62%, transparent 96%);
  clip-path: polygon(24% 0, 68% 0, 82% 100%, 22% 100%);
}
@keyframes sln-breathe { from { opacity: .16; transform: skewX(-1.6deg) scaleX(.94); } to { opacity: .62; transform: skewX(1.8deg) scaleX(1.05); } }
.sln-shaft {
  position: absolute; left: 10%; top: 2%; width: 26%; height: 68%;
  mix-blend-mode: screen; pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, transparent 6%, #000 20%, #000 90%, transparent);
          mask-image: linear-gradient(180deg, transparent 6%, #000 20%, #000 90%, transparent);
}
.sln-land {
  position: absolute; left: 22.8%; top: 67.6%; width: 23%; height: 4.4%; border-radius: 50%;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--sln-light) 80%, #fff) 0, color-mix(in srgb, var(--sln-light) 46%, transparent) 46%, transparent);
  mix-blend-mode: screen; opacity: .5; transform: translate(-50%, -50%); pointer-events: none;
}
.sln-pool { position: absolute; left: 0; top: 64%; width: 100%; height: 36%; pointer-events: none; }
.sln-veil {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(34,26,12,.3), transparent 20%), linear-gradient(0deg, rgba(12,26,20,.5), transparent 40%);
}

/* the orrery */
.sln-orb {
  --R: 23cqw; --r: 21cqw;
  position: absolute; left: 50%; top: 49%; width: 0; height: 0; pointer-events: none;
  transform: translate3d(calc(var(--sln-px) * 1.1cqw), calc(var(--sln-py) * .9cqw), 0);
}
.sln-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,.56); }
.sln-ring-0 {
  left: calc(var(--R) * -1); top: calc(var(--R) * -1); width: calc(var(--R) * 2); height: calc(var(--R) * 2);
  -webkit-mask-image: conic-gradient(from -90deg, #000 var(--sln-a), transparent 0); mask-image: conic-gradient(from -90deg, #000 var(--sln-a), transparent 0);
  animation: sln-draw 2.2s cubic-bezier(.3,.6,.2,1) both;
}
@keyframes sln-draw { from { --sln-a: 0deg; } to { --sln-a: 360deg; } }
.sln-arm { position: absolute; left: 0; top: 0; width: 0; height: 0; will-change: transform; }
.sln-ring-s { left: calc(var(--R)); top: calc(var(--r) * -1); width: calc(var(--r) * 2); height: calc(var(--r) * 2); opacity: .8; }
.sln-arm-r { animation: sln-roll-r 17s ease-in-out infinite alternate; }
.sln-arm-l { animation: sln-roll-l 21s ease-in-out infinite alternate; }
@keyframes sln-roll-r { from { transform: rotate(-17deg); } to { transform: rotate(15deg); } }
@keyframes sln-roll-l { from { transform: rotate(196deg); } to { transform: rotate(166deg); } }
.sln-spark {
  position: absolute; left: calc(var(--R) - 1.05cqw); top: -1.05cqw; width: 2.1cqw; height: 2.1cqw; min-width: 18px; min-height: 18px; background: #fff;
  clip-path: polygon(50% 0, 57% 43%, 100% 50%, 57% 57%, 50% 100%, 43% 57%, 0 50%, 43% 43%);
  animation: sln-twinkle 3.4s ease-in-out infinite;
}
.sln-arm-l .sln-spark { animation-delay: -1.7s; }
@keyframes sln-twinkle { 0%, 100% { transform: scale(.62) rotate(0deg); opacity: .7; } 50% { transform: scale(1.18) rotate(45deg); opacity: 1; } }
.sln-arm-m { animation: sln-orbit 24s linear infinite; }
@keyframes sln-orbit { from { transform: rotate(118deg); } to { transform: rotate(478deg); } }
.sln-moon { position: absolute; left: calc(var(--R) - .95cqw); top: -.95cqw; width: 1.9cqw; height: 1.9cqw; min-width: 14px; min-height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 1.6cqw rgba(255,255,255,.45); }

/* nav */
.sln-nav { position: absolute; left: 0; right: 0; top: 2.6cqw; height: 3.5cqw; min-height: 40px; display: flex; align-items: center; justify-content: center; }
.sln-mark { position: absolute; left: 3.2cqw; font-size: max(20px, 2cqw); font-weight: 300; letter-spacing: .04em; line-height: 1; }
.sln-pill {
  width: 52cqw; height: 100%; display: flex; align-items: center; justify-content: space-around; padding: 0 2cqw; border-radius: 99px;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.2); backdrop-filter: blur(12px) saturate(1.2);
}
.sln-pill button { font-size: max(11px, .92cqw); font-weight: 400; letter-spacing: .09em; text-transform: uppercase; padding: .7em 1em; border-radius: 99px; transition: background .3s; }
.sln-pill button:hover { background: rgba(255,255,255,.14); }
.sln-menu { display: none; }
.sln-temp {
  position: absolute; right: 3cqw; width: 3.5cqw; height: 3.5cqw; min-width: 40px; min-height: 40px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.75) !important; font-size: max(12px, 1cqw) !important; font-weight: 400; font-variant-numeric: tabular-nums; letter-spacing: .01em;
  display: grid; place-items: center; transition: background .3s, color .3s;
}
.sln-temp:hover { background: #fff; color: var(--sln-ink) !important; }

/* the statement and the button */
.sln-say {
  position: absolute; left: 50%; top: 21cqh; margin: 0; width: 36cqw; transform: translateX(-50%); text-align: center;
  font-size: max(17px, 1.98cqw); line-height: 1.2; font-weight: 300; letter-spacing: -.005em; text-shadow: 0 1px 1.6cqw rgba(48,34,10,.5);
}
.sln-say span { display: block; }
.sln-cta {
  position: absolute; right: 3.4cqw; top: 36cqh; padding: 1.15em 1.9em !important; border-radius: 99px;
  background: #fff !important; color: var(--sln-ink) !important; font-size: max(12px, 1.02cqw) !important; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
  box-shadow: 0 .6cqw 2.4cqw -1cqw rgba(30,20,6,.6); transition: transform .35s cubic-bezier(.2,.9,.3,1.3), box-shadow .3s;
}
.sln-cta:hover { transform: translateY(-2px) scale(1.03); }
.sln-cta:active { transform: scale(.96); }

/* the name, very large and very thin, cut by the frame */
.sln-word {
  position: absolute; left: 50%; bottom: -.185em; transform: translateX(-50%); display: flex; white-space: nowrap; pointer-events: none;
  font-size: calc(188cqw / var(--sln-n)); line-height: 1; font-weight: 150; letter-spacing: -.012em; color: #fff;
}
.sln-l { position: relative; display: block; }
.sln-ghost { visibility: hidden; }
.sln-s { position: absolute; left: 0; top: 0; will-change: transform; }

/* phone: the picture is the screen */
@container sln (max-width: 700px) {
  .sln-meta { display: none; }
  .sln-frame { left: 0; right: 0; top: 0; bottom: 0; border-radius: 0; clip-path: none; }
  .sln-scene { --fx: .3; top: 0; }
  .sln-veil { background: linear-gradient(180deg, rgba(34,26,12,.46), rgba(34,26,12,.12) 34%, transparent 50%), linear-gradient(0deg, rgba(12,26,20,.55), transparent 36%); }
  .sln-orb { --R: 44cqw; --r: 40cqw; top: 56%; }
  .sln-nav { top: 62px; height: 44px; justify-content: flex-end; padding: 0 20px; gap: 10px; }
  .sln-mark { left: 22px; font-size: 24px; }
  .sln-pill { display: none; }
  .sln-menu {
    display: block; order: 2; height: 44px; padding: 0 20px !important; border-radius: 99px; background: rgba(255,255,255,.12) !important; border: 1px solid rgba(255,255,255,.45) !important;
    font-size: 12px !important; letter-spacing: .1em; text-transform: uppercase; -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .sln-temp { position: static; order: 1; width: 44px; height: 44px; font-size: 13px !important; }
  .sln-say { top: 146px; width: 84cqw; font-size: 23px; line-height: 1.22; }
  .sln-cta { right: auto; left: 50%; top: 284px; transform: translateX(-50%); font-size: 12.5px !important; }
  .sln-cta:hover { transform: translateX(-50%) scale(1.03); }
  .sln-cta:active { transform: translateX(-50%) scale(.96); }
  .sln-word { font-size: calc(190cqw / var(--sln-n)); }
}

@media (prefers-reduced-motion: reduce) {
  .sln-beam, .sln-ring-0, .sln-arm, .sln-spark { animation: none !important; }
  .sln-beam { opacity: .42; }
  .sln-arm-r { transform: rotate(0deg); }
  .sln-arm-l { transform: rotate(180deg); }
  .sln-arm-m { transform: rotate(118deg); }
  .sln-scene, .sln-orb { transform: none; }
  .sln-cta { transition: none; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(_,{})}));