(function ($) {
    layer.config({
        extend: 'extend/layer.ext.js'
    });
    var _ajax = $.ajax;
    $.ajax = function (opt) {
        var index, _opt = {};
        var _beforeSend = opt.beforeSend;
        _opt = $.extend(opt, {
            beforeSend: function (xhr, setting) {
                if (typeof _beforeSend === 'function' && _beforeSend) {
                    _beforeSend(xhr, setting);
                }

                index = layer.load(1, {
                    shade: [0.1, '#fff']
                });
            }
        });

        var _complete = opt.complete;
        _opt = $.extend(opt, {
            complete: function (XHR, TS) {
                if (typeof _complete === 'function' && _complete) {
                    _complete(XHR, TS);
                }
                layer.close(index);
            }
        });
        $.extend(opt, _opt);
        return _ajax(opt);
    };
})(jQuery);
