# fcpipe 使用说明

## 第一步 安装

    npm install fcpipe -g
    
    // 如有需要 更新fcpipe
    npm update fcpipe- g

## 第二步 配置

    - 如果默认配置满足需求可以跳过配置步骤
    - 参考后面的配置说明
    - 必须绑定host; 

    127.0.0.1 fctest.baidu.com
    127.0.0.1 fc-offline.baidu.com

> 务必记住这一步!

## 第三步 启动服务

    1. 启动本地edp服务
        edp ws start
        
    确认访问路径 http://127.0.0.1:8848/nirvana-workspace/nirvana/main.html
        如果路径或端口不一致在配置文件中修改
        
    2. 启动fcpipe
       fcpipe

 
## 第四步 验证

    1. 访问本地开发环境
    http://fctest.baidu.com:8000/nirvana-workspace/nirvana/main.html
    如果能够正常访问，说明fcpipe安装并启动成功
     
    2. 访问后端服务器环境
       http://fctest.baidu.com:8000/nirvana/main.html?userid=241458
       检查后端服务器是否正常访问
     
    3. 访问联调模式
       http://fctest.baidu.com:8000/nirvana/main.html?userid=241458&mod=debug
     
    访问联调模式与后端服务器的唯一区别就是在url的search部分加上`&mod=debug`
    注意；为了保证登录正常；每次访问前最好先走后端服务器环境；直接走联调方式可能会遇到权限验证失败问题!


## 自定义配置文件说明

### 默认配置

- 静态资源地址`http://localhost:8848/nirvana-workspace/nirvana/main.html`可访问， 保证host,port和url都一致
- 目标请求服务器的域名必须是`fctest/fc-offline/fengchao`等几个域名；端口默认是`8000`；部分RD的机器端口是8080时需要再单独设置

### 自定义配置

- 自定义配置文件名为`fcpipe-config.js`; 存放路径必须是当前命令执行目录的位置或父级目录
- 请参考 `src/fcpipe-config.js` 进行自定义配置
- 文件`src/extension` 定义了多种请求处理方法，你也可以在fcpipe-config.js中写自己的extension方法
- 新增加自定义ajax请求转发功能；可以在联调模式中将特定path请求转发到本地机器或其它数据服务器


```js
    // @file fcpipe-config.js
    // 建议只填写有必要的配置项
    
    exports.port =  8000;
    
    // 自定义host映射关系
    exports.router = {
        'static-host': '127.0.0.1',
        'fctest.baidu.com': '10.94.23.61',
        'fc-offline.baidu.com': '10.48.236.52',
        'fengchao.baidu.com':  '10.81.35.167'
    };
    
    // 如果需要转发mockservice; 按如下方式配置
    var staticConfig = {
        host: '127.0.0.1',
        port: 8848
    };
    // ajax 转发规则, 可将不同接口转发到不同机器
    exports.ajaxRules = {
        'GET/nikon/packagestatus': staticConfig,
        'GET/profile/coupon': staticConfig,
        'GET/nikon/introduction': staticConfig
    };
```

工作原理
[fcpipe-原理](https://drive.google.com/file/d/0B03a7K1erUTpN1A2SVNQZVNUeFE/edit?usp=sharing)
