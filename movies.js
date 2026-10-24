/* 板块4：电影海报一排 —— 鼠标按住左右拖动（触屏可直接滑动） */
(function () {
    'use strict';
    function init() {
        var row = document.getElementById('filmRow');
        if (!row) return;

        var isDown = false, startX = 0, startScroll = 0, moved = false;

        row.addEventListener('pointerdown', function (e) {
            isDown = true;
            moved = false;
            startX = e.clientX;
            startScroll = row.scrollLeft;
            row.classList.add('dragging');
            row.setPointerCapture(e.pointerId);
        });

        row.addEventListener('pointermove', function (e) {
            if (!isDown) return;
            var dx = e.clientX - startX;
            if (Math.abs(dx) > 4) moved = true;
            row.scrollLeft = startScroll - dx;
        });

        function endDrag() {
            isDown = false;
            row.classList.remove('dragging');
        }
        row.addEventListener('pointerup', endDrag);
        row.addEventListener('pointercancel', endDrag);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
