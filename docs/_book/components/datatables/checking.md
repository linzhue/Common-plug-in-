# 显示勾选列
显示勾选列需要设置 `checking` 以及 `rowId` 选项，像下面的代码：

JavaScript
```js
$("#example").nerisDataTables({
	checking: true, // 开启显示勾选列选项
	rowId: "orgCode", // 设置 tr 的 id属性值为 orgCode
	ajax: {
		url: "./getOrgans",
		type: "POST"
	},
	columns: [
		{ data: "orgCode", title: "机构代码" },
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