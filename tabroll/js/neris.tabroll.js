/**
 * 1.20版
 * 作者：lzhu
 * 2017.3.14
 */
!function($) {
	var RollTab = function(element,options){
		//声明变量
		var defaultOption = {
				tabs : null,
				count : 1,
				active : 0,
				tag : '',
				callback : function () {}
			};
		//防止count值超出范围
		options.count = options.count > options.tabs.length ? options.tabs.length : options.count;
		options = $.extend(defaultOption,options);
	
		element.attr("role","tabpanel");
		var showTabData = function(options){
			var dataContain =  $("<div class='tab-content' style='clear: both;'>");//数据容器
		    var tabs = options.tabs;
			$.each(tabs,function(idx,tab){
				var tabData = $("<div role='tabpanel' class='tab-pane'></div>");
				var showHtml = tab.html ? tab.html : "";
				tabData.html(showHtml);
				tabData.attr({
					'id':'index'+idx,
				});
				if(idx === options.active){
					tabData.addClass('active');
				}
				dataContain.append(tabData);
			});
			return dataContain;
		}
		var creatUl = function(options){
			var ulDiv = $("<div style='float: left; overflow:hidden; height:41px; margin:0 auto;'></div>");
			var ul = $("<ul class='nav nav-tabs tab_bottom' role='tablist'></ul>");
			var tabs = options.tabs;
			
			$.each(tabs,function(idx,tab){
				var tagName = options.tag;
				var htmlTag='';
				if(tagName=="security:auth"){
					htmlTag = $("<"+tagName+">"+"</"+tagName+">")
				}
				var li = $("<li role='presentation'></li>");
				var a = $("<a href='#' role='tab' data-toggle='tab'></a>");
				li.attr('id', tab.id);
				a.text(tab.tName);
				a.attr({
					'href':'#index'+idx,
					'aria-controls':'index'+idx
				});
				if(idx === options.active){
					li.addClass('active');
				}
				
				a.on('click',function(e){
					 e.preventDefault();
					 $(this).tab('show');
					 if(typeof tab.callback === 'function'){
						 tab.callback();
					 }
				});
				
				if(tagName=="security:auth"){
					ul.append(htmlTag);
					htmlTag.append(li);
					li.append(a);
				}else{
					li.append(a);
					ul.append(li);
				}
			
			
			});
			ulDiv.append(ul);
			return ulDiv;
		}
		
		// cursor:not-allowed;
		var renderRollTab = function(element,options){
			var tabDiv = $("<div></div>");
			var leftBut = $("<div class='flip_blue flip_disabled'><a class='flip_l' title='前翻'></a></div>");
			var rightBut = $("<div class='flip_blue'><a class='flip_r' title='后翻'></a></div>");
			var ulDiv = creatUl(options);
			var tabData = showTabData(options);
			var ul_margin_left = 0;//当前左移的长度
			var ulLen =1;
			var lis = ulDiv.find('li');
			var liIndex = 0;
			var ulDivlen;//ul容器长度
		
			//tabDiv.append(leftBut).append(ulDiv).append(rightBut);
			tabDiv.append(ulDiv).append(leftBut).append(rightBut);
			element.append(tabDiv).append(tabData);
			//设置ulDiv的width
			ulDiv.width(tabDiv.width() - 32);
			window.onresize=function(){
				tabDiv.width('auto');
				ulDiv.width(tabDiv.width() - 32);
			}
			
			ulDivlen = ulDiv.width();//ul容器的长度
			$.each(lis,function(idx,obj){
				ulLen = ulLen + $(obj).width();
			});
			
			if(ulLen <= ulDivlen){
				ulLen = '100%';
				ulDiv.width('100%');
				leftBut.hide();
				rightBut.hide();
			}
			ulDiv.find('ul').width(ulLen);
			rightBut.on('click',function(){
				
				var lens=0;
				for(var i = 0; i < options.count; i++ ){
					lens = lens +  $(lis[liIndex++]).width();
				}
				ul_margin_left = ul_margin_left +lens;
				if (ulLen - ul_margin_left <= ulDivlen) {//减掉移出的长度后小于容器长度
					ul_margin_left = ulLen - ulDivlen;
					liIndex = lis.length-1;
					rightBut.addClass('flip_disabled');
				}
				//滚动动画效果
				ulDiv.find('ul').animate({"margin-left":-ul_margin_left},500);
				leftBut.removeClass('flip_disabled');
			});
			leftBut.on('click',function(){
				var lens=0;
				for(var i = 0; i < options.count; i++ ){
					lens = lens +  $(lis[liIndex--]).width();
				}
				ul_margin_left = ul_margin_left - lens;
				
				if (ul_margin_left <= 0) {//减掉移出的长度后小于容器长度
					ul_margin_left = 0;
					liIndex = 0;
					leftBut.addClass('flip_disabled');
				} 
				//滚动动画效果
				ulDiv.find('ul').animate({"margin-left":-ul_margin_left},500);
				rightBut.removeClass('flip_disabled');
			});
		}
		renderRollTab(element,options);
	}
	$.fn.nerisRollTabs = function(){
		switch (typeof arguments[0]) {
		case "object":
			var rollTab = new RollTab(this,arguments[0]);
			break;
		}
	}
}(window.jQuery)