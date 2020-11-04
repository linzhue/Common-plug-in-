# 弹出框组件
该组件替代了传统的浏览器自带的提示框信息，进一步提高了用户体验。应用场景比较多，主要体现在用户日常操作提示上。弹出框组件大体上有五种分类：
- [通用消息弹出框](base-dialog.md)
- [提示信息弹出框](info-dialog.md)
- [警告信息弹出框](warn-dialog.md)
- [危险信息弹出框](danger-dialog.md)
- [成功信息弹出框](success-dialog.md)

以上弹出框都依赖 `jquery.neris.dialog.js` 组件，其中的提示/警告/危险/成功信息弹出框是在通用消息弹出框的基础上拓展而来的。

## 依赖
```
jquery
bootStrap
nerisUI
```

## 页面引入
```html
<!-- 引入的UI规范CSS样式 -->
<link href="../static/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet">
<link href="../static/neris-ui/1.9.2/css/style.css" rel="stylesheet">
 
<!-- 引入的UI规范JS文件 -->
<script src="../static/jquery/1.11.1/jquery.min.js"></script>
<script src="../static/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<!-- 引入弹出框组件 -->
<script src="../static/neris-widget/dialog/1.19/js/neris.dialog.js"></script>
```

