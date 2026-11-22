import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=2560,s=1707;function c(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(n=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let r=navigator.userActivation;if(!(r&&!r.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let r=t.current??=new e;r.state===`suspended`&&r.resume();let i=r.currentTime+(n.at??0),a=Math.min(n.d??.05,.06),o=r.createGain();o.gain.setValueAtTime(1e-4,i),o.gain.exponentialRampToValueAtTime(Math.min(n.g??.03,.06),i+.004),o.gain.exponentialRampToValueAtTime(1e-4,i+a),o.connect(r.destination);let s=r.createOscillator();s.type=n.type??`sine`,s.frequency.setValueAtTime(n.f,i),s.connect(o),s.start(i),s.stop(i+a+.02)}catch{}},[e])}var l=`
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`,u=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uBg;
uniform sampler2D uHn;
uniform vec2 uRes;
uniform float uDpr;
uniform vec4 uImg;
uniform vec2 uPB;
uniform vec2 uPH;
uniform vec3 uGlass;
uniform float uT;
uniform float uK;
uniform float uOn;

vec2 toUv(vec2 p, vec2 off){ return (p - off - uImg.xy) / uImg.zw; }

vec3 scene(vec2 p, float bias, float sh){
  vec3 b = texture2D(uBg, toUv(p, uPB), bias).rgb;
  b *= 1.0 - 0.2 * sh;
  vec4 h = texture2D(uHn, toUv(p, uPH), bias);
  return mix(b, h.rgb, h.a);
}

void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  float k = uK;
  // Hana's shadow on the wall: her alpha, offset toward the window light, very blurred.
  float sh = texture2D(uHn, toUv(p + vec2(30.0, -10.0) * k, uPH), 5.0).a;
  sh *= smoothstep(0.0, 0.5, 1.0 - texture2D(uHn, toUv(p, uPH)).a);
  float L = uGlass.x - uGlass.y * 0.5;
  float R = uGlass.x + uGlass.y * 0.5;
  vec3 col;
  if (uOn > 0.5 && p.x >= L && p.x <= R) {
    float fw = uGlass.z;
    float lx = p.x - L;
    float u = fract(lx / fw);
    float s = u * 2.0 - 1.0;
    float n = s / sqrt(max(1.0 - 0.8 * s * s, 0.06));
    vec2 q = p + vec2(-n * fw * 0.9, 0.0);
    float ca = n * 2.4 * k;
    float bias = 1.8;
    col.r = scene(q + vec2(ca, 0.0), bias, sh).r;
    col.g = scene(q, bias, sh).g;
    col.b = scene(q - vec2(ca, 0.0), bias, sh).b;
    // frosted body of the glass: a touch lighter and cooler
    col = mix(col, vec3(0.94, 0.985, 0.96), 0.075);
    // grooves between flutes and the rounded shoulder of each flute
    float groove = smoothstep(0.74, 1.0, abs(s));
    col *= 1.0 - 0.2 * groove;
    col *= 0.97 + 0.05 * (1.0 - s * s);
    // window light from the right: a crisp line on each flute, a weaker one opposite
    float sp = exp(-pow((s - 0.46) / 0.09, 2.0));
    float yy = p.y / uRes.y;
    float vy = (0.45 + 0.55 * smoothstep(1.0, 0.0, yy)) * (0.85 + 0.15 * sin(yy * 9.0 + 0.7));
    col += vec3(0.2, 0.21, 0.2) * sp * vy;
    col += 0.05 * exp(-pow((s + 0.6) / 0.15, 2.0));
    // a reflection of the room's window, fixed in space: the panel slides through it
    float d = (p.x + p.y * 0.42) - uRes.x * 0.83;
    col += 0.09 * exp(-d * d / (2.0 * pow(110.0 * k, 2.0)));
    // polished edges of the panel
    float el = (p.x - L) / k;
    float er = (R - p.x) / k;
    col *= 1.0 - 0.18 * exp(-el / 2.5);
    col += 0.42 * exp(-er / 1.2) + 0.1 * exp(-er / 7.0);
    col += 0.18 * exp(-max(el - 1.5, 0.0) / 1.0) * step(1.5, el);
  } else {
    col = scene(p, 0.0, sh);
    if (uOn > 0.5) {
      // the panel's shadow on the wall, to its left (the light comes from the right)
      float sd = (L - p.x) / k;
      float ps = sd > 0.0 ? exp(-sd / 42.0) * smoothstep(0.0, 4.0, sd) : 0.0;
      col *= 1.0 - 0.16 * ps;
      // light through the flutes lands beside the shadow as faint bright lines
      float c = pow(0.5 + 0.5 * cos(6.2832 * (L - p.x) / uGlass.z), 10.0);
      col += 0.035 * c * exp(-sd / 60.0) * step(0.0, sd);
    }
  }
  // soft vignette toward the corners
  vec2 v = p / uRes - 0.5;
  col *= 1.0 - 0.12 * dot(v, v);
  gl_FragColor = vec4(col, 1.0);
}
`,d=e=>new Promise((t,n)=>{let r=new Image;r.decoding=`async`,r.onload=()=>t(r),r.onerror=n,r.src=e});function f(e,t){if(e/t<.8){let n=Math.max(t*.58,e*1.12*s/o),r=n*o/s;return{ox:e*.56-r*.8,oy:t-n,dw:r,dh:n}}let n=Math.max(e/o,t/s)*1.02,r=o*n,i=s*n;return{ox:(e-r)*.62,oy:(t-i)*.1,dw:r,dh:i}}function p({name:e=`Hana Okoye`,cta:t=`Book a talk`,flutes:n=14,drift:r=1,backdrop:o=`/design/websites/hana/backdrop.webp`,portrait:s=`/design/websites/hana/hana.webp`,sound:p=!0,onBook:h}){let g=(0,i.useRef)(null),_=(0,i.useRef)(null),v=(0,i.useRef)(null),[y,b]=(0,i.useState)(!1),[x,S]=(0,i.useState)(!1),C=(0,i.useRef)(0),w=(0,i.useRef)(n);w.current=Math.max(6,Math.min(30,n));let T=(0,i.useRef)(r);T.current=r;let E=(0,i.useRef)(null),D=c(p);(0,i.useEffect)(()=>{let e=g.current,t=_.current;if(!e||!t)return;let n=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,r=!1,i=0,a=!0,c=1,p=1,m=1,h=f(1440,810),y={x:0,y:0,on:!1,w:0,nx:0,ny:0},x=-1,S=0,C=()=>{let n=e.getBoundingClientRect();c=Math.max(1,Math.round(n.width)),p=Math.max(1,Math.round(n.height)),m=Math.min(2,window.devicePixelRatio||1),t.width=Math.round(c*m),t.height=Math.round(p*m),h=f(c,p),e.style.setProperty(`--hn-ox`,`${h.ox.toFixed(1)}px`),e.style.setProperty(`--hn-oy`,`${h.oy.toFixed(1)}px`),e.style.setProperty(`--hn-dw`,`${h.dw.toFixed(1)}px`),e.style.setProperty(`--hn-dh`,`${h.dh.toFixed(1)}px`)};C();let D=()=>c/p<.8,O=()=>D()?[.2,.8]:[.52,.9],k=()=>D()?Math.max(96,c*.3):Math.max(180,Math.min(340,c*.205)),A=t.getContext(`webgl2`,{antialias:!1,alpha:!1,premultipliedAlpha:!1})??t.getContext(`webgl`,{antialias:!1,alpha:!1}),j=typeof WebGL2RenderingContext<`u`&&A instanceof WebGL2RenderingContext,M=null,N={},P=[],F=!1;if(A){let e=(e,t)=>{let n=A.createShader(e);return A.shaderSource(n,t),A.compileShader(n),n};if(M=A.createProgram(),A.attachShader(M,e(A.VERTEX_SHADER,l)),A.attachShader(M,e(A.FRAGMENT_SHADER,u)),A.linkProgram(M),A.getProgramParameter(M,A.LINK_STATUS)||(M=null),M){A.useProgram(M);let e=A.createBuffer();A.bindBuffer(A.ARRAY_BUFFER,e),A.bufferData(A.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),A.STATIC_DRAW);let t=A.getAttribLocation(M,`aPos`);A.enableVertexAttribArray(t),A.vertexAttribPointer(t,2,A.FLOAT,!1,0,0);for(let e of[`uBg`,`uHn`,`uRes`,`uDpr`,`uImg`,`uPB`,`uPH`,`uGlass`,`uT`,`uK`,`uOn`])N[e]=A.getUniformLocation(M,e);let i=(e,t)=>{let n=A.createTexture();A.activeTexture(A.TEXTURE0+e),A.bindTexture(A.TEXTURE_2D,n),A.pixelStorei(A.UNPACK_COLORSPACE_CONVERSION_WEBGL,A.NONE),A.texImage2D(A.TEXTURE_2D,0,A.RGBA,A.RGBA,A.UNSIGNED_BYTE,t),j&&A.generateMipmap(A.TEXTURE_2D),A.texParameteri(A.TEXTURE_2D,A.TEXTURE_MIN_FILTER,j?A.LINEAR_MIPMAP_LINEAR:A.LINEAR),A.texParameteri(A.TEXTURE_2D,A.TEXTURE_MAG_FILTER,A.LINEAR),A.texParameteri(A.TEXTURE_2D,A.TEXTURE_WRAP_S,A.CLAMP_TO_EDGE),A.texParameteri(A.TEXTURE_2D,A.TEXTURE_WRAP_T,A.CLAMP_TO_EDGE),P.push(n)};Promise.all([d(o),d(s)]).then(([e,t])=>{r||!M||(A.useProgram(M),i(0,e),i(1,t),A.uniform1i(N.uBg,0),A.uniform1i(N.uHn,1),F=!0,n&&R(0))}).catch(()=>{})}}let I=e=>{let[t,n]=O(),r=e*T.current/11+.318;return c*(t+(n-t)*(.5-.5*Math.cos(r*Math.PI*2)))},L=!1,R=r=>{S+=r;let[i,a]=O();y.w+=(+!!y.on-y.w)*(1-Math.exp(-r*3.2));let o=I(S);E.current===null?o+=(Math.max(c*(i-.06),Math.min(c*(a+.04),y.x))-o)*y.w:o=c*(i+(a-i)*E.current),n&&E.current===null&&(o=c*(i+(a-i)*.62)),x=x<0||n?o:x+(o-x)*(1-Math.exp(-r*4.2));let s=y.on?y.x/c*2-1:0,l=y.on?y.y/p*2-1:0;y.nx+=(s-y.nx)*(1-Math.exp(-r*2.4)),y.ny+=(l-y.ny)*(1-Math.exp(-r*2.4));let u=Math.min(c/1440,p/810)*(D()?1.6:1),d=n?0:Math.sin(S*.42)*.6,f=n?0:Math.sin(S*.31+1.1)*.5,m=(-y.nx*7-d*4)*u,g=(-y.ny*4-f*3)*u,_=(-y.nx*18-d*11)*u,C=(-y.ny*7-f*5)*u;e.style.setProperty(`--hn-tx`,`${((y.nx*9+d*5)*u).toFixed(2)}px`),e.style.setProperty(`--hn-ty`,`${((y.ny*5+f*3)*u).toFixed(2)}px`);let T=k(),j=T/w.current;v.current&&(v.current.style.transform=`translate3d(${(x-T/2).toFixed(1)}px,0,0)`,v.current.style.width=`${T.toFixed(1)}px`,v.current.setAttribute(`aria-valuenow`,String(Math.round((x/c-i)/(a-i)*100)))),!(!A||!M||!F)&&(A.viewport(0,0,t.width,t.height),A.uniform2f(N.uRes,c,p),A.uniform1f(N.uDpr,t.width/c),A.uniform4f(N.uImg,h.ox,h.oy,h.dw,h.dh),A.uniform2f(N.uPB,m,g),A.uniform2f(N.uPH,_,C),A.uniform3f(N.uGlass,x,T,j),A.uniform1f(N.uT,S),A.uniform1f(N.uK,Math.max(.4,u)),A.uniform1f(N.uOn,1),A.drawArrays(A.TRIANGLE_STRIP,0,4),L||(L=!0,b(!0)))},z=performance.now(),B=e=>{i=requestAnimationFrame(B);let t=Math.min(.05,(e-z)/1e3);z=e,!(!a||document.hidden)&&R(t)};n?R(0):i=requestAnimationFrame(B);let V=new ResizeObserver(()=>{C(),n&&R(0)});V.observe(e);let H=new IntersectionObserver(([e])=>{a=e.isIntersecting});H.observe(e);let U=t=>{let r=e.getBoundingClientRect();y.x=t.clientX-r.left,y.y=t.clientY-r.top,(t.pointerType===`mouse`||t.buttons)&&(y.on=!0),E.current=null,n&&R(.016)},W=()=>{y.on=!1},G=e=>{e.pointerType!==`mouse`&&(y.on=!1)};return e.addEventListener(`pointermove`,U),e.addEventListener(`pointerdown`,U),e.addEventListener(`pointerleave`,W),e.addEventListener(`pointerup`,G),e.addEventListener(`pointercancel`,W),()=>{if(r=!0,cancelAnimationFrame(i),V.disconnect(),H.disconnect(),e.removeEventListener(`pointermove`,U),e.removeEventListener(`pointerdown`,U),e.removeEventListener(`pointerleave`,W),e.removeEventListener(`pointerup`,G),e.removeEventListener(`pointercancel`,W),A){for(let e of P)A.deleteTexture(e);M&&A.deleteProgram(M)}}},[o,s]),(0,i.useEffect)(()=>()=>window.clearTimeout(C.current),[]);let O=()=>{h?.(),!x&&(S(!0),D({f:1318.5,d:.06,g:.028}),D({f:1975.5,d:.06,g:.022,at:.09}),window.clearTimeout(C.current),C.current=window.setTimeout(()=>S(!1),2400))};return(0,a.jsxs)(`div`,{ref:g,className:`hn-root${y?` hn-live`:``}`,children:[(0,a.jsx)(`style`,{children:m}),(0,a.jsxs)(`div`,{className:`hn-still`,"aria-hidden":`true`,children:[(0,a.jsx)(`img`,{className:`hn-still-img`,src:o,alt:``}),(0,a.jsx)(`img`,{className:`hn-still-img`,src:s,alt:``})]}),(0,a.jsx)(`canvas`,{ref:_,className:`hn-gl`,"aria-hidden":`true`}),(0,a.jsx)(`div`,{className:`hn-grain`,"aria-hidden":`true`}),(0,a.jsx)(`div`,{ref:v,className:`hn-knob`,role:`slider`,tabIndex:0,"aria-label":`Reeded glass position`,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":50,onKeyDown:e=>{let t=E.current??.5,n=t;if(e.key===`ArrowRight`||e.key===`ArrowUp`)n=t+.08;else if(e.key===`ArrowLeft`||e.key===`ArrowDown`)n=t-.08;else if(e.key===`Home`)n=0;else if(e.key===`End`)n=1;else if(e.key===`Escape`){E.current=null;return}else return;e.preventDefault(),E.current=Math.max(0,Math.min(1,n)),D({f:2200+E.current*600,d:.03,g:.016,type:`triangle`})},onBlur:()=>E.current=null}),(0,a.jsxs)(`nav`,{className:`hn-nav`,"aria-label":`Main`,children:[(0,a.jsx)(`span`,{className:`hn-logo`,children:e}),(0,a.jsxs)(`span`,{className:`hn-links`,children:[(0,a.jsx)(`a`,{href:`#talks`,children:`Talks`}),(0,a.jsx)(`a`,{href:`#advisory`,children:`Advisory`}),(0,a.jsx)(`a`,{href:`#writing`,children:`Writing`})]}),(0,a.jsx)(`button`,{type:`button`,className:`hn-navbtn`,onClick:O,children:`Book Hana`})]}),(0,a.jsxs)(`div`,{className:`hn-copy`,children:[(0,a.jsx)(`p`,{className:`hn-eyebrow`,children:`Product leader · Speaker`}),(0,a.jsxs)(`h1`,{className:`hn-h1`,children:[`I build teams`,(0,a.jsx)(`br`,{}),`that `,(0,a.jsx)(`em`,{children:`actually`}),` ship.`]}),(0,a.jsx)(`p`,{className:`hn-lede`,children:`Ex-Spotify, ex-Monzo. Now advising seven startups on the hard part: getting things out the door.`}),(0,a.jsxs)(`div`,{className:`hn-actions`,children:[(0,a.jsxs)(`button`,{type:`button`,className:`hn-cta${x?` hn-done`:``}`,onClick:O,"aria-live":`polite`,children:[(0,a.jsx)(`span`,{className:`hn-cta-a`,children:t}),(0,a.jsxs)(`span`,{className:`hn-cta-b`,"aria-hidden":!x,children:[(0,a.jsx)(`svg`,{viewBox:`0 0 16 16`,width:`15`,height:`15`,"aria-hidden":`true`,children:(0,a.jsx)(`path`,{d:`M3.2 8.4l3 3 6.6-7`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.8`,strokeLinecap:`round`,strokeLinejoin:`round`})}),`Request sent`]})]}),(0,a.jsx)(`a`,{className:`hn-ghost`,href:`#newsletter`,children:`Read the newsletter`})]}),(0,a.jsx)(`p`,{className:`hn-reply${x?` hn-reply-on`:``}`,"aria-hidden":!x,children:`Hana replies within two days · next open date 12 March`})]}),(0,a.jsxs)(`p`,{className:`hn-next`,children:[(0,a.jsx)(`span`,{className:`hn-dot`,"aria-hidden":`true`}),`Next talk · Mind the Product, London · 14.03`]})]})}var m=`
@import url("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@500&display=swap");
.hn-root{container-type:inline-size;width:100%;height:var(--design-h,100svh);min-height:640px;position:relative;overflow:hidden;isolation:isolate;
  background:#96b794;color:#0e2b22;font-family:"Inter Tight",ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  --hn-ox:-120px;--hn-oy:-60px;--hn-dw:calc(100% + 240px);--hn-dh:auto;--hn-tx:0px;--hn-ty:0px}
.hn-still{position:absolute;inset:0;z-index:0}
.hn-still-img{position:absolute;left:var(--hn-ox);top:var(--hn-oy);width:var(--hn-dw);height:var(--hn-dh);display:block;user-select:none;pointer-events:none}
.hn-gl{position:absolute;inset:0;width:100%;height:100%;z-index:1;display:block;opacity:0;transition:opacity .5s ease}
.hn-live .hn-gl{opacity:1}
.hn-grain{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:.09;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")}
.hn-knob{position:absolute;left:0;top:0;bottom:0;width:280px;z-index:3;border-radius:2px;outline:none;transform:translate3d(-999px,0,0)}
.hn-knob:focus-visible{box-shadow:inset 0 0 0 2px #0e2b22,inset 0 0 0 4px rgba(255,255,255,.7)}
.hn-nav{position:absolute;left:44px;right:44px;top:30px;z-index:5;display:flex;align-items:center;gap:30px;font-size:14px;font-weight:500;
  transform:translate3d(calc(var(--hn-tx) * .35),0,0)}
.hn-logo{font-weight:600;font-size:18px;letter-spacing:-.01em;margin-right:26px}
.hn-links{display:flex;gap:28px;margin-right:auto}
.hn-links a{color:inherit;text-decoration:none;opacity:.8;transition:opacity .2s}
.hn-links a:hover{opacity:1}
.hn-navbtn,.hn-cta,.hn-ghost{font:inherit;cursor:pointer;border:0;text-decoration:none}
.hn-navbtn{padding:10px 18px;border-radius:999px;font-size:13.5px;font-weight:500;background:#0e2b22;color:#fff;transition:transform .18s cubic-bezier(.3,1.4,.5,1),background .2s}
.hn-navbtn:hover{background:#163d31}
.hn-navbtn:active,.hn-cta:active,.hn-ghost:active{transform:scale(.97)}
.hn-copy{position:absolute;left:56px;top:50%;z-index:4;max-width:600px;
  transform:translate3d(var(--hn-tx),calc(-46% + var(--hn-ty)),0);animation:hn-in 1.1s cubic-bezier(.2,.7,.2,1) both}
.hn-eyebrow{margin:0;font-family:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,monospace;font-size:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase}
.hn-h1{margin:18px 0 0;font-weight:500;font-size:clamp(44px,5.84cqi,96px);line-height:.98;letter-spacing:-.05em}
.hn-h1 em{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-weight:400;letter-spacing:-.02em}
.hn-lede{margin:20px 0 0;font-size:16px;line-height:1.5;max-width:400px;opacity:.82;text-wrap:pretty}
.hn-actions{margin-top:28px;display:flex;gap:12px;flex-wrap:wrap}
.hn-cta{position:relative;display:inline-grid;place-items:center;padding:14px 24px;border-radius:999px;font-size:15px;font-weight:500;background:#0e2b22;color:#fff;
  min-width:150px;overflow:hidden;transition:transform .18s cubic-bezier(.3,1.4,.5,1),background .25s}
.hn-cta:hover{background:#163d31}
.hn-cta-a,.hn-cta-b{grid-area:1/1;display:inline-flex;align-items:center;gap:8px;transition:transform .38s cubic-bezier(.3,1.3,.5,1),opacity .22s}
.hn-cta-b{transform:translateY(120%);opacity:0}
.hn-done .hn-cta-a{transform:translateY(-120%);opacity:0}
.hn-done .hn-cta-b{transform:none;opacity:1}
.hn-ghost{display:inline-flex;align-items:center;padding:14px 24px;border-radius:999px;font-size:15px;font-weight:500;color:#0e2b22;
  background:rgba(255,255,255,.5);box-shadow:inset 0 0 0 1px rgba(255,255,255,.55);transition:background .2s,transform .18s}
.hn-ghost:hover{background:rgba(255,255,255,.7)}
.hn-navbtn:focus-visible,.hn-cta:focus-visible,.hn-ghost:focus-visible,.hn-links a:focus-visible{outline:2px solid #0e2b22;outline-offset:3px}
.hn-reply{margin:14px 0 0;font-size:13px;opacity:0;transform:translateY(-4px);transition:opacity .3s,transform .3s}
.hn-reply-on{opacity:.75;transform:none}
.hn-next{position:absolute;left:56px;bottom:34px;z-index:4;margin:0;display:flex;align-items:center;gap:10px;
  font-family:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.75;
  transform:translate3d(var(--hn-tx),var(--hn-ty),0)}
.hn-dot{width:6px;height:6px;border-radius:50%;background:#0e2b22;animation:hn-pulse 2.4s ease-in-out infinite}
@keyframes hn-in{from{opacity:0;translate:0 14px}to{opacity:1;translate:0 0}}
@keyframes hn-pulse{0%,100%{opacity:1}50%{opacity:.3}}
@container (max-width: 1100px){
  .hn-links{display:none}
  .hn-logo{margin-right:auto}
  .hn-copy{max-width:470px}
}
@container (max-width: 640px){
  .hn-nav{left:20px;right:20px;top:20px}
  .hn-logo{font-size:16px}
  .hn-copy{left:22px;right:22px;top:84px;max-width:none;transform:translate3d(var(--hn-tx),var(--hn-ty),0)}
  .hn-eyebrow{font-size:11px}
  .hn-h1{font-size:42px;margin-top:12px}
  .hn-lede{font-size:15px;margin-top:14px;max-width:330px}
  .hn-actions{margin-top:18px;gap:8px}
  .hn-cta,.hn-ghost{padding:12px 18px;font-size:14px}
  .hn-cta{min-width:132px}
  .hn-reply{font-size:12px}
  .hn-next{display:none}
}
@media (prefers-reduced-motion: reduce){
  .hn-copy{animation:none}
  .hn-dot{animation:none}
  .hn-gl,.hn-cta-a,.hn-cta-b,.hn-reply{transition:none}
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(p,{})}));