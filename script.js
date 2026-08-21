const labels={scholarship:"Scholarship",trainee:"Graduate Trainee",internship:"Internship",job:"Job"};
const grid=document.querySelector("#opportunityGrid"),empty=document.querySelector("#empty");
let data=[];

function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function render(){
  const q = (document.querySelector("#search")?.value || "").trim().toLowerCase();
  const c = (document.querySelector("#category")?.value || "all").toLowerCase();
  const l = (document.querySelector("#location")?.value || "all").toLowerCase();

  const items = data.filter(x => {
    const type = String(x.type || "").trim().toLowerCase();
    const location = String(x.location || "").trim().toLowerCase();

    const matchesSearch =
      !q ||
      `${x.name || ""} ${x.org || ""} ${x.desc || ""}`
        .toLowerCase()
        .includes(q);

    const matchesCategory =
      c === "all" ||
      type === c ||
      type.includes(c) ||
      c.includes(type);

    const matchesLocation =
      l === "all" ||
      location === l ||
      location.includes(l) ||
      l.includes(location);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  grid.innerHTML = items.map(x => {
    const type = String(x.type || "").trim().toLowerCase();
    const location = String(x.location || "").trim().toLowerCase();

    const locationLabel =
      location === "remote"
        ? "Remote"
        : location === "nigeria"
        ? "Nigeria"
        : "International";

    return `
      <article class="opp">
        <div class="opp-top">
          <span class="opp-type">${esc(labels[type] || x.type || "Opportunity")}</span>
          <span>✨</span>
        </div>

        <h3>${esc(x.name)}</h3>
        <p>${esc(x.desc)}</p>

        <div class="opp-meta">
          <span class="pill">${esc(x.org)}</span>
          <span class="pill">${locationLabel}</span>
          <span class="pill">Deadline: ${esc(x.deadline || "Not specified")}</span>
        </div>

        <a href="${esc(x.url || "#")}" target="_blank" rel="noopener">
          View opportunity →
        </a>
      </article>
    `;
  }).join("");
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
   data=(rows||[])
  .map(x=>({
    id:x.id,
    name:x.title||x.name,
    type:x.category||x.type,
    location:x.location||"nigeria",
    org:x.organization||x.org||"",
    desc:x.description||x.desc||"",
    deadline:x.deadline||"",
    url:x.application_url||x.url||"#"
  }))
  .filter(x => {
    if (!x.deadline) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(x.deadline + "T00:00:00");
    return deadline >= today;
  });

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
const messageForm = document.querySelector("#messageForm");

if (messageForm) {
  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = document.querySelector("#messageStatus");

    if (!window.sb) {
      status.textContent =
        "Unable to send message. Please try again later.";
      return;
    }

    const name =
      document.querySelector("#messageName").value.trim();

    const email =
      document.querySelector("#messageEmail").value.trim();

    const message =
      document.querySelector("#messageText").value.trim();

    status.textContent = "Sending...";

    const { error } = await window.sb
      .from("messages")
const labels = {
  scholarship: "Scholarship",
  trainee: "Graduate Trainee",
  internship: "Internship",
  job: "Job"
};

const grid = document.querySelector("#opportunityGrid");
const empty = document.querySelector("#empty");

let data = [];


function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}


function render() {

  const q =
    (document.querySelector("#search")?.value || "")
      .trim()
      .toLowerCase();

  const c =
    (document.querySelector("#category")?.value || "all")
      .toLowerCase();

  const l =
    (document.querySelector("#location")?.value || "all")
      .toLowerCase();


  const items = data.filter(x => {

    const type =
      String(x.type || "")
        .trim()
        .toLowerCase();

    const location =
      String(x.location || "")
        .trim()
        .toLowerCase();


    const matchesSearch =
      !q ||
      `${x.name || ""} ${x.org || ""} ${x.desc || ""}`
        .toLowerCase()
        .includes(q);


    const matchesCategory =
      c === "all" ||
      type === c ||
      type.includes(c) ||
      c.includes(type);


    const matchesLocation =
      l === "all" ||
      location === l ||
      location.includes(l) ||
      l.includes(location);


    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation
    );
  });


  if (grid) {

    grid.innerHTML = items.map(x => {

      const type =
        String(x.type || "")
          .trim()
          .toLowerCase();

      const location =
        String(x.location || "")
          .trim()
          .toLowerCase();


      const locationLabel =
        location === "remote"
          ? "Remote"
          : location === "nigeria"
          ? "Nigeria"
          : "International";


      return `
        <article class="opp">

          <div class="opp-top">

            <span class="opp-type">
              ${esc(labels[type] || x.type || "Opportunity")}
            </span>

            <span>✨</span>

          </div>


          <h3>
            ${esc(x.name)}
          </h3>


          <p>
            ${esc(x.desc)}
          </p>


          <div class="opp-meta">

            <span class="pill">
              ${esc(x.org)}
            </span>

            <span class="pill">
              ${locationLabel}
            </span>

            <span class="pill">
              Deadline: ${esc(x.deadline || "Not specified")}
            </span>

          </div>


          <a
            href="${esc(x.url || "#")}"
            target="_blank"
            rel="noopener">

            View opportunity →

          </a>

        </article>
      `;

    }).join("");

  }


  if (empty) {
    empty.hidden = items.length > 0;
  }

}


["search", "category", "location"].forEach(id => {

  document
    .querySelector("#" + id)
    ?.addEventListener("input", render);

});


document
  .querySelector(".menu")
  ?.addEventListener("click", () => {

    document
      .querySelector(".links")
      ?.classList.toggle("open");

  });


document
  .querySelectorAll(".links a")
  .forEach(a => {

    a.addEventListener("click", () => {

      document
        .querySelector(".links")
        ?.classList.remove("open");

    });

  });



/* LOAD OPPORTUNITIES */

async function loadOpportunities() {

  try {

    if (!window.sb) {
      throw new Error(
        "Supabase is not configured."
      );
    }


    const {
      data: rows,
      error
    } = await window.sb
      .from("opportunities")
      .select("*")
      .order("created_at", {
        ascending: false
      });


    if (error) {
      throw error;
    }


    data = (rows || [])
      .map(x => ({

        id: x.id,

        name:
          x.title ||
          x.name,

        type:
          x.category ||
          x.type,

        location:
          x.location ||
          "nigeria",

        org:
          x.organization ||
          x.org ||
          "",

        desc:
          x.description ||
          x.desc ||
          "",

        deadline:
          x.deadline ||
          "",

        url:
          x.application_url ||
          x.url ||
          "#"

      }))
      .filter(x => {

        if (!x.deadline) {
          return true;
        }


        const today = new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );


        const deadline =
          new Date(
            x.deadline + "T00:00:00"
          );


        return deadline >= today;

      });


    render();


  } catch (e) {

    console.error(e);

    data = [];


    if (grid) {

      grid.innerHTML = `
        <p class="empty">
          Opportunities could not be loaded.
          Please check the Supabase configuration.
        </p>
      `;

    }


    if (empty) {
      empty.hidden = true;
    }

  }

}



/* NEWSLETTER */

const subscriberForm =
  document.querySelector("#form");


if (subscriberForm) {

  subscriberForm.addEventListener(
    "submit",
    async () => {

      const b =
        subscriberForm.querySelector(
          "[data-fs-submit-btn]"
        );


      if (b) {
        b.textContent = "Submitting...";
      }


      if (window.sb) {

        const name =
          subscriberForm
            .querySelector('[name="name"]')
            ?.value || "";


        const email =
          subscriberForm
            .querySelector('[name="email"]')
            ?.value || "";


        const interest =
          subscriberForm
            .querySelector('[name="interest"]')
            ?.value || "";


        const { error } =
          await window.sb
            .from("subscribers")
            .insert({
              name,
              email,
              interest
            });


        if (error) {

          if (error.code === "23505") {

            alert(
              "This email is already subscribed to SkillVault."
            );

          } else {

            console.error(
              "Subscriber save error:",
              error
            );

          }

        }

      }

    }
  );

}



/* CONTACT MESSAGE FORM */

const messageForm =
  document.querySelector("#messageForm");


if (messageForm) {

  messageForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      const status =
        document.querySelector(
          "#messageStatus"
        );


      if (!window.sb) {

        status.textContent =
          "Unable to send message. Please try again later.";

        return;

      }


      const name =
        document
          .querySelector("#messageName")
          .value
          .trim();


      const email =
        document
          .querySelector("#messageEmail")
          .value
          .trim();


      const message =
        document
          .querySelector("#messageText")
          .value
          .trim();


      status.textContent =
        "Sending...";


      const { error } =
        await window.sb
          .from("messages")
          .insert({

            name,
            email,
            message

          });


      if (error) {

        console.error(
          "Message submission error:",
          error
        );


        status.textContent =
          "Unable to send your message. Please try again.";

        return;

      }


      status.textContent =
        "Message sent successfully!";


      messageForm.reset();

    }
  );

}



/* CV SERVICE REQUEST HANDLER */

function handleCVServiceRequest() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const service =
    params.get("service");


  if (!service) {
    return;
  }


  const messageBox =
    document.querySelector(
      "#messageText"
    );


  const contactSection =
    document.querySelector(
      "#contact"
    );


  if (!messageBox) {
    return;
  }


  messageBox.value =
    "I am interested in the SkillVault " +
    service +
    " service.";


  if (contactSection) {

    setTimeout(() => {

      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 300);

  }

}



/* START */

loadOpportunities();

handleCVServiceRequest();
