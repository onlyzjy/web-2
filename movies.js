/* 板块4：海报圈 —— 按住左右拖动即可旋转（对应参考图 SCROLL / DRAG TO ROTATE） */
(function () {
    'use strict';
    function init() {
        var ring = document.getElementById('filmRing');
        if (!ring) return;

        var spin = 0;
        var isDown = false, startX = 0, startSpin = 0;

        function render() {
            ring.style.setProperty('--spin', spin + 'deg');
        }

        ring.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'touch') {
                // 触屏：记录起点，在 pointermove 里旋转
            }
            isDown = true;
            startX = e.clientX;
            startSpin = spin;
            ring.classList.add('dragging');
            ring.setPointerCapture(e.pointerId);
            e.preventDefault();
        });

        ring.addEventListener('pointermove', function (e) {
            if (!isDown) return;
            spin = startSpin + (e.clientX - startX) * 0.25;
            render();
        });

        function endDrag() {
            isDown = false;
            ring.classList.remove('dragging');
        }
        ring.addEventListener('pointerup', endDrag);
        ring.addEventListener('pointercancel', endDrag);

        // 滚轮也可旋转
        ring.addEventListener('wheel', function (e) {
            e.preventDefault();
            spin += (e.deltaY + e.deltaX) * 0.15;
            render();
        }, { passive: false });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
