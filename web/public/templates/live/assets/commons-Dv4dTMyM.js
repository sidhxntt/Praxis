import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=`/design/websites/commons/`,s=[{id:`reader`,ar:2.474,d:[14.2,31.5,-8,5.5],m:[25,37.5,-8,15]},{id:`eater`,ar:1.095,d:[26,45,14,6],m:null},{id:`playera`,ar:.586,d:[37.5,27,0,10.4],m:[26,21.5,0,30]},{id:`playerb`,ar:.546,d:[60.5,23.5,0,11.4],m:[73,17.5,0,33]},{id:`cyclist`,ar:1.61,d:[73.5,27.5,62,5.1],m:null},{id:`bike`,ar:.936,d:[83.5,19.5,-12,7.8],m:null},{id:`flyer`,ar:1.526,d:[89,43,-18,4.7],m:[87,55.5,-14,13]},{id:`child`,ar:.559,d:[46,50,0,6.6],m:[62,38.5,0,20]},{id:`cards`,ar:.494,d:[80.5,68,-14,11.2],m:null},{id:`sunbather`,ar:1.94,d:[61,80.5,82,4.8],m:null},{id:`sleeper`,ar:1.68,d:[41,66,-62,6.2],m:[33,57,80,17]}],c=Object.fromEntries(s.map(e=>[e.id,e])),l={d:{kite:[72,49,6.5,7.5],kiteW:6.2,kiteOff:[-4.6,6],rest:[52.5,57.5],targets:[[58.5,63.5],[55.5,39],[65.5,46.5]],dogW:6.4,ballW:1.5,shW:1.5},m:{kite:[52,54.5,13,2.4],kiteW:12.5,kiteOff:[-9,9],rest:[77,46],targets:[[46,47.5],[52,29.5],[40,45]],dogW:19,ballW:4.4,shW:4.4}},u={d:[1440,900],m:[390,844]},d=.366,f=1.3,p=[.92,.16],m=[.07,.12],h=[.96,.27],g=[.5,.52],_=e=>Math.round(e*10)/10,v=e=>Math.round(e*100)/100;function y(e,t,n,r,i,a){let o=e[3]*i/100,s=o*t,c=e[2]*Math.PI/180,l=(n-.5)*o,u=(r-.5)*s;return[e[0]*i/100+l*Math.cos(c)-u*Math.sin(c),e[1]*a/100+l*Math.sin(c)+u*Math.cos(c)]}function b(e){let[t,n]=u[e],r=l[e],i=e=>[v(e[0]/t*100),v(e[1]/n*100)],a=c.child[e],o=c.playera[e],s=c.flyer[e],d=i(y(a,c.child.ar,h[0],h[1],t,n)),f=i(y(o,c.playera.ar,p[0],p[1],t,n)),m=i(y(s,c.flyer.ar,g[0],g[1],t,n)),_=[r.kite[0],v(r.kite[1]+r.kite[3]*.56)];return{hand:d,head:f,spool:m,kite:_,kiteS:[v(_[0]+r.kiteOff[0]),v(_[1]+r.kiteOff[1]*t/n)],tip:[v(_[0]-.277*r.kiteW),v(_[1]+.544*r.kiteW*t/n)],dog:r.rest}}var x={d:b(`d`),m:b(`m`)};function S(e){let t=e>>>0;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}var C=(()=>{let e=S(11),t=``;for(let n=0;n<190;n++){let n=e()*1600,r=e()*1e3,i=6+e()*7,a=-.45+e()*.9;t+=`M${_(n)} ${_(r)}l${_(Math.sin(a)*i)} ${_(-i)}M${_(n+4)} ${_(r)}l${_(Math.sin(a+.5)*i*.8)} ${_(-i*.8)}`}return t})(),w=(()=>{let e=S(29),t=[];for(let n=0;n<15;n++){let n=60+e()*1480,r=60+e()*880,i=2+Math.floor(e()*4);for(let a=0;a<i;a++)t.push([_(n+(e()-.5)*70),_(r+(e()-.5)*56),_(2.6+e()*1.6)])}return t})(),T=[[330,210,250,120,-14],[1010,540,300,150,9],[1340,190,210,105,22],[640,830,280,115,-6],[170,640,190,100,18]],E=(()=>{let e=S(53),t=(e,t)=>{let n=Math.cos(e),r=Math.sin(e),i=(n**3+r**3)**(-1/3)*t;return[n*i*965,800-r*i*765]},n=`M0 800`;for(let r=0;r<=30;r++){let i=r/30*(Math.PI/2),[a,o]=t(i,.87+.035*Math.sin(i*9)+.02*e());n+=`L${_(a)} ${_(o)}`}n+=`Z`;let r=[];for(let n=0;n<40;n++){let[i,a]=t((n+e()*.8)/40*(Math.PI/2),.84+e()*.14),o=34+e()*52;r.push([_(i),_(a),_(o),_(o*(.62+e()*.3)),Math.round(e()*180)])}let i=(n,r,i,a,o)=>{let s=[];for(let c=0;c<n;c++){let n=e()*(Math.PI/2),c=r+e()*(i-r),[l,u]=t(n,c),d=(a+e()*(o-a))*(1.25-(c-r)/(i-r+.001)*.55);s.push([_(l),_(u),_(d),_(d*(.55+e()*.35)),Math.round(e()*180)])}return s},a=i(30,.99,1.2,12,30),o=i(26,1.02,1.3,9,24),s=[];for(let n=0;n<16;n++){let[n,r]=t(e()*(Math.PI/2),.87+e()*.09),i=10+e()*15;s.push([_(n),_(r),_(i),_(i*(.55+e()*.3)),Math.round(e()*180)])}return{mass:n,edge:r,a,b:o,holes:s}})();function D(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>{t.current?.close().catch(()=>{}),t.current=null},[]),()=>{if(!e||typeof window>`u`||document.documentElement.getAttribute(`data-cd-mute`)===`1`)return;let n=navigator.userActivation;if(!(n&&!n.hasBeenActive))try{if(!t.current){let e=window.AudioContext??window.webkitAudioContext;if(!e)return;t.current=new e}let e=t.current;e.state===`suspended`&&e.resume();let n=e.currentTime,r=e.createOscillator(),i=e.createGain();r.type=`sine`,r.frequency.setValueAtTime(540,n),r.frequency.exponentialRampToValueAtTime(230,n+.09),i.gain.setValueAtTime(1e-4,n),i.gain.exponentialRampToValueAtTime(.11,n+.008),i.gain.exponentialRampToValueAtTime(1e-4,n+.13),r.connect(i).connect(e.destination),r.start(n),r.stop(n+.15)}catch{}}}var O=(e,t,n)=>Math.min(n,Math.max(t,e)),k=e=>e<.5?2*e*e:1-(-2*e+2)**2/2,A=(e,t,n)=>e+(t-e)*n,ee=(e,t,n)=>{let r=t-e;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;return e+r*n};function j({flat:e=!1}){return e?(0,a.jsx)(`svg`,{viewBox:`0 0 100 130`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M50 2 96 46 50 128 4 46Z`,fill:`#8db06a`})}):(0,a.jsxs)(`svg`,{viewBox:`0 0 100 130`,"aria-hidden":!0,children:[(0,a.jsx)(`path`,{d:`M50 2 96 46 50 46Z`,fill:`#e4553a`}),(0,a.jsx)(`path`,{d:`M50 2 4 46 50 46Z`,fill:`#f6ecd6`}),(0,a.jsx)(`path`,{d:`M4 46 50 128 50 46Z`,fill:`#e9b53a`}),(0,a.jsx)(`path`,{d:`M96 46 50 128 50 46Z`,fill:`#2c4a8a`}),(0,a.jsx)(`path`,{d:`M50 2V128M4 46H96`,stroke:`#1f2f55`,strokeWidth:`1.6`,fill:`none`})]})}function M({brand:e=`C.`,title:t=`Somewhere to lie down, / ten minutes from anywhere.`,lede:n=`Every lawn in the city, with its shade, its crowd and its closing time. Pick a patch of grass and go.`,cta:r=`Open the map`,chip:u=`Sunny until 19:40`,search:b=`Find a lawn near you`,park:S=`Parco Sempione · east lawn`,people:M=214,shade:P=`shade until 16:10`,lawn:F=`#a4c03a`,pace:I=1,reader:te=`${o}reader.webp`,sleeper:L=`${o}sleeper.webp`,eater:ne=`${o}eater.webp`,cyclist:re=`${o}cyclist.webp`,bike:R=`${o}bike.webp`,dog:z=`${o}dog.webp`,playera:ie=`${o}playera.webp`,playerb:ae=`${o}playerb.webp`,flyer:B=`${o}flyer.webp`,child:V=`${o}child.webp`,cards:H=`${o}cards.webp`,sunbather:U=`${o}sunbather.webp`,sound:W=!0,onCta:G,onSearch:K}){let oe=(0,i.useRef)(null),q=D(W),se=(0,i.useRef)(q);se.current=q;let ce=(0,i.useRef)(I);ce.current=O(Number(I)||1,.4,2);let le=(0,i.useRef)(M);le.current=M;let J=(0,i.useRef)(null),Y={reader:te,sleeper:L,eater:ne,cyclist:re,bike:R,playera:ie,playerb:ae,flyer:B,child:V,cards:H,sunbather:U},X=t.split(` / `),ue=O(Number(I)||1,.4,2);(0,i.useEffect)(()=>{let e=oe.current;if(!e)return;let t=t=>e.querySelector(t),n=e=>t(`[data-mv="${e}"]`),r=e=>t(`[data-mv="${e}"] > .cmn-mvi`),i={dog:n(`dog`),dogI:r(`dog`),ball:n(`ball`),ballI:r(`ball`),ballS:n(`ball-s`),shut:n(`shut`),shutI:r(`shut`),shutS:n(`shut-s`),kite:n(`kite`),kiteI:r(`kite`),kiteS:n(`kite-s`),kiteSI:r(`kite-s`),strD:t(`.cmn-str-d`),strM:t(`.cmn-str-m`),pa:t(`[data-id="playera"] > .cmn-pi`),pb:t(`[data-id="playerb"] > .cmn-pi`),fl:t(`[data-id="flyer"] > .cmn-pi`),ch:t(`[data-id="child"] > .cmn-pi`),count:t(`.cmn-count`)},a=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,o=0,s=0,u=`d`,_=14.4,v={hand:[0,0],rest:[0,0],targets:[],headA:[0,0],headB:[0,0],spool:[0,0],child:[0,0]},b=e=>[e[0]*o/100,e[1]*s/100],S=(e,t,n,r)=>{e&&(e.style.transform=`translate3d(${(n-t[0]*o/100).toFixed(1)}px, ${(r-t[1]*s/100).toFixed(1)}px, 0)`)},C=new Map,w=(e,t)=>{!e||C.get(e)===t||(C.set(e,t),e.style.setProperty(`--j`,String(t)))},T={t0:0,from:[0,0],to:[0,0],dog0:[0,0],stop:[0,0],a0:0,a1:0,a2:0,ta:0,tb:0,auto:!0},E=0,D=[0,0],j=[0,0],M=Math.PI*1.2,N=-1e9,P=1.45,F=(e,t,n,r)=>{let i=[j[0],j[1]],a=n[0]-i[0],o=n[1]-i[1],s=Math.hypot(a,o)||1,c=l[u].dogW*_*.46,d=[n[0]-a/s*c,n[1]-o/s*c],f=Math.max(0,s-c),p=Math.max(.3+O(f/(30*_),.7,2),1.55),m=Math.hypot(v.rest[0]-d[0],v.rest[1]-d[1]),h=p+.55+O(m/(25*_),.9,2.2);T={t0:e,from:t,to:n,dog0:i,stop:d,a0:M,a1:Math.atan2(o,a),a2:Math.atan2(v.rest[1]-d[1],v.rest[0]-d[0]),ta:p,tb:h,auto:r}},I=(e,t)=>{let n=l[u].dogW*_,r=.45*n,i=-.17*n*d;return[e[0]+r*Math.cos(t)-i*Math.sin(t),e[1]+r*Math.sin(t)+i*Math.cos(t)]},te=e=>{let t=e-T.t0,{ta:n,tb:r}=T,a=r+.4,o,s,c=1,l=Math.floor(e*7)%2;if(t<.3)o=T.dog0,s=ee(T.a0,T.a1,k(O(t/.3,0,1)));else if(t<n){let e=k((t-.3)/(n-.3));o=[A(T.dog0[0],T.stop[0],e),A(T.dog0[1],T.stop[1],e)],s=T.a1,c=l?.86:1.04}else if(t<n+.55){o=T.stop;let e=t-n;s=e<.32?T.a1+(l?.09:-.09):ee(T.a1,T.a2,k((e-.32)/.23))}else if(t<r){let e=k((t-n-.55)/(r-n-.55));o=[A(T.stop[0],v.rest[0],e),A(T.stop[1],v.rest[1],e)],s=T.a2,c=l?.86:1.04}else o=v.rest,s=T.a2+(Math.floor(e*5)%2?.07:-.07);j=o,M=s,S(i.dog,x[u].dog,o[0],o[1]),i.dogI&&(i.dogI.style.transform=`rotate(${(s*180/Math.PI).toFixed(1)}deg) scaleX(${c})`);let d,f=0;if(t<P){let e=t/P,n=1-(1-e)**2.2;d=[A(T.from[0],T.to[0],n),A(T.from[1],T.to[1],n)];let r=e<.56?[e/.56,1]:e<.84?[(e-.56)/.28,.36]:[(e-.84)/.16,.12];f=Math.sin(Math.PI*r[0])*r[1]*5.2*_*(u===`m`?2.2:1)}else if(t<n+.25)d=T.to;else if(t<r)d=I(o,s);else if(t<a){let e=k((t-r)/.4),n=I(o,s);d=[A(n[0],v.hand[0],e),A(n[1],v.hand[1],e)],f=Math.sin(Math.PI*e)*1.2*_}else d=v.hand;D=d,S(i.ball,x[u].hand,d[0],d[1]-f),S(i.ballS,x[u].hand,d[0]-f*.42,d[1]+f*.5),i.ballI&&(i.ballI.style.transform=`scale(${(1+f/(14*_)).toFixed(3)}) rotate(${Math.round(t<P?t*540:0)}deg)`),i.ballS&&(i.ballS.style.opacity=f>1||t<n+.25||t>=a?`1`:`0`),w(i.ch,T.auto&&t<.14?-15:T.auto&&t<.3?9:t>r&&t<a?-6:0),t>a+1.25&&performance.now()-N>6e3&&(E=(E+1)%v.targets.length,F(e,v.hand,v.targets[E],!0))},L=1.2,ne=e=>{let t=Math.floor(e/L),n=e/L-t,r=t%2==0,a=r?v.headA:v.headB,o=r?v.headB:v.headA,s=A(a[0],o[0],n),c=A(a[1],o[1],n),l=Math.hypot(o[0]-a[0],o[1]-a[1])*.2,d=Math.sin(Math.PI*n)*l,f=Math.cos(Math.PI*n)*Math.PI*l,p=Math.atan2(o[1]-a[1]-f,o[0]-a[0]);S(i.shut,x[u].head,s,c-d),S(i.shutS,x[u].head,s-d*.4,c+d*.48),i.shutI&&(i.shutI.style.transform=`rotate(${(p*180/Math.PI).toFixed(1)}deg) scale(${(1+d/(l||1)*.32).toFixed(3)})`);let m=n<.07?13:n<.2?5:0,h=n>.82?-11:n>.5?-4:0;w(i.pa,r?m:h),w(i.pb,r?-h:-m)},re=e=>{let t=l[u],n=Math.PI*2/12.5,r=b(t.kite),a=r[0]+t.kite[2]*o/100*Math.sin(n*e),c=r[1]+t.kite[3]*s/100*Math.sin(2*n*e+.6),d=16+11*Math.cos(n*e)+5*Math.sin(2*n*e);S(i.kite,x[u].kite,a,c),S(i.kiteS,x[u].kiteS,a+t.kiteOff[0]*_,c+t.kiteOff[1]*_),i.kiteI&&(i.kiteI.style.transform=`rotate(${d.toFixed(1)}deg)`),i.kiteSI&&(i.kiteSI.style.transform=`rotate(${d.toFixed(1)}deg)`);let p=t.kiteW*_*f*.47,m=d*Math.PI/180,h=a-Math.sin(m)*p,g=c+Math.cos(m)*p;for(let e of[i.strD,i.strM])e&&(e.setAttribute(`x1`,v.spool[0].toFixed(1)),e.setAttribute(`y1`,v.spool[1].toFixed(1)),e.setAttribute(`x2`,h.toFixed(1)),e.setAttribute(`y2`,g.toFixed(1)));w(i.fl,Math.round(Math.sin(n*e)*2)*4)},R=-1,z=[0,1,0,2,3,2,3,4,3,5,4,5,6,5,4,3,4,2,1,2],ie=e=>{let t=Math.floor(e/2.3)%z.length;t!==R&&(R=t,i.count&&(i.count.textContent=String(le.current+z[t])))},ae=()=>{o=e.clientWidth,s=e.clientHeight,u=o<=640?`m`:`d`,_=o/100;let t=l[u];v={hand:y(c.child[u],c.child.ar,h[0],h[1],o,s),child:b(c.child[u]),rest:b(t.rest),targets:t.targets.map(b),headA:y(c.playera[u],c.playera.ar,p[0],p[1],o,s),headB:y(c.playerb[u],c.playerb.ar,m[0],m[1],o,s),spool:y(c.flyer[u],c.flyer.ar,g[0],g[1],o,s)},j=v.rest,D=v.hand},B=0,V=0,H=0,U=!0,W=()=>{te(B),ne(B),re(B),ie(B)},G=e=>{H=requestAnimationFrame(G);let t=Math.min(.05,(e-V)/1e3);V=e,B+=t*ce.current,W()},K=()=>{cancelAnimationFrame(H),e.dataset.live=U&&!document.hidden?`1`:`0`,!(a||!U||document.hidden)&&(V=performance.now(),H=requestAnimationFrame(G))},q=()=>{ae(),M=Math.atan2(v.rest[1]-v.targets[0][1],v.rest[0]-v.targets[0][0]),F(B,v.hand,v.targets[E],!0),a?(T.t0=B-1e4,W()):(T.t0=B-(T.ta+.6),W())};q(),J.current=()=>{N=performance.now();let e=0,t=-1;if(v.targets.forEach((n,r)=>{let i=Math.hypot(n[0]-D[0],n[1]-D[1]);i>t&&(t=i,e=r)}),E=e,se.current(),a){D=v.targets[e];let t=Math.atan2(D[1]-v.rest[1],D[0]-v.rest[0]),n=l[u].dogW*_*.46,r=[D[0]-Math.cos(t)*n,D[1]-Math.sin(t)*n];S(i.dog,x[u].dog,r[0],r[1]),i.dogI&&(i.dogI.style.transform=`rotate(${(t*180/Math.PI).toFixed(1)}deg)`),S(i.ball,x[u].hand,D[0],D[1]),S(i.ballS,x[u].hand,D[0],D[1]);return}F(B,[D[0],D[1]],v.targets[e],!1)};let Y=Array.from(e.querySelectorAll(`.cmn-p[data-id]`)),X=t=>{if(t.pointerType===`touch`)return;let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/n.width*o,i=(t.clientY-n.top)/n.height*s;for(let e of Y){let t=c[e.dataset.id]?.[u];if(!t)continue;let n=Math.hypot(t[0]*o/100-r,t[1]*s/100-i)<8.5*_*(u===`m`?2.2:1);e.dataset.near===`1`!==n&&(e.dataset.near=n?`1`:`0`)}},ue=()=>Y.forEach(e=>e.dataset.near===`1`&&(e.dataset.near=`0`)),Z=()=>{N=performance.now()},de=new ResizeObserver(()=>{(e.clientWidth!==o||e.clientHeight!==s)&&q()});de.observe(e);let Q=new IntersectionObserver(([e])=>{U=e.isIntersecting,K()});return Q.observe(e),document.addEventListener(`visibilitychange`,K),e.addEventListener(`pointermove`,X),e.addEventListener(`pointerleave`,ue),e.addEventListener(`pointerdown`,Z),e.addEventListener(`keydown`,Z),K(),()=>{cancelAnimationFrame(H),de.disconnect(),Q.disconnect(),document.removeEventListener(`visibilitychange`,K),e.removeEventListener(`pointermove`,X),e.removeEventListener(`pointerleave`,ue),e.removeEventListener(`pointerdown`,Z),e.removeEventListener(`keydown`,Z),J.current=null}},[]);let Z=e=>{e.preventDefault();let t=String(new FormData(e.currentTarget).get(`q`)??``).trim();K?.(t)},de=e=>({"--x":e.d[0],"--y":e.d[1],"--r":e.d[2],"--w":e.d[3],"--mx":e.m?.[0]??0,"--my":e.m?.[1]??0,"--mr":e.m?.[2]??0,"--mw":e.m?.[3]??0,aspectRatio:`1 / ${e.ar}`}),Q=(e,t,n,r)=>({"--bx":e[0],"--by":e[1],"--mbx":t[0],"--mby":t[1],"--w":n,"--mw":r}),$=(e,t)=>(0,a.jsx)(`ellipse`,{cx:e[0],cy:e[1],rx:e[2],ry:e[3],transform:`rotate(${e[4]} ${e[0]} ${e[1]})`},t);return(0,a.jsxs)(`div`,{ref:oe,className:`cmn-root`,"data-live":`1`,style:{"--cmn-lawn":F,"--cmn-pace":ue},children:[(0,a.jsx)(`style`,{children:N}),(0,a.jsxs)(`svg`,{className:`cmn-ground`,viewBox:`0 0 1600 1000`,preserveAspectRatio:`xMidYMid slice`,"aria-hidden":!0,children:[(0,a.jsx)(`g`,{className:`cmn-patch`,children:T.map((e,t)=>(0,a.jsx)(`ellipse`,{cx:e[0],cy:e[1],rx:e[2],ry:e[3],transform:`rotate(${e[4]} ${e[0]} ${e[1]})`},t))}),(0,a.jsx)(`path`,{className:`cmn-ticks`,d:C}),w.map((e,t)=>(0,a.jsxs)(`g`,{children:[(0,a.jsx)(`circle`,{cx:e[0],cy:e[1],r:e[2],fill:`#fbf6e6`}),(0,a.jsx)(`circle`,{cx:e[0],cy:e[1],r:_(e[2]*.4),fill:`#f0c23c`})]},t))]}),(0,a.jsxs)(`svg`,{className:`cmn-path`,viewBox:`0 0 300 330`,"aria-hidden":!0,children:[(0,a.jsx)(`path`,{d:`M34 345C66 232 168 132 316 96`,stroke:`#d9c48d`,strokeWidth:`56`,fill:`none`}),(0,a.jsx)(`path`,{d:`M34 345C66 232 168 132 316 96`,stroke:`#eadab0`,strokeWidth:`48`,fill:`none`}),(0,a.jsx)(`path`,{d:`M34 345C66 232 168 132 316 96`,stroke:`#d9c48d`,strokeWidth:`2.2`,strokeDasharray:`1 13`,strokeLinecap:`round`,fill:`none`,transform:`translate(-7 -5)`}),(0,a.jsx)(`path`,{d:`M34 345C66 232 168 132 316 96`,stroke:`#d9c48d`,strokeWidth:`2.6`,strokeDasharray:`1 17`,strokeLinecap:`round`,fill:`none`,transform:`translate(9 7)`})]}),(0,a.jsx)(`div`,{className:`cmn-p cmn-blanket`,style:{"--x":14.6,"--y":32.2,"--r":-8,"--w":10.4,"--mx":26,"--my":37.8,"--mr":-8,"--mw":27,aspectRatio:`1 / 1.66`},"aria-hidden":!0,children:(0,a.jsxs)(`div`,{className:`cmn-pi`,children:[(0,a.jsx)(`span`,{className:`cmn-stripes`}),(0,a.jsxs)(`svg`,{className:`cmn-hat`,viewBox:`0 0 40 40`,children:[(0,a.jsx)(`circle`,{cx:`20`,cy:`20`,r:`19`,fill:`#e9b53a`}),(0,a.jsx)(`circle`,{cx:`20`,cy:`20`,r:`10.5`,fill:`#d9a22c`}),(0,a.jsx)(`circle`,{cx:`20`,cy:`20`,r:`10.5`,fill:`none`,stroke:`#e4553a`,strokeWidth:`2.6`})]})]})}),(0,a.jsx)(`div`,{className:`cmn-p cmn-towel`,"data-m":`0`,style:{"--x":61,"--y":80.5,"--r":82,"--w":6.4,"--mx":0,"--my":0,"--mr":0,"--mw":0,aspectRatio:`1 / 1.86`},"aria-hidden":!0,children:(0,a.jsx)(`div`,{className:`cmn-pi`})}),(0,a.jsx)(`div`,{className:`cmn-mv cmn-gs`,"data-mv":`ball-s`,style:Q(x.d.hand,x.m.hand,l.d.ballW,l.m.ballW),"aria-hidden":!0,children:(0,a.jsx)(`div`,{className:`cmn-mvi`})}),(0,a.jsx)(`div`,{className:`cmn-mv cmn-gs`,"data-mv":`shut-s`,style:Q(x.d.head,x.m.head,l.d.shW*.8,l.m.shW*.8),"aria-hidden":!0,children:(0,a.jsx)(`div`,{className:`cmn-mvi`})}),(0,a.jsx)(`div`,{className:`cmn-p cmn-hoop`,style:{"--x":c.child.d[0],"--y":v(c.child.d[1]-.3),"--r":0,"--w":5,"--mx":c.child.m[0],"--my":v(c.child.m[1]-.3),"--mr":0,"--mw":15,aspectRatio:`1 / 1`},"aria-hidden":!0,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 100 100`,children:[(0,a.jsx)(`circle`,{cx:`50`,cy:`50`,r:`45`,fill:`none`,stroke:`#e4553a`,strokeWidth:`6`}),(0,a.jsx)(`circle`,{cx:`50`,cy:`50`,r:`45`,fill:`none`,stroke:`#f6ecd6`,strokeWidth:`6`,strokeDasharray:`14 33.1`})]})}),s.map(e=>(0,a.jsx)(`div`,{className:`cmn-p cmn-fig`,"data-id":e.id,"data-m":e.m?`1`:`0`,"data-near":`0`,style:de(e),children:(0,a.jsxs)(`div`,{className:`cmn-pi`,children:[(0,a.jsx)(`img`,{src:Y[e.id],alt:``,draggable:!1,decoding:`async`}),e.id===`reader`?(0,a.jsx)(`span`,{className:`cmn-page`,"aria-hidden":!0}):null,e.id===`sunbather`?(0,a.jsxs)(`span`,{className:`cmn-notes`,"aria-hidden":!0,children:[(0,a.jsx)(`i`,{children:`♪`}),(0,a.jsx)(`i`,{children:`♫`})]}):null]})},e.id)),(0,a.jsx)(`div`,{className:`cmn-mv cmn-dog`,"data-mv":`dog`,style:Q(x.d.dog,x.m.dog,l.d.dogW,l.m.dogW),"aria-hidden":!0,children:(0,a.jsx)(`div`,{className:`cmn-mvi`,children:(0,a.jsx)(`img`,{src:z,alt:``,draggable:!1,decoding:`async`})})}),(0,a.jsx)(`button`,{type:`button`,className:`cmn-mv cmn-ball`,"data-mv":`ball`,style:Q(x.d.hand,x.m.hand,l.d.ballW,l.m.ballW),"aria-label":`Throw the ball for the dog`,onClick:()=>J.current?.(),children:(0,a.jsx)(`span`,{className:`cmn-mvi`,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 40 40`,"aria-hidden":!0,children:[(0,a.jsx)(`circle`,{cx:`20`,cy:`20`,r:`19`,fill:`#e4553a`}),(0,a.jsx)(`path`,{d:`M3 14C14 20 26 20 37 14`,stroke:`#f6ecd6`,strokeWidth:`5`,fill:`none`}),(0,a.jsx)(`path`,{d:`M5 30C14 25 26 25 35 30`,stroke:`#f6ecd6`,strokeWidth:`3`,fill:`none`})]})})}),(0,a.jsx)(`div`,{className:`cmn-mv cmn-shut`,"data-mv":`shut`,style:Q(x.d.head,x.m.head,l.d.shW,l.m.shW),"aria-hidden":!0,children:(0,a.jsx)(`div`,{className:`cmn-mvi`,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 44 30`,children:[(0,a.jsx)(`path`,{d:`M30 15 4 2V28Z`,fill:`#fbf6e6`}),(0,a.jsx)(`path`,{d:`M30 15 4 2M30 15 4 10.5M30 15 4 19.5M30 15 4 28`,stroke:`#c9d3e6`,strokeWidth:`1.3`,fill:`none`}),(0,a.jsx)(`circle`,{cx:`35`,cy:`15`,r:`7.5`,fill:`#f6ecd6`}),(0,a.jsx)(`path`,{d:`M31 8.6V21.4`,stroke:`#e4553a`,strokeWidth:`2.4`})]})})}),(0,a.jsxs)(`svg`,{className:`cmn-shade`,viewBox:`0 0 1000 800`,preserveAspectRatio:`none`,"aria-hidden":!0,children:[(0,a.jsxs)(`g`,{fill:`#8db06a`,children:[(0,a.jsx)(`g`,{className:`cmn-sh0`,children:(0,a.jsx)(`path`,{d:E.mass})}),(0,a.jsx)(`g`,{className:`cmn-sh1`,children:E.edge.map($)}),(0,a.jsx)(`g`,{className:`cmn-sh2`,children:E.a.map($)}),(0,a.jsx)(`g`,{className:`cmn-sh3`,children:E.b.map($)})]}),(0,a.jsx)(`g`,{className:`cmn-sh4`,fill:`#ffffff`,children:E.holes.map($)})]}),(0,a.jsx)(`div`,{className:`cmn-cloud`,"aria-hidden":!0}),(0,a.jsx)(`div`,{className:`cmn-cloud cmn-cloud-b`,"aria-hidden":!0}),(0,a.jsx)(`div`,{className:`cmn-mv cmn-kite-s`,"data-mv":`kite-s`,style:Q(x.d.kiteS,x.m.kiteS,l.d.kiteW*.8,l.m.kiteW*.8),"aria-hidden":!0,children:(0,a.jsx)(`div`,{className:`cmn-mvi`,style:{transform:`rotate(27deg)`},children:(0,a.jsx)(j,{flat:!0})})}),(0,a.jsxs)(`svg`,{className:`cmn-strings`,"aria-hidden":!0,children:[(0,a.jsx)(`line`,{className:`cmn-str-d`,x1:`${x.d.spool[0]}%`,y1:`${x.d.spool[1]}%`,x2:`${x.d.tip[0]}%`,y2:`${x.d.tip[1]}%`}),(0,a.jsx)(`line`,{className:`cmn-str-m`,x1:`${x.m.spool[0]}%`,y1:`${x.m.spool[1]}%`,x2:`${x.m.tip[0]}%`,y2:`${x.m.tip[1]}%`})]}),(0,a.jsx)(`div`,{className:`cmn-mv cmn-kite`,"data-mv":`kite`,style:Q(x.d.kite,x.m.kite,l.d.kiteW,l.m.kiteW),"aria-hidden":!0,children:(0,a.jsxs)(`div`,{className:`cmn-mvi`,style:{transform:`rotate(27deg)`},children:[(0,a.jsx)(j,{}),(0,a.jsxs)(`svg`,{className:`cmn-tail`,viewBox:`0 0 40 80`,children:[(0,a.jsx)(`path`,{d:`M20 0C8 14 32 26 20 40S8 62 20 78`,stroke:`#f6ecd6`,strokeWidth:`2`,fill:`none`}),(0,a.jsx)(`path`,{d:`M12 16l14 8-14 4 14-8Z`,fill:`#e4553a`}),(0,a.jsx)(`path`,{d:`M12 42l14 8-14 4 14-8Z`,fill:`#e9b53a`}),(0,a.jsx)(`path`,{d:`M12 64l14 8-14 4 14-8Z`,fill:`#f6ecd6`})]})]})}),(0,a.jsx)(`div`,{className:`cmn-grain`,"aria-hidden":!0}),(0,a.jsxs)(`header`,{className:`cmn-nav`,children:[(0,a.jsx)(`a`,{className:`cmn-mark`,href:`#`,onClick:e=>e.preventDefault(),"aria-label":`Commons, home`,children:e}),(0,a.jsxs)(`nav`,{className:`cmn-links`,"aria-label":`Main`,children:[(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Parks`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Today`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Map`})]}),(0,a.jsxs)(`span`,{className:`cmn-chip`,children:[(0,a.jsx)(`i`,{"aria-hidden":!0}),u]}),(0,a.jsxs)(`form`,{className:`cmn-search`,role:`search`,onSubmit:Z,children:[(0,a.jsx)(`input`,{name:`q`,type:`search`,placeholder:b,"aria-label":b,autoComplete:`off`}),(0,a.jsx)(`button`,{type:`submit`,"aria-label":`Search`,children:(0,a.jsxs)(`svg`,{viewBox:`0 0 20 20`,"aria-hidden":!0,children:[(0,a.jsx)(`circle`,{cx:`8.6`,cy:`8.6`,r:`5.6`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.7`}),(0,a.jsx)(`path`,{d:`M12.9 12.9 17.4 17.4`,stroke:`currentColor`,strokeWidth:`1.7`,strokeLinecap:`round`})]})})]})]}),(0,a.jsxs)(`div`,{className:`cmn-copy`,children:[(0,a.jsx)(`h1`,{children:X.map((e,t)=>(0,a.jsxs)(`span`,{children:[e,` `]},t))}),(0,a.jsx)(`p`,{children:n}),(0,a.jsxs)(`button`,{type:`button`,className:`cmn-cta`,onClick:()=>G?.(),children:[r,(0,a.jsx)(`i`,{"aria-hidden":!0,children:(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,children:(0,a.jsx)(`path`,{d:`M3 8h9.5M8.6 4l4 4-4 4`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.7`,strokeLinecap:`round`,strokeLinejoin:`round`})})})]})]}),(0,a.jsxs)(`footer`,{className:`cmn-foot`,children:[(0,a.jsx)(`span`,{children:S}),(0,a.jsx)(`i`,{"aria-hidden":!0}),(0,a.jsxs)(`span`,{children:[(0,a.jsx)(`b`,{className:`cmn-count`,children:M}),` people here now`]}),(0,a.jsx)(`i`,{"aria-hidden":!0}),(0,a.jsx)(`span`,{className:`cmn-foot-3`,children:P})]})]})}var N=`
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap');

.cmn-root {
  --cmn-lawn: #a4c03a;
  --cmn-pace: 1;
  --cmn-ink: #1f4a1b;
  --cmn-cast: color-mix(in srgb, var(--cmn-lawn) 56%, #1b4a12);
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  background: var(--cmn-lawn);
  color: #fff;
  font-family: 'Figtree', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: left;
  line-height: 1.3;
  user-select: none;
  -webkit-user-select: none;
}
.cmn-root *, .cmn-root *::before, .cmn-root *::after { box-sizing: border-box; }
.cmn-root[data-live="0"] *, .cmn-root[data-live="0"] *::before, .cmn-root[data-live="0"] *::after { animation-play-state: paused !important; }

/* ---------- the grass */
.cmn-ground { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.cmn-patch { fill: color-mix(in srgb, var(--cmn-lawn) 82%, #f3f08a); opacity: .4; }
.cmn-ticks { fill: none; stroke: color-mix(in srgb, var(--cmn-lawn) 70%, #2a6a1a); stroke-width: 1.5; stroke-linecap: round; opacity: .75; }
.cmn-path { position: absolute; right: 0; bottom: 0; width: 30cqi; height: 33cqi; display: block; overflow: visible; }

/* ---------- a thing on the lawn: placed by its centre */
.cmn-p {
  --xx: var(--x); --yy: var(--y); --rr: var(--r); --ww: var(--w);
  position: absolute;
  left: calc(var(--xx) * 1%);
  top: calc(var(--yy) * 1%);
  width: calc(var(--ww) * 1cqi);
  translate: -50% -50%;
}
.cmn-pi { width: 100%; height: 100%; rotate: calc((var(--rr) + var(--j, 0) + var(--n, 0)) * 1deg); transition: rotate 140ms steps(2, jump-end), scale 140ms steps(2, jump-end); }
.cmn-fig { filter: drop-shadow(-.4cqi .48cqi 0 var(--cmn-cast)); }
.cmn-fig img, .cmn-dog img { display: block; width: 100%; height: auto; pointer-events: none; }
.cmn-fig[data-near="1"] > .cmn-pi { --n: 6; scale: 1.05; }
.cmn-fig[data-id="playera"] > .cmn-pi, .cmn-fig[data-id="playerb"] > .cmn-pi { transform-origin: 42% 44%; transition-duration: 1ms; }
.cmn-fig[data-id="playerb"] > .cmn-pi { transform-origin: 58% 44%; }
.cmn-fig[data-id="child"] > .cmn-pi { transition-duration: 1ms; }
.cmn-fig[data-id="flyer"] > .cmn-pi { transition: rotate 260ms steps(2, jump-end); }

/* the blanket, the hat on it, the towel */
.cmn-blanket .cmn-pi, .cmn-towel .cmn-pi { position: relative; border-radius: .25cqi; }
.cmn-stripes { position: absolute; inset: 0; border-radius: inherit; background:
  repeating-linear-gradient(90deg, #f6ecd6 0 15%, #6fa5d8 15% 21%, #f6ecd6 21% 25%, #6fa5d8 25% 27%); }
.cmn-stripes::before, .cmn-stripes::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2.4%; background: #2c4a8a; }
.cmn-stripes::after { top: auto; bottom: 0; }
.cmn-hat { position: absolute; right: 7%; bottom: 7%; width: 30%; height: auto; filter: drop-shadow(-.22cqi .26cqi 0 rgba(120,130,90,.55)); }
.cmn-towel .cmn-pi { background: linear-gradient(180deg, #f6ecd6 0 7%, #e4553a 7% 11%, #f6ecd6 11% 14%, #e4553a 14% 86%, #f6ecd6 86% 89%, #e4553a 89% 93%, #f6ecd6 93%); }

/* small lives of their own: breathing, eating, a page, a tune, a hoop */
.cmn-fig[data-id="sleeper"] img { animation: cmn-breathe calc(4.2s / var(--cmn-pace)) ease-in-out infinite; transform-origin: 50% 20%; }
.cmn-fig[data-id="eater"] img { animation: cmn-nod calc(3.4s / var(--cmn-pace)) steps(1) infinite; transform-origin: 50% 70%; }
.cmn-fig[data-id="cyclist"] img { animation: cmn-nod calc(5.2s / var(--cmn-pace)) steps(1) -2s infinite; transform-origin: 50% 20%; }
.cmn-fig[data-id="cards"] img { animation: cmn-deal calc(2.8s / var(--cmn-pace)) steps(1) infinite; }
.cmn-page { position: absolute; left: 49.5%; top: 14.6%; width: 27%; height: 15.4%; background: #fbf6e6; transform-origin: 0 50%; clip-path: polygon(0 12%, 100% 0, 100% 86%, 0 100%); animation: cmn-page calc(4.6s / var(--cmn-pace)) cubic-bezier(.5,0,.3,1) infinite; }
.cmn-notes { position: absolute; left: 50%; top: 0; width: 0; height: 0; rotate: -82deg; }
.cmn-notes i { position: absolute; left: 0; top: 0; font-style: normal; font-weight: 700; font-size: 1.25cqi; line-height: 1; color: #fff; opacity: 0; animation: cmn-note calc(3.2s / var(--cmn-pace)) ease-out infinite; }
.cmn-notes i + i { animation-delay: calc(-1.6s / var(--cmn-pace)); margin-left: 1.2cqi; }
.cmn-hoop { filter: drop-shadow(-.3cqi .36cqi 0 var(--cmn-cast)); }
.cmn-hoop svg { display: block; width: 100%; height: 100%; animation: cmn-hoop calc(.9s / var(--cmn-pace)) linear infinite; }
.cmn-fig[data-id="child"] img { animation: cmn-sway calc(.9s / var(--cmn-pace)) linear infinite; }

/* ---------- what the script carries */
.cmn-mv {
  --bxx: var(--bx); --byy: var(--by); --ww: var(--w);
  position: absolute;
  left: calc(var(--bxx) * 1%);
  top: calc(var(--byy) * 1%);
  width: calc(var(--ww) * 1cqi);
  translate: -50% -50%;
  will-change: transform;
}
.cmn-mvi { display: block; width: 100%; will-change: transform; }
.cmn-mvi svg { display: block; width: 100%; height: auto; overflow: visible; }
.cmn-dog { filter: drop-shadow(-.36cqi .44cqi 0 var(--cmn-cast)); }
.cmn-ball { appearance: none; border: 0; padding: 0; margin: 0; background: none; cursor: pointer; border-radius: 50%; color: inherit; font: inherit; }
.cmn-ball::before { content: ""; position: absolute; inset: -90%; border-radius: 50%; }
.cmn-ball:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
.cmn-ball:hover .cmn-mvi svg { scale: 1.14; }
.cmn-gs .cmn-mvi { aspect-ratio: 1; border-radius: 50%; background: var(--cmn-cast); }

.cmn-shade { position: absolute; left: 0; bottom: 0; width: 53%; height: 55%; display: block; overflow: visible; mix-blend-mode: multiply; transform-origin: 0 100%; animation: cmn-creep calc(38s / var(--cmn-pace)) ease-in-out infinite alternate; pointer-events: none; }
.cmn-shade g g, .cmn-sh4 { transform-box: view-box; transform-origin: 0% 100%; }
.cmn-sh0 { animation: cmn-s0 calc(9s / var(--cmn-pace)) ease-in-out infinite alternate; }
.cmn-sh1 { animation: cmn-s1 calc(6.4s / var(--cmn-pace)) ease-in-out infinite alternate; }
.cmn-sh2 { animation: cmn-s2 calc(4.9s / var(--cmn-pace)) ease-in-out infinite alternate; }
.cmn-sh3 { animation: cmn-s3 calc(5.7s / var(--cmn-pace)) ease-in-out -2s infinite alternate; }
.cmn-sh4 { animation: cmn-s2 calc(5.3s / var(--cmn-pace)) ease-in-out -1s infinite alternate-reverse; }

.cmn-cloud { position: absolute; left: 0; top: -8%; width: 56cqi; height: 116%; pointer-events: none; opacity: .9;
  background:
    radial-gradient(closest-side, rgba(38,84,22,.2), rgba(38,84,22,.17) 55%, transparent) 0 18% / 78% 44% no-repeat,
    radial-gradient(closest-side, rgba(38,84,22,.2), rgba(38,84,22,.15) 55%, transparent) 60% 62% / 70% 50% no-repeat,
    radial-gradient(closest-side, rgba(38,84,22,.17), rgba(38,84,22,.13) 55%, transparent) 10% 96% / 60% 34% no-repeat;
  translate: -110% 0; animation: cmn-cloud calc(18s / var(--cmn-pace)) linear -5s infinite; will-change: translate; }
.cmn-cloud-b { animation-delay: calc(-14s / var(--cmn-pace)); top: 2%; scale: .82 1; }

.cmn-kite-s { mix-blend-mode: multiply; }
.cmn-kite .cmn-mvi, .cmn-kite-s .cmn-mvi { position: relative; transform-origin: 50% 50%; }
.cmn-tail { position: absolute; left: 30%; top: 96%; width: 40% !important; transform-origin: 50% 0; animation: cmn-tail calc(1.7s / var(--cmn-pace)) ease-in-out infinite alternate; }
.cmn-strings { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.cmn-strings line { stroke: #fff; stroke-width: 1.1; opacity: .85; }
.cmn-str-m { display: none; }

.cmn-grain { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: multiply; opacity: .55;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .16  0 0 0 0 .3  0 0 0 0 .08  0 0 0 .62 -.2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"); }

/* ---------- the page over the lawn */
.cmn-nav { position: absolute; left: 0; right: 0; top: 0; display: flex; align-items: center; gap: 2.6cqi; padding: 2.6cqi 4.4cqi 0; z-index: 3; }
.cmn-mark { font-size: clamp(22px, 1.95cqi, 32px); font-weight: 700; letter-spacing: -.03em; color: #fff; text-decoration: none; margin-right: 2.2cqi; }
.cmn-links { display: flex; gap: 4.2cqi; }
.cmn-links a { color: #fff; text-decoration: none; font-size: clamp(13px, 1.06cqi, 17px); font-weight: 600; letter-spacing: .005em; padding: .5em 0; border-bottom: 1.5px solid transparent; transition: border-color .2s; }
.cmn-links a:hover { border-color: #fff; }
.cmn-chip { margin-left: auto; display: inline-flex; align-items: center; gap: .6em; height: 2.9em; padding: 0 1.25em 0 1.05em; border-radius: 99px; background: #fff; color: var(--cmn-ink); font-size: clamp(12px, .98cqi, 16px); font-weight: 600; white-space: nowrap; }
.cmn-chip i { width: .72em; height: .72em; border-radius: 50%; background: #f0b62e; box-shadow: 0 0 0 .22em rgba(240,182,46,.3); animation: cmn-sun calc(2.6s / var(--cmn-pace)) ease-in-out infinite alternate; }
.cmn-search { position: relative; width: 23cqi; max-width: 360px; font-size: clamp(12px, .98cqi, 16px); }
.cmn-search input { appearance: none; -webkit-appearance: none; width: 100%; height: 2.9em; border-radius: 99px; border: 1.5px solid #fff; background: rgba(255,255,255,.94); padding: 0 3em 0 1.3em; font: inherit; font-weight: 500; color: var(--cmn-ink); outline: none; box-shadow: 0 0 0 .32em rgba(255,255,255,.28); user-select: text; -webkit-user-select: text; transition: box-shadow .2s; }
.cmn-search input::placeholder { color: color-mix(in srgb, var(--cmn-ink) 58%, #fff); opacity: 1; }
.cmn-search input::-webkit-search-cancel-button { display: none; }
.cmn-search input:focus-visible { box-shadow: 0 0 0 .32em rgba(255,255,255,.6); }
.cmn-search button { appearance: none; position: absolute; right: .35em; top: 50%; translate: 0 -50%; width: 2.3em; height: 2.3em; border: 0; border-radius: 50%; background: none; color: var(--cmn-ink); display: grid; place-items: center; cursor: pointer; padding: 0; }
.cmn-search button svg { width: 1.25em; height: 1.25em; }
.cmn-nav a:focus-visible, .cmn-search button:focus-visible, .cmn-cta:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

.cmn-copy { position: absolute; left: 4.4cqi; bottom: 11%; width: 31cqi; z-index: 3; }
.cmn-copy h1 { margin: 0; font-size: clamp(27px, 2.72cqi, 46px); font-weight: 600; letter-spacing: -.03em; line-height: 1.06; color: #fff; }
.cmn-copy h1 span { display: block; white-space: nowrap; }
.cmn-copy p { margin: 1.1em 0 0; max-width: 25em; font-size: clamp(13px, 1.06cqi, 17px); font-weight: 500; line-height: 1.42; color: rgba(255,255,255,.92); }
.cmn-cta { appearance: none; margin-top: 1.6em; display: inline-flex; align-items: center; gap: .9em; height: 3.1em; padding: 0 .5em 0 1.4em; border: 0; border-radius: 99px; background: #fff; color: var(--cmn-ink); font: inherit; font-size: clamp(13px, 1.04cqi, 17px); font-weight: 600; cursor: pointer; transition: scale .2s cubic-bezier(.2,.8,.2,1); }
.cmn-cta i { width: 2.15em; height: 2.15em; border-radius: 50%; background: var(--cmn-ink); color: #fff; display: grid; place-items: center; transition: translate .2s cubic-bezier(.2,.8,.2,1); }
.cmn-cta i svg { width: 1.05em; height: 1.05em; }
.cmn-cta:hover i { translate: .15em 0; }
.cmn-cta:active { scale: .97; }

.cmn-foot { position: absolute; left: 4.4cqi; bottom: 4.1%; display: flex; align-items: center; gap: 1.3cqi; z-index: 3; font-size: clamp(11px, .88cqi, 14px); font-weight: 600; color: #fff; white-space: nowrap; }
.cmn-foot i { width: 3.4cqi; height: 1px; background: rgba(255,255,255,.75); }
.cmn-foot b { font-weight: 700; font-variant-numeric: tabular-nums; }

@keyframes cmn-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.022, 1.03); } }
@keyframes cmn-nod { 0%, 100% { transform: rotate(0deg); } 30% { transform: rotate(2.4deg); } 42% { transform: rotate(-1.6deg); } 54% { transform: rotate(0deg); } }
@keyframes cmn-deal { 0%, 100% { transform: rotate(0deg); } 40% { transform: rotate(1.3deg); } 52% { transform: rotate(-1deg); } 64% { transform: rotate(0deg); } }
@keyframes cmn-page { 0%, 62% { transform: scaleX(1); } 76% { transform: scaleX(0); } 90%, 100% { transform: scaleX(-1); } }
@keyframes cmn-note { 0% { opacity: 0; translate: 0 0; } 15% { opacity: .95; } 100% { opacity: 0; translate: 1.2cqi -3.4cqi; } }
@keyframes cmn-hoop { 0% { translate: .5cqi 0; } 12.5% { translate: .35cqi .35cqi; } 25% { translate: 0 .5cqi; } 37.5% { translate: -.35cqi .35cqi; } 50% { translate: -.5cqi 0; } 62.5% { translate: -.35cqi -.35cqi; } 75% { translate: 0 -.5cqi; } 87.5% { translate: .35cqi -.35cqi; } 100% { translate: .5cqi 0; } }
@keyframes cmn-sway { 0%, 100% { translate: -.1cqi 0; } 25% { translate: 0 -.1cqi; } 50% { translate: .1cqi 0; } 75% { translate: 0 .1cqi; } }
@keyframes cmn-creep { from { transform: scale(.985, .98); } to { transform: scale(1.045, 1.035); } }
@keyframes cmn-s0 { from { transform: rotate(-.35deg); } to { transform: rotate(.4deg); } }
@keyframes cmn-s1 { from { transform: rotate(-.9deg) translate(-4px, 3px); } to { transform: rotate(1.1deg) translate(5px, -4px); } }
@keyframes cmn-s2 { from { transform: rotate(-1.7deg) translate(-8px, 5px); } to { transform: rotate(1.9deg) translate(9px, -7px); } }
@keyframes cmn-s3 { from { transform: rotate(1.5deg) translate(7px, 6px); } to { transform: rotate(-1.6deg) translate(-8px, -6px); } }
@keyframes cmn-cloud { from { translate: -110% 0; } to { translate: 190cqi 0; } }
@keyframes cmn-hoop-m { 0% { translate: 1.4cqi 0; } 12.5% { translate: 1cqi 1cqi; } 25% { translate: 0 1.4cqi; } 37.5% { translate: -1cqi 1cqi; } 50% { translate: -1.4cqi 0; } 62.5% { translate: -1cqi -1cqi; } 75% { translate: 0 -1.4cqi; } 87.5% { translate: 1cqi -1cqi; } 100% { translate: 1.4cqi 0; } }
@keyframes cmn-cloud-m { from { translate: -110% 0; } to { translate: 240cqi 0; } }
@keyframes cmn-tail { from { transform: rotate(-16deg); } to { transform: rotate(18deg); } }
@keyframes cmn-sun { from { box-shadow: 0 0 0 .16em rgba(240,182,46,.34); } to { box-shadow: 0 0 0 .4em rgba(240,182,46,.14); } }

/* ---------- the phone: a tall crop of the same lawn */
@container (max-width: 640px) {
  .cmn-p { --xx: var(--mx); --yy: var(--my); --rr: var(--mr); --ww: var(--mw); }
  .cmn-p[data-m="0"], .cmn-path { display: none; }
  .cmn-mv { --bxx: var(--mbx); --byy: var(--mby); --ww: var(--mw); }
  .cmn-str-d { display: none; }
  .cmn-str-m { display: inline; }
  .cmn-fig { filter: drop-shadow(-1cqi 1.2cqi 0 var(--cmn-cast)); }
  .cmn-dog, .cmn-hoop { filter: drop-shadow(-.9cqi 1.1cqi 0 var(--cmn-cast)); }
  .cmn-hat { filter: drop-shadow(-.5cqi .6cqi 0 rgba(120,130,90,.55)); }
  .cmn-shade { width: 126%; height: 45%; }
  .cmn-cloud { width: 120cqi; }
  .cmn-hoop svg { animation-name: cmn-hoop-m; }
  .cmn-cloud { animation-name: cmn-cloud-m; }
  .cmn-nav { padding: 18px 5cqi 0; gap: 10px; }
  .cmn-mark { font-size: 26px; margin-right: 0; }
  .cmn-links { display: none; }
  .cmn-chip { font-size: 13px; }
  .cmn-search { width: 2.9em; font-size: 13px; }
  .cmn-search input { padding: 0; color: transparent; cursor: pointer; box-shadow: none; }
  .cmn-search input::placeholder { color: transparent; }
  .cmn-search input:focus { position: absolute; right: 0; top: 0; width: 62cqi; padding: 0 3em 0 1.2em; color: var(--cmn-ink); cursor: text; }
  .cmn-search button { right: .3em; pointer-events: none; }
  .cmn-copy { left: 5.6cqi; right: 5.6cqi; width: auto; bottom: 9.5%; }
  .cmn-copy h1 { font-size: 7.3cqi; }
  .cmn-copy p { font-size: 3.75cqi; max-width: none; margin-top: .9em; }
  .cmn-cta { font-size: 3.75cqi; margin-top: 1.3em; }
  .cmn-foot { left: 5.6cqi; bottom: 3.3%; gap: 2.6cqi; font-size: 3.05cqi; }
  .cmn-foot i { width: 5cqi; }
  .cmn-foot i + span + i, .cmn-foot-3 { display: none; }
  .cmn-notes i { font-size: 3.4cqi; }
}

@media (prefers-reduced-motion: reduce) {
  .cmn-root *, .cmn-root *::before, .cmn-root *::after { animation: none !important; transition-duration: 1ms !important; }
  .cmn-cloud { translate: 62cqi 0; }
  .cmn-cloud-b { display: none; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(M,{})}));