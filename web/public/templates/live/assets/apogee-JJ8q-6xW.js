import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=560,s=1024,c=512,l=-14,u=l*Math.PI/180,d=2.2,f=.26,p=[{a:2.62,period:52,at:.82},{a:3.25,period:97,at:.37}],m=`ada@example.com`,h=[{title:`Read`,links:[`This week`,`The archive`,`Start here`,`Sky calendar`]},{title:`Letter`,links:[`Who writes it`,`Sources`,`Corrections`]},{title:`Help`,links:[`Contact`,`Privacy`,`Unsubscribe`]}],g=e=>Math.round(e*100)/100;function _(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(()=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let n=navigator.userActivation;if(!(n&&!n.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let n=t.current??=new e;n.state===`suspended`&&n.resume(),[{f:620,to:780,at:0},{f:930,to:1180,at:.07}].forEach(e=>{let t=n.currentTime+e.at,r=n.createGain();r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(.04,t+.004),r.gain.exponentialRampToValueAtTime(1e-4,t+.058),r.connect(n.destination);let i=n.createOscillator();i.type=`sine`,i.frequency.setValueAtTime(e.f,t),i.frequency.exponentialRampToValueAtTime(e.to,t+.055),i.connect(r),i.start(t),i.stop(t+.07)})}catch{}},[e])}function v({brand:e=`APOGEE`,line1:t=`One letter a week.`,line2:n=`Worth looking up for.`,cta:r=`SEND IT TO ME`,readers:l=61204,glow:d=`#ffb07a`,turn:v=70,sky:b=`/design/websites/apogee/sky.webp`,flat:x=`/design/websites/apogee/flat.webp`,planet:S=`/design/websites/apogee/planet.webp`,ridge:C=`/design/websites/apogee/ridge.webp`,stars:w=`/design/websites/apogee/stars.webp`,mistA:T=`/design/websites/apogee/mist-a.webp`,mistB:E=`/design/websites/apogee/mist-b.webp`,grain:D=`/design/websites/apogee/grain.webp`,sound:O=!0,onSubscribe:k}){let A=(0,i.useRef)(null),j=(0,i.useRef)(null),ee=(0,i.useRef)(null),te=(0,i.useRef)(null),ne=(0,i.useRef)(null),M=(0,i.useRef)(null),re=(0,i.useRef)(null),ie=(0,i.useRef)(null),ae=(0,i.useRef)(null),oe=(0,i.useRef)(null),se=(0,i.useRef)(null),ce=(0,i.useRef)(null),le=(0,i.useRef)(null),N=(0,i.useRef)(null),[P,F]=(0,i.useState)(``),[I,L]=(0,i.useState)(`idle`),[R,z]=(0,i.useState)(0),[B,V]=(0,i.useState)(null),[H,U]=(0,i.useState)(!0),W=_(O),ue=(0,i.useRef)(v);ue.current=Math.max(8,v);let G=(0,i.useRef)(`idle`);G.current=I;let K=(0,i.useRef)(-1e9),q=(0,i.useRef)(!1),J=(0,i.useRef)(!1),Y=(0,i.useRef)([]),X=(0,i.useRef)(0),de=(0,i.useRef)(k);de.current=k;let Z=(0,i.useCallback)((e,t)=>{if(G.current===`fly`||G.current===`done`)return;let n=j.current,r=N.current,i=M.current,a=null;if(n&&r&&i&&!J.current){let e=n.getBoundingClientRect(),t=e.width/(n.offsetWidth||1),o=n.offsetWidth,s=n.offsetHeight,c=r.getBoundingClientRect(),l=i.getBoundingClientRect(),d=23*(o<=700?o/100*2.6:Math.min(o/100,s*1.6/100)),p=-.42,m=Math.cos(p)*d*1.86,h=Math.sin(p)*d*1.86*f,_=(l.left-e.left)/t+m*Math.cos(u)-h*Math.sin(u),v=(l.top-e.top)/t+m*Math.sin(u)+h*Math.cos(u),y=(c.left+c.width/2-e.left)/t,b=(c.top+c.height/2-e.top)/t,x=y+(_-y)*.42,S=Math.min(b,v)-Math.max(60,Math.abs(_-y)*.34);X.current+=1,a={d:`M${g(y)} ${g(b)} Q${g(x)} ${g(S)} ${g(_)} ${g(v)}`,w:o,h:s,x:g(_),y:g(v),n:X.current}}V(a),L(`fly`),t===`person`&&W();let o=a?1250:60;Y.current.push(window.setTimeout(()=>{L(`done`),z(e=>e+1),t===`person`&&de.current?.(e)},o),window.setTimeout(()=>{L(`idle`),F(``),q.current=!1},o+2600),window.setTimeout(()=>V(e=>e&&a&&e.n===a.n?null:e),o+3400))},[W]),fe=e=>{if(e.preventDefault(),K.current=performance.now(),I===`fly`||I===`done`)return;let t=q.current?``:P.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)){q.current&&(q.current=!1,F(``)),L(`bad`),Y.current.push(window.setTimeout(()=>L(e=>e===`bad`?`idle`:e),520));return}Z(t,`person`)},Q=()=>{K.current=performance.now(),q.current&&G.current===`idle`&&(q.current=!1,F(``))};(0,i.useEffect)(()=>{let e=A.current;if(!e)return;let t=!0,n=()=>U(t&&!document.hidden),r=new IntersectionObserver(([e])=>{t=e.isIntersecting,n()});return r.observe(e),document.addEventListener(`visibilitychange`,n),()=>{r.disconnect(),document.removeEventListener(`visibilitychange`,n)}},[]),(0,i.useEffect)(()=>()=>{Y.current.forEach(e=>window.clearTimeout(e))},[]),(0,i.useEffect)(()=>{let e=A.current,t=j.current,n=ee.current;if(!e||!t||!n)return;let r=window.matchMedia(`(prefers-reduced-motion: reduce)`);J.current=r.matches;let i=()=>{J.current=r.matches};r.addEventListener(`change`,i);let a=n.getContext(`2d`),l=te.current?.getContext(`2d`)??null,d=o/2,m=new Int32Array(o*o),h=new Uint16Array(o*o),g=new Int32Array(o*o),_=0;for(let e=0;e<o;e++){let t=(e+.5-d)/d;for(let n=0;n<o;n++){let r=(n+.5-d)/d,i=r*r+t*t;if(i>=1)continue;let a=Math.sqrt(1-i),l=Math.atan2(r,a),u=Math.asin(t);m[_]=e*o+n,h[_]=Math.floor((l/(Math.PI*2)+.5)*s)%s,g[_]=Math.min(511,Math.floor((u/Math.PI+.5)*c))*s,_++}}let v=_,y=null,b=a?a.createImageData(o,o):null,x=b?new Uint32Array(b.data.buffer):null,C=!1,w=new Image;w.decoding=`async`,w.onload=()=>{if(!C)try{let e=document.createElement(`canvas`);e.width=s,e.height=c;let t=e.getContext(`2d`);if(!t)return;t.drawImage(w,0,0,s,c),y=new Uint32Array(t.getImageData(0,0,s,c).data.buffer),T(I),l?.drawImage(n,0,0,128,128),n.dataset.on=`1`}catch{y=null}},w.src=S;function T(e){if(!y||!b||!x||!a)return;let t=(e%1+1)%1*s,n=Math.floor(t),r=Math.round((t-n)*256),i=256-r,o=1023;for(let e=0;e<v;e++){let t=h[e]+n&o,a=g[e],s=y[a+t],c=y[a+(t+1&o)],l=(s&16711935)*i+(c&16711935)*r>>>8&16711935,u=(s&65280)*i+(c&65280)*r>>>8&65280;x[m[e]]=4278190080|l|u}a.putImageData(b,0,0)}let E=0,D=0,O=0,k=0,N=-1e9,P=t=>{if(t.pointerType===`touch`)return;let n=e.getBoundingClientRect();O=Math.max(-1,Math.min(1,(t.clientX-n.left)/n.width*2-1)),k=Math.max(-1,Math.min(1,(t.clientY-n.top)/n.height*2-1)),N=performance.now()},F=()=>{N=-1e9};e.addEventListener(`pointermove`,P),e.addEventListener(`pointerleave`,F);let I=.18,L=0,R=0,z=0,B=0,V=[ce.current,le.current],H=(e,t,n)=>{e&&(e.style.transform=`translate3d(${t.toFixed(2)}px, ${n.toFixed(2)}px, 0)`)},U=e=>{z=requestAnimationFrame(U),B||=e;let r=L?Math.min(.05,(e-L)/1e3):0;L=e;let i=(e-B)/1e3,a=t.offsetWidth,o=t.offsetHeight,s=a<=700?a/100*2.6:Math.min(a/100,o*1.6/100);I+=r/ue.current,T(I),l&&R%3==0&&y&&l.drawImage(n,0,0,128,128),R++,e-N>1400&&(O=Math.sin(i*.21)*.85,k=Math.sin(i*.29+1.1)*.7),E+=(O-E)*.05,D+=(k-D)*.05,H(ne.current,-E*s*.4,-D*s*.22),H(M.current,-E*s*.95,-D*s*.5),H(re.current,-E*s*.95,D*s*.5),H(ie.current,-E*s*.55,0),H(oe.current,-E*s*1.35,-D*s*.3),H(se.current,-E*s*2.5,-D*s*.75),H(ae.current,-E*s*3.1,-D*s*.9);let c=23*s;for(let e=0;e<p.length;e++){let t=p[e],n=V[e];if(!n)continue;let r=(t.at+i/t.period)*Math.PI*2,a=Math.cos(r)*t.a*c,o=Math.sin(r)*t.a*c*f,s=a*Math.cos(u)-o*Math.sin(u),l=a*Math.sin(u)+o*Math.cos(u),d=Math.sin(r)<0&&s*s+l*l<c*c*1.02;H(n,s,l),n.style.opacity=d?`0`:`1`}},W=()=>{let e=t.offsetWidth,n=t.offsetHeight,r=23*(e<=700?e/100*2.6:Math.min(e/100,n*1.6/100));p.forEach((e,t)=>{let n=e.at*Math.PI*2,i=Math.cos(n)*e.a*r,a=Math.sin(n)*e.a*r*f;H(V[t],i*Math.cos(u)-a*Math.sin(u),i*Math.sin(u)+a*Math.cos(u))})};W();let G=!1,K=()=>{G||J.current||e.dataset.live!==`true`||(G=!0,L=0,z=requestAnimationFrame(U))},q=()=>{G=!1,cancelAnimationFrame(z)};K();let Y=new MutationObserver(()=>e.dataset.live===`true`?K():q());Y.observe(e,{attributes:!0,attributeFilter:[`data-live`]});let X=new ResizeObserver(()=>{G||W()});return X.observe(t),()=>{C=!0,q(),Y.disconnect(),X.disconnect(),r.removeEventListener(`change`,i),e.removeEventListener(`pointermove`,P),e.removeEventListener(`pointerleave`,F)}},[S]),(0,i.useEffect)(()=>{if(!H)return;let e=`wait`,t=performance.now()+1100,n=0,r=window.setInterval(()=>{if(J.current)return;let r=performance.now();if(r-K.current<6e3){e=`wait`,t=r+1500;return}if(e===`wait`){if(r<t||G.current!==`idle`)return;e=`type`,n=0,q.current=!0;return}if(e===`type`){n++,F(m.slice(0,n)),n>=15&&(e=`hold`,t=r+420);return}r>=t&&(Z(m,`page`),e=`wait`,t=r+1250+2600+3300)},62);return()=>window.clearInterval(r)},[H,Z]);let pe=(l+R).toLocaleString(`en-US`),me=I===`fly`||I===`done`,he={"--apg-glow":d},$=e=>({backgroundImage:`url(${e})`}),ge=e=>(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`span`,{className:`apg-ring apg-ring-back`,children:(0,a.jsx)(`i`,{})}),(0,a.jsxs)(`span`,{className:`apg-disc`,children:[(0,a.jsx)(`span`,{className:`apg-globe`,style:$(S),children:(0,a.jsx)(`canvas`,{ref:e?te:ee,width:e?128:o,height:e?128:o})}),(0,a.jsx)(`span`,{className:`apg-shade`})]}),(0,a.jsx)(`span`,{className:`apg-ring apg-ring-front`,children:(0,a.jsx)(`i`,{})})]});return(0,a.jsxs)(`div`,{ref:A,className:`apg-root`,style:he,"data-live":H,"data-phase":I,children:[(0,a.jsx)(`style`,{children:y}),(0,a.jsxs)(`div`,{ref:j,className:`apg-stage`,children:[(0,a.jsxs)(`div`,{className:`apg-scene`,"aria-hidden":`true`,children:[(0,a.jsxs)(`div`,{className:`apg-sky`,children:[(0,a.jsx)(`img`,{className:`apg-skyimg`,src:b,alt:``,draggable:!1}),(0,a.jsx)(`div`,{className:`apg-starbox`,children:(0,a.jsx)(`div`,{ref:ne,className:`apg-par`,children:(0,a.jsx)(`img`,{className:`apg-wheel`,src:w,alt:``,draggable:!1})})}),(0,a.jsx)(`span`,{className:`apg-meteor apg-meteor-a`}),(0,a.jsx)(`span`,{className:`apg-meteor apg-meteor-b`}),(0,a.jsx)(`span`,{className:`apg-meteor apg-meteor-c`}),(0,a.jsx)(`div`,{className:`apg-planet`,children:(0,a.jsxs)(`div`,{ref:M,className:`apg-par`,children:[ge(!1),(0,a.jsx)(`span`,{ref:ce,className:`apg-moon`}),(0,a.jsx)(`span`,{ref:le,className:`apg-moon apg-moon-b`})]})}),(0,a.jsx)(`span`,{className:`apg-haze`})]}),(0,a.jsxs)(`div`,{className:`apg-flat`,children:[(0,a.jsx)(`img`,{ref:ie,className:`apg-flatimg`,src:x,alt:``,draggable:!1}),(0,a.jsx)(`div`,{className:`apg-water`,children:(0,a.jsx)(`div`,{className:`apg-planet apg-planet-mirror`,children:(0,a.jsx)(`div`,{ref:re,className:`apg-par`,children:(0,a.jsx)(`div`,{className:`apg-flip`,children:ge(!0)})})})}),(0,a.jsx)(`span`,{className:`apg-sheen`})]}),(0,a.jsx)(`div`,{className:`apg-mist apg-mist-b`,children:(0,a.jsx)(`div`,{ref:oe,className:`apg-par`,children:(0,a.jsx)(`i`,{style:$(E)})})}),(0,a.jsx)(`div`,{className:`apg-ridge`,children:(0,a.jsx)(`div`,{ref:se,className:`apg-par`,children:(0,a.jsx)(`img`,{src:C,alt:``,draggable:!1})})}),(0,a.jsx)(`div`,{className:`apg-mist apg-mist-a`,children:(0,a.jsx)(`div`,{ref:ae,className:`apg-par`,children:(0,a.jsx)(`i`,{style:$(T)})})}),(0,a.jsx)(`span`,{className:`apg-vig`}),(0,a.jsx)(`span`,{className:`apg-grain`,style:$(D)})]}),(0,a.jsxs)(`header`,{className:`apg-top`,children:[(0,a.jsxs)(`span`,{className:`apg-tag`,children:[(0,a.jsx)(`i`,{}),`No. 214 is out`]}),(0,a.jsxs)(`nav`,{className:`apg-links`,"aria-label":`Apogee`,children:[(0,a.jsx)(`button`,{type:`button`,className:`apg-link apg-link-wide`,children:`The archive`}),(0,a.jsxs)(`button`,{type:`button`,className:`apg-link`,children:[`Read this week’s letter`,(0,a.jsx)(`svg`,{viewBox:`0 0 12 12`,"aria-hidden":`true`,children:(0,a.jsx)(`path`,{d:`M3 9l6-6M4.2 3H9v4.8`})})]})]})]}),(0,a.jsxs)(`main`,{className:`apg-copy`,children:[(0,a.jsxs)(`h1`,{className:`apg-h1`,children:[(0,a.jsx)(`span`,{children:t}),(0,a.jsx)(`span`,{children:n})]}),(0,a.jsxs)(`form`,{className:`apg-form`,onSubmit:fe,noValidate:!0,"data-bad":I===`bad`,children:[I===`done`?(0,a.jsx)(`span`,{className:`apg-sent`,role:`status`,children:`You’re in. See you Sunday.`}):(0,a.jsx)(`input`,{className:`apg-input`,type:`email`,inputMode:`email`,autoComplete:`email`,"aria-label":`Your email`,placeholder:`Your email`,value:P,readOnly:I===`fly`,onFocus:Q,onPointerDown:Q,onKeyDown:Q,onChange:e=>{K.current=performance.now(),q.current=!1,F(e.target.value)}}),(0,a.jsx)(`button`,{ref:N,type:`submit`,className:`apg-send`,"aria-disabled":me,onPointerDown:()=>K.current=performance.now(),children:I===`done`?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`svg`,{viewBox:`0 0 14 14`,"aria-hidden":`true`,children:(0,a.jsx)(`path`,{d:`M2.5 7.4l3 3 6-6.6`})}),`SENT`]}):I===`fly`?`ON ITS WAY`:r})]}),(0,a.jsxs)(`p`,{className:`apg-note`,children:[`Sundays, 7 minutes, no adverts.`,` `,(0,a.jsx)(`b`,{className:`apg-count`,children:pe},pe),` `,`readers.`]})]}),B?(0,a.jsxs)(`svg`,{className:`apg-fx`,viewBox:`0 0 ${B.w} ${B.h}`,preserveAspectRatio:`none`,"aria-hidden":`true`,children:[(0,a.jsx)(`path`,{className:`apg-trail apg-trail-soft`,d:B.d,pathLength:1}),(0,a.jsx)(`path`,{className:`apg-trail`,d:B.d,pathLength:1}),(0,a.jsx)(`circle`,{className:`apg-ping`,cx:B.x,cy:B.y,r:5}),(0,a.jsx)(`circle`,{className:`apg-spark`,cx:B.x,cy:B.y,r:2.6})]},B.n):null,(0,a.jsxs)(`footer`,{className:`apg-panel`,children:[(0,a.jsxs)(`div`,{className:`apg-prow`,children:[(0,a.jsxs)(`div`,{className:`apg-about`,children:[(0,a.jsxs)(`div`,{className:`apg-brand`,children:[(0,a.jsxs)(`svg`,{viewBox:`0 0 32 32`,"aria-hidden":`true`,children:[(0,a.jsx)(`ellipse`,{cx:`16`,cy:`16`,rx:`13.2`,ry:`6.2`,transform:`rotate(-28 16 16)`}),(0,a.jsx)(`circle`,{className:`apg-brand-core`,cx:`16`,cy:`16`,r:`3.3`}),(0,a.jsx)(`circle`,{className:`apg-brand-far`,cx:`27.6`,cy:`9.8`,r:`2.3`})]}),e]}),(0,a.jsx)(`p`,{children:`What is in the sky this week, and why it matters, in plain words.`})]}),(0,a.jsx)(`div`,{className:`apg-cols`,children:h.map(e=>(0,a.jsxs)(`div`,{className:`apg-col`,children:[(0,a.jsx)(`h2`,{children:e.title}),(0,a.jsx)(`ul`,{children:e.links.map(e=>(0,a.jsx)(`li`,{children:(0,a.jsx)(`button`,{type:`button`,className:`apg-plink`,children:e})},e))})]},e.title))})]}),(0,a.jsxs)(`div`,{className:`apg-pfoot`,children:[(0,a.jsx)(`span`,{children:`Next issue: Sunday 23 November`}),(0,a.jsxs)(`span`,{className:`apg-keys`,children:[(0,a.jsx)(`button`,{type:`button`,"aria-label":`The feed`,children:(0,a.jsx)(`svg`,{viewBox:`0 0 20 20`,"aria-hidden":`true`,children:(0,a.jsx)(`path`,{d:`M4 15.9a.1.1 0 100-.2M4 10.2a5.8 5.8 0 015.8 5.8M4 4.4A11.6 11.6 0 0115.6 16`})})}),(0,a.jsx)(`button`,{type:`button`,"aria-label":`Write to us`,children:(0,a.jsx)(`svg`,{viewBox:`0 0 20 20`,"aria-hidden":`true`,children:(0,a.jsx)(`path`,{d:`M3 5.5h14v9H3zM3.4 6l6.6 5 6.6-5`})})}),(0,a.jsx)(`button`,{type:`button`,"aria-label":`Open the latest letter`,children:(0,a.jsx)(`svg`,{viewBox:`0 0 20 20`,"aria-hidden":`true`,children:(0,a.jsx)(`path`,{d:`M6 14l8-8M7.5 6H14v6.5`})})})]})]})]})]})]})}var y=`
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap");

.apg-root {
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  background: #11475a;
  color: #fff;
  font-family: "Outfit", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  --apg-glow: #ffb07a;
  --apg-shade: 11, 46, 60;
  /* one unit: a hundredth of the width, or less when the page is short */
  --u: min(1cqi, 1.6cqh);
  --apg-hz: 56%;
  --apg-px: 57%;
  --apg-rise: 4.5;
}
.apg-root * { box-sizing: border-box; }
.apg-stage { position: absolute; inset: 0; container-type: size; container-name: apgs; overflow: hidden; }
.apg-scene { position: absolute; inset: 0; pointer-events: none; user-select: none; }
.apg-par { position: absolute; inset: 0; will-change: transform; }

/* ---- sky ---- */
.apg-sky { position: absolute; left: 0; right: 0; top: 0; height: var(--apg-hz); overflow: hidden; }
.apg-skyimg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 100%; }
.apg-starbox { position: absolute; inset: 0; -webkit-mask-image: linear-gradient(to bottom, #000 0, #000 30%, transparent 80%); mask-image: linear-gradient(to bottom, #000 0, #000 30%, transparent 80%); }
.apg-wheel {
  position: absolute; left: 50%; top: 100%;
  width: calc(100cqi + 113cqh); height: calc(100cqi + 113cqh);
  width: calc(2 * hypot(50cqi, 56cqh) + 8px); height: calc(2 * hypot(50cqi, 56cqh) + 8px);
  translate: -50% -50%;
  opacity: .92;
  animation: apg-wheel 420s linear infinite;
}
@keyframes apg-wheel { to { rotate: -360deg; } }

.apg-meteor {
  position: absolute; width: calc(var(--u) * 10); height: max(1.5px, calc(var(--u) * .12)); border-radius: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.2) 40%, #fff);
  box-shadow: 0 0 calc(var(--u) * .5) rgba(255,255,255,.35);
  transform-origin: 100% 50%; opacity: 0;
}
.apg-meteor-a { left: 9%; top: 9%; animation: apg-meteor-a 7s linear infinite; }
.apg-meteor-b { left: 66%; top: 5%; width: calc(var(--u) * 6.5); animation: apg-meteor-b 11s linear -3.2s infinite; }
.apg-meteor-c { left: 30%; top: 24%; width: calc(var(--u) * 8); animation: apg-meteor-a 17s linear -9s infinite; }
@keyframes apg-meteor-a {
  0% { transform: translate3d(0, 0, 0) rotate(23deg); opacity: 0; }
  1.2% { opacity: 1; }
  9% { transform: translate3d(calc(var(--u) * 27), calc(var(--u) * 11.5), 0) rotate(23deg); opacity: 0; }
  100% { transform: translate3d(calc(var(--u) * 27), calc(var(--u) * 11.5), 0) rotate(23deg); opacity: 0; }
}
@keyframes apg-meteor-b {
  0% { transform: translate3d(0, 0, 0) rotate(27deg); opacity: 0; }
  1% { opacity: .9; }
  5% { transform: translate3d(calc(var(--u) * 15), calc(var(--u) * 7.6), 0) rotate(27deg); opacity: 0; }
  100% { transform: translate3d(calc(var(--u) * 15), calc(var(--u) * 7.6), 0) rotate(27deg); opacity: 0; }
}

/* ---- the planet: a point (its centre) that everything hangs from ---- */
.apg-planet { position: absolute; left: var(--apg-px); top: calc(100% - var(--u) * var(--apg-rise)); width: 0; height: 0; }
.apg-planet > .apg-par { inset: auto; left: 0; top: 0; width: 0; height: 0; }
.apg-disc {
  position: absolute; left: calc(var(--u) * -23); top: calc(var(--u) * -23); width: calc(var(--u) * 46); height: calc(var(--u) * 46);
  border-radius: 50%; overflow: hidden; background: rgb(var(--apg-shade));
  box-shadow: 0 0 calc(var(--u) * 5) color-mix(in srgb, var(--apg-glow) 22%, transparent);
}
.apg-globe { position: absolute; inset: 0; rotate: ${l}deg; background-size: 200% 100%; background-position: 36% 50%; }
.apg-globe canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; opacity: 0; }
.apg-globe canvas[data-on="1"], .apg-planet-mirror .apg-globe canvas { opacity: 1; }
/* the light comes from under the horizon on the left: a lit limb there, the rest falls into the sky's own colour */
.apg-shade {
  position: absolute; inset: 0; border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, transparent 0 63%, rgba(var(--apg-shade), .34) 86%, rgba(var(--apg-shade), .62) 100%),
    radial-gradient(circle at 20% 96%, transparent 0 38%, rgba(var(--apg-shade), .36) 54%, rgba(var(--apg-shade), .8) 69%, rgba(var(--apg-shade), .95) 86%),
    linear-gradient(200deg, rgba(8, 44, 58, .3), transparent 42%);
  box-shadow:
    inset calc(var(--u) * .5) calc(var(--u) * -.4) calc(var(--u) * 1.5) color-mix(in srgb, var(--apg-glow) 46%, transparent),
    inset calc(var(--u) * .12) calc(var(--u) * -.1) calc(var(--u) * .35) rgba(255, 244, 228, .5);
}

.apg-ring {
  position: absolute; left: calc(var(--u) * -23 * ${d}); top: calc(var(--u) * -23 * ${d}); width: calc(var(--u) * 46 * ${d}); height: calc(var(--u) * 46 * ${d});
  border-radius: 50%; transform: rotate(${l}deg) scaleY(${f}); overflow: hidden;
  background:
    conic-gradient(from 31deg, rgba(var(--apg-shade), .96) 0 23deg, rgba(var(--apg-shade), 0) 37deg 323deg, rgba(var(--apg-shade), .96) 337deg 360deg),
    radial-gradient(closest-side, #f3d8c2 0 60%, #ffe9d2 67%, #f6cdae 74%, #fff0de 79%, #e9c3a8 86%, #f8dcc4 93%, #e2c0aa 100%);
  -webkit-mask-image: radial-gradient(closest-side, transparent 57.4%, rgba(0,0,0,.26) 58.4%, rgba(0,0,0,.34) 64.6%, rgba(0,0,0,.86) 66.2%, rgba(0,0,0,.7) 72.5%, rgba(0,0,0,.92) 77.5%, rgba(0,0,0,.78) 81.4%, rgba(0,0,0,.07) 82.4%, rgba(0,0,0,.07) 84.6%, rgba(0,0,0,.58) 85.6%, rgba(0,0,0,.46) 91.5%, rgba(0,0,0,.6) 96%, transparent 98.4%);
  mask-image: radial-gradient(closest-side, transparent 57.4%, rgba(0,0,0,.26) 58.4%, rgba(0,0,0,.34) 64.6%, rgba(0,0,0,.86) 66.2%, rgba(0,0,0,.7) 72.5%, rgba(0,0,0,.92) 77.5%, rgba(0,0,0,.78) 81.4%, rgba(0,0,0,.07) 82.4%, rgba(0,0,0,.07) 84.6%, rgba(0,0,0,.58) 85.6%, rgba(0,0,0,.46) 91.5%, rgba(0,0,0,.6) 96%, transparent 98.4%);
  opacity: .9;
}
.apg-ring-back { clip-path: inset(0 0 50% 0); }
.apg-ring-front { clip-path: inset(50% 0 0 0); }
/* light that travels round the rings: a few brighter and dimmer spokes, turning with them */
.apg-ring i {
  position: absolute; inset: 0; border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(255,255,255,0) 0 8%, rgba(255,255,255,.34) 14%, rgba(255,255,255,0) 22% 36%, rgba(20,48,58,.26) 44%, rgba(255,255,255,0) 52% 63%, rgba(255,255,255,.28) 70%, rgba(255,255,255,0) 78% 88%, rgba(20,48,58,.2) 94%, rgba(255,255,255,0) 100%);
  animation: apg-spokes 38s linear infinite;
}
@keyframes apg-spokes { to { rotate: 360deg; } }

.apg-moon {
  position: absolute; left: calc(var(--u) * -.62); top: calc(var(--u) * -.62); width: calc(var(--u) * 1.24); height: calc(var(--u) * 1.24); border-radius: 50%;
  background: radial-gradient(circle at 24% 72%, #fff4e6 0 18%, #e7c9b2 40%, rgb(var(--apg-shade)) 74%);
  box-shadow: 0 0 calc(var(--u) * .9) color-mix(in srgb, var(--apg-glow) 40%, transparent);
  transition: opacity .5s; will-change: transform;
}
.apg-moon-b { left: calc(var(--u) * -.36); top: calc(var(--u) * -.36); width: calc(var(--u) * .72); height: calc(var(--u) * .72); }

.apg-haze {
  position: absolute; left: 0; right: 0; bottom: 0; height: 34%;
  background:
    radial-gradient(60% 100% at 8% 100%, rgba(255, 150, 84, .42), rgba(255, 150, 84, 0) 70%),
    linear-gradient(to top, rgba(232, 128, 96, .44), rgba(214, 140, 112, .12) 50%, rgba(214, 140, 112, 0));
}

/* ---- the flat, and the planet again in it ---- */
.apg-flat { position: absolute; left: 0; right: 0; top: var(--apg-hz); bottom: 0; overflow: hidden; }
.apg-flatimg { position: absolute; left: -3%; top: 0; width: 106%; height: 100%; object-fit: cover; object-position: 50% 0; will-change: transform; }
.apg-water {
  position: absolute; inset: 0; mix-blend-mode: screen; opacity: .6;
  -webkit-mask-image: linear-gradient(to bottom, #000 0, rgba(0,0,0,.75) calc(var(--u) * 6), transparent calc(var(--u) * 19));
  mask-image: linear-gradient(to bottom, #000 0, rgba(0,0,0,.75) calc(var(--u) * 6), transparent calc(var(--u) * 19));
}
.apg-planet-mirror { top: calc(var(--u) * var(--apg-rise)); --apg-shade: 0, 0, 0; }
.apg-flip { position: absolute; left: 0; top: 0; width: 0; height: 0; transform: scaleY(-1.12); }
.apg-planet-mirror .apg-disc { box-shadow: none; }
.apg-planet-mirror .apg-ring i { animation: none; }
.apg-sheen { position: absolute; left: 0; right: 0; top: 0; height: calc(var(--u) * 1.4); background: linear-gradient(to bottom, rgba(255, 196, 150, .5), rgba(255, 196, 150, 0)); }

/* ---- mist: two banks, one behind the ridge, one in front ---- */
.apg-mist { position: absolute; left: 0; right: 0; height: calc(var(--u) * 13); }
.apg-mist-b { top: calc(var(--apg-hz) - var(--u) * 8.6); opacity: .62; }
.apg-mist-a { top: calc(var(--apg-hz) + var(--u) * 1.6); height: calc(var(--u) * 11.5); opacity: .4; }
.apg-mist i {
  position: absolute; left: 0; top: 0; height: 100%; width: calc(var(--u) * 13 * 5.294 * 6);
  background-repeat: repeat-x; background-size: 16.6667% 100%;
  animation: apg-flow 64s linear infinite; will-change: transform;
}
.apg-mist-a i { width: calc(var(--u) * 11.5 * 5.294 * 6); animation-duration: 41s; animation-direction: reverse; }
@keyframes apg-flow { to { transform: translate3d(-33.3333%, 0, 0); } }

/* ---- the ridge and the watcher ---- */
.apg-ridge {
  position: absolute; left: 37%; bottom: calc(var(--u) * var(--apg-ridge, 14.5));
  width: calc(var(--u) * 142.9); height: calc(var(--u) * 14.4); margin-left: calc(var(--u) * -65.3);
}
.apg-ridge img { display: block; width: 100%; height: 100%; }
.apg-ridge .apg-par::after { content: ""; position: absolute; left: 0; right: 0; top: 99.4%; height: calc(var(--u) * 60); background: linear-gradient(#0a1415, #060c0d 40%); }

.apg-vig {
  position: absolute; inset: 0;
  background:
    radial-gradient(120% 70% at 50% 0%, rgba(6, 40, 54, .42), rgba(6, 40, 54, 0) 68%),
    linear-gradient(to top, rgba(2, 8, 10, .5), rgba(2, 8, 10, 0) 26%);
}
.apg-grain { position: absolute; inset: -80px; background-size: 150px 150px; opacity: .15; animation: apg-grain .72s steps(1, end) infinite; will-change: transform; }
@keyframes apg-grain {
  0% { transform: translate3d(0, 0, 0); }
  12.5% { transform: translate3d(-37px, 23px, 0); }
  25% { transform: translate3d(41px, -52px, 0); }
  37.5% { transform: translate3d(-64px, -18px, 0); }
  50% { transform: translate3d(22px, 61px, 0); }
  62.5% { transform: translate3d(58px, 14px, 0); }
  75% { transform: translate3d(-19px, -66px, 0); }
  87.5% { transform: translate3d(-71px, 44px, 0); }
}

/* ---- the page ---- */
.apg-top {
  position: absolute; z-index: 3; left: calc(var(--u) * 2.5); right: calc(var(--u) * 2.5); top: calc(var(--u) * 2);
  display: flex; align-items: center; justify-content: space-between; font-size: max(11px, calc(var(--u) * 1.02));
}
.apg-tag {
  display: inline-flex; align-items: center; gap: .65em; padding: .52em 1em .52em .85em; border-radius: 99px;
  border: 1px solid rgba(255,255,255,.24); background: rgba(255,255,255,.09); letter-spacing: .09em; text-transform: uppercase; font-size: .84em;
}
.apg-tag i { width: .52em; height: .52em; border-radius: 50%; background: var(--apg-glow); box-shadow: 0 0 .9em var(--apg-glow); animation: apg-pulse 2.4s ease-in-out infinite; }
@keyframes apg-pulse { 50% { opacity: .35; transform: scale(.8); } }
.apg-links { display: flex; align-items: center; gap: 2.3em; }
.apg-link {
  appearance: none; background: none; border: 0; padding: .3em 0; margin: 0; font: inherit; color: rgba(255,255,255,.9); cursor: pointer;
  display: inline-flex; align-items: center; gap: .45em; border-bottom: 1px solid transparent; transition: border-color .25s, color .25s;
}
.apg-link:hover { border-color: rgba(255,255,255,.6); color: #fff; }
.apg-link svg { width: .78em; height: .78em; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.apg-link-wide { color: rgba(255,255,255,.68); }

.apg-copy { position: absolute; z-index: 3; left: 0; right: 0; top: calc(var(--u) * 6.9); display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 4%; }
.apg-h1 { margin: 0; font-weight: 300; font-size: calc(var(--u) * 6.3); line-height: 1.04; letter-spacing: -.024em; text-shadow: 0 .03em .5em rgba(6, 34, 46, .4); }
.apg-h1 span { display: block; animation: apg-rise .9s cubic-bezier(.2,.8,.2,1) both; }
.apg-h1 span + span { animation-delay: .12s; }
@keyframes apg-rise { from { opacity: 0; transform: translate3d(0, .22em, 0); } }

.apg-form {
  position: relative; margin-top: calc(var(--u) * 2.5); width: calc(var(--u) * 37); max-width: 100%; height: calc(var(--u) * 4.7); padding: calc(var(--u) * .42);
  display: flex; align-items: center; border-radius: 99px;
  background: rgba(198, 224, 230, .17); border: 1px solid rgba(255,255,255,.32);
  -webkit-backdrop-filter: blur(16px) saturate(1.15); backdrop-filter: blur(16px) saturate(1.15);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 calc(var(--u) * 1.2) calc(var(--u) * 3) rgba(4, 22, 30, .26);
  transition: border-color .3s, box-shadow .3s;
}
.apg-form:focus-within { border-color: rgba(255,255,255,.7); }
.apg-form[data-bad="true"] { animation: apg-no .42s cubic-bezier(.3,.6,.3,1); border-color: color-mix(in srgb, var(--apg-glow) 80%, #fff); }
@keyframes apg-no { 20% { transform: translate3d(-7px,0,0); } 45% { transform: translate3d(6px,0,0); } 70% { transform: translate3d(-3px,0,0); } }
.apg-input {
  flex: 1; min-width: 0; height: 100%; padding: 0 calc(var(--u) * 1.7); background: none; border: 0; outline: 0; color: #fff;
  font: inherit; font-size: max(14px, calc(var(--u) * 1.34)); font-weight: 300; letter-spacing: .005em; text-align: left;
}
.apg-input::placeholder { color: rgba(255,255,255,.66); }
.apg-sent { flex: 1; min-width: 0; padding: 0 calc(var(--u) * 1.7); text-align: left; font-size: max(14px, calc(var(--u) * 1.34)); font-weight: 300; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: apg-rise .5s cubic-bezier(.2,.8,.2,1) both; }
.apg-send {
  appearance: none; flex: none; height: 100%; min-width: calc(var(--u) * 13.4); padding: 0 calc(var(--u) * 2.3); border-radius: 99px; cursor: pointer;
  border: 1px solid rgba(255,255,255,.16); background: rgba(10, 34, 44, .66); color: #fff;
  font: inherit; font-size: max(11px, calc(var(--u) * 1.08)); font-weight: 400; letter-spacing: .1em; white-space: nowrap;
  display: inline-flex; align-items: center; justify-content: center; gap: .55em;
  transition: background .35s, transform .22s cubic-bezier(.3,1.7,.5,1), box-shadow .35s;
}
.apg-send:hover { background: rgba(10, 34, 44, .82); }
.apg-send:active { transform: scale(.96); }
.apg-send:focus-visible, .apg-link:focus-visible, .apg-plink:focus-visible, .apg-keys button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.apg-send svg { width: 1.05em; height: 1.05em; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.apg-root[data-phase="fly"] .apg-send { transform: scale(.96); box-shadow: 0 0 calc(var(--u) * 1.6) color-mix(in srgb, var(--apg-glow) 60%, transparent); }
.apg-root[data-phase="done"] .apg-send { background: color-mix(in srgb, var(--apg-glow) 82%, #fff); color: #10262e; border-color: transparent; }
.apg-note { margin: calc(var(--u) * 1.25) 0 0; font-size: max(11.5px, calc(var(--u) * 1.04)); font-weight: 300; color: rgba(255,255,255,.78); text-shadow: 0 0 1em rgba(6, 34, 46, .5); }
.apg-count { display: inline-block; font-weight: 400; color: #fff; font-variant-numeric: tabular-nums; animation: apg-tick .5s cubic-bezier(.3,1.6,.5,1); }
@keyframes apg-tick { from { transform: translate3d(0, -.45em, 0); opacity: 0; } }

/* ---- the light on its way ---- */
.apg-fx { position: absolute; z-index: 4; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.apg-trail { fill: none; stroke: #fff; stroke-width: 2.4; stroke-linecap: round; stroke-dasharray: .13 2; stroke-dashoffset: .13; animation: apg-fly 1.25s cubic-bezier(.5,.05,.3,1) forwards; }
.apg-trail-soft { stroke: var(--apg-glow); stroke-width: 9; opacity: .32; stroke-dasharray: .2 2; stroke-dashoffset: .2; }
@keyframes apg-fly { to { stroke-dashoffset: -1.02; } }
.apg-ping { fill: none; stroke: #fff; stroke-width: 1.5; transform-box: fill-box; transform-origin: center; opacity: 0; animation: apg-ping 1s cubic-bezier(.2,.7,.2,1) 1.16s both; }
@keyframes apg-ping { 0% { transform: scale(.4); opacity: .95; } 100% { transform: scale(7); opacity: 0; } }
.apg-spark { fill: #fff; opacity: 0; filter: drop-shadow(0 0 5px var(--apg-glow)); animation: apg-spark 3.3s ease-out 1.16s both; }
@keyframes apg-spark { 0% { opacity: 1; } 60% { opacity: .9; } 100% { opacity: 0; } }

/* ---- the glass panel ---- */
.apg-panel {
  position: absolute; z-index: 3; left: calc(var(--u) * 1.25); right: calc(var(--u) * 1.25); bottom: calc(var(--u) * 1.25);
  padding: calc(var(--u) * 2) calc(var(--u) * 2.5) calc(var(--u) * 1.3); border-radius: calc(var(--u) * 1.5);
  background: linear-gradient(180deg, rgba(52, 72, 74, .4), rgba(16, 28, 30, .5));
  border: 1px solid rgba(255,255,255,.18);
  -webkit-backdrop-filter: blur(26px) saturate(1.25); backdrop-filter: blur(26px) saturate(1.25);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.13), 0 calc(var(--u) * 1.5) calc(var(--u) * 4) rgba(0, 0, 0, .28);
  font-size: max(11px, calc(var(--u) * 1.04)); font-weight: 300;
}
.apg-prow { display: flex; justify-content: space-between; gap: calc(var(--u) * 4); }
.apg-brand { display: flex; align-items: center; gap: .5em; font-size: 1.62em; font-weight: 400; letter-spacing: .06em; }
.apg-brand svg { width: 1.3em; height: 1.3em; fill: none; stroke: #fff; stroke-width: 1.5; }
.apg-brand-core { fill: #fff; stroke: none; }
.apg-brand-far { fill: var(--apg-glow); stroke: none; }
.apg-about p { margin: .95em 0 0; max-width: 22.5em; line-height: 1.46; color: rgba(255,255,255,.7); }
.apg-cols { display: flex; gap: calc(var(--u) * 6.4); padding-right: calc(var(--u) * .6); }
.apg-col h2 { margin: 0 0 .7em; font-size: 1em; font-weight: 400; color: #fff; }
.apg-col ul { list-style: none; margin: 0; padding: 0; }
.apg-plink { appearance: none; background: none; border: 0; padding: 0; margin: 0; font: inherit; color: rgba(255,255,255,.64); line-height: 1.82; cursor: pointer; text-align: left; transition: color .2s; }
.apg-plink:hover { color: #fff; }
.apg-pfoot { margin-top: calc(var(--u) * 1.2); padding-top: calc(var(--u) * 1.05); border-top: 1px solid rgba(255,255,255,.15); display: flex; align-items: center; justify-content: space-between; color: rgba(255,255,255,.64); }
.apg-keys { display: flex; gap: 1.15em; }
.apg-keys button { appearance: none; background: none; border: 0; padding: 0; margin: 0; width: 1.5em; height: 1.5em; color: rgba(255,255,255,.72); cursor: pointer; transition: color .2s, transform .25s cubic-bezier(.3,1.7,.5,1); }
.apg-keys button:hover { color: #fff; transform: translate3d(0, -2px, 0); }
.apg-keys svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.35; stroke-linecap: round; stroke-linejoin: round; }

/* off screen or in a hidden tab: everything holds still */
.apg-root[data-live="false"] .apg-wheel, .apg-root[data-live="false"] .apg-meteor, .apg-root[data-live="false"] .apg-ring i,
.apg-root[data-live="false"] .apg-mist i, .apg-root[data-live="false"] .apg-grain, .apg-root[data-live="false"] .apg-tag i { animation-play-state: paused; }

/* ---- a phone: the planet takes the upper half, the panel becomes a sheet ---- */
@container apgs (max-width: 700px) {
  .apg-scene { --u: 2.6cqi; --apg-hz: 55%; --apg-px: 61%; --apg-rise: 9; --apg-ridge: 21.2; }
  .apg-skyimg { object-position: 22% 100%; }
  .apg-flatimg { object-position: 22% 0; }
  .apg-ridge { left: 30%; }
  .apg-top { --u: 1cqi; left: 5cqi; right: 5cqi; top: 5.4cqi; font-size: 3.2cqi; }
  .apg-link-wide { display: none; }
  .apg-copy { top: 21cqi; padding: 0 5cqi; }
  .apg-h1 { font-size: 9.6cqi; line-height: 1.05; }
  .apg-form { margin-top: 6.4cqi; width: 100%; height: 14cqi; padding: 1.3cqi; }
  .apg-input, .apg-sent { padding: 0 4.4cqi; font-size: 3.9cqi; }
  .apg-send { min-width: 0; padding: 0 4.6cqi; font-size: 2.95cqi; letter-spacing: .08em; }
  .apg-note { margin-top: 3.6cqi; font-size: 3.2cqi; }
  .apg-panel { left: 2.6cqi; right: 2.6cqi; bottom: 2.6cqi; padding: 5cqi 5.4cqi 3.6cqi; border-radius: 6.4cqi; font-size: 3.45cqi; }
  .apg-prow { flex-direction: column; gap: 4.2cqi; }
  .apg-brand { font-size: 1.45em; }
  .apg-about p { margin-top: .7em; max-width: none; }
  .apg-cols { padding: 0; }
  .apg-col + .apg-col { display: none; }
  .apg-col { width: 100%; }
  .apg-col h2 { margin-bottom: .45em; }
  .apg-col ul { display: grid; grid-template-columns: 1fr 1fr; column-gap: 4cqi; }
  .apg-pfoot { margin-top: 3.4cqi; padding-top: 3cqi; font-size: .94em; }
  .apg-trail { stroke-width: 2; }
}

@media (prefers-reduced-motion: reduce) {
  .apg-wheel, .apg-meteor, .apg-ring i, .apg-mist i, .apg-grain, .apg-tag i, .apg-h1 span, .apg-sent, .apg-count, .apg-form[data-bad="true"] { animation: none !important; }
  .apg-send, .apg-moon { transition: none; }
  .apg-fx { display: none; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(v,{})}));