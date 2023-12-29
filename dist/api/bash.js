import { execSync } from 'child_process';
import { error, bashCommand, bashOutput } from './msg.js';
export function bash(cmd, { silent = false, dryRun = false, cwd = process.cwd(), allowThrow = false } = {}) {
    if (!silent) {
        bashCommand(cmd);
    }
    if (dryRun) {
        return '';
    }
    try {
        const output = execSync(cmd, { encoding: 'utf-8', cwd });
        if (!silent) {
            bashOutput(output);
        }
        return output;
    }
    catch (e) {
        error(e.message);
        // console.log(e.stdout);
        if (allowThrow) {
            throw e;
        }
        return e.stdout;
    }
}
