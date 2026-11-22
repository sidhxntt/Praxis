import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n();function o(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(n=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let r=navigator.userActivation;if(!(r&&!r.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let r=t.current??=new e;r.state===`suspended`&&r.resume();let i=r.currentTime+(n.at??0),a=Math.min(n.d??.035,.16),o=r.createGain();o.gain.setValueAtTime(1e-4,i),o.gain.exponentialRampToValueAtTime(Math.min(n.g??.035,.06),i+(n.noise?.006:.004)),o.gain.exponentialRampToValueAtTime(1e-4,i+a),o.connect(r.destination);let s;if(n.noise){let e=r.createBuffer(1,Math.ceil(r.sampleRate*a),r.sampleRate),t=e.getChannelData(0);for(let e=0;e<t.length;e++)t[e]=Math.random()*2-1;let c=r.createBufferSource();c.buffer=e;let l=r.createBiquadFilter();l.type=`bandpass`,l.frequency.setValueAtTime(n.f,i),n.to&&l.frequency.exponentialRampToValueAtTime(n.to,i+a),l.Q.value=n.q??1.2,c.connect(l).connect(o),s=c}else{let e=r.createOscillator();e.type=n.type??`sine`,e.frequency.setValueAtTime(n.f,i),n.to&&e.frequency.exponentialRampToValueAtTime(n.to,i+a),e.connect(o),s=e}s.start(i),s.stop(i+a+.01)}catch{}},[e])}var s=e=>new Promise((t,n)=>{let r=new Image;r.decoding=`async`,r.onload=()=>t(r),r.onerror=n,r.src=e}),c=e=>{let t=e.replace(`#`,``),n=t.length===3?t.split(``).map(e=>e+e).join(``):t.padEnd(6,`0`).slice(0,6),r=parseInt(n,16);return Number.isFinite(r)?[(r>>16&255)/255,(r>>8&255)/255,(r&255)/255]:[.965,.725,.047]},l=[[-.0855,.364],[.0873,.3655],[.114,.468],[.004,.562],[-.118,.462],[-.112,.292],[.055,.262]],u=17.5,d=[0,.368],f=`#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`,p=`#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uDpr, uIn, uFlash, uCell, uHL, uTL, uR, uTA, uBot;
uniform vec2 uL, uGO, uWY;
uniform vec4 uHR, uTR;
uniform vec3 uTone;
uniform sampler2D uHead, uText;
out vec4 o;

float bell(vec2 q, float s){ vec2 d = (q - uL) / s; return exp(-dot(d, d)); }
vec2 huv(vec2 q){ vec2 uv = (q - uHR.xy) / uHR.zw; return vec2(uv.x, min(uv.y, .998)); }
float headA(vec2 q, float lod){
  vec2 uv = (q - uHR.xy) / uHR.zw;
  if (uv.x < 0. || uv.x > 1. || uv.y < 0.) return 0.;
  return textureLod(uHead, vec2(uv.x, min(uv.y, .998)), lod).a;
}
float headL(vec2 q, float lod){ return dot(textureLod(uHead, huv(q), lod).rgb, vec3(.299, .587, .114)); }
float textA(vec2 q, float lod){
  vec2 uv = (q - uTR.xy) / uTR.zw;
  if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) return 0.;
  return textureLod(uText, uv, lod).a;
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}

void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  float LI = uIn;

  // her head's shadow falls away from the light
  vec2 hc = uHR.xy + uHR.zw * vec2(.5, .327);
  vec2 dv = hc - uL;
  float dl = max(length(dv), 1.);
  vec2 dn = dv / dl;
  vec2 offT = dn * min(dl * .24, uHR.w * .075);
  float sT = headA(p - offT, uHL + 3.7);

  /* ground: a 45 degree screen */
  const float K = .70710678;
  vec2 g = p - uGO;
  vec2 gr = vec2((g.x - g.y) * K, (g.x + g.y) * K);
  vec2 cr = (floor(gr / uCell) + .5) * uCell;
  vec2 cc = vec2((cr.x + cr.y) * K, (cr.y - cr.x) * K) + uGO;
  vec2 hq = (cc - mix(hc, uL, .2)) / (uHR.w * vec2(.59, .53));
  float halo = exp(-dot(hq, hq));
  vec2 hq2 = (p - mix(hc, uL, .2)) / (uHR.w * vec2(.64, .57));
  float haloP = exp(-dot(hq2, hq2));
  float pch = vnoise(cc / 140. + 3.7) * .62 + vnoise(cc / 43. + 11.) * .38;
  float lg = bell(cc, uR * 2.5) * LI;
  float lgP = bell(p, uR * 2.7) * LI;
  float I = .02 + .22 * pch * pch + .74 * halo * halo + .16 * halo + .46 * lg + uFlash * .26;
  // grit: no two dots of a real print are the same size, and a few barely took
  float jt = hash(cr / uCell);
  float r = uCell * (.07 + .43 * sqrt(clamp(I, 0., 1.4))) * (.74 + .5 * jt) * mix(.6, 1., step(.03, jt));
  float aa = .75 / uDpr + .12;
  float m = 1. - smoothstep(r - aa, r + aa, length(gr - cr));
  vec3 inkA = mix(uTone * vec3(.98, .74, .6), vec3(.95, .34, .07), .42);
  vec3 inkB = mix(uTone * .9, vec3(.91, .16, .07), .78);
  vec3 ink = mix(inkA, inkB, smoothstep(.3, .95, I - lg * .25));
  ink = mix(ink, vec3(1., .47, .10), lg * .45);
  vec3 base = mix(uTone, vec3(.99, .52, .10), haloP * .50);
  base = mix(base, vec3(.95, .30, .07), haloP * haloP * haloP * .42);
  base = mix(base, vec3(1., .84, .34), lgP * .5);
  base += vec3(.05, .05, .02) * uFlash;
  vec3 col = mix(base, ink, m * mix(.62, .96, clamp(I, 0., 1.)));
  col += (hash(floor(p * uDpr / 1.5) + 7.) - .5) * .03;

  /* word */
  vec2 tuv = (p - uTR.xy) / uTR.zw;
  if (tuv.x > 0. && tuv.y > 0. && tuv.x < 1. && tuv.y < 1.) {
    float T = textureLod(uText, tuv, max(0., uTL - log2(uDpr))).a * uTA;
    if (T > .001) {
      float ty = clamp((p.y - uWY.x) / max(1., uWY.y - uWY.x), 0., 1.);
      float fade = mix(1., .14, smoothstep(.14, 1., ty));
      float Lw = bell(p, uR * 3.1) * LI;
      float lift = clamp(Lw * .9 + uFlash * .75, 0., 1.) * (1. - .85 * sT);
      fade = mix(fade, 1., lift);
      vec3 wc = mix(vec3(1., .975, .90), vec3(1.), clamp(Lw + uFlash, 0., 1.));
      col = mix(col, wc, T * fade);
      // her shadow on the letters
      col = mix(col, col * vec3(.70, .47, .25), T * sT * (.40 + .4 * bell(p, uR * 5.) * LI));
    }
  }

  // the floor of the picture goes a little darker, so the copy reads
  float by = smoothstep(uBot, 1., p.y / uRes.y);
  col = mix(col, col * vec3(.50, .40, .22), by * .62);

  /* person */
  vec2 uv = (p - uHR.xy) / uHR.zw;
  if (uv.x > 0. && uv.x < 1. && uv.y > 0.) {
    float l0 = max(0., uHL - log2(uDpr) - .35);
    vec4 h = textureLod(uHead, vec2(uv.x, min(uv.y, .998)), l0);
    if (h.a > .003) {
      vec3 c = h.rgb / h.a;
      // relief: brighter is nearer (nose, cheekbones, brow), darker falls back (eyes, lips, hair)
      float bl = uHL + 3.4;
      float e = uHR.w * .0082;
      float h0 = headL(p, bl), hx = headL(p + vec2(e, 0.), bl), hy = headL(p + vec2(0., e), bl);
      vec3 n = normalize(vec3((h0 - hx) * 3., (h0 - hy) * 3., 1.));
      vec3 l3 = normalize(vec3(uL - p, uR * .95));
      float ndl = clamp(dot(n, l3), 0., 1.);
      vec2 dd = (p - uL) / uR;
      float b = exp(-pow(dot(dd, dd), 1.2));
      float E = 1.5 * b * mix(.6, 1., ndl) * LI;
      E = max(E - .012, 0.) + uFlash * 1.06;
      vec3 warm = mix(vec3(1.07, .985, .87), vec3(1.03, 1., .96), clamp(uFlash * 1.4, 0., 1.));
      // the rows under the photograph's own frame are drawn in, not shot: they stay black
      vec3 lit = pow(c, vec3(1.05)) * warm * min(E, 1.32) * (1. - smoothstep(.845, .915, uv.y));
      // the black: a hair of the picture, and the ground's light wrapping round her edges
      float wrap = 1. - headA(p, uHL + 3.6);
      vec3 sil = c * .036 * vec3(1., .9, .78) + vec3(.55, .27, .05) * wrap * wrap * .34 * (.35 + c);
      // a thin warm rim on the edge that faces the light
      vec2 tl = uL - p;
      vec2 ld = tl / max(length(tl), 1.);
      float rim = clamp(1. - headA(p + ld * 3.2, l0 + .6), 0., 1.) + .35 * clamp(1. - headA(p + ld * 9., uHL + 1.8), 0., 1.);
      sil += vec3(1., .80, .42) * rim * bell(p, uR * 3.6) * LI * 1.25;
      col = mix(col, min(sil + lit, vec3(1.)), h.a);
    }
  }

  col += vec3(1., .96, .86) * uFlash * uFlash * .10;
  float nz = fract(sin(dot(floor(p * uDpr), vec2(12.9898, 78.233))) * 43758.5453);
  col += (nz - .5) * .02;
  o = vec4(col, 1.);
}`;function m({brand:e=`Limelight`,word:t=`SPOTTED`,cta:n=`Start a project`,tone:r=`#f6b90c`,light:m=1,portrait:g=`/design/websites/limelight/portrait.webp`,faces:_=`/design/websites/limelight/faces.webp`,sound:v=!0,onCta:y}){let b=(0,i.useRef)(null),ee=(0,i.useRef)(null),te=(0,i.useRef)(null),ne=(0,i.useRef)(null),re=(0,i.useRef)(null),x=(0,i.useRef)(null),S=(0,i.useRef)(null),C=(0,i.useRef)(null),w=(0,i.useRef)(null),[T,ie]=(0,i.useState)(!1),E=(0,i.useRef)(r);E.current=r;let ae=(0,i.useRef)(m);ae.current=m;let D=o(v),oe=(0,i.useRef)(()=>{}),se=(0,i.useRef)(()=>{}),ce=(0,i.useRef)(()=>{}),O=(0,i.useRef)(D);return O.current=D,(0,i.useEffect)(()=>{let e=C.current,t=w.current;if(!e||!t||window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let n=performance.now(),r=0,i=a=>{let o=Math.min(1,Math.max(0,(a-n-300)/1200)),s=1-(1-o)**3;e.textContent=String(Math.round(38*s)),t.textContent=String(Math.round(212*s)),o<1&&(r=requestAnimationFrame(i))};return r=requestAnimationFrame(i),()=>{cancelAnimationFrame(r),e.textContent=`38`,t.textContent=`212`}},[]),(0,i.useEffect)(()=>{let e=b.current,t=ee.current,n=te.current,r=ne.current,i=re.current;if(!e||!t||!n||!r||!i)return;let a=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,o=1,m=()=>{let t=e.getBoundingClientRect(),i=e.offsetWidth||1;o=t.width/i||1;let a=parseFloat(getComputedStyle(n).fontSize)||300,s=r.getBoundingClientRect().width/o;if(s<10)return;let c=i*1.012*a/s;Math.abs(c-a)>.5&&(n.style.fontSize=`${c.toFixed(1)}px`)};m();let h=t.getContext(`webgl2`,{antialias:!1,alpha:!1,premultipliedAlpha:!1,powerPreference:`high-performance`}),_=null;if(h){let e=(e,t)=>{let n=h.createShader(e);return h.shaderSource(n,t),h.compileShader(n),n};_=h.createProgram(),h.attachShader(_,e(h.VERTEX_SHADER,f)),h.attachShader(_,e(h.FRAGMENT_SHADER,p)),h.linkProgram(_),h.getProgramParameter(_,h.LINK_STATUS)||(_=null)}if(!h||!_){let t=new ResizeObserver(m);t.observe(e);let n=()=>m();return document.fonts?.addEventListener(`loadingdone`,n),()=>{t.disconnect(),document.fonts?.removeEventListener(`loadingdone`,n)}}h.useProgram(_);let v=h.createBuffer();h.bindBuffer(h.ARRAY_BUFFER,v),h.bufferData(h.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),h.STATIC_DRAW);let y=h.getAttribLocation(_,`aPos`);h.enableVertexAttribArray(y),h.vertexAttribPointer(y,2,h.FLOAT,!1,0,0);let C={};for(let e of[`uRes`,`uDpr`,`uIn`,`uFlash`,`uCell`,`uHL`,`uTL`,`uR`,`uTA`,`uBot`,`uL`,`uGO`,`uWY`,`uHR`,`uTR`,`uTone`,`uHead`,`uText`])C[e]=h.getUniformLocation(_,e);h.uniform1i(C.uHead,0),h.uniform1i(C.uText,1),h.pixelStorei(h.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),h.pixelStorei(h.UNPACK_COLORSPACE_CONVERSION_WEBGL,h.NONE);let w=e=>{let t=h.createTexture();return h.activeTexture(h.TEXTURE0+e),h.bindTexture(h.TEXTURE_2D,t),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MIN_FILTER,h.LINEAR_MIPMAP_LINEAR),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MAG_FILTER,h.LINEAR),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_S,h.CLAMP_TO_EDGE),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_T,h.CLAMP_TO_EDGE),t},T=w(0),D=w(1),le=(e,t,n)=>{h.activeTexture(h.TEXTURE0+e),h.bindTexture(h.TEXTURE_2D,t),h.texImage2D(h.TEXTURE_2D,0,h.RGBA,h.RGBA,h.UNSIGNED_BYTE,n),h.generateMipmap(h.TEXTURE_2D)},k=!1,A=0,j=!0,M=1,N=1,P=1,ue=1,de=!1,fe=!1,pe=1,F={x:0,y:0,w:1,h:1},I={x:0,y:0,w:1,h:1,dpr:1,y0:0,y1:1},L=document.createElement(`canvas`),me=()=>{let t=e.getBoundingClientRect(),i=n.getBoundingClientRect(),a=getComputedStyle(n),s=parseFloat(a.fontSize)||300,c=parseFloat(a.lineHeight)||s*.8,l=Math.round(s*.2),u=i.width/o+l*2,d=i.height/o+l*2,f=Math.min(Math.max(P,1),4096/u,4096/d);L.width=Math.max(2,Math.round(u*f)),L.height=Math.max(2,Math.round(d*f));let p=L.getContext(`2d`);if(!p)return;p.setTransform(f,0,0,f,0,0),p.clearRect(0,0,u,d),p.font=`${a.fontWeight} ${s}px ${a.fontFamily}`,p.textAlign=`center`,p.textBaseline=`alphabetic`,p.fillStyle=`#fff`;let m=r.textContent||``,h=p.measureText(m),g=h.fontBoundingBoxAscent||s*.88,_=l+(c-(g+(h.fontBoundingBoxDescent||s*.21)))/2+g;p.fillText(m,u/2,_),le(1,D,L),I.x=(i.left-t.left)/o-l,I.y=(i.top-t.top)/o-l,I.w=u,I.h=d,I.dpr=f;let v=p.measureText(`H`).actualBoundingBoxAscent||s*.69;I.y0=_-v,I.y1=_,fe=!0},R=()=>{m();let n=e.getBoundingClientRect();M=Math.max(1,e.offsetWidth),N=Math.max(1,e.offsetHeight),P=Math.min(2,Math.max(.5,(window.devicePixelRatio||1)*o)),t.width=Math.round(M*P),t.height=Math.round(N*P),h.viewport(0,0,t.width,t.height);let r=i.getBoundingClientRect();F.x=(r.left-n.left)/o,F.y=(r.top-n.top)/o,F.w=Math.max(1,r.width/o),F.h=Math.max(1,r.height/o),ue=pe/F.h,z&&me()},z=!1,he=parseFloat(getComputedStyle(n).fontSize)||300,B=()=>{k||(z=!0,R(),Q())},ge=window.setTimeout(B,1200),_e=()=>z&&B();document.fonts&&(document.fonts.load(`800 ${he}px Archivo`,r.textContent||`A`).then(()=>{window.clearTimeout(ge),B()}).catch(()=>{}),document.fonts.addEventListener(`loadingdone`,_e)),s(g).then(e=>{k||(pe=e.naturalHeight,le(0,T,e),de=!0,R(),Q())}).catch(()=>{}),R();let ve=new ResizeObserver(()=>{R(),Q()});ve.observe(e);let ye=new IntersectionObserver(([e])=>{j=e.isIntersecting,j&&Q()});ye.observe(e);let be=()=>Q();document.addEventListener(`visibilitychange`,be);let V=l.length,xe=(e,t)=>[F.x+F.w/2+e*F.h,F.y+t*F.h],Se=e=>{let t=(e/u*V+.5)%V,n=Math.floor(t),r=t-n;r-=.55/(2*Math.PI)*Math.sin(2*Math.PI*r);let i=e=>l[((n+e)%V+V)%V],[a,o,s,c]=[i(-1),i(0),i(1),i(2)],d=e=>.5*(2*o[e]+(s[e]-a[e])*r+(2*a[e]-5*o[e]+4*s[e]-c[e])*r*r+(3*o[e]-a[e]-3*s[e]+c[e])*r*r*r);return xe(d(0),d(1))},H={on:!1,x:0,y:0,key:!1},U=performance.now(),Ce=U,W=0,G=0,we=!1,K=0,q=0,J=0,Y=0,X=2.2,Te=-99,Ee=!1,Z=e=>{if(A=0,k||!j||document.hidden)return;a||(A=requestAnimationFrame(Z));let t=Math.min(.05,(e-Ce)/1e3);Ce=e;let n=a?0:(e-U)/1e3;if(!de||!fe){a&&(A=requestAnimationFrame(Z));return}let r=M<640;if(a)[W,G]=xe(d[0],d[1]);else{let[e,i]=H.on?[H.x,H.y]:Se(n);we||(we=!0,W=e,G=i),X+=((H.on?9:2.2)-X)*(1-Math.exp(-t*3));let a=1-Math.exp(-t*X);W+=(e-W)*a,G+=(i-G)*a;let o=H.on&&!H.key?(H.x/M*2-1)*18:0,s=H.on&&!H.key?(H.y/N*2-1)*10:0,c=1-Math.exp(-t*2.6);J+=(o-J)*c,Y+=(s-Y)*c;let l=r?.45:1;K=(Math.sin(n*.23)*9+J)*l,q=(Math.sin(n*.17+1)*4.5+Y)*l}let i=a?1:1-(1-Math.min(1,Math.max(0,(n-.05)/1.15)))**3,o=n-Te,s=a||o<0||o>3?0:Math.min(1,o/.05)*Math.exp(-Math.max(0,o-.05)*4.3),l=1-i,u=Math.min(2.2,Math.max(.4,ae.current||1));h.useProgram(_),h.uniform2f(C.uRes,M,N),h.uniform1f(C.uDpr,P),h.uniform1f(C.uIn,i),h.uniform1f(C.uFlash,s),h.uniform1f(C.uCell,r?6:7),h.uniform1f(C.uTA,Math.min(1,i*1.8)),h.uniform1f(C.uBot,r?.52:.84),h.uniform1f(C.uR,F.h*.127*u*(a?1.2:1)),h.uniform1f(C.uHL,Math.log2(Math.max(.001,ue))),h.uniform1f(C.uTL,Math.log2(Math.max(.001,I.dpr))),h.uniform2f(C.uL,W,G),h.uniform2f(C.uGO,-K*.12,-q*.12),h.uniform4f(C.uHR,F.x-K,F.y-q,F.w,F.h);let f=I.y-q*.42+l*40;h.uniform4f(C.uTR,I.x-K*.42,f,I.w,I.h),h.uniform2f(C.uWY,f+I.y0,f+I.y1);let[p,m,g]=c(E.current);h.uniform3f(C.uTone,p,m,g),h.activeTexture(h.TEXTURE0),h.bindTexture(h.TEXTURE_2D,T),h.activeTexture(h.TEXTURE1),h.bindTexture(h.TEXTURE_2D,D),h.drawArrays(h.TRIANGLE_STRIP,0,4),S.current&&(S.current.style.transform=`translate3d(${(-K*1.4).toFixed(2)}px,${(-q*1.4+l*18).toFixed(2)}px,0)`),x.current&&(x.current.style.transform=`translate3d(${(-K*1.7).toFixed(2)}px,${(-q*1.7+l*26).toFixed(2)}px,0)`),Ee||(Ee=!0,ie(!0))},Q=()=>{!A&&!k&&(A=requestAnimationFrame(Z))};Q();let De=t=>{let n=e.getBoundingClientRect();H.on=!0,H.key=!1,H.x=(t.clientX-n.left)/o,H.y=(t.clientY-n.top)/o},Oe=e=>De(e),ke=()=>{H.key||(H.on=!1)},$=e=>{e.pointerType!==`mouse`&&(H.on=!1)},Ae=()=>{Te=(performance.now()-U)/1e3,O.current({f:3200,to:700,d:.11,g:.05,noise:!0,q:.7}),O.current({f:170,to:55,d:.09,g:.055,type:`sine`}),O.current({f:5200,d:.012,g:.02,noise:!0,q:2}),Q()},je=e=>{e.target.closest(`a,button,input,label`)||(De(e),Ae())};return oe.current=Ae,se.current=(e,t)=>{H.on||(H.x=W,H.y=G),H.on=!0,H.key=!0,H.x=Math.min(M,Math.max(0,H.x+e*F.h*.05)),H.y=Math.min(N,Math.max(0,H.y+t*F.h*.05)),Q()},ce.current=()=>{H.key&&(H.key=!1,H.on=!1)},e.addEventListener(`pointermove`,Oe),e.addEventListener(`pointerleave`,ke),e.addEventListener(`pointerdown`,je),e.addEventListener(`pointerup`,$),e.addEventListener(`pointercancel`,$),()=>{k=!0,cancelAnimationFrame(A),ve.disconnect(),ye.disconnect(),document.removeEventListener(`visibilitychange`,be),window.clearTimeout(ge),document.fonts?.removeEventListener(`loadingdone`,_e),e.removeEventListener(`pointermove`,Oe),e.removeEventListener(`pointerleave`,ke),e.removeEventListener(`pointerdown`,je),e.removeEventListener(`pointerup`,$),e.removeEventListener(`pointercancel`,$),h.deleteTexture(T),h.deleteTexture(D),h.deleteBuffer(v),h.deleteProgram(_);let n=h.getExtension(`WEBGL_lose_context`);window.setTimeout(()=>{t.isConnected||n?.loseContext()},0)}},[g,t]),(0,a.jsxs)(`div`,{ref:b,className:`lml-root`,"data-live":T?`1`:`0`,style:{"--lml-tone":r},children:[(0,a.jsx)(`style`,{children:h}),(0,a.jsxs)(`div`,{className:`lml-scene`,children:[(0,a.jsx)(`i`,{className:`lml-dots`,"aria-hidden":!0}),(0,a.jsx)(`i`,{className:`lml-glow`,"aria-hidden":!0}),(0,a.jsx)(`h1`,{ref:te,className:`lml-word`,children:(0,a.jsx)(`span`,{ref:ne,children:t})}),(0,a.jsx)(`img`,{ref:re,className:`lml-head lml-head--dark`,src:g,alt:``,"aria-hidden":!0,draggable:!1}),(0,a.jsx)(`img`,{className:`lml-head lml-head--lit`,src:g,alt:``,"aria-hidden":!0,draggable:!1}),(0,a.jsx)(`i`,{className:`lml-floor`,"aria-hidden":!0}),(0,a.jsx)(`canvas`,{ref:ee,className:`lml-gl`,"aria-hidden":!0})]}),(0,a.jsxs)(`header`,{className:`lml-nav`,children:[(0,a.jsxs)(`a`,{className:`lml-brand`,href:`#`,"aria-label":e,children:[(0,a.jsxs)(`svg`,{viewBox:`0 0 20 20`,width:`18`,height:`18`,"aria-hidden":!0,children:[(0,a.jsx)(`circle`,{cx:`10`,cy:`10`,r:`9`,fill:`#141006`}),(0,a.jsx)(`circle`,{cx:`12.6`,cy:`7.6`,r:`4.4`,fill:`#fff`})]}),e]}),(0,a.jsxs)(`nav`,{className:`lml-links`,"aria-label":`Main`,children:[(0,a.jsx)(`a`,{href:`#`,children:`Work`}),(0,a.jsx)(`a`,{href:`#`,children:`Services`}),(0,a.jsx)(`a`,{href:`#`,children:`Studio`}),(0,a.jsx)(`a`,{href:`#`,children:`Contact`})]}),(0,a.jsx)(`button`,{type:`button`,className:`lml-cta`,onClick:()=>{D({f:3200,d:.016,g:.03,noise:!0}),D({f:880,to:940,d:.045,g:.03,at:.02}),y?.()},children:n})]}),(0,a.jsx)(`button`,{type:`button`,className:`lml-lamp`,onKeyDown:e=>{let t={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];t&&(e.preventDefault(),se.current(t[0],t[1]))},onClick:()=>oe.current(),onBlur:()=>ce.current(),children:`Move the light with the arrow keys, Enter fires the flash`}),(0,a.jsxs)(`div`,{ref:S,className:`lml-copy`,children:[(0,a.jsxs)(`div`,{className:`lml-rated`,children:[(0,a.jsxs)(`span`,{className:`lml-faces`,"aria-hidden":!0,children:[(0,a.jsx)(`i`,{style:{backgroundImage:`url(${_})`,backgroundPosition:`0% 0`}}),(0,a.jsx)(`i`,{style:{backgroundImage:`url(${_})`,backgroundPosition:`50% 0`}}),(0,a.jsx)(`i`,{style:{backgroundImage:`url(${_})`,backgroundPosition:`100% 0`}})]}),(0,a.jsxs)(`span`,{className:`lml-rate`,children:[`Rated 4.9 by`,(0,a.jsx)(`br`,{}),(0,a.jsx)(`span`,{ref:w,children:`212`}),` founders`]})]}),(0,a.jsx)(`p`,{children:`We put brands where the light is. Identity, campaigns and launch films for founders done with being overlooked.`})]}),(0,a.jsxs)(`div`,{ref:x,className:`lml-cards`,children:[(0,a.jsxs)(`div`,{className:`lml-card lml-card--light`,children:[(0,a.jsxs)(`span`,{className:`lml-k`,children:[(0,a.jsxs)(`svg`,{viewBox:`0 0 16 16`,width:`14`,height:`14`,"aria-hidden":!0,children:[(0,a.jsx)(`circle`,{cx:`8`,cy:`3.4`,r:`2.1`,fill:`currentColor`}),(0,a.jsx)(`circle`,{cx:`3.6`,cy:`11.4`,r:`2.1`,fill:`currentColor`}),(0,a.jsx)(`circle`,{cx:`12.4`,cy:`11.4`,r:`2.1`,fill:`currentColor`})]}),`Brand recall`]}),(0,a.jsxs)(`b`,{children:[`+`,(0,a.jsx)(`span`,{ref:C,children:`38`}),`%`]}),(0,a.jsx)(`small`,{children:`average after a relaunch`})]}),(0,a.jsxs)(`div`,{className:`lml-card lml-card--dark`,children:[(0,a.jsxs)(`span`,{className:`lml-k`,children:[`Next opening`,(0,a.jsx)(`em`,{"aria-hidden":!0})]}),(0,a.jsx)(`b`,{children:`March`}),(0,a.jsx)(`small`,{children:`2 slots left`})]})]})]})}var h=`@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&display=swap');
.lml-root{container-type:inline-size;width:100%;height:var(--design-h,100svh);min-height:640px;position:relative;overflow:hidden;isolation:isolate;
  background:var(--lml-tone,#f6b90c);color:#fff;font-family:Archivo,ui-sans-serif,system-ui,-apple-system,"Helvetica Neue",sans-serif;-webkit-font-smoothing:antialiased;touch-action:pan-y}
.lml-root *{box-sizing:border-box}
.lml-scene{position:absolute;inset:0;z-index:0}
.lml-dots{position:absolute;inset:0;
  background-image:radial-gradient(circle at center,rgba(240,112,16,.8) 1.1px,transparent 1.7px),radial-gradient(circle at center,rgba(240,112,16,.8) 1.1px,transparent 1.7px);
  background-size:10px 10px;background-position:0 0,5px 5px}
.lml-glow{position:absolute;inset:0;background:radial-gradient(30% 50% at 50% 43%,rgba(236,70,18,.62),rgba(244,120,20,.3) 55%,transparent 100%)}
.lml-word{position:absolute;left:50%;top:58%;margin:0;transform:translate(-50%,-50%);font-family:Archivo,"Arial Black",ui-sans-serif,sans-serif;font-weight:800;
  font-size:20.3cqi;line-height:.8;letter-spacing:0;color:#fff;white-space:nowrap;pointer-events:none;user-select:none;
  -webkit-mask-image:linear-gradient(180deg,#000 12%,rgba(0,0,0,.12) 88%);mask-image:linear-gradient(180deg,#000 12%,rgba(0,0,0,.12) 88%)}
.lml-word span{display:inline-block}
.lml-head{position:absolute;left:50%;top:11.5%;height:95.7%;width:auto;max-width:none;transform:translateX(-50%);pointer-events:none;user-select:none;-webkit-user-drag:none}
.lml-head--dark{filter:brightness(0)}
.lml-head--lit{-webkit-mask-image:radial-gradient(circle at 50% 37.2%,#000 0,rgba(0,0,0,.86) 6%,rgba(0,0,0,.4) 12%,rgba(0,0,0,.1) 17%,transparent 21%);mask-image:radial-gradient(circle at 50% 37.2%,#000 0,rgba(0,0,0,.86) 6%,rgba(0,0,0,.4) 12%,rgba(0,0,0,.1) 17%,transparent 21%)}
.lml-floor{position:absolute;left:0;right:0;bottom:0;height:16%;background:linear-gradient(180deg,transparent,rgba(70,48,0,.42))}
.lml-gl{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .4s ease}
.lml-root[data-live="1"] .lml-gl{opacity:1}

.lml-nav{position:absolute;left:3.06cqi;right:3.06cqi;top:28px;z-index:5;display:flex;align-items:center;gap:30px;font-size:14.5px;font-weight:500}
.lml-brand{margin-right:auto;display:flex;align-items:center;gap:9px;font-size:21px;font-weight:700;letter-spacing:-.025em;color:#fff;text-decoration:none;text-shadow:0 1px 12px rgba(150,80,0,.35)}
.lml-links{display:flex;gap:30px}
.lml-links a{color:#fff;text-decoration:none;text-shadow:0 1px 10px rgba(150,80,0,.5);transition:opacity .2s;opacity:.96}
.lml-links a:hover{opacity:.75}
.lml-cta{font:inherit;font-size:13.5px;font-weight:600;border:0;border-radius:999px;padding:12px 20px;background:#fff;color:#17130a;cursor:pointer;
  transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s;box-shadow:0 1px 0 rgba(0,0,0,.05),0 10px 24px -12px rgba(110,60,0,.6)}
.lml-cta:hover{transform:translateY(-1px)}
.lml-cta:active{transform:scale(.97)}
.lml-root a:focus-visible,.lml-cta:focus-visible,.lml-lamp:focus-visible{outline:2px solid #fff;outline-offset:3px;border-radius:8px}
.lml-lamp{position:absolute;left:3.06cqi;top:78px;z-index:6;font:inherit;font-size:12.5px;font-weight:500;padding:8px 12px;border-radius:999px;border:0;background:#141006;color:#fff;
  clip-path:inset(50%);width:1px;height:1px;overflow:hidden;white-space:nowrap}
.lml-lamp:focus-visible{clip-path:none;width:auto;height:auto}

.lml-copy{position:absolute;left:3.06cqi;bottom:42px;z-index:4;width:372px;max-width:42cqi;will-change:transform}
.lml-rated{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.lml-faces{display:flex}
.lml-faces i{width:38px;height:38px;border-radius:50%;background-size:300% 100%;border:2px solid #fff;box-shadow:0 4px 12px -6px rgba(90,50,0,.6)}
.lml-faces i+i{margin-left:-12px}
.lml-rate{font-size:13.5px;line-height:1.28;font-weight:500;font-variant-numeric:tabular-nums;text-shadow:0 1px 10px rgba(150,80,0,.45)}
.lml-copy p{margin:0;font-size:19.5px;line-height:1.3;font-weight:500;letter-spacing:-.012em;text-wrap:pretty;text-shadow:0 1px 14px rgba(120,66,0,.5)}
.lml-cards{position:absolute;right:3.06cqi;bottom:42px;z-index:4;display:flex;gap:14px;will-change:transform}
.lml-card{width:178px;height:138px;border-radius:18px;padding:16px 17px 15px;display:flex;flex-direction:column;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.lml-card:hover{transform:translateY(-4px)}
.lml-k{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;letter-spacing:-.005em;line-height:1.2}
.lml-card b{display:block;margin-top:auto;font-size:36px;font-weight:600;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
.lml-card small{display:block;font-size:11.5px;font-weight:500;margin-top:6px;opacity:.62;white-space:nowrap}
.lml-card--light{background:#fff;color:#17130a;box-shadow:0 1px 0 rgba(0,0,0,.04),0 22px 44px -22px rgba(90,50,0,.7)}
.lml-card--dark{background:rgba(72,54,10,.80);background:color-mix(in srgb,color-mix(in srgb,var(--lml-tone,#f6b90c) 27%,#170f03) 82%,transparent);color:#fff;-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);box-shadow:inset 0 0 0 1px rgba(255,236,170,.12),0 22px 44px -22px rgba(60,34,0,.8)}
.lml-card--dark .lml-k{justify-content:space-between}
.lml-card--dark em{width:8px;height:8px;border-radius:50%;background:#ffd23a;box-shadow:0 0 0 4px rgba(255,210,58,.22)}
.lml-card--dark b{font-size:30px}

@container (max-width:900px){
  .lml-links{display:none}
  .lml-copy{width:300px}
  .lml-copy p{font-size:17px}
  .lml-card{width:150px;height:126px}
}
@container (max-width:640px){
  .lml-nav{left:20px;right:20px;top:20px}
  .lml-brand{font-size:19px}
  .lml-cta{padding:10px 16px;font-size:13px}
  .lml-word{top:16.2%}
  .lml-head{top:17.5%;height:66%}
  .lml-floor{height:46%;background:linear-gradient(180deg,transparent,rgba(40,26,0,.7) 60%)}
  .lml-copy{left:20px;right:20px;bottom:158px;width:auto;max-width:none}
  .lml-copy p{font-size:17px;max-width:32ch}
  .lml-cards{left:20px;right:20px;bottom:22px;gap:10px}
  .lml-card{flex:1;width:auto;height:120px;padding:14px 15px}
  .lml-card b{font-size:32px}
  .lml-card--dark b{font-size:27px}
}
@media (prefers-reduced-motion: reduce){
  .lml-gl{transition:none}
  .lml-cta,.lml-card{transition:none}
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(m,{})}));