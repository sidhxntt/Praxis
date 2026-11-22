import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o={"#ff2a1f":0,"#ff2d8a":-38,"#ff8a1f":26,"#2f6bff":222},s={0:[`.####.`,`#....#`,`#....#`,`#....#`,`#....#`,`#....#`,`#....#`,`#....#`,`.####.`],1:[`...#..`,`..##..`,`...#..`,`...#..`,`...#..`,`...#..`,`...#..`,`...#..`,`.#####`],2:[`.####.`,`#....#`,`.....#`,`.....#`,`....#.`,`...#..`,`..#...`,`.#....`,`######`],3:[`.####.`,`#....#`,`.....#`,`.....#`,`..###.`,`.....#`,`.....#`,`#....#`,`.####.`],4:[`....#.`,`...##.`,`..#.#.`,`.#..#.`,`#...#.`,`######`,`....#.`,`....#.`,`....#.`],5:[`######`,`#.....`,`#.....`,`#####.`,`.....#`,`.....#`,`.....#`,`#....#`,`.####.`],6:[`..###.`,`.#....`,`#.....`,`#.....`,`#####.`,`#....#`,`#....#`,`#....#`,`.####.`],7:[`######`,`.....#`,`.....#`,`....#.`,`....#.`,`...#..`,`...#..`,`..#...`,`..#...`],8:[`.####.`,`#....#`,`#....#`,`#....#`,`.####.`,`#....#`,`#....#`,`#....#`,`.####.`],9:[`.####.`,`#....#`,`#....#`,`#....#`,`.#####`,`.....#`,`.....#`,`....#.`,`.###..`],"°":[`.##.`,`#..#`,`#..#`,`.##.`],"%":[`##...#`,`##..#.`,`....#.`,`...#..`,`...#..`,`..#...`,`.#....`,`.#..##`,`#...##`],"+":[`......`,`......`,`..#...`,`..#...`,`#####.`,`..#...`,`..#...`,`......`,`......`],":":[`..`,`..`,`##`,`##`,`..`,`..`,`##`,`##`,`..`],".":[`..`,`..`,`..`,`..`,`..`,`..`,`..`,`##`,`##`]," ":[`...`,`...`,`...`,`...`,`...`,`...`,`...`,`...`,`...`]},c=e=>Math.round(e*10)/10;function l(e,t){let n=``,r=0;for(let i of e){let e=s[i]??s[` `];e.forEach((e,i)=>{for(let a=0;a<e.length;a++)e[a]===`#`&&(n+=`M${c(r+a*t+t/2)} ${c(i*t+t/2)}h.01`)}),r+=e[0].length*t+t*1.3}return{d:n,w:c(r-t*1.3),h:c(9*t)}}function u({text:e,pitch:t=3.9}){let{d:n,w:r,h:i}=l(e,t);return(0,a.jsx)(`svg`,{className:`vsp-dots`,width:r,height:i,viewBox:`0 0 ${r} ${i}`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:n,strokeWidth:c(t*.8)})},e)}var d=[{id:`calm`,x:812,y:304,s:1,d:.16,z:2,ph:.4},{id:`sleep`,x:1006,y:304,s:1,d:.16,z:2,ph:2.2,p:[28,606,.8]},{id:`mood`,x:812,y:532,s:1,d:.16,z:2,ph:4.1},{id:`move`,x:1006,y:532,s:1,d:.16,z:2,ph:5.3,p:[216,470,.8]},{id:`day`,x:246,y:744,s:1,d:.42,z:3,ph:1.3},{id:`light`,x:300,y:34,s:1.16,d:.55,z:3,ph:3.3,p:[216,290,.8]},{id:`meet`,x:1e3,y:78,s:1,d:.5,z:3,ph:.9},{id:`air`,x:86,y:172,s:1.06,d:1,z:4,ph:2.7,p:[28,420,.8]},{id:`focus`,x:806,y:62,s:.98,d:.86,z:5,ph:5.9},{id:`dial`,x:40,y:512,s:1.04,d:.92,z:4,ph:4.6},{id:`mix`,x:606,y:646,s:1.04,d:1,z:5,ph:1.8,p:[216,650,.8]},{id:`plate`,x:1176,y:214,s:1,d:.95,z:5,ph:3.9},{id:`app`,x:1200,y:668,s:1,d:.78,z:4,ph:.2}],f=[`air`,`sleep`,`focus`,`move`,`light`,`mix`,`meet`,`calm`,`dial`,`mood`,`plate`,`day`,`app`],ee=[[`19°`,`Clear`],[`21°`,`Warm`],[`17°`,`Breezy`]],te=[[`Neutral`,`4,200 K`,`#a8f08c`],[`Daylight`,`5,600 K`,`#cfe6ff`],[`Candle`,`2,900 K`,`#ffd27a`]],ne=[[`2.4`,`Deep work`],[`3.1`,`In flow`],[`1.8`,`Scattered`]],re=[[`14:30`,`Design review`],[`16:00`,`Call with Ines`],[`09:15`,`Stand-up`]],ie=[[`62`,`Even`],[`58`,`Slow`],[`66`,`Quick`]],ae=[[81,`7 h 12`],[74,`6 h 40`],[88,`7 h 50`]],oe=[[`+4`,`Bright`],[`+7`,`Lifted`],[`+2`,`Level`]],se=[[`40`,`Steady`,18],[`55`,`Shifting`,62],[`28`,`Flat`,-34]],ce=[[75,`Mostly daylight`],[58,`Half and half`],[84,`A day outside`]],le=[[`93%`,`An even day`],[`88%`,`A long morning`],[`96%`,`Right on rhythm`]],ue=[`Clock`,`Signal`,`Spark`,`Orbit`],de=[`#7df0c8`,`#f2c14a`,`#ff5a2a`,`#7a6bff`],p=158,m=28,h=e=>Math.min(1,.22+e/p*1.25),g=(e,t)=>Math.sin(e/p*Math.PI*2.7-t)*12*h(e),fe=(e,t)=>Math.sin(e/p*Math.PI*2.7-t+Math.PI*.84)*9*h(e),_=(e,t)=>{let n=``;for(let r=0;r<=p;r+=3)n+=`${r?`L`:`M`}${r} ${(m+e(r,t)).toFixed(2)}`;return n},v=.72,pe=[[78,104,7.5,.3],[96,118,9,1.9],[112,100,5,3.1],[70,126,4.5,4.4],[104,138,6.5,5.2],[124,124,4,.9],[86,146,3.5,2.6],[58,108,3,3.8],[132,144,3,1.2],[118,84,3.5,5.7],[66,150,2.5,2.2],[140,106,2.5,4.9],[92,86,2.5,.6]],y=e=>Math.round(e*100)/100,me=Array.from({length:25},(e,t)=>({h:y(5+34*Math.exp(-((t-12)*(t-12))/26)),d:y(.5+t*37%11*.06),delay:y(-(t*53%17)*.09),warm:Math.abs(t-12)<3})),he=y(2*Math.PI*44),b=(e,t,n)=>{let r=Math.cos(e*Math.PI/180),i=Math.sin(e*Math.PI/180);return`M${y(91+r*t)} ${y(120+i*t)}L${y(91+r*n)} ${y(120+i*n)}`},ge=Array.from({length:60},(e,t)=>b(t*6,47,52)).join(``),_e=Array.from({length:9},(e,t)=>b(-90+(t-4)*4.4,44-(4-Math.abs(t-4))*.6,57+(4-Math.abs(t-4))*1.1)).join(``),ve=Array.from({length:18},(e,t)=>{let n=Math.cos(t*20*Math.PI/180),r=Math.sin(t*20*Math.PI/180);return`M${y(30+n*25)} ${y(30+r*25)}L${y(30+n*27.5)} ${y(30+r*27.5)}`}).join(``),ye=Array.from({length:13},(e,t)=>y(6+38*Math.sqrt(Math.max(0,1-((t-6)/6.4)**2))));function be(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(n=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let r=navigator.userActivation;if(!(r&&!r.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let r=t.current??=new e;r.state===`suspended`&&r.resume();for(let e of n){let t=r.currentTime+(e.at??0),n=Math.min(e.d??.035,.06),i=r.createGain();i.gain.setValueAtTime(1e-4,t),i.gain.exponentialRampToValueAtTime(Math.min(e.g??.035,.06),t+.003),i.gain.exponentialRampToValueAtTime(1e-4,t+n),i.connect(r.destination);let a=r.createOscillator();a.type=e.type??`sine`,a.frequency.setValueAtTime(e.f,t),e.to&&a.frequency.exponentialRampToValueAtTime(e.to,t+n),a.connect(i),a.start(t),a.stop(t+n+.01)}}catch{}},[e])}function x({brand:e=`Vesper`,line:t=`Vesper reads
your day.`,cta:n=`Get early access`,figure:r=`/design/websites/vesper/figure.webp`,light:s=`#ff2a1f`,depth:c=1,sound:l=!0,onCta:h}){let b=(0,i.useRef)(null),x=(0,i.useRef)(null),w=be(l),[T,Se]=(0,i.useState)(!0),[E,Ce]=(0,i.useState)(!1),[D,we]=(0,i.useState)({}),[Te,O]=(0,i.useState)(null),[k,A]=(0,i.useState)(null),[Ee,j]=(0,i.useState)(null),[M,N]=(0,i.useState)(-1),P=(0,i.useRef)(-1e9),F=(0,i.useRef)({x:0,y:0,at:-1e9}),I=(0,i.useRef)({mx:0,my:0,phase:.9,boost:0,kick:0,small:!1}),L=(0,i.useRef)({}),R=(0,i.useCallback)((e,t,n)=>{clearTimeout(L.current[e]),L.current[e]=setTimeout(n,t)},[]);(0,i.useEffect)(()=>{let e=L.current;return()=>Object.values(e).forEach(clearTimeout)},[]),(0,i.useEffect)(()=>{let e=b.current;if(!e)return;let t=()=>{let t=e.clientWidth,n=e.clientHeight,r=I.current.small=t<700;x.current?.style.setProperty(`--vsp-k`,String(Math.round(Math.min(t/(r?390:1440),n/(r?844:900))*1e4)/1e4))};t();let n=new ResizeObserver(t);n.observe(e);let r=new IntersectionObserver(([e])=>Se(e.isIntersecting));r.observe(e);let i=window.matchMedia(`(prefers-reduced-motion: reduce)`),a=()=>Ce(i.matches);return a(),i.addEventListener(`change`,a),()=>{n.disconnect(),r.disconnect(),i.removeEventListener(`change`,a)}},[]);let De=(0,i.useRef)({}),Oe=(0,i.useRef)({}),z=(0,i.useRef)(null),B=(0,i.useRef)(null),ke=(0,i.useRef)(null),Ae=(0,i.useRef)(null),je=(0,i.useRef)(null),Me=(0,i.useRef)([]);(0,i.useEffect)(()=>{let e=I.current,t=Math.max(0,Math.min(2.5,c)),n=(n,r)=>{let i=t*(e.small?.34:1);for(let t of d){let a=De.current[t.id];if(!a)continue;let o=r?0:Math.sin(n*(.34+t.ph*.03)+t.ph)*5*t.d,s=r?0:Math.cos(n*(.42+t.ph*.025)+t.ph*1.7)*7*t.d,c=e.mx*t.d*30*i+o,l=e.my*t.d*22*i+s;a.style.transform=`translate3d(${c.toFixed(2)}px, ${l.toFixed(2)}px, 0)`;let u=Oe.current[t.id];u&&(u.style.transform=`translate3d(${(-e.mx*t.d*16*i-o*.6).toFixed(2)}px, ${(10+t.d*20-e.my*t.d*12*i-s*.8).toFixed(2)}px, 0)`)}z.current&&(z.current.style.transform=`translate3d(${(e.mx*3*i).toFixed(2)}px, ${(e.my*2*i).toFixed(2)}px, 0)`),B.current&&(B.current.style.transform=`translate3d(${(e.mx*9*i).toFixed(2)}px, ${(e.my*5*i).toFixed(2)}px, 0)`),ke.current?.setAttribute(`d`,_(g,e.phase)),Ae.current?.setAttribute(`d`,_(fe,e.phase)),je.current?.setAttribute(`transform`,`translate(${p*v} ${(m+g(p*v,e.phase)-3).toFixed(2)})`),pe.forEach(([t,i,a,o],s)=>{let c=Me.current[s];if(!c)return;let l=Math.atan2(i-122,t-96)+Math.sin(o*7)*.5,u=e.kick*(26+20*Math.abs(Math.sin(o*3))),d=t+(r?0:Math.sin(n*.7+o)*4.5)+Math.cos(l)*u,f=i+(r?0:Math.cos(n*.55+o*1.7)*4.5)+Math.sin(l)*u;c.style.transform=`translate3d(${(d-a).toFixed(2)}px, ${(f-a).toFixed(2)}px, 0) scale(${(1+(r?0:.14*Math.sin(n*1.3+o))).toFixed(3)})`})};if(!T||E){e.mx=e.my=e.kick=0,n(0,!0);return}let r=0,i=performance.now(),a=t=>{let o=Math.min(.05,(t-i)/1e3);i=t;let s=t/1e3,c=t-F.current.at<2600,l=c?F.current.x:Math.sin(s*.52)*.9+Math.sin(s*.23+1)*.22,u=c?F.current.y:Math.cos(s*.41)*.75,d=1-Math.exp(-o*(c?6:2.4));e.mx+=(l-e.mx)*d,e.my+=(u-e.my)*d,e.boost*=Math.exp(-o*1.7),e.kick*=Math.exp(-o*2.6),e.phase+=o*(1.05+e.boost*8),n(s,!1),r=requestAnimationFrame(a)};return r=requestAnimationFrame(a),()=>cancelAnimationFrame(r)},[T,E,c]);let V=(0,i.useCallback)((e,t=!1)=>{we(t=>({...t,[e]:(t[e]??0)+1})),e===`calm`&&(I.current.boost=1),e===`move`&&(I.current.kick=1),e===`plate`&&(N(e=>(e+1+4)%4),R(`icon`,1500,()=>N(-1))),!t&&w([{f:190,to:130,d:.03,g:.05,type:`triangle`},{f:620,to:940,d:.05,g:.022,at:.03}])},[w,R]),Ne=e=>{j(e),R(`dip`,160,()=>j(null)),V(e)};(0,i.useEffect)(()=>{if(!T||E)return;let e=0,t=()=>{if(performance.now()-P.current<6e3)return;let t=f[e++%f.length];O(t),R(`auto-read`,620,()=>V(t,!0)),R(`auto-back`,1750,()=>O(null))},n=setTimeout(t,1200),r=setInterval(t,2500);return()=>{clearTimeout(n),clearInterval(r),O(null)}},[T,E,V,R]);let H=(e,t)=>(D[e]??0)%t,Pe=e=>k?k===e:Te===e,Fe=o[s.toLowerCase()]??0,U=(e,t,n,r=``)=>{let i=d.find(t=>t.id===e);return(0,a.jsxs)(`div`,{ref:t=>{De.current[e]=t},className:`vsp-f vsp-f-${e} ${r}`,"data-fwd":Pe(e),"data-phone":!!i.p,style:{"--dx":i.x,"--dy":i.y,"--ds":i.s,"--px":i.p?.[0]??0,"--py":i.p?.[1]??0,"--ps":i.p?.[2]??1,"--z":i.z,"--dd":i.d},children:[i.d>.3?(0,a.jsx)(`span`,{className:`vsp-sh`,ref:t=>{Oe.current[e]=t},"aria-hidden":!0}):null,(0,a.jsx)(`button`,{type:`button`,className:`vsp-tile`,"data-dip":Ee===e,"aria-label":t,onClick:()=>Ne(e),onPointerEnter:t=>t.pointerType===`mouse`&&A(e),onPointerLeave:()=>A(t=>t===e?null:t),children:(0,a.jsx)(`span`,{className:`vsp-in vsp-${e}`,children:n})})]},e)},W=ee[H(`air`,3)],G=te[H(`light`,3)],K=ne[H(`focus`,3)],q=re[H(`meet`,3)],J=ie[H(`calm`,3)],Y=ae[H(`sleep`,3)],X=oe[H(`mood`,3)],Z=se[H(`dial`,3)],Q=ce[H(`mix`,3)],$=le[H(`day`,3)];return(0,a.jsxs)(`div`,{ref:b,className:`vsp-root`,"data-live":T,style:{"--vsp-light":s,"--vsp-hue":`${Fe}deg`},onPointerMove:e=>{let t=e.currentTarget.getBoundingClientRect();F.current={x:Math.max(-1,Math.min(1,(e.clientX-t.left)/t.width*2-1)),y:Math.max(-1,Math.min(1,(e.clientY-t.top)/t.height*2-1)),at:performance.now()}},onPointerLeave:()=>{F.current.at=-1e9,A(null)},onPointerDownCapture:()=>P.current=performance.now(),onKeyDownCapture:()=>P.current=performance.now(),children:[(0,a.jsx)(`style`,{children:xe}),(0,a.jsxs)(`div`,{ref:x,className:`vsp-board`,children:[(0,a.jsxs)(`nav`,{className:`vsp-nav`,"aria-label":`Vesper`,children:[(0,a.jsxs)(`a`,{className:`vsp-brand`,href:`#top`,onClick:e=>e.preventDefault(),children:[e,` `,(0,a.jsx)(`span`,{children:`beta`})]}),(0,a.jsxs)(`span`,{className:`vsp-links`,children:[(0,a.jsx)(`a`,{href:`#tiles`,onClick:e=>e.preventDefault(),children:`Tiles`}),(0,a.jsx)(`a`,{href:`#sources`,onClick:e=>e.preventDefault(),children:`Sources`}),(0,a.jsx)(`a`,{href:`#privacy`,onClick:e=>e.preventDefault(),children:`Privacy`}),(0,a.jsx)(`a`,{className:`vsp-in-link`,href:`#signin`,onClick:e=>e.preventDefault(),children:`Sign in`})]})]}),(0,a.jsxs)(`div`,{ref:z,className:`vsp-stage`,children:[(0,a.jsx)(`span`,{className:`vsp-glow`,"aria-hidden":!0}),(0,a.jsx)(`img`,{ref:B,className:`vsp-person`,src:r,alt:``,draggable:!1}),(0,a.jsx)(`span`,{className:`vsp-veil`,"aria-hidden":!0}),(0,a.jsxs)(`span`,{className:`vsp-tabs`,"aria-hidden":!0,children:[(0,a.jsx)(`b`,{children:`Today`}),(0,a.jsx)(`span`,{children:`Week`}),(0,a.jsx)(`span`,{children:`Sources`}),(0,a.jsx)(`span`,{children:`Notes`})]}),(0,a.jsxs)(`div`,{className:`vsp-copy`,children:[(0,a.jsxs)(`p`,{className:`vsp-kick`,children:[(0,a.jsx)(`i`,{"aria-hidden":!0}),`Reading 13 signals`]}),(0,a.jsx)(`h1`,{children:t.split(`
`).map((e,t)=>(0,a.jsx)(`span`,{children:e},t))}),(0,a.jsx)(`p`,{className:`vsp-sub`,children:`Light, sleep, focus and meetings, as live tiles on your desk.`}),(0,a.jsxs)(`button`,{type:`button`,className:`vsp-cta`,onClick:h,children:[n,(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,width:`15`,height:`15`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M3 8h9.5M8.5 3.8 12.7 8l-4.2 4.2`})})]})]})]}),U(`calm`,`Steadiness of the heart, ${J[0]}. Read it again`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:3}),(0,a.jsx)(S,{a:`Steadiness`,b:`Heart, at rest`}),(0,a.jsx)(`span`,{className:`vsp-read`,children:(0,a.jsx)(u,{text:J[0]})}),(0,a.jsxs)(`span`,{className:`vsp-wave`,"aria-hidden":!0,children:[(0,a.jsxs)(`svg`,{className:`vsp-wave-fade`,viewBox:`0 0 ${p} 56`,width:p,height:`56`,children:[(0,a.jsx)(`path`,{className:`vsp-wave-line`,d:`M0 ${m}H${p}`}),(0,a.jsx)(`path`,{className:`vsp-wave-b`,ref:Ae,d:_(fe,.9)}),(0,a.jsx)(`path`,{className:`vsp-wave-a`,ref:ke,d:_(g,.9)})]}),(0,a.jsx)(`svg`,{viewBox:`0 0 ${p} 56`,width:p,height:`56`,children:(0,a.jsx)(`g`,{ref:je,transform:`translate(${p*v} ${(m+g(p*v,.9)-3).toFixed(2)})`,children:(0,a.jsx)(`path`,{className:`vsp-wave-mark`,d:`M-4.5 -7.5h9L0 0Z`})})})]}),(0,a.jsx)(`span`,{className:`vsp-word`,children:J[1]})]})),U(`sleep`,`Sleep last night, ${Y[0]} percent. Read it again`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:3}),(0,a.jsx)(S,{a:`Sleep`,b:`Last night`}),(0,a.jsxs)(`svg`,{className:`vsp-ring`,viewBox:`0 0 182 218`,width:`182`,height:`218`,"aria-hidden":!0,children:[(0,a.jsx)(`circle`,{className:`vsp-ring-track`,cx:`91`,cy:`116`,r:`44`}),(0,a.jsx)(`circle`,{className:`vsp-ring-arc`,cx:`91`,cy:`116`,r:`44`,transform:`rotate(-90 91 116)`,strokeDasharray:he,strokeDashoffset:y(he*(1-Y[0]/100))}),(0,a.jsx)(`path`,{className:`vsp-ring-leaf`,d:`M44 92C74 44 136 42 164 88C132 64 80 62 44 92Z`})]}),(0,a.jsxs)(`span`,{className:`vsp-read vsp-read-ring`,children:[(0,a.jsx)(u,{text:String(Y[0]),pitch:3.3}),(0,a.jsx)(`sup`,{children:`%`})]}),(0,a.jsx)(`span`,{className:`vsp-word`,children:Y[1]})]})),U(`mood`,`Mood, ${X[0]}. Read it again`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:2}),(0,a.jsx)(S,{a:`Mood`,b:`Lift since noon`}),(0,a.jsx)(`span`,{className:`vsp-read`,children:(0,a.jsx)(u,{text:X[0]})}),(0,a.jsx)(`span`,{className:`vsp-bars`,"aria-hidden":!0,children:me.map((e,t)=>(0,a.jsx)(`i`,{"data-warm":e.warm,style:{height:e.h,animationDuration:`${e.d}s`,animationDelay:`${e.delay}s`}},t))}),(0,a.jsx)(`span`,{className:`vsp-word`,children:X[1]})]})),U(`move`,`Movement by the hour. Shake it`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:2}),(0,a.jsx)(S,{a:`Movement`,b:`By the hour`}),(0,a.jsx)(`span`,{className:`vsp-cross`,"aria-hidden":!0}),(0,a.jsx)(`span`,{className:`vsp-plot`,"aria-hidden":!0,children:pe.map(([e,t,n],r)=>(0,a.jsx)(`i`,{ref:e=>{Me.current[r]=e},style:{width:n*2,height:n*2,transform:`translate3d(${e-n}px, ${t-n}px, 0)`,opacity:n<3?.55:1}},r))}),(0,a.jsxs)(`span`,{className:`vsp-word vsp-ends`,children:[(0,a.jsx)(`span`,{children:`Early`}),(0,a.jsx)(`span`,{children:`Late`})]})]})),U(`day`,`The whole day, ${$[0]}. Read it again`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:2}),(0,a.jsx)(S,{a:`Whole day`,b:`All tiles`}),(0,a.jsx)(`span`,{className:`vsp-read vsp-read-day`,children:(0,a.jsx)(u,{text:$[0],pitch:3.5})}),(0,a.jsx)(`span`,{className:`vsp-lens`,"aria-hidden":!0,children:ye.map((e,t)=>(0,a.jsx)(`i`,{style:{width:e}},t))}),(0,a.jsx)(`svg`,{className:`vsp-lens-mark`,viewBox:`0 0 9 12`,width:`9`,height:`12`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M8.4 .8 .6 6l7.8 5.2Z`})}),(0,a.jsx)(`span`,{className:`vsp-word`,children:$[1]})]}),`vsp-wide`),U(`light`,`Room light, ${G[0]}, ${G[1]}. Read it again`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:2}),(0,a.jsx)(S,{a:`Room light`,b:`Colour`}),(0,a.jsxs)(`span`,{className:`vsp-ride`,"aria-hidden":!0,style:{"--vsp-sun":G[2]},children:[(0,a.jsxs)(`svg`,{className:`vsp-sun`,viewBox:`0 0 60 60`,width:`60`,height:`60`,children:[(0,a.jsx)(`path`,{d:ve}),(0,a.jsx)(`circle`,{cx:`30`,cy:`30`,r:`19`})]}),(0,a.jsx)(`i`,{className:`vsp-stem`}),(0,a.jsx)(`svg`,{className:`vsp-tri`,viewBox:`0 0 12 9`,width:`12`,height:`9`,children:(0,a.jsx)(`path`,{d:`M6 .6 11.2 8.4H.8Z`})})]}),(0,a.jsx)(`span`,{className:`vsp-rule vsp-rule-cool`,"aria-hidden":!0}),(0,a.jsxs)(`span`,{className:`vsp-word`,children:[G[0],` `,(0,a.jsx)(`em`,{children:G[1]})]})]})),U(`meet`,`Next meeting, ${q[1]} at ${q[0]}. Show the one after`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:2}),(0,a.jsx)(S,{a:`Meetings`,b:`Next: ${q[1]}`}),(0,a.jsx)(`span`,{className:`vsp-dotring`,"aria-hidden":!0}),(0,a.jsx)(`span`,{className:`vsp-read vsp-read-meet`,children:(0,a.jsx)(u,{text:q[0],pitch:3.5})}),(0,a.jsxs)(`span`,{className:`vsp-tall`,"aria-hidden":!0,children:[(0,a.jsx)(`i`,{}),(0,a.jsx)(`i`,{}),(0,a.jsx)(`i`,{}),(0,a.jsx)(`i`,{})]})]})),U(`air`,`Outside, ${W[0]}, ${W[1]}. Read it again`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:2}),(0,a.jsx)(S,{a:`Outside`,b:`Right now`}),(0,a.jsx)(`span`,{className:`vsp-read`,children:(0,a.jsx)(u,{text:W[0]})}),(0,a.jsx)(`span`,{className:`vsp-rule`,"aria-hidden":!0,children:(0,a.jsx)(`i`,{className:`vsp-needle`})}),(0,a.jsx)(`span`,{className:`vsp-word`,children:W[1]})]})),U(`focus`,`Focus score, ${K[0]}, ${K[1]}. Read it again`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:2}),(0,a.jsx)(S,{a:`Focus`,b:`Score today`}),(0,a.jsxs)(`span`,{className:`vsp-pips`,"aria-hidden":!0,children:[(0,a.jsx)(`i`,{}),(0,a.jsx)(`i`,{}),(0,a.jsx)(`i`,{})]}),(0,a.jsx)(`span`,{className:`vsp-read`,children:(0,a.jsx)(u,{text:K[0]})}),(0,a.jsx)(`span`,{className:`vsp-rule`,"aria-hidden":!0,children:(0,a.jsx)(`i`,{className:`vsp-needle`})}),(0,a.jsx)(`span`,{className:`vsp-word`,children:K[1]})]})),U(`dial`,`Daylight variability, ${Z[0]}, ${Z[1]}. Read it again`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:2}),(0,a.jsx)(S,{a:`Daylight`,b:`Variability`}),(0,a.jsxs)(`svg`,{className:`vsp-dial`,viewBox:`0 0 182 218`,width:`182`,height:`218`,"aria-hidden":!0,children:[(0,a.jsx)(`path`,{className:`vsp-dial-ring`,d:ge}),(0,a.jsx)(`g`,{className:`vsp-dial-turn`,style:{"--vsp-a":`${Z[2]}deg`},children:(0,a.jsx)(`path`,{className:`vsp-dial-wedge`,d:_e})})]}),(0,a.jsx)(`span`,{className:`vsp-read vsp-read-dial`,children:(0,a.jsx)(u,{text:Z[0],pitch:3.3})}),(0,a.jsx)(`span`,{className:`vsp-word`,children:Z[1]})]})),U(`mix`,`Sun against screen, ${Q[0]} percent daylight. Read it again`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(C,{n:3}),(0,a.jsx)(S,{a:`Sun vs screen`,b:`Share of your light`}),(0,a.jsxs)(`span`,{className:`vsp-num`,children:[Q[0],(0,a.jsx)(`sup`,{children:`%`})]}),(0,a.jsxs)(`span`,{className:`vsp-track`,"aria-hidden":!0,style:{"--vsp-v":Q[0]/100},children:[(0,a.jsx)(`span`,{className:`vsp-fill`}),(0,a.jsx)(`svg`,{className:`vsp-thumb`,viewBox:`0 0 12 9`,width:`12`,height:`9`,children:(0,a.jsx)(`path`,{d:`M6 8.4 11.2 .6H.8Z`})})]}),(0,a.jsxs)(`span`,{className:`vsp-sides`,"aria-hidden":!0,children:[(0,a.jsx)(`span`,{children:`Screen`}),(0,a.jsx)(`span`,{children:`Sun`})]}),(0,a.jsx)(`span`,{className:`vsp-word`,children:Q[1]})]})),U(`plate`,`Sources: ${ue.join(`, `)}. Light the next one`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`span`,{className:`vsp-pools`,"data-lit":M,"aria-hidden":!0,children:de.map((e,t)=>(0,a.jsx)(`i`,{"data-on":M===t,style:{"--vsp-g":e}},t))}),(0,a.jsxs)(`span`,{className:`vsp-icons`,"data-lit":M,"aria-hidden":!0,children:[(0,a.jsx)(`i`,{className:`vsp-ic vsp-ic-clock`,"data-on":M===0,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 64 64`,width:`64`,height:`64`,children:[(0,a.jsx)(`circle`,{cx:`32`,cy:`32`,r:`15`}),(0,a.jsx)(`path`,{d:`M32 23v9.5l6 4`})]})}),(0,a.jsx)(`i`,{className:`vsp-ic vsp-ic-signal`,"data-on":M===1,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 64 64`,width:`64`,height:`64`,children:[(0,a.jsx)(`path`,{d:`M22 40a14 14 0 0 1 0-16M27.5 36a7.5 7.5 0 0 1 0-8M42 24a14 14 0 0 1 0 16M36.5 28a7.5 7.5 0 0 1 0 8`}),(0,a.jsx)(`circle`,{className:`vsp-ic-dot`,cx:`32`,cy:`32`,r:`2.6`})]})}),(0,a.jsx)(`i`,{className:`vsp-ic vsp-ic-spark`,"data-on":M===2,children:(0,a.jsx)(`svg`,{viewBox:`0 0 64 64`,width:`64`,height:`64`,children:(0,a.jsx)(`path`,{d:`M32 16v32M18.2 24l27.6 16M18.2 40l27.6-16`})})}),(0,a.jsx)(`i`,{className:`vsp-ic vsp-ic-orbit`,"data-on":M===3,children:(0,a.jsx)(`svg`,{viewBox:`0 0 64 64`,width:`64`,height:`64`,children:(0,a.jsx)(`circle`,{className:`vsp-ic-dot`,cx:`32`,cy:`32`,r:`6`})})})]})]}),`vsp-sq`),U(`app`,`Vesper, the app. Wake it`,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(`span`,{className:`vsp-app-bg`,"aria-hidden":!0,children:[(0,a.jsx)(`i`,{}),(0,a.jsx)(`i`,{}),(0,a.jsx)(`i`,{})]}),(0,a.jsx)(`span`,{className:`vsp-app-disc`,"data-spin":(D.app??0)>0,"aria-hidden":!0,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 64 64`,width:`64`,height:`64`,children:[(0,a.jsx)(`path`,{d:`M39 15.5A17.5 17.5 0 1 0 48.5 40 14 14 0 0 1 39 15.5Z`}),(0,a.jsx)(`circle`,{cx:`45`,cy:`22`,r:`3.2`})]})},D.app??0)]}),`vsp-sq vsp-sq-app`),(0,a.jsx)(`p`,{className:`vsp-foot vsp-foot-l`,children:`Main board`}),(0,a.jsxs)(`p`,{className:`vsp-foot vsp-foot-r`,children:[e,` `,(0,a.jsx)(`span`,{children:`thirteen live tiles`})]})]})]})}function S({a:e,b:t}){return(0,a.jsxs)(`span`,{className:`vsp-label`,children:[(0,a.jsx)(`b`,{children:e}),(0,a.jsx)(`span`,{children:t})]})}function C({n:e}){return(0,a.jsxs)(`span`,{className:`vsp-bg`,"aria-hidden":!0,children:[Array.from({length:e},(e,t)=>(0,a.jsx)(`i`,{},t)),(0,a.jsx)(`span`,{className:`vsp-grain`})]})}var xe=`
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&display=swap');

.vsp-root {
  --vsp-light: #ff2a1f; --vsp-hue: 0deg;
  --vsp-spring: cubic-bezier(.3,1.4,.5,1); --vsp-out: cubic-bezier(.2,.8,.2,1);
  container-type: inline-size; width: 100%; height: var(--design-h, 100svh); min-height: 640px; position: relative; overflow: hidden; isolation: isolate;
  background: #e2e2e0; color: #0b0b0c;
  font-family: "Inter Tight", -apple-system, "SF Pro Text", system-ui, sans-serif; font-weight: 500;
  -webkit-font-smoothing: antialiased; user-select: none; -webkit-user-select: none;
}
.vsp-root::before { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(120% 90% at 50% 46%, #ececea 0%, #e2e2e0 46%, #d3d3d1 100%); }
:where(.vsp-root) button { font: inherit; color: inherit; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; text-align: left; }
:where(.vsp-root) a { color: inherit; text-decoration: none; }
:where(.vsp-root) h1, :where(.vsp-root) p { margin: 0; }
.vsp-root[data-live="false"] * { animation-play-state: paused !important; }

/* the board: drawn at 1440×900 and scaled to the space (the script sets --vsp-k; before it runs, the width alone decides) */
.vsp-board { --vsp-k: 1; position: absolute; left: 50%; top: 50%; width: 1440px; height: 900px; margin: -450px 0 0 -720px; transform: scale(var(--vsp-k)); transform-origin: 50% 50%; }
@supports (scale: tan(atan2(1px, 1px))) { .vsp-board { --vsp-k: tan(atan2(100cqi, 1440px)); } }

.vsp-nav { position: absolute; left: 44px; right: 44px; top: 34px; display: flex; align-items: center; justify-content: space-between; font-size: 15px; z-index: 1; }
.vsp-brand { font-size: 21px; font-weight: 600; letter-spacing: -.02em; }
.vsp-brand span { color: #9a9a98; font-weight: 500; }
.vsp-links { display: flex; align-items: center; gap: 26px; color: #8a8a88; letter-spacing: -.005em; }
.vsp-links a { transition: color 200ms; }
.vsp-links a:hover { color: #0b0b0c; }
.vsp-links .vsp-in-link { color: #0b0b0c; font-weight: 600; }
.vsp-root a:focus-visible, .vsp-cta:focus-visible { outline: 2px solid #0b0b0c; outline-offset: 4px; border-radius: 6px; }
.vsp-foot { position: absolute; bottom: 30px; font-size: 15px; color: #9a9a98; letter-spacing: -.005em; z-index: 1; }
.vsp-foot-l { left: 44px; }
.vsp-foot-r { right: 44px; color: #0b0b0c; font-weight: 600; }
.vsp-foot-r span { color: #9a9a98; font-weight: 500; }

/* ---- the stage ---- */
.vsp-stage { position: absolute; left: 232px; top: 138px; width: 976px; height: 624px; border-radius: 30px; background: #030303; overflow: hidden; isolation: isolate; z-index: 1; color: #fff;
  box-shadow: 0 50px 90px -50px rgba(0,0,0,.55), 0 14px 30px -18px rgba(0,0,0,.35); will-change: transform; }
.vsp-glow { position: absolute; left: 8%; top: 2%; width: 74%; height: 120%; border-radius: 50%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--vsp-light) 46%, transparent) 0%, color-mix(in srgb, var(--vsp-light) 16%, transparent) 46%, transparent 78%);
  animation: vsp-breathe 5.2s ease-in-out infinite alternate; }
@keyframes vsp-breathe { from { opacity: .42; transform: scale(.94); } to { opacity: .9; transform: scale(1.05); } }
.vsp-person { position: absolute; left: 156px; top: 4px; height: 104%; width: auto; max-width: none; filter: hue-rotate(var(--vsp-hue)); pointer-events: none; -webkit-user-drag: none;
  -webkit-mask: linear-gradient(90deg, #000 62%, transparent 92%); mask: linear-gradient(90deg, #000 62%, transparent 92%); will-change: transform;
  animation: vsp-lit 5.2s ease-in-out infinite alternate; }
@keyframes vsp-lit { from { opacity: .82; } to { opacity: 1; } }
.vsp-veil { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, transparent 56%, rgba(3,3,3,.82) 98%), linear-gradient(90deg, rgba(3,3,3,.5) 0%, transparent 34%, transparent 52%, rgba(3,3,3,.62) 70%); }
.vsp-tabs { position: absolute; left: 304px; top: 28px; display: flex; gap: 22px; font-size: 13.5px; font-weight: 600; letter-spacing: -.005em; color: rgba(255,255,255,.5); }
.vsp-tabs b { color: #fff; font-weight: 600; }
.vsp-copy { position: absolute; left: 44px; bottom: 44px; width: 420px; }
.vsp-kick { display: flex; align-items: center; gap: 9px; font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,.62); letter-spacing: -.003em; margin-bottom: 16px; }
.vsp-kick i { width: 7px; height: 7px; border-radius: 50%; background: var(--vsp-light); box-shadow: 0 0 0 4px color-mix(in srgb, var(--vsp-light) 24%, transparent); animation: vsp-sync 2.6s ease-in-out infinite; }
@keyframes vsp-sync { 50% { box-shadow: 0 0 0 8px transparent; } }
.vsp-copy h1 { font-size: 60px; font-weight: 700; line-height: .96; letter-spacing: -.038em; }
.vsp-copy h1 span { display: block; white-space: nowrap; }
.vsp-sub { margin-top: 16px; width: 300px; font-size: 16px; line-height: 1.32; font-weight: 500; color: rgba(255,255,255,.62); letter-spacing: -.008em; }
.vsp-cta { margin-top: 24px; display: inline-flex; align-items: center; gap: 9px; height: 48px; padding: 0 22px 0 24px; border-radius: 24px; background: #fff; color: #0b0b0c; font-size: 15.5px; font-weight: 600; letter-spacing: -.01em;
  transition: scale 380ms var(--vsp-spring), background-color 200ms; }
.vsp-cta svg { fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; transition: translate 300ms var(--vsp-out); }
.vsp-cta:hover svg { translate: 3px 0; }
.vsp-cta:active { scale: .96; transition-duration: 90ms; }
.vsp-cta:focus-visible { outline-color: #fff; border-radius: 24px; }

/* ---- a floating thing: placed on the board, moved by the script, with its shadow under it ---- */
.vsp-f { --x: var(--dx); --y: var(--dy); --s: var(--ds); --w: 182px; --h: 218px;
  position: absolute; left: calc(var(--x) * 1px); top: calc(var(--y) * 1px); width: calc(var(--w) * var(--s)); height: calc(var(--h) * var(--s)); z-index: var(--z); will-change: transform; }
.vsp-f[data-fwd="true"], .vsp-f:focus-within { z-index: 9; }
.vsp-wide { --w: 300px; --h: 118px; }
.vsp-sq { --w: 176px; --h: 176px; }
.vsp-sq-app { --w: 150px; --h: 150px; }
.vsp-sh { position: absolute; inset: 6% 5% 2%; border-radius: calc(26px * var(--s)); background: rgba(20,20,24,.5); filter: blur(calc(14px + var(--dd) * 12px)); opacity: calc(.34 + var(--dd) * .2); pointer-events: none;
  transition: scale 520ms var(--vsp-spring), opacity 320ms ease; }
.vsp-f[data-fwd="true"] .vsp-sh { scale: 1.16; opacity: calc(.24 + var(--dd) * .14); }
.vsp-tile { position: absolute; inset: 0; display: block; border-radius: calc(22px * var(--s)); color: #fff; touch-action: manipulation; transition: scale 520ms var(--vsp-spring); }
.vsp-f[data-fwd="true"] .vsp-tile, .vsp-tile:focus-visible { scale: 1.1; }
.vsp-tile:active, .vsp-tile[data-dip="true"] { scale: .965 !important; transition-duration: 100ms; }
.vsp-tile:focus-visible { outline: 2px solid #0b0b0c; outline-offset: 4px; }
.vsp-in { position: absolute; left: 0; top: 0; width: var(--w); height: var(--h); display: block; border-radius: 22px; overflow: hidden; isolation: isolate; transform: scale(var(--s)); transform-origin: 0 0; }
.vsp-in::after { content: ""; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1px rgba(255,255,255,.1), inset 0 1px 0 rgba(255,255,255,.18); pointer-events: none; z-index: 3; }

/* the living colour: a flat ground and soft lobes that drift, each on its own clock (Tonic's recipe) */
.vsp-bg { position: absolute; inset: 0; z-index: -1; }
.vsp-bg i { position: absolute; border-radius: 50%; will-change: transform; animation: vsp-drift-a 9s ease-in-out infinite alternate; }
.vsp-bg i:nth-child(2) { animation-name: vsp-drift-b; animation-duration: 11s; }
.vsp-bg i:nth-child(3) { animation-name: vsp-drift-c; animation-duration: 13s; }
@keyframes vsp-drift-a { from { transform: translate3d(-10px, 6px, 0) scale(1); } to { transform: translate3d(14px, -10px, 0) scale(1.12); } }
@keyframes vsp-drift-b { from { transform: translate3d(8px, -8px, 0) scale(1.08); } to { transform: translate3d(-12px, 12px, 0) scale(.94); } }
@keyframes vsp-drift-c { from { transform: translate3d(0, 10px, 0) scale(.96); } to { transform: translate3d(6px, -14px, 0) scale(1.1); } }
@keyframes vsp-beat { from { transform: scale(.9); } to { transform: scale(1.14) translate3d(0, 4px, 0); } }
.vsp-grain { position: absolute; inset: 0; opacity: .34; mix-blend-mode: overlay; pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.1 -.1'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"); }

/* lilac: a pale column in violet */
.vsp-calm .vsp-bg { background: linear-gradient(180deg, #7767cf 0%, #9a7fd2 52%, #c49ccc 100%); }
.vsp-calm .vsp-bg i:nth-child(1) { left: 30px; top: -90px; width: 220px; height: 200px; background: radial-gradient(closest-side, #d5b6f2 0 16%, rgba(206,170,238,.6) 52%, transparent 100%); }
.vsp-calm .vsp-bg i:nth-child(2) { left: 40px; top: 110px; width: 200px; height: 170px; background: radial-gradient(closest-side, rgba(244,206,214,.8) 0 14%, transparent 100%); }
.vsp-calm .vsp-bg i:nth-child(3) { left: -80px; top: 60px; width: 200px; height: 200px; background: radial-gradient(closest-side, rgba(98,84,190,.7) 0 26%, transparent 100%); }
/* teal to cyan */
.vsp-sleep .vsp-bg { background: linear-gradient(200deg, #18a7a0 0%, #0c6f78 100%); }
.vsp-sleep .vsp-bg i:nth-child(1) { left: 40px; top: -70px; width: 230px; height: 230px; background: radial-gradient(closest-side, #7df3e6 0 18%, rgba(70,214,214,.6) 55%, transparent 100%); }
.vsp-sleep .vsp-bg i:nth-child(2) { left: -90px; top: 90px; width: 240px; height: 240px; background: radial-gradient(closest-side, #06454f 0 30%, rgba(6,69,79,.6) 62%, transparent 100%); }
.vsp-sleep .vsp-bg i:nth-child(3) { left: 60px; top: 110px; width: 190px; height: 170px; background: radial-gradient(closest-side, rgba(40,190,230,.7) 0 20%, transparent 100%); }
/* magenta to plum: hot edges, a dark heart */
.vsp-mood .vsp-bg { background: linear-gradient(180deg, #e0186c 0%, #f02a82 55%, #c81466 100%); }
.vsp-mood .vsp-bg i:nth-child(1) { left: -9px; top: 24px; width: 200px; height: 210px; background: radial-gradient(closest-side, #2a0620 0 34%, rgba(64,10,48,.72) 62%, transparent 100%); animation-name: vsp-beat; animation-duration: 4.6s; }
.vsp-mood .vsp-bg i:nth-child(2) { left: -60px; top: -120px; width: 300px; height: 200px; background: radial-gradient(closest-side, rgba(255,92,150,.8) 0 30%, transparent 100%); }
/* deep navy with a glow at its heart */
.vsp-move .vsp-bg { background: linear-gradient(180deg, #0a1a3c 0%, #050d20 100%); }
.vsp-move .vsp-bg i:nth-child(1) { left: -4px; top: 20px; width: 200px; height: 200px; background: radial-gradient(closest-side, rgba(28,96,214,.72) 0 18%, rgba(18,58,150,.4) 56%, transparent 100%); animation-name: vsp-beat; animation-duration: 6s; }
.vsp-move .vsp-bg i:nth-child(2) { left: 70px; top: 120px; width: 170px; height: 150px; background: radial-gradient(closest-side, rgba(20,150,170,.3) 0 20%, transparent 100%); }
/* crimson with a dark heart and a hot floor */
.vsp-air .vsp-bg { background: linear-gradient(180deg, #d81f3f 0%, #b01232 50%, #e63a2c 100%); }
.vsp-air .vsp-bg i:nth-child(1) { left: -14px; top: 14px; width: 210px; height: 190px; background: radial-gradient(closest-side, #1d0410 0 36%, rgba(54,6,26,.74) 62%, transparent 100%); animation-name: vsp-beat; animation-duration: 5.4s; }
.vsp-air .vsp-bg i:nth-child(2) { left: -40px; top: 150px; width: 260px; height: 130px; background: radial-gradient(closest-side, rgba(255,120,70,.85) 0 24%, transparent 100%); }
/* bottle green, lighter at the top */
.vsp-light .vsp-bg { background: linear-gradient(180deg, #33705a 0%, #15402f 60%, #0b241b 100%); }
.vsp-light .vsp-bg i:nth-child(1) { left: -20px; top: -10px; width: 220px; height: 200px; background: radial-gradient(closest-side, rgba(10,30,22,.9) 0 30%, rgba(10,30,22,.5) 62%, transparent 100%); animation-name: vsp-beat; animation-duration: 6.4s; }
.vsp-light .vsp-bg i:nth-child(2) { left: 30px; top: -80px; width: 200px; height: 150px; background: radial-gradient(closest-side, rgba(110,190,150,.5) 0 20%, transparent 100%); }
/* dusk: grey above, a warm band, dark below */
.vsp-focus .vsp-bg { background: linear-gradient(180deg, #343a44 0%, #6a4a3e 40%, #b5633c 62%, #33201a 100%); }
.vsp-focus .vsp-bg i:nth-child(1) { left: -30px; top: 60px; width: 240px; height: 130px; background: radial-gradient(closest-side, rgba(236,140,88,.8) 0 20%, transparent 100%); }
.vsp-focus .vsp-bg i:nth-child(2) { left: -50px; top: 150px; width: 280px; height: 140px; background: radial-gradient(closest-side, rgba(22,14,12,.9) 0 40%, transparent 100%); }
/* wine above, a fire on the floor */
.vsp-meet .vsp-bg { background: linear-gradient(180deg, #2a0716 0%, #6a0c1e 46%, #d4301a 84%, #ff7a1f 100%); }
.vsp-meet .vsp-bg i:nth-child(1) { left: -40px; top: -70px; width: 260px; height: 200px; background: radial-gradient(closest-side, rgba(18,4,12,.9) 0 40%, transparent 100%); }
.vsp-meet .vsp-bg i:nth-child(2) { left: -20px; top: 150px; width: 220px; height: 120px; background: radial-gradient(closest-side, rgba(255,150,50,.7) 0 20%, transparent 100%); }
/* slate into ember, a dark heart behind the dial */
.vsp-dial .vsp-bg { background: linear-gradient(165deg, #5b7a96 0%, #7a6a6c 44%, #b95e36 100%); }
.vsp-dial .vsp-bg i:nth-child(1) { left: -4px; top: 24px; width: 190px; height: 190px; background: radial-gradient(closest-side, rgba(30,24,26,.86) 0 36%, rgba(40,30,30,.5) 62%, transparent 100%); animation-name: vsp-beat; animation-duration: 5.8s; }
.vsp-dial .vsp-bg i:nth-child(2) { left: 60px; top: 120px; width: 190px; height: 160px; background: radial-gradient(closest-side, rgba(240,130,70,.6) 0 20%, transparent 100%); }
/* olive with a lime sun */
.vsp-mix .vsp-bg { background: linear-gradient(180deg, #4d5a0a 0%, #6e7f10 54%, #8a9412 100%); }
.vsp-mix .vsp-bg i:nth-child(1) { left: 0; top: -40px; width: 190px; height: 200px; background: radial-gradient(closest-side, #d2f23c 0 16%, rgba(190,226,50,.62) 50%, transparent 100%); }
.vsp-mix .vsp-bg i:nth-child(2) { left: -60px; top: 130px; width: 300px; height: 160px; background: radial-gradient(closest-side, rgba(46,52,6,.86) 0 36%, transparent 100%); }
.vsp-mix .vsp-bg i:nth-child(3) { left: -80px; top: -90px; width: 220px; height: 180px; background: radial-gradient(closest-side, rgba(40,46,6,.8) 0 34%, transparent 100%); }
/* sand to bronze, a wide tile */
.vsp-day .vsp-bg { background: linear-gradient(90deg, #8a6a4e 0%, #b98c60 48%, #7b5b47 100%); }
.vsp-day .vsp-bg i:nth-child(1) { left: 60px; top: -60px; width: 220px; height: 190px; background: radial-gradient(closest-side, rgba(226,180,120,.8) 0 18%, transparent 100%); }
.vsp-day .vsp-bg i:nth-child(2) { left: -70px; top: 10px; width: 200px; height: 170px; background: radial-gradient(closest-side, rgba(70,50,42,.8) 0 30%, transparent 100%); }

/* ---- what is written on a tile ---- */
.vsp-label { position: absolute; left: 13px; top: 12px; right: 12px; display: grid; font-size: 13.5px; line-height: 1.16; letter-spacing: -.008em; }
.vsp-label b { font-weight: 600; }
.vsp-label span { font-weight: 500; color: rgba(255,255,255,.56); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vsp-word { position: absolute; left: 13px; bottom: 12px; font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.62); letter-spacing: -.003em; white-space: nowrap; }
.vsp-word em { font-style: normal; color: rgba(255,255,255,.4); margin-left: 4px; font-variant-numeric: tabular-nums; }
.vsp-ends { right: 13px; display: flex; justify-content: space-between; }
.vsp-read { position: absolute; left: 0; right: 0; top: 66px; display: flex; justify-content: center; align-items: flex-start; color: #fff; }
.vsp-read sup { font-size: 12px; font-weight: 500; color: rgba(255,255,255,.72); margin: -3px 0 0 3px; line-height: 1; }
.vsp-dots { display: block; overflow: visible; filter: drop-shadow(0 0 5px rgba(255,255,255,.3)) drop-shadow(0 1px 1.5px rgba(0,0,0,.3)); animation: vsp-relight 520ms steps(5, end) both; }
.vsp-dots path { fill: none; stroke: currentColor; stroke-linecap: round; }
@keyframes vsp-relight { 0% { opacity: 0; } 30% { opacity: .9; } 45% { opacity: .25; } 100% { opacity: 1; } }
.vsp-num { position: absolute; left: 0; right: 0; top: 58px; text-align: center; font-size: 46px; font-weight: 300; line-height: 1; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.vsp-num sup { position: absolute; top: 4px; font-size: 13px; font-weight: 500; letter-spacing: 0; color: rgba(255,255,255,.7); margin-left: 3px; }

/* the ruler of ticks and its needle */
.vsp-rule { position: absolute; left: 14px; right: 14px; top: 124px; height: 26px;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.5) 0 1px, transparent 1px 4px) 0 50% / 100% 9px no-repeat, repeating-linear-gradient(90deg, rgba(255,255,255,.72) 0 1px, transparent 1px 20px) 0 50% / 100% 17px no-repeat;
  -webkit-mask: linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent); mask: linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent); }
.vsp-needle { position: absolute; left: 50%; top: -2px; width: 1.5px; height: 30px; margin-left: -1px; border-radius: 1px; background: #ffd94a; box-shadow: 0 0 8px rgba(255,217,74,.7); animation: vsp-wander 7s ease-in-out infinite alternate; }
.vsp-focus .vsp-needle { animation-duration: 9s; animation-delay: -3s; }
@keyframes vsp-wander { 0% { transform: translateX(-44px); } 38% { transform: translateX(12px); } 62% { transform: translateX(-10px); } 100% { transform: translateX(40px); } }
.vsp-pips { position: absolute; right: 13px; top: 17px; display: flex; gap: 4px; }
.vsp-pips i { width: 3.5px; height: 3.5px; border-radius: 50%; background: rgba(255,255,255,.5); }
.vsp-pips i:first-child { background: #fff; }

/* the sun that rides its ruler */
.vsp-rule-cool { top: 152px; height: 18px; background: repeating-linear-gradient(90deg, rgba(190,226,255,.9) 0 1.2px, transparent 1.2px 4px) 0 50% / 100% 100% no-repeat; }
.vsp-ride { position: absolute; left: 61px; top: 52px; width: 60px; height: 132px; animation: vsp-ride 9s ease-in-out infinite alternate; }
@keyframes vsp-ride { from { transform: translateX(-36px); } to { transform: translateX(34px); } }
.vsp-sun { display: block; overflow: visible; }
.vsp-sun circle { fill: var(--vsp-sun); transition: fill 700ms ease; filter: drop-shadow(0 0 12px color-mix(in srgb, var(--vsp-sun) 60%, transparent)); }
.vsp-sun path { fill: none; stroke: rgba(255,255,255,.7); stroke-width: 1.1; stroke-linecap: round; transform-origin: 30px 30px; animation: vsp-turn 24s linear infinite; }
@keyframes vsp-turn { to { transform: rotate(360deg); } }
.vsp-stem { position: absolute; left: 29.5px; top: 62px; width: 1px; height: 52px; background: color-mix(in srgb, var(--vsp-sun) 80%, #fff); transition: background-color 700ms ease; }
.vsp-tri { position: absolute; left: 24px; top: 118px; fill: var(--vsp-sun); transition: fill 700ms ease; }

/* the tall lines of the next meetings */
.vsp-dotring { position: absolute; right: 13px; top: 14px; width: 9px; height: 9px; border-radius: 50%; box-shadow: inset 0 0 0 2.5px rgba(255,255,255,.5); }
.vsp-read-meet { top: 70px; }
.vsp-tall { position: absolute; left: 0; right: 0; top: 126px; bottom: 0; overflow: hidden; -webkit-mask: linear-gradient(180deg, transparent, #000 34%); mask: linear-gradient(180deg, transparent, #000 34%); }
.vsp-tall::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 240px; background: repeating-linear-gradient(90deg, rgba(255,130,90,.62) 0 1px, transparent 1px 6px); animation: vsp-slide 6s linear infinite; }
@keyframes vsp-slide { to { transform: translateX(-48px); } }
.vsp-tall i { position: absolute; bottom: 0; width: 2px; border-radius: 1px; background: #ffd94a; box-shadow: 0 0 8px rgba(255,217,74,.6); transform-origin: 50% 100%; animation: vsp-grow 3.4s ease-in-out infinite alternate; }
.vsp-tall i:nth-child(1) { left: 36px; height: 62px; }
.vsp-tall i:nth-child(2) { left: 84px; height: 78px; animation-delay: -1.1s; background: #fff; box-shadow: none; opacity: .85; }
.vsp-tall i:nth-child(3) { left: 138px; height: 70px; animation-delay: -2.2s; background: #fff; box-shadow: none; opacity: .85; }
.vsp-tall i:nth-child(4) { left: 150px; height: 84px; animation-delay: -.6s; }
@keyframes vsp-grow { from { transform: scaleY(.72); } to { transform: scaleY(1); } }

/* the wave */
.vsp-wave { position: absolute; left: 12px; top: 122px; width: 158px; height: 56px; }
.vsp-wave svg { position: absolute; inset: 0; display: block; overflow: visible; }
.vsp-wave-fade { -webkit-mask: linear-gradient(90deg, transparent, #000 22%); mask: linear-gradient(90deg, transparent, #000 22%); }
.vsp-wave path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.vsp-wave-line { stroke: rgba(255,255,255,.7); stroke-width: 1; }
.vsp-wave-a { stroke: #fff6a8; stroke-width: 1.4; }
.vsp-wave-b { stroke: rgba(255,246,168,.6); stroke-width: 1; }
.vsp-wave .vsp-wave-mark { fill: #ffe04a; stroke: none; }

/* the ring */
.vsp-ring { position: absolute; inset: 0; }
.vsp-ring circle, .vsp-ring path { fill: none; }
.vsp-ring-track { stroke: rgba(255,255,255,.3); stroke-width: 1; }
.vsp-ring-arc { stroke: #fff; stroke-width: 2.25; stroke-linecap: round; transition: stroke-dashoffset 900ms var(--vsp-out); }
.vsp-ring-leaf { stroke: #e9f78a; stroke-width: 1; stroke-linejoin: round; transform-origin: 91px 116px; animation: vsp-sway 7s ease-in-out infinite alternate; }
@keyframes vsp-sway { from { transform: rotate(-7deg); } to { transform: rotate(9deg) scale(1.04); } }
.vsp-read-ring { top: 102px; }

/* the waveform */
.vsp-bars { position: absolute; left: 0; right: 0; top: 122px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 3.5px; }
.vsp-bars i { width: 1.5px; border-radius: 1px; background: rgba(255,255,255,.5); animation: vsp-bar .7s ease-in-out infinite alternate; }
.vsp-bars i[data-warm="true"] { background: #ffc46b; }
@keyframes vsp-bar { from { transform: scaleY(.38); } to { transform: scaleY(1); } }

/* the scatter */
.vsp-cross { position: absolute; left: 16px; right: 16px; top: 62px; bottom: 44px;
  background: linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.2)) 50% 50% / 100% 1px no-repeat, linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.2)) 50% 50% / 1px 100% no-repeat; }
.vsp-plot { position: absolute; inset: 0; --vsp-dot: #3fa8ff; }
.vsp-plot i { position: absolute; left: 0; top: 0; border-radius: 50%; background: radial-gradient(circle at 36% 30%, color-mix(in srgb, var(--vsp-dot) 45%, #fff) 0 12%, var(--vsp-dot) 55%, color-mix(in srgb, var(--vsp-dot) 76%, #001a70) 100%); box-shadow: 0 0 10px color-mix(in srgb, var(--vsp-dot) 50%, transparent); will-change: transform; }

/* the dial */
.vsp-dial { position: absolute; inset: 0; }
.vsp-dial path { fill: none; stroke-linecap: round; }
.vsp-dial-ring { stroke: rgba(255,255,255,.4); stroke-width: 1; }
.vsp-dial-turn { transform-origin: 91px 120px; transform: rotate(var(--vsp-a)); transition: transform 900ms var(--vsp-spring); }
.vsp-dial-wedge { stroke: #ffd94a; stroke-width: 1.6; filter: drop-shadow(0 0 5px rgba(255,217,74,.7)); transform-origin: 91px 120px; animation: vsp-sweep 6s ease-in-out infinite alternate; }
@keyframes vsp-sweep { from { transform: rotate(-12deg); } to { transform: rotate(14deg); } }
.vsp-read-dial { top: 106px; }

/* the slider */
.vsp-track { position: absolute; left: 14px; right: 14px; top: 132px; height: 2px; border-radius: 1px; background: rgba(255,255,255,.26); }
.vsp-fill { position: absolute; left: 0; top: 0; bottom: 0; width: calc(var(--vsp-v) * 100%); border-radius: 1px; background: #f3ff7a; transition: width 700ms var(--vsp-out); }
.vsp-thumb { position: absolute; left: calc(var(--vsp-v) * 100%); top: -10px; margin-left: -6px; fill: #f3ff7a; filter: drop-shadow(0 2px 6px rgba(0,0,0,.35)); transition: left 700ms var(--vsp-out); }
.vsp-sides { position: absolute; left: 14px; right: 14px; top: 142px; display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 500; color: rgba(255,255,255,.42); }
.vsp-sides span:last-child { color: rgba(255,255,255,.86); }

/* the wide tile */
.vsp-read-day { left: 104px; right: auto; top: 46px; }
.vsp-lens { position: absolute; right: 30px; top: 22px; width: 46px; height: 76px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; animation: vsp-tilt 5s ease-in-out infinite alternate; }
.vsp-lens i { height: 1px; background: rgba(255,224,74,.9); }
@keyframes vsp-tilt { from { transform: scaleX(.5); } to { transform: scaleX(1.08); } }
.vsp-lens-mark { position: absolute; right: 12px; top: 54px; fill: #ffd94a; }

/* ---- the glass plate and its four icons ---- */
.vsp-plate { border-radius: 44px; overflow: hidden; background: linear-gradient(150deg, rgba(255,255,255,.72), rgba(236,236,240,.34)); -webkit-backdrop-filter: blur(18px) saturate(1.3); backdrop-filter: blur(18px) saturate(1.3); }
.vsp-plate::after { border-radius: 44px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.7), inset 0 2px 1px rgba(255,255,255,.9), inset 0 -10px 20px -12px rgba(60,60,80,.3); }
/* under the glass, each icon has a pool of its own light: they take turns, and a press floods the plate */
.vsp-pools { position: absolute; inset: 0; }
.vsp-pools i { position: absolute; left: -14px; top: -14px; width: 130px; height: 130px; border-radius: 50%; opacity: 0;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--vsp-g) 82%, transparent) 0%, color-mix(in srgb, var(--vsp-g) 36%, transparent) 46%, transparent 100%);
  animation: vsp-pool 6.4s ease-in-out infinite; transition: opacity 500ms ease, scale 700ms var(--vsp-spring); }
.vsp-pools i:nth-child(2) { left: 60px; animation-delay: 1.6s; }
.vsp-pools i:nth-child(3) { top: 60px; animation-delay: 4.8s; }
.vsp-pools i:nth-child(4) { left: 60px; top: 60px; animation-delay: 3.2s; }
@keyframes vsp-pool { 0%, 26%, 100% { opacity: 0; } 9% { opacity: .78; } }
.vsp-pools:not([data-lit="-1"]) i { animation: none; }
.vsp-pools i[data-on="true"] { opacity: 1; scale: 1.7; }
.vsp-icons { position: absolute; inset: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.vsp-ic { position: relative; display: grid; place-items: center; border-radius: 50%; overflow: hidden; box-shadow: 0 6px 14px -6px rgba(20,20,40,.5), inset 0 1px 0 rgba(255,255,255,.5), inset 0 -6px 10px -6px rgba(0,0,0,.4); transition: scale 420ms var(--vsp-spring), filter 300ms ease; animation: vsp-pass 6.4s ease-in-out infinite; }
.vsp-ic:nth-child(2) { animation-delay: 1.6s; }
.vsp-ic:nth-child(4) { animation-delay: 3.2s; }
.vsp-ic:nth-child(3) { animation-delay: 4.8s; }
@keyframes vsp-pass { 0%, 26%, 100% { filter: brightness(1) saturate(1); } 9% { filter: brightness(1.28) saturate(1.25); } }
.vsp-icons:not([data-lit="-1"]) .vsp-ic { animation: none; filter: brightness(.86) saturate(.8); }
.vsp-icons .vsp-ic[data-on="true"] { scale: .9; filter: brightness(1.3) saturate(1.3); }
.vsp-ic svg { width: 100%; height: 100%; display: block; fill: none; stroke: #fff; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
.vsp-ic .vsp-ic-dot { fill: #fff; stroke: none; }
.vsp-ic-clock { background: radial-gradient(circle at 32% 28%, #d8fff0 0%, #86f0c9 30%, #55c8e8 78%, #3f8fd8 100%); }
.vsp-ic-clock svg { stroke: #07231c; }
.vsp-ic-signal { background: radial-gradient(circle at 34% 28%, #fff0b8 0%, #e9bd4c 36%, #a87a1c 100%); }
.vsp-ic-spark { background: radial-gradient(circle at 50% 50%, #ffd27a 0%, #ff5a2a 34%, #8a0f14 82%, #2a0508 100%); }
.vsp-ic-orbit { background: radial-gradient(circle at 50% 50%, #050508 0 42%, #2b2fd8 62%, #c63ad0 80%, #0a0a12 100%); }

/* ---- the app's icon ---- */
.vsp-app { border-radius: 40px; overflow: hidden; background: #8df5c0; }
.vsp-app::after { border-radius: 40px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.4), inset 0 2px 1px rgba(255,255,255,.7); }
.vsp-app-bg { position: absolute; inset: 0; }
.vsp-app-bg i { position: absolute; border-radius: 50%; animation: vsp-drift-a 7s ease-in-out infinite alternate; }
.vsp-app-bg i:nth-child(1) { left: -30px; top: -30px; width: 150px; height: 150px; background: radial-gradient(closest-side, #5fd0ff 0 20%, rgba(95,208,255,.6) 55%, transparent 100%); }
.vsp-app-bg i:nth-child(2) { left: 50px; top: 60px; width: 150px; height: 150px; background: radial-gradient(closest-side, #f4ff5e 0 20%, rgba(244,255,94,.6) 55%, transparent 100%); animation-name: vsp-drift-b; animation-duration: 9s; }
.vsp-app-bg i:nth-child(3) { left: 15px; top: 15px; width: 120px; height: 120px; background: radial-gradient(closest-side, #a8ffb4 0 50%, transparent 100%); animation-name: vsp-drift-c; }
.vsp-app-disc { position: absolute; left: 50%; top: 50%; width: 88px; height: 88px; margin: -44px 0 0 -44px; border-radius: 50%; background: #070709; display: grid; place-items: center; box-shadow: 0 10px 20px -8px rgba(0,40,30,.6); }
.vsp-app-disc svg { fill: #f6ff7a; display: block; }
.vsp-app-disc[data-spin="true"] { animation: vsp-wake 900ms var(--vsp-spring) both; }
@keyframes vsp-wake { 0% { transform: rotate(-90deg) scale(.8); } 100% { transform: none; } }

/* ---- the phone: the stage is the top half, five tiles stand in two staggered columns over its lower edge ---- */
@container (max-width: 700px) {
  .vsp-board { width: 390px; height: 844px; margin: -422px 0 0 -195px; }
  @supports (scale: tan(atan2(1px, 1px))) { .vsp-board { --vsp-k: tan(atan2(100cqi, 390px)); } }
  .vsp-nav { left: 20px; right: 20px; top: 20px; font-size: 14px; }
  .vsp-brand { font-size: 19px; }
  .vsp-links { gap: 0; }
  .vsp-links a:not(.vsp-in-link) { display: none; }
  .vsp-stage { left: 12px; top: 58px; width: 366px; height: 348px; border-radius: 26px; }
  .vsp-person { left: -30px; top: -10px; height: 100%; }
  .vsp-glow { left: -10%; }
  .vsp-veil { background: linear-gradient(180deg, transparent 34%, rgba(3,3,3,.86) 88%); }
  .vsp-tabs { display: none; }
  .vsp-copy { left: 20px; bottom: 22px; width: 200px; }
  .vsp-kick { font-size: 12px; margin-bottom: 9px; }
  .vsp-copy h1 { font-size: 31px; letter-spacing: -.034em; }
  .vsp-sub { display: none; }
  .vsp-cta { margin-top: 14px; height: 40px; padding: 0 16px 0 18px; font-size: 14px; }
  .vsp-f { --x: var(--px); --y: var(--py); --s: var(--ps); }
  .vsp-f[data-phone="false"] { display: none; }
  .vsp-f[data-fwd="true"] .vsp-tile, .vsp-tile:focus-visible { scale: 1.045; }
  .vsp-foot { bottom: 20px; font-size: 13px; }
  .vsp-foot-l { left: 22px; }
  .vsp-foot-r { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .vsp-root *, .vsp-root *::before, .vsp-root *::after { animation: none !important; }
  .vsp-tile, .vsp-sh, .vsp-ring-arc, .vsp-fill, .vsp-thumb, .vsp-dial-turn, .vsp-cta { transition-duration: 1ms !important; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(x,{})}));