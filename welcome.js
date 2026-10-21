/* 开始页：点击按钮后淡出再跳转主页 */
(function () {
    "use strict";

    var link = document.querySelector(".splash-btn");
    var body = document.body;

    if (!link) {
        return;
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var target = link.getAttribute("href");
    var leaving = false;

    link.addEventListener("click", function (event) {
        event.preventDefault();

        if (leaving) {
            return;
        }
        leaving = true;

        if (reduceMotion) {
            window.location.href = target;
            return;
        }

        body.classList.add("is-leaving");
        window.setTimeout(function () {
            window.location.href = target;
        }, 420);
    });
})();
