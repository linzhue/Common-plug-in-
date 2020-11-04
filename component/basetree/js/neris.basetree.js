'use strict';
/*
 * 树形组件
 * 目前使用的是zTree版本v3.5.18
 * 该组件依赖第三方插件有：
 * jquery.ztree.core:zTree核心包
 * jquery.ztree.excheck:支持checkbox和radio功能
 * jquery.ztree.exhide:支持节点隐藏功能
 * zTree官网：http://zTree.me/
 * Author: neris公共组件组 gongph
 * Version: 1.19.0
 * Date: 2015-09-30
 * LastModifyDate: 2016/12/08
 * Copyright ® 中国证监会中央监管信息平台版权所有
 */
if (typeof jQuery === 'undefined') {
    throw new Error('jquery.neris.tree requires jQuery');
}

(function($){
	var treeObj, syncSearchResult,
	/**
	 * 默认常量
	 */
	_consts = {
			checkbox:{
				STYLE: "checkbox",
			},
			radio: {
				STYLE: "radio",
				TYPE_ALL: "all",
				TYPE_LEVEL: "level"
			},
			selector:{
				SEARCH_INPUT_ID: "#sSearchParam",
				SEARCH_BTN: "#zTree_search_btn",
				LEFTTREE: "#nerisTree .left_tree",
				RIGHTTREE: "#nerisTree .right_tree",
				TR: "#nerisTree .right_tree table thead tr",
				TBODY: "#nerisTree .right_tree table tbody",
				INPUT_CHECKBOX: "input[type='checkbox']",
				NTREE: "#nTree",
				THEME_ID: "#myskin"
			},
			event: {
				CLICK:"click"
			}
	},
	/**
	 * 事件处理
	 */
	eventHandle = {
			//捕获异步加载之前的事件回调函数
			nTreeBeforeAsync: function(treeId, treeNode) {
				if(treeNode && setting.level){
					return (treeNode.level < (setting.level - 1)); 
				}
			},
			nTreeOnAsyncSuccess: function(event, treeId, treeNode, result) {
				var obj = $.parseJSON(result);
				if(obj && !setting.relateParent){
					for(var i = 0; i < obj.length; i++){
						var node = tools.getNodeByParam("id", obj[i].id);
						if(node.isParent){
							node.nocheck = true;
							tools.updateNode(node);
						}
					}
				}
			},
			//节点被选择触发函数
			nodeOnCheck: function(event, treeId, treeNode) {
				var nodes = tools.getCheckedNodes();
				var changeNodes = tools.getChangeCheckedNodes();
				var tbodyElements = $(_consts.selector.TBODY).children();
				views.showTable();
				
				if(setting.check.chkStyle == _consts.checkbox.STYLE ){
					views.handleCheckbox(setting, treeNode, nodes, changeNodes, tbodyElements);
				}
				if(setting.check.chkStyle == _consts.radio.STYLE ){
					views.handleRadio(setting, treeNode, nodes, changeNodes, tbodyElements);
				}
				
				if(tools.getCheckedNodes() == 0){
					views.hideTable();
				}
				
			},
			//异步加载出错时触发函数
			nTreeOnAsyncError: function(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
				console.error(XMLHttpRequest);
			},
			//绑定点击右侧Table中的checkbox删除一行数据
			bindRemoveOneRowEvent: function(element, eventName) {
				$(_consts.selector.TBODY).delegate(element, eventName, function(event){
					views.removeOneRow(event);
				});
			},
			//绑定同步查询
			bindSyncSearchEvent: function(element, eventName){
				$(_consts.selector.LEFTTREE).delegate(element, eventName, function(){
					views.syncSearch(setting);
				});
			}
	},
	/**
	 * 默认配置项
	 */
	setting = {
			relateParent:true,
			check: {
				enable: true,
				chkStyle: _consts.checkbox.STYLE,
				radioType: _consts.radio.TYPE_LEVEL,
				chkboxType: {"Y": "ps","N": "ps"}
			},
			async: {
				enable: true,
				url: "",
				autoParam: []
			},
			searchUrl: "",
			searchEnable: true,
			tableEnable:true,
			leftWidth:"25%",
			rightWidth:"75%",
			columns: [],
			level: null,
			height:"500px",
			theme:"zTreeStyle", //'zTreeStyle' | 'metroStyle'
			callback: {
				beforeAsync: eventHandle.nTreeBeforeAsync,
				onAsyncError: eventHandle.nTreeOnAsyncError,
				onCheck: eventHandle.nodeOnCheck,
				onAsyncSuccess: eventHandle.nTreeOnAsyncSuccess
			}
	},
	/**
	 * 异步加载配置
	 */
	_asyncSetting = {
			check: setting.check,
			async: {
				enable: true,
				url: "",
				autoParam: []
			},
			callback:{
				onAsyncError: null,
				onClick: null,
				onCheck: null
			}
	},
	/**
	 * 同步加载配置
	 */
	_syncSetting = {
			check: setting.check,
			data: {
				simpleData: {
					enable: true
				}
			},
			callback:{
				onClick: null,
				onCheck: null
			}
	},
	/**
	 * 工具类
	 */
	tools = {
		//异步参数绑定
		canAsync: function(setting) {
			if(tools.isObject(setting.async)){
				_asyncSetting.async.enable = setting.async.enable;
				_asyncSetting.async.url = setting.async.url;
				_asyncSetting.async.autoParam = setting.async.autoParam;
				_asyncSetting.callback = setting.callback;
				_asyncSetting.data = setting.data;
				return _asyncSetting;
			}
			return null;
			
		},
		//同步参数绑定
		canSync: function(setting) {
			_syncSetting.callback = {
					onClick: setting.callback.onClick,
					onCheck: setting.callback.onCheck
			}
			return _syncSetting;
		},
		//判断是否是数组
		isArray: function(arr) {
			return Object.prototype.toString.apply(arr) === "[object Array]";
		},
		//判断是否是对象
		isObject: function(obj) {
			return Object.prototype.toString.apply(obj) === "[object Object]";
		},
		//判断是否是函数
		isFunction: function(fun) {
			return Object.prototype.toString.apply(fun) === "[object Function]";
		},
		//清空指定元素内容
		clearEmptyEle: function(element) {
			$(element).empty();
		},
		//得到勾选状态被改变的节点集合
		getChangeCheckedNodes: function() {
			var selectNodes = treeObj.getChangeCheckedNodes();
			for(var i in selectNodes){
				selectNodes[i].checkedOld = selectNodes[i].checked;
			}
			return selectNodes;
		},
		//得到当前被选中的节点集合
		getCheckedNodes: function() {
			return treeObj.getCheckedNodes();
		},
		//得到当前被选中的父节点集合
		getCheckedParentNodes: function(nodes) {
			if(nodes){
				for(var i = 0; i < nodes.length; i++){
					if(!nodes[i].isParent){
						nodes.splice(i, 1);
	                 	   i--;
	                    }
				}
				return nodes;
			}
		},
		//得到当前被选中的子节点集合
		getCheckedSonNodes: function(nodes) {
			if(nodes){
				for(var i = 0; i < nodes.length; i++){
					if(nodes[i].isParent){
						nodes.splice(i, 1);
	                 	   i--;
	                    }
				}
				return nodes;
			}
		},
		//通过指定参数查询节点对象
		getNodeByParam: function(param, value) {
			return treeObj.getNodeByParam(param, value, null);
		},
		//更新一个节点
		updateNode: function(node) {
			treeObj.updateNode(node);
		},
		//得到指定层级之后的所有节点
		getAfterNodesForLevel: function(node) {
			  return (node.level > (setting.level - 1));
		},
		//得到指定层级之前的所有节点
		getBeforeNodesForLevel: function(node) {
			 return (node.level <= (setting.level - 1));
		},
		//根据节点数据的属性搜索，获取条件完全匹配的节点数据 JSON 对象集合
		getNodesByParam: function(key, value) {
			return treeObj.getNodesByParam(key, value, null);
		},
		//销毁 tree
		destroy: function() {
			treeObj.destroy();
		}
	},
	/**
	 * 视图
	 */
	views = {
		//渲染组件DIV样式
		renderNerisDiv: function(tId) {
			var obj = "#"+tId;
			var divHtml = [];
			divHtml.push("<div class='left_tree' style='width:", setting.leftWidth, "'>");
				if(setting.searchEnable){
					divHtml.push("<div class='left_top_sSearch'>");
						divHtml.push("<div class='input-group'>");
							divHtml.push("<input id='sSearchParam' type='text' placeholder='请输入关键字...' class='form-control'>");
							divHtml.push("<span class='input-group-btn'>");
								divHtml.push("<button id='zTree_search_btn' type='button' class='btn btn-primary btn-sm' >搜索</button>");
							divHtml.push("</span>");
						divHtml.push("</div>")
					divHtml.push("</div>");
					divHtml.push("<div class='left_middle_data' data-mcs-axis='yx'>");
				}else{
					//查询不可用时，设置树形高度为100%
					divHtml.push("<div class='left_middle_data' data-mcs-axis='yx' style='height:100%'>");
				}
					divHtml.push("<ul id='nTree' class='ztree'></ul>");
				divHtml.push("</div>");
			divHtml.push("</div>");
			divHtml.push("<div class='right_tree' style='width:", setting.rightWidth, "'>");
				divHtml.push("<table class='table table-hover table-striped'>");
					divHtml.push("<thead><tr></tr></thead>");
					divHtml.push("<tbody></tbody>");
				divHtml.push("</table>");
			divHtml.push("</div>");
			$(divHtml.join('')).appendTo(obj);
			$(obj).css("height",setting.height);
		},
		//绘制组件右侧表头
		drawTable: function(setting) {
			var thead = [];
			if(setting.tableEnable){
				var tbHeads = tools.isArray(setting.columns) ? setting.columns : [];
				tools.clearEmptyEle(_consts.selector.TR);
				thead.push('<th>选择</th>');
				$.each(tbHeads, function(i, data) { 
					thead.push("<th>", data.title, "</th>"); 
				});
				$(thead.join('')).appendTo($(_consts.selector.TR));
			} else {
				$(_consts.selector.RIGHTTREE).remove();
			}
		},
		//增加一行TR
		addOneRow: function(node){
			var tr = [];
			var flag;
			if(setting.tableEnable){
				tr.push("<tr><td><input id='", node.id, "' type='checkbox' class='r_tb_", node.id, "' checked = 'checked'/></td>");
					for(var i = 0; i < setting.columns.length; i++){
						var column = setting.columns[i];
						  if(typeof node[column.data] === 'undefined'){
							  tr.push("<td>", "" , "</td>");
						  }else{
							  for(var attr in node) {
									if(attr == column.data){
										if(tools.isFunction(column.render)) {
											tr.push("<td>", column.render(node[column.data], node), "</td>");
										}else {
											tr.push("<td>", node[column.data], "</td>");
										}
									}
								}
						  }
					}
				tr.push("</tr>");
				return tr.join('');
			}else{
				return tr;
			}
			
		},
		//删除一行TR
		removeOneRow: function(event) {
			var tid = $(event.currentTarget)[0].id;
			$(event.currentTarget).closest('tr').remove();
			
			var node = tools.getNodeByParam("id", tid);
			node.checked = false;
			tools.updateNode(node);
			
			if(tools.getCheckedNodes() == 0){
				views.hideTable();
			}
		},
		//显示Table
		showTable: function() {
			if(setting.tableEnable){
				$(_consts.selector.RIGHTTREE).show();
			}
		},
		//隐藏Table
		hideTable: function() {
			tools.clearEmptyEle($(_consts.selector.TBODY));
			$(_consts.selector.RIGHTTREE).hide();
		},
		//执行复选模式的相关操作
		handleCheckbox: function(setting, treeNode, nodes, changeNodes, tbodyElements) {
			var tbody = [];
			if (treeNode.isParent) {
				if(treeNode.checked){
					if(setting.check.chkboxType.Y.indexOf("s") > -1){
						tools.clearEmptyEle($(_consts.selector.TBODY));
						$.each(nodes, function(i, node) { tbody += views.addOneRow(node); });
					}else{
						tbody += views.addOneRow(treeNode);
					}
					$(_consts.selector.TBODY).append(tbody);
					
				}else{
					if(setting.check.chkboxType.N.indexOf("s") > -1){
						for(var i = 0; i < changeNodes.length; i++){
							$(_consts.selector.TBODY).find("input[id='"+changeNodes[i].id+"']").closest("tr").remove();
						}
					}else{
						$.each(tbodyElements, function(i, tr) {
							var td = $(tr).children()[0];
							if (treeNode.id == $(td).children().attr('id'))
								$(tr).remove();
						});
					}
				}
			} else {
				if (treeNode.checked) {
					if (setting.check.chkboxType.Y.indexOf("p") > -1) {
						if (tbodyElements.length <= 0) {
							$.each(nodes, function(i, node) { tbody += views.addOneRow(node); });
						} else {
							for (var i = 0; i < changeNodes.length; i++) {
								tbody += views.addOneRow(changeNodes[i]);
							}
						}
					} else {
						tbody = views.addOneRow(treeNode);
					}
					
					$(_consts.selector.TBODY).append(tbody);
					
				}else{
					$.each(tbodyElements, function(i, tr) {
						var td = $(tr).children()[0];
						if (treeNode.id == $(td).children().attr('id')) $(tr).remove();
					});
				}
			}
		},
		//执行单选模式的相关操作
		handleRadio: function(setting, treeNode, nodes, changeNodes, tbodyElements) {
			var tbody = [];
			if(treeNode.checked){
				if(treeObj.setting.check.radioType == 'level'){
					if(treeNode.isParent){
						tbody = views.addOneRow(treeNode);
					}else{
						
						if(tbodyElements.length == 0){
							tbody = views.addOneRow(treeNode);
						}
						
						for(var i = 0; i < changeNodes.length; i++){
							if(!changeNodes[i].checked)
							$(_consts.selector.TBODY).find("input[id='"+changeNodes[i].id+"']").closest("tr").remove();
						}
						tbody = views.addOneRow(treeNode);
					}
				}else if(treeObj.setting.check.radioType == 'all'){
					tools.clearEmptyEle($(_consts.selector.TBODY));
					tbody = views.addOneRow(treeNode);
				}
				$(_consts.selector.TBODY).append(tbody);
				
			}else{
				$.each(tbodyElements, function(i, tr) {
					var _td = $(tr).children()[0];
					if (treeNode.id == $(_td).children().attr('id')) $(tr).remove();
				});
			}
		},
		// 同步请求
		sync: function (setting) {
			$.ajax({
				url: setting.async.url,
				type: "POST",
				dataType: "json",
				success: function ( d ) {
					treeObj = $.fn.zTree.init($(_consts.selector.NTREE), tools.canSync(setting), d);
				}
			});
		},
		//同步查询
		syncSearch: function(setting) {
			if(!setting.searchUrl){
				console.error("请指定搜索的url路径！"); return;
			}
			
			if(!syncSearchResult){
				$.ajax({
					url: setting.searchUrl,
					type:"POST",
					dataType: "JSON",
					data: {searchParam: $(_consts.selector.SEARCH_INPUT_ID).val()},
					success: function(result) {
						views.hideTable();
						if (result) {
							treeObj = $.fn.zTree.init($(_consts.selector.NTREE), tools.canSync(setting), result);
							if(!setting.relateParent){
								var beforeNodes = treeObj.getNodesByFilter(tools.getBeforeNodesForLevel);
								for(var i in beforeNodes){
									if(beforeNodes[i].isParent){
										beforeNodes[i].nocheck = true;
										tools.updateNode(beforeNodes[i]);
									}
								}
							}
						} else {
							console.info("There is no query to the data!");
						}
						var nodes = treeObj.getNodesByFilter(tools.getAfterNodesForLevel);
						treeObj.hideNodes(nodes);
					}
				});
			}
		}
	};
	
	$.nerisTree = {
			init: function(obj, nSetting){
				$.extend(true, setting, nSetting);
				views.renderNerisDiv(obj);
				views.drawTable(setting);
				//初始化滚动插件
				try {
					//初始化滚动样式
					$(".left_middle_data").mCustomScrollbar({
						theme:'dark',
						advanced: {
							autoExpandHorizontalScroll:true
						},
						scrollbarPosition:"outside"
					});
					$(".right_tree").mCustomScrollbar({
						theme:'dark'
					});
				} catch(e) {
					console.error("滚动条插件没有加载 " + e);
				}
				
				if(setting.columns.length <= 0){
					console.error("setting.columns can't be empty"); return;
				}
				
				if ( setting.async.enable ) { // 异步
					treeObj = $.fn.zTree.init($(_consts.selector.NTREE), tools.canAsync(setting));
				} else {
					views.sync(setting);
				}
				
				eventHandle.bindRemoveOneRowEvent(_consts.selector.INPUT_CHECKBOX, _consts.event.CLICK);
				eventHandle.bindSyncSearchEvent(_consts.selector.SEARCH_BTN, _consts.event.CLICK);
				
				var nerisTree = {
						setting: setting,
						getNodeByParam: function(key, value) {
							return tools.getNodeByParam(key, value);
						},
						getCheckedNodes: function() {
							return tools.getCheckedNodes();
						},
						getCheckedParentNodes: function(checkedNodes) {
							return tools.getCheckedParentNodes(checkedNodes);
						},
						getCheckedSonNodes: function(checkedNodes) {
							return tools.getCheckedSonNodes(checkedNodes);
						},
						destroy: function() {
							tools.destroy();
						}
				}
				return nerisTree;
			}
	}
	
	// 新增方法，主要是防止和部门人员树形组件初始化方法命名冲突
	$.initBaseTree = function (obj, settings) {
		return $.nerisTree.init(obj, settings);
	}
	
})(jQuery);