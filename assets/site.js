// Sidebar, in-page TOC, pager and theme toggle shared by every page.
(function () {
  var PAGES = [
    { group: "导读" },
    { href: "index.html", title: "本章导读", ppt: "1–7" },
    { group: "第一节 人类社会的存在与发展" },
    { href: "1-1.html", title: "社会存在与社会意识", ppt: "8–68" },
    { href: "1-2.html", title: "社会基本矛盾及其运动规律", ppt: "69–101" },
    { href: "1-3.html", title: "人类普遍交往与世界历史", ppt: "102–122" },
    { href: "1-4.html", title: "社会进步与社会形态更替", ppt: "123–141" },
    { href: "1-5.html", title: "文明及其多样性", ppt: "142–147" },
    { group: "第二节 社会历史发展的动力" },
    { href: "2-1.html", title: "社会基本矛盾是根本动力", ppt: "148–167" },
    { href: "2-2.html", title: "阶级斗争、社会革命与改革", ppt: "168–186" },
    { href: "2-3.html", title: "科学技术与文化的作用", ppt: "187–208" },
    { group: "第三节 人民群众在历史发展中的作用" },
    { href: "3-1.html", title: "人民群众、个人与政党领袖", ppt: "209–243" },
    { group: "收尾" },
    { href: "review.html", title: "综合练习与本章小结", ppt: "244–282" }
  ];

  var here = location.pathname.split("/").pop() || "index.html";
  var pages = PAGES.filter(function (p) { return p.href; });
  var idx = pages.findIndex(function (p) { return p.href === here; });

  // ---- theme ----
  function getTheme() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }
  function setTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
    try { t ? localStorage.setItem("theme", t) : localStorage.removeItem("theme"); } catch (e) {}
  }
  setTheme(getTheme());

  // ---- sidebar ----
  var side = document.createElement("nav");
  side.className = "side";
  var html = '<div class="book">马克思主义基本原理 · 自学讲义</div>' +
    '<a class="chap" href="index.html">第三章　人类社会及其发展规律</a>';
  var open = false;
  PAGES.forEach(function (p) {
    if (p.group) {
      if (open) html += "</ol>";
      html += '<div class="group">' + p.group + "</div><ol>";
      open = true;
      return;
    }
    var cur = p.href === here;
    html += '<li' + (cur ? ' class="cur"' : "") + '><a href="' + p.href + '"><span>' + p.title +
      '</span><span class="r">PPT ' + p.ppt + "</span></a>" + (cur ? '<div class="toc" id="toc"></div>' : "") + "</li>";
  });
  if (open) html += "</ol>";
  html += '<div class="tools">外观：<button type="button" id="themeBtn"></button></div>';
  side.innerHTML = html;
  document.body.insertBefore(side, document.body.firstChild);

  // ---- mobile top bar ----
  var bar = document.createElement("div");
  bar.className = "topbar";
  bar.innerHTML = '<button type="button" id="navBtn">目录</button><span>' +
    (idx >= 0 ? pages[idx].title : "第三章") + "</span>";
  document.body.insertBefore(bar, side.nextSibling);
  document.getElementById("navBtn").onclick = function (e) {
    e.stopPropagation();
    document.body.classList.toggle("nav-open");
  };
  document.addEventListener("click", function (e) {
    if (document.body.classList.contains("nav-open") && !side.contains(e.target)) document.body.classList.remove("nav-open");
  });

  var themeBtn = document.getElementById("themeBtn");
  function label() {
    var t = getTheme();
    themeBtn.textContent = t === "dark" ? "深色" : t === "light" ? "浅色" : "跟随系统";
  }
  themeBtn.onclick = function () {
    var t = getTheme();
    setTheme(t === null ? "light" : t === "light" ? "dark" : null);
    label();
  };
  label();

  // ---- in-page toc (h2) ----
  var toc = document.getElementById("toc");
  var heads = Array.prototype.slice.call(document.querySelectorAll("main h2"));
  heads.forEach(function (h, i) {
    if (!h.id) h.id = "s" + (i + 1);
    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    a.onclick = function () { document.body.classList.remove("nav-open"); };
    if (toc) toc.appendChild(a);
  });
  if (toc && "IntersectionObserver" in window) {
    var links = toc.querySelectorAll("a");
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle("on", l.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    heads.forEach(function (h) { io.observe(h); });
  }

  // ---- pager ----
  var page = document.querySelector("main .page");
  if (page && idx >= 0) {
    var pg = document.createElement("div");
    pg.className = "pager";
    var s = "";
    if (idx > 0) s += '<a href="' + pages[idx - 1].href + '"><span class="lbl">上一页</span>' + pages[idx - 1].title + "</a>";
    if (idx < pages.length - 1) s += '<a class="next" href="' + pages[idx + 1].href + '"><span class="lbl">下一页</span>' + pages[idx + 1].title + "</a>";
    pg.innerHTML = s;
    page.appendChild(pg);
  }
})();
