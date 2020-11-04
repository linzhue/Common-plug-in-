# 成功信息弹出框

## 示意图
![成功信息弹出框](../../assets/imgs/dialog/success-dialog.png)

## 页面引入
```html
<script src="../static/neris-widget/dialog/1.20/js/neris.dialog.js"></script>
```

## 方法调用
```html
<script type="text/javascript">
	$(function(){
		$.nerisSuccess([showBtnType], content, [callbackFunc]);
	});
</script>
```

## 参数配置
| 参数名  | 类型  | 必填  | 默认值 | 描述 |
| -------- | --------| ---|-----|----|
| showBtnType| Boolean |  否   | 无 | 显示按钮类型。|
| content | String | 是 | '' | 文本内容信息。|
| callbackFunc| Function | 否 | 无 | 回调函数。 |