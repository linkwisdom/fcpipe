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
        "path": "/",
        "host": "dynamic-host",
        "port": 8000
    }
];