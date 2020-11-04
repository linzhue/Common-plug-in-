/*
 * Copyright ® 中国证监会中央监管信息平台版权所有 
 * <概要说明> 
 * @author: ${张龙涛} 
 * 修改时间: ${2014/12/29}
 */
/**
 * 名称：自定义组件公共方法fxloa
 * 功能：自定义组件公共方法
 * 时间 修改者 修改内容
 * ----------------------------------------------------------------------------
 * 2014/12/29 Pactera 张龙涛 初始创建
 */

/**
* 在鼠标点击位置弹出新window窗口，并显示页面
* @method addWindow
* @param {Url} url 页面链接
* @param {String} id 窗口ID
* @param {Number} height 高度
* @param {Number} width 宽度
* @param {JSON} winFuncs 事件函数集
* @param {function} loadFunc 加载完毕事件函数
*/
function _addWindow($,url, id, height, width, winFuncs, loadFunc) {
    //鼠标X坐标
    var showX = event.clientX;
    //鼠标Y坐标
    var showY = event.clientY;
    //获得窗口的高度 
    var parentNode = document.body;
    var windowHeight=$(parentNode).height(); 
    //获得窗口的宽度 
    var windowWidth=$(parentNode).width(); 

    if ((showY+height) > windowHeight) {
        if (showY - height > 0) {
            showY = showY - height;
        }
    }
    if ((showX+width) > windowWidth) {
        if (showX - width > 0) {
            showX = showX - width;
        }
    }
    //页面链接
    var winData = {
        "data" : [{
                    "url" : url
                }]
    };
    //创建窗口元素
    var win = document.getElementById(id);
    if (win!=null) {
        win.remove();
    }
    //创建窗口元素
    win = document.createElement("div");
    win.id = id;
    $("body").append(win);
    
    $(win).windowdiv({
                content : winData,
                height : height,
                width : width,
                top : showY,
                left : showX,
                isOpacity : false,
                funcs : winFuncs,
                loadfunc : loadFunc,
                win : this
                });
    
    $(win).show();
}

function addWindow(url, id, height, width, winFuncs, loadFunc) {
    _addWindow(top.$,getFullURL(url), id, height, width, winFuncs, loadFunc);
}
/**
* 居中弹出新window窗口，并显示页面
* @method addCenterWindow
* @param {Url} url 页面链接
* @param {String} id 窗口ID
* @param {Number} height 高度
* @param {Number} width 宽度
* @param {JSON} winFuncs 事件函数集
* @param {function} loadFunc 加载完毕事件函数
*/
function _addCenterWindow($,url, id, height, width, winFuncs, loadFunc) {
    //页面链接
    var winData = {
        "data" : [{
                    "url" : url
                }]
    };
    //获得窗口的高度 
    var parentNode = window.top.document.body;//getParent(parent.document.body);
    //var windowHeight=$(parentNode).height(); 
    var windowHeight = window.top.document.documentElement.clientHeight;
    //获得窗口的宽度 
    //var windowWidth=$(parentNode).width(); 
    var windowWidth = window.top.document.documentElement.clientWidth; 
//    //获得滚动条的高度 
//    scrollTop=$(parentNode).scrollTop(); 
//    //获得滚动条的宽度 
//    scrollleft=$(parentNode).scrollLeft();
    
    height = __getDefaultPX(height,windowHeight,windowHeight);
    width = __getDefaultPX(width,windowWidth,windowWidth);
    
    var showY=(windowHeight-height)/2; 
    var showX=(windowWidth-width)/2; 
//    var showY=(windowHeight-height)/2+scrollTop; 
//    var showX=(windowWidth-width)/2+scrollleft; 

    //var win = parent.document.getElementById(id);
	var win = window.top.document.getElementById(id);
	
    if (win!=null) {
        //win.remove();
    }
    
    win = document.createElement("div");
    win.id = id;
    
    $(parentNode).append(win);
    
    $(win).windowdiv({
                content : winData,
                height : height,
                width : width,
                top : showY,
                left : showX,
                isOpacity : true,
                funcs : winFuncs,
                loadfunc : loadFunc,
                win : this
                });
    
     $(win).show();
//    top.document.documentElement.style.overflow = "hidden";
}
function addCenterWindow(url, id, height, width, winFuncs, loadFunc) {
     window.document.activeElement && window.document.activeElement.blur();
    _addCenterWindow(top.$,getFullURL(url), id, height, width, winFuncs, loadFunc);
}

/**
* 关闭窗口及其打开的可拖动的多层弹出框
* @method closeWindow
* @param {String} id 窗口ID
*/
function closeWindow(id) {
	$(window.top.document.body).find('#right_bar_controller').hide();
     if (top.$(".windowdiv iframe").length==1)closePreview();
     neris.whoAmI().data(top.$.fn.windowdiv.nerisWindowDiv).close(id,this)
	 /*this[$.fn.windowdiv.nerisWindowDiv].data($.fn.windowdiv.nerisWindowDiv).close(id,this);*/
}

/**
* 关闭预览框
* @method closePreview
*/
function closePreview() {
    var preview = $(window.top.document.body).find("#preview");
    preview.hide();
//    parent.document.documentElement.style.overflow = "scroll";
}

/**
* 前进
* @method forward
*/
function forward() {
    history.go(1);
}

/**
* 后退
* @method back
*/
function back() {
    history.go(-1);
}

/**
* 页面Size重新计算
* @method resizePage
*/
function resizePage() {
    if(console){
        console.log("右侧区域显示滚动条  resizePage 请不要再继续使用")
    }
    return;
    var changeHeight = $(".right_main").outerHeight();
    if(changeHeight!=null){
        $("body").css("height",changeHeight);
        var ifm = parent.document.getElementById("iframepage");
        //ifm.height = changeHeight;
        $(ifm).height(changeHeight);
        var ifmdiv= $(ifm).parent();
        ifmdiv.css("height",changeHeight);
    } else {
//        changeHeight = $(".tanchukuang").outerHeight();
//        if(changeHeight!=null){
//            $("body").css("height",changeHeight);
//            var ifm = parent.document.getElementById("iframepage_tk");
//            $(ifm).css("height",changeHeight);
//            //ifm.height = changeHeight;
//            var ifmdiv= $(ifm).parent();
//            ifmdiv.css("height",changeHeight);
//        }
    }
}

function resizePage_tk() {
    var changeHeight = $(".tanchukuang").outerHeight();
    if(changeHeight!=null){
        $("body").css("height",changeHeight);
        var ifm = parent.document.getElementById("iframepage");
        //ifm.height = changeHeight;
        $(ifm).height(changeHeight);
        var ifmdiv= $(ifm).parent();
        ifmdiv.css("height",changeHeight);
    }
}

/**
* 从父页面上的元素取得数据
* @method getParentData
* @param {String} id 父页面上的元素ID
* @return 元素内的数据
*/
function getParentData(id) {
    var count = window.top.frames.length;
    var parentNode = null;
    var el = null;
    for(var i=0; i<count; i++) {
        parentNode = window.top.frames[i].document;
        el = $(parentNode).find("#"+id);
        if(el !=null && el.length>0) {
            return $(el).val();
        }
    }
    
    count = window.frames.length;
    for(var j=0; j<count; j++) {
        parentNode = window.frames[j].document;
        el = $(parentNode).find("#"+id);
        if(el !=null && el.length>0) {
            return $(el).val();
        }
    }
    
    return null;
}

/**
* 向父页面上的元素设定数据
* @method setParentData
* @param {String} id 父页面上的元素ID
* @param {Object} value 数据值
*/
function setParentData(id, value) {
    var count = window.top.frames.length;
    var parentNode = null;
    var el = null;
    for(var i=0; i<count; i++) {
        parentNode = window.top.frames[i].document;
        el = $(parentNode).find("#"+id);
        if(el !=null && el.length>0) {
            $(el).val(value);
            return;
        }
    }
    
    count = window.frames.length;
    for(var j=0; j<count; j++) {
        parentNode = window.frames[j].document;
        el = $(parentNode).find("#"+id);
        if(el !=null && el.length>0) {
            $(el).val(value);
            return;
        }
    }
}

/**
 * 通过迭代循环Frame给指定的id赋值
 * @param specIframe 指定的从哪个层级的iframe开始往下循环
 * @param id 要查找的Dom元素id
 * @param metadata 元数据
 */
function setValueByLoopFrames (specIframe, id, metadata) {
	var frames = specIframe.frames;
	if (frames.length > 0) {
		for (var i = 0, len = frames.length; i < len; i++) {
			var currentDomObject = frames[i].document.getElementById(id);
			if (currentDomObject) {
				currentDomObject.value = metadata;
			} 
			setValueByLoopFrames(frames[i], id, metadata); 
		}
	} else {
		return; 
	}
}

/**
* 从子页面上的元素取得数据
* @method getChildData
* @param {String} id 子页面上的元素ID
* @return 元素内的数据
*/
function getChildData(id) {
    var count = window.frames.length;
    var childNode = null;
    var el = null;
    for(var i=0; i<count; i++) {
        childNode = window.frames[i].document;
        el = $(childNode).find("#"+id);
        if(el !=null && el.length>0) {
            return $(el).val();
        }
    }
    
    count = window.top.frames.length;
    for(var j=0; j<count; j++) {
        childNode = window.top.frames[j].document;
        el = $(childNode).find("#"+id);
        if(el !=null && el.length>0) {
            return $(el).val();
        }
    }
    return null;

}

/**
* 向子页面上的元素设定数据
* @method setChildData
* @param {String} id 子页面上的元素ID
* @param {Object} value 数据值
*/
function setChildData(id, value) {
    var count = window.frames.length;
    var childNode = null;
    var el = null;
    for(var i=0; i<count; i++) {
        childNode = window.frames[i].document;
        el = $(childNode).find("#"+id);
        if(el !=null && el.length>0) {
            $(el).val(value);
            return;
        }
    }
    
    count = window.top.frames.length;
    for(var j=0; j<count; j++) {
        childNode = window.top.frames[j].document;
        el = $(childNode).find("#"+id);
        if(el !=null && el.length>0) {
            $(el).val(value);
            return;
        }
    }
}

/**
* 页面跳转
* @method openUrl
* @param {String} url 页面链接
*/
function openUrl(url){
    var ipage = parent.document.getElementById("iframepage");
    top.$("#iframepage").data("condition-button-has-show",undefined);
    ipage.src =url;
}

/**
* 警告
* @method alert
*/
function alert(){
    if (arguments.length == 1) {
        alert1(arguments[0]);
    } else if (arguments.length == 2) {
        alert2(arguments[0], arguments[1]);
    }
}

/**
* 警告
* @method alert
* @param {String} 警告信息
*/
function alert1(msg){
	$.nerisDialog({
		dlgType: "info",
		showBtn: "cancel",
		title: "信息",
		content: msg
	});
}

/**
* 警告
* @method alert
* @param {String} 警告信息
* @param {function} 确定按钮回调函数
*/
function alert2(msg, callback){
	$.nerisDialog({
		dlgType: "info",
		showBtn: "cancel",
		cancelFunc: callback,
		title: "信息",
		content: msg
	});
}

/**
* 确认
* @method confirm
* @param {String} 确认信息
* @param {function} 确定/取消按钮回调函数
*/
function confirm(msg, callback){
	$.nerisDialog({
		dlgType: "info",
		title: "确认",
		showBtn: "all",
		okFunc: callback,
		content: msg
	});
}

/**
* 调用窗口函数
* @method callWindowFunc
* @param {String} 窗口ID
* @param {String} 函数名
*/
function callWindowFunc(id, funcName) {
    var parentiframe = $(window.top.document.body).find("#"+id).find("#iframepage_win");
    eval("parentiframe[0].contentWindow."+funcName);
}
/**
 * 
 * 获取弹出窗口的window对象
 * @method getWindowById
 * @param id 窗口id
 */
function getWindowById(id){
    var win = $(window.top.document.body).find("#"+id).find("#iframepage_win")[0];
    return win ? win.contentWindow : null;
}


/*
 *   下面 代码 定义neris命名空间  避免 全局方法 污染。
 *   ！！！重要！！！
 *   各模块 人员自定义方法的时候需要注意，不要再定义 window.neris 对象
 *   建议业务人员自定义js方法的时候 加上命名空间  
 *   
 *   如 定义想添加自定义函数 resizepage 建议如下写法
 *   window.neris.模块名称.resizePage=function(){...}
 * */
if(!window.neris){
	window.neris={};
}
window.neris.g={};
/**
* 页面Size重新计算
* @method resizePage
*/
window.neris.resizePage=function () {
    if(console){
        console.log("右侧区域显示滚动条  resizePage 请不要再继续使用")
    }
    return;
    var changeHeight = $(".right_main").outerHeight();
    if(changeHeight!=null){
        $("body").css("height",changeHeight);
        var ifm = parent.document.getElementById("iframepage");
        
        //ifm.height = changeHeight; csj:20150906
        $(ifm).height(changeHeight);
        
        var ifmdiv= $(ifm).parent();
        ifmdiv.css("height",changeHeight);
    } else {
//        changeHeight = $(".tanchukuang").outerHeight();
//        if(changeHeight!=null){
//            $("body").css("height",changeHeight);
//            var ifm = parent.document.getElementById("iframepage_tk");
//            $(ifm).css("height",changeHeight);
//            //ifm.height = changeHeight;
//            var ifmdiv= $(ifm).parent();
//            ifmdiv.css("height",changeHeight);
//        }
    }
    
};


window.neris.resfreshIframe=function(iframe){
	iframe.contentWindow.location.reload(true)
}
/**
 * iframediv
 */
window.neris.resfreshInnerIframe=function(selecter){
	console.log("window.neris.resfreshInnerIframe");
  var iframe=$('iframe',selecter);
  if(iframe.length>0){
	  window.neris.resfreshIframe(iframe[0])
  }
};

/**
 * 根据window 对象 取得当前打开 iframe 所在 window 对象 
 * 参考 jquery.windowdiv.js
 * @param {} windowObj
 * @return {}
 */
window.neris.getParentWindow=function(windowObj){
    windowObj = windowObj || window;
    var iframes=top.$("iframe");
    var length=iframes.length;
    for(var i=0;i<length;i++){
        if(iframes[i].contentWindow==windowObj){
             //Note 不同winow对象的jq的data绑定的数据,不能互相通信 所以用top.$绑定 
            return  top.$(iframes[i]).data('nerisparentwindow')
        }
    }
};
/**
 * 根据window对象取得当前iframe所在的top window的ifram dom
 * 参考 jquery.windowdiv.js
 * @param {} win
 * @return {}
 */
window.neris.whoAmI=function(win){
    var me=win?win:window;
    var iframes=top.$("iframe");
    var length=iframes.length;
    for(var i=0;i<length;i++){
        if(iframes[i].contentWindow==me){
             //Note 不同winow对象的jq的data绑定的数据,不能互相通信 所以用top.$绑定 
            return  top.$(iframes[i]);
        }
    }
};

function getFullURL(url) {
    if(!url)return null;
    
//    if (/^(https?:\/\/)?([\d\w-]+(\.[\d\w-]+)+(:\d+)?)(\/[\d\w\.-]+)*(\\?[\S]*)?\$/.test(url)){
//        return url;
//    }
//    
//    if (/^(https?:\/\/)?localhost(:\d+)?(\/[\d\w\.-]+)*(\\?[\S]*)?\$/.test(url)){
//        return url;
//    }
    
    if (/^(https?:\/\/)?([\d\w-]+(\.[\d\w-]+)+(:\d+)?)(\/[\d\w-]+)*(\/?\?[\S\s]*)?\/?$/.test(url)){
        return url;
    }
    
    if (/^(https?:\/\/)?localhost(:\d+)?(\/[\d\w\.-]+)*(\/?\?[\S]*)?\/?$/.test(url)){
        return url;
    }
    
    var origin = location.origin ,
        pathname = location.pathname ,
        fullPath = origin + pathname,
        //relativePath = getRootPath();
        relativePath = fullPath.substring(0,fullPath.lastIndexOf("/") + 1);
    
    if(url.charAt(0)=="/"){
        return origin + url;
    }
    
    //暂时勿删输出
    console.log("路径"+url);
    
    console.log("拼完之后的路径地址：      "+relativePath + "/" + url);
   // return relativePath + "/" + url;
    return relativePath + url;
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

/**
 * 获取校验后的数值<br/>
 * @method __getDefaultPX
 * @for 
 * @param val 值，必须是一个数值或百分比
 * @param maxVal 最大值
 * @param def 默认值
 */
function __getDefaultPX(val,maxVal,def){
    if(parseFloat(val)==0)return 0;
    var percentRex = /^\d+(\.\d+)?%$/,valRex = /^\d+(\.\d+)?$/;
    return percentRex.test(val)&&parseFloat(val)*maxVal/100||valRex.test(val)&&(val<maxVal&&val||maxVal)||def;
}

/*
 * 通过addCenterWindow方法弹出的窗口可拖动
 * @author: gongph
 * @version: 1.16.0
 * @date: 2016/11/28
 */
;(function($){
    $(function(){
    	var mouseStart = {}, //记录鼠标开始坐标
		  dialogStart = {}, //弹出框开始坐标
		  flag = false,//拖动状态
		  $this, // 保存当前可拖动Dom对象
		  $parentWin = self.parent, // 父窗口
		  $parentTarget = $parentWin.$('.overin').length > 0 ? $parentWin.$('.overin:last') : null ; // 获取父窗口类名是 'overin' 的 Dom对象
		  $(document).delegate('.popup_title', 'mousedown', function(){
				if ($parentTarget) {
					 flag = true,
					//改变鼠标为拖拽图标
					$this = $(this).css('cursor', 'move');
					//设置弹出框透明度
					$this.parent().fadeTo('fast', 1);
					var clientWidth = document.body.clientWidth;
					var clientHeight =  document.documentElement.clientHeight; 		
					mouseStart.x = event.screenX; //鼠标x轴坐标
				    mouseStart.y = event.screenY; //鼠标y轴坐标
				    dialogStart.x = $parentTarget.offset().left; //弹出框距离浏览器左侧距离
				    dialogStart.y = $parentTarget.offset().top; // 弹出框距离浏览器顶部距离
				    //绑定鼠标移动事件
			    	$(document).bind('mousemove', Mousemove).bind('mouseup', Mouseup).bind('mouseleave', Mouseleave);
			    	
				}
			});		
		 
		// 鼠标按下拖动
		function Mousemove(event){
			if(flag){
				var mouseCurrentStart = {
						x : event.screenX,
						y : event.screenY
					};	//鼠标当前位置
				var moveX = mouseCurrentStart.x - mouseStart.x, //获取鼠标x轴移动的距离
				 	moveY = mouseCurrentStart.y - mouseStart.y; //获取鼠标y轴移动的距离
					
				var targetLeft = parseInt($parentTarget.css('marginLeft'),10), //获取弹出框的margin-left
				 	targetTop = parseInt($parentTarget.css('marginTop'),10), //获取弹出框的margin-top
				 	targetWidth = $parentTarget.width(), //弹出框宽度
				 	targetHeight = $parentTarget.height(); //弹出框高度
				 	dialogStart.x = moveX + dialogStart.x - targetLeft; //弹出框距离浏览器左侧距离
				 	dialogStart.y = moveY + dialogStart.y - targetTop; //弹出框距离浏览器顶部距离
				 	mouseStart = mouseCurrentStart;//将鼠标初始位置赋值为当前位置
				// 计算弹出框左右拖动不能超出可视区域
				if (dialogStart.x < -targetWidth+60) {
					dialogStart.x = -targetWidth+60
				} else if (dialogStart.x > ($parentWin.document.documentElement.clientWidth - 60 - targetLeft)) {
					dialogStart.x = ($parentWin.document.documentElement.clientWidth - 60 - targetLeft)
				}
				
				// 计算弹出框上下拖动不能超出可视区域
				if (dialogStart.y < 0) {
					dialogStart.y = -targetTop;
				} else if (dialogStart.y > ($parentWin.document.documentElement.clientHeight - 60 - targetTop)) {
					dialogStart.y = ($parentWin.document.documentElement.clientHeight - 60 - targetTop);
				}
				
				// 设置弹出框新的宽高
				$parentTarget.css({
					left: dialogStart.x + 'px',
					top: dialogStart.y + 'px'
				});
				
			}
		}
		
		// 鼠标释放拖动
		function Mouseup(){
			if(flag){
				$this.css('cursor', 'default');
				$this.parent().fadeTo('fast', 1);
				// 解绑事件
				$($(".popup_title").document).unbind('mousemove', Mousemove).unbind('mouseup', Mouseup);
				$($(".popup_content").document).unbind('mousemove', Mousemove).unbind('mouseup', Mouseup);
				flag = false;
			}
		}
		// 鼠标释放拖动
		function Mouseleave(){
			if(flag){
				$this.css('cursor', 'default');
				$this.parent().fadeTo('fast', 1);
				// 解绑事件
				$($(".popup_title").document).unbind('mousemove', Mousemove).unbind('mouseup', Mouseup);
				$($(".popup_content").document).unbind('mousemove', Mousemove).unbind('mouseup', Mouseup);
				flag = false;
			}
		}
	});

})(jQuery)
//参数控制弹出窗口不可拖动
 $.nerisWinDrag = $.fn.nerisWinDrag = function (options) {
	        // 默认属性
	        var defaults = {
	           isDrag: true
	        };
	        var options = $.extend({}, defaults, (options || {}));
	        if (options.isDrag == false) {
		        var $parentWin = self.parent, // 父窗口
		   		$parentTarget = $parentWin.$('.overin').length > 0 ? $parentWin.$('.overin') : null ; // 获取父窗口类名是 'overin' 的 Dom对
		   		$(document).delegate('.popup_title', 'mousedown', function(){
					if ($parentTarget) {
					    //绑定鼠标移动事件
					    $(document).unbind('mousemove')
					}
				});
		   		$(document).delegate('.popup_content', 'mousedown', function(){
					if ($parentTarget) {
					    //绑定鼠标移动事件
					    $(document).unbind('mousemove')
					}
				});
	        }
	    };

	
			
