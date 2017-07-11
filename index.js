let Executor = require("./lib/executor.js");
let Packer = require("./lib/packer.js");
let Parser = require("./lib/parser.js");
let Scanner = require("./lib/scanner.js");

// string => array
function parse(text) {
    let tokens = Scanner.scan(text);
    return Parser.parse(tokens);
}

module.exports = {
    parse,
    pack: Packer.pack,
    unpack: Packer.unpack,
    execute: Executor.execute
};
