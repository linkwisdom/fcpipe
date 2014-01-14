exports.port = 8000;

exports.router = {
    'static-host': '127.0.0.1',
    // 'static-host': 'dev.liandong.org'
    'fctest.baidu.com': '10.94.23.61',
    'fc-offline.baidu.com': '10.48.236.52',
    'fengchao.baidu.com':  '10.81.35.167'
};

// 静态代理规则
// exports.proxyRules = [];

// 动态代理规则, modType应该是历史依赖的
var modType = 'dev';
exports.getRules = function(request) {
    var rules = require('./fengchao-rules');
    if (request.url.indexOf('nirvana/main.html') > -1 ) {
        var req = require('url').parse(request.url, true);
        var query = req.query;
        
        if (query.mod && query.mod == 'debug') {
            modType = 'debug';

        } else if (query.mod) {
            // 支持其它mod, 但是需要规则配置
            modType = query.mod;

        } else if ( req.pathname != '/nirvana/main.html') {
            modType = 'dev';
        } else if (req.pathname == '/nirvana/main.html'){
            modType = 'backend';
        }
    }

    // 其它请求还是必须依赖历史
    if (modType in rules) {
        return rules[modType];
    } else {
        return [];
    }
};