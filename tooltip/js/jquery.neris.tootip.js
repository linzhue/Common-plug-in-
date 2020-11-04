/*
 * Copyright ® 中国证监会中央监管信息平台版权所有
 *  tootip 组件 实现 文本超出容器设定长度之后不折行,截断文本，鼠标悬停 时通过titile的方式显示文本内容.
 *  依赖bootstrap 的tootip组件.
 *  useage:
 *      1.onload 对需要使用tootip的对象添加属性 data-toggle="neris-tooltip",页面onload的时候会自动实现文本超长截断,并实现鼠标悬停显示title效果
 *      2.单独使用 $("#id").nerisTootip()
 * @author: wangshihui   
 * @ver 0.1
 * @date: 2015年7月31日
 */
 (function($){
	 
	 var css={
				"display":"inline-block",// 对于非标准的盒型对象 a span等，需要设置为block width 属性才能生效
//				"width":"100%",/*对宽度的定义,根据情况修改*/
				"overflow": "hidden",// 
//				"overflow-x": "hidden",// 
				"white-space": "nowrap",//不折行
				"text-overflow":" ellipsis"// 省略号显示截断字符
	};
	 var cssWith={
			 "display":"inline-block",// 对于非标准的盒型对象 a span等，需要设置为block width 属性才能生效
			 "width":"100%",/*对宽度的定义,根据情况修改*/
			 "white-space": "nowrap",//不折行
			 "text-overflow":" ellipsis"// 省略号显示截断字符
	 };
	 
	var getReadlWidth=function(obj){
        //	方法       ff chrome        getComputedStyle()
        //	属性 ie  currentStyle 
	    if($(obj).is(":hidden")){
	        var position = $(obj).css("position");
	        if(window.getComputedStyle || dodument.defaultView.getComputedStyle){
	            window.getComputedStyle = window.getComputedStyle ||  dodument.defaultView.getComputedStyle; 
	        }
	        if(obj.currentStyle){
	            
	        }
	        var parents = $(obj).parents();
	    }
	}
	 
    var NerisTooltip=function($el,options){
        this.options=$.extend(true,{},this.options,NerisTooltip.DEFAULT,options);
        this.options.$el=$el;
        this.toggleTootip($el);
    }
    NerisTooltip.DEFAULT={
            nerisTooltipClass:'neris-tooltip',
            suffix:'...',
            $el:undefined,
            testLengthObj:'neris-tooltip-contenner',
            $testLengthObj:undefined
    };
    NerisTooltip.prototype.toggleTootip=function($obj){
    	var isTd=$obj.is("TD");
    	var isInTd,isBody,isTable=false;
    	// 如果toogle对象是td的话
    	var parent=$obj;
    	var tdWidth;
    	var parentWith;
    	//判断位置是否属于table 放弃while 循环 自己写还是容易出错
    	if(!isTd){
    	    parent=parent.parents("td") || parent.parents("body");
    	    isInTd=parent.is("TD");
    	    isBody=parent.is("BODY")
    	}
    	
    	if(isInTd || isTd){
    		//取得TD的宽度 parent now is TD
    		tdWidth=parent.attr("width")?parent.attr("width"):parent[0].style.width;
    		if(!tdWidth){//如果没有设置TD宽度，则从 colgroup th 或者 首行 的宽度
    			var index=parent.prevAll().length;
    			parent = parent.parents("table");
    		    if(parent.lengt==0 ){
                    console.log("dom 文档结构错误，TD不在table中")
                    return;
                }
        		//表格实际宽度    hiden元素 取不到 width()
        		parentWith=parent.width();
        		if(parent.find("colgroup")){
        			var cgs=parent.find("colgroup");
        			if(cgs.length==1){
        				var cg=parent.find("col").eq(index);
        				tdWidth=cg.length>0?(cg.attr("width")?cg.attr("width"):cg[0].style.width):"";
        			}
        		}
    		}
    		if(!tdWidth && parent.find("th")){
    			var th=parent.find("th").eq(index);
    			//如果没有设置属性 用实际宽度
    			tdWidth=th.length>0?(th.attr("width")?th.attr("width"):th.width()):"";
    			
    		}
    		//如果 colgroup 和 th 都没有设定宽度的话 用 同列 首行 td的宽度设定
    		if(!tdWidth){
        			var td=parent.find("tr:first").find("td").eq(index);
        			//如果没有设置属性 用实际宽度
        			tdWidth=td.length>0?(td.attr("width")?td.attr("width"):td.width()):"";
        			
    		}
    		console.log("td width"+tdWidth);
    		tdWidth+="";
    		if((tdWidth).match(/\d+%/)){
    			tdWidth=parentWith*(tdWidth.replace("%","").replace(/\s/g,""))/100;
    		}else{
    			tdWidth=tdWidth.replace("px","").replace("/\s/g","");
    		}
    	}
    	
    	if(isTd){
    		$obj.css("white-space","nowrap");
    		if($obj.width()>tdWidth){
    			css.width=tdWidth;
    			$obj.css(css);
    			var content=$.trim($obj.text());//对象内容
        		$obj.attr("data-placement","top").attr("data-original-title",content);
            	$obj.tooltip();
    		}
    	}else if(isInTd){
    		if($obj.siblings().length==0){
    			$obj.css("white-space","nowrap");
    			$obj.css("display","inline-block");
    			if($obj.width()>tdWidth){
        			css.width=tdWidth;
        			$obj.css(css);
        			var content=$.trim($obj.text());//对象内容
            		$obj.attr("data-placement","top").attr("data-original-title",content);
                	$obj.tooltip();
        		}
    		}else{
    			var objWidth=$obj.attr("width") || $obj[0].style.width;
    			if(!objWidth){
    				console.log("neris.tooltip 需要设定对象的具体宽度,否则不能实现文字截断。。。")
        			return;
    			}
    			$obj.css("white-space","nowrap");
    			$obj.css("display","inline-block");
    			if($obj[0].scrollWidth>$obj[0].offsetWidth){
    				css.width=objWidth;
        			$obj.css(css);
        			var content=$.trim($obj.text());//对象内容
            		$obj.attr("data-placement","top").attr("data-original-title",content);
                	$obj.tooltip();
        		}
    			
    		}
    	}else{
    		var objWidth=$obj.attr("width") || $obj[0].style.width;
    		if(!objWidth){
    			console.log("neris.tooltip 需要设定对象的具体宽度,否则不能实现文字截断。。。")
    			return;
    		}
    		$obj.css("white-space","nowrap");
			$obj.css("display","inline-block");
    		if($obj[0].scrollWidth>$obj[0].offsetWidth){
    			css.width=objWidth;
    			$obj.css(css);
    			var content=$.trim($obj.text());//对象内容
        		$obj.attr("data-placement","top").attr("data-original-title",content);
            	$obj.tooltip();
    		}
    	}
    	
    }; 
    $.fn.nerisTooltip=function(options){
        var that = $(this);
        if(that.length>0){
            $.each(that,function(index,obj){
                var $obj = $(obj)
                if(!$obj.data("neris-tooltip")){
                    $obj.data("neris-tooltip",new NerisTooltip($obj));
                }
            });
        }
        return that;
    };
    $(window).on("load",function(){
        setTimeout(function(){
            $('[data-toggle="neris-tooltip"]').nerisTooltip();
        },1);
    });
//    $(function () {
//        $('[data-toggle="neris-tooltip"]').nerisTooltip();
//    });
})(jQuery);