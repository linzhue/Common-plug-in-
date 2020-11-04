/*
 * neris.unitselect-spage.js v1.18.1
 * 单页部门选择组件 
 * Date : 2015/12/04
 * Author : 公共组件组GongPengHui
 * 
 * Copyright (c) 2015 中国证监会中央监管信息平台版权所有
 * 
 */
(function($) {
	/*
	 * 常量
	 */
	var _consts = {
		// 选择模式
		selectType : {
			MULTI : 'multi', // 多选
			SINGLE : 'single'// 单选
		},
		// 勾选类型
		checkType : {
			CHECKBOX : 'checkbox',
			RADIO : 'radio'
		},
		// 选择器
		selector : {
			TABLE_LIST : '.select_units_form_list',// 数据列表展示
			CLOSE_BTN : '#select_units_close',// 关闭按钮
			SUBMIT_BTN : '#select_units_subtn',// 提交按钮
			QUERY_TABLE : '.search_units_form_table',// 查询表格
			SEARCH_INPUT : '.search_units_input_keywords',// 查询输入框
			QUERY_BTN : '.btn_query'// 查询按钮
		}
	},
	echoDataArrays = [], // 反显的数据列表
	ekeys = [], // 存储反显的 key 键
	/*
	 * 默认参数设置
	 */
	setting = {
		title : 'title',
		searchTitle : 'search',
		selectType : _consts.selectType.MULTI,
		async: {
			url: '',
			param: {}
		},
		columns : [],
		placeholder : '',
		dataBindId : '',
		handleFun : '',
		isEcho: true,
		container: '',
		buttonSubmit : 'disabled',
		showDatas : []
	},
	/*
	 * 事件绑定
	 */
	event = {
		//提交
		dataSubmit: function() {
			$("p").delegate(_consts.selector.SUBMIT_BTN, "click", function(){
				var ckds = $(_consts.selector.TABLE_LIST).find("tbody tr input:checked");
				var nodes = [];
				for(var i = 0; i < ckds.length; i++){
					var rowId = $(ckds[i]).closest("tr").attr("rid");
					var obj = JSON.parse(rowId);
					nodes[i] = obj;
				}
				
				// 不建议浏览器存储。使用 showDatas 来手动进行数据反显
				if(setting.dataBindId && setting.isEcho){
					tools.getBindElementArrayObjSingle().singlepageEcho[setting.dataBindId] = nodes ;
				}
				
				// 合并 echoDataArrays 和 nodes 数组
				var arrs = nodes.concat(echoDataArrays);
				// arrs 去重
				var u = {}, newArrs = [];
				for (var j = 0, len = arrs.length; j < len; j++) {
					u[JSON.stringify(arrs[j])] = arrs[j];
				}
				
				for (var key in u) {
					newArrs.push(u[key]);
				}
				
				tools.getParentWindow()[setting.handleFun].apply(tools.getParentWindow(), [newArrs]);
				closeWindow();
			});
		},
		//关闭
		closeWindow: function() {
			$("p").delegate(_consts.selector.CLOSE_BTN, "click", function(){
				closeWindow();
			});
		},
		//查询
		queryForm: function() {
			$(_consts.selector.QUERY_TABLE).delegate(_consts.selector.QUERY_BTN, "click", function(){
				data.initSelectUnitsData();
			});
			
			//键盘事件
			$(window).keydown(function( e ){
				if(e.keyCode == 13){//
					$(_consts.selector.QUERY_TABLE).find(_consts.selector.QUERY_BTN).trigger("click")
				}
			});
		},
		 
		
		//全选
		allChecked: function() {
			$(_consts.selector.TABLE_LIST).delegate("thead tr .all-checked", "click", function(){
				//获取所有的tr
				var trs = $(_consts.selector.TABLE_LIST).find("tbody tr");
				//获取第一列
				var input = $(trs).find("input[type='checkbox']");
				//是否选中
				var isChecked = $(this).prop("checked");
				
				if(isChecked){
					//当前页全部选中
					input.prop("checked", true);
					
					
				}else{
					//当前页全部取消
					input.prop("checked", false);
					
					
				}
				tools.setSubmitEnable();
			});
		},
		//单个选中
		nodeOnchecked: function(){
			$(_consts.selector.TABLE_LIST).delegate("tbody tr, tbody tr input[name$='-select']", "click", function(e){
				//阻止时间向上冒泡
				e.stopPropagation(); 
				var isChecked; //标记是否选中
				var that;
					
				//如果点击的是勾选框
				if($(this).is("input")){
					that = this;
					isChecked = $(this).prop("checked");
				}
				//如果点击的是行
				if($(this).is("tr")){
					var td = $(this).find("td:first-child");
					that = $(td).children();
					isChecked = !$(that).prop("checked");
				}
				
				if(isChecked){
					$(that).prop("checked", true);
					if(setting.selectType == _consts.selectType.MULTI){
						var trs = $(_consts.selector.TABLE_LIST).find("tbody tr input[type='checkbox']");
						var achk = $.makeArray(trs).some(function(item, index, array){
							return $(item).prop("checked") == false;
						});
						
						if(!achk){
							tools.setAllCheckedState(true);
							
							
						}
					}
				}else{
					$(that).prop("checked", false);
					tools.setAllCheckedState(false);
					
					
				}
				tools.setSubmitEnable() ;
			});
		}
	},
	/*
	 * 工具类
	 */
	tools = {
		//设置全选是否可用
		setAllCheckedEnable: function(param) {
			$(_consts.selector.TABLE_LIST).find(".all-checked").attr("disabled", param);
		},
		//设置全选勾选或取消
		setAllCheckedState: function(param) {
			$(_consts.selector.TABLE_LIST).find(".all-checked").prop("checked", param);
		},
		//设置提交是否可用
		setSubmitEnable: function() {
			var ips = $(_consts.selector.TABLE_LIST).find("tbody tr input:checked");
			var subtn = $("p").find(_consts.selector.SUBMIT_BTN);
			if(setting.buttonSubmit === 'disabled'){
				if(ips.length > 0){
					$(subtn).attr("disabled", false);
				}else{
					$(subtn).attr("disabled", true);
				}
			}else if (setting.buttonSubmit === 'none'){
				
					$(subtn).attr("disabled", false);
				
			}
			
		},
		//获取父级iframe
		getParentWindow: function() {
			var iframes = top.$("iframe");
		    var length = iframes.length;
		    for(var i=0;i<length;i++){
		        if(iframes[i].contentWindow == window){
		            return  top.$(iframes[i]).data('nerisparentwindow');
		        }
		    }
		},
		getBindElementArrayObjSingle: function() {
			var pw = tools.getParentWindow();
				pw.singlepageEcho = pw.singlepageEcho || [];
		
			if (!pw.singlepageEcho[setting.dataBindId]) {
				pw.singlepageEcho[setting.dataBindId] = [];
			}
			
			return pw;
		}
		
		
	},
	/*
	 * 数据类
	 */
	data = {
		//初始化数据
		initSelectUnitsData: function() {
			var searchVal = $(_consts.selector.SEARCH_INPUT).val();
			$.ajax({
				url: setting.async.url,
				type: 'POST',
				dataType: 'JSON',
				data: {
					dataEcho: setting.async.param,
					searchParam: searchVal
				},
				success: function(result){
					var _html = [];
					var tbody = $(_consts.selector.TABLE_LIST).find("tbody");
					
					if(result && result.length > 0){
						tools.setAllCheckedEnable(false);
						// result 和 showDatas 中的对象进行循环比较
						// 如果有相同的对象，则把这个对象放进 echoDataArray 数组中
						// v1.8.1 解决搜索结果后，点击提交返回结果会覆盖掉显现数据的问题
						var sd = setting.showDatas || [];
						// 获取 showDatas 第一个对象中的 key。因为剩下的对象都有相同的key。
						for (var key in sd[0]) {
							ekeys.push(key);
						}
						
						// 通过 key 去比较 result 中是否有和 showDatas中相同的对象，以便进行回显处理
						for(var i = 0; i < result.length; i++){
							var isEqual = false; // 所有的 key 都相同时，返回 true。
							for (var k = 0; k < ekeys.length; k++) {
								var value = result[i][ekeys[k]];
								for (var dd = 0, l = sd.length; dd < l; dd++) {
									if (value === sd[dd][ekeys[k]]) {
										isEqual = true;
									}
								}
							}
							
							// 把这个对象放到回显数组中
							if (isEqual) {
								echoDataArrays.push(result[i]);
							}
							
							// 渲染表格行
							_html += view.addRow(result[i], i);
						}
						$(tbody).html(_html);
						data.dataEcho();
					}else{
						$(tbody).html(view.drawPlaceContent("没有符合条件的数据！"));
					}
				}
			});
		},
		//数据反显
		dataEcho: function() {
			if(setting.isEcho){
				var echoData = tools.getBindElementArrayObjSingle().singlepageEcho[setting.dataBindId] || [];
				var showData = echoDataArrays || [];
				var inps = $(_consts.selector.TABLE_LIST).find("tbody tr input[name$='-select']");
				if (echoData.length > showData.length) {
					//反显处理
					if(echoData){
						
						for(var i = 0; i < echoData.length; i++){
							var objs = echoData[i];
							var strObj = JSON.stringify(objs);
							for(var j = 0; j < inps.length; j++){
								var inptr = $(inps[j]).closest("tr");
								if(strObj === $(inptr).attr("rid")){
									$(inps[j]).prop("checked", true);
								}
							}
						}
						tools.setSubmitEnable();
						if(setting.selectType === _consts.selectType.MULTI){
							var trs = $(_consts.selector.TABLE_LIST).find("tbody tr input[type='checkbox']");
							var achk = $.makeArray(trs).some(function(item, index, array){
								return $(item).prop("checked") === false;
							});
							if(!achk){
								tools.setAllCheckedState(true);
							}
						}
					}
				}else if (echoData.length <= showData.length && echoData.length != 0) {
					//反显处理
					if(echoData){
						
						for(var i = 0; i < echoData.length; i++){
							var objSingle = echoData[i];
							var strObjs = JSON.stringify(objSingle);
							
							for(var j = 0; j < inps.length; j++){
								var inptr = $(inps[j]).closest("tr");
								if(strObjs === $(inptr).attr("rid")){
									$(inps[j]).prop("checked", true);
								}
							}
						}
						tools.setSubmitEnable();
						if(setting.selectType === _consts.selectType.MULTI){
							var trs = $(_consts.selector.TABLE_LIST).find("tbody tr input[type='checkbox']");
							var achk = $.makeArray(trs).some(function(item, index, array){
								return $(item).prop("checked") === false;
							});
							if(!achk){
								tools.setAllCheckedState(true);
							}
						}
					}
				}else {
					//反显处理
					for(k = 0; k < showData.length ; k++ ){
					
						var obj = showData[k];
						
						var strObj = JSON.stringify(obj);
						
						for(var r = 0; r < inps.length; r++){
							var inptrs = $(inps[r]).closest("tr");
							if(strObj === $(inptrs).attr("rid")){
								$(inps[r]).prop("checked", true);
							}
						}
				
					}
					tools.setSubmitEnable(); 
				}
			}
		}
	},
	/*
	 * 视图类
	 */
	view = {
		//绘制表头
		drawThead: function() {
			var _thead =[];
			if(setting.columns.length > 0){
				
				if(setting.selectType === _consts.selectType.SINGLE){
					_thead.push("<th class='text-center' width='10%'>选择</th>");
				}else{
					_thead.push("<th class='text-center' width='10%'><input type='checkbox' class='all-checked' disabled/></th>");
				}
				
				_thead.push("<th class='text-center' width='10%'>序号</th>");
				for(var i = 0; i < setting.columns.length; i++){
					var column = setting.columns[i];
					_thead.push("<th>", column.title, "</th>");
				}
				
			}else{
				_thead.push("");
			}
			return _thead.join("");
		},
		//绘制页面内容
		drawTable: function() {
			var _page = [];
			_page.push("<div class='popup-s'>");
				_page.push("<div class='popup_title'>");
					_page.push("<span>", setting.title ,"</span>");
					_page.push("<p>");
						_page.push("<button type='button' class='btn btn-primary btn-sm select_units_subtn' id='select_units_subtn' disabled = 'disabled'>提交</button>");
						_page.push("<button type='button' class='btn btn-danger btn-sm select_units_close' id='select_units_close'>关闭窗口</button>");
					_page.push("</p>");
				_page.push("</div>");
				_page.push("<div class='popup_content'>");
					_page.push("<form id='select_units_form' name='select_units_form' method='post' onsubmit='return false;'>"); //键盘事件，不触发点击事件
					_page.push("<table class='table table-bordered search_units_form_table'>");
						_page.push("<tr>");
							_page.push("<td class='table_bg text-center'>", setting.searchTitle ,"</td>");//查询标题
							_page.push("<td>");
							_page.push("<input type='text' class='form-control search_units_input_keywords' placeholder='"+ setting.placeholder +"'/>");
							_page.push("</td>");
							_page.push("<td align='center' class='table_bg'>");
							_page.push("<button type='button' class='btn btn-primary btn_query'>查询</button>");
							_page.push("<button type='reset' class='btn btn-warning btn_clear'>清空</button>");
							_page.push("</td>");
						_page.push("</tr>");
					_page.push("</table>");
				_page.push("</form>");
				_page.push("<table class='table table-condensed table-striped table-hover select_units_form_list'>");
					_page.push("<thead>");
						_page.push(this.drawThead());
					_page.push("</thead>");
					_page.push("<tbody>");
						_page.push(this.drawPlaceContent("正在加载中..."));
					_page.push("</tbody>");
				_page.push("</table>");
				_page.push("</div>");
			_page.push("</div>");
			
			if ($(setting.container).length > 0){
				$(setting.container).html(_page.join(' '));
			} else {
				$(window.document.body).html(_page.join(' '));
			}
		},
		//列表没有数据时显示
		drawPlaceContent: function(data) {
			var _nodata = [];
			if(setting.columns.length > 0){
				_nodata.push("<tr>");
					_nodata.push("<td class='text-center font_red' colspan='"+(setting.columns.length + 2)+"'>");
						_nodata.push(data);
					_nodata.push("</td>");
				_nodata.push("</tr>");
				return _nodata.join(" ");
			}
		},
		//添加行
		addRow: function(rowData, index) {
			var _tr = [];
			//获取选中区序号的最大值
			var rbody = $(_consts.selector.TABLE_RESULT).find("tbody");
			
			_tr.push("<tr rid='"+ JSON.stringify(rowData) +"'>");
			if(setting.selectType === _consts.selectType.SINGLE){
				_tr.push("<td class='text-center'><input type='radio' name='single-select'/></td>");
			}else{
				_tr.push("<td class='text-center'><input type='checkbox' name='multi-select'/></td>");
			}
			_tr.push("<td class='text-center index-number'>", (index + 1) , "</td>");
			if(setting.columns){
				for(var i = 0; i < setting.columns.length; i++){
					var column = setting.columns[i];
					_tr.push("<td title='"+rowData[column.data]+"'>", rowData[column.data] , "</td>");
				}
			}
			_tr.push("</tr>");
			return _tr.join(" ");
		},
		//渲染滚动条样式
		renderScorllStyle: function() {
			$(window.document.body).mCustomScrollbar({ theme:'dark'});
		}
	},
	_init = function(zSetting){
		$.extend(true, setting, zSetting);
		
		//绘制视图
		view.drawTable();

		//加载数据
		data.initSelectUnitsData();
		
		//窗口事件绑定
		event.dataSubmit();//提交
		event.closeWindow();//关闭
		
		//列表区事件绑定
		event.queryForm();//查询
		event.allChecked();//全选
		event.nodeOnchecked();//单选
	};
	/*
	 * 组件主体方法入口
	 */
	$.selectUnits = {
		initSinglePage: function(zSetting) {
			_init(zSetting);
		}
	};
	
	$.unitsSinglePage = {
			init: function(zSetting){
				_init(zSetting);
			},
			
			/**
			 * clearSinglePageDatas 清空
			 */
			clearSinglePageDatas : function() {
					for (var key in window.singlepageEcho) {
						window.singlepageEcho[key].length = 0;
					}
			},
			
			/**
			 * 删除指定属性值  
			 */
			removeSinglePage: function(key , value){
				if (arguments.length !== 2 || !key || !value) {
					throw new Error("$.unitsSinglePage.removeSinglePage()方法参数异常!");
				}
				
				for(var pro in window.singlepageEcho){
					var nodes = window.singlepageEcho[pro];
					
					for (var i = 0; i < nodes.length; i++) {
						var node = nodes[i];
						if (node[key] == value) {
							nodes.splice(i, 1);
		                 	i--;
		                 	return;
						}
				}
			}
		}
	}


})(jQuery);