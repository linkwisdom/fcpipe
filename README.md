# fcpipe 使用说明

## 安装方法
 * npm 安装

    npm install fcpipe -g

 * github获取安装

    npm install git://github.com/linkwisdom/fcpipe.git -g

 * 更新版本

   npm update fcpipe -g

## 使用方法
 * 绑定客户端host (ip, domain) 为了防止cookie等权限因素；
 浏览器端必须绑定host到pipe服务器, 绑定方式可以改host文件，也可以使用proxy插件；或者自定义PAC文件(建议方式)
 * 访问不同的host会将请求转发到不同的机器; 如果fctest和fc-offline要重新绑定参考后面的router配置

    127.0.0.1 fc-offline.baidu.com

    127.0.0.1 fctest.baidu.com

    127.0.0.1 mock-host

 * 启动代理服务器, 默认8000端口

    fcpipe [port]

 
 ## 原理

* 前向代理，按url解析将静态资源重定向到前端开发的edp服务器；权限验证和ajax服务重定向到BFE支持的fctest或fc-offline机器

## 自定义配置
- 如果默认配置无法满足需求，建议创建自定义配置文件
- 在当前启动目录或父级目录下建立fcpipe-config.js文件, 配置如下程序
- 各个配置项目如果没有配置会用默认配置替代

<code>
    
    exports.port = 8000;
    exports.router = {
        "static-host": "127.0.0.1",
        "fctest.baidu.com": "10.94.23.61",
        "fc-offline.baidu.com": "10.48.236.52",
        "fengchao.baidu.com": "10.81.35.167"
    };
    
    exports.proxyList = [
        {
            "path": /\/nirvana\/asset\/aoPackage.*\.js/g,
            "replace": ["/nirvana/asset", "/nirvana-workspace/nirvana/src"],
            "nostamp": true,
            "host": "static-host",
            "port": 8848
        },
        
        {
            "path": /\/nirvana\/asset\/aoPackage.*tpl\.html/g,
            "replace": ["/nirvana/asset", "/nirvana-workspace/nirvana/src"],
            "handler": pipe.getHtml(),
            "host": "static-host",
            "port": 8848
        },
        {
            "path": "/",
            "host": "dynamic-host",
            "port": 8000
        }
    ];

</code>
