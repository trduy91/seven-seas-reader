const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const storyId=params.get("story");
const pageSize=20;
let story=null;
function pageUrl(page){return `./chapters.html?story=${encodeURIComponent(storyId)}&page=${page}`;}
function renderPagination(totalPages,current){
 const nav=$("pagination"); nav.innerHTML="";
 if(totalPages<=1)return;
 const add=(label,page,disabled=false,currentPage=false)=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.disabled=disabled;if(currentPage)b.setAttribute("aria-current","page");b.addEventListener("click",()=>{location.href=pageUrl(page);});nav.append(b);};
 add("←",current-1,current===1);
 const first=Math.max(1,current-2),last=Math.min(totalPages,current+2);
 if(first>1){add("1",1);if(first>2){const dots=document.createElement("span");dots.textContent="…";nav.append(dots);}}
 for(let p=first;p<=last;p++)add(String(p),p,false,p===current);
 if(last<totalPages){if(last<totalPages-1){const dots=document.createElement("span");dots.textContent="…";nav.append(dots);}add(String(totalPages),totalPages);}
 add("→",current+1,current===totalPages);
}
async function init(){
 try{
  const response=await fetch("./data/catalog.json");if(!response.ok)throw Error("catalog");
  const data=await response.json();story=(data.stories||[]).find(s=>s.id===storyId);
  if(!story)throw Error("story");
  const chapters=story.chapters||[];const totalPages=Math.max(1,Math.ceil(chapters.length/pageSize));
  const current=Math.min(totalPages,Math.max(1,Number.parseInt(params.get("page")||"1",10)||1));
  $("story-title").textContent=story.title;$("story-description").textContent=story.description||"";
  $("chapter-count").textContent=chapters.length+" CHƯƠNG";
  const visible=chapters.slice((current-1)*pageSize,current*pageSize);
  $("chapter-list").innerHTML=visible.length?visible.map((c,i)=>{const n=(current-1)*pageSize+i;const chapterNumber=c.chapter_number||String(n+1).padStart(3,"0");return `<a class="chapter-card" href="./reader.html?story=${encodeURIComponent(story.id)}&chapter=${n}"><span class="chapter-number">${chapterNumber}</span><span class="chapter-card-copy"><h2>${escapeHtml(c.title||"Chương "+chapterNumber)}</h2><p>CHƯƠNG ${chapterNumber}</p></span><span class="chapter-arrow">→</span></a>`;}).join(""):'<p class="loading">Series này chưa có chương được xuất bản.</p>';
  renderPagination(totalPages,current);
 }catch{$("story-title").textContent="Không tìm thấy series";$("story-description").textContent="Vui lòng quay lại thư viện và chọn một series hợp lệ.";$("chapter-list").innerHTML='<p class="loading">Không thể tải danh sách chương.</p>';}
}
function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
init();