import{n as e,r as t,t as n}from"./jsx-runtime-x9fV7ir5.js";var r=e(),i=t(),a=n(),o=[{what:`Coffee`,city:`Lisbon`,amount:`€3.20`},{what:`Metro`,city:`Paris`,amount:`€2.15`},{what:`Ramen`,city:`Tokyo`,amount:`¥1,180`},{what:`Taxi`,city:`New York`,amount:`$18.40`},{what:`Gelato`,city:`Rome`,amount:`€4.50`},{what:`Books`,city:`Berlin`,amount:`€12.90`},{what:`Tapas`,city:`Madrid`,amount:`€16.80`},{what:`Ferry`,city:`Istanbul`,amount:`₺85.00`}],s=2.8,c=.14,ee=.52,l=.8;function u(e){let t=(0,i.useRef)(null);return(0,i.useEffect)(()=>()=>void t.current?.close().catch(()=>{}),[]),(0,i.useCallback)(()=>{if(!e||typeof window>`u`||document.documentElement.dataset.cdMute===`1`)return;let n=navigator.userActivation;if(!(n&&!n.hasBeenActive))try{let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let n=t.current??=new e;n.state===`suspended`&&n.resume(),[1318.5,1760].forEach((e,t)=>{let r=n.currentTime+t*.075,i=n.createOscillator(),a=n.createGain();i.type=`sine`,i.frequency.setValueAtTime(e,r),a.gain.setValueAtTime(1e-4,r),a.gain.exponentialRampToValueAtTime(.045,r+.005),a.gain.exponentialRampToValueAtTime(1e-4,r+.06),i.connect(a).connect(n.destination),i.start(r),i.stop(r+.07)})}catch{}},[e])}var d=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],f=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],p=e=>{let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]},m=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2];function te(e,t,n,r){let i=new Float32Array(16);return i[0]=1/(e*t),i[5]=1/e,i[10]=(r+n)/(n-r),i[11]=-1,i[14]=2*r*n/(n-r),i}function ne(e,t){let n=p(d(e,t)),r=p(f([0,1,0],n)),i=f(n,r),a=new Float32Array(16);return a[0]=r[0],a[4]=r[1],a[8]=r[2],a[12]=-m(r,e),a[1]=i[0],a[5]=i[1],a[9]=i[2],a[13]=-m(i,e),a[2]=n[0],a[6]=n[1],a[10]=n[2],a[14]=-m(n,e),a[15]=1,a}function re(e,t){let n=new Float32Array(16);for(let r=0;r<4;r++)for(let i=0;i<4;i++){let a=0;for(let n=0;n<4;n++)a+=e[n*4+i]*t[r*4+n];n[r*4+i]=a}return n}function h(e,t,n){let r=Math.cos(n),i=Math.sin(n),a=f(t,e),o=m(t,e)*(1-r);return[e[0]*r+a[0]*i+t[0]*o,e[1]*r+a[1]*i+t[1]*o,e[2]*r+a[2]*i+t[2]*o]}var ie=e=>{let t=/^#?([0-9a-f]{6})$/i.exec(e.trim()),n=t?parseInt(t[1],16):13111342;return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]},ae=e=>e<=0?0:e>=1?1:e*e*(3-2*e),g=60,oe=54,_=-34,v=5.5,y=v/1.586,b=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNor;
layout(location=2) in vec3 aInst;
uniform mat4 uVP;
uniform float uT, uIntro, uAmp;
uniform vec2 uPool;
uniform vec4 uRip[4];
uniform vec3 uTone;
uniform float uFloor;
out vec3 vW; out vec3 vN; out vec3 vCol; out vec2 vFace; out float vSide;
float field(vec2 p){
  float a = sin(p.x*0.27 + p.y*0.19 - uT*0.80);
  float b = sin(-p.x*0.15 + p.y*0.30 - uT*0.55 + 1.7);
  float c = sin(length(p - vec2(-9.0,-14.0))*0.33 - uT*0.65);
  return a*0.42 + b*0.36 + c*0.22;
}
void main(){
  if(uFloor > 0.5){ vW = aPos; vN = aNor; vCol = vec3(1.0); vFace = vec2(0.0); vSide = 0.0; gl_Position = uVP*vec4(aPos,1.0); return; }
  vec2 p = vec2((aInst.x - ${(59/2).toFixed(1)}), ${_}.0 + aInst.y);
  float w = field(p);
  vec2 dp = (p - uPool) * vec2(1.0/8.5, 1.0/5.8);
  float pool = exp(-dot(dp,dp));
  float h = 0.14 + pool*(0.95 + 0.40*w) + (1.0-pool)*max(0.0, w)*0.62;
  for(int i=0;i<4;i++){
    vec4 r = uRip[i];
    float age = uT - r.z;
    if(age > 0.0 && age < 7.0){
      float d = length(p - r.xy);
      float tau = age - d/7.5;
      if(tau > 0.0) h += r.w * exp(-tau*2.4) * sin(tau*9.0) * exp(-d*0.045);
    }
  }
  h = max(0.06, h * uAmp) * uIntro + 0.06*(1.0-uIntro);
  float rnd = aInst.z;
  float k = smoothstep(0.22, 1.25, h + (rnd-0.5)*0.12);
  vec3 white = vec3(0.965, 0.955, 0.950);
  vec3 blush = mix(white, uTone, 0.30);
  vec3 deep = uTone * 0.80;
  vec3 col = k < 0.45 ? mix(white, blush, k/0.45) : (k < 0.85 ? mix(blush, uTone, (k-0.45)/0.40) : mix(uTone, deep, (k-0.85)/0.15));
  col *= 0.97 + rnd*0.06;
  vec3 wp = vec3(p.x + aPos.x*0.86, aPos.y*h, p.y + aPos.z*0.86);
  vW = wp; vN = aNor; vCol = col; vFace = aPos.xz; vSide = aNor.y > 0.5 ? 0.0 : aPos.y;
  gl_Position = uVP * vec4(wp, 1.0);
}`,se=`#version 300 es
precision highp float;
in vec3 vW; in vec3 vN; in vec3 vCol; in vec2 vFace; in float vSide;
uniform vec3 uEye, uL, uGround;
uniform vec3 uCC, uCX, uCY, uCN;
uniform vec2 uCS;
uniform float uFloor, uHaze;
uniform vec2 uPoolF;
uniform vec3 uToneF;
out vec4 o;
float rectMask(vec3 q, float soft){
  float lx = dot(q, uCX)/uCS.x; float ly = dot(q, uCY)/uCS.y;
  return (1.0 - smoothstep(0.5-soft, 0.5+soft, abs(lx))) * (1.0 - smoothstep(0.5-soft*1.6, 0.5+soft*1.6, abs(ly)));
}
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(uEye - vW);
  vec3 col = vCol;
  float diff = 0.62 + 0.38*dot(N, uL);
  if(uFloor > 0.5){
    vec2 dq = (vW.xz - uPoolF) * vec2(1.0/8.5, 1.0/5.8);
    col = mix(uGround*vec3(0.80,0.78,0.78), uToneF*0.32, exp(-dot(dq,dq))*0.85); diff = 1.0;
  }
  else if(N.y < 0.5){ diff = (0.70 + 0.22*dot(N, uL)) * (0.72 + 0.28*clamp(vSide*1.6, 0.0, 1.0)); }
  col *= diff;
  if(uFloor < 0.5 && N.y > 0.5){
    float e = max(abs(vFace.x), abs(vFace.y));
    col = mix(col, vec3(1.0), smoothstep(0.38, 0.5, e)*0.42);
    vec3 H = normalize(uL + V);
    col += pow(max(dot(N,H),0.0), 70.0)*0.22;
    // the card mirrored in the glaze
    vec3 R = reflect(-V, N);
    float dn = dot(R, uCN);
    if(abs(dn) > 1e-3){
      float t = dot(uCC - vW, uCN)/dn;
      if(t > 0.0){
        float m = rectMask(vW + R*t - uCC, 0.03 + t*0.012);
        float fr = 0.10 + 0.30*pow(1.0 - max(dot(N,V),0.0), 3.0);
        col = mix(col, col*vec3(0.42,0.44,0.70), m*fr);
      }
    }
  }
  // the card's shadow, softer the further it falls
  float dl = dot(uL, uCN);
  if(abs(dl) > 1e-3){
    float t = dot(uCC - vW, uCN)/dl;
    if(t > 0.0){
      float m = rectMask(vW + uL*t - uCC, 0.05 + t*0.05);
      col *= 1.0 - m*0.42;
    }
  }
  // a broad contact shadow straight below
  vec3 qd = vW - uCC; qd.y = 0.0;
  vec2 b = vec2(dot(qd, normalize(vec3(uCX.x,0.0,uCX.z)))/(uCS.x*0.75), dot(qd, normalize(vec3(uCY.x,0.0,uCY.z)+vec3(0.0,0.0,1e-4)))/(uCS.y*0.9));
  col *= 1.0 - 0.12*exp(-dot(b,b)*2.0);
  float fog = smoothstep(5.0, -31.0, vW.z);
  col = mix(col, uGround, pow(fog, 0.85));
  // the headline sits on calm ground: the upper part of the frame is hazed
  float sy = gl_FragCoord.y / uHaze;
  col = mix(col, uGround, smoothstep(0.50, 0.80, sy)*0.80);
  o = vec4(col, 1.0);
}`,x=`#version 300 es
precision highp float;
layout(location=0) in vec2 aQ;
uniform mat4 uVP;
uniform vec3 uCC, uCX, uCY, uCN;
uniform vec2 uCS;
uniform float uOff, uGrow;
out vec2 vUv; out vec3 vW; out vec2 vL;
void main(){
  vec2 l = aQ * uGrow;
  vec3 w = uCC + uCX*(l.x*uCS.x) + uCY*(l.y*uCS.y) + uCN*uOff;
  vUv = vec2(l.x + 0.5, 0.5 - l.y);
  vL = l; vW = w;
  gl_Position = uVP * vec4(w, 1.0);
}`,S=`#version 300 es
precision highp float;
in vec2 vUv; in vec3 vW; in vec2 vL;
uniform sampler2D uTex;
uniform vec3 uEye, uL, uCN;
uniform vec2 uCS;
uniform float uBack, uSheen, uAlpha;
out vec4 o;
void main(){
  vec2 q = vL * uCS;
  vec2 hs = uCS*0.5;
  float r = uCS.x*0.055;
  vec2 d2 = abs(q) - (hs - r);
  float d = length(max(d2, 0.0)) + min(max(d2.x, d2.y), 0.0) - r;
  float fw = fwidth(d);
  float a = 1.0 - smoothstep(-fw, fw, d);
  if(a <= 0.0) discard;
  vec3 V = normalize(uEye - vW);
  vec3 N = normalize(uCN);
  if(uBack > 0.5){
    // the back: navy enamel, a magnetic stripe, the same sheen
    vec3 Nb = dot(N, V) < 0.0 ? -N : N;
    vec3 bc = mix(vec3(0.11,0.13,0.27), vec3(0.17,0.19,0.40), vUv.x*0.6 + vUv.y*0.4);
    bc *= 0.75 + 0.35*max(dot(Nb, uL), 0.0);
    float stripe = smoothstep(0.155, 0.16, vUv.y) * (1.0 - smoothstep(0.33, 0.335, vUv.y));
    bc = mix(bc, vec3(0.03,0.03,0.05), stripe*0.92);
    float sb = dot(vL, normalize(vec2(0.85, 0.55)));
    bc += vec3(0.8,0.85,1.0) * exp(-pow((sb - uSheen)*6.0, 2.0))*0.18;
    bc += pow(max(dot(reflect(-V, Nb), uL), 0.0), 30.0)*0.25;
    o = vec4(bc, a*uAlpha);
    return;
  }
  vec3 col = texture(uTex, vUv).rgb;
  col *= 0.86 + 0.24*max(dot(N, uL), 0.0);
  float s = dot(vL, normalize(vec2(0.85, 0.55)));
  col += vec3(0.85,0.88,1.0) * (exp(-pow((s - uSheen)*7.0, 2.0))*0.22 + exp(-pow((s - uSheen)*2.2, 2.0))*0.07);
  vec3 R = reflect(-V, N);
  col += pow(max(dot(R, uL), 0.0), 36.0)*0.30;
  float rim = 1.0 - smoothstep(-0.05, -0.012, d);
  col += (1.0 - rim) * 0.10;
  o = vec4(col, a*uAlpha);
}`;function C(e,t,n){let r=1024;e.width=r,e.height=646;let i=e.getContext(`2d`);if(!i)return;let a=i.createLinearGradient(0,0,r,646);a.addColorStop(0,`#1c2142`),a.addColorStop(.5,`#2b3270`),a.addColorStop(1,`#141731`),i.fillStyle=a,i.fillRect(0,0,r,646),i.globalAlpha=.05,i.strokeStyle=`#ffffff`;for(let e=-646;e<r;e+=7)i.beginPath(),i.moveTo(e,646),i.lineTo(e+400.52,0),i.stroke();i.globalAlpha=.09,i.lineWidth=46,i.beginPath(),i.arc(r*.86,658.92,503.88,Math.PI*1.02,Math.PI*1.62),i.stroke(),i.globalAlpha=1,i.fillStyle=`#ffffff`,i.font=`400 92px "DM Serif Display", Georgia, serif`,i.textBaseline=`alphabetic`,i.fillText(t,64,132);let o=i.createLinearGradient(66,236,184,326);o.addColorStop(0,`#f1dda4`),o.addColorStop(.5,`#c9a85e`),o.addColorStop(1,`#e6cd8a`),i.fillStyle=o,i.beginPath(),i.roundRect(66,236,118,90,16),i.fill(),i.strokeStyle=`rgba(90,66,20,.45)`,i.lineWidth=2.5,i.beginPath(),i.moveTo(66,281),i.lineTo(107.3,281),i.moveTo(142.7,281),i.lineTo(184,281),i.moveTo(107.3,236),i.lineTo(107.3,326),i.moveTo(142.7,236),i.lineTo(142.7,326),i.stroke(),i.strokeStyle=`rgba(255,255,255,.75)`,i.lineWidth=6,i.lineCap=`round`;for(let e=0;e<3;e++)i.beginPath(),i.arc(212,281,16+e*15,-.75,.75),i.stroke();i.fillStyle=`rgba(255,255,255,.88)`,i.font=`500 40px "JetBrains Mono", ui-monospace, Menlo, monospace`,i.fillText(`••••  ${n}`,66,580),i.globalAlpha=.95,i.fillStyle=`#eb001b`,i.beginPath(),i.arc(874,562,46,0,Math.PI*2),i.fill(),i.fillStyle=`#f79e1b`,i.globalAlpha=.9,i.beginPath(),i.arc(932,562,46,0,Math.PI*2),i.fill(),i.globalAlpha=1}function w({brand:e=`Sora`,cta:t=`Get the card`,tone:n=`#c8102e`,waves:r=1,last4:d=`4821`,sound:m=!0,onCta:_}){let w=(0,i.useRef)(null),E=(0,i.useRef)(null),ce=(0,i.useRef)(null),le=(0,i.useRef)(null),D=(0,i.useRef)(null),[O,k]=(0,i.useState)(!0),[A,ue]=(0,i.useState)(0),de=(0,i.useRef)(n);de.current=n;let fe=(0,i.useRef)(r);fe.current=r;let j=(0,i.useRef)(()=>{}),M=u(m),N=(0,i.useRef)(M);N.current=M,(0,i.useEffect)(()=>{let t=w.current,n=E.current;if(!t||!n)return;let r=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,i=n.getContext(`webgl2`,{antialias:!0,alpha:!1,powerPreference:`high-performance`});if(!i){k(!1);return}let a=!1,u=0,m=!0,_=1,T=1,O=1,A=(e,t)=>{let n=i.createProgram();for(let[r,a]of[[i.VERTEX_SHADER,e],[i.FRAGMENT_SHADER,t]]){let e=i.createShader(r);i.shaderSource(e,a),i.compileShader(e),i.getShaderParameter(e,i.COMPILE_STATUS)||console.warn(i.getShaderInfoLog(e)),i.attachShader(n,e)}return i.linkProgram(n),n},M=A(b,se),P=A(x,S);if(!i.getProgramParameter(M,i.LINK_STATUS)||!i.getProgramParameter(P,i.LINK_STATUS)){k(!1);return}let F=(e,t)=>{let n={};for(let r of t)n[r]=i.getUniformLocation(e,r);return n},I=F(M,[`uVP`,`uT`,`uIntro`,`uAmp`,`uPool`,`uRip`,`uTone`,`uEye`,`uL`,`uGround`,`uCC`,`uCX`,`uCY`,`uCN`,`uCS`,`uFloor`,`uHaze`,`uPoolF`,`uToneF`]),L=F(P,[`uVP`,`uCC`,`uCX`,`uCY`,`uCN`,`uCS`,`uOff`,`uGrow`,`uTex`,`uEye`,`uL`,`uBack`,`uSheen`,`uAlpha`]),R=[],z=(e,t,n,r,i)=>{for(let a of[e,t,n,e,n,r])R.push(...a,...i)};z([-.5,1,.5],[.5,1,.5],[.5,1,-.5],[-.5,1,-.5],[0,1,0]),z([-.5,0,.5],[.5,0,.5],[.5,1,.5],[-.5,1,.5],[0,0,1]),z([.5,0,-.5],[-.5,0,-.5],[-.5,1,-.5],[.5,1,-.5],[0,0,-1]),z([.5,0,.5],[.5,0,-.5],[.5,1,-.5],[.5,1,.5],[1,0,0]),z([-.5,0,-.5],[-.5,0,.5],[-.5,1,.5],[-.5,1,-.5],[-1,0,0]);let pe=i.createVertexArray();i.bindVertexArray(pe);let me=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,me),i.bufferData(i.ARRAY_BUFFER,new Float32Array(R),i.STATIC_DRAW),i.enableVertexAttribArray(0),i.vertexAttribPointer(0,3,i.FLOAT,!1,24,0),i.enableVertexAttribArray(1),i.vertexAttribPointer(1,3,i.FLOAT,!1,24,12);let B=new Float32Array(9720),V=1234567;for(let e=0;e<oe;e++)for(let t=0;t<g;t++){V=V*16807%2147483647;let n=(e*g+t)*3;B[n]=t,B[n+1]=e,B[n+2]=V/2147483647}let H=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,H),i.bufferData(i.ARRAY_BUFFER,B,i.STATIC_DRAW),i.enableVertexAttribArray(2),i.vertexAttribPointer(2,3,i.FLOAT,!1,0,0),i.vertexAttribDivisor(2,1);let he=i.createVertexArray();i.bindVertexArray(he);let U=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,U),i.bufferData(i.ARRAY_BUFFER,new Float32Array([-80,0,12,0,1,0,80,0,12,0,1,0,80,0,-60,0,1,0,-80,0,12,0,1,0,80,0,-60,0,1,0,-80,0,-60,0,1,0]),i.STATIC_DRAW),i.enableVertexAttribArray(0),i.vertexAttribPointer(0,3,i.FLOAT,!1,24,0),i.enableVertexAttribArray(1),i.vertexAttribPointer(1,3,i.FLOAT,!1,24,12),i.vertexAttrib3f(2,0,0,0);let ge=i.createVertexArray();i.bindVertexArray(ge);let W=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,W),i.bufferData(i.ARRAY_BUFFER,new Float32Array([-.5,-.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,-.5,.5]),i.STATIC_DRAW),i.enableVertexAttribArray(0),i.vertexAttribPointer(0,2,i.FLOAT,!1,0,0),i.bindVertexArray(null);let G=document.createElement(`canvas`),_e=i.createTexture(),K=()=>{C(G,e,d),i.bindTexture(i.TEXTURE_2D,_e),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,G),i.generateMipmap(i.TEXTURE_2D),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR_MIPMAP_LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE);let t=i.getExtension(`EXT_texture_filter_anisotropic`);t&&i.texParameterf(i.TEXTURE_2D,t.TEXTURE_MAX_ANISOTROPY_EXT,8)};K(),document.fonts&&Promise.all([document.fonts.load(`400 92px "DM Serif Display"`),document.fonts.load(`500 40px "JetBrains Mono"`)]).then(()=>{a||(K(),r&&$(0))}).catch(()=>{});let q=()=>{let e=t.getBoundingClientRect();_=Math.max(1,Math.round(e.width)),T=Math.max(1,Math.round(e.height)),O=Math.min(2,window.devicePixelRatio||1),n.width=Math.round(_*O),n.height=Math.round(T*O)};q();let J={tx:0,ty:0,x:0,y:0,on:!1},ve=e=>{let n=t.getBoundingClientRect();J.tx=(e.clientX-n.left)/n.width*2-1,J.ty=(e.clientY-n.top)/n.height*2-1,J.on=!0},ye=()=>{J.tx=0,J.ty=0,J.on=!1};t.addEventListener(`pointermove`,ve),t.addEventListener(`pointerleave`,ye);let Y=new Float32Array(16),be=0,X=r?4.2:0,xe=-9,Se=1.5,Ce=0,we=!0,Te=0,Ee=0,De=e=>{if(X-xe<1)return;xe=X,we=!1,Se=X+s;let t=be++%4*4;Y[t]=Te,Y[t+1]=Ee,Y[t+2]=X+l,Y[t+3]=e?1.6:1.3,e&&N.current()};j.current=De;let Z={x:0,y:0,vx:0,vy:0},Oe=p([-.38,1,-.22]),Q=[],ke=``;function $(e){if(!i||a||!n)return;let t=_/T,s=t<.9;X+=e;let u=fe.current,d=1-Math.exp(-e*3.2);J.x+=(J.tx-J.x)*d,J.y+=(J.ty-J.y)*d;let m=r?1:ae(X/1.3),g=r?0:Math.sin(X*.31)*.55,oe=r?0:Math.sin(X*.23+1.1)*.3,b=s?[J.x*1.2+g*.6,17.5-J.y*.6+oe,22.5]:[J.x*2.6+g*1.2,15.3-J.y*1.3+oe,22.1],se=s?[0,.4,-4.5]:[0,.5,-4.2],x=re(te(s?Math.max(Math.tan(19*Math.PI/180),.3/t):Math.tan(19*Math.PI/180),t,.5,120),ne(b,se)),S=X-xe,C=0,w=0,E=0;if(S>0&&S<c)C=-.32*Math.sin(Math.PI*S/c);else if(S>=c&&S<ee)C=1.7*(1-(1-(S-c)/.38)**3);else if(S>=ee&&S<l){let e=(S-ee)/.28;C=1.7*(1-e*e)}else if(S>=l&&S<3.3){let e=S-l,t=Math.exp(-3.3*e);C=-.42*t*Math.sin(13*e),E=t*Math.sin(13*e+.6)}S>=c&&S<l&&(w=Math.PI*2*ae((S-c)/.66)),!we&&S>l&&(we=!0,Ce=(Ce+1)%o.length,ue(Ce));for(let t=0,n=e/4;t<4;t++)Z.vx+=(((J.on?J.y:0)-Z.x)*70-Z.vx*9)*n,Z.vy+=(((J.on?J.x:0)-Z.y)*70-Z.vy*9)*n,Z.x+=Z.vx*n,Z.y+=Z.vy*n;let O=r?0:Math.sin(X*1.5),k=s?[.3,6.6+O*.3+C*.9,10+C*.4]:[.2,3.5+O*.32+C,5.2+C*.7];k[1]+=(1-m)*1.2,Te=s?.3:.2,Ee=s?10:5.2;let A=[1,0,0],j=[0,1,0],N=(-58+Z.x*9+E*9)*(Math.PI/180),F=(16+(r?0:Math.sin(X*.8)*4))*(Math.PI/180),R=(-6+Z.y*14+(r?0:Math.cos(X*.7)*5))*(Math.PI/180);A=h(A,[0,0,1],F),j=h(j,[0,0,1],F),A=h(A,[1,0,0],N),j=h(j,[1,0,0],N),A=h(A,[0,1,0],R),j=h(j,[0,1,0],R),w&&(j=h(j,A,w));let z=p(f(A,j)),me=-.55+Z.y*.35-Z.x*.25+(r?.3:X*.22%1.6)+w*.12;!r&&X>Se&&De(!1),i.viewport(0,0,n.width,n.height);let B=[.969,.969,.961];i.clearColor(B[0],B[1],B[2],1),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),i.enable(i.DEPTH_TEST),i.disable(i.BLEND),i.useProgram(M),i.uniformMatrix4fv(I.uVP,!1,x),i.uniform1f(I.uT,X*1.6*(.55+.45*u)),i.uniform1f(I.uIntro,m),i.uniform1f(I.uAmp,.7+.3*u),i.uniform2f(I.uPool,k[0],k[2]-1.2);let V=new Float32Array(Y);for(let e=0;e<4;e++)V[e*4+2]=Y[e*4+2]*1.6*(.55+.45*u);i.uniform4fv(I.uRip,V),i.uniform3fv(I.uTone,ie(de.current)),i.uniform3fv(I.uEye,b),i.uniform3fv(I.uL,Oe),i.uniform3fv(I.uGround,B),i.uniform3fv(I.uCC,k),i.uniform3fv(I.uCX,A),i.uniform3fv(I.uCY,j),i.uniform3fv(I.uCN,z),i.uniform2f(I.uCS,v,y),i.uniform1f(I.uHaze,n.height),i.uniform2f(I.uPoolF,k[0],k[2]-1.2),i.uniform3fv(I.uToneF,ie(de.current)),i.uniform1f(I.uFloor,1),i.bindVertexArray(he),i.drawArrays(i.TRIANGLES,0,6),i.uniform1f(I.uFloor,0),i.bindVertexArray(pe),i.drawArraysInstanced(i.TRIANGLES,0,30,3240),i.enable(i.BLEND),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA),i.useProgram(P),i.uniformMatrix4fv(L.uVP,!1,x),i.uniform3fv(L.uCC,k),i.uniform3fv(L.uCX,A),i.uniform3fv(L.uCY,j),i.uniform3fv(L.uCN,z),i.uniform2f(L.uCS,v,y),i.uniform3fv(L.uEye,b),i.uniform3fv(L.uL,Oe),i.uniform1f(L.uSheen,me),i.uniform1f(L.uAlpha,m),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,_e),i.uniform1i(L.uTex,0),i.bindVertexArray(ge),i.uniform1f(L.uBack,1),i.uniform1f(L.uOff,-.07),i.uniform1f(L.uGrow,1),i.drawArrays(i.TRIANGLES,0,6),i.uniform1f(L.uBack,0),i.uniform1f(L.uOff,0),i.drawArrays(i.TRIANGLES,0,6),i.bindVertexArray(null),Q=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([e,t])=>{let n=[k[0]+A[0]*e*v+j[0]*t*y,k[1]+A[1]*e*v+j[1]*t*y,k[2]+A[2]*e*v+j[2]*t*y],r=x[0]*n[0]+x[4]*n[1]+x[8]*n[2]+x[12],i=x[1]*n[0]+x[5]*n[1]+x[9]*n[2]+x[13],a=x[3]*n[0]+x[7]*n[1]+x[11]*n[2]+x[15];return[(r/a*.5+.5)*_,(.5-i/a*.5)*T]});let H=Q.map(e=>e[0]),U=Q.map(e=>e[1]),W=[Math.min(...H),Math.min(...U),Math.max(...H),Math.max(...U)].map(e=>Math.round(e)),G=W.join(`,`);if(G!==ke&&ce.current){ke=G;let e=ce.current.style;e.left=`${W[0]}px`,e.top=`${W[1]}px`,e.width=`${W[2]-W[0]}px`,e.height=`${W[3]-W[1]}px`}let K=-b[0]*7,q=(b[1]-(s?17.5:15.3))*6;le.current&&(le.current.style.transform=`translate3d(${K.toFixed(2)}px, ${q.toFixed(2)}px, 0)`),D.current&&D.current.style.setProperty(`--sra-px`,`${(K*1.5).toFixed(2)}px`),D.current&&D.current.style.setProperty(`--sra-py`,`${(q*1.5).toFixed(2)}px`)}let Ae=performance.now(),je=e=>{u=requestAnimationFrame(je);let t=Math.min(.05,(e-Ae)/1e3);Ae=e,!(!m||document.hidden)&&$(t)},Me=new ResizeObserver(()=>{q(),r&&$(0)});Me.observe(t);let Ne=new IntersectionObserver(([e])=>{m=e.isIntersecting});Ne.observe(t),r?$(0):u=requestAnimationFrame(je);let Pe=(e,t)=>{if(Q.length!==4)return!1;let n=0;for(let r=0;r<4;r++){let[i,a]=Q[r],[o,s]=Q[(r+1)%4],c=(o-i)*(t-a)-(s-a)*(e-i);if(c!==0){if(n===0)n=Math.sign(c);else if(Math.sign(c)!==n)return!1}}return!0},Fe=e=>{let n=t.getBoundingClientRect();Pe(e.clientX-n.left,e.clientY-n.top)&&(De(!0),r&&$(0))};return n.addEventListener(`pointerdown`,Fe),()=>{a=!0,cancelAnimationFrame(u),Me.disconnect(),Ne.disconnect(),t.removeEventListener(`pointermove`,ve),t.removeEventListener(`pointerleave`,ye),n.removeEventListener(`pointerdown`,Fe),i.deleteProgram(M),i.deleteProgram(P),i.deleteTexture(_e),[me,H,U,W].forEach(e=>i.deleteBuffer(e))}},[e,d]);let P=o[A];return(0,a.jsxs)(`div`,{ref:w,className:`sra-root${O?``:` sra-nogl`}`,style:{"--sra-tone":n},children:[(0,a.jsx)(`style`,{children:T}),(0,a.jsx)(`canvas`,{ref:E,className:`sra-cv`,"aria-hidden":`true`}),(0,a.jsx)(`div`,{className:`sra-fallback`,"aria-hidden":`true`,children:(0,a.jsxs)(`div`,{className:`sra-fcard`,children:[(0,a.jsx)(`span`,{className:`sra-fbrand`,children:e}),(0,a.jsxs)(`span`,{className:`sra-fnum`,children:[`•••• `,d]})]})}),(0,a.jsxs)(`nav`,{className:`sra-nav`,children:[(0,a.jsxs)(`a`,{className:`sra-logo`,href:`#`,onClick:e=>e.preventDefault(),children:[(0,a.jsx)(`span`,{className:`sra-dot`}),e]}),(0,a.jsxs)(`div`,{className:`sra-links`,children:[(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Card`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Savings`}),(0,a.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),children:`Business`})]}),(0,a.jsx)(`button`,{type:`button`,className:`sra-cta`,onClick:()=>_?.(),children:t})]}),(0,a.jsxs)(`h1`,{ref:le,className:`sra-title`,children:[(0,a.jsx)(`span`,{className:`sra-l1`,children:(0,a.jsx)(`span`,{children:`Money that`})}),(0,a.jsx)(`span`,{className:`sra-l2`,children:(0,a.jsx)(`span`,{children:(0,a.jsx)(`em`,{children:`moves with you`})})})]}),(0,a.jsx)(`button`,{ref:ce,type:`button`,className:`sra-hit`,"aria-label":`Pay with the ${e} card`,onClick:e=>{e.detail===0&&j.current(!0)}}),(0,a.jsxs)(`div`,{ref:D,className:`sra-fg`,children:[(0,a.jsxs)(`div`,{className:`sra-receipt`,"aria-live":`polite`,children:[(0,a.jsxs)(`div`,{className:`sra-rtop`,children:[(0,a.jsxs)(`span`,{className:`sra-roll`,children:[P.what,` · `,P.city]},`w${A}`),(0,a.jsx)(`span`,{className:`sra-now`,children:`Just now`})]}),(0,a.jsxs)(`div`,{className:`sra-rrow`,children:[(0,a.jsx)(`b`,{className:`sra-roll`,children:P.amount},`a${A}`),(0,a.jsx)(`span`,{className:`sra-fx`,children:`0% FX`})]})]}),(0,a.jsx)(`p`,{className:`sra-copy`,children:`One card for 40 currencies. No fees abroad, ever.`})]})]})}var T=`
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
.sra-root {
  --sra-tone: #c8102e;
  --sra-ink: #121214;
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: var(--design-h, 100svh);
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  background: #f7f7f5;
  color: var(--sra-ink);
  font-family: "Inter Tight", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.sra-cv { position: absolute; inset: 0; width: 100%; height: 100%; display: block; z-index: 0; touch-action: manipulation; }
.sra-fallback { display: none; }
.sra-nogl .sra-cv { display: none; }
.sra-nogl .sra-fallback {
  display: block; position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(60% 45% at 50% 72%, color-mix(in srgb, var(--sra-tone) 55%, #f7f7f5) 0%, color-mix(in srgb, var(--sra-tone) 18%, #f7f7f5) 55%, #f7f7f5 80%);
}
.sra-fcard {
  position: absolute; left: 50%; top: 62%; width: min(330px, 70cqi); aspect-ratio: 1.586; border-radius: 18px;
  transform: translate(-50%, -50%) perspective(900px) rotateX(18deg) rotateY(-12deg) rotateZ(-10deg);
  background: linear-gradient(135deg, #1c2142, #2b3270 50%, #141731); color: #fff;
  box-shadow: 0 40px 60px rgba(20, 20, 50, .3);
}
.sra-fbrand { position: absolute; left: 22px; top: 18px; font: 400 28px "DM Serif Display", Georgia, serif; }
.sra-fnum { position: absolute; left: 22px; bottom: 18px; font: 500 13px "JetBrains Mono", ui-monospace, monospace; letter-spacing: .14em; }

.sra-nav {
  position: absolute; z-index: 5; left: 44px; right: 44px; top: 30px;
  display: flex; align-items: center; gap: 30px; font-size: 14px; font-weight: 500;
}
.sra-logo { margin-right: auto; display: flex; align-items: center; gap: 9px; font-size: 18px; font-weight: 600; color: var(--sra-tone); text-decoration: none; }
.sra-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--sra-tone); }
.sra-links { display: flex; gap: 28px; }
.sra-links a { color: var(--sra-ink); opacity: .8; text-decoration: none; transition: opacity .2s; }
.sra-links a:hover { opacity: 1; }
.sra-cta {
  font: inherit; font-size: 13.5px; font-weight: 500; color: #fff; background: var(--sra-tone);
  border: 0; border-radius: 999px; padding: 10px 18px; cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 6px 16px -6px color-mix(in srgb, var(--sra-tone) 70%, transparent);
  transition: transform .18s cubic-bezier(.3,1.4,.5,1), filter .2s;
}
.sra-cta:hover { filter: brightness(1.07); }
.sra-cta:active { transform: scale(.97); }
.sra-root a:focus-visible, .sra-cta:focus-visible { outline: 2px solid var(--sra-tone); outline-offset: 3px; border-radius: 999px; }

.sra-title {
  position: absolute; z-index: 3; left: 0; right: 0; top: 96px; margin: 0;
  text-align: center; color: var(--sra-tone); pointer-events: none;
  font-family: "DM Serif Display", Georgia, serif; font-weight: 400;
  font-size: clamp(56px, 9.17cqi, 140px); line-height: .9; letter-spacing: -.03em;
  will-change: transform;
}
.sra-title > span { display: block; overflow: hidden; padding: 0 .08em .06em; }
.sra-title > span > span { display: inline-block; animation: sra-rise 1s cubic-bezier(.2,.8,.2,1) both; }
.sra-l2 > span { animation-delay: .12s !important; }
.sra-title em { font-style: italic; }
@keyframes sra-rise { from { transform: translateY(105%); } to { transform: none; } }

.sra-hit {
  position: absolute; z-index: 2; border: 0; padding: 0; background: transparent; cursor: pointer;
  border-radius: 22px; pointer-events: none;
}
.sra-hit:focus-visible { outline: 2px solid var(--sra-tone); outline-offset: 6px; }
.sra-nogl .sra-hit { display: none; }

.sra-fg { position: absolute; inset: 0; z-index: 4; pointer-events: none; transform: translate3d(var(--sra-px, 0px), var(--sra-py, 0px), 0); }
.sra-receipt {
  position: absolute; left: 56px; bottom: 52px; width: 236px; padding: 14px 18px;
  background: #fff; border-radius: 14px; font-size: 13px; color: var(--sra-ink); pointer-events: auto;
  box-shadow: 0 1px 0 rgba(0,0,0,.04), 0 18px 40px -12px rgba(60, 10, 20, .22);
  animation: sra-fade .8s .5s cubic-bezier(.2,.8,.2,1) both;
}
.sra-rtop, .sra-rrow { display: flex; justify-content: space-between; align-items: baseline; overflow: hidden; }
.sra-rtop { color: rgba(18,18,20,.55); }
.sra-now { font-size: 11.5px; }
.sra-rrow { margin-top: 4px; }
.sra-rrow b { font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: -.01em; }
.sra-fx { color: #1a8f4c; font-weight: 500; }
.sra-roll { display: inline-block; animation: sra-roll .5s cubic-bezier(.2,.8,.2,1) both; }
@keyframes sra-roll { from { transform: translateY(110%); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes sra-fade { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.sra-copy {
  position: absolute; right: 56px; bottom: 56px; width: 300px; margin: 0;
  font-size: 15px; line-height: 1.45; text-align: right; color: var(--sra-ink);
  text-shadow: 0 0 10px #fff, 0 0 18px #fff, 0 0 28px rgba(255,255,255,.9);
  animation: sra-fade .8s .6s cubic-bezier(.2,.8,.2,1) both;
}

@container (max-width: 900px) {
  .sra-links { display: none; }
  .sra-copy { width: 240px; font-size: 14px; }
}
@container (max-width: 640px) {
  .sra-nav { left: 20px; right: 20px; top: 22px; }
  .sra-title { top: 92px; font-size: 14cqi; line-height: .94; }
  .sra-receipt { left: 20px; right: 20px; bottom: 24px; width: auto; }
  .sra-copy { left: 20px; right: 20px; bottom: 108px; width: auto; text-align: left; font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .sra-title > span > span, .sra-receipt, .sra-copy, .sra-roll { animation: none !important; }
  .sra-cta { transition: none; }
}
`;(0,r.createRoot)(document.getElementById(`root`)).render((0,a.jsx)(i.StrictMode,{children:(0,a.jsx)(w,{})}));