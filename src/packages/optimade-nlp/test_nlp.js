#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const stringify = require('json-stable-stringify');

const nlp = require('./index');

const guesser = nlp();

const test_path = path.join(__dirname, './test_nlp.json');
const tdata = JSON.parse(fs.readFileSync(test_path, 'utf8'));

for (let i = 0; i < tdata.length; i++){
    const sample = tdata[i][0],
        result = guesser.guess(sample),
        cmp = tdata[i][1];

    delete result.ignored;

    if (stringify(result) !== stringify(cmp)){
        console.error("*" + sample + "* got " + stringify(result) + " != expected " + stringify(cmp));
    }
    //else console.log('>>>filter=' + guesser.to_optimade(result));
}
