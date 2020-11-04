# API
数据表格组件是基于一款强大的第三方插件 [DataTables](https://datatables.net/) 封装的组件。功能和性能比旧的分页表格组件强。

组件提供两个文件，一个压缩版和一个未压缩版，建议开发环境使用未压缩版本，方便调试。

## 依赖
- jquery
- dataTables 1.10.15+
- UI样式

## 页面引入

```html
<html>
<head>
<!-- dataTables css -->
<link href="../static/dataTables/1.10.15/css/dataTables.bootstrap.min.css" rel="stylesheet">

<!-- 组件 css -->
<link href="../static/neris-widget/datatables/1.0/css/neris.datatables.css" rel="stylesheet">

<!-- dataTables js -->
<script src="../static/dataTables/1.10.15/js/jquery.dataTables.min.js"></script>
<script src="../static/dataTables/1.10.15/js/dataTables.bootstrap.min.js"></script>

<!-- 组件 js -->
<script src="../static/neris-widget/datatables/2.3.1/js/neris.datatables.js"></script>

<script type="text/javascript">
	$(function(){
		var table = $("#example").nerisDataTables( options ); // 返回一个对象
	});
</script>

</head>
<body>
	<table id="example" class="table table-condensed table-striped table-hover" cellspacing="0" width="100%"></table>
</body>
</html>
```

## options 参数列表

- indexing | `Boolean`
是否显示索引列，默认 false 。

- checking | `Boolean`
是否显示勾选列，默认 false 。

- processing | `Boolean`
是否显示 Loading 动画，默认 false 。

- paging | `Boolean`
是否显示分页，默认 false 。

- pageLength | `Number`
每页显示条数，默认 5。

- pageShow | `String`
分页栏显示方式，默认 "bottom" 。
  - "top" : 表格顶部
  - "bottom" : 表格底部
  - "all" : 表格上下都显示分页


- scrollX | `Boolean`
是否显示横向滚动条，默认 false 。

- rowId | `String`
指定行 id，默认 ""。
此属性会为表格中每行的 `tr` 标签设置一个 `id` 属性，属性的值就是 rowId 中指定的内容。可以是普通字符串，也可以是服务端数据中某一个 key。 [参考资料](https://datatables.net/reference/option/rowId)

	例如：

	```js
	// 服务端 JSON 数据
	{
	 ...
	 pageList: [
		{ id: "100", name: "测试1" },
		{ id: "200", name: "测试2" }
	 ]
	 ...
	}

	// rowId
	$("#example").nerisDataTables({
		...
		rowId: "id" // 指定服务端对象中的 id 作为 tr 的 id 值
		...
	});
	```

	最终表格中生成的 `tr` 标签为：
	
	```html
	<tr id="100">...</tr>
	<tr id="200">...</tr>
	```

	**注意：** 当设置 `checking: true` 时，这个选项必须指定，不然会报如下错误：

	```
	when the `checking` option is enabled, you must set the `rowId` option at the same time!
	```


- ajax | `String|Object`
服务端请求，[参考资料](https://datatables.net/reference/option/ajax)。
	例如：

	```js
	ajax: "./getOrgans" // 默认 GET 请求
	```

	通过  `ajax.type` 属性指定  POST 请求
	
	```js
	$("#example").nerisDataTables({
		...
		ajax: {
			url: "./getOrgans",
			type: "POST"
		}
		...
	});
	```
	
	通过 `ajax.data` 属性传递附加参数
	
	```js
	// 当 data 是 Object 类型时
	$("#example").nerisDataTables({
		...
		ajax: {
			url: "./getOrgans",
			type: "POST",
			data: {
				userId: "100"
			}
		}
		...
	});
	
	// 当 data 是 Function 类型时
	// 在附加参数中，处理一些额外操作：
	$("#example").nerisDataTables({
		...
		ajax: {
			url: "./getOrgans",
			type: "POST",
			data: function ( d ) {
				// 从 Form 表单中获取参数
				d.userId = $("#userId").val()
			}
		}
		...
	});
	```
	
	通过 `ajax.dataSrc` 指定表格绑定的数据集合，详见 [ajax.dataSrc](https://datatables.net/reference/option/ajax.dataSrc)
	
	```js
	// 一般后台数据返回的数据集是以 `pageList` 命名的，所以可以通过此参数来设置。
	$("#example").nerisDataTables({
		...
		ajax: {
			url: "./getOrgans",
			type: "POST",
			dataSrc: "pageList"
		}
		...
	});
	```


- columns | `ArrayObject`
表格列。默认 []，[参考资料](https://datatables.net/reference/option/columns)。数组中每个对象完整的选项如下：

	```js
	$("#example").nerisDataTables({
		...
		columns: [
			{
				data: "orgCode", // 服务端 JSON 中对应的 key
				title: "机构代码", // 表头显示的名字
				visible: true, // 设置列是否显示。默认显示
				width: "", // 此参数可用于定义列的宽度，支持任何CSS值（3em，20px，20%等）
				className: "", // 简单来说，这个选项为列中的每个单元格（td）添加一个类
				render: function ( data, type, row ) {
					// data: 单元格的数据，常用。
					// type: 请求调用数据的类型，不常用。
					// row: 行的完整数据，常用。
					
					// 在这里对数据近一步处理：数据格式化、DOM元素绘制等。
					return data;
				}
				
			}
		]
		...
	});
	```
	
	示例代码：
	
	```js
	$("#example").nerisDataTables({
		...
		columns: [
			{ data: "name", title: "机构名称" },
	        { data: "pname", title: "所属机构" },
	        { 
	    	  data: "status", 
	    	  title: "状态" , 
	    	  render: function ( data, type, row ) {
		    	 return data === "0" ? "有效" : "无效";
		      }
	        },
	        { 
	    	  data: null, 
	    	  title: "操作", 
	    	  render: function ( data, type, row ) {
		    	 return "<button class='btn btn-danger btn-xs btn-del' data-id='"+row.id+"'>删除</button>"
		      }
	        }
		]
		...
	});
	```

## 方法

`$(selector).nerisDataTables(options)` 返回的对象包含以下方法：

| 方法名 | 参数 | 参数类型 | 说明 |
| ----- | --- |  :-----: | --- |
| getSelectedRowData | 无 | Array | 获取选中的行数据 |
| setPage | set | String/Number | 设置当前页。当 set 是 String 类型时，只能是：'first','last','next','previous'|
| setChecked | (rowId, state) | rowId: `tr` 的id属性值，state： Boolean | 设置勾选 |
| draw | 无 | 无 | 重新渲染表格，这在查询时很有用|

## 访问 DataTables 内部API方法
```js
var table = $(selector).nerisDataTables(options);
// 通过 `table.t` 可以访问 DataTables内置的 API方法，例如：
table.t.rows(0).nodes();
```

## 请求参数

数据表格组件在初始化数据时，会向服务端发送以下参数：

| 参数名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| start | int | 0 | 每页起始值 |
| length | int | 默认等于 pageLength 的值 | 每页条数 |

更多参数，请参阅 [官方文档-服务端模式](https://datatables.net/manual/server-side)

## 响应 	JSON 数据
格式同分页表格组件




