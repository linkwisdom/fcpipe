var pipe = require('./pipe');
var argv = process.argv;

if (argv.length > 1 && argv[1] == __filename) {
    pipe.start(8177);
}