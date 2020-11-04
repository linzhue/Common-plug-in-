/*!
 * neris.search.js依赖vue.js, 当前使用的vue版本是v1.0.24
 * 
 * Version: 1.8.0
 * Date: 2016/05/19
 * Author: neris gongph
 * Copyright ®2016 中国证监会中央监管信息平台版权所有
 */

if (typeof jQuery === 'undefined') {
  throw new Error('nerisSearch\'s JavaScript requires jQuery')
}

+function ($) {
	'use strict';
	
	/**
	 * 常量
	 */
	var consts = {
		DIV_EXPAND: '.neris-search-expand',
		TABLE: 'table',
		options: {
			EQ: 'eq', //相等
			NE: 'ne', //不相等
			GT: 'gt', //大于
			LT: 'lt', //小于
			FIRST: 'first', //第一个
			LAST: 'last' //最后一个
		},
		classes: {
			SEARCH_ARROW_T: 'search_arrow_t',
			SEARCH_ARROW_D: 'search_arrow_d'
		}
	},
	datas = {
		cacheHideRows: [] //缓存隐藏的行
	},
	/**
	 * 工具类
	 */
	tools = {
		//找到某元素下面第一个指定标签
		getFirstElement: function(element, tag) {
			if (!Element || !tag) return $(consts.ROOTID).find(consts.TABLE)[0];
			return $('#' + element).find(tag)[0];
		},
		//获取table中所有行
		getTableAllRows: function(table, selector) {
			if (!table) return;
			return $(table).find(" > tbody > " + selector);
		},
		//通过索引和操作类型查找行。 
		findRowsByIndexAndOption: function(rows, index, options) {
			var len = rows.length;
			switch (options) {
			case consts.options.EQ:
				return $(rows).eq(index - 1);
				
			case consts.options.GT:
				return $(rows).slice(index, len);
				
			case consts.options.LT:
				return $(rows).slice(0, (index - 1));
				
			case consts.options.FIRST:
				return $(rows).first();
				
			case consts.options.LAST:
				return $(rows).last();
				
			default:
				break;
			}
		},
		//插入展开折叠元素
		insertExpandElement: function(element, scope) {
			var expandDiv = $('#'+scope).find(consts.DIV_EXPAND);
			if ($(expandDiv).length <= 0) {
				$(views.drawExpandElement(scope)).insertAfter(element);
			}
		},
		//设置隐藏行禁用状态
		setHideRowsDisabled: function(rows, state) {
			$(rows).find('input, select, textarea').prop('disabled', state);
		}
	},
	/**
	 * 视图类
	 */
	views = {
		//绘制页面展开折叠元素
		drawExpandElement: function(scope) {
			var arrs = [];
			arrs.push("<div class='search_mark neris-search-expand' @click=\"handleExpand('"+scope+"', $event)\"></div>");
			return arrs.join(' ');
		}
	};
	/**
	 * 对外提供的接口
	 */
	$.nerisSearch = {
		serialize: function(form) {
			return form.serialize();
		}
	};
	
	$(function () {
		var arrs = $("div[data-ns-scope]");
		//一个页面可能同时共用多个组件，这里实例化多个Vue实例对象
		for (var i = 0, len = arrs.length; i < len; i++) {
			(function(num) {
				var _ns_scope = $(arrs[num]).attr('data-ns-scope'),
				_root_id = '#' + _ns_scope;
			
				$(arrs[num]).prop('id', _ns_scope);
				
				new Vue({
					el: '#' + _ns_scope,
					data: datas,
					props: ['dataExpand', 'dataHideFrom'],
					init: function() {
						this.dataExpand = false;
						this.dataHideFrom = 4;
					},
					created: function() {
						this.handleProps();
						this.initExpandStyle();
					},
					methods: {
						//初始化展开折叠元素样式
						initExpandStyle: function() {
							//找到第一个table
							var firstTable = tools.getFirstElement(_ns_scope, consts.TABLE);
							
							//得到第一个table下所有行
							var rows = tools.getTableAllRows(firstTable, "tr[data-ignore != 'true']");
							if (rows.length > this.dataHideFrom) {
								//在第一个table下面插入一个元素
								tools.insertExpandElement(firstTable, _ns_scope);
								
								if (this.dataExpand) {
									$(_root_id).find(consts.DIV_EXPAND).addClass(consts.classes.SEARCH_ARROW_D);
								} else {
									$(_root_id).find(consts.DIV_EXPAND).addClass(consts.classes.SEARCH_ARROW_T);
								}
								
								//获取要隐藏的行数
								var hideRows = tools.findRowsByIndexAndOption(rows, this.dataHideFrom, consts.options.GT);
								console.log(hideRows);
								//把需要隐藏的行数保存到缓存中
								if (!datas.cacheHideRows[_ns_scope]) {
									datas.cacheHideRows[_ns_scope] = [];
								}
								
								datas.cacheHideRows[_ns_scope] = hideRows;
								
								//如果用户配置的是隐藏
								if (!this.dataExpand) {
									datas.cacheHideRows[_ns_scope].hide();
									tools.setHideRowsDisabled(hideRows, true);
								}
								
							}
						},
						//处理props参数
						handleProps: function() {
							//把dataExpand值转换成Boolean类型
							if (this.dataExpand === 'false') {
								this.dataExpand = false;
							} else {
								this.dataExpand = !!this.dataExpand;
							}
							
							//把dataHideFrom值转换成Number类型
							if (!this.dataHideFrom || isNaN(this.dataHideFrom)) {
								this.dataHideFrom = 4;
								
							} else {
								
								if (this.dataHideFrom == '0') {
									this.dataHideFrom = 4;
								}
								
								this.dataHideFrom = parseInt(this.dataHideFrom, 10);
							}
						},
						//处理展开折叠
						handleExpand: function(rootId, event) {
							var expandElement = event.target,
								arrow_t = consts.classes.SEARCH_ARROW_T,
								arrow_d = consts.classes.SEARCH_ARROW_D,
								hideRows = datas.cacheHideRows[_ns_scope];
							
							//展开
							if ($(expandElement).hasClass(arrow_t)) {
								hideRows.show();
								tools.setHideRowsDisabled(hideRows, false);
							} 
							//隐藏
							else { 
								hideRows.hide();
								tools.setHideRowsDisabled(hideRows, true);
								
								//把设有'data-ignore'属性的tr也隐藏了
								var firstTable = tools.getFirstElement(rootId, consts.TABLE);
								tools.getTableAllRows(firstTable, "tr[data-ignore = 'true']").hide();
								
							}
							
							//设置对应的展开隐藏图标
							$(expandElement).toggleClass(arrow_t).toggleClass(arrow_d);
						}
					}
				});
			})(i);
		}
	});
}(jQuery);