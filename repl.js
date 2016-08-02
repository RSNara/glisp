const GLisp = require('./lib');
const readline = require('readline');
const chalk = require('chalk');
const env = Object.create(GLisp.RootEnv);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

main();

function main() {
  return read().then(evaluate).then(print).then(main);
}

function read() {
  return ask(chalk.bold('> '));
}

function evaluate(input) {
  return GLisp.evaluate(env, GLisp.parse(input));
}

function print(output) {
  console.log(chalk.gray('; ') + chalk.green(serialize(output)));
}

function serialize(object) {
  return object && object.toString && object.toString() || String(object);
}

function ask(question) {
  return new Promise((fulfill) => {
    rl.question(question, fulfill);
  });
}
