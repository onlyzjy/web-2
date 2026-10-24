/* 板块4：电影海报墙 —— 鼠标按住左右拖动（触摸板/滚轮也可横向滑动） */
(function () {
    'use strict';
    function init() {
        var track = document.getElementById('filmTrack');
        if (!track) return;

        var isDown = false, startX = 0, startScroll = 0, moved = false;

        track.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'touch') return; // 触屏用原生滚动
            isDown = true;
            moved = false;
            startX = e.clientX;
            startScroll = track.scrollLeft;
            track.classList.add('dragging');
            track.setPointerCapture(e.pointerId);
        });

        track.addEventListener('pointermove', function (e) {
            if (!isDown) return;
            var dx = e.clientX - startX;
            if (Math.abs(dx) > 4) moved = true;
            track.scrollLeft = startScroll - dx;
        });

        function endDrag() {
            isDown = false;
            track.classList.remove('dragging');
        }
        track.addEventListener('pointerup', endDrag);
        track.addEventListener('pointercancel', endDrag);

        // 拖动结束时阻止误触链接（目前海报无链接，预留）
        track.addEventListener('click', function (e) {
            if (moved) { e.preventDefault(); e.stopPropagation(); }
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
