#部门分类选择组件

## 示意图
![部门分类选择](http://i.imgur.com/4LiY72o.png)

## 页面引用
父页面。调用以下代码，调用之前请先引入```neris.unitselect.js```  文件：

````html
<script type="text/javascript">
	var yourMethod = function(data) {
	     /**
	      * data是你所选择后的数组对象
	      * 根据返回的数据定义业务逻辑代码
	      */
	}
    $(document).ready(function() {
        $.selectUnits.initWindow(param);
</script>
````



>**注意**：参数param是对象 <br>**说明**：
 initWindow({ 
	unitCode:"attribute1",
	checkType:"attribute2",
	handleFun: "attribute3"
})

###param参数说明：

|参数名称|参数说明|
|-------|-------|
|attribute1|子窗口展示信息的查询的条件|
|attribute2|子窗口对查询结果的选择方式。即：s单选或m多选|
|attribute3|自定义对返回结果集的处理方法|

子页面
````html
<!-- 引入部门分类单页选择组件 -->
<script src="../static/neris-widget/unitselect/1.17/js/neris.unitselect.js"></script> 
````
## 方法调用
```html 
<script type="text/javascript">
    $(function(){
        $.selectUnits.initWindow({
                unitCode:"AA", 
                checkType:"m", 
                handleFun: "yourMethod",
            });
    });
</script>
```

##参数配置
|参数名称	|类型	|必填	|默认值		|描述             |
|-----------|-------|-------|-----------|-----------------|
|unitCode	|String	|是&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |AA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	|机构代码:<br>AA 资产评估机构, AF 会计师事务所,<br> SSGS 上市公司, PCJG 派出机构, GQSC 股权市场, <br>DFZF 地方政府, HGDW 会管单位, HNBM 会内部门, SZJS 深圳交易所, SHJS 上海交易所|
|checkType	|String	|是	    |m	|m:多选 , s:单选 |
|handleFun	|Function	|是	|''	|自定义方法处理子窗口回调时传回的结果集，即：子窗口以被选中的数据为参数回调该函数|