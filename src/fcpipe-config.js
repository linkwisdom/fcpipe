exports.port = 8000;
exports.mod = 'backend';

exports.router = {
    'static-host': '127.0.0.1',
    'fctest.baidu.com': '10.94.23.61',
    'fc-offline.baidu.com': '10.48.236.52',
    'fengchao.baidu.com': '10.81.35.167'
};

// 静态代理规则
// exports.proxyRules = [];


// 动态代理规则, modType应该是历史依赖的
var modType = 'dev';
exports.getRules = function(request) {
    var rules = require('./fengchao-rules');
    if (request.url.indexOf('nirvana/main.html') > -1 ) {
        if (request.url.indexOf('mod=debug') > -1) {
            modType = 'debug';
        } else if (request.url.indexOf('mod=dev') > -1
            || request.url.indexOf('workspace') > -1
        ) {
            modType = 'dev';
        } else {
            modType = 'backend';
        }
    }

    if (modType in rules) {
        return rules[modType];
    } else {
        return [];
    }
};