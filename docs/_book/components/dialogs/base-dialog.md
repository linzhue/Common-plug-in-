# 通用消息弹出框

## 示意图
![通用消息弹出框](../../assets/imgs/dialog/base-dialog.png)

## 页面引入
```html
<script src="../static/neris-widget/dialog/1.19/js/neris.dialog.js"></script>
```

## 方法调用
```html
<script type="text/javascript">
	$(function(){
		$.nerisDialog(options);
	});
</script>
```

## options参数配置
| 参数名  | 类型  | 必填  | 默认值 | 描述 |
| -------- | --------| ---|-----|----|
| dlgType| String | 否 | 'info' | 弹出框类型。'info': 一般信息 ；<br/> 'success': 成功； 'warning': 警告； 'danger': 危险；|
| title | String | 否 | '' | 标题|
| titleCss | String | 否 | 'info' | 标题样式 |
| content | String | 否 | '' | 弹出框内容。可以是普通文本，也支持html标签。 |
| showBtn | String | 否 | 'cancel' | 显示按钮。 'ok'：显示确认按钮 'cancel'：显示取消按钮 'all'：全部显示 |
| okName | String | 否 | '确认' | 确认按钮文本 |
| okFunc | Function | 否 | function(){} | 点击确认按钮回调函数 |
| okCss | String | 否 | 'primary' | 确认按钮样式。UI规范中的按钮样式。 |
| cancelName | String | 否 | '取消' | 取消按钮文本 |
| cancelFunc | Function | 否 | function(){} | 点击取消按钮回调函数 |
| cancelCss | String | 否 | 'warning' | 取消按钮样式。UI规范中的按钮样式 |
| focusBtn | Number | 否 | 1 | 设置焦点按钮。<br/> focusBtn:1：确认按钮获取焦点； <br/> focusBtn:2：取消按钮获取焦点； <br/>（仅当showBtn:'all'时才有效）