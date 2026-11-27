const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const storyId=params.get("story");
const chapterIndex=Number.parseInt(params.get("chapter")||"0",10);
const escapeHtml=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function imageMarkup(alt,src,baseUrl){
 try{
  const url=new URL(src.trim(),baseUrl);
  if(!["http:","https:"].includes(url.protocol))return escapeHtml(alt);
  return `<figure class="reader-illustration"><img src="${escapeHtml(url.href)}" alt="${escapeHtml(alt)}" loading="lazy"><figcaption>${escapeHtml(alt)}</figcaption></figure>`;
 }catch{return escapeHtml(alt);}
}
function inlineMarkdown(s,baseUrl){
 const images=[];
 const withTokens=String(s).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(_,alt,src)=>{
  const token=`__READER_IMAGE_${images.length}__`;
  images.push(imageMarkup(alt,src,baseUrl));
  return token;
 });
 let html=escapeHtml(withTokens);
 images.forEach((markup,i)=>{html=html.replace(`__READER_IMAGE_${i}__`,markup);});
 return html.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>");
}
function markdownToHtml(md,baseUrl){
 return String(md).replace(/\r/g,"").split(/\n\s*\n/).map(block=>{
  const t=block.trim();if(!t)return"";
  if(/^### /.test(t))return `<h3>${inlineMarkdown(t.slice(4),baseUrl)}</h3>`;
  if(/^## /.test(t))return `<h2>${inlineMarkdown(t.slice(3),baseUrl)}</h2>`;
  if(/^# /.test(t))return `<h2>${inlineMarkdown(t.slice(2),baseUrl)}</h2>`;
  if(/^>/.test(t))return `<blockquote>${inlineMarkdown(t.replace(/^>\s?/gm,"").replace(/\n/g," "),baseUrl)}</blockquote>`;
  if(/^!\[[^\]]*\]\([^)]+\)$/.test(t))return inlineMarkdown(t,baseUrl);
  if(/^(?:[-*] .+\n?)+$/.test(t))return `<ul>${t.split("\n").filter(line=>/^[-*] /.test(line)).map(line=>`<li>${inlineMarkdown(line.slice(2),baseUrl)}</li>`).join("")}</ul>`;
  if(/^(?:\d+\. .+\n?)+$/.test(t))return `<ol>${t.split("\n").filter(line=>/^\d+\. /.test(line)).map(line=>`<li>${inlineMarkdown(line.replace(/^\d+\. /,""),baseUrl)}</li>`).join("")}</ol>`;
  if(/^(---|\*\*\*)$/.test(t))return"<hr>";
  return `<p>${inlineMarkdown(t,baseUrl).replace(/\n/g,"<br>")}</p>`;
 }).join("\n");
}
function setNav(id,index,story,chapters,label){const a=$(id);if(index<0||index>=chapters.length){a.setAttribute("aria-disabled","true");a.removeAttribute("href");return;}a.setAttribute("aria-disabled","false");a.href=`./reader.html?story=${encodeURIComponent(story.id)}&chapter=${index}`;a.textContent=label;}
async function init(){
 try{
  const response=await fetch("./data/catalog.json");if(!response.ok)throw Error("catalog");const data=await response.json();
  const story=(data.stories||[]).find(s=>s.id===storyId);if(!story)throw Error("story");
  const chapters=story.chapters||[];if(!Number.isInteger(chapterIndex)||chapterIndex<0||chapterIndex>=chapters.length)throw Error("chapter");
  const chapter=chapters[chapterIndex];$("reader-series").textContent=story.title.toUpperCase();$("chapter-title").textContent=chapter.title||"Chương "+(chapterIndex+1);
  $("chapter-meta").textContent="CHƯƠNG "+(chapter.chapter_number||String(chapterIndex+1).padStart(3,"0"));
  const listUrl=`./chapters.html?story=${encodeURIComponent(story.id)}&page=${Math.floor(chapterIndex/20)+1}`;
  $("back-to-chapters").href=listUrl;$("chapter-index-link").href=listUrl;
  setNav("prev-chapter",chapterIndex-1,story,chapters,"← Chương trước");setNav("next-chapter",chapterIndex+1,story,chapters,"Chương tiếp →");setNav("prev-chapter-top",chapterIndex-1,story,chapters,"← Chương trước");setNav("next-chapter-top",chapterIndex+1,story,chapters,"Chương tiếp →");
  const chapterUrl=new URL(chapter.file,location.href);
  const content=await fetch(chapterUrl);if(!content.ok)throw Error("chapter file");
  $("chapter-content").innerHTML=markdownToHtml(await content.text(),chapterUrl.href);
 }catch{$("chapter-title").textContent="Không thể mở chương";$("chapter-content").innerHTML="<p>Chương không tồn tại hoặc nội dung chưa được xuất bản. Hãy quay lại mục lục chương.</p>";}
}
const backToTop=$("back-to-top");
if(backToTop){
 const updateBackToTop=()=>backToTop.classList.toggle("is-visible",window.scrollY>420);
 window.addEventListener("scroll",updateBackToTop,{passive:true});
 backToTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
 updateBackToTop();
}
init();
