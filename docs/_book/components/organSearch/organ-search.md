# 机构代码名称查询组件
使用组件之前需要一些数据源方面的配置。

## 准备工作

### 数据源配置

首先在你的项目 `src/main/resources` 目录下新增如下目录结构：
```bash
└── src/main/resources
    	└── iivpss.spring 
        	└── url.properties
```
然后再在`url.properties` 文件中增加如下配置：

```bash
# 集成内网开发与测试环境对应的路径为：
# url= http://180.8.40.153:80/iivpss_proxy_webapp/

# 仿真证联网与生产证联网对应路径为：
# url = http://10.1.6.110:80/iivpss_proxy_webapp/

# 本地调试请用域名：
url = http://nerisdev.csrc.gov.cn:2825/iivpss_proxy_webapp/
combinedExactQuery=iivpss/platform/OrganizationCodeInfoPub/combinedExactQuery
combinedFuzzyQuery=iivpss/platform/OrganizationCodeInfoPub/combinedFuzzyQuery
infoCompare=iivpss/platform/OrganizationCodeInfoPub/infoCompare
```

### 注解扫描配置
最后在你项目的 `spring-mvc.xml` 文件中，新增如下配置：
```xml
<context:component-scan base-package="org.csits"/>
```

以上配置就是这些。

事实上，你可以根据不同环境（build、本地、测试），给 url 参数值定义一个变量，例如：
```bash
# 变量名的命名取决于你，不要和其他模块的 url 冲突即可。
url=${iivpss.connection.url}
```

然后，在你的 `maven` 打包文件中，增加这个变量名，例如在 `filter/db/connection-dev.properties` 目录文件下：
```bash
iivpss.connection.url=http://nerisdev.csrc.gov.cn:2825/iivpss_proxy_webapp/
```

这样不用每次手动修改配置文件，打包时只需要根据不同的环境动态切换即可，这样会更方便。

## 页面引入
```html
<script src="../static/neris-widget/dialog/1.19/js/neris.dialog.js"></script>
<script src="../static/neris-widget/organSeach/1.0/js/neris.organ-search.js"></script>
```

## 方法调用
```html
<!-- 页面组织机构查询组件展示标签 -->
<div id="showOrgan"></div>;

<!-- 页面 js 代码 -->
<script type="text/javascript">
	$("#showOrgan").empty().nerisOrganSearch(options);
</script>
```

## options 对象选项 

|参数名称|类型|必填|默认值|描述|
| --- | --- | --- | --- | --- |
| `queryType` | Number | 是 | 无 | 查询类型。1：精确查询，2：模糊查询|
| `userName` | String | 是 | 无 | 当前登录的用户名 |
| `passWord` | String | 是 | 无 | 当前登录的密码 |
