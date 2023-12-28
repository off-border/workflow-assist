import { execSync } from 'child_process';
import { info, error } from './msg.js';
export function bash(cmd, { silent = false, cwd = process.cwd() } = {}) {
    if (!silent) {
        info(cmd);
    }
    try {
        const output = execSync(cmd, { encoding: 'utf-8', cwd, });
        if (!silent) {
            console.log(output);
        }
        return output;
    }
    catch (e) {
        error(e.message);
        console.log(e.stdout);
    }
}
