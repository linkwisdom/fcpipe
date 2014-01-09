exports.port = 8000;

exports.router = {
    'static-host': '127.0.0.1',
    'fctest.baidu.com': '10.94.23.61',
    'fc-offline.baidu.com': '10.48.236.52',
    'fengchao.baidu.com': '10.81.35.167'
};

exports.proxyList = [
    // 主页内容一定要改的
    {
        path : 'main.html',
        handler: getFile('main.html')
    },
    // 请求dep文件
    {
        path: /^\/nirvana\/((dep)|(src))/,
        handler: proxyStatic({
            host: 'static-host',
            replace: ['nirvana/', 'nirvana-workspace/nirvana/'],
            port: 8848
        })
    },
    // library路径
    {
        path: /^\/library/,
        handler: proxyStatic({
            host: 'static-host',
            port: 8848
        })
    },
    // debug 文件导向调试模块吧
    {
        path: 'debug/debug.js',
        handler: function(context) {
            context.content = '';
        }
    },
    // 在服务端打印日志
    {
        path: 'log/fclogimg.gif',
        handler: logData(function(data) {
            // 如果要做日志监控，在这里输出内容
            // console.log(data);
        })
    },
    // 其它事情都让后端去做吧
    {
        path: '/',
        handler: proxyRequest({
            host: 'dynamic-host',
            port: 8000
        })
    }
];