/**
 * 数据表格组件，使用前请阅读组件API文档。
 * 旧的分页表格组件（neris.grid.js）新功能已停止更新，使用上下分页等新功能请使用此组件。
 * 该组件依赖第三方插件 jQuery、jquery.dataTables.js、dataTables.bootstrap.js。
 * 
 * Copyright ® 中国证监会中央监管信息平台版权所有
 * 
 * Author: 公共组件组Gongph
 * Version: 2.3.1
 * Date: 2017/10/11
 */

if (typeof jQuery === 'undefined') {
  throw new Error('NerisDatatable\'s JavaScript requires jQuery')
}

+(function ($) {
  'use strict';
  
  var settings = {}, roots = {},
  // default consts of datatables
  _consts = {
    SIGN: '#',
    SEQSTR: '序号',
    id: {
      DIV: '_wrapper',
      PAGE_INFO: '.neris-page-info',
      ALL_CHECKED: '.dataTables_allcheck',
      CHECKED: '.dataTables_check',
      BTN_JUMP: '.btn-jump'
    },
    event: {
      ALL_CHECKED: 'dataTables_allcheck',
      EMIT_ALL_STATE: 'emit_dataTables_allcheck_state',
      CHECKED: 'dataTables_check',
      JUMPTO: 'btn-jump',
      INIT_COMPLETE: 'init_complete',
      DRAW_COMPLETE: 'draw_complete'
    }
  },
  consts = _consts,
  // default setting of datatables
  _setting = {
    tableId: '',        // 表格id
    tableObj: null,     // 表格对象
    dt: null,           // datatable对象
    // options
    indexing: false,    // 是否开启索引
    checking: false,    // 是否开启勾选
    processing: false,  // 是否显示加载动画
    serverSide: true,   // 是否开启服务端模式
    paging: true,       // 是否开启分页
    pageLength: 5,      // 指定每页显示的数量
    pageShow: 'bottom', // 指定分页条显示位置，可选值有：'top', 'bottom', 'all'。
    scrollX: false,     // 是否开启横向滚动条
    ordering: false,    // 是否开启排序
    rowId: '',          // 指定行id
    ajax: null,         // 异步加载配置
    dom: '',            // 自定义Dom
    rowData: null,      // 用户回传的行数据，用来回显处理。
    columns: [],        // 表格列配置
    // language
    language: {
      info: '当前第 _PAGE_ 页 / 共 _PAGES_ 页',
      infoEmpty: '当前第 0 页 / 共 0 页',
      lengthMenu: '每页显示  _MENU_ 条',
      search: '查询: ',
      paginate: {
        first: '首页',
        last: '末页',
        next: '下一页',
        previous: '上一页'
      },
      processing: '加载中...',
      loadingRecords: '加载中...',
      zeroRecords: '没有符合条件的数据！'
    },
    // callback
    callback: {
      initComplete: null,
      drawComplete: null,
      onAllChecked: null,
      onChecked: null
    }
  },
  // use root to save full data
  _initRoot = function (setting) {
    var r = data.getRoot(setting);
    if (!r) {
      r = {};
      data.setRoot(setting, r);
    }
    r.curSelectedList = {};
    r.container = setting.tableId + consts.id.DIV;
    r.dt = setting.dt;
    r._ver = (new Date()).getTime();
  },
  // default bindEvent of datatables
  _bindEvent = function (setting) {
    var root = data.getRoot(setting),
        c = consts.event,
        o = $(consts.SIGN + root.container);
    o.bind(c.EMIT_ALL_STATE, function () {
      var curPageSelectedList = data.getCurPageSelectedList(setting),
          curPageRowData = data.getCurPageRowsData(setting);
      if (curPageSelectedList.length == curPageRowData.length && curPageRowData.length > 0) {
        view.setAllChecked(setting);
      } else {
        view.cancelAllChecked(setting);
      }
    });
    
    o.bind(c.ALL_CHECKED, function (event, srcEvent, rowsData) {
      tools.apply(setting.callback.onAllChecked, [srcEvent, rowsData]);
    });
    
    o.bind(c.CHECKED, function (event, srcEvent, rowData) {
      tools.apply(setting.callback.onChecked, [srcEvent, rowData]);
    });
    
    o.bind(c.INIT_COMPLETE, function () {
      tools.apply(setting.callback.initComplete);
    });
    
    o.bind(c.DRAW_COMPLETE, function () {
      tools.apply(setting.callback.drawComplete);
    });
    
  },
  // default unbindEvent of datatables
  _unbindEvent = function (setting) {
    var root = data.getRoot(setting),
        c = consts.event,
        o = $(consts.SIGN + root.container);
    o.unbind(c.EMIT_ALL_STATE)
     .unbind(c.ALL_CHECKED)
     .unbind(c.CHECKED)
     .unbind(c.INIT_COMPLETE)
     .unbind(c.DRAW_COMPLETE);
  },
  _init = {
    bind: [_bindEvent],
    unbind: [_unbindEvent],
    roots: [_initRoot]
  },
  // method of operate data
  data = {
    /**
     * 单选的同时保存数据到缓存列表
     * @param {Object} setting
     * @param {Object} checkFlag
     */
    addCheckedData: function (setting, event) {
      var target = event.target,
          rowId = $(target).closest('tr').prop('id'),
          hasChecked = data.isCheckedCurrentRow(setting, rowId), 
          ischecked = $(target).prop('checked'),
          root = data.getRoot(setting),
          rowsData = data.getCurPageSelectedList(setting),
          rowData = data.getCurPageRowData(setting, rowId);
      if (ischecked) {
        if (!hasChecked) {
          rowsData.push(rowData);
        }
      } else {
        if (hasChecked) {
          var index = data.getIndexFromSelectedList(setting, rowId);
          if (index > -1) rowsData.splice(index, 1);
        }
      }
      $(consts.SIGN + root.container).trigger(consts.event.EMIT_ALL_STATE);
      $(consts.SIGN + root.container).trigger(consts.event.CHECKED, [event, rowData]);
    },
    /**
     * 全选的同时保存数据到缓存列表
     * @param {Object} setting
     * @param {Object} checkFlag
     */
    addAllcheckedData: function (setting, event, checkFlag) {
  	  var curPage = data.getCurPage(setting),
  	      rowsData = data.getCurPageRowsData(setting),
  	      root = data.getRoot(setting);
  	  if (checkFlag) {
  	    view.selectedRows(setting); // 勾选每行
	    root.curSelectedList[curPage] = rowsData; // 保存当前页所有的行
  	  } else {
  	    view.cancelCheckeds(setting);  // 取消勾选每行
  	    delete root.curSelectedList[curPage]; // 删除勾选数据
  	  }
      $(consts.SIGN + root.container).trigger(consts.event.ALL_CHECKED, [event, rowsData]);
  	},
    /**
     * 增加回显的行数据
     * @param {Object} setting
     */
    addRowData: function (setting) {
      if (!setting.rowData || !tools.isObject(setting.rowData)) return;
      
      var ed = setting.rowData, curPage = data.getCurPage(setting), curSelectedList = data.getCurSelectedList(setting);
      
      for (var p in ed) {
      	var rids = ed[p];
        for (var i = 0, len = rids.length; i < len; i++) {
          var rowId = rids[i][setting.rowId];
          if (!curSelectedList[p]) {
            curSelectedList[p] = [];
          }
          curSelectedList[p].push(rids[i]);
          
          if (p == curPage) {
          	var rowNode = view.findRowByRowId(setting, rowId);
            if (rowNode) view.selectedRow(setting, rowNode);
          }
          
        }
      }
    },
    /**
     * 检查全选按钮是否应该被勾选
     * 主要是翻页的时候反显全选按钮的勾选状态
     * @param {Object} setting
     */
    checkAllCheckedState: function (setting) {
      var allcheckedState = false,
          curPageSelectedList = data.getCurPageSelectedList(setting),
          curPageRowData = data.getCurPageRowsData(setting);
      if (curPageSelectedList.length == curPageRowData.length && curPageRowData.length > 0) {
        allcheckedState = true;
      }
      return allcheckedState;
    },
    /**
     * 清除当前选择的列表集合
     * @param {Object} setting
     */
    clearCurSelectedList: function (setting) {
      data.getRoot(setting).curSelectedList = {};
    },
    /**
     * 判断当前行是否已经存在缓存列表中
     * @param {Object} setting
     * @param {Object} rowId `<tr>` 的 id 属性值
     * @return true: 存在； false: 不存在
     */
    isCheckedCurrentRow: function (setting, rowId) {
      var curPage = data.getCurPage(setting),
          curPageSelectedList = data.getCurPageSelectedList(setting),
          ischecked = false;
      if (curPageSelectedList.length > 0) {
        for (var i = 0, len = curPageSelectedList.length; i < len; i++) {
          if (curPageSelectedList[i][setting.rowId] === rowId) {
            ischecked = true;
            break;
          }
        }
      }
      return ischecked;
    },
    /**
     * 初始化表格，调用第三方DataTables的初始化方法
     * @example
     *   $('#example').DataTable(option);
     * 
     * @param {Object} setting
     */
    initTable: function (setting) {
      if (setting == null) errors.noArgumentsSpecifiedException();
      if (setting.checking && !setting.rowId) errors.noRowIdSpecifiedException();
      
      var flag = 0;
      // add indexing column
      if (setting.indexing) {
        setting.columns.unshift(view.addSequenceColumn());
        flag++;
      }
      
      // add checking column
      if (setting.checking) {
        setting.columns.unshift(view.addCheckingColumn());
        flag++;
      }
      
      // set `nowrap` class of scrollX
      if (setting.scrollX) {
        $(consts.SIGN + setting.tableId).addClass('nowrap');
      }
      
      // set `datatables-loading` class of table
      if (setting.processing) {
        $(consts.SIGN + setting.tableId).addClass('datatables-loading');
      }
      
      // 设置DataTable内置的错误提示方式为不提示
      // 可选项有`alert`、`throw` 和 `none`
      $.fn.dataTable.ext.errMode = 'none';
      
      // init
      var table = setting.tableObj.DataTable({
        language   : setting.language,
        serverSide : setting.serverSide,
        rowId      : setting.rowId,
        paging     : setting.paging,
        pageLength : setting.pageLength,
        scrollX    : setting.scrollX,
        ordering   : setting.ordering,
        ajax       : setting.ajax,
        dom        : setting.dom ? setting.dom : view.addDom(setting),
        columns    : setting.columns,
        
        /**
         * 表格初始化完成回调
         * @param {Object} settings
         * @param {Object} json
         */
        initComplete: function (settings, json) {
          var root = data.getRoot(setting),
              tableWapper = consts.SIGN + root.container;
          
//        if (!json || json.recordsTotal <= 0) {
//          view.disabledJumpBtnDom(tableWapper, false);
//        }

          data.initCustomScrollbar(setting);// 初始化滚动条
          data.addRowData(setting); // 数据回显
          $(tableWapper).trigger(consts.event.INIT_COMPLETE);
        },
        /**
         * 表格渲染完成之前回调
         */
        preDrawCallback: function () {
          view.setTbodyStyles(this, setting, {
            'opacity': 0.8,
          });
          
          var tbody = this.api().table().body();
          // 初始化提示'加载中' 菊花图
          if (tbody.children.length <= 0) {
            var tr = "<tr>"
                 + "<td colspan='" 
                 + (setting.columns.length + flag) 
                 + "' style='height: 200px'></td>"
                 + "</tr>";
            $(tbody).append(tr);
          }
        },
        /**
         * 表格渲染完成回调
         * @param {Object} settings
         */
        drawCallback: function (settings) {
          var root = data.getRoot(setting), tableWapper = consts.SIGN + root.container, total = settings.json.recordsTotal || 0;
          // 移除 body 的 style 内联样式
          $(this.api().table().body()).removeAttr('style');
          // 插入分页信息及跳转按钮DOM
          var html = view.addPageInfoDom(this.api().page.info());
          view.insertPageInfoNodes(setting, html);
          // 处理分页信息跳转按钮：如果数据 `recordsTotal = 0`, 跳转按钮置灰不可点击
          if (total <= 0) {
          	view.disabledJumpBtnDom(tableWapper, true); // 禁用 `GO` 按钮
          }
          // 处理全选复选框勾选状态
          view.handleAllCheckedState(setting);
          // 触发回调
          $(tableWapper).trigger(consts.event.DRAW_COMPLETE);
        },
        /**
         * 行渲染完成回调
         * @param {Object} row 每行的DOM对象
         * @param {Object} data 每行的数据
         */
        rowCallback: function (row, data) {
          // 处理翻页单选复选框勾选状态
          view.selectedRow(setting, row);
        }
      });
      return table;
    },
    /**
     * 初始化滚动条
     */
    initCustomScrollbar: function (setting) {
      if (!setting.scrollX) {
        return;
      }
      
      var root = data.getRoot(setting), c = consts.SIGN + root.container;
      $(c).find('.dataTables_scroll').mCustomScrollbar({
        theme: 'minimal-dark',
        horizontalScroll: true,
        advanced: {
          updateOnSelectorChange: true
        },
        callbacks: {
          onScroll: function () {
            // 删除类 `mCustomScrollBox` 自动生成的 style 行样式
            // 主要是兼容 标签页。如果表格组件嵌套在 tab 标签页中，
            // 切换的时候滚动条插件会设置它的 `max-height:0` 导致表格数据显示不出来。
            $(c).find(".mCustomScrollBox").removeAttr("style");
          }
        }
      });
      // 删除内嵌的滚动条的样式
      $(c).find(".dataTables_scrollBody").removeAttr("style");
      $(c).find(".mCSB_horizontal.mCSB_inside .mCSB_container").css({ marginBottom: "10px" });
    },
    /**
     * 初始化容器数据，即祖先元素数据。
     * @param {Object} setting
     */
    initRoot: function (setting) {
      for (var i = 0, len = _init.roots.length; i < len; i++) {
        _init.roots[i].apply(this, arguments);
      }
    },
    /**
     * 得到当前表格实例的祖先元素数据
     * @param {Object} setting
     */
    getRoot: function (setting) {
      return setting ? roots[setting.tableId] : null;
    },
    /**
     * 得到当前表格实例对应的配置信息
     * @param {Object} tableId
     */
    getSetting: function (tableId) {
      return settings[tableId];
    },
    /**
     * 得到全局配置信息
     */
    getSettings: function () {
      return settings;
    },
    /**
     * 得到当前表格实例的初始化时的表格对象
     * @param {Object} setting
     */
    getDT: function (setting) {
      return data.getRoot(setting).dt;
    },
    /**
     * 得到当前页
     * @param {Object} setting
     */
    getCurPage: function (setting) {
      return data.getDT(setting).page() + 1;
    },
    /**
     * 得到总页数
     * @param {Object} setting
     */
    getPages: function (setting) {
      return data.getDT(setting).page.info().pages;
    },
    /**
     * 得到当前页所有行节点
     * @param {Object} setting
     */
    getCurPageRowsNodes: function (setting) {
      return dt.rows({ page: 'current' }).nodes();
    },
    /**
     * 得到当前页指定行的数据
     * @param {Object} setting
     * @param {Object} rowId
     */
    getCurPageRowData: function (setting, rowId) {
      var curRows = data.getDT(setting).rows({ page: 'current' });;
      return curRows.row(consts.SIGN + rowId).data();
    },
    /**
     * 得到当前页所有复选框不是 `disabled` 的行数据集合
     * @param {Object} setting
     */
    getCurPageRowsData: function (setting) {
      var rowData = [], curRows = data.getDT(setting).rows({ page: 'current' });
      data.getDT(setting).rows({ page: 'current' }).nodes().each(function (row, index) {
      	var checkboxOfRow = $(row).find(consts.id.CHECKED);
      	if (!checkboxOfRow.prop('disabled')) {
      	  var data = curRows.row(index).data();
      	  rowData.push(data);
      	}
      });
      return rowData;
    },
    /**
     * 得到当前选中的数据列表
     * @param {Object} setting
     */
    getCurSelectedList: function (setting) {
      return data.getRoot(setting).curSelectedList;
    },
    /**
     * 得到当前页的勾选数据集合
     * @param {Object} setting
     */
    getCurPageSelectedList: function (setting, page) {
      var curSelectedList = data.getRoot(setting).curSelectedList,
          curPage = page || data.getCurPage(setting);
      if (!curSelectedList[curPage]) {
        curSelectedList[curPage] = [];
      }
      return curSelectedList[curPage];
    },
    /**
     * 得到当前行在勾选数据列表中的索引
     * @param {Object} setting
     * @param {Object} rowId
     */
    getIndexFromSelectedList: function (setting, rowId) {
      var curPage = data.getCurPage(setting),
          curPageSelectedList = data.getCurPageSelectedList(setting),
          index = -1;
      for (var i = 0, len = curPageSelectedList.length; i < len; i++) {
        if (curPageSelectedList[i][setting.rowId] === rowId) {
          index = i ;
          break;
        }
      }
      return index;
    },
    /**
     * 设置祖先元素
     * @param {Object} setting
     * @param {Object} root
     */
    setRoot: function (setting, root) {
      roots[setting.tableId] = root;
    }
  },
  // methods of event for datatables
  event = {
   /**
    * 绑定事件
    * @param {Object} setting
    */
    bindEvent: function (setting) {
      for (var i = 0, len = _init.bind.length; i < len; i++) {
        _init.bind[i].apply(this, arguments);
      }
    },
    /**
     * 解绑事件
     * @param {Object} setting
     */
    unbindEvent: function (setting) {
      for (var i = 0, len = _init.unbind.length; i < len; i++) {
        _init.unbind[i].apply(this, arguments);
      }
    },
    /**
     * 在表格上绑定事件
     * @param {Object} setting
     */
    bindTable: function (setting) {
      var root = data.getRoot(setting);
      $(consts.SIGN + root.container).bind('click', function (event) {
        var target = event.target;
        if (tools.eqs(target.tagName, 'input') && target.getAttribute('class') !== null) {
          if (tools.eqs(target.getAttribute('class'), consts.event.ALL_CHECKED)) {
            data.addAllcheckedData(setting, event, $(target).prop('checked'));
          }
          else if (tools.eqs(target.getAttribute('class'), consts.event.CHECKED)) {
            data.addCheckedData(setting, event);
          }
        } 
        else if (tools.eqs(target.tagName, 'button') && $(target).hasClass(consts.event.JUMPTO)) {
          var ip = $(target).siblings(),
              num = parseInt(ip.val().trim());
          if (isNaN(num) || !/^[1-9]\d*$/.test( num ) || num > data.getPages(setting)) {
            ip.focus().val('');
            alert('请输入有效的页码！');
            return;
          }
          data.getDT(setting).page(num - 1).draw(false);
        }
      })
    },
    /**
     * 解绑表格上的事件
     * @param {Object} setting
     */
    unbindTable: function (setting) {
      var root = data.getRoot(setting);
      $(consts.SIGN + root.container).unbind('click');
    }
  },
  // methods of errors for datatables
  errors = {
    /**
     * 没有参数被指定时异常
     */
    noArgumentsSpecifiedException: function () {
      throw new Error ('No arguments are specified Exception!');
    },
    /**
     * `rowId` 参数没有被指定时异常
     */
    noRowIdSpecifiedException: function () {
      throw new Error ('No `rowId` are specified exception!')
    }
  },
  // methods of tools for datatables
  tools = {
    /**
     * 方法绑定
     * @param {Object} fun
     * @param {Object} param
     */
    apply: function (fun, param) {
      if ((typeof fun) == 'function') {
        return fun.apply(nd, param ? param : []);
      }
    },
    /**
     * 克隆数组或对象
     * @param {Object} obj
     */
    clone: function clone (obj) {
      if (obj == null) return null;
      var o = tools.isArray(obj) ? [] : {};
      for (var i in obj) {
        o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : 
               (typeof obj[i] === 'object' ? clone(obj[i]) : obj[i]);
      }
      return o;
    },
    /**
     * 判断两个字符串转成小写时是否相等
     * @param {Object} str1
     * @param {Object} str2
     */
    eqs: function (str1, str2) {
      return str1.toLowerCase() === str2.toLowerCase();
    },
    /**
     * 判断是否是数组
     * @param {Object} arr
     */
    isArray: function (arr) {
      return Object.prototype.toString.apply(arr) === '[object Array]';
    },
    /**
     * 判断是否是函数
     * @param {Object} obj
     */
    isObject: function (obj) {
      return Object.prototype.toString.apply(obj) === '[object Object]';
    }
  },
  // methods of operate datatable dom
  view = {
    /**
     * 增加索引列
     */
    addSequenceColumn: function () {
      var seq = {
        data: null,
        title: consts.SEQSTR,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        }
      }
      return seq;
    },
    /**
     * 增加勾选列
     */
    addCheckingColumn: function () {
      var checking = {
        data: null,
        title: view.addAllCheckNode(),
        orderable: false,
        defaultContent: view.addCheckNode()
      }
      return checking;
    },
    /**
     * 增加全选复选框DOM
     */
    addAllCheckNode: function () {
      return '<input type="checkbox" class="dataTables_allcheck"/>';
    },
    /**
     * 增加单选复选框DOM
     */
    addCheckNode: function () {
      return '<input type="checkbox" class="dataTables_check"/>';
    },
    /**
     * 增加自定义分页工具条DOM
     * @param {Object} setting
     */
    addDom: function (setting) {
      if (!setting.paging) return 't';
      
      var dom = '<"row"<"col-sm-7"p><"neris-page-info col-sm-5"i>>',
          show = '';
      if (setting.pageShow == 'top') {
        show = dom + 'rt';
      } 
      else if (setting.pageShow == 'bottom') {
        show = 'rt' + dom;
      }
      else {
        show = dom + 'rt' + dom;
      }
      return show;
    },
    /**
     * 增加分页信息DOM
     * @param {Object} pageInfo
     */
    addPageInfoDom: function (pageInfo) {
      var html = [];
      view.makeDOMNodePageInfo(html, pageInfo);
      view.makeDOMNodeJumpBtn(html, pageInfo);
      return html;
    },
    /**
     * 取消全选复选框的勾选状态
     * @param {Object} setting
     */
    cancelAllChecked: function (setting) {
      var root = data.getRoot(setting);
      $(consts.SIGN + root.container).find(consts.id.ALL_CHECKED).prop('checked', false);
    },
    /**
     * 取消单选复选框的勾选状态
     * @param {Object} node
     */
    cancelChecked: function (node) {
      $(node).prop('checked', false);
    },
    /**
     * 取消所有行中复选框的勾选状态
     * @param {Object} setting
     */
    cancelCheckeds: function (setting) {
      view.findCheckboxOfRows(setting).prop('checked', false);
    },
    /**
     * 禁用 `GO` 跳转按钮
     */
    disabledJumpBtnDom: function (root, state) {
      $(root).find(consts.id.PAGE_INFO + ' ' + consts.id.BTN_JUMP).prop('disabled', state);
    },
    /**
     * 找到当前行中的复选框
     * @param {Object} rowNode
     * @return 复选框对象
     */
    findCheckboxOfRow: function (rowNode) {
      return $(rowNode).find(consts.id.CHECKED);
    },
    /**
     * 找到所有行中没有 disabled 的复选框
     * @param {Object} setting
     * @return 复选框集合
     */
    findCheckboxOfRows: function (setting) {
      return $(data.getDT(setting).table().body()).find('input[type="checkbox"]:not(:disabled)');
    },
    /**
     * 根据 rowId 找到 row
     * @param {Object} setting
     * @param {Object} rowId
     */
    findRowByRowId: function (setting, rowId) {
      return data.getDT(setting).rows({ page: 'current' }).row(consts.SIGN + rowId).node();
    },
    /**
     * 处理全选复选框的勾选状态
     * 如果全选按钮应该被勾选，则勾选；否则，取消勾选。
     * @param {Object} setting
     */
    handleAllCheckedState: function (setting) {
      var flag = data.checkAllCheckedState(setting);
      flag ? view.setAllChecked(setting) : view.cancelAllChecked(setting);
    },
    /**
     * 插入分页信息DOM
     * @param {Object} setting
     * @param {Object} node
     */
    insertPageInfoNodes: function (setting, node) {
      var root = data.getRoot(setting);
      $(consts.SIGN + root.container).find(consts.id.PAGE_INFO).html(node.join(''));
    },
    /**
     * 往数组中 push 一条分页信息的字符串DOM
     * @param {Object} html
     * @param {Object} pageInfo
     */
    makeDOMNodePageInfo: function (html, pageInfo) {
      html.push('<div class="dataTables_info">共 ', pageInfo.pages, ' 页，', pageInfo.recordsTotal, ' 条记录。');
    },
    /**
     * 往数组中 push 一条跳转按钮的字符串DOM
     * @param {Object} html
     */
    makeDOMNodeJumpBtn: function (html) {
      html.push('跳转到第 <input type="text" class="jump-page"/> 页 ', 
        '<button type="button" class="btn btn-xs btn-primary btn-jump">GO</button></div>');
    },
    /**
     * 设置全选复选框为勾选状态
     * @param {Object} setting
     */
    setAllChecked: function (setting) {
      var root = data.getRoot(setting);
      $(consts.SIGN + root.container).find(consts.id.ALL_CHECKED).prop('checked', true);
    },
    /**
     * 设置单选复选框为勾选状态
     * @param {Object} node 复选框DOM对象
     */
    setChecked: function (node, state) {
      $(node).prop('checked', state);
    },
    /**
     * 勾选所有行中的复选框
     * @param {Object} setting
     */
    selectedRows: function (setting) {
      view.findCheckboxOfRows(setting).prop('checked', true);
    },
    /**
     * 勾选指定行中的复选框
     * @param {Object} setting
     * @param {Object} rowNode
     */
    selectedRow: function (setting, rowNode) {
      var rowId = $(rowNode).prop('id'),
          checkboxOfRow = view.findCheckboxOfRow(rowNode);
      if (data.isCheckedCurrentRow(setting, rowId)) {
        view.setChecked(checkboxOfRow, true);
      }
    },
    /**
     * 设置表格中Tbody的透明度
     */
    setTbodyStyles: function (dt, setting, styleObject) {
      if (setting.processing) {
        $(dt.api().table().body()).css(styleObject);
      }
    }
  }

  /**
   * init component
   * @param {Object} nSetting
   */
  $.fn.nerisDataTables = function (nSetting) {
    var setting = tools.clone(_setting);
    $.extend(true, setting, nSetting);
    setting.tableId = $(this).prop('id');
    setting.tableObj = $(this);
    // 初始化表格
    setting.dt = data.initTable(setting);
    settings[setting.tableId] = setting;
    
    // 初始化根元素数据
    data.initRoot(setting);
    
    // 解绑/绑定事件
    event.unbindTable(setting);
    event.bindTable(setting);
    event.unbindEvent(setting);
    event.bindEvent(setting);
    
    var dt = data.getDT(setting),
        ndtools = {
          setting: setting,
          // 渲染表格
          draw: function (paging) {
            dt.draw(paging == undefined ? true : paging);
            data.clearCurSelectedList(setting);
          },
          // 销毁表格实例
          destroy: function () {
            dt.destroy(true);
          },
          // 获取勾选的数据集合
          getSelectedRowData: function () {
            var cloneData = tools.clone(data.getCurSelectedList(setting)), attrs = [];
            for (var p in cloneData) {
              if (cloneData.hasOwnProperty(p)) {
                var rowData = cloneData[p];
                for (var i = 0, len = rowData.length; i < len; i++) {
                  attrs.push(tools.clone(rowData[i]));
                }
              }
            }
            return attrs;
          },
          // 获取每页勾选的数据
          getSelectedPageData: function () {
            return tools.clone(data.getCurSelectedList(setting));
          },
          // 设置勾选
          setChecked: function (rowId, flag) {
            var rowsData = data.getCurPageSelectedList(setting),
                rowData = data.getCurPageRowData(setting, rowId),
                index = data.getIndexFromSelectedList(setting, rowId);
            
            if (!rowData) return;
            
            if (index == -1 && flag) {
              rowsData.push(rowData);
            }
            
            if (index > -1 && !flag) {
              rowsData.splice(index, 1);
            }
            
            var rowNode = view.findRowByRowId(setting, rowId),
                checkboxOfRow = view.findCheckboxOfRow(rowNode);
            view.setChecked(checkboxOfRow, flag);
          },
          // 设置页码
          setPage: function (page, flag) {
            flag = flag || false;
            if (!page || parseInt(page, 10) < 0) {
              page = 1;
            }
            
            if (typeof page === 'string' && /^[first|last|next|previous]+$/.test(page)) {
              dt.page(page).draw(flag);
            }
            else if (typeof page === 'number') {
              var maxpage = data.getPages(setting);
              if (maxpage <= page) {
                page = maxpage;
              }
              dt.page(page - 1).draw(flag);
            }
          }
    }
    return ndtools;
  };
  
  var nd = $.fn.nerisDataTables;
  
})(jQuery);
