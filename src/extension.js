var httpProxy = require('http-proxy');
var proxy = new httpProxy.RoutingProxy();

exports.defaultHost = 'fc-offline.baidu.com';

/**
 * 代理静态资源
 * @param  {object} option 代理配置
 *    replace: [source, target] 对url进行替换
 *    host: 请求域名/ip; 如果是router指定的解析；采用router中的ip替换
 *    port: 代理端口
 */
exports.proxyStatic = function(option) {

    /**
     * 代理处理函数
     * @param  {Object} context 请求上下文
     * @param  {Object} router  指定路由表
     * @return {boolean} {true: 表示resonse转移或关闭}
     */
    return function(context, router) {
        var request = context.request;
        var response = context.response;

        // url替换规则
        if (option.replace) {
            request.url = request.url.replace(option.replace[0], option.replace[1]);
        }

        if (option.host in router) {
            option.host = router[option.host];
        }

        if (option.port && option.host) {
            var config = {
                host: option.host,
                port: option.port
            };
            proxy.proxyRequest(request, response, config);
            return true;
        }
    };
};

/**
 * 代理服务端资源或请求
 * @param  {object} option 代理配置
 *    replace: [source, target] 对url进行替换
 *    host: 请求域名/ip; 如果是router指定的解析；采用router中的ip替换
 *    port: 代理端口
 */
exports.proxyRequest = function(option) {
    return function(context, router) {
        var request = context.request;
        var response = context.response;
        var headers = request.headers;
        var rqhost = headers.host && headers.host.replace(/:\d+/, '');

        var url = request.url;

        // 如果请求domain不在列表中，强制转为最后一种
        if (!(rqhost in router)) {
            rqhost = exports.defaultHost;
        }

        // url替换规则
        if (option.replace) {
            request.url = request.url.replace(option.replace[0], option.replace[1]);
        }

        // 如果是远程host修改为请求host
        if (option.host == 'dynamic-host') {
            var headers = request.headers;
            headers.host = rqhost + ':' + option.port;
            option.host = rqhost;
        }

        if (option.host in router) {
            option.host = router[option.host];
        }
        
        if (option.port && option.host) {
            var config = {
                host: option.host,
                port: option.port
            };
            proxy.proxyRequest(request, response, config);
            return true;
        }
    };
};

/**
 * 代理静态资源
 * @param  {String} targetURL 目标url
 * @param {boolean} backend 是否服务端跳转
 */
exports.redirect = function(targetURL, backend) {
    return function(context, config) {
        var response = context.response;
        var request = context.request;

        // 服务端代理
        if (backend) {
            var query = require('url').parse(targetURL);
            var config = {
                host: query.hostname,
                port: query.port || 80
            };
            request.url = query.path;
            proxy.proxyRequest(request, response, config);
            return true;
        }
        response.writeHead(302, {
            Location: targetURL
        });
        return true;
        // do not response.end()
    }
};

/**
 * 输出json内容
 * @param  {Object} data 输出对象
 */
exports.printJSON = function(data) {
    return function(context) {
        var response = context.response;
        response.write(JSON.stringify(data, '\t', 3));
    }
};

/**
 * 从本地换取文件
 * - 如果文件不存在，会请求src/files下的默认文件
 * @param  {string} filePath 文件路径
 */
exports.getFile = function(filePath) {
    var fs = require('fs');
    return function(context) {
        var response = context.response;
        var request = context.request;

        var fs = require( 'fs' );
        var path = require( 'path' );
        var cwd = process.cwd();

        if (filePath) {
            var fp = path.resolve(cwd, filePath);

            if (fs.existsSync(fp)) {
                var bf = fs.readFileSync(fp);
                response.write(bf.toString());
                return;
            } else {
                cwd = path.resolve(__dirname, 'files');
                fp = path.resolve(cwd, filePath);

                if (fs.existsSync(fp)) {
                    
                    var bf = fs.readFileSync(fp);
                    response.write(bf.toString());
                }
            }
        }
        response.end('');
    }
};

exports.mockJSON = function(template, pkgData) {
    var mock = require('mockjson');
    return function(context) {
        mock.context = context;
        var data = mock.generate(template);
        context.content = JSON.stringify(data, '\t', 3);
    }
}

exports.logData = function(callback) {
    return function(context) {
        var response = context.response;
        var request = context.request;
        
        if (request.method == 'POST') {
            var buffer = [];
            request.on('data', function(chunk) {
                buffer.push(chunk);
                
            });

            request.on('end', function(chunk) {
                buffer.push(chunk);
                var str = buffer.join('').toString();
                callback && callback(str);
                response.write(str);
            });
        }
        response.end();
        return true;
    }
};


exports.mockAjax = function(option) {
    // var mockAjax = require('mockAjax');
    // var mocklib = require(option.mockDir);

    // return function(context, router) {
    //     var response = context.response;
    //     var request = context.request;
    //     var path = /path=([\w\/]+)/.exec(request.url).pop();
    //     response.end();
    //     return true;
    // }
}