/**
 * @author Lianodng Liu
 *
 * 凤巢业务前端mock联调程序
 * @date 2013年12月29日 17:25:14
 */

var httpProxy = require('http-proxy');
var http = require('http');

exports.proxyList = require('./config');
exports.router = require('./router');

// 根据请求url动态解析代理参数
function proxyPass(url, rqhost) {
    var proxyList = exports.proxyList;
    var router = exports.router;

    var config = {
        host: 'fc-offline.baidu.com',
        port: 8000
    };

    var pass = false;

    proxyList.forEach(function(item, idx) {
        if (pass) {
            return;
        } 

        var path = item.path;
        pass = (('string' != typeof path) && url.match(path))
            || (('string' == typeof path) && url.indexOf(path) > -1);

        if (pass) {
            config.host = item.host;
            config.port = item.port;
            config.url = url;
        }

        if (pass && item.replace) {
            config.url = config.url.replace(item.replace[0], item.replace[1]);
        }

        if (pass && item.nostamp) {
            config.url = config.url.replace(/_\d+/g, '');
            console.log(idx, config.url);
        }

        if (item.host == 'dynamic-host' && rqhost) {
            item.host = rqhost;
        }

        if (item.host in router) {
            config.host = router[item.host];
            if (item.host != 'static-host') {
                config.qhost = item.host + ':' + item.port;
            }
        }
    });

    return config;
}

var proxy = new httpProxy.RoutingProxy();

/**
 * 安装方法
 * npm install fcpipe
 * 
 * 使用方法
 * 1. 绑定客户端host 
 *     127.0.0.1 fc-offline.baidu.com
 * 2. 启动代理服务器
 *    fcpipe start
 *    或者基于源码
 *    node pipe.js
 */
exports.start = function(port) {
    http.createServer(function(request, response) {
        var headers = request.headers;
        var rqhost = headers.host && headers.host.replace(/:\d+/, '');
        var proxyConfig = proxyPass(request.url, rqhost);

        // 伪造host
        if (proxyConfig.qhost) {
            var headers = request.headers;
            headers.host = proxyConfig.qhost;
        }

        // 修改url
        if (proxyConfig.url) {
            request.url = proxyConfig.url;
        }

        // 处理代理请求
        proxy.proxyRequest(request, response, proxyConfig);
    }).listen(port || 8000);
};

// test hold
var argv = process.argv;
if (argv.length > 2 && argv[1] == __filename) {
    var port = +argv[2];
    exports.start(port);
}