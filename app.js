
const W=1030, H=839;
const stopPts=[{x:151,y:599},{x:346,y:361},{x:635,y:349},{x:889,y:552}];
const routes=[{a:{x:179.52,y:564.19},b:{x:311.14,y:403.54}},{a:{x:390.96,y:359.13},b:{x:580.05,y:351.28}},{a:{x:670.15,y:377.09},b:{x:846.04,y:517.66}}];

const pages=[...document.querySelectorAll(".page")];
const startBtn=document.getElementById("start");
const navMap=document.getElementById("navMap");
const walker=document.getElementById("gardenWalker");
const ring=document.getElementById("ring");
const gardenStatus=document.getElementById("gardenStatus");
const segs=[document.getElementById("seg12"),document.getElementById("seg23"),document.getElementById("seg34")];
const hotspots=[...document.querySelectorAll(".svg-hotspot")];

let unlocked=1;
let moving=false;

function showPage(id){
  pages.forEach(p=>p.classList.toggle("active",p.id===id));
  if(navMap) navMap.style.visibility=id==="intro" ? "hidden" : "visible";
  window.scrollTo({top:0,behavior:"smooth"});
}

function setLine(el,r){
  if(!el) return;
  el.setAttribute("x1",r.a.x);
  el.setAttribute("y1",r.a.y);
  el.setAttribute("x2",r.b.x);
  el.setAttribute("y2",r.b.y);
}
routes.forEach((r,i)=>setLine(segs[i],r));

function ringAt(stopNum){
  if(!ring) return;
  const p=stopPts[stopNum-1];
  ring.setAttribute("cx",p.x);
  ring.setAttribute("cy",p.y);
  ring.classList.remove("pulse");
  void ring.getBBox();
  ring.classList.add("pulse");
}

function updateLocks(){
  hotspots.forEach((h,i)=>{
    const stopNum=i+1;
    const available=stopNum<=unlocked;
    h.classList.toggle("locked",!available);
    h.setAttribute("tabindex",available ? "0" : "-1");

    const cover=document.querySelector(".cover"+stopNum);
    if(cover) cover.classList.toggle("unlocked",available);
  });
}

function openStop(stopNum){
  if(moving || stopNum>unlocked) return;
  showPage("stop"+stopNum);
}

hotspots.forEach(h=>{
  const n=Number(h.dataset.stop);
  h.addEventListener("click",()=>openStop(n));
  h.addEventListener("keydown",e=>{
    if(e.key==="Enter" || e.key===" "){
      e.preventDefault();
      openStop(n);
    }
  });
});

function bootAssetForSegment(i){
  return `assets/boots-${i+1}.png`;
}
function cssPos(point){
  return {left:(point.x/W*100)+"%",top:(point.y/H*100)+"%"};
}
function parkBootAt(point){
  if(!walker) return;
  const p=cssPos(point);
  walker.style.left=p.left;
  walker.style.top=p.top;
}

function unlock(stopNum){
  unlocked=Math.max(unlocked,stopNum);
  updateLocks();
  ringAt(stopNum);
}

function walkToNext(fromStop){
  const routeIndex=fromStop-1;
  const nextStop=fromStop+1;

  if(nextStop>4){
    showPage("finish");
    return;
  }

  moving=true;
  gardenStatus.textContent=`Walking to Stop ${nextStop}…`;

  const route=routes[routeIndex];
  walker.src=bootAssetForSegment(routeIndex);
  parkBootAt(route.a);

  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    parkBootAt(route.b);
  }));

  const delay=matchMedia("(prefers-reduced-motion: reduce)").matches?70:1500;
  setTimeout(()=>{
    moving=false;
    unlock(nextStop);
    if(nextStop<4) walker.src=bootAssetForSegment(nextStop-1);
    const labels=["tomatoes","cucumbers","peppers","tender planting"];
    gardenStatus.textContent=`Stop ${nextStop} is ready. Select the ${labels[nextStop-1]} to continue.`;
  },delay);
}

// Question feedback.
document.querySelectorAll(".question").forEach(q=>{
  const correct=Number(q.dataset.correct);
  q.querySelectorAll(".choices button").forEach((btn,i)=>{
    btn.addEventListener("click",()=>{
      q.querySelectorAll(".choices button").forEach(x=>x.classList.remove("good","bad"));
      const ok=i===correct;
      btn.classList.add(ok ? "good" : "bad");
      q.querySelector(".feedback").innerHTML=ok
        ? "<b>Best supported.</b> "+q.dataset.explain
        : "Look again at the plant symptoms and weather clues. Which explanation is best supported by both?";
      q.querySelector(".climate").classList.toggle("hidden",!ok);

      const returnBtn=q.closest(".scenario").querySelector(".return");
      if(ok && returnBtn) returnBtn.classList.remove("hidden");
    });
  });
});

// Return to garden after each completed scenario.
document.querySelectorAll(".return").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const n=Number(btn.dataset.n);

    if(n===4){
      showPage("finish");
      return;
    }

    showPage("map");
    setTimeout(()=>walkToNext(n),220);
  });
});

if(startBtn){
  startBtn.addEventListener("click",()=>{
    unlocked=1;
    moving=false;
    updateLocks();
    ringAt(1);
    parkBootAt(routes[0].a);
    walker.src=bootAssetForSegment(0);
    gardenStatus.textContent="Stop 1 is ready. Select the tomatoes to begin.";
    showPage("map");
  });
}

if(navMap){
  navMap.addEventListener("click",()=>showPage("map"));
}

// Initial locked state.
updateLocks();
ringAt(1);
parkBootAt(routes[0].a);
showPage("intro");
