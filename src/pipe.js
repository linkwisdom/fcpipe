/**
 * @author Lianodng Liu
 *
 * 凤巢业务前端mock联调程序
 * @date 2013年12月29日 17:25:14
 */
var http = require('http');
var extension = require('./extension');

for (var ext in extension) {
    global[ext] = extension[ext];
}

var DEFAULT_CONF_FILE = 'fcpipe-config.js';
var defaultConfig = require('./fcpipe-config.js');
exports.defaultHost = 'fc-offline.baidu.com';

function passRule(item, context) {
    var request = context.request;
    var response = context.response;
    var url = request.url;
    var pass = false;

    var path = item.path;
    pass = (('string' != typeof path) && url.match(path))
        || (('string' == typeof path) && url.indexOf(path) > -1);

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
        if ('undefined' !== typeof context.content) {
            response.end(context.content);
        } else if (!rst) {
            response.end();
        }
        return true;
    }

    response.end();
    return true;
}

// 根据请求url动态解析代理参数
function proxyPass(context) {
    var proxyList = exports.proxyList;
    for (var i = 0; i < proxyList.length; i++) {
        var pass = passRule(proxyList[i], context);
        if (pass !== false) {
            return;
        }
    };
}


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
exports.start = function(port, staticHost) {
    exports.port = port;
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

    // 指定静态服务器
    if (staticHost) {
        pipeConfig.router['static-host'] = staticHost;
    }
    
    console.log('pipe on port :' + exports.port);

    http.createServer(function(request, response) {
        var headers = request.headers;

        var context = {
            request: request,
            response: response
        };

        proxyPass(context);

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
    exports.port = exports.port || 8000;

    if ( argv.length > 2) {
        exports.start(+argv[2]);
        return;
    }
    exports.start(exports.port);
}