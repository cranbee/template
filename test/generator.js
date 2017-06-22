let FS = require('fs');
let Test = require('tape');
let Scanner = require('../lib/Scanner.js');
let Parser = require('../lib/Parser.js');
let Packer = require('../lib/Packer.js');

// () => void
function main() {
    let source = FS.readFileSync(`${__dirname}/test.html`, 'utf-8');
    let tokens = Scanner.scan(source);
    writeSample('tokens', tokens);
    let ast = Parser.parse(tokens);
    writeSample('ast', ast);
    let packet = Packer.pack(ast);
    writeSample('packet', packet);
}

// (string, object | array) => void
function writeSample(name, obj) {
    let json = JSON.stringify(obj, null, 2);
    FS.writeFileSync(`${__dirname}/samples/${name}.json`, json + '\n');
    console.log(`${name}.json was generated`);
}

main();
