/* ============================================================
   网页自定义面板（调色盘 + 布局调整）
   - 点击面板上的「选择元素」后，点击页面任意元素即可选中
   - 可调整：文字颜色、字体大小、位置(上下左右)、整体缩放
   - 所有修改保存在浏览器 localStorage，刷新后自动恢复
   ============================================================ */
(function () {
    'use strict';

    var STORE_KEY = 'site-custom-style';
    var rules = {};          // { selector: {color,fontSize,zoom,dx,dy} }
    var selected = null;     // 当前选中元素
    var pickMode = false;    // 是否处于选择模式
    var panel, info, colorIn, sizeIn, sizeVal, zoomIn, zoomVal, dxIn, dyIn;

    try { rules = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (e) { rules = {}; }

    function save() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(rules)); } catch (e) { }
    }

    /* 生成元素唯一选择器（tag + 第几个同类型兄弟） */
    function selectorOf(el) {
        var parts = [];
        while (el && el !== document.body) {
            var tag = el.tagName.toLowerCase();
            var parent = el.parentElement;
            var idx = 1, sib = el;
            while ((sib = sib.previousElementSibling)) idx++;
            parts.unshift(tag + ':nth-child(' + idx + ')');
            el = parent;
        }
        return 'body>' + parts.join('>');
    }

    /* 把某条规则应用到元素 */
    function apply(el, rule) {
        if (!el || !rule) return;
        if (rule.color) el.style.color = rule.color;
        if (rule.fontSize) el.style.fontSize = rule.fontSize + 'px';
        if (rule.zoom) el.style.zoom = rule.zoom;
        if (rule.left !== undefined) { el.style.position = 'relative'; el.style.left = rule.left + 'px'; }
        if (rule.top !== undefined) { el.style.position = 'relative'; el.style.top = rule.top + 'px'; }
    }

    /* 页面载入时恢复所有已保存的修改 */
    function restoreAll() {
        Object.keys(rules).forEach(function (sel) {
            var el;
            try { el = document.querySelector(sel); } catch (e) { return; }
            if (el) apply(el, rules[sel]);
        });
    }

    /* ---------- 面板 UI ---------- */
    function buildPanel() {
        panel = document.createElement('div');
        panel.id = 'customizer';
        panel.innerHTML =
            '<button id="cz-toggle" title="打开/关闭自定义面板">🎨</button>' +
            '<div id="cz-body">' +
            '<p class="cz-title">自定义面板</p>' +
            '<button id="cz-pick" class="cz-btn">选择元素</button>' +
            '<p id="cz-info" class="cz-info">未选中元素</p>' +
            '<div class="cz-row"><label>文字颜色</label><input type="color" id="cz-color" value="#000000"></div>' +
            '<div class="cz-row"><label>字体大小 <span id="cz-size-val">-</span></label><input type="range" id="cz-size" min="10" max="120" step="1"></div>' +
            '<div class="cz-row"><label>整体大小 <span id="cz-zoom-val">-</span></label><input type="range" id="cz-zoom" min="30" max="250" step="5"></div>' +
            '<div class="cz-row"><label>位置 ←</label><input type="range" id="cz-dx" min="-300" max="300" step="2" value="0"></div>' +
            '<div class="cz-row"><label>位置 ↑</label><input type="range" id="cz-dy" min="-300" max="300" step="2" value="0"></div>' +
            '<div class="cz-btns">' +
            '<button id="cz-reset" class="cz-btn cz-small">重置当前</button>' +
            '<button id="cz-reset-all" class="cz-btn cz-small cz-danger">全部还原</button>' +
            '</div></div>';
        document.body.appendChild(panel);

        info = panel.querySelector('#cz-info');
        colorIn = panel.querySelector('#cz-color');
        sizeIn = panel.querySelector('#cz-size');
        sizeVal = panel.querySelector('#cz-size-val');
        zoomIn = panel.querySelector('#cz-zoom');
        zoomVal = panel.querySelector('#cz-zoom-val');
        dxIn = panel.querySelector('#cz-dx');
        dyIn = panel.querySelector('#cz-dy');

        panel.querySelector('#cz-toggle').addEventListener('click', function () {
            panel.classList.toggle('open');
        });

        panel.querySelector('#cz-pick').addEventListener('click', function () {
            pickMode = !pickMode;
            this.textContent = pickMode ? '取消选择' : '选择元素';
            this.classList.toggle('active', pickMode);
            document.body.classList.toggle('cz-picking', pickMode);
        });

        colorIn.addEventListener('input', function () {
            if (!selected) return;
            selected.style.color = this.value;
            ruleFor(selected).color = this.value;
            save();
        });

        sizeIn.addEventListener('input', function () {
            if (!selected) return;
            selected.style.fontSize = this.value + 'px';
            sizeVal.textContent = this.value + 'px';
            ruleFor(selected).fontSize = +this.value;
            save();
        });

        zoomIn.addEventListener('input', function () {
            if (!selected) return;
            selected.style.zoom = this.value / 100;
            zoomVal.textContent = this.value + '%';
            ruleFor(selected).zoom = this.value / 100;
            save();
        });

        dxIn.addEventListener('input', function () {
            if (!selected) return;
            move(selected, +this.value, null);
        });
        dyIn.addEventListener('input', function () {
            if (!selected) return;
            move(selected, null, +this.value);
        });

        panel.querySelector('#cz-reset').addEventListener('click', function () {
            if (!selected) return;
            var sel = selectorOf(selected);
            delete rules[sel];
            save();
            selected.style.color = '';
            selected.style.fontSize = '';
            selected.style.zoom = '';
            selected.style.left = '';
            selected.style.top = '';
            loadControls(selected);
        });

        panel.querySelector('#cz-reset-all').addEventListener('click', function () {
            if (!confirm('确定要还原全部修改吗？')) return;
            rules = {};
            save();
            location.reload();
        });
    }

    function ruleFor(el) {
        var sel = selectorOf(el);
        if (!rules[sel]) rules[sel] = {};
        return rules[sel];
    }

    /* 平移：记录相对原位置的偏移，刷新后可还原 */
    function move(el, dx, dy) {
        var rule = ruleFor(el);
        if (el.style.position !== 'absolute') {
            el.style.position = 'relative';
        }
        if (dx !== null) { el.style.left = dx + 'px'; rule.left = dx; }
        if (dy !== null) { el.style.top = dy + 'px'; rule.top = dy; }
        save();
    }

    /* 选中元素后，把控件同步为元素当前值 */
    function loadControls(el) {
        var cs = getComputedStyle(el);
        info.textContent = '<' + el.tagName.toLowerCase() + '> ' + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
        colorIn.value = rgbToHex(cs.color);
        sizeIn.value = parseFloat(cs.fontSize);
        sizeVal.textContent = Math.round(parseFloat(cs.fontSize)) + 'px';
        var z = Math.round((parseFloat(el.style.zoom) || 1) * 100);
        zoomIn.value = z;
        zoomVal.textContent = z + '%';
        dxIn.value = parseFloat(el.style.left) || 0;
        dyIn.value = parseFloat(el.style.top) || 0;
    }

    function rgbToHex(rgb) {
        var m = rgb.match(/\d+/g);
        if (!m) return '#000000';
        return '#' + m.slice(0, 3).map(function (n) {
            return ('0' + (+n).toString(16)).slice(-2);
        }).join('');
    }

    /* 选择模式：capture 阶段拦截点击，避免触发链接/按钮 */
    document.addEventListener('click', function (ev) {
        if (!pickMode) return;
        if (panel && panel.contains(ev.target)) return;
        ev.preventDefault();
        ev.stopPropagation();
        if (selected) selected.classList.remove('cz-selected');
        selected = ev.target;
        selected.classList.add('cz-selected');
        loadControls(selected);
        return false;
    }, true);

    function init() {
        buildPanel();
        restoreAll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
