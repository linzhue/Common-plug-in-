/**
 * 弹出框组件 v1.19
 * 
 * Copyright ® 中国证监会中央监管信息平台版权所有
 */
;(function($){
	nerisDialog = $.nerisDialog = function(opt){
		var _opt = {
			dlgType: "info",
			title: "",
			titleCss: "info",
			content: "",
			showBtn: "cancel",
			okName: "确认",
			okFunc: function(){},
			okCss: "primary",
			cancelName: "取消",
			cancelFunc: function(){},
			cancelCss: "warning",
			focusBtn:1 //1:确认按钮获取焦点；2:取消按钮获取焦点；默认是1
		}
		
		if (!_checkOpt(opt)){
			return false;
		}
		
		$.extend(true, _opt, opt);
		_defOpt();
		
		// 检查页面是否存在
		var dialogDiv = $('.dialog');
		var dialogMask = $('.divoverout');
		if (dialogDiv.length > 0 && dialogMask.length > 0) {
		  return;
		} else {
		  var $dialog = $("<div class='dialog' style='z-index:3001;postion:absolute'></div>");
		  var $title = _packageTitle();
		  var $content = _packageContent();
		  var $bottom = _packageBottom();
		  setTimeout(function() {
			$dialog.append($title);
		    $dialog.append($content);
		    $dialog.append($bottom);
		    $(window.top.document.body).append($dialog);
			  _offsetDialog(opt);
			  _modelDialog();
		   }, 0);
		}
		
		function _checkOpt(opt){
			if (!opt){ 
				return false; 
			}
			
			if (opt.dlgType){
				var isTypeRight = false;
				$.each("info|success|warning|danger".split("|"), function(i, name){
					if (name === opt.dlgType){
						isTypeRight = true;
						return false;
					}
				});
				if (!isTypeRight){
					return false;
				}
			}
			
			return true;
		}

		function _defOpt(){
			if (_opt.showBtn == 'cancel' &&　_opt.cancelName == "取消"){
				_opt.cancelName = "关闭";
				_opt.cancelCss = "danger";
			}
		}
		
		function _packageTitle(){
			return $("<div class='dialog_title dialog_" + _opt.titleCss + "'>" + _opt.title + "</div>");
		}
		
		
		function _packageContent(){
			var $content = $("<div class='dialog_content dialog_icon_" + _opt.dlgType + "'>" + _opt.content + "</div>");
			return $content;
		}
		
		function _packageBottom(){
			var $bottom = $("<div class='dialog_bottom'></div>");
			if (_opt.showBtn == 'all' || _opt.showBtn == 'ok'){
				var $okBtn = $("<button class='btn btn-" + _opt.okCss + " btn-sm'>" + _opt.okName + "</button>");
				$okBtn.click(function(){
                    // 首先关闭confrim 弹窗 避免当前iframe关闭 后不能关闭自己
					//$(this).parent().parent().siblings(".divoverout").remove();
					$(this).parent().parent().siblings().last().remove();
					$(this).parent().parent().remove();
                    // okfunnc有可能会是关闭ifram操作
					_opt.okFunc(true);
				});
				$bottom.append($okBtn);
			}
			
			if (_opt.showBtn == 'all' || _opt.showBtn == 'cancel'){
				var $cancelBtn = $("<button class='btn btn-" + _opt.cancelCss + " btn-sm'>" + _opt.cancelName + "</button>");
				$cancelBtn.click(function(){
					// 首先关闭confrim 弹窗 避免当前iframe关闭 后不能关闭自己
					//$(this).parent().parent().siblings(".divoverout").remove();
					$(this).parent().parent().siblings().last().remove();
					$(this).parent().parent().remove();
                    // okfunnc有可能会是关闭ifram操作
					if (_opt.showBtn == 'cancel'){
						_opt.cancelFunc();
					} else {
						_opt.okFunc(false);
					}
				});
				$bottom.append($cancelBtn);
			}
			
			return $bottom;
		}
		
		function _offsetDialog(opt){
			var windowWidth = window.top.document.documentElement.clientWidth; 
			var windowHeight = window.top.document.documentElement.clientHeight;
			
			// var scrollleft=$(window.top.document.body).scrollLeft();
			// var scrollTop=$(window.top.document.body).scrollTop();
			
			var showX = (windowWidth - 300) / 2; 
			var cheight = $dialog.css("height");
			
			cheight = cheight.substr(0, cheight.length - 2);
			var showY = (windowHeight - cheight) / 2; 
			
			// $dialog.offset({"top":showY, "left":showX});
			$dialog.css({"position":"fixed", "top":showY, "left":showX});
			
			// 浮层弹出后设置焦点
			var opbtn = $dialog.find('div.dialog_bottom button');
			if(_opt.focusBtn == 1){//如果未指定焦点默认确认按钮
				opbtn.first().focus().css('outline','none');
			}else if(_opt.focusBtn == 2){//设定取消按钮为焦点
			    opbtn.last().focus().css('outline','none');
			}
		}
		
		function _modelDialog(){
			var $divoverout = $("<div class='divoverout' id='divoverout'></div>");
			$(window.top.document.body).append($divoverout);
			$divoverout.show();
		}
	}
	
	nerisInfo = $.nerisInfo = function(){
		var type = arguments[0] || {};
		var showBtnType = "cancel";
		i = 0;
		if (typeof type === "boolean"){
			i = 1;
			showBtnType = "all";
		}
		
		$.nerisDialog({
			dlgType: "info",
			showBtn: showBtnType,
			okFunc: arguments[i+1] || function(){},
			cancelFunc: arguments[i+1] || function(){},
			title: "信息",
			content: arguments[i] || ""
		});
		
	}
	
	nerisWarning = $.nerisWarning = function(){
		var type = arguments[0] || {};
		var showBtnType = "cancel";
		i = 0;
		if (typeof type === "boolean"){
			i = 1;
			showBtnType = "all";
		}
		
		$.nerisDialog({
			dlgType: "warning",
			showBtn: showBtnType,
			okFunc: arguments[i+1] || function(){},
			cancelFunc: arguments[i+1] || function(){},
			title: "普通警告信息",
			content: arguments[i] || ""
		});
	}
	
	nerisDanger = $.nerisDanger = function(){
		var type = arguments[0] || {};
		var showBtnType = "cancel";
		i = 0;
		if (typeof type === "boolean"){
			i = 1;
			showBtnType = "all";
		}
		
		$.nerisDialog({
			dlgType: "danger",
			showBtn: showBtnType,
			okFunc: arguments[i+1] || function(){},
			cancelFunc: arguments[i+1] || function(){},
			title: "严重警告信息",
			content: arguments[i] || ""
		});
	}
	
	nerisSuccess = $.nerisSuccess = function(){
		var type = arguments[0] || {};
		var showBtnType = "cancel";
		i = 0;
		if (typeof type === "boolean"){
			i = 1;
			showBtnType = "all";
		}
		
		$.nerisDialog({
			dlgType: "success",
			showBtn: showBtnType,
			okFunc: arguments[i+1] || function(){},
			cancelFunc: arguments[i+1] || function(){},
			title: "成功信息",
			content: arguments[i] || ""
		});
	}
})(jQuery);