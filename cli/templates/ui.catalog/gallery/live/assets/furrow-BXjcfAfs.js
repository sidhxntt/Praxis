import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=[{name:`Long Acre`,ha:41,color:`#3ecbf0`,x:35,y:42,mx:11,my:43,finding:`Nitrogen is running low in the north half.`,chips:[`N 38 kg/ha`,`Feed by Sat`],now:[34,72,66,81,70],then:[58,64,61,78,66]},{name:`Mill Bank`,ha:28,color:`#7a74f7`,x:43,y:85,mx:30,my:57,finding:`A dry band along the east hedge.`,chips:[`Moisture 19%`,`Water tonight`],now:[71,29,58,74,62],then:[69,55,57,73,64]},{name:`Heron Strip`,ha:17,color:`#ea6cf2`,x:54,y:11,mx:39,my:15,finding:`Rust on about 3% of leaves, still early.`,chips:[`Leaf scan 3%`,`Scout Friday`],now:[77,68,49,62,80],then:[74,70,60,70,79]},{name:`Top Sixteen`,ha:52,color:`#f5c13d`,x:69,y:79,mx:63,my:41,finding:`Even growth. Ready to cut in four days.`,chips:[`Height 61 cm`,`Cut Monday`],now:[86,78,82,88,84],then:[72,70,77,85,80]},{name:`Quarry Piece`,ha:33,color:`#f2885c`,x:81,y:12,mx:80,my:12,finding:`Ground is tight by the gate after the trailers.`,chips:[`Structure 31`,`Subsoil here`],now:[64,59,55,70,31],then:[66,60,57,71,52]},{name:`Brook Side`,ha:41,color:`#e0482f`,x:90,y:48,mx:88,my:53,finding:`Still waterlogged from Tuesday's rain.`,chips:[`Moisture 94%`,`Keep off`],now:[52,96,63,57,44],then:[60,71,64,66,58]}],s=[`Nitrogen`,`Moisture`,`Organic`,`pH`,`Structure`],c=[1,1.08,1.16];function l(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(n=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let r=navigator.userActivation;if(!(r&&!r.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let r=t.current??=new e;r.state===`suspended`&&r.resume();let i=r.currentTime+(n.at??0),a=Math.min(n.d??.035,.16),o=r.createGain();o.gain.setValueAtTime(1e-4,i),o.gain.exponentialRampToValueAtTime(Math.min(n.g??.03,.06),i+.004),o.gain.exponentialRampToValueAtTime(1e-4,i+a),o.connect(r.destination);let s=r.createOscillator();s.type=n.type??`sine`,s.frequency.setValueAtTime(n.f,i),n.to&&s.frequency.exponentialRampToValueAtTime(n.to,i+a),s.connect(o),s.start(i),s.stop(i+a+.01)}catch{}},[e])}var u=56,d=e=>Math.round(e*100)/100,f=(e,t)=>{let n=(-90+72*e)*Math.PI/180;return[d(Math.cos(n)*u*(t/100)),d(Math.sin(n)*u*(t/100))]},p=e=>e.map((e,t)=>f(t,e).join(`,`)).join(` `),m=[25,50,75,100].map(e=>p([e,e,e,e,e])),h=[0,1,2,3,4].map(e=>f(e,100)),g=[0,1,2,3,4].map(e=>f(e,124)),_=e=>Math.round(e.reduce((e,t)=>e+t,0)/e.length),v=e=>1+2.2*(e-1)**3+1.2*(e-1)**2,y=e=>({"--frw-cl":e.x>70?`calc(${e.x}% - 270px)`:`calc(${e.x}% + 22px)`,"--frw-ct":`clamp(28px, calc(${e.y}% - 58px), calc(100% - 224px))`,"--frw-ml":`clamp(22px, calc(${e.mx}% - 99px), calc(100% - 220px))`,"--frw-mt":e.my<27?`calc(${e.my}% + 18px)`:`calc(${e.my}% - 150px)`});function b({brand:e=`Furrow`,headline:t=`Know every field
before you walk it.`,line:n=`Furrow reads your drones, probes and satellites before breakfast and names the zone that needs you today.`,cta:r=`See your farm`,photo:u=`/design/websites/furrow/fields.webp`,accent:f=`#e4f36a`,pace:b=10,zones:S=o,autoplay:C=!0,sound:w=!0,onCta:T,onPlan:ee}){let E=(0,i.useRef)(null),D=(0,i.useRef)(null),O=(0,i.useRef)(null),k=(0,i.useRef)(null),A=(0,i.useRef)(null),j=(0,i.useRef)({now:S[0].now.slice(),then:S[0].then.slice(),score:_(S[0].now)}),M=(0,i.useRef)(0),N=l(w),[P,te]=(0,i.useState)(0),[F,ne]=(0,i.useState)(()=>S.map(()=>0)),[I,L]=(0,i.useState)(!1),[R,z]=(0,i.useState)(!0),[B,V]=(0,i.useState)(!0),[H,re]=(0,i.useState)(C),[U,W]=(0,i.useState)(0),G=(0,i.useRef)({playing:C,hover:!1,hold:0,zoom:1,pace:b});G.current.playing=H,G.current.zoom=c[U],G.current.pace=b;let K=(0,i.useRef)(null);(0,i.useEffect)(()=>()=>void(K.current&&clearTimeout(K.current)),[]);let q=(0,i.useCallback)(e=>{let t=S[e];if(!t)return;let n={now:j.current.now.slice(),then:j.current.then.slice(),score:j.current.score},r=_(t.now),i=typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;cancelAnimationFrame(M.current);let a=performance.now(),o=e=>{let s=i?1:Math.min(1,(e-a)/720),c=v(s),l=n.now.map((e,n)=>Math.max(4,e+(t.now[n]-e)*c)),u=n.then.map((e,n)=>Math.max(4,e+(t.then[n]-e)*c)),d=n.score+(r-n.score)*Math.min(1,s*1.15);j.current={now:l,then:u,score:d},O.current?.setAttribute(`points`,p(l)),k.current?.setAttribute(`points`,p(u)),A.current&&(A.current.textContent=String(Math.round(d))),s<1&&(M.current=requestAnimationFrame(o))};o(a)},[S]);(0,i.useEffect)(()=>()=>cancelAnimationFrame(M.current),[]);let J=(0,i.useCallback)(e=>{te(t=>(t!==e&&L(!1),e)),ne(t=>t.map((t,n)=>n===e?t+1:t)),q(e)},[q]),Y=(0,i.useRef)(J);Y.current=J;let X=(e,t=6e3)=>{G.current.hold=performance.now()+t,e!==P&&N({f:1700,to:1150,d:.03,g:.028,type:`triangle`}),J(e)},Z=e=>{I||(L(!0),e&&(G.current.hold=performance.now()+6e3,N({f:660,d:.07,g:.035}),N({f:990,d:.09,g:.035,at:.07}),ee?.(S[P]?.name??``)),K.current&&clearTimeout(K.current),K.current=setTimeout(()=>L(!1),1900))},Q=(0,i.useRef)(Z);Q.current=Z,(0,i.useEffect)(()=>{let e=E.current,t=D.current;if(!e||!t)return;if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches){e.dataset.still=`true`,Y.current(Math.min(2,S.length-1));return}let n=!0,r=0,i=performance.now(),a=-.03,o=t.clientWidth||1,s=0,c=!1,l=0,u=0,d=0,f=0,p=!1,m=null,h=()=>{o=t.clientWidth||1,s=parseFloat(getComputedStyle(t).getPropertyValue(`--frw-s0`))||0,c=e.clientWidth<=760};h();let g=new ResizeObserver(h);g.observe(e);let _=new IntersectionObserver(([e])=>{n=e.isIntersecting});_.observe(e);let v=e=>{if(e.pointerType!==`mouse`)return;let n=t.getBoundingClientRect();p=e.clientX>=n.left&&e.clientX<=n.right&&e.clientY>=n.top&&e.clientY<=n.bottom,d=Math.max(-1,Math.min(1,(e.clientX-n.left)/n.width*2-1)),f=Math.max(-1,Math.min(1,(e.clientY-n.top)/n.height*2-1))},y=()=>{p=!1};e.addEventListener(`pointermove`,v),e.addEventListener(`pointerleave`,y);let b=t=>{r=requestAnimationFrame(b);let h=Math.min(.05,(t-i)/1e3);if(i=t,!n||document.hidden)return;let g=p?-d*7:Math.sin(t*31e-5)*4.5,_=p?-f*5:Math.cos(t*23e-5)*3.5;l+=(g-l)*Math.min(1,h*3),u+=(_-u)*Math.min(1,h*3),e.style.setProperty(`--frw-px`,`${l.toFixed(2)}px`),e.style.setProperty(`--frw-py`,`${u.toFixed(2)}px`);let v=G.current,y=!v.playing||v.hover||t<v.hold;if(e.dataset.wait=y?`true`:`false`,y)return;let x=a;if(a+=h/Math.max(3,v.pace),a>1.1){a=-.06,e.style.setProperty(`--frw-p`,`0`),e.style.setProperty(`--frw-po`,`0`);return}e.style.setProperty(`--frw-p`,Math.max(0,Math.min(1,a)).toFixed(4)),e.style.setProperty(`--frw-po`,(a<0||a>1?0:Math.min(1,a/.05,(1-a)/.05)).toFixed(3));for(let e=0;e<S.length;e++){let t=S[e],n=((.5+((c?t.mx:t.x)/100-.5)*v.zoom)*o-s)/Math.max(1,o-s);x<n&&a>=n&&(Y.current(e),e===3&&(m&&clearTimeout(m),m=setTimeout(()=>{!G.current.hover&&performance.now()>=G.current.hold&&Q.current(!1)},700)))}};return r=requestAnimationFrame(b),()=>{cancelAnimationFrame(r),g.disconnect(),_.disconnect(),e.removeEventListener(`pointermove`,v),e.removeEventListener(`pointerleave`,y),m&&clearTimeout(m)}},[S]);let ie=(e,t)=>{if(e.key!==`ArrowRight`&&e.key!==`ArrowLeft`&&e.key!==`ArrowDown`&&e.key!==`ArrowUp`)return;e.preventDefault();let n=(t+(e.key===`ArrowRight`||e.key===`ArrowDown`?1:S.length-1))%S.length;(e.currentTarget.parentElement?.querySelectorAll(`.frw-dot`)[n])?.focus()},$=S[P]??S[0],ae=t.split(`
`),oe={"--frw-accent":f,"--frw-zoom":c[U]};return(0,a.jsxs)(`div`,{ref:E,className:`frw-root`,style:oe,"data-grid":R,"data-pins":B,"data-wait":`false`,children:[(0,a.jsx)(`style`,{children:x}),(0,a.jsxs)(`header`,{className:`frw-nav`,children:[(0,a.jsxs)(`a`,{className:`frw-brand`,href:`#`,onClick:e=>e.preventDefault(),"aria-label":e,children:[(0,a.jsx)(`span`,{className:`frw-mark`,"aria-hidden":!0,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 24 24`,width:`16`,height:`16`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.8`,strokeLinecap:`round`,children:[(0,a.jsx)(`path`,{d:`M4 18c3-7 5-10 8-13`}),(0,a.jsx)(`path`,{d:`M10 19c2-6 4-9 7-12`}),(0,a.jsx)(`path`,{d:`M16 19c1-3 2-5 4-7`})]})}),e]}),(0,a.jsxs)(`nav`,{className:`frw-links`,"aria-label":`Main`,children:[(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Surveys`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Sensors`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Pricing`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Field notes`})]}),(0,a.jsxs)(`div`,{className:`frw-navr`,children:[(0,a.jsx)(`a`,{className:`frw-signin`,href:`#`,onClick:e=>e.preventDefault(),children:`Sign in`}),(0,a.jsx)(`button`,{type:`button`,className:`frw-btn frw-btn-sm`,onClick:T,children:r})]})]}),(0,a.jsxs)(`section`,{className:`frw-band`,children:[(0,a.jsxs)(`div`,{className:`frw-say`,children:[(0,a.jsx)(`span`,{className:`frw-tag`,children:`Field intelligence`}),(0,a.jsx)(`h1`,{className:`frw-h1`,children:ae.map((e,t)=>(0,a.jsx)(`span`,{children:e},t))})]}),(0,a.jsxs)(`div`,{className:`frw-side`,children:[(0,a.jsx)(`p`,{className:`frw-line`,children:n}),(0,a.jsxs)(`div`,{className:`frw-acts`,children:[(0,a.jsx)(`button`,{type:`button`,className:`frw-btn`,onClick:T,children:r}),(0,a.jsxs)(`a`,{className:`frw-more`,href:`#`,onClick:e=>e.preventDefault(),children:[`Watch a survey`,(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,width:`13`,height:`13`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.6`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M3 8h10M9 4l4 4-4 4`})})]})]})]})]}),(0,a.jsxs)(`div`,{ref:D,className:`frw-frame`,children:[(0,a.jsx)(`div`,{className:`frw-land`,"aria-hidden":!0,children:(0,a.jsx)(`img`,{src:u,alt:``,draggable:!1})}),(0,a.jsx)(`div`,{className:`frw-grid`,"aria-hidden":!0}),(0,a.jsx)(`div`,{className:`frw-scan`,"aria-hidden":!0,children:(0,a.jsx)(`i`,{})}),(0,a.jsxs)(`div`,{className:`frw-pins`,children:[S.map((e,t)=>(0,a.jsxs)(`button`,{type:`button`,className:`frw-dot`,"data-on":t===P,"aria-label":`${e.name}: ${e.finding}`,"aria-pressed":t===P,style:{"--x":e.x,"--y":e.y,"--mx":e.mx,"--my":e.my,"--c":e.color},onPointerEnter:e=>{e.pointerType===`mouse`&&(G.current.hover=!0,X(t,1500))},onPointerLeave:()=>{G.current.hover=!1,G.current.hold=Math.max(G.current.hold,performance.now()+1500)},onFocus:()=>X(t),onClick:()=>X(t),onKeyDown:e=>ie(e,t),children:[(0,a.jsx)(`i`,{className:F[t]?`frw-ping`:void 0},F[t]),(0,a.jsx)(`b`,{})]},e.name)),(0,a.jsxs)(`div`,{className:`frw-alert`,style:y($),"data-done":I,"aria-live":`polite`,children:[(0,a.jsxs)(`div`,{className:`frw-alert-in`,children:[(0,a.jsxs)(`p`,{className:`frw-alert-k`,children:[(0,a.jsxs)(`svg`,{viewBox:`0 0 12 12`,width:`10`,height:`10`,"aria-hidden":!0,children:[(0,a.jsx)(`rect`,{x:`0`,y:`0`,width:`5`,height:`5`,rx:`1`,fill:`currentColor`}),(0,a.jsx)(`rect`,{x:`7`,y:`0`,width:`5`,height:`5`,rx:`1`,fill:`currentColor`}),(0,a.jsx)(`rect`,{x:`0`,y:`7`,width:`5`,height:`5`,rx:`1`,fill:`currentColor`}),(0,a.jsx)(`rect`,{x:`7`,y:`7`,width:`5`,height:`5`,rx:`1`,fill:`currentColor`})]}),`Field alert`,(0,a.jsxs)(`em`,{children:[`Read 06:4`,P]})]}),(0,a.jsxs)(`p`,{className:`frw-alert-t`,children:[(0,a.jsx)(`i`,{style:{background:$.color}}),$.name]}),(0,a.jsx)(`p`,{className:`frw-alert-f`,children:$.finding}),(0,a.jsxs)(`p`,{className:`frw-alert-c`,children:[(0,a.jsx)(`span`,{children:$.chips[0]}),(0,a.jsx)(`span`,{children:$.chips[1]})]})]},P),(0,a.jsxs)(`button`,{type:`button`,className:`frw-btn frw-plan`,onClick:()=>Z(!0),"aria-label":I?`Added to today`:`Plan the fix for ${$.name}`,children:[(0,a.jsx)(`span`,{className:`frw-plan-a`,children:`Plan the fix`}),(0,a.jsxs)(`span`,{className:`frw-plan-b`,children:[(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,width:`12`,height:`12`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M3 8.5l3.2 3.2L13 5`})}),`Added to today`]})]})]})]}),(0,a.jsxs)(`div`,{className:`frw-keys`,role:`group`,"aria-label":`Map`,children:[(0,a.jsx)(`button`,{type:`button`,className:`frw-key`,"aria-pressed":R,"aria-label":`Survey grid`,onClick:()=>z(e=>!e),children:(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,width:`14`,height:`14`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,children:(0,a.jsx)(`path`,{d:`M2 5.5h12M2 10.5h12M5.5 2v12M10.5 2v12`})})}),(0,a.jsx)(`button`,{type:`button`,className:`frw-key`,"aria-pressed":B,"aria-label":`Sensors`,onClick:()=>V(e=>!e),children:(0,a.jsxs)(`svg`,{viewBox:`0 0 16 16`,width:`14`,height:`14`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,a.jsx)(`path`,{d:`M8 14s4.5-4 4.5-7.3A4.5 4.5 0 0 0 8 2.2a4.5 4.5 0 0 0-4.5 4.5C3.500 10 8 14 8 14z`}),(0,a.jsx)(`circle`,{cx:`8`,cy:`6.700`,r:`1.500`})]})}),(0,a.jsx)(`button`,{type:`button`,className:`frw-key`,"aria-pressed":H,"aria-label":H?`Pause the survey`:`Run the survey`,onClick:()=>{G.current.hold=0,re(e=>!e)},children:H?(0,a.jsxs)(`svg`,{viewBox:`0 0 16 16`,width:`14`,height:`14`,fill:`currentColor`,children:[(0,a.jsx)(`rect`,{x:`4`,y:`3.500`,width:`2.700`,height:`9`,rx:`0.800`}),(0,a.jsx)(`rect`,{x:`9.300`,y:`3.500`,width:`2.700`,height:`9`,rx:`0.800`})]}):(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,width:`14`,height:`14`,fill:`currentColor`,children:(0,a.jsx)(`path`,{d:`M5 3.300v9.400a.6.6 0 0 0 .9.500l7.300-4.700a.6.6 0 0 0 0-1L5.900 2.800a.6.6 0 0 0-.9.500z`})})})]}),(0,a.jsxs)(`div`,{className:`frw-zoom`,role:`group`,"aria-label":`Zoom`,children:[(0,a.jsx)(`button`,{type:`button`,className:`frw-key`,"aria-label":`Zoom out`,disabled:U===0,onClick:()=>W(e=>Math.max(0,e-1)),children:(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,width:`14`,height:`14`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.6`,strokeLinecap:`round`,children:(0,a.jsx)(`path`,{d:`M3.500 8h9`})})}),(0,a.jsx)(`button`,{type:`button`,className:`frw-key`,"aria-label":`Zoom in`,disabled:U===c.length-1,onClick:()=>W(e=>Math.min(c.length-1,e+1)),children:(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,width:`14`,height:`14`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.6`,strokeLinecap:`round`,children:(0,a.jsx)(`path`,{d:`M3.500 8h9M8 3.500v9`})})})]}),(0,a.jsxs)(`aside`,{className:`frw-panel`,"aria-label":`Morning survey`,children:[(0,a.jsxs)(`div`,{className:`frw-rail`,"aria-hidden":!0,children:[(0,a.jsx)(`span`,{className:`frw-mark`,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 24 24`,width:`15`,height:`15`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.8`,strokeLinecap:`round`,children:[(0,a.jsx)(`path`,{d:`M4 18c3-7 5-10 8-13`}),(0,a.jsx)(`path`,{d:`M10 19c2-6 4-9 7-12`}),(0,a.jsx)(`path`,{d:`M16 19c1-3 2-5 4-7`})]})}),(0,a.jsx)(`span`,{className:`frw-rail-i`,"data-on":`true`,children:(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,width:`15`,height:`15`,fill:`currentColor`,children:(0,a.jsx)(`path`,{d:`M8 2 2.500 6.300V13a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V6.300L8 2z`})})}),(0,a.jsx)(`span`,{className:`frw-rail-i`,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 16 16`,width:`15`,height:`15`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,a.jsx)(`path`,{d:`M3 13c0-6 4-10 10-10 0 6-4 10-10 10z`}),(0,a.jsx)(`path`,{d:`M3 13l5-5`})]})}),(0,a.jsx)(`span`,{className:`frw-rail-i`,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 16 16`,width:`15`,height:`15`,fill:`currentColor`,children:[(0,a.jsx)(`rect`,{x:`2.500`,y:`2.500`,width:`4.600`,height:`4.600`,rx:`1.200`}),(0,a.jsx)(`rect`,{x:`8.900`,y:`2.500`,width:`4.600`,height:`4.600`,rx:`1.200`}),(0,a.jsx)(`rect`,{x:`2.500`,y:`8.900`,width:`4.600`,height:`4.600`,rx:`1.200`}),(0,a.jsx)(`rect`,{x:`8.900`,y:`8.900`,width:`4.600`,height:`4.600`,rx:`1.200`})]})}),(0,a.jsx)(`span`,{className:`frw-rail-i`,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 16 16`,width:`15`,height:`15`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`,children:[(0,a.jsx)(`path`,{d:`M2.500 4.500h11M2.500 8h11M2.500 11.500h11`}),(0,a.jsx)(`circle`,{cx:`5.500`,cy:`4.500`,r:`1.400`,fill:`#fff`}),(0,a.jsx)(`circle`,{cx:`10.500`,cy:`8`,r:`1.400`,fill:`#fff`}),(0,a.jsx)(`circle`,{cx:`6.500`,cy:`11.500`,r:`1.400`,fill:`#fff`})]})}),(0,a.jsx)(`span`,{className:`frw-me`,children:`MO`})]}),(0,a.jsxs)(`div`,{className:`frw-body`,children:[(0,a.jsxs)(`div`,{className:`frw-head`,children:[(0,a.jsx)(`p`,{className:`frw-title`,children:`Morning survey`}),(0,a.jsx)(`p`,{className:`frw-sub`,children:`North block · 212 ha`}),(0,a.jsxs)(`p`,{className:`frw-chips`,children:[(0,a.jsx)(`span`,{"data-on":`true`,children:`Zone`}),(0,a.jsx)(`span`,{children:`Soil`}),(0,a.jsx)(`span`,{children:`Water`})]}),(0,a.jsxs)(`p`,{className:`frw-date`,children:[(0,a.jsxs)(`svg`,{viewBox:`0 0 16 16`,width:`12`,height:`12`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.4`,strokeLinecap:`round`,"aria-hidden":!0,children:[(0,a.jsx)(`rect`,{x:`2.500`,y:`3.500`,width:`11`,height:`10`,rx:`2`}),(0,a.jsx)(`path`,{d:`M2.500 6.800h11M5.500 2v3M10.500 2v3`})]}),`Flown `,(0,a.jsx)(`b`,{children:`Thu 20 Nov, 06:40`})]})]}),(0,a.jsxs)(`div`,{className:`frw-soil`,children:[(0,a.jsxs)(`p`,{className:`frw-soil-h`,children:[(0,a.jsxs)(`span`,{children:[`Soil health`,(0,a.jsx)(`small`,{children:$.name})]}),(0,a.jsxs)(`strong`,{children:[(0,a.jsx)(`span`,{ref:A,children:_(S[0].now)}),(0,a.jsx)(`small`,{children:`/100`})]})]}),(0,a.jsxs)(`svg`,{className:`frw-radar`,viewBox:`-96 -76 192 150`,role:`img`,"aria-label":`Soil health for ${$.name}`,children:[m.map((e,t)=>(0,a.jsx)(`polygon`,{points:e,className:`frw-ring`},t)),h.map(([e,t],n)=>(0,a.jsx)(`line`,{x1:`0`,y1:`0`,x2:e,y2:t,className:`frw-ring`},n)),(0,a.jsx)(`polygon`,{ref:k,points:p(S[0].then),className:`frw-then`}),(0,a.jsx)(`polygon`,{ref:O,points:p(S[0].now),className:`frw-now`}),g.map(([e,t],n)=>(0,a.jsx)(`text`,{x:e,y:d(t+2.5),textAnchor:n===0?`middle`:e>0?`start`:`end`,className:`frw-ax`,children:s[n]},n))]}),(0,a.jsxs)(`p`,{className:`frw-legend`,children:[(0,a.jsxs)(`span`,{children:[(0,a.jsx)(`i`,{className:`frw-lg-then`}),`Last month`]}),(0,a.jsxs)(`span`,{children:[(0,a.jsx)(`i`,{className:`frw-lg-now`}),`This month`]})]})]}),(0,a.jsxs)(`div`,{className:`frw-table`,role:`group`,"aria-label":`Zones`,children:[(0,a.jsxs)(`p`,{className:`frw-th`,children:[(0,a.jsx)(`span`,{children:`Zone`}),(0,a.jsx)(`span`,{children:`ha`}),(0,a.jsx)(`span`,{children:`Score`})]}),S.map((e,t)=>(0,a.jsxs)(`button`,{type:`button`,className:`frw-row`,"data-on":t===P,"data-next":t===(P+1)%S.length,"aria-pressed":t===P,onClick:()=>X(t),children:[(0,a.jsxs)(`span`,{children:[(0,a.jsx)(`i`,{style:{background:e.color}}),e.name]}),(0,a.jsx)(`span`,{children:e.ha}),(0,a.jsx)(`span`,{children:_(e.now)})]},e.name))]}),(0,a.jsxs)(`p`,{className:`frw-foot`,children:[(0,a.jsx)(`span`,{children:`Next flight`}),(0,a.jsx)(`b`,{children:`Fri 21 Nov, 06:30`})]})]})]})]})]})}var x=`
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap');
.frw-root {
  --frw-accent: #e4f36a;
  --frw-olive: #2f3a1c;
  --frw-ink: #171b10;
  --frw-soft: #6b6f5e;
  --frw-cream: #f1efe2;
  --frw-spring: cubic-bezier(.3,1.36,.46,1);
  --frw-px: 0px; --frw-py: 0px; --frw-p: 0; --frw-po: 0; --frw-zoom: 1;
  container: frw / inline-size;
  position: relative;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  background: var(--frw-cream);
  color: var(--frw-ink);
  font-family: "Geist", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: left;
}
.frw-root *, .frw-root *::before, .frw-root *::after { box-sizing: border-box; }
.frw-root p, .frw-root h1 { margin: 0; }
.frw-root a { color: inherit; text-decoration: none; }
.frw-root button { font: inherit; color: inherit; border: 0; background: none; padding: 0; cursor: pointer; }
.frw-root button:focus-visible, .frw-root a:focus-visible { outline: 2px solid var(--frw-ink); outline-offset: 2px; border-radius: 8px; }

/* nav */
.frw-nav { flex: none; height: 64px; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; }
.frw-brand { display: inline-flex; align-items: center; gap: 9px; font-size: 17px; font-weight: 600; letter-spacing: -.02em; }
.frw-mark { width: 28px; height: 28px; border-radius: 9px; background: var(--frw-olive); color: var(--frw-accent); display: grid; place-items: center; flex: none; }
.frw-links { display: flex; gap: 30px; font-size: 14px; color: #3c4130; }
.frw-links a { transition: color .2s; }
.frw-links a:hover { color: var(--frw-ink); }
.frw-navr { display: flex; align-items: center; gap: 20px; font-size: 14px; }
.frw-signin { color: #3c4130; }
.frw-root .frw-btn {
  height: 44px; padding: 0 20px; border-radius: 10px; background: var(--frw-olive); color: #f4f6e6;
  font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 1px 2px rgba(23,27,16,.25);
  transition: scale .18s cubic-bezier(.2,.8,.2,1), background .2s;
}
.frw-root .frw-btn:hover { background: #3a4723; }
.frw-root .frw-btn:active { scale: .97; }
.frw-root .frw-btn-sm { height: 36px; padding: 0 14px; font-size: 11px; border-radius: 9px; }

/* the sentence */
.frw-band { flex: none; padding: 10px 28px 22px; display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; }
.frw-tag {
  display: inline-block; padding: 4px 8px; border-radius: 5px; background: var(--frw-accent); color: #2c3312;
  font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 10.5px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
  animation: frw-up .6s cubic-bezier(.2,.8,.2,1) both;
}
.frw-h1 { margin-top: 14px !important; font-size: 50px; line-height: 1.02; font-weight: 400; letter-spacing: -.035em; }
.frw-h1 span { display: block; animation: frw-up .7s cubic-bezier(.2,.8,.2,1) both; }
.frw-h1 span:nth-child(2) { animation-delay: .07s; color: #5c6348; }
.frw-side { width: 400px; flex: none; animation: frw-up .7s .12s cubic-bezier(.2,.8,.2,1) both; }
.frw-line { font-size: 15.5px; line-height: 1.42; color: #3c4130; letter-spacing: -.005em; }
.frw-acts { margin-top: 16px; display: flex; align-items: center; gap: 20px; }
.frw-more { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; }
.frw-more svg { transition: translate .25s cubic-bezier(.2,.8,.2,1); }
.frw-more:hover svg { translate: 3px 0; }

/* the photograph */
.frw-frame {
  --frw-s0: 332px;
  container: frwf / size;
  position: relative; flex: 1; min-height: 0; margin: 0 24px 16px; border-radius: 26px; overflow: hidden; background: #3f5a25;
  clip-path: inset(0 round 26px);
  animation: frw-rise .9s .05s cubic-bezier(.2,.8,.2,1) both;
}
.frw-land, .frw-pins {
  position: absolute; inset: -12px;
  transform: translate3d(var(--frw-px), var(--frw-py), 0) scale(var(--frw-zoom));
  transition: transform .7s cubic-bezier(.2,.8,.2,1);
}
.frw-land img { width: 100%; height: 100%; object-fit: cover; display: block; user-select: none; }
.frw-land::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,20,5,.10), rgba(10,20,5,0) 30%, rgba(10,20,5,.12)); }
.frw-pins { pointer-events: none; }
.frw-grid {
  position: absolute; inset: 0; pointer-events: none; opacity: 1; transition: opacity .4s;
  background-image:
    linear-gradient(to right, rgba(255,255,255,.26) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.26) 1px, transparent 1px);
  background-size: 116px 116px; background-position: 40px 28px;
}
.frw-root[data-grid="false"] .frw-grid { opacity: 0; }
/* the line of light, and the strip it has just read behind it */
.frw-scan {
  position: absolute; top: 0; bottom: 0; width: 0; pointer-events: none;
  left: calc(var(--frw-s0) + (100% - var(--frw-s0)) * var(--frw-p));
  opacity: var(--frw-po); transition: opacity .5s;
}
.frw-root[data-wait="true"] .frw-scan { opacity: calc(var(--frw-po) * .45); }
.frw-scan::before {
  content: ""; position: absolute; top: 0; bottom: 0; right: 0; width: 240px;
  background: linear-gradient(to left, color-mix(in srgb, var(--frw-accent) 46%, transparent), color-mix(in srgb, var(--frw-accent) 14%, transparent) 40%, transparent);
}
.frw-scan::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -28px; width: 56px;
  background: radial-gradient(closest-side, rgba(255,255,235,.55), transparent); mix-blend-mode: screen;
}
.frw-scan i { position: absolute; top: 0; bottom: 0; left: -1.5px; width: 3px; background: #fdffe8; box-shadow: 0 0 12px 2px #fff, 0 0 26px 6px color-mix(in srgb, var(--frw-accent) 90%, transparent), 0 0 70px 14px color-mix(in srgb, var(--frw-accent) 50%, transparent); }

/* a sensor */
.frw-root .frw-dot {
  position: absolute; left: calc(var(--x) * 1%); top: calc(var(--y) * 1%); width: 36px; height: 36px; margin: -18px 0 0 -18px;
  border-radius: 50%; pointer-events: auto; display: grid; place-items: center;
  scale: calc(1 / var(--frw-zoom)); transition: opacity .35s, scale .35s cubic-bezier(.2,.8,.2,1);
}
.frw-root[data-pins="false"] .frw-dot { opacity: 0; pointer-events: none; }
.frw-root .frw-dot:focus-visible { outline: 2px solid #fff; outline-offset: -4px; border-radius: 50%; }
.frw-dot b {
  width: 16px; height: 16px; border-radius: 50%; background: var(--c);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--c) 30%, transparent), 0 0 18px 4px color-mix(in srgb, var(--c) 55%, transparent), inset 0 1px 1px rgba(255,255,255,.55);
  transition: scale .45s var(--frw-spring), box-shadow .3s;
}
.frw-dot[data-on="true"] b { scale: 1.3; box-shadow: 0 0 0 2.5px #fff, 0 0 0 8px color-mix(in srgb, var(--c) 38%, transparent), 0 0 26px 8px color-mix(in srgb, var(--c) 70%, transparent); }
.frw-dot i { position: absolute; inset: 9px; border-radius: 50%; border: 1.5px solid var(--c); opacity: 0; pointer-events: none; }
.frw-dot i.frw-ping { animation: frw-ping 1.1s cubic-bezier(.2,.7,.3,1) both; }
@keyframes frw-ping { 0% { opacity: .95; scale: 1; } 100% { opacity: 0; scale: 4.6; } }

/* the alert */
.frw-alert {
  position: absolute; left: var(--frw-cl); top: var(--frw-ct); width: 248px; padding: 14px; border-radius: 16px; background: #fff; pointer-events: auto;
  box-shadow: 0 1px 1px rgba(15,25,5,.10), 0 14px 34px -10px rgba(15,25,5,.45), 0 0 0 1px rgba(15,25,5,.04);
  transition: left .72s var(--frw-spring), top .72s var(--frw-spring), opacity .35s;
  scale: calc(1 / var(--frw-zoom)); transform-origin: 0 0;
}
.frw-root[data-pins="false"] .frw-alert { opacity: 0; pointer-events: none; }
.frw-alert-in > * { animation: frw-in .42s cubic-bezier(.2,.8,.2,1) both; }
.frw-alert-in > *:nth-child(2) { animation-delay: .05s; }
.frw-alert-in > *:nth-child(3) { animation-delay: .09s; }
.frw-alert-in > *:nth-child(4) { animation-delay: .13s; }
@keyframes frw-in { from { opacity: 0; translate: 0 6px; } to { opacity: 1; translate: 0 0; } }
.frw-alert-k { display: flex; align-items: center; gap: 6px; font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 10px; letter-spacing: .09em; text-transform: uppercase; color: #2c3312; }
.frw-alert-k em { margin-left: auto; font-style: normal; letter-spacing: 0; text-transform: none; font-size: 10px; color: #6b6f5e; padding: 2px 6px; border-radius: 5px; background: #f1f2ea; }
.frw-alert-t { margin-top: 10px !important; display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 500; letter-spacing: -.02em; }
.frw-alert-t i { width: 9px; height: 9px; border-radius: 3px; flex: none; }
.frw-alert-f { margin-top: 4px !important; font-size: 13px; line-height: 1.35; color: #5b5f4f; min-height: 35px; }
.frw-alert-c { margin-top: 9px !important; display: flex; gap: 6px; }
.frw-alert-c span { font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 10.5px; padding: 4px 7px; border-radius: 6px; border: 1px solid #e3e5d8; color: #33381f; white-space: nowrap; }
.frw-root .frw-plan { margin-top: 12px; width: 100%; height: 36px; font-size: 11px; border-radius: 9px; position: relative; overflow: hidden; }
.frw-plan span { display: inline-flex; align-items: center; gap: 7px; transition: translate .4s var(--frw-spring), opacity .25s; }
.frw-plan-b { position: absolute; inset: 0; justify-content: center; translate: 0 100%; opacity: 0; color: #2c3312; }
.frw-alert[data-done="true"] .frw-plan { background: var(--frw-accent); }
.frw-alert[data-done="true"] .frw-plan-a { translate: 0 -120%; opacity: 0; }
.frw-alert[data-done="true"] .frw-plan-b { translate: 0 0; opacity: 1; }

/* map keys */
.frw-keys, .frw-zoom { position: absolute; top: 16px; display: flex; padding: 3px; gap: 2px; border-radius: 11px; background: #fff; box-shadow: 0 1px 2px rgba(15,25,5,.18), 0 8px 20px -10px rgba(15,25,5,.4); }
.frw-keys { left: 332px; }
.frw-zoom { right: 16px; }
.frw-root .frw-key { width: 32px; height: 32px; border-radius: 8px; display: grid; place-items: center; color: #9a9d8c; transition: background .2s, color .2s, scale .15s; }
.frw-root .frw-key:hover { background: #f1f2ea; }
.frw-root .frw-key:active { scale: .92; }
.frw-root .frw-key[aria-pressed="true"], .frw-zoom .frw-key { color: #2c3312; }
.frw-root .frw-key:disabled { color: #c6c8ba; cursor: default; }

/* the panel */
.frw-panel {
  position: absolute; left: 16px; top: 16px; bottom: 16px; width: 300px; border-radius: 16px; background: #fff; display: flex; overflow: hidden;
  box-shadow: 0 1px 2px rgba(15,25,5,.16), 0 24px 50px -24px rgba(15,25,5,.55);
  animation: frw-panel .8s .25s cubic-bezier(.2,.8,.2,1) both;
}
.frw-rail { width: 46px; flex: none; padding: 12px 0; display: flex; flex-direction: column; align-items: center; gap: 6px; border-right: 1px solid #eeefe6; }
.frw-rail .frw-mark { width: 26px; height: 26px; border-radius: 8px; margin-bottom: 10px; }
.frw-rail-i { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; color: #b3b6a6; }
.frw-rail-i[data-on="true"] { color: #2c3312; background: #f1f2ea; }
.frw-me { margin-top: auto; width: 26px; height: 26px; border-radius: 50%; background: #d9e7c4; color: #2c3312; font-size: 9.5px; font-weight: 600; display: grid; place-items: center; letter-spacing: .02em; }
.frw-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.frw-head { padding: 14px 14px 12px; border-bottom: 1px solid #eeefe6; }
.frw-title { font-size: 14.5px; font-weight: 500; letter-spacing: -.015em; }
.frw-sub { font-size: 11.5px; color: #8b8e7e; margin-top: 1px !important; }
.frw-chips { margin-top: 11px !important; display: flex; gap: 5px; }
.frw-chips span { font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 9.5px; letter-spacing: .09em; text-transform: uppercase; padding: 4px 7px; border-radius: 5px; background: #f4f4ee; color: #7a7d6d; }
.frw-chips span[data-on="true"] { background: var(--frw-accent); color: #2c3312; }
.frw-date { margin-top: 10px !important; display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #8b8e7e; }
.frw-date b { font-weight: 500; color: #33381f; font-variant-numeric: tabular-nums; }
.frw-soil { padding: 12px 14px 10px; border-bottom: 1px solid #eeefe6; }
.frw-soil-h { display: flex; align-items: flex-start; justify-content: space-between; font-size: 13px; font-weight: 500; letter-spacing: -.01em; }
.frw-soil-h small { display: block; font-size: 11px; font-weight: 400; color: #8b8e7e; margin-top: 1px; }
.frw-soil-h strong { font-size: 22px; font-weight: 500; letter-spacing: -.03em; font-variant-numeric: tabular-nums; line-height: 1; }
.frw-soil-h strong small { display: inline; font-size: 10.5px; color: #a5a898; letter-spacing: 0; margin-left: 2px; }
.frw-radar { display: block; width: 100%; height: auto; margin-top: 2px; overflow: visible; }
.frw-ring { fill: none; stroke: rgba(23,27,16,.11); stroke-width: .7; }
.frw-then { fill: rgba(234,108,214,.20); stroke: #e56cd0; stroke-width: 1.1; stroke-linejoin: round; }
.frw-now { fill: rgba(46,170,234,.22); stroke: #2aa5e6; stroke-width: 1.3; stroke-linejoin: round; }
.frw-ax { font-size: 7.4px; fill: #a0a392; font-family: "Geist", system-ui, sans-serif; }
.frw-legend { display: flex; gap: 14px; font-size: 10.5px; color: #7a7d6d; }
.frw-legend span { display: inline-flex; align-items: center; gap: 5px; }
.frw-legend i { width: 7px; height: 7px; border-radius: 2px; }
.frw-lg-then { background: #e56cd0; }
.frw-lg-now { background: #2aa5e6; }
.frw-table { padding: 8px 8px 10px; display: flex; flex-direction: column; gap: 1px; flex: 0 1 auto; min-height: 0; overflow: hidden; }
.frw-th, .frw-root .frw-row { flex: none; }
.frw-head, .frw-soil, .frw-foot { flex: none; }
.frw-th, .frw-root .frw-row { display: grid; grid-template-columns: 1fr 34px 44px; align-items: center; padding: 0 6px; text-align: left; }
.frw-th { height: 22px; font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 9px; letter-spacing: .09em; text-transform: uppercase; color: #a5a898; }
.frw-th span:nth-child(n+2), .frw-row span:nth-child(n+2) { text-align: right; font-variant-numeric: tabular-nums; }
.frw-root .frw-row { height: 28px; border-radius: 7px; font-size: 12px; color: #4a4e3c; transition: background .35s, color .35s; }
.frw-row span:first-child { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
.frw-row i { width: 8px; height: 8px; border-radius: 2.5px; flex: none; transition: scale .4s var(--frw-spring); }
.frw-row span:nth-child(n+2) { font-family: "Geist Mono", ui-monospace, Menlo, monospace; font-size: 11px; color: #8b8e7e; }
.frw-root .frw-row:hover { background: #f6f7f0; }
.frw-root .frw-row[data-on="true"] { background: var(--frw-accent); color: #20260d; }
.frw-row[data-on="true"] span:nth-child(n+2) { color: #3b4318; }
.frw-row[data-on="true"] i { scale: 1.25; }
.frw-foot { margin-top: auto !important; padding: 11px 14px 13px; border-top: 1px solid #eeefe6; display: flex; justify-content: space-between; font-size: 11.5px; color: #8b8e7e; }
.frw-foot b { font-weight: 500; color: #33381f; font-variant-numeric: tabular-nums; }

@keyframes frw-up { from { opacity: 0; translate: 0 14px; } to { opacity: 1; translate: 0 0; } }
@keyframes frw-rise { from { opacity: 0; translate: 0 22px; } to { opacity: 1; translate: 0 0; } }
@keyframes frw-panel { from { opacity: 0; translate: -18px 0; } to { opacity: 1; translate: 0 0; } }

/* a shorter photograph: the panel sheds what it can spare, in this order */
@container frwf (max-height: 672px) and (min-width: 700px) { .frw-foot { display: none; } }
@container frwf (max-height: 632px) and (min-width: 700px) { .frw-date { display: none; } .frw-root .frw-row { height: 25px; } }
@container frwf (max-height: 586px) and (min-width: 700px) { .frw-radar { width: 78%; margin-left: auto; margin-right: auto; } }
@container frwf (max-height: 546px) and (min-width: 700px) { .frw-chips { display: none; } }
@container frwf (max-height: 504px) and (min-width: 700px) { .frw-legend, .frw-th { display: none; } .frw-table { padding-top: 4px; } }
@container frwf (max-height: 450px) and (min-width: 700px) { .frw-radar { width: 58%; } .frw-soil { padding-bottom: 4px; } }

/* narrower desks */
@container frw (max-width: 1180px) {
  .frw-links { display: none; }
  .frw-h1 { font-size: 40px; }
  .frw-side { width: 340px; }
  .frw-frame { --frw-s0: 286px; }
  .frw-rail { display: none; }
  .frw-panel { width: 254px; }
  .frw-keys { left: 286px; }
}
/* the phone: the photograph fills the screen, the panel is a sheet */
@container frw (max-width: 760px) {
  .frw-nav { height: 56px; padding: 0 16px; }
  .frw-signin { display: none; }
  .frw-band { padding: 4px 16px 14px; display: block; }
  .frw-h1 { font-size: 31px; line-height: 1.04; margin-top: 10px !important; }
  .frw-side { width: auto; }
  .frw-line { margin-top: 9px !important; font-size: 13.5px; }
  .frw-acts { display: none; }
  .frw-frame { --frw-s0: 0px; margin: 0 10px 10px; border-radius: 22px; clip-path: inset(0 round 22px); }
  .frw-grid { background-size: 78px 78px; background-position: 20px 16px; }
  .frw-root .frw-dot { left: calc(var(--mx) * 1%); top: calc(var(--my) * 1%); }
  .frw-alert { left: var(--frw-ml); top: var(--frw-mt); width: 198px; padding: 11px; border-radius: 14px; }
  .frw-alert-t { font-size: 15px; margin-top: 7px !important; }
  .frw-alert-f { font-size: 12px; min-height: 32px; }
  .frw-alert-c { display: none; }
  .frw-root .frw-plan { margin-top: 9px; height: 32px; }
  .frw-keys { left: 10px; top: 10px; }
  .frw-zoom { display: none; }
  .frw-panel { left: 0; right: 0; top: auto; bottom: 0; width: auto; height: auto; border-radius: 20px 20px 22px 22px; box-shadow: 0 -14px 40px -18px rgba(15,25,5,.6); animation-name: frw-rise; }
  .frw-body { display: block; }
  .frw-foot { display: none; }
  .frw-head { display: none; }
  .frw-soil { grid-column: 1 / -1; display: grid; grid-template-columns: 168px 1fr; column-gap: 10px; padding: 12px 14px 2px; border-bottom: 0; align-items: start; }
  .frw-soil-h { grid-column: 2; grid-row: 1; flex-direction: column; gap: 10px; padding-top: 6px; }
  .frw-soil-h strong { font-size: 30px; }
  .frw-radar { grid-column: 1; grid-row: 1 / 3; margin: 0; }
  .frw-legend { grid-column: 2; grid-row: 2; flex-direction: column; gap: 4px; align-self: end; padding-bottom: 8px; }
  .frw-table { padding: 0 8px 10px; }
  .frw-th { display: none; }
  .frw-root .frw-row { display: none; height: 32px; font-size: 13px; }
  .frw-root .frw-row[data-on="true"], .frw-root .frw-row[data-next="true"] { display: grid; }
  .frw-root .frw-row[data-on="true"] { order: -1; }
}

.frw-root[data-still="true"] .frw-scan { display: none; }
@media (prefers-reduced-motion: reduce) {
  .frw-tag, .frw-h1 span, .frw-side, .frw-frame, .frw-panel, .frw-alert-in > *, .frw-dot i.frw-ping { animation: none !important; }
  .frw-alert, .frw-land, .frw-pins, .frw-dot b, .frw-plan span, .frw-root .frw-row, .frw-root .frw-btn { transition-duration: 1ms !important; }
  .frw-scan { display: none; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(b,{})}));