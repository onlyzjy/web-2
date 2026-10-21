/* 作品集：缩略图切换大图（默认第 1 张，对应参考图的第 3 张素材） */
(function () {
    "use strict";

    var works = [
        { src: "gallery-1.jpg", alt: "体育馆木地板上的灯带与光" },
        { src: "gallery-2.jpg", alt: "用画着大眼睛的手机壳挡住脸" },
        { src: "gallery-3.jpg", alt: "海边小屋与浅滩" },
        { src: "gallery-4.jpg", alt: "网球场主题的拍立得拼贴" },
        { src: "gallery-5.jpg", alt: "贴在墙上的期待海报" },
        { src: "gallery-6.jpg", alt: "蓝色小狮子头套" },
        { src: "gallery-7.jpg", alt: "心形挂网照片墙" },
        { src: "gallery-8.jpg", alt: "玻璃盒里的小猫曲奇" }
    ];

    var img = document.getElementById("showcase-img");
    var thumbsBox = document.getElementById("thumbs");
    var dotsBox = document.getElementById("dots");
    var counter = document.getElementById("counter");

    if (!img || !thumbsBox || !dotsBox || !counter) {
        return;
    }

    var current = 0;

    function show(index) {
        current = index;
        img.src = works[index].src;
        img.alt = works[index].alt;

        var thumbs = thumbsBox.children;
        var dots = dotsBox.children;
        for (var k = 0; k < works.length; k++) {
            thumbs[k].classList.toggle("is-active", k === index);
            dots[k].classList.toggle("is-active", k === index);
        }
        counter.textContent = (index + 1) + " / " + works.length;
    }

    works.forEach(function (item, i) {
        var thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "thumb" + (i === current ? " is-active" : "");
        thumb.setAttribute("aria-label", "查看第 " + (i + 1) + " 张作品");

        var preview = document.createElement("img");
        preview.src = item.src;
        preview.alt = "";
        preview.loading = "lazy";
        thumb.appendChild(preview);

        thumb.addEventListener("click", function () {
            show(i);
        });
        thumbsBox.appendChild(thumb);

        var dot = document.createElement("i");
        dot.className = "dot" + (i === current ? " is-active" : "");
        dotsBox.appendChild(dot);
    });

    /* 左右方向键翻页 */
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
            show((current + 1) % works.length);
        } else if (event.key === "ArrowLeft") {
            show((current - 1 + works.length) % works.length);
        }
    });
})();
