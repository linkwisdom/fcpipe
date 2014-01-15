## 自定义配置文件说明
- fcpipe-config.js 是默认的配置文件名；位置目录必须是启动fcpipe的当前目录或父级目录
- 自定义配置项包括
 * port 端口 

    port 端口指定fcpipe监听及本地占用端口；对fc权限要求port端口一致(8000,或8080)

 * router 路由表
 
   router 主要是为了指定静态资源host及后端请求host;
 
<pre>

    exports.router = {
        'static-host': '127.0.0.1', // static-host用于指定静态资源访问机器
        'fctest.baidu.com': '10.94.23.61', // 动态资源根据来源host动态解析
        'fc-offline.baidu.com': '10.48.236.52',
        'fengchao.baidu.com':  '10.81.35.167'
    };

</pre>

 * 静态规则proxyRules 或动态规则getRules函数


### 配置样例

    // fcpipe占用的端口, 一般要求与fc服务端口一致
    exports.port = 8080;

    // 动态规则使用getRules获取
    // exports.getRules = function(context) {}

    // 采用的是静态路由规则
    exports.proxyRules = [
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
