#!/usr/bin/env node

const nlp = require('./index');

const guesser = nlp();

const input = process.argv.slice(2).join(' ');

const result = guesser.guess(input);

console.log(result);
console.log(guesser.to_optimade(result));
