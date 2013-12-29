
# fcpipe 使用说明

## 安装方法
 * npm 安装

    npm install fcpipe -g

 * github获取安装

    npm install git://github.com/linkwisdom/fcpipe.git -g


## 使用方法
 * 绑定客户端host (ip, domain) 为了防止cookie等权限因素；
 浏览器端必须绑定host到pipe服务器, 绑定方式可以改host文件，也可以使用proxy插件；或者自定义PAC文件(建议方式)

      127.0.0.1 fc-offline.baidu.com

 * 启动代理服务器

    fcpipe

    或者基于源码

    node pipe.js
 