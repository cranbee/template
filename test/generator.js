let Data = require('./data.js');
let FS = require('fs');
let Template = require('../index.js');

// () => void
function main() {
    let source = FS.readFileSync(`${__dirname}/template.html`, 'utf-8');
    let tokens = Template.scan(source);
    writeSample('tokens', tokens);
    let nodes = Template.parse(tokens);
    writeSample('nodes', nodes);
    let packet = Template.pack(nodes);
    writeSample('packet', packet);
    let result = Template.execute(nodes, Data.get());
    writeSample('result', result);
}

// (string, object | array) => void
function writeSample(name, obj) {
    let json = JSON.stringify(obj, null, 2);
    FS.writeFileSync(`${__dirname}/samples/${name}.json`, json + '\n');
    console.log(`${name}.json was generated`);
}

main();
