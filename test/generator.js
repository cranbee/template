let FS = require('fs');
let Test = require('tape');
let Scanner = require('../lib/Scanner.js');
let Parser = require('../lib/Parser.js');
let Packer = require('../lib/Packer.js');

// () => void
function main() {
    let source = FS.readFileSync(`${__dirname}/template.html`, 'utf-8');
    let tokens = Scanner.scan(source);
    writeSample('tokens', tokens);
    let nodes = Parser.parse(tokens);
    writeSample('nodes', nodes);
    let packet = Packer.pack(nodes);
    writeSample('packet', packet);
}

// (string, object | array) => void
function writeSample(name, obj) {
    let json = JSON.stringify(obj, null, 2);
    FS.writeFileSync(`${__dirname}/samples/${name}.json`, json + '\n');
    console.log(`${name}.json was generated`);
}

main();
