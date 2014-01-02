exports.port = 8123;

exports.router = {
    "static-host": "127.0.0.1",
    "fctest.baidu.com": "10.26.58.12",
    "fc-offline.baidu.com": "10.48.236.52",
    "fengchao.baidu.com": "10.81.35.167"
};

exports.proxyList = [
    {
        "path": /\/nirvana\/asset\/.*\.js/gi,
        "replace": ["/nirvana/asset", "/nirvana-workspace/nirvana/src"],
        "nostamp": true,
        "host": "static-host",
        "port": 8848
    },
    {
        "path": "/nirvana/log/fclogimg.gif",
        "replace": ["/nirvana/log/fclogimg.gif"
            , "/nirvana-workspace/nirvana/src/common/img/favicon.ico"],
        "nostamp": true,
        "host": "static-host",
        "port": 8848
    },
    {
        "path": "/nirvana/src/common/img/",
        "replace": ["/nirvana/src/", "/nirvana/asset/"],
        "host": "dynamic-host",
        "port": 8000
    },
    {
        "path": "/nirvana/src/common/swf/",
        "replace": ["/nirvana/src/", "/nirvana/asset/"],
        "host": "dynamic-host",
        "port": 8000
    },
    {
        "path": "/",
        "host": "dynamic-host",
        "port": 8000
    }
];