/**
 * 1.14版
 * 作者：lzhu
 */

!(function ($) {
    "use strict";

    function printFrame(frameWindow, content, options) {
        // Print the selected window/iframe
        var def = $.Deferred();
        try {
            frameWindow = frameWindow.contentWindow || frameWindow.contentDocument || frameWindow;
            var wdoc = frameWindow.document || frameWindow.contentDocument || frameWindow;
            if(options.doctype) {
                wdoc.write(options.doctype);
            }
            wdoc.write(content);
            wdoc.close();
            var printed = false;
            function callPrint() {
                if(printed) {
                    return;
                }
                // Fix for IE : Allow it to render the iframe
                frameWindow.focus();
                try {
                    // Fix for IE11 - printng the whole page instead of the iframe content
                    if (!frameWindow.document.execCommand('print', false, null)) {
                        // document.execCommand returns false if it failed -http://stackoverflow.com/a/21336448/937891
                        frameWindow.print();
                    }
                } catch (e) {
                    frameWindow.print();
                }
                frameWindow.close();
                printed = true;
                def.resolve();
            }
            // Print once the frame window loads - seems to work for the new-window option but unreliable for the iframe
            $(frameWindow).on("load", callPrint);
            // Fallback to printing directly if the frame doesn't fire the load event for whatever reason
            setTimeout(callPrint, options.timeout);
        } catch (err) {
            def.reject(err);
        }
        return def;
    }

    function printContentInIFrame(content, options) {
        var $iframe = $(options.iframe + "");
        var iframeCount = $iframe.length;
        if (iframeCount === 0) {
            // Create a new iFrame if none is given
            $iframe = $('<iframe height="0" width="0" border="0" wmode="Opaque"/>')
                .prependTo('body')
                .css({
                    "position": "absolute",
                    "top": -999,
                    "left": -999
                });
        }
        var frameWindow = $iframe.get(0);
        return printFrame(frameWindow, content, options)
            .done(function () {
                // Success
                setTimeout(function () {
                    // Wait for IE
                    if (iframeCount === 0) {
                        // Destroy the iframe if created here
                        $iframe.remove();
                    }
                }, 100);
            })
            .fail(function (err) {
                // Use the pop-up method if iframe fails for some reason
                console.error("Failed to print from iframe", err);
                printContentInNewWindow(content, options);
            })
            .always(function () {
                try {
                    options.deferred.resolve();
                } catch (err) {
                    console.warn('Error notifying deferred', err);
                }
            });
    }

    function printContentInNewWindow(content, options) {
        // Open a new window and print selected content
        var frameWindow = window.open();
        return printFrame(frameWindow, content, options)
            .always(function () {
                try {
                    options.deferred.resolve();
                } catch (err) {
                    console.warn('Error notifying deferred', err);
                }
            });
    }

    function isNode(o) {
        return !!(typeof Node === "object" ? o instanceof Node : o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string");
    }
    $.print = $.fn.print = function () {
    	var head = document.getElementsByTagName('head')[0];
      
        var options, $this, self = this;
        if (self instanceof $) {
        	//获取选择器指定的 DOM 元素
            self = self.get(0);
        }
        if (isNode(self)) {
        	//获取参数
            $this = $(self);
            if (arguments.length > 0) {
                options = arguments[0];
            }
        } else {
            if (arguments.length > 0) {
                $this = $(arguments[0]);
                if (isNode($this[0])) {
                    if (arguments.length > 1) {
                        options = arguments[1];
                    }
                } else {
                    options = arguments[0];
                    $this = $("html");
                }
            } else {
                $this = $("html");
            }
        }
        // 默认属性
        var defaults = {
            //globalStyles: true,
            mediaPrint:true,
            iframe: true,
            deferred: $.Deferred(),
            timeout: 750,
            title: '测试打印',
            doctype: '<!doctype html>'
        };
        // Merge with user-options
        options = $.extend({}, defaults, (options || {}));
        var $styles = $("");
        if (options.mediaPrint) {
            // Apply the media-print stylesheet
            $styles = $("link[media=print]");
        }
        // 生成被选元素的副本
        var copy = $this.clone();
        copy = $("<span/>").append(copy);
        copy.append($styles.clone());
        //更新标题
        if (options.title) {
            var title = $("title", copy);
            if (title.length === 0) {
                title = $("<title />");
                copy.append(title);                
            }
            title.text(options.title);            
        }
        //元素内容
        var content = copy.html();
        try {
            options.deferred.notify('generated_markup', content, copy);
        } catch (err) {
            console.warn('Error notifying deferred', err);
        }
        copy.remove();
        if (options.iframe) {
            // Use an iframe for printing
            try {
                printContentInIFrame(content, options);
            } catch (e) {
                // Use the pop-up method if iframe fails for some reason
                console.error("Failed to print from iframe", e.stack, e.message);
                printContentInNewWindow(content, options);
            }
        } else {
            // Use a new window for printing
            printContentInNewWindow(content, options);
        }
        return this;
    };
})(jQuery);
