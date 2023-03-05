import { execSync } from 'child_process';
import { msg } from './msg.js';

export function bash(cmd, { silent = false } = {}) {
    if (!silent) {
        console.log('\n', cmd);
    }

    try {
        const output = execSync(cmd, { encoding: 'utf-8' });
        if (!silent) {
            console.log('\n', output);
        }
        return output;
    } catch (e) {
        console.log('\n', e.message);
        console.log(e.stdout);
    }
}
