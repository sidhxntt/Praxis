import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=1536,s=1024,c=[[684,862,6.8,52],[696,832,6.6,51],[706,806,6.4,50],[715,790,6.3,49.5],[725,774,6.2,49],[737,757,6.1,48.5],[750,741,6.05,48],[773,708,5.9,47],[798,688,5.8,46],[823,670,5.7,45.5],[850,655,5.6,45],[877,641,5.5,44.5],[905,627,5.4,44],[933,613,5.3,43.5],[963.5,601,5.2,43],[1e3,592,5,42],[1074,574,4.7,39.5],[1164,552,4.2,36],[1242,534,3.6,33],[1307,518,3.1,30.5],[1330,503,2.7,29.5],[1342,488,2.4,29],[1344,474,2.3,28.5],[1336,463,2.3,28],[1320,454,2.4,27.5],[1297,446,2.6,27],[1270,440,2.7,26.5],[1244,435,2.8,26],[1215,431,2.8,26],[1185,428,2.8,25.5],[1150,425,2.8,25]],l={x0:960.5,y0:492.75,s:4,w:1387,h:415},u=[[963.5,592,5.2,43],[1074,572,4.7,39.5],[1164,551.5,4.2,36],[1242,536,3.6,33],[1307,520,3.1,30.5]],d=[[0,455],[455,815],[815,1125],[1125,1387]],f=[0,1,2,3,1,2,3,1],p=60,m=11,h=[[17,336],[86,349]],g={x0:560,x1:1260,cols:1312,midRows:618,rows:1151,midY0:400,nearY0:740,k:1.875},_=[{day:`Thu`,date:`13 Mar`,fare:310,left:4},{day:`Fri`,date:`14 Mar`,fare:340,left:2},{day:`Sat`,date:`15 Mar`,fare:385,left:1},{day:`Sun`,date:`16 Mar`,fare:295,left:6},{day:`Mon`,date:`17 Mar`,fare:260,left:9},{day:`Tue`,date:`18 Mar`,fare:260,left:8},{day:`Wed`,date:`19 Mar`,fare:275,left:7}];function v(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(n=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let r=navigator.userActivation;if(!(r&&!r.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let r=t.current??=new e;r.state===`suspended`&&r.resume();let i=r.currentTime+(n.at??0),a=Math.min(n.d??.04,.06),o=r.createGain();o.gain.setValueAtTime(1e-4,i),o.gain.exponentialRampToValueAtTime(Math.min(n.g??.035,.06),i+.005),o.gain.exponentialRampToValueAtTime(1e-4,i+a),o.connect(r.destination);let s=r.createOscillator();s.type=n.type??`sine`,s.frequency.setValueAtTime(n.f,i),n.to&&s.frequency.exponentialRampToValueAtTime(n.to,i+a),s.connect(o),s.start(i),s.stop(i+a+.01)}catch{}},[e])}function y(){let e=[],t=c.length,n=e=>c[Math.max(0,Math.min(t-1,e))];for(let r=0;r<t-1;r++){let[t,i,a,o]=[n(r-1),n(r),n(r+1),n(r+2)];for(let n=0;n<10;n++){let r=n/10,s=r*r,c=s*r,l=(e,t,n,i)=>.5*(2*t+(-e+n)*r+(2*e-5*t+4*n-i)*s+(-e+3*t-3*n+i)*c);e.push({x:l(t[0],i[0],a[0],o[0]),y:l(t[1],i[1],a[1],o[1]),m:0,h:i[3]+(a[3]-i[3])*r,g:i[2]+(a[2]-i[2])*r})}}let r=c[t-1];e.push({x:r[0],y:r[1],m:0,h:r[3],g:r[2]});for(let t=1;t<e.length;t++){let n=e[t-1],r=e[t],i=Math.hypot(r.x-n.x,r.y-n.y);r.m=n.m+i/((n.g+r.g)/2)}return e}function b(e,t){if(t<=0)return e[0];if(t>=e[e.length-1].m)return e[e.length-1];let n=0,r=e.length-1;for(;r-n>1;){let i=n+r>>1;e[i].m<t?n=i:r=i}let i=e[n],a=e[r],o=(t-i.m)/(a.m-i.m||1);return{x:i.x+(a.x-i.x)*o,y:i.y+(a.y-i.y)*o,m:t,h:i.h+(a.h-i.h)*o,g:i.g+(a.g-i.g)*o}}function x(e){let t=0;for(;t<u.length-2&&e>u[t+1][0];)t++;let n=u[t],r=u[t+1],i=(e-n[0])/(r[0]-n[0]);return{y:n[1]+(r[1]-n[1])*i,g:n[2]+(r[2]-n[2])*i,h:n[3]+(r[3]-n[3])*i}}function ee(){return d.map(([e,t])=>{let n=[],r=0;for(let i=0;i<8;i++){let a=e+(t-e)*i/8,o=e+(t-e)*(i+1)/8,s=l.x0+a/l.s,c=l.x0+o/l.s,u=x(s),d=x(c),f=Math.hypot(c-s,d.y-u.y)/((u.g+d.g)/2);n.push({sx0:a,sx1:o,m0:r,m1:r+f,hs:(u.h+d.h)/2,a:[s,u.y],b:[c,d.y]}),r+=f}return{strips:n,len:r}})}function S(e,t){let n=e<640,r=n?.68:.5,i=n?.52:.5,a=Math.max(e/o,t/s)*(n?1.08:1.06),c=o*a,l=s*a;return{s:a,ox:Math.min(0,Math.max(e-c,e/2-r*c)),oy:Math.min(0,Math.max(t-l,t/2-i*l))}}function C(e){return new Promise((t,n)=>{let r=new Image;r.crossOrigin=`anonymous`,r.decoding=`async`,r.onload=()=>t(r),r.onerror=n,r.src=e})}function te(e,t){let n=t>>>0,r=()=>(n=n*1664525+1013904223>>>0,n/4294967296),i=new Uint8Array(e*e*4);for(let t=0;t<4;t++){let n=Array.from({length:256},r),a=(e,t)=>n[(t%16+16)%16*16+(e%16+16)%16];for(let n=0;n<e;n++)for(let r=0;r<e;r++){let o=r/e*16,s=n/e*16,c=Math.floor(o),l=Math.floor(s),u=o-c,d=s-l,f=u*u*u*(u*(u*6-15)+10),p=d*d*d*(d*(d*6-15)+10),m=a(c,l)+(a(c+1,l)-a(c,l))*f,h=a(c,l+1)+(a(c+1,l+1)-a(c,l+1))*f;i[(n*e+r)*4+t]=Math.round((m+(h-m)*p)*255)}}return i}var ne=`
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`,re=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uPlate, uMask, uNoise;
uniform vec2 uRes;      // canvas css px
uniform vec3 uMap;      // ox, oy, scale (css px)
uniform vec2 uFar, uMid; // parallax offsets, css px
uniform float uT;
float fbm(vec2 p){
  return texture2D(uNoise, p).r * .5
       + texture2D(uNoise, p * 2.03 + vec2(.37, .11)).g * .27
       + texture2D(uNoise, p * 4.11 + vec2(.71, .53)).b * .15
       + texture2D(uNoise, p * 8.27 + vec2(.13, .89)).a * .08;
}
void main(){
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;
  vec2 size = vec2(${o}.0, ${s}.0) * uMap.z;
  vec2 uv0 = (px - uMap.xy) / size;
  float d = texture2D(uMask, uv0).r;
  vec2 uv = uv0 - mix(uFar, uMid, d) / size;
  vec3 col = texture2D(uPlate, uv).rgb;
  vec4 mk = texture2D(uMask, uv);
  // mist: soft banks rolling along the valley, folding over themselves
  // (the noise texture has 16 cells per repeat: q is in repeats)
  if (mk.g > .01) {
    vec2 q = vec2(uv.x * .32 - uT * .0034, uv.y * 1.05);
    float w = texture2D(uNoise, q * .45 + vec2(uT * .0012, -uT * .0008)).r;
    float n = fbm(q + vec2(w * .045, w * .016));
    float a = mk.g * smoothstep(.38, .68, n);
    float lit = clamp(1.05 - uv.x * .9, 0.0, 1.0);
    vec3 mc = mix(vec3(.82, .85, .89), vec3(1.0, .92, .82), lit);
    col = mix(col, mc, a * .82);
  }
  // cloud on the peaks: wisps drifting slowly right to left
  if (mk.b > .01) {
    vec2 q = vec2(uv.x * .38 + uT * .0026, uv.y * 1.5);
    float w = texture2D(uNoise, q * .5 - vec2(uT * .0009, 0.0)).g;
    float n = fbm(q + vec2(w * .04, w * .012));
    float a = mk.b * smoothstep(.40, .66, n);
    col = mix(col, vec3(1.0, .95, .93), a * .78);
  }
  // the low sun, breathing slowly, and shafts of its light fanning over the valley
  vec2 dir = (uv - vec2(-.02, .33)) * vec2(1.5, 1.0);
  float ang = atan(dir.y, dir.x);
  float ray = texture2D(uNoise, vec2(ang * .55 + uT * .0016, .37)).r * .65 + texture2D(uNoise, vec2(ang * 1.3 - uT * .0011, .71)).g * .35;
  float shaft = smoothstep(.48, .82, ray) * exp(-length(dir) * 2.1) * smoothstep(-.01, .08, dir.y) * (1.0 - d * .55);
  col += vec3(1.0, .76, .46) * shaft * .2;
  vec2 sp = (uv - vec2(.0, .32)) * vec2(1.1, 2.0);
  col += vec3(1.0, .70, .40) * exp(-dot(sp, sp) * 7.0) * (.09 + .035 * sin(uT * .45));
  gl_FragColor = vec4(col, 1.0);
}`;function w({brand:e=`Alpina`,cta:t=`Book a cabin`,accent:n=`#d4321c`,speed:r=1,plate:c=`/design/websites/alpina/plate.webp`,train:d=`/design/websites/alpina/train.webp`,fg:w=`/design/websites/alpina/fg.webp`,masks:E=`/design/websites/alpina/masks.webp`,sound:D=!0,onBook:O}){let k=(0,i.useId)().replace(/:/g,``),ie=(0,i.useRef)(null),ae=(0,i.useRef)(null),oe=(0,i.useRef)(null),se=(0,i.useRef)(null),ce=(0,i.useRef)(null),le=(0,i.useRef)(null),ue=(0,i.useRef)(r);ue.current=r;let A=v(D),[j,M]=(0,i.useState)(1),[N,P]=(0,i.useState)(!1),[F,I]=(0,i.useState)(1),[L,R]=(0,i.useState)(!1),z=(0,i.useRef)(0),B=(0,i.useRef)(null),V=(0,i.useRef)(null);(0,i.useEffect)(()=>{let e=ie.current,t=ae.current,n=oe.current,r=se.current,i=ce.current,a=le.current;if(!e||!t||!n||!r||!i||!a)return;let _=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,v=!1,T=0,D=!0,O=1,k=1,A=1,j=S(1440,810),M=y(),N=M[M.length-1].m,P=ee(),F=f.reduce((e,t)=>e+P[t].len,0),I=F+p,L=0;{let e=1e9;for(let t of M){let n=Math.hypot(t.x-u[0][0],t.y-u[0][1]);n<e&&(e=n,L=t.m)}}let R={tx:0,ty:0,x:0,y:0,on:!1},z=()=>{let a=e.getBoundingClientRect();O=Math.max(1,Math.round(a.width)),k=Math.max(1,Math.round(a.height)),A=Math.min(2,window.devicePixelRatio||1),t.width=Math.round(O*A),t.height=Math.round(k*A),n.width=Math.round(O*A),n.height=Math.round(k*A),j=S(O,k);let c=j.s;Object.assign(i.style,{left:`${j.ox}px`,top:`${j.oy}px`,width:`${o*c}px`,height:`${s*c}px`}),Object.assign(r.style,{left:`${j.ox+g.x0*c}px`,top:`${j.oy+g.nearY0*c}px`,width:`${(g.x1-g.x0)*c}px`,height:`${(g.rows-g.midRows)/g.k*c}px`,backgroundSize:`100% ${g.rows/(g.rows-g.midRows)*100}%`})};z();let B=new ResizeObserver(()=>{z(),X(J)});B.observe(e);let V=new IntersectionObserver(([e])=>{D=e.isIntersecting,D&&!T&&!_&&(T=requestAnimationFrame($))});V.observe(e);let H=()=>{!document.hidden&&!T&&!_&&(T=requestAnimationFrame($))};document.addEventListener(`visibilitychange`,H);let U=t.getContext(`webgl`,{antialias:!1,alpha:!1,premultipliedAlpha:!1}),W=null,G={},de=[],fe=!1;if(U){let e=(e,t)=>{let n=U.createShader(e);return U.shaderSource(n,t),U.compileShader(n),n};if(W=U.createProgram(),U.attachShader(W,e(U.VERTEX_SHADER,ne)),U.attachShader(W,e(U.FRAGMENT_SHADER,re)),U.linkProgram(W),U.getProgramParameter(W,U.LINK_STATUS)||(W=null),W){U.useProgram(W);let e=U.createBuffer();U.bindBuffer(U.ARRAY_BUFFER,e),U.bufferData(U.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),U.STATIC_DRAW);let t=U.getAttribLocation(W,`aPos`);U.enableVertexAttribArray(t),U.vertexAttribPointer(t,2,U.FLOAT,!1,0,0);for(let e of[`uPlate`,`uMask`,`uNoise`,`uRes`,`uMap`,`uFar`,`uMid`,`uT`])G[e]=U.getUniformLocation(W,e);U.pixelStorei(U.UNPACK_COLORSPACE_CONVERSION_WEBGL,U.NONE);let n=(e,t,n,r)=>{let i=U.createTexture();U.activeTexture(U.TEXTURE0+e),U.bindTexture(U.TEXTURE_2D,i),n&&r?U.texImage2D(U.TEXTURE_2D,0,U.RGBA,r,r,0,U.RGBA,U.UNSIGNED_BYTE,n):t&&U.texImage2D(U.TEXTURE_2D,0,U.RGBA,U.RGBA,U.UNSIGNED_BYTE,t);let a=!!n;a&&U.generateMipmap(U.TEXTURE_2D),U.texParameteri(U.TEXTURE_2D,U.TEXTURE_MIN_FILTER,a?U.LINEAR_MIPMAP_LINEAR:U.LINEAR),U.texParameteri(U.TEXTURE_2D,U.TEXTURE_MAG_FILTER,U.LINEAR),U.texParameteri(U.TEXTURE_2D,U.TEXTURE_WRAP_S,a?U.REPEAT:U.CLAMP_TO_EDGE),U.texParameteri(U.TEXTURE_2D,U.TEXTURE_WRAP_T,a?U.REPEAT:U.CLAMP_TO_EDGE),de.push(i)};n(2,null,te(256,11),256),Promise.all([C(c),C(E)]).then(([e,t])=>{v||!W||(U.useProgram(W),n(0,e),n(1,t),U.uniform1i(G.uPlate,0),U.uniform1i(G.uMask,1),U.uniform1i(G.uNoise,2),fe=!0,X(J))}).catch(()=>{})}}let K=n.getContext(`2d`),pe=null,q=null;C(d).then(e=>{pe=e,X(J)}).catch(()=>{}),C(w).then(e=>{q=e,X(J)}).catch(()=>{});let me=(e,t,n)=>{let r=pe;if(!K||!r)return;let i=j.s,a=r.naturalWidth/l.w,o=r.naturalHeight/l.h,s=e;f.forEach((e,c)=>{let u=P[e];if(s>N+2||s+u.len<-2){s+=u.len;return}for(let e of u.strips){let c=b(M,s+e.m0),u=b(M,s+e.m1);if(e.m1+s<0||e.m0+s>N)continue;let d=(c.h+u.h)/2,f=e.b[0]-e.a[0],p=e.b[1]-e.a[1],m=-e.hs,h=u.x-c.x,g=u.y-c.y,_=-d,v=f*m;if(Math.abs(v)<1e-6)continue;let y=m/v,x=-p/v,ee=f/v,S=h*y,C=g*y+_*x,te=_*ee,ne=c.x-(S*e.a[0]+0*e.a[1]),re=c.y-(C*e.a[0]+te*e.a[1]);K.setTransform(A*i*S,A*i*C,A*i*0,A*i*te,A*(i*ne+j.ox+t),A*(i*re+j.oy+n));let w=.9,T=Math.max(0,e.sx0-w),E=Math.min(l.w,e.sx1+w);K.drawImage(r,T*a,0,(E-T)*a,l.h*o,l.x0+T/l.s,l.y0,(E-T)/l.s,l.h/l.s)}if(c===0){let e=u.strips[0],r=b(M,s+e.m0),a=b(M,s+e.m1),o=(r.h+a.h)/2/e.hs;for(let[s,c]of h){let u=l.x0+s/l.s,d=l.y0+c/l.s,f=(u-e.a[0])/(e.b[0]-e.a[0]),p=x(u).y-d,m=r.x+(a.x-r.x)*f,h=r.y+(a.y-r.y)*f-p*o,g=(i*m+j.ox+t)*A,_=(i*h+j.oy+n)*A,v=7*o*i*A;K.setTransform(1,0,0,1,0,0);let y=K.createRadialGradient(g,_,0,g,_,v);y.addColorStop(0,`rgba(255,248,226,.95)`),y.addColorStop(.22,`rgba(255,226,170,.45)`),y.addColorStop(1,`rgba(255,200,120,0)`),K.globalCompositeOperation=`lighter`,K.fillStyle=y,K.fillRect(g-v,_-v,v*2,v*2),K.globalCompositeOperation=`source-over`}}s+=u.len})},J=_?3:0,Y={x:0,y:0},X=e=>{let o=j.s,s=Math.min(1,O/1440)*.6+.4,c={x:-Y.x*3*s,y:-Y.y*2*s},l={x:-Y.x*12*s,y:-Y.y*6*s},u={x:-Y.x*30*s,y:-Y.y*12*s};if(U&&W&&fe?(i.dataset.hide||(i.dataset.hide=`1`,i.style.opacity=`0`),U.viewport(0,0,t.width,t.height),U.uniform2f(G.uRes,O,k),U.uniform3f(G.uMap,j.ox,j.oy,o),U.uniform2f(G.uFar,c.x,c.y),U.uniform2f(G.uMid,l.x,l.y),U.uniform1f(G.uT,e),U.drawArrays(U.TRIANGLE_STRIP,0,4)):i.style.transform=`translate3d(${l.x}px, ${l.y}px, 0)`,K){K.setTransform(1,0,0,1,0,0),K.clearRect(0,0,n.width,n.height);let t=m*ue.current,r=((L-t*(e-3))%I+I)%I;for(r-=I;r<N+2;r+=I)r+F>-2&&me(r,l.x,l.y);if(q){K.setTransform(A,0,0,A,0,0);let e=q.naturalWidth/g.cols;K.drawImage(q,0,0,g.cols*e,g.midRows*e,j.ox+g.x0*o+l.x,j.oy+g.midY0*o+l.y,(g.x1-g.x0)*o,g.midRows/g.k*o)}}r.style.transform=`translate3d(${u.x}px, ${u.y}px, 0)`,a.style.transform=`translate3d(${Y.x*10*s}px, ${Y.y*5*s}px, 0)`},Z=performance.now(),Q=Z,$=e=>{if(T=0,v)return;if(!D||document.hidden){Z+=e-Q,Q=e;return}let t=Math.min(.05,(e-Q)/1e3);Q=e;let n=(e-Z)/1e3;J=n;let r=Math.sin(n*.39)*.42+Math.sin(n*.17+1.3)*.18,i=Math.sin(n*.27+.6)*.3,a=R.on?R.tx*.85+r*.35:r,o=R.on?R.ty*.85+i*.35:i,s=1-Math.exp(-t*2.6);Y.x+=(a-Y.x)*s,Y.y+=(o-Y.y)*s,X(n),T=requestAnimationFrame($)},he=t=>{let n=e.getBoundingClientRect();R.tx=Math.max(-1,Math.min(1,(t.clientX-n.left)/n.width*2-1)),R.ty=Math.max(-1,Math.min(1,(t.clientY-n.top)/n.height*2-1)),R.on=!0},ge=()=>{R.on=!1};return e.addEventListener(`pointermove`,he),e.addEventListener(`pointerleave`,ge),_?X(3):T=requestAnimationFrame(e=>{Z=e,Q=e,$(e)}),()=>{if(v=!0,cancelAnimationFrame(T),B.disconnect(),V.disconnect(),document.removeEventListener(`visibilitychange`,H),e.removeEventListener(`pointermove`,he),e.removeEventListener(`pointerleave`,ge),U){for(let e of de)U.deleteTexture(e);W&&U.deleteProgram(W)}}},[c,d,w,E]);let H=(0,i.useCallback)(e=>{M(e),P(!1),A({f:880,to:1320,d:.035,g:.03,type:`triangle`}),V.current?.focus()},[A]);(0,i.useEffect)(()=>{if(!N)return;I(j);let e=e=>{let t=e.target;B.current?.contains(t)||V.current?.contains(t)||P(!1)},t=ie.current;return t?.addEventListener(`pointerdown`,e),()=>t?.removeEventListener(`pointerdown`,e)},[N,j]),(0,i.useEffect)(()=>{N&&B.current?.querySelector(`[data-i="${F}"]`)?.focus()},[N,F]);let U=e=>{e.key===`ArrowRight`||e.key===`ArrowDown`?(e.preventDefault(),I(e=>Math.min(_.length-1,e+1))):e.key===`ArrowLeft`||e.key===`ArrowUp`?(e.preventDefault(),I(e=>Math.max(0,e-1))):e.key===`Escape`&&(e.preventDefault(),P(!1),V.current?.focus())},W=()=>{L||(R(!0),A({f:659,d:.06,g:.04,type:`sine`}),A({f:988,d:.06,g:.035,type:`sine`,at:.13}),O?.({date:`${_[j].day} ${_[j].date}`,fare:_[j].fare}),window.clearTimeout(z.current),z.current=window.setTimeout(()=>R(!1),2200))};(0,i.useEffect)(()=>()=>window.clearTimeout(z.current),[]);let G=_[j];return(0,a.jsxs)(`div`,{ref:ie,className:`alp-root`,style:{"--alp-accent":n},children:[(0,a.jsx)(`style`,{children:T}),(0,a.jsxs)(`div`,{className:`alp-scene`,"aria-hidden":`true`,children:[(0,a.jsx)(`div`,{ref:ce,className:`alp-still`,style:{backgroundImage:`url(${c})`}}),(0,a.jsx)(`canvas`,{ref:ae,className:`alp-gl`}),(0,a.jsx)(`canvas`,{ref:oe,className:`alp-train`}),(0,a.jsx)(`div`,{ref:se,className:`alp-near`,style:{backgroundImage:`url(${w})`}}),(0,a.jsx)(`div`,{className:`alp-shade`}),(0,a.jsx)(`div`,{className:`alp-grain`})]}),(0,a.jsxs)(`header`,{className:`alp-nav`,children:[(0,a.jsxs)(`a`,{className:`alp-logo`,href:`#`,onClick:e=>e.preventDefault(),children:[(0,a.jsx)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 20 20`,"aria-hidden":`true`,children:(0,a.jsx)(`path`,{d:`M2 16 L8 6 L11 11 L13 8 L18 16 Z`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.7`,strokeLinejoin:`round`})}),e]}),(0,a.jsxs)(`nav`,{className:`alp-links`,"aria-label":`Main`,children:[(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Routes`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Cabins`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Dining`})]}),(0,a.jsx)(`button`,{type:`button`,className:`alp-navbtn`,children:t})]}),(0,a.jsxs)(`div`,{ref:le,className:`alp-type`,children:[(0,a.jsxs)(`h1`,{className:`alp-h1`,children:[(0,a.jsx)(`span`,{className:`alp-line`,children:(0,a.jsx)(`span`,{children:`Sleep through`})}),(0,a.jsx)(`span`,{className:`alp-line`,children:(0,a.jsx)(`span`,{children:`the Alps.`})})]}),(0,a.jsx)(`p`,{className:`alp-sub`,children:`Zurich to Venice overnight. Board at 21:40, wake up at the lagoon.`})]}),(0,a.jsxs)(`div`,{className:`alp-book`,role:`group`,"aria-label":`Book a sleeper`,children:[(0,a.jsxs)(`span`,{className:`alp-seg alp-route`,children:[`Zurich `,(0,a.jsx)(`span`,{"aria-hidden":`true`,children:`→`}),(0,a.jsx)(`span`,{className:`alp-sr`,children:` to `}),` Venice`]}),(0,a.jsxs)(`button`,{ref:V,type:`button`,className:`alp-seg alp-date`,"aria-haspopup":`listbox`,"aria-expanded":N,"aria-controls":`alp-list-${k}`,onClick:()=>{P(e=>!e),A({f:620,d:.03,g:.025,type:`triangle`})},children:[G.day,` `,G.date,(0,a.jsx)(`svg`,{width:`10`,height:`10`,viewBox:`0 0 10 10`,"aria-hidden":`true`,children:(0,a.jsx)(`path`,{d:`M2 4 L5 7 L8 4`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`})})]}),(0,a.jsxs)(`span`,{className:`alp-seg alp-fare`,"aria-live":`polite`,children:[`Sleeper for 2 · `,(0,a.jsxs)(`span`,{className:`alp-num`,children:[`€`,G.fare]},G.fare)]}),(0,a.jsxs)(`button`,{type:`button`,className:`alp-go${L?` is-on`:``}`,onClick:W,children:[(0,a.jsx)(`span`,{className:`alp-go-a`,children:`Book`}),(0,a.jsxs)(`span`,{className:`alp-go-b`,"aria-hidden":!L,children:[(0,a.jsx)(`svg`,{width:`13`,height:`13`,viewBox:`0 0 14 14`,"aria-hidden":`true`,children:(0,a.jsx)(`path`,{d:`M2.5 7.3 L5.6 10.2 L11.5 3.8`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`})}),`Held`]})]}),(0,a.jsxs)(`div`,{id:`alp-list-${k}`,ref:B,className:`alp-list${N?` is-open`:``}`,role:`listbox`,"aria-label":`Departures from Zurich, 21:40`,onKeyDown:U,hidden:!N,children:[(0,a.jsx)(`div`,{className:`alp-list-h`,children:`Departures · 21:40 from Zürich HB`}),(0,a.jsx)(`div`,{className:`alp-days`,children:_.map((e,t)=>(0,a.jsxs)(`button`,{type:`button`,role:`option`,"aria-selected":t===j,"data-i":t,tabIndex:t===F?0:-1,className:`alp-day${t===j?` is-sel`:``}`,onClick:()=>H(t),onKeyDown:e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),H(t))},children:[(0,a.jsx)(`span`,{className:`alp-day-d`,children:e.day}),(0,a.jsx)(`span`,{className:`alp-day-n`,children:e.date.split(` `)[0]}),(0,a.jsxs)(`span`,{className:`alp-day-p`,children:[`€`,e.fare]}),(0,a.jsxs)(`span`,{className:`alp-day-l${e.left<=2?` is-low`:``}`,children:[e.left,` left`]})]},e.date))})]})]})]})}var T=`
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,500..900&family=Inter+Tight:wght@400;500;600&display=swap');
.alp-root{container-type:inline-size;width:100%;height:var(--design-h,100svh);min-height:640px;position:relative;overflow:hidden;isolation:isolate;
  font-family:"Inter Tight",ui-sans-serif,system-ui,sans-serif;color:#fff;background:#8fa6bf;-webkit-font-smoothing:antialiased}
.alp-scene{position:absolute;inset:0;overflow:hidden}
.alp-still{position:absolute;left:0;top:0;width:100%;height:100%;background-size:cover;background-position:50% 50%;transition:opacity .4s ease;will-change:transform}
.alp-gl,.alp-train{position:absolute;inset:0;width:100%;height:100%;display:block}
.alp-near{position:absolute;background-repeat:no-repeat;background-position:0 100%;will-change:transform;pointer-events:none}
.alp-shade{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(20,30,40,.36) 0%,rgba(20,30,40,.12) 22%,transparent 42%,transparent 72%,rgba(20,20,10,.42) 100%)}
.alp-grain{position:absolute;inset:0;pointer-events:none;opacity:.09;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")}

.alp-nav{position:absolute;left:44px;right:44px;top:30px;display:flex;align-items:center;gap:30px;font-size:14px;font-weight:500;z-index:5;
  animation:alp-fade .9s .1s both cubic-bezier(.2,.8,.2,1)}
.alp-logo{display:flex;align-items:center;gap:9px;margin-right:auto;font-weight:600;font-size:18px;letter-spacing:-.01em;color:inherit;text-decoration:none}
.alp-links{display:flex;gap:28px}
.alp-links a{color:inherit;text-decoration:none;opacity:.86;transition:opacity .2s}
.alp-links a:hover{opacity:1}
.alp-navbtn{font:inherit;font-size:13.5px;font-weight:500;color:#1a1208;background:#fff;border:0;border-radius:999px;padding:10px 18px;cursor:pointer;
  transition:transform .18s cubic-bezier(.3,1.4,.5,1),box-shadow .2s}
.alp-navbtn:hover{box-shadow:0 6px 20px rgba(10,20,30,.22)}
.alp-navbtn:active{transform:scale(.97)}

.alp-type{position:absolute;left:56px;top:150px;z-index:4;will-change:transform}
.alp-h1{margin:0;font-family:"Archivo",ui-sans-serif,system-ui,sans-serif;font-weight:800;font-stretch:72%;font-variation-settings:"wdth" 72;
  font-size:clamp(56px,9.17cqi,140px);line-height:.86;letter-spacing:-.01em;word-spacing:.08em;text-transform:uppercase;filter:drop-shadow(0 2px 22px rgba(20,25,40,.2))}
.alp-line{display:block;overflow:hidden;padding-bottom:.04em;margin-bottom:-.04em}
.alp-line>span{display:block;animation:alp-rise 1.05s both cubic-bezier(.16,.84,.24,1)}
.alp-line:nth-child(1)>span{animation-delay:.15s}
.alp-line:nth-child(2)>span{animation-delay:.27s}
.alp-sub{margin:20px 0 0;font-size:17px;max-width:420px;line-height:1.45;opacity:.92;animation:alp-fade .9s .5s both cubic-bezier(.2,.8,.2,1);
  text-shadow:0 1px 14px rgba(20,25,40,.25)}

.alp-book{position:absolute;left:56px;bottom:44px;z-index:6;display:flex;align-items:center;background:#fff;color:#1a1208;border-radius:999px;padding:6px;font-size:14px;
  box-shadow:0 10px 40px rgba(20,20,10,.22),0 1px 0 rgba(255,255,255,.6) inset;animation:alp-up .9s .45s both cubic-bezier(.2,.8,.2,1)}
.alp-seg{padding:10px 18px;white-space:nowrap}
.alp-seg{position:relative}
.alp-seg+.alp-seg::before{content:"";position:absolute;left:0;top:28%;height:44%;width:1px;background:rgba(26,18,8,.1)}
.alp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.alp-date{font:inherit;color:inherit;background:none;border:0;display:inline-flex;align-items:center;gap:7px;cursor:pointer;border-radius:999px;
  transition:background .2s}
.alp-date:hover,.alp-date[aria-expanded="true"]{background:rgba(26,18,8,.05)}
.alp-date svg{opacity:.55;transition:transform .25s cubic-bezier(.3,1.4,.5,1)}
.alp-date[aria-expanded="true"] svg{transform:rotate(180deg)}
.alp-num{display:inline-block;font-variant-numeric:tabular-nums;animation:alp-num .42s both cubic-bezier(.3,1.4,.5,1)}
.alp-go{position:relative;font:inherit;font-size:14px;font-weight:500;color:#fff;background:var(--alp-accent);border:0;border-radius:999px;padding:11px 20px;cursor:pointer;overflow:hidden;
  min-width:68px;transition:transform .18s cubic-bezier(.3,1.4,.5,1),filter .2s}
.alp-go:hover{filter:brightness(1.07)}
.alp-go:active{transform:scale(.96)}
.alp-go-a,.alp-go-b{display:inline-flex;align-items:center;justify-content:center;gap:5px;transition:transform .36s cubic-bezier(.3,1.3,.5,1),opacity .2s}
.alp-go-b{position:absolute;inset:0;transform:translateY(110%);opacity:0}
.alp-go.is-on .alp-go-a{transform:translateY(-110%);opacity:0}
.alp-go.is-on .alp-go-b{transform:none;opacity:1}

.alp-list{position:absolute;left:0;bottom:calc(100% + 12px);background:#fff;color:#1a1208;border-radius:20px;padding:14px;box-shadow:0 18px 50px rgba(15,20,25,.28);
  transform-origin:30% 100%;animation:alp-pop .32s both cubic-bezier(.3,1.3,.5,1)}
.alp-list[hidden]{display:none}
.alp-list-h{font-size:12px;font-weight:500;color:rgba(26,18,8,.55);margin:0 4px 10px}
.alp-days{display:flex;gap:6px}
.alp-day{font:inherit;color:inherit;background:#f3f1ee;border:0;border-radius:14px;width:62px;padding:9px 0 8px;display:flex;flex-direction:column;align-items:center;gap:1px;cursor:pointer;
  transition:background .18s,transform .18s cubic-bezier(.3,1.4,.5,1),color .18s}
.alp-day:hover{background:#e9e6e1}
.alp-day:active{transform:scale(.96)}
.alp-day-d{font-size:11px;font-weight:500;opacity:.6}
.alp-day-n{font-size:19px;font-weight:600;letter-spacing:-.02em;line-height:1.15}
.alp-day-p{font-size:12px;font-weight:500;font-variant-numeric:tabular-nums}
.alp-day-l{font-size:10px;opacity:.5;margin-top:2px}
.alp-day-l.is-low{opacity:.9;color:var(--alp-accent)}
.alp-day.is-sel{background:#1a1208;color:#fff}
.alp-day.is-sel .alp-day-l{color:#fff;opacity:.6}

.alp-root :focus-visible{outline:2px solid var(--alp-accent);outline-offset:3px}
.alp-book :focus-visible{outline-offset:2px}

@keyframes alp-rise{from{transform:translateY(105%)}to{transform:none}}
@keyframes alp-fade{from{opacity:0}to{opacity:1}}
@keyframes alp-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes alp-pop{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
@keyframes alp-num{from{opacity:0;transform:translateY(60%)}to{opacity:1;transform:none}}

@container (max-width:1100px){
  .alp-h1{font-size:clamp(56px,10.5cqi,140px)}
}
@container (max-width:640px){
  .alp-nav{left:20px;right:20px;top:20px;gap:12px}
  .alp-links{display:none}
  .alp-navbtn{padding:9px 14px;font-size:13px}
  .alp-type{left:20px;right:20px;top:96px}
  .alp-h1{font-size:17.4cqi;line-height:.88}
  .alp-sub{font-size:15.5px;max-width:300px;margin-top:14px}
  .alp-book{left:16px;right:16px;bottom:16px;border-radius:22px;padding:8px;display:grid;grid-template-columns:1fr 1fr;gap:0}
  .alp-seg{padding:10px 12px}
  .alp-route{grid-column:1/-1;font-weight:600;font-size:15px;padding-bottom:4px}
  .alp-date{justify-content:flex-start}
  .alp-date::before{display:none}
  .alp-go{grid-column:1/-1;margin-top:6px;padding:14px 20px;font-size:15px}
  .alp-list{left:0;right:0;padding:12px}
  .alp-days{overflow-x:auto;scrollbar-width:none;margin:0 -12px;padding:0 12px}
  .alp-day{flex:0 0 56px;width:56px}
}
@media (prefers-reduced-motion:reduce){
  .alp-nav,.alp-line>span,.alp-sub,.alp-book,.alp-list,.alp-num{animation:none}
  .alp-go-a,.alp-go-b,.alp-date svg{transition:none}
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(w,{})}));