!function($) {
	
   //1.17.1
	var md5ls=new Array();
	var files= new Array();
	var showErrorMessage = function(errorMessage, element) {
		
		if ($(element).find("input[type=file]").data('uploadifive').settings.errorHandler instanceof Function) {
			$(element).find("input[type=file]").data('uploadifive').settings
					.errorHandler(errorMessage);
		} else if (nerisDanger) {
			nerisInfo(errorMessage);
		} else {
			$(element).find("div#message").empty().show().append(errorMessage)
					.hide(20000);
		}
	};
	
	/*
		str:需要换行的字符串
		n:换行间隔字符数
	*/
	function insertEnter(str,n){
		var str2 = "";
		for(var i = 0; i < str.length; i += n){
			if(i + n < str.length){
				str2 += str.substring(i, i + n) + "<br>";
			}else{
				str2 += str.substring(i);
			}
		}
		return str2;
	}
	
	var fileSize_toString = function(b) {
		if (b / 1073741824 >= 1) {
			return (b / 1073741824).toFixed(2) + "GB";
		} else if (b / 1048576 >= 1) {
			return (b / 1048576).toFixed(2) + "MB";
		} else if (b / 1024 >= 1) {
			return (b / 1024).toFixed(2) + "KB";
		} else {
			return b + "B";
		}
	};

	if(undefined === top.uploaderNameSpace){
		top.uploaderNameSpace = {};
	}
	//此函数用来渲染初始化组件
	var Uploadifive = function(element, option) {
		var rootPath = getRootPath();
		//因为命名不规范故废弃，使用pluginPreview替换，为考虑兼容，内部始终保留
		//"pluginPreview"      : false,  //替换掉_aElement，支持第三方插件预览
	//定义一个map
		var defaultOption = {
			//'auto'             : false,
			"errorMessage" 		 : [],//错误信息
			"metaDatas" 		 : [], //元数据数组
			"forbiddenFileTypes" : [ ".exe", ".bat" ],
			"allowedFileTypes"	 : [],   
			"buttonText" 		 : "选择附件",   ///按钮
			"queueID" 			 : element.attr("id") + " .file-queue", //队列id 文件队列位置 
			"uploadScript" 		 : rootPath + "/doUpload", //上传路径   上传  删除  下载 取消的 scrip方法   
			"deleteScript" 		 : rootPath + "/doDelete",
			"confirmScript" 	 : rootPath + "/doConfirm",
			"downloadScript" 	 : rootPath + "/doDownload",	//直接下载
			"openWindowScript" 	 : "",	//模态框预览URL
			"delDialog" 		 : false, //是否取消删除操作的异步请求，只做页面删除
			"customPreview"      : previewFile,//覆盖此函数自定义预览
			"multi" 			 : true,  //是否允许上传多文件
			"hideUploadBtn" 	 : false,  //单附件上传完毕后，是否隐藏上传按钮。false为不隐藏
			"hideDownloadBtn"	 : false,  //是否隐藏 下载 文字。false为不隐藏
			"disableDialog" 	 : false,  //是否禁用PDF等文件的在线预览功能。false为不禁用
			"_aElement"          : false,  // 禁止预览或文件格式不支持预览时文件名称是否仍然显示超链接的样式
			"dialogHeight" 		 : 600,  //在线预览模态框 默认高度
			"dialogWidth" 		 : 1000,  //在线预览模态框 默认宽度
			"previewMode" 		 : "openDialog",  //在线预览方式  默认为打开模态框
			"openIframeID" 		 : "nerisUploadIframe",  //嵌入Iframe中预览 所属的Iframe ID  标识唯一
			"fileObjName" 		 : "file", //file文件对象名称
			"fileSizeLimit" 	 : "100MB",//文件最大尺寸限制
			"fileType" 			 : false,//上传文件类型
			"formData" 			 : null,///formData': { 'ID': 11 }----由于这里初始化时传递的参数，当然就这里就只能传静态参数了  
			"overrideEvents" 	 : [ "onError"],///设置哪些事件可以被重写
			"onError" : function(errorType, file) {
				switch (errorType) {
				case "UPLOAD_LIMIT_EXCEEDED":
					this.uploadifive('cancel', file);
					showErrorMessage("[" + insertEnter(file.name,20) + "] 超过可上传的最大文件数量！",
							element);
					break;
				case "FILE_SIZE_LIMIT_EXCEEDED":
					this.uploadifive('cancel', file);
					showErrorMessage("["
							+ insertEnter(file.name,20)
							+ "] 超过文件大小限制（"
							+ $(element).find("input[type=file]").data(
									'uploadifive').settings.byte2string($(
									element).find("input[type=file]").data(
									'uploadifive').settings.fileSizeLimit)
							+ "）！", element);
					break;
				case "FORBIDDEN_FILE_TYPE":
					this.uploadifive('cancel', file);
					showErrorMessage("非法的文件类型（"
							+ $(element).find("input[type=file]").data(
									'uploadifive').settings.fileType + "）！",
							element);
					break;
				case "404_FILE_NOT_FOUND":
					this.uploadifive('cancel', file);
					showErrorMessage("上传组件无法连接到服务器！", element);
					break;
				default:
					this.uploadifive('cancel', file);
					showErrorMessage("[" + insertEnter(file.name,20) + "] 上传组件未知错误！"
							+ errorType, element);
				}
			},
			"onUploadComplete" : function(file, data) {
				var _settings = $(element).find("input[type=file]").data('uploadifive').settings;
				var _data = JSON.parse(data);
				file.fileKey = _data.fileKey;
				files.push(file);
				$.each($(element).find(".filename") , function(i, span) {
						////去掉&nbsp;
						var newname=$(span).html().replace('&nbsp;',' ').replace(/(^\s+)|(\s+$)/g,"").replace(/\s/g,"").replace("&amp;","&");
				        var result3 = file.name.replace(/(^\s+)|(\s+$)/g,"").replace(/\s/g,"");
				       if(!_settings.multi){
								//单附件上传完毕后，是否隐藏上传按钮 默认为不隐藏
								if(_settings.hideUploadBtn){
									$("#uploadifive-file_uploader").fadeOut(500);
								}
								$.each(_settings.metaDatas,function(i, metaData) {
									//每次执行删除第一个附件
									$(element).find(".close:first").click();
								});
						}
						if ($(span).html()== file.name||newname==result3) {
								if (_data.success) {
								//把文件信息放入metaDatas中
									if(typeof (_settings.metaDatas) == "string"){
											$(_settings.metaDatas) = new Array();
									}
									_settings.metaDatas.push(_data);
									var preveiwDialog = !_settings.disableDialog && previewSuffix(_data.fileKey);//是否支持预览并且文件类型也支持预览
									var whetherPreview = _settings._aElement ? true : preveiwDialog;	//该值用于判断是否显示<a>标签样式的连接效果
								/*	$(span).html("<input type=\"hidden\" name=\"filekey\" value=\""+JSON.parse(data).fileKey+"\" >" +
											((whetherPreview) ? ("<a href=\"javascript:void(0)\">"+ file.name + "</a>") : file.name ));*/
									previewFileName($(span),_data.fileKey, file.name,whetherPreview);
									//绑定在线预览
									if(whetherPreview){
										$(span).find("a").on("click",function() {
											_settings.customPreview(_data.fileKey , _settings.previewMode , _settings.formData.currentUserAccount ,
													_settings.openIframeID , _settings.dialogHeight , _settings.dialogWidth, _settings._aElement);
										});
									}

									//显示文件大小 fileinfo 初始化是没有的 是上传组件自动生成的区域
									$(span).siblings(".fileinfo").html(
											" - "+ _settings.byte2string(file.size)
											+ "<a  href=\"javascript:void(0)\"><i class=\"icon-download-alt\"></i>下载</a>"
									).show();
									
									//向<span class='fileinfo'><span>后追加div 样式。解决浏览器缩小后文字溢出阴影外的问题
									$(span).siblings(".fileinfo").after("<div class=\"clearfix\"></div>");
									
									///绑定直接下载
									$(span).siblings(".fileinfo").find("a").on("click",function() {
											downloadFile(_data.fileKey,_settings.downloadScript,_settings.formData.currentUserAccount);
									});
									
									//-- 如果隐藏 "下载"  则移除 <a>下载</a> 标签
									if(_settings.hideDownloadBtn){
										$(span).siblings(".fileinfo").find("a").remove();
									}
									
								} else {
									$(span).siblings(".fileinfo").html("<span style=\"color:red;\"> - 上传失败</span>").show();
									//向<span class='fileinfo'><span>后追加div 样式。解决浏览器缩小后文字溢出阴影外的问题
									$(span).siblings(".fileinfo").after("<div class=\"clearfix\"></div>");
								}

							}
						});
				uploadCallBack();
			},
			"onCancel" : function(file) {
				var _settings = $(element).find("input[type=file]").data('uploadifive').settings;
				//文件被删除时触发  
				//缓存文件删除md5
					 $.each(files, function(i,item){
						 if(undefined != item&&file.name==item.name){
							 files.splice(i,1);
						 }
					  });
					 if(undefined !== file.fileKey){
						deleteFile(file.fileKey,_settings);
					 }
					//单附件上传，删除附件后，显示所隐藏的按钮	
					$("#uploadifive-file_uploader").fadeIn(500);
			},
			"onUpload" : function(filesToUpload){
				$.each($("span:contains('- 上传失败')"),function(i, span) {
						$(span).parent().parent().remove();
				});
			},
			"onQueueComplete" : function(uploads) {
				var _settings = $(element).find("input[type=file]").data('uploadifive').settings;
			///已处理队列中所有的文件时触
				if (_settings.onAllUploadCompleted instanceof Function) {
					_settings.onAllUploadCompleted(_settings.metaDatas);
				}
			},
			"onAddQueueItem" : function(file) {
				var _settings = $(element).find("input[type=file]").data('uploadifive').settings;
				///???什么时候触发
				if (0 == file.size) {
					showErrorMessage("[" + insertEnter(file.name,20) + "] 是空文件，无法上传！", element);
					this.uploadifive('cancel', file);
				} else if (-1 != $.inArray(file.name.substring(file.name.lastIndexOf(".")).toLowerCase(),
						_settings.forbiddenFileTypes)) {
					showErrorMessage("[" + insertEnter(file.name,20) + "] 为非法附件类型！", element);
					this.uploadifive('cancel', file);
				} else if ((-1 == $.inArray(file.name.substring(file.name.lastIndexOf(".")).toLowerCase(),
						_settings.allowedFileTypes)) && _settings.allowedFileTypes.length != 0) {
					showErrorMessage("[" + insertEnter(file.name,20) + "] 为非法附件类型！", element);
					this.uploadifive('cancel', file);
				/*	showErrorMessage("允许的附件类型为: [ "
							+ $(element).find("input[type=file]").data(
									'uploadifive').settings.allowedFileTypes
							+ " ]", element);*/
				}
			},
			"onAllUploadCompleted" : false,
			"onQueueItemCancelled" : false,
			"byte2string" : fileSize_toString,
			"viewCallBack" : function(){}//组件不支持的文件格式用户自定义使用插件预览，弹出框对调用该会掉函数
		};

		
		option = $.extend(defaultOption, option);
		if(typeof option.viewCallBack == 'function'){
			top.uploaderNameSpace.viewCallBack = option.viewCallBack;
		}
		//uploadfive对文件大小限制转换取省略值，顾在此去不转换成KB
		if (isNaN(option.fileSizeLimit)) {
            var fileSizeLimitBytes = parseInt(option.fileSizeLimit);
            if (option.fileSizeLimit.indexOf('MB') > -1) {
                option.fileSizeLimit = (fileSizeLimitBytes * 1024) + "KB";
            } else if (option.fileSizeLimit.indexOf('GB') > -1) {
                option.fileSizeLimit = (fileSizeLimitBytes * 1024 * 1024) + "KB";
            }
        }
		var renderTable = function(element, option) {
		
			//清空页面div uploader
			element.empty();
			//表对象
			var table = $("<table style=\"width:100%;\" ></table>");
             //第一个行对象
			var uploaderTr = $("<tr></tr>");
			//单元格对象
			var queueTd = $("<td style=\"width: 100%;\"></td>");
            // 编辑时的区域 初始化为空
			var edit = $("<div id=\"dxc\" style=\"margin-right:10px;\"></div>");

			//metaDatas 初始化数组参数   ??? 此处循环在编辑状态下可用
			if(option.metaDatas.length !== 0){
				edit = loadUploadedData(element,option);
			}
            //queue 多个文件区域总和  初始化为空
			var queue = $("<div class=\"file-queue\" style=\"margin-right:10px;\"></div>");
			//第一个单元格添加编辑区并且添加文件区域 
			queueTd.append(edit).append(queue);
			//第二个是按钮单元格
			var buttonTd = $("<td rowspan=\"3\" style=\"text-align:center;\"></td>");
			// <!-- 组件主体按钮 文本类型  用id跟option 里面的对照-->
			var input = $("<input type=\"file\" id=\"file_uploader\" name=\"file_uploader\">");
			//对应页面元素选择附件按钮
			buttonTd.append(input);
			//行对象添加 多个文件区域单元格与控件主题按钮单元格
			uploaderTr.append(queueTd).append(buttonTd);

			//第二个行对象添加信息提示
			var messageTr = $("<tr></tr>");
			var messageTd = $("<td style=\"text-align:left;\"><div id=\"message\" style=\"color:red;\"></div></td>");
			
			messageTr.append(messageTd);
			//表格添加2行
			table.append(uploaderTr);
			table.append(messageTr);
             //页面div添加这个表格
			element.append(table);
			//按钮根据参数渲染出一个上传下载uploadifive控件
			input.uploadifive(option);
			//使回显时配置的metaDatas第一时间与同步到组件上
			setMetaDatas(element, option.metaDatas);
			//初始完上传组件在组件上声明数组delMetaDatas用于存放回显后被做删除操作的metaDatas
			//当用户提交操作是调用确认删除时从本数组中获取key在对文件进行删除操作
			$(element).find("input[type=file]").data('uploadifive').settings.delMetaDatas = [];
			
			//单附件上传，删除附件后，显示所隐藏的按钮
			if((!option.multi) && option.hideUploadBtn && option.metaDatas.length > 0){
				$("#uploadifive-file_uploader").hide();
			}
			
		};	
		//渲染动作这个函数是上传插件的方法
		renderTable(element, option);
	/*	此段代码是 配合取消自动上传而写的手动上传按钮
	 * var butn = $("<div><button id='bubububtn' type='button'>点击上传</button></div>");
		$(element).append(butn);
		butn.click(function(){
			$("#file_uploader").uploadifive('upload');
		});*/
		
	};
	//函数对象Uploadifive 结束
	
	
	/**
	 * 下载的的函数对象
	 * @param element : 容器
	 * @param option : 参数配置项
	 */
	var Downloader = function(element, option) {
		var rootPath = getRootPath();
		var settings = {
			"currentUserAccount" : null,
			"downloadScript"     : rootPath + "/doDownload",
			"openWindowScript"   : "",
			"delDialog" 		 : false, //是否取消删除操作的异步请求，只是页面删除
			"dialogHeight"       : 600,  //在线预览模态框 默认高度
			"dialogWidth"        : 1000,  //在线预览模态框 默认宽度
			"previewMode"        : "openDialog",  //在线预览方式  默认为打开模态框
			"openIframeID"       : "nerisUploadIframe",  //在线预览方式  默认为打开模态框
			"customPreview"      : previewFile,//覆盖此函数自定义预览
			"metaDatas"          : [],
			"onDeleteComplete"   : null,
			"byte2string"        : fileSize_toString,
			"viewCallBack" : function(){}//组件不支持的文件格式用户自定义使用插件预览，弹出框对调用该会掉函数
		};
		
		option = $.extend(settings, option);
		
		if(typeof option.viewCallBack == 'function'){
			top.uploaderNameSpace.viewCallBack = option.viewCallBack;
		}
		element.empty();
		if(option.metaDatas.length !== 0){
			var edit = loadUploadedData(element,option);
			edit.find('.close').remove();
			element.append(edit);
		}
	};//下载的函数对象结束
	
//---------------------------------------------------------------------------------------------------------------------	
	/**
	 * 渲染上传文件列表时，调用本方法回显已经存在的文件信息
	 * @param element : 插入上传组件的容器
	 * @param option : 上传组件的配置参数
	 */
	var loadUploadedData = function(element,option) {
		
		var edit = $("<div id=\"dxc\" style=\"margin-right:10px;\"></div>");
		$.each(option.metaDatas,function(i, metaData) {
			if(metaData.fileSize == undefined && metaData.fileKey != undefined){
				$.ajax({
					type : "GET",
					url : getRootPath() + "/doFindFile",
					data : {
						"fileKey":metaData.fileKey
					},
					async: false,//使用同步的方式,true为异步方式
					dataType : "json",
					success : function(data) {
						metaData.fileSize = data.fileSize;
					},
					error : function(xhq, errMsg, e) {
						showErrorMessage("加载远程数据发生错误！", element);
					}
				});
			}
			var preveiwDialog = !option.disableDialog && previewSuffix(metaData.fileKey);
			var whetherPreview = option._aElement ? true : preveiwDialog;	//附件格式是否支持在线预览  默认为false
			//代表这一个文件的显示区域
			var queueItem = $("<div class=\"uploadifive-queue-item\"></div>");
			//关闭按键
			var close = $("<a class=\"close\"  href=\"javascript:void(0)\"></a>");
			//文件名称显示区
			var fileName = $("<div><span  class=\"filename\"><input type=\"hidden\" name=\"filekey\" value=\""+metaData.fileKey+"\" >" +
							((whetherPreview) ? ("<a href=\"javascript:void(0)\">" + metaData.fileName + "</a></span>") : (metaData.fileName+"</span>"))+ 
							((metaData.fileSize) ? ("<span class=\"fileinfo\">" +  "  - "+ option.byte2string(metaData.fileSize)): ("<span class=\"fileinfo\"> "))
							+ "<a  href=\"javascript:void(0)\"><i class=\"icon-download-alt\"></i>下载</a>  </span><div class=\"clearfix\"></div> </div>");
							//上面如果文件大小为零则显示空  如果不是则显示 -*MB(KB) 后缀名
							queueItem.append(close).append(fileName);
							
			//filename 的一个兄弟元素，即 <a> xxxxx </a> 绑定单击事件 预览
			if(whetherPreview){
				fileName.find(".filename > a").on("click",function() {
					option.customPreview(metaData.fileKey , option.previewMode , option.formData.currentUserAccount ,
							option.openIframeID , option.dialogHeight , option.dialogWidth,option._aElement);
				});
			}
			
			//fileinfo 的一个兄弟元素，即 <a> 下载 </a> 绑定单击事件
			fileName.find(".fileinfo > a").on("click",function() {
				downloadFile(metaData.fileKey , option.downloadScript , option.formData.currentUserAccount);
			});
			
			//-- 如果隐藏 "下载"  则移除 <a>下载</a> 标签
			if(option.hideDownloadBtn){
				fileName.find(".fileinfo > a").remove();
			}
			
			//关闭按钮删除动作
			close.on("click", function() {
				var _settings = $(element).find("input[type=file]").data('uploadifive').settings;
				//因为回显数据是从业务系统数据库中查找的数据，所以在回显时业务系统未对数据修改附件信息时当前附件不能删除
				var deleteDatas = _settings.delMetaDatas;
				deleteDatas.push(metaData);
				
					deleteFile(metaData.fileKey,option);
			
				$(this).parent().delay().fadeOut(500, function() {
                    $(this).remove();   
                 });
				//_settings.metaDatas.splice($.inArray(metaData,_settings.metaDatas),1 );
				//单附件上传，删除附件后，显示所隐藏的按钮
					$("#uploadifive-file_uploader").fadeIn(500);
			});
			//编辑区添加文件区域
			edit.append(queueItem);
		});
		return edit;
	};
//---------------------------------------------------------------------------------------------------------------------
	
	//下载函数
	var downloadFile = function(fileKey, downloadScript, currentUserAccount) {
		var downloadForm = $("<form action=\"" + downloadScript
				+ "\" method=\"post\" style=\"display: none;\"></form>");
		var fileKeyInput = $("<input type=\"text\" id=\"fileKey\" name=\"fileKey\" value=\""
				+ fileKey + "\" />");
		var currentUserInput = $("<input type=\"text\" id=\"currentUserAccount\" name=\"currentUserAccount\" value=\""
				+ currentUserAccount + "\" />");
		downloadForm.append(fileKeyInput).append(currentUserInput);
		$("body").append(downloadForm);
		downloadForm.submit();
		downloadForm.remove();
	};

	/*var confirmDeleteFile = function(element){
	var _settings = $(element).find("input[type=file]").data('uploadifive').settings;
	var metaDatas = _settings.delMetaDatas;
	if (0 != metaDatas.length) {
			var fileKeys = "";
			$.each(metaDatas, function(i,metaData) {
					fileKeys += "," + metaData.fileKey;
			});
			fileKeys = fileKeys.substring(1);
			 var deleteMag = JSON.parse($.ajax({
				async : false,
				url : _settings.deleteScript,
				type : "post",
				data : {
					fileKey : fileKeys,
					currentUserAccount : _settings.formData.currentUserAccount
				},
				dataType : "json",
				success : function(data, textStatus) {
				},
				error : function(xhq, errMsg, e) {
					console.error("加载远程数据发生异常！");
				}
		}).responseText).success;
		_settings.delMetaDatas = [];
		return deleteMag;
	}
};*/

	/**
	 * option是对象包含
	 * {'fileKey' : 删除文件的key
	 * 'deleteScript' : 后台的访问url
	 * 'currentUserAccount' : 当前用户
	}*/
	var deleteFile = function(fileKey,option) {
		   $.each(files, function(i,item){  
				if(undefined != item && fileKey == item.fileKey){
					files.splice(i,1); 
				}
		   });
		   $.each(option.metaDatas, function(i, metaData) {
			   if (metaData && metaData.fileKey == fileKey) {
				   option.metaDatas.splice($.inArray(metaData,option.metaDatas),1 );
			   }
		   });
		   if(option.delDialog){
			   return false;
		   }
		   return JSON.parse($.ajax({
				async : false,
				url : option.deleteScript,
				type : "post",
				data : {
					fileKey : fileKey,
					currentUserAccount :option.formData.currentUserAccount
				},
				dataType : "json",
				success : function(data, textStatus) {
				},
				error : function(xhq, errMsg, e) {
					console.error("加载远程数据发生异常！");
					//showErrorMessage("加载远程数据发生错误！",element);
				}
			}).responseText).success;	
	};

	//确认
	var doConfirm = function(element, callback) {
		var _settings =  $(element).find("input[type=file]").data('uploadifive').settings;
		if (0 != _settings.metaDatas.length) {
			var fileKeys = "";
			$.each(_settings.metaDatas, function(i,metaData) {
					fileKeys += "," + metaData.fileKey;
			});

			fileKeys = fileKeys.substring(1);
			
			return JSON.parse($.ajax({
				async : false,
				url : _settings.confirmScript,
				type : "post",
				data : {
					fileKeys : fileKeys
				},
				dataType : "json",
				success : function(data, textStatus) {
					if (callback)
					callback(data);
				},
				error : function(xhq, errMsg, e) {
					console.error("加载远程数据发生异常！");
					//showErrorMessage("加载远程数据发生错误！", element);
				}
			}).responseText).success;
			
		} else {
			showErrorMessage("没有可确认的附件！", element);
		}
	};

	var getMetaDatas = function(element) {
		var data_uploadifive = $(element).find("input[type=file]").data('uploadifive');
		if (data_uploadifive) {
			var  metaDatas= data_uploadifive.settings.metaDatas;
			var filekeys=	$("input[name='filekey']");
			var returnmates=new Array();
			$.each(filekeys, function(i,filekey) {
				
				$.each(data_uploadifive.settings.metaDatas, function(i,metaData) {
					if(metaData.fileKey==filekey.value){
						returnmates.push(metaData);
					}
				});
				
			});
			return returnmates;
		} else {
			return undefined;
		}
	};

	var setMetaDatas = function(element, metaDatas) {
		var data_uploadifive = $(element).find("input[type=file]").data('uploadifive');
		if (data_uploadifive) {
			var _settings = data_uploadifive.settings;
			_settings.metaDatas = metaDatas;
		}
	};

	/**
	 *重新新渲染上传文件列表名称，根据需求加超链接效果 
	 *element 元素标签对象
	 *preview Boolea 判断是否添加效果
	 */
	var previewFileName = function(element,fileKey,name,preview) {
		element.html("<input type=\"hidden\" name=\"filekey\" value=\""+fileKey+"\" >" +
				(preview ? ("<a href=\"javascript:void(0)\">"+ name + "</a>") : name ));
	};
	
	/**
	 * 判断该文件的格式是否允许预览,
	 * 参数是有后缀的文件名或fileKey，这里定义为fileKey
	 */
	var previewSuffix = function(fileKey){
		if(fileKey != undefined){
			var point = fileKey.toString().lastIndexOf("."); 
			var type = fileKey.toString().substr(point).toLowerCase();   ; 
			if(type==".jpg"||type==".gif"||type==".pdf"||type==".txt"||type==".png"||type==".jpeg"){
				return true;	//如果是上述格式，则可以支持在线预览
			}
		}
		return false ;
	};
	//模态框预览PDF
	var downloadFileOpenWindow = function(fileKey, openUrl, currentUserAccount,dialogHeight,dialogWidth){
		
		addCenterWindow(openUrl + "?fileKey="+fileKey
				+"&currentUserAccount="+encodeURI(encodeURI(currentUserAccount))+"&dialogHeight="+dialogHeight
				+"&dialogWidth="+dialogWidth+"&previewMode=openDialog",
				"showUpload", dialogHeight, dialogWidth, null, null);
	};
	//新建窗口预览PDF
	function downloadFileOpenTab(fileKey, openUrl, currentUserAccount){
		var path = openUrl+"?fileKey="+fileKey+"&currentUserAccount="+encodeURI(encodeURI(currentUserAccount))+"&previewMode=openTab";
		var availWidth = screen.availWidth;
		var availHeight = screen.availHeight;
		window.open(path,'',' width=' + availWidth + ', height='+ availHeight +' channelmode=yes, fullscreen=yes, location=no, menubar=no, scrollbars=no, status=no, toolbar=no');
	}
	
	//嵌入到Iframe中预览PDF
	function downloadFileOpenIframe(fileKey, currentUserAccount, dialogHeight, dialogWidth, openIframeID){
		var openUrl =getRootPath()+"/doDownloadWindow";
		var openIframe = $("#"+openIframeID);
		openIframe.attr("src", openUrl+"?fileKey="+fileKey+"&currentUserAccount="+encodeURI(encodeURI(currentUserAccount))+"&downloadOrOpen=open");
		openIframe.attr("width",dialogWidth);	//设置指定Iframe 宽度
		openIframe.attr("height",dialogHeight);	//设置指定Iframe 高度
		openIframe.attr("frameborder","no");	//设置指定Iframe 无边框
		openIframe.attr("allowtransparency","yes");	//设置指定 Iframe 背景透明
		openIframe.show();
	}
	//嵌入到Iframe中有关闭按钮的预览
	function openCloseBtnIframe(fileKey, currentUserAccount, dialogHeight, dialogWidth, openIframeID, openUrl){
		var openIframe = $("#"+openIframeID);
		openIframe.attr("src", openUrl+"?iframeId="+openIframeID+"&fileKey="+fileKey+"&currentUserAccount="+encodeURI(encodeURI(currentUserAccount))+"&dialogHeight="+dialogHeight+"&downloadOrOpen=open");
		openIframe.attr("width",dialogWidth);	//设置指定Iframe 宽度
		openIframe.attr("height",dialogHeight);	//设置指定Iframe 高度
		openIframe.attr("frameborder","no");	//设置指定Iframe 无边框
		openIframe.attr("allowtransparency","yes");	//设置指定 Iframe 背景透明
		openIframe.show();
		
		/*openIframe.load(function(){//iframe预览内容加载完成
			var closeBtn = openIframe.contents().find(".popup_title button");
			console.log(closeBtn);
			closeBtn.removeAttr("onclick");
			closeBtn.on("click",function(){
				openIframe.contents().empty();
				openIframe.hide();
			});
		});*/
	}
	
	/**
	 * 本函数调用原有的两种预览方式同时预览同一个文件，
	 * 即含有关闭按钮的iframe预览和弹出Tab预览
	 */
	function doublePreview (fileKey, currentUserAccount, dialogHeight, dialogWidth, openIframeID, openUrl) {
		var availWidth = screen.availWidth;
		var availHeight = screen.availHeight;
		//因为本预览title双击事件是再次调用弹出Tab预览，为避免混乱所以添加了访问路径/doublePreview，返回页doublePreviewFile.jsp
		var url = getRootPath() + "/doublePreview";
		var path = openUrl + "?fileKey="+fileKey+"&currentUserAccount="+encodeURI(encodeURI(currentUserAccount))+"&previewMode=openTab";
		openCloseBtnIframe (fileKey, currentUserAccount, dialogHeight, dialogWidth, openIframeID, url);	
		if(previewSuffix(fileKey)){
			window.open(path,'',' width=' + availWidth + ', height='+ availHeight +' channelmode=yes, fullscreen=yes, location=no, menubar=no, scrollbars=no, status=no, toolbar=no');
		}
		
	}
	
	/**
	 * 预览附件 接口方法（其他模块可直接调用该方法进行附件预览）
	 * 附件标识  fileKey
	 * 预览打开方式 previewMode
	 * 当前用户标识  currentUserAccount
	 * Iframe打开ID  openIframeID
	 * 模态框及Iframe打开高度 dialogHeight
	 * 模态框及Iframe打开宽度 dialogWidth
	 * 本函数直接暴露对外，如果直接调用时没有previewUrl参数故为undefined
	 */
	function previewFile(fileKey, previewMode, currentUserAccount, openIframeID,
										dialogHeight, dialogWidth, aElement){
		var openWindowUrl = getRootPath() + "/doDownloadOpenWindow";
		if(!(previewSuffix(fileKey)) && aElement){//判断文件格式
			openWindowUrl = getRootPath() + "/openWindowPlugView";
		}
		switch (previewMode) {
			case "openTab"://新建窗口预览附件
				downloadFileOpenTab(fileKey, openWindowUrl, currentUserAccount);
				break;
			case "openIframe":
//				downloadFileOpenIframe(fileKey, openWindowUrl, currentUserAccount, dialogHeight, dialogWidth, openIframeID);
				downloadFileOpenIframe(fileKey, currentUserAccount, dialogHeight, dialogWidth, openIframeID);
				break;
			case "openCloseBtnIframe":
				openCloseBtnIframe(fileKey, currentUserAccount, dialogHeight, dialogWidth, openIframeID, openWindowUrl);
				break;
			case "openDialog"://使用模态框形式预览附件
				downloadFileOpenWindow(fileKey, openWindowUrl, currentUserAccount, dialogHeight, dialogWidth);
				break;
			case "doublePreview"://双预览方式
				doublePreview (fileKey, currentUserAccount, dialogHeight, dialogWidth, openIframeID, openWindowUrl);
			break;
		}
	}
	
	//js获取项目根路径，如： http://localhost:8080/tech-widget-test
	function getRootPath(){
	    //获取当前网址，如： http://localhost:8080/tech-widget-test/ShowUpload
	    var curWwwPath=window.document.location.href;
	    //获取主机地址之后的目录，如：tech-widget-test/ShowUpload
	    var pathName=window.document.location.pathname;
	    var pos=curWwwPath.indexOf(pathName);
	    //获取主机地址，如：  http://localhost:8080
	    var localhostPaht=curWwwPath.substring(0,pos);
	    //获取带"/"的项目名，如：/tech-widget-test
	    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	    return (localhostPaht+projectName);
	}
	
//=========================================================================================================	
	/**
	 * resumbale上传方式的入口
	 * @param element ： 容器标签
	 * @param option ： 配置项
	 */
	var uploadFileResumable = function(element,option){
        // 渲染文件列表的操作按钮模板
      $data.queue_item =  $('<div class="uploadifive-queue-item">\
   			 <div class="controlButton"><a class="close_upload" href="javascript:void(0);"></a>\
   			 <a class="refresh_upload" href="javascript:void(0);"></a>\
   			 <a class="stop_upload" href="javascript:void(0);"></a>\
   			 <a class="play_upload" href="javascript:void(0);"></a></div>\
                <div><span class="filename"></span><span class="fileinfo"></span>\
   			 <div class="clearfix"></div></div>\
                <div class="progress">\
                    <div class="progress-bar"></div>\
                </div>\
            </div>');
    var rootPath = getRootPath();     
	var defaultOption = {
	        "target" : option.uploadScript || (rootPath + '/resumableUpload'),  //上传请求的URL
	        "chunkSize" : 1*1024*1024,  //每个上传的数据块的大小(以字节为单位(默认值:1 * 1024 * 1024)
	        "simultaneousUploads" : 3,  //同时上传文件块的进程数，可以同时允许多个文件块上传(默认值:3)
	        "testChunks" : true,        //上传文件块是否先通过get方式发送文件信息检测文件是否已经上传。
	        "throttleProgressCallbacks" : 1,  //进度回调节流阀，默认0.5，越小越快
	        "method" : "octet",
	        "buttonText" : "选择附件",
	        "query" : option.formData,//可配置扩展请求提交的信息
	        "deleteScript" : rootPath + "/doDelete",//取消删除rul
			"confirmScript" : rootPath + "/doConfirm",//附件确认url
			"downloadScript" : rootPath + "/doDownload",//下载url
			"openWindowScript" 	 : rootPath + "/doDownloadOpenWindow",//模态框预览URL
			"delDialog" 		 : false, //是否取消删除操作的异步请求，只是页面删除
			"multi" 	: true,//是否允许上传多文件
			"customPreview"      : previewFile,//覆盖此函数自定义预览
	        "dialogHeight" 	: 600,  //在线预览模态框 默认高度
			"dialogWidth" 	: 1000,  //在线预览模态框 默认宽度
			"metaDatas" 		 : [], //元数据数组
			"forbiddenFileTypes" : [ ".exe", ".bat" ],//不允许上传的文件类型
			"allowedFileTypes"	 : [],
			"_aElement"          : false,  // 禁止预览或文件格式不支持预览时文件名称是否仍然显示超链接的样式
			"previewMode" 		 : "openDialog",  //在线预览方式  默认为打开模态框
			"disableDialog" 	 : false,  //是否禁用PDF等文件的在线预览功能。false为不禁用
			"hideUploadBtn" 	 : false,  //单附件上传完毕后，是否隐藏上传按钮。false为不隐藏
			"hideDownloadBtn"	 : false,  //是否隐藏 下载 文字。false为不隐藏
			"openIframeID" 		 : "nerisUploadIframe",  //嵌入Iframe中预览 所属的Iframe ID  标识唯一
			"fileSizeLimit"      : '1GB',
			"queueID" 			 :  "FileQueueAndUploadBtn_table .file-queue", //展示文件队列的位置,字符串为将容器标签的ID
			"onUploadComplete"   : function(file,data){//文件上传完成事件
	        
	        	  //文件上传完成隐藏 暂停 、继续、刷新等按钮
	        	  file.queueItem.find('.play_upload').hide();
	        	  file.queueItem.find('.stop_upload').hide();
	        	  file.queueItem.find('.refresh_upload').hide();
	        	  file.queueItem.find('.progress-bar').css('width', '100%');
	        	  var preveiwDialog = !option.disableDialog && previewSuffix(file.fileName);//是否支持预览并且文件类型也支持预览
	        	  var whetherPreview = option._aElement ? true : preveiwDialog;	//该值用于判断是否显示<a>标签样式的连接效果
	        	  var $span = file.queueItem.find(".filename");
	        	  previewFileName($span,file.fileKey,file.fileName,whetherPreview);
	        	//绑定在线预览
	        	  if(whetherPreview){
						$span.find("a").on("click",function() {
							option.customPreview(file.fileKey , option.previewMode , option.query.currentUserAccount ,
									option.openIframeID , option.dialogHeight , option.dialogWidth, option._aElement);
						});
					}
	        	  
	        	
	              
	          	  var _data = JSON.parse(data);
	              
	              if(!_data.success){
	            	  file.queueItem.find('.fileinfo').empty();
	            	  file.queueItem.find('.fileinfo').html("<span style=\"color:red;\"> - 上传失败</span>").show();
						//向<span class='fileinfo'><span>后追加div 样式。解决浏览器缩小后文字溢出阴影外的问题
	            	  file.queueItem.find('.fileinfo').after("<div class=\"clearfix\"></div>");
	        	  }else{
	        		  file.queueItem.find('.fileinfo').empty();
		              file.queueItem.find('.fileinfo').html("- " + fileSize_toString(file.size) 
		            		  + "<a  href=\"javascript:void(0)\"><i class=\"icon-download-alt\"></i>下载</a>").show();
		          	///绑定直接下载
		              $span.siblings(".fileinfo").find("a").on("click",function() {
								downloadFile(file.fileKey,option.downloadScript,option.query.currentUserAccount);
						});
	        	  }
					//-- 如果隐藏 "下载"  则移除 <a>下载</a> 标签
					if(option.hideDownloadBtn){
						$span.siblings(".fileinfo").find("a").remove();
					}
	        },
	       "onError" : function(file, message){
	    	   	file.queueItem.find(".fileinfo").html("<span style=\"color:red;\"> - 上传失败</span>").show();
	       },
	       "onAddFile" : function(file, r) {//添加事件
	         	 var currentFile = file.queueItem = $data.queue_item.clone();
	         	 currentFile.attr('id', 'resumable-file-' + $data.fileID++ );
	         	 currentFile.find(".filename").html(file.fileName);
	         	 currentFile.find(".close_upload").bind('click', function() {
	         		 methods.cancelFile(file);
	                  return false;
	         	 });
	         	 var resume = currentFile.find(".play_upload");
	 	         var pause = currentFile.find(".stop_upload");
	 	         var retry = currentFile.find(".refresh_upload");
	 	        	resume.bind('click',function(){
	 	        		r.upload();
	 	        	});
	 	        	pause.show();
	 	        	pause.bind('click',function(){
	 	        		r.pause();
	 	        	});
	 	        	retry.show();
	 	        	retry.bind('click',function(){
	 	        		r.files[0].retry();
	 	        	});
	 	        	$("#"+option.queueID).append(currentFile);
	       },
	       "onProgress" : function(file){//进度条
           	  file.queueItem.find('.fileinfo').html("- " + Math.floor(file.progress()*100) + '%');
           	  file.queueItem.find('.progress-bar').css('width', Math.floor(file.progress()*100) + '%');
	       },
	       "viewCallBack" : function(){}//组件不支持的文件格式用户自定义使用插件预览，弹出框对调用该会掉函数
     };
		
		option = $.extend(defaultOption,option);
		if(typeof option.viewCallBack == 'function'){
			top.uploaderNameSpace.viewCallBack = option.viewCallBack;
		}
		if (isNaN(option.fileSizeLimit)) {
            var fileSizeLimitBytes = parseInt(option.fileSizeLimit) * 1.024;
            if (option.fileSizeLimit.indexOf('KB') > -1) {
                option.fileSizeLimit = fileSizeLimitBytes * 1000;
            } else if (option.fileSizeLimit.indexOf('MB') > -1) {
                option.fileSizeLimit = fileSizeLimitBytes * 1000000 * 1.024;
            } else if (option.fileSizeLimit.indexOf('GB') > -1) {
                option.fileSizeLimit = fileSizeLimitBytes * 1000000000 * 1.024 * 1.024;
            }
        } else {
            option.fileSizeLimit = option.fileSizeLimit * 1024;
        }
	
		var methods = {
				/**
				 * 在指定位置加入input标签
				 * target：input标签插入的目标容器
				 */
				creatInput : function(target,multi){
					var input = document.createElement('input');
			        input.setAttribute('type', 'file');
			        if(multi){
			            input.setAttribute('multiple', 'multiple');
			        }
			        input.style.display = 'none';
			        input.addEventListener('change', function(e){
			        	var files = e.target.files;
			        	for(var i = 0, len = files.length; i < len; i++){
			        		var r = new Resumable(option);
			        		 if(!r.support) { // 当前浏览器是否支持Resumable.js
			        			
			        		 }else{
			        			 methods.handlResumable(element,option,r);
			        		 } 
			        		 if(files[i].size === 0){
			        			 showErrorMessage("[" + insertEnter(files[i].name,20) + "] 是空文件，无法上传！", target);
			        		 }
			        		r.addFile(files[i],e);
			        	}
			        
			        });
			        target.on('click', function(){
			            input.style.opacity = 0;
			            input.style.display='block';
			            input.focus();
			            input.click();
			            input.style.display='none';
			         });
			        target.append(input);
				},
				 /**
		    	 * 处理resumable对象，对具体监听事件填写功代码
		    	 * @param element ： 目标容器标签
		    	 * @param option ： 配置参数
		    	 * @param r ： resumable对象
		    	 */
		    	handlResumable : function(element,option,r){
		              r.on('fileAdded', function(file) {//添加事件
		            	  methods.fielCheck(file,element);
		            	  option.onAddFile(file, r);
		            	  r.upload();
		              });
		              r.on('pause', function(){//上传暂停事件
		            	  r.files[0].queueItem.find('.play_upload').show();
		            	  r.files[0].queueItem.find('.stop_upload').hide();
		              });
		              r.on('fileSuccess', function(file,data){
						  var _settings =  $(element).find("input[type=file]").data('uploadifive').settings;
						  var _data = JSON.parse(data);
						  file.fileKey = _data.fileKey;
						  
						  option.onUploadComplete(file,data);
						  
						  if(!option.multi){
							  //单附件上传完毕后，是否隐藏上传按钮 默认为不隐藏
							  if(option.hideUploadBtn){
								  $(element).find("input[type=file]").parent().fadeOut(500);
							  }
							 
							  $.each(_settings.metaDatas,function(i, metaData) {
								 //每次执行删除第一个附件
								 $("#"+option.queueID).find(".close_upload:first").click();
							  });
						  }
				  
						  _settings.metaDatas.push(_data);
							     
			              file.queueItem.find('.progress').slideUp(250);
			              file.queueItem.addClass('complete');
		              });
		              r.on('fileError', function(file, message){//上传失败事件
		            	  file.queueItem.find('.play_upload').hide();
		            	  file.queueItem.find('.stop_upload').hide();
		            	  file.queueItem.find('.refresh_upload').show();
		            	  console.debug('fileError', message, file);
		            	  console.log(message);
		              });
		              r.on('fileProgress', function(file){//进度条
		            	  option.onProgress(file);
		              });
		              r.on('error', function(message, file){
		            	  console.debug('error', message, file);
		              });
		              r.on('uploadStart', function(){
		            	  r.files[0].queueItem.find('.play_upload').hide();
		            	  r.files[0].queueItem.find('.stop_upload').show();
		              });
		    	},
        		fielCheck : function(file,element) {
        			if(option.fileSizeLimit < file.size){
        				showErrorMessage("[" + insertEnter(file.fileName,20) + "]  超过文件大小限制！", element);
        				file.cancel();
        			}else if (0 == file.size) {
        				file.cancel();
        			} else if (-1 != $.inArray(file.fileName.substring(file.fileName.lastIndexOf(".")).toLowerCase(),
        					option.forbiddenFileTypes)) {
        				showErrorMessage("[" + insertEnter(file.fileName,20) + "] 为非法附件类型！", element);
        				file.cancel();
        			} else if ((-1 == $.inArray(file.fileName.substring(file.fileName.lastIndexOf(".")).toLowerCase(),
        					option.allowedFileTypes)) && option.allowedFileTypes.length != 0) {
        				showErrorMessage("[" + insertEnter(file.fileName,20) + "] 为非法附件类型！", element);
        				file.cancel();
        			}
        		},
			cancelFile : function(file,delay ) {
				var _settings = $(element).find("input[type=file]").data('uploadifive').settings;
				var deleteBool;
				if(file.queueItem !='undefined' && (-1 !== file.queueItem.attr('class').search("complete"))){
					deleteBool = deleteFile(file.fileKey,_settings);
				}
				//if(undefined === deleteBool || deleteBool ){
					file.cancel();
    				
    				if (!delay) delay = 0;
    	            var fadeTime = 300;
    	            if (file.queueItem) {
    	                file.queueItem.find('.progress-bar').width(0);
    	                file.queueItem.delay(delay).fadeOut(fadeTime, function() {
    	                   $(this).remove();
    	                });
    	                delete file.queueItem;
    	                $(element).find("input[type=file]").parent().fadeIn(500);
    	            }
				//}  
				//因为获取文件是监听file标签的change事件，为了避免当个文件上传取消后再选不触发事件而改变file标签的value值
				$(element).find("input[type=file]").val('');
			}
		};	  
		
		
		//渲染并创建上传按钮向指定目标内
			element.html(option.buttonText);
			methods.creatInput(element,option.multi);
		
		//将配置信息存入标签对象，因为与uploadifive保持一致所以在此仍然使用“uploadifiv”为名字
	    $(element).find("input[type=file]").data('uploadifive',{'settings' : option});
	  //使回显时配置的metaDatas第一时间与同步到组件上
		setMetaDatas(element, option.metaDatas);
		//初始完上传组件在组件上声明数组delMetaDatas用于存放回显后被做删除操作的metaDatas
		//当用户提交操作是调用确认删除时从本数组中获取key在对文件进行删除操作
		$(element).find("input[type=file]").data('uploadifive').settings.delMetaDatas = [];
		
		//单附件上传回显后按配置隐藏上传按钮
		if((!option.multi) && option.hideUploadBtn && option.metaDatas.length > 0){
			$("#uploadifive-file_uploader").hide();
		}
	};
	
	/**以表格的形式展示组件
	 * 在引入组件容器内渲染上传文件队列和上传按钮
	 * @param ： element 容器标签
	 * @param ： option 配置项
	 */
	var nerisResumable = function(element,option){
		var rootPath = getRootPath();
		defaultOption = {
	        "query" : option.formData,//可配置扩展请求提交的信息
	        "deleteScript" : rootPath + "/doDelete",//取消删除rul
			"confirmScript" : rootPath + "/doConfirm",//附件确认url
			"downloadScript" : rootPath + "/doDownload",//下载url
			"openWindowScript" 	 : getRootPath() + "/doDownloadOpenWindow",//模态框预览URL
			"delDialog" 		 : false, //是否取消删除操作的异步请求，只是页面删除
	        "dialogHeight" 	: 600,  //在线预览模态框 默认高度
			"dialogWidth" 	: 1000,  //在线预览模态框 默认宽度
			"metaDatas" 		 : [], //元数据数组
			"_aElement"          : false,  // 禁止预览或文件格式不支持预览时文件名称是否仍然显示超链接的样式
			"previewMode" 		 : "openDialog",  //在线预览方式  默认为打开模态框
			"disableDialog" 	 : false,  //是否禁用PDF等文件的在线预览功能。false为不禁用
			"hideUploadBtn" 	 : false,  //单附件上传完毕后，是否隐藏上传按钮。false为不隐藏
			"hideDownloadBtn"	 : false,  //是否隐藏 下载 文字。false为不隐藏
			"openIframeID" 		 : "nerisUploadIframe",  //嵌入Iframe中预览 所属的Iframe ID  标识唯一
			"customPreview"      : previewFile,//覆盖此函数自定义预览
			"queueID" 			 :  "FileQueueAndUploadBtn_table .file-queue", //展示文件队列的位置,字符串为将容器标签的ID
			"byte2string"        : fileSize_toString,
			"viewCallBack" : function(){}//组件不支持的文件格式用户自定义使用插件预览，弹出框对调用该会掉函数
		};
		option = $.extend(defaultOption,option);
		if(typeof option.viewCallBack == 'function'){
			top.uploaderNameSpace.viewCallBack = option.viewCallBack;
		}
		var mtable = $("<table id='FileQueueAndUploadBtn_table' style='width: 100%;'></table>");
		var mtr  = $("<tr></tr>");
		var progresstd = $("<td style='width: 100%;'></td>");
		var buttd = $("<td rowspan='3'></td>");
		var edit = $("<div id=\"dxc\" style=\"margin-right:10px;\"></div>");
		if(option.metaDatas.length !== 0){
			edit = loadUploadedData(element,option);
		}
		var file_queue = $("<div class='file-queue' style='margin-right:10px;'></div>");
		progresstd.append(edit).append(file_queue);
		
		var resumable_browse = $("<div id='uploadifive-file_uploader' class='uploadifive-button' style='height: 30px; position: relative; text-align: center; width: 100px;'></div>");
		buttd.append(resumable_browse);
		mtr.append(progresstd);
		mtr.append(buttd);
		mtable.append(mtr);
		element.empty();
		element.append(mtable);
		
		uploadFileResumable(resumable_browse,option);
		
	};
	var $data = {
			fileID : 0
			};

   var checkIEVersion = function () {   
        var ua = navigator.userAgent;   
        var s = "MSIE";   
        var i = ua.indexOf(s)            
        if (i >= 0) {   
           //获取IE版本号   
            var ver = parseFloat(ua.substr(i + s.length));   
            if(ver < 10 ){
            	return false;
            }
        }   
       return true;
    }  
	
	$.fn.nerisUploader = function() {
		//判断浏览器版本是否是支持本插件
		if(checkIEVersion()){
			switch (typeof arguments[0]) {
			case "object":
				if (arguments[0].readOnly) {
					new Downloader(this, arguments[0]);
				} else if(arguments[0].resumable){//如果配置此项为true则使用resumable插件，默认是false
					nerisResumable(this, arguments[0]);
				} else {
					new Uploadifive(this, arguments[0]);
					return this;
				}
				break;
			case "undefined":
				new Uploadifive(this, arguments[0]);
				return this;
				break;
			case "string":
				switch (arguments[0]) {
				case "getFileMetaDatas":
					return getMetaDatas(this);
					break;
				case "confirmFiles":
					return doConfirm(this, arguments[1]);
					break;
				case "setMetaDatas":
					setMetaDatas(this, arguments[1])
					break;
				}
				break;
			}
		}else{
			var message = $('<span style="color:red;"> - 当前浏览器版本低不支持此功能，请使用高版本浏览器再试！</span>"')
			this.append(message);
		}
	};
	
	$.fn.returnmd5 = files;

	$.fn.getFileMetaDatas = function() {
		return getMetaDatas(this);
	};

	$.fn.confirmFiles = function() {
		return doConfirm(this, arguments[0]);
	};
//确认删除入口函数
/*	$.fn.confirmDeleteFile = function(){
			return confirmDeleteFile(this);
		}
	*/
	$.extend({
		previewFile:function(fileKey , previewMode , currentUserAccount ,openIframeID , dialogHeight , dialogWidth){
			return previewFile(fileKey , previewMode , currentUserAccount ,openIframeID , dialogHeight , dialogWidth);
		}
	});
	
	
	$.extend({
		downloadFile:function(fileKey, currentUserAccount){
			return downloadFile(fileKey, getRootPath() + "/doDownload", currentUserAccount);
		}
	});
	
	$.extend({
		uploadFileResumable:function(option){
			var uploadBtn = $("<div class='uploadifive-button'></div>");
			uploadFileResumable(uploadBtn,option);
			return uploadBtn;
		}
	});
	
}(window.jQuery)

//回调函数
function uploadCallBack(){
}