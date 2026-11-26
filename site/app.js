const $ = (id) => document.getElementById(id);
let stories = [];
let activeStory = null;
let activeChapterIndex = 0;

const statusLabels = { ongoing: "ĐANG VIẾT", completed: "HOÀN THÀNH", planned: "SẮP RA MẮT" };
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);

function renderStories() {
  const query = $("search").value.trim().toLocaleLowerCase("vi");
  const status = $("status-filter").value;
  const filtered = stories.filter(s => (status === "all" || s.status === status) &&
    [s.title, s.subtitle, s.description, ...(s.tags || [])].join(" ").toLocaleLowerCase("vi").includes(query));
  $("library-count").textContent = `${filtered.length} / ${stories.length} SERIES`;
  $("empty-state").hidden = filtered.length !== 0;
  $("story-grid").innerHTML = filtered.map((s, i) => `
    <article class="story-card" data-number="${String(i+1).padStart(2,"0")}">
      <div class="card-kicker">${escapeHtml(s.subtitle || "SEVEN SEAS ORIGINAL")}</div>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.description || "")}</p>
      <div class="card-bottom"><span class="status">${statusLabels[s.status] || "SERIES"} · ${(s.chapters || []).length} CHƯƠNG</span><a class="read-link" href="./chapters.html?story=${encodeURIComponent(s.id)}">ĐỌC TRUYỆN ↗</a></div>
    </article>`).join("");

}

function markdownToHtml(markdown) {
  const blocks = String(markdown).replace(/\r/g, "").split(/\n\s*\n/);
  return blocks.map(block => {
    const t = block.trim();
    if (!t) return "";
    if (/^### /.test(t)) return `<h3>${inlineMarkdown(t.slice(4))}</h3>`;
    if (/^## /.test(t)) return `<h2>${inlineMarkdown(t.slice(3))}</h2>`;
    if (/^# /.test(t)) return `<h2>${inlineMarkdown(t.slice(2))}</h2>`;
    if (/^>/.test(t)) return `<blockquote>${inlineMarkdown(t.replace(/^>\s?/gm, "").replace(/\n/g, " "))}</blockquote>`;
    if (/^(---|\*\*\*)$/.test(t)) return "<hr>";
    return `<p>${inlineMarkdown(t).replace(/\n/g, "<br>")}</p>`;
  }).join("\n");
}
function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

async function openStory(id) {
  activeStory = stories.find(s => s.id === id);
  if (!activeStory) return;
  $("reader-series").textContent = "SEVEN SEAS · " + (activeStory.subtitle || "ORIGINAL SERIES").toUpperCase();
  $("reader-title").textContent = activeStory.title;
  $("reader").showModal();
  renderChapterList();
  if ((activeStory.chapters || []).length) await openChapter(0);
  else {
    $("chapter-title").textContent = "Sắp ra mắt";
    $("chapter-meta").textContent = "COMING SOON";
    $("chapter-content").innerHTML = "<p>Nội dung câu chuyện sẽ được cập nhật tại đây. Hãy quay lại trong những chuyến thám hiểm tiếp theo.</p>";
    updateNavigation();
  }
}
function renderChapterList() {
  const chapters = activeStory.chapters || [];
  $("chapter-select").innerHTML = chapters.map((c, i) => `<option value="${i}">${escapeHtml(c.title || `Chương ${i+1}`)}</option>`).join("");
  $("chapter-select").value = String(activeChapterIndex);
  $("chapter-list").innerHTML = chapters.map((c, i) =>
    `<button class="chapter-item ${i === activeChapterIndex ? "active" : ""}" data-chapter="${i}">${escapeHtml(c.title || `Chương ${i+1}`)}</button>`).join("");
  $("chapter-list").querySelectorAll("[data-chapter]").forEach(b => b.addEventListener("click", () => openChapter(Number(b.dataset.chapter))));
}
async function openChapter(index) {
  const chapters = activeStory.chapters || [];
  if (index < 0 || index >= chapters.length) return;
  activeChapterIndex = index;
  const chapter = chapters[index];
  $("chapter-title").textContent = chapter.title || `Chương ${index+1}`;
  $("chapter-meta").textContent = `${activeStory.title.toUpperCase()}  /  CHAPTER ${String(index+1).padStart(2,"0")}`;
  $("chapter-content").innerHTML = "<p>Đang tải chương…</p>";
  renderChapterList();
  $("chapter-select").value = String(index);
  try {
    const response = await fetch(chapter.file);
    if (!response.ok) throw new Error("Chapter not found");
    $("chapter-content").innerHTML = markdownToHtml(await response.text());
  } catch {
    $("chapter-content").innerHTML = "<p>Không thể tải nội dung chương. Vui lòng thử lại sau.</p>";
  }
  updateNavigation();
  $("reader").querySelector(".reading-pane").scrollTop = 0;
}
function updateNavigation() {
  const count = (activeStory?.chapters || []).length;
  for (const id of ["prev-chapter", "prev-chapter-top"]) $(id).disabled = activeChapterIndex <= 0;
  for (const id of ["next-chapter", "next-chapter-top"]) $(id).disabled = activeChapterIndex >= count - 1;
  if ($("chapter-select").options.length) $("chapter-select").value = String(activeChapterIndex);
}
$("search").addEventListener("input", renderStories);
$("status-filter").addEventListener("change", renderStories);
$("close-reader").addEventListener("click", () => $("reader").close());
$("prev-chapter").addEventListener("click", () => openChapter(activeChapterIndex - 1));
$("next-chapter").addEventListener("click", () => openChapter(activeChapterIndex + 1));
$("prev-chapter-top").addEventListener("click", () => openChapter(activeChapterIndex - 1));
$("next-chapter-top").addEventListener("click", () => openChapter(activeChapterIndex + 1));
$("chapter-select").addEventListener("change", e => openChapter(Number(e.target.value)));
$("reader-index").addEventListener("click", () => { $("reader").close(); document.getElementById("library").scrollIntoView(); });
$("reader").addEventListener("click", e => { if (e.target === $("reader")) $("reader").close(); });

async function init() {
  try {
    const response = await fetch("./data/catalog.json");
    if (!response.ok) throw new Error("Catalog unavailable");
    const data = await response.json();
    stories = data.stories || [];
    renderStories();
  } catch {
    $("library-count").textContent = "LIBRARY UNAVAILABLE";
    $("story-grid").innerHTML = '<p class="loading">Không thể tải thư viện. Vui lòng tải lại trang sau.</p>';
  }
}
init();