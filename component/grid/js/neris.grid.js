!function($) {
	var Grid = function(element, option) {
		var table='';
		var _settings;
		var defaultOption = {
			url : null,
			method : "post",
			pageSize : 15,
			currentPage : 1,
			success : null,
			// error : null,
			columnModel : null,
			showCheck : false,
			showIndex : true,
			showPagination : true,
			loadData : true,
			groupThead : false,//表头格式，是否是组合表头，默认是false当行表头,
			groupModel : null
		};

		var getOption = function(element, option) {
			if (!option) {
				option = {
					url : element.data("url"),
					method : element.data("method"),
					success : ((element.data("success")) ? (eval("("
							+ element.data("success") + ")")) : (null)),
					showCheck : element.data("show-check"),
					showIndex : element.data("show-index"),
					pageSize : element.data("page-size"),
					param : ((element.data("param")) ? (eval("("
							+ element.data("param") + ")")) : (null))
				};
				var cm = [];
				$.each(element.find("colgroup col"), function(i, col) {
					cm.push({
						field : $(col).data("field"),
						title : $(col).data("title"),
						width : $(col).data("width"),
						titleAlign : $(col).data("title-align"),
						align : $(col).data("align"),
						formatter : (($(col).data("formatter")) ? (eval("("
								+ $(col).data("formatter") + ")")) : (null))
					});
				});
				option.columnModel = cm;
				element.find("colgroup").remove();
				return option;
			} else {
				if(option["pageSize"] <= 0){//验证pageSize合法性
					option["pageSize"] = undefined;
				}
				return option;
			}
		};

		this.settings = $.extend(defaultOption, getOption(element, option));
		_settings = this.settings;
		/*
		 * 
		 * 分页渲染
		 * 
		 */
		var getRemotePagingData = function(requestUrl, method, param, pageSize,
				pageIndex) {
			return JSON.parse($.ajax({
				async : false,
				url : requestUrl,
				type : method,
				data : $.extend(param, {
					pageSize : pageSize,
					pageNo : pageIndex
				}),
				dataType : "json",
				beforeSend:function (XMLHttpRequest) {
					if(true === _settings.loadData){
						
						$(element).children("tbody").css({
									"opacity":0.8,
									"filter":"alpha(opacity=80)"
						});
					}
					
				},
				success:function() {
					/*if(true === option.loadData){
						$(element).children("tbody").removeAttr("style");
					}*/
				},
				error : function(xhq, errMsg, e) {
					console.error(errMsg);
					console.error(JSON.stringify(e));
					console.error("加载远程数据发生错误！");
				}
			}).responseText);
			
		};

		var getNoResult = function() {
			var nav = $("<nav><ul class=\"pagination\"><li class=\"disabled\"><a href=\"javascript:void(0)\">上一页</a></li><li class=\"disabled\"><a href=\"javascript:void(0)\">下一页</a></li></ul><div class=\"jump\"><span class=\"jump_text\" style=\"cursor: not-allowed;\"><button type=\"button\" class=\"btn btn-primary btn-xs\" disabled>GO</button></span><span class=\"jump_text\">页</span><span class=\"jump_text\"><input type=\"text\" class=\"form-control2 \" id=\"input4\"></span><span class=\"jump_text\">跳到</span><span class=\"jump_text\">共有0页，0条记录。</span></div></nav>");
			return /* $("<span class=\"no-result\">未查询到匹配条件的记录！</span>") */nav;
		};

		var getPageIndex = function(target) {
			return parseInt($(target).data("page-index"));
		};

		var getPagination = function(currentPage, pageCount, total) {
			var pagination = $("<nav></nav>");
			pagination.append("<ul class=\"pagination\"></ul>");

			if (1 == pageCount) {
				pagination
						.children()
						.first()
						.append("<li class=\"disabled\"><a>上一页</a></li>")
						.append(
								"<li class=\"active\"><a href=\"javascript:void(0)\" data-page-index=\"1\">1</a></li>")
						.append("<li class=\"disabled\"><a>下一页</a></li>");
			} else if (7 >= pageCount) {
				if (1 == currentPage) {
					pagination.children().first().append(
							"<li class=\"disabled\"><a>上一页</a></li>");
					for (var i = 1; i <= pageCount; i++) {
						if (currentPage == i) {
							pagination.children().first().append(
									"<li class=\"active\"><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						} else {
							pagination.children().first().append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						}
					}
					pagination.children().first().append(
							"<li><a href=\"javascript:void(0)\" data-page-index=\""
									+ (currentPage + 1) + "\">下一页</a></li>");
				} else if (pageCount == currentPage) {
					pagination.children().first().append(
							"<li><a href=\"javascript:void(0)\" data-page-index=\""
									+ (currentPage - 1) + "\">上一页</a></li>");
					for (var i = 1; i <= pageCount; i++) {
						if (currentPage == i) {
							pagination.children().first().append(
									"<li class=\"active\"><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						} else {
							pagination.children().first().append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						}
					}
					pagination.children().first().append(
							"<li class=\"disabled\"><a>下一页</a></li>");
				} else {
					pagination.children().first().append(
							"<li><a href=\"javascript:void(0)\" data-page-index=\""
									+ (currentPage - 1) + "\">上一页</a></li>");
					for (var i = 1; i <= pageCount; i++) {
						if (currentPage == i) {
							pagination.children().first().append(
									"<li class=\"active\"><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						} else {
							pagination.children().first().append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						}
					}
					pagination.children().first().append(
							"<li><a href=\"javascript:void(0)\" data-page-index=\""
									+ (currentPage + 1) + "\">下一页</a></li>");
				}
			} else {
				if (1 == currentPage || 2 == currentPage || 3 == currentPage) {
					pagination
							.children()
							.first()
							.append(
									(1 == currentPage) ? ("<li class=\"disabled\"><a>上一页</a></li>")
											: ("<li><a href=\"javascript:void(0)\" data-page-index=\""
													+ (currentPage - 1) + "\">上一页</a></li>"));
					for (var i = 1; i <= 5; i++) {
						if (currentPage == i) {
							pagination.children().first().append(
									"<li class=\"active\"><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						} else {
							pagination.children().first().append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						}
					}
					pagination.children().first().append("<li><a>...</a></li>")
							.append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ pageCount + "\">" + pageCount
											+ "</a></li>");
					pagination.children().first().append(
							"<li><a href=\"javascript:void(0)\" data-page-index=\""
									+ (currentPage + 1) + "\">下一页</a></li>");
				} else if (pageCount == currentPage
						|| (pageCount - 1) == currentPage
						|| (pageCount - 2) == currentPage) {
					pagination
							.children()
							.first()
							.append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ (currentPage - 1)
											+ "\">上一页</a></li>")
							.append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\"1\">1</a></li>")
							.append("<li><a>...</a></li>");
					for (var i = pageCount - 4; i <= pageCount; i++) {
						if (currentPage == i) {
							pagination.children().first().append(
									"<li class=\"active\"><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						} else {
							pagination.children().first().append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						}
					}
					pagination
							.children()
							.first()
							.append(
									(pageCount == currentPage) ? ("<li class=\"disabled\"><a>下一页</a></li>")
											: ("<li><a href=\"javascript:void(0)\" data-page-index=\""
													+ (currentPage + 1) + "\">下一页</a></li>"));
				} else {
					pagination
							.children()
							.first()
							.append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ (currentPage - 1)
											+ "\">上一页</a></li>")
							.append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\"1\">1</a></li>")
							.append("<li><a>...</a></li>");
					for (var i = currentPage - 1; i <= currentPage + 1; i++) {
						if (currentPage == i) {
							pagination.children().first().append(
									"<li class=\"active\"><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						} else {
							pagination.children().first().append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ i + "\">" + i + "</a></li>");
						}
					}

					pagination.children().first().append("<li><a>...</a></li>")
							.append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ pageCount + "\">" + pageCount
											+ "</a></li>").append(
									"<li><a href=\"javascript:void(0)\" data-page-index=\""
											+ (currentPage + 1)
											+ "\">下一页</a></li>");
				}
			}

			/*id=\"input4\" value=\""+currentPage+"\"></span>*/	
	pagination.append("<div class=\"jump\"><span class=\"jump_text\"><button id=\"jump_button\" type=\"button\" class=\"btn btn-primary btn-xs\">GO</button></span><span class=\"jump_text\">页</span><span class=\"jump_text\"><input type=\"text\" class=\"form-control2 \" id=\"input4\" ></span><span class=\"jump_text\">跳到</span><span class=\"jump_text\">共有"
						+ pageCount + "页，" + total + "条记录。</span></div>");

			return pagination;
		};

		var handleCheckedRowDatas = function(checkbox,option) {
			if (checkbox.is(":checked")) {
				
				checkbox.parent().parent().parent().parent().data(
						"checkedRowDatas").push(checkbox.data("rowData"));
				/*修复部分选中后再全选，全选不勾选问题*/
				
				if(table.find(".selectSingle:not(:disabled):checked").length==table.find(".selectSingle:not(:disabled)").length){
					table.find($("[id=allCheck]:checkbox")).prop("checked", true);
				}else{
					table.find($("[id=allCheck]:checkbox")).prop("checked", false);
				}
			} else {
				var checkedRowDatas = checkbox.parent().parent().parent()
						.parent().data("checkedRowDatas");
				checkbox.parent().parent().parent().parent().data(
						"checkedRowDatas",
						$.grep(checkedRowDatas, function(rowData, i) {
							return !objectEquals(rowData, checkbox.data("rowData"));
						}));
				/*修复取消选择后全选不取消问题*/
				table.find($("[id=allCheck]:checkbox")).attr("checked", false);
			}
		};

		var objectEquals = function(o1, o2) {
			var b = true;
			$.each(o1, function(k, v) {
				if (v != o2[k]) {
					b = false;
					return;
				}
			});
			return b;
		};
		
		var refreshTbody = function(tbody, pageList, option, pageSize,
				pageIndex) {
			tbody.empty("");
			tbody.siblings("thead").find("tr th input[type=checkbox]").prop(
					"checked", false);

			if (0 < pageList.length){
				$.each(pageList, function(i, rowData) {
					var row = $("<tr></tr>");
					tbody.append(row);
					if (option.showCheck) {

						var td = $("<td style=\"text-align:center;\"></td>");
						var checkbox = $("<input type=\"checkbox\" class=\"selectSingle\"/>");
						td.append(checkbox);
						row.append(td);

						checkbox.data("rowData", rowData);
					
						$.each(checkbox.parent().parent().parent().parent()
								.data("checkedRowDatas"), function(j,
								checkedRowData) {
							if (objectEquals(checkedRowData, rowData)) {
								checkbox.prop("checked", true);
							}
						});
						if(table!=""){
						/*修复全选数据翻页后再回到此页，全选不勾选问题*/
							if(table.find(".selectSingle:not(:disabled):checked").length==table.find(".selectSingle:not(:disabled)").length){
								table.find($("[id=allCheck]:checkbox")).prop("checked", true);
							}else{
								table.find($("[id=allCheck]:checkbox")).prop("checked", false);
							}
						}
						checkbox.on("click", function() {
							handleCheckedRowDatas($(this),option);
						});
						
					}
					if (option.showIndex) {
						/*row.append("<td style=\"text-align:center;\">"
								+ ((i + 1) + ((pageIndex - 1) * pageSize))
								+ "</td>");*/
						row.append("<td style=\"text-align:center;\">"
								+ (i+1)
								+ "</td>");
					}
					//tbody.parent().attr("style","table-layout:fixed;");//与下面   超长数据不换行，隐藏用...配合使用
					$.each(option.columnModel, function(j, model) {
						if (model.formatter instanceof Function) {
							//var td = $("<td style=\"text-align:" + model.align
								//	+ "; overflow:hidden; text-overflow:ellipsis; white-space: nowrap; \"></td>");//添加超长数据不换行，隐藏用...代替样式
							var td = $("<td style=\"text-align:" + model.align
									+ "; \"></td>");
							row.append(td);
							td.append(model.formatter(rowData, td));
						} else {
							//row.append("<td style=\"text-align:" + model.align
							//		+ "; overflow:hidden; text-overflow:ellipsis; white-space: nowrap; \">" + rowData[model.field] + "</td>");
							row.append("<td style=\"text-align:" + model.align
									+ "; \">" + rowData[model.field] + "</td>");
						}
					});
				});
			}else {
				var colspan = option.columnModel.length;
				if (option.showIndex) {
					colspan += 1;
				}
				if (option.showCheck) {
					colspan += 1;
				}
				var row = $("<tr></tr>");
				var cell = $("<td colspan=\"" + colspan
						+ "\" class=\"text-center font_red\"></td>");
				tbody.append(row);
				row.append(cell);

				cell.append("没有符合条件的数据！");
			}
		
			setTimeout("waitLoad('"+ $(element).selector +"')", 200);//延迟200毫秒去掉透明样式
		};
		
		
		/**
		 * 声明的全局函数，用于setTimeout('waitLoad()', 200)
		 * 调用延迟200毫秒去掉tbody数据的透明样式
		 */
		waitLoad = function(tableId){
			
			$(tableId).children("tbody").removeAttr('style');
			//.css({'opacity':1,'filter':'alpha(opacity=100)'})
		};
		var renderPagination = function(element, data, pageSize, pageIndex,
				url, method, param, success, option, tbody) {
			if (0 < data.rowCount) {
				var pageCount = ((data.rowCount % pageSize > 0) ? (Math
						.floor(data.rowCount / pageSize) + 1)
						: (data.rowCount / pageSize));
				element.empty().append(
						getPagination(pageIndex, pageCount, data.rowCount));
				element.find("a[data-page-index]").on(
						"click",
						function(event) {
							var data = getRemotePagingData(url, method, param,
									pageSize, getPageIndex(event.target));
							renderPagination(element, data, pageSize,
									getPageIndex(event.target), url, method,
									param, success, option, tbody);
							if (success instanceof Function) {
								success(data);
							}
						});
				//input propertychange用于监听页码的输入，输入值变化触发事件
				element.find("#input4").on("input propertychange", function(event) {
					$(this).val($(this).val().replace(/[^\d]/g, ''));
				}).on(
						"beforepaste",
						function(event) {
							clipboardData.setData('text', clipboardData
									.getData('text').replace(/[^\d]/g, ''));
						})
						.on(
								"keypress",
								function(event) {
									
									if (13 == event.which) {
										
										if (!$(event.target).val().replace(
												/(^\s*)|(\s*$)/g, "")) {
											if ($.nerisInfo) {
												element.find("#input4").blur();
												$.nerisInfo("请输入跳转的页码！");
											} else {
												element.find("#input4").blur();
												alert("请输入跳转的页码！");
											}
											$(event.target).val("");
										} else if (isNaN(parseInt($(
												event.target).val()))) {
											if ($.nerisInfo) {
												element.find("#input4").blur();
												$.nerisInfo("页码只能由数字构成！");
											} else {
												element.find("#input4").blur();
												alert("页码只能由数字构成！");
											}
										} else if (1 > parseInt($(event.target)
												.val())
												|| pageCount < parseInt($(
														event.target).val())) {
											if ($.nerisInfo) {
												element.find("#input4").blur();
												element.find("#input4").val("");
												$.nerisInfo("请输入有效页码！");
											} else {
												element.find("#input4").blur();
												element.find("#input4").val("");
												alert("请输入有效页码！");
											}

										} else {
											var data = getRemotePagingData(url,
													method, param, pageSize,
													parseInt($(event.target)
															.val()));
											renderPagination(element, data,
													pageSize,
													parseInt($(event.target)
															.val()), url,
													method, param, success,
													option, tbody);
											if (success instanceof Function) {
												success(data);
											}
										}
									}
									
								});
				element
						.find("#jump_button")
						.on(
								"click",
								function(event) {
									
								
									$(this).blur();
									if (!element.find("#input4").val().replace(
											/(^\s*)|(\s*$)/g, "")) {
										if ($.nerisInfo) {
											$.nerisInfo("请输入跳转的页码！");
										} else {
											alert("请输入跳转的页码！");
										}
										element.find("#input4").val("");
									} else if (isNaN(parseInt(element.find(
											"#input4").val()))) {
										if ($.nerisInfo) {
											element.find("#input4").val("");
											$.nerisInfo("页码只能由数字构成！");
										} else {
											element.find("#input4").val("");
											alert("页码只能由数字构成！");
										}
									} else if (1 > parseInt(element.find(
											"#input4").val())
											|| pageCount < parseInt(element
													.find("#input4").val())) {
										if ($.nerisInfo) {
											element.find("#input4").val("");
											$.nerisInfo("请输入有效页码！");
										} else {
											element.find("#input4").val("");
											alert("请输入有效页码！");
										}
									} else {
										var data = getRemotePagingData(url,
												method, param, pageSize,
												parseInt(element
														.find("#input4").val()));
										renderPagination(
												element,
												data,
												pageSize,
												parseInt(element
														.find("#input4").val()),
												url, method, param, success,
												option, tbody);
										if (success instanceof Function) {
											success(data);
										}
									}
								});
				refreshTbody(tbody, data.pageList, option, pageSize, pageIndex);
			
			} else {
				refreshTbody(tbody, data.pageList, option, pageSize, pageIndex);
				element.empty().append(getNoResult());
			}
			
		};

		/*
		 * 
		 * 表格渲染
		 * 
		 */

		var renderColGroup = function(element, option) {
			var colgroup = $("<colgroup></colgroup>")
			if (option.showCheck) {
				colgroup.append("<col width=\"5%\"></col>");
			}
			if (option.showIndex) {
				colgroup.append("<col width=\"5%\"></col>");
			}
			$.each(option.columnModel, function(i, model) {
				colgroup.append("<col width=\"" + model.width + "\"></col>");
			});
			element.append(colgroup);
		};

		var renderCaption = function(element, option) {
			if (option.caption) {
				element.append("<caption>" + option.caption + "</caption>");
			}
		};

		var toggleCheckAll = function(e,checkAll) {
			table =$(e).closest("table")
			if (checkAll.is(":checked")) {
				table.find($("[id=allCheck]:checkbox")).prop("checked", true);
				$.each(checkAll.parent().parent().parent().siblings("tbody")
						.find("tr td input[type=checkbox]"), function(i,
						checkbox) {
					if (!$(checkbox).is(":checked")) {
						$(checkbox).trigger("click");
					}
				});
			} else {
				$.each(checkAll.parent().parent().parent().siblings("tbody")
						.find("tr td input[type=checkbox]"), function(i,
						checkbox) {
					if ($(checkbox).is(":checked")) {
						$(checkbox).trigger("click");
					}
				});
			}
		};
//--------------------------------------------------------------------------------------
		//多行组合表头
		var groupThead = function(option,element){
		  
			var columns=option.groupModel.slice(0);
			//数组拷贝避免引用传值换乱
			columns[columns.length-2]=columns[columns.length-2].slice(0);
			var showCheck = {
				colName: "<input type=\"checkbox\" id=\"allCheck\"/>",
				rowspan : 2,
				align:"center"
			}
			var showIndex = {
				colName : "序号",
				rowspan : 2,
				align:"center"
			}
			
			var indexAndCheckCol=0;
			
			if(option.showIndex){
				
				columns[columns.length-2].unshift(showIndex);
				indexAndCheckCol++;
			}
			if(option.showCheck){
				
				columns[columns.length-2].unshift(showCheck);
				indexAndCheckCol++;
			}
			var thead=$("<thead></thead>");
			for(var i=0, len=columns.length;i<len;i++){
				if(i<len-2){//除最后一行 每行的第一个格加上 序号 和 复选框的列
					columns[i][0].colspan = columns[i][0].colspan+indexAndCheckCol;
				}
				var tr = $("<tr></tr>");
				for(var j=0,trLen=columns[i].length;j<trLen;j++){
					var column=columns[i][j]
					var th = $("<th>" + column.colName+ "</th>");
					
					th.attr({
						"rowspan":column.rowspan,
						"colspan":column.colspan,
						});
					th.css({
						"text-align":column.align,
						width:column.width
						});
					tr.append(th);
				}
				thead.append(tr);
			}
			thead.find("input:checkbox").on("click", function() {
				toggleCheckAll(element,$(this));
			});
			return thead;
		};
		//单行表头
		var singleThead = function(option,element){
			var thead = $("<thead></thead>")
			var theadRow = $("<tr></tr>");
			if (option.showCheck) {
				var checkAll = $("<input type=\"checkbox\" id=\"allCheck\"/>");
				checkAll.on("click", function() {
					toggleCheckAll(element,$(this));
				});
				var th = $("<th style=\"text-align: center;\"></th>");
				th.append(checkAll);
				theadRow.append(th);
			}
			if (option.showIndex) {
				theadRow.append("<th style=\"text-align: center;\">序号</th>");
			}
			$.each(option.columnModel, function(i, model) {
				if (model.titleAlign) {
					theadRow
							.append("<th style=\"text-align: "
									+ model.titleAlign + ";\">" + model.title
									+ "</th>");
				} else {
					theadRow.append("<th style=\"text-align: center;\">"
							+ model.title + "</th>");
				}
			});
			thead.append(theadRow);
			return thead;
		}
		
//--------------------------------------------------------------------------------------
		var renderThead = function(element, option) {
			//选择标题分
			var thead=option.groupThead ? groupThead(option,element):singleThead(option,element);
			element.append(thead);
		};

		var renderTbody = function(element, option) {
			var tbody = $("<tbody></tbody>");
			element.append(tbody);
			return tbody
		};

		var renderTfoot = function(element, option, tbody) {
			removeTfoot(element);
			var tableId = element.attr("id");
			var data;
			var pagination = $("<div id =\'"+tableId+"_gridTfoot\'"
					+ ((option.showPagination) ? ("")
							: ("style=\"display:none;\"")) + "></div>");
			
			//判断当前传入的页码
			if(!isNaN(option.currentPage) && option.currentPage > 1){
				option.currentPage = Math.floor(option.currentPage);
				data = getRemotePagingData(option.url, option.method,
						option.param, option.pageSize, option.currentPage);
				//验证得到的当前页码是否大出了尾页
				if(!(option.currentPage <= data.lastPage)){
					option.currentPage=1;
					data = getRemotePagingData(option.url, option.method,
							option.param, option.pageSize, option.currentPage);
				}
				renderPagination(pagination, data, option.pageSize, option.currentPage, option.url,
						option.method, option.param, option.success, option, tbody);
				
			}else{
				data = getRemotePagingData(option.url, option.method,
						option.param, option.pageSize, 1);
				renderPagination(pagination, data, option.pageSize, 1, option.url,
						option.method, option.param, option.success, option, tbody);
			}
			if (option.success instanceof Function) {
				option.success(data);
			}
			
			if(undefined != option.paginationId){
				$('#'+option.paginationId).append(pagination);
			} else {
				element.after(pagination);
			}
			return data.pageList;
		};


		var renderTable = function(element, option) {
			element.addClass("table").addClass("table-condensed").addClass("table-striped")
			.addClass("table-hover").addClass("table_load");
			if(undefined != option.tableWidth){
				element.css('width', option.tableWidth);
			}
			
			element.empty();
			element.data("checkedRowDatas", []);
			renderColGroup(element, option);
			renderCaption(element, option);
			renderThead(element, option);
			renderTfoot(element, option, renderTbody(element, option));
		};

		renderTable(element, this.settings);
	}

	var reload = function(element, options) {
		var settings = $.extend(element.data("settings"), options);
		var grid = new Grid(element, settings);
		element.data("settings", settings);
	};

	var getCheckedRowDatas = function(element) {
		return element.data("checkedRowDatas");
	};
	
	/**
	 * 删除分页表格的分页列表
	 */
	var removeTfoot = function(element){
		var tableId = element.attr("id");
		var gridTfoot = element.parent().find("#"+tableId+"_gridTfoot");
		if(gridTfoot.length > 0){
			gridTfoot.detach();
		}
	}
	/**
	 * 清空分页表格
	 */
	var emptyGrid = function(element) {
		element.empty();
		removeTfoot(element);
	}
	//js获取项目根路径，如： http://localhost:8080/tech-widget-test
	var getRootPath = function() {
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
	
	$.fn.nerisGrid = function() {
		switch (typeof arguments[0]) {
			case "object":
				/*var grid = new Grid(this, arguments[0]);
				$(this).data("settings", grid.settings);
				break;*/
			case "undefined":
				var grid = new Grid(this, arguments[0]);
				$(this).data("settings", grid.settings);
				break;
			case "string":
				switch (arguments[0]) {
				case "reload":
					reload(this, arguments[1]);
					break;
				case "getCheckedRowDatas":
					return getCheckedRowDatas(this);
					break;
				case "emptyGrid":
					emptyGrid(this);
					break;
				}
			break;
		}
	}
}(window.jQuery)