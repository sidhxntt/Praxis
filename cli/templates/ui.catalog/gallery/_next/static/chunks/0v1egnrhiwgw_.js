(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,37713,e=>{e.q("/_next/static/media/grain.2oj17btka0adl.svg")},18542,e=>{"use strict";var t=e.i(43476),i=e.i(71645);let a=e=>{let t=/^#?([0-9a-f]{6})$/i.exec(e.trim()),i=t?parseInt(t[1],16):818166;return[(i>>16&255)/255,(i>>8&255)/255,(255&i)/255]},r=`
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,n=`
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform sampler2D uText;
uniform sampler2D uOrb;
uniform vec3 uGround;
uniform vec2 uSkyOff;
uniform vec3 uO;
uniform float uT;
uniform float uTextOn;
uniform float uOrbOn;
uniform float uRingA;
uniform float uRingP;
uniform vec3 uOrbTex;
uniform vec3 uShade;
uniform vec3 uHalo;

// The ground: one blue, a very soft lift toward the bottom and a wide pool of light (the far plane).
vec3 groundAt(vec2 p) {
  vec2 s = (p - uSkyOff) / uRes;
  vec3 g = mix(uGround, mix(uGround, vec3(1.0), 0.32), smoothstep(0.62, 1.05, s.y) * 0.7);
  vec2 lq = (s - vec2(0.5, 0.42)) * vec2(uRes.x / uRes.y, 1.0);
  g = mix(g, mix(uGround, vec3(1.0), 0.18), exp(-dot(lq, lq) * 3.2) * 0.5);
  return g;
}
float textA(vec2 p) {
  return texture2D(uText, p / uRes).a * uTextOn;
}
// The ball's warm palette: deep red, red, orange, coral, pale streak.
vec3 warm(float s) {
  vec3 c = mix(vec3(0.43, 0.04, 0.05), vec3(0.75, 0.14, 0.06), smoothstep(0.0, 0.3, s));
  c = mix(c, vec3(0.93, 0.31, 0.11), smoothstep(0.3, 0.55, s));
  c = mix(c, vec3(1.0, 0.54, 0.38), smoothstep(0.55, 0.8, s));
  return mix(c, vec3(1.0, 0.84, 0.76), smoothstep(0.8, 1.0, s));
}
float key(vec3 c) {
  return smoothstep(0.38, 0.93, dot(c, vec3(0.299, 0.587, 0.114)) - 0.5 * (c.r - c.b));
}
vec3 sceneAt(vec2 p) {
  vec4 t = texture2D(uText, p / uRes) * uTextOn;
  return mix(groundAt(p), t.rgb, t.a);
}

void main() {
  vec2 p = vUv * uRes;
  vec2 c = uO.xy;
  float R = uO.z;
  vec2 v = p - c;
  vec2 q = v / R;
  float d = length(q);

  // The type and ground near the ball swell toward its rim, with a faint rainbow split.
  vec3 col;
  float near = (1.0 - smoothstep(1.0, 1.75, d)) * uOrbOn;
  if (near > 0.0) {
    float m = 1.0 - 0.13 * near * near;
    float ca = 0.0035 * near;
    col = vec3(sceneAt(c + v * (m - ca)).r, sceneAt(c + v * m).g, sceneAt(c + v * (m + ca)).b);
  } else {
    col = sceneAt(p);
  }

  // Its soft shadow on the type, light from the upper left, and the warm caustic inside it.
  vec2 sq = (v - vec2(0.2, 0.5) * R) / (R * vec2(1.0, 0.92));
  float sh = 1.0 - smoothstep(0.3, 1.22, length(sq));
  col *= mix(vec3(1.0), uShade, sh * 0.5 * uOrbOn);
  vec2 cq = (v - vec2(0.34, 0.98) * R) / (R * vec2(0.46, 0.2));
  col += vec3(1.0, 0.55, 0.3) * exp(-dot(cq, cq) * 1.6) * 0.16 * uOrbOn;
  // The light around it: a pale halo on the blue, a touch of its warmth near the rim.
  float halo = exp(-max(d - 1.0, 0.0) * 2.4) * step(1.0, d) * uOrbOn;
  col = mix(col, uHalo, halo * 0.34);
  col += vec3(0.5, 0.18, 0.05) * 0.05 * exp(-max(d - 1.0, 0.0) * 9.0) * step(1.0, d) * uOrbOn;

  // Ripples while it rings.
  if (uRingA > 0.0) {
    for (int k = 0; k < 2; k++) {
      float ph = fract(uRingP + float(k) * 0.5);
      float rr = 1.04 + ph * 1.1;
      float band = exp(-pow((d - rr) / 0.022, 2.0)) * (1.0 - ph) * (1.0 - ph);
      col = mix(col, vec3(1.0), band * uRingA * 0.55 * step(1.0, d));
    }
  }

  if (d < 1.0) {
    // Seen through the glass: the type magnified, with a chromatic edge.
    float m = 0.5 + 0.3 * d * d;
    float ca = 0.04 * d * d;
    vec3 ta = vec3(textA(c + v * (m - ca)), textA(c + v * m), textA(c + v * (m + ca)));

    // The marbled interior: a slow turn, a slower swirl that winds and unwinds, and a gentle flow.
    float ang = uT * 0.07 + 0.55 * sin(uT * 0.16) * (1.0 - d) * (1.0 - d);
    float cs = cos(ang);
    float sn = sin(ang);
    vec2 r = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y);
    r += 0.055 * (1.0 - d * d) * vec2(sin(r.y * 3.3 + uT * 0.41), sin(r.x * 2.9 - uT * 0.37));
    vec3 sw = texture2D(uOrb, uOrbTex.xy + r * uOrbTex.z * 0.94).rgb;
    vec3 orb = warm(0.1 + 0.8 * key(sw));
    // Volume: lit from the upper left, deeper toward the lower right rim.
    float lit = dot(normalize(vec3(q, sqrt(max(0.0, 1.0 - d * d)))), normalize(vec3(-0.45, -0.55, 0.7)));
    orb *= 0.62 + 0.5 * clamp(lit, 0.0, 1.0);
    orb = mix(orb, orb * vec3(0.55, 0.32, 0.4), smoothstep(0.7, 1.0, d) * smoothstep(-0.2, 0.6, q.x + q.y) * 0.7);
    // The type through it, warm white.
    orb = mix(orb, vec3(1.0, 0.92, 0.86), ta * 0.82);
    // Gloss that stays put: the window highlight and sparkles from the image, a soft spot, a thin rim.
    vec3 fx = texture2D(uOrb, uOrbTex.xy + q * uOrbTex.z * 0.985).rgb;
    float hi = smoothstep(0.86, 0.99, min(fx.r, min(fx.g, fx.b)));
    orb = mix(orb, vec3(1.0, 0.95, 0.92), hi * 0.42);
    vec2 gq = (q - vec2(-0.36, -0.44)) / vec2(0.34, 0.24);
    orb += vec3(1.0, 0.9, 0.85) * exp(-dot(gq, gq) * 1.4) * 0.3;
    orb = mix(orb, vec3(1.0, 0.72, 0.6), smoothstep(0.9, 1.0, d) * smoothstep(0.2, -0.6, q.x + q.y) * 0.5);
    float e = smoothstep(1.0, 1.0 - 2.4 / R, d);
    col = mix(col, orb, e * uOrbOn);
  }
  gl_FragColor = vec4(col, 1.0);
}`,s=[{label:"Product",href:"#product"},{label:"How it works",href:"#how"},{label:"FAQ",href:"#faqs"},{label:"Praxis Pro",href:"/pro"}];function o({brand:e="Praxis Flow",line1:d="Your whole stack,",line2:h="composed to order.",lede:p="Pick a framework, a backend, a database and a deploy target. Praxis validates the set and writes one coherent repository.",cta:x="Watch it compose",busy:u="Resolving…",done:m="Composed",command:f="npx praxiflow",speaker:g="praxis",result:b="Resolved 8 modules, composed them in staging, then wrote my-app/. Nothing partial.",links:v=s,navCta:w={label:"Agent Wiki",href:"https://github.com/sidhxntt/Praxis/wiki/Agent-Guide"},stat:y=["40","landing-page styles ship with the CLI"],meta:j="Next.js · Vite · Vue · Astro · Angular · Express",ground:T="#2563eb",accent:R="#bfdbfe",ink:N="#1d4ed8",deep:E="#172554",shade:k="#99a8db",halo:A="#dbeafe",drift:S=1,orb:M="/design/websites/ora-call/orb.webp",sound:L=!0,onCta:P,demo:C=!0,altLabel:O,onAlt:U,fonts:_=!0,grain:B="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>",softwareGL:q=!0,ball:I=!0}){let D,F=(0,i.useRef)(null),z=(0,i.useRef)(null),G=(0,i.useRef)(null),X=(0,i.useRef)(null),V=(0,i.useRef)(null),$=(0,i.useRef)({x:0,y:0,on:!1}),Y=(0,i.useRef)(-1),W=(0,i.useRef)(S),H=(0,i.useRef)(a(T)),K=(0,i.useRef)(a(k)),J=(0,i.useRef)(a(A));(0,i.useEffect)(()=>{W.current=S,H.current=a(T),K.current=a(k),J.current=a(A)},[S,T,k,A]);let[Q,Z]=(0,i.useState)(!1),[ee,et]=(0,i.useState)("idle"),[ei,ea]=(0,i.useState)(""),[er,en]=(0,i.useState)(!1),es=(0,i.useRef)([]),eo=(D=(0,i.useRef)(null),(0,i.useEffect)(()=>()=>void D.current?.close().catch(()=>{}),[]),(0,i.useCallback)(e=>{if(!L||"1"===document.documentElement.dataset.cdMute)return;let t=navigator.userActivation;if(!t||t.hasBeenActive)try{let t,i=window.AudioContext??window.webkitAudioContext;if(!i)return;let a=D.current??=new i;"suspended"===a.state&&a.resume();let r=a.currentTime+(e.at??0),n=Math.min(e.d??.04,.06),s=a.createGain();if(s.gain.setValueAtTime(1e-4,r),s.gain.exponentialRampToValueAtTime(Math.min(e.g??.03,.06),r+(e.noise?.006:.005)),s.gain.exponentialRampToValueAtTime(1e-4,r+n),s.connect(a.destination),e.noise){let i=a.createBuffer(1,Math.ceil(a.sampleRate*n),a.sampleRate),r=i.getChannelData(0);for(let e=0;e<r.length;e++)r[e]=2*Math.random()-1;let o=a.createBufferSource();o.buffer=i;let l=a.createBiquadFilter();l.type="bandpass",l.frequency.value=e.f,l.Q.value=1.4,o.connect(l).connect(s),t=o}else{let i=a.createOscillator();i.type=e.type??"sine",i.frequency.setValueAtTime(e.f,r),e.to&&i.frequency.exponentialRampToValueAtTime(e.to,r+n),i.connect(s),t=i}t.start(r),t.stop(r+n+.01)}catch{}},[L]));(0,i.useEffect)(()=>()=>es.current.forEach(e=>window.clearTimeout(e)),[]);let el=(0,i.useCallback)(()=>{if(P?.(),!C||"idle"!==ee)return;es.current.forEach(e=>window.clearTimeout(e)),es.current=[],et("ring"),ea(""),Y.current=performance.now();for(let e=0;e<2;e++)for(let t=0;t<9;t++)eo({f:520+40*t+60*e,d:.03,g:.018,at:.75*e+.05*t});eo({f:2600,noise:!0,d:.03,g:.03,at:1.55}),eo({f:660,d:.06,g:.026,type:"triangle",at:1.64}),eo({f:990,d:.06,g:.022,type:"triangle",at:1.74});let e=b.split(" ");es.current.push(window.setTimeout(()=>{et("live"),e.forEach((t,i)=>es.current.push(window.setTimeout(()=>ea(e.slice(0,i+1).join(" ")),85*i)))},1550)),es.current.push(window.setTimeout(()=>{et("idle"),ea("")},5200))},[eo,C,P,b,ee]),ec=(0,i.useCallback)(()=>{eo({f:1320,d:.03,g:.02,type:"triangle"}),navigator.clipboard?.writeText(f).then(()=>{en(!0),es.current.push(window.setTimeout(()=>en(!1),1600))},()=>{})},[eo,f]);(0,i.useEffect)(()=>{let e,t=F.current,i=z.current;if(!I||!t||!i)return;let a=window.matchMedia("(prefers-reduced-motion: reduce)").matches,s=i.getContext("webgl",{antialias:!1,alpha:!1,premultipliedAlpha:!1});if(!s)return;if(!q){let e=s.getExtension("WEBGL_debug_renderer_info"),t=String(e?s.getParameter(e.UNMASKED_RENDERER_WEBGL):s.getParameter(s.RENDERER));if(/swiftshader|llvmpipe|softpipe|software|basic render/i.test(t))return void s.getExtension("WEBGL_lose_context")?.loseContext()}let o=(e,t)=>{let i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i},l=s.createProgram();if(s.attachShader(l,o(s.VERTEX_SHADER,r)),s.attachShader(l,o(s.FRAGMENT_SHADER,n)),s.linkProgram(l),!s.getProgramParameter(l,s.LINK_STATUS))return;s.useProgram(l);let c=s.createBuffer();s.bindBuffer(s.ARRAY_BUFFER,c),s.bufferData(s.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),s.STATIC_DRAW);let d=s.getAttribLocation(l,"aPos");s.enableVertexAttribArray(d),s.vertexAttribPointer(d,2,s.FLOAT,!1,0,0);let h={res:s.getUniformLocation(l,"uRes"),ground:s.getUniformLocation(l,"uGround"),skyOff:s.getUniformLocation(l,"uSkyOff"),o:s.getUniformLocation(l,"uO"),t:s.getUniformLocation(l,"uT"),textOn:s.getUniformLocation(l,"uTextOn"),orbOn:s.getUniformLocation(l,"uOrbOn"),ringA:s.getUniformLocation(l,"uRingA"),ringP:s.getUniformLocation(l,"uRingP"),orbTex:s.getUniformLocation(l,"uOrbTex"),shade:s.getUniformLocation(l,"uShade"),halo:s.getUniformLocation(l,"uHalo")};s.uniform1i(s.getUniformLocation(l,"uText"),1),s.uniform1i(s.getUniformLocation(l,"uOrb"),2),s.uniform3f(h.orbTex,.49705,.50312,.4634);let p=e=>{let t=s.createTexture();return s.activeTexture(s.TEXTURE0+e),s.bindTexture(s.TEXTURE_2D,t),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,new Uint8Array([0,0,0,0])),t},x=p(1),u=p(2),m=0,f=0,g=!1;(e=new Image).decoding="async",e.onload=()=>{g||(s.activeTexture(s.TEXTURE0+2),s.bindTexture(s.TEXTURE_2D,u),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,e),(()=>m=1)(),_())},e.src=M;let b=document.createElement("canvas"),v=b.getContext("2d"),w={w:1,h:1,restX:0,restY:0,r:1,hx:0,ax:0,yLow:0},y=1,j=()=>{let e=G.current,a=X.current,r=V.current;if(!e||!a||!r)return;let n=t.offsetWidth,o=t.offsetHeight,l=t.getBoundingClientRect(),c=n/Math.max(1,l.width),d=e=>{let t=e.getBoundingClientRect();return{x:(t.left-l.left)*c,y:(t.top-l.top)*c,w:t.width*c,h:t.height*c}},p=Math.max(1,Math.round(n*(y=Math.min(2,window.devicePixelRatio||1)))),u=Math.max(1,Math.round(o*y));(i.width!==p||i.height!==u)&&(i.width=p,i.height=u);let m=d(e),g=d(a),j=d(r),T=m.w/2;w={w:n,h:o,restX:m.x+m.w/2,restY:m.y+m.h/2,r:T,hx:g.x+g.w/2,ax:g.w*(n<640?.26:.4),yLow:Math.max(m.y+m.h/2,j.y-T-10)},v&&(b.width=p,b.height=u,v.setTransform(y,0,0,y,0,0),v.clearRect(0,0,n,o),a.querySelectorAll("[data-w]").forEach(e=>{let t=getComputedStyle(e),i=d(e);v.font=`${t.fontStyle} ${t.fontWeight} ${t.fontSize} ${t.fontFamily}`,v.letterSpacing="normal"===t.letterSpacing?"0px":t.letterSpacing,v.fillStyle=t.color,v.textBaseline="alphabetic";let a=v.measureText("Hg"),r=a.fontBoundingBoxAscent||.9*parseFloat(t.fontSize),n=a.fontBoundingBoxDescent||.25*parseFloat(t.fontSize);v.fillText(e.textContent??"",i.x,i.y+i.h*r/(r+n))}),s.activeTexture(s.TEXTURE1),s.bindTexture(s.TEXTURE_2D,x),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,b),f=1,s.viewport(0,0,p,u),s.uniform2f(h.res,p,u),_())},T=9.5,R=0,N=0,E=!0,k=!1,A=+!!a,S={x:0,y:0},L={x:0,y:0},P=!1,C=e=>{N=0;let t=R?Math.min(.05,(e-R)/1e3):0;R=e,a||(T+=t,A=Math.min(1,A+t/1.1));let i=1-Math.pow(1-A,3),r=2*Math.PI/30*Math.max(.2,W.current),n=T*r,o=a?w.restX:w.hx+w.ax*Math.sin(n),l=a?w.restY:w.restY+(w.yLow-w.restY)*(.5+.5*Math.sin(2*n-.6)),c=$.current,d=1-Math.exp(-(2.6*t)),p=c.on&&!a?Math.max(-130,Math.min(130,(c.x-o)*.28)):0,x=c.on&&!a?Math.max(-70,Math.min(70,(c.y-l)*.22)):0;S.x+=(p-S.x)*d,S.y+=(x-S.y)*d;let u=c.on?c.x/w.w*2-1:0,g=c.on?c.y/w.h*2-1:0,b=16*u+(a?0:6*Math.sin(.23*T)),v=10*g+(a?0:3*Math.cos(.19*T));L.x+=(b-L.x)*(a?1:d),L.y+=(v-L.y)*(a?1:d),o+=S.x-L.x,l=Math.min(w.yLow+6,l+S.y)-L.y;let j=0,E=0,M=0;if(Y.current>0){let t=(e-Y.current)/1e3;t<1.5&&(j=.04*(.5-.5*Math.cos(2*Math.PI*t/.75))),E=t<1.5?Math.min(1,t/.15):Math.max(0,1-(t-1.5)/.7),M=t/.75,t>2.4&&(Y.current=-1)}let O=w.r*(.94+.06*i)*(1+j);l+=(1-i)*18,s.uniform3f(h.o,o*y,l*y,O*y),s.uniform2f(h.skyOff,(.4*L.x+(a?0:.022*Math.sin(.075*T)*w.w))*y,.4*L.y*y),s.uniform3fv(h.ground,H.current),s.uniform3fv(h.shade,K.current),s.uniform3fv(h.halo,J.current),s.uniform1f(h.t,T),s.uniform1f(h.textOn,f),s.uniform1f(h.orbOn,m*i),s.uniform1f(h.ringA,E),s.uniform1f(h.ringP,M),s.drawArrays(s.TRIANGLES,0,3),!P&&f&&m&&(P=!0,Z(!0)),k&&!a&&(N=requestAnimationFrame(C))},O=()=>{k||!E||document.hidden||(k=!0,R=0,N=requestAnimationFrame(C))},U=()=>{k=!1,N&&cancelAnimationFrame(N),N=0};function _(){!a&&k||N||(N=requestAnimationFrame(C))}let B=new ResizeObserver(j);B.observe(t),j(),document.fonts?.ready.then(()=>!g&&j());let D=()=>!g&&j();document.fonts?.addEventListener?.("loadingdone",D);let Q=new IntersectionObserver(([e])=>{(E=e.isIntersecting)&&!a?O():U()});Q.observe(t);let ee=()=>document.hidden?U():!a&&O();return document.addEventListener("visibilitychange",ee),a?_():O(),()=>{g=!0,U(),B.disconnect(),Q.disconnect(),document.removeEventListener("visibilitychange",ee),document.fonts?.removeEventListener?.("loadingdone",D),s.deleteTexture(x),s.deleteTexture(u),s.deleteBuffer(c),s.deleteProgram(l)}},[I,M,q]);let ed=e=>e.split(" ").map((e,i,a)=>(0,t.jsxs)("span",{children:[(0,t.jsx)("span",{"data-w":"",children:e}),i<a.length-1?" ":""]},i));return(0,t.jsxs)("section",{ref:F,className:`pxh${Q?" pxh-live":""}${I?"":" pxh-noball"}`,style:{"--pxh-accent":R,"--pxh-ground":T,"--pxh-ink":N,"--pxh-deep":E,"--pxh-grain":`url("${B}")`},onPointerMove:e=>{let t=F.current;if(!t||"touch"===e.pointerType)return;let i=t.getBoundingClientRect(),a=t.offsetWidth/Math.max(1,i.width);$.current={x:(e.clientX-i.left)*a,y:(e.clientY-i.top)*a,on:!0}},onPointerLeave:()=>{$.current={...$.current,on:!1}},id:"home","aria-label":e,children:[(0,t.jsx)("style",{children:_?l+c:c}),I&&(0,t.jsx)("canvas",{ref:z,className:"pxh-gl","aria-hidden":"true"}),(0,t.jsx)("div",{className:"pxh-grain","aria-hidden":"true"}),(0,t.jsxs)("header",{className:"pxh-nav",children:[(0,t.jsxs)("a",{className:"pxh-logo",href:"#home",children:[(0,t.jsx)("span",{className:"pxh-dot","aria-hidden":"true"}),e]}),(0,t.jsx)("nav",{className:"pxh-links","aria-label":"Main",children:v.map(e=>(0,t.jsx)("a",{href:e.href,children:e.label},e.href))}),(0,t.jsx)("a",{className:"pxh-try",href:w.href,children:w.label})]}),(0,t.jsxs)("div",{className:"pxh-stage",children:[I&&(0,t.jsx)("div",{ref:G,className:"pxh-slot","aria-hidden":"true",children:(0,t.jsx)("img",{className:"pxh-orbimg",src:M,alt:"",draggable:!1})}),(0,t.jsxs)("h1",{ref:X,className:"pxh-h",children:[(0,t.jsx)("span",{className:"pxh-l1",children:ed(d)})," ",(0,t.jsx)("span",{className:"pxh-l2",children:ed(h)})]}),(0,t.jsx)("p",{ref:V,className:"pxh-p",children:p}),(0,t.jsxs)("div",{className:"pxh-cta",children:[(0,t.jsxs)("button",{type:"button",className:"pxh-btn pxh-main",onClick:el,"aria-live":"polite","data-state":ee,children:[(0,t.jsx)("span",{className:"pxh-ico","aria-hidden":"true",children:(0,t.jsxs)("svg",{viewBox:"0 0 16 16",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,t.jsx)("path",{d:"M2.5 4l4 4-4 4"}),(0,t.jsx)("path",{d:"M8.5 12.5h5"})]})}),"ring"===ee?u:"live"===ee?m:x]}),U?(0,t.jsx)("button",{type:"button",className:"pxh-btn pxh-alt",onClick:U,children:O}):(0,t.jsxs)("button",{type:"button",className:"pxh-btn pxh-alt pxh-cmd",onClick:ec,"aria-label":`Copy ${f}`,children:[(0,t.jsx)("span",{className:"pxh-sigil","aria-hidden":"true",children:"$"}),f,(0,t.jsx)("span",{className:"pxh-copied","aria-live":"polite",children:er?"Copied":""})]}),(0,t.jsx)("p",{className:"pxh-said","aria-live":"polite",children:ei?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("b",{children:g})," ",ei]}):null})]})]}),(0,t.jsxs)("footer",{className:"pxh-foot",children:[(0,t.jsxs)("span",{className:"pxh-stat",children:[(0,t.jsx)("i",{"aria-hidden":"true"})," ",(0,t.jsx)("b",{children:y[0]})," ",y[1]]}),(0,t.jsx)("span",{className:"pxh-meta",children:j})]})]})}let l=`@import url("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@1&display=swap");
`,c=`

.pxh {
  container-type: inline-size;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  font-family: "Inter Tight", ui-sans-serif, system-ui, sans-serif;
  background: linear-gradient(180deg, var(--pxh-ground) 0%, var(--pxh-ground) 62%, color-mix(in srgb, var(--pxh-ground) 78%, #fff) 108%);
  -webkit-font-smoothing: antialiased;
}
.pxh-gl {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0;
  transition: opacity .5s ease;
}
.pxh-live .pxh-gl { opacity: 1; }
.pxh-noball {
  background:
    radial-gradient(62% 58% at 50% 44%, color-mix(in srgb, #fff 20%, transparent), transparent 72%),
    linear-gradient(180deg, var(--pxh-ground) 0%, var(--pxh-ground) 62%, color-mix(in srgb, var(--pxh-ground) 78%, #fff) 108%);
}
.pxh-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: .12;
  mix-blend-mode: overlay;
  background-image: var(--pxh-grain);
}

.pxh-nav {
  position: absolute;
  left: 44px;
  right: 44px;
  top: 30px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 14px;
  font-weight: 500;
}
.pxh-logo {
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 18px;
  font-weight: 600;
  color: inherit;
  text-decoration: none;
  letter-spacing: -.01em;
}
.pxh-dot { width: 16px; height: 16px; border-radius: 50%; background: #fff; }
.pxh-links { display: flex; gap: 28px; }
.pxh-links a { color: inherit; opacity: .78; text-decoration: none; transition: opacity .2s; }
.pxh-links a:hover { opacity: 1; }
.pxh-try {
  text-decoration: none;
  font: inherit;
  font-size: 13.5px;
  border: 0;
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 999px;
  background: #fff;
  color: var(--pxh-ink);
  transition: transform .18s ease, background .2s;
}
.pxh-try:hover { background: color-mix(in srgb, var(--pxh-ground) 9%, #fff); }
.pxh-try:active { transform: scale(.97); }

.pxh-stage {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px 44px;
  pointer-events: none;
}
.pxh-stage > * { pointer-events: auto; }
.pxh-slot {
  --orb: clamp(170px, 22.9cqi, 340px);
  width: var(--orb);
  height: var(--orb);
  margin-bottom: 20px;
  flex: none;
  pointer-events: none;
}
.pxh-orbimg {
  width: 100%;
  height: 100%;
  display: block;
  filter: hue-rotate(-28deg) saturate(1.9) brightness(.92) drop-shadow(0 40px 50px color-mix(in srgb, var(--pxh-deep) 30%, transparent));
  transition: opacity .5s ease;
}
.pxh-live .pxh-orbimg { opacity: 0; }
.pxh-h {
  margin: 0;
  font-weight: 500;
  transition: opacity .5s ease;
}
.pxh-live .pxh-h { opacity: 0; }
.pxh-l1 {
  display: block;
  font-size: min(74px, 9.6cqi);
  letter-spacing: -.045em;
  line-height: 1;
}
.pxh-l2 {
  display: block;
  font-family: "Instrument Serif", ui-serif, Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: min(96px, 11.8cqi);
  line-height: 1;
  letter-spacing: -.02em;
  color: var(--pxh-accent);
}
.pxh-p {
  margin: 22px auto 0;
  max-width: 470px;
  font-size: 16px;
  line-height: 1.5;
  color: rgba(255, 255, 255, .84);
}
.pxh-cta {
  position: relative;
  margin-top: 26px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
.pxh-btn {
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 14px 24px;
  border-radius: 999px;
  transition: transform .18s ease, box-shadow .2s, background .2s;
}
.pxh-btn:active { transform: scale(.97); }
.pxh-main {
  background: #fff;
  color: var(--pxh-ink);
  min-width: 176px;
  justify-content: center;
  box-shadow: 0 10px 26px -12px color-mix(in srgb, var(--pxh-deep) 60%, transparent);
}
.pxh-main:hover { background: color-mix(in srgb, var(--pxh-ground) 6%, #fff); }
.pxh-main[data-state="ring"] .pxh-ico { animation: pxh-ring .375s ease-in-out infinite alternate; }
.pxh-ico { display: inline-flex; }
.pxh-alt {
  background: rgba(255, 255, 255, .14);
  color: #fff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .42);
}
.pxh-alt:hover { background: rgba(255, 255, 255, .22); }
.pxh-cmd { position: relative; }
.pxh-sigil { opacity: .6; margin-right: -3px; }
.pxh-copied {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  font-size: 12px;
  color: var(--pxh-accent);
  pointer-events: none;
}
.pxh-btn:focus-visible, .pxh-try:focus-visible, .pxh-links a:focus-visible, .pxh-logo:focus-visible {
  outline: 2px solid var(--pxh-accent);
  outline-offset: 3px;
}
.pxh-said {
  position: absolute;
  top: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: min(560px, 90cqi);
  margin: 0;
  font-size: 14.5px;
  line-height: 1.45;
  color: #fff;
  min-height: 1.45em;
}
.pxh-said b { color: var(--pxh-accent); font-weight: 600; margin-right: 4px; }
@keyframes pxh-ring { from { transform: rotate(-10deg); } to { transform: rotate(10deg); } }

.pxh-foot {
  position: absolute;
  left: 44px;
  right: 44px;
  bottom: 26px;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  color: rgba(255, 255, 255, .78);
}
.pxh-stat { display: inline-flex; align-items: center; gap: 6px; }
.pxh-stat b { font-weight: 600; color: #fff; font-variant-numeric: tabular-nums; }
.pxh-stat i { width: 7px; height: 7px; border-radius: 50%; background: #7dffc4; box-shadow: 0 0 0 3px rgba(125, 255, 196, .25); }

@container (max-width: 860px) {
  .pxh-links { display: none; }
  .pxh-meta { display: none; }
  .pxh-foot { justify-content: center; }
}
@container (max-width: 640px) {
  .pxh-nav { left: 20px; right: 20px; top: 22px; }
  .pxh-stage { padding: 80px 20px 96px; }
  .pxh-slot { --orb: clamp(150px, 50cqi, 220px); margin-bottom: 26px; }
  .pxh-p { font-size: 15px; max-width: 310px; margin-top: 18px; }
  .pxh-cta { margin-top: 22px; gap: 8px; }
  .pxh-btn { padding: 13px 18px; font-size: 14.5px; }
  .pxh-main { min-width: 0; }
  .pxh-said { font-size: 13.5px; width: 86cqi; }
  .pxh-foot { bottom: 22px; left: 20px; right: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .pxh-gl, .pxh-h, .pxh-orbimg { transition: none; }
  .pxh-main[data-state="ring"] .pxh-ico { animation: none; }
}
`,d={src:e.i(37713).default,width:200,height:200,blurWidth:0,blurHeight:0},h="https://github.com/sidhxntt/Praxis",p=["Next.js","Vite (React)","TypeScript","JavaScript"];function x(){return(0,t.jsx)("svg",{"aria-hidden":"true",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{d:"M5 12h14M14 7l5 5-5 5"})})}function u(){return(0,t.jsx)("svg",{"aria-hidden":"true",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{d:"M6 6l12 12M18 6 6 18"})})}function m(){return(0,t.jsxs)("svg",{"aria-hidden":"true",viewBox:"0 0 24 24",children:[(0,t.jsx)("circle",{cx:"11",cy:"11",r:"6.5"}),(0,t.jsx)("path",{d:"m16 16 4 4"})]})}function f(){return(0,t.jsx)("svg",{"aria-hidden":"true",viewBox:"0 0 24 24",children:(0,t.jsx)("path",{d:"M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M10 14v6"})})}let g={desktop:{w:1440,h:900,label:"Desktop"},phone:{w:390,h:844,label:"Phone"}};function b({style:e,device:a}){let r=(0,i.useRef)(null),[n,s]=(0,i.useState)({w:0,h:0}),[o,l]=(0,i.useState)(!1);(0,i.useEffect)(()=>{let e=r.current;if(!e)return;let t=new ResizeObserver(([e])=>s({w:e.contentRect.width,h:e.contentRect.height}));return t.observe(e),()=>t.disconnect()},[]),(0,i.useEffect)(()=>l(!1),[e.id]);let c=g[a],d="desktop"===a?Math.max:Math.min,h=n.w&&n.h?d(n.w/c.w,n.h/c.h):0,p="phone"===a?e.previews.mobile:e.previews.desktop;return(0,t.jsx)("div",{className:"live-stage",ref:r,"data-device":a,children:h>0&&(0,t.jsxs)("div",{className:"live-device",style:{width:c.w*h,height:c.h*h},children:[!o&&(0,t.jsx)("img",{className:"live-poster",src:`/${p.path}`,alt:"","aria-hidden":"true"}),(0,t.jsx)("iframe",{id:"preview-frame",className:"live-frame",src:`/live/${e.id}/`,title:`${e.label} live preview`,onLoad:()=>l(!0),style:{width:c.w,height:c.h,transform:`scale(${h})`}},e.id)]})})}function v({label:e}){let i=/^(.*) (inspired)$/.exec(e);return i?(0,t.jsxs)(t.Fragment,{children:[i[1]," ",(0,t.jsx)("em",{children:i[2]})]}):(0,t.jsx)(t.Fragment,{children:e})}e.s(["default",0,function(){let[e,a]=(0,i.useState)([]),[r,n]=(0,i.useState)(""),[s,l]=(0,i.useState)(""),[c,w]=(0,i.useState)(!1),[y,j]=(0,i.useState)(null),[T,R]=(0,i.useState)("desktop"),[N,E]=(0,i.useState)("idle"),[k,A]=(0,i.useState)(!1),S=(0,i.useRef)(null);(0,i.useEffect)(()=>{fetch("/catalog.json").then(e=>e.json()).then(a)},[]),(0,i.useEffect)(()=>(document.body.classList.toggle("drawer-open",c),()=>document.body.classList.remove("drawer-open")),[c]),(0,i.useEffect)(()=>{let e=()=>A(window.scrollY>.85*window.innerHeight);return e(),window.addEventListener("scroll",e,{passive:!0}),()=>window.removeEventListener("scroll",e)},[]);let M=(0,i.useMemo)(()=>[...new Set(e.flatMap(e=>e.traits))].sort(),[e]),L=(0,i.useMemo)(()=>e.filter(e=>!s||e.traits.includes(s)).filter(e=>!r.trim()||[e.label,e.description,...e.traits].join(" ").toLowerCase().includes(r.trim().toLowerCase())),[e,r,s]),P=async()=>{if(y){E("sending");try{if(!(await fetch("/select",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:y.id})})).ok)throw Error("selection rejected");E("selected")}catch{E("error")}}},C=()=>{n(""),l("")};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"site-nav","data-shown":k,"aria-hidden":!k,children:(0,t.jsxs)("header",{children:[(0,t.jsxs)("a",{className:"site-nav-logo",href:"#home",tabIndex:k?0:-1,children:[(0,t.jsx)("span",{"aria-hidden":"true"}),"Praxis Flow"]}),(0,t.jsxs)("nav",{"aria-label":"Sections",children:[(0,t.jsx)("a",{href:"#gallery",tabIndex:k?0:-1,children:"Browse"}),(0,t.jsx)("a",{href:"#frameworks",tabIndex:k?0:-1,children:"Frameworks"})]}),(0,t.jsx)("button",{type:"button",className:"pill pill-brand",tabIndex:k?0:-1,onClick:()=>w(!0),children:"Search & filter"})]})}),(0,t.jsx)(o,{brand:"Praxis Flow",line1:"Choose a direction,",line2:"then make it yours.",lede:"Preview each animated landing-page hero, then send your choice straight back to the waiting Praxis CLI.",cta:"Browse directions",demo:!1,onCta:()=>document.getElementById("library")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}),altLabel:"Search & filter",onAlt:()=>w(!0),links:[{label:"Browse",href:"#gallery"},{label:"Frameworks",href:"#frameworks"},{label:"Praxis",href:h}],navCta:{label:"View on GitHub",href:h},stat:[e.length?String(e.length):"","animated heroes · fully offline"],meta:"Next.js · Vite (React)",grain:d.src,fonts:!1,sound:!1,ball:!1}),(0,t.jsx)("section",{id:"frameworks",className:"frameworks","aria-label":"Framework compatibility",children:(0,t.jsxs)("div",{className:"compatibility",children:[(0,t.jsxs)("p",{children:[(0,t.jsx)("strong",{children:"Built for React."})," Each hero is one self-contained React component, shipped as written for Next.js and Vite in TypeScript or JavaScript. Vue, Astro and Angular projects start from the plain starter."]}),(0,t.jsx)("ul",{"aria-label":"Supported frameworks",children:p.map(e=>(0,t.jsx)("li",{children:e},e))})]})}),(0,t.jsxs)("main",{id:"library",children:[(0,t.jsxs)("section",{className:"gallery-actions","aria-label":"Gallery controls",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"eyebrow",children:"Landing page library"}),(0,t.jsxs)("h2",{className:"display",children:["Explore every ",(0,t.jsx)("em",{children:"hero."})]})]}),(0,t.jsxs)("div",{className:"gallery-action-buttons",children:[(0,t.jsxs)("p",{id:"count","aria-live":"polite",children:[L.length," of ",e.length," styles"]}),(0,t.jsxs)("button",{id:"open-filters",className:"open-filters",type:"button","aria-expanded":c,"aria-controls":"filter-drawer",onClick:()=>w(!0),children:[(0,t.jsx)(f,{}),(0,t.jsx)("span",{children:"Search & filter"}),(r||s)&&(0,t.jsx)("i",{"aria-label":"Filters active"})]})]})]}),(0,t.jsx)("section",{id:"gallery",className:"gallery","aria-label":"Landing-page styles",children:L.map(e=>(0,t.jsxs)("button",{type:"button",className:"card",onClick:()=>{j(e),R(window.matchMedia("(max-width: 860px)").matches?"phone":"desktop"),E("idle"),S.current?.showModal()},children:[(0,t.jsxs)("span",{className:"swatch-wrap",children:[(0,t.jsx)("img",{className:"swatch",src:`/${e.previews.thumbnail.path}`,alt:e.previews.thumbnail.alt,loading:"lazy",width:"640",height:"400"}),(0,t.jsxs)("span",{className:"preview-hint",children:["View full preview ",(0,t.jsx)(x,{})]})]}),(0,t.jsxs)("span",{className:"card-copy",children:[(0,t.jsxs)("span",{className:"card-heading",children:[(0,t.jsx)("h2",{children:(0,t.jsx)(v,{label:e.label})}),(0,t.jsx)("span",{className:"theme-dot","data-theme":e.theme,title:`${e.theme} theme`,"aria-hidden":"true"})]}),(0,t.jsx)("p",{children:e.description}),(0,t.jsx)("span",{className:"card-traits",children:e.traits.map(e=>(0,t.jsx)("span",{className:"tag",children:e},e))})]})]},e.id))}),0===L.length&&(0,t.jsxs)("p",{id:"empty",className:"empty",children:["No directions match those filters. ",(0,t.jsx)("button",{type:"button",onClick:C,children:"Clear them"})," and explore them all."]})]}),(0,t.jsxs)("footer",{className:"gallery-foot",children:[(0,t.jsxs)("span",{children:[(0,t.jsx)("span",{className:"dot","aria-hidden":"true"}),"Praxis Flow"]}),(0,t.jsx)("span",{children:"Nothing leaves your machine. Pick a direction and the CLI carries on."})]}),(0,t.jsxs)("div",{className:"filter-drawer","data-open":c,"aria-hidden":!c,children:[(0,t.jsx)("button",{className:"drawer-backdrop",type:"button","aria-label":"Close filters",tabIndex:c?0:-1,onClick:()=>w(!1)}),(0,t.jsxs)("aside",{id:"filter-drawer",className:"filter-panel","aria-label":"Search and filter landing-page styles",children:[(0,t.jsxs)("header",{children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"eyebrow",children:"Refine library"}),(0,t.jsxs)("h2",{className:"display",children:["Find your ",(0,t.jsx)("em",{children:"direction."})]})]}),(0,t.jsx)("button",{className:"drawer-close",type:"button","aria-label":"Close filters",onClick:()=>w(!1),children:(0,t.jsx)(u,{})})]}),(0,t.jsxs)("label",{className:"search-field",children:[(0,t.jsx)("span",{children:"Search styles"}),(0,t.jsx)(m,{}),(0,t.jsx)("input",{id:"search",type:"search",value:r,onChange:e=>n(e.target.value),placeholder:"Search by style, mood, or industry",autoComplete:"off"})]}),(0,t.jsxs)("div",{className:"drawer-section-heading",children:[(0,t.jsx)("span",{children:"Visual traits"}),(0,t.jsx)("span",{children:M.length})]}),(0,t.jsx)("div",{id:"traits",className:"traits","aria-label":"Filter by trait",children:M.map(e=>(0,t.jsx)("button",{type:"button","aria-pressed":s===e,onClick:()=>l(s===e?"":e),children:e},e))}),(0,t.jsxs)("footer",{children:[(0,t.jsx)("button",{id:"clear-filters",className:"clear-filters",type:"button",onClick:C,children:"Clear filters"}),(0,t.jsxs)("button",{className:"show-results pill pill-brand",type:"button",onClick:()=>w(!1),children:["Show ",L.length," directions"]})]})]})]}),(0,t.jsxs)("dialog",{id:"preview",ref:S,"aria-labelledby":"preview-title",onClose:()=>j(null),onClick:e=>{e.target===S.current&&S.current?.close()},children:[(0,t.jsx)("button",{className:"close",type:"button","aria-label":"Close preview",onClick:()=>S.current?.close(),children:(0,t.jsx)(u,{})}),y&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"preview-art",children:[(0,t.jsxs)("div",{className:"preview-art-bar",children:[(0,t.jsxs)("span",{className:"preview-dots","aria-hidden":"true",children:[(0,t.jsx)("i",{}),(0,t.jsx)("i",{}),(0,t.jsx)("i",{})]}),(0,t.jsxs)("span",{className:"preview-live",children:[(0,t.jsx)("b",{"aria-hidden":"true"}),"Live preview"]}),(0,t.jsxs)("span",{className:"preview-tools",children:[(0,t.jsx)("span",{className:"device-toggle",role:"group","aria-label":"Preview size",children:Object.keys(g).map(e=>(0,t.jsx)("button",{type:"button","aria-pressed":T===e,onClick:()=>R(e),children:g[e].label},e))}),(0,t.jsx)("a",{className:"open-full",href:`/live/${y.id}/`,target:"_blank",rel:"noopener",children:"Full size"})]})]}),(0,t.jsx)(b,{style:y,device:T})]}),(0,t.jsxs)("aside",{className:"preview-copy",children:[(0,t.jsxs)("div",{className:"preview-copy-main",children:[(0,t.jsxs)("span",{className:"eyebrow",id:"preview-theme",children:[y.theme," direction"]}),(0,t.jsx)("h2",{id:"preview-title",className:"display",children:(0,t.jsx)(v,{label:y.label})}),(0,t.jsx)("p",{id:"preview-description",className:"preview-description",children:y.description}),(0,t.jsx)("div",{id:"preview-traits",className:"traits","aria-label":"Template traits",children:y.traits.map(e=>(0,t.jsx)("span",{className:"tag",children:e},e))}),(0,t.jsxs)("dl",{id:"preview-details",className:"preview-details",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("dt",{children:"Frameworks"}),(0,t.jsx)("dd",{children:"Next.js, Vite (React)"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("dt",{children:"Responsive"}),(0,t.jsx)("dd",{children:"Desktop and mobile layouts included"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("dt",{children:"Handoff"}),(0,t.jsx)("dd",{children:"One React component, its pictures, and its design brief in DESIGN.md"})]})]})]}),(0,t.jsxs)("div",{className:"selection-panel",children:[(0,t.jsxs)("button",{id:"select",className:"select",type:"button",disabled:"sending"===N||"selected"===N,onClick:P,children:[(0,t.jsx)("span",{children:"sending"===N?"Sending selection…":"selected"===N?"Direction selected":"error"===N?"Try again":"Use this direction"}),(0,t.jsx)(x,{})]}),(0,t.jsx)("p",{id:"status",role:"status",children:"selected"===N?"Selected. You can return to the terminal.":"error"===N?"The CLI is no longer waiting. Return to the terminal and try again.":"Your CLI will continue as soon as you choose."})]})]})]})]})]})}],18542)}]);