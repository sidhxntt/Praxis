import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o={everyday:[{say:`A packing list that knows the weather`,kind:`list`,a:[`Lisbon, Fri to Sun`,`24° and clear`,`Linen shirts, three`,`Sunglasses`,`A jacket for the evenings`,`Umbrella`,`no rain`]},{say:`Track the water I drink today`,kind:`ring`,a:[`Water today`,`1.5`,`of 2.4 litres`,`5`,`Add a glass`]},{say:`Split the rent between the four of us`,kind:`split`,a:[`Rent, December`,`€1,680`,`Ines`,`Tomás`,`Wren`,`You`,`€420`]},{say:`Tell me when the plants are thirsty`,kind:`month`,a:[`Watering`,`December`,`Next: Thursday`,`Fern and basil`]}],work:[{say:`A handover list for Friday's release`,kind:`list`,a:[`Release 4.2, Friday`,`3 of 4 ready`,`Changelog written`,`Rollback tested`,`Support team briefed`,`Press note`,`Monday`]},{say:`Count the hours I bill this week`,kind:`ring`,a:[`Billed this week`,`26`,`of 40 hours`,`5`,`Start the timer`]},{say:`Split the offsite bill across the team`,kind:`split`,a:[`Offsite, Porto`,`€2,340`,`Design`,`Product`,`Sales`,`You`,`€585`]},{say:`Show who is on call each week`,kind:`month`,a:[`On call`,`December`,`This week: Maya`,`Next: Idris`]}]},s={down:[{f:320,to:520,d:.05,g:.04,type:`triangle`}],key:[{f:1400,to:900,d:.018,g:.022,type:`square`}],send:[{f:520,to:240,d:.05,g:.045,type:`triangle`}],done:[{f:1046.5,d:.06,g:.04},{f:1568,d:.06,g:.04,at:.08}]};function c(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(n=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let r=navigator.userActivation;if(!(r&&!r.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let r=t.current??=new e;r.state===`suspended`&&r.resume();for(let e of s[n]??[]){let t=r.currentTime+(e.at??0),n=Math.min(e.d??.035,.06),i=r.createGain();i.gain.setValueAtTime(1e-4,t),i.gain.exponentialRampToValueAtTime(Math.min(e.g??.035,.06),t+.004),i.gain.exponentialRampToValueAtTime(1e-4,t+n),i.connect(r.destination);let a=r.createOscillator();a.type=e.type??`sine`,a.frequency.setValueAtTime(e.f,t),e.to&&a.frequency.exponentialRampToValueAtTime(e.to,t+n),a.connect(i),a.start(t),a.stop(t+n+.01)}}catch{}},[e])}var l=e=>({"--i":e}),u=e=>({"--j":Math.round(e*100)/100}),d=364.42;function f({ask:e}){let t=e.a;if(e.kind===`list`)return(0,a.jsxs)(`svg`,{className:`sso-app`,viewBox:`0 0 264 232`,"aria-hidden":!0,children:[(0,a.jsxs)(`g`,{className:`sso-st`,style:l(0),children:[(0,a.jsx)(`rect`,{x:`0`,y:`0`,width:`264`,height:`46`,rx:`15`,className:`sso-f-card`}),(0,a.jsx)(`circle`,{cx:`24`,cy:`23`,r:`9`,className:`sso-f-tone`}),(0,a.jsx)(`text`,{x:`44`,y:`20`,className:`sso-t-b`,children:t[0]}),(0,a.jsx)(`text`,{x:`44`,y:`35`,className:`sso-t-s`,children:t[1]})]}),[0,1,2,3].map(e=>(0,a.jsxs)(`g`,{className:`sso-st`,style:l(e+1),children:[(0,a.jsx)(`rect`,{x:`3`,y:62+e*42,width:`22`,height:`22`,rx:`7.5`,className:`sso-f-box`}),(0,a.jsx)(`text`,{x:`38`,y:78+e*42,className:e===3?`sso-t-m sso-t-off`:`sso-t-m`,children:t[2+e]}),e===3?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`line`,{x1:`36`,y1:73.5+e*42,x2:Math.round(40+(t[5]??``).length*7.1),y2:73.5+e*42,className:`sso-l-off`}),(0,a.jsx)(`text`,{x:`264`,y:77.5+e*42,textAnchor:`end`,className:`sso-t-x`,children:t[6]})]}):null]},e)),[0,1].map(e=>(0,a.jsxs)(`g`,{className:`sso-tk`,style:u(e),children:[(0,a.jsx)(`rect`,{x:`3`,y:62+e*42,width:`22`,height:`22`,rx:`7.5`,className:`sso-f-tone`}),(0,a.jsx)(`path`,{d:`M9 ${73.5+e*42}l3.6 3.6 6.6 -7.4`,className:`sso-l-check`})]},e)),(0,a.jsx)(`g`,{className:`sso-st`,style:l(5),children:(0,a.jsx)(`rect`,{x:`0`,y:`228`,width:`264`,height:`1`,className:`sso-f-line`})})]});if(e.kind===`ring`){let e=Math.max(0,Math.min(8,Number(t[3])||0)),n=Math.round(d*(1-e/8)*100)/100;return(0,a.jsxs)(`svg`,{className:`sso-app`,viewBox:`0 0 264 232`,"aria-hidden":!0,children:[(0,a.jsx)(`g`,{className:`sso-st`,style:l(0),children:(0,a.jsx)(`text`,{x:`132`,y:`13`,textAnchor:`middle`,className:`sso-t-b`,children:t[0]})}),(0,a.jsx)(`g`,{className:`sso-st`,style:l(1),children:(0,a.jsx)(`circle`,{cx:`132`,cy:`92`,r:`58`,className:`sso-l-track`})}),(0,a.jsx)(`circle`,{cx:`132`,cy:`92`,r:`58`,className:`sso-l-ring`,style:{"--off":n,"--i":2},transform:`rotate(-90 132 92)`}),(0,a.jsxs)(`g`,{className:`sso-st`,style:l(3),children:[(0,a.jsx)(`text`,{x:`132`,y:`101`,textAnchor:`middle`,className:`sso-t-big`,children:t[1]}),(0,a.jsx)(`text`,{x:`132`,y:`119`,textAnchor:`middle`,className:`sso-t-s`,children:t[2]})]}),(0,a.jsx)(`g`,{className:`sso-st`,style:l(4),children:[0,1,2,3,4,5,6,7].map(t=>(0,a.jsx)(`rect`,{x:32+t*26,y:`166`,width:`18`,height:`24`,rx:`6`,className:t<e?`sso-f-tone`:`sso-f-off`},t))}),(0,a.jsx)(`g`,{className:`sso-tk`,style:u(1),children:(0,a.jsx)(`rect`,{x:32+e*26,y:`166`,width:`18`,height:`24`,rx:`6`,className:`sso-f-tone`})}),(0,a.jsxs)(`g`,{className:`sso-st`,style:l(5),children:[(0,a.jsx)(`rect`,{x:`66`,y:`202`,width:`132`,height:`30`,rx:`15`,className:`sso-f-ink`}),(0,a.jsx)(`text`,{x:`132`,y:`221.5`,textAnchor:`middle`,className:`sso-t-w`,children:t[4]})]})]})}if(e.kind===`split`)return(0,a.jsxs)(`svg`,{className:`sso-app`,viewBox:`0 0 264 232`,"aria-hidden":!0,children:[(0,a.jsxs)(`g`,{className:`sso-st`,style:l(0),children:[(0,a.jsx)(`text`,{x:`0`,y:`14`,className:`sso-t-b`,children:t[0]}),(0,a.jsx)(`text`,{x:`264`,y:`14`,textAnchor:`end`,className:`sso-t-b`,children:t[1]}),(0,a.jsx)(`rect`,{x:`0`,y:`26`,width:`264`,height:`1`,className:`sso-f-line`})]}),[0,1,2,3].map(e=>(0,a.jsxs)(`g`,{className:`sso-st`,style:l(e+1),children:[(0,a.jsx)(`circle`,{cx:`16`,cy:58+e*47,r:`15`,className:e===3?`sso-f-tone`:e===0?`sso-f-ink`:e===1?`sso-f-mid`:`sso-f-soft`}),(0,a.jsx)(`text`,{x:`16`,y:62+e*47,textAnchor:`middle`,className:e===2?`sso-t-i sso-t-ink`:`sso-t-i`,children:(t[2+e]??``).slice(0,1)}),(0,a.jsx)(`text`,{x:`42`,y:54+e*47,className:`sso-t-m`,children:t[2+e]}),(0,a.jsx)(`rect`,{x:`42`,y:63+e*47,width:`150`,height:`6`,rx:`3`,className:`sso-f-off`}),(0,a.jsx)(`text`,{x:`264`,y:62+e*47,textAnchor:`end`,className:`sso-t-m`,children:t[6]})]},e)),[0,1,3].map((e,t)=>(0,a.jsx)(`rect`,{x:`42`,y:63+e*47,width:`150`,height:`6`,rx:`3`,className:e===3?`sso-bar sso-f-tone`:`sso-bar sso-f-ink`,style:u(t)},e)),(0,a.jsx)(`g`,{className:`sso-st`,style:l(5),children:(0,a.jsx)(`rect`,{x:`0`,y:`228`,width:`264`,height:`1`,className:`sso-f-line`})})]});let n=[`M`,`T`,`W`,`T`,`F`,`S`,`S`];return(0,a.jsxs)(`svg`,{className:`sso-app`,viewBox:`0 0 264 232`,"aria-hidden":!0,children:[(0,a.jsxs)(`g`,{className:`sso-st`,style:l(0),children:[(0,a.jsx)(`text`,{x:`4`,y:`14`,className:`sso-t-b`,children:t[0]}),(0,a.jsx)(`text`,{x:`260`,y:`14`,textAnchor:`end`,className:`sso-t-s`,children:t[1]}),n.map((e,t)=>(0,a.jsx)(`text`,{x:18+t*38,y:`36`,textAnchor:`middle`,className:`sso-t-x`,children:e},t))]}),[0,1,2,3].map(e=>(0,a.jsx)(`g`,{className:`sso-st`,style:l(e+1),children:n.map((t,n)=>(0,a.jsx)(`rect`,{x:4+n*38,y:46+e*34,width:`28`,height:`28`,rx:`9`,className:`sso-f-off`},n))},e)),[1,4,8,11,15,18,22,25].map((e,t)=>(0,a.jsxs)(`g`,{className:`sso-tk`,style:u(t*.45),children:[(0,a.jsx)(`rect`,{x:4+e%7*38,y:46+Math.floor(e/7)*34,width:`28`,height:`28`,rx:`9`,className:`sso-f-tone`}),(0,a.jsx)(`circle`,{cx:18+e%7*38,cy:60+Math.floor(e/7)*34,r:`3.2`,className:`sso-f-card`})]},e)),(0,a.jsxs)(`g`,{className:`sso-st`,style:l(5),children:[(0,a.jsx)(`rect`,{x:`0`,y:`192`,width:`264`,height:`38`,rx:`14`,className:`sso-f-card`}),(0,a.jsx)(`circle`,{cx:`20`,cy:`211`,r:`5`,className:`sso-f-tone`}),(0,a.jsx)(`text`,{x:`34`,y:`215.5`,className:`sso-t-b`,children:t[2]}),(0,a.jsx)(`text`,{x:`250`,y:`215.5`,textAnchor:`end`,className:`sso-t-s`,children:t[3]})]})]})}var p=30,m=7,h=9.6,g=Array.from({length:16},(e,t)=>`rgb(255,${Math.round(118+128*t/15)},${Math.round(84+152*t/15)})`);function _({asks:e,cta:t,sound:n,autoplay:r,area:o,jump:s=0,onSpeak:l,onSend:u}){let d=(0,i.useRef)(null),_=(0,i.useRef)(null),[v,y]=(0,i.useState)(0),[b,x]=(0,i.useState)(`type`),[S,C]=(0,i.useState)(e[0].say.length),[w,T]=(0,i.useState)(!1),[E,D]=(0,i.useState)(!0),[O,k]=(0,i.useState)(!1),[A,j]=(0,i.useState)(!1),M=c(n),N=e[v%e.length],P=N.say.length,F=w||b===`type`&&S<P&&E,I=(0,i.useRef)(-1e9),L=(0,i.useRef)(-1e9),R=(0,i.useRef)(!1),z=(0,i.useRef)(!1),B=(0,i.useRef)(-1e9);z.current=F,(0,i.useEffect)(()=>{let e=d.current;if(!e)return;let t=window.matchMedia(`(prefers-reduced-motion: reduce)`),n=()=>j(t.matches);n(),t.addEventListener(`change`,n);let r=new IntersectionObserver(([e])=>k(e.isIntersecting),{threshold:.05});return r.observe(e),()=>{t.removeEventListener(`change`,n),r.disconnect()}},[]),(0,i.useEffect)(()=>{if(!O)return;let e=r&&!A,t=0,n=(e,n)=>{t=window.setTimeout(e,n)};if(b===`type`){if(S<P)A?C(P):n(()=>{E||M(`key`),C(e=>Math.min(P,e+1))},E?46:34);else if(!w&&(e||R.current)){let e=Math.max(0,6e3-(performance.now()-I.current));n(()=>x(`send`),R.current?420:Math.max(620,e))}}else if(b===`send`)n(()=>x(`build`),A?0:380);else if(b===`build`)n(()=>{B.current=performance.now(),R.current&&M(`done`),x(`show`)},A?0:1650);else if(b===`show`){if(e){let e=Math.max(0,6e3-(performance.now()-I.current));n(()=>x(`clear`),Math.max(2100,e))}}else n(()=>{R.current=!1,y(e=>e+1),C(0),D(!0),x(`type`)},A?0:440);return()=>window.clearTimeout(t)},[O,r,A,b,S,P,w,E,M]);let V=(0,i.useCallback)(e=>{I.current=performance.now(),R.current=!0,D(e),y(e=>b===`type`&&S===0?e:e+1),C(0),x(`type`)},[b,S]),H=(0,i.useCallback)(()=>{I.current=performance.now(),R.current=!0,M(`send`),u?.(N.say),C(P),x(`send`)},[N.say,M,P,u]),U=(0,i.useCallback)(()=>{w||(M(`down`),l?.(),T(!0),V(!0))},[V,M,w,l]),W=(0,i.useCallback)(()=>{w&&(T(!1),H())},[w,H]),G=(0,i.useRef)(s);(0,i.useEffect)(()=>{s!==G.current&&(G.current=s,I.current=performance.now(),R.current=!0,T(!1),y(e=>e+1),C(1e6),x(`send`))},[s]),(0,i.useEffect)(()=>{C(e=>Math.min(e,P))},[P]),(0,i.useEffect)(()=>{let e=d.current,t=_.current;if(!e||!t)return;let n=t.getContext(`2d`);if(!n)return;t.width=Math.round(p*h*2),t.height=Math.round(m*h*2);let r=new Float32Array(p),i=new Float32Array(p),a=0,s=0,c=0,l=0,u=0,f=!1,v=0,y=0,b=e=>{let o=z.current;a+=(+!!o-a)*.16;let s=.3+.6*Math.abs(Math.sin(e*2.9)*Math.sin(e*1.3+.6)),c=(performance.now()-B.current)/1e3;n.clearRect(0,0,t.width,t.height);for(let t=0;t<p;t++){let l=o?s*Math.abs(Math.sin(e*6.1+t*.83)*Math.sin(e*2.3+t*.31))**.7:0;r[t]+=(l-r[t])*(l>r[t]?.5:.14),i[t]=Math.max(r[t],i[t]-.012);let u=r[t]*m,d=Math.min(6,Math.floor(i[t]*m));for(let r=0;r<m;r++){let o=(t+.5)*h*2,s=(r+.5)*h*2,l=6-r,f=t-29/2,p=(r-3)*1.6,m=Math.hypot(f,p),_=.3*Math.max(0,Math.sin(m*.62-e*1.7))**3,v=_+((l<u?.92:l===d&&i[t]>.08?.6:0)-_)*a;if(c<1.1){let e=Math.exp(-((m-c*20)**2)/5)*(1-c/1.1);v=Math.max(v,e)}n.globalAlpha=1-Math.min(.75,v*1.5),n.fillStyle=`rgba(48,0,0,.52)`,n.beginPath(),n.arc(o,s,5,0,6.2832),n.fill(),n.globalAlpha=1,n.strokeStyle=`rgba(255,255,255,.2)`,n.lineWidth=1.4,n.beginPath(),n.arc(o,s-.5,5.2,.5,2.64),n.stroke();let y=Math.min(1,Math.max(0,(v-.3)/.6));y>.01&&(n.fillStyle=g[Math.round(y*15)],n.globalAlpha=y*.24,n.beginPath(),n.arc(o,s,8.8,0,6.2832),n.fill(),n.globalAlpha=Math.min(1,y*1.6),n.beginPath(),n.arc(o,s,5,0,6.2832),n.fill())}}n.globalAlpha=1},x=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,S=t=>{if(v=requestAnimationFrame(S),t-y<15)return;y=t;let n=t/1e3;f||(l=.42*Math.sin(n*.52),u=.3*Math.sin(n*.37+1.1)),s+=(l-s)*.07,c+=(u-c)*.07,e.style.setProperty(`--sso-tx`,s.toFixed(3)),e.style.setProperty(`--sso-ty`,c.toFixed(3)),b(n)},C=o?.current??e,w=t=>{if(t.pointerType===`touch`)return;let n=e.getBoundingClientRect();f=!0,l=Math.max(-1,Math.min(1,(t.clientX-(n.left+n.width/2))/Math.max(n.width,260))),u=Math.max(-1,Math.min(1,(t.clientY-(n.top+n.height/2))/Math.max(n.height,260)))},T=()=>{f=!1};return x?b(.9):O?(C.addEventListener(`pointermove`,w),C.addEventListener(`pointerleave`,T),v=requestAnimationFrame(S)):b(.9),()=>{cancelAnimationFrame(v),C.removeEventListener(`pointermove`,w),C.removeEventListener(`pointerleave`,T)}},[O,o]);let K=b===`type`?F?`Listening`:S<P?`Typing`:`Tap to type`:b===`show`?`Built in 4 seconds`:b===`clear`?`Tap to type`:`Building`,q=F?`Listening`:b===`send`||b===`build`?`Building`:t,J=Math.min(S,P);return(0,a.jsxs)(`div`,{ref:d,className:`sso-fit`,"data-ph":b,"data-hear":F,"data-held":w,children:[(0,a.jsx)(`div`,{className:`sso-cast`,"aria-hidden":!0}),(0,a.jsx)(`div`,{className:`sso-tilt`,children:(0,a.jsxs)(`div`,{className:`sso-dev`,children:[(0,a.jsx)(`div`,{className:`sso-body`,"aria-hidden":!0}),(0,a.jsxs)(`button`,{type:`button`,className:`sso-scr`,"aria-label":`Screen. ${b===`show`||b===`build`?`An app for: ${N.say}`:N.say}. Press to type the next request.`,onClick:()=>{M(`key`),V(!1)},children:[(0,a.jsx)(`span`,{className:`sso-say`,"aria-hidden":!0,children:(0,a.jsxs)(`span`,{children:[N.say.slice(0,J),(0,a.jsx)(`i`,{className:`sso-caret`}),(0,a.jsx)(`span`,{className:`sso-rest`,children:N.say.slice(J)})]})}),(0,a.jsx)(f,{ask:N},v),(0,a.jsxs)(`span`,{className:`sso-tag`,"aria-hidden":!0,children:[(0,a.jsx)(`i`,{}),K]}),(0,a.jsx)(`span`,{className:`sso-glare`,"aria-hidden":!0})]}),(0,a.jsx)(`canvas`,{ref:_,className:`sso-grill`,"aria-hidden":!0}),(0,a.jsxs)(`div`,{className:`sso-keys`,children:[(0,a.jsx)(`button`,{type:`button`,className:`sso-key sso-key-a`,"aria-label":`Type the next request`,onClick:()=>{M(`key`),V(!1)},children:(0,a.jsxs)(`svg`,{viewBox:`0 0 20 20`,"aria-hidden":!0,children:[(0,a.jsx)(`rect`,{x:`2.5`,y:`5`,width:`15`,height:`10`,rx:`2.6`}),(0,a.jsx)(`path`,{d:`M6 8.4h.01M8.7 8.4h.01M11.3 8.4h.01M14 8.4h.01M7 11.6h6`})]})}),(0,a.jsxs)(`button`,{type:`button`,className:`sso-key sso-key-b`,"aria-pressed":w,onPointerDown:e=>{e.button===0&&(e.currentTarget.setPointerCapture(e.pointerId),U())},onPointerUp:W,onPointerCancel:W,onKeyDown:e=>{(e.key===` `||e.key===`Enter`)&&(e.preventDefault(),L.current=performance.now(),e.repeat||U())},onKeyUp:e=>{(e.key===` `||e.key===`Enter`)&&(L.current=performance.now(),W())},onBlur:W,onClick:e=>{e.detail===0&&!w&&performance.now()-L.current>700&&(M(`down`),V(!0))},children:[(0,a.jsxs)(`svg`,{viewBox:`0 0 20 20`,"aria-hidden":!0,children:[(0,a.jsx)(`rect`,{x:`7.2`,y:`2.6`,width:`5.6`,height:`9.4`,rx:`2.8`}),(0,a.jsx)(`path`,{d:`M4.6 9.6a5.4 5.4 0 0 0 10.8 0M10 15v2.4`})]}),(0,a.jsx)(`span`,{children:q})]}),(0,a.jsx)(`button`,{type:`button`,className:`sso-key sso-key-c`,"aria-label":b===`show`?`Clear the screen`:`Send the request`,onClick:()=>{b===`show`?(I.current=performance.now(),M(`send`),x(`clear`)):b===`type`&&H()},children:(0,a.jsx)(`svg`,{viewBox:`0 0 20 20`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M10 15.5v-11M5.4 9.1 10 4.5l4.6 4.6`})})})]})]})})]})}var v=[`Speak`,`Gallery`,`Your apps`],y=[`Examples`,`Pricing`,`What's new`,`Questions`,`Help`,`Privacy`,`Terms`];function b({brand:e=`Sayso`,line:t=`Say what you need.`,line2:n=`It builds the app.`,cta:r=`Hold to speak`,tone:s=`#ee2b1c`,set:c=`everyday`,sound:l=!0,autoplay:u=!0,onSpeak:d,onSend:f}){let p=(0,i.useRef)(null),[m,h]=(0,i.useState)(0),[g,b]=(0,i.useState)(0);return(0,i.useEffect)(()=>{let e=p.current;if(!e)return;let t=()=>{let t=e.clientWidth,n=e.clientHeight,r=Math.max(.55,Math.min(1.3,(n-300)/516,(t-80)/348));e.style.setProperty(`--sso-k`,r.toFixed(3))};t();let n=new ResizeObserver(t);return n.observe(e),()=>n.disconnect()},[]),(0,a.jsxs)(`div`,{ref:p,className:`sso-root`,style:{"--sso-tone":s},children:[(0,a.jsx)(`style`,{children:x}),(0,a.jsx)(`div`,{className:`sso-sun`,"aria-hidden":!0}),(0,a.jsxs)(`header`,{className:`sso-top`,children:[(0,a.jsxs)(`a`,{className:`sso-logo`,href:`#`,onClick:e=>e.preventDefault(),"aria-label":e,children:[(0,a.jsxs)(`svg`,{viewBox:`0 0 34 34`,"aria-hidden":!0,children:[(0,a.jsx)(`path`,{d:`M9 2h16a7 7 0 0 1 7 7v12a7 7 0 0 1-7 7H15.5L8 33v-5.3A7 7 0 0 1 2 20.8V9a7 7 0 0 1 7-7z`}),(0,a.jsx)(`rect`,{className:`sso-logo-b`,x:`9`,y:`12`,width:`3.6`,height:`7`,rx:`1.8`}),(0,a.jsx)(`rect`,{className:`sso-logo-b`,x:`15.2`,y:`8`,width:`3.6`,height:`15`,rx:`1.8`}),(0,a.jsx)(`rect`,{className:`sso-logo-b`,x:`21.4`,y:`11`,width:`3.6`,height:`9`,rx:`1.8`})]}),(0,a.jsx)(`span`,{children:e.toLowerCase()})]}),(0,a.jsxs)(`div`,{className:`sso-tabs`,role:`group`,"aria-label":`Sections`,style:{"--sso-at":m},children:[(0,a.jsx)(`i`,{className:`sso-thumb`,"aria-hidden":!0}),v.map((e,t)=>(0,a.jsx)(`button`,{type:`button`,"aria-pressed":m===t,onClick:()=>{h(t),t>0&&b(e=>e+1)},children:e},e))]}),(0,a.jsx)(`a`,{className:`sso-in`,href:`#`,onClick:e=>e.preventDefault(),children:`Sign in`})]}),(0,a.jsxs)(`main`,{className:`sso-mid`,children:[(0,a.jsxs)(`h1`,{className:`sso-line`,children:[t,` `,(0,a.jsx)(`span`,{children:n})]}),(0,a.jsx)(_,{asks:o[c]??o.everyday,cta:r,sound:l,autoplay:u,area:p,jump:g,onSpeak:d,onSend:f})]}),(0,a.jsx)(`nav`,{className:`sso-foot`,"aria-label":`More`,children:y.map(e=>(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:e},e))})]})}var x=`
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap');
.sso-root {
  --sso-tone: #ee2b1c;
  --sso-paper: #f0ebe4;
  --sso-ink: #1d1a19;
  --sso-k: 1.16;
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  background: var(--sso-paper);
  color: var(--sso-ink);
  font-family: "Inter Tight", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
/* window light across the paper: a soft band that drifts very slowly */
.sso-sun {
  position: absolute; z-index: 0; left: -22%; top: -40%; width: 78%; height: 170%;
  background: linear-gradient(96deg, rgba(255,255,255,0) 6%, rgba(255,253,248,.9) 34%, rgba(255,253,248,.78) 58%, rgba(255,255,255,0) 86%);
  transform: rotate(24deg); filter: blur(34px); pointer-events: none;
  animation: sso-sun 16s ease-in-out infinite alternate;
}
@keyframes sso-sun { from { translate: -2.5% 0; } to { translate: 4% 0; } }

.sso-top { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; padding: 34px 44px 0; }
.sso-logo { display: flex; align-items: center; gap: 9px; color: var(--sso-tone); text-decoration: none; font-size: 25px; font-weight: 700; letter-spacing: -.045em; line-height: 1; }
.sso-logo svg { width: 34px; height: 34px; fill: currentColor; }
.sso-logo .sso-logo-b { fill: var(--sso-paper); }
.sso-tabs {
  position: absolute; left: 50%; top: 34px; translate: -50% 0; display: grid; grid-template-columns: repeat(3, 1fr);
  padding: 4px; border-radius: 13px; background: rgba(29,26,25,.06); box-shadow: inset 0 1px 1.5px rgba(29,26,25,.08);
}
.sso-tabs button {
  position: relative; z-index: 1; font: inherit; font-size: 13px; font-weight: 600; letter-spacing: -.005em; white-space: nowrap;
  min-width: 78px; padding: 8px 14px; border: 0; border-radius: 10px; background: none; color: rgba(29,26,25,.62); cursor: pointer;
  transition: color .25s;
}
.sso-tabs button[aria-pressed="true"] { color: #fff; }
.sso-thumb {
  position: absolute; left: 4px; top: 4px; bottom: 4px; width: calc((100% - 8px) / 3); border-radius: 10px; background: var(--sso-tone);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 2px 5px -1px color-mix(in srgb, var(--sso-tone) 60%, transparent);
  transform: translateX(calc(var(--sso-at, 0) * 100%)); transition: transform .42s cubic-bezier(.3,1.35,.5,1);
}
.sso-in { font-size: 14px; font-weight: 600; color: var(--sso-ink); text-decoration: none; opacity: .72; padding: 8px 4px; transition: opacity .2s; }
.sso-in:hover { opacity: 1; }
.sso-root a:focus-visible, .sso-tabs button:focus-visible { outline: 2px solid var(--sso-tone); outline-offset: 3px; border-radius: 10px; }

.sso-mid { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; min-height: 0; padding: 8px 20px 0; }
.sso-line { margin: 0; font-size: 21px; font-weight: 600; letter-spacing: -.02em; line-height: 1.2; text-align: center; color: var(--sso-ink); }
.sso-line span { color: rgba(29,26,25,.42); }

.sso-foot { position: relative; z-index: 2; display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 34px; padding: 22px 24px 30px; }
.sso-foot a { font-size: 13px; font-weight: 500; color: rgba(29,26,25,.5); text-decoration: none; transition: color .2s; }
.sso-foot a:hover { color: var(--sso-ink); }

/* ---- the device ---- */
.sso-fit {
  position: relative; flex: none; width: calc(348px * var(--sso-k, 1)); height: calc(516px * var(--sso-k, 1));
  -webkit-tap-highlight-color: transparent;
}
/* its shadow on the paper slides away from the lean */
.sso-cast {
  position: absolute; left: 7%; right: 3%; top: 11%; bottom: -5%; border-radius: 24%;
  background: rgba(86,32,16,.42); filter: blur(calc(30px * var(--sso-k, 1)));
  transform: translate(calc(var(--sso-tx, 0) * -16px + 10px), calc(var(--sso-ty, 0) * -10px + 22px));
}
/* the perspective is in the transform itself (no preserve-3d): the type stays sharp while it leans */
.sso-tilt {
  position: absolute; inset: 0;
  transform: perspective(1500px) rotateX(calc(var(--sso-ty, 0) * -6deg)) rotateY(calc(var(--sso-tx, 0) * 8deg));
}
/* zoom, not a scale transform: the type and the hairlines stay sharp at any size */
.sso-dev { position: absolute; left: 0; top: 0; width: 348px; height: 516px; zoom: var(--sso-k, 1); }
/* the moulded body: a lit top-left edge, a shaded bottom-right one, and a side wall that shows as it leans */
.sso-body {
  position: absolute; inset: 0; border-radius: 46px; background: var(--sso-tone);
  --sso-wall: color-mix(in srgb, var(--sso-tone) 66%, #2a0500);
  box-shadow:
    inset 0 2px 1.5px rgba(255,255,255,.38),
    inset 2px 0 2px rgba(255,255,255,.16),
    inset 0 -4px 3px rgba(60,0,0,.26),
    inset -3px 0 3px rgba(60,0,0,.14),
    calc(var(--sso-tx, 0) * -2px) calc(2.5px + var(--sso-ty, 0) * 1px) 0 var(--sso-wall),
    calc(var(--sso-tx, 0) * -4px) calc(5px + var(--sso-ty, 0) * 2px) 0 var(--sso-wall),
    calc(var(--sso-tx, 0) * -6px) calc(7.5px + var(--sso-ty, 0) * 3px) 0 var(--sso-wall),
    0 18px 22px -10px rgba(86,32,16,.34);
}
.sso-body::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background:
    radial-gradient(70% 46% at calc(16% - var(--sso-tx, 0) * 26%) calc(2% - var(--sso-ty, 0) * 16%), rgba(255,255,255,.26), rgba(255,255,255,0) 70%),
    linear-gradient(158deg, rgba(255,255,255,.07), rgba(255,255,255,0) 40%, rgba(60,0,0,.17));
}
/* the screen: pale, set into the body */
.sso-scr {
  position: absolute; left: 22px; top: 22px; width: 304px; height: 316px; padding: 0; border: 0; border-radius: 30px;
  font: inherit; color: var(--sso-ink); text-align: center; cursor: text; overflow: hidden;
  background: linear-gradient(180deg, #f6f4f1, #f1eeea);
  box-shadow: inset 0 3px 8px rgba(50,10,0,.24), inset 0 0 0 1px rgba(50,10,0,.1), 0 1.5px 0 rgba(255,255,255,.3), 0 -1px 0 rgba(60,0,0,.2);
}
.sso-scr:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.sso-say {
  position: absolute; left: 22px; right: 22px; top: 26px; bottom: 54px; display: flex; align-items: center; justify-content: center;
  font-size: 25px; font-weight: 600; line-height: 1.14; letter-spacing: -.025em; color: #8a8580; text-wrap: balance;
  transition: opacity .3s ease, transform .5s cubic-bezier(.3,1.3,.5,1);
}
.sso-rest { opacity: 0; }
.sso-caret { display: inline-block; width: 2.5px; height: .92em; margin: 0 1px -0.1em 2px; border-radius: 2px; background: var(--sso-tone); animation: sso-blink 1s steps(2, jump-none) infinite; }
.sso-fit[data-hear="true"] .sso-caret { animation: none; }
@keyframes sso-blink { from { opacity: 1; } to { opacity: 0; } }
.sso-fit:not([data-ph="type"]) .sso-say { opacity: 0; transform: translateY(-16px) scale(.94); }
.sso-fit[data-ph="send"] .sso-say { transition-duration: .26s, .34s; transition-timing-function: ease-in, cubic-bezier(.5,0,.8,.4); }

.sso-app { position: absolute; left: 20px; top: 22px; width: 264px; height: 232px; overflow: visible; font-family: inherit; }
.sso-st { opacity: 0; transform: translateY(9px); transition: opacity .16s ease, transform .16s ease; }
.sso-fit[data-ph="build"] .sso-st, .sso-fit[data-ph="show"] .sso-st {
  opacity: 1; transform: none;
  transition: opacity .3s ease calc(var(--i) * 210ms + 120ms), transform .55s cubic-bezier(.3,1.45,.5,1) calc(var(--i) * 210ms + 120ms);
}
.sso-fit[data-ph="clear"] .sso-app { opacity: 0; transform: translateY(-10px); transition: opacity .3s ease, transform .4s ease; }
.sso-l-ring { fill: none; stroke: var(--sso-tone); stroke-width: 13; stroke-linecap: round; stroke-dasharray: 364.42; stroke-dashoffset: 364.42; opacity: 0; transition: opacity .1s; }
.sso-fit[data-ph="build"] .sso-l-ring, .sso-fit[data-ph="show"] .sso-l-ring {
  stroke-dashoffset: var(--off); opacity: 1;
  transition: stroke-dashoffset .9s cubic-bezier(.3,.9,.3,1) calc(var(--i) * 210ms + 120ms), opacity .1s calc(var(--i) * 210ms + 120ms);
}
.sso-tk { opacity: 0; transform: scale(.4); transform-box: fill-box; transform-origin: center; transition: opacity .12s, transform .12s; }
.sso-fit[data-ph="show"] .sso-tk { opacity: 1; transform: none; transition: opacity .16s calc(var(--j) * 380ms + 320ms), transform .42s cubic-bezier(.3,1.6,.5,1) calc(var(--j) * 380ms + 320ms); }
.sso-bar { transform: scaleX(0); transform-box: fill-box; transform-origin: left center; transition: transform .12s; }
.sso-fit[data-ph="show"] .sso-bar { transform: none; transition: transform .6s cubic-bezier(.3,1,.4,1) calc(var(--j) * 380ms + 320ms); }
.sso-f-card { fill: #fff; }
.sso-f-tone { fill: var(--sso-tone); }
.sso-f-ink { fill: #1d1a19; }
.sso-f-mid { fill: #8a8580; }
.sso-f-soft { fill: #d6d0c8; }
.sso-f-off { fill: #e4dfd8; }
.sso-f-line { fill: rgba(29,26,25,.1); }
.sso-f-box { fill: #fff; stroke: #cfc8bf; stroke-width: 1.5; }
.sso-l-track { fill: none; stroke: #e4dfd8; stroke-width: 13; }
.sso-l-check { fill: none; stroke: #fff; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.sso-l-off { stroke: #a9a39c; stroke-width: 1.3; }
.sso-t-b { font-size: 13.5px; font-weight: 600; letter-spacing: -.01em; fill: #1d1a19; font-variant-numeric: tabular-nums; }
.sso-t-m { font-size: 14px; font-weight: 500; letter-spacing: -.01em; fill: #1d1a19; font-variant-numeric: tabular-nums; }
.sso-t-s { font-size: 11.5px; font-weight: 500; fill: #8a8580; }
.sso-t-off { fill: #a9a39c; }
.sso-t-x { font: 500 9px "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; fill: #a09a93; }
.sso-t-big { font-size: 38px; font-weight: 700; letter-spacing: -.04em; fill: #1d1a19; font-variant-numeric: tabular-nums; }
.sso-t-w { font-size: 12px; font-weight: 600; fill: #fff; }
.sso-t-i { font-size: 12px; font-weight: 700; fill: #fff; }
.sso-t-ink { fill: #1d1a19; }

.sso-tag {
  position: absolute; left: 0; right: 0; bottom: 19px; display: flex; align-items: center; justify-content: center; gap: 7px;
  font: 500 9.5px "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace; letter-spacing: .16em; text-transform: uppercase; color: #a09a93;
}
.sso-tag i { width: 5px; height: 5px; border-radius: 50%; background: #c9c3bb; transition: background .2s, box-shadow .2s; }
.sso-fit[data-hear="true"] .sso-tag i { background: var(--sso-tone); box-shadow: 0 0 0 3px color-mix(in srgb, var(--sso-tone) 22%, transparent); }
.sso-fit[data-ph="build"] .sso-tag i { background: #1d1a19; animation: sso-blink .5s steps(2, jump-none) infinite; }
.sso-fit[data-ph="show"] .sso-tag i { background: #28a45a; }
.sso-glare {
  position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: linear-gradient(118deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.5) 44%, rgba(255,255,255,0) 58%);
  opacity: .5; transform: translateX(calc(var(--sso-tx, 0) * -34%));
}
/* the grill: 30×7 punched holes, drawn on a canvas */
.sso-grill { position: absolute; left: 30px; top: 352px; width: 288px; height: 67.2px; display: block; }
/* the keys: each sits on its own shadow and goes down when pressed */
.sso-keys { position: absolute; left: 22px; right: 22px; top: 440px; height: 52px; display: flex; gap: 8px; }
.sso-key {
  position: relative; flex: none; display: grid; place-items: center; height: 50px; padding: 0; border: 0; border-radius: 15px; font: inherit; cursor: pointer;
  box-shadow: 0 4px 0 rgba(60,0,0,.36), 0 6px 8px rgba(60,0,0,.24), inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1.5px 0 rgba(29,26,25,.1);
  transition: transform .1s ease-out, box-shadow .1s ease-out; touch-action: none; user-select: none; -webkit-user-select: none;
}
.sso-key svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.sso-key:active, .sso-fit[data-hear="true"] .sso-key-b, .sso-fit[data-ph="send"] .sso-key-c {
  transform: translateY(3.5px);
  box-shadow: 0 .5px 0 rgba(60,0,0,.36), 0 1px 2px rgba(60,0,0,.24), inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1.5px 0 rgba(29,26,25,.1);
}
.sso-key:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.sso-key-a { width: 46px; background: #f3f0ec; color: #5d5853; }
.sso-key-b { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #fbfaf8; color: var(--sso-ink); font-size: 15px; font-weight: 600; letter-spacing: -.01em; }
.sso-key-b svg { width: 18px; height: 18px; transition: color .15s; }
.sso-fit[data-hear="true"] .sso-key-b svg { color: var(--sso-tone); }
.sso-key-c { width: 50px; background: #2b2221; color: #fff; box-shadow: 0 4px 0 rgba(30,0,0,.5), 0 6px 8px rgba(60,0,0,.26), inset 0 1px 0 rgba(255,255,255,.22); }
.sso-key-c:active, .sso-fit[data-ph="send"] .sso-key-c { box-shadow: 0 .5px 0 rgba(30,0,0,.5), 0 1px 2px rgba(60,0,0,.26), inset 0 1px 0 rgba(255,255,255,.22); }
@media (prefers-reduced-motion: reduce) {
  .sso-caret, .sso-tag i { animation: none !important; }
  .sso-say, .sso-st, .sso-tk, .sso-bar, .sso-l-ring, .sso-app, .sso-key { transition-duration: 1ms !important; transition-delay: 0s !important; }
  .sso-tilt, .sso-glare { transform: none; }
  .sso-cast { transform: translate(10px, 22px); }
}
/* ---- end of the device ---- */

@container (max-width: 900px) {
  .sso-foot { gap: 6px 24px; }
}
@container (max-width: 640px) {
  .sso-root { --sso-k: .86; }
  .sso-top { padding: 22px 20px 0; }
  .sso-logo { font-size: 22px; gap: 8px; }
  .sso-logo svg { width: 30px; height: 30px; }
  .sso-tabs { top: 76px; }
  .sso-mid { gap: 24px; padding-top: 62px; }
  .sso-line { font-size: 19px; }
  .sso-line span { display: block; }
  .sso-foot { gap: 6px 22px; padding: 14px 20px 26px; }
  .sso-foot a:nth-child(n + 5) { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sso-sun { animation: none !important; }
  .sso-thumb { transition-duration: 1ms !important; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(b,{})}));