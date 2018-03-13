# 分页表格组件

## 示意图
![分页表格](../../assets/imgs/grid/grid.png)

## 依赖
```html
jQuery
bootstrap
NerisUI
```

## 页面引入
```html
<!-- css -->
<link href="../static/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet">
<link href="../static/neris-ui/1.8.0/css/style.css" rel="stylesheet">
<link href="../static/neris-widget/grid/1.18/css/neris.grid.css" rel="stylesheet">
<!-- 引入的UI规范js文件 -->
<script src="../static/jquery/1.11.1/jquery.min.js"></script>
<script src="../static/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<!-- 弹出框组件 -->
<script src="../static/neris-widget/dialog/1.17/js/neris.dialog.js"></script>
<!-- 分页表格组件 -->
<script src="../static/neris-widget/grid/1.18/js/neris.grid.js"></script>
```
## 方法调用
```html
<script type="text/javascript">
	$(function(){
		$("#nerisGrid").nerisGrid(options);
	});
</script>
```
```html
<div id="nerisGrid"></div>
```
>**说明：**`options`是组件初始化配置的参数对象，具体见下方参数配置说明。

## options参数说明 

|参数名称|类型|必填|默认值|描述|
|-------|--------|---------|---------|--------------|
|url| String | 是 | `''` |请求远程数据地址（必填）, **注：远程数据地址是测试唯一地址,不勾选或其他值为无效值** |
|pageSize|Number|否| `15` |每页显示条数|
|currentPage|Number|否| `1` |指定当前页|
|showIndex|Boolean|否| `false` |是否显示序号字段, 'true' 为显示字号, 'false' 为不显示|
|showCheck|Boolean|否| `false` |是否显示 checkbox （勾选框）, 'true' 为显示, 'false' 为不显示|
|loadData|Boolean|否| `true` |加载延迟时是否显示 loading 样式, 'true' 为显示, 'false' 为不显示|
|columnModel|Array|是| `''`|数组用于设置显示列的配置信息,默认值为唯一有效值|
|success|Function|否	| `''` |操作成功，回调函数可自定义对接收的参数数据进行处理|
|groupThead|Boolean| 否| `false` |开启组合表头|
|groupModel|Array|否	| `''` |组合表头数据结构。 **注：表格加载数据处仍然配置在 `columnModel.formatter()` 处理** |
|paginationId|String|否| `''` |指定分页页签显示位置，配置标签id 如：`'pagination'` |
|tableWidth|String|否| `100%` |设置表格宽度 。 支持  `%` 、 `px` |
## columnModel包含如下属性： 

|参数名称|类型     |必填     |默认值    |描述  |
|-------|--------|---------|---------|--------------|
|field|	String| 是	|`''` |结果集对象字段名|
|title|	String|	是	| `''` |列名称|
|width|	String|	是	| `''` |列宽|
|align|	String|	是	| `''` |水平对齐方式（可选值：`left` , `center` , `right` ）|
|formatter|	Function|否|	`''` |	数据格式化回调函数，应返回对应单元格中显示的内容|
|titleAlign|String|否| `center` |标题水平对齐方式（可选值：`left` , `center` , `right` ）|
## groupModel包含如下属性： 

|参数名称|类型     |必填     |默认值    |描述          |
|-------|--------|---------|---------|--------------|
|colName|String| 是 | `''` |表头格内显示的标题|
|rowspan|	Number|	否	| `1` |当前标题占用的行数|
|colspan|	Number|	否	| `1` |当前标题占用的列数|
|align|	String|	否	| `''` |对齐方式（可选值：`left` , `center` , `right` ）|
|width|String|否| `center` |表头的最后一行可配置当前标题的列宽，**注：序号列，复选框列 如配置各占5%宽度** |

## 服务端接收的分页请求参数:
|参数名称|类型     |必填     |默认值    |描述           |
|-------|--------|---------|---------|--------------|
|pageSize|Number|否| `15` |每页显示数据数|
|currentPage|Number|否| `1` |指定当前页|

## 服务端返回的响应数据，至少包含如下属性:

|属性名称	|类型	|描述 |
|-----------|-------|----------|
|rowCount	|Number	 |总记录数|
|pageList	|JSONArray	|获取选中数据|

## 方法：
|方法名称|参数	|返回值	|描述|
|-------|-------|-------|------------|
|$(tableElement). nerisGrid("reload",options)	|Option参数同组件初始化|	无	|重新加载分页表格|
|$(tableElement). nerisGrid("getCheckedRowDatas")	|无	|JSONArray	|获取选中数据|
|$(tableElement). nerisGrid("emptyGrid")|无	|无	|清空分页表格组件|