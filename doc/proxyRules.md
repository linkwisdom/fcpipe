exports.port = 8000;

exports.router = {
    "static-host": "127.0.0.1",//10.46.178.37
    "fctest.baidu.com": "10.94.23.61",
    "fc-offline.baidu.com": "10.48.236.52",
    "fengchao.baidu.com": "10.81.35.167"
};

// 劫持Ajax请求
function getAjax(context, config) {
    var url = context.request.url;

    var flag = url.match(/GET\/nikon\/flashdata/g);
    if (flag > -1) {
        config.port = 8848;
        config.host = 'dev.liandong.org';
    }
    return config;
}

/**
 * # path [string/regular] 匹配路由规则，如果是正则表达式，匹配就执行；
 *     如果是字符串；只要是请求url的字串即可匹配；一旦匹配不解析后面的规则；
 * # replace url替换规则；复杂的替换规则使用函数方法去解析
 * # nostamp
 */
exports.proxyList = [
    // 指定路径规则配置代理路由
    {
        // 只开发ao
        "path": /\/nirvana\/asset\/aoPackage.*\.(js)|(less)/g,
        "replace": ["/nirvana/asset", "/nirvana-workspace/nirvana/src"],
        "nostamp": true,
        "host": "static-host",
        "port": 8848
    },
    // redirect 前端跳转
    {
        "path": 'log/redirect',
        "handler": redirect('http://dev.liandong.org:8848/dev/src/easyManage/CRMIntroduce.js')
    },
    // redirect 代理请求跳转
    {
        "path": 'log/bacK',
        "handler": redirect('http://dev.liandong.org:8848/dev/src/easyManage/CRMIntroduce.js', true)
    },
    // printJSON 按JSON格式输出内容
    {
        "path": 'log/json',
        "handler": printJSON({status: 300, data: [1, 2, 3]})
    },
    // 使用mockjson渲染json模板
    {
        "path": 'log/mockjson',
        "handler": mockJSON({status: 300, "area": "@AREA"}, {AREAL: ["CN", "EN", "US"]})
    },
    // 读取本地文件作为输出内容
    {
        "path": 'log/file',
        "handler": getFile('./fcpipe-config.js')
    },
    // 在服务端打印日志；但是请求返回空值
    {
        "path": 'log/fclogimg.gif',
        "handler": logData('log/fclogimg.gif')
    },
    // 所有未能处理的请求转为动态服务器解析
    {
        "path": "/",
        "replace": ["/nirvana/src", "/nirvana/asset"],
        "host": "dynamic-host",
        "port": 8000
    }
];