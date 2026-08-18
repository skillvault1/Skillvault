const labels={scholarship:"Scholarship",trainee:"Graduate Trainee",internship:"Internship",job:"Job"};
const grid=document.querySelector("#opportunityGrid"),empty=document.querySelector("#empty");
let data=[];

function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function render(){
 const q=(document.querySelector("#search")?.value||"").toLowerCase(), c=document.querySelector("#category")?.value||"all", l=document.querySelector("#location")?.value||"all";
 const items=data.filter(x=>(c==="all"||x.type===c)&&(l==="all"||x.location===l)&&(`${x.name} ${x.org} ${x.desc}`.toLowerCase().includes(q)));
 grid.innerHTML=items.map(x=>`<article class="opp"><div class="opp-top"><span class="opp-type">${esc(labels[x.type]||x.type)}</span><span>✨</span></div><h3>${esc(x.name)}</h3><p>${esc(x.desc)}</p><div class="opp-meta"><span class="pill">${esc(x.org)}</span><span class="pill">${x.location==="remote"?"Remote":x.location==="nigeria"?"Nigeria":"International"}</span><span class="pill">Deadline: ${esc(x.deadline||"Not specified")}</span></div><a href="${esc(x.url||"#")}" target="_blank" rel="noopener">View opportunity →</a></article>`).join("");
 empty.hidden=items.length>0;
}
["search","category","location"].forEach(id=>document.querySelector("#"+id)?.addEventListener("input",render));
document.querySelector(".menu")?.addEventListener("click",()=>document.querySelector(".links")?.classList.toggle("open"));
document.querySelectorAll(".links a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".links")?.classList.remove("open")));

async function loadOpportunities(){
 try{
   if(!window.sb) throw new Error("Supabase is not configured.");
   const { data: rows, error } = await window.sb
  .from("opportunities")
  .select("*")
  .order("created_at", { ascending: false });
   if(error) throw error;
   data=(rows||[]).map(x=>({
     id:x.id,name:x.title||x.name,type:x.category||x.type,location:x.location||"nigeria",
     org:x.organization||x.org||"",desc:x.description||x.desc||"",deadline:x.deadline||"",url:x.application_url||x.url||"#"
   }));
   render();
 }catch(e){
   console.error(e);
   data=[];
   grid.innerHTML=`<p class="empty">Opportunities could not be loaded. Please check the Supabase configuration.</p>`;
   empty.hidden=true;
 }
}
const subscriberForm = document.querySelector("#form");

if (subscriberForm) {
  subscriberForm.addEventListener("submit", async () => {
    const b = subscriberForm.querySelector("[data-fs-submit-btn]");
    if (b) b.textContent = "Submitting...";
    
    if (window.sb) {
      const name = subscriberForm.querySelector('[name="name"]')?.value || "";
      const email = subscriberForm.querySelector('[name="email"]')?.value || "";
      const interest = subscriberForm.querySelector('[name="interest"]')?.value || "";
      
      const { error } = await window.sb
        .from("subscribers")
        .insert({ name, email, interest });
      
      if (error) {
  if (error.code === "23505") {
    alert("This email is already subscribed to SkillVault.");
  } else {
    console.error("Subscriber save error:", error);
  }
}
    }
  });
}

loadOpportunities();