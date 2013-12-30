
# fcpipe 使用说明

## 安装方法
 * npm 安装

    npm install fcpipe -g

 * github获取安装

    npm install git://github.com/linkwisdom/fcpipe.git -g


## 使用方法
 * 绑定客户端host (ip, domain) 为了防止cookie等权限因素；
 浏览器端必须绑定host到pipe服务器, 绑定方式可以改host文件，也可以使用proxy插件；或者自定义PAC文件(建议方式)
 * 访问不同的host会将请求转发到不同的机器; 如果fctest和fc-offline要重新绑定参考后面的router配置

    127.0.0.1 fc-offline.baidu.com

    127.0.0.1 fctest.baidu.com

    127.0.0.1 mock-host

 * 启动代理服务器, 需要全局安装`-g`

    fcpipe

 
 ## 原理

* 前向代理，按url解析将静态资源重定向到前端开发的edp服务器；权限验证和ajax服务重定向到BFE支持的fctest或fc-offline机器

## 自定义配置

    var pipe = require('fcpipe');

    pipe.router = {
        "static-host": "127.0.0.1",
        "fctest.baidu.com": "10.26.58.12",
        "fc-offline.baidu.com": "10.48.236.52"
    };

    pipe.proxyList = [
        {
            "path": "/nirvana/asset/aoPackage/",
            "replace": ["/nirvana/asset", "/nirvana-workspace/nirvana/src"],
            "nostamp": true,
            "host": "static-host",
            "port": 8848
        },
        {
            "path": "/nirvana/asset/easyManage/",
            "replace": ["/nirvana/asset", "/nirvana-workspace/nirvana/src"],
            "nostamp": true,
            "host": "static-host",
            "port": 8848
        },
        {
            "path": "/nirvana/asset/bizCommon/",
            "replace": ["/nirvana/asset", "/nirvana-workspace/nirvana/src"],
            "nostamp": true,
            "host": "static-host",
            "port": 8848
        },
        {
            "path": "/",
            "host": "dynamic-host",
            "port": 8000
        }
    ];

    pipe.start(8000);

** 如果默认配置不能满足你的需求，可以自定义代理; 如LESS处理,ajax转发等;***
