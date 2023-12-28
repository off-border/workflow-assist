import { bash } from './bash.js';


function branchExists(branchName: string, { cwd = process.cwd() }): boolean {
    return bash(`git branch --list ${branchName}`, { cwd })?.trim() !== '';
}

export {
    branchExists,
}