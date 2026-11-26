const $=id=>document.getElementById(id);
let stories=[];
const statusLabels={ongoing:"ĐANG VIẾT",completed:"HOÀN THÀNH",planned:"SẮP RA MẮT"};
const escapeHtml=(value="")=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function renderStories(){
 const query=$("search").value.trim().toLocaleLowerCase("vi");
 const status=$("status-filter").value;
 const filtered=stories.filter(s=>(status==="all"||s.status===status)&&[s.title,s.subtitle,s.description,...(s.tags||[])].join(" ").toLocaleLowerCase("vi").includes(query));
 $("library-count").textContent=`${filtered.length} / ${stories.length} SERIES`;
 $("empty-state").hidden=filtered.length!==0;
 $("story-grid").innerHTML=filtered.map((s,i)=>`<article class="story-card" data-number="${String(i+1).padStart(2,"0")}"><div class="card-kicker">${escapeHtml(s.subtitle||"SEVEN SEAS ORIGINAL")}</div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description||"")}</p><div class="card-bottom"><span class="status">${statusLabels[s.status]||"SERIES"} · ${(s.chapters||[]).length} CHƯƠNG</span><a class="read-link" href="./chapters.html?story=${encodeURIComponent(s.id)}">XEM CHƯƠNG ↗</a></div></article>`).join("");
}
async function init(){
 $("search").addEventListener("input",renderStories);
 $("status-filter").addEventListener("change",renderStories);
 try{const response=await fetch("./data/catalog.json");if(!response.ok)throw Error("catalog");const data=await response.json();stories=data.stories||[];renderStories();}
 catch{$("library-count").textContent="LIBRARY UNAVAILABLE";$("story-grid").innerHTML='<p class="loading">Không thể tải thư viện. Vui lòng tải lại trang sau.</p>';}
}
init();