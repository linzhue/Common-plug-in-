# 基础配置

JavaScript
```js
$("#example").nerisDataTables({
	ajax: {
		url: "./getOrgans",
		type: "POST"
	},
	columns: [
		{ data: "orgCode", title: "机构代码" },
		{ data: "orgName", title: "机构名称" },
		{ 
		  data: "status", title: "状态", render: function ( data, type, row ) {
		  	 // 数据库中保存的 status 一般是 0 和 1, 这里转换一下格式
		  	 if ( data === 0 ) return "有效"
		  	 if { data === 1 } return "无效" 
		  }
		}
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
