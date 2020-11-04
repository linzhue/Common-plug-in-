# 复合表头
实现复合表头功能需要在 `<table>` 中增加一个 `<thead>` 标签。并在需要跨行跨列的 `<th>` 标签上设置 `rowspan` 和 `colspan` 属性，像下面的代码：

JavaScript
```js
$("#example").nerisDataTables({
	ajax: {
		url: "./getOrgans",
		type: "POST"
	},
	columns: [
		{ data: "orgCode" }, // 机构代码
		{ data: "orgName" }, // 机构名称
		{ data: "orgAddress" }, // 机构所在地
		{ data: "orgDate" }, // 机构成立时间
		{ data: "orgStatus" }, // 机构状态
	]
});
```

Html
```html
...
<body>
	<table id="example" class="table table-condensed table-striped table-hover" cellspacing="0" width="100%">
		<!-- 如果你想把 机构名称/所在地， 机构成立时间/状态 两两分组，可以按照下面的方式去做 -->
		<thead>
			<tr>
				<th rowspan="2">机构代码</th>
				<th colspan="2">分组一</th>
				<th colspan="2">分组二</th>
			</tr>
			<tr>
				<th>机构名称</th>
				<th>机构所在地</th>
				<th>机构成立时间</th>
				<th>机构状态</th>
			</tr>
		</thead>
	</table>
</body>
...
```

**提示：** 符合表头不要设置 `columns.title` 属性。