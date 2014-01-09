# fcpipe 使用说明


## fcpipe 安装使用


    
第一步 安装

    npm install fcpipe -g
    
    // 如有需要 更新fcpipe
    npm update fcpipe- g

第二步 配置

    - 如果默认配置满足需求可以跳过配置步骤

    - 参考后面的配置说明

第三步 启动服务

    1. 启动本地edp服务
    
        确认访问路径 http://127.0.0.1:8848/nirvana-workspace/nirvana/main.html
          
        如果路径或端口不一致在配置文件中修改
    
    2. 首先进入你的项目目录
        cd ~/../workspace/fc-ue/
    
    2. 打开命令行输入fcpipe命令即可

       fcpipe

第四步 验证
    
* 如访问的是 `fctest.baidu.com`
    
    浏览器访问 http://fctest.baidu.com:8000/nirvana/main.hmtl, 如果能够正常加载所有资源、并正常显示，配置成功了！

* 注意

- 所有前端source加载的都是你本地的源码
- main.html被替换为默认页面，你也自定义main.html


* 失败原因  
    
#### 如果失败，检查以下配置
    
- fctest.baidu.com绑定到127.0.0.1
- fcpipe-config.js 中的router指定的ip和端口是否正确
- fctest.badu.com是否在8000或指定端口正常启动
- url路径是nirvana/main.html
    

## 自定义配置文件说明

#### 默认配置
- 静态资源地址http://localhost:8848/nirvana-workspace/nirvana/main.html可访问， 保证host,port和url都一致
- 目标请求服务器的域名必须是fctest/fc-offline/fengchao等几个域名；端口默认是8000；部分RD的机器端口是8080时需要再单独设置

#### 自定义配置
- 自定义配置文件名为fcpipe-config.js; 存放路径必须是当前命令执行目录的位置或父级目录
- 请参考 src/fcpipe-config.js 进行自定义配置
- src/extension 定义了多种请求处理方法，你也可以在fcpipe-config.js中写自己的extension方法