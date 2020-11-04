!function($) {
	var Pagination = function(element, option) {
		var defaultOption = {
			url : null,
			method : "post",
			pageSize : 15,
			success : null,
			error : null
		};
		if(option["pageSize"] <= 0){//pageSize必须大于0否则会出错
			option["pageSize"] = undefined;
		}
		option = $.extend(defaultOption, option);
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
				error : function(xhq, errMsg, e) {
					console.error(errMsg);
					console.error(JSON.stringify(e));
					console.error("加载远程数据发生错误！");
				}
			}).responseText);
		};

		var getNoResult = function() {
			var nav = $("<nav><ul class=\"pagination\"><li class=\"disabled\"><a href=\"#\">上一页</a></li><li class=\"disabled\"><a href=\"#\">下一页</a></li></ul><div class=\"jump\"><span class=\"jump_text\" style=\"cursor: not-allowed;\"><button type=\"button\" class=\"btn btn-primary btn-xs\" disabled>GO</button></span><span class=\"jump_text\">页</span><span class=\"jump_text\"><input type=\"text\" class=\"form-control2 \" id=\"input4\"></span><span class=\"jump_text\">跳到</span><span class=\"jump_text\">共有0页，0条记录。</span></div></nav>");
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
			/*id=\"input4\" value=\""+ currentPage + "\" onkeyup=*/
			pagination
					.append("<div class=\"jump\"><span class=\"jump_text\"><button id=\"jump_button\" type=\"button\" class=\"btn btn-primary btn-xs\">GO</button></span><span class=\"jump_text\">页</span><span class=\"jump_text\"><input type=\"text\" class=\"form-control2 \" id=\"input4\"  onkeyup=\"value=value.replace(/[^\\d]/g,'')\" onbeforepaste=\"clipboardData.setData('text',clipboardData.getData('text').replace(/[^\\d]/g,''))\" oninput=" +
							"\"this.value=this.value.replace(/[^0-9]+/g,'')\"></span><span class=\"jump_text\">跳到</span><span class=\"jump_text\">共有"
							+ pageCount + "页，" + total + "条记录。</span></div>");

			return pagination;
		};

		var renderPagination = function(element, data, pageSize, pageIndex,
				url, method, param, success) {
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
									param, success);
							if (success instanceof Function) {
								success(data);
							}
						});
				element.find("#input4")
						.on(
								"keypress",
								function(event) {
								
									if (13 == event.which) {
										if (!$(event.target).val().replace(
												/(^\s*)|(\s*$)/g, "")) {
											if ($.nerisInfo) {
												element.find("#input4").blur();
												$.nerisInfo("请输入要跳转的页码！");
											} else {
												element.find("#input4").blur();
												alert("请输入要跳转的页码！");
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
													method, param, success);
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
											$.nerisInfo("请输入要跳转的页码！");
										} else {
											alert("请输入要跳转的页码！");
										}
										element.find("#input4").val("");
									} else if (isNaN(parseInt(element.find(
											"#input4").val()))) {
										alert("页码只能由数字构成！");
									} else if (1 > parseInt(element.find(
											"#input4").val())
											|| pageCount < parseInt(element
													.find("#input4").val())) {
										if ($.nerisInfo) {
											$.nerisInfo("请输入有效页码！");
											element.find("#input4").val("");
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
												url, method, param, success);
										if (success instanceof Function) {
											success(data);
										}
									}
								});
			} else {
				element.empty().append(getNoResult());
			}
		};
		var data;
		
		//判断当前传入的页码
		if(!isNaN(option.currentPage) && option.currentPage > 1){
			option.currentPage = Math.floor(option.currentPage);
			data = getRemotePagingData(option.url, option.method, option.param,
				   option.pageSize, option.currentPage);
			//验证得到的当前页码是否大出了尾页
			if(!(option.currentPage <= data.lastPage)){
				option.currentPage=1;
				data = getRemotePagingData(option.url, option.method, option.param,
					   option.pageSize, option.currentPage);
			}
			renderPagination(element, data, option.pageSize, option.currentPage, option.url,
					option.method, option.param, option.success);
		}else{
			data = getRemotePagingData(option.url, option.method, option.param,
					option.pageSize, 1);
			renderPagination(element, data, option.pageSize, 1, option.url,
					option.method, option.param, option.success);
		}
		if (option.success instanceof Function) {
			option.success(data);
		}
	}

	$.fn.nerisPagination = function(option) {
		new Pagination(this, option);
	}
}(window.jQuery)