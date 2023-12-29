import { execSync } from 'child_process';
import { info, error, bashCommand, bashOutput } from './msg.js';

export function bash(
    cmd: string,
    { silent = false, dryRun = false, cwd = process.cwd(), allowThrow = false } = {}
): string {
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
    } catch (e: any) {
        error(e.message);
        // console.log(e.stdout);

        if (allowThrow) {
            throw e;
        }

        return e.stdout;
    }
}
