#!/usr/bin/env node

var pipe = require('./pipe');
var cli = {};
exports.cli = cli;

cli.command = 'pipe';
cli.options = ['id:', 'type:'];
cli.description = '运行mock服务';
cli.usage = 'edp pipe <dir>';

cli.main = function ( args, opts ) {
     pipe.start(+args[1]);
};