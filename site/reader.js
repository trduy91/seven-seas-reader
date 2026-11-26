const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const storyId=params.get("story");
const chapterIndex=Number.parseInt(params.get("chapter")||"0",10);
const escapeHtml=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function inlineMarkdown(s){return escapeHtml(s).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>");}
function markdownToHtml(md){return String(md).replace(/\r/g,"").split(/\n\s*\n/).map(block=>{const t=block.trim();if(!t)return"";if(/^### /.test(t))return `<h3>${inlineMarkdown(t.slice(4))}</h3>`;if(/^## /.test(t))return `<h2>${inlineMarkdown(t.slice(3))}</h2>`;if(/^# /.test(t))return `<h2>${inlineMarkdown(t.slice(2))}</h2>`;if(/^>/.test(t))return `<blockquote>${inlineMarkdown(t.replace(/^>\s?/gm,"").replace(/\n/g," "))}</blockquote>`;if(/^(---|\*\*\*)$/.test(t))return"<hr>";return `<p>${inlineMarkdown(t).replace(/\n/g,"<br>")}</p>`;}).join("\n");}
function setNav(id,index,story,chapters,label){const a=$(id);if(index<0||index>=chapters.length){a.setAttribute("aria-disabled","true");a.removeAttribute("href");return;}a.setAttribute("aria-disabled","false");a.href=`./reader.html?story=${encodeURIComponent(story.id)}&chapter=${index}`;a.textContent=label;}
async function init(){
 try{
  const response=await fetch("./data/catalog.json");if(!response.ok)throw Error("catalog");const data=await response.json();
  const story=(data.stories||[]).find(s=>s.id===storyId);if(!story)throw Error("story");
  const chapters=story.chapters||[];if(!Number.isInteger(chapterIndex)||chapterIndex<0||chapterIndex>=chapters.length)throw Error("chapter");
  const chapter=chapters[chapterIndex];$("reader-series").textContent=story.title.toUpperCase();$("chapter-title").textContent=chapter.title||"Chương "+(chapterIndex+1);
  $("chapter-meta").textContent="CHƯƠNG "+String(chapterIndex+1).padStart(2,"0")+" / "+String(chapters.length).padStart(2,"0");
  const listUrl=`./chapters.html?story=${encodeURIComponent(story.id)}&page=${Math.floor(chapterIndex/20)+1}`;
  $("back-to-chapters").href=listUrl;$("chapter-index-link").href=listUrl;
  setNav("prev-chapter",chapterIndex-1,story,chapters,"← Chương trước");setNav("next-chapter",chapterIndex+1,story,chapters,"Chương tiếp →");
  const content=await fetch(new URL(chapter.file,location.href));if(!content.ok)throw Error("chapter file");
  $("chapter-content").innerHTML=markdownToHtml(await content.text());
 }catch{$("chapter-title").textContent="Không thể mở chương";$("chapter-content").innerHTML="<p>Chương không tồn tại hoặc nội dung chưa được xuất bản. Hãy quay lại mục lục chương.</p>";}
}
init();