global.nextRule = function(context) {
    context._next = true;
};

function passRule(item, context, router) {
    var request = context.request;
    var response = context.response;
    var url = request.url;
    var pass = true;

    var path = item.path;

    if (path && ('string' == typeof path)) {
        pass = pass && (url.indexOf(path) > -1);
    } else if (path) {
        pass = pass && url.match(path);
    }

    // 如果不匹配当前规则，转到下条规则
    if (!pass) {
        return false;
    }
    /**
     * 使用content处理；比如读取本地文件作为返回内容
     * 直接返回固定内容
     */
    if (item.handler && 'function' == typeof item.handler) {
        var rst = item.handler(context, exports.router);

        // 如果context需要继续解析，context._next被设置为true
        if (context._next) {
            return false;

        // 如果content内容设置了，则直接输出内容
        } else if ('undefined' !== typeof context.content) {
            response.end(context.content);

        // 如果不返回任何内容，需要结束当前请求
        } else if (!rst) {
            response.end();
        }
        
        // 当前规则处理完毕
        return true;
    }

    response.end();
    return true;
}

// 根据请求url动态解析代理参数
function proxyPass(context, proxyList) {
    for (var i = 0; i < proxyList.length; i++) {
        var pass = passRule(proxyList[i], context);
        if (pass !== false) {
            return;
        }
    };
}

exports.handle = function(context, proxyList) {
    proxyPass(context, proxyList);
};