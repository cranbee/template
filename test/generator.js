let Data = require('./data.js');
let Executor = require('../lib/executor.js');
let FS = require('fs');
let Packer = require('../lib/packer.js');
let Parser = require('../lib/parser.js');
let Scanner = require('../lib/scanner.js');

// () => void
function main() {
    let source = FS.readFileSync(`${__dirname}/template.html`, 'utf-8');
    let tokens = Scanner.scan(source);
    writeSample('tokens', tokens);
    let nodes = Parser.parse(tokens);
    writeSample('nodes', nodes);
    let packet = Packer.pack(nodes);
    writeSample('packet', packet);
    let result = Executor.execute(nodes, Data.get());
    writeSample('result', result);
}

// (string, object | array) => void
function writeSample(name, obj) {
    let json = JSON.stringify(obj, null, 2);
    FS.writeFileSync(`${__dirname}/samples/${name}.json`, json + '\n');
    console.log(`${name}.json was generated`);
}

main();
