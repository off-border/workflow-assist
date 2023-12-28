import chalk from 'chalk';
export function msg(...args) {
    if (isTest()) {
        return;
    }
    console.log(chalk.cyan('\n', ...args));
}
function isTest() {
    return process.env.NODE_ENV === 'test';
}
export function info(...args) {
    console.log(chalk.cyan(...args));
}
export function error(...args) {
    console.log('\n', chalk.red(...args));
}
export function header(text) {
    msg(`\n=== ${text} ===\n`);
}
