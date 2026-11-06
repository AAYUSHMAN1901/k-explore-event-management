const EVENTS = [
 {id:1,name:"CodeStorm Hackathon",cat:"Tech",date:"2026-12-05T09:00",venue:"Tech Park Auditorium, Bhubaneswar",emoji:"💻",c:["#6c4cf1","#4cc9f0"],desc:"24 hours of building, mentoring and prizes worth ₹1 lakh."},
 {id:2,name:"Odissi Music Night",cat:"Music",date:"2026-12-12T18:30",venue:"Rabindra Mandap",emoji:"🎶",c:["#f15bb5","#ff9a5a"],desc:"An evening of classical and fusion performances by leading artists."},
 {id:3,name:"UI/UX Design Workshop",cat:"Workshop",date:"2026-12-18T10:00",venue:"Design Studio, KIIT Campus",emoji:"🎨",c:["#00b894","#55efc4"],desc:"Hands-on Figma workshop covering wireframes, prototypes and usability."},
 {id:4,name:"Startup Pitch Day",cat:"Business",date:"2027-01-08T11:00",venue:"Innovation Hub",emoji:"🚀",c:["#fd7e14","#ffc107"],desc:"Student founders pitch to investors. Network with mentors and VCs."},
 {id:5,name:"Inter-College Football Cup",cat:"Sports",date:"2027-01-15T15:00",venue:"Kalinga Stadium Ground",emoji:"⚽",c:["#2ecc71","#1e8449"],desc:"Knockout tournament featuring 16 college teams."},
 {id:6,name:"AI & Machine Learning Summit",cat:"Tech",date:"2027-01-22T09:30",venue:"Convention Centre",emoji:"🤖",c:["#5f27cd","#c56cf0"],desc:"Talks and demos from industry experts on the latest in AI."},
 {id:7,name:"Street Food Carnival",cat:"Food",date:"2027-02-06T16:00",venue:"Marine Drive Grounds",emoji:"🍜",c:["#e74c3c","#f39c12"],desc:"50+ stalls, live music and cooking contests for food lovers."},
 {id:8,name:"Photography Walk",cat:"Workshop",date:"2027-02-14T06:30",venue:"Dhauli Hills",emoji:"📷",c:["#0984e3","#74b9ff"],desc:"Sunrise photo walk with tips from professional photographers."}
];
const $ = s => document.querySelector(s);
const store = {
  get: () => { try { return JSON.parse(localStorage.getItem("kx_regs")) || []; } catch { return []; } },
  set: v => { try { localStorage.setItem("kx_regs", JSON.stringify(v)); } catch {} }
};
let activeCat = "All", current = null, timer = null;
const fmt = d => new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});
const bg = e => `background:linear-gradient(135deg,${e.c[0]},${e.c[1]})`;

// Theme
const root = document.documentElement;
function setTheme(t){ root.dataset.theme = t; $("#themeBtn").textContent = t==="dark"?"☀️":"🌙"; try{localStorage.setItem("kx_theme",t)}catch{} }
let saved = null; try{ saved = localStorage.getItem("kx_theme"); }catch{}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("#themeBtn").onclick = () => setTheme(root.dataset.theme==="dark"?"light":"dark");
$("#burger").onclick = () => $("#menu").classList.toggle("open");
$("#menu").onclick = () => $("#menu").classList.remove("open");

// Filters + rendering
const cats = ["All", ...new Set(EVENTS.map(e => e.cat))];
$("#filters").innerHTML = cats.map(c => `<button class="chip${c==="All"?" active":""}" data-c="${c}">${c}</button>`).join("");
$("#filters").onclick = e => {
  const b = e.target.closest(".chip"); if(!b) return;
  activeCat = b.dataset.c;
  document.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x===b));
  render();
};
$("#search").oninput = render;

function render(){
  const q = $("#search").value.trim().toLowerCase();
  const list = EVENTS.filter(e => (activeCat==="All"||e.cat===activeCat) &&
    (e.name+e.venue+e.desc+e.cat).toLowerCase().includes(q))
    .sort((a,b) => new Date(a.date)-new Date(b.date));
  $("#grid").innerHTML = list.map(e => `
    <article class="card reveal show">
      <div class="banner" style="${bg(e)}">${e.emoji}</div>
      <div class="cbody">
        <span class="tag">${e.cat}</span>
        <h3>${e.name}</h3>
        <p class="meta">📅 ${fmt(e.date)}<br>📍 ${e.venue}</p>
        <p class="d">${e.desc}</p>
        <button class="btn" data-id="${e.id}">View &amp; Register</button>
      </div>
    </article>`).join("");
  $("#empty").hidden = list.length > 0;
}
$("#grid").onclick = e => { const b = e.target.closest("[data-id]"); if(b) openModal(+b.dataset.id); };

// Countdown
function countdown(date){
  const ms = new Date(date) - Date.now();
  if (ms <= 0) return "Event started";
  const d = Math.floor(ms/864e5), h = Math.floor(ms/36e5)%24, m = Math.floor(ms/6e4)%60, s = Math.floor(ms/1e3)%60;
  return `⏳ ${d}d ${h}h ${m}m ${s}s`;
}
function tick(){
  const up = EVENTS.filter(e => new Date(e.date) > Date.now()).sort((a,b)=>new Date(a.date)-new Date(b.date))[0];
  $("#nextEvent").textContent = up ? `Next: ${up.name} · ${countdown(up.date).replace("⏳ ","")}` : "";
  if (current) $("#mCount").textContent = countdown(current.date);
}
setInterval(tick, 1000); tick();

// Modal
function openModal(id){
  current = EVENTS.find(e => e.id===id);
  $("#mBanner").style.cssText = bg(current); $("#mBanner").textContent = current.emoji;
  $("#mTitle").textContent = current.name;
  $("#mMeta").innerHTML = `📅 ${fmt(current.date)} · 📍 ${current.venue} · <b>${current.cat}</b>`;
  $("#mDesc").textContent = current.desc;
  $("#eventSel").innerHTML = EVENTS.map(e => `<option value="${e.id}"${e.id===id?" selected":""}>${e.name}</option>`).join("");
  $("#form").hidden = false; $("#confirm").hidden = true; $("#form").reset();
  $("#eventSel").value = id; clearErrors(); tick();
  $("#modal").hidden = false; document.body.style.overflow = "hidden"; $("#name").focus();
}
function closeModal(){ $("#modal").hidden = true; document.body.style.overflow = ""; current = null; }
$("#closeBtn").onclick = closeModal;
$("#modal").onclick = e => { if(e.target.id==="modal") closeModal(); };
document.addEventListener("keydown", e => { if(e.key==="Escape" && !$("#modal").hidden) closeModal(); });

// Validation
function setErr(input, msg){
  input.parentElement.classList.toggle("bad", !!msg);
  input.parentElement.querySelector("small").textContent = msg;
  return !msg;
}
function clearErrors(){ document.querySelectorAll("#form label").forEach(l => { l.classList.remove("bad"); l.querySelector("small").textContent=""; }); }
const rules = {
  name: v => !/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(v) ? "Enter a valid name (letters only, min 2 chars)." : "",
  email: v => !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Enter a valid email address." : "",
  phone: v => !/^[6-9]\d{9}$/.test(v.replace(/[\s-]/g,"")) ? "Enter a valid 10-digit mobile number." : "",
  eventSel: v => !v ? "Please select an event." : ""
};
Object.keys(rules).forEach(k => $("#"+k).addEventListener("blur", e => setErr(e.target, rules[k](e.target.value.trim()))));

$("#form").onsubmit = e => {
  e.preventDefault();
  const ok = Object.keys(rules).map(k => setErr($("#"+k), rules[k]($("#"+k).value.trim()))).every(Boolean);
  if(!ok) return;
  const ev = EVENTS.find(x => x.id === +$("#eventSel").value);
  const email = $("#email").value.trim().toLowerCase();
  const regs = store.get();
  if (regs.some(r => r.email===email && r.eventId===ev.id)) return setErr($("#email"), "This email is already registered for this event.");
  regs.push({eventId:ev.id, name:$("#name").value.trim(), email, phone:$("#phone").value.replace(/[\s-]/g,""), at:Date.now()});
  store.set(regs);
  $("#form").hidden = true;
  $("#confirm").hidden = false;
  $("#confirm").textContent = `🎉 Thank you, ${$("#name").value.trim()}! You're registered for "${ev.name}". A confirmation will be sent to ${email}.`;
  renderRegs();
};

// Registrations (Local Storage)
function renderRegs(){
  const regs = store.get();
  $("#regList").innerHTML = regs.length ? regs.map((r,i) => {
    const ev = EVENTS.find(e => e.id===r.eventId);
    return `<li><span><b>${ev.name}</b><br><span class="meta">${r.name} · ${r.email} · ${fmt(ev.date)}</span></span><button data-del="${i}">Cancel</button></li>`;
  }).join("") : `<li><span class="meta">No registrations yet. Pick an event above!</span></li>`;
}
$("#regList").onclick = e => {
  const b = e.target.closest("[data-del]"); if(!b) return;
  const regs = store.get(); regs.splice(+b.dataset.del,1); store.set(regs); renderRegs();
};

// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(x => x.isIntersecting && x.target.classList.add("show")), {threshold:.15});
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

render(); renderRegs();
