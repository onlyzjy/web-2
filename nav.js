/* 导航栏交互：滚动状态、当前板块高亮、移动端菜单 */
(function () {
    "use strict";

    var header = document.querySelector(".site-header");
    var nav = document.getElementById("site-nav");
    var toggle = document.querySelector(".nav-toggle");

    if (!header || !nav || !toggle) {
        return;
    }

    var links = Array.prototype.slice.call(nav.querySelectorAll(".nav-link"));
    var sections = links
        .map(function (link) {
            var target = document.querySelector(link.getAttribute("href"));
            return target ? { link: link, section: target } : null;
        })
        .filter(Boolean);

    /* ---------- 移动端菜单 ---------- */
    function setMenu(open) {
        nav.classList.toggle("is-open", open);
        toggle.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
    }

    toggle.addEventListener("click", function () {
        setMenu(!nav.classList.contains("is-open"));
    });

    links.forEach(function (link) {
        link.addEventListener("click", function () {
            setMenu(false);
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setMenu(false);
        }
    });

    document.addEventListener("click", function (event) {
        if (!nav.classList.contains("is-open")) {
            return;
        }
        if (!nav.contains(event.target) && !toggle.contains(event.target)) {
            setMenu(false);
        }
    });

    /* ---------- 当前板块高亮 ---------- */
    function setActive(id) {
        links.forEach(function (link) {
            var active = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", active);
            if (active) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function update() {
        /* 滚动后切换导航栏背景 */
        header.classList.toggle("is-scrolled", window.scrollY > 8);

        if (!sections.length) {
            return;
        }

        /* 以导航栏下沿为参考线，取最后一个越过参考线的板块 */
        var line = header.offsetHeight + 24;
        var current = sections[0];
        sections.forEach(function (item) {
            if (item.section.getBoundingClientRect().top <= line) {
                current = item;
            }
        });

        /* 滚动到底部时，最后一块可能永远越不过参考线，这里兜底 */
        var atBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 4;
        if (atBottom) {
            current = sections[sections.length - 1];
        }

        setActive(current.section.id || "top");
    }

    var ticking = false;
    function onScroll() {
        if (ticking) {
            return;
        }
        ticking = true;
        window.requestAnimationFrame(function () {
            update();
            ticking = false;
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
        if (window.innerWidth > 640) {
            setMenu(false);
        }
        onScroll();
    });

    /* ---------- 品牌欢迎语：打字机 ---------- */
    var brandPrefix = document.querySelector(".brand-prefix");
    var brandName = document.querySelector(".brand-name");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (brandPrefix && brandName && !reduceMotion) {
        var pieces = [brandPrefix, brandName];
        var fullText = pieces.map(function (el) {
            return el.textContent;
        });
        var speed = 90;

        /* 先把文字清空，再逐字敲回来 */
        pieces.forEach(function (el) {
            el.textContent = "";
        });

        var pieceIndex = 0;
        var charIndex = 0;

        var type = function () {
            if (pieceIndex >= pieces.length) {
                return;
            }

            var text = fullText[pieceIndex];
            charIndex += 1;
            pieces[pieceIndex].textContent = text.slice(0, charIndex);

            if (charIndex < text.length) {
                window.setTimeout(type, speed);
            } else {
                pieceIndex += 1;
                charIndex = 0;
                /* 两段之间稍作停顿 */
                window.setTimeout(type, 220);
            }
        };

        window.setTimeout(type, 300);
    }

    /* 内容里有 #top 的 body 与各 section，首次进入先同步一次 */
    update();
})();
