import { bash } from './bash.js';


function branchExists(branchName: string, { cwd = process.cwd() }): boolean {
    return bash(`git branch --list ${branchName}`, { cwd })?.trim() !== '';
}

function getCurrentBranch({ cwd = process.cwd() } = {}) {
    return bash(`git branch --show-current`, { cwd });
}

export {
    branchExists,
    getCurrentBranch,
}