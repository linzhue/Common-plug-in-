# 静态资源路径变量名约定

> 为了防止各个业务系统引用静态资源时路径变量定义的不统一问题。现将静态资源路径变量名统一约定如下：


- **静态资源域名** 变量统一命名为： `staticDomain` ，例如：
```js
// 需根据域名不同判断赋值
String staticDomain = "http://neris-nsit.csrc.gov.cn"
```


- **静态资源根路径** 变量统一命名为： `staticRootPath` ，例如：
```js
String staticRootPath = staticDomain + '/static'
```


- **公共模块UI** 路径变量统一命名为：`pubmuiPath`，例如：
```js
String pubmuiPath = staticRootPath + '/pubmui/1.15.1'
```


- **bootstrap** 路径变量统一命名为：`bootstrapPath` ，例如：
```js
String bootstrapPath = staticRootPath + '/bootstrap/3.3.0'
```


- **ckeditor** 路径变量统一命名为： `ckeditorPath` ，例如：
```js
String ckeditorPath = staticRootPath + '/ckeditor/4.4.7'
```


- **echarts** 路径变量统一命名为： `echartsPath` ，例如：
```js
String echartsPath = staticRootPath + '/echarts/2.2.7'
```


- **jquery** 路径变量统一命名为： `jqueryPath` ， 例如：
```js
String jqueryPath = staticRootPath + '/jquery/1.11.1'
```


- **jquery-form** 路径变量统一命名为： `jqueryFormPath` ， 例如：
```js
String jqueryFormPath = staticRootPath + '/jquery-form/3.51'
```


- **jquery-mousewheel** 路径变量统一命名为： `jqueryMousewheelPath` ，例如：
```js
String jqueryMousewheelPath = staticRootPath + '/jquery-mousewheel/3.1.12'
```


- **jquery-ui** 路径变量统一命名为：`jqueryUiPath` ，例如：
```js
String jqueryUiPath = staticRootPath + '/jquery-ui/1.11.1'
```


- **jquery.validate.js** 路径变量统一命名为： `jqueryValidatePath` ， 例如：
```js
String jqueryValidatePath = staticRootPath + '/jquery.validate.js/1.13.1'
```


- **jquery.validate.neris.js** 路径变量统一命名为： `jqueryValidateNerisPath` ，例如：
```js
String jqueryValidateNerisPath = staticRootPath + '/jquery.validate.neris.js/1.13.1'
```


- **jqwidgets** 路径变量统一命名为： `jqwidgetsPath` ，例如：
```js
String jqwidgetsPath = staticRootPath + '/jqwidgets/3.8.0'
```


- **mCustomScrollbar** 路径变量统一命名为： `mCustomScrollbarPath` ，例如：
```js
String mCustomScrollbarPath = staticRootPath + '/mCustomScrollbar/3.1.0'
```


- **neris-ui** 路径变量统一命名为： `nerisUiPath` ，例如：
```js
String nerisUiPath = staticRootPath + '/neris-ui/1.8.0'
```


- **neris-widget** 公共组件路径变量统一命名为： `nerisWidgetPath` ，例如：
```js
// 该变量定义了公共组件的基路径
String nerisWidgetPath = staticRootPath + '/neris-widget'
```
```html
<!--业务系统在使用公共组件时可以像下面这样引入。例如：使用部门人员树形组件 -->
<script src="<%= nerisWidgetPath%>/deptree/1.18/js/neris.deptree.js"></script>
```


- **ois-common-ui** 路径变量统一命名为： `oisCommonUiPath` ，例如：
```js
String oisCommonUiPath = staticRootPath + '/ois-common-ui/1.7.6'
```


- **resumable** 断点续传插件路径变量统一命名为： `resumablePath` ，例如：
```js
String resumablePath = staticRootPath + '/resumable/1.0-beta'
```


- **spark-md5** 加密插件路径变量统一命名为： `sparkMD5Path` ，例如：
```js
String sparkMD5Path = staticRootPath + '/spark-md5/2.0.0'
```


- **textSearch** 文本搜索高亮显示插件路径变量统一命名为： `textSearchPath` ，例如：
```js
String textSearchPath = staticRootPath + '/textSearch/1.0'
```


- **uploadifive** 上传插件路径变量统一命名为： `uploadifivePath` ，例如：
```js
String uploadifivePath = staticRootPath + '/uploadifive/1.2.2'
```


- **vue.js** 组件化框架插件路径变量统一命名为： `vuePath` ，例如：
```js
String vuePath = staticRootPath + '/vue/1.0.28'
```


- **zTree** 树形插件路径变量统一命名为： `zTreePath` ，例如：
```js
String zTreePath = staticRootPath + '/zTree/3.5'
```


> **特别说明：** 以上举例中的 `url` 路径仅作为参考，请以静态资源文件清单中的为准，谨慎拷贝。 
