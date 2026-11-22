import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n();function o(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(n=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let r=navigator.userActivation;if(!(r&&!r.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let r=t.current??=new e;r.state===`suspended`&&r.resume();let i=r.currentTime,a=Math.min(n.d??.04,.06),o=r.createGain();if(o.gain.setValueAtTime(1e-4,i),o.gain.exponentialRampToValueAtTime(Math.min(n.g??.03,.06),i+.005),o.gain.exponentialRampToValueAtTime(1e-4,i+a),o.connect(r.destination),n.noise){let e=r.createBuffer(1,Math.ceil(r.sampleRate*a),r.sampleRate),t=e.getChannelData(0);for(let e=0;e<t.length;e++)t[e]=Math.random()*2-1;let s=r.createBufferSource();s.buffer=e;let c=r.createBiquadFilter();c.type=`bandpass`,c.frequency.setValueAtTime(n.f,i),n.to&&c.frequency.exponentialRampToValueAtTime(n.to,i+a),c.Q.value=n.q??.9,s.connect(c).connect(o),s.start(i),s.stop(i+a+.01)}else{let e=r.createOscillator();e.type=`triangle`,e.frequency.setValueAtTime(n.f,i),n.to&&e.frequency.exponentialRampToValueAtTime(n.to,i+a),e.connect(o),e.start(i),e.stop(i+a+.01)}}catch{}},[e])}var s={A:[`.####.`,`######`,`##..##`,`##..##`,`######`,`######`,`##..##`,`##..##`,`##..##`],B:[`#####.`,`######`,`##..##`,`#####.`,`######`,`##..##`,`##..##`,`######`,`#####.`],C:[`.#####`,`######`,`##....`,`##....`,`##....`,`##....`,`##....`,`######`,`.#####`],D:[`#####.`,`######`,`##..##`,`##..##`,`##..##`,`##..##`,`##..##`,`######`,`#####.`],E:[`######`,`######`,`##....`,`#####.`,`#####.`,`##....`,`##....`,`######`,`######`],F:[`######`,`######`,`##....`,`#####.`,`#####.`,`##....`,`##....`,`##....`,`##....`],G:[`.#####`,`######`,`##....`,`##....`,`##.###`,`##.###`,`##..##`,`######`,`.#####`],H:[`##..##`,`##..##`,`##..##`,`######`,`######`,`##..##`,`##..##`,`##..##`,`##..##`],I:[`######`,`######`,`..##..`,`..##..`,`..##..`,`..##..`,`..##..`,`######`,`######`],J:[`....##`,`....##`,`....##`,`....##`,`....##`,`....##`,`##..##`,`######`,`.####.`],K:[`##..##`,`##..##`,`##.##.`,`####..`,`####..`,`##.##.`,`##..##`,`##..##`,`##..##`],L:[`##....`,`##....`,`##....`,`##....`,`##....`,`##....`,`##....`,`######`,`######`],M:[`##....##`,`###..###`,`########`,`########`,`##.##.##`,`##.##.##`,`##....##`,`##....##`,`##....##`],N:[`##...##`,`###..##`,`###..##`,`####.##`,`##.####`,`##..###`,`##..###`,`##...##`,`##...##`],O:[`.####.`,`######`,`##..##`,`##..##`,`##..##`,`##..##`,`##..##`,`######`,`.####.`],P:[`#####.`,`######`,`##..##`,`##..##`,`######`,`#####.`,`##....`,`##....`,`##....`],Q:[`.####.`,`######`,`##..##`,`##..##`,`##..##`,`##..##`,`##.###`,`######`,`.#####`],R:[`#####.`,`######`,`##..##`,`##..##`,`#####.`,`#####.`,`##.##.`,`##..##`,`##..##`],S:[`.#####`,`######`,`##....`,`#####.`,`.#####`,`....##`,`....##`,`######`,`#####.`],T:[`######`,`######`,`..##..`,`..##..`,`..##..`,`..##..`,`..##..`,`..##..`,`..##..`],U:[`##..##`,`##..##`,`##..##`,`##..##`,`##..##`,`##..##`,`##..##`,`######`,`.####.`],V:[`##..##`,`##..##`,`##..##`,`##..##`,`##..##`,`##..##`,`.####.`,`.####.`,`..##..`],W:[`##....##`,`##....##`,`##....##`,`##.##.##`,`##.##.##`,`########`,`########`,`###..###`,`##....##`],X:[`##..##`,`##..##`,`##..##`,`.####.`,`..##..`,`.####.`,`##..##`,`##..##`,`##..##`],Y:[`##..##`,`##..##`,`##..##`,`.####.`,`..##..`,`..##..`,`..##..`,`..##..`,`..##..`],Z:[`######`,`######`,`....##`,`...##.`,`..##..`,`.##...`,`##....`,`######`,`######`],0:[`.####.`,`######`,`##..##`,`##.###`,`###.##`,`##..##`,`##..##`,`######`,`.####.`],1:[`..##..`,`.###..`,`####..`,`..##..`,`..##..`,`..##..`,`..##..`,`######`,`######`],2:[`.####.`,`######`,`##..##`,`....##`,`...##.`,`..##..`,`.##...`,`######`,`######`],3:[`#####.`,`######`,`....##`,`.####.`,`.####.`,`....##`,`....##`,`######`,`#####.`],4:[`##..##`,`##..##`,`##..##`,`######`,`######`,`....##`,`....##`,`....##`,`....##`],5:[`######`,`######`,`##....`,`#####.`,`######`,`....##`,`....##`,`######`,`#####.`],6:[`.#####`,`######`,`##....`,`#####.`,`######`,`##..##`,`##..##`,`######`,`.####.`],7:[`######`,`######`,`....##`,`...##.`,`..##..`,`..##..`,`..##..`,`..##..`,`..##..`],8:[`.####.`,`######`,`##..##`,`.####.`,`.####.`,`##..##`,`##..##`,`######`,`.####.`],9:[`.####.`,`######`,`##..##`,`##..##`,`######`,`.#####`,`....##`,`######`,`#####.`],"!":[`##`,`##`,`##`,`##`,`##`,`##`,`..`,`##`,`##`],"?":[`.####.`,`######`,`##..##`,`....##`,`..###.`,`..##..`,`......`,`..##..`,`..##..`],".":[`..`,`..`,`..`,`..`,`..`,`..`,`..`,`##`,`##`],"-":[`....`,`....`,`....`,`####`,`####`,`....`,`....`,`....`,`....`]," ":[`...`,`...`,`...`,`...`,`...`,`...`,`...`,`...`,`...`]};function c(e){let t=[],n=0;for(let r of e.toUpperCase().slice(0,14)){let e=s[r]??s[`-`],i=e[0].length;for(let r=0;r<9;r++){let a=0;for(;a<i;)if(e[r][a]===`#`){let o=a;for(;o<i&&e[r][o]===`#`;)o++;t.push({x:n+a,y:r,w:o-a}),a=o}else a++}n+=i+1}return{w:Math.max(1,n-1),runs:t}}var l=[{k:`t1`,text:`Makes things`,tone:`#a9e5c5`,hand:!1},{k:`t2`,text:`Sweats the details`,tone:`#f6d667`,hand:!1},{k:`t3`,text:`Product designer`,tone:`#f6d667`,hand:!0},{k:`t4`,text:`Lisbon, PT`,tone:`#a9e5c5`,hand:!0}],u=[{k:`n1`,big:`3.2×`,small:`more trips planned`,by:`Tramline`,tone:`#b9cdf6`},{k:`n2`,big:`−41%`,small:`taps to split a bill`,by:`Tally`,tone:`#f6e3a1`},{k:`n3`,big:`11`,small:`apps shipped since 2019`,by:`and counting`,tone:`#b5e6c9`}],d=[`Home`,`About`,`Work`,`Playground`],f=[{at:.7,dur:1,hold:.25,k:`p2`,to:[-.1,.06]},{at:3.1,dur:.85,hold:.3,handle:`se`,to:[.085,.032]},{at:5.5,peel:!0},{at:7.5,wink:!0},{at:8.3,dur:.9,hold:.2,k:`p1`,to:[.075,-.06]},{at:10.3,dur:.8,hold:.2,k:`n2`,to:[.04,-.05]},{at:11.7,dur:.7,hold:.25,handle:`w`,to:[-.06,0]}],p=14,m={nw:[-1,-1],n:[0,-1],ne:[1,-1],e:[1,0],se:[1,1],s:[0,1],sw:[-1,1],w:[-1,0]},h=e=>e<.5?2*e*e:1-(-2*e+2)**2/2,g=(e,t,n)=>Math.min(n,Math.max(t,e));function _({name:e=`JUNO`,line:t=[`I make software you stop noticing`,`because it just works.`],cta:n=`See the work`,frame:r=`#f0452e`,paper:s=`lined`,portrait:_=`/design/websites/juno/juno.webp`,street:v=`/design/websites/juno/tram.webp`,desk:y=`/design/websites/juno/desk.webp`,sound:x=!0,onCta:S}){let C=(0,i.useRef)(null),w=(0,i.useRef)(null),T=(0,i.useRef)(null),E=o(x),D=(0,i.useMemo)(()=>c(e),[e]),O=(0,i.useRef)({items:new Map,sides:{l:{v:0,vel:0,t:0},t:{v:0,vel:0,t:0},r:{v:0,vel:0,t:0},b:{v:0,vel:0,t:0}},handle:null,grab:null,scale:1,lastTouch:-1e9,t0:0,fired:{},wake:()=>{}});(0,i.useEffect)(()=>{let e=C.current,t=w.current;if(!e||!t)return;let n=O.current,r=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;n.items.clear(),e.querySelectorAll(`[data-drag]`).forEach(e=>{n.items.set(e.dataset.drag??``,{el:e,hang:e.dataset.hang===`1`,x:0,y:0,vx:0,vy:0,th:0,om:0,held:0,tx:0,ty:0,rest:!0})});let i=Array.from(e.querySelectorAll(`[data-tag]`)),a=e.querySelector(`[data-smile]`),o=[],s=0,c=0,l=!0,u=!1,d=()=>{if(!T.current)return;let n=(e.offsetWidth>700?1440:390)/Math.max(1,e.offsetWidth);T.current.textContent=`${Math.round(t.offsetWidth*n)} × ${Math.round(t.offsetHeight*n)}`};d();let _=()=>({w:t.offsetWidth-n.sides.l.v-n.sides.r.v,h:t.offsetHeight-n.sides.t.v-n.sides.b.v}),v=y=>{s=0;let b=Math.min(.032,c?(y-c)/1e3:.016);c=y;let x=e.offsetWidth,S=!1;if(!r&&y-n.lastTouch>6e3){n.t0||=y;let e=(y-n.t0)/1e3,r=Math.floor(e/p),s=e-r*p;f.forEach((e,c)=>{if(`peel`in e){s>=e.at&&n.fired[c]!==r&&(n.fired[c]=r,i.forEach((e,t)=>{o.push(window.setTimeout(()=>e.dataset.peel=`1`,t*230)),o.push(window.setTimeout(()=>delete e.dataset.peel,t*230+820))}));return}if(`wink`in e){s>=e.at&&n.fired[c]!==r&&a&&(n.fired[c]=r,a.dataset.wink=`1`,o.push(window.setTimeout(()=>delete a.dataset.wink,640)));return}let l=s>=e.at&&s<e.at+e.dur+e.hold,u=h(g((s-e.at)/e.dur,0,1));if(`k`in e){let t=n.items.get(e.k);if(!t||t.held===1)return;l?(t.held=2,t.tx=e.to[0]*x*u,t.ty=e.to[1]*x*u,t.el.dataset.held=`1`):t.held===2&&(t.held=0,delete t.el.dataset.held)}else{if(n.handle&&!n.handle.auto)return;let[r,i]=m[e.handle];l?(n.handle={dir:e.handle,auto:!0},t.dataset.pull=e.handle,r>0&&(n.sides.r.t=e.to[0]*x*u),r<0&&(n.sides.l.t=-e.to[0]*x*u),i>0&&(n.sides.b.t=e.to[1]*x*u),i<0&&(n.sides.t.t=-e.to[1]*x*u)):n.handle?.auto&&n.handle.dir===e.handle&&(n.handle=null,delete t.dataset.pull)}}),S=!0}else n.t0=0,n.fired={};n.items.forEach(e=>{let t=e.vx;if(e.held){let t=e.x+(e.tx-e.x)*Math.min(1,b*26),n=e.y+(e.ty-e.y)*Math.min(1,b*26);e.vx=(t-e.x)/b,e.vy=(n-e.y)/b,e.x=t,e.y=n}else r?e.x=e.y=e.vx=e.vy=e.th=e.om=0:(e.vx+=(-96*e.x-11.5*e.vx)*b,e.vy+=(-96*e.y-11.5*e.vy)*b,e.x+=e.vx*b,e.y+=e.vy*b);if(!r){if(e.hang){let n=g((e.vx-t)/b,-9e3,9e3);e.om+=(-46*e.th-4.2*e.om+n*.0042)*b,e.th=g(e.th+e.om*b,-.6,.6)}else{let t=g(e.vx*22e-5,-.16,.16);e.th+=(t-e.th)*Math.min(1,b*12)}}!e.held&&Math.abs(e.x)<.05&&Math.abs(e.y)<.05&&Math.abs(e.vx)<1&&Math.abs(e.vy)<1&&Math.abs(e.th)<6e-4&&Math.abs(e.om)<.004?e.rest||(e.rest=!0,e.x=e.y=e.th=0,e.el.style.transform=``):(e.rest=!1,S=!0,e.el.style.transform=`translate3d(${e.x.toFixed(2)}px, ${e.y.toFixed(2)}px, 0) rotate(calc(var(--r, 0deg) + ${(e.th*57.3).toFixed(2)}deg))`)});let C=_(),w=!1;[`l`,`t`,`r`,`b`].forEach(e=>{let i=n.sides[e],a=e===`l`||e===`r`?C.w:C.h,o=n.handle&&(e===`r`&&m[n.handle.dir][0]>0||e===`l`&&m[n.handle.dir][0]<0||e===`b`&&m[n.handle.dir][1]>0||e===`t`&&m[n.handle.dir][1]<0);if(o){let t=g(i.t,-a*.32,a*(e===`l`||e===`r`?.5:.7)),n=i.v+(t-i.v)*Math.min(1,b*24);i.vel=(n-i.v)/b,i.v=n}else r?i.v=i.vel=0:(i.vel+=(-210*i.v-13*i.vel)*b,i.v+=i.vel*b,Math.abs(i.v)<.05&&Math.abs(i.vel)<1&&(i.v=i.vel=0));(i.v!==0||i.vel!==0||o)&&(w=!0),t.style.setProperty(`--j${e}`,`${i.v.toFixed(2)}px`)}),w&&(S=!0,d()),S&&l&&!document.hidden?s=requestAnimationFrame(v):(u=!1,c=0)},y=()=>{u||!l||document.hidden||(u=!0,s=requestAnimationFrame(v))};n.wake=y;let b=new IntersectionObserver(([e])=>{l=e.isIntersecting,l&&y()});b.observe(e);let x=()=>y();document.addEventListener(`visibilitychange`,x);let S=new ResizeObserver(d);S.observe(e);let E=window.setInterval(y,1e3);return y(),()=>{cancelAnimationFrame(s),b.disconnect(),S.disconnect(),document.removeEventListener(`visibilitychange`,x),window.clearInterval(E),o.forEach(e=>window.clearTimeout(e))}},[e]);let k=()=>{let e=O.current;e.items.forEach(e=>{e.held===2&&(e.held=0,delete e.el.dataset.held)}),e.handle?.auto&&(e.handle=null,w.current&&delete w.current.dataset.pull)},A=e=>{let t=O.current,n=C.current;if(!n||t.grab)return;let r=e.target,i=r.closest(`[data-handle]`),a=r.closest(`[data-drag]`);if(t.lastTouch=performance.now(),!i&&!a)return;k(),t.scale=n.getBoundingClientRect().width/Math.max(1,n.offsetWidth)||1;let o={l:t.sides.l.v,t:t.sides.t.v,r:t.sides.r.v,b:t.sides.b.v};if(i){let n=i.dataset.handle??`e`;t.grab={id:e.pointerId,key:null,handle:n,sx:e.clientX,sy:e.clientY,ox:0,oy:0,base:o},t.handle={dir:n,auto:!1},[`l`,`t`,`r`,`b`].forEach(e=>t.sides[e].t=t.sides[e].v),w.current&&(w.current.dataset.pull=n)}else if(a){let n=a.dataset.drag??``,r=t.items.get(n);if(!r)return;t.grab={id:e.pointerId,key:n,handle:null,sx:e.clientX,sy:e.clientY,ox:r.x,oy:r.y,base:o},r.held=1,r.tx=r.x,r.ty=r.y,r.el.dataset.held=`1`}try{(i??a)?.setPointerCapture(e.pointerId)}catch{}E({f:2400,to:900,d:.03,g:.02,noise:!0}),t.wake()},j=e=>{let t=O.current,n=t.grab;if(!n||n.id!==e.pointerId)return;t.lastTouch=performance.now();let r=(e.clientX-n.sx)/t.scale,i=(e.clientY-n.sy)/t.scale;if(n.handle){let[e,a]=m[n.handle];e>0&&(t.sides.r.t=n.base.r+r),e<0&&(t.sides.l.t=n.base.l-r),a>0&&(t.sides.b.t=n.base.b+i),a<0&&(t.sides.t.t=n.base.t-i)}else if(n.key){let e=t.items.get(n.key);e&&(e.tx=n.ox+r,e.ty=n.oy+i)}t.wake()},M=e=>{let t=O.current,n=t.grab;if(!(!n||n.id!==e.pointerId)){if(t.grab=null,t.lastTouch=performance.now(),n.handle)t.handle=null,w.current&&delete w.current.dataset.pull,E({f:520,to:300,d:.05,g:.03});else if(n.key){let e=t.items.get(n.key);e&&(e.held=0,delete e.el.dataset.held),E({f:1500,to:500,d:.04,g:.024,noise:!0})}t.wake()}},N=e=>{let t={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!t)return;let n=O.current,r=e.target.closest(`[data-drag]`);if(r){if(e.preventDefault(),n.lastTouch=performance.now(),k(),r.dataset.drag===`frame`)t[0]>0&&(n.sides.r.vel+=900),t[0]<0&&(n.sides.r.vel-=700),t[1]>0&&(n.sides.b.vel+=700),t[1]<0&&(n.sides.b.vel-=500),E({f:520,to:300,d:.05,g:.03});else{let e=n.items.get(r.dataset.drag??``);e&&(e.vx+=t[0]*700,e.vy+=t[1]*700),E({f:1500,to:500,d:.04,g:.024,noise:!0})}n.wake()}},P=e=>(0,a.jsxs)(`div`,{className:`jno-tag`,"data-drag":e.k,"data-tag":!0,"data-k":e.k,"data-hand":e.hand,style:{"--c":e.tone},tabIndex:0,role:`button`,"aria-label":`${e.text}. A label you can move with the arrow keys; it springs back.`,children:[(0,a.jsx)(`span`,{className:`jno-tag-sh`,"aria-hidden":!0}),(0,a.jsx)(`span`,{className:`jno-tag-half jno-tag-flat`,children:(0,a.jsx)(`span`,{className:`jno-tag-txt`,children:e.text})}),(0,a.jsx)(`span`,{className:`jno-tag-half jno-tag-flap`,"aria-hidden":!0,children:(0,a.jsx)(`span`,{className:`jno-tag-txt`,children:e.text})})]},e.k),F=(e,t,n,r)=>(0,a.jsxs)(`div`,{className:`jno-pol`,"data-drag":e,"data-hang":`1`,"data-k":e,tabIndex:0,role:`button`,"aria-label":`Photograph: ${n}. Arrow keys nudge it; it swings back.`,children:[(0,a.jsx)(`span`,{className:`jno-tape`,style:{"--c":r},"aria-hidden":!0}),(0,a.jsx)(`span`,{className:`jno-pol-pic`,children:(0,a.jsx)(`img`,{src:t,alt:``,draggable:!1})}),(0,a.jsx)(`span`,{className:`jno-pol-cap`,children:n})]},e);return(0,a.jsxs)(`div`,{ref:C,className:`jno-root`,"data-paper":s,style:{"--jno-frame":r},onPointerDown:A,onPointerMove:j,onPointerUp:M,onPointerCancel:M,onKeyDown:N,children:[(0,a.jsx)(`style`,{children:b}),(0,a.jsx)(`span`,{className:`jno-paper`,"aria-hidden":!0}),(0,a.jsx)(`span`,{className:`jno-margin`,"aria-hidden":!0}),(0,a.jsxs)(`nav`,{className:`jno-nav`,"aria-label":`Juno`,children:[(0,a.jsx)(`span`,{className:`jno-dot`,"aria-hidden":!0,children:(0,a.jsx)(`i`,{})}),(0,a.jsx)(`ul`,{className:`jno-tabs`,children:d.map((e,t)=>(0,a.jsxs)(`li`,{"data-on":t===0,"data-i":t,children:[(0,a.jsx)(`span`,{className:`jno-ico`,"data-i":t,"aria-hidden":!0}),e]},e))}),(0,a.jsxs)(`span`,{className:`jno-nav-r`,children:[(0,a.jsx)(`i`,{className:`jno-round`,"data-c":`y`,"aria-hidden":!0}),(0,a.jsx)(`i`,{className:`jno-round`,"data-c":`p`,"aria-hidden":!0}),(0,a.jsx)(`i`,{className:`jno-round`,"data-c":`g`,"aria-hidden":!0}),(0,a.jsxs)(`span`,{className:`jno-contact`,children:[(0,a.jsx)(`i`,{"aria-hidden":!0}),` Contact`]})]})]}),(0,a.jsxs)(`p`,{className:`jno-hello`,children:[`my name is`,(0,a.jsx)(`svg`,{viewBox:`0 0 80 10`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M3 5.5c16-4 38-4.6 74-1.2`})})]}),l.map(P),(0,a.jsxs)(`svg`,{className:`jno-arrow`,"data-k":`a1`,viewBox:`0 0 60 40`,"aria-hidden":!0,children:[(0,a.jsx)(`path`,{d:`M4 5c18 1 34 9 47 27`}),(0,a.jsx)(`path`,{d:`M41 28l10 5 1-12`})]}),(0,a.jsxs)(`svg`,{className:`jno-arrow`,"data-k":`a2`,viewBox:`0 0 60 40`,"aria-hidden":!0,children:[(0,a.jsx)(`path`,{d:`M56 6C38 7 22 15 9 31`}),(0,a.jsx)(`path`,{d:`M19 28L8 32 8 20`})]}),(0,a.jsxs)(`svg`,{className:`jno-arrow`,"data-k":`a3`,viewBox:`0 0 60 40`,"aria-hidden":!0,children:[(0,a.jsx)(`path`,{d:`M5 34c14-2 30-9 46-26`}),(0,a.jsx)(`path`,{d:`M40 9l12-2-3 12`})]}),(0,a.jsxs)(`div`,{ref:w,className:`jno-frame`,"data-drag":`frame`,tabIndex:0,role:`button`,"aria-label":`${e}, in a selection frame. Arrow keys stretch the name; it eases back.`,children:[(0,a.jsx)(`h1`,{className:`jno-name`,"aria-label":e,children:(0,a.jsx)(`svg`,{viewBox:`0 0 ${D.w} 9`,preserveAspectRatio:`none`,shapeRendering:`crispEdges`,"aria-hidden":!0,children:D.runs.map((e,t)=>(0,a.jsx)(`rect`,{x:e.x,y:e.y,width:e.w,height:1.03},t))})}),Object.keys(m).map(e=>(0,a.jsx)(`i`,{className:`jno-h`,"data-handle":e,"aria-hidden":!0},e)),(0,a.jsx)(`span`,{className:`jno-size`,"aria-hidden":!0,children:(0,a.jsx)(`span`,{ref:T,children:`389 × 150`})})]}),(0,a.jsxs)(`p`,{className:`jno-open`,children:[(0,a.jsx)(`i`,{"aria-hidden":!0}),` Open to new work from January`]}),(0,a.jsxs)(`p`,{className:`jno-line`,children:[(0,a.jsxs)(`span`,{children:[t[0],` `,(0,a.jsx)(`i`,{className:`jno-st jno-st-ring`,"aria-hidden":!0})]}),(0,a.jsxs)(`span`,{children:[t[1],` `,(0,a.jsxs)(`svg`,{className:`jno-st jno-st-flower`,viewBox:`0 0 7 7`,shapeRendering:`crispEdges`,"aria-hidden":!0,children:[(0,a.jsx)(`path`,{d:`M2 0h3v2h2v3h-2v2h-3v-2h-2v-3h2z`,fill:`#ff7eb0`}),(0,a.jsx)(`rect`,{x:`3`,y:`3`,width:`1`,height:`1`,fill:`#17181a`})]})]})]}),(0,a.jsxs)(`button`,{type:`button`,className:`jno-cta`,onClick:S,children:[(0,a.jsx)(`i`,{"aria-hidden":!0,children:(0,a.jsx)(`svg`,{viewBox:`0 0 7 7`,shapeRendering:`crispEdges`,children:(0,a.jsx)(`path`,{d:`M3 1h1v1h1v1h1v1h-1v1h-1v1h-1v-2h-2v-1h2z`,fill:`#fff`})})}),n]}),F(`p1`,_,`that's me`,`rgba(157,184,242,.78)`),F(`p2`,v,`Tramline, 2026`,`rgba(246,214,103,.8)`),F(`p3`,y,`desk, most days`,`rgba(255,126,176,.7)`),u.map(e=>(0,a.jsxs)(`div`,{className:`jno-note`,"data-drag":e.k,"data-k":e.k,style:{"--c":e.tone},tabIndex:0,role:`button`,"aria-label":`${e.big} ${e.small}, ${e.by}. A note you can move with the arrow keys.`,children:[(0,a.jsx)(`b`,{children:e.big}),(0,a.jsx)(`span`,{children:e.small}),(0,a.jsx)(`em`,{children:e.by})]},e.k)),(0,a.jsx)(`div`,{className:`jno-smile`,"data-drag":`smile`,"data-smile":!0,tabIndex:0,role:`button`,"aria-label":`A smiley sticker. Arrow keys move it; it springs back.`,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 40 40`,"aria-hidden":!0,children:[(0,a.jsx)(`path`,{className:`jno-smile-bg`,d:`M20 1.5l3.6 3.1 4.6-1.1 1.9 4.3 4.6.9-.3 4.7 3.9 2.6-2.3 4.1 2.3 4.1-3.9 2.6.3 4.7-4.6.9-1.9 4.3-4.6-1.1L20 38.500l-3.6-3.100-4.6 1.100-1.900-4.300-4.600-.900.300-4.700-3.900-2.600 2.300-4.100-2.300-4.100 3.900-2.600-.300-4.700 4.600-.900 1.900-4.300 4.600 1.100z`}),(0,a.jsxs)(`g`,{shapeRendering:`crispEdges`,children:[(0,a.jsx)(`rect`,{className:`jno-eye`,x:`13`,y:`13`,width:`3`,height:`6`}),(0,a.jsx)(`rect`,{className:`jno-eye jno-eye-r`,x:`24`,y:`13`,width:`3`,height:`6`}),(0,a.jsx)(`path`,{d:`M11 22h3v3h3v3h6v-3h3v-3h3v3h-3v3h-3v3h-6v-3h-3v-3h-3z`})]})]})}),(0,a.jsxs)(`p`,{className:`jno-hint`,"aria-hidden":!0,children:[`pick anything up`,(0,a.jsxs)(`svg`,{viewBox:`0 0 50 30`,children:[(0,a.jsx)(`path`,{d:`M3 8c14 12 26 14 42 7`}),(0,a.jsx)(`path`,{d:`M36 9l10 6-9 7`})]})]})]})}var v=`0em 0%, .26em 9%, .04em 21%, .3em 34%, .08em 47%, .28em 60%, .02em 73%, .27em 86%, .06em 100%`,y=`calc(100% - .05em) 100%, calc(100% - .28em) 88%, calc(100% - .03em) 75%, calc(100% - .3em) 62%, calc(100% - .07em) 49%, calc(100% - .27em) 36%, calc(100% - .02em) 23%, calc(100% - .26em) 10%, calc(100% - .06em) 0%`,b=`
@import url("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600&family=Reenie+Beanie&family=Silkscreen:wght@400;700&display=swap");

.jno-root {
  --jno-ink: #17181a;
  --jno-paper: #f1f2ee;
  --jno-rule: rgba(64, 92, 140, .13);
  --jno-pixel: "Silkscreen", ui-monospace, "SF Mono", Menlo, monospace;
  --jno-hand: "Reenie Beanie", "Bradley Hand", "Segoe Print", cursive;
  --jno-sans: "Inter Tight", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --jno-spring: cubic-bezier(.3, 1.5, .5, 1);
  container-type: inline-size;
  position: relative; isolation: isolate; overflow: hidden;
  width: 100%; height: var(--design-h, 100svh); min-height: 640px;
  background-color: var(--jno-paper);
  color: var(--jno-ink);
  font-family: var(--jno-sans);
  -webkit-font-smoothing: antialiased;
  user-select: none; -webkit-user-select: none;
}
/* the ruled paper is a child, so its container units measure the page */
.jno-paper { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(to bottom, transparent calc(100% - 1px), var(--jno-rule) calc(100% - 1px)); background-size: 100% 1.9cqi; background-position: 0 .5cqi; }
.jno-root[data-paper="grid"] .jno-paper {
  background-image: linear-gradient(to bottom, transparent calc(100% - 1px), var(--jno-rule) calc(100% - 1px)), linear-gradient(to right, transparent calc(100% - 1px), var(--jno-rule) calc(100% - 1px));
  background-size: 1.9cqi 1.9cqi;
}
.jno-root[data-paper="plain"] .jno-paper { background-image: none; }
.jno-root *, .jno-root *::before, .jno-root *::after { box-sizing: border-box; }
.jno-margin { position: absolute; left: 5.2cqi; top: 0; bottom: 0; width: 1px; background: rgba(240, 69, 46, .16); pointer-events: none; }

/* ---------- nav */
.jno-nav { position: absolute; z-index: 30; left: 2.2cqi; right: 2.2cqi; top: 1.5cqi; height: 2.7cqi; display: flex; align-items: stretch; background: #fff; border: 1px solid rgba(23, 24, 26, .16); font-family: var(--jno-pixel); font-size: .72cqi; letter-spacing: .04em; text-transform: uppercase; }
.jno-dot { width: 2.7cqi; display: grid; place-items: center; border-right: 1px solid rgba(23, 24, 26, .1); }
.jno-dot i { width: 1.15cqi; height: 1.15cqi; border-radius: 50%; background: #ff7eb0; box-shadow: inset 0 0 0 1px rgba(23, 24, 26, .55); }
.jno-tabs { display: flex; margin: 0; padding: 0; list-style: none; }
.jno-tabs li { display: flex; align-items: center; gap: .55cqi; padding: 0 1.15cqi; }
.jno-tabs li[data-on="true"] { background: #f6d048; }
.jno-ico { width: .62cqi; height: .62cqi; background: var(--jno-ink); }
.jno-ico[data-i="0"] { clip-path: polygon(50% 0, 62% 38%, 100% 38%, 70% 62%, 82% 100%, 50% 76%, 18% 100%, 30% 62%, 0 38%, 38% 38%); }
.jno-ico[data-i="1"] { border-radius: 50% 50% 0 0; }
.jno-ico[data-i="2"] { background: none; box-shadow: inset 0 0 0 .14cqi var(--jno-ink); background-image: linear-gradient(var(--jno-ink), var(--jno-ink)); background-size: .14cqi 100%; background-repeat: no-repeat; background-position: center; }
.jno-ico[data-i="3"] { transform: rotate(45deg) scale(.8); }
.jno-nav-r { margin-left: auto; display: flex; align-items: center; gap: .5cqi; padding-right: .6cqi; }
.jno-round { width: 1.25cqi; height: 1.25cqi; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(23, 24, 26, .6); position: relative; }
.jno-round::after { content: ""; position: absolute; inset: 34%; background: var(--jno-ink); }
.jno-round[data-c="y"] { background: #f6d048; }
.jno-round[data-c="p"] { background: #ff7eb0; }
.jno-round[data-c="p"]::after { border-radius: 50%; }
.jno-round[data-c="g"] { background: #37c47c; }
.jno-round[data-c="g"]::after { transform: rotate(45deg); }
.jno-contact { display: flex; align-items: center; gap: .5cqi; margin-left: .5cqi; height: 1.55cqi; padding: 0 .8cqi; border: 1px solid rgba(23, 24, 26, .7); }
.jno-contact i { width: .5cqi; height: .5cqi; background: var(--jno-ink); border-radius: 50% 50% 50% 0; }

/* ---------- the name */
.jno-hello { position: absolute; left: 50%; top: 19.2%; margin: 0; translate: -50% 0; font-family: var(--jno-hand); font-size: 2.05cqi; line-height: 1; white-space: nowrap; }
.jno-hello svg { position: absolute; left: -6%; right: -6%; bottom: -.55cqi; width: 112%; height: .7cqi; fill: none; stroke: var(--jno-ink); stroke-width: 1.3; stroke-linecap: round; }
.jno-frame {
  --fw: 27cqi; --fh: 10.4cqi; --ft: 24.6%;
  position: absolute; z-index: 6;
  left: calc(50% - var(--fw) / 2 - var(--jl, 0px)); top: calc(var(--ft) - var(--jt, 0px));
  width: calc(var(--fw) + var(--jl, 0px) + var(--jr, 0px)); height: calc(var(--fh) + var(--jt, 0px) + var(--jb, 0px));
  border: .12cqi solid var(--jno-frame);
  background: rgba(255, 255, 255, .5);
  cursor: grab; touch-action: none; outline: none;
  transition: box-shadow .25s ease;
}
.jno-frame[data-held] { cursor: grabbing; box-shadow: 0 1.4cqi 2.4cqi -1.2cqi rgba(23, 24, 26, .35); z-index: 40; }
.jno-frame:focus-visible { box-shadow: 0 0 0 .22cqi #fff, 0 0 0 .4cqi var(--jno-ink); }
.jno-name { position: absolute; inset: .95cqi 1.25cqi; margin: 0; }
.jno-name svg { display: block; width: 100%; height: 100%; fill: var(--jno-ink); overflow: visible; }
.jno-h { position: absolute; width: .78cqi; height: .78cqi; margin: -.39cqi; background: #fff; border: .12cqi solid var(--jno-frame); touch-action: none; transition: scale .2s var(--jno-spring), background .15s; }
.jno-h::after { content: ""; position: absolute; inset: -.7cqi; }
.jno-h:hover, .jno-frame[data-pull="nw"] .jno-h[data-handle="nw"], .jno-frame[data-pull="n"] .jno-h[data-handle="n"], .jno-frame[data-pull="ne"] .jno-h[data-handle="ne"], .jno-frame[data-pull="e"] .jno-h[data-handle="e"], .jno-frame[data-pull="se"] .jno-h[data-handle="se"], .jno-frame[data-pull="s"] .jno-h[data-handle="s"], .jno-frame[data-pull="sw"] .jno-h[data-handle="sw"], .jno-frame[data-pull="w"] .jno-h[data-handle="w"] { scale: 1.45; background: var(--jno-frame); }
.jno-h[data-handle="nw"] { left: 0; top: 0; cursor: nwse-resize; }
.jno-h[data-handle="n"] { left: 50%; top: 0; cursor: ns-resize; }
.jno-h[data-handle="ne"] { left: 100%; top: 0; cursor: nesw-resize; }
.jno-h[data-handle="e"] { left: 100%; top: 50%; cursor: ew-resize; }
.jno-h[data-handle="se"] { left: 100%; top: 100%; cursor: nwse-resize; }
.jno-h[data-handle="s"] { left: 50%; top: 100%; cursor: ns-resize; }
.jno-h[data-handle="sw"] { left: 0; top: 100%; cursor: nesw-resize; }
.jno-h[data-handle="w"] { left: 0; top: 50%; cursor: ew-resize; }
.jno-size { position: absolute; left: 50%; top: calc(100% + .75cqi); translate: -50% 0; padding: .22cqi .55cqi .26cqi; background: var(--jno-frame); color: #fff; font-family: var(--jno-pixel); font-size: .68cqi; letter-spacing: .04em; white-space: nowrap; font-variant-numeric: tabular-nums; pointer-events: none; }
.jno-open { position: absolute; left: 50%; top: calc(24.6% + 10.4cqi + 3.1cqi); translate: -50% 0; margin: 0; display: flex; align-items: center; gap: .55cqi; font-family: var(--jno-pixel); font-size: .68cqi; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.jno-open i { width: .5cqi; height: .5cqi; border-radius: 50%; background: #37c47c; box-shadow: 0 0 0 .22cqi rgba(55, 196, 124, .25); animation: jno-pulse 2.4s ease-in-out infinite; }
@keyframes jno-pulse { 50% { box-shadow: 0 0 0 .5cqi rgba(55, 196, 124, 0); } }

/* ---------- tape labels: a flat end and a flap that peels up */
.jno-tag {
  position: absolute; z-index: 8; font-size: .74cqi; line-height: 1; font-family: var(--jno-pixel); letter-spacing: .05em; text-transform: uppercase;
  --r: 0deg; transform: rotate(var(--r, 0deg));
  cursor: grab; touch-action: none; outline: none; white-space: nowrap; perspective: 22cqi;
}
.jno-tag[data-hand="true"] { font-family: var(--jno-hand); font-size: 1.62cqi; letter-spacing: 0; text-transform: none; }
.jno-tag[data-held] { cursor: grabbing; z-index: 40; }
.jno-tag-half { display: block; padding: .52em 1.25em .56em; background: var(--c); color: rgba(23, 24, 26, .9); background-image: linear-gradient(90deg, rgba(255, 255, 255, .25), rgba(255, 255, 255, 0) 30%, rgba(23, 24, 26, .05)); }
.jno-tag[data-hand="true"] .jno-tag-half { padding: .16em .9em .2em; }
.jno-tag-flat { clip-path: polygon(${v}, 38% 100%, 38% 0%); }
.jno-tag-flap { position: absolute; inset: 0; clip-path: polygon(38% 0%, 38% 100%, ${y}); transform-origin: 38% 50%; transition: transform .5s var(--jno-spring), filter .4s ease; }
.jno-tag-sh { position: absolute; inset: 12% 2% -6% 38%; background: rgba(23, 24, 26, .28); filter: blur(.35cqi); opacity: 0; transform-origin: 0 50%; transition: opacity .35s ease, transform .5s var(--jno-spring); }
.jno-tag:hover .jno-tag-flap, .jno-tag:focus-visible .jno-tag-flap, .jno-tag[data-peel] .jno-tag-flap, .jno-tag[data-held] .jno-tag-flap { transform: rotateY(-52deg) rotateZ(-3deg) translateY(-.06cqi); filter: brightness(1.08); }
.jno-tag:hover .jno-tag-sh, .jno-tag:focus-visible .jno-tag-sh, .jno-tag[data-peel] .jno-tag-sh, .jno-tag[data-held] .jno-tag-sh { opacity: 1; transform: scaleX(.8) translate(.2cqi, .25cqi); }
.jno-tag:focus-visible .jno-tag-flat { box-shadow: inset 0 0 0 .14cqi var(--jno-ink); }
.jno-tag[data-k="t1"] { left: 33.4%; top: 16.6%; --r: -3deg; }
.jno-tag[data-k="t2"] { left: 59.6%; top: 17.2%; --r: 2.5deg; }
.jno-tag[data-k="t3"] { left: 23.8%; top: 36.6%; --r: -5deg; }
.jno-tag[data-k="t4"] { left: 64.8%; top: 38%; --r: 4deg; }
.jno-arrow { position: absolute; z-index: 5; width: 4.2cqi; height: 2.8cqi; fill: none; stroke: var(--jno-ink); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
.jno-arrow[data-k="a1"] { left: 35.4%; top: 20.2%; width: 3.2cqi; height: 2.2cqi; }
.jno-arrow[data-k="a2"] { left: 61.2%; top: 21.4%; width: 3.4cqi; height: 2.3cqi; }
.jno-arrow[data-k="a3"] { left: 33%; top: 33.4%; width: 3.2cqi; height: 2.2cqi; }

/* ---------- the statement and the button */
.jno-line { position: absolute; left: 50%; top: 50.4%; translate: -50% 0; margin: 0; display: grid; justify-items: center; font-size: 2.56cqi; font-weight: 600; line-height: 1.16; letter-spacing: -.022em; white-space: nowrap; }
.jno-line > span { display: flex; align-items: center; gap: .32em; }
.jno-st { display: inline-block; width: .82em; height: .82em; flex: none; }
.jno-st-ring { border-radius: 50%; background: radial-gradient(circle, #17181a 0 22%, #f1f2ee 23% 38%, #37c47c 39% 62%, #17181a 63% 71%, transparent 72%); animation: jno-turn 9s linear infinite; }
.jno-st-flower { animation: jno-turn 12s steps(8) infinite reverse; }
@keyframes jno-turn { to { rotate: 360deg; } }
.jno-cta { position: absolute; left: 50%; top: 63.2%; translate: -50% 0; display: flex; align-items: center; gap: .7cqi; height: 2.7cqi; padding: 0 1.15cqi 0 .55cqi; border: 0; border-radius: 0; background: var(--jno-ink); color: #fff; font-family: var(--jno-pixel); font-size: .74cqi; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; box-shadow: .28cqi .28cqi 0 rgba(23, 24, 26, .18); transition: translate .16s ease, box-shadow .16s ease; }
.jno-cta i { display: grid; place-items: center; width: 1.6cqi; height: 1.6cqi; background: #2f6bff; }
.jno-cta i svg { width: 62%; height: 62%; }
.jno-cta:hover { translate: calc(-50% - .1cqi) -.1cqi; box-shadow: .42cqi .42cqi 0 rgba(23, 24, 26, .2); }
.jno-cta:active { translate: calc(-50% + .18cqi) .18cqi; box-shadow: .08cqi .08cqi 0 rgba(23, 24, 26, .2); }
.jno-cta:focus-visible { outline: .16cqi solid #2f6bff; outline-offset: .22cqi; }

/* ---------- polaroids: they hang from their tape */
.jno-pol {
  --w: 13.4cqi;
  position: absolute; z-index: 10; width: var(--w); padding: .68cqi .68cqi 0; background: #fdfdfb;
  --r: 0deg; transform: rotate(var(--r, 0deg)); transform-origin: 50% 1%;
  box-shadow: 0 0 0 1px rgba(23, 24, 26, .05), 0 .1cqi .2cqi rgba(23, 24, 26, .1), 0 1cqi 1.6cqi -1cqi rgba(23, 24, 26, .32);
  cursor: grab; touch-action: none; outline: none; transition: box-shadow .25s ease;
}
.jno-pol[data-held] { cursor: grabbing; z-index: 40; box-shadow: 0 0 0 1px rgba(23, 24, 26, .05), 0 .3cqi .5cqi rgba(23, 24, 26, .1), 0 2.4cqi 3cqi -1.2cqi rgba(23, 24, 26, .4); }
.jno-pol:focus-visible { box-shadow: 0 0 0 .2cqi #fff, 0 0 0 .38cqi var(--jno-ink); }
.jno-pol-pic { display: block; aspect-ratio: 1; overflow: hidden; background: #d9dad5; box-shadow: inset 0 0 0 1px rgba(23, 24, 26, .08); }
.jno-pol-pic img { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; filter: saturate(.94) contrast(1.02); }
.jno-pol-cap { display: block; padding: .5cqi 0 .62cqi; text-align: center; font-family: var(--jno-hand); font-size: 1.36cqi; line-height: 1; color: rgba(23, 24, 26, .78); white-space: nowrap; }
.jno-tape { position: absolute; left: 50%; top: -1.05cqi; width: 5cqi; height: 1.75cqi; margin-left: -2.5cqi; rotate: -4deg; font-size: 1cqi; background: var(--c); background-image: linear-gradient(90deg, rgba(255, 255, 255, .3), rgba(255, 255, 255, 0) 40%, rgba(23, 24, 26, .05)); clip-path: polygon(${v}, ${y}); }
.jno-pol[data-k="p1"] { left: 8.2%; top: 37%; --r: -5deg; }
.jno-pol[data-k="p2"] { left: 78.2%; top: 15.5%; --r: 4.5deg; }
.jno-pol[data-k="p2"] .jno-tape { rotate: 5deg; }
.jno-pol[data-k="p3"] { left: 71.6%; top: 55%; --r: -3deg; --w: 12.2cqi; }
.jno-pol[data-k="p3"] .jno-tape { rotate: -9deg; left: 30%; }

/* ---------- torn notes */
.jno-note {
  position: absolute; z-index: 9; width: 9.8cqi; padding: .8cqi .95cqi .85cqi; font-size: 1cqi; background: var(--c);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, .28), rgba(255, 255, 255, 0) 40%);
  clip-path: polygon(${v}, ${y});
  --r: 0deg; transform: rotate(var(--r, 0deg));
  display: grid; gap: .22cqi; cursor: grab; touch-action: none; outline: none;
  filter: drop-shadow(0 .5cqi .5cqi rgba(23, 24, 26, .14));
  transition: filter .25s ease;
}
.jno-note[data-held] { cursor: grabbing; z-index: 40; filter: drop-shadow(0 1.3cqi 1cqi rgba(23, 24, 26, .24)); }
.jno-note:focus-visible b { text-decoration: underline; text-decoration-thickness: .14cqi; text-underline-offset: .2cqi; }
.jno-note b { font-size: 2cqi; font-weight: 600; letter-spacing: -.03em; line-height: 1; font-variant-numeric: tabular-nums; }
.jno-note span { font-size: .86cqi; font-weight: 500; line-height: 1.15; }
.jno-note em { font-family: var(--jno-pixel); font-style: normal; font-size: .56cqi; letter-spacing: .06em; text-transform: uppercase; opacity: .62; }
.jno-note[data-k="n1"] { left: 33.2%; top: 77.6%; --r: -3deg; }
.jno-note[data-k="n2"] { left: 44.8%; top: 80%; --r: 2deg; }
.jno-note[data-k="n3"] { left: 56.4%; top: 77.2%; --r: -1.5deg; }

/* ---------- the sticker */
.jno-smile { position: absolute; z-index: 9; left: 19.2%; top: 70.5%; width: 6.6cqi; height: 6.6cqi; --r: -9deg; transform: rotate(var(--r, 0deg)); cursor: grab; touch-action: none; outline: none; filter: drop-shadow(0 .5cqi .45cqi rgba(23, 24, 26, .2)); transition: filter .25s ease, scale .35s var(--jno-spring); }
.jno-smile[data-held] { cursor: grabbing; z-index: 40; filter: drop-shadow(0 1.3cqi 1cqi rgba(23, 24, 26, .28)); }
.jno-smile:focus-visible { outline: .16cqi dashed var(--jno-ink); outline-offset: .3cqi; border-radius: 50%; }
.jno-smile svg { display: block; width: 100%; height: 100%; overflow: visible; }
.jno-smile-bg { fill: #f6d048; stroke: var(--jno-ink); stroke-width: 1; stroke-linejoin: round; }
.jno-smile g { fill: var(--jno-ink); }
.jno-eye { transform-box: fill-box; transform-origin: 50% 100%; transition: transform .12s ease; }
.jno-smile[data-wink] { scale: 1.12; }
.jno-smile[data-wink] .jno-eye-r, .jno-smile:hover .jno-eye-r { transform: scaleY(.17); }
.jno-hint { position: absolute; left: 9.4%; top: 82.4%; margin: 0; rotate: -6deg; font-family: var(--jno-hand); font-size: 1.62cqi; line-height: 1; color: rgba(23, 24, 26, .7); white-space: nowrap; pointer-events: none; }
.jno-hint svg { position: absolute; left: 86%; top: -78%; width: 3.6cqi; height: 2.2cqi; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; rotate: -38deg; }

/* ---------- the phone: recomposed */
@container (max-width: 700px) {
  .jno-paper { background-size: 100% 6.4cqi; background-position: 0 1cqi; }
  .jno-root[data-paper="grid"] .jno-paper { background-size: 6.4cqi 6.4cqi; }
  .jno-margin { left: 5cqi; }
  .jno-nav { left: 4cqi; right: 4cqi; top: 4cqi; height: 10cqi; font-size: 2.5cqi; }
  .jno-dot { width: 10cqi; }
  .jno-dot i { width: 4.2cqi; height: 4.2cqi; }
  .jno-tabs li { gap: 1.6cqi; padding: 0 3.4cqi; }
  .jno-tabs li[data-i="1"], .jno-tabs li[data-i="3"] { display: none; }
  .jno-ico { width: 2.2cqi; height: 2.2cqi; }
  .jno-ico[data-i="2"] { box-shadow: inset 0 0 0 .5cqi var(--jno-ink); background-size: .5cqi 100%; }
  .jno-round { display: none; }
  .jno-nav-r { padding-right: 2cqi; }
  .jno-contact { height: 6cqi; padding: 0 2.6cqi; gap: 1.6cqi; margin: 0; }
  .jno-contact i { width: 1.8cqi; height: 1.8cqi; }
  .jno-hello { top: 15.2%; font-size: 7.4cqi; }
  .jno-hello svg { bottom: -1.8cqi; height: 2.4cqi; }
  .jno-frame { --fw: 62cqi; --fh: 24cqi; --ft: 20.6%; border-width: .42cqi; }
  .jno-frame:focus-visible { box-shadow: 0 0 0 .7cqi #fff, 0 0 0 1.3cqi var(--jno-ink); }
  .jno-name { inset: 2.3cqi 3cqi; }
  .jno-h { width: 2.7cqi; height: 2.7cqi; margin: -1.35cqi; border-width: .42cqi; }
  .jno-h::after { inset: -2.6cqi; }
  .jno-size { top: calc(100% + 2.4cqi); padding: .8cqi 1.9cqi .9cqi; font-size: 2.4cqi; }
  .jno-open { top: calc(20.6% + 24cqi + 10cqi); gap: 1.8cqi; font-size: 2.3cqi; }
  .jno-open i { width: 1.7cqi; height: 1.7cqi; }
  .jno-tag { font-size: 2.5cqi; perspective: 70cqi; }
  .jno-tag[data-hand="true"] { font-size: 5.6cqi; }
  .jno-tag-sh { filter: blur(1cqi); }
  .jno-tag[data-k="t1"] { left: 6%; top: 12.6%; --r: -5deg; }
  .jno-tag[data-k="t2"], .jno-tag[data-k="t3"] { display: none; }
  .jno-tag[data-k="t4"] { left: 64.5%; top: 11.4%; --r: 5deg; }
  .jno-arrow { display: none; }
  .jno-line { top: 44.6%; font-size: 7.3cqi; line-height: 1.14; white-space: normal; width: 86cqi; }
  .jno-line > span { display: block; text-align: center; }
  .jno-st { vertical-align: -.1em; }
  .jno-cta { top: 59.6%; height: 10.4cqi; gap: 2.6cqi; padding: 0 4.4cqi 0 2.1cqi; font-size: 2.8cqi; box-shadow: 1cqi 1cqi 0 rgba(23, 24, 26, .18); }
  .jno-cta i { width: 6.2cqi; height: 6.2cqi; }
  .jno-pol { --w: 39cqi; padding: 2cqi 2cqi 0; }
  .jno-pol-cap { padding: 1.5cqi 0 1.9cqi; font-size: 4.6cqi; }
  .jno-tape { top: -3.2cqi; width: 15cqi; height: 5.2cqi; margin-left: -7.5cqi; font-size: 3cqi; }
  .jno-pol[data-k="p1"] { left: 7%; top: 72.4%; --r: -6deg; }
  .jno-pol[data-k="p2"] { left: 53%; top: 70.6%; --r: 5deg; }
  .jno-pol[data-k="p3"] { display: none; }
  .jno-note { display: none; }
  .jno-smile { left: 41.5%; top: 66.8%; width: 15cqi; height: 15cqi; z-index: 12; }
  .jno-hint { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .jno-open i, .jno-st-ring, .jno-st-flower { animation: none; }
  .jno-tag-flap, .jno-tag-sh, .jno-h, .jno-cta, .jno-smile, .jno-eye { transition-duration: 1ms; }
  .jno-tag:hover .jno-tag-flap, .jno-tag:focus-visible .jno-tag-flap, .jno-tag[data-held] .jno-tag-flap { transform: none; filter: none; }
  .jno-tag:hover .jno-tag-sh, .jno-tag:focus-visible .jno-tag-sh, .jno-tag[data-held] .jno-tag-sh { opacity: 0; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(_,{})}));