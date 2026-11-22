import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=[{label:`Primes proof`,q:`Prove there are infinitely many primes.`,a:`Suppose there were only finitely many: p₁, p₂, …, pₙ. Let N = p₁·p₂·…·pₙ + 1. Dividing N by any pᵢ leaves a remainder of 1, so none of them divides it. But every integer above 1 has a prime factor, so N has one that is not on the list. The list was never complete.`},{label:`Refund reply`,q:`A customer was charged twice. Draft the reply.`,a:`Hi Dana, you are right, and I am sorry: order 4417 was charged twice on 14 November. I have refunded the second charge of $48.00 in full, and it will be back on your card within 3 to 5 business days. I have also added a $10 credit to your account. Nothing else is needed from you.`},{label:`Two-sum in O(n)`,q:`Make this two-sum loop run in O(n).`,a:`Walk the array once with a hash map from value to index. For each x, look up target − x: if it is already in the map, return both indices; if it is not, store x and move on. Every lookup is O(1), so the whole pass is O(n) time and O(n) space, down from O(n²).`},{label:`Blue sky`,q:`Why is the sky blue, but sunsets red?`,a:`Air scatters short wavelengths far more than long ones (Rayleigh scattering goes as 1/λ⁴). At noon that scattered blue reaches you from every direction. At sunset the light crosses up to 40 times more air, so the blue is scattered away before it arrives, and what is left is orange and red.`}];function s(e){let t=[];for(let n of e.match(/\S+\s*/g)??[]){let e=n.trimEnd();if(e.length>7){let r=Math.ceil(e.length/2);t.push(n.slice(0,r),n.slice(r))}else t.push(n)}return t}var c=92,l=180,u=620,d=[.991,1.012,.984,1.004,1.021,.997,.978,1.009,1.016,.989,1.002,.995,1.024,.981,1.007,.999,1.013,.986,1.003,1.018,.992,.976,1.01,1.001,.988,1.015,.996,1.006];function f({value:e}){let t=Math.round(e).toLocaleString(`en-US`),n=t.split(``);return(0,a.jsx)(`span`,{className:`qa-odo`,role:`img`,"aria-label":`${t} tokens per second`,children:n.map((e,t)=>/\d/.test(e)?(0,a.jsx)(`span`,{className:`qa-dig`,"aria-hidden":!0,children:(0,a.jsx)(`span`,{style:{transform:`translateY(${-Number(e)*10}%)`},children:`0123456789`.split(``).map(e=>(0,a.jsx)(`b`,{children:e},e))})},n.length-t):(0,a.jsx)(`span`,{className:`qa-sep`,"aria-hidden":!0,children:e},`s${t}`))})}function p({brand:e=`Quanta`,model:t=`Quanta 3`,tps:n=1240,tone:r=`#1230d0`,accent:p=`#d4ff3a`,ask:h=0,cta:g=`Get an API key`,onCta:_,sound:v=!0}){let y=(0,i.useRef)(null),b=(0,i.useRef)(null),x=(0,i.useRef)(null),S=(0,i.useRef)(null),C=(0,i.useRef)(null),w=(0,i.useRef)(!1),T=(0,i.useRef)(0),E=(0,i.useRef)(0),ee=(0,i.useRef)(n),D=(0,i.useRef)(p);ee.current=n,D.current=p;let O=(0,i.useMemo)(()=>o.map(e=>s(e.a)),[]),k=Math.abs(h)%o.length,[A,j]=(0,i.useState)(k),[M,N]=(0,i.useState)(0),[P,F]=(0,i.useState)(O[k].length),[I,L]=(0,i.useState)(O[k].length),[te,ne]=(0,i.useState)(0),R=O[A],z=R.length,B=(l+z/n*1e3)/1e3,V=(u+z/c*1e3)/1e3,H=P>=z,U=I>=z,W=(0,i.useCallback)(e=>{if(!(!v||!w.current||document.documentElement.dataset.cdMute===`1`))try{if(!C.current){let e=window.AudioContext||window.webkitAudioContext;if(!e)return;C.current=new e}let t=C.current;t.state===`suspended`&&t.resume();let n=t.currentTime;(e===`land`?[0,.011,.022,.033,.044]:[0]).forEach((r,i)=>{let a=t.createOscillator(),o=t.createGain();a.type=e===`land`?`sine`:`triangle`,a.frequency.setValueAtTime(e===`land`?1900+i*240:620,n+r),o.gain.setValueAtTime(1e-4,n+r),o.gain.exponentialRampToValueAtTime(e===`land`?.03:.05,n+r+.003),o.gain.exponentialRampToValueAtTime(1e-4,n+r+(e===`land`?.012:.04)),a.connect(o).connect(t.destination),a.start(n+r),a.stop(n+r+.05)})}catch{}},[v]),G=(0,i.useCallback)(e=>{E.current=performance.now(),T.current=performance.now(),j(e),N(e=>e+1)},[]);(0,i.useEffect)(()=>{if(M===0)return;let e=O[A].length;if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches){F(e),L(e);return}let t=e/ee.current*1e3,n=e/c*1e3,r=performance.now(),i=0,a=!1;F(0),L(0);let o=s=>{let c=s-r,d=c<l?0:Math.min(e,Math.ceil((c-l)/t*e)),f=c<u?0:Math.min(e,Math.floor((c-u)/n*e));F(d),L(f),d>=e&&!a&&(a=!0,W(`land`)),f<e&&(i=requestAnimationFrame(o))};return i=requestAnimationFrame(o),()=>cancelAnimationFrame(i)},[M]),(0,i.useEffect)(()=>{let e=y.current;if(!e||window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let t=!0,n=new IntersectionObserver(([e])=>t=e.isIntersecting);n.observe(e);let r=k,i=window.setTimeout(()=>G(r),900),a=window.setInterval(()=>{!t||document.hidden||performance.now()-E.current<6400||(r=(r+1)%o.length,G(r))},800),s=window.setInterval(()=>t&&!document.hidden&&ne(e=>e+1),1100);return()=>{n.disconnect(),window.clearTimeout(i),window.clearInterval(a),window.clearInterval(s)}},[k,G]),(0,i.useEffect)(()=>()=>void C.current?.close(),[]),(0,i.useEffect)(()=>{let e=y.current,t=b.current,n=x.current,r=S.current;if(!e||!t||!n||!r)return;let i=t.getContext(`2d`),a=n.getContext(`2d`);if(!i||!a)return;let o=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,s=20261118,c=()=>((s=s*16807%2147483647)-1)/2147483646,l=()=>(c()+c()+c()+c()-2)*1.732,u=[[1,.003,.36,1],[1,.03,.18,.55],[.905,.011,.12,.6],[1.09,.016,.11,.5],[.79,.045,.08,.32],[2.5,.12,.15,.62]],d=e.clientWidth<640?5200:10500,f=new Float32Array(d+640),p=new Float32Array(d+640),m=new Float32Array(d+640),h=new Float32Array(d),g=new Float32Array(d+640),_=new Float32Array(d),v=new Float32Array(d),C=0;u.forEach(([e,t,n,r],i)=>{let a=i===u.length-1?d-C:Math.round(d*n);for(let n=0;n<a&&C<d;n++,C++){let n=e+l()*t;f[C]=c()*Math.PI*2,p[C]=n,m[C]=l()*t*.45,h[C]=n**-1.5*(1+l()*.03),g[C]=.7+c()**3*1.5,_[C]=r*(.45+c()*.55),v[C]=c()<.07?3.5+c()*4:.75}});for(let e=0;e<640;e++)f[d+e]=-Math.abs(l())*.035-c()**2.2*.9,p[d+e]=1+l()*.006,m[d+e]=l()*.003,g[d+e]=.9+c()*1.2;let w=new Float32Array(1680);for(let e=0;e<420;e++)w[e*4]=Math.PI*(.12+c()*.76),w[e*4+1]=6+c()*7,w[e*4+2]=-.4+c()**1.4*5.6,w[e*4+3]=.12+c()**3*.6;let E=e=>{let t=document.createElement(`canvas`);t.width=t.height=64;let n=t.getContext(`2d`);if(n){let t=n.createRadialGradient(32,32,0,32,32,32);t.addColorStop(0,e),t.addColorStop(.42,e),t.addColorStop(1,`rgba(255,255,255,0)`),n.globalAlpha=.95,n.fillStyle=t,n.fillRect(0,0,64,64)}return t},O=E(`#ffffff`),k=D.current,A=E(k),j=0,M=0,N=1,P=0,F=0,I=1e3,L=.31,te=2.25,ne=()=>{j=e.clientWidth,M=e.clientHeight,N=Math.min(2,window.devicePixelRatio||1),j*M*N*N>34e5&&(N=Math.max(1,Math.sqrt(34e5/(j*M))));for(let e of[t,n])e.width=Math.round(j*N),e.height=Math.round(M*N);P=r.offsetLeft,F=r.offsetTop,I=r.offsetWidth*2.27,L=Math.max(.1,r.offsetHeight/100),(o||!re)&&de(performance.now())},R=0,z=0,B=0,V=0,H=1,U=0,W=1,G=0,K=.31,q=0,J=0,Y=0,X=0,Z=(e,t,n)=>{let r=t*Math.cos(e),i=t*Math.sin(e),a=r*H-i*U,o=r*U+i*H,s=n-K,c=o+te,l=c*W-s*G;return Y=l,X=o>0?0:1,l<.1?!1:(q=P+I*a/l,J=F-I*(s*W+c*G)/l,!0)},re=!0,ie=0,ae=performance.now(),oe=ae,Q=-Math.PI/2-.2,$=4,se=0,ce=[.34,.6,.95],le=[1,1.25,1.7],ue=(e,t,n)=>{let r=0,o=0,s=!1;for(let c=0;c<=150;c++){let l=c/150*Math.PI*2,u=Z(l,e,0);if(u&&s){let e=X?a:i,s=.009*I*Math.abs(1/Y-.345);e.lineWidth=Math.max(1,n*I/Y+s*2),e.strokeStyle=`rgba(255,255,255,${(t/(1+s*.5)).toFixed(4)})`,e.beginPath(),e.moveTo(r,o),e.lineTo(q,J),e.stroke()}r=q,o=J,s=u}},de=t=>{let n=o?.016:Math.min(.05,(t-ae)/1e3);ae=t,B+=(R-B)*.06,V+=(z-V)*.06,e.style.setProperty(`--qa-px`,B.toFixed(3)),e.style.setProperty(`--qa-py`,V.toFixed(3));let r=B*.075;K=L-V*.05;let s=Math.atan2(K,te);W=Math.cos(s),G=Math.sin(s),H=Math.cos(r),U=Math.sin(r);let c=T.current?(t-T.current)/1e3:99,l=o?1:1+2.4*Math.exp(-(t-oe)/900),u=.34*(Math.max(200,ee.current)/1240)**.6*(1+1.7*Math.exp(-c/.5))*l,y=o?1:Math.min(1,(t-oe)/1300),b=.024;for(let e of[i,a])e.setTransform(N,0,0,N,0,0),e.clearRect(0,0,j,M),e.globalCompositeOperation=`lighter`,e.lineCap=`round`,e.globalAlpha=1;i.fillStyle=`#fff`;for(let e=0;e<420;e++)Z(w[e*4],w[e*4+1],w[e*4+2])&&(q<0||q>j||J<0||J>M||(i.globalAlpha=w[e*4+3]*y*.5,i.fillRect(q,J,1.3,1.3)));i.globalAlpha=y,a.globalAlpha=y,L<.5&&ue(4.4,.14,.0018),ue(1,.045,.05),ue(1,.1,.014),ue(1,.34,.0012);let x=[new Path2D,new Path2D,new Path2D],S=[new Path2D,new Path2D,new Path2D];for(let e=0;e<d;e++){let t=h[e]*u,r=f[e]+t*n;r>6.2831853&&(r-=6.2831853),f[e]=r;let o=p[e];if(!Z(r,o,m[e]))continue;let s=q,c=J;if(s<-90||s>j+90||c<-90||c>M+90||o>2&&!X)continue;let l=.009*I*Math.abs(1/Y-.345),d=g[e]*.5+l,C=X?a:i;if(d<1.9){let n=_[e]>.7?2:+(_[e]>.42),i=X?S[n]:x[n];Z(r-t*b,o,m[e]),i.moveTo(q,J),i.lineTo(s+.01,c)}else{Z(r-t*b*1.6,o,m[e]);let n=s-q,i=c-J,a=Math.sqrt(n*n+i*i)||.001,l=Math.min(d,90)*2,u=(a+l)/64,f=l/64,p=n/a,h=i/a;C.globalAlpha=Math.min(1,_[e]*v[e]*(1.5/(1+d*d/3.2))+.006)*y,C.setTransform(N*p*u,N*h*u,-N*h*f,N*p*f,N*(s+q)*.5,N*(c+J)*.5),C.drawImage(O,-32,-32)}}i.setTransform(N,0,0,N,0,0),a.setTransform(N,0,0,N,0,0);for(let e=0;e<3;e++)for(let[t,n]of[[i,x[e]],[a,S[e]]])t.globalAlpha=y,t.lineWidth=le[e],t.strokeStyle=`rgba(255,255,255,${ce[e]})`,t.stroke(n);T.current&&T.current!==se&&(se=T.current,Q=Math.PI-.42,$=10.5);let C=o?.9:Math.min(1,Math.max(0,1.25-c/3.2));if(C>.01){o||($+=(u-$)*(1-Math.exp(-n/.7)),Q+=$*n),D.current!==k&&(k=D.current,A=E(k));let e=new Path2D,t=new Path2D;for(let n=0;n<640;n++){let r=Q+f[d+n]*(.35+Math.min(1,$/6));if(!Z(r,p[d+n],m[d+n]))continue;let o=q,s=J;if(o<-70||o>j+70||s<-70||s>M+70)continue;let c=.009*I*Math.abs(1/Y-.345),l=g[d+n]*.5+c;if(l<2.2){let i=X?t:e;Z(r-$*b,p[d+n],m[d+n]),i.moveTo(q,J),i.lineTo(o+.01,s)}else{let e=X?a:i,t=Math.min(l,60)*2;e.globalAlpha=Math.min(1,2.6/(1+l*l/6)+.04)*C,e.drawImage(A,o-t/2,s-t/2,t,t)}}for(let[n,r]of[[i,e],[a,t]])n.globalAlpha=C,n.lineWidth=1.9,n.strokeStyle=k,n.stroke(r);let r=.16+Math.min(1,$/6)*.75,s=0,c=0,l=!1;for(let e=0;e<=30;e++){let t=Z(Q-e/30*r,1,0);if(t&&l){let t=X?a:i,n=.009*I*Math.abs(1/Y-.345),r=(1-e/30)*(1-e/30);t.strokeStyle=k,t.lineWidth=.007*I/Y+n*1.5,t.globalAlpha=C*r*.55/(1+n*.25),t.beginPath(),t.moveTo(s,c),t.lineTo(q,J),t.stroke(),t.lineWidth=.03*I/Y+n*2.5,t.globalAlpha=C*r*.12/(1+n*.2),t.stroke()}s=q,c=J,l=t}if(Z(Q,1,0)){let e=X?a:i,t=Math.min(320,.14*I/Y);e.globalAlpha=.55*C,e.drawImage(A,q-t/2,J-t/2,t,t),e.globalAlpha=.9*C,e.drawImage(O,q-t/8,J-t/8,t/4,t/4)}}},fe=e=>{de(e),re&&!o&&(ie=requestAnimationFrame(fe))};ne();let pe=new ResizeObserver(ne);pe.observe(e);let me=new IntersectionObserver(([e])=>{re=e.isIntersecting,cancelAnimationFrame(ie),re&&!o&&(ae=performance.now(),ie=requestAnimationFrame(fe))});me.observe(e),o&&de(performance.now());let he=t=>{let n=e.getBoundingClientRect();R=((t.clientX-n.left)/n.width-.5)*2,z=((t.clientY-n.top)/n.height-.5)*2},ge=()=>{R=0,z=0};return o||(e.addEventListener(`pointermove`,he),e.addEventListener(`pointerleave`,ge)),()=>{cancelAnimationFrame(ie),pe.disconnect(),me.disconnect(),e.removeEventListener(`pointermove`,he),e.removeEventListener(`pointerleave`,ge)}},[]);let K=n*d[te%d.length],q=d.map((e,t)=>d[(te+1+t)%d.length]),J=e=>{w.current=!0,W(`click`),G(e)},Y=(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(`span`,{className:`qa-lab`,children:[(0,a.jsx)(`i`,{className:`qa-dot`,"aria-hidden":!0}),`Live, per stream`]}),(0,a.jsxs)(`span`,{className:`qa-read`,children:[(0,a.jsx)(f,{value:K}),(0,a.jsx)(`small`,{children:`tok/s`})]})]});return(0,a.jsxs)(`div`,{ref:y,className:`qa-root`,style:{"--qa-tone":r,"--qa-accent":p},onPointerDown:()=>w.current=!0,onKeyDown:()=>w.current=!0,children:[(0,a.jsx)(`style`,{children:m}),(0,a.jsx)(`div`,{className:`qa-sky`,"aria-hidden":!0}),(0,a.jsx)(`canvas`,{ref:b,className:`qa-canvas qa-back`,"aria-hidden":!0}),(0,a.jsx)(`i`,{ref:S,className:`qa-pivot`,"aria-hidden":!0}),(0,a.jsxs)(`header`,{className:`qa-nav`,children:[(0,a.jsxs)(`a`,{className:`qa-brand`,href:`#`,"aria-label":e,children:[(0,a.jsxs)(`svg`,{viewBox:`0 0 26 26`,"aria-hidden":!0,children:[(0,a.jsx)(`ellipse`,{cx:`13`,cy:`13`,rx:`11`,ry:`4.6`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.8`,transform:`rotate(-24 13 13)`}),(0,a.jsx)(`circle`,{cx:`13`,cy:`13`,r:`2.6`,fill:`currentColor`})]}),e]}),(0,a.jsxs)(`nav`,{className:`qa-links`,"aria-label":`Main`,children:[(0,a.jsx)(`a`,{href:`#`,children:`Models`}),(0,a.jsx)(`a`,{href:`#`,children:`API`}),(0,a.jsx)(`a`,{href:`#`,children:`Pricing`}),(0,a.jsx)(`a`,{href:`#`,children:`Research`}),(0,a.jsx)(`a`,{href:`#`,children:`Docs`})]}),(0,a.jsx)(`a`,{className:`qa-signin`,href:`#`,children:`Sign in`})]}),(0,a.jsxs)(`div`,{className:`qa-mid`,children:[(0,a.jsxs)(`div`,{className:`qa-head`,children:[(0,a.jsxs)(`p`,{className:`qa-eyebrow`,children:[(0,a.jsx)(`i`,{className:`qa-dot`,"aria-hidden":!0}),t,` is live in the API`]}),(0,a.jsxs)(`h1`,{className:`qa-title`,children:[(0,a.jsx)(`span`,{children:`Frontier reasoning,`}),` `,(0,a.jsx)(`span`,{children:`at the speed of autocomplete.`})]}),(0,a.jsxs)(`p`,{className:`qa-sub`,children:[t,` thinks like the largest models and answers at `,Math.round(n).toLocaleString(`en-US`),` tokens a second, so agents, voice and search feel instant.`,(0,a.jsx)(`span`,{children:` It speaks the OpenAI API: change one line.`})]}),(0,a.jsxs)(`div`,{className:`qa-actions`,children:[(0,a.jsxs)(`button`,{type:`button`,className:`qa-cta`,onClick:()=>(W(`click`),_?.()),children:[g,(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,"aria-hidden":!0,children:(0,a.jsx)(`path`,{d:`M3 8h10M9 4l4 4-4 4`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.7`,strokeLinecap:`round`,strokeLinejoin:`round`})})]}),(0,a.jsx)(`a`,{className:`qa-ghost`,href:`#`,children:`Read the benchmarks`})]})]}),(0,a.jsxs)(`section`,{className:`qa-card${H&&M?` is-land`:``}`,"aria-label":`${t}, answering live`,children:[(0,a.jsxs)(`div`,{className:`qa-card-top`,children:[(0,a.jsxs)(`span`,{className:`qa-model`,children:[(0,a.jsx)(`i`,{className:`qa-dot`,"aria-hidden":!0}),t]}),(0,a.jsx)(`span`,{className:`qa-mini`,children:Y}),(0,a.jsx)(`span`,{className:`qa-verdict`,"data-on":U||void 0,children:U?`Answered ${(V/B).toFixed(1)}× sooner`:`Racing…`})]}),(0,a.jsxs)(`p`,{className:`qa-q`,children:[(0,a.jsx)(`span`,{"aria-hidden":!0,children:`›`}),o[A].q]}),(0,a.jsx)(`p`,{className:`qa-a`,"aria-live":`polite`,"aria-label":o[A].a,children:R.map((e,t)=>(0,a.jsx)(`span`,{className:`qa-tok`,"data-on":t<P||void 0,"aria-hidden":!0,children:e},t))}),(0,a.jsxs)(`div`,{className:`qa-race`,children:[(0,a.jsxs)(`div`,{className:`qa-lane`,"data-me":!0,children:[(0,a.jsx)(`span`,{className:`qa-who`,children:t}),(0,a.jsx)(`span`,{className:`qa-track`,"aria-hidden":!0,children:(0,a.jsx)(`i`,{style:{transform:`scaleX(${P/z})`}})}),(0,a.jsx)(`span`,{className:`qa-time`,children:H?`${z} tokens · ${B.toFixed(2)} s`:`…`})]}),(0,a.jsxs)(`div`,{className:`qa-lane`,children:[(0,a.jsx)(`span`,{className:`qa-who`,children:`Typical frontier model`}),(0,a.jsx)(`span`,{className:`qa-track`,"aria-hidden":!0,children:(0,a.jsx)(`i`,{style:{transform:`scaleX(${I/z})`}})}),(0,a.jsx)(`span`,{className:`qa-time`,children:U?`${z} tokens · ${V.toFixed(2)} s`:`${I} of ${z} tokens`})]})]}),(0,a.jsx)(`div`,{className:`qa-asks`,role:`group`,"aria-label":`Ask something else`,children:o.map((e,t)=>(0,a.jsx)(`button`,{type:`button`,"aria-pressed":t===A,onClick:()=>J(t),children:e.label},e.label))})]})]}),(0,a.jsxs)(`div`,{className:`qa-flank qa-fl`,children:[Y,(0,a.jsx)(`span`,{className:`qa-trace`,"aria-hidden":!0,children:q.map((e,t)=>(0,a.jsx)(`i`,{style:{height:`${Math.round(22+(e-.97)*1300)}%`}},t))})]}),(0,a.jsxs)(`dl`,{className:`qa-flank qa-fr`,children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`dt`,{children:`First token, p50`}),(0,a.jsx)(`dd`,{children:`180 ms`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`dt`,{children:`Context`}),(0,a.jsx)(`dd`,{children:`400k tokens`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`dt`,{children:`Per million tokens`}),(0,a.jsx)(`dd`,{children:`$0.60 in · $2.40 out`})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`dt`,{children:`Uptime, 90 days`}),(0,a.jsx)(`dd`,{children:`99.99%`})]})]}),(0,a.jsx)(`canvas`,{ref:x,className:`qa-canvas qa-front`,"aria-hidden":!0}),(0,a.jsx)(`div`,{className:`qa-grain`,"aria-hidden":!0})]})}var m=`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.qa-root {
  --qa-tone: #1230d0; --qa-accent: #d4ff3a; --qa-px: 0; --qa-py: 0;
  --qa-ink: #f4f7ff; --qa-mute: rgba(232,238,255,.72);
  --qa-deep: color-mix(in oklab, var(--qa-tone), #000 78%);
  container-type: size;
  position: relative; isolation: isolate; overflow: hidden;
  width: 100%; height: var(--design-h, 100svh); min-height: 640px;
  background: var(--qa-deep); color: var(--qa-ink);
  font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
/* Far atmosphere: the stage is one colour, lit from where the ring meets the horizon. */
.qa-sky {
  position: absolute; inset: -4%; z-index: 0; pointer-events: none;
  transform: translate3d(calc(var(--qa-px) * -1.2%), calc(var(--qa-py) * -.8%), 0);
  background:
    radial-gradient(54% 17% at 50% 60%, color-mix(in oklab, var(--qa-tone), #fff 38%) 0%, transparent 100%),
    radial-gradient(92% 74% at 50% 66%, var(--qa-tone) 0%, color-mix(in oklab, var(--qa-tone), #000 22%) 40%, color-mix(in oklab, var(--qa-tone), #000 56%) 74%, var(--qa-deep) 100%);
}
.qa-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; pointer-events: none; }
.qa-back { z-index: 1; }
.qa-front { z-index: 4; }
.qa-pivot { position: absolute; z-index: -1; left: 50%; top: 64.5cqh; width: 56cqi; height: 31px; visibility: hidden; pointer-events: none; }
.qa-grain {
  position: absolute; inset: 0; z-index: 5; pointer-events: none; opacity: .2; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
.qa-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--qa-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--qa-accent), transparent 80%); flex: none; }

/* Nav */
.qa-nav { position: absolute; z-index: 6; inset: 24px 40px auto; display: flex; align-items: center; gap: 30px; }
.qa-brand { display: inline-flex; align-items: center; gap: 9px; color: inherit; text-decoration: none; font-weight: 600; font-size: 19px; letter-spacing: -.02em; }
.qa-brand svg { width: 24px; height: 24px; }
.qa-links { display: flex; gap: 26px; margin-left: 22px; font-size: 14.5px; }
.qa-links a, .qa-signin, .qa-ghost { color: var(--qa-mute); text-decoration: none; transition: color .2s; }
.qa-links a:hover, .qa-signin:hover, .qa-ghost:hover { color: #fff; }
.qa-signin { margin-left: auto; font-size: 14.5px; }
.qa-root a:focus-visible, .qa-root button:focus-visible { outline: 2px solid var(--qa-accent); outline-offset: 3px; border-radius: 8px; }

/* The centre column: the words at the top, the console standing inside the ring. */
.qa-mid {
  position: absolute; z-index: 3; left: 50%; top: 92px; bottom: calc(32cqh - 136px); transform: translateX(-50%);
  width: min(680px, calc(100% - 40px)); display: flex; flex-direction: column; justify-content: space-between; align-items: center; gap: 18px;
}
.qa-head { display: flex; flex-direction: column; align-items: center; text-align: center; animation: qa-rise 1s cubic-bezier(.2,.8,.2,1) both; }
@keyframes qa-rise { from { opacity: 0; transform: translateY(18px); } }
.qa-eyebrow {
  margin: 0 0 16px; display: inline-flex; align-items: center; gap: 9px; height: 30px; padding: 0 13px 0 11px; border-radius: 999px;
  font-size: 13px; font-weight: 500; color: var(--qa-ink); background: rgba(255,255,255,.09); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14);
}
.qa-title { margin: 0; font-weight: 500; font-size: clamp(33px, 4.05cqi, 62px); line-height: 1.02; letter-spacing: -.04em; white-space: nowrap; }
.qa-title span { display: block; }
.qa-sub { margin: 16px 0 0; max-width: 560px; font-size: 16.5px; line-height: 1.45; color: var(--qa-mute); text-wrap: balance; }
.qa-actions { display: flex; align-items: center; gap: 20px; margin-top: 20px; }
.qa-cta {
  display: inline-flex; align-items: center; gap: 9px; height: 46px; padding: 0 20px 0 22px; border: 0; border-radius: 999px; cursor: pointer;
  font: inherit; font-size: 15px; font-weight: 600; color: color-mix(in oklab, var(--qa-tone), #000 62%); background: #fff;
  box-shadow: 0 14px 30px -14px rgba(0,0,0,.6); transition: transform .3s cubic-bezier(.3,1.5,.5,1), box-shadow .3s;
}
.qa-cta svg { width: 15px; height: 15px; transition: transform .25s; }
.qa-cta:hover svg { transform: translateX(3px); }
.qa-cta:active { transform: scale(.96); }
.qa-ghost { font-size: 15px; text-decoration: underline; text-underline-offset: 5px; text-decoration-color: rgba(255,255,255,.3); }

/* The console */
.qa-card {
  position: relative; width: 100%; padding: 16px 20px 16px; border-radius: 20px; text-align: left;
  background: color-mix(in oklab, var(--qa-deep), transparent 30%);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.13), inset 0 1px 0 rgba(255,255,255,.16), 0 40px 80px -30px rgba(0,0,10,.75);
  backdrop-filter: blur(20px) saturate(1.3); -webkit-backdrop-filter: blur(20px) saturate(1.3);
}
.qa-card::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: radial-gradient(70% 46% at 50% 108%, rgba(255,255,255,.2), rgba(255,255,255,0) 70%);
}
.qa-card.is-land::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  box-shadow: inset 0 0 0 1px var(--qa-accent), 0 0 40px -6px var(--qa-accent); animation: qa-flash .9s ease-out both;
}
@keyframes qa-flash { from { opacity: .9; } to { opacity: 0; } }
.qa-card-top { display: flex; align-items: center; gap: 14px; font-size: 13px; }
.qa-model { display: inline-flex; align-items: center; gap: 9px; font-weight: 600; }
.qa-mini { display: none; align-items: baseline; gap: 8px; margin-left: auto; font: 500 13px/1 "JetBrains Mono", ui-monospace, monospace; }
.qa-mini .qa-lab { display: none; }
.qa-verdict { margin-left: auto; font: 500 12px/1 "JetBrains Mono", ui-monospace, monospace; color: var(--qa-mute); transition: color .3s; }
.qa-verdict[data-on] { color: var(--qa-accent); }
.qa-q { margin: 14px 0 8px; display: flex; gap: 10px; font-size: 17px; font-weight: 500; letter-spacing: -.01em; }
.qa-q span { color: var(--qa-accent); }
.qa-a { margin: 0; min-height: 6.1em; font-size: 15px; line-height: 1.52; color: rgba(240,244,255,.9); white-space: pre-wrap; }
.qa-tok { opacity: 0; }
/* Each token lands hot and cools, so you can see the answer arrive. */
.qa-tok[data-on] { opacity: 1; animation: qa-cool .75s cubic-bezier(.2,.7,.3,1) both; }
@keyframes qa-cool { 0% { color: var(--qa-accent); text-shadow: 0 0 14px var(--qa-accent); } 100% { color: inherit; text-shadow: none; } }
.qa-race { display: grid; gap: 8px; margin-top: 12px; padding-top: 13px; border-top: 1px solid rgba(255,255,255,.1); font: 400 12px/1 "JetBrains Mono", ui-monospace, monospace; }
.qa-lane { display: grid; grid-template-columns: 172px 1fr 150px; align-items: center; gap: 14px; color: var(--qa-mute); }
.qa-lane[data-me] { color: var(--qa-ink); }
.qa-track { height: 4px; border-radius: 2px; background: rgba(255,255,255,.12); overflow: hidden; }
.qa-track i { display: block; height: 100%; border-radius: 2px; background: rgba(255,255,255,.55); transform-origin: left; }
.qa-lane[data-me] .qa-track i { background: var(--qa-accent); box-shadow: 0 0 10px var(--qa-accent); }
.qa-time { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.qa-asks { display: flex; gap: 7px; margin-top: 14px; }
.qa-asks button {
  height: 32px; padding: 0 13px; border: 0; border-radius: 999px; cursor: pointer; font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap;
  color: var(--qa-mute); background: rgba(255,255,255,.08); transition: background .2s, color .2s, transform .25s cubic-bezier(.3,1.5,.5,1);
}
.qa-asks button:hover { background: rgba(255,255,255,.15); color: #fff; }
.qa-asks button:active { transform: scale(.94); }
.qa-asks button[aria-pressed="true"] { background: #fff; color: color-mix(in oklab, var(--qa-tone), #000 62%); }

/* The readings beside the ring */
.qa-flank { position: absolute; z-index: 3; bottom: 32px; margin: 0; animation: qa-rise 1s .3s cubic-bezier(.2,.8,.2,1) both; }
.qa-fl { left: 40px; display: grid; gap: 9px; }
.qa-lab { display: inline-flex; align-items: center; gap: 9px; font-size: 13px; color: var(--qa-mute); }
.qa-read { display: inline-flex; align-items: baseline; gap: 10px; }
.qa-read small { font: 400 13px/1 "JetBrains Mono", ui-monospace, monospace; color: var(--qa-mute); }
.qa-odo { display: inline-flex; font-weight: 500; font-size: 46px; line-height: 1; letter-spacing: -.04em; font-variant-numeric: tabular-nums; }
.qa-dig { display: inline-block; height: 1em; overflow: hidden; }
.qa-dig > span { display: flex; flex-direction: column; transition: transform .7s cubic-bezier(.3,1.2,.4,1); }
.qa-dig b { display: block; height: 1em; font-weight: inherit; }
.qa-mini .qa-odo { font-size: 13px; letter-spacing: 0; font-family: inherit; }
.qa-trace { display: flex; align-items: flex-end; gap: 3px; height: 30px; width: 190px; }
.qa-trace i { flex: 1; min-height: 2px; border-radius: 1px; background: rgba(255,255,255,.3); transition: height .6s cubic-bezier(.3,1.2,.4,1); }
.qa-trace i:last-child { background: var(--qa-accent); }
.qa-fr { right: 40px; display: flex; gap: 34px; }
.qa-fr dt { font-size: 12.5px; color: var(--qa-mute); }
.qa-fr dd { margin: 6px 0 0; font: 500 14px/1.2 "JetBrains Mono", ui-monospace, monospace; }

@container (max-height: 800px) {
  .qa-sub span { display: none; }
  .qa-eyebrow { margin-bottom: 12px; }
  .qa-title { font-size: clamp(31px, 3.5cqi, 52px); }
  .qa-a { font-size: 14px; }
}
@container (max-height: 700px) {
  .qa-sub { display: none; }
  .qa-mid { top: 78px; }
}
@container (max-width: 1160px) {
  .qa-links { display: none; }
  .qa-flank { display: none; }
  .qa-verdict { margin-left: 0; }
  .qa-mini { display: inline-flex; }
}
@container (max-width: 640px) {
  .qa-nav { inset: 16px 20px auto; }
  .qa-pivot { top: calc(100cqh - 318px); width: 150cqi; height: 75px; }
  .qa-mid { top: 70px; bottom: 44px; width: calc(100% - 32px); gap: 14px; }
  .qa-eyebrow { height: 28px; font-size: 12.5px; margin-bottom: 12px; }
  .qa-title { font-size: 8.5cqi; white-space: normal; }
  .qa-title span { display: inline; }
  .qa-sub { font-size: 15px; margin-top: 12px; }
  .qa-sub span { display: none; }
  .qa-actions { margin-top: 16px; gap: 16px; }
  .qa-card { padding: 14px 15px; border-radius: 18px; }
  .qa-verdict { display: none; }
  .qa-q { font-size: 15.5px; line-height: 1.4; min-height: 2.8em; margin: 12px 0 6px; }
  .qa-a { font-size: 13.5px; line-height: 1.5; min-height: 10.5em; }
  .qa-lane { grid-template-columns: 1fr 1fr; gap: 6px 10px; }
  .qa-lane .qa-track { grid-column: 1 / -1; grid-row: 2; }
  .qa-asks { overflow-x: auto; margin: 12px -15px 0; padding: 0 15px; scrollbar-width: none; }
}
@media (prefers-reduced-motion: reduce) {
  .qa-head, .qa-flank, .qa-tok[data-on], .qa-card.is-land::after { animation: none; }
  .qa-card.is-land::after { opacity: 0; }
  .qa-dig > span, .qa-trace i { transition: none; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(p,{})}));