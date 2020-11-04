# 基础树形组件

## 示意图
![基础树形组件](../../assets/imgs/tree/base-tree.png)

## 依赖
```
jQuery
bootstrap
NerisUI	//UI规范
jquery.mCustomScrollbar.js	
zTree	//基础树形组件依赖
```

## 页面引入
```html
<!-- 引入的UI规范CSS样式 -->
<link href="../static/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet">
<link href="../static/neris-ui/1.9.2/css/style.css" rel="stylesheet">

<link href="../static/mCustomScrollbar/3.1.0/jquery.mCustomScrollbar.css" rel="stylesheet"/>
<link href="../static/zTree/3.5/css/metroStyle/metroStyle.css" rel="stylesheet"/>
 
<!-- 引入基础树形组件样式 -->
<link href="../static/neris-widget/basetree/1.18/css/neris.basetree.css" rel="stylesheet"/>
 
<!-- 引入的UI规范JS文件 -->
<script src="../static/jquery/1.11.1/jquery.min.js"></script>
<script src="../static/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<script src="../static/mCustomScrollbar/3.1.0/jquery.mCustomScrollbar.js"></script>
 
<!-- 引入的第三方类库 -->
<script src="../static/zTree/3.5/js/jquery.ztree.all-3.5.js"></script>
<script src="../static/zTree/3.5/js/jquery.ztree.exhide-3.5.js"></script>
 
<!-- 引入基础树形组件 -->
<script src="../static/neris-widget/basetree/1.18/js/neris.basetree.js"></script>
```

## 方法调用
```html
<script type="text/javascript">
	//$.nerisTree.init("nerisTree", settings); // 该方法已废弃，请使用下面方法替换
	$.initBaseTree("nerisTree", setting);
</script>
```
在body中设置div容器，且容器的id="nerisTree"：
```html
<body>
	 <div id="nerisTree"></div>
</body>
```

> **注意：** init初始化方法的第一个参数是容器id，且必须是nerisTree；settings：参数配置对象，详见settings参数配置。

## settings参数配置

### check
| 参数  | 默认值 | 类型  | 描述 |
| -------- | --------| --------| ---|
| enable| true | Boolean  | 设置节点上是否显示checkbox/radio|
| chkStyle| ‘checkbox’ | String  | 勾选类型（checkbox/radio）|
| radioStyle| ‘level’ | String  | radio分组类型（level/all）。当chkStyle = ‘radio’时才能使用该属性。radioStyle = ‘level’ 表示在每一级范围内当作一个分组。radioStyle = ‘all’ 表示把整个树当成一个分组|
| chkStyle| {‘Y’:’ps’,’N’:’ps’} | Object  | 勾选 checkbox 对于父子节点的关联关系。设置setting.check.enable = true 且 setting.check.chkStyle = "checkbox" 时生效。<br>Y 属性定义 checkbox 被勾选后的情况； <br> N 属性定义 checkbox 取消勾选后的情况； <br> "p" 表示操作会影响父级节点； <br> "s" 表示操作会影响子级节点。<br> 例如：<br> {“Y”: “”, “N”: “”}:勾选/取消时只影响当前节点<br> {“Y”: “p”, “N”: “p”}:勾选/取消时关联父亲节点<br> {“Y”: “p”, “N”: “s”}:勾选时关联父亲节点，取消时关联子节点<br> {“Y”: “s”, “N”: “ps”}:勾选时关联子节点,取消时关联父亲节点和子节点<br> {“Y”: “ps”, “N”: “ps”}:勾选是关联父亲节点和子节点，取消时关联父亲节点和子节点|

### async
| 参数  | 默认值 | 类型  | 描述 |
| -------- | --------| --------| ---|
| enable| true | Boolean  | 设置是否开启异步加载模式|
| url| '' | String  | 异步请求数据地址。enable = true时生效|
| autoParam| [] | Array  | 异步请求自动提交父节点属性的参数。将需要作为参数提交的属性制作成Array即可。例如：[“id”,”name”]|

### searchUrl
- **类型 ：**```String```|**是否必填 ：**```是```|**默认值 ：**```''```
- **描述 ：**查询数据的url的地址。
返回树形结构的json格式数据。
查询参数：默认是 ’searchParam’，后台可通过 @RequestParam(“searchParam’”) 或request.getParameter(“searchParam’”) 的方法获取查询时传递的参数。

### searchEnable
- **类型 ：**```Boolean```|**是否必填 ：**```否```|**默认值 ：**```true```
- **描述 ：**查询功能是否可用

### tableEnable
- **类型 ：**```Boolean```|**是否必填 ：**```否```|**默认值 ：**```true```
- **描述 ：**树形组件右侧表格是否可用

### leftWidth
- **类型 ：**```String```|**是否必填 ：**```否```|**默认值 ：**```''```
- **描述 ：**树形组件左侧宽度

### rightWidth
- **类型 ：**```String```|**是否必填 ：**```否```|**默认值 ：**```''```
- **描述 ：**树形组件右侧宽度。支持px、百分比

### columns
- **类型 ：**```Array```|**是否必填 ：**```是```|**默认值 ：**```[]```
- **描述 ：**columns中的每一项都是一个对象。例如：
  
```js
[{
	title : ‘编号’, 
	data: ‘id’, render: function(item, row) {
	     //item: data中指定的属性值
	     //row: 当前选中的节点对象
	}
}]
```

### level
- **类型 ：**```Number```|**是否必填 ：**```否```|**默认值 ：**```null```
- **描述 ：**指定显示层级

### height
- **类型 ：**```String```|**是否必填 ：**```否```|**默认值 ：**```500px```
- **描述 ：**设置树形高度

### theme
- **类型 ：**```String```|**是否必填 ：**```否```|**默认值 ：**```zTreeStyle```
- **描述 ：**	可选主题样式：‘zTreeStyle’ | ‘metroStyle’

### relateParent
- **类型 ：**```Boolean```|**是否必填 ：**```否```|**默认值 ：**```''```
- **描述 ：**	父节点是否可勾选

### 组件初始化方法
`$.nerisTree.init("nerisTree", settings);` 方法已废弃，请使用 `$.initBaseTree(obj, setting);` 该方法返回 `nerisTree` 对象。nerisTree 对象包含的属性有：

| 参数  | 类型  | 描述 |
| -------- | --------| ---|
| setting| Object | 用户配置的参数对象。等价于init方法的第二个参数内容。  |
| getNodeByParam(key, value) | Function | 	通过node属性查找node对象。<br>key: node属性名称<br>value: key对应的值|
| getCheckedNodes() | Function |获取当前选中的全部节点|
| getCheckedParentNodes()| Function |获取当前选中的全部父亲节点|
| getCheckedSonNodes() | Function |获取当前选中的全部孩子节点|
| destroy() | Function | 销毁树形组件|
