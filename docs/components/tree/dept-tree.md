# 部门人员树形组件

## 示意图
![部门人员树形组件](../../assets/imgs/tree/dept-tree.png)

## 依赖
```
jQuery
bootstrap
NerisUI
```

## 页面引入
```html
<!-- 引入的规范css文件 -->
<link href="../static/neris-widget/windowdiv/1.17/css/jquery.windowdiv.css" rel="stylesheet">
<link href="../static/mCustomScrollbar/3.1.0/jquery.mCustomScrollbar.css" rel="stylesheet"/>
 
<!--引入的规范js文件 -->
<script src="../static/neris-widget/windowdiv/1.17/js/jquery.windowdiv.js"></script>
<script src="../static/neris-widget/customui/1.19/js/customui.js"></script>
<script src="../static/mCustomScrollbar/3.1.0/jquery.mCustomScrollbar.js"></script>
 
<!--引入的部门树形组件文件 -->
<script src="../static/neris-widget/deptree/1.33/js/neris.deptree.js"></script>
```

注意：1.33版本 neris.deptree.js，使用树形组件弹窗时，要配合公共组件和权限的版本

公共组件版本：

<neris-tech-widget-webapp.version>1.35.1-SNAPSHOT</neris-tech-widget-webapp.version>

权限版本：

<urmsInterface.version>2.0.3-SNAPSHOT</urmsInterface.version>

## 方法调用

```html
<script type="text/javascript">
	var yourMethod = function(callbackData) {
	     /**
	      * callbackData是你所选择后的数组对象
	      * 根据返回的数据处理你自己的业务逻辑代码
	      */
	}
	
	var settings = {
		selectType: 'dept',//选择类型
		rootId: '300',//指定根节点
		handleFun: 'yourMethod',
		showDatas: [ //数据回显
			{id: '3260001'}, 
			{id: '3230002'}
		]
		filterDatas : ['123', '456'] //数据过滤，指定 id为 '123', '456'的部门/人员不显示
		...
	}
	$.nerisTree.initWindowTree(settings);
</script>
```

> **提示：** yourMethod回调函数。callbackData是你所选择后的数组对象，根据返回的数据处理你自己的业务逻辑代码。settings：初始化参数对象，详见settings参数配置。


## settings参数配置

### selectType
- **类型 ：**```String```|**是否必填 ：**```是```|**默认值 ：**```dept```
- **描述 ：**选择类型。dept：只选部门；pers：只选人员

### checkType
- **类型 ：**```Boolean```|**是否必填 ：**```是```|**默认值 ：**```multi```
- **描述 ：**选择模式。‘multi’ : 多选；‘single’ : 单选

### handleFun
- **类型 ：**```String```|**是否必填 ：**```是```|**默认值 ：**```null```
- **描述 ：**用来处理自己的业务逻辑的函数字符串

### isEcho
- **类型 ：**```String```|**是否必填 ：**```是```|**默认值 ：**```true```
- **描述 ：**是否反显

### expand
- **类型 ：**```Boolean```|**是否必填 ：**```是```|**默认值 ：**```true```
- **描述 ：**是否展开

### level
- **类型 ：**```String```|**是否必填 ：**```否```|**默认值 ：**```不限制```
- **描述 ：**显示层级

### rootId
- **类型 ：**```String```|**是否必填 ：**```是```|**默认值 ：**```''```
- **描述 ：**指定根节点,如果指定多个根节点用逗号隔开。例如：rootId : '30016,30017';

### title
- **类型 ：**```String```|**是否必填 ：**```否```|**默认值 ：**```''```
- **描述 ：**弹出窗口的标题

### echoData
- **类型 ：**```Array```|**是否必填 ：**```否```|**默认值 ：**```[]```
- **描述 ：**数据回显。老版本的数据回显处理，该属性只是把数据保存在当前window对象上。<br>如果做编辑等操作，数据无法回显，请使用 <code>showDatas</code> 参数。

### filterDatas
- **类型 ：**```Array```|**是否必填 ：**```否```|**默认值 ：**```[]```
- **描述 ：**数据过滤。指定部门/人员不显示
```html
$.nerisTree.initWindowTree({
	...
	filterDatas: ['123', '456'] //数据过滤。指定 id为 '123', '456'的部门/人员不显示
	...
});
```

### showDatas
- **类型 ：**```Array```|**是否必填 ：**```否```|**默认值 ：**```[]```
- **描述 ：**数据回显。回显的数据需要用户从保存的数据库中查询，按照格式要求传给该参数即可。例如
```js
// 如果选择的机构：
$.nerisTree.initWindowTree({
	...
	showDatas: [// 数组对象。id: 部门编号
		{id: '326001'},
		{id: '323002'}
	] 
	...
});
// 如果选择的人员：
$.nerisTree.initWindowTree({
	...
	showDatas: [// 数组对象。id: 人员编号，pid: 人员所属部门或处室编号
		{id: '11', pid: '1'},
		{id: '22', pid: '2'}
	] 
	...
});
```

### showParentNode
- **类型 ：**```Boolean```|**是否必填 ：**```否```|**默认值 ：**```false```
- **描述 ：**右侧表格是否显示父级节点，默认不显示。当<code>selectType = 'dept'</code> 时有效。

### activeFlag
- **类型 ：**```Boolean```|**是否必填 ：**```否```|**默认值 ：**```true```
- **描述 ：** `true` 显示有效的部门人员；`false` 显示全部的（有效，无效）部门人员。