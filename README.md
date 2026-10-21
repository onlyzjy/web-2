# 周同学的个人主页

一个用原生 HTML + CSS 编写的个人主页，包含首页、关于我、我的作品、联系我四个板块。

## 目录结构

```
web-2/
├── index.html   # 页面结构
└── style.css    # 页面样式
```

## 本地预览

直接用浏览器打开 `index.html` 即可；也可以在目录下启动一个静态服务器：

```bash
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 技术要点

- **语义化标签**：`nav` / `main` / `section` / `article` / `footer`
- **锚点导航**：配合 `scroll-behavior: smooth` 与 `scroll-margin-top` 实现平滑跳转且不被固定导航遮挡
- **Flex 布局**：导航栏居中、关于我左右排列、作品卡片等宽排列
- **响应式**：`@media (max-width: 640px)` 下导航收窄、卡片改为纵向排列、头像居中
- **基础样式规范**：`box-sizing: border-box` 统一盒模型，`max-width` 控制阅读宽度

## 待办

- [ ] 补充真实的作品截图与链接
- [ ] 增加深色模式
- [ ] 联系表单（需要后端或第三方服务）
