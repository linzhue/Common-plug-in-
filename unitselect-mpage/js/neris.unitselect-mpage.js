/*
 * 多页部门选择组件 
 * 依赖分页组件：neris.pagination.js， 弹出框组件neris.dialog.js，第三方高亮显示组件jquery.textSearch-1.0.js
 * 
 * Copyright (c) 2015 中国证监会中央监管信息平台版权所有
 * 
 * Date : 2017/09/11
 * Version: 1.18
 * Author : 公共组件组 Gongph
 * 
 */
(function($){
	/*
	 * 常量
	 */
	var _consts = {
			//选择模式
			selectType: {
				MULTI: 'multi', //多选
				SINGLE: 'single'//单选
			},
			//勾选类型
			checkType: {
				CHECKBOX:'checkbox', 
				RADIO: 'radio'
			},
			//选择器
			selector: {
				FORM_ID: '.select-result-area',
				SEARCH_RESULT_TABLE: '.search-result-table',
				TABLE_LIST: '.select_units_form_list',//数据列表展示
				SEARCH_INPUT: '.search_units_input_keywords',//查询输入框
				CLOSE_BTN: '#select_units_close',//关闭按钮
				SUBMIT_BTN: '#select_units_subtn',//提交按钮
				CLEAR_BTN: '#select_units_clear', //清空按钮
				QUERY_TABLE: '.search_units_form_table',//查询表格
				QUERY_BTN: '.btn_query',//查询按钮
				TABLE_RESULT: '.select_units_result',//结果选中表格
				HEADINGTWO: '.units-multipage',
				DEL_BTN: '.btn-del',//删除按钮
				FIND_BTN: '.btn-find'//查找按钮
			}
	},
	/*
	 * 默认参数设置
	 */
	setting = {
			title: 'title',
			tableTitle :'机构列表',
			searchTitle: 'Search',
			tdisabled :'disabled',
			/**
			 * 提交按钮事件
			 */
			buttonSubmit : 'disabled' ,
			pageSize: 5,
			selectType: _consts.selectType.MULTI,
			url: '',
			columns: [],
			showIndex: true,
			showPrompt: true,
			placeholder:'',
			dataBindId: '',
			handleFun: '',
			isEcho: true,
			container:'',
			echoId : '' ,//反显依赖唯一标识   
			showDatas: []
	},
	/*
	 * 事件绑定
	 */
	events = {
		//初始化绑定事件
		initBinds : function() {
			//定义单选事件。that：当前点击的dom对象
			$(document).on('neris.one.checked', function(event, that) {
				var obj = $(that); // 勾选框
					isChecked = false; // 是否已经勾选
					
				if ($(that).is('input')) {
					isChecked = obj.prop('checked');
				}
				
				if ($(that).is('tr')) {
					obj = $(that).find('input');
					isChecked = !obj.prop('checked');
				}
				
				if (isChecked) {
					obj.prop('checked', true)
				} else {
					obj.prop('checked', false)
				}
				
				//如果不是结果选中区，则新增一行
				if (obj.prop('name') != 'result-select') {
					if (isChecked) {
						
						//如果是单选，每次只能选择一个
						if (setting.selectType == 'single') {
							//清空结果选中区
							tools.removeCheckedRow('clear');
						}
						//判断是否添加过
						if (!tools.checkRowIsExist(obj)) {
							tools.addRow(JSON.parse(obj.prop('id')));
						}
						
					} else {
						tools.removeRow(jQuery.parseJSON($(obj).prop('id'))[setting.echoId]);
						//重新排序
						tools.reordering();
					}
					
					//检查结果区是否有数据
					if (tools.checkResultAreaIsHasDatas()) {
						tools.setResultAllBtnDisabledState(false);
					} else {
						tools.setResultAllBtnDisabledState(true);
					}
					
				} else {
					tools.setResultDelBtnState();
				}
				
			});
			
			//定义全选事件。 that：当前点击的dom对象
			$(document).on('neris.all.checked', function(event, that) {
				var obj = $(that), //全选勾选框对象
					isChecked = false, 
					ownTable = obj.closest('table'), //所属table
					chks = ownTable.find("tbody input[type='checkbox']"); //所有的勾选框
				
				if(obj.prop('checked')) {
					isChecked = true;
					chks.prop('checked', true);
				} else {
					chks.prop('checked', false);
				}
				
				//如果是列表区，点击全选增加行到结果区
				if ($(obj).prop('name') === 'list-all-checked') {
					
					if (!chks) {
						return;
					}
					
					if (isChecked) {
						//添加
						for (var i = 0; i < chks.length; i++) {
							//判断是否添加过
							if (!tools.checkRowIsExist(chks[i])) {
								tools.addRow(JSON.parse($(chks[i]).prop('id')));
							}
						}
						
					} else {
						//删除
						for (var j = 0; j < chks.length; j++) {
							tools.removeRow(jQuery.parseJSON($(chks[j]).prop('id'))[setting.echoId]);
						}
						
						//重新排序
						tools.reordering();
					}
					
					//检查结果区是否有数据
					if (tools.checkResultAreaIsHasDatas()) {
						tools.setResultAllBtnDisabledState(false);
					} else {
						tools.setResultAllBtnDisabledState(true);
					}
					
				} else {
					tools.setResultDelBtnState();
				}
				
			});
			
			//监听清空、删除事件。 type = 'clear' | 'delete'; msg：提示文本
			$(document).on('neris.clear.delete.event', function(event, type, msg) {
				var delBtn0 = _consts.selector.HEADINGTWO + " " + _consts.selector.DEL_BTN,
				chks = $(_consts.selector.TABLE_RESULT).find("tbody tr input:checked");
			
						if (chks.length > 0) {
							confirm("确定要"+msg+"吗？", function(flag){
								if(flag){
									tools.removeCheckedRow(type);
								}
							});
							
						} else {
							confirm("请勾选你要删除的数据", function(flag){
								if(flag){
									return;
								}
							});
						}
				
			});
			
			/*--其他事件--*/
			events.dataSubmit();//提交
			events.closeWindow();//关闭
			events.clearDatas();//清空
			
			//列表区事件绑定
			events.queryForm();//查询
			events.allChecked();//全选
			events.oneChecked();//单选
			events.checkedDisabled() ;//控制x提交按钮是否可用
			
			//选中区事件绑定
			events.delResultRow();//删除
			events.textSearch();//查找
			//页面折叠
			events.hiddenShow();
			events.hiddenShowResult();
		},
		/**
		 * 页面折叠事件
		 */
		hiddenShow: function(){
			
			$('#hidden_bmdy').show().bind('click', function() {
				$(this).hide();
				$('#liveCheckDiv').hide();
				$('#show_bmdy').show();
				
			});
			$('#show_bmdy').hide().bind('click', function() {
				$(this).hide();
				$('#liveCheckDiv').show();
				$('#hidden_bmdy').show();
				
			});
		},
		/**
		 * 页面折叠事件result
		 */
		hiddenShowResult: function(){
			
			$('#hidden_result_bmdy').show().bind('click', function() {
				$(this).hide();
				$('#liveCheckDivResult').hide();
				$('#show_result_bmdy').show();
				
			});
			$('#show_result_bmdy').hide().bind('click', function() {
				$(this).hide();
				$('#liveCheckDivResult').show();
				$('#hidden_result_bmdy').show();
				
			});
		},
		//提交
		dataSubmit: function() {
			$("p").delegate(_consts.selector.SUBMIT_BTN, 'click', function() {
				var trs = tools.getResultDatas(),
					nodes = [],
					bindDatas = [];
				
				for(var i = 0; i < trs.length; i++){
					var rowId = $(trs[i]).attr("rid"),
						obj = JSON.parse(rowId);
					
					nodes[i] = obj;
				}
				
				if(setting.dataBindId && setting.isEcho){
					//1.7.6版新增。绑定数据到指定元素上
					tools.getBindElementArrayObj().multipageEcho[setting.dataBindId] = nodes;
				}
				
				//数据回调到用户自定义方法中
				tools.getParentWindow()[setting.handleFun].apply(tools.getParentWindow(), [nodes]);
				
				closeWindow();
				
			});
		},
		//关闭窗口
		closeWindow: function() {
			$(_consts.selector.CLOSE_BTN).on('click', function () {
				closeWindow();
			});
		},
		/**
		 * 提交按钮事件
		 * 
		 */
		checkedDisabled : function() {
			
				var lenCkb = $('input[name$= "-select"]:checked').length ;
				if(setting.buttonSubmit === 'disabled'){
					if(lenCkb > 0){
						$("#select_units_subtn").removeAttr("disabled");
					} else {
						$("#select_units_subtn").attr("disabled", true);
					}
				}else if(setting.buttonSubmit = 'none'){
					if(lenCkb > 0){
						$("#select_units_subtn").removeAttr("disabled");
					} else {
						$("#select_units_subtn").attr("disabled", false);
					}
				}
				
			
		},
		
		//单选
		oneChecked: function() {
			$(_consts.selector.TABLE_LIST + "," + _consts.selector.TABLE_RESULT).delegate("tbody tr, tbody tr input[name$='-select']", 'click', function (e){
				e.stopPropagation();
				$(document).trigger('neris.one.checked', [this]); //触发单选事件
				events.checkedDisabled() ;
			});
		},
		//全选
		allChecked: function() {
			$(_consts.selector.TABLE_LIST + "," + _consts.selector.TABLE_RESULT).delegate("thead tr input[name$='-all-checked']", 'click', function(e) {
				e.stopPropagation();
				$(document).trigger('neris.all.checked', [this]); //触发全选事件
				events.checkedDisabled() ;
			});
		},
		//清空
		clearDatas: function() {
			$(_consts.selector.CLEAR_BTN).on("click", function () {
				$(this).blur();
				$(document).trigger('neris.clear.delete.event', ['clear','清空']);
			});
		},
		//删除
		delResultRow: function() {
			$(_consts.selector.HEADINGTWO).delegate(_consts.selector.DEL_BTN, 'click', function() {
				$(this).blur();
				$(document).trigger('neris.clear.delete.event', ['delete','删除']);
				events.checkedDisabled() ;
			});
			
		},
		//查询
		queryForm: function() {
			$(_consts.selector.QUERY_TABLE).delegate(_consts.selector.QUERY_BTN, "click", function(){
				data.initSelectUnitsData();
			});
		},
		//结果区查找
		textSearch: function() {
			$(_consts.selector.SEARCH_RESULT_TABLE).delegate(_consts.selector.FIND_BTN, "click", function(){
				$(this).blur();
				try {
					var keyword = $(_consts.selector.SEARCH_RESULT_TABLE + " .text-search-keywords").val(),
						contentArea = $(_consts.selector.TABLE_RESULT).find("tbody");
					if (contentArea.children().length > 0) {
						$(contentArea).textSearch(keyword);
					}
				} catch (e) {
					console.error("查询失败！可能原因：");
					console.error(e.message);
				}
				return false;
			});
		}
	},
	/*
	 * 工具类
	 */
	tools = {
		//设置列表区全选按钮勾选状态。
		setListAllBtnCheckedState: function(state) {
			var allChkBtn = _consts.selector.TABLE_LIST + " input[name='list-all-checked']";
			if (state) {
				$(allChkBtn).prop('checked', state);
			} else {
				var len = tools.getListCheckedDatas().length;
				if (len < setting.pageSize) {
					$(allChkBtn).prop('checked', false);
				} else {
					$(allChkBtn).prop('checked', true);
				}
			}
		},
		//设置结果区全选按钮勾选状态
		setResultAllBtnCheckedState: function(state) {
			var allChkBtn = _consts.selector.TABLE_RESULT + " input[name='result-all-checked']";
			$(allChkBtn).prop('checked', state);
		},
		//设置列表区按钮禁用状态
		setListAllBtnDisabledState: function(state) {
			var allChkBtn = _consts.selector.TABLE_LIST + " input[name='list-all-checked']";
			tools.modifyBtnState(allChkBtn, state);
		},
		//设置结果区按钮禁用状态
		setResultAllBtnDisabledState: function(state) {
			var allChkBtn = _consts.selector.TABLE_RESULT + " input[name='result-all-checked']";
			tools.modifyBtnState(allChkBtn, state);
		},
		//设置结果区删除按钮显示状态
		setResultDelBtnState: function() {
			var delBtn = _consts.selector.HEADINGTWO + " " + _consts.selector.DEL_BTN,
				chks = $(_consts.selector.TABLE_RESULT).find("tbody tr input:checked");
			
			if (chks.length > 0) {
				$(delBtn).show();
			} else {
				$(delBtn).show();
			}
			
		},
		//修改按钮状态。selector选择器; state是boolean类型时禁用页面元素, state是 'show' 或 'hide' 显示、隐藏页面元素。
		modifyBtnState: function(selector, state) {
			if (typeof state === 'boolean') {
				$(selector).attr('disabled', state);
			} else  if (state === 'show') {
				$(selector).show();
			} else if (state === 'show'){
				$(selector).show();
			}
		},
		//根据id删除一行。
		removeRow: function(id) {
			var rvRs = $(_consts.selector.TABLE_RESULT).find("tbody tr") ;
			
			for (var t = 0 ; t < rvRs.length ; t++){
				
				var rvR = $(rvRs[t]).attr("rid");
				var inpJSON = jQuery.parseJSON(rvR);
				var rv = inpJSON[setting.echoId] ;
					if(id === rv){
						$(rvRs[t]).remove();
					}
					
			}
			events.checkedDisabled() ;
			
		},
		//删除勾选的行。当optType = 'clear'时执行清空操作; 当optType = 'delete'时执行删除操作。
		removeCheckedRow: function(optType) {
			var chkDatas = tools.getResultCheckedDatas();
			if (optType === 'clear') {
				chkDatas = tools.getResultDatas();
			}
			
			for (var i = 0; i < chkDatas.length; i++) {
				var rid = $(chkDatas[i]).attr('rid');
				
				
				var ridJson = jQuery.parseJSON(rid);
				var ridJName = ridJson[setting.echoId];
				tools.removeRow(ridJName);
				//去掉列表中对应checkbox的勾选状态
				tools.clearListCheckState(ridJName);
				events.checkedDisabled() ;
			}
			
			//重新排序
			tools.reordering();
			//设置列表区全选按钮状态
			tools.setListAllBtnCheckedState();
			//设置结果区全选按钮状态
			if (!tools.checkResultAreaIsHasDatas()) {
				tools.setResultAllBtnDisabledState(true);
				tools.setResultAllBtnCheckedState(false);
				tools.setResultDelBtnState();
			} 
		},
		//增加一行
		addRow: function(obj) {
			$(_consts.selector.TABLE_RESULT).find("tbody").append(tools.renderRow(obj));
		},
		//渲染一行
		renderRow: function(obj) {
			var tr = [], maxNum = tools.getMaxRowNum();
			
			tr.push("<tr rid='"+JSON.stringify(obj)+"'>");
				tr.push("<td class='text-center'><input type='checkbox' name='result-select'/></td>");
				tr.push("<td class='text-center index-number'>",maxNum, "</td>");
			
			if (!setting.columns) {
				return '';
			}
			
			for (var i = 0, len = setting.columns.length; i < len; i++) {
				var column = setting.columns[i],
					data = obj[column.data];
				tr.push("<td title='"+data+"'>"+data+"</td>")
			}
			
			tr.push("</tr>");
			
			return tr.join(" ");
			
		},
		//得到结果区最大行数
		getMaxRowNum: function() {
			var rbody = $(_consts.selector.TABLE_RESULT).find("tbody"),
				len = rbody.children().length;
			
			if (len <= 0) {
				return 1;
			} else {
				return (len + 1);
			}
			
		},
		//检查当前行是否已经存在结果区
		checkRowIsExist: function(currentRow) {
			var trs = $(_consts.selector.TABLE_RESULT).find("tbody tr"),
				currentId = jQuery.parseJSON($(currentRow).prop('id'))[setting.echoId],
				isExist = false;
			
			if (!trs) {
				return isExist;
			}
			
			var flag = $.makeArray(trs).some(function(item, index, array) {
				return jQuery.parseJSON($(item).attr('rid'))[setting.echoId] === currentId;
			});
			
			if (flag) {
				isExist = true;
			}
			
			return isExist;
		},
		//检查结果区是否有数据
		checkResultAreaIsHasDatas: function() {
			return $(_consts.selector.TABLE_RESULT).find("tbody").children().length <= 0 ? false : true;
		},
		//重新排序
		reordering: function() {
			var nums = $(_consts.selector.TABLE_RESULT).find("tbody tr").children(".index-number");
			if(nums.length > 0){
				$.each(nums, function(index, item){
					$(item).html(index + 1);
				});
			}
		},
		//数据翻页勾选
		dataPageCheck: function() {
			var trs = $(_consts.selector.TABLE_RESULT).find("tbody tr");
			if (trs.length <= 0) {
				return;
			}
			
			for (var i = 0, len = trs.length; i < len; i++) {
				
				var rid = $(trs[i]).attr('rid');
				var ridJson = jQuery.parseJSON(rid);
				if (setting.echoId != ''){
					var ridJID = ridJson[setting.echoId];
				} else {
					var ridJID = ridJson.id;
				}
				
				
				chkObj = $(_consts.selector.TABLE_LIST).find("tbody tr input[name$='-select']");
				
				for(var k = 0 ; lens = chkObj.length , k < lens ; k++){
					var inp = $(chkObj[k]).attr("id");
					var inpJSON = jQuery.parseJSON(inp);
					if (setting.echoId != ''){
						var chkID = inpJSON[setting.echoId] ;
					} else {
						var chkID = inpJSON.id ;
					}
					
					
					
					if (ridJID === chkID) {
						$(chkObj[k]).prop('checked', true);
					}
				}	
			}
		},
		
		//得到列表区选中的结果数据
		getListCheckedDatas: function() {
			return $(_consts.selector.TABLE_LIST).find("tbody td input:checked");
		},
		//得到结果区选中的结果数据
		getResultCheckedDatas: function() {
			var chks = $(_consts.selector.TABLE_RESULT).find("tbody td input:checked");
			return $(chks).closest('tr');
		},
		//得到结果区结果数据
		getResultDatas: function() {
			return $(_consts.selector.TABLE_RESULT).find("tbody tr");
		},
		//清除列表中对应id的勾选状态
		clearListCheckState: function(id) {
			if (!id) {
				return;
			}
			
			var chk = $(_consts.selector.TABLE_LIST).find("tbody input[name$='-select']");
			
			for(var p = 0 ; lens = chk.length , p < lens ; p++){
				var inp = $(chk[p]).attr("id");
				var inpJSON = jQuery.parseJSON(inp);
				var chkOName = inpJSON[setting.echoId] ;
				
				if (id === chkOName) {
					$(chk[p]).prop('checked', false);
				}
			}
			
			events.checkedDisabled() ;
			
		},
		//获取父级iframe
		getParentWindow: function() {
			var iframes = top.$("iframe"),
		    	length = iframes.length;
			
		    for(var i = 0; i < length; i++){
		        if(iframes[i].contentWindow == window){
		            return  top.$(iframes[i]).data('nerisparentwindow');
		        }
		    }
		},
		//绑定数据到指定元素，返回父窗口对象
		getBindElementArrayObj: function() {
			var pw = tools.getParentWindow();
				pw.multipageEcho = pw.multipageEcho || [];
		
			if (!pw.multipageEcho[setting.dataBindId]) {
				pw.multipageEcho[setting.dataBindId] = [];
			}
			
			return pw;
		},
		//排量添加
		batchAddRow: function(list) {
			if (!list) {
				return;
			}
			
			tools.setResultAllBtnDisabledState(false);
			
			for (var i = 0, len = list.length; i < len; i++) {
				tools.addRow(list[i]);
			}
		}
	},
	/*
	 * 数据类
	 */
	data = {
		//初始化数据方法
		initDatas: function() {
			data.dataEcho();
			data.initSelectUnitsData();
		},
		//初始化数据
		initSelectUnitsData: function() {
			var param = $(_consts.selector.SEARCH_INPUT).val();
			$(_consts.selector.TABLE_LIST).find("tfoot tr td").nerisPagination({
				url: setting.url,
				pageSize: setting.pageSize,
				param: {
					searchParam:  (param === null) ? "" : param
				},
				success: function(result) {
					 var tbody = [];
					 view.setTableListFooter(); // 设置 `<tfoot>` 跨行
					 if(result.pageList.length > 0){
						 tools.setListAllBtnCheckedState(false);
						 tbody.push(view.renderListDatas(result));
					 }else{
						 tbody.push(view.drawNoData());
					 }
					 
					 view.drawListDatas(tbody);
					 
					 //翻页勾选已选过的数据
					 tools.dataPageCheck();
					 
					 tools.setListAllBtnCheckedState();
					 
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.error('初始化数据出错，原因：');
					console.error(errorThrown);
				}
				
			});
		},
		//数据反显
		dataEcho: function() {
			if(setting.isEcho){
				var echoData = tools.getBindElementArrayObj().multipageEcho[setting.dataBindId] || [];
				var showDatas = setting.showDatas || [];
				
				if (echoData.length > 0) {
					tools.batchAddRow(echoData);
				} else {
					tools.batchAddRow(showDatas);
				}
			}
		}
	},
	/*
	 * 视图
	 */
	view = {
		//设置列表footer跨行
		setTableListFooter: function() {
			 $(_consts.selector.TABLE_LIST).find("tfoot tr td").attr("colspan", (setting.columns.length + 2));
		},
		//绘制列表主体数据
		drawListDatas: function(tbody) {
			 $(_consts.selector.TABLE_LIST).find("tbody").html(tbody);
		},
		//渲染列表主体数据
		renderListDatas: function(result) {
			var _tbody = [];
			 for(var i = 0; i < result.pageList.length; i++){
				 _tbody.push("<tr>");
				 var obj = result.pageList[i];
				 
				 //选择模式不同生成的勾选按钮不同
				 if(setting.selectType == _consts.selectType.SINGLE){
					 _tbody.push("<td class='text-center'><input id='"+ JSON.stringify(obj) +"' type='radio' name='single-select'/></td>");
				 }else{
					 _tbody.push("<td class='text-center'><input id='"+ JSON.stringify(obj) +"' type='checkbox' name='multi-select'/></td>");
				 }
				 
				 //是否开启索引选项
				 if(setting.showIndex){
					 _tbody.push("<td class='text-center' name='td-index-number'>", (i+1) , "</td>");
				 }
				 
				 for(var j = 0; j < setting.columns.length; j++){
					 var column = setting.columns[j];
					 
					 //是否开启提示选项
					 if(setting.showPrompt){
						 _tbody.push("<td title='", obj[column.data] ,"'>");
					 }else{
						 _tbody.push("<td>");
					 }
					 
					 _tbody.push(obj[column.data], "</td>");
				 }
				 
				 _tbody.push("</tr>");
			 }
			 
			 return _tbody.join(" ");
		},
		//绘制表头
		drawThead: function(flag) {
			var _thead =[];
			if(setting.columns.length > 0){
				if(flag){ 
					if(setting.selectType == _consts.selectType.SINGLE){
						_thead.push("<th width='10%' class='text-center'>选择</th>");
					}else{
						_thead.push("<th width='10%' class='text-center'><input type='checkbox' name='list-all-checked'/></th>");
					}
					
					if(setting.showIndex){
						_thead.push("<th width='10%' class='text-center'>序号</th>");
					}
				}else{
					_thead.push("<th width='10%' class='text-center'><input type='checkbox' name='result-all-checked' disabled/></th>");
					_thead.push("<th width='10%' class='text-center'>序号</th>");
				}
				
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
					_page.push("<span>", setting.title ,"</span>");//标题
					_page.push("<p>");
						//_page.push("<button type='button' class='btn btn-warning btn-sm select_units_clear' id='select_units_clear'>清空</button>");
						_page.push("<button type='button' class='btn btn-primary btn-sm select_units_subtn' id='select_units_subtn' disabled = 'disabled'>提交</button>");
						_page.push("<button type='button' class='btn btn-danger btn-sm select_units_close' id='select_units_close'>关闭窗口</button>");
					_page.push("</p>");
				_page.push("</div>");
				_page.push("<div class='popup_content units-multipage'>");	
				
				if(setting.tdisabled === "disabled"){
					_page.push("<h4 style='padding-bottom: 5px;'>");
					_page.push("<span>", setting.tableTitle ,"</span>");//自定义内容					
					_page.push("<button type='button' style='position: absolute;top: -9px;right: 0px;' class='btn btn-danger btn-sm' id='hidden_bmdy'><span style='width:20px' class='up_arrow'></span></button>");
					_page.push("<button type='button' style='position: absolute;top: -9px;right: 0px;' id='show_bmdy' class='btn btn-danger btn-sm unvisible'><span style='width:20px' class='down_arrow'></span></button>");	
					_page.push("</h4>");
				}else if(setting.tdisabled === "none"){
					_page.push("<h3 style='padding-bottom: 5px;'>");
					
					_page.push("<button type='button' style='position: absolute;top: 45px;right: 15px;' class='btn btn-danger btn-sm' id='hidden_bmdy'><span style='width:20px' class='up_arrow'></span></button>");
					_page.push("<button type='button' style='position: absolute;top: 45px;right: 15px;' id='show_bmdy' class='btn btn-danger btn-sm unvisible'><span style='width:20px' class='down_arrow'></span></button>");	
					_page.push("</h3>");
				
				}
					_page.push("<div id='liveCheckDiv'>");
					_page.push("<form  id='select_units_form' name='select_units_form' method='post'>");
									_page.push("<table class='table table-bordered search_units_form_table'>");
										_page.push("<tr>");
											_page.push("<td class='table_bg text-center'>", setting.searchTitle ,"</td>");//查询标题
											_page.push("<td>");
											_page.push("<input type='text' class='form-control search_units_input_keywords' placeholder='"+ setting.placeholder +"'/>");
											_page.push("</td>");
											_page.push("<td align='center' class='table_bg'>");
											_page.push("<button type='button' class='btn btn-primary btn_query'>查询</button>");
											_page.push("<button type='reset'  class='btn btn-warning btn_clear'>清空</button>");
											_page.push("</td>");
										_page.push("</tr>");
									_page.push("</table>");
								_page.push("</form>");
								_page.push("<table id='select_units_form' class='table table-condensed table-striped table-hover select_units_form_list'>");
									_page.push("<thead>");
										_page.push(this.drawThead(true));
									_page.push("</thead>");
									_page.push("<tbody></tbody>");
									_page.push("<tfoot>");
										_page.push("<tr>");
											_page.push("<td></td>");
										_page.push("</tr>");
									_page.push("</tfoot>");
								_page.push("</table>");
							_page.push("</div>");	
					
							_page.push("<h4>");
							_page.push("选中结果列表");
							_page.push(" <button type='button' style='float:right; position: relative;top:-9px;margin-left: 5px;' class='btn btn-danger btn-sm' id='hidden_result_bmdy'><span style='width:20px' class='up_arrow'></span></button>");
							_page.push(" <button type='button' style='float:right; position: relative;top:-9px;margin-left: 5px;' id='show_result_bmdy' class='btn btn-danger btn-sm unvisible'><span style='width:20px' class='down_arrow'></span></button>");
							_page.push("<button style='float:right;position: relative;top:-9px;' class='btn btn-danger btn-sm btn-del'>删除</button>");
							_page.push("</h4>");
						
							_page.push("<div id='liveCheckDivResult'>")
								_page.push("<form>");
									_page.push("<table class='table table-bordered search-result-table'>");
										_page.push("<tbody>");
											_page.push("<tr>");
												_page.push("<td class='table_bg text-center'>请输入关键字</td>");
												_page.push("<td><input type='text' class='form-control text-search-keywords' placeholder='多个关键字用空格隔开'/></td>");
												_page.push("<td align='center' class='table_bg'>");
												_page.push("<button type='button' class='btn btn-primary btn_query btn_bg btn-find'>查询</button>");
												_page.push("<button type='reset'  class='btn btn-warning'>清空</button>");
												_page.push("</td>");
											_page.push("</tr>");
										_page.push("</tbody>");
									_page.push("</table>");
								_page.push("</form>");
								_page.push("<div class='select-result-area'></div>");
							_page.push("</div>");
						_page.push("</div>");
					//_page.push("</div>");
					//more...
			
			
			if ($(setting.container).length > 0){
				$(setting.container).html(_page.join(' '));
			} else {
				$(window.document.body).html(_page.join(' '));
			}
			
			view.drawResultTable();
			
		},
		//绘制选中结果区
		drawResultTable: function() {
			var resultArea = [];
			resultArea.push("<table class='table table-condensed table-striped table-hover select_units_result'>");
				resultArea.push("<thead>");
					resultArea.push(this.drawThead(false));
				resultArea.push("</thead>");
				resultArea.push("<tbody></tbody>");
			resultArea.push("</table>");
			$(_consts.selector.FORM_ID).html(resultArea.join(" "));
		},
		//列表没有数据时显示
		drawNoData: function() {
			var _nodata = [], num = 2;
			if(!setting.showIndex){
				num = 1;
			}
			if(setting.columns.length > 0){
				_nodata.push("<tr>");
					_nodata.push("<td class='text-center font_red' colspan='"+(setting.columns.length + num)+"'>");
						_nodata.push("没有符合条件的数据！");
					_nodata.push("</td>");
				_nodata.push("</tr>");
				return _nodata.join(" ");
			}
		},
		//渲染滚动条样式
		renderScorllStyle: function() {
			$(window.document.body).mCustomScrollbar({ theme:'dark'});
		}
	};
	//组件主体方法入口
	$.selectUnits = {
		//初始化
		initMultiPage: function(zSetting) {
			$.extend(true, setting, zSetting);
			//绘制视图
			view.drawTable();
			//加载数据
			data.initDatas();
			//事件绑定
			events.initBinds();
		},
		//清空绑定到指定元素上的数据
		clearMultiPageDatas: function() {
			for (var key in window.multipageEcho) {
				window.multipageEcho[key].length = 0;
			}
		},
		//删除指定属性值，key:属性，value:key对应的值
		removeMultiPageDatas: function(key, value) {
			if (arguments.length !== 2 || !key || !value) {
				throw new Error("$.selectUnits.removeMultiPageDatas()方法参数异常!");
			}
			
			for (var prop in window.multipageEcho) {
				var nodes = window.multipageEcho[prop];
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