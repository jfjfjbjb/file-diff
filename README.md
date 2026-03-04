# File-Diff

专业文件对比工具，支持文本文件的差异对比，帮助您快速识别文件间的变化。

## 功能特性

- 📁 支持多种文本文件格式（.txt, .md, .js, .ts, .jsx, .tsx, .css, .scss, .html, .json, .xml, .csv, .log, .py, .java, .c, .cpp, .h, .hpp）
- 🎯 实时文件差异对比，高亮显示添加、删除和修改的内容
- 📤 支持拖放上传文件
- 📱 响应式设计，适配不同屏幕尺寸
- 🚀 高性能差异计算，支持大文件对比（最大10MB）
- 💾 自动保存对比结果，支持文件管理

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- diff-match-patch
- react-diff-viewer-continued

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用方法

1. 在浏览器中打开应用
2. 点击或拖放文件到上传区域
3. 选择两个要对比的文本文件
4. 系统会自动分析并显示文件差异
5. 查看对比结果，绿色表示添加的内容，红色表示删除的内容
6. 可以点击"清空"按钮重置操作

## 项目结构

```
src/
├── components/
│   ├── FileDiff.tsx        # 文件差异对比组件
│   └── FileUpload.tsx      # 文件上传组件
├── App.tsx                # 主应用组件
├── App.css                # 应用样式
├── index.css              # 全局样式
└── main.tsx               # 应用入口
```

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

File-Diff © 2026
