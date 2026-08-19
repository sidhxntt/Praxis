const state={styles:[],query:"",trait:"",active:null};
const gallery=document.querySelector("#gallery");
const search=document.querySelector("#search");
const traits=document.querySelector("#traits");
const count=document.querySelector("#count");
const preview=document.querySelector("#preview");
const palette=["#d8ff57","#ff6f61","#7657ff","#00d49a","#ffcc35","#38a8ff"];

fetch("/catalog.json").then((response)=>response.json()).then((styles)=>{state.styles=styles;renderTraits();render();});
search.addEventListener("input",()=>{state.query=search.value.trim().toLowerCase();render();});
document.querySelector(".close").addEventListener("click",()=>preview.close());
document.querySelector("#select").addEventListener("click",selectStyle);
preview.addEventListener("click",(event)=>{if(event.target===preview)preview.close();});

function renderTraits(){
  const values=[...new Set(state.styles.flatMap((style)=>style.traits))].sort();
  traits.replaceChildren(...values.map((trait)=>{
    const button=document.createElement("button");button.type="button";button.textContent=trait;
    button.setAttribute("aria-pressed","false");button.addEventListener("click",()=>{
      state.trait=state.trait===trait?"":trait;
      [...traits.children].forEach((item)=>item.setAttribute("aria-pressed",String(item.textContent===state.trait)));
      render();
    });return button;
  }));
}
function render(){
  const visible=state.styles.filter((style)=>!state.trait||style.traits.includes(state.trait)).filter((style)=>
    !state.query||[style.label,style.description,...style.traits].join(" ").toLowerCase().includes(state.query));
  count.textContent=`${visible.length} of ${state.styles.length} styles`;
  gallery.replaceChildren(...visible.map((style,index)=>card(style,index)));
}
function card(style,index){
  const button=document.createElement("button");button.type="button";button.className="card";
  button.style.setProperty("--card-accent",palette[index%palette.length]);button.style.setProperty("--card-bg",style.theme==="light"?"#dddcd3":"#24242a");
  button.innerHTML=`<span class="swatch"></span><span class="card-copy"><h2></h2><p></p><span class="tag"></span></span>`;
  button.querySelector("h2").textContent=style.label;button.querySelector("p").textContent=style.description;button.querySelector(".tag").textContent=style.traits.join(" · ");
  button.addEventListener("click",()=>openPreview(style,index));return button;
}
function openPreview(style,index){
  state.active=style;document.querySelector("#preview-title").textContent=style.label;document.querySelector("#preview-description").textContent=style.description;
  document.querySelector("#preview-theme").textContent=`${style.theme} direction`;
  document.querySelector("#preview-traits").textContent=style.traits.join(" · ");
  document.querySelector("#preview-art").style.setProperty("--preview-accent",palette[index%palette.length]);document.querySelector("#preview-art").style.setProperty("--preview-bg",style.theme==="light"?"#d7d6cd":"#22222a");
  document.querySelector("#status").textContent="";preview.showModal();
}
async function selectStyle(){
  if(!state.active)return;const button=document.querySelector("#select");button.disabled=true;button.textContent="Sending selection…";
  try{const response=await fetch("/select",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:state.active.id})});if(!response.ok)throw new Error();document.querySelector("#status").textContent="Selected. You can return to the terminal.";button.textContent="Selected";}
  catch{document.querySelector("#status").textContent="The CLI is no longer waiting. Return to the terminal.";button.disabled=false;button.textContent="Try again";}
}
