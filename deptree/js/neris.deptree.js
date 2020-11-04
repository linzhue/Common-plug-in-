'use strict';
/*
 * 机构人员选择树形组件，该组件依赖zTree，目前使用的是zTree版本v3.5.18
 * zTree官网：http://zTree.me/
 * 
 * author: neris公共组件组  gongph
 * version: 1.16
 * date: 2016.12.01
 * Copyright ® 中国证监会中央监管信息平台版权所有
 */
if (typeof jQuery === 'undefined') {
    throw new Error('win.neris.deptree requires jQuery');
}

+function(factory){
	//全局jQuery对象作为一个参数传递
	factory(jQuery);
	
}(function ($) {
	var treeObj, //存放树形数据对象
		expandData = [], // 存放节点展开时加载的数据
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
			LEFTTREE: ".l-n-t",
			RIGHTTREE: ".r-n-t",
			TR: ".r-n-t table thead tr",
			TBODY: ".r-n-t table tbody",
			INPUT_CHECKBOX: "input[type='checkbox']",
			NTREE: "#nTree",
			SUBMIT_BTN: ".neris-tree-subtn",
			CLEAR_BTN: "#zTree_clear_btn",
			TREE_LOADING: ".tree_loading",
			ALL_CHECK: ".all-checked"
		},
		event: {
			CLICK:"click"
		}
	},
	/**
	 * 默认配置项
	 */
	setting = {
		check: { //选择类型
			enable: true,
			chkStyle: _consts.checkbox.STYLE,
			radioType: _consts.radio.TYPE_LEVEL,
			chkboxType: {"Y": "s","N": "s"}
		},
		level: 10,//层级
		selectType : 'dept', //机构-dept | 人员-pers
		checkType : 'multi', //多选-multi| 单选-single
		rootId : 300, //指定根节点
		handleFun:null, //数据回调处理
		isEcho: true,//是否回显
		expand: true,//是否展开
		deptColumns: [ //部门表头
		      {title: '机构代码', data: 'id'},
		      {title: '机构名称', data: 'name'},
		      {title: '上级机构', data: 'orgName'}],
		persColumns: [ //人员表头
		      {title: '姓名', data: 'subname'},
		      {title: '上级机构', data: 'deptName'},
		      {title: '所在机构', data: 'orgName'}],
		isAysnc: true,//这个参数主要用来处理查询和非查询数据展示的
		showParentNode: false, //右侧是否显示父节点，默认不显示。该属性仅对selectType = 'dept'时有效
		activeFlag: true // 显示有效/全部人员，默认显示有效人员/部门。 当activeFlag: false时显示全部（有效，无效）人员
	},
	/**
	 * 异步加载配置
	 */
	_asyncSetting = {
		check: setting.check,
		data: {
			simpleData: {
				enable: true
			}
		},
		callback:{
			onCheck: null,
			onExpand: null,
			onClick: null
		},
		view: {
			showTitle: false
		}
	},
	/**
	 * 事件处理
	 */
	eventHandle = {
		//全选
		allChecked: function() {
			$(_consts.selector.ALL_CHECK).on('click', function() {
				if (!$(this).prop('checked')) {
					//删除table所有的内容
					var trs = $(_consts.selector.TBODY).children();
					for (var i = 0; i < trs.length; i++) {
						var chk = $(trs[i]).find('input');
						views.removeOneRow(chk);
					}
					
					//设置全选按钮的勾选状态
					tools.resetAllCheckBtnState();
					
				}
			});
		},
		//左侧搜索清空
		clearEvent: function() {
			$(_consts.selector.CLEAR_BTN).on('click', function() {
				$(this).blur();
				$(this).parent().siblings().val('');
			});
		},
		//节点点击时触发
		nTreeOnClick: function(event, treeId, treeNode) {},
		//节点被勾选时触发
		nodeOnCheck: function(event, treeId, treeNode) {
			var nodes = tools.getCheckedNodes(); //获取选中的节点
			//多选
			if (setting.check.chkStyle == _consts.checkbox.STYLE) {
				//当层级不是0查询条件为空的父节点才去执行查询
				if(setting.level != 0 && treeNode.isParent && setting.isAysnc){
					if ($(document).data(treeNode.id)) {
						//之前加载过就不用加载了
						views.handleCheckbox(treeNode, $(document).data(treeNode.id));
					} else {
						//勾选当前节点，右侧表格加载其所有的子孙节点
						tools.chkLoadingData(treeNode);
					}
				} else {
					var changeNodes = [];
					if (treeNode.isParent) {
						changeNodes = treeObj.getNodesByFilter(function (node) {
							return node;
						}, false, treeNode);
						changeNodes.splice(0, 0, treeNode);
						
					} else {
						changeNodes = tools.getChangeCheckedNodes()
					}
					
					nodes = changeNodes;
					
					//如果选人，则只勾选人员  | 如果设置不显示父级节点
					if (setting.selectType == 'pers' || !setting.showParentNode) {
						nodes = tools.getCheckedSonNodes(changeNodes);
					} 
					views.handleCheckbox(treeNode, nodes);
				}
			}
			//单选
			if (setting.check.chkStyle == _consts.radio.STYLE) {
				views.handleRadio(treeNode, nodes);
			}
			
			//设置全选的勾选状态
			tools.resetAllCheckBtnState();
			
			
		},
		//节点展开时触发
		nTreeOnExpand : function(event, treeId, treeNode) {
			//如果回显数据
			if (setting.isEcho){
				//如果回显数据不为空
				if (tools.getEchoDatas()) {
					//获取回显数据中的父亲节点
					var echoPnode = tools.getEchoDatas() || [];
					for (var i = 0; i < echoPnode.length; i++) {
						//如果当前节点等于回显中的节点，设置该节点为选中状态
						if (treeNode.id == echoPnode[i].id && treeNode.parentId == echoPnode[i].pId) {
							treeNode.checked = true;
						}
						//如果当前节点的父节点等于回显中的节点，设置该节点的父节点为选中状态
						if (treeNode.getParentNode() && treeNode.getParentNode().id == echoPnode[i].id) {
							treeNode.getParentNode().checked = true;
						}
					}
				}
			}
			//节点展开时，异步加载数据
			if (setting.isAysnc) {
				var tbodyElements = $(_consts.selector.TBODY).children();
				tools.expandAsyncTree(treeNode, tbodyElements);
			}
		},
		//点击右侧复选框删除
		bindRemoveOneRowEvent: function(element) {
			$(_consts.selector.TBODY).delegate(element, _consts.event.CLICK, function(event){
				views.removeOneRow(this);
				//设置全选的勾选状态
				tools.resetAllCheckBtnState();
			});
		},
		bindRemoveAll: function (element) {
			$(element).on(_consts.event.CLICK, function () {
				//让按钮时区焦点
				this.blur();
				//先获取右侧表格数据
				var tbodys = $(_consts.selector.TBODY).children(); 
				if (tbodys.length > 0) {
					//清空表格数据
					tbodys.remove();
					//同时取消左侧树形节点的勾选状态
					tools.clearTreeNodesCheckedState();
				}
			});
		},
		//绑定提交按钮
		bindSubtnEvent: function(element) {
			$(element).on(_consts.event.CLICK, function(event){
				var callbackDatas =[], //存放回调数据
					sonNodes = tools.getCheckedSonNodes(tools.getCheckedNodes()), //获取勾选节点的孩子节点
					tbody = $(_consts.selector.TBODY).children(); //右侧表格tbody内容
				
				if(sonNodes.length > 0 || tbody.length > 0){
					if(tools.getEchoDatas()){
						callbackDatas = tools.uniqueArrays(tbody);
					}else{
						if(setting.isAysnc && tbody.length <= 0){
							callbackDatas = sonNodes;
						}else{
							callbackDatas = tools.uniqueArrays(tbody);
						}
					}
				}
				//数据回调处理，把选择的数据存放到父窗口的方法上
				tools.handleWin()[setting.handleFun].apply(tools.handleWin(), [callbackDatas]);
				//如果需要回显，把需要回显的数据保存到顶级窗口的callbackDatas数组中
				if(setting.isEcho){
					//如果数据没有保存过
					var uid = tools.createUniqueId();
					if (!top.callbackDatas[uid]) {
						top.callbackDatas[uid] = [];
					}
					top.callbackDatas[uid] = callbackDatas;
				}
				//关闭窗口
				closeWindow('wintree');
			});
		},
		//绑定同步查询
		bindSyncSearchEvent: function(element){
			$(element).on(_consts.event.CLICK, function(){
				tools.syncSearch();
			});
			
			//键盘事件
			$(window).keydown(function(event){
				if(event.keyCode == 13){//Enter
					tools.syncSearch();
				}
			});
		}
	},
	/**
	 * 工具类
	 */
	tools = {
		//清空左侧树形所有的勾选状态
		clearTreeNodesCheckedState: function() {
			//同时取消左侧树形节点的勾选状态
			var nodes = tools.getCheckedNodes();
			//循环取消节点勾选状态
			for(var i = 0; i < nodes.length; i++){
				if (nodes[i].checked) {
					nodes[i].checked = false;
					treeObj.updateNode(nodes[i]);//更新节点
				}
			}
		},
		//检查右侧表格是否有内容
		checkTableIsHasDatas: function() {
			return $(_consts.selector.TBODY).children().length > 0 ? true : false;
		},
		//重置全选按钮状态
		resetAllCheckBtnState: function() {
			if (tools.checkTableIsHasDatas()) {
				tools.setAllCheckState(false, true);
			} else {
				tools.setAllCheckState(true, false);
			}
		},
		//设置全选按钮状态。 disabled：是否禁用； checked：是否勾选
		setAllCheckState: function(disabled, checked) {
			$(_consts.selector.RIGHTTREE).find(_consts.selector.ALL_CHECK).attr('disabled', disabled).prop('checked', checked);
		},
		//根据选择类型、回调函数、根节点创建一个唯一id
		createUniqueId: function () {
			var uuid = [];
			uuid.push(setting.selectType, setting.handleFun, setting.rootId.toString().replace(/,/g, "-"));
			return uuid.join('-');
		},
		//获取要回显的数据
		getEchoDatas: function () {
			return top.callbackDatas[this.createUniqueId()];
		},
		//获取被过滤的数据
		getFilterDatas: function () {
			return (!top.winTree.settings.filterDatas) ? '' : top.winTree.settings.filterDatas.join(',');
		},
		//把右侧表格数据去重返回数组
		uniqueArrays: function(tbody){
			var arrs = [];
			for(var i = 0; i < tbody.length; i++){
				var td_id = $(tbody[i]).children()[0];
				var td_dept = $(tbody[i]).children()[3];
				var td_org = $(tbody[i]).children()[4];
			
				if(setting.selectType == 'dept'){
					var td_name = $(tbody[i]).children()[3];
					var dept_node = {
							id: $(td_id).children().attr('id'),
							pId: $(td_id).children().attr('pid'),
							parentId: $(td_id).children().attr('pid'),
					      name: $(td_name).html(),
					     orgName: $(td_org).html(),
					   uniqueCode: $(td_id).children().attr('uniquecode')
					};
					arrs[i] = dept_node;
				}else{
					var td_name = $(tbody[i]).children()[2];
					var user_node = {
							id: $(td_id).children().attr('id'),
							pId: $(td_id).children().attr('pid'),
							parentId: $(td_id).children().attr('pid'),
							name: $(td_name).html(),
					      subname: $(td_name).html(),
					      email: $(td_id).children().attr('email'),
					      telphone: $(td_id).children().attr('telphone'),
					      room: $(td_id).children().attr('room'),
					      officeTelephone: $(td_id).children().attr('officeTelephone'),
					  deptName: $(td_dept).html(),//上级部门
					  orgName: $(td_org).html(),//所在机构
					};
					arrs[i] = user_node;
				}
				
			}
			 return arrs;
		},
		//数据回显处理
		dataEchoHandle: function() {
			if (setting.isEcho) {
				//回显数据是用户自己传过来的，回显什么数据是用户指定的
				var echoDatas = top.winTree.settings.echoData || [],
					showDatas = top.winTree.settings.showDatas || [],
					tbodyElements = $(_consts.selector.TBODY).children(), //获取右侧表格tbody内容
					tbody = []; //存放新渲染的新tbody内容
				
				if(showDatas.length > 0) {
					//异步加载回显数据
					$.ajax({
						url: window.neris.basePath + 'neris/deptree/getEchoDatas',
						type: 'POST',
						dataType: 'JSON',
						data: {
							selectType: setting.selectType,
							showDatas: JSON.stringify(showDatas)
						},
						success: function (datas) {
							if (datas) {
								$.each(datas, function(i, node) { 
									tbody += views.addOneRow(node, i); 
								});
								$(_consts.selector.TBODY).append(tbody);
								
								//设置全选按钮状态
								tools.resetAllCheckBtnState();
								tools.initTreeInfo();
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							console.error(arguments);
						}
					});
				}
				
				if(showDatas.length <= 0 && echoDatas.length > 0){
					//循环生成每一行
					$.each(echoDatas, function(i, node) { 
						tbody += views.addOneRow(node, i); 
					});
					//渲染
					$(_consts.selector.TBODY).append(tbody);
					
					//设置全选按钮状态
					tools.resetAllCheckBtnState();
					//初始加载树形数据
					tools.initTreeInfo();
				}

				if (showDatas.length <= 0 && echoDatas.length <= 0) {
					tools.initTreeInfo();
				}
				
			} else {
				tools.initTreeInfo();
			}
			
		},
		//获取父级iframe
		handleWin: function() {
			var iframes = top.$("iframe");
		    var length = iframes.length;
		    for(var i=0;i<length;i++){
		        if(iframes[i].contentWindow == window){
		             //Note 不同winow对象的jq的data绑定的数据,不能互相通信 所以用top.$绑定 
		            return  top.$(iframes[i]).data('nerisparentwindow');
		        }
		    }

		},
		//异步参数绑定
		canAsync: function(setting) {
			_asyncSetting.callback = {
				onCheck: eventHandle.nodeOnCheck,
				onExpand: eventHandle.nTreeOnExpand,
				onClick: eventHandle.nTreeOnClick
			}
			return _asyncSetting;
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
		getNodeByParam: function(key, value, parentNode) {
			return treeObj.getNodeByParam(key, value, parentNode);
		},
		//得到指定层级之后的所有节点
		getAfterNodesForLevel: function(node) {
			if(setting.level == 0){
				node.isParent = false;
				node.iconSkin = 'button ico_close';
				if (setting.selectType == 'dept') {
					node.chkDisabled = false;
				} else {
					node.chkDisabled = true;
				}
				treeObj.updateNode(node);
			} else if (setting.level == node.level) {
				if (node.isParent) {
					if (setting.selectType == 'dept') {
						node.chkDisabled = false;
					} else {
						node.chkDisabled = true;
					}
					node.iconSkin = 'button ico_close';
				}
				node.isParent = false;
				treeObj.updateNode(node);
			}
			
			return node.level > setting.level;
		},
		//过滤节点数据
		filterNodes: function(node){
			if(setting.selectType == 'dept'){
				if(node.getParentNode() && !node.children){
					node.isParent = false;
					node.iconSkin = 'button ico_close';
				}
			}
			
			//多选下，解决当有一个父节点时复选框仍能点击的问题
			if(node.isParent && setting.checkType == 'multi'){
				if(node.children){
					var childs = node.children;
					var f = childs.some(function(item, index, childs){
						return item.level > setting.level;
					});
					//只有当前节点的全部子节点都是隐藏状态的时候复选框才不能勾选
					if(f){
						node.isHidden = true;
					}
				}else{
					node.chkDisabled = true;
				}
				
				treeObj.updateNode(node);
			}
			return node;
		},
		//处理数据勾选状态
		handleDataChecked: function(data) {
			var tbody = $(_consts.selector.TBODY).children();
			
			//如果层级level = 0 则清空孩子数据
			if (setting.level == 0) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].children) {
						data[i].children.length = 0;
					}
				}
			}
			
			//然后再遍历判断节点勾选状态
			for (var m = 0; m < data.length; m++) {
				//解决查询时，单选情况下，选择部门时根节点不能勾选的问题
				if (setting.checkType == 'single' && setting.selectType == 'dept' && data[0].nocheck) {
					data[0].nocheck = false;
				}
				//解决查询时，单选情况下，选择人员时根节点还能勾选的问题
				if (setting.checkType == 'single' && setting.selectType == 'pers') {
					data[0].nocheck = true;
				}
				
				
				for (var n = 0; n < tbody.length; n++) {
					var checkboxObj = $(tbody[n]).find(_consts.selector.INPUT_CHECKBOX),
						id = $(checkboxObj).attr("id"),
						pid = $(checkboxObj).attr("pid");
					
					//循环判断勾选当前节点
					if (data[m].id == id && data[m].parentId == pid) {
						data[m].checked = true;
					}
					
					//循环再判断勾选孩子节点
					if (data[m].children && data[m].children.length > 0) {
						for (var o = 0; o < data[m].children.length; o++) {
							if (data[m].children[o].id == id && data[m].children[o].parentId == pid) {
								data[m].children[o].checked = true;
							}
						}
					}
				}
			}
			return data;
		},
		//勾选时异步加载当前节点下所有的子孙节点
		chkLoadingData: function (treeNode) {
			$.ajax({
				url: window.neris.basePath + 'neris/deptree/getAllChildrenNode',
				type: 'POST',
				dataType: 'json',
				data: {
					nodeId: treeNode.id,
					selectType: setting.selectType,
					filterDatas: tools.getFilterDatas(),
					level: setting.level,
					showParentNode: setting.showParentNode,
					activeFlag: setting.activeFlag
				},
				beforeSend: function(XMLHttpRequest) {
					//加载成功之前，等待提示而且提交按钮为禁用状态
					$(_consts.selector.TREE_LOADING).show();
					$(_consts.selector.SUBMIT_BTN).attr('disabled', true);
				},
				success: function (datas) {
					$(_consts.selector.TREE_LOADING).hide();
					$(_consts.selector.SUBMIT_BTN).attr('disabled', false);
					if (datas) {
						if (setting.selectType == 'dept') {
							//是否显示父节点
							if (setting.showParentNode) {
								datas.splice(0, 0, treeNode);
							}
						}
						$(document).data(treeNode.id, datas);
						views.handleCheckbox(treeNode, datas);
						
						//设置全选的勾选状态
						tools.resetAllCheckBtnState();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$(_consts.selector.TREE_LOADING).hide();
					$(_consts.selector.SUBMIT_BTN).attr('disabled', false);
					console.error(arguments);
				}
			});
		},
		//初始化树形数据
		initTreeInfo: function () {
			 $.ajax({
				url : window.neris.basePath + 'neris/deptree/list',
				type: 'POST',
				dataType : 'json',
				data:{ 
					id: setting.rootId, 
					selectType: setting.selectType,
					checkType: setting.checkType,
					filterDatas: tools.getFilterDatas(),
					activeFlag: setting.activeFlag
				},
				beforeSend: function(XMLHttpRequest) {
					//设置取消按钮不可点击
					$(_consts.selector.SUBMIT_BTN).attr('disabled',true);
				},
				success : function(result) {
					$(_consts.selector.TREE_LOADING).hide();
					if(result.length > 0){
						//设置取消按钮可点击
						$(_consts.selector.SUBMIT_BTN).attr('disabled',false);
						//初始化数据
						treeObj = $.fn.zTree.init($(_consts.selector.NTREE), 
								tools.canAsync(setting), tools.handleDataChecked(result));
						
						//找到所有的根节点
						var objs = treeObj.getNodesByFilter(function(node){
							return node.level == 0;
						});
						//设置所有的根节点为展开状态
						if(objs && objs.length > 0){
							for(var m = 0; m < objs.length; m++){
								treeObj.expandNode(objs[m], setting.expand, false, true);
							}
						}
						//显示层级
						var hideNodes = treeObj.getNodesByFilter(tools.getAfterNodesForLevel);
						treeObj.hideNodes(hideNodes);
					} else {
						tools.noDataMsg();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					tools.noDataMsg('数据加载错误：'+ XMLHttpRequest.status);
					console.error(arguments);
				}
			});
		},
		//展开节点异步加载树形数据
		expandAsyncTree: function(treeNode, tbodyElements){
			$.ajax({
				url : window.neris.basePath + 'neris/deptree/async',
				type: 'POST',
				dataType: 'json',
				data: { 
					id: treeNode.id, 
					pid: treeNode.getParentNode() ? treeNode.getParentNode().id : treeNode.id,
					selectType: setting.selectType,
					checkType: setting.checkType,
					filterDatas: tools.getFilterDatas(),
					activeFlag: setting.activeFlag
				},
				success: function(result) {
					var flagA = setting.level == 0 ? true : false;
					var flagB = setting.level > treeNode.level ? true : false;
					if(flagA || flagB){
						expandData = result;
						var echoDatas = tools.getEchoDatas();
						//判断右侧表格是否有被勾选的节点数据，有的话则节点设置为勾选状态
						if(expandData.length > 0){
							$.each(tbodyElements, function(index, tr) {
								var td = $(tr).children()[0];
								for(var i in expandData){
									if (expandData[i].id == $(td).children().attr('id') && 
											expandData[i].parentId == $(td).children().attr('pid')){
										expandData[i].checked = true;
									}
									
								}
							});
						}
						//添加子节点
						if(treeNode.isParent && treeNode.getParentNode() != null){
							treeNode.children = expandData;
							treeObj.refresh();
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.error(arguments);
				}
			});
		},
		//同步查询
		syncSearch: function() {
			var _keywords = $(_consts.selector.SEARCH_INPUT_ID).val();
			if(!_keywords){
				setting.isAysnc = true;
			}else{
				setting.isAysnc = false;
			}
			
			$.ajax({
				url:  window.neris.basePath + 'neris/deptree/query',
				type: 'POST',
				dataType: "json",
				data: {
					rootId: setting.rootId,
					searchParam: _keywords,
					selectType: setting.selectType,
					checkType: setting.checkType,
					filterDatas: tools.getFilterDatas(),
					activeFlag: setting.activeFlag
				},
				beforeSend: function(XMLHttpRequest) {
					//设置搜索按钮不可用
					$(_consts.selector.SEARCH_BTN).attr('disabled',true);
					//查询时增加一个loading
					$('#nTree').html('<p class="tree-loading"></p>');
				},
				success: function(result) {
					//设置搜索按钮可用
					$(_consts.selector.SEARCH_BTN).attr('disabled',false);
					//查询完后让查询按钮失去焦点
					$(_consts.selector.SEARCH_BTN).blur();
					if (result[0]) {
						// 加载数据
						treeObj = $.fn.zTree.init($(_consts.selector.NTREE), 
								tools.canAsync(setting), tools.handleDataChecked(result));
						
						/*---------对查询后的数据进行显示控制----------*/
						if(!setting.isAysnc){
							treeObj.getNodesByFilter(tools.filterNodes);
							if(hideNodes){
								for(var i = 0; i < hideNodes.length; i++){
									treeObj.hideNode(hideNodes[i].getParentNode());
								}
							}
							treeObj.expandAll(setting.expand);
							
						}else{
							//查询条件为空时显示全部但只展开根节点
							var objs = treeObj.getNodesByFilter(function(node){
								return node.level == 0;
							});
							
							if(objs){
								for(var m = 0; m < objs.length; m++){
									treeObj.expandNode(objs[m], setting.expand, false, true);
								}
							}
						}
						//获取要隐藏的节点集合
						var hideNodes = treeObj.getNodesByFilter(tools.getAfterNodesForLevel);
						//隐藏节点
						treeObj.hideNodes(hideNodes);
						
						// 修改当 activeFlag = true时，查找无效人员，部门显示人员不显示。
						// 现在当部门下没有叶子节点，同时把部门隐藏，不让用户看到。
						if (setting.rootId) {
							var strArray = setting.rootId.split(',');
							for (var i = 0; i < strArray.length; i++) {
								var rootNode = treeObj.getNodesByParam("id", strArray[i].trim(), null);
								var underChildNodes = treeObj.getNodesByParam("isParent", false, rootNode[0]);
								if (underChildNodes.length <= 0) {
									treeObj.hideNode(rootNode[0]);
								}
							}
						}
						
						// 1.16版新增：当查询结果为空提示： '没有符合条件的数据！'
						var nds = treeObj.getNodes();
						var isHideFlag = nds.some(function(item, index, arrs){
							return item.isHidden == false;
						});
						
						if (nds.length <= 0 || !isHideFlag) {
							tools.noDataMsg();
						}
						
					} else {
						tools.noDataMsg();
						console.info("no data!");
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					tools.noDataMsg('查询数据错误：'+ XMLHttpRequest.status);
					console.error(arguments);
				}
			});
		},
		noDataMsg: function (message) {
			var msg = message || '没有符合条件的数据！';
			$(_consts.selector.NTREE).html('<p style="color:red">'+ msg +'</p>');
		},
		//设置勾选类型
		setCheckType: function() {
			//如果是单选，则设置单选的为radio和all
			if(setting.checkType === 'single'){
				$.extend(true, setting.check, {
					chkStyle: _consts.radio.STYLE,
					radioType: _consts.radio.TYPE_ALL
				});
			}
		},
		filterNoChildNodes: function (node) {
			return !node.children;
		}
	},
	/**
	 * 视图
	 */
	views = {
		//渲染组件DIV样式
		renderNerisDiv: function() {
			var table = [];
			table.push("<table class='table table-condensed table-striped table-hover' style='table-layout: fixed;'>");
				table.push("<thead><tr></tr></thead>");
				table.push("<tbody></tbody>");
			table.push("</table>");
			$(_consts.selector.RIGHTTREE).html(table.join(" "));
			//绘制表头
			views.drawTable(setting);
		},
		//绘制组件右侧表头
		drawTable: function(setting) {
			var thead = [], theads;
			//根据选择模式的不同加载不同的表头
			if (setting.selectType === 'dept') {
				theads = setting.deptColumns;
			} else {
				theads = setting.persColumns;
			}
			thead.push("<th width='10%'><input type='checkbox' class='all-checked' disabled/></th>");
			thead.push("<th width='10%'>序号</th>");
			$.each(theads, function(i, data) {
				thead.push("<th>", data.title, "</th>");
			});

			$(_consts.selector.TR).html(thead.join(''));
		},
		// 增加一行
		addOneRow: function(node, index){
			var tr = [],//存放渲染的tr
				columns,//存放表头数据
				tbodys, //存放tbodys数据
				chk, //表格每行的checkbox
				maxLineNumber;//最大行数，用来生成序号
			
			//根据选择模式不同获取不同的表头
			if (setting.selectType === 'dept') {
				columns = setting.deptColumns;
			} else {
				columns = setting.persColumns;
			}
			
			//获取右侧表格tbody内容
			tbodys = $(_consts.selector.TBODY).children();
			//找到右侧表格当前最大序号
			maxLineNumber = !index ? tbodys.length : index;
			//生成checkbox
			chk = "<input type='checkbox' checked='checked' id='" + node.id +
				  "' pid='" + node.parentId +
				  "' class='r_tb_" + node.id +
				  "' uniquecode='" + node.uniqueCode +
				  "' email='" + node.email +
				  "' telphone='" + node.telphone + 
				  "' room='" + node.room +
				  "' officeTelephone='" + node.officeTelephone + "'/>";
			
			
			tr.push("<tr><td>", chk , "</td>");
			tr.push("<td>", (maxLineNumber + 1) , "</td>");
			
			//循环添加数据
			for(var i = 0; i < columns.length; i++){
				var column = columns[i];
				  if(typeof node[column.data] === 'undefined'){
					  tr.push("<td>", "" , "</td>");
				  }else{
					  for(var attr in node) {
							if(attr == column.data){
								// 解决 name 树形 js注入问题
								if (column.data === 'subname' && (column.data.indexOf('<') || column.data.indexOf('>'))) {
									node[column.data] = node[column.data].replace(new RegExp("<","g"),"&lt;").replace(new RegExp(">","g"),"&gt;");
								}
								tr.push("<td title='"+node[column.data]+"' style='white-space: nowrap;overflow: hidden; text-overflow: ellipsis;'>", node[column.data], "</td>");
							}
						}
				  }
			}
			
			tr.push("</tr>");
			return tr.join('');
		},
		//删除一行
		removeOneRow: function(obj) {
			var tid = $(obj).prop('id'), //当前checkbox中的id
				tpid = $(obj).attr('pid'); //当前checkbox中的pid
			
			//删除当前行
			$(obj).closest('tr').remove();
			
			var pnode = tools.getNodeByParam("id", tpid, null), //找到当前节点的父节点
				node = tools.getNodeByParam("id", tid, pnode); //在当前父节点下查找子节点
			
			//如果存在节点
			if(node){
				//取消左侧对应的节点的勾选状态
				node.checked = false;
				//更新该节点
				treeObj.updateNode(node);
			}
			//重新排序右侧表格
			views.orderLineNumber($(_consts.selector.TBODY).children());
			//检查表格是否还有数据，没有数据的话取消左侧所有节点的勾选状态
			if (!tools.checkTableIsHasDatas()) {
				tools.clearTreeNodesCheckedState();
			}
		},
		//右侧表格重新排列序号
		orderLineNumber: function(trs){
			if(trs.length > 0){
				$.each(trs, function(i, tr) {
					var td = $(tr).children()[1];
					$(td).text(i + 1);
				});
			}
		},
		//执行复选模式的相关操作
		handleCheckbox: function(treeNode, nodes) {
			var tbodyElements = $(_consts.selector.TBODY).children(),
				index = (tbodyElements.length <= 0) ? 0 : tbodyElements.length, //找到当前最大序号值
				tbody = []; //保存生成的tobdy内容
			//如果点击的是父节点
			if (treeNode.isParent) {
				//如果父节点被勾选
				if(treeNode.checked){
					//如果勾选父节点时关联子节点
					if(setting.check.chkboxType.Y.indexOf("s") > -1){
						if(tbodyElements.length <= 0){ //如果右侧表格没内容，则直接添加
							$.each(nodes, function(i, node) { 
								tbody += views.addOneRow(node,index + i); 
							});
						}else{ //否则
							//先删除右侧表格已存在的节点
							for(var i = 0; i < tbodyElements.length; i++){
								var td = $(tbodyElements[i]).children()[0];
								for(var j = 0; j < nodes.length; j++){
									if(nodes[j].id == $(td).children().attr('id') && 
											nodes[j].parentId == $(td).children().attr('pid')){
										$(tbodyElements[i]).remove();
									}
								}
							}
							//重新添加新的节点
							$.each(nodes, function(i, node) { 
								tbody += views.addOneRow(node,index + i); 
							});
						}
						
					//如果勾选父节点不关联子节点
					}else{ 
						//直接添加当前节点
						tbody += views.addOneRow(treeNode);
					}
					
					//渲染tbody
					$(_consts.selector.TBODY).append(tbody);
				
				}else{ //如果父节点取消勾选
					//如果父节点取消勾选时关联子节点
					if(setting.check.chkboxType.N.indexOf("s") > -1){
						//循环删除右侧表格中对应的子节点和当前节点
						for(var i = 0; i < nodes.length; i++){
							$(_consts.selector.TBODY).find("input[id='"+nodes[i].id+"'][pid='"+nodes[i].parentId+"']").closest("tr").remove();
						}
						
					}else{ //如果父节点取消勾选不关联子节点
						//则循环删除右侧表格对应的所有孩子节点
						$.each(tbodyElements, function(i, tr) {
							var td = $(tr).children()[0];
							if (treeNode.id == $(td).children().attr('id'))
								$(tr).remove();
						});
					}
				}
				//不管是勾选还是取消勾选，都要重新排列右侧表格
				views.orderLineNumber($(_consts.selector.TBODY).children());
			} else { //如果点击的是叶子节点
				//如果叶子节点被勾选
				if (treeNode.checked) {
					var flag = false; //标记当前节点是否已经被勾选过了。
					//循环到右侧表格查找该节点是否已被勾选
					for(var i = 0; i < tbodyElements.length; i++){
						var td = $(tbodyElements[i]).children()[0];
						if (treeNode.id == $(td).children().attr('id') && 
								treeNode.parentId == $(td).children().attr('pid')){
							flag = true;
						}
					}
					
					//如果 flag = false，说明该节点没有被勾选过,可以添加。
					if(!flag){
						tbody = views.addOneRow(treeNode);
						$(_consts.selector.TBODY).append(tbody);
					}
					
				}else{ //如果叶子节点取消勾选
					//循环删除右侧表格对应的节点
					$.each(tbodyElements, function(i, tr) {
						var td = $(tr).children()[0];
						if (treeNode.id == $(td).children().attr('id') &&
								treeNode.parentId == $(td).children().attr('pid')) {
							$(tr).remove();
						}
						
					});
					//右侧表格重新排列序号
					views.orderLineNumber($(_consts.selector.TBODY).children());
				}
			}
		},
		//执行单选模式的相关操作，单选模式只能添加一行数据
		handleRadio: function(treeNode, nodes) {
			var tbody = [],
				tbodyElements = $(_consts.selector.TBODY).children();
			//如果节点被勾选
			if(treeNode.checked){
				//如果是level范围
				if(treeObj.setting.check.radioType == 'level'){
					if(treeNode.isParent){//如果是父节点
						//tbody = views.addOneRow(treeNode);
					}else{//如果是孩子节点
						//右侧表格如果一行都没有，则直接添加
						if(tbodyElements.length == 0){
							tbody = views.addOneRow(treeNode);
						}
						//否则先删除右侧表格重复项，再添加一行
						for(var i = 0; i < nodes.length; i++){
							if(!nodes[i].checked)
							$(_consts.selector.TBODY).find("input[id='"+nodes[i].id+"']").closest("tr").remove();
						}
						//添加
						tbody = views.addOneRow(treeNode);
					}
				//如果是all范围
				}else if(treeObj.setting.check.radioType == 'all'){
					//直接清空右侧表格，然后添加一行
					$(_consts.selector.TBODY).empty();
					tbody = views.addOneRow(treeNode);
				}
				
				//渲染表格
				$(_consts.selector.TBODY).append(tbody);
				
			}else{
				$.each(tbodyElements, function(i, tr) {
					var _td = $(tr).children()[0];
					if (treeNode.id == $(_td).children().attr('id')) $(tr).remove();
				});
				
				//右侧表格重新排列序号
				views.orderLineNumber($(_consts.selector.TBODY).children());
			}
		}
	
	};
	//组件入口
	$.nerisTree = {
		//初始化树形组件
		init: function(nSetting) {
			$.extend(true, setting, nSetting);
			//渲染组件
			views.renderNerisDiv();
			//绑定事件
			eventHandle.bindRemoveOneRowEvent(_consts.selector.INPUT_CHECKBOX); //删除一行
			eventHandle.clearEvent(); //左侧清空
			eventHandle.allChecked();//全选
			eventHandle.bindSubtnEvent(_consts.selector.SUBMIT_BTN); //提交
			eventHandle.bindSyncSearchEvent(_consts.selector.SEARCH_BTN); //同步查询
			//设置选择模式样式
			tools.setCheckType();
			//数据回显处理
			tools.dataEchoHandle();
		},
		//初始化参数配置，加载组件窗口界面
		initWindowTree: function(oSettings){
			//把配置存放在顶级窗口自定义参数对象中
			top.callbackDatas = top.callbackDatas || {};
			top.winTree = {
				title: oSettings.title, //标题
				settings: oSettings //参数配置
			}
			addCenterWindow(window.neris.basePath + "neris/deptree/wintree", "wintree", 600, 900);
		}
	}
});