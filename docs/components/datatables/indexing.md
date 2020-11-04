# 显示索引列
显示索引列需要设置 `indexing` 选项，像下面的代码：

JavaScript
```js
$("#example").nerisDataTables({
	indexing: true,
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