# 上传下载组件

## 示意图
![上传](../../assets/imgs/uploader/uploader.png)

##依赖
```
jQuery
bootstrap
NerisUI
uploadifive
resumable	
```

## 页面引入
```html
<link href="../static/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet">
<link href="../static/neris-ui/1.8.0/css/style.css" rel="stylesheet">
<!-- 引入的UI规范js文件 -->
<script src="../static/jquery/1.11.1/jquery.min.js"></script>
<script src="../static/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<!-- 弹出框组件 -->
<script src="../static/neris-widget/dialog/1.20/js/neris.dialog.js"></script>
```
>说明：可根据实际使用上传组件的配置选择引入所需的js文件
- 不使用断点续传
```
	<link href="../static/uploadifive/1.2.2/css/uploadifive.css" rel="stylesheet">
	<script src="..static/uploadifive/1.2.2/js/jquery.uploadifive.js"></script>
	<script src="../static/neris-widget/uploader/1.25.1/js/neris.uploader.js"></script>
```
- 使用断点续传
```
	<link href="../static/resumable/1.0-beta/css/neris.resumable.css" rel="stylesheet">
	<script src="../static/resumable/1.0-beta/js/resumable.js"></script>
	<script src="../static/neris-widget/uploader/1.25.1/js/neris.uploader.js"></script>
```

**说明：** 1.25.1版本配合后端解决了文件安全上传漏洞的问题；需要与<oltp-file.version>1.2.7.1-SNAPSHOT</oltp-file.version>配合使用

## 方法调用

```js
$(function(){
	$(divElement).nerisUploader(options);
});
```
>说明： divElement： 页面元素id，例如：&lt;div id="uploader"&gt;&lt;/div&gt; options: 上传组件初始化配置对象，详细见参数配置。

## options参数配置
### multi
- **类型 :** ```Boolean``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```true```<br>
- **描述 ：** 是否允许多附件上传 

### resumable
- **类型 :** ```Boolean``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```false```<br>
- **描述 ：**上传文件断点续  注意:使用本功能需要在file-config.propertiesp文件设定缓存数据块信息的时长（小时），如：expire_time=12

### chunkSize
- **类型 :** ```Number``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```1 x 1024 x 1024 B```<br>
- **描述 ：** 上传的数据块的大小  注:配置resumable为true时可配置此项 

### simultaneousUploads
- **类型 :** ```Number``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```3```<br>
- **描述 ：**  同时上传文件块的进程数   注:配置resumable为true时可配置此项 

### hideUploadBtn
- **类型 :** ```Boolean``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```false```<br>
- **描述 ：** 单附件上传完毕后，是否隐藏上传按钮 

### hideDownloadBtn
- **类型 :** ```Boolean``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```false```<br>
- **描述 ：** 是否隐藏下载文字 

### disableDialog
- **类型 :** ```Boolean``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```false```<br>
- **描述 ：** 是否禁用文件的在线预览功能

### _aElement
- **类型 :** ```Boolean``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```false```<br>
- **描述 ：** 所有文件类型都显示为可预览形式，openWindowScript提供用户自定义的预览支持的路径URL

### dialogHeight
- **类型 :** ```Number``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```600```<br>
- **描述 ：** 在线预览模态框 默认高度 	

### dialogWidth
- **类型 :** ```Number``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```800```<br>
- **描述 ：** 在线预览模态框 默认宽度 
	
### previewMode
- **类型 :** ```String``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```openDialog```<br>
- **描述 ：** 在线预览方式  默认为打开模态框(openDialog/openTab/openIframe/openCloseBtnIframe/doublePreview) 

>**说明：**
- openDialog： 弹出框预览；
- openTab： 弹出Tab窗口预览；
- openIframe： Iframe嵌入预览,不支持使用第三放插件预览；
- openCloseBtnIframe： 含有关闭按钮的Iframe嵌入预览；
- doublePreview： Iframe嵌入、弹出Tab窗口双重预览。双击title弹出Tab窗口预览。

### openIframeID
- **类型 :** ```String``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```nerisUploadIframe```<br>
- **描述 ：** 附件嵌入到页面中的Iframe ID,用来标识其唯一

### uploadScript
- **类型 :** ```String``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```doUpload```<br>
- **描述 ：** 上传附件服务端URL

### downloadScript
- **类型 :** ```String``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```doDownload```<br>
- **描述 ：** 下载附件服务端URL
	
### openWindowScript
- **类型 :** ```String``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```doDownloadOpenWindow```<br>
- **描述 ：** 模态框预览URL
				
### deleteScript
- **类型 :** ```String``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```doDelete```<br>
- **描述 ：** 删除附件服务端URL

### delDialog
- **类型 :** ```Boolean``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```false```<br>
- **描述 ：** 是否取消附件删除操作的异步请求，仅作页面删除

### confirmScript
- **类型 :** ```String``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```doConfirm```<br>
- **描述 ：** 确认附件服务端URL

### formData
- **类型 :** ```JSONObject``` | 
**是否必填 ：** ```是``` | 
**默认值 ：** ```null```<br>
- **描述 ：** 附加的请求参数，必须包含以下参数：currentUserAccount：当前登录用户名标识；srcApp：业务系统英文简称（大写非必填）；
```
	{ 
		'currentUserAccount' : 'sunyuewen',
		'srcApp':'PUBM'
	}
```

### fileSizeLimit
- **类型 :** ```String``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```100MB```<br>
- **描述 ：** 上传附件的大小限制，附件大小 <（小于） 此设置的值（可接受数字和KB MB GB表示方式如 1GB）

### buttonText
- **类型 :** ```String``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```选择附件<br>
- **描述 ：** 按钮文本

### readOnly
- **类型 :** ```Boolean``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```false```<br>
- **描述 ：** 只读（该参数与元数据数组配合使用会隐藏选择按钮生成只读列表）

### metaDatas
- **类型 :** ```Array``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```metaData```s<br>
- **描述 ：** 元数据数组。举例说明：
   	
```
	 [{
		'success':true,
		'message':'PUBM上传成功',
		'fileName':'0.1(2).txt',
		'fileSize':210,
		'fileKey':'PUBM_00_18658184c2c64a588145203b5e1ef52e.txt'，
		'receiveTime':1450078654683
	}]		
```
### queueID
- **类型 :** ```String``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```FileQueueAnduploadBtn_table .file-queue```<br>
- **描述 ：** 指定放置文件上传信息（如：名称、进度条、大小）的容器标签，配置的字符串是容器标签的ID

### onUploadComplete
- **类型 :** ```Function``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```onUploadComplete```<br>
- **描述 ：** 文件上传完成后回调该函数（参数：file，data），可覆盖此参数自主渲染展示效果

### customPreview
- **类型 :** ```Function``` | 
**是否必填 ：** ```否``` | 
**默认值 ：** ```previewFile```<br>
- **描述 ：** 自定义在线预览回调该函数（参数：fileKey）

## 接口函数
#### $(divElement).getFileMetaDatas();
获取元数据信息

#### $.previewFile(fileKey , previewMode , currentUserAccount ,openIframeID , dialogHeight , dialogWidth);
在线预览接口

>**说明：**
- fileKey： 附件标识
- previewMode： 预览打开方式 (openTab、openIframe、openDialog)
- currentUserAccount： 当前用户标识
- openIframeID： Iframe打开ID
- dialogHeight： 模态框及Iframe打开高度
- dialogWidth： 模态框及Iframe打开宽度


#### $.downloadFile(fileKey, currentUserAccount);
附件下载接口

>**说明：**
- fileKey： 附件标识
- currentUserAccount： 当前用户标识


#### $.uploadFileResumable(options);
附件上传接口

>**说明：**
- 调用函数初始化断点续传功能的上传组件并返回 “上传按钮”
- options： 对象形式的参数，按照参数配置说明配置各项功能

## 特别配置
>**说明：**file-config.properties配置
- 配置文件上传路径
```
  key_file_path=E:/UPLOAD/KEY.key
  注意：在本地设置上传路径，将KEY.key文件放入指定盘下面UPLOAD文件夹里
```
- 断点续传缓存未完成数据时长
```
  expire_time=1
  使用断点的续传功能时通过此配置设定缓存数据块信息的时长
```