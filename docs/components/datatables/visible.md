# 隐藏显示列
使用隐藏/显示列功能，需要设置 `columns.visible` 选项，像下面的代码：

JavaScript
```js
$("#example").nerisDataTables({
	ajax: {
		url: "./getOrgans",
		type: "POST"
	},
	columns: [
		{ 
		  data: "orgCode", 
		  title: "机构代码",
		  visible: false // 隐藏 机构代码 列
		},
		{ data: "orgName", title: "机构名称" }
	]
});
```

Html
```html
...
<body>
	<table id="example" class="table table-condensed table-striped table-hover" cellspacing="0" width="100%"></table>
</body>
...
```