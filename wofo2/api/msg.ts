import chalk from 'chalk';

export function msg(...args: unknown[]) {
    if (isTest()) {
        return;
    }
    console.log(chalk.cyan('\n', ...args));
}

function isTest() {
    return process.env.NODE_ENV === 'test';
}

export function info(...args: unknown[]) {
    console.log(chalk.cyan(...args));
}

export function bashCommand(cmd: string) {
    console.log(chalk.bold.grey(cmd));
}

export function bashOutput(output: string) {
    console.log(chalk.white(output));
}


export function error(...args: unknown[]) {
    console.log('\n' + chalk.red(...args));
}

export function header(text: string) {
    msg(`\n=== ${text} ===\n`);
}
