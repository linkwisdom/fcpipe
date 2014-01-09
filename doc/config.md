
## fcpipe 安装使用


    
第一步 安装

    npm install fcpipe -g
    
    // 如有需要 更新fcpipe
    npm update fcpipe- g

第二步 配置

    1. 进入项目目录
        cd ~/../workspace/fc-ue/
        
    2. 创建配置文件fcpipe-config.js
        touch fcpipe-config.js
        
    3. 配置，参考 `自定义配置文件`

第三步 启动服务

    1. 启动本地edp服务
    
        确认访问路径 http://127.0.0.1:8848/nirvana-workspace/nirvana/main.html
          
        如果路径或端口不一致在配置文件中修改
    
    2. 首先进入你的项目目录
        cd ~/../workspace/fc-ue/
    
    // 启动
    fcpipe
    
    // 如果目标服务器端口不是8000, 需要指定端口，或在配置文件中指定
    
    fcpipe 8080
    
    3. 验证
    
    // 如访问的是fctest.baidu.com
    
    浏览器访问 http://fctest.baidu.com:8000/nirvana/main.hmtl
    
    如果失败，检查以下配置
    
    - fctest.baidu.com绑定到127.0.0.1
    - fcpipe-config.js 中的router指定的ip和端口是否正确
    - fctest.badu.com是否在8000或指定端口正常启动
    - url路径是nirvana/main.html
    

## 自定义配置文件说明


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

## 其它补充

- fcpipe-config.js 位置目录必须是启动fcpipe的当前目录或父级目录
- 