/**
 * @author Lianodng Liu
 *
 * 凤巢业务前端mock联调程序
 * @date 2013年12月29日 17:25:14
 */
var http = require('http');
var handler = require('./handler');

// 扩展功能, 每个扩展项作为全局函数使用
var extension = require('./extension');
for (var ext in extension) {
    global[ext] = extension[ext];
}

var DEFAULT_CONF_FILE = 'fcpipe-config.js';
var defaultConfig = require('./fcpipe-config');

/**
 * 启动服务
 * @param  {number} port        访问端口
 * @param  {object/string/null} proxyServer 前端代理
 */
exports.start = function (port, proxyServer) {
    var rules = [];

    // 直接 fcpipe 8080 www.baidu.com 实现代理
    if ('string' == typeof proxyServer) {
        var arr = proxyServer.split(':');
        proxyServer = {
            host: arr[0],
            port: +arr[1] || 8000
        };
    }

    exports.port = port;

    var pipeConfig = loadConf(DEFAULT_CONF_FILE);

    if (pipeConfig && pipeConfig.config) {
        exports.config = pipeConfig.config;
    }

    if (pipeConfig && pipeConfig.router) {
        exports.router = pipeConfig.router;
        handler.router = pipeConfig.router;
    }

    // 命令参数优先级最高
    if (!port && pipeConfig && pipeConfig.port) {
        exports.port = pipeConfig.port;
    }

    console.log('pipe on port :', exports.port);

    // process.port 为了其它端口统一
    process.port = exports.port;
    http.createServer( function (request, response) {
        // 直接被代理
        if (proxyServer) {
            proxyTo(request, response, proxyServer);
            return;
        }

        // 注意静态规则优先
        if (pipeConfig.proxyRules) {
            rules = pipeConfig.proxyRules;
        } else if (pipeConfig.getRules) {
            // 把动态代理规则集合的工作交给业务层去做
            rules = pipeConfig.getRules(request);
        }

        var context = {
            request: request,
            response: response
        };

        if (rules) {
            handler.handle(context, rules);
        } else {
            response.end();
        }
    }).listen(exports.port || 8000);
};


/**
 * 加载配置文件
 */
function loadConf( confFile ) {
    var fs = require( 'fs' );
    var path = require( 'path' );
    var cwd = process.cwd();
    var extConf = {};

    if (confFile) {
        confFile = path.resolve(cwd, confFile);
        if (fs.existsSync(confFile)) {
            extConf = require(confFile);
        }
    }
    
    var dir;
    var parentDir = cwd;
    do {
        dir = parentDir;
        confFile = path.resolve( dir, DEFAULT_CONF_FILE );
        if ( fs.existsSync( confFile ) ) {
            extConf = require( confFile );
        }

        parentDir = path.resolve( dir, '..' );
    } while ( parentDir != dir );

    // 支持扩展，而不是覆盖
    for (var item in defaultConfig) {
        if (! (item in extConf)) {
            extConf[item] = defaultConfig[item];
        }
    }

    // 如果寻址不到，使用默认配置
    return extConf;
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