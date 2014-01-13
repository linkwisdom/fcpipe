#!/usr/bin/env node

var pipe = require('./pipe');
var cli = {};
exports.cli = cli;

cli.command = 'fcpipe';
cli.options = ['id:', 'type:'];
cli.description = '运行fcpipe服务';
cli.usage = 'edp fcpipe [port]';

cli.main = function(args, opts) {
    console.log(args);
    if (args.length > 0) {
        pipe.start(+args[0]);
    } else {
        pipe.start(8000);
    }
};