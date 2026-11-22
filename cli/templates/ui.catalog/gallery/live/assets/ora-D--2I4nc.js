import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=`Your phone, answered`,s=`before the second ring.`,c=`“Good afternoon, Bianchi Dental. This is Ora, how can I help?”`,l=[.49705,.50312],u=.4634;function d(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(n=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let r=navigator.userActivation;if(!(r&&!r.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let r=t.current??=new e;r.state===`suspended`&&r.resume();let i=r.currentTime+(n.at??0),a=Math.min(n.d??.04,.06),o=r.createGain();o.gain.setValueAtTime(1e-4,i),o.gain.exponentialRampToValueAtTime(Math.min(n.g??.03,.06),i+(n.noise?.006:.005)),o.gain.exponentialRampToValueAtTime(1e-4,i+a),o.connect(r.destination);let s;if(n.noise){let e=r.createBuffer(1,Math.ceil(r.sampleRate*a),r.sampleRate),t=e.getChannelData(0);for(let e=0;e<t.length;e++)t[e]=Math.random()*2-1;let i=r.createBufferSource();i.buffer=e;let c=r.createBiquadFilter();c.type=`bandpass`,c.frequency.value=n.f,c.Q.value=1.4,i.connect(c).connect(o),s=i}else{let e=r.createOscillator();e.type=n.type??`sine`,e.frequency.setValueAtTime(n.f,i),n.to&&e.frequency.exponentialRampToValueAtTime(n.to,i+a),e.connect(o),s=e}s.start(i),s.stop(i+a+.01)}catch{}},[e])}var f=e=>{let t=/^#?([0-9a-f]{6})$/i.exec(e.trim()),n=t?parseInt(t[1],16):818166;return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]},p=`
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,m=`
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
  col *= mix(vec3(1.0), vec3(0.6, 0.66, 0.86), sh * 0.5 * uOrbOn);
  vec2 cq = (v - vec2(0.34, 0.98) * R) / (R * vec2(0.46, 0.2));
  col += vec3(1.0, 0.55, 0.3) * exp(-dot(cq, cq) * 1.6) * 0.16 * uOrbOn;
  // The light around it: a pale halo on the blue, a touch of its warmth near the rim.
  float halo = exp(-max(d - 1.0, 0.0) * 2.4) * step(1.0, d) * uOrbOn;
  col = mix(col, vec3(0.86, 0.94, 1.0), halo * 0.34);
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
}`;function h({brand:e=`Ora`,cta:t=`Hear it answer`,ground:n=`#0c7bf6`,accent:r=`#c6f0ff`,drift:h=1,orb:_=`/design/websites/ora-call/orb.webp`,sound:v=!0,onCta:y}){let b=(0,i.useRef)(null),x=(0,i.useRef)(null),S=(0,i.useRef)(null),C=(0,i.useRef)(null),w=(0,i.useRef)(null),T=(0,i.useRef)({x:0,y:0,on:!1}),E=(0,i.useRef)(-1),D=(0,i.useRef)(h);D.current=h;let O=(0,i.useRef)(f(n));O.current=f(n);let[k,A]=(0,i.useState)(!1),[j,M]=(0,i.useState)(`idle`),[N,P]=(0,i.useState)(``),[F,I]=(0,i.useState)(1284),L=(0,i.useRef)([]),R=d(v);(0,i.useEffect)(()=>{if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let e=window.setInterval(()=>I(e=>e+1),4200);return()=>window.clearInterval(e)},[]),(0,i.useEffect)(()=>()=>L.current.forEach(e=>window.clearTimeout(e)),[]);let z=(0,i.useCallback)(()=>{if(y?.(),j!==`idle`)return;L.current.forEach(e=>window.clearTimeout(e)),L.current=[],M(`ring`),P(``),E.current=performance.now();for(let e=0;e<2;e++)for(let t=0;t<9;t++)R({f:t%2?480:440,d:.05,g:.022,at:e*.75+t*.05});R({f:2600,noise:!0,d:.03,g:.03,at:1.55}),R({f:660,d:.06,g:.026,type:`triangle`,at:1.64}),R({f:990,d:.06,g:.022,type:`triangle`,at:1.74});let e=c.split(` `);L.current.push(window.setTimeout(()=>{M(`live`),e.forEach((t,n)=>L.current.push(window.setTimeout(()=>P(e.slice(0,n+1).join(` `)),n*85)))},1550)),L.current.push(window.setTimeout(()=>{M(`idle`),P(``)},5200))},[R,y,j]);(0,i.useEffect)(()=>{let e=b.current,t=x.current;if(!e||!t)return;let n=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,r=t.getContext(`webgl`,{antialias:!1,alpha:!1,premultipliedAlpha:!1});if(!r)return;let i=(e,t)=>{let n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n},a=r.createProgram();if(r.attachShader(a,i(r.VERTEX_SHADER,p)),r.attachShader(a,i(r.FRAGMENT_SHADER,m)),r.linkProgram(a),!r.getProgramParameter(a,r.LINK_STATUS))return;r.useProgram(a);let o=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,o),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),r.STATIC_DRAW);let s=r.getAttribLocation(a,`aPos`);r.enableVertexAttribArray(s),r.vertexAttribPointer(s,2,r.FLOAT,!1,0,0);let c=e=>r.getUniformLocation(a,e),d={res:c(`uRes`),ground:c(`uGround`),skyOff:c(`uSkyOff`),o:c(`uO`),t:c(`uT`),textOn:c(`uTextOn`),orbOn:c(`uOrbOn`),ringA:c(`uRingA`),ringP:c(`uRingP`),orbTex:c(`uOrbTex`)};r.uniform1i(c(`uText`),1),r.uniform1i(c(`uOrb`),2),r.uniform3f(d.orbTex,l[0],l[1],u);let f=e=>{let t=r.createTexture();return r.activeTexture(r.TEXTURE0+e),r.bindTexture(r.TEXTURE_2D,t),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,new Uint8Array([0,0,0,0])),t},h=f(1),g=f(2),v=0,y=0,k=!1;((e,t,n,i)=>{let a=new Image;a.decoding=`async`,a.onload=()=>{k||(r.activeTexture(r.TEXTURE0+n),r.bindTexture(r.TEXTURE_2D,t),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,a),i(),J())},a.src=e})(_,g,2,()=>v=1);let j=document.createElement(`canvas`),M=j.getContext(`2d`),N={w:1,h:1,restX:0,restY:0,r:1,hx:0,ax:0,yLow:0},P=1,F=()=>{let n=S.current,i=C.current,a=w.current;if(!n||!i||!a)return;let o=e.offsetWidth,s=e.offsetHeight,c=e.getBoundingClientRect(),l=o/Math.max(1,c.width),u=e=>{let t=e.getBoundingClientRect();return{x:(t.left-c.left)*l,y:(t.top-c.top)*l,w:t.width*l,h:t.height*l}};P=Math.min(2,window.devicePixelRatio||1);let f=Math.max(1,Math.round(o*P)),p=Math.max(1,Math.round(s*P));(t.width!==f||t.height!==p)&&(t.width=f,t.height=p);let m=u(n),g=u(i),_=u(a),v=m.w/2;N={w:o,h:s,restX:m.x+m.w/2,restY:m.y+m.h/2,r:v,hx:g.x+g.w/2,ax:g.w*(o<640?.26:.4),yLow:Math.max(m.y+m.h/2,_.y-v-10)},M&&(j.width=f,j.height=p,M.setTransform(P,0,0,P,0,0),M.clearRect(0,0,o,s),i.querySelectorAll(`[data-w]`).forEach(e=>{let t=getComputedStyle(e),n=u(e);M.font=`${t.fontStyle} ${t.fontWeight} ${t.fontSize} ${t.fontFamily}`,M.letterSpacing=t.letterSpacing===`normal`?`0px`:t.letterSpacing,M.fillStyle=t.color,M.textBaseline=`alphabetic`;let r=M.measureText(`Hg`),i=r.fontBoundingBoxAscent||parseFloat(t.fontSize)*.9,a=r.fontBoundingBoxDescent||parseFloat(t.fontSize)*.25;M.fillText(e.textContent??``,n.x,n.y+n.h*i/(i+a))}),r.activeTexture(r.TEXTURE1),r.bindTexture(r.TEXTURE_2D,h),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,j),y=1,r.viewport(0,0,f,p),r.uniform2f(d.res,f,p),J())},I=9.5,L=0,R=0,z=!0,B=!1,V=+!!n,H={x:0,y:0},U={x:0,y:0},W=!1,G=e=>{R=0;let t=L?Math.min(.05,(e-L)/1e3):0;L=e,n||(I+=t,V=Math.min(1,V+t/1.1));let i=1-(1-V)**3,a=2*Math.PI/30*Math.max(.2,D.current),o=I*a,s=n?N.restX:N.hx+N.ax*Math.sin(o),c=n?N.restY:N.restY+(N.yLow-N.restY)*(.5+.5*Math.sin(2*o-.6)),l=T.current,u=1-Math.exp(-t*2.6),f=l.on&&!n?Math.max(-130,Math.min(130,(l.x-s)*.28)):0,p=l.on&&!n?Math.max(-70,Math.min(70,(l.y-c)*.22)):0;H.x+=(f-H.x)*u,H.y+=(p-H.y)*u;let m=l.on?l.x/N.w*2-1:0,h=l.on?l.y/N.h*2-1:0,g=m*16+(n?0:Math.sin(I*.23)*6),_=h*10+(n?0:Math.cos(I*.19)*3);U.x+=(g-U.x)*(n?1:u),U.y+=(_-U.y)*(n?1:u),s+=H.x-U.x,c=Math.min(N.yLow+6,c+H.y)-U.y;let b=0,x=0,S=0;if(E.current>0){let t=(e-E.current)/1e3;t<1.5&&(b=.04*(.5-.5*Math.cos(2*Math.PI*t/.75))),x=t<1.5?Math.min(1,t/.15):Math.max(0,1-(t-1.5)/.7),S=t/.75,t>2.4&&(E.current=-1)}let C=N.r*(.94+.06*i)*(1+b);c+=(1-i)*18,r.uniform3f(d.o,s*P,c*P,C*P),r.uniform2f(d.skyOff,(U.x*.4+(n?0:Math.sin(I*.075)*.022*N.w))*P,U.y*.4*P),r.uniform3fv(d.ground,O.current),r.uniform1f(d.t,I),r.uniform1f(d.textOn,y),r.uniform1f(d.orbOn,v*i),r.uniform1f(d.ringA,x),r.uniform1f(d.ringP,S),r.drawArrays(r.TRIANGLES,0,3),!W&&y&&v&&(W=!0,A(!0)),B&&!n&&(R=requestAnimationFrame(G))},K=()=>{B||!z||document.hidden||(B=!0,L=0,R=requestAnimationFrame(G))},q=()=>{B=!1,R&&cancelAnimationFrame(R),R=0};function J(){(n||!B)&&(R||=requestAnimationFrame(G))}let Y=new ResizeObserver(F);Y.observe(e),F(),document.fonts?.ready.then(()=>!k&&F());let X=()=>!k&&F();document.fonts?.addEventListener?.(`loadingdone`,X);let Z=new IntersectionObserver(([e])=>{z=e.isIntersecting,z&&!n?K():q()});Z.observe(e);let Q=()=>document.hidden?q():!n&&K();return document.addEventListener(`visibilitychange`,Q),n?J():K(),()=>{k=!0,q(),Y.disconnect(),Z.disconnect(),document.removeEventListener(`visibilitychange`,Q),document.fonts?.removeEventListener?.(`loadingdone`,X),r.deleteTexture(h),r.deleteTexture(g),r.deleteBuffer(o),r.deleteProgram(a)}},[_]);let B=e=>{let t=b.current;if(!t||e.pointerType===`touch`)return;let n=t.getBoundingClientRect(),r=t.offsetWidth/Math.max(1,n.width);T.current={x:(e.clientX-n.left)*r,y:(e.clientY-n.top)*r,on:!0}},V=()=>{T.current={...T.current,on:!1}},H=e=>e.split(` `).map((e,t,n)=>(0,a.jsxs)(`span`,{children:[(0,a.jsx)(`span`,{"data-w":``,children:e}),t<n.length-1?` `:``]},t));return(0,a.jsxs)(`section`,{ref:b,className:`orc${k?` orc-live`:``}`,style:{"--orc-accent":r,"--orc-ground":n},onPointerMove:B,onPointerLeave:V,"aria-label":`${e}, the AI receptionist`,children:[(0,a.jsx)(`style`,{children:g}),(0,a.jsx)(`canvas`,{ref:x,className:`orc-gl`,"aria-hidden":`true`}),(0,a.jsx)(`div`,{className:`orc-grain`,"aria-hidden":`true`}),(0,a.jsxs)(`header`,{className:`orc-nav`,children:[(0,a.jsxs)(`a`,{className:`orc-logo`,href:`#`,onClick:e=>e.preventDefault(),children:[(0,a.jsx)(`span`,{className:`orc-dot`,"aria-hidden":`true`}),e]}),(0,a.jsxs)(`nav`,{className:`orc-links`,"aria-label":`Main`,children:[(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Product`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Use cases`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Pricing`})]}),(0,a.jsx)(`button`,{type:`button`,className:`orc-try`,onClick:z,children:`Try a call`})]}),(0,a.jsxs)(`div`,{className:`orc-stage`,children:[(0,a.jsx)(`div`,{ref:S,className:`orc-slot`,"aria-hidden":`true`,children:(0,a.jsx)(`img`,{className:`orc-orbimg`,src:_,alt:``,draggable:!1})}),(0,a.jsxs)(`h1`,{ref:C,className:`orc-h`,children:[(0,a.jsx)(`span`,{className:`orc-l1`,children:H(o)}),(0,a.jsx)(`span`,{className:`orc-l2`,children:H(s)})]}),(0,a.jsx)(`p`,{ref:w,className:`orc-p`,children:`An AI receptionist that books, reschedules and takes messages in your business’s name.`}),(0,a.jsxs)(`div`,{className:`orc-cta`,children:[(0,a.jsxs)(`button`,{type:`button`,className:`orc-btn orc-main`,onClick:z,"aria-live":`polite`,"data-state":j,children:[(0,a.jsx)(`span`,{className:`orc-ico`,"aria-hidden":`true`,children:(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,width:`15`,height:`15`,children:(0,a.jsx)(`path`,{d:`M4.2 1.8l1.9 2.6c.3.4.2 1-.2 1.3l-1 .8c.7 1.6 1.9 2.9 3.6 3.7l.8-1c.3-.4.9-.5 1.3-.2l2.6 1.9c.4.3.5.9.2 1.3l-.8 1.1c-.5.7-1.4 1-2.2.8C6 13 3 10 2 5.8c-.2-.8.1-1.7.8-2.2l1.1-.8c.1-.1.2-.1.3 0z`,fill:`currentColor`})})}),j===`ring`?`Ringing…`:j===`live`?`Ora picked up`:t]}),(0,a.jsx)(`button`,{type:`button`,className:`orc-btn orc-alt`,children:`Get a number`}),(0,a.jsx)(`p`,{className:`orc-said`,"aria-live":`polite`,children:N?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`b`,{children:`Ora`}),` `,N]}):null})]})]}),(0,a.jsxs)(`footer`,{className:`orc-foot`,children:[(0,a.jsxs)(`span`,{className:`orc-stat`,children:[(0,a.jsx)(`i`,{"aria-hidden":`true`}),` `,(0,a.jsx)(`b`,{children:F.toLocaleString(`en-US`)}),` calls answered today`]}),(0,a.jsx)(`span`,{className:`orc-meta`,children:`Avg. pick-up 0.8 s · 31 languages · Keeps your number`})]})]})}var g=`
@import url("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@1&display=swap");

.orc {
  container-type: inline-size;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  font-family: "Inter Tight", ui-sans-serif, system-ui, sans-serif;
  background: linear-gradient(180deg, var(--orc-ground) 0%, var(--orc-ground) 62%, color-mix(in srgb, var(--orc-ground) 78%, #fff) 108%);
  -webkit-font-smoothing: antialiased;
}
.orc-gl {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0;
  transition: opacity .5s ease;
}
.orc-live .orc-gl { opacity: 1; }
.orc-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: .12;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
}

.orc-nav {
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
.orc-logo {
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
.orc-dot { width: 16px; height: 16px; border-radius: 50%; background: #fff; }
.orc-links { display: flex; gap: 28px; }
.orc-links a { color: inherit; opacity: .78; text-decoration: none; transition: opacity .2s; }
.orc-links a:hover { opacity: 1; }
.orc-try {
  font: inherit;
  font-size: 13.5px;
  border: 0;
  cursor: pointer;
  padding: 10px 18px;
  border-radius: 999px;
  background: #fff;
  color: #0846c4;
  transition: transform .18s ease, background .2s;
}
.orc-try:hover { background: #eaf3ff; }
.orc-try:active { transform: scale(.97); }

.orc-stage {
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
.orc-stage > * { pointer-events: auto; }
.orc-slot {
  --orb: clamp(170px, 22.9cqi, 340px);
  width: var(--orb);
  height: var(--orb);
  margin-bottom: 20px;
  flex: none;
  pointer-events: none;
}
.orc-orbimg {
  width: 100%;
  height: 100%;
  display: block;
  filter: hue-rotate(-28deg) saturate(1.9) brightness(.92) drop-shadow(0 40px 50px rgba(4, 30, 90, .3));
  transition: opacity .5s ease;
}
.orc-live .orc-orbimg { opacity: 0; }
.orc-h {
  margin: 0;
  font-weight: 500;
  transition: opacity .5s ease;
}
.orc-live .orc-h { opacity: 0; }
.orc-l1 {
  display: block;
  font-size: min(74px, 9.6cqi);
  letter-spacing: -.045em;
  line-height: 1;
}
.orc-l2 {
  display: block;
  font-family: "Instrument Serif", ui-serif, Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: min(96px, 11.8cqi);
  line-height: 1;
  letter-spacing: -.02em;
  color: var(--orc-accent);
}
.orc-p {
  margin: 22px auto 0;
  max-width: 470px;
  font-size: 16px;
  line-height: 1.5;
  color: rgba(255, 255, 255, .84);
}
.orc-cta {
  position: relative;
  margin-top: 26px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
.orc-btn {
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
.orc-btn:active { transform: scale(.97); }
.orc-main {
  background: #fff;
  color: #0846c4;
  min-width: 176px;
  justify-content: center;
  box-shadow: 0 10px 26px -12px rgba(4, 30, 90, .6);
}
.orc-main:hover { background: #f1f7ff; }
.orc-main[data-state="ring"] .orc-ico { animation: orc-ring .375s ease-in-out infinite alternate; }
.orc-ico { display: inline-flex; }
.orc-alt {
  background: rgba(255, 255, 255, .14);
  color: #fff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .42);
}
.orc-alt:hover { background: rgba(255, 255, 255, .22); }
.orc-btn:focus-visible, .orc-try:focus-visible, .orc-links a:focus-visible, .orc-logo:focus-visible {
  outline: 2px solid var(--orc-accent);
  outline-offset: 3px;
}
.orc-said {
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
.orc-said b { color: var(--orc-accent); font-weight: 600; margin-right: 4px; }
@keyframes orc-ring { from { transform: rotate(-10deg); } to { transform: rotate(10deg); } }

.orc-foot {
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
.orc-stat { display: inline-flex; align-items: center; gap: 6px; }
.orc-stat b { font-weight: 600; color: #fff; font-variant-numeric: tabular-nums; }
.orc-stat i { width: 7px; height: 7px; border-radius: 50%; background: #7dffc4; box-shadow: 0 0 0 3px rgba(125, 255, 196, .25); }

@container (max-width: 860px) {
  .orc-links { display: none; }
  .orc-meta { display: none; }
  .orc-foot { justify-content: center; }
}
@container (max-width: 640px) {
  .orc-nav { left: 20px; right: 20px; top: 22px; }
  .orc-stage { padding: 80px 20px 96px; }
  .orc-slot { --orb: clamp(150px, 50cqi, 220px); margin-bottom: 26px; }
  .orc-p { font-size: 15px; max-width: 310px; margin-top: 18px; }
  .orc-cta { margin-top: 22px; gap: 8px; }
  .orc-btn { padding: 13px 18px; font-size: 14.5px; }
  .orc-main { min-width: 0; }
  .orc-said { font-size: 13.5px; width: 86cqi; }
  .orc-foot { bottom: 22px; left: 20px; right: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .orc-gl, .orc-h, .orc-orbimg { transition: none; }
  .orc-main[data-state="ring"] .orc-ico { animation: none; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(h,{})}));