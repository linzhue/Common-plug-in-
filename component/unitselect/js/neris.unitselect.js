/*
 * JQuery selectUnits base  v1.0
 * Date : 2015/12/01
 * 
 * Copyright (c) 2015 中国证监会中央监管信息平台版权所有
 * 
 */
(function($){
	/**
	 * 默认参数配置
	 */
	var _setting = {
			unitCode: '',
			handleFun:'',
			checkType:'m',//支持多选m | 单选s
			bottonSubmit:true
	},
	/**
	 * 事件绑定
	 */
	eventBind = {
			//处理全选
			handleAllChecked: function() {
				$("#checkTB").delegate("#chkAll", "click", function() {
					 var bool = this.checked;
				        $('input[type="checkbox"][name="chkItem"]').each(function(){
				            this.checked = bool;
				        });
				        
				        var len = $('input[type="checkbox"][name="chkItem"]:checked').length;
				        if (len > 0) {
							$("#select_units_subtn").removeAttr("disabled");
						}else{
				        	$("#select_units_subtn").attr("disabled", true);
						}
				});
			},
			//处理单个选中
			handleChecked: function() {
				$("#checkTB").delegate('input[type="checkbox"][name="chkItem"]', "click", function(e) {
					var that = $(e.currentTarget);
					//单选模式
					if(_setting.checkType == 's'){
						var chkboxs = $("#checkTB").find('input[type="checkbox"][name="chkItem"]');
						if($(this).prop('checked')){
							$.each(chkboxs, function(index, item){
								if($(item).val() == $(that).val()){
									$(that).checked = true;
								}else{
									this.checked = false;
								}
							});
							$("#select_units_subtn").removeAttr("disabled");
						}else{
							this.checked = false;
							$("#select_units_subtn").attr("disabled", true);
						}
						
					}else if(_setting.checkType == 'm'){
						var len = $('input[type="checkbox"][name="chkItem"]:checked').length;
				        var len1 = $('input[type="checkbox"][name="chkItem"]').length;
				        $('#chkAll')[0].checked = this.checked && (len == len1);
				        
				        if (len > 0) {
							$("#select_units_subtn").removeAttr("disabled");
						}else{
				        	$("#select_units_subtn").attr("disabled", true);
						}
					}
				});
			},
			//处理提交
			handleSubmit: function() {
				$("p").delegate("#select_units_subtn", "click", function() {
					var nodes = [];
					 $('input[type="checkbox"][name="chkItem"]:checked').each(function(index){
						 
						 var node = {
								 id: $(this).val(),
								 pid: $(this).attr("pid"),
								 unitCode: $("#selectUnits_form #unitCode").val(),
						 		 name: $(this).attr("cname"),
						 		 pname: $("#selectUnits_form #unitName").val(),
						 		uniqueCode: $(this).attr("uniquecode")
						 }
						 
						 nodes[index] = node;
					 });
					 
					 tools.getParentWindow()[_setting.handleFun].apply(tools.getParentWindow(), [nodes]);
					 closeWindow("selectUints");
				});
			},
			//处理查询
			handleQuery: function(){
				$("#selectUnits_form").delegate(".btn-query", "click", function(){
					 $("#selectUnits_form")[0].submit();
				});
				
				//键盘事件
				$(window).keydown(function(event){
					if(event.keyCode == 13){//Enter
						 $("#selectUnits_form")[0].submit();
					}
				});
			}
	},
	/**
	 * 工具类
	 */
	tools = {
			//得到父窗口对象
			getParentWindow: function() {
				var iframes = top.$("iframe");
			    var length = iframes.length;
			    for(var i=0;i<length;i++){
			        if(iframes[i].contentWindow == window){
			             //不同winow对象的jq的data绑定的数据,不能互相通信 所以用top.$绑定 
			            return  top.$(iframes[i]).data('nerisparentwindow');
			        }
			    }
			}
	};
	$.selectUnits = {
			//初始化参数和时间绑定
			init: function(setting) {
				$.extend(true, _setting, setting);
				
				if(_setting.checkType == 'm'){
					eventBind.handleAllChecked();
				}
				eventBind.handleChecked();
				eventBind.handleSubmit();
				eventBind.handleQuery();
				
			},
			//初始化window窗口
			initWindow: function(obj) {
				var checkType;
				if(obj.unitCode == undefined || !obj.unitCode){
					console.info("参数unitCode不能为空！");
					return ;
				}
				if(obj.handleFun == undefined || !obj.handleFun){
					console.info("参数handleFun不能为空！");
					return ;
				}
				
				if(obj.checkType == undefined){
					checkType = _setting.checkType;
				}else{
					checkType = obj.checkType;
				}
				
				addCenterWindow(window.neris.basePath + "neris/selectUnits/toSelectUnits?unitCode="+obj.unitCode 
						+"&handleFun="+obj.handleFun
						+"&checkType="+checkType,
						"selectUints", 600, 960, null, null);
			}
	}
})(jQuery);
