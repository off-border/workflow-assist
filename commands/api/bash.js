import { execSync } from 'child_process';
import { msg } from './msg.js';

export function bash(cmd) {
    msg(cmd);
    return execSync(cmd, { encoding: 'utf-8' });
}
