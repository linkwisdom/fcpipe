/**
 * @author Lianodng Liu
 *
 * 凤巢业务前端mock联调程序
 * @date 2013年12月29日 17:25:14
 */

var httpProxy = require('http-proxy');
var http = require('http');

var DEFAULT_CONF_FILE = 'fcpipe-config.js';
var defaultConfig = require('./fcpipe-config.js');

global.pipe = require('./extends.js');

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

        if (!pass) {
            return;
        }

        config.host = item.host;
        config.port = item.port;
        config.url = url;

        if (rqhost == 'localhost') {
            rqhost = 'fc-offline.baidu.com';
        }

        if (item.replace) {
            config.url = config.url.replace(item.replace[0], item.replace[1]);
        }

        if (item.nostamp) {
            config.url = config.url.replace(/_\d+/g, '');
        }

        if (item.host == 'dynamic-host') {
            item.host = rqhost;
        }

        if (item.host in router) {
            config.host = router[item.host];
            if (item.host != 'static-host') {
                config.qhost = item.host + ':' + item.port;
            }
        }

        if (item.handler) {
            config = item.handler(config);
            if (!config && config.url) {
                return;
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
    var dirname = __dirname;

    var pipeConfig = loadConf(DEFAULT_CONF_FILE);

    if (pipeConfig && pipeConfig.proxyList) {
        exports.proxyList = pipeConfig.proxyList;
    }

    if (pipeConfig && pipeConfig.router) {
        exports.router = pipeConfig.router;
    }

    if (pipeConfig && pipeConfig.port) {
        exports.port = pipeConfig.port;
    }
    
    console.log('pipe on port :' + port);

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


/**
 * 加载配置文件
 */
function loadConf( confFile ) {
    var fs = require( 'fs' );
    var path = require( 'path' );
    var cwd = process.cwd();

    if (confFile) {
        confFile = path.resolve(cwd, confFile);
        if (fs.existsSync(confFile)) {
            return require(confFile);
        }
    }
    
    var dir;
    var parentDir = cwd;
    do {
        dir = parentDir;
        confFile = path.resolve( dir, DEFAULT_CONF_FILE );
        if ( fs.existsSync( confFile ) ) {
            return require( confFile );
        }

        parentDir = path.resolve( dir, '..' );
    } while ( parentDir != dir );

    // 如果寻址不到，使用默认配置
    return defaultConfig;
}

// test hold
var argv = process.argv;
if (argv[1] == __filename) {
    var port = exports.port || 8000;

    if( argv.length > 2) {
        port = argv[2]
    }

    exports.start(port);
}