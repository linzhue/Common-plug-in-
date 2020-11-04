# 首页

**注意：** 集成组件 `1.35.1-SNAPSHOT` 版本后需要在你项目的 `spring-mvc.xml` 文件中增加一行对 `org.csits` 包的扫描配置：

```xml
<context:component-scan base-package="org.csits"/>
```

组件当前版本依赖：
- 权限接口版本 `urmsInterface.version : 2.0.3-SNAPSHOT`
- 非结构化版本 `oltp-file-service.version : 1.2.7.1-SNAPSHOT`

## 组件坐标

```html
<dependency>
    <groupId>org.neris</groupId>
    <artifactId>neris-tech-widget-webapp</artifactId>
    <version>1.35.1-SNAPSHOT</version>
    <type>war</type>
</dependency>
```

## 非结构化坐标

```html
<dependency>
  <groupId>org.neris</groupId>
  <artifactId>oltp-file-service</artifactId>
  <version>1.2.7.1-SNAPSHOT</version>
</dependency>
```

## 版本变更说明

- 分页表格组件，实现了表格排序功能。
- 树形组件解决了层级问题
- 数据表格组件增加了对排序的支持
- 上传组件解决了文件上传安全漏洞的问题